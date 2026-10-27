import type { StyleSeed } from "@/lib/styles/types";
/** Shared by the live scope and CSS export; decorative effects are CSS extensions. */
export function effectStyles(seed: StyleSeed) {
  const layers: string[] = [];
  if (seed.effects?.noise) layers.push('radial-gradient(rgba(127, 127, 127, 0.28) 0.6px, transparent 0.7px)');
  if (seed.effects?.backgroundImage) layers.push(seed.effects.backgroundImage);
  return {
    backgroundImage: layers.length ? layers.join(', ') : 'none',
    backgroundSize: seed.effects?.noise ? (seed.effects.backgroundImage ? '3px 3px, auto' : '3px 3px') : 'auto',
  };
}
