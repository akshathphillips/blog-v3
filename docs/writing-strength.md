# Craft guide — strength journal (`section: strength`)

A week-by-week training log on its own shelf at `/writing/strength/`. Deliberately
**excluded from the home page's "Recent writing"** — it's "mostly for me."

Reference post: *Week 1 — the starting line*.

## What this log is for

Stated in week 1, and it governs everything: *"Motivation is a liar; a record
isn't."* The job of each entry is to make self-deception impossible later —
future-Akshath can't pretend the work happened when it didn't, or forget it when
it did.

That makes **honesty the only real style rule.** A week with two missed sessions
is a good entry if it says so plainly. Never write around a bad week, never
inflate a good one, and never add encouragement he didn't express — this is a
log, not a coach.

The stated goal is ~20% body fat by his 35th birthday, but week 1 already frames
the number as a proxy: *"the number is just a proxy for the real goal: a body
that holds up."* The why is his family — training "for my ladies," and being the
dad who can keep up with Avi in twenty years. Let that sit underneath the log
without repeating it every week.

## Shape of a weekly entry

Week 1 set the template; later weeks are lighter. A typical entry:

- **A short opening** — how the week actually went, in a sentence or two.
- **What happened** — sessions hit vs. planned, the lifts that moved, anything
  that got in the way (travel, the toddler, sleep).
- **The numbers** — only the ones he gives. See below.
- **`## Next week`** — one concrete assignment. Week 1's is the model: *"Show up
  four times. Log every session. That's the whole assignment."*

Week 1 also carried `## Why`, `## The plan, kept boring`, and `## Baseline` —
those were one-time scaffolding. Don't re-litigate the why every week.

## Numbers — the biggest risk in this section

**Never fabricate a weight, a rep count, a bodyweight, a session count, or a
body-fat number.** This is the single easiest way to poison the log: it exists
precisely so the numbers can be trusted, and invented ones make the whole record
worthless.

If he sends "hit 185 on squats, felt good, missed Thursday" — that's what goes
in. If he sends "decent week" with no numbers, write the entry without numbers
rather than inventing plausible ones. Ask if a number is clearly the point of
what he sent and you don't have it.

Round and phrase numbers the way he does. Keep the plate math and programming
detail light — this is a journal, not a program a stranger should follow.

## Voice

Same plain language as the rest of the site, a notch more clipped. Wry about the
hard parts (*"Sleep is training too. The toddler has opinions about this one."*).
No fitness-influencer register: no "crushed it," no grind talk, no exclamation
marks. Boring on purpose is a stated value — *"Compound-first. Boring on
purpose."*

## Relationship to YAFA

He's building **YAFA**, a local-first workout app, and trains as its test case
(*"I'm treating my own training as the test suite"*). Keep the streams separate:

- **Product thinking about the app** → `section: software` (see *Your training
  has memory*).
- **Training that happened**, including the app being useful or annoying in the
  gym → here.

A journal entry can mention the app in passing; it shouldn't turn into a design
essay.

## Mechanics

```yaml
---
title: Week 2 — short phrase
date: 2026-07-13
section: strength
description: One line on what the week actually held.
tags: strength, training, fitness
---
```

- **Filename**: `content/posts/YYYY-MM-DD-week-NN-slug.md` — keep the `week-NN`
  so the files sort and scan.
- **Title**: `Week N — <short phrase>`. Em dash, lowercase phrase.
- **Date**: end of the week being logged.
- **Length**: 200–500 words. Shorter than the essays, on purpose.
- **Tags**: `strength, training, fitness` base set, plus specifics.
- **Check the number.** Read the last entry's title before writing so `N` is
  right and you're not repeating a week.
