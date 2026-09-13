import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizePlayerName, checkRateLimit } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateCheck = checkRateLimit(`aliases-get:${ip}`, 60, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const aliases = await prisma.playerAlias.findMany({
      include: {
        player: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const players = await prisma.player.findMany({
      select: { id: true, canonicalName: true },
      orderBy: { canonicalName: "asc" },
    });

    return NextResponse.json({ aliases, players });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Rate limit alias mutations
    const rateCheck = checkRateLimit(`aliases-post:${ip}`, 20, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const rawAlias = body?.alias;
    const playerId = typeof body?.playerId === "number" ? body.playerId : parseInt(body?.playerId, 10);
    const rawStatus = body?.status;

    if (!rawAlias || isNaN(playerId) || playerId <= 0) {
      return NextResponse.json(
        { error: "Invalid payload. 'alias' string and positive 'playerId' required." },
        { status: 400 }
      );
    }

    const safeAlias = sanitizePlayerName(rawAlias).toUpperCase();
    if (!safeAlias) {
      return NextResponse.json({ error: "Alias contains invalid characters" }, { status: 400 });
    }

    const validStatuses = ["APPROVED", "PENDING", "REJECTED"];
    const safeStatus = validStatuses.includes(rawStatus) ? rawStatus : "APPROVED";

    const updated = await prisma.playerAlias.upsert({
      where: { alias: safeAlias },
      update: {
        playerId,
        status: safeStatus,
        approvedBy: "Admin",
      },
      create: {
        alias: safeAlias,
        playerId,
        status: safeStatus,
        approvedBy: "Admin",
        confidence: 1.0,
      },
      include: { player: true },
    });

    return NextResponse.json({ success: true, alias: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
