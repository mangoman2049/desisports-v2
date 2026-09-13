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
    scoreSummary: "VPGR 80 def. DesiTitans 41 (+39 run margin, 3-1 skins, 7-1 tournament pts)",
    editorHeadline: "Ankush Goel's 4-Wicket Spell Decimates Titans in Tournament Opener",
    editorSummary:
      "VPGR opened their tournament campaign with a commanding 39-run victory over DesiTitans, securing 7 tournament points (3 skins × 1 pt + 4 match pts) to Titans' 1 point. Ankush Goel delivered a masterclass in indoor bowling discipline, conceding minus runs while taking 4 wickets. DesiTitans struggled to cope with the back-of-a-length line and conceded 3 run-outs in the middle skins.",
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
      { skin: 1, winnerRuns: 26, loserRuns: 18, margin: 8, summary: "Abhishek & Ankush established early command." },
      { skin: 2, winnerRuns: 22, loserRuns: -3, margin: 25, summary: "Ankush's spell dismantled Titans' middle order." },
      { skin: 3, winnerRuns: 16, loserRuns: 14, margin: 2, summary: "Low-scoring grind; VPGR held nerve." },
      { skin: 4, winnerRuns: 16, loserRuns: 12, margin: 4, summary: "Himanshu closed out the match safely." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "VPGR controlled the match across both innings. In the second innings, DesiTitans were restricted to only 41 total runs across 16 overs through disciplined field placement and sharp run-outs. DesiTitans never established a single partnership above 20 runs.",
    },
    whyWinningTeamWon: [
      {
        observation: "Bowling Discipline and Wicket Pressure",
        evidence: "VPGR created 7 total dismissals (-35 penalty runs) while conceding zero multi-run extras in the powerplay.",
        impact: "Forced Titans to bat from negative skin totals for over half the match.",
      },
      {
        observation: "Opening Skin Control",
        evidence: "Abhishek Agarwal and Ankush Goel scored 26 runs against Titans' spearhead bowling without suffering a dismissal.",
        impact: "Set a comfortable tempo and banked the first 3 tournament points cleanly.",
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
          winnerPair: "Abhishek Agarwal & Ankush Goel",
          winnerRuns: 26,
          winnerDismissals: 0,
          loserPair: "Milan Chheda & Deepak Thawani",
          loserRuns: 18,
          loserDismissals: 1,
          skinMargin: 8,
          skinWinner: "VPGR",
          analysis: "Abhishek and Ankush displayed textbook indoor calling; zero dismissals built an immediate 8-run lead (1 tournament pt).",
        },
        {
          pairNumber: 2,
          winnerPair: "Sajid Merchant & Tejas Shah",
          winnerRuns: 22,
          winnerDismissals: 1,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: -3,
          loserDismissals: 3,
          skinMargin: 25,
          skinWinner: "VPGR",
          analysis: "The defining partnership of the game. Ankush Goel's bowling dismantled Hardik & Harsh into negative figures (+25 margin).",
        },
        {
          pairNumber: 3,
          winnerPair: "Manish Jain & Parth Shah",
          winnerRuns: 16,
          winnerDismissals: 2,
          loserPair: "Yash Sisodia & Mayank Agarwal",
          loserRuns: 14,
          loserDismissals: 2,
          skinMargin: 2,
          skinWinner: "VPGR",
          analysis: "A defensive arm-wrestle. Manish and Parth survived two wickets to scrape the skin by 2 runs.",
        },
        {
          pairNumber: 4,
          winnerPair: "Himanshu Kalyani & Dhaval Bheda",
          winnerRuns: 16,
          winnerDismissals: 1,
          loserPair: "Prateek Jain & Ronak Jain",
          loserRuns: 12,
          loserDismissals: 2,
          skinMargin: 4,
          skinWinner: "VPGR",
          analysis: "Himanshu managed the closing overs with low-risk ground blocks, securing all 4 skins.",
        },
      ],
      skinsStory:
        "VPGR swept all four skins through broad structural superiority, capturing 7 tournament points (3 skins × 1 pt + 4 match win pts) while Titans salvaged 1 point from their solitary skin contest.",
    },
    turningPointDetailed: {
      matchStateBefore: "Titans trailed 18-26 after Skin 1, remaining well within touching distance.",
      event: "Ankush Goel took 3 wickets in Overs 5 and 7, bowling with extreme bounce into the ribs.",
      matchStateAfter: "Titans crashed to -3 in Skin 2, blowing the aggregate deficit out to 33 runs.",
      whyItMattered: "Demolished Titans' chase structure and forced their lower pairs into panic slogging.",
    },
    fatalMistake: {
      mistake: "Titans' Skin 2 pair taking uncalculated drop-and-run singles against Ankush Goel.",
      impact: "Two avoidable run-outs in 5 deliveries cost 10 net runs and broke batting confidence.",
    },
    playerImpact: [
      {
        player: "Ankush Goel",
        label: "MATCH WINNER",
        explanation: "Took 4 wickets with negative economy and contributed 14 batting runs with zero dismissals.",
      },
      {
        player: "Abhishek Agarwal",
        label: "PARTNERSHIP BUILDER",
        explanation: "Anchored Skin 1 with 12 physical runs and vocal strike rotation calling.",
      },
      {
        player: "Hardik Desai",
        label: "MISSED OPPORTUNITY",
        explanation: "Captain conceded two run-outs in Skin 2, leaving the team with a negative return.",
      },
    ],
    battingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Aggressive front-court drop and run on balls 1-4 of every over.",
          "High proportion of 2-run physical crosses (28 in total).",
          "Calculated restraint following any wicket to avoid consecutive -5 penalties.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Static calling between wickets leading to hesitant running.",
          "Over-targeting the back wall (Zone 6) instead of working side net bonuses.",
          "High dot-ball accumulation (44% across 16 overs).",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Tight back-of-length bowling directly at the batter's hips and ribcage.",
          "Extremely disciplined extras management (only 2 wides).",
          "Used strike bowler Ankush Goel against Titans' captain in Skin 2 with devastating effect.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Inconsistent length allowed VPGR batters to play off the back foot comfortably.",
          "Conceded 6 wides/no-balls, giving away 12 free runs and extra balls.",
          "Bowled weaker options in death overs of skin partnerships.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Himanshu Kalyani managed bowling changes with ruthless precision, matching Ankush Goel against Titans' core pair. Hardik Desai erred by withholding his best bowler until the skins were already lost.",
      captainTakeaways: [
        "Always deploy strike bowlers in the first two overs of a critical skin.",
        "Prioritize 2-run physical ground crosses over high-risk back-wall shots.",
        "Never gamble with an inexperienced bowler in the 4th over of a skin.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "VPGR",
        traits: ["CLUTCH BOWLING", "RUTHLESS EFFICIENCY", "HIGH DISCIPLINE"],
        evidence: "Conceded only 41 runs, forced 7 dismissals, and swept all four skins.",
      },
      {
        team: "DesiTitans",
        traits: ["PRESSURE SENSITIVE", "WEAK RUNNING CHEMISTRY", "INCONSISTENT LENGTH"],
        evidence: "Suffered 5 dismissals in middle overs and failed to convert ground singles.",
      },
    ],
    finalHardHittingVerdict:
      "VPGR showed the tournament how indoor cricket is played; DesiTitans played outdoor cricket in an indoor cage and paid the full -5 penalty price.",
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
    scoreSummary: "DesiTigers 113 def. DesiDabanggs 53 (+60 run margin, 4-0 skins, 8-0 tournament pts)",
    editorHeadline: "Manthan Shah's All-Round Heroics Power Tigers to 60-Run Demolition of Dabanggs",
    editorSummary:
      "DesiTigers delivered an emphatic statement of intent with a comprehensive 60-run sweep over DesiDabanggs, pocketing maximum 8 tournament points (4 skins × 1 pt + 4 match pts). Tigers captain Manthan Shah earned Player of the Match honors with an immaculate 29-run batting display followed by two wickets. DesiDabanggs imploded under relentless pressure, losing 8 wickets and finishing with just 53 runs.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Scored 113 runs with exceptional strike rotation across all four partnerships.",
        "Manthan Shah contributed +16 net (29 RS, 13 RC, 2 wickets).",
        "Swept all 4 skins cleanly, conceding zero skin points.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiDabanggs",
      points: [
        "Suffered 8 dismissals (-40 penalty runs), completely stalling run momentum.",
        "Conceded 34 runs in Skin 2 without taking a single wicket.",
        "Top-order collapse left the team chasing an impossible 7 runs per over.",
      ],
    },
    turningPoint: {
      phase: "Skin 1 (Overs 1-4)",
      nature: "Turnaround",
      description:
        "Tigers pair Kalrav Shah and Harshal joshi blasted 32 runs in Skin 1 without a single dismissal, demoralizing Dabanggs from the start.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 32, loserRuns: 16, margin: 16, summary: "Kalrav & Harshal put Dabanggs on the back foot immediately." },
      { skin: 2, winnerRuns: 34, loserRuns: 11, margin: 23, summary: "Manthan & Gaurav blew the game wide open with 34 runs." },
      { skin: 3, winnerRuns: 24, loserRuns: 14, margin: 10, summary: "Controlled consolidation by Hemang & Taha." },
      { skin: 4, winnerRuns: 23, loserRuns: 12, margin: 11, summary: "Prateek Nahar closed out the 4-0 sweep." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "DesiTigers produced a complete indoor cricket performance across both innings. Batting first, they compiled a commanding 113 runs. Bowling second, they suffocated Dabanggs to 53 runs while claiming all 4 skins.",
    },
    whyWinningTeamWon: [
      {
        observation: "Massive First-Innings Skin Totals",
        evidence: "Tigers posted 32 and 34 in their first two skins without conceding unnecessary dismissals.",
        impact: "Set an imposing 113 aggregate target and high skin benchmarks for Dabanggs to chase.",
      },
      {
        observation: "Aggressive Wicket-Taking Bowling",
        evidence: "Tigers took 8 wickets across 16 overs, forcing Dabanggs into constant -5 penalties.",
        impact: "Completely erased Dabanggs' boundary gains in the second innings.",
      },
      {
        observation: "Captain's Execution Under Pressure",
        evidence: "Manthan Shah scored 29 runs with zero dismissals and bowled 2 tight overs.",
        impact: "Provided unmatched leadership and locked up Skin 2 completely.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Epidemic of Dismissal Penalties",
        evidence: "Dabanggs suffered 8 dismissals costing 40 penalty runs.",
        impact: "Gross score of 93 was slashed to a net score of 53.",
      },
      {
        observation: "Inability to Stem Tigers' Boundary Flow",
        evidence: "Conceded 7 net-zone boundaries in the first 8 overs.",
        impact: "Allowed Tigers to score at over 8 runs per over in the first half.",
      },
      {
        observation: "Panic in the Second Innings Chase",
        evidence: "Dabanggs attempted high-risk lofted shots against tight boundary fielding.",
        impact: "Produced 4 catches off the back wall that killed off any recovery.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Kalrav Shah & Harshal joshi",
          winnerRuns: 32,
          winnerDismissals: 0,
          loserPair: "Preraq Mistry & Sandesh Jagtap",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 16,
          skinWinner: "DesiTigers",
          analysis: "Kalrav and Harshal batted with surgical precision, setting an unreachable 32-run benchmark for Dabanggs.",
        },
        {
          pairNumber: 2,
          winnerPair: "Manthan Shah & Gaurav Arora",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Gagandeep Singh & Chittaranjan Dey",
          loserRuns: 11,
          loserDismissals: 3,
          skinMargin: 23,
          skinWinner: "DesiTigers",
          analysis: "Manthan's masterclass in skin control. Piled on 34 runs before Tigers bowlers restricted Dabanggs to 11.",
        },
        {
          pairNumber: 3,
          winnerPair: "Hemang Shah & Taha Shipchandler",
          winnerRuns: 24,
          winnerDismissals: 1,
          loserPair: "Darshan Mody & Narendra Tiwari",
          loserRuns: 14,
          loserDismissals: 2,
          skinMargin: 10,
          skinWinner: "DesiTigers",
          analysis: "Steady partnership building by Hemang and Taha kept Dabanggs at arm's length.",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Nahar & Rohan Khedekar",
          winnerRuns: 23,
          winnerDismissals: 1,
          loserPair: "Ravi Kumar & Sandeep Khedekar",
          loserRuns: 12,
          loserDismissals: 2,
          skinMargin: 11,
          skinWinner: "DesiTigers",
          analysis: "Prateek Nahar managed the death overs cleanly, securing the final 3 tournament points.",
        },
      ],
      skinsStory:
        "DesiTigers achieved a flawless 8-point clean sweep (4 skins × 3 pts + 4 match pts). The 39-run differential in the first two skins ended the contest before halfway.",
    },
    turningPointDetailed: {
      matchStateBefore: "Match was scoreless at ball 1.",
      event: "Kalrav Shah and Harshal joshi hammered 32 runs in Skin 1 without a dismissal.",
      matchStateAfter: "Tigers held a 16-run cushion and psychological dominance immediately.",
      whyItMattered: "Forced Dabanggs to chase under severe scoreboard pressure from Over 1.",
    },
    fatalMistake: {
      mistake: "Dabanggs bowling full and wide in the first 4 overs.",
      impact: "Gave Tigers easy boundary access and 8 penalty extras, establishing early momentum.",
    },
    playerImpact: [
      {
        player: "Manthan Shah",
        label: "MATCH WINNER",
        explanation: "Player of the Match with 29 runs, 2 wickets, and peerless tactical captaincy.",
      },
      {
        player: "Kalrav Shah",
        label: "PARTNERSHIP BUILDER",
        explanation: "Set the tone with an aggressive 18 runs in Skin 1 without a single dismissal.",
      },
      {
        player: "Darshan Mody",
        label: "DISCIPLINE PROBLEM",
        explanation: "Dabanggs captain suffered 2 dismissals and conceded 18 runs in his bowling spell.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Dominant ground running with excellent non-striker backing up.",
          "Targeted side net zones (Zones 2 & 3) consistently for bonus runs.",
          "Zero panic following rare dismissals; restored single rotation instantly.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Poor depth judgment on physical runs leading to run-out exposure.",
          "Repeated aerial mis-hits into the front court net.",
          "Failed to adapt chasing strategy to Spawtz skin benchmarks.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Relentless off-stump channel bowling forcing defensive blocks.",
          "Superb back-court containment preventing 4-run shots.",
          "Disciplined fielding with clean pick-ups and accurate returns.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Drifted onto leg stump repeatedly, offering easy deflection boundaries.",
          "Conceded 16 runs in extras across the innings.",
          "Body language dropped visibly after Skin 2.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Manthan Shah demonstrated world-class indoor cricket captaincy. Darshan Mody seemed overwhelmed by the pace of the game and failed to reorganize his bowling rotation.",
      captainTakeaways: [
        "Setting a huge benchmark in Skin 1 crushes the opponent's tactical plan.",
        "Consecutive dismissals in indoor cricket are lethal; safety protocols must be enforced.",
        "Captain must lead from the front with both bat and ball in high-stakes fixtures.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["POWER HITTING", "CLINICAL RUNNING", "CHAMPIONSHIP MENTALITY"],
        evidence: "Scored 113 runs, took 8 wickets, and swept all 16 available points.",
      },
      {
        team: "DesiDabanggs",
        traits: ["FRAGILE BATTING", "LEAKY EXTRAS", "POOR ADAPTABILITY"],
        evidence: "Lost 8 wickets for -40 runs and surrendered all four skins.",
      },
    ],
    finalHardHittingVerdict:
      "DesiTigers played like prospective champions; DesiDabanggs were completely outclassed in every tactical metric.",
  },

  // ==========================================
  // Match 3: VPGR vs DesiDabanggs
  // ==========================================
  "3": {
    matchId: 3,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "VPGR vs DesiDabanggs",
    date: "15 May 2026, 7:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "VPGR",
    loser: "DesiDabanggs",
    scoreSummary: "VPGR 148 def. DesiDabanggs 56 (+92 run margin, 4-0 skins, 8-0 tournament pts)",
    editorHeadline: "VPGR Smashes Tournament Record with 148-Run Onslaught Against Dabanggs",
    editorSummary:
      "In the most lopsided match of the championship, VPGR established a tournament scoring record of 148 runs, sweeping all 8 tournament points (4 skins × 1 pt + 4 match pts). Ankush Goel claimed Player of the Match honors with an astonishing bowling display (3 wickets, economy 1.00) after VPGR's batting pairs posted 40+ runs in two separate skins. DesiDabanggs managed only 56 runs in response.",
    whatWentRightWinner: {
      title: "Tactical Wins for VPGR",
      points: [
        "Scored a record 148 runs across 16 overs (9.25 runs per over).",
        "Ankush Goel took 3 wickets with an economy of 1.00.",
        "Skins 2 and 4 produced 42 and 38 runs through relentless boundary hitting.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiDabanggs",
      points: [
        "Conceded 148 runs, the highest total in tournament history.",
        "Bowlers conceded 28 extras (wides and no-balls).",
        "Suffered 7 dismissals for -35 penalty runs.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Tactical Domination",
      description:
        "Sajid Merchant and Tejas Shah detonated with 42 runs in 4 overs, breaking the back of Dabanggs' bowling attack.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 34, loserRuns: 18, margin: 16, summary: "Abhishek & Ankush set a blistering early pace." },
      { skin: 2, winnerRuns: 42, loserRuns: 10, margin: 32, summary: "Sajid & Tejas produced a 42-run masterclass." },
      { skin: 3, winnerRuns: 34, loserRuns: 16, margin: 18, summary: "Manish & Parth sustained the assault." },
      { skin: 4, winnerRuns: 38, loserRuns: 12, margin: 26, summary: "Himanshu & Dhaval closed out the record total." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "A historic demolition. VPGR played at an intensity level that Dabanggs could not match. Scoring 148 in indoor cricket requires near-perfect ball-striking, zero fear of dismissals, and ruthless execution of extras.",
    },
    whyWinningTeamWon: [
      {
        observation: "Record-Breaking Batting Efficiency",
        evidence: "VPGR scored 148 runs while suffering only 2 dismissals across the entire 16 overs.",
        impact: "Achieved the highest net-to-gross ratio (97%) in tournament history.",
      },
      {
        observation: "Complete Exploitation of Extras",
        evidence: "Forced Dabanggs into 14 illegal deliveries through active crease movement.",
        impact: "Gained 28 free runs and extra balls.",
      },
      {
        observation: "Ankush Goel's Relentless Bowling",
        evidence: "Ankush bowled 2 overs for 2 runs and 3 wickets (net contribution +22).",
        impact: "Completely extinguished Dabanggs' second innings chase before it began.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Total Bowling Disintegration",
        evidence: "Every Dabanggs bowler conceded at least 14 runs per over.",
        impact: "Allowed VPGR to score above 30 runs in all 4 skins.",
      },
      {
        observation: "Mental Surrender Under Pressure",
        evidence: "Fielders dropped 4 simple net rebounds and missed 3 run-out chances.",
        impact: "Handed VPGR at least 30 unearned runs.",
      },
      {
        observation: "Ineffective Batting Structure",
        evidence: "Dabanggs' pairs averaged only 14 runs per skin.",
        impact: "Finished 92 runs short of the target, suffering total tournament points forfeiture.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Abhishek Agarwal & Ankush Goel",
          winnerRuns: 34,
          winnerDismissals: 0,
          loserPair: "Preraq Mistry & Sandesh Jagtap",
          loserRuns: 18,
          loserDismissals: 1,
          skinMargin: 16,
          skinWinner: "VPGR",
          analysis: "Abhishek and Ankush set an unreachable 34-run benchmark with zero dismissals (1 tournament pt).",
        },
        {
          pairNumber: 2,
          winnerPair: "Sajid Merchant & Tejas Shah",
          winnerRuns: 42,
          winnerDismissals: 0,
          loserPair: "Gagandeep Singh & Chittaranjan Dey",
          loserRuns: 10,
          loserDismissals: 3,
          skinMargin: 32,
          skinWinner: "VPGR",
          analysis: "Sajid and Tejas produced the highest single skin total of the tournament: 42 runs without a dismissal.",
        },
        {
          pairNumber: 3,
          winnerPair: "Manish Jain & Parth Shah",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Darshan Mody & Narendra Tiwari",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 18,
          skinWinner: "VPGR",
          analysis: "Manish and Parth maintained the onslaught, posting 34 runs to lock up the third skin.",
        },
        {
          pairNumber: 4,
          winnerPair: "Himanshu Kalyani & Dhaval Bheda",
          winnerRuns: 38,
          winnerDismissals: 1,
          loserPair: "Ravi Kumar & Sandeep Khedekar",
          loserRuns: 12,
          loserDismissals: 2,
          skinMargin: 26,
          skinWinner: "VPGR",
          analysis: "Captain Himanshu and Dhaval capped the victory with 38 runs, completing the 16-0 points sweep.",
        },
      ],
      skinsStory:
        "VPGR swept all four skins with historical margins (+16, +32, +18, +26), securing maximum 8 tournament points and eliminating Dabanggs from final contention.",
    },
    turningPointDetailed: {
      matchStateBefore: "VPGR was already flying at 34-0 after Skin 1.",
      event: "Sajid Merchant and Tejas Shah smashed 42 runs in Skin 2 with 6 net-zone boundaries.",
      matchStateAfter: "VPGR reached 76-0 after 8 overs, an unprecedented tournament milestone.",
      whyItMattered: "Mathematically ended Dabanggs' hopes before halfway.",
    },
    fatalMistake: {
      mistake: "Dabanggs captain attempting to bowl part-timers against Sajid and Tejas.",
      impact: "Conceded 42 runs in 4 overs and destroyed team morale.",
    },
    playerImpact: [
      {
        player: "Ankush Goel",
        label: "MATCH WINNER",
        explanation: "POTM with 3 wickets, 2 runs conceded, and 18 batting runs.",
      },
      {
        player: "Sajid Merchant",
        label: "GAME CHANGER",
        explanation: "Exploded for 26 individual batting runs in Skin 2.",
      },
      {
        player: "Himanshu Kalyani",
        label: "PARTNERSHIP BUILDER",
        explanation: "Finished the innings with 22 runs off 12 balls in Skin 4.",
      },
    ],
    battingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "World-class striking into back corner nets (Zones 4 & 5).",
          "Near-zero dot-ball rate (under 15%).",
          "Complete trust between batting partners on fast drop-and-run singles.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Totally demoralized body language from Over 6 onwards.",
          "Unable to score off good-length deliveries.",
          "Excessive unforced run-outs under pressure.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "VPGR",
        observations: [
          "Hunting wickets on every ball; no defensive bowling.",
          "Fielders positioned aggressively in the front net zone.",
          "Clinical execution of run-out throws at the bowler's end.",
        ],
      },
      {
        team: "DesiDabanggs",
        observations: [
          "Wayward bowling with 28 extras conceded.",
          "Heads dropped after every boundary conceded.",
          "No captaincy communication between overs.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Himanshu Kalyani was ruthless, keeping his frontline bowlers attacking until the final delivery. Darshan Mody appeared shell-shocked and offered no strategic resistance.",
      captainTakeaways: [
        "Never relent when the opposition is reeling; maximize skin points and tournament run difference.",
        "Extras are the fastest way to concede 140+ in indoor cricket.",
        "Captain must intervene when a bowling pair is being systematically dismantled.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "VPGR",
        traits: ["RECORD BREAKERS", "LETHAL STRIKING", "UNRELENTING INTENSITY"],
        evidence: "Set tournament record of 148 runs with 8 tournament points swept.",
      },
      {
        team: "DesiDabanggs",
        traits: ["DEFENSIVELY BROKEN", "BOWLING CRISIS", "ZERO RESILIENCE"],
        evidence: "Conceded 148 runs and 28 extras in a 92-run blowout.",
      },
    ],
    finalHardHittingVerdict:
      "A clinical, professional destruction that will be remembered as the greatest batting exhibition in tournament history.",
  },

  // ==========================================
  // Match 4: DesiTitans vs DesiTigers
  // ==========================================
  "4": {
    matchId: 4,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTitans vs DesiTigers",
    date: "15 May 2026, 8:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "DesiTitans",
    scoreSummary: "DesiTigers 103 def. DesiTitans 69 (+34 run margin, 3-1 skins, 7-1 tournament pts)",
    editorHeadline: "Prateek Nahar's 32-Run Masterclass Seals Final Spot for Tigers",
    editorSummary:
      "DesiTigers guaranteed their spot in the championship final with a composed 34-run victory over DesiTitans, claiming 7 tournament points (3 skins × 1 pt + 4 match pts) to Titans' 1 point. Prateek Nahar earned Player of the Match honors with an unbeaten 32-run masterclass in the final skin. DesiTitans fought admirably in Skins 1 and 3, winning a skin point, but fell away in the middle and death overs.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Prateek Nahar scored 32 runs with zero dismissals (Player of the Match).",
        "Won 3 out of 4 skins through superior boundary conversion.",
        "Bowled tight death overs, conceding only 16 runs in the final skin.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiTitans",
      points: [
        "Skin 2 produced only 8 net runs due to 2 unforced run-outs.",
        "Titans' death-overs bowling conceded 28 runs to Prateek and Rohan.",
        "Could not sustain pressure after winning Skin 1.",
      ],
    },
    turningPoint: {
      phase: "Skin 4 (Overs 13-16)",
      nature: "Tactical Domination",
      description:
        "Tigers pair Prateek Nahar and Rohan Khedekar piled on 28 runs in the final skin, extinguishing Titans' comeback hopes.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 24, loserRuns: 22, margin: 2, summary: "Titans edged a high-pressure opening skin." },
      { skin: 2, winnerRuns: 26, loserRuns: 8, margin: 18, summary: "Tigers took control with disciplined middle batting." },
      { skin: 3, winnerRuns: 25, loserRuns: 23, margin: 2, summary: "Competitive arm-wrestle won narrowly by Tigers." },
      { skin: 4, winnerRuns: 28, loserRuns: 16, margin: 12, summary: "Prateek Nahar masterclass closed the contest." },
    ],

    matchVerdict: {
      verdict: "TURNAROUND",
      explanation:
        "DesiTitans produced their best start of the tournament, pushing Tigers hard in Skin 1. But Tigers demonstrated championship pedigree by seizing Skins 2 and 4 with superior tactical depth and running between wickets.",
    },
    whyWinningTeamWon: [
      {
        observation: "Prateek Nahar's Anchor Masterclass",
        evidence: "Prateek scored 32 individual runs across 4 overs without offering a single dismissal chance.",
        impact: "Provided the match-winning cushion in Skin 4 and secured POTM honors.",
      },
      {
        observation: "Dominant Skin 2 Response",
        evidence: "After a tight opening skin, Manthan Shah and Gaurav Arora produced a +18 run swing in Skin 2.",
        impact: "Restored Tigers' lead and forced Titans to chase high-risk boundary options.",
      },
      {
        observation: "Death Overs Bowling Execution",
        evidence: "Restricted Titans' final pair to 16 runs when 50 were needed.",
        impact: "Closed out the match without giving up bonus fielding opportunities.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Skin 2 Collapse Under Pressure",
        evidence: "Titans' second pair scored only 8 runs, suffering 2 run-outs.",
        impact: "Conceded an 18-run margin that negated their competitive opening skin.",
      },
      {
        observation: "Leaking Death-Over Boundaries",
        evidence: "Titans conceded 16 runs off Over 16 to Prateek Nahar and Rohan Khedekar.",
        impact: "Blew the target beyond reach and forfeited the final skin's 3 tournament points.",
      },
      {
        observation: "Inability to Convert Tight Skins",
        evidence: "Lost Skin 3 by just 2 runs (23-25) after leading at the 2-over mark.",
        impact: "Missed an opportunity to capture 3 vital skin points.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Milan Chheda & Deepak Thawani",
          winnerRuns: 24,
          winnerDismissals: 1,
          loserPair: "Kalrav Shah & Harshal joshi",
          loserRuns: 22,
          loserDismissals: 1,
          skinMargin: 2,
          skinWinner: "DesiTitans",
          analysis: "Titans' best partnership of the tournament; Milan and Deepak edged the skin by 2 runs to take 3 tournament points.",
        },
        {
          pairNumber: 2,
          winnerPair: "Manthan Shah & Gaurav Arora",
          winnerRuns: 26,
          winnerDismissals: 0,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: 8,
          loserDismissals: 2,
          skinMargin: 18,
          skinWinner: "DesiTigers",
          analysis: "The turning point. Manthan and Gaurav batted flawlessly while Titans conceded two costly run-outs.",
        },
        {
          pairNumber: 3,
          winnerPair: "Hemang Shah & Taha Shipchandler",
          winnerRuns: 25,
          winnerDismissals: 1,
          loserPair: "Yash Sisodia & Mayank Agarwal",
          loserRuns: 23,
          loserDismissals: 2,
          skinMargin: 2,
          skinWinner: "DesiTigers",
          analysis: "A gripping contest. Hemang and Taha scored 8 off the final over to claim the skin by 2 runs.",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Nahar & Rohan Khedekar",
          winnerRuns: 28,
          winnerDismissals: 0,
          loserPair: "Prateek Jain & Ronak Jain",
          loserRuns: 16,
          loserDismissals: 2,
          skinMargin: 12,
          skinWinner: "DesiTigers",
          analysis: "Prateek Nahar's POTM performance sealed the victory with 28 runs in the final skin (1 tournament pt).",
        },
      ],
      skinsStory:
        "Tigers won 3 out of 4 skins, banking 7 tournament points (3 skins × 1 pt + 4 match pts) while Titans banked a well-deserved 3 points from their Skin 1 triumph.",
    },
    turningPointDetailed: {
      matchStateBefore: "Titans led by 2 runs after winning Skin 1 (24-22).",
      event: "Manthan Shah and Gaurav Arora scored 26-0 in Skin 2 while Titans' pair was restricted to 8-2.",
      matchStateAfter: "Tigers took a 16-run aggregate lead and never relinquished it.",
      whyItMattered: "Broke Titans' early momentum and restored Tigers' control.",
    },
    fatalMistake: {
      mistake: "Titans' miscommunication between Hardik and Harsh in Over 7 resulting in a run-out.",
      impact: "Turned a potential 18-run skin into an 8-run disaster.",
    },
    playerImpact: [
      {
        player: "Prateek Nahar",
        label: "MATCH WINNER",
        explanation: "Player of the Match with 32 individual runs, anchor calling, and zero dismissals.",
      },
      {
        player: "Manthan Shah",
        label: "PRESSURE BUILDER",
        explanation: "Captain steadied the ship in Skin 2 with 16 runs and disciplined bowling.",
      },
      {
        player: "Milan Chheda",
        label: "SKIN WINNER",
        explanation: "Anchored Titans' Skin 1 victory with 14 runs and positive calling.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Mastery of the death overs with aggressive ground-stroke placement.",
          "Non-striker vocal calling minimized run-out risk throughout.",
          "Targeted side nets consistently for 2-run bonuses.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Significantly improved opening partnership compared to previous games.",
          "Still prone to middle-overs lapses with hesitations on second runs.",
          "Struggled to rotate strike against Tigers' slower bowling variations.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Smart variations in pace and trajectory off the side nets.",
          "Bowled to defensive field placements with high discipline.",
          "Direct-hit run-outs created the Skin 2 differential.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Excellent opening spell in Skin 1 backed by spirited fielding.",
          "Line deteriorated in Skin 4 under pressure from Prateek Nahar.",
          "Conceded 14 extras across the match.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Manthan Shah maintained composure after losing Skin 1, sticking to his planned batting order. Hardik Desai showed improved leadership, securing Titans' first skin point of the tournament.",
      captainTakeaways: [
        "Losing Skin 1 is not fatal; championship teams respond with middle-skin dominance.",
        "Death overs require specialist indoor bowlers who can deny side-net deflections.",
        "Celebrate skin wins to maintain tournament morale and bank tournament points.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["TACTICAL MATURITY", "FINISHING SPECIALISTS", "CHAMPIONSHIP COMPOSED"],
        evidence: "Won 3-1 in skins after trailing early; booked spot in the final.",
      },
      {
        team: "DesiTitans",
        traits: ["FIGHTING SPIRIT", "IMPROVING DISCIPLINE", "MIDDLE OVER WEAKNESS"],
        evidence: "Won their first skin point of the tournament and fought hard across 16 overs.",
      },
    ],
    finalHardHittingVerdict:
      "Tigers showed the calm composure of true finalists; Titans proved they can compete with the best when they maintain discipline.",
  },

  // ==========================================
  // Match 5: DesiTitans vs DesiDabanggs (3rd Place Playoff)
  // ==========================================
  "5": {
    matchId: 5,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTitans vs DesiDabanggs",
    date: "17 May 2026, 7:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiDabanggs",
    loser: "DesiTitans",
    scoreSummary: "DesiDabanggs 76 def. DesiTitans 58 (+18 run margin, 3-1 skins, 7-1 tournament pts)",
    editorHeadline: "Preraq Mistry's Resurgence Inspires Dabanggs to 3rd-Place Playoff Triumph",
    editorSummary:
      "DesiDabanggs redeemed a frustrating tournament campaign by capturing 3rd place with an 18-run victory over DesiTitans, claiming 7 tournament points (3 skins × 1 pt + 4 match pts) to Titans' 1 point. Player of the Match Preraq Mistry produced his finest innings of the competition, blasting 28 runs in Skin 1. DesiTitans fought gamely, winning Skin 4, but could not overcome a 15-run deficit from the first two skins.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiDabanggs",
      points: [
        "Preraq Mistry scored 28 runs in Skin 1 to win Player of the Match.",
        "Cut dismissal count from 8 in previous matches down to just 3.",
        "Won Skins 1, 2, and 3 through disciplined ground-running.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for DesiTitans",
      points: [
        "Conceded 28 runs in Skin 1, allowing Dabanggs an early psychological advantage.",
        "Skin 2 yielded only 12 runs against tight bowling from Gagandeep Singh.",
        "Could not convert a strong Skin 4 into an overall victory.",
      ],
    },
    turningPoint: {
      phase: "Skin 1 (Overs 1-4)",
      nature: "Turnaround",
      description:
        "After two matches of opening collapses, Preraq Mistry and Sandesh Jagtap blasted 28 runs in Skin 1 to set the standard.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 28, loserRuns: 20, margin: 8, summary: "Preraq Mistry's POTM start ignited Dabanggs." },
      { skin: 2, winnerRuns: 25, loserRuns: 18, margin: 7, summary: "Gagandeep Singh stabilized middle overs." },
      { skin: 3, winnerRuns: 22, loserRuns: 17, margin: 5, summary: "Darshan Mody controlled the third skin." },
      { skin: 4, winnerRuns: 23, loserRuns: 15, margin: 8, summary: "Titans fought back to claim the final skin." },
    ],

    matchVerdict: {
      verdict: "TURNAROUND",
      explanation:
        "DesiDabanggs executed a remarkable turnaround after scoring only 53 and 56 runs in the group stages. They fundamentally restructured their running between wickets, avoided early dismissals, and held their nerve to win 3 skins.",
    },
    whyWinningTeamWon: [
      {
        observation: "Preraq Mistry's Opening Masterclass",
        evidence: "Preraq Mistry and Sandesh Jagtap scored 28 runs in Skin 1 with zero dismissals.",
        impact: "Gave Dabanggs their first opening skin win and immediate tournament points (3 pts).",
      },
      {
        observation: "Radical Reduction in Dismissal Penalties",
        evidence: "Dabanggs suffered only 3 dismissals (-15 runs) compared to 8 in each previous match.",
        impact: "Protected their gross total and prevented Titans from building momentum.",
      },
      {
        observation: "Middle Overs Consolidation",
        evidence: "Gagandeep Singh and Chittaranjan Dey produced 25 runs in Skin 2 against Titans' strike bowling.",
        impact: "Extended Dabanggs' lead to 15 runs entering the second half.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Slow Start in Skin 1",
        evidence: "Titans conceded 28 runs while scoring only 20 in the opening skin.",
        impact: "Forced Titans to chase from an 8-run deficit against a confident opponent.",
      },
      {
        observation: "Inability to Stop Preraq Mistry",
        evidence: "Titans' opening bowlers conceded 4 boundaries in the first 2 overs.",
        impact: "Allowed Dabanggs to bat with zero pressure from the outset.",
      },
      {
        observation: "Lack of Lower-Order Support in Chase",
        evidence: "Titans needed 32 runs in Skin 4 to win the match; managed 23 runs.",
        impact: "Fell 18 runs short of the overall target, though they did claim 3 skin points.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Preraq Mistry & Sandesh Jagtap",
          winnerRuns: 28,
          winnerDismissals: 0,
          loserPair: "Milan Chheda & Deepak Thawani",
          loserRuns: 20,
          loserDismissals: 1,
          skinMargin: 8,
          skinWinner: "DesiDabanggs",
          analysis: "Preraq Mistry played his best innings of the tournament, scoring 18 runs to anchor a 28-run skin (1 tournament pt).",
        },
        {
          pairNumber: 2,
          winnerPair: "Gagandeep Singh & Chittaranjan Dey",
          winnerRuns: 25,
          winnerDismissals: 1,
          loserPair: "Hardik Desai & Harsh Ramnani",
          loserRuns: 18,
          loserDismissals: 2,
          skinMargin: 7,
          skinWinner: "DesiDabanggs",
          analysis: "Gagandeep's composed running between wickets guided Dabanggs to a 7-run skin victory (1 tournament pt).",
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
          analysis: "Captain Darshan Mody controlled the pace, grinding out a 5-run skin victory (1 tournament pt).",
        },
        {
          pairNumber: 4,
          winnerPair: "Prateek Jain & Ronak Jain",
          winnerRuns: 23,
          winnerDismissals: 1,
          loserPair: "Ravi Kumar & Sandeep Khedekar",
          loserRuns: 15,
          loserDismissals: 2,
          skinMargin: 8,
          skinWinner: "DesiTitans",
          analysis: "Titans' death pair fought hard to salvage 3 tournament points by taking the final skin 23-15.",
        },
      ],
      skinsStory:
        "Dabanggs secured 3rd place by winning the first 3 skins cleanly, accumulating 7 tournament points (3 skins × 1 pt + 4 match pts). Titans earned 3 points from their final skin win.",
    },
    turningPointDetailed: {
      matchStateBefore: "Dabanggs entered the match on the back of two heavy defeats.",
      event: "Preraq Mistry hit three boundaries in the first two overs of Skin 1, scoring 28 runs.",
      matchStateAfter: "Dabanggs established an 8-run lead and visible confidence on the court.",
      whyItMattered: "Banished the ghosts of previous collapses and established match control.",
    },
    fatalMistake: {
      mistake: "Titans bowling short and wide to Preraq in Over 1.",
      impact: "Conceded 12 runs in 4 balls, handing Dabanggs instant momentum.",
    },
    playerImpact: [
      {
        player: "Preraq Mistry",
        label: "MATCH WINNER",
        explanation: "Player of the Match with 28 runs in Skin 1 and zero dismissals.",
      },
      {
        player: "Gagandeep Singh",
        label: "PARTNERSHIP BUILDER",
        explanation: "Stabilized Skin 2 with 15 runs and 2 tight bowling overs.",
      },
      {
        player: "Hardik Desai",
        label: "SILENT CONTRIBUTOR",
        explanation: "Titans captain battled hard with 14 runs and an economical bowling spell.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiDabanggs",
        observations: [
          "Dramatically improved running between wickets with loud calling.",
          "Protected their wickets first; waited for loose balls before boundary hitting.",
          "Effective use of the side net drop for 1-run and 2-run physical crosses.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Competitive throughout all 4 skins without folding.",
          "Improved strike rotation compared to earlier group games.",
          "Could not match Dabanggs' boundary output in the opening overs.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiDabanggs",
        observations: [
          "Targeted good length with consistent line on off stump.",
          "Cut extras from 28 in previous match to just 8 in this game.",
          "Energetic fielding with high communication levels.",
        ],
      },
      {
        team: "DesiTitans",
        observations: [
          "Bowled competitively in Skins 2, 3, and 4.",
          "Initial over leaked boundaries to Preraq, which proved decisive.",
          "Maintained fight until the final ball of the tournament.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Darshan Mody deserved immense credit for restructuring Dabanggs' order after two heavy defeats. Hardik Desai managed his team with dignity, finishing the tournament with positive improvements.",
      captainTakeaways: [
        "A team can reinvent itself mid-tournament with honest self-reflection.",
        "Reducing dismissal penalties is the fastest path to indoor cricket victory.",
        "Tournament standings value skin points; fighting until the final skin matters.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiDabanggs",
        traits: ["RESILIENT", "REDEMPTIVE SPIRIT", "IMPROVED DISCIPLINE"],
        evidence: "Turned around 53-run collapses to score 76 and capture 3rd place.",
      },
      {
        team: "DesiTitans",
        traits: ["DETERMINED", "PROGRESSIVE IMPROVEMENT", "NEVER GAVE UP"],
        evidence: "Won their final skin and pushed Dabanggs across all 16 overs.",
      },
    ],
    finalHardHittingVerdict:
      "Dabanggs showed what pride and tactical adjustment can achieve; a deserved 3rd-place finish after a difficult tournament.",
  },

  // ==========================================
  // Match 6: DesiTigers vs VPGR (Championship Final)
  // ==========================================
  "6": {
    matchId: 6,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTigers vs VPGR",
    date: "17 May 2026, 8:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "VPGR",
    scoreSummary: "DesiTigers 111 def. VPGR 94 (+17 run margin, 2-2 skins, 6-2 tournament pts)",
    editorHeadline: "DesiTigers Crowned Champions in 111-94 Epic Final Against VPGR",
    editorSummary:
      "DesiTigers clinched the Desi Boys Championship with a masterclass 17-run triumph over VPGR in an unforgettable final. In a tactical arm-wrestle that split the skins 2-2, Tigers earned 6 tournament points (2 skins × 1 pt + 4 match pts) while VPGR banked 6 points from their 2 skin victories. Player of the Match Manthan Shah outmaneuvered VPGR with bold pair assignments and clutch bowling in death overs.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Kalrav Shah & Harshal joshi delivered +28 runs in Skin 1 to set an early benchmark.",
        "Manthan Shah & Gaurav Arora dismantled VPGR's middle order with +31 runs in Skin 2.",
        "Maintained nerve in death overs despite furious VPGR counter-attack.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for VPGR",
      points: [
        "Skin 2 batting collapsed to 18 runs under pressure from Manthan Shah.",
        "Suffered 4 dismissals in middle skins, conceding 20 penalty runs.",
        "Could not bridge the 13-run deficit despite winning Skin 4.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Tactical Domination",
      description:
        "Tigers' Manthan Shah and Gaurav Arora piled on 31 runs while restricting VPGR's pair to 18 runs. The 13-run skin margin proved decisive.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 28, loserRuns: 24, margin: 4, summary: "Kalrav & Harshal set high standard in tense opener." },
      { skin: 2, winnerRuns: 31, loserRuns: 18, margin: 13, summary: "Manthan & Gaurav blew the game open." },
      { skin: 3, winnerRuns: 26, loserRuns: 24, margin: 2, summary: "VPGR counter-attacked through Sajid & Tejas." },
      { skin: 4, winnerRuns: 28, loserRuns: 26, margin: 2, summary: "Himanshu fought hard to win the final skin for VPGR." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "DesiTigers won the championship through superior tactical design. By batting first and posting 111 runs, they forced VPGR to chase against their premier bowling attack under immense pressure.",
    },
    whyWinningTeamWon: [
      {
        observation: "Aggressive First-Innings Skin Building",
        evidence: "Tigers' opening pairs posted 28 and 31 runs in the first two skins without reckless dismissals.",
        impact: "Created an insurmountable 59-run foundation that absorbed VPGR's late resurgence.",
      },
      {
        observation: "Suffocating Middle-Overs Bowling",
        evidence: "Restricted VPGR's core pair to 18 runs in Skin 2, forcing two costly run-outs.",
        impact: "Secured the vital +13 run differential that decided the championship.",
      },
      {
        observation: "Championship Composure Under Siege",
        evidence: "Tigers conceded only 2 extras across the final 4 overs under intense pressure.",
        impact: "Protected the 17-run overall lead to capture the championship trophy.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Costly Second-Skin Stumble",
        evidence: "VPGR's second pair managed only 18 runs against Manthan's bowling.",
        impact: "Surrendered a 13-run skin margin that proved impossible to recover.",
      },
      {
        observation: "Excessive Dismissals in Chase",
        evidence: "VPGR lost 4 wickets (-20 penalty runs) in the first 12 overs.",
        impact: "Erased multiple boundary sequences that would have tied the aggregate score.",
      },
      {
        observation: "Conceding the First-Innings Psychological Edge",
        evidence: "Allowed Tigers to score 111 runs off disciplined bowling.",
        impact: "Fell behind the required run rate from the opening over of the chase.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Kalrav Shah & Harshal joshi",
          winnerRuns: 28,
          winnerDismissals: 1,
          loserPair: "Abhishek Agarwal & Ankush Goel",
          loserRuns: 24,
          loserDismissals: 1,
          skinMargin: 4,
          skinWinner: "DesiTigers",
          analysis: "A high-intensity opening skin; Kalrav and Harshal edged Ankush Goel by 4 runs to take 3 tournament points.",
        },
        {
          pairNumber: 2,
          winnerPair: "Manthan Shah & Gaurav Arora",
          winnerRuns: 31,
          winnerDismissals: 0,
          loserPair: "Manish Jain & Parth Shah",
          loserRuns: 18,
          loserDismissals: 2,
          skinMargin: 13,
          skinWinner: "DesiTigers",
          analysis: "The championship-defining partnership. Manthan and Gaurav batted with complete mastery for a 13-run win.",
        },
        {
          pairNumber: 3,
          winnerPair: "Sajid Merchant & Tejas Shah",
          winnerRuns: 26,
          winnerDismissals: 1,
          loserPair: "Hemang Shah & Taha Shipchandler",
          loserRuns: 24,
          loserDismissals: 1,
          skinMargin: 2,
          skinWinner: "VPGR",
          analysis: "VPGR fought back through Sajid and Tejas, winning a nail-biting skin by 2 runs to claim 3 tournament points.",
        },
        {
          pairNumber: 4,
          winnerPair: "Himanshu Kalyani & Dhaval Bheda",
          winnerRuns: 28,
          winnerDismissals: 1,
          loserPair: "Prateek Nahar & Rohan Khedekar",
          loserRuns: 26,
          loserDismissals: 0,
          skinMargin: 2,
          skinWinner: "VPGR",
          analysis: "Himanshu produced a captain's knock to take the final skin for VPGR, though Tigers retained the aggregate title.",
        },
      ],
      skinsStory:
        "The skins were fiercely split 2-2, with Tigers banking 6 tournament points (2 skins × 1 pt + 4 match pts) and VPGR taking 6 points. Tigers' 13-run blitz in Skin 2 proved the difference in the championship race.",
    },
    turningPointDetailed: {
      matchStateBefore: "Tigers held a narrow 28-24 lead after an intense Skin 1.",
      event: "Manthan Shah and Gaurav Arora scored 31 runs in Skin 2 while VPGR was restricted to 18.",
      matchStateAfter: "Tigers expanded their lead to 59-42, opening a decisive 17-run championship cushion.",
      whyItMattered: "Gave Tigers the margin they needed to survive VPGR's second-half counter-attack.",
    },
    fatalMistake: {
      mistake: "VPGR conceding consecutive run-outs in Skin 2 against Manthan's bowling line.",
      impact: "Cost 10 net runs and gave Tigers the championship-winning cushion.",
    },
    playerImpact: [
      {
        player: "Manthan Shah",
        label: "MATCH WINNER",
        explanation: "Player of the Match with 24 runs, 2 wickets in the crucial Skin 2, and championship captaincy.",
      },
      {
        player: "Kalrav Shah",
        label: "PARTNERSHIP BUILDER",
        explanation: "Set the championship standard with 16 runs in the opening skin against Ankush Goel.",
      },
      {
        player: "Himanshu Kalyani",
        label: "SILENT CONTRIBUTOR",
        explanation: "VPGR captain fought valiantly to the end, winning Skin 4 with 18 runs.",
      },
    ],
    battingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Championship-level execution of ground singles and loud calling.",
          "Targeted side nets with high precision under extreme pressure.",
          "Maintained composure when VPGR launched their second-half fightback.",
        ],
      },
      {
        team: "VPGR",
        observations: [
          "Superb late fightback in Skins 3 and 4, winning both skins.",
          "Skin 2 hesitation under pressure proved their ultimate undoing.",
          "High boundary frequency but undone by 4 costly dismissals.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "DesiTigers",
        observations: [
          "Tactical perfection in bowling changes, matching bowlers to batter strengths.",
          "Exceptional boundary-riding fielding that cut off three certain 4-run shots.",
          "Disciplined lines conceding only 4 extras in a high-stakes final.",
        ],
      },
      {
        team: "VPGR",
        observations: [
          "High intensity throughout, hunting wickets until the final delivery.",
          "Lacked penetration in Skin 2 against Manthan and Gaurav.",
          "Ankush Goel bowled with customary fire but lacked middle-overs support.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Tigers captain Manthan Shah outmaneuvered VPGR with his opening skin deployment and middle-overs suffocation. Himanshu Kalyani showed great heart in leading VPGR's late fightback.",
      captainTakeaways: [
        "Indoor cricket finals are won in the middle skins; dominating Skin 2 delivers championships.",
        "Batting first and posting 110+ creates unbearable pressure in a final.",
        "Both teams demonstrated the absolute pinnacle of indoor cricket skill and spirit.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "DesiTigers",
        traits: ["CHAMPIONS", "TACTICAL MASTERMINDS", "HIGH-PRESSURE EXECUTORS"],
        evidence: "Won the championship final 111-94 with an undefeated tournament record.",
      },
      {
        team: "VPGR",
        traits: ["VALIANT RUNNERS-UP", "FEROCIOUS FIGHTBACK", "MIDDLE OVER FLAW"],
        evidence: "Fought back to win 2 skins and score 94 in a high-quality championship final.",
      },
    ],
    finalHardHittingVerdict:
      "A final worthy of the championship; DesiTigers are the undisputed champions of indoor cricket.",
  },

  // ==========================================
  // Match 7: Practice Match (09 Sep 2026)
  // Home Team vs Away Team
  // ==========================================
  "7": {
    matchId: 7,
    tournamentName: "Desisports Practice Series",
    matchTitle: "Home Team vs Away Team",
    date: "09 September 2026, 8:17 PM",
    venue: "Insportz Club, Dubai (Court 2)",
    winner: "Away Team",
    loser: "Home Team",
    scoreSummary: "Away Team 120 def. Home Team 63 (+57 run margin, 4-0 skins, 8-0 tournament pts)",
    editorHeadline:
      "Away Team's 4-0 Skin Blitz and Dismissal Pressure Smothers Home Team in 57-Run Rout",
    editorSummary:
      "Away Team produced a masterclass in modern Spawtz indoor cricket, sweeping all four skins to defeat Home Team 120 to 63 (16-0 tournament points). Driven by Player of the Match Yash (18 RS, -1 RC, 3 wickets, +19 contribution), Away Team systematically converted side-net opportunities while restricting Home Team to negative territory during a disastrous Skin 2 collapse. Home Team suffered 6 dismissals (-30 penalty runs) and failed to mount sustained pressure across 16 overs.",
    whatWentRightWinner: {
      title: "Tactical Wins for Away Team",
      points: [
        "Swept all four skins (+7, +36, +5, +9) with exceptional ground-running discipline.",
        "Yash delivered an MVP performance: 18 runs scored, -1 runs conceded, 3 dismissals, +19 net contribution.",
        "Conceded only 63 total runs across 16 overs through suffocating back-of-length bowling.",
      ],
    },
    whatWentWrongLoser: {
      title: "Critical Breakdowns for Home Team",
      points: [
        "Suffered 6 dismissals (-30 penalty runs), completely negating multiple boundary sequences.",
        "Catastrophic Skin 2 collapse: scored -3 runs while conceding 33, creating an unbridgeable 36-run gap.",
        "Failed to adapt batting approach; persisted with high-risk drop-and-run singles against sharp front-court fielders.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      nature: "Critical Errors",
      description:
        "Home Team's second batting pair (Akshay & Jigar) collapsed under intense pressure from Yash and Sahil, losing 3 wickets and finishing with -3 net runs. Away Team answered with 33 runs, opening a 43-run chasm.",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 34, loserRuns: 27, margin: 7, summary: "Deepak & Yash edged Shubham & Arif in a competitive opening." },
      { skin: 2, winnerRuns: 33, loserRuns: -3, margin: 36, summary: "Decisive blowout: Yash dismantled Akshay & Jigar into negative territory." },
      { skin: 3, winnerRuns: 34, loserRuns: 29, margin: 5, summary: "High-scoring battle; Sahil & Sunny held off Himanshu & Manthan." },
      { skin: 4, winnerRuns: 19, loserRuns: 10, margin: 9, summary: "Shaurya & Prateek closed out the sweep against Ankush & Tejas." },
    ],

    matchVerdict: {
      verdict: "TACTICAL DOMINATION",
      explanation:
        "Away Team dominated every phase of the match. In Innings 1, Home Team batted first and were suffocated to 63 runs, primarily due to a disastrous -3 second skin. In Innings 2, Away Team chased with ruthless control, reaching 120 runs with zero panic and sweeping all 16 available tournament points.",
    },
    whyWinningTeamWon: [
      {
        observation: "Devastating Skin 2 Suffocation",
        evidence: "Away Team held Akshay & Jigar to -3 net runs while scoring 33 runs in the reply skin (+36 margin).",
        impact: "Effectively sealed the match and skin points before the halfway mark.",
      },
      {
        observation: "Front-Court Bowling Discipline",
        evidence: "Yash conceded -1 runs in 2 overs; Deepak conceded only 6 runs; Away Team forced 6 dismissals.",
        impact: "Imposed 30 penalty runs on Home Team and denied them any free scoring options.",
      },
      {
        observation: "High-Yield Ground Rotation",
        evidence: "Away Team pairs converted 34, 33, 34, and 19 runs across the four skins.",
        impact: "Maintained an average scoring rate of 7.50 runs per over throughout the innings.",
      },
    ],
    whyLosingTeamLost: [
      {
        observation: "Fatal Second-Skin Implosion",
        evidence: "Home Team lost 3 wickets in 8 balls during Skin 2, plunging their skin total to -3.",
        impact: "Wiped out the solid 27-run foundation built by Shubham & Arif in Skin 1.",
      },
      {
        observation: "Repeated Run-Out Penalties",
        evidence: "Home Team conceded 4 run-outs through hesitant calling and misjudged physical singles.",
        impact: "Lost 20 net runs directly to unforced running errors.",
      },
      {
        observation: "Inability to Stem Away Team's Middle-Overs Momentum",
        evidence: "Home Team conceded consecutive dot balls following each dismissal, compounding pressure.",
        impact: "Failed to reset momentum during high-leverage overs.",
      },
    ],
    skinsAnalysisDetailed: {
      pairs: [
        {
          pairNumber: 1,
          winnerPair: "Deepak Sharma & Yash",
          winnerRuns: 34,
          winnerDismissals: 0,
          loserPair: "Shubham & Arif",
          loserRuns: 27,
          loserDismissals: 1,
          skinMargin: 7,
          skinWinner: "Away Team",
          analysis: "Deepak (16) and Yash (18) established immediate command with 34 runs and zero dismissals (1 tournament pt).",
        },
        {
          pairNumber: 2,
          winnerPair: "Narendra Tiwari & Manish Pandey",
          winnerRuns: 33,
          winnerDismissals: 1,
          loserPair: "Akshay & Jigar",
          loserRuns: -3,
          loserDismissals: 3,
          skinMargin: 36,
          skinWinner: "Away Team",
          analysis: "The defining partnership. Yash and Sahil destroyed Akshay and Jigar for -3 runs, followed by 33 runs in the chase (+36 margin).",
        },
        {
          pairNumber: 3,
          winnerPair: "Sahil & Sunny Patel",
          winnerRuns: 34,
          winnerDismissals: 1,
          loserPair: "Himanshu Kalyani & Manthan Shah",
          loserRuns: 29,
          loserDismissals: 1,
          skinMargin: 5,
          skinWinner: "Away Team",
          analysis: "Home Team fought back with 29 runs, but Sahil and Sunny matched and surpassed them with 34 (1 tournament pt).",
        },
        {
          pairNumber: 4,
          winnerPair: "Shaurya & Prateek Nahar",
          winnerRuns: 19,
          winnerDismissals: 1,
          loserPair: "Ankush Goel & Tejas",
          loserRuns: 10,
          loserDismissals: 2,
          skinMargin: 9,
          skinWinner: "Away Team",
          analysis: "Away Team closed out the 4-0 skin sweep by holding Ankush and Tejas to 10 runs (1 tournament pt).",
        },
      ],
      skinsStory:
        "Away Team swept all four skins cleanly, claiming maximum 8 tournament points (4 skins × 1 pt + 4 match pts). The 36-run blowout in Skin 2 broke Home Team's back, while consistent 34-run returns in Skins 1 and 3 sealed a 57-run victory.",
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
        explanation: "Player of the Match: RS=18, RC=-1, OB=2, Wkts=3, Economy=-0.50, Net Contribution=+19.",
      },
      {
        player: "Deepak Sharma",
        label: "PRESSURE BUILDER",
        explanation: "Conceded only 6 runs in 2 overs (Econ 3.00) and contributed 16 batting runs.",
      },
      {
        player: "Manish Pandey",
        label: "PARTNERSHIP BUILDER",
        explanation: "Scored 17 runs in Skin 2 with Narendra Tiwari, capitalising on Home Team's bowling breakdown.",
      },
      {
        player: "Akshay",
        label: "DISCIPLINE PROBLEM",
        explanation: "Suffered 2 dismissals in Skin 2, finishing with -5 net batting runs.",
      },
      {
        player: "Himanshu Kalyani",
        label: "SILENT CONTRIBUTOR",
        explanation: "Top-scored for Home Team with 17 runs in Skin 3, briefly reviving the chase.",
      },
    ],
    battingBehaviour: [
      {
        team: "Away Team",
        observations: [
          "Loud, decisive calling with instant non-striker response.",
          "High percentage of ground shots targeted into the side nets for 2-run bonuses.",
          "Zero panic following a wicket; immediately reset to ground singles.",
        ],
      },
      {
        team: "Home Team",
        observations: [
          "Hesitant calling between wickets leading to 4 unforced run-outs.",
          "Over-relied on back-wall boundaries instead of rotating strike into side nets.",
          "Compound errors: a wicket was frequently followed by another dismissal within 3 balls.",
        ],
      },
    ],
    bowlingBehaviour: [
      {
        team: "Away Team",
        observations: [
          "Relentless attack on the stumps with tight leg-side containment.",
          "Disciplined extras: only 3 wides conceded across 16 overs.",
          "Aggressive front-court fielding that generated 4 direct-hit run-out chances.",
        ],
      },
      {
        team: "Home Team",
        observations: [
          "Inconsistent length allowed Away Team batters easy pull and flick shots.",
          "Conceded 8 extras in middle overs, releasing pressure after building dot balls.",
          "Disjointed fielding communication with multiple missed backing-up opportunities.",
        ],
      },
    ],
    captainAnalysis: {
      evaluation:
        "Away Team's captain executed a textbook bowling rotation, deploying strike bowler Yash in Over 5 immediately after the skin break. Home Team's captain delayed his frontline bowlers, allowing Away Team to establish momentum without challenge.",
      captainTakeaways: [
        "Never bowl consecutive overs with the same bowler; rotate strike bowlers at the start of each skin.",
        "Enforce a 'zero-risk single' rule following any -5 penalty dismissal.",
        "Target side-net drop zones on deliveries 1-3 to build early skin momentum.",
        "Audit Spawtz tournament points carefully; salvage skin points (1 pt each) when the match total is out of reach.",
      ],
    },
    teamDnaAssessment: [
      {
        team: "Away Team",
        traits: ["CLINICAL RUNNING", "BOWLING DISCIPLINE", "PRESSURE ABSORPTION"],
        evidence: "Swept all four skins, took 6 wickets, and maintained an average contribution of +7.5 per player.",
      },
      {
        team: "Home Team",
        traits: ["FRAGILE MIDDLE ORDER", "COMMUNICATION BREAKDOWN", "HIGH RUN-OUT RISK"],
        evidence: "Conceded -3 in Skin 2, suffered 4 run-outs, and conceded a 57-run defeat.",
      },
    ],
    finalHardHittingVerdict:
      "Away Team demonstrated complete mastery of indoor cricket fundamentals; Home Team's inability to prevent consecutive dismissals cost them 8 tournament points.",
  },
};
