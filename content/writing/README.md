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

- **Sections** — `##` and `###` headings automatically build the sticky
  table of contents with scroll-tracking.
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
