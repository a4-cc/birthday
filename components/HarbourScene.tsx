'use client';
import { useEffect, useState, useRef, useCallback } from 'react';

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
function useStars(count = 90) {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 48,
      size: 0.8 + Math.random() * 2.2,
      delay: Math.random() * 4,
    }))
  );
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
      x: 15 + Math.random() * 70,          // spread across viewport
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

    // Resize canvas to fill container
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const RISE_DUR = 1100;   // ms to rise
    const BURST_DUR = 1800;  // ms burst visible
    const FADE_DUR = 900;    // ms fade out

    function draw() {
      const now = performance.now();
      const w = canvas!!.offsetWidth;
      const h = canvas!!.offsetHeight;

      // Semi-transparent clear for trail effect
      ctx!!.fillStyle = 'rgba(8, 12, 28, 0.35)';
      ctx!!.fillRect(0, 0, w, h);

      // Schedule next launch every 600–1200 ms
      if (now - lastLaunchRef.current > 600 + Math.random() * 600) {
        launch();
        lastLaunchRef.current = now;
      }

      // Update & draw each firework
      fireworksRef.current = fireworksRef.current.filter((fw) => {
        const elapsed = now - fw.startTime;

        if (elapsed < RISE_DUR) {
          // ── RISE phase: rising spark ──
          const t = elapsed / RISE_DUR;                      // 0→1
          const burstY = 15 + Math.random() * 0.001;        // target burst height (% from top)
          const startY = 88;                                 // start near bottom
          const curY = startY + (burstY - startY) * (1 - Math.pow(1 - t, 3)); // easeOut
          const curX = fw.x;

          // Spark trail
          ctx!!.beginPath();
          ctx!!.moveTo(curX * w / 100, curY * h / 100);
          ctx!!.lineTo(curX * w / 100, (curY + 4 * (1 - t)) * h / 100);
          ctx!!.strokeStyle = `rgba(255, 220, 140, ${0.9 - t * 0.3})`;
          ctx!!.lineWidth = 2.5;
          ctx!!.stroke();

          // Bright spark head
          ctx!!.beginPath();
          ctx!!.arc(curX * w / 100, curY * h / 100, 2.5, 0, Math.PI * 2);
          ctx!!.fillStyle = '#fff';
          ctx!!.fill();

          return true; // keep
        }

        if (elapsed < RISE_DUR + BURST_DUR) {
          // ── BURST phase: exploded particles ──
          const t = (elapsed - RISE_DUR) / BURST_DUR; // 0→1
          const cx = fw.x * w / 100;
          const cy = (20 + Math.random() * 0.0001) * h / 100; // burst center ~ 20% from top

          // Central flash on first frame
          if (t < 0.06) {
            ctx!!.beginPath();
            ctx!!.arc(cx, cy, 8 * (1 - t / 0.06), 0, Math.PI * 2);
            ctx!!.fillStyle = `rgba(255,255,240,${1 - t / 0.06})`;
            ctx!!.fill();
          }

          fw.particles.forEach((p) => {
            const dist = p.speed * t * 75;                     // px spread
            const px = cx + Math.cos(p.angle) * dist;
            const py = cy + Math.sin(p.angle) * dist + 18 * t * t; // gravity pull down

            // Fade
            const alpha = Math.max(0, 1 - t * 1.1);

            // Trail segment
            const trailDist = p.speed * (t - 0.04) * 75;
            const tx = cx + Math.cos(p.angle) * trailDist;
            const ty = cy + Math.sin(p.angle) * trailDist + 18 * (t - 0.04) * (t - 0.04);

            ctx!!.beginPath();
            ctx!!.moveTo(tx, ty);
            ctx!!.lineTo(px, py);
            ctx!!.strokeStyle = p.color + Math.floor(alpha * 180).toString(16).padStart(2, '0');
            ctx!!.lineWidth = 2;
            ctx!!.stroke();

            // Particle dot
            ctx!!.beginPath();
            ctx!!.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx!!.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx!!.fill();
          });

          return true;
        }

        // Past burst + fade → remove
        return false;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    // Initial launch burst — 3 fireworks staggered
    launch();
    setTimeout(launch, 350);
    setTimeout(launch, 750);
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
        zIndex: 4,
      }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function HarbourScene({ onNext }: { onNext: () => void }) {
  const stars = useStars(100);
  const [showBlessing, setShowBlessing] = useState(false);

  // Stagger blessing box appearance
  useEffect(() => {
    const t = setTimeout(() => setShowBlessing(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // ── Skyline data: layered buildings for depth ──
  // Layer 1 – far background (darker, shorter)
  const farBuildings = [
    { l: 0, w: 7, h: 42 },
    { l: 6, w: 5, h: 52 },
    { l: 11, w: 6, h: 46 },
    { l: 17, w: 4, h: 55 },
    { l: 22, w: 7, h: 48 },
    { l: 29, w: 5, h: 58 },
    { l: 34, w: 6, h: 44 },
    { l: 40, w: 5, h: 50 },
    { l: 45, w: 7, h: 54 },
    { l: 52, w: 4, h: 46 },
    { l: 56, w: 6, h: 52 },
    { l: 62, w: 5, h: 48 },
    { l: 67, w: 7, h: 56 },
    { l: 74, w: 5, h: 44 },
    { l: 79, w: 6, h: 50 },
    { l: 85, w: 5, h: 54 },
    { l: 90, w: 4, h: 46 },
    { l: 94, w: 6, h: 52 },
  ];

  // Layer 2 – mid (the main skyline, taller, more varied)
  const midBuildings = [
    { l: 0, w: 5.5, h: 58 },
    { l: 4, w: 4, h: 72 },   // tall
    { l: 7.5, w: 6, h: 62 },
    { l: 12, w: 4.5, h: 78 }, // tall tower
    { l: 15.5, w: 5, h: 65 },
    { l: 20, w: 3.5, h: 55 },
    { l: 23, w: 5.5, h: 82 }, // IFC-like
    { l: 27.5, w: 4, h: 70 },
    { l: 31, w: 5, h: 60 },
    { l: 35.5, w: 3.5, h: 74 },
    { l: 38.5, w: 6, h: 58 },
    { l: 44, w: 4.5, h: 68 },
    { l: 48, w: 5, h: 85 },   // tallest – Two IFC
    { l: 52.5, w: 4, h: 72 },
    { l: 56, w: 5.5, h: 62 },
    { l: 61, w: 3.5, h: 76 },
    { l: 64, w: 5, h: 64 },
    { l: 68.5, w: 4.5, h: 70 },
    { l: 72.5, w: 5.5, h: 58 },
    { l: 77.5, w: 4, h: 80 },
    { l: 81, w: 5, h: 66 },
    { l: 85.5, w: 4.5, h: 72 },
    { l: 89.5, w: 5, h: 60 },
    { l: 94, w: 3.5, h: 68 },
    { l: 97, w: 3, w2: 3, h: 55 },
  ];

  // Layer 3 – foreground silhouettes (darkest)
  const fgBuildings = [
    { l: 0, w: 8, h: 38 },
    { l: 7, w: 6, h: 42 },
    { l: 14, w: 9, h: 35 },
    { l: 25, w: 7, h: 40 },
    { l: 38, w: 10, h: 36 },
    { l: 52, w: 8, h: 42 },
    { l: 64, w: 9, h: 38 },
    { l: 77, w: 7, h: 40 },
    { l: 88, w: 12, h: 35 },
  ];

  return (
    <div
      id="scene-harbour"
      onClick={onNext}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #06091a 0%, #0c1535 30%, #142040 55%, #1a2a50 75%, #1e3058 100%)',
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
            opacity: 0.7,
            animation: `twinkle 2.5s ${s.delay}s infinite alternate`,
            boxShadow: s.size > 2 ? '0 0 4px 1px rgba(200,220,255,0.4)' : 'none',
          }}
        />
      ))}

      {/* ── Fireworks Canvas ── */}
      <FireworksCanvas active={true} />

      {/* ── Sky gradient overlay for horizon glow ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '38%',
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, rgba(40,80,140,0.4), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Far buildings (background layer) ── */}
      <div style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, height: '62%', zIndex: 2 }}>
        {farBuildings.map((b, i) => (
          <div
            key={`far-${i}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${b.l}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: 'linear-gradient(180deg, #1a2240 0%, #151a30 100%)',
              clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 100%)',
            }}
          >
            {/* Dim window lights */}
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: '3px',
                  background: `rgba(255, ${180 + Math.random() * 75}, ${80 + Math.random() * 80}, ${0.2 + Math.random() * 0.3})`,
                  left: `${15 + (j % 2) * 55}%`,
                  bottom: `${10 + j * 22}%`,
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Mid buildings (main skyline) ── */}
      <div style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, height: '62%', zIndex: 3 }}>
        {midBuildings.map((b, i) => {
          const istall = b.h >= 75;
          return (
            <div
              key={`mid-${i}`}
              style={{
                position: 'absolute',
                bottom: 0,
                left: `${b.l}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                background: istall
                  ? 'linear-gradient(180deg, #1e2848 0%, #182035 60%, #141a2e 100%)'
                  : 'linear-gradient(180deg, #1a2440 0%, #151c32 100%)',
                clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 100%)',
              }}
            >
              {/* Window lights grid */}
              {Array.from({ length: istall ? 10 : 6 }).map((_, j) => {
                const lit = Math.random() > 0.35;
                return lit ? (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      width: '2.5px',
                      height: '3.5px',
                      background: `rgba(255, ${190 + Math.random() * 65}, ${100 + Math.random() * 80}, ${0.55 + Math.random() * 0.35})`,
                      left: `${12 + (j % 3) * 35}%`,
                      bottom: `${6 + Math.floor(j / 3) * 28}%`,
                      borderRadius: '1px',
                      boxShadow: '0 0 3px 1px rgba(255,200,120,0.25)',
                    }}
                  />
                ) : null;
              })}
              {/* Roof antenna on tall buildings */}
              {istall && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '10px',
                    background: '#2a3050',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Foreground silhouettes ── */}
      <div style={{ position: 'absolute', bottom: '38%', left: 0, right: 0, height: '42%', zIndex: 5 }}>
        {fgBuildings.map((b, i) => (
          <div
            key={`fg-${i}`}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${b.l}%`,
              width: `${b.w}%`,
              height: `${b.h}%`,
              background: '#0a0e1a',
            }}
          />
        ))}
      </div>

      {/* ── Water ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '38%',
          background: 'linear-gradient(180deg, #0e1a38 0%, #091228 40%, #060e1e 100%)',
          zIndex: 6,
          overflow: 'hidden',
        }}
      >
        {/* Water reflection streaks */}
        {Array.from({ length: 18 }).map((_, i) => {
          const left = 5 + (i * 5.2) % 95;
          const w = 1 + Math.random() * 2.5;
          const h = 30 + Math.random() * 60;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: `${left}%`,
                width: `${w}px`,
                height: `${h}%`,
                background: `linear-gradient(180deg, rgba(255,${160 + i * 5},${80 + i * 3}, ${0.08 + (i % 3) * 0.06}) 0%, transparent 100%)`,
                borderRadius: '1px',
                animation: `watershimmer ${2 + (i % 3)}s ${i * 0.3}s infinite alternate`,
              }}
            />
          );
        })}

        {/* Gentle wave lines */}
        {[12, 24, 36, 50, 64, 78].map((top, i) => (
          <div
            key={`wave-${i}`}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: '-10%',
              right: '-10%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,200,120,0.06) 30%, rgba(255,200,120,0.1) 50%, rgba(255,200,120,0.06) 70%, transparent 100%)',
              animation: `waveSlide ${3 + i * 0.7}s ${i * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Blessing Box ── */}
      {showBlessing && (
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '340px',
            maxWidth: '90vw',
            zIndex: 10,
            animation: 'blessingFadeIn 1.2s ease forwards',
          }}
        >
          {/* Glass-morphism card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(20,30,60,0.75), rgba(15,22,45,0.82))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,210,120,0.18)',
              borderRadius: '16px',
              padding: '28px 30px 24px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,150,0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Corner accents */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '18px', height: '18px', borderTop: '1.5px solid rgba(255,210,120,0.4)', borderLeft: '1.5px solid rgba(255,210,120,0.4)', borderRadius: '3px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '8px', right: '8px', width: '18px', height: '18px', borderTop: '1.5px solid rgba(255,210,120,0.4)', borderRight: '1.5px solid rgba(255,210,120,0.4)', borderRadius: '0 3px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '18px', height: '18px', borderBottom: '1.5px solid rgba(255,210,120,0.4)', borderLeft: '1.5px solid rgba(255,210,120,0.4)', borderRadius: '0 0 0 3px' }} />
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '18px', height: '18px', borderBottom: '1.5px solid rgba(255,210,120,0.4)', borderRight: '1.5px solid rgba(255,210,120,0.4)', borderRadius: '0 0 3px 0' }} />

            {/* Title */}
            <div
              style={{
                textAlign: 'center',
                color: '#ffd278',
                fontSize: '13px',
                letterSpacing: '3px',
                marginBottom: '14px',
                fontFamily: "'Georgia', serif",
                textTransform: 'uppercase',
              }}
            >
              ── 爸爸生日快乐 ──
            </div>

            {/* Divider */}
            <div
              style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,210,120,0.4), transparent)',
                margin: '0 auto 18px',
              }}
            />

            {/* Body text */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: '2',
                color: '#e8dcc8',
                textAlign: 'center',
                fontFamily: "'Georgia', serif",
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
                marginTop: '18px',
                fontSize: '11px',
                color: 'rgba(255,210,120,0.45)',
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
          0%  { opacity: 0.3; transform: scale(0.85); }
          100%{ opacity: 0.9; transform: scale(1.15); }
        }
        @keyframes watershimmer {
          0%  { opacity: 0.6; transform: scaleX(0.9); }
          100%{ opacity: 1;   transform: scaleX(1.1); }
        }
        @keyframes waveSlide {
          0%  { transform: translateX(-3%); }
          100%{ transform: translateX(3%);  }
        }
        @keyframes blessingFadeIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0);    }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}