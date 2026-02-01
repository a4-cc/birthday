'use client';
import React from 'react';

// 人物组件：爸爸
const Dad = () => (
  <div className="person dad">
    <div className="head">
      <div className="hair"></div>
      <div className="ear l"></div><div className="ear r"></div>
      <div className="glasses"></div>
      <div className="eyes"><div className="eye"></div><div className="eye"></div></div>
      <div className="smile"></div>
    </div>
    <div className="body"></div>
  </div>
);

// 人物组件：妈妈
const Mom = () => (
  <div className="person mom">
    <div className="head">
      <div className="hair"></div>
      <div className="curl"></div><div className="curl"></div><div className="curl"></div>
      <div className="curl"></div><div className="curl"></div>
      <div className="ear l"></div><div className="ear r"></div>
      <div className="eyes"><div className="eye"></div><div className="eye"></div></div>
      <div className="smile"></div>
    </div>
    <div className="body"></div>
  </div>
);

// 人物组件：孩子 (你)
const Child = () => (
  <div className="person child">
    <div className="head">
      <div className="hair"></div>
      <div className="ear l"></div><div className="ear r"></div>
      <div className="eyes"><div className="eye"></div><div className="eye"></div></div>
      <div className="smile"></div>
    </div>
    <div className="body"></div>
  </div>
);

// 宠物组件：布偶猫
const Cat = () => (
  <div className="cat">
    <div className="cat-head">
      <div className="cat-ear l"></div><div className="cat-ear r"></div>
      <div className="cat-ear-inner l"></div><div className="cat-ear-inner r"></div>
      <div className="cat-eyes"><div className="cat-eye"></div><div className="cat-eye"></div></div>
      <div className="cat-nose"></div>
      <div className="cat-whisker l1"></div><div className="cat-whisker l2"></div>
      <div className="cat-whisker r1"></div><div className="cat-whisker r2"></div>
    </div>
    <div className="cat-body">
      <div className="cat-chest"></div>
      <div className="cat-tail"></div>
    </div>
  </div>
);

export default function FamilyScene() {
  return (
    <div id="scene-family" className="scene visible">
      <div className="family-ambient"></div>
      <div className="family-floor"></div>
      <div className="family-rug"></div>
      <div className="wall-frame wall-frame-1"></div>
      <div className="wall-frame wall-frame-2"></div>

      {/* 祝福文字 */}
      <div className="family-wish">
        <div className="family-wish-line">天天开心</div>
        <div className="family-wish-line">身体健康</div>
      </div>

      {/* 漂浮的心形 */}
      <div className="heart" style={{ top: '18%', left: '20%', animationDelay: '0s' }}>♥</div>
      <div className="heart" style={{ top: '22%', left: '75%', animationDelay: '1.2s', fontSize: '10px' }}>♥</div>
      <div className="heart" style={{ top: '30%', left: '40%', animationDelay: '2.8s', fontSize: '18px' }}>♥</div>

      {/* 核心人物与家具 */}
      <Dad />
      <Mom />
      <Child />
      <Cat />

      {/* 沙发 */}
      <div className="sofa">
        <div className="sofa-arm left"></div>
        <div className="sofa-back"></div>
        <div className="sofa-seat"></div>
        <div className="sofa-arm right"></div>
      </div>

      {/* 咖啡桌与小蛋糕 */}
      <div className="coffee-table">
        <div className="ct-top"></div>
        <div className="ct-legs"><div className="ct-leg"></div><div className="ct-leg"></div></div>
      </div>
      
      <div className="mini-cake">
        <div className="mc-flame"></div>
        <div className="mc-candle"></div>
        <div className="mc-frosting"></div>
        <div className="mc-body"></div>
        <div className="mc-plate"></div>
      </div>
    </div>
  );
}