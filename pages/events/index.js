import Head from 'next/head';
import Link from 'next/link';
import events from '../../data/events.json';

export default function Events() {
  return (
    <main className="standard-main">
      <Head><title>Events — Sahiti Dasari</title></Head>
      <header className="page-heading"><h1>Events</h1><p>A few gatherings I’ve organized and helped bring to life.</p></header>
      <div className="events-grid">
        {events.map((event, i) => {
          const date = event.dateLabel || (event.date ? new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
          return <Link target="_blank" rel="noopener noreferrer" className="event-card" href={`/projects/${event.slug}`} key={event.slug}>
            <div className={`event-image${event.coverType === 'artwork' ? ' event-artwork' : ''}`}>
              <img src={event.cover} alt={event.coverType === 'artwork' ? `${event.title} artwork` : event.title} loading={i > 1 ? 'lazy' : 'eager'} />
            </div>
            <div className="event-caption"><h2>{event.title}</h2><span className="site-arrow" aria-hidden="true">↗</span></div>
            <p>{[event.location, date].filter(Boolean).join(' · ')}</p>
          </Link>;
        })}
      </div>
    </main>
  );
}
