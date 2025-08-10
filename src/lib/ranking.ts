import type { Sidekick, Role, Tag } from "../types/sidekick";

export type FilterInput = {
  roles?: Role[];     // gewuenschte hauptrollen
  tags?: Tag[];       // feinkoernige faehigkeiten
};

const ROLE_WEIGHT = 10; // starke steuerung ueber rollengewicht
const TAG_WEIGHT = 1;   // feintuning ueber tags

export function computeScore(s: Sidekick, filter: FilterInput): number {
  let score = 0;
  if (filter.roles && filter.roles.length) {
    for (const r of filter.roles) {
      const val = s.role_strength?.[r] ?? 0;
      // 0..3 -> 0..30 punkte
      score += val * ROLE_WEIGHT;
    }
  }
  if (filter.tags && filter.tags.length) {
    for (const t of filter.tags) {
      if (s.tags.includes(t)) score += TAG_WEIGHT;
      // Bonus wenn Spell-Effekt exakt passt
      if (s.spells.some(sp => sp.effects.includes(t))) score += TAG_WEIGHT;
    }
  }
  // kleiner Bonus fuer Ueberschneidung von Rollen und Tags gleichzeitig
  if (score > 0 && filter.roles?.length && filter.tags?.length) {
    score += Math.min(5, Math.floor(score * 0.05));
  }
  return score;
}

export function rankSidekicks(list: Sidekick[], filter: FilterInput): Sidekick[] {
  if ((!filter.roles || filter.roles.length === 0) && (!filter.tags || filter.tags.length === 0)) {
    return [...list]; // keine filter -> natürliche reihenfolge
  }
  return [...list].sort((a, b) => computeScore(b, filter) - computeScore(a, filter));
}
