import { Sidekick } from "../types/sidekick";

// Erste 3 Beispiel-Sidekicks (Inhalte sind bewusst knapp gehalten; Details folgen in spaeteren PRs)
export const SIDEKICKS: Sidekick[] = [
  {
    id: "lumino",
    name: "Lumino",
    overview:
      "Klassischer Healer/Support-Sidekick mit Single- und situativem AoE-Heal. Bietet soliden Sustain fuer Teams ohne Eniripsa.",
    roles: ["healer", "buff"],
    role_strength: { healer: 3, buff: 1, shielder: 1, positioning: 1 },
    tags: ["heal_single", "heal_aoe", "range_boost"],
    elements: ["neutral"],
    level_range: [1, 200],
    mobility: { teleport: false, dash: false, swap: false },
    survivability: { hp: "medium", resist_synergy: true },
    spells: [
      { name: "Vital Spark", ap: 3, range: "1-4 mod", cd: 0, effects: ["heal_single"] },
      { name: "Area Mender", ap: 4, range: "2-5 mod", cd: 2, effects: ["heal_aoe"] },
    ],
    synergies: ["profitert von Tanks und Positionern"],
    anti_synergies: ["fokusierter Burst schaltet ihn schnell aus"],
    sources: ["<add-wiki-url>", "<add-patchnotes-url>"],
    last_verified: "2025-08-10",
  },
  {
    id: "krobax",
    name: "Krobax",
    overview:
      "Positioning/Map-Control-Sidekick. Kann ziehen, schieben und die Karte zu Gunsten des Teams ordnen.",
    roles: ["positioning", "placement", "debuff"],
    role_strength: { positioning: 3, placement: 2, debuff: 1 },
    tags: ["push", "pull", "swap", "map_control", "stabilize"],
    elements: ["air"],
    level_range: [1, 200],
    mobility: { teleport: false, dash: false, swap: true },
    survivability: { hp: "medium", resist_synergy: false },
    spells: [
      { name: "Gale Pull", ap: 3, range: "1-6 mod", cd: 0, effects: ["pull"] },
      { name: "Wind Push", ap: 3, range: "1-6 mod", cd: 0, effects: ["push"] },
      { name: "Swap Draft", ap: 4, range: "1-4 mod", cd: 2, effects: ["swap"] },
    ],
    synergies: ["kitet Nahkampf-Gegner, eroeffnet Linien fuer Fernkaempfer"],
    anti_synergies: ["stabile/bodenhafte Gegner"],
    sources: ["<add-wiki-url>"],
    last_verified: "2025-08-10",
  },
  {
    id: "shadow",
    name: "Shadow",
    overview:
      "Burst-Damager mit Single-Target-Fokus. Liefert konstanten Druck und profitiert von Platzierung durch andere.",
    roles: ["damager", "debuff"],
    role_strength: { damager: 3, debuff: 1, positioning: 1 },
    tags: ["damage_single", "damage_aoe", "erosion"],
    elements: ["neutral"],
    level_range: [1, 200],
    mobility: { teleport: false, dash: true, swap: false },
    survivability: { hp: "low", resist_synergy: false },
    spells: [
      { name: "Shadow Strike", ap: 3, range: "1-3 mod", cd: 0, effects: ["damage_single"] },
      { name: "Night Sweep", ap: 4, range: "2-4 mod", cd: 2, effects: ["damage_aoe", "erosion"] },
    ],
    synergies: ["arbeitet gut mit AP/MP-Entzug und Positioning zusammen"],
    anti_synergies: ["hohe Resistenzen, healschwere Teams"],
    sources: ["<add-wiki-url>"],
    last_verified: "2025-08-10",
  },
];

export default SIDEKICKS;
