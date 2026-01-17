# Report Generate Command

Generate a T&C report with random IEC/IEEE compliant test values.

## Usage
```
/report-generate <type> [options]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `type` | Yes | Report type (see types below) |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--voltage` | `KV_33` | Voltage level |
| `--manufacturer` | random | Equipment manufacturer |
| `--project` | random | Project name |
| `--substation` | random | Substation name |
| `--export` | none | Auto-export format (pdf/docx/both) |

## Report Types

| Type | Description |
|------|-------------|
| `PROTECTION_RELAY` | Overcurrent, distance, differential relay tests |
| `TRANSFORMER` | Winding resistance, turns ratio, insulation tests |
| `SWITCHGEAR` | CB timing, contact resistance, insulation tests |
| `CABLE` | Insulation resistance, continuity, VLF tests |
| `GROUNDING` | Earth resistance, step/touch voltage tests |

## Execution

### Step 1: Parse Arguments
```
$ARGUMENTS = user input
```

Extract:
- `type`: First positional argument (required)
- `--voltage`: Voltage level option
- `--manufacturer`: Manufacturer option
- `--project`: Project name option
- `--substation`: Substation name option
- `--export`: Export format option

### Step 2: Validate Type

Valid types:
- `PROTECTION_RELAY`
- `TRANSFORMER`
- `SWITCHGEAR`
- `CABLE`
- `GROUNDING`

If invalid, show error and list valid types.

### Step 3: Generate Report Data

Use functions from report block:

```typescript
import { generateRandomReportFormData } from "@/components/root/block/report/random-values"

const formData = generateRandomReportFormData(type, {
  voltage: options.voltage,
  manufacturer: options.manufacturer,
  projectName: options.project,
  substationName: options.substation,
})
```

### Step 4: Create Report Object

```typescript
const report = {
  id: `demo-${Date.now()}`,
  reportNumber: formData.reportNumber,
  reportType: formData.reportType,
  status: "DRAFT",
  header: {
    reportNumber: formData.reportNumber,
    projectName: formData.projectName,
    projectNumber: formData.projectNumber,
    substationName: formData.substationName,
    voltageLevel: formData.voltageLevel,
    location: formData.location,
    testDate: formData.testDate,
    reportDate: new Date(),
    testedBy: formData.testedBy,
    reviewedBy: formData.reviewedBy,
    revisionNumber: 1,
  },
  equipment: {
    equipmentTag: formData.equipmentTag,
    equipmentType: formData.equipmentType,
    manufacturer: formData.manufacturer,
    model: formData.model,
    serialNumber: formData.serialNumber,
  },
  environmental: {
    ambientTemp: formData.ambientTemp,
    humidity: formData.humidity,
  },
  testData: formData.testData,
  notes: formData.notes,
  recommendations: formData.recommendations,
}
```

### Step 5: Store in Memory

Update `~/.claude/memory/report.json`:

```json
{
  "recentReports": [
    {
      "id": "demo-xxx",
      "reportNumber": "PR-202501-001",
      "type": "PROTECTION_RELAY",
      "project": "SEC Grid Expansion",
      "testResults": { "passed": 5, "failed": 0 },
      "generatedAt": "2025-01-11T12:00:00Z"
    }
  ],
  "stats": {
    "totalGenerated": 1
  }
}
```

### Step 6: Display Summary

Output formatted report summary:

```
✅ Report Generated Successfully

Report Number: PR-202501-001
Type: Protection Relay Test
Standard: IEC 60255

Project: SEC Grid Expansion
Substation: Al-Khobar Main SS
Voltage: 33kV

Equipment:
  Tag: 87T-TX1
  Type: Transformer Differential
  Manufacturer: ABB
  Model: REL670

Test Results:
  ✓ Overcurrent Pickup: 480.0A (Setting: 480.0A, Dev: 0.12%)
  ✓ Overcurrent Time: 0.52s (Setting: 0.50s, Dev: 4.00%)
  ✓ Earth Fault Pickup: 120.0A (Setting: 120.0A, Dev: 0.25%)
  ✓ Earth Fault Time: 0.31s (Setting: 0.30s, Dev: 3.33%)

  Total: 4 PASS, 0 FAIL

Stored in memory. Use '/report export pdf' to download.
```

### Step 7: Auto-Export (if requested)

If `--export` option provided:
- `pdf`: Generate PDF and save to Downloads
- `docx`: Generate DOCX and save to Downloads
- `both`: Generate both formats

## Examples

```bash
# Basic generation
/report-generate PROTECTION_RELAY

# With voltage level
/report-generate TRANSFORMER --voltage KV_13_8

# With project info
/report-generate SWITCHGEAR --project "SEC Grid Expansion" --substation "Dammam SS"

# With manufacturer
/report-generate CABLE --manufacturer "Nexans"

# With auto-export
/report-generate GROUNDING --export pdf
```

## Error Handling

| Error | Message |
|-------|---------|
| Missing type | `Error: Report type required. Valid types: PROTECTION_RELAY, TRANSFORMER, SWITCHGEAR, CABLE, GROUNDING` |
| Invalid type | `Error: Invalid type '{type}'. Valid types: ...` |
| Invalid voltage | `Error: Invalid voltage '{v}'. Valid: KV_33, KV_13_8, KV_11, KV_6_6, KV_0_4` |
