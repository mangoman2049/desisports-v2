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
    nature: "Tactical Domination" | "Critical Errors" | "Bowling Mastery" | "Pressure Collapse";
  };
  skinsBreakdown: {
    skin: number;
    winnerRuns: number;
    loserRuns: number;
    margin: number;
    summary: string;
  }[];
}

export const MATCH_ANALYSES: Record<string, MatchTacticalAnalysis> = {
  // Match 1: VPGR vs DesiTitans
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
        "Ankush Goel delivered negative economy (-2.00) across his 2-over quota, forcing errors without offering boundary width.",
        "Sajid Merchant and Himanshu Kalyani secured a decisive +24 run foundation in Skin 1.",
        "Aggressive running between wickets placed Titans under continuous pressure on Court 1.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for DesiTitans",
      points: [
        "Skin 2 collapse (-8 net runs) caused by three avoidable run-outs from misjudged quick singles.",
        "Bowlers conceded 16 extras (wides and no-balls), handing VPGR repeated free releases.",
        "Failure to rotate strike against spin; batters faced 14 dot balls in the middle 8 overs.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      description:
        "Ankush Goel took two wickets in three deliveries in Over 6. DesiTitans lost 15 runs in penalties (-5 per wicket) and never recovered their scoring momentum.",
      nature: "Bowling Mastery",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 26, loserRuns: 14, margin: 12, summary: "VPGR controlled tempo" },
      { skin: 2, winnerRuns: 18, loserRuns: -4, margin: 22, summary: "Ankush spell broke Titans" },
      { skin: 3, winnerRuns: 22, loserRuns: 16, margin: 6, summary: "Evenly contested middle skin" },
      { skin: 4, winnerRuns: 14, loserRuns: 15, margin: -1, summary: "Consolation skin for Titans" },
    ],
  },

  // Match 2: DesiTigers vs DesiDabanggs
  "2": {
    matchId: 2,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTigers vs DesiDabanggs",
    date: "13 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "DesiDabanggs",
    scoreSummary: "DesiTigers 113 def. DesiDabanggs 53 (+60 run margin, 4-0 skins sweep)",
    editorHeadline: "Tigers Unleash Clean Sweep with 113-Run Clinic Against Dabanggs",
    editorSummary:
      "DesiTigers announced their title credentials with a ruthless 4-0 skin sweep over DesiDabanggs. Captain Manthan Shah rotated five bowlers with surgical precision, while Harshal Joshi and Prateek Nahar provided high-tempo boundary striking from the opening skin.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Every single skin scored over 24 net runs, maintaining steady scoreboard pressure throughout the 16 overs.",
        "Manthan Shah bowled with an economy of -1.00 while claiming 3 crucial top-order dismissals.",
        "Zero minus-score skins; flawless communication prevented costly indoor run-out penalties.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for DesiDabanggs",
      points: [
        "Skin 1 surrendered immediately (+8 vs +32) due to early caught-behind dismissals off rising deliveries.",
        "Darshan Mody lacked bowling support in the death overs as backup seamers conceded 28 runs in Overs 13-14.",
        "Over-reliance on boundary shots resulted in 4 caught dismissals off the top net.",
      ],
    },
    turningPoint: {
      phase: "Skin 1 (Overs 1-4)",
      description:
        "Tigers posted 32 runs in the opening skin without losing a wicket. Dabanggs were forced into high-risk strokes from Over 5 onward.",
      nature: "Tactical Domination",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 32, loserRuns: 8, margin: 24, summary: "Opening skin blowout" },
      { skin: 2, winnerRuns: 28, loserRuns: 14, margin: 14, summary: "Harshal Joshi boundary blitz" },
      { skin: 3, winnerRuns: 27, loserRuns: 19, margin: 8, summary: "Tight middle skin" },
      { skin: 4, winnerRuns: 26, loserRuns: 12, margin: 14, summary: "Closing clinical skin" },
    ],
  },

  // Match 3: VPGR vs DesiDabanggs
  "3": {
    matchId: 3,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "VPGR vs DesiDabanggs",
    date: "15 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 2)",
    winner: "VPGR",
    loser: "DesiDabanggs",
    scoreSummary: "VPGR 148 def. DesiDabanggs 56 (+92 run margin, 4-0 skins sweep)",
    editorHeadline: "Tournament Record 148 as VPGR Batter Dabanggs Attack",
    editorSummary:
      "VPGR produced the highest team total of the tournament (148 runs) in an explosive display of indoor cricket batting. Sajid Merchant and Himanshu Kalyani dominated the central overs, while Ankush Goel again led the bowling attack with 3 wickets.",
    whatWentRightWinner: {
      title: "Tactical Wins for VPGR",
      points: [
        "Record 148 runs scored with 18 boundaries hit across four skins.",
        "Sajid Merchant scored 28 runs off 12 deliveries faced with zero dismissals.",
        "Tejas Shah bowled tight line-and-length in skin 3, taking 3 wickets for just 3 runs conceded.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for DesiDabanggs",
      points: [
        "Bowling attack unraveled; conceded 148 runs at an average of 9.25 runs per over.",
        "Fielding errors gave away 14 overthrows and missed two straightforward run-out opportunities.",
        "Negative net momentum in skins 2 and 4 under relentless pressure.",
      ],
    },
    turningPoint: {
      phase: "Skin 3 (Overs 9-12)",
      description:
        "VPGR amassed 44 runs in Skin 3 alone, putting the contest completely out of reach before the final skin.",
      nature: "Tactical Domination",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 34, loserRuns: 16, margin: 18, summary: "Fast start by VPGR" },
      { skin: 2, winnerRuns: 36, loserRuns: 12, margin: 24, summary: "Himanshu acceleration" },
      { skin: 3, winnerRuns: 44, loserRuns: 14, margin: 30, summary: "Record skin score" },
      { skin: 4, winnerRuns: 34, loserRuns: 14, margin: 20, summary: "Dominant finish" },
    ],
  },

  // Match 4: DesiTigers vs DesiTitans
  "4": {
    matchId: 4,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTigers vs DesiTitans",
    date: "15 May 2026, 9:30 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "DesiTitans",
    scoreSummary: "DesiTigers 103 def. DesiTitans 69 (+34 run margin, 3-1 skins)",
    editorHeadline: "Prateek Nahar's 34-Run Masterclass Drives Tigers to Top Seed",
    editorSummary:
      "DesiTigers sealed their place in the Grand Final with a calculated victory over DesiTitans. Prateek Nahar was the standout performer, scoring 34 runs and taking 2 wickets to secure Player of the Match honours.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiTigers",
      points: [
        "Prateek Nahar dominated Skin 2 with clean striking to the back net.",
        "Kalrav Shah provided stability with disciplined strike rotation in Skin 4.",
        "Bowlers defended low totals in Skins 3 and 4 with accurate yorkers on Court 1.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for DesiTitans",
      points: [
        "Inability to contain Nahar during Overs 5-8 where 38 runs were conceded.",
        "Middle-order batters failed to capitalize on loose deliveries, managing only 3 boundaries in 16 overs.",
        "Two crucial dismissals in Over 15 derailed a potential comeback.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      description:
        "Prateek Nahar scored 22 runs off 8 balls in Overs 6 and 7, breaking the Titans' containment strategy.",
      nature: "Tactical Domination",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 24, loserRuns: 20, margin: 4, summary: "Closely fought opening skin" },
      { skin: 2, winnerRuns: 38, loserRuns: 12, margin: 26, summary: "Nahar decisive onslaught" },
      { skin: 3, winnerRuns: 19, loserRuns: 21, margin: -2, summary: "Titans edged Skin 3" },
      { skin: 4, winnerRuns: 22, loserRuns: 16, margin: 6, summary: "Tigers held nerve in death" },
    ],
  },

  // Match 5: Grand Final — DesiTigers vs VPGR
  "5": {
    matchId: 5,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiTigers vs VPGR (Grand Final)",
    date: "18 May 2026, 8:00 PM",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "DesiTigers",
    loser: "VPGR",
    scoreSummary: "DesiTigers 111 def. VPGR 94 (+17 run margin, 3-1 skins)",
    editorHeadline: "Abhishek Agarwal Heroics Crown DesiTigers Champions in Thriller",
    editorSummary:
      "A thrilling final saw DesiTigers edge tournament favourites VPGR by 17 runs. While VPGR led after the second skin behind Ankush Goel's tight bowling, DesiTigers staged a dramatic turnaround in Skins 3 and 4. Abhishek Agarwal played the innings of the tournament, scoring 19 runs and capturing 2 wickets in the championship skin to claim Final MVP.",
    whatWentRightWinner: {
      title: "Championship Tactics for DesiTigers",
      points: [
        "Abhishek Agarwal kept calm under intense pressure in Skin 4, scoring 19 runs without a single dismissal.",
        "Harshal Joshi and Manthan Shah combined for 6 wickets in the bowling innings, restricting VPGR's dangerous hitters.",
        "Fielding excellence; zero dropped catches and 2 direct-hit run-outs in the death overs.",
      ],
    },
    whatWentWrongLoser: {
      title: "Where VPGR Lost the Final",
      points: [
        "Skin 4 collapse (+8 runs vs +25 needed) against disciplined Tigers death bowling.",
        "Top scorer Sajid Merchant was dismissed twice in Over 14 (-10 run penalty).",
        "Over-aggression in the final 4 overs when steady two-run rotation would have won the championship.",
      ],
    },
    turningPoint: {
      phase: "Skin 4 (Overs 13-16)",
      description:
        "VPGR needed 22 runs to win entering Over 14. Harshal Joshi produced a maiden-wicket over, dismissing Merchant twice and sealing the title for DesiTigers.",
      nature: "Critical Errors",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 28, loserRuns: 26, margin: 2, summary: "High-intensity opening exchange" },
      { skin: 2, winnerRuns: 24, loserRuns: 32, margin: -8, summary: "VPGR took lead in Skin 2" },
      { skin: 3, winnerRuns: 31, loserRuns: 24, margin: 7, summary: "Tigers reclaimed advantage" },
      { skin: 4, winnerRuns: 28, loserRuns: 12, margin: 16, summary: "Championship-clinching skin" },
    ],
  },

  // Match 6: 3rd Place Playoff — DesiDabanggs vs DesiTitans
  "6": {
    matchId: 6,
    tournamentName: "Desi Boys Tournament May 2026",
    matchTitle: "DesiDabanggs vs DesiTitans (3rd Place Playoff)",
    date: "18 May 2026, 9:30 PM",
    venue: "Insportz Club, Dubai (Court 2)",
    winner: "DesiDabanggs",
    loser: "DesiTitans",
    scoreSummary: "DesiDabanggs 94 def. DesiTitans 76 (+18 run margin, 2-2 skins, Dabanggs on aggregate)",
    editorHeadline: "Preraq Mistry Stars as Dabanggs Edge Titans for Bronze Podium",
    editorSummary:
      "DesiDabanggs secured third place in the tournament standings with an 18-run aggregate win over DesiTitans. In a match that saw the skins split 2-2, Dabanggs built a decisive lead in Skin 2 behind Preraq Mistry's Player of the Match display.",
    whatWentRightWinner: {
      title: "Tactical Wins for DesiDabanggs",
      points: [
        "Preraq Mistry scored 24 runs and bowled with an economy of 3.00, earning Player of the Match.",
        "Darshan Mody marshaled his team through a tight Skin 4, defending an 18-run lead cleanly.",
        "Significantly improved extras discipline; only 6 wides conceded compared to 18 in earlier games.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for DesiTitans",
      points: [
        "Skin 2 blowout (-12 run differential) proved insurmountable despite winning Skins 1 and 3.",
        "Late-order batters failed to accelerate against slower deliveries in Over 16.",
        "Finished the tournament winless (0-4) due to recurring middle-over collapses.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      description:
        "Preraq Mistry hit consecutive boundaries in Over 7, pushing Dabanggs to a +32 skin score while Titans managed only 20.",
      nature: "Tactical Domination",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 20, loserRuns: 22, margin: -2, summary: "Titans edged tight opener" },
      { skin: 2, winnerRuns: 32, loserRuns: 20, margin: 12, summary: "Mistry decisive burst" },
      { skin: 3, winnerRuns: 18, loserRuns: 20, margin: -2, summary: "Titans fought back in Skin 3" },
      { skin: 4, winnerRuns: 24, loserRuns: 14, margin: 10, summary: "Dabanggs clinched bronze" },
    ],
  },

  // Match 7: Practice Match — Away Team vs Home Team
  "7": {
    matchId: 7,
    tournamentName: "Desisports Regular Practice",
    matchTitle: "Home Team vs Away Team",
    date: "09 September 2026, 20:17",
    venue: "Insportz Club, Dubai (Court 1)",
    winner: "Away Team",
    loser: "Home Team",
    scoreSummary: "Away Team 120 def. Home Team 63 (+57 run margin, 4-0 skins sweep)",
    editorHeadline: "Yash Inspires Away Team to 120-Run Victory in High-Scoring Practice",
    editorSummary:
      "Away Team demonstrated superior indoor cricket execution in a 120-63 practice match victory over Home Team. Yash earned Player of the Match with 18 runs scored, 3 wickets taken, and a game-best contribution of +19 (18 RS - (-1 RC) = +19).",
    whatWentRightWinner: {
      title: "Tactical Wins for Away Team",
      points: [
        "Yash led with +19 contribution (18 runs scored, 3 wickets taken, negative runs conceded).",
        "Consistent scoring across all four skins: 34, 33, 34, and 19 net runs.",
        "Deepak and Narendra provided clean strike rotation in the middle overs.",
      ],
    },
    whatWentWrongLoser: {
      title: "Breakdown for Home Team",
      points: [
        "Skin 2 collapsed to -3 net runs due to 3 dismissals off successive overs.",
        "Conceded 28 runs in extras, repeatedly relieving scoreboard pressure.",
        "Bowlers struggled with line consistency against Yash and Viral.",
      ],
    },
    turningPoint: {
      phase: "Skin 2 (Overs 5-8)",
      description:
        "Home Team conceded 3 dismissals (-15 runs) in Skin 2, plunging their score to -3 while Away Team surged ahead.",
      nature: "Critical Errors",
    },
    skinsBreakdown: [
      { skin: 1, winnerRuns: 34, loserRuns: 27, margin: 7, summary: "High-scoring opening skin" },
      { skin: 2, winnerRuns: 33, loserRuns: -3, margin: 36, summary: "Home Team collapsed in Skin 2" },
      { skin: 3, winnerRuns: 34, loserRuns: 29, margin: 5, summary: "Competitive 3rd skin" },
      { skin: 4, winnerRuns: 19, loserRuns: 10, margin: 9, summary: "Away closed out clean sweep" },
    ],
  },
};

export function getMatchAnalysis(matchId: number | string): MatchTacticalAnalysis | null {
  return MATCH_ANALYSES[String(matchId)] || null;
}
