export type Role = 'healer'|'tank'|'ap-steal'|'mp-steal'|'shield'|'push'|'damage'|'support';

export const ROLE_LABEL: Record<Role, {fr:string; en:string}> = {
  'healer':   { fr:'Soigneur',   en:'Healer' },
  'tank':     { fr:'Tank',       en:'Tank' },
  'ap-steal': { fr:'Retrait PA', en:'AP steal' },
  'mp-steal': { fr:'Retrait PM', en:'MP steal' },
  'shield':   { fr:'Bouclier',   en:'Shield' },
  'push':     { fr:'Poussée',    en:'Push' },
  'damage':   { fr:'Dégâts',     en:'Damage' },
  'support':  { fr:'Soutien',    en:'Support' }
};

// Companion-ID → Rollen
export const COMP_ROLES: Record<number, Role[]> = {
  61: ['healer','shield','support'],  // Lumino
  62: ['tank','push'],                // (Beispiel) Skale
  // ... restlich ergänzen
};
