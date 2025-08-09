'use client';
import { useLang } from '@/contexts/LangContext';

export default function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="px-3 py-1 rounded-full border text-sm hover:bg-white/10"
      aria-label="Switch language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
