import type { CategoryId } from "@/lib/styles/types";

export type Category = {
  id: CategoryId;
  name: string;
  nameEn: string;
  description: string;
  icon: "layers" | "palette" | "brush" | "history" | "swatch";
};

export const CATEGORIES: Category[] = [
  { id: "product", name: "产品设计风格", nameEn: "Product Design", description: "围绕业务场景定义布局、信息密度、组件与视觉规范。", icon: "layers" },
  {
    id: "platform",
    name: "平台设计系统",
    nameEn: "Platform Systems",
    description: "操作系统与产品团队的成套界面规则，适合作为产品的默认语言。",
    icon: "layers",
  },
  {
    id: "visual",
    name: "视觉风格",
    nameEn: "Visual Styles",
    description: "由光影、材质、圆角和装饰密度决定的界面气质。",
    icon: "palette",
  },
  {
    id: "art",
    name: "艺术流派",
    nameEn: "Art Movements",
    description: "把平面设计史里的网格、几何和色彩纪律翻译成可落地的 UI。",
    icon: "brush",
  },
  {
    id: "era",
    name: "时代潮流",
    nameEn: "Era Trends",
    description: "带有明确年代记忆的排版、像素、霓虹与装饰密度。",
    icon: "history",
  },
  {
    id: "theme",
    name: "主题配色",
    nameEn: "Color Themes",
    description: "从编辑器主题长出来的调色板，适合开发者工具和深色界面。",
    icon: "swatch",
  },
];

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Unknown category: ${id}`);
  }
  return category;
}

