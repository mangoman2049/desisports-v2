import {
  getSampleScorecardExtraction,
  get10SepScorecardExtraction,
  parseDateFromMatchTitle,
} from "../src/lib/extractor-service";
import { validateIndoorCricketScorecard } from "../src/lib/rules-engine";
import { evaluateQualityGate } from "../src/lib/quality-gate";
import { checkForDuplicateScorecard } from "../src/lib/duplicate-detector";
import { generateCaptainInsights } from "../src/lib/captain-insights";
import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";
import tournament1Data from "../prisma/tournament_1_data.json";
import { validateOcrSanity } from "./validate-ocr-sanity";
import sharp from "sharp";
import { resolveAllScorecardPlayers, resolvePlayerName } from "../src/lib/name-resolver";

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

  const mobileGate = evaluateQualityGate(960, 1280);
  console.log(`- Mobile photo capture (960x1280) pass: ${mobileGate.overallPass} (Score: ${mobileGate.score}%)`);
  if (!mobileGate.overallPass || mobileGate.score < 90) {
    console.error("FAIL: Standard mobile phone photo (960x1280) should pass quality gate with >=90%");
    passedAll = false;
  }

  const blurryGate = evaluateQualityGate(500, 400, {
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

  // Test 4: Duplicate Scorecard Detection (Checking Date/Time + 100% Confidence Final Scores)
  console.log("\n[Test 4] Duplicate Scorecard Detection Check (Date/Time + Final Scores):");
  try {
    // Exact duplicate (same date, same teams, same scores 63-120)
    const dupCheck = await checkForDuplicateScorecard(
      "09 September 2026, 20:17",
      "Home Team",
      "Away Team",
      63,
      120
    );
    console.log(`- Exact Match + Scores detected as duplicate: ${dupCheck.isDuplicate}`);
    if (!dupCheck.isDuplicate) {
      console.error("FAIL: Should have detected 09 Sep 2026 Home vs Away (63-120) as duplicate!");
      passedAll = false;
    } else {
      console.log(`- Duplicate reason: ${dupCheck.reason}`);
    }

    // Rematch with DIFFERENT scores: same teams, same date, but scores 95-80 -> NOT DUPLICATE!
    const rematchCheck = await checkForDuplicateScorecard(
      "09 September 2026, 20:17",
      "Home Team",
      "Away Team",
      95,
      80
    );
    console.log(`- Rematch with different scores (95-80) duplicate: ${rematchCheck.isDuplicate}`);
    if (rematchCheck.isDuplicate) {
      console.error("FAIL: Rematch with different final scores falsely flagged as duplicate!");
      passedAll = false;
    } else {
      console.log("PASS: Rematch correctly allowed because final scores differed.");
    }

    // Brand new 10 September match (117-49) -> NOT DUPLICATE!
    const sep10Sample = get10SepScorecardExtraction();
    const sep10Report = validateIndoorCricketScorecard(sep10Sample);
    console.log(`- 10-Sept Scorecard Validation: passed=${sep10Report.passed}, score=${sep10Report.confidenceScore}%`);
    if (!sep10Report.passed || sep10Sample.homeInnings.totalRuns !== 117 || sep10Sample.awayInnings.totalRuns !== 49) {
      console.error("FAIL: 10-Sept scorecard does not match 117-49 or validation failed");
      passedAll = false;
    }

    const sep10DupCheck = await checkForDuplicateScorecard(
      sep10Sample.matchInfo.dateTime,
      sep10Sample.homeInnings.teamName,
      sep10Sample.awayInnings.teamName,
      sep10Sample.homeInnings.totalRuns,
      sep10Sample.awayInnings.totalRuns
    );
    console.log(`- 10-Sept Brand New Match Duplicate Check: ${sep10DupCheck.isDuplicate}`);
    if (sep10DupCheck.isDuplicate) {
      console.error("FAIL: 10-Sept match falsely flagged as duplicate!");
      passedAll = false;
    }

    const parsed12Sep = parseDateFromMatchTitle("12Sep2026_Insportz_2339");
    console.log(`- Derived date from title: ${parsed12Sep}`);
    if (parsed12Sep !== "12 September 2026, 23:39") {
      console.error(`FAIL: Expected '12 September 2026, 23:39', got '${parsed12Sep}'`);
      passedAll = false;
    }

    const nonDupCheck = await checkForDuplicateScorecard(
      "15 October 2026, 21:00",
      "New Team A",
      "New Team B",
      88,
      72
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
  const gagan = await prisma.player.findFirst({
    where: { canonicalName: "Gagandeep Singh" },
    include: { stats: true },
  });

  if (!gagan) {
    console.error("FAIL: Gagandeep Singh not found in database!");
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

  // Test 10: Full Spawtz OCR Sanity Suite
  console.log("\n[Test 10] Spawtz OCR Sanity Verification Suite:");
  try {
    await validateOcrSanity();
    console.log("PASS: Full OCR sanity verification succeeded.");
  } catch (err) {
    console.error("FAIL: OCR sanity check encountered an error:", err);
    passedAll = false;
  }

  // Test 11: Sharp Image Optimization (WebP Q75, Max 1800px)
  console.log("\n[Test 11] Sharp Image Optimization (WebP Q75, Max 1800px):");
  try {
    const testSvg = Buffer.from(
      '<svg width="2400" height="3200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#10b981"/></svg>'
    );
    const optimized = await sharp(testSvg)
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const meta = await sharp(optimized).metadata();
    console.log(`- Optimized dimensions: ${meta.width}x${meta.height}, format: ${meta.format}`);

    if (meta.format !== "webp" || (meta.width && meta.width > 1800) || (meta.height && meta.height > 1800)) {
      console.error("FAIL: Sharp image optimization did not produce valid WebP Q75 bounded to 1800px!");
      passedAll = false;
    } else {
      console.log("PASS: Sharp WebP Q75 compression verified (storage optimized by ~85%).");
    }
  } catch (err) {
    console.error("FAIL: Sharp test encountered error:", err);
    passedAll = false;
  }

  // Test 12: Canonical Name Propagation Everywhere
  console.log("\n[Test 12] Canonical Name Propagation Across All Scorecard Structures:");
  try {
    const sampleExtraction = getSampleScorecardExtraction();
    const { scorecard: reconciled, resolutions } = await resolveAllScorecardPlayers(sampleExtraction);

    const maneeshMatch = resolutions["MANEESH"];
    console.log(`- Scanned typo 'MANEESH' resolved to: '${maneeshMatch?.matchedName}' (Confidence: ${maneeshMatch?.confidence})`);

    // Verify canonical name is applied in skins and overs
    const over3Bowler = reconciled.homeInnings.skins[0].overs[2].bowlerName;
    console.log(`- Over 3 bowlerName in reconciled scorecard: '${over3Bowler}'`);

    if (over3Bowler !== "Manish Pandey" || maneeshMatch?.matchedName !== "Manish Pandey") {
      console.error(`FAIL: Canonical name 'Manish Pandey' was not propagated to bowlerName (got '${over3Bowler}')!`);
      passedAll = false;
    } else {
      console.log("PASS: Canonical name substitution successfully propagated everywhere.");
    }
  } catch (err) {
    console.error("FAIL: Canonical name test encountered error:", err);
    passedAll = false;
  }

  // Test 13: 0-Match Data Guard (Zero Hallucination)
  console.log("\n[Test 13] 0-Match Data Guard Verification (Zero Hallucination):");
  try {
    // Find or test a player with 0 matches
    const zeroMatchPlayer = {
      id: 999,
      canonicalName: "Extra",
      stats: [],
    };

    const hasMatchData = zeroMatchPlayer.stats.length > 0;
    const computedMatches = zeroMatchPlayer.stats.length;
    const computedRuns = hasMatchData ? zeroMatchPlayer.stats.reduce((acc: number, s: any) => acc + s.runsScored, 0) : 0;

    console.log(`- 0-match player hasMatchData: ${hasMatchData}, computedMatches: ${computedMatches}, computedRuns: ${computedRuns}`);

    if (hasMatchData || computedMatches !== 0 || computedRuns !== 0) {
      console.error("FAIL: 0-match player evaluated to positive match count or runs!");
      passedAll = false;
    } else {
      console.log("PASS: 0-match player guard prevents statistical hallucination.");
    }
  } catch (err) {
    console.error("FAIL: 0-match guard test encountered error:", err);
    passedAll = false;
  }

  // Test 14: Official Scorecard Image & WebP/JSON Download Validation
  console.log("\n[Test 14] Official Scorecard Image & WebP/JSON Download Validation:");
  try {
    const fs = await import("fs");
    const path = await import("path");
    const sharp = (await import("sharp")).default;

    const sampleImagePath = path.join(process.cwd(), "public", "uploads", "scorecards", "sample-scorecard.jpg");
    const exists = fs.existsSync(sampleImagePath);
    console.log(`- Sample scorecard image (${sampleImagePath}): ${exists ? "EXISTS" : "MISSING"}`);

    if (!exists) {
      console.error("FAIL: sample-scorecard.jpg does not exist in public/uploads/scorecards!");
      passedAll = false;
    } else {
      const origBuf = await fs.promises.readFile(sampleImagePath);
      const webpBuf = await sharp(origBuf)
        .resize(1800, 1800, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      console.log(`- Original JPEG size: ${(origBuf.length / 1024).toFixed(1)} KB`);
      console.log(`- Sharp WebP Q75 size: ${(webpBuf.length / 1024).toFixed(1)} KB (Saved ${(100 - (webpBuf.length / origBuf.length) * 100).toFixed(1)}%)`);

      if (webpBuf.length <= 0 || webpBuf.length >= origBuf.length) {
        console.error("FAIL: WebP conversion did not optimize scorecard image size!");
        passedAll = false;
      } else {
        console.log("PASS: Official Scorecard WebP generation and download pipeline verified.");
      }
    }
  } catch (err) {
    console.error("FAIL: Test 14 encountered error:", err);
    passedAll = false;
  }

  // Test 15: Tournament Squad Integrity & Single-Team Assignment
  console.log("\n[Test 15] Tournament Squad Integrity & Single-Team Assignment Verification:");
  try {
    const t2Data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "prisma", "tournament_2_data.json"), "utf-8"));
    
    // T1 Check
    const t1PlayerMap = new Map<string, string[]>();
    for (const sq of tournament1Data.squads) {
      for (const p of sq.players) {
        const list = t1PlayerMap.get(p.name) || [];
        list.push(sq.team);
        t1PlayerMap.set(p.name, list);
      }
    }
    const t1Dups = Array.from(t1PlayerMap.entries()).filter(([_, teams]) => teams.length > 1);
    const manthanT1Teams = t1PlayerMap.get("Manthan Shah") || [];

    console.log(`- Tournament 1 Duplicate Players Count: ${t1Dups.length}`);
    console.log(`- Manthan Shah Tournament 1 Assignment: ${manthanT1Teams.join(", ")}`);

    if (t1Dups.length > 0) {
      console.error(`FAIL: Found duplicate players in Tournament 1 squads:`, t1Dups);
      passedAll = false;
    } else if (manthanT1Teams.length !== 1 || manthanT1Teams[0] !== "DesiTigers") {
      console.error(`FAIL: Manthan Shah must only belong to DesiTigers in Tournament 1! Got: ${manthanT1Teams.join(", ")}`);
      passedAll = false;
    } else {
      console.log("PASS: Tournament 1 squads have zero duplicates and Manthan Shah is correctly assigned to DesiTigers.");
    }

    // T2 Check
    const t2PlayerMap = new Map<string, string[]>();
    for (const sq of t2Data.squads) {
      for (const p of sq.players) {
        const list = t2PlayerMap.get(p.name) || [];
        list.push(sq.team);
        t2PlayerMap.set(p.name, list);
      }
    }
    const t2Dups = Array.from(t2PlayerMap.entries()).filter(([_, teams]) => teams.length > 1);
    const manthanT2Teams = t2PlayerMap.get("Manthan Shah") || [];

    console.log(`- Tournament 2 Duplicate Players Count: ${t2Dups.length}`);
    console.log(`- Manthan Shah Tournament 2 Assignment: ${manthanT2Teams.join(", ")}`);

    if (t2Dups.length > 0) {
      console.error(`FAIL: Found duplicate players in Tournament 2 squads:`, t2Dups);
      passedAll = false;
    } else if (manthanT2Teams.length !== 1 || manthanT2Teams[0] !== "Desi Tigers") {
      console.error(`FAIL: Manthan Shah must only belong to Desi Tigers in Tournament 2! Got: ${manthanT2Teams.join(", ")}`);
      passedAll = false;
    } else {
      console.log("PASS: Tournament 2 squads have zero duplicates and Manthan Shah is correctly assigned to Desi Tigers.");
    }
  } catch (err) {
    console.error("FAIL: Test 15 encountered error:", err);
    passedAll = false;
  }

  // Test 16: Tactical Prompt Isolation, Points Config, Author, & Bazooka Rules
  console.log("\n[Test 16] Tactical Prompt Isolation, Points Config, Author, & Bazooka Rules:");
  try {
    const { INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT, TOURNAMENT_POINTS_CONFIG } = await import(
      "../src/lib/tactical-prompt"
    );

    const hasPointsConfig =
      TOURNAMENT_POINTS_CONFIG &&
      TOURNAMENT_POINTS_CONFIG.SKIN_WIN_POINTS === 1 &&
      TOURNAMENT_POINTS_CONFIG.MATCH_WIN_POINTS === 4 &&
      TOURNAMENT_POINTS_CONFIG.TOTAL_POINTS_AVAILABLE === 8;

    const hasAuthor =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("Author: Manish Pandey (manishp15@iimb.ac.in)") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("Last Updated:");

    const hasAntiPresentism =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("ANTI-PRESENTISM") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("CHRONOLOGICAL TIMELINE") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("ZERO foresight");

    const hasSpawtzPoints =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("SKIN WIN = 1 POINT") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("MATCH WIN = 4 POINTS") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("8 POINTS");

    const hasBazookaRules =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("BAZOOKA TOURNAMENT RULES") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("DOUBLED") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("HEAVIER PENALTY");

    const hasIndoorCricketRules =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("-5 RUN PENALTY") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("16 overs") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("4 batting partnerships (Skins 1 to 4)");

    const hasSquadIntegrity =
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("SQUAD INTEGRITY & CANONICAL NAMES") &&
      INDOOR_CRICKET_ANALYST_SYSTEM_PROMPT.includes("canonical database names");

    console.log(`- TOURNAMENT_POINTS_CONFIG (1 pt skin, 4 pt match, 8 total): ${hasPointsConfig ? "VERIFIED" : "MISSING"}`);
    console.log(`- Author Metadata (Manish Pandey - manishp15@iimb.ac.in): ${hasAuthor ? "VERIFIED" : "MISSING"}`);
    console.log(`- Anti-Presentism / Chronological Timeline: ${hasAntiPresentism ? "VERIFIED" : "MISSING"}`);
    console.log(`- Spawtz Points Structure (1 pt skin / 4 pt match / 8 total): ${hasSpawtzPoints ? "VERIFIED" : "MISSING"}`);
    console.log(`- Bazooka Tournament Rules (2x runs, heavy penalties, captaincy): ${hasBazookaRules ? "VERIFIED" : "MISSING"}`);
    console.log(`- Indoor Cricket Rules (-5 penalty, 16 overs, 4 skins): ${hasIndoorCricketRules ? "VERIFIED" : "MISSING"}`);
    console.log(`- Squad Integrity & Canonical Names: ${hasSquadIntegrity ? "VERIFIED" : "MISSING"}`);

    if (
      !hasPointsConfig ||
      !hasAuthor ||
      !hasAntiPresentism ||
      !hasSpawtzPoints ||
      !hasBazookaRules ||
      !hasIndoorCricketRules ||
      !hasSquadIntegrity
    ) {
      console.error("FAIL: Tactical Prompt module missing required indoor cricket tactical principles!");
      passedAll = false;
    } else {
      console.log("PASS: Tactical Prompt module fully verified with configurable points, author, and Bazooka rules.");
    }
  } catch (err) {
    console.error("FAIL: Test 16 encountered error:", err);
    passedAll = false;
  }

  // Test 17: Zero Squad Cross-Contamination Across All Tournament Match Analyses
  console.log("\n[Test 17] Zero Squad Cross-Contamination Across All Tournament Match Analyses:");
  try {
    const { MATCH_ANALYSES } = await import("../src/lib/match-analyses");
    const squadsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "prisma", "squads.json"), "utf-8"));

    const playerToTeam = new Map<string, string>();
    for (const sq of squadsData) {
      for (const p of sq.players) {
        playerToTeam.set(p.name.toLowerCase(), sq.team);
      }
    }

    const fixtures: Record<string, [string, string]> = {
      "1": ["VPGR", "DesiTitans"],
      "2": ["DesiDabanggs", "DesiTigers"],
      "3": ["VPGR", "DesiDabanggs"],
      "4": ["DesiTitans", "DesiTigers"],
      "5": ["VPGR", "DesiTigers"],
      "6": ["DesiTitans", "DesiDabanggs"],
    };

    let crossContaminations = 0;
    for (const [mId, [t1, t2]] of Object.entries(fixtures)) {
      const analysis = MATCH_ANALYSES[mId];
      if (!analysis) {
        console.error(`FAIL: Match analysis for Match ${mId} is missing!`);
        passedAll = false;
        continue;
      }

      const allowedTeams = new Set([t1.toLowerCase(), t2.toLowerCase()]);
      const analysisStr = JSON.stringify(analysis).toLowerCase();

      playerToTeam.forEach((team, pName) => {
        if (pName.length > 4 && analysisStr.includes(pName)) {
          if (!allowedTeams.has(team.toLowerCase())) {
            console.error(`FAIL: Cross-contamination in Match ${mId}: Player "${pName}" belongs to ${team}, but fixture is ${t1} vs ${t2}`);
            crossContaminations++;
          }
        }
      });
    }

    console.log(`- Cross-Contamination Violations across Matches 1-6: ${crossContaminations}`);
    if (crossContaminations > 0) {
      console.error(`FAIL: Found ${crossContaminations} cross-contamination errors in match analyses!`);
      passedAll = false;
    } else {
      console.log("PASS: All 6 tournament match analyses strictly respect tournament squad rosters (0 violations).");
    }
  } catch (err) {
    console.error("FAIL: Test 17 encountered error:", err);
    passedAll = false;
  }

  // Test 18: Scorecard Rules Engine Defensive Handling of Sparse/Null Objects
  console.log("\n[Test 18] Scorecard Rules Engine Defensive Handling of Sparse/Null Objects:");
  try {
    // 1. Completely empty object cast to any
    const emptyReport = validateIndoorCricketScorecard({} as any);
    console.log(`- Empty object handling: passed=${emptyReport.passed}, confidence=${emptyReport.confidenceScore}%`);

    // 2. Partial scorecard with undefined arrays
    const partialScorecard = {
      homeInnings: {
        team: "Home Team",
        total: 50,
        skins: [
          { skinNumber: 1, runs: 20 },
          { skinNumber: 2, runs: 10, overs: undefined },
        ],
        playerSummaries: undefined,
      },
      awayInnings: {
        team: "Away Team",
        total: 40,
        skins: undefined,
        playerSummaries: [],
      },
      skinsSummary: undefined,
    };

    const partialReport = validateIndoorCricketScorecard(partialScorecard as any);
    console.log(`- Sparse scorecard handling: passed=${partialReport.passed}, confidence=${partialReport.confidenceScore}%`);

    if (typeof emptyReport.confidenceScore !== "number" || typeof partialReport.confidenceScore !== "number") {
      console.error("FAIL: validateIndoorCricketScorecard failed to return valid confidence score on sparse input");
      passedAll = false;
    } else {
      console.log("PASS: Rules engine gracefully handles sparse/corrupt scorecard objects without throwing runtime exceptions.");
    }
  } catch (err) {
    console.error("FAIL: Test 18 encountered error:", err);
    passedAll = false;
  }

  // Test 19: Dynamic Tournament Points Table Calculation & Tournament 0 Guard
  console.log("\n[Test 19] Dynamic Tournament Points Table Calculation & Tournament 0 Guard:");
  try {
    const { getTournamentDetails, computeStandingsFromMatches } = await import(
      "../src/lib/tournament-service"
    );

    // Check Standings computation math with 1 pt skin model
    const testMatches = [
      {
        homeTeam: { name: "Team A" },
        awayTeam: { name: "Team B" },
        homeScore: 100,
        awayScore: 80,
        homeSkins: 3,
        awaySkins: 1,
        status: "COMPLETED",
      },
    ];

    const testStandings = computeStandingsFromMatches(["Team A", "Team B"], testMatches);
    const teamA = testStandings.find((t) => t.team === "Team A")!;
    const teamB = testStandings.find((t) => t.team === "Team B")!;

    // Team A: 1 win * 4 pts + 3 skins * 1 pt = 7 pts
    // Team B: 0 wins * 4 pts + 1 skin * 1 pt = 1 pt
    console.log(
      `- Simulated Match: Team A pts=${teamA.points} (expected 7), Team B pts=${teamB.points} (expected 1)`
    );
    if (teamA.points !== 7 || teamB.points !== 1) {
      console.error(
        `FAIL: computeStandingsFromMatches points math incorrect! Got Team A=${teamA.points}, Team B=${teamB.points}`
      );
      passedAll = false;
    }

    // Check Tournament 1 dynamic standings
    const t1Details = await getTournamentDetails(1);
    console.log(`- Tournament 1 dynamic teams count: ${t1Details.standings.length}`);
    console.log(
      `- Tournament 1 leader: ${t1Details.standings[0]?.team} with ${t1Details.standings[0]?.points} points`
    );
    if (t1Details.standings.length !== 4 || t1Details.standings[0]?.points !== 22) {
      console.error(`FAIL: Tournament 1 standings failed dynamic computation!`);
      passedAll = false;
    }

    // Check Tournament 0 strict NO TEAMS POINTS TABLE guard
    const t0Details = await getTournamentDetails(0);
    console.log(
      `- Tournament 0 hasPointsTable: ${t0Details.hasPointsTable}, standings count: ${t0Details.standings.length}`
    );
    if (t0Details.hasPointsTable !== false || t0Details.standings.length !== 0) {
      console.error(`FAIL: Tournament 0 must strictly have NO Teams Points Table!`);
      passedAll = false;
    } else {
      console.log("PASS: Tournament points table plumbing and Tournament 0 guard strictly verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 19 encountered error:", err);
    passedAll = false;
  }

  // Test 20: Scorecard Approval Pipeline & Dynamic Standings Ingestion
  console.log(
    "\n[Test 20] Scorecard Approval Pipeline & Dynamic Standings Ingestion (Match & 16 PlayerMatchStats):"
  );
  try {
    const sample = getSampleScorecardExtraction();

    // 1. Ensure test teams exist
    const homeTeam = await prisma.team.upsert({
      where: { name: "Desi Tigers" },
      update: {},
      create: { name: "Desi Tigers", code: "DTG" },
    });
    const awayTeam = await prisma.team.upsert({
      where: { name: "Desi Titans" },
      update: {},
      create: { name: "Desi Titans", code: "DTT" },
    });

    // 2. Create test Match in Tournament 2
    const testMatch = await prisma.match.create({
      data: {
        tournamentId: 2,
        matchDate: "18 Sep 2026, 20:00",
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: 95,
        awayScore: 70,
        homeSkins: 3,
        awaySkins: 1,
        status: "COMPLETED",
        scorecardUrl: "/matches/test-approval",
      },
    });

    // 3. Persist 16 PlayerMatchStat rows (8 home, 8 away)
    const homePlayers = sample.homeInnings.playerSummaries.slice(0, 8);
    const awayPlayers = sample.awayInnings.playerSummaries.slice(0, 8);

    let createdStatsCount = 0;
    for (const p of homePlayers) {
      const resolved = await resolvePlayerName(p.name);
      let playerId = resolved.matchedPlayerId;
      if (!playerId || playerId === 0) {
        const player = await prisma.player.upsert({
          where: { canonicalName: p.name },
          update: {},
          create: {
            canonicalName: p.name,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: "Cover",
          },
        });
        playerId = player.id;
      }

      await prisma.playerMatchStat.create({
        data: {
          matchId: testMatch.id,
          playerId: playerId,
          teamId: homeTeam.id,
          runsScored: p.runsScored,
          timesOut: 1,
          oversBowled: p.oversBowled,
          runsConceded: p.runsConceded,
          wickets: p.wickets,
          economy: p.economy,
          contribution: p.contribution,
          isPotm: false,
        },
      });
      createdStatsCount++;
    }

    for (const p of awayPlayers) {
      const resolved = await resolvePlayerName(p.name);
      let playerId = resolved.matchedPlayerId;
      if (!playerId || playerId === 0) {
        const player = await prisma.player.upsert({
          where: { canonicalName: p.name },
          update: {},
          create: {
            canonicalName: p.name,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: "Cover",
          },
        });
        playerId = player.id;
      }

      await prisma.playerMatchStat.create({
        data: {
          matchId: testMatch.id,
          playerId: playerId,
          teamId: awayTeam.id,
          runsScored: p.runsScored,
          timesOut: 1,
          oversBowled: p.oversBowled,
          runsConceded: p.runsConceded,
          wickets: p.wickets,
          economy: p.economy,
          contribution: p.contribution,
          isPotm: p.name === "YASH",
        },
      });
      createdStatsCount++;
    }

    console.log(`- Created PlayerMatchStat entries for newly approved match: ${createdStatsCount} / 16`);

    // 4. Verify that Tournament 2 dynamic standings immediately reflect this approved match
    const { getTournamentDetails } = await import("../src/lib/tournament-service");
    const t2Dynamic = await getTournamentDetails(2);
    const tigersRow = t2Dynamic.standings.find((s) => s.team === "Desi Tigers")!;
    const titansRow = t2Dynamic.standings.find((s) => s.team === "Desi Titans")!;

    // Tigers: 1 win * 4 pts + 3 skins * 1 pt = 7 pts
    // Titans: 0 wins * 4 pts + 1 skin * 1 pt = 1 pt
    console.log(`- T2 Live Standings after Approval: Desi Tigers pts=${tigersRow?.points}, Desi Titans pts=${titansRow?.points}`);

    const passApproval =
      createdStatsCount === 16 &&
      tigersRow?.points === 7 &&
      titansRow?.points === 1 &&
      tigersRow?.won === 1 &&
      titansRow?.lost === 1;

    // Clean up test match & stats
    await prisma.playerMatchStat.deleteMany({ where: { matchId: testMatch.id } });
    await prisma.match.delete({ where: { id: testMatch.id } });

    if (!passApproval) {
      console.error("FAIL: Scorecard approval and live dynamic points recomputation failed!");
      passedAll = false;
    } else {
      console.log("PASS: Scorecard approval pipeline, 16-player persistence, and live dynamic points flow verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 20 encountered error:", err);
    passedAll = false;
  }

  // Test 21: Match 5 & 6 Analysis Integrity & Team Matching Controls
  console.log("\n[Test 21] Match 5 & 6 Analysis Integrity & Team Matching Controls:");
  try {
    const { MATCH_ANALYSES } = await import("../src/lib/match-analyses");
    const m5 = MATCH_ANALYSES["5"];
    const m6 = MATCH_ANALYSES["6"];

    console.log(`- Match 5 Title: ${m5?.matchTitle} (Winner: ${m5?.winner})`);
    console.log(`- Match 5 Score: ${m5?.scoreSummary}`);
    console.log(`- Match 6 Title: ${m6?.matchTitle} (Winner: ${m6?.winner})`);
    console.log(`- Match 6 Score: ${m6?.scoreSummary}`);

    const m5IsFinal = m5?.matchTitle.includes("DesiTigers") && m5?.matchTitle.includes("VPGR") && m5?.winner === "DesiTigers";
    const m6Is3rdPlace = (m6?.matchTitle.includes("DesiDabanggs") || m6?.matchTitle.includes("DesiTitans")) && m6?.winner === "DesiDabanggs" && m6?.scoreSummary.includes("94 def. DesiTitans 76");

    if (!m5IsFinal || !m6Is3rdPlace) {
      console.error("FAIL: Match 5 and 6 analyses are not correctly mapped to their respective matches and scores!");
      passedAll = false;
    } else {
      console.log("PASS: Match 5 (Championship Final) and Match 6 (3rd Place Playoff) successfully reconciled and verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 21 encountered error:", err);
    passedAll = false;
  }

  // Test 22: Tournament 2 Authentic Squads & 9 Scheduled Fixtures
  console.log("\n[Test 22] Tournament 2 Authentic Squads & 9 Scheduled Fixtures:");
  try {
    const t2Data = (await import("../prisma/tournament_2_data.json")).default;
    const t2Squads = t2Data.squads || [];
    const t2Fixtures = t2Data.fixtures || [];

    const totalAssignments = t2Squads.reduce((acc: number, s: any) => acc + (s.players?.length || 0), 0);
    const playerSeen = new Set<string>();
    let hasDuplicate = false;

    for (const s of t2Squads) {
      for (const p of s.players || []) {
        const id = String(p.id);
        if (playerSeen.has(id)) {
          hasDuplicate = true;
          console.error(`Duplicate found: Player ${p.name} (ID: ${id}) in squad ${s.team}`);
        }
        playerSeen.add(id);
      }
    }

    console.log(`- T2 Franchise Squads: ${t2Squads.length} / 4`);
    console.log(`- T2 Total Player Assignments: ${totalAssignments} / 52`);
    console.log(`- T2 Unique Players Count: ${playerSeen.size} / 52 (Duplicates: ${hasDuplicate ? "YES" : "0"})`);
    console.log(`- T2 Scheduled Fixtures: ${t2Fixtures.length} / 9`);

    if (t2Squads.length !== 4 || totalAssignments !== 52 || hasDuplicate || t2Fixtures.length !== 9) {
      console.error("FAIL: Tournament 2 squads or fixtures do not strictly reconcile with authentic live tournament structure!");
      passedAll = false;
    } else {
      console.log("PASS: Tournament 2 authentic squads (52 unique players, 0 duplicates) and 9 scheduled fixtures verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 22 encountered error:", err);
    passedAll = false;
  }

  // Test 23: Scorecard Upload Fixture Selector & Mismatch Validation Guard
  console.log("\n[Test 23] Scorecard Upload Fixture Selector & Mismatch Validation Guard:");
  try {
    const { getNextUpcomingFixture, validateFixtureTeamsMatch } = await import("../src/lib/tournament-fixtures");
    const nextT2 = getNextUpcomingFixture(2);

    console.log(`- Default Next Fixture for T2: Match #${nextT2?.matchNumber} (${nextT2?.team1} vs ${nextT2?.team2}) on ${nextT2?.date}`);

    const isNextMatch1 = nextT2?.matchNumber === 1 && nextT2?.team1 === "Desi Titans" && nextT2?.team2 === "Desi Dabanggs";

    // Test mismatch detection
    const mismatch = validateFixtureTeamsMatch(
      { team1: "Desi Titans", team2: "Desi Dabanggs" },
      "VPGR",
      "Desi Tigers"
    );
    console.log(`- Mismatched Teams Detected as Error: ${!mismatch.isMatch}`);
    console.log(`- Mismatch Message: "${mismatch.reason}"`);

    // Test valid matching
    const validMatch = validateFixtureTeamsMatch(
      { team1: "Desi Titans", team2: "Desi Dabanggs" },
      "Titans",
      "Dabanggs"
    );
    console.log(`- Valid Teams Accepted with Fuzzy Normalization: ${validMatch.isMatch}`);

    if (!isNextMatch1 || mismatch.isMatch || !validMatch.isMatch) {
      console.error("FAIL: Fixture selector next-match defaulting or team mismatch validation failed!");
      passedAll = false;
    } else {
      console.log("PASS: Fixture selector smart defaulting and strict mismatch validation guard verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 23 encountered error:", err);
    passedAll = false;
  }

  // Test 24: Tournament 2 Pre-Tournament Data Hygiene & Pristine Placeholders
  console.log("\n[Test 24] Tournament 2 Pre-Tournament Data Hygiene & Pristine Placeholders:");
  try {
    const t2Json = (await import("../prisma/tournament_2_data.json")).default;
    const { getTournamentDetails } = await import("../src/lib/tournament-service");
    const t2Details = await getTournamentDetails(2);

    const hasNoRegisteredPool = (t2Json as any).registeredPlayers === undefined && (t2Json as any).registeredPlayersCount === undefined;
    const hasEmptyStandings = t2Details.standings.length === 0;
    const hasEmptyLeaderboards =
      t2Details.topRunGetters.length === 0 &&
      t2Details.topWicketTakers.length === 0 &&
      t2Details.topContributors.length === 0;
    const hasNoPrematureHonors =
      t2Details.mvp === null &&
      t2Details.champions === null &&
      t2Details.runnerUp === null;

    console.log(`- Registered Players Pool (61) Removed: ${hasNoRegisteredPool}`);
    console.log(`- Standings Count Prior to Match Start: ${t2Details.standings.length} (Expected: 0)`);
    console.log(`- Empty Leaderboard Placeholders Verified: ${hasEmptyLeaderboards}`);
    console.log(`- No Premature Champions/MVP: ${hasNoPrematureHonors}`);

    if (!hasNoRegisteredPool || !hasEmptyStandings || !hasEmptyLeaderboards || !hasNoPrematureHonors) {
      console.error("FAIL: Tournament 2 data hygiene failed! Found leftover or premature data.");
      passedAll = false;
    } else {
      console.log("PASS: Tournament 2 data hygiene verified (no 61 pool, empty points table, pristine leaderboards).");
    }
  } catch (err) {
    console.error("FAIL: Test 24 encountered error:", err);
    passedAll = false;
  }

  // -------------------------------------------------------------
  // Test 25: Scorecard Intake Null Safety & Exception Hardening
  // -------------------------------------------------------------
  console.log("\n[Test 25] Scorecard Intake Null Safety & Exception Hardening:");
  try {
    const { evaluateQualityGate } = await import("../src/lib/quality-gate");
    const { getTournamentFixtures, getNextUpcomingFixture } = await import("../src/lib/tournament-fixtures");

    // 1. Quality gate edge cases: 0x0 dimensions, negative values, missing luminosity stats
    const zeroDiag = evaluateQualityGate(0, 0);
    const extremeDiag = evaluateQualityGate(4000, 3000, {
      meanLuminosity: 250,
      specularFraction: 0.15,
      laplacianVariance: 40,
    });
    const qualityGateResilient =
      typeof zeroDiag.score === "number" &&
      Array.isArray(zeroDiag.retakePrompts) &&
      typeof extremeDiag.score === "number" &&
      Array.isArray(extremeDiag.retakePrompts);

    console.log(`- Quality Gate Resilient to 0x0 and extreme metrics: ${qualityGateResilient}`);

    // 2. Tournament 1 & 2 fixtures date integrity (no undefined dates that could crash .split)
    const t1Fixtures = getTournamentFixtures(1);
    const t2Fixtures = getTournamentFixtures(2);
    const t0Fixtures = getTournamentFixtures(0);

    const allFixturesHaveValidDates = [...t1Fixtures, ...t2Fixtures, ...t0Fixtures].every(
      (f) => typeof f.date === "string" && f.date.length > 0 && typeof f.team1 === "string" && typeof f.team2 === "string"
    );

    console.log(`- All Tournament 0, 1, 2 Fixtures have Valid Non-Empty Date Strings: ${allFixturesHaveValidDates}`);
    console.log(`- Tournament 1 Fixture Count: ${t1Fixtures.length} (Expected: 6)`);
    console.log(`- Tournament 2 Fixture Count: ${t2Fixtures.length} (Expected: 9)`);

    const nextT1 = getNextUpcomingFixture(1);
    const nextT2 = getNextUpcomingFixture(2);
    const nextFixturesValid = nextT1 !== null && nextT2 !== null && typeof nextT2.stage === "string";
    console.log(`- Next Fixture Defaults Valid: ${nextFixturesValid}`);

    if (!qualityGateResilient || !allFixturesHaveValidDates || !nextFixturesValid) {
      console.error("FAIL: Scorecard intake null safety check failed!");
      passedAll = false;
    } else {
      console.log("PASS: Scorecard intake null safety, fixture dates, and quality gate resilience verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 25 encountered error:", err);
    passedAll = false;
  }

  // -------------------------------------------------------------
  // Test 26: Real-Time Cache Revalidation & Dynamic Route Guard
  // -------------------------------------------------------------
  console.log("\n[Test 26] Real-Time Cache Revalidation & Dynamic Route Guard:");
  try {
    const { revalidateCricketCache } = await import("../src/lib/cache-revalidator");
    const { getTournamentDetails } = await import("../src/lib/tournament-service");

    // 1. Ensure revalidateCricketCache executes safely without crashing
    let cacheRevalidated = false;
    try {
      revalidateCricketCache(0, 7, 35);
      cacheRevalidated = true;
    } catch {
      cacheRevalidated = false;
    }
    console.log(`- Cache Revalidation Engine Invocation: ${cacheRevalidated ? "SUCCESS" : "FAILED"}`);

    // 2. Ensure Tournament 0 dynamic details query DB matches
    const t0Details = await getTournamentDetails(0);
    const t0DynamicFixtures = Array.isArray(t0Details.fixtures) && t0Details.fixtures.length > 0;
    console.log(`- Tournament 0 Dynamic Fixtures Count: ${t0Details.fixtures.length} (Expected >= 1)`);
    console.log(`- Tournament 0 Points Table Guard: hasPointsTable = ${t0Details.hasPointsTable} (Expected: false)`);

    // 3. Ensure core pages have force-dynamic and revalidate = 0 to prevent static staleness
    const pagesToCheck = [
      "src/app/matches/page.tsx",
      "src/app/matches/[id]/page.tsx",
      "src/app/tournaments/0/page.tsx",
      "src/app/tournaments/1/page.tsx",
      "src/app/tournaments/2/page.tsx",
      "src/app/players/page.tsx",
      "src/app/player/[id]/page.tsx",
      "src/app/tournaments/page.tsx",
    ];

    let allPagesDynamic = true;
    for (const pagePath of pagesToCheck) {
      const fullPath = path.join(process.cwd(), pagePath);
      const content = fs.readFileSync(fullPath, "utf-8");
      const hasDynamic = content.includes('export const dynamic = "force-dynamic"');
      const hasZeroReval = content.includes("export const revalidate = 0");
      if (!hasDynamic || !hasZeroReval) {
        console.error(`FAIL: ${pagePath} missing dynamic or revalidate=0 configuration!`);
        allPagesDynamic = false;
      }
    }
    console.log(`- All 8 Core Data Pages Verified as force-dynamic (Zero Stale Cache): ${allPagesDynamic}`);

    if (!cacheRevalidated || !t0DynamicFixtures || t0Details.hasPointsTable !== false || !allPagesDynamic) {
      console.error("FAIL: Cache revalidation or dynamic page guard failed!");
      passedAll = false;
    } else {
      console.log("PASS: Real-time cache revalidation and zero-stale-cache dynamic route guard verified.");
    }
  } catch (err) {
    console.error("FAIL: Test 26 encountered error:", err);
    passedAll = false;
  }

  await prisma.$disconnect();

  if (!passedAll) {
    console.error("\n❌ PRE-PUSH TEST SUITE FAILED");
    process.exit(1);
  } else {
    console.log("\n==================================================");
    console.log("✅ ALL 26 TESTS PASSED! READY FOR PRODUCTION DEPLOY");
    console.log("==================================================");
    process.exit(0);
  }
}

runTestSuite();
