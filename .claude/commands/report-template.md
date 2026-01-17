# Report Template Command

Load pre-configured equipment templates with manufacturer defaults.

## Usage
```
/report-template <template-id>
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `template-id` | Yes | Template identifier (Manufacturer:Model) |

## Template Format
```
{Manufacturer}:{Model}
```

Examples:
- `ABB:REF615`
- `Siemens:7SJ85`
- `SEL:SEL-751`

## Available Templates

### Protection Relay Templates

| Template ID | Equipment | Type | CT Ratio | Settings |
|-------------|-----------|------|----------|----------|
| `ABB:REF615` | REF615 | Feeder Protection | 600/5 | OC, EF, AR |
| `ABB:REL670` | REL670 | Distance Protection | 1200/1 | Z1, Z2, Z3 |
| `ABB:RET670` | RET670 | Transformer Diff | 2000/1 | 87T, REF |
| `Siemens:7SJ85` | SIPROTEC 7SJ85 | Overcurrent | 800/5 | OC, EF, AR |
| `Siemens:7SA87` | SIPROTEC 7SA87 | Distance | 1000/1 | Z1-Z5 |
| `GE:F650` | Multilin F650 | Feeder | 600/5 | OC, UV, OF |
| `SEL:SEL-751` | SEL-751 | Feeder | 600/5 | OC, EF |
| `SEL:SEL-421` | SEL-421 | Distance | 1200/1 | Z1, Z2, PG |
| `Schneider:MiCOM P143` | MiCOM P143 | Feeder | 800/5 | OC, EF, BF |

### Switchgear Templates

| Template ID | Equipment | Type | Rating |
|-------------|-----------|------|--------|
| `ABB:VD4` | VD4 | Vacuum CB | 630A-2500A |
| `ABB:HD4` | HD4 | SF6 CB | 630A-4000A |
| `Siemens:3AH5` | 3AH5 | SF6 CB | 1250A-2500A |
| `Siemens:3AE` | 3AE | Dead Tank CB | 3150A |
| `Schneider:Evolis` | Evolis | Vacuum CB | 630A-2500A |

### Transformer Templates

| Template ID | Equipment | Rating | Vector |
|-------------|-----------|--------|--------|
| `ABB:40MVA` | Power TX | 40 MVA | Dyn11 |
| `ABB:20MVA` | Power TX | 20 MVA | Dyn11 |
| `Siemens:63MVA` | Power TX | 63 MVA | YNd11 |
| `Hyundai:31.5MVA` | Power TX | 31.5 MVA | Dyn11 |

### Cable Templates

| Template ID | Type | Size | Voltage |
|-------------|------|------|---------|
| `Nexans:XLPE400` | XLPE | 400mm² | 33kV |
| `Nexans:XLPE240` | XLPE | 240mm² | 13.8kV |
| `Prysmian:XLPE300` | XLPE | 300mm² | 33kV |
| `SaudiCable:XLPE185` | XLPE | 185mm² | 13.8kV |

### Grounding Templates

| Template ID | Type | Material |
|-------------|------|----------|
| `Standard:GridMesh` | Grid Mesh | Copper |
| `Standard:RodArray` | Rod Array | Copper-clad |
| `Standard:PlateEarth` | Plate | Copper |

## Execution

### Step 1: Parse Template ID
```
$ARGUMENTS = user input
```

Parse `Manufacturer:Model` format.

### Step 2: Load Template

Lookup in template database:
```typescript
const templates = {
  "ABB:REF615": {
    reportType: "PROTECTION_RELAY",
    equipment: {
      manufacturer: "ABB",
      model: "REF615",
      equipmentType: "Feeder Protection Relay",
    },
    defaults: {
      ctRatio: "600/5",
      ptRatio: "33000/110",
      functions: ["50/51", "50N/51N", "79"],
      settings: {
        overcurrentPickup: 480,
        overcurrentTMS: 0.1,
        earthFaultPickup: 120,
        earthFaultTMS: 0.1,
      }
    }
  },
  // ... more templates
}
```

### Step 3: Generate Report

Create report with template defaults:
```typescript
const formData = generateRandomReportFormData(template.reportType, {
  ...template.defaults,
  equipment: template.equipment,
})
```

### Step 4: Store in Memory

Save with template reference:
```json
{
  "recentReports": [{
    "id": "template-xxx",
    "template": "ABB:REF615",
    "reportNumber": "PR-202501-001",
    ...
  }],
  "templates": {
    "lastUsed": ["ABB:REF615"]
  }
}
```

### Step 5: Display Result

```
✅ Template Loaded: ABB:REF615

Equipment: ABB REF615 Feeder Protection Relay
Type: Protection Relay
Standard: IEC 60255

Default Settings Applied:
  CT Ratio: 600/5
  PT Ratio: 33000/110V
  Functions: 50/51, 50N/51N, 79

  Overcurrent Pickup: 480A
  Overcurrent TMS: 0.1
  Earth Fault Pickup: 120A
  Earth Fault TMS: 0.1

Report generated: PR-202501-001

Use '/report export pdf' to download, or
'/report fill "custom settings"' to modify.
```

## Special Commands

### List Templates
```bash
/report-template list
```

Shows all available templates by category.

### Search Templates
```bash
/report-template search ABB
```

Searches templates by manufacturer or model.

### Template Info
```bash
/report-template info ABB:REF615
```

Shows detailed template information without generating.

## Examples

```bash
# Load relay template
/report-template ABB:REF615

# Load switchgear template
/report-template Siemens:3AH5

# Load transformer template
/report-template ABB:40MVA

# List all templates
/report-template list

# Search by manufacturer
/report-template search Siemens

# Get template info
/report-template info SEL:SEL-751
```

## Custom Templates

Save frequently used configurations:
```bash
# Save current report as template
/report-template save MyRelay --from current

# Load custom template
/report-template custom:MyRelay
```

Custom templates stored in `~/.claude/memory/report.json`:
```json
{
  "customTemplates": {
    "MyRelay": {
      "reportType": "PROTECTION_RELAY",
      "equipment": { ... },
      "defaults": { ... }
    }
  }
}
```

## Error Handling

| Error | Message |
|-------|---------|
| No template ID | `Error: Template ID required. Use format: Manufacturer:Model` |
| Invalid format | `Error: Invalid format. Use: Manufacturer:Model (e.g., ABB:REF615)` |
| Not found | `Error: Template '{id}' not found. Use '/report-template list' to see available templates` |
