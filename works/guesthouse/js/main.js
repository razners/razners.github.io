(function () {
  // Номер WhatsApp — только цифры, без «+» и пробелов
  var WHATSAPP = '37477116736';

  // Цена за ночь и вместимость домиков. Меняйте здесь.
  var CABINS = {
    aframe: { price: 45000, max: 3 },
    old: { price: 35000, max: 2 },
    glass: { price: 55000, max: 4 }
  };

  var lang = ['ru', 'en'].indexOf(document.documentElement.lang) > -1 ? document.documentElement.lang : 'hy';
  var L = {
    hy: {
      num: 'ru-RU',
      months: ['Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս', 'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'],
      monthsShort: ['հնվ', 'փտր', 'մրտ', 'ապր', 'մյս', 'հնս', 'հլս', 'օգս', 'սեպ', 'հոկ', 'նոյ', 'դեկ'],
      dow: ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուր', 'Շբթ', 'Կիր'],
      seasons: {
        spring: 'Գարնանը՝ ծաղկած լանջեր և առաջին արահետները',
        summer: 'Ամռանը՝ անտառի զովություն և Պարզ լիճը',
        autumn: 'Աշնանը՝ ոսկեգույն անտառ և տաք թեյ վառարանի մոտ',
        winter: 'Ձմռանը՝ ձյուն, վառարան և լռություն'
      },
      nights: function (n) { return n + ' գիշեր'; },
      pick: 'Ընտրեք մուտքի և ելքի ամսաթվերը',
      pickEnd: 'Հիմա ընտրեք ելքի օրը',
      tooMany: function (n) { return 'Այս տնակում տեղավորվում է մինչև ' + n + ' հյուր'; },
      drag: 'Թերթել',
      cabinNames: { aframe: 'A-ֆրեյմ', old: 'Հին տուն', glass: 'Ապակե տուն' },
      msg: function (d) {
        return 'Բարև Ձեզ։ Ուզում եմ ամրագրել Antar House-ում։\n' +
          'Տնակ՝ ' + d.cabin + '\n' + (d.dates ? 'Ամսաթվեր՝ ' + d.dates + ' (' + d.nights + ')\n' : '') +
          'Հյուրեր՝ ' + d.guests + (d.total ? '\nԿայքի հաշվարկով՝ ' + d.total + ' ֏' : '');
      }
    },
    ru: {
      num: 'ru-RU',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsShort: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
      dow: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      seasons: {
        spring: 'Весной — цветущие склоны и первые тропы',
        summer: 'Летом — прохлада леса и озеро Парз',
        autumn: 'Осенью — лес в золоте и горячий чай у печки',
        winter: 'Зимой — снег, печка и тишина'
      },
      nights: function (n) { var m = n % 10, h = n % 100; return n + (m === 1 && h !== 11 ? ' ночь' : m >= 2 && m <= 4 && (h < 12 || h > 14) ? ' ночи' : ' ночей'); },
      pick: 'Выберите даты заезда и выезда',
      pickEnd: 'Теперь выберите день выезда',
      tooMany: function (n) { return 'В этом домике помещается до ' + n + ' гостей'; },
      drag: 'Листать',
      cabinNames: { aframe: 'А-фрейм', old: 'Старый дом', glass: 'Стеклянный дом' },
      msg: function (d) {
        return 'Здравствуйте! Хочу забронировать Antar House.\n' +
          'Домик: ' + d.cabin + '\n' + (d.dates ? 'Даты: ' + d.dates + ' (' + d.nights + ')\n' : '') +
          'Гостей: ' + d.guests + (d.total ? '\nПо расчёту на сайте: ' + d.total + ' ֏' : '');
      }
    },
    en: {
      num: 'en-US',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dow: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      seasons: {
        spring: 'In spring — blooming slopes and the first trails',
        summer: 'In summer — cool forest air and Lake Parz',
        autumn: 'In autumn — a golden forest and hot tea by the stove',
        winter: 'In winter — snow, a wood stove and silence'
      },
      nights: function (n) { return n + (n === 1 ? ' night' : ' nights'); },
      pick: 'Choose your check-in and check-out dates',
      pickEnd: 'Now choose your check-out date',
      tooMany: function (n) { return 'This cabin sleeps up to ' + n + ' guests'; },
      drag: 'Scroll',
      cabinNames: { aframe: 'A-frame', old: 'Old House', glass: 'Glass House' },
      msg: function (d) {
        return 'Hello! I would like to book Antar House.\n' +
          'Cabin: ' + d.cabin + '\n' + (d.dates ? 'Dates: ' + d.dates + ' (' + d.nights + ')\n' : '') +
          'Guests: ' + d.guests + (d.total ? '\nWebsite estimate: ' + d.total + ' ֏' : '');
      }
    }
  }[lang];

  var root = document.documentElement;
  // ?noanim в адресе — показать всё без анимаций (для проверки вёрстки и скриншотов)
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]noanim\b/.test(location.search);
  if (/[?&]noanim\b/.test(location.search)) document.documentElement.classList.add('static');
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  var animate = !!(gsap && ST) && !reduce;
  if (animate) { gsap.registerPlugin(ST); root.classList.add('anim'); }
  root.classList.add('js');

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString(L.num); };
  var waLink = function (text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text); };

  /* ---------- Плавная прокрутка (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    root.classList.add('has-lenis');
    if (animate) {
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }
  var headerH = function () { return $('.header').offsetHeight; };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    setNav(false);
    if (lenis) lenis.scrollTo(target, { offset: target.id === 'top' ? 0 : -headerH() + 1, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + target.id);
  });

  /* ---------- Шапка: прозрачная над сценой, прячется при прокрутке вниз ---------- */
  var header = $('.header'), mbar = $('.mbar'), hero = $('.hero');
  var lastY = 0;
  function onScrollUI() {
    var y = window.scrollY, h = hero.offsetHeight;
    header.classList.toggle('is-solid', y > h - headerH() - 10);
    header.classList.toggle('is-hidden', y > h && y > lastY + 2 && !document.body.classList.contains('nav-open'));
    if (y < lastY - 2) header.classList.remove('is-hidden');
    if (mbar) mbar.classList.toggle('is-visible', y > h * 0.7);
    lastY = y;
  }
  window.addEventListener('scroll', onScrollUI, { passive: true });
  onScrollUI();

  /* ---------- Мобильное меню ---------- */
  var burger = $('.burger');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    if (burger) burger.setAttribute('aria-expanded', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  if (burger) burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  /* ---------- Переключатель языка: остаёмся в той же секции ---------- */
  var sections = $$('main section[id]');
  function trackSection() {
    var current = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
    $$('[data-lang]').forEach(function (a) { a.href = a.getAttribute('href').split('#')[0] + (current ? '#' + current : ''); });
  }
  window.addEventListener('scroll', trackSection, { passive: true });
  trackSection();

  /* ---------- Времена года ---------- */
  var particles = null;
  function setSeason(s, instant) {
    root.dataset.season = s;
    $$('.seasons__pills button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.season === s); });
    var cap = $('.seasons__caption');
    if (cap) {
      if (animate && !instant) {
        gsap.to(cap, { opacity: 0, y: 6, duration: 0.25, onComplete: function () {
          cap.textContent = L.seasons[s];
          gsap.to(cap, { opacity: 1, y: 0, duration: 0.5 });
        } });
      } else cap.textContent = L.seasons[s];
    }
    if (particles) particles.setSeason(s);
  }
  var month = new Date().getMonth();
  var initialSeason = month >= 2 && month <= 4 ? 'spring' : month >= 5 && month <= 7 ? 'summer' : month >= 8 && month <= 10 ? 'autumn' : 'winter';
  // ?season=winter в адресе открывает нужное время года (удобно показывать клиентам)
  var asked = new URLSearchParams(location.search).get('season');
  if (L.seasons[asked]) initialSeason = asked;
  $$('.seasons__pills button').forEach(function (b) {
    b.addEventListener('click', function () { setSeason(b.dataset.season); });
  });

  /* ---------- Частицы: лепестки, светлячки, листья, снег ---------- */
  function Particles(canvas) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, items = [], season = 'autumn', running = false, visible = true;
    var CONF = {
      spring: { n: 26, colors: ['#F7C6D3', '#F3A6BC', '#FFFFFF', '#F9D9E2'] },
      summer: { n: 34, colors: ['#FFF3B0', '#FFE27A', '#FFFFFF'] },
      autumn: { n: 24, colors: ['#D9692A', '#E8A13A', '#B5481E', '#F2C14E', '#C2572A'] },
      winter: { n: 95, colors: ['#FFFFFF'] }
    };
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      var c = CONF[season], r = Math.random;
      var p = { x: r() * w, y: initial ? r() * h : -20, rot: r() * 6.28, vr: (r() - 0.5) * 0.04, ph: r() * 6.28, color: c.colors[Math.floor(r() * c.colors.length)] };
      if (season === 'winter') { p.s = 1 + r() * 2.4; p.vy = 0.5 + r() * 1.1; p.vx = (r() - 0.5) * 0.4; p.a = 0.5 + r() * 0.5; }
      else if (season === 'summer') { p.s = 1.2 + r() * 2; p.vy = -(0.1 + r() * 0.3); p.vx = (r() - 0.5) * 0.3; p.y = initial ? h * (0.35 + r() * 0.65) : h + 10; p.a = r(); }
      else if (season === 'spring') { p.s = 4 + r() * 4; p.vy = 0.4 + r() * 0.7; p.vx = 0.2 + r() * 0.5; p.a = 0.85; }
      else { p.s = 7 + r() * 6; p.vy = 0.6 + r() * 0.9; p.vx = (r() - 0.3) * 0.6; p.a = 0.95; }
      return p;
    }
    function fill() {
      var n = CONF[season].n * (w < 700 ? 0.5 : 1);
      items = []; for (var i = 0; i < n; i++) items.push(make(true));
    }
    function draw(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a; ctx.fillStyle = p.color;
      if (season === 'winter') { ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill(); }
      else if (season === 'summer') {
        ctx.shadowColor = p.color; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.28); ctx.fill();
      } else if (season === 'spring') { ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.28); ctx.fill(); }
      else {
        var s = p.s; ctx.beginPath(); ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s * 0.8, -s * 0.2, 0, s); ctx.quadraticCurveTo(-s * 0.8, -s * 0.2, 0, -s); ctx.fill();
        ctx.globalAlpha = p.a * 0.5; ctx.strokeStyle = 'rgba(80,30,10,.6)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
      }
      ctx.restore();
    }
    function tick(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < items.length; i++) {
        var p = items[i];
        p.ph += 0.02;
        p.x += p.vx + Math.sin(p.ph) * (season === 'winter' ? 0.3 : 0.8);
        p.y += p.vy; p.rot += p.vr;
        if (season === 'summer') p.a = 0.35 + 0.65 * Math.abs(Math.sin(p.ph * 0.7));
        if (p.y > h + 30 || p.y < -40 || p.x > w + 40 || p.x < -40) items[i] = make(false);
        draw(items[i]);
      }
      requestAnimationFrame(tick);
    }
    function play() { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(tick); } }
    function stop() { running = false; }
    resize(); fill();
    window.addEventListener('resize', function () { resize(); fill(); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; visible ? play() : stop(); }).observe(canvas);
    }
    this.setSeason = function (s) { season = s; fill(); play(); };
    this.start = play;
  }
  var canvas = $('.hero__particles');
  if (canvas && !reduce) { particles = new Particles(canvas); }
  setSeason(initialSeason, true);
  if (particles) particles.start();

  /* ---------- Параллакс сцены: мышь + прокрутка ---------- */
  var layers = $$('.hero [data-depth]');
  var mx = 0, my = 0, cx = 0, cy = 0;
  if (!reduce) {
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) {
        mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2;
      });
      hero.addEventListener('pointerleave', function () { mx = 0; my = 0; });
    }
    (function loop() {
      cx += (mx - cx) * 0.06; cy += (my - cy) * 0.06;
      var y = window.scrollY, h = hero.offsetHeight;
      if (y < h * 1.2) {
        var p = Math.min(y / h, 1);
        layers.forEach(function (el) {
          var d = parseFloat(el.dataset.depth);
          el.style.transform = 'translate3d(' + (-cx * d * 34).toFixed(2) + 'px,' + (-cy * d * 14 + p * h * d * 0.55).toFixed(2) + 'px,0)';
        });
        var title = $('.hero__title');
        if (title) title.style.opacity = String(Math.max(0, 1 - p * 1.6));
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Появление при загрузке и при прокрутке ---------- */
  function splitWords(el) {
    // Сохраняем <em> и <br>: оборачиваем каждое слово текстовых узлов
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  }

  if (animate) {
    // Сцена «поднимается» при загрузке, буквы названия выезжают по одной
    var title = $('.hero__title');
    if (title) {
      title.innerHTML = title.textContent.split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('');
    }
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    $$('.hero__layer').forEach(function (el, i) {
      var inner = el.firstElementChild;
      tl.from(inner, { yPercent: 6 + i * 3, opacity: i === 0 ? 1 : 0, duration: 1.6 }, 0.1 + i * 0.08);
    });
    tl.from('.hero__title .ch', { yPercent: 70, opacity: 0, duration: 1.3, stagger: 0.07 }, 0.4)
      .from('.hero__ui .container > *', { y: 24, opacity: 0, duration: 1, stagger: 0.12 }, 0.9);

    $$('.split').forEach(function (el) {
      splitWords(el);
      gsap.to($$('.w > span', el), { yPercent: 0, y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.035,
        scrollTrigger: { trigger: el, start: 'top 85%' } });
    });
    $$('.fade-up').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    $$('.reveal-img').forEach(function (el) {
      var tl2 = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
      tl2.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut' })
         .to($('img', el), { scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
    });
    // Фото во вступлении медленно «плывёт»
    var introImg = $('.intro__photo img');
    if (introImg) gsap.fromTo(introImg, { yPercent: -9 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.intro__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* Счётчики */
  $$('[data-count]').forEach(function (el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), suffix = el.dataset.suffix || '';
    var show = function (v) { el.textContent = v.toLocaleString(L.num, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; };
    if (!animate) { show(to); return; }
    var o = { v: 0 }; show(0);
    gsap.to(o, { v: to, duration: 2, ease: 'power2.out', onUpdate: function () { show(o.v); },
      scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* ---------- Домики: горизонтальная прокрутка ---------- */
  var cabinsSec = $('.cabins'), viewport = $('.cabins__viewport'), track = $('.cabins__track'), bar = $('.cabins__progress i');
  if (cabinsSec && animate && matchMedia('(min-width: 1024px)').matches) {
    cabinsSec.classList.add('is-pinned');
    var dist = function () { return track.scrollWidth - viewport.clientWidth; };
    gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: cabinsSec, start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: function (self) { if (bar) bar.style.transform = 'scaleX(' + self.progress + ')'; } }
    });
  } else if (viewport && bar) {
    viewport.addEventListener('scroll', function () {
      var max = viewport.scrollWidth - viewport.clientWidth;
      bar.style.transform = 'scaleX(' + (max > 0 ? viewport.scrollLeft / max : 0) + ')';
    }, { passive: true });
  }

  /* ---------- День: солнце идёт по дуге, фото сменяются ---------- */
  var arc = $('.day__arc path'), sun = $('.day__sun'), steps = $$('.step'), photos = $$('.day__photos img');
  function placeSun(p) {
    if (!arc || !sun) return;
    var len = arc.getTotalLength(), pt = arc.getPointAtLength(len * Math.max(0, Math.min(1, p)));
    sun.setAttribute('cx', pt.x); sun.setAttribute('cy', pt.y);
  }
  function activateStep(i) {
    steps.forEach(function (s, k) { s.classList.toggle('is-on', k === i); });
    photos.forEach(function (img, k) { img.classList.toggle('is-on', k === i); });
  }
  placeSun(0.05);
  if (animate) {
    ST.create({ trigger: '.day__steps', start: 'top center', end: 'bottom center', scrub: true, onUpdate: function (self) { placeSun(0.05 + self.progress * 0.9); } });
    steps.forEach(function (s, i) {
      ST.create({ trigger: s, start: 'top center', end: 'bottom center', onToggle: function (self) { if (self.isActive) activateStep(i); } });
    });
    activateStep(0);
  }

  /* ---------- Карта окрестностей ---------- */
  function setPlace(id) {
    $$('[data-place]').forEach(function (el) { el.classList.toggle('is-active', el.dataset.place === id); });
    $$('[data-route]').forEach(function (el) { el.classList.toggle('is-active', el.dataset.route === id); });
  }
  $$('[data-place]').forEach(function (el) {
    el.addEventListener('click', function () { setPlace(el.dataset.place); });
    el.addEventListener('mouseenter', function () { if (finePointer) setPlace(el.dataset.place); });
  });
  var firstPlace = $('.place[data-place]');
  if (firstPlace) setPlace(firstPlace.dataset.place);
  if (animate) {
    gsap.from('.map .route', { opacity: 0, duration: 1, stagger: 0.15, scrollTrigger: { trigger: '.map__svg', start: 'top 75%' } });
    gsap.from('.map .pin', { scale: 0, transformOrigin: '50% 50%', duration: 0.7, ease: 'back.out(2)', stagger: 0.08, scrollTrigger: { trigger: '.map__svg', start: 'top 75%' } });
  }

  /* ---------- Бронирование: календарь, гости, расчёт ---------- */
  var cal = $('#calendar'), form = $('#bookForm');
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var state = { start: null, end: null, offset: 0, guests: 2 };
  var dayMs = 864e5;
  var fmtDate = function (d) { return d.getDate() + ' ' + L.monthsShort[d.getMonth()]; };
  var monthsShown = function () { return matchMedia('(min-width: 760px)').matches ? 2 : 1; };

  function renderCal() {
    if (!cal) return;
    var html = '';
    for (var m = 0; m < monthsShown(); m++) {
      var first = new Date(today.getFullYear(), today.getMonth() + state.offset + m, 1);
      var startDow = (first.getDay() + 6) % 7, days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
      html += '<div class="cal__month"><h4>' + L.months[first.getMonth()] + ' ' + first.getFullYear() + '</h4><div class="cal__grid" role="grid">';
      html += L.dow.map(function (d) { return '<span class="cal__dow">' + d + '</span>'; }).join('');
      for (var e = 0; e < startDow; e++) html += '<span class="cal__empty"></span>';
      for (var d = 1; d <= days; d++) {
        var date = new Date(first.getFullYear(), first.getMonth(), d), t = date.getTime(), cls = 'cal__day';
        if (t === today.getTime()) cls += ' is-today';
        if (state.start && t === state.start.getTime()) cls += ' is-start';
        if (state.end && t === state.end.getTime()) cls += ' is-end';
        if (state.start && state.end && t > state.start.getTime() && t < state.end.getTime()) cls += ' in-range';
        html += '<button type="button" class="' + cls + '" data-t="' + t + '"' + (t < today.getTime() ? ' disabled' : '') +
          ' aria-label="' + fmtDate(date) + ' ' + date.getFullYear() + '">' + d + '</button>';
      }
      html += '</div></div>';
    }
    $('.cal__months', cal).innerHTML = html;
    $('[data-cal="prev"]', cal).disabled = state.offset <= 0;
    update();
  }
  if (cal) {
    cal.addEventListener('click', function (e) {
      var b = e.target.closest('.cal__day'); if (!b || b.disabled) return;
      var d = new Date(+b.dataset.t);
      if (!state.start || state.end || d <= state.start) { state.start = d; state.end = null; }
      else state.end = d;
      renderCal();
    });
    $('[data-cal="prev"]', cal).addEventListener('click', function () { state.offset = Math.max(0, state.offset - 1); renderCal(); });
    $('[data-cal="next"]', cal).addEventListener('click', function () { state.offset = Math.min(11, state.offset + 1); renderCal(); });
    matchMedia('(min-width: 760px)').addEventListener('change', renderCal);
  }

  function update() {
    if (!form) return;
    var cabin = (form.querySelector('input[name="cabin"]:checked') || {}).value || 'aframe';
    var conf = CABINS[cabin];
    var nights = state.start && state.end ? Math.round((state.end - state.start) / dayMs) : 0;
    $('#sumDates').textContent = state.start ? fmtDate(state.start) + (state.end ? ' — ' + fmtDate(state.end) : ' — …') : '—';
    $('#sumNights').textContent = nights ? L.nights(nights) + ' × ' + fmt(conf.price) + ' ֏' : '';
    $('#sumTotal').textContent = nights ? fmt(nights * conf.price) + ' ֏' : '—';
    $('#guestsOut').textContent = state.guests;
    var warn = !state.start ? L.pick : !state.end ? L.pickEnd : state.guests > conf.max ? L.tooMany(conf.max) : '';
    $('#sumWarn').textContent = warn;
    $('#bookSend').href = waLink(L.msg({
      cabin: L.cabinNames[cabin], guests: state.guests,
      dates: nights ? fmtDate(state.start) + ' — ' + fmtDate(state.end) + ' ' + state.end.getFullYear() : '',
      nights: nights ? L.nights(nights) : '', total: nights ? fmt(nights * conf.price) : ''
    }));
  }
  if (form) {
    form.addEventListener('change', update);
    $$('[data-guests]', form).forEach(function (b) {
      b.addEventListener('click', function () { state.guests = Math.max(1, Math.min(6, state.guests + +b.dataset.guests)); update(); });
    });
  }
  // «Выбрать этот домик» в карточке → отмечаем его в бронировании
  $$('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = form && form.querySelector('input[name="cabin"][value="' + b.dataset.pick + '"]');
      if (r) { r.checked = true; update(); }
    });
  });
  renderCal();

  /* ---------- Курсор и «магнитные» кнопки (только мышь) ---------- */
  if (finePointer && !reduce) {
    var cur = $('.cursor');
    if (cur) {
      root.classList.add('has-cursor');
      var dot = $('.cursor__dot', cur), ring = $('.cursor__ring', cur), label = $('.cursor__ring span', cur);
      label.textContent = L.drag;
      var tx = -100, ty = -100, rx = -100, ry = -100;
      document.addEventListener('pointermove', function (e) {
        tx = e.clientX; ty = e.clientY;
        dot.style.transform = 'translate(' + tx + 'px,' + ty + 'px) translate(-50%,-50%)';
        var el = e.target;
        cur.classList.toggle('is-drag', !!el.closest('.is-pinned .cabins__viewport') && !el.closest('a,button'));
        cur.classList.toggle('is-link', !!el.closest('a,button,label,[data-place],summary'));
      });
      (function follow() {
        rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        requestAnimationFrame(follow);
      })();
    }
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.25) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.35) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();
  window.addEventListener('load', function () { if (animate) ST.refresh(); });
})();
