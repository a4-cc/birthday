'use client';
import { useEffect, useState, useRef } from 'react';

export default function HarbourScene({ onNext }: { onNext: () => void }) {
  const [stars, setStars] = useState<{s: any}[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);

  useEffect(() => {
    // 生成星星数据
    setStars(Array.from({ length: 60 }).map(() => ({
      s: {
        width: Math.random() * 3 + 'px',
        height: Math.random() * 3 + 'px',
        top: Math.random() * 50 + '%',
        left: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's'
      }
    })));

    // 生成建筑数据
    const bData = [
      {l:0,w:60,h:55},{l:45,w:35,h:72},{l:90,w:42,h:85},
      {l:140,w:50,h:95},{l:200,w:45,h:78},{l:315,w:40,h:72},
      {l:492,w:45,h:95},{l:622,w:42,h:88},{l:742,w:45,h:90}
    ];
    setBuildings(bData);
  }, []);

  return (
    <div id="scene-harbour" className="scene" onClick={onNext}>
      {stars.map((star, i) => <div key={i} className="star" style={star.s} />)}
      
      <div id="skyline">
        {buildings.map((b, i) => (
          <div key={i} className="building" style={{ left: `${(b.l/8).toFixed(1)}%`, width: `${(b.w/8).toFixed(1)}%`, height: `${b.h}%` }}>
            {/* 随机窗户灯光 */}
            {Array.from({length: 6}).map((_, j) => (
               <div key={j} className="building-light" style={{
                 left: Math.random()*80+'%', bottom: Math.random()*90+'%', opacity: Math.random()
               }} />
            ))}
          </div>
        ))}
      </div>

      <div id="water"></div>

      <div id="blessing-box">
        <div style={{color: '#ffd278', textAlign: 'center', marginBottom: '10px', fontSize: '14px'}}>— 爸爸生日快乐 —</div>
        <div style={{fontSize: '14px', lineHeight: '1.8', color: '#fff0e1'}}>
          二月初四，立春破晓。维多利亚港的璀璨烟火为您加冕。您的肩膀比对岸的山脉更坚定，爱比满城灯火更深情。生日快乐！
        </div>
        <div style={{textAlign: 'right', marginTop: '10px', fontSize: '12px', color: 'gray'}}>👆 点击继续</div>
      </div>
    </div>
  );
}