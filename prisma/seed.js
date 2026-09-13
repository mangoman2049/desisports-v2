const { PrismaClient } = require("@prisma/client");
const tournament1Data = require("./tournament_1_data.json");
const tournament2Data = require("./tournament_2_data.json");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DesiSports V2 database with complete tournament rosters and players...");

  const shouldForceReset = process.env.FORCE_RESET === "true";
  if (shouldForceReset) {
    console.log("FORCE_RESET=true: Cleaning existing database tables...");
    await prisma.deliveryEvent.deleteMany();
    await prisma.skin.deleteMany();
    await prisma.innings.deleteMany();
    await prisma.playerMatchStat.deleteMany();
    await prisma.extractionRevision.deleteMany();
    await prisma.scorecardUpload.deleteMany();
    await prisma.match.deleteMany();
    await prisma.playerAlias.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.user.deleteMany();
  } else {
    console.log("Preserving existing matches and uploads (idempotent seed)...");
  }

  // Upsert Users
  await prisma.user.upsert({
    where: { email: "manish.pandey@desisports.com" },
    update: { name: "Manish Pandey", role: "ADMIN" },
    create: {
      email: "manish.pandey@desisports.com",
      name: "Manish Pandey",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "captain@desisports.com" },
    update: { name: "Team Captain", role: "CAPTAIN" },
    create: {
      email: "captain@desisports.com",
      name: "Team Captain",
      role: "CAPTAIN",
    },
  });

  // Upsert Tournaments
  const tournament1 = await prisma.tournament.upsert({
    where: { id: 1 },
    update: { name: "Desi Boys Tournament May 2026", status: "ACTIVE" },
    create: {
      id: 1,
      name: "Desi Boys Tournament May 2026",
      status: "ACTIVE",
    },
  });

  const tournament2 = await prisma.tournament.upsert({
    where: { id: 2 },
    update: { name: "DesiBoys Bazooka 4.0", status: "YET_TO_START" },
    create: {
      id: 2,
      name: "DesiBoys Bazooka 4.0",
      status: "YET_TO_START",
    },
  });

  const tournament0 = await prisma.tournament.upsert({
    where: { id: 0 },
    update: { name: "Desisports Regular Practice", status: "ACTIVE" },
    create: {
      id: 0,
      name: "Desisports Regular Practice",
      status: "ACTIVE",
    },
  });

  // Upsert Teams
  const desiTigers = await prisma.team.upsert({
    where: { name: "DesiTigers" },
    update: { id: 1, code: "DTG" },
    create: { id: 1, name: "DesiTigers", code: "DTG" },
  });
  const vpgrTeam = await prisma.team.upsert({
    where: { name: "VPGR" },
    update: { id: 2, code: "VPG" },
    create: { id: 2, name: "VPGR", code: "VPG" },
  });
  const desiDabanggs = await prisma.team.upsert({
    where: { name: "DesiDabanggs" },
    update: { id: 3, code: "DDB" },
    create: { id: 3, name: "DesiDabanggs", code: "DDB" },
  });
  const desiTitans = await prisma.team.upsert({
    where: { name: "DesiTitans" },
    update: { id: 4, code: "DTT" },
    create: { id: 4, name: "DesiTitans", code: "DTT" },
  });
  const homeTeam = await prisma.team.upsert({
    where: { name: "Home Team" },
    update: { id: 5, code: "HOM" },
    create: { id: 5, name: "Home Team", code: "HOM" },
  });
  const awayTeam = await prisma.team.upsert({
    where: { name: "Away Team" },
    update: { id: 6, code: "AWY" },
    create: { id: 6, name: "Away Team", code: "AWY" },
  });
  const desiChallengers = await prisma.team.upsert({
    where: { name: "Desi Challengers" },
    update: { id: 7, code: "DCH" },
    create: { id: 7, name: "Desi Challengers", code: "DCH" },
  });

  // 1. Seed Manish Pandey (ID 35)
  await prisma.player.upsert({
    where: { id: 35 },
    update: {},
    create: {
      id: 35,
      canonicalName: "Manish Pandey",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Off Spin",
      fieldingPosition: "Cover",
      captainTags: JSON.stringify(["Anchor", "Partnership Builder", "Economical Bowler"]),
      avatarUrl: "https://desisports.milanchheda.com/storage/avatars/manish-pandey.jpg",
      fuzzyVariants: JSON.stringify(["Maneesh Pandey", "Manish P", "M Pandey"]),
      notes: "Disciplined top-order accumulator who prioritizes strike rotation and low-risk indoor cricket ground singles.",
    },
  });

  // 2. Seed Fallback Player "Extra" (ID 999) for unmapped/missing scorecards
  await prisma.player.upsert({
    where: { id: 999 },
    update: {},
    create: {
      id: 999,
      canonicalName: "Extra",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Substitute",
      captainTags: JSON.stringify(["Substitute", "Extra Player"]),
      fuzzyVariants: JSON.stringify(["Extra", "Substitute", "Sub", "Unknown"]),
      notes: "System fallback player profile used for unmapped or guest appearances on scorecards.",
    },
  });

  // 3. Extract and Seed ALL Unique Players from tournament_1_data.json and tournament_2_data.json with exact IDs!
  const playerMap = new Map();
  tournament1Data.squads.forEach((squad) => {
    squad.players.forEach((p) => {
      const id = parseInt(p.id, 10);
      if (!playerMap.has(id) && id !== 35 && id !== 999) {
        playerMap.set(id, {
          id: id,
          canonicalName: p.name,
          team: squad.team,
          avatarUrl: p.avatar || null,
          batting: p.batting || "Right Hand",
          bowling: p.bowling || "Right Arm Medium",
          fielding: p.fielding || "Cover",
        });
      }
    });
  });

  tournament2Data.squads.forEach((squad) => {
    squad.players.forEach((p) => {
      const id = parseInt(p.id, 10);
      if (!playerMap.has(id) && id !== 35 && id !== 999) {
        playerMap.set(id, {
          id: id,
          canonicalName: p.name,
          team: squad.team,
          avatarUrl: p.avatar || null,
          batting: "Right Hand",
          bowling: "Right Arm Medium",
          fielding: p.isCaptain ? "Captain" : "Cover",
        });
      }
    });
  });

  // Hand/bowl styles for tournament players
  const playerStyles = {
    45: { hand: "Right Hand", bowl: "Right Arm Fast", pos: "Mid Off", tags: ["Boundary Hunter", "Finisher"] }, // Prateek Nahar
    53: { hand: "Right Hand", bowl: "Right Arm Medium Fast", pos: "Bowler", tags: ["Strike Bowler", "Boundary Hunter"] }, // Sajid Merchant
    27: { hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Wicket Keeper", tags: ["Anchor", "Control Bowler"] }, // Himanshu Kalyani
    30: { hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", tags: ["Accumulator", "Death Specialist"] }, // Kalrav Shah
    25: { hand: "Right Hand", bowl: "Right Arm Medium Fast", pos: "Point", tags: ["All-Rounder", "Strike Bowler"] }, // Harshal joshi
    5: { hand: "Right Hand", bowl: "Right Arm Fast", pos: "Bowler", tags: ["Strike Bowler", "MVP"] }, // Ankush Goel
    36: { hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Captain", tags: ["Captain", "Control Bowler"] }, // Manthan Shah
    60: { hand: "Right Hand", bowl: "Right Arm Medium", pos: "Mid Wicket", tags: ["Wicket Hunter"] }, // Tejas Shah
    2: { hand: "Right Hand", bowl: "Right Arm Medium", pos: "Wicket Keeper", tags: ["Anchor", "Finals MVP"] }, // Abhishek Agarwal
    14: { hand: "Right Hand", bowl: "Right Arm Fast", pos: "Captain", tags: ["Captain", "Aggressive"] }, // Darshan Mody
    23: { hand: "Right Hand", bowl: "Right Arm Medium", pos: "Captain", tags: ["Captain", "Anchor"] }, // Hardik Desai
    20: { hand: "Right Hand", bowl: "Right Arm Medium Fast", pos: "Wicket Keeper", tags: ["Aggressive", "Boundary Hitter"] }, // Gagandeep Singh
    46: { hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Mid On", tags: ["Playoff MVP", "Finisher"] }, // Preraq Mistry
  };

  for (const [id, p] of playerMap.entries()) {
    const style = playerStyles[id] || {
      hand: p.batting && p.batting !== "—" ? p.batting : "Right Hand",
      bowl: p.bowling && p.bowling !== "—" ? (p.bowling.includes("Arm") ? p.bowling : `Right Arm ${p.bowling}`) : "Right Arm Medium",
      pos: p.fielding && p.fielding !== "—" ? p.fielding : "Cover",
      tags: ["Squad Member"],
    };

    const playerData = {
      id: p.id,
      canonicalName: p.canonicalName,
      battingHand: style.hand,
      bowlingStyle: style.bowl,
      fieldingPosition: style.pos,
      captainTags: JSON.stringify(style.tags),
      avatarUrl: p.avatarUrl,
      fuzzyVariants: JSON.stringify([p.canonicalName, p.canonicalName.split(" ")[0]]),
    };
    await prisma.player.upsert({
      where: { id: p.id },
      update: playerData,
      create: playerData,
    });
  }

  // Seed all unique practice match players who are not in tournament 1 squads
  const practicePlayersToSeed = [
    {
      id: 101,
      canonicalName: "Yash",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium Fast",
      fieldingPosition: "Mid Wicket",
      captainTags: JSON.stringify(["POTM Specialist", "Boundary Striker"]),
      fuzzyVariants: JSON.stringify(["Yash", "Yaash", "Yash P"]),
    },
    {
      id: 102,
      canonicalName: "Deepak",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Off Spin",
      fieldingPosition: "Point",
      captainTags: JSON.stringify(["Anchor", "Economy Bowler"]),
      fuzzyVariants: JSON.stringify(["Deepak", "Dipak", "Deepak P"]),
    },
    {
      id: 103,
      canonicalName: "Akshay",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Mid Off",
      captainTags: JSON.stringify(["Bowler"]),
      fuzzyVariants: JSON.stringify(["Akshay", "Akshay K"]),
    },
    {
      id: 104,
      canonicalName: "Jigar",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Square Leg",
      captainTags: JSON.stringify(["Batter"]),
      fuzzyVariants: JSON.stringify(["Jigar", "Jeegar"]),
    },
    {
      id: 105,
      canonicalName: "Arif",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Cover",
      captainTags: JSON.stringify(["Strike Bowler", "Economy Specialist"]),
      fuzzyVariants: JSON.stringify(["Arif", "Aareef"]),
    },
    {
      id: 106,
      canonicalName: "Sahil A",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Point",
      captainTags: JSON.stringify(["Batter"]),
      fuzzyVariants: JSON.stringify(["Sahil A"]),
    },
    {
      id: 108,
      canonicalName: "Shubham",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Fast",
      fieldingPosition: "Mid On",
      captainTags: JSON.stringify(["Boundary Hunter", "POTM Specialist"]),
      fuzzyVariants: JSON.stringify(["Shubham", "Subham"]),
    },
    {
      id: 109,
      canonicalName: "Narendra",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium Fast",
      fieldingPosition: "Gully",
      captainTags: JSON.stringify(["All-Rounder", "Economy Bowler"]),
      fuzzyVariants: JSON.stringify(["Narendra", "Narender"]),
    },
    {
      id: 110,
      canonicalName: "Viral",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Mid Wicket",
      captainTags: JSON.stringify(["Batter"]),
      fuzzyVariants: JSON.stringify(["Viral"]),
    },
    {
      id: 111,
      canonicalName: "Sunny",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Deep Cover",
      captainTags: JSON.stringify(["Batter"]),
      fuzzyVariants: JSON.stringify(["Sunny"]),
    },
    {
      id: 112,
      canonicalName: "Sahil",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Off Spin",
      fieldingPosition: "Slip",
      captainTags: JSON.stringify(["Economy Bowler", "Spin Specialist"]),
      fuzzyVariants: JSON.stringify(["Sahil"]),
    },
    {
      id: 113,
      canonicalName: "Gagan",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium Fast",
      fieldingPosition: "Wicket Keeper",
      captainTags: JSON.stringify(["All-Rounder", "Boundary Striker"]),
      fuzzyVariants: JSON.stringify(["Gagan"]),
    },
    {
      id: 114,
      canonicalName: "Devang",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium",
      fieldingPosition: "Cover",
      captainTags: JSON.stringify(["All-Rounder"]),
      fuzzyVariants: JSON.stringify(["Devang", "Devang S"]),
    },
  ];

  for (const p of practicePlayersToSeed) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  // Seed All 6 Tournament Matches from tournament_1_data.json
  const tournamentMatchesData = [
    {
      id: 1,
      date: "11 May 2026, 8:00 PM",
      home: vpgrTeam.id,
      away: desiTitans.id,
      hScore: 80,
      aScore: 41,
      hSkins: 3,
      aSkins: 1,
      potm: 5, // Ankush Goel
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/iVA2RZBZK6iu9zaGBGZKItLdkqaL4D7uGPGTpKUg.jpg",
    },
    {
      id: 2,
      date: "13 May 2026, 8:00 PM",
      home: desiTigers.id,
      away: desiDabanggs.id,
      hScore: 113,
      aScore: 53,
      hSkins: 4,
      aSkins: 0,
      potm: 36, // Manthan Shah
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/ahMNeOGe8h6R3xV5sq5P0Xv7OwneTh1iEySuZ4QG.jpg",
    },
    {
      id: 3,
      date: "15 May 2026, 8:00 PM",
      home: vpgrTeam.id,
      away: desiDabanggs.id,
      hScore: 148,
      aScore: 56,
      hSkins: 4,
      aSkins: 0,
      potm: 5, // Ankush Goel
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/OSxCBhl68FJzczLG5nBPIxsPMKNouscmLC936huM.jpg",
    },
    {
      id: 4,
      date: "15 May 2026, 9:30 PM",
      home: desiTigers.id,
      away: desiTitans.id,
      hScore: 103,
      aScore: 69,
      hSkins: 3,
      aSkins: 1,
      potm: 45, // Prateek Nahar
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/wzkviHxARCTmAmyOnHxyBj86n866Nw2u2wjM7DMT.jpg",
    },
    {
      id: 5,
      date: "18 May 2026, 8:00 PM", // Final
      home: desiTigers.id,
      away: vpgrTeam.id,
      hScore: 111,
      aScore: 94,
      hSkins: 3,
      aSkins: 1,
      potm: 2, // Abhishek Agarwal
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/JJ4WJyjlzrzj4wUxrNPRifw8lnqx9RHVFIHOqZh1.jpg",
    },
    {
      id: 6,
      date: "18 May 2026, 9:30 PM", // 3rd place playoff
      home: desiDabanggs.id,
      away: desiTitans.id,
      hScore: 94,
      aScore: 76,
      hSkins: 2,
      aSkins: 2,
      potm: 46, // Preraq Mistry
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/S9vHrbIiDufP0ER2db9P9KNMAA0KELPojHx15lot.jpg",
    },
    {
      id: 7,
      date: "09 September 2026, 20:17", // Practice Match 1
      home: homeTeam.id,
      away: awayTeam.id,
      hScore: 63,
      aScore: 120,
      hSkins: 0,
      aSkins: 4,
      potm: 101, // Yash
      scorecardUrl: "/admin/scorecards/1/review",
    },
    {
      id: 8,
      date: "10 September 2026, 20:12", // Practice Match 2
      home: homeTeam.id,
      away: awayTeam.id,
      hScore: 117,
      aScore: 49,
      hSkins: 3,
      aSkins: 1,
      potm: 108, // Shubham
      scorecardUrl: "/matches/8",
    },
  ];

  for (const m of tournamentMatchesData) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: {
        tournamentId: m.id >= 7 ? 0 : 1,
        matchDate: m.date,
        homeTeamId: m.home,
        awayTeamId: m.away,
        homeScore: m.hScore,
        awayScore: m.aScore,
        homeSkins: m.hSkins,
        awaySkins: m.aSkins,
        potmPlayerId: m.potm,
        status: "COMPLETED",
        scorecardUrl: m.scorecardUrl,
      },
      create: {
        id: m.id,
        tournamentId: m.id >= 7 ? 0 : 1,
        matchDate: m.date,
        homeTeamId: m.home,
        awayTeamId: m.away,
        homeScore: m.hScore,
        awayScore: m.aScore,
        homeSkins: m.hSkins,
        awaySkins: m.aSkins,
        potmPlayerId: m.potm,
        status: "COMPLETED",
        scorecardUrl: m.scorecardUrl,
      },
    });
  }

  // Helper to upsert PlayerMatchStat cleanly without duplicate key violations
  async function addStat(matchId, playerId, teamId, rs, ob, rc, wkts, econ, c, isPotm = false, note = null, timesOut = 1) {
    const existing = await prisma.playerMatchStat.findFirst({
      where: { matchId, playerId },
    });
    const statData = {
      matchId,
      playerId,
      teamId,
      runsScored: rs,
      timesOut: timesOut !== undefined ? timesOut : 1,
      oversBowled: ob,
      runsConceded: rc,
      wickets: wkts,
      economy: econ,
      contribution: c,
      isPotm: !!isPotm,
      performanceNote: note,
    };
    if (existing) {
      await prisma.playerMatchStat.update({
        where: { id: existing.id },
        data: statData,
      });
    } else {
      await prisma.playerMatchStat.create({
        data: statData,
      });
    }
  }

  // 1. Prateek Nahar (ID 45) — Top Scorer (74 RS, 44 C)
  await addStat(2, 45, desiTigers.id, 22, 2.0, 10, 1, 5.0, 12, false);
  await addStat(4, 45, desiTigers.id, 34, 2.0, 14, 2, 7.0, 20, true);
  await addStat(5, 45, desiTigers.id, 18, 2.0, 6, 2, 3.0, 12, false);

  // 2. Sajid Merchant (ID 53) — 67 RS, 6 Wkts, 35 C
  await addStat(1, 53, vpgrTeam.id, 24, 2.0, 12, 2, 6.0, 12, false);
  await addStat(3, 53, vpgrTeam.id, 28, 2.0, 11, 2, 5.5, 17, false);
  await addStat(5, 53, vpgrTeam.id, 15, 2.0, 9, 2, 4.5, 6, false);

  // 3. Himanshu Kalyani (ID 27) — 62 RS, 37 C
  await addStat(1, 27, vpgrTeam.id, 18, 2.0, 7, 2, 3.5, 11, false);
  await addStat(3, 27, vpgrTeam.id, 26, 2.0, 10, 1, 5.0, 16, false);
  await addStat(5, 27, vpgrTeam.id, 18, 2.0, 8, 2, 4.0, 10, false);

  // 4. Ankush Goel (ID 5) — MVP (10 Wkts, 48 C)
  await addStat(1, 5, vpgrTeam.id, 16, 2.0, -4, 4, -2.0, 20, true);
  await addStat(3, 5, vpgrTeam.id, 14, 2.0, -2, 3, -1.0, 16, true);
  await addStat(5, 5, vpgrTeam.id, 12, 2.0, 0, 3, 0.0, 12, false);

  // 5. Harshal Joshi (ID 25) — 54 RS, 9 Wkts, 42 C
  await addStat(2, 25, desiTigers.id, 20, 2.0, 4, 3, 2.0, 16, false);
  await addStat(4, 25, desiTigers.id, 18, 2.0, 6, 3, 3.0, 12, false);
  await addStat(5, 25, desiTigers.id, 16, 2.0, 2, 3, 1.0, 14, false);

  // 6. Manthan Shah (ID 36) — 8 Wkts, POTM in Match 2
  await addStat(2, 36, desiTigers.id, 18, 2.0, -2, 3, -1.0, 20, true);
  await addStat(4, 36, desiTigers.id, 14, 2.0, 5, 2, 2.5, 9, false);
  await addStat(5, 36, desiTigers.id, 16, 2.0, 4, 3, 2.0, 12, false);

  // 7. Kalrav Shah (ID 30) — 58 RS
  await addStat(2, 30, desiTigers.id, 19, 2.0, 11, 1, 5.5, 8, false);
  await addStat(4, 30, desiTigers.id, 21, 2.0, 12, 1, 6.0, 9, false);
  await addStat(5, 30, desiTigers.id, 18, 2.0, 10, 1, 5.0, 8, false);

  // 8. Tejas Shah (ID 60) — 7 Wkts
  await addStat(1, 60, vpgrTeam.id, 11, 2.0, 2, 2, 1.0, 9, false);
  await addStat(3, 60, vpgrTeam.id, 12, 2.0, 3, 3, 1.5, 9, false);
  await addStat(5, 60, vpgrTeam.id, 8, 2.0, 4, 2, 2.0, 4, false);

  // 9. Abhishek Agarwal (ID 2) — Final POTM (19 RS, 14 C)
  await addStat(2, 2, desiTigers.id, 16, 2.0, 12, 1, 6.0, 4, false);
  await addStat(4, 2, desiTigers.id, 15, 2.0, 14, 1, 7.0, 1, false);
  await addStat(5, 2, desiTigers.id, 19, 2.0, 5, 2, 2.5, 14, true);

  // 10. Manish Pandey (ID 35) — 4 matches seeded
  await addStat(3, 35, awayTeam.id, 4, 2.0, 14, 0, 7.0, -10, false, "📉 Negative contribution", 2);
  await addStat(5, 35, awayTeam.id, 16, 2.0, 3, 3, 1.5, 13, true, "⭐ Excellent batting — not out!", 0);
  await addStat(6, 35, awayTeam.id, 3, 2.0, 2, 2, 1.0, 1, false, "⚡ Excellent economy", 1);
  await addStat(7, 35, awayTeam.id, 20, 2.0, 14, 1, 7.0, 6, false, "⭐ Top scorer for Away (20 RS)", 1);

  // 11. Gagandeep Singh (ID 20) — 6 matches strictly matching media_1789209845228.jpg
  await addStat(1, 20, desiDabanggs.id, 18, 2.0, 18, 0, 9.0, 0, false, null, 1);
  await addStat(2, 20, desiDabanggs.id, 7, 2.0, 17, 0, 8.5, -10, false, null, 2);
  await addStat(3, 20, desiDabanggs.id, 13, 2.0, 16, 2, 8.0, -3, false, "⚡ 2 wickets", 1);
  await addStat(4, 20, desiDabanggs.id, 12, 2.0, 7, 2, 3.5, 5, false, "⚡ 2 wickets", 1);
  await addStat(5, 20, desiDabanggs.id, 4, 2.0, 1, 3, 0.5, 3, false, "⚡ 3 wickets", 1);
  await addStat(6, 20, desiDabanggs.id, 14, 2.0, -8, 4, -4.0, 22, true, "★ Player of the match!", 0);

  // --- MATCH 7 (PRACTICE MATCH - 09 Sep 2026) FULL 16-PLAYER ROSTER ---
  // Away Team (120 runs, 4 skins won, 8 wickets conceded)
  await addStat(7, 101, awayTeam.id, 18, 2.0, -1, 3, -0.5, 19, true, "★ Player of the match (+19 contribution)", 0); // Yash (POTM)
  await addStat(7, 102, awayTeam.id, 16, 2.0, 5, 2, 2.5, 11, false, "⚡ 2 wickets & 16 runs", 1); // Deepak
  await addStat(7, 109, awayTeam.id, 13, 2.0, 3, 3, 1.5, 10, false, "⚡ 3 wickets with 1.5 economy", 1); // Narendra
  await addStat(7, 113, awayTeam.id, 16, 2.0, 7, 3, 3.5, 9, false, "⚡ 3 wickets & 16 runs", 1); // Gagan
  await addStat(7, 112, awayTeam.id, 3, 2.0, -4, 3, -2.0, 7, false, "⚡ -2.0 economy & 3 wickets", 1); // Sahil
  await addStat(7, 110, awayTeam.id, 18, 2.0, 12, 2, 6.0, 6, false, "18 runs scored", 1); // Viral
  await addStat(7, 111, awayTeam.id, 16, 2.0, 27, 0, 13.5, -11, false, null, 1); // Sunny

  // Home Team (63 runs, 0 skins won, 17 wickets conceded)
  await addStat(7, 36, homeTeam.id, 29, 2.0, 13, 1, 6.5, 16, false, "⭐ Top scorer of the match (29 RS)", 1); // Manthan Shah
  await addStat(7, 105, homeTeam.id, 14, 2.0, 3, 3, 1.5, 11, false, "⚡ 3 wickets with 1.5 economy", 0); // Arif
  await addStat(7, 45, homeTeam.id, -1, 2.0, 1, 3, 0.5, -2, false, "⚡ 3 wickets with 0.5 economy", 3); // Prateek Nahar
  await addStat(7, 106, homeTeam.id, 11, 2.0, 21, 0, 10.5, -10, false, null, 2); // Sahil A
  await addStat(7, 23, homeTeam.id, 0, 2.0, 12, 1, 6.0, -12, false, null, 2); // Hardik Desai
  await addStat(7, 108, homeTeam.id, 13, 2.0, 29, 0, 14.5, -16, false, null, 2); // Shubham
  await addStat(7, 103, homeTeam.id, 2, 2.0, 21, 0, 10.5, -19, false, null, 3); // Akshay
  await addStat(7, 104, homeTeam.id, -5, 2.0, 20, 0, 10.0, -25, false, null, 4); // Jigar

  // --- MATCH 8 (PRACTICE MATCH - 10 Sep 2026) FULL 16-PLAYER ROSTER ---
  // Home Team (117 runs, 3 skins won, 7 wickets conceded)
  await addStat(8, 108, homeTeam.id, 28, 2.0, 0, 3, 0.0, 28, true, "★ Player of the match (+28 contribution)", 0); // Shubham (POTM)
  await addStat(8, 37, homeTeam.id, 17, 2.0, 3, 2, 1.5, 14, false, "⚡ 2 wickets & 1.5 economy", 0); // Mayank Agarwal
  await addStat(8, 36, homeTeam.id, 17, 2.0, 4, 1, 2.0, 13, false, "17 runs scored", 0); // Manthan Shah
  await addStat(8, 54, homeTeam.id, 14, 2.0, 3, 2, 1.5, 11, false, "⚡ 2 wickets", 0); // Sam (Sameer Gohel)
  await addStat(8, 75, homeTeam.id, 16, 2.0, 7, 2, 3.5, 9, false, "16 runs scored", 1); // Brijesh Gopinathan
  await addStat(8, 50, homeTeam.id, 12, 2.0, 7, 1, 3.5, 5, false, null, 1); // Ronak Jain
  await addStat(8, 26, homeTeam.id, 8, 2.0, 7, 1, 3.5, 1, false, null, 1); // Hemang Shah
  await addStat(8, 38, homeTeam.id, 5, 2.0, 9, 0, 4.5, -4, false, null, 1); // Milan Chheda

  // Away Team (49 runs, 1 skin won, 11 wickets conceded)
  await addStat(8, 13, awayTeam.id, 16, 2.0, 5, 2, 2.5, 11, false, "⭐ Top contributor for Away (+11)", 1); // Daman Singh
  await addStat(8, 76, awayTeam.id, 14, 2.0, 6, 2, 3.0, 8, false, "14 runs scored", 1); // Sunny Vaswani
  await addStat(8, 23, awayTeam.id, 12, 2.0, 6, 1, 3.0, 6, false, null, 1); // Hardik Desai
  await addStat(8, 55, awayTeam.id, 9, 2.0, 6, 1, 3.0, 3, false, null, 1); // Sandeep Khedekar
  await addStat(8, 32, awayTeam.id, 8, 2.0, 7, 1, 3.5, 1, false, null, 1); // Kunal soni
  await addStat(8, 110, awayTeam.id, 7, 2.0, 9, 0, 4.5, -2, false, null, 1); // Viral / Ronak
  await addStat(8, 48, awayTeam.id, 4, 2.0, 15, 0, 7.5, -11, false, null, 2); // Ritesh Mehta
  await addStat(8, 114, awayTeam.id, -12, 2.0, 24, 0, 12.0, -36, false, null, 3); // Devang

  // Seed Canonical Aliases for OCR resolution (e.g. MANEESH -> Manish Pandey)
  const aliasesToSeed = [
    { alias: "MANEESH", playerId: 35 },
    { alias: "MANISH", playerId: 35 },
    { alias: "GAGAN", playerId: 113 },
    { alias: "MANTHAN", playerId: 36 },
    { alias: "PRATEEK", playerId: 45 },
    { alias: "HARDIK", playerId: 23 },
    { alias: "DEEPAK", playerId: 102 },
    { alias: "YASH", playerId: 101 },
    { alias: "ARIF", playerId: 105 },
    { alias: "SAHIL A", playerId: 106 },
    { alias: "SHUBHAM", playerId: 108 },
    { alias: "AKSHAY", playerId: 103 },
    { alias: "JIGAR", playerId: 104 },
    { alias: "NARENDRA", playerId: 109 },
    { alias: "VIRAL", playerId: 110 },
    { alias: "SUNNY", playerId: 111 },
    { alias: "SAHIL", playerId: 112 },
    { alias: "DHANAN", playerId: 13 },
    { alias: "SANDEEP", playerId: 55 },
    { alias: "SUNIL", playerId: 32 },
    { alias: "RONAK", playerId: 50 },
    { alias: "RITESH", playerId: 48 },
    { alias: "DEVANG", playerId: 114 },
    { alias: "SAM", playerId: 54 },
    { alias: "MAYANK", playerId: 37 },
    { alias: "BRIJESH", playerId: 75 },
    { alias: "BRUJESH", playerId: 75 },
    { alias: "MILAN", playerId: 38 },
    { alias: "HEMANG", playerId: 26 },
  ];

  for (const a of aliasesToSeed) {
    await prisma.playerAlias.upsert({
      where: { alias: a.alias },
      update: { playerId: a.playerId },
      create: { alias: a.alias, playerId: a.playerId, confidence: 1.0, status: "APPROVED", approvedBy: "SeedSystem" },
    });
  }

  for (const [id, p] of playerMap.entries()) {
    const pVariants = [p.canonicalName, p.canonicalName.toLowerCase()];
    const parts = p.canonicalName.trim().split(/\s+/);
    if (parts.length > 1) {
      pVariants.push(parts[0]);
      pVariants.push(parts[0].toLowerCase());
    }
    for (const v of pVariants) {
      const existing = await prisma.playerAlias.findFirst({ where: { alias: v } });
      if (!existing) {
        try {
          await prisma.playerAlias.create({
            data: { alias: v, playerId: id, confidence: 1.0, status: "APPROVED", approvedBy: "SeedSystem" },
          });
        } catch (e) {}
      }
    }
  }

  // Replay any durable committed matches from ledger (ensuring ACID durability across rebuilds)
  const fs = require("fs");
  const path = require("path");
  const ledgerPath = path.join(__dirname, "committed_matches.json");
  if (fs.existsSync(ledgerPath)) {
    try {
      const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));
      console.log(`Replaying ${ledger.length} matches from committed_matches.json ledger...`);
      for (const entry of ledger) {
        const existing = await prisma.match.findUnique({ where: { id: entry.matchId } });
        if (!existing) {
          await prisma.match.create({
            data: {
              id: entry.matchId,
              tournamentId: entry.tournamentId || 0,
              matchDate: entry.matchDate,
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              homeScore: entry.homeScore,
              awayScore: entry.awayScore,
              homeSkins: entry.homeSkins,
              awaySkins: entry.awaySkins,
              status: "COMPLETED",
              scorecardUrl: `/matches/${entry.matchId}`,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Could not replay committed_matches ledger:", err);
    }
  }

  console.log("Database seeded successfully with all tournament 1 & 2 players, exact IDs, aliases, and grounded stats!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
