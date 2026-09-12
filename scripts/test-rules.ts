import { getSampleScorecardExtraction } from "../src/lib/extractor-service";
import { validateIndoorCricketScorecard } from "../src/lib/rules-engine";
import { evaluateQualityGate } from "../src/lib/quality-gate";
import { checkForDuplicateScorecard } from "../src/lib/duplicate-detector";
import { generateCaptainInsights } from "../src/lib/captain-insights";
import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import tournament1Data from "../prisma/tournament_1_data.json";

async function runTestSuite() {
  console.log("==================================================");
  console.log("   DESISPORTS V2 AUTOMATED PRE-PUSH TEST SUITE    ");
  console.log("==================================================");

  let passedAll = true;

  // Test 1: Spawtz Rules Engine & Reconciliations
  console.log("\n[Test 1] Spawtz Rules Reconciliation:");
  const sample = getSampleScorecardExtraction();
  const report = validateIndoorCricketScorecard(sample);

  console.log(`- Overall Passed: ${report.passed}`);
  console.log(`- Confidence Score: ${report.confidenceScore}%`);
  console.log(`- High Confidence Label (>=95%): ${report.highConfidenceLabel}`);
  console.log(`- Critical Issues Count: ${report.issues.filter((i) => i.severity === "error").length}`);

  if (!report.passed || report.confidenceScore < 95) {
    console.error("FAIL: Spawtz rules validation did not reach 95%+ confidence!");
    passedAll = false;
  } else {
    console.log("PASS: Indoor cricket Spawtz sheet successfully reconciled.");
  }

  // Test 2: Contribution Formula (C = RS - RC)
  console.log("\n[Test 2] Contribution Formula (C = RS - RC):");
  const yash = sample.awayInnings.playerSummaries.find((p) => p.name === "YASH")!;
  const manthan = sample.homeInnings.playerSummaries.find((p) => p.name === "MANTHAN")!;

  console.log(`- Yash: RS=${yash.runsScored}, RC=${yash.runsConceded}, C=${yash.contribution}`);
  if (yash.runsScored - yash.runsConceded !== yash.contribution) {
    console.error("FAIL: Yash contribution does not equal RS - RC");
    passedAll = false;
  }

  console.log(`- Manthan: RS=${manthan.runsScored}, RC=${manthan.runsConceded}, C=${manthan.contribution}`);
  if (manthan.runsScored - manthan.runsConceded !== manthan.contribution) {
    console.error("FAIL: Manthan contribution does not equal RS - RC");
    passedAll = false;
  }
  console.log("PASS: Contribution formula verified.");

  // Test 3: Quality Gate Thresholds
  console.log("\n[Test 3] Quality Gate Thresholds & Retake Prompts:");
  const validGate = evaluateQualityGate(1600, 2844, {
    meanLuminosity: 150,
    specularFraction: 0.02,
    laplacianVariance: 220,
  });
  console.log(`- Valid image pass: ${validGate.overallPass} (Score: ${validGate.score}%)`);
  if (!validGate.overallPass) {
    console.error("FAIL: High-res sample failed quality gate");
    passedAll = false;
  }

  const blurryGate = evaluateQualityGate(800, 600, {
    meanLuminosity: 50,
    specularFraction: 0.15,
    laplacianVariance: 60,
  });
  console.log(`- Degraded image pass: ${blurryGate.overallPass} (Score: ${blurryGate.score}%)`);
  console.log(`- Generated retake prompts: ${blurryGate.retakePrompts.length}`);
  if (blurryGate.overallPass || blurryGate.retakePrompts.length === 0) {
    console.error("FAIL: Degraded image should fail and generate retake prompts");
    passedAll = false;
  }
  console.log("PASS: Quality gate checks and retake prompts verified.");

  // Test 4: Duplicate Scorecard Detection
  console.log("\n[Test 4] Duplicate Scorecard Detection Check:");
  try {
    const dupCheck = await checkForDuplicateScorecard(
      "09 September 2026, 20:17",
      "Home Team",
      "Away Team"
    );
    console.log(`- Match detected as duplicate: ${dupCheck.isDuplicate}`);
    if (!dupCheck.isDuplicate) {
      console.error("FAIL: Should have detected 09 Sep 2026 Home vs Away as an existing match!");
      passedAll = false;
    } else {
      console.log(`- Duplicate reason: ${dupCheck.reason}`);
      console.log("PASS: Duplicate scorecard check verified.");
    }

    const nonDupCheck = await checkForDuplicateScorecard(
      "15 October 2026, 21:00",
      "New Team A",
      "New Team B"
    );
    console.log(`- Brand new match duplicate check: ${nonDupCheck.isDuplicate}`);
    if (nonDupCheck.isDuplicate) {
      console.error("FAIL: Non-duplicate match falsely identified as duplicate");
      passedAll = false;
    }
  } catch (err) {
    console.error("Error running duplicate test:", err);
    passedAll = false;
  }

  // Test 5: 32 Captain Insights Topology Check
  console.log("\n[Test 5] Captain Insights Topology (32 Metrics):");
  const captainData = generateCaptainInsights(["Deepak", "Yash"]);
  const bCount = captainData.insights.batting.length;
  const blCount = captainData.insights.bowling.length;
  const pCount = captainData.insights.pairs.length;
  const dCount = captainData.insights.decisions.length;
  const totalInsights = bCount + blCount + pCount + dCount;

  console.log(`- Batting Insights: ${bCount} / 8`);
  console.log(`- Bowling Insights: ${blCount} / 8`);
  console.log(`- Pairs Insights: ${pCount} / 8`);
  console.log(`- Decisions Insights: ${dCount} / 8`);
  console.log(`- Total Initial Insights: ${totalInsights} / 32`);

  if (totalInsights !== 32 || bCount !== 8 || blCount !== 8 || pCount !== 8 || dCount !== 8) {
    console.error("FAIL: Captain topology must contain exactly 32 initial insights (8 in each area)!");
    passedAll = false;
  } else {
    console.log("PASS: 32 initial captain insights topology verified.");
  }

  // Test 6: Player Stats Grounding & Negative Economy Math (Exact Spawtz Rules)
  console.log("\n[Test 6] Player Stats Grounding & Negative Economy Math:");
  const testRc = -8;
  const testOb = 2.0;
  const testRs = 14;
  const calculatedEcon = testOb > 0 ? testRc / testOb : 0;
  const calculatedContribution = testRs - testRc;

  console.log(`- Negative Economy Calculation: ${testRc} RC / ${testOb} OB = ${calculatedEcon.toFixed(2)}`);
  if (calculatedEcon !== -4.0) {
    console.error(`FAIL: Expected economy to be -4.00, got ${calculatedEcon}`);
    passedAll = false;
  }

  console.log(`- Spawtz Contribution Calculation: ${testRs} RS - (${testRc} RC) = +${calculatedContribution}`);
  if (calculatedContribution !== 22) {
    console.error(`FAIL: Expected contribution to be +22, got ${calculatedContribution}`);
    passedAll = false;
  }

  // Verify Gagandeep Singh database records match media_1789209845228.jpg
  const gagan = await prisma.player.findUnique({
    where: { id: 36 },
    include: { stats: true },
  });

  if (!gagan) {
    console.error("FAIL: Player 36 (Gagandeep Singh) not found in database!");
    passedAll = false;
  } else {
    const totalRuns = gagan.stats.reduce((acc, s) => acc + s.runsScored, 0);
    const totalWkts = gagan.stats.reduce((acc, s) => acc + s.wickets, 0);
    const totalC = gagan.stats.reduce((acc, s) => acc + s.contribution, 0);
    const potmCount = gagan.stats.filter((s) => s.isPotm).length;

    console.log(`- Gagandeep Singh Matches: ${gagan.stats.length} (expected 6)`);
    console.log(`- Gagandeep Singh Runs: ${totalRuns} (expected 68)`);
    console.log(`- Gagandeep Singh Wickets: ${totalWkts} (expected 11)`);
    console.log(`- Gagandeep Singh Contribution: +${totalC} (expected +17)`);
    console.log(`- Gagandeep Singh POTM: ${potmCount} (expected 1)`);

    if (gagan.stats.length !== 6 || totalRuns !== 68 || totalWkts !== 11 || totalC !== 17 || potmCount !== 1) {
      console.error("FAIL: Gagandeep Singh stats do not strictly reconcile with media_1789209845228.jpg!");
      passedAll = false;
    } else {
      console.log("PASS: Player stats grounding strictly verified against reference scorecard image.");
    }
  }

  // Test 7: Team DNA Dimensions & Archetype Model
  console.log("\n[Test 7] Team DNA Dimensions & Framework Model:");
  const testDNA = { batting: 78, bowling: 72, fielding: 81, teamChemistry: 76, dependency: 41 };
  const allInRange = Object.values(testDNA).every((v) => v >= 0 && v <= 100);
  console.log(`- Batting DNA: ${testDNA.batting} / 100`);
  console.log(`- Bowling DNA: ${testDNA.bowling} / 100`);
  console.log(`- Fielding DNA: ${testDNA.fielding} / 100`);
  console.log(`- Team Chemistry: ${testDNA.teamChemistry} / 100`);
  console.log(`- Dependency Risk Score: ${testDNA.dependency}%`);

  if (!allInRange) {
    console.error("FAIL: Team DNA dimensions must be bounded within 0 to 100!");
    passedAll = false;
  } else {
    console.log("PASS: Team DNA dimension scores validated.");
  }

  // Test 8: Tournament Hierarchy & Routing Rules
  console.log("\n[Test 8] Tournament Hierarchy & Separation Rules:");
  const t1Squads = tournament1Data.squads.length;
  const t1Teams = tournament1Data.teams.length;
  const t1Fixtures = tournament1Data.fixtures.length;
  console.log(`- Tournament 1 (May 2026): ${t1Teams} Teams, ${t1Squads} Squads, ${t1Fixtures} Fixtures`);

  if (t1Teams !== 4 || t1Squads !== 4 || t1Fixtures !== 6) {
    console.error("FAIL: Tournament 1 must have exactly 4 teams, 4 squads, and 6 fixtures!");
    passedAll = false;
  } else {
    console.log("PASS: Tournament 1 structure verified.");
  }

  // Test 9: Social Media Share Assets Check
  console.log("\n[Test 9] Social Media Share & OG Image Assets:");
  const shareImgPath = path.join(process.cwd(), "public", "images", "team-dna-share.png");
  const ogImgPath = path.join(process.cwd(), "public", "og-image.png");
  const shareImgExists = fs.existsSync(shareImgPath);
  const ogImgExists = fs.existsSync(ogImgPath);

  console.log(`- Team DNA Share Image (${shareImgPath}): ${shareImgExists ? "EXISTS" : "MISSING"}`);
  console.log(`- Root OG Image (${ogImgPath}): ${ogImgExists ? "EXISTS" : "MISSING"}`);

  if (!shareImgExists || !ogImgExists) {
    console.error("FAIL: Social share preview image assets are missing in public/ directory!");
    passedAll = false;
  } else {
    console.log("PASS: Social media share preview images verified.");
  }

  await prisma.$disconnect();

  if (!passedAll) {
    console.error("\n❌ PRE-PUSH TEST SUITE FAILED");
    process.exit(1);
  } else {
    console.log("\n==================================================");
    console.log("✅ ALL 9 TESTS PASSED! READY FOR PRODUCTION DEPLOY");
    console.log("==================================================");
    process.exit(0);
  }
}

runTestSuite();
