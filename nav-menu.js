'use strict';
/* Union Trading Co. — shared header section dropdowns.
   Injected on every page: finds the main-nav links and, for the content pages,
   hangs a hover dropdown of in-page sections beneath each one. On mobile the
   same markup renders as an indented sub-list inside the open hamburger menu. */
(function () {
  // page basename -> ordered [label, href] sections
  var MENUS = {
    'about.html': [
      ['CEO Message', 'about.html#ceo'],
      ['Our Evolution', 'about.html#evolution'],
      ['Our Story', 'about.html#story'],
      ['Global Partners', 'about.html#brands'],
      ['Our People', 'about.html#people']
    ],
    'divisions.html': [
      ['Explore Divisions', 'divisions.html#explore'],
      ['All Divisions', 'divisions.html#all-divisions'],
      ['Union Electronics', 'union-electronics.html']
    ],
    'our-stores.html': [
      ['Explore Stores', 'our-stores.html#stores'],
      ['Our Journey', 'our-stores.html#journey']
    ],
    'our-channels.html': [
      ['Overview', 'our-channels.html#overview'],
      ['Channel Directory', 'our-channels.html#directory']
    ]
  };

  function basename(href) {
    if (!href) return '';
    var h = href.split('#')[0].split('?')[0];
    var parts = h.split('/');
    return parts[parts.length - 1] || 'index.html';
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
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
