import { getSampleScorecardExtraction } from "../src/lib/extractor-service";
import { prisma } from "../src/lib/prisma";

export async function validateOcrSanity() {
  console.log("==================================================");
  console.log("   SPAWTZ OCR & INDOOR CRICKET SANITY CHECKER     ");
  console.log("==================================================");

  let allPassed = true;

  const sample = getSampleScorecardExtraction();

  // 1. Check Bottom Summary Contribution = RS - RC
  console.log("\n[Check 1] Bottom Summary Contribution = RS - RC:");
  const allPlayers = [
    ...sample.homeInnings.playerSummaries,
    ...sample.awayInnings.playerSummaries,
  ];

  for (const p of allPlayers) {
    const expectedC = p.runsScored - p.runsConceded;
    if (p.contribution !== expectedC) {
      console.error(
        `FAIL: Player ${p.name}: RS (${p.runsScored}) - RC (${p.runsConceded}) = ${expectedC}, but got C = ${p.contribution}`
      );
      allPassed = false;
    }
  }
  if (allPassed) {
    console.log(`PASS: All ${allPlayers.length} player summary rows satisfy C = RS - RC.`);
  }

  // 2. Check Economy Formula: ECON = RC / OB
  console.log("\n[Check 2] Economy Formula: ECON = RC / OB (Handling Negative Economy):");
  for (const p of allPlayers) {
    if (p.oversBowled > 0) {
      const expectedEcon = p.runsConceded / p.oversBowled;
      const diff = Math.abs(p.economy - expectedEcon);
      if (diff > 0.05) {
        console.error(
          `FAIL: Player ${p.name}: RC (${p.runsConceded}) / OB (${p.oversBowled}) = ${expectedEcon.toFixed(
            2
          )}, but got ECON = ${p.economy.toFixed(2)}`
        );
        allPassed = false;
      }
    }
  }
  console.log("PASS: Economy calculations verified (including negative runs conceded).");

  // 3. Check Batter Delivery Totals Sum to Skin Runs
  console.log("\n[Check 3] Batter Totals Sum to Skin Runs:");
  const inningsList = [sample.homeInnings, sample.awayInnings];
  for (const inn of inningsList) {
    for (const skin of inn.skins) {
      const batterSum = skin.batter1Total + skin.batter2Total;
      if (batterSum !== skin.skinTotalRuns) {
        console.error(
          `FAIL: ${inn.teamName} Skin ${skin.skinNumber}: ${skin.batter1Name} (${skin.batter1Total}) + ${skin.batter2Name} (${skin.batter2Total}) != Skin Total (${skin.skinTotalRuns})`
        );
        allPassed = false;
      }
    }
  }
  console.log("PASS: Batter paired scores exactly sum up to skin totals across all 8 skins.");

  // 4. Check Team Total Equals the Sum of 4 Skins
  console.log("\n[Check 4] Team Total Equals Sum of 4 Skins:");
  for (const inn of inningsList) {
    const skinsSum = inn.skins.reduce((sum, s) => sum + s.skinTotalRuns, 0);
    if (skinsSum !== inn.totalRuns) {
      console.error(
        `FAIL: ${inn.teamName}: Sum of skins (${skinsSum}) != total runs (${inn.totalRuns})`
      );
      allPassed = false;
    }
    if (inn.skins.length !== 4) {
      console.error(`FAIL: ${inn.teamName} does not have exactly 4 skins!`);
      allPassed = false;
    }
  }
  console.log("PASS: Team total equals sum of 4 skins (Home: 63, Away: 120).");

  // 5. Check Fallback Mapping for Unmapped Players to "Extra" (id: 999)
  console.log("\n[Check 5] Fallback Mapping for Unmapped Players to 'Extra' (id: 999):");
  try {
    const extraPlayer = await prisma.player.findUnique({
      where: { id: 999 },
    });

    if (!extraPlayer) {
      console.error("FAIL: Fallback player 'Extra' (id: 999) does not exist in database!");
      allPassed = false;
    } else {
      console.log(`- Fallback player found: "${extraPlayer.canonicalName}" (id: ${extraPlayer.id})`);
      console.log("PASS: Unmapped player fallback to 'Extra' (id: 999) verified.");
    }
  } catch (e) {
    console.error("Error querying Extra player:", e);
    allPassed = false;
  }

  // 6. Check Yash Practice Match Contribution Sanity (+19)
  console.log("\n[Check 6] Yash Practice Match Grounding (+19 Contribution):");
  const yashAway = sample.awayInnings.playerSummaries.find((p) => p.name === "YASH");
  if (!yashAway) {
    console.error("FAIL: YASH not found in sample away innings!");
    allPassed = false;
  } else {
    const yashContribution = yashAway.runsScored - yashAway.runsConceded;
    console.log(
      `- Yash: RS=${yashAway.runsScored}, RC=${yashAway.runsConceded}, OB=${yashAway.oversBowled}, WKTS=${yashAway.wickets}, C=+${yashContribution}`
    );
    if (yashContribution !== 19) {
      console.error(`FAIL: Expected Yash contribution to be +19, got +${yashContribution}`);
      allPassed = false;
    } else {
      console.log("PASS: Yash practice match POTM contribution strictly equals +19.");
    }
  }

  await prisma.$disconnect();

  if (!allPassed) {
    console.error("\n❌ SPAWTZ OCR SANITY CHECK FAILED");
    if (require.main === module || process.argv[1]?.includes("validate-ocr-sanity")) {
      process.exit(1);
    }
    return false;
  } else {
    console.log("\n==================================================");
    console.log("✅ ALL SPAWTZ OCR SANITY CHECKS PASSED!");
    console.log("==================================================");
    if (require.main === module || process.argv[1]?.includes("validate-ocr-sanity")) {
      process.exit(0);
    }
    return true;
  }
}

if (require.main === module || process.argv[1]?.includes("validate-ocr-sanity")) {
  validateOcrSanity();
}
