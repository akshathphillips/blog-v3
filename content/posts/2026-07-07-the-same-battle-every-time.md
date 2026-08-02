---
title: The same battle, every time
date: 2026-07-07
description: Why I built my game engine to be deterministic: same inputs, same battle, down to the last frame.
tags: game-dev, determinism, simulation, ios
---

The heart of the game I'm building is a simulation: units move, fight, and die on a battlefield. Early on I made a decision that shaped everything after it: the simulation is *deterministic*. Given the same starting conditions and the same player commands, the battle plays out identically, every single time, on every device, down to the last frame.

## The problem, in plain terms

Software that involves randomness and timing usually behaves a little differently on every run. Mostly you don't notice. Then a player reports "my units froze mid-battle," you try it, and nothing. The bug is real, but you can't summon it, because your run isn't their run. Non-reproducible bugs are the most expensive kind: you're debugging a ghost.

Determinism kills the ghost. If the same inputs always produce the same battle, then any bug comes with its own recipe: here's the seed, here's the commands, watch it break. Every mystery becomes an errand. And you get gifts you didn't ask for: replays are free (store the inputs, not a video; re-run to watch), testing is trustworthy (a failing test fails every time), and if two devices ever need to agree on a battle, they can, by construction.

## What it took

Determinism isn't a feature you add; it's a set of temptations you refuse. Anything that can differ between two runs must be found and evicted:

- **Tame randomness.** Random isn't the enemy; *unrecorded* random is. All randomness flows from one seed, and the seed is part of the battle's identity. Same seed, same "luck."
- **Refuse decimal drift.** Fractional arithmetic rounds differently across machines, and in a long simulation those dust-sized errors snowball until two battles disagree. Positions in my engine are whole numbers on a very fine grid, thousandths of a tile. Whole-number math is exact everywhere, forever.
- **Fix the heartbeat.** The simulation advances in fixed ticks (thirty per second, always), never "as fast as the device can go." Frame rate is how fast you *watch*; the tick is how fast the world *is*. A blazing new phone and a wheezing old one compute the identical battle.
- **Separate the world from the window.** The simulation doesn't know rendering exists. Graphics read the world and draw it; they never touch it. The moment drawing can influence outcomes, the device's rendering quirks become gameplay, and determinism is gone.

## The principles, if you want this

Treat every hidden input as a bug: the clock, the frame rate, decimal rounding, the incidental order in which things happen to be processed. Either eliminate it or promote it into an explicit, recorded input. The test is brutal and simple: run the simulation twice from the same seed and compare the final state, number for number. Either it's identical or it isn't; determinism doesn't do "mostly."

It costs discipline up front. It pays you back every day after, in the currency that matters most: bugs you can actually catch.
