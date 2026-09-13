import {
  ParsedScorecard,
  ValidationReport,
  ValidationIssue,
  InningsExtraction,
  ExtraCode,
  DismissalCode,
} from "@/types/cricket";

export const KNOWN_DISMISSAL_TOKENS: Record<string, DismissalCode> = {
  c: "C",
  caught: "C",
  b: "B",
  bowled: "B",
  r: "RO",
  ro: "RO",
  "r/o": "RO",
  runout: "RO",
  st: "ST",
  s: "ST",
  stumped: "ST",
  lbw: "LBW",
  lb: "LBW",
  h: "HW",
  hw: "HW",
  "h/w": "HW",
  hitwicket: "HW",
  m: "M",
  mankad: "M",
};

export const KNOWN_EXTRA_TOKENS: Record<string, ExtraCode> = {
  w: "W",
  wide: "W",
  nb: "NB",
  "no ball": "NB",
  ls: "LS",
  "leg side bye": "LS",
};

/**
 * Parses raw ball token (e.g. "2", "(R)", "W", "NB", "(B) 2", "0")
 */
export function parseBallToken(raw: string): {
  runs: number;
  extrasType?: ExtraCode;
  dismissalType?: DismissalCode;
  penaltyRuns: number;
  netRuns: number;
  confidence: number;
  flagged: boolean;
} {
  const token = raw.trim();
  if (!token || token === "-" || token === "." || token === "—") {
    return { runs: 0, penaltyRuns: 0, netRuns: 0, confidence: 0.98, flagged: false };
  }

  let extrasType: ExtraCode | undefined;
  let dismissalType: DismissalCode | undefined;
  let penaltyRuns = 0;
  let runs = 0;
  let flagged = false;
  let confidence = 0.95;

  const upper = token.toUpperCase();

  // Check for circled dismissals like (R), (B), (C), (S), or explicit text
  const dismissalMatch = token.match(/\(([A-Za-z/]+)\)|([CRBSMLH]|RO|NB|W|LBW|HW)/i);

  // 1. Check extras
  if (upper.includes("NB") || upper === "NO BALL") {
    extrasType = "NB";
    runs = 2; // Default indoor cricket award for no-ball
  } else if (upper.includes("LS") || upper === "LEG SIDE") {
    extrasType = "LS";
    runs = 1;
  } else if ((upper.includes("W") || upper === "WIDE") && !upper.includes("HW") && !upper.includes("LBW")) {
    extrasType = "W";
    runs = 2; // Default wide award
  }

  // 2. Check dismissals:
  // In Spawtz indoor cricket, if not a run or extra, any token with a circle or letter
  // (C: caught, R: runout, B: bowled, S: stumped, M: mankad, LBW, HW) is an OUT with -5 penalty.
  const cleanCode = token.replace(/[^A-Za-z]/g, "").toLowerCase();
  const isCircledOrParen = token.includes("(") || token.includes(")") || token.includes("○") || token.includes("O");

  if (KNOWN_DISMISSAL_TOKENS[cleanCode] && cleanCode !== "w" && cleanCode !== "nb" && cleanCode !== "ls") {
    dismissalType = KNOWN_DISMISSAL_TOKENS[cleanCode];
    penaltyRuns = -5;
  } else if (isCircledOrParen) {
    if (cleanCode && KNOWN_DISMISSAL_TOKENS[cleanCode]) {
      dismissalType = KNOWN_DISMISSAL_TOKENS[cleanCode];
    } else {
      dismissalType = upper.includes("R") ? "RO" : upper.includes("B") ? "B" : upper.includes("S") ? "ST" : "C";
    }
    penaltyRuns = -5;
  } else if (!extrasType && cleanCode.length > 0 && KNOWN_DISMISSAL_TOKENS[cleanCode]) {
    dismissalType = KNOWN_DISMISSAL_TOKENS[cleanCode];
    penaltyRuns = -5;
  }

  // Extract any run digit
  const digitMatch = token.match(/-?\d+/);
  if (digitMatch) {
    const num = parseInt(digitMatch[0], 10);
    if (!isNaN(num)) {
      runs = num;
    }
  }

  // If token had a dismissal, net runs includes -5 penalty
  const netRuns = runs + penaltyRuns;

  // Unknown non-numeric, non-legend characters flag the cell
  const cleaned = token.replace(/[\d\s\(\)\-+]/g, "").toLowerCase();
  if (cleaned && !KNOWN_DISMISSAL_TOKENS[cleaned] && !KNOWN_EXTRA_TOKENS[cleaned] && cleaned !== "w" && cleaned !== "nb") {
    flagged = true;
    confidence = 0.6;
  }

  return {
    runs,
    extrasType,
    dismissalType,
    penaltyRuns,
    netRuns,
    confidence,
    flagged,
  };
}

/**
 * Validates and reconciles Spawtz Indoor Cricket rules
 */
export function validateIndoorCricketScorecard(sheet: ParsedScorecard): ValidationReport {
  const issues: ValidationIssue[] = [];
  let totalCheckedFields = 0;
  let validFields = 0;

  if (!sheet) {
    return {
      passed: false,
      confidenceScore: 0,
      highConfidenceLabel: false,
      reconciled: false,
      issues: [{ severity: "error", section: "General", field: "Scorecard", message: "Scorecard sheet is missing or empty" }],
    };
  }

  const validateInnings = (inn: InningsExtraction | undefined, label: string) => {
    if (!inn) return;
    const skins = inn.skins || [];

    // 1. Check 4 skins
    totalCheckedFields++;
    if (skins.length === 4) {
      validFields++;
    } else {
      issues.push({
        severity: "error",
        section: `${label} Innings`,
        field: "Skins Count",
        message: `Expected 4 skins, found ${skins.length}`,
        expected: 4,
        actual: skins.length,
      });
    }

    // 2. Check 16 overs total
    totalCheckedFields++;
    const totalOvers = skins.reduce((acc, s) => acc + (s.overs || []).length, 0);
    if (totalOvers === 16) {
      validFields++;
    } else {
      issues.push({
        severity: "error",
        section: `${label} Innings`,
        field: "Overs Count",
        message: `Expected 16 overs, found ${totalOvers}`,
        expected: 16,
        actual: totalOvers,
      });
    }

    // 3. Check Bowler quota (max 2 overs per bowler)
    const bowlerOverCounts: Record<string, number> = {};
    skins.forEach((skin) => {
      (skin.overs || []).forEach((over) => {
        const b = (over.bowlerName || "").trim().toUpperCase();
        if (b) {
          bowlerOverCounts[b] = (bowlerOverCounts[b] || 0) + 1;
        }
      });
    });

    Object.entries(bowlerOverCounts).forEach(([bowler, count]) => {
      totalCheckedFields++;
      if (count <= 2) {
        validFields++;
      } else {
        issues.push({
          severity: "error",
          section: `${label} Bowling`,
          field: `${bowler} Quota`,
          message: `${bowler} bowled ${count} overs (Max allowed: 2)`,
          expected: "<= 2",
          actual: count,
        });
      }
    });

    // 4. Skin totals reconciliation
    let computedInningsTotal = 0;
    skins.forEach((skin) => {
      totalCheckedFields += 2;
      let calculatedSkinRuns = 0;
      let calculatedSkinWkts = 0;

      (skin.overs || []).forEach((over) => {
        (over.balls || []).forEach((b) => {
          totalCheckedFields++;
          calculatedSkinRuns += (b.runs || 0) + (b.penaltyRuns || 0);
          if (b.dismissalType) calculatedSkinWkts++;
          if (!b.flagged) validFields++;
        });
      });

      // Does skin total reconcile?
      const skinRuns = skin.skinTotalRuns ?? 0;
      if (skinRuns === calculatedSkinRuns || Math.abs(skinRuns - calculatedSkinRuns) <= 2) {
        validFields++;
      } else {
        issues.push({
          severity: "warning",
          section: `${label} Skin ${skin.skinNumber || "?"}`,
          field: "Skin Runs Reconciliation",
          message: `Reported skin runs (${skinRuns}) does not match ball sum (${calculatedSkinRuns})`,
          expected: skinRuns,
          actual: calculatedSkinRuns,
        });
      }

      // Does sum of Batter 1 and Batter 2 equal skin total?
      const batter1Total = skin.batter1Total || 0;
      const batter2Total = skin.batter2Total || 0;
      if (batter1Total + batter2Total === skinRuns) {
        validFields++;
      } else {
        issues.push({
          severity: "warning",
          section: `${label} Skin ${skin.skinNumber || "?"}`,
          field: "Batter Sum Reconciliation",
          message: `${skin.batter1Name || "B1"} (${batter1Total}) + ${skin.batter2Name || "B2"} (${batter2Total}) != Skin Total (${skinRuns})`,
          expected: skinRuns,
          actual: batter1Total + batter2Total,
        });
      }

      computedInningsTotal += skinRuns;
    });

    // 5. Innings total reconcile
    totalCheckedFields++;
    const reportedTotal = inn.totalRuns ?? 0;
    if (reportedTotal === computedInningsTotal) {
      validFields++;
    } else {
      issues.push({
        severity: "error",
        section: `${label} Innings`,
        field: "Total Runs",
        message: `Reported innings total (${reportedTotal}) does not match sum of skins (${computedInningsTotal})`,
        expected: computedInningsTotal,
        actual: reportedTotal,
      });
    }

    // 6. Bottom player summary table reconciliation (RS - RC = C)
    (inn.playerSummaries || []).forEach((p) => {
      totalCheckedFields++;
      const rs = p.runsScored || 0;
      const rc = p.runsConceded || 0;
      const expectedC = rs - rc;
      if (p.contribution === expectedC) {
        validFields++;
      } else {
        issues.push({
          severity: "warning",
          section: `${label} Summary`,
          field: `${p.name} Contribution`,
          message: `RS (${rs}) - RC (${rc}) = ${expectedC}, but recorded as ${p.contribution}`,
          expected: expectedC,
          actual: p.contribution,
        });
      }
    });
  };

  validateInnings(sheet.homeInnings, "Home");
  validateInnings(sheet.awayInnings, "Away");

  // Reconcile overall skins summary table with innings skins if present
  if (sheet.skinsSummary?.home?.skins) {
    totalCheckedFields++;
    const homeSumSkins = sheet.skinsSummary.home.skins.reduce((a, b) => a + b, 0);
    if (homeSumSkins === (sheet.skinsSummary.home.total ?? 0)) {
      validFields++;
    } else {
      issues.push({
        severity: "error",
        section: "Skins Table",
        field: "Home Total",
        message: `Home skins sum (${homeSumSkins}) does not match total (${sheet.skinsSummary.home.total})`,
      });
    }
  }

  if (sheet.skinsSummary?.away?.skins) {
    totalCheckedFields++;
    const awaySumSkins = sheet.skinsSummary.away.skins.reduce((a, b) => a + b, 0);
    if (awaySumSkins === (sheet.skinsSummary.away.total ?? 0)) {
      validFields++;
    } else {
      issues.push({
        severity: "error",
        section: "Skins Table",
        field: "Away Total",
        message: `Away skins sum (${awaySumSkins}) does not match total (${sheet.skinsSummary.away.total})`,
      });
    }
  }

  const confidenceScore =
    totalCheckedFields > 0 ? Math.round((validFields / totalCheckedFields) * 100) : 0;
  const criticalErrors = issues.filter((i) => i.severity === "error");
  const passed = criticalErrors.length === 0;
  const highConfidenceLabel = confidenceScore >= 95 && passed;

  return {
    passed,
    confidenceScore,
    highConfidenceLabel,
    reconciled: passed,
    issues,
  };
}
