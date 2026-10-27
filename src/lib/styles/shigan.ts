import source from "@/lib/styles/sources/shigan.tokens.json";
import type { DesignToken } from "@/lib/styles/types";
export const shiganSource = source;
type SourceNode = { $value?: unknown; $type?: string; $description?: string; [key: string]: unknown };
const root = source as SourceNode;
export function sourceValue(path: string, seen = new Set<string>()): string {
  if (seen.has(path)) throw new Error(`Circular source token: ${path}`);
  seen.add(path);
  const node = path.split('.').reduce<unknown>((n, key) => (n as SourceNode)?.[key], root) as SourceNode;
  if (!node || node.$value === undefined) throw new Error(`Missing source token: ${path}`);
  const value = node.$value;
  if (typeof value === 'string') {
    const ref = value.match(/^\{(.+)\}$/);
    return ref ? sourceValue(ref[1], seen) : value;
  }
  if (typeof value === 'object' && value && 'value' in value && 'unit' in value) return `${value.value}${value.unit}`;
  throw new Error(`Unsupported source value: ${path}`);
}
type Draft = Pick<DesignToken, 'cssVar' | 'value' | 'type' | 'description' | 'cssProperty' | 'tier' | 'group' | 'path' | 'ref'>;
export function applyShigan(drafts: Draft[]) {
  // Preserve the attachment unchanged; map only explicitly named values into the gallery schema.
  const bind = (cssVar: string, sourcePath: string) => {
    const token = drafts.find(t => t.cssVar === cssVar);
    if (!token || token.tier !== 'primitive') throw new Error(`Not a primitive: ${cssVar}`);
    token.value = sourceValue(sourcePath);
    token.description = `附件 ${sourcePath}；保留来源状态，见 DTCG 扩展中的 sourceTokens。`;
  };
  const bindings: Record<string,string> = {
    '--size-xs':'font.size.xs','--size-sm':'font.size.sm','--size-base':'font.size.md',
    '--size-lg':'font.size.lg','--size-xl':'font.size.xl','--size-2xl':'font.size.2xl','--size-3xl':'font.size.3xl',
    '--size-control-base':'component.button.height-b', '--radius-sm':'radius.xs',
    '--radius-md':'radius.sm','--radius-lg':'radius.md','--radius-full':'radius.full',
    '--color-disabled':'color.neutral.200','--color-disabled-foreground':'color.neutral.500',
  };
  Object.entries(bindings).forEach(([variable,path])=>bind(variable,path));
  for (const step of [1,2,3,4,6,8]) bind(`--space-${step}`,`space.${step}`);
  for (const step of [12,16]) drafts.find(t=>t.cssVar===`--space-${step}`)!.value = `${step*4}px`;
  const add = (slug: string, path: string, type: 'color'|'dimension' = 'color') => {
    const value = sourceValue(path);
    drafts.push({cssVar:`--shigan-${slug}`,value,type,description:`附件 ${path}`,cssProperty:type==='color'?'color':'height',tier:'primitive',group:'实干家来源映射',path:['source','primitive',slug]});
    drafts.push({cssVar:`--sg-${slug}`,value:'',ref:`--shigan-${slug}`,type,description:`实干家 ${path}`,cssProperty:type==='color'?'color':'height',tier:'semantic',group:'实干家业务语义',path:['source','semantic',slug]});
  };
  const extra: Record<string,string> = {
    inverse:'semantic.bg.inverse', 'on-dark':'semantic.text.on-dark', 'on-dark-secondary':'semantic.text.on-dark-secondary',
    'nav-hover':'semantic.bg.inverse-hover','nav-selected':'semantic.bg.inverse-selected',
    online:'semantic.status.online',offline:'semantic.status.offline',
    'risk-high':'semantic.risk.high','risk-medium':'semantic.risk.medium','risk-low':'semantic.risk.low',
    'risk-low-on-dark':'semantic.risk.low-on-dark','danger-on-dark':'semantic.status.danger-on-dark',
    link:'semantic.text.link', dashboard:'semantic.bg.dashboard','mobile-page':'color.neutral.150',
    'tab-icon':'component.tabbar.inactive','chart-work':'semantic.dataviz.1','chart-idle':'semantic.dataviz.1-subtle',
  };
  Object.entries(extra).forEach(([slug,path])=>add(slug,path));
  add('table-row','component.table.row-height-b','dimension');
  const refs: Record<string,string> = {
    '--nav-bg':'--sg-inverse','--nav-fg':'--sg-on-dark','--nav-muted':'--sg-on-dark-secondary',
    '--tabbar-bg':'--sg-inverse','--tabbar-fg':'--sg-on-dark-secondary',
    '--nav-border':'--sg-nav-selected','--tabbar-border':'--sg-nav-selected',
    '--badge-radius':'--radius-tight','--input-focus':'--sg-link',
  };
  for (const [variable, ref] of Object.entries(refs)) drafts.find(t=>t.cssVar===variable)!.ref=ref;
}
