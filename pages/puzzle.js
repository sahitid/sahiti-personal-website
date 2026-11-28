import Head from 'next/head';
import ReferencePuzzle from '../components/ReferencePuzzle';
import styles from '../styles/About.module.css';

export default function PuzzlePage() {
  return <>
    <Head>
      <title>Sum of Parts · Sahiti Dasari</title>
      <meta name="description" content="A few pieces of Sahiti. A personal, illustrated puzzle with pieces to turn over." />
    </Head>
    <main className={styles.page}>
      <h1 className={styles.visuallyHidden}>Sum of Parts</h1>
      <ReferencePuzzle />
    </main>
  </>;
}
