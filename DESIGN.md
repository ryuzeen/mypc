# Design

The page is a loadout: each group of hardware (PC, Mesa, Guardados) is one screen-sized bay with a slot list, a lit stage and a spec panel. Scrolling moves between bays; the room light takes the colour of the item on stage.

## Palette

- Ground `#0a0b0d`, tiles `#121418` / `#181b20`, hairlines `rgba(220,230,255,.08)`.
- Text `#eef1f5`, secondary `#a7adb7`, tertiary `#80868f`.
- `--tint`: one colour per item, set in `assets/data.js` (`tint`). It drives the ambient light, the platform ring, the active slot ring, the tab underline and the 240 Hz line. Never used for text fills except the item kind label, mixed toward white.

## Type

Archivo variable, self-hosted (`assets/fonts`). Display uses width 112–125% at 850–900 weight with tight tracking; body at 100% width. Numbers are tabular.

## Motion

- Ambient: two tinted blobs drifting (26s / 34s), fine grain, cursor light. All off under reduced motion.
- Item swap: incoming image rises from blur, outgoing blurs out; panel and ghost name crossfade. Under 400 ms.
- Ghost model name behind the stage drifts slowly; outline only, no fills or gradients.
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` for UI, `cubic-bezier(0.77, 0, 0.175, 1)` for drifting.

## Rules

- No colored glows; shadows carry offset. No gradient text. No eyebrows above headings.
- Product photos are cut-outs with soft alpha (`tools/cut2.py` in the build workspace), served from `assets/img`.
- Prices are averages of Brazilian listings with date, or marked "valor pago". Performance numbers are ranges from public sources, labelled as not measured.
