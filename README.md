# Pipe Price Predictor

Live tool: https://medinikb.github.io/Pipe-Price-Predictor/

Pipe Price Predictor is a free public pipe cost estimation tool for category-wise material supply estimates. It helps users estimate pipe supply price from size, thickness, length, coating condition, raw steel rate, kg/m pipe weight, normal estimate, and P90 budget estimate.

The tool is designed as a simple pipe cost estimation tool for refinery, oil and gas, piping, procurement, and project cost-estimation teams.

## What The Tool Does

- Calculates actual pipe outside diameter from nominal pipe size.
- Converts pipe schedule values such as `STD`, `S-STD`, `HVY`, `Heavy`, `SCH 40`, `S-80`, and `5S` into wall thickness in mm.
- Calculates pipe kg per meter using the built-in pipe kg per meter calculator.
- Calculates total pipe weight from kg/m and pipe length.
- Estimates normal supply price and P90 budget estimate.
- Provides a suggested raw material price mapping dropdown by material group and grade family.
- Supports coated and non-coated pipe estimates using the current factor-based method.
- Allows user override for raw steel Rs/kg.
- Allows user override for estimate factor.
- Supports multiple pipe sizes in one combined estimate.
- Imports one or more Excel BOM files in `.xlsx`, `.xls`, or `.csv` format.
- Groups all uploaded BOM line items as Pipe, Fitting, Flange, Valves, Bolt, Gasket, Trap/Strainer, or Other.
- Groups pipe rows by material category and shows category-wise estimate totals.
- Provides printable / Save as PDF report.
- Provides Excel-openable CSV export for audit and procurement rate validation.

## Who Can Use It

This tool is useful for:

- Refinery piping cost estimation teams
- Oil and gas project cost engineers
- Piping material engineers
- Procurement and contracts teams
- Project planning and budgeting teams
- Users doing procurement rate validation for pipe supply rates
- Students and engineers learning transparent pipe cost estimation

## Problem It Solves

Pipe prices are often difficult to compare because quotations may be given by length, weight, coating condition, schedule, material grade, or commercial basis. This tool gives a transparent calculation trail so users can compare pipe supply estimates using one consistent method.

The business benefit is simple: it helps users quickly check whether a pipe supply rate looks reasonable before going deeper into vendor quotation, negotiation, or budget approval.

## Key Use Cases

- Prepare preliminary pipe supply estimates by material category.
- Compare coated and non-coated pipe estimate cases.
- Check vendor rates against raw steel basis and conversion factor.
- Build a multi-size pipe estimate from manual entries.
- Upload a piping BOM and convert pipe rows into an estimate.
- Create a P90 budget estimate for approval or contingency discussion.
- Export an audit report for internal review.
- Use material category review to identify CS, AS, SS, and unclassified pipe items in the BOM.
- Use BOM group review to quickly see how many uploaded rows are pipes, fittings, flanges, valves, bolts, gaskets, traps/strainers, or other items.
- Select a suggested raw material rate by Basic Mat. Of Const. and Ch.Comp / grade family.

## Excel BOM Upload

Users can click or drag-and-drop one or more piping BOM files directly in the browser. The tool reads the first sheet of each file and imports valid pipe rows into the multi-size estimate table.

Each BOM file is treated as its own batch. Uploading the same file again refreshes that file's previous rows, while other BOM files and manually added rows are preserved.

The public page includes a **Download Excel Template** button linked to `Piping BOM.xlsx`, so users can start from the preferred BOM format.

### Required BOM Columns

| Required input | Accepted column examples |
|---|---|
| Pipe size | `Size`, `NPS`, `DN`, `Pipe Size`, `Nominal Size` |
| Thickness | `Thickness`, `THK`, `Sch/Thck/Rating`, `Wall Thickness`, `THK mm` |
| Length | `Length`, `Qty`, `Quantity`, `Length m`, `Total m` |

### Optional BOM Columns

| Optional input | Accepted column examples |
|---|---|
| Unit of measure | `UoM`, `Unit`, `Unit (M/NOS)` |
| Coating | `Coating`, `Coated`, `Coating Scope`, `Lining` |
| Material spec | `Material`, `Material Spec`, `Spec`, `Material Description` |
| Raw steel override | `Raw Steel Rs/kg`, `Raw Steel Rate`, `Raw Steel Price` |
| Estimate factor override | `Estimate Factor Override`, `Factor Override`, `Factor` |

### BOM Parsing Notes

- The BOM file is parsed in the user's browser.
- No server upload or database is used.
- This keeps the GitHub Pages version simple, static, and privacy-friendly.
- The importer scans the sheet to find the actual table header, so title rows above the BOM table are allowed.
- If a unit column is available, rows with unit `M`, `Meter`, or `Metre` are treated as pipe length rows.
- Rows that are fittings or valves, such as elbows, tees, flanges, valves, gaskets, reducers, caps, or bends, are skipped because the estimator is for pipe supply lengths only.
- Schedule text is converted to mm using the built-in pipe schedule lookup table before weight and price are calculated.

## Material Category Review

The app includes a collapsed **Material Category Review** section. It helps users see how uploaded pipe rows are grouped for review and shows a **Material Category Estimate Summary**.

Examples:

| BOM material text | Review category |
|---|---|
| `ASTM A106 GR.B` | Carbon Steel Pipe |
| `API 5L GR.B` | Carbon Steel Pipe |
| `IS-1239 BLACK` | Carbon Steel Pipe |
| `IS-3589 GR.330` | Carbon Steel Pipe |
| `ASTM A335 GR P5` | Alloy Steel Pipe |
| `ASTM A312 TP 316L` | Stainless Steel Pipe |
| Unknown material | Unclassified Pipe |

This section is for review and audit support. It does not stop valid pipe rows from being estimated.

The category summary includes line count, total kg, normal total, P90 total, raw Rs/kg, and average finished Rs/kg for each detected material category. Non-CS material estimates use the same factor-based method and are indicative only. Validate SS, alloy, duplex, and non-ferrous rates with supplier quotations.

## Suggested Raw Material Rate Library

The input panel includes a **Suggested Raw Material Rate** selector.

Users select:

1. `Basic Mat. Of Const.`
2. `Ch.Comp / Grade Family`

The app then shows:

- Pipe material standard
- Raw material basis
- Raw material price range
- Recommended Rs/kg
- Factor w.r.t. CS for the selected year

After the user selects a grade family, the recommended Rs/kg for the selected **Year** is placed into **Raw Steel Rs/kg Override**. This makes the estimate easier for non-specialist users because they do not need to manually remember raw material rates.

The reference data is stored in `raw_material_price_library.json` and includes year-wise rates from 2021 to 2026. **Factor w.r.t. CS** compares that material's raw Rs/kg with Carbon Steel raw Rs/kg for the same year. It is a comparison indicator only; it does not replace the Median factor or P90 factor used for finished pipe estimate.

## BOM Group Review

The app includes a collapsed **BOM Group Review** section after What-if Analysis. It groups uploaded BOM rows based on the item description using the group list from `Group.docx`.

Supported groups:

| Group | Example item names |
|---|---|
| Pipe Group | `Pipe`, `Nipple` |
| Fitting Group | `Elbow 90 Deg`, `Elbow 45 Deg`, `Tee`, `Reducer`, `Cap`, `Coupling` |
| Flange Group | `S.W. Flange`, `W.N. Flange`, `Blind Flange`, `Spcr & Bln` |
| Valves Group | `Gate Valve`, `Globe Valve`, `Check Valve`, `Ball Valve`, `Plug Valve`, `Butterfly Valve` |
| Bolt Group | `Stud with Nuts`, `Bolt` |
| Gasket Group | `Gasket` |
| Trap/Strainer Group | `Trap Steam`, `Strainer Temp`, `Strainer Perm` |
| Other Group | Any uploaded item that does not match the above groups |

Size-only, rating-only, bolt-size-only, and note-style item text such as `AS PER DATASHEET`, `provided by`, `procure with`, or `note` is grouped under **Other Group**.

Alias handling is also included for common BOM variations:

| Alias examples | Standard component | Group |
|---|---|---|
| `FIGURE-8`, `FIG.8 FL` | Figure 8 Flange | Flange Group |
| `T.Equal`, `Equal. T`, `EQ Tee` | Equal Tee | Fitting Group |
| `T.RED`, `RED.T`, `Reducing Tee`, `Reduc. T.` | Reducing Tee | Fitting Group |
| `FLANG WN`, `WN Flange`, `Well neck flange`, `WN Flng` | Weld Neck Flange | Flange Group |
| `CON.RED`, `CONC.RED`, `CON REDU.`, `REDUCER CONC`, `Reduce (Conc.)`, `RED. CONC` | Concentric Reducer | Fitting Group |
| `WELDOLET`, `WELD OLET`, `WELD-O-LET` | Weldolet | Fitting Group |

This helps users audit the full uploaded BOM, while the price estimate remains focused on pipe length rows.

## Calculation Basis

Pipe mass formula:

```text
W = 0.0246615 x (OD - t) x t
```

Where:

- `W` = pipe mass in kg/m
- `OD` = actual pipe outside diameter in mm
- `t` = wall thickness in mm

Important: the app uses actual outside diameter from the built-in OD table. It does not calculate weight by directly using nominal pipe size as diameter.

Pricing method:

```text
Total weight = W x length in meter
Finished Rs/kg = raw steel Rs/kg x estimate factor
Rs/m = finished Rs/kg x pipe kg/m
Total Rs = Rs/m x pipe length
```

## Default Factor Logic

| Coating | Normal / Median factor | P90 factor |
|---|---:|---:|
| Yes | 2.30 | 3.80 |
| No | 1.80 | 2.70 |

Coating definition used in the app:

- Internal coating: epoxy lined
- External coating: PE coated, meaning polyethylene coated

If `Estimate Factor Override` is entered, it replaces the normal / median estimate factor. The P90 factor is recalculated using the default P90-to-median relationship so the conservative estimate moves consistently with the user's override.

## What-if Analysis

The app includes a collapsed **What-if Analysis** section. It helps users understand how the estimate changes when:

- Raw steel rate changes by +/-10% and +/-20%
- Estimate factor changes by +/-10% and +/-20%
- Coating assumption changes between Yes and No
- Manual raw steel adjustment is moved using the slider

This is useful for quick budget sensitivity review before finalizing assumptions.

## Reports And Audit Trail

The tool includes:

- Printable report / Save as PDF
- Excel CSV export
- Excel BOM import status
- Raw steel Rs/kg basis
- Factor basis
- Override review
- Pipe weight methodology
- Coating definition
- Material category review
- BOM group review
- Calculation disclaimer

The report is intended to help users defend the calculation trail during internal review.

## Deployment

This project is a static GitHub Pages web app.

Files normally required for GitHub upload:

| File | Purpose |
|---|---|
| `index.html` | Main webpage structure and SEO tags |
| `style.css` | Visual design, mobile layout, print layout, light/dark mode |
| `app.js` | Calculator logic, BOM import, sorting, category review, report export |
| `Piping BOM.xlsx` | Downloadable Excel BOM template |
| `astm_piping_material_specification_webapp.json` | Material category reference data |
| `raw_material_price_library.json` | Suggested raw material price mapping for dropdown autofill |
| `README.md` | GitHub project explanation |
| `sitemap.xml` | Search indexing support |
| `AGENTS.md` | Future Codex project instructions |
| `DESIGN_SYSTEM.md` | Reusable style guidance |

No backend server is required for normal use.

## Limitations

- This is an indicative material supply estimate only.
- It is not a vendor quotation.
- It is not a purchase recommendation.
- It does not calculate installed piping cost.
- It does not include taxes, GST, freight, unloading, wastage, fabrication, erection, hydrotest, NDT, painting, contractor margin, commercial escalation, or delivery terms unless users separately include those in their own assumptions.
- Final pricing must be validated with supplier quotation and project-specific commercial terms.

## Disclaimer

This tool provides indicative estimates only. Final pricing should be validated against supplier quotation, taxes, freight, testing, coating scope, delivery terms, and commercial conditions.
