import { getSampleScorecardExtraction } from "../src/lib/extractor-service";
import { validateIndoorCricketScorecard } from "../src/lib/rules-engine";
import { evaluateQualityGate } from "../src/lib/quality-gate";
import { checkForDuplicateScorecard } from "../src/lib/duplicate-detector";
import { generateCaptainInsights } from "../src/lib/captain-insights";
import { prisma } from "../src/lib/prisma";

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

  // Test 2: Contribution Math (C = RS - RC)
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

  await prisma.$disconnect();

  if (!passedAll) {
    console.error("\n❌ PRE-PUSH TEST SUITE FAILED");
    process.exit(1);
  } else {
    console.log("\n✅ ALL TESTS PASSED SUCCESSFULLY! Ready to push.");
    process.exit(0);
  }
}

runTestSuite();
