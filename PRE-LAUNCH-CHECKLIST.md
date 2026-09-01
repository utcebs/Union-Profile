# Union Trading Co. — Pre-Launch Checklist

New static site replacing the current **utc.com.kw**. Work through this before pointing the live
domain at the new server. Items marked **⚠ external** depend on whoever manages UTC's DNS / hosting —
they can't be fixed from the site files.

_Last updated: 2026-08-31_

---

## 1. Domain & DNS ⚠ external — do this first
- [ ] **Confirm what `utc.com.kw` currently points to.** It resolves to the real server (`50.6.111.56`)
      most of the time, but a **stale Wix DNS record** intermittently answers instead — that's the
      "ConnectYourDomain Error | Wix.com" page some networks/mobile hotspots see.
- [ ] **Remove the stale Wix DNS record(s)** before/at cutover. If left in place, some users **and
      Googlebot** will keep hitting a broken page after launch, hurting both UX and SEO.
- [ ] **Repoint DNS** (A / CNAME) from the current setup to the **new IIS server** when ready to go live.
- [ ] **Install a valid SSL certificate** on the new server. The current cert **expired Dec 3, 2022**.
      The site forces HTTPS + HSTS (see `web.config`), so it will NOT load without a valid cert.
- [ ] Note: **`utckw.com`** is a separate live UTC domain linked from the old site. Confirm whether it's
      yours and whether it needs any redirect/handling (not part of this migration).

## 2. Server (IIS) prerequisites ⚠ external
- [ ] **URL Rewrite 2.1 module** installed (the 301 redirects in `web.config` need it).
- [ ] **Static Content** role service enabled (serves the files + clean folder URLs).
- [ ] **Static HTTP Compression** enabled (`web.config` requests it; gzip is important for speed).
- [ ] Point the IIS site/app at the deployed folder; `web.config` handles default document, MIME
      (webp/woff2), redirects, compression, cache and security headers.

## 3. Redirects & SEO — DONE on our side, verify on staging
- [x] **All 22 old URLs redirect (301) to a live new page** — verified. Includes case variants and:
      `/Photo-Gallery → /home/` (no gallery on the new site yet — change target if you prefer).
- [ ] **Run the redirect test on staging:** `bash xtra6miles/test-redirects.sh https://staging.utc.com.kw`
      — must report `22 passed, 0 failed` and confirm www→non-www and http→https.
- [ ] **`sitemap.xml`** updated (14 pages, includes fmcg/faq/union-services/whistleblower).
- [ ] **Deep pages caveat:** coverage is complete for every URL in the old sitemap. If the old site has
      indexed pages NOT in its sitemap (individual product/brand pages), the only way to find them is the
      old **Google Search Console** or **server logs**. Get either if possible so stragglers can be added.
- [ ] After go-live, submit the new `sitemap.xml` in Search Console and request re-indexing of key pages.

## 4. Content to confirm before launch

- [ ] **Careers is intentionally HELD BACK (work-in-progress).** `/careers/` and `/job/` are placeholders:
      they carry `noindex`, are removed from `sitemap.xml`, and are un-linked in the nav/footer (greyed
      "coming soon"). The old `/careers` → `/careers/` 301 stays. **When careers content is finished, flip
      it live:** (1) remove the `noindex` meta from `careers/index.html` + `job/index.html`, (2) re-add
      `/careers/` to `sitemap.xml`, (3) set `NAV_SOON = []` and `footSoon = []` in `app.js` and swap the
      static "coming soon" Careers spans back to links.

- [ ] **FAQ facts** (the page currently shows an "under maintenance" banner for this reason) — verify/update:
  - "over 60 years" → site says *Since 1949* (~75+)
  - "17 retail outlets/stores" → confirm current count vs Our Stores page
  - "over 90% market penetration", "over 100 brands", "200,000 air conditioners/year"
  - Once confirmed, update the numbers and **remove the maintenance banner** in `faq/index.html`.
- [ ] **Contact form (EmailJS)** — confirm production routing emails are correct, and add the live domain
      (and staging) to **EmailJS → Allowed Origins**, or the form silently fails.
- [ ] Decide: **bundle the EmailJS SDK locally** (recommended — removes the external CDN dependency so the
      form still works if the CDN is blocked) vs keep the CDN.

## 5. Package hygiene (when building the deploy/staging zip)
- [ ] **Exclude:** `.git/`, `*.bak`, `img/Showroom Images/OneDrive_*.zip`, unused >1MB source PNGs,
      `serve8097.mjs` (dev preview server), `xtra6miles/` (test assets).
- [ ] **Staging build:** set `robots.txt` to `Disallow: /` to block crawlers while testing.
- [ ] **Production build:** `robots.txt` = `Allow: /` + the `Sitemap:` line (current state).

## 6. Post-launch verification
- [ ] Site loads over HTTPS with a valid cert; no mixed-content warnings.
- [ ] Spot-check a few Google-indexed old URLs → confirm they 301 to the right new page.
- [ ] Contact form sends a real test to the correct division inbox.
- [ ] Re-run Lighthouse on the live site (real infra scores higher than local estimates).

---

### The 22 old URLs and where they go (authoritative list)
```
/                       -> /home/          /Service-Center       -> /union-services/
/about-us  /About-Us    -> /about/         /get-In-touch         -> /home/#contact
/Our-Divisions          -> /divisions/     /whistleblower        -> /whistleblower/
/fashion                -> /divisions/     /Contact-Us           -> /home/#contact
/air-conditioning       -> /divisions/     /privacy-statements   -> /privacy-policy/
/electric-appliances    -> /union-electronics/   /privacy-statement -> /privacy-policy/
/cosmetics-perfumes     -> /aluna/         /testimonials         -> /home/
/fmcg                   -> /fmcg/          /Photo-Gallery        -> /home/
/healthcare-solutions   -> /union-services/   /FAQ               -> /faq/
/our-stores             -> /our-stores/    /sitemap.aspx         -> /sitemap/
/careers                -> /careers/
```
