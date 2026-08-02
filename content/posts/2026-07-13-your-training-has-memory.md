---
title: Your training has memory
date: 2026-07-13
description: I'm building a small workout app around one idea: the app should remember your training so you don't have to.
tags: fitness, strength-training, side-project
---

The gym hides a little memory test in every visit. Week one, you bench press the empty bar and feel great about it. Week two, you walk up to the same bench and the test begins: *what did I do last time?* Was it 95 or 115? Three sets or four? Did I add weight or reps? You stand there scrolling through an app, squinting at last Tuesday, while someone hovers politely behind you waiting for the bench.

I got back under the barbell recently, and that test greeted me every single session. The apps I tried are perfectly good diaries; they'll faithfully record anything you tell them. But a diary is not a memory. A memory hands you the answer at the moment you need it, unasked. So I'm building my own app. It's called YAFA, *Yet Another Fitness App*. The name is a joke. The intention isn't.

## The problem, in plain terms

Workout apps fail me in three specific ways.

**They record, but don't remember.** The one question every lifter has at the start of every set (*what did I do last time?*) is exactly the question most apps make you dig for. The answer should be on screen the moment you open an exercise, already filled in as today's starting point. Not three taps and a scroll away.

**They think in days, not exercises.** Structured programs repeat: upper body Monday, lower body Tuesday, upper again Thursday. The same lift appears on different days of the week, and most apps treat each appearance as a stranger. But my bench press is one continuous story, no matter which day it happens to fall on. Split the story across day labels and the thread is gone, along with any sense of whether I'm actually progressing.

**They leave the math to you.** Warming up properly for a 195-pound working set means the empty bar, then roughly half, then seventy percent, then ninety, then work. That's arithmetic, done in your head, between sets, while tired, and the answers have to land on weights you can actually load from the plates on the rack. This is precisely the kind of dull, repeatable calculation software exists for.

And there's a quieter fourth failure: coming back after a gap. Two weeks off (travel, sickness, life) and the app cheerfully offers your old weight as if nothing happened. That's how people get hurt. The app knows exactly how long it's been. It should notice, and suggest easing back in lighter. A suggestion, not a scolding.

## What I'm building

Most of the design falls out of one decision: the *exercise*, not the workout day, is the unit of memory. Open any lift and the top of the screen tells you what you did last time and how long ago, regardless of which day of the program it was under. Today's numbers are computed from last time plus a simple progression rule, pre-filled and waiting; one tap says "did it," or you edit and move on. The warm-up ramp is generated from today's working weight, rounded to real plates. And if it's been too long since you touched a lift, a gentle flag suggests a lighter restart, which you're free to wave off.

The calendar matters too. The day you start is Week 1, your training days are laid out across the week, and the app knows a rest day from a workout day. You should be able to glance at one screen and see the week the way you'd see it in your head: what's done, what's today, what's next.

The machinery underneath is deliberately boring. It's a small app that installs from the browser, keeps everything on the phone itself so it works in a basement gym with no signal, and costs essentially nothing to run. Users two and three are my wife and my mother-in-law: three phones, three private logbooks, one shared reason to keep showing up.

## The principles, if you want this

- **Memory beats features.** One question answered at the right moment (*what did I do last time?*) is worth more than fifty charts. Build the memory first; everything else is decoration on top of it.
- **Suggest, never command.** The app proposes a weight, a ramp, a cautious restart. The human decides. Trust is built by being overridable.
- **Design for the worst moment, not the demo.** The real user is tired, sweaty, and has ninety seconds between sets. Big targets, numbers already filled in, nothing clever.
- **Stay free until it earns otherwise.** No servers worth paying for, no subscription, no account required to lift a barbell. If it ever grows past my family, it will have earned the complexity then.

I'm treating my own training as the test suite. I'll report back from the gym floor.
