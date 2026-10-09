/* SmartBrick · app web (Megalabs). Generado a partir del prototipo. */
(function(){
let D=null, P=null, Z=null, F=null;
function setData(d){ D=d; P=d.productos; Z=d.zonas; F=d.fichas; MI=d.meses; }
const $ = s => document.querySelector(s);
const nf0 = new Intl.NumberFormat('es-UY',{maximumFractionDigits:0});
const nf1 = new Intl.NumberFormat('es-UY',{minimumFractionDigits:1,maximumFractionDigits:1});
const n0 = v => v==null ? '–' : nf0.format(v);
const money = v => v==null ? '–' : '$ ' + nf0.format(v);
const moneyC = v => { if(v==null) return '–'; const a=Math.abs(v); if(a>=1e6) return '$ '+nf1.format(v/1e6)+' M'; if(a>=1e3) return '$ '+nf0.format(v/1e3)+' mil'; return '$ '+nf0.format(v); };
const pct = v => v==null ? '–' : (v>0?'+':'') + nf0.format(v) + '%';
const pp = v => v==null ? '–' : (v>0?'+':'') + nf1.format(v) + ' pp';
const cls = v => v==null ? '' : (v>0 ? 'up' : v<0 ? 'down' : '');
const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MARCA = {'DOLEX':'Dolex','CIRUELAX':'Ciruelax','MEGA OMEGA':'Mega Omega 3','OMEGA 3':'Omega 3','ANTIAX':'Antiax','MICOLIS':'Micolis','WEB-C':'Web-C','PIOSAN':'Piosan','LACRIMAX':'Lacrimax','UMBRELLA':'Umbrella','C-VIT':'C-Vit','ACTIVOX':'Activox','QUELAT':'Quelat','PRO FEMME':'Profemme','ZEROACNE':'Zero Acne'};
const marca = m => MARCA[m] || m;
const TIPO = {INDEPENDIENTE:'Independiente',FARMASHOP:'Farmashop','SAN ROQUE':'San Roque',NATAL:'Natal'};
const zonaCorta = b => { const z=Z[b]; if(!z) return 'Sin brick asignado'; return z.desc.replace(/^Mdeo\.:\s*/,'').replace(/^Canelones:\s*/,'').replace(/\s*\(.*\)$/,'').replace(/\bDe\b/g,'de').replace(/\bY\b/g,'y'); };
const zonaDepto = b => { const z=Z[b]; if(!z) return ''; return /^Mdeo/.test(z.desc)?'Montevideo':/^Canelones/.test(z.desc)?'Canelones':'Treinta y Tres'; };
const MES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const fdate = s => { if(!s) return '–'; const [y,m,d]=s.split('-'); return d+'/'+m+'/'+y; };
const store = { get(k,d){ try{ const v=localStorage.getItem('sb.'+k); return v==null?d:JSON.parse(v);}catch(e){return d;} }, set(k,v){ try{ localStorage.setItem('sb.'+k, JSON.stringify(v)); }catch(e){} } };
const size = f => f.kpi ? (f.kpi.otc_ytd26!=null ? f.kpi.otc_ytd26 : (f.kpi.venta||0)*1.6) : -1;
const topLevel = f => (f.alertas||[]).find(a=>a.nivel!=='positiva') || (f.alertas||[])[0];

let cur=null, curTab='resumen';
function alertsHTML(f){
  const A=f.alertas||[];
  if(!A.length) return '<div class="empty">No hay alertas para este punto de venta.</div>';
  const lbl={alta:'Alta',media:'Media',positiva:'Bien'};
  return '<div class="alerts">'+A.map(a=>`<div class="alert"><span class="pill ${a.nivel}">${lbl[a.nivel]}</span><b>${esc(a.titulo)}</b><p>${esc(a.detalle)} <em>${esc(a.fuente)}</em></p></div>`).join('')+'</div>';
}

function resumen(f){
  if(f.sin_datos){
    return `<div class="empty">Este punto de venta no tiene compras registradas en Venta Real desde enero de 2025${f.tipo==='NATAL'?' (probablemente compra por la central de la cadena)':''}. Igual podés ver cómo se mueve el mercado en su zona.</div>
      <button class="btn sec2" data-goto="zona">Ver la zona</button>`;
  }
  const k=f.kpi;
  if(f.tipo==='INDEPENDIENTE'||f.tipo==='NATAL'){
    return `<div class="kpis">
      <div class="kpi"><span class="l">Compras OTC ene–ago 2026</span><span class="v num">${moneyC(k.otc_ytd26)}</span><span class="s num"><span class="${cls(k.otc_var)}">${pct(k.otc_var)}</span> vs. 2025</span></div>
      <div class="kpi"><span class="l">Último trimestre (jun–ago)</span><span class="v num">${moneyC(k.otc_q26)}</span><span class="s num"><span class="${cls(k.otc_q_var)}">${pct(k.otc_q_var)}</span> vs. 2025</span></div>
      <div class="kpi"><span class="l">Última compra OTC</span><span class="v num">${k.dias_otc==null?'–':k.dias_otc+' días'}</span><span class="s">${fdate(k.ult_otc)}</span></div>
      <div class="kpi"><span class="l">Total Megalabs 2026</span><span class="v num">${moneyC(k.total_ytd26)}</span><span class="s num"><span class="${cls(k.total_var)}">${pct(k.total_var)}</span> · todas las líneas</span></div>
    </div>
    <section class="sec"><div class="sec-h"><h2>Qué mirar antes de entrar</h2></div>${alertsHTML(f)}</section>
    <section class="sec"><div class="sec-h"><h2>Compras OTC por mes</h2><span class="src">Venta Real · $ netos</span></div>
      <div class="legend"><span><i style="background:var(--series-prev)"></i>2025</span><span><i style="background:var(--brand)"></i>2026</span></div>
      <div class="chart" data-chart="otc">${chartMensual(f.mensual)}</div>
      <div class="readout num"></div>
      <span class="small">Septiembre 2026 incluye compras hasta el ${D.corte.venta_real}.</span>
    </section>`;
  }
  return `<div class="kpis">
      <div class="kpi"><span class="l">Unidades vendidas en agosto</span><span class="v num">${n0(k.unid)}</span><span class="s">productos OTC Megalabs</span></div>
      <div class="kpi"><span class="l">Venta agosto (sin IVA)</span><span class="v num">${moneyC(k.venta)}</span><span class="s">sell-out ${TIPO[f.tipo]}</span></div>
      <div class="kpi"><span class="l">Contra la sucursal promedio</span><span class="v num">${k.indice}</span><span class="s">100 = promedio (${n0(k.prom_cadena)} unid.)</span></div>
      <div class="kpi"><span class="l">Puesto en la cadena</span><span class="v num">${k.rank}<span style="font-size:14px;color:var(--muted)"> de ${k.n_suc}</span></span><span class="s">por unidades en agosto</span></div>
    </div>
    <section class="sec"><div class="sec-h"><h2>Qué mirar antes de entrar</h2></div>${alertsHTML(f)}</section>
    <section class="sec"><div class="sec-h"><h2>Ventas por marca en agosto</h2><span class="src">Sell-Out ${TIPO[f.tipo]} · unidades</span></div>${barrasMarca(f.marcas)}</section>`;
}

function barrasMarca(M){
  if(!M||!M.length) return '<div class="empty">Sin ventas de productos OTC Megalabs en agosto.</div>';
  const mx=Math.max(...M.map(m=>m.u));
  return '<div style="display:flex;flex-direction:column;gap:8px">'+M.map(m=>`<div style="display:grid;grid-template-columns:96px minmax(0,1fr) 48px;gap:10px;align-items:center;font-size:13.5px" title="${esc(marca(m.marca))}: ${n0(m.u)} unid.">
    <span style="font-weight:600">${esc(marca(m.marca))}</span><div class="bar" style="height:10px;width:${Math.max(2,m.u/mx*100)}%"></div><span class="num" style="text-align:right;font-weight:700">${n0(m.u)}</span></div>`).join('')+'</div>';
}

function barPath(x,y,w,h){ const r=Math.min(3,h,w/2); return `M${x},${y+h}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y+h}Z`; }
function niceStep(v){ const p=Math.pow(10,Math.floor(Math.log10(v))); const n=v/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p; }
function axisMoney(v){ if(v>=1e6) return nf1.format(v/1e6).replace(/,0$/,'')+' M'; if(v>=1e3) return nf0.format(v/1e3)+' mil'; return nf0.format(v); }
// ---------- Gráfico mensual genérico (2025 vs 2026)
const CHARTS = {};
function chartYoY(map, id, o){
  const W=340,H=170,x0=44,x1=336,y0=14,y1=140;
  const vals=[]; for(let i=1;i<=12;i++){ const mm=String(i).padStart(2,'0'); vals.push([Math.max(0,map['2025-'+mm]||0), i<=9 ? Math.max(0,map['2026-'+mm]||0) : null]); }
  const mx=Math.max(1,...vals.flat().filter(v=>v!=null));
  const step=niceStep(mx/3), top=Math.ceil(mx/step)*step;
  const y=v=>y1-(v/top)*(y1-y0), gw=(x1-x0)/12, bw=Math.min(10,(gw-6)/2);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label)}, 2025 y 2026">`;
  for(let t=0;t<=top+1e-9;t+=step){ s+=`<line x1="${x0}" x2="${x1}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${x0-6}" y="${y(t)+3.5}" text-anchor="end" font-size="9.5" fill="var(--muted)">${o.axis(t)}</text>`; }
  vals.forEach(([a,b],i)=>{
    const cx=x0+gw*i+gw/2;
    s+=`<g data-i="${i}" tabindex="0" role="button" aria-label="${MES[i]}: 2025 ${o.val(a)}${b!=null?', 2026 '+o.val(b):''}">`;
    s+=`<rect x="${x0+gw*i}" y="${y0}" width="${gw}" height="${y1-y0+18}" fill="transparent"/>`;
    if(a>0) s+=`<path d="${barPath(cx-bw-1,y(a),bw,y1-y(a))}" fill="var(--series-prev)"/>`;
    if(b!=null&&b>0) s+=`<path d="${barPath(cx+1,y(b),bw,y1-y(b))}" fill="var(--brand)" ${i===8?'opacity=".55"':''}/>`;
    s+=`<text x="${cx}" y="${y1+14}" text-anchor="middle" font-size="9.5" fill="var(--muted)">${MES[i][0]}${i===8?'*':''}</text></g>`;
  });
  s+=`<line x1="${x0}" x2="${x1}" y1="${y1}" y2="${y1}" stroke="var(--muted)" stroke-width="1"/></svg>`;
  CHARTS[id]={vals,val:o.val}; return s;
}
function chartMensual(M){ const map={}; M.forEach(r=>map[r.m]=r.v); return chartYoY(map,'otc',{label:'Compras OTC por mes',axis:axisMoney,val:money}); }
function bindChart(el){
  const c=CHARTS[el.dataset.chart]; if(!c) return;
  const ro=el.closest('.sec').querySelector('.readout'), vals=c.vals;
  const show=i=>{ const [a,b]=vals[i]; ro.innerHTML=`<b>${MES[i]}</b> · 2025: <b>${c.val(a)}</b>${b!=null?` · 2026: <b>${c.val(b)}</b>`:''}${b!=null&&a>0?` <span class="${cls(b/a-1)}">(${pct((b/a-1)*100)})</span>`:''}`;
    el.querySelectorAll('g[data-i]').forEach(g=>g.style.opacity = +g.dataset.i===i ? 1 : .55); };
  el.addEventListener('click',e=>{ const g=e.target.closest('g[data-i]'); if(g) show(+g.dataset.i); });
  el.addEventListener('mouseover',e=>{ const g=e.target.closest('g[data-i]'); if(g) show(+g.dataset.i); });
  el.addEventListener('keydown',e=>{ const g=e.target.closest('g[data-i]'); if(g&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); show(+g.dataset.i);} });
  show(7);
}

// ---------- Tableros por marca
let MI = null;
let curBrand=null, curCat=null;
const LOW = ['De','Del','Y','Sin','Para','El','La','Los','Las','Con','Contra','En','Solos','Sola','Solo'];
const catName = c => (D.catNames[c]||c).split(' ').map((w,i)=>i>0&&LOW.includes(w)?w.toLowerCase():w).join(' ');
const skusOf = b => Object.keys(P).filter(a=>P[a].m===b);
const shareOf = (row,tot,i) => (row&&tot[i]) ? row.v[i]/tot[i]*100 : null;
const gr = (a,b) => (b>0) ? (a/b-1)*100 : null;
const sumR = (arr,i0,i1) => { let s=0; for(let i=i0;i<=i1;i++) s+=arr[i]||0; return s; };
const esFarmacia = f => f.tipo==='INDEPENDIENTE'||f.tipo==='NATAL';
function brandsFor(f){
  const arr=[];
  (f.marcas||[]).slice().sort((a,b)=>((b.v26!=null?b.v26:b.v)||0)-((a.v26!=null?a.v26:a.v)||0)).forEach(m=>{ if(MARCA[m.marca]&&!arr.includes(m.marca)) arr.push(m.marca); });
  Object.keys(MARCA).forEach(b=>{ if(!arr.includes(b)) arr.push(b); });
  return arr;
}
function brandCtx(f,b){
  const x={b, f, sk:skusOf(b)};
  // farmacia (Venta Real)
  if(esFarmacia(f) && !f.sin_datos){
    const mm=new Array(MI.length).fill(0), mv=new Array(MI.length).fill(0); x.perSku={};
    x.sk.forEach(a=>{ const rows=(f.skum||{})[a]||[]; let u12=0; rows.forEach(([i,uf,u,v])=>{ mm[i]+=u; mv[i]+=v; if(i>=8&&i<=19) u12+=u; }); x.perSku[a]={u12}; });
    x.mm=mm; x.u26=sumR(mm,12,19); x.u25=sumR(mm,0,7); x.v26=sumR(mv,12,19); x.v25=sumR(mv,0,7);
    x.meses12=0; for(let i=8;i<=19;i++) if(mm[i]>0) x.meses12++;
    const ps=f.productos.filter(p=>P[p.art].m===b); x.ult=ps.map(p=>p.ult).filter(Boolean).sort().pop()||null;
    x.dias = x.ult ? Math.round((new Date('2026-09-23')-new Date(x.ult))/864e5) : null;
  }
  if(!esFarmacia(f) && !f.sin_datos){
    x.ps=f.productos.filter(p=>P[p.art].m===b && (p.listado||p.u_cadena>0));
    x.uS=x.ps.reduce((s,p)=>s+(p.u||0),0); x.uC=x.ps.reduce((s,p)=>s+(p.u_cadena||0),0);
    x.idx = x.uC ? x.uS/x.uC*100 : null;
    x.sinStock = f.tipo==='FARMASHOP' ? x.ps.filter(p=>p.listado&&(p.stock||0)<=0&&p.u_cadena>=1) : [];
  }
  // zona (CloseUp)
  const zb=D.cu[f.brick];
  if(zb){
    x.cats=(D.brandCats[b]||[]).filter(c=>zb[c] && zb[c].rows.some(r=>r.b===b));
    x.cats.sort((c1,c2)=>zb[c2].rows.find(r=>r.b===b).v[7]-zb[c1].rows.find(r=>r.b===b).v[7]);
    if(x.cats.length){
      x.cat = (curCat && x.cats.includes(curCat)) ? curCat : x.cats[0];
      const C=zb[x.cat]; x.C=C; x.row=C.rows.find(r=>r.b===b); const T=C.tot;
      x.sh=[[shareOf(x.row,T,6),shareOf(x.row,T,7)],[shareOf(x.row,T,8),shareOf(x.row,T,9)],[shareOf(x.row,T,10),shareOf(x.row,T,11)]];
      x.mkt=T[7]; x.mktG=gr(T[7],T[6]); x.brU=x.row.v[1]; x.brUG=gr(x.row.v[1],x.row.v[0]);
      const ranked=C.rows.filter(r=>!r.o).sort((r1,r2)=>r2.v[7]-r1.v[7]); x.rank=ranked.indexOf(x.row)+1; x.nRank=ranked.length;
      const zc=(Z[f.brick]||{cats:[]}).cats.find(c=>c.cat===x.cat); x.riser = zc ? zc.riser : null;
      // cartera
      x.cart=Object.keys(D.cu).map(k=>{ const c=D.cu[k][x.cat]; if(!c) return null; const r=c.rows.find(r=>r.b===b); return {k, s: r&&c.tot[7] ? r.v[7]/c.tot[7]*100 : 0, v:r?r.v[7]:0, t:c.tot[7]}; }).filter(Boolean).sort((a,b2)=>b2.s-a.s);
      x.cartPos = x.cart.findIndex(c=>c.k===String(f.brick))+1;
      const sv=x.cart.reduce((s,c)=>s+c.v,0), st=x.cart.reduce((s,c)=>s+c.t,0); x.cartAvg = st? sv/st*100 : null;
      // presentaciones: zona vs farmacia/sucursal
      const pres=(D.cuPres[f.brick]||{});
      x.skuCat=x.sk.filter(a=>D.artCat[a]===x.cat);
      const zU=x.skuCat.map(a=>(pres[a]||[0,0])[1]||0), zT=zU.reduce((s,v)=>s+v,0);
      const fU=x.skuCat.map(a=> esFarmacia(f) ? ((x.perSku&&x.perSku[a])?x.perSku[a].u12:0) : ((f.productos||[]).find(p=>String(p.art)===a)||{}).u||0 ), fT=fU.reduce((s,v)=>s+Math.max(0,v),0);
      x.mix=x.skuCat.map((a,i)=>({a, z: zT? zU[i]/zT*100 : 0, zu:zU[i], f: fT? Math.max(0,fU[i])/fT*100 : 0, fu:fU[i]})).filter(m=>m.zu>0||m.fu>0).sort((m1,m2)=>m2.z-m1.z);
    }
  }
  // cadenas del brick
  x.chains = F.filter(c=>c.brick===f.brick && (c.tipo==='FARMASHOP'||c.tipo==='SAN ROQUE') && c.id!==f.id && !c.sin_datos);
  return x;
}

function insights(x){
  const L=[], f=x.f, mb=marca(x.b);
  if(esFarmacia(f) && x.u26!=null){
    if(x.u25>0||x.u26>0) L.push([`En esta farmacia, ${mb} ${x.u25>0?'<b class="'+cls(x.u26-x.u25)+'">'+pct(gr(x.u26,x.u25))+'</b> en unidades':'<b>se empezó a comprar</b>'} (ene–ago 2026 contra 2025)${x.row?`; en la zona, la marca ${pct(x.brUG)} y el mercado de ${catName(x.cat).toLowerCase()} ${pct(x.mktG)} (año móvil)`:''}.`,'Venta Real · CloseUp']);
    else L.push([`Esta farmacia no compró ${mb} desde enero de 2025.`,'Venta Real']);
  }
  if(!esFarmacia(f) && x.ps && x.ps.length) L.push([`En agosto esta sucursal vendió <b>${n0(x.uS)} unid.</b> de ${mb}, ${x.idx==null?'':'índice <b class="'+(x.idx>=100?'up':'down')+'">'+nf0.format(x.idx)+'</b> contra la sucursal promedio'}${x.sinStock.length?`; ${x.sinStock.length} presentación${x.sinStock.length>1?'es':''} sin stock`:''}.`,'Sell-Out '+TIPO[f.tipo]]);
  if(x.row){
    L.push([`Share de ${mb} en ${catName(x.cat).toLowerCase()}: <b>${nf1.format(x.sh[0][1])}%</b> en la zona (<span class="${cls(x.sh[0][1]-x.sh[0][0])}">${pp(x.sh[0][1]-x.sh[0][0])}</span> en el año); último trimestre ${nf1.format(x.sh[1][1])}%. Puesto ${x.rank} de ${x.nRank} en la categoría.`,'CloseUp']);
    const gap=(x.mix||[]).filter(m=>m.z-m.f>=10).sort((a,b)=>(b.z-b.f)-(a.z-a.f))[0];
    if(gap && (esFarmacia(f)? x.u26>0 : true)) L.push([`${esc(P[gap.a].n)} es el ${nf0.format(gap.z)}% de la marca en la zona y el ${nf0.format(gap.f)}% en ${esFarmacia(f)?'esta farmacia':'esta sucursal'}: ahí hay espacio para crecer.`,'CloseUp · '+(esFarmacia(f)?'Venta Real':'Sell-Out')]);
    if(x.riser) L.push([`Competidor que más gana en la zona: <b>${esc(x.riser.producto)}</b> (${esc(x.riser.corp)}), ${pp(x.riser.delta_pp)} de share en el año.`,'CloseUp']);
    if(x.cartPos) L.push([`Este brick está ${x.cartPos}º de ${x.cart.length} en tu cartera por share de ${mb} (promedio de la cartera: ${nf1.format(x.cartAvg)}%).`,'CloseUp']);
  } else if(Z[f.brick]) L.push([`CloseUp no registra ventas de ${mb} en este brick.`,'CloseUp']);
  if(!L.length) return '';
  return `<section class="sec"><div class="sec-h"><h2>Lo más importante</h2><span class="src">${esc(mb)}</span></div><ul class="ins">${L.map(([t,s])=>`<li>${t} <em>${esc(s)}</em></li>`).join('')}</ul></section>`;
}

function hrows(rows){ // rows: {label, tag, w (0-100), cls, val, sub, subCls}
  return '<div class="hrows">'+rows.map(r=>`<div class="hrow" title="${esc(r.title||'')}"><span class="hl">${r.label}${r.tag||''}</span><span class="ht"><span class="hbar ${r.cls}" style="width:${Math.max(1.5,Math.min(100,r.w))}%"></span></span><span class="hv num">${r.val}${r.sub!=null?`<small class="${r.subCls||''}">${r.sub}</small>`:''}</span></div>`).join('')+'</div>';
}

function sharePeriods(sh){
  const W=340,H=150,x0=12,x1=328,y0=22,y1=118; const lab=['Año móvil','Último trimestre','Último mes'];
  const mx=Math.max(1,...sh.flat().filter(v=>v!=null))*1.15, gw=(x1-x0)/3, bw=30;
  const y=v=>y1-(v/mx)*(y1-y0);
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Share de la marca por período, año anterior y actual">`;
  sh.forEach(([a,b],i)=>{ const cx=x0+gw*i+gw/2;
    [[a,cx-bw-3,'var(--series-prev)'],[b,cx+3,'var(--brand)']].forEach(([v,x,c])=>{ if(v==null) return; const yy=y(v);
      s+=`<path d="${barPath(x,yy,bw,Math.max(.5,y1-yy))}" fill="${c}"><title>${nf1.format(v)}%</title></path><text x="${x+bw/2}" y="${yy-5}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink)">${nf1.format(v)}</text>`; });
    s+=`<text x="${cx}" y="${y1+16}" text-anchor="middle" font-size="10" fill="var(--muted)">${lab[i]}</text>`; });
  s+=`<line x1="${x0}" x2="${x1}" y1="${y1}" y2="${y1}" stroke="var(--muted)" stroke-width="1"/></svg>`;
  return s;
}

function marcaView(f){
  const bl=brandsFor(f); if(!curBrand||!bl.includes(curBrand)) curBrand=bl[0];
  const b=curBrand, x=brandCtx(f,b), mb=marca(b);
  const quick=bl.slice(0,6);
  let h=`<section class="sec picker"><div class="row2" style="align-items:end"><label for="marcaSel" class="plabel">Marca<select id="marcaSel">${bl.map(k=>`<option value="${k}"${k===b?' selected':''}>${esc(marca(k))}</option>`).join('')}</select></label></div>
    <div class="chips" role="group" aria-label="Marcas frecuentes">${quick.map(k=>`<button class="chip" data-marca="${k}" aria-pressed="${k===b}">${esc(marca(k))}</button>`).join('')}</div></section>`;
  h+=insights(x);
  // A. farmacia / sucursal
  if(esFarmacia(f)){
    if(f.sin_datos) h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en esta farmacia</h2></div><div class="empty">Sin compras registradas en Venta Real.</div></section>`;
    else {
      const map={}; MI.forEach((m,i)=>map[m]=x.mm[i]);
      const rows=x.sk.map(a=>({a,u:(x.perSku[a]||{u12:0}).u12, p:f.productos.find(p=>String(p.art)===a)})).sort((r1,r2)=>r2.u-r1.u);
      const mx=Math.max(1,...rows.map(r=>r.u));
      h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en esta farmacia</h2><span class="src">Venta Real</span></div>
        <div class="kpis">
          <div class="kpi"><span class="l">Unidades ene–ago 2026</span><span class="v num">${n0(x.u26)}</span><span class="s num">${x.u25>0?`<span class="${cls(x.u26-x.u25)}">${pct(gr(x.u26,x.u25))}</span> vs. 2025 (${n0(x.u25)})`:'sin compras en 2025'}</span></div>
          <div class="kpi"><span class="l">Compras ene–ago 2026</span><span class="v num">${moneyC(x.v26)}</span><span class="s num">${x.v25>0?`<span class="${cls(x.v26-x.v25)}">${pct(gr(x.v26,x.v25))}</span> vs. 2025`:'–'}</span></div>
          <div class="kpi"><span class="l">Última compra de la marca</span><span class="v num">${x.dias==null?'–':x.dias+' días'}</span><span class="s">${fdate(x.ult)}</span></div>
          <div class="kpi"><span class="l">Meses con compra</span><span class="v num">${x.meses12}<span style="font-size:14px;color:var(--muted)"> de 12</span></span><span class="s">sep-25 a ago-26</span></div>
        </div></section>
        <section class="sec"><div class="sec-h"><h2>Unidades por mes</h2><span class="src">Venta Real · cajas</span></div>
          <div class="legend"><span><i style="background:var(--series-prev)"></i>2025</span><span><i style="background:var(--brand)"></i>2026</span></div>
          <div class="chart" data-chart="marca">${chartYoY(map,'marca',{label:'Unidades de '+mb+' por mes',axis:v=>nf0.format(v),val:v=>n0(v)+' unid.'})}</div>
          <div class="readout num"></div><span class="small">Septiembre 2026 incluye compras hasta el ${D.corte.venta_real}.</span></section>
        <section class="sec"><div class="sec-h"><h2>Presentaciones que compra</h2><span class="src">Últimos 12 meses · cajas</span></div>
          ${hrows(rows.map(r=>({label:esc(P[r.a].n), w:r.u/mx*100, cls:r.u>0?'b-sel':'b-oth', val:r.u>0?n0(r.u):'<span class="kind incorporar" style="margin:0">no compra</span>', sub:r.p&&r.p.dias!=null?'hace '+r.p.dias+' d':null, title:P[r.a].n})))}
        </section>`;
    }
  } else if(!f.sin_datos){
    const ps=x.ps.slice().sort((p1,p2)=>(p2.u||0)-(p1.u||0)||p2.u_cadena-p1.u_cadena);
    const mx=Math.max(1,...ps.map(p=>Math.max(p.u||0,p.u_cadena||0)));
    const fs=f.tipo==='FARMASHOP';
    h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en esta sucursal</h2><span class="src">Sell-Out ${TIPO[f.tipo]} · agosto</span></div>
      <div class="kpis">
        <div class="kpi"><span class="l">Unidades en agosto</span><span class="v num">${n0(x.uS)}</span><span class="s num">promedio ${TIPO[f.tipo]}: ${nf1.format(x.uC)}</span></div>
        <div class="kpi"><span class="l">Contra la sucursal promedio</span><span class="v num ${x.idx==null?'':(x.idx>=100?'up':'down')}">${x.idx==null?'–':nf0.format(x.idx)}</span><span class="s">100 = promedio</span></div>
      </div>
      <div class="legend"><span><i style="background:var(--brand)"></i>Esta sucursal</span><span><i style="background:var(--series-prev)"></i>Sucursal promedio</span></div>
      <div class="hrows">${ps.map(p=>`<div class="hrow2"><span class="hl">${esc(P[p.art].n)}${fs&&p.listado&&(p.stock||0)<=0?' <span class="kind recuperar">sin stock</span>':''}</span>
        <div class="pair"><span class="hbar b-sel" style="width:${Math.max(1.5,(p.u||0)/mx*100)}%"></span><span class="hbar b-oth" style="width:${Math.max(1.5,(p.u_cadena||0)/mx*100)}%"></span></div>
        <span class="hv num">${n0(p.u)}<small>${nf1.format(p.u_cadena||0)}${fs&&p.stock!=null?' · stock '+n0(p.stock):''}</small></span></div>`).join('')||'<div class="empty">La cadena no registra ventas de esta marca.</div>'}</div>
    </section>`;
  }
  // B. zona
  if(!Z[f.brick]) h+=`<div class="empty">Este punto de venta no tiene brick asignado, así que no hay datos de mercado de su zona.</div>`;
  else if(!x.row) h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en la zona</h2></div><div class="empty">CloseUp no registra ventas de ${esc(mb)} en el brick ${f.brick}.</div></section>`;
  else {
    const T=x.C.tot;
    const ranked=x.C.rows.filter(r=>!r.o).sort((r1,r2)=>r2.v[7]-r1.v[7]);
    let top=ranked.slice(0,8); if(!top.includes(x.row)) top=top.concat([x.row]);
    const mxs=Math.max(...top.map(r=>r.v[7]/T[7]*100));
    h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en la zona</h2><span class="src">CloseUp · brick ${f.brick}</span></div>
      ${x.cats.length>1?`<div class="chips" role="group" aria-label="Categoría">${x.cats.map(c=>`<button class="chip" data-cat="${c}" aria-pressed="${c===x.cat}">${esc(catName(c))}</button>`).join('')}</div>`:`<span class="small" style="margin-top:-6px">${esc(catName(x.cat))}</span>`}
      <div class="kpis">
        <div class="kpi"><span class="l">Share año móvil</span><span class="v num">${nf1.format(x.sh[0][1])}%</span><span class="s num"><span class="${cls(x.sh[0][1]-x.sh[0][0])}">${pp(x.sh[0][1]-x.sh[0][0])}</span> vs. año anterior</span></div>
        <div class="kpi"><span class="l">Share último trimestre</span><span class="v num">${nf1.format(x.sh[1][1])}%</span><span class="s num"><span class="${cls(x.sh[1][1]-x.sh[1][0])}">${pp(x.sh[1][1]-x.sh[1][0])}</span> vs. año anterior</span></div>
        <div class="kpi"><span class="l">Mercado de la categoría</span><span class="v num">${moneyC(x.mkt)}</span><span class="s num"><span class="${cls(x.mktG)}">${pct(x.mktG)}</span> año móvil</span></div>
        <div class="kpi"><span class="l">${esc(mb)} en la zona</span><span class="v num">${n0(x.brU)} <span style="font-size:13px;color:var(--muted)">unid.</span></span><span class="s num"><span class="${cls(x.brUG)}">${pct(x.brUG)}</span> año móvil</span></div>
      </div></section>
      <section class="sec"><div class="sec-h"><h2>Share por período</h2><span class="src">CloseUp · % del mercado en $</span></div>
        <div class="legend"><span><i style="background:var(--series-prev)"></i>Año anterior</span><span><i style="background:var(--brand)"></i>Actual (a julio 2026)</span></div>
        <div class="chart">${sharePeriods(x.sh)}</div>
        <span class="small">Si el último trimestre y el último mes están por encima del año móvil, la marca viene ganando terreno.</span></section>
      <section class="sec"><div class="sec-h"><h2>Ranking de ${esc(catName(x.cat).toLowerCase())}</h2><span class="src">Share año móvil · crec. en $</span></div>
        <div class="legend"><span><i style="background:var(--brand)"></i>${esc(mb)}</span><span><i style="background:var(--series-grp)"></i>Grupo Megalabs</span><span><i style="background:var(--series-prev)"></i>Competidores</span></div>
        ${hrows(top.map(r=>{ const s=r.v[7]/T[7]*100, g=gr(r.v[7],r.v[6]); return {label:esc(r.b?marca(r.b):r.p), tag:(r.g&&r.b!==x.b?'<span class="g">GRUPO</span>':''), w:s/mxs*100, cls:r===x.row?'b-sel':(r.g?'b-grp':'b-oth'), val:nf1.format(s)+'%', sub:g==null?'nuevo':pct(g), subCls:cls(g), title:(r.c||'')}; }))}
        ${x.riser?`<span class="small">Competidor que más gana: <b style="color:var(--ink)">${esc(x.riser.producto)}</b> (${esc(x.riser.corp)}), ${pp(x.riser.delta_pp)} en el año.</span>`:''}
      </section>`;
    if(x.mix && x.mix.length){
      const mxm=Math.max(1,...x.mix.map(m=>Math.max(m.z,m.f)));
      h+=`<section class="sec"><div class="sec-h"><h2>Presentaciones: zona contra ${esFarmacia(f)?'farmacia':'sucursal'}</h2><span class="src">% de la marca en unidades</span></div>
        <div class="legend"><span><i style="background:var(--series-zone)"></i>Zona (CloseUp, año móvil)</span><span><i style="background:var(--brand)"></i>${esFarmacia(f)?'Farmacia (Venta Real, 12 meses)':'Sucursal (agosto)'}</span></div>
        <div class="hrows">${x.mix.map(m=>`<div class="hrow2"><span class="hl">${esc(P[m.a].n)}</span><div class="pair"><span class="hbar b-zone" style="width:${Math.max(1.5,m.z/mxm*100)}%"></span><span class="hbar b-sel" style="width:${Math.max(1.5,m.f/mxm*100)}%"></span></div><span class="hv num">${nf0.format(m.z)}%<small>${nf0.format(m.f)}%</small></span></div>`).join('')}</div>
        <span class="small">Cuando una presentación pesa mucho más en la zona que en ${esFarmacia(f)?'la farmacia':'la sucursal'}, conviene proponerla.</span></section>`;
    }
    // C. cartera
    const mxc=Math.max(...x.cart.map(c=>c.s),1);
    h+=`<section class="sec"><div class="sec-h"><h2>Share de ${esc(mb)} en tu cartera</h2><span class="src">${esc(catName(x.cat))} · 20 bricks</span></div>
      <span class="small" style="margin-top:-6px">Promedio de la cartera: <b style="color:var(--ink)">${nf1.format(x.cartAvg)}%</b>. Este brick está ${x.cartPos}º de ${x.cart.length}.</span>
      ${hrows(x.cart.map(c=>({label:esc(zonaCorta(c.k))+(c.k===String(f.brick)?' <span class="g" style="color:var(--brand-strong)">ESTA ZONA</span>':''), w:c.s/mxc*100, cls:c.k===String(f.brick)?'b-sel':'b-oth', val:nf1.format(c.s)+'%', title:'Brick '+c.k})))}
    </section>`;
  }
  // D. cadenas del brick
  if(Z[f.brick]){
    const agg={}; x.chains.forEach(c=>c.productos.forEach(p=>{ if(P[p.art].m!==b) return; const a=agg[p.art]||(agg[p.art]={u:0,st:0,hasSt:false}); a.u+=p.u||0; if(p.stock!=null){a.st+=p.stock; a.hasSt=true;} }));
    const rows=Object.entries(agg).filter(([a,v])=>v.u>0||v.st>0).sort((r1,r2)=>r2[1].u-r1[1].u);
    h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en las cadenas de la zona</h2><span class="src">Sell-Out agosto 2026</span></div>
      ${x.chains.length?`<span class="small" style="margin-top:-6px">${x.chains.map(c=>esc(c.nombre)).join(' · ')}</span>
      ${rows.length?`<div class="tscroll"><table><thead><tr><th>Presentación</th><th class="r">Unid. ago</th><th class="r">Stock Farmashop</th></tr></thead><tbody>${rows.map(([a,v])=>`<tr><td>${esc(P[a].n)}</td><td class="r num" style="font-weight:700">${n0(v.u)}</td><td class="r num">${v.hasSt?n0(v.st):'–'}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">Las sucursales de la zona no vendieron ${esc(mb)} en agosto.</div>`}`
      :`<div class="empty">No hay otras sucursales de Farmashop ni San Roque de tu cartera en este brick.</div>`}
    </section>`;
  }
  return h;
}
function bindMarca(p){
  const sel=p.querySelector('#marcaSel'); if(sel) sel.addEventListener('change',e=>{ curBrand=e.target.value; curCat=null; renderTab(); });
  p.querySelectorAll('[data-marca]').forEach(bt=>bt.addEventListener('click',()=>{ curBrand=bt.dataset.marca; curCat=null; if(curTab!=='marca'){ const t=document.querySelector('.tab[data-k="marca"]'); if(t){ t.click(); return; } } renderTab(); }));
  p.querySelectorAll('[data-cat]').forEach(bt=>bt.addEventListener('click',()=>{ curCat=bt.dataset.cat; const y=window.scrollY; renderTab(); window.scrollTo(0,y); }));
}

function compras(f){
  if(f.sin_datos) return '<div class="empty">Sin compras registradas en Venta Real.</div>';
  const M=f.marcas.filter(m=>(m.v26||0)!==0||(m.v25||0)!==0||(m.mix_zona||0)>=1);
  const mx=Math.max(1,...M.map(m=>Math.max(m.mix||0,m.mix_zona||0)));
  const tabla = `<div class="tscroll"><table><thead><tr><th>Marca</th><th class="r">Ene–ago 26</th><th class="r">vs. 25</th><th>Peso: farmacia / zona</th></tr></thead><tbody>${
    M.map(m=>`<tr><td style="font-weight:700"><button class="lnk" data-marca="${esc(m.marca)}">${esc(marca(m.marca))}</button></td><td class="r num">${moneyC(m.v26)}</td><td class="r num ${cls(m.var)}">${m.v25>0?pct(m.var):(m.v26>0?'nuevo':'–')}</td>
      <td><div class="bars" title="Farmacia ${nf1.format(m.mix||0)}% · Zona ${m.mix_zona==null?'–':nf1.format(m.mix_zona)+'%'}"><div class="bar" style="width:${(m.mix||0)/mx*100}%"></div><div class="bar z" style="width:${(m.mix_zona||0)/mx*100}%"></div></div><span class="small num">${nf0.format(m.mix||0)}% / ${m.mix_zona==null?'–':nf0.format(m.mix_zona)+'%'}</span></td></tr>`).join('')}</tbody></table></div>`;
  const PR=f.productos.map(p=>({...p,...P[p.art]}));
  const dejo=PR.filter(p=>p.estado==='dejo'), act=PR.filter(p=>p.estado==='activo').sort((a,b)=>(b.u12||0)-(a.u12||0)), nunca=PR.filter(p=>p.estado==='nunca');
  const lista = arr => `<div class="tscroll"><table><thead><tr><th>Producto</th><th class="r">Últ. 12 meses</th><th class="r">Última compra</th></tr></thead><tbody>${arr.map(p=>`<tr><td>${esc(p.n)}</td><td class="r num">${n0(p.u12)}</td><td class="r num">${p.dias==null?'–':'hace '+p.dias+' d'}</td></tr>`).join('')}</tbody></table></div>`;
  return `<section class="sec"><div class="sec-h"><h2>Compras por marca</h2><span class="src">Venta Real · CloseUp</span></div>
      <div class="legend"><span><i style="background:var(--brand)"></i>Peso en las compras de la farmacia</span><span><i style="background:var(--series-zone)"></i>Peso en la venta de su zona</span></div>${tabla}
      <span class="small">Si una marca pesa mucho más en la zona que en la farmacia, hay espacio para crecer en surtido. Tocá una marca para ver sus tableros.</span></section>
    ${dejo.length?`<section class="sec"><div class="sec-h"><h2>Dejó de comprar</h2><span class="src">${dejo.length} producto${dejo.length>1?'s':''}</span></div><span class="small">Los compró entre junio y septiembre de 2025 y en el mismo período de 2026 no.</span>${lista(dejo)}</section>`:''}
    <section class="sec"><div class="sec-h"><h2>Lo que compra</h2><span class="src">${act.length} productos · unid. de venta</span></div>${lista(act)}</section>
    ${nunca.length?`<section class="sec"><details><summary>No compró nunca (${nunca.length} productos)</summary><div class="small" style="padding-top:6px">${nunca.map(p=>esc(p.n)).join(' · ')}</div></details></section>`:''}`;
}

function ventas(f){
  if(f.sin_datos) return '<div class="empty">Sin datos de sell-out para esta sucursal en agosto.</div>';
  const fs=f.tipo==='FARMASHOP';
  const R=f.productos.map(p=>({...p,...P[p.art]})).filter(p=>p.listado||p.u_cadena>0).sort((a,b)=>(b.u||0)-(a.u||0)||(b.u_cadena-a.u_cadena));
  const flag=p=>{ if(fs&&p.listado&&(p.stock||0)<=0&&p.u_cadena>=3) return '<span class="kind recuperar">sin stock</span>';
    if(fs&&p.listado&&(p.stock||0)>=3&&(p.u||0)===0&&p.u_cadena>=2) return '<span class="kind incorporar">sin rotación</span>';
    if(!fs&&(p.u||0)===0&&p.u_cadena>=2) return '<span class="kind revisar">sin venta</span>'; return ''; };
  return `<section class="sec"><div class="sec-h"><h2>Productos en agosto</h2><span class="src">Sell-Out ${TIPO[f.tipo]}</span></div>
    <div class="tscroll"><table><thead><tr><th>Producto</th><th class="r">Unid.</th>${fs?'<th class="r">Stock</th><th class="r">Cob.</th>':''}<th class="r">Prom.</th></tr></thead><tbody>${
      R.map(p=>`<tr><td>${flag(p)}${esc(p.n)}</td><td class="r num" style="font-weight:700">${n0(p.u)}</td>${fs?`<td class="r num">${p.stock==null?'–':n0(p.stock)}</td><td class="r num">${p.cob==null?'–':nf1.format(p.cob)+' sem'}</td>`:''}<td class="r num">${nf1.format(p.u_cadena||0)}</td></tr>`).join('')}</tbody></table></div>
    <span class="small">${fs?'Cob. = semanas de cobertura (stock al cierre ÷ venta semanal de agosto). ':''}Prom. = unidades por sucursal de la cadena en agosto.</span></section>`;
}

function zona(f){
  const z=Z[f.brick];
  if(!z) return '<div class="empty">Este punto de venta no tiene brick asignado en el maestro, así que no hay datos de su zona.</div>';
  const vs = z.share_meg - D.share_cartera;
  const cats = z.cats;
  const mk = cats.reduce((s,c)=>s+c.mercado,0), mk0 = cats.reduce((s,c)=>s+(c.crec==null?c.mercado:c.mercado/(1+c.crec/100)),0), mkg = mk0? (mk/mk0-1)*100 : null;
  const catHTML = c => {
    const mm = c.marcas.filter(m=>m.share>0);
    return `<div class="cat"><div class="cat-h"><b>${esc(c.nombre)}</b><span class="small num">${moneyC(c.mercado)} · <span class="${cls(c.crec)}">${pct(c.crec)}</span></span></div>
      ${mm.map(m=>`<div class="share-row"><span>${esc(marca(m.marca))}</span><span class="big num">${nf1.format(m.share)}%</span><span class="num ${cls(m.delta_pp)}">${pp(m.delta_pp)}</span><span class="small">de share</span></div>`).join('')}
      <div class="tops">${c.top.map(t=>`<div><span>${esc(t.producto)}${t.grupo?'<span class="g">GRUPO</span>':''}</span><span class="num">${nf1.format(t.share)}%</span><span class="num ${cls(t.crec)}" style="min-width:44px;text-align:right">${pct(t.crec)}</span></div>`).join('')}</div>
      ${c.riser?`<span class="small">Competidor que más gana: <b style="color:var(--ink)">${esc(c.riser.producto)}</b> (${esc(c.riser.corp)}), ${pp(c.riser.delta_pp)} en el año.</span>`:''}
    </div>`; };
  const cz=z.cadenas||{sucursales:[],top:[]};
  return `<section class="sec"><div class="sec-h"><h2>Brick ${f.brick}</h2><span class="src">CloseUp · MAT a julio 2026</span></div>
      <span class="small" style="margin-top:-6px">${esc(z.desc)}</span>
      <div class="kpis">
        <div class="kpi"><span class="l">Share Megalabs OTC en sus categorías</span><span class="v num">${nf1.format(z.share_meg)}%</span><span class="s num"><span class="${cls(vs)}">${pp(vs)}</span> vs. promedio de tu cartera</span></div>
        <div class="kpi"><span class="l">Mercado de esas ${cats.length} categorías</span><span class="v num">${moneyC(mk)}</span><span class="s num"><span class="${cls(mkg)}">${pct(mkg)}</span> vs. año anterior</span></div>
      </div></section>
    <section class="sec"><div class="sec-h"><h2>Categorías de la zona</h2><span class="src">Mercado $ · crec. vs. año anterior</span></div>
      ${cats.slice(0,6).map(catHTML).join('')}
      ${cats.length>6?`<details><summary>Ver las otras ${cats.length-6} categorías</summary>${cats.slice(6).map(catHTML).join('')}</details>`:''}
      <span class="small">Share del total de cada categoría CloseUp. <span class="g" style="margin-left:0">GRUPO</span> = laboratorios del Grupo Megalabs.</span></section>
    <section class="sec"><div class="sec-h"><h2>Cadenas en esta zona</h2><span class="src">Sell-Out agosto 2026</span></div>
      ${cz.sucursales.length?`<div>${cz.sucursales.map(s=>`<div class="suc"><button class="back" style="min-height:32px;padding:0;text-align:left" data-open="${esc(s.id)}">${esc(s.nombre)}</button><span class="num">${n0(s.unid)} unid.</span></div>`).join('')}</div>
      ${cz.top.length?`<span class="small">Lo que más rota en esas sucursales: ${cz.top.slice(0,5).map(t=>esc(P[t.art].n)+' ('+n0(t.u)+')').join(' · ')}</span>`:''}`:'<div class="empty">No hay sucursales de Farmashop ni San Roque de tu cartera en este brick.</div>'}
    </section>`;
}
document.addEventListener('click', e => { const b=e.target.closest('[data-open]'); if(b){ openFicha(b.dataset.open); return; } const g=e.target.closest('[data-goto]'); if(g){ const t=document.querySelector('.tab[data-k="'+g.dataset.goto+'"]'); if(t) t.click(); } });

const KIND={reponer:'Reponer',recuperar:'Recuperar',incorporar:'Incorporar',exhibir:'Exhibir',revisar:'Revisar'};
function pedido(f){
  const Q=f.pedido||[];
  if(!Q.length) return `<div class="empty">${f.sin_datos?'Sin datos de compras para sugerir un pedido.':'No hay productos para sugerir en esta visita.'}</div>`;
  const esFarm=f.tipo==='INDEPENDIENTE'||f.tipo==='NATAL';
  return `<section class="sec"><div class="sec-h"><h2>${esFarm?'Pedido sugerido':'Acciones en la sucursal'}</h2><span class="src">${Q.length} producto${Q.length>1?'s':''}</span></div>
    <div class="ped">${Q.map(q=>{ const p=P[q.art]; return `<div class="ped-i"><b><span class="kind ${q.tipo}">${KIND[q.tipo]}</span>${esc(p.n)}</b><div class="q num">${q.cant==null?'<small>a definir</small>':q.cant+'<small>'+(p.pack>1?'packs':'unid.')+'</small>'}</div><span class="small">${esc(q.motivo)}</span></div>`; }).join('')}</div>
    ${esFarm?'<span class="small">Cantidades en unidades de facturación, según lo que compró en septiembre y octubre de 2025 o su promedio mensual.</span>':''}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" id="copiar">Copiar ${esFarm?'pedido':'acciones'}</button><span class="small" id="copiado" aria-live="polite" style="align-self:center"></span></div>
    <textarea id="pedtxt" class="small" readonly hidden style="width:100%;min-height:120px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);padding:10px"></textarea>
  </section>`;
}
function copiarPedido(){
  const f=cur; const txt = f.nombre + ' — ' + (f.tipo==='INDEPENDIENTE'||f.tipo==='NATAL'?'pedido sugerido':'acciones') + '\n' + f.pedido.map(q=>'• '+KIND[q.tipo]+': '+P[q.art].n+(q.cant!=null?' — '+q.cant+(P[q.art].pack>1?' packs':' unid.'):'')).join('\n');
  const ok=()=>{ $('#copiado').textContent='Copiado. Pegalo en WhatsApp o en el sistema de pedidos.'; };
  const fallback=()=>{ const t=$('#pedtxt'); t.hidden=false; t.value=txt; t.focus(); t.select(); $('#copiado').textContent='Seleccioná el texto y copialo.'; };
  try{ navigator.clipboard.writeText(txt).then(ok, fallback); }catch(e){ fallback(); }
}

// ================= Navegación por pantallas =================
const SCREENS=['carga','login','menu','ruta','farm','marca'];
let screen='login';
function show(s, push){
  SCREENS.forEach(k=>{ document.getElementById('s-'+k).hidden = (k!==s); });
  screen=s; window.scrollTo(0,0);
  if(push!==false){ try{ history.pushState({s}, ''); }catch(e){} }
  syncAskBar();
}
window.addEventListener('popstate', e=>{ const s=e.state&&e.state.s; if(!s) return; if(s!=='login' && !logged()) return show('login',false); if(s==='farm'&&!cur) return show('menu',false); show(s,false); if(s==='farm') renderFarm(); if(s==='marca'&&cur) renderMarca(); if(s==='ruta'){ if(RUTA_NAV) renderRutaRes(); else { renderMenu(); show('menu',false); } } });
document.addEventListener('click', e=>{ const n=e.target.closest('[data-nav]'); if(!n) return; const s=n.dataset.nav; if(s==='menu'){ renderMenu(); show('menu'); } else if(s==='farm'){ show('farm'); renderFarm(); } });

// ================= Sesión y datos cifrados =================
// Cada cartera viaja cifrada (AES-256-GCM). La clave de cada cartera está guardada dentro de
// data/users.json, cifrada con la contraseña de cada usuario (PBKDF2-SHA256 + AES-GCM).
const CONFIG=Object.assign({asistenteUrl:'',idiomaVoz:'es-UY'}, window.SMARTBRICK_CONFIG||{});
const ROL={vendedor:'Vendedor',jefe:'Jefe comercial',admin:'Administrador'};
const SES_KEY='sb.sesion';
let SES=null, USERS=null, zonasOrden=[];
const sesion={
  get(){ for(const k of ['sessionStorage','localStorage']){ try{ const v=window[k].getItem(SES_KEY); if(v) return JSON.parse(v); }catch(e){} } return null; },
  set(v){ for(const k of ['sessionStorage','localStorage']){ try{ window[k].removeItem(SES_KEY); }catch(e){} }
    if(v){ try{ window[v.recordar?'localStorage':'sessionStorage'].setItem(SES_KEY, JSON.stringify(v)); }catch(e){} } }
};
const logged=()=>!!(SES&&D);
const b64d=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function cargarUsuarios(){
  if(USERS) return USERS;
  const r=await fetch('data/users.json',{cache:'no-cache'});
  if(!r.ok) throw new Error('users '+r.status);
  USERS=await r.json(); return USERS;
}
// Contraseñas generadas: 3 grupos de 4 caracteres en minúscula. Se aceptan con o sin guiones y con mayúsculas.
function normPass(p){ let s=String(p||'').trim(); const c=s.toLowerCase().replace(/[\s-]/g,''); if(/^[a-z0-9]{12}$/.test(c)) return c.slice(0,4)+'-'+c.slice(4,8)+'-'+c.slice(8); return s; }
async function abrirUsuario(u,pass){
  const base=await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2', salt:b64d(u.salt), iterations:u.iter, hash:'SHA-256'}, base, {name:'AES-GCM', length:256}, false, ['decrypt']);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM', iv:b64d(u.iv)}, key, b64d(u.ct)); // falla si la contraseña no es correcta
  return JSON.parse(new TextDecoder().decode(pt));
}
async function cargarCartera(slug){
  const c=SES.carteras.find(x=>x.slug===slug)||SES.carteras[0];
  let archivo='data/'+c.slug+'.bin';
  try{ const U=await cargarUsuarios(); if(U.carteras&&U.carteras[c.slug]) archivo=U.carteras[c.slug].archivo; }catch(e){}
  let r; try{ r=await fetch(archivo,{cache:'no-cache'}); }catch(e){ throw new Error('No hay conexión para descargar los datos. Probá de nuevo con señal.'); }
  if(!r.ok) throw new Error('No encontré los datos de la cartera de '+c.vendedor+'.');
  const buf=new Uint8Array(await r.arrayBuffer());
  const key=await crypto.subtle.importKey('raw', b64d(c.key), 'AES-GCM', false, ['decrypt']);
  let gz; try{ gz=await crypto.subtle.decrypt({name:'AES-GCM', iv:buf.slice(0,12)}, key, buf.slice(12)); }
  catch(e){ const er=new Error('Los datos se actualizaron. Volvé a ingresar con tu contraseña.'); er.relogin=true; throw er; }
  if(typeof DecompressionStream==='undefined') throw new Error('Este navegador es muy antiguo para SmartBrick. Actualizá el teléfono o usá Chrome o Safari al día.');
  const data=await new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'))).json();
  setData(data); SES.cartera=c.slug; sesion.set(SES);
  cur=null; curBrand=null; curCat=null; curTab='resumen'; MST.farm=null; ASK.turns=[];
  initMenuData();
}
function initMenuData(){
  document.querySelectorAll('.wname').forEach(el=>el.textContent=D.vendedor);
  document.querySelectorAll('.wsub').forEach(el=>el.textContent=F.length+' farmacias · '+Object.keys(Z).length+' bricks');
  $('#hola').textContent='¡Hola, '+SES.nombre+'!';
  const ver=SES.carteras.length>1||SES.rol!=='vendedor';
  $('#lCartera').hidden=!ver;
  $('#cCartera').innerHTML=SES.carteras.map(c=>`<option value="${esc(c.slug)}">${esc(c.vendedor)}</option>`).join('');
  $('#cCartera').value=SES.cartera; $('#cCartera').disabled=SES.carteras.length<2;
  $('#cTipo').innerHTML=TIPOS.map(([k,l])=>`<option value="${k}">${l} (${k==='todas'?F.length:F.filter(f=>f.tipo===k).length})</option>`).join('');
  zonasOrden=Object.keys(Z).sort((a,b)=>zonaCorta(a).localeCompare(zonaCorta(b),'es'));
  $('#cZona').innerHTML=zonasOrden.map(b=>`<option value="${b}">${esc(zonaCorta(b))} (${b})</option>`).join('')+'<option value="sin">Sin brick asignado</option>';
  if(!MST.zona||(!Z[MST.zona]&&MST.zona!=='sin')) MST.zona=zonasOrden.find(b=>F.some(f=>String(f.brick)===b))||zonasOrden[0];
}

// ---- 1 · Login
const EYE_OFF='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-3.2 3.8"></path><path d="M6.6 6.6C4.3 8.2 3 12 3 12s4 6 9 6a9 9 0 0 0 4.4-1.1"></path><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path></svg>';
const EYE='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
$('#eye').innerHTML=EYE_OFF;
$('#eye').addEventListener('click',()=>{ const i=$('#lp'), vis=i.type==='password'; i.type=vis?'text':'password'; $('#eye').innerHTML=vis?EYE:EYE_OFF; $('#eye').setAttribute('aria-label', vis?'Ocultar contraseña':'Mostrar contraseña'); });
$('#forgot').addEventListener('click',()=>{ const m=$('#lmsg'); m.className='hint'; m.textContent='Para recuperar el acceso, pedí una contraseña nueva al administrador de SmartBrick.'; });
function lmsg(t,err){ const m=$('#lmsg'); m.className='hint'+(err?' err':''); m.textContent=t; }
function loginBusy(on,txt){ const b=$('.btn-login'); b.disabled=on; b.textContent=on?(txt||'Verificando…'):'Iniciar Sesión'; }
async function prepararLogin(){
  try{
    const U=await cargarUsuarios();
    $('#lu').innerHTML='<option value="" disabled selected>Nombre de usuario</option>'+U.usuarios.map(u=>`<option value="${esc(u.nombre)}">${esc(u.nombre)}${u.sinDatos?' (sin datos aún)':''}</option>`).join('');
    const last=store.get('ultimoUsuario',null);
    if(last&&U.usuarios.some(u=>u.nombre===last&&!u.sinDatos)) $('#lu').value=last;
    lmsg('Elegí tu nombre e ingresá tu contraseña.');
  }catch(e){ lmsg('No pude cargar la lista de usuarios. Revisá tu conexión y volvé a abrir SmartBrick.',true); }
}
$('#lu').addEventListener('change',e=>{ const u=USERS&&USERS.usuarios.find(x=>x.nombre===e.target.value); $('#lp').value='';
  if(u&&u.sinDatos) lmsg('La cartera de '+u.nombre+' todavía no está cargada en SmartBrick.');
  else { lmsg('Ingresá tu contraseña.'); $('#lp').focus(); } });
$('#loginForm').addEventListener('submit',async e=>{ e.preventDefault();
  if($('.btn-login').disabled) return;
  const nombre=$('#lu').value, pass=$('#lp').value;
  if(!USERS){ await prepararLogin(); if(!USERS) return; }
  if(!nombre){ lmsg('Elegí tu nombre de usuario.',true); $('#lu').focus(); return; }
  const u=USERS.usuarios.find(x=>x.nombre===nombre);
  if(!u){ lmsg('No encontré ese usuario.',true); return; }
  if(u.sinDatos){ lmsg('Todavía no hay datos cargados para '+nombre+'. Por ahora SmartBrick tiene la cartera de '+(USERS.usuarios.filter(x=>!x.sinDatos&&x.rol==='vendedor').map(x=>x.nombre).join(', ')||'otro vendedor')+'.',true); return; }
  if(!pass.trim()){ lmsg('Ingresá tu contraseña.',true); $('#lp').focus(); return; }
  loginBusy(true); lmsg('Verificando la contraseña…');
  let p; try{ p=await abrirUsuario(u,normPass(pass)); }
  catch(err){ loginBusy(false); lmsg('La contraseña no es correcta. Revisala y probá de nuevo.',true); $('#lp').select(); return; }
  try{
    loginBusy(true,'Abriendo tus datos…'); lmsg('Descargando y abriendo tu cartera…');
    SES=Object.assign(p,{recordar:$('#lrec').checked});
    await cargarCartera(p.carteras[0].slug);
    store.set('ultimoUsuario',nombre); $('#lp').value=''; lmsg('Elegí tu nombre e ingresá tu contraseña.');
    renderMenu(); show('menu');
  }catch(err){ SES=null; sesion.set(null); lmsg(err.message||'No pude abrir los datos.',true); }
  finally{ loginBusy(false); }
});
$('#logout').addEventListener('click',()=>{ ttsStop(); sesion.set(null); SES=null; D=null; cur=null; ASK.turns=[]; closeSheet(); show('login'); });
$('#cCartera').addEventListener('change',async e=>{ const sel=e.target; sel.disabled=true;
  try{ await cargarCartera(sel.value); renderMenu(); }
  catch(err){ alert(err.message||'No pude abrir esa cartera.'); sel.value=SES.cartera; }
  finally{ sel.disabled=SES.carteras.length<2; } });

// ---- 2 · Inicio
const MST={ fecha: null, mode: (m=>m==='ruta'?'ruta':'farm')(store.get('mode','farm')), tipo: store.get('tipo','todas'), zona: store.get('zonaSel', null), orden: store.get('orden','prio'), q:'', farm: null };
const TIPOS=[['todas','Todos'],['INDEPENDIENTE','Independientes'],['FARMASHOP','Farmashop'],['SAN ROQUE','San Roque'],['NATAL','Natal']];
function farmList(){
  let L=F.filter(f=> MST.mode==='zona' ? (MST.zona==='sin' ? !f.brick : String(f.brick)===MST.zona)
                                        : ((MST.tipo==='todas'||f.tipo===MST.tipo) && (!MST.q || f.nombre.toLowerCase().includes(MST.q))));
  // Orden fijo: por ruta de visita cuando haya rutas cargadas; si no, por nombre
  const conRuta=F.some(f=>f.ruta);
  if(conRuta) L.sort((a,b)=>(a.ruta==null)-(b.ruta==null)||String(a.ruta||'').localeCompare(String(b.ruta||''),'es',{numeric:true})||(a.ruta_orden??1e9)-(b.ruta_orden??1e9)||a.nombre.localeCompare(b.nombre,'es'));
  else L.sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
  return L;
}
function optLabel(f){
  const al=(f.alertas||[]).filter(a=>a.nivel==='alta').length;
  let s=f.nombre;
  if(f.ruta) s=f.ruta+(f.ruta_orden!=null?' '+f.ruta_orden+'º':'')+' · '+s;
  if(MST.mode==='farm') s+=' · '+TIPO[f.tipo];
  if(al) s+=' · '+al+' alerta'+(al>1?'s':'')+' alta'+(al>1?'s':'');
  return s;
}
function renderMenu(){
  document.querySelectorAll('.mode').forEach(m=>m.setAttribute('aria-pressed', m.dataset.mode===MST.mode));
  document.querySelectorAll('#cfg [data-for]').forEach(l=>l.hidden = !l.dataset.for.split(' ').includes(MST.mode));
  $('#cTipo').value=MST.tipo; $('#cZona').value=MST.zona;
  const L=farmList();
  $('#cFarm').innerHTML = L.length ? L.map(f=>`<option value="${esc(f.id)}">${esc(optLabel(f))}</option>`).join('') : '<option value="">No hay farmacias con esa configuración</option>';
  if(!L.some(f=>f.id===MST.farm)) MST.farm = L.length? L[0].id : null;
  if(MST.farm) $('#cFarm').value=MST.farm;
  $('#start').disabled=!MST.farm; $('#start').textContent='Comenzar visita';
  $('#cfg h3').textContent = MST.mode==='ruta' ? 'Configuración de Rutas' : 'Configuración de Visita';
  if(MST.mode==='ruta') renderRuta();
  preview();
}
function preview(){
  const f=F.find(x=>x.id===MST.farm), el=$('#cPrev');
  if(!f){ el.innerHTML=''; return; }
  const a=topLevel(f);
  el.innerHTML=`<span>${TIPO[f.tipo]} · ${f.brick?'Brick '+f.brick+' · '+esc(zonaCorta(f.brick)):'Sin brick asignado'}</span>`+
    (a?`<span><i class="dot ${a.nivel}"></i><b>${esc(a.titulo)}</b></span>`:'<span><i class="dot nada"></i>Sin alertas</span>');
}
document.querySelectorAll('.mode').forEach(m=>m.addEventListener('click',()=>{ if(MST.mode!==m.dataset.mode){ MST.q=''; $('#cBuscar').value=''; } MST.mode=m.dataset.mode; store.set('mode',MST.mode); renderMenu(); }));
$('#cTipo').addEventListener('change',e=>{ MST.tipo=e.target.value; store.set('tipo',MST.tipo); renderMenu(); });
$('#cZona').addEventListener('change',e=>{ MST.zona=e.target.value; store.set('zonaSel',MST.zona); renderMenu(); });
$('#cBuscar').addEventListener('input',e=>{ MST.q=e.target.value.trim().toLowerCase(); renderMenu(); });
$('#cFarm').addEventListener('change',e=>{ MST.farm=e.target.value; preview(); });
$('#start').addEventListener('click',()=>{
  if(MST.mode==='ruta'){ const ids=rutaGet(MST.fecha); if(ids.length){ RUTA_NAV={fecha:MST.fecha, ids, idx:0}; show('ruta'); renderRutaRes(); } return; }
  RUTA_NAV=null; if(MST.farm) openFicha(MST.farm); });

// ---- Armar rutas: el vendedor elige un día y toca las farmacias en el orden en que las va a visitar.
// Las rutas se guardan en este dispositivo, por usuario y cartera.
const isoDia=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const isoHoy=()=>isoDia(new Date());
const isoMan=()=>{ const d=new Date(); d.setDate(d.getDate()+1); return isoDia(d); };
const fechaD=iso=>{ const [y,m,d]=String(iso).split('-').map(Number); return new Date(y,m-1,d); };
const fechaLarga=iso=>{ const s=fechaD(iso).toLocaleDateString('es-UY',{weekday:'long',day:'numeric',month:'long'}); return s.charAt(0).toUpperCase()+s.slice(1); };
const fechaCorta=iso=>{ const d=fechaD(iso); return d.toLocaleDateString('es-UY',{weekday:'short'}).replace('.','')+' '+d.getDate()+'/'+(d.getMonth()+1); };
const rutasKey=()=>'rutas.'+(SES?SES.nombre:'')+'.'+(SES?SES.cartera:'');
function rutasAll(){ const a=store.get(rutasKey(),{}); return (a&&typeof a==='object')?a:{}; }
function rutaGet(f){ return (rutasAll()[f]||[]).filter(id=>F.some(x=>x.id===id)); }
function rutaSet(f,ids){
  const a=rutasAll(); if(ids.length) a[f]=ids; else delete a[f];
  const lim=isoDia(new Date(Date.now()-60*864e5)); Object.keys(a).forEach(k=>{ if(k<lim) delete a[k]; });   // se descartan rutas de hace más de 60 días
  store.set(rutasKey(),a);
}
let RUTA_NAV=null;   // ruta en curso cuando se recorre con "Comenzar ruta"
const fById=id=>F.find(x=>x.id===id);
function altaTxt(f){ const n=(f.alertas||[]).filter(a=>a.nivel==='alta').length; return n?` · ${n} alerta${n>1?'s':''} alta${n>1?'s':''}`:''; }
const MESES_L=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const pad2=n=>String(n).padStart(2,'0');
function renderCal(){
  const hoy=isoHoy(); if(!MST.calMes) MST.calMes=(MST.fecha||hoy).slice(0,7);
  const [y,m]=MST.calMes.split('-').map(Number), first=new Date(y,m-1,1), dias=new Date(y,m,0).getDate(), off=(first.getDay()+6)%7, all=rutasAll();
  let h=`<div class="cal-h"><button type="button" class="cal-nav" data-cm="-1" aria-label="Mes anterior">‹</button><b>${MESES_L[m-1].toUpperCase()} ${y}</b><button type="button" class="cal-nav" data-cm="1" aria-label="Mes siguiente">›</button>${MST.calMes!==hoy.slice(0,7)||MST.fecha!==hoy?`<button type="button" class="cal-hoy" data-f="${hoy}">Hoy</button>`:''}</div>`;
  h+='<div class="cal-g">'+['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d,i)=>`<span class="cal-w${i===6?' dom':''}" aria-hidden="true">${d}</span>`).join('');
  for(let i=0;i<off;i++) h+='<span></span>';
  for(let d=1;d<=dias;d++){
    const iso=`${y}-${pad2(m)}-${pad2(d)}`, n=(all[iso]||[]).length, dow=(off+d-1)%7;
    h+=`<button type="button" class="cal-d${dow===6?' dom':''}${iso===hoy?' hoy':''}${iso<hoy?' pas':''}" data-f="${iso}" aria-pressed="${iso===MST.fecha}" aria-label="${fechaLarga(iso)}${n?`: ${n} farmacia${n>1?'s':''}`:''}">${d}${n?`<i>${n}</i>`:''}</button>`;
  }
  h+='</div>'+(MST.fecha?'':'<p class="cal-hint">Tocá un día para armar su ruta.</p>');
  $('#rCal').innerHTML=h;
}
function renderRuta(){
  renderCal();
  document.querySelectorAll('#cfg [data-day]').forEach(el=>el.hidden=!MST.fecha);
  const st=$('#start');
  if(!MST.fecha){ st.textContent='Elegí un día en el calendario'; st.disabled=true; return; }
  $('#rDia').textContent='Ruta del '+fechaLarga(MST.fecha).toLowerCase().replace(',','');
  const all=rutasAll();
  // orden de visita
  const ids=rutaGet(MST.fecha);
  $('#rLista').innerHTML = `<div class="rlh"><b>Orden de visita${ids.length?` (${ids.length})`:''}</b>${ids.length?'<button type="button" class="rvaciar" id="rVaciar">Vaciar</button>':''}</div>`+
    (ids.length ? ids.map((id,i)=>{ const f=fById(id); return `<div class="rs"><span class="rn">${i+1}</span><span class="rt"><b>${esc(f.nombre)}</b><small>${TIPO[f.tipo]} · ${f.brick?esc(zonaCorta(f.brick)):'Sin brick'}${altaTxt(f)}</small></span>
      <button type="button" data-mv="-1" data-id="${esc(id)}" aria-label="Subir" ${i?'':'disabled'}>↑</button><button type="button" data-mv="1" data-id="${esc(id)}" aria-label="Bajar" ${i<ids.length-1?'':'disabled'}>↓</button><button type="button" data-rm="${esc(id)}" aria-label="Quitar de la ruta">✕</button></div>`; }).join('')
    : '<p class="rvacia">Todavía no hay farmacias para este día. Tocalas abajo en el orden en que las vas a visitar.</p>');
  // farmacias para elegir, agrupadas por zona
  let L=F.filter(f=>(MST.tipo==='todas'||f.tipo===MST.tipo)&&(!MST.q||f.nombre.toLowerCase().includes(MST.q)));
  const zk=f=>Z[f.brick]?zonaCorta(f.brick):null;   // las farmacias sin zona van al final
  L.sort((a,b)=>(zk(a)==null)-(zk(b)==null)||String(zk(a)||'').localeCompare(String(zk(b)||''),'es')||a.nombre.localeCompare(b.nombre,'es'));
  let h='', z=null;
  L.forEach(f=>{ const zz=zk(f)||'Sin brick asignado'; if(zz!==z){ z=zz; h+=`<div class="rzona">${esc(zz)}</div>`; }
    const pos=ids.indexOf(f.id);
    h+=`<button type="button" class="rp" data-id="${esc(f.id)}" aria-pressed="${pos>=0}"><span class="rn">${pos>=0?pos+1:''}</span><span class="rt"><b>${esc(f.nombre)}</b><small>${TIPO[f.tipo]}${altaTxt(f)}</small></span></button>`; });
  $('#rPick').innerHTML = h || '<p class="rvacia" style="padding:12px">No hay farmacias con ese filtro.</p>';
  const n=ids.length;
  st.textContent = n ? `Comenzar ruta (${n})` : 'Elegí las farmacias del día';
  st.disabled=!n;
}
function rutaToggle(id){ const ids=rutaGet(MST.fecha); const i=ids.indexOf(id); if(i>=0) ids.splice(i,1); else ids.push(id); rutaSet(MST.fecha,ids); }
$('#rCal').addEventListener('click',e=>{
  const nv=e.target.closest('[data-cm]'); if(nv){ const [y,m]=MST.calMes.split('-').map(Number), d=new Date(y,m-1+Number(nv.dataset.cm),1); MST.calMes=d.getFullYear()+'-'+pad2(d.getMonth()+1); renderCal(); return; }
  const b=e.target.closest('[data-f]'); if(!b) return; const nueva=MST.fecha!==b.dataset.f;
  MST.fecha=b.dataset.f; MST.calMes=MST.fecha.slice(0,7); renderRuta();
  if(nueva){ try{ $('#rDia').scrollIntoView({behavior:'smooth',block:'start'}); }catch(_){} }
});
$('#rPick').addEventListener('click',e=>{ const b=e.target.closest('.rp'); if(!b) return; const sc=$('#rPick').scrollTop; rutaToggle(b.dataset.id); renderRuta(); $('#rPick').scrollTop=sc; });
$('#rLista').addEventListener('click',e=>{
  if(e.target.closest('#rVaciar')){ if(confirm('¿Vaciar la ruta del '+fechaLarga(MST.fecha).toLowerCase()+'?')){ rutaSet(MST.fecha,[]); renderRuta(); } return; }
  const rm=e.target.closest('[data-rm]'); if(rm){ rutaToggle(rm.dataset.rm); renderRuta(); return; }
  const mv=e.target.closest('[data-mv]'); if(mv){ const ids=rutaGet(MST.fecha), i=ids.indexOf(mv.dataset.id), j=i+Number(mv.dataset.mv);
    if(i>=0&&j>=0&&j<ids.length){ [ids[i],ids[j]]=[ids[j],ids[i]]; rutaSet(MST.fecha,ids); renderRuta(); } }
});
// barra de ruta en la ficha: parada actual, anterior y siguiente
function renderRutaBar(){
  const el=$('#rutaBar'), R=RUTA_NAV;
  if(!R||!cur||R.ids[R.idx]!==cur.id){ el.hidden=true; return; }
  const n=R.ids.length, i=R.idx, next=i<n-1?fById(R.ids[i+1]):null;
  el.hidden=false;
  el.innerHTML=`<div class="rb-t"><b>Ruta · ${esc(fechaCorta(R.fecha))} · parada ${i+1} de ${n}</b><small>${next?'Siguiente: '+esc(next.nombre):'Última parada de la ruta'}</small><button type="button" class="rb-res" data-rres="1">Ver resumen de la ruta</button></div>
    <div class="rb-b"><button type="button" class="rbn" data-rn="-1" ${i?'':'disabled'} aria-label="Farmacia anterior">‹</button><button type="button" class="rbn" data-rn="1" ${next?'':'disabled'}>Siguiente ›</button></div>`;
}
$('#rutaBar').addEventListener('click',e=>{ if(e.target.closest('[data-rres]')&&RUTA_NAV){ show('ruta'); renderRutaRes(); return; } const b=e.target.closest('[data-rn]'); if(!b||!RUTA_NAV) return;
  const j=RUTA_NAV.idx+Number(b.dataset.rn); if(j<0||j>=RUTA_NAV.ids.length) return; RUTA_NAV.idx=j; openFicha(RUTA_NAV.ids[j]); });
// contexto para el asistente
function rutaCtx(){
  if(!F) return ''; const f=(MST&&MST.fecha)||isoHoy(); let ids=rutaGet(f), dia=f;
  if(!ids.length&&f!==isoHoy()){ ids=rutaGet(isoHoy()); dia=isoHoy(); }
  if(!ids.length) return '';
  return `Ruta planificada para el ${fechaLarga(dia).toLowerCase()} (en orden de visita): ${ids.map((id,i)=>{ const x=fById(id); return `${i+1}. ${x.nombre} (id ${x.id})`; }).join('; ')}.\n`;
}

// ---- Resumen de la ruta: pantalla intermedia antes de ver farmacia por farmacia
const NIVEL={alta:'Alta',media:'Media',positiva:'Bien'};
const pillA=n=>`<span class="apill ${n}">${NIVEL[n]||n}</span>`;
const pillG=(n,txt)=>`<span class="gpill ${n}">${txt||NIVEL[n]||n}</span>`;
// "Qué mirar" siempre en verde con letras blancas (estilos agregados desde aquí para no cambiar index.html)
(function(){ const st=document.createElement('style'); st.textContent=`.qm{gap:10px}.qm .green-h h2{font-size:20px}.qm-sub{margin:-6px 0 2px;font-size:12.5px;color:#DDEFE6}.qm .rr-it{background:var(--green-item);border:1px solid var(--green-line);border-radius:9px;padding:10px 12px;color:#fff}.qm .rr-it b{color:#fff;font-size:15px}.qm .rr-it p{color:#E4F1EA}.qm .rr-num{background:#fff;color:#174F3A}.qm .rr-it .gpill{grid-row:auto}.qm .gempty{margin:0;color:#E4F1EA}.qm-mini{padding:10px 10px 12px;gap:8px;border-radius:10px}.qm-mini h3{font-size:15.5px;font-weight:700;color:#fff;margin:2px 2px 0}.qm-mini .gitem{padding:8px 10px}.qm-mini .gitem b{font-size:14.5px}.qm-mini .gitem p{font-size:12.5px}`; document.head.appendChild(st); })();
const zonaDe=f=>Z[f.brick]?String(f.brick):'sin';
function kpiLine(f){
  if(f.sin_datos) return 'Sin compras registradas en Venta Real desde enero de 2025.';
  const k=f.kpi||{};
  if(esFarmacia(f)) return `Compras OTC 2026: <b>${moneyC(k.otc_ytd26)}</b> <span class="${cls(k.otc_var)}">${pct(k.otc_var)}</span> vs. 2025 · última compra ${k.dias_otc==null?'–':'hace '+k.dias_otc+(k.dias_otc===1?' día':' días')}`;
  return `Sell-out agosto: <b>${n0(k.unid)} unid.</b> · índice ${k.indice==null?'–':k.indice} · puesto ${k.rank} de ${k.n_suc}`;
}
// resumen corto de cada alerta para la vista unificada
const RES_ALERTA={
  dejo:['Dejaron de comprar productos', a=>(a.titulo.match(/\d+/)||[''])[0]+' prod.'],
  sin_compra:['Sin compras OTC hace más de 30 días', a=>(a.titulo.match(/\d+/)||[''])[0]+' días'],
  caida:['Compras en baja', a=>a.titulo.replace(/^Compras OTC /,'')],
  quiebre:['Productos sin stock', a=>(a.titulo.match(/\d+/)||[''])[0]+' prod.'],
  sin_rotacion:['Con stock y sin ventas (revisar exhibición)', a=>(a.titulo.match(/\d+/)||[''])[0]+' prod.'],
  sin_venta:['Productos sin ventas en agosto', a=>(a.titulo.match(/\d+/)||[''])[0]+' prod.'],
  bajo_prom:['Venden menos que la sucursal promedio', a=>a.titulo.replace(/^Vende /,'').replace(' que la sucursal promedio','')],
  surtido:['Marcas que pesan menos que en su zona', a=>a.titulo.split(':')[0]],
  crece:['Vienen creciendo', a=>a.titulo.replace(/^Compras OTC /,'')],
  alto_prom:['Venden más que la sucursal promedio', a=>a.titulo.replace(/^Vende /,'').replace(' que la sucursal promedio','')]
};
const ORD_NIV={alta:0,media:1,positiva:2};
function panoramaGrupos(ids){
  const grupos={};
  ids.forEach((id,i)=>{ const f=fById(id);
    (f.alertas||[]).forEach(a=>{ const g=RES_ALERTA[a.tipo]; if(!g) return;
      const G=grupos[a.tipo]||(grupos[a.tipo]={tipo:a.tipo,label:g[0],nivel:a.nivel,items:{}});
      if(ORD_NIV[a.nivel]<ORD_NIV[G.nivel]) G.nivel=a.nivel;
      const it=G.items[id]||(G.items[id]={i,f,txt:[]}); it.txt.push(g[1](a)); }); });
  return Object.values(grupos).sort((a,b)=>ORD_NIV[a.nivel]-ORD_NIV[b.nivel]||Object.keys(b.items).length-Object.keys(a.items).length)
    .map(G=>Object.assign(G,{lista:Object.values(G.items).sort((a,b)=>a.i-b.i)}));
}
function panorama(ids){
  return panoramaGrupos(ids).map((G,gi)=>`<div class="rr-it" data-say="g${gi}">${pillG(G.nivel)}<div><b>${esc(G.label)}</b><p>${G.lista.map(it=>`<span class="rr-num">${it.i+1}</span>${esc(it.f.nombre)} (${esc(it.txt.join(', '))})`).join(' · ')}</p></div></div>`).join('');
}
function zonaCard(b,items,zi){
  const nums=items.map(({f,i})=>`<span class="rr-num">${i+1}</span>${esc(f.nombre)}`).join('<br>');
  if(b==='sin') return `<div class="rr-z" data-say="z${zi}"><div class="rr-zh"><b>Sin brick asignado</b></div><p class="rr-f">${nums}</p><p class="small" style="margin:0">No hay datos de mercado de CloseUp para estos puntos de venta.</p></div>`;
  const z=Z[b], sm=z.share_meg, sc=D.share_cartera, dif=sm-sc;
  const brands=[]; (z.cats||[]).forEach(c=>(c.marcas||[]).forEach(m=>{ if((m.venta||0)>0) brands.push(Object.assign({cat:c},m)); }));
  brands.sort((a,c)=>c.venta-a.venta);
  const top=brands.slice(0,3).map(m=>`<li><b>${esc(marca(m.marca))}</b> ${nf1.format(m.share)}% en ${esc(catName(m.cat.cat).toLowerCase())} <span class="${cls(m.delta_pp)}">(${pp(m.delta_pp)})</span></li>`).join('');
  const baja=brands.filter(m=>m.share>=3&&m.delta_pp<=-1).sort((a,c)=>a.delta_pp-c.delta_pp)[0];
  let riesgo='';
  if(baja){ const r=baja.cat.riser; riesgo=`<div class="rr-it">${pillA('media')}<p><b>${esc(marca(baja.marca))} pierde ${nf1.format(Math.abs(baja.delta_pp))} pp</b> en ${esc(catName(baja.cat.cat).toLowerCase())}${r?`. El que más gana es <b>${esc(r.producto)}</b> (${esc(r.corp)}, ${pp(r.delta_pp)})`:''}.</p></div>`; }
  else { const rs=brands.map(m=>m.cat.riser).filter(Boolean).sort((a,c)=>c.delta_pp-a.delta_pp)[0];
    if(rs) riesgo=`<div class="rr-it">${pillA('media')}<p>Competidor que más crece: <b>${esc(rs.producto)}</b> (${esc(rs.corp)}, ${pp(rs.delta_pp)}).</p></div>`; }
  const cad=((z.cadenas&&z.cadenas.sucursales)||[]).filter(s=>!items.some(({f})=>f.id===s.id)).slice(0,3);
  return `<div class="rr-z" data-say="z${zi}"><div class="rr-zh"><b>${esc(zonaCorta(b))}</b><small>Brick ${b} · ${esc(zonaDepto(b))}</small></div>
    <p class="rr-f">${nums}</p>
    <div class="rr-share"><span class="l">Share de Megalabs OTC en la zona</span><span class="v num">${nf1.format(sm)}%</span><span class="s num"><span class="${cls(dif)}">${pp(dif)}</span> contra el promedio de tu cartera (${nf1.format(sc)}%)</span></div>
    ${top?`<div><span class="small">Marcas de Megalabs que más venden en la zona (share año móvil)</span><ul class="rr-ul">${top}</ul></div>`:''}
    ${riesgo}
    ${cad.length?`<p class="small" style="margin:0">Otras sucursales de cadenas en la zona: ${cad.map(s=>`${esc(s.nombre)} (${n0(s.unid)} unid. en agosto)`).join(' · ')}</p>`:''}
  </div>`;
}
function farmCard(f,i){
  const A=f.alertas||[], ped=f.pedido||[];
  return `<div class="rr-card" data-say="f${i}"><div class="rr-ch"><span class="rn">${i+1}</span><div class="rt"><b>${esc(f.nombre)}</b><small>${TIPO[f.tipo]} · ${Z[f.brick]?esc(zonaCorta(f.brick)):'Sin brick asignado'}</small></div><button type="button" class="rr-ver" data-ri="${i}">Ver ficha ›</button></div>
    <p class="rr-k">${kpiLine(f)}</p>
    <div class="green qm qm-mini"><h3>Qué mirar antes de entrar</h3>${A.length?A.map(a=>`<div class="gitem">${pillG(a.nivel)}<b>${esc(a.titulo)}</b><p>${esc(a.detalle)} <em>${esc(a.fuente)}</em></p></div>`).join(''):'<p class="gempty">No hay alertas para este punto de venta.</p>'}</div>
    ${ped.length?`<div class="rr-ped"><span class="small">Pedido sugerido</span>${ped.slice(0,3).map(q=>`<div><span class="kind ${q.tipo}">${KIND[q.tipo]||q.tipo}</span>${esc(P[q.art].n)}${q.cant!=null?` <b>x${q.cant}</b>`:''}</div>`).join('')}${ped.length>3?`<span class="small">y ${ped.length-3} más en la ficha</span>`:''}</div>`:''}
  </div>`;
}
function renderRutaRes(){
  const R=RUTA_NAV; if(!R) return;
  R.ids=rutaGet(R.fecha); if(!R.ids.length){ renderMenu(); show('menu'); return; }
  const fs=R.ids.map(fById), zonas=new Map();
  R.ids.forEach((id,i)=>{ const f=fById(id), b=zonaDe(f); if(!zonas.has(b)) zonas.set(b,[]); zonas.get(b).push({f,i}); });
  const al=fs.flatMap(f=>f.alertas||[]), altas=al.filter(a=>a.nivel==='alta').length, medias=al.filter(a=>a.nivel==='media').length;
  const ind=fs.filter(f=>esFarmacia(f)&&!f.sin_datos&&f.kpi), c26=ind.reduce((s,f)=>s+(f.kpi.otc_ytd26||0),0), c25=ind.reduce((s,f)=>s+(f.kpi.otc_ytd25||0),0);
  const cad=fs.filter(f=>!esFarmacia(f)&&!f.sin_datos&&f.kpi), uS=cad.reduce((s,f)=>s+(f.kpi.unid||0),0);
  const ped=fs.flatMap(f=>f.pedido||[]), pc={}; ped.forEach(q=>pc[q.tipo]=(pc[q.tipo]||0)+1);
  const pedTxt=Object.entries(pc).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`${n} ${(KIND[t]||t).toLowerCase()}`).join(' · ');
  const nz=[...zonas.keys()].length;
  let h=`<div class="rr-head"><span class="ptag">Ruta</span><h1>${esc(fechaLarga(R.fecha).replace(',',''))}</h1><p>${fs.length} punto${fs.length>1?'s':''} de venta · ${nz} zona${nz>1?'s':''}</p></div>`;
  h+=`<div class="kpis">
      <div class="kpi"><span class="l">Paradas</span><span class="v num">${fs.length}</span><span class="s">en ${nz} zona${nz>1?'s':''}</span></div>
      <div class="kpi"><span class="l">Alertas altas</span><span class="v num ${altas?'down':''}">${altas}</span><span class="s">y ${medias} media${medias===1?'':'s'}</span></div>
      ${ind.length?`<div class="kpi"><span class="l">Compras OTC 2026</span><span class="v num">${moneyC(c26)}</span><span class="s num"><span class="${cls(gr(c26,c25))}">${pct(gr(c26,c25))}</span> vs. 2025 · ${ind.length} farmacia${ind.length>1?'s':''}</span></div>`
        :`<div class="kpi"><span class="l">Sell-out agosto</span><span class="v num">${n0(uS)}</span><span class="s">unidades en ${cad.length} sucursal${cad.length>1?'es':''}</span></div>`}
      <div class="kpi"><span class="l">Pedido sugerido</span><span class="v num">${ped.length}</span><span class="s">producto${ped.length===1?'':'s'} en total</span></div>
    </div>`;
  const pan=panorama(R.ids);
  h+=`<section class="green qm"><div class="green-h"><h2>Qué mirar en esta ruta</h2>${btnEscuchar('ruta')}</div><p class="qm-sub">Resumen de todas las paradas</p>
      ${pan?`<div class="rr-items">${pan}</div>`:'<p class="gempty">Ninguna farmacia de la ruta tiene alertas.</p>'}
      ${ped.length?`<div class="rr-it">${pillG('positiva','Pedido')}<div><b>Pedido sugerido para la ruta</b><p>${esc(pedTxt)}</p></div></div>`:''}</section>`;
  h+=`<section class="sec"><div class="sec-h"><h2>Contexto de las zonas</h2><span class="src">CloseUp · año móvil a jul-26</span></div>${[...zonas.entries()].map(([b,items],zi)=>zonaCard(b,items,zi)).join('')}</section>`;
  h+=`<h2 class="mhead">Farmacia por farmacia</h2>${fs.map((f,i)=>farmCard(f,i)).join('')}`;
  h+=`<button class="cta" id="rrGo">Ver farmacia por farmacia ›</button>`;
  $('#rres').innerHTML=h+fuentes();
}
$('#rres').addEventListener('click',e=>{
  const v=e.target.closest('[data-ri]'); if(v&&RUTA_NAV){ RUTA_NAV.idx=Number(v.dataset.ri); openFicha(RUTA_NAV.ids[RUTA_NAV.idx]); return; }
  if(e.target.closest('#rrGo')&&RUTA_NAV){ RUTA_NAV.idx=0; openFicha(RUTA_NAV.ids[0]); }
});

// ---- Escuchar: lee en voz alta "Qué mirar antes de entrar" (ficha) y el resumen de la ruta, como un podcast.
// Usa la voz del propio teléfono (sin costo ni conexión). Se reproduce por frases para poder pausar, seguir y marcar lo que se lee.
const SYN = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) ? window.speechSynthesis : null;
const TTS = { segs: [], i: 0, playing: false, done: false, label: '', key: '', gen: 0, rate: Number(store.get('ttsRate', 1)) || 1 };
const ICO_SPK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"></path><path d="M15.5 9a4 4 0 0 1 0 6"></path><path d="M18.5 6.5a7.5 7.5 0 0 1 0 11"></path></svg>';
const ICO_PLAY = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"></path></svg>';
const ICO_PAUSE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1"></rect><rect x="13.5" y="5" width="4" height="14" rx="1"></rect></svg>';
const btnEscuchar = key => SYN ? `<button type="button" class="escuchar" data-tts="${key}">${ICO_SPK}<span>${TTS.key === key && TTS.segs.length ? (TTS.playing ? 'Pausar' : 'Seguir') : 'Escuchar'}</span></button>` : '';
// reproductor fijo abajo (persiste al cambiar de pantalla)
(function () {
  if (!SYN) return;
  document.body.insertAdjacentHTML('beforeend', `<div class="ttsbar" id="ttsBar" hidden><button type="button" class="tts-p" id="ttsPlay" aria-label="Pausar"></button><div class="tts-t"><b id="ttsTit"></b><small id="ttsSub"></small></div><button type="button" class="tts-r" id="ttsRate" aria-label="Velocidad de lectura"></button><button type="button" class="tts-x" id="ttsStop" aria-label="Cerrar audio">✕</button></div>`);
  const st = document.createElement('style');
  st.textContent = `.green-h{display:flex;align-items:center;justify-content:space-between;gap:10px}
.escuchar{display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 12px;border-radius:19px;border:1.5px solid currentColor;background:transparent;font-size:14px;font-weight:700;flex-shrink:0}
.green .escuchar{color:#fff;border-color:rgba(255,255,255,.85)}
.sec .escuchar{color:#007C6B}
.ttsbar{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:20;width:min(94vw,540px);display:flex;align-items:center;gap:10px;background:#1E2523;color:#fff;border-radius:16px;padding:8px 8px 8px 10px;box-shadow:0 6px 20px rgba(0,0,0,.3)}
.tts-p{width:44px;height:44px;border-radius:50%;border:0;background:#00B394;color:#fff;display:grid;place-items:center;flex-shrink:0}
.tts-t{flex:1;min-width:0}.tts-t b{display:block;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tts-t small{display:block;font-size:12px;opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tts-r{border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;border-radius:14px;height:32px;min-width:46px;font-size:13px;font-weight:700;flex-shrink:0}
.tts-x{border:0;background:transparent;color:#fff;width:36px;height:36px;font-size:16px;flex-shrink:0}
.say-on{outline:3px solid #FFC94D;outline-offset:2px;border-radius:10px}
.msg .escuchar{color:#007C6B;border-width:1px;min-height:28px;padding:0 9px;font-size:12px;gap:4px;margin-right:8px;vertical-align:middle}
.msg .escuchar svg{width:14px;height:14px}
.msg .say-on{outline:none;background:#FFF0B8;border-radius:4px;box-shadow:0 0 0 3px #FFF0B8}
.sheet-open .ttsbar{top:calc(10px + env(safe-area-inset-top,0px));bottom:auto;z-index:22}
.autoleer{opacity:1}.autoleer[aria-pressed="false"]{opacity:.6}`;
  document.head.appendChild(st);
  $('#ttsPlay').addEventListener('click', () => { if (TTS.playing) ttsPause(); else if (TTS.done) ttsFrom(0); else ttsFrom(TTS.i); });
  $('#ttsStop').addEventListener('click', ttsStop);
  $('#ttsRate').addEventListener('click', () => { const R = [1, 1.2, 1.5, 0.85]; TTS.rate = R[(R.indexOf(TTS.rate) + 1) % R.length]; store.set('ttsRate', TTS.rate); if (TTS.playing) ttsFrom(TTS.i); else ttsUI(); });
  if (SYN.onvoiceschanged !== undefined) SYN.onvoiceschanged = () => {};
  let unlocked = false;
  document.addEventListener('click', ev => { if (unlocked || ev.target.closest('.askbtn,#askSend')) return; unlocked = true; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; SYN.speak(u); } catch (_) {} }, true);
})();
function ttsVoice() {
  const vs = SYN.getVoices() || [], norm = l => String(l || '').replace('_', '-').toLowerCase();
  for (const l of ['es-uy', 'es-ar', 'es-419', 'es-us', 'es-mx', 'es-es']) { const v = vs.find(x => norm(x.lang) === l); if (v) return v; }
  return vs.find(x => /^es/i.test(x.lang)) || null;
}
function ttsFrom(i) {
  if (!SYN || !TTS.segs.length) return;
  if (typeof ASK !== 'undefined' && ASK.sr) stopRec(true);              // no grabar la propia voz del teléfono
  TTS.gen++; const gen = TTS.gen; SYN.cancel();
  TTS.i = i; TTS.playing = true; TTS.done = false;
  const v = ttsVoice();
  for (let k = i; k < TTS.segs.length; k++) {
    const u = new SpeechSynthesisUtterance(TTS.segs[k].t);
    u.lang = v ? v.lang : 'es-UY'; if (v) u.voice = v; u.rate = TTS.rate;
    u.onstart = () => { if (gen !== TTS.gen) return; TTS.i = k; ttsMark(); ttsUI(); };
    if (k === TTS.segs.length - 1) u.onend = () => { if (gen !== TTS.gen) return; TTS.playing = false; TTS.done = true; TTS.i = 0; ttsMark(true); ttsUI(); };
    SYN.speak(u);
  }
  ttsUI();
}
function ttsPause() { TTS.gen++; if (SYN) SYN.cancel(); TTS.playing = false; ttsUI(); }
function ttsStop() { TTS.gen++; if (SYN) SYN.cancel(); TTS.playing = false; TTS.done = false; TTS.segs = []; TTS.key = ''; ttsMark(true); ttsUI(); }
function trocear(t) { const fr = String(t).match(/[^.;:]+[.;:]*/g) || [t], out = []; let cur = '';
  fr.forEach(x => { x = x.trim(); if (!x) return; if ((cur + ' ' + x).length > 200 && cur) { out.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; });
  if (cur) out.push(cur); return out; }
function ttsPlay(key, label, segs) { segs = segs.flatMap(s => trocear(s.t).map(t => ({ t, sel: s.sel }))); if (!segs.length) return; TTS.key = key; TTS.label = label; TTS.segs = segs; ttsFrom(0); }
function ttsMark(clear) {
  document.querySelectorAll('.say-on').forEach(e => e.classList.remove('say-on'));
  if (clear) return; const s = TTS.segs[TTS.i]; if (!s || !s.sel) return;
  const el = document.querySelector(s.sel); if (el && !el.closest('[hidden]')) el.classList.add('say-on');
}
function ttsUI() {
  if (!SYN) return;
  const bar = $('#ttsBar'), on = TTS.segs.length > 0;
  bar.hidden = !on; document.body.style.paddingBottom = on ? '84px' : '';
  document.querySelectorAll('.escuchar').forEach(b => { const s = b.querySelector('span'); s.textContent = (on && b.dataset.tts === TTS.key) ? (TTS.playing ? 'Pausar' : 'Seguir') : 'Escuchar'; });
  if (!on) return;
  $('#ttsPlay').innerHTML = TTS.playing ? ICO_PAUSE : ICO_PLAY; $('#ttsPlay').setAttribute('aria-label', TTS.playing ? 'Pausar' : 'Reproducir');
  $('#ttsTit').textContent = TTS.label;
  $('#ttsSub').textContent = TTS.done ? 'Terminado · tocá ▶ para escuchar de nuevo' : (TTS.playing ? 'Escuchando' : 'En pausa') + ` · ${Math.min(TTS.i + 1, TTS.segs.length)} de ${TTS.segs.length}`;
  $('#ttsRate').textContent = String(TTS.rate).replace('.', ',') + 'x';
}
document.addEventListener('click', e => {
  const b = e.target.closest('.escuchar'); if (!b) return;
  const key = b.dataset.tts;
  if (TTS.key === key && TTS.segs.length) { if (TTS.playing) ttsPause(); else ttsFrom(TTS.done ? 0 : TTS.i); return; }
  if (key === 'ruta' && RUTA_NAV) ttsPlay('ruta', 'Ruta del ' + fechaLarga(RUTA_NAV.fecha).toLowerCase().replace(',', ''), guionRuta());
  else if (key.startsWith('farm') && cur) ttsPlay(key, cur.nombre, guionFarmacia(cur));
  else if (key.startsWith('ans:')) { const ti = Number(key.slice(4)), q = ASK.turns[ti - 1]; ttsPlay(key, 'Respuesta' + (q && q.role === 'user' ? ': ' + q.content.slice(0, 60) : ' del asistente'), guionRespuesta(ti)); }
});
// ---- textos para leer en voz alta
function hablar(s) {
  return String(s == null ? '' : s)
    .replace(/\bFCIA\.?\s*/gi, 'Farmacia ').replace(/\bN°\s*/g, 'número ')
    .replace(/\bOTC\b/g, 'O T C').replace(/([+\-−])?(\d+(?:[.,]\d+)?)\s?pp\b/g, (m, sg, n) => (sg === '-' || sg === '−' ? 'menos ' : sg === '+' ? 'más ' : '') + n + ' puntos')
    .replace(/([+\-−])?(\d+(?:[.,]\d+)?)\s?%/g, (m, sg, n) => (sg === '-' || sg === '−' ? 'menos ' : sg === '+' ? 'más ' : '') + n + ' por ciento')
    .replace(/\$\s?(\d+(?:,\d+)?)\s?M\b/g, '$1 millones de pesos').replace(/\$\s?(\d+(?:\.\d+)?)\s?mil\b/g, '$1 mil pesos').replace(/\$\s?([\d.]+)/g, '$1 pesos')
    .replace(/\bunid\./g, 'unidades').replace(/\bprod\./g, 'productos').replace(/\bvs\.?\s/g, 'contra ').replace(/\bpdv\b/g, 'puntos de venta')
    .replace(/([a-záéíóú])–([a-záéíóú])/gi, '$1 a $2').replace(/\s+-\s+/g, ', ').replace(/([a-záéíóúñ])-([a-záéíóúñ])/gi, '$1 $2').replace(/([a-záéíóú])\/([a-záéíóú])/gi, '$1 y $2')
    .replace(/\b[xX]\s?(\d)/g, 'por $1').replace(/\bmg\b/gi, 'miligramos').replace(/\bml\b/gi, 'mililitros').replace(/\b(\d+)\s?gr?\b\.?/g, '$1 gramos')
    .replace(/\bcomp\b\.?/gi, 'comprimidos').replace(/\bcaps\b\.?/gi, 'cápsulas').replace(/\bsob\b\.?/gi, 'sobres')
    .replace(/\b([A-ZÁÉÍÓÚÑ]{3,})\b/g, w => ['IVA', 'MAM'].includes(w) ? w : w.charAt(0) + w.slice(1).toLowerCase())
    .replace(/\b1 productos\b/g, '1 producto').replace(/\b1 días\b/g, '1 día')
    .replace(/·/g, ',').replace(/\s+/g, ' ').trim();
}
const NIV_H = { alta: 'Prioridad alta', media: 'Prioridad media', positiva: 'Una buena noticia' };
const dinero = v => v == null ? '' : Math.abs(v) >= 1e6 ? nf1.format(v / 1e6) + ' millones de pesos' : Math.abs(v) >= 1e3 ? nf0.format(v / 1e3) + ' mil pesos' : nf0.format(v) + ' pesos';
const pctH = (v, mas, menos) => v == null ? '' : nf0.format(Math.abs(v)) + ' por ciento ' + (v >= 0 ? mas : menos);
const diasH = d => d === 1 ? 'hace un día' : 'hace ' + d + ' días';
function kpiHablado(f) {
  if (f.sin_datos) return 'No tiene compras registradas en Venta Real desde enero de 2025.';
  const k = f.kpi || {};
  if (esFarmacia(f)) return `En lo que va de 2026 compró ${dinero(k.otc_ytd26)} en productos O T C${k.otc_var != null ? ', ' + pctH(k.otc_var, 'más', 'menos') + ' que en 2025' : ''}.${k.dias_otc != null ? ' La última compra fue ' + diasH(k.dias_otc) + '.' : ''}`;
  return `En agosto vendió ${nf0.format(k.unid || 0)} unidades de productos O T C de Megalabs. Está en el puesto ${k.rank} de ${k.n_suc} sucursales de ${TIPO[f.tipo]}.`;
}
function guionFarmacia(f) {
  const A = f.alertas || [], S = [];
  S.push({ t: hablar(`${f.nombre}. ${TIPO[f.tipo]}${Z[f.brick] ? ', en ' + zonaCorta(f.brick) : ''}.`) });
  S.push({ t: hablar(kpiHablado(f)), sel: '#fpanel .kpis' });
  if (!A.length) S.push({ t: 'No hay alertas para este punto de venta.' });
  else {
    S.push({ t: A.length === 1 ? 'Antes de entrar, hay una cosa para mirar.' : `Antes de entrar, hay ${A.length} cosas para mirar.` });
    A.forEach((a, ai) => S.push({ t: hablar(`${NIV_H[a.nivel] || ''}. ${a.titulo}. ${a.detalle}`), sel: `#fpanel .gitem[data-say="a${ai}"]` }));
  }
  const ped = f.pedido || [];
  if (ped.length) S.push({ t: hablar(`El pedido sugerido tiene ${ped.length} producto${ped.length > 1 ? 's' : ''}. Los primeros: ` + ped.slice(0, 3).map(q => `${(KIND[q.tipo] || q.tipo).toLowerCase()} ${P[q.art].n}${q.cant != null ? ', ' + q.cant + ' unidades' : ''}`).join('; ') + '.') });
  S.push({ t: 'Eso es todo para este punto de venta. Buena visita.' });
  return S;
}
function guionRuta() {
  const R = RUTA_NAV, fs = R.ids.map(fById), S = [];
  const zonas = new Map(); R.ids.forEach((id, i) => { const f = fById(id), b = zonaDe(f); if (!zonas.has(b)) zonas.set(b, []); zonas.get(b).push({ f, i }); });
  const al = fs.flatMap(f => f.alertas || []), altas = al.filter(a => a.nivel === 'alta').length, medias = al.filter(a => a.nivel === 'media').length;
  const ped = fs.flatMap(f => f.pedido || []);
  const ind = fs.filter(f => esFarmacia(f) && !f.sin_datos && f.kpi), c26 = ind.reduce((s, f) => s + (f.kpi.otc_ytd26 || 0), 0), c25 = ind.reduce((s, f) => s + (f.kpi.otc_ytd25 || 0), 0);
  S.push({ t: hablar(`Resumen de la ruta del ${fechaLarga(R.fecha).toLowerCase().replace(',', '')}: ${fs.length} puntos de venta en ${zonas.size} zona${zonas.size > 1 ? 's' : ''}.`), sel: '#rres .rr-head' });
  S.push({ t: hablar(`Hay ${altas} alerta${altas === 1 ? '' : 's'} de prioridad alta y ${medias} de prioridad media. El pedido sugerido suma ${ped.length} productos.` + (ind.length ? ` Las farmacias de la ruta llevan compradas ${dinero(c26)} en 2026${c25 ? ', ' + pctH(gr(c26, c25), 'más', 'menos') + ' que en 2025' : ''}.` : '')), sel: '#rres .kpis' });
  const G = panoramaGrupos(R.ids);
  if (G.length) {
    S.push({ t: 'Lo más importante de la ruta.' });
    G.forEach((g, gi) => S.push({ t: hablar(`${NIV_H[g.nivel]}. ${g.label}: ` + g.lista.map(it => `parada ${it.i + 1}, ${it.f.nombre}, ${it.txt.join(', ')}`).join('; ') + '.'), sel: `#rres .rr-it[data-say="g${gi}"]` }));
  }
  S.push({ t: 'Ahora, el contexto de las zonas.' });
  [...zonas.entries()].forEach(([b, items], zi) => {
    const paradas = items.map(({ i }) => i + 1).join(' y ');
    if (b === 'sin') { S.push({ t: `Parada${items.length > 1 ? 's' : ''} ${paradas}: sin datos de mercado de su zona.`, sel: `#rres .rr-z[data-say="z${zi}"]` }); return; }
    const z = Z[b], dif = z.share_meg - D.share_cartera;
    const brands = []; (z.cats || []).forEach(c => (c.marcas || []).forEach(m => { if ((m.venta || 0) > 0) brands.push(Object.assign({ cat: c }, m)); }));
    const baja = brands.filter(m => m.share >= 3 && m.delta_pp <= -1).sort((a, c) => a.delta_pp - c.delta_pp)[0];
    let t = `${zonaCorta(b)}, parada${items.length > 1 ? 's' : ''} ${paradas}. El share de Megalabs O T C en la zona es ${nf1.format(z.share_meg)} por ciento, ${nf1.format(Math.abs(dif))} puntos ${dif >= 0 ? 'por encima' : 'por debajo'} del promedio de tu cartera.`;
    if (baja) t += ` Atención: ${marca(baja.marca)} pierde ${nf1.format(Math.abs(baja.delta_pp))} puntos en ${catName(baja.cat.cat).toLowerCase()}` + (baja.cat.riser ? `; el que más gana es ${baja.cat.riser.producto}.` : '.');
    S.push({ t: hablar(t), sel: `#rres .rr-z[data-say="z${zi}"]` });
  });
  S.push({ t: 'Y ahora, farmacia por farmacia.' });
  fs.forEach((f, i) => {
    const A = (f.alertas || []).slice().sort((a, b) => ORD_NIV[a.nivel] - ORD_NIV[b.nivel]);
    let t = `Parada ${i + 1}: ${f.nombre}. ${kpiHablado(f)} `;
    t += A.length ? A.map(a => `${NIV_H[a.nivel]}: ${a.titulo}.`).join(' ') : 'No tiene alertas.';
    if ((f.pedido || []).length) t += ` Pedido sugerido: ${f.pedido.length} producto${f.pedido.length > 1 ? 's' : ''}.`;
    S.push({ t: hablar(t), sel: `#rres .rr-card[data-say="f${i}"]` });
  });
  S.push({ t: 'Fin del resumen de la ruta. Buena jornada.' });
  return S;
}


// ---- 3 · Farmacia
function openFicha(id){ const f=F.find(x=>x.id===id); if(!f) return; cur=f; curTab='resumen'; MST.farm=id; show('farm'); renderFarm(); }
function renderFarm(){
  const f=cur; if(!f) return;
  $('#pcard').innerHTML=`<span class="ptag">${TIPO[f.tipo]}${f.suc?' · sucursal '+f.suc:''}</span><h1>${esc(f.nombre)}</h1>
    <p>${f.brick?'Brick '+f.brick+' · '+esc(zonaCorta(f.brick)):'Sin brick asignado'}</p>
    <p>${f.zona_erp?'Zona ERP: '+esc(f.zona_erp)+' · ':''}${esc(f.depto||zonaDepto(f.brick))}${f.ruta?' · '+esc(f.ruta):''}</p>`;
  const esF=esFarmacia(f);
  const tabs=[['resumen','Resumen'],[esF?'compras':'ventas',esF?'Compras':'Ventas'],['marca','Marca'],['zona','Zona'],['pedido','Pedido']];
  $('#tabs').innerHTML=tabs.map(([k,l])=>`<button class="tab" role="tab" data-k="${k}" aria-selected="${k===curTab}">${l}</button>`).join('');
  renderFarmTab(); renderRutaBar();
}
$('#tabs').addEventListener('click',e=>{ const b=e.target.closest('.tab'); if(!b) return; if(b.dataset.k==='marca'){ openMarcas(); return; } curTab=b.dataset.k; document.querySelectorAll('#tabs .tab').forEach(t=>t.setAttribute('aria-selected',t===b)); renderFarmTab(); });
function renderFarmTab(){
  const f=cur, p=$('#fpanel');
  if(curTab==='resumen') p.innerHTML=resumenV2(f);
  else if(curTab==='compras') p.innerHTML=compras(f);
  else if(curTab==='ventas') p.innerHTML=ventas(f);
  else if(curTab==='zona') p.innerHTML=zona(f);
  else p.innerHTML=pedido(f);
  p.insertAdjacentHTML('beforeend', fuentes());
  p.querySelectorAll('[data-chart]').forEach(bindChart);
  const cp=p.querySelector('#copiar'); if(cp) cp.addEventListener('click',copiarPedido);
  const am=p.querySelector('#analizar'); if(am) am.addEventListener('click',()=>openMarcas());
}
const fuentes=()=>`<div class="foot"><span>Fuentes: Venta Real (al ${D.corte.venta_real}) · CloseUp Bricks (${D.corte.closeup}) · Sell-Out Farmashop y San Roque (${D.corte.cadenas})</span><span>Cartera de ${esc(D.vendedor)}${SES&&SES.rol!=='vendedor'?' · vista de '+esc(SES.nombre):''}</span></div>`;
function greenPanel(f){
  const A=f.alertas||[], lbl={alta:'Alta',media:'Media',positiva:'Bien'};
  return `<section class="green"><div class="green-h"><h2>Qué mirar antes de entrar</h2>${btnEscuchar('farm:'+f.id)}</div>${A.length?A.map((a,ai)=>`<div class="gitem" data-say="a${ai}"><span class="gpill ${a.nivel}">${lbl[a.nivel]}</span><b>${esc(a.titulo)}</b><p>${esc(a.detalle)} <em>${esc(a.fuente)}</em></p></div>`).join(''):'<p class="gempty">No hay alertas para este punto de venta.</p>'}</section>`;
}
const BTN_MARCAS=`<button class="bigbtn" id="analizar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-7M2 20h20"></path></svg>Analizar por marcas</button>`;
function resumenV2(f){
  if(f.sin_datos) return `<div class="empty">Este punto de venta no tiene compras registradas en Venta Real desde enero de 2025${f.tipo==='NATAL'?' (probablemente compra por la central de la cadena)':''}. Igual podés ver el mercado de su zona por marca.</div>${greenPanel(f)}${BTN_MARCAS}`;
  const k=f.kpi;
  if(esFarmacia(f)) return `<div class="kpis">
      <div class="kpi"><span class="l">Compras OTC ene-ago 2026</span><span class="v num">${moneyC(k.otc_ytd26)}</span><span class="s num"><span class="${cls(k.otc_var)}">${pct(k.otc_var)}</span> vs. 2025</span></div>
      <div class="kpi"><span class="l">Último trimestre (jun-ago)</span><span class="v num">${moneyC(k.otc_q26)}</span><span class="s num"><span class="${cls(k.otc_q_var)}">${pct(k.otc_q_var)}</span> vs. 2025</span></div>
      <div class="kpi"><span class="l">Última compra OTC</span><span class="v num">${k.dias_otc==null?'–':k.dias_otc+(k.dias_otc===1?' día':' días')}</span><span class="s">${fdate(k.ult_otc)}</span></div>
      <div class="kpi"><span class="l">Total Megalabs 2026</span><span class="v num">${moneyC(k.total_ytd26)}</span><span class="s num"><span class="${cls(k.total_var)}">${pct(k.total_var)}</span> todas las líneas</span></div>
    </div>
    ${greenPanel(f)}
    <section class="sec"><div class="sec-h"><h2>Compras OTC por mes</h2><span class="src">Venta Real · $ netos</span></div>
      <div class="legend"><span><i style="background:var(--series-prev)"></i>2025</span><span><i style="background:var(--brand)"></i>2026</span></div>
      <div class="chart" data-chart="otc">${chartMensual(f.mensual)}</div>
      <div class="readout num"></div><span class="small">Septiembre 2026 incluye compras hasta el ${D.corte.venta_real}.</span></section>
    ${BTN_MARCAS}`;
  return `<div class="kpis">
      <div class="kpi"><span class="l">Unidades en agosto</span><span class="v num">${n0(k.unid)}</span><span class="s">productos OTC Megalabs</span></div>
      <div class="kpi"><span class="l">Venta agosto (sin IVA)</span><span class="v num">${moneyC(k.venta)}</span><span class="s">sell-out ${TIPO[f.tipo]}</span></div>
      <div class="kpi"><span class="l">Contra sucursal promedio</span><span class="v num ${k.indice>=100?'up':'down'}">${k.indice}</span><span class="s">100 = promedio (${n0(k.prom_cadena)} unid.)</span></div>
      <div class="kpi"><span class="l">Puesto en la cadena</span><span class="v num">${k.rank}<span style="font-size:15px;color:var(--muted)"> de ${k.n_suc}</span></span><span class="s">por unidades en agosto</span></div>
    </div>
    ${greenPanel(f)}
    <section class="sec"><div class="sec-h"><h2>Ventas por marca en agosto</h2><span class="src">Sell-Out ${TIPO[f.tipo]} · unidades</span></div>${barrasMarca(f.marcas)}</section>
    ${BTN_MARCAS}`;
}
// enlaces desde Compras (marca) hacia la pantalla de marcas
document.addEventListener('click',e=>{ const b=e.target.closest('#fpanel [data-marca]'); if(!b) return; curBrand=b.dataset.marca; curCat=null; openMarcas(); });

// ---- 4 · Marcas
function openMarcas(){ if(!cur) return; show('marca'); renderMarca(); }
const ICON={
  box:'<path d="M21 8l-9-5-9 5 9 5 9-5z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path>',
  pie:'<path d="M21 12A9 9 0 1 1 12 3v9z"></path><path d="M15 3.4A9 9 0 0 1 20.6 9H15z"></path>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"></path><path d="M9 4v14M15 6v14"></path><path d="M12 9.5s-1.6-1.4-1.6-2.6a1.6 1.6 0 0 1 3.2 0c0 1.2-1.6 2.6-1.6 2.6z"></path>',
  layers:'<path d="M12 3l9 5-9 5-9-5 9-5z"></path><path d="M3 13l9 5 9-5"></path>',
  trend:'<path d="M3 17l6-6 4 4 8-8"></path><path d="M15 7h6v6"></path>',
  store:'<path d="M3.5 10.5 5 6h14l1.5 4.5"></path><path d="M4.5 10.5V21h15V10.5"></path><path d="M3 10.5h18"></path><path d="M10 21v-5h4v5"></path>'
};
const svgI=(k,w=34)=>`<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
const ARR=v=>v==null?'':(v<0?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--down)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7l10 10"></path><path d="M17 9v8H9"></path></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--up)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M9 7h8v8"></path></svg>');
const CAL='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path></svg>';
const sp=(v,txt)=>`<span class="${cls(v)}">${txt}</span>`;
function renderMarca(){
  const f=cur; $('#mback').textContent=f.nombre;
  const bl=brandsFor(f); if(!curBrand||!bl.includes(curBrand)) curBrand=bl[0];
  $('#bchips').innerHTML=bl.map(k=>`<button class="bchip" data-b="${k}" aria-pressed="${k===curBrand}">${esc(marca(k))}</button>`).join('');
  const sel=$('#bchips [aria-pressed="true"]'); if(sel) sel.scrollIntoView({block:'nearest',inline:'nearest'});
  $('#mpanel').innerHTML=marcaScreen(f)+fuentes();
  $('#mpanel').querySelectorAll('[data-chart]').forEach(bindChart);
}
$('#bchips').addEventListener('click',e=>{ const b=e.target.closest('.bchip'); if(!b) return; curBrand=b.dataset.b; curCat=null; renderMarca(); });
$('#mpanel').addEventListener('click',e=>{ const c=e.target.closest('[data-cat]'); if(!c) return; curCat=c.dataset.cat; const y=window.scrollY; renderMarca(); window.scrollTo(0,y); });

function marcaScreen(f){
  const b=curBrand, x=brandCtx(f,b), mb=marca(b), esF=esFarmacia(f);
  let h='';
  // Lo más importante
  const I=[];
  if(esF && x.u26!=null){
    if(x.u25>0||x.u26>0) I.push(['box',`<b>${esc(mb)}: ${x.u25>0?sp(x.u26-x.u25,pct(gr(x.u26,x.u25)))+' en unidades (vs 2025).':'empezó a comprarse en 2026.'}</b>${x.row?`<small>Mercado de ${esc(catName(x.cat).toLowerCase())}: ${sp(x.mktG,pct(x.mktG))} (año móvil).</small>`:''}`,'Venta Real · CloseUp']);
    else I.push(['box',`<b>Esta farmacia no compró ${esc(mb)} desde enero de 2025.</b>${x.row?`<small>En la zona, ${esc(mb)} vende ${n0(x.brU)} unid. al año.</small>`:''}`,'Venta Real · CloseUp']);
  } else if(!esF && x.ps){
    I.push(['store',`<b>${esc(mb)}: ${n0(x.uS)} unid. en agosto.</b><small>Índice ${x.idx==null?'–':sp(x.idx-100,nf0.format(x.idx))} contra la sucursal promedio de ${TIPO[f.tipo]}${x.sinStock.length?`; ${x.sinStock.length} presentación${x.sinStock.length>1?'es':''} sin stock`:''}.</small>`,'Sell-Out '+TIPO[f.tipo]]);
  }
  if(x.row){
    const d=x.sh[0][1]-x.sh[0][0];
    I.push(['pie',`<b>Share de ${esc(mb)} en la zona: ${nf1.format(x.sh[0][1])}% (${sp(d,pp(d))}).</b><small>Puesto ${x.rank} de ${x.nRank} en la categoría.</small>`,'CloseUp']);
    if(x.cartPos) I.push(['map',`<b>Este brick está ${x.cartPos}º de ${x.cart.length} en tu cartera por share de ${esc(mb)}.</b><small>(promedio de la cartera: ${nf1.format(x.cartAvg)}%).</small>`,'CloseUp']);
    const gap=(x.mix||[]).filter(m=>m.z-m.f>=10).sort((a,c)=>(c.z-c.f)-(a.z-a.f))[0];
    if(gap && (esF? x.u26>0 : true)) I.push(['layers',`<b>${esc(P[gap.a].n)}: ${nf0.format(gap.z)}% de la marca en la zona y ${nf0.format(gap.f)}% ${esF?'en esta farmacia':'en esta sucursal'}.</b><small>Es la presentación con más espacio para proponer.</small>`,'CloseUp · '+(esF?'Venta Real':'Sell-Out')]);
    if(x.riser) I.push(['trend',`<b>Competidor que más gana: ${esc(x.riser.producto)}.</b><small>${esc(x.riser.corp)}, ${pp(x.riser.delta_pp)} de share en el año.</small>`,'CloseUp']);
  } else if(Z[f.brick]) I.push(['pie',`<b>CloseUp no registra ventas de ${esc(mb)} en este brick.</b>`,'CloseUp']);
  h+=`<h2 class="mhead">Lo más importante</h2>`+I.map(([ic,t,s])=>`<div class="icard">${svgI(ic)}<div class="t">${t}</div><div class="f">${esc(s)}</div></div>`).join('');
  // Detalles
  h+=`<h2 class="mhead">Detalles ${esc(mb)}</h2>`;
  if(esF){
    if(f.sin_datos||x.u26==null) h+=`<div class="empty">Sin compras registradas en Venta Real.</div>`;
    else {
      const gu=gr(x.u26,x.u25), gv=gr(x.v26,x.v25);
      h+=`<div class="dcard"><span class="l">Unidades (ene-ago 2026)</span><span class="v num">${n0(x.u26)}</span><span class="s num">${x.u25>0?ARR(gu)+sp(gu,pct(gu))+` vs 2025 (${n0(x.u25)})`:'sin compras en ene-ago 2025'}</span></div>
        <div class="dcard"><span class="l">Compras (ene-ago 2026)</span><span class="v num">${moneyC(x.v26)}</span><span class="s num">${x.v25>0?ARR(gv)+sp(gv,pct(gv))+' vs 2025':'–'}</span></div>
        <div class="dcard"><span class="l">Última compra de la marca</span><span class="v num">${x.dias==null?'–':x.dias+(x.dias===1?' día':' días')}</span><span class="s">${CAL}${fdate(x.ult)}</span></div>
        <div class="dcard"><span class="l">Meses con compra</span><span class="v num">${x.meses12} de 12</span><span class="s">${CAL}sep-25 a ago-26</span></div>`;
      const map={}; MI.forEach((m,i)=>map[m]=x.mm[i]);
      const rows=x.sk.map(a=>({a,u:(x.perSku[a]||{u12:0}).u12,p:f.productos.find(p=>String(p.art)===a)})).sort((r1,r2)=>r2.u-r1.u);
      const mx=Math.max(1,...rows.map(r=>r.u));
      h+=`<section class="sec"><div class="sec-h"><h2>Unidades por mes</h2><span class="src">Venta Real · cajas</span></div>
          <div class="legend"><span><i style="background:var(--series-prev)"></i>2025</span><span><i style="background:var(--brand)"></i>2026</span></div>
          <div class="chart" data-chart="marca">${chartYoY(map,'marca',{label:'Unidades de '+mb+' por mes',axis:v=>nf0.format(v),val:v=>n0(v)+' unid.'})}</div>
          <div class="readout num"></div><span class="small">Septiembre 2026 incluye compras hasta el ${D.corte.venta_real}.</span></section>
        <section class="sec"><div class="sec-h"><h2>Presentaciones que compra</h2><span class="src">Últimos 12 meses · cajas</span></div>
          ${hrows(rows.map(r=>({label:esc(P[r.a].n),w:r.u/mx*100,cls:r.u>0?'b-sel':'b-oth',val:r.u>0?n0(r.u):'<span class="kind incorporar" style="margin:0">no compra</span>',sub:r.p&&r.p.dias!=null?'hace '+r.p.dias+' d':null,title:P[r.a].n})))}</section>`;
    }
  } else if(!f.sin_datos){
    const fs=f.tipo==='FARMASHOP';
    h+=`<div class="dcard"><span class="l">Unidades (agosto 2026)</span><span class="v num">${n0(x.uS)}</span><span class="s num">promedio ${TIPO[f.tipo]}: ${nf1.format(x.uC)}</span></div>
      <div class="dcard"><span class="l">Contra la sucursal promedio</span><span class="v num">${x.idx==null?'–':sp(x.idx-100,nf0.format(x.idx))}</span><span class="s">100 = sucursal promedio de ${TIPO[f.tipo]}</span></div>
      <div class="dcard"><span class="l">Presentaciones con venta en agosto</span><span class="v num">${x.ps.filter(p=>(p.u||0)>0).length} de ${x.sk.length}</span><span class="s">${fs?x.sinStock.length+' sin stock al cierre':'San Roque no informa stock'}</span></div>`;
    const ps=x.ps.slice().sort((p1,p2)=>(p2.u||0)-(p1.u||0)||p2.u_cadena-p1.u_cadena);
    const mx=Math.max(1,...ps.map(p=>Math.max(p.u||0,p.u_cadena||0)));
    h+=`<section class="sec"><div class="sec-h"><h2>Presentaciones en agosto</h2><span class="src">Sell-Out ${TIPO[f.tipo]}</span></div>
      <div class="legend"><span><i style="background:var(--brand)"></i>Esta sucursal</span><span><i style="background:var(--series-prev)"></i>Sucursal promedio</span></div>
      <div class="hrows">${ps.map(p=>`<div class="hrow2"><span class="hl">${esc(P[p.art].n)}${fs&&p.listado&&(p.stock||0)<=0?' <span class="kind recuperar">sin stock</span>':''}</span>
        <div class="pair"><span class="hbar b-sel" style="width:${Math.max(1.5,(p.u||0)/mx*100)}%"></span><span class="hbar b-oth" style="width:${Math.max(1.5,(p.u_cadena||0)/mx*100)}%"></span></div>
        <span class="hv num">${n0(p.u)}<small>${nf1.format(p.u_cadena||0)}${fs&&p.stock!=null?' · stock '+n0(p.stock):''}</small></span></div>`).join('')||'<div class="empty">La cadena no registra ventas de esta marca.</div>'}</div></section>`;
  }
  // En la zona
  h+=`<h2 class="mhead">${esc(mb)} en la zona</h2>`;
  if(!Z[f.brick]) h+=`<div class="empty">Este punto de venta no tiene brick asignado, así que no hay datos de mercado de su zona.</div>`;
  else if(!x.row) h+=`<div class="empty">CloseUp no registra ventas de ${esc(mb)} en el brick ${f.brick}.</div>`;
  else {
    const T=x.C.tot, ranked=x.C.rows.filter(r=>!r.o).sort((r1,r2)=>r2.v[7]-r1.v[7]);
    let top=ranked.slice(0,8); if(!top.includes(x.row)) top=top.concat([x.row]);
    const mxs=Math.max(...top.map(r=>r.v[7]/T[7]*100));
    h+=`${x.cats.length>1?`<div class="catchips" role="group" aria-label="Categoría">${x.cats.map(c=>`<button class="catchip" data-cat="${c}" aria-pressed="${c===x.cat}">${esc(catName(c))}</button>`).join('')}</div>`:`<span class="small">${esc(catName(x.cat))} · brick ${f.brick}</span>`}
      <div class="kpis">
        <div class="kpi"><span class="l">Share año móvil</span><span class="v num">${nf1.format(x.sh[0][1])}%</span><span class="s num">${sp(x.sh[0][1]-x.sh[0][0],pp(x.sh[0][1]-x.sh[0][0]))} vs. año ant.</span></div>
        <div class="kpi"><span class="l">Share último trimestre</span><span class="v num">${nf1.format(x.sh[1][1])}%</span><span class="s num">${sp(x.sh[1][1]-x.sh[1][0],pp(x.sh[1][1]-x.sh[1][0]))} vs. año ant.</span></div>
        <div class="kpi"><span class="l">Mercado de la categoría</span><span class="v num">${moneyC(x.mkt)}</span><span class="s num">${sp(x.mktG,pct(x.mktG))} año móvil</span></div>
        <div class="kpi"><span class="l">${esc(mb)} en la zona</span><span class="v num">${n0(x.brU)}<span style="font-size:14px;color:var(--muted)"> unid.</span></span><span class="s num">${sp(x.brUG,pct(x.brUG))} año móvil</span></div>
      </div>
      <section class="sec"><div class="sec-h"><h2>Share por período</h2><span class="src">CloseUp · % del mercado en $</span></div>
        <div class="legend"><span><i style="background:var(--series-prev)"></i>Año anterior</span><span><i style="background:var(--brand)"></i>Actual (a julio 2026)</span></div>
        <div class="chart">${sharePeriods(x.sh)}</div>
        <span class="small">Si el último trimestre y el último mes superan al año móvil, la marca viene ganando terreno.</span></section>
      <section class="sec"><div class="sec-h"><h2>Ranking de ${esc(catName(x.cat).toLowerCase())}</h2><span class="src">Share año móvil · crec. en $</span></div>
        <div class="legend"><span><i style="background:var(--brand)"></i>${esc(mb)}</span><span><i style="background:var(--series-grp)"></i>Grupo Megalabs</span><span><i style="background:var(--series-prev)"></i>Competidores</span></div>
        ${hrows(top.map(r=>{ const s=r.v[7]/T[7]*100, g=gr(r.v[7],r.v[6]); return {label:esc(r.b?marca(r.b):r.p),tag:(r.g&&r.b!==x.b?'<span class="g">GRUPO</span>':''),w:s/mxs*100,cls:r===x.row?'b-sel':(r.g?'b-grp':'b-oth'),val:nf1.format(s)+'%',sub:g==null?'nuevo':pct(g),subCls:cls(g),title:(r.c||'')}; }))}
        ${x.riser?`<span class="small">Competidor que más gana: <b style="color:var(--ink)">${esc(x.riser.producto)}</b> (${esc(x.riser.corp)}), ${pp(x.riser.delta_pp)} en el año.</span>`:''}</section>`;
    if(x.mix&&x.mix.length){
      const mxm=Math.max(1,...x.mix.map(m=>Math.max(m.z,m.f)));
      h+=`<section class="sec"><div class="sec-h"><h2>Presentaciones: zona contra ${esF?'farmacia':'sucursal'}</h2><span class="src">% de la marca en unidades</span></div>
        <div class="legend"><span><i style="background:var(--series-zone)"></i>Zona (CloseUp, año móvil)</span><span><i style="background:var(--brand)"></i>${esF?'Farmacia (Venta Real, 12 meses)':'Sucursal (agosto)'}</span></div>
        <div class="hrows">${x.mix.map(m=>`<div class="hrow2"><span class="hl">${esc(P[m.a].n)}</span><div class="pair"><span class="hbar b-zone" style="width:${Math.max(1.5,m.z/mxm*100)}%"></span><span class="hbar b-sel" style="width:${Math.max(1.5,m.f/mxm*100)}%"></span></div><span class="hv num">${nf0.format(m.z)}%<small>${nf0.format(m.f)}%</small></span></div>`).join('')}</div>
        <span class="small">Cuando una presentación pesa mucho más en la zona que en ${esF?'la farmacia':'la sucursal'}, conviene proponerla.</span></section>`;
    }
    const mxc=Math.max(...x.cart.map(c=>c.s),1);
    h+=`<section class="sec"><div class="sec-h"><h2>Share de ${esc(mb)} en tu cartera</h2><span class="src">${esc(catName(x.cat))} · ${x.cart.length} bricks</span></div>
      <span class="small">Promedio de la cartera: <b style="color:var(--ink)">${nf1.format(x.cartAvg)}%</b>. Este brick está ${x.cartPos}º de ${x.cart.length}.</span>
      ${hrows(x.cart.map(c=>({label:esc(zonaCorta(c.k))+(c.k===String(f.brick)?' <span class="g" style="color:var(--brand-strong)">ESTA ZONA</span>':''),w:c.s/mxc*100,cls:c.k===String(f.brick)?'b-sel':'b-oth',val:nf1.format(c.s)+'%',title:'Brick '+c.k})))}</section>`;
  }
  if(Z[f.brick]){
    const agg={}; x.chains.forEach(c=>c.productos.forEach(p=>{ if(P[p.art].m!==b) return; const a=agg[p.art]||(agg[p.art]={u:0,st:0,hasSt:false}); a.u+=p.u||0; if(p.stock!=null){a.st+=p.stock;a.hasSt=true;} }));
    const rows=Object.entries(agg).filter(([a,v])=>v.u>0||v.st>0).sort((r1,r2)=>r2[1].u-r1[1].u);
    h+=`<section class="sec"><div class="sec-h"><h2>${esc(mb)} en las cadenas de la zona</h2><span class="src">Sell-Out agosto 2026</span></div>
      ${x.chains.length?`<span class="small">${x.chains.map(c=>esc(c.nombre)).join(' · ')}</span>
      ${rows.length?`<div class="tscroll"><table><thead><tr><th>Presentación</th><th class="r">Unid. ago</th><th class="r">Stock Farmashop</th></tr></thead><tbody>${rows.map(([a,v])=>`<tr><td>${esc(P[a].n)}</td><td class="r num" style="font-weight:700">${n0(v.u)}</td><td class="r num">${v.hasSt?n0(v.st):'–'}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty">Las sucursales de la zona no vendieron ${esc(mb)} en agosto.</div>`}`
      :`<div class="empty">No hay otras sucursales de Farmashop ni San Roque de tu cartera en este brick.</div>`}</section>`;
  }
  return h;
}



// ================= Asistente: preguntas habladas o escritas =================
const ASK={turns:[], busy:false, ctl:null, tools:false, mode:'', clickOnly:false, wasHold:false, discard:false, sr:null, srBlocked:false, recTxt:'', recStart:0, timer:null, holding:false};
const MIC='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path></svg>';
const SEND='<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"></path></svg>';

const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\bfcia\b\.?/g,' ').replace(/\bfarmacia\b/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function findFarm(q){
  if(!q) return null; const s=String(q);
  let f=F.find(x=>x.id===s); if(f) return f;
  const n=norm(s); if(!n) return null;
  f=F.find(x=>norm(x.nombre)===n); if(f) return f;
  f=F.find(x=>norm(x.nombre).includes(n)||n.includes(norm(x.nombre))); if(f) return f;
  const tk=n.split(' ').filter(t=>t.length>2); let best=null,bs=0;
  F.forEach(x=>{ const nn=norm(x.nombre); const sc=tk.filter(t=>nn.includes(t)).length; if(sc>bs){bs=sc;best=x;} });
  return best;
}
function findBrand(q){ const n=norm(q).replace(/\s/g,''); if(!n) return null; return Object.keys(MARCA).find(k=>{ const a=norm(k).replace(/\s/g,''), b=norm(marca(k)).replace(/\s/g,''); return a===n||b===n||n.includes(a)||n.includes(b)||a.includes(n)||b.includes(n); })||null; }

const r1=v=>v==null?null:Math.round(v*10)/10, r0=v=>v==null?null:Math.round(v);
function farmaDetail(f){
  const d={id:f.id,nombre:f.nombre,tipo:TIPO[f.tipo],brick:f.brick||null,zona:f.brick?zonaCorta(f.brick):null,zona_erp:f.zona_erp||null,ruta:f.ruta||null};
  d.alertas=(f.alertas||[]).map(a=>`[${a.nivel}] ${a.titulo}: ${a.detalle} (${a.fuente})`);
  if(f.sin_datos){ d.nota='Sin compras registradas en Venta Real desde ene-2025.'; return d; }
  const k=f.kpi;
  if(esFarmacia(f)){
    d.compras={otc_ene_ago_2026:k.otc_ytd26,otc_ene_ago_2025:k.otc_ytd25,var_pct:k.otc_var,ult_trim_2026:k.otc_q26,var_trim_pct:k.otc_q_var,ultima_compra_otc:k.ult_otc,dias_sin_compra_otc:k.dias_otc,total_megalabs_2026:k.total_ytd26,var_total_pct:k.total_var};
    d.marcas=(f.marcas||[]).filter(m=>(m.v26||0)||(m.v25||0)).map(m=>({marca:marca(m.marca),compras_2026:m.v26,var_pct:m.var,peso_farmacia_pct:m.mix,peso_zona_pct:m.mix_zona}));
    d.dejo_de_comprar=(f.productos||[]).filter(p=>p.estado==='dejo').map(p=>P[p.art].n);
    d.top_productos_12m=(f.productos||[]).filter(p=>p.u12>0).sort((a,b)=>b.u12-a.u12).slice(0,10).map(p=>`${P[p.art].n}: ${p.u12} unid. (última hace ${p.dias} d)`);
  } else {
    d.sellout_agosto={unidades:k.unid,venta_sin_iva:k.venta,indice_vs_sucursal_promedio:k.indice,puesto:k.rank,de:k.n_suc};
    d.top_productos_agosto=(f.productos||[]).filter(p=>p.u>0).sort((a,b)=>b.u-a.u).slice(0,10).map(p=>`${P[p.art].n}: ${p.u} unid.${p.stock!=null?' stock '+p.stock:''}`);
    if(f.tipo==='FARMASHOP') d.sin_stock=(f.productos||[]).filter(p=>p.listado&&(p.stock||0)<=0&&p.u_cadena>=1).map(p=>P[p.art].n);
  }
  d.pedido_sugerido=(f.pedido||[]).map(q=>`${q.tipo}: ${P[q.art].n}${q.cant!=null?' x'+q.cant:''} (${q.motivo})`);
  return d;
}
function brandSummary(f,b){
  const x=brandCtx(f,b), s={marca:marca(b),punto_de_venta:f.nombre};
  if(esFarmacia(f)&&x.u26!=null) s.en_la_farmacia={unidades_ene_ago_2026:x.u26,unidades_ene_ago_2025:x.u25,compras_2026:r0(x.v26),compras_2025:r0(x.v25),ultima_compra:x.ult,dias:x.dias,meses_con_compra_12:x.meses12,presentaciones_12m:x.sk.map(a=>`${P[a].n}: ${(x.perSku[a]||{u12:0}).u12}`)};
  if(!esFarmacia(f)&&x.ps) s.en_la_sucursal_agosto={unidades:x.uS,promedio_cadena:r1(x.uC),indice:r0(x.idx),sin_stock:x.sinStock.map(p=>P[p.art].n)};
  if(x.row){
    const T=x.C.tot;
    s.en_la_zona={categoria:catName(x.cat),otras_categorias:x.cats.filter(c=>c!==x.cat).map(catName),share_anio_movil:r1(x.sh[0][1]),share_anio_anterior:r1(x.sh[0][0]),share_ultimo_trimestre:r1(x.sh[1][1]),share_trimestre_anio_ant:r1(x.sh[1][0]),share_ultimo_mes:r1(x.sh[2][1]),mercado_categoria_mat:x.mkt,crec_mercado_pct:r1(x.mktG),unidades_marca_mat:x.brU,crec_marca_unid_pct:r1(x.brUG),puesto:x.rank,de:x.nRank,
      ranking:x.C.rows.filter(r=>!r.o).sort((a,c)=>c.v[7]-a.v[7]).slice(0,6).map(r=>`${r.b?marca(r.b):r.p}${r.g?' (Grupo)':''}: ${r1(r.v[7]/T[7]*100)}%`),
      competidor_que_mas_gana:x.riser?`${x.riser.producto} (${x.riser.corp}) ${x.riser.delta_pp} pp`:null,
      mix_presentaciones:(x.mix||[]).map(m=>`${P[m.a].n}: zona ${r0(m.z)}% / ${esFarmacia(f)?'farmacia':'sucursal'} ${r0(m.f)}%`)};
    s.en_tu_cartera={puesto_del_brick:x.cartPos,de:x.cart.length,share_promedio_cartera:r1(x.cartAvg)};
  }
  return s;
}
function zonaSummary(b){
  const z=Z[b]; if(!z) return {error:'Brick no encontrado'};
  return {brick:b,zona:zonaCorta(b),share_megalabs_otc:z.share_meg,share_promedio_cartera:D.share_cartera,
    categorias:z.cats.slice(0,10).map(c=>({categoria:catName(c.cat),mercado_mat:c.mercado,crec_pct:c.crec,marcas:c.marcas.filter(m=>m.share>0).map(m=>`${marca(m.marca)} ${m.share}% (${m.delta_pp>0?'+':''}${m.delta_pp} pp)`),lider:c.top[0]?`${c.top[0].producto} ${c.top[0].share}%`:null,competidor_que_mas_gana:c.riser?`${c.riser.producto} ${c.riser.delta_pp} pp`:null})),
    cadenas:(z.cadenas.sucursales||[]).map(s=>`${s.nombre}: ${s.unid} unid. ago`)};
}
function carteraLines(){
  return F.map(f=>{ const k=f.kpi||{}; const al=(f.alertas||[]).filter(a=>a.nivel!=='positiva').map(a=>a.titulo).join('; ');
    const m = f.sin_datos ? 'sin datos' : esFarmacia(f) ? `OTC ene-ago26 $${r0(k.otc_ytd26)} (${k.otc_var==null?'s/d':(k.otc_var>0?'+':'')+r0(k.otc_var)+'%'}), ${k.dias_otc==null?'sin compras OTC':k.dias_otc+' d sin comprar OTC'}` : `ago ${k.unid} unid., índice ${k.indice}`;
    return `${f.id} | ${f.nombre} | ${TIPO[f.tipo]} | ${f.brick?f.brick+' '+zonaCorta(f.brick):'sin brick'} | ${m} | ${al||'sin alertas'}`; }).join('\n');
}
const hoy=()=>new Date().toLocaleDateString('es-UY',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const quien=()=>SES&&SES.rol!=='vendedor' ? `Le respondés a ${SES.nombre} (${ROL[SES.rol]||SES.rol} de Megalabs), que está revisando la cartera del vendedor ${D.vendedor}. Puede preguntar desde el celular, muchas veces` : `Le respondés al vendedor ${D.vendedor}, que suele preguntar en la calle, desde el celular y muchas veces`;
function rulesTurn(){
  const ctx = (screen==='marca'&&cur) ? `Está mirando la marca ${marca(curBrand)} en ${cur.nombre} (id ${cur.id}).` : (screen==='farm'&&cur) ? `Está en la ficha de ${cur.nombre} (id ${cur.id}).` : (screen==='ruta'&&RUTA_NAV) ? `Está en el resumen de su ruta del ${fechaLarga(RUTA_NAV.fecha).toLowerCase()} (${RUTA_NAV.ids.length} farmacias, en orden de visita).` : 'Está en la pantalla de inicio, eligiendo qué farmacia visitar.';
  let s=`Sos SmartBrick, el asistente de visitas a farmacias de Megalabs Uruguay. ${quien()} dictando por voz (puede haber errores de transcripción en nombres de farmacias o marcas: interpretalos con criterio).
Reglas:
- Español rioplatense, directo y accionable. Máximo 6 líneas o 5 viñetas cortas ("- "). Usá **negrita** solo para lo clave.
- Usá SOLO los datos de abajo (incluidos los DATOS ADICIONALES, si vienen). Si un dato no está, decilo; no inventes cifras.
- Cuando des una cifra, nombrá la fuente entre paréntesis: Venta Real (compras de la farmacia a Megalabs, $ netos y unidades, al ${D.corte.venta_real}), CloseUp (mercado por brick: año móvil, último trimestre y mes a jul-26, contra el año anterior) o Sell-Out (ventas de Farmashop y San Roque, ago-26).
- Celsius, Spefar, Servimedic, Haymann y Dispert son del Grupo Megalabs: no son competencia.
- Si la pregunta es ambigua, respondé lo más probable y ofrecé en una línea la alternativa.
Contexto: ${ctx} Hoy es ${hoy()}.
${rutaCtx()}Marcas OTC de Megalabs: ${Object.keys(MARCA).map(marca).join(', ')}.

CARTERA (id | nombre | tipo | brick y zona | compras/ventas | alertas):
${carteraLines()}`;
  if(cur && (screen==='farm'||screen==='marca')) s+=`\n\nPUNTO DE VENTA EN PANTALLA:\n${JSON.stringify(farmaDetail(cur))}`;
  if(screen==='ruta'&&RUTA_NAV) s+=`\n\nPUNTOS DE VENTA DE LA RUTA (en orden de visita):\n${RUTA_NAV.ids.slice(0,12).map((id,i)=>(i+1)+'. '+JSON.stringify(farmaDetail(fById(id)))).join('\n')}`;
  if(cur && screen==='marca') s+=`\n\nMARCA EN PANTALLA:\n${JSON.stringify(brandSummary(cur,curBrand))}`;
  return s;
}
// ---- Contexto extra según lo que menciona la pregunta (farmacias, marcas, zonas)
const STOPW=new Set(['del','los','las','san','santa','farmashop','roque','natal','que','con','por','para','como','cual','cuales','esta','este','tiene','zona','marca','vende','compra','hoy']);
const numTok=t=>/^\d+$/.test(t)?String(parseInt(t,10)):t;
const qTokens=q=>new Set(norm(q).split(' ').filter(Boolean).map(numTok));
function detectFarms(q){
  const qt=qTokens(q), nq=' '+norm(q)+' ', out=[];
  const cadena={FARMASHOP:/ farmashop /,'SAN ROQUE':/ (san roque|roque) /,NATAL:/ natal /};
  F.forEach(f=>{
    const tk=norm(f.nombre).split(' ').map(numTok).filter(t=>t&&!STOPW.has(t)&&(t.length>=3||/^\d+$/.test(t)));
    if(!tk.length) return;
    const hits=tk.filter(t=>qt.has(t)), txt=hits.filter(t=>!/^\d+$/.test(t)).length, num=hits.length-txt;
    let ok=false;
    if(cadena[f.tipo]) ok = txt>0 || (num>0 && cadena[f.tipo].test(nq));
    else ok = txt>0 && hits.length/tk.length>=0.5;
    if(ok) out.push([hits.length/tk.length+hits.length*0.01,f]);
  });
  return out.sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
}
function detectBrands(q){
  const nq=norm(q).replace(/\s/g,'');
  return Object.keys(MARCA).filter(k=>[norm(k),norm(marca(k))].some(s=>{ s=s.replace(/\s/g,''); return s.length>=4&&nq.includes(s); }));
}
function detectBricks(q){
  const qt=qTokens(q), out=[];
  Object.keys(Z).forEach(b=>{ if(qt.has(String(parseInt(b,10)))&&/\d{4}/.test(q)) { out.push(b); return; }
    const tk=norm(zonaCorta(b)).split(' ').filter(t=>t.length>=5&&!STOPW.has(t));
    if(tk.some(t=>qt.has(t))) out.push(b); });
  return out;
}
function brandCartera(b){
  const L=[];
  Object.keys(Z).forEach(k=>{ const z=Z[k], nf=F.filter(f=>String(f.brick)===k).length;
    (z.cats||[]).forEach(c=>{ const m=(c.marcas||[]).find(x=>x.marca===b); if(!m) return;
      L.push(`${k} ${zonaCorta(k)} (${nf} pdv de la cartera) | ${c.nombre||catName(c.cat)}: share ${m.share}% (${m.delta_pp>0?'+':''}${m.delta_pp} pp), ${m.unid} unid. año móvil, mercado $${c.mercado} (${c.crec>0?'+':''}${c.crec}%)${c.top&&c.top[0]?', líder '+c.top[0].producto+' '+c.top[0].share+'%':''}`); }); });
  return L.join('\n')||'Sin datos de CloseUp para esta marca en la cartera.';
}
function extraContext(q){
  const parts=[];
  const farms=detectFarms(q).filter(f=>f!==cur).slice(0,3);
  farms.forEach(f=>parts.push('PUNTO DE VENTA MENCIONADO:\n'+JSON.stringify(farmaDetail(f))));
  const brands=detectBrands(q).slice(0,2), target=farms[0]||cur;
  brands.forEach(b=>{
    if(target&&!(screen==='marca'&&target===cur&&b===curBrand)) parts.push(`MARCA ${marca(b)} EN ${target.nombre}:\n`+JSON.stringify(brandSummary(target,b)));
    parts.push(`MARCA ${marca(b)} EN CADA ZONA DE LA CARTERA (CloseUp, año móvil a jul-26):\n`+brandCartera(b));
  });
  const bricks=detectBricks(q).filter(b=>!cur||String(cur.brick)!==b||screen==='menu').slice(0,2);
  bricks.forEach(b=>parts.push(`ZONA ${b}:\n`+JSON.stringify(zonaSummary(b))));
  if(!brands.length&&!bricks.length&&/zona|brick|barrio|oportunidad|mercado/.test(norm(q)))
    parts.push('SHARE MEGALABS OTC POR ZONA (CloseUp):\n'+Object.keys(Z).map(k=>`${k} ${zonaCorta(k)}: ${Z[k].share_meg}% (${F.filter(f=>String(f.brick)===k).length} pdv)`).join('\n')+`\nPromedio de la cartera: ${D.share_cartera}%`);
  if(cur&&screen!=='menu'&&Z[cur.brick]&&/zona|brick|competencia|mercado|share/.test(norm(q))&&!bricks.length)
    parts.push(`ZONA DEL PUNTO DE VENTA EN PANTALLA (${cur.brick}):\n`+JSON.stringify(zonaSummary(String(cur.brick))));
  return parts.length?'\n\nDATOS ADICIONALES PARA ESTA PREGUNTA:\n'+parts.join('\n\n'):'';
}

// ---- UI del asistente
const $in=$('#askInput'), $send=$('#askSend'), $msgs=$('#askMsgs'), $sheet=$('#askSheet');
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const PH_IN=$in.placeholder;
const vozOK=()=>!!SR&&!ASK.srBlocked;
function setSendIcon(){ const has=$in.value.trim().length>0&&!ASK.sr; $send.innerHTML=has?SEND:MIC; $send.setAttribute('aria-label', ASK.sr?'Terminar y enviar':has?'Enviar pregunta':'Dictar pregunta'); }
setSendIcon();
$in.addEventListener('input',()=>{ if(ASK.sr&&ASK.mode!=='down') ASK.userTyped=true; setSendIcon(); });
$in.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); if(ASK.sr) stopRec(false); else sendAsk($in.value); } });
function ctxLabel(){ if(screen==='ruta'&&RUTA_NAV) return 'Ruta del '+fechaLarga(RUTA_NAV.fecha).toLowerCase().replace(',','')+' · '+RUTA_NAV.ids.length+' farmacias'; return (screen==='marca'&&cur)? cur.nombre+' · '+marca(curBrand) : (screen==='farm'&&cur)? cur.nombre : 'Cartera de '+D.vendedor+' · '+F.length+' puntos de venta'; }
function suggestions(){
  if(screen==='marca'&&cur){ const m=marca(curBrand); return [`¿Qué presentación de ${m} le propongo?`,`¿Cómo viene ${m} en esta zona contra la competencia?`,`¿Por qué cambiaron sus compras de ${m}?`]; }
  if(screen==='ruta'&&RUTA_NAV) return ['¿En qué farmacia de la ruta hay más oportunidad?','¿Qué pedido llevo para cada farmacia?','Resumime la ruta en 5 puntos'];
  if(screen==='farm'&&cur) return ['¿Qué le ofrezco hoy a esta farmacia?','¿Por qué cambiaron sus compras?','Resumime la visita en 3 puntos'];
  const base=['¿Qué farmacias tengo que priorizar esta semana?','¿Cuáles dejaron de comprar OTC?','¿Qué zona tiene más oportunidad para Dolex?'];
  return (rutaCtx()?['¿Qué tengo que mirar en cada farmacia de mi ruta?']:[]).concat(base).slice(0,3);
}
function openSheet(focus){ $sheet.hidden=false; document.body.classList.add('sheet-open'); $('#askCtx').textContent='Sobre: '+ctxLabel(); renderMsgs(); if(focus) setTimeout(()=>$in.focus(),30); }
function closeSheet(){ if(ASK.sr) stopRec(true); $sheet.hidden=true; document.body.classList.remove('sheet-open'); }
$('#askClose').addEventListener('click',closeSheet);
function md(t){
  const lines=esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').split(/\n/);
  let h='',inl=false;
  lines.forEach(l=>{ const m=l.match(/^\s*(?:[-•*]|\d+[.)])\s+(.*)$/); if(m){ if(!inl){h+='<ul>';inl=true;} h+='<li>'+m[1]+'</li>'; } else { if(inl){h+='</ul>';inl=false;} if(l.trim()) h+='<p>'+l.replace(/^#+\s*/,'')+'</p>'; } });
  if(inl) h+='</ul>'; return h;
}
const hhmm=()=>{ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
function saludo(){
  const nom=SES&&SES.rol==='vendedor'?', '+esc(SES.nombre.split(' ')[0]):'';
  const como=vozOK()?(ASK.clickOnly?'tocá <b>Preguntar</b>, hablá y tocá el botón rojo para enviar.':'tocá <b>Preguntar</b>, hablá y tocá el botón rojo para enviar. También podés mantener apretado <b>Preguntar</b> mientras hablás y soltarlo al terminar.'):'escribí tu pregunta abajo (podés usar el micrófono del teclado para dictarla).';
  const off=CONFIG.asistenteUrl?'':'<p class="small"><b>Aviso:</b> el asistente todavía no está conectado; por ahora solo transcribo la pregunta.</p>';
  return `<div class="msg a"><p>Hola${nom}. Preguntame lo que necesites antes de entrar: ${como}</p>${off}</div>`;
}
function renderMsgs(){
  if(!ASK.turns.length){
    $msgs.innerHTML=saludo()+`<div class="sugs">${suggestions().map(s=>`<button class="sug" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>`;
    return;
  }
  $msgs.innerHTML=ASK.turns.map((t,ti)=>{
    if(t.role==='user') return `<div class="msg u">${esc(t.content)}<span class="meta">${t.time||''}${t.voz?' · por voz':''}</span></div>`;
    const body = t.pending ? '<span class="dots" aria-label="Pensando"><span></span><span></span><span></span></span> <span class="small">Buscando en los datos…</span>' : md(t.text||'');
    return `<div class="msg a" data-turn="${ti}">${body}${t.err?`<p class="err">${esc(t.err)}</p>${t.retry?'<button class="retry" data-retry="1">Reintentar</button>':''}`:''}${!t.pending?`<span class="meta">${t.text&&!t.failed?btnEscuchar('ans:'+ti):''}${t.time||''}</span>`:''}</div>`;
  }).join('') + (ASK.busy?'<button class="stop" id="askStop">Detener</button>':'') + (!ASK.busy?`<div class="sugs">${suggestions().slice(0,2).map(s=>`<button class="sug" data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div>`:'');
  $msgs.querySelectorAll('.msg.a[data-turn]').forEach(m=>m.querySelectorAll(':scope > p:not(.err):not(.small), :scope > ul > li').forEach((el,j)=>el.dataset.blk=j));
  if(TTS.key&&TTS.key.startsWith('ans:')) ttsMark();
  $msgs.scrollTop=$msgs.scrollHeight;
}
// guion para leer una respuesta: un tramo por párrafo o viñeta, para ir marcando lo que se lee
function guionRespuesta(ti){
  return [...$msgs.querySelectorAll(`.msg.a[data-turn="${ti}"] [data-blk]`)].map(el=>({t:hablar(el.textContent), sel:`#askMsgs .msg.a[data-turn="${ti}"] [data-blk="${el.dataset.blk}"]`})).filter(x=>x.t);
}
const TTS_AUTO={ get(){ return store.get('ttsAuto',true)!==false; }, set(v){ store.set('ttsAuto',!!v); } };
(function(){ if(!SYN) return;
  $('#askClose').insertAdjacentHTML('beforebegin','<button class="x autoleer" id="askAuto" type="button"></button>');
  const pinta=()=>{ const on=TTS_AUTO.get(), b=$('#askAuto'); b.setAttribute('aria-pressed',on); b.setAttribute('aria-label',on?'Lectura en voz alta activada':'Lectura en voz alta desactivada'); b.title=on?'Las respuestas a preguntas por voz se leen en voz alta':'No se leen en voz alta'; b.innerHTML=on?ICO_SPK:ICO_SPK.replace('</svg>','<path d="M3 3l18 18"></path></svg>'); };
  pinta(); $('#askAuto').addEventListener('click',()=>{ TTS_AUTO.set(!TTS_AUTO.get()); pinta(); if(!TTS_AUTO.get()&&TTS.key.startsWith('ans:')) ttsPause(); });
})();
$msgs.addEventListener('click',e=>{
  const s=e.target.closest('[data-q]'); if(s){ sendAsk(s.dataset.q); return; }
  if(e.target.closest('#askStop')){ ASK.ctl&&ASK.ctl.abort(); return; }
  if(e.target.closest('[data-retry]')){ const i=ASK.turns.map(t=>t.role).lastIndexOf('user'); if(i>=0){ const q=ASK.turns[i].content; ASK.turns=ASK.turns.slice(0,i); sendAsk(q); } }
});
const ERRS={
  no_autorizado:'Tu usuario no está habilitado para el asistente. Pedile al administrador de SmartBrick que lo active.',
  sin_clave:'El asistente todavía no está activado: falta cargar la clave de Claude en el servidor. Tu pregunta quedó transcripta arriba.',
  clave_invalida:'La clave de Claude cargada en el servidor no es válida. Avisale al administrador de SmartBrick.',
  sin_saldo:'La cuenta de Claude del asistente no tiene saldo. Avisale al administrador de SmartBrick.',
  limite:'Llegaste al límite de preguntas por hora. Probá de nuevo en un rato.',
  saturado:'El servicio de Claude está muy cargado en este momento. Probá de nuevo en unos segundos.',
  vacio:'No llegó la pregunta. Probá de nuevo.',
  api:'Claude no pudo responder esa consulta. Probá formularla de otra forma.',
  servidor:'El servidor del asistente tuvo un error. Probá de nuevo.'
};
const RETRY=new Set(['saturado','servidor','vacio','api']);
async function sendAsk(text, voz){
  text=String(text||'').trim(); if(!text||ASK.busy) return;
  $in.value=''; setSendIcon(); openSheet();
  ASK.turns.push({role:'user',content:text,time:hhmm(),voz:!!voz});
  const a={role:'assistant',pending:true,text:''}; ASK.turns.push(a); ASK.busy=true; renderMsgs();
  const fin=()=>{ a.pending=false; a.time=hhmm(); ASK.busy=false; ASK.ctl=null; renderMsgs(); };
  if(!CONFIG.asistenteUrl){ a.err='El asistente todavía no está conectado (falta su dirección en config.js). Tu pregunta quedó transcripta arriba.'; a.failed=true; return fin(); }
  const hist=ASK.turns.filter(t=>!t.pending&&!t.failed&&(t.role==='user'||t.text)).slice(-9).map(t=>({role:t.role,content:t.role==='user'?t.content:t.text}));
  const body={token:SES.token, system:rulesTurn()+extraContext(text), messages:hist};
  ASK.ctl=new AbortController(); let timeout=false; const tmr=setTimeout(()=>{ timeout=true; ASK.ctl&&ASK.ctl.abort(); },60000);
  try{
    const r=await fetch(CONFIG.asistenteUrl,{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'text/plain;charset=utf-8'},signal:ASK.ctl.signal,redirect:'follow'});
    const j=await r.json();
    if(j.error){ a.err=ERRS[j.error]||'El asistente no pudo responder.'; a.retry=RETRY.has(j.error); a.failed=true; }
    else { a.text=j.text||''; if(!a.text){ a.err='No obtuve respuesta. Probá con una pregunta más corta.'; a.retry=true; a.failed=true; } else if(j.truncated) a.err='La respuesta quedó cortada. Pedí algo más puntual.'; }
  }catch(e){
    if(e&&e.name==='AbortError'&&!timeout){ a.text='(detenido)'; }
    else { a.err= timeout?'El asistente tardó demasiado en responder. Probá de nuevo.' : !navigator.onLine?'No hay conexión a internet. Probá de nuevo cuando tengas señal.' : 'No pude conectar con el asistente. Si sigue pasando, avisale al administrador de SmartBrick.'; a.retry=true; a.failed=true; }
  }finally{ clearTimeout(tmr); }
  fin();
  if(voz&&a.text&&!a.failed&&SYN&&TTS_AUTO.get()){ const ti=ASK.turns.indexOf(a); ttsPlay('ans:'+ti, 'Respuesta: '+text.slice(0,60), guionRespuesta(ti)); }
}

// ---- Voz con el reconocimiento del navegador (Chrome, Edge, Safari)
// Botón verde "Preguntar":
//   · tocar: abre el chat y empieza a escuchar; se termina con el botón rojo (o "Enviar") y la X cancela.
//   · mantener apretado: hablar y soltar para enviar, como un audio de WhatsApp.
// Mientras escucha siempre hay una forma visible de enviar o cancelar, y un tope de 60 segundos.
// Si el navegador no avisa que terminó (pasa en algunos iPhone), a los 1,5 s se cierra igual.
let tipTimer=null;
const MAX_REC=60000;
function tip(msg,ms){ const t=$('#askTip'); t.textContent=msg; t.hidden=false; clearTimeout(tipTimer); tipTimer=setTimeout(()=>{t.hidden=true;},ms||5000); }
function dictationFallback(){ openSheet(true); tip('Tu navegador no permite dictar acá. Tocá el micrófono de tu teclado para dictar la pregunta y enviala con la flecha verde.',7000); }
const askBtns=()=>document.querySelectorAll('.askbtn');
// botones Cancelar / Enviar dentro del aviso "Escuchando…"
(function(){
  const p=$('#recPill'); p.removeAttribute('role'); $('#recTxt').setAttribute('aria-live','polite');
  p.insertAdjacentHTML('beforeend','<button type="button" class="rb cancel" id="recCancel">Cancelar</button><button type="button" class="rb send" id="recSend">Enviar</button>');
  const st=document.createElement('style');
  st.textContent='.recpill{padding:8px 8px 8px 16px}.recpill span{flex:1;min-width:0}.recpill .rb{border:0;border-radius:18px;min-height:38px;padding:0 14px;font-size:14px;font-weight:700;flex-shrink:0;font-family:inherit}.recpill .rb.cancel{background:#EEF1F3;color:#151A18}.recpill .rb.send{background:#007C6B;color:#fff}';
  document.head.appendChild(st);
  $('#recCancel').addEventListener('click',()=>stopRec(true));
  $('#recSend').addEventListener('click',()=>stopRec(false));
})();
function recUI(on){
  const hold=ASK.mode==='down';
  askBtns().forEach(b=>{ b.classList.toggle('rec',on); const l=b.querySelector('.lbl'); if(l) l.textContent=on?(hold?'Escuchando':'Enviar'):'Preguntar'; });
  $send.classList.toggle('rec',on&&!hold);
  $in.placeholder= on&&!hold ? 'Escuchando… tocá el botón rojo para enviar' : PH_IN;
  const p=$('#recPill'); p.hidden=!(on&&hold); clearInterval(ASK.timer);
  if(on&&hold){
    $('#recTxt').textContent=ASK.recTxt||'Escuchando… soltá para enviar';
    ASK.timer=setInterval(()=>{ if(!ASK.recTxt){ const s=Math.floor((Date.now()-ASK.recStart)/1000); $('#recTxt').textContent=`0:${String(s).padStart(2,'0')} · Escuchando… soltá para enviar`; } },500);
  }
  setSendIcon();
}
function startRec(src){
  if(!vozOK()) return false;
  if(TTS.playing) ttsPause();   // no grabar la lectura en voz alta
  if(ASK.sr) return true;
  let rec; try{ rec=new SR(); }catch(e){ ASK.srBlocked=true; return false; }
  ASK.sr=rec; ASK.mode=src; ASK.recTxt=''; ASK.discard=false; ASK.userTyped=false; ASK.gotResult=false; ASK.recStart=Date.now();
  rec.lang=CONFIG.idiomaVoz||'es-UY'; rec.interimResults=true; rec.continuous=true; rec.maxAlternatives=1;
  rec.onresult=ev=>{ if(rec._done) return; let t=''; for(let i=0;i<ev.results.length;i++) t+=ev.results[i][0].transcript; ASK.recTxt=t.trim();
    if(!ASK.recTxt) return; ASK.gotResult=true;
    if(ASK.mode==='down') $('#recTxt').textContent=ASK.recTxt; else if(!ASK.userTyped) $in.value=ASK.recTxt; };
  rec.onerror=ev=>{
    if(rec._done) return;
    const er=ev.error;
    if(er==='not-allowed'||er==='service-not-allowed'){
      stopRec(true);
      if(src==='down'&&!ASK.clickOnly){ ASK.clickOnly=true; openSheet(false); tip('Tocá Preguntar para hablar y tocá el botón rojo para enviar. Si el teléfono pide permiso para el micrófono, aceptalo.',7000); }
      else { ASK.srBlocked=true; openSheet(true); tip('El navegador no tiene permiso para el micrófono. Habilitalo para este sitio (en iPhone: Ajustes → Safari → Micrófono, y Ajustes → General → Teclado → Activar dictado), o dictá con el micrófono del teclado.',10000); }
    } else if(er==='audio-capture'){ stopRec(true); ASK.srBlocked=true; openSheet(true); tip('No encontré un micrófono en este dispositivo. Escribí tu pregunta.',6000); }
    else if(er==='network'){ stopRec(true); tip('El dictado necesita conexión a internet. Probá de nuevo.',5000); }
  };
  rec.onend=()=>finalizeRec(rec);
  try{ rec.start(); }catch(e){ ASK.sr=null; return false; }
  recUI(true);
  clearTimeout(ASK.maxT);
  ASK.maxT=setTimeout(()=>{ if(ASK.sr===rec){ tip('Llegaste al máximo de 60 segundos: envío lo que escuché.',4000); stopRec(false); } },MAX_REC);
  return true;
}
// cierra la grabación una sola vez (cuando el navegador avisa o por el tiempo de espera) y envía lo escuchado
function finalizeRec(rec){
  if(rec._done) return; rec._done=true;
  clearTimeout(ASK.maxT); clearTimeout(ASK.stopT);
  if(ASK.sr!==rec) return;
  const m=ASK.mode, discard=ASK.discard, dur=Date.now()-ASK.recStart, got=ASK.gotResult;
  let t=ASK.recTxt;
  ASK.sr=null; ASK.discard=false; recUI(false);
  if(m!=='down'){ if(ASK.userTyped||!t) t=$in.value.trim(); $in.value=''; setSendIcon(); }
  if(discard) return;
  if(t){ ASK.emptyRuns=0; sendAsk(t, m==='down'||!ASK.userTyped); return; }
  if(dur>1500&&!got){
    ASK.emptyRuns=(ASK.emptyRuns||0)+1;
    if(ASK.emptyRuns>=2){ openSheet(true); tip('El navegador no está transcribiendo tu voz. Usá el micrófono del teclado para dictar y enviá con la flecha verde.',8000); }
    else tip('No te escuché. Probá de nuevo hablando cerca del teléfono.',4000);
  }
}
function stopRec(discard){
  const rec=ASK.sr; if(!rec||rec._done) return;
  if(discard) ASK.discard=true;
  try{ discard?rec.abort():rec.stop(); }catch(e){}
  clearTimeout(ASK.stopT);
  ASK.stopT=setTimeout(()=>{ if(!rec._done){ try{ rec.abort(); }catch(e){} finalizeRec(rec); } },1500);
}
document.addEventListener('visibilitychange',()=>{ if(document.hidden&&ASK.sr) stopRec(true); });
document.addEventListener('contextmenu',e=>{ if(e.target.closest('.askbtn')) e.preventDefault(); });
// En iPhone/iPad, Safari solo deja encender el micrófono con un toque completo: ahí se usa "tocar para hablar / tocar para enviar".
const IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(IOS) ASK.clickOnly=true;
document.addEventListener('pointerdown',e=>{
  const b=e.target.closest('.askbtn'); if(!b||e.button>0) return;
  ASK.wasHold=false; ASK.pressStarted=false; ASK.downAt=Date.now();
  if(ASK.sr){ ASK.pressStops=true; ASK.holding=false; return; }   // ya está escuchando: este toque termina y envía (al levantar el dedo)
  ASK.pressStops=false;
  if(!vozOK()||ASK.clickOnly){ ASK.holding=false; return; }      // se resuelve en el click
  e.preventDefault(); ASK.holding=true;
  try{ b.setPointerCapture(e.pointerId); }catch(_){}
  ASK.recording=startRec('down'); ASK.pressStarted=ASK.recording;
});
const endHold=e=>{
  if(ASK.pressStops){ if(e&&e.type==='pointercancel') { ASK.pressStops=false; return; } ASK.pressStops=false; ASK.swallowClick=Date.now(); stopRec(false); return; }
  if(!ASK.holding) return; ASK.holding=false; const held=Date.now()-ASK.downAt;
  if(held>=450){ ASK.wasHold=true; if(ASK.recording) stopRec(false); else openSheet(false); }
  ASK.recording=false; };
document.addEventListener('pointerup',endHold); document.addEventListener('pointercancel',endHold);
document.addEventListener('click',e=>{ const b=e.target.closest('.askbtn'); if(!b) return;
  if(ASK.swallowClick&&Date.now()-ASK.swallowClick<1000){ ASK.swallowClick=0; return; }
  if(ASK.wasHold){ ASK.wasHold=false; ASK.pressStarted=false; return; }
  if(ASK.pressStarted){ ASK.pressStarted=false; if(ASK.sr){ ASK.mode='click'; recUI(true); openSheet(false); } return; }   // toque corto: sigue escuchando hasta tocar Enviar
  if(ASK.sr){ stopRec(false); return; }                           // teclado o un toque que no pasó por pointerup
  if(!vozOK()){ dictationFallback(); return; }
  openSheet(false); startRec('click');
});
// botón redondo del chat: si está escuchando, termina y envía; si hay texto, lo envía; si no, empieza a escuchar
$send.addEventListener('click',()=>{ if(ASK.sr){ stopRec(false); return; } if($in.value.trim()){ sendAsk($in.value); return; } if(!startRec('click')) dictationFallback(); });
function syncAskBar(){ if(screen==='login'||screen==='carga') closeSheet(); else if(!$sheet.hidden) $('#askCtx').textContent='Sobre: '+ctxLabel(); }

// ---- Arranque
const APP_VERSION='1.9';
document.querySelectorAll('.powered').forEach(el=>el.insertAdjacentHTML('beforeend',`<span class="ver" style="opacity:.55;font-size:12px">· v${APP_VERSION}</span>`));
async function arranque(){
  if('serviceWorker' in navigator && (location.protocol==='https:'||/^(localhost|127\.0\.0\.1)$/.test(location.hostname))){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
  if(!window.crypto||!crypto.subtle){ show('login',false); lmsg('Abrí SmartBrick desde su dirección segura (https://).',true); return; }
  await prepararLogin();
  const s=sesion.get();
  if(s&&s.carteras&&s.carteras.length&&(!USERS||USERS.usuarios.some(u=>u.nombre===s.nombre&&!u.sinDatos))){
    SES=s;
    try{ await cargarCartera(s.cartera||s.carteras[0].slug); try{ history.replaceState({s:'menu'},''); }catch(e){} renderMenu(); show('menu',false); return; }
    catch(e){ SES=null; sesion.set(null); lmsg(e.message||'Volvé a ingresar con tu contraseña.',!e.relogin); }
  } else if(s) sesion.set(null);
  try{ history.replaceState({s:'login'},''); }catch(e){}
  show('login',false);
}
arranque();
})();
