document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('mobileMenuClose');
  const menuLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    mobileMenu.classList.add('is-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const statNumbers = document.querySelectorAll('.stats__number[data-count]');
  if (!statNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  statNumbers.forEach((el) => {
    const suffix = el.dataset.suffix || '';
    el.textContent = prefersReducedMotion ? el.dataset.count + suffix : '0' + suffix;
  });

  if (prefersReducedMotion) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = Math.min(2800, Math.max(900, target * 70));
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.9 }
  );

  statNumbers.forEach((el) => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.testimonials__grid');
  if (!grid) return;

  const track = document.createElement('div');
  track.className = 'testimonials__track';

  while (grid.firstChild) {
    track.appendChild(grid.firstChild);
  }

  grid.appendChild(track);

  const originalCards = Array.from(track.children);
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const oneSetWidth =
    originalCards.reduce((sum, card) => sum + card.getBoundingClientRect().width, 0) +
    gap * (originalCards.length - 1);

  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  track.style.width = oneSetWidth * 2 + gap + 'px';
});

document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const groupSelectors = [
    '.what-we-do__intro',
    '.checklist__item',
    '.why-us__title',
    '.why-us__subtitle',
    '.why-us__card',
    '.services__intro',
    '.services__card',
    '.who-we-are__title',
    '.who-we-are__card',
    '.sectors__intro',
    '.sectors__item',
    '.contact__intro',
    '.contact__card',
    '.contact__form-card',
    '.legal__intro',
    '.legal__item',
    '.legal__note',
  ];

  const elements = document.querySelectorAll(groupSelectors.join(', '));
  if (!elements.length) return;

  // Escalona el retraso entre elementos que comparten el mismo padre
  // (por ejemplo, las 3 tarjetas de "Por qué elegirnos" aparecen una tras otra)
  const delayCounters = new Map();
  elements.forEach((el) => {
    el.classList.add('js-reveal');
    const parent = el.parentElement;
    const count = delayCounters.get(parent) || 0;
    el.style.transitionDelay = `${Math.min(count * 90, 360)}ms`;
    delayCounters.set(parent, count + 1);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              entry.target.classList.add('is-visible');
            });
          });
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  elements.forEach((el) => observer.observe(el));
});

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.header');
  if (!header) return;

  const logo = header.querySelector('.header__logo');
  const logoLight = 'img/logo-blanco.svg';
  const logoDark = 'img/logo-azul.png';

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      header.classList.remove('header--hidden');
      header.classList.remove('header--scrolled');
      logo.src = logoLight;
    } else if (currentScrollY > lastScrollY) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
      header.classList.add('header--scrolled');
      logo.src = logoDark;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});

document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statsCards = document.querySelectorAll('.stats__card');
  if (!statsCards.length || prefersReducedMotion) return;

  statsCards.forEach((el, i) => {
    el.classList.add('js-reveal');
    el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
  });

  void statsCards[0].offsetHeight;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      statsCards.forEach((el) => el.classList.add('is-visible'));
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__actions');
  if (!heroElements.length || prefersReducedMotion) return;
  heroElements.forEach((el, i) => {
    el.classList.add('js-reveal', 'js-reveal--hero');
    el.style.transitionDelay = `${i * 200}ms`;
  });
  void heroElements[0].offsetHeight;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroElements.forEach((el) => el.classList.add('is-visible'));
    });
  });

document.addEventListener('DOMContentLoaded', function () {
  const legalHeader = document.querySelector('.header--legal');
  if (!legalHeader) return;

  const logo = legalHeader.querySelector('.header__logo');
  const logoLight = 'img/logo-blanco.svg';
  const logoDark = 'img/logo-azul.png';

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateLegalHeader() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      legalHeader.classList.remove('header--hidden');
      legalHeader.classList.remove('header--scrolled');
      if (logo) logo.src = logoLight;
    } else if (currentScrollY > lastScrollY) {
      legalHeader.classList.add('header--hidden');
    } else {
      legalHeader.classList.remove('header--hidden');
      legalHeader.classList.add('header--scrolled');
      if (logo) logo.src = logoDark;
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateLegalHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});

document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.services__grid--mobile-scroll');
  const cards = track ? track.querySelectorAll('.services__card') : [];
  const dots = document.querySelectorAll('.services__dot');
  if (!track || !cards.length || !dots.length) return;

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const card = cards[i];
      if (!card) return;
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: 'smooth'
      });
    });
  });

  let ticking = false;

  function updateActiveDot() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    let closestIndex = 0;

    if (track.scrollLeft >= maxScroll - 2) {
      closestIndex = cards.length - 1;
    } else {
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
    }

    dots.forEach((dot, i) => {
      dot.classList.toggle('services__dot--active', i === closestIndex);
    });

    ticking = false;
  }

  track.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveDot);
      ticking = true;
    }
  }, { passive: true });

});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('.contact__submit');
  const originalBtnText = submitBtn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    emailjs.sendForm('service_5zc2x3b', 'template_ds05m6x', form)
      .then(function () {
        submitBtn.textContent = '¡Enviado! Te contactaremos pronto';
        form.reset();
        setTimeout(function () {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 4000);
      })
      .catch(function (error) {
        console.error('Error al enviar:', error);
        submitBtn.textContent = 'Error, intenta de nuevo';
        submitBtn.disabled = false;
        setTimeout(function () {
          submitBtn.textContent = originalBtnText;
        }, 3000);
      });
  });
});

// Chat Widget
const chatToggle = document.getElementById('chatToggle');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function openChat() {
  chatPanel.classList.add('is-open');
  chatToggle.classList.add('is-open');
  chatInput.focus();
}
function closeChat() {
  chatPanel.classList.remove('is-open');
  chatToggle.classList.remove('is-open');
}
chatToggle.addEventListener('click', () => {
  chatPanel.classList.contains('is-open') ? closeChat() : openChat();
});
chatClose.addEventListener('click', closeChat);

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `chat-widget__message chat-widget__message--${sender}`;
  const p = document.createElement('p');
  p.textContent = text;
  msg.appendChild(p);
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-widget__message chat-widget__message--bot chat-widget__message--typing';
  typing.id = 'chatTyping';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function hideTyping() {
  const typing = document.getElementById('chatTyping');
  if (typing) typing.remove();
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  chatInput.value = '';
  chatInput.disabled = true;
  showTyping();

  try {
    const res = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    hideTyping();
    const reply = data.reply || data.message || data.response || 'Lo siento, no pude procesar tu mensaje.';
    addMessage(reply, 'bot');
  } catch (err) {
    hideTyping();
    addMessage('Hubo un problema de conexión. Intenta nuevamente en unos segundos.', 'bot');
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});

(function () {
  const chatPanel = document.getElementById('chatPanel');
  if (!chatPanel || !window.visualViewport) return;

  function isMobile() {
    return window.innerWidth <= 640;
  }

  function updateChatPanelForKeyboard() {
    if (!isMobile() || !chatPanel.classList.contains('is-open')) {
      chatPanel.style.bottom = '';
      chatPanel.style.maxHeight = '';
      return;
    }
    const vv = window.visualViewport;
    const keyboardOffset = Math.max(window.innerHeight - vv.height - vv.offsetTop, 0);
    const margin = 16; // 1rem de margen mínimo
    chatPanel.style.bottom = `${keyboardOffset + margin}px`;
    chatPanel.style.maxHeight = `${vv.height - 32}px`; // 2rem de margen arriba
  }

  window.visualViewport.addEventListener('resize', updateChatPanelForKeyboard);
  window.visualViewport.addEventListener('scroll', updateChatPanelForKeyboard);

  const chatToggle = document.getElementById('chatToggle');
  if (chatToggle) {
    chatToggle.addEventListener('click', () => setTimeout(updateChatPanelForKeyboard, 50));
  }
})();
})
