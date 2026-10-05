import Head from 'next/head';
import CampusLeadDescription from '../components/CampusLeadDescription';
import TidbitThumbnail from '../components/TidbitThumbnail';
import VideoThumbnail from '../components/VideoThumbnail';
import EmbeddedThumbnail from '../components/EmbeddedThumbnail';
import Link from 'next/link';
import { useState } from 'react';
import { projects } from '../data/projects';
import events from '../data/events.json';
import thumbnails from '../data/project-thumbnails.json';

const showProjectThumbnails = false;

const categories = ['All', 'AI/ML', 'Hardware', 'Web', 'App', 'Research', 'Community', 'Events'];
const linkOrder = { website: 0, video: 1, github: 2, award: 3, press: 4, pressOpenAI: 4, substack: 5, photo: 5 };
const linkTypes = {
  substack: { icon: 'substack', label: 'Substack' },
  website: { icon: 'link', label: 'Website' },
  github: { icon: 'github', label: 'GitHub repository' },
  video: { icon: 'video', label: 'Video' },
  photo: { icon: 'camera', label: 'Photos' },
  award: { icon: 'award', label: 'Recognition' },
  press: { icon: 'press', label: 'Press coverage' },
  pressOpenAI: { icon: 'press', label: 'OpenAI Developers on X' },
};
const catalog = projects.map(project => {
  const event = events.find(event => event.title === project.title);
  return { ...project, event, thumbnail: event ? { src: event.cover, type: event.coverType, position: event.coverPosition } : thumbnails[project.title] };
});
for (const event of events) {
  if (!catalog.some(project => project.event?.slug === event.slug)) {
    catalog.push({ title: event.title, categories: ['Events'], description: event.cardDescription || event.description, date: event.dateLabel || (event.date ? new Date(event.date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''), links: event.links || { website: event.url }, event, thumbnail: { src: event.cover, type: event.coverType, position: event.coverPosition } });
  }
}

// Keep the original projects in their saved order; group the added event with its series.
const roughDraftIndex = catalog.findIndex(project => project.event?.slug === 'rough-draft-01');
const roughDraftSeriesIndex = catalog.findIndex(project => project.event?.slug === 'rough-draft-02');
if (roughDraftIndex !== -1 && roughDraftSeriesIndex !== -1) {
  const [roughDraft] = catalog.splice(roughDraftIndex, 1);
  catalog.splice(catalog.findIndex(project => project.event?.slug === 'rough-draft-02') + 1, 0, roughDraft);
}

function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false);
  const href = project.event ? `/projects/${project.event.slug}` : project.links.website || project.links.github || project.links.video || project.links.award;
  const thumbnailHref = project.thumbnailHref || (['Forsyth Hacks 2.0 & 1.0', 'EcoBuddy', 'FitSphere', 'DriveSmart', 'SFHS Hack Club', 'Meta Glasses Poker Computer-Vision'].includes(project.title) ? undefined : project.title === 'Aurora: SF Athena Event' ? 'https://athena.hackclub.com/' : project.title === 'Blossom: Atlanta Day of Service' ? 'https://daysofservice.hackclub.com/' : project.title === 'Solis' ? 'https://devpost.com/software/solis-y73gaj' : project.title === 'Murph-e' ? 'https://www.shayaanazeem.com/murph-e' : href);
  const titleHref = project.title === 'Girls Into VC Summit' ? 'https://www.girlsintovc.com/' : ['EcoBuddy', 'Forsyth Hacks 2.0 & 1.0', 'SFHS Hack Club', 'DriveSmart', 'Meta Glasses Poker Computer-Vision', 'Solis'].includes(project.title) ? undefined : project.title === 'Blossom: Atlanta Day of Service' ? 'https://daysofservice.hackclub.com/' : project.title === 'Aurora: SF Athena Event' ? 'https://athena.hackclub.com/' : project.title === 'Murph-e' ? 'https://www.shayaanazeem.com/murph-e' : project.title === 'RoboRacer @ UPenn' ? 'https://roboracer.ai/' : href;
  const CardLink = titleHref ? Link : 'span';
  const ThumbnailLink = thumbnailHref ? Link : 'span';
  const image = project.thumbnail && !imageFailed;
  return (
    <article className="project-card portfolio-card">
      {showProjectThumbnails && <ThumbnailLink target={thumbnailHref ? "_blank" : undefined} rel={thumbnailHref ? "noopener noreferrer" : undefined} href={thumbnailHref} className={`project-thumbnail${project.title === '8 Minutes' ? ' eight-minutes-thumbnail' : ''}${project.thumbnail?.type === 'artwork' ? ' project-thumbnail-artwork' : ''}${project.thumbnail?.motion === 'kenburns' ? ' project-thumbnail-kenburns' : ''}`} aria-label={thumbnailHref ? `View ${project.title}` : undefined}>
        {project.title === 'TidBit' ? <TidbitThumbnail /> : project.thumbnail?.screenRegions ? <div className="project-cropped-screens eco-preview">{project.thumbnail.screenRegions.map((position, i) => <span key={i} role="img" aria-label={`${project.title} app screen ${i + 1}`} style={{ backgroundImage: `url(${project.thumbnail.src})`, backgroundPosition: `${position}% 50%` }} />)}</div> : project.thumbnail?.embed ? <EmbeddedThumbnail src={project.thumbnail.embed} poster={project.thumbnail.src} title={project.title} /> : project.thumbnail?.video ? <VideoThumbnail src={project.thumbnail.video} poster={project.thumbnail.src} title={project.title} /> : project.thumbnail?.screens ? <div className={`project-screen-gallery ${project.thumbnail.screenStyle || ''}`}>{project.thumbnail.screens.map((src, i) => <img key={src} src={src} alt={`${project.title} app screen ${i + 1}`} loading={index < 4 ? 'eager' : 'lazy'} />)}</div> : image ? <img style={{ transform: project.thumbnail.transform, objectPosition: project.thumbnail.position, objectFit: project.thumbnail.fit, background: project.thumbnail.background }} src={project.thumbnail.src} alt={`${project.title} ${project.thumbnail.type === 'photo' ? 'photo' : 'preview'}`} loading={index < 4 ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} /> : <div className="project-title-thumbnail" aria-hidden="true"><span>{project.title}</span><small>{project.categories.join(' / ')}</small></div>}
        {thumbnailHref && <svg className="thumbnail-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>}
      </ThumbnailLink>}
      <div className="project-title"><h2><CardLink target={titleHref ? "_blank" : undefined} rel={titleHref ? "noopener noreferrer" : undefined} href={titleHref} className={titleHref ? "project-title-link" : undefined}><span>{project.title}</span>{titleHref && <span className="project-title-arrow" aria-hidden="true">↗</span>}</CardLink></h2></div>
      <div className="project-card-tags">{project.categories.join(' / ')}</div>
      <p>{project.title === 'SpaceXAI Campus Lead' ? <CampusLeadDescription text={project.description} /> : project.descriptionLink ? <>{project.description.slice(0, project.description.indexOf(project.descriptionLink.text))}{project.descriptionLink.href === 'mailto:contact@pennapps.com' && <br />}<a href={project.descriptionLink.href} target="_blank" rel="noopener noreferrer">{project.descriptionLink.text}</a>{project.description.slice(project.description.indexOf(project.descriptionLink.text) + project.descriptionLink.text.length)}</> : project.description}</p>
      <div className="project-card-footer">
        <span>{project.date || ''}</span>
        <div className="project-icon-links">
          {Object.entries(project.links).sort(([a], [b]) => (linkOrder[a] ?? 6) - (linkOrder[b] ?? 6)).filter(([type]) => !(['Olo Security', 'CAISE', 'Aurora: SF Athena Event', 'PennApps Hackathon', 'FranklinDAO Blockchain', 'Philanthropy & Communications', 'BIOMET', 'Proofread', 'Less', 'FoundHer House', '8 Minutes', 'Ukulele Poetry', 'Parker Lab @ Georgia Tech', 'Arriaga Lab @ Georgia Tech', 'Social Experiments', 'Penn Meal Swipes', 'Catalyx', 'PreSeed', 'Rough Draft 01', 'Rough Draft 02', 'Engineering @ Vroom', 'TidBit', 'Pitch Deck Game', 'Blossom: Atlanta Day of Service', 'Clubs Operations & Engineering', 'Hack Club AMAs', 'Leaders Letters', 'AI & ML Jams', 'Hack Club Jams', 'Ascend: Days of Service Summit', 'SF Tea Party', 'Adult Field Day', "Leaders Summit"].includes(project.title) && type === 'website') && !(project.title === 'Forsyth Hacks 2.0 & 1.0' && ['github', 'website'].includes(type))).map(([type, url]) => {
            const entry = linkTypes[type];
            const linkHref = type === 'website' && project.event?.slug === 'leaders-summit' ? 'https://summit.hackclub.com/' : type === 'website' && project.event ? href : url;
            return entry ? <a href={linkHref} key={type} title={entry.label} aria-label={`${project.title}: ${entry.label}`} target="_blank" rel="noopener noreferrer"><span style={{ '--icon-url': `url(/${entry.icon}.svg)` }} aria-hidden="true" /></a> : null;
          })}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [activeFilters, setActiveFilters] = useState([]);
  function toggleFilter(category) {
    if (category === 'All') { setActiveFilters([]); return; }
    setActiveFilters(previous => previous.includes(category) ? previous.filter(item => item !== category) : [...previous, category]);
  }
  const filtered = catalog.filter(project => !project.hidden && (!activeFilters.length || project.categories.some(category => activeFilters.includes(category))));
  return (
    <main className="standard-main">
      <Head><title>Projects — Sahiti Dasari</title></Head>
      <header className="page-heading"><h1>Projects</h1></header>
      <div className="project-filters" role="group" aria-label="Filter projects by category">
        {categories.map(category => <button key={category} aria-pressed={category === 'All' ? !activeFilters.length : activeFilters.includes(category)} onClick={() => toggleFilter(category)}>{category}</button>)}
      </div>
      <span className="sr-only" role="status">{filtered.length} {activeFilters.length ? activeFilters.join(' or ') + ' ' : ''}projects</span>
      <div className="project-grid portfolio-grid" key={activeFilters.join(",")}>
        {filtered.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
        {[2, 3, 4].flatMap(columns => Array.from({ length: (columns - filtered.length % columns) % columns }, (_, index) => (
          <div key={`empty-${columns}-${index}`} className={`project-grid-empty project-grid-empty-${columns}`} aria-hidden="true" />
        )))}
      </div>
    </main>
  );
}
