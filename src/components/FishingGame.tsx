import React, { useState, useEffect, useRef } from 'react';
import { Fish } from '../types';
import { FISH } from '../data/riverData';
import { FishVector } from './FishVector';
import imgRiverWaterSurface from '../assets/images/river_water_surface_1790979632257.jpg';
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
// COMPONENTE COM FEEDBACK VISUAL DE CARREGAMENTO PARA FOTOS DE PEIXES
// ====================================================================
const FishImageWithLoader: React.FC<{
  src?: string;
  alt: string;
  className?: string;
  fallbackVector?: React.ReactNode;
}> = ({ src, alt, className = 'w-full h-full object-contain', fallbackVector }) => {
  const [loaded, setLoaded] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    setHasError(false);
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  if (!src || hasError) {
    return <>{fallbackVector || null}</>;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f0f4ee] z-10 space-y-1.5">
          <div className="w-5 h-5 border-2 border-[#164a2f] border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-[#164a2f] font-semibold">Carregando foto...</span>
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        className={`${className} transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setHasError(true);
        }}
      />
    </div>
  );
};

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

  // Pré-carregamento automático de todas as fotos dos peixes para abertura instantânea
  useEffect(() => {
    FISH.forEach((f) => {
      if (f.photo) {
        const img = new Image();
        img.src = f.photo;
      }
    });
  }, []);

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

  // Tempo dinâmico de janela de fisgada baseado na raridade e peso da espécie
  const getBiteWindowDuration = (fish: Fish): number => {
    if (fish.weight === 1) return 820; // Espécie Crítica/Rara (Surubim, Cascudo-leiteiro): 820ms
    if (fish.weight === 2) return 1050; // Ameaçada/Invasora (Pirapitinga, Tucunaré): 1050ms
    if (fish.weight === 3) return 1450; // Moderada (Piau, Jundiá, Sarapó, Curimatá): 1450ms
    return 1950; // Comum (Lambaris, Traíra, Cará): 1950ms
  };

  const getUpcomingFish = (): Fish => {
    const uncollected = FISH.filter((f) => !caughtIds.includes(f.id));
    if (uncollected.length > 0 && Math.random() < 0.7) {
      return uncollected[Math.floor(Math.random() * uncollected.length)];
    }
    const totalWeight = FISH.reduce((acc, f) => acc + f.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const f of FISH) {
      if (rand < f.weight) return f;
      rand -= f.weight;
    }
    return FISH[0];
  };

  // Refs de temporizadores e animação de tensão
  const timerRef = useRef<number | null>(null);
  const biteWindowRef = useRef<number | null>(null);
  const tensionIntervalRef = useRef<number | null>(null);
  const targetFishRef = useRef<Fish | null>(null);
  const fishingBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sfx.enabled = audioEnabled;
  }, [audioEnabled]);

  // Garante que o cenário e os botões de ação fiquem sempre visíveis no celular após fisgar
  useEffect(() => {
    if (phase === 'caught' || phase === 'biting') {
      if (fishingBoxRef.current && window.innerWidth < 640) {
        fishingBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [phase]);

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
    // Escolhe antecipadamente a espécie que está puxando a linha
    const incomingFish = getUpcomingFish();
    targetFishRef.current = incomingFish;

    const duration = getBiteWindowDuration(incomingFish);
    const isRare = incomingFish.weight <= 2;

    setPhase('biting');
    setMessage(
      isRare
        ? `PUXÃO RÁPIDO E PESADO! Peixe raro na linha, fisgue imediatamente!`
        : 'MORDIDA NA ISCA! Fisgue agora antes que o peixe escape!'
    );
    sfx.playBite();

    // Barra de tensão decrescente durante a janela de fisgada dinâmica
    setTensionPercent(100);
    const startTime = Date.now();

    if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
    tensionIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setTensionPercent(remaining);
      if (remaining <= 0) {
        if (tensionIntervalRef.current) clearInterval(tensionIntervalRef.current);
      }
    }, 20);

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

    const chosenFish = targetFishRef.current || getUpcomingFish();

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
          {/* Cenário de Água Clara e Realista do Rio Pomba */}
          <div className="lg:col-span-7 space-y-4">
            <div
              ref={fishingBoxRef}
              className="relative rounded-2xl overflow-hidden min-h-[460px] sm:min-h-[490px] h-auto bg-[#1a6452] shadow-lg border-2 border-[#52a382] select-none flex flex-col justify-between p-3 sm:p-5"
            >
              {/* Imagem de Fundo de Água Clara e Transparente com Luz Solar */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <img
                  src={imgRiverWaterSurface}
                  alt="Água do Rio Pomba"
                  className="w-full h-full object-cover object-center opacity-90 scale-105"
                />

                {/* Filtro de Profundidade Cristalina com Gradiente Claro de Rio */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e4b3c]/70 via-[#1e7862]/30 to-transparent" />

                {/* Linhas de Correnteza e Ondulações da Água com Refração Solar */}
                <svg
                  className="w-full h-full absolute inset-0 opacity-50 mix-blend-screen"
                  viewBox="0 0 600 480"
                  preserveAspectRatio="none"
                >
                  {/* Ondulações de Correnteza Iluminadas */}
                  <g stroke="#ffffff" strokeWidth="1.8" opacity="0.6" fill="none">
                    <path d="M-50 120 Q120 100 300 120 T650 120">
                      <animate attributeName="d" values="M-50 120 Q120 100 300 120 T650 120; M-50 125 Q120 105 300 125 T650 125; M-50 120 Q120 100 300 120 T650 120" dur="4s" repeatCount="indefinite" />
                    </path>
                    <path d="M-50 190 Q150 170 350 190 T650 190">
                      <animate attributeName="d" values="M-50 190 Q150 170 350 190 T650 190; M-50 195 Q150 175 350 195 T650 195; M-50 190 Q150 170 350 190 T650 190" dur="5s" repeatCount="indefinite" />
                    </path>
                    <path d="M-50 260 Q120 240 300 260 T650 260">
                      <animate attributeName="d" values="M-50 260 Q120 240 300 260 T650 260; M-50 265 Q120 245 300 265 T650 265; M-50 260 Q120 240 300 260 T650 260" dur="3.8s" repeatCount="indefinite" />
                    </path>
                    <path d="M-50 330 Q180 310 380 330 T650 330">
                      <animate attributeName="d" values="M-50 330 Q180 310 380 330 T650 330; M-50 335 Q180 315 380 335 T650 335; M-50 330 Q180 310 380 330 T650 330" dur="4.2s" repeatCount="indefinite" />
                    </path>
                    <path d="M-50 400 Q140 380 320 400 T650 400">
                      <animate attributeName="d" values="M-50 400 Q140 380 320 400 T650 400; M-50 405 Q140 385 320 405 T650 405; M-50 400 Q140 380 320 400 T650 400" dur="4.6s" repeatCount="indefinite" />
                    </path>
                  </g>

                  {/* ======================================================== */}
                  {/* SOMBRAS DE PEIXES NADANDO SOB A SUPERFÍCIE               */}
                  {/* ======================================================== */}
                  {/* Sombra 1: Peixe no fundo na fase de espera */}
                  {phase === 'waiting' && (
                    <g opacity="0.65">
                      <path
                        d="M160 300 C190 290, 235 290, 265 300 C245 312, 180 312, 160 300 Z"
                        fill="#05281e"
                      >
                        <animate
                          attributeName="transform"
                          type="translate"
                          values="-30,10; 50,-10; 120,5; -30,10"
                          dur="8s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <polygon points="155,295 142,286 146,310" fill="#05281e">
                        <animate
                          attributeName="transform"
                          type="translate"
                          values="-30,10; 50,-10; 120,5; -30,10"
                          dur="8s"
                          repeatCount="indefinite"
                        />
                      </polygon>
                    </g>
                  )}

                  {/* Sombra 2: Peixe se aproximando da boia quando mordisca */}
                  {phase === 'nibbling' && (
                    <g opacity="0.85" className="transition-all duration-500">
                      <ellipse cx="300" cy="275" rx="42" ry="16" fill="#041f17" transform="rotate(-10 300 275)">
                        <animate
                          attributeName="rx"
                          values="40; 45; 40"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </ellipse>
                      <polygon points="255,278 238,266 242,290" fill="#041f17" />
                    </g>
                  )}

                  {/* Sombra 3: Peixe atacando a isca na mordida */}
                  {phase === 'biting' && (
                    <g opacity="0.95" className="transition-all duration-300">
                      <ellipse cx="300" cy="265" rx="50" ry="20" fill="#02140e" transform="rotate(5 300 265)">
                        <animate
                          attributeName="cy"
                          values="272; 260; 272"
                          dur="0.35s"
                          repeatCount="indefinite"
                        />
                      </ellipse>
                      <polygon points="248,265 226,250 230,280" fill="#02140e" />
                    </g>
                  )}
                </svg>
              </div>

              {/* HUD Superior do Cenário */}
              <div className="relative z-10 flex items-center justify-between gap-3 text-white font-mono text-xs">
                <div className="bg-[#07241a]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#34d399]/40 flex items-center gap-2 shadow-sm">
                  <Waves className="w-3.5 h-3.5 text-[#34d399]" />
                  <span className="font-semibold text-[11px] sm:text-xs">Leito do Rio Pomba</span>
                </div>

                {streak > 1 && (
                  <div className="bg-[#eab308] text-[#422006] font-bold px-3 py-1 rounded-full text-xs shadow-md flex items-center gap-1.5 border border-yellow-200">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Sequência: {streak}x</span>
                  </div>
                )}
              </div>

              {/* CENTRO DO CENÁRIO: SUPERFÍCIE DO RIO, BOIA E AÇÃO */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 sm:py-4">
                {/* Janela de Tensão do Peixe quando está mordendo */}
                {phase === 'biting' && (
                  <div className="w-64 max-w-full mb-4 bg-[#0e2b1c]/95 p-3 rounded-2xl border-2 border-[#fbbf24] shadow-2xl backdrop-blur-md space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white">
                      <span className="flex items-center gap-1 text-[#fbbf24]">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>FISGUE AGORA!</span>
                      </span>
                      <span>{Math.ceil(tensionPercent)}%</span>
                    </div>
                    <div className="h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-[#fbbf24] via-[#f97316] to-[#ef4444] rounded-full transition-all duration-75"
                        style={{ width: `${tensionPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Estrutura da Linha e da Boia na Superfície do Rio */}
                <div className="relative flex flex-col items-center">
                  {/* Linha de Pesca Vertical Transparente */}
                  {phase !== 'idle' && phase !== 'caught' && (
                    <div className="absolute bottom-10 w-[1.5px] h-28 bg-white/70 shadow-xs origin-bottom" />
                  )}

                  {/* Ondas concêntricas na superfície da água */}
                  {(phase === 'waiting' || phase === 'nibbling' || phase === 'biting') && (
                    <div className="absolute -bottom-2 w-28 h-8 rounded-full border border-white/40 animate-ping pointer-events-none" />
                  )}

                  {phase === 'nibbling' && (
                    <div className="absolute -top-8 text-white font-mono text-xs bg-[#07241a]/95 border border-[#34d399] px-2.5 py-0.5 rounded-md shadow-lg">
                      Tuc! (Mordiscando...)
                    </div>
                  )}

                  {phase === 'biting' && (
                    <>
                      <div className="absolute -bottom-3 w-36 h-12 rounded-full bg-[#fbbf24]/30 animate-ping pointer-events-none" />
                      <div className="absolute -top-11 bg-[#dc2626] text-white text-xs font-mono font-bold px-3.5 py-1 rounded-full shadow-2xl flex items-center gap-1.5 border-2 border-white">
                        <Zap className="w-4 h-4 fill-current" />
                        <span>PUXE A LINHA!</span>
                      </div>
                    </>
                  )}

                  {/* Boia Estilizada Pousada na Superfície do Rio */}
                  {phase !== 'idle' && phase !== 'caught' && (
                    <div
                      className={`relative transition-all duration-150 cursor-pointer ${
                        phase === 'nibbling'
                          ? 'translate-y-2 rotate-12 scale-100'
                          : phase === 'biting'
                          ? 'translate-y-8 scale-90 rotate-20 opacity-90'
                          : phase === 'waiting'
                          ? 'hover:scale-105'
                          : ''
                      }`}
                      onClick={phase === 'biting' ? handleHook : undefined}
                      title={phase === 'biting' ? 'Clique para fisgar!' : 'Boia na água'}
                    >
                      {/* Boia clássica vetorizada e nítida */}
                      <svg width="44" height="54" viewBox="0 0 44 54" className="drop-shadow-lg">
                        {/* Haste superior da boia onde a linha se prende */}
                        <line x1="22" y1="2" x2="22" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        
                        {/* Topo vermelho da boia */}
                        <path d="M10 24 C10 14, 34 14, 34 24 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                        
                        {/* Faixa preta central */}
                        <rect x="9.5" y="23" width="25" height="3" fill="#1f2937" rx="0.5" />
                        
                        {/* Base branca da boia imersa na água */}
                        <path d="M10 26 C10 36, 34 36, 34 26 Z" fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />
                        
                        {/* Haste inferior subaquática com chumbada */}
                        <line x1="22" y1="36" x2="22" y2="48" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="22" cy="48" r="2.5" fill="#4b5563" />
                      </svg>

                      {/* Ondulação de contato com a água */}
                      <div className="w-12 h-2.5 bg-[#a3e6cf]/40 rounded-full blur-2xs -mt-1 mx-auto" />
                    </div>
                  )}

                  {/* Peixe Fisgado - Exibição Firme e Estável (SEM ANIMAÇÃO DE PULAR) */}
                  {phase === 'caught' && recentFish && (
                    <div
                      onClick={handleCast}
                      className="relative z-30 flex flex-col items-center cursor-pointer group touch-manipulation my-auto py-1"
                      title="Clique para lançar nova linha"
                    >
                      <div className="w-48 sm:w-56 bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-2xl border-2 border-[#164a2f] flex flex-col items-center justify-center transition-transform group-hover:scale-102">
                        <div className="w-full h-20 sm:h-28 rounded-xl overflow-hidden mb-1.5 sm:mb-2 bg-gradient-to-b from-[#f8faf9] to-[#edf4f0] border border-[#dbe4dd] flex items-center justify-center p-2">
                          <FishImageWithLoader
                            src={recentFish.photo}
                            alt={recentFish.name}
                            className="w-full h-full object-contain drop-shadow-md"
                            fallbackVector={<FishVector fish={recentFish} isDiscovered={true} />}
                          />
                        </div>
                        <span className="font-display font-bold text-xs sm:text-sm text-[#0e2b1c] truncate max-w-full text-center">
                          {recentFish.name}
                        </span>
                        <span className="font-mono italic text-[10px] sm:text-[11px] text-[#125575]">
                          {recentFish.sci}
                        </span>
                      </div>
                      <div className="mt-1.5 text-white font-mono text-[10px] sm:text-xs bg-[#164a2f] px-3 py-1 rounded-full shadow-lg border border-[#34d399] flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
                        <span>Captura Registrada!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROLES INFERIORES */}
              <div className="relative z-20 space-y-2 sm:space-y-3 mt-2 sm:mt-auto shrink-0 w-full">
                <div className="bg-white/95 backdrop-blur-md text-[#0e2b1c] px-3.5 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-sm font-mono text-center shadow-lg border border-[#c4e3cf] max-w-lg mx-auto leading-tight">
                  {message}
                </div>

                <div className="flex items-center justify-center gap-3 w-full">
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
                      className="w-full sm:w-auto py-3.5 px-8 rounded-xl font-display font-bold text-xs sm:text-sm bg-[#34d399] text-[#05100a] hover:bg-[#10b981] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2 hover:scale-102 active:scale-98 touch-manipulation border-2 border-white/40 ring-4 ring-[#164a2f]/20"
                    >
                      <Waves className="w-4 h-4 text-[#05100a]" />
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
                        <FishImageWithLoader
                          src={fish.photo}
                          alt={fish.name}
                          className="w-full h-full object-contain drop-shadow-2xs"
                          fallbackVector={<FishVector fish={fish} isDiscovered={found} />}
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
                    <FishImageWithLoader
                      src={fish.photo}
                      alt={fish.name}
                      className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      fallbackVector={<FishVector fish={fish} isDiscovered={true} />}
                    />

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
          className="fixed inset-0 z-50 bg-[#071d12]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-[#dbe4dd] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topo do Modal: Título e Identificação */}
            <div className="p-4 sm:p-5 border-b border-[#e9efe9] bg-[#fcfdfc] flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      selectedFish.origem.includes('ameaçada')
                        ? 'bg-[#fbe8e6] text-[#a13d34] border border-[#f5c6c2]'
                        : selectedFish.origem.includes('invasora')
                        ? 'bg-[#fcf3e3] text-[#a3721f] border border-[#f5dcaf]'
                        : 'bg-[#e6f3ea] text-[#164a2f] border border-[#c4e3cf]'
                    }`}
                  >
                    {selectedFish.origem}
                  </span>
                  <span className="text-[11px] font-mono text-[#52705e]">
                    Rio Pomba
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0e2b1c] leading-tight">
                  {selectedFish.name}
                </h3>
                <p className="text-xs font-mono italic text-[#125575] mt-0.5">
                  {selectedFish.sci}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#52705e] hover:text-[#0e2b1c] hover:bg-[#f0f4ee] transition-colors cursor-pointer shrink-0"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Foto Realista Dedicada da Espécie (Livre de Qualquer Texto Sobreposto) */}
              <div className="w-full h-48 sm:h-56 rounded-xl bg-gradient-to-b from-[#f8faf9] to-[#edf4f0] border border-[#dbe4dd] overflow-hidden flex items-center justify-center p-3 shadow-2xs">
                <FishImageWithLoader
                  src={selectedFish.photo}
                  alt={selectedFish.name}
                  className="w-full h-full object-contain drop-shadow-md"
                  fallbackVector={
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <FishVector fish={selectedFish} isDiscovered={true} />
                    </div>
                  }
                />
              </div>

              {/* Status de Conservação e Dados Biológicos */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#f6faf7] border border-[#dbe4dd] px-3.5 py-2.5 rounded-xl font-mono text-xs">
                <span className="text-[#52705e]">
                  Status de Conservação:
                </span>
                <strong className="text-[#0e2b1c]">
                  {selectedFish.conservation}
                </strong>
              </div>

              {/* Curiosidades e Características */}
              <div className="space-y-2">
                <strong className="text-[#0e2b1c] font-mono uppercase text-[11px] block tracking-wider">
                  Curiosidades e Características Registradas:
                </strong>

                <ul className="space-y-2 bg-[#fbfdfb] p-3.5 sm:p-4 rounded-xl border border-[#dbe4dd]">
                  {selectedFish.curiosidades.map((c, i) => (
                    <li key={i} className="flex gap-2 text-xs sm:text-[13px] text-[#48584f] leading-relaxed">
                      <span className="text-[#164a2f] font-bold shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botões de Ação */}
              <div className="pt-2 flex gap-2.5">
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
