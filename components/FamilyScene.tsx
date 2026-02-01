'use client';
import React, { useState, useEffect } from 'react';

// ─── Character Components ────────────────────────────────────────────────────

const Dad = () => (
  <svg width="72" height="130" viewBox="0 0 72 130" style={{ position: 'absolute', bottom: '28%', left: '18%', zIndex: 8 }}>
    {/* Body / shirt */}
    <ellipse cx="36" cy="108" rx="28" ry="22" fill="#4a6fa5" />
    {/* Collar */}
    <path d="M24 88 L36 96 L48 88" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Neck */}
    <rect x="31" y="72" width="10" height="16" rx="4" fill="#e8c4a0" />
    {/* Head */}
    <ellipse cx="36" cy="58" rx="22" ry="24" fill="#e8c4a0" />
    {/* Hair */}
    <path d="M14 52 Q16 34 36 32 Q56 34 58 52 Q56 44 46 42 Q36 38 26 42 Q16 44 14 52Z" fill="#3d2b1f" />
    {/* Ears */}
    <ellipse cx="14" cy="58" rx="4" ry="6" fill="#dbb88a" />
    <ellipse cx="58" cy="58" rx="4" ry="6" fill="#dbb88a" />
    {/* Eyes */}
    <ellipse cx="27" cy="58" rx="2.8" ry="3" fill="#fff" />
    <ellipse cx="45" cy="58" rx="2.8" ry="3" fill="#fff" />
    <circle cx="27" cy="58.5" r="2" fill="#2c1810" />
    <circle cx="45" cy="58.5" r="2" fill="#2c1810" />
    <circle cx="27.6" cy="57.5" r="0.7" fill="#fff" />
    <circle cx="45.6" cy="57.5" r="0.7" fill="#fff" />
    {/* Eyebrows */}
    <path d="M22 52 Q27 50 32 52" stroke="#3d2b1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    <path d="M40 52 Q45 50 50 52" stroke="#3d2b1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    {/* Smile */}
    <path d="M28 68 Q36 74 44 68" stroke="#c06050" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Arms */}
    <path d="M10 100 Q4 112 12 120" stroke="#4a6fa5" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M62 100 Q68 112 60 120" stroke="#4a6fa5" strokeWidth="10" fill="none" strokeLinecap="round" />
  </svg>
);

const Mom = () => (
  <svg width="68" height="125" viewBox="0 0 68 125" style={{ position: 'absolute', bottom: '28%', left: '72%', zIndex: 8 }}>
    {/* Body / dress */}
    <ellipse cx="34" cy="105" rx="26" ry="20" fill="#c46a8a" />
    {/* Necklace */}
    <path d="M22 84 Q34 90 46 84" stroke="#d4a844" strokeWidth="1.5" fill="none" />
    <circle cx="34" cy="90" r="2" fill="#d4a844" />
    {/* Neck */}
    <rect x="29" y="70" width="10" height="14" rx="4" fill="#e8c4a0" />
    {/* Head */}
    <ellipse cx="34" cy="54" rx="21" ry="23" fill="#e8c4a0" />
    {/* Hair – short curly, tight around the head */}
    {/* Base cap covering the top */}
    <ellipse cx="34" cy="42" rx="22" ry="16" fill="#5c3d2e" />
    {/* Curl clusters – top */}
    <circle cx="22" cy="36" r="7" fill="#5c3d2e" />
    <circle cx="34" cy="33" r="8" fill="#5c3d2e" />
    <circle cx="46" cy="36" r="7" fill="#5c3d2e" />
    {/* Ears – drawn before side curls so curls overlap them slightly */}
    <ellipse cx="13" cy="54" rx="3.5" ry="5.5" fill="#dbb88a" />
    <ellipse cx="55" cy="54" rx="3.5" ry="5.5" fill="#dbb88a" />
    {/* Curl clusters – sides (short, not hanging) */}
    <circle cx="14" cy="46" r="5.5" fill="#5c3d2e" />
    <circle cx="54" cy="46" r="5.5" fill="#5c3d2e" />
    <circle cx="17" cy="52" r="4.5" fill="#5c3d2e" />
    <circle cx="51" cy="52" r="4.5" fill="#5c3d2e" />
    {/* Highlight curls for volume */}
    <circle cx="26" cy="35" r="4" fill="#6e4d3a" />
    <circle cx="42" cy="35" r="4" fill="#6e4d3a" />
    <circle cx="34" cy="32" r="4.5" fill="#6e4d3a" />
    {/* Eyes */}
    <ellipse cx="25" cy="55" rx="2.5" ry="2.8" fill="#3a2518" />
    <ellipse cx="43" cy="55" rx="2.5" ry="2.8" fill="#3a2518" />
    {/* Eyelashes */}
    <path d="M22 52 L21 50 M24 51.5 L24 49.5 M26 52 L27 50" stroke="#3a2518" strokeWidth="1" fill="none" strokeLinecap="round" />
    <path d="M40 52 L39 50 M42 51.5 L42 49.5 M44 52 L45 50" stroke="#3a2518" strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* Eyebrows */}
    <path d="M21 50 Q25 48 29 50" stroke="#5c3d2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M39 50 Q43 48 47 50" stroke="#5c3d2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Nose */}
    <path d="M33 56 L32 60 L35 60" stroke="#d4a888" strokeWidth="1" fill="none" />
    {/* Smile */}
    <path d="M26 65 Q34 71 42 65" stroke="#c06070" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Lipstick */}
    <path d="M29 64 Q34 67 39 64" fill="#d04868" />
    {/* Arms */}
    <path d="M10 96 Q5 108 11 116" stroke="#c46a8a" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M58 96 Q63 108 57 116" stroke="#c46a8a" strokeWidth="9" fill="none" strokeLinecap="round" />
  </svg>
);

const Child = () => (
  <svg width="52" height="100" viewBox="0 0 52 100" style={{ position: 'absolute', bottom: '28%', left: '44%', zIndex: 9 }}>
    {/* Body */}
    <ellipse cx="26" cy="80" rx="20" ry="18" fill="#f0a050" />
    {/* T-shirt collar */}
    <path d="M16 66 L26 72 L36 66" stroke="#e89040" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Neck */}
    <rect x="22" y="56" width="8" height="12" rx="3" fill="#f0d4b0" />
    {/* Hair – back layer (behind head, gives length) – drawn BEFORE head */}
    <path d="M8 36 Q5 55 7 78 Q9 86 14 82 Q11 60 12 40" fill="#2c1810" />
    <path d="M44 36 Q47 55 45 78 Q43 86 38 82 Q41 60 40 40" fill="#2c1810" />
    {/* Head */}
    <ellipse cx="26" cy="42" rx="18" ry="20" fill="#f0d4b0" />
    {/* Hair – top cap (on top of head) */}
    <path d="M8 38 Q10 22 26 20 Q42 22 44 38 Q42 32 34 30 Q26 27 18 30 Q10 32 8 38Z" fill="#2c1810" />
    {/* Centre parting */}
    <path d="M26 20 Q26 28 26 34" stroke="#3d2b1f" strokeWidth="1.5" fill="none" />
    {/* Side strands – left (on top of head edge) */}
    <path d="M9 40 Q6 54 8 72 Q9 78 13 76 Q10 58 11 44" fill="#2c1810" />
    {/* Side strands – right */}
    <path d="M43 40 Q46 54 44 72 Q43 78 39 76 Q42 58 41 44" fill="#2c1810" />
    {/* Ears */}
    <ellipse cx="8" cy="42" rx="3.5" ry="5" fill="#e4c49c" />
    <ellipse cx="44" cy="42" rx="3.5" ry="5" fill="#e4c49c" />
    {/* Eyes (bigger, cuter) */}
    <ellipse cx="19" cy="43" rx="3" ry="3.5" fill="#fff" />
    <ellipse cx="33" cy="43" rx="3" ry="3.5" fill="#fff" />
    <circle cx="19" cy="44" r="2.2" fill="#3a2518" />
    <circle cx="33" cy="44" r="2.2" fill="#3a2518" />
    <circle cx="19.8" cy="42.8" r="0.9" fill="#fff" />
    <circle cx="33.8" cy="42.8" r="0.9" fill="#fff" />
    {/* Eyebrows */}
    <path d="M15 39 Q19 37.5 23 39" stroke="#2c1810" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    <path d="M29 39 Q33 37.5 37 39" stroke="#2c1810" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    {/* Cheek blush */}
    <ellipse cx="13" cy="48" rx="3.5" ry="2" fill="rgba(240,150,130,0.45)" />
    <ellipse cx="39" cy="48" rx="3.5" ry="2" fill="rgba(240,150,130,0.45)" />
    {/* Big smile */}
    <path d="M18 52 Q26 58 34 52" stroke="#c05040" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    {/* Arms */}
    <path d="M8 74 Q3 84 9 90" stroke="#f0a050" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M44 74 Q49 84 43 90" stroke="#f0a050" strokeWidth="8" fill="none" strokeLinecap="round" />
  </svg>
);

const Cat = () => (
  <svg width="56" height="58" viewBox="0 0 56 58" style={{ position: 'absolute', bottom: '28%', left: '33%', zIndex: 7 }}>
    {/* Body */}
    <ellipse cx="28" cy="46" rx="18" ry="12" fill="#f5e6d8" />
    {/* Chest patch */}
    <ellipse cx="28" cy="44" rx="10" ry="8" fill="#fff" />
    {/* Head */}
    <ellipse cx="28" cy="22" rx="16" ry="14" fill="#f5e6d8" />
    {/* Ears */}
    <polygon points="14,12 10,0 20,8" fill="#f5e6d8" />
    <polygon points="42,12 46,0 36,8" fill="#f5e6d8" />
    {/* Inner ears */}
    <polygon points="15,11 12,3 19,9" fill="#e8b4b0" />
    <polygon points="41,11 44,3 37,9" fill="#e8b4b0" />
    {/* Eyes (big, cute) */}
    <ellipse cx="20" cy="22" rx="4" ry="4.5" fill="#fff" />
    <ellipse cx="36" cy="22" rx="4" ry="4.5" fill="#fff" />
    <ellipse cx="20" cy="23" rx="2.8" ry="3.2" fill="#3a8a3a" />
    <ellipse cx="36" cy="23" rx="2.8" ry="3.2" fill="#3a8a3a" />
    <ellipse cx="20" cy="23.5" rx="1.4" ry="2.5" fill="#1a1a1a" />
    <ellipse cx="36" cy="23.5" rx="1.4" ry="2.5" fill="#1a1a1a" />
    <circle cx="20.6" cy="21.5" r="0.8" fill="#fff" />
    <circle cx="36.6" cy="21.5" r="0.8" fill="#fff" />
    {/* Nose */}
    <polygon points="28,27 26,29 30,29" fill="#e88a8a" />
    {/* Mouth */}
    <path d="M28 29 L28 31 M26 32 Q28 33.5 30 32" stroke="#c06060" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="6" y1="27" x2="18" y2="28" stroke="#aaa" strokeWidth="0.7" />
    <line x1="6" y1="29" x2="18" y2="29" stroke="#aaa" strokeWidth="0.7" />
    <line x1="38" y1="28" x2="50" y2="27" stroke="#aaa" strokeWidth="0.7" />
    <line x1="38" y1="29" x2="50" y2="29" stroke="#aaa" strokeWidth="0.7" />
    {/* Tail */}
    <path d="M46 46 Q56 40 52 32" stroke="#f5e6d8" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M46 46 Q56 40 52 32" stroke="#e8d0c0" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

// ─── Main Scene ──────────────────────────────────────────────────────────────
export default function FamilyScene() {
  const [hearts, setHearts] = useState<{ id: number; x: number; size: number; delay: number; dur: number }[]>([]);

  useEffect(() => {
    // Generate floating hearts
    setHearts(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: 8 + (i * 9.2) % 88,
        size: 10 + (i % 4) * 6,
        delay: i * 0.6,
        dur: 4 + (i % 3) * 1.5,
      }))
    );
  }, []);

  return (
    <div
      id="scene-family"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #2a1f14 0%, #3d2e1e 40%, #4a3828 100%)',
        overflow: 'hidden',
      }}
    >
      {/* ── Warm ambient light (top center, like a ceiling lamp) ── */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(255,210,140,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Wall ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '68%',
          background: 'linear-gradient(180deg, #3a2d1f 0%, #4a3c2c 100%)',
          zIndex: 2,
        }}
      >
        {/* Subtle wood grain texture lines */}
        {[15, 30, 50, 70].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 10%, rgba(255,220,180,0.04) 50%, transparent 90%)',
            }}
          />
        ))}
      </div>

      {/* ── Floor ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32%',
          background: 'linear-gradient(180deg, #5a4530 0%, #6e5540 50%, #5a4530 100%)',
          zIndex: 2,
        }}
      >
        {/* Floor wood planks */}
        {[0, 25, 50, 75].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${left}%`,
              width: '25%',
              borderRight: '1px solid rgba(0,0,0,0.15)',
            }}
          />
        ))}
      </div>

      {/* ── Rug ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '22%',
          background: 'linear-gradient(135deg, #8b6f4e 0%, #a08060 30%, #c4a882 50%, #a08060 70%, #8b6f4e 100%)',
          borderRadius: '12px',
          zIndex: 3,
          boxShadow: '0 -2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Rug pattern border */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            border: '1.5px solid rgba(255,220,180,0.2)',
            borderRadius: '8px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            border: '1px solid rgba(255,220,180,0.1)',
            borderRadius: '6px',
          }}
        />
      </div>

      {/* ── Wall frames ── */}
      {/* Frame 1 – left */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '8%',
          width: '14%',
          aspectRatio: '3/4',
          background: 'linear-gradient(135deg, #f5e6d0 0%, #ffe8c8 50%, #f0dcc0 100%)',
          border: '4px solid #6b5038',
          borderRadius: '3px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,220,180,0.15)',
          zIndex: 4,
          overflow: 'hidden',
        }}
      >
        {/* Abstract painting – warm strokes */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', top: '15%', left: '10%', width: '40%', height: '35%', background: 'radial-gradient(ellipse, #d4886a, transparent)', borderRadius: '50%', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: '40%', left: '45%', width: '35%', height: '30%', background: 'radial-gradient(ellipse, #a0c4a0, transparent)', borderRadius: '50%', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '55%', left: '15%', width: '30%', height: '25%', background: 'radial-gradient(ellipse, #8ab0d8, transparent)', borderRadius: '50%', opacity: 0.5 }} />
        </div>
      </div>

      {/* Frame 2 – right */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '8%',
          width: '13%',
          aspectRatio: '1/1',
          background: '#f0e8d8',
          border: '4px solid #5a4432',
          borderRadius: '3px',
          boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Simple heart illustration */}
        <div style={{ fontSize: '32%', color: '#d06060', marginTop: '-4px' }}>
          <svg width="36" height="34" viewBox="0 0 36 34">
            <path d="M18 32 C18 32 2 22 2 12 C2 6 6 2 11 2 C14 2 17 4 18 7 C19 4 22 2 25 2 C30 2 34 6 34 12 C34 22 18 32 18 32Z" fill="#d06060" />
          </svg>
        </div>
      </div>

      {/* ── Sofa ── */}
      <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: '58%', zIndex: 6 }}>
        {/* Back cushion */}
        <div
          style={{
            width: '100%',
            height: '52px',
            background: 'linear-gradient(180deg, #6b8caa 0%, #5a7a98 100%)',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 -2px 6px rgba(0,0,0,0.15)',
          }}
        />
        {/* Seat */}
        <div
          style={{
            width: '100%',
            height: '34px',
            background: 'linear-gradient(180deg, #5a7a98 0%, #4e6a88 100%)',
            borderRadius: '0 0 6px 6px',
          }}
        />
        {/* Left arm */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '-18px',
            width: '22px',
            height: '72px',
            background: 'linear-gradient(180deg, #6b8caa 0%, #4e6a88 100%)',
            borderRadius: '10px 4px 4px 10px',
          }}
        />
        {/* Right arm */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '-18px',
            width: '22px',
            height: '72px',
            background: 'linear-gradient(180deg, #6b8caa 0%, #4e6a88 100%)',
            borderRadius: '4px 10px 10px 4px',
          }}
        />
        {/* Seat cushions (3 pillows) */}
        {[18, 41, 64].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              top: '52px',
              left: `${left}%`,
              width: '22%',
              height: '28px',
              background: 'linear-gradient(180deg, #7a9cb8, #5a7a98)',
              borderRadius: '6px',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      {/* ── Coffee Table ── */}
      <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: '34%', zIndex: 5 }}>
        {/* Table top */}
        <div
          style={{
            width: '100%',
            height: '10px',
            background: 'linear-gradient(180deg, #8a7058, #7a6048)',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        />
        {/* Legs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 6%' }}>
          <div style={{ width: '6px', height: '28px', background: '#6a5540', borderRadius: '0 0 3px 3px' }} />
          <div style={{ width: '6px', height: '28px', background: '#6a5540', borderRadius: '0 0 3px 3px' }} />
        </div>
      </div>

      {/* ── Mini Cake on table ── */}
      <div style={{ position: 'absolute', bottom: '14.5%', left: '50%', transform: 'translateX(-50%)', zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Flame */}
        <div style={{ width: '8px', height: '14px', background: 'linear-gradient(to top, #ff9a00, #ffdd44, #fff8e0)', borderRadius: '50% 50% 30% 30%', animation: 'miniFlame 0.15s infinite alternate', boxShadow: '0 0 6px 2px rgba(255,180,60,0.5)', marginBottom: '1px' }} />
        {/* Candle */}
        <div style={{ width: '5px', height: '14px', background: 'linear-gradient(to bottom, #ff8888, #cc5555)', borderRadius: '2px 2px 1px 1px' }} />
        {/* Frosting */}
        <div style={{ width: '38px', height: '10px', background: 'linear-gradient(180deg, #fff5e6, #ffe0cc)', borderRadius: '50% 50% 0 0' }} />
        {/* Cake body */}
        <div style={{ width: '38px', height: '22px', background: 'linear-gradient(180deg, #f5c8a0, #d4886a)', borderRadius: '0 0 3px 3px' }} />
        {/* Plate */}
        <div style={{ width: '48px', height: '5px', background: 'linear-gradient(180deg, #e8e0d8, #c8c0b8)', borderRadius: '50%' }} />
      </div>

      {/* ── Characters ── */}
      <Dad />
      <Mom />
      <Child />
      <Cat />

      {/* ── Wish text (top center) ── */}
      <div
        style={{
          position: 'absolute',
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          animation: 'wishFadeIn 1.5s ease forwards',
        }}
      >
        <div
          style={{
            fontSize: '22px',
            color: '#ffd88a',
            fontFamily: "'Georgia', serif",
            letterSpacing: '4px',
            textShadow: '0 0 16px rgba(255,200,100,0.4)',
            marginBottom: '6px',
          }}
        >
          天天开心
        </div>
        <div
          style={{
            fontSize: '18px',
            color: '#ffb86a',
            fontFamily: "'Georgia', serif",
            letterSpacing: '3px',
            textShadow: '0 0 12px rgba(255,180,80,0.3)',
          }}
        >
          身体健康
        </div>
      </div>

      {/* ── Floating Hearts ── */}
      {hearts.map((h) => (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: `${h.x}%`,
            fontSize: `${h.size}px`,
            color: `hsl(${340 + (h.id * 12) % 40}, 70%, 65%)`,
            animation: `heartFloat ${h.dur}s ${h.delay}s infinite linear`,
            zIndex: 11,
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          ♥
        </div>
      ))}

      {/* ── Warm glow on floor (lamplight pool) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '30%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,200,120,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes miniFlame {
          0%  { transform: scaleX(1)    scaleY(1)    rotate(-1deg); }
          100%{ transform: scaleX(1.2)  scaleY(0.9)  rotate(1.5deg); }
        }
        @keyframes heartFloat {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
          8%   { opacity: 0.7; }
          90%  { opacity: 0.5; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes wishFadeIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0);     }
        }
      `}</style>
    </div>
  );
}