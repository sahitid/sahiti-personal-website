# Writing

Every `.md` file in this folder (except this README) becomes a post at
`/writing/<filename>`. Push to GitHub and it renders automatically — no code
changes needed.

## Adding a post

Create `content/writing/my-post-title.md` (the filename becomes the URL slug):

```markdown
---
title: My Post Title
description: One or two sentences shown under the title and on the /writing index.
date: 2026-07-09
---

Your markdown starts here.
```

Posts are sorted newest-first on `/writing`. Reading time is computed
automatically. Add `draft: true` to the frontmatter to hide a post from the
site while you work on it.

## What you can use in a post

- **Sections** — `##` chapters and `###` subsections automatically build the
  shared table of contents. It appears after the article header, expands the
  current chapter, and follows your reading position. On smaller screens,
  use the floating **Contents** button. Posts without section headings don't
  display an empty sidebar. `####` headings remain in the article only.
- **Everything standard** — bold, italics, links, lists, blockquotes,
  `inline code`, fenced code blocks (syntax-highlighted), tables,
  horizontal rules.
- **Math** — inline `$E = mc^2$` and display blocks with `$$ ... $$`
  (rendered with KaTeX).
- **Images with captions** — `![alt text](/images/photo.jpg "This caption appears under the image")`.
  Put image files in `public/images/`.
- **Videos** — use the same image syntax with an `.mp4` or `.webm` file
  (e.g. `![](/images/writing/clip.mp4)`) and it renders as a silent, looping,
  autoplaying video — like a GIF but far smaller.
- **Footnotes** — `like this[^1]` and then `[^1]: The footnote text.`
  anywhere in the file.
- **Glossary terms** — hover/tap definitions with a dotted underline:

  ```html
  <span class="gloss" data-gloss="The definition shown in the tooltip.">the term</span>
  ```

See `the-anatomy-of-a-post.md` for a live example of every feature.

## One layout for all writing

Blog posts and project writeups both use `components/WritingLayout.js`.
Project pages import that component directly and can pass `caseStudy` details
or extra JSX. The sidebar reads the rendered article's headings, including
HTML and JSX, so there is no separate list of links to maintain. Existing
heading IDs are preserved; missing IDs are generated automatically. Footnote
headings are excluded. Wrap other content in `data-toc-ignore` to omit it.

Make shared sidebar changes in these files:

- `components/ArticleContents.js` — outline, disclosure controls, keyboard and
  mobile interactions, scroll tracking, and automatic chapter expansion.
- `components/ArticleContents.module.css` — spacing, typography, yellow marker, animations,
  desktop breakpoint, and mobile panel. Reduced-motion preferences are respected.
- `lib/article-contents.mjs` — reading threshold (30% of viewport), anchor offset
  (96px), and the header exit threshold (72px).

Changing these files updates every article and case study; no per-post sidebar
code or manual `toc` data is needed. The site's article text and existing
typography continue to live in Markdown and `styles/globals.css`.
