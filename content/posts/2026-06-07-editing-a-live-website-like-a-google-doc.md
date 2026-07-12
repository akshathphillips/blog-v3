---
title: Editing a live website like a Google Doc
date: 2026-06-07
description: A pattern I keep reaching for — static pages that fetch their content from JSON in the bucket.
tags: aws, s3, static-sites, architecture, web
---

I recently shipped a marketing site for a family venture, and the constraint that shaped it was simple: the people updating the site would not be running `npm run build`. Ever.

The usual answer is a CMS, which means a server, which means the thing I was trying to avoid. The answer I landed on instead: the pages are static HTML on S3, but every section's *content* lives in a JSON file in the same bucket. The page fetches its JSON at runtime and renders it.

```text
s3://the-site/
  index.html        <- deployed once, rarely changes
  content/
    services.json   <- edit this, site updates. no build.
```

Want to change the copy? Edit the JSON in the bucket — from the AWS console, from a phone, from anywhere. The live site updates on the next refresh. It's the editing experience of a Google Doc with the hosting bill of a static site (pennies).

## Where it works and where it doesn't

It works great for content that changes often but *structurally* stays the same: service lists, team bios, photo galleries, link collections. The template is code; the content is data.

It's the wrong tool when each piece of content deserves its own page and its own URL — blog posts, mainly. Search engines and link previews want real HTML, not an empty div waiting for a fetch.

This site uses both, deliberately. Every post in Writing is a real page generated at build time. But Glimpses and Bookmarks are runtime-JSON: when I want to post a photo, I upload the image and add one line of JSON to the bucket, and it's live. No laptop required.
