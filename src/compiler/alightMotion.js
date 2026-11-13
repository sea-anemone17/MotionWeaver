// XML output modeled on the user's verified importable Alight Motion scene.
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const kf=(t,v,e='')=>'<kf t="'+t.toFixed(6)+'" v="'+v+'"'+(e?' e="'+e+'"':'')+' />';
export function compileAlightMotion(layout,{text,stagger=.16,duration=3.2}){
 const ms=Math.round(duration*1000),ease='cubicBezier 0.25 0.0 0.25 1.0';
 const nodes=layout.glyphs.map(g=>{
  const start=Math.round(g.index*stagger*1000),active=ms-start;
  if(active<=0)throw Error('등장 간격이 전체 길이보다 깁니다.');
  // Existing working XML uses normalized keyframe times, not absolute seconds.
  const pop=Math.min(.54,active/1000*.65),settle=Math.min(.85,active/1000*.95);
  const scale=kf(0,'0.030000,0.030000')+kf(pop,'1.240000,1.240000',ease)+kf(settle,'1.000000,1.000000',ease);
  const x=g.x.toFixed(6);
  // Tight per-character text box, rather than the previous fixed 630px box.
  const wrap=Math.max(24,Math.ceil(g.width*1.12));
  return '<text id="'+(100+g.index)+'" startTime="'+start+'" endTime="'+ms+'" fillType="color" mediaFillMode="fill" size="'+layout.fontSize.toFixed(6)+'" font="googlefonts?name=Source Sans Pro&amp;weight=900" wrapWidth="'+wrap+'" align="center"><transform><location>'+kf(0,x+',1080.000000,0.000000')+'</location><scale>'+scale+'</scale></transform><effect id="com.alightcreative.effects.motionblur4" locallyApplied="true"><property name="tune" type="float" value="1.000000" /><property name="usePos" type="bool" value="true" /><property name="useScale" type="bool" value="true" /><property name="useAngle" type="bool" value="true" /></effect><content>'+escape(g.char)+'</content></text>';
 }).join('\n');
 return '<?xml version="1.0" encoding="UTF-8"?>\n<scene title="MotionWeaver '+escape(text)+'" width="3840" height="2160" exportWidth="3840" exportHeight="2160" precompose="dynamicResolution" bgcolor="#ff000000" totalTime="'+ms+'" fps="30" amver="1028425" ffver="106" am="com.alightcreative.motion/5.0.273.1028425" amplatform="android" retime="freeze" retimeAdaptFPS="false">\n'+nodes+'\n</scene>';
}
