/* LOGOPRAX — interakcije sajta (bez biblioteka, bez build koraka) */
(function () {
  'use strict';

  /* ================== PODEŠAVANJA ==================
     formEndpoint: adresa servisa koji prima formu i šalje je na email centra.
     Npr. Formspree: 'https://formspree.io/f/abcdwxyz'  (vidi README.md)
     Dok je prazno, forma prikazuje poruku da pozovete telefonom. */
  var CONFIG = {
    formEndpoint: '',
    phone: '+387 63 976 310'
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Zaglavlje pri skrolovanju ---------- */
  var header = $('#site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobilni meni ---------- */
  var menuBtn = $('#menu-btn'), mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    var setMenu = function (open) {
      mobileNav.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
      $('.ic-open', menuBtn).hidden = open;
      $('.ic-close', menuBtn).hidden = !open;
    };
    menuBtn.addEventListener('click', function () { setMenu(mobileNav.hidden); });
    $$('a', mobileNav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuBtn.focus(); } });
  }

  /* ---------- Brojači u traci poverenja ---------- */
  var trust = $('.trust');
  if (trust) {
    var counters = $$('[data-count]', trust), lines = $$('.trust-line', trust);
    var render = function (p) {
      counters.forEach(function (el) {
        var n = parseFloat(el.getAttribute('data-count')) * p, dec = el.getAttribute('data-dec');
        el.textContent = dec ? n.toFixed(1).replace('.', ',') : String(Math.round(n));
      });
      lines.forEach(function (l, i) { l.style.width = (Math.max(0, Math.min(1, p * 1.6 - i * 0.15)) * 100).toFixed(1) + '%'; });
    };
    if (!reduceMotion && 'IntersectionObserver' in window) {
      render(0);
      var started = false;
      var run = function () {
        if (started) return; started = true;
        var t0 = performance.now(), D = 1800;
        var step = function (t) { var k = Math.min(1, (t - t0) / D); render(1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      };
      var io = new IntersectionObserver(function (en) { if (en.some(function (x) { return x.isIntersecting; })) { run(); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(trust);
    }
  }

  /* ---------- Utisci roditelja (vrteška) ---------- */
  var T = [
    { text: 'Javili smo se jer je naš sin kasnio s govorom i imao poteškoće s razumijevanjem jezika. Zahvaljujući stručnom, profesionalnom i toplom pristupu osoblja, napravio je ogroman napredak. Najviše nam znači što je na terapije odlazio s velikom radošću.', who: 'S.E., roditelj', src: 'Instagram · logoprax_brcko' },
    { text: 'Imali smo izuzetno pozitivno iskustvo sa Tomatis terapijom. Prostor je moderan, miran i prilagođen djeci, a terapeuti profesionalni, topli i puni razumijevanja. Vidimo pozitivne promjene i, što je najvažnije, dijete se osjeća sigurno i sretno.', who: 'Roditelj', src: 'Google recenzija · 5 ★' },
    { text: 'Profesionalni, ljubazni i izuzetno efikasni. Veliki napredak za kratko vrijeme, veoma smo zadovoljni. Toplo preporučujem.', who: 'Roditelj', src: 'Google recenzija · 5 ★' },
    { text: 'Svaka čast na ljubaznosti, empatiji i ljubavi. Profesionalnost i znanje koje imaju daju nadu da naša djeca napreduju iz dana u dan. Hvala!', who: 'Roditelj', src: 'Google recenzija · 5 ★' },
    { text: 'Sve preporuke od srca za logopedski centar Logoprax, tetu Melinu i njen tim iz snova.', who: 'Roditelj', src: 'Google recenzija · 5 ★' }
  ];
  var tText = $('#t-text');
  if (tText) {
    var ti = 0, dots = $$('.t-dot');
    var show = function (i) {
      ti = (i + T.length) % T.length;
      tText.textContent = T[ti].text; $('#t-who').textContent = T[ti].who; $('#t-src').textContent = T[ti].src;
      dots.forEach(function (d, k) {
        var on = k === ti;
        d.style.width = on ? '28px' : '10px'; d.style.background = on ? '#367A65' : '#C9DAD4';
        d.setAttribute('aria-current', on ? 'true' : 'false');
      });
    };
    $('#t-prev').addEventListener('click', function () { show(ti - 1); });
    $('#t-next').addEventListener('click', function () { show(ti + 1); });
    dots.forEach(function (d) { d.addEventListener('click', function () { show(parseInt(d.getAttribute('data-i'), 10)); }); });
  }

  /* ---------- Biografija osnivača (telefon) ---------- */
  var bioBtn = $('#bio-toggle'), bio = $('#founder-bio');
  if (bioBtn && bio) {
    bioBtn.addEventListener('click', function () {
      var open = !bio.classList.contains('open');
      bio.classList.toggle('open', open);
      bioBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      bioBtn.textContent = open ? 'Prikaži manje' : 'Pročitajte cijelu biografiju';
    });
  }

  /* ---------- Forma za zakazivanje ---------- */
  var form = $('#appt-form');
  if (form) {
    var age = '';
    var ages = $$('.age-opt', form);
    var paintAges = function (invalid) {
      ages.forEach(function (b) {
        var on = b.getAttribute('data-v') === age;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? '#367A65' : '#FBFDFC';
        b.style.color = on ? '#FFFFFF' : '#202725';
        b.style.border = on ? '1.5px solid #367A65' : (invalid ? '1.5px solid #B42318' : '1px solid #C9DAD4');
      });
    };
    ages.forEach(function (b) { b.addEventListener('click', function () { age = b.getAttribute('data-v'); setErr('uzrast', ''); paintAges(false); }); });

    var fields = { ime: $('#f-ime'), tel: $('#f-tel'), email: $('#f-email'), usluga: $('#f-usluga'), poruka: $('#f-poruka'), privacy: $('#f-privacy') };
    var errBox = $('#form-error'), btn = $('#submit-btn');

    function setErr(k, msg) {
      var box = $('.err[data-for="' + k + '"]', form);
      if (box) { box.hidden = !msg; var sp = $('span', box); if (sp) sp.textContent = msg; }
      var f = fields[k];
      if (f && k !== 'privacy') { f.classList.toggle('is-invalid', !!msg); f.setAttribute('aria-invalid', msg ? 'true' : 'false'); }
    }
    function validate() {
      var e = {};
      if (fields.ime.value.trim().length < 3) e.ime = 'Unesite ime i prezime.';
      if (!/^\+?\d{8,13}$/.test(fields.tel.value.replace(/[\s\-\/().]/g, ''))) e.tel = 'Unesite ispravan broj telefona.';
      var em = fields.email.value.trim();
      if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) e.email = 'Email adresa nije ispravna.';
      if (!age) e.uzrast = 'Odaberite uzrast djeteta.';
      if (!fields.usluga.value) e.usluga = 'Odaberite uslugu.';
      if (!fields.privacy.checked) e.privacy = 'Potrebna je vaša saglasnost.';
      return e;
    }
    ['ime', 'tel', 'email', 'usluga', 'privacy'].forEach(function (k) {
      fields[k].addEventListener(k === 'usluga' || k === 'privacy' ? 'change' : 'input', function () { setErr(k, ''); });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var e = validate();
      ['ime', 'tel', 'email', 'uzrast', 'usluga', 'privacy'].forEach(function (k) { setErr(k, e[k] || ''); });
      paintAges(!!e.uzrast);
      var keys = Object.keys(e);
      if (keys.length) {
        errBox.hidden = false;
        $('div', errBox).textContent = 'Molimo provjerite označena polja i pokušajte ponovo.';
        var first = fields[keys[0]] || ages[0]; if (first && first.focus) first.focus();
        return;
      }
      errBox.hidden = true;
      if (!CONFIG.formEndpoint) {
        errBox.hidden = false;
        $('div', errBox).textContent = 'Online forma trenutno nije aktivna. Molimo pozovite nas na ' + CONFIG.phone + '.';
        return;
      }
      btn.disabled = true; btn.style.opacity = '0.7'; btn.textContent = 'Šaljem upit…';
      var data = {
        ime: fields.ime.value.trim(), telefon: fields.tel.value.trim(), email: fields.email.value.trim(),
        uzrast: age, usluga: fields.usluga.value, poruka: fields.poruka.value.trim(),
        _subject: 'Novi upit za termin — LOGOPRAX sajt'
      };
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); })
        .then(function () {
          $('#s-name').textContent = data.ime.split(' ')[0];
          $('#s-tel').textContent = data.telefon;
          $('#form-wrap').hidden = true; $('#form-success').hidden = false;
          $('#form-success').focus && $('#form-success').setAttribute('tabindex', '-1');
          $('#form-success').focus();
        })
        .catch(function () {
          errBox.hidden = false;
          $('div', errBox).textContent = 'Slanje nije uspjelo. Provjerite internet vezu ili nas pozovite na ' + CONFIG.phone + '.';
        })
        .then(function () { btn.disabled = false; btn.style.opacity = '1'; btn.textContent = 'Pošaljite upit'; });
    });

    var resetBtn = $('#form-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      form.reset(); age = ''; paintAges(false);
      $('#form-success').hidden = true; $('#form-wrap').hidden = false; fields.ime.focus();
    });
  }
})();
