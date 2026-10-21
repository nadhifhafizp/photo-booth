// Curated Gen Z Aesthetic Frame Database (60 frames)
export type FilterType = 'normal' | 'bnw' | 'warm' | 'soft';

export const FILTERS: { id: FilterType; label: string; css: string; canvas: string }[] = [
  { id: 'normal', label: 'Normal', css: 'none', canvas: 'none' },
  { id: 'bnw',    label: 'B&W Noir', css: 'grayscale(100%) contrast(110%)', canvas: 'grayscale(100%) contrast(1.1)' },
  { id: 'warm',   label: 'Warm Tone', css: 'sepia(35%) saturate(125%) brightness(102%)', canvas: 'sepia(35%) saturate(1.25) brightness(1.02)' },
  { id: 'soft',   label: 'Soft Film', css: 'contrast(92%) brightness(108%) saturate(110%)', canvas: 'contrast(0.92) brightness(1.08) saturate(1.1)' },
];

export interface PhotoCoordinate {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
}

export interface FrameTemplate {
  id: number | string;
  name: string;
  category: string;
  width: number;
  height: number;
  totalPhoto: number;
  thumb: string;
  template: string;
  coordinates: PhotoCoordinate[];
  defaultFilter?: FilterType;
  used?: number;
  hasCustomFooter?: boolean;
}

export const REAL_TEMPLATES: FrameTemplate[] = [
  {
    "id": 150,
    "name": "Camera Foto Series (Special Edition)",
    "category": "Newspaper",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_150.webp",
    "template": "/images/frames/template_150.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 27,
        "y": 356,
        "width": 730,
        "height": 458,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 28,
        "y": 833,
        "width": 730,
        "height": 459,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 29,
        "y": 1310,
        "width": 729,
        "height": 459,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 29,
        "y": 1792,
        "width": 729,
        "height": 458,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 6650
  },
  {
    "id": 145,
    "name": "Photo Options (Dark)",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_145.webp",
    "template": "/images/frames/template_145.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 34,
        "y": 52,
        "width": 719,
        "height": 462,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 28,
        "y": 512,
        "width": 720,
        "height": 462,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 31,
        "y": 974,
        "width": 719,
        "height": 463,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 34,
        "y": 1437,
        "width": 719,
        "height": 462,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 6030
  },
  {
    "id": 144,
    "name": "Albums Night Mode",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_144.webp",
    "template": "/images/frames/template_144.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 28,
        "y": 363,
        "width": 729,
        "height": 500,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 26,
        "y": 989,
        "width": 729,
        "height": 500,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 26,
        "y": 1615,
        "width": 729,
        "height": 500,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 3502
  },
  {
    "id": 589,
    "name": "Fotofiti",
    "category": "Vintage",
    "width": 736,
    "height": 1308,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_589.webp",
    "template": "/images/frames/template_589.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 266,
        "y": 457,
        "width": 212,
        "height": 161,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 267,
        "y": 621,
        "width": 211,
        "height": 160,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 267,
        "y": 786,
        "width": 211,
        "height": 160,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 264,
        "y": 946,
        "width": 216,
        "height": 164,
        "rotate": 0
      }
    ],
    "defaultFilter": "warm",
    "used": 2856
  },
  {
    "id": 361,
    "name": "Pinkiesh leopard",
    "category": "Cute",
    "width": 707,
    "height": 2000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_361.webp",
    "template": "/images/frames/template_361.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 32,
        "y": 96,
        "width": 642,
        "height": 367,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 32,
        "y": 510,
        "width": 642,
        "height": 367,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 32,
        "y": 924,
        "width": 642,
        "height": 367,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 32,
        "y": 1342,
        "width": 642,
        "height": 366,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 2574
  },
  {
    "id": 147,
    "name": "Breaking News Coming Soon",
    "category": "Newspaper",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_147.webp",
    "template": "/images/frames/template_147.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 28,
        "y": 459,
        "width": 726,
        "height": 413,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 28,
        "y": 898,
        "width": 726,
        "height": 413,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 28,
        "y": 1337,
        "width": 726,
        "height": 414,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 28,
        "y": 1777,
        "width": 726,
        "height": 413,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 2333
  },
  {
    "id": 1477,
    "name": "Monyet Lucu",
    "category": "Cute",
    "width": 735,
    "height": 919,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1477.webp",
    "template": "/images/frames/template_1477.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 377,
        "y": 9,
        "width": 340,
        "height": 229,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 377,
        "y": 241,
        "width": 340,
        "height": 229,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 379,
        "y": 469,
        "width": 340,
        "height": 229,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 381,
        "y": 696,
        "width": 340,
        "height": 229,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 2219
  },
  {
    "id": 292,
    "name": "Rawrrrr Leopard",
    "category": "Aesthetic",
    "width": 1875,
    "height": 5625,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_292.webp",
    "template": "/images/frames/template_292.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 187,
        "y": 433,
        "width": 1500,
        "height": 1136,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 187,
        "y": 1646,
        "width": 1500,
        "height": 1136,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 187,
        "y": 2852,
        "width": 1500,
        "height": 1135,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 187,
        "y": 4055,
        "width": 1500,
        "height": 1136,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 1968
  },
  {
    "id": 616,
    "name": "Pink Leopard Print",
    "category": "Y2K",
    "width": 1061,
    "height": 3000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_616.webp",
    "template": "/images/frames/template_616.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 74,
        "y": 95,
        "width": 912,
        "height": 593,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 73,
        "y": 731,
        "width": 913,
        "height": 593,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 73,
        "y": 1366,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 74,
        "y": 2001,
        "width": 912,
        "height": 592,
        "rotate": 0
      }
    ],
    "defaultFilter": "warm",
    "used": 1776
  },
  {
    "id": 146,
    "name": "Camera Ready",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_146.webp",
    "template": "/images/frames/template_146.webp",
    "coordinates": [
      {
        "id": 1,
        "x": -10,
        "y": 73,
        "width": 807,
        "height": 539,
        "rotate": 0
      },
      {
        "id": 2,
        "x": -10,
        "y": 603,
        "width": 807,
        "height": 514,
        "rotate": 0
      },
      {
        "id": 3,
        "x": -11,
        "y": 1106,
        "width": 809,
        "height": 513,
        "rotate": 0
      },
      {
        "id": 4,
        "x": -8,
        "y": 1608,
        "width": 809,
        "height": 506,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 1570
  },
  {
    "id": 321,
    "name": "Denim Patch Photobox",
    "category": "Aesthetic",
    "width": 600,
    "height": 1800,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_321.webp",
    "template": "/images/frames/template_321.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 65,
        "y": 350,
        "width": 473,
        "height": 317,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 65,
        "y": 704,
        "width": 473,
        "height": 316,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 65,
        "y": 1058,
        "width": 473,
        "height": 316,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 63,
        "y": 1412,
        "width": 473,
        "height": 316,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 1530
  },
  {
    "id": 154,
    "name": "THE 1975 ABOUT YOU",
    "category": "Music",
    "width": 736,
    "height": 952,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_154.webp",
    "template": "/images/frames/template_154.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 50,
        "y": 192,
        "width": 316,
        "height": 388,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 357,
        "y": 569,
        "width": 328,
        "height": 327,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 50,
        "y": 700,
        "width": 316,
        "height": 196,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 1508
  },
  {
    "id": 451,
    "name": "Cortis",
    "category": "Modern",
    "width": 736,
    "height": 1308,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_451.webp",
    "template": "/images/frames/template_451.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 195,
        "y": 466,
        "width": 280,
        "height": 273,
        "rotate": 6.061788788728645
      },
      {
        "id": 2,
        "x": 168,
        "y": 736,
        "width": 276,
        "height": 268,
        "rotate": 6.027530295521261
      },
      {
        "id": 3,
        "x": 139,
        "y": 1007,
        "width": 277,
        "height": 270,
        "rotate": 6.023993082319618
      }
    ],
    "defaultFilter": "normal",
    "used": 1505
  },
  {
    "id": 153,
    "name": "Plain White",
    "category": "Modern",
    "width": 591,
    "height": 1772,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_153.webp",
    "template": "/images/frames/template_153.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 17,
        "y": 259,
        "width": 556,
        "height": 357,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 17,
        "y": 628,
        "width": 556,
        "height": 358,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 17,
        "y": 998,
        "width": 556,
        "height": 357,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 17,
        "y": 1366,
        "width": 556,
        "height": 358,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 1359
  },
  {
    "id": 136,
    "name": "Wanna Be Yours",
    "category": "Cute",
    "width": 1575,
    "height": 4725,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_136.webp",
    "template": "/images/frames/template_136.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 244,
        "y": 321,
        "width": 972,
        "height": 716,
        "rotate": 6.208146395224547
      },
      {
        "id": 2,
        "x": 197,
        "y": 1779,
        "width": 942,
        "height": 721,
        "rotate": -5.902656604894842
      },
      {
        "id": 3,
        "x": 245,
        "y": 3077,
        "width": 951,
        "height": 716,
        "rotate": 6.410840020232448
      }
    ],
    "defaultFilter": "soft",
    "used": 1292
  },
  {
    "id": 148,
    "name": "Camera Arena Photostrip",
    "category": "Newspaper",
    "width": 1050,
    "height": 3150,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_148.webp",
    "template": "/images/frames/template_148.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 60,
        "y": 555,
        "width": 918,
        "height": 716,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 60,
        "y": 1307,
        "width": 918,
        "height": 716,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 60,
        "y": 2060,
        "width": 918,
        "height": 715,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 1266
  },
  {
    "id": 1558,
    "name": "Jeans",
    "category": "Cute",
    "width": 1845,
    "height": 5536,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1558.webp",
    "template": "/images/frames/template_1558.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 380,
        "y": 380,
        "width": 1406,
        "height": 1038,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 390,
        "y": 1707,
        "width": 1349,
        "height": 1033,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 385,
        "y": 3043,
        "width": 1372,
        "height": 1085,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 371,
        "y": 4378,
        "width": 1410,
        "height": 1071,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 1215
  },
  {
    "id": 80,
    "name": "Good Vibes Scrapbook Memories",
    "category": "Scrapbook",
    "width": 1575,
    "height": 4725,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_80.webp",
    "template": "/images/frames/template_80.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 139,
        "y": 251,
        "width": 1326,
        "height": 906,
        "rotate": 351.395084213725
      },
      {
        "id": 2,
        "x": 251,
        "y": 1329,
        "width": 1245,
        "height": 858,
        "rotate": 4.139903506636346
      },
      {
        "id": 3,
        "x": 138,
        "y": 2612,
        "width": 1217,
        "height": 848,
        "rotate": -9.444556075412654
      },
      {
        "id": 4,
        "x": 275,
        "y": 3485,
        "width": 1244,
        "height": 855,
        "rotate": 6.727935926723125
      }
    ],
    "defaultFilter": "normal",
    "used": 1172
  },
  {
    "id": 344,
    "name": "Leopard",
    "category": "Y2K",
    "width": 600,
    "height": 1800,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_344.webp",
    "template": "/images/frames/template_344.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 57,
        "y": 115,
        "width": 490,
        "height": 334,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 33,
        "y": 461,
        "width": 519,
        "height": 320,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 24,
        "y": 826,
        "width": 538,
        "height": 334,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 31,
        "y": 1199,
        "width": 548,
        "height": 332,
        "rotate": 0
      }
    ],
    "defaultFilter": "warm",
    "used": 1138
  },
  {
    "id": 325,
    "name": "Snoopy",
    "category": "Cute",
    "width": 736,
    "height": 1308,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_325.webp",
    "template": "/images/frames/template_325.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 50,
        "y": 88,
        "width": 308,
        "height": 300,
        "rotate": -2.290610042638521
      },
      {
        "id": 2,
        "x": 391,
        "y": 427,
        "width": 305,
        "height": 293,
        "rotate": 357.919433437447
      },
      {
        "id": 3,
        "x": 403,
        "y": 855,
        "width": 307,
        "height": 297,
        "rotate": 4.2973866639417
      },
      {
        "id": 4,
        "x": 8,
        "y": 534,
        "width": 316,
        "height": 316,
        "rotate": 352.47011884688686
      }
    ],
    "defaultFilter": "soft",
    "used": 1021
  },
  {
    "id": 617,
    "name": "Pink & Black Polkadot",
    "category": "Cute",
    "width": 1061,
    "height": 3000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_617.webp",
    "template": "/images/frames/template_617.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 73,
        "y": 95,
        "width": 913,
        "height": 594,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 73,
        "y": 731,
        "width": 913,
        "height": 593,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 73,
        "y": 1366,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 73,
        "y": 2001,
        "width": 913,
        "height": 592,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 1018
  },
  {
    "id": 107,
    "name": "Every Possibility Sweet Denim Memories",
    "category": "Aesthetic",
    "width": 1050,
    "height": 3150,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_107.webp",
    "template": "/images/frames/template_107.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 170,
        "y": 182,
        "width": 754,
        "height": 466,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 120,
        "y": 886,
        "width": 756,
        "height": 470,
        "rotate": -4.969740728110298
      },
      {
        "id": 3,
        "x": 152,
        "y": 1687,
        "width": 756,
        "height": 470,
        "rotate": -5.000644597558433
      },
      {
        "id": 4,
        "x": 141,
        "y": 2328,
        "width": 754,
        "height": 467,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 931
  },
  {
    "id": 132,
    "name": "Wave to Earth",
    "category": "Music",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_132.webp",
    "template": "/images/frames/template_132.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 106,
        "y": 198,
        "width": 583,
        "height": 500,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 105,
        "y": 711,
        "width": 583,
        "height": 500,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 108,
        "y": 1225,
        "width": 583,
        "height": 500,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 860
  },
  {
    "id": 105,
    "name": "Sunshine Blue Hour Cozy Console",
    "category": "Aesthetic",
    "width": 1575,
    "height": 4725,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_105.webp",
    "template": "/images/frames/template_105.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 249,
        "y": 209,
        "width": 1335,
        "height": 944,
        "rotate": 0
      },
      {
        "id": 2,
        "x": -95,
        "y": 1427,
        "width": 1220,
        "height": 882,
        "rotate": 355.96104603003164
      },
      {
        "id": 3,
        "x": -27,
        "y": 2284,
        "width": 1320,
        "height": 887,
        "rotate": 7.780027871954439
      },
      {
        "id": 4,
        "x": 71,
        "y": 3591,
        "width": 1442,
        "height": 819,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 818
  },
  {
    "id": 630,
    "name": "Receipt",
    "category": "Modern",
    "width": 1061,
    "height": 3000,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_630.webp",
    "template": "/images/frames/template_630.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 74,
        "y": 726,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 74,
        "y": 1361,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 74,
        "y": 1995,
        "width": 913,
        "height": 593,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 798
  },
  {
    "id": 1306,
    "name": "Newspaper",
    "category": "Newspaper",
    "width": 736,
    "height": 1104,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1306.webp",
    "template": "/images/frames/template_1306.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 41,
        "y": 335,
        "width": 334,
        "height": 309,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 360,
        "y": 335,
        "width": 334,
        "height": 309,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 41,
        "y": 636,
        "width": 334,
        "height": 310,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 360,
        "y": 636,
        "width": 334,
        "height": 310,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 781
  },
  {
    "id": 1133,
    "name": "Polkadot",
    "category": "Aesthetic",
    "width": 736,
    "height": 1308,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_1133.webp",
    "template": "/images/frames/template_1133.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 39,
        "y": 119,
        "width": 646,
        "height": 313,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 40,
        "y": 473,
        "width": 646,
        "height": 313,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 43,
        "y": 829,
        "width": 648,
        "height": 313,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 736
  },
  {
    "id": 133,
    "name": "Last Night on Earth",
    "category": "Music",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_133.webp",
    "template": "/images/frames/template_133.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 101,
        "y": 205,
        "width": 597,
        "height": 512,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 101,
        "y": 719,
        "width": 597,
        "height": 511,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 101,
        "y": 1233,
        "width": 599,
        "height": 513,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 707
  },
  {
    "id": 143,
    "name": "Dark Photo Picker",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_143.webp",
    "template": "/images/frames/template_143.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 35,
        "y": 35,
        "width": 597,
        "height": 563,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 35,
        "y": 606,
        "width": 597,
        "height": 563,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 35,
        "y": 1177,
        "width": 597,
        "height": 563,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 35,
        "y": 1748,
        "width": 597,
        "height": 563,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 689
  },
  {
    "id": 543,
    "name": "Vintage",
    "category": "Aesthetic",
    "width": 800,
    "height": 2400,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_543.webp",
    "template": "/images/frames/template_543.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 94,
        "y": 202,
        "width": 602,
        "height": 432,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 110,
        "y": 916,
        "width": 602,
        "height": 431,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 109,
        "y": 1646,
        "width": 602,
        "height": 432,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 648
  },
  {
    "id": 651,
    "name": "Pink Plaid",
    "category": "Cute",
    "width": 1061,
    "height": 3000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_651.webp",
    "template": "/images/frames/template_651.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 74,
        "y": 96,
        "width": 912,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 74,
        "y": 731,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 74,
        "y": 1366,
        "width": 913,
        "height": 592,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 74,
        "y": 2001,
        "width": 913,
        "height": 592,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 613
  },
  {
    "id": 324,
    "name": "Blue",
    "category": "Aesthetic",
    "width": 591,
    "height": 1772,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_324.webp",
    "template": "/images/frames/template_324.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 12,
        "y": 40,
        "width": 456,
        "height": 346,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 105,
        "y": 437,
        "width": 459,
        "height": 347,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 12,
        "y": 834,
        "width": 461,
        "height": 348,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 103,
        "y": 1232,
        "width": 461,
        "height": 356,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 570
  },
  {
    "id": 432,
    "name": "Dark romance",
    "category": "Scrapbook",
    "width": 736,
    "height": 1308,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_432.webp",
    "template": "/images/frames/template_432.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 193,
        "y": 182,
        "width": 317,
        "height": 318,
        "rotate": -6
      },
      {
        "id": 2,
        "x": 391,
        "y": 479,
        "width": 287,
        "height": 287,
        "rotate": 14
      },
      {
        "id": 3,
        "x": 215,
        "y": 849,
        "width": 292,
        "height": 292,
        "rotate": -1
      }
    ],
    "defaultFilter": "normal",
    "used": 569
  },
  {
    "id": 134,
    "name": "Blue Jeans",
    "category": "Music",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_134.webp",
    "template": "/images/frames/template_134.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 85,
        "y": 194,
        "width": 603,
        "height": 518,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 85,
        "y": 712,
        "width": 602,
        "height": 517,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 85,
        "y": 1238,
        "width": 602,
        "height": 516,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 525
  },
  {
    "id": 306,
    "name": "Newspaper Koran DIENG PLATEAU",
    "category": "Newspaper",
    "width": 1614,
    "height": 2283,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_306.webp",
    "template": "/images/frames/template_306.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 61,
        "y": 559,
        "width": 1487,
        "height": 875,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 65,
        "y": 1826,
        "width": 483,
        "height": 311,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 561,
        "y": 1826,
        "width": 483,
        "height": 311,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 1057,
        "y": 1826,
        "width": 483,
        "height": 311,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 520
  },
  {
    "id": 873,
    "name": "Camera",
    "category": "Vintage",
    "width": 736,
    "height": 1308,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_873.webp",
    "template": "/images/frames/template_873.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 255,
        "y": 397,
        "width": 241,
        "height": 179,
        "rotate": 2.0879838327233444
      },
      {
        "id": 2,
        "x": 243,
        "y": 575,
        "width": 244,
        "height": 192,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 241,
        "y": 759,
        "width": 241,
        "height": 185,
        "rotate": 2.035034456859895
      },
      {
        "id": 4,
        "x": 235,
        "y": 943,
        "width": 241,
        "height": 185,
        "rotate": 2.060111023723124
      }
    ],
    "defaultFilter": "warm",
    "used": 503
  },
  {
    "id": 142,
    "name": "Albums Moment",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_142.webp",
    "template": "/images/frames/template_142.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 31,
        "y": 327,
        "width": 720,
        "height": 476,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 31,
        "y": 799,
        "width": 720,
        "height": 476,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 31,
        "y": 1271,
        "width": 720,
        "height": 476,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 31,
        "y": 1743,
        "width": 720,
        "height": 476,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 481
  },
  {
    "id": 149,
    "name": "Breaking News Special Edition",
    "category": "Newspaper",
    "width": 788,
    "height": 2363,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_149.webp",
    "template": "/images/frames/template_149.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 42,
        "y": 267,
        "width": 695,
        "height": 475,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 42,
        "y": 761,
        "width": 695,
        "height": 475,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 42,
        "y": 1254,
        "width": 695,
        "height": 475,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 42,
        "y": 1748,
        "width": 695,
        "height": 475,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 477
  },
  {
    "id": 366,
    "name": "Red",
    "category": "Aesthetic",
    "width": 707,
    "height": 2000,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_366.webp",
    "template": "/images/frames/template_366.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 49,
        "y": 483,
        "width": 569,
        "height": 361,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 97,
        "y": 842,
        "width": 532,
        "height": 325,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 62,
        "y": 1184,
        "width": 578,
        "height": 342,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 464
  },
  {
    "id": 897,
    "name": "Hold My Hand",
    "category": "Y2K",
    "width": 667,
    "height": 2000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_897.webp",
    "template": "/images/frames/template_897.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 30,
        "y": 191,
        "width": 598,
        "height": 359,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 33,
        "y": 568,
        "width": 599,
        "height": 359,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 33,
        "y": 929,
        "width": 599,
        "height": 359,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 33,
        "y": 1291,
        "width": 599,
        "height": 359,
        "rotate": 0
      }
    ],
    "defaultFilter": "warm",
    "used": 461
  },
  {
    "id": 1302,
    "name": "Memories",
    "category": "Scrapbook",
    "width": 736,
    "height": 1308,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1302.webp",
    "template": "/images/frames/template_1302.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 197,
        "y": 51,
        "width": 376,
        "height": 260,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 194,
        "y": 312,
        "width": 383,
        "height": 259,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 197,
        "y": 573,
        "width": 375,
        "height": 278,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 200,
        "y": 845,
        "width": 373,
        "height": 259,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 434
  },
  {
    "id": 1221,
    "name": "VVBP Hirono",
    "category": "Modern",
    "width": 1807,
    "height": 5386,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_1221.webp",
    "template": "/images/frames/template_1221.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 330,
        "y": 504,
        "width": 1099,
        "height": 831,
        "rotate": 5.289066725759614
      },
      {
        "id": 2,
        "x": 235,
        "y": 2136,
        "width": 1094,
        "height": 836,
        "rotate": -2.6025622024998065
      },
      {
        "id": 3,
        "x": 213,
        "y": 3521,
        "width": 1100,
        "height": 830,
        "rotate": 6.654425046006596
      }
    ],
    "defaultFilter": "normal",
    "used": 424
  },
  {
    "id": 309,
    "name": "Potret kebersamaan",
    "category": "Y2K",
    "width": 934,
    "height": 1400,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_309.webp",
    "template": "/images/frames/template_309.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 16,
        "y": 463,
        "width": 901,
        "height": 409,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 347,
        "y": 900,
        "width": 239,
        "height": 183,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 16,
        "y": 1079,
        "width": 306,
        "height": 283,
        "rotate": 0
      }
    ],
    "defaultFilter": "warm",
    "used": 420
  },
  {
    "id": 1420,
    "name": "Do i wanna know",
    "category": "Music",
    "width": 736,
    "height": 1308,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_1420.webp",
    "template": "/images/frames/template_1420.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 267,
        "y": 254,
        "width": 242,
        "height": 276,
        "rotate": 2.0385281143795213
      },
      {
        "id": 2,
        "x": 252,
        "y": 545,
        "width": 239,
        "height": 270,
        "rotate": 2.743106801923823
      },
      {
        "id": 3,
        "x": 244,
        "y": 839,
        "width": 241,
        "height": 269,
        "rotate": 2.055221188615857
      }
    ],
    "defaultFilter": "bnw",
    "used": 416
  },
  {
    "id": 655,
    "name": "Full of Stars",
    "category": "Cute",
    "width": 3033,
    "height": 1914,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_655.webp",
    "template": "/images/frames/template_655.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 28,
        "y": 29,
        "width": 1478,
        "height": 776,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 1526,
        "y": 29,
        "width": 1479,
        "height": 776,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 28,
        "y": 826,
        "width": 1478,
        "height": 777,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 1526,
        "y": 826,
        "width": 1479,
        "height": 777,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 409
  },
  {
    "id": 140,
    "name": "Super React Moment",
    "category": "Modern",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_140.webp",
    "template": "/images/frames/template_140.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 35,
        "y": 197,
        "width": 712,
        "height": 554,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 35,
        "y": 759,
        "width": 712,
        "height": 555,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 35,
        "y": 1322,
        "width": 712,
        "height": 555,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 407
  },
  {
    "id": 629,
    "name": "Pink Stripes",
    "category": "Cute",
    "width": 707,
    "height": 2000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_629.webp",
    "template": "/images/frames/template_629.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 46,
        "y": 61,
        "width": 615,
        "height": 401,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 46,
        "y": 484,
        "width": 614,
        "height": 401,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 46,
        "y": 907,
        "width": 615,
        "height": 401,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 46,
        "y": 1330,
        "width": 614,
        "height": 402,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 401
  },
  {
    "id": 1640,
    "name": "Momen Meow (Luxury Edition)",
    "category": "Cute",
    "width": 338,
    "height": 1024,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1640.webp",
    "template": "/images/frames/template_1640.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 58,
        "y": 117,
        "width": 221,
        "height": 172,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 58,
        "y": 337,
        "width": 221,
        "height": 171,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 58,
        "y": 532,
        "width": 221,
        "height": 169,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 58,
        "y": 747,
        "width": 221,
        "height": 170,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 393
  },
  {
    "id": 242,
    "name": "Miaww",
    "category": "Cute",
    "width": 591,
    "height": 1772,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_242.webp",
    "template": "/images/frames/template_242.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 58,
        "y": 68,
        "width": 474,
        "height": 411,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 58,
        "y": 551,
        "width": 474,
        "height": 411,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 58,
        "y": 1034,
        "width": 474,
        "height": 411,
        "rotate": 0
      }
    ],
    "defaultFilter": "soft",
    "used": 358
  },
  {
    "id": 727,
    "name": "Tiktok streak day (1)",
    "category": "Newspaper",
    "width": 1066,
    "height": 1600,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_727.webp",
    "template": "/images/frames/template_727.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 397,
        "y": 528,
        "width": 649,
        "height": 495,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 23,
        "y": 1087,
        "width": 331,
        "height": 315,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 714,
        "y": 1087,
        "width": 331,
        "height": 315,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 355
  },
  {
    "id": 116,
    "name": "Made of Memories Starry Night",
    "category": "Aesthetic",
    "width": 1575,
    "height": 4725,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_116.webp",
    "template": "/images/frames/template_116.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 303,
        "y": 346,
        "width": 944,
        "height": 829,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 303,
        "y": 1201,
        "width": 944,
        "height": 830,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 303,
        "y": 2050,
        "width": 944,
        "height": 836,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 303,
        "y": 2905,
        "width": 944,
        "height": 835,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 352
  },
  {
    "id": 131,
    "name": "Forever in Me",
    "category": "Music",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_131.webp",
    "template": "/images/frames/template_131.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 97,
        "y": 185,
        "width": 603,
        "height": 515,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 97,
        "y": 706,
        "width": 603,
        "height": 514,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 97,
        "y": 1224,
        "width": 603,
        "height": 514,
        "rotate": 0
      }
    ],
    "defaultFilter": "bnw",
    "used": 343
  },
  {
    "id": 390,
    "name": "Roemah Kedua",
    "category": "Modern",
    "width": 1698,
    "height": 5094,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_390.webp",
    "template": "/images/frames/template_390.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 191,
        "y": 159,
        "width": 1315,
        "height": 955,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 190,
        "y": 1257,
        "width": 1316,
        "height": 955,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 191,
        "y": 2354,
        "width": 1315,
        "height": 955,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 191,
        "y": 3447,
        "width": 1315,
        "height": 955,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 342
  },
  {
    "id": 564,
    "name": "Lotus",
    "category": "Aesthetic",
    "width": 788,
    "height": 2363,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_564.webp",
    "template": "/images/frames/template_564.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 69,
        "y": 223,
        "width": 649,
        "height": 493,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 69,
        "y": 807,
        "width": 649,
        "height": 494,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 69,
        "y": 1392,
        "width": 649,
        "height": 493,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 336
  },
  {
    "id": 365,
    "name": "Beach",
    "category": "Aesthetic",
    "width": 707,
    "height": 2000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_365.webp",
    "template": "/images/frames/template_365.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 32,
        "y": 129,
        "width": 642,
        "height": 366,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 32,
        "y": 562,
        "width": 642,
        "height": 367,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 40,
        "y": 996,
        "width": 643,
        "height": 367,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 32,
        "y": 1430,
        "width": 642,
        "height": 366,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 336
  },
  {
    "id": 304,
    "name": "Newspaper Koran Heritage City",
    "category": "Aesthetic",
    "width": 2400,
    "height": 3600,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_304.webp",
    "template": "/images/frames/template_304.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 127,
        "y": 603,
        "width": 1059,
        "height": 747,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 1213,
        "y": 1681,
        "width": 1058,
        "height": 817,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 128,
        "y": 2641,
        "width": 1058,
        "height": 746,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 335
  },
  {
    "id": 1444,
    "name": "Pink matcha",
    "category": "Cute",
    "width": 736,
    "height": 1308,
    "totalPhoto": 3,
    "thumb": "/images/frames/thumb_1444.webp",
    "template": "/images/frames/template_1444.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 34,
        "y": 95,
        "width": 472,
        "height": 337,
        "rotate": -8.250387228905499
      },
      {
        "id": 2,
        "x": 270,
        "y": 391,
        "width": 483,
        "height": 352,
        "rotate": 15.24299774290158
      },
      {
        "id": 3,
        "x": 29,
        "y": 924,
        "width": 490,
        "height": 344,
        "rotate": -10.661939976606016
      }
    ],
    "defaultFilter": "soft",
    "used": 307
  },
  {
    "id": 1480,
    "name": "Wow",
    "category": "Scrapbook",
    "width": 864,
    "height": 1536,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_1480.webp",
    "template": "/images/frames/template_1480.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 156,
        "y": 323,
        "width": 256,
        "height": 354,
        "rotate": 7.7021990199831425
      },
      {
        "id": 2,
        "x": 454,
        "y": 64,
        "width": 259,
        "height": 263,
        "rotate": 357.44331095032516
      },
      {
        "id": 3,
        "x": 455,
        "y": 556,
        "width": 263,
        "height": 362,
        "rotate": 345.3449729681861
      },
      {
        "id": 4,
        "x": 391,
        "y": 988,
        "width": 303,
        "height": 223,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 306
  },
  {
    "id": 368,
    "name": "Strawberryapple",
    "category": "Aesthetic",
    "width": 707,
    "height": 2000,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_368.webp",
    "template": "/images/frames/template_368.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 228,
        "y": 184,
        "width": 264,
        "height": 208,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 217,
        "y": 701,
        "width": 264,
        "height": 207,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 214,
        "y": 1133,
        "width": 268,
        "height": 210,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 233,
        "y": 1643,
        "width": 261,
        "height": 205,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 305
  },
  {
    "id": 457,
    "name": "Haflah Takharruj",
    "category": "Modern",
    "width": 1183,
    "height": 3546,
    "totalPhoto": 4,
    "thumb": "/images/frames/thumb_457.webp",
    "template": "/images/frames/template_457.webp",
    "coordinates": [
      {
        "id": 1,
        "x": 169,
        "y": 552,
        "width": 844,
        "height": 580,
        "rotate": 0
      },
      {
        "id": 2,
        "x": 169,
        "y": 1152,
        "width": 844,
        "height": 581,
        "rotate": 0
      },
      {
        "id": 3,
        "x": 169,
        "y": 1753,
        "width": 844,
        "height": 581,
        "rotate": 0
      },
      {
        "id": 4,
        "x": 169,
        "y": 2354,
        "width": 844,
        "height": 580,
        "rotate": 0
      }
    ],
    "defaultFilter": "normal",
    "used": 301
  }
];
