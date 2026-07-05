import { useEffect, useState } from 'react';

const LINE1 = 'Use your money';
const LINE2 = 'to make a life.';
const TYPE_SPEED = 55;
const PAUSE_BEFORE_LINE2 = 280;
const PAUSE_BEFORE_RESET = 4500;

export default function TypewriterTitle() {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [onLine2, setOnLine2] = useState(false);
  const [done, setDone] = useState(false);

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
      <span className="hero__title-line">
        {line1}
        {showCursorLine1 && <span className="hero__cursor hero__cursor--light" aria-hidden="true" />}
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
    </h1>
  );
}
