const odTable = {
  0.5: 21.3,
  0.75: 26.7,
  1: 33.4,
  1.5: 48.3,
  2: 60.3,
  3: 88.9,
  4: 114.3,
  5: 141.3,
  6: 168.3,
  8: 219.1,
  10: 273.1,
  12: 323.9,
  14: 355.6,
  16: 406.4,
  18: 457.0,
  20: 508.0,
  22: 559.0,
  24: 610.0,
  26: 660.4,
  28: 711.2,
  30: 762.0,
  32: 812.8,
  34: 863.6,
  36: 914.4,
  38: 965.2,
  40: 1016.0,
  42: 1066.8,
  44: 1117.6,
  46: 1168.4,
  48: 1219.2,
};

const manualSizeExclusions = new Set([1.25, 2.5, 3.5, 5]);

const rawSteelByYear = {
  2021: 64.75,
  2022: 70.9,
  2023: 57.4,
  2024: 52.2,
  2025: 55.05,
  2026: 56.5,
};

const coatingFactors = {
  Yes: { median: 2.3, p90: 3.8, source: "Coated pipe factor" },
  No: { median: 1.8, p90: 2.7, source: "Non-coated pipe factor" },
};

const bomGroupDefinitions = [
  { name: "Pipe Group", keywords: ["pipe", "nipple"] },
  {
    name: "Fitting Group",
    keywords: [
      "elbow 90",
      "elbow 45",
      "elbow",
      "red tee",
      "equal tee",
      "tee",
      "con reducer",
      "con. reducer",
      "ecc reducer",
      "ecc. reducer",
      "reducer",
      "swage conc",
      "swage.conc",
      "cap",
      "cplng full",
      "cplng half",
      "cplng red",
      "coupling",
    ],
  },
  {
    name: "Flange Group",
    keywords: ["s.w. flange", "sw flange", "w.n. flange", "wn flange", "blind flange", "flange", "flng.fig.8", "fig.8", "spcr", "bln"],
  },
  {
    name: "Valves Group",
    keywords: ["gate valve", "globe valve", "check valve", "ball valve", "plug valve", "butterfly valve", "valve"],
  },
  { name: "Bolt Group", keywords: ["stud with nuts", "stud", "bolt"] },
  { name: "Gasket Group", keywords: ["gasket"] },
  { name: "Trap/Strainer Group", keywords: ["trap steam", "trap", "strainer temp", "strainer perm", "strainer"] },
  { name: "Other Group", keywords: [] },
];

const componentAliasMap = [
  {
    standardCode: "FIGURE_8_FLANGE",
    standardName: "Figure 8 Flange",
    group: "Flange Group",
    aliases: ["FIGURE-8", "FIGURE 8", "FIG.8 FL", "FIG 8 FL", "FIG.8 FLANGE", "FIG 8 FLANGE"],
  },
  {
    standardCode: "EQUAL_TEE",
    standardName: "Equal Tee",
    group: "Fitting Group",
    aliases: ["T.Equal", "Equal Tee", "Equal. T", "Equal .T", "Equal T", "EQ Tee", "EQ. TEE"],
  },
  {
    standardCode: "REDUCING_TEE",
    standardName: "Reducing Tee",
    group: "Fitting Group",
    aliases: ["T.RED", "RED.T", "RED. Tee", "Reducing Tee", "Reduc. Tee", "Reduc. T.", "Reducing T", "Red Tee", "Red. T"],
  },
  {
    standardCode: "WELD_NECK_FLANGE",
    standardName: "Weld Neck Flange",
    group: "Flange Group",
    aliases: ["FLANG WN", "WN Flange", "Weld Neck Flange", "Well neck flange", "WN Flng", "WN FLG", "WNRF", "WN RF"],
  },
  {
    standardCode: "CONCENTRIC_REDUCER",
    standardName: "Concentric Reducer",
    group: "Fitting Group",
    aliases: [
      "CON.RED",
      "CON RED",
      "CON. RED",
      "CONC.RED",
      "CONC RED",
      "CONC. RED",
      "CONCENTRIC RED",
      "CONCENTRIC REDUCER",
      "CONC REDUCER",
      "CON. REDUCER",
      "CON REDUCER",
      "CONC. REDUCER",
      "CONCENTRIC REDU.",
      "CONC. REDU.",
      "CON REDU.",
      "CONCENTRIC REDN",
      "CONC REDN",
      "CON. REDN",
      "CONCENTRIC REDUCING",
      "REDUCER CONC",
      "REDUCER CON.",
      "REDUCER CONCENTRIC",
      "REDUCE CONC",
      "REDUCE CON.",
      "REDUCE CONCENTRIC",
      "REDUCE (CONC.)",
      "REDUC. CONC",
      "REDUC. CON.",
      "REDUCING CONCENTRIC",
      "RED. CONC",
      "RED CONC",
      "RED. CON.",
      "RED CON.",
    ],
  },
  {
    standardCode: "WELDOLET",
    standardName: "Weldolet",
    group: "Fitting Group",
    aliases: ["WELDOLET", "WELD OLET", "WELD-O-LET", "WELDLET"],
  },
];

const dnToNps = {
  15: 0.5,
  20: 0.75,
  25: 1,
  40: 1.5,
  50: 2,
  80: 3,
  100: 4,
  150: 6,
  200: 8,
  250: 10,
  300: 12,
  350: 14,
  400: 16,
  450: 18,
  500: 20,
  550: 22,
  600: 24,
  650: 26,
  700: 28,
  750: 30,
  800: 32,
  850: 34,
  900: 36,
  950: 38,
  1000: 40,
  1050: 42,
  1100: 44,
  1150: 46,
  1200: 48,
};

const scheduleThicknessTable = {
  0.5: { "5S": 1.65, "5": 1.65, "10S": 2.11, "10": 2.11, "40S": 2.77, STD: 2.77, HVY: 3.25, "40": 2.77, "80S": 3.73, XS: 3.73, "80": 3.73, "160": 4.75, XXS: 7.47 },
  0.75: { "5S": 1.65, "5": 1.65, "10S": 2.11, "10": 2.11, "40S": 2.87, STD: 2.87, HVY: 3.25, "40": 2.87, "80S": 3.91, XS: 3.91, "80": 3.91, "160": 5.54, XXS: 7.82 },
  1: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.38, STD: 3.38, HVY: 4.05, "40": 3.38, "80S": 4.55, XS: 4.55, "80": 4.55, "160": 6.35, XXS: 9.09 },
  1.5: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.68, STD: 3.68, HVY: 4.05, "40": 3.68, "80S": 5.08, XS: 5.08, "80": 5.08, "160": 7.14, XXS: 10.16 },
  2: { "5S": 1.65, "5": 1.65, "10S": 2.77, "10": 2.77, "40S": 3.91, STD: 3.91, HVY: 4.47, "40": 3.91, "80S": 5.54, XS: 5.54, "80": 5.54, "160": 8.71, XXS: 11.07 },
  3: { "5S": 2.11, "5": 2.11, "10S": 3.05, "10": 3.05, "40S": 5.49, STD: 5.49, HVY: 4.85, "40": 5.49, "80S": 7.62, XS: 7.62, "80": 7.62, "160": 11.13, XXS: 15.24 },
  4: { "5S": 2.11, "5": 2.11, "10S": 3.05, "10": 3.05, "40S": 6.02, STD: 6.02, HVY: 5.4, "40": 6.02, "80S": 8.56, XS: 8.56, "80": 8.56, "120": 11.13, "160": 13.49, XXS: 17.12 },
  5: { HVY: 5.4 },
  6: { "5S": 2.77, "5": 2.77, "10S": 3.4, "10": 3.4, "40S": 7.11, STD: 7.11, HVY: 5.4, "40": 7.11, "80S": 10.97, XS: 10.97, "80": 10.97, "120": 14.27, "160": 18.24, XXS: 21.95 },
  8: { "5S": 2.77, "5": 2.77, "10S": 3.76, "10": 3.76, "20": 6.35, "30": 7.04, "40S": 8.18, STD: 8.18, "40": 8.18, "60": 10.31, "80S": 12.7, XS: 12.7, "80": 12.7, "100": 15.06, "120": 18.24, "140": 20.62, "160": 23.01, XXS: 22.23 },
  10: { "5S": 3.4, "5": 3.4, "10S": 4.19, "10": 4.19, "20": 6.35, "30": 7.8, "40S": 9.27, STD: 9.27, "40": 9.27, "60": 12.7, "80S": 12.7, XS: 12.7, "80": 15.06, "100": 18.24, "120": 21.41, "140": 25.4, "160": 28.58, XXS: 25.4 },
  12: { "5S": 3.96, "5": 4.19, "10S": 4.57, "10": 4.57, "20": 6.35, "30": 8.38, "40S": 9.53, STD: 9.53, "40": 10.31, "60": 14.27, "80S": 12.7, XS: 12.7, "80": 17.45, "100": 21.41, "120": 25.4, "140": 28.58, "160": 33.32, XXS: 25.4 },
  14: { "5S": 3.96, "10S": 4.78, "10": 6.35, "20": 7.92, "30": 9.53, STD: 9.53, "40": 11.13, XS: 12.7, "60": 15.06, "80": 19.05, "100": 23.8, "120": 27.76, "140": 31.75, "160": 35.71 },
  16: { "5S": 4.19, "10S": 4.78, "10": 6.35, "20": 7.92, "30": 9.53, STD: 9.53, "40": 12.7, XS: 12.7, "60": 16.66, "80": 21.41, "100": 26.19, "120": 30.94, "140": 36.53, "160": 40.46 },
  18: { "5S": 4.19, "10S": 4.78, "10": 6.35, "20": 7.92, STD: 9.53, "30": 11.13, XS: 12.7, "40": 14.27, "60": 19.05, "80": 23.8, "100": 29.36, "120": 34.93, "140": 39.67, "160": 45.24 },
  20: { "5S": 4.78, "10S": 5.54, "10": 6.35, STD: 9.53, "20": 9.35, "30": 12.7, XS: 12.7, "40": 15.06, "60": 20.62, "80": 26.19, "100": 32.54, "120": 38.1, "140": 44.45, "160": 49.99 },
  22: { "5S": 4.78, "10S": 5.54, "10": 6.35, STD: 9.53, "20": 9.35, "30": 12.7, XS: 12.7, "40": 15.88, "60": 22.23, "80": 28.57, "100": 34.92, "120": 41.27, "140": 47.62, "160": 53.97 },
  24: { "5S": 5.54, "10S": 6.35, "10": 6.35, STD: 9.53, "20": 9.35, XS: 12.7, "30": 14.27, "40": 17.45, "60": 24.59, "80": 30.94, "100": 38.89, "120": 46.02, "140": 52.37, "160": 59.51 },
  26: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7 },
  28: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87 },
  30: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87 },
  32: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 17.45 },
  34: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 17.45 },
  36: { "10": 7.92, STD: 9.53, "20": 12.7, XS: 12.7, "30": 15.87, "40": 19.05 },
  38: { STD: 9.53, XS: 12.7 },
  40: { STD: 9.53, XS: 12.7 },
  42: { STD: 9.53, XS: 12.7 },
  44: { STD: 9.53, XS: 12.7 },
  46: { STD: 9.53, XS: 12.7 },
  48: { STD: 9.53, XS: 12.7 },
};

const bomColumnAliases = {
  size: ["size", "nps", "pipesize", "nominalsize", "diameter", "dia"],
  thickness: [
    "thickness",
    "thk",
    "thck",
    "schthckrating",
    "schedulethicknessrating",
    "wallthickness",
    "wallthk",
    "thkmm",
    "thicknessmm",
  ],
  length: ["length", "lengthm", "qty", "quantity", "totalm", "meter", "metre", "m"],
  uom: ["uom", "unitmnos", "unitmnoss", "unitofmeasure", "unit", "uommnos"],
  item: ["items", "item", "itemdescription", "description", "shorttext"],
  coating: ["coating", "coated", "coatingscope", "lining", "pe"],
  spec: ["material", "materials", "materialdescription", "materialspec", "spec", "description", "items"],
  rawOverride: ["rawsteelrskg", "rawsteel", "rawsteelrate", "rawsteelprice"],
  factorOverride: ["estimatefactoroverride", "factoroverride", "factor", "estimatefactor"],
};

const elements = {
  year: document.querySelector("#year"),
  size: document.querySelector("#size"),
  thicknessMode: document.querySelector("#thickness-mode"),
  thicknessLabel: document.querySelector("#thickness-label"),
  thickness: document.querySelector("#thickness"),
  scheduleField: document.querySelector("#schedule-field"),
  schedule: document.querySelector("#schedule"),
  length: document.querySelector("#length"),
  spec: document.querySelector("#spec"),
  materialBasis: document.querySelector("#material-basis"),
  materialGradeFamily: document.querySelector("#material-grade-family"),
  materialStandardOutput: document.querySelector("#material-standard-output"),
  rawMaterialBasisOutput: document.querySelector("#raw-material-basis-output"),
  rawMaterialRangeOutput: document.querySelector("#raw-material-range-output"),
  recommendedRateOutput: document.querySelector("#recommended-rate-output"),
  coating: document.querySelector("#coating"),
  rawOverride: document.querySelector("#raw-override"),
  factorOverride: document.querySelector("#factor-override"),
  factorCsOutput: document.querySelector("#factor-cs-output"),
  addLine: document.querySelector("#add-line-button"),
  themeToggle: document.querySelector("#theme-toggle"),
  print: document.querySelector("#print-button"),
  exportCsv: document.querySelector("#export-csv-button"),
  reset: document.querySelector("#reset-button"),
  sideNav: document.querySelector("#side-nav"),
  sideBrandHome: document.querySelector("#side-brand-home"),
  sideNavToggle: document.querySelector("#side-nav-toggle"),
  sideNavLinks: document.querySelectorAll(".side-nav nav a"),
  bomFile: document.querySelector("#bom-file"),
  bomDropZone: document.querySelector("#bom-drop-zone"),
  bomStatus: document.querySelector("#bom-status"),
  successMessage: document.querySelector("#success-message"),
  reportGenerated: document.querySelector("#report-generated"),
  overrideReviewCard: document.querySelector("#override-review-card"),
  overrideReviewList: document.querySelector("#override-review-list"),
  factorSource: document.querySelector("#factor-source"),
  warning: document.querySelector("#warning"),
  odMm: document.querySelector("#od-mm"),
  weightKgm: document.querySelector("#weight-kgm"),
  totalWeight: document.querySelector("#total-weight"),
  rawSteel: document.querySelector("#raw-steel"),
  medianFactor: document.querySelector("#median-factor"),
  medianRsKg: document.querySelector("#median-rs-kg"),
  medianRsM: document.querySelector("#median-rs-m"),
  medianTotal: document.querySelector("#median-total"),
  p90Factor: document.querySelector("#p90-factor"),
  p90RsKg: document.querySelector("#p90-rs-kg"),
  p90RsM: document.querySelector("#p90-rs-m"),
  p90Total: document.querySelector("#p90-total"),
  lineItemsBody: document.querySelector("#line-items-body"),
  lineCount: document.querySelector("#line-count"),
  categoryCount: document.querySelector("#category-count"),
  categoryLineCheck: document.querySelector("#category-line-check"),
  categoryTables: document.querySelector("#category-tables"),
  sortButtons: document.querySelectorAll(".sort-button"),
  summaryWeight: document.querySelector("#summary-weight"),
  summaryMedian: document.querySelector("#summary-median"),
  summaryP90: document.querySelector("#summary-p90"),
  whatIfBase: document.querySelector("#whatif-base"),
  whatIfLow: document.querySelector("#whatif-low"),
  whatIfHigh: document.querySelector("#whatif-high"),
  whatIfRange: document.querySelector("#whatif-range"),
  whatIfDriver: document.querySelector("#whatif-driver"),
  whatIfChart: document.querySelector("#whatif-chart"),
  whatIfBody: document.querySelector("#whatif-body"),
  whatIfToggles: document.querySelectorAll(".whatif-toggle"),
  whatIfSortButtons: document.querySelectorAll(".whatif-sort-button"),
  bomGroupCount: document.querySelector("#bom-group-count"),
  bomGroupTables: document.querySelector("#bom-group-tables"),
  rawSteelSlider: document.querySelector("#raw-steel-slider"),
  rawSteelSliderValue: document.querySelector("#raw-steel-slider-value"),
  rawSteelSliderRate: document.querySelector("#raw-steel-slider-rate"),
  rawSteelSliderBase: document.querySelector("#raw-steel-slider-base"),
  rawSteelSliderThumb: document.querySelector("#raw-steel-slider-thumb"),
};

const lineItems = [];
const bomGroupItems = [];
let materialSpecificationRows = [];
let materialSpecificationStatus = "loading";
let rawMaterialPriceLibrary = [];
let rawMaterialPriceLibraryStatus = "loading";
let successTimer;
let inputError = "";
let sortState = { key: "", direction: "asc" };
let whatIfSortState = { key: "", direction: "asc" };

function setSideNavCollapsed(isCollapsed) {
  if (!elements.sideNav || !elements.sideNavToggle) return;

  document.body.classList.toggle("side-nav-collapsed", isCollapsed);
  elements.sideNav.setAttribute("aria-hidden", "false");
  elements.sideNavToggle.setAttribute("aria-expanded", String(!isCollapsed));
  elements.sideNavToggle.setAttribute(
    "aria-label",
    isCollapsed ? "Expand section navigation" : "Collapse section navigation"
  );
}

function setActiveSideNavLink(hash) {
  elements.sideNavLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function updateActiveSideNavOnScroll() {
  const sectionLinks = Array.from(elements.sideNavLinks)
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter((item) => item.section);

  const activeItem = sectionLinks
    .filter((item) => item.section.getBoundingClientRect().top <= 140)
    .pop() || sectionLinks[0];

  if (activeItem) setActiveSideNavLink(activeItem.link.getAttribute("href"));
}

const builtInMaterialSpecificationRows = [
  {
    id: "MS-001",
    basic_material_of_construction: "Carbon Steel",
    pipes: {
      material_standard: [
        "A 53Gr.A/B",
        "A106Gr.A/B/C",
        "A671/A672",
        "API 5LGr. A25,P/A/B",
        "IS-1239 BLACK",
        "IS-3589 GR.330",
      ],
    },
  },
  {
    id: "MS-002",
    basic_material_of_construction: "Low Temp.CS",
    pipes: { material_standard: ["A333 Gr.1", "A333 Gr.6"] },
  },
  {
    id: "MS-003",
    basic_material_of_construction: "Low & Int.Alloy Steel for Low temp.Service",
    pipes: { material_standard: ["A333 Gr.3", "A333 Gr.4", "A333 Gr.7", "A333 Gr.8", "A333 Gr.9"] },
  },
  {
    id: "MS-008",
    basic_material_of_construction: "High Strength Carbon /Low Alloy Steel. (All API 5L PSL 2 Pipe)",
    pipes: {
      material_standard: [
        "API 5L X42",
        "API 5L X46",
        "API 5L X52",
        "API 5L X56",
        "API 5L X60",
        "API 5L X65",
        "API 5L X70",
        "API 5L X80",
        "API 5L X90",
        "API 5L X100",
        "API 5L X120",
      ],
    },
  },
  {
    id: "MS-016",
    basic_material_of_construction: "Low & Int. Alloy Steel for High temp Service",
    pipes: {
      material_standard: [
        "A335 Gr.P1",
        "A335 Gr.P2",
        "A335 Gr.P36",
        "A335 Gr.P12",
        "A335 Gr.P11",
        "A335 Gr.P15",
        "A335 Gr.P22",
        "A335 Gr.P23",
        "A335 Gr.P21",
        "A335 Gr.P5",
        "A335 Gr.P9",
        "A335 Gr.P91",
        "A335 Gr.P92",
        "A335 Gr.P122",
        "A335Gr.P911",
        "A691 1 CR",
        "A691 5 CR",
        "A691 9 CR",
      ],
    },
  },
  {
    id: "MS-029",
    basic_material_of_construction: "Austenitic Stainless Steel",
    pipes: {
      material_standard: [
        "A312 TP 304",
        "A312 TP 304L",
        "A312 TP 316",
        "A312 TP 316L",
        "A312 TP 321",
        "A312 TP316Ti",
        "A312 TP 347",
        "A312 TP 317",
        "A312 TP 317L",
        "A312 TP 309",
        "A312 TP 310",
        "A358 Gr.304",
        "A358 Gr.316",
        "A358 Gr.316L",
      ],
    },
  },
  {
    id: "MS-040",
    basic_material_of_construction: "Ferritic/Austenitic (Duplex) Stainless Steel",
    pipes: {
      material_standard: [
        "A790 S 31803",
        "A790 S 32205",
        "A790 S 32304",
        "A790 S 32900",
        "A790 S 32950",
        "A790 S 32750",
        "A790 S 32760",
        "A790 S 32550",
        "A790 S 32906",
      ],
    },
  },
  {
    id: "MS-050",
    basic_material_of_construction: "NON-FERROUS MATERIALS - Monel-400 (UNS N04400)",
    pipes: { material_standard: ["B165", "B165 / B725", "UNS N04400"] },
  },
  {
    id: "MS-051",
    basic_material_of_construction: "NON-FERROUS MATERIALS - Inconel / Nickel Alloy",
    pipes: {
      material_standard: [
        "B 423",
        "B 705",
        "UNS N08825",
        "B 407",
        "UNS N08800",
        "B 444",
        "UNS N06625",
        "B167",
        "B517",
        "UNS N06600",
      ],
    },
  },
];

const additionalCarbonSteelPipeStandards = ["IS-1239 BLACK", "IS-3589 GR.330"];

const builtInRawMaterialPriceLibrary = [
  {
    "basic_mat_of_const": "Carbon Steel",
    "children": [
      {
        "ch_comp": "C",
        "pipe_mat_std": [
          "A53 Gr.A/B",
          "A106 Gr.A/B/C",
          "A671/A672",
          "API 5L Gr.A25/P/A/B"
        ],
        "raw_material_basis": "CS billet / bloom / HR coil / plate / skelp",
        "rate_inr_per_kg": {
          "low": 50.0,
          "recommended": 56.5,
          "high": 60.0
        },
        "source_material_name": "Carbon Steel, C",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 55.0,
            "recommended": 64.75,
            "high": 70.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268817,
            "factor_wrt_ss316_ss316l": 0.22961,
            "revision_note": "No change"
          },
          "2022": {
            "low": 54.0,
            "recommended": 70.9,
            "high": 80.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268815,
            "factor_wrt_ss316_ss316l": 0.182732,
            "revision_note": "No change"
          },
          "2023": {
            "low": 47.0,
            "recommended": 57.4,
            "high": 63.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268815,
            "factor_wrt_ss316_ss316l": 0.154509,
            "revision_note": "No change"
          },
          "2024": {
            "low": 47.0,
            "recommended": 52.2,
            "high": 55.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268823,
            "factor_wrt_ss316_ss316l": 0.158904,
            "revision_note": "No change"
          },
          "2025": {
            "low": 44.0,
            "recommended": 55.05,
            "high": 61.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268812,
            "factor_wrt_ss316_ss316l": 0.167452,
            "revision_note": "No change"
          },
          "2026": {
            "low": 50.0,
            "recommended": 56.5,
            "high": 60.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.0,
            "factor_wrt_ss304": 0.268817,
            "factor_wrt_ss316_ss316l": 0.173579,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.0,
          "2022": 1.0,
          "2023": 1.0,
          "2024": 1.0,
          "2025": 1.0,
          "2026": 1.0
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low Temp.CS",
    "children": [
      {
        "ch_comp": "C,Si",
        "pipe_mat_std": [
          "A333 Gr.1",
          "A333 Gr.6"
        ],
        "raw_material_basis": "Killed fine grain CS billet / LTCS plate",
        "rate_inr_per_kg": {
          "low": 60.0,
          "recommended": 67.8,
          "high": 72.0
        },
        "source_material_name": "Low Temp CS, C-Si",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 66.0,
            "recommended": 77.7,
            "high": 84.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322581,
            "factor_wrt_ss316_ss316l": 0.275532,
            "revision_note": "No change"
          },
          "2022": {
            "low": 64.8,
            "recommended": 85.08,
            "high": 96.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322578,
            "factor_wrt_ss316_ss316l": 0.219278,
            "revision_note": "No change"
          },
          "2023": {
            "low": 56.4,
            "recommended": 68.88,
            "high": 75.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322578,
            "factor_wrt_ss316_ss316l": 0.18541,
            "revision_note": "No change"
          },
          "2024": {
            "low": 56.4,
            "recommended": 62.64,
            "high": 66.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322587,
            "factor_wrt_ss316_ss316l": 0.190685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 52.8,
            "recommended": 66.06,
            "high": 73.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322574,
            "factor_wrt_ss316_ss316l": 0.200943,
            "revision_note": "No change"
          },
          "2026": {
            "low": 60.0,
            "recommended": 67.8,
            "high": 72.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.2,
            "factor_wrt_ss304": 0.322581,
            "factor_wrt_ss316_ss316l": 0.208295,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.2,
          "2022": 1.2,
          "2023": 1.2,
          "2024": 1.2,
          "2025": 1.2,
          "2026": 1.2
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low & Int.Alloy Steel for Low temp.Service",
    "children": [
      {
        "ch_comp": "3½Ni",
        "pipe_mat_std": [
          "A333 Gr.3"
        ],
        "raw_material_basis": "3.5% nickel alloy steel billet / plate",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "Low temp alloy steel, 3.5Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "¾Cr, ¾Ni",
        "pipe_mat_std": [
          "A333 Gr.4"
        ],
        "raw_material_basis": "Cr-Ni low temperature alloy steel billet",
        "rate_inr_per_kg": {
          "low": 78.0,
          "recommended": 88.14,
          "high": 93.6
        },
        "source_material_name": "Low temp alloy steel, 0.75Cr-0.75Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 85.8,
            "recommended": 101.01,
            "high": 109.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419355,
            "factor_wrt_ss316_ss316l": 0.358191,
            "revision_note": "No change"
          },
          "2022": {
            "low": 84.24,
            "recommended": 110.604,
            "high": 124.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419352,
            "factor_wrt_ss316_ss316l": 0.285062,
            "revision_note": "No change"
          },
          "2023": {
            "low": 73.32,
            "recommended": 89.544,
            "high": 98.28,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419351,
            "factor_wrt_ss316_ss316l": 0.241034,
            "revision_note": "No change"
          },
          "2024": {
            "low": 73.32,
            "recommended": 81.432,
            "high": 85.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419363,
            "factor_wrt_ss316_ss316l": 0.24789,
            "revision_note": "No change"
          },
          "2025": {
            "low": 68.64,
            "recommended": 85.878,
            "high": 95.16,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419347,
            "factor_wrt_ss316_ss316l": 0.261226,
            "revision_note": "No change"
          },
          "2026": {
            "low": 78.0,
            "recommended": 88.14,
            "high": 93.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.56,
            "factor_wrt_ss304": 0.419355,
            "factor_wrt_ss316_ss316l": 0.270783,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.56,
          "2022": 1.56,
          "2023": 1.56,
          "2024": 1.56,
          "2025": 1.56,
          "2026": 1.56
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2½Ni",
        "pipe_mat_std": [
          "A333 Gr.7"
        ],
        "raw_material_basis": "2.5% nickel alloy steel billet / plate",
        "rate_inr_per_kg": {
          "low": 93.0,
          "recommended": 105.09,
          "high": 111.6
        },
        "source_material_name": "Low temp alloy steel, 2.5Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 102.3,
            "recommended": 120.435,
            "high": 130.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.427074,
            "revision_note": "No change"
          },
          "2022": {
            "low": 100.44,
            "recommended": 131.874,
            "high": 148.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499996,
            "factor_wrt_ss316_ss316l": 0.339881,
            "revision_note": "No change"
          },
          "2023": {
            "low": 87.42,
            "recommended": 106.764,
            "high": 117.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499995,
            "factor_wrt_ss316_ss316l": 0.287386,
            "revision_note": "No change"
          },
          "2024": {
            "low": 87.42,
            "recommended": 97.092,
            "high": 102.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.50001,
            "factor_wrt_ss316_ss316l": 0.295562,
            "revision_note": "No change"
          },
          "2025": {
            "low": 81.84,
            "recommended": 102.393,
            "high": 113.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.49999,
            "factor_wrt_ss316_ss316l": 0.311462,
            "revision_note": "No change"
          },
          "2026": {
            "low": 93.0,
            "recommended": 105.09,
            "high": 111.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.322857,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.86,
          "2022": 1.86,
          "2023": 1.86,
          "2024": 1.86,
          "2025": 1.86,
          "2026": 1.86
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Ni",
        "pipe_mat_std": [
          "A333 Gr.8"
        ],
        "raw_material_basis": "9% nickel steel plate / billet",
        "rate_inr_per_kg": {
          "low": 199.0,
          "recommended": 224.87,
          "high": 238.8
        },
        "source_material_name": "Low temp alloy steel, 9Ni",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 218.9,
            "recommended": 257.705,
            "high": 278.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069892,
            "factor_wrt_ss316_ss316l": 0.913848,
            "revision_note": "No change"
          },
          "2022": {
            "low": 214.92,
            "recommended": 282.182,
            "high": 318.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069884,
            "factor_wrt_ss316_ss316l": 0.727273,
            "revision_note": "No change"
          },
          "2023": {
            "low": 187.06,
            "recommended": 228.452,
            "high": 250.74,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069882,
            "factor_wrt_ss316_ss316l": 0.614945,
            "revision_note": "No change"
          },
          "2024": {
            "low": 187.06,
            "recommended": 207.756,
            "high": 218.9,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069915,
            "factor_wrt_ss316_ss316l": 0.632438,
            "revision_note": "No change"
          },
          "2025": {
            "low": 175.12,
            "recommended": 219.099,
            "high": 242.78,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069872,
            "factor_wrt_ss316_ss316l": 0.666461,
            "revision_note": "No change"
          },
          "2026": {
            "low": 199.0,
            "recommended": 224.87,
            "high": 238.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.98,
            "factor_wrt_ss304": 1.069892,
            "factor_wrt_ss316_ss316l": 0.690845,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.98,
          "2022": 3.98,
          "2023": 3.98,
          "2024": 3.98,
          "2025": 3.98,
          "2026": 3.98
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2Ni, 1Cu",
        "pipe_mat_std": [
          "A333 Gr.9"
        ],
        "raw_material_basis": "Ni-Cu low temperature alloy steel billet",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "Low temp alloy steel, 2Ni-1Cu",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "High Strength Carbon / Low Alloy Steel",
    "children": [
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X42 to X52",
        "pipe_mat_std": [
          "API 5L X42",
          "API 5L X46",
          "API 5L X52"
        ],
        "raw_material_basis": "HSLA plate / TMCP skelp / coil",
        "rate_inr_per_kg": {
          "low": 62.0,
          "recommended": 70.06,
          "high": 74.4
        },
        "source_material_name": "API 5L high strength, X42 to X52",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 68.2,
            "recommended": 80.29,
            "high": 86.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333333,
            "factor_wrt_ss316_ss316l": 0.284716,
            "revision_note": "No change"
          },
          "2022": {
            "low": 66.96,
            "recommended": 87.916,
            "high": 99.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333331,
            "factor_wrt_ss316_ss316l": 0.226588,
            "revision_note": "No change"
          },
          "2023": {
            "low": 58.28,
            "recommended": 71.176,
            "high": 78.12,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.33333,
            "factor_wrt_ss316_ss316l": 0.191591,
            "revision_note": "No change"
          },
          "2024": {
            "low": 58.28,
            "recommended": 64.728,
            "high": 68.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.33334,
            "factor_wrt_ss316_ss316l": 0.197041,
            "revision_note": "No change"
          },
          "2025": {
            "low": 54.56,
            "recommended": 68.262,
            "high": 75.64,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333327,
            "factor_wrt_ss316_ss316l": 0.207641,
            "revision_note": "No change"
          },
          "2026": {
            "low": 62.0,
            "recommended": 70.06,
            "high": 74.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.24,
            "factor_wrt_ss304": 0.333333,
            "factor_wrt_ss316_ss316l": 0.215238,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.24,
          "2022": 1.24,
          "2023": 1.24,
          "2024": 1.24,
          "2025": 1.24,
          "2026": 1.24
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X56 to X70",
        "pipe_mat_std": [
          "API 5L X56",
          "API 5L X60",
          "API 5L X65",
          "API 5L X70"
        ],
        "raw_material_basis": "Higher strength HSLA plate / TMCP skelp",
        "rate_inr_per_kg": {
          "low": 71.0,
          "recommended": 80.23,
          "high": 85.2
        },
        "source_material_name": "API 5L high strength, X56 to X70",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 78.1,
            "recommended": 91.945,
            "high": 99.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.38172,
            "factor_wrt_ss316_ss316l": 0.326046,
            "revision_note": "No change"
          },
          "2022": {
            "low": 76.68,
            "recommended": 100.678,
            "high": 113.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381718,
            "factor_wrt_ss316_ss316l": 0.259479,
            "revision_note": "No change"
          },
          "2023": {
            "low": 66.74,
            "recommended": 81.508,
            "high": 89.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381717,
            "factor_wrt_ss316_ss316l": 0.219402,
            "revision_note": "No change"
          },
          "2024": {
            "low": 66.74,
            "recommended": 74.124,
            "high": 78.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381728,
            "factor_wrt_ss316_ss316l": 0.225644,
            "revision_note": "No change"
          },
          "2025": {
            "low": 62.48,
            "recommended": 78.171,
            "high": 86.62,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.381713,
            "factor_wrt_ss316_ss316l": 0.237783,
            "revision_note": "No change"
          },
          "2026": {
            "low": 71.0,
            "recommended": 80.23,
            "high": 85.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.42,
            "factor_wrt_ss304": 0.38172,
            "factor_wrt_ss316_ss316l": 0.246482,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.42,
          "2022": 1.42,
          "2023": 1.42,
          "2024": 1.42,
          "2025": 1.42,
          "2026": 1.42
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "C,Mn,Co,V,Ti",
        "grade_family": "API 5L PSL 2, X80 to X120",
        "pipe_mat_std": [
          "API 5L X80",
          "API 5L X90",
          "API 5L X100",
          "API 5L X120"
        ],
        "raw_material_basis": "Premium HSLA / TMCP plate / skelp",
        "rate_inr_per_kg": {
          "low": 93.0,
          "recommended": 105.09,
          "high": 111.6
        },
        "source_material_name": "API 5L high strength, X80 to X120",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 102.3,
            "recommended": 120.435,
            "high": 130.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.427074,
            "revision_note": "No change"
          },
          "2022": {
            "low": 100.44,
            "recommended": 131.874,
            "high": 148.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499996,
            "factor_wrt_ss316_ss316l": 0.339881,
            "revision_note": "No change"
          },
          "2023": {
            "low": 87.42,
            "recommended": 106.764,
            "high": 117.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.499995,
            "factor_wrt_ss316_ss316l": 0.287386,
            "revision_note": "No change"
          },
          "2024": {
            "low": 87.42,
            "recommended": 97.092,
            "high": 102.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.50001,
            "factor_wrt_ss316_ss316l": 0.295562,
            "revision_note": "No change"
          },
          "2025": {
            "low": 81.84,
            "recommended": 102.393,
            "high": 113.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.49999,
            "factor_wrt_ss316_ss316l": 0.311462,
            "revision_note": "No change"
          },
          "2026": {
            "low": 93.0,
            "recommended": 105.09,
            "high": 111.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.86,
            "factor_wrt_ss304": 0.5,
            "factor_wrt_ss316_ss316l": 0.322857,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.86,
          "2022": 1.86,
          "2023": 1.86,
          "2024": 1.86,
          "2025": 1.86,
          "2026": 1.86
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Low & Int. Alloy Steel for High temp Service",
    "children": [
      {
        "ch_comp": "C, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P1",
          "A691 CM65"
        ],
        "raw_material_basis": "C-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 97.5,
          "recommended": 110.175,
          "high": 117.0
        },
        "source_material_name": "C-0.5Mo alloy steel",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 107.25,
            "recommended": 126.2625,
            "high": 136.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524194,
            "factor_wrt_ss316_ss316l": 0.447739,
            "revision_note": "No change"
          },
          "2022": {
            "low": 105.3,
            "recommended": 138.255,
            "high": 156.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.52419,
            "factor_wrt_ss316_ss316l": 0.356327,
            "revision_note": "No change"
          },
          "2023": {
            "low": 91.65,
            "recommended": 111.93,
            "high": 122.85,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524189,
            "factor_wrt_ss316_ss316l": 0.301292,
            "revision_note": "No change"
          },
          "2024": {
            "low": 91.65,
            "recommended": 101.79,
            "high": 107.25,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524204,
            "factor_wrt_ss316_ss316l": 0.309863,
            "revision_note": "No change"
          },
          "2025": {
            "low": 85.8,
            "recommended": 107.3475,
            "high": 118.95,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524183,
            "factor_wrt_ss316_ss316l": 0.326532,
            "revision_note": "No change"
          },
          "2026": {
            "low": 97.5,
            "recommended": 110.175,
            "high": 117.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 1.95,
            "factor_wrt_ss304": 0.524194,
            "factor_wrt_ss316_ss316l": 0.338479,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 1.95,
          "2022": 1.95,
          "2023": 1.95,
          "2024": 1.95,
          "2025": 1.95,
          "2026": 1.95
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "½Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P2",
          "A335 Gr.P36",
          "A691 ½CR"
        ],
        "raw_material_basis": "Cr-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 110.5,
          "recommended": 124.865,
          "high": 132.6
        },
        "source_material_name": "0.5Cr-0.5Mo alloy steel",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 121.55,
            "recommended": 143.0975,
            "high": 154.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.507438,
            "revision_note": "No change"
          },
          "2022": {
            "low": 119.34,
            "recommended": 156.689,
            "high": 176.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594082,
            "factor_wrt_ss316_ss316l": 0.403838,
            "revision_note": "No change"
          },
          "2023": {
            "low": 103.87,
            "recommended": 126.854,
            "high": 139.23,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.59408,
            "factor_wrt_ss316_ss316l": 0.341464,
            "revision_note": "No change"
          },
          "2024": {
            "low": 103.87,
            "recommended": 115.362,
            "high": 121.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594098,
            "factor_wrt_ss316_ss316l": 0.351178,
            "revision_note": "No change"
          },
          "2025": {
            "low": 97.24,
            "recommended": 121.6605,
            "high": 134.81,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594074,
            "factor_wrt_ss316_ss316l": 0.37007,
            "revision_note": "No change"
          },
          "2026": {
            "low": 110.5,
            "recommended": 124.865,
            "high": 132.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.21,
            "factor_wrt_ss304": 0.594086,
            "factor_wrt_ss316_ss316l": 0.38361,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.21,
          "2022": 2.21,
          "2023": 2.21,
          "2024": 2.21,
          "2025": 2.21,
          "2026": 2.21
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "1Cr, ½Mo / 1¼Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P12",
          "A335 Gr.P11"
        ],
        "raw_material_basis": "Cr-Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 119.5,
          "recommended": 135.035,
          "high": 143.4
        },
        "source_material_name": "1Cr-0.5Mo / 1.25Cr-0.5Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 131.45,
            "recommended": 154.7525,
            "high": 167.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642473,
            "factor_wrt_ss316_ss316l": 0.548768,
            "revision_note": "No change"
          },
          "2022": {
            "low": 129.06,
            "recommended": 169.451,
            "high": 191.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642468,
            "factor_wrt_ss316_ss316l": 0.436729,
            "revision_note": "No change"
          },
          "2023": {
            "low": 112.33,
            "recommended": 137.186,
            "high": 150.57,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642467,
            "factor_wrt_ss316_ss316l": 0.369276,
            "revision_note": "No change"
          },
          "2024": {
            "low": 112.33,
            "recommended": 124.758,
            "high": 131.45,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642486,
            "factor_wrt_ss316_ss316l": 0.379781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 105.16,
            "recommended": 131.5695,
            "high": 145.79,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642461,
            "factor_wrt_ss316_ss316l": 0.400211,
            "revision_note": "No change"
          },
          "2026": {
            "low": 119.5,
            "recommended": 135.035,
            "high": 143.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 2.39,
            "factor_wrt_ss304": 0.642473,
            "factor_wrt_ss316_ss316l": 0.414854,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 2.39,
          "2022": 2.39,
          "2023": 2.39,
          "2024": 2.39,
          "2025": 2.39,
          "2026": 2.39
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "2¼Cr, 1Mo",
        "pipe_mat_std": [
          "A335 Gr.P22",
          "A335 Gr.P23"
        ],
        "raw_material_basis": "2.25Cr-1Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 155.0,
          "recommended": 175.15,
          "high": 186.0
        },
        "source_material_name": "2.25Cr-1Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 170.5,
            "recommended": 200.725,
            "high": 217.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.711791,
            "revision_note": "No change"
          },
          "2022": {
            "low": 167.4,
            "recommended": 219.79,
            "high": 248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833327,
            "factor_wrt_ss316_ss316l": 0.566469,
            "revision_note": "No change"
          },
          "2023": {
            "low": 145.7,
            "recommended": 177.94,
            "high": 195.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833326,
            "factor_wrt_ss316_ss316l": 0.478977,
            "revision_note": "No change"
          },
          "2024": {
            "low": 145.7,
            "recommended": 161.82,
            "high": 170.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.83335,
            "factor_wrt_ss316_ss316l": 0.492603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 136.4,
            "recommended": 170.655,
            "high": 189.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833317,
            "factor_wrt_ss316_ss316l": 0.519103,
            "revision_note": "No change"
          },
          "2026": {
            "low": 155.0,
            "recommended": 175.15,
            "high": 186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.538095,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.1,
          "2022": 3.1,
          "2023": 3.1,
          "2024": 3.1,
          "2025": 3.1,
          "2026": 3.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "5Cr, ½Mo",
        "pipe_mat_std": [
          "A335 Gr.P5"
        ],
        "raw_material_basis": "5Cr alloy steel billet",
        "rate_inr_per_kg": {
          "low": 155.0,
          "recommended": 175.15,
          "high": 186.0
        },
        "source_material_name": "5Cr-0.5Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 170.5,
            "recommended": 200.725,
            "high": 217.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.711791,
            "revision_note": "No change"
          },
          "2022": {
            "low": 167.4,
            "recommended": 219.79,
            "high": 248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833327,
            "factor_wrt_ss316_ss316l": 0.566469,
            "revision_note": "No change"
          },
          "2023": {
            "low": 145.7,
            "recommended": 177.94,
            "high": 195.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833326,
            "factor_wrt_ss316_ss316l": 0.478977,
            "revision_note": "No change"
          },
          "2024": {
            "low": 145.7,
            "recommended": 161.82,
            "high": 170.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.83335,
            "factor_wrt_ss316_ss316l": 0.492603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 136.4,
            "recommended": 170.655,
            "high": 189.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833317,
            "factor_wrt_ss316_ss316l": 0.519103,
            "revision_note": "No change"
          },
          "2026": {
            "low": 155.0,
            "recommended": 175.15,
            "high": 186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.1,
            "factor_wrt_ss304": 0.833333,
            "factor_wrt_ss316_ss316l": 0.538095,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.1,
          "2022": 3.1,
          "2023": 3.1,
          "2024": 3.1,
          "2025": 3.1,
          "2026": 3.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Cr, 1Mo",
        "pipe_mat_std": [
          "A335 Gr.P9"
        ],
        "raw_material_basis": "9Cr-1Mo alloy steel billet",
        "rate_inr_per_kg": {
          "low": 194.5,
          "recommended": 219.785,
          "high": 233.4
        },
        "source_material_name": "9Cr-1Mo",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 213.95,
            "recommended": 251.8775,
            "high": 272.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045699,
            "factor_wrt_ss316_ss316l": 0.893183,
            "revision_note": "No change"
          },
          "2022": {
            "low": 210.06,
            "recommended": 275.801,
            "high": 311.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045691,
            "factor_wrt_ss316_ss316l": 0.710827,
            "revision_note": "No change"
          },
          "2023": {
            "low": 182.83,
            "recommended": 223.286,
            "high": 245.07,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045689,
            "factor_wrt_ss316_ss316l": 0.601039,
            "revision_note": "No change"
          },
          "2024": {
            "low": 182.83,
            "recommended": 203.058,
            "high": 213.95,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.04572,
            "factor_wrt_ss316_ss316l": 0.618137,
            "revision_note": "No change"
          },
          "2025": {
            "low": 171.16,
            "recommended": 214.1445,
            "high": 237.29,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045678,
            "factor_wrt_ss316_ss316l": 0.65139,
            "revision_note": "No change"
          },
          "2026": {
            "low": 194.5,
            "recommended": 219.785,
            "high": 233.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.89,
            "factor_wrt_ss304": 1.045699,
            "factor_wrt_ss316_ss316l": 0.675223,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.89,
          "2022": 3.89,
          "2023": 3.89,
          "2024": 3.89,
          "2025": 3.89,
          "2026": 3.89
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "9Cr, 1Mo, V / W modified grades",
        "pipe_mat_std": [
          "A335 Gr.P91",
          "A335 Gr.P92",
          "A335 Gr.P911",
          "A335 Gr.P122"
        ],
        "raw_material_basis": "High alloy creep strength billet",
        "rate_inr_per_kg": {
          "low": 265.5,
          "recommended": 300.015,
          "high": 318.6
        },
        "source_material_name": "9Cr-1Mo-V / P91 family",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 292.05,
            "recommended": 343.8225,
            "high": 371.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427419,
            "factor_wrt_ss316_ss316l": 1.219229,
            "revision_note": "No change"
          },
          "2022": {
            "low": 286.74,
            "recommended": 376.479,
            "high": 424.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427409,
            "factor_wrt_ss316_ss316l": 0.970307,
            "revision_note": "No change"
          },
          "2023": {
            "low": 249.57,
            "recommended": 304.794,
            "high": 334.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427406,
            "factor_wrt_ss316_ss316l": 0.820441,
            "revision_note": "No change"
          },
          "2024": {
            "low": 249.57,
            "recommended": 277.182,
            "high": 292.05,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427449,
            "factor_wrt_ss316_ss316l": 0.843781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 233.64,
            "recommended": 292.3155,
            "high": 323.91,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427391,
            "factor_wrt_ss316_ss316l": 0.889173,
            "revision_note": "No change"
          },
          "2026": {
            "low": 265.5,
            "recommended": 300.015,
            "high": 318.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.31,
            "factor_wrt_ss304": 1.427419,
            "factor_wrt_ss316_ss316l": 0.921705,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.31,
          "2022": 5.31,
          "2023": 5.31,
          "2024": 5.31,
          "2025": 5.31,
          "2026": 5.31
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Austenitic Stainless Steel",
    "children": [
      {
        "ch_comp": "18Cr, 8Ni",
        "pipe_mat_std": [
          "A312 TP304",
          "A312 TP304L"
        ],
        "raw_material_basis": "SS 304/304L coil / strip / billet",
        "rate_inr_per_kg": {
          "low": 186.0,
          "recommended": 210.18,
          "high": 223.2
        },
        "source_material_name": "Austenitic SS 304 / 304L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 204.6,
            "recommended": 240.87,
            "high": 260.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.0,
            "factor_wrt_ss316_ss316l": 0.854149,
            "revision_note": "No change"
          },
          "2022": {
            "low": 200.88,
            "recommended": 263.748,
            "high": 297.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.999992,
            "factor_wrt_ss316_ss316l": 0.679763,
            "revision_note": "No change"
          },
          "2023": {
            "low": 174.84,
            "recommended": 213.528,
            "high": 234.36,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.999991,
            "factor_wrt_ss316_ss316l": 0.574773,
            "revision_note": "No change"
          },
          "2024": {
            "low": 174.84,
            "recommended": 194.184,
            "high": 204.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.000021,
            "factor_wrt_ss316_ss316l": 0.591123,
            "revision_note": "No change"
          },
          "2025": {
            "low": 163.68,
            "recommended": 204.786,
            "high": 226.92,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 0.99998,
            "factor_wrt_ss316_ss316l": 0.622923,
            "revision_note": "No change"
          },
          "2026": {
            "low": 186.0,
            "recommended": 210.18,
            "high": 223.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.72,
            "factor_wrt_ss304": 1.0,
            "factor_wrt_ss316_ss316l": 0.645714,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.72,
          "2022": 3.72,
          "2023": 3.72,
          "2024": 3.72,
          "2025": 3.72,
          "2026": 3.72
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "16/18Cr, Ni, Mo",
        "pipe_mat_std": [
          "A312 TP316",
          "A312 TP316L"
        ],
        "raw_material_basis": "Mo-bearing SS 316/316L coil / billet",
        "rate_inr_per_kg": {
          "low": 280.0,
          "recommended": 325.5,
          "high": 350.0
        },
        "source_material_name": "SS316L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 230.0,
            "recommended": 282.0,
            "high": 310.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 4.355212,
            "factor_wrt_ss304": 1.170756,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2022": {
            "low": 310.0,
            "recommended": 388.0,
            "high": 430.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.472496,
            "factor_wrt_ss304": 1.47109,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2023": {
            "low": 300.0,
            "recommended": 371.5,
            "high": 410.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.472125,
            "factor_wrt_ss304": 1.739802,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2024": {
            "low": 270.0,
            "recommended": 328.5,
            "high": 360.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.293103,
            "factor_wrt_ss304": 1.691729,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2025": {
            "low": 280.0,
            "recommended": 328.75,
            "high": 355.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.971844,
            "factor_wrt_ss304": 1.605303,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          },
          "2026": {
            "low": 280.0,
            "recommended": 325.5,
            "high": 350.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.761062,
            "factor_wrt_ss304": 1.548673,
            "factor_wrt_ss316_ss316l": 1.0,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 4.355212,
          "2022": 5.472496,
          "2023": 6.472125,
          "2024": 6.293103,
          "2025": 5.971844,
          "2026": 5.761062
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Ti / Cb stabilized SS",
        "pipe_mat_std": [
          "A312 TP321",
          "A312 TP347"
        ],
        "raw_material_basis": "Stabilized stainless steel coil / billet",
        "rate_inr_per_kg": {
          "low": 252.0,
          "recommended": 284.76,
          "high": 302.4
        },
        "source_material_name": "SS 321 / 347",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 277.2,
            "recommended": 326.34,
            "high": 352.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354839,
            "factor_wrt_ss316_ss316l": 1.157234,
            "revision_note": "No change"
          },
          "2022": {
            "low": 272.16,
            "recommended": 357.336,
            "high": 403.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354828,
            "factor_wrt_ss316_ss316l": 0.920969,
            "revision_note": "No change"
          },
          "2023": {
            "low": 236.88,
            "recommended": 289.296,
            "high": 317.52,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354826,
            "factor_wrt_ss316_ss316l": 0.778724,
            "revision_note": "No change"
          },
          "2024": {
            "low": 236.88,
            "recommended": 263.088,
            "high": 277.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354867,
            "factor_wrt_ss316_ss316l": 0.800877,
            "revision_note": "No change"
          },
          "2025": {
            "low": 221.76,
            "recommended": 277.452,
            "high": 307.44,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354812,
            "factor_wrt_ss316_ss316l": 0.84396,
            "revision_note": "No change"
          },
          "2026": {
            "low": 252.0,
            "recommended": 284.76,
            "high": 302.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.04,
            "factor_wrt_ss304": 1.354839,
            "factor_wrt_ss316_ss316l": 0.874839,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.04,
          "2022": 5.04,
          "2023": 5.04,
          "2024": 5.04,
          "2025": 5.04,
          "2026": 5.04
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "SS316Ti",
        "pipe_mat_std": [
          "A312 TP316Ti"
        ],
        "raw_material_basis": "SS316Ti stabilized stainless stock",
        "rate_inr_per_kg": {
          "low": 425.0,
          "recommended": 480.25,
          "high": 510.0
        },
        "source_material_name": "SS 316Ti",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 467.5,
            "recommended": 550.375,
            "high": 595.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284946,
            "factor_wrt_ss316_ss316l": 1.951684,
            "revision_note": "No change"
          },
          "2022": {
            "low": 459.0,
            "recommended": 602.65,
            "high": 680.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284929,
            "factor_wrt_ss316_ss316l": 1.553222,
            "revision_note": "No change"
          },
          "2023": {
            "low": 399.5,
            "recommended": 487.9,
            "high": 535.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284925,
            "factor_wrt_ss316_ss316l": 1.313324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 399.5,
            "recommended": 443.7,
            "high": 467.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284993,
            "factor_wrt_ss316_ss316l": 1.350685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 374.0,
            "recommended": 467.925,
            "high": 518.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284902,
            "factor_wrt_ss316_ss316l": 1.423346,
            "revision_note": "No change"
          },
          "2026": {
            "low": 425.0,
            "recommended": 480.25,
            "high": 510.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.5,
            "factor_wrt_ss304": 2.284946,
            "factor_wrt_ss316_ss316l": 1.475422,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 8.5,
          "2022": 8.5,
          "2023": 8.5,
          "2024": 8.5,
          "2025": 8.5,
          "2026": 8.5
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "25Cr, 20Ni",
        "pipe_mat_std": [
          "A312 TP310"
        ],
        "raw_material_basis": "High nickel, high chromium stainless stock",
        "rate_inr_per_kg": {
          "low": 460.0,
          "recommended": 519.8,
          "high": 552.0
        },
        "source_material_name": "SS 310",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 506.0,
            "recommended": 595.7,
            "high": 644.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473118,
            "factor_wrt_ss316_ss316l": 2.112411,
            "revision_note": "No change"
          },
          "2022": {
            "low": 496.8,
            "recommended": 652.28,
            "high": 736.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.4731,
            "factor_wrt_ss316_ss316l": 1.681134,
            "revision_note": "No change"
          },
          "2023": {
            "low": 432.4,
            "recommended": 528.08,
            "high": 579.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473095,
            "factor_wrt_ss316_ss316l": 1.42148,
            "revision_note": "No change"
          },
          "2024": {
            "low": 432.4,
            "recommended": 480.24,
            "high": 506.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473169,
            "factor_wrt_ss316_ss316l": 1.461918,
            "revision_note": "No change"
          },
          "2025": {
            "low": 404.8,
            "recommended": 506.46,
            "high": 561.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.47307,
            "factor_wrt_ss316_ss316l": 1.540563,
            "revision_note": "No change"
          },
          "2026": {
            "low": 460.0,
            "recommended": 519.8,
            "high": 552.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.2,
            "factor_wrt_ss304": 2.473118,
            "factor_wrt_ss316_ss316l": 1.596928,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 9.2,
          "2022": 9.2,
          "2023": 9.2,
          "2024": 9.2,
          "2025": 9.2,
          "2026": 9.2
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "High Mo Austenitic SS - SS317",
        "pipe_mat_std": [
          "A312 TP317"
        ],
        "raw_material_basis": "SS317 high Mo stainless stock",
        "rate_inr_per_kg": {
          "low": 299.6,
          "recommended": 377.86,
          "high": 420.0
        },
        "source_material_name": "SS 317",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 246.1,
            "recommended": 327.935,
            "high": 372.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 5.064633,
            "factor_wrt_ss304": 1.361461,
            "factor_wrt_ss316_ss316l": 1.16289,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2022": {
            "low": 331.7,
            "recommended": 451.495,
            "high": 516.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.368054,
            "factor_wrt_ss304": 1.711829,
            "factor_wrt_ss316_ss316l": 1.163647,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2023": {
            "low": 321.0,
            "recommended": 432.15,
            "high": 492.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 7.528746,
            "factor_wrt_ss304": 2.023837,
            "factor_wrt_ss316_ss316l": 1.163257,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2024": {
            "low": 288.9,
            "recommended": 381.915,
            "high": 432.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 7.316379,
            "factor_wrt_ss304": 1.966809,
            "factor_wrt_ss316_ss316l": 1.162603,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2025": {
            "low": 299.6,
            "recommended": 381.76,
            "high": 426.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.934787,
            "factor_wrt_ss304": 1.864154,
            "factor_wrt_ss316_ss316l": 1.161247,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          },
          "2026": {
            "low": 299.6,
            "recommended": 377.86,
            "high": 420.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.687788,
            "factor_wrt_ss304": 1.797792,
            "factor_wrt_ss316_ss316l": 1.16086,
            "revision_note": "Revised: anchored to SS316/316L. Min = 1.07×SS316L min; Max = 1.20×SS316L max."
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 5.064633,
          "2022": 6.368054,
          "2023": 7.528746,
          "2024": 7.316379,
          "2025": 6.934787,
          "2026": 6.687788
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "6Mo Austenitic SS",
        "pipe_mat_std": [
          "A312 N08367"
        ],
        "raw_material_basis": "6Mo / super austenitic stainless stock",
        "rate_inr_per_kg": {
          "low": 929.0,
          "recommended": 1049.77,
          "high": 1114.8
        },
        "source_material_name": "6Mo austenitic SS",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1021.9,
            "recommended": 1203.055,
            "high": 1300.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994624,
            "factor_wrt_ss316_ss316l": 4.266152,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1003.32,
            "recommended": 1317.322,
            "high": 1486.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994586,
            "factor_wrt_ss316_ss316l": 3.39516,
            "revision_note": "No change"
          },
          "2023": {
            "low": 873.26,
            "recommended": 1066.492,
            "high": 1170.54,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994577,
            "factor_wrt_ss316_ss316l": 2.870773,
            "revision_note": "No change"
          },
          "2024": {
            "low": 873.26,
            "recommended": 969.876,
            "high": 1021.9,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994727,
            "factor_wrt_ss316_ss316l": 2.952438,
            "revision_note": "No change"
          },
          "2025": {
            "low": 817.52,
            "recommended": 1022.829,
            "high": 1133.38,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994526,
            "factor_wrt_ss316_ss316l": 3.111267,
            "revision_note": "No change"
          },
          "2026": {
            "low": 929.0,
            "recommended": 1049.77,
            "high": 1114.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 18.58,
            "factor_wrt_ss304": 4.994624,
            "factor_wrt_ss316_ss316l": 3.2251,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 18.58,
          "2022": 18.58,
          "2023": 18.58,
          "2024": 18.58,
          "2025": 18.58,
          "2026": 18.58
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "904L Austenitic SS",
        "pipe_mat_std": [
          "A312 N08904"
        ],
        "raw_material_basis": "904L super austenitic stainless stock",
        "rate_inr_per_kg": {
          "low": 885.0,
          "recommended": 1000.05,
          "high": 1062.0
        },
        "source_material_name": "904L",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 973.5,
            "recommended": 1146.075,
            "high": 1239.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758065,
            "factor_wrt_ss316_ss316l": 4.064096,
            "revision_note": "No change"
          },
          "2022": {
            "low": 955.8,
            "recommended": 1254.93,
            "high": 1416.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758028,
            "factor_wrt_ss316_ss316l": 3.234356,
            "revision_note": "No change"
          },
          "2023": {
            "low": 831.9,
            "recommended": 1015.98,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.75802,
            "factor_wrt_ss316_ss316l": 2.734805,
            "revision_note": "No change"
          },
          "2024": {
            "low": 831.9,
            "recommended": 923.94,
            "high": 973.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758163,
            "factor_wrt_ss316_ss316l": 2.812603,
            "revision_note": "No change"
          },
          "2025": {
            "low": 778.8,
            "recommended": 974.385,
            "high": 1079.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.757972,
            "factor_wrt_ss316_ss316l": 2.963909,
            "revision_note": "No change"
          },
          "2026": {
            "low": 885.0,
            "recommended": 1000.05,
            "high": 1062.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 17.7,
            "factor_wrt_ss304": 4.758065,
            "factor_wrt_ss316_ss316l": 3.07235,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 17.7,
          "2022": 17.7,
          "2023": 17.7,
          "2024": 17.7,
          "2025": 17.7,
          "2026": 17.7
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Ferritic/Austenitic Duplex Stainless Steel",
    "children": [
      {
        "ch_comp": "Lean Duplex",
        "pipe_mat_std": [
          "A790 S32304"
        ],
        "raw_material_basis": "Lean duplex coil / billet",
        "rate_inr_per_kg": {
          "low": 177.0,
          "recommended": 200.01,
          "high": 212.4
        },
        "source_material_name": "Duplex 2304",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 194.7,
            "recommended": 229.215,
            "high": 247.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951613,
            "factor_wrt_ss316_ss316l": 0.812819,
            "revision_note": "No change"
          },
          "2022": {
            "low": 191.16,
            "recommended": 250.986,
            "high": 283.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951606,
            "factor_wrt_ss316_ss316l": 0.646871,
            "revision_note": "No change"
          },
          "2023": {
            "low": 166.38,
            "recommended": 203.196,
            "high": 223.02,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951604,
            "factor_wrt_ss316_ss316l": 0.546961,
            "revision_note": "No change"
          },
          "2024": {
            "low": 166.38,
            "recommended": 184.788,
            "high": 194.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951633,
            "factor_wrt_ss316_ss316l": 0.562521,
            "revision_note": "No change"
          },
          "2025": {
            "low": 155.76,
            "recommended": 194.877,
            "high": 215.94,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951594,
            "factor_wrt_ss316_ss316l": 0.592782,
            "revision_note": "No change"
          },
          "2026": {
            "low": 177.0,
            "recommended": 200.01,
            "high": 212.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 3.54,
            "factor_wrt_ss304": 0.951613,
            "factor_wrt_ss316_ss316l": 0.61447,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 3.54,
          "2022": 3.54,
          "2023": 3.54,
          "2024": 3.54,
          "2025": 3.54,
          "2026": 3.54
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "22Cr, 5½Ni, 3Mo",
        "pipe_mat_std": [
          "A790 S31803",
          "A790 S32205"
        ],
        "raw_material_basis": "Duplex 2205 coil / billet",
        "rate_inr_per_kg": {
          "low": 442.5,
          "recommended": 500.025,
          "high": 531.0
        },
        "source_material_name": "Duplex 2205",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 486.75,
            "recommended": 573.0375,
            "high": 619.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379032,
            "factor_wrt_ss316_ss316l": 2.032048,
            "revision_note": "No change"
          },
          "2022": {
            "low": 477.9,
            "recommended": 627.465,
            "high": 708.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379014,
            "factor_wrt_ss316_ss316l": 1.617178,
            "revision_note": "No change"
          },
          "2023": {
            "low": 415.95,
            "recommended": 507.99,
            "high": 557.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.37901,
            "factor_wrt_ss316_ss316l": 1.367402,
            "revision_note": "No change"
          },
          "2024": {
            "low": 415.95,
            "recommended": 461.97,
            "high": 486.75,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379081,
            "factor_wrt_ss316_ss316l": 1.406301,
            "revision_note": "No change"
          },
          "2025": {
            "low": 389.4,
            "recommended": 487.1925,
            "high": 539.85,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.378986,
            "factor_wrt_ss316_ss316l": 1.481954,
            "revision_note": "No change"
          },
          "2026": {
            "low": 442.5,
            "recommended": 500.025,
            "high": 531.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 8.85,
            "factor_wrt_ss304": 2.379032,
            "factor_wrt_ss316_ss316l": 1.536175,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 8.85,
          "2022": 8.85,
          "2023": 8.85,
          "2024": 8.85,
          "2025": 8.85,
          "2026": 8.85
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "High alloy duplex",
        "pipe_mat_std": [
          "A790 S32900",
          "A790 S32950",
          "A790 S32550",
          "A790 S32906"
        ],
        "raw_material_basis": "Higher alloy duplex stainless stock",
        "rate_inr_per_kg": {
          "low": 486.5,
          "recommended": 549.745,
          "high": 583.8
        },
        "source_material_name": "Other duplex grades",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 535.15,
            "recommended": 630.0175,
            "high": 681.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615591,
            "factor_wrt_ss316_ss316l": 2.234105,
            "revision_note": "No change"
          },
          "2022": {
            "low": 525.42,
            "recommended": 689.857,
            "high": 778.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615572,
            "factor_wrt_ss316_ss316l": 1.777982,
            "revision_note": "No change"
          },
          "2023": {
            "low": 457.31,
            "recommended": 558.502,
            "high": 612.99,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615567,
            "factor_wrt_ss316_ss316l": 1.50337,
            "revision_note": "No change"
          },
          "2024": {
            "low": 457.31,
            "recommended": 507.906,
            "high": 535.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615645,
            "factor_wrt_ss316_ss316l": 1.546137,
            "revision_note": "No change"
          },
          "2025": {
            "low": 428.12,
            "recommended": 535.6365,
            "high": 593.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.61554,
            "factor_wrt_ss316_ss316l": 1.629313,
            "revision_note": "No change"
          },
          "2026": {
            "low": 486.5,
            "recommended": 549.745,
            "high": 583.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 9.73,
            "factor_wrt_ss304": 2.615591,
            "factor_wrt_ss316_ss316l": 1.688925,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 9.73,
          "2022": 9.73,
          "2023": 9.73,
          "2024": 9.73,
          "2025": 9.73,
          "2026": 9.73
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Super Duplex",
        "pipe_mat_std": [
          "A790 S32750",
          "A790 S32760",
          "A790 S39274"
        ],
        "raw_material_basis": "Super duplex stainless stock",
        "rate_inr_per_kg": {
          "low": 641.5,
          "recommended": 724.895,
          "high": 769.8
        },
        "source_material_name": "Super Duplex",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 705.65,
            "recommended": 830.7425,
            "high": 898.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448925,
            "factor_wrt_ss316_ss316l": 2.945895,
            "revision_note": "No change"
          },
          "2022": {
            "low": 692.82,
            "recommended": 909.647,
            "high": 1026.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448899,
            "factor_wrt_ss316_ss316l": 2.344451,
            "revision_note": "No change"
          },
          "2023": {
            "low": 603.01,
            "recommended": 736.442,
            "high": 808.29,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448892,
            "factor_wrt_ss316_ss316l": 1.982347,
            "revision_note": "No change"
          },
          "2024": {
            "low": 603.01,
            "recommended": 669.726,
            "high": 705.65,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448996,
            "factor_wrt_ss316_ss316l": 2.03874,
            "revision_note": "No change"
          },
          "2025": {
            "low": 564.52,
            "recommended": 706.2915,
            "high": 782.63,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448857,
            "factor_wrt_ss316_ss316l": 2.148415,
            "revision_note": "No change"
          },
          "2026": {
            "low": 641.5,
            "recommended": 724.895,
            "high": 769.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 12.83,
            "factor_wrt_ss304": 3.448925,
            "factor_wrt_ss316_ss316l": 2.22702,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 12.83,
          "2022": 12.83,
          "2023": 12.83,
          "2024": 12.83,
          "2025": 12.83,
          "2026": 12.83
        },
        "percentile_used": 0.65
      }
    ]
  },
  {
    "basic_mat_of_const": "Non-Ferrous Materials",
    "children": [
      {
        "ch_comp": "Titanium",
        "pipe_mat_std": [
          "B861",
          "B862"
        ],
        "raw_material_basis": "Titanium sponge / slab / billet / strip",
        "rate_inr_per_kg": {
          "low": 796.5,
          "recommended": 900.045,
          "high": 955.8
        },
        "source_material_name": "Titanium",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 876.15,
            "recommended": 1031.4675,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 3.657686,
            "revision_note": "No change"
          },
          "2022": {
            "low": 860.22,
            "recommended": 1129.437,
            "high": 1274.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282226,
            "factor_wrt_ss316_ss316l": 2.91092,
            "revision_note": "No change"
          },
          "2023": {
            "low": 748.71,
            "recommended": 914.382,
            "high": 1003.59,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282218,
            "factor_wrt_ss316_ss316l": 2.461324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 748.71,
            "recommended": 831.546,
            "high": 876.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282346,
            "factor_wrt_ss316_ss316l": 2.531342,
            "revision_note": "No change"
          },
          "2025": {
            "low": 700.92,
            "recommended": 876.9465,
            "high": 971.73,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282174,
            "factor_wrt_ss316_ss316l": 2.667518,
            "revision_note": "No change"
          },
          "2026": {
            "low": 796.5,
            "recommended": 900.045,
            "high": 955.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 2.765115,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 15.93,
          "2022": 15.93,
          "2023": 15.93,
          "2024": 15.93,
          "2025": 15.93,
          "2026": 15.93
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel / Incoloy 825",
        "pipe_mat_std": [
          "B423",
          "B705",
          "UNS N08825"
        ],
        "raw_material_basis": "Ni-Fe-Cr-Mo alloy stock",
        "rate_inr_per_kg": {
          "low": 1150.5,
          "recommended": 1300.065,
          "high": 1380.6
        },
        "source_material_name": "Incoloy / Inconel 825",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1265.55,
            "recommended": 1489.8975,
            "high": 1610.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185484,
            "factor_wrt_ss316_ss316l": 5.283324,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1242.54,
            "recommended": 1631.409,
            "high": 1840.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185437,
            "factor_wrt_ss316_ss316l": 4.204662,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1081.47,
            "recommended": 1320.774,
            "high": 1449.63,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185426,
            "factor_wrt_ss316_ss316l": 3.555246,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1081.47,
            "recommended": 1201.122,
            "high": 1265.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185611,
            "factor_wrt_ss316_ss316l": 3.656384,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1012.44,
            "recommended": 1266.7005,
            "high": 1403.61,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185363,
            "factor_wrt_ss316_ss316l": 3.853081,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1150.5,
            "recommended": 1300.065,
            "high": 1380.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 23.01,
            "factor_wrt_ss304": 6.185484,
            "factor_wrt_ss316_ss316l": 3.994055,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 23.01,
          "2022": 23.01,
          "2023": 23.01,
          "2024": 23.01,
          "2025": 23.01,
          "2026": 23.01
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel / Incoloy 800",
        "pipe_mat_std": [
          "B407",
          "UNS N08800"
        ],
        "raw_material_basis": "Ni-Fe-Cr alloy stock",
        "rate_inr_per_kg": {
          "low": 730.0,
          "recommended": 824.9,
          "high": 876.0
        },
        "source_material_name": "Incoloy 800",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 803.0,
            "recommended": 945.35,
            "high": 1022.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924731,
            "factor_wrt_ss316_ss316l": 3.352305,
            "revision_note": "No change"
          },
          "2022": {
            "low": 788.4,
            "recommended": 1035.14,
            "high": 1168.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924701,
            "factor_wrt_ss316_ss316l": 2.667887,
            "revision_note": "No change"
          },
          "2023": {
            "low": 686.2,
            "recommended": 838.04,
            "high": 919.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924694,
            "factor_wrt_ss316_ss316l": 2.255828,
            "revision_note": "No change"
          },
          "2024": {
            "low": 686.2,
            "recommended": 762.12,
            "high": 803.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924812,
            "factor_wrt_ss316_ss316l": 2.32,
            "revision_note": "No change"
          },
          "2025": {
            "low": 642.4,
            "recommended": 803.73,
            "high": 890.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924655,
            "factor_wrt_ss316_ss316l": 2.444806,
            "revision_note": "No change"
          },
          "2026": {
            "low": 730.0,
            "recommended": 824.9,
            "high": 876.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 14.6,
            "factor_wrt_ss304": 3.924731,
            "factor_wrt_ss316_ss316l": 2.534255,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 14.6,
          "2022": 14.6,
          "2023": 14.6,
          "2024": 14.6,
          "2025": 14.6,
          "2026": 14.6
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel 625",
        "pipe_mat_std": [
          "B444",
          "B705",
          "UNS N06625"
        ],
        "raw_material_basis": "Ni-Cr-Mo-Nb alloy stock",
        "rate_inr_per_kg": {
          "low": 2124.0,
          "recommended": 2400.12,
          "high": 2548.8
        },
        "source_material_name": "Inconel 625",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 2336.4,
            "recommended": 2750.58,
            "high": 2973.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419355,
            "factor_wrt_ss316_ss316l": 9.75383,
            "revision_note": "No change"
          },
          "2022": {
            "low": 2293.92,
            "recommended": 3011.832,
            "high": 3398.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419268,
            "factor_wrt_ss316_ss316l": 7.762454,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1996.56,
            "recommended": 2438.352,
            "high": 2676.24,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419248,
            "factor_wrt_ss316_ss316l": 6.563532,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1996.56,
            "recommended": 2217.456,
            "high": 2336.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.41959,
            "factor_wrt_ss316_ss316l": 6.750247,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1869.12,
            "recommended": 2338.524,
            "high": 2591.28,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419132,
            "factor_wrt_ss316_ss316l": 7.113381,
            "revision_note": "No change"
          },
          "2026": {
            "low": 2124.0,
            "recommended": 2400.12,
            "high": 2548.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 42.48,
            "factor_wrt_ss304": 11.419355,
            "factor_wrt_ss316_ss316l": 7.373641,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 42.48,
          "2022": 42.48,
          "2023": 42.48,
          "2024": 42.48,
          "2025": 42.48,
          "2026": 42.48
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Inconel 600",
        "pipe_mat_std": [
          "B167",
          "B517",
          "UNS N06600"
        ],
        "raw_material_basis": "High nickel chromium alloy stock",
        "rate_inr_per_kg": {
          "low": 1327.5,
          "recommended": 1500.075,
          "high": 1593.0
        },
        "source_material_name": "Inconel 600",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1460.25,
            "recommended": 1719.1125,
            "high": 1858.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137097,
            "factor_wrt_ss316_ss316l": 6.096144,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1433.7,
            "recommended": 1882.395,
            "high": 2124.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137043,
            "factor_wrt_ss316_ss316l": 4.851534,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1247.85,
            "recommended": 1523.97,
            "high": 1672.65,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.13703,
            "factor_wrt_ss316_ss316l": 4.102207,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1247.85,
            "recommended": 1385.91,
            "high": 1460.25,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137244,
            "factor_wrt_ss316_ss316l": 4.218904,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1168.2,
            "recommended": 1461.5775,
            "high": 1619.55,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.136957,
            "factor_wrt_ss316_ss316l": 4.445863,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1327.5,
            "recommended": 1500.075,
            "high": 1593.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 26.55,
            "factor_wrt_ss304": 7.137097,
            "factor_wrt_ss316_ss316l": 4.608525,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 26.55,
          "2022": 26.55,
          "2023": 26.55,
          "2024": 26.55,
          "2025": 26.55,
          "2026": 26.55
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Hastelloy C / B family",
        "pipe_mat_std": [
          "B622",
          "B619",
          "UNS N10276",
          "UNS N10665"
        ],
        "raw_material_basis": "Ni-Mo-Cr corrosion resistant alloy stock",
        "rate_inr_per_kg": {
          "low": 2655.0,
          "recommended": 3000.15,
          "high": 3186.0
        },
        "source_material_name": "Hastelloy C / B family",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 2920.5,
            "recommended": 3438.225,
            "high": 3717.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274194,
            "factor_wrt_ss316_ss316l": 12.192287,
            "revision_note": "No change"
          },
          "2022": {
            "low": 2867.4,
            "recommended": 3764.79,
            "high": 4248.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274085,
            "factor_wrt_ss316_ss316l": 9.703067,
            "revision_note": "No change"
          },
          "2023": {
            "low": 2495.7,
            "recommended": 3047.94,
            "high": 3345.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.27406,
            "factor_wrt_ss316_ss316l": 8.204415,
            "revision_note": "No change"
          },
          "2024": {
            "low": 2495.7,
            "recommended": 2771.82,
            "high": 2920.5,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274488,
            "factor_wrt_ss316_ss316l": 8.437808,
            "revision_note": "No change"
          },
          "2025": {
            "low": 2336.4,
            "recommended": 2923.155,
            "high": 3239.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.273915,
            "factor_wrt_ss316_ss316l": 8.891726,
            "revision_note": "No change"
          },
          "2026": {
            "low": 2655.0,
            "recommended": 3000.15,
            "high": 3186.0,
            "percentile_used": 0.65,
            "factor_wrt_cs": 53.1,
            "factor_wrt_ss304": 14.274194,
            "factor_wrt_ss316_ss316l": 9.217051,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 53.1,
          "2022": 53.1,
          "2023": 53.1,
          "2024": 53.1,
          "2025": 53.1,
          "2026": 53.1
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Alloy 20",
        "pipe_mat_std": [
          "B729",
          "B464",
          "UNS N08020"
        ],
        "raw_material_basis": "Ni-Cr-Fe alloy stock",
        "rate_inr_per_kg": {
          "low": 796.5,
          "recommended": 900.045,
          "high": 955.8
        },
        "source_material_name": "Alloy 20",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 876.15,
            "recommended": 1031.4675,
            "high": 1115.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 3.657686,
            "revision_note": "No change"
          },
          "2022": {
            "low": 860.22,
            "recommended": 1129.437,
            "high": 1274.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282226,
            "factor_wrt_ss316_ss316l": 2.91092,
            "revision_note": "No change"
          },
          "2023": {
            "low": 748.71,
            "recommended": 914.382,
            "high": 1003.59,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282218,
            "factor_wrt_ss316_ss316l": 2.461324,
            "revision_note": "No change"
          },
          "2024": {
            "low": 748.71,
            "recommended": 831.546,
            "high": 876.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282346,
            "factor_wrt_ss316_ss316l": 2.531342,
            "revision_note": "No change"
          },
          "2025": {
            "low": 700.92,
            "recommended": 876.9465,
            "high": 971.73,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282174,
            "factor_wrt_ss316_ss316l": 2.667518,
            "revision_note": "No change"
          },
          "2026": {
            "low": 796.5,
            "recommended": 900.045,
            "high": 955.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 15.93,
            "factor_wrt_ss304": 4.282258,
            "factor_wrt_ss316_ss316l": 2.765115,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 15.93,
          "2022": 15.93,
          "2023": 15.93,
          "2024": 15.93,
          "2025": 15.93,
          "2026": 15.93
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Nickel 200 / 201",
        "pipe_mat_std": [
          "B161",
          "B725",
          "UNS N02200",
          "UNS N02201"
        ],
        "raw_material_basis": "Commercial pure nickel stock",
        "rate_inr_per_kg": {
          "low": 1725.5,
          "recommended": 1949.815,
          "high": 2070.6
        },
        "source_material_name": "Nickel 200 / 201",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1898.05,
            "recommended": 2234.5225,
            "high": 2415.7,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276882,
            "factor_wrt_ss316_ss316l": 7.923839,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1863.54,
            "recommended": 2446.759,
            "high": 2760.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276811,
            "factor_wrt_ss316_ss316l": 6.30608,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1621.97,
            "recommended": 1980.874,
            "high": 2174.13,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276795,
            "factor_wrt_ss316_ss316l": 5.332097,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1621.97,
            "recommended": 1801.422,
            "high": 1898.05,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.277073,
            "factor_wrt_ss316_ss316l": 5.483781,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1518.44,
            "recommended": 1899.7755,
            "high": 2105.11,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276701,
            "factor_wrt_ss316_ss316l": 5.778785,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1725.5,
            "recommended": 1949.815,
            "high": 2070.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 34.51,
            "factor_wrt_ss304": 9.276882,
            "factor_wrt_ss316_ss316l": 5.990215,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 34.51,
          "2022": 34.51,
          "2023": 34.51,
          "2024": 34.51,
          "2025": 34.51,
          "2026": 34.51
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Monel 400",
        "pipe_mat_std": [
          "B165",
          "B725",
          "UNS N04400"
        ],
        "raw_material_basis": "Ni-Cu alloy stock",
        "rate_inr_per_kg": {
          "low": 1593.0,
          "recommended": 1800.09,
          "high": 1911.6
        },
        "source_material_name": "Monel 400",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 1752.3,
            "recommended": 2062.935,
            "high": 2230.2,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564516,
            "factor_wrt_ss316_ss316l": 7.315372,
            "revision_note": "No change"
          },
          "2022": {
            "low": 1720.44,
            "recommended": 2258.874,
            "high": 2548.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564451,
            "factor_wrt_ss316_ss316l": 5.82184,
            "revision_note": "No change"
          },
          "2023": {
            "low": 1497.42,
            "recommended": 1828.764,
            "high": 2007.18,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564436,
            "factor_wrt_ss316_ss316l": 4.922649,
            "revision_note": "No change"
          },
          "2024": {
            "low": 1497.42,
            "recommended": 1663.092,
            "high": 1752.3,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564693,
            "factor_wrt_ss316_ss316l": 5.062685,
            "revision_note": "No change"
          },
          "2025": {
            "low": 1401.84,
            "recommended": 1753.893,
            "high": 1943.46,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564349,
            "factor_wrt_ss316_ss316l": 5.335036,
            "revision_note": "No change"
          },
          "2026": {
            "low": 1593.0,
            "recommended": 1800.09,
            "high": 1911.6,
            "percentile_used": 0.65,
            "factor_wrt_cs": 31.86,
            "factor_wrt_ss304": 8.564516,
            "factor_wrt_ss316_ss316l": 5.53023,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 31.86,
          "2022": 31.86,
          "2023": 31.86,
          "2024": 31.86,
          "2025": 31.86,
          "2026": 31.86
        },
        "percentile_used": 0.65
      },
      {
        "ch_comp": "Aluminium",
        "pipe_mat_std": [
          "B241",
          "B345"
        ],
        "raw_material_basis": "Aluminium billet / extrusion stock / strip",
        "rate_inr_per_kg": {
          "low": 336.5,
          "recommended": 380.245,
          "high": 403.8
        },
        "source_material_name": "Aluminium",
        "yearly_rate_inr_per_kg": {
          "2021": {
            "low": 370.15,
            "recommended": 435.7675,
            "high": 471.1,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.80914,
            "factor_wrt_ss316_ss316l": 1.545275,
            "revision_note": "No change"
          },
          "2022": {
            "low": 363.42,
            "recommended": 477.157,
            "high": 538.4,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809126,
            "factor_wrt_ss316_ss316l": 1.229786,
            "revision_note": "No change"
          },
          "2023": {
            "low": 316.31,
            "recommended": 386.302,
            "high": 423.99,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809123,
            "factor_wrt_ss316_ss316l": 1.039844,
            "revision_note": "No change"
          },
          "2024": {
            "low": 316.31,
            "recommended": 351.306,
            "high": 370.15,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809177,
            "factor_wrt_ss316_ss316l": 1.069425,
            "revision_note": "No change"
          },
          "2025": {
            "low": 296.12,
            "recommended": 370.4865,
            "high": 410.53,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.809104,
            "factor_wrt_ss316_ss316l": 1.126955,
            "revision_note": "No change"
          },
          "2026": {
            "low": 336.5,
            "recommended": 380.245,
            "high": 403.8,
            "percentile_used": 0.65,
            "factor_wrt_cs": 6.73,
            "factor_wrt_ss304": 1.80914,
            "factor_wrt_ss316_ss316l": 1.168187,
            "revision_note": "No change"
          }
        },
        "factor_wrt_cs_by_year": {
          "2021": 6.73,
          "2022": 6.73,
          "2023": 6.73,
          "2024": 6.73,
          "2025": 6.73,
          "2026": 6.73
        },
        "percentile_used": 0.65
      }
    ]
  }
];

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
  document.querySelector("#theme-toggle-label").textContent =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("csPipeTheme", nextTheme);
  applyTheme(nextTheme);
}

function sizeGroup(size) {
  if (size <= 6) return "0.5-6 IN";
  if (size >= 8 && size <= 24) return "8-24 IN";
  if (size >= 26 && size <= 48) return "26-48 IN";
  return "Other";
}

function formatPipeSize(size) {
  const numericSize = Number(size);
  const fractionalSizes = {
    0.5: "1/2",
    0.75: "3/4",
    1.5: "1 1/2",
  };

  return fractionalSizes[numericSize] || String(numericSize).replace(/\.0$/, "");
}

function formatNumber(value, decimals = 2) {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatCurrency(value, decimals = 0) {
  if (!Number.isFinite(value)) return "-";
  return `Rs ${value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

function formatPlainCurrency(value, decimals = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(decimals);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanDisplayText(value) {
  return String(value || "")
    .replace(/Â½/g, "1/2")
    .replace(/Â¾/g, "3/4")
    .replace(/Â¼/g, "1/4")
    .replace(/Â/g, "")
    .trim();
}

function formatPercentChange(value) {
  const numericValue = Number(value) || 0;
  return `${numericValue > 0 ? "+" : ""}${numericValue}%`;
}

function getFactor(coating) {
  return coatingFactors[coating] || coatingFactors.No;
}

function flattenText(value) {
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  if (value && typeof value === "object") return Object.values(value).map(flattenText).join(" ");
  return String(value || "");
}

function normalizeMaterialText(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/ASTM/g, "")
    .replace(/GRADE/g, "GR")
    .replace(/\bGRA\b/g, "GR A")
    .replace(/\bGRB\b/g, "GR B")
    .replace(/\bGRC\b/g, "GR C")
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactMaterialText(value) {
  return normalizeMaterialText(value).replace(/[^A-Z0-9]+/g, "");
}

function extractMaterialSpec(value) {
  const text = normalizeMaterialText(value);
  const compact = compactMaterialText(value);
  const apiMatch = text.match(/\bAPI\s*5L\b/);
  const astmMatch = text.match(/\bA\s*([0-9]{2,4})(?=\b|GR|TP|$)/);
  const spec = apiMatch ? "API5L" : astmMatch ? `A${astmMatch[1]}` : "";
  const grades = new Set();

  const addGrade = (grade) => {
    const normalized = String(grade || "").toUpperCase().replace(/[^A-Z0-9]+/g, "");
    if (!normalized) return;
    grades.add(normalized);
    grades.add(normalized.replace(/^GR/, ""));
    grades.add(normalized.replace(/^TP/, ""));
  };

  const tpMatch = text.match(/\bTP\s*([0-9A-Z]+)\b/);
  if (tpMatch) {
    addGrade(`TP${tpMatch[1]}`);
    addGrade(tpMatch[1]);
  }

  const grMatch = text.match(/\bGR\s*([A-Z0-9]+)\b/);
  if (grMatch) addGrade(grMatch[1]);

  (compact.match(/(?:GR|TP)([A-Z0-9]+)/g) || []).forEach((match) =>
    addGrade(match.replace(/^(GR|TP)/, ""))
  );
  (compact.match(/X[0-9]{2,3}/g) || []).forEach(addGrade);

  return { spec, grades: Array.from(grades), compact };
}

function getJsonStandardAliases(standard) {
  const parsed = extractMaterialSpec(standard);
  if (!parsed.spec) return [];

  const normalized = normalizeMaterialText(standard);
  const gradeTokens = new Set(parsed.grades);
  const gradeSectionMatch = normalized.match(/\b(?:GR|TP)\s*([A-Z0-9][A-Z0-9\s\/,.-]*)/);

  if (gradeSectionMatch) {
    gradeSectionMatch[1]
      .split(/[\s\/,.-]+/)
      .map((token) => token.trim())
      .filter(Boolean)
      .forEach((token) => gradeTokens.add(token.replace(/[^A-Z0-9]+/g, "")));
  }

  return [
    {
      spec: parsed.spec,
      grades: Array.from(gradeTokens).filter(Boolean),
      compact: parsed.compact,
      label: String(standard || ""),
    },
  ];
}

function classifyMaterialSpec(specText) {
  const parsedInput = extractMaterialSpec(specText);
  const inputCompact = compactMaterialText(specText);

  if (!materialSpecificationRows.length) {
    return {
      category: "Unclassified",
      matchedStandard: "",
      matchId: "",
      note:
        materialSpecificationStatus === "failed"
          ? "ASTM JSON not loaded"
          : "ASTM JSON loading",
    };
  }

  let bestMatch = null;
  let bestScore = 0;

  materialSpecificationRows.forEach((row) => {
    (row.pipeAliases || []).forEach((alias) => {
      let score = 0;
      if (parsedInput.spec && alias.spec === parsedInput.spec) score += 60;
      if (alias.compact && inputCompact.includes(alias.compact)) score += 45;
      if (parsedInput.compact && alias.compact.includes(parsedInput.compact)) score += 25;

      const matchingGrade = parsedInput.grades.find((grade) => alias.grades.includes(grade));
      if (matchingGrade) score += 45;
      if (parsedInput.spec && alias.spec === parsedInput.spec && !parsedInput.grades.length) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          category: row.basic_material_of_construction || "Unclassified",
          matchedStandard: alias.label,
          matchId: row.id,
          note: matchingGrade ? `Matched grade ${matchingGrade}` : "Matched material standard",
        };
      }
    });
  });

  if (!bestMatch || bestScore < 60) {
    return {
      category: "Unclassified",
      matchedStandard: "",
      matchId: "",
      note: "No ASTM pipe material standard match",
    };
  }

  return bestMatch;
}

function applyMaterialCategory(item) {
  const match = classifyMaterialSpec(item.spec);
  item.materialCategory = match.category;
  item.materialMatchedStandard = match.matchedStandard;
  item.materialMatchId = match.matchId;
  item.materialMatchNote = match.note;
  return item;
}

function addCarbonSteelPipeStandards(rows) {
  const normalizedRows = Array.isArray(rows) ? rows.map((row) => ({ ...row })) : [];
  const carbonRow = normalizedRows.find((row) =>
    String(row.basic_material_of_construction || "").toLowerCase().includes("carbon steel")
  );

  if (!carbonRow) return normalizedRows;

  carbonRow.pipes = carbonRow.pipes || {};
  const standards = carbonRow.pipes.material_standard || [];
  additionalCarbonSteelPipeStandards.forEach((standard) => {
    if (!standards.some((existing) => compactMaterialText(existing) === compactMaterialText(standard))) {
      standards.push(standard);
    }
  });
  carbonRow.pipes.material_standard = standards;
  return normalizedRows;
}

function prepareMaterialSpecificationRows(rows) {
  return addCarbonSteelPipeStandards(rows).map((row) => ({
    ...row,
    pipeAliases: (row.pipes?.material_standard || []).flatMap(getJsonStandardAliases),
  }));
}

async function loadMaterialSpecificationData() {
  materialSpecificationRows = prepareMaterialSpecificationRows(builtInMaterialSpecificationRows);
  materialSpecificationStatus = "built-in";
  lineItems.forEach(applyMaterialCategory);

  try {
    const response = await fetch("astm_piping_material_specification_webapp.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    materialSpecificationRows = prepareMaterialSpecificationRows(
      data.material_specification_rows || []
    );
    materialSpecificationStatus = "loaded";
    lineItems.forEach(applyMaterialCategory);
    renderLineItems();
  } catch (error) {
    materialSpecificationRows = prepareMaterialSpecificationRows(builtInMaterialSpecificationRows);
    materialSpecificationStatus = "built-in";
    lineItems.forEach(applyMaterialCategory);
    renderLineItems();
  }
}

function resetRawMaterialLibraryOutputs(message = "-") {
  elements.materialStandardOutput.textContent = message;
  elements.rawMaterialBasisOutput.textContent = message;
  elements.rawMaterialRangeOutput.textContent = message;
  elements.recommendedRateOutput.textContent = message;
  elements.factorCsOutput.value = message;
}

function getSelectedRawMaterialGroup() {
  return rawMaterialPriceLibrary.find(
    (group) => group.basic_mat_of_const === elements.materialBasis.value
  );
}

function getSelectedRawMaterialItem() {
  const group = getSelectedRawMaterialGroup();
  if (!group) return null;
  const itemIndex = String(elements.materialGradeFamily.value || "").split("|")[0];
  return (group.children || []).find(
    (_, index) => String(index) === itemIndex
  );
}

function getSelectedPipeMaterialStandard() {
  const item = getSelectedRawMaterialItem();
  if (!item) return "";

  const [, standardIndex = "0"] = String(elements.materialGradeFamily.value || "").split("|");
  const standards = (item.pipe_mat_std || []).map(cleanDisplayText);
  return standards[Number(standardIndex)] || standards[0] || "";
}

function getRawMaterialGradeLabel(item) {
  const family = item?.grade_family || item?.ch_comp || "Grade family";
  const chComp = item?.grade_family && item?.ch_comp ? ` / ${item.ch_comp}` : "";
  return cleanDisplayText(`${family}${chComp}`);
}

function getSelectedPriceYear(year = elements.year.value) {
  const numericYear = Number(year) || 2026;
  return String(numericYear);
}

function getRawMaterialYearRate(item, year = elements.year.value) {
  const selectedYear = getSelectedPriceYear(year);
  const yearlyRate = item?.yearly_rate_inr_per_kg?.[selectedYear];
  const fallbackRate = item?.rate_inr_per_kg || {};
  const rate = yearlyRate || fallbackRate;
  const recommended = Number(rate.recommended);
  const low = Number(rate.low);
  const high = Number(rate.high);
  const factorWrtCs = Number(
    rate.factor_wrt_cs ?? item?.factor_wrt_cs_by_year?.[selectedYear]
  );

  return {
    year: selectedYear,
    low,
    recommended,
    high,
    percentileUsed: Number(rate.percentile_used ?? item?.percentile_used),
    factorWrtCs,
    revisionNote: rate.revision_note || "",
  };
}

function scoreRawMaterialStandardMatch(inputText, standardText) {
  const parsedInput = extractMaterialSpec(inputText);
  const parsedStandard = extractMaterialSpec(standardText);
  const inputCompact = compactMaterialText(inputText);
  const standardCompact = compactMaterialText(standardText);
  let score = 0;

  if (!inputCompact || !standardCompact) return 0;
  if (parsedInput.spec && parsedStandard.spec && parsedInput.spec === parsedStandard.spec) score += 60;
  if (standardCompact && inputCompact.includes(standardCompact)) score += 45;
  if (inputCompact && standardCompact.includes(inputCompact)) score += 25;

  const gradeMatch = parsedInput.grades.find((grade) => parsedStandard.grades.includes(grade));
  if (gradeMatch) score += 45;
  if (parsedInput.spec && parsedInput.spec === parsedStandard.spec && !parsedInput.grades.length) score += 10;

  return score;
}

function getRawMaterialPriceMapping(specText, year = elements.year.value) {
  let bestMatch = null;
  let bestScore = 0;

  rawMaterialPriceLibrary.forEach((group) => {
    (group.children || []).forEach((item) => {
      (item.pipe_mat_std || []).forEach((standard) => {
        const score = scoreRawMaterialStandardMatch(specText, standard);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = { group, item, standard };
        }
      });
    });
  });

  if (!bestMatch || bestScore < 60) return null;

  const rate = getRawMaterialYearRate(bestMatch.item, year);
  const recommended = Number(rate.recommended);
  if (!Number.isFinite(recommended) || recommended <= 0) return null;

  const range = `${formatCurrency(Number(rate.low), 2)} to ${formatCurrency(Number(rate.high), 2)}`;
  const basis = cleanDisplayText(bestMatch.item.raw_material_basis || "-");
  const groupName = cleanDisplayText(bestMatch.group.basic_mat_of_const);
  const gradeLabel = getRawMaterialGradeLabel(bestMatch.item);

  return {
    recommended,
    basis,
    range,
    factorWrtCs: rate.factorWrtCs,
    year: rate.year,
    groupName,
    gradeLabel,
    standard: cleanDisplayText(bestMatch.standard),
    note: `BOM material raw price mapping for ${rate.year}: ${groupName} / ${gradeLabel}; matched ${cleanDisplayText(
      bestMatch.standard
    )}; basis ${basis}; range ${range}; factor w.r.t. CS ${formatNumber(rate.factorWrtCs, 2)}`,
  };
}

function populateRawMaterialBasisOptions() {
  elements.materialBasis.innerHTML = '<option value="">Select material group</option>';
  rawMaterialPriceLibrary.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.basic_mat_of_const;
    option.textContent = cleanDisplayText(group.basic_mat_of_const);
    elements.materialBasis.append(option);
  });
}

function populateRawMaterialGradeOptions() {
  const group = getSelectedRawMaterialGroup();
  elements.materialGradeFamily.innerHTML = '<option value="">Select pipe material standard</option>';
  elements.materialGradeFamily.disabled = !group;

  if (!group) {
    resetRawMaterialLibraryOutputs("-");
    return;
  }

  (group.children || []).forEach((item, index) => {
    (item.pipe_mat_std || []).forEach((standard, standardIndex) => {
      const option = document.createElement("option");
      option.value = `${index}|${standardIndex}`;
      option.textContent = cleanDisplayText(standard);
      elements.materialGradeFamily.append(option);
    });
  });
  resetRawMaterialLibraryOutputs("Select pipe material standard");
}

function getDefaultPipeStandardValue(group, itemIndex = 0) {
  const item = group?.children?.[itemIndex];
  if (!item) return "";
  const standards = (item.pipe_mat_std || []).map(cleanDisplayText);
  const preferredIndex = standards.findIndex((standard) => /A106/i.test(standard));
  return `${itemIndex}|${preferredIndex >= 0 ? preferredIndex : 0}`;
}

function refreshRawMaterialLibrarySelection(previousBasis = "", previousGrade = "") {
  populateRawMaterialBasisOptions();

  if (previousBasis) {
    elements.materialBasis.value = previousBasis;
  }

  if (!elements.materialBasis.value) {
    selectDefaultCarbonSteelPrice();
    return;
  }

  populateRawMaterialGradeOptions();

  if (previousGrade) {
    elements.materialGradeFamily.value = previousGrade.includes("|")
      ? previousGrade
      : getDefaultPipeStandardValue(getSelectedRawMaterialGroup(), Number(previousGrade) || 0);
  }

  if (elements.materialGradeFamily.value) {
    applyRawMaterialPriceSelection();
  } else if (isCarbonSteelRawMaterialSelection()) {
    elements.materialGradeFamily.value = getDefaultPipeStandardValue(getSelectedRawMaterialGroup(), 0);
    applyRawMaterialPriceSelection();
  } else {
    clearRawMaterialPriceSelection();
  }
}

function isCarbonSteelRawMaterialSelection() {
  return elements.materialBasis.value === "Carbon Steel";
}

function hasIncompleteNonCarbonSteelSelection() {
  return Boolean(elements.materialBasis.value) &&
    !isCarbonSteelRawMaterialSelection() &&
    !elements.materialGradeFamily.value;
}

function clearRawMaterialPriceSelection() {
  elements.rawOverride.value = "";
  delete elements.rawOverride.dataset.source;
  delete elements.rawOverride.dataset.sourceType;
}

function selectDefaultCarbonSteelPrice() {
  const carbonSteelGroup = rawMaterialPriceLibrary.find(
    (group) => group.basic_mat_of_const === "Carbon Steel"
  );
  if (!carbonSteelGroup) return;

  elements.materialBasis.value = carbonSteelGroup.basic_mat_of_const;
  populateRawMaterialGradeOptions();
  elements.materialGradeFamily.value = getDefaultPipeStandardValue(carbonSteelGroup, 0);
  applyRawMaterialPriceSelection();
}

function applyRawMaterialPriceSelection() {
  const item = getSelectedRawMaterialItem();
  if (!item) {
    resetRawMaterialLibraryOutputs(elements.materialBasis.value ? "Select pipe material standard" : "-");
    clearRawMaterialPriceSelection();
    return;
  }

  const rate = getRawMaterialYearRate(item);
  const standardList = (item.pipe_mat_std || []).map(cleanDisplayText);
  const selectedStandard = getSelectedPipeMaterialStandard() || standardList[0] || "";
  const basis = cleanDisplayText(item.raw_material_basis || "-");
  const range = `${formatCurrency(Number(rate.low), 2)} to ${formatCurrency(Number(rate.high), 2)}`;
  const recommended = Number(rate.recommended);
  const factorWrtCs = Number(rate.factorWrtCs);

  elements.materialStandardOutput.textContent = getRawMaterialGradeLabel(item);
  elements.rawMaterialBasisOutput.textContent = basis;
  elements.rawMaterialRangeOutput.textContent = range;
  elements.recommendedRateOutput.textContent = Number.isFinite(recommended)
    ? formatCurrency(recommended, 2)
    : "-";
  elements.factorCsOutput.value = Number.isFinite(factorWrtCs)
    ? formatNumber(factorWrtCs, 2)
    : "-";

  if (Number.isFinite(recommended) && recommended > 0) {
    elements.rawOverride.value = recommended.toFixed(2);
    elements.spec.value = selectedStandard || "Other spec";
    elements.rawOverride.dataset.sourceType = "materialLibrary";
    elements.rawOverride.dataset.source = `Suggested raw material mapping: ${cleanDisplayText(
      elements.materialBasis.value
    )} / ${getRawMaterialGradeLabel(item)}; year ${rate.year}; basis ${basis}; range ${range}; factor w.r.t. CS ${
      Number.isFinite(factorWrtCs) ? formatNumber(factorWrtCs, 2) : "-"
    }`;
  }
}

async function loadRawMaterialPriceLibrary() {
  const previousBasis = elements.materialBasis.value;
  const previousGrade = elements.materialGradeFamily.value;
  rawMaterialPriceLibrary = builtInRawMaterialPriceLibrary;
  rawMaterialPriceLibraryStatus = "built-in";
  refreshRawMaterialLibrarySelection(previousBasis, previousGrade);

  try {
    const activeBasis = elements.materialBasis.value;
    const activeGrade = elements.materialGradeFamily.value;
    const response = await fetch("raw_material_price_library.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    rawMaterialPriceLibrary = data.raw_material_price_library?.length
      ? data.raw_material_price_library
      : builtInRawMaterialPriceLibrary;
    rawMaterialPriceLibraryStatus = "loaded";
    refreshRawMaterialLibrarySelection(activeBasis, activeGrade);
  } catch (error) {
    rawMaterialPriceLibrary = builtInRawMaterialPriceLibrary;
    rawMaterialPriceLibraryStatus = "failed";
    refreshRawMaterialLibrarySelection(elements.materialBasis.value, elements.materialGradeFamily.value);
  }
}

function normalizeSchedule(value) {
  const raw = String(value || "").trim().toUpperCase();
  if (!raw) return "";

  const normalized = raw
    .replace(/SCHEDULE|SCH\.?|SCHED\.?/g, "")
    .replace(/#/g, "")
    .replace(/STANDARD/g, "STD")
    .replace(/HEAVY/g, "HVY")
    .replace(/EXTRA\s*STRONG/g, "XS")
    .replace(/DOUBLE\s*EXTRA\s*STRONG/g, "XXS")
    .replace(/[^A-Z0-9]+/g, "");

  if (normalized === "SSTD" || normalized === "STD" || normalized === "ST") return "STD";
  if (normalized === "SHVY" || normalized === "HVY" || normalized === "HY") return "HVY";
  if (normalized === "SXS" || normalized === "XS") return "XS";
  if (normalized === "SXXS" || normalized === "XXS") return "XXS";

  const sizeSchedule = normalized.match(/^S?(\d+S?)$/);
  return sizeSchedule ? sizeSchedule[1] : normalized;
}

function getScheduleThickness(size, schedule) {
  const scheduleKey = normalizeSchedule(schedule);
  return scheduleThicknessTable[Number(size)]?.[scheduleKey] ?? NaN;
}

function parseThicknessInput(value, size) {
  const numericValue = parseBomNumber(value);
  const text = String(value || "");
  const hasScheduleSignal = /[A-Za-z#-]/.test(text);

  if (Number.isFinite(numericValue) && !hasScheduleSignal) {
    return numericValue;
  }

  const scheduleThickness = getScheduleThickness(size, value);
  return Number.isFinite(scheduleThickness) ? scheduleThickness : numericValue;
}

function updateThicknessMode() {
  inputError = "";
  const isScheduleMode = elements.thicknessMode.value === "schedule";
  elements.scheduleField.classList.toggle("hidden", !isScheduleMode);
  elements.scheduleField.classList.toggle("schedule-active", isScheduleMode);
  elements.thicknessLabel.textContent = isScheduleMode
    ? "Calculated Thickness MM"
    : "Thickness MM";
  elements.thickness.readOnly = isScheduleMode;

  if (!isScheduleMode) return;

  const size = Number(elements.size.value);
  const thickness = getScheduleThickness(size, elements.schedule.value);
  if (Number.isFinite(thickness)) {
    elements.thickness.value = thickness.toFixed(2);
    elements.warning.textContent = "";
  } else {
    elements.thickness.value = "";
    inputError = "Select valid schedule from B36.10 or B36.19";
    elements.warning.textContent = inputError;
  }
}

function createId() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function buildEstimate(input) {
  const year = Number(input.year) || 2026;
  const size = Number(input.size);
  const thickness = Number(input.thickness);
  const length = Number(input.length);
  const coating = input.coating === "Yes" ? "Yes" : "No";
  const spec = String(input.spec || "Other spec").trim() || "Other spec";
  const od = odTable[size];
  const group = sizeGroup(size);
  const rawOverride = Number(input.rawOverride);
  const factorOverride = Number(input.factorOverride);
  const rawOverrideApplied = rawOverride > 0;
  const factorOverrideApplied = factorOverride > 0;
  const rawSteel = rawOverrideApplied ? rawOverride : rawSteelByYear[year] || rawSteelByYear[2026];
  const baseFactors = getFactor(coating);
  const p90Multiplier = baseFactors.p90 / baseFactors.median;
  const factors =
    factorOverrideApplied
      ? {
          ...baseFactors,
          median: factorOverride,
          p90: factorOverride * p90Multiplier,
          source: "Custom estimate factor",
        }
      : baseFactors;

  if (!od) {
    return { error: `Pipe size ${input.size || ""} is not available in the OD table.` };
  }

  if (!Number.isFinite(thickness) || !Number.isFinite(length) || thickness <= 0 || length < 0) {
    return { error: "Thickness must be positive and length cannot be negative." };
  }

  if (thickness >= od / 2) {
    return {
      error:
        "Wall thickness is physically impossible because it is greater than or equal to pipe radius.",
    };
  }

  const weightKgm = 0.0246615 * (od - thickness) * thickness;
  const totalWeight = weightKgm * length;
  const medianRsKg = rawSteel * factors.median;
  const p90RsKg = rawSteel * factors.p90;
  const medianRsM = medianRsKg * weightKgm;
  const p90RsM = p90RsKg * weightKgm;
  const medianTotal = medianRsM * length;
  const p90Total = p90RsM * length;

  return applyMaterialCategory({
    id: createId(),
    year,
    size,
    thickness,
    length,
    spec,
    coating,
    od,
    group,
    rawSteel,
    rawSteelSource: input.rawSteelSource || (rawOverrideApplied ? "manualOverride" : "defaultYear"),
    factors,
    rawSteelBasis: rawOverrideApplied
      ? input.rawBasisNote || "User-entered Raw Steel Rs/kg Override"
      : `Default raw steel basis for ${year}`,
    factorBasis: factorOverrideApplied
      ? `User-entered Estimate Factor Override; P90 recalculated using default multiplier ${formatNumber(
          p90Multiplier,
          3
        )}`
      : `Default ${coating === "Yes" ? "coated" : "non-coated"} pipe factor`,
    weightKgm,
    totalWeight,
    medianRsKg,
    p90RsKg,
    medianRsM,
    p90RsM,
    medianTotal,
    p90Total,
  });
}

function getCurrentEstimate() {
  return buildEstimate({
    year: elements.year.value,
    size: elements.size.value,
    thickness: elements.thickness.value,
    length: elements.length.value,
    spec: elements.spec.value,
    coating: elements.coating.value,
    rawOverride: elements.rawOverride.value,
    rawBasisNote: elements.rawOverride.dataset.source,
    rawSteelSource: elements.rawOverride.dataset.sourceType,
    factorOverride: elements.factorOverride.value,
  });
}

function getLineItemFactorOverride(item) {
  return String(item.factorBasis || "").startsWith("User-entered")
    ? item.factors?.median
    : "";
}

function refreshLineItemYearPrices() {
  if (!lineItems.length) return;

  const selectedYear = Number(elements.year.value) || 2026;
  const refreshedItems = lineItems.map((item) => {
    const rawMapping =
      item.rawSteelSource === "materialLibrary"
        ? getRawMaterialPriceMapping(item.spec, selectedYear)
        : null;
    const rawOverride =
      item.rawSteelSource === "materialLibrary"
        ? rawMapping?.recommended || item.rawSteel
        : item.rawSteelSource === "bomOverride" || item.rawSteelSource === "manualOverride"
          ? item.rawSteel
          : "";

    const refreshed = buildEstimate({
      year: selectedYear,
      size: item.size,
      thickness: item.thickness,
      length: item.length,
      spec: item.spec,
      coating: item.coating,
      rawOverride,
      rawSteelSource: item.rawSteelSource,
      rawBasisNote:
        item.rawSteelSource === "materialLibrary"
          ? rawMapping?.note || item.rawSteelBasis
          : item.rawSteelBasis,
      factorOverride: getLineItemFactorOverride(item),
    });

    if (refreshed.error) return item;

    return {
      ...refreshed,
      id: item.id,
      source: item.source,
      sourceName: item.sourceName,
      sourceKey: item.sourceKey,
    };
  });

  lineItems.splice(0, lineItems.length, ...refreshedItems);
  renderLineItems();
  updateReportGenerated();
}

function renderCurrentEstimate(estimate) {
  elements.factorSource.textContent = `${estimate.factors.source} / ${estimate.group}`;
  elements.odMm.textContent = `${formatNumber(estimate.od, 1)} mm`;
  elements.weightKgm.textContent = formatNumber(estimate.weightKgm, 2);
  elements.totalWeight.textContent = formatNumber(estimate.totalWeight, 2);
  elements.rawSteel.textContent = formatCurrency(estimate.rawSteel, 2);
  elements.medianFactor.textContent = formatNumber(estimate.factors.median, 2);
  elements.medianRsKg.textContent = formatCurrency(estimate.medianRsKg, 2);
  elements.medianRsM.textContent = formatCurrency(estimate.medianRsM, 2);
  elements.medianTotal.textContent = formatCurrency(estimate.medianTotal, 0);
  elements.p90Factor.textContent = formatNumber(estimate.factors.p90, 2);
  elements.p90RsKg.textContent = formatCurrency(estimate.p90RsKg, 2);
  elements.p90RsM.textContent = formatCurrency(estimate.p90RsM, 2);
  elements.p90Total.textContent = formatCurrency(estimate.p90Total, 0);
  renderWhatIfAnalysis();
}

function calculate() {
  elements.warning.textContent = "";
  updateOverrideReview();

  if (inputError) {
    elements.warning.textContent = inputError;
    return null;
  }

  if (hasIncompleteNonCarbonSteelSelection()) {
    elements.warning.textContent =
      "Select Pipe Material Standard before estimating non-carbon-steel pipe.";
    return null;
  }

  const estimate = getCurrentEstimate();

  if (estimate.error) {
    elements.warning.textContent = estimate.error;
    return null;
  }

  renderCurrentEstimate(estimate);
  return estimate;
}

function renderLineItems() {
  elements.lineCount.textContent = `${lineItems.length} ${lineItems.length === 1 ? "line" : "lines"}`;
  updateOverrideReview();
  updateSortButtons();

  if (lineItems.length === 0) {
    elements.lineItemsBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="12">No pipe lines added yet.</td>
      </tr>
    `;
    elements.summaryWeight.textContent = "-";
    elements.summaryMedian.textContent = "-";
    elements.summaryP90.textContent = "-";
    renderMaterialCategoryTables([]);
    renderWhatIfAnalysis();
    return;
  }

  applySort();
  updateSortButtons();

  elements.lineItemsBody.innerHTML = lineItems
    .map(
      (item) => `
        <tr>
          <td data-label="Size">${formatPipeSize(item.size)} IN</td>
          <td data-label="Thk mm">${formatNumber(item.thickness, 2)}</td>
          <td class="text-column" data-label="Material">${item.spec}</td>
          <td data-label="Length m">${formatNumber(item.length, 2)}</td>
          <td data-label="Coating">${item.coating}</td>
          <td data-label="Factor">${formatNumber(item.factors.median, 2)} / ${formatNumber(item.factors.p90, 2)}</td>
          <td data-label="Kg/m">${formatNumber(item.weightKgm, 2)}</td>
          <td data-label="Total kg">${formatNumber(item.totalWeight, 2)}</td>
          <td data-label="Rs/m">${formatCurrency(item.medianRsM, 2)}</td>
          <td data-label="Normal total">${formatCurrency(item.medianTotal, 0)}</td>
          <td data-label="P90 total">${formatCurrency(item.p90Total, 0)}</td>
          <td data-label="Action">
            <button class="remove-line" type="button" data-id="${item.id}">Remove</button>
          </td>
        </tr>
      `
    )
    .join("");

  const summary = getSummary(lineItems);

  elements.summaryWeight.textContent = `${formatNumber(summary.weight, 2)} kg`;
  elements.summaryMedian.textContent = formatCurrency(summary.median, 0);
  elements.summaryP90.textContent = formatCurrency(summary.p90, 0);
  renderMaterialCategoryTables(lineItems);
  renderWhatIfAnalysis();
}

function groupItemsByMaterialCategory(items) {
  return items.reduce((groups, item) => {
    const category = item.materialCategory || "Unclassified";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(item);
    return groups;
  }, new Map());
}

function formatCategoryHeading(category) {
  const cleanCategory = String(category || "Unclassified").trim() || "Unclassified";
  return /\bpipe\b/i.test(cleanCategory) ? cleanCategory : `${cleanCategory} Pipe`;
}

function getCategoryHeadingClass(category) {
  const normalizedCategory = String(category || "").toLowerCase();
  if (normalizedCategory.includes("unclassified")) return "category-heading-unclassified";
  if (normalizedCategory.includes("duplex")) return "category-heading-duplex";
  if (normalizedCategory.includes("stainless")) return "category-heading-stainless";
  if (normalizedCategory.includes("non-ferrous") || normalizedCategory.includes("monel") || normalizedCategory.includes("inconel")) {
    return "category-heading-nonferrous";
  }
  if (normalizedCategory.includes("alloy")) return "category-heading-alloy";
  if (normalizedCategory.includes("low temp")) return "category-heading-lowtemp";
  if (normalizedCategory.includes("carbon")) return "category-heading-carbon";
  return "category-heading-default";
}

function renderMaterialCategoryTables(items) {
  if (!elements.categoryTables || !elements.categoryCount) return;

  if (!items.length) {
    elements.categoryCount.textContent = "0 categories";
    if (elements.categoryLineCheck) {
      elements.categoryLineCheck.textContent = "Line check: 0 / 0";
      elements.categoryLineCheck.classList.remove("audit-line-check-warning");
    }
    elements.categoryTables.innerHTML =
      '<p class="empty-note">Upload a BOM or add pipe lines to view category-wise tables.</p>';
    return;
  }

  const groups = Array.from(groupItemsByMaterialCategory(items).entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  elements.categoryCount.textContent = `${groups.length} ${
    groups.length === 1 ? "category" : "categories"
  }`;
  if (elements.categoryLineCheck) {
    const categorizedLineCount = groups.reduce((total, [, categoryItems]) => total + categoryItems.length, 0);
    const isMatched = categorizedLineCount === items.length;
    elements.categoryLineCheck.textContent = `Line check: ${categorizedLineCount} / ${items.length}`;
    elements.categoryLineCheck.classList.toggle("audit-line-check-warning", !isMatched);
  }

  const categorySummaryTable = `
    <div class="category-estimate-summary">
      <h4>Material Category Estimate Summary</h4>
      <p class="category-disclaimer">
        Non-CS material estimates use the same factor-based method and are indicative only.
        Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations.
      </p>
      <div class="table-wrap">
        <table class="category-summary-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Line count</th>
              <th>Total kg</th>
              <th>Normal total</th>
              <th>P90 total</th>
              <th>Raw Rs/kg</th>
              <th>Avg Rs/kg</th>
            </tr>
          </thead>
          <tbody>
            ${groups
              .map(([category, categoryItems]) => {
                const summary = getSummary(categoryItems);
                return `
                  <tr>
                    <td class="text-column" data-label="Category">${escapeHtml(formatCategoryHeading(category))}</td>
                    <td data-label="Line count">${categoryItems.length}</td>
                    <td data-label="Total kg">${formatNumber(summary.weight, 2)}</td>
                    <td data-label="Normal total">${formatCurrency(summary.median, 0)}</td>
                    <td data-label="P90 total">${formatCurrency(summary.p90, 0)}</td>
                    <td data-label="Raw Rs/kg">${formatCurrency(getCategoryAverageRawRsKg(categoryItems), 2)}</td>
                    <td data-label="Avg Rs/kg">${formatCurrency(getCategoryAverageRsKg(summary), 2)}</td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const categoryDetailTables = groups
    .map(([category, categoryItems]) => {
      const summary = getSummary(categoryItems);
      return `
        <article class="category-table-card">
          <div class="category-table-title">
            <div>
              <h4 class="${getCategoryHeadingClass(category)}">${escapeHtml(
                formatCategoryHeading(category)
              )}</h4>
              <p>${categoryItems.length} ${
                categoryItems.length === 1 ? "line" : "lines"
              } | ${formatNumber(summary.weight, 2)} kg | <span class="category-summary-rs">${formatCurrency(
                summary.median,
                0
              )}</span> normal total</p>
            </div>
          </div>
          <div class="table-wrap">
            <table class="category-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Thk mm</th>
                  <th class="text-column">BOM Material</th>
                  <th>Length m</th>
                  <th>Total kg</th>
                  <th>Rs/m</th>
                  <th>Normal total</th>
                  <th>P90 total</th>
                </tr>
              </thead>
              <tbody>
                ${categoryItems
                  .map(
                    (item) => `
                      <tr>
                        <td data-label="Size">${formatPipeSize(item.size)} IN</td>
                        <td data-label="Thk mm">${formatNumber(item.thickness, 2)}</td>
                        <td class="text-column" data-label="BOM Material">${escapeHtml(item.spec)}</td>
                        <td data-label="Length m">${formatNumber(item.length, 2)}</td>
                        <td data-label="Total kg">${formatNumber(item.totalWeight, 2)}</td>
                        <td data-label="Rs/m">${formatCurrency(item.medianRsM, 2)}</td>
                        <td data-label="Normal total">${formatCurrency(item.medianTotal, 0)}</td>
                        <td data-label="P90 total">${formatCurrency(item.p90Total, 0)}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
          <details class="category-audit-details">
            <summary>Audit matching details</summary>
            <div class="table-wrap">
              <table class="category-audit-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th class="text-column">BOM Material</th>
                    <th class="text-column">Matched JSON Standard</th>
                    <th>Match ID</th>
                  </tr>
                </thead>
                <tbody>
                  ${categoryItems
                    .map(
                      (item) => `
                        <tr>
                          <td data-label="Size">${formatPipeSize(item.size)} IN</td>
                          <td class="text-column" data-label="BOM Material">${escapeHtml(item.spec)}</td>
                          <td class="text-column" data-label="Matched JSON Standard">${escapeHtml(
                            item.materialMatchedStandard || item.materialMatchNote || "No match"
                          )}</td>
                          <td data-label="Match ID">${escapeHtml(item.materialMatchId || "-")}</td>
                        </tr>
                      `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </details>
        </article>
      `;
    })
    .join("");

  elements.categoryTables.innerHTML = categorySummaryTable + categoryDetailTables;
}

function normalizeBomGroupText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isBomNoteLikeItem(itemText) {
  const raw = String(itemText || "").trim();
  const normalized = normalizeBomGroupText(raw);
  if (!normalized) return true;

  const sizeOnlyPattern =
    /^(\d+(?:\.\d+)?|\d+\s+\d+\/\d+|\d+\/\d+)\s*(?:in|inch|mm|nb)?$/i;
  const ratingOnlyPattern = /^\d+\s*(?:#|lb|class)?$/i;
  const boltSizeOnlyPattern = /^m\d+\s*x\s*\d+$/i;
  const notePattern = /\b(as per|refer|provided by|procure with|datasheet|data sheet|note)\b/i;

  return (
    sizeOnlyPattern.test(raw.replace(/["']/g, "")) ||
    ratingOnlyPattern.test(raw) ||
    boltSizeOnlyPattern.test(raw) ||
    notePattern.test(raw)
  );
}

function getComponentAliasMatch(itemText) {
  const normalized = normalizeBomGroupText(itemText);
  if (!normalized) return null;

  return componentAliasMap.find((component) =>
    component.aliases.some((alias) => normalized.includes(normalizeBomGroupText(alias)))
  );
}

function classifyBomGroup(itemText) {
  const normalized = normalizeBomGroupText(itemText);
  if (!normalized) return { group: "Other Group", standardName: "" };
  if (isBomNoteLikeItem(itemText)) return { group: "Other Group", standardName: "" };

  const aliasMatch = getComponentAliasMatch(itemText);
  if (aliasMatch) {
    return { group: aliasMatch.group, standardName: aliasMatch.standardName };
  }

  const group = bomGroupDefinitions.find((definition) =>
    definition.keywords.some((keyword) => normalized.includes(normalizeBomGroupText(keyword)))
  );

  return { group: group ? group.name : "Other Group", standardName: "" };
}

function buildBomGroupItem(row, columns, sourceName, sourceKey) {
  const itemText = columns.item ? row[columns.item] : "";
  const sizeText = columns.size ? row[columns.size] : "";
  const thicknessText = columns.thickness ? row[columns.thickness] : "";
  const lengthText = columns.length ? row[columns.length] : "";
  const uomText = columns.uom ? row[columns.uom] : "";
  const materialText = columns.spec ? row[columns.spec] : "";

  if (!String(itemText || "").trim()) return null;
  const classification = classifyBomGroup(itemText);

  return {
    id: createId(),
    sourceName,
    sourceKey,
    group: classification.group,
    standardName: classification.standardName,
    item: String(itemText || "").trim(),
    size: String(sizeText || "").trim(),
    thickness: String(thicknessText || "").trim(),
    material: String(materialText || "").trim(),
    quantity: String(lengthText || "").trim(),
    uom: String(uomText || "").trim(),
  };
}

function groupBomItems(items) {
  const groups = new Map(bomGroupDefinitions.map((definition) => [definition.name, []]));
  items.forEach((item) => {
    if (!groups.has(item.group)) groups.set(item.group, []);
    groups.get(item.group).push(item);
  });
  return Array.from(groups.entries()).filter(([, groupItems]) => groupItems.length > 0);
}

function getBomGroupHeadingClass(groupName) {
  const normalized = String(groupName || "").toLowerCase();
  if (normalized.includes("pipe")) return "bom-heading-pipe";
  if (normalized.includes("fitting")) return "bom-heading-fitting";
  if (normalized.includes("flange")) return "bom-heading-flange";
  if (normalized.includes("valves")) return "bom-heading-valve";
  if (normalized.includes("bolt")) return "bom-heading-bolt";
  if (normalized.includes("gasket")) return "bom-heading-gasket";
  if (normalized.includes("trap") || normalized.includes("strainer")) return "bom-heading-trap";
  return "bom-heading-other";
}

function renderBomGroupReview() {
  if (!elements.bomGroupCount || !elements.bomGroupTables) return;

  elements.bomGroupCount.textContent = `${bomGroupItems.length} ${
    bomGroupItems.length === 1 ? "item" : "items"
  }`;

  if (!bomGroupItems.length) {
    elements.bomGroupTables.innerHTML =
      '<p class="empty-note">Upload a BOM to view group-wise item tables.</p>';
    return;
  }

  elements.bomGroupTables.innerHTML = groupBomItems(bomGroupItems)
    .map(
      ([groupName, groupItems]) => `
        <article class="bom-group-card">
          <div class="bom-group-title">
            <h4 class="${getBomGroupHeadingClass(groupName)}">${escapeHtml(groupName)}</h4>
            <p>${groupItems.length} ${groupItems.length === 1 ? "item" : "items"}</p>
          </div>
          <div class="table-wrap">
            <table class="bom-group-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Size</th>
                  <th>Sch/Thk/Rating</th>
                  <th class="text-column">Material</th>
                  <th>Quantity</th>
                  <th>UOM</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                ${groupItems
                  .map(
                    (item) => `
                      <tr>
                        <td data-label="Item">${escapeHtml(item.item)}</td>
                        <td data-label="Size">${escapeHtml(item.size || "-")}</td>
                        <td data-label="Sch/Thk/Rating">${escapeHtml(item.thickness || "-")}</td>
                        <td class="text-column" data-label="Material">${escapeHtml(item.material || "-")}</td>
                        <td data-label="Quantity">${escapeHtml(item.quantity || "-")}</td>
                        <td data-label="UOM">${escapeHtml(item.uom || "-")}</td>
                        <td data-label="Source">${escapeHtml(item.sourceName || "-")}</td>
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </article>
      `
    )
    .join("");
}

function getSummary(items) {
  return items.reduce(
    (total, item) => ({
      weight: total.weight + item.totalWeight,
      median: total.median + item.medianTotal,
      p90: total.p90 + item.p90Total,
    }),
    { weight: 0, median: 0, p90: 0 }
  );
}

function getCategoryAverageRsKg(summary) {
  return summary.weight > 0 ? summary.median / summary.weight : 0;
}

function getCategoryAverageRawRsKg(items) {
  return getWeightedAverage(items, (item) => item.rawSteel);
}

function getWeightedAverage(items, valueGetter, weightGetter = (item) => item.totalWeight) {
  const totalWeight = items.reduce((sum, item) => sum + (Number(weightGetter(item)) || 0), 0);
  if (totalWeight <= 0) return 0;

  return (
    items.reduce(
      (sum, item) => sum + (Number(valueGetter(item)) || 0) * (Number(weightGetter(item)) || 0),
      0
    ) / totalWeight
  );
}

function getScenarioTotals(items, options = {}) {
  const rawMultiplier = options.rawMultiplier ?? 1;
  const factorMultiplier = options.factorMultiplier ?? 1;
  const coatingOverride = options.coatingOverride;

  return items.reduce(
    (total, item) => {
      const baseFactor = coatingOverride ? getFactor(coatingOverride) : item.factors;
      const medianFactor = baseFactor.median * factorMultiplier;
      const p90Factor = baseFactor.p90 * factorMultiplier;
      const rawSteel = item.rawSteel * rawMultiplier;
      const medianRsKg = rawSteel * medianFactor;
      const p90RsKg = rawSteel * p90Factor;
      const medianTotal = medianRsKg * item.weightKgm * item.length;
      const p90Total = p90RsKg * item.weightKgm * item.length;

      return {
        rawSteel: total.rawSteel + rawSteel * item.totalWeight,
        factorWeight: total.factorWeight + item.totalWeight,
        medianFactor: total.medianFactor + medianFactor * item.totalWeight,
        p90Factor: total.p90Factor + p90Factor * item.totalWeight,
        median: total.median + medianTotal,
        p90: total.p90 + p90Total,
      };
    },
    { rawSteel: 0, factorWeight: 0, medianFactor: 0, p90Factor: 0, median: 0, p90: 0 }
  );
}

function getWhatIfScenarios(items) {
  if (!items.length) return [];

  const baseSummary = getSummary(items);
  const baseRawSteel = getWeightedAverage(items, (item) => item.rawSteel);
  const baseMedianFactor = getWeightedAverage(items, (item) => item.factors.median);
  const baseP90Factor = getWeightedAverage(items, (item) => item.factors.p90);
  const dominantCoating =
    items.filter((item) => item.coating === "Yes").length > items.length / 2 ? "Yes" : "No";
  const manualRawChange = Number(elements.rawSteelSlider.value) || 0;

  const scenarioInputs = [
    { name: "Base case", type: "Base", rawMultiplier: 1, factorMultiplier: 1 },
    { name: "Raw steel -20%", type: "Raw Steel", rawMultiplier: 0.8, factorMultiplier: 1 },
    { name: "Raw steel -10%", type: "Raw Steel", rawMultiplier: 0.9, factorMultiplier: 1 },
    { name: "Raw steel +10%", type: "Raw Steel", rawMultiplier: 1.1, factorMultiplier: 1 },
    { name: "Raw steel +20%", type: "Raw Steel", rawMultiplier: 1.2, factorMultiplier: 1 },
    { name: "Est. Factor -20%", type: "Estimate Factor", rawMultiplier: 1, factorMultiplier: 0.8 },
    { name: "Est. Factor -10%", type: "Estimate Factor", rawMultiplier: 1, factorMultiplier: 0.9 },
    { name: "Est. Factor +10%", type: "Estimate Factor", rawMultiplier: 1, factorMultiplier: 1.1 },
    { name: "Est. Factor +20%", type: "Estimate Factor", rawMultiplier: 1, factorMultiplier: 1.2 },
    { name: "Coating No", type: "Coating", rawMultiplier: 1, factorMultiplier: 1, coatingOverride: "No" },
    { name: "Coating Yes", type: "Coating", rawMultiplier: 1, factorMultiplier: 1, coatingOverride: "Yes" },
  ];

  if (manualRawChange !== 0) {
    scenarioInputs.splice(5, 0, {
      name: `Manual raw steel ${formatPercentChange(manualRawChange)}`,
      type: "Raw Steel",
      rawMultiplier: 1 + manualRawChange / 100,
      factorMultiplier: 1,
    });
  }

  return scenarioInputs.map((input) => {
    const totals = input.type === "Base" ? null : getScenarioTotals(items, input);
    const factorWeight = totals?.factorWeight || getSummary(items).weight || 1;
    const median = totals ? totals.median : baseSummary.median;
    const p90 = totals ? totals.p90 : baseSummary.p90;

    return {
      ...input,
      rawSteel: totals ? totals.rawSteel / factorWeight : baseRawSteel,
      medianFactor: totals ? totals.medianFactor / factorWeight : baseMedianFactor,
      p90Factor: totals ? totals.p90Factor / factorWeight : baseP90Factor,
      coating: input.coatingOverride || `Current (${dominantCoating})`,
      median,
      p90,
      change: baseSummary.median > 0 ? (median / baseSummary.median - 1) * 100 : 0,
    };
  });
}

function getSelectedWhatIfTypes() {
  return new Set(
    Array.from(elements.whatIfToggles)
      .filter((toggle) => toggle.checked)
      .map((toggle) => toggle.value)
  );
}

function filterWhatIfScenarios(scenarios) {
  const selectedTypes = getSelectedWhatIfTypes();
  return scenarios.filter(
    (scenario) => scenario.type === "Base" || selectedTypes.has(scenario.type)
  );
}

function getWhatIfSortValue(scenario, key) {
  if (key === "name" || key === "coating") return String(scenario[key] || "").toLowerCase();
  return Number(scenario[key]);
}

function sortWhatIfScenarios(scenarios) {
  const pinnedScenarios = scenarios.filter(
    (scenario) => scenario.type === "Base" || scenario.name.startsWith("Manual raw steel")
  );
  const sortableScenarios = scenarios.filter(
    (scenario) => scenario.type !== "Base" && !scenario.name.startsWith("Manual raw steel")
  );

  if (!whatIfSortState.key) return [...pinnedScenarios, ...sortableScenarios];

  const direction = whatIfSortState.direction === "asc" ? 1 : -1;
  const sortedScenarios = [...sortableScenarios].sort((a, b) => {
    const valueA = getWhatIfSortValue(a, whatIfSortState.key);
    const valueB = getWhatIfSortValue(b, whatIfSortState.key);

    if (typeof valueA === "string" || typeof valueB === "string") {
      return String(valueA).localeCompare(String(valueB)) * direction;
    }

    return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
  });

  return [...pinnedScenarios, ...sortedScenarios];
}

function updateWhatIfSortButtons() {
  elements.whatIfSortButtons.forEach((button) => {
    const isActive = button.dataset.sort === whatIfSortState.key;
    const icon = button.querySelector("span");
    button.setAttribute("aria-sort", isActive ? whatIfSortState.direction : "none");
    if (icon) icon.textContent = isActive ? (whatIfSortState.direction === "asc" ? "↑" : "↓") : "↕";
  });
}

function handleWhatIfSort(event) {
  const button = event.target.closest(".whatif-sort-button");
  if (!button) return;

  const key = button.dataset.sort;
  if (whatIfSortState.key === key) {
    whatIfSortState.direction = whatIfSortState.direction === "asc" ? "desc" : "asc";
  } else {
    whatIfSortState = { key, direction: "asc" };
  }

  renderWhatIfAnalysis();
}

function updateRawSteelSliderDisplay(items = getReportItems()) {
  const change = Number(elements.rawSteelSlider.value) || 0;
  const baseRawSteel = getWeightedAverage(items, (item) => item.rawSteel);
  const adjustedRawSteel = baseRawSteel * (1 + change / 100);
  const sliderTone = change < 0 ? "negative" : change > 0 ? "positive" : "base";
  const sliderMin = Number(elements.rawSteelSlider.min) || -30;
  const sliderMax = Number(elements.rawSteelSlider.max) || 30;
  const sliderPosition = ((change - sliderMin) / (sliderMax - sliderMin)) * 100;
  const thumbOffset = 16 - 28 * (sliderPosition / 100);

  elements.rawSteelSliderValue.textContent = formatPercentChange(change);
  elements.rawSteelSliderValue.dataset.tone = sliderTone;
  elements.rawSteelSliderRate.dataset.tone = sliderTone;
  elements.rawSteelSlider.dataset.tone = sliderTone;
  elements.rawSteelSliderThumb.dataset.tone = sliderTone;
  elements.rawSteelSliderThumb.style.left = `calc(${sliderPosition}% + ${thumbOffset}px)`;

  if (!items.length || !Number.isFinite(baseRawSteel) || baseRawSteel <= 0) {
    elements.rawSteelSliderRate.textContent = "-";
    elements.rawSteelSliderBase.textContent = "Base raw steel: -";
    return;
  }

  elements.rawSteelSliderRate.textContent = `${formatCurrency(adjustedRawSteel, 2)}/kg`;
  elements.rawSteelSliderBase.textContent = `Base raw steel: ${formatCurrency(baseRawSteel, 2)}/kg`;
}

function handleRawSteelSlider() {
  updateRawSteelSliderDisplay();
  renderWhatIfAnalysis();
}

function renderWhatIfAnalysis() {
  const items = getReportItems();
  updateRawSteelSliderDisplay(items);
  const scenarios = filterWhatIfScenarios(getWhatIfScenarios(items));
  updateWhatIfSortButtons();

  if (!scenarios.length) {
    elements.whatIfBase.textContent = "-";
    elements.whatIfLow.textContent = "-";
    elements.whatIfHigh.textContent = "-";
    elements.whatIfRange.textContent = "-";
    elements.whatIfDriver.textContent = "-";
    elements.whatIfChart.innerHTML = `<p class="empty-note">Add pipe lines or enter one estimate to view what-if analysis.</p>`;
    elements.whatIfBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="8">No what-if scenarios available yet.</td>
      </tr>
    `;
    return;
  }

  const base = scenarios[0];
  const sortedByValue = [...scenarios].sort((a, b) => a.median - b.median);
  const low = sortedByValue[0];
  const high = sortedByValue[sortedByValue.length - 1];
  const biggest =
    high.type !== "Base"
      ? high
      : scenarios
          .filter((scenario) => scenario.type !== "Base")
          .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))[0];
  const maxMedian = Math.max(...scenarios.map((scenario) => scenario.median), 1);
  const displayScenarios = sortWhatIfScenarios(scenarios);
  const getScenarioClass = (scenario) => {
    const classes = [];
    if (scenario === base || scenario.name === base.name) classes.push("scenario-base");
    else if (scenario === low || scenario.name === low.name) classes.push("scenario-low");
    else if (scenario === high || scenario.name === high.name) classes.push("scenario-high");
    else classes.push("scenario-standard");

    return classes.join(" ");
  };

  elements.whatIfBase.textContent = formatCurrency(base.median, 0);
  elements.whatIfLow.textContent = formatCurrency(low.median, 0);
  elements.whatIfHigh.textContent = formatCurrency(high.median, 0);
  elements.whatIfRange.textContent = formatCurrency(high.median - low.median, 0);
  elements.whatIfDriver.textContent = biggest ? biggest.type : "-";

  elements.whatIfChart.innerHTML = displayScenarios
    .map(
      (scenario) => `
        <div class="scenario-bar ${getScenarioClass(scenario)}">
          <span>${scenario.name}</span>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${Math.max((scenario.median / maxMedian) * 100, 4)}%"></div>
          </div>
          <strong>${formatCurrency(scenario.median, 0)}</strong>
        </div>
      `
    )
    .join("");

  elements.whatIfBody.innerHTML = displayScenarios
    .map(
      (scenario) => `
        <tr class="${getScenarioClass(scenario)}">
          <td data-label="Scenario">${scenario.name}</td>
          <td data-label="Raw steel">${formatCurrency(scenario.rawSteel, 2)}</td>
          <td data-label="Normal factor">${formatNumber(scenario.medianFactor, 2)}</td>
          <td data-label="P90 factor">${formatNumber(scenario.p90Factor, 2)}</td>
          <td data-label="Coating">${scenario.coating}</td>
          <td data-label="Normal total">${formatCurrency(scenario.median, 0)}</td>
          <td data-label="P90 total">${formatCurrency(scenario.p90, 0)}</td>
          <td data-label="Change vs base">${scenario.change >= 0 ? "+" : ""}${formatNumber(scenario.change, 1)}%</td>
        </tr>
      `
    )
    .join("");
}

function getReportItems() {
  const currentEstimate = getCurrentEstimate();
  if (lineItems.length > 0) return lineItems;
  return currentEstimate.error ? [] : [currentEstimate];
}

function getSortValue(item, key) {
  if (key === "medianFactor") return item.factors.median;
  if (key === "spec" || key === "coating") return String(item[key] || "").toLowerCase();
  return Number(item[key]);
}

function applySort() {
  if (!sortState.key) return;

  const direction = sortState.direction === "asc" ? 1 : -1;
  lineItems.sort((a, b) => {
    const valueA = getSortValue(a, sortState.key);
    const valueB = getSortValue(b, sortState.key);

    if (typeof valueA === "string" || typeof valueB === "string") {
      return String(valueA).localeCompare(String(valueB)) * direction;
    }

    return ((Number(valueA) || 0) - (Number(valueB) || 0)) * direction;
  });
}

function updateSortButtons() {
  elements.sortButtons.forEach((button) => {
    const isActive = button.dataset.sort === sortState.key;
    const icon = button.querySelector("span");
    button.setAttribute("aria-sort", isActive ? sortState.direction : "none");
    if (icon) icon.textContent = isActive ? (sortState.direction === "asc" ? "↑" : "↓") : "↕";
  });
}

function handleSort(event) {
  const button = event.target.closest(".sort-button");
  if (!button) return;

  const key = button.dataset.sort;
  if (sortState.key === key) {
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
  } else {
    sortState = { key, direction: "asc" };
  }

  applySort();
  renderLineItems();
}

function addCurrentLine() {
  if (hasIncompleteNonCarbonSteelSelection()) {
    const message = "Please select Pipe Material Standard before adding non-carbon-steel pipe.";
    elements.warning.textContent = message;
    elements.materialGradeFamily.focus();
    window.alert(message);
    return;
  }

  const estimate = calculate();
  if (!estimate) return;

  estimate.source = "manual";
  lineItems.push(estimate);
  renderLineItems();
  updateReportGenerated();
  showSuccessMessage(`${formatPipeSize(estimate.size)} IN pipe line added to multi size estimate.`);
}

function removeLine(id) {
  const index = lineItems.findIndex((item) => item.id === id);
  if (index >= 0) lineItems.splice(index, 1);
  renderLineItems();
  if (lineItems.length === 0) {
    clearReportGenerated();
  } else {
    updateReportGenerated();
  }
}

function normalizeHeader(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findBomColumn(headers, aliases) {
  const normalizedHeaders = headers.map((header) => ({
    original: header,
    normalized: normalizeHeader(header),
  }));

  for (const alias of aliases) {
    const match = normalizedHeaders.find(
      (header) => header.normalized === normalizeHeader(alias)
    );
    if (match) return match.original;
  }

  return undefined;
}

function parseBomNumber(value) {
  if (typeof value === "number") return value;
  const text = String(value || "").replace(/,/g, "");
  const match = text.match(/-?(?:\d+\.?\d*|\.\d+)/);
  return match ? Number(match[0]) : NaN;
}

function parseBomSize(value) {
  if (typeof value === "number" && odTable[value]) return value;

  const text = String(value || "")
    .toUpperCase()
    .replace(/\u00C2?\u00BD/g, " 1/2")
    .replace(/\u00C2?\u00BE/g, " 3/4")
    .replace(/\u00C2?\u00BC/g, " 1/4");
  const dottedFractionMatch = text.match(/\b(\d+)\.(\d+)\s*\/\s*(\d+)\b/);
  if (dottedFractionMatch) {
    const fractionSize =
      Number(dottedFractionMatch[1]) +
      Number(dottedFractionMatch[2]) / Number(dottedFractionMatch[3]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  const wholeFractionMatch = text.match(/\b(\d+)\s+(\d+)\s*\/\s*(\d+)\b/);
  if (wholeFractionMatch) {
    const fractionSize =
      Number(wholeFractionMatch[1]) +
      Number(wholeFractionMatch[2]) / Number(wholeFractionMatch[3]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  const fractionMatch = text.match(/\b(\d+)\s*\/\s*(\d+)\b/);
  if (fractionMatch) {
    const fractionSize = Number(fractionMatch[1]) / Number(fractionMatch[2]);
    return odTable[fractionSize] ? fractionSize : NaN;
  }

  const dnMatch = text.match(/\bDN\s*(\d+(\.\d+)?)/);
  if (dnMatch) {
    const dnValue = Number(dnMatch[1]);
    return dnToNps[dnValue] || Math.round((dnValue / 25) * 2) / 2;
  }

  const npsMatch = text.match(/\b(NPS|NB|IN|INCH|INCHES)?\s*(\d+(\.\d+)?|\.\d+)/);
  const npsSize = npsMatch ? Number(npsMatch[2]) : NaN;
  if (odTable[npsSize]) return npsSize;

  const parsedSize = parseBomNumber(value);
  return odTable[parsedSize] ? parsedSize : NaN;
}

function parseBomCoating(value, fallback = "No") {
  const text = String(value || "").toLowerCase();
  if (!text.trim()) return fallback === "Yes" ? "Yes" : "No";
  if (/\b(no|bare|uncoated|none|na|n\/a)\b/.test(text)) return "No";
  if (/\b(yes|coated|coat|pe|polyethylene|epoxy|lined|lining|fbe)\b/.test(text)) return "Yes";
  return fallback === "Yes" ? "Yes" : "No";
}

function isMeterUom(value) {
  const text = normalizeHeader(value);
  if (!text) return false;
  return ["m", "meter", "metre", "meters", "metres"].includes(text);
}

function isPipeItem(value) {
  const text = String(value || "").toLowerCase();
  if (!text.trim()) return true;
  const looksLikePipe = /\bpipe\b|pipes|piping/.test(text);
  const looksLikeFitting =
    /\belbow\b|\btee\b|\bflange\b|\bvalve\b|\bgasket\b|\breducer\b|\bcap\b|\bbend\b/.test(text);
  return looksLikePipe && !looksLikeFitting;
}

function worksheetToBomRows(sheet) {
  const matrix = globalThis.XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  let bestHeaderIndex = -1;
  let bestScore = 0;

  matrix.forEach((row, rowIndex) => {
    const headers = row.map((cell) => String(cell || ""));
    const score = [
      findBomColumn(headers, bomColumnAliases.size),
      findBomColumn(headers, bomColumnAliases.thickness),
      findBomColumn(headers, bomColumnAliases.length),
    ].filter(Boolean).length;

    if (score > bestScore) {
      bestScore = score;
      bestHeaderIndex = rowIndex;
    }
  });

  if (bestHeaderIndex < 0 || bestScore < 3) {
    return [];
  }

  const rawHeaders = matrix[bestHeaderIndex].map((header, index) => {
    const cleanHeader = String(header || "").trim();
    return cleanHeader || `Column ${index + 1}`;
  });

  return matrix
    .slice(bestHeaderIndex + 1)
    .map((row) =>
      rawHeaders.reduce((record, header, index) => {
        record[header] = row[index] ?? "";
        return record;
      }, {})
    )
    .filter((row) =>
      Object.values(row).some((value) => String(value || "").trim() !== "")
    );
}

function setBomStatus(message, type = "") {
  elements.bomStatus.textContent = message;
  elements.bomStatus.className = `bom-status${type ? ` ${type}` : ""}`;
}

function importBomRows(rows, sourceName = "BOM", options = {}) {
  if (!rows.length) {
    setBomStatus("The uploaded BOM does not contain any readable rows.", "error");
    return { imported: 0, skipped: 0 };
  }

  const headers = Object.keys(rows[0]);
  const sizeColumn = findBomColumn(headers, bomColumnAliases.size);
  const thicknessColumn = findBomColumn(headers, bomColumnAliases.thickness);
  const lengthColumn = findBomColumn(headers, bomColumnAliases.length);
  const coatingColumn = findBomColumn(headers, bomColumnAliases.coating);
  const specColumn = findBomColumn(headers, bomColumnAliases.spec);
  const itemColumn = findBomColumn(headers, bomColumnAliases.item);
  const uomColumn = findBomColumn(headers, bomColumnAliases.uom);
  const rawColumn = findBomColumn(headers, bomColumnAliases.rawOverride);
  const factorColumn = findBomColumn(headers, bomColumnAliases.factorOverride);
  const sourceKey = options.replaceBatchKey || sourceName;

  const missing = [];
  if (!sizeColumn) missing.push("Size / NPS / DN");
  if (!thicknessColumn) missing.push("Thickness / THK");
  if (!lengthColumn) missing.push("Length / Qty");

  if (missing.length) {
    setBomStatus(`Missing required BOM column(s): ${missing.join(", ")}.`, "error");
    return { imported: 0, skipped: rows.length };
  }

  let imported = 0;
  let skipped = 0;

  if (options.replaceBatchKey) {
    for (let index = lineItems.length - 1; index >= 0; index -= 1) {
      if (
        lineItems[index].source === "bom" &&
        lineItems[index].sourceKey === options.replaceBatchKey
      ) {
        lineItems.splice(index, 1);
      }
    }
    for (let index = bomGroupItems.length - 1; index >= 0; index -= 1) {
      if (bomGroupItems[index].sourceKey === options.replaceBatchKey) {
        bomGroupItems.splice(index, 1);
      }
    }
  }

  rows.forEach((row) => {
    const groupItem = buildBomGroupItem(
      row,
      {
        item: itemColumn,
        size: sizeColumn,
        thickness: thicknessColumn,
        length: lengthColumn,
        uom: uomColumn,
        spec: specColumn,
      },
      sourceName,
      sourceKey
    );
    if (groupItem) bomGroupItems.push(groupItem);

    if (uomColumn && !isMeterUom(row[uomColumn])) {
      skipped += 1;
      return;
    }

    if (!uomColumn && itemColumn && !isPipeItem(row[itemColumn])) {
      skipped += 1;
      return;
    }

    const rowSize = parseBomSize(row[sizeColumn]);
    const rowThickness = parseThicknessInput(row[thicknessColumn], rowSize);
    const rowSpec = specColumn ? row[specColumn] : elements.spec.value;
    const bomRawOverride = rawColumn ? parseBomNumber(row[rawColumn]) : NaN;
    const hasBomRawOverride = Number.isFinite(bomRawOverride) && bomRawOverride > 0;
    const rowRawPriceMapping = hasBomRawOverride
      ? null
      : getRawMaterialPriceMapping(rowSpec, elements.year.value);
    const rowRawOverride = hasBomRawOverride
      ? bomRawOverride
      : rowRawPriceMapping?.recommended || "";
    const estimate = buildEstimate({
      year: elements.year.value,
      size: rowSize,
      thickness: rowThickness,
      length: parseBomNumber(row[lengthColumn]),
      spec: rowSpec,
      coating: coatingColumn
        ? parseBomCoating(row[coatingColumn], elements.coating.value)
        : elements.coating.value,
      rawOverride: rowRawOverride,
      rawSteelSource: hasBomRawOverride
        ? "bomOverride"
        : rowRawPriceMapping
          ? "materialLibrary"
          : "defaultYear",
      rawBasisNote: hasBomRawOverride
        ? "BOM-entered Raw Steel Rs/kg"
        : rowRawPriceMapping?.note || "Default raw steel basis; no BOM material raw-price match",
      factorOverride: factorColumn ? parseBomNumber(row[factorColumn]) : "",
    });

    if (estimate.error) {
      skipped += 1;
      return;
    }

    estimate.source = "bom";
    estimate.sourceName = sourceName;
    estimate.sourceKey = sourceKey;
    lineItems.push(estimate);
    imported += 1;
  });

  renderLineItems();
  renderBomGroupReview();
  if (imported > 0) {
    updateReportGenerated();
    showSuccessMessage(`${imported} BOM pipe ${imported === 1 ? "line" : "lines"} imported.`);
  }

  const mappedColumns = [
    `size: ${sizeColumn}`,
    `thickness: ${thicknessColumn}`,
    `length: ${lengthColumn}`,
    coatingColumn ? `coating: ${coatingColumn}` : "",
  ]
    .filter(Boolean)
    .join("; ");
  const statusType = imported > 0 ? "success" : "error";
  const skippedNote =
    skipped > 0 ? " Non-pipe rows, non-meter UoM rows, or invalid pipe data were skipped." : "";
  setBomStatus(
    `${sourceName}: imported ${imported} pipe line(s), skipped ${skipped}. Mapped columns: ${mappedColumns}.${skippedNote}`,
    statusType
  );

  return { imported, skipped };
}

window.importBomRows = importBomRows;

async function processBomFiles(files) {
  if (!files.length) return;

  if (!globalThis.XLSX) {
    setBomStatus(
      "Excel parser did not load. Check internet connection and reload the page.",
      "error"
    );
    return;
  }

  const results = [];

  for (const file of files) {
    try {
      const data = await file.arrayBuffer();
      const workbook = globalThis.XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = worksheetToBomRows(sheet);
      const sourceKey = `${file.name}:${file.size}:${file.lastModified}`;
      const result = importBomRows(rows, file.name, { replaceBatchKey: sourceKey });
      results.push({ file: file.name, ...result });
    } catch (error) {
      results.push({ file: file.name, imported: 0, skipped: 0, error: error.message });
    }
  }

  const imported = results.reduce((total, result) => total + result.imported, 0);
  const skipped = results.reduce((total, result) => total + result.skipped, 0);
  const failed = results.filter((result) => result.error);
  const fileSummary = results
    .map((result) =>
      result.error
        ? `${result.file}: failed`
        : `${result.file}: ${result.imported} imported, ${result.skipped} skipped`
    )
    .join(" | ");

  if (failed.length) {
    setBomStatus(
      `${files.length} file(s) processed with ${failed.length} error(s). ${fileSummary}`,
      imported > 0 ? "success" : "error"
    );
  } else {
    setBomStatus(
      `${files.length} file(s) processed. Total imported ${imported} pipe line(s), skipped ${skipped}. ${fileSummary}`,
      imported > 0 ? "success" : "error"
    );
  }

  elements.bomFile.value = "";
}

async function handleBomUpload(event) {
  await processBomFiles(Array.from(event.target.files || []));
}

function handleBomDrag(event) {
  event.preventDefault();
  elements.bomDropZone.classList.add("drag-over");
}

function handleBomDragLeave(event) {
  event.preventDefault();
  elements.bomDropZone.classList.remove("drag-over");
}

async function handleBomDrop(event) {
  event.preventDefault();
  elements.bomDropZone.classList.remove("drag-over");
  await processBomFiles(Array.from(event.dataTransfer?.files || []));
}

function showSuccessMessage(message) {
  window.clearTimeout(successTimer);
  elements.successMessage.textContent = message;
  successTimer = window.setTimeout(() => {
    elements.successMessage.textContent = "";
  }, 3000);
}

function clearSuccessMessage() {
  window.clearTimeout(successTimer);
  elements.successMessage.textContent = "";
}

function updateReportGenerated() {
  const generatedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  elements.reportGenerated.textContent = `Report generated: ${generatedAt}`;
}

function clearReportGenerated() {
  elements.reportGenerated.textContent = "";
}

function highlightOverride(value) {
  return `<span class="override-value">${value}</span>`;
}

function getOverrideNotes(items = getReportItems(), useHtml = false) {
  const notes = [];

  items.forEach((item, index) => {
    const defaultFactors = getFactor(item.coating);
    const hasRawOverride = item.rawSteelBasis.includes("Override");
    const hasFactorOverride = item.factorBasis.includes("Override");
    const rawSteelValue = formatNumber(item.rawSteel, 2);
    const normalFactorValue = formatNumber(item.factors.median, 2);
    const p90Multiplier = defaultFactors.p90 / defaultFactors.median;

    if (!hasRawOverride && !hasFactorOverride) return;

    notes.push(
      `Line ${index + 1}: ${formatPipeSize(item.size)} IN; ${
        hasRawOverride
          ? `raw steel override Rs ${useHtml ? highlightOverride(rawSteelValue) : rawSteelValue} per kg; `
          : ""
      }${
        hasFactorOverride
          ? `normal factor override ${useHtml ? highlightOverride(normalFactorValue) : normalFactorValue}; P90 recalculated to ${
              useHtml ? highlightOverride(formatNumber(item.factors.p90, 2)) : formatNumber(item.factors.p90, 2)
            } using default multiplier ${formatNumber(p90Multiplier, 3)}; `
          : ""
      }default factor set ${formatNumber(defaultFactors.median, 2)} / ${formatNumber(defaultFactors.p90, 2)}.`
    );
  });

  return notes;
}

function updateOverrideReview() {
  const notes = getOverrideNotes(getReportItems(), true);
  elements.overrideReviewCard.hidden = notes.length === 0;
  elements.overrideReviewList.innerHTML = notes
    .map((note) => `<li>${note}</li>`)
    .join("");
}

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsvRows() {
  calculate();
  const items = getReportItems();
  const summary = getSummary(items);
  const overrideNotes = getOverrideNotes(items);
  const rows = [];

  rows.push(["Pipe Price Predictor - Audit Report"]);
  rows.push([elements.reportGenerated.textContent]);
  rows.push([]);
  rows.push(["Line Item Calculation"]);
  rows.push([
    "Year",
    "Size IN",
    "OD mm",
    "Thickness mm",
    "Length m",
    "Material Spec",
    "Material Category",
    "Matched JSON Pipe Standard",
    "Coating",
    "Raw Steel Rs/kg",
    "Normal Factor",
    "P90 Factor",
    "Kg/m",
    "Total kg",
    "Normal Rs/kg",
    "P90 Rs/kg",
    "Normal Total Rs",
    "P90 Total Rs",
  ]);

  items.forEach((item) => {
    rows.push([
      item.year,
      `${formatPipeSize(item.size)} IN`,
      formatNumber(item.od, 1),
      formatNumber(item.thickness, 2),
      formatNumber(item.length, 2),
      item.spec,
      item.materialCategory || "Unclassified",
      item.materialMatchedStandard || item.materialMatchNote || "",
      item.coating,
      formatPlainCurrency(item.rawSteel, 2),
      formatPlainCurrency(item.factors.median, 2),
      formatPlainCurrency(item.factors.p90, 2),
      formatPlainCurrency(item.weightKgm, 2),
      formatPlainCurrency(item.totalWeight, 2),
      formatPlainCurrency(item.medianRsKg, 2),
      formatPlainCurrency(item.p90RsKg, 2),
      formatPlainCurrency(item.medianTotal, 0),
      formatPlainCurrency(item.p90Total, 0),
    ]);
  });

  rows.push([]);
  rows.push(["Material Category Summary"]);
  rows.push([
    "Category",
    "Line Count",
    "Total Weight kg",
    "Normal Total Rs",
    "P90 Total Rs",
    "Raw Rs/kg",
    "Average Rs/kg",
  ]);
  Array.from(groupItemsByMaterialCategory(items).entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([category, categoryItems]) => {
      const categorySummary = getSummary(categoryItems);
      rows.push([
        category,
        categoryItems.length,
        formatPlainCurrency(categorySummary.weight, 2),
        formatPlainCurrency(categorySummary.median, 0),
        formatPlainCurrency(categorySummary.p90, 0),
        formatPlainCurrency(getCategoryAverageRawRsKg(categoryItems), 2),
        formatPlainCurrency(getCategoryAverageRsKg(categorySummary), 2),
      ]);
    });
  rows.push([
    "Category pricing note",
    "Non-CS material estimates use the same factor-based method and are indicative only. Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations.",
  ]);

  rows.push([]);
  rows.push(["Summary"]);
  rows.push(["Total Weight kg", formatPlainCurrency(summary.weight, 2)]);
  rows.push(["Normal Estimate Rs", formatPlainCurrency(summary.median, 0)]);
  rows.push(["P90 Estimate Rs", formatPlainCurrency(summary.p90, 0)]);
  rows.push([]);
  rows.push(["What-if Analysis"]);
  rows.push([
    "Scenario",
    "Raw Steel Rs/kg",
    "Normal Factor",
    "P90 Factor",
    "Coating",
    "Normal Total Rs",
    "P90 Total Rs",
    "Change vs Base %",
  ]);
  sortWhatIfScenarios(filterWhatIfScenarios(getWhatIfScenarios(items))).forEach((scenario) => {
    rows.push([
      scenario.name,
      formatPlainCurrency(scenario.rawSteel, 2),
      formatPlainCurrency(scenario.medianFactor, 2),
      formatPlainCurrency(scenario.p90Factor, 2),
      scenario.coating,
      formatPlainCurrency(scenario.median, 0),
      formatPlainCurrency(scenario.p90, 0),
      formatPlainCurrency(scenario.change, 1),
    ]);
  });
  rows.push([
    "What-if basis",
    "Raw steel rate varied by +/-10% and +/-20%; estimate factor varied by +/-10% and +/-20%; coating assumption compared between Yes and No.",
  ]);
  if (bomGroupItems.length) {
    rows.push([]);
    rows.push(["BOM Group Review"]);
    rows.push(["Group", "Item Count"]);
    groupBomItems(bomGroupItems).forEach(([groupName, groupItems]) => {
      rows.push([groupName, groupItems.length]);
    });
    rows.push([]);
    rows.push(["BOM Group Details"]);
    rows.push(["Group", "Item", "Matched Component", "Size", "Sch/Thk/Rating", "Material", "Quantity", "UOM", "Source"]);
    groupBomItems(bomGroupItems).forEach(([groupName, groupItems]) => {
      groupItems.forEach((item) => {
        rows.push([
          groupName,
          item.item,
          item.standardName || "",
          item.size,
          item.thickness,
          item.material,
          item.quantity,
          item.uom,
          item.sourceName,
        ]);
      });
    });
  }
  rows.push([]);
  rows.push(["Raw Steel Basis"]);
  rows.push(["Line", "Year", "Raw Steel Rs/kg", "Basis"]);
  items.forEach((item, index) => {
    rows.push([
      index + 1,
      item.year,
      formatPlainCurrency(item.rawSteel, 2),
      item.rawSteelBasis,
    ]);
  });
  if (overrideNotes.length > 0) {
    rows.push([]);
    rows.push(["Reviewer Override Check"]);
    overrideNotes.forEach((note) => rows.push([note]));
  }
  rows.push([]);
  rows.push(["Calculation Methodology"]);
  rows.push(["Pipe mass formula", "W = 0.0246615 x (OD - t) x t"]);
  rows.push(["W", "Pipe mass in kg/m"]);
  rows.push(["OD", "Actual outside diameter in mm from the built-in OD table"]);
  rows.push(["t", "Wall thickness in mm entered by the user"]);
  rows.push(["Total weight", "W x length in meter"]);
  rows.push(["Finished Rs/kg", "Raw steel Rs/kg x estimate factor"]);
  rows.push(["Rs/m", "Finished Rs/kg x pipe kg/m"]);
  rows.push(["Total Rs", "Rs/m x pipe length"]);
  rows.push([]);
  rows.push(["Factor Method"]);
  rows.push(["Coating Yes", "Normal factor 2.30, P90 factor 3.80"]);
  rows.push(["Coating No", "Normal factor 1.80, P90 factor 2.70"]);
  rows.push([
    "Estimate Factor Override",
    "Replaces normal factor; P90 is recalculated using the default P90-to-normal factor ratio",
  ]);
  rows.push([]);
  rows.push(["Material Category Basis"]);
  rows.push(["Category source", "astm_piping_material_specification_webapp.json"]);
  rows.push(["Pricing basis", "Same factor-based method is used across material categories in this version"]);
  rows.push([
    "Non-CS validation",
    "Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations",
  ]);
  rows.push([]);
  rows.push(["Coating Definition"]);
  rows.push(["Internal coating", "Epoxy lined"]);
  rows.push(["External coating", "PE coated, meaning polyethylene coated"]);
  rows.push(["Coating Yes", "Use for internal coating, external coating, or both"]);
  rows.push([]);
  rows.push(["Disclaimer"]);
  rows.push([
    "This is an indicative material supply estimate only. Validate final pricing with supplier quotation, taxes, freight, testing, coating scope, delivery terms, and commercial conditions.",
  ]);

  return rows;
}

function exportCsvReport() {
  updateReportGenerated();
  const csv = buildCsvRows().map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `cs-pipe-price-audit-report-${dateStamp}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printReport() {
  updateReportGenerated();
  document
    .querySelectorAll(".category-review-details, .category-audit-details, .bom-group-details")
    .forEach((details) => {
      details.open = true;
    });
  window.print();
}

function populateSizeOptions() {
  Object.keys(odTable)
    .map(Number)
    .filter((size) => !manualSizeExclusions.has(size))
    .sort((a, b) => a - b)
    .forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = `${size} IN`;
      if (size === 6) option.selected = true;
      elements.size.append(option);
    });
}

function resetForm() {
  elements.year.value = "2026";
  elements.size.value = "6";
  elements.thicknessMode.value = "schedule";
  elements.schedule.value = "STD";
  elements.thickness.value = "";
  elements.length.value = "100";
  elements.spec.value = "ASTM A106";
  selectDefaultCarbonSteelPrice();
  elements.coating.value = "No";
  elements.factorOverride.value = "";
  elements.bomFile.value = "";
  elements.rawSteelSlider.value = "0";
  elements.rawSteelSliderValue.textContent = "0%";
  setBomStatus("No BOM uploaded yet.");
  clearSuccessMessage();
  clearReportGenerated();
  lineItems.splice(0, lineItems.length);
  bomGroupItems.splice(0, bomGroupItems.length);
  updateThicknessMode();
  renderLineItems();
  renderBomGroupReview();
  calculate();
}

populateSizeOptions();
loadMaterialSpecificationData();
loadRawMaterialPriceLibrary();
renderBomGroupReview();
document.querySelectorAll("input, select").forEach((control) => {
  control.addEventListener("input", () => {
    if (control === elements.rawOverride) {
      delete elements.rawOverride.dataset.source;
      delete elements.rawOverride.dataset.sourceType;
    }
    clearSuccessMessage();
    updateThicknessMode();
    calculate();
  });
  control.addEventListener("change", () => {
    clearSuccessMessage();
    updateThicknessMode();
    calculate();
  });
});
elements.materialBasis.addEventListener("change", () => {
  populateRawMaterialGradeOptions();
  if (isCarbonSteelRawMaterialSelection()) {
    elements.materialGradeFamily.value = "0";
    applyRawMaterialPriceSelection();
  } else {
    clearRawMaterialPriceSelection();
  }
  calculate();
});
elements.materialGradeFamily.addEventListener("change", () => {
  applyRawMaterialPriceSelection();
  updateThicknessMode();
  calculate();
});
elements.year.addEventListener("change", () => {
  if (elements.rawOverride.dataset.sourceType === "materialLibrary") {
    applyRawMaterialPriceSelection();
  }
  refreshLineItemYearPrices();
  calculate();
});
elements.addLine.addEventListener("click", addCurrentLine);
elements.sortButtons.forEach((button) => button.addEventListener("click", handleSort));
elements.whatIfSortButtons.forEach((button) => button.addEventListener("click", handleWhatIfSort));
elements.whatIfToggles.forEach((toggle) => toggle.addEventListener("change", renderWhatIfAnalysis));
elements.rawSteelSlider.addEventListener("input", handleRawSteelSlider);
elements.bomFile.addEventListener("change", handleBomUpload);
elements.bomDropZone.addEventListener("dragover", handleBomDrag);
elements.bomDropZone.addEventListener("dragleave", handleBomDragLeave);
elements.bomDropZone.addEventListener("drop", handleBomDrop);
elements.themeToggle.addEventListener("click", toggleTheme);
elements.sideBrandHome.addEventListener("click", () => {
  document.querySelector("#top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  setActiveSideNavLink("#calculator");
});
elements.sideNavToggle.addEventListener("click", () =>
  setSideNavCollapsed(!document.body.classList.contains("side-nav-collapsed"))
);
elements.sideNavLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveSideNavLink(link.getAttribute("href")));
});
window.addEventListener("scroll", updateActiveSideNavOnScroll, { passive: true });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSideNavCollapsed(true);
});
elements.print.addEventListener("click", printReport);
elements.exportCsv.addEventListener("click", exportCsvReport);
elements.lineItemsBody.addEventListener("click", (event) => {
  if (event.target.matches(".remove-line")) {
    removeLine(event.target.dataset.id);
  }
});
elements.reset.addEventListener("click", resetForm);
applyTheme(localStorage.getItem("csPipeTheme") || "light");
resetForm();
updateActiveSideNavOnScroll();
