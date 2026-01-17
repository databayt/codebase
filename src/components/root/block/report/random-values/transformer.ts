import { faker } from "@faker-js/faker";
import type { TransformerTestData, TestResultEntry } from "../types";
import { TRANSFORMER_MANUFACTURERS } from "../types";

const COOLING_TYPES = ["ONAN", "ONAF", "OFAF", "ODAF"];
const MVA_RATINGS = [2.5, 5, 10, 16, 20, 25, 31.5, 40, 50, 63, 80, 100];

function generateTransformerTestResults(): TestResultEntry[] {
  const tests = [
    { name: "Winding Resistance HV", unit: "mOhm", range: [0.5, 5] },
    { name: "Winding Resistance LV", unit: "mOhm", range: [0.1, 1] },
    { name: "Turns Ratio", unit: "ratio", range: [0.98, 1.02] },
    { name: "IR HV-LV", unit: "MOhm", range: [1000, 5000] },
    { name: "IR HV-Earth", unit: "MOhm", range: [1000, 5000] },
    { name: "Polarization Index", unit: "", range: [2, 4] },
  ];

  return tests.map((test) => {
    const settingValue = faker.number.float({
      min: test.range[0],
      max: test.range[1],
      fractionDigits: 2,
    });
    const deviation = faker.number.float({
      min: -1.5,
      max: 1.5,
      fractionDigits: 2,
    });
    const measuredValue = settingValue * (1 + deviation / 100);

    return {
      testName: test.name,
      settingValue,
      measuredValue: Math.round(measuredValue * 100) / 100,
      unit: test.unit,
      tolerance: 2,
      deviation: Math.round(deviation * 100) / 100,
      result: Math.abs(deviation) <= 2 ? "PASS" : "FAIL",
    };
  });
}

export function generateTransformerData(
  voltageLevel: "KV_33" | "KV_13_8" = "KV_33"
): TransformerTestData {
  const primaryKV = voltageLevel === "KV_33" ? 33 : 13.8;
  const secondaryKV = faker.helpers.arrayElement([0.4, 0.69, 6.6, 11]);
  const mva = faker.helpers.arrayElement(MVA_RATINGS);

  // Generate realistic winding resistance values based on transformer size
  const baseHVResistance = 10 / mva; // Inverse relationship with MVA
  const baseLVResistance = baseHVResistance * 0.1;

  const generatePhaseResistance = (base: number) => ({
    RY: Math.round(base * faker.number.float({ min: 0.98, max: 1.02 }) * 1000) / 1000,
    YB: Math.round(base * faker.number.float({ min: 0.98, max: 1.02 }) * 1000) / 1000,
    BR: Math.round(base * faker.number.float({ min: 0.98, max: 1.02 }) * 1000) / 1000,
  });

  const nominalRatio = primaryKV / secondaryKV;
  const testTemperature = faker.number.int({ min: 20, max: 35 });

  return {
    transformerType: mva >= 10 ? "POWER" : "DISTRIBUTION",
    rating: {
      mva,
      primaryKV,
      secondaryKV,
      frequency: 60, // Saudi Arabia uses 60Hz
      coolingType: faker.helpers.arrayElement(COOLING_TYPES),
    },
    windingResistance: {
      hvPhases: generatePhaseResistance(baseHVResistance),
      lvPhases: generatePhaseResistance(baseLVResistance),
      temperature: testTemperature,
    },
    turnsRatio: {
      nominalRatio: Math.round(nominalRatio * 1000) / 1000,
      tapPosition: faker.number.int({ min: -2, max: 2 }),
      phases: (["R", "Y", "B"] as const).map((phase) => {
        const deviation = faker.number.float({
          min: -0.4,
          max: 0.4,
          fractionDigits: 2,
        });
        return {
          phase,
          measuredRatio: Math.round(nominalRatio * (1 + deviation / 100) * 1000) / 1000,
          deviation,
        };
      }),
    },
    insulationResistance: {
      hvToLv: faker.number.int({ min: 2000, max: 8000 }),
      hvToEarth: faker.number.int({ min: 2000, max: 8000 }),
      lvToEarth: faker.number.int({ min: 1500, max: 6000 }),
      testVoltage: primaryKV >= 33 ? 5000 : 2500,
      polarizationIndex: faker.number.float({
        min: 2.0,
        max: 4.0,
        fractionDigits: 2,
      }),
    },
    oilTests: faker.datatype.boolean({ probability: 0.7 })
      ? {
          breakdownVoltage: faker.number.int({ min: 50, max: 80 }), // kV
          moistureContent: faker.number.int({ min: 5, max: 20 }), // ppm
          acidityNumber: faker.number.float({
            min: 0.01,
            max: 0.1,
            fractionDigits: 3,
          }),
        }
      : undefined,
    testResults: generateTransformerTestResults(),
  };
}
