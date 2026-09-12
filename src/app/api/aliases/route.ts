import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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
    const { alias, playerId, status } = await req.json();

    const updated = await prisma.playerAlias.upsert({
      where: { alias: alias.toUpperCase() },
      update: {
        playerId,
        status: status || "APPROVED",
        approvedBy: "Admin",
      },
      create: {
        alias: alias.toUpperCase(),
        playerId,
        status: status || "APPROVED",
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
