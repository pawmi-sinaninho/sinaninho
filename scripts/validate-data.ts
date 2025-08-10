#!/usr/bin/env tsx
/**
 * Validiert die Sidekick-Daten gegen das Schema.
 * Nutzung: npm run validate:data
 */
import { validateSidekicks } from "../src/lib/validation";
import SIDEKICKS from "../src/data/sidekicks";

function main() {
  try {
    const parsed = validateSidekicks(SIDEKICKS);
    // einfache inhaltschecks
    if (parsed.length < 1) throw new Error("Keine Sidekicks gefunden");
    const withBadIds = parsed.filter(s => !/^[a-z0-9-]+$/.test(s.id));
    if (withBadIds.length) {
      throw new Error("Ungueltige IDs: " + withBadIds.map(s => s.id).join(", "));
    }
    console.log(`✅ Validation OK: ${parsed.length} sidekicks`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Validation failed:\n");
    if (err instanceof Error) console.error(err.message);
    else console.error(err);
    process.exit(1);
  }
}

main();
