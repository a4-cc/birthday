'use client';
import { useState, useEffect } from 'react';

export default function SuspenseIntro({ onEnter }: { onEnter: () => void }) {
  // Phase 0: pure black
  // Phase 1: first line fades in ("这是个什么网页？")
  // Phase 2: second line fades in ("不会是诈骗网站吧？")
  // Phase 3: buttons appear
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // stagger through phases
    const timers = [
      setTimeout(() => setPhase(1), 1800),  // first line after 1.8 s of pure black
      setTimeout(() => setPhase(2), 3800),  // second line 2 s later
      setTimeout(() => setPhase(3), 5600),  // buttons 1.8 s after that
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleClick = () => {
    setLeaving(true);                       // fade-out starts
    setTimeout(onEnter, 600);               // hand off after the fade
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0px',
      overflow: 'hidden',
      opacity: leaving ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>

      {/* ── Line 1 ── */}
      <div style={{
        color: '#c8c0b8',
        fontSize: '22px',
        fontFamily: "'Georgia', serif",
        letterSpacing: '2px',
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 1.4s ease, transform 1.4s ease',
        marginBottom: '18px',
        pointerEvents: 'none',
      }}>
        这是个什么网页？
      </div>

      {/* ── Line 2 ── */}
      <div style={{
        color: '#8a8078',
        fontSize: '18px',
        fontFamily: "'Georgia', serif",
        letterSpacing: '1px',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 1.2s ease, transform 1.2s ease',
        marginBottom: '52px',
        pointerEvents: 'none',
      }}>
        不会是诈骗网站吧？
      </div>

      {/* ── Buttons ── */}
      <div style={{
        display: 'flex',
        gap: '20px',
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
      }}>
        <button
          onClick={handleClick}
          style={{
            padding: '11px 28px',
            fontSize: '15px',
            color: '#e8ddd0',
            background: 'rgba(60,55,50,0.7)',
            border: '1px solid rgba(180,170,155,0.25)',
            borderRadius: '8px',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            fontFamily: "'Georgia', serif",
            transition: 'background 0.25s, border-color 0.25s, transform 0.15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'rgba(80,75,68,0.85)';
            (e.target as HTMLElement).style.borderColor = 'rgba(200,190,170,0.4)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'rgba(60,55,50,0.7)';
            (e.target as HTMLElement).style.borderColor = 'rgba(180,170,155,0.25)';
          }}
          onMouseDown={e => (e.target as HTMLElement).style.transform = 'scale(0.96)'}
          onMouseUp={e => (e.target as HTMLElement).style.transform = 'scale(1)'}
        >
          访问
        </button>

        <button
          onClick={handleClick}
          style={{
            padding: '11px 28px',
            fontSize: '15px',
            color: '#d4c8b8',
            background: 'rgba(45,42,38,0.6)',
            border: '1px solid rgba(150,140,125,0.2)',
            borderRadius: '8px',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            fontFamily: "'Georgia', serif",
            transition: 'background 0.25s, border-color 0.25s, transform 0.15s',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.background = 'rgba(60,56,50,0.75)';
            (e.target as HTMLElement).style.borderColor = 'rgba(170,160,140,0.35)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'rgba(45,42,38,0.6)';
            (e.target as HTMLElement).style.borderColor = 'rgba(150,140,125,0.2)';
          }}
          onMouseDown={e => (e.target as HTMLElement).style.transform = 'scale(0.96)'}
          onMouseUp={e => (e.target as HTMLElement).style.transform = 'scale(1)'}
        >
          不管了，坚持访问
        </button>
      </div>
    </div>
  );
}