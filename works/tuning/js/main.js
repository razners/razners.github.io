(function () {
  // Номер WhatsApp — только цифры, без «+» и пробелов
  var WHATSAPP = '37400000000';

  /* Прирост для калькулятора: [минимум, максимум] в долях (0.25 = +25%).
     null — стадия недоступна для этого типа мотора. */
  var GAINS = {
    td: { s1: { hp: [0.25, 0.35], nm: [0.30, 0.40] }, s2: { hp: [0.35, 0.50], nm: [0.40, 0.55] } }, // турбодизель
    tp: { s1: { hp: [0.20, 0.30], nm: [0.25, 0.35] }, s2: { hp: [0.30, 0.45], nm: [0.35, 0.50] } }, // турбобензин
    nd: { s1: { hp: [0.10, 0.15], nm: [0.10, 0.20] }, s2: null },                                  // атмо дизель
    np: { s1: { hp: [0.05, 0.10], nm: [0.05, 0.08] }, s2: null }                                   // атмо бензин
  };

  var lang = ['ru', 'en'].indexOf(document.documentElement.lang) > -1 ? document.documentElement.lang : 'hy';
  var T = {
    hy: {
      hp: 'ձ.ու.', nm: 'Ն·մ',
      s2warn: 'Stage 2-ը պահանջում է վերափոխումներ՝ դաունփայփ, ինտերկուլեր, երբեմն ամրացված կցորդիչ։',
      naWarn: 'Մթնոլորտային շարժիչների համար Stage 2-ը հնարավոր է միայն մասերի վերափոխմամբ, քննարկվում է առանձին։',
      calcMsg: function (d) {
        return 'Բարև Ձեզ։ Ուզում եմ չիպ-թյունինգ։\n' +
          'Շարժիչ՝ ' + d.engine + ', ' + d.stage + '\n' +
          'Գործարանային՝ ' + d.hp + ' ձ.ու. / ' + d.nm + ' Ն·մ\n' +
          'Հաշվիչով՝ ' + d.hpTo + ' ձ.ու. / ' + d.nmTo + ' Ն·մ';
      },
      leadMsg: function (d) {
        return 'Բարև Ձեզ։ Հայտ կայքից։\n' +
          (d.name ? 'Անուն՝ ' + d.name + '\n' : '') +
          'Հեռախոս՝ ' + d.phone + '\n' +
          (d.car ? 'Մեքենա՝ ' + d.car + '\n' : '') +
          'Ծառայություն՝ ' + d.work;
      }
    },
    ru: {
      hp: 'л.с.', nm: 'Нм',
      s2warn: 'Stage 2 требует доработок: даунпайп, интеркулер, иногда усиленное сцепление.',
      naWarn: 'Для атмосферных моторов Stage 2 возможен только с доработкой железа — обсуждается отдельно.',
      calcMsg: function (d) {
        return 'Здравствуйте! Хочу чип-тюнинг.\n' +
          'Мотор: ' + d.engine + ', ' + d.stage + '\n' +
          'Заводские: ' + d.hp + ' л.с. / ' + d.nm + ' Нм\n' +
          'По калькулятору: ' + d.hpTo + ' л.с. / ' + d.nmTo + ' Нм';
      },
      leadMsg: function (d) {
        return 'Здравствуйте! Заявка с сайта.\n' +
          (d.name ? 'Имя: ' + d.name + '\n' : '') +
          'Телефон: ' + d.phone + '\n' +
          (d.car ? 'Авто: ' + d.car + '\n' : '') +
          'Услуга: ' + d.work;
      }
    },
    en: {
      hp: 'hp', nm: 'Nm',
      s2warn: 'Stage 2 needs hardware upgrades: downpipe, intercooler, sometimes a reinforced clutch.',
      naWarn: 'For naturally aspirated engines Stage 2 is only possible with hardware upgrades — we discuss it separately.',
      calcMsg: function (d) {
        return 'Hello! I am interested in chip tuning.\n' +
          'Engine: ' + d.engine + ', ' + d.stage + '\n' +
          'Stock: ' + d.hp + ' hp / ' + d.nm + ' Nm\n' +
          'Calculator: ' + d.hpTo + ' hp / ' + d.nmTo + ' Nm';
      },
      leadMsg: function (d) {
        return 'Hello! Request from the website.\n' +
          (d.name ? 'Name: ' + d.name + '\n' : '') +
          'Phone: ' + d.phone + '\n' +
          (d.car ? 'Car: ' + d.car + '\n' : '') +
          'Service: ' + d.work;
      }
    }
  }[lang];

  document.documentElement.classList.add('js');
  var $ = function (id) { return document.getElementById(id); };
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
    burger.setAttribute('aria-label', open ? burger.dataset.close : burger.dataset.open);
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

  /* ---------- Переключатель кривых на графике: оба / сток / Stage 1 ---------- */
  var dyno = document.querySelector('.dyno');
  document.querySelectorAll('.dyno__toggle button').forEach(function (btn, i, all) {
    btn.addEventListener('click', function () {
      dyno.dataset.view = btn.dataset.view;
      all.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
    });
  });

  /* ---------- Калькулятор ---------- */
  var form = $('calcForm');
  var s2 = form.querySelector('input[name="stage"][value="s2"]');
  var s1 = form.querySelector('input[name="stage"][value="s1"]');
  var labelOf = function (input) { return input.parentNode.querySelector('span').textContent; };
  var pct = function (r) { return '+' + Math.round(r[0] * 100) + '–' + Math.round(r[1] * 100) + '%'; };

  function meter(key, stock, range) {
    var lo = Math.round(stock * (1 + range[0]));
    var hi = Math.round(stock * (1 + range[1]));
    var max = hi * 1.06;
    $(key + 'From').textContent = stock;
    $(key + 'To').textContent = lo + '–' + hi;
    $(key + 'Pct').textContent = pct(range);
    $(key + 'BarStock').style.width = (stock / max * 100) + '%';
    $(key + 'BarLo').style.width = (lo / max * 100) + '%';
    $(key + 'BarHi').style.width = (hi / max * 100) + '%';
    return lo + '–' + hi;
  }

  function calc() {
    var engine = form.querySelector('input[name="engine"]:checked');
    var g = GAINS[engine.value];

    // Stage 2 недоступен для атмосферных моторов
    s2.disabled = !g.s2;
    if (!g.s2 && s2.checked) s1.checked = true;
    var stage = form.querySelector('input[name="stage"]:checked');
    var gain = g[stage.value];

    var hp = Math.max(0, parseInt($('calcHp').value, 10) || 0);
    var nm = Math.max(0, parseInt($('calcNm').value, 10) || 0);
    var hpTo = meter('hp', hp, gain.hp);
    var nmTo = meter('nm', nm, gain.nm);

    $('calcWarn').textContent = !g.s2 ? T.naWarn : (stage.value === 's2' ? T.s2warn : '');
    $('calcSend').href = waLink(T.calcMsg({
      engine: labelOf(engine), stage: labelOf(stage), hp: hp, nm: nm, hpTo: hpTo, nmTo: nmTo
    }));
  }
  form.addEventListener('change', calc);
  form.addEventListener('input', calc);
  calc();

  /* ---------- Форма заявки → WhatsApp ---------- */
  var lead = $('leadForm');
  lead.addEventListener('submit', function (e) {
    e.preventDefault();
    var field = lead.phone.closest('.field');
    var phone = lead.phone.value.trim();
    if (phone.replace(/\D/g, '').length < 6) {
      field.classList.add('has-error');
      lead.phone.focus();
      return;
    }
    field.classList.remove('has-error');
    window.open(waLink(T.leadMsg({
      name: lead.name.value.trim(), phone: phone, car: lead.car.value.trim(), work: lead.work.value
    })), '_blank', 'noopener');
  });
  lead.phone.addEventListener('input', function () { lead.phone.closest('.field').classList.remove('has-error'); });

  $('year').textContent = new Date().getFullYear();
})();
