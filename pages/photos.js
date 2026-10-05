import Head from 'next/head';
import PhotoGallery from '../components/PhotoGallery';
import photos from '../data/photos.json';

export default function Photos() {
  return (
    <main className="standard-main photos-page">
      <Head><title>Photos — Sahiti Dasari</title></Head>
      <header className="page-heading">
        <h1>Photos</h1>
        <p>Collecting stories on my Kodak PIXPRO FZ55.</p>
      </header>
      <PhotoGallery photos={photos} className="editorial-photos" />
    </main>
  );
}
