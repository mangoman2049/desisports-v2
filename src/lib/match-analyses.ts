export interface EvidencePoint {
  observation: string;
  evidence: string;
  impact: string;
}

export interface PlayerImpactItem {
  player: string;
  label:
    | "MATCH WINNER"
    | "SKIN WINNER"
    | "PARTNERSHIP BUILDER"
    | "PRESSURE BUILDER"
    | "PARTNERSHIP BREAKER"
    | "DISCIPLINE PROBLEM"
    | "NET-RUN THREAT"
    | "SILENT CONTRIBUTOR"
    | "MISSED OPPORTUNITY"
    | "GAME CHANGER";
  explanation: string;
}

export interface SkinPairAnalysis {
  pairNumber: number;
  winnerPair: string;
  winnerRuns: number;
  winnerDismissals: number;
  loserPair: string;
  loserRuns: number;
  loserDismissals: number;
  skinMargin: number;
  skinWinner: string;
  analysis: string;
}

export interface MatchTacticalAnalysis {
  matchId: number | string;
  tournamentName: string;
  matchTitle: string;
  date: string;
  venue: string;
  winner: string;
  loser: string;
  scoreSummary: string;
  editorHeadline: string;
  editorSummary: string;
  whatWentRightWinner: {
    title: string;
    points: string[];
  };
  whatWentWrongLoser: {
    title: string;
    points: string[];
  };
  turningPoint: {
    phase: string;
    description: string;
    nature: "Tactical Domination" | "Critical Errors" | "Bowling Mastery" | "Pressure Collapse" | "Turnaround" | "Fatal Mistake";
  };
  skinsBreakdown: {
    skin: number;
    winnerRuns: number;
    loserRuns: number;
    margin: number;
    summary: string;
  }[];

  // Enriched Coach & Tactical Breakdown
  matchVerdict: {
    verdict: "TACTICAL DOMINATION" | "TURNAROUND" | "FATAL MISTAKE" | "MIXED";
    explanation: string;
  };
  whyWinningTeamWon: EvidencePoint[];
  whyLosingTeamLost: EvidencePoint[];
  skinsAnalysisDetailed: {
    pairs: SkinPairAnalysis[];
    skinsStory: string;
  };
  turningPointDetailed: {
    matchStateBefore: string;
    event: string;
    matchStateAfter: string;
    whyItMattered: string;
  };
  fatalMistake: {
    mistake: string;
    impact: string;
  };
  playerImpact: PlayerImpactItem[];
  battingBehaviour: {
    team: string;
    observations: string[];
  }[];
  bowlingBehaviour: {
    team: string;
    observations: string[];
  }[];
  captainAnalysis: {
    evaluation: string;
    captainTakeaways: string[];
  };
  teamDnaAssessment: {
    team: string;
    traits: string[];
    evidence: string;
  }[];
  finalHardHittingVerdict: string;
}

export const MATCH_ANALYSES: Record<string, MatchTacticalAnalysis> = {
  // ==========================================
  // Match 1: VPGR vs DesiTitans
  // ==========================================
  "1": {
    matchId: 1,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "VPGR vs DesiTitans",
    date: "11 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "VPGR",
    loser: "DesiTitans",
    scoreSummary: "VPGR 80 def. DesiTitans 41 (+39 run margin, 3-1 skins)",
    editorHeadline: "Ankush Goel's 4-Wicket Spell Decimates Titans in Tournament Opener",
    editorSummary:
      "VPGR opened their tournament campaign with a commanding 39-run victory over DesiTitans. Ankush Goel delivered a masterclass in indoor bowling discipline, conceding minus runs while taking 4 wickets. DesiTitans struggled to cope with the back-of-a-length line and conceded 3 run-outs in the middle skins.",
    whatWentRightWinner: {
      title: "Tactical Wins for VPGR",
      points: [
        "Bowled tight leg-side lines, conceding only 2 wides across 16 overs.",
        "Ankush Goel took 4 wickets with an economy of -3.50 runs per over.",
        "Skins 1 and 2 produced +26 and +22 net runs through rapid physical singles.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiTitans",
      points: [
        "Conceded 5 dismissals (-25 penalty runs) in Skins 2 and 3.",
        "Batter communication failed under pressure, producing 3 run-outs.",
        "Over-relied on back-wall boundaries rather than rotating strike into side nets.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Bowling Mastery",
      description:
        "Ankush Goel bowled Overs 5 and 7, taking 3 wickets for -6 runs conceded. DesiTitans' Skin 2 crashed from +12 to -3.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 26, loserRuns: 18, margin: 8, summary: "Kalrav & Ankush established early command." },
      { skin: 2, winnerRuns: 22, loserRuns: -3, margin: 25, summary: "Ankush's spell dismantled Titans' middle order." },
      { skin: 3, winnerRuns: 16, loserRuns: 14, margin: 2, summary: "Low-scoring grind; VPGR held nerve." },
      { skin: 4, winnerRuns: 16, loserRuns: 12, margin: 4, summary: "Himanshu closed out the match safely." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "VPGR controlled the match from the first ball. They conceded only 41 total runs across 16 overs by bowling to a disciplined field and converting easy 2-run physical opportunities. DesiTitans never established a single partnership above 20 runs.",
    },
    whyWinningTeamWon: [
      {
        observation: "Bowling Discipline and Wicket Pressure",
        evidence: "VPGR created 7 total dismissals (-35 penalty runs) while conceding zero multi-run extras in the powerplay.",
        impact: "Forced Titans to bat from negative skin totals for over half the match.",
      },
      {
        observation: "Opening Skin Control",
        evidence: "Kalrav Shah and Ankush Goel scored 26 runs against Titans' spearhead bowling without suffering a dismissal.",
        impact: "Set a comfortable tempo and forced Titans into high-risk chase patterns immediately.",
      },
      {
        observation: "Front-Court Catching and Run-Out Execution",
        evidence: "VPGR effected 3 direct-hit run-outs and 2 front-net reflex catches.",
        impact: "Cut off Titans' ground rotation and compelled aerial risks.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Disastrous Skin 2 Batting Collapse",
        evidence: "Titans' second pair scored -3 net runs, suffering 3 dismissals (-15 runs).",
        impact: "Conceded a 25-run skin differential that ended any competitive chance.",
      },
      {
        observation: "Failure to Execute Physical Running",
        evidence: "Titans converted only 12 two-run physical crosses across 16 overs compared to VPGR's 28.",
        impact: "Deprived the team of basic ground score and increased dot-ball pressure to 44%.",
      },
      {
        observation: "Poor Bowling Allocation",
        evidence: "Titans bowled their least experienced bowler in Over 8 when defending a tight skin margin.",
        impact: "Conceded 12 runs in 6 balls, handing VPGR the skin point.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Kalrav Shah & Ankush Goel",
          winnerRuns: 26,
          winnerDismissals: 0,
          loserPair: "Prateek Nahar & Preraq Mistry",
          loserRuns: 18,
          loserDismissals: 1,
          skinMargin: 8,
          skinWinner: "VPGR",
          analysis: "Kalrav and Ankush displayed textbook indoor calling; zero dismissals built an immediate 8-run lead.",
        },
        {
          pairNumber: 2,
          winnerPair: "Harshwardhan Chauhan & Hemal Gathani",
          winnerRuns: 22,
          winnerDismissals: 1,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: -3,
          loserDismissals: 3,
          skinMargin: 25,
          skinWinner: "VPGR",
          analysis: "The defining partnership of the game. Ankush Goel's bowling dismantled Hardik & Harsh into negative figures.",
        },
        {
          pairNumber: 3,
          winnerPair: "Meet Shah & Parth Shah",
          winnerRuns: 16,
          winnerDismissals: 2,
          loserPair: "Yash Sisodia & Mayank Agarwal",
          loserRuns: 14,
          loserDismissals: 2,
          skinMargin: 2,
          skinWinner: "VPGR",
          analysis: "A defensive arm-wrestle. Meet and Parth survived two wickets to scrape the skin by 2 runs.",
        },
        {
          pairNumber: 4,
          winnerPair: "Himanshu Kalyani & Harshal Joshi",
          winnerRuns: 16,
          winnerDismissals: 1,
          loserPair: "Vipul Jain & Ronak Jain",
          loserRuns: 12,
          loserDismissals: 2,
          skinMargin: 4,
          skinWinner: "VPGR",
          analysis: "Himanshu managed the closing overs with low-risk ground blocks, securing all 4 skins.",
        },
      ],
      skinsStory:
        "VPGR swept all four skins through broad structural superiority. The 25-run blowout in Skin 2 broke the Titans, while disciplined ground management secured tight finishes in Skins 3 and 4.",
    },
    turningPointDetailed: {
      matchStateBefore: "Titans trailed 18-26 after Skin 1, remaining well within touching distance.",
      event: "Ankush Goel took 3 wickets in Overs 5 and 7, bowling with extreme bounce into the ribs.",
      matchStateAfter: "Titans fell to -3 in Skin 2 and trailed 15-48 overall.",
      whyItMattered: "Turned a close 8-run contest into an unassailable 33-run deficit in 12 deliveries.",
    },
    fatalMistake: {
      mistake: "Calling for a third physical run on Over 6 Ball 4 from a side-net rebound.",
      impact: "Resulted in a straightforward run-out that triggered two further panic dismissals.",
    },
    playerImpact: [
      {
        player: "Ankush Goel",
        label: "MATCH WINNER",
        explanation: "Took 4 wickets for -14 runs conceded and scored 14 runs with zero dismissals.",
      },
      {
        player: "Kalrav Shah",
        label: "PARTNERSHIP BUILDER",
        explanation: "Anchored Skin 1 with 12 runs and controlled strike rotation to deny Titans early wickets.",
      },
      {
        player: "Hardik Desai",
        label: "DISCIPLINE PROBLEM",
        explanation: "Suffered two run-outs in 8 balls, draining 10 runs from his team's total.",
      },
    ],
    battingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Consistent front-court drop and run strategy on balls 1-4 of each over.",
          "Used side nets for bonus twos with 82% conversion rate.",
          "Never lost consecutive wickets in the same over.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Over-committed to back-wall pull shots, producing 4 catches in the deep.",
          "Hesitant calling between wickets leading to 3 run-outs.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Bowled tight back-of-a-length into the body, denying room for cross-court pulls.",
          "Conceded only 2 wides in 96 deliveries.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Struggled with line when under pressure, conceding 6 leg-side extras.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Himanshu Kalyani utilized his primary weapon, Ankush Goel, at the exact moment Titans were attempting to stabilize in Skin 2. Hardik Desai held back his best bowlers until the game was lost.",
      captainTakeaways: [
        "Attack opposition pair 2 early when they feature anchor batters.",
        "Enforce one-call protocol on physical runs to prevent run-out collapses.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "VPGR",
        traits: ["DISCIPLINED BOWLERS", "PRESSURE BUILDERS", "SKIN SPECIALISTS"],
        evidence: "Conceded only 41 runs and won all 4 skins through flawless field execution.",
      },
      {
        team: "DesiTitans",
        traits: ["DISMISSAL PRONE", "INCONSISTENT UNDER PRESSURE"],
        evidence: "Lost 8 wickets and recorded negative skin returns in Skin 2.",
      },
    ],
    finalHardHittingVerdict:
      "VPGR did not simply outscore the Titans; they suffocated them by winning all four partnerships and punishing every hesitant call with immediate dismissals.",
  },

  // ==========================================
  // Match 2: DesiDabanggs vs DesiTigers
  // ==========================================
  "2": {
    matchId: 2,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiDabanggs vs DesiTigers",
    date: "13 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "DesiDabanggs",
    scoreSummary: "DesiTigers 113 def. DesiDabanggs 53 (+60 run margin, 4-0 skins)",
    editorHeadline: "Manthan Shah's All-Round Heroics Power Tigers to 60-Run Demolition",
    editorSummary:
      "DesiTigers announced their championship credentials with a ruthless 60-run sweep of DesiDabanggs. Manthan Shah earned Player of the Match honors with an astonishing +38 contribution. Tigers batted with clinical precision, posting 113 runs with only 2 dismissals across 16 overs.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Manthan Shah scored 24 runs and took 3 wickets for -14 runs conceded.",
        "Scored 113 total runs while conceding only 2 dismissals (-10 penalty runs).",
        "Swept all 4 skins with double-digit margins.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiDabanggs",
      points: [
        "Top-order collapse in Skin 1 produced only 8 runs.",
        "Bowlers conceded 14 extras including 5 no-balls.",
        "Struggled against Tigers' medium pacers in middle overs.",
      ],
    },
    turningPoint: {
      phase: "Skin 1 (Overs 1-4)",
      nature: "Tactical Domination",
      description:
        "Tigers opened with 32 runs in Skin 1 while restricting Dabanggs to 8 runs. The 24-run deficit in the first 4 overs crushed Dabanggs' game plan.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 32, loserRuns: 8, margin: 24, summary: "Tigers opened with blazing powerplay." },
      { skin: 2, winnerRuns: 27, loserRuns: 16, margin: 11, summary: "Darshan & Hardik stabilized comfortably." },
      { skin: 3, winnerRuns: 28, loserRuns: 14, margin: 14, summary: "Manthan Shah dominated with bat and ball." },
      { skin: 4, winnerRuns: 26, loserRuns: 15, margin: 11, summary: "Prateek & Sajid closed out the clean sweep." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "DesiTigers completely outclassed DesiDabanggs in every facet of indoor cricket. They scored 113 runs by batting aggressively into the side nets while conceding only two dismissals in 16 overs. Dabanggs were restricted to 53 runs and lost all four skins.",
    },
    whyWinningTeamWon: [
      {
        observation: "Relentless Batting Output",
        evidence: "Tigers scored at least 26 runs in every single skin (32, 27, 28, 26).",
        impact: "Allowed zero recovery windows for Dabanggs' bowlers.",
      },
      {
        observation: "Manthan Shah's Two-Way Mastery",
        evidence: "Manthan delivered +38 net contribution (24 runs with bat, 3 wickets for -14 runs conceded).",
        impact: "Single-handedly accounted for more than half of the team's winning margin.",
      },
      {
        observation: "Minimal Dismissal Penalties",
        evidence: "Tigers conceded only 2 wickets in 96 deliveries (-10 penalty runs).",
        impact: "Preserved 91% of their gross runs as net total.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Defensive Timidity in Skin 1",
        evidence: "Dabanggs scored only 8 runs in their opening 4 overs, failing to score off 14 deliveries.",
        impact: "Conceded a 24-run deficit in the opening 15 minutes of the match.",
      },
      {
        observation: "Bowling Indiscipline",
        evidence: "Dabanggs conceded 14 extras, giving Tigers free multi-run deliveries and extra balls.",
        impact: "Blew open the margins in Skins 2 and 3.",
      },
      {
        observation: "Lack of Counter-Punch",
        evidence: "After falling behind, Dabanggs continued defending instead of attacking the side nets.",
        impact: "Never threatened Tigers' score at any stage.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Abhishek Agarwal & Gagandeep Singh",
          winnerRuns: 32,
          winnerDismissals: 0,
          loserPair: "Preraq Mistry & Sandesh Jagtap",
          loserRuns: 8,
          loserDismissals: 2,
          skinMargin: 24,
          skinWinner: "DesiTigers",
          analysis: "Abhishek and Gagandeep attacked every loose ball, hitting 4 boundaries and forcing zero dismissals.",
        },
        {
          pairNumber: 2,
          winnerPair: "Darshan Mody & Hardik Desai",
          winnerRuns: 27,
          winnerDismissals: 1,
          loserPair: "Manthan Shah & Tejas Shah",
          loserRuns: 16,
          loserDismissals: 1,
          skinMargin: 11,
          skinWinner: "DesiTigers",
          analysis: "Darshan rotated strike with precision, outscoring Dabanggs' most reliable pair.",
        },
        {
          pairNumber: 3,
          winnerPair: "Manthan Shah & Taha Shipchandler",
          winnerRuns: 28,
          winnerDismissals: 1,
          loserPair: "Darshan Mody & Narendra Tiwari",
          loserRuns: 14,
          loserDismissals: 2,
          skinMargin: 14,
          skinWinner: "DesiTigers",
          analysis: "Manthan tore into Dabanggs' backup bowlers, scoring 18 of the pair's 28 runs.",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Nahar & Sajid Merchant",
          winnerRuns: 26,
          winnerDismissals: 0,
          loserPair: "Ravi Kumar & Sandeep Khedekar",
          loserRuns: 15,
          loserDismissals: 1,
          skinMargin: 11,
          skinWinner: "DesiTigers",
          analysis: "Prateek and Sajid closed with authority, making it a 4-0 skin clean sweep.",
        },
      ],
      skinsStory:
        "Tigers posted massive scores in all four skins, never dipping below 26. Dabanggs failed to cross 16 in any partnership, resulting in an unambiguous 60-run blowout.",
    },
    turningPointDetailed: {
      matchStateBefore: "Match was tied 0-0 at the coin toss.",
      event: "Abhishek Agarwal and Gagandeep Singh hammered 32 runs in Skin 1 without a dismissal.",
      matchStateAfter: "Tigers took an immediate 24-run lead after 4 overs.",
      whyItMattered: "Dabanggs' tactical blueprint collapsed immediately under immense score pressure.",
    },
    fatalMistake: {
      mistake: "Opening the bowling with experimental medium pace against Tigers' best boundary hitters.",
      impact: "Conceded 19 runs in the first two overs of the match.",
    },
    playerImpact: [
      {
        player: "Manthan Shah",
        label: "MATCH WINNER",
        explanation: "Delivered a staggering +38 contribution across batting and bowling.",
      },
      {
        player: "Abhishek Agarwal",
        label: "SKIN WINNER",
        explanation: "Set the match tempo with 18 runs in Skin 1 at an aggressive strike rate.",
      },
      {
        player: "Preraq Mistry",
        label: "MISSED OPPORTUNITY",
        explanation: "Struggled in Skin 1 with two dismissals, unable to provide Dabanggs a platform.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Aggressive boundary intent backed by quick running.",
          "High conversion of side-net loose balls into multi-run deliveries.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "High percentage of dot balls in front court.",
          "Hesitation on tight singles resulting in pressure build-up.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Disciplined stump-to-stump line with zero free boundary deliveries.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Over-compensated with wide deliveries, conceding 14 extras.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Tigers captain maintained bowling pressure by deploying Manthan in high-leverage overs. Dabanggs captain failed to adjust fielders when Tigers repeatedly found the side net.",
      captainTakeaways: [
        "Never bowl loose deliveries in Skin 1 of indoor cricket; early momentum decides 80% of matches.",
        "Tighten front-court field placement against side-net accumulators.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["AGGRESSIVE SCORERS", "PARTNERSHIP DRIVEN", "DISCIPLINED BOWLERS"],
        evidence: "Scored 113 runs with 4 skins won and only 2 dismissals conceded.",
      },
      {
        team: "DesiDabanggs",
        traits: ["INCONSISTENT UNDER PRESSURE", "DISMISSAL PRONE"],
        evidence: "Restricted to 53 runs and lost all four partnerships by double digits.",
      },
    ],
    finalHardHittingVerdict:
      "DesiTigers crushed DesiDabanggs because their four partnerships played with clear scoring intent, whereas Dabanggs simply tried to survive and suffered for it.",
  },

  // ==========================================
  // Match 3: VPGR vs DesiDabanggs
  // ==========================================
  "3": {
    matchId: 3,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "VPGR vs DesiDabanggs",
    date: "15 May 2026, 7:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "VPGR",
    loser: "DesiDabanggs",
    scoreSummary: "VPGR 148 def. DesiDabanggs 56 (+92 run margin, 4-0 skins)",
    editorHeadline: "VPGR Shatters Tournament Records with 148-Run Onslaught",
    editorSummary:
      "In the most lopsided match of the championship, VPGR established a tournament scoring record of 148 runs. Ankush Goel captured his second POTM award with a devastating performance, contributing 22 runs and 3 wickets. DesiDabanggs suffered 9 dismissals (-45 penalty runs) and were never in the contest.",
    whatWentRightWinner: {
      title: "Tactical Wins for VPGR",
      points: [
        "Set tournament-record score of 148 runs across 16 overs (9.25 runs/over).",
        "Every pair scored 30+ runs, peaking at 44 runs in Skin 2.",
        "Ankush Goel took 3 wickets with an economy of 1.00.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiDabanggs",
      points: [
        "Conceded 9 dismissals for -45 penalty runs.",
        "Bowling attack was picked apart, conceding 18 boundaries.",
        "Skin 2 conceded 44 runs, the highest single skin in tournament history.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Tactical Domination",
      description:
        "VPGR's second pair exploded for 44 runs in 4 overs while conceding zero dismissals. The 34-run skin differential put the match beyond reach.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 36, loserRuns: 16, margin: 20, summary: "Kalrav & Ankush dominated from ball one." },
      { skin: 2, winnerRuns: 44, loserRuns: 10, margin: 34, summary: "Tournament record 44-run skin explosion." },
      { skin: 3, winnerRuns: 34, loserRuns: 14, margin: 20, summary: "Steady middle skin accumulation." },
      { skin: 4, winnerRuns: 34, loserRuns: 16, margin: 18, summary: "Himanshu & Harshal finished off the blowout." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "This was the most comprehensive mismatch of the tournament. VPGR scored 148 runs by ruthlessly punishing every loose delivery and executing rapid two-run calls. DesiDabanggs conceded 9 dismissals (-45 penalty runs) and were thoroughly overwhelmed in all four partnerships.",
    },
    whyWinningTeamWon: [
      {
        observation: "Record-Breaking Batting Power",
        evidence: "VPGR scored 148 runs, averaging 37 runs per skin with a tournament-high 44 in Skin 2.",
        impact: "Created the largest winning margin (+92 runs) in tournament history.",
      },
      {
        observation: "Lethal Wicket Creation",
        evidence: "VPGR bowlers took 9 wickets, deducting 45 runs from Dabanggs' gross total.",
        impact: "Reduced Dabanggs from an 80 gross run pace down to 56 net runs.",
      },
      {
        observation: "Flawless Running Between Wickets",
        evidence: "VPGR recorded 42 two-run physical crosses with zero run-outs.",
        impact: "Turned standard dot-balls into scoring deliveries consistently.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Total Dismissal Meltdown",
        evidence: "Dabanggs suffered 9 dismissals across 16 overs, averaging over two wickets per skin.",
        impact: "-45 runs wiped out nearly half of their total batting efforts.",
      },
      {
        observation: "Bowling Disintegration",
        evidence: "Dabanggs conceded 148 runs, bowling 16 boundaries and 12 extras.",
        impact: "Handed VPGR free runs without forcing any pressure.",
      },
      {
        observation: "Psychological Resignation",
        evidence: "After conceding 44 in Skin 2, Dabanggs' fielding body language slumped with 4 missed run-out opportunities.",
        impact: "Allowed VPGR to cruise through Skins 3 and 4 without challenge.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Kalrav Shah & Ankush Goel",
          winnerRuns: 36,
          winnerDismissals: 0,
          loserPair: "Preraq Mistry & Sandesh Jagtap",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 20,
          skinWinner: "VPGR",
          analysis: "Kalrav and Ankush set an imperious standard with 36 runs and zero wickets lost.",
        },
        {
          pairNumber: 2,
          winnerPair: "Harshwardhan Chauhan & Hemal Gathani",
          winnerRuns: 44,
          winnerDismissals: 0,
          loserPair: "Manthan Shah & Tejas Shah",
          loserRuns: 10,
          loserDismissals: 3,
          skinMargin: 34,
          skinWinner: "VPGR",
          analysis: "Tournament record skin. Harshwardhan and Hemal hit 6 boundaries in 4 overs.",
        },
        {
          pairNumber: 3,
          winnerPair: "Meet Shah & Parth Shah",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Darshan Mody & Narendra Tiwari",
          loserRuns: 14,
          loserDismissals: 2,
          skinMargin: 20,
          skinWinner: "VPGR",
          analysis: "Meet and Parth maintained the onslaught against tired Dabanggs bowlers.",
        },
        {
          pairNumber: 4,
          winnerPair: "Himanshu Kalyani & Harshal Joshi",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Ravi Kumar & Sandeep Khedekar",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 18,
          skinWinner: "VPGR",
          analysis: "Himanshu and Harshal capped the victory with 34 runs, completing a 4-0 sweep.",
        },
      ],
      skinsStory:
        "VPGR won all four skins by 18+ runs each. The 44-run second skin was the most destructive partnership of the championship.",
    },
    turningPointDetailed: {
      matchStateBefore: "Dabanggs were down 16-36 after Skin 1.",
      event: "VPGR's Harshwardhan and Hemal scored 44 runs in Skin 2 while Dabanggs suffered 3 wickets for 10 runs.",
      matchStateAfter: "The score was 80-26, an insurmountable 54-run margin after just 8 overs.",
      whyItMattered: "Ended any competitive pretense before the midpoint of the match.",
    },
    fatalMistake: {
      mistake: "Bowling full tosses and half-volleys into the hitting arc during Overs 5 and 6.",
      impact: "Conceded 26 runs in 12 balls without creating a single dot ball.",
    },
    playerImpact: [
      {
        player: "Ankush Goel",
        label: "MATCH WINNER",
        explanation: "Recorded his second POTM award with 22 runs, 3 wickets, and +31 net contribution.",
      },
      {
        player: "Harshwardhan Chauhan",
        label: "NET-RUN THREAT",
        explanation: "Hit 4 side-net boundaries in Skin 2 to power the tournament-record 44-run skin.",
      },
      {
        player: "Manthan Shah",
        label: "MISSED OPPORTUNITY",
        explanation: "Struggled in Skin 2 with 2 dismissals as Dabanggs' innings completely disintegrated.",
      },
    ],
    battingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Flawless combination of boundary power and ground running.",
          "Exploited gaps behind the bowler with precision backcourt pushes.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Repeated dismissals from reckless cross-batted swings.",
          "Failed to build any multi-over partnerships.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Attacked the stumps relentlessly, producing 9 wickets.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Complete loss of line and length; conceded 148 runs.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Himanshu Kalyani was ruthless, keeping his frontline bowlers attacking until the final delivery. Darshan Mody seemed powerless to halt the bleeding as bowling changes failed repeatedly.",
      captainTakeaways: [
        "In indoor cricket, once a skin concedes 25 runs, bowlers must switch to yorkers and defensive leg-stump lines.",
        "Take a timeout after over 6 to stop the panic.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "VPGR",
        traits: ["AGGRESSIVE SCORERS", "DISCIPLINED BOWLERS", "PRESSURE BUILDERS"],
        evidence: "Posted 148 runs and took 9 wickets in a masterclass performance.",
      },
      {
        team: "DesiDabanggs",
        traits: ["DISMISSAL PRONE", "INCONSISTENT UNDER PRESSURE"],
        evidence: "Conceded 148 runs, suffered 9 dismissals, and scored only 56 net runs.",
      },
    ],
    finalHardHittingVerdict:
      "VPGR's 148 runs proved what happens when elite bowling discipline meets ruthless indoor boundary execution; Dabanggs simply had no answers.",
  },

  // ==========================================
  // Match 4: DesiTitans vs DesiTigers
  // ==========================================
  "4": {
    matchId: 4,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTitans vs DesiTigers",
    date: "15 May 2026, 9:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "DesiTitans",
    scoreSummary: "DesiTigers 103 def. DesiTitans 69 (+34 run margin, 3-1 skins)",
    editorHeadline: "Prateek Nahar's 32-Run Masterclass Seals Final Spot for Tigers",
    editorSummary:
      "DesiTigers guaranteed their spot in the championship final with a composed 34-run victory over DesiTitans. Captain Prateek Nahar led from the front with 32 runs and clean strike rotation. DesiTitans competed bravely in Skin 1 but collapsed under Tigers' suffocating death bowling in Skins 3 and 4.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Prateek Nahar scored 32 runs with zero dismissals (Player of the Match).",
        "Tigers won 3 skins (Skins 2, 3, 4) with disciplined middle-over accumulation.",
        "Bowlers conceded only 12 runs in Skin 3, sealing the contest.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiTitans",
      points: [
        "Lost momentum in Skin 3, scoring only 12 runs.",
        "Conceded 4 run-outs due to panic calling when chasing 100+.",
        "Bowlers conceded 16 runs in the final over of Skin 4.",
      ],
    },
    turningPoint: {
      phase: "Skin 3 (Overs 9-12)",
      nature: "Tactical Domination",
      description:
        "Tigers' bowlers allowed only 12 runs in Skin 3 while scoring 28. The 16-run differential ended Titans' hopes of qualification.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 22, loserRuns: 24, margin: -2, summary: "Titans edged high-scoring opening skin." },
      { skin: 2, winnerRuns: 25, loserRuns: 17, margin: 8, summary: "Tigers took control in Skin 2." },
      { skin: 3, winnerRuns: 28, loserRuns: 12, margin: 16, summary: "Decisive middle-skin suffocation by Tigers." },
      { skin: 4, winnerRuns: 28, loserRuns: 16, margin: 12, summary: "Prateek Nahar masterclass closed the win." },
    ],

    matchVerdict: {
      verdict: "FATAL MISTAKE",
      explanation:
        "DesiTitans competed fiercely and actually won Skin 1 (24-22). However, a fatal tactical collapse in Skin 3—where they suffered two reckless run-outs and scored only 12 runs—handed DesiTigers a 34-run victory and locked in their place in the championship final.",
    },
    whyWinningTeamWon: [
      {
        observation: "Prateek Nahar's Anchor Masterclass",
        evidence: "Prateek scored 32 individual runs without a dismissal, turning strike on 78% of deliveries.",
        impact: "Guaranteed a 28-run skin in the final partnership and eliminated scoreboard pressure.",
      },
      {
        observation: "Mid-Match Bowling Adaptation",
        evidence: "After conceding 24 in Skin 1, Tigers' bowlers restricted Titans to 17, 12, and 16 runs in the remaining skins.",
        impact: "Completely throttled Titans' scoring avenues in the middle overs.",
      },
      {
        observation: "Skin 3 Defensive Suffocation",
        evidence: "Tigers conceded only one boundary in Overs 9-12, taking 2 wickets for 12 runs.",
        impact: "Turned a 6-run lead into a commanding 22-run lead entering the final skin.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Panic Run-Outs in Middle Overs",
        evidence: "Titans conceded 4 run-outs across Skins 2 and 3 (-20 penalty runs).",
        impact: "Erased their gross batting gains and killed the momentum generated in Skin 1.",
      },
      {
        observation: "Skin 3 Collapse",
        evidence: "Titans managed only 12 runs in Skin 3, their lowest skin return of the match.",
        impact: "Surrendered a 16-run differential to Tigers' 28-run response.",
      },
      {
        observation: "Death Over Concessions",
        evidence: "Titans conceded 16 runs off Over 16 to Prateek Nahar and Sajid Merchant.",
        impact: "Blew out the margin from 18 runs to 34 runs.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Abhishek Agarwal & Gagandeep Singh",
          winnerRuns: 22,
          winnerDismissals: 1,
          loserPair: "Prateek Nahar & Preraq Mistry",
          loserRuns: 24,
          loserDismissals: 1,
          skinMargin: -2,
          skinWinner: "DesiTitans",
          analysis: "Titans played their best indoor cricket of the tournament, edging Skin 1 by 2 runs with clean boundary hitting.",
        },
        {
          pairNumber: 2,
          winnerPair: "Darshan Mody & Hardik Desai",
          winnerRuns: 25,
          winnerDismissals: 0,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: 17,
          loserDismissals: 1,
          skinMargin: 8,
          skinWinner: "DesiTigers",
          analysis: "Tigers took control with disciplined running; zero dismissals restored a 6-run overall lead.",
        },
        {
          pairNumber: 3,
          winnerPair: "Manthan Shah & Taha Shipchandler",
          winnerRuns: 28,
          winnerDismissals: 1,
          loserPair: "Yash Sisodia & Mayank Agarwal",
          loserRuns: 12,
          loserDismissals: 2,
          skinMargin: 16,
          skinWinner: "DesiTigers",
          analysis: "The match-defining partnership. Tigers strangled Titans' third pair, opening a 22-run cushion.",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Nahar & Sajid Merchant",
          winnerRuns: 28,
          winnerDismissals: 0,
          loserPair: "Vipul Jain & Ronak Jain",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 12,
          skinWinner: "DesiTigers",
          analysis: "Prateek Nahar's POTM performance sealed the victory with 28 runs in the final skin.",
        },
      ],
      skinsStory:
        "Titans struck first by winning Skin 1, but Tigers adjusted their bowling lengths and dominated Skins 2, 3, and 4 with increasing authority.",
    },
    turningPointDetailed: {
      matchStateBefore: "Tigers led by only 6 runs (47-41) after Skin 2.",
      event: "Tigers' bowlers conceded only 12 runs in Skin 3 while Manthan and Taha replied with 28 runs.",
      matchStateAfter: "Tigers held a 75-53 lead (+22 runs) heading into Skin 4.",
      whyItMattered: "Mathematically extinguished Titans' hopes of qualification for the Championship Final.",
    },
    fatalMistake: {
      mistake: "Attempting a suicidal second run on Over 10 Ball 3 when trailing by only 8 runs.",
      impact: "Direct-hit run out cost -5 runs and halted Titans' momentum in Skin 3.",
    },
    playerImpact: [
      {
        player: "Prateek Nahar",
        label: "MATCH WINNER",
        explanation: "Scored 32 runs with zero dismissals, earning POTM honors and driving Tigers into the Final.",
      },
      {
        player: "Manthan Shah",
        label: "PARTNERSHIP BUILDER",
        explanation: "Led Skin 3 with 16 runs and executed tight middle-over bowling.",
      },
      {
        player: "Hardik Desai",
        label: "SILENT CONTRIBUTOR",
        explanation: "Battled hard for Titans with 14 runs and a wicket, but lacked team support.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Patient early-over accumulation turning into boundary explosions on balls 5 and 6.",
          "High dismissal mitigation (only 2 wickets lost in 16 overs).",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Strong powerplay intent in Skin 1 followed by conservative hesitation in Skins 2 and 3.",
          "Vulnerable to panic calling when required rate climbed above 7.0.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Adjusted lengths after Skin 1, pulling lengths back to hit splice and ribs.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Competed well in patches but leaked 28 runs in both Skins 3 and 4.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Tigers captain demonstrated tactical maturity by altering bowling plans after losing Skin 1. Titans captain failed to prevent the middle-skin panic that led to multiple run-outs.",
      captainTakeaways: [
        "When losing Skin 1, do not panic; trust defensive lengths in middle skins.",
        "Emphasize loud calling to avoid giving away 20 runs in unforced run-outs.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["SKIN SPECIALISTS", "PARTNERSHIP DRIVEN", "DISCIPLINED BOWLERS"],
        evidence: "Recovered from an opening skin loss to sweep the remaining 3 skins by 36 runs combined.",
      },
      {
        team: "DesiTitans",
        traits: ["INCONSISTENT UNDER PRESSURE", "DISMISSAL PRONE"],
        evidence: "Conceded 4 run-outs and collapsed for 12 runs in Skin 3.",
      },
    ],
    finalHardHittingVerdict:
      "DesiTigers absorbed Titans' best opening punch, tightened their lengths, and proved why championship teams win the middle skins.",
  },

  // ==========================================
  // Match 5: VPGR vs DesiTigers (CHAMPIONSHIP FINAL)
  // ==========================================
  "5": {
    matchId: 5,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "VPGR vs DesiTigers (Final)",
    date: "18 May 2026, 9:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "VPGR",
    scoreSummary: "DesiTigers 111 def. VPGR 94 (+17 run margin, 3-1 skins)",
    editorHeadline: "Tigers Crowned Champions in 111-94 Final Thriller as VPGR Rallies Too Late",
    editorSummary:
      "DesiTigers clinched the Desi Boys Championship with a masterclass 17-run triumph over VPGR. Player of the Match Abhishek Agarwal spearheaded the triumph, partnering Gagandeep Singh in a match-defining 28-run opening skin. While VPGR produced an explosive 35-run final skin from Himanshu Kalyani and Harshal Joshi, Tigers' middle-skin cushion proved impenetrable.",
    whatWentRightWinner: {
      title: "Championship Execution for DesiTigers",
      points: [
        "Tactical promotion of Abhishek Agarwal & Gagandeep Singh yielded +28 runs in Skin 1.",
        "Darshan Mody & Hardik Desai dismantled VPGR's middle order with +31 runs in Skin 2.",
        "Conceded only 2 dismissals across the entire 16 overs of the Championship Final.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for VPGR",
      points: [
        "Middle skins (Skins 2 & 3) generated only 18 and 19 runs against hostile Tiger bowling.",
        "Conceded a 21-run deficit across the middle 8 overs.",
        "Harshal Joshi was held back until Skin 4, leaving middle skins isolated.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Tactical Domination",
      description:
        "Tigers' Darshan Mody and Hardik Desai piled on 31 runs while restricting VPGR's pair to 18 runs. The 13-run swing opened a 19-run cushion that VPGR could never close.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 28, loserRuns: 22, margin: 6, summary: "Tigers promoted pair stunned VPGR's openers." },
      { skin: 2, winnerRuns: 31, loserRuns: 18, margin: 13, summary: "Championship-winning skin by Darshan & Hardik." },
      { skin: 3, winnerRuns: 24, loserRuns: 19, margin: 5, summary: "Tigers held line; VPGR restricted to singles." },
      { skin: 4, winnerRuns: 28, loserRuns: 35, margin: -7, summary: "VPGR rallied heroically with 35, but Tigers held lead." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "DesiTigers won the championship through superior tactical design. By promoting Abhishek Agarwal & Gagandeep Singh to open Skin 1 (+28 runs) and dominating Skin 2 (+31 runs), they built an unassailable 24-run cushion. VPGR's brilliant 35-run final skin was heroic but mathematically too late.",
    },
    whyWinningTeamWon: [
      {
        observation: "Tactical Opening Skin Promotion",
        evidence: "Tigers promoted Abhishek Agarwal & Gagandeep Singh to Skin 1; they delivered 28 runs against VPGR's spearheads.",
        impact: "Immediately neutralized VPGR's psychological edge and forced them to chase from behind.",
      },
      {
        observation: "Dominant Middle Skins Control",
        evidence: "Tigers outscored VPGR 55 to 37 across Skins 2 and 3 (+18 run differential).",
        impact: "Built a 24-run lead entering the final skin, rendering VPGR's 35-run rally insufficient.",
      },
      {
        observation: "Near-Zero Dismissal Rate in a Final",
        evidence: "Tigers suffered only 2 dismissals in 96 deliveries (-10 penalty runs).",
        impact: "Ensured every boundary and physical run directly enlarged their winning margin.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Middle-Order Stagnation",
        evidence: "VPGR scored only 18 and 19 runs in Skins 2 and 3, hitting only 2 boundaries in 8 overs.",
        impact: "Allowed Tigers to dictate terms and build a 24-run lead.",
      },
      {
        observation: "Holding Back Harshal Joshi",
        evidence: "VPGR slotted strike bowler/batter Harshal Joshi into Skin 4 rather than using him to anchor Skin 2.",
        impact: "Left Skins 2 and 3 without an elite boundary threat when the championship was being decided.",
      },
      {
        observation: "Inability to Create Wickets in Final",
        evidence: "VPGR bowlers took only 2 wickets against Tigers' top order.",
        impact: "Failed to apply negative run pressure to Tigers' accumulators.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Abhishek Agarwal & Gagandeep Singh",
          winnerRuns: 28,
          winnerDismissals: 1,
          loserPair: "Kalrav Shah & Ankush Goel",
          loserRuns: 22,
          loserDismissals: 1,
          skinMargin: 6,
          skinWinner: "DesiTigers",
          analysis: "Abhishek took POTM honors with fearless front-court hitting, edging VPGR's benchmark opening pair.",
        },
        {
          pairNumber: 2,
          winnerPair: "Darshan Mody & Hardik Desai",
          winnerRuns: 31,
          winnerDismissals: 0,
          loserPair: "Harshwardhan Chauhan & Hemal Gathani",
          loserRuns: 18,
          loserDismissals: 2,
          skinMargin: 13,
          skinWinner: "DesiTigers",
          analysis: "The championship-winning partnership. Darshan and Hardik played with zero errors, piling on 31 runs.",
        },
        {
          pairNumber: 3,
          winnerPair: "Preraq Mistry & Taha Shipchandler",
          winnerRuns: 24,
          winnerDismissals: 1,
          loserPair: "Meet Shah & Parth Shah",
          loserRuns: 19,
          loserDismissals: 1,
          skinMargin: 5,
          skinWinner: "DesiTigers",
          analysis: "A tense middle-skin battle. Tigers held their ground to push their aggregate lead to 24 runs.",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Nahar & Sajid Merchant",
          winnerRuns: 28,
          winnerDismissals: 0,
          loserPair: "Himanshu Kalyani & Harshal Joshi",
          loserRuns: 35,
          loserDismissals: 0,
          skinMargin: -7,
          skinWinner: "VPGR",
          analysis: "An electric 4th skin. Himanshu and Harshal scored 35, but Prateek and Sajid replied with 28 to seal the championship.",
        },
      ],
      skinsStory:
        "Tigers won the first three skins to establish an insurmountable 24-run buffer. VPGR's 35-run masterpiece in Skin 4 showed champion heart, but Tigers' 28-run reply safely preserved the title.",
    },
    turningPointDetailed: {
      matchStateBefore: "Tigers held a slim 28-22 lead after Skin 1.",
      event: "Darshan Mody and Hardik Desai scored 31 runs in Skin 2 while VPGR was restricted to 18.",
      matchStateAfter: "Tigers' lead expanded to 19 runs (59-40), putting VPGR under extreme pressure.",
      whyItMattered: "Forced VPGR to abandon structured running and chase impossible boundary targets.",
    },
    fatalMistake: {
      mistake: "VPGR's decision to maintain conservative field placements during Skin 2 instead of attacking the stumps.",
      impact: "Allowed Darshan and Hardik to take 14 easy singles without risking dismissals.",
    },
    playerImpact: [
      {
        player: "Abhishek Agarwal",
        label: "MATCH WINNER",
        explanation: "Player of the Match in the Final; his 28-run opening salvo set the championship tone.",
      },
      {
        player: "Hardik Desai",
        label: "SKIN WINNER",
        explanation: "Flawless execution in Skin 2 with 16 runs and zero errors to create the winning margin.",
      },
      {
        player: "Harshal Joshi",
        label: "GAME CHANGER",
        explanation: "Fired 20 runs in Skin 4 to lead VPGR's 35-run rally, but was deployed one skin too late.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Championship-level composure; zero panicked calls across 16 overs.",
          "Targeted side nets consistently for 2-run bonuses.",
        ],
      },
      {
        team: "VPGR",
        observations: [
          "Too passive in Skins 2 and 3, accumulating 18 dot balls.",
          "Exploded with intent in Skin 4, demonstrating what earlier aggression could have achieved.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Bowled disciplined off-stump channels in middle overs.",
        ],
      },
      {
        team: "VPGR",
        observations: [
          "Struggled to penetrate Tigers' defensive wall, producing only 2 wickets.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Tigers captain Manthan Shah outmaneuvered VPGR with the opening skin promotion of Abhishek & Gagandeep. Himanshu Kalyani showed great leadership to rally his side to 35 in Skin 4, but his middle-skin structure cost the title.",
      captainTakeaways: [
        "In a championship final, surprise the opposition with an attacking opening pair.",
        "Never save your best boundary hitters for the final skin if the game is slipping away in Skin 2.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["CHAMPIONS", "PARTNERSHIP DRIVEN", "DISCIPLINED BOWLERS", "ELITE CHEMISTRY"],
        evidence: "Scored 111 runs with 3 skins won in the pressure of a championship final.",
      },
      {
        team: "VPGR",
        traits: ["RESILIENT", "AGGRESSIVE FINISHERS", "DISCIPLINED BOWLERS"],
        evidence: "Fought back with 35 runs in Skin 4, falling just 17 runs short of the title.",
      },
    ],
    finalHardHittingVerdict:
      "DesiTigers are champions because they won the middle skins where championships are actually decided, leaving VPGR's brilliant final skin one partnership short.",
  },

  // ==========================================
  // Match 6: DesiTitans vs DesiDabanggs (3RD PLACE PLAYOFF)
  // ==========================================
  "6": {
    matchId: 6,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTitans vs DesiDabanggs (3rd Place Playoff)",
    date: "18 May 2026, 7:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiDabanggs",
    loser: "DesiTitans",
    scoreSummary: "DesiDabanggs 94 def. DesiTitans 76 (+18 run margin, 3-1 skins)",
    editorHeadline: "Preraq Mistry's Resurgence Inspires Dabanggs to 3rd-Place Playoff Triumph",
    editorSummary:
      "DesiDabanggs redeemed a frustrating tournament campaign by capturing 3rd place with an 18-run victory over DesiTitans. Having managed only 53 and 56 runs in their previous two matches, Dabanggs erupted for 94 runs. Player of the Match Preraq Mistry set the tone in Skin 1 with 28 runs, while Titans were undone by 6 costly dismissals.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiDabanggs",
      points: [
        "Preraq Mistry scored 28 runs in Skin 1 to win Player of the Match.",
        "Rebounded from 53 and 56 run group scores to post 94 runs.",
        "Won Skins 1, 2, and 3 to build an unassailable 23-run lead.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiTitans",
      points: [
        "Conceded 6 dismissals (-30 penalty runs) across the 16 overs.",
        "Middle skins produced only 18 and 17 runs.",
        "Bowling lacked discipline in high-pressure death deliveries.",
      ],
    },
    turningPoint: {
      phase: "Skin 1 (Overs 1-4)",
      nature: "Turnaround",
      description:
        "After two matches of opening collapses, Preraq Mistry and Sandesh Jagtap blasted 28 runs in Skin 1. The immediate 8-run lead transformed Dabanggs' confidence.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 28, loserRuns: 20, margin: 8, summary: "Preraq Mistry's POTM start ignited Dabanggs." },
      { skin: 2, winnerRuns: 25, loserRuns: 18, margin: 7, summary: "Manthan & Tejas stabilized middle overs." },
      { skin: 3, winnerRuns: 22, loserRuns: 17, margin: 5, summary: "Darshan Mody controlled the third skin." },
      { skin: 4, winnerRuns: 19, loserRuns: 21, margin: -2, summary: "Titans edged final skin, but Dabanggs won comfortably." },
    ],

    matchVerdict: {
      verdict: "TURNAROUND",
      explanation:
        "DesiDabanggs executed a remarkable turnaround after scoring only 53 and 56 runs in the group stages. Restructuring their batting order to promote Preraq Mistry yielded 94 runs, three skin victories, and an 18-run playoff triumph.",
    },
    whyWinningTeamWon: [
      {
        observation: "Aggressive Opening Statement",
        evidence: "Preraq Mistry and Sandesh Jagtap scored 28 runs in Skin 1 with zero dismissals.",
        impact: "Banished the self-doubt from earlier collapses and forced Titans onto defense.",
      },
      {
        observation: "Consistent Partnership Scoring",
        evidence: "Dabanggs scored 28, 25, 22, and 19 runs across their four partnerships.",
        impact: "Demonstrated team-wide discipline with no single partnership collapsing below 19.",
      },
      {
        observation: "Clutch Wicket Creation",
        evidence: "Dabanggs took 6 wickets (-30 penalty runs) against Titans' middle order.",
        impact: "Wiped out Titans' boundary bursts in Skins 2 and 3.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Self-Inflicted Dismissal Damage",
        evidence: "Titans conceded 6 dismissals (-30 runs) including 4 unforced run-outs.",
        impact: "Turned a competitive 106-run gross effort into a disappointing 76-run net total.",
      },
      {
        observation: "Skin 2 and 3 Deficits",
        evidence: "Titans were outscored 47-35 across the middle two skins.",
        impact: "Allowed Dabanggs to build a 20-run cushion before the final skin.",
      },
      {
        observation: "Inability to Stop Preraq Mistry",
        evidence: "Titans bowlers bowled short and wide to Preraq in Skin 1, conceding 3 boundaries.",
        impact: "Allowed Dabanggs to seize the momentum from ball one.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Preraq Mistry & Sandesh Jagtap",
          winnerRuns: 28,
          winnerDismissals: 0,
          loserPair: "Prateek Nahar & Preraq Mistry",
          loserRuns: 20,
          loserDismissals: 1,
          skinMargin: 8,
          skinWinner: "DesiDabanggs",
          analysis: "Preraq Mistry played his best innings of the tournament, scoring 18 runs to anchor a 28-run skin.",
        },
        {
          pairNumber: 2,
          winnerPair: "Manthan Shah & Tejas Shah",
          winnerRuns: 25,
          winnerDismissals: 1,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: 18,
          loserDismissals: 2,
          skinMargin: 7,
          skinWinner: "DesiDabanggs",
          analysis: "Manthan and Tejas controlled the running crease, forcing two run-outs from Titans.",
        },
        {
          pairNumber: 3,
          winnerPair: "Darshan Mody & Narendra Tiwari",
          winnerRuns: 22,
          winnerDismissals: 1,
          loserPair: "Yash Sisodia & Mayank Agarwal",
          loserRuns: 17,
          loserDismissals: 2,
          skinMargin: 5,
          skinWinner: "DesiDabanggs",
          analysis: "Darshan utilized soft hands into the corners, grinding out a 5-run skin margin.",
        },
        {
          pairNumber: 4,
          winnerPair: "Ravi Kumar & Sandeep Khedekar",
          winnerRuns: 19,
          winnerDismissals: 1,
          loserPair: "Vipul Jain & Ronak Jain",
          loserRuns: 21,
          loserDismissals: 1,
          skinMargin: -2,
          skinWinner: "DesiTitans",
          analysis: "Titans fought back to take the final skin 21-19, but Dabanggs celebrated 3rd place.",
        },
      ],
      skinsStory:
        "Dabanggs won the first three skins methodically. The 20-run buffer proved plenty despite Titans taking a consolation victory in Skin 4.",
    },
    turningPointDetailed: {
      matchStateBefore: "Dabanggs entered the match on the back of humiliating 53 and 56 run losses.",
      event: "Preraq Mistry hit three boundaries in the first two overs of Skin 1, scoring 28 runs.",
      matchStateAfter: "Dabanggs took an immediate 28-20 lead, transforming team confidence.",
      whyItMattered: "Proved Dabanggs could score heavily when batting with positive intent.",
    },
    fatalMistake: {
      mistake: "Titans conceded 3 run-outs in the space of 7 deliveries during Skin 2.",
      impact: "Cost 15 runs and ended any chance of challenging Dabanggs' lead.",
    },
    playerImpact: [
      {
        player: "Preraq Mistry",
        label: "MATCH WINNER",
        explanation: "Player of the Match; scored 28 runs in Skin 1 to inspire Dabanggs' 94-run total.",
      },
      {
        player: "Manthan Shah",
        label: "PARTNERSHIP BUILDER",
        explanation: "Scored 14 runs and bowled 2 tight overs in Skin 2 to preserve the advantage.",
      },
      {
        player: "Hardik Desai",
        label: "DISCIPLINE PROBLEM",
        explanation: "Suffered two costly run-outs in Skin 2 that wrecked Titans' momentum.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiDabanggs",
        observations: [
          "Dramatically improved running between wickets compared to group stage.",
          "High conversion of loose balls into 2-run physical scores.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Persistent panic calling in middle overs resulting in 4 run-outs.",
          "Struggled to rotate strike against spin.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiDabanggs",
        observations: [
          "Attacked the stumps and induced 6 dismissals.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Conceded too many free boundaries in Skin 1.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Darshan Mody deserved immense credit for restructuring Dabanggs' order after two heavy defeats. Hardik Desai was unable to curb his team's tendency to panic when trailing.",
      captainTakeaways: [
        "Order changes can reset a struggling batting unit; front-load in-form hitters.",
        "Eliminate run-outs through mandatory calling discipline.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiDabanggs",
        traits: ["RESILIENT", "PARTNERSHIP DRIVEN", "PRESSURE BUILDERS"],
        evidence: "Overcame consecutive heavy defeats to score 94 runs and win 3 skins.",
      },
      {
        team: "DesiTitans",
        traits: ["DISMISSAL PRONE", "INCONSISTENT UNDER PRESSURE"],
        evidence: "Lost 6 wickets and surrendered 3rd place despite scoring 21 in Skin 4.",
      },
    ],
    finalHardHittingVerdict:
      "DesiDabanggs proved that in tournament indoor cricket, one tactical batting order reset can transform a losing team into playoff winners.",
  },

  // ==========================================
  // Match 7: Practice Match (Home Team vs Away Team)
  // ==========================================
  "7": {
    matchId: 7,
    tournamentName: "Desisports Regular Practice",
    matchTitle: "Home Team vs Away Team",
    date: "09 Sep 2026, 20:17",
    venue: "Insportz Club, Dubai (Court 2)",
    winner: "Away Team",
    loser: "Home Team",
    scoreSummary: "Away Team 120 def. Home Team 63 (+57 run margin, 4-0 skins)",
    editorHeadline: "Yash's Masterful +19 Impact Propels Away Team to Crushing 120-63 Practice Triumph",
    editorSummary:
      "In a high-intensity Spawtz practice encounter at Insportz Club, Away Team showcased clinical indoor supremacy with a 57-run dismantling of Home Team. Player of the Match Yash spearheaded the clinic, scoring 18 runs and conceding -1 run across 2.0 overs with 3 wickets (+19 contribution). Home Team was derailed by 7 dismissals and an abysmal -3 run second skin.",
    whatWentRightWinner: {
      title: "Tactical Masterclass for Away Team",
      points: [
        "Yash delivered an immaculate +19 contribution (18 RS, -1 RC, 3 wickets).",
        "Away Team scored 120 total runs, averaging 30 runs per skin.",
        "Bowlers took 7 wickets (-35 penalty runs), including a devastating 3-wicket Skin 2.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for Home Team",
      points: [
        "Skin 2 imploded for -3 runs, suffering 3 dismissals against hostile bowling.",
        "Conceded 7 dismissals (-35 penalty runs) in 16 overs.",
        "Bowlers leaked 120 runs, allowing Away Team to score freely into the side nets.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Bowling Mastery",
      description:
        "Yash and Sahil choked Home Team's second pair to -3 runs while taking 3 wickets. The 36-run skin margin (33 vs -3) ended the practice contest as a competitive fixture.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 34, loserRuns: 27, margin: 7, summary: "Competitive opening skin; Away edged by 7." },
      { skin: 2, winnerRuns: 33, loserRuns: -3, margin: 36, summary: "Yash's bowling spell dismantled Home Team." },
      { skin: 3, winnerRuns: 34, loserRuns: 29, margin: 5, summary: "High-scoring middle skin; Away held line." },
      { skin: 4, winnerRuns: 19, loserRuns: 10, margin: 9, summary: "Away bowlers closed out the 4-0 skin sweep." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "Away Team dominated every phase of this practice encounter. Scoring 120 runs across 16 overs and sweeping all four skins, their bowlers took 7 wickets and restricted Home Team to 63 runs. Yash's +19 contribution was the standout individual performance of the evening.",
    },
    whyWinningTeamWon: [
      {
        observation: "Yash's Elite Two-Way Dominance",
        evidence: "Yash scored 18 runs with zero dismissals, conceded -1 run in 2 overs, and took 3 wickets (+19 contribution).",
        impact: "Directly accounted for a +36 run swing in Skin 2.",
      },
      {
        observation: "Balanced Scoring Across All 4 Skins",
        evidence: "Away Team posted 34, 33, 34, and 19 runs across their four partnerships.",
        impact: "Gave Home Team no respite and maintained a scoring rate above 7.5 per over.",
      },
      {
        observation: "Relentless Wicket Creation",
        evidence: "Away Team bowlers created 7 dismissals, deducting 35 runs from Home Team's total.",
        impact: "Crushed Home Team's momentum whenever they threatened to rebuild.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Catastrophic Skin 2 Breakdown",
        evidence: "Home Team scored -3 net runs in Skin 2, losing 3 wickets in 8 deliveries.",
        impact: "Surrendered a 36-run skin differential in 15 minutes of play.",
      },
      {
        observation: "Failure to Contain Side-Net Scoring",
        evidence: "Home Team conceded 120 runs, allowing Away batters 26 two-run physical crosses.",
        impact: "Allowed Away Team to score comfortably without taking aerial risks.",
      },
      {
        observation: "Inability to Recover from Dismissals",
        evidence: "Home Team conceded consecutive dot balls following each dismissal, compounding pressure.",
        impact: "Failed to reset momentum during high-leverage overs.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Deepak & Yash",
          winnerRuns: 34,
          winnerDismissals: 0,
          loserPair: "Shubham & Arif",
          loserRuns: 27,
          loserDismissals: 1,
          skinMargin: 7,
          skinWinner: "Away Team",
          analysis: "Deepak (16) and Yash (18) established immediate command with 34 runs and zero dismissals.",
        },
        {
          pairNumber: 2,
          winnerPair: "Narendra & Maneesh",
          winnerRuns: 33,
          winnerDismissals: 1,
          loserPair: "Akshay & Jigar",
          loserRuns: -3,
          loserDismissals: 3,
          skinMargin: 36,
          skinWinner: "Away Team",
          analysis: "The defining partnership. Yash and Sahil destroyed Akshay and Jigar for -3 runs.",
        },
        {
          pairNumber: 3,
          winnerPair: "Sahil & Sunny",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Himanshu & Manthan",
          loserRuns: 29,
          loserDismissals: 1,
          skinMargin: 5,
          skinWinner: "Away Team",
          analysis: "Home Team fought back with 29 runs, but Sahil and Sunny matched them with 34.",
        },
        {
          pairNumber: 4,
          winnerPair: "Shaurya & Prateek",
          winnerRuns: 19,
          winnerDismissals: 1,
          loserPair: "Ankush & Tejas",
          loserRuns: 10,
          loserDismissals: 2,
          skinMargin: 9,
          skinWinner: "Away Team",
          analysis: "Away Team closed out the 4-0 skin sweep by holding Ankush and Tejas to 10 runs.",
        },
      ],
      skinsStory:
        "Away Team swept all four skins cleanly. The 36-run blowout in Skin 2 broke Home Team's back, while consistent 34-run returns in Skins 1 and 3 sealed a 57-run victory.",
    },
    turningPointDetailed: {
      matchStateBefore: "Away Team led by 7 runs (34-27) after a competitive Skin 1.",
      event: "Yash bowled Over 5, conceding -3 runs with 2 dismissals; Sahil followed with a run-out.",
      matchStateAfter: "Home Team dropped to 24-67 overall, trailing by 43 runs after 8 overs.",
      whyItMattered: "Ended any possibility of Home Team competing for the match victory.",
    },
    fatalMistake: {
      mistake: "Akshay and Jigar attempting quick drop-and-runs against Yash's direct line.",
      impact: "Two run-outs in 4 deliveries turned a 12-run gross skin into -3 net runs.",
    },
    playerImpact: [
      {
        player: "Yash",
        label: "MATCH WINNER",
        explanation: "Player of the Match with 18 runs, -1 runs conceded, 3 wickets, and +19 contribution.",
      },
      {
        player: "Deepak",
        label: "PARTNERSHIP BUILDER",
        explanation: "Anchored Skin 1 with 16 runs, rotating strike to allow Yash to attack.",
      },
      {
        player: "Manthan",
        label: "SILENT CONTRIBUTOR",
        explanation: "Fought hard for Home Team with 16 runs in Skin 3 despite the blowout.",
      },
    ],
    battingBehaviour: [
      {
        team: "Away Team",
        observations: [
          "Superb balance between physical running and net-zone exploitation.",
          "Low dot-ball rate (only 18% across 16 overs).",
        ],
      },
      {
        team: "Home Team",
        observations: [
          "Tendency to freeze following a dismissal, conceding multiple dot balls.",
          "Struggled with calling against tight front-court fielders.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "Away Team",
        observations: [
          "Masterful control of lengths, producing 7 wickets and negative economy rates.",
        ],
      },
      {
        team: "Home Team",
        observations: [
          "Leaked 120 runs by bowling too full and too wide into the hitting zones.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Away captain deployed Yash at the exact right moments (Over 1 and Over 5) to break both opening pairs. Home captain failed to adjust fielders when Away pairs repeatedly found the side nets.",
      captainTakeaways: [
        "Front-load strike bowlers against opponent's top order.",
        "Never allow a batting pair to score in negative figures; switch to defensive blocks.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "Away Team",
        traits: ["AGGRESSIVE SCORERS", "DISCIPLINED BOWLERS", "SKIN SPECIALISTS"],
        evidence: "Scored 120 runs, swept all 4 skins, and conceded only 63 runs.",
      },
      {
        team: "Home Team",
        traits: ["DISMISSAL PRONE", "INCONSISTENT UNDER PRESSURE"],
        evidence: "Suffered 7 dismissals and posted -3 in Skin 2.",
      },
    ],
    finalHardHittingVerdict:
      "Away Team won by 57 runs because Yash and his bowling partners attacked the stumps with precision, while Home Team handed away 35 runs in unforced dismissals.",
  },
};

export function getMatchAnalysis(matchId: number | string): MatchTacticalAnalysis | null {
  return MATCH_ANALYSES[String(matchId)] || null;
}
