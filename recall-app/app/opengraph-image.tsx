import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sọrọ Sọkẹ AI — Practice the moment before the anxiety does.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fetches a Google Font as raw TTF data for use in ImageResponse (Satori
// needs actual font bytes, not a font-family name). The CSS2 endpoint
// serves TTF/OTF to Node's default fetch UA rather than the woff2 it
// serves browsers — no special headers needed. Returns null on any
// failure so the card still renders (with Satori's default font) instead
// of failing the build if the fetch is ever unavailable.
async function loadGoogleFont(weight: number, italic: boolean): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({
      family: `Cormorant Garamond:ital,wght@${italic ? 1 : 0},${weight}`,
    });
    const css = await fetch(`https://fonts.googleapis.com/css2?${params}`).then((r) => r.text());
    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const [displayRegular, displayItalic] = await Promise.all([
    loadGoogleFont(600, false),
    loadGoogleFont(600, true),
  ]);

  const fonts = [
    displayRegular ? { name: "Cormorant Garamond", data: displayRegular, weight: 600 as const, style: "normal" as const } : null,
    displayItalic ? { name: "Cormorant Garamond Italic", data: displayItalic, weight: 600 as const, style: "normal" as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  const displayFont = displayRegular ? "Cormorant Garamond" : undefined;
  const italicFont = displayItalic ? "Cormorant Garamond Italic" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          padding: "72px 88px",
          position: "relative",
        }}
      >
        {/* Soft glow, echoing the pwa icon treatment */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,119,6,0.16) 0%, rgba(52,211,153,0.05) 55%, transparent 75%)",
            display: "flex",
          }}
        />

        {/* Wordmark row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width={52} height={46} viewBox="30 20 180 160">
            <path d="M54 54 C70 82 70 118 54 146 L146 146 C130 118 130 82 146 54 Z" fill="#D97706" />
            <path d="M64 58 C76 84 76 116 64 142" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M82 58 C89 85 89 115 82 142" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="100" y1="58" x2="100" y2="142" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M118 58 C111 85 111 115 118 142" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M136 58 C124 84 124 116 136 142" fill="none" stroke="#7C2D12" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="100" cy="52" rx="48" ry="13" fill="#FDE68A" />
            <ellipse cx="100" cy="148" rx="48" ry="13" fill="#F59E0B" />
            <path d="M158 38 a16 16 0 0 1 0 28" fill="none" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" />
            <path d="M172 30 a26 26 0 0 1 0 44" fill="none" stroke="#FCD34D" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          </svg>
          <span
            style={{
              fontFamily: italicFont,
              fontStyle: italicFont ? "normal" : "italic",
              fontSize: 42,
              color: "#FBBF24",
              letterSpacing: "0.01em",
            }}
          >
            Sọrọ Sọkẹ
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: "#94A3B8",
              border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: 4,
              padding: "5px 9px",
              marginLeft: 4,
            }}
          >
            AI
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontFamily: displayFont,
            fontSize: 66,
            fontWeight: 600,
            lineHeight: 1.15,
            color: "#F1F5F9",
            maxWidth: 980,
          }}
        >
          Practice the moment before the anxiety does.
        </div>

        {/* Pillars */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#94A3B8" }}>
          <span>Vocabulary</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Speaking</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Conversation</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Debate</span>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined }
  );
}
