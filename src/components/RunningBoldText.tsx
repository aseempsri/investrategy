import { useEffect, useMemo, useState } from 'react';

interface RunningBoldTextProps {
  paragraphs: string[];
  active?: boolean;
  charDelay?: number;
  pauseAtEnd?: number;
  className?: string;
}

export default function RunningBoldText({
  paragraphs,
  active = true,
  charDelay = 18,
  pauseAtEnd = 2500,
  className = '',
}: RunningBoldTextProps) {
  const paragraphOffsets = useMemo(() => {
    let offset = 0;
    return paragraphs.map((paragraph) => {
      const start = offset;
      offset += paragraph.length;
      return start;
    });
  }, [paragraphs]);

  const totalChars = useMemo(
    () => paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0),
    [paragraphs],
  );

  const [boldCount, setBoldCount] = useState(0);

  useEffect(() => {
    if (!active || totalChars === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setBoldCount(totalChars);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const tick = (count: number) => {
      if (cancelled) return;

      if (count >= totalChars) {
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            setBoldCount(0);
            timeoutId = setTimeout(() => tick(0), 400);
          }
        }, pauseAtEnd);
        return;
      }

      setBoldCount(count + 1);
      timeoutId = setTimeout(() => tick(count + 1), charDelay);
    };

    setBoldCount(0);
    timeoutId = setTimeout(() => tick(0), 600);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [active, totalChars, charDelay, pauseAtEnd]);

  return (
    <div className={`running-bold ${className}`.trim()}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p
          key={paragraphIndex}
          className={paragraphIndex === 0 ? 'about__lead' : undefined}
        >
          {[...paragraph].map((char, charIndex) => {
            const globalIndex = paragraphOffsets[paragraphIndex] + charIndex;
            const isBold = globalIndex < boldCount;

            return (
              <span
                key={charIndex}
                className={`running-bold__char${isBold ? ' running-bold__char--active' : ''}`}
              >
                {char}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
