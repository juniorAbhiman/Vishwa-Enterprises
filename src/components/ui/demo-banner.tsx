'use client';

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

const VISIBLE_MS = 6000; // how long it stays before auto-closing

export function DemoBanner() {
  // 'enter' → animating in, 'hold' → fully visible, 'exit' → animating out, 'gone' → unmounted
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit' | 'gone'>('enter');

  useEffect(() => {
    // force a paint at 'enter' so the transition to 'hold' actually runs
    const raf = requestAnimationFrame(() => setPhase('hold'));

    const autoClose = window.setTimeout(() => setPhase('exit'), VISIBLE_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(autoClose);
    };
  }, []);

  // unmount after exit animation completes
  useEffect(() => {
    if (phase !== 'exit') return;
    const t = window.setTimeout(() => setPhase('gone'), 600);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === 'gone') return null;

  const visible = phase === 'hold';

  return (
    <>
      <style jsx global>{`
        @keyframes demoPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(211, 51, 51, 0.35);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(211, 51, 51, 0);
          }
        }
      `}</style>

      <div
        role="note"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '10px 44px 10px 16px',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.01em',
          textAlign: 'center',
          color: '#3a2f10',
          background:
            'linear-gradient(90deg, #fdf2c6 0%, #f1e2b8 50%, #fdf2c6 100%)',
          borderBottom: '1px solid #e3d09a',

          // enter / exit animation
          overflow: 'hidden',
          maxHeight: visible ? 60 : 0,
          opacity: visible ? 1 : 0,
          paddingTop: visible ? 10 : 0,
          paddingBottom: visible ? 10 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          transition:
            'max-height 550ms cubic-bezier(0.4,0,0.2,1), opacity 380ms ease, padding 550ms cubic-bezier(0.4,0,0.2,1), transform 550ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Attention pulse */}
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#d33',
            color: '#fff',
            flex: '0 0 20px',
            animation: 'demoPulse 2s ease-in-out infinite',
          }}
        >
          <Info size={12} />
        </span>

        <span>
          <strong style={{ color: '#a53a36' }}>DEMO CATALOG</strong> · Prices
          and stock are sample values. Vishwa Enterprises will confirm them
          before fulfilling an order.
        </span>

        {/* Manual close */}
        <button
          type="button"
          aria-label="Dismiss notice"
          onClick={() => setPhase('exit')}
          style={{
            position: 'absolute',
            top: '50%',
            right: 10,
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 26,
            height: 26,
            border: 0,
            borderRadius: 8,
            background: 'rgba(0,0,0,0.05)',
            color: '#3a2f10',
            cursor: 'pointer',
          }}
        >
          <X size={13} />
        </button>
      </div>
    </>
  );
}