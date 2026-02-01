'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';

export default function CakeScene({ isLit, onLit }: { isLit: boolean; onLit: () => void }) {
  // 追踪点燃的蜡烛数量 (0–5)
  const [litCount, setLitCount] = useState(0);
  const [allLit, setAllLit] = useState(false);
  const [clicked, setClicked] = useState(false);

  // 蛋糕上的装饰糖碎
  const [sprinkles] = useState(() => {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d'];
    return Array.from({ length: 24 }).map(() => ({
      left: `${Math.random() * 160 + 10}px`,
      top: `${Math.random() * 80 + 10}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: `${Math.random() * 180}deg`,
    }));
  });

  // 生成彩带数据 (只在点燃完成后显示)
  const confetti = useMemo(() => {
    const colors = ['#ff4d4d', '#ffcc00', '#33cc33', '#3399ff', '#ff66cc', '#ffffff'];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${3 + Math.random() * 2}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      width: `${6 + Math.random() * 6}px`,
      height: `${10 + Math.random() * 10}px`,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, []);

  // 顺序点燃逻辑：点击后每 420ms 点燃一根
  useEffect(() => {
    if (!clicked) return;
    if (litCount >= 5) {
      setAllLit(true);
      onLit(); // 通知父组件，4.5秒后切场
      return;
    }
    const timer = setTimeout(() => setLitCount((n) => n + 1), 420);
    return () => clearTimeout(timer);
  }, [clicked, litCount, onLit]);

  const handleClick = useCallback(() => {
    if (!clicked) setClicked(true);
  }, [clicked]);

  return (
    <div
      id="scene-cake"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: allLit
          ? 'radial-gradient(ellipse 80% 60% at 50% 45%, #3d2a1a 0%, #1a0f08 60%, #0d0906 100%)'
          : 'radial-gradient(ellipse 60% 50% at 50% 40%, #2a1f14 0%, #1a1210 60%, #0f0c0a 100%)',
        transition: 'background 1.5s ease',
        overflow: 'hidden',
        cursor: clicked ? 'default' : 'pointer',
      }}
      onClick={handleClick}
    >
      {/* 彩带飘落层 - 仅在 allLit 时激活 */}
      {allLit && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
          {confetti.map((c) => (
            <div
              key={c.id}
              className="confetti-piece"
              style={{
                position: 'absolute',
                top: '-20px',
                left: c.left,
                width: c.width,
                height: c.height,
                backgroundColor: c.color,
                transform: `rotate(${c.rotation})`,
                animation: `fall ${c.duration} linear ${c.delay} infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* 氛围灯光 */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: allLit ? '520px' : '200px',
          height: allLit ? '420px' : '160px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,180,60,0.22) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transition: 'width 1.2s ease, height 1.2s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 标题：随着蜡烛点燃逐渐显现 */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          // 透明度随 litCount 增加 (0, 0.2, 0.4, 0.6, 0.8, 1.0)
          opacity: litCount / 5,
          color: allLit ? '#ffe8b0' : '#8b7a6a',
          fontSize: '32px',
          fontFamily: "'Georgia', serif",
          letterSpacing: '5px',
          marginBottom: '52px',
          textShadow: allLit ? '0 0 20px rgba(255,200,100,0.6)' : 'none',
          transition: 'opacity 0.6s ease, color 1s ease, text-shadow 1s ease',
        }}
      >
        Happy Birthday !
      </div>

      {/* 蛋糕主体结构 */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* 蜡烛排 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '18px',
            marginBottom: '4px',
            height: '72px',
            alignItems: 'flex-end',
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => {
            const isOn = i < litCount;
            const heights = [52, 62, 68, 62, 52];
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '24px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isOn ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: isOn ? '36px' : '0px',
                      height: isOn ? '44px' : '0px',
                      borderRadius: '50%',
                      background: 'radial-gradient(ellipse, rgba(255,180,60,0.35) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      animation: isOn ? 'flicker 0.15s infinite alternate' : 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      width: '10px',
                      height: '22px',
                      background: 'linear-gradient(to top, #ff9a00, #ffdd44, #fff8e0)',
                      borderRadius: '50% 50% 40% 40%',
                      boxShadow: '0 0 6px 2px rgba(255,180,60,0.6)',
                      animation: isOn ? 'flameDance 0.12s infinite alternate' : 'none',
                      zIndex: 1,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: '8px',
                    height: `${heights[i]}px`,
                    background: `linear-gradient(to bottom, ${['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d'][i]}, ${['#cc4444', '#ccaa22', '#449944', '#3366cc', '#cc3366'][i]})`,
                    borderRadius: '3px 3px 2px 2px',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* 蛋糕顶部和主体 (保持原样) */}
        <div style={{ width: '220px', height: '28px', background: 'linear-gradient(135deg, #fff5e6 0%, #ffe0cc 40%, #fff0e0 70%, #ffe8d8 100%)', borderRadius: '50% 50% 0 0', position: 'relative', overflow: 'hidden', boxShadow: '0 -2px 8px rgba(0,0,0,0.15)' }} />
        <div style={{ width: '220px', height: '90px', background: 'linear-gradient(180deg, #f5c8a0 0%, #e8a878 40%, #d4886a 100%)', position: 'relative', overflow: 'hidden', borderRadius: '0 0 6px 6px', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          {sprinkles.map((s, i) => (
            <div key={i} style={{ position: 'absolute', left: s.left, top: s.top, width: '8px', height: '3px', backgroundColor: s.color, borderRadius: '2px', transform: `rotate(${s.rot})`, boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }} />
          ))}
        </div>
        <div style={{ width: '260px', height: '14px', background: 'linear-gradient(180deg, #e8e0d8, #c8c0b8)', borderRadius: '50%', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', marginLeft: '-20px' }} />
      </div>

      {/* 提示文本 */}
      {!clicked && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            marginTop: '48px',
            color: '#a08060',
            fontSize: '15px',
            animation: 'hintPulse 2s infinite',
            letterSpacing: '1px',
          }}
        >
          🕯️ 点击蛋糕点燃蜡烛
        </div>
      )}

      {/* 动画 Keyframes */}
      <style>{`
        @keyframes flameDance {
          0%  { transform: scaleX(1) scaleY(1) rotate(-1deg); }
          100%{ transform: scaleX(1.1) scaleY(0.95) rotate(1.5deg); }
        }
        @keyframes flicker {
          0%  { opacity: 0.7; transform: scale(0.9); }
          100%{ opacity: 1;   transform: scale(1.1); }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1;   }
        }
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}