(function () {
  // Номер WhatsApp студии — только цифры, без «+» и пробелов
  var WHATSAPP = '37400000000';

  var lang = ['ru', 'en'].indexOf(document.documentElement.lang) > -1 ? document.documentElement.lang : 'hy';
  var T = {
    hy: {
      menuOpen: 'Բացել մենյուն', menuClose: 'Փակել մենյուն',
      all: 'Բոլորը', open: 'Բացել կայքը', concept: 'Կոնցեպտ', empty: 'Նախագծերը շուտով կհայտնվեն։',
      leadMsg: function (d) {
        return 'Բարև Ձեզ։ Ուզում եմ կայք պատվիրել։\n' + (d.name ? 'Անուն՝ ' + d.name + '\n' : '') +
          'Հեռախոս՝ ' + d.phone + '\n' + 'Բիզնես՝ ' + d.biz + (d.msg ? '\n' + d.msg : '');
      }
    },
    ru: {
      menuOpen: 'Открыть меню', menuClose: 'Закрыть меню',
      all: 'Все', open: 'Открыть сайт', concept: 'Концепт', empty: 'Проекты скоро появятся.',
      leadMsg: function (d) {
        return 'Здравствуйте! Хочу заказать сайт.\n' + (d.name ? 'Имя: ' + d.name + '\n' : '') +
          'Телефон: ' + d.phone + '\n' + 'Бизнес: ' + d.biz + (d.msg ? '\n' + d.msg : '');
      }
    },
    en: {
      menuOpen: 'Open menu', menuClose: 'Close menu',
      all: 'All', open: 'Open website', concept: 'Concept', empty: 'Projects are coming soon.',
      leadMsg: function (d) {
        return 'Hello! I would like to order a website.\n' + (d.name ? 'Name: ' + d.name + '\n' : '') +
          'Phone: ' + d.phone + '\n' + 'Business: ' + d.biz + (d.msg ? '\n' + d.msg : '');
      }
    }
  }[lang];

  // Корень сайта = папка выше js/ — от него считаем пути к проектам и картинкам
  var ROOT = new URL('../', document.currentScript.src);
  var resolve = function (path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return new URL(String(path).replace(/^\/+/, ''), ROOT).href;
  };

  document.documentElement.classList.add('js');
  var $ = function (id) { return document.getElementById(id); };
  var waLink = function (text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Шапка и нижняя панель ---------- */
  var header = document.querySelector('.header');
  var mbar = document.querySelector('.mbar');
  var onScroll = function () {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (mbar) mbar.classList.toggle('is-visible', y > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('.burger');
  var nav = $('nav');
  if (burger && nav) {
    var setNav = function (open) {
      document.body.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
    };
    burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function () { setNav(false); });
  }

  /* ---------- Переключатель языка: остаёмся в той же секции ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var langLinks = document.querySelectorAll('[data-lang]');
  var trackSection = function () {
    var current = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top < window.innerHeight * 0.4) current = s.id;
    });
    langLinks.forEach(function (a) {
      a.href = a.getAttribute('href').split('#')[0] + (current ? '#' + current : '');
    });
  };
  trackSection();
  window.addEventListener('scroll', trackSection, { passive: true });

  if (location.hash.length > 1) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      var go = function () { target.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
        .then(function () { requestAnimationFrame(go); });
    }
  }

  /* ---------- Появление блоков ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  var reveal = function (els) {
    els.forEach(function (el) { io ? io.observe(el) : el.classList.add('is-in'); });
  };
  reveal(document.querySelectorAll('.reveal'));

  /* ---------- Работы из data/projects.json ----------
     Поля на трёх языках: title_hy / title_ru / title_en и т. д.
     Если перевода нет — показываем армянский текст. */
  var list = $('projects');
  var filters = $('filters');
  var pick = function (p, key) { return p[key + '_' + lang] || p[key + '_hy'] || p[key + '_ru'] || p[key + '_en'] || ''; };
  // Порядок из админки: меньше — выше; без порядка — в конец
  var rank = function (p) { var n = parseFloat(p.order); return isNaN(n) ? 999 : n; };
  var host = function (url) { try { return new URL(url).host; } catch (e) { return ''; } };

  function card(p) {
    var url = resolve(p['url_' + lang] || p.url);
    var external = /^https?:\/\//i.test(p['url_' + lang] || p.url || '') && host(url) !== location.host;
    var chips = [p.languages].concat(String(pick(p, 'features')).split(','))
      .map(function (s) { return String(s || '').trim(); }).filter(Boolean)
      .map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('');
    var title = pick(p, 'title');
    return '<a class="project reveal" href="' + esc(url) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + ' data-cat="' + esc(pick(p, 'category')) + '">' +
      '<div class="project__bar" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(p.domain || title) + '</span></div>' +
      '<div class="project__img"><img src="' + esc(resolve(p['cover_' + lang] || p.cover)) + '" alt="' + esc(title) + '" loading="lazy" width="1200" height="750"></div>' +
      '<div class="project__body">' +
        '<p class="project__meta">' + esc(pick(p, 'category')) + (p.concept ? '<span class="badge">' + T.concept + '</span>' : '') + '</p>' +
        '<h3>' + esc(title) + '</h3>' +
        '<p class="project__desc">' + esc(pick(p, 'description')) + '</p>' +
        (chips ? '<div class="chips">' + chips + '</div>' : '') +
        '<span class="project__go">' + T.open + ' <svg viewBox="0 0 24 24" class="i" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
      '</div></a>';
  }

  function renderFilters(items) {
    var cats = [];
    items.forEach(function (p) { var c = pick(p, 'category'); if (c && cats.indexOf(c) === -1) cats.push(c); });
    if (cats.length < 2) { filters.innerHTML = ''; return; }
    filters.innerHTML = [T.all].concat(cats).map(function (c, i) {
      return '<button type="button" aria-pressed="' + (i === 0) + '" data-cat="' + (i === 0 ? '' : esc(c)) + '">' + esc(c) + '</button>';
    }).join('');
  }

  if (list) {
    fetch(resolve('data/projects.json'), { cache: 'no-cache' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (Array.isArray(data) ? data : data.projects || [])
          .filter(function (p) { return p && p.published !== false; })
          .sort(function (a, b) { return rank(a) - rank(b); });
        if (!items.length) { list.innerHTML = '<p class="projects__empty">' + T.empty + '</p>'; return; }
        list.innerHTML = items.map(card).join('');
        renderFilters(items);
        reveal(list.querySelectorAll('.reveal'));
      })
      .catch(function () { /* без JSON остаётся запасной список из HTML */ });

    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button'); if (!btn) return;
      filters.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      list.querySelectorAll('.project').forEach(function (el) {
        el.hidden = !!btn.dataset.cat && el.dataset.cat !== btn.dataset.cat;
      });
    });
  }

  /* ---------- Форма заявки → WhatsApp ---------- */
  var form = $('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var phone = form.phone.value.trim();
      var field = form.phone.closest('.field');
      if (phone.replace(/\D/g, '').length < 6) { field.classList.add('has-error'); form.phone.focus(); return; }
      field.classList.remove('has-error');
      window.open(waLink(T.leadMsg({
        name: form.name.value.trim(), phone: phone, biz: form.biz.value, msg: form.msg.value.trim()
      })), '_blank', 'noopener');
    });
    form.phone.addEventListener('input', function () { form.phone.closest('.field').classList.remove('has-error'); });
  }

  var year = $('year');
  if (year) year.textContent = new Date().getFullYear();
})();
