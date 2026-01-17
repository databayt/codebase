# Report Fill Command

Auto-fill report templates from various data sources.

## Usage
```
/report-fill <source> [options]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `source` | Yes | Data source (file path, URL, or natural language) |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--type` | auto-detect | Force report type |
| `--voltage` | auto-detect | Force voltage level |
| `--merge` | true | Merge with random values for missing fields |

## Source Types

### Excel/CSV Files
```bash
/report-fill ./equipment-list.xlsx
/report-fill ~/Documents/relay-settings.csv
```

Expected columns:
- `tag` or `equipment_tag`
- `type` or `equipment_type`
- `manufacturer`
- `model`
- `settings` (JSON or comma-separated)

### JSON Files
```bash
/report-fill ./report-data.json
```

Expected structure:
```json
{
  "reportType": "PROTECTION_RELAY",
  "equipment": { ... },
  "testData": { ... }
}
```

### API Endpoint
```bash
/report-fill https://api.example.com/equipment/123
```

Fetches JSON data from API endpoint.

### Natural Language
```bash
/report-fill "ABB REF615 relay, CT 600/5, pickup 480A, time dial 0.1"
```

Uses report agent to interpret and extract data.

## Execution

### Step 1: Parse Source
```
$ARGUMENTS = user input
```

Determine source type:
- Starts with `./` or `/` or `~` or `C:\` → File path
- Starts with `http://` or `https://` → API URL
- Contains quotes → Natural language
- Otherwise → Try as file path, fallback to NL

### Step 2: Extract Data

#### For Excel/CSV
```typescript
// Use xlsx or papaparse to read
const workbook = XLSX.readFile(filePath)
const data = XLSX.utils.sheet_to_json(workbook.Sheets[0])
```

Map columns to report structure:
| Column | Maps To |
|--------|---------|
| tag | equipment.equipmentTag |
| type | equipment.equipmentType |
| manufacturer | equipment.manufacturer |
| model | equipment.model |
| project | header.projectName |
| substation | header.substationName |
| voltage | header.voltageLevel |

#### For JSON
Parse and validate against report schema.

#### For API
```typescript
const response = await fetch(url)
const data = await response.json()
```

#### For Natural Language
Invoke report agent to interpret:
```
Agent: report
Input: {source}
Task: Extract equipment and test data from this description
```

### Step 3: Detect Report Type

If not specified, detect from:
- Equipment type keywords (relay → PROTECTION_RELAY)
- Model number patterns (REL/REF → relay, TX → transformer)
- Explicit mentions (transformer, switchgear, cable, grounding)

### Step 4: Merge with Defaults

For missing fields, use random generators:
```typescript
import { generateRandomReportFormData } from "@/components/root/block/report/random-values"

const defaults = generateRandomReportFormData(detectedType)
const merged = { ...defaults, ...extractedData }
```

### Step 5: Validate Data

Validate against Zod schema:
```typescript
import { reportFormSchema } from "@/components/root/block/report/validation"

const result = reportFormSchema.safeParse(merged)
if (!result.success) {
  // Show validation errors
}
```

### Step 6: Store in Memory

Save to `~/.claude/memory/report.json`:
```json
{
  "recentReports": [{
    "id": "fill-xxx",
    "source": "./equipment-list.xlsx",
    "sourceType": "excel",
    "reportNumber": "PR-202501-001",
    ...
  }]
}
```

### Step 7: Display Summary

```
✅ Report Filled Successfully

Source: ./equipment-list.xlsx (Excel)
Detected Type: Protection Relay
Records Found: 1

Equipment:
  Tag: 87T-TX1
  Manufacturer: ABB
  Model: REF615

Merged Fields:
  ✓ Project Name (from source)
  ✓ Equipment Tag (from source)
  ✓ Manufacturer (from source)
  ○ Test Date (generated)
  ○ Tested By (generated)
  ○ Test Results (generated with settings from source)

Stored in memory. Use '/report export pdf' to download.
```

## Examples

```bash
# From Excel file
/report-fill ./equipment-list.xlsx

# From CSV
/report-fill ~/relay-data.csv

# From JSON
/report-fill ./transformer-test.json

# From API
/report-fill https://api.company.com/equipment/TX-001

# Natural language
/report-fill "ABB REF615 feeder relay, CT 600/5, overcurrent pickup 480A, time multiplier 0.1"

# With forced type
/report-fill ./data.csv --type TRANSFORMER

# From description with voltage
/report-fill "Siemens 3AH5 SF6 breaker for 33kV feeder" --voltage KV_33
```

## Supported File Formats

| Format | Extension | Library |
|--------|-----------|---------|
| Excel | .xlsx, .xls | xlsx |
| CSV | .csv | papaparse |
| JSON | .json | native |

## Natural Language Examples

The report agent can interpret:

```
"ABB REL670 distance relay, zone 1 reach 80%, zone 2 reach 120%"
→ PROTECTION_RELAY with distance protection settings

"40MVA 33/13.8kV transformer, Dyn11 vector group"
→ TRANSFORMER with rating and vector group

"VD4 vacuum breaker, rated 630A, 33kV"
→ SWITCHGEAR with CB rating

"3x1c 400mm² XLPE cable, 500m length"
→ CABLE with conductor and length info

"Earth grid resistance target < 0.5Ω"
→ GROUNDING with resistance target
```

## Error Handling

| Error | Message |
|-------|---------|
| File not found | `Error: File '{path}' not found` |
| Invalid format | `Error: Unsupported file format '{ext}'` |
| Parse error | `Error: Could not parse file: {details}` |
| API error | `Error: API request failed: {status}` |
| Validation error | `Error: Invalid data: {fields}` |
| No data | `Error: No equipment data found in source` |
