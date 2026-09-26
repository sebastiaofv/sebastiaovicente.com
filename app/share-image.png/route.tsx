import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#faf9f6", color: "#171717", padding: "72px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", fontSize: 26 }}>sebastiaovicente.com</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>{site.name}</div>
        <div style={{ display: "flex", fontSize: 32, lineHeight: 1.4, maxWidth: 950 }}>{site.description}</div>
      </div>
      <div style={{ display: "flex", height: 4, width: 100, background: "#171717" }} />
    </div>,
    { width: 1200, height: 630 },
  );
}
