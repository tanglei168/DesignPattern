import assert from 'node:assert/strict';
import test from 'node:test';
import { STYLES, getStyle, filterStyles } from '@/lib/styles/index';
import { buildTokens, resolvedValue } from '@/lib/styles/tokens';
import { toDtcg } from '@/lib/export/toDtcg';
import { toCss } from '@/lib/export/toCss';
import { renderExport, EXPORT_FILES } from '@/lib/export/files';
import { contrastRatio, opaqueColor } from '@/lib/color';
import { shiganSource, sourceValue } from '@/lib/styles/shigan';
import { effectStyles } from '@/lib/styles/effects';
import { dtcgDimension, parseShadow } from '@/lib/export/format';
const flatten = (obj, path=[], out=new Map())=> {
  for(const [key,value] of Object.entries(obj)) {
    if(key.startsWith('$')) continue;
    if(value && typeof value==='object') {
      if('$value' in value) out.set([...path,key].join('.'),value);
      else flatten(value,[...path,key],out);
    }
  }
  return out;
};
const valueOf = (seed,variable)=> {const t=buildTokens(seed);return resolvedValue(t.all.find(v=>v.cssVar===variable),t.vars);};
function validate(type,value) {
  if(type==='color') {assert.equal(value.colorSpace,'srgb');assert.equal(value.components.length,3);assert(value.components.every(v=>v>=0&&v<=1));assert(value.alpha>=0&&value.alpha<=1);}
  else if(type==='dimension'||type==='duration') {assert(Number.isFinite(value.value));assert((type==='dimension'?['px','rem']:['ms','s']).includes(value.unit));}
  else if(type==='fontFamily') {assert(Array.isArray(value));assert(value.every(v=>typeof v==='string'&&!v.includes('var(')));}
  else if(type==='shadow') for(const layer of Array.isArray(value)?value:[value]) {validate('color',layer.color);for(const p of ['offsetX','offsetY','blur','spread'])validate('dimension',layer[p]);}
  else if(type==='cubicBezier') {assert.equal(value.length,4);assert(value.every(Number.isFinite));assert(value[0]>=0&&value[0]<=1&&value[2]>=0&&value[2]<=1);}
  else assert(Number.isFinite(value));
}
for (const seed of STYLES) test(`${seed.id}: token references, DTCG values, exports`,()=>{
  const t=buildTokens(seed), doc=JSON.parse(toDtcg(seed)), leaves=flatten(doc), css=toCss(seed);
  assert.equal(new Set(t.all.map(v=>v.cssVar)).size,t.all.length);
  assert.equal(new Set(t.all.map(v=>v.path.join('.'))).size,t.all.length);
  assert.equal(leaves.size,t.all.length);
  for(const token of t.all) {
    assert(css.includes(`${token.cssVar}: ${token.value};`));
    const leaf=leaves.get(token.path.join('.'));
    if(token.alias) {const target=leaves.get(token.alias.slice(1,-1));assert(target,token.alias);assert.equal(target.$type,token.type);}
    else validate(leaf.$type,leaf.$value);
    assert(!/^var\(/.test(resolvedValue(token,t.vars)) || token.type==='fontFamily');
  }
  for(const f of EXPORT_FILES) assert(renderExport(seed,f.file)?.content.length>100);
  assert.equal(renderExport(seed,'../../secret'),null);
  const e=effectStyles(seed);assert(css.includes(e.backgroundImage));assert(css.includes(e.backgroundSize));
  const secondary=valueOf(seed,'--button-secondary-bg');
  assert(contrastRatio(valueOf(seed,'--button-secondary-fg'),opaqueColor(secondary,seed.colors.background))>=4.5);
});
test('attachment mapping and provenance',()=>{
  const s=getStyle('shigan-b');
  for(const [token,path] of Object.entries({'--button-bg':'semantic.brand.primary','--button-fg':'semantic.brand.on-primary','--nav-bg':'component.nav.top-bg','--size-control':'component.button.height-b','--sg-table-row':'component.table.row-height-b','--sg-online':'semantic.status.online','--sg-risk-high':'semantic.risk.high','--button-radius':'component.button.radius','--badge-radius':'component.tag.radius'})) assert.equal(valueOf(s,token),sourceValue(path));
  for(const [path] of flatten(shiganSource)) assert(sourceValue(path));
  assert.deepEqual(JSON.parse(toDtcg(s)).$extensions['com.design-style-gallery'].sourceTokens,shiganSource);
  assert(toCss(s).includes('--size-control-base: 44px'));
  assert.equal(filterStyles(STYLES,{q:'实干家'})[0].id,'shigan-b');
});
test('regressions: shadows, dimensions, contrast, platform sizing',()=>{
  assert.equal(contrastRatio('#000','#fff'),21);
  assert.equal(contrastRatio('#111','#111'),1);
  assert.deepEqual(dtcgDimension('2px'),{value:2,unit:'px'});
  assert.deepEqual(dtcgDimension('-0.02em',20),{value:-0.4,unit:'px'});
  assert.throws(()=>parseShadow('unsupported'));
  assert.equal(valueOf(getStyle('material-3'),'--size-control'),'48px');
  assert.equal(valueOf(getStyle('ibm-carbon'),'--size-control'),'32px');
  assert.equal(STYLES.length,41);
});
