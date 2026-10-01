const $=id=>document.getElementById(id);
const pad=n=>String(n).padStart(2,"0");
const fmt=cs=>{cs=Math.max(0,Math.round(cs));const m=Math.floor(cs/6000),s=Math.floor(cs/100)%60;return pad(m)+":"+pad(s)+":"+pad(cs%100)};
let blind=false,running=false,t0=0,raf=0,tries=[];
const clamp=(el,max)=>{let v=parseInt(el.value,10);if(isNaN(v)||v<0)v=0;if(v>max)v=max;el.value=v;return v};
function target(){return clamp($("tm"),59)*6000+clamp($("ts"),59)*100+clamp($("tc"),99)}
function showTarget(){$("sub").textContent="Meta: "+fmt(target())}
["tm","ts","tc"].forEach(i=>$(i).addEventListener("input",()=>{if(!running)showTarget()}));
function setMode(b){if(running)return;blind=b;$("mV").setAttribute("aria-pressed",!b);$("mB").setAttribute("aria-pressed",b)}
$("mV").onclick=()=>setMode(false);$("mB").onclick=()=>setMode(true);
function tick(){const cs=(performance.now()-t0)/10;
$("time").textContent=blind?"??:??:??":fmt(Math.min(cs,359999));
if(cs>=359999)stop();else raf=requestAnimationFrame(tick)}
function start(){const tg=target();if(tg===0){$("res").textContent="Defina uma meta maior que zero.";return}
running=true;$("go").textContent="Parar";$("go").classList.add("run");
$("time").classList.toggle("blind",blind);$("res").textContent=blind?"Cronometrando às cegas…":"Cronometrando…";
["tm","ts","tc"].forEach(i=>$(i).disabled=true);t0=performance.now();raf=requestAnimationFrame(tick)}
function stop(){cancelAnimationFrame(raf);const cs=Math.min(Math.floor((performance.now()-t0)/10),359999),tg=target();
running=false;$("go").textContent="Começar";$("go").classList.remove("run");
$("time").classList.remove("blind");$("time").textContent=fmt(cs);
["tm","ts","tc"].forEach(i=>$(i).disabled=false);
const d=cs-tg,ad=Math.abs(d);
const msg=ad===0?"Perfeito! Tempo exato! 🎯":(d>0?"Passou ":"Faltou ")+"<b>"+fmt(ad)+"</b>";
$("res").innerHTML="Você fez <b>"+fmt(cs)+"</b> · meta <b>"+fmt(tg)+"</b><br>"+msg;
tries.unshift((blind?"🙈 ":"👁 ")+fmt(cs)+" ("+(d>0?"+":d<0?"−":"±")+fmt(ad)+")");
$("hist").textContent="Últimas: "+tries.slice(0,3).join("   ")}
$("go").onclick=()=>running?stop():start();
document.addEventListener("keydown",e=>{if(e.code==="Space"&&!/INPUT/.test(document.activeElement.tagName)){e.preventDefault();$("go").click()}});
showTarget();
