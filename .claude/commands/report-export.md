# Report Export Command

Export reports to PDF or DOCX format.

## Usage
```
/report-export <format> [options]
```

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `format` | Yes | Export format: `pdf`, `docx`, or `both` |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--id` | latest | Report ID to export |
| `--all` | false | Export all reports in memory |
| `--output` | `~/Downloads/` | Output directory |

## Execution

### Step 1: Parse Arguments
```
$ARGUMENTS = user input
```

Extract:
- `format`: First positional argument (required)
- `--id`: Specific report ID
- `--all`: Export all flag
- `--output`: Output directory path

### Step 2: Load Report(s)

Read from `~/.claude/memory/report.json`:

```json
{
  "recentReports": [
    {
      "id": "demo-xxx",
      "reportNumber": "PR-202501-001",
      "data": { ... }
    }
  ]
}
```

If `--id` specified, find that report.
If `--all` specified, export all reports.
Otherwise, use most recent report.

### Step 3: Generate Export Files

For PDF format:
```typescript
import { pdf } from "@react-pdf/renderer"
import { ReportPDF } from "@/components/root/block/report/pdf-template"

const blob = await pdf(<ReportPDF report={report} />).toBlob()
```

For DOCX format:
```typescript
import { generateReportDocx } from "@/components/root/block/report/docx-generator"

const blob = await generateReportDocx(report)
```

### Step 4: Save Files

Save to output directory with naming convention:
- PDF: `{reportNumber}.pdf`
- DOCX: `{reportNumber}.docx`

Example: `PR-202501-001.pdf`

### Step 5: Update Memory

Update export history in `~/.claude/memory/report.json`:

```json
{
  "recentReports": [
    {
      "id": "demo-xxx",
      "exported": {
        "pdf": true,
        "docx": false,
        "lastExportedAt": "2025-01-11T12:00:00Z"
      }
    }
  ]
}
```

### Step 6: Display Result

```
✅ Export Complete

Format: PDF
Report: PR-202501-001 (Protection Relay Test)
Output: ~/Downloads/PR-202501-001.pdf

File size: 245 KB
Pages: 3
```

For batch export:
```
✅ Batch Export Complete

Format: Both (PDF + DOCX)
Reports: 5
Output: ~/Downloads/reports/

Files created:
  - PR-202501-001.pdf (245 KB)
  - PR-202501-001.docx (180 KB)
  - TR-202501-002.pdf (310 KB)
  - TR-202501-002.docx (220 KB)
  ...

Total: 10 files, 2.1 MB
```

## Examples

```bash
# Export latest report to PDF
/report-export pdf

# Export to DOCX
/report-export docx

# Export both formats
/report-export both

# Export specific report
/report-export pdf --id demo-1704988800000

# Export all reports
/report-export pdf --all

# Custom output directory
/report-export pdf --output ~/Documents/Reports/

# Batch export all as both formats
/report-export both --all --output ~/Desktop/TC-Reports/
```

## Output Formats

### PDF Features
- Professional header with logo placeholder
- Clean tables with light borders
- Page numbers in footer
- IEC/IEEE standard formatting
- Print-ready A4 layout

### DOCX Features
- Editable Microsoft Word format
- Same layout as PDF
- Tables with light borders
- Compatible with Word 2016+
- Easy to add signatures

## Error Handling

| Error | Message |
|-------|---------|
| No format | `Error: Format required. Use: pdf, docx, or both` |
| Invalid format | `Error: Invalid format '{f}'. Use: pdf, docx, or both` |
| No reports | `Error: No reports in memory. Use '/report generate' first` |
| Report not found | `Error: Report '{id}' not found in memory` |
| Output dir not found | `Error: Output directory '{path}' does not exist` |
