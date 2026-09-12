const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding DesiSports V2 database with rich tournament and player datasets...");

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

  await prisma.user.create({
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
  const desiTigers = await prisma.team.create({
    data: { id: 1, name: "DesiTigers", code: "DTG" },
  });
  const vpgrTeam = await prisma.team.create({
    data: { id: 2, name: "VPGR", code: "VPG" },
  });
  const desiDabanggs = await prisma.team.create({
    data: { id: 3, name: "DesiDabanggs", code: "DDB" },
  });
  const desiTitans = await prisma.team.create({
    data: { id: 4, name: "DesiTitans", code: "DTT" },
  });
  const homeTeam = await prisma.team.create({
    data: { id: 5, name: "Home Team", code: "HOM" },
  });
  const awayTeam = await prisma.team.create({
    data: { id: 6, name: "Away Team", code: "AWY" },
  });

  // 1. Seed Manish Pandey (ID 35) with fuzzy variants
  const playerManish = await prisma.player.create({
    data: {
      id: 35,
      canonicalName: "Manish Pandey",
      battingHand: "Left Hand",
      bowlingStyle: "Right Arm Off Spin",
      fieldingPosition: "Cover",
      captainTags: JSON.stringify(["Anchor", "Reliable Floor", "Matchup Specialist"]),
      fuzzyVariants: JSON.stringify(["Maneesh", "Manis", "Maanes", "Manish P", "M Pandey", "Maneesh Pandey"]),
      notes: "Steady anchor batter with high running chemistry and disciplined off-spin line.",
    },
  });

  // 2. Seed Gagandeep Singh (ID 36) - Exact replica of media_1789207004196.jpg
  const playerGagan = await prisma.player.create({
    data: {
      id: 36,
      canonicalName: "Gagandeep Singh",
      battingHand: "Right Hand",
      bowlingStyle: "Right Arm Medium Fast",
      fieldingPosition: "Wicket Keeper",
      captainTags: JSON.stringify(["Aggressive", "Boundary Hitter", "Skin 3 Specialist"]),
      fuzzyVariants: JSON.stringify(["Gagan", "Gagandeep", "Gagan S", "Gagan Deep", "Gagandeep S"]),
      notes: "High boundary scoring rate in middle skins with elite death overs wicket-taking impact.",
    },
  });

  // Seed remaining tournament players with fuzzyVariants
  const roster = [
    { id: 2, name: "Abhishek Agarwal", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Wicket Keeper", variants: ["Abhishek", "Abishek", "Abhishek A"] },
    { id: 86, name: "Arif Halai", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Wicket Keeper", variants: ["Arif", "Aarif", "Arif H", "Arif Halai"] },
    { id: 101, name: "Yash", hand: "Right Hand", bowl: "Right Arm Medium Fast", pos: "Mid Wicket", variants: ["Yash", "Yaash", "Yash P"] },
    { id: 102, name: "Deepak", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Point", variants: ["Deepak", "Dipak", "Deepak P"] },
    { id: 103, name: "Narendra", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", variants: ["Narendra", "Narender", "Naren"] },
    { id: 105, name: "Viral", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Mid Off", variants: ["Viral", "Veeral", "Viral P"] },
    { id: 106, name: "Sahil", hand: "Left Hand", bowl: "Left Arm Medium", pos: "Third Man", variants: ["Sahil", "Saahel", "Sahil K"] },
    { id: 107, name: "Sunny", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Fine Leg", variants: ["Sunny", "Suni", "Sunny P"] },
    { id: 108, name: "Shubham", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", variants: ["Shubham", "Subham", "Shubam"] },
    { id: 109, name: "Manthan Shah", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Mid Wicket", variants: ["Manthan", "Manthan S", "Mantan"] },
    { id: 110, name: "Prateek", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Bowler", variants: ["Prateek", "Pratik", "Prateek S"] },
    { id: 111, name: "Akshay Kumar", hand: "Left Hand", bowl: "Right Arm Medium Fast", pos: "Cover", variants: ["Akshay", "Akshay Kumar", "Akshay K"] },
    { id: 112, name: "Jigar", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Mid Off", variants: ["Jigar", "Jeegar", "Jigar M"] },
    { id: 113, name: "Sahil A", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Point", variants: ["Sahil A", "Sahil Agarwal"] },
    { id: 114, name: "Hardik Desai", hand: "Right Hand", bowl: "Right Arm Medium", pos: "Cover", variants: ["Hardik", "Hardik D", "Haardik"] },
    { id: 115, name: "Darshan Mody", hand: "Right Hand", bowl: "Right Arm Fast", pos: "Cover", variants: ["Darshan", "Darshan M"] },
    { id: 116, name: "Himanshu Kalyani", hand: "Right Hand", bowl: "Right Arm Off Spin", pos: "Wicket Keeper", variants: ["Himanshu", "Himanshu K"] },
  ];

  const playerMap = {
    "MANISH PANDEY": playerManish.id,
    "MANEESH": playerManish.id,
    "GAGANDEEP SINGH": playerGagan.id,
    "GAGAN": playerGagan.id,
  };

  for (const p of roster) {
    const created = await prisma.player.create({
      data: {
        id: p.id,
        canonicalName: p.name,
        battingHand: p.hand,
        bowlingStyle: p.bowl,
        fieldingPosition: p.pos,
        fuzzyVariants: JSON.stringify(p.variants),
      },
    });
    playerMap[p.name.toUpperCase()] = created.id;
    for (const v of p.variants) {
      playerMap[v.toUpperCase()] = created.id;
    }
  }

  // Seed All 6 Historical Matches from tournaments/1 with Scorecard links!
  const tournamentMatchesData = [
    {
      id: 1,
      date: "17 Jun 2026, 8:00 PM",
      home: desiDabanggs.id,
      away: vpgrTeam.id,
      hScore: 68,
      aScore: 104,
      hSkins: 1,
      aSkins: 3,
      potm: playerGagan.id,
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/iVA2RZBZK6iu9zaGBGZKItLdkqaL4D7uGPGTpKUg.jpg",
    },
    {
      id: 2,
      date: "24 Jun 2026, 8:00 PM",
      home: desiTitans.id,
      away: desiTigers.id,
      hScore: 62,
      aScore: 118,
      hSkins: 1,
      aSkins: 3,
      potm: playerMap["MANTHAN SHAH"],
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/ahMNeOGe8h6R3xV5sq5P0Xv7OwneTh1iEySuZ4QG.jpg",
    },
    {
      id: 3,
      date: "01 Jul 2026, 8:00 PM",
      home: desiTigers.id,
      away: desiDabanggs.id,
      hScore: 114,
      aScore: 58,
      hSkins: 3,
      aSkins: 1,
      potm: playerGagan.id,
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/OSxCBhl68FJzczLG5nBPIxsPMKNouscmLC936huM.jpg",
    },
    {
      id: 4,
      date: "05 Aug 2026, 8:00 PM",
      home: vpgrTeam.id,
      away: desiTitans.id,
      hScore: 116,
      aScore: 72,
      hSkins: 3,
      aSkins: 1,
      potm: playerMap["HIMANSHU KALYANI"],
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/wzkviHxARCTmAmyOnHxyBj86n866Nw2u2wjM7DMT.jpg",
    },
    {
      id: 5,
      date: "19 Aug 2026, 8:00 PM",
      home: desiTigers.id,
      away: vpgrTeam.id,
      hScore: 95,
      aScore: 102,
      hSkins: 1,
      aSkins: 3,
      potm: playerManish.id,
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/LwQmuQIbG7exmNcHaii0BIM22sUMFjN65jhJLir5.jpg",
    },
    {
      id: 6,
      date: "02 Sep 2026, 9:00 PM",
      home: desiDabanggs.id,
      away: desiTitans.id,
      hScore: 77,
      aScore: 52,
      hSkins: 2,
      aSkins: 2,
      potm: playerMap["DARSHAN MODY"],
      scorecardUrl: "https://desisports.milanchheda.com/storage/scorecards/JJ4WJyjlzrzj4wUxrNPRifw8lnqx9RHVFIHOqZh1.jpg",
    },
    {
      id: 7,
      date: "09 September 2026, 20:17",
      home: homeTeam.id,
      away: awayTeam.id,
      hScore: 63,
      aScore: 120,
      hSkins: 0,
      aSkins: 4,
      potm: playerMap["YASH"],
      scorecardUrl: "/uploads/scorecards/sample-scorecard.jpg",
    },
  ];

  for (const m of tournamentMatchesData) {
    await prisma.match.create({
      data: {
        id: m.id,
        matchDate: m.date,
        tournamentId: tournament.id,
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

  // Seed Gagandeep Singh's 6 matches matching media_1789207004196.jpg!
  // Runs: 18, 7, 13, 12, 4, 14 = 68 Runs total
  // Wickets: (2) 17 Jun, (2) 22 Jun, (3) 24 Jun, (4) 01 Jul = 11 Wickets total
  // Last 5 Contributions: +22, +3, +5, -3, -10
  const gaganMatchStats = [
    { matchId: 1, date: "15 May 2026", rs: 18, out: 0, ob: 2.0, rc: 18, wkts: 0, econ: 9.0, c: 0, potm: false, note: null },
    { matchId: 2, date: "18 May 2026", rs: 7, out: 0, ob: 2.0, rc: 17, wkts: 0, econ: 8.5, c: -10, potm: false, note: null },
    { matchId: 3, date: "17 Jun 2026", rs: 13, out: 0, ob: 2.0, rc: 16, wkts: 2, econ: 8.0, c: -3, potm: false, note: "⚡ 2 wickets" },
    { matchId: 4, date: "22 Jun 2026", rs: 12, out: 0, ob: 2.0, rc: 7, wkts: 2, econ: 3.5, c: 5, potm: false, note: "⚡ 2 wickets" },
    { matchId: 5, date: "24 Jun 2026", rs: 4, out: 0, ob: 2.0, rc: 1, wkts: 3, econ: 0.5, c: 3, potm: false, note: "⚡ 3 wickets" },
    { matchId: 6, date: "01 Jul 2026", rs: 14, out: 0, ob: 2.0, rc: -8, wkts: 4, econ: -4.0, c: 22, potm: true, note: "★ Player of the match!" },
  ];

  for (const s of gaganMatchStats) {
    await prisma.playerMatchStat.create({
      data: {
        matchId: s.matchId,
        playerId: playerGagan.id,
        teamId: desiTigers.id,
        runsScored: s.rs,
        oversBowled: s.ob,
        runsConceded: s.rc,
        wickets: s.wkts,
        economy: s.econ,
        contribution: s.c,
        isPotm: s.potm,
        performanceNote: s.note,
      },
    });
  }

  // Seed Manish Pandey's matches
  const manishMatchStats = [
    { matchId: 3, rs: 4, ob: 2.0, rc: 14, wkts: 0, econ: 7.0, c: -10, note: "📉 Negative contribution" },
    { matchId: 5, rs: 16, ob: 2.0, rc: 3, wkts: 3, econ: 1.5, c: 13, isPotm: true, note: "⭐ Excellent batting — not out!" },
    { matchId: 6, rs: 3, ob: 2.0, rc: 2, wkts: 2, econ: 1.0, c: 1, note: "⚡ Excellent economy" },
    { matchId: 7, rs: 20, ob: 2.0, rc: 14, wkts: 1, econ: 7.0, c: 6, note: "⭐ Top scorer for Away (20 RS)" },
  ];

  for (const s of manishMatchStats) {
    await prisma.playerMatchStat.create({
      data: {
        matchId: s.matchId,
        playerId: playerManish.id,
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

  // Create ScorecardUpload record for demo review
  const upload = await prisma.scorecardUpload.create({
    data: {
      id: "upload-demo-01",
      matchId: 7,
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

  console.log("Database seeded successfully with all 4 teams, 6 matches, squads, and media reference data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
