import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = Math.min(Math.max(parseInt(sizeParam, 10) || 512, 16), 1024);
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.42);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#0f172a",
          borderRadius: radius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle emerald glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(52,211,153,0.14) 0%, transparent 70%)",
          }}
        />
        {/* SS logotype */}
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize,
            fontWeight: 800,
            fontStyle: "italic",
            color: "#34d399",
            letterSpacing: "-0.06em",
            lineHeight: 1,
            paddingBottom: Math.round(size * 0.04),
          }}
        >
          SS
        </span>
      </div>
    ),
    { width: size, height: size }
  );
}
