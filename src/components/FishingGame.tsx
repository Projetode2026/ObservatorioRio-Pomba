import React, { useState, useEffect, useRef } from 'react';
import { Fish } from '../types';
import { FISH } from '../data/riverData';
import { FishVector } from './FishVector';
import {
  BookOpen,
  Check,
  Compass,
  Fish as FishIcon,
  Search,
  X,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Gamepad2,
  Lock,
  Trophy,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  Zap,
  Clock,
} from 'lucide-react';

// ====================================================================
// SINTETIZADOR DE ÁUDIO VIA WEB AUDIO API (Sem arquivos externos)
// ====================================================================
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCast() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.28);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  playNibble() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  playBite() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  playCatch() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  playSplash() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

const sfx = new SoundEffects();

export const FishingGame: React.FC = () => {
  // Controle de Abas: Jogo de Pesca vs Catálogo
  const [activeTab, setActiveTab] = useState<'jogo' | 'catalogo'>('jogo');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Filtros do Catálogo
  const [catalogFilter, setCatalogFilter] = useState<'todos' | 'capturados' | 'bloqueados'>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Progresso salvo no localStorage
  const [caughtIds, setCaughtIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rio_pomba_caught_fish');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rio_pomba_caught_fish', JSON.stringify(caughtIds));
    } catch {
      // Ignora
    }
  }, [caughtIds]);

  // Fases do jogo
  const [phase, setPhase] = useState<
    'idle' | 'casting' | 'waiting' | 'nibbling' | 'biting' | 'caught' | 'escaped'
  >('idle');

  const [message, setMessage] = useState<string>(
    'Prepare o anzol e clique em "Arremessar Linha" para pescar no Rio Pomba.'
  );
  const [recentFish, setRecentFish] = useState<Fish | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [tensionPercent, setTensionPercent] = useState<number>(100);

  // Modal de Ficha Científica
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Refs de temporizadores e animação de tensão
  const timerRef = useRef<number | null>(null);
  const biteWindowRef = useRef<number | null>(null);
  const tensionIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    sfx.enabled = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (biteWindowRef.current) clearTimeout(biteWindowRef.current);
      if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
    };
  }, []);

  // Iniciar Arremesso
  const handleCast = () => {
    if (phase !== 'idle' && phase !== 'escaped' && phase !== 'caught') return;

    setPhase('casting');
    setMessage('Arremessando a linha no curso do Rio Pomba...');
    sfx.playCast();

    timerRef.current = window.setTimeout(() => {
      setPhase('waiting');
      setMessage('Linha na água. Acompanhe a boia flutuando na correnteza...');

      // Tempo até primeira mordiscada (entre 2.5s e 5.5s)
      const waitTime = Math.floor(Math.random() * 3000) + 2500;
      timerRef.current = window.setTimeout(startNibbling, waitTime);
    }, 700);
  };

  // Mordiscada
  const startNibbling = () => {
    setPhase('nibbling');
    setMessage('A boia está tremendo! Um peixe está rondando a isca...');
    sfx.playNibble();

    // Pode mordiscar de 1 a 2 vezes antes do bote final
    timerRef.current = window.setTimeout(() => {
      startBiting();
    }, 1500);
  };

  // Bote / Puxada
  const startBiting = () => {
    setPhase('biting');
    setMessage('MORDIDA FORTE! FISGUE AGORA ANTES QUE ELE ESCAPE!');
    sfx.playBite();

    // Barra de tensão decrescente durante a janela de fisgada (1.4 segundos)
    setTensionPercent(100);
    const startTime = Date.now();
    const duration = 1400;

    if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
    tensionIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setTensionPercent(remaining);
      if (remaining <= 0) {
        if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
      }
    }, 30);

    biteWindowRef.current = window.setTimeout(() => {
      handleEscape();
    }, duration);
  };

  // Fisgada pelo Jogador
  const handleHook = () => {
    if (phase !== 'biting') {
      if (phase === 'waiting' || phase === 'nibbling') {
        // Fisgou cedo demais
        if (timerRef.current) clearTimeout(timerRef.current);
        if (biteWindowRef.current) clearTimeout(biteWindowRef.current);
        if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
        setPhase('escaped');
        setMessage('Você puxou a linha cedo demais e espantou o peixe!');
        sfx.playSplash();
        setStreak(0);
      }
      return;
    }

    // Fisgou no tempo correto!
    if (biteWindowRef.current) clearTimeout(biteWindowRef.current);
    if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);

    // Sorteio ponderado dos peixes
    const uncollected = FISH.filter((f) => !caughtIds.includes(f.id));
    let chosenFish: Fish;

    // Se ainda há peixes não pescados, dá 70% de chance de pescar um inédito
    if (uncollected.length > 0 && Math.random() < 0.7) {
      chosenFish = uncollected[Math.floor(Math.random() * uncollected.length)];
    } else {
      const totalWeight = FISH.reduce((acc, f) => acc + f.weight, 0);
      let rand = Math.random() * totalWeight;
      chosenFish = FISH[0];
      for (const f of FISH) {
        if (rand < f.weight) {
          chosenFish = f;
          break;
        }
        rand -= f.weight;
      }
    }

    setRecentFish(chosenFish);
    setPhase('caught');
    sfx.playCatch();
    setStreak((prev) => prev + 1);

    const isNew = !caughtIds.includes(chosenFish.id);
    if (isNew) {
      setCaughtIds((prev) => [...prev, chosenFish.id]);
      setMessage(`PARABÉNS! Você pescou uma NOVA ESPÉCIE: ${chosenFish.name}! Ficha desbloqueada no catálogo.`);
    } else {
      setMessage(`Bela captura! Você pescou outro exemplar de ${chosenFish.name}.`);
    }
  };

  // Peixe escapou
  const handleEscape = () => {
    if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
    setPhase('escaped');
    setMessage('O peixe mordeu a isca e escapou correnteza abaixo! Tente novamente.');
    sfx.playSplash();
    setStreak(0);
  };

  const openModal = (fish: Fish) => {
    setSelectedFish(fish);
    setIsModalOpen(true);
  };

  const handleResetProgress = () => {
    if (window.confirm('Deseja reiniciar seu álbum de peixes pescados?')) {
      setCaughtIds([]);
      setStreak(0);
      try {
        localStorage.removeItem('rio_pomba_caught_fish');
      } catch {
        // Ignora
      }
    }
  };

  const filteredFish = FISH.filter((f) => {
    const isCaught = caughtIds.includes(f.id);

    if (catalogFilter === 'capturados' && !isCaught) return false;
    if (catalogFilter === 'bloqueados' && isCaught) return false;

    if (searchTerm.trim() !== '') {
      if (isCaught) {
        return (
          f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.sci.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.curiosidades.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return false;
    }

    return true;
  });

  const progressPercent = Math.round((caughtIds.length / FISH.length) * 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner do Jogo com Barra de Progresso Aprimorada */}
      <div className="bg-white border border-[#dbe4dd] rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs text-[#125575] font-semibold uppercase tracking-wider">
                Catálogo de Biodiversidade · Rio Pomba
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#0e2b1c]">
              Pesca e Álbum de Espécies
            </h3>
            <p className="text-xs sm:text-sm text-[#48584f] mt-1 max-w-2xl leading-relaxed">
              Experimente a pesca nas águas do Rio Pomba. Cada espécie capturada desbloqueia a fotografia real e as características biológicas registradas no caderno de campo!
            </p>
          </div>

          {/* Alternador e Áudio */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <div className="flex items-center p-1 bg-[#f0f4ee] rounded-xl border border-[#dbe4dd]">
              <button
                onClick={() => setActiveTab('jogo')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'jogo'
                    ? 'bg-[#164a2f] text-white shadow-2xs'
                    : 'text-[#48584f] hover:text-[#0e2b1c]'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Pesca</span>
              </button>

              <button
                onClick={() => setActiveTab('catalogo')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'catalogo'
                    ? 'bg-[#164a2f] text-white shadow-2xs'
                    : 'text-[#48584f] hover:text-[#0e2b1c]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Catálogo Completo</span>
              </button>
            </div>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                audioEnabled
                  ? 'bg-white border-[#dbe4dd] text-[#164a2f] hover:bg-[#f5f8f5]'
                  : 'bg-[#f3f4f6] border-[#d1d5db] text-[#9ca3af]'
              }`}
              title={audioEnabled ? 'Desativar efeitos sonoros' : 'Ativar efeitos sonoros'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* BARRA DE PROGRESSO ELEGANTE (Sem elementos circulares isolados) */}
        <div className="bg-[#f7faf8] border border-[#d8e6dc] rounded-xl p-4 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[#164a2f] font-bold">Progresso do Álbum:</span>
              <span className="text-[#0e2b1c] font-semibold">{caughtIds.length} de {FISH.length} espécies descobertas</span>
            </div>
            <span className="text-[#125575] font-bold">{progressPercent}% concluído</span>
          </div>

          <div className="w-full h-3 bg-[#e2ede5] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#2c8a5b] to-[#164a2f] rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ABA 1: PESCA COM MECÂNICA E ANIMAÇÕES                                */}
      {/* ==================================================================== */}
      {activeTab === 'jogo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Cenário Interativo do Trapiche no Rio Pomba */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[490px] bg-gradient-to-b from-[#7cbcc8] via-[#5da2b3] to-[#1d5c70] shadow-md border-2 border-[#8ec7d3] select-none flex flex-col justify-between p-3.5 sm:p-6">
              {/* Céu, Vegetação de Mata Ciliar e Montanhas */}
              <div className="absolute inset-0 pointer-events-none">
                <svg
                  className="w-full h-40 absolute top-0 left-0 opacity-40"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                >
                  <path d="M0 160 L60 80 L140 130 L220 50 L340 140 L450 60 L540 110 L600 80 L600 160 Z" fill="#2d6f55" />
                  <path d="M0 160 L100 110 L190 150 L280 90 L380 150 L490 100 L600 140 L600 160 Z" fill="#1c503c" opacity="0.6" />
                </svg>

                <div className="absolute top-16 inset-x-0 h-28 bg-gradient-to-b from-[#1c5539] via-[#216744] to-transparent opacity-85" />

                <svg
                  className="w-full h-full absolute inset-0"
                  viewBox="0 0 600 480"
                  preserveAspectRatio="none"
                >
                  <g stroke="#ffffff" strokeWidth="1" opacity="0.25" fill="none">
                    <path d="M0 240 Q150 220 300 240 T600 240" />
                    <path d="M0 290 Q150 270 300 290 T600 290" />
                    <path d="M0 340 Q150 320 300 340 T600 340" />
                    <path d="M0 390 Q150 370 300 390 T600 390" />
                  </g>

                  {(phase === 'waiting' || phase === 'nibbling') && (
                    <g
                      className={`transition-all duration-700 ${
                        phase === 'nibbling' ? 'opacity-70 scale-105' : 'opacity-25'
                      }`}
                    >
                      <path
                        d="M260 310 Q290 300 320 310 Q305 325 290 315 Z"
                        fill="#0b2b1d"
                      >
                        <animate
                          attributeName="d"
                          values="M260 310 Q290 300 320 310 Q305 325 290 315 Z; M265 312 Q295 302 325 312 Q310 327 295 317 Z; M260 310 Q290 300 320 310 Q305 325 290 315 Z"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  )}
                </svg>
              </div>

              {/* HUD Superior do Cenário */}
              <div className="relative z-10 flex items-center justify-between gap-3 text-white font-mono text-xs">
                <div className="bg-[#0e2b1c]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#34d399]/40 flex items-center gap-2 shadow-sm">
                  <Waves className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Rio Pomba · Margem Ribeirinha</span>
                </div>

                {streak > 1 && (
                  <div className="bg-[#eab308] text-[#422006] font-bold px-3 py-1 rounded-full text-xs shadow-md flex items-center gap-1.5 animate-pulse">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Sequência: {streak}x</span>
                  </div>
                )}
              </div>

              {/* CENTRO DO CENÁRIO: ÁGUA, BOIA E AÇÃO */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                {/* Janela de Tensão do Peixe quando está mordendo */}
                {phase === 'biting' && (
                  <div className="w-64 max-w-full mb-6 bg-[#0e2b1c]/90 p-3 rounded-2xl border-2 border-[#fbbf24] shadow-2xl backdrop-blur-md space-y-1.5 animate-pulse">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                      <span className="flex items-center gap-1 text-[#fbbf24]">
                        <Zap className="w-3.5 h-3.5" />
                        <span>FISGUE AGORA!</span>
                      </span>
                      <span>{Math.ceil(tensionPercent)}%</span>
                    </div>
                    <div className="h-2.5 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#ef4444] transition-all duration-75"
                        style={{ width: `${tensionPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Linha e Boia */}
                <div className="relative flex flex-col items-center">
                  {phase !== 'idle' && phase !== 'caught' && (
                    <div className="absolute bottom-10 w-[1.5px] h-32 bg-white/70 shadow-sm" />
                  )}

                  {/* Ondas concêntricas na água */}
                  {(phase === 'waiting' || phase === 'nibbling' || phase === 'biting') && (
                    <div className="absolute -bottom-2 w-28 h-8 rounded-full border border-white/50 animate-ping pointer-events-none" />
                  )}

                  {phase === 'nibbling' && (
                    <>
                      <div className="absolute -top-7 text-white font-mono text-xs bg-[#0e2b1c]/80 px-2 py-0.5 rounded shadow animate-bounce">
                        Tuc!
                      </div>
                    </>
                  )}

                  {phase === 'biting' && (
                    <>
                      <div className="absolute w-32 h-32 rounded-full bg-[#fbbf24]/40 animate-ping pointer-events-none" />
                      <div className="absolute -top-12 bg-[#dc2626] text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-xl animate-bounce flex items-center gap-1 border-2 border-white">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>FISGUE JÁ!</span>
                      </div>
                    </>
                  )}

                  {phase !== 'idle' && (
                    <div
                      className={`relative transition-all duration-200 cursor-pointer ${
                        phase === 'nibbling'
                          ? 'translate-y-2 rotate-6'
                          : phase === 'biting'
                          ? 'translate-y-8 scale-95 rotate-12'
                          : phase === 'waiting'
                          ? 'animate-pulse'
                          : ''
                      }`}
                      onClick={phase === 'biting' ? handleHook : undefined}
                    >
                      <svg width="48" height="60" viewBox="0 0 48 60">
                        <line x1="24" y1="2" x2="24" y2="16" stroke="#ffffff" strokeWidth="2.5" />
                        <path d="M12 28 C12 18 36 18 36 28 Z" fill="#e11d48" />
                        <path d="M12 28 C12 38 36 38 36 28 Z" fill="#ffffff" />
                        <rect x="11.5" y="26.5" width="25" height="3" fill="#1f2937" />
                        <line x1="24" y1="38" x2="24" y2="52" stroke="#1f2937" strokeWidth="2" />
                      </svg>
                    </div>
                  )}

                  {phase === 'caught' && recentFish && (
                    <div className="relative z-30 flex flex-col items-center animate-bounce">
                      <div className="w-48 bg-white/95 rounded-2xl p-3 shadow-2xl border-2 border-[#164a2f] flex flex-col items-center justify-center">
                        <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-[#f0f4ee]">
                          {recentFish.photo ? (
                            <img
                              src={recentFish.photo}
                              alt={recentFish.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FishVector fish={recentFish} isDiscovered={true} />
                            </div>
                          )}
                        </div>
                        <span className="font-display font-bold text-xs text-[#0e2b1c] truncate max-w-full">
                          {recentFish.name}
                        </span>
                      </div>
                      <div className="mt-2 text-white font-mono text-xs bg-[#164a2f] px-3 py-1 rounded-full shadow-lg border border-[#34d399] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                        <span>Captura Perfeita!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROLES INFERIORES */}
              <div className="relative z-20 space-y-3">
                <div className="bg-white/95 backdrop-blur-md text-[#0e2b1c] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono text-center shadow-lg border border-[#c4e3cf] max-w-lg mx-auto">
                  {message}
                </div>

                <div className="flex items-center justify-center gap-3">
                  {phase === 'idle' && (
                    <button
                      onClick={handleCast}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-display font-bold text-sm sm:text-base bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 hover:scale-102 active:scale-98 touch-manipulation"
                    >
                      <Waves className="w-5 h-5 text-[#34d399]" />
                      <span>Arremessar Linha no Rio</span>
                    </button>
                  )}

                  {phase === 'casting' && (
                    <button
                      disabled
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-mono font-semibold text-xs sm:text-sm bg-white/80 text-[#164a2f] shadow-md flex items-center justify-center gap-2 opacity-80"
                    >
                      <div className="w-4 h-4 border-2 border-[#164a2f] border-t-transparent rounded-full animate-spin" />
                      <span>Arremessando...</span>
                    </button>
                  )}

                  {phase === 'waiting' && (
                    <button
                      onClick={handleHook}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-display font-semibold text-xs sm:text-sm bg-white text-[#164a2f] hover:bg-[#f5f8f5] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 border border-[#bcdbc7] touch-manipulation"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#164a2f] animate-ping" />
                      <span>Aguardando Mordiscada... (Recolher)</span>
                    </button>
                  )}

                  {phase === 'nibbling' && (
                    <button
                      onClick={handleHook}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-display font-bold text-xs sm:text-sm bg-[#fef3c7] text-[#92400e] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 border-2 border-[#fbbf24] animate-pulse touch-manipulation"
                    >
                      <span>Atenção... Prepare para Fisgar!</span>
                    </button>
                  )}

                  {phase === 'biting' && (
                    <button
                      onClick={handleHook}
                      className="w-full sm:w-auto py-4 px-8 sm:px-10 rounded-xl font-display font-black text-sm sm:text-base bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-all cursor-pointer shadow-2xl flex items-center justify-center gap-2 border-2 border-white scale-105 touch-manipulation animate-bounce"
                    >
                      <Zap className="w-5 h-5 fill-current" />
                      <span>FISGAR PEIXE AGORA!</span>
                    </button>
                  )}

                  {(phase === 'caught' || phase === 'escaped') && (
                    <button
                      onClick={handleCast}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-display font-bold text-xs sm:text-sm bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 touch-manipulation"
                    >
                      <Waves className="w-4 h-4 text-[#34d399]" />
                      <span>Lançar Nova Linha</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Diário de Campo Lateral */}
          <div className="lg:col-span-5 bg-white border border-[#dbe4dd] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e9efe9] pb-3">
              <div>
                <h4 className="font-display font-bold text-lg sm:text-xl text-[#0e2b1c]">
                  Caderno de Campo
                </h4>
                <span className="text-xs text-[#7c8d83]">
                  Pesque para revelar a foto e os dados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#164a2f] bg-[#e6f3ea] px-3 py-1 rounded-md">
                  {caughtIds.length} / {FISH.length}
                </span>
                {caughtIds.length > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="p-1 text-[#9ca3af] hover:text-[#dc2626] transition-colors cursor-pointer"
                    title="Reiniciar progresso de pesca"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1 max-h-[360px] overflow-y-auto pr-1">
              {FISH.map((fish, index) => {
                const found = caughtIds.includes(fish.id);
                const isAmeacada = fish.origem.includes('ameaçada');
                const isInvasora = fish.origem.includes('invasora');

                return (
                  <div
                    key={fish.id}
                    onClick={() => found && openModal(fish)}
                    className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between min-h-[110px] ${
                      found
                        ? 'bg-[#f4faf6] border-[#a3d4b6] shadow-2xs cursor-pointer hover:border-[#164a2f]'
                        : 'bg-[#fafafa] border-[#e5e5e5] opacity-75 cursor-default'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-xs font-semibold text-[#0e2b1c] line-clamp-1">
                        {found ? fish.name : `Espécime #${index + 1}`}
                      </span>
                      {found ? (
                        <Check className="w-3.5 h-3.5 text-[#2c8a5b] shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-[#9ca3af] shrink-0" />
                      )}
                    </div>

                    <span className="text-[10px] font-mono italic text-[#7c8d83] block truncate">
                      {found ? fish.sci : 'Não capturado'}
                    </span>

                    <div className="w-full h-14 rounded-lg overflow-hidden my-1 bg-gradient-to-b from-[#f8faf9] to-[#edf4f0] border border-[#dbe4dd] flex items-center justify-center p-1">
                      {found && fish.photo ? (
                        <img
                          src={fish.photo}
                          alt={fish.name}
                          className="w-full h-full object-contain drop-shadow-2xs"
                        />
                      ) : (
                        <div className="h-6 w-12 flex items-center justify-center">
                          <FishVector fish={fish} isDiscovered={found} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {found ? (
                        <span
                          className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            isAmeacada
                              ? 'bg-[#f8e7e4] text-[#a13d34]'
                              : isInvasora
                              ? 'bg-[#faf1de] text-[#a3721f]'
                              : 'bg-[#e6f3ea] text-[#2c8a5b]'
                          }`}
                        >
                          {isAmeacada ? 'Ameaçada' : isInvasora ? 'Invasora' : 'Nativa'}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-[#9ca3af]">
                          Bloqueado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('catalogo')}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-[#f0f4ee] hover:bg-[#e4ece3] text-[#164a2f] transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-[#dbe4dd]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Abrir Catálogo Completo das Espécies</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ABA 2: CATÁLOGO DOS PEIXES PESCADOS COM FOTOS REAIS                  */}
      {/* ==================================================================== */}
      {activeTab === 'catalogo' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#dbe4dd] rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setCatalogFilter('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                  catalogFilter === 'todos'
                    ? 'bg-[#164a2f] text-white shadow-2xs'
                    : 'bg-[#f5f8f4] text-[#48584f] hover:bg-[#e9f0ea] border border-[#dbe4dd]'
                }`}
              >
                Todas as 14 Espécies
              </button>

              <button
                onClick={() => setCatalogFilter('capturados')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 flex items-center gap-1.5 ${
                  catalogFilter === 'capturados'
                    ? 'bg-[#2c8a5b] text-white shadow-2xs'
                    : 'bg-[#e6f3ea] text-[#164a2f] hover:bg-[#d8ecde]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Capturados ({caughtIds.length})</span>
              </button>

              <button
                onClick={() => setCatalogFilter('bloqueados')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 flex items-center gap-1.5 ${
                  catalogFilter === 'bloqueados'
                    ? 'bg-[#4b5563] text-white shadow-2xs'
                    : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ainda Não Pescados ({FISH.length - caughtIds.length})</span>
              </button>
            </div>

            <button
              onClick={() => setActiveTab('jogo')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-colors cursor-pointer flex items-center justify-center gap-1.5 self-start md:self-auto"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Voltar para Pesca</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFish.map((fish, index) => {
              const isCaught = caughtIds.includes(fish.id);
              const isAmeacada = fish.origem.includes('ameaçada');
              const isInvasora = fish.origem.includes('invasora');

              if (!isCaught) {
                return (
                  <div
                    key={fish.id}
                    className="bg-[#fafafa] border border-[#e5e5e5] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div className="p-4 sm:p-5 border-b border-[#e5e5e5] bg-[#f5f5f5]">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider bg-[#e5e7eb] text-[#4b5563] border border-[#d1d5db] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Não Capturado</span>
                        </span>

                        <span className="font-mono text-xs text-[#9ca3af]">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base text-[#6b7280]">
                        Espécime Não Descoberto
                      </h4>

                      <span className="font-mono text-xs text-[#9ca3af] block mt-0.5 italic">
                        Classificação científica oculta
                      </span>
                    </div>

                    <div className="py-8 px-6 bg-[#f3f4f6] border-b border-[#e5e5e5] flex flex-col items-center justify-center text-center min-h-[140px]">
                      <div className="w-12 h-12 rounded-xl bg-white border border-[#d1d5db] flex items-center justify-center mb-2 shadow-2xs">
                        <Lock className="w-6 h-6 text-[#9ca3af]" />
                      </div>
                      <span className="text-xs font-semibold text-[#4b5563]">
                        Fotografia Oculta
                      </span>
                      <span className="text-[11px] text-[#6b7280] mt-0.5">
                        Pesque este espécime para revelar sua foto
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-[#6b7280] leading-relaxed">
                        As curiosidades e características biológicas deste peixe estão protegidas. Capture-o na pesca para liberar sua foto e registro biológico.
                      </p>

                      <button
                        onClick={() => setActiveTab('jogo')}
                        className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FishIcon className="w-3.5 h-3.5 text-[#164a2f]" />
                        <span>Fisgar na Pesca</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={fish.id}
                  className="bg-white border border-[#a3d4b6] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-4 sm:p-5 border-b border-[#e9efe9] bg-[#fcfdfc]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isAmeacada
                            ? 'bg-[#fbe8e6] text-[#a13d34] border border-[#f5c6c2]'
                            : isInvasora
                            ? 'bg-[#fcf3e3] text-[#a3721f] border border-[#f5dcaf]'
                            : 'bg-[#e6f3ea] text-[#164a2f] border border-[#c4e3cf]'
                        }`}
                      >
                        {fish.origem}
                      </span>

                      <span className="font-mono text-xs text-[#2c8a5b] flex items-center gap-1 font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Catalogado</span>
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-[#0e2b1c] leading-tight">
                      {fish.name}
                    </h4>

                    <span className="font-mono italic text-xs text-[#125575] block mt-0.5">
                      {fish.sci}
                    </span>
                  </div>

                  {/* Fotografia Real da Espécie com Enquadramento Nítido e Proporcional */}
                  <div
                    onClick={() => openModal(fish)}
                    className="w-full aspect-[16/10] bg-gradient-to-b from-[#f8faf9] to-[#edf4f0] border-b border-[#e9efe9] overflow-hidden flex items-center justify-center p-3 relative group cursor-pointer"
                  >
                    {fish.photo ? (
                      <img
                        src={fish.photo}
                        alt={fish.name}
                        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-36 h-20">
                        <FishVector fish={fish} isDiscovered={true} />
                      </div>
                    )}

                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Ampliar Foto
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-semibold uppercase text-[#7c8d83] tracking-wider block mb-1.5">
                        Curiosidades Registradas:
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#48584f]">
                        {fish.curiosidades.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-[#164a2f] font-bold shrink-0">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-[#e9efe9] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[#52705e]">
                        Status: <strong>{fish.conservation}</strong>
                      </span>

                      <button
                        onClick={() => openModal(fish)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-colors cursor-pointer shrink-0"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de Ficha Científica */}
      {isModalOpen && selectedFish && (
        <div
          className="fixed inset-0 z-50 bg-[#071d12]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#dbe4dd]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Foto de Destaque no Topo do Modal */}
            <div className="relative aspect-[16/10] w-full bg-gradient-to-b from-[#0a1f14] to-[#040e09] overflow-hidden flex items-center justify-center p-4">
              {selectedFish.photo ? (
                <img
                  src={selectedFish.photo}
                  alt={selectedFish.name}
                  className="w-full h-full object-contain drop-shadow-xl z-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 z-10">
                  <FishVector fish={selectedFish} isDiscovered={true} />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#040e09] via-transparent to-transparent pointer-events-none z-15" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#34d399] font-bold block mb-1">
                  Espécime do Rio Pomba
                </span>
                <h3 className="text-2xl font-display font-semibold">
                  {selectedFish.name}
                </h3>
                <p className="text-xs font-mono italic text-[#cfe3d6]">
                  {selectedFish.sci}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e9efe9] pb-3 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      selectedFish.origem.includes('ameaçada')
                        ? 'bg-[#a13d34]'
                        : selectedFish.origem.includes('invasora')
                        ? 'bg-[#a3721f]'
                        : 'bg-[#2c8a5b]'
                    }`}
                  />
                  <span className="font-semibold text-[#0e2b1c]">
                    Origem: {selectedFish.origem}
                  </span>
                </div>
                <span className="text-[#6c8074]">
                  Status: <strong>{selectedFish.conservation}</strong>
                </span>
              </div>

              <div className="space-y-2.5">
                <strong className="text-[#0e2b1c] font-mono uppercase text-[11px] block tracking-wider">
                  Curiosidades e Características Registradas:
                </strong>

                <ul className="space-y-2 bg-[#f9fbf9] p-4 rounded-xl border border-[#dbe4dd]">
                  {selectedFish.curiosidades.map((c, i) => (
                    <li key={i} className="flex gap-2 text-xs sm:text-[13px] text-[#48584f] leading-relaxed">
                      <span className="text-[#164a2f] font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#164a2f] text-white hover:bg-[#0e2b1c] transition-colors cursor-pointer"
                >
                  Continuar Pescando
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setActiveTab('catalogo');
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-[#f0f4ee] border border-[#dbe4dd] text-[#164a2f] hover:bg-[#e4ece3] transition-colors cursor-pointer"
                >
                  Ver no Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
