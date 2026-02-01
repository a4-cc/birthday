'use client';
import React, { useState, useEffect } from 'react';

// ─── 精修版人物与宠物组件 ────────────────────────────────────────────────────

const CharacterWrapper = ({ children, left, bottom = '22%', delay }: { children: React.ReactNode, left: string, bottom?: string, delay: string }) => (
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
    <ellipse cx="42" cy="115" rx="32" ry="25" fill="#3a5a8f" /> {/* 蓝色衬衫 */}
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
    <path d="M15 115 Q40 135 65 115 L60 95 Q40 85 20 95 Z" fill="#d97b91" /> {/* 优雅粉裙 */}
    <rect x="34" y="75" width="10" height="15" fill="#f5d1b5" />
    <ellipse cx="40" cy="58" rx="24" ry="26" fill="#f5d1b5" />
    <path d="M14 60 Q12 25 40 22 Q68 25 66 60 Q60 35 40 35 Q20 35 14 60Z" fill="#3d2b1f" />
    <circle cx="40" cy="30" r="10" fill="#3d2b1f" /> {/* 挽起的发髻 */}
    <circle cx="32" cy="58" r="2" fill="#333" />
    <circle cx="48" cy="58" r="2" fill="#333" />
    <path d="M36 70 Q40 73 44 70" stroke="#b57a7a" strokeWidth="1.5" fill="none" />
    <circle cx="28" cy="62" r="5" fill="#ffb3b3" opacity="0.4" />
    <circle cx="52" cy="62" r="5" fill="#ffb3b3" opacity="0.4" />
  </svg>
);

const Daughter = () => (
  <svg width="70" height="110" viewBox="0 0 70 110">
    <path d="M15 105 L55 105 L52 75 Q35 65 18 75 Z" fill="#78c2ad" /> {/* 清新绿裙 */}
    <ellipse cx="35" cy="55" rx="22" ry="24" fill="#f5d1b5" />
    <path d="M12 55 Q12 25 35 25 Q58 25 58 55 Q55 35 35 35 Q15 35 12 55Z" fill="#4a3728" /> {/* 齐刘海长发 */}
    <circle cx="28" cy="55" r="1.8" fill="#333" />
    <circle cx="42" cy="55" r="1.8" fill="#333" />
    <path d="M31 65 Q35 68 39 65" stroke="#b57a7a" strokeWidth="1.2" fill="none" />
    <circle cx="22" cy="60" r="5" fill="#ffb3b3" opacity="0.5" />
    <circle cx="48" cy="60" r="5" fill="#ffb3b3" opacity="0.5" />
  </svg>
);

const Cat = () => (
  <svg width="50" height="50" viewBox="0 0 50 50">
    <path d="M10 45 Q25 50 40 45 L38 35 Q25 30 12 35 Z" fill="#f3f3f3" /> {/* 猫身体 */}
    <circle cx="25" cy="25" r="12" fill="#f3f3f3" /> {/* 猫头 */}
    <path d="M15 18 L12 8 L22 15 Z" fill="#f3f3f3" /> {/* 左耳 */}
    <path d="M35 18 L38 8 L28 15 Z" fill="#f3f3f3" /> {/* 右耳 */}
    <circle cx="21" cy="24" r="1.5" fill="#333" /> {/* 眼睛 */}
    <circle cx="29" cy="24" r="1.5" fill="#333" />
    <path d="M23 28 L25 30 L27 28" stroke="#ffb3b3" strokeWidth="1" fill="none" /> {/* 鼻子 */}
    <path d="M40 40 Q48 35 45 25" stroke="#f3f3f3" strokeWidth="3" fill="none" strokeLinecap="round" /> {/* 尾巴 */}
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
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
      overflow: 'hidden'
    }}>
      {/* ── 顶部艺术字祝福 ── */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <div style={{
          padding: '12px 40px',
          borderTop: '2px solid #ffd700',
          borderBottom: '2px solid #ffd700',
          background: 'rgba(255, 215, 0, 0.05)',
          animation: 'titleGlow 4s ease-in-out infinite'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '36px',
            fontWeight: 'normal',
            color: '#ffd700',
            fontFamily: '"STKaiti", "KaiTi", serif',
            letterSpacing: '12px',
            textShadow: '0 0 10px rgba(255,215,0,0.5), 2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            天天开心 · 身体健康
          </h1>
        </div>
      </div>

      {/* ── 漂浮爱心 ── */}
      {hearts.map(h => (
        <div key={h.id} style={{
          position: 'absolute',
          bottom: '-10%',
          left: `${h.x}%`,
          fontSize: `${h.size}px`,
          color: '#ff758c',
          opacity: 0,
          animation: `floatUp ${h.dur}s ${h.delay}s infinite linear`,
          pointerEvents: 'none'
        }}>
          ♥
        </div>
      ))}

      {/* ── 人物组合 (更紧凑的站位) ── */}
      <div style={{ position: 'relative', height: '100%', width: '100%' }}>
        {/* 底部柔光阴影 */}
        <div style={{
          position: 'absolute',
          bottom: '21%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '450px',
          height: '40px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 80%)',
          zIndex: 7
        }} />

        {/* 站位设定：爸爸和妈妈在中间，女儿在侧面，猫咪在脚边 */}
        <CharacterWrapper left="32%" delay="0s"><Dad /></CharacterWrapper>
        <CharacterWrapper left="43%" delay="0.3s"><Mom /></CharacterWrapper>
        <CharacterWrapper left="55%" delay="0.6s"><Daughter /></CharacterWrapper>
        <CharacterWrapper left="63%" bottom="21.5%" delay="0.9s"><Cat /></CharacterWrapper>
      </div>

      {/* ── 底部氛围遮罩 ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '35%',
        background: 'linear-gradient(to top, rgba(255, 215, 0, 0.08) 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* ── 关键帧动画 ── */}
      <style>{`
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.5); transform: scale(1); }
          50% { text-shadow: 0 0 25px rgba(255,215,0,0.8); transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}