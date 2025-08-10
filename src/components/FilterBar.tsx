"use client";
import { useCallback, useMemo } from "react";
import { ROLES, TAGS, Role, Tag } from "../types/sidekick";

type Props = {
  roles: Role[];
  tags: Tag[];
  onChange(next: { roles: Role[]; tags: Tag[] }): void;
};

function ToggleChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition ${active ? "bg-blue-600 text-white border-blue-600" : "bg-white/5 border-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ roles, tags, onChange }: Props) {
  const roleSet = useMemo(() => new Set(roles), [roles]);
  const tagSet = useMemo(() => new Set(tags), [tags]);

  const toggleRole = useCallback(
    (r: Role) => {
      const next = new Set(roleSet);
      next.has(r) ? next.delete(r) : next.add(r);
      onChange({ roles: Array.from(next) as Role[], tags });
    },
    [roleSet, tags, onChange]
  );

  const toggleTag = useCallback(
    (t: Tag) => {
      const next = new Set(tagSet);
      next.has(t) ? next.delete(t) : next.add(t);
      onChange({ roles, tags: Array.from(next) as Tag[] });
    },
    [tagSet, roles, onChange]
  );

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-sm font-semibold mb-2">Rollen</h3>
        <div className="flex flex-wrap gap-2">
          {(ROLES as readonly string[]).map((r) => (
            <ToggleChip key={r} label={r} active={roleSet.has(r as Role)} onClick={() => toggleRole(r as Role)} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-sm font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {(TAGS as readonly string[]).map((t) => (
            <ToggleChip key={t} label={t} active={tagSet.has(t as Tag)} onClick={() => toggleTag(t as Tag)} />
          ))}
        </div>
      </section>
    </div>
  );
}
