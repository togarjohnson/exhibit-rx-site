/* Mobile menu: adds a Menu button that opens the nav links on screens 900px and narrower */
(function(){
  var nav=document.querySelector('.nav'), links=nav&&nav.querySelector('.navlinks');
  if(!links) return;
  links.id=links.id||'site-menu';
  var btn=document.createElement('button');
  btn.type='button'; btn.className='navtoggle';
  btn.setAttribute('aria-controls',links.id); btn.setAttribute('aria-expanded','false');
  btn.innerHTML='<span class="navtoggle-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="navtoggle-label">Menu</span>';
  links.parentNode.insertBefore(btn,links);
  function set(open){
    nav.classList.toggle('nav-open',open);
    btn.setAttribute('aria-expanded',String(open));
    btn.querySelector('.navtoggle-label').textContent=open?'Close':'Menu';
  }
  btn.addEventListener('click',function(){ set(!nav.classList.contains('nav-open')); });
  links.addEventListener('click',function(e){ if(e.target.closest('a')) set(false); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&nav.classList.contains('nav-open')){ set(false); btn.focus(); } });
  document.addEventListener('click',function(e){ if(nav.classList.contains('nav-open')&&!nav.contains(e.target)) set(false); });
  addEventListener('resize',function(){ if(innerWidth>900) set(false); });
})();

/* GA4: count clicks on any Show Diagnosis (Calendly) booking link */
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href*="calendly.com"]');
  if(!a||typeof gtag!=='function') return;
  gtag('event','show_diagnosis_click',{link_url:a.href,link_text:(a.textContent||'').trim().slice(0,100),page_path:location.pathname});
});
