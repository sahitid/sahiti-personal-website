export default function VroomRedirect() { return null; }

export function getServerSideProps() {
  return { redirect: { destination: '/projects/vroom', permanent: true } };
}
