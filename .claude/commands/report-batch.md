# Report Batch Command

Generate all 5 report types for a project with consistent information.

## Usage
```
/report-batch <project-name> [options]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `project-name` | Yes | Project name (in quotes if contains spaces) |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--voltage` | `KV_33` | Voltage level for all reports |
| `--substation` | random | Substation name |
| `--export` | none | Export format: pdf, docx, both |
| `--output` | `~/Downloads/{project}/` | Output directory |
| `--types` | all | Comma-separated types to generate |

## Execution

### Step 1: Parse Arguments
```
$ARGUMENTS = user input
```

Extract:
- `project-name`: Quoted or first argument
- `--voltage`: Voltage level
- `--substation`: Substation name
- `--export`: Export format
- `--output`: Output directory
- `--types`: Types to generate (default: all 5)

### Step 2: Generate Shared Context

Create consistent project information:
```typescript
const sharedContext = {
  projectName: projectName,
  projectNumber: `PRJ-${new Date().getFullYear()}-${randomNumber(1000, 9999)}`,
  substationName: substation || generateRandomSubstation(),
  voltageLevel: voltage,
  location: generateRandomLocation(),
  testDate: new Date(),
  testedBy: generateRandomEngineer(),
  reviewedBy: generateRandomEngineer(),
}
```

### Step 3: Generate Reports

For each report type:
```typescript
const reportTypes = types || [
  'PROTECTION_RELAY',
  'TRANSFORMER',
  'SWITCHGEAR',
  'CABLE',
  'GROUNDING'
]

const reports = []
for (const type of reportTypes) {
  const formData = generateRandomReportFormData(type, {
    ...sharedContext,
    // Type-specific equipment
  })
  reports.push(createReport(formData))
}
```

### Step 4: Store Batch in Memory

Save batch to `~/.claude/memory/report.json`:
```json
{
  "batches": [{
    "id": "batch-xxx",
    "project": "SEC Grid Expansion",
    "voltage": "KV_33",
    "substation": "Al-Khobar Main SS",
    "reports": [
      { "id": "demo-1", "type": "PROTECTION_RELAY", "reportNumber": "PR-202501-001" },
      { "id": "demo-2", "type": "TRANSFORMER", "reportNumber": "TR-202501-001" },
      { "id": "demo-3", "type": "SWITCHGEAR", "reportNumber": "SW-202501-001" },
      { "id": "demo-4", "type": "CABLE", "reportNumber": "CB-202501-001" },
      { "id": "demo-5", "type": "GROUNDING", "reportNumber": "GR-202501-001" }
    ],
    "createdAt": "2025-01-11T12:00:00Z"
  }],
  "stats": {
    "totalGenerated": 5,
    "batchCount": 1
  }
}
```

### Step 5: Export (if requested)

If `--export` specified:
```typescript
const outputDir = output || `~/Downloads/${sanitize(projectName)}/`

for (const report of reports) {
  if (format === 'pdf' || format === 'both') {
    await exportPDF(report, `${outputDir}/${report.reportNumber}.pdf`)
  }
  if (format === 'docx' || format === 'both') {
    await exportDOCX(report, `${outputDir}/${report.reportNumber}.docx`)
  }
}
```

### Step 6: Display Summary

```
✅ Batch Generation Complete

Project: SEC Grid Expansion
Substation: Al-Khobar Main SS
Voltage: 33kV

Reports Generated (5):

| # | Type | Report Number | Tests | Result |
|---|------|---------------|-------|--------|
| 1 | Protection Relay | PR-202501-001 | 5 | ✓ PASS |
| 2 | Transformer | TR-202501-001 | 6 | ✓ PASS |
| 3 | Switchgear | SW-202501-001 | 4 | ✓ PASS |
| 4 | Cable | CB-202501-001 | 3 | ✓ PASS |
| 5 | Grounding | GR-202501-001 | 4 | ✓ PASS |

Total Tests: 22 PASS, 0 FAIL

Exported to: ~/Downloads/SEC-Grid-Expansion/
  - PR-202501-001.pdf
  - PR-202501-001.docx
  - TR-202501-001.pdf
  - TR-202501-001.docx
  ... (10 files total)
```

## Examples

```bash
# Basic batch - all 5 types
/report-batch "SEC Grid Expansion"

# With voltage level
/report-batch "Dammam Industrial" --voltage KV_13_8

# With substation
/report-batch "ARAMCO Plant 5" --substation "Tank Farm SS"

# With export
/report-batch "SEC Riyadh" --export both

# Custom output directory
/report-batch "SABIC Jubail" --export pdf --output ~/Documents/Reports/

# Only specific types
/report-batch "Quick Test" --types PROTECTION_RELAY,SWITCHGEAR

# Full options
/report-batch "SEC Eastern Region" \
  --voltage KV_33 \
  --substation "Al-Ahsa Main SS" \
  --export both \
  --output ~/Projects/SEC-ER/
```

## Report Naming Convention

All reports in a batch follow consistent naming:
```
{TYPE_PREFIX}-{YYYYMM}-{SEQ}

Examples:
PR-202501-001  (Protection Relay)
TR-202501-001  (Transformer)
SW-202501-001  (Switchgear)
CB-202501-001  (Cable)
GR-202501-001  (Grounding)
```

## Batch Folder Structure

When exported, creates:
```
{output}/
├── PR-202501-001.pdf
├── PR-202501-001.docx
├── TR-202501-001.pdf
├── TR-202501-001.docx
├── SW-202501-001.pdf
├── SW-202501-001.docx
├── CB-202501-001.pdf
├── CB-202501-001.docx
├── GR-202501-001.pdf
├── GR-202501-001.docx
└── _summary.json  (batch metadata)
```

## Error Handling

| Error | Message |
|-------|---------|
| No project name | `Error: Project name required` |
| Invalid voltage | `Error: Invalid voltage '{v}'` |
| Invalid type | `Error: Invalid type '{t}' in --types` |
| Output dir error | `Error: Could not create output directory` |
| Export failed | `Error: Export failed for {reportNumber}: {reason}` |
