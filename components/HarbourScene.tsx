'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Star { x: number; y: number; size: number; delay: number }

type FireworkStyle = 'standard' | 'ring' | 'chrysanthemum' | 'willow' | 'crossette';

interface Particle {
  angle: number;
  speed: number;
  color: string;
  size: number;
  trail: number;
  hasSub: boolean;
  subAngle: number;
  subSpeed: number;
  subColor: string;
}

interface Firework {
  id: number;
  x: number;
  burstY: number;       // fixed burst height (% from top)
  style: FireworkStyle;
  particles: Particle[];
  coreColor: string;    // brightest colour – used for glow & rocket trail
  startTime: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FIREWORK_COLORS: [string, string, string][] = [
  ['#ff4466', '#ff6688', '#ffaacc'],
  ['#ffaa00', '#ffcc44', '#ffee88'],
  ['#44ccff', '#88eeff', '#ccffff'],
  ['#aa44ff', '#cc88ff', '#eeccff'],
  ['#44ff88', '#88ffbb', '#ccffdd'],
  ['#ff6644', '#ff9966', '#ffccaa'],
  ['#ff44aa', '#ff88cc', '#ffccee'],
  ['#fff176', '#ffe082', '#ffcc80'],
  ['#ef5350', '#e57373', '#ffcdd2'],
  ['#26c6da', '#4dd0e1', '#b2ebf2'],
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeParticles(style: FireworkStyle): Particle[] {
  const colorSet = pick(FIREWORK_COLORS);
  const counts: Record<FireworkStyle, number> = {
    standard: 40 + Math.floor(Math.random() * 20),
    ring: 36,
    chrysanthemum: 60 + Math.floor(Math.random() * 24),
    willow: 48 + Math.floor(Math.random() * 16),
    crossette: 44 + Math.floor(Math.random() * 16),
  };
  const count = counts[style];

  return Array.from({ length: count }, (_, i) => {
    let angle: number;
    if (style === 'ring') {
      angle = (i / count) * Math.PI * 2;
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    const speed = style === 'willow'
      ? 0.4 + Math.random() * 0.7
      : style === 'chrysanthemum'
        ? 0.5 + Math.random() * 0.9
        : 0.6 + Math.random() * 1.4;

    const hasSub = style === 'crossette' && Math.random() < 0.45;

    return {
      angle,
      speed,
      color: pick(colorSet),
      size: style === 'chrysanthemum' ? 1.2 + Math.random() * 1.0
          : style === 'ring'          ? 1.8 + Math.random() * 0.6
          :                             1.2 + Math.random() * 1.2,
      trail: style === 'willow' ? 1.2 + Math.random() * 0.8 : 0.4 + Math.random() * 0.6,
      hasSub,
      subAngle: angle + (Math.random() - 0.5) * 1.2,
      subSpeed: 0.3 + Math.random() * 0.5,
      subColor: colorSet[2],
    };
  });
}

// ─── Stars (static, generated once) ─────────────────────────────────────────
function useStars(count = 120) {
  const stars = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 60, // Stars mostly in upper 60%
      size: 0.6 + Math.random() * 1.8,
      delay: Math.random() * 4,
    })),
  [count]);
  return stars;
}

// ─── Fireworks Engine (canvas-based for smooth performance) ─────────────────
function FireworksCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fireworksRef = useRef<Firework[]>([]);
  const lastLaunchRef = useRef<number>(0);
  const idRef = useRef(0);

  const STYLES: FireworkStyle[] = ['standard', 'ring', 'chrysanthemum', 'willow', 'crossette'];

  const launch = useCallback(() => {
    const style = pick(STYLES);
    const colorSet = pick(FIREWORK_COLORS);
    const fw: Firework = {
      id: idRef.current++,
      x: 8 + Math.random() * 84,
      burstY: 12 + Math.random() * 22,   // 12 %–34 % from top
      style,
      particles: makeParticles(style),
      coreColor: colorSet[0],
      startTime: performance.now(),
    };
    fireworksRef.current.push(fw);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const RISE_DUR  = 900;   // rocket travel time (ms)
    const BURST_DUR = 2200;  // particle expansion + fade (ms)
    const WATER_Y_PCT = 82;  // approximate water-line for reflection

    // helper: parse hex → [r,g,b]
    function hexToRgb(hex: string): [number,number,number] {
      const n = parseInt(hex.replace('#',''), 16);
      return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
    }

    function draw() {
      const now  = performance.now();
      const w    = canvas!.offsetWidth;
      const h    = canvas!.offsetHeight;

      ctx!.clearRect(0, 0, w, h);

      // ── Launch logic: 1-2 rockets every 350-600 ms ──
      const interval = 350 + Math.random() * 250;
      if (now - lastLaunchRef.current > interval) {
        launch();
        if (Math.random() < 0.35) launch(); // occasional double-launch
        lastLaunchRef.current = now;
      }

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        const elapsed = now - fw.startTime;

        // ── RISE phase ──────────────────────────────────────────────
        if (elapsed < RISE_DUR) {
          const t   = elapsed / RISE_DUR;
          const startY = 100;
          const endY   = fw.burstY;
          // ease-out cubic
          const curY = startY + (endY - startY) * (1 - Math.pow(1 - t, 3));
          const cx   = fw.x * w / 100;
          const cy   = curY * h / 100;

          // rocket trail (fading line behind the dot)
          const trailLen = 6 * (1 - t) + 2;
          const [r,g,b] = hexToRgb(fw.coreColor);
          const grad = ctx!.createLinearGradient(cx, cy, cx, cy + trailLen * h / 100);
          grad.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx!.beginPath();
          ctx!.moveTo(cx, cy);
          ctx!.lineTo(cx, cy + trailLen * h / 100);
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 2.5;
          ctx!.stroke();

          // bright dot at head
          ctx!.beginPath();
          ctx!.arc(cx, cy, 2.2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255,240,200,0.95)`;
          ctx!.fill();
          return true;
        }

        // ── BURST phase ─────────────────────────────────────────────
        if (elapsed < RISE_DUR + BURST_DUR) {
          const t  = (elapsed - RISE_DUR) / BURST_DUR;
          const cx = fw.x  * w / 100;
          const cy = fw.burstY * h / 100;

          // central flash (only first 15 % of burst)
          if (t < 0.15) {
            const flashAlpha = 1 - t / 0.15;
            const [r,g,b] = hexToRgb(fw.coreColor);
            ctx!.beginPath();
            ctx!.arc(cx, cy, 8 * (1 - t / 0.15), 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${r},${g},${b},${flashAlpha * 0.7})`;
            ctx!.fill();
          }

          // ── draw each particle ──
          fw.particles.forEach((p) => {
            const dist = p.speed * t * 110;
            const px   = cx + Math.cos(p.angle) * dist;
            // gravity curve differs by style
            const gravityK = fw.style === 'willow' ? 55 : fw.style === 'chrysanthemum' ? 18 : 28;
            const py = cy + Math.sin(p.angle) * dist + gravityK * t * t;

            // alpha: willow fades slower
            const fadeRate = fw.style === 'willow' ? 0.85 : fw.style === 'chrysanthemum' ? 1.1 : 1.0;
            const alpha = Math.max(0, 1 - t * fadeRate);
            if (alpha <= 0) return;

            const [r,g,b] = hexToRgb(p.color);

            // trailing streak for willow / standard
            if (fw.style === 'willow' || p.trail > 0.7) {
              const trailT  = Math.max(0, t - 0.06);
              const trailDist = p.speed * trailT * 110;
              const tpx = cx + Math.cos(p.angle) * trailDist;
              const tpy = cy + Math.sin(p.angle) * trailDist + gravityK * trailT * trailT;
              ctx!.beginPath();
              ctx!.moveTo(tpx, tpy);
              ctx!.lineTo(px, py);
              ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.4})`;
              ctx!.lineWidth = p.size * 0.6;
              ctx!.stroke();
            }

            // main particle dot
            ctx!.beginPath();
            ctx!.arc(px, py, p.size, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx!.fill();

            // soft glow around brighter particles
            if (alpha > 0.4 && p.size > 1.4) {
              ctx!.beginPath();
              ctx!.arc(px, py, p.size + 2, 0, Math.PI * 2);
              ctx!.fillStyle = `rgba(${r},${g},${b},${alpha * 0.18})`;
              ctx!.fill();
            }

            // ── crossette secondary burst ──
            if (p.hasSub && t > 0.4) {
              const st   = (t - 0.4) / 0.6;       // 0→1 over second half
              const sDist = p.subSpeed * st * 60;
              const spx  = px + Math.cos(p.subAngle) * sDist;
              const spy  = py + Math.sin(p.subAngle) * sDist + 12 * st * st;
              const sAlpha = Math.max(0, 1 - st * 1.3);
              const [sr,sg,sb] = hexToRgb(p.subColor);
              ctx!.beginPath();
              ctx!.arc(spx, spy, 1.0, 0, Math.PI * 2);
              ctx!.fillStyle = `rgba(${sr},${sg},${sb},${sAlpha})`;
              ctx!.fill();
            }

            // ── water reflection ──────────────────────────────
            // Mirror particle below WATER_Y_PCT if it is above it
            const waterPx = WATER_Y_PCT * h / 100;
            if (py < waterPx && alpha > 0.15) {
              const reflY   = waterPx + (waterPx - py) * 0.25; // compressed mirror
              const reflAlpha = alpha * 0.12 * (1 - (reflY - waterPx) / (h * 0.15));
              if (reflAlpha > 0) {
                ctx!.beginPath();
                ctx!.arc(px, reflY, p.size * 0.7, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${r},${g},${b},${reflAlpha})`;
                ctx!.fill();
              }
            }
          });
          return true;
        }
        return false; // expired → remove
      });

      animRef.current = requestAnimationFrame(draw);
    }

    // seed a few fireworks immediately so the sky isn't empty on mount
    launch(); launch(); launch();
    lastLaunchRef.current = performance.now();
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, launch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HarbourScene({ onNext }: { onNext: () => void }) {
  const stars = useStars(150);
  const [showBlessing, setShowBlessing] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowBlessing(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // ── Building Data (Simplified for silhouette + dense lights layer) ──

  // Layer 1: Background Silhouettes (Darker, less detailed)
  const farBuildings = useMemo(() => [
    { l: 2, w: 6, h: 50 }, { l: 10, w: 5, h: 45 }, { l: 18, w: 7, h: 55 },
    { l: 28, w: 6, h: 48 }, { l: 38, w: 8, h: 52 }, { l: 50, w: 5, h: 46 },
    { l: 58, w: 7, h: 58 }, { l: 68, w: 6, h: 50 }, { l: 78, w: 5, h: 44 },
    { l: 86, w: 7, h: 54 }, { l: 95, w: 4, h: 48 },
  ], []);

  // Layer 2: Main Lit Buildings (The "image_0.png" look)
  const mainBuildings = useMemo(() => [
    { l: 0, w: 5, h: 65 }, { l: 6, w: 4, h: 75 }, { l: 11, w: 6, h: 60 },
    { l: 18, w: 5, h: 80 }, { l: 24, w: 7, h: 68 }, { l: 32, w: 4, h: 72 },
    { l: 37, w: 6, h: 58 }, { l: 44, w: 5, h: 85 }, { l: 50, w: 6, h: 70 },
    { l: 57, w: 4, h: 78 }, { l: 62, w: 7, h: 64 }, { l: 70, w: 5, h: 74 },
    { l: 76, w: 6, h: 62 }, { l: 83, w: 5, h: 82 }, { l: 89, w: 6, h: 68 },
    { l: 96, w: 4, h: 60 },
  ], []);


  // Helper to generate dense windows for a building
  const renderWindows = (bWidth: number, bHeight: number) => {
    const windows = [];
    // Calculate roughly how many window columns/rows fit
    const cols = Math.floor(bWidth * 1.5); // Density factor
    const rows = Math.floor(bHeight * 0.8); // Density factor

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Randomly skip windows to create realistic patterns
        if (Math.random() > 0.3) {
          const isWarm = Math.random() > 0.6;
          const size = 1 + Math.random() * 1.2; // Tiny squares: 1px to 2.2px
          windows.push(
            <div
              key={`${r}-${c}`}
              style={{
                position: 'absolute',
                bottom: `${(r * 100) / rows + Math.random() * 2}%`,
                left: `${(c * 100) / cols + Math.random() * 2}%`,
                width: `${size}px`,
                height: `${size}px`,
                // Varied warm light colors
                backgroundColor: isWarm
                  ? `rgba(255, ${220 + Math.random() * 35}, ${150 + Math.random() * 50}, ${0.7 + Math.random() * 0.3})`
                  : `rgba(255, ${240 + Math.random() * 15}, ${200 + Math.random() * 55}, ${0.6 + Math.random() * 0.3})`,
                borderRadius: '1px', // Slight rounding for softness
                boxShadow: isWarm ? '0 0 2px rgba(255,200,100,0.5)' : 'none',
                opacity: Math.random(),
              }}
            />
          );
        }
      }
    }
    return windows;
  };


  return (
    <div
      id="scene-harbour"
      onClick={onNext}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        // Dark night sky gradient matching reference
        background: 'linear-gradient(180deg, #080b16 0%, #0a0e21 40%, #121730 70%, #1a1f3d 100%)',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* ── Stars ── */}
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: '#fff',
            opacity: Math.random(),
            animation: `twinkle ${1.5 + Math.random() * 3}s ${s.delay}s infinite alternate`,
            boxShadow: s.size > 1.5 ? '0 0 3px rgba(255,255,255,0.4)' : 'none',
          }}
        />
      ))}

      {/* ── Fireworks (High Z-Index) ── */}
      <FireworksCanvas active={true} />

      {/* ── Layer 1: Background Silhouettes ── */}
      <div style={{ position: 'absolute', bottom: '15%', left: 0, right: 0, height: '60%', zIndex: 1, opacity: 0.7 }}>
        {farBuildings.map((b, i) => (
          <div
            key={`far-${i}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${b.l}%`,
              width: `${b.w}%`,
              height: `${b.h * 0.8}%`, // Slightly shorter
              background: '#0c1022', // Very dark blue-black
            }}
          />
        ))}
      </div>

      {/* ── Layer 2: Main Lit Buildings (The star show) ── */}
      <div style={{ position: 'absolute', bottom: '10%', left: 0, right: 0, height: '75%', zIndex: 2 }}>
        {mainBuildings.map((b, i) => (
          <div
            key={`main-${i}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${b.l}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              // Pure black building body, lights will pop
              background: '#05070e',
              overflow: 'hidden', // Keep lights inside
            }}
          >
            {renderWindows(b.w, b.h)}
          </div>
        ))}
      </div>

       {/* ── Foreground / Dark Water Base ── */}
       {/* Sits in front of building bases (zIndex 3 vs 2) to create depth */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '18%', // Covers the bottom of the buildings
          background: 'linear-gradient(180deg, #05070e 0%, #030408 100%)',
          zIndex: 3,
        }}
      />

      {/* ── Blessing Box (Highest Z-Index) ── */}
      {showBlessing && (
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '340px',
            maxWidth: '90vw',
            zIndex: 20,
            animation: 'blessingFadeIn 1.2s ease forwards',
          }}
        >
          {/* Glass-morphism card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20,30,60,0.85), rgba(15,22,45,0.9))',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,210,120,0.2)',
              borderRadius: '16px',
              padding: '28px 30px 24px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Title */}
            <div
              style={{
                textAlign: 'center',
                color: '#ffd278',
                fontSize: '14px',
                letterSpacing: '3px',
                marginBottom: '16px',
                fontWeight: 600,
              }}
            >
              ── 爸爸生日快乐 ──
            </div>

            {/* Body text */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: '2.2',
                color: '#e8dcc8',
                textAlign: 'center',
                letterSpacing: '0.5px',
              }}
            >
              二月初四，立春破晓。<br />
              维多利亚港的璀璨烟火为您加冕。<br />
              您的肩膀比对岸的山脉更坚定，<br />
              爱比满城灯火更深情。<br />
              生日快乐！
            </div>

            {/* Click hint */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '20px',
                fontSize: '11px',
                color: 'rgba(255,210,120,0.5)',
                letterSpacing: '1px',
                animation: 'hintPulse 2.2s infinite',
              }}
            >
              ✦ 点击继续 ✦
            </div>
          </div>
        </div>
      )}

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes twinkle {
          0%  { opacity: 0.4; }
          100%{ opacity: 1; }
        }
        @keyframes blessingFadeIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(30px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}