"use client";

type Props = {
  fontSize?: string;
  color?: string;
  textShadow?: string;
  duration?: number;
};

// Each character starts at a different blur/opacity — S is foggiest, ẹ already clear.
// They all resolve to clarity together: the word surfaces, like the right words finally coming.
const WORD1 = [
  { char: "S", blurStart: 7,   opacityStart: 0.18 },
  { char: "ọ", blurStart: 5.8, opacityStart: 0.30 },
  { char: "r", blurStart: 4.5, opacityStart: 0.45 },
  { char: "ọ", blurStart: 3.2, opacityStart: 0.60 },
];

const WORD2 = [
  { char: "S", blurStart: 2.5, opacityStart: 0.68 },
  { char: "ọ", blurStart: 1.8, opacityStart: 0.76 },
  { char: "k", blurStart: 1.0, opacityStart: 0.87 },
  { char: "ẹ", blurStart: 0,   opacityStart: 1    },
];

const CHARS = [...WORD1, null, ...WORD2]; // null = space between words

export function SummonLogo({
  fontSize = "1.9rem",
  color = "#fff",
  textShadow,
  duration = 1.4,
}: Props) {
  return (
    <>
      <style>{`
        @keyframes soroSokeReveal {
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
        aria-label="Sọrọ Sọkẹ AI"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize,
          color,
          letterSpacing: "0.01em",
          textShadow,
          display: "inline-flex",
          alignItems: "baseline",
          gap: 0,
          lineHeight: 1,
        }}
      >
        {CHARS.map((c, i) => {
          if (c === null) {
            return <span key={i} aria-hidden="true" style={{ display: "inline-block", width: "0.28em" }} />;
          }
          return (
            <span
              key={i}
              aria-hidden="true"
              style={
                {
                  "--blur-s": `${c.blurStart}px`,
                  "--opacity-s": c.opacityStart,
                  animation: `soroSokeReveal ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
                  display: "inline-block",
                } as React.CSSProperties
              }
            >
              {c.char}
            </span>
          );
        })}
        <span
          aria-hidden="true"
          style={{
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "0.52em",
            letterSpacing: "0.12em",
            color: "#34d399",
            marginLeft: "0.35em",
            opacity: 0.85,
            alignSelf: "center",
          }}
        >
          AI
        </span>
      </span>
    </>
  );
}
