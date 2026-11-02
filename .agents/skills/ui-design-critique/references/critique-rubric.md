# 9-Axis UI Critique Rubric & Refinement Lenses

After implementing any UI change, step out of the "builder" role and adopt the persona of a **hostile but constructive Design Director**. Evaluate the rendered Desktop (`1440×900`) and Mobile (`390×844`) views across these 9 axes.

---

## Part 1 — The 9 Critique Axes

### A. Composition & Focal Hierarchy
- **Primary Focal Point Test**: Within 500ms of looking at the screen, does the eye land immediately on the primary interactive canvas (e.g., the 8×8 chessboard and active match clocks)?
- **Visual Weight Ratio**: Does the primary workspace occupy $\ge 60\%$ of the visual field without sidebars crowding it?
- **Container Restraint**: Are there $\le 2$ levels of nested bordered boxes in any region?

### B. Typography (`typeset` lens)
- **Scale & Contrast**: Is there a clear distinction between section titles (`14px–16px`, `600–700`), primary labels (`13px`, `600`), body/controls (`12.5px`, `500`), and metadata (`11px`, `500`)?
- **Tabular Numerals**: Do all clocks, ratings, move numbers, and counters use `font-variant-numeric: tabular-nums`?
- **Line Length & Wrapping**: Do button labels (e.g., in toolbars or docks) stay on a single crisp line on desktop without awkward 2-line wrapping?

### C. Spacing & Alignment (`layout` lens)
- **Grid Rhythm**: Are paddings and gaps multiples of `4px` (`4px, 8px, 12px, 16px, 24px`)?
- **Flush Edge Alignment**: Do the top player bar, the board frame, and the bottom control dock share the exact same outer width and vertical alignment axis?

### D. Color & Surface Materiality (`quieter` lens)
- **Zero AI-Slop Gradients**: Have arbitrary purple/pink/blue neon gradients been replaced by architectural dark/matte surfaces (`#0c0d10`–`#1a1d23`) and purposeful material accents?
- **Contrast Compliance**: Does primary text achieve $\ge 7:1$ AAA contrast and secondary text $\ge 4.5:1$ AA contrast against its surface?

### E. Component Craft & Asset Fidelity
- **Crisp Vector Rendering**: Are all icons and domain assets (such as chess pieces and board squares) 100% vector or high-DPI native with zero JPEG compression halos or blurry upscaling?
- **Radius Discipline**: Are border radii consistent (`6px` controls, `8px` cards, `12px` panels)?

### F. UX & Affordances
- **Immediate Playability**: Can the user interact with the primary workspace immediately upon page load without hitting dead ends?
- **Clear Mode Switching**: Is it obvious whether the user is configuring an Online 1v1 match, playing against AI, or playing 2-player local?

### G. Motion & Micro-Interactions (`animate` lens)
- **Causal Feedback**: Do hover, active (`scale(0.98)`), and icon micro-rotations feel crisp (`140ms–200ms`) rather than floaty or distracting?
- **Reduced Motion**: Is `@media (prefers-reduced-motion: reduce)` respected?

### H. Responsive Transformation
- **Mobile First-Screen Priority**: On `390×844`, is the entire board + both player clocks + primary action bar visible and playable without horizontal scrolling?
- **Touch Ergonomics**: Are all interactive buttons at least `36×36px`?

### I. Accessibility
- **Keyboard Focus**: Does every interactive control show a crisp `:focus-visible` ring?
- **Semantics & ARIA**: Do icon-only buttons have `aria-label` and `data-tooltip`?

---

## Part 2 — Priority Triage Matrix (`P0 -> P1 -> P2`)

Always fix issues in this strict order:
1. **P0 (Structural / Blocking)**: Blurry/artifacted assets, broken layout alignment, horizontal overflow, broken game/UI interactions, or competing focal points.
2. **P1 (Visual / Systemic)**: AI-slop purple/neon aesthetics, card-in-card nesting bloat, wrapping toolbar labels, or missing tabular numerals.
3. **P2 (Polish / Refinement)**: Hairline border opacity (`0.07` vs `0.10`), tooltip offset, and subtle icon hover transitions.

