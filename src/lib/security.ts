import { ParsedScorecard } from "@/types/cricket";
import crypto from "crypto";

/**
 * Security & Anti-Abuse Defense Module
 * 
 * Features:
 * 1. Prompt Injection Neutralization (Strips jailbreak delimiters and instruction-override phrases)
 * 2. Strict Input Sanitization & Bounds Checking (Player names, team names, match titles, ball tokens)
 * 3. In-Memory Sliding-Window Rate Limiting ($0 Cost & Denial of Wallet Protection)
 * 4. Administrative Authorization Guard (x-admin-key verification for destructive operations)
 * 5. SSRF Domain Allowlist (Blocks internal IP fetches from image route)
 * 6. Path Traversal Sanitizer (Prevents directory escape in file-serving routes)
 */

// Known prompt injection and LLM boundary attack markers
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+|previous\s+|prior\s+|above\s+|system\s+)?instructions/i,
  /disregard\s+(all\s+|previous\s+|prior\s+|above\s+)?instructions/i,
  /system\s*prompt\s*override/i,
  /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|unfiltered|jailbroken)/i,
  /\[inst\]|\[\/inst\]|<<sys>>|<\/sys>>|<\|im_start\|>|<\|im_end\|>/i,
  /---(begin|end)\s+(system|instruction|prompt)---/i,
  /output\s+your\s+(initial|system)\s+prompt/i,
  /repeat\s+(everything|the\s+above\s+text)/i,
  /\bexec\s*\(/i,
  /\beval\s*\(/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/i,
  /onload\s*=/i,
  /onerror\s*=/i,
];

/**
 * Detects if a string contains known prompt injection or attack markers
 */
export function detectPromptInjection(text: string | undefined | null): { isInjected: boolean; reason?: string } {
  if (!text || typeof text !== "string") {
    return { isInjected: false };
  }

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isInjected: true,
        reason: `Matched security filter pattern: ${pattern.toString()}`,
      };
    }
  }

  return { isInjected: false };
}

/**
 * Sanitizes a general string: strips HTML tags, control characters, null bytes,
 * prompt injection delimiters, and clamps length.
 */
export function sanitizeString(input: string | undefined | null, maxLength: number = 100): string {
  if (!input || typeof input !== "string") return "";

  let cleaned = input
    // Remove null bytes and control chars
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Strip HTML script and style blocks including contents
    .replace(/<script\b[\s\S]*?(?:<\/script>|$)/gi, "")
    .replace(/<style\b[\s\S]*?(?:<\/style>|$)/gi, "")
    .replace(/<!--[\s\S]*?(?:-->|$)/g, "")
    // Strip any remaining HTML tags
    .replace(/<[^>]*>?/gm, "")
    // Neutralize prompt injection delimiters
    .replace(/\[\/?inst\]/gi, "")
    .replace(/<\/?sys>>/gi, "")
    .replace(/<\|im_(start|end)\|>/gi, "")
    .replace(/---(begin|end)[^-]*---/gi, "")
    .trim();

  // Neutralize instruction override phrases by replacing with neutral placeholder
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[sanitized]");
  }

  // Enforce max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim();
  }

  return cleaned;
}

/**
 * Sanitizes a player name (strictly characters, spaces, hyphens, periods, apostrophes, max 35 chars)
 */
export function sanitizePlayerName(name: string | undefined | null): string {
  if (!name || typeof name !== "string") return "";
  const cleaned = sanitizeString(name, 35);
  // Keep only letters, numbers, spaces, hyphens, dots, apostrophes
  return cleaned.replace(/[^\w\s\.\-']/gi, "").replace(/\s+/g, " ").trim();
}

/**
 * Sanitizes a team name (max 40 chars)
 */
export function sanitizeTeamName(teamName: string | undefined | null): string {
  if (!teamName || typeof teamName !== "string") return "Team";
  const cleaned = sanitizeString(teamName, 40);
  return cleaned.replace(/[^\w\s\.\-&']/gi, "").replace(/\s+/g, " ").trim() || "Team";
}

/**
 * Sanitizes a match title (max 80 chars)
 */
export function sanitizeMatchTitle(title: string | undefined | null): string {
  if (!title || typeof title !== "string") return "Indoor Cricket Match";
  const cleaned = sanitizeString(title, 80);
  return cleaned.replace(/[^\w\s\.\-&'(),_]/gi, "").replace(/\s+/g, " ").trim() || "Indoor Cricket Match";
}

/**
 * Sanitizes an indoor cricket ball token (max 6 chars, alphanumeric and standard brackets)
 */
export function sanitizeBallToken(token: string | undefined | null): string {
  if (!token || typeof token !== "string") return "0";
  const sanitized = sanitizeString(token, 20);
  const trimmed = sanitized.trim().toUpperCase();
  // Only valid indoor cricket characters: digits, W, NB, R, O, B, C, S, T, L, (, ), -, +
  const cleaned = trimmed.replace(/[^0-9WNBROBCST\(\)\-\+]/g, "").slice(0, 6);
  return cleaned || "0";
}

/**
 * Deeply sanitizes an entire ParsedScorecard payload
 * Protects database and LLM generation pipelines against injected payloads
 */
export function sanitizeScorecardPayload(scorecard: ParsedScorecard): ParsedScorecard {
  if (!scorecard) return scorecard;

  const clone: ParsedScorecard = JSON.parse(JSON.stringify(scorecard));

  // 1. Sanitize Match Info
  if (clone.matchInfo) {
    clone.matchInfo.title = sanitizeMatchTitle(clone.matchInfo.title);
    if (clone.matchInfo.umpire) {
      clone.matchInfo.umpire = sanitizePlayerName(clone.matchInfo.umpire);
    }
  }

  // Helper to sanitize an innings structure
  const sanitizeInnings = (innings: any) => {
    if (!innings) return;
    innings.teamName = sanitizeTeamName(innings.teamName);

    // Sanitize Skins
    (innings.skins || []).forEach((skin: any) => {
      if (skin.batter1Name) skin.batter1Name = sanitizePlayerName(skin.batter1Name);
      if (skin.batter2Name) skin.batter2Name = sanitizePlayerName(skin.batter2Name);

      (skin.overs || []).forEach((over: any) => {
        if (over.bowlerName) over.bowlerName = sanitizePlayerName(over.bowlerName);
        (over.balls || []).forEach((ball: any) => {
          if (ball.rawToken) ball.rawToken = sanitizeBallToken(ball.rawToken);
          if (ball.batterName) ball.batterName = sanitizePlayerName(ball.batterName);
          if (ball.bowlerName) ball.bowlerName = sanitizePlayerName(ball.bowlerName);

          // Numeric sanity clamps
          ball.runs = typeof ball.runs === "number" ? Math.max(-10, Math.min(20, ball.runs)) : 0;
          ball.penaltyRuns = typeof ball.penaltyRuns === "number" ? Math.max(-10, Math.min(0, ball.penaltyRuns)) : 0;
          ball.netRuns = (ball.runs || 0) + (ball.penaltyRuns || 0);
        });
      });
    });

    // Sanitize Player Summaries
    (innings.playerSummaries || []).forEach((p: any) => {
      if (p.name) p.name = sanitizePlayerName(p.name);
      if (p.canonicalName) p.canonicalName = sanitizePlayerName(p.canonicalName);
      p.runsScored = typeof p.runsScored === "number" ? Math.max(-50, Math.min(150, p.runsScored)) : 0;
      p.runsConceded = typeof p.runsConceded === "number" ? Math.max(-20, Math.min(100, p.runsConceded)) : 0;
      p.oversBowled = typeof p.oversBowled === "number" ? Math.max(0, Math.min(4, p.oversBowled)) : 0;
      p.wickets = typeof p.wickets === "number" ? Math.max(0, Math.min(12, p.wickets)) : 0;
    });
  };

  sanitizeInnings(clone.homeInnings);
  sanitizeInnings(clone.awayInnings);

  return clone;
}

// -------------------------------------------------------------
// In-Memory Rate Limiter (Sliding Window)
// Protects against Denial of Service and LLM Denial of Wallet ($0 Budget Protection)
// -------------------------------------------------------------

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Periodically purge stale rate limit records every 5 minutes to prevent memory leaks
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Enforces sliding window rate limit for an identifier (e.g. IP + endpoint)
 * 
 * @param key Unique key, e.g. "upload:192.168.1.1"
 * @param maxLimit Maximum allowed requests in the time window
 * @param windowSeconds Window length in seconds
 */
export function checkRateLimit(
  key: string,
  maxLimit: number = 60,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxLimit - 1, resetTime: resetAt };
  }

  if (existing.count >= maxLimit) {
    return { allowed: false, remaining: 0, resetTime: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: maxLimit - existing.count,
    resetTime: existing.resetAt,
  };
}

// -------------------------------------------------------------
// Admin Key Verification (Hardened)
// Protects destructive administrative routes (/api/admin/purge, alias edits, match approval)
// SECURITY: No hardcoded fallback — fails closed if ADMIN_SECRET_KEY env is unset.
// SECURITY: Uses crypto.timingSafeEqual to prevent timing side-channel attacks.
// SECURITY: Query parameter authentication removed (leaks secrets in logs/history).
// -------------------------------------------------------------

export function verifyAdminKey(req: Request): boolean {
  const secretKey = process.env.ADMIN_SECRET_KEY;

  // Fail-closed: if no secret is configured, deny all admin operations
  if (!secretKey) {
    console.error("[SECURITY] ADMIN_SECRET_KEY environment variable is not set. All admin operations denied.");
    return false;
  }

  // Check x-admin-key header or Authorization: Bearer <key>
  const headerKey = req.headers.get("x-admin-key") || req.headers.get("authorization")?.replace("Bearer ", "");

  if (!headerKey) {
    return false;
  }

  // Timing-safe comparison to prevent timing side-channel attacks
  try {
    const keyBuffer = Buffer.from(headerKey, "utf-8");
    const secretBuffer = Buffer.from(secretKey, "utf-8");

    // timingSafeEqual requires equal-length buffers; pad shorter one
    if (keyBuffer.length !== secretBuffer.length) {
      // Hash both to fixed length for constant-time comparison
      const keyHash = crypto.createHash("sha256").update(keyBuffer).digest();
      const secretHash = crypto.createHash("sha256").update(secretBuffer).digest();
      return crypto.timingSafeEqual(keyHash, secretHash);
    }

    return crypto.timingSafeEqual(keyBuffer, secretBuffer);
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// SSRF Domain Allowlist
// Prevents server-side request forgery when fetching remote scorecard images
// -------------------------------------------------------------

const ALLOWED_REMOTE_DOMAINS = [
  "desisports.milanchheda.com",
  "desisports.onrender.com",
];

const PRIVATE_IP_PATTERNS = [
  /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3})/,         // 10.0.0.0/8
  /^(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})/, // 172.16.0.0/12
  /^(192\.168\.\d{1,3}\.\d{1,3})/,             // 192.168.0.0/16
  /^(127\.\d{1,3}\.\d{1,3}\.\d{1,3})/,         // 127.0.0.0/8 (loopback)
  /^(169\.254\.\d{1,3}\.\d{1,3})/,             // 169.254.0.0/16 (link-local / cloud metadata)
  /^(0\.0\.0\.0)/,                              // 0.0.0.0
  /^\[?::1\]?/,                                 // IPv6 loopback
  /^\[?fe80:/i,                                 // IPv6 link-local
  /^\[?fc00:/i,                                 // IPv6 unique-local
  /^\[?fd/i,                                    // IPv6 unique-local
  /^localhost/i,                                 // localhost
];

/**
 * Validates that a URL is safe for server-side fetching (not an SSRF vector).
 * Only allows HTTPS URLs to explicitly allowlisted domains.
 */
export function isAllowedRemoteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow HTTPS (block HTTP for MITM protection)
    if (parsed.protocol !== "https:") {
      return false;
    }

    // Block private/internal IP addresses
    const hostname = parsed.hostname;
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return false;
      }
    }

    // Only allow explicitly allowlisted domains
    return ALLOWED_REMOTE_DOMAINS.includes(hostname.toLowerCase());
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// Path Traversal Sanitizer
// Prevents directory escape in file-serving API routes
// -------------------------------------------------------------

/**
 * Sanitizes an ID parameter for use in filesystem paths.
 * Strips all characters except alphanumeric, hyphens, underscores, and dots.
 * Blocks path traversal sequences (../, ..\, etc.)
 */
export function sanitizePathId(id: string): string {
  if (!id || typeof id !== "string") return "";

  // Strip everything except safe filesystem characters
  let cleaned = id.replace(/[^a-zA-Z0-9_\-\.]/g, "");

  // Block any remaining traversal patterns
  cleaned = cleaned.replace(/\.\./g, "");

  // Prevent hidden files
  if (cleaned.startsWith(".")) {
    cleaned = cleaned.replace(/^\.+/, "");
  }

  return cleaned;
}

