const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('hide'),700));
const nav=$('#nav'),progress=$('#scrollProgress'),glow=$('#cursorGlow');
window.addEventListener('mousemove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
window.addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;nav.classList.toggle('scrolled',y>50);progress.style.width=(h?y/h*100:0)+'%';const hero=$('.hero-video');if(hero)hero.style.transform=`scale(1.04) translateY(${y*.055}px)`});
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));
$('#menuBtn').addEventListener('click',()=>$('#navLinks').classList.toggle('open'));$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('#navLinks').classList.remove('open')));
// navegación activa según sección
const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('#navLinks a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-35% 0px -55% 0px'});sections.forEach(s=>sectionObserver.observe(s));
// Tilt suave para fotos y tarjetas
$$('[data-tilt]').forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1200px) rotateX(${y*-4}deg) rotateY(${x*5}deg) translateY(-6px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
// Efecto magnético
$$('.magnetic-btn').forEach(btn=>{btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});btn.addEventListener('mouseleave',()=>btn.style.transform='')});
// Tarjetas de esencia reaccionan al puntero
$$('.ingredient-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%')}));
// Cámara lenta real en el video de textura
const textureVideo=$('#textureVideo'),speedBtn=$('#speedBtn');let slow=false;speedBtn.addEventListener('click',()=>{slow=!slow;textureVideo.playbackRate=slow?.55:1;speedBtn.innerHTML=slow?'CÁMARA LENTA · 0.55× <span>◉</span>':'VELOCIDAD NORMAL · 1× <span>◉</span>'});
// Contadores cuando entran a pantalla
let counted=false;const statObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting||counted)return;counted=true;$$('[data-count]').forEach(el=>{const target=+el.dataset.count;let start=0,duration=1000,t0=performance.now();function tick(t){const p=Math.min((t-t0)/duration,1);el.textContent=Math.round((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)})},{threshold:.4});const statRow=$('.stat-row');if(statRow)statObserver.observe(statRow);
// Botón final + micro feedback
$('#tasteBtn').addEventListener('click',()=>{const t=$('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)});
// Pausa/reanuda el video de textura al salir de pantalla para ahorrar recursos
const videoObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)textureVideo.play().catch(()=>{});else textureVideo.pause()}),{threshold:.08});videoObserver.observe(textureVideo);
// Fallback visual si un navegador bloquea el video
$$('video').forEach(v=>v.addEventListener('error',()=>v.classList.add('video-failed')));

// V3: fallback automático para imágenes externas que no carguen
$$('img[data-fallback]').forEach(img=>{
  img.addEventListener('error',()=>{
    const fallback=img.dataset.fallback;
    if(!fallback || img.dataset.fallbackUsed)return;
    img.dataset.fallbackUsed='1';
    img.src=fallback;
  },{once:false});
});
$$('img:not([data-fallback])').forEach(img=>img.addEventListener('error',()=>img.classList.add('image-failed')));


// V6 — interacción premium de equipo
const teamPanel=$('#teamPanel');
const teamMembers=$$('.team-member');
const teamSelected=$('#teamSelected');
const teamMessage=$('#teamMessage');
const teamMessages={
  Darling:'Parte de la idea que convierte la chinola en una experiencia.',
  Jordany:'Creatividad y energía detrás de cada detalle de CHINOLA.',
  Abdiel:'Una pieza clave para darle forma y personalidad al proyecto.',
  Richard:'Organización, visión y ganas de llevar CHINOLA más lejos.'
};
if(teamPanel){
  teamPanel.addEventListener('pointermove',e=>{const r=teamPanel.getBoundingClientRect();teamPanel.style.setProperty('--team-x',`${((e.clientX-r.left)/r.width)*100}%`);teamPanel.style.setProperty('--team-y',`${((e.clientY-r.top)/r.height)*100}%`)});
  teamPanel.addEventListener('pointerleave',()=>{teamPanel.style.setProperty('--team-x','50%');teamPanel.style.setProperty('--team-y','30%')});
}
teamMembers.forEach(member=>member.addEventListener('click',()=>{
  teamMembers.forEach(m=>m.classList.remove('active')); member.classList.add('active');
  const person=member.dataset.person;
  [teamSelected,teamMessage].forEach(el=>el&&el.classList.add('team-changing'));
  setTimeout(()=>{if(teamSelected)teamSelected.textContent=person;if(teamMessage)teamMessage.textContent=teamMessages[person]||'Parte del equipo CHINOLA.';[teamSelected,teamMessage].forEach(el=>el&&el.classList.remove('team-changing'));},120);
}));

// V7/V20.3 — pedidos: selección de sabores + cantidades por mousse
const orderFormV7=$('#orderForm');
if(orderFormV7){
  const nameInput=$('#orderName');
  const qty=$('#orderQty');
  const delivery=$('#orderDelivery');
  const phone=$('#orderPhone');
  const note=$('#orderNote');
  const status=$('#formStatus');
  const btn=orderFormV7.querySelector('.order-btn');
  const heading=orderFormV7.querySelector('.form-heading');
  const flavorOptions=[...orderFormV7.querySelectorAll('.flavor-option')];
  const flavorSelectionText=$('#flavorSelectionText');
  const flavorTotal=$('#flavorTotal');
  const orderPrice=$('#orderPrice');

  if(heading){
    heading.insertAdjacentHTML('beforeend','<div class="form-step"><span class="active"></span><span></span><span></span><span></span></div>');
  }

  // Estado de cada sabor. El cliente puede combinar los tres.
  const flavorState={Chinola:{qty:0,size:'small'},Coco:{qty:0,size:'small'},'Café':{qty:0,size:'small'}};

  const getFlavorSummary=()=>Object.entries(flavorState).filter(([,item])=>item.qty>0);
  const getTotal=()=>Object.values(flavorState).reduce((sum,item)=>sum+item.qty,0);
  const getPrice=()=>flavorOptions.reduce((sum,card)=>{ const flavor=card.dataset.flavor; const item=flavorState[flavor]; const price=Number(card.dataset[item.size==='large'?'large':'small'])||0; return sum+(item.qty||0)*price; },0);
  const money=value=>`RD$${value.toLocaleString('es-DO')}`;

  const updateFlavors=()=>{
    const selected=getFlavorSummary();
    const total=getTotal();
    const price=getPrice();
    qty.value=total;
    flavorOptions.forEach(card=>{
      const flavor=card.dataset.flavor;
      const item=flavorState[flavor];
      const count=item.qty||0;
      const countEl=card.querySelector('[data-count]');
      if(countEl) countEl.textContent=count;
      card.classList.toggle('selected',count>0);
    });
    flavorSelectionText.textContent=selected.length
      ? selected.map(([flavor,item])=>`${flavor} × ${item.qty} (${item.size==='large'?'Grande':'Pequeño'})`).join(' · ')
      : 'Ningún sabor seleccionado';
    flavorTotal.textContent=`${total} mousse${total===1?'':'s'} · ${money(price)}`;
    if(orderPrice) orderPrice.textContent=money(price);
    updateProgress();
  };

  // Indicador de progreso
  const steps=[...orderFormV7.querySelectorAll('.form-step span')];
  const updateProgress=()=>{
    const done=[nameInput?.value.trim(),getTotal()>0,delivery?.value,phone?.value.trim()].filter(Boolean).length;
    steps.forEach((dot,i)=>dot.classList.toggle('active',i<Math.max(1,Math.min(done,steps.length))));
  };

  flavorOptions.forEach(card=>{
    const flavor=card.dataset.flavor;
    card.addEventListener('click',e=>{
      if(e.target.closest('.flavor-minus')||e.target.closest('.flavor-plus')) return;
      flavorState[flavor].qty=flavorState[flavor].qty>0?0:1;
      updateFlavors();
    });
    card.querySelector('.flavor-plus')?.addEventListener('click',()=>{
      flavorState[flavor].qty+=1;
      updateFlavors();
    });
    card.querySelector('.flavor-minus')?.addEventListener('click',()=>{
      flavorState[flavor].qty=Math.max(0,flavorState[flavor].qty-1);
      updateFlavors();
    });
    card.querySelectorAll('.size-btn').forEach(sizeBtn=>sizeBtn.addEventListener('click',e=>{
      e.stopPropagation();
      flavorState[flavor].size=sizeBtn.dataset.size;
      card.querySelectorAll('.size-btn').forEach(b=>b.classList.toggle('active',b===sizeBtn));
      updateFlavors();
    }));
  });

  const updateOrderUI=()=>{
    updateFlavors();
    orderFormV7.classList.add('is-focused');
    clearTimeout(orderFormV7._focusTimer);
    orderFormV7._focusTimer=setTimeout(()=>orderFormV7.classList.remove('is-focused'),240);
  };

  phone?.addEventListener('input',()=>{
    const clean=phone.value.replace(/\D/g,'').slice(0,15);
    if(phone.value!==clean) phone.value=clean;
    updateProgress();
  });
  phone?.addEventListener('keydown',e=>{
    const allowed=['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if(!/[0-9]/.test(e.key) && !allowed.includes(e.key) && !(e.ctrlKey||e.metaKey)) e.preventDefault();
  });
  phone?.addEventListener('paste',e=>{
    e.preventDefault();
    const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,15);
    phone.setRangeText(text,phone.selectionStart,phone.selectionEnd,'end');
    updateProgress();
  });

  [nameInput,delivery,note].forEach(field=>field?.addEventListener('input',updateOrderUI));
  delivery?.addEventListener('change',updateOrderUI);
  updateFlavors();

  orderFormV7.addEventListener('submit',e=>{
    e.preventDefault();
    const name=nameInput.value.trim(), number=phone.value.trim(), total=getTotal(), price=getPrice();
    const selected=getFlavorSummary();
    if(!name || !number || !total){
      orderFormV7.classList.remove('shake'); void orderFormV7.offsetWidth; orderFormV7.classList.add('shake');
      if(status) status.textContent=!total?'Elige al menos un sabor para preparar tu pedido.':'Completa tu nombre y teléfono para preparar el pedido.';
      return;
    }
    const d=delivery.value, extra=note.value.trim();
    const flavorLines=selected.map(([flavor,item])=>`- ${flavor}: ${item.qty} × ${item.size==='large'?'Grande':'Pequeño'}`).join('\n');
    const text=`PEDIDO TROPICAL MOUSSE\n\nNombre: ${name}\nSabores:\n${flavorLines}\nCantidad total: ${total} mousse(s)\nEntrega: ${d}\nTeléfono: ${number}${extra?'\nNota: '+extra:''}`;
    navigator.clipboard?.writeText(text).catch(()=>{});
    if(status){
      status.classList.remove('order-success'); void status.offsetWidth; status.classList.add('order-success');
      status.innerHTML='✓ <b>Pedido preparado.</b> Tus sabores y cantidades fueron copiados y están listos para confirmar.';
    }
    if(btn){
      btn.classList.add('sent');
      btn.querySelector('span').textContent='¡Pedido preparado!';
      setTimeout(()=>{btn.classList.remove('sent');btn.querySelector('span').textContent='Preparar pedido'},2800);
    }
    orderFormV7.classList.add('order-complete');
    setTimeout(()=>orderFormV7.classList.remove('order-complete'),900);
  });
}

// V7 — detalle: parallax cinematográfico suave sin el tilt brusco
const detail=document.querySelector('.cinematic-detail');
if(detail){
  const detailImg=detail.querySelector('img');
  detail.addEventListener('pointermove',e=>{
    const r=detail.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    detail.style.setProperty('--detail-x',`${x*100}%`);
    detail.style.setProperty('--detail-y',`${y*100}%`);
    detail.style.setProperty('--detail-rx',`${y*-1.5}deg`);
    detail.style.setProperty('--detail-ry',`${x*2}deg`);
    if(detailImg) detailImg.style.transform=`translate(${x*-10}px,${y*-8}px) scale(1.045)`;
  });
  detail.addEventListener('pointerleave',()=>{
    detail.style.setProperty('--detail-x','50%'); detail.style.setProperty('--detail-y','45%');
    detail.style.setProperty('--detail-rx','0deg'); detail.style.setProperty('--detail-ry','0deg');
    if(detailImg) detailImg.style.transform='';
  });
}

// V8 — “Descubrir la chinola”: escena inmersiva antes de entrar a la experiencia
const discoverBtn=$('#discoverBtn'),discoverScene=$('#discoverScene');
if(discoverBtn&&discoverScene){
  discoverBtn.addEventListener('click',e=>{
    e.preventDefault();
    discoverScene.classList.add('active');
    discoverScene.setAttribute('aria-hidden','false');
    document.body.classList.add('discover-open');
    setTimeout(()=>{
      discoverScene.classList.remove('active');
      discoverScene.setAttribute('aria-hidden','true');
      document.body.classList.remove('discover-open');
      document.querySelector('#experiencia')?.scrollIntoView({behavior:'smooth',block:'start'});
    },2600);
  });
  discoverScene.addEventListener('click',()=>{
    discoverScene.classList.remove('active');
    discoverScene.setAttribute('aria-hidden','true');
    document.body.classList.remove('discover-open');
  });
}

// V9 — fallback de fotografías reales para la escena "Descubrir la chinola"
document.querySelectorAll('.discover-scene .mousse-cup img').forEach((img, i) => {
  const fallbacks = [
    'https://media.velocidadcuchara.com/uploads/2010/12/10121423/MOUSSE-CON-MARACUYA-H26.png',
    'https://cozinhaamiga.blog/images/posts/1771720178_mousse-de-maracuja-cremosa.png',
    'https://i.pinimg.com/736x/c9/ae/37/c9ae3733afc27c6e2245e7621638b349--bata-toque.jpg'
  ];
  img.addEventListener('error', () => {
    if (img.dataset.fallbackDone) return;
    img.dataset.fallbackDone = '1';
    const next = fallbacks[i];
    if (next && img.src !== next) img.src = next;
  });
});


// V11 — botón final: experiencia distinta que lleva al pedido
const orderLaunchBtn=$('#tasteBtn');
const orderLaunch=$('#orderLaunch');
if(orderLaunchBtn&&orderLaunch){
  orderLaunchBtn.addEventListener('click',e=>{
    e.preventDefault();
    orderLaunch.classList.remove('active');
    void orderLaunch.offsetWidth;
    orderLaunch.classList.add('active');
    orderLaunch.setAttribute('aria-hidden','false');
    document.body.classList.add('order-launch-open');
    const status=$('#formStatus');
    if(status) status.textContent='';
    setTimeout(()=>{
      orderLaunch.classList.remove('active');
      orderLaunch.setAttribute('aria-hidden','true');
      document.body.classList.remove('order-launch-open');
      document.querySelector('#pedido')?.scrollIntoView({behavior:'smooth',block:'start'});
      setTimeout(()=>$('#orderName')?.focus({preventScroll:true}),650);
    },1900);
  });
  orderLaunch.addEventListener('click',()=>{
    orderLaunch.classList.remove('active');
    orderLaunch.setAttribute('aria-hidden','true');
    document.body.classList.remove('order-launch-open');
  });
}

// V12 — interacción móvil: scroll + touch en lugar de mouse
const mobileMode=window.matchMedia('(max-width: 700px)');
if(mobileMode.matches){
  const hint=$('#mobileTouchHint');
  let hintTimer;
  const hideHint=()=>{
    if(!hint)return;
    hint.classList.add('hide');
    clearTimeout(hintTimer);
    hintTimer=setTimeout(()=>hint.remove(),700);
  };
  window.addEventListener('scroll',hideHint,{passive:true,once:true});
  window.addEventListener('touchstart',hideHint,{passive:true,once:true});

  // Las tarjetas de esencia responden al toque con una microanimación.
  $$('.ingredient-card').forEach(card=>{
    card.addEventListener('touchstart',()=>{
      $$('.ingredient-card').forEach(c=>c.classList.remove('is-touch-active'));
      card.classList.add('is-touch-active');
      setTimeout(()=>card.classList.remove('is-touch-active'),650);
    },{passive:true});
  });

  // Detalle: pequeño enfoque al tocar la fotografía.
  const detailMobile=document.querySelector('.cinematic-detail');
  detailMobile?.addEventListener('touchstart',()=>{
    detailMobile.classList.add('touch-focus');
    setTimeout(()=>detailMobile.classList.remove('touch-focus'),850);
  },{passive:true});

  // Equipo: feedback táctil en cada integrante.
  teamMembers.forEach(member=>member.addEventListener('touchstart',()=>{
    member.style.transform='translateX(5px) scale(.985)';
    setTimeout(()=>member.style.transform='',180);
  },{passive:true}));

  // Pedidos: convierte el llenado del formulario en pasos visuales.
  const mobileOrder=orderFormV7;
  if(mobileOrder){
    const fields=[nameInput,phone,qty,delivery,note].filter(Boolean);
    const updateMobileStep=()=>{
      mobileOrder.classList.remove('mobile-step-2','mobile-step-3','mobile-step-4');
      if(nameInput?.value.trim()) mobileOrder.classList.add('mobile-step-2');
      if(phone?.value.trim()) mobileOrder.classList.add('mobile-step-3');
      if(qty?.value && delivery?.value) mobileOrder.classList.add('mobile-step-4');
    };
    fields.forEach(f=>f.addEventListener('input',updateMobileStep,{passive:true}));
    fields.forEach(f=>f.addEventListener('change',updateMobileStep,{passive:true}));
    updateMobileStep();

    // En móvil, al completar nombre pasa naturalmente al teléfono.
    nameInput?.addEventListener('change',()=>{
      if(nameInput.value.trim() && !phone.value.trim()) phone.focus();
    });
  }

  // El botón de descubrir mantiene la experiencia de pantalla completa,
  // pero la escena usa la animación mobileMousseLeft/mobileMousseRight.
  discoverBtn?.addEventListener('touchstart',()=>{
    discoverBtn.classList.add('touching');
    setTimeout(()=>discoverBtn.classList.remove('touching'),220);
  },{passive:true});
}


/* V20.6 — carrito de compra desde Tres perfiles */
document.addEventListener('DOMContentLoaded',()=>{
  const cards=[...document.querySelectorAll('.flavor-card[data-product]')];
  const cartFloat=document.querySelector('#cartFloat');
  const cartToggle=document.querySelector('#cartToggle');
  const cartClose=document.querySelector('#cartClose');
  const cartPanel=document.querySelector('#cartPanel');
  const cartItems=document.querySelector('#cartItems');
  const cartBadge=document.querySelector('#cartBadge');
  const cartTotalText=document.querySelector('#cartTotalText');
  const cartGrandTotal=document.querySelector('#cartGrandTotal');
  const cartBuy=document.querySelector('#cartBuy');
  if(!cards.length||!cartFloat)return;

  const cart={};
  const money=n=>`RD$${n.toLocaleString('es-DO')}`;

  cards.forEach(card=>{
    const flavor=card.dataset.product;
    cart[flavor]={qty:0,size:'small',small:Number(card.dataset.small),large:Number(card.dataset.large),image:card.dataset.image};
    const sizeButtons=card.querySelectorAll('.product-size-btn');
    sizeButtons.forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();
      cart[flavor].size=btn.dataset.size;
      sizeButtons.forEach(b=>b.classList.toggle('active',b===btn));
      renderCart();
    }));
    card.querySelector('[data-plus]')?.addEventListener('click',e=>{e.stopPropagation();cart[flavor].qty++;renderCart(true)});
    card.querySelector('[data-minus]')?.addEventListener('click',e=>{e.stopPropagation();cart[flavor].qty=Math.max(0,cart[flavor].qty-1);renderCart()});
  });

  function getTotalQty(){return Object.values(cart).reduce((n,p)=>n+p.qty,0)}
  function getTotalPrice(){return Object.values(cart).reduce((n,p)=>n+p.qty*(p.size==='large'?p.large:p.small),0)}

  function renderCart(pop=false){
    let totalQty=getTotalQty(), totalPrice=getTotalPrice();
    cartBadge.textContent=totalQty;
    cartTotalText.textContent=`${totalQty} mousse${totalQty===1?'':'s'} · ${money(totalPrice)}`;
    cartGrandTotal.textContent=money(totalPrice);
    cartBuy.disabled=totalQty===0;
    cards.forEach(card=>{
      const p=cart[card.dataset.product];
      const count=card.querySelector('[data-product-count]');
      if(count)count.textContent=p.qty;
      card.classList.toggle('is-in-cart',p.qty>0);
      const label=card.querySelector('.product-selected-label');
      if(label)label.textContent=p.qty?`${p.qty} agregado${p.qty===1?'':'s'} · ${p.size==='large'?'Grande':'Pequeño'}`:'Agregar al carrito';
    });
    const entries=Object.entries(cart).filter(([,p])=>p.qty>0);
    if(!entries.length){cartItems.innerHTML='<div class="cart-empty">Todavía no has agregado ningún mousse.</div>';return}
    cartItems.innerHTML=entries.map(([flavor,p])=>{
      const size=p.size==='large'?'Grande':'Pequeño';
      const unit=p.size==='large'?p.large:p.small;
      return `<div class="cart-item"><img src="${p.image}" alt="Mousse de ${flavor}"><div class="cart-item-info"><strong>${flavor}</strong><span>${size} · ${money(unit)} c/u</span><div class="cart-item-controls"><button type="button" data-cart-minus="${flavor}">−</button><b>${p.qty}</b><button type="button" data-cart-plus="${flavor}">+</button></div></div><div class="cart-item-price">${money(unit*p.qty)}</div></div>`;
    }).join('');
    cartItems.querySelectorAll('[data-cart-plus]').forEach(btn=>btn.addEventListener('click',()=>{cart[btn.dataset.cartPlus].qty++;renderCart(true)}));
    cartItems.querySelectorAll('[data-cart-minus]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.cartMinus;cart[key].qty=Math.max(0,cart[key].qty-1);renderCart()}));
    if(pop){cartToggle.classList.remove('cart-pop');void cartToggle.offsetWidth;cartToggle.classList.add('cart-pop')}
  }

  function toggleCart(open){
    cartFloat.classList.toggle('open',open);
    cartPanel.setAttribute('aria-hidden',String(!open));
  }
  cartToggle.addEventListener('click',()=>toggleCart(!cartFloat.classList.contains('open')));
  cartClose.addEventListener('click',()=>toggleCart(false));
  document.addEventListener('click',e=>{if(cartFloat.classList.contains('open')&&!cartFloat.contains(e.target))toggleCart(false)});

  cartBuy.addEventListener('click',()=>{
    const entries=Object.entries(cart).filter(([,p])=>p.qty>0);
    if(!entries.length)return;
    const lines=entries.map(([flavor,p])=>{
      const size=p.size==='large'?'Grande':'Pequeño';
      const unit=p.size==='large'?p.large:p.small;
      return `• ${flavor} — ${p.qty} vaso${p.qty===1?'':'s'} ${size} (${money(unit)} c/u) = ${money(unit*p.qty)}`;
    }).join('\n');
    const total=`${money(getTotalPrice())}`;
    const message=`Hola, quiero hacer un pedido de TROPICAL MOUSSE 🍮\n\n${lines}\n\nTotal: ${total}\n\n¿Podemos coordinar mi pedido?`;
    window.open(`https://wa.me/18494404797?text=${encodeURIComponent(message)}`,'_blank','noopener');
  });
  renderCart();
});
