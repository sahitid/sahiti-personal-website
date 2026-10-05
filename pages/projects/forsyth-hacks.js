export default function ForsythHacksRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://forsyth-hacks-v2-site.vercel.app/',
      permanent: true,
    },
  };
}
