import React from 'react';
import { Users, GraduationCap } from 'lucide-react';

const ADVISOR = 'Matheus Campista';

const STUDENTS: string[] = [
  'Luiza Caetano Amorim',
  'Susana Teixeira Arquete',
  'Rafaela Maria Vilela Benjamim',
  'Yasmim Aguiar Nogueira',
  'Ingrid Barros de Castro',
  'Alice da Cruz Moraes',
  'Bella Ribeiro Angelino',
  'Alice Cerquera de Souza',
  'Davi Alves Zignago',
  'Maria Rita Aguiar',
];

const DEVELOPER = 'Paulo Jorge de Assis Silva';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Estilos específicos para degradê em movimento e malha fluida */}
      <style>{`
        @keyframes movingRiverMesh {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes floatingBlobA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(35px, -22px) scale(1.18); }
          66% { transform: translate(-25px, 20px) scale(0.92); }
        }

        @keyframes floatingBlobB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 25px) scale(1.12); }
          66% { transform: translate(25px, -18px) scale(0.88); }
        }

        .animated-river-mesh {
          background: linear-gradient(125deg, #092115, #144630, #0c3825, #0f4b3a, #11425e, #0a271b);
          background-size: 350% 350%;
          animation: movingRiverMesh 16s ease infinite;
        }

        .blob-anim-a {
          animation: floatingBlobA 12s ease-in-out infinite;
        }

        .blob-anim-b {
          animation: floatingBlobB 15s ease-in-out infinite;
        }
      `}</style>

      {/* ======================================================== */}
      {/* BANNER COM DEGRADÊ EM MOVIMENTO                          */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl animated-river-mesh text-white p-6 sm:p-10 border border-[#1b5035]/80 shadow-lg">
        {/* Orbs de luz líquida em movimento orgânico */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#34d399]/18 rounded-full blur-3xl pointer-events-none blob-anim-a" />
        <div className="absolute left-1/4 -top-16 w-60 h-60 bg-[#17698f]/25 rounded-full blur-3xl pointer-events-none blob-anim-b" />
        <div className="absolute right-1/3 top-1/2 w-48 h-48 bg-[#2c8a5b]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Linha de brilho sutil na borda superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10 space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[#a3c3b0] font-semibold block">
            Iniciação Científica · EcoSesi
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-xs">
            Sobre o projeto
          </h2>
          <p className="text-xs sm:text-sm text-[#cfe3d6] font-sans max-w-2xl leading-relaxed pt-0.5">
            Pesquisa em Limnologia e conservação ambiental das águas do Rio Pomba.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TEXTO INSTITUCIONAL EXATO E UNIFICADO (SEM QUADRADINHOS) */}
      {/* ======================================================== */}
      <div className="bg-white border border-[#dbe4dd] rounded-2xl p-6 sm:p-9 shadow-xs space-y-5">
        <p className="text-[16px] sm:text-[17.5px] text-[#2c3b32] leading-relaxed font-sans">
          O EcoSesi é um grupo de iniciação científica formado por estudantes dos Ensinos Fundamental e Médio, dedicado ao desenvolvimento de pesquisas na área de Limnologia. Suas atividades concentram-se no estudo de ecossistemas lóticos, especialmente rios, e na avaliação de seu grau de preservação por meio da análise integrada de parâmetros físicos, químicos e biológicos, além de aspectos ecológicos. Por meio de investigações científicas e atividades práticas, o grupo promove a curiosidade, o pensamento crítico, a consciência ambiental e o protagonismo estudantil.
        </p>

        <p className="text-[16px] sm:text-[17.5px] text-[#0e2b1c] leading-relaxed font-medium pt-4 border-t border-[#e9efe9]">
          Missão: produzir conhecimento científico sobre os ecossistemas aquáticos da região e contribuir para a conservação dos recursos hídricos, formando estudantes comprometidos com a ciência, a sustentabilidade e a transformação socioambiental da comunidade.
        </p>
      </div>

      {/* ======================================================== */}
      {/* SEÇÃO DA EQUIPE: ORIENTAÇÃO E ESTUDANTES PESQUISADORES    */}
      {/* ======================================================== */}
      <div className="bg-white border border-[#dbe4dd] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e9efe9] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#164a2f]" />
              <span className="font-mono text-xs text-[#125575] uppercase tracking-wider font-semibold">
                Iniciação Científica EcoSesi
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0e2b1c] mt-0.5">
              Estudantes Pesquisadores
            </h3>
          </div>

          {/* Menção discreta ao Professor Orientador */}
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#4a6353] bg-[#f0f6f2] px-3.5 py-1.5 rounded-lg border border-[#dbe7df]">
            <GraduationCap className="w-3.5 h-3.5 text-[#2c8a5b]" />
            <span>
              Professor orientador: <strong className="text-[#0e2b1c] font-medium">{ADVISOR}</strong>
            </span>
          </div>
        </div>

        {/* Grade limpa com os nomes dos estudantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STUDENTS.map((name) => (
            <div
              key={name}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e2ece4] bg-[#fbfdfb] hover:bg-[#f2f8f4] hover:border-[#b8dcbf] transition-all shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#2c8a5b] shrink-0" />
              <span className="font-medium text-sm text-[#0e2b1c]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CRÉDITO DISCRETO DO DESENVOLVEDOR (EMBAIXO)              */}
      {/* ======================================================== */}
      <div className="pt-2 border-t border-[#dbe4dd] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6b7f73] font-mono gap-1.5">
        <span>
          Desenvolvimento do site: <span className="text-[#3b5445] font-medium">{DEVELOPER}</span>
        </span>
        <span className="text-[11px] text-[#8fa799]">
          EcoSesi · Iniciação Científica
        </span>
      </div>
    </div>
  );
};
