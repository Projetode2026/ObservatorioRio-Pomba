import React from 'react';
import { ViewTab } from './Navbar';
import { PointId } from '../types';
import { POINTS } from '../data/riverData';
import { ArrowRight, MapPin } from 'lucide-react';
import { LiquidMarquee } from './LiquidMarquee';
import { InteractiveSatelliteMap } from './InteractiveSatelliteMap';

interface HomeViewProps {
  onNavigate: (tab: ViewTab, param?: any, point?: PointId) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 sm:-mt-10">
      <style>{`
        @keyframes riverFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .river-gradient-bg {
          background: linear-gradient(270deg, #1a4b32, #0e2b1c, #0d5c45, #05100a, #113824);
          background-size: 400% 400%;
          animation: riverFlow 18s ease infinite;
        }

        .clean-water-card {
          background: #ffffff;
          border: 1px solid #dbe4dd;
          box-shadow: 0 4px 16px 0 rgba(14, 43, 28, 0.05);
        }
      `}</style>

      {/* ===================== HERO ===================== */}
      <section className="river-gradient-bg text-[#cfe3d6] border-b border-[#1b4b32] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 relative z-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <span className="font-mono text-xs sm:text-[13px] text-[#cfe3d6] block tracking-wide">
              Monitoramento da Qualidade da Água
            </span>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-semibold text-white leading-[1.14]">
              O Rio Pomba, observado de perto
            </h1>

            <p className="text-[15px] sm:text-[17px] text-[#a3c3b0] leading-relaxed max-w-2xl font-sans">
              Acompanhamento sistemático dos parâmetros físico-químicos e microbiológicos da água ao longo dos 5 pontos de monitoramento do Rio Pomba na Zona da Mata mineira.
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('monitoramento')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm bg-[#34d399] text-[#05100a] hover:bg-[#10b981] transition-colors cursor-pointer shadow-md touch-manipulation"
              >
                <span>Ver monitoramento da água</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('mapa')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm border border-[#a3c3b0]/40 text-[#cfe3d6] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#34d399]" />
                <span>Acessar aba do mapa</span>
              </button>
            </div>
          </div>

          {/* CARD DO 5 LIMPO, SÓBRIO E PROFISSIONAL */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-[#1b4b32]/80">
            <div className="inline-flex items-center gap-3.5 bg-black/25 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
              <span className="font-mono text-2xl font-bold text-[#34d399] leading-none">
                5
              </span>
              <div className="text-xs text-[#cfe3d6] leading-tight">
                <span className="font-semibold block text-white">Pontos de Monitoramento</span>
                <span className="text-[11px] text-[#a3c3b0]">Ao longo do Rio Pomba</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LIQUID MARQUEE ===================== */}
      <LiquidMarquee />

      {/* ===================== MAPA DOS PONTOS DE MONITORAMENTO COM ALFINETES INTERATIVOS ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="clean-water-card rounded-2xl p-5 sm:p-8 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e9efe9] pb-3">
            <div>
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
                Mapeamento Espacial
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0e2b1c] mt-0.5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#164a2f]" />
                <span>Mapa dos Pontos de Monitoramento</span>
              </h3>
            </div>
            <span className="text-xs font-mono text-[#52705e] bg-[#f0f4ee] px-3 py-1 rounded-md self-start sm:self-auto border border-[#dbe4dd]">
              Rio Pomba · 5 Pontos de Monitoramento
            </span>
          </div>

          {/* Componente Interativo com Marcadores nos Locais Exatos */}
          <InteractiveSatelliteMap
            onSelectPoint={(ptId) => onNavigate('mapa', undefined, ptId)}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#52705e] pt-1">
            <span>Localização geográfica das 5 estações de coleta ao longo da calha do rio</span>
            <button
              onClick={() => onNavigate('mapa')}
              className="text-[#164a2f] font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver detalhes na aba Mapa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================== PANORAMA ATUAL / TABELA RESUMO DA 1ª COLETA ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
              Panorama atual
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#0e2b1c] mt-1">
              Resultados da 1ª Coleta nos 5 Pontos
            </h2>
          </div>

          <button
            onClick={() => onNavigate('monitoramento')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#164a2f] text-[#164a2f] hover:bg-[#e6f3ea] transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
          >
            <span>Ver tabelas completas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Table Summary on Home */}
        <div className="clean-water-card rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#f0f4ee] border-b border-[#dbe4dd] text-[#16241d] font-mono text-[11px] sm:text-xs">
                  <th className="py-3 px-4 font-bold">Parâmetro</th>
                  <th className="py-3 px-3 font-bold text-[#164a2f]">Sinimbu (P1)</th>
                  <th className="py-3 px-3 font-bold text-[#17698f]">Ponte Camargo (P2)</th>
                  <th className="py-3 px-3 font-bold text-[#a3721f]">Ponte Metálica (P3)</th>
                  <th className="py-3 px-3 font-bold text-[#8b5cf6]">Ponte Empa (P4)</th>
                  <th className="py-3 px-3 font-bold text-[#d97706]">Aracaty (P5)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e9efe9] font-sans">
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">pH</td>
                  <td className="py-2 px-3 font-mono">7.49</td>
                  <td className="py-2 px-3 font-mono">7.36</td>
                  <td className="py-2 px-3 font-mono">7.39</td>
                  <td className="py-2 px-3 font-mono">7.27</td>
                  <td className="py-2 px-3 font-mono">7.65</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">Condutividade (µS/cm)</td>
                  <td className="py-2 px-3 font-mono">41.9</td>
                  <td className="py-2 px-3 font-mono">30.6</td>
                  <td className="py-2 px-3 font-mono">29.56</td>
                  <td className="py-2 px-3 font-mono">32.3</td>
                  <td className="py-2 px-3 font-mono">27.15</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">Oxigênio (mg/L)</td>
                  <td className="py-2 px-3 font-mono">6.8</td>
                  <td className="py-2 px-3 font-mono">5.3</td>
                  <td className="py-2 px-3 font-mono">5.2</td>
                  <td className="py-2 px-3 font-mono">5.7</td>
                  <td className="py-2 px-3 font-mono">5.4</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">Turbidez (NTU)</td>
                  <td className="py-2 px-3 font-mono">400</td>
                  <td className="py-2 px-3 font-mono">512</td>
                  <td className="py-2.5 px-3 font-mono">305</td>
                  <td className="py-2 px-3 font-mono">213</td>
                  <td className="py-2 px-3 font-mono">109</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">DBO</td>
                  <td className="py-2 px-3 font-mono text-[#7c8d83]">-</td>
                  <td className="py-2 px-3 font-mono text-[#7c8d83]">-</td>
                  <td className="py-2 px-3 font-mono text-[#7c8d83]">-</td>
                  <td className="py-2 px-3 font-mono text-[#7c8d83]">-</td>
                  <td className="py-2 px-3 font-mono text-[#7c8d83]">-</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-[#0e2b1c]">Coliformes / E. coli</td>
                  <td className="py-2 px-3 font-mono text-xs">Presente / Ausente</td>
                  <td className="py-2 px-3 font-mono text-xs">Presente / Ausente</td>
                  <td className="py-2 px-3 font-mono text-xs">Presente / Ausente</td>
                  <td className="py-2 px-3 font-mono text-xs">Presente / Ausente</td>
                  <td className="py-2 px-3 font-mono text-xs">Presente / Ausente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===================== OS 5 PONTOS DE MONITORAMENTO ===================== */}
      <section className="bg-[#f0f4ee] border-y border-[#dbe4dd] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
            <div className="space-y-3 sm:space-y-4">
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
                Rede Hidrográfica
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#0e2b1c]">
                Os 5 Pontos de Monitoramento
              </h2>
              <p className="text-xs sm:text-[15px] text-[#48584f] leading-relaxed">
                O observatório acompanha o trecho do Rio Pomba através de coletas analíticas sistemáticas em estações estratégicas, avaliando o perfil da água desde as áreas rurais até trechos urbanos.
              </p>
              <p className="text-xs sm:text-[15px] text-[#48584f] leading-relaxed">
                Cada estação possui registros físico-químicos dedicados para auditoria e acompanhamento contínuo da bacia.
              </p>
            </div>

            <div className="space-y-3">
              {POINTS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('monitoramento', undefined, p.id)}
                  className="clean-water-card rounded-xl p-4 sm:p-5 cursor-pointer group hover:border-[#164a2f] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold text-[#0e2b1c] text-sm sm:text-[16px] group-hover:text-[#164a2f] transition-colors">
                      Ponto {p.order}: {p.name}
                    </h4>
                    <span className="font-mono text-[11px] bg-[#e8f2f7] text-[#125575] px-2.5 py-1 rounded-md font-semibold group-hover:bg-[#164a2f] group-hover:text-white transition-colors">
                      Ver Ficha
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13.8px] text-[#48584f] leading-relaxed mt-1">
                    {p.id === 'p1' && 'Primeira estação de monitoramento da bacia, acompanhando as condições iniciais do trecho avaliado.'}
                    {p.id === 'p2' && 'Estação intermediária com dados físico-químicos e históricos de campanhas anteriores.'}
                    {p.id === 'p3' && 'Ponto com parâmetros laboratoriais de oxigênio, pH, turbidez e condutividade.'}
                    {p.id === 'p4' && 'Estação estratégica que acompanha a dinâmica fluvial e carga orgânica no trecho monitorado.'}
                    {p.id === 'p5' && 'Estação localizada na região de jusante, avaliando as condições finais da bacia monitorada.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
