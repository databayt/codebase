import { faker } from "@faker-js/faker";
import type { GroundingTestData, TestResultEntry } from "../types";

const GROUNDING_SYSTEMS = ["TN-S", "TN-C-S", "TT", "IT"] as const;
const TEST_METHODS = ["FALL_OF_POTENTIAL", "CLAMP_ON", "STAKELESS"] as const;

const MEASUREMENT_POINTS = [
  { from: "Main Earth Bar", to: "Transformer Neutral" },
  { from: "Main Earth Bar", to: "Switchgear Frame" },
  { from: "Main Earth Bar", to: "Cable Tray" },
  { from: "Main Earth Bar", to: "Building Steel" },
  { from: "Transformer Neutral", to: "Earth Electrode 1" },
  { from: "Transformer Neutral", to: "Earth Electrode 2" },
  { from: "Switchgear Frame", to: "Local Earth Bar" },
  { from: "Motor Frame", to: "Local Earth Bar" },
  { from: "Panel Frame", to: "Earth Bar" },
  { from: "Equipment Bonding", to: "Main Earth" },
];

function generateGroundingTestResults(): TestResultEntry[] {
  const tests = [
    { name: "Main Earth Resistance", unit: "Ohm", range: [0.5, 5] },
    { name: "Neutral Earth Resistance", unit: "Ohm", range: [0.5, 5] },
    { name: "Equipment Earth Resistance", unit: "Ohm", range: [0.5, 10] },
    { name: "Bonding Continuity", unit: "mOhm", range: [1, 50] },
    { name: "Grid Mesh Resistance", unit: "Ohm", range: [1, 10] },
  ];

  return tests.map((test) => {
    const settingValue = faker.number.float({
      min: test.range[0],
      max: test.range[1],
      fractionDigits: test.unit === "mOhm" ? 1 : 2,
    });
    const deviation = faker.number.float({
      min: -10,
      max: 10,
      fractionDigits: 1,
    });
    const measuredValue = settingValue * (1 + deviation / 100);

    // Earth resistance tolerance is typically higher
    const tolerance = test.unit === "mOhm" ? 10 : 20;

    return {
      testName: test.name,
      settingValue,
      measuredValue: Math.round(measuredValue * 100) / 100,
      unit: test.unit,
      tolerance,
      deviation: Math.round(deviation * 10) / 10,
      result: Math.abs(deviation) <= tolerance ? "PASS" : "FAIL",
    };
  });
}

export function generateGroundingData(): GroundingTestData {
  const groundingSystem = faker.helpers.arrayElement([...GROUNDING_SYSTEMS]);
  const testMethod = faker.helpers.arrayElement([...TEST_METHODS]);

  // Number of continuity measurements (5-10)
  const numMeasurements = faker.number.int({ min: 5, max: 10 });
  const selectedPoints = faker.helpers.arrayElements(
    MEASUREMENT_POINTS,
    numMeasurements
  );

  return {
    groundingSystem,
    earthResistance: {
      mainEarth: faker.number.float({ min: 0.5, max: 5, fractionDigits: 2 }),
      neutralEarth: faker.datatype.boolean({ probability: 0.7 })
        ? faker.number.float({ min: 0.5, max: 5, fractionDigits: 2 })
        : undefined,
      equipmentEarth: faker.datatype.boolean({ probability: 0.7 })
        ? faker.number.float({ min: 1, max: 10, fractionDigits: 2 })
        : undefined,
      testMethod,
      soilResistivity: testMethod === "FALL_OF_POTENTIAL"
        ? faker.number.int({ min: 50, max: 500 })
        : undefined,
    },
    continuity: {
      measurements: selectedPoints.map((point) => {
        const resistance = faker.number.float({
          min: 0.5,
          max: 50,
          fractionDigits: 1,
        });
        // Bonding continuity should be < 0.1 ohm per IEC
        const acceptableLimit = point.from.includes("Bonding") ? 100 : 1000;
        return {
          fromPoint: point.from,
          toPoint: point.to,
          resistance, // in milliohms
          result: resistance <= acceptableLimit ? "PASS" : "FAIL",
        };
      }),
    },
    testResults: generateGroundingTestResults(),
  };
}
