export interface TacticalSynergy {
  optimalPartner: string;
  netSkinAvg: number;
  synergyUplift: number;
  tacticalRole: string;
  notes: string;
}

export const PLAYER_TACTICAL_MAP: Record<string, TacticalSynergy> = {
  "Prateek Nahar": {
    optimalPartner: "Sajid Merchant",
    netSkinAvg: 28.4,
    synergyUplift: 6.8,
    tacticalRole: "Anchor & Power Striker",
    notes: "Top-order anchor who controls the net run differential through aggressive 2-run calls and low dot-ball percentage in early overs.",
  },
  "Sajid Merchant": {
    optimalPartner: "Prateek Nahar",
    netSkinAvg: 28.4,
    synergyUplift: 6.8,
    tacticalRole: "Boundary Aggressor",
    notes: "Aggressive stroke maker who capitalizes on loose deliveries through the side nets with minimal negative dismissals.",
  },
  "Ankush Goel": {
    optimalPartner: "Kalrav Shah",
    netSkinAvg: 25.8,
    synergyUplift: 5.2,
    tacticalRole: "All-Round Containment",
    notes: "Tight bowling discipline and clutch skin batting; delivers high negative run pressure on opposition batters.",
  },
  "Kalrav Shah": {
    optimalPartner: "Ankush Goel",
    netSkinAvg: 25.8,
    synergyUplift: 5.2,
    tacticalRole: "Skin Finisher",
    notes: "Specializes in skin 4 chases with calculated running between wickets and gap placement along the side nets.",
  },
  "Himanshu Kalyani": {
    optimalPartner: "Harshal Joshi",
    netSkinAvg: 24.6,
    synergyUplift: 4.8,
    tacticalRole: "Captain & Steady Accumulator",
    notes: "Controls match tempo with reliable singles and defensive front-court block placement against fast deliveries.",
  },
  "Harshal Joshi": {
    optimalPartner: "Himanshu Kalyani",
    netSkinAvg: 24.6,
    synergyUplift: 4.8,
    tacticalRole: "Wicket Striker",
    notes: "Attacking medium pacer who attacks the stumps, forcing back-wall mistakes and indoor catches.",
  },
  "Manthan Shah": {
    optimalPartner: "Tejas Shah",
    netSkinAvg: 22.0,
    synergyUplift: 3.9,
    tacticalRole: "Dynamic Pair Leader",
    notes: "Excellent calling and quick turns in the running crease; optimizes 7-run scoring zones in skin 2 and 3.",
  },
  "Tejas Shah": {
    optimalPartner: "Manthan Shah",
    netSkinAvg: 22.0,
    synergyUplift: 3.9,
    tacticalRole: "Middle Skin Anchor",
    notes: "Dependable partner who minimizes -5 dismissal penalties by shielding strike during hostile bowling spells.",
  },
  "Abhishek Agarwal": {
    optimalPartner: "Gagandeep Singh",
    netSkinAvg: 27.2,
    synergyUplift: 6.1,
    tacticalRole: "Championship Final Hero",
    notes: "Clutch performer who excels in high-pressure playoff skins, maintaining scoring rate above 7.0 per over.",
  },
  "Darshan Mody": {
    optimalPartner: "Hardik Desai",
    netSkinAvg: 21.8,
    synergyUplift: 3.4,
    tacticalRole: "Tactical Coordinator",
    notes: "Strategic batter who targets corners and draws fielding over-commitments to exploit backcourt open zones.",
  },
  "Hardik Desai": {
    optimalPartner: "Darshan Mody",
    netSkinAvg: 21.8,
    synergyUplift: 3.4,
    tacticalRole: "Boundary Hitter",
    notes: "Powerful back-wall driver who generates quick multi-run deliveries under pressure.",
  },
  "Preraq Mistry": {
    optimalPartner: "Sandesh Jagtap",
    netSkinAvg: 23.5,
    synergyUplift: 4.2,
    tacticalRole: "Playoff Match Winner",
    notes: "Playoff POTM performer who turns difficult middle overs into skin-winning margins with clean hitting.",
  },
  "Yash": {
    optimalPartner: "Manthan Shah",
    netSkinAvg: 26.0,
    synergyUplift: 5.0,
    tacticalRole: "Impact Bowler & Hard Striker",
    notes: "Recorded +19 match contribution in practice session with 3 wickets and 18 net runs; dominant in front-court defense.",
  },
  "Manish Pandey": {
    optimalPartner: "Rushabh Gandhi",
    netSkinAvg: 21.4,
    synergyUplift: 3.5,
    tacticalRole: "Disciplined Anchor",
    notes: "Steadies early skins through disciplined shot selection and zero unforced run-out calls.",
  },
};

export function getPlayerTacticalInfo(name: string): TacticalSynergy {
  if (PLAYER_TACTICAL_MAP[name]) return PLAYER_TACTICAL_MAP[name];

  const lower = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(PLAYER_TACTICAL_MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }

  return {
    optimalPartner: "Sajid Merchant",
    netSkinAvg: 22.4,
    synergyUplift: 4.1,
    tacticalRole: "Versatile Squad Performer",
    notes: "Disciplined indoor player with sound technical shot execution and reliable running between wickets.",
  };
}
