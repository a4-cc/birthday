'use client';
import React, { useState, useEffect } from 'react';

// ─── 精修版人物与宠物组件 (保持不变) ───────────────────────────────────────────

const CharacterWrapper = ({ children, left, bottom = '22%', delay }: { children: React.ReactNode, left: string, bottom?: string, delay: string }) => (
  <div style={{
    position: 'absolute',
    bottom: bottom,
    left: left,
    zIndex: 8, // 人物层级很高
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

// ─── 新增：温馨背景家具组件 ───────────────────────────────────────────────

const Sofa = () => (
  <svg width="320" height="110" viewBox="0 0 320 110">
    {/*底座*/}
    <rect x="20" y="50" width="280" height="50" rx="10" fill="#c79267" />
    <rect x="20" y="90" width="280" height="20" rx="5" fill="#ad7a52" />
    {/*靠背*/}
    <rect x="20" y="10" width="280" height="50" rx="10" fill="#dba87d" />
    {/*扶手*/}
    <rect x="0" y="40" width="35" height="70" rx="10" fill="#dba87d" />
    <rect x="285" y="40" width="35" height="70" rx="10" fill="#dba87d" />
    {/*坐垫线条*/}
    <line x1="160" y1="55" x2="160" y2="95" stroke="#ad7a52" strokeWidth="2" opacity="0.3"/>
  </svg>
);

const PhotoFrames = () => (
  <svg width="220" height="100" viewBox="0 0 220 100" opacity="0.9">
    {/* 左侧大相框 */}
    <rect x="10" y="10" width="60" height="80" fill="#8c5e35" rx="2" />
    <rect x="15" y="15" width="50" height="70" fill="#f7f2e8" />
    <circle cx="40" cy="45" r="15" fill="#d9c5b2" opacity="0.5" />
    {/* 中间横相框 */}
    <rect x="85" y="25" width="120" height="50" fill="#8c5e35" rx="2" />
    <rect x="90" y="30" width="110" height="40" fill="#f7f2e8" />
    <path d="M90 70 L110 50 L140 70 L200 70" fill="#d9c5b2" opacity="0.5" />
  </svg>
);

const PottedPlant = () => (
  <svg width="80" height="120" viewBox="0 0 80 120">
    {/* 花盆 */}
    <path d="M20 115 L60 115 L65 85 L15 85 Z" fill="#b36b44" />
    <rect x="15" y="80" width="50" height="10" fill="#8f5130" rx="2" />
    {/* 叶子 */}
    <path d="M40 85 Q20 40 40 10 Q60 40 40 85" fill="#6b9c59" />
    <path d="M40 85 Q10 60 25 35" fill="#6b9c59" opacity="0.8" />
    <path d="M40 85 Q70 60 55 35" fill="#6b9c59" opacity="0.8" />
  </svg>
);

const CoffeeTable = () => (
  <svg width="200" height="60" viewBox="0 0 200 60">
    {/* 桌面 */}
    <ellipse cx="100" cy="20" rx="95" ry="20" fill="#7a533e" />
    <ellipse cx="100" cy="22" rx="95" ry="20" fill="#614030" /> {/* 厚度感 */}
    {/* 桌腿 */}
    <rect x="30" y="25" width="12" height="30" fill="#614030" rx="2" />
    <rect x="158" y="25" width="12" height="30" fill="#614030" rx="2" />
    {/* 桌上小物 - 杯子 */}
    <rect x="60" y="5" width="15" height="18" fill="#fff" rx="2" opacity="0.8" />
  </svg>
);


// ─── Main Scene ───────────────────────────────────────────────────────

export default function FamilyScene() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      size: 15 + Math.random() * 15,
      delay: Math.random() * 5,
      dur: 5 + Math.random() * 5,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      // 背景修改为温馨的墙壁颜色
      background: 'linear-gradient(180deg, #fdf6e3 0%, #f8ecc2 60%, #e6d5a8 100%)',
      overflow: 'hidden'
    }}>

      {/* ── 背景层 (层级最低 z-index: 1) ── */}
      {/* 地板 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '28%', // 地板高度
        background: '#8c5e35',
        borderTop: '6px solid #6b4226', // 踢脚线
        zIndex: 1
      }} />

      {/* ── 家具层 (层级中等 z-index: 2) ── */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
        {/* 墙上的相框 */}
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)' }}>
          <PhotoFrames />
        </div>
        {/* 沙发 (放在地板线上方一点) */}
        <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)' }}>
          <Sofa />
        </div>
        {/* 盆栽 (沙发旁边) */}
        <div style={{ position: 'absolute', bottom: '28%', left: '15%' }}>
          <PottedPlant />
        </div>
        {/* 茶几 (放在沙发前面，稍微低一点) */}
        <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)' }}>
          <CoffeeTable />
        </div>
      </div>

      {/* ── 顶部艺术字祝福 (层级最高 z-index: 10) ── */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <div style={{
          padding: '12px 40px',
          borderTop: '2px solid #ffd700',
          borderBottom: '2px solid #ffd700',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          animation: 'titleGlow 4s ease-in-out infinite',
          borderRadius: '4px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '38px',
            fontWeight: 'normal',
            color: '#d4af37', // 稍微深一点的金色，配合浅色背景
            fontFamily: '"STKaiti", "KaiTi", serif',
            letterSpacing: '12px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2), 0 0 15px rgba(255,215,0,0.6)'
          }}>
            天天开心 · 身体健康
          </h1>
        </div>
      </div>

      {/* ── 漂浮爱心 (层级高 z-index: 9) ── */}
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute',
          bottom: '-10%',
          left: `${h.x}%`,
          fontSize: `${h.size}px`,
          color: '#ff758c',
          opacity: 0,
          animation: `floatUp ${h.dur}s ${h.delay}s infinite linear`,
          pointerEvents: 'none',
          zIndex: 9
        }}>
          ♥
        </div>
      ))}

      {/* ── 人物组合层 (层级较高 z-index: 8) ── */}
      <div style={{ position: 'relative', height: '100%', width: '100%', zIndex: 8 }}>
        {/* 底部柔光阴影 (放在地板上，人物脚下) */}
        <div style={{
          position: 'absolute',
          bottom: '27%', // 调整到地板上方
          left: '50%',
          transform: 'translateX(-50%)',
          width: '420px',
          height: '30px',
          background: 'radial-gradient(ellipse, rgba(100, 60, 40, 0.4) 0%, transparent 70%)',
          zIndex: 7 // 在人物下面，家具上面
        }} />

        {/* 人物站位调整，底部基准线提高到地板上 (bottom="27%") */}
        <CharacterWrapper left="32%" bottom="27%" delay="0s"><Dad /></CharacterWrapper>
        <CharacterWrapper left="43%" bottom="27%" delay="0.3s"><Mom /></CharacterWrapper>
        <CharacterWrapper left="55%" bottom="27%" delay="0.6s"><Daughter /></CharacterWrapper>
        <CharacterWrapper left="63%" bottom="26.5%" delay="0.9s"><Cat /></CharacterWrapper>
      </div>

      {/* ── 底部暖光氛围遮罩 (层级最上层，增加温馨感) ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '40%',
        background: 'linear-gradient(to top, rgba(255, 220, 150, 0.15) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 11
      }} />

      {/* ── 关键帧动画 ── */}
      <style>{`
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 15px rgba(255,215,0,0.6); transform: scale(1); }
          50% { text-shadow: 0 0 25px rgba(255,215,0,0.9); transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}