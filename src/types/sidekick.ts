// Strikt typisiertes Datenmodell fuer DOFUS Sidekicks
export const ROLES = [
  "healer",
  "shielder",
  "tank",
  "ap_removal",
  "mp_removal",
  "damager",
  "positioning",
  "placement",
  "debuff",
  "buff",
  "summons",
] as const;
export type Role = (typeof ROLES)[number];

export const TAGS = [
  // Healing / Shield
  "heal_single",
  "heal_aoe",
  "shield_single",
  "shield_aoe",
  // Control / Position
  "push",
  "pull",
  "swap",
  "map_control",
  "stabilize",
  // AP/MP
  "ap_minus",
  "mp_minus",
  // Damage
  "damage_single",
  "damage_aoe",
  "poison",
  // Buff/Debuff
  "range_boost",
  "erosion",
  "buff_power",
  "debuff_power",
  // Mobility
  "teleport",
  "dash",
  "lock",
  "unlock",
] as const;
export type Tag = (typeof TAGS)[number];

export const ELEMENTS = ["neutral", "earth", "fire", "water", "air"] as const;
export type Element = (typeof ELEMENTS)[number];

export type Mobility = {
  teleport: boolean;
  dash: boolean;
  swap: boolean;
};

export type Survivability = {
  hp: "low" | "medium" | "high";
  resist_synergy: boolean;
};

export type Spell = {
  name: string;
  ap: number;
  range: string; // z. B. "1-4 mod"
  cd: number; // cooldown in turns
  effects: Tag[];
  notes?: string;
};

export type RoleStrength = Partial<Record<Role, number>>; // 0..3 empfohlen

export type Sidekick = {
  id: string; // slug
  name: string;
  overview: string;
  roles: Role[];
  role_strength: RoleStrength;
  tags: Tag[];
  elements: Element[];
  level_range: [number, number];
  mobility: Mobility;
  survivability: Survivability;
  spells: Spell[];
  synergies?: string[];
  anti_synergies?: string[];
  sources?: string[];
  last_verified: string; // ISO date
};
