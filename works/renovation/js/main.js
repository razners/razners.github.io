(function () {
  // Номер WhatsApp — только цифры, без «+» и пробелов
  var WHATSAPP = '37400000000';

  var lang = ['ru', 'en'].indexOf(document.documentElement.lang) > -1 ? document.documentElement.lang : 'hy';
  var T = {
    hy: {
      locale: 'ru-RU', unit: 'մ²',
      menuOpen: 'Բացել մենյուն', menuClose: 'Փակել մենյուն',
      work: 'Աշխատանքի տեսակը', less: 'Պակաս', more: 'Ավել', qty: 'Քանակ', remove: 'Հեռացնել',
      range: function (a, b) { return 'սովորաբար ' + a + '-ից ' + b + ' ֏՝ կախված պատերի և հատակի վիճակից'; },
      empty: 'Նշեք մակերեսը',
      calcMsg: function (lines, total) { return 'Բարև Ձեզ։ Ուզում եմ հաշվարկել վերանորոգումը։\n' + lines + '\n\nԿայքի հաշվիչով՝ ~' + total + ' ֏'; },
      leadMsg: function (d) {
        return 'Բարև Ձեզ։ Չափագրման հայտ կայքից։\n' +
          (d.name ? 'Անուն՝ ' + d.name + '\n' : '') + 'Հեռախոս՝ ' + d.phone + '\n' + 'Աշխատանքներ՝ ' + d.work +
          (d.msg ? '\nՄեկնաբանություն՝ ' + d.msg : '');
      }
    },
    ru: {
      locale: 'ru-RU', unit: 'м²',
      menuOpen: 'Открыть меню', menuClose: 'Закрыть меню',
      work: 'Вид работ', less: 'Меньше', more: 'Больше', qty: 'Количество', remove: 'Убрать',
      range: function (a, b) { return 'обычно от ' + a + ' до ' + b + ' ֏ — зависит от состояния стен и пола'; },
      empty: 'Укажите площадь',
      calcMsg: function (lines, total) { return 'Здравствуйте! Хочу рассчитать ремонт:\n' + lines + '\n\nПо калькулятору на сайте: ~' + total + ' ֏'; },
      leadMsg: function (d) {
        return 'Здравствуйте! Заявка на замер с сайта.\n' +
          (d.name ? 'Имя: ' + d.name + '\n' : '') + 'Телефон: ' + d.phone + '\n' + 'Работы: ' + d.work +
          (d.msg ? '\nКомментарий: ' + d.msg : '');
      }
    },
    en: {
      locale: 'en-US', unit: 'm²',
      menuOpen: 'Open menu', menuClose: 'Close menu',
      work: 'Type of work', less: 'Less', more: 'More', qty: 'Quantity', remove: 'Remove',
      range: function (a, b) { return 'usually ' + a + '–' + b + ' ֏, depending on the condition of walls and floors'; },
      empty: 'Enter the area',
      calcMsg: function (lines, total) { return 'Hello! I would like a renovation estimate:\n' + lines + '\n\nWebsite calculator: ~' + total + ' ֏'; },
      leadMsg: function (d) {
        return 'Hello! Site visit request from the website.\n' +
          (d.name ? 'Name: ' + d.name + '\n' : '') + 'Phone: ' + d.phone + '\n' + 'Work: ' + d.work +
          (d.msg ? '\nComment: ' + d.msg : '');
      }
    }
  }[lang];

  document.documentElement.classList.add('js');
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Math.round(n).toLocaleString(T.locale); };
  var waLink = function (text) { return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text); };

  /* ---------- Шапка и нижняя панель ---------- */
  var header = document.querySelector('.header');
  var mbar = document.querySelector('.mbar');
  var onScroll = function () {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    mbar.classList.toggle('is-visible', y > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  var burger = document.querySelector('.burger');
  var nav = $('nav');
  var setNav = function (open) {
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
  };
  burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function () { setNav(false); });

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

  // Браузер не всегда прокручивает к #якорю при загрузке, пока грузятся шрифты, — помогаем
  if (location.hash.length > 1) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) {
      var go = function () { target.scrollIntoView({ behavior: 'instant', block: 'start' }); };
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
        .then(function () { requestAnimationFrame(go); });
    }
  }

  /* ---------- Появление блоков ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- До / После ---------- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var set = function () { ba.style.setProperty('--pos', range.value + '%'); };
    range.addEventListener('input', set);
    set();
  });

  /* ---------- Калькулятор ----------
     Цены берутся из таблицы прайса (#priceTable) */
  var services = Array.prototype.map.call(document.querySelectorAll('#priceTable tr'), function (tr, i) {
    var cells = tr.querySelectorAll('td');
    var priceText = cells[1].textContent;
    var unit = (priceText.split('/')[1] || T.unit).trim();
    return { id: i, name: cells[0].textContent.trim(), price: parseInt(priceText.replace(/\D/g, ''), 10) || 0, unit: unit };
  });

  var rowsEl = $('calcRows');
  var totalEl = $('calcTotal');
  var rangeEl = $('calcRange');
  var sendEl = $('calcSend');
  var rows = [{ s: 0, q: 6 }];

  var options = services.map(function (s) {
    return '<option value="' + s.id + '">' + s.name + ' — ' + fmt(s.price) + ' ֏/' + s.unit + '</option>';
  }).join('');

  function render() {
    rowsEl.innerHTML = rows.map(function (r, i) {
      var s = services[r.s];
      return '<div class="crow" data-i="' + i + '">' +
        '<label class="crow__select"><select aria-label="' + T.work + '">' + options + '</select></label>' +
        '<div class="crow__qty">' +
          '<button type="button" data-step="-1" aria-label="' + T.less + '">−</button>' +
          '<label><input type="number" inputmode="decimal" min="0" step="1" value="' + r.q + '" aria-label="' + T.qty + '"><span class="crow__unit">' + s.unit + '</span></label>' +
          '<button type="button" data-step="1" aria-label="' + T.more + '">+</button>' +
        '</div>' +
        '<div class="crow__sum">' + fmt(s.price * r.q) + ' ֏</div>' +
        (rows.length > 1 ? '<button type="button" class="crow__del">' + T.remove + '</button>' : '') +
      '</div>';
    }).join('');
    rowsEl.querySelectorAll('select').forEach(function (sel, i) { sel.value = rows[i].s; });
    update();
  }

  function update() {
    var total = 0;
    var lines = [];
    rows.forEach(function (r, i) {
      var s = services[r.s];
      var sum = s.price * r.q;
      total += sum;
      var sumEl = rowsEl.querySelector('[data-i="' + i + '"] .crow__sum');
      if (sumEl) sumEl.textContent = fmt(sum) + ' ֏';
      if (r.q > 0) lines.push('— ' + s.name + ': ' + r.q + ' ' + s.unit);
    });
    totalEl.textContent = fmt(total);
    rangeEl.textContent = total > 0 ? T.range(fmt(total), fmt(total * 1.25)) : T.empty;
    sendEl.href = waLink(T.calcMsg(lines.join('\n'), fmt(total)));
  }

  rowsEl.addEventListener('change', function (e) {
    var row = e.target.closest('.crow'); if (!row) return;
    var i = +row.dataset.i;
    if (e.target.tagName === 'SELECT') { rows[i].s = +e.target.value; render(); }
  });
  rowsEl.addEventListener('input', function (e) {
    if (e.target.tagName !== 'INPUT') return;
    var i = +e.target.closest('.crow').dataset.i;
    rows[i].q = Math.max(0, parseFloat(e.target.value.replace(',', '.')) || 0);
    update();
  });
  rowsEl.addEventListener('click', function (e) {
    var row = e.target.closest('.crow'); if (!row) return;
    var i = +row.dataset.i;
    var step = e.target.closest('[data-step]');
    if (step) {
      rows[i].q = Math.max(0, Math.round(rows[i].q) + +step.dataset.step);
      row.querySelector('input').value = rows[i].q;
      update();
    } else if (e.target.closest('.crow__del')) {
      rows.splice(i, 1); render();
    }
  });
  $('calcAdd').addEventListener('click', function () {
    var used = rows.map(function (r) { return r.s; });
    var next = services.findIndex(function (s) { return used.indexOf(s.id) === -1; });
    rows.push({ s: next === -1 ? 0 : next, q: 10 });
    render();
    var sel = rowsEl.querySelectorAll('select');
    sel[sel.length - 1].focus();
  });
  render();

  /* ---------- Форма заявки → WhatsApp ---------- */
  var form = $('leadForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = form.phone.value.trim();
    var field = form.phone.closest('.field');
    if (phone.replace(/\D/g, '').length < 6) {
      field.classList.add('has-error');
      form.phone.focus();
      return;
    }
    field.classList.remove('has-error');
    window.open(waLink(T.leadMsg({
      name: form.name.value.trim(), phone: phone, work: form.work.value, msg: form.msg.value.trim()
    })), '_blank', 'noopener');
  });
  form.phone.addEventListener('input', function () { form.phone.closest('.field').classList.remove('has-error'); });

  $('year').textContent = new Date().getFullYear();
})();
