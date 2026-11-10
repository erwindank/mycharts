/* ══════════════════════════════════════════════════════════════════════
   CERTIFICATION PLAQUE — SHARE PICTURE (2026-11-10)

   Every certification plaque (the Certification Wall in Records, the
   "certified this period" shelf on the charts, and the album window) has a
   small Share button in its corner. It opens a preview window that draws
   that one plaque large, on a wall, as a picture to download, copy or send.

   The picture is built from the plaque on screen, not from the data behind
   it: title, artist, award line and date are read off the card, so all
   three places work the same way and the words are already in the reader's
   language. The cover is the one the card shows (a picked picture wins).

   Built with inline styles in the share cards' 1080-wide design space and
   captured by shCapture (app.js), like every other share card. Two things
   html2canvas can't draw are done another way:
     - the records: conic / repeating-radial gradients don't render, so each
       record is painted on a <canvas> here and placed as an <img>;
     - shadow rings (box-shadow with spread only) don't render: real borders.
   ══════════════════════════════════════════════════════════════════════ */

// The plaque's metals, the same values as the .cert-card--* rules in style.css.
const CP_TIERS = {
  gold:    { chi: '#f3d27a', clo: '#9a6a16', panel: '205, 150, 22', a: 0.20, tint: '#f0cc50', dim: '#c8a040' },
  plat:    { chi: '#eef3f7', clo: '#7f8c99', panel: '208, 224, 240', a: 0.26, tint: '#d8e6f2', dim: '#9db2c6' },
  diamond: { chi: '#eaf7ff', clo: '#3f86c8', panel: '58, 168, 255', a: 0.34, tint: '#cfeaff', dim: '#7cb8e4' },
};

// Choices in the window, kept between visits.
const CP_DEFAULTS = { format: 'portrait', backdrop: 'wall', showDate: true, showFooter: true, quality: 2 };
let cpOpts = Object.assign({}, CP_DEFAULTS);
let _cpItem = null;   // the plaque being shared (read off the card)
let _cpGen = 0;       // bumps per open, so a late cover can't land on another plaque

function cpLoadOpts() {
  try { cpOpts = Object.assign({}, CP_DEFAULTS, JSON.parse(localStorage.getItem('dc_cert_plaque') || '{}')); }
  catch (e) { cpOpts = Object.assign({}, CP_DEFAULTS); }
}
function cpSaveOpts() {
  try { localStorage.setItem('dc_cert_plaque', JSON.stringify(cpOpts)); } catch (e) {}
}

// The Share button every plaque carries. One snippet, so the three places
// that build plaques (app.js) stay identical.
function cpShareBtnHTML() {
  return '<button type="button" class="cert-share" onclick="event.stopPropagation();cpOpen(this)"'
    + ' title="' + esc(t('cp_share_tip')) + '" aria-label="' + esc(t('cp_share_tip')) + '">'
    + '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    + '</button>';
}

// ── Reading the plaque off the card ──
function cpReadCard(card) {
  const txt = function (sel) { const el = card.querySelector(sel); return el ? el.textContent.trim() : ''; };
  const tier = card.classList.contains('cert-card--diamond') ? 'diamond'
    : card.classList.contains('cert-card--plat') ? 'plat' : 'gold';
  const img = card.querySelector('.cert-art-slot img');
  return {
    tier: tier,
    discs: Math.max(1, card.querySelectorAll('.cert-disc').length),
    title: txt('.cert-title'),
    artist: txt('.cert-artist'),
    award: txt('.cert-tier-name'),
    date: txt('.cert-date'),
    initials: txt('.cert-art-initials') || txt('.thumb-initials'),
    coverSrc: img && img.getAttribute('src') ? img.src : null,
    art: null, // the cover as a data URL, once inlined
  };
}

// ── The record, painted (html2canvas can't draw the CSS one) ──
const _cpDiscCache = {};
function cpDiscURL(tier, px) {
  const key = tier + ':' + px;
  if (_cpDiscCache[key]) return _cpDiscCache[key];
  const m = CP_TIERS[tier];
  const cv = document.createElement('canvas');
  cv.width = cv.height = px;
  const g = cv.getContext('2d');
  const c = px / 2, R = px / 2 - 1;
  g.save();
  g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.clip();
  // The metal sheen: light travelling round a pressed record (the CSS conic)
  if (g.createConicGradient) {
    const cg = g.createConicGradient((200 - 90) * Math.PI / 180, c, c);
    [[0, m.clo], [42, m.chi], [96, m.clo], [148, m.chi], [200, m.clo], [252, m.chi], [304, m.clo], [344, m.chi], [360, m.clo]]
      .forEach(function (s) { cg.addColorStop(s[0] / 360, s[1]); });
    g.fillStyle = cg;
  } else {
    const rg = g.createRadialGradient(c * 0.7, c * 0.6, 0, c, c, R);
    rg.addColorStop(0, m.chi); rg.addColorStop(1, m.clo);
    g.fillStyle = rg;
  }
  g.fillRect(0, 0, px, px);
  // The grooves, cut from the label out
  const step = px / 84 * 2.6;
  for (let r = R * 0.36; r < R; r += step) {
    g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(0,0,0,0.30)'; g.lineWidth = Math.max(1, step * 0.38); g.stroke();
    g.beginPath(); g.arc(c, c, r + step * 0.6, 0, Math.PI * 2);
    g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = Math.max(1, step * 0.3); g.stroke();
  }
  g.restore();
  // Rim catch
  g.beginPath(); g.arc(c, c, R - 0.5, 0, Math.PI * 2);
  g.strokeStyle = 'rgba(255,255,255,0.28)'; g.lineWidth = Math.max(1, px / 160); g.stroke();
  // Paper label (inset 32%) and the spindle hole
  const lr = px * 0.18;
  const lg = g.createRadialGradient(c - lr * 0.2, c - lr * 0.3, 0, c, c, lr);
  lg.addColorStop(0, '#f6f3ec'); lg.addColorStop(1, '#ddd6c8');
  g.beginPath(); g.arc(c, c, lr, 0, Math.PI * 2); g.fillStyle = lg; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = Math.max(1, px / 200); g.stroke();
  g.beginPath(); g.arc(c, c, px * 0.025, 0, Math.PI * 2); g.fillStyle = '#0c0d10'; g.fill();
  return (_cpDiscCache[key] = cv.toDataURL('image/png'));
}

// ── The picture ──
function cpCardHTML(it, o) {
  const d = shDims(o.format);
  const m = CP_TIERS[it.tier] || CP_TIERS.gold;
  // Plaque size per format; every measure below follows from it (s)
  const plaqueW = o.format === 'post' ? 860 : 940;
  const s = plaqueW / 800;
  const padX = Math.round(52 * s), padT = Math.round(72 * s), padB = Math.round(56 * s);
  // Cover beside the fanned records, shrunk together if a long fan won't fit
  const n = it.discs;
  let cart = 330 * s, cdisc = 314 * s, overlap = 58 * s;
  const need = cart + cdisc * (1 + 0.18 * (n - 1)) - overlap;
  const f = Math.min(1, (plaqueW - padX * 2) / need);
  cart = Math.round(cart * f); cdisc = Math.round(cdisc * f); overlap = Math.round(overlap * f);
  const fanW = Math.round(cdisc * (1 + 0.18 * (n - 1)));
  const disc = cpDiscURL(it.tier, Math.round(cdisc * 2));
  let discs = '';
  for (let i = 0; i < n; i++) {
    // The front record sits nearest the sleeve, the rest step out behind it.
    // No z-index: html2canvas stacks nested z-indexes wrongly, so the order
    // is the DOM's — back record first, front record last.
    const back = n - 1 - i;
    discs += '<img src="' + disc + '" alt="" style="position:absolute;top:0;left:' + Math.round(cdisc * 0.18 * back) + 'px;width:' + cdisc + 'px;height:' + cdisc + 'px;border-radius:50%;box-shadow:0 ' + Math.round(6 * s) + 'px ' + Math.round(20 * s) + 'px rgba(0,0,0,0.55);">';
  }
  const cover = it.art
    ? '<img src="' + it.art + '" alt="" style="width:' + cart + 'px;height:' + cart + 'px;object-fit:cover;display:block;border-radius:3px;">'
    : '<div style="width:' + cart + 'px;height:' + cart + 'px;display:flex;align-items:center;justify-content:center;background:#15181e;border-radius:3px;font:700 ' + Math.round(80 * s) + 'px/1 ' + SH_FONT.display + ';color:' + m.tint + ';">' + esc(it.initials || '') + '</div>';
  const bolt = function (pos) {
    const b = Math.round(18 * s), e = Math.round(22 * s);
    return '<div style="position:absolute;' + pos.replace(/E/g, e + 'px') + ';width:' + b + 'px;height:' + b + 'px;border-radius:50%;background:radial-gradient(circle at 34% 28%, ' + m.chi + ', ' + m.clo + ' 72%);box-shadow:0 2px 4px rgba(0,0,0,0.7);z-index:3;"></div>';
  };
  const titleSz = Math.round((it.title.length > 34 ? 46 : 56) * s);

  const plaque = '<div style="position:relative;width:' + plaqueW + 'px;box-sizing:border-box;padding:' + padT + 'px ' + padX + 'px ' + padB + 'px;'
      + 'display:flex;flex-direction:column;align-items:center;gap:' + Math.round(34 * s) + 'px;border-radius:6px;'
      + 'border:2px solid rgba(255,255,255,0.16);'
      + 'background:linear-gradient(200deg, rgba(255,255,255,0.17), rgba(255,255,255,0) 44%), linear-gradient(158deg, #232730 0%, #171a20 45%, #0e1014 100%);'
      + 'box-shadow:' + Math.round(26 * s) + 'px ' + Math.round(34 * s) + 'px ' + Math.round(70 * s) + 'px rgba(0,0,0,0.6);">'
    // The tier's colour through the acrylic, from the top and at the base
    + '<div style="position:absolute;inset:0;border-radius:6px;background:radial-gradient(115% 78% at 50% 0%, rgba(' + m.panel + ', ' + m.a + '), rgba(' + m.panel + ', 0) 64%), linear-gradient(180deg, rgba(' + m.panel + ', 0) 52%, rgba(' + m.panel + ', ' + (m.a * 0.5) + '));"></div>'
    + bolt('top:E;left:E') + bolt('top:E;right:E') + bolt('bottom:E;left:E') + bolt('bottom:E;right:E')
    + '<div style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;">'
      // The records come first in the page and the cover after them, moved
      // to the left with `order`, so the cover is drawn on top (see above)
      + '<div style="position:relative;flex:none;width:' + fanW + 'px;height:' + cdisc + 'px;margin-left:-' + overlap + 'px;">' + discs + '</div>'
      + '<div style="position:relative;order:-1;flex:none;box-shadow:0 ' + Math.round(8 * s) + 'px ' + Math.round(28 * s) + 'px rgba(0,0,0,0.5);">' + cover + '</div>'
    + '</div>'
    + '<div style="position:relative;z-index:2;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;gap:' + Math.round(8 * s) + 'px;">'
      + '<div style="font:650 ' + titleSz + 'px/1.15 ' + SH_FONT.display + ';color:' + m.tint + ';text-shadow:0 2px 6px rgba(0,0,0,0.8);max-width:100%;word-break:break-word;' + shClamp(2, titleSz, 1.15) + '">' + esc(it.title) + '</div>'
      + (it.artist ? '<div style="font:italic 400 ' + Math.round(32 * s) + 'px/1.3 ' + SH_FONT.sans + ';color:' + m.dim + ';text-shadow:0 1px 4px rgba(0,0,0,0.6);' + shClamp(1, Math.round(32 * s), 1.3) + '">' + esc(it.artist) + '</div>' : '')
      + (it.award ? '<div style="margin-top:' + Math.round(10 * s) + 'px;font:600 ' + Math.round(28 * s) + 'px/1.3 ' + SH_FONT.sans + ';color:' + m.tint + ';">' + esc(it.award) + '</div>' : '')
      + (o.showDate && it.date ? '<div style="font:400 ' + Math.round(24 * s) + 'px/1.3 ' + SH_FONT.sans + ';color:' + m.dim + ';">' + esc(it.date) + '</div>' : '')
    + '</div>'
  + '</div>';

  // The wall it hangs on: dark with the tier's light from above, or the
  // cover blurred behind it
  const blur = o.backdrop === 'cover' && it.art ? shBlurred(it.art) : null;
  const bg = blur
    ? '<img src="' + blur + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"><div style="position:absolute;inset:0;background:rgba(6,7,10,0.55);"></div>'
    : '<div style="position:absolute;inset:0;background:radial-gradient(70% 46% at 50% 0%, rgba(' + m.panel + ', 0.30), rgba(' + m.panel + ', 0) 72%), linear-gradient(180deg, #16181d 0%, #0b0c0f 100%);"></div>';
  const foot = o.showFooter
    ? '<div style="position:absolute;left:0;right:0;bottom:' + shSafeBottom(o.format) + 'px;text-align:center;font:700 ' + Math.round(30 * s) + 'px/1 ' + SH_FONT.display + ';color:' + m.tint + ';opacity:0.9;">dankcharts.fm</div>'
    : '';
  return '<div style="width:' + d.w + 'px;height:' + d.h + 'px;position:relative;overflow:hidden;font-family:' + SH_FONT.sans + ';background:#0b0c0f;">'
    + bg
    + '<div style="position:absolute;left:0;right:0;top:' + shSafeTop(o.format) + 'px;bottom:' + (shSafeBottom(o.format) + (o.showFooter ? 50 : 0)) + 'px;display:flex;align-items:center;justify-content:center;">' + plaque + '</div>'
    + foot
    + '</div>';
}

// ── The window ──
function cpOpen(btn) {
  const card = btn && btn.closest('.cert-card');
  if (!card) return;
  cpLoadOpts();
  _cpItem = cpReadCard(card);
  const gen = ++_cpGen;
  cpSyncControls();
  document.getElementById('cpModal').classList.add('open');
  cpRender();
  // Inline the cover (and blur it for the Cover background), then redraw
  if (_cpItem.coverSrc) {
    const src = _cpItem.coverSrc;
    _crInlineArt(src).then(function (url) {
      if (gen !== _cpGen || !url) return;
      _cpItem.art = url;
      cpRender();
    }).catch(function () {});
  }
}

function cpClose() {
  document.getElementById('cpModal').classList.remove('open');
  document.getElementById('cpCanvas').innerHTML = '';
  _cpGen++;
}

function cpSyncControls() {
  document.querySelectorAll('#cpFormatBtns .sh-seg-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.fmt === cpOpts.format); });
  document.querySelectorAll('#cpBackdropBtns .sh-seg-btn').forEach(function (b) { b.classList.toggle('active', b.dataset.bd === cpOpts.backdrop); });
  document.querySelectorAll('#cpQualityBtns .sh-seg-btn').forEach(function (b) { b.classList.toggle('active', +b.dataset.q === cpOpts.quality); });
  const date = document.getElementById('cpOpt_showDate'); if (date) date.checked = cpOpts.showDate;
  const foot = document.getElementById('cpOpt_showFooter'); if (foot) foot.checked = cpOpts.showFooter;
  const q = document.getElementById('cpQualityNote');
  if (q) { const d = shDims(cpOpts.format); q.textContent = (d.w * cpOpts.quality) + ' × ' + (d.h * cpOpts.quality) + ' px'; }
}

function cpSet(field, value) {
  cpOpts[field] = value;
  cpSaveOpts();
  cpSyncControls();
  cpRender();
}

function cpToggles() {
  cpOpts.showDate = !!document.getElementById('cpOpt_showDate').checked;
  cpOpts.showFooter = !!document.getElementById('cpOpt_showFooter').checked;
  cpSaveOpts();
  cpRender();
}

// Into the hidden export node at full size, then the same markup scaled
// into the preview, so the preview is exactly what gets saved.
function cpRender() {
  if (!_cpItem) return;
  const html = cpCardHTML(_cpItem, cpOpts);
  const canvas = document.getElementById('cpCanvas');
  const d = shDims(cpOpts.format);
  canvas.style.width = d.w + 'px';
  canvas.style.height = d.h + 'px';
  canvas.innerHTML = html;
  shFitPreview('cpFrame', 'cpInner', cpOpts.format, html);
  shPrepareShare('cpCanvas', 'cpShareBtn', cpShareOpts);
}

function cpFileName() {
  const slug = ((_cpItem && _cpItem.title) || 'plaque').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'plaque';
  return 'dankcharts_' + ((_cpItem && _cpItem.tier) || 'cert') + '_' + slug + '_' + cpOpts.format + '.png';
}

function cpShareOpts() {
  return { format: cpOpts.format, quality: cpOpts.quality, fileName: cpFileName() };
}

async function cpDownload() {
  const btn = document.getElementById('cpDownloadBtn');
  const orig = btn.textContent;
  btn.textContent = '⏳ …'; btn.disabled = true;
  try {
    const cvs = await shCapture('cpCanvas', cpOpts.format, cpOpts.quality);
    const link = document.createElement('a');
    link.download = cpFileName();
    link.href = cvs.toDataURL('image/png');
    link.click();
  } catch (e) { console.error('Plaque download failed', e); }
  btn.textContent = orig; btn.disabled = false;
}

async function cpCopy() {
  if (!navigator.clipboard || !navigator.clipboard.write) { cpDownload(); return; }
  const btn = document.getElementById('cpCopyBtn');
  const orig = btn.textContent;
  btn.textContent = '…'; btn.disabled = true;
  try {
    const cvs = await shCapture('cpCanvas', cpOpts.format, cpOpts.quality);
    const blob = await shCanvasBlob(cvs);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    btn.textContent = '✓ ' + t('sh_copied');
    setTimeout(function () { btn.textContent = orig; btn.disabled = false; }, 1800);
  } catch (e) {
    btn.textContent = orig; btn.disabled = false;
    cpDownload();
  }
}

function cpShare() {
  shShareNow('cpCanvas', 'cpShareBtn', cpShareOpts, cpDownload);
}

// A click on the dark area around the window closes it
document.addEventListener('click', function (e) {
  const m = document.getElementById('cpModal');
  if (m && e.target === m) cpClose();
});
