"use client";
import { useMemo, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SIDEKICKS from "../../data/sidekicks";
import { rankSidekicks } from "../../lib/ranking";
import { arrayFromParam, toQuery } from "../../lib/url";
import FilterBar from "../../components/FilterBar";
import SidekickCard from "../../components/SidekickCard";
import type { Role, Tag } from "../../types/sidekick";

export default function FinderPage() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [roles, setRoles] = useState<Role[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // initial load from URL
  useEffect(() => {
    const r = arrayFromParam(search.get("roles")) as Role[];
    const t = arrayFromParam(search.get("tags")) as Tag[];
    setRoles(r);
    setTags(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL when filters change
  useEffect(() => {
    const q = toQuery({
      roles: roles.length ? roles : undefined,
      tags: tags.length ? tags : undefined,
    });
    router.replace(`${pathname}${q}`);
  }, [roles, tags, router, pathname]);

  const ranked = useMemo(() => rankSidekicks(SIDEKICKS, { roles, tags }), [roles, tags]);

  const onChange = useCallback((next: { roles: Role[]; tags: Tag[] }) => {
    setRoles(next.roles);
    setTags(next.tags);
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sidekick Finder</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Filtere nach Rollen & Tags. Ergebnisse aktualisieren sich live.
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold">{ranked.length}</span> Treffer
        </div>
      </header>

      <section className="rounded-2xl border p-4">
        <FilterBar roles={roles} tags={tags} onChange={onChange} />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ranked.map((s) => (
          <SidekickCard key={s.id} s={s} />
        ))}
      </section>
    </main>
  );
}
