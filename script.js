/* ---------- Helpers ---------- */
function normalizePhone(input, defaultCountry = '91') {
  let digits = String(input || '').replace(/\D/g, '');
  if (!digits) return '';
  digits = digits.replace(/^0+/, '');
  if (digits.length === 10) digits = defaultCountry + digits;
  return digits;
}
async function loadJSON(path) {
  try {
    const res = await fetch(path + '?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch ' + path + ' ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn('loadJSON failed:', path, err);
    return {};
  }
}
function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const parts = u.pathname.split('/');
    const i = parts.indexOf('embed');
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
  } catch (e) {}
  return '';
}
/* ---------- Common ---------- */
async function hydrateCommon() {
  const settings = await loadJSON('content/settings.json');
  const biz = settings.business || {};
  document.querySelectorAll('#siteTitle').forEach(el => { if (biz.name) el.textContent = biz.name; });
  document.querySelectorAll('[data-ig]').forEach(a => biz.instagram && (a.href = biz.instagram));
  document.querySelectorAll('[data-email]').forEach(a => biz.email && (a.href = 'mailto:' + biz.email));
  document.querySelectorAll('[data-wa]').forEach(btn => {
    const phone = normalizePhone(biz.phone || '');
    if (phone) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = encodeURIComponent('Hi! I’d like to book a makeup appointment.');
        let url = `https://wa.me/${phone}?text=${msg}`;
        const win = window.open(url, '_blank');
        if (!win) {
          url = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
          window.location.href = url;
        }
      });
    } else {
      btn.setAttribute('disabled', 'disabled');
    }
  });
  const cityEl = document.getElementById('cityAreas'); if (cityEl) cityEl.textContent = [biz.city, biz.areas].filter(Boolean).join(' — ');
  const hoursEl = document.getElementById('hours'); if (hoursEl) hoursEl.textContent = biz.hours || '';
  const heroImg = document.getElementById('heroImg'); if (heroImg && settings.hero_image) heroImg.src = settings.hero_image;
  const tagline = document.getElementById('tagline'); if (tagline) tagline.textContent = settings.business?.tagline || '';
}
/* ---------- About ---------- */
async function hydrateAbout(){const acc=await loadJSON('content/accolades.json');const list=(acc&&acc.items&&acc.items.length)?acc.items:["Bridal Specialist — 250+ happy brides","Editorial & Photoshoot Experience","Cruelty-Free, Skin-first Approach","Premium HD/Waterproof Products"];const ul=document.getElementById('accoladesList');if(ul){ul.innerHTML='';list.forEach(item=>{const li=document.createElement('li');li.textContent=item;li.className='py-2';ul.appendChild(li);});}const press=await loadJSON('content/press.json');const grid=document.getElementById('pressGrid');const pressItems=(press&&press.items&&press.items.length)?press.items:[{ image: 'assets/uploads/press1.png', alt: 'Press 1', link: '#' }];if(grid){grid.innerHTML='';pressItems.forEach(p=>{const a=document.createElement('a');a.href=p.link||'#';a.target='_blank';a.rel='noopener';a.className='card-hover flex items-center justify-center bg-white rounded-2xl p-6';const img=document.createElement('img');img.src=p.image;img.alt=p.alt||'press';img.style.maxHeight='48px';img.style.width='auto';a.appendChild(img);grid.appendChild(a);});}}
/* ---------- Gallery ---------- */
async function hydrateGallery(){const gal=await loadJSON('content/gallery.json');const grid=document.getElementById('galleryGrid');if(grid){const list=(gal&&gal.images)?gal.images:[];grid.innerHTML='';list.forEach(item=>{const url=(item.image||item).toString();const img=document.createElement('img');img.src=url;img.alt='portfolio';img.className='card-hover';grid.appendChild(img);});}}
/* ---------- Services ---------- */
async function hydrateServices(){const s=await loadJSON('content/services.json');const grid=document.getElementById('servicesGrid');if(grid){grid.innerHTML='';(s.items||[]).forEach(svc=>{const card=document.createElement('div');card.className='card card-hover bg-white';card.innerHTML=`<div class="text-sm text-fuchsia-600 font-semibold">Signature</div><h3 class="serif text-2xl font-bold mt-2">${svc.name}</h3>${svc.desc?`<p class='mt-2 text-gray-600'>${svc.desc}</p>`:''}${svc.price?`<div class='mt-4 text-3xl font-bold'>${svc.price}</div>`:''}`;grid.appendChild(card);});}}
/* ---------- FAQ ---------- */
async function hydrateFAQ(){const data=await loadJSON('content/faq.json');const list=data.items||[];const wrap=document.getElementById('faqWrap');if(wrap){wrap.innerHTML='';list.forEach(qa=>{const card=document.createElement('div');card.className='card';card.innerHTML=`<button class="faq-q flex items-center justify-between w-full text-left font-semibold"><span>${qa.q}</span><svg class="w-5 h-5 transition-transform"><path d="M6 9l6 6 6-6"/></svg></button><div class="faq-a hidden mt-3 text-gray-600">${qa.a}</div>`;const btn=card.querySelector('.faq-q');const ans=card.querySelector('.faq-a');btn.addEventListener('click',()=>ans.classList.toggle('hidden'));wrap.appendChild(card);});}}
/* ---------- Students ---------- */
async function hydrateStudents(){const data=await loadJSON('content/students.json');const grid=document.getElementById('studentsGrid');if(grid){grid.innerHTML='';(data.items||[]).forEach(st=>{const card=document.createElement('div');card.className='student-card card card-hover';card.innerHTML=`<img src="${st.image}" alt="${st.name}"><div class="mt-3 flex items-center justify-between"><div><div class="font-semibold">${st.name}</div>${st.cohort?`<div class="badge mt-1">${st.cohort}</div>`:''}</div>${st.instagram?`<a href="${st.instagram}" target="_blank" rel="noopener" title="Instagram"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm5 3a5 5 0 100 10 5 5 0 000-10zm6.5-.9a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z"/></svg></a>`:''}</div>${st.quote?`<p class="text-gray-600 mt-3">${st.quote}</p>`:''}`;grid.appendChild(card);});}}
/* ---------- Tutorials + Tips (supports YouTube OR uploaded MP4) ---------- */
async function hydrateTutorials(){
  const data=await loadJSON('content/tutorials.json');
  const tips=await loadJSON('content/tips.json');
  const grid=document.getElementById('tutorialGrid');
  const tipWrap=document.getElementById('tipsWrap');
  const tabs=document.querySelectorAll('.tab[data-cat]');
  let current='Eyes';

  function render(){
    if(grid){
      grid.innerHTML='';
      const list=(data.items||[]).filter(it=>it.category===current);
      list.forEach(it=>{
        const vid = (it.youtube && it.youtube.trim()) ? (function(u){try{u=new URL(u); if(u.hostname.includes('youtu.be')) return u.pathname.slice(1); if(u.searchParams.get('v')) return u.searchParams.get('v'); const p=u.pathname.split('/'); const i=p.indexOf('embed'); return (i>=0 && p[i+1])?p[i+1]:'';}catch(e){return'';}})(it.youtube) : '';
        const wrapper=document.createElement('div');
        wrapper.className='card card-hover';

        if (it.video && !vid){ // uploaded mp4
          wrapper.innerHTML = `<video controls style="width:100%;border-radius:1rem;background:#000" src="${it.video}"></video>
            <div class="mt-3"><h3 class="font-semibold">${it.title||''}</h3></div>`;
        } else {
          const thumb = it.thumb || (vid?('https://img.youtube.com/vi/'+vid+'/hqdefault.jpg') : '');
          wrapper.innerHTML = `<img src="${thumb}" class="tutorial-thumb" alt="${it.title}">
            <div class="mt-3">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold">${it.title||''}</h3>
                <div class="text-xs text-gray-500">${it.difficulty||''} ${it.duration?('• '+it.duration):''}</div>
              </div>
              ${it.steps&&it.steps.length?('<ol class="mt-2 text-sm text-gray-600">'+it.steps.map(s=>'<li>• '+s+'</li>').join('')+'</ol>'):''}
              ${vid?('<a href="https://www.youtube.com/watch?v='+vid+'" target="_blank" class="mt-3 inline-block underline">Watch on YouTube</a>'):''}
            </div>`;
        }
        grid.appendChild(wrapper);
      });
    }
    if(tipWrap){
      tipWrap.innerHTML='';
      (tips.items||[]).forEach(t=>{
        const c=document.createElement('div');
        c.className='card tip-card';
        c.innerHTML=`<div class="font-semibold">${t.title}</div><p class="text-gray-600 mt-1">${t.body}</p>`;
        tipWrap.appendChild(c);
      });
    }
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    current=tab.dataset.cat;
    render();
  }));

  render();
}
/* ---------- Products ---------- */
async function hydrateProducts(){const data=await loadJSON('content/products.json');const grid=document.getElementById('productsGrid');const chipWrap=document.getElementById('productChips');if(!data||!grid)return;const cats=Array.from(new Set((data.items||[]).map(i=>i.category))).sort();let current='All';function render(){grid.innerHTML='';(data.items||[]).filter(p=>current==='All'||p.category===current).forEach(p=>{const card=document.createElement('div');card.className='card card-hover';card.innerHTML=`<img class="product-thumb" src="${p.image||''}" alt="${p.name||''}"><div class="mt-3"><div class="text-sm text-fuchsia-600 font-semibold">${p.category||''}</div><h3 class="serif text-xl font-bold mt-1">${p.brand||''} — ${p.name||''}</h3>${p.notes?`<p class="text-gray-600 mt-1">${p.notes}</p>`:''}${p.link?`<a href="${p.link}" target="_blank" rel="noopener nofollow" class="mt-3 inline-block underline">Buy</a>`:''}</div>`;grid.appendChild(card);});}if(chipWrap){chipWrap.innerHTML='';const all=document.createElement('button');all.className='chip active';all.textContent='All';chipWrap.appendChild(all);all.addEventListener('click',()=>{current='All';[...chipWrap.children].forEach(c=>c.classList.remove('active'));all.classList.add('active');render();});cats.forEach(cat=>{const b=document.createElement('button');b.className='chip';b.textContent=cat;b.addEventListener('click',()=>{current=cat;[...chipWrap.children].forEach(c=>c.classList.remove('active'));b.classList.add('active');render();});chipWrap.appendChild(b);});}render();}
/* ---------- Testimonials ---------- */
async function hydrateTestimonials(){const data=await loadJSON('content/testimonials.json');const grid=document.getElementById('testiGrid');const title=document.getElementById('testiTitle');const sub=document.getElementById('testiSubtitle');if(title&&data.title)title.textContent=data.title;if(sub&&data.subtitle)sub.textContent=data.subtitle;if(grid){grid.innerHTML='';(data.items||[]).forEach(t=>{const card=document.createElement('div');card.className='testi-card card card-hover';const stars=Number(t.rating||0);const starsHTML=Array.from({length:5}).map((_,i)=>i<stars?'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .6l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 16.9 5.8 19.7 7 12.8 2 7.9l6.9-1z"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 16.9 5.8 19.7 7 12.8 2 7.9l6.9-1z"/></svg>').join('');card.innerHTML=`<div class="flex items-center gap-3"><img src="${t.avatar||''}" alt="${t.name||''}" style="width:52px;height:52px;border-radius:9999px;object-fit:cover;"><div><div class="font-semibold">${t.name||''}</div><div class="text-xs text-gray-500">${t.role||''}</div></div></div><div class="mt-3 text-gray-700">${t.quote||''}</div><div class="mt-3 stars text-fuchsia-600">${starsHTML}</div>`;grid.appendChild(card);});}}

/* ---------- Navigation (admin-editable) ---------- */
async function hydrateNavigation() {
  const data = await loadJSON('content/navigation.json');
  let items = (data.items || []).slice().sort((a,b)=>(a.order||0)-(b.order||0));
  if (!items.length){
    items = [
      {label:'About', href:'index.html', in_header:true, in_quick:false},
      {label:'Services', href:'services.html', in_header:true, in_quick:true},
      {label:'Gallery', href:'gallery.html', in_header:true, in_quick:true},
      {label:'Student Work', href:'student-work.html', in_header:true, in_quick:true},
      {label:'Tutorials', href:'tutorials.html', in_header:true, in_quick:true},
      {label:'Products', href:'products.html', in_header:true, in_quick:true},
      {label:'Client Love', href:'client-love.html', in_header:true, in_quick:true},
      {label:'FAQ', href:'faq.html', in_header:true, in_quick:true},
      {label:'Book', href:'contact.html', in_header:true, in_quick:true}
    ];
  }

  // Desktop header nav
  const header = document.querySelector('header');
  const desktop = header ? header.querySelector('nav:not(#mobileNav)') : null;
  if (desktop){
    desktop.innerHTML = '';
    items.filter(i=>i.in_header).forEach(i=>{
      const a = document.createElement('a');
      a.href = i.href;
      a.textContent = i.label;
      if (/contact\.html/i.test(i.href) || /book/i.test(i.label)){
        a.className = 'px-4 py-2 rounded-xl text-white';
        a.style.background = 'linear-gradient(90deg,var(--brand),var(--accent))';
      } else {
        a.className = 'hover:text-fuchsia-600';
      }
      desktop.appendChild(a);
    });
  }

  // Mobile nav
  const mobile = document.getElementById('mobileNav');
  if (mobile){
    mobile.innerHTML = '';
    items.forEach(i=>{
      const a = document.createElement('a');
      a.href = i.href;
      if (/contact\.html/i.test(i.href) || /book/i.test(i.label)){
        a.style.display = 'block';
        a.style.padding = '12px 0';
        a.style.marginTop = '8px';
        a.innerHTML = '<span style="display:inline-block;width:100%;text-align:center;padding:12px 16px;border-radius:12px;color:#fff;background:linear-gradient(90deg,var(--brand),var(--accent))">'+i.label+'</span>';
      } else {
        a.textContent = i.label;
        a.style.cssText = 'display:block;padding:12px 0;border-bottom:1px solid #eee;color:#111;';
      }
      mobile.appendChild(a);
    });
  }

  // Global Quick Links tiles
  (function(){
    // If page already has quick grid, do not duplicate
    if (document.querySelector('.quick-grid')) return;
    const header = document.querySelector('header');
    if (!header) return;
    const wrap = document.createElement('section');
    wrap.id = 'quickLinksGlobal';
    wrap.setAttribute('role','navigation');
    wrap.setAttribute('aria-label','Quick links');
    wrap.style.cssText = 'margin-top:72px;padding:8px 0 18px;background:linear-gradient(180deg,#fff,rgba(255,255,255,.92));position:relative;z-index:10;';
    const inner = document.createElement('div');
    inner.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
    const grid = document.createElement('div');
    grid.className = 'quick-grid';
    items.filter(i=>i.in_quick).forEach(i=>{
      const a = document.createElement('a');
      a.className='quick-tile';
      a.href = i.href;
      a.textContent = i.label;
      grid.appendChild(a);
    });
    inner.appendChild(grid);
    wrap.appendChild(inner);
    header.insertAdjacentElement('afterend', wrap);
  })();
}

/* ---------- Custom page renderer ---------- */
function getParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name) || '';
}
function mdToHtml(md){
  if (!md) return '';
  // very light conversion: paragraphs and line breaks; simple **bold** and _italic_
  let h = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/_(.+?)_/g,'<em>$1</em>');
  h = h.split(/\n{2,}/).map(p=>'<p>'+p.replace(/\n/g,'<br>')+'</p>').join('');
  return h;
}
async function hydrateCustomPage(){
  const slug = getParam('p') || getParam('slug');
  if (!slug) return;
  const data = await loadJSON('content/pages/'+slug+'.json');
  if (!data || !data.title) return;
  const t = document.getElementById('customTitle'); if (t) t.textContent = data.title;
  const s = document.getElementById('customSubtitle'); if (s) s.textContent = data.subtitle||'';
  if (data.hero_image){
    const wrap = document.getElementById('customHeroWrap');
    const hi = document.getElementById('customHero');
    if (wrap && hi){ hi.src = data.hero_image; wrap.classList.remove('hidden'); }
  }
  const body = document.getElementById('customBody');
  if (body){
    if (data.body && /<\w+/.test(data.body)) body.innerHTML = data.body;
    else body.innerHTML = mdToHtml(data.body||'');
  }
  const gal = document.getElementById('customGallery');
  if (gal && Array.isArray(data.gallery)){
    data.gallery.forEach(g=>{
      const img = document.createElement('img');
      img.src = (g.image || g);
      img.alt = data.title;
      img.className = 'rounded-2xl shadow-md';
      gal.appendChild(img);
    });
  }
}

/* ---------- Init + Mobile Menu ---------- */
document.addEventListener('DOMContentLoaded',()=>{
  hydrateCommon();
  hydrateNavigation();

  const page=document.body.dataset.page;
  if(page==='about')hydrateAbout();
  if(page==='gallery')hydrateGallery();
  if(page==='faq')hydrateFAQ();
  if(page==='services')hydrateServices();
  if(page==='students')hydrateStudents();
  if(page==='tutorials')hydrateTutorials();
  if(page==='products')hydrateProducts();
  if(page==='testimonials')hydrateTestimonials();
  if(page==='custom')hydrateCustomPage();
  const yearEl=document.getElementById('year'); if(yearEl) yearEl.textContent=new Date().getFullYear();

  // Mobile menu (robust overlay)
  (function(){
    const panel=document.getElementById('mobileMenu');
    const openBtn=document.getElementById('mobileBtn');
    const closeBtn=document.getElementById('mobileClose')||(panel?panel.querySelector('[aria-label="Close menu"]'):null);
    let backdrop=document.getElementById('mobileBackdrop');
    if(!panel||!openBtn) return;
    Object.assign(panel.style,{position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'#fff',overflow:'auto',zIndex:'2147483647'});
    if(!backdrop){
      backdrop=document.createElement('div'); backdrop.id='mobileBackdrop';
      Object.assign(backdrop.style,{display:'none',position:'fixed',top:'0',left:'0',right:'0',bottom:'0',background:'rgba(0,0,0,.30)',zIndex:'2147483646'});
      const header=panel.closest('header')||document.body; header.insertBefore(backdrop,panel);
    }
    function openMenu(){ panel.style.display='block'; backdrop.style.display='block'; document.documentElement.classList.add('overflow-hidden'); document.body.classList.add('overflow-hidden'); }
    function closeMenu(){ panel.style.display='none'; backdrop.style.display='none'; document.documentElement.classList.remove('overflow-hidden'); document.body.classList.remove('overflow-hidden'); }
    openBtn.addEventListener('click', openMenu);
    closeBtn && closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);
    panel.addEventListener('click', (e)=>{ if(e.target.closest('a')) closeMenu(); });

  // Global Quick Links on every page (skip if already present in HTML)
  (function(){
    if (document.querySelector('.quick-grid')) return; // page already has one
    const header = document.querySelector('header');
    if (!header) return;
    const wrap = document.createElement('section');
    wrap.id = 'quickLinksGlobal';
    wrap.setAttribute('role','navigation');
    wrap.setAttribute('aria-label','Quick links');
    // push below fixed header; keep above following section
    wrap.style.cssText = 'margin-top:72px;padding:8px 0 18px;background:linear-gradient(180deg,#fff,rgba(255,255,255,.92));position:relative;z-index:10;';
    wrap.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="quick-grid">
          <a class="quick-tile" href="services.html">Services</a>
          <a class="quick-tile" href="gallery.html">Gallery</a>
          <a class="quick-tile" href="student-work.html">Student Work</a>
          <a class="quick-tile" href="tutorials.html">Tutorials</a>
          <a class="quick-tile" href="products.html">Products</a>
          <a class="quick-tile" href="client-love.html">Client Love</a>
          <a class="quick-tile" href="faq.html">FAQ</a>
          <a class="quick-tile" href="contact.html">Book</a>
        </div>
      </div>`;
    header.insertAdjacentElement('afterend', wrap);
  })();

  })();
});
