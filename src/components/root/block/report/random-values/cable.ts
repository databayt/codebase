import { faker } from "@faker-js/faker";
import type { CableTestData, TestResultEntry } from "../types";

const CABLE_TYPES = [
  "XLPE 3x240mm2 Cu",
  "XLPE 3x185mm2 Cu",
  "XLPE 3x150mm2 Cu",
  "XLPE 3x120mm2 Cu",
  "XLPE 3x95mm2 Cu",
  "XLPE 3x70mm2 Cu",
  "XLPE 1x400mm2 Cu",
  "XLPE 1x300mm2 Cu",
  "PVC 4x16mm2 Cu",
  "PVC 4x10mm2 Cu",
];

const CROSS_SECTIONS = [70, 95, 120, 150, 185, 240, 300, 400];

function generateCableTestResults(cores: number): TestResultEntry[] {
  const tests = [
    { name: "IR Core 1 to Earth", unit: "MOhm", range: [500, 2000] },
    { name: "IR Core 2 to Earth", unit: "MOhm", range: [500, 2000] },
    { name: "IR Core 3 to Earth", unit: "MOhm", range: [500, 2000] },
    { name: "Continuity Core 1", unit: "Ohm", range: [0.1, 2] },
    { name: "Continuity Core 2", unit: "Ohm", range: [0.1, 2] },
    { name: "Continuity Core 3", unit: "Ohm", range: [0.1, 2] },
  ].slice(0, cores * 2);

  return tests.map((test) => {
    const settingValue = faker.number.float({
      min: test.range[0],
      max: test.range[1],
      fractionDigits: test.unit === "Ohm" ? 3 : 0,
    });
    const deviation = faker.number.float({
      min: -5,
      max: 5,
      fractionDigits: 1,
    });
    const measuredValue = settingValue * (1 + deviation / 100);

    return {
      testName: test.name,
      settingValue,
      measuredValue: Math.round(measuredValue * (test.unit === "Ohm" ? 1000 : 1)) / (test.unit === "Ohm" ? 1000 : 1),
      unit: test.unit,
      tolerance: 10,
      deviation: Math.round(deviation * 10) / 10,
      result: Math.abs(deviation) <= 10 ? "PASS" : "FAIL",
    };
  });
}

export function generateCableData(
  voltageLevel: "KV_33" | "KV_13_8" = "KV_33"
): CableTestData {
  const cableType = faker.helpers.arrayElement(CABLE_TYPES);
  const crossSection = faker.helpers.arrayElement(CROSS_SECTIONS);
  const cores = cableType.includes("1x") ? 1 : cableType.includes("4x") ? 4 : 3;
  const length = faker.number.int({ min: 50, max: 2000 });

  // Temperature correction factor for insulation resistance
  const testTemperature = faker.number.int({ min: 20, max: 40 });
  const temperatureFactor = Math.pow(1.5, (testTemperature - 20) / 10);

  // Base insulation resistance depends on cable length and cross-section
  const baseIR = Math.round((5000 * crossSection) / length);

  const generateCoreIR = () =>
    faker.number.int({
      min: Math.max(baseIR * 0.8, 500),
      max: baseIR * 1.2,
    });

  // Continuity resistance based on length and cross-section (copper)
  const baseResistance = (length * 0.0175) / crossSection;

  return {
    cableType,
    length,
    crossSection,
    cores,
    insulationResistance: {
      core1ToEarth: generateCoreIR(),
      core2ToEarth: cores >= 2 ? generateCoreIR() : undefined,
      core3ToEarth: cores >= 3 ? generateCoreIR() : undefined,
      coreToCore: cores >= 2 ? generateCoreIR() : undefined,
      testVoltage: voltageLevel === "KV_33" ? 5000 : 2500,
      temperature: testTemperature,
      correctedValue: Math.round(generateCoreIR() / temperatureFactor),
    },
    continuity: {
      core1: Math.round(baseResistance * faker.number.float({ min: 0.95, max: 1.05 }) * 1000) / 1000,
      core2: cores >= 2
        ? Math.round(baseResistance * faker.number.float({ min: 0.95, max: 1.05 }) * 1000) / 1000
        : undefined,
      core3: cores >= 3
        ? Math.round(baseResistance * faker.number.float({ min: 0.95, max: 1.05 }) * 1000) / 1000
        : undefined,
    },
    hiPot: faker.datatype.boolean({ probability: 0.6 })
      ? {
          testVoltage: voltageLevel === "KV_33" ? 75 : 35, // kV DC
          duration: 15, // minutes
          leakageCurrent: faker.number.int({ min: 5, max: 50 }), // microAmps
          result: faker.datatype.boolean({ probability: 0.95 }) ? "PASS" : "FAIL",
        }
      : undefined,
    testResults: generateCableTestResults(cores),
  };
}
