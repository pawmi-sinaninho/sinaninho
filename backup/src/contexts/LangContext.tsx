'use client';
import React,{createContext,useContext,useEffect,useState} from 'react';
type Lang='fr'|'en';
const Ctx=createContext<{lang:Lang;setLang:(l:Lang)=>void}>({lang:'fr',setLang:()=>{}});
export function LangProvider({children}:{children:React.ReactNode}) {
  const [lang,setLang]=useState<Lang>('fr');
  useEffect(()=>{ const s=localStorage.getItem('lang') as Lang|null; if(s) setLang(s); },[]);
  useEffect(()=>{ localStorage.setItem('lang',lang); },[lang]);
  return <Ctx.Provider value={{lang,setLang}}>{children}</Ctx.Provider>;
}
export const useLang=()=>useContext(Ctx);
