/**
 * Generate 14 CT Secondary Injection Test Reports
 *
 * Generates DOCX reports for panels M01-M14 with random test values
 * Output: ~/abdout/yabreen/
 */

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from "docx";
import * as fs from "fs";
import * as path from "path";

// Panel configuration based on user data
interface PanelConfig {
  id: string;
  ct: 600 | 1200 | 2000;
  hasP841: boolean;
  hasP142: boolean;
  hasREF615: boolean;
  hasDM: boolean;
}

const PANELS: PanelConfig[] = [
  { id: "M01", ct: 600, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
  { id: "M02", ct: 600, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
  { id: "M03", ct: 600, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M04", ct: 600, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M05", ct: 600, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M06", ct: 600, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M07", ct: 600, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M08", ct: 600, hasP841: true, hasP142: false, hasREF615: false, hasDM: false },
  { id: "M09", ct: 1200, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
  { id: "M10", ct: 1200, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
  { id: "M11", ct: 1200, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M12", ct: 1200, hasP841: false, hasP142: false, hasREF615: false, hasDM: true },
  { id: "M13", ct: 2000, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
  { id: "M14", ct: 2000, hasP841: true, hasP142: true, hasREF615: true, hasDM: true },
];

// Random value generators
function randomRatio(): number {
  // Test switch ratio: nominal 1.0, range 0.980-1.020
  return +(0.98 + Math.random() * 0.04).toFixed(3);
}

function randomSecondary(nominal: number): number {
  // Secondary current: ±0.5% of nominal
  const variance = nominal * 0.005;
  return +(nominal + (Math.random() * variance * 2 - variance)).toFixed(1);
}

// Generate data for a panel
interface PanelData {
  panel: string;
  ctRatio: string;
  testSwitch: { r: number; y: number; b: number };
  p841: { r: number | string; y: number | string; b: number | string };
  p142: { r: number | string; y: number | string; b: number | string };
  ref615: { r: number | string; y: number | string; b: number | string };
  dm: { r: number | string; y: number | string; b: number | string };
}

function generatePanelData(config: PanelConfig): PanelData {
  const nominal = config.ct;

  return {
    panel: config.id,
    ctRatio: `${config.ct}/1`,
    testSwitch: {
      r: randomRatio(),
      y: randomRatio(),
      b: randomRatio(),
    },
    p841: config.hasP841
      ? { r: randomSecondary(nominal), y: randomSecondary(nominal), b: randomSecondary(nominal) }
      : { r: "-", y: "-", b: "-" },
    p142: config.hasP142
      ? { r: randomSecondary(nominal), y: randomSecondary(nominal), b: randomSecondary(nominal) }
      : { r: "-", y: "-", b: "-" },
    ref615: config.hasREF615
      ? { r: randomSecondary(nominal), y: randomSecondary(nominal), b: randomSecondary(nominal) }
      : { r: "-", y: "-", b: "-" },
    dm: config.hasDM
      ? { r: randomSecondary(nominal), y: randomSecondary(nominal), b: randomSecondary(nominal) }
      : { r: "-", y: "-", b: "-" },
  };
}

// Light border style for tables
const lightBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "CCCCCC",
};

const tableBorders = {
  top: lightBorder,
  bottom: lightBorder,
  left: lightBorder,
  right: lightBorder,
};

// Create table cell
function createCell(text: string | number, isHeader = false, width?: number): TableCell {
  return new TableCell({
    borders: tableBorders,
    width: width ? { size: width, type: WidthType.DXA } : undefined,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: String(text),
            bold: isHeader,
            size: 20, // 10pt
          }),
        ],
      }),
    ],
  });
}

// Create the test results table
function createTestTable(data: PanelData): Table {
  // Header row
  const headerRow = new TableRow({
    children: [
      createCell("PANEL", true),
      createCell("TEST SWITCH", true),
      createCell("", true),
      createCell("", true),
      createCell("P841", true),
      createCell("", true),
      createCell("", true),
      createCell("P142", true),
      createCell("", true),
      createCell("", true),
      createCell("REF615", true),
      createCell("", true),
      createCell("", true),
      createCell("DM", true),
      createCell("", true),
      createCell("", true),
    ],
  });

  // Sub-header row (R Y B)
  const subHeaderRow = new TableRow({
    children: [
      createCell("", true),
      createCell("R", true),
      createCell("Y", true),
      createCell("B", true),
      createCell("R", true),
      createCell("Y", true),
      createCell("B", true),
      createCell("R", true),
      createCell("Y", true),
      createCell("B", true),
      createCell("R", true),
      createCell("Y", true),
      createCell("B", true),
      createCell("R", true),
      createCell("Y", true),
      createCell("B", true),
    ],
  });

  // Data row
  const dataRow = new TableRow({
    children: [
      createCell(data.panel),
      createCell(data.testSwitch.r),
      createCell(data.testSwitch.y),
      createCell(data.testSwitch.b),
      createCell(data.p841.r),
      createCell(data.p841.y),
      createCell(data.p841.b),
      createCell(data.p142.r),
      createCell(data.p142.y),
      createCell(data.p142.b),
      createCell(data.ref615.r),
      createCell(data.ref615.y),
      createCell(data.ref615.b),
      createCell(data.dm.r),
      createCell(data.dm.y),
      createCell(data.dm.b),
    ],
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, subHeaderRow, dataRow],
  });
}

// Generate DOCX document for a panel
function generateDocument(data: PanelData): Document {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "33kV CT SECONDARY INJECTION TEST",
                    bold: true,
                    size: 28,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Page " }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                  new TextRun({ text: " of " }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Title
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Panel ${data.panel} - CT Secondary Injection Test`,
                bold: true,
              }),
            ],
          }),

          // Info section
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "CT Ratio: ", bold: true }),
              new TextRun({ text: data.ctRatio }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Voltage Level: ", bold: true }),
              new TextRun({ text: "33kV" }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Test Date: ", bold: true }),
              new TextRun({ text: new Date().toLocaleDateString() }),
            ],
          }),

          // Spacer
          new Paragraph({ spacing: { after: 400 } }),

          // Test Results heading
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Test Results", bold: true }),
            ],
          }),

          // Test table
          createTestTable(data),

          // Spacer
          new Paragraph({ spacing: { after: 600 } }),

          // Signature section
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Tested By: _______________________", bold: false }),
              new TextRun({ text: "          Date: _______________" }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Reviewed By: ____________________", bold: false }),
              new TextRun({ text: "          Date: _______________" }),
            ],
          }),
        ],
      },
    ],
  });
}

// Main function
async function main() {
  const outputDir = path.join(process.env.HOME!, "abdout/yabreen");

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating 14 CT Secondary Injection Reports...`);
  console.log(`Output directory: ${outputDir}\n`);

  for (const config of PANELS) {
    const data = generatePanelData(config);
    const doc = generateDocument(data);

    const filename = `${config.id}-CT-Secondary-Injection.docx`;
    const filepath = path.join(outputDir, filename);

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filepath, buffer);

    console.log(`Created: ${filename}`);
    console.log(`  CT Ratio: ${data.ctRatio}`);
    console.log(`  Test Switch: R=${data.testSwitch.r}, Y=${data.testSwitch.y}, B=${data.testSwitch.b}`);
    if (config.hasP841) console.log(`  P841: R=${data.p841.r}, Y=${data.p841.y}, B=${data.p841.b}`);
    if (config.hasP142) console.log(`  P142: R=${data.p142.r}, Y=${data.p142.y}, B=${data.p142.b}`);
    if (config.hasREF615) console.log(`  REF615: R=${data.ref615.r}, Y=${data.ref615.y}, B=${data.ref615.b}`);
    if (config.hasDM) console.log(`  DM: R=${data.dm.r}, Y=${data.dm.y}, B=${data.dm.b}`);
    console.log();
  }

  console.log(`\nDone! Generated ${PANELS.length} reports in ${outputDir}`);
}

main().catch(console.error);
