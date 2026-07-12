---
title: Briefs, not babysitting
date: 2026-07-06
description: How I build software with an AI agent doing the hands-on work — by writing briefs instead of sitting at the keyboard.
tags: ai, agents, workflow, productivity
---

I'm building an iOS game, and I'm not the one typing most of it. An AI agent does the hands-on work; I playtest on weekends and decide what happens next. Getting that arrangement to actually function taught me more about delegation than about code.

## The problem, in plain terms

Working with an AI agent the naive way is a conversation: you ask, it does, you correct, it redoes. That's fine for an afternoon. It falls apart across weeks, because conversations don't remember. Every session starts from zero, re-explaining the project, re-litigating decisions already made, re-introducing the same constraints. You become the project's memory — which means the project can only move when you're present. That's not delegation; that's babysitting.

## What replaced it

**Briefs instead of requests.** A brief is a self-contained assignment: here's the goal, here's what already exists, here's what done looks like, here's what you may not touch. Anyone — human or AI — should be able to pick it up cold and produce the right thing. Writing one forces you to make the decisions *before* the work starts, which is exactly when they're cheapest.

**A baton, not a memory.** The project keeps one always-current status file: what's finished, what's in flight, what's blocked and on what. Every working session starts by reading it and ends by updating it. The agent's memory doesn't need to survive between sessions — the baton does. This is the old lesson of shift-work: the handoff note matters more than the worker.

**Gates, not supervision.** I don't watch the work happen. Instead there are fixed checkpoints — for me, weekly playtests — where the work must prove itself in the real thing, not in a report about the thing. Between gates, the agent has room to run. At the gate, reality votes.

**Verification lives inside the brief.** Every assignment carries its own definition of proof: the tests that must pass, the behavior I should see. "Done" is never the worker's opinion; it's a condition anyone can check.

## The principles, if you want to try it

- Write the assignment so a stranger could execute it. If you can't, the fuzziness you're avoiding on paper will surface in the work instead.
- Put project memory in the project, not in any head — yours included. Files persist; context windows and humans don't.
- Decide where the irreplaceable human judgment actually is (for me: *is this fun?*) and schedule it. Everything else, let go of.
- Make "blocked" a first-class status with a named blocker. Half of managing an autonomous worker is knowing precisely what it's waiting on you for.

The surprise wasn't that an AI could do the work. It's that the discipline this demands — clear briefs, honest status, defined proof — is just good engineering management, applied to a coworker with perfect focus and no memory.
