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
  const [serifData, sansData] = await Promise.all([serifItalic, sansRegular]);

  const isEssay = Boolean(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PINK,
          padding: "64px 72px",
          position: "relative",
        }}
      >
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

        {/* top row: boat + url */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Boat width={110} />
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 32,
              color: RED,
            }}
          >
            {isEssay ? "sahiti.dev/writing" : "sahiti.dev"}
          </div>
        </div>

        {/* main block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: isEssay ? (title.length > 40 ? 68 : 88) : 148,
              lineHeight: 1.02,
              color: RED,
              maxWidth: 1000,
              display: "block",
              lineClamp: 3,
            }}
          >
            {isEssay ? title : "Sahiti Dasari"}
          </div>
          <div
            style={{
              fontFamily: "Instrument Sans",
              fontSize: 30,
              lineHeight: 1.45,
              color: INK,
              maxWidth: 850,
              marginTop: 28,
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
              width: 1046,
              height: 4,
              backgroundColor: RED,
              marginBottom: 18,
            }}
          />
          <div
            style={{
              fontFamily: "Instrument Sans",
              fontStyle: "italic",
              fontSize: 21,
              color: RED,
            }}
          >
            omnia iam fiunt quae posse negabam
          </div>
        </div>
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
