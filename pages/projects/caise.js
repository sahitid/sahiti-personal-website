import WritingPost from '../writing/[slug]';
import { getPostBySlug } from '../../lib/writing';

export default function CaiseProject({ post }) {
  return <WritingPost post={post} projectPage caseStudy={{
    dateLabel: null,
    subtitle: 'Helping students practice business case studies, present their ideas, and learn from feedback.',
    team: ['Nathan Tishgarten', 'Sahiti Dasari'],
    teamLinks: { 'Nathan Tishgarten': 'https://www.tishgarten.com/' },
    overview: 'Nathan and I built CAISE to give business students more opportunities to practice. The product connects tailored case studies, presentations to an AI judge, and feedback in a repeatable learning experience.',
  }} />;
}

export function getStaticProps() {
  return { props: { post: getPostBySlug('caise') } };
}
