import { ImageResponse } from "next/og";

export const alt = "Dispute Explorer — OP Stack Fault Proof Games";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0c",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Mosaic pattern background */}
        <svg
          width="1200"
          height="630"
          style={{ position: "absolute", top: 0, left: 0, opacity: 0.06 }}
        >
          <defs>
            <pattern
              id="m"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0L60 30L30 60L0 30Z"
                fill="none"
                stroke="#f97316"
                strokeWidth="0.8"
              />
              <path
                d="M30 15L45 30L30 45L15 30Z"
                fill="none"
                stroke="#f97316"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="1200" height="630" fill="url(#m)" />
        </svg>

        {/* Fault line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background:
              "linear-gradient(to right, transparent, #f97316 30%, #f97316 50%, #ef4444 70%, transparent)",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: 72,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: "#f97316" }}>DISPUTE</span>
          <span style={{ color: "#52525b", fontWeight: 300 }}>/</span>
          <span style={{ color: "#e4e4e7" }}>EXPLORER</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#52525b",
            marginTop: 16,
            fontFamily: "monospace",
          }}
        >
          OP Stack Fault Proof Games
        </div>

        {/* Chain badges */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
            fontSize: 18,
            fontFamily: "monospace",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
              }}
            />
            <span style={{ color: "#a1a1aa" }}>OP Mainnet</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#3b82f6",
              }}
            />
            <span style={{ color: "#a1a1aa" }}>Base</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#a855f7",
              }}
            />
            <span style={{ color: "#a1a1aa" }}>Ink</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ec4899",
              }}
            />
            <span style={{ color: "#a1a1aa" }}>Unichain</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 40,
            fontSize: 16,
            color: "#3f3f46",
            fontFamily: "monospace",
          }}
        >
          disputes.slopo.net
        </div>
      </div>
    ),
    { ...size }
  );
}
