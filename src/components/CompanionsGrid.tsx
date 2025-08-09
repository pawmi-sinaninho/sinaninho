// src/components/CompanionsGrid.tsx
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLang } from '@/contexts/LangContext';
import { useData } from '@/contexts/DataContext';
import type { Spell } from '@/contexts/DataContext';
import { COMP_ROLES, ROLE_LABEL, type Role } from '@/data/roles';
import SpellDetails from '@/components/SpellDetails';
import { withFallback } from '@/utils/img';

const roleGradient: Record<Role, string> = {
  healer: 'from-primary to-accent',
  tank: 'from-neutral-700 to-neutral-900',
  'ap-steal': 'from-yellow-400 to-orange-500',
  'mp-steal': 'from-green-400 to-emerald-600',
  shield: 'from-sky-500 to-indigo-600',
  push: 'from-rose-400 to-fuchsia-600',
  damage: 'from-orange-500 to-red-600',
  support: 'from-teal-400 to-cyan-600',
};

export default function CompanionsGrid() {
  const { lang } = useLang();
  const { loading, error, companions, spells, mapping } = useData();

  const [query, setQuery] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [openSpell, setOpenSpell] = useState<number | null>(null);

  const roles = Object.keys(ROLE_LABEL) as Role[];

  // Filter companions by search text and role
  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    return companions.filter((c) => {
      const name = (c.name?.[lang] ?? '').toLowerCase();
      const matchesText = !s || name.includes(s);
      const matchesRole =
        !role || (COMP_ROLES[c.id] ?? []).includes(role);
      return matchesText && matchesRole;
    });
  }, [companions, query, role, lang]);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-red-500">
        {lang === 'fr' ? 'Erreur' : 'Error'}: {error}
      </div>
    );
  }

  return (
    <>
      {/* Suche + Rollenfilter */}
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 rounded-xl border bg-white/90 p-3 outline-none focus:ring-2 focus:ring-primary/60 text-neutral-900"
          placeholder={lang === 'fr' ? 'Rechercher…' : 'Search…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-xl border bg-white/90 p-3 text-neutral-900"
          value={role ?? ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value as Role | '';
            setRole(val === '' ? null : val);
          }}
        >
          <option value="">
            {lang === 'fr' ? 'Tous les rôles' : 'All roles'}
          </option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r][lang]}
            </option>
          ))}
        </select>
      </div>

      {/* Grid mit Companions */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filtered.map((c) => {
          const idStr = String(c.id);
          // Spell IDs aus Mapping oder Compagnon-Objekt ermitteln
          const byStr = (mapping as Record<string, number[]>)[idStr];
          const byNum = (mapping as unknown as Record<number, number[]>)[c.id];
          const spellIds: number[] = byStr ?? byNum ?? c.spells ?? [];

          // Hauptrolle ermitteln (erste Rolle oder 'support')
          const mainRole: Role =
            (COMP_ROLES[c.id]?.[0] ?? 'support') as Role;

          return (
            <li
              key={c.id}
              className={`rounded-3xl p-4 shadow-xl bg-gradient-to-br ${roleGradient[mainRole]} text-white transition-transform hover:scale-[1.02]`}
            >
              {/* Kopfzeile mit Bild und Name */}
              <div className="flex items-center gap-4">
                <Image
                  src={withFallback(c.img, c.id)}
                  alt={c.name?.[lang] ?? 'Companion'}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full border-2 border-white/30 object-cover"
                  unoptimized
                />
                <div className="flex-1">
                  <div className="text-lg font-bold drop-shadow">
                    {c.name?.[lang] ?? '—'}
                  </div>
                  <div className="text-xs opacity-80">
                    {(COMP_ROLES[c.id] ?? [])
                      .map((r) => ROLE_LABEL[r][lang])
                      .join(' · ')}
                  </div>
                </div>
              </div>

              {/* Beschreibung */}
              {c.description?.[lang] && (
                <p className="mt-3 text-sm/6 bg-black/20 rounded-xl p-2">
                  {c.description[lang]}
                </p>
              )}

              {/* Zauber-Liste */}
              <div className="mt-3">
                <div className="font-semibold mb-1">
                  {lang === 'fr' ? 'Sorts' : 'Spells'}
                </div>
                <ul className="divide-y divide-white/20 rounded-lg border border-white/20 bg-black/10">
                  {spellIds.map((spId) => {
                    const s: Spell | undefined = spells[spId];
                    const label =
                      s?.[`name_${lang}` as 'name_fr' | 'name_en'] ??
                      s?.name_en ??
                      `#${spId}`;
                    return (
                      <li
                        key={spId}
                        className="p-2 text-sm flex items-center justify-between"
                      >
                        <button
                          onClick={() => setOpenSpell(spId)}
                          className="text-left underline decoration-white/40 hover:decoration-white"
                        >
                          {label}
                        </button>
                        <span className="opacity-70">#{spId}</span>
                      </li>
                    );
                  })}
                  {spellIds.length === 0 && (
                    <li className="p-2 text-sm opacity-80">
                      {lang === 'fr' ? 'Aucun sort' : 'No spells'}
                    </li>
                  )}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Spell-Modal */}
      {openSpell && (
        <SpellDetails
          spellId={openSpell}
          onClose={() => setOpenSpell(null)}
        />
      )}
    </>
  );
}
