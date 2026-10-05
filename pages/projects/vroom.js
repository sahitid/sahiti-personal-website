import WritingPost from '../writing/[slug]';
import { getPostBySlug } from '../../lib/writing';
import styles from '../../styles/VroomProject.module.css';

export default function VroomProject({ post }) {
  return <div className={styles.page}><WritingPost post={post} projectPage caseStudy={{
    dateLabel: null,
    subtitle: 'Building intentional software for live experiences that treats each event as a choreography of venue, vendors, and people.',
    team: ['Linda Xue', 'Vikram Gupta', 'Ali Khatib'],
    overview: 'I helped build Vroom Events, connecting the planning workspace to provider search and outreach. On Vroom Tickets, I worked across web and mobile on photos, guests, messaging, and check-in. I also built Vroom Tea, a local feed for venue questions and experiences.',
  }}>
    <nav className={styles.links} aria-label="Vroom project links">
      <a href="https://projects.lindaxue.com/vtix" target="_blank" rel="noopener noreferrer"><span>Linda’s website</span> <span className="site-arrow" aria-hidden="true">↗</span></a>
      <a href="https://x.com/lindaxue/article/2074207099664683191" target="_blank" rel="noopener noreferrer"><span>Postmortem</span> <span className="site-arrow" aria-hidden="true">↗</span></a>
    </nav>
  </WritingPost></div>;
}

export function getStaticProps() {
  return { props: { post: getPostBySlug('building-at-vroom') } };
}
