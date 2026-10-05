export default function AuroraRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://aurora.hackclub.com/',
      permanent: true,
    },
  };
}
