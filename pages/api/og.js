import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

const serifItalic = fetch(
  new URL(
    "../../public/instrument-serif/Instrument_Serif/InstrumentSerif-Italic.ttf",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const sansRegular = fetch(
  new URL(
    "../../public/instrument-serif/Instrument_Sans/static/InstrumentSans-Regular.ttf",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

// Cropped/resized copy of photo4 from the /photos archive
const photo = fetch(new URL("../../public/og-photo.jpg", import.meta.url))
  .then((res) => res.arrayBuffer())
  .then((buf) => {
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  });

const RED = "#FF4444";
const PINK = "#FFEBEB";
const INK = "#2F0000";

function Boat({ width }) {
  return (
    <svg
      width={width}
      height={(width / 62) * 40}
      viewBox="0 0 62 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 14L12.5455 38M2 14L33.6364 27.3333M2 14H16M12.5455 38H49.4545L60 14M12.5455 38L33.6364 27.3333M60 14L33.6364 27.3333M60 14H46M12 18L29.7333 2L50 18M24 22L29.6 4L38 22"
        stroke={RED}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const [serifData, sansData, photoSrc] = await Promise.all([
    serifItalic,
    sansRegular,
    photo,
  ]);

  const isEssay = Boolean(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: PINK,
          position: "relative",
        }}
      >
        {/* left: text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            padding: "56px 24px 48px 72px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Boat width={104} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
              paddingBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "Instrument Serif",
                fontStyle: "italic",
                fontSize: isEssay ? (title.length > 40 ? 60 : 76) : 116,
                lineHeight: 1.04,
                color: RED,
                maxWidth: 660,
                display: "block",
                lineClamp: 4,
              }}
            >
              {isEssay ? title : "Sahiti Dasari"}
            </div>
            <div
              style={{
                fontFamily: "Instrument Sans",
                fontSize: 27,
                lineHeight: 1.45,
                color: INK,
                maxWidth: 620,
                marginTop: 26,
              }}
            >
              {isEssay
                ? "an essay by Sahiti Dasari"
                : "student & developer in love with storytelling through human-centered technology."}
            </div>
          </div>

          {/* footer: rule + motto, mirroring the site footer */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: 640,
                height: 4,
                backgroundColor: RED,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 640,
              }}
            >
              <div
                style={{
                  fontFamily: "Instrument Sans",
                  fontStyle: "italic",
                  fontSize: 20,
                  color: RED,
                }}
              >
                omnia iam fiunt quae posse negabam
              </div>
              <div
                style={{
                  fontFamily: "Instrument Serif",
                  fontStyle: "italic",
                  fontSize: 22,
                  color: RED,
                }}
              >
                {isEssay ? "sahiti.dev/writing" : "sahiti.dev"}
              </div>
            </div>
          </div>
        </div>

        {/* right: photo from the /photos archive */}
        <div
          style={{
            display: "flex",
            width: 400,
            flexShrink: 0,
            padding: "44px 52px 44px 0",
            alignItems: "center",
          }}
        >
          <img
            src={photoSrc}
            width={348}
            height={542}
            style={{
              objectFit: "cover",
              borderRadius: 18,
              border: `4px solid ${RED}`,
              transform: "rotate(2deg)",
            }}
          />
        </div>

        {/* signature red edge bar */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 10,
            height: 630,
            backgroundColor: RED,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Instrument Serif",
          data: serifData,
          style: "italic",
          weight: 400,
        },
        {
          name: "Instrument Sans",
          data: sansData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
