/**
 * Pre-Tournament Team DNA Data for Tournament 2 ("DesiBoys Bazooka 4.0")
 * 
 * Mode: PRE-TOURNAMENT / HYPOTHESIS MODE
 * Author: Manish Pandey (manishp15@iimb.ac.in)
 * Last Updated: 2026-09-13
 * 
 * Strict Hygiene:
 *   - Zero residual match scores or playoff references from Tournament 1 (May 2026).
 *   - Clear hypothesis labeling ("EARLY INDICATION", "HIGH CONFIDENCE", etc.).
 *   - Measurable hypotheses for Captain's Watchlist and What to Watch For.
 *   - Bazooka tactical intelligence tailored to DesiBoys Bazooka 4.0 rules.
 */

export interface TeamDNAData {
  teamId: number;
  teamName: string;
  captain: string;
  mode: string;
  statement: string;
  identity: {
    primary: string;
    secondary: string;
    confidence: "HIGH CONFIDENCE" | "MEDIUM CONFIDENCE" | "EARLY INDICATION" | "INSUFFICIENT EVIDENCE";
    explanation: string;
  };
  definingCharacteristics: Array<{
    title: string;
    evidence: string;
    meaning: string;
  }>;
  strengths: Array<{
    strength: string;
    evidence: string;
    why: string;
  }>;
  weaknesses: Array<{
    type: "KNOWN WEAKNESS" | "POTENTIAL RISK";
    weakness: string;
    evidence: string;
    why: string;
  }>;
  likelyPairings: Array<{
    pair: string;
    confidence: string;
    evidence: string;
    role: string;
    why: string;
    concern: string;
  }>;
  pairingOptions: {
    bestKnown: { pair: string; reason: string; confidence: string };
    bestBalanced: { pair: string; reason: string; confidence: string };
    highestCeiling: { pair: string; reason: string; confidence: string };
    lowestRisk: { pair: string; reason: string; confidence: string };
    experimental: { pair: string; reason: string; confidence: string };
  };
  bazookaTactics: {
    likelyPair: string;
    confidence: string;
    why: string;
    when: string;
    risk: string;
  };
  bowlingIdentity: {
    wicketTaking: string[];
    control: string[];
    disciplineRisks: string[];
    order: string;
    core: string;
    keyQuestion: string;
  };
  teamDependency: {
    level: "BALANCED" | "MODERATELY DEPENDENT" | "HIGHLY DEPENDENT";
    description: string;
    implication: string;
  };
  captainsWatchlist: string[];
  whatToWatchFor: Array<{
    hypothesis: string;
    confirm: string;
    disprove: string;
  }>;
  evolutionNotice: string;
  finalSummary: {
    oneLine: string;
    captainsQuestion: string;
  };
}

export const TOURNAMENT_2_TEAM_DNA: Record<number, TeamDNAData> = {
  "11": {
    "teamId": 11,
    "teamName": "Desi Titans",
    "captain": "Hardik Desai",
    "mode": "PRE-TOURNAMENT / HYPOTHESIS MODE",
    "statement": "Early indication: an anchored accumulation unit built around disciplined strike rotation and steady pair floors. The critical tactical question is whether their middle-order partnerships can generate enough boundary velocity to capitalize on Bazooka overs without taking excessive dismissal penalties.",
    "identity": {
      "primary": "Anchored Accumulation & Floor Stability",
      "secondary": "Control Bowling & Defensive Discipline",
      "confidence": "EARLY INDICATION",
      "explanation": "Desi Titans rely on high-percentage cricket, prioritizing low-dismissal partnerships over high-risk aerial hitting. Their historical roster core emphasizes steady strike rotation through the side nets and bowling consistency. The squad's competitive ceiling will depend on whether newer roster additions can provide the boundary punch needed when trailing in run differential."
    },
    "definingCharacteristics": [
      {
        "title": "Low-Dismissal Batting Discipline",
        "evidence": "Historical profiles of core batters (Hardik Desai, Hemang Shah) show an emphasis on working the ball into front and side nets with minimal negative-run events.",
        "meaning": "The team protects its scoreline effectively, rarely conceding the devastating -5 clusters that derail indoor cricket partnerships."
      },
      {
        "title": "Tactical Acceleration Flexibility",
        "evidence": "Preraq Mistry provides a distinct gear shift, capable of moving from steady rotation into boundary hunting in the back half of skins.",
        "meaning": "Titans can split pairing duties between floor anchors and strike accelerants depending on skin match-states."
      },
      {
        "title": "Restricted Bowling Extras",
        "evidence": "Core bowling personnel favor tight stump-to-stump trajectories over extreme pace, minimizing legside and wide penalties.",
        "meaning": "Opposition batters are forced to create their own run opportunities rather than feeding on errant deliveries."
      }
    ],
    "strengths": [
      {
        "strength": "Partnership Floor Consistency",
        "evidence": "Historical pairing behavior shows steady 25-35 run outputs across partnerships rather than volatility.",
        "why": "Guarantees that Titans will remain mathematically alive in all 4 skins, rarely surrendering an uncompetitive skin."
      },
      {
        "strength": "High Running Chemistry Between Wickets",
        "evidence": "Core combinations communicate early on physical calls to midcourt and back-pitch areas.",
        "why": "Generates 10-15 bonus physical runs per innings that outdoor-oriented squads regularly forfeit."
      },
      {
        "strength": "Off-Pace Bowling Control",
        "evidence": "Multiple bowling options with medium and off-spin profiles who can utilize net bounce effectively.",
        "why": "Forces opposing aggressive hitters to generate their own power, often provoking miscalculated lofted drives."
      }
    ],
    "weaknesses": [
      {
        "type": "POTENTIAL RISK",
        "weakness": "Boundary Velocity Deficit",
        "evidence": "Limited number of natural pure back-net hitters who can reliably clear the zone on demand.",
        "why": "Could leave the team vulnerable in high-scoring shootouts where 40+ runs per skin are required."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Uncertainty Around New Squad Integrations",
        "evidence": "Several players (Aman Maheshwari, Bijoy Goswami, Sunny Vaswani) are making their tournament debuts for Titans.",
        "why": "Indoor cricket pairing dynamics require telepathic calling; unpracticed pairs risk run-out dismissals in early rounds."
      },
      {
        "type": "KNOWN WEAKNESS",
        "weakness": "Vulnerability Under Severe Run Chases",
        "evidence": "The steady rotation blueprint is less effective when chasing 12+ runs an over in skins 3 and 4.",
        "why": "Forces conservative batters outside their natural tempo, increasing dismissal vulnerability."
      }
    ],
    "likelyPairings": [
      {
        "pair": "Hardik Desai & Hemang Shah",
        "confidence": "MEDIUM CONFIDENCE",
        "evidence": "Established chemistry and complementary running patterns in practice sessions.",
        "role": "Opening Anchor (Skin 1)",
        "why": "Provides a calm, low-risk foundation to start the match, absorbing new-ball bounce and guaranteeing a positive skin baseline.",
        "concern": "Can stall in scoring momentum if opposition bowlers string together consecutive dot balls."
      },
      {
        "pair": "Preraq Mistry & Prateek Jain",
        "confidence": "EARLY INDICATION",
        "evidence": "Right-hand/right-hand combination blending acceleration with boundary placement.",
        "role": "Impact Accelerator (Skin 3 or 4)",
        "why": "Preraq provides boundary power while Prateek maintains strike rotation, creating balanced pressure on the fielding ring.",
        "concern": "Preraq's aggressive intent occasionally creates running confusion if calling is hesitated."
      }
    ],
    "pairingOptions": {
      "bestKnown": {
        "pair": "Hardik Desai & Hemang Shah",
        "reason": "Consistent floor and mutual understanding of indoor running lanes.",
        "confidence": "MEDIUM CONFIDENCE"
      },
      "bestBalanced": {
        "pair": "Hardik Desai & Preraq Mistry",
        "reason": "Perfect blend of anchor floor and explosive late skin acceleration.",
        "confidence": "MEDIUM CONFIDENCE"
      },
      "highestCeiling": {
        "pair": "Preraq Mistry & Sahil Aggarwal",
        "reason": "High boundary intent capable of posting a 45+ run skin.",
        "confidence": "EARLY INDICATION"
      },
      "lowestRisk": {
        "pair": "Hardik Desai & Hemang Shah",
        "reason": "Lowest projected dismissal count across 16 balls.",
        "confidence": "HIGH CONFIDENCE"
      },
      "experimental": {
        "pair": "Aman Maheshwari & Shaurya Bhatnagar",
        "reason": "Fresh combination that could unlock unexpected scoring options.",
        "confidence": "INSUFFICIENT EVIDENCE"
      }
    },
    "bazookaTactics": {
      "likelyPair": "Preraq Mistry & Prateek Jain",
      "confidence": "EARLY INDICATION",
      "why": "Preraq possesses the bat speed and net-zone targeting necessary to convert 2x scoring into decisive 12-16 run overs.",
      "when": "Likely triggered in Skin 3 or Skin 4 during a tight run chase or when seeking an insurmountable skin differential.",
      "risk": "A single caught-off-the-net dismissal during Bazooka doubles the deduction penalty, risking a catastrophic negative over."
    },
    "bowlingIdentity": {
      "wicketTaking": [
        "Preraq Mistry",
        "Hardik Desai"
      ],
      "control": [
        "Hemang Shah",
        "Prateek Jain"
      ],
      "disciplineRisks": [
        "New bowlers adjusting to indoor wide lines"
      ],
      "order": "Control bowler first, strike bowler in overs 2 & 4 to hunt wickets.",
      "core": "Hardik Desai, Preraq Mistry, Hemang Shah, Prateek Jain",
      "keyQuestion": "Can Titans' secondary bowling options keep extras under 6 runs per game without serving easy boundary balls?"
    },
    "teamDependency": {
      "level": "MODERATELY DEPENDENT",
      "description": "Moderately dependent on Hardik Desai's tactical stability and Preraq Mistry's boundary hitting.",
      "implication": "If Preraq has an off game or suffers early dismissals, Titans risk lacking a second explosive gear to bridge run deficits."
    },
    "captainsWatchlist": [
      "Monitor running calls between new squad pairs in the first 2 overs to prevent needless run-out dismissals.",
      "Identify which secondary bowler can be trusted with the 3rd over of each skin without conceding extras.",
      "Determine whether Bazooka should be deployed early to build a lead or saved for Skin 4 damage control.",
      "Track net runs conceded in the back net (Zone D) by spin vs seam bowlers."
    ],
    "whatToWatchFor": [
      {
        "hypothesis": "Titans will finish in the top 2 for fewest dismissals conceded across tournament group stages.",
        "confirm": "Averaging 2 or fewer dismissals per match across the first 3 games.",
        "disprove": "Conceding 4+ dismissals in multiple early matches under aggressive opposition bowling."
      },
      {
        "hypothesis": "Hardik Desai & Hemang Shah will secure Skin 1 in at least 65% of their matches.",
        "confirm": "Winning Skin 1 in 2 of the first 3 tournament fixtures.",
        "disprove": "Posting under 22 net runs in Skin 1 in consecutive outings."
      }
    ],
    "evolutionNotice": "Current Team DNA is based entirely on pre-tournament roster profiles, historical characteristics, and combination intelligence. As Bazooka 4.0 matches are played and ball-by-ball scorecards are approved, observed metrics will progressively replace these hypotheses.",
    "finalSummary": {
      "oneLine": "A disciplined, low-error accumulation squad whose tournament destiny hinges on finding reliable boundary power in Bazooka overs.",
      "captainsQuestion": "If I were Hardik Desai, I would be most interested to discover whether our new middle-order combinations can generate boundary power without spiking our dismissal count."
    }
  },
  "12": {
    "teamId": 12,
    "teamName": "Desi Dabanggs",
    "captain": "Ritesh Mehta",
    "mode": "PRE-TOURNAMENT / HYPOTHESIS MODE",
    "statement": "Early indication: a high-floor, rotation-centric squad anchored by elite indoor experience and calm match management. Their core strength lies in relentless running between wickets and defensive bowling, while their main test will be matching the pure boundary power of rival top orders.",
    "identity": {
      "primary": "High-Floor Strike Rotation & Tactical Discipline",
      "secondary": "Pressure Absorption & Multi-Option Bowling",
      "confidence": "EARLY INDICATION",
      "explanation": "Desi Dabanggs are built to minimize unforced errors. With proven tournament winners like Abhishek Agarwal and Kalrav Shah alongside new captain Ritesh Mehta, Dabanggs play high-percentage indoor cricket. They rely on constant 2s and 3s rather than home-run swings, keeping opposition bowlers under continual clock and fielding pressure."
    },
    "definingCharacteristics": [
      {
        "title": "Mastery of Indoor Running Lanes",
        "evidence": "Abhishek Agarwal and Kalrav Shah historically boast among the highest run-rotation percentages and lowest dot-ball rates in the league.",
        "meaning": "Dabanggs keep the scoreboard ticking even when boundaries are cut off by defensive field placements."
      },
      {
        "title": "Wicket Preservation Under Pressure",
        "evidence": "Dabanggs' veteran core rarely concedes multiple dismissals in the same over, immediately resetting after a wicket.",
        "meaning": "Skin collapses are extremely rare; their lowest skin outputs remain competitive."
      },
      {
        "title": "Diverse Bowling Options",
        "evidence": "Roster includes 7+ capable bowlers with contrasting trajectories (medium pace, seam, off-spin).",
        "meaning": "Captain Ritesh Mehta has tactical flexibility to match bowling styles against specific opposing pair weaknesses."
      }
    ],
    "strengths": [
      {
        "strength": "High-Pressure Composure",
        "evidence": "Core veterans have played multiple knockout playoffs with proven clutch temperament.",
        "why": "Dabanggs do not panic when trailing by 15-20 runs entering the final skin."
      },
      {
        "strength": "Dot-Ball Minimization",
        "evidence": "Heavy reliance on tip-and-run tactics to mid-on and mid-off pockets.",
        "why": "Forces opponents into hurried throws and overthrows, manufacturing bonus runs."
      },
      {
        "strength": "Balanced Bowling Rotation",
        "evidence": "No drop-off between primary and secondary bowling pairs across 16 overs.",
        "why": "Prevents opponents from targeting a single 'weak over' to blow a skin open."
      }
    ],
    "weaknesses": [
      {
        "type": "KNOWN WEAKNESS",
        "weakness": "Ceiling Limitations in Boundary Shootouts",
        "evidence": "Batting style prioritizes physical running over 6-zone and 4-zone net strikes.",
        "why": "If an opponent catches fire and posts 45+ in a skin, Dabanggs struggle to match that sheer run velocity without taking unnatural risks."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "New Captaincy Tactical Coordination",
        "evidence": "Ritesh Mehta assumes leadership with several incoming players (Daman Singh, Harshad Jariwala, Kamal Jeet Singh).",
        "why": "On-field field placement adjustments and bowling orders will take an inning or two to fully crystallize."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Susceptibility to Express Pace Bowlers",
        "evidence": "Aggressive, tight-line fast bowlers can crowd the front crease and disrupt delicate tip-and-run calling.",
        "why": "Can lead to hesitation and tight run-out chances."
      }
    ],
    "likelyPairings": [
      {
        "pair": "Abhishek Agarwal & Kalrav Shah",
        "confidence": "HIGH CONFIDENCE",
        "evidence": "One of the most proven, high-chemistry indoor partnerships with complimentary right-hand running instincts.",
        "role": "Anchor / Engine Room (Skin 2 or 3)",
        "why": "Combines Abhishek's ice-cold temperament with Kalrav's quick strike turnover; almost impossible to bowl maiden overs against.",
        "concern": "Heavy reliance on physical exertion in the middle overs can cause fatigue in warm venue conditions."
      },
      {
        "pair": "Ritesh Mehta & Harsh Ramnani",
        "confidence": "EARLY INDICATION",
        "evidence": "Captain-led partnership designed to steady the ship and control skin tempo.",
        "role": "Opening Stabilizer (Skin 1)",
        "why": "Establishes a methodical rhythm and probes opposition bowling discipline early.",
        "concern": "Must ensure run rate does not lag below 6 runs per over in the first 8 balls."
      }
    ],
    "pairingOptions": {
      "bestKnown": {
        "pair": "Abhishek Agarwal & Kalrav Shah",
        "reason": "Decades of combined indoor instincts, unmatched running chemistry.",
        "confidence": "HIGH CONFIDENCE"
      },
      "bestBalanced": {
        "pair": "Abhishek Agarwal & Ritesh Mehta",
        "reason": "Leadership stability and defensive poise across all 16 balls.",
        "confidence": "MEDIUM CONFIDENCE"
      },
      "highestCeiling": {
        "pair": "Kalrav Shah & Harsh Ramnani",
        "reason": "Potential for aggressive net hunting if momentum is on their side.",
        "confidence": "EARLY INDICATION"
      },
      "lowestRisk": {
        "pair": "Abhishek Agarwal & Kalrav Shah",
        "reason": "Consistently lowest dismissal rate in competitive tournament play.",
        "confidence": "HIGH CONFIDENCE"
      },
      "experimental": {
        "pair": "Daman Singh & Harshad Jariwala",
        "reason": "Fresh pairing with high athleticism and physical running potential.",
        "confidence": "INSUFFICIENT EVIDENCE"
      }
    },
    "bazookaTactics": {
      "likelyPair": "Abhishek Agarwal & Kalrav Shah",
      "confidence": "MEDIUM CONFIDENCE",
      "why": "Their microscopic dismissal rate makes them the safest vehicle for Bazooka overs; doubling physical runs without risking -5 penalties guarantees net gain.",
      "when": "Likely invoked in Skin 2 or 3 to lock down an insurmountable skin win.",
      "risk": "If an unexpected direct hit occurs during Bazooka, the -10 swing hurts a team that scores through accumulation rather than quick boundaries."
    },
    "bowlingIdentity": {
      "wicketTaking": [
        "Harsh Ramnani",
        "Kalrav Shah"
      ],
      "control": [
        "Ritesh Mehta",
        "Saurabh Ranjan"
      ],
      "disciplineRisks": [
        "Secondary pace options overstepping front crease"
      ],
      "order": "Tight seam up front, controlled spin/changeups in middle overs, death specialists in overs 15-16.",
      "core": "Kalrav Shah, Harsh Ramnani, Ritesh Mehta, Saurabh Ranjan",
      "keyQuestion": "Can Dabanggs maintain bowling discipline in the final 2 balls of overs where batsmen take aggressive Bazooka risks?"
    },
    "teamDependency": {
      "level": "MODERATELY DEPENDENT",
      "description": "Moderately dependent on Abhishek Agarwal and Kalrav Shah to carry the bulk of the net run scoring load.",
      "implication": "If the Abhishek/Kalrav pair is restricted to an average score, Dabanggs need pairs 3 and 4 to step up with positive differentials."
    },
    "captainsWatchlist": [
      "Verify that fielders hit the stumps directly from backward point and midwicket on early tip-and-run attempts.",
      "Protect the team's Bazooka deployment for the exact moment Abhishek and Kalrav feel settled in rhythm.",
      "Ensure batting pairs call early: 'YES', 'NO', 'WAIT' with zero hesitation to eliminate run-out risk.",
      "Keep extras (wides and legsides) to under 8 runs total per match."
    ],
    "whatToWatchFor": [
      {
        "hypothesis": "Dabanggs will concede the lowest number of extras (wides + no balls) in Tournament 2.",
        "confirm": "Conceding fewer than 6 bowling extras per game across the first two rounds.",
        "disprove": "Bowlers spraying 10+ extras in an opening match under tight umpire scrutiny."
      },
      {
        "hypothesis": "Abhishek Agarwal & Kalrav Shah will win their batting skin in 75%+ of tournament fixtures.",
        "confirm": "Outscoring their opposition pair in the first two matches by 10+ net runs.",
        "disprove": "Being held to under 20 net runs in either of the opening fixtures."
      }
    ],
    "evolutionNotice": "Current Team DNA is based strictly on historical tournament evidence, player archetypes, and pre-tournament combination models. No residual match scores from May 2026 are assumed. As Bazooka 4.0 matches commence, live ball-by-ball analysis will update every dimension.",
    "finalSummary": {
      "oneLine": "A ruthless accumulation machine whose indoor experience and composure make them extremely difficult to beat in close skins.",
      "captainsQuestion": "If I were Ritesh Mehta, I would want to see whether our secondary pairs can create 30+ run skins to relieve pressure on our veteran engine room."
    }
  },
  "13": {
    "teamId": 13,
    "teamName": "Desi Tigers",
    "captain": "Prateek Nahar",
    "mode": "PRE-TOURNAMENT / HYPOTHESIS MODE",
    "statement": "Early indication: a high-octane, strike-oriented powerhouse with explosive boundary potential and devastating front-line pace. Their tournament success will depend on managing aggression so high-risk shots do not turn into dismissal avalanches.",
    "identity": {
      "primary": "High-Impact Boundary Hunting & Strike Bowling",
      "secondary": "Front-Foot Aggression & Rapid Momentum Shifts",
      "confidence": "EARLY INDICATION",
      "explanation": "Desi Tigers possess the highest raw firepower in the competition. Led by dynamic all-rounder Prateek Nahar and prolific run-getter Manthan Shah, the Tigers attack from ball one. They look to punch holes into the back nets (Zone D) and bowl with aggressive wicket-hunting lengths that force opposition mistakes."
    },
    "definingCharacteristics": [
      {
        "title": "Back-Net Boundary Focus",
        "evidence": "Prateek Nahar and Manthan Shah consistently target 4-run and 6-run zones rather than settling for singles.",
        "meaning": "Tigers can put 45-50 runs on the board in a single 4-over skin when in rhythm."
      },
      {
        "title": "Strike Bowling Teeth",
        "evidence": "Prateek Nahar and Himanshu Kalyani bring intense pace and sharp off-spin with high dot-ball percentages.",
        "meaning": "Tigers regularly take multiple wickets in an over, turning tight skins into blowouts."
      },
      {
        "title": "Aggressive Field Prowess",
        "evidence": "High athleticism in the infield with fielders attacking the ball on the drop to effect direct hits.",
        "meaning": "Opponents cannot easily utilize lazy tip-and-run singles without risking dismissals."
      }
    ],
    "strengths": [
      {
        "strength": "Unmatched Ceiling in Skin Totals",
        "evidence": "Historical tournament data shows Tigers producing the highest individual pair scores when clicking.",
        "why": "Can win skins by 20+ runs, providing a massive buffer on total match scoreline."
      },
      {
        "strength": "High-Pressure Wicket Takers",
        "evidence": "Bowlers aggressively hunt the pads and stumps rather than bowling containment lines.",
        "why": "A single 3-wicket bowling over (-15 runs to opponent) effectively decides the skin on the spot."
      },
      {
        "strength": "Natural Bazooka Chemistry",
        "evidence": "Roster composition is tailor-made for 2x scoring rules where boundary balls produce 8-12 runs each.",
        "why": "Tigers can exploit the tournament's Bazooka rules better than conservative squads."
      }
    ],
    "weaknesses": [
      {
        "type": "KNOWN WEAKNESS",
        "weakness": "High Dismissal Volatility",
        "evidence": "High boundary intent inevitably creates aerial chances off the side netting and top net.",
        "why": "If shots are mistimed, dismissals can accumulate quickly and drag a 40-run skin down to 15."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Bowling Discipline Under Pressure",
        "evidence": "Aggressive bowling occasionally leads to legside wides and overstepped no-balls when hunting wickets.",
        "why": "Gifted extras can bleed away hard-earned batting momentum."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Over-Reliance on Frontline Stars",
        "evidence": "Heavy expectations on Prateek Nahar and Manthan Shah to deliver both with bat and ball.",
        "why": "Secondary players must contribute solid par scores to prevent opponents from focusing entirely on the top guns."
      }
    ],
    "likelyPairings": [
      {
        "pair": "Prateek Nahar & Manthan Shah",
        "confidence": "HIGH CONFIDENCE",
        "evidence": "Elite individual records combined with natural alpha-batter communication.",
        "role": "Maximum Impact Anchor / Finisher (Skin 3 or 4)",
        "why": "Unstoppable when in rhythm; both can clear the back net at will, creating immense psychological pressure on the bowling captain.",
        "concern": "Both play an aggressive brand of cricket; if one gets out early, the temptation to hit out immediately can multiply errors."
      },
      {
        "pair": "Himanshu Kalyani & Gaurav Arora",
        "confidence": "EARLY INDICATION",
        "evidence": "Complementary styles: Himanshu provides defensive stability while Gaurav probes the side nets.",
        "role": "Foundation Pair (Skin 1 or 2)",
        "why": "Absorbs early bowling pressure and sets a steady 25-30 run baseline.",
        "concern": "Need to ensure they maintain scoring momentum against tight bowling spells."
      }
    ],
    "pairingOptions": {
      "bestKnown": {
        "pair": "Prateek Nahar & Manthan Shah",
        "reason": "Highest combined scoring potential in the entire tournament.",
        "confidence": "HIGH CONFIDENCE"
      },
      "bestBalanced": {
        "pair": "Manthan Shah & Himanshu Kalyani",
        "reason": "Aggressor + anchor balance that guarantees both runs and wicket protection.",
        "confidence": "MEDIUM CONFIDENCE"
      },
      "highestCeiling": {
        "pair": "Prateek Nahar & Manthan Shah",
        "reason": "Capable of producing a 50+ run skin under Bazooka conditions.",
        "confidence": "HIGH CONFIDENCE"
      },
      "lowestRisk": {
        "pair": "Himanshu Kalyani & Gaurav Arora",
        "reason": "Controlled bat swings with low aerial exposure.",
        "confidence": "EARLY INDICATION"
      },
      "experimental": {
        "pair": "Aditya Bhardwaj & Brijesh Gopinathan",
        "reason": "Exciting new combination that could surprise opponents with fresh tactics.",
        "confidence": "INSUFFICIENT EVIDENCE"
      }
    },
    "bazookaTactics": {
      "likelyPair": "Prateek Nahar & Manthan Shah",
      "confidence": "HIGH CONFIDENCE",
      "why": "Tigers are the quintessential Bazooka team. Prateek and Manthan can hit 6s and 4s cleanly; an 8-run or 12-run single shot during Bazooka blows the match wide open.",
      "when": "Either Skin 3 to kill the game, or Skin 4 if chasing a big target.",
      "risk": "If an aggressive lofted drive is caught off the net on a Bazooka ball, the -10 deduction is crippling."
    },
    "bowlingIdentity": {
      "wicketTaking": [
        "Prateek Nahar",
        "Himanshu Kalyani",
        "Prateek Attree"
      ],
      "control": [
        "Manthan Shah",
        "Gaurav Arora"
      ],
      "disciplineRisks": [
        "Fast bowlers pushing the crease on no-balls"
      ],
      "order": "Himanshu for control early, Prateek Nahar for strike overs 2 and 4 to blast through top batters.",
      "core": "Prateek Nahar, Manthan Shah, Himanshu Kalyani, Gaurav Arora",
      "keyQuestion": "Can Tigers turn their raw wicket-taking ability into clinical skin wins without conceding 8+ extras?"
    },
    "teamDependency": {
      "level": "HIGHLY DEPENDENT",
      "description": "Highly dependent on Prateek Nahar and Manthan Shah producing above-average contributions with both bat and ball.",
      "implication": "If opposing captains successfully game-plan against Prateek and Manthan, Tigers must rely on their emerging roster to win critical skins."
    },
    "captainsWatchlist": [
      "Ensure fielders do not concede overthrows by backing up the stumps cleanly on aggressive direct-hit attempts.",
      "Advise the batting pairs to take the single on ball 1 of each over before looking for the big back-net shot.",
      "Time the Bazooka over precisely when the opposition's secondary bowler is on.",
      "Keep team energy high even if an early skin is lost by a narrow margin."
    ],
    "whatToWatchFor": [
      {
        "hypothesis": "Tigers will lead the tournament in total boundaries (4s and 6s) hit.",
        "confirm": "Hitting 8+ net boundaries per match in the opening rounds.",
        "disprove": "Being restricted to under 4 boundaries against disciplined line-and-length attacks."
      },
      {
        "hypothesis": "Prateek Nahar will register a top-3 tournament contribution score in Game 1.",
        "confirm": "Posting 20+ net runs and 2+ wickets in the tournament opener.",
        "disprove": "Suffering multiple dismissals and finishing with a negative or sub-par contribution."
      }
    ],
    "evolutionNotice": "Current Team DNA is formulated as a pre-tournament hypothesis. As actual match cards from Bazooka 4.0 are uploaded, the observed balance between high boundary ceiling and dismissal risk will be rigorously updated.",
    "finalSummary": {
      "oneLine": "A ferocious attacking unit with the highest tournament ceiling, whose title credentials depend on boundary execution and emotional composure.",
      "captainsQuestion": "If I were Prateek Nahar, I would want to know whether our secondary pairs can hold their own so our strike pairs don't have to over-attack every ball."
    }
  },
  "14": {
    "teamId": 14,
    "teamName": "Desi Challengers",
    "captain": "Darshan Mody",
    "mode": "PRE-TOURNAMENT / HYPOTHESIS MODE",
    "statement": "Early indication: a tenacious, physical combat squad featuring aggressive pace bowling and fearless middle-overs batting. Their challenge will be maintaining batting shape when early wickets fall and ensuring running calling remains disciplined.",
    "identity": {
      "primary": "Aggressive Pace Bowling & Power Hitting",
      "secondary": "Direct Physical Combat & High-Intensity Pressing",
      "confidence": "EARLY INDICATION",
      "explanation": "Desi Challengers bring formidable physical presence and fierce competitive desire. Anchored by fiery captain Darshan Mody, power-hitter Gagandeep Singh, and express strike bowler Sajid Merchant, Challengers play in-your-face indoor cricket designed to intimidate opponents and disrupt their natural rhythms."
    },
    "definingCharacteristics": [
      {
        "title": "Frontline Pace Intimidation",
        "evidence": "Darshan Mody and Sajid Merchant bowl with genuine pace and steep bounce off the indoor pitch surface.",
        "meaning": "Opponents are forced onto the back foot, reducing their ability to comfortably run down the track on tip-and-run attempts."
      },
      {
        "title": "Brute Force Net Hitting",
        "evidence": "Gagandeep Singh and Sajid Merchant hit the ball with exceptional bat speed into side and back netting.",
        "meaning": "Fielders cannot anticipate angles easily because the ball rebounds with extreme velocity."
      },
      {
        "title": "Dogged Match Fighting Spirit",
        "evidence": "Challengers' personnel historically refuse to concede skins easily, competing aggressively for every single net point.",
        "meaning": "Even when trailing, Challengers make opposing teams earn every single run under constant verbal and physical pressure."
      }
    ],
    "strengths": [
      {
        "strength": "Devastating New-Ball Pace Impact",
        "evidence": "Opening bowling spells regularly produce early play-and-misses and leading edges.",
        "why": "Sets an immediate negative tone for opposing batting pairs in Skin 1."
      },
      {
        "strength": "Power Striking in Middle Skins",
        "evidence": "Gagandeep Singh has one of the highest boundary-to-ball ratios in indoor formats.",
        "why": "Capable of erasing a 15-run deficit in the span of 3 balls."
      },
      {
        "strength": "Athletic Outfield Coverage",
        "evidence": "Quick lateral movers who cut off side-net angles and take reflex catches close to the side wire.",
        "why": "Turns potential 3-run shots into dot balls or dismissal chances."
      }
    ],
    "weaknesses": [
      {
        "type": "KNOWN WEAKNESS",
        "weakness": "Running Calling Chaos Under Duress",
        "evidence": "High adrenaline sometimes leads to shouting over calls and suicidal attempts for physical singles.",
        "why": "Run-outs are the single most avoidable -5 penalty in indoor cricket; Challengers must avoid self-inflicted wounds."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Emotional Volatility When Chasing",
        "evidence": "When momentum swings against them, batters can become impatient and swing wildly across the line.",
        "why": "Results in bowled and leg-before dismissals that compound pressure."
      },
      {
        "type": "POTENTIAL RISK",
        "weakness": "Lower-Order Batting Depth",
        "evidence": "Tail-end pairs have less tournament experience in managing pressure situations.",
        "why": "A drop-off in Skin 4 could cost the match bonus points even if earlier skins are won."
      }
    ],
    "likelyPairings": [
      {
        "pair": "Darshan Mody & Gagandeep Singh",
        "confidence": "HIGH CONFIDENCE",
        "evidence": "Proven alpha pairing blending Darshan's leadership drive with Gagandeep's raw boundary power.",
        "role": "Match Winners / Climax Skin (Skin 3 or 4)",
        "why": "Complements Darshan's aggressive strike taking with Gagandeep's ability to blast the ball through any field setting.",
        "concern": "Both want to dominate the strike; communication must be clear to avoid running hesitation."
      },
      {
        "pair": "Sajid Merchant & Deepak Thawani",
        "confidence": "EARLY INDICATION",
        "evidence": "Pace/all-rounder combination with good balance of defense and power.",
        "role": "Stabilizing Aggressor (Skin 2)",
        "why": "Keeps the momentum high while ensuring the scoreboard moves on every delivery.",
        "concern": "Need to ensure they rotate strike frequently rather than trying to hit every ball into Zone D."
      }
    ],
    "pairingOptions": {
      "bestKnown": {
        "pair": "Darshan Mody & Gagandeep Singh",
        "reason": "High-impact combination with proven big-game pedigree.",
        "confidence": "HIGH CONFIDENCE"
      },
      "bestBalanced": {
        "pair": "Darshan Mody & Deepak Thawani",
        "reason": "Captain's intensity balanced by Deepak's calm execution.",
        "confidence": "MEDIUM CONFIDENCE"
      },
      "highestCeiling": {
        "pair": "Gagandeep Singh & Sajid Merchant",
        "reason": "Raw physical muscle that can overwhelm any bowling attack in the competition.",
        "confidence": "HIGH CONFIDENCE"
      },
      "lowestRisk": {
        "pair": "Deepak Thawani & Milan Chheda",
        "reason": "Smart tactical placement and low-risk running between wickets.",
        "confidence": "EARLY INDICATION"
      },
      "experimental": {
        "pair": "Anuj & Sameer Gohel",
        "reason": "Fresh pairing that could unlock defensive versatility.",
        "confidence": "INSUFFICIENT EVIDENCE"
      }
    },
    "bazookaTactics": {
      "likelyPair": "Gagandeep Singh & Darshan Mody",
      "confidence": "HIGH CONFIDENCE",
      "why": "Gagandeep's power hitting combined with Darshan's aggressive intent makes this pair the obvious choice to invoke Bazooka. If Gagandeep connects on two balls, the skin is practically secured.",
      "when": "Best utilized in Skin 3 when facing the opposition's secondary bowling options.",
      "risk": "Aggressive swings carry high edge-and-caught risk off the top net; must play with controlled intent."
    },
    "bowlingIdentity": {
      "wicketTaking": [
        "Darshan Mody",
        "Sajid Merchant",
        "Gagandeep Singh"
      ],
      "control": [
        "Deepak Thawani",
        "Milan Chheda"
      ],
      "disciplineRisks": [
        "Fast bowlers bowling too short and conceding legside/wides"
      ],
      "order": "Sajid Merchant for thunderous opening over, Darshan Mody for death pressure overs.",
      "core": "Darshan Mody, Sajid Merchant, Gagandeep Singh, Deepak Thawani",
      "keyQuestion": "Can Challengers' fast bowlers bowl a disciplined off-stump channel without spraying penalty deliveries?"
    },
    "teamDependency": {
      "level": "HIGHLY DEPENDENT",
      "description": "Highly dependent on Darshan Mody's captaincy energy and Gagandeep Singh's boundary output.",
      "implication": "If Gagandeep is neutralized by tight spin, Challengers must find an alternate source of boundary production."
    },
    "captainsWatchlist": [
      "Keep the team calm and composed between deliveries; avoid rushed running decisions.",
      "Instruct bowlers to bowl fuller at the base of the stumps rather than testing the roof with short balls.",
      "Back up the non-striker's end on every throw from the outfield.",
      "Ensure Gagandeep gets 60%+ of the strike in their batting partnership."
    ],
    "whatToWatchFor": [
      {
        "hypothesis": "Challengers will lead the tournament in fast-bowling wickets taken.",
        "confirm": "Claiming 4+ wickets via pace bowling in their opening fixture.",
        "disprove": "Pace bowlers struggling to take wickets while conceding 30+ runs."
      },
      {
        "hypothesis": "Gagandeep Singh will hit at least two 6s during the tournament opener.",
        "confirm": "Clearing the back net multiple times in Skin 3/4.",
        "disprove": "Being contained to singles and 2s throughout his 16-ball innings."
      }
    ],
    "evolutionNotice": "This pre-tournament Team DNA represents an analytical hypothesis before any competitive matches in Bazooka 4.0. Live match results and ball-by-ball performance will confirm, modify, or disprove these initial observations.",
    "finalSummary": {
      "oneLine": "A high-intensity, physical power unit whose championship run depends on channel bowling discipline and eliminating avoidable run-outs.",
      "captainsQuestion": "If I were Darshan Mody, I would be most focused on whether our players can channel their aggressive energy into calm, mistake-free running between the wickets."
    }
  }
};

export function getTournament2TeamDNA(teamId: number | string): TeamDNAData | undefined {
  const id = typeof teamId === "string" ? parseInt(teamId, 10) : teamId;
  return TOURNAMENT_2_TEAM_DNA[id];
}
