import React, { useState, useEffect } from 'react';
import { PointId, ParamKey } from '../types';
import { POINTS, REAL_LATEST_DATA, REAL_HISTORIC_DATA } from '../data/riverData';
import {
  Calendar,
  Layers,
  MapPin,
  Droplets,
  Activity,
} from 'lucide-react';

interface MonitoringViewProps {
  initialParam?: ParamKey;
  initialPoint?: PointId;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  initialPoint = 'p1',
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<'coleta1' | 'historico'>('coleta1');
  const [activePointId, setActivePointId] = useState<PointId>(initialPoint);

  // Pontos disponíveis para a campanha selecionada:
  const HISTORIC_POINT_IDS: PointId[] = ['p2', 'p3', 'p4'];
  const displayedPoints =
    selectedSubTab === 'historico'
      ? POINTS.filter((p) => HISTORIC_POINT_IDS.includes(p.id))
      : POINTS;

  // Se o usuário alternar para o histórico e o ponto ativo não estiver nos dados históricos, muda para p2
  useEffect(() => {
    if (selectedSubTab === 'historico' && !HISTORIC_POINT_IDS.includes(activePointId)) {
      setActivePointId('p2');
    }
  }, [selectedSubTab, activePointId]);

  // Coleta 1 (Atual)
  const currentStation = REAL_LATEST_DATA[activePointId];
  const activePointInfo = POINTS.find((p) => p.id === activePointId) || POINTS[0];

  // Histórico
  const historicStation = REAL_HISTORIC_DATA[activePointId];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ===================== CABEÇALHO PRINCIPAL ===================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#dbe4dd]">
        <div>
          <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
            Monitoramento Ambiental · Rio Pomba
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0e2b1c] mt-1">
            Qualidade da Água
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#48584f] mt-1.5 max-w-2xl leading-relaxed">
            Consulte os dados da 1ª Coleta e os Dados Históricos (09/10/2025) com os parâmetros físico-químicos e microbiológicos na ficha individual detalhada de cada ponto.
          </p>
        </div>

        {/* Seletor de Campanha: 1ª Coleta vs Histórico */}
        <div className="shrink-0 flex items-center p-1 bg-white border border-[#dbe4dd] rounded-xl shadow-xs self-start md:self-auto">
          <button
            onClick={() => setSelectedSubTab('coleta1')}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              selectedSubTab === 'coleta1'
                ? 'bg-[#164a2f] text-white shadow-2xs'
                : 'text-[#48584f] hover:text-[#0e2b1c] hover:bg-[#f5f8f4]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1ª Coleta (5 Pontos)</span>
          </button>
          <button
            onClick={() => setSelectedSubTab('historico')}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              selectedSubTab === 'historico'
                ? 'bg-[#164a2f] text-white shadow-2xs'
                : 'text-[#48584f] hover:text-[#0e2b1c] hover:bg-[#f5f8f4]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Dados Históricos 09/10/2025 (3 Pontos)</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FICHA INDIVIDUAL DETALHADA                                           */}
      {/* ==================================================================== */}
      <div className="space-y-6">
        {/* Seletor Elegante dos Pontos Monitorados */}
        <div className="bg-white border border-[#dbe4dd] rounded-xl p-2 shadow-xs">
          <div className="text-[11px] font-mono text-[#7c8d83] px-2 pb-1.5 flex items-center justify-between">
            <span>Selecione o Ponto para Visualizar a Ficha Individual Detalhada:</span>
            <span className="text-[#164a2f] font-semibold">
              {selectedSubTab === 'coleta1' ? '5 Pontos Disponíveis' : '3 Pontos no Histórico'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
            {displayedPoints.map((pt) => {
              const isSelected = activePointId === pt.id;

              return (
                <button
                  key={pt.id}
                  onClick={() => setActivePointId(pt.id)}
                  className={`py-2.5 px-3 rounded-lg text-left transition-all cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#164a2f] text-white border-[#164a2f] shadow-sm'
                      : 'bg-[#fcfdfc] text-[#33463b] border-[#e2ece4] hover:bg-[#f2f7f3]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#e6f3ea] text-[#164a2f]'
                      }`}
                    >
                      PONTO {pt.order}
                    </span>
                  </div>
                  <span className="text-xs font-semibold leading-snug line-clamp-1">
                    {pt.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ficha Completa do Ponto Selecionado */}
        <div className="bg-white border border-[#dbe4dd] rounded-2xl shadow-xs overflow-hidden">
          {/* Cabeçalho da Ficha com Identificação do Ponto */}
          <div className="p-4 sm:p-6 border-b border-[#dbe4dd] bg-[#fbfdfb]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#164a2f] text-white px-2.5 py-1 rounded-md text-xs font-mono font-bold">
                  PONTO {activePointInfo.order}
                </span>
                <span className="font-mono text-xs text-[#125575] bg-[#e8f2f7] px-2.5 py-1 rounded-md font-semibold">
                  {selectedSubTab === 'coleta1' ? '1ª Coleta' : 'Campanha Histórica'}
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#0e2b1c] flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#164a2f]" />
                  <span>{activePointInfo.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#48584f] font-mono mt-1">
                  Localização: {activePointInfo.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Dados Físico-Químicos e Microbiológicos */}
          <div className="p-4 sm:p-6 space-y-6">
            {selectedSubTab === 'coleta1' ? (
              <div className="space-y-6">
                {/* 1. Indicadores Físico-Químicos */}
                <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#164a2f]">
                    <Droplets className="w-4 h-4 text-[#164a2f]" />
                    <span>Indicadores Básicos de Campo e Laboratório</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        pH da Água
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#0e2b1c]">
                        {currentStation.ph}
                      </span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        Condutividade
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#0e2b1c]">
                        {currentStation.condutividade}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">µS/cm</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        Oxigênio Dissolvido
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#164a2f]">
                        {currentStation.od}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">mg/L</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        Turbidez
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#125575]">
                        {currentStation.turbidez}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">NTU</span>
                    </div>
                  </div>
                </div>

                {/* 2. Demanda e Compostos */}
                <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#125575]">
                    <Activity className="w-4 h-4 text-[#125575]" />
                    <span>Demanda de Oxigênio e Compostos Químicos</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        DQO
                      </span>
                      <span className="font-mono text-xl font-bold text-[#0e2b1c]">
                        {currentStation.dqo}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">mg/L</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        DBO
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#7c8d83] italic">
                        {currentStation.dbo}
                      </span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        Sólidos Totais
                      </span>
                      <span className="font-mono text-xl font-bold text-[#0e2b1c]">
                        {currentStation.solidos_totais}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">mg/L</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">
                        Cor Aparente
                      </span>
                      <span className="font-mono text-xl font-bold text-[#0e2b1c]">
                        {currentStation.cor_aparente}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">mg Pt/L</span>
                    </div>
                  </div>
                </div>

                {/* 3. Nutrientes e Microbiologia */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nutrientes */}
                  <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#125575] font-semibold block">
                      Nutrientes e Compostos Nitrogenados (mg/L)
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrogênio</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.nitrogenio}</span>
                      </div>
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Fósforo</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.fosforo}</span>
                      </div>
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Amônia</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.amonia}</span>
                      </div>
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrito</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.nitrito}</span>
                      </div>
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrato</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.nitrato}</span>
                      </div>
                    </div>
                  </div>

                  {/* Microbiológico */}
                  <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#164a2f] font-semibold block">
                      Microbiologia
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-3">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Coliformes Totais</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.coliformes}</span>
                      </div>
                      <div className="bg-white border border-[#e2ece4] rounded-lg p-3">
                        <span className="text-[10px] text-[#7c8d83] font-mono block">Escherichia coli</span>
                        <span className="text-sm font-bold font-mono text-[#0e2b1c]">{currentStation.ecoli}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : historicStation ? (
              /* DADOS HISTÓRICOS (09/10/2025) */
              <div className="space-y-6">
                <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#164a2f]">
                    <Droplets className="w-4 h-4 text-[#164a2f]" />
                    <span>Indicadores Históricos (09/10/2025)</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">pH</span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#0e2b1c]">
                        {historicStation.ph}
                      </span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">Condutividade</span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#0e2b1c]">
                        {historicStation.condutividade}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">µS/cm</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">Oxigênio Dissolvido</span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#164a2f]">
                        {historicStation.od}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">mg/L</span>
                    </div>

                    <div className="bg-white border border-[#e2ece4] rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-mono uppercase text-[#7c8d83] block">Turbidez</span>
                      <span className="font-mono text-xl sm:text-2xl font-bold text-[#125575]">
                        {historicStation.turbidez}
                      </span>
                      <span className="text-[10px] text-[#7c8d83] font-mono block">NTU</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fcfdfc] border border-[#dbe4dd] rounded-xl p-4 space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#125575] font-semibold block">
                    Nutrientes e Compostos Nitrogenados (mg/L)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                      <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrogênio</span>
                      <span className="text-sm font-bold font-mono text-[#0e2b1c]">{historicStation.nitrogenio}</span>
                    </div>
                    <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                      <span className="text-[10px] text-[#7c8d83] font-mono block">Fósforo</span>
                      <span className="text-sm font-bold font-mono text-[#0e2b1c]">{historicStation.fosforo}</span>
                    </div>
                    <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                      <span className="text-[10px] text-[#7c8d83] font-mono block">Amônia</span>
                      <span className="text-sm font-bold font-mono text-[#0e2b1c]">{historicStation.amonia}</span>
                    </div>
                    <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                      <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrito</span>
                      <span className="text-sm font-bold font-mono text-[#0e2b1c]">{historicStation.nitrito}</span>
                    </div>
                    <div className="bg-white border border-[#e2ece4] rounded-lg p-2">
                      <span className="text-[10px] text-[#7c8d83] font-mono block">Nitrato</span>
                      <span className="text-sm font-bold font-mono text-[#0e2b1c]">{historicStation.nitrato}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
