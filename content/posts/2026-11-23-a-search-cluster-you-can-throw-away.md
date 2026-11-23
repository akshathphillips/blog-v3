---
title: A search cluster you can throw away
date: 2026-11-23
description: Why we rebuilt the move to a new search cluster around a copy we can load again and again, so the cluster itself stops being precious.
tags: architecture, search, systems, backend, pipelines
---

Behind the search box at work there's a search cluster: a few dozen machines holding an index of every document we have, more than a billion of them, ready to answer a query in under a second. Ours has been running for years. It works, it's old, and replacing it has turned out to be one of the harder things I've worked on.

## The problem, in plain terms

Moving a search index sounds like copying files. It isn't. The index is built, not copied: every document is read out of the main database, reshaped into the form search wants, and fed in. At our size that reading and reshaping takes one to two weeks of machines working around the clock. It's the expensive part, and the old way of moving did it straight into the new cluster.

That makes every attempt a two-week bet, and an earlier bet lost. Searches that had taken under a second sometimes took ten seconds or more. The reasons were mundane: a handful of settings that each looked reasonable and together starved the machines. Memory promised twice over. Caches that threw themselves away and rebuilt every minute while queries waited. Disks asked to read far more than anyone needed. None of it was hard to fix once we saw it. But the fix lived in a cluster we had just spent weeks filling, and the only way to try a different shape was to spend those weeks again.

The old cluster had its own surprises. Nearly a third of what it holds is documents that were deleted long ago but never cleaned out, dead weight it carries on every search.

Two more things make the move harder. People keep editing documents the whole time, so a two-week copy is two weeks of changes the copy never saw. And the failures are quiet. My favorite: a launch setting left over from an early smoke test, which meant a full run would have finished successfully having sent about one ten-thousandth of one percent of the documents. Nothing errors. It just does almost nothing, and calls that done.

## What we built instead

The new design splits the move in two, at the expensive joint.

- **Read once, into a durable copy.** The slow reading and reshaping now writes into plain, cheap storage as numbered, sealed bundles of a few thousand documents each. It happens once. Each bundle carries its own fingerprint and its own count.
- **Load as many times as we like.** A loader reads those bundles in order and pours them into whichever cluster we point it at. Loading takes days, not weeks. If a cluster's shape is wrong, we tear it down, build a different one, and load again. The expensive half never runs twice.
- **Start recording changes before anything else.** Before the big copy begins, a recorder starts writing every edit into its own stream of bundles, and it doesn't stop until the switchover, through every teardown and retry. Order matters: start it second and every change made during the copy is simply gone.
- **Every document carries a version stamp.** The cluster keeps the newest version it has seen and quietly ignores anything older. Replaying a bundle twice, or a late edit arriving out of order, can't overwrite something newer.
- **Check everything before it goes in.** Each bundle is verified (fingerprint, count, every record well-formed) before any of it reaches the cluster. A bundle goes in whole or not at all.
- **The switchover is one signpost.** Every application finds search by a nickname, not an address. When the new cluster is ready, we move the nickname and everything follows at once, with no redeploys. The old cluster stays running, so going back is moving the nickname back.

We also tried, and dropped, writing every change to both the copy and the new cluster at the same time. It sounds safer. It isn't: a hiccup on the search side would have stalled the recorder, which is the one part we can never replay. One writer into the cluster, and search problems can never block the capture.

## What we hope it brings

The honest headline is that the cluster stops being precious. A bad shape becomes a reload instead of a lost month, so we get to experiment against the real data: fewer machines, a different split of the index, the next version of the software. The first new cluster is deliberately conservative. Once it has settled in and the old one is retired, the plan is to try a smaller, cheaper shape, loaded from the same copy, without touching the main database at all.

It also changes what a disaster looks like. If a cluster ever dies outright, recovery is the same as migration: build a new one and load. And the next time we need to move, the hardest part is already done and sitting in storage.

## The principles, if you want this

**Split at the expensive step.** Find the part of the move that's slow and can't be repeated cheaply, and make it write somewhere durable. Everything after it becomes cheap enough to retry.

**Treat the fast thing as a copy.** If you can rebuild it from something you trust, it isn't your source of truth; it's a view. Views are allowed to be thrown away.

**Record changes from the start.** Anything that copies live data has to capture what changes during the copy, and the capture has to start first.

**Let the newest version win, everywhere.** Stamp every record with a version and make the destination ignore older ones. Repeats and late arrivals stop being dangerous, and "just run it again" becomes a plan.

**Never let the fragile part block the irreplaceable part.** If two things must happen and only one can be redone, don't tie them together.

**Know whether you can ever catch up.** If changes arrive faster than you can load them, you will never finish. Measure both, and have the loader say so out loud.

**Make the switch one move, and keep the way back.** Point everything at a name, move the name, and leave the old thing standing until you're sure.

For years the search cluster was the thing we protected, because rebuilding it was so expensive. Now the expensive part lives somewhere else, and the cluster is just the latest place we've loaded it.
