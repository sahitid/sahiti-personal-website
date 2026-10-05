import Link from 'next/link';
import { useRouter } from 'next/router';
import HomeBoat from './HomeBoat';

export default function SiteLayout({ children }) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  return (
    <div key={router.asPath.split(/[?#]/)[0]} className={`site${isHome ? ' site-home' : ''}${router.pathname === '/projects' ? ' site-projects' : ''}${router.pathname === '/projects/[slug]' ? ' site-event' : ''}`}>
      <a className="skip-link" href="#content">Skip to content</a>
      <header className="site-header">
        <HomeBoat />
        <nav aria-label="Main navigation">
          {['projects', 'writing', 'photos'].map(name => {
            const href = `/${name}`;
            const active = name === 'projects' ? router.pathname.startsWith('/projects') || router.pathname.startsWith('/events') : router.pathname === href || (name === 'writing' && router.pathname.startsWith('/writing'));
            return <Link key={name} href={href} aria-current={active ? 'page' : undefined}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>;
          })}
        </nav>
      </header>
      <div id="content" className="page-content" key={router.asPath}>{children}</div>
      <footer className="site-footer">
        <div className="footer-note">
          <span>aut insanit mulier, aut versus facit</span>
        </div>

      </footer>
    </div>
  );
}
