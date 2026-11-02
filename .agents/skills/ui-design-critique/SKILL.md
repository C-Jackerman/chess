---
name: ui-design-critique
description: >-
  Production-grade UI Design, Art Direction, AI-Slop Elimination, and Hostile UI Critique skill
  inspired by Nutlope/hallmark and pbakaus/impeccable. Use whenever designing a new page,
  redesigning an existing interface, auditing UI/UX quality, removing generic "AI slop",
  building a semantic design system, or polishing frontend components across desktop and mobile.
---

# UI Design & Critique Skill (`ui-design-critique`)

Transform frontend work from generic `LLM -> JSX/CSS -> done` output into intentional, high-craft product engineering. When this skill is active, operate simultaneously as:

> **Product Designer + Design Director + UX Engineer + Hostile UI Critic + Frontend Architect**

This skill synthesizes two complementary philosophies:
1. **Hallmark Principles (`Nutlope/hallmark`)**: Domain-authentic macrostructures, curated material & editorial palettes, intentional art direction, and automated visual anti-slop verification (`sloplint`).
2. **Impeccable Principles (`pbakaus/impeccable`)**: Structured 9-axis heuristic critique, targeted refinement passes (`quieter`, `typeset`, `layout`, `polish`, `animate`), strict `P0 -> P1 -> P2` triage, and bounded Desktop + Mobile browser verification loops.

---

## When to Invoke This Skill

Activate this skill for any of the following tasks:
- `Design a new page` or `Redesign this page`
- `Improve this component` or `Create a design system`
- `Audit this UI` or `Fix visual inconsistencies`
- `Improve UX`, `Improve responsive behavior`, or `Add meaningful motion`
- `Remove AI slop` or `Polish an existing frontend`

---

## The 7-Phase Core Pipeline

Execute phases sequentially. Never jump straight to writing CSS/HTML without completing Phases 1–3, and never finish without completing Phase 7 (Critique → Revision loop).

### Phase 1 — Understand (Context & Architecture Discovery)
Before touching code, inspect the repository to inventory:
1. **Product Purpose & Domain**: What real-world instrument, workspace, or environment does this app represent? (e.g., a competitive chess arena is a precision tournament instrument, not a purple SaaS marketing page).
2. **Existing Stack & Wiring**: HTML/DOM hooks (`id`, `data-*` attributes), state management, WebSocket/API contracts, and routing that must remain unbroken.
3. **Current Design Tokens & Debt**: Existing CSS variables, font families, icon sets, and visual bottlenecks.

### Phase 2 — Define Design Direction
Establish and articulate an explicit visual direction before writing styles:
1. **Brand Personality**: Select a deliberate archetype (e.g., *Precision Tournament Studio*, *Editorial Monolith*, *Tactile Hardware*, *Warm Architectural Dark*, *Swiss Technical Grid*). Never default to "generic dark SaaS with purple neon".
2. **Visual Language**:
   - **Surfaces**: Layered architectural luminance (e.g., `#0c0d10` canvas $\rightarrow$ `#131519` primary surface $\rightarrow$ `#1a1d23` elevated control) separated by `1px` crisp hairlines (`rgba(255, 255, 255, 0.07)`), not blurry neon glows.
   - **Typography**: Pair a high-character display/UI sans (`Plus Jakarta Sans` or `Inter`) with a disciplined tabular monospace (`JetBrains Mono` with `font-variant-numeric: tabular-nums`) for clocks, ratings, coordinates, and notation.
   - **Color System**: High-contrast neutral hierarchy (`#f4f4f6` primary, `#a1a8b8` secondary, `#687082` muted) + **one** purposeful functional accent (e.g., warm championship gold `#d4a853` or tournament emerald `#10b981`) and semantic status tokens.
3. **Layout Macrostructure**:
   - Identify the **single primary focal point** (in a chess application, the 8×8 board and active clocks must command $\ge 65\%$ of visual weight).
   - Subordinate secondary navigation and match configuration so they frame—never compete with—the focal point.

### Phase 3 — Build / Refine Semantic Design System
Consolidate styling into semantic CSS custom properties inside `:root` (and theme scopes) rather than scattered magic numbers:

```css
/* Surface Hierarchy */
--color-bg-canvas: #0b0c0e;
--color-surface-1: #121418;
--color-surface-2: #181b20;
--color-surface-3: #20242b;
--color-surface-interactive: rgba(255, 255, 255, 0.04);

/* Border & Hairline System */
--border-hairline: 1px solid rgba(255, 255, 255, 0.07);
--border-subtle: 1px solid rgba(255, 255, 255, 0.12);
--border-focus: 1px solid #d4a853;

/* Text Hierarchy */
--color-text-primary: #f3f4f6;
--color-text-secondary: #9ca3af;
--color-text-muted: #646d7c;

/* Brand & Semantic Accents */
--color-accent: #d4a853;
--color-accent-subtle: rgba(212, 168, 83, 0.14);
--color-success: #22c55e;
--color-danger: #ef4444;

/* Spacing & Radius Rhythm (4px base unit) */
--space-2xs: 4px;
--space-xs: 8px;
--space-sm: 12px;
--space-md: 16px;
--space-lg: 24px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;

/* Purposeful Motion */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--motion-fast: 140ms var(--ease-out-quart);
--motion-normal: 220ms var(--ease-out-quart);
```

### Phase 4 — Implement with High Craft
1. **Eliminate Card-in-Card Bloat**: Never nest more than 2 bordered containers. Use spacing, section headers, and `1px` dividers (`border-bottom: var(--border-hairline)`) to separate groups inside a panel.
2. **Coherent Vector Iconography**:
   - Zero emojis or Unicode symbols as UI icons.
   - Single unified stroke-based SVG icon system (`stroke-width: 1.5px–2px`, `stroke-linecap: round`, `stroke-linejoin: round`, optical `24x24` viewBox).
3. **Domain-Specific Assets (Crisp at Any DPI)**:
   - Never upscale low-resolution, compression-artifacted raster crops.
   - Use precision multi-layered vector SVG craftsmanship with physical material gradients, specular rim highlights, and crisp contact shadows so assets remain razor-sharp at 1x, 2x, and 4x Retina DPI.

### Phase 5 — Interaction Design & Meaningful Motion
Design explicit states for every interactive control:
- `Default`, `Hover`, `Focus-visible` (accessible keyboard ring), `Active/Pressed` (`scale(0.98)`), `Selected`, `Disabled` (`opacity: 0.45; pointer-events: none`), `Loading`, `Empty`, and `Error`.
- **Motion Discipline**: Every transition must communicate state, spatial relationship, or feedback. Always include `@media (prefers-reduced-motion: reduce)` support.

### Phase 6 — Responsive Transformation
Never treat mobile as "desktop shrunk down":
- **Desktop (`> 1160px`)**: Architectural 3-zone studio layout (compact rail navigation + dominant central arena + structured command dock).
- **Tablet / Mobile (`<= 1160px`)**: Prioritize the primary workspace (`order: 1`) at full viewport width (`calc(100vw - 24px)`), convert secondary docks into clean segmented sheets below the arena, compact player bars, and enforce touch targets $\ge 36\times36\text{px}$ with zero horizontal scroll (`overflow-x: hidden`).

### Phase 7 — Hostile UI Critique & Revision Loop
After initial implementation, **switch roles into a hostile but constructive UI critic**:
1. Run the automated diagnostic & screenshot script:
   ```bash
   node .agents/skills/ui-design-critique/scripts/ui-audit.js http://localhost:3000
   ```
2. Visually inspect the generated Desktop and Mobile screenshots using `read_file`.
3. Evaluate all 9 axes in [critique-rubric.md](./references/critique-rubric.md) and scan for every anti-pattern in [ai-slop-catalog.md](./references/ai-slop-catalog.md).
4. Triage findings strictly by priority:
   - **P0 (Structural)**: Broken hierarchy, competing focal points, horizontal overflow, broken interactions, blurry/artifacted assets, or missing accessibility hooks.
   - **P1 (Visual)**: AI-slop purple/neon gradients, card-in-card nesting bloat, weak typography/spacing rhythm, or noisy decorative elements.
   - **P2 (Polish)**: Micro-interaction timing, optical icon alignment, subtle border contrast, and tooltip positioning.
5. **Execute Revision Pass**: Fix `P0 -> P1 -> P2` issues in code and re-run `ui-audit.js` to prove zero regressions.

---

## Reference Manuals & Executable Tools

- **AI-Slop Detection & Replacement Catalog**: [./references/ai-slop-catalog.md](./references/ai-slop-catalog.md)
- **9-Axis Critique Rubric & Impeccable Lenses**: [./references/critique-rubric.md](./references/critique-rubric.md)
- **Automated Playwright UI & AI-Slop Auditor**: [./scripts/ui-audit.js](./scripts/ui-audit.js)

---

## Required Final Report Format

Whenever this skill completes a UI task, output a concise report using these exact sections:

```markdown
## Design Direction
...

## Major Decisions
...

## Components Changed
...

## UX Improvements
...

## Visual Improvements
...

## AI-Slop Removed
...

## Responsive Improvements
...

## Accessibility
...

## Validation
...

## Remaining Opportunities
...
```

