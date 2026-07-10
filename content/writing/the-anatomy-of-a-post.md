---
title: The Anatomy of a Post
description: A living style guide for this writing page — every feature it supports, demonstrated in one place. Keep it around as a reference, or delete it once you've written your first real essay.
date: 2026-07-09
draft: true
---

This page exists so future-me remembers what this writing setup can do. Every post is just a markdown file in `content/writing/` — push it to GitHub and it shows up here, with the table of contents, reading time, and everything else generated automatically.

The sidebar on the left (or the list above, on a phone) is built from the headings in this file. It tracks your scroll position and highlights the section you're reading. Click any entry to jump.

## Writing basics

Regular paragraphs work exactly like you'd expect, with **bold**, *italics*, and [links that open in a new tab](https://sahitid.substack.com/). Longer thoughts can be pulled out into a blockquote:

> The details are not the details. They make the design.
>
> — Charles Eames

Lists behave too, both unordered:

- something worth saying
- something else worth saying
  - with a nested aside
- a final thing

and ordered:

1. first
2. second
3. third

A horizontal rule gives the reader a breath between movements:

---

That was one.

## Glossary terms

Some words deserve a definition without derailing the sentence. Wrap them in a gloss span and they get a dotted underline — hover (or tap, on a phone) to see the definition. For example, a <span class="gloss" data-gloss="A tiny pop-up definition that appears when you hover over or tap a dotted-underlined term. Written inline in the markdown, no footnote required.">gloss</span> is how this very sentence explains itself, and terms like <span class="gloss" data-gloss="Latin: 'everything I used to say couldn't happen is happening now.' The motto in this site's footer, adapted from Ovid.">omnia iam fiunt</span> can carry their own translations.

The syntax is plain HTML inside the markdown:

```html
<span class="gloss" data-gloss="The definition goes here.">the term</span>
```

## Math

Inline math sits inside single dollar signs, so $c = \sqrt{a^2 + b^2}$ flows with the text. Display math gets its own block:

$$
\text{tokens per second} = \frac{\text{memory bandwidth}}{2 \times \text{parameter count}}
$$

Matrices, fractions, summations — anything KaTeX supports:

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
=
\begin{bmatrix} ax + by \\ cx + dy \end{bmatrix}
$$

## Code

Inline code like `getStaticProps` is for names and fragments. Fenced blocks get syntax highlighting:

```javascript
export function readingTime(content) {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
```

```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## Tables

| Feature | Syntax | Rendered by |
| --- | --- | --- |
| Headings & TOC | `##` and `###` | rehype-slug + scroll-spy |
| Math | `$ ... $` and `$$ ... $$` | KaTeX |
| Code highlighting | fenced blocks | highlight.js |
| Glossary tooltips | `<span class="gloss">` | a shared bubble |
| Footnotes | `[^1]` | remark-gfm |

Wide tables scroll horizontally instead of breaking the layout.

## Images

Give an image a quoted title and it becomes the caption:

![A film photo from the photos page](/images/photo2.jpg "Captions come from the quoted title in the markdown: ![alt](src \"caption\")")

## Footnotes

Sometimes a thought belongs at the bottom of the page instead of the middle of a sentence.[^1] Footnotes collect themselves below the essay and link both ways.[^2]

## That's everything

Delete this file whenever it stops being useful — the page rebuilds itself from whatever markdown lives in `content/writing/`.

[^1]: Like this. Click the arrow to jump back to where you were.
[^2]: The full cheatsheet lives in `content/writing/README.md`.
