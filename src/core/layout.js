// MotionWeaver Layout v1 — conservative collision-safe cell placement.
// Canvas text measurement is intentionally NOT treated as Alight Motion's actual glyph bounds.
export function computeLayout({text,fontSize=210,gap=35,widthFactor=1.55,anchorOffset=0}){
  if(!text || !text.trim()) throw Error('텍스트를 입력해 주세요.');
  const chars=Array.from(text),W=3840,limit=W*.88;
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx) throw Error('Canvas 글자 측정 불가');
  const measure=(size)=>{ctx.font='900 '+size+'px Arial';return chars.map(ch=>ch===' '?size*.36:Math.max(size*.24,ctx.measureText(ch).width)*widthFactor)};
  // Uniformly shrink both glyph size and spacing to keep the entire run on screen.
  let size=fontSize,spacing=gap,widths=measure(size);
  let total=widths.reduce((a,b)=>a+b,0)+spacing*(chars.length-1);
  if(total>limit){const ratio=limit/total;size*=ratio;spacing*=ratio;widths=measure(size);total=widths.reduce((a,b)=>a+b,0)+spacing*(chars.length-1)}
  let cursor=(W-total)/2;
  const glyphs=chars.map((char,index)=>{const w=widths[index],x=cursor+w/2+anchorOffset;cursor+=w+spacing;return {char,index,x,width:w}}).filter(g=>g.char!==' ');
  return {glyphs,totalWidth:total,fontSize:size,spacing,widthFactor,anchorOffset};
}
