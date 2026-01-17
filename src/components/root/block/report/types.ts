// T&C Report Block Types
// For electrical Testing & Commissioning in 33kV and 13.8kV substations

// Report type definitions matching Prisma enum
export const REPORT_TYPES = {
  PROTECTION_RELAY: "PROTECTION_RELAY",
  TRANSFORMER: "TRANSFORMER",
  SWITCHGEAR: "SWITCHGEAR",
  CABLE: "CABLE",
  GROUNDING: "GROUNDING",
} as const;

export type ReportType = keyof typeof REPORT_TYPES;

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  PROTECTION_RELAY: "Protection Relay Test",
  TRANSFORMER: "Transformer Test",
  SWITCHGEAR: "Switchgear Test",
  CABLE: "Cable Test",
  GROUNDING: "Grounding Test",
};

// Report status
export const REPORT_STATUSES = {
  DRAFT: "DRAFT",
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ReportStatus = keyof typeof REPORT_STATUSES;

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const REPORT_STATUS_COLORS: Record<ReportStatus, string> = {
  DRAFT: "bg-muted text-muted-foreground",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

// Voltage levels
export const VOLTAGE_LEVELS = {
  KV_33: { label: "33 kV", value: 33000 },
  KV_13_8: { label: "13.8 kV", value: 13800 },
} as const;

export type VoltageLevel = keyof typeof VOLTAGE_LEVELS;

// Common relay manufacturers in Saudi substations
export const RELAY_MANUFACTURERS = [
  "ABB",
  "Siemens",
  "SEL",
  "GE",
  "Schneider Electric",
  "Areva/Alstom",
] as const;

// IEC standard timing curves
export const IEC_CURVES = [
  "Standard Inverse",
  "Very Inverse",
  "Extremely Inverse",
  "Long Time Inverse",
] as const;

// CT Ratios commonly used
export const CT_RATIOS = [
  "100/5",
  "200/5",
  "400/5",
  "600/5",
  "800/5",
  "1000/5",
  "1200/5",
  "1600/5",
  "2000/5",
] as const;

// Transformer manufacturers
export const TRANSFORMER_MANUFACTURERS = [
  "ABB",
  "Siemens",
  "GE",
  "Schneider Electric",
  "Hyundai",
  "TBEA",
  "Hitachi",
] as const;

// Switchgear types
export const SWITCHGEAR_TYPES = {
  VACUUM: "Vacuum Circuit Breaker",
  SF6: "SF6 Circuit Breaker",
} as const;

export type SwitchgearType = keyof typeof SWITCHGEAR_TYPES;

// Report header information
export interface ReportHeader {
  reportNumber: string;
  projectName: string;
  projectNumber?: string;
  substationName: string;
  voltageLevel: VoltageLevel;
  location?: string;
  testDate: Date;
  reportDate: Date;
  testedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  revisionNumber: number;
}

// Equipment information
export interface EquipmentInfo {
  equipmentTag: string;
  equipmentType: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
}

// Environmental conditions during test
export interface EnvironmentalConditions {
  ambientTemp?: number; // Celsius
  humidity?: number; // Percentage
}

// Test result entry
export interface TestResultEntry {
  testName: string;
  settingValue: number;
  measuredValue: number;
  unit: string;
  tolerance: number; // Percentage
  deviation: number; // Percentage
  result: "PASS" | "FAIL";
}

// Protection Relay Test Data
export interface ProtectionRelayTestData {
  relayType: "OVERCURRENT" | "DIFFERENTIAL" | "DISTANCE";
  manufacturer: string;
  model: string;
  ctRatio: string;
  ptRatio?: string;
  overcurrent?: {
    phase: {
      pickup: number;
      timeDial: number;
      curve: string;
      tripTime: number;
    };
    earth: {
      pickup: number;
      timeDial: number;
      curve: string;
      tripTime: number;
    };
    instantaneous?: {
      pickup: number;
      operatingTime: number;
    };
  };
  differential?: {
    operatePoint: number;
    restraintSlope: number;
    highSetPoint: number;
  };
  testResults: TestResultEntry[];
}

// Transformer Test Data
export interface TransformerTestData {
  transformerType: "POWER" | "DISTRIBUTION";
  rating: {
    mva: number;
    primaryKV: number;
    secondaryKV: number;
    frequency: number;
    coolingType: string;
  };
  windingResistance: {
    hvPhases: { RY: number; YB: number; BR: number };
    lvPhases: { RY: number; YB: number; BR: number };
    temperature: number;
  };
  turnsRatio: {
    nominalRatio: number;
    tapPosition: number;
    phases: {
      phase: "R" | "Y" | "B";
      measuredRatio: number;
      deviation: number;
    }[];
  };
  insulationResistance: {
    hvToLv: number;
    hvToEarth: number;
    lvToEarth: number;
    testVoltage: number;
    polarizationIndex: number;
  };
  oilTests?: {
    breakdownVoltage: number;
    moistureContent: number;
    acidityNumber: number;
  };
  testResults: TestResultEntry[];
}

// Switchgear Test Data
export interface SwitchgearTestData {
  breakerType: SwitchgearType;
  manufacturer: string;
  model: string;
  rating: {
    ratedVoltage: number;
    ratedCurrent: number;
    breakingCapacity: number;
  };
  timing: {
    closeTime: { phaseA: number; phaseB: number; phaseC: number };
    openTime: { phaseA: number; phaseB: number; phaseC: number };
    simultaneity: number;
  };
  contactResistance: {
    phaseA: number;
    phaseB: number;
    phaseC: number;
    acceptableLimit: number;
  };
  insulationResistance: {
    phaseToPhase: number;
    phaseToEarth: number;
    testVoltage: number;
  };
  sf6Gas?: {
    pressure: number;
    moistureContent: number;
    purity: number;
  };
  motorOperation: {
    springChargingTime: number;
    motorCurrent: number;
  };
  testResults: TestResultEntry[];
}

// Cable Test Data
export interface CableTestData {
  cableType: string;
  length: number;
  crossSection: number;
  cores: number;
  insulationResistance: {
    core1ToEarth: number;
    core2ToEarth?: number;
    core3ToEarth?: number;
    coreToCore?: number;
    testVoltage: number;
    temperature: number;
    correctedValue: number;
  };
  continuity: {
    core1: number;
    core2?: number;
    core3?: number;
  };
  hiPot?: {
    testVoltage: number;
    duration: number;
    leakageCurrent: number;
    result: "PASS" | "FAIL";
  };
  testResults: TestResultEntry[];
}

// Grounding Test Data
export interface GroundingTestData {
  groundingSystem: "TN-S" | "TN-C-S" | "TT" | "IT";
  earthResistance: {
    mainEarth: number;
    neutralEarth?: number;
    equipmentEarth?: number;
    testMethod: "FALL_OF_POTENTIAL" | "CLAMP_ON" | "STAKELESS";
    soilResistivity?: number;
  };
  continuity: {
    measurements: {
      fromPoint: string;
      toPoint: string;
      resistance: number;
      result: "PASS" | "FAIL";
    }[];
  };
  testResults: TestResultEntry[];
}

// Union type for all test data
export type TestData =
  | ProtectionRelayTestData
  | TransformerTestData
  | SwitchgearTestData
  | CableTestData
  | GroundingTestData;

// Full Report interface
export interface Report {
  id: string;
  reportNumber: string;
  reportType: ReportType;
  status: ReportStatus;
  header: ReportHeader;
  equipment: EquipmentInfo;
  environmental: EnvironmentalConditions;
  testData: TestData;
  notes?: string;
  recommendations?: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

// Form data for creating/editing reports
export interface ReportFormData {
  reportNumber: string;
  reportType: ReportType;
  projectName: string;
  projectNumber?: string;
  substationName: string;
  voltageLevel: VoltageLevel;
  location?: string;
  testDate: Date;
  equipmentTag: string;
  equipmentType: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  testedBy: string;
  reviewedBy?: string;
  ambientTemp?: number;
  humidity?: number;
  testData: TestData;
  notes?: string;
  recommendations?: string;
}
