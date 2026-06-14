import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #022c22 0%, #020617 100%)",
          borderRadius: 8,
          color: "#6ee7b7",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 2,
            borderRadius: 7,
            border: "1px solid rgba(110, 231, 183, 0.25)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 18,
            height: 18,
            borderRadius: 9999,
            background: "rgba(110, 231, 183, 0.12)",
            border: "1px solid rgba(110, 231, 183, 0.28)",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          R
        </div>
      </div>
    ),
    size
  );
}
