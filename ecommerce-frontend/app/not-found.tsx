import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en-GH">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#00B5C8", lineHeight: 1 }}>
            404
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "16px 0 8px" }}>
            Page not found
          </h1>
          <p style={{ color: "#6b7280", marginBottom: 28 }}>
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "#00B5C8",
              color: "white",
              padding: "12px 28px",
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            Back to Doonnia
          </a>
        </div>
      </body>
    </html>
  );
}
