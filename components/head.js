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
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={twitter} />
      <meta name="twitter:creator" content={twitter} />
      {/* Add analytics here */}
      {children}
    </Head>
  );
}
