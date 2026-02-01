'use client';
import { useEffect, useState } from 'react';

export default function CakeScene({ isLit, onLit }: { isLit: boolean, onLit: () => void }) {
  const [sprinkles, setSprinkles] = useState<{left: string, top: string, color: string, rot: string}[]>([]);

  useEffect(() => {
    const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6b9d'];
    const newSprinkles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 160 + 10}px`,
      top: `${Math.random() * 80 + 10}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: `${Math.random() * 180}deg`
    }));
    setSprinkles(newSprinkles);
  }, []);

  return (
    <div id="scene-cake" className={`scene ${isLit ? 'lit' : ''}`}>
      <div id="ambient-light"></div>
      <div id="birthday-text">Happy Birthday!</div>

      <div className="cake-wrapper" onClick={onLit}>
        <div className="candle-area">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="candle">
              <div className="flame">
                <div className="flame-glow"></div>
                <div className="flame-inner"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="frosting-top"></div>
        <div className="cake-body">
          <div className="cake-layer-1">
            {[1,2,3,4,5].map(i => <div key={i} className="drip"></div>)}
            {sprinkles.map((s, i) => (
              <div key={i} className="sprinkle" style={{ 
                left: s.left, top: s.top, backgroundColor: s.color, transform: `rotate(${s.rot})` 
              }} />
            ))}
          </div>
          <div className="cake-layer-2"></div>
        </div>
        <div className="plate"></div>
      </div>

      {!isLit && <div style={{marginTop: '40px', animation: 'hintPulse 2s infinite'}}>👆 点击蛋糕点燃蜡烛</div>}
    </div>
  );
}