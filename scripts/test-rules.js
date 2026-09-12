const { getSampleScorecardExtraction } = require("../src/lib/extractor-service");
const { validateIndoorCricketScorecard } = require("../src/lib/rules-engine");
const { evaluateQualityGate } = require("../src/lib/quality-gate");

console.log("=== RUNNING DESISPORTS V2 AUTOMATED TESTS ===");

// Test 1: Spawtz Rules Engine & Reconciliations
console.log("\n[Test 1] Spawtz Rules Reconciliation:");
const sample = getSampleScorecardExtraction();
const report = validateIndoorCricketScorecard(sample);

console.log(`- Overall Passed: ${report.passed}`);
console.log(`- Confidence Score: ${report.confidenceScore}%`);
console.log(`- High Confidence Label (>=95%): ${report.highConfidenceLabel}`);
console.log(`- Critical Issues Count: ${report.issues.filter(i => i.severity === 'error').length}`);

if (!report.passed || report.confidenceScore < 95) {
  console.error("FAIL: Spawtz rules validation did not reach 95%+ confidence!");
  process.exit(1);
}
console.log("PASS: Indoor cricket Spawtz sheet successfully reconciled.");

// Test 2: Contribution Math
console.log("\n[Test 2] Contribution Formula (C = RS - RC):");
const yash = sample.awayInnings.playerSummaries.find(p => p.name === "YASH");
const manthan = sample.homeInnings.playerSummaries.find(p => p.name === "MANTHAN");

console.log(`- Yash: RS=${yash.runsScored}, RC=${yash.runsConceded}, C=${yash.contribution}`);
if (yash.runsScored - yash.runsConceded !== yash.contribution) {
  console.error("FAIL: Yash contribution does not equal RS - RC");
  process.exit(1);
}

console.log(`- Manthan: RS=${manthan.runsScored}, RC=${manthan.runsConceded}, C=${manthan.contribution}`);
if (manthan.runsScored - manthan.runsConceded !== manthan.contribution) {
  console.error("FAIL: Manthan contribution does not equal RS - RC");
  process.exit(1);
}
console.log("PASS: Contribution formula verified.");

// Test 3: Quality Gate Checks
console.log("\n[Test 3] Quality Gate Thresholds:");
const validGate = evaluateQualityGate(1600, 2844, {
  meanLuminosity: 150,
  specularFraction: 0.02,
  laplacianVariance: 220,
});
console.log(`- Valid image pass: ${validGate.overallPass} (Score: ${validGate.score}%)`);
if (!validGate.overallPass) {
  console.error("FAIL: High-res sample failed quality gate");
  process.exit(1);
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
  process.exit(1);
}
console.log("PASS: Quality gate checks and retake prompts verified.");

console.log("\n=== ALL AUTOMATED TESTS PASSED ===");
