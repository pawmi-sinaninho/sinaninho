'use client';
import { useEffect, useMemo, useState } from 'react';
import { useLang } from '@/contexts/LangContext';

type EffectHit = { effectId:number; diceNum:number; diceSide:number };
type SpellLevel = {
  grade:number; apCost:number; minRange:number; range:number;
  criticalHitProbability:number; maxCastPerTurn:number; maxCastPerTarget:number;
  effects: EffectHit[];
};

export default function SpellDetails({ spellId, onClose }:{
  spellId:number; onClose:()=>void;
}) {
  const { lang } = useLang();
  const [levels, setLevels] = useState<SpellLevel[]>([]);
  const [effectTexts, setEffectTexts] = useState<Record<number,{fr:string;en:string}>>({});

  // 1) spell-levels laden
  useEffect(() => {
    fetch(`https://api.dofusdb.fr/spell-levels?spellId=${spellId}`, { cache:'no-store' })
      .then(r => r.json())
      .then(res => setLevels(res.data ?? []))
      .catch(console.error);
  }, [spellId]);

  // 2) effect-beschreibungen (einfacher cache pro modal)
  const effectIds = useMemo(
    () => [...new Set(levels.flatMap(l => l.effects.map(e => e.effectId)))],
    [levels]
  );
  useEffect(() => {
    Promise.all(effectIds.map(id =>
      fetch(`https://api.dofusdb.fr/effects?id=${id}`).then(r => r.json())
    )).then(arr => {
      const map: Record<number,{fr:string;en:string}> = {};
      arr.forEach(x => {
        const e = x?.data?.[0];
        if (e) map[e.id] = { fr: e.description?.fr ?? `Effet #${e.id}`, en: e.description?.en ?? `Effect #${e.id}` };
      });
      setEffectTexts(map);
    }).catch(console.error);
  }, [effectIds]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-2xl w-full rounded-2xl bg-white text-neutral-900 p-5" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">Spell #{spellId}</h3>
          <button onClick={onClose} className="text-sm px-2 py-1 rounded hover:bg-black/5">Close</button>
        </div>

        {levels.map(l => (
          <div key={l.grade} className="border rounded-xl p-3 mb-3">
            <div className="font-semibold mb-1">Stufe {l.grade}</div>
            <div className="text-sm text-neutral-700 mb-2">
              AP: {l.apCost} · Reichweite: {l.minRange}–{l.range} · Krit: {l.criticalHitProbability}% ·
              &nbsp;max/Runde: {l.maxCastPerTurn} · max/Ziel: {l.maxCastPerTarget}
            </div>

            <ul className="space-y-1 text-sm">
              {l.effects.map(e => {
                const raw = effectTexts[e.effectId];
                let text = raw ? raw[lang] : `Effect #${e.effectId}`;
                // Platzhalter #1 / #2 mit Würfelwerten ersetzen (einfachster Fall)
                text = text.replace('#1', String(e.diceNum)).replace('#2', String(e.diceSide));
                return <li key={`${l.grade}-${e.effectId}`}>• {text}</li>;
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
