import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #00B5C8 0%, #6B3FA0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-4px",
            lineHeight: 1,
          }}
        >
          Doonnia
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginTop: 16,
            fontWeight: 400,
          }}
        >
          Ghana&apos;s Online Marketplace
        </div>

        {/* Category chips */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
          }}
        >
          {["Electronics", "Fashion", "Home & Living", "Beauty"].map((cat) => (
            <div
              key={cat}
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "white",
                fontSize: 18,
                padding: "8px 20px",
                borderRadius: 40,
                fontWeight: 500,
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* GHS pill */}
        <div
          style={{
            marginTop: 40,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.4)",
            color: "white",
            fontSize: 20,
            padding: "10px 28px",
            borderRadius: 40,
            fontWeight: 600,
          }}
        >
          Fast Delivery · Secure Checkout · GH₵ Prices
        </div>
      </div>
    ),
    { ...size }
  );
}
