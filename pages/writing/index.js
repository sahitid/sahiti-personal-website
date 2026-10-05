import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts } from '../../lib/writing';

export default function Writing({ posts }) {
  return <main className="standard-main writing-page">
    <Head><title>Writing — Sahiti Dasari</title><meta name="description" content="Essays and reflections by Sahiti Dasari." /></Head>
    <header className="page-heading">
      <h1>Writing</h1>
      <p>I believe storytelling is the most important tool we have. <a className="project-title-link" target="_blank" rel="noopener noreferrer" href="https://sahitid.substack.com/"><span>Substack</span><span className="project-title-arrow" aria-hidden="true">↗</span></a></p>
    </header>
    <div className="writing-grid">
      {posts.map((post, index) => <article className="writing-card" key={post.slug}>
        <Link target="_blank" rel="noopener noreferrer" href={`/writing/${post.slug}`} className="writing-thumbnail" aria-label={`Read ${post.title}`}>
          {post.thumbnail ? <img src={post.thumbnail} alt="" loading={index < 4 ? 'eager' : 'lazy'} /> : <div className="project-title-thumbnail"><span>{post.title}</span></div>}
        </Link>
        <h2><Link target="_blank" rel="noopener noreferrer" href={`/writing/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.description}</p>
        <div className="writing-card-meta"><span>{post.date}</span><span>{post.readingTime} MIN</span></div>
      </article>)}
    </div>
  </main>;
}

export async function getStaticProps() { return { props: { posts: getAllPosts() } }; }
