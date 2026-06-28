'use strict';

const API = 'https://api.scryfall.com';
const CARDS_KEY = 'mesao:cards:v2';
const SYM_KEY = 'mesao:symbology:v1';
const CARDS_TTL = 24 * 3600 * 1000;
const SYM_TTL = 30 * 24 * 3600 * 1000;

const TYPE_ORDER = [
  ['Land', 'Terrenos'],
  ['Creature', 'Criaturas'],
  ['Artifact', 'Artefatos'],
  ['Enchantment', 'Encantamentos'],
  ['Planeswalker', 'Planeswalkers'],
  ['Instant', 'Instantâneas'],
  ['Sorcery', 'Feitiços'],
];
const SECTIONS = [...TYPE_ORDER.map((t) => t[1]), 'Outros'];

const state = { cards: [], group: 'type', sort: 'name', query: '' };
const $ = (sel) => document.querySelector(sel);
let SYM = {};

function norm(s) {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}
function escapeHtml(s) {
  return (s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
function readCache(key, ttl) {
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    if (raw && Date.now() - raw.t < ttl) return raw.v;
  } catch (e) {}
  return null;
}
function writeCache(key, v) {
  try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch (e) {}
}
async function getJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('HTTP ' + res.status + ' em ' + url);
  return res.json();
}

function toIdentifier(item) {
  if (typeof item === 'string') return { name: item };
  if (item && item.nome) {
    if (item.id) return { id: item.id };
    if (item.set && item.cn) return { set: String(item.set).toLowerCase(), collector_number: String(item.cn) };
    return { name: item.nome };
  }
  return { name: String(item) };
}

function faceImages(card) {
  if (card.image_uris) return [card.image_uris];
  if (card.card_faces) return card.card_faces.filter((f) => f.image_uris).map((f) => f.image_uris);
  return [];
}
function ptOf(c) {
  if (c.power != null) return c.power + '/' + c.toughness;
  if (c.loyalty != null) return 'Lealdade ' + c.loyalty;
  return '';
}

function viewModel(card) {
  const imgs = faceImages(card);
  const front = imgs[0] || {};
  const twoFaced = card.card_faces && imgs.length > 1;
  const faces = twoFaced
    ? card.card_faces.map((f, i) => ({
        name: f.name,
        type_line: f.type_line || card.type_line || '',
        oracle_text: f.oracle_text || '',
        mana_cost: f.mana_cost || '',
        pt: ptOf(f),
        image: (imgs[i] || front).normal,
      }))
    : null;
  const firstType = card.type_line || (card.card_faces ? card.card_faces[0].type_line : '');
  return {
    name: card.name,
    displayName: card.card_faces ? card.card_faces[0].name : card.name,
    type_line: card.type_line || (card.card_faces ? card.card_faces.map((f) => f.type_line).join(' // ') : ''),
    oracle_text: card.oracle_text || (card.card_faces ? card.card_faces.map((f) => f.oracle_text).filter(Boolean).join('\n\n') : ''),
    mana_cost: card.mana_cost || (card.card_faces ? card.card_faces[0].mana_cost : '') || '',
    pt: ptOf(card),
    rarity: card.rarity || '',
    set: (card.set || '').toUpperCase(),
    set_name: card.set_name || '',
    cn: card.collector_number || '',
    artist: card.artist || '',
    cmc: card.cmc || 0,
    image: front.normal || '',
    small: front.small || front.normal || '',
    faces,
    bucket: bucketOf(firstType),
  };
}

function bucketOf(typeLine) {
  const t = typeLine || '';
  for (const [key, label] of TYPE_ORDER) if (t.includes(key)) return label;
  return 'Outros';
}

async function resolveCards(list) {
  const identifiers = list.map(toIdentifier);
  const cacheKey = CARDS_KEY + ':' + hash(JSON.stringify(identifiers));
  const cached = readCache(cacheKey, CARDS_TTL);
  if (cached) return cached;

  const cards = [];
  const notFound = [];
  for (let i = 0; i < identifiers.length; i += 75) {
    const chunk = identifiers.slice(i, i + 75);
    const res = await getJSON(API + '/cards/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ identifiers: chunk }),
    });
    res.data.forEach((c) => cards.push(viewModel(c)));
    (res.not_found || []).forEach((nf) => notFound.push(nf.name || nf.id || JSON.stringify(nf)));
  }
  cards.forEach((c, i) => { c.id = i; });
  const result = { cards, notFound };
  writeCache(cacheKey, result);
  return result;
}

async function loadSymbology() {
  const cached = readCache(SYM_KEY, SYM_TTL);
  if (cached) { SYM = cached; return; }
  try {
    const res = await getJSON(API + '/symbology', { headers: { Accept: 'application/json' } });
    const map = {};
    res.data.forEach((s) => { map[s.symbol] = s.svg_uri; });
    SYM = map;
    writeCache(SYM_KEY, map);
  } catch (e) { SYM = {}; }
}

function manaHTML(cost) {
  const tokens = (cost || '').match(/\{[^}]+\}/g) || [];
  return tokens
    .map((tok) => {
      const uri = SYM[tok];
      return uri
        ? `<img class="mana" src="${uri}" alt="${escapeHtml(tok)}" loading="lazy">`
        : `<span class="mana-txt">${escapeHtml(tok.replace(/[{}]/g, ''))}</span>`;
    })
    .join('');
}

function setBrand(name) {
  if (!name) return;
  $('#brand-name').textContent = name;
  document.title = 'Cartas banidas · ' + name;
}

function renderRules(rules) {
  const body = $('#rules-body');
  if (!rules || !rules.length) { $('#rules').hidden = true; return; }
  body.innerHTML = rules
    .map((r) => `<div class="rule"><span class="rule-tag">${escapeHtml(r.titulo)}</span><p class="rule-text">${escapeHtml(r.texto)}</p></div>`)
    .join('');
}

function renderNotFound(names) {
  const el = $('#notice');
  if (!names || !names.length) { el.hidden = true; return; }
  el.hidden = false;
  el.classList.remove('error');
  el.innerHTML = `<strong>${names.length} ${names.length === 1 ? 'carta não encontrada' : 'cartas não encontradas'} no Scryfall:</strong> ${names.map(escapeHtml).join(', ')}. Confira o nome em inglês no dados.json.`;
}

function showError(msg) {
  $('#gallery').innerHTML = '';
  const el = $('#notice');
  el.hidden = false;
  el.classList.add('error');
  el.textContent = msg;
}

function showSkeleton(n) {
  $('#gallery').innerHTML =
    '<div class="grid skeleton">' +
    Array.from({ length: n }, () => '<div class="card"><div class="card-img"></div></div>').join('') +
    '</div>';
}

function cardHTML(c) {
  return `<button class="card" type="button" data-id="${c.id}">
    <img class="card-img" src="${c.small}" alt="${escapeHtml(c.displayName)}" loading="lazy">
    <span class="card-name">${escapeHtml(c.displayName)}</span>
  </button>`;
}

function sectionHTML(label, arr) {
  const head = label
    ? `<div class="section-head"><span class="section-dot"></span><span class="section-name">${escapeHtml(label)}</span><span class="section-count">${arr.length}</span></div>`
    : '';
  return `<section class="section">${head}<div class="grid">${arr.map(cardHTML).join('')}</div></section>`;
}

function render() {
  const root = $('#gallery');
  let items = state.cards.slice();
  const q = norm(state.query.trim());
  if (q) items = items.filter((c) => norm(c.name).includes(q));
  items.sort((a, b) =>
    state.sort === 'mv' ? a.cmc - b.cmc || a.name.localeCompare(b.name) : a.name.localeCompare(b.name)
  );

  const n = items.length;
  $('#count').textContent = n + (n === 1 ? ' carta' : ' cartas');

  if (!n) {
    root.innerHTML = '<p class="empty">Nenhuma carta com esse nome. Limpe a busca para ver todas.</p>';
    return;
  }

  let groups;
  if (state.group === 'ungrouped') {
    groups = [['', items]];
  } else if (state.group === 'mv') {
    const keys = [...new Set(items.map((c) => c.cmc))].sort((a, b) => a - b);
    groups = keys.map((k) => ['Custo de mana ' + k, items.filter((c) => c.cmc === k)]);
  } else {
    groups = SECTIONS.map((s) => [s, items.filter((c) => c.bucket === s)]).filter((g) => g[1].length);
  }
  root.innerHTML = groups.map(([label, arr]) => sectionHTML(label, arr)).join('');
}

function setupDialog() {
  const dialog = $('#dialog');
  const img = $('#dlg-img');
  const flip = $('#dlg-flip');
  let faces = null;
  let idx = 0;

  function paint() {
    const c = state.current;
    const f = faces ? faces[idx] : c;
    img.src = faces ? f.image : c.image;
    img.alt = (faces ? f.name : c.name) || '';
    $('#dlg-name').innerHTML = escapeHtml(faces ? f.name : c.name) + manaHTML(faces ? f.mana_cost : c.mana_cost);
    $('#dlg-type').textContent = faces ? f.type_line : c.type_line;
    $('#dlg-text').textContent = (faces ? f.oracle_text : c.oracle_text) || '';
    const pt = faces ? f.pt : c.pt;
    $('#dlg-pt').textContent = pt;
    $('#dlg-pt').hidden = !pt;
    $('#dlg-meta').innerHTML =
      `${escapeHtml(cap(c.rarity))} · ${escapeHtml(c.set_name)} (${escapeHtml(c.set)}) #${escapeHtml(c.cn)}<br>Ilustração: ${escapeHtml(c.artist)}`;
  }

  window.openCard = (id) => {
    const c = state.cards.find((x) => x.id === id);
    if (!c) return;
    state.current = c;
    faces = c.faces;
    idx = 0;
    flip.hidden = !faces;
    paint();
    dialog.showModal();
  };

  flip.addEventListener('click', () => { idx = (idx + 1) % faces.length; paint(); });
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
}

function setupControls() {
  $('#search').addEventListener('input', (e) => { state.query = e.target.value; render(); });
  $('#group').addEventListener('change', (e) => { state.group = e.target.value; render(); });
  $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
  $('#gallery').addEventListener('click', (e) => {
    const btn = e.target.closest('.card');
    if (btn && btn.dataset.id) window.openCard(Number(btn.dataset.id));
  });
}

async function main() {
  setupDialog();
  setupControls();

  let dados;
  try {
    dados = await getJSON('dados.json', { headers: { Accept: 'application/json' } });
  } catch (e) {
    showError('Não consegui carregar a lista (dados.json). Recarregue a página.');
    return;
  }

  setBrand(dados.mesa);
  renderRules(dados.regras);

  const cartas = dados.cartas || [];
  if (!cartas.length) {
    $('#gallery').innerHTML = '<p class="empty">Nenhuma carta banida cadastrada ainda.</p>';
    return;
  }

  showSkeleton(Math.min(cartas.length, 18));
  let resolved;
  try {
    resolved = await resolveCards(cartas);
  } catch (e) {
    showError('O Scryfall não respondeu agora. Tente recarregar daqui a pouco.');
    return;
  }

  state.cards = resolved.cards;
  renderNotFound(resolved.notFound);
  await loadSymbology();
  render();
}

main();
