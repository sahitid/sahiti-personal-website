export default function AscendRedirect() {
  return null;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: 'https://ascend.hackclub.com/',
      permanent: true,
    },
  };
}
