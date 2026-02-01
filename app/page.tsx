'use client';
import { useState } from 'react';
import CakeScene from '@/components/CakeScene';
import HarbourScene from '@/components/HarbourScene';
import FamilyScene from '@/components/FamilyScene';

export default function BirthdayProject() {
  const [scene, setScene] = useState<'intro' | 'cake' | 'harbour' | 'family'>('intro');
  const [isLit, setIsLit] = useState(false);

  const handleStart = () => setScene('cake');

  const handleLit = () => {
    setIsLit(true);
    // 4秒后自动切场
    setTimeout(() => setScene('harbour'), 4500);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {scene === 'intro' && (
        <div id="intro-overlay" onClick={handleStart}>
          <span>轻轻点击屏幕开始 ✨</span>
        </div>
      )}

      {scene === 'cake' && (
        <CakeScene isLit={isLit} onLit={handleLit} />
      )}

      {scene === 'harbour' && (
        <HarbourScene onNext={() => setScene('family')} />
      )}

      {scene === 'family' && (
        <FamilyScene />
      )}
    </main>
  );
}