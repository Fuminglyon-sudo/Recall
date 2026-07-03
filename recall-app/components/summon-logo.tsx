"use client";

type Props = {
  fontSize?: string;
  color?: string;
  textShadow?: string;
  duration?: number;
};

// Each letter has a different starting blur/opacity — S is foggiest, n is already clear.
// They all resolve to clarity together, depicting the app's core promise.
const CHARS = [
  { char: "S", blurStart: 7,   opacityStart: 0.18 },
  { char: "u", blurStart: 5.5, opacityStart: 0.36 },
  { char: "m", blurStart: 4,   opacityStart: 0.53 },
  { char: "m", blurStart: 2.5, opacityStart: 0.68 },
  { char: "o", blurStart: 1.2, opacityStart: 0.83 },
  { char: "n", blurStart: 0,   opacityStart: 1    },
];

export function SummonLogo({
  fontSize = "1.9rem",
  color = "#fff",
  textShadow,
  duration = 1.4,
}: Props) {
  return (
    <>
      <style>{`
        @keyframes summonReveal {
          from {
            filter: blur(var(--blur-s, 0px));
            opacity: var(--opacity-s, 1);
          }
          to {
            filter: blur(0px);
            opacity: 1;
          }
        }
      `}</style>
      <span
        aria-label="Summon"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize,
          color,
          letterSpacing: "-0.01em",
          textShadow,
          display: "inline-flex",
          lineHeight: 1,
        }}
      >
        {CHARS.map((c, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={
              {
                "--blur-s": `${c.blurStart}px`,
                "--opacity-s": c.opacityStart,
                animation: `summonReveal ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
                display: "inline-block",
              } as React.CSSProperties
            }
          >
            {c.char}
          </span>
        ))}
      </span>
    </>
  );
}
