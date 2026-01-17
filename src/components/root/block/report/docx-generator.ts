import {
  Document,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  BorderStyle,
  WidthType,
  Packer,
  HeadingLevel,
  TableOfContents,
  PageBreak,
} from "docx";
import type {
  Report,
  TestResultEntry,
  ProtectionRelayTestData,
  TransformerTestData,
  SwitchgearTestData,
  CableTestData,
  GroundingTestData,
} from "./types";
import { REPORT_TYPE_LABELS, VOLTAGE_LEVELS } from "./types";

// Light border style - outline only, no colors
const lightBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "999999",
};

const tableBorders = {
  top: lightBorder,
  bottom: lightBorder,
  left: lightBorder,
  right: lightBorder,
  insideHorizontal: lightBorder,
  insideVertical: lightBorder,
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// Create header
function createHeader(report: Report): Header {
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorders,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "T&C REPORT", bold: true }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Testing & Commissioning",
                        size: 16,
                        color: "666666",
                      }),
                    ],
                  }),
                ],
                width: { size: 30, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: REPORT_TYPE_LABELS[report.reportType],
                        bold: true,
                        size: 28,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: report.header.projectName,
                        size: 20,
                        color: "444444",
                      }),
                    ],
                  }),
                ],
                width: { size: 40, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ text: report.reportNumber, bold: true }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `Rev: ${report.header.revisionNumber}`,
                        size: 16,
                      }),
                    ],
                  }),
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({
                        text: `Date: ${formatDate(report.header.reportDate)}`,
                        size: 16,
                      }),
                    ],
                  }),
                ],
                width: { size: 30, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// Create footer
function createFooter(report: Report): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `T&C Report - ${report.header.projectName} | Report No: ${report.reportNumber} | Page `,
            size: 16,
            color: "666666",
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: "666666",
          }),
          new TextRun({
            text: " of ",
            size: 16,
            color: "666666",
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 16,
            color: "666666",
          }),
        ],
      }),
    ],
  });
}

// Section title
function createSectionTitle(title: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    shading: { fill: "F0F0F0" },
    border: {
      top: lightBorder,
      bottom: lightBorder,
      left: lightBorder,
      right: lightBorder,
    },
    children: [new TextRun({ text: title, bold: true, size: 22 })],
  });
}

// Info row helper
function createInfoTable(rows: [string, string][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: label, bold: true, color: "444444" }),
                  ],
                }),
              ],
              width: { size: 35, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph({ text: value })],
              width: { size: 65, type: WidthType.PERCENTAGE },
            }),
          ],
        })
    ),
  });
}

// Project info section
function createProjectInfoSection(report: Report): (Paragraph | Table)[] {
  return [
    createSectionTitle("PROJECT INFORMATION"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                createInfoTable([
                  ["Project Name:", report.header.projectName],
                  ["Project No:", report.header.projectNumber || "N/A"],
                  ["Substation:", report.header.substationName],
                ]),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                createInfoTable([
                  ["Voltage Level:", VOLTAGE_LEVELS[report.header.voltageLevel].label],
                  ["Location:", report.header.location || "N/A"],
                  ["Test Date:", formatDate(report.header.testDate)],
                ]),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];
}

// Equipment info section
function createEquipmentInfoSection(report: Report): (Paragraph | Table)[] {
  return [
    createSectionTitle("EQUIPMENT INFORMATION"),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                createInfoTable([
                  ["Equipment Tag:", report.equipment.equipmentTag],
                  ["Type:", report.equipment.equipmentType],
                  ["Manufacturer:", report.equipment.manufacturer || "N/A"],
                ]),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                createInfoTable([
                  ["Model:", report.equipment.model || "N/A"],
                  ["Serial No:", report.equipment.serialNumber || "N/A"],
                  [
                    "Ambient Temp:",
                    report.environmental.ambientTemp
                      ? `${report.environmental.ambientTemp}°C`
                      : "N/A",
                  ],
                ]),
              ],
              width: { size: 50, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];
}

// Test results table
function createTestResultsTable(results: TestResultEntry[]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Test", bold: true, size: 18 })],
              }),
            ],
            width: { size: 30, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Setting", bold: true, size: 18 })],
              }),
            ],
            width: { size: 14, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Measured", bold: true, size: 18 })],
              }),
            ],
            width: { size: 14, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Unit", bold: true, size: 18 })],
              }),
            ],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Tol %", bold: true, size: 18 })],
              }),
            ],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Dev %", bold: true, size: 18 })],
              }),
            ],
            width: { size: 10, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            shading: { fill: "F5F5F5" },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Result", bold: true, size: 18 })],
              }),
            ],
            width: { size: 12, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      ...results.map(
        (result) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: result.testName })],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: result.settingValue.toFixed(3) }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: result.measuredValue.toFixed(3) }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: result.unit })],
              }),
              new TableCell({
                children: [new Paragraph({ text: String(result.tolerance) })],
              }),
              new TableCell({
                children: [new Paragraph({ text: result.deviation.toFixed(2) })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: result.result,
                        bold: true,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      ),
    ],
  });
}

// Protection relay section
function createProtectionRelaySection(
  data: ProtectionRelayTestData
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [
    createSectionTitle("PROTECTION RELAY TEST DATA"),
    createInfoTable([
      ["Relay Type:", data.relayType],
      ["Manufacturer:", data.manufacturer],
      ["Model:", data.model],
      ["CT Ratio:", data.ctRatio],
    ]),
    new Paragraph({ text: "" }),
  ];

  if (data.overcurrent) {
    elements.push(
      new Paragraph({
        children: [new TextRun({ text: "Overcurrent Settings", bold: true })],
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: tableBorders,
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Element", bold: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Pickup (A)", bold: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Time Dial", bold: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Curve", bold: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: "Trip Time (s)", bold: true })],
                  }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Phase" })] }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.phase.pickup) }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.phase.timeDial) }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: data.overcurrent.phase.curve })],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.phase.tripTime) }),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Earth" })] }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.earth.pickup) }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.earth.timeDial) }),
                ],
              }),
              new TableCell({
                children: [new Paragraph({ text: data.overcurrent.earth.curve })],
              }),
              new TableCell({
                children: [
                  new Paragraph({ text: String(data.overcurrent.earth.tripTime) }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({ text: "" })
    );
  }

  elements.push(
    new Paragraph({
      children: [new TextRun({ text: "Test Results", bold: true })],
    }),
    createTestResultsTable(data.testResults),
    new Paragraph({ text: "" })
  );

  return elements;
}

// Transformer section
function createTransformerSection(
  data: TransformerTestData
): (Paragraph | Table)[] {
  return [
    createSectionTitle("TRANSFORMER TEST DATA"),
    createInfoTable([
      ["Type:", data.transformerType],
      ["Rating:", `${data.rating.mva} MVA`],
      ["Primary Voltage:", `${data.rating.primaryKV} kV`],
      ["Secondary Voltage:", `${data.rating.secondaryKV} kV`],
      ["Frequency:", `${data.rating.frequency} Hz`],
      ["Cooling:", data.rating.coolingType],
    ]),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Winding Resistance (mOhm) @ ${data.windingResistance.temperature}°C`,
          bold: true,
        }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Winding", "R-Y", "Y-B", "B-R"].map(
            (text) =>
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text, bold: true })],
                  }),
                ],
              })
          ),
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "HV" })] }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.hvPhases.RY.toFixed(3),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.hvPhases.YB.toFixed(3),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.hvPhases.BR.toFixed(3),
                }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "LV" })] }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.lvPhases.RY.toFixed(3),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.lvPhases.YB.toFixed(3),
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: data.windingResistance.lvPhases.BR.toFixed(3),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Test Results", bold: true })],
    }),
    createTestResultsTable(data.testResults),
    new Paragraph({ text: "" }),
  ];
}

// Switchgear section
function createSwitchgearSection(
  data: SwitchgearTestData
): (Paragraph | Table)[] {
  return [
    createSectionTitle("SWITCHGEAR TEST DATA"),
    createInfoTable([
      ["Breaker Type:", data.breakerType],
      ["Manufacturer:", data.manufacturer],
      ["Model:", data.model],
      ["Rated Voltage:", `${data.rating.ratedVoltage} kV`],
      ["Rated Current:", `${data.rating.ratedCurrent} A`],
      ["Breaking Capacity:", `${data.rating.breakingCapacity} kA`],
    ]),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: "Circuit Breaker Timing (ms)", bold: true }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["Operation", "Phase A", "Phase B", "Phase C"].map(
            (text) =>
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text, bold: true })],
                  }),
                ],
              })
          ),
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Close" })] }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.closeTime.phaseA) }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.closeTime.phaseB) }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.closeTime.phaseC) }),
              ],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Open" })] }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.openTime.phaseA) }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.openTime.phaseB) }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({ text: String(data.timing.openTime.phaseC) }),
              ],
            }),
          ],
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Simultaneity: ${data.timing.simultaneity} ms`,
          size: 18,
        }),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Test Results", bold: true })],
    }),
    createTestResultsTable(data.testResults),
    new Paragraph({ text: "" }),
  ];
}

// Cable section
function createCableSection(data: CableTestData): (Paragraph | Table)[] {
  return [
    createSectionTitle("CABLE TEST DATA"),
    createInfoTable([
      ["Cable Type:", data.cableType],
      ["Length:", `${data.length} m`],
      ["Cross Section:", `${data.crossSection} mm²`],
      ["Cores:", String(data.cores)],
    ]),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Test Results", bold: true })],
    }),
    createTestResultsTable(data.testResults),
    new Paragraph({ text: "" }),
  ];
}

// Grounding section
function createGroundingSection(data: GroundingTestData): (Paragraph | Table)[] {
  return [
    createSectionTitle("GROUNDING TEST DATA"),
    createInfoTable([
      ["Grounding System:", data.groundingSystem],
      ["Test Method:", data.earthResistance.testMethod],
      ["Main Earth:", `${data.earthResistance.mainEarth} Ohm`],
      ["Soil Resistivity:", data.earthResistance.soilResistivity ? `${data.earthResistance.soilResistivity} Ohm-m` : "N/A"],
    ]),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [
        new TextRun({ text: "Continuity Measurements (mOhm)", bold: true }),
      ],
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          tableHeader: true,
          children: ["From", "To", "Resistance", "Result"].map(
            (text) =>
              new TableCell({
                shading: { fill: "F5F5F5" },
                children: [
                  new Paragraph({
                    children: [new TextRun({ text, bold: true })],
                  }),
                ],
              })
          ),
        }),
        ...data.continuity.measurements.map(
          (m) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ text: m.fromPoint })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: m.toPoint })],
                }),
                new TableCell({
                  children: [new Paragraph({ text: String(m.resistance) })],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: m.result, bold: true })],
                    }),
                  ],
                }),
              ],
            })
        ),
      ],
    }),
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun({ text: "Test Results", bold: true })],
    }),
    createTestResultsTable(data.testResults),
    new Paragraph({ text: "" }),
  ];
}

// Test data section based on report type
function createTestDataSection(report: Report): (Paragraph | Table)[] {
  const data = report.testData;

  switch (report.reportType) {
    case "PROTECTION_RELAY":
      return createProtectionRelaySection(data as ProtectionRelayTestData);
    case "TRANSFORMER":
      return createTransformerSection(data as TransformerTestData);
    case "SWITCHGEAR":
      return createSwitchgearSection(data as SwitchgearTestData);
    case "CABLE":
      return createCableSection(data as CableTestData);
    case "GROUNDING":
      return createGroundingSection(data as GroundingTestData);
    default:
      return [];
  }
}

// Notes section
function createNotesSection(report: Report): Paragraph[] {
  const elements: Paragraph[] = [];

  if (report.notes) {
    elements.push(
      new Paragraph({
        children: [new TextRun({ text: "Notes:", bold: true })],
      }),
      new Paragraph({ text: report.notes })
    );
  }

  if (report.recommendations) {
    elements.push(
      new Paragraph({
        children: [new TextRun({ text: "Recommendations:", bold: true })],
      }),
      new Paragraph({ text: report.recommendations })
    );
  }

  return elements;
}

// Signature section
function createSignatureSection(report: Report): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: { top: lightBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Tested By", bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: report.header.testedBy,
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `Date: ${formatDate(report.header.testDate)}`,
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
            ],
            width: { size: 33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: { top: lightBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Reviewed By", bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: report.header.reviewedBy || "________________",
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Date: ____________",
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
            ],
            width: { size: 33, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            borders: { top: lightBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Approved By", bold: true })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: report.header.approvedBy || "________________",
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Date: ____________",
                    size: 16,
                    color: "666666",
                  }),
                ],
              }),
            ],
            width: { size: 34, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
    ],
  });
}

// Main function to generate DOCX
export async function generateReportDocx(report: Report): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906, // A4 width in twips
              height: 16838, // A4 height in twips
            },
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: createHeader(report),
        },
        footers: {
          default: createFooter(report),
        },
        children: [
          ...createProjectInfoSection(report),
          ...createEquipmentInfoSection(report),
          ...createTestDataSection(report),
          ...createNotesSection(report),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          createSignatureSection(report),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
