(function () {
  // ARVEST — галерея работ. Без библиотек: всё движение на CSS,
  // JS только строит карточки из data/projects.json и переключает классы.
  var html = document.documentElement;
  var lang = ['ru', 'en'].indexOf(html.lang) > -1 ? html.lang : 'hy';
  var T = {
    hy: { open: 'Բացել կայքը', concept: 'Կոնցեպտ', home: 'Պատկերասրահ', basics: 'Ինչ կա կայքում', contact: 'Կապ' },
    ru: { open: 'Открыть сайт', concept: 'Концепт', home: 'Галерея работ', basics: 'Что есть в сайте', contact: 'Контакт' },
    en: { open: 'Open website', concept: 'Concept', home: 'Gallery of work', basics: 'In every site', contact: 'Contact' }
  }[lang];

  var anim = html.classList.contains('anim');
  var smooth = anim ? 'smooth' : 'auto';

  // Корень сайта = папка выше js/ — от него считаем пути к проектам и картинкам
  var ROOT = new URL('../', document.currentScript.src);
  var resolve = function (path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return new URL(String(path).replace(/^\/+/, ''), ROOT).href;
  };
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var ARROW = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------- Появление при прокрутке ---------- */
  var io = anim ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' }) : null;
  var reveal = function (root) {
    if (io) root.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  };
  reveal(document);

  /* ---------- Данные проекта ----------
     Поля на трёх языках: title_hy / title_ru / title_en и т. д.
     Если перевода нет — показываем армянский текст. */
  var pick = function (p, key) { return p[key + '_' + lang] || p[key + '_hy'] || p[key + '_ru'] || p[key + '_en'] || ''; };
  var media = function (p, key) { return p[key + '_' + lang] || p[key] || ''; };
  // Порядок из админки: меньше — выше; без порядка — в конец
  var rank = function (p) { var n = parseFloat(p.order); return isNaN(n) ? 999 : n; };
  var split = function (title) {
    var k = title.indexOf(' — ');
    return k > 0 ? [title.slice(0, k), title.slice(k + 3)] : [title, ''];
  };
  var slug = function (p, i) {
    var s = String(p.url || '').replace(/^https?:\/\//i, '').replace(/\/+$/, '').split('/').pop();
    s = s.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return s ? 'w-' + s : 'w-' + (i + 1);
  };
  var accent = function (p) { return /^#[0-9a-f]{3,8}$/i.test(String(p.accent || '').trim()) ? p.accent.trim() : ''; };

  function exhibit(p, i, n) {
    var url = resolve(p['url_' + lang] || p.url);
    var external = /^https?:\/\//i.test(p['url_' + lang] || p.url || '') && new URL(url).host !== location.host;
    var title = pick(p, 'title'), parts = split(title);
    var desk = media(p, 'preview'), mob = media(p, 'preview_mobile'), cover = media(p, 'cover');
    var domain = p.domain || url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    var chips = String(pick(p, 'features')).split(',').map(function (s) { return s.trim(); }).filter(Boolean)
      .map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('');
    var meta = [pick(p, 'category'), p.year, p.languages].filter(Boolean)
      .map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('');
    var shot = desk
      ? '<img class="scroller" src="' + esc(resolve(desk)) + '" alt="' + esc(title) + '" width="1000" loading="lazy" decoding="async">'
      : '<img class="still" src="' + esc(resolve(cover)) + '" alt="' + esc(title) + '" loading="lazy" decoding="async">';
    var target = external ? ' target="_blank" rel="noopener"' : '';
    var acc = accent(p);
    return '<article class="exhibit' + (mob ? '' : ' no-phone') + '" id="' + slug(p, i) + '" data-tag data-name="' + esc(parts[0]) + '" data-n="' + (i + 1) + '"' + (acc ? ' style="--acc:' + esc(acc) + '"' : '') + '>' +
      '<div class="container"><div class="exhibit__in">' +
        '<div class="stage rv">' +
          '<div class="stage__glow" aria-hidden="true"></div>' +
          '<div class="browser"><div class="browser__bar" aria-hidden="true"><i></i><i></i><i></i><span>' + esc(domain) + '</span></div><div class="screen">' + shot + '</div></div>' +
          (mob ? '<div class="phone"><div class="screen"><img class="scroller" src="' + esc(resolve(mob)) + '" alt="" width="600" loading="lazy" decoding="async"></div></div>' : '') +
        '</div>' +
        '<div class="label rv" style="--i:1">' +
          '<span class="label__n" aria-hidden="true">' + pad(i + 1) + '</span>' +
          (meta ? '<p class="label__meta">' + meta + '</p>' : '') +
          '<h2>' + esc(parts[0]) + '</h2>' +
          (parts[1] ? '<p class="label__sub">' + esc(parts[1]) + '</p>' : '') +
          '<p class="label__desc">' + esc(pick(p, 'description')) + '</p>' +
          (chips ? '<div class="chips">' + chips + '</div>' : '') +
          '<div class="label__act"><a class="open" href="' + esc(url) + '"' + target + '>' + T.open + ' <b>' + ARROW + '</b></a>' +
            (p.concept ? '<span class="concept">' + T.concept + '</span>' : '') + '</div>' +
        '</div>' +
      '</div></div></article>';
  }

  function indexRow(p, i) {
    var parts = split(pick(p, 'title'));
    return '<li><a href="#' + slug(p, i) + '" data-i="' + i + '"' + (accent(p) ? ' style="--acc:' + esc(accent(p)) + '"' : '') + '>' +
      '<span class="index__n">' + pad(i + 1) + '</span>' +
      '<span><span class="index__t">' + esc(parts[0]) + '</span><span class="index__c">' + esc(pick(p, 'category')) + '</span></span>' +
      '<span class="index__y">' + esc(p.year || '') + '</span>' +
      '<span class="index__go">' + ARROW + '</span></a></li>';
  }

  /* ---------- Длинный скриншот едет вниз и обратно ----------
     Web Animations с готовыми числами (без CSS-переменных в keyframes) —
     браузер целиком отдаёт такую анимацию видеокарте. */
  var fit = function (img) {
    if (img._run) { img._run.cancel(); img._run = null; }
    var shift = img.parentNode.clientHeight - img.offsetHeight;
    if (!anim || !img.animate || !img.offsetHeight || shift >= 0) return;
    var to = 'translate3d(0,' + shift + 'px,0)';
    img._run = img.animate([
      { transform: 'translate3d(0,0,0)', offset: 0 },
      { transform: 'translate3d(0,0,0)', offset: 0.1, easing: 'ease-in-out' },
      { transform: to, offset: 0.9 },
      { transform: to, offset: 1 }
    ], { duration: Math.max(9000, Math.round(-shift / 75 * 1000)), iterations: Infinity, direction: 'alternate' });
    if (!img.closest('.is-live')) img._run.pause();
  };
  var fitAll = function () { document.querySelectorAll('.scroller').forEach(function (img) { if (img.complete) fit(img); }); };
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitAll, 150); });

  /* ---------- Этикетка экспоната (вместо шапки) ---------- */
  var tag = $('tag');
  var tagTxt = tag.querySelector('.tag__txt'), tagN = tag.querySelector('.tag__n'), tagT = tag.querySelector('.tag__t');
  var tagBar = tag.querySelector('.tag__bar b');
  var prevBtn = tag.querySelector('[data-step="-1"]'), nextBtn = tag.querySelector('[data-step="1"]');
  var langLinks = document.querySelectorAll('[data-lang]');
  var stops = [], current = 0, total = 0;

  function setTag(k) {
    var el = stops[k]; if (!el) return;
    current = k;
    var n, t, p;
    if (el.id === 'intro') { n = 'ARVEST'; t = T.home; p = 0; }
    else if (el.id === 'basics') { n = '+'; t = T.basics; p = 1; }
    else if (el.id === 'contact') { n = '→'; t = T.contact; p = 1; }
    else { n = pad(+el.dataset.n) + ' / ' + pad(total); t = el.dataset.name; p = el.dataset.n / total; }
    if (tagT.textContent !== t) {
      tagN.textContent = n; tagT.textContent = t;
      if (anim) { tagTxt.classList.remove('swap'); void tagTxt.offsetWidth; tagTxt.classList.add('swap'); }
    }
    tag.style.setProperty('--acc', el.style.getPropertyValue('--acc') || '');
    tagBar.style.setProperty('--p', p);
    prevBtn.disabled = k === 0;
    nextBtn.disabled = k === stops.length - 1;
    // Переключатель языка ведёт в тот же раздел
    langLinks.forEach(function (a) {
      a.href = a.getAttribute('href').split('#')[0] + (k ? '#' + el.id : '');
    });
  }

  function watchStops() {
    stops = Array.prototype.slice.call(document.querySelectorAll('[data-tag]'));
    total = document.querySelectorAll('.exhibit').length;
    if (!('IntersectionObserver' in window)) return setTag(0);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setTag(stops.indexOf(en.target)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    stops.forEach(function (el) { spy.observe(el); });
    setTag(0);
  }

  tag.addEventListener('click', function (e) {
    var b = e.target.closest('[data-step]'); if (!b) return;
    var el = stops[Math.max(0, Math.min(stops.length - 1, current + +b.dataset.step))];
    if (el) el.scrollIntoView({ behavior: smooth, block: 'start' });
  });
  // Меню языков закрывается кликом мимо и по Esc
  var langBox = tag.querySelector('.tag__lang');
  document.addEventListener('click', function (e) { if (langBox.open && !langBox.contains(e.target)) langBox.open = false; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') langBox.open = false; });

  /* ---------- Живое превью работает, только пока экспонат на экране ---------- */
  function watchLive() {
    if (!anim) return;
    var live = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        en.target.classList.toggle('is-live', en.isIntersecting);
        en.target.querySelectorAll('.scroller').forEach(function (img) {
          if (img._run) img._run[en.isIntersecting ? 'play' : 'pause']();
        });
      });
    });
    document.querySelectorAll('.exhibit').forEach(function (el) { live.observe(el); });
  }

  /* ---------- Обложка, плывущая за курсором над указателем ---------- */
  function peek(items) {
    var foot = document.querySelector('.intro__foot'), list = $('index');
    if (!anim || !window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return;
    var box = document.createElement('div'); box.className = 'index__peek'; box.setAttribute('aria-hidden', 'true');
    foot.appendChild(box);
    var imgs = [], x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    var loop = function () {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      box.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    list.addEventListener('mouseenter', function () {
      if (imgs.length) return;
      imgs = items.map(function (p) {
        var im = new Image(); im.alt = ''; im.decoding = 'async'; im.src = resolve(media(p, 'cover')); box.appendChild(im); return im;
      });
    });
    list.addEventListener('mousemove', function (e) {
      var r = foot.getBoundingClientRect();
      tx = e.clientX - r.left - 360; ty = e.clientY - r.top - 100;
      if (!foot.classList.contains('is-peek')) { x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(loop);
      var a = e.target.closest('a[data-i]');
      imgs.forEach(function (im, i) { im.classList.toggle('is-on', !!a && +a.dataset.i === i); });
      foot.classList.toggle('is-peek', !!a);
    });
    list.addEventListener('mouseleave', function () { foot.classList.remove('is-peek'); });
  }

  /* ---------- Сборка из data/projects.json ---------- */
  var gallery = $('works'), index = $('index');
  fetch(resolve('data/projects.json'), { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var items = (Array.isArray(data) ? data : data.projects || [])
        .filter(function (p) { return p && p.published !== false; })
        .sort(function (a, b) { return rank(a) - rank(b); });
      if (!items.length) return;
      index.innerHTML = items.map(indexRow).join('');
      gallery.innerHTML = items.map(function (p, i) { return exhibit(p, i, items.length); }).join('');
      gallery.querySelectorAll('.scroller').forEach(function (img) {
        if (img.complete) fit(img); else img.addEventListener('load', function () { fit(img); });
      });
      reveal(gallery);
      watchLive();
      peek(items);
    })
    .catch(function () { /* без JSON остаётся запасной список ссылок из HTML */ })
    .then(function () {
      watchStops();
      // Пришли по ссылке с якорем (например, при смене языка) — прокручиваем, когда всё построено
      var target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
      if (target) {
        (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
          .then(function () { requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'instant', block: 'start' }); }); });
      }
    });

  var year = $('year');
  if (year) year.textContent = new Date().getFullYear();
})();
