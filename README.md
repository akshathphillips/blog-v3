# blog-v3

My corner of the internet — writing, glimpses of life, and a universal bookmark bar.
Not a résumé, not a portfolio. Plain HTML built by one zero-dependency Node script,
hosted on S3. Colors carried over from [blog v1](https://github.com/akshathphillips/blog)
(grey-50 / grey-900 with orange-500 accent, Open Sans).

**Live:** http://akshathphillips-blog.s3-website-us-east-1.amazonaws.com

## Layout

```
build.js              zero-dep static site generator (markdown parser included)
content/
  posts/*.md          one file per post → one page per post at /writing/<slug>/
  glimpses.json       photo feed manifest (rendered at runtime)
  glimpses/           the images themselves
  bookmarks.json      categorized links (rendered at runtime)
static/               css + js, copied to dist/assets/
scripts/deploy.sh     build + aws s3 sync
dist/                 generated output (gitignored)
```

## Writing a post

Create `content/posts/YYYY-MM-DD-some-slug.md`:

```markdown
---
title: Some Title
date: 2026-07-06
description: One-liner shown in the post list.
---

Markdown body. Supports headings, lists, links, images, code blocks, blockquotes.
```

Then `./scripts/deploy.sh`. The post gets its own page at `/writing/some-slug/`.

## Posting a glimpse (no laptop needed)

Glimpses and bookmarks are fetched at runtime from JSON in the bucket, so you can
update them from the AWS console without rebuilding:

1. Upload the image to `s3://akshathphillips-blog/content/glimpses/`
2. Add an entry to `content/glimpses.json` in the bucket:
   `{ "image": "file.jpg", "caption": "…", "date": "July 2026" }`

Same for bookmarks — edit `content/bookmarks.json`. (Mirror the change into the
repo copy next time you're at a keyboard so a redeploy doesn't clobber it.)

## Develop locally

```
node build.js && npx serve dist
```
