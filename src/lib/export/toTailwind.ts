import type { StyleSeed } from "@/lib/styles/types";

export function toTailwind(seed: StyleSeed): string {
  return `/* Tailwind v4 theme for ${seed.name} (${seed.nameEn})
   Import order:
   @import "./tokens.css";
   @import "./tailwind.theme.css";

   Utilities are prefixed with ds- so they do not overwrite token variables:
   bg-ds-canvas, text-ds-fg, border-ds-line, font-ds-heading,
   rounded-ds-control, shadow-ds-raised, text-ds-body, p-ds-container.
*/

@theme inline {
  --color-ds-canvas: var(--bg-canvas);
  --color-ds-surface: var(--bg-surface);
  --color-ds-surface-alt: var(--bg-surface-alt);
  --color-ds-fg: var(--fg-primary);
  --color-ds-muted: var(--fg-muted);
  --color-ds-line: var(--border-default);
  --color-ds-action: var(--action-primary);
  --color-ds-action-hover: var(--action-primary-hover);
  --color-ds-on-action: var(--action-primary-fg);
  --color-ds-accent: var(--action-accent);
  --color-ds-success: var(--state-success);
  --color-ds-warning: var(--state-warning);
  --color-ds-danger: var(--state-danger);
  --font-ds-body: var(--font-body);
  --font-ds-heading: var(--font-heading);
  --font-ds-code: var(--font-code);
  --radius-ds-control: var(--radius-control);
  --radius-ds-surface: var(--radius-surface);
  --radius-ds-pill: var(--radius-pill);
  --shadow-ds-subtle: var(--shadow-subtle);
  --shadow-ds-raised: var(--shadow-raised);
  --shadow-ds-overlay: var(--shadow-overlay);
  --text-ds-caption: var(--text-caption);
  --text-ds-body: var(--text-body);
  --text-ds-title: var(--text-title);
  --text-ds-display: var(--text-display);
  --spacing-ds-inline: var(--space-inline);
  --spacing-ds-stack: var(--space-stack);
  --spacing-ds-container: var(--space-container);
}
`;
}
