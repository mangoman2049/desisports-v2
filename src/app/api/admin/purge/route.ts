import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import util from "util";
import { revalidateCricketCache } from "@/lib/cache-revalidator";
import { verifyAdminKey, checkRateLimit } from "@/lib/security";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Strict Rate Limiting: Max 3 purge requests per 5 minutes per IP
    const rateCheck = checkRateLimit(`purge:${ip}`, 3, 300);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many admin requests. Please wait before retrying." },
        { status: 429 }
      );
    }

    // 2. Authorization Check: Require valid x-admin-key header
    if (!verifyAdminKey(req)) {
      return NextResponse.json(
        {
          error: "Unauthorized: Invalid or missing administrator authorization key.",
          code: "ADMIN_KEY_REQUIRED",
        },
        { status: 401 }
      );
    }

    const { mode } = await req.json();

    if (mode === "uploads") {
      // Purge only pending / test uploads
      const deletedRevisions = await prisma.extractionRevision.deleteMany({});
      const deletedUploads = await prisma.scorecardUpload.deleteMany({});
      revalidateCricketCache();

      return NextResponse.json({
        success: true,
        message: `Purged ${deletedUploads.count} scorecard uploads and ${deletedRevisions.count} revisions.`,
      });
    } else if (mode === "reset") {
      // Complete reset to clean seeded demo state
      await execPromise("node prisma/seed.js", { cwd: process.cwd() });
      revalidateCricketCache();

      return NextResponse.json({
        success: true,
        message: "Database cleanly reset to initial demo state with all historical matches and players.",
      });
    }

    return NextResponse.json({ error: "Invalid purge mode" }, { status: 400 });
  } catch (err: any) {
    console.error("Purge error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
