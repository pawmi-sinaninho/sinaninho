# PR1 – Datenmodell, Validation, Ranking

## Schritte
1. Kopiere die Ordner/Dateien in dein Repo (Projektroot).
2. Installiere Dependencies:
   ```bash
   npm i zod
   npm i -D tsx vitest
   ```
3. Fuege in `package.json` folgende Scripts hinzu (falls noch nicht vorhanden):
   ```json
   {
     "scripts": {
       "validate:data": "tsx scripts/validate-data.ts",
       "test": "vitest run",
       "test:watch": "vitest"
     }
   }
   ```
4. Tests & Validation laufen lassen:
   ```bash
   npm run validate:data
   npm run test
   ```

Wenn alles gruenz, kannst du committen und einen PR erstellen.
