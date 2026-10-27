import { FONTS, MOTION } from "@/lib/styles/fonts";
import { sourceValue as v } from "@/lib/styles/shigan";
import type { StyleSeed } from "@/lib/styles/types";
export const shiganSeed: StyleSeed = {
  id: 'shigan-b', name: '实干家 B 端', nameEn: 'Shigan Enterprise', category: 'theme',
  platforms: ['web','mobile'], tags: ['企业','中后台','品牌黄','深色导航'],
  summary: '基于用户提供的 2026-10-27 tokens.json 初稿：品牌黄、深灰紫导航、浅灰画布和紧凑数据界面。附件中的实测为来源声明，尚未用原始截图独立复测；推导和待确认项保留。',
  keywords: ['实干家','shigan','工业','风险','设备','在线'],
  principles: ['深色导航承载黄色选中态，内容用白色表面。','在线用黄，高/中/低风险用红/黄/灰，语义必须配文字与不同图标。','原始附件保留在导出 JSON 扩展中，画廊适配不覆盖来源。','字体为截图推断待确认；动效、字重、阴影及超出附件的尺寸为画廊补全。'],
  dos: ['黄底按钮使用黑字。','桌面按钮 32px、表格行 44px；移动端独立扩大触控目标到至少 44px。','导航使用 #393847，选中项使用黄色文字和指示条。','高风险配圆形感叹号，中风险配三角警示，低风险配信息图标；在线配圆点和文字。'],
  donts: ['不要将在线状态改成绿色。','不要把黄色用作白底的小字号文字。','不要把深色导航称为完整深色模式。','不要把推导尺寸和字体写成已经复测的事实。'],
  useCases: ['设备运营后台','风险监控','配套小程序'],
  platformNotes: {web:'桌面按钮 32px、表格行 44px，4px 间距基线；侧栏深灰紫，黄色选中指示条。',mobile:'页面底 #F2F4FA，导航和 tab bar 深灰紫；触控区域至少 44px。未选中图标可用 #888891，标签文字使用更高对比的 #B0AFB8。'},
  colors: {background:v('semantic.bg.page'),surface:v('semantic.bg.surface'),surfaceAlt:v('semantic.bg.surface-subtle'),foreground:v('semantic.text.primary'),muted:v('semantic.text.secondary'),border:v('semantic.border.default'),primary:v('semantic.brand.primary'),primaryForeground:v('semantic.brand.on-primary'),secondary:v('semantic.bg.surface'),accent:v('semantic.brand.primary-subtle'),success:v('semantic.status.success'),warning:v('semantic.risk.medium'),danger:v('semantic.risk.high')},
  typography: {sans:'"PingFang SC", "Noto Sans SC", system-ui, sans-serif',display:'"PingFang SC", "Noto Sans SC", system-ui, sans-serif',mono:FONTS.jetbrains,baseSize:14,scaleRatio:1.2,headingWeight:600,bodyWeight:400,letterSpacing:'0px'},
  shape:{radiusSm:'2px',radiusMd:'4px',radiusLg:'8px',radiusFull:'9999px',borderWidth:'1px'},
  elevation:{shadowSm:'none',shadowMd:'none',shadowLg:'none'}, motion:MOTION.standard,density:'compact',
};
