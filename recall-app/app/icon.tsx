import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)",
        }}
      />
      {/* SS mark */}
      <div
        style={{
          fontSize: 230,
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
