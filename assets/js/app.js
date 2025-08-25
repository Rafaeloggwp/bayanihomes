/* ---------- Shared helpers (attach on every page) ---------- */
window.formatMoney = (num, currency = '₱') =>
  currency + new Intl.NumberFormat('en-PH', { maximumFractionDigits: 0 }).format(num || 0);

window.slugify = (s='') => s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

window.getParam = (key) => new URLSearchParams(location.search).get(key);

window.store = {
  get(key, fallback){ try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch(e){return fallback;} },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

window.saveToggle = (id) => {
  const saved = new Set(window.store.get('saved', []));
  saved.has(id) ? saved.delete(id) : saved.add(id);
  window.store.set('saved', [...saved]);
  document.dispatchEvent(new CustomEvent('saved:change', { detail:[...saved] }));
};

window.isSaved = (id) => new Set(window.store.get('saved',[])).has(id);

/* Render star/favorite button */
window.renderSaveBtn = (id) => `
  <button type="button" class="btn btn-sm ${isSaved(id)?'btn-warning':'btn-outline-secondary'}"
    aria-pressed="${isSaved(id)}" onclick="saveToggle(${id})" title="Save">
    <i class="bi ${isSaved(id)?'bi-star-fill':'bi-star'}"></i>
  </button>
`;

/* Small pub/sub to keep saved stars in sync across pages */
document.addEventListener('saved:change', () => {
  document.querySelectorAll('[data-save-id]').forEach(el=>{
    const id = +el.dataset.saveId;
    el.outerHTML = window.renderSaveBtn(id);
  });
});
