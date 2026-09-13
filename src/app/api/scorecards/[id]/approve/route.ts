import { NextRequest, NextResponse } from "next/server";
import { ParsedScorecard } from "@/types/cricket";
import { commitScorecardAsApprovedMatch } from "@/lib/match-committer";
import {
  sanitizeScorecardPayload,
  sanitizeString,
  checkRateLimit,
} from "@/lib/security";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate Limiting: Max 10 approval operations per minute per IP
    const rateCheck = checkRateLimit(`approve:${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Approval rate limit reached. Please wait a moment before retrying.",
          code: "TOO_MANY_REQUESTS",
        },
        { status: 429 }
      );
    }

    const resolvedParams = await Promise.resolve(params);
    const uploadId = sanitizeString(resolvedParams.id, 40);
    const body = await req.json().catch(() => ({}));
    const rawParsed: ParsedScorecard = body.parsedScorecard;
    const rawReviewerNotes = body.reviewerNotes || "Approved via Maker-Checker";

    if (!rawParsed) {
      return NextResponse.json(
        { success: false, error: "No parsedScorecard provided in request body." },
        { status: 400 }
      );
    }

    // 2. Strict Input & Payload Sanitization (Strips prompt injection and script tags)
    const parsedScorecard = sanitizeScorecardPayload(rawParsed);
    const reviewerNotes = sanitizeString(rawReviewerNotes, 250);

    const { matchId, validation } = await commitScorecardAsApprovedMatch({
      uploadId,
      parsedScorecard,
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
