"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
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

// Clean print-friendly styles - light borders only, no colors
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
    marginBottom: 15,
  },
  headerLeft: {
    width: "40%",
  },
  headerCenter: {
    width: "30%",
    textAlign: "center",
  },
  headerRight: {
    width: "30%",
    textAlign: "right",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "#444",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: 4,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: "#999",
  },
  table: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#999",
    backgroundColor: "#f5f5f5",
  },
  tableRow: {
    flexDirection: "row",
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#999",
  },
  tableCell: {
    padding: 4,
    borderRightWidth: 0.5,
    borderColor: "#999",
    fontSize: 8,
  },
  tableCellLast: {
    padding: 4,
    fontSize: 8,
  },
  tableCellHeader: {
    padding: 4,
    borderRightWidth: 0.5,
    borderColor: "#999",
    fontSize: 8,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  infoLabel: {
    width: "35%",
    fontWeight: "bold",
    color: "#444",
  },
  infoValue: {
    width: "65%",
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    width: "48%",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderColor: "#999",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "30%",
    borderTopWidth: 0.5,
    borderColor: "#999",
    paddingTop: 4,
    textAlign: "center",
  },
  passResult: {
    fontWeight: "bold",
  },
  failResult: {
    fontWeight: "bold",
  },
  notes: {
    marginTop: 10,
    padding: 8,
    borderWidth: 0.5,
    borderColor: "#999",
    fontSize: 8,
  },
});

interface ReportPDFProps {
  report: Report;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// Header Section
function ReportHeader({ report }: { report: Report }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={{ fontWeight: "bold" }}>T&C REPORT</Text>
        <Text style={{ fontSize: 8, color: "#666" }}>
          Testing & Commissioning
        </Text>
      </View>
      <View style={styles.headerCenter}>
        <Text style={styles.title}>
          {REPORT_TYPE_LABELS[report.reportType]}
        </Text>
        <Text style={styles.subtitle}>{report.header.projectName}</Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={{ fontWeight: "bold" }}>{report.reportNumber}</Text>
        <Text style={{ fontSize: 8 }}>Rev: {report.header.revisionNumber}</Text>
        <Text style={{ fontSize: 8 }}>Date: {formatDate(report.header.reportDate)}</Text>
      </View>
    </View>
  );
}

// Project Information Section
function ProjectInfoSection({ report }: { report: Report }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROJECT INFORMATION</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project Name:</Text>
            <Text style={styles.infoValue}>{report.header.projectName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project No:</Text>
            <Text style={styles.infoValue}>{report.header.projectNumber || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Substation:</Text>
            <Text style={styles.infoValue}>{report.header.substationName}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Voltage Level:</Text>
            <Text style={styles.infoValue}>
              {VOLTAGE_LEVELS[report.header.voltageLevel].label}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{report.header.location || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Test Date:</Text>
            <Text style={styles.infoValue}>{formatDate(report.header.testDate)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Equipment Information Section
function EquipmentInfoSection({ report }: { report: Report }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>EQUIPMENT INFORMATION</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Equipment Tag:</Text>
            <Text style={styles.infoValue}>{report.equipment.equipmentTag}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{report.equipment.equipmentType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Manufacturer:</Text>
            <Text style={styles.infoValue}>{report.equipment.manufacturer || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Model:</Text>
            <Text style={styles.infoValue}>{report.equipment.model || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Serial No:</Text>
            <Text style={styles.infoValue}>{report.equipment.serialNumber || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ambient Temp:</Text>
            <Text style={styles.infoValue}>
              {report.environmental.ambientTemp
                ? `${report.environmental.ambientTemp}°C`
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Test Results Table
function TestResultsTable({ results }: { results: TestResultEntry[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCellHeader, { width: "30%" }]}>Test</Text>
        <Text style={[styles.tableCellHeader, { width: "15%" }]}>Setting</Text>
        <Text style={[styles.tableCellHeader, { width: "15%" }]}>Measured</Text>
        <Text style={[styles.tableCellHeader, { width: "10%" }]}>Unit</Text>
        <Text style={[styles.tableCellHeader, { width: "10%" }]}>Tol %</Text>
        <Text style={[styles.tableCellHeader, { width: "10%" }]}>Dev %</Text>
        <Text style={[styles.tableCellLast, { width: "10%" }]}>Result</Text>
      </View>
      {results.map((result, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "30%" }]}>{result.testName}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>
            {result.settingValue.toFixed(3)}
          </Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>
            {result.measuredValue.toFixed(3)}
          </Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>{result.unit}</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>{result.tolerance}</Text>
          <Text style={[styles.tableCell, { width: "10%" }]}>
            {result.deviation.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.tableCellLast,
              { width: "10%" },
              result.result === "PASS" ? styles.passResult : styles.failResult,
            ]}
          >
            {result.result}
          </Text>
        </View>
      ))}
    </View>
  );
}

// Protection Relay Details
function ProtectionRelayDetails({ data }: { data: ProtectionRelayTestData }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>PROTECTION RELAY TEST DATA</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Relay Type:</Text>
            <Text style={styles.infoValue}>{data.relayType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Manufacturer:</Text>
            <Text style={styles.infoValue}>{data.manufacturer}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Model:</Text>
            <Text style={styles.infoValue}>{data.model}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CT Ratio:</Text>
            <Text style={styles.infoValue}>{data.ctRatio}</Text>
          </View>
        </View>
      </View>
      {data.overcurrent && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            Overcurrent Settings
          </Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { width: "20%" }]}>Element</Text>
              <Text style={[styles.tableCellHeader, { width: "20%" }]}>Pickup (A)</Text>
              <Text style={[styles.tableCellHeader, { width: "15%" }]}>Time Dial</Text>
              <Text style={[styles.tableCellHeader, { width: "25%" }]}>Curve</Text>
              <Text style={[styles.tableCellLast, { width: "20%" }]}>Trip Time (s)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>Phase</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {data.overcurrent.phase.pickup}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {data.overcurrent.phase.timeDial}
              </Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>
                {data.overcurrent.phase.curve}
              </Text>
              <Text style={[styles.tableCellLast, { width: "20%" }]}>
                {data.overcurrent.phase.tripTime}
              </Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "20%" }]}>Earth</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>
                {data.overcurrent.earth.pickup}
              </Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>
                {data.overcurrent.earth.timeDial}
              </Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>
                {data.overcurrent.earth.curve}
              </Text>
              <Text style={[styles.tableCellLast, { width: "20%" }]}>
                {data.overcurrent.earth.tripTime}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results</Text>
        <TestResultsTable results={data.testResults} />
      </View>
    </View>
  );
}

// Transformer Details
function TransformerDetails({ data }: { data: TransformerTestData }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TRANSFORMER TEST DATA</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{data.transformerType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rating:</Text>
            <Text style={styles.infoValue}>{data.rating.mva} MVA</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Primary Voltage:</Text>
            <Text style={styles.infoValue}>{data.rating.primaryKV} kV</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Secondary Voltage:</Text>
            <Text style={styles.infoValue}>{data.rating.secondaryKV} kV</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Frequency:</Text>
            <Text style={styles.infoValue}>{data.rating.frequency} Hz</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cooling:</Text>
            <Text style={styles.infoValue}>{data.rating.coolingType}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Winding Resistance (mOhm) @ {data.windingResistance.temperature}°C
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Winding</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>R-Y</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Y-B</Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>B-R</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>HV</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.windingResistance.hvPhases.RY.toFixed(3)}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.windingResistance.hvPhases.YB.toFixed(3)}
            </Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>
              {data.windingResistance.hvPhases.BR.toFixed(3)}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>LV</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.windingResistance.lvPhases.RY.toFixed(3)}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.windingResistance.lvPhases.YB.toFixed(3)}
            </Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>
              {data.windingResistance.lvPhases.BR.toFixed(3)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Insulation Resistance (MOhm) @ {data.insulationResistance.testVoltage}V DC
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>HV-LV</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>HV-Earth</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>LV-Earth</Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>PI</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.insulationResistance.hvToLv}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.insulationResistance.hvToEarth}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.insulationResistance.lvToEarth}
            </Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>
              {data.insulationResistance.polarizationIndex.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results</Text>
        <TestResultsTable results={data.testResults} />
      </View>
    </View>
  );
}

// Switchgear Details
function SwitchgearDetails({ data }: { data: SwitchgearTestData }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SWITCHGEAR TEST DATA</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Breaker Type:</Text>
            <Text style={styles.infoValue}>{data.breakerType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Manufacturer:</Text>
            <Text style={styles.infoValue}>{data.manufacturer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Model:</Text>
            <Text style={styles.infoValue}>{data.model}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rated Voltage:</Text>
            <Text style={styles.infoValue}>{data.rating.ratedVoltage} kV</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rated Current:</Text>
            <Text style={styles.infoValue}>{data.rating.ratedCurrent} A</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Breaking Capacity:</Text>
            <Text style={styles.infoValue}>{data.rating.breakingCapacity} kA</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Circuit Breaker Timing (ms)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Operation</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Phase A</Text>
            <Text style={[styles.tableCellHeader, { width: "25%" }]}>Phase B</Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>Phase C</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Close</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.timing.closeTime.phaseA}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.timing.closeTime.phaseB}
            </Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>
              {data.timing.closeTime.phaseC}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>Open</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.timing.openTime.phaseA}
            </Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.timing.openTime.phaseB}
            </Text>
            <Text style={[styles.tableCellLast, { width: "25%" }]}>
              {data.timing.openTime.phaseC}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 8, marginTop: 2 }}>
          Simultaneity: {data.timing.simultaneity} ms
        </Text>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Contact Resistance (μOhm) - Limit: {data.contactResistance.acceptableLimit}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Phase A</Text>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Phase B</Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>Phase C</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.contactResistance.phaseA}
            </Text>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.contactResistance.phaseB}
            </Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>
              {data.contactResistance.phaseC}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results</Text>
        <TestResultsTable results={data.testResults} />
      </View>
    </View>
  );
}

// Cable Details
function CableDetails({ data }: { data: CableTestData }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CABLE TEST DATA</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cable Type:</Text>
            <Text style={styles.infoValue}>{data.cableType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Length:</Text>
            <Text style={styles.infoValue}>{data.length} m</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cross Section:</Text>
            <Text style={styles.infoValue}>{data.crossSection} mm²</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cores:</Text>
            <Text style={styles.infoValue}>{data.cores}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Insulation Resistance (MOhm) @ {data.insulationResistance.testVoltage}V DC,{" "}
          {data.insulationResistance.temperature}°C
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Core 1-Earth</Text>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Core 2-Earth</Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>Core 3-Earth</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.insulationResistance.core1ToEarth}
            </Text>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.insulationResistance.core2ToEarth || "N/A"}
            </Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>
              {data.insulationResistance.core3ToEarth || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Continuity (Ohm)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Core 1</Text>
            <Text style={[styles.tableCellHeader, { width: "33%" }]}>Core 2</Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>Core 3</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.continuity.core1.toFixed(3)}
            </Text>
            <Text style={[styles.tableCell, { width: "33%" }]}>
              {data.continuity.core2?.toFixed(3) || "N/A"}
            </Text>
            <Text style={[styles.tableCellLast, { width: "34%" }]}>
              {data.continuity.core3?.toFixed(3) || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results</Text>
        <TestResultsTable results={data.testResults} />
      </View>
    </View>
  );
}

// Grounding Details
function GroundingDetails({ data }: { data: GroundingTestData }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>GROUNDING TEST DATA</Text>
      <View style={styles.twoColumn}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Grounding System:</Text>
            <Text style={styles.infoValue}>{data.groundingSystem}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Test Method:</Text>
            <Text style={styles.infoValue}>{data.earthResistance.testMethod}</Text>
          </View>
        </View>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Main Earth:</Text>
            <Text style={styles.infoValue}>{data.earthResistance.mainEarth} Ohm</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Soil Resistivity:</Text>
            <Text style={styles.infoValue}>
              {data.earthResistance.soilResistivity || "N/A"} Ohm-m
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
          Continuity Measurements (mOhm)
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: "30%" }]}>From</Text>
            <Text style={[styles.tableCellHeader, { width: "30%" }]}>To</Text>
            <Text style={[styles.tableCellHeader, { width: "20%" }]}>Resistance</Text>
            <Text style={[styles.tableCellLast, { width: "20%" }]}>Result</Text>
          </View>
          {data.continuity.measurements.map((m, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: "30%" }]}>{m.fromPoint}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{m.toPoint}</Text>
              <Text style={[styles.tableCell, { width: "20%" }]}>{m.resistance}</Text>
              <Text style={[styles.tableCellLast, { width: "20%" }]}>{m.result}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 8 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Test Results</Text>
        <TestResultsTable results={data.testResults} />
      </View>
    </View>
  );
}

// Test Data Section based on report type
function TestDataSection({ report }: { report: Report }) {
  const data = report.testData;

  switch (report.reportType) {
    case "PROTECTION_RELAY":
      return <ProtectionRelayDetails data={data as ProtectionRelayTestData} />;
    case "TRANSFORMER":
      return <TransformerDetails data={data as TransformerTestData} />;
    case "SWITCHGEAR":
      return <SwitchgearDetails data={data as SwitchgearTestData} />;
    case "CABLE":
      return <CableDetails data={data as CableTestData} />;
    case "GROUNDING":
      return <GroundingDetails data={data as GroundingTestData} />;
    default:
      return null;
  }
}

// Signature Section
function SignatureSection({ report }: { report: Report }) {
  return (
    <View style={styles.signatureSection}>
      <View style={styles.signatureBox}>
        <Text style={{ fontWeight: "bold", marginBottom: 20 }}>Tested By</Text>
        <Text>{report.header.testedBy}</Text>
        <Text style={{ fontSize: 7, color: "#666" }}>
          Date: {formatDate(report.header.testDate)}
        </Text>
      </View>
      <View style={styles.signatureBox}>
        <Text style={{ fontWeight: "bold", marginBottom: 20 }}>Reviewed By</Text>
        <Text>{report.header.reviewedBy || "________________"}</Text>
        <Text style={{ fontSize: 7, color: "#666" }}>Date: ____________</Text>
      </View>
      <View style={styles.signatureBox}>
        <Text style={{ fontWeight: "bold", marginBottom: 20 }}>Approved By</Text>
        <Text>{report.header.approvedBy || "________________"}</Text>
        <Text style={{ fontSize: 7, color: "#666" }}>Date: ____________</Text>
      </View>
    </View>
  );
}

// Notes Section
function NotesSection({ report }: { report: Report }) {
  if (!report.notes && !report.recommendations) return null;

  return (
    <View style={styles.notes}>
      {report.notes && (
        <View style={{ marginBottom: 6 }}>
          <Text style={{ fontWeight: "bold" }}>Notes:</Text>
          <Text>{report.notes}</Text>
        </View>
      )}
      {report.recommendations && (
        <View>
          <Text style={{ fontWeight: "bold" }}>Recommendations:</Text>
          <Text>{report.recommendations}</Text>
        </View>
      )}
    </View>
  );
}

// Footer
function PageFooter({ report }: { report: Report }) {
  return (
    <View style={styles.footer}>
      <Text>T&C Report - {report.header.projectName}</Text>
      <Text>Report No: {report.reportNumber}</Text>
      <Text
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        fixed
      />
    </View>
  );
}

// Main PDF Component
export function ReportPDF({ report }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <ReportHeader report={report} />
        <ProjectInfoSection report={report} />
        <EquipmentInfoSection report={report} />
        <TestDataSection report={report} />
        <NotesSection report={report} />
        <SignatureSection report={report} />
        <PageFooter report={report} />
      </Page>
    </Document>
  );
}
