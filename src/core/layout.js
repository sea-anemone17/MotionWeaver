// MotionWeaver Layout Engine v2.1 — deterministic geometry across devices.
// Do not use Canvas.measureText: Arial and font fallback differ between OS/browser installations.
// Advance ratios are intentionally approximate; XML and preview use the SAME computed x values.
export const DEFAULT_CALIBRATION={widthFactor:2.3,spacingMultiplier:1.25,anchorOffset:0};
const LATIN_WIDE=new Set(Array.from('MW@%&QOGD'));
const LATIN_NARROW=new Set(Array.from('ilI!|.,:;\'\u0060'));
const LATIN_MEDIUM=new Set(Array.from('fjrt()[]{}'));
const CJK=/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff01-\uff60]/u;
function advanceEm(ch){
 if(ch===' ')return .36;
 if(CJK.test(ch))return 1.0;
 if(LATIN_NARROW.has(ch))return .30;
 if(LATIN_MEDIUM.has(ch))return .43;
 if(LATIN_WIDE.has(ch))return .92;
 if(/[A-Z]/u.test(ch))return .73;
 if(/[0-9]/u.test(ch))return .58;
 if(/[a-z]/u.test(ch))return .55;
 if(/[!?.,:;(){}\[\]]/u.test(ch))return .35;
 return .75;
}
const finiteOr=(value,fallback)=>{const n=Number(value);return Number.isFinite(n)?n:fallback};
export function computeLayout({text,fontSize=210,gap=35,widthFactor=2.3,spacingMultiplier=1.25,anchorOffset=0}){
 if(typeof text!=='string'||!text.trim())throw Error('텍스트를 입력해 주세요.');
 const chars=Array.from(text),W=3840,limit=W*.88;
 const safeSize=Math.max(20,Math.min(500,finiteOr(fontSize,210)));
 const safeGap=Math.max(0,Math.min(500,finiteOr(gap,35)));
 const safeFactor=Math.max(1,Math.min(4,finiteOr(widthFactor,2.3)));
 const safeSpacing=Math.max(1,Math.min(3,finiteOr(spacingMultiplier,1.25)));
 const safeOffset=Math.max(-1000,Math.min(1000,finiteOr(anchorOffset,0)));
 const ratios=chars.map(ch=>advanceEm(ch)*safeFactor);
 const baseWidth=ratios.reduce((a,b)=>a+b,0)*safeSize;
 const baseSpacing=safeGap*safeSpacing;
 const initialTotal=baseWidth+baseSpacing*Math.max(0,chars.length-1);
 const scale=Math.min(1,limit/initialTotal);
 const size=safeSize*scale,spacing=baseSpacing*scale,widths=ratios.map(r=>r*size);
 const total=widths.reduce((a,b)=>a+b,0)+spacing*Math.max(0,chars.length-1);
 let cursor=(W-total)/2;
 const glyphs=chars.map((char,index)=>{
  const width=widths[index],x=cursor+width/2+safeOffset;
  cursor+=width+spacing;
  return {char,index,x,width};
 }).filter(g=>g.char!==' ');
 return {glyphs,totalWidth:total,fontSize:size,spacing,widthFactor:safeFactor,spacingMultiplier:safeSpacing,anchorOffset:safeOffset,autoScaled:scale<1};
}
