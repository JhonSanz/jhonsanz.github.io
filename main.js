import { prepareWithSegments, layoutWithLines } from 'https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.4/dist/layout.js';

// ============================================
// PRETEXT HERO CANVAS EFFECT
// ============================================
function initPretextHero() {
  const canvas = document.getElementById('pretext-hero');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const phrases = [
    'Building scalable APIs & cloud systems',
    'Django // FastAPI // AWS // Docker',
    'Fraud detection & financial risk engines',
    'AI-powered agents with LangChain',
    '> 7+ years crafting backend solutions _',
  ];

  let currentPhrase = 0;
  let animFrame = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  function renderPretextLine() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const font = '16px "Share Tech Mono", monospace';
    const lineHeight = 22;

    ctx.clearRect(0, 0, width, height);

    const text = phrases[currentPhrase];

    try {
      const prepared = prepareWithSegments(text, font);
      const result = layoutWithLines(prepared, width - 20, lineHeight);

      // Draw each line with neon glow
      result.lines.forEach((line, i) => {
        const y = 20 + i * lineHeight;
        const lineText = text.substring(line.start, line.end);

        // Glow effect
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#00f0ff';
        ctx.font = font;
        ctx.globalAlpha = 0.3;
        ctx.fillText(lineText, 10, y);

        // Main text
        ctx.shadowBlur = 4;
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#e0e0e8';
        ctx.fillText(lineText, 10, y);

        ctx.shadowBlur = 0;
      });
    } catch (e) {
      // Fallback: render directly if pretext fails
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#00f0ff';
      ctx.font = '16px "Share Tech Mono", monospace';
      ctx.globalAlpha = 0.3;
      ctx.fillText(text, 10, 20);
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#e0e0e8';
      ctx.fillText(text, 10, 20);
      ctx.shadowBlur = 0;
    }
  }

  // Scramble/decode animation
  function scrambleTransition() {
    const text = phrases[currentPhrase];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>{}[]';
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const font = '16px "Share Tech Mono", monospace';
    let revealed = 0;

    function frame() {
      ctx.clearRect(0, 0, width, height);

      let display = '';
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          display += text[i];
        } else {
          display += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      // Glow layer
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#00f0ff';
      ctx.font = font;
      ctx.globalAlpha = 0.25;
      ctx.fillText(display, 10, 20);

      // Main text
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 3;

      for (let i = 0; i < display.length; i++) {
        const x = 10 + ctx.measureText(display.substring(0, i)).width;
        if (i < revealed) {
          ctx.fillStyle = '#e0e0e8';
        } else {
          ctx.fillStyle = `hsl(${180 + Math.random() * 60}, 100%, 60%)`;
        }
        ctx.fillText(display[i], x, 20);
      }

      ctx.shadowBlur = 0;
      revealed += 1;

      if (revealed <= text.length) {
        animFrame = requestAnimationFrame(frame);
      } else {
        renderPretextLine();
        setTimeout(() => {
          currentPhrase = (currentPhrase + 1) % phrases.length;
          scrambleTransition();
        }, 3000);
      }
    }

    frame();
  }

  resize();
  window.addEventListener('resize', resize);
  scrambleTransition();
}

// ============================================
// PARTICLE BACKGROUND
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const count = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 185 : 295; // cyan or magenta
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  animate();
}

// ============================================
// SCROLL REVEAL
// ============================================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ============================================
// SKILL BAR ANIMATION
// ============================================
function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        fill.style.width = width + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.skill-fill').forEach(el => observer.observe(el));
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current;
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// ============================================
// MOBILE NAV TOGGLE
// ============================================
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    toggle.classList.toggle('active');
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
    });
  });
}

// ============================================
// NAV SCROLL EFFECT
// ============================================
function initNavScroll() {
  const nav = document.querySelector('.cyber-nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 100) {
      nav.style.background = 'rgba(10, 10, 15, 0.95)';
    } else {
      nav.style.background = 'rgba(10, 10, 15, 0.85)';
    }
    lastScroll = current;
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initPretextHero();
  initReveal();
  initSkillBars();
  initCounters();
  initMobileNav();
  initNavScroll();
});
