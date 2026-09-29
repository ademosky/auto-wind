import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AUTO WIND — увоз и продажба на половни автомобили";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(1000px 600px at 14% -10%, #0e4a31 0%, rgba(14,74,49,0) 62%), radial-gradient(900px 520px at 94% 6%, rgba(201,167,90,0.22) 0%, rgba(201,167,90,0) 60%), linear-gradient(170deg, #03170e 0%, #062a1b 52%, #03170e 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 132,
              height: 132,
              borderRadius: 999,
              border: "3px solid #c9a75a",
              background: "linear-gradient(140deg, #0a3a26, #03170e)",
            }}
          >
            <svg width="88" height="88" viewBox="0 0 64 64">
              <path
                d="M14 37c.6-3.4 4.4-6.3 9.6-6.9 2.2-2.6 6-4.2 10.4-4.2 5.2 0 9.6 2.2 11.4 5.4l3.1 1.1c1.9.7 3.1 2.5 3.1 4.5v2.4H11.5v-2.4c0-.9.9-1.7 2.5-2z"
                fill="#c9a75a"
              />
              <circle cx="22" cy="42" r="4.4" fill="#03170e" stroke="#c9a75a" strokeWidth="2.6" />
              <circle cx="43" cy="42" r="4.4" fill="#03170e" stroke="#c9a75a" strokeWidth="2.6" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#e8d08a",
              }}
            >
              AUTO WIND
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 26,
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "rgba(246,243,236,0.6)",
              }}
            >
              Увоз · Проверка · Продажба
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 1000, height: 1, background: "rgba(201,167,90,0.45)" }} />
          <div
            style={{
              marginTop: 34,
              fontSize: 44,
              color: "#f6f3ec",
              lineHeight: 1.25,
              maxWidth: 900,
            }}
          >
            Половни автомобили со проверено потекло и целосна документација.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

