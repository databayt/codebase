// Random Value Generators for T&C Reports
// Using @faker-js/faker with IEC/IEEE standard ranges

export { generateProtectionRelayData } from "./protection-relay";
export { generateTransformerData } from "./transformer";
export { generateSwitchgearData } from "./switchgear";
export { generateCableData } from "./cable";
export { generateGroundingData } from "./grounding";

import { faker } from "@faker-js/faker";
import { generateProtectionRelayData } from "./protection-relay";
import { generateTransformerData } from "./transformer";
import { generateSwitchgearData } from "./switchgear";
import { generateCableData } from "./cable";
import { generateGroundingData } from "./grounding";
import type { ReportType, VoltageLevel, TestData, ReportFormData } from "../types";
import { generateReportNumber } from "../validation";

// Saudi Arabian cities with substations
const SAUDI_LOCATIONS = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Mecca",
  "Medina",
  "Dhahran",
  "Jubail",
  "Yanbu",
  "Tabuk",
  "Abha",
];

const SUBSTATION_NAMES = [
  "Main Substation",
  "North Distribution SS",
  "South Distribution SS",
  "Industrial Zone SS",
  "Commercial Area SS",
  "Residential Complex SS",
  "Airport SS",
  "Hospital SS",
  "University SS",
  "Port Authority SS",
];

const ENGINEER_NAMES = [
  "Ahmed Al-Rashid",
  "Mohammed Al-Zahrani",
  "Khalid Al-Harbi",
  "Abdullah Al-Ghamdi",
  "Omar Al-Shahrani",
  "Faisal Al-Qahtani",
  "Saeed Al-Otaibi",
  "Hassan Al-Maliki",
  "Youssef Al-Shehri",
  "Ibrahim Al-Dosari",
];

const PROJECT_NAMES = [
  "SEC Grid Expansion Project",
  "Industrial Park Development",
  "NEOM Infrastructure Phase 1",
  "Riyadh Metro Power Supply",
  "Aramco Facility Upgrade",
  "SABIC Plant Expansion",
  "Saudi Ports Development",
  "Healthcare Facilities Power",
  "Education Sector Electrification",
  "Renewable Integration Project",
];

// Equipment type based on report type
const EQUIPMENT_TYPES: Record<ReportType, string[]> = {
  PROTECTION_RELAY: [
    "Overcurrent Relay",
    "Differential Relay",
    "Distance Relay",
    "Motor Protection Relay",
    "Feeder Protection Relay",
  ],
  TRANSFORMER: [
    "Power Transformer",
    "Distribution Transformer",
    "Auto Transformer",
    "Instrument Transformer",
  ],
  SWITCHGEAR: [
    "Vacuum Circuit Breaker",
    "SF6 Circuit Breaker",
    "Load Break Switch",
    "Disconnector",
  ],
  CABLE: [
    "MV Power Cable",
    "LV Power Cable",
    "Control Cable",
    "Instrumentation Cable",
  ],
  GROUNDING: [
    "Earth Grid System",
    "Substation Grounding",
    "Equipment Grounding",
    "Lightning Protection",
  ],
};

/**
 * Generate random test data based on report type
 */
export function generateTestData(
  reportType: ReportType,
  voltageLevel: VoltageLevel = "KV_33"
): TestData {
  switch (reportType) {
    case "PROTECTION_RELAY":
      return generateProtectionRelayData();
    case "TRANSFORMER":
      return generateTransformerData(voltageLevel);
    case "SWITCHGEAR":
      return generateSwitchgearData(voltageLevel);
    case "CABLE":
      return generateCableData(voltageLevel);
    case "GROUNDING":
      return generateGroundingData();
    default:
      return generateProtectionRelayData();
  }
}

/**
 * Generate a complete random report form data
 */
export function generateRandomReportFormData(
  reportType: ReportType = faker.helpers.arrayElement([
    "PROTECTION_RELAY",
    "TRANSFORMER",
    "SWITCHGEAR",
    "CABLE",
    "GROUNDING",
  ] as ReportType[])
): ReportFormData {
  const voltageLevel = faker.helpers.arrayElement(["KV_33", "KV_13_8"] as VoltageLevel[]);
  const equipmentTypes = EQUIPMENT_TYPES[reportType];

  return {
    reportNumber: generateReportNumber(reportType),
    reportType,
    projectName: faker.helpers.arrayElement(PROJECT_NAMES),
    projectNumber: `PRJ-${faker.number.int({ min: 1000, max: 9999 })}`,
    substationName: faker.helpers.arrayElement(SUBSTATION_NAMES),
    voltageLevel,
    location: faker.helpers.arrayElement(SAUDI_LOCATIONS),
    testDate: faker.date.recent({ days: 30 }),
    equipmentTag: `${reportType.substring(0, 2)}-${faker.number.int({ min: 100, max: 999 })}`,
    equipmentType: faker.helpers.arrayElement(equipmentTypes),
    manufacturer: faker.helpers.arrayElement([
      "ABB",
      "Siemens",
      "GE",
      "Schneider Electric",
    ]),
    model: `Model-${faker.string.alphanumeric(6).toUpperCase()}`,
    serialNumber: faker.string.alphanumeric(12).toUpperCase(),
    testedBy: faker.helpers.arrayElement(ENGINEER_NAMES),
    reviewedBy: faker.datatype.boolean({ probability: 0.7 })
      ? faker.helpers.arrayElement(ENGINEER_NAMES)
      : undefined,
    ambientTemp: faker.number.int({ min: 20, max: 45 }),
    humidity: faker.number.int({ min: 30, max: 80 }),
    testData: generateTestData(reportType, voltageLevel),
    notes: faker.datatype.boolean({ probability: 0.5 })
      ? "All tests performed as per IEC/IEEE standards. Equipment found in satisfactory condition."
      : undefined,
    recommendations: faker.datatype.boolean({ probability: 0.3 })
      ? "Schedule follow-up inspection in 6 months. Monitor insulation resistance trend."
      : undefined,
  };
}
