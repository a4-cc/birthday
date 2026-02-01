'use client';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Star { x: number; y: number; size: number; delay: number }
interface Firework {
  id: number;
  x: number;         // launch x (%)
  phase: 'rise' | 'burst' | 'fade';
  progress: number;  // 0→1
  color: string;
  particles: Particle[];
  startTime: number;
}
interface Particle {
  angle: number;
  speed: number;
  color: string;
  trail: number; // trail length factor
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const FIREWORK_COLORS = [
  ['#ff4466', '#ff6688', '#ffaacc'],
  ['#ffaa00', '#ffcc44', '#ffee88'],
  ['#44ccff', '#88eeff', '#ccffff'],
  ['#aa44ff', '#cc88ff', '#eeccff'],
  ['#44ff88', '#88ffbb', '#ccffdd'],
  ['#ff6644', '#ff9966', '#ffccaa'],
  ['#ff44aa', '#ff88cc', '#ffccee'],
];

function makeParticles(): Particle[] {
  const count = 28 + Math.floor(Math.random() * 16);
  const colorSet = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.4,
    color: colorSet[Math.floor(Math.random() * colorSet.length)],
    trail: 0.5 + Math.random() * 0.8,
  }));
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

  const launch = useCallback(() => {
    const fw: Firework = {
      id: idRef.current++,
      x: 10 + Math.random() * 80,          // spread across viewport
      phase: 'rise',
      progress: 0,
      color: '#ffdd88',
      particles: makeParticles(),
      startTime: performance.now(),
    };
    fireworksRef.current.push(fw);
  }, []);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const RISE_DUR = 1100;
    const BURST_DUR = 1800;

    function draw() {
      const now = performance.now();
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      // Clear with transparency for trails
      ctx!.clearRect(0, 0, w, h);

      if (now - lastLaunchRef.current > 800 + Math.random() * 1000) {
        launch();
        lastLaunchRef.current = now;
      }

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        const elapsed = now - fw.startTime;

        if (elapsed < RISE_DUR) {
          const t = elapsed / RISE_DUR;
          // Burst height between 15% and 30% from top
          const burstY = 15 + Math.random() * 15;
          const startY = 100;
          const curY = startY + (burstY - startY) * (1 - Math.pow(1 - t, 3));
          const curX = fw.x;

          ctx!.beginPath();
          ctx!.moveTo(curX * w / 100, curY * h / 100);
          ctx!.lineTo(curX * w / 100, (curY + 5 * (1 - t)) * h / 100);
          ctx!.strokeStyle = `rgba(255, 220, 140, ${0.8 - t * 0.2})`;
          ctx!.lineWidth = 2;
          ctx!.stroke();
          return true;
        }

        if (elapsed < RISE_DUR + BURST_DUR) {
          const t = (elapsed - RISE_DUR) / BURST_DUR;
          // Ensure burst happens where rise ended (approx 22% on average)
          const cy = 22 * h / 100;
          const cx = fw.x * w / 100;

          fw.particles.forEach((p) => {
            const dist = p.speed * t * 100;
            const px = cx + Math.cos(p.angle) * dist;
            // Add gravity effect
            const py = cy + Math.sin(p.angle) * dist + (30 * t * t);

            const alpha = Math.max(0, 1 - t * 1.2);

            ctx!.beginPath();
            ctx!.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx!.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx!.fill();
          });
          return true;
        }
        return false;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    launch();
    setTimeout(launch, 500);
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
        zIndex: 10, // Fireworks on top of buildings
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