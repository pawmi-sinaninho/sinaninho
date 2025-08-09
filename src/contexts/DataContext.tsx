'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Companion, SpellDict, CompanionSpellMap } from '@/types/dofus';

type DataState = {
  loading: boolean;
  companions: Companion[];
  spells: SpellDict;
  mapping: CompanionSpellMap;
  error?: string;
};

const DataContext = createContext<DataState>({
  loading: true,
  companions: [],
  spells: {},
  mapping: {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>({
    loading: true,
    companions: [],
    spells: {},
    mapping: {},
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // 1) Live-API (alle Compagnons)
        const companionsReq = fetch('https://api.dofusdb.fr/companions?$limit=100', {
          // wichtig: no-cache, sonst bekommst du manchmal leere Antworten
          cache: 'no-store',
        }).then(r => r.json());

        // 2) Lokale JSONs (keine CORS-Probleme)
        const spellsReq  = fetch('/data/Spells.json').then(r => r.json());
        const mapReq     = fetch('/data/companion_spells_mapping.json').then(r => r.json());

        const [companionsRes, spellsRaw, mappingRaw] = await Promise.all([
          companionsReq, spellsReq, mapReq
        ]);

        const companions: Companion[] = Array.isArray(companionsRes?.data) ? companionsRes.data : [];

        // Spells.json hat string-Keys → in Number-Keys konvertieren
        const spells: SpellDict = Object.fromEntries(
          Object.entries(spellsRaw || {}).map(([k, v]) => [Number(k), v as any])
        );

        // Mapping-Keys sind Strings, passt für uns – wir greifen via String(comp.id) zu
        const mapping: CompanionSpellMap = mappingRaw || {};

        if (!cancelled) {
          setState({ loading: false, companions, spells, mapping });
        }
      } catch (e: any) {
        if (!cancelled) {
          setState(s => ({ ...s, loading: false, error: e?.message || 'Load error' }));
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => state, [state]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
