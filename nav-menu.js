'use strict';
/* Union Trading Co. — shared header section dropdowns.
   Injected on every page: finds the main-nav links and, for the content pages,
   hangs a hover dropdown of in-page sections beneath each one. On mobile the
   same markup renders as an indented sub-list inside the open hamburger menu. */
(function () {
  // page basename -> ordered [label, href] sections
  var MENUS = {
    'About': [
      ['CEO Message', 'About/#ceo'],
      ['Our Evolution', 'About/#evolution'],
      ['Our Story', 'About/#story'],
      ['Global Partners', 'About/#brands'],
      ['Our People', 'About/#people']
    ],
    'Divisions': [
      ['Explore Divisions', 'Divisions/#explore'],
      ['All Divisions', 'Divisions/#all-divisions'],
      ['Union Electronics', 'Union-Electronics/'],
      ['Aluna', 'Aluna/'],
      ['FMCG', 'Divisions/#all-divisions'],
      ['Labels', 'Divisions/#all-divisions'],
      ['Union Services', 'Divisions/#all-divisions'],
      ['Commercial Projects', 'Divisions/#all-divisions']
    ],
    'Our-Stores': [
      ['Explore Stores', 'Our-Stores/#stores'],
      ['Our Journey', 'Our-Stores/#journey']
    ],
    'Our-Channels': [
      ['Overview', 'Our-Channels/#overview'],
      ['Channel Directory', 'Our-Channels/#directory']
    ]
  };

  function basename(href) {
    if (!href) return '';
    // clean URLs are folders ("About/", "/Union-Profile/About/") -> drop trailing slash, take last segment
    var h = href.split('#')[0].split('?')[0].replace(/\/+$/, '');
    var parts = h.split('/');
    return parts[parts.length - 1] || 'Home';
  }

  var CSS = [
    'html{scroll-padding-top:88px}',
    '.nav-has-drop{position:relative;display:inline-flex;align-items:center}',
    '.nav-caret{margin-left:5px;opacity:.55;transition:transform .25s ease,opacity .25s ease;flex:none}',
    '.nav-has-drop:hover .nav-caret{transform:rotate(180deg);opacity:1}',
    '.nav-drop{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(8px);min-width:220px;background:#141311;border:1px solid #2a2825;border-radius:14px;padding:8px;margin-top:10px;box-shadow:0 30px 60px -24px rgba(0,0,0,.75);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .22s ease,transform .22s ease,visibility .22s ease;z-index:300}',
    '.nav-drop::before{content:"";position:absolute;top:-16px;left:0;right:0;height:16px}',
    '.nav-has-drop:hover .nav-drop{opacity:1;visibility:visible;pointer-events:auto;transform:translateX(-50%) translateY(0)}',
    '.nav-drop-item{display:block;color:#cfcbc0;font-family:"Manrope",system-ui,sans-serif;font-size:13.5px;font-weight:500;letter-spacing:.01em;padding:10px 14px;border-radius:9px;white-space:nowrap;border-bottom:0 !important;transition:background .18s ease,color .18s ease}',
    '.nav-drop-item:hover{background:#232019;color:#fff}',
    // Careers "coming soon" popup
    '.careers-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:24px;font-family:"Manrope",system-ui,sans-serif}',
    '.careers-modal.open{display:flex}',
    '.careers-modal-bg{position:absolute;inset:0;background:rgba(8,8,8,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '.careers-card{position:relative;max-width:440px;width:100%;background:#141311;border:1px solid #2a2825;border-radius:18px;padding:clamp(30px,4vw,42px);box-shadow:0 40px 90px -30px rgba(0,0,0,.85);text-align:center;color:#fff;transform:translateY(10px) scale(.98);opacity:0;transition:transform .3s cubic-bezier(.2,.7,.2,1),opacity .3s ease}',
    '.careers-modal.open .careers-card{transform:none;opacity:1}',
    '.careers-close{position:absolute;top:14px;right:14px;width:34px;height:34px;border-radius:50%;border:1px solid #33312d;background:transparent;color:#cfcbc0;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}',
    '.careers-close:hover{background:#fff;color:#0d0d0d}',
    '.careers-eyebrow{font-size:11px;letter-spacing:.26em;color:#a07d43;font-weight:700;text-transform:uppercase;margin-bottom:14px}',
    '.careers-card h3{font-family:"Playfair Display",serif;font-weight:600;font-size:clamp(22px,2.6vw,28px);line-height:1.2;margin:0 0 12px;color:#fff}',
    '.careers-card p{color:#a8a49b;font-size:14.5px;line-height:1.7;margin:0 0 26px}',
    '.careers-btn{display:inline-flex;align-items:center;gap:10px;background:#fff;color:#0d0d0d;font-size:12px;font-weight:700;letter-spacing:.13em;padding:14px 26px;border-radius:999px;transition:gap .25s,background .3s,color .3s}',
    '.careers-btn:hover{gap:14px;background:#a07d43;color:#fff}',
    // Mobile: no dropdowns at all — the wrapper collapses so the native menu is
    // untouched, and the section sub-links are hidden.
    '@media(max-width:900px){',
    '.nav-has-drop{display:contents}',
    '.nav-caret{display:none}',
    '.nav-drop{display:none}',
    '}'
  ].join('');

  var CARET = ' <svg class="nav-caret" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  function build() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    // Covers both the hand-coded `<nav class="mainnav">` on inner pages and the
    // JS-rendered `<nav id="nav">` on the home page.
    var links = document.querySelectorAll('header nav a');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.closest('.nav-drop')) continue;                                  // skip injected sub-links
      var items = MENUS[basename(a.getAttribute('href'))];
      if (!items) continue;
      if (a.parentNode && a.parentNode.className === 'nav-has-drop') continue; // idempotent

      var wrap = document.createElement('span');
      wrap.className = 'nav-has-drop';
      a.parentNode.insertBefore(wrap, a);
      wrap.appendChild(a);
      a.insertAdjacentHTML('beforeend', CARET);

      var drop = document.createElement('div');
      drop.className = 'nav-drop';
      var html = '';
      for (var k = 0; k < items.length; k++) {
        html += '<a href="' + items[k][1] + '" class="nav-drop-item">' + items[k][0] + '</a>';
      }
      drop.innerHTML = html;
      wrap.appendChild(drop);
    }

    buildCareers();
  }

  // "Careers" nav item -> a "coming soon" popup with a link to the current site.
  function buildCareers() {
    if (!document.getElementById('careersModal')) {
      var m = document.createElement('div');
      m.className = 'careers-modal';
      m.id = 'careersModal';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-modal', 'true');
      m.setAttribute('aria-label', 'Careers');
      m.innerHTML =
        '<div class="careers-modal-bg" data-cc></div>'
        + '<div class="careers-card">'
        + '<button class="careers-close" data-cc aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
        + '<div class="careers-eyebrow">Careers</div>'
        + '<h3>A new careers experience<br>is coming soon.</h3>'
        + '<p>We’re building a brand-new careers portal. In the meantime, explore current opportunities on our existing site.</p>'
        + '<a class="careers-btn" href="https://careers.utc.com.kw/" target="_blank" rel="noopener">Visit current careers site <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>'
        + '</div>';
      document.body.appendChild(m);
      var close = function () { m.classList.remove('open'); };
      m.addEventListener('click', function (e) { if (e.target.closest('[data-cc]')) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    var modal = document.getElementById('careersModal');
    function open() {
      var h = document.querySelector('header'); if (h) h.classList.remove('nav-open'); // close mobile menu if open
      modal.classList.add('open');
    }
    var navEls = document.querySelectorAll('header nav a, header nav span');
    for (var i = 0; i < navEls.length; i++) {
      var el = navEls[i];
      if (el.dataset.careers || el.textContent.trim() !== 'Careers') continue;
      el.dataset.careers = '1';
      el.style.cursor = 'pointer';
      el.style.color = '#fff';
      el.classList.add('hoverline');
      el.removeAttribute('title');
      el.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); open(); });
    }

    // footer "Careers" link -> same popup (careers.html isn't launched yet)
    var footEls = document.querySelectorAll('footer a[href="Careers/"]');
    for (var j = 0; j < footEls.length; j++) {
      var fa = footEls[j];
      if (fa.dataset.careers) continue;
      fa.dataset.careers = '1';
      fa.addEventListener('click', function (e) { e.preventDefault(); open(); });
    }

    // non-footer "careers.html" links (About "Join our team", sitemap pill) -> same popup.
    // (job.html keeps its own back-link.)
    if (basename(location.pathname) !== 'Job') {
      var otherEls = document.querySelectorAll('a[href="Careers/"]');
      for (var n = 0; n < otherEls.length; n++) {
        var oa = otherEls[n];
        if (oa.dataset.careers || oa.closest('footer')) continue;
        oa.dataset.careers = '1';
        oa.addEventListener('click', function (e) { e.preventDefault(); open(); });
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
