export default function HackClubAMAsRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://hackclub.com/amas/',
      permanent: true,
    },
  };
}
