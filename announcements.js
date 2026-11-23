/* Announcements: the notices that pop up on the website.
 *
 * The console writes the list between the two markers below; nothing else in this file changes
 * when it publishes. Every page loads this file. A notice shows when it is meant for this page,
 * today falls between its dates, and this visitor has not already closed it. Change a notice
 * and it counts as new, so people who closed the old one see the new one once.
 *
 * Every word is written as text, never as HTML, so nothing in a notice can run.
 *
 * Preview: add ?announce=<id> to any page's address to show that notice now, whatever its
 * dates, pages or whether you have closed it before.
 */
(function () {
  var LIST = [
/* cms:announcements */
    {"id":"amw1t6d3m","title":"New Store Opening ","text":"Visit Us From 10-12-2026","image":"uploads/images/announcements/vero-moda-1-99632f93.webp","buttonLabel":"Learn More","buttonUrl":"news/aluna-refreshed-store-experience/","buttonNewTab":false,"button2Label":"Ask AI","button2Url":"https://chatgpt.com/","button2NewTab":true,"size":"medium","mobileShape":"4:5","pages":"all","start":"2026-11-03","end":"2026-11-09"}
/* /cms:announcements */
  ];

  var KEY = 'utc-announcements-seen';
  var me = document.currentScript;
  // the site's root is wherever this file is, so the page works hosted in a sub-folder too
  var ROOT = me && me.src ? me.src.replace(/[^\/]*$/, '') : (location.origin + '/');

  // the page this is: its first folder, e.g. "union-services"; the Home page is "home"
  function thisPage() {
    var rest = location.href.indexOf(ROOT) === 0 ? location.href.slice(ROOT.length) : location.pathname.replace(/^\//, '');
    var first = rest.split(/[?#]/)[0].split('/')[0];
    return (!first || first === 'index.html') ? 'home' : first;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  // a fingerprint of what the notice says, so an edited notice is shown again
  function print(a) {
    var s = [a.title, a.text, a.image, a.buttonLabel, a.buttonUrl, a.button2Label, a.button2Url, a.mobileImage].join('\u0001'), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(h);
  }
  function seen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function markSeen(a) {
    if (a.__preview) return;
    try { var s = seen(); s[a.id] = print(a); localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ }
  }

  function pick() {
    var forced = (location.search.match(/[?&]announce=([a-z0-9-]+)/) || [])[1];
    if (forced) {
      for (var j = 0; j < LIST.length; j++) if (LIST[j].id === forced) return LIST[j];
      return null;
    }
    var page = thisPage(), day = today(), s = seen();
    for (var i = 0; i < LIST.length; i++) {
      var a = LIST[i];
      if (!a || !a.id || !a.title) continue;
      if (a.pages !== 'all' && !(a.pages instanceof Array && a.pages.indexOf(page) >= 0)) continue;
      if (a.start && day < a.start) continue;
      if (a.end && day > a.end) continue;
      if (s[a.id] === print(a)) continue;
      return a;
    }
    return null;
  }

  var CSS =
    '.ann-ov{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;' +
      'background:rgba(13,13,13,.62);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);opacity:0;transition:opacity .3s ease}' +
    '.ann-ov.on{opacity:1}' +
    '.ann-card{position:relative;width:min(440px,100%);max-height:calc(100vh - 32px);overflow:auto;background:transparent;color:#161513;' +
      'border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.35);transform:translateY(14px);transition:transform .3s ease}' +
    '.ann-ov.on .ann-card{transform:none}' +
    // Nothing light behind the picture: a white card under it showed through the smoothed top
    // corners as a pale arc against the dark backdrop. Only the words sit on white.
    '.ann-img{display:block;width:100%;aspect-ratio:16/9;max-height:62vh;object-fit:cover;background:transparent;border-radius:16px 16px 0 0}' +
    '.ann-body{padding:clamp(22px,4vw,30px);background:#fff;border-radius:0 0 16px 16px}' +
    '.ann-card.noimg .ann-body{border-radius:16px}' +
    '.ann-t{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:clamp(22px,3vw,27px);line-height:1.15;margin:0 34px 12px 0}' +
    '.ann-img+.ann-body .ann-t{margin-right:0}' +
    '.ann-p{font-family:Manrope,system-ui,sans-serif;color:#57534c;font-size:15px;line-height:1.7;margin:0;white-space:pre-line}' +
    '.ann-acts{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}' +
    '.ann-btn{display:inline-flex;align-items:center;gap:10px;background:#0d0d0d;color:#fff;text-decoration:none;' +
      'font-family:Archivo,system-ui,sans-serif;font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;' +
      'padding:15px 28px;border-radius:999px;transition:background .3s,gap .25s}' +
    '.ann-btn:hover{background:#3a3833;gap:14px}' +
    // the second button is the quieter one: an outline
    '.ann-btn.alt{background:transparent;color:#161513;box-shadow:inset 0 0 0 1.5px #161513}' +
    '.ann-btn.alt:hover{background:#161513;color:#fff}' +
    '.ann-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.ann-x{position:absolute;top:12px;right:12px;width:38px;height:38px;border-radius:50%;border:0;cursor:pointer;' +
      'background:rgba(255,255,255,.92);color:#161513;display:flex;align-items:center;justify-content:center;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.18)}' +
    '.ann-x:focus-visible,.ann-btn:focus-visible{outline:2px solid #161513;outline-offset:3px}' +
    // SIZES. Medium is the card above. Small is for a line or two; large lets the picture lead.
    '.ann-card.s-small{width:min(340px,100%)}' +
    '.s-small .ann-body{padding:20px}' +
    '.s-small .ann-t{font-size:20px;margin-bottom:8px}' +
    '.s-small .ann-p{font-size:14px;line-height:1.6}' +
    '.s-small .ann-acts{margin-top:16px}' +
    '.s-small .ann-btn{padding:12px 20px}' +
    '.ann-card.s-large{width:min(680px,100%)}' +
    '.s-large .ann-body{padding:clamp(24px,4vw,40px)}' +
    '.s-large .ann-t{font-size:clamp(26px,3.4vw,34px)}' +
    '.s-large .ann-p{font-size:16px}' +
    // THE BAR runs along the bottom of the screen and does not get in the way: no dark backdrop,
    // the page still scrolls and can be clicked, and nothing is taken out of the visitor's hands.
    '.ann-ov.bar{align-items:flex-end;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none;pointer-events:none}' +
    '.ann-ov.bar .ann-card{pointer-events:auto;display:flex;width:min(980px,100%);box-shadow:0 12px 40px rgba(0,0,0,.28)}' +
    '.s-bar .ann-img{flex:0 0 120px;width:120px;aspect-ratio:auto;height:auto;border-radius:16px 0 0 16px}' +
    '.s-bar .ann-body{flex:1;min-width:0;display:flex;align-items:center;gap:22px;padding:16px 64px 16px 22px;border-radius:0 16px 16px 0}' +
    '.s-bar.noimg .ann-body{border-radius:16px}' +
    '.s-bar .ann-words{flex:1;min-width:0}' +
    '.s-bar .ann-t{font-size:19px;margin:0 0 4px}' +
    '.s-bar .ann-p{font-size:14px;line-height:1.5}' +
    '.s-bar .ann-acts{margin-top:0;flex-shrink:0}' +
    '.s-bar .ann-btn{padding:12px 20px}' +
    '.s-bar .ann-x{top:50%;right:14px;width:34px;height:34px;margin-top:-17px;background:#f1eee7;box-shadow:none}' +
    '@media(max-width:640px){.s-bar .ann-img{display:none}' +
      '.s-bar .ann-body{flex-direction:column;align-items:flex-start;gap:12px;padding:16px 56px 16px 16px;border-radius:16px}' +
      '.s-bar .ann-x{top:14px;margin-top:0}}' +
    // SHAPES. A card given a shape takes it as a whole. It may grow taller to fit its words (a
    // short landscape card with a long text), but it never cuts them off.
    '.ann-card.shaped{display:flex;flex-direction:column;overflow:visible}' +
    // with a picture it is a POSTER: the picture fills it, and the words sit over its lower part
    '.ann-card.poster{position:relative;justify-content:flex-end}' +
    '.poster .ann-img{position:absolute;inset:0;width:100%;height:100%;max-height:none;aspect-ratio:auto;border-radius:16px}' +
    '.poster .ann-body{position:relative;background:linear-gradient(180deg,rgba(13,13,13,0) 0,rgba(13,13,13,.78) 42%,rgba(13,13,13,.9) 100%);' +
      'padding-top:clamp(60px,9vw,90px);border-radius:0 0 16px 16px}' +
    '.poster .ann-t{color:#fff}' +
    '.poster .ann-p{color:rgba(255,255,255,.86)}' +
    '.poster .ann-btn{background:#fff;color:#161513}' +
    '.poster .ann-btn:hover{background:#e9e5dc}' +
    '.poster .ann-btn.alt{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px #fff}' +
    '.poster .ann-btn.alt:hover{background:#fff;color:#161513}' +
    '.poster .ann-btn:focus-visible{outline-color:#fff}' +
    // with no picture, the words sit in the middle of a white card of that shape
    '.shaped.noimg .ann-body{flex:1;display:flex;flex-direction:column;justify-content:center}' +
    '@media (prefers-reduced-motion:reduce){.ann-ov,.ann-card{transition:none}}';

  function show(a, preview) {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var size = /^(small|large|bar)$/.test(a.size || '') ? a.size : 'medium';
    var bar = size === 'bar';
    // ON A PHONE an announcement may take another shape and another picture: landscape suits a
    // desk, portrait suits a phone. A preview can ask for the phone version on a wide screen.
    var phone = preview && typeof preview === 'object' && 'phone' in preview ? !!preview.phone
      : !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);
    var shapeKey = a.shape || '', image = a.image;
    if (phone) {
      if (a.mobileShape) shapeKey = a.mobileShape === 'natural' ? '' : a.mobileShape;
      if (a.mobileImage) image = a.mobileImage;
    }
    var ov = document.createElement('div');
    ov.className = 'ann-ov' + (bar ? ' bar' : '');
    var card = document.createElement('div');
    card.className = 'ann-card s-' + size + (image ? '' : ' noimg');
    // the announcement's shape: the width comes from its size, the height from the shape, and a
    // tall one is narrowed rather than allowed to run off the screen
    var RATIO = { '16:9': 16 / 9, '4:3': 4 / 3, '1:1': 1, '4:5': 0.8, '9:16': 0.5625 }[shapeKey];
    // a phone preview on a wide screen is drawn at a phone's width
    var simulated = phone && preview && typeof preview === 'object' && preview.phone;
    if (simulated && !bar) card.style.width = 'min(390px, 100%)';
    if (RATIO && !bar) {
      var W = simulated ? 390 : { small: 340, medium: 440, large: 680 }[size];
      card.className += ' shaped' + (image ? ' poster' : '');
      card.style.width = 'min(' + W + 'px, 100%, calc((100vh - 32px) * ' + RATIO + '))';
      card.style.aspectRatio = String(RATIO);
    }
    card.setAttribute('role', 'dialog');
    // the bar sits beside the page rather than over it, so it does not claim to be modal
    card.setAttribute('aria-modal', bar ? 'false' : 'true');
    card.setAttribute('aria-labelledby', 'annTitle');

    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'ann-x';
    x.setAttribute('aria-label', 'Close');
    x.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    card.appendChild(x);

    if (image) {
      var img = document.createElement('img');
      img.className = 'ann-img';
      img.alt = '';
      img.src = /^https?:/.test(image) ? image : ROOT + image;
      card.appendChild(img);
    }
    var body = document.createElement('div');
    body.className = 'ann-body';
    // the title and words together, so in the bar they sit to the left of the buttons
    var words = document.createElement('div');
    words.className = 'ann-words';
    body.appendChild(words);
    var t = document.createElement('h2');
    t.className = 'ann-t';
    t.id = 'annTitle';
    t.textContent = a.title;
    words.appendChild(t);
    if (a.text) {
      var p = document.createElement('p');
      p.className = 'ann-p';
      p.textContent = a.text;
      words.appendChild(p);
    }
    // Up to two buttons. Each opens in a new tab when it was set to; left to decide, a link to
    // another website does, so the visitor does not lose this one.
    function button(label, url, newTab, alt) {
      if (!label || !url) return null;
      var b = document.createElement('a');
      b.className = 'ann-btn' + (alt ? ' alt' : '');
      b.textContent = label + ' ';
      var external = /^https?:/i.test(url) && url.indexOf(location.origin) !== 0;
      var tab = newTab === true || (newTab !== false && external);
      var arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = tab ? '↗' : '→';
      b.appendChild(arrow);
      b.href = /^(https?|mailto|tel):/i.test(url) ? url : ROOT + url.replace(/^\//, '');
      if (tab) {
        b.target = '_blank'; b.rel = 'noopener';
        var sr = document.createElement('span');
        sr.className = 'ann-sr';
        sr.textContent = ' (opens in a new tab)';
        b.appendChild(sr);
      }
      b.addEventListener('click', function () { markSeen(a); close(); });
      return b;
    }
    var b1 = button(a.buttonLabel, a.buttonUrl, a.buttonNewTab, false);
    var b2 = button(a.button2Label, a.button2Url, a.button2NewTab, !!b1);
    if (b1 || b2) {
      var acts = document.createElement('div');
      acts.className = 'ann-acts';
      if (b1) acts.appendChild(b1);
      if (b2) acts.appendChild(b2);
      body.appendChild(acts);
    }
    card.appendChild(body);
    ov.appendChild(card);

    var before = document.activeElement, overflow = document.documentElement.style.overflow;
    function close() {
      markSeen(a);
      document.removeEventListener('keydown', onKey);
      ov.classList.remove('on');
      if (!bar) document.documentElement.style.overflow = overflow;
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 300);
      if (!bar && before && before.focus) before.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    x.addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(ov);
    // a card holds the visitor's attention; the bar leaves the page scrolling and the focus alone
    if (!bar) document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('on'); });
    if (!bar) x.focus();
  }

  function start() {
    var a = pick();
    if (!a) return;
    // a moment after the page appears, so it does not cover what somebody came to read
    setTimeout(function () { show(a); }, 1200);
  }
  if (window.UTC_ANNOUNCE_PREVIEW) {
    window.UTCAnnounce = { show: function (a, opts) { var c = {}; for (var k in a) c[k] = a[k]; c.__preview = true; show(c, opts || true); } };
    return;
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
