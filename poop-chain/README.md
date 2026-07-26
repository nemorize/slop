# Poop Chain

A chain-reaction clicking game where poop falls from the sky. Tap a falling poop to detonate it — if other poops are caught in the blast radius, they explode too, triggering an explosive chain reaction with squishy sound effects.

## How to Play

- **Click / tap** falling poops to detonate them
- Each explosion triggers nearby poops, creating **chain reactions**
- Bigger chains earn exponentially more points (combo multiplier)
- Score as many explosions as possible before the **30-second** timer runs out

## Poop Types

Different poops fall from the sky, each with a distinct look, size, and point value:

| Type | Points | Rarity | Notes |
|------|--------|--------|-------|
| Bird Drop | 10 | Common | Small, white splat — easy to miss but everywhere |
| Dog Poop | 25 | Common | Medium brown coil |
| Human Poop | 50 | Uncommon | Classic tall swirl — satisfying to pop |
| Cow Dung | 70 | Rare | Large flat patty — huge blast radius, big points |

## Features

- Four distinct poop types drawn procedurally on canvas
- Procedural squish/plop sound effects (Web Audio API — no audio files needed)
- Sound pitch varies by poop size
- Cascade chain reactions with visual and audio feedback
- Screen shake and particle splatter on explosions
- Poops pile up at the bottom for dense chain opportunities
- Mobile-friendly with touch support

## Tech

- Vanilla HTML / CSS / JavaScript
- Canvas 2D rendering
- Web Audio API for sound synthesis

## Image Credits

Poop illustrations are custom-drawn SVGs.

Poop illustrations are custom-drawn SVGs. Sound effects (squish/slime/impact) sourced from [Kenney](https://kenney.nl/assets) via [Cy4nWare/sfx-api](https://github.com/Cy4nWare/sfx-api), licensed under **CC0 1.0 Universal (Public Domain)**.
