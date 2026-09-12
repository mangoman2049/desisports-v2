const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DesiSports V2 database...");

  // Clean existing tables
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

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: "manish.pandey@desisports.com",
      name: "Manish Pandey",
      role: "ADMIN",
    },
  });

  const captainUser = await prisma.user.create({
    data: {
      email: "captain@desisports.com",
      name: "Team Captain",
      role: "CAPTAIN",
    },
  });

  // Create Tournament
  const tournament = await prisma.tournament.create({
    data: {
      id: 1,
      name: "Desi Boys Tournament May 2026",
      status: "ACTIVE",
    },
  });

  // Create Teams
  const homeTeam = await prisma.team.create({
    data: { id: 1, name: "Home Team", code: "HOM" },
  });
  const awayTeam = await prisma.team.create({
    data: { id: 2, name: "Away Team", code: "AWY" },
  });
  const desiTigers = await prisma.team.create({
    data: { id: 3, name: "Desi Tigers", code: "DTG" },
  });
  const vpgrTeam = await prisma.team.create({
    data: { id: 4, name: "VPGR", code: "VPG" },
  });

  // Create Players
  // Manish Pandey with ID 35 so /player/35 or /players/35 matches the exact URL
  const playerManish = await prisma.player.create({
    data: {
      id: 35,
      canonicalName: "Manish Pandey",
      battingHand: "Left Hand",
      bowlingStyle: "Right Arm Off Spin",
      fieldingPosition: "Cover",
      captainTags: JSON.stringify(["Anchor", "Reliable Floor", "Matchup Specialist"]),
      notes: "Steady anchor batter with tight off-spin containment against aggressive right-handers.",
    },
  });

  // Add alias MANEESH -> Manish Pandey
  await prisma.playerAlias.create({
    data: {
      alias: "MANEESH",
      playerId: playerManish.id,
      confidence: 0.99,
      status: "APPROVED",
      approvedBy: "System",
    },
  });

  // Create other key players
  const playerRoster = [
    { id: 2, name: "Abhishek Agarwal", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Wicket Keeper", tags: ["Keeper", "Accumulator"] },
    { id: 86, name: "Arif Halai", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Wicket Keeper", tags: ["Strike Bowler", "Skin 4 Closer"] },
    { id: 101, name: "Yash", hand: "Right Hand", bowl: "Right Arm Medium Fast", pos: "Mid Wicket", tags: ["Aggressive", "Power Hitter", "Clutch Bowler"] },
    { id: 102, name: "Deepak", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Point", tags: ["Anchor", "Choke Bowler", "Low Volatility"] },
    { id: 103, name: "Narendra", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", tags: ["High Survival", "Steady", "Low Variance"] },
    { id: 104, name: "Gagan", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Long On", tags: ["Aggressive", "Skin 3 Specialist"] },
    { id: 105, name: "Viral", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Mid Off", tags: ["Boundary Hitter", "Spin Containment"] },
    { id: 106, name: "Sahil", hand: "Left Hand", bowl: "Left Arm Medium", pos: "Third Man", tags: ["Skin Specialist", "Death Bowler"] },
    { id: 107, name: "Sunny", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Fine Leg", tags: ["Finisher", "Pace"] },
    { id: 108, name: "Shubham", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", tags: ["Opener"] },
    { id: 109, name: "Manthan", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Mid Wicket", tags: ["Net Positive Aggressor", "Boundary Hitter"] },
    { id: 110, name: "Prateek", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Bowler", tags: ["Clutch Specialist", "Death Specialist"] },
    { id: 111, name: "Akshay Kumar", hand: "Left Hand", bowl: "Right Arm Medium Fast", pos: "Cover", tags: ["Pace Option"] },
    { id: 112, name: "Jigar", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Mid Off", tags: ["High Risk"] },
    { id: 113, name: "Sahil A", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Point", tags: ["All Rounder"] },
    { id: 114, name: "Hardik", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", tags: ["Swing Bowler"] },
  ];

  const playerMap = { [playerManish.canonicalName.toUpperCase()]: playerManish.id };

  for (const p of playerRoster) {
    const created = await prisma.player.create({
      data: {
        id: p.id,
        canonicalName: p.name,
        battingHand: p.hand,
        bowlingStyle: p.bowl,
        fieldingPosition: p.pos,
        captainTags: JSON.stringify(p.tags),
      },
    });
    playerMap[p.name.toUpperCase()] = created.id;
    // Map uppercase tokens
    const firstWord = p.name.split(" ")[0].toUpperCase();
    playerMap[firstWord] = created.id;
  }

  // Create historical matches for Manish Pandey (exact data from desisports.milanchheda.com)
  const pastMatch1 = await prisma.match.create({
    data: {
      id: 10,
      matchDate: "02 Sep 2026, 9:00 PM",
      tournamentId: tournament.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: 84,
      awayScore: 78,
      homeSkins: 2,
      awaySkins: 2,
      status: "COMPLETED",
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/JJ4WJyjlzrzj4wUxrNPRifw8lnqx9RHVFIHOqZh1.jpg",
    },
  });

  await prisma.playerMatchStat.create({
    data: {
      matchId: pastMatch1.id,
      playerId: playerManish.id,
      teamId: awayTeam.id,
      runsScored: 3,
      oversBowled: 2.0,
      runsConceded: 2,
      wickets: 2,
      economy: 1.0,
      contribution: 1,
      performanceNote: "⚡ Excellent economy",
    },
  });

  const pastMatch2 = await prisma.match.create({
    data: {
      id: 11,
      matchDate: "19 Aug 2026, 8:00 PM",
      tournamentId: tournament.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: 92,
      awayScore: 114,
      homeSkins: 1,
      awaySkins: 3,
      status: "COMPLETED",
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/LwQmuQIbG7exmNcHaii0BIM22sUMFjN65jhJLir5.jpg",
    },
  });

  await prisma.playerMatchStat.create({
    data: {
      matchId: pastMatch2.id,
      playerId: playerManish.id,
      teamId: awayTeam.id,
      runsScored: 16,
      oversBowled: 2.0,
      runsConceded: 3,
      wickets: 3,
      economy: 1.5,
      contribution: 13,
      performanceNote: "⭐ Excellent batting — not out!",
    },
  });

  const pastMatch3 = await prisma.match.create({
    data: {
      id: 12,
      matchDate: "01 Jul 2026, 8:00 PM",
      tournamentId: tournament.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: 105,
      awayScore: 68,
      homeSkins: 3,
      awaySkins: 1,
      status: "COMPLETED",
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/OSxCBhl68FJzczLG5nBPIxsPMKNouscmLC936huM.jpg",
    },
  });

  await prisma.playerMatchStat.create({
    data: {
      matchId: pastMatch3.id,
      playerId: playerManish.id,
      teamId: awayTeam.id,
      runsScored: 4,
      oversBowled: 2.0,
      runsConceded: 14,
      wickets: 0,
      economy: 7.0,
      contribution: -10,
      performanceNote: "📉 Negative contribution",
    },
  });

  // Now seed the master uploaded match: 09 Sep 2026 Home (63) vs Away (120)
  const masterMatch = await prisma.match.create({
    data: {
      id: 1,
      matchDate: "09 September 2026, 20:17",
      tournamentId: tournament.id,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      homeScore: 63,
      awayScore: 120,
      homeSkins: 0,
      awaySkins: 4,
      potmPlayerId: playerMap["YASH"],
      status: "COMPLETED",
      umpire: "SAHEER",
      scorecardUrl: "/uploads/scorecards/sample-scorecard.jpg",
    },
  });

  // Create ScorecardUpload entry for maker-checker review demo
  const upload = await prisma.scorecardUpload.create({
    data: {
      id: "upload-demo-01",
      matchId: masterMatch.id,
      filename: "sample_spawtz_scorecard_09sep.jpg",
      imageUrl: "/uploads/scorecards/sample-scorecard.jpg",
      status: "APPROVED",
      qualityScore: 96.0,
      validationScore: 98.0,
      qualityDiagnostics: JSON.stringify({
        resolution: { width: 1600, height: 2844, passed: true },
        blur: { score: 240, passed: true },
        exposure: { luminosity: 155, passed: true },
        glare: { specularFraction: 0.015, passed: true },
        perspective: { aspectRatio: 0.56, passed: true },
      }),
    },
  });

  await prisma.extractionRevision.create({
    data: {
      uploadId: upload.id,
      reviewerId: adminUser.id,
      validationScore: 98.0,
      diffJson: JSON.stringify({ correctionsCount: 0, autoReconciledFields: 16 }),
    },
  });

  // Seed Home Innings (63 runs, 4 skins)
  const homeInnings = await prisma.innings.create({
    data: {
      matchId: masterMatch.id,
      inningsNumber: 1,
      teamId: homeTeam.id,
      totalRuns: 63,
    },
  });

  // Seed Away Innings (120 runs, 4 skins)
  const awayInnings = await prisma.innings.create({
    data: {
      matchId: masterMatch.id,
      inningsNumber: 2,
      teamId: awayTeam.id,
      totalRuns: 120,
    },
  });

  // Home Player Stats (from bottom table)
  const homeStatsData = [
    { name: "MANTHAN", rs: 29, ob: 2.0, rc: 13, wkts: 1, econ: 6.5, c: 16, note: "⭐ Top scorer for Home" },
    { name: "ARIF", rs: 14, ob: 2.0, rc: 3, wkts: 3, econ: 1.5, c: 11, note: "⚡ 3 wickets for 3 runs" },
    { name: "PRATEEK", rs: -1, ob: 2.0, rc: 1, wkts: 3, econ: 0.5, c: -2, note: "⚡ 3 wickets for 1 run" },
    { name: "SAHIL A", rs: 11, ob: 2.0, rc: 21, wkts: 0, econ: 10.5, c: -10, note: null },
    { name: "HARDIK", rs: 0, ob: 2.0, rc: 12, wkts: 1, econ: 6.0, c: -12, note: null },
    { name: "SHUBHAM", rs: 13, ob: 2.0, rc: 29, wkts: 0, econ: 14.5, c: -16, note: null },
    { name: "AKSHAY", rs: 2, ob: 2.0, rc: 21, wkts: 0, econ: 10.5, c: -19, note: null },
    { name: "JIGAR", rs: -5, ob: 2.0, rc: 20, wkts: 0, econ: 10.0, c: -25, note: "📉 High dismissal rate" },
  ];

  for (const s of homeStatsData) {
    const pId = playerMap[s.name] || playerManish.id;
    await prisma.playerMatchStat.create({
      data: {
        matchId: masterMatch.id,
        playerId: pId,
        teamId: homeTeam.id,
        runsScored: s.rs,
        oversBowled: s.ob,
        runsConceded: s.rc,
        wickets: s.wkts,
        economy: s.econ,
        contribution: s.c,
        performanceNote: s.note,
      },
    });
  }

  // Away Player Stats (from bottom table)
  const awayStatsData = [
    { name: "YASH", rs: 18, ob: 2.0, rc: -1, wkts: 3, econ: -0.5, c: 19, isPotm: true, note: "🏆 Player of the match (+19 C)" },
    { name: "DEEPAK", rs: 16, ob: 2.0, rc: 5, wkts: 2, econ: 2.5, c: 11, note: "⭐ Strong all-round impact" },
    { name: "NARENDRA", rs: 13, ob: 2.0, rc: 3, wkts: 3, econ: 1.5, c: 10, note: "⚡ 3 wickets with 1.5 econ" },
    { name: "GAGAN", rs: 16, ob: 2.0, rc: 7, wkts: 3, econ: 3.5, c: 9, note: "⚡ 3 wickets in death overs" },
    { name: "SAHIL", rs: 3, ob: 2.0, rc: -4, wkts: 3, econ: -2.0, c: 7, note: "⚡ Negative runs conceded (-4)" },
    { name: "VIRAL", rs: 18, ob: 2.0, rc: 12, wkts: 2, econ: 6.0, c: 6, note: null },
    { name: "MANEESH", rs: 20, ob: 2.0, rc: 14, wkts: 1, econ: 7.0, c: 6, note: "⭐ Top scorer for Away (20 RS)" },
    { name: "SUNNY", rs: 16, ob: 2.0, rc: 27, wkts: 0, econ: 13.5, c: -11, note: null },
  ];

  for (const s of awayStatsData) {
    const pId = playerMap[s.name] || playerManish.id;
    await prisma.playerMatchStat.create({
      data: {
        matchId: masterMatch.id,
        playerId: pId,
        teamId: awayTeam.id,
        runsScored: s.rs,
        oversBowled: s.ob,
        runsConceded: s.rc,
        wickets: s.wkts,
        economy: s.econ,
        contribution: s.c,
        isPotm: !!s.isPotm,
        performanceNote: s.note,
      },
    });
  }

  // Seed ball by ball delivery events for the match
  // Home Skin 1
  const hSkin1 = await prisma.skin.create({
    data: {
      inningsId: homeInnings.id,
      skinNumber: 1,
      batter1Id: playerMap["SHUBHAM"],
      batter2Id: playerMap["ARIF"],
      runs: 27,
      wickets: 1,
      won: false,
    },
  });

  const hSkin1Balls = [
    { over: 1, ball: 1, batter: "SHUBHAM", bowler: "YASH", token: "2", runs: 2, penalty: 0 },
    { over: 1, ball: 2, batter: "SHUBHAM", bowler: "YASH", token: "(R)", runs: 0, penalty: -5, dism: "RO" },
    { over: 1, ball: 3, batter: "SHUBHAM", bowler: "YASH", token: "W", runs: 2, penalty: 0, extra: "W" },
    { over: 1, ball: 4, batter: "SHUBHAM", bowler: "YASH", token: "W", runs: 2, penalty: 0, extra: "W" },
    { over: 1, ball: 5, batter: "SHUBHAM", bowler: "YASH", token: "0", runs: 0, penalty: 0 },
    { over: 1, ball: 6, batter: "SHUBHAM", bowler: "YASH", token: "1", runs: 1, penalty: 0 },
    { over: 2, ball: 1, batter: "SHUBHAM", bowler: "SUNNY", token: "2", runs: 2, penalty: 0 },
    { over: 2, ball: 2, batter: "ARIF", bowler: "SUNNY", token: "W", runs: 2, penalty: 0, extra: "W" },
    { over: 2, ball: 3, batter: "ARIF", bowler: "SUNNY", token: "0", runs: 0, penalty: 0 },
    { over: 2, ball: 4, batter: "ARIF", bowler: "SUNNY", token: "1", runs: 1, penalty: 0 },
    { over: 2, ball: 5, batter: "ARIF", bowler: "SUNNY", token: "3", runs: 3, penalty: 0 },
    { over: 2, ball: 6, batter: "ARIF", bowler: "SUNNY", token: "5", runs: 5, penalty: 0 },
    { over: 3, ball: 1, batter: "SHUBHAM", bowler: "MANEESH", token: "W", runs: 2, penalty: 0, extra: "W" },
    { over: 3, ball: 2, batter: "SHUBHAM", bowler: "MANEESH", token: "5", runs: 5, penalty: 0 },
    { over: 3, ball: 3, batter: "SHUBHAM", bowler: "MANEESH", token: "0", runs: 0, penalty: 0 },
    { over: 3, ball: 4, batter: "ARIF", bowler: "MANEESH", token: "NB", runs: 2, penalty: 0, extra: "NB" },
    { over: 3, ball: 5, batter: "ARIF", bowler: "MANEESH", token: "2", runs: 2, penalty: 0 },
    { over: 3, ball: 6, batter: "ARIF", bowler: "MANEESH", token: "4", runs: 4, penalty: 0 },
  ];

  for (const b of hSkin1Balls) {
    await prisma.deliveryEvent.create({
      data: {
        inningsId: homeInnings.id,
        skinId: hSkin1.id,
        overNumber: b.over,
        ballNumber: b.ball,
        batterId: playerMap[b.batter] || playerManish.id,
        bowlerId: playerMap[b.bowler] || playerManish.id,
        runsScored: b.runs,
        extrasType: b.extra || null,
        dismissalType: b.dism || null,
        penaltyRuns: b.penalty || 0,
        rawToken: b.token,
        confidence: 0.98,
      },
    });
  }

  // Away Skin 1
  const aSkin1 = await prisma.skin.create({
    data: {
      inningsId: awayInnings.id,
      skinNumber: 1,
      batter1Id: playerMap["DEEPAK"],
      batter2Id: playerMap["YASH"],
      runs: 34,
      wickets: 3,
      won: true,
    },
  });

  const aSkin1Balls = [
    { over: 1, ball: 1, batter: "DEEPAK", bowler: "HARDIK", token: "0", runs: 0, penalty: 0 },
    { over: 1, ball: 2, batter: "DEEPAK", bowler: "HARDIK", token: "2", runs: 2, penalty: 0 },
    { over: 1, ball: 3, batter: "DEEPAK", bowler: "HARDIK", token: "2", runs: 2, penalty: 0 },
    { over: 1, ball: 4, batter: "DEEPAK", bowler: "HARDIK", token: "4", runs: 4, penalty: 0 },
    { over: 1, ball: 5, batter: "YASH", bowler: "HARDIK", token: "(C)", runs: 0, penalty: -5, dism: "C" },
    { over: 1, ball: 6, batter: "YASH", bowler: "HARDIK", token: "5", runs: 5, penalty: 0 },
    { over: 2, ball: 1, batter: "DEEPAK", bowler: "ARIF", token: "4", runs: 4, penalty: 0 },
    { over: 2, ball: 2, batter: "DEEPAK", bowler: "ARIF", token: "2", runs: 2, penalty: 0 },
    { over: 2, ball: 3, batter: "YASH", bowler: "ARIF", token: "3", runs: 3, penalty: 0 },
    { over: 2, ball: 4, batter: "YASH", bowler: "ARIF", token: "1", runs: 1, penalty: 0 },
    { over: 2, ball: 5, batter: "YASH", bowler: "ARIF", token: "(B)", runs: 0, penalty: -5, dism: "B" },
    { over: 2, ball: 6, batter: "YASH", bowler: "ARIF", token: "(S)", runs: 0, penalty: -5, dism: "ST" },
  ];

  for (const b of aSkin1Balls) {
    await prisma.deliveryEvent.create({
      data: {
        inningsId: awayInnings.id,
        skinId: aSkin1.id,
        overNumber: b.over,
        ballNumber: b.ball,
        batterId: playerMap[b.batter] || playerManish.id,
        bowlerId: playerMap[b.bowler] || playerManish.id,
        runsScored: b.runs,
        extrasType: b.extra || null,
        dismissalType: b.dism || null,
        penaltyRuns: b.penalty || 0,
        rawToken: b.token,
        confidence: 0.98,
      },
    });
  }

  console.log("Database seeded successfully with all players, matches, Spawtz rules, and historical data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
