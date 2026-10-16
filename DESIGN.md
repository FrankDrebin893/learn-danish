---
name: Learn Danish
description: Phone-first Danish vocabulary quiz and flashcards, answered on painted Nyhavn facade tiles.
colors:
  harbour-grey: "#eef2f4"
  harbour-tint: "#e1e8ee"
  paper: "#ffffff"
  ink: "#14233b"
  muted: "#55627a"
  line: "#cfd8e0"
  navy: "#17315c"
  brick: "#b0402c"
  ochre: "#e9a82f"
  ochre-ink: "#2a1d00"
  teal: "#1d7773"
  harbour-blue: "#3c6fb0"
  correct: "#156f43"
  wrong: "#9d1c14"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 9vw, 2.9rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  score:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "14px"
  xl: "20px"
  gable: "22px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "22px"
  xl: "24px"
components:
  prompt-card:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "26px 20px 22px"
    height: "190px"
  facade-tile-ochre:
    backgroundColor: "{colors.ochre}"
    textColor: "{colors.ochre-ink}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    height: "64px"
  facade-tile-brick:
    backgroundColor: "{colors.brick}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    height: "64px"
  facade-tile-teal:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    height: "64px"
  facade-tile-harbour:
    backgroundColor: "{colors.harbour-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "12px 14px"
    height: "64px"
  state-mark-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    size: "32px"
  button-primary:
    backgroundColor: "{colors.brick}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "0 18px"
    height: "52px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0 16px"
    height: "48px"
  tab-active:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "22px"
  select:
    backgroundColor: "{colors.harbour-grey}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "48px"
---

# Design System: Learn Danish

## Overview

**Creative North Star: "The Nyhavn Facade"**

The interface borrows the painted harbour-front houses of Nyhavn. A cool harbour-grey ground holds a navy house card crowned with a stepped gable, and the answers are flat, saturated facade-coloured tiles. Each tile is one painted house: ochre, brick, teal, harbour blue. The palette is cool and mineral with four warm-to-cool accents, and it deliberately avoids the cream, serif and flag-red language-app default.

Density is phone-first and thumb-sized: one question per screen, full-width tiles, 44px minimum targets, a fixed bottom tab bar on phones. Type is a single geometric grotesk at heavy weights for words and quiet weights for everything else. The answer is communicated by a mark that holds in a fixed white cell, never by colour alone.

**Key Characteristics:**
- Cool harbour-grey ground, navy anchor, four facade accents.
- One typeface (Schibsted Grotesk), weight 800 for words and numbers.
- Gabled navy prompt card as the single signature silhouette.
- Flat saturated tiles with a soft navy-tinted shadow; no gradients.
- State is a tick or cross inside a fixed white cell, plus a ring and strike-through.
- Light and dark schemes, both following the system preference.

## Colors

A harbour-grey field with a navy anchor and four painted-house accents, each tile colour fixed by its position in the list.

### Primary
- **Harbour Navy** (`navy`): prompt card, active tab, progress fill, score, selection highlight. The one dark anchor of the light scheme.

### Secondary
- **Brick** (`brick`): primary action button, the logo mark stroke, text caret, and the second facade tile.
- **Ochre** (`ochre`): first facade tile, streak pill, gender marker and verdict text on navy. Text on ochre is the dark `ochre-ink`, never white.
- **Teal** (`teal`): third facade tile.
- **Harbour Blue** (`harbour-blue`): fourth facade tile.

### Neutral
- **Harbour Grey** (`harbour-grey`): page ground and select/row fill.
- **Harbour Tint** (`harbour-tint`): quiet fills such as the light speaker button and the phone active-tab pill.
- **Paper** (`paper`): panels, tab bar, the state-mark cell.
- **Ink** (`ink`): body text and focus outline.
- **Muted** (`muted`): secondary text, labels, hints.
- **Line** (`line`): hairlines, borders, progress track.
- **Correct** / **Wrong** (`correct`, `wrong`): reserved status greens and reds, used for the glyph inside the state-mark cell.

Dark scheme: ground `#0e1827`, paper `#17243a`, ink `#eaf0f7`; accents lighten (brick `#d0624d`, ochre `#f0b94b`, teal `#2a9a95`, harbour `#5b8fd0`) while the tiles use deeper variants (`#c98f1e`, `#a2392a`, `#17625f`, `#2f5c98`) so white or dark text keeps contrast.

### Named Rules
**The Four Houses Rule.** Tile colours are assigned by position (ochre, brick, teal, harbour blue) and never carry meaning. Meaning belongs to the state-mark cell.
**The Brick Is For Action Rule.** Brick is the single call-to-action colour; it is not used for errors.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui, sans-serif), self-hosted variable woff2, weights 400 to 900
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** none; tabular numerals via `font-variant-numeric` where numbers are compared.

**Character:** One grotesk used loud for Danish words and quiet for support text. Tight negative tracking on large sizes keeps words compact on a narrow screen.

### Hierarchy
- **Display** (800, clamp(2rem, 9vw, 2.9rem), 1.1): the Danish word on the prompt card and flashcard.
- **Headline** (800, 1.9rem, 1.1): screen titles, balanced wrap.
- **Score** (800, 4rem, 1): result figure in navy.
- **Body** (400, 1.0625rem, 1.5): running text; intro copy capped at 44ch.
- **Label** (700, 0.85rem): form labels in muted; tab labels 0.95rem at 600 (0.75rem on the phone bar).
- Tile text is 700 at inherited size; small prompt and part-of-speech lines are 0.8 to 0.9rem on navy at 80% white.

### Named Rules
**The Weight Contrast Rule.** Words and numbers are 800; everything else is 400 to 700. No intermediate display weights.

## Layout

A single centred column, `max-width: 640px`, 16px side gutters, with bottom padding that clears the 64px tab bar plus safe-area inset. Spacing runs on small steps: 6, 10, 14, 22, 24px. Option tiles stack full-width with a 10px gap and become a 2x2 grid at 560px. Setup selects pair in two columns at 520px. Navigation moves from a fixed bottom bar (below 640px) to inline header pills. Flashcards fill up to `min(60dvh, 380px)`. Footer is pushed to the bottom with auto margin.

## Elevation & Depth

Mostly flat colour fields with one soft shadow vocabulary and a ring for state.

### Shadow Vocabulary
- **Soft lift** (`box-shadow: 0 1px 2px rgb(20 35 59 / .08), 0 10px 24px -10px rgb(20 35 59 / .22)`): panels and tiles.
- **State ring** (`box-shadow: 0 0 0 3px var(--paper), 0 0 0 6px var(--ink)`): answered tiles, correct and wrong alike.

### Named Rules
**The Ring Plus Mark Rule.** An answered tile shows a double ring, a glyph in the state-mark cell, and (when wrong) a struck-through label; unanswered tiles dim to 40% opacity. Colour alone never signals correctness.

## Shapes

Soft, house-like geometry. Tiles use 14px corners, panels 20px, selects 12px, tabs and the streak are pills, the speaker button is a circle. The prompt card is deliberately asymmetric: 6px top corners and 22px bottom corners, crowned by two stacked rounded steps (62% and 30% wide, 10px tall) that read as a Danish stepped gable. Facade ornaments are bars with 3px top corners, heights 30 to 42px.

## Components

### Prompt Card (gabled)
Navy block, white text, centred, min-height 190px, stepped gable above. Holds the prompt line, the Danish word at display size with an ochre gender marker, part of speech in italic, and a 44px translucent circular speaker button. The setup variant (`intro-card`) is left-aligned and carries a row of four coloured facade bars.

### Facade Tiles (answers)
Full-width buttons, min-height 64px, 14px radius, flat fill from the four-house sequence, 700 weight. Hover lifts 2px; press scales to 0.985. After an answer, the chosen tile gets the state ring, the others dim.

### State-Mark Cell
A 32px white square (6px radius) at the left of each tile. It shows a letter key (hidden on touch devices), then a 3px-stroke tick (`correct`) or cross (`wrong`) that holds in place. The cell does not move or resize between states.

### Buttons
- **Primary:** brick fill, white text (dark text in dark scheme), 52px tall, 14px radius, full width; hover brightens, press scales to 0.98.
- **Ghost:** transparent, 1.5px line border, 48px tall; border goes navy on hover.
- **Speaker:** 44px circle; translucent white on navy, harbour-tint with navy glyph elsewhere.

### Navigation
Pill tabs with 20px stroke icons and labels. Active is navy with white text. Below 640px they become a fixed bottom bar on paper with a top hairline; active shows a tint pill with navy text.

### Inputs
Selects: 48px, harbour-grey fill, 1.5px line border, 12px radius, custom chevron. Focus turns the border navy.

### Panel and Flashcard
White panel, 1px line border, 20px radius, soft lift, 22px padding. Flashcard reuses it with centred content and a navy "reveal" line (ochre in dark).

### Progress and Streak
6px track in line colour with navy fill; streak is an ochre pill with dark text.

Motion: `cubic-bezier(.2,.8,.2,1)`, 150 to 350ms; content rises 8px on entry; all motion is disabled under reduced-motion.

## Do's and Don'ts

### Do:
- **Do** keep the ground harbour-grey and the anchor navy; use the four houses only for answer tiles and small facade ornaments.
- **Do** pair every correctness signal with a glyph in the state-mark cell, a ring, and a strike-through on wrong.
- **Do** keep touch targets at 44px or more and the text on ochre dark.
- **Do** use Schibsted Grotesk at 800 for words and numbers, with negative tracking at large sizes.
- **Do** use a 3px ink focus ring (ochre in dark) with 3px offset.

### Don't:
- **Don't** use cream grounds, serif display faces, or flag-red as a brand colour.
- **Don't** let tile colour imply right or wrong.
- **Don't** put white text on ochre.
- **Don't** add gradients or hard offset shadows; depth is the soft lift and the state ring.
- **Don't** make the state-mark cell resize or move when state changes.
