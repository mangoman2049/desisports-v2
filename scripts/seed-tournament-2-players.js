const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Tournament 2 player & alias seeding...");

  // 1. Ensure Teams exist by name
  const teamsData = [
    { name: "Desi Titans", code: "DTT" },
    { name: "Desi Dabanggs", code: "DDB" },
    { name: "Desi Tigers", code: "DTG" },
    { name: "Desi Challengers", code: "DCH" },
  ];

  for (const t of teamsData) {
    const existing = await prisma.team.findUnique({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.team.create({
        data: { name: t.name, code: t.code },
      });
      console.log(`Created team: ${t.name}`);
    } else {
      console.log(`Team already exists: ${t.name} (id: ${existing.id})`);
    }
  }

  // Also ensure "DesiBoys Bazooka 4.0" tournament with id 2 exists
  const t2Tournament = await prisma.tournament.findUnique({
    where: { id: 2 },
  });
  if (!t2Tournament) {
    await prisma.tournament.create({
      data: {
        id: 2,
        name: "DesiBoys Bazooka 4.0",
        status: "YET_TO_START",
      },
    });
    console.log("Created Tournament 2 in DB");
  }

  // 2. Load tournament_2_data.json
  const t2Path = path.join(__dirname, "..", "prisma", "tournament_2_data.json");
  const t2Data = JSON.parse(fs.readFileSync(t2Path, "utf-8"));

  let seededCount = 0;
  let aliasCount = 0;

  for (const squad of t2Data.squads || []) {
    const teamName = squad.team;
    console.log(`Processing squad: ${teamName} (${squad.players.length} players)`);

    for (const p of squad.players) {
      const pId = parseInt(p.id, 10);
      const isCaptain = !!p.isCaptain;

      const tags = isCaptain ? ["Captain", "Tournament 2 Registered"] : ["Squad Member", "Tournament 2 Registered"];
      const notes = `Registered player for ${teamName} in DesiBoys Bazooka 4.0.`;

      // Upsert player
      await prisma.player.upsert({
        where: { id: pId },
        update: {
          canonicalName: p.name,
          avatarUrl: p.avatar || undefined,
        },
        create: {
          id: pId,
          canonicalName: p.name,
          battingHand: "Right Hand",
          bowlingStyle: "Right Arm Medium",
          fieldingPosition: isCaptain ? "Captain" : "Cover",
          captainTags: JSON.stringify(tags),
          fuzzyVariants: JSON.stringify([p.name, p.name.split(" ")[0]]),
          notes: notes,
          avatarUrl: p.avatar || null,
        },
      });
      seededCount++;

      // Populate PlayerAlias entries so OCR match never fails
      const aliasesToCreate = new Set();
      aliasesToCreate.add(p.name); // Full canonical name
      aliasesToCreate.add(p.name.toLowerCase()); // Lowercase
      
      const parts = p.name.trim().split(/\s+/);
      if (parts.length > 1) {
        aliasesToCreate.add(parts[0]); // First name
        aliasesToCreate.add(parts[0].toLowerCase());
        aliasesToCreate.add(`${parts[0]} ${parts[parts.length - 1][0]}`); // E.g. "Ritesh M"
        aliasesToCreate.add(`${parts[0]} ${parts[parts.length - 1][0]}.`); // E.g. "Ritesh M."
      }

      for (const alias of aliasesToCreate) {
        // Check if alias already exists
        const existing = await prisma.playerAlias.findFirst({
          where: { alias: alias },
        });
        if (!existing) {
          try {
            await prisma.playerAlias.create({
              data: {
                alias: alias,
                playerId: pId,
                confidence: 1.0,
                status: "APPROVED",
                approvedBy: "System Seeder (T2 Roster)",
              },
            });
            aliasCount++;
          } catch (err) {
            // Ignore if collision occurs
          }
        }
      }
    }
  }

  console.log(`Successfully seeded/verified ${seededCount} players and created ${aliasCount} new aliases!`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
