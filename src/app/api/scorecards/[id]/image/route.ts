import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

const STATIC_MATCH_SCORECARDS: Record<string, string> = {
  "1": "https://desisports.milanchheda.com/storage/scorecards/iVA2RZBZK6iu9zaGBGZKItLdkqaL4D7uGPGTpKUg.jpg",
  "2": "https://desisports.milanchheda.com/storage/scorecards/ahMNeOGe8h6R3xV5sq5P0Xv7OwneTh1iEySuZ4QG.jpg",
  "3": "https://desisports.milanchheda.com/storage/scorecards/OSxCBhl68FJzczLG5nBPIxsPMKNouscmLC936huM.jpg",
  "4": "https://desisports.milanchheda.com/storage/scorecards/wzkviHxARCTmAmyOnHxyBj86n866Nw2u2wjM7DMT.jpg",
  "5": "https://desisports.milanchheda.com/storage/scorecards/JJ4WJyjlzrzj4wUxrNPRifw8lnqx9RHVFIHOqZh1.jpg",
  "6": "https://desisports.milanchheda.com/storage/scorecards/S9vHrbIiDufP0ER2db9P9KNMAA0KELPojHx15lot.jpg",
  "7": "/uploads/scorecards/sample-scorecard.jpg",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

    // 2. Resolve image source URL or local path
    let sourceUrlOrPath = STATIC_MATCH_SCORECARDS[id];

    // Check Prisma Match if numeric
    const matchNum = parseInt(id, 10);
    if (!isNaN(matchNum)) {
      try {
        const match = await prisma.match.findUnique({
          where: { id: matchNum },
          select: { scorecardUrl: true },
        });
        if (match?.scorecardUrl && !match.scorecardUrl.includes("/review")) {
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

    // Fallback to sample scorecard
    if (!sourceUrlOrPath) {
      sourceUrlOrPath = "/uploads/scorecards/sample-scorecard.jpg";
    }

    // 3. Obtain raw image buffer
    let rawBuffer: Buffer;
    if (sourceUrlOrPath.startsWith("http://") || sourceUrlOrPath.startsWith("https://")) {
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

    // 4. Convert to WebP using Sharp at Q75 and max 1800px bounding box
    const webpBuffer = await sharp(rawBuffer)
      .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

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

    return new NextResponse(webpBuffer, { status: 200, headers });
  } catch (err: any) {
    console.error("Scorecard image route error:", err);
    return NextResponse.json({ error: err.message || "Failed to load scorecard image" }, { status: 500 });
  }
}
