import React from 'react';
import { POINTS } from '../data/riverData';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#dbe4dd] pb-4 sm:pb-6">
        <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold block">
          Documentação e Metodologia
        </span>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0e2b1c] mt-1 sm:mt-2">
          Sobre o projeto
        </h2>
        <p className="text-sm sm:text-[15.5px] text-[#48584f] mt-1.5 sm:mt-2 max-w-3xl leading-relaxed">
          Acompanhamento contínuo da qualidade da água e conservação da biodiversidade aquática do Rio Pomba na Zona da Mata mineira.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Objetivo
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Acompanhar de forma sistemática a qualidade da água do Rio Pomba e apresentar os dados de monitoramento das coletas nos pontos ao longo de seu curso.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Área de estudo
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Trecho do Rio Pomba na Zona da Mata de Minas Gerais abrangendo os 5 pontos de monitoramento: Ponte da Fazenda Sinimbu, Ponte de Camargo, Ponte Metálica, Ponte da Empa e Distrito de Aracati.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Metodologia de Coleta e Análise
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Coletas nos pontos fixos de monitoramento com análise de parâmetros laboratoriais (pH, condutividade, sólidos totais, turbidez, DQO, DBO, nitrogênio, fósforo, amônia, nitrito, nitrato, oxigênio, cor aparente, coliformes e E. coli).
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Pontos de Monitoramento
            </h4>
            <ul className="space-y-2.5 text-[14.3px] text-[#48584f]">
              {POINTS.map((p) => (
                <li key={p.id} className="flex gap-2.5 items-start">
                  <span className="font-mono font-semibold text-[#164a2f] shrink-0 mt-0.5">
                    {p.order}
                  </span>
                  <span>
                    <strong className="text-[#0e2b1c]">{p.name}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
              Fontes dos Dados
            </h4>
            <p className="text-[14.8px] text-[#48584f] leading-relaxed">
              Os dados apresentados são oriundos das análises laboratoriais da 1ª Coleta nos 5 pontos e do Relatório Histórico de 09/10/2025 (Ponte de Camargo, Ponte Metálica e Ponte da Empa).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
