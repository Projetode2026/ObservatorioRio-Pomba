import React, { useState, useEffect, useRef } from 'react';
import { PointId } from '../types';
import { POINTS } from '../data/riverData';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveSatelliteMapProps {
  selectedPointId?: PointId;
  onSelectPoint?: (pointId: PointId) => void;
  className?: string;
  zoomOnDesktop?: boolean;
}

const MAP_IMAGE_URL = "https://i.ibb.co/p6MTqPZt/mapa.jpg";

// Coordenadas calibradas dos pontos em relação à imagem do mapa mantidas no código para orientação espacial
export const SATELLITE_COORDS: Record<PointId, { x: number; y: number }> = {
  p1: { x: 14.32, y: 50.80 },
  p2: { x: 25.51, y: 62.70 },
  p3: { x: 50.55, y: 48.90 },
  p4: { x: 71.28, y: 51.10 },
  p5: { x: 80.81, y: 24.80 },
};

const POINT_IDS: PointId[] = ['p1', 'p2', 'p3', 'p4', 'p5'];

export const InteractiveSatelliteMap: React.FC<InteractiveSatelliteMapProps> = ({
  selectedPointId,
  onSelectPoint,
  className = '',
  zoomOnDesktop = false,
}) => {
  const [internalPointId, setInternalPointId] = useState<PointId>('p1');
  // Inicia sem zoom no PC para mostrar a visão completa. Ao clicar em qualquer ponto, o zoom é ativado suavemente.
  const [desktopZoomActive, setDesktopZoomActive] = useState<boolean>(false);
  const isFirstRender = useRef(true);

  // Mantém sincronizado se a propriedade externa mudar
  useEffect(() => {
    if (selectedPointId) {
      setInternalPointId(selectedPointId);
      if (!isFirstRender.current) {
        setDesktopZoomActive(true);
      }
    }
  }, [selectedPointId]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  const activeId = selectedPointId || internalPointId;
  const currentPoint = POINTS.find((p) => p.id === activeId) || POINTS[0];
  const currentCoords = SATELLITE_COORDS[activeId] || SATELLITE_COORDS.p1;
  const currentIndex = POINT_IDS.indexOf(activeId);

  const handleSelect = (id: PointId) => {
    setInternalPointId(id);
    setDesktopZoomActive(true);
    if (onSelectPoint) {
      onSelectPoint(id);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + POINT_IDS.length) % POINT_IDS.length;
    handleSelect(POINT_IDS[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % POINT_IDS.length;
    handleSelect(POINT_IDS[nextIndex]);
  };

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {/* ============================================================ */}
      {/* 1. VISÃO MOBILE (< sm): FOCO DINÂMICO COM ZOOM 3.6X          */}
      {/* ============================================================ */}
      <div className="block sm:hidden space-y-2">
        {/* Barra Superior de Navegação entre Pontos (Mobile) */}
        <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer touch-manipulation active:scale-90 transition-transform"
            aria-label="Ponto anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center px-1">
            <span className="text-[10px] font-mono font-bold text-[#125575] uppercase tracking-wider block">
              Ponto {currentPoint.order} de 5
            </span>
            <span className="text-xs font-display font-semibold text-neutral-900 truncate max-w-[200px] block">
              {currentPoint.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer touch-manipulation active:scale-90 transition-transform"
            aria-label="Próximo ponto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Janela Vertical com Enquadramento Total Centrado no Ponto (Fundo Branco Limpo) */}
        <div
          onClick={handleNext}
          className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm select-none cursor-pointer"
        >
          {/* Container escalado e centralizado matematicamente nas coordenadas do ponto com zoom ajustado */}
          <div
            className="absolute top-1/2 left-1/2 w-full transition-all duration-500 ease-out"
            style={{
              transform: `translate(-${currentCoords.x}%, -${currentCoords.y}%) scale(${activeId === 'p2' ? 3.55 : 4.15})`,
              transformOrigin: `${currentCoords.x}% ${currentCoords.y}%`,
            }}
          >
            <div className="relative w-full block">
              <img
                src={MAP_IMAGE_URL}
                alt="mapa"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-auto block pointer-events-none"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('mapa.jpeg')) {
                    target.src = '/mapa.jpeg';
                  }
                }}
              />
            </div>
          </div>

          {/* Dica e Indicadores Inferiores de Navegação */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-30">
            {/* Indicador de Bolinhas */}
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-xs px-2.5 py-1.5 rounded-full border border-white/20 shadow-sm">
              {POINT_IDS.map((id) => (
                <div
                  key={id}
                  className={`rounded-full transition-all duration-300 ${
                    activeId === id ? 'w-3.5 h-1.5 bg-emerald-400' : 'w-1.5 h-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>

            <span className="text-[10px] font-mono text-white bg-black/70 backdrop-blur-xs px-2.5 py-1.5 rounded-md border border-white/20 shadow-sm font-semibold">
              Toque para avançar
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. VISÃO DESKTOP (>= sm)                                     */}
      {/* ============================================================ */}
      <div className="hidden sm:block">
        {zoomOnDesktop ? (
          /* ======================================================== */
          /* MODO ZOOM NO PC (EXCLUSIVO NA ABA MAPA)                  */
          /* ======================================================== */
          <div className="space-y-2">
            {/* Barra de Controle de Zoom e Navegação no PC */}
            <div className="flex items-center justify-between bg-white border border-neutral-200 rounded-xl px-3 py-2 shadow-2xs text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#125575] bg-neutral-100 px-2.5 py-0.5 rounded-md border border-neutral-200">
                  Ponto {currentPoint.order} / 5
                </span>
                <span className="font-display font-semibold text-neutral-900">
                  {currentPoint.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Botão de Alternar Modo Zoom / Visão Geral no PC */}
                <button
                  type="button"
                  onClick={() => setDesktopZoomActive(!desktopZoomActive)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 border ${
                    desktopZoomActive
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs hover:bg-neutral-800'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                  }`}
                  title={desktopZoomActive ? 'Ver mapa completo (100%)' : 'Dar zoom no ponto selecionado'}
                >
                  {desktopZoomActive ? (
                    <>
                      <ZoomOut className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ver Mapa Completo (100%)</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Focar com Zoom</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Container do Mapa no PC: Bordas Neutras com Fundo Branco */}
            <div
              onClick={() => {
                if (!desktopZoomActive) {
                  setDesktopZoomActive(true);
                } else {
                  handleNext({ stopPropagation: () => {} } as any);
                }
              }}
              className="relative w-full h-[380px] rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm select-none cursor-pointer"
            >
              <div
                className="absolute top-1/2 left-1/2 w-full transition-all duration-700 ease-out"
                style={
                  desktopZoomActive
                    ? {
                        transform: `translate(-${currentCoords.x}%, -${currentCoords.y}%) scale(${activeId === 'p2' ? 2.85 : 3.45})`,
                        transformOrigin: `${currentCoords.x}% ${currentCoords.y}%`,
                      }
                    : {
                        transform: 'translate(-50%, -50%) scale(1)',
                        transformOrigin: 'center center',
                      }
                }
              >
                <div className="relative w-full block">
                  <img
                    src={MAP_IMAGE_URL}
                    alt="mapa"
                    loading="eager"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block pointer-events-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('mapa.jpeg')) {
                        target.src = '/mapa.jpeg';
                      }
                    }}
                  />

                  {/* Zonas de clique sobre cada ponto quando o mapa estiver sem zoom */}
                  {!desktopZoomActive &&
                    POINTS.map((p) => {
                      const pos = SATELLITE_COORDS[p.id];
                      if (!pos) return null;

                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(p.id);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 touch-manipulation w-14 h-14 p-0 bg-transparent border-0 outline-none opacity-0"
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                          }}
                          aria-label={`Ponto ${p.order}: ${p.name}`}
                        />
                      );
                    })}
                </div>
              </div>

              {/* Botões de Navegação Anterior / Próximo no PC (visíveis quando com zoom) */}
              {desktopZoomActive && (
                <>
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs border border-white/20 shadow-md cursor-pointer transition-all hover:scale-105"
                      aria-label="Ponto anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs border border-white/20 shadow-md cursor-pointer transition-all hover:scale-105"
                      aria-label="Próximo ponto"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {/* Legenda Discreta no Canto Inferior */}
              <div className="absolute bottom-2.5 right-3 bg-black/65 backdrop-blur-xs text-white text-[11px] font-mono px-3 py-1 rounded-md border border-white/15 pointer-events-none">
                {desktopZoomActive
                  ? 'Foco no Ponto Selecionado · Clique para avançar'
                  : 'Clique em qualquer ponto ou botão abaixo para dar zoom'}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* MODO PANORÂMICO COMPLETO NO PC (EX: TELA INICIAL)        */
          /* ======================================================== */
          <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm select-none">
            <div className="relative w-full block">
              <img
                src={MAP_IMAGE_URL}
                alt="mapa"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-auto block pointer-events-none"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('mapa.jpeg')) {
                    target.src = '/mapa.jpeg';
                  }
                }}
              />

              {/* Zonas de clique invisíveis mantidas sobre as coordenadas para manter orientação e seleção funcional */}
              {POINTS.map((p) => {
                const pos = SATELLITE_COORDS[p.id];
                if (!pos) return null;

                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(p.id);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 touch-manipulation w-12 h-12 p-0 bg-transparent border-0 outline-none opacity-0"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    aria-label={`Ponto ${p.order}: ${p.name}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
