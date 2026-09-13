export interface QualityDiagnostics {
  overallPass: boolean;
  score: number; // 0 to 100
  checks: {
    resolution: {
      passed: boolean;
      width: number;
      height: number;
      minRequired: { width: number; height: number };
      message: string;
    };
    blur: {
      passed: boolean;
      score: number; // Laplacian variance or edge sharpness
      threshold: number;
      message: string;
    };
    exposure: {
      passed: boolean;
      luminosity: number; // 0 to 255
      optimalRange: [number, number];
      message: string;
    };
    glare: {
      passed: boolean;
      specularFraction: number; // % of overblown white pixels
      threshold: number;
      message: string;
    };
    perspective: {
      passed: boolean;
      aspectRatio: number;
      skewAngleDegrees: number;
      message: string;
    };
  };
  retakePrompts: string[];
}

export type DismissalCode = "C" | "B" | "RO" | "ST" | "LBW" | "HW" | "M";
export type ExtraCode = "W" | "NB" | "LS";

export interface BallExtraction {
  id: string;
  ballNumber: number; // 1 to 6+
  batterIndex: 1 | 2;
  batterName: string;
  bowlerName: string;
  rawToken: string; // e.g. "2", "(R)", "W", "NB", "0", "5"
  runs: number;
  extrasType?: ExtraCode;
  dismissalType?: DismissalCode;
  penaltyRuns: number; // -5 if dismissal
  netRuns: number;
  confidence: number; // 0.0 to 1.0
  flagged: boolean;
  notes?: string;
  cropBox?: { x: number; y: number; width: number; height: number };
}

export interface OverExtraction {
  overNumber: number; // 1 to 16
  bowlerName: string;
  balls: BallExtraction[];
  overTotalRuns: number;
  overWickets: number;
  reportedRuns?: number; // e.g. "2/9"
  reportedWkts?: number;
}

export interface SkinExtraction {
  skinNumber: number; // 1, 2, 3, 4
  batter1Name: string;
  batter2Name: string;
  overs: OverExtraction[];
  batter1Total: number;
  batter2Total: number;
  skinTotalRuns: number;
  skinWickets: number;
  won?: boolean;
}

export interface PlayerSummaryRow {
  name: string;
  runsScored: number; // RS
  oversBowled: number; // OB
  runsConceded: number; // RC
  wickets: number; // Wkts
  economy: number; // Econ
  contribution: number; // C = RS - RC
  timesOut?: number;
  resolvedPlayerId?: number;
  canonicalName?: string;
  matchType?: string;
}

export interface InningsExtraction {
  teamName: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  skins: SkinExtraction[];
  totalRuns: number;
  totalWickets: number;
  playerSummaries: PlayerSummaryRow[];
}

export interface ParsedScorecard {
  matchInfo: {
    title?: string;
    dateTime: string;
    league?: string;
    court?: string;
    umpire?: string;
    potm?: string;
    tournamentId?: number;
  };
  skinsSummary: {
    home: { skins: number[]; total: number; skinsWon: number };
    away: { skins: number[]; total: number; skinsWon: number };
  };
  homeInnings: InningsExtraction;
  awayInnings: InningsExtraction;
  validation: ValidationReport;
  nameResolutions?: Record<
    string,
    {
      rawName: string;
      matchedPlayerId: number;
      matchedName: string;
      confidence: number;
      matchType: string;
    }
  >;
}

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  section: string;
  field: string;
  message: string;
  expected?: string | number;
  actual?: string | number;
}

export interface ValidationReport {
  passed: boolean;
  confidenceScore: number; // 0 to 100%
  highConfidenceLabel: boolean; // >= 95%
  reconciled: boolean;
  issues: ValidationIssue[];
}

export interface CaptainInsightMetric {
  id: string;
  area: "batting" | "bowling" | "pairs" | "decisions";
  title: string;
  description: string;
  value: string | number;
  secondaryValue?: string;
  sampleSize: string; // e.g. "8 balls across 3 matches"
  signalStrength: "robust" | "moderate" | "emerging";
  trend?: "up" | "down" | "neutral";
  recommendation?: string;
  tags?: string[];
}

export interface PlayerCombinationSynergy {
  pair: [string, string];
  matchesTogether: number;
  skinsPlayedTogether: number;
  avgSkinScore: number;
  skinWinRate: number; // percentage
  synergyUplift: number; // +/- runs above individual baselines
  survivalRate: number; // percentage of skins with 0 or 1 dismissals
  roleArchetype: "Aggressive + Anchor" | "Dual Anchors" | "Dual Aggressors" | "Unbalanced";
  orderPreference: "Skin 1" | "Skin 2" | "Skin 3" | "Skin 4";
}
