# Context — the standing brief

Read this first. It's the *who and why*. The **mechanics** (frontmatter, build,
ship, gotchas) live in [`../CLAUDE.md`](../CLAUDE.md) and are not repeated here.
The **craft** of each writing stream lives in `writing-*.md` next to this file.

Last synced: 2026-07-21.

## The arrangement

Akshath supplies loose thoughts — a topic, a memory, a voice-note-shaped run-on
sentence. The agent turns them into finished, published pages on his site. He is
not reviewing drafts line by line; he gave standing publish authority on
2026-07-09 ("you can always publish"). See `agent-understanding.md` for how that
authority is meant to be used, and where it stops.

The point of the arrangement: versions one and two of this site died because the
framework was the interesting part and the writing never happened. The whole
design of v3 — and of this agent — exists to make the writing the only thing
that takes effort, and to make even that effort small.

## Who he is

Identity-first, job-title-never. The site subtitle is **"Husband. Dad. And,
occasionally, software."** — deliberately self-deprecating about the software
part. He is:

- A husband, and dad to **Avi** (~2 years old, "the teachable twos").
- Based in Washington, DC.
- At **Clarivate**, leading AI-powered development and applications.
- Training seriously — "for my ladies" — working toward ~20% body fat by 35.
- Building **YAFA**, a small local-first workout app, and an iOS game.

He likes plain-language writing about technical work: concepts and principles,
never tool or brand names. He wants his kid and his non-technical friends to be
able to read any post on this site and follow it.

Everything in this list is already published on the live site, which is why it's
safe to write down here. See "Guardrails" below.

## What the site is

"An online presence, not a résumé." Not a portfolio either — he has LinkedIn and
GitHub for those. This is a *place*: writing, photos, bookmarks, and a shelf of
letters for his daughter.

Four writing streams, set by frontmatter `section:`

| Section | What it is | Where it lives | Craft guide |
|---|---|---|---|
| `software` (default) | Concept essays on things he's built | `/writing/<slug>/` | `writing-general.md` |
| `life` | Personal/meta essays | `/writing/<slug>/` | `writing-general.md` |
| `avi` | Letters to his daughter | `/writing/avi/<slug>/` | `writing-avi.md` |
| `strength` | Week-by-week training log | `/writing/strength/<slug>/` | `writing-strength.md` |

`life` + `software` are flat and grouped on the Writing index; `avi` and
`strength` are nested shelves with their own index pages. Only `life` +
`software` appear in "Recent writing" on the home page — the training log is
explicitly "mostly for me."

Plus three non-post surfaces: **Glimpses** (photo grid, currently empty →
"Coming soon…"), **Bookmarks** (categorized links), and **Search** (client-side,
over posts + bookmarks, filterable by tag).

## Current state

- Live: http://akshathphillips-blog.s3-website-us-east-1.amazonaws.com
- Repo: https://github.com/akshathphillips/blog-v3 (**public**)
- Push to `main` → GitHub Actions builds and deploys. No manual step.
- 9 posts across the four sections; Glimpses awaiting real photos.
- Analytics: Cloudflare Web Analytics, live, cookieless.
- Not yet done, not yet asked for: custom domain + HTTPS via CloudFront.

## Guardrails

1. **This repo is public.** These docs, commit messages, and post content are
   world-readable. Write nothing here that isn't already on the live site or
   that he wouldn't publish himself. Family details are especially sensitive:
   the site names Avi and a couple of relatives in a published letter, and that
   is the *ceiling*, not a license to add more.
2. **Never invent a load-bearing fact.** Not a weight lifted, not a date, not a
   quote from a two-year-old, not a technical detail of something he built. If
   it matters and you don't have it, ask. This is the fastest way to lose the
   arrangement — a fabricated detail in a letter to his daughter is worse than
   no letter.
3. **The repo is the source of truth.** Deploys use `aws s3 sync --delete`. See
   CLAUDE.md for the Glimpses/Bookmarks mirroring gotcha.
4. **Don't inflate.** Small moments should stay small. See `writing-avi.md`.
