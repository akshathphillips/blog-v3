---
title: An assembly line for AI enrichment
date: 2026-05-15
description: Turning one giant, fragile AI job into four small workers that can't take each other down.
---

We had a mountain of records that needed something only an AI could add — call it *enrichment*: read the thing, understand it, attach the summary or the label or the extracted detail that makes it useful. Tens of thousands of them, more arriving daily.

## The problem, in plain terms

The obvious version of this is one big program: loop over the records, send each to the AI, save the answer. And the obvious version fails the way all big loops fail — at 2 a.m., 90% of the way through, because one record was malformed or the AI service hiccuped. Now you get to choose between starting over (expensive, slow) or figuring out exactly where it died (miserable). Worse, the AI step isn't instant. You submit work and the answer comes back *later*. A single loop that submits, waits, and saves is idle most of its life and fragile all of it.

The fix wasn't a smarter program. It was admitting this is an assembly line, and an assembly line wants stations.

## Four small workers

- **The gatherer** decides what needs doing. It scans for records that haven't been enriched yet and puts them in line. That's its whole job.
- **The poller** watches the slow middle. Work that's been submitted to the AI is a ticket, not an answer; the poller checks tickets and notices when one is ready.
- **The downloader** fetches finished results and stores them raw, exactly as they arrived, before anyone touches them.
- **The writer** takes the raw results, shapes them to fit our world, and commits them to the system of record.

Each worker does one thing, leaves a note about what it did, and doesn't know the others exist. The notes — a little status on each record: *queued, submitted, ready, downloaded, written* — are the conveyor belt.

## The principles, if you want to build one

**Cut at the slow joints.** The places to split a pipeline are wherever you wait: on a third party, on a big download, on a database. Waiting is where things fail, so give each wait its own worker with its own retry.

**Make the state visible, not implied.** Every record should carry its own answer to "where am I in the process?" — stored somewhere durable, not in a running program's memory. Then a crash costs you nothing: restart, read the notes, continue. Nobody has to remember anything.

**Make every step safe to repeat.** Each worker should be able to run twice without doing damage — enriching an already-enriched record should be a no-op, not a duplicate. Once that's true, your error handling collapses into one strategy: *just run it again.*

**Keep the raw thing.** Store what the AI actually returned before you transform it. When the writer has a bug (it will), you fix the bug and re-run the writer — without paying the AI to redo the work.

**Let the stations scale separately.** When results pile up because writing is slow, you add writers — not more of everything. A single big loop can't make that trade; an assembly line does it for free.

None of this is AI-specific, which is rather the point. The AI is just the slowest, flakiest, most expensive station on the line — exactly the kind of coworker the assembly line was invented for.
