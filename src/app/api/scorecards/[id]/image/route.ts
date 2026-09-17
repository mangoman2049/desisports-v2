import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { preprocessScorecardImage } from "@/lib/image-preprocessor";
import { isAllowedRemoteUrl } from "@/lib/security";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  const searchParams = request.nextUrl.searchParams;
  const download = searchParams.get("download") === "true";
  const format = searchParams.get("format") || "webp";

  const scorecardDir = path.join(process.cwd(), "public", "uploads", "scorecards");
  const cachedWebpPath = path.join(scorecardDir, `scorecard-${id}.webp`);

  try {
    // 1. If WebP is requested and already cached on disk, serve directly
    if (format === "webp" && fs.existsSync(cachedWebpPath)) {
      const fileBuffer = await fs.promises.readFile(cachedWebpPath);
      const headers: Record<string, string> = {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      };
      if (download) {
        headers["Content-Disposition"] = `attachment; filename="scorecard-${id}.webp"`;
      }
      return new NextResponse(fileBuffer, { status: 200, headers });
    }

    // 2. Resolve image source URL or local path (DB-driven, no hardcoded map)
    let sourceUrlOrPath: string | undefined = undefined;

    // Check Prisma Match if numeric
    const matchNum = parseInt(id, 10);
    if (!isNaN(matchNum)) {
      try {
        const match = await prisma.match.findUnique({
          where: { id: matchNum },
          select: { scorecardUrl: true },
        });
        if (
          match?.scorecardUrl &&
          !match.scorecardUrl.includes("/review") &&
          !match.scorecardUrl.startsWith("/matches/")
        ) {
          sourceUrlOrPath = match.scorecardUrl;
        }
      } catch {}
    }

    // Check Prisma ScorecardUpload if not numeric or not found
    if (!sourceUrlOrPath) {
      try {
        const upload = await prisma.scorecardUpload.findUnique({
          where: { id },
          select: { imageUrl: true },
        });
        if (upload?.imageUrl) {
          sourceUrlOrPath = upload.imageUrl;
        }
      } catch {}
    }

    // Check direct local files
    if (!sourceUrlOrPath) {
      const localCandidates = [
        path.join(scorecardDir, `scorecard-${id}.webp`),
        path.join(scorecardDir, `${id}.webp`),
        path.join(scorecardDir, `${id}.jpg`),
        path.join(scorecardDir, `${id}.png`),
      ];
      for (const cand of localCandidates) {
        if (fs.existsSync(cand)) {
          sourceUrlOrPath = cand;
          break;
        }
      }
    }

    // Generic fallback — no match-specific hardcoding
    if (!sourceUrlOrPath) {
      sourceUrlOrPath = "/uploads/scorecards/sample-scorecard.jpg";
    }

    // 3. Obtain raw image buffer
    let rawBuffer: Buffer;
    if (sourceUrlOrPath.startsWith("data:image/")) {
      const commaIdx = sourceUrlOrPath.indexOf(",");
      const b64 = commaIdx >= 0 ? sourceUrlOrPath.substring(commaIdx + 1) : sourceUrlOrPath;
      rawBuffer = Buffer.from(b64, "base64");

      // If already WebP from client preprocessor, serve directly for speed
      if (sourceUrlOrPath.startsWith("data:image/webp")) {
        const headers: Record<string, string> = {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        };
        if (download) {
          headers["Content-Disposition"] = `attachment; filename="scorecard-${id}.webp"`;
        }
        return new NextResponse(new Uint8Array(rawBuffer), { status: 200, headers });
      }
    } else if (sourceUrlOrPath.startsWith("http://") || sourceUrlOrPath.startsWith("https://")) {
      // SEC-07: SSRF Protection — only fetch from allowlisted domains
      if (!isAllowedRemoteUrl(sourceUrlOrPath)) {
        console.warn(`[SECURITY] Blocked SSRF attempt to fetch: ${sourceUrlOrPath}`);
        throw new Error("Remote URL is not in the allowed domain list");
      }
      const resp = await fetch(sourceUrlOrPath);
      if (!resp.ok) {
        throw new Error(`Failed to fetch remote scorecard image: ${resp.statusText}`);
      }
      const arrayBuf = await resp.arrayBuffer();
      rawBuffer = Buffer.from(arrayBuf);
    } else {
      // Local path or URL starting with /uploads
      let diskPath = sourceUrlOrPath;
      if (sourceUrlOrPath.startsWith("/")) {
        diskPath = path.join(process.cwd(), "public", sourceUrlOrPath);
      }
      if (!fs.existsSync(diskPath)) {
        diskPath = path.join(process.cwd(), "public", "uploads", "scorecards", "sample-scorecard.jpg");
      }
      rawBuffer = await fs.promises.readFile(diskPath);
    }

    // 4. Crop to paper boundaries, convert to grayscale, normalize contrast, and generate WebP Q75
    let webpBuffer: Buffer;
    try {
      const preprocessRes = await preprocessScorecardImage(rawBuffer);
      webpBuffer = preprocessRes.buffer;
    } catch {
      // If preprocessing fails on raw buffer, use rawBuffer directly
      webpBuffer = rawBuffer;
    }

    // Cache the WebP buffer for future requests
    try {
      if (!fs.existsSync(scorecardDir)) {
        fs.mkdirSync(scorecardDir, { recursive: true });
      }
      await fs.promises.writeFile(cachedWebpPath, webpBuffer);
    } catch (e) {
      console.warn("Could not cache WebP to disk:", e);
    }

    const headers: Record<string, string> = {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    };
    if (download) {
      headers["Content-Disposition"] = `attachment; filename="scorecard-${id}.webp"`;
    }

    return new NextResponse(new Uint8Array(webpBuffer), { status: 200, headers });
  } catch (err: any) {
    console.error("Scorecard image route error, returning sample fallback:", err);
    try {
      const fallbackFilename = "sample-scorecard.jpg";
      const samplePath = path.join(process.cwd(), "public", "uploads", "scorecards", fallbackFilename);
      if (fs.existsSync(samplePath)) {
        const sampleBuf = await fs.promises.readFile(samplePath);
        return new NextResponse(new Uint8Array(sampleBuf), {
          status: 200,
          headers: {
            "Content-Type": fallbackFilename.endsWith(".webp") ? "image/webp" : "image/jpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch {}
    return NextResponse.json({ error: err.message || "Failed to load scorecard image" }, { status: 500 });
  }
}
