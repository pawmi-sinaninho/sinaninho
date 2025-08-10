import { z } from "zod";
import { ELEMENTS, ROLES, TAGS } from "../types/sidekick";

const RoleEnum = z.enum(ROLES as [string, ...string[]]);
const TagEnum = z.enum(TAGS as [string, ...string[]]);
const ElementEnum = z.enum(ELEMENTS as [string, ...string[]]);

const SpellSchema = z.object({
  name: z.string().min(1),
  ap: z.number().int().min(0).max(12),
  range: z.string().min(1),
  cd: z.number().int().min(0).max(10),
  effects: z.array(TagEnum).min(1),
  notes: z.string().optional(),
});

// role_strength: keys aus ROLES, werte 0..3 (optional, default 0)
// Jede Rolle optional, Werte 0..3
const RoleStrengthSchema = z
  .object(
    Object.fromEntries(
      (ROLES as readonly string[]).map((r) => [r, z.number().int().min(0).max(3).optional()])
    ) as Record<string, z.ZodTypeAny>
  )
  .partial()
  .optional()
  .default({});

export const SidekickSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, "id muss ein slug sein (a-z, 0-9, -)"),
  name: z.string().min(1),
  overview: z.string().min(5),
  roles: z.array(RoleEnum).min(1),
  role_strength: RoleStrengthSchema,
  tags: z.array(TagEnum).min(1),
  elements: z.array(ElementEnum).min(1),
  level_range: z.tuple([z.number().int().min(1), z.number().int().max(200)]),
  mobility: z.object({
    teleport: z.boolean(),
    dash: z.boolean(),
    swap: z.boolean(),
  }),
  survivability: z.object({
    hp: z.enum(["low", "medium", "high"]),
    resist_synergy: z.boolean(),
  }),
  spells: z.array(SpellSchema).min(1),
  synergies: z.array(z.string()).optional(),
  anti_synergies: z.array(z.string()).optional(),
  sources: z.array(z.union([z.string().url(), z.string().regex(/^<add-[a-z-]+-url>$/)])).optional(),
  last_verified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const SidekickListSchema = z.array(SidekickSchema).superRefine((list, ctx) => {
  // Eindeutige IDs
  const ids = new Set<string>();
  for (const s of list) {
    if (ids.has(s.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate id: ${s.id}`,
      });
    }
    ids.add(s.id);
  }
});

export type SidekickParsed = z.infer<typeof SidekickSchema>;

export function validateSidekicks(data: unknown): SidekickParsed[] {
  const res = SidekickListSchema.safeParse(data);
  if (!res.success) {
    const formatted = res.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error("Sidekick data validation failed:\n" + formatted);
  }
  return res.data;
}

// Kleines Helper fuer defensive runtime checks
export function assertSidekicksShape(value: unknown): void {
  validateSidekicks(value);
}
