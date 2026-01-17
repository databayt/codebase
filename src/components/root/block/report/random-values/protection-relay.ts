import { faker } from "@faker-js/faker";
import type { ProtectionRelayTestData, TestResultEntry } from "../types";
import {
  RELAY_MANUFACTURERS,
  IEC_CURVES,
  CT_RATIOS,
} from "../types";

const RELAY_MODELS: Record<string, string[]> = {
  ABB: ["REF615", "REF620", "REL670", "RET670"],
  Siemens: ["7SJ85", "7SJ82", "7UT85", "7SD87"],
  SEL: ["SEL-751", "SEL-751A", "SEL-787", "SEL-311L"],
  GE: ["F650", "T60", "L90", "D60"],
  "Schneider Electric": ["MiCOM P14x", "MiCOM P54x", "MiCOM P44x"],
  "Areva/Alstom": ["P14x", "P54x", "P44x", "P64x"],
};

// IEC 60255-151 timing formulas
function calculateIECTripTime(
  timeDial: number,
  multiple: number,
  curve: string
): number {
  const constants: Record<string, { k: number; alpha: number }> = {
    "Standard Inverse": { k: 0.14, alpha: 0.02 },
    "Very Inverse": { k: 13.5, alpha: 1.0 },
    "Extremely Inverse": { k: 80, alpha: 2.0 },
    "Long Time Inverse": { k: 120, alpha: 1.0 },
  };

  const { k, alpha } = constants[curve] || constants["Standard Inverse"];
  const time = (timeDial * k) / (Math.pow(multiple, alpha) - 1);
  return Math.round(time * 100) / 100;
}

function generateRelayTestResults(
  relayType: "OVERCURRENT" | "DIFFERENTIAL" | "DISTANCE"
): TestResultEntry[] {
  const functions: Record<string, string[]> = {
    OVERCURRENT: ["50P Phase O/C", "51P Phase IDMT", "50N Earth O/C", "51N Earth IDMT", "50G Ground Inst"],
    DIFFERENTIAL: ["87T Differential", "87G Generator Diff", "REF Restricted Earth"],
    DISTANCE: ["21 Zone 1", "21 Zone 2", "21 Zone 3", "67 Dir O/C", "67N Dir Earth"],
  };

  return (functions[relayType] || functions.OVERCURRENT).map((func) => {
    const settingValue = faker.number.float({
      min: 0.5,
      max: 5.0,
      fractionDigits: 3,
    });
    // Generate mostly passing results (within 5% tolerance per IEC)
    const deviation = faker.number.float({
      min: -4.5,
      max: 4.5,
      fractionDigits: 2,
    });
    const measuredValue = settingValue * (1 + deviation / 100);
    const tolerance = 5;

    return {
      testName: func,
      settingValue,
      measuredValue: Math.round(measuredValue * 1000) / 1000,
      unit: func.includes("Zone") ? "ohm" : "A",
      tolerance,
      deviation: Math.round(deviation * 100) / 100,
      result: Math.abs(deviation) <= tolerance ? "PASS" : "FAIL",
    };
  });
}

export function generateProtectionRelayData(): ProtectionRelayTestData {
  const relayType = faker.helpers.arrayElement([
    "OVERCURRENT",
    "DIFFERENTIAL",
    "DISTANCE",
  ] as const);

  const manufacturer = faker.helpers.arrayElement([...RELAY_MANUFACTURERS]);
  const models = RELAY_MODELS[manufacturer] || ["Generic Model"];
  const model = faker.helpers.arrayElement(models);
  const ctRatio = faker.helpers.arrayElement([...CT_RATIOS]);

  // Parse CT ratio to get secondary current
  const [primary] = ctRatio.split("/").map(Number);
  const nominalCurrent = primary;

  const basePickup = faker.number.float({
    min: 0.5,
    max: 1.5,
    fractionDigits: 2,
  });
  const timeDial = faker.number.float({
    min: 0.1,
    max: 0.8,
    fractionDigits: 2,
  });
  const curve = faker.helpers.arrayElement([...IEC_CURVES]);

  const data: ProtectionRelayTestData = {
    relayType,
    manufacturer,
    model,
    ctRatio,
    testResults: generateRelayTestResults(relayType),
  };

  if (relayType === "OVERCURRENT") {
    data.overcurrent = {
      phase: {
        pickup: Math.round(basePickup * nominalCurrent),
        timeDial,
        curve,
        tripTime: calculateIECTripTime(timeDial, 3.0, curve),
      },
      earth: {
        pickup: Math.round(basePickup * nominalCurrent * 0.2),
        timeDial: timeDial * 0.8,
        curve,
        tripTime: calculateIECTripTime(timeDial * 0.8, 3.0, curve),
      },
      instantaneous: {
        pickup: Math.round(basePickup * nominalCurrent * 10),
        operatingTime: faker.number.int({ min: 30, max: 80 }),
      },
    };
  } else if (relayType === "DIFFERENTIAL") {
    data.differential = {
      operatePoint: faker.number.float({ min: 15, max: 30, fractionDigits: 1 }),
      restraintSlope: faker.number.float({
        min: 25,
        max: 50,
        fractionDigits: 1,
      }),
      highSetPoint: faker.number.float({
        min: 100,
        max: 200,
        fractionDigits: 0,
      }),
    };
  } else {
    data.ptRatio = faker.helpers.arrayElement([
      "33000/110",
      "13800/110",
      "11000/110",
    ]);
  }

  return data;
}
