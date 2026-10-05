import Head from "next/head";
import { useRouter } from "next/router";

export default function HeadObject({ children }) {
  const router = useRouter();
  const title = "Sahiti Dasari";
  const description = "Sahiti's personal website & portfolio.";
  const searchBarColor = "#ffffff";
  const keywords = "sahiti, sahiti dasari";
  const author = "Sahiti Dasari";
  const twitter = "@sahitid_";
  const url = "https://sahiti.dev";
  const canonical = `${url}${router.asPath.split(/[?#]/)[0]}`;
  const image = `${url}/sahiti-dasari-portrait.jpg`;
  const imageAlt = "Portrait of Sahiti Dasari";
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonical,
    url: canonical,
    name: title,
    primaryImageOfPage: { '@type': 'ImageObject', url: image, contentUrl: image, caption: imageAlt },
    about: { '@type': 'Person', name: title, url, image, sameAs: ['https://www.linkedin.com/in/sahitidasari/', 'https://github.com/sahitid', 'https://x.com/sahitid_'] },
  };
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>{title}</title>
      <link rel="canonical" href={canonical} />
      <link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" key="favicon" />
      <meta name="robots" content="max-image-preview:large" />
      {router.pathname === '/' && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta
        name="theme-color"
        content={searchBarColor}
        media="(prefers-color-scheme: light)"
      />
      {/* <meta name="theme-color" content={darkSearchBarColor} media="(prefers-color-scheme: dark)" /> */}
      {url ? <meta property="og:url" content={canonical} /> : ""}
      <meta property="og:type" content="website" key="og:type" />
      <meta property="og:title" content={title} key="og:title" />
      <meta
        property="og:description"
        content={description}
        key="og:description"
      />
      <meta
        property="og:image"
        content={image}
        key="og:image"
      />
      <meta property="og:image:width" content="4928" key="og:image:width" />
      <meta property="og:image:height" content="7404" key="og:image:height" />
      <meta
        property="og:image:alt"
        content={imageAlt}
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
        content={image}
        key="twitter:image"
      />
      {/* Add analytics here */}
      {children}
    </Head>
  );
}
