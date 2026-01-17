/**
 * Fill CT Secondary Injection Template
 *
 * Uses the existing template.docx and fills SEC/PRI columns with random values
 * Generates 14 copies for panels M01-M14
 */

import * as fs from "fs";
import * as path from "path";
import AdmZip from "adm-zip";

// Panel configuration
interface PanelConfig {
  id: string;
  ct: 600 | 1200 | 2000;
}

const PANELS: PanelConfig[] = [
  { id: "M01", ct: 600 },
  { id: "M02", ct: 600 },
  { id: "M03", ct: 600 },
  { id: "M04", ct: 600 },
  { id: "M05", ct: 600 },
  { id: "M06", ct: 600 },
  { id: "M07", ct: 600 },
  { id: "M08", ct: 600 },
  { id: "M09", ct: 1200 },
  { id: "M10", ct: 1200 },
  { id: "M11", ct: 1200 },
  { id: "M12", ct: 1200 },
  { id: "M13", ct: 2000 },
  { id: "M14", ct: 2000 },
];

// Random value generators
function randomSecondary(): string {
  // SEC = ~1A (secondary current from CT)
  const variance = 0.02; // ±2%
  return (1 + (Math.random() * variance * 2 - variance)).toFixed(3);
}

function randomPrimary(nominal: number): string {
  // PRI = 600, 1200, or 2000 based on CT ratio
  const variance = nominal * 0.005; // ±0.5%
  return (nominal + (Math.random() * variance * 2 - variance)).toFixed(1);
}

// Generate random values for all empty SEC/PRI cells
function generateValues(ct: number): string[] {
  const values: string[] = [];

  // Template structure per CORE section:
  // Header row: X11, SEC, TS1, SEC, TS2, SEC, REF, PRI, P142, PRI (10 cols)
  // Then 4 data rows with empty cells in SEC/PRI columns
  //
  // Column pattern (0-indexed):
  // Col 1, 3, 5 = SEC columns (values ~1)
  // Col 7, 9 = PRI columns (values ~600/1200/2000)
  //
  // Empty cells per section: 4 rows x 5 value columns = 20 cells
  // But filled column by column:
  // - 4 cells for SEC col 1
  // - 4 cells for SEC col 3
  // - 4 cells for SEC col 5
  // - 4 cells for PRI col 7
  // - 4 cells for PRI col 9

  // CORE 1: SEC, SEC, SEC, PRI, PRI (5 columns x 4 rows = 20 values)
  // CORE 2: SEC, SEC, PRI, PRI, PRI (5 columns x 4 rows = 20 values)
  // CORE 3: SEC, SEC, PRI, PRI (4 columns x 4 rows = 16 values)

  // The empty cells appear in row order, so for each row we get:
  // SEC, SEC, SEC, PRI, PRI (for CORE 1)

  // CORE 1: 4 rows, each row has: SEC, SEC, SEC, PRI, PRI
  for (let row = 0; row < 4; row++) {
    values.push(randomSecondary());  // SEC
    values.push(randomSecondary());  // SEC
    values.push(randomSecondary());  // SEC
    values.push(randomPrimary(ct));  // PRI
    values.push(randomPrimary(ct));  // PRI
  }

  // CORE 2: 4 rows, each row has: SEC, SEC, PRI, PRI, PRI
  for (let row = 0; row < 4; row++) {
    values.push(randomSecondary());  // SEC
    values.push(randomSecondary());  // SEC
    values.push(randomPrimary(ct));  // PRI
    values.push(randomPrimary(ct));  // PRI
    values.push(randomPrimary(ct));  // PRI
  }

  // CORE 3: 4 rows, each row has: SEC, SEC, PRI, PRI
  for (let row = 0; row < 4; row++) {
    values.push(randomSecondary());  // SEC
    values.push(randomSecondary());  // SEC
    values.push(randomPrimary(ct));  // PRI
    values.push(randomPrimary(ct));  // PRI
  }

  return values;
}

// Fill empty cells in document.xml
function fillTemplate(docXml: string, values: string[]): string {
  let valueIndex = 0;

  // Find empty table cells and fill them
  // Pattern: <w:tc>...<w:p>...<w:r>...<w:t></w:t>...</w:r>...</w:p>...</w:tc>
  // Or cells with no <w:t> content

  const result = docXml.replace(
    /(<w:tc\b[^>]*>)([\s\S]*?)(<\/w:tc>)/g,
    (match, open, content, close) => {
      // Check if cell has text content
      const textMatch = content.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
      const hasText = textMatch && textMatch[1].trim();

      if (!hasText && valueIndex < values.length) {
        // This is an empty cell - fill it with a value
        const value = values[valueIndex++];

        // Find the <w:p> and add text run with value
        if (content.includes('<w:p')) {
          // Add text to existing paragraph
          const newContent = content.replace(
            /(<w:p\b[^>]*>)([\s\S]*?)(<\/w:p>)/,
            (pMatch, pOpen, pContent, pClose) => {
              // Check if there's already a <w:r> element
              if (pContent.includes('<w:r')) {
                return pMatch.replace(
                  /(<w:r\b[^>]*>)([\s\S]*?)(<\/w:r>)/,
                  (rMatch, rOpen, rContent, rClose) => {
                    if (rContent.includes('<w:t')) {
                      return rMatch.replace(
                        /<w:t[^>]*><\/w:t>/,
                        `<w:t>${value}</w:t>`
                      );
                    }
                    return `${rOpen}${rContent}<w:t>${value}</w:t>${rClose}`;
                  }
                );
              }
              return `${pOpen}${pContent}<w:r><w:t>${value}</w:t></w:r>${pClose}`;
            }
          );
          return `${open}${newContent}${close}`;
        }
      }
      return match;
    }
  );

  return result;
}

// Main function
async function main() {
  const templatePath = "/Users/abdout/codebase/template.docx";
  const outputDir = path.join(process.env.HOME!, "abdout/yabreen");

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Filling CT Secondary Injection Template...\n");
  console.log(`Template: ${templatePath}`);
  console.log(`Output: ${outputDir}\n`);

  for (const panel of PANELS) {
    // Read template as ZIP
    const zip = new AdmZip(templatePath);

    // Get document.xml
    const docEntry = zip.getEntry("word/document.xml");
    if (!docEntry) {
      console.error("Could not find word/document.xml in template");
      return;
    }

    let docXml = docEntry.getData().toString("utf8");

    // Generate random values for this panel
    const values = generateValues(panel.ct);

    // Fill the template
    docXml = fillTemplate(docXml, values);

    // Update CT ratio in document (replace 600/1 with actual ratio)
    docXml = docXml.replace(/CT RATIO \d+\/1/g, `CT RATIO ${panel.ct}/1`);

    // Update the ZIP with modified document.xml
    zip.updateFile("word/document.xml", Buffer.from(docXml, "utf8"));

    // Save to output
    const outputPath = path.join(outputDir, `${panel.id}.docx`);
    zip.writeZip(outputPath);

    console.log(`Created: ${panel.id}.docx (CT ${panel.ct}/1)`);
  }

  console.log(`\nDone! Generated ${PANELS.length} reports.`);
}

main().catch(console.error);
