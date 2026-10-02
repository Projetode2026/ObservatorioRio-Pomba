export type PointId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export interface Point {
  id: PointId;
  name: string;
  short: string;
  order: number;
  desc: string;
  profile: 'rural' | 'preservado' | 'intermediario' | 'urbano' | 'jusante';
}

export type ParamKey =
  | 'ph'
  | 'condutividade'
  | 'turbidez'
  | 'od'
  | 'solidos_totais'
  | 'dqo'
  | 'dbo'
  | 'nitrogenio'
  | 'fosforo'
  | 'amonia'
  | 'nitrito'
  | 'nitrato'
  | 'cor_aparente';

export type StatusLevel = 'good' | 'attn' | 'crit';

export interface ParameterDef {
  name: string;
  unit: string;
  decimals: number;
  base: number;
  amplitude: number;
  drift: number;
  noise: number;
  min: number;
  max: number;
  ref: string;
  refMin: number;
  refMax: number;
  better: 'range' | 'high' | 'low';
  desc: string;
}

export interface Reading {
  date: Date;
  value: number;
}

export interface Fish {
  id: string;
  name: string;
  sci: string;
  origem: string; // 'Nativa', 'Nativa (ameaçada)', 'Exótica (invasora)'
  curiosidades: string[]; // Lista de curiosidades exatas do arquivo
  color: string;
  accent: string;
  status: StatusLevel;
  conservation: string;
  weight: number;
  invasive?: boolean;
  photo?: string;
}
