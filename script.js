/* ============================================
   FUTURISTIC DEVELOPER PORTFOLIO — script.js
   Particles · Typing · Tilt · Scroll · Forms
   ============================================ */

/* ─────────────────────────────────────────────
   1. FLOATING PARTICLES CANVAS
   ───────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [];

  // Colors for particles
  const COLORS = [
    'rgba(0,212,255,',    // neon blue
    'rgba(168,85,247,',   // neon purple
    'rgba(240,171,252,',  // neon pink
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x:    random(0, W),
      y:    random(0, H),
      vx:   random(-0.35, 0.35),
      vy:   random(-0.5, -0.1),
      r:    random(1, 3),
      alpha: random(0.2, 0.8),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life:  1,
      decay: random(0.0008, 0.002),
    };
  }

  function spawnParticles(count) {
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function drawConnections() {
    // Draw subtle lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const strength = (1 - dist / 120) * 0.12 * Math.min(p1.life, p2.life);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${strength})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    // Add new particles occasionally
    if (particles.length < 90 && Math.random() < 0.35) {
      particles.push(createParticle());
    }

    drawConnections();

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      // Wrap horizontally
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;

      const a = p.life * p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color + '0.6)';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  spawnParticles(70);
  animate();
})();


/* ─────────────────────────────────────────────
   2. NAVBAR SCROLL BEHAVIOUR + ACTIVE LINK
   ───────────────────────────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-links a, .nav-mobile a');
  const sections = document.querySelectorAll('section[id]');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  // Sticky style on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 160) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  updateActiveLink();

  // Smooth scroll + close mobile menu
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        navMobile.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });
})();


/* ─────────────────────────────────────────────
   3. TYPING ANIMATION IN HERO
   ───────────────────────────────────────────── */
(function initTyping() {
  const el    = document.getElementById('typed-text');
  const texts = ['C# Developer', 'ASP.NET Core Developer', 'Backend Engineer'];

  let textIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;
  let delay      = 120;

  function type() {
    const current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 110;
    }

    if (!isDeleting && charIndex === current.length) {
      // Pause at end of word
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex  = (textIndex + 1) % texts.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Small initial delay before starting
  setTimeout(type, 900);
})();


/* ─────────────────────────────────────────────
   4. SCROLL REVEAL ANIMATION
   ───────────────────────────────────────────── */
(function initReveal() {
  // Add reveal class to all animatable elements
  const targets = document.querySelectorAll(
    '.about-card, .about-text, .skill-card, .project-card, .contact-item, .contact-form-wrap, .contact-info'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
  });

  // Section titles & labels
  document.querySelectorAll('.section-title, .section-label, .section-sub').forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   5. SKILL BAR ANIMATION ON SCROLL
   ───────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width');
        // Small delay for staggered effect
        setTimeout(() => { bar.style.width = targetWidth; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ─────────────────────────────────────────────
   6. 3D TILT EFFECT ON PROJECT CARDS
   ───────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  const MAX_TILT = 10; // degrees

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const mouseX = e.clientX - cx;
      const mouseY = e.clientY - cy;

      const rotateX = -(mouseY / (rect.height / 2)) * MAX_TILT;
      const rotateY =  (mouseX / (rect.width  / 2)) * MAX_TILT;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s linear';
    });
  });
})();


/* ─────────────────────────────────────────────
   7. PARALLAX SCROLLING EFFECT
   ───────────────────────────────────────────── */
(function initParallax() {
  const bgGradient = document.querySelector('.bg-gradient');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Slowly shift the gradient background
    bgGradient.style.transform = `translateY(${scrollY * 0.15}px)`;
  }, { passive: true });
})();


/* ─────────────────────────────────────────────
   8. CONTACT FORM (mock submit)
   ───────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const submitBtn  = document.getElementById('submit-btn');
  const btnText    = document.getElementById('btn-text');
  const btnIcon    = document.getElementById('btn-icon');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shakeBtn();
      return;
    }
    if (!isValidEmail(email)) {
      shakeBtn();
      return;
    }

    // Simulate sending
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.className   = 'fa fa-spinner fa-spin';

    setTimeout(() => {
      submitBtn.disabled  = false;
      btnText.textContent = 'Sent!';
      btnIcon.className   = 'fa fa-check';
      successMsg.classList.remove('hidden');
      form.reset();

      setTimeout(() => {
        btnText.textContent = 'Send Message';
        btnIcon.className   = 'fa fa-paper-plane';
        successMsg.classList.add('hidden');
      }, 4000);
    }, 1400);
  });

  function shakeBtn() {
    submitBtn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { submitBtn.style.animation = ''; }, 400);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Inject shake keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────
   9. GLOWING CURSOR TRAIL  (subtle)
   ───────────────────────────────────────────── */
(function initCursorTrail() {
  const isTouchDevice = ('ontouchstart' in window);
  if (isTouchDevice) return; // Skip on mobile

  const trail = [];
  const TRAIL_LENGTH = 12;

  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      border-radius: 50%; transform: translate(-50%,-50%);
      transition: opacity 0.3s;
      background: radial-gradient(circle, rgba(0,212,255,${0.6 - i * 0.04}), transparent);
    `;
    document.body.appendChild(dot);
    trail.push({ el: dot, x: 0, y: 0 });
  }

  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateTrail() {
    let x = mouseX, y = mouseY;

    trail.forEach((dot, i) => {
      const next = trail[i - 1] || { x: mouseX, y: mouseY };
      dot.x += (next.x - dot.x) * 0.35;
      dot.y += (next.y - dot.y) * 0.35;

      const size = Math.max(2, (TRAIL_LENGTH - i) * 1.2);
      dot.el.style.width  = size + 'px';
      dot.el.style.height = size + 'px';
      dot.el.style.left   = dot.x + 'px';
      dot.el.style.top    = dot.y + 'px';
      dot.el.style.opacity = (1 - i / TRAIL_LENGTH) * 0.5;

      x = dot.x;
      y = dot.y;
    });

    requestAnimationFrame(animateTrail);
  }

  animateTrail();
})();


/* ─────────────────────────────────────────────
   10. HERO STAT COUNTER ANIMATION
   ───────────────────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.textContent);
      const suffix = el.textContent.replace(/[0-9]/g, '');

      let current = 0;
      const duration = 1200;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.8 });

  stats.forEach(el => observer.observe(el));
})();
