# Report Command

T&C (Testing & Commissioning) electrical report automation for 33kV/13.8kV substations.

## Usage
```
/report <subcommand> [options]
```

## Subcommands

| Command | Description |
|---------|-------------|
| `generate <type>` | Generate random report with IEC/IEEE compliant values |
| `fill <source>` | Auto-fill from Excel/CSV/JSON/natural language |
| `export <format>` | Export to PDF or DOCX |
| `batch <project>` | Generate all 5 types for a project |
| `template <equip>` | Load manufacturer equipment template |
| `list` | Show reports in memory |

## Quick Examples

```bash
# Generate protection relay report
/report generate PROTECTION_RELAY

# Generate with options
/report generate TRANSFORMER --voltage KV_33 --manufacturer ABB

# Export last report to PDF
/report export pdf

# Batch generate for project
/report batch "SEC Grid Expansion" --voltage KV_33 --export both

# Auto-fill from Excel
/report fill ./equipment-list.xlsx

# Load equipment template
/report template ABB:REF615
```

## Report Types

| Type | Code | Prefix | Standard |
|------|------|--------|----------|
| Protection Relay | `PROTECTION_RELAY` | PR | IEC 60255 |
| Transformer | `TRANSFORMER` | TR | IEC 60076 |
| Switchgear | `SWITCHGEAR` | SW | IEC 62271 |
| Cable | `CABLE` | CB | IEC 60502 |
| Grounding | `GROUNDING` | GR | IEEE 81 |

## Voltage Levels

| Code | Value |
|------|-------|
| `KV_33` | 33kV |
| `KV_13_8` | 13.8kV |
| `KV_11` | 11kV |
| `KV_6_6` | 6.6kV |
| `KV_0_4` | 0.4kV (LV) |

## Execution

When `/report` is invoked:

### Step 1: Parse Arguments
```
$ARGUMENTS = user input after /report
```

Parse subcommand and options:
- Extract first word as subcommand
- Parse remaining as positional args and flags

### Step 2: Route to Subcommand

| Subcommand | Action |
|------------|--------|
| `generate` | Invoke `/report-generate` with args |
| `fill` | Invoke `/report-fill` with args |
| `export` | Invoke `/report-export` with args |
| `batch` | Invoke `/report-batch` with args |
| `template` | Invoke `/report-template` with args |
| `list` | Read and display `~/.claude/memory/report.json` |
| (none) | Show help message |

### Step 3: Display Help (if no subcommand)

```
T&C Report Automation

Usage: /report <command> [options]

Commands:
  generate <type>     Generate random report
  fill <source>       Auto-fill from data source
  export <format>     Export to PDF/DOCX
  batch <project>     Batch generate all types
  template <equip>    Load equipment template
  list               Show reports in memory

Examples:
  /report generate PROTECTION_RELAY
  /report fill ./data.xlsx
  /report export pdf --all
  /report batch "SEC Project" --voltage KV_33

Run '/report <command> --help' for command-specific help.
```

## Memory Integration

All operations update `~/.claude/memory/report.json`:
- Track generated reports
- Store export history
- Remember preferences
- Count statistics

## Integration with Report Block

This command integrates with the report block at:
- `src/components/root/block/report/`

Uses existing functions:
- `generateRandomReportFormData()` - random generation
- `generateTestData()` - type-specific test data
- `ReportPDF` - PDF component
- `generateReportDocx()` - DOCX generation

## Agent Integration

For complex operations (natural language fill, interpretation):
- Uses `report` agent for NL processing
- Agent handles equipment spec interpretation
- Agent validates IEC/IEEE compliance
