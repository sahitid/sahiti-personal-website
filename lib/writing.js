import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';

const WRITING_DIR = path.join(process.cwd(), 'content', 'writing');

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDate(date) {
    const d = date instanceof Date ? date : new Date(`${date}T00:00:00Z`);
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function toSortableDate(date) {
    const d = date instanceof Date ? date : new Date(`${date}T00:00:00Z`);
    return d.getTime();
}

function readingTime(content) {
    const words = content
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/\$\$[\s\S]*?\$\$/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length;
    return Math.max(1, Math.round(words / 230));
}

// Strips markdown/inline-HTML syntax from a heading so slugs match what
// rehype-slug generates from the rendered text.
function headingText(raw) {
    return raw
        .replace(/<[^>]+>/g, '')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`~]/g, '')
        .trim();
}

function extractToc(content) {
    const slugger = new GithubSlugger();
    const withoutCode = content.replace(/```[\s\S]*?```/g, '');
    const toc = [];
    for (const line of withoutCode.split('\n')) {
        const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
        if (!match) continue;
        const text = headingText(match[2]);
        toc.push({
            depth: match[1].length,
            text,
            slug: slugger.slug(text)
        });
    }
    return toc;
}

export function getPostSlugs() {
    if (!fs.existsSync(WRITING_DIR)) return [];
    return fs.readdirSync(WRITING_DIR)
        .filter((file) => file.endsWith('.md') && file.toLowerCase() !== 'readme.md')
        .map((file) => file.replace(/\.md$/, ''));
}

export function getPostBySlug(slug) {
    const fullPath = path.join(WRITING_DIR, `${slug}.md`);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? '',
        date: data.date ? formatDate(data.date) : '',
        sortDate: data.date ? toSortableDate(data.date) : 0,
        draft: data.draft === true,
        readingTime: readingTime(content),
        toc: extractToc(content),
        content
    };
}

export function getAllPosts() {
    return getPostSlugs()
        .map(getPostBySlug)
        .filter((post) => !post.draft)
        .sort((a, b) => b.sortDate - a.sortDate)
        .map(({ content, toc, ...meta }) => meta);
}
