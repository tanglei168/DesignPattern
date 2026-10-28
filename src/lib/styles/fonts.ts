export const FONTS = {
  system:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Noto Sans SC", "Inter", sans-serif',
  inter: '"Inter", "Noto Sans SC", system-ui, sans-serif',
  grotesk: '"Space Grotesk", "Noto Sans SC", system-ui, sans-serif',
  playfair: '"Playfair Display", "Noto Serif SC", Georgia, serif',
  dmSerif: '"DM Serif Display", "Noto Serif SC", Georgia, serif',
  plex: '"IBM Plex Sans", "Noto Sans SC", system-ui, sans-serif',
  plexMono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace',
  jetbrains: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
  roboto: '"Roboto", "Noto Sans SC", system-ui, sans-serif',
  poppins: '"Poppins", "Noto Sans SC", system-ui, sans-serif',
  caveat: '"Caveat", "Noto Sans SC", cursive',
  pixel: '"Press Start 2P", "Noto Sans SC", ui-monospace, monospace',
  orbitron: '"Orbitron", "Noto Sans SC", sans-serif',
  archivo: '"Archivo Black", "Noto Sans SC", sans-serif',
  bebas: '"Bebas Neue", "Noto Sans SC", sans-serif',
  serifSc: '"Noto Serif SC", "Playfair Display", Georgia, serif',
  sansSc: '"Noto Sans SC", "Inter", system-ui, sans-serif',
  geist: 'var(--font-geist-sans, "Geist"), "Inter", "Noto Sans SC", system-ui, sans-serif',
  geistMono: 'var(--font-geist-mono, "Geist Mono"), "JetBrains Mono", ui-monospace, monospace',
} as const;

export const MOTION = {
  standard: {
    durationFast: "120ms",
    durationBase: "200ms",
    easing: "cubic-bezier(0.2, 0, 0, 1)",
  },
  swift: {
    durationFast: "90ms",
    durationBase: "160ms",
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  },
  soft: {
    durationFast: "180ms",
    durationBase: "320ms",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  snap: {
    durationFast: "100ms",
    durationBase: "180ms",
    easing: "cubic-bezier(0.34, 1.25, 0.64, 1)",
  },
  linear: {
    durationFast: "0ms",
    durationBase: "80ms",
    easing: "cubic-bezier(0, 0, 1, 1)",
  },
} as const;

