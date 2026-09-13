import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/security";

/**
 * Known aggressive automated scrapers & extraction tools
 */
const BLOCKED_SCRAPER_USER_AGENTS = [
  /python-requests/i,
  /aiohttp/i,
  /scrapy/i,
  /bytespider/i,
  /ccbot/i,
  /gptbot/i,
  /claude-web/i,
  /anthropic-ai/i,
  /diffbot/i,
  /facebookexternalhit/i,
  /headlesschrome/i,
  /phantomjs/i,
];

/**
 * Global Edge Security Middleware
 * 
 * 1. Blocks automated scrapers and bots on sensitive API endpoints
 * 2. Enforces strict IP rate limiting to prevent Denial of Wallet ($0 hosting budget)
 * 3. Injects rate limit observability headers
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply strict protection to API endpoints
  if (pathname.startsWith("/api/")) {
    const userAgent = request.headers.get("user-agent") || "";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. Anti-Scraper User-Agent Filter on API endpoints
    for (const pattern of BLOCKED_SCRAPER_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        return new NextResponse(
          JSON.stringify({
            error: "Automated scraping of API endpoints is restricted.",
            code: "BOT_ACCESS_DENIED",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              "X-Security-Policy": "Anti-Scraping-Active",
            },
          }
        );
      }
    }

    // 2. Sliding Window Rate Limiting (Protects $0 Budget)
    let maxLimit = 60; // Standard API limit: 60 req/min
    let windowSeconds = 60;

    // Strict throttle on heavy / AI-calling endpoints
    const isSensitiveAIEndpoint =
      pathname.startsWith("/api/captain/ai-brief") ||
      pathname.startsWith("/api/scorecards/upload") ||
      pathname.startsWith("/api/admin/purge");

    if (isSensitiveAIEndpoint) {
      maxLimit = 8; // Max 8 requests per minute
      windowSeconds = 60;
    }

    const rateLimitKey = `${pathname}:${ip}`;
    const rateCheck = checkRateLimit(rateLimitKey, maxLimit, windowSeconds);

    if (!rateCheck.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rateCheck.resetTime - Date.now()) / 1000));
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait before retrying.",
          code: "TOO_MANY_REQUESTS",
          retryAfterSeconds: retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(maxLimit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateCheck.resetTime),
          },
        }
      );
    }

    // Pass through with rate limit response headers
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(maxLimit));
    response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateCheck.resetTime));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
