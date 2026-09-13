import { NextRequest, NextResponse } from "next/server";
import { ParsedScorecard } from "@/types/cricket";
import { commitScorecardAsApprovedMatch } from "@/lib/match-committer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const uploadId = resolvedParams.id;
    const body = await req.json();
    const parsed: ParsedScorecard = body.parsedScorecard;
    const reviewerNotes = body.reviewerNotes || "Approved via Maker-Checker";

    if (!parsed) {
      return NextResponse.json(
        { success: false, error: "No parsedScorecard provided in request body." },
        { status: 400 }
      );
    }

    const { matchId, validation } = await commitScorecardAsApprovedMatch({
      uploadId,
      parsedScorecard: parsed,
      reviewerNotes,
    });

    return NextResponse.json({
      success: true,
      matchId,
      message: "Scorecard revision approved and match committed successfully.",
      validation,
    });
  } catch (err: any) {
    console.error("Scorecard approval error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to approve scorecard" },
      { status: 500 }
    );
  }
}
