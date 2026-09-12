export interface TeamTacticalData {
  batting: number;
  bowling: number;
  fielding: number;
  teamChemistry: number;
  rankTitle: string;
  recentMatchTitle: string;
  recentMatchResult: string;
  reshuffleInsight: {
    title: string;
    description: string;
    impact: string;
  };
  pairs: {
    skin: number;
    pair: [string, string];
    objective: string;
    netRunsExpected: string;
    synergyUplift: string;
    reasoning: string;
    historicalStatus: string;
  }[];
}

export const TEAM_TACTICAL_DATA: Record<string, TeamTacticalData> = {
  "DesiTigers": {
    batting: 88,
    bowling: 84,
    fielding: 86,
    teamChemistry: 89,
    rankTitle: "Tournament Champions • Elite All-Round Chemistry",
    recentMatchTitle: "Final vs VPGR (18 May 2026)",
    recentMatchResult: "Won by 17 runs (111 - 94, 3 skins to 1)",
    reshuffleInsight: {
      title: "Tactical Skin 1 Reshuffle Won The Final",
      description:
        "After utilizing Manthan Shah in Skin 1 during the group stage, captain rotated Abhishek Agarwal & Gagandeep Singh to open Skin 1 in the Championship Final. The pair delivered +28 runs against VPGR's spearhead bowlers, preventing early dismissals and shifting the psychological pressure.",
      impact: "+14.2 net run differential compared to group stage opening skin",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Abhishek Agarwal", "Gagandeep Singh"],
        objective: "Powerplay Stun & Frontcourt Defense",
        netRunsExpected: "+28.0 runs",
        synergyUplift: "+6.8 vs baselines",
        reasoning: "Promoted to Skin 1 in the Final; combined boundary punch with disciplined 2-run calls through the covers.",
        historicalStatus: "Promoted in Final (Previously Skin 2)",
      },
      {
        skin: 2,
        pair: ["Darshan Mody", "Hardik Desai"],
        objective: "Skin Consolidation & Rebuild",
        netRunsExpected: "+31.0 runs",
        synergyUplift: "+7.2 vs baselines",
        reasoning: "Exceptional dismissal minimization; batted with zero run-out calls across all 16 tournament overs.",
        historicalStatus: "Core Fixed Pair (3 Matches)",
      },
      {
        skin: 3,
        pair: ["Preraq Mistry", "Taha Shipchandler"],
        objective: "Middle-Overs Leverage",
        netRunsExpected: "+24.0 runs",
        synergyUplift: "+4.5 vs baselines",
        reasoning: "Exploited opposition backup bowlers with aggressive side-net rebounds.",
        historicalStatus: "Consistently Maintained",
      },
      {
        skin: 4,
        pair: ["Prateek Nahar", "Sajid Merchant"],
        objective: "Death Overs Climax & Closer",
        netRunsExpected: "+28.0 runs",
        synergyUplift: "+6.8 vs baselines",
        reasoning: "Tournament's leading run-getters combined in Skin 4 to seal every run chase without high-risk errors.",
        historicalStatus: "Undefeated Skin 4 Pair",
      },
    ],
  },
  "VPGR": {
    batting: 82,
    bowling: 86,
    fielding: 79,
    teamChemistry: 78,
    rankTitle: "Tournament Runners-Up • Elite Bowling Attack",
    recentMatchTitle: "Final vs DesiTigers (18 May 2026)",
    recentMatchResult: "Lost by 17 runs (94 - 111, 1 skin to 3)",
    reshuffleInsight: {
      title: "Middle Skin Reconfiguration Disrupted Momentum",
      description:
        "Kalrav Shah and Ankush Goel remained VPGR's anchor in Skin 1 (+25.8 tournament average). However, shifting Harshal Joshi down to Skin 4 isolated Himanshu Kalyani during Skins 2 and 3, allowing DesiTigers to build an insurmountable 17-run cushion despite a heroic 35-run 4th skin.",
      impact: "Middle skins deficit of -18 runs cost the championship",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Kalrav Shah", "Ankush Goel"],
        objective: "Powerplay Containment & Early Lead",
        netRunsExpected: "+25.8 runs",
        synergyUplift: "+5.2 vs baselines",
        reasoning: "Tournament benchmark opening pair; combined Ankush's power with Kalrav's gap finding.",
        historicalStatus: "Core Fixed Pair (All Matches)",
      },
      {
        skin: 2,
        pair: ["Harshwardhan Chauhan", "Hemal Gathani"],
        objective: "Middle Skin Defense",
        netRunsExpected: "+18.0 runs",
        synergyUplift: "+2.1 vs baselines",
        reasoning: "Faced hostile Tiger bowling; struggled with backcourt boundary conversion under pressure.",
        historicalStatus: "Rotated Pair in Playoff",
      },
      {
        skin: 3,
        pair: ["Meet Shah", "Parth Shah"],
        objective: "Middle-Overs Acceleration",
        netRunsExpected: "+19.0 runs",
        synergyUplift: "+3.0 vs baselines",
        reasoning: "Solid rotation between wickets but restricted to single-digit boundaries by tight fielders.",
        historicalStatus: "Maintained from Match 3",
      },
      {
        skin: 4,
        pair: ["Himanshu Kalyani", "Harshal Joshi"],
        objective: "Death Overs Surge",
        netRunsExpected: "+35.0 runs",
        synergyUplift: "+8.4 vs baselines",
        reasoning: "Highest scoring individual skin in the Final (+35 runs); relentless attack against the boundary nets.",
        historicalStatus: "Rallied in Final Skin 4",
      },
    ],
  },
  "DesiDabanggs": {
    batting: 64,
    bowling: 68,
    fielding: 65,
    teamChemistry: 66,
    rankTitle: "3rd Place Finishers • Resilient Playoff Comeback",
    recentMatchTitle: "3rd Place Playoff vs DesiTitans (18 May 2026)",
    recentMatchResult: "Won by 18 runs (94 - 76, 3 skins to 1)",
    reshuffleInsight: {
      title: "Playoff Reorganization Yielded 94 Runs",
      description:
        "After two group-stage collapses where Dabanggs scored only 53 and 56 runs, captain Darshan Mody restructured the batting order for the 3rd Place Playoff. Promoting Preraq Mistry to open Skin 1 paid instant dividends (+28 runs, POTM award), propelling the team to their tournament-high 94.",
      impact: "+38 run increase over group stage scoring average",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Preraq Mistry", "Sandesh Jagtap"],
        objective: "Attacking Opening Statement",
        netRunsExpected: "+28.0 runs",
        synergyUplift: "+6.4 vs baselines",
        reasoning: "Preraq Mistry's player-of-the-match performance set the tone for Dabanggs' playoff win.",
        historicalStatus: "New Playoff Pair (Decisive Win)",
      },
      {
        skin: 2,
        pair: ["Manthan Shah", "Tejas Shah"],
        objective: "Skin Rebuild & Anchor",
        netRunsExpected: "+25.0 runs",
        synergyUplift: "+4.8 vs baselines",
        reasoning: "Controlled the middle overs with rapid running and low dot-ball percentage.",
        historicalStatus: "Core Dabanggs Backbone",
      },
      {
        skin: 3,
        pair: ["Darshan Mody", "Narendra Tiwari"],
        objective: "Fielding Leverage & Singles",
        netRunsExpected: "+22.0 runs",
        synergyUplift: "+3.9 vs baselines",
        reasoning: "Targeted gaps behind square leg and exploited Titans' deep field placement.",
        historicalStatus: "Balanced Rotation",
      },
      {
        skin: 4,
        pair: ["Ravi Kumar", "Sandeep Khedekar"],
        objective: "Closing Containment",
        netRunsExpected: "+19.0 runs",
        synergyUplift: "+2.5 vs baselines",
        reasoning: "Preserved the lead in the final 4 overs with low-risk ground strokes.",
        historicalStatus: "Maintained for Playoff",
      },
    ],
  },
  "DesiTitans": {
    batting: 62,
    bowling: 64,
    fielding: 67,
    teamChemistry: 63,
    rankTitle: "4th Place Finishers • Rebuilding Middle Skins",
    recentMatchTitle: "3rd Place Playoff vs DesiDabanggs (18 May 2026)",
    recentMatchResult: "Lost by 18 runs (76 - 94, 1 skin to 3)",
    reshuffleInsight: {
      title: "Roster Instability Hurt Pair Continuity",
      description:
        "Titans fielded 17 different players across 3 tournament matches, testing 3 different Skin 2 and Skin 3 pairs. While individual bowlers like Hardik Desai and Prateek Jain produced wickets, the lack of settled batting pairings led to 8 unforced run-outs across the tournament.",
      impact: "-24 runs conceded in dismissal penalties across 3 matches",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Prateek Nahar", "Preraq Mistry"],
        objective: "Powerplay Setup",
        netRunsExpected: "+20.0 runs",
        synergyUplift: "+3.2 vs baselines",
        reasoning: "Capable of big boundary bursts but vulnerable to tight leg-side lines.",
        historicalStatus: "Modified for 3rd Place Match",
      },
      {
        skin: 2,
        pair: ["Hardik Desai", "Harsh Ramnani"],
        objective: "Middle Skin Stabilization",
        netRunsExpected: "+18.0 runs",
        synergyUplift: "+2.4 vs baselines",
        reasoning: "Solid intent but caught in mix-ups during multi-run calls.",
        historicalStatus: "Experimental Pair",
      },
      {
        skin: 3,
        pair: ["Yash Sisodia", "Mayank Agarwal"],
        objective: "Counter-Attacking Skin",
        netRunsExpected: "+17.0 runs",
        synergyUplift: "+2.0 vs baselines",
        reasoning: "Showed flashes of boundary potential against medium pace.",
        historicalStatus: "Rotated Roster Pair",
      },
      {
        skin: 4,
        pair: ["Vipul Jain", "Ronak Jain"],
        objective: "Death Overs Recovery",
        netRunsExpected: "+21.0 runs",
        synergyUplift: "+3.6 vs baselines",
        reasoning: "Fought hard in the final skin with 3 back-wall boundaries.",
        historicalStatus: "Maintained in 3rd Place Match",
      },
    ],
  },
};

export function getTeamTacticalData(teamName: string): TeamTacticalData {
  if (TEAM_TACTICAL_DATA[teamName]) return TEAM_TACTICAL_DATA[teamName];

  for (const [key, val] of Object.entries(TEAM_TACTICAL_DATA)) {
    if (teamName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(teamName.toLowerCase())) {
      return val;
    }
  }

  return TEAM_TACTICAL_DATA["DesiTigers"];
}
