import Head from 'next/head';
import CampusLeadDescription from '../../components/CampusLeadDescription';
import Link from 'next/link';
import events from '../../data/events.json';
import PhotoGallery from '../../components/PhotoGallery';
import EventVideo from '../../components/EventVideo';
import WritingPost from '../writing/[slug]';
import FieldDaySocial from '../../components/FieldDaySocial';

export default function EventPage({ event }) {
  const date = event.dateLabel || (event.date ? new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');
  const website = event.url && !/^https?:\/\/(?:www\.)?(?:vroomevents\.com|x\.com)(?:\/|$)/.test(event.url) ? event.url : null;
  const photos = (event.photos || []).filter(src => src !== event.cover);
  const isFieldDay = event.slug === 'adult-field-day';
  const mixedMedia = event.slug === 'rough-draft-02' || isFieldDay;
  const description = isFieldDay ? 'I planned a field day to bring a little whimsy back to San Francisco—an afternoon of games, water balloons, and popsicles, purely for the fun of it.' : event.description;
  if (event.slug === 'sf-tea-party') return <WritingPost projectPage post={{
    title: event.title,
    description: event.description,
    thumbnail: event.cover,
    content: '',
    toc: [{ slug: 'photos', text: 'Photos', depth: 2 }],
  }} caseStudy={{
    subtitle: event.description,
    heroAspectRatio: '16 / 9',
    dateLabel: date,
    team: ['Sahiti Dasari', 'Joyce Wong'],
    overview: event.description,
  }}>
    <div className="event-detail event-body-full-width">
      <h2 id="photos">Photos</h2>
      <PhotoGallery photos={photos} label={event.title} className="event-photo-grid" />
    </div>
  </WritingPost>;
  return <main className={`standard-main event-detail${event.slug === 'spacexai-campus-lead' ? ' campus-lead-page' : ''}`}>
    <Head><title>{`${event.title} — Sahiti Dasari`}</title><meta name="description" content={event.description} /></Head>
    <div className="event-navigation"><Link target="_blank" rel="noopener noreferrer" href="/projects" className="back-link"><span className="site-arrow" aria-hidden="true">←</span> Back</Link>{website && <a href={website} className="event-website" target="_blank" rel="noopener noreferrer" aria-label={`Visit ${event.title} website`}>↗</a>}</div>
    <header className="event-heading">
      <h1>{event.title}</h1>
      {(event.location || date) && <div className="event-meta">{event.location && <span>{event.location}</span>}{date && <span>{date}</span>}</div>}
    </header>
    <div className={`event-hero${event.coverType === 'artwork' ? ' event-artwork' : ''}`}><img src={event.cover} style={{ objectPosition: event.coverPosition || '50% 50%' }} alt={event.coverType === 'artwork' ? `${event.title} artwork` : event.title} /></div>
    <div className="event-body">
    <section className="event-story" aria-label="About the event">
      {description.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{event.slug === 'spacexai-campus-lead' ? <CampusLeadDescription text={paragraph} /> : paragraph}</p>)}
    </section>
    <div className="event-media">
    {photos.length > 0 && <PhotoGallery photos={photos} label={event.title} className={`event-photo-grid${(event.slug.startsWith('rough-draft-') || isFieldDay) ? ' rough-draft-media' : ''}`} videos={mixedMedia ? event.videos || [] : []} />}
    {!mixedMedia && event.videos?.length > 0 && <div className="event-video-grid">{event.videos.map((src, i) => <EventVideo key={src} src={src} label={`${event.title}, video ${i + 1}`} />)}</div>}
    </div>
    </div>
    {isFieldDay && <FieldDaySocial />}
  </main>;
}
export function getStaticPaths() { return { paths: events.map(e => ({ params: { slug: e.slug } })), fallback: false }; }
export function getStaticProps({ params }) {
  const index = events.findIndex(e => e.slug === params.slug);
  if (index < 0) return { notFound: true };
  return { props: { event: events[index] } };
}
