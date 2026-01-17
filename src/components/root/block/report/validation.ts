import { z } from "zod";
import { REPORT_TYPES, REPORT_STATUSES, VOLTAGE_LEVELS } from "./types";

// Test result entry schema
export const testResultEntrySchema = z.object({
  testName: z.string().min(1, "Test name is required"),
  settingValue: z.number(),
  measuredValue: z.number(),
  unit: z.string(),
  tolerance: z.number().min(0).max(100),
  deviation: z.number(),
  result: z.enum(["PASS", "FAIL"]),
});

// Protection Relay test data schema
export const protectionRelayTestDataSchema = z.object({
  relayType: z.enum(["OVERCURRENT", "DIFFERENTIAL", "DISTANCE"]),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  ctRatio: z.string().min(1),
  ptRatio: z.string().optional(),
  overcurrent: z
    .object({
      phase: z.object({
        pickup: z.number().positive(),
        timeDial: z.number().positive(),
        curve: z.string(),
        tripTime: z.number().positive(),
      }),
      earth: z.object({
        pickup: z.number().positive(),
        timeDial: z.number().positive(),
        curve: z.string(),
        tripTime: z.number().positive(),
      }),
      instantaneous: z
        .object({
          pickup: z.number().positive(),
          operatingTime: z.number().positive(),
        })
        .optional(),
    })
    .optional(),
  differential: z
    .object({
      operatePoint: z.number(),
      restraintSlope: z.number(),
      highSetPoint: z.number(),
    })
    .optional(),
  testResults: z.array(testResultEntrySchema),
});

// Transformer test data schema
export const transformerTestDataSchema = z.object({
  transformerType: z.enum(["POWER", "DISTRIBUTION"]),
  rating: z.object({
    mva: z.number().positive(),
    primaryKV: z.number().positive(),
    secondaryKV: z.number().positive(),
    frequency: z.number().positive(),
    coolingType: z.string(),
  }),
  windingResistance: z.object({
    hvPhases: z.object({
      RY: z.number().nonnegative(),
      YB: z.number().nonnegative(),
      BR: z.number().nonnegative(),
    }),
    lvPhases: z.object({
      RY: z.number().nonnegative(),
      YB: z.number().nonnegative(),
      BR: z.number().nonnegative(),
    }),
    temperature: z.number(),
  }),
  turnsRatio: z.object({
    nominalRatio: z.number().positive(),
    tapPosition: z.number().int(),
    phases: z.array(
      z.object({
        phase: z.enum(["R", "Y", "B"]),
        measuredRatio: z.number().positive(),
        deviation: z.number(),
      })
    ),
  }),
  insulationResistance: z.object({
    hvToLv: z.number().positive(),
    hvToEarth: z.number().positive(),
    lvToEarth: z.number().positive(),
    testVoltage: z.number().positive(),
    polarizationIndex: z.number().positive(),
  }),
  oilTests: z
    .object({
      breakdownVoltage: z.number().positive(),
      moistureContent: z.number().nonnegative(),
      acidityNumber: z.number().nonnegative(),
    })
    .optional(),
  testResults: z.array(testResultEntrySchema),
});

// Switchgear test data schema
export const switchgearTestDataSchema = z.object({
  breakerType: z.enum(["VACUUM", "SF6"]),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  rating: z.object({
    ratedVoltage: z.number().positive(),
    ratedCurrent: z.number().positive(),
    breakingCapacity: z.number().positive(),
  }),
  timing: z.object({
    closeTime: z.object({
      phaseA: z.number().positive(),
      phaseB: z.number().positive(),
      phaseC: z.number().positive(),
    }),
    openTime: z.object({
      phaseA: z.number().positive(),
      phaseB: z.number().positive(),
      phaseC: z.number().positive(),
    }),
    simultaneity: z.number().nonnegative(),
  }),
  contactResistance: z.object({
    phaseA: z.number().positive(),
    phaseB: z.number().positive(),
    phaseC: z.number().positive(),
    acceptableLimit: z.number().positive(),
  }),
  insulationResistance: z.object({
    phaseToPhase: z.number().positive(),
    phaseToEarth: z.number().positive(),
    testVoltage: z.number().positive(),
  }),
  sf6Gas: z
    .object({
      pressure: z.number().positive(),
      moistureContent: z.number().nonnegative(),
      purity: z.number().min(0).max(100),
    })
    .optional(),
  motorOperation: z.object({
    springChargingTime: z.number().positive(),
    motorCurrent: z.number().positive(),
  }),
  testResults: z.array(testResultEntrySchema),
});

// Cable test data schema
export const cableTestDataSchema = z.object({
  cableType: z.string().min(1),
  length: z.number().positive(),
  crossSection: z.number().positive(),
  cores: z.number().int().positive(),
  insulationResistance: z.object({
    core1ToEarth: z.number().positive(),
    core2ToEarth: z.number().positive().optional(),
    core3ToEarth: z.number().positive().optional(),
    coreToCore: z.number().positive().optional(),
    testVoltage: z.number().positive(),
    temperature: z.number(),
    correctedValue: z.number().positive(),
  }),
  continuity: z.object({
    core1: z.number().nonnegative(),
    core2: z.number().nonnegative().optional(),
    core3: z.number().nonnegative().optional(),
  }),
  hiPot: z
    .object({
      testVoltage: z.number().positive(),
      duration: z.number().positive(),
      leakageCurrent: z.number().nonnegative(),
      result: z.enum(["PASS", "FAIL"]),
    })
    .optional(),
  testResults: z.array(testResultEntrySchema),
});

// Grounding test data schema
export const groundingTestDataSchema = z.object({
  groundingSystem: z.enum(["TN-S", "TN-C-S", "TT", "IT"]),
  earthResistance: z.object({
    mainEarth: z.number().positive(),
    neutralEarth: z.number().positive().optional(),
    equipmentEarth: z.number().positive().optional(),
    testMethod: z.enum(["FALL_OF_POTENTIAL", "CLAMP_ON", "STAKELESS"]),
    soilResistivity: z.number().positive().optional(),
  }),
  continuity: z.object({
    measurements: z.array(
      z.object({
        fromPoint: z.string().min(1),
        toPoint: z.string().min(1),
        resistance: z.number().nonnegative(),
        result: z.enum(["PASS", "FAIL"]),
      })
    ),
  }),
  testResults: z.array(testResultEntrySchema),
});

// Report form schema
export const reportFormSchema = z.object({
  reportNumber: z.string().min(1, "Report number is required"),
  reportType: z.enum(
    Object.keys(REPORT_TYPES) as [keyof typeof REPORT_TYPES, ...Array<keyof typeof REPORT_TYPES>]
  ),
  projectName: z.string().min(1, "Project name is required"),
  projectNumber: z.string().optional(),
  substationName: z.string().min(1, "Substation name is required"),
  voltageLevel: z.enum(
    Object.keys(VOLTAGE_LEVELS) as [keyof typeof VOLTAGE_LEVELS, ...Array<keyof typeof VOLTAGE_LEVELS>]
  ),
  location: z.string().optional(),
  testDate: z.date(),
  equipmentTag: z.string().min(1, "Equipment tag is required"),
  equipmentType: z.string().min(1, "Equipment type is required"),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  testedBy: z.string().min(1, "Tested by is required"),
  reviewedBy: z.string().optional(),
  ambientTemp: z.number().optional(),
  humidity: z.number().min(0).max(100).optional(),
  testData: z.union([
    protectionRelayTestDataSchema,
    transformerTestDataSchema,
    switchgearTestDataSchema,
    cableTestDataSchema,
    groundingTestDataSchema,
  ]),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
});

export type ReportFormSchema = z.infer<typeof reportFormSchema>;

// Generate report number
export function generateReportNumber(type: keyof typeof REPORT_TYPES): string {
  const prefix: Record<keyof typeof REPORT_TYPES, string> = {
    PROTECTION_RELAY: "PR",
    TRANSFORMER: "TR",
    SWITCHGEAR: "SW",
    CABLE: "CB",
    GROUNDING: "GR",
  };
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix[type]}-${year}${month}-${random}`;
}

// Default form values
export const defaultReportFormValues: Partial<ReportFormSchema> = {
  reportType: "PROTECTION_RELAY",
  voltageLevel: "KV_33",
  testDate: new Date(),
  notes: "",
  recommendations: "",
};
