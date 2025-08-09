'use client';
import { useMemo, useState } from 'react';
import { useLang } from '@/contexts/LangContext';
import { useData } from '@/contexts/DataContext';
import { COMP_ROLES, ROLE_LABEL, Role } from '@/data/roles';
import SpellDetails from '@/components/SpellDetails';
import { withFallback } from '@/utils/img';
import { Heart, Shield, Zap, Hand, MoveRight } from 'lucide-react';

const roleGrad:Record<Role,string>={
  healer:'from-primary to-accent',
  tank:'from-neutral-700 to-neutral-900',
  'ap-steal':'from-yellow-400 to-orange-500',
  'mp-steal':'from-green-400 to-emerald-600',
  shield:'from-sky-500 to-indigo-600',
  push:'from-rose-400 to-fuchsia-600',
  damage:'from-orange-500 to-red-600',
  support:'from-teal-400 to-cyan-600'
};

export default function CompanionsGrid(){
  const { lang }=useLang();
  const { loading, companions, spells, mapping, error }=useData();
  const [q,setQ]=useState(''); const [role,setRole]=useState<Role|null>(null);
  const [openSpell,setOpenSpell]=useState<number|null>(null);

  const roles=Object.keys(ROLE_LABEL) as Role[];
  const filtered=useMemo(()=>{
    const s=q.trim().toLowerCase();
    return companions.filter(c=>{
      const textOk=!s||(c.name?.[lang]??'').toLowerCase().includes(s);
      const roleOk=!role||(COMP_ROLES[c.id]??[]).includes(role);
      return textOk&&roleOk;
    });
  },[companions,q,role,lang]);

  if(loading) return <div className="p-6 text-gray-400">Lade…</div>;
  if(error) return <div className="p-6 text-red-500">Fehler: {error}</div>;

  return (
    <>
      <div className="flex gap-2 items-center">
        <input className="flex-1 rounded-xl border bg-white/90 p-3 outline-none focus:ring-2 focus:ring-primary/60"
          placeholder={lang==='fr'?'Rechercher…':'Search…'} value={q} onChange={e=>setQ(e.target.value)} />
        <select className="rounded-xl border bg-white/90 p-3" value={role??''} onChange={e=>setRole((e.target.value||null) as any)}>
          <option value="">{lang==='fr'?'Toutes les rôles':'All roles'}</option>
          {roles.map(r=><option key={r} value={r}>{ROLE_LABEL[r][lang]}</option>)}
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
        {filtered.map(c=>{
          const idStr=String(c.id);
          const spellIds=mapping[idStr] ?? c.spells ?? [];
          const main=(COMP_ROLES[c.id]?.[0] ?? 'support') as Role;
          return (
            <li key={c.id} className={`rounded-3xl p-4 shadow-xl bg-gradient-to-br ${roleGrad[main]} text-white
                                       transition-transform hover:scale-[1.02]`}>
              <div className="flex items-center gap-4">
                <img src={withFallback(c.img)} alt={c.name?.[lang]} className="h-16 w-16 rounded-full border-2 border-white/30 object-cover" />
                <div className="flex-1">
                  <div className="text-lg font-bold drop-shadow">{c.name?.[lang] ?? '—'}</div>
                  <div className="text-xs opacity-80">
                    {(COMP_ROLES[c.id]??[]).map(r=>ROLE_LABEL[r][lang]).join(' · ')}
                  </div>
                </div>
              </div>

              {c.description?.[lang] && (
                <p className="mt-3 text-sm/6 bg-black/20 rounded-xl p-2">{c.description[lang]}</p>
              )}

              <div className="mt-3">
                <div className="font-semibold mb-1">{lang==='fr'?'Sorts':'Spells'}</div>
                <ul className="divide-y divide-white/20 rounded-lg border border-white/20 bg-black/10">
                  {spellIds.map(spId=>{
                    const s=spells[spId];
                    const label = s ? (s[`name_${lang}`] || s.name_en || `#${spId}`) : `#${spId}`;
                    return (
                      <li key={spId} className="p-2 text-sm flex items-center justify-between">
                        <button onClick={()=>setOpenSpell(spId)} className="text-left underline decoration-white/40 hover:decoration-white">
                          {label}
                        </button>
                        <span className="opacity-70">#{spId}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      {openSpell && <SpellDetails spellId={openSpell} onClose={()=>setOpenSpell(null)} />}
    </>
  );
}
