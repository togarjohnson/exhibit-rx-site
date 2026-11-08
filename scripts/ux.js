/* Exhibit RX UX preview: motion layer. Toggle with the preview guide panel. */
(function(){
  var body=document.body;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY='erx-ux';
  var on=true;
  try{ if(localStorage.getItem(KEY)==='off') on=false; }catch(e){}
  function apply(){ body.classList.toggle('ux-on',on); body.classList.toggle('ux-off',!on); }
  apply();

  /* Magnetic CTAs (Nudge style): hero CTA, nav CTA and the two start-here buttons */
  var magnets=[].slice.call(document.querySelectorAll('.hero-actions .btn-primary, .navlinks .btn-dark, .doors .btn-primary'));
  magnets.forEach(function(b){
    b.classList.add('ux-magnet');
    var arrow=document.createElement('span'); arrow.className='ux-arrow'; arrow.setAttribute('aria-hidden','true'); arrow.textContent='→';
    b.appendChild(arrow);

  });

  /* Click ping on filled buttons */
  [].slice.call(document.querySelectorAll('.btn-primary, .btn-dark')).forEach(function(b){
    b.addEventListener('pointerdown',function(e){
      if(!on || reduce) return;
      var r=b.getBoundingClientRect();
      b.style.setProperty('--ux-x',(e.clientX-r.left)+'px');
      b.style.setProperty('--ux-y',(e.clientY-r.top)+'px');
      b.classList.remove('ux-press'); void b.offsetWidth; b.classList.add('ux-press');
    });
    b.addEventListener('animationend',function(){ b.classList.remove('ux-press'); });
  });

  /* Glass nav that floats once you scroll past the top (Opal style) */
  var nav=document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('ux-float', on && scrollY>120); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* Electric underline that follows the cursor and rests on the current section (Surge style) */
  var links=document.querySelector('.navlinks');
  if(links){
    var bar=document.createElement('span'); bar.className='ux-bar'; bar.setAttribute('aria-hidden','true'); links.appendChild(bar);
    var items=[].slice.call(links.querySelectorAll('a:not(.btn)'));
    var resting=null;
    function moveTo(a,zap){
      if(!a){ bar.classList.remove('ux-show'); return; }
      bar.style.left=a.offsetLeft+'px'; bar.style.width=a.offsetWidth+'px'; bar.classList.add('ux-show');
    }
    items.forEach(function(a){ a.addEventListener('mouseenter',function(){ moveTo(a,true); }); });
    links.addEventListener('mouseleave',function(){ moveTo(resting,false); });
    var sections=items.map(function(a){ var h=a.getAttribute('href'); return h.charAt(0)==='#'?document.querySelector(h):null; });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ var i=sections.indexOf(en.target); resting=items[i]; if(!links.matches(':hover')) moveTo(resting,false); } });
      },{rootMargin:'-45% 0px -50% 0px'});
      sections.forEach(function(s){ if(s) io.observe(s); });
    }
  }

  /* Stretchy highlight that slides between Solutions tabs (Opal style) */
  var tabs=document.querySelector('.pk-tabs');
  if(tabs){
    var hl=document.createElement('span'); hl.className='ux-hl'; hl.setAttribute('aria-hidden','true'); tabs.insertBefore(hl,tabs.firstChild);
    function place(){ var t=tabs.querySelector('.pk-tab[aria-selected="true"]'); if(!t) return; hl.style.top=t.offsetTop+'px'; hl.style.height=t.offsetHeight+'px'; hl.style.left=t.offsetLeft+'px'; hl.style.width=t.offsetWidth+'px'; hl.style.right='auto'; }
    place(); setTimeout(function(){ hl.classList.add('ux-ready'); },50);
    new MutationObserver(place).observe(tabs,{attributes:true,subtree:true,attributeFilter:['aria-selected']});
    addEventListener('resize',place);
  }

  /* Paper plane send button (Dart style) on the Show Rescue and Health Check forms */
  var plane='<svg class="ux-plane" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 11.5 21.5 3l-6 18-4.2-7.3L2 11.5Z" fill="#fff"/><path d="m11.3 13.7 10.2-10.7" stroke="#01283B" stroke-width="1.2"/></svg>';
  function decorate(btn){
    if(btn.classList.contains('ux-send')) return;
    btn.classList.add('ux-send');
    btn.innerHTML='<span class="ux-label">'+btn.innerHTML+'</span>'+plane;
  }
  function fly(btn){
    btn.classList.remove('ux-fly'); void btn.offsetWidth; btn.classList.add('ux-fly');
    setTimeout(function(){ btn.classList.remove('ux-fly'); },2600);
  }
  [].slice.call(document.querySelectorAll('.mini-form')).forEach(function(form){
    var btn=form.querySelector('button[type="submit"]'); if(!btn) return; decorate(btn);
    form.addEventListener('submit',function(){ if(on && !reduce && form.checkValidity() && !form.website.value) fly(btn); });
  });

  /* Live sample dashboard: counts, dial and rows animate in (Meridian style) */
  var wyg=document.querySelector('.wyg');
  if(wyg && !reduce && 'IntersectionObserver' in window){
    var dial=wyg.querySelector('.wyg-dial'), dialNum=dial&&dial.querySelector('span');
    var target=dial?parseFloat(getComputedStyle(dial).getPropertyValue('--pct'))||44:0;
    var bars=[].slice.call(wyg.querySelectorAll('.wyg-bars i')).map(function(i){ return [i,i.style.width]; });
    var kpis=[].slice.call(wyg.querySelectorAll('.wyg-kpis b')).map(function(b){ return [b,b.textContent]; });
    var rows=[].slice.call(wyg.querySelectorAll('.wyg-table tbody tr'));
    var pills=[].slice.call(wyg.querySelectorAll('.wyg-table em'));
    var kpiBoxes=[].slice.call(wyg.querySelectorAll('.wyg-kpis div'));
    function reset(){
      if(!on) return;
      wyg.classList.add('wyg-pre');
      if(dial){ dial.style.setProperty('--pct',0); dialNum.textContent='0'; }
      bars.forEach(function(p){ p[0].style.width='0%'; });
      kpis.forEach(function(p){ p[0].textContent=p[1].replace(/\d+/,'0'); });
    }
    function count(from,to,ms,step){ var t0=performance.now(); (function f(now){ var k=Math.min(1,(now-t0)/ms); var e=1-Math.pow(1-k,3); step(Math.round(from+(to-from)*e)); if(k<1) requestAnimationFrame(f); })(t0); }
    function play(){
      if(!on) return;
      wyg.classList.remove('wyg-pre');
      if(dial) count(0,target,1400,function(v){ dial.style.setProperty('--pct',v); dialNum.textContent=v; });
      bars.forEach(function(p,i){ setTimeout(function(){ p[0].style.width=p[1]; },150*i); });
      rows.forEach(function(r,i){ r.style.transitionDelay=(0.12*i)+'s'; });
      pills.forEach(function(p,i){ p.style.transitionDelay=(0.12*i+0.35)+'s'; });
      kpiBoxes.forEach(function(d,i){ d.style.transitionDelay=(0.1*i)+'s'; });
      kpis.forEach(function(p){ var n=parseInt(p[1].match(/\d+/)[0],10); count(0,n,1300,function(v){ p[0].textContent=p[1].replace(/\d+/,v); }); });
    }
    reset();
    new IntersectionObserver(function(en){ if(en[0].isIntersecting){ play(); } else if(en[0].boundingClientRect.top>0){ reset(); } },{threshold:.35}).observe(wyg);
    wyg._replay=function(){ reset(); setTimeout(play,60); };
    wyg._finish=function(){ wyg.classList.remove('wyg-pre'); if(dial){ dial.style.setProperty('--pct',target); dialNum.textContent=target; } bars.forEach(function(p){ p[0].style.width=p[1]; }); kpis.forEach(function(p){ p[0].textContent=p[1]; }); };
  }

  /* Preview guide panel */
  var g=document.createElement('details'); g.className='ux-guide'; g.open=innerWidth>700;
  g.innerHTML='<summary>UX PREVIEW <span>not live</span></summary><div class="ux-body">'+
    '<div class="ux-row">Motion effects<button type="button" class="ux-switch" role="switch" aria-checked="'+on+'" aria-label="Motion effects"></button></div>'+
    '<p>Flip the switch to compare before and after.</p>'+
    '<ol>'+
    '<li><a href="#home-hero">Meter fill buttons</a> <small>(hover, then click)</small></li>'+
    '<li>Scroll down: the menu floats as glass <small>(Opal)</small></li>'+
    '<li>Hover the menu: the underline slides <small>(Surge, calmer)</small></li>'+
    '<li><a href="#solutions">Solutions tabs slide</a> <small>(Opal)</small></li>'+
    '<li>Paper plane send <small>(Dart)</small><button type="button" class="ux-play" data-play="send">Play</button></li>'+
    '<li><a href="#deliverables">Live sample dashboard</a> <small>(Meridian)</small><button type="button" class="ux-play" data-play="dash">Replay</button></li>'+
    '<li><a href="#how">Chaos to Order method</a> <small>(scroll slowly)</small></li>'+
    '<li><a href="#pipeline-check">Pipeline check calculator</a></li>'+
    '<li><a href="#faq">FAQ cards light up and open</a></li>'+
    '</ol><small>Preview only. Nothing here is on exhibitrx.com yet.</small></div>';
  body.appendChild(g);
  var sw=g.querySelector('.ux-switch');
  sw.addEventListener('click',function(){
    on=!on; sw.setAttribute('aria-checked',String(on)); apply(); onScroll();
    try{ localStorage.setItem(KEY,on?'on':'off'); }catch(e){}
    magnets.forEach(function(b){ b.style.transform=''; });
    if(wyg && wyg._finish) wyg._finish();
  });
  g.querySelector('[data-play="send"]').addEventListener('click',function(){
    var strip=document.querySelector('[data-toggle="rescue-form-box"]'), box=document.getElementById('rescue-form-box');
    if(box && box.hidden && strip) strip.click();
    var btn=box && box.querySelector('.ux-send'); if(!btn) return;
    btn.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
    setTimeout(function(){ if(on) fly(btn); },reduce?0:600);
  });
  g.querySelector('[data-play="dash"]').addEventListener('click',function(){
    if(!wyg) return; wyg.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
    if(wyg._replay) setTimeout(wyg._replay,reduce?0:500);
  });
})();

/* ---------- Round 2 ---------- */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function on(){ return document.body.classList.contains('ux-on'); }
  function clamp(v){ return v<0?0:v>1?1:v; }

  /* Chaos to Order: the logo mark and the five stages settle as you scroll through the method */
  var how=document.getElementById('how'), ps=document.getElementById('ps');
  if(how && ps){
    var head=how.querySelector('.head');
    var cols=['#FFFFFF','#008CAF','#00A298'];
    var chaos=[[-26,-14,-34],[-10,22,18],[-30,30,-14],[14,-26,22],[6,10,-28],[-4,34,12],[30,-18,-20],[22,6,30],[34,26,-10]];
    var svg='<svg class="ux-mark" viewBox="0 0 100 100" aria-hidden="true">';
    for(var i=0;i<9;i++){ var c=Math.floor(i/3), r=i%3; svg+='<rect data-i="'+i+'" x="'+(4+c*33)+'" y="'+(4+r*33)+'" width="26" height="26" rx="5" fill="'+cols[c]+'"/>'; }
    svg+='</svg>';
    head.insertAdjacentHTML('afterbegin',svg);
    var rects=[].slice.call(head.querySelectorAll('.ux-mark rect'));
    var lis=[].slice.call(ps.children);
    ps.classList.add('ux-scroll');
    function frame(){
      if(!on()){ return; }
      var r=how.getBoundingClientRect(), vh=innerHeight;
      var p=reduce?1:clamp((vh*0.9-r.top)/(vh*0.75));
      ps.style.setProperty('--line',clamp(p*1.25-0.1));
      lis.forEach(function(li,i){
        var k=clamp(p*6-i*1.05), t=clamp(p*6-i*1.05-0.5);
        li.style.setProperty('--k',k); li.style.setProperty('--t',t);
        li.classList.toggle('ux-done',k>=1);
      });
      rects.forEach(function(el,i){
        var k=clamp(p*2.2-i*0.12), m=1-k, d=chaos[i];
        el.style.transform='translate('+(d[0]*m).toFixed(1)+'px,'+(d[1]*m).toFixed(1)+'px) rotate('+(d[2]*m).toFixed(1)+'deg)';
        el.style.opacity=(0.35+0.65*k).toFixed(2);
      });
    }
    var ticking=false;
    addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ ticking=false; frame(); }); } },{passive:true});
    addEventListener('resize',frame); frame();
  }

  /* Pipeline check calculator */
  var pc=document.getElementById('pc');
  if(pc){
    var conv=document.getElementById('pc-conv'), fast=document.getElementById('pc-fast'), deal=document.getElementById('pc-deal');
    var big=document.getElementById('pc-big'), shown=0, anim=null;
    function money(v){ return v>=1e6?'$'+(v/1e6).toFixed(1)+'M':'$'+Math.round(v/1e3)+'K'; }
    function fill(el){ el.style.setProperty('--fill',((el.value-el.min)/(el.max-el.min)*100)+'%'); }
    function calc(){
      var c=+conv.value, f=+fast.value/100, d=+deal.value*1000;
      var q=c*0.30, now=q*(f*0.20+(1-f)*0.05), best=q*0.20, lost=(best-now)*d;
      document.getElementById('pc-conv-o').textContent=c;
      document.getElementById('pc-fast-o').textContent=Math.round(f*100)+'%';
      document.getElementById('pc-deal-o').textContent=money(d);
      var lo=Math.round(best-now);
      document.getElementById('pc-opps').textContent=lo===1?'1 opportunity':lo+' opportunities';
      document.getElementById('pc-n1').textContent=Math.round(now);
      document.getElementById('pc-n2').textContent=Math.round(best);
      document.getElementById('pc-b1').style.width=(best?now/best*100:0)+'%';
      document.getElementById('pc-b2').style.width='100%';
      [conv,fast,deal].forEach(fill);
      if(reduce||!on()){ big.textContent=money(lost); shown=lost; return; }
      var from=shown, t0=performance.now(); cancelAnimationFrame(anim);
      (function step(n){ var k=Math.min(1,(n-t0)/450), e=1-Math.pow(1-k,3); shown=from+(lost-from)*e; big.textContent=money(shown); if(k<1) anim=requestAnimationFrame(step); })(t0);
    }
    [conv,fast,deal].forEach(function(el){ el.addEventListener('input',calc); });
    calc();
  }

  /* FAQ cards that light up from where the cursor enters, and open like an accordion */
  var faq=document.querySelector('#faq .faq');
  if(faq){
    faq.classList.add('ux-acc');
    [].slice.call(faq.querySelectorAll('.faq-item')).forEach(function(item,i){
      var h=item.querySelector('h3'), p=item.querySelector('p'); if(!h||!p) return;
      var id='faq-a'+i;
      h.innerHTML='<button type="button" class="faq-q" aria-expanded="false" aria-controls="'+id+'"><span>'+h.innerHTML+'</span><span class="faq-ic" aria-hidden="true"></span></button>';
      var wrap=document.createElement('div'); wrap.className='ux-ans'; wrap.id=id;
      var inner=document.createElement('div'); p.parentNode.insertBefore(wrap,p); inner.appendChild(p); wrap.appendChild(inner);
      h.style.margin='0';
      var btn=h.querySelector('.faq-q');
      function setOpen(o){ item.classList.toggle('ux-open',o); btn.setAttribute('aria-expanded',String(o)); }
      btn.addEventListener('click',function(){ if(!on()) return; setOpen(!item.classList.contains('ux-open')); });
      item.addEventListener('mouseenter',function(e){ var r=item.getBoundingClientRect(); item.style.setProperty('--gx',(e.clientX-r.left)+'px'); item.style.setProperty('--gy',(e.clientY-r.top)+'px'); });
      if(i===0) setOpen(true);
    });
  }
})();
