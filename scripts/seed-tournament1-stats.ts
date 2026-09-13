import { prisma } from "../src/lib/prisma";

const ALL_MATCH_STATS: Record<number, any> = {
  "1": {
    "homeTeam": "VPGR",
    "awayTeam": "DesiTitans",
    "home": [
      {
        "name": "Abhishek Agarwal",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 6,
        "potm": false
      },
      {
        "name": "Ankush Goel",
        "rs": 12,
        "to": 0,
        "ob": 2.0,
        "rc": -4,
        "w": 4,
        "econ": -2.0,
        "c": 16,
        "potm": true,
        "note": "\u2605 Player of the Match (4 Wkts, -2.0 Econ)"
      },
      {
        "name": "Sajid Merchant",
        "rs": 13,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 2,
        "econ": 3.0,
        "c": 7,
        "potm": false
      },
      {
        "name": "Tejas Shah",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 2,
        "w": 2,
        "econ": 1.0,
        "c": 7,
        "potm": false
      },
      {
        "name": "Manish Jain",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 7,
        "w": 1,
        "econ": 3.5,
        "c": 2,
        "potm": false
      },
      {
        "name": "Parth Shah",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 0,
        "econ": 4.0,
        "c": -1,
        "potm": false
      },
      {
        "name": "Himanshu Kalyani",
        "rs": 9,
        "to": 0,
        "ob": 2.0,
        "rc": 7,
        "w": 2,
        "econ": 3.5,
        "c": 2,
        "potm": false
      },
      {
        "name": "Dhaval Bheda",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 7,
        "w": 1,
        "econ": 3.5,
        "c": 0,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Milan Chheda",
        "rs": 10,
        "to": 0,
        "ob": 2.0,
        "rc": 12,
        "w": 1,
        "econ": 6.0,
        "c": -2,
        "potm": false
      },
      {
        "name": "Deepak Thawani",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 0,
        "econ": 7.0,
        "c": -6,
        "potm": false
      },
      {
        "name": "Hardik Desai",
        "rs": 2,
        "to": 1,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": -8,
        "potm": false
      },
      {
        "name": "Harsh Ramnani",
        "rs": -5,
        "to": 2,
        "ob": 2.0,
        "rc": 12,
        "w": 1,
        "econ": 6.0,
        "c": -17,
        "potm": false
      },
      {
        "name": "Yash Sisodia",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 0,
        "potm": false
      },
      {
        "name": "Mayank Agarwal",
        "rs": 6,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": -2,
        "potm": false
      },
      {
        "name": "Prateek Jain",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": -1,
        "potm": false
      },
      {
        "name": "Ronak Jain",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 0,
        "econ": 4.0,
        "c": -3,
        "potm": false
      }
    ]
  },
  "2": {
    "homeTeam": "DesiTigers",
    "awayTeam": "DesiDabanggs",
    "home": [
      {
        "name": "Prateek Nahar",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 2,
        "econ": 3.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Kalrav Shah",
        "rs": 15,
        "to": 0,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 7,
        "potm": false
      },
      {
        "name": "Harshal Joshi",
        "rs": 17,
        "to": 0,
        "ob": 2.0,
        "rc": 4,
        "w": 3,
        "econ": 2.0,
        "c": 13,
        "potm": false
      },
      {
        "name": "Hemang Shah",
        "rs": 13,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 5,
        "potm": false
      },
      {
        "name": "Manthan Shah",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": -2,
        "w": 3,
        "econ": -1.0,
        "c": 20,
        "potm": true,
        "note": "\u2605 Player of the Match (+20 Contribution, 3 Wkts)"
      },
      {
        "name": "Gaurav Arora",
        "rs": 14,
        "to": 1,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 4,
        "potm": false
      },
      {
        "name": "Taha Shipchandler",
        "rs": 10,
        "to": 0,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 0,
        "potm": false
      },
      {
        "name": "Rohan Khedekar",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 1,
        "econ": 4.5,
        "c": -1,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Preraq Mistry",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 16,
        "w": 0,
        "econ": 8.0,
        "c": -8,
        "potm": false
      },
      {
        "name": "Sandesh Jagtap",
        "rs": 6,
        "to": 1,
        "ob": 2.0,
        "rc": 17,
        "w": 0,
        "econ": 8.5,
        "c": -11,
        "potm": false
      },
      {
        "name": "Gagandeep Singh",
        "rs": 7,
        "to": 2,
        "ob": 2.0,
        "rc": 17,
        "w": 0,
        "econ": 8.5,
        "c": -10,
        "potm": false
      },
      {
        "name": "Chittaranjan Dey",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 13,
        "w": 1,
        "econ": 6.5,
        "c": -8,
        "potm": false
      },
      {
        "name": "Darshan Mody",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 18,
        "w": 1,
        "econ": 9.0,
        "c": -8,
        "potm": false
      },
      {
        "name": "Narendra Tiwari",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 0,
        "econ": 7.0,
        "c": -6,
        "potm": false
      },
      {
        "name": "Ravi Kumar",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 1,
        "econ": 4.5,
        "c": -4,
        "potm": false
      },
      {
        "name": "Sandeep Khedekar",
        "rs": 4,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 0,
        "econ": 4.5,
        "c": -5,
        "potm": false
      }
    ]
  },
  "3": {
    "homeTeam": "VPGR",
    "awayTeam": "DesiDabanggs",
    "home": [
      {
        "name": "Abhishek Agarwal",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 1,
        "econ": 3.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Ankush Goel",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": -2,
        "w": 3,
        "econ": -1.0,
        "c": 16,
        "potm": true,
        "note": "\u2605 Player of the Match (3 Wkts, -1.0 Econ)"
      },
      {
        "name": "Sajid Merchant",
        "rs": 28,
        "to": 0,
        "ob": 2.0,
        "rc": 11,
        "w": 2,
        "econ": 5.5,
        "c": 17,
        "potm": false
      },
      {
        "name": "Tejas Shah",
        "rs": 12,
        "to": 0,
        "ob": 2.0,
        "rc": 3,
        "w": 3,
        "econ": 1.5,
        "c": 9,
        "potm": false
      },
      {
        "name": "Manish Jain",
        "rs": 20,
        "to": 0,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Parth Shah",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 8,
        "potm": false
      },
      {
        "name": "Himanshu Kalyani",
        "rs": 26,
        "to": 0,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 16,
        "potm": false
      },
      {
        "name": "Dhaval Bheda",
        "rs": 12,
        "to": 0,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 2,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Preraq Mistry",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 20,
        "w": 0,
        "econ": 10.0,
        "c": -11,
        "potm": false
      },
      {
        "name": "Sandesh Jagtap",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 0,
        "econ": 6.0,
        "c": -5,
        "potm": false
      },
      {
        "name": "Gagandeep Singh",
        "rs": 13,
        "to": 1,
        "ob": 2.0,
        "rc": 16,
        "w": 2,
        "econ": 8.0,
        "c": -3,
        "potm": false
      },
      {
        "name": "Chittaranjan Dey",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 24,
        "w": 0,
        "econ": 12.0,
        "c": -19,
        "potm": false
      },
      {
        "name": "Darshan Mody",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 22,
        "w": 0,
        "econ": 11.0,
        "c": -14,
        "potm": false
      },
      {
        "name": "Narendra Tiwari",
        "rs": 6,
        "to": 1,
        "ob": 2.0,
        "rc": 16,
        "w": 0,
        "econ": 8.0,
        "c": -10,
        "potm": false
      },
      {
        "name": "Ravi Kumar",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 20,
        "w": 0,
        "econ": 10.0,
        "c": -15,
        "potm": false
      },
      {
        "name": "Sandeep Khedekar",
        "rs": 3,
        "to": 1,
        "ob": 2.0,
        "rc": 18,
        "w": 0,
        "econ": 9.0,
        "c": -15,
        "potm": false
      }
    ]
  },
  "4": {
    "homeTeam": "DesiTigers",
    "awayTeam": "DesiTitans",
    "home": [
      {
        "name": "Prateek Nahar",
        "rs": 34,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 2,
        "econ": 7.0,
        "c": 20,
        "potm": true,
        "note": "\u2605 Player of the Match (34 Runs, 2 Wkts)"
      },
      {
        "name": "Kalrav Shah",
        "rs": 21,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 1,
        "econ": 6.0,
        "c": 9,
        "potm": false
      },
      {
        "name": "Harshal Joshi",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 3,
        "econ": 3.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Hemang Shah",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": -1,
        "potm": false
      },
      {
        "name": "Manthan Shah",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": 5,
        "w": 2,
        "econ": 2.5,
        "c": 9,
        "potm": false
      },
      {
        "name": "Gaurav Arora",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 1,
        "econ": 4.5,
        "c": 1,
        "potm": false
      },
      {
        "name": "Taha Shipchandler",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 6,
        "w": 1,
        "econ": 3.0,
        "c": 3,
        "potm": false
      },
      {
        "name": "Rohan Khedekar",
        "rs": 7,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 1,
        "econ": 3.0,
        "c": 1,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Milan Chheda",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 16,
        "w": 1,
        "econ": 8.0,
        "c": -4,
        "potm": false
      },
      {
        "name": "Deepak Thawani",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 19,
        "w": 1,
        "econ": 9.5,
        "c": -9,
        "potm": false
      },
      {
        "name": "Hardik Desai",
        "rs": 11,
        "to": 1,
        "ob": 2.0,
        "rc": 15,
        "w": 1,
        "econ": 7.5,
        "c": -4,
        "potm": false
      },
      {
        "name": "Harsh Ramnani",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 13,
        "w": 1,
        "econ": 6.5,
        "c": -5,
        "potm": false
      },
      {
        "name": "Yash Sisodia",
        "rs": 11,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 1,
        "econ": 6.0,
        "c": -1,
        "potm": false
      },
      {
        "name": "Mayank Agarwal",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 0,
        "econ": 6.0,
        "c": -5,
        "potm": false
      },
      {
        "name": "Prateek Jain",
        "rs": 6,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 0,
        "econ": 4.0,
        "c": -2,
        "potm": false
      },
      {
        "name": "Ronak Jain",
        "rs": 4,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 0,
        "econ": 4.0,
        "c": -4,
        "potm": false
      }
    ]
  },
  "5": {
    "homeTeam": "DesiTigers",
    "awayTeam": "VPGR",
    "home": [
      {
        "name": "Prateek Nahar",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 6,
        "w": 2,
        "econ": 3.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Kalrav Shah",
        "rs": 18,
        "to": 1,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 8,
        "potm": false
      },
      {
        "name": "Harshal Joshi",
        "rs": 16,
        "to": 0,
        "ob": 2.0,
        "rc": 2,
        "w": 3,
        "econ": 1.0,
        "c": 14,
        "potm": false
      },
      {
        "name": "Hemang Shah",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 0,
        "econ": 5.5,
        "c": 1,
        "potm": false
      },
      {
        "name": "Manthan Shah",
        "rs": 16,
        "to": 0,
        "ob": 2.0,
        "rc": 4,
        "w": 3,
        "econ": 2.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Gaurav Arora",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": 1,
        "potm": false
      },
      {
        "name": "Abhishek Agarwal",
        "rs": 19,
        "to": 0,
        "ob": 2.0,
        "rc": 5,
        "w": 2,
        "econ": 2.5,
        "c": 14,
        "potm": true,
        "note": "\u2605 Final Player of the Match (19 Runs, +14 Contribution)"
      },
      {
        "name": "Rohan Khedekar",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 15,
        "w": 0,
        "econ": 7.5,
        "c": -5,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Atul Mishra",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": 18,
        "w": 1,
        "econ": 9.0,
        "c": -4,
        "potm": false
      },
      {
        "name": "Ankush Goel",
        "rs": 12,
        "to": 0,
        "ob": 2.0,
        "rc": 0,
        "w": 3,
        "econ": 0.0,
        "c": 12,
        "potm": false
      },
      {
        "name": "Sajid Merchant",
        "rs": 15,
        "to": 0,
        "ob": 2.0,
        "rc": 9,
        "w": 2,
        "econ": 4.5,
        "c": 6,
        "potm": false
      },
      {
        "name": "Tejas Shah",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 4,
        "w": 2,
        "econ": 2.0,
        "c": 4,
        "potm": false
      },
      {
        "name": "Manish Jain",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 13,
        "w": 1,
        "econ": 6.5,
        "c": -1,
        "potm": false
      },
      {
        "name": "Parth Shah",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 15,
        "w": 0,
        "econ": 7.5,
        "c": -6,
        "potm": false
      },
      {
        "name": "Himanshu Kalyani",
        "rs": 18,
        "to": 0,
        "ob": 2.0,
        "rc": 8,
        "w": 2,
        "econ": 4.0,
        "c": 10,
        "potm": false
      },
      {
        "name": "Dhaval Bheda",
        "rs": 6,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": -5,
        "potm": false
      }
    ]
  },
  "6": {
    "homeTeam": "DesiDabanggs",
    "awayTeam": "DesiTitans",
    "home": [
      {
        "name": "Preraq Mistry",
        "rs": 16,
        "to": 0,
        "ob": 2.0,
        "rc": 8,
        "w": 2,
        "econ": 4.0,
        "c": 8,
        "potm": false
      },
      {
        "name": "Sandesh Jagtap",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 1,
        "econ": 6.0,
        "c": 0,
        "potm": false
      },
      {
        "name": "Gagandeep Singh",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": -8,
        "w": 4,
        "econ": -4.0,
        "c": 22,
        "potm": true,
        "note": "\u2605 3rd Place POTM (4 Wkts, -4.0 Econ, +22 Contribution)"
      },
      {
        "name": "Chittaranjan Dey",
        "rs": 10,
        "to": 1,
        "ob": 2.0,
        "rc": 8,
        "w": 1,
        "econ": 4.0,
        "c": 2,
        "potm": false
      },
      {
        "name": "Darshan Mody",
        "rs": 14,
        "to": 0,
        "ob": 2.0,
        "rc": 10,
        "w": 1,
        "econ": 5.0,
        "c": 4,
        "potm": false
      },
      {
        "name": "Narendra Tiwari",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": 1,
        "potm": false
      },
      {
        "name": "Ravi Kumar",
        "rs": 9,
        "to": 0,
        "ob": 2.0,
        "rc": 13,
        "w": 1,
        "econ": 6.5,
        "c": -4,
        "potm": false
      },
      {
        "name": "Sandeep Khedekar",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 0,
        "econ": 7.0,
        "c": -7,
        "potm": false
      }
    ],
    "away": [
      {
        "name": "Milan Chheda",
        "rs": 13,
        "to": 0,
        "ob": 2.0,
        "rc": 14,
        "w": 1,
        "econ": 7.0,
        "c": -1,
        "potm": false
      },
      {
        "name": "Deepak Thawani",
        "rs": 11,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 1,
        "econ": 7.0,
        "c": -3,
        "potm": false
      },
      {
        "name": "Hardik Desai",
        "rs": 12,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": 1,
        "potm": false
      },
      {
        "name": "Harsh Ramnani",
        "rs": 9,
        "to": 1,
        "ob": 2.0,
        "rc": 11,
        "w": 1,
        "econ": 5.5,
        "c": -2,
        "potm": false
      },
      {
        "name": "Yash Sisodia",
        "rs": 11,
        "to": 1,
        "ob": 2.0,
        "rc": 14,
        "w": 1,
        "econ": 7.0,
        "c": -3,
        "potm": false
      },
      {
        "name": "Mayank Agarwal",
        "rs": 7,
        "to": 1,
        "ob": 2.0,
        "rc": 12,
        "w": 0,
        "econ": 6.0,
        "c": -5,
        "potm": false
      },
      {
        "name": "Prateek Jain",
        "rs": 8,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 1,
        "econ": 4.5,
        "c": -1,
        "potm": false
      },
      {
        "name": "Ronak Jain",
        "rs": 5,
        "to": 1,
        "ob": 2.0,
        "rc": 9,
        "w": 0,
        "econ": 4.5,
        "c": -4,
        "potm": false
      }
    ]
  }
};

export async function seedTournament1Stats() {
  console.log("Seeding complete authentic 16-player stats for Tournament 1 matches (1-6)...");

  for (const [matchIdStr, mData] of Object.entries(ALL_MATCH_STATS)) {
    const matchId = parseInt(matchIdStr, 10);
    const homeTeam = await prisma.team.findUnique({ where: { name: mData.homeTeam } });
    const awayTeam = await prisma.team.findUnique({ where: { name: mData.awayTeam } });

    if (!homeTeam || !awayTeam) {
      console.warn(`Teams not found for Match ${matchId}: ${mData.homeTeam} vs ${mData.awayTeam}`);
      continue;
    }

    // Delete existing stats for this match
    await prisma.playerMatchStat.deleteMany({ where: { matchId } });

    // Home players
    for (const p of mData.home) {
      let player = await prisma.player.findFirst({
        where: {
          OR: [
            { canonicalName: { equals: p.name } },
            { canonicalName: { contains: p.name } },
          ],
        },
      });

      if (!player) {
        player = await prisma.player.create({
          data: {
            canonicalName: p.name,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: "Cover",
          },
        });
      }

      await prisma.playerMatchStat.create({
        data: {
          matchId,
          playerId: player.id,
          teamId: homeTeam.id,
          runsScored: p.rs,
          timesOut: p.to,
          oversBowled: p.ob,
          runsConceded: p.rc,
          wickets: p.w,
          economy: p.econ,
          contribution: p.c,
          isPotm: p.potm,
          performanceNote: p.note || null,
        },
      });

      if (p.potm) {
        await prisma.match.update({
          where: { id: matchId },
          data: { potmPlayerId: player.id },
        });
      }
    }

    // Away players
    for (const p of mData.away) {
      let player = await prisma.player.findFirst({
        where: {
          OR: [
            { canonicalName: { equals: p.name } },
            { canonicalName: { contains: p.name } },
          ],
        },
      });

      if (!player) {
        player = await prisma.player.create({
          data: {
            canonicalName: p.name,
            battingHand: "Right Hand",
            bowlingStyle: "Right Arm Medium",
            fieldingPosition: "Cover",
          },
        });
      }

      await prisma.playerMatchStat.create({
        data: {
          matchId,
          playerId: player.id,
          teamId: awayTeam.id,
          runsScored: p.rs,
          timesOut: p.to,
          oversBowled: p.ob,
          runsConceded: p.rc,
          wickets: p.w,
          economy: p.econ,
          contribution: p.c,
          isPotm: p.potm,
          performanceNote: p.note || null,
        },
      });

      if (p.potm) {
        await prisma.match.update({
          where: { id: matchId },
          data: { potmPlayerId: player.id },
        });
      }
    }
  }

  console.log("Finished seeding all 96 player match stats across Matches 1-6!");
}

if (require.main === module) {
  seedTournament1Stats()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}
