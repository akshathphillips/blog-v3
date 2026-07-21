# blog-v3 — working notes for Claude

Akshath's personal site — "an online presence, not a résumé." Zero-dependency
Node static site generator: `build.js` reads Markdown + JSON from `content/`,
renders `dist/`. Own tiny Markdown parser, no framework.

## Start here if you're picking up the ghostwriting role
This file is the **mechanics** reference. The role itself is documented in `docs/`:

| Doc | What it covers |
|---|---|
| [`docs/context.md`](docs/context.md) | Who Akshath is, what the site is, the arrangement, guardrails |
| [`docs/agent-understanding.md`](docs/agent-understanding.md) | The intake→draft→ship loop, judgment calls, publish authority, anti-patterns |
| [`docs/writing-general.md`](docs/writing-general.md) | Craft: `life` + `software` essays |
| [`docs/writing-avi.md`](docs/writing-avi.md) | Craft: letters to Avi |
| [`docs/writing-strength.md`](docs/writing-strength.md) | Craft: the weekly training log |

## Voice (this is a ghostwriting repo)
Claude drafts posts from topics/memories the author supplies. Write in his
established voice — see existing posts in `content/posts/`:
- Plain language a non-technical reader follows; warm; concepts and principles
  over tool/brand names.
- Software essays follow the arc **what it is → the problem in plain terms →
  the principles, if you want this**. No tool names.
- Letters in the `avi` section (to his daughter) are honest and spare.
- Don't invent load-bearing facts to fill a gap — ask instead.

## Adding a post
Drop `content/posts/YYYY-MM-DD-slug.md` with frontmatter:
`title`, `date`, `description`, `tags` (comma-separated), and `section` =
`software` (default) | `life` | `avi` | `strength`. `avi` and `strength` are
nested shelves; `strength` is a week-by-week training log excluded from the home
page. Home page has a hand-edited **Now** list near the top of `build.js`.

## Ship — now automatic
Pushing to `main` with changes under `content/**`, `static/**`, or `build.js`
triggers `.github/workflows/deploy.yml`: it builds and `aws s3 sync … --delete`
to the `akshathphillips-blog` bucket. No AWS keys on any dev machine — CI uses a
scoped deploy-only IAM user via GitHub Actions secrets. So a post written and
pushed from any device goes live on its own. `scripts/deploy.sh` still does a
manual local deploy.

Live: http://akshathphillips-blog.s3-website-us-east-1.amazonaws.com

## Gotchas
- **`--delete` means the repo is the source of truth.** Glimpses and Bookmarks
  render at runtime from `content/glimpses.json` / `content/bookmarks.json`,
  which can be edited directly in the S3 bucket. If you edit them in the bucket,
  mirror the change back into the repo or the next deploy clobbers it.
- **Analytics beacon** (Cloudflare, cookieless) is injected by `build.js` only
  when `CF_BEACON_TOKEN` env var (or a gitignored `analytics.token` file) is
  present. CI passes it from a GitHub secret; don't remove that or analytics
  silently stop. The token is gitignored — never commit it.
- This repo is **public** — keep this file and commits free of anything private.
