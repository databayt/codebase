import { ScraperContent } from "@/components/scraper/content";

export const runtime = "nodejs";

export const metadata = {
  title: "Scraper",
}

export default function Scraper() {
  return <ScraperContent />;
}