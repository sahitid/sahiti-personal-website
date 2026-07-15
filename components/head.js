import Head from "next/head";

export default function HeadObject({ children }) {
  const title = "Sahiti Dasari";
  const description = "Sahiti's personal website & portfolio.";
  const searchBarColor = "#ffffff";
  const keywords = "sahiti, sahiti dasari";
  const author = "Sahiti Dasari";
  const twitter = "@sahitid_";
  const url = "https://sahiti.dev";
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta
        name="theme-color"
        content={searchBarColor}
        media="(prefers-color-scheme: light)"
      />
      {/* <meta name="theme-color" content={darkSearchBarColor} media="(prefers-color-scheme: dark)" /> */}
      {url ? <meta property="og:url" content={url} /> : ""}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta
        property="og:image"
        content={`${url}/og-photo.jpg`}
        key="og:image"
      />
      <meta property="og:image:width" content="1200" key="og:image:width" />
      <meta property="og:image:height" content="630" key="og:image:height" />
      <meta
        property="og:image:alt"
        content="Sunset at the beach — Sahiti Dasari's personal website"
        key="og:image:alt"
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitter:card"
      />
      <meta name="twitter:site" content={twitter} />
      <meta name="twitter:creator" content={twitter} />
      <meta
        name="twitter:image"
        content={`${url}/og-photo.jpg`}
        key="twitter:image"
      />
      {/* Add analytics here */}
      {children}
    </Head>
  );
}
