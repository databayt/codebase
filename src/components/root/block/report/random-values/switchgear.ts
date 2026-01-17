import { faker } from "@faker-js/faker";
import type { SwitchgearTestData, TestResultEntry, SwitchgearType } from "../types";

const CB_MANUFACTURERS = ["ABB", "Siemens", "Schneider Electric", "GE", "Hyundai", "Mitsubishi"];

const CB_MODELS: Record<string, Record<SwitchgearType, string[]>> = {
  ABB: { VACUUM: ["VD4", "VM1"], SF6: ["HD4", "ELK-14"] },
  Siemens: { VACUUM: ["3AH", "3AE"], SF6: ["8DA", "8DB"] },
  "Schneider Electric": { VACUUM: ["Evolis", "HVX"], SF6: ["FBX", "FG2"] },
  GE: { VACUUM: ["VB1", "VB2"], SF6: ["FK", "FKG"] },
  Hyundai: { VACUUM: ["HVF", "HGF"], SF6: ["HGF-SD", "HGF-ND"] },
  Mitsubishi: { VACUUM: ["VCB", "VSV"], SF6: ["SFG", "GCB"] },
};

function generateSwitchgearTestResults(): TestResultEntry[] {
  const tests = [
    { name: "Close Time Phase A", unit: "ms", range: [45, 65] },
    { name: "Close Time Phase B", unit: "ms", range: [45, 65] },
    { name: "Close Time Phase C", unit: "ms", range: [45, 65] },
    { name: "Open Time Phase A", unit: "ms", range: [25, 45] },
    { name: "Open Time Phase B", unit: "ms", range: [25, 45] },
    { name: "Open Time Phase C", unit: "ms", range: [25, 45] },
    { name: "Contact Resistance A", unit: "uOhm", range: [30, 80] },
    { name: "Contact Resistance B", unit: "uOhm", range: [30, 80] },
    { name: "Contact Resistance C", unit: "uOhm", range: [30, 80] },
  ];

  return tests.map((test) => {
    const settingValue = faker.number.float({
      min: test.range[0],
      max: test.range[1],
      fractionDigits: 1,
    });
    const deviation = faker.number.float({
      min: -3,
      max: 3,
      fractionDigits: 1,
    });
    const measuredValue = settingValue * (1 + deviation / 100);

    return {
      testName: test.name,
      settingValue,
      measuredValue: Math.round(measuredValue * 10) / 10,
      unit: test.unit,
      tolerance: 5,
      deviation: Math.round(deviation * 10) / 10,
      result: Math.abs(deviation) <= 5 ? "PASS" : "FAIL",
    };
  });
}

export function generateSwitchgearData(
  voltageLevel: "KV_33" | "KV_13_8" = "KV_33"
): SwitchgearTestData {
  const breakerType = faker.helpers.arrayElement(["VACUUM", "SF6"] as const);
  const manufacturer = faker.helpers.arrayElement(CB_MANUFACTURERS);
  const models = CB_MODELS[manufacturer]?.[breakerType] || ["Generic CB"];
  const model = faker.helpers.arrayElement(models);

  const ratedVoltage = voltageLevel === "KV_33" ? 36 : 15;
  const ratedCurrent = faker.helpers.arrayElement([630, 1250, 2000, 2500, 3150]);
  const breakingCapacity = faker.helpers.arrayElement([25, 31.5, 40, 50]);

  // Generate timing values - close times are typically 45-65ms, open 25-45ms
  const generateTimingPhases = (base: number, variation: number) => ({
    phaseA: Math.round((base + faker.number.float({ min: -variation, max: variation })) * 10) / 10,
    phaseB: Math.round((base + faker.number.float({ min: -variation, max: variation })) * 10) / 10,
    phaseC: Math.round((base + faker.number.float({ min: -variation, max: variation })) * 10) / 10,
  });

  const closeTime = generateTimingPhases(55, 5);
  const openTime = generateTimingPhases(35, 5);

  // Calculate simultaneity (max difference between phases)
  const closeSimultaneity = Math.max(
    Math.abs(closeTime.phaseA - closeTime.phaseB),
    Math.abs(closeTime.phaseB - closeTime.phaseC),
    Math.abs(closeTime.phaseC - closeTime.phaseA)
  );

  return {
    breakerType,
    manufacturer,
    model,
    rating: {
      ratedVoltage,
      ratedCurrent,
      breakingCapacity,
    },
    timing: {
      closeTime,
      openTime,
      simultaneity: Math.round(closeSimultaneity * 10) / 10,
    },
    contactResistance: {
      phaseA: faker.number.int({ min: 35, max: 75 }),
      phaseB: faker.number.int({ min: 35, max: 75 }),
      phaseC: faker.number.int({ min: 35, max: 75 }),
      acceptableLimit: 100, // micro-ohms per IEEE/IEC
    },
    insulationResistance: {
      phaseToPhase: faker.number.int({ min: 5000, max: 15000 }),
      phaseToEarth: faker.number.int({ min: 5000, max: 15000 }),
      testVoltage: ratedVoltage >= 36 ? 5000 : 2500,
    },
    sf6Gas: breakerType === "SF6"
      ? {
          pressure: faker.number.float({ min: 5.5, max: 6.5, fractionDigits: 2 }),
          moistureContent: faker.number.int({ min: 50, max: 200 }),
          purity: faker.number.float({ min: 98, max: 99.9, fractionDigits: 1 }),
        }
      : undefined,
    motorOperation: {
      springChargingTime: faker.number.float({ min: 8, max: 15, fractionDigits: 1 }),
      motorCurrent: faker.number.float({ min: 2, max: 5, fractionDigits: 1 }),
    },
    testResults: generateSwitchgearTestResults(),
  };
}
