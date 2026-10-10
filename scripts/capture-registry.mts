// Port of shadcn's apps/v4/scripts/capture-registry.mts: light/dark PNGs of
// every template for the /templates mobile view. Two fixes over upstream: the
// URL carries the style segment (/view/<style>/<name>; upstream drops it), and
// pages live under our [lang] segment. Needs the dev server on port 3000.
//
//   pnpm registry:capture            # missing screenshots only
//   pnpm registry:capture hero-05    # (re)capture the named templates
import { existsSync } from "fs"
import { createRequire } from "module"
import path from "path"
import puppeteer from "puppeteer"

const require = createRequire(import.meta.url)
const { registry } = require("../src/registry/bases/base/registry")

const STYLE = "base-vega"
const BASE_URL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000"
const OUT_DIR = path.join(process.cwd(), "public", "r", "styles", STYLE)

const shotPath = (block: string, theme: string) =>
  path.join(OUT_DIR, `${block}-${theme}.png`)

async function captureScreenshots() {
  const requested = process.argv.slice(2)
  const blockIds: string[] = registry.items
    .filter((item: { type: string }) => item.type === "registry:block")
    .map((item: { name: string }) => item.name)

  const blocks = requested.length
    ? blockIds.filter((block) => requested.includes(block))
    : blockIds.filter(
        (block) =>
          !existsSync(shotPath(block, "light")) ||
          !existsSync(shotPath(block, "dark"))
      )

  if (blocks.length === 0) {
    console.log("✨ All screenshots exist, nothing to capture")
    return
  }

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    defaultViewport: {
      width: 1440,
      height: 900,
      // 1x keeps every PNG under the repo's 2 MiB media guard.
      deviceScaleFactor: 1,
    },
  })

  for (const block of blocks) {
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}/en/view/${STYLE}/${block}`, {
      waitUntil: "networkidle2",
    })

    console.log(`- Capturing ${block}...`)

    for (const theme of ["light", "dark"]) {
      await page.evaluate((currentTheme) => {
        localStorage.setItem("theme", currentTheme)
      }, theme)

      await page.reload({ waitUntil: "networkidle2" })

      // Wait for entrance animations to settle.
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await page.evaluate(() => {
        document.querySelector("[data-tailwind-indicator]")?.remove()
        document.querySelector("nextjs-portal")?.remove()
      })

      await page.screenshot({ path: shotPath(block, theme) as `${string}.png` })
    }

    await page.close()
  }

  await browser.close()
}

try {
  console.log("🔍 Capturing screenshots...")
  await captureScreenshots()
  console.log("✅ Done!")
} catch (error) {
  console.error(error)
  process.exit(1)
}
