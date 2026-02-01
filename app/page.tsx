'use client';
import { useState } from 'react';
import CakeScene from '@/components/CakeScene';
import HarbourScene from '@/components/HarbourScene';
import FamilyScene from '@/components/FamilyScene';
import SuspenseIntro from '@/components/SuspenseIntro';

export default function BirthdayProject() {
  const [scene, setScene] = useState<'suspense' | 'cake' | 'harbour' | 'family'>('suspense');
  const [isLit, setIsLit] = useState(false);

  const handleLit = () => {
    setIsLit(true);
    setTimeout(() => setScene('harbour'), 4500);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {scene === 'suspense' && (
        <SuspenseIntro onEnter={() => setScene('cake')} />
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