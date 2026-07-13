import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #020c1b 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "22%",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          fontStyle: "italic",
          color: "#34d399",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        SS
      </div>
    </div>,
    { ...size },
  );
}
