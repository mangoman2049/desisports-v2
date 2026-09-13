import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeTeamName,
  sanitizeString,
  detectPromptInjection,
  checkRateLimit,
} from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Rate Limiting: Max 6 AI briefing generations per minute per IP ($0 Budget Guard)
    const rateCheck = checkRateLimit(`ai-brief:${ip}`, 6, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Briefing rate limit exceeded. Please wait a moment before generating another briefing.",
          code: "TOO_MANY_REQUESTS",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const rawTeamName = body?.teamName || "Desi Tigers";
    const rawTournamentName = body?.tournamentName || "Desi Boys Tournament May 2026";
    const rawKeyStats = Array.isArray(body?.keyStats) ? body.keyStats.slice(0, 8) : [];

    // 2. Prompt Injection Neutralization & Input Bounds Checking
    const teamInjection = detectPromptInjection(rawTeamName);
    const tournamentInjection = detectPromptInjection(rawTournamentName);

    if (teamInjection.isInjected || tournamentInjection.isInjected) {
      console.warn("[Security] Prompt injection attempt blocked in captain brief:", {
        team: rawTeamName,
        tournament: rawTournamentName,
      });
      // Fall back directly to default safe briefing ($0 token spend, zero LLM compromise)
      return NextResponse.json({
        brief: getDefaultBrief("Desi Tigers"),
        securityNotice: "Input sanitized against prompt injection patterns.",
      });
    }

    const safeTeam = sanitizeTeamName(rawTeamName);
    const safeTournament = sanitizeString(rawTournamentName, 60);

    // Sanitize stats elements to prevent JSON format string exploits
    const cleanKeyStats = rawKeyStats.map((item: any) => ({
      title: sanitizeString(item?.title, 50),
      description: sanitizeString(item?.description, 150),
      value: sanitizeString(String(item?.value || ""), 20),
    }));

    const apiBase = process.env.LITELLM_API_BASE || "http://localhost:4000";
    const apiKey = process.env.LITELLM_API_KEY || "";
    const model = process.env.VISION_MODEL || "gpt-4o-mini";

    // 3. Conditional LLM Execution with Strict Timeout & Max Tokens
    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s abort limit

        const prompt = `You are a high-level indoor cricket tactical analyst advising the captain of ${safeTeam} in ${safeTournament}.
Based on these statistics:
${JSON.stringify(cleanKeyStats, null, 2)}

Provide a concise, 4-point tactical captain's memo.
Cover: 1) Skin order optimization, 2) Bowling allocation against opponent threats, 3) Dismissal penalty mitigation (-5 run risk), 4) High-leverage player matchup. Format with bullet points and bold player names. Keep it punchy and evidence-led.`;

        const response = await fetch(`${apiBase}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            max_tokens: 500, // Strict token limit to prevent bill overruns
          }),
        });

        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          const brief = data.choices?.[0]?.message?.content;
          if (brief) {
            // Strip any unexpected HTML or script tags from LLM response
            const sanitizedBrief = sanitizeString(brief, 2500);
            return NextResponse.json({ brief: sanitizedBrief });
          }
        }
      } catch (llmErr) {
        console.warn("[Security] LLM invocation bypassed or timed out; falling back to grounded brief.");
      }
    }

    // 4. Grounded Zero-Dollar Fallback Briefing
    return NextResponse.json({ brief: getDefaultBrief(safeTeam) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

function getDefaultBrief(teamName: string): string {
  return `**Captain's Briefing & Strategic Priorities (${teamName}):**

1. **Batting Order Structure:** Front-load **Deepak & Yash** in Skin 1. Deepak acts as the anchor turning the strike (16 runs, clean rotation) while Yash attacks boundaries (18 runs). Follow with **Narendra & Maneesh** in Skin 2 who possess a 90% survival rate.
2. **Defensive Bowling Allocation:** Reserve **Prateek** and **Arif** for the closing crunch overs (Overs 14, 15, and 16). Prateek's Over 15 dismantled Skin 4 in the last fixture (-8 RC, 2 wickets). Keep **Sunny's** overs restricted to middle-innings against lower-strike batters.
3. **Running Between Wickets:** 54% of all conceded dismissal penalties stem from run outs. Emphasize loud, early calling on tight singles into the leg side.
4. **Key Matchup Alert:** Yash has dismissed Shubham twice in 6 balls. Ensure Yash bowls Over 1 immediately if Shubham opens.`;
}
