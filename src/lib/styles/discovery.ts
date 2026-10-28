import type { StyleSeed } from "./types";
import { findStyleByUpstreamId } from "@/lib/styles/promax/recommend";

// Product scenarios are editorial suitability tags, independent from design families.
export const INDUSTRIES = [
  ["saas", "SaaS"], ["education", "教育"], ["pets", "宠物服务"], ["ai", "AI / 聊天助手"],
  ["ecommerce", "电商"], ["finance", "金融 / 加密资产"], ["healthcare", "医疗健康"], ["creative", "创意设计"],
  ["real-estate", "房地产"], ["gaming", "游戏"], ["food", "餐饮"], ["fitness", "运动健身"],
  ["travel", "旅行"], ["web3", "NFT / Web3"], ["beauty", "美容 / SPA"], ["developer", "开发者工具"],
  ["entertainment", "娱乐"], ["legal", "法律服务"], ["events", "活动"], ["other", "其他"],
] as const;
export type Industry = typeof INDUSTRIES[number][0];
export type Appearance = "light" | "dark";

const scenarioStyles: Record<Industry, string[]> = {
  saas: ["shigan-b", "ant-design", "ibm-carbon", "fluent-2", "minimalism", "bento", "vercel-geist"],
  education: ["flat-design", "claymorphism", "hand-drawn", "material-3", "apple-hig"],
  pets: ["claymorphism", "hand-drawn", "flat-design"],
  ai: ["vercel-geist", "minimalism", "bento", "aurora", "fluent-2"],
  ecommerce: ["flat-design", "minimalism", "apple-hig", "weui", "magazine"],
  finance: ["ibm-carbon", "ant-design", "minimalism", "swiss-style"],
  healthcare: ["minimalism", "flat-design", "apple-hig", "material-3"],
  creative: ["bauhaus", "memphis", "pop-art", "art-deco", "art-nouveau", "constructivism", "de-stijl", "brutalism", "neubrutalism", "magazine", "swiss-style"],
  "real-estate": ["minimalism", "art-deco", "magazine", "bento"],
  gaming: ["pixel-retro", "cyberpunk", "y2k", "vaporwave", "maximalism"],
  food: ["hand-drawn", "flat-design", "magazine", "art-nouveau"],
  fitness: ["flat-design", "material-3", "neubrutalism", "bento"],
  travel: ["magazine", "bento", "flat-design", "apple-hig"],
  web3: ["cyberpunk", "glassmorphism", "aurora", "y2k"],
  beauty: ["minimalism", "art-nouveau", "neumorphism", "claymorphism"],
  developer: ["vercel-geist", "ibm-carbon", "dracula", "catppuccin", "tokyo-night", "nord", "solarized", "gruvbox", "brutalism"],
  entertainment: ["pop-art", "memphis", "maximalism", "vaporwave", "y2k", "glassmorphism"],
  legal: ["minimalism", "swiss-style", "newspaper", "ibm-carbon"],
  events: ["memphis", "pop-art", "neubrutalism", "magazine", "maximalism"],
  other: ["skeuomorphism", "harmonyos", "shigan-b", "apple-hig", "fluent-2"],
};

const INDUSTRY_NEEDLES: Record<Industry, string[]> = {
  saas: ["saas", "b2b", "dashboard", "enterprise", "subscription"],
  education: ["education", "learning", "course", "school", "edtech"],
  pets: ["pet", "animal", "veterinary"],
  ai: ["ai", "chat", "assistant", "llm", "agent"],
  ecommerce: ["e-commerce", "ecommerce", "shop", "retail", "store"],
  finance: ["finance", "fintech", "bank", "trading", "crypto", "payment"],
  healthcare: ["health", "medical", "clinic", "care", "wellness"],
  creative: ["creative", "agency", "portfolio", "design", "art"],
  "real-estate": ["real estate", "property", "housing"],
  gaming: ["game", "gaming", "esport"],
  food: ["food", "restaurant", "cafe", "delivery"],
  fitness: ["fitness", "gym", "sport", "workout"],
  travel: ["travel", "hotel", "booking", "tourism"],
  web3: ["nft", "web3", "blockchain", "crypto"],
  beauty: ["beauty", "spa", "cosmetic", "fashion"],
  developer: ["developer", "devtool", "ide", "api", "docs"],
  entertainment: ["entertainment", "media", "music", "video", "streaming"],
  legal: ["legal", "law", "compliance"],
  events: ["event", "conference", "ticket"],
  other: [],
};

function promaxIndustries(id: string): Industry[] {
  const entry = findStyleByUpstreamId(id);
  if (!entry) return ["other"];
  const hay = `${entry.bestFor} ${entry.keywords} ${entry.nameEn}`.toLowerCase();
  const hits = INDUSTRIES.map(([key]) => key).filter((key) =>
    INDUSTRY_NEEDLES[key].some((needle) => hay.includes(needle)),
  );
  return hits.length ? hits : ["other"];
}

export function industriesForStyle(id: string): Industry[] {
  const manual = INDUSTRIES.map(([key]) => key).filter((key) => scenarioStyles[key].includes(id));
  if (manual.length) return manual;
  if (id.startsWith("pm-")) return promaxIndustries(id);
  return ["other"];
}

// Appearance labels describe the supplied preview, not theoretical support for both modes.
const DARK_PREVIEWS = new Set([
  "glassmorphism",
  "art-deco",
  "cyberpunk",
  "vaporwave",
  "pixel-retro",
  "maximalism",
  "dracula",
  "catppuccin",
  "tokyo-night",
  "nord",
  "gruvbox",
]);

export function previewAppearance(seed: StyleSeed): Appearance {
  if (DARK_PREVIEWS.has(seed.id) || seed.tags.includes("深色")) return "dark";
  return "light";
}
