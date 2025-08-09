'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/** Hilfstypen */
type Localized = { fr?: string; en?: string };

export type Companion = {
  id: number;
  name?: Localized;
  description?: Localized;
  spells?: number[];
  img?: string;
};

export type Spell = {
  id: number;
  name_fr?: string;
  name_en?: string;
  // weitere Felder sind erlaubt, aber uns egal
  [k: string]: unknown;
};

/** Mapping: Companion-ID -> Spell-IDs */
export type Mapping = Record<string, number[]>;

/** Response-Form der DofusDB-Listenendpunkte */
type ApiList<T> = { total: number; limit: number; skip: number; data: T[] };

/** Wert im Context */
type DataValue = {
  loading: boolean;
  error?: string;
  companions: Companion[];
  spells: Record<number, Spell>;
  mapping: Mapping;
};

const DataCtx = createContext<DataValue>({
  loading: true,
  companions: [],
  spells: {},
  mapping: {},
});

/** T-typisierter Fetch, damit kein any benötigt wird */
async function fetchJson<T>(input: RequestInfo | URL): Promise<T> {
  const res = await fetch(input);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${input.toString()}`);
  return (await res.json()) as T;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataValue>({
    loading: true,
    companions: [],
    spells: {},
    mapping: {},
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [mapping, spellsMap, compsResp] = await Promise.all([
          fetchJson<Mapping>('/data/companion_spells_mapping.json'),
          fetchJson<Record<number, Spell>>('/data/Spells.json'),
          fetchJson<ApiList<Companion>>('https://api.dofusdb.fr/companions?$limit=60'),
        ]);

        if (cancelled) return;

        setState({
          loading: false,
          error: undefined,
          companions: compsResp.data,
          spells: spellsMap,
          mapping,
        });
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return <DataCtx.Provider value={state}>{children}</DataCtx.Provider>;
}

export const useData = () => useContext(DataCtx);
