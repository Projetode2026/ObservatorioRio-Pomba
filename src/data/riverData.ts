import { Point, PointId, ParamKey, ParameterDef, Reading, StatusLevel, Fish } from '../types';

import imgLambariAmarelo from '../assets/images/peixe_lambari_amarelo_1790900019449.jpg';
import imgLambariBocarra from '../assets/images/peixe_lambari_bocarra_1790900032448.jpg';
import imgCascudo from '../assets/images/peixe_cascudo_1790900040870.jpg';
import imgPiauVermelho from '../assets/images/peixe_piau_vermelho_1790900051862.jpg';
import imgCurimata from '../assets/images/peixe_curimata_1790900062991.jpg';
import imgTraira from '../assets/images/peixe_traira_1790900075028.jpg';
import imgCaraPapaTerra from '../assets/images/peixe_cara_papa_terra_1790900087374.jpg';
import imgJundiaBagre from '../assets/images/peixe_jundia_bagre_1790900098862.jpg';
import imgSarapoTuvira from '../assets/images/peixe_sarapo_tuvira_1790900110295.jpg';
import imgMucumCobra from '../assets/images/peixe_mucum_cobra_1790900122243.jpg';
import imgPirapitinga from '../assets/images/peixe_pirapitinga_1790900138277.jpg';
import imgSurubimParaiba from '../assets/images/peixe_surubim_paraiba_1790900149706.jpg';
import imgCascudoLeiteiro from '../assets/images/peixe_cascudo_leiteiro_1790900161957.jpg';
import imgTucunareInvasor from '../assets/images/peixe_tucunare_invasor_1790900173134.jpg';

export const TODAY = new Date('2026-09-29T12:00:00');
export const HISTORIC_DATE = new Date('2025-10-09T12:00:00');

// 1. PONTOS DE MONITORAMENTO
export const POINTS: Point[] = [
  {
    id: 'p1',
    name: 'Ponte da Fazenda Sinimbu',
    short: 'P1',
    order: 1,
    desc: 'Ponte da Fazenda Sinimbu',
    profile: 'rural',
  },
  {
    id: 'p2',
    name: 'Ponte de Camargo',
    short: 'P2',
    order: 2,
    desc: 'Ponte de Camargo',
    profile: 'preservado',
  },
  {
    id: 'p3',
    name: 'Ponte Metálica',
    short: 'P3',
    order: 3,
    desc: 'Ponte Metálica',
    profile: 'intermediario',
  },
  {
    id: 'p4',
    name: 'Ponte da Empa',
    short: 'P4',
    order: 4,
    desc: 'Ponte da Empa',
    profile: 'urbano',
  },
  {
    id: 'p5',
    name: 'Distrito de Aracati',
    short: 'P5',
    order: 5,
    desc: 'Distrito de Aracati',
    profile: 'jusante',
  },
];

// Dados da Coleta Atual (Testes)
export interface RealStationData {
  ph: number;
  condutividade: number;
  solidos_totais: number;
  turbidez: number;
  dqo: number;
  dbo: string;
  nitrogenio: number;
  fosforo: number;
  amonia: number;
  nitrito: number;
  nitrato: number;
  od: number;
  cor_aparente: number;
  coliformes: string;
  ecoli: string;
}

// 2. COLETA ATUAL - DADOS EXATOS DO ARQUIVO
export const REAL_LATEST_DATA: Record<PointId, RealStationData> = {
  p1: { // Sinimbu
    ph: 7.49,
    condutividade: 41.9,
    solidos_totais: 21.0,
    turbidez: 400,
    dqo: 82,
    dbo: '-',
    nitrogenio: 15.4,
    fosforo: 1.83,
    amonia: 0.41,
    nitrito: 0.043,
    nitrato: 1.6,
    od: 6.8,
    cor_aparente: 1799,
    coliformes: 'Presente',
    ecoli: 'Ausente',
  },
  p2: { // Ponte Camargo
    ph: 7.36,
    condutividade: 30.6,
    solidos_totais: 15.3,
    turbidez: 512,
    dqo: 87,
    dbo: '-',
    nitrogenio: 14.9,
    fosforo: 1.95,
    amonia: 0.47,
    nitrito: 0.039,
    nitrato: 1.6,
    od: 5.3,
    cor_aparente: 2320,
    coliformes: 'Presente',
    ecoli: 'Ausente',
  },
  p3: { // Ponte Metálica
    ph: 7.39,
    condutividade: 29.56,
    solidos_totais: 14.38,
    turbidez: 305,
    dqo: 62,
    dbo: '-',
    nitrogenio: 15.7,
    fosforo: 1.66,
    amonia: 0.37,
    nitrito: 0.043,
    nitrato: 1.6,
    od: 5.2,
    cor_aparente: 1531,
    coliformes: 'Presente',
    ecoli: 'Ausente',
  },
  p4: { // Ponte Empa
    ph: 7.27,
    condutividade: 32.3,
    solidos_totais: 16.2,
    turbidez: 213,
    dqo: 70,
    dbo: '-',
    nitrogenio: 15.7,
    fosforo: 1.26,
    amonia: 0.34,
    nitrito: 0.078,
    nitrato: 1.7,
    od: 5.7,
    cor_aparente: 1054,
    coliformes: 'Presente',
    ecoli: 'Ausente',
  },
  p5: { // Aracati
    ph: 7.65,
    condutividade: 27.15,
    solidos_totais: 13.01,
    turbidez: 109,
    dqo: 80,
    dbo: '-',
    nitrogenio: 16.5,
    fosforo: 0.95,
    amonia: 0.14,
    nitrito: 0.015,
    nitrato: 1.4,
    od: 5.4,
    cor_aparente: 670,
    coliformes: 'Presente',
    ecoli: 'Ausente',
  },
};

// 3. DADOS HISTÓRICOS (RELATÓRIO DE 09/10/2025)
export interface HistoricStationData {
  ph: number;
  condutividade: number;
  dqo: number;
  solidos_totais: number;
  turbidez: number;
  nitrogenio: number;
  fosforo: number;
  amonia: number;
  nitrito: number;
  nitrato: number;
  od: number;
  ecoli: string;
  coliformes: string;
}

export const REAL_HISTORIC_DATA: Partial<Record<PointId, HistoricStationData>> = {
  p2: {
    ph: 7.7,
    condutividade: 53.2,
    dqo: 69,
    solidos_totais: 26.7,
    turbidez: 9,
    nitrogenio: 0.3,
    fosforo: 0.53,
    amonia: 0.01,
    nitrito: 0.02,
    nitrato: 0.02,
    od: 9.1,
    ecoli: 'PRESENÇA',
    coliformes: 'PRESENÇA',
  },
  p3: {
    ph: 7.6,
    condutividade: 50.2,
    dqo: 14,
    solidos_totais: 24.3,
    turbidez: 19,
    nitrogenio: 0.5,
    fosforo: 0.68,
    amonia: 0.01,
    nitrito: 0.016,
    nitrato: 0.5,
    od: 8.5,
    ecoli: 'PRESENÇA',
    coliformes: 'PRESENÇA',
  },
  p4: {
    ph: 7.7,
    condutividade: 52.1,
    dqo: 22,
    solidos_totais: 25.9,
    turbidez: 9,
    nitrogenio: 0.3,
    fosforo: 0.61,
    amonia: 0.02,
    nitrito: 0.018,
    nitrato: 0.7,
    od: 10.4,
    ecoli: 'PRESENÇA',
    coliformes: 'PRESENÇA',
  },
};

export const PARAM_DEF: Record<ParamKey, ParameterDef> = {
  ph: {
    name: 'pH',
    unit: '',
    decimals: 2,
    base: 7.4,
    amplitude: 0.15,
    drift: 0.05,
    noise: 0.08,
    min: 6.0,
    max: 9.0,
    ref: '6,0 – 9,0',
    refMin: 6.0,
    refMax: 9.0,
    better: 'range',
    desc: 'pH medido no laboratório.',
  },
  condutividade: {
    name: 'Condutividade Elétrica',
    unit: 'µS/cm',
    decimals: 2,
    base: 32,
    amplitude: 10,
    drift: 5,
    noise: 3,
    min: 15,
    max: 100,
    ref: '≤ 100 µS/cm',
    refMin: -99,
    refMax: 100,
    better: 'low',
    desc: 'Condutividade elétrica da amostra.',
  },
  solidos_totais: {
    name: 'Sólidos Totais',
    unit: 'mg/L',
    decimals: 2,
    base: 16,
    amplitude: 4,
    drift: 2,
    noise: 1.5,
    min: 5,
    max: 100,
    ref: '≤ 500 mg/L',
    refMin: -99,
    refMax: 500,
    better: 'low',
    desc: 'Sólidos totais medidos.',
  },
  turbidez: {
    name: 'Turbidez',
    unit: 'NTU',
    decimals: 1,
    base: 250,
    amplitude: 120,
    drift: 40,
    noise: 25,
    min: 5,
    max: 800,
    ref: '≤ 100 NTU',
    refMin: -99,
    refMax: 100,
    better: 'low',
    desc: 'Turbidez da amostra.',
  },
  dqo: {
    name: 'DQO',
    unit: 'mg/L',
    decimals: 1,
    base: 72,
    amplitude: 15,
    drift: 8,
    noise: 5,
    min: 10,
    max: 200,
    ref: '≤ 60 mg/L',
    refMin: -99,
    refMax: 60,
    better: 'low',
    desc: 'Demanda Química de Oxigênio.',
  },
  dbo: {
    name: 'DBO',
    unit: 'mg/L',
    decimals: 0,
    base: 0,
    amplitude: 0,
    drift: 0,
    noise: 0,
    min: 0,
    max: 0,
    ref: '—',
    refMin: 0,
    refMax: 0,
    better: 'low',
    desc: 'Demanda Bioquímica de Oxigênio.',
  },
  nitrogenio: {
    name: 'Nitrogênio',
    unit: 'mg/L',
    decimals: 2,
    base: 15,
    amplitude: 5,
    drift: 3,
    noise: 1.5,
    min: -20,
    max: 30,
    ref: '≤ 2,18 mg/L',
    refMin: -99,
    refMax: 2.18,
    better: 'low',
    desc: 'Nitrogênio medido no laudo.',
  },
  fosforo: {
    name: 'Fósforo',
    unit: 'mg/L',
    decimals: 3,
    base: 1.5,
    amplitude: 0.4,
    drift: 0.2,
    noise: 0.1,
    min: 0.02,
    max: 4.0,
    ref: '≤ 0,050 mg/L',
    refMin: -99,
    refMax: 0.05,
    better: 'low',
    desc: 'Fósforo total medido.',
  },
  amonia: {
    name: 'Amônia',
    unit: 'mg/L',
    decimals: 3,
    base: 0.35,
    amplitude: 0.1,
    drift: 0.05,
    noise: 0.03,
    min: 0.005,
    max: 3.0,
    ref: '≤ 3,7 mg/L',
    refMin: -99,
    refMax: 3.7,
    better: 'low',
    desc: 'Amônia / Nitrogênio Amoniacal.',
  },
  nitrito: {
    name: 'Nitrito',
    unit: 'mg/L',
    decimals: 4,
    base: 0.04,
    amplitude: 0.02,
    drift: 0.01,
    noise: 0.005,
    min: 0.001,
    max: 1.0,
    ref: '≤ 1,0 mg/L',
    refMin: -99,
    refMax: 1.0,
    better: 'low',
    desc: 'Nitrito medido.',
  },
  nitrato: {
    name: 'Nitrato',
    unit: 'mg/L',
    decimals: 2,
    base: 1.5,
    amplitude: 0.4,
    drift: 0.2,
    noise: 0.1,
    min: 0.01,
    max: 10.0,
    ref: '≤ 10,0 mg/L',
    refMin: -99,
    refMax: 10.0,
    better: 'low',
    desc: 'Nitrato medido.',
  },
  od: {
    name: 'Oxigênio Dissolvido',
    unit: 'mg/L',
    decimals: 2,
    base: 5.6,
    amplitude: 1.5,
    drift: 0.8,
    noise: 0.4,
    min: 2.0,
    max: 12.0,
    ref: '≥ 5,0 mg/L',
    refMin: 5.0,
    refMax: 99,
    better: 'high',
    desc: 'Oxigênio medido.',
  },
  cor_aparente: {
    name: 'Cor Aparente',
    unit: 'uH',
    decimals: 0,
    base: 1400,
    amplitude: 500,
    drift: 200,
    noise: 150,
    min: 50,
    max: 4000,
    ref: '≤ 75 uH',
    refMin: -99,
    refMax: 75,
    better: 'low',
    desc: 'Cor aparente medida.',
  },
};

export const PARAM_ORDER: ParamKey[] = [
  'ph',
  'condutividade',
  'solidos_totais',
  'turbidez',
  'dqo',
  'nitrogenio',
  'fosforo',
  'amonia',
  'nitrito',
  'nitrato',
  'od',
  'cor_aparente',
];

export function fmtDate(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function statusOf(paramKey: ParamKey, value: number): StatusLevel {
  const def = PARAM_DEF[paramKey];
  if (!def) return 'good';

  if (def.better === 'range') {
    if (value >= def.refMin && value <= def.refMax) return 'good';
    const span = def.refMax - def.refMin;
    const off = value < def.refMin ? def.refMin - value : value - def.refMax;
    return off > span * 0.25 ? 'crit' : 'attn';
  }
  if (def.better === 'high') {
    if (value >= def.refMin) return 'good';
    if (value >= def.refMin * 0.7) return 'attn';
    return 'crit';
  }
  if (value <= def.refMax) return 'good';
  if (value <= def.refMax * 1.5) return 'attn';
  return 'crit';
}

export function statusLabel(s: StatusLevel): string {
  return s === 'good' ? 'Dentro do esperado' : s === 'attn' ? 'Atenção' : 'Crítico';
}

export function latestVal(paramKey: ParamKey, pointId: PointId): number {
  const station = REAL_LATEST_DATA[pointId];
  if (station && typeof (station as any)[paramKey] === 'number') {
    return (station as any)[paramKey];
  }
  return 0;
}

// ====================================================================
// PEIXES DO RIO POMBA (MG) - 14 ESPÉCIES REAIS DO ARQUIVO
// ====================================================================
export const FISH: Fish[] = [
  {
    id: 'peixe-1',
    name: 'Lambari-do-rabo-amarelo',
    sci: 'Astyanax bimaculatus',
    origem: 'Nativa',
    curiosidades: [
      'Também é chamado de tambiú, piaba e matupiri, dependendo da região do Brasil.',
      'Come de tudo: plantas e pequenos animais. A dieta muda conforme o lugar e a época do ano.',
      'É um dos peixes mais abundantes do Rio Pomba.',
      'É muito usado como isca viva na pesca.',
    ],
    color: '#e2cf44',
    accent: '#333333',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 5,
    photo: imgLambariAmarelo,
  },
  {
    id: 'peixe-2',
    name: 'Lambari-bocarra (peixe-cachorro)',
    sci: 'Oligosarcus hepsetus',
    origem: 'Nativa',
    curiosidades: [
      'Também é chamado de lambari-cachorro, cachorro-magro e peixe-cachorro.',
      'É carnívoro: quando é pequeno come insetos e, quando cresce, come outros peixes.',
      'Em um experimento, os filhotes preferiram comer tilápias pequenas.',
    ],
    color: '#9db4c0',
    accent: '#253237',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
    photo: imgLambariBocarra,
  },
  {
    id: 'peixe-3',
    name: 'Cascudo',
    sci: 'Hypostomus affinis (e Hypostomus luetkeni)',
    origem: 'Nativa',
    curiosidades: [
      'O nome do gênero, Hypostomus, significa "boca embaixo".',
      'O H. affinis vive na bacia do Paraíba do Sul e chega a cerca de 40 cm.',
      'Ele se alimenta de matéria orgânica que fica no fundo do rio (detritos).',
      'Peixes desse gênero conseguem respirar ar quando precisam.',
    ],
    color: '#5c5347',
    accent: '#8a7f6c',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
    photo: imgCascudo,
  },
  {
    id: 'peixe-4',
    name: 'Piau-vermelho',
    sci: 'Leporinus copelandii',
    origem: 'Nativa',
    curiosidades: [
      'É típico do trecho médio do Rio Pomba.',
      'Faz migração para se reproduzir. No baixo Paraíba do Sul, desova de setembro a janeiro.',
      'Depois da desova, ele come mais para recuperar a forma.',
    ],
    color: '#d9534f',
    accent: '#2c2c2c',
    status: 'attn',
    conservation: 'Sensível a fragmentação',
    weight: 3,
    photo: imgPiauVermelho,
  },
  {
    id: 'peixe-5',
    name: 'Curimatá (grumatã)',
    sci: 'Prochilodus lineatus e Prochilodus vimboides',
    origem: 'Nativa',
    curiosidades: [
      'Forma grandes cardumes e faz a piracema, a migração para se reproduzir.',
      'É iliófago: se alimenta de sedimento e matéria orgânica do fundo do rio.',
      'O Prochilodus vimboides também é chamado de grumatã, sobe o rio na época das cheias e está na lista de espécies ameaçadas.',
      'Barragens atrapalham a migração desses peixes.',
    ],
    color: '#8fb3c9',
    accent: '#dfe8ec',
    status: 'attn',
    conservation: 'Sensível à barreira fluvial',
    weight: 3,
    photo: imgCurimata,
  },
  {
    id: 'peixe-6',
    name: 'Traíra',
    sci: 'Hoplias malabaricus',
    origem: 'Nativa',
    curiosidades: [
      'Quem costuma cuidar do ninho é o macho.',
      'O ninho é uma cova na areia, com cerca de 8 mil ovos.',
      'Adulta, come quase só peixes e aguenta longos períodos sem comer.',
    ],
    color: '#7a6a4f',
    accent: '#4a3f2c',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
    photo: imgTraira,
  },
  {
    id: 'peixe-7',
    name: 'Cará (acará, papa-terra)',
    sci: 'Geophagus brasiliensis',
    origem: 'Nativa',
    curiosidades: [
      'Também é conhecido como acará e "papa-terra".',
      'Pega bocados do fundo, separa o alimento dentro da boca e joga o resto para fora pelas guelras.',
      'Numa análise da dieta, os caramujos foram o alimento mais importante.',
    ],
    color: '#c98a4b',
    accent: '#7a4a25',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 4,
    photo: imgCaraPapaTerra,
  },
  {
    id: 'peixe-8',
    name: 'Jundiá (bagre)',
    sci: 'Rhamdia quelen',
    origem: 'Nativa',
    curiosidades: [
      'Pode chegar a 50 cm e 3 kg.',
      'Tem hábito noturno.',
      'Aguenta água com pouco oxigênio.',
      'A identificação da espécie pode mudar, porque ela foi redescrita recentemente.',
    ],
    color: '#4a4540',
    accent: '#8f877c',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 3,
    photo: imgJundiaBagre,
  },
  {
    id: 'peixe-9',
    name: 'Sarapó (tuvira)',
    sci: 'Gymnotus carapo',
    origem: 'Nativa',
    curiosidades: [
      'É um peixe-elétrico de campo fraco: seus pulsos chegam a no máximo cerca de 1 milivolt.',
      'Usa esses pulsos, à noite, para se orientar e se comunicar.',
      'Pode ter de 30 a 60 cm.',
      'Um de seus apelidos é "tira-faca".',
    ],
    color: '#6c584c',
    accent: '#a98467',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 3,
    photo: imgSarapoTuvira,
  },
  {
    id: 'peixe-10',
    name: 'Muçum (a "cobra-d\'água")',
    sci: 'Synbranchus marmoratus',
    origem: 'Nativa',
    curiosidades: [
      'Parece cobra, mas é um peixe. Por isso é chamado de cobra-d\'água.',
      'Respira ar pela garganta, que funciona como um pulmão.',
      'À noite, pode rastejar de uma poça para outra.',
      'As fêmeas viram machos quando chegam a 45 a 60 cm de tamanho.',
    ],
    color: '#3d405b',
    accent: '#81b29a',
    status: 'good',
    conservation: 'Pouco preocupante',
    weight: 3,
    photo: imgMucumCobra,
  },
  {
    id: 'peixe-11',
    name: 'Pirapitinga-do-sul (matrinchã)',
    sci: 'Brycon opalinus',
    origem: 'Nativa (ameaçada)',
    curiosidades: [
      'Chega a cerca de 35 cm e 1 kg e come de tudo (onívora).',
      'Depende muito da mata ciliar (a mata da beira do rio) bem conservada.',
      'Está ameaçada de extinção e é raro no Rio Pomba.',
    ],
    color: '#e07a5f',
    accent: '#3d405b',
    status: 'crit',
    conservation: 'Ameaçada de extinção',
    weight: 2,
    photo: imgPirapitinga,
  },
  {
    id: 'peixe-12',
    name: 'Surubim-do-paraíba',
    sci: 'Steindachneridion parahybae',
    origem: 'Nativa (ameaçada)',
    curiosidades: [
      'É um bagre grande que só existe na bacia do Rio Paraíba do Sul (endêmico).',
      'Chega a pelo menos 60 cm.',
      'Está ameaçado de extinção.',
    ],
    color: '#4f5d75',
    accent: '#2d3142',
    status: 'crit',
    conservation: 'Ameaçada de extinção (Endêmica)',
    weight: 1,
    photo: imgSurubimParaiba,
  },
  {
    id: 'peixe-13',
    name: 'Cascudo-leiteiro',
    sci: 'Pogonopoma parahybae',
    origem: 'Nativa (ameaçada)',
    curiosidades: [
      'Tem cerca de 34 cm e só existe na bacia do Paraíba do Sul (endêmico).',
      'É pouco comum: no levantamento do Rio Pomba, só 2 exemplares foram capturados.',
      'Está ameaçado de extinção.',
    ],
    color: '#d4a373',
    accent: '#ccd5ae',
    status: 'crit',
    conservation: 'Ameaçada de extinção (Endêmica)',
    weight: 1,
    photo: imgCascudoLeiteiro,
  },
  {
    id: 'peixe-14',
    name: 'Tucunaré',
    sci: 'Cichla sp.',
    origem: 'Exótica (invasora)',
    curiosidades: [
      'Não é do Rio Pomba: veio de outras regiões do Brasil, levado para a pesca esportiva.',
      'Guarda o ninho e os filhotes, um comportamento raro entre peixes de água doce.',
      'Tem uma mancha em forma de olho na cauda.',
      'Como é predador, pode prejudicar os peixes nativos.',
    ],
    color: '#606c38',
    accent: '#dda15e',
    status: 'attn',
    conservation: 'Espécie exótica invasora',
    weight: 2,
    invasive: true,
    photo: imgTucunareInvasor,
  },
];

export const WATER_FACTS = [
  'A bacia do Rio Pomba abriga espécies nativas endêmicas exclusivas da bacia do Paraíba do Sul, como o Surubim-do-paraíba e o Cascudo-leiteiro.',
  'A preservação da mata ciliar nas margens do Rio Pomba é indispensável para espécies como a Pirapitinga-do-sul, que depende de frutos e sementes caídos na água.',
  'Peixes migradores como o Curimatá e o Piau-vermelho necessitam de trechos livres de barramento para realizar a piracema e desovar.',
  'Espécies como o Muçum e a Traíra possuem adaptações morfológicas para suportar períodos com menor oxigenação.',
  'A introdução de espécies exóticas como o Tucunaré altera a dinâmica natural das presas nativas da ictiofauna local.',
];
