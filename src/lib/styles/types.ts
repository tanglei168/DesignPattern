export type Platform = "web" | "mobile";

export type CategoryId = "platform" | "visual" | "art" | "era" | "theme" | "product" | "promax";

export type Density = "compact" | "comfortable" | "spacious";

export type StyleColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  foreground: string;
  muted: string;
  border: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
};

export type StyleSeed = {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  platforms: Platform[];
  tags: string[];
  summary: string;
  keywords: string[];
  principles: string[];
  dos: string[];
  donts: string[];
  useCases: string[];
  platformNotes: { web: string; mobile: string };
  colors: StyleColors;
  typography: {
    sans: string;
    display: string;
    mono: string;
    baseSize: number;
    scaleRatio: number;
    headingWeight: number;
    bodyWeight: number;
    letterSpacing: string;
  };
  shape: {
    radiusSm: string;
    radiusMd: string;
    radiusLg: string;
    radiusFull: string;
    borderWidth: string;
  };
  elevation: {
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
  };
  effects?: {
    backgroundImage?: string;
    backdropBlur?: string;
    surfaceOpacity?: number;
    noise?: boolean;
  };
  motion: {
    durationFast: string;
    durationBase: string;
    easing: string;
  };
  density: Density;
};

export type TokenType =
  | "color"
  | "dimension"
  | "fontFamily"
  | "fontWeight"
  | "shadow"
  | "duration"
  | "cubicBezier"
  | "number";

export type TokenTier = "primitive" | "semantic" | "component";

export type DesignToken = {
  name: string;
  cssVar: string;
  value: string;
  alias?: string;
  ref?: string;
  type: TokenType;
  description: string;
  cssProperty: string;
  tier: TokenTier;
  group: string;
  path: string[];
};

export type TokenSet = {
  primitive: DesignToken[];
  semantic: DesignToken[];
  component: DesignToken[];
  all: DesignToken[];
  vars: Record<string, string>;
};

