export default function LeadersSummitRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://summit.hackclub.com/',
      permanent: true,
    },
  };
}
