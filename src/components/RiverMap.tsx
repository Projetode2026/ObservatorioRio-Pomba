import React from 'react';
import { PointId } from '../types';
import { POINTS, REAL_LATEST_DATA } from '../data/riverData';
import {
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { InteractiveSatelliteMap } from './InteractiveSatelliteMap';

interface RiverMapProps {
  selectedPointId: PointId;
  onSelectPoint: (id: PointId) => void;
  onNavigateToMonitoring: (pointId: PointId) => void;
}

export const RiverMap: React.FC<RiverMapProps> = ({
  selectedPointId,
  onSelectPoint,
  onNavigateToMonitoring,
}) => {
  const currentPoint = POINTS.find((p) => p.id === selectedPointId) || POINTS[0];
  const stationReal = REAL_LATEST_DATA[currentPoint.id];

  return (
    <div className="space-y-6">
      {/* Top Banner do Mapa */}
      <div className="bg-white border border-[#dbe4dd] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#125575] font-semibold uppercase tracking-wider block mb-1">
            Mapeamento · Rio Pomba
          </span>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0e2b1c]">
            Mapa dos Pontos de Monitoramento
          </h3>
          <p className="text-xs sm:text-sm text-[#48584f] mt-1 max-w-2xl leading-relaxed">
            Localização e distribuição dos 5 pontos monitorados ao longo do Rio Pomba. Clique diretamente nos marcadores no mapa ou nos botões para inspecionar os parâmetros analíticos de cada estação.
          </p>
        </div>
      </div>

      {/* Grid Principal: Mapa de Satélite com Alfinetes à Esquerda + Ficha do Ponto Selecionado à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Painel com o Mapa Interativo de Alfinetes e Seleção dos Pontos */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-[#dbe4dd] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#e9efe9] pb-3">
              <span className="text-xs font-mono font-semibold text-[#0e2b1c] uppercase tracking-wider">
                Imagem de Satélite dos Pontos
              </span>
              <span className="text-[11px] font-mono text-[#125575] bg-[#eef4f0] px-2.5 py-1 rounded-md font-semibold">
                Rio Pomba · MG
              </span>
            </div>

            {/* Componente Interativo com Marcadores nos Locais Exatos e Zoom no Ponto Ativo no PC */}
            <InteractiveSatelliteMap
              selectedPointId={selectedPointId}
              onSelectPoint={onSelectPoint}
              zoomOnDesktop={true}
            />

            <div className="text-[11px] font-mono text-[#52705e] text-center pt-0.5">
              5 pontos monitorados ao longo da calha do Rio Pomba
            </div>
          </div>

          {/* Seleção Rápida dos Pontos */}
          <div className="bg-white border border-[#dbe4dd] rounded-2xl p-4 shadow-xs space-y-2">
            <span className="text-[11px] font-mono uppercase text-[#7c8d83] font-semibold block tracking-wider">
              Selecione o Ponto para Consultar:
            </span>

            <div className="grid grid-cols-5 gap-2">
              {POINTS.map((p) => {
                const isSelected = p.id === selectedPointId;

                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPoint(p.id)}
                    className={`py-2.5 px-1.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      isSelected
                        ? 'bg-[#164a2f] text-white border-[#164a2f] shadow-sm'
                        : 'bg-[#fcfdfc] text-[#33463b] border-[#e2ece4] hover:bg-[#f2f7f3]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold">P{p.order}</span>
                    <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">
                      {p.name.replace('Ponte de ', '').replace('Ponte do ', '').replace('Ponte da ', '').replace('Ponte ', '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ficha Detalhada do Ponto Selecionado */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#dbe4dd] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-[#e9efe9] pb-4">
              <div>
                <span className="font-mono text-xs text-[#125575] font-semibold uppercase tracking-wider">
                  Ponto P{currentPoint.order}
                </span>
                <h4 className="font-display font-bold text-xl text-[#0e2b1c] mt-0.5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#164a2f]" />
                  <span>{currentPoint.name}</span>
                </h4>
                <span className="font-mono text-xs text-[#52705e] block mt-0.5">
                  Localização: {currentPoint.desc}
                </span>
              </div>
            </div>

            {/* Parâmetros Analíticos da 1ª Coleta */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-semibold uppercase text-[#125575] tracking-wider block">
                Últimos Parâmetros Analíticos Registrados:
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#f5f8f5] border border-[#dbe4dd] p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#52705e] block">pH da Água</span>
                  <span className="font-mono font-bold text-lg text-[#0e2b1c]">{stationReal.ph}</span>
                </div>

                <div className="bg-[#f5f8f5] border border-[#dbe4dd] p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#52705e] block">Oxigênio Dissolvido</span>
                  <span className="font-mono font-bold text-lg text-[#164a2f]">{stationReal.od} mg/L</span>
                </div>

                <div className="bg-[#f5f8f5] border border-[#dbe4dd] p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#52705e] block">Turbidez</span>
                  <span className="font-mono font-bold text-lg text-[#125575]">{stationReal.turbidez} NTU</span>
                </div>

                <div className="bg-[#f5f8f5] border border-[#dbe4dd] p-3 rounded-xl">
                  <span className="text-[10px] font-mono text-[#52705e] block">Condutividade</span>
                  <span className="font-mono font-bold text-lg text-[#0e2b1c]">{stationReal.condutividade} µS/cm</span>
                </div>
              </div>
            </div>

            {/* Botão de Ação para Ver Tabela Completa */}
            <button
              onClick={() => onNavigateToMonitoring(currentPoint.id)}
              className="w-full py-3 px-4 rounded-xl font-display font-semibold text-sm bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Ver Ficha Analítica Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
