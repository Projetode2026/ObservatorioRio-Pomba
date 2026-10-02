import React, { useState, useRef, useEffect, useId, useCallback } from 'react';

// ====================================================================
// COMPONENTE PARA TÍTULOS COM ONDA LÍQUIDA ARRASTADA PELO MOUSE (WAKE)
// Enquanto o usuário passa o mouse, ele arrasta uma onda realista e fluida.
// ====================================================================
interface WaterRippleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

interface WakeParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export const WaterRipple: React.FC<WaterRippleProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const rawId = useId();
  const filterId = `water-filter-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<WakeParticle[]>([]);

  // Refs para loop de animação contínuo (Lerp)
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, lastDropX: 0, lastDropY: 0 });
  const scaleRef = useRef({ current: 0, target: 0 });
  const lastTimeRef = useRef(0);

  // Inicia o motor de animação fluida baseada em arrasto
  const ensureLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setIsActive(true);

    const offsetEl = document.getElementById(`${filterId}-offset`) as unknown as SVGFEOffsetElement | null;
    const dispEl = document.getElementById(`${filterId}-disp`) as unknown as SVGFEDisplacementMapElement | null;
    const cursorGlowEl = document.getElementById(`${filterId}-glow`);

    const updatePhysics = (now: number) => {
      const dt = Math.min(32, now - (lastTimeRef.current || now));
      lastTimeRef.current = now;

      // Interpolação suave (Lerp) da posição da onda seguindo o cursor
      const lerpFactor = Math.min(1, dt * 0.012); // ~0.15 a 60fps
      const m = mousePosRef.current;
      m.x += (m.targetX - m.x) * lerpFactor;
      m.y += (m.targetY - m.y) * lerpFactor;

      // Interpolação suave da intensidade da onda
      const s = scaleRef.current;
      s.current += (s.target - s.current) * (dt * 0.008);

      // Decaimento suave quando o mouse para de se mover
      s.target *= 0.96;

      // Atualiza o filtro SVG por deslocamento contínuo (zero trepidação)
      if (dispEl) {
        dispEl.setAttribute('scale', s.current.toFixed(2));
      }
      if (offsetEl) {
        // Deslocamento de arrasto com ondulação transversal
        const dragDx = m.x * 0.18;
        const dragDy = m.y * 0.18 + Math.sin(now * 0.004) * (s.current * 0.8);
        offsetEl.setAttribute('dx', dragDx.toFixed(1));
        offsetEl.setAttribute('dy', dragDy.toFixed(1));
      }

      // Atualiza a crista de água brilhante que acompanha o cursor
      if (cursorGlowEl) {
        cursorGlowEl.style.transform = `translate3d(${m.x}px, ${m.y}px, 0) translate(-50%, -50%)`;
        cursorGlowEl.style.opacity = Math.min(0.7, (s.current / 4.8) * 0.65).toFixed(2);
      }

      // Continua o loop enquanto houver movimento ou escala perceptível
      if (s.current > 0.08 || s.target > 0.1) {
        animFrameRef.current = requestAnimationFrame(updatePhysics);
      } else {
        if (dispEl) dispEl.setAttribute('scale', '0');
        if (cursorGlowEl) cursorGlowEl.style.opacity = '0';
        isRunningRef.current = false;
        setIsActive(false);
      }
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [filterId]);

  // Ao arrastar o mouse sobre o título:
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const m = mousePosRef.current;
    if (!isRunningRef.current) {
      m.x = x;
      m.y = y;
    }
    m.targetX = x;
    m.targetY = y;

    // Calcula velocidade do arrasto para aumentar naturalmente a crista da onda
    const dx = x - m.lastDropX;
    const dy = y - m.lastDropY;
    const dist = Math.hypot(dx, dy);

    // Intensidade da onda proporcional ao arrasto (máximo suave de 4.8px)
    scaleRef.current.target = Math.min(4.8, 2.2 + dist * 0.12);

    // Se o mouse moveu uma distância mínima, solta uma ondulação no rastro (wake)
    if (dist > 18) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const newParticleId = Date.now() + Math.random();

      setParticles((prev) => [
        ...prev.slice(-6), // Mantém no máximo 7 ondas ativas no rastro para performance extrema
        { id: newParticleId, x, y, angle },
      ]);

      m.lastDropX = x;
      m.lastDropY = y;

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticleId));
      }, 700);
    }

    ensureLoop();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePosRef.current.x = x;
    mousePosRef.current.y = y;
    mousePosRef.current.targetX = x;
    mousePosRef.current.targetY = y;
    mousePosRef.current.lastDropX = x;
    mousePosRef.current.lastDropY = y;

    scaleRef.current.target = 3.2;
    ensureLoop();
  };

  const handleMouseLeave = () => {
    // Ao sair, a onda desacelera suavemente até desaparecer
    scaleRef.current.target = 0;
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Filtro SVG individual calibrado especificamente para este título */}
      <svg className="absolute w-0 h-0 pointer-events-none select-none" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.014 0.024"
              numOctaves="1"
              seed="11"
              result="waterNoise"
            />
            <feOffset
              id={`${filterId}-offset`}
              in="waterNoise"
              dx="0"
              dy="0"
              result="movedNoise"
            />
            <feDisplacementMap
              id={`${filterId}-disp`}
              in="SourceGraphic"
              in2="movedNoise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Component
        ref={containerRef as any}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative inline-block overflow-hidden cursor-default select-none ${className}`}
        style={{
          filter: isActive ? `url(#${filterId})` : 'none',
          willChange: isActive ? 'filter' : 'auto',
        }}
      >
        {children}

        {/* Crista de água luminosa que é arrastada diretamente pelo cursor */}
        <span
          id={`${filterId}-glow`}
          className="pointer-events-none absolute w-36 h-36 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200"
          style={{
            background: 'radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, rgba(52, 211, 153, 0.18) 45%, transparent 70%)',
            left: 0,
            top: 0,
          }}
        />

        {/* Ondulações concêntricas deixadas no rastro do movimento (Wake Trail) */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="pointer-events-none absolute rounded-full animate-fluid-wake-ring"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
            }}
          />
        ))}
      </Component>
    </>
  );
};

// Exportador opcional caso ainda seja importado em algum arquivo
export const WaterRippleFilter: React.FC = () => null;
