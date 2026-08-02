# Craft guide: general writing (`life` + `software`)

The two flat sections. Both appear on the Writing index (under "Life" and
"Software / Science") and in "Recent writing" on the home page.

Reference posts: *An assembly line for AI enrichment*, *The same battle, every
time*, *Briefs, not babysitting*, *Your training has memory* (software);
*Hello, again* (life).

## Software / Science: the arc

Every software essay follows the same three-beat shape, and it works:

1. **What it is.** Open with the concrete situation, in human terms. "We had a
   mountain of records that needed something only an AI could add." No preamble,
   no throat-clearing, no "recently I've been thinking about."
2. **`## The problem, in plain terms`.** Why the obvious approach fails, told so
   a non-engineer feels the pain. This section carries the essay; it's where
   the reader decides whether to keep going. Use the specific, embarrassing
   failure: *it dies at 2 a.m., 90% through*; *you're standing at the bench
   trying to remember last Tuesday*.
3. **`## The principles, if you want this`.** Transferable rules, bolded lead-in
   phrases, each with a sentence or two of why. This is the payoff: what a
   reader takes to their own problem.

A middle section describing what he actually built often sits between 2 and 3
(`## What I'm building`, `## Four small workers`, `## What it took`). Optional.

Close on a turn: a line that reframes what came before. *"The AI is just the
slowest, flakiest, most expensive station on the line, exactly the kind of
coworker the assembly line was invented for."*

## The no-tool-names rule

**This is the defining constraint of the whole site.** Never "use Spring Data
JPA" or "we put it in DynamoDB." Write the *concept*: "give each wait its own
worker with its own retry," "store what came back before you transform it."

Two reasons, both his: concepts outlive tools, and a non-technical reader (his
wife, his daughter someday) should be able to read every post here. If a
sentence only makes sense to someone who knows the framework, rewrite it.

The same applies to jargon. "Idempotent" became *"make every step safe to
repeat."* "Fixed timestep" became *"fix the heartbeat."* Find the plain phrase;
it's almost always better writing anyway.

## Naming things

Give the pieces plain-English names and the essay organizes itself: *the
gatherer, the poller, the downloader, the writer*. Not the class names from the
codebase, the names a person would use to explain it at a kitchen table.

## Life posts

Same voice, no required structure. Personal or meta: why the site exists, why a
decision got made. Direct, a little wry, no sentimentality. `section: life`.

## Dating

Software essays are dated **to when the idea was first discussed, not when the
post was written.** The site reads as a record of thinking over time, so a piece
about a thing he built in May belongs in May. Ask if the date matters and isn't
obvious. Everything else: date to when it happened, or today.

## Mechanics

```yaml
---
title: Sentence case, no colon-subtitle if avoidable
date: 2026-07-13
section: software    # or life; software is the default and may be omitted
description: One line, shows in lists and as the meta description.
tags: ai, architecture, pipelines, systems, backend
---
```

- **Title**: short and concrete, ideally a phrase from the essay itself.
  *"Briefs, not babysitting."* *"The same battle, every time."*
- **Description**: one sentence, says what the reader gets. Not a teaser.
- **Tags**: 3–6, lowercase, comma-separated. Reuse existing tags where they fit
  (check `dist/content/search-index.json`); tags drive the search tag cloud, so
  inventing near-duplicates fragments it.
- **Length**: 600–1,100 words. If it's running longer, the "problem" section is
  probably doing work the "principles" section should do.
- **Headings**: `##` only. `#` is the post title, emitted by the build.
