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
        "Captain Manthan Shah strategically deployed Prateek Nahar and Kalrav Shah to open Skin 1 in the Championship Final. The pair delivered +28 runs against VPGR's spearhead bowlers, preventing early dismissals and shifting the psychological pressure onto VPGR.",
      impact: "+14.2 net run differential compared to group stage opening skin",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Prateek Nahar", "Kalrav Shah"],
        objective: "Powerplay Stun & Frontcourt Defense",
        netRunsExpected: "+28.0 runs",
        synergyUplift: "+6.8 vs baselines",
        reasoning: "Promoted to Skin 1 in the Final; combined boundary punch with disciplined 2-run calls through the covers.",
        historicalStatus: "Promoted in Final (Previously Skin 2)",
      },
      {
        skin: 2,
        pair: ["Harshal joshi", "Hemang Shah"],
        objective: "Skin Consolidation & Rebuild",
        netRunsExpected: "+31.0 runs",
        synergyUplift: "+7.2 vs baselines",
        reasoning: "Exceptional dismissal minimization; batted with zero run-out calls across all 16 tournament overs.",
        historicalStatus: "Core Fixed Pair (3 Matches)",
      },
      {
        skin: 3,
        pair: ["Manthan Shah", "Gaurav Arora"],
        objective: "Middle-Overs Leverage",
        netRunsExpected: "+26.0 runs",
        synergyUplift: "+5.1 vs baselines",
        reasoning: "Captain Manthan led the middle skin with quick singles, while Gaurav targeted the side netting with deft cuts.",
        historicalStatus: "Consistently Maintained",
      },
      {
        skin: 4,
        pair: ["Kunal soni", "Prateek Attree"],
        objective: "Death Overs Climax & Closer",
        netRunsExpected: "+27.0 runs",
        synergyUplift: "+6.2 vs baselines",
        reasoning: "Aggressive lower-order punch sealing tournament victory with decisive boundary net hits.",
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
        "Abhishek Agarwal and Ankush Goel remained VPGR's anchor in Skin 1 (+25.8 tournament average). However, shifting middle skin assignments isolated Himanshu Kalyani during Skins 2 and 3, allowing DesiTigers to build a cushion despite a valiant 4th skin rally.",
      impact: "Middle skins deficit cost the championship",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Abhishek Agarwal", "Ankush Goel"],
        objective: "Powerplay Containment & Early Lead",
        netRunsExpected: "+25.8 runs",
        synergyUplift: "+5.2 vs baselines",
        reasoning: "Tournament benchmark opening pair; combined Ankush's power with Abhishek's reliable gap finding.",
        historicalStatus: "Core Fixed Pair (All Matches)",
      },
      {
        skin: 2,
        pair: ["Tejas Shah", "Sajid Merchant"],
        objective: "Middle Skin Defense",
        netRunsExpected: "+24.0 runs",
        synergyUplift: "+4.1 vs baselines",
        reasoning: "Steady running between wickets and disciplined defense against hostile bowling spells.",
        historicalStatus: "Experienced Tandem",
      },
      {
        skin: 3,
        pair: ["Chaitanya Shah", "Deepak Kherajani"],
        objective: "Middle-Overs Acceleration",
        netRunsExpected: "+20.0 runs",
        synergyUplift: "+3.0 vs baselines",
        reasoning: "Solid rotation between wickets but restricted by tight fielding.",
        historicalStatus: "Maintained from Match 3",
      },
      {
        skin: 4,
        pair: ["Himanshu Kalyani", "Manish Jain"],
        objective: "Death Overs Surge",
        netRunsExpected: "+32.0 runs",
        synergyUplift: "+7.8 vs baselines",
        reasoning: "Captain Himanshu rallied the side with aggressive hits into the backcourt net.",
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
        "After two difficult group matches, captain Darshan Mody restructured the batting order for the 3rd Place Playoff. Promoting Preraq Mistry to open Skin 1 with Sandesh Jagtap paid instant dividends (+28 runs, POTM award), propelling the team to their tournament-high 94.",
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
        pair: ["Gagandeep Singh", "Chittaranjan Dey"],
        objective: "Skin Rebuild & Anchor",
        netRunsExpected: "+24.0 runs",
        synergyUplift: "+4.2 vs baselines",
        reasoning: "Gagandeep Singh controlled the middle overs with rapid running and low dot-ball percentage.",
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
        pair: ["Ravi kumar", "Sandeep Khedekar"],
        objective: "Closing Containment",
        netRunsExpected: "+20.0 runs",
        synergyUplift: "+2.8 vs baselines",
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
        "Titans tested different middle skin combinations across the tournament. While captain Hardik Desai and bowlers produced key wickets, unforced run-outs across high-pressure overs prevented sustained momentum.",
      impact: "-24 runs conceded in dismissal penalties across 3 matches",
    },
    pairs: [
      {
        skin: 1,
        pair: ["Hardik Desai", "Harsh Ramnani"],
        objective: "Powerplay Setup",
        netRunsExpected: "+22.0 runs",
        synergyUplift: "+3.5 vs baselines",
        reasoning: "Captain Hardik Desai led from the front with sharp calls and straight drives.",
        historicalStatus: "Opening Anchor Tandem",
      },
      {
        skin: 2,
        pair: ["Deepak thawani", "Milan Chheda"],
        objective: "Middle Skin Stabilization",
        netRunsExpected: "+19.0 runs",
        synergyUplift: "+2.8 vs baselines",
        reasoning: "Deepak and Milan anchored the second skin with disciplined crease defense.",
        historicalStatus: "Middle Order Pair",
      },
      {
        skin: 3,
        pair: ["Yash sisodia", "Mayank Agarwal"],
        objective: "Counter-Attacking Skin",
        netRunsExpected: "+18.0 runs",
        synergyUplift: "+2.2 vs baselines",
        reasoning: "Showed flashes of boundary potential against medium pace bowling.",
        historicalStatus: "Rotated Roster Pair",
      },
      {
        skin: 4,
        pair: ["Prateek Jain", "Ronak Jain"],
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
