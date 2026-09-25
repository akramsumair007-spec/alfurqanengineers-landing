/* Small progressive enhancements. No tracking, external libraries or form backend. */
(() => {
  'use strict';
  const c = window.SITE;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); };
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation'); nav.classList.toggle('open',open); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav.classList.contains('open')) {closeMenu();menu.focus();} });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click',closeMenu));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
    let count=0;
    document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;if(!card.hidden)count++; });
    document.querySelector('#project-count').textContent = `${count} project${count===1?'':'s'}`;
  }));
  const dialog = document.querySelector('#project-dialog');
  let opener;
  // Use textContent for editable text, so config entries cannot inject HTML.
  function element(tag, text, cls) { const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el; }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const p=c.projects.find(p=>p.id===button.dataset.project);if(!p || !dialog)return;
    opener=button;const content=document.querySelector('#dialog-content');content.replaceChildren();
    content.append(element('span',p.category,'category'));const title=element('h2',p.title);title.id='dialog-title';content.append(title,element('p',p.location));
    const gallery=element('div','','dialog-gallery');
    p.images.forEach(key=>{const i=c.images[key];const figure=element('figure');const image=element('img');image.src=i.url;image.alt=i.alt;image.loading='lazy';image.width=900;image.height=600;const caption=element('figcaption',c.copy.photoLabel+' · ');const credit=element('a',i.credit);credit.href=i.source;credit.target='_blank';credit.rel='noopener noreferrer';caption.append(credit);figure.append(image,caption);gallery.append(figure);});
    content.append(gallery,element('p',p.description),element('p',c.copy.projectPending,'small-note'));
    const link=element('a',c.copy.quote+' ↗','button primary');link.href='contact.html';link.style.marginTop='24px';content.append(link);
    dialog.showModal();document.body.classList.add('modal-open');
  }));
  dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus();});
  dialog?.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  const form=document.querySelector('#enquiry-form');
  if(form){
    const service=new URLSearchParams(location.search).get('service');if(c.services.some(s=>s.id===service))form.elements.service.value=service;
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const f=new FormData(form);const selected=c.services.find(s=>s.id===f.get('service'));
      const body=`Project enquiry — ${c.company.name}\n\nName: ${f.get('name')}\nPhone: ${f.get('phone')}\nEmail: ${f.get('email')}\nService: ${selected?.name || f.get('service')}\n\nProject details:\n${f.get('message')}`;
      const uri=`mailto:${encodeURIComponent(c.company.email)}?subject=${encodeURIComponent('Project enquiry — '+(selected?.name||'Construction'))}&body=${encodeURIComponent(body)}`;
      document.querySelector('#draft').value=body;
      document.querySelector('#email-draft').href=uri;
      const status=document.querySelector('#form-status');status.textContent=c.company.emailIsPlaceholder?c.copy.draftReady:c.copy.draftReadyLive;
      document.querySelector('#form-result').hidden=false;status.setAttribute('tabindex','-1');status.focus();
      // The user explicitly opens their email client and sends; nothing is submitted automatically.
    });
    document.querySelector('#copy-enquiry').addEventListener('click',async()=>{
      const draft=document.querySelector('#draft');const status=document.querySelector('#form-status');
      try{await navigator.clipboard.writeText(draft.value);status.textContent=c.copy.copySuccess;}catch{draft.focus();draft.select();status.textContent=c.copy.copyFailure;}
    });
  }
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.animationPlayState='running';observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>{el.style.animationPlayState='paused';observer.observe(el);});
  }
})();
