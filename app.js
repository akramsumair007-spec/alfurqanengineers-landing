/* Small progressive enhancements. Contact delivery uses the configured EmailJS service; no mailbox secrets belong here. */
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
    p.images.forEach(key=>{const i=c.images[key];const figure=element('figure');const image=element('img');image.src=i.url;image.alt=i.alt;image.loading='lazy';image.width=900;image.height=600;const caption=element('figcaption',(i.generic ? c.copy.photoLabel : (i.label || c.copy.companyPhotoLabel))+' · ');const credit=element(i.source?'a':'span',i.credit);if(i.source){credit.href=i.source;credit.target='_blank';credit.rel='noopener noreferrer';}caption.append(credit);figure.append(image,caption);gallery.append(figure);});
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
    let sending=false;
    const status=document.querySelector('#form-status');
    const submit=form.querySelector('[type="submit"]');
    function showStatus(message){
      document.querySelector('#form-result').hidden=false;
      status.textContent=message;
      status.focus();
    }
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      if(sending || !form.reportValidity())return;
      const delivery=c.contactDelivery;
      if(!delivery?.serviceId || !delivery?.templateId || !delivery?.publicKey){
        showStatus('Online submission is temporarily unavailable. Please email info@alfurqanengineers.com or call our office.');return;
      }
      const f=new FormData(form);
      if(f.get('website'))return;
      const selected=c.services.find(s=>s.id===f.get('service'));
      const params={name:String(f.get('name')).trim(),phone:String(f.get('phone')).trim(),reply_to:String(f.get('email')).trim(),service:selected?.name || String(f.get('service')),message:String(f.get('message')).trim()};
      if(!params.name || !params.message){showStatus('Please enter your name and project details.');return;}
      sending=true;submit.disabled=true;submit.textContent='Sending…';form.setAttribute('aria-busy','true');
      showStatus('Sending your enquiry…');
      const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),30000);
      try{
        const response=await fetch('https://api.emailjs.com/api/v1.0/email/send',{
          method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
          body:JSON.stringify({service_id:delivery.serviceId,template_id:delivery.templateId,user_id:delivery.publicKey,template_params:params})
        });
        if(!response.ok)throw new Error('Delivery not accepted');
        form.reset();showStatus('Thank you. Your enquiry has been submitted. Our team will get back to you.');
      }catch(error){
        showStatus(error.name==='AbortError' ? 'We could not confirm delivery. Your details are still here. Please contact our office before retrying to avoid a duplicate enquiry.' : 'Your enquiry could not be submitted. Your details are still here. Please try again or email info@alfurqanengineers.com.');
      }finally{
        clearTimeout(timeout);sending=false;submit.disabled=false;submit.textContent='Submit';form.removeAttribute('aria-busy');
      }
    });
  }
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.animationPlayState='running';observer.unobserve(entry.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>{el.style.animationPlayState='paused';observer.observe(el);});
  }
})();
