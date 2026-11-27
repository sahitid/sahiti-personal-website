import WritingLayout from '../../components/WritingLayout';
import { getPostSlugs, getPostBySlug } from '../../lib/writing';

// Blog posts and project writeups share this layout and its contents sidebar.
export default WritingLayout;

export async function getStaticPaths() {
    return {
        paths: getPostSlugs()
            .filter((slug) => !getPostBySlug(slug).draft)
            .map((slug) => ({ params: { slug } })),
        fallback: false
    };
}

export async function getStaticProps({ params }) {
    return { props: { post: getPostBySlug(params.slug) } };
}
