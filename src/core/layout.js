// MotionWeaver Layout Engine v2
// Canvas metrics are only a proxy for Alight Motion glyph dimensions.
export const DEFAULT_CALIBRATION={widthFactor:2.3,spacingMultiplier:1.25,anchorOffset:0};
export function computeLayout({text,fontSize=210,gap=35,widthFactor=2.3,spacingMultiplier=1.25,anchorOffset=0}){
 if(typeof text!=='string'||!text.trim())throw Error('텍스트를 입력해 주세요.');
 const chars=Array.from(text),W=3840,limit=W*.88;
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
 if(!ctx)throw Error('Canvas 글자 측정 불가');
 const safeSize=Math.max(20,Math.min(500,Number(fontSize)||210));
 const safeGap=Math.max(0,Math.min(500,Number(gap)||0));
 const safeFactor=Math.max(1,Math.min(4,Number(widthFactor)||2.3));
 const safeSpacing=Math.max(1,Math.min(3,Number(spacingMultiplier)||1.25));
 const safeOffset=Math.max(-1000,Math.min(1000,Number(anchorOffset)||0));
 // Character-specific advance: Latin narrow/wide, Hangul, kana, and spaces are measured separately.
 const widthsAt=size=>{
  ctx.font='900 '+size+'px Arial';
  return chars.map(ch=>{
   if(ch===' ')return size*.36*safeFactor;
   const measured=ctx.measureText(ch).width;
   const floor=/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\u3040-\u30ff\u3400-\u9fff]/u.test(ch)?size*.95:size*.24;
   return Math.max(floor,measured)*safeFactor;
  });
 };
 // Spacing multiplier affects inter-character spacing only, never font size.
 const gapAt=()=>safeGap*safeSpacing;
 const measureTotal=(widths,spacing)=>widths.reduce((a,b)=>a+b,0)+spacing*Math.max(0,chars.length-1);
 let size=safeSize,spacing=gapAt(),widths=widthsAt(size),total=measureTotal(widths,spacing);
 let autoScaled=false;
 if(total>limit){
  // Scale only when the complete run cannot fit; preserve ratio between glyph advances and gaps.
  const ratio=limit/total;size*=ratio;spacing*=ratio;widths=widthsAt(size);total=measureTotal(widths,spacing);autoScaled=true;
 }
 let cursor=(W-total)/2;
 const glyphs=chars.map((char,index)=>{
  const width=widths[index],x=cursor+width/2+safeOffset;
  cursor+=width+spacing;
  return {char,index,x,width};
 }).filter(g=>g.char!==' ');
 return {glyphs,totalWidth:total,fontSize:size,spacing,widthFactor:safeFactor,spacingMultiplier:safeSpacing,anchorOffset:safeOffset,autoScaled};
}
