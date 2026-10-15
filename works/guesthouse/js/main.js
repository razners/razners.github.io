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
  var noanim = /[?&]noanim\b/.test(location.search);
  var reduce = noanim || matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (noanim) root.classList.add('static');
  if (!reduce && 'IntersectionObserver' in window) root.classList.add('anim');

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var fmt = function (n) { return Math.round(n).toLocaleString(L.num); };
  var waLink = function (text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text); };
  var hero = $('.hero');

  /* ---------- Островки шапки светлеют после первого экрана ---------- */
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (en) {
      document.body.classList.toggle('is-past-hero', !en[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  /* ---------- Капсула меню: «бегунок» едет к разделу, который сейчас на экране ---------- */
  var dock = $('.dock'), glider = $('.dock__glider');
  var dockLinks = $$('.dock a[data-sec]');
  function setActive(id) {
    var active = null;
    dockLinks.forEach(function (a) {
      var on = a.dataset.sec === id;
      a.classList.toggle('is-active', on);
      if (on && a.offsetParent && getComputedStyle(a).display !== 'none') active = a;
    });
    if (!glider) return;
    if (active && matchMedia('(min-width: 1024px)').matches) {
      glider.style.width = active.offsetWidth + 'px';
      glider.style.transform = 'translateX(' + active.offsetLeft + 'px)';
      glider.style.opacity = '1';
    } else glider.style.opacity = '0';
  }
  if ('IntersectionObserver' in window) {
    var visible = {};
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = '';
      dockLinks.forEach(function (a) { if (visible[a.dataset.sec] && !current) current = a.dataset.sec; });
      setActive(current);
    }, { rootMargin: '-45% 0px -50% 0px' });
    dockLinks.forEach(function (a) { var s = document.getElementById(a.dataset.sec); if (s) secObs.observe(s); });
  }
  window.addEventListener('resize', function () { var a = $('.dock a.is-active'); setActive(a ? a.dataset.sec : ''); });

  /* ---------- Переключатель языка: остаёмся в той же секции ---------- */
  var sections = $$('main section[id]'), langTick = false;
  function trackSection() {
    langTick = false;
    var current = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id; });
    $$('[data-lang]').forEach(function (a) { a.href = a.getAttribute('href').split('#')[0] + (current ? '#' + current : ''); });
  }
  window.addEventListener('scroll', function () { if (!langTick) { langTick = true; setTimeout(trackSection, 200); } }, { passive: true });
  trackSection();

  /* ---------- Времена года ---------- */
  var ORDER = ['spring', 'summer', 'autumn', 'winter'];
  var particles = null;
  function setSeason(s) {
    root.dataset.season = s;
    $$('.seasons__pills button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.season === s); });
    var cap = $('.seasons__caption');
    if (cap) cap.textContent = L.seasons[s];
    if (particles) particles.setSeason(s);
  }
  var month = new Date().getMonth();
  var season = month >= 2 && month <= 4 ? 'spring' : month >= 5 && month <= 7 ? 'summer' : month >= 8 && month <= 10 ? 'autumn' : 'winter';
  var asked = new URLSearchParams(location.search).get('season');
  if (L.seasons[asked]) season = asked;
  $$('.seasons__pills button').forEach(function (b) { b.addEventListener('click', function () { setSeason(b.dataset.season); }); });
  var badge = $('.season-badge');
  if (badge) badge.addEventListener('click', function () { setSeason(ORDER[(ORDER.indexOf(root.dataset.season) + 1) % 4]); });

  /* ---------- Частицы: лёгкая версия (без теней, мало частиц, пауза вне экрана) ---------- */
  function Particles(canvas) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = 0, h = 0, items = [], kind = 'autumn', running = false, onScreen = true, raf = 0;
    var CONF = {
      spring: { n: 18, colors: ['#F7C6D3', '#F3A6BC', '#FFFFFF'] },
      summer: { n: 22, colors: ['#FFF3B0', '#FFE27A'] },
      autumn: { n: 16, colors: ['#D9692A', '#E8A13A', '#B5481E', '#F2C14E'] },
      winter: { n: 55, colors: ['#FFFFFF'] }
    };
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(initial) {
      var c = CONF[kind], r = Math.random;
      var p = { x: r() * w, y: initial ? r() * h : -20, rot: r() * 6.28, vr: (r() - 0.5) * 0.04, ph: r() * 6.28, color: c.colors[(r() * c.colors.length) | 0], a: 0.9 };
      if (kind === 'winter') { p.s = 1 + r() * 2.2; p.vy = 0.5 + r(); p.vx = (r() - 0.5) * 0.4; p.a = 0.55 + r() * 0.45; }
      else if (kind === 'summer') { p.s = 1.4 + r() * 1.6; p.vy = -(0.1 + r() * 0.3); p.vx = (r() - 0.5) * 0.3; p.y = initial ? h * (0.35 + r() * 0.65) : h + 10; }
      else if (kind === 'spring') { p.s = 4 + r() * 3.5; p.vy = 0.4 + r() * 0.7; p.vx = 0.2 + r() * 0.5; }
      else { p.s = 6 + r() * 5; p.vy = 0.6 + r() * 0.8; p.vx = (r() - 0.3) * 0.6; }
      return p;
    }
    function fill() { var n = Math.round(CONF[kind].n * (w < 700 ? 0.55 : 1)); items = []; for (var i = 0; i < n; i++) items.push(make(true)); }
    function tick() {
      raf = 0;
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < items.length; i++) {
        var p = items[i];
        p.ph += 0.02; p.x += p.vx + Math.sin(p.ph) * (kind === 'winter' ? 0.3 : 0.7); p.y += p.vy; p.rot += p.vr;
        if (p.y > h + 30 || p.y < -40 || p.x > w + 40 || p.x < -40) { items[i] = p = make(false); }
        ctx.fillStyle = p.color;
        if (kind === 'summer') {
          // светлячок: мягкое свечение двумя кругами вместо дорогой тени
          var f = 0.35 + 0.65 * Math.abs(Math.sin(p.ph * 0.7));
          ctx.globalAlpha = f * 0.25; ctx.beginPath(); ctx.arc(p.x, p.y, p.s * 3.2, 0, 6.28); ctx.fill();
          ctx.globalAlpha = f; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill();
        } else if (kind === 'winter') {
          ctx.globalAlpha = p.a; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.28); ctx.fill();
        } else {
          ctx.globalAlpha = p.a; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath();
          if (kind === 'spring') ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.28);
          else { ctx.moveTo(0, -p.s); ctx.quadraticCurveTo(p.s * 0.8, -p.s * 0.2, 0, p.s); ctx.quadraticCurveTo(-p.s * 0.8, -p.s * 0.2, 0, -p.s); }
          ctx.fill(); ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    function play() { if (!running && onScreen && !document.hidden) { running = true; if (!raf) raf = requestAnimationFrame(tick); } }
    function stop() { running = false; }
    resize(); fill();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { resize(); fill(); }, 200); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
    new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; onScreen ? play() : stop(); }).observe(canvas);
    this.setSeason = function (s) { kind = s; fill(); play(); };
  }
  var canvas = $('.hero__particles');
  if (canvas && !reduce && 'IntersectionObserver' in window) particles = new Particles(canvas);
  setSeason(season);

  /* ---------- Параллакс сцены: считается только когда что-то двигается ---------- */
  var layers = $$('.hero [data-depth]');
  var mx = 0, my = 0, cx = 0, cy = 0, sy = 0, pending = false, heroH = hero ? hero.offsetHeight : 0;
  function render() {
    pending = false;
    cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
    var p = Math.min(sy / heroH, 1);
    for (var i = 0; i < layers.length; i++) {
      var d = +layers[i].dataset.depth;
      layers[i].style.transform = 'translate3d(' + (-cx * d * 30).toFixed(1) + 'px,' + (-cy * d * 12 + p * heroH * d * 0.5).toFixed(1) + 'px,0)';
    }
    // продолжаем, пока мышь «догоняется», потом останавливаемся
    if (Math.abs(mx - cx) > 0.002 || Math.abs(my - cy) > 0.002) schedule();
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(render); } }
  if (hero && !reduce) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < heroH || sy < heroH) { sy = Math.min(y, heroH); schedule(); }
    }, { passive: true });
    window.addEventListener('resize', function () { heroH = hero.offsetHeight; });
    if (finePointer) {
      hero.addEventListener('pointermove', function (e) { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; schedule(); }, { passive: true });
      hero.addEventListener('pointerleave', function () { mx = 0; my = 0; schedule(); });
    }
  }

  /* ---------- Появление при прокрутке: CSS-переходы, класс ставит IntersectionObserver ---------- */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
            w.appendChild(inner); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  }
  var counters = $$('[data-count]');
  function runCounter(el) {
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), suffix = el.dataset.suffix || '';
    var show = function (v) { el.textContent = v.toLocaleString(L.num, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix; };
    if (reduce) { show(to); return; }
    var start = performance.now(), dur = 1600;
    (function step(t) {
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      show(to * e); if (k < 1) requestAnimationFrame(step);
    })(start);
  }
  if (root.classList.contains('anim')) {
    $$('.split').forEach(splitWords);
    counters.forEach(function (el) { el.textContent = '0' + (el.dataset.suffix || ''); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in'); io.unobserve(en.target);
        if (en.target.hasAttribute('data-count')) runCounter(en.target);
        if (en.target.classList.contains('day__arc')) runSun();
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    $$('.fade-up, .split, .reveal-img, [data-count], .day__arc').forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Солнце один раз проходит дугу дня ---------- */
  function runSun() {
    var arc = $('.day__arc .path'), sun = $('.day__sun');
    if (!arc || !sun) return;
    var len = arc.getTotalLength(), start = performance.now(), dur = 2600;
    (function step(t) {
      var k = Math.min(1, (t - start) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      var pt = arc.getPointAtLength(len * e);
      sun.setAttribute('cx', pt.x); sun.setAttribute('cy', pt.y);
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Карта окрестностей ---------- */
  function setPlace(id) {
    $$('[data-place]').forEach(function (el) { el.classList.toggle('is-active', el.dataset.place === id); });
    $$('[data-route]').forEach(function (el) { el.classList.toggle('is-active', el.dataset.route === id); });
  }
  $$('[data-place]').forEach(function (el) {
    el.addEventListener('click', function () { setPlace(el.dataset.place); });
    if (finePointer) el.addEventListener('mouseenter', function () { setPlace(el.dataset.place); });
  });
  var firstPlace = $('.place[data-place]');
  if (firstPlace) setPlace(firstPlace.dataset.place);

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
      html += '<div class="cal__month"><h4>' + L.months[first.getMonth()] + ' ' + first.getFullYear() + '</h4><div class="cal__grid">';
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
      if (!state.start || state.end || d <= state.start) { state.start = d; state.end = null; } else state.end = d;
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
    $('#sumWarn').textContent = !state.start ? L.pick : !state.end ? L.pickEnd : state.guests > conf.max ? L.tooMany(conf.max) : '';
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

  var year = $('#year'); if (year) year.textContent = new Date().getFullYear();
})();
