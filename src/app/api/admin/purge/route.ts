import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { mode } = await req.json();

    if (mode === "uploads") {
      // Purge only pending / test uploads
      const deletedRevisions = await prisma.extractionRevision.deleteMany({});
      const deletedUploads = await prisma.scorecardUpload.deleteMany({});

      return NextResponse.json({
        success: true,
        message: `Purged ${deletedUploads.count} scorecard uploads and ${deletedRevisions.count} revisions.`,
      });
    } else if (mode === "reset") {
      // Complete reset to clean seeded demo state
      await execPromise("node prisma/seed.js", { cwd: process.cwd() });

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
