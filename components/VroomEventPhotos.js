import CaseStudyImage from './CaseStudyImage';
import styles from '../styles/VroomProject.module.css';

const photos = [
  ['https://vyml3xz4zis6ggod.public.blob.vercel-storage.com/events/rough-draft-02/photos/img-0162.jpg', 'Rough Draft', 'Guests at Rough Draft Vol. 2'],
  ['https://vyml3xz4zis6ggod.public.blob.vercel-storage.com/events/adult-field-day/photos/invitegraphic.jpg', 'Field Day', 'Field Day event poster'],
  ['https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/uploads/od/6ff36850-8f27-49a7-b90b-d4bff16fe44e.png', 'Yacht party', 'SFVibe Yacht Party event poster'],
];

export default function VroomEventPhotos() {
  return (
    <div className={styles.eventPhotos}>
      {photos.map(([src, , alt]) => (
        <figure key={src}>
          <CaseStudyImage src={src} alt={alt} loading="lazy" sizes="(max-width: 712px) calc((100vw - 64px) / 3), 216px" />
        </figure>
      ))}
    </div>
  );
}
