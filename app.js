const GROUPS = [
  ['00','入口与导航'],['01','工作节奏'],['02','数据源与取数'],['03','财报核算'],
  ['04','经营分析'],['05','预算与预测'],['06','异常事项处理'],['07','管理汇报与沟通'],
  ['08','图表与展示规范'],['09','电商财务 BP 专题'],['90','模板'],['91','术语与口径'],
  ['92','资料索引'],['94','外部知识源']
];
const STEPS = [
  {num:'01',title:'定节奏',prompt:'这期要交什么？',desc:'确定期间、组织、交付日期与特殊事项。',output:'输出 · 工作计划 / 待补清单',link:'01_工作节奏/月度工作节奏.md',group:'01'},
  {num:'02',title:'取原数',prompt:'数据从哪里来？',desc:'逐平台导出原始文件，固定时间与字段口径。',output:'输出 · 原始文件 / 处理底稿',link:'02_数据源与取数/平台取数通用SOP.md',group:'02'},
  {num:'03',title:'做核算',prompt:'利润是怎么算的？',desc:'按收入、退款、成本和费用统一核算并勾稽。',output:'输出 · 利润表 / 问题清单',link:'03_财报核算/财报核算总流程.md',group:'03'},
  {num:'04',title:'拆差异',prompt:'结果为什么变化？',desc:'比较预算与历史，量化量价结构和费率影响。',output:'输出 · 差异说明 / 原因证据',link:'04_经营分析/经营分析报告总流程.md',group:'04'},
  {num:'05',title:'定动作',prompt:'下一步由谁负责？',desc:'把结论转为决策、责任人、期限与复盘标准。',output:'输出 · 决策事项 / 待办表',link:'04_经营分析/决策与待办跟踪.md',group:'04'},
  {num:'06',title:'更新预测',prompt:'全年目标还差多少？',desc:'纳入最新实际数与业务假设，滚动修正未来。',output:'输出 · 预测版 / 风险机会',link:'05_预算与预测/滚动预测更新SOP.md',group:'05'}
];
let docs = [], current = null;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const docHash = id => '#doc=' + encodeURIComponent(id);
function closeMenu(){ $('#sidebar').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded','false'); }
function show(view){ ['homeView','readerView','resultsView'].forEach(id=>$('#'+id).hidden = id!==view); $('#main').scrollTop=0; window.scrollTo(0,0); closeMenu(); }
function openDoc(id){ const d=docs.find(x=>x.id===id); if(!d){show('homeView');return;} current=d; $('#breadcrumb').textContent=(GROUPS.find(g=>g[0]===d.group)||['','文档'])[1]+' / '+d.title; $('#article').innerHTML='<div class="article-label">工作手册 / '+esc(d.group)+' <span class="status-badge">'+esc(d.status)+'</span></div>'+d.html; document.title=d.title+' · 财务 BP 工作手册'; show('readerView'); markActive(); }
function markActive(){ document.querySelectorAll('.side-nav a').forEach(a=>a.classList.toggle('active',current&&decodeURIComponent(a.hash.slice(5))===current.id)); }
function route(){ const h=location.hash; if(h.startsWith('#doc=')){ openDoc(decodeURIComponent(h.slice(5))); return; } if(h.startsWith('#search=')){ const q=decodeURIComponent(h.slice(8)); $('#search').value=q; search(q); return; } current=null; document.title='财务 BP 工作手册 · SOP 全景'; show('homeView'); markActive(); }
function search(q){ q=q.trim(); if(!q){ if(location.hash.startsWith('#search=')) history.replaceState(null,'','#home'); route(); return; } const terms=q.toLocaleLowerCase().split(/\s+/); const found=docs.map(d=>({d,score:terms.reduce((n,t)=>n+(d.title.toLocaleLowerCase().includes(t)?10:0)+(d.search.toLocaleLowerCase().includes(t)?1:0),0),match:terms.every(t=>d.title.toLocaleLowerCase().includes(t)||d.search.toLocaleLowerCase().includes(t))})).filter(x=>x.match).sort((a,b)=>b.score-a.score || a.d.title.localeCompare(b.d.title,'zh-CN')); $('#resultsTitle').textContent='“'+q+'”'; $('#resultsMeta').textContent=found.length+' 份相关文档 · 可点击查看全文'; $('#resultsList').innerHTML=found.length?found.map(({d})=>'<a href="'+docHash(d.id)+'"><span>'+esc((GROUPS.find(g=>g[0]===d.group)||['','文档'])[1])+'</span><strong>'+esc(d.title)+'</strong><small>'+esc(d.excerpt)+'</small><i>↗</i></a>').join(''):'<div class="empty">没有找到相关内容。试试“退款”“核算”或具体平台名称。</div>'; show('resultsView'); }
function setup(){
 $('#process').innerHTML=STEPS.map(s=>'<button class="step" data-open="'+esc(s.link)+'"><span class="step-num">'+s.num+'</span><span class="step-tag">'+esc((GROUPS.find(g=>g[0]===s.group)||[])[1])+'</span><strong>'+s.title+'</strong><em>'+s.prompt+'</em><span class="step-desc">'+s.desc+'</span><span class="step-output">'+s.output+'</span><span class="step-arrow">↗</span></button>').join('');
 $('#sideNav').innerHTML='<a class="overview" href="#home">总览 <span>↗</span></a>'+GROUPS.map(([num,name])=>{const items=docs.filter(d=>d.group===num);return items.length?'<details '+(['00','01','02','03','04','05'].includes(num)?'open':'')+'><summary><span class="group-num">'+num+'</span><span>'+name+'</span><small>'+items.length+'</small></summary><div class="nav-items">'+items.map(d=>'<a href="'+docHash(d.id)+'"'+(/待补/.test(d.status)?' class="pending"':'')+'>'+esc(d.title)+(/待补/.test(d.status)?' <small>待补</small>':'')+'</a>').join('')+'</div></details>':''}).join('');
 $('#docCount').textContent=docs.length+' 份文档';
 document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)location.hash=docHash(b.dataset.open);});
 $('#backBtn').onclick=()=>location.hash='#home'; $('#topBtn').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
 $('#menuBtn').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(open));};
 $('#search').addEventListener('input',e=>{const q=e.target.value.trim(); if(q){history.replaceState(null,'','#search='+encodeURIComponent(q));search(q);}else{history.replaceState(null,'','#home');route();}});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();$('#search').focus();$('#sidebar').classList.add('open');}if(e.key==='Escape'){$('#search').blur();closeMenu();}});
 window.addEventListener('hashchange',route);route();
}
fetch('docs.json?v=20261110-audit').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{docs=data;setup()}).catch(()=>{$('#docCount').textContent='文档加载失败';$('#process').innerHTML='<p>文档加载失败。请通过 HTTP 服务打开站点，或刷新页面重试。</p>';});
