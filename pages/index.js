import NotePopup from '../components/NotePopup';
import Link from 'next/link';

const highlights = [
  { title: 'Building', items: [
    { title: 'Olo Security', href: 'https://olosecurity.com/', description: 'Real-time AI governance layer, designed to prevent shadow AI' },
    { title: 'PennApps Hackathon', href: 'https://pennapps.com/', description: 'Co-directing Penn’s annual hackathon, bringing builders together to turn ambitious ideas into working projects' },
  ] },
  { title: 'Projects', items: [
    { title: 'Murph-E', href: 'https://www.shayaanazeem.com/murph-e', description: 'An arcade machine that turns voice prompts into playable games' },
    { title: 'CAISE', href: 'https://caise.app/', description: 'AI-powered practice for business student role-play and case study events' },
    { title: 'Parker Lab @ Georgia Tech', href: 'https://parkerlab.gatech.edu/', description: 'Developing laser control systems for quantum physics precision research' },
  ] },
  { title: 'Writing', items: [
    { title: 'Finding Myself', href: '/writing/finding-myself', description: 'My understanding on what it means to be human' },
  ] },
];

const socials = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sahitidasari/', icon: 'linkedin' },
  { name: 'Twitter', href: 'https://x.com/sahitid_', icon: 'twitter' },
  { name: 'GitHub', href: 'https://github.com/sahitid', icon: 'github' },
  { name: 'Substack', href: 'https://substack.com/@sahitid', icon: 'substack' },
  { name: 'Email', href: 'mailto:sahitid@wharton.upenn.edu', icon: 'mail' },
];

export default function Home() {
  return (
    <main className="home-main home-introduction">
      <section className="intro" aria-labelledby="home-title">
        <h1 id="home-title" className="home-name soft-enter">Sahiti Dasari</h1>
        <div className="intro-lede soft-enter" style={{ '--enter-delay': '80ms' }}>
          I’m a <NotePopup label="student" title="Studying at UPenn M&T" className="student-trigger" panelClassName="student-details-popup">
            <p>Studying Computer Science &amp; Economics at the University of Pennsylvania in <a href="https://fisher.wharton.upenn.edu/" target="_blank" rel="noopener noreferrer">Jerome Fisher Management &amp; Technology (M&amp;T)</a></p>
          </NotePopup> &amp; developer focused on human-centered technology.
        </div>
        <div className="social-icons soft-enter" style={{ '--enter-delay': '160ms' }} aria-label="Social links">
          {socials.map(({ name, href, icon }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} title={name}>
              <span className="social-icon" style={{ '--icon-url': `url(/${icon}.svg)` }} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="home-highlights soft-enter" style={{ '--enter-delay': '240ms' }}>
          {highlights.map(column => (
            <section className="home-highlight-column" key={column.title} aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.items.map(item => (
                  <li key={item.title}>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.title}{item.href.startsWith('https:') && <span className="site-arrow" aria-hidden="true"> ↗</span>}
                    </Link>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
