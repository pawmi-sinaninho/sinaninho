export type I18N = { [lang: string]: string };

export type Companion = {
  id: number;
  name: I18N;              // name.fr / name.en
  description?: I18N;
  img?: string;
  spells?: number[];       // manchmal vorhanden, aber für uns egal
  // ...andere Felder ignorieren wir erstmal
};

export type SpellDict = {
  [id: number]: { name_en?: string; name_fr?: string };
};

export type CompanionSpellMap = {
  [companionId: string]: number[]; // IDs als Strings in der JSON!
};
