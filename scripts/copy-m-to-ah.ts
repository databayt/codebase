/**
 * Fill CT Secondary Injection AH Template
 *
 * Uses CT SECONDARY INJ AH01.docx template and fills with scaled values
 * Injection currents: R=0.25A, Y=0.50A, B=0.75A
 * Terminal mapping: X1B→X11, X1A→X12, X1D→X13
 * Saves as M01-2.docx through M14-2.docx
 */

import * as fs from "fs";
import * as path from "path";
import AdmZip from "adm-zip";

const baseDir = "/Users/abdout/abdout/yabreen";

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

// Random value generators with injection current scaling
function randomSecondary(injectionCurrent: number): string {
  // SEC = injectionCurrent * (1 ± 2%)
  const variance = 0.02;
  const base = injectionCurrent * (1 + (Math.random() * variance * 2 - variance));
  return base.toFixed(3);
}

function randomPrimary(nominal: number, injectionCurrent: number): string {
  // PRI = nominal * injectionCurrent * (1 ± 0.5%)
  const variance = 0.005;
  const base = nominal * injectionCurrent * (1 + (Math.random() * variance * 2 - variance));
  return base.toFixed(1);
}

// Detect injection current from row content
function getInjectionCurrent(rowContent: string): number | null {
  if (rowContent.includes("R-") && rowContent.includes("0.25")) return 0.25;
  if (rowContent.includes("Y-") && rowContent.includes("0.50")) return 0.50;
  if (rowContent.includes("B-") && rowContent.includes("0.75")) return 0.75;
  return null;
}

// Fill template row by row
function fillTemplate(templatePath: string, ct: number, outputPath: string): void {
  const zip = new AdmZip(templatePath);
  const docEntry = zip.getEntry("word/document.xml");
  if (!docEntry) {
    console.error("Could not find word/document.xml in template");
    return;
  }

  let docXml = docEntry.getData().toString("utf8");

  // Terminal name mapping
  docXml = docXml.replace(/X1B/g, "X11");
  docXml = docXml.replace(/X1A/g, "X12");
  docXml = docXml.replace(/X1D/g, "X13");
  docXml = docXml.replace(/X120/g, "X87");

  // Update CT ratio
  docXml = docXml.replace(/400\s*-?\s*600\s*\/\s*1/g, `${ct}/1`);
  docXml = docXml.replace(/2000\/1/g, `${ct}/1`);

  // Process row by row
  docXml = docXml.replace(
    /(<w:tr\b[^>]*>)([\s\S]*?)(<\/w:tr>)/g,
    (rowMatch, rowOpen, rowContent, rowClose) => {
      // Detect which injection current row this is
      const injCurrent = getInjectionCurrent(rowContent);

      if (injCurrent === null) {
        // Not a data row, return unchanged
        return rowMatch;
      }

      // This is a data row (R, Y, or B) - fill empty cells
      let cellIndex = 0;
      const newRowContent = rowContent.replace(
        /(<w:tc\b[^>]*>)([\s\S]*?)(<\/w:tc>)/g,
        (cellMatch, cellOpen, cellContent, cellClose) => {
          // Extract text from cell
          const textMatches = cellContent.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
          const texts = textMatches
            ? textMatches.map((t: string) => {
                const m = t.match(/<w:t[^>]*>([^<]*)<\/w:t>/);
                return m ? m[1] : '';
              })
            : [];
          const cellText = texts.join('').trim();

          // Skip first cell (it has "R- 0.25 A" etc) and cells with content
          if (cellIndex === 0 || (cellText && cellText !== '' && cellText !== '-')) {
            cellIndex++;
            return cellMatch;
          }

          cellIndex++;

          // Generate value - all SEC for this template (scaled by injection current)
          const value = randomSecondary(injCurrent);

          if (cellContent.includes('<w:p')) {
            const newCellContent = cellContent.replace(
              /(<w:p\b[^>]*>)([\s\S]*?)(<\/w:p>)/,
              (pMatch: string, pOpen: string, pContent: string, pClose: string) => {
                if (pContent.includes('<w:r')) {
                  return pMatch.replace(
                    /(<w:r\b[^>]*>)([\s\S]*?)(<\/w:r>)/,
                    (rMatch: string, rOpen: string, rContent: string, rClose: string) => {
                      if (rContent.includes('<w:t')) {
                        return rMatch.replace(
                          /<w:t[^>]*>([^<]*)<\/w:t>/,
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
            return `${cellOpen}${newCellContent}${cellClose}`;
          }
          return cellMatch;
        }
      );

      return `${rowOpen}${newRowContent}${rowClose}`;
    }
  );

  zip.updateFile("word/document.xml", Buffer.from(docXml, "utf8"));
  zip.writeZip(outputPath);
}

async function main() {
  const ahTemplatePath = path.join(baseDir, "CT SECONDARY INJ AH01.docx");

  console.log("Generating CT Secondary Injection Reports (AH Template)...\n");
  console.log("Terminal mapping: X1B→X11, X1A→X12, X1D→X13, X120→X87");
  console.log("Injection currents: R=0.25A, Y=0.50A, B=0.75A\n");

  if (!fs.existsSync(ahTemplatePath)) {
    console.error(`Template not found: ${ahTemplatePath}`);
    return;
  }

  for (const panel of PANELS) {
    const outputFile = path.join(baseDir, `${panel.id}-2.docx`);

    // Fill template with row-aware values
    fillTemplate(ahTemplatePath, panel.ct, outputFile);
    console.log(`Created: ${panel.id}-2.docx (CT ${panel.ct}/1)`);
  }

  console.log("\nDone! Generated 14 reports.");
}

main().catch(console.error);
