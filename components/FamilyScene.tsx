'use client';
import React, { useState, useEffect } from 'react';

// ─── 人物与宠物组件 ───────────────────────────────────────────

const CharacterWrapper = ({ children, left, bottom = '27%', delay }: { children: React.ReactNode, left: string, bottom?: string, delay: string }) => (
  <div style={{
    position: 'absolute',
    bottom: bottom,
    left: left,
    zIndex: 8,
    animation: `bobbing 3s ease-in-out ${delay} infinite`,
    transformOrigin: 'bottom center'
  }}>
    {children}
  </div>
);

const Dad = () => (
  <svg width="85" height="140" viewBox="0 0 85 140">
    <ellipse cx="42" cy="115" rx="32" ry="25" fill="#3a5a8f" />
    <rect x="36" y="80" width="12" height="15" fill="#e8c4a0" />
    <ellipse cx="42" cy="62" rx="26" ry="28" fill="#e8c4a0" />
    <path d="M16 55 Q18 35 42 32 Q66 35 68 55 Q65 45 55 43 Q42 40 30 43 Q20 45 16 55Z" fill="#2d1e15" />
    <circle cx="34" cy="62" r="2" fill="#333" />
    <circle cx="50" cy="62" r="2" fill="#333" />
    <path d="M36 75 Q42 79 48 75" stroke="#a67c52" strokeWidth="1.5" fill="none" />
    <circle cx="28" cy="68" r="4" fill="#f28d8d" opacity="0.3" />
    <circle cx="56" cy="68" r="4" fill="#f28d8d" opacity="0.3" />
  </svg>
);

const Mom = () => (
  <svg width="80" height="130" viewBox="0 0 80 130">
    <path d="M15 115 Q40 135 65 115 L60 95 Q40 85 20 95 Z" fill="#d97b91" />
    <rect x="34" y="75" width="10" height="15" fill="#f5d1b5" />
    <ellipse cx="40" cy="58" rx="24" ry="26" fill="#f5d1b5" />
    <path d="M14 60 Q12 25 40 22 Q68 25 66 60 Q60 35 40 35 Q20 35 14 60Z" fill="#3d2b1f" />
    <circle cx="40" cy="30" r="10" fill="#3d2b1f" />
    <circle cx="32" cy="58" r="2" fill="#333" />
    <circle cx="48" cy="58" r="2" fill="#333" />
    <path d="M36 70 Q40 73 44 70" stroke="#b57a7a" strokeWidth="1.5" fill="none" />
    <circle cx="28" cy="62" r="5" fill="#ffb3b3" opacity="0.4" />
    <circle cx="52" cy="62" r="5" fill="#ffb3b3" opacity="0.4" />
  </svg>
);

const Daughter = () => (
  <svg width="70" height="110" viewBox="0 0 70 110">
    <path d="M15 105 L55 105 L52 75 Q35 65 18 75 Z" fill="#78c2ad" />
    <ellipse cx="35" cy="55" rx="22" ry="24" fill="#f5d1b5" />
    <path d="M12 55 Q12 25 35 25 Q58 25 58 55 Q55 35 35 35 Q15 35 12 55Z" fill="#4a3728" />
    <circle cx="28" cy="55" r="1.8" fill="#333" />
    <circle cx="42" cy="55" r="1.8" fill="#333" />
    <path d="M31 65 Q35 68 39 65" stroke="#b57a7a" strokeWidth="1.2" fill="none" />
    <circle cx="22" cy="60" r="5" fill="#ffb3b3" opacity="0.5" />
    <circle cx="48" cy="60" r="5" fill="#ffb3b3" opacity="0.5" />
  </svg>
);

const Cat = () => (
  <svg width="50" height="50" viewBox="0 0 50 50">
    <path d="M10 45 Q25 50 40 45 L38 35 Q25 30 12 35 Z" fill="#f3f3f3" />
    <circle cx="25" cy="25" r="12" fill="#f3f3f3" />
    <path d="M15 18 L12 8 L22 15 Z" fill="#f3f3f3" />
    <path d="M35 18 L38 8 L28 15 Z" fill="#f3f3f3" />
    <circle cx="21" cy="24" r="1.5" fill="#333" />
    <circle cx="29" cy="24" r="1.5" fill="#333" />
    <path d="M23 28 L25 30 L27 28" stroke="#ffb3b3" strokeWidth="1" fill="none" />
    <path d="M40 40 Q48 35 45 25" stroke="#f3f3f3" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

// ─── 家具与背景组件 ─────────────────────────────────────────────────────────

const Sofa = () => (
  <svg width="320" height="110" viewBox="0 0 320 110">
    <rect x="20" y="50" width="280" height="50" rx="10" fill="#c79267" />
    <rect x="20" y="90" width="280" height="20" rx="5" fill="#ad7a52" />
    <rect x="20" y="10" width="280" height="50" rx="10" fill="#dba87d" />
    <rect x="0" y="40" width="35" height="70" rx="10" fill="#dba87d" />
    <rect x="285" y="40" width="35" height="70" rx="10" fill="#dba87d" />
  </svg>
);

const PhotoFrames = () => (
  <svg width="180" height="80" viewBox="0 0 180 80" opacity="0.9">
    <rect x="10" y="10" width="50" height="60" fill="#8c5e35" rx="2" />
    <rect x="15" y="15" width="40" height="50" fill="#f7f2e8" />
    <rect x="75" y="20" width="90" height="40" fill="#8c5e35" rx="2" />
    <rect x="80" y="25" width="80" height="30" fill="#f7f2e8" />
  </svg>
);

const UpsideDownFu = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.2))' }}>
    <g transform="rotate(180 30 30)">
      <rect x="5" y="5" width="50" height="50" fill="#e63946" rx="3" />
      <text x="30" y="32" fill="#ffd700" fontSize="28" fontFamily="KaiTi" fontWeight="bold" textAnchor="middle" dominantBaseline="central">福</text>
    </g>
  </svg>
);

const PottedPlant = () => (
  <svg width="100" height="140" viewBox="0 0 100 140">
    <path d="M30 135 L70 135 L75 100 L25 100 Z" fill="#b36b44" /> {/* 花盆 */}
    <path d="M50 100 Q20 60 50 10 Q80 60 50 100" fill="#4f7942" /> {/* 叶子 */}
    <path d="M50 100 Q5 70 30 40" fill="#6b9c59" />
    <path d="M50 100 Q95 70 70 40" fill="#6b9c59" />
  </svg>
);

const Window = () => (
  <svg width="120" height="160" viewBox="0 0 120 160">
    <rect x="5" y="5" width="110" height="150" fill="#a5d8ff" rx="2" /> {/* 窗外景色 */}
    <rect x="5" y="5" width="110" height="150" fill="rgba(255,255,255,0.1)" />
    <rect x="0" y="75" width="120" height="10" fill="#fff" /> {/* 窗格 */}
    <rect x="55" y="5" width="10" height="150" fill="#fff" />
    <rect x="0" y="0" width="120" height="160" fill="none" stroke="#fff" strokeWidth="8" rx="4" /> {/* 窗框 */}
  </svg>
);

// ─── Main Scene ───────────────────────────────────────────────────────

export default function FamilyScene() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      size: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      dur: 4 + Math.random() * 6,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100vh',
      background: 'linear-gradient(180deg, #fdf6e3 0%, #f8ecc2 60%, #e6d5a8 100%)',
      overflow: 'hidden'
    }}>

      {/* ── 背景装饰层 ── */}
      <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '28%', background: '#8c5e35', borderTop: '6px solid #6b4226', zIndex: 1 }} />
      
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
        {/* 窗户 */}
        <div style={{ position: 'absolute', top: '20%', left: '10%' }}><Window /></div>
        {/* 倒福 */}
        <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)' }}><UpsideDownFu /></div>
        {/* 相框 */}
        <div style={{ position: 'absolute', top: '32%', left: '75%' }}><PhotoFrames /></div>
        {/* 沙发 */}
        <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)' }}><Sofa /></div>
        {/* 盆栽 */}
        <div style={{ position: 'absolute', bottom: '28%', right: '12%' }}><PottedPlant /></div>
      </div>

      {/* ── 顶部祝福语 (恢复并优化以前的风格) ── */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #ffd700',
          padding: '15px 45px',
          borderRadius: '50px',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
          display: 'inline-block',
          animation: 'titlePulse 4s ease-in-out infinite'
        }}>
          <h1 style={{
            margin: 0, fontSize: '30px', color: '#ffd700',
            fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: '6px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,215,0,0.5)',
          }}>
            天天开心 · 身体健康
          </h1>
          <div style={{
            fontSize: '18px', color: '#8b4513', marginTop: '6px',
            fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: '8px', opacity: 0.9
          }}>
            我们永远在一起
          </div>
        </div>
      </div>

      {/* ── 漂浮爱心 ── */}
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute', bottom: '-10%', left: `${h.x}%`, fontSize: `${h.size}px`,
          color: '#ff758c', opacity: 0, animation: `floatUp ${h.dur}s ${h.delay}s infinite linear`,
          pointerEvents: 'none', zIndex: 9
        }}>♥</div>
      ))}

      {/* ── 人物与宠物 ── */}
      <div style={{ position: 'relative', height: '100%', width: '100%', zIndex: 8 }}>
        <div style={{
          position: 'absolute', bottom: '27%', left: '50%', transform: 'translateX(-50%)',
          width: '420px', height: '30px', background: 'radial-gradient(ellipse, rgba(100, 60, 40, 0.3) 0%, transparent 70%)',
          zIndex: 7
        }} />
        <CharacterWrapper left="32%" delay="0s"><Dad /></CharacterWrapper>
        <CharacterWrapper left="43%" delay="0.3s"><Mom /></CharacterWrapper>
        <CharacterWrapper left="55%" delay="0.6s"><Daughter /></CharacterWrapper>
        <CharacterWrapper left="63%" bottom="26.5%" delay="0.9s"><Cat /></CharacterWrapper>
      </div>

      {/* ── 底部光影 ── */}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '40%',
        background: 'linear-gradient(to top, rgba(255, 220, 150, 0.1) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 11
      }} />

      <style>{`
        @keyframes bobbing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes titlePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { transform: scale(1.03); box-shadow: 0 0 35px rgba(255, 215, 0, 0.5); }
        }
      `}</style>
    </div>
  );
}