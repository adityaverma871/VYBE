// Premium interactions: particles, reveals, counters, progress, cursor glow
(()=>{
  // Progress bar
  const progress = document.getElementById('progress')
  const updateProgress = ()=>{
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    progress.style.width = `${Math.min(1,Math.max(0,p))*100}%`
  }
  window.addEventListener('scroll', updateProgress,{passive:true})
  updateProgress()

  // Reveal on scroll
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible')
    })
  },{threshold:0.12})
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))

  // Counters
  document.querySelectorAll('.count').forEach(node=>{
    const target = +node.dataset.target || 0
    let start = 0
    const step = ()=>{
      const diff = target - start
      const inc = Math.ceil(diff/8)
      start += inc
      node.textContent = start
      if(start < target) requestAnimationFrame(step)
    }
    // start when visible
    obs.observe(node)
    node.addEventListener('transitionstart', ()=>{})
    const counterObserver = new IntersectionObserver((entries, o)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ step(); o.disconnect(); } })
    },{threshold:0.6})
    counterObserver.observe(node)
  })

  // Particle canvas (subtle organic floaters)
  const canvas = document.getElementById('particle-canvas')
  if(canvas){
    const ctx = canvas.getContext('2d')
    let w=canvas.width=innerWidth, h=canvas.height=innerHeight
    window.addEventListener('resize', ()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight})
    const particles = Array.from({length:40}).map(()=>({
      x:Math.random()*w, y:Math.random()*h, r:6+Math.random()*28, vx:(Math.random()-0.5)*0.1, vy:(Math.random()-0.5)*0.1, alpha:0.06+Math.random()*0.12
    }))
    function draw(){
      ctx.clearRect(0,0,w,h)
      for(const p of particles){
        p.x += p.vx; p.y += p.vy
        if(p.x<-100) p.x=w+100
        if(p.x>w+100) p.x=-100
        if(p.y<-100) p.y=h+100
        if(p.y>h+100) p.y=-100
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r)
        g.addColorStop(0, `rgba(14,51,41,${p.alpha})`)
        g.addColorStop(1, 'rgba(14,51,41,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill()
      }
      requestAnimationFrame(draw)
    }
    draw()
  }

  // Cursor glow: set CSS vars only (do NOT transform or move the body)
  document.addEventListener('mousemove', e=>{
    const x = e.clientX, y = e.clientY
    document.documentElement.style.setProperty('--cx', x + 'px')
    document.documentElement.style.setProperty('--cy', y + 'px')
  }, {passive: true})

  // parallax: move any elements with data-parallax based on cursor
  document.addEventListener('mousemove', e=>{
    const cx = window.innerWidth/2, cy = window.innerHeight/2
    const dx = (e.clientX - cx)/cx, dy = (e.clientY - cy)/cy
    document.querySelectorAll('[data-parallax]').forEach(el=>{
      const factor = parseFloat(el.getAttribute('data-parallax'))||0.02
      const tx = -dx * 12 * factor
      const ty = -dy * 12 * factor
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
    })
  }, {passive:true})

  // subtle scroll parallax for hero background
  const heroBg = document.querySelector('.hero-bg')
  window.addEventListener('scroll', ()=>{
    const s = window.scrollY
    if(heroBg) heroBg.style.transform = `translateY(${s * -0.06}px) scale(1.02)`
    updateProgress()
  }, {passive:true})

  // Set year
  document.getElementById('year').textContent = new Date().getFullYear()

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href')
      if(href.length>1){ e.preventDefault(); document.querySelector(href).scrollIntoView({behavior:'smooth'}) }
    })
  })
})();
