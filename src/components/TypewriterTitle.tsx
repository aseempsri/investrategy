import { useEffect, useState } from 'react';
import { company } from '../data/content';

const [LINE1, LINE2] = (() => {
  const colon = company.tagline.indexOf(':');
  if (colon === -1) return [company.tagline, ''] as const;
  return [
    company.tagline.slice(0, colon + 1),
    company.tagline.slice(colon + 1).trim(),
  ] as const;
})();

const TYPE_SPEED = 48;
const PAUSE_BEFORE_LINE2 = 320;
const PAUSE_BEFORE_RESET = 4500;
const FADE_MS = 280;

export default function TypewriterTitle() {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [onLine2, setOnLine2] = useState(false);
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    const typeLine = async (text: string, setter: (v: string) => void) => {
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        setter(text.slice(0, i));
        await wait(TYPE_SPEED);
      }
    };

    const run = async () => {
      while (!cancelled) {
        setFading(false);
        setLine1('');
        setLine2('');
        setOnLine2(false);
        setDone(false);

        await typeLine(LINE1, setLine1);
        if (cancelled) return;

        await wait(PAUSE_BEFORE_LINE2);
        if (cancelled) return;

        setOnLine2(true);
        await typeLine(LINE2, setLine2);
        if (cancelled) return;

        setDone(true);
        await wait(PAUSE_BEFORE_RESET);
        if (cancelled) return;

        setFading(true);
        await wait(FADE_MS);
        if (cancelled) return;
      }
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  const showCursorLine1 = !onLine2;
  const showCursorLine2 = onLine2;

  return (
    <h1 className="hero__title">
      {/* Invisible full title reserves height so the hero never jumps */}
      <span className="hero__title-sizer" aria-hidden="true">
        <span className="hero__title-line">{LINE1}</span>
        <br />
        <span className="hero__title-line hero__title-line--accent">
          <span className="hero__title-accent">{LINE2}</span>
        </span>
      </span>

      <span
        className={`hero__title-typed${fading ? ' hero__title-typed--fade' : ''}`}
        aria-label={company.tagline}
      >
        <span className="hero__title-line">
          {line1}
          {showCursorLine1 && (
            <span className="hero__cursor hero__cursor--light" aria-hidden="true" />
          )}
        </span>
        <br />
        <span className="hero__title-line hero__title-line--accent">
          <span className="hero__title-accent">{line2}</span>
          {showCursorLine2 && (
            <span
              className={`hero__cursor hero__cursor--accent${done ? ' hero__cursor--idle' : ''}`}
              aria-hidden="true"
            />
          )}
        </span>
      </span>
    </h1>
  );
}
