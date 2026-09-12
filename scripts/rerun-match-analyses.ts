import { PrismaClient } from "@prisma/client";
import { MATCH_ANALYSES } from "../src/lib/match-analyses";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Indoor Cricket Match Analyses rerun...");

  const matchIds = Object.keys(MATCH_ANALYSES);
  console.log(`Found ${matchIds.length} match analyses to persist.`);

  let updatedMatches = 0;
  for (const id of matchIds) {
    const matchNum = parseInt(id, 10);
    const analysis = MATCH_ANALYSES[id];
    const analysisJson = JSON.stringify(analysis);

    try {
      const match = await prisma.match.findUnique({
        where: { id: matchNum },
      });

      if (match) {
        await prisma.match.update({
          where: { id: matchNum },
          data: { tacticalAnalysis: analysisJson },
        });
        const verdict = analysis.matchVerdict?.verdict || (analysis.matchVerdict as any)?.classification || "COMPLETED";
        console.log(`✓ Updated Match #${matchNum}: ${analysis.matchTitle} [${verdict}]`);
        updatedMatches++;
      } else {
        console.warn(`! Match #${matchNum} not found in DB, skipping match record.`);
      }
    } catch (err: any) {
      console.error(`✗ Failed to update Match #${matchNum}:`, err.message);
    }
  }

  // Also update any pending/approved ScorecardUpload records if present
  try {
    const uploads = await prisma.scorecardUpload.findMany();
    for (const upload of uploads) {
      if (upload.matchId && MATCH_ANALYSES[String(upload.matchId)]) {
        await prisma.scorecardUpload.update({
          where: { id: upload.id },
          data: {
            tacticalAnalysis: JSON.stringify(MATCH_ANALYSES[String(upload.matchId)]),
          },
        });
        console.log(`✓ Updated ScorecardUpload ${upload.id} for Match #${upload.matchId}`);
      } else if (MATCH_ANALYSES["7"]) {
        await prisma.scorecardUpload.update({
          where: { id: upload.id },
          data: {
            tacticalAnalysis: JSON.stringify(MATCH_ANALYSES["7"]),
          },
        });
        console.log(`✓ Updated default ScorecardUpload ${upload.id} with Practice Match #7 analysis`);
      }
    }
  } catch (err: any) {
    console.error("ScorecardUpload update error:", err.message);
  }

  console.log(`\nSuccessfully persisted tactical analyses for ${updatedMatches} matches into SQLite database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
