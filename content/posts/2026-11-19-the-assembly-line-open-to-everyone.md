---
title: The assembly line, open to everyone
date: 2026-11-19
description: Why I turned a one-off AI pipeline into a shared service any team can hand work to, and what it took to make that safe.
tags: ai, architecture, pipelines, systems, backend
---

In May I wrote about [an assembly line for AI enrichment](../an-assembly-line-for-ai-enrichment/index.html): four small workers that take a mountain of records, send them to an AI, and write the answers back. It worked. Then the next AI job showed up, and the one after that was already in sight.

One was a second pass over text that a machine had already read off scanned pages, to fix what the first pass got wrong. Further out: translation, and repairing broken links. Different jobs, same shape every time. A pile of documents, an AI that answers *later*, and results that have to land back in exactly the right place.

So I stopped building the line and started running it. The pipeline became a shared service: a team hands it a batch of content, names the job they want done, and gets an answer back for every single item, delivered however they want it.

## The problem, in plain terms

The obvious path is that every team builds its own assembly line. That fails in three ways, and none of them are about the AI.

The first is the door. All of this work goes through the same narrow connection to the AI service, and if everyone pushes big uploads through it at once, it clogs for the whole company. Ten teams politely taking turns is a policy. One service that can only ever send one thing at a time is a guarantee.

The second is the bill. AI work costs real money per document, and the expensive mistakes are the quiet ones: sending the same document twice, retrying something that was actually already running, running out of budget halfway through the night. Every team would have to learn those lessons separately, by paying for them.

The third is silence. When a pipeline fails loudly, you fix it. When it fails quietly, a document gets accepted and then recorded nowhere, and nobody finds out until someone asks why half the archive never changed.

## What I built

The four workers from May are still there: one sends work in, one checks on it, one fetches results, one delivers them. What changed is everything around them.

- **A job is configuration, not code.** New AI work means writing down the instructions for the AI, which version they are, who may use them, and where results should go. The line itself doesn't change.
- **Two ways in.** Some teams want the whole thing handled: we gather the content and write the answers back into their documents. Others want to own both ends: content in, results out, and the service never has to understand their world.
- **Every item keeps its own name.** A team tags each document with an ID they already use, and that ID travels untouched through the whole trip. Results come back out of order, and some come back broken; the per-item name is what lets us say exactly which.
- **A fingerprint for every document.** Before anything goes to the AI, the service checks whether it has already answered *this exact content* with *these exact instructions*. If so, the document skips the line.
- **A budget check before every send.** Ask how much money is left, hold some back for work still in flight, send what fits, and park the rest for later.
- **A watchman.** Every document the service says yes to must be written down somewhere. Something checks regularly for any that aren't, and raises a flag if it finds one.

## What going live taught me

Getting ready for the first real team, the scariest bugs weren't in the logic. They were all the same kind: things that would have produced *nothing* rather than an error. A permission that didn't reach where results were going. A destination pointed at a test bin instead of the real one. And the best one: the code on the receiving end choked on every single answer and quietly threw it away. Not one test noticed, because every test had swapped that code for a stand-in that returned exactly what we hoped for. A test like that only tests your hopes.

## The principles, if you want this

**Make the bottleneck a rule, not a request.** If something must happen one at a time, build the line so it can only happen one at a time. Then nobody has to remember.

**Never pay twice for the same answer.** Fingerprint the content together with the instructions. Change either, and it's new work. Change neither, and you already have the answer.

**Running out of money is a pause, not a failure.** Early on, work that hit a budget check got retried a few times and then thrown on the reject pile, while there was plenty of budget left. Parking it and resending later turned the budget from a cliff into a dial.

**When you don't know, don't guess.** If the AI service never says clearly whether it took a batch, retrying risks paying twice and giving up risks losing it. Set it aside, mark it uncertain, and let a person check.

**Report failure per item, with a reason.** A batch can finish while documents inside it failed. Each one goes back to its team with a reason they can act on, not just a gap where an answer should be.

**Prove one real change.** Before believing any of it works, watch one real document actually change at the far end. One observed change retires more unknowns than a wall of green checkmarks.

In May I called the AI the slowest, flakiest, most expensive station on the line. It still is. The difference now is that nobody else has to learn that the hard way.
