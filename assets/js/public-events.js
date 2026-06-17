// ============================================
// PUBLIC EVENTS — Myers College
// ============================================

const PUBLIC_EVENTS = (() => {
  const API_BASE_URL = 'https://myers-backend.onrender.com/api';
  const CONTAINER_ID = 'eventsContainer';

  // ── FETCH ─────────────────────────────────────

  const loadUpcomingEvents = async () => {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    // Skeleton while loading
    container.innerHTML = _skeletonHTML();

    try {
      const response = await fetch(`${API_BASE_URL}/events/upcoming?limit=4`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const events = await response.json();
      renderEvents(events);
    } catch (error) {
      renderError();
    }
  };

  // ── RENDER ────────────────────────────────────

  const renderEvents = (events) => {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    if (!events || events.length === 0) {
      container.innerHTML = _emptyHTML();
      return;
    }

    container.innerHTML = `<div class="pe-grid">${events.map((e, i) => _cardHTML(e, i)).join('')}</div>`;

    // Staggered entrance
    container.querySelectorAll('.pe-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 0.1}s`;
    });
  };

  // ── CARD ──────────────────────────────────────

  const _cardHTML = (event, index) => {
    const dateStr = _formatDate(event.event_date);
    const endStr  = event.event_end_date ? ` — ${_formatDate(event.event_end_date)}` : '';
    const desc    = event.description
      ? _esc(event.description).substring(0, 110) + (event.description.length > 110 ? '…' : '')
      : '';

    const imgSection = event.image_url
      ? `<div class="pe-img-wrap">
           <img src="${_esc(event.image_url)}" alt="${_esc(event.title)}" class="pe-img" loading="lazy" />
           <div class="pe-img-overlay"></div>
         </div>`
      : `<div class="pe-img-placeholder">
           <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(201,162,39,0.5)" stroke-width="1.5">
             <rect x="3" y="4" width="18" height="18" rx="2"/>
             <line x1="16" y1="2" x2="16" y2="6"/>
             <line x1="8" y1="2" x2="8" y2="6"/>
             <line x1="3" y1="10" x2="21" y2="10"/>
           </svg>
         </div>`;

    return `
      <article class="pe-card" role="article">
        ${imgSection}
        <div class="pe-body">
          <div class="pe-index-dot">${index + 1}</div>
          <h3 class="pe-title">${_esc(event.title)}</h3>
          ${desc ? `<p class="pe-desc">${desc}</p>` : ''}
          <div class="pe-date-row">
            <svg class="pe-date-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>${dateStr}${endStr}</span>
          </div>
        </div>
      </article>`;
  };

  // ── STATES ────────────────────────────────────

  const _skeletonHTML = () => `
    <div class="pe-grid">
      ${[1,2,3,4].map(() => `
        <div class="pe-skeleton">
          <div class="pe-sk-img"></div>
          <div class="pe-sk-body">
            <div class="pe-sk-line w60"></div>
            <div class="pe-sk-line w100"></div>
            <div class="pe-sk-line w80"></div>
            <div class="pe-sk-line w40" style="margin-top:16px;"></div>
          </div>
        </div>`).join('')}
    </div>`;

  const _emptyHTML = () => `
    <div class="pe-empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
           stroke="rgba(201,162,39,0.4)" stroke-width="1.2">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <p class="pe-empty-title">No Upcoming Events</p>
      <p class="pe-empty-sub">Check back soon — events will appear here when posted.</p>
    </div>`;

  const renderError = () => {
    const container = document.getElementById(CONTAINER_ID);
    if (container) container.innerHTML = `
      <div class="pe-empty">
        <p class="pe-empty-title" style="color:#ef4444;">Unable to load events</p>
        <p class="pe-empty-sub">Please refresh the page or try again later.</p>
      </div>`;
  };

  // ── UTILS ─────────────────────────────────────

  const _formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const _esc = (text) => {
    if (!text) return '';
    return String(text).replace(/[&<>"']/g, m =>
      ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[m])
    );
  };

  return { loadUpcomingEvents };
})();

// ── STYLES ────────────────────────────────────────

(function injectStyles() {
  const css = `
    /* ── Grid ── */
    .pe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    /*   ── Card ── */
    .pe-card {
      background: #ffffff;
      border-radius: 18px;
      border: 1px solid rgba(26,39,68,0.08);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px -4px rgba(26,39,68,0.08);
      transition: transform 0.32s ease, box-shadow 0.32s ease, border-color 0.32s ease;
      animation: pe-fadeUp 0.5s ease both;
      position: relative;
    }
    .pe-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 44px -10px rgba(26,39,68,0.16);
      border-color: rgba(201,162,39,0.3);
    }

    /* Gold top accent on hover */
    .pe-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #c9a227, #d9b84a);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.35s ease;
      z-index: 1;
    }
    .pe-card:hover::before { transform: scaleX(1); }

    /* ── Image ── */
    .pe-img-wrap {
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      position: relative;
      background: #f1f5f9;
    }
    .pe-img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    .pe-card:hover .pe-img { transform: scale(1.04); }
    .pe-img-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(0deg, rgba(26,39,68,0.28) 0%, transparent 50%);
    }
    .pe-img-placeholder {
      width: 100%;
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, #f8f5ee 0%, #eee8d8 100%);
      display: flex; align-items: center; justify-content: center;
    }

    /* ── Body ── */
    .pe-body {
      padding: 22px 22px 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      position: relative;
    }
    .pe-index-dot {
      position: absolute;
      top: -14px; right: 18px;
      width: 28px; height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c9a227, #a8841c);
      color: #1a2744;
      font-size: 0.72rem;
      font-weight: 800;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(201,162,39,0.4);
    }
    .pe-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1rem;
      font-weight: 700;
      color: #1a2744;
      line-height: 1.4;
      margin: 0 0 10px;
    }
    .pe-desc {
      font-size: 0.84rem;
      color: #6b7280;
      line-height: 1.65;
      margin: 0 0 14px;
      flex: 1;
    }
    .pe-date-row {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #c9a227;
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid rgba(26,39,68,0.07);
    }
    .pe-date-icon { flex-shrink: 0; color: #c9a227; }

    /* ── Skeleton ── */
    .pe-skeleton {
      background: #fff;
      border-radius: 18px;
      border: 1px solid rgba(26,39,68,0.07);
      overflow: hidden;
    }
    .pe-sk-img {
      width: 100%; aspect-ratio: 16/9;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: pe-shimmer 1.4s infinite;
    }
    .pe-sk-body { padding: 22px; }
    .pe-sk-line {
      height: 10px; border-radius: 5px; margin-bottom: 10px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: pe-shimmer 1.4s infinite;
    }
    .pe-sk-line.w100 { width: 100%; }
    .pe-sk-line.w80  { width: 80%; }
    .pe-sk-line.w60  { width: 60%; }
    .pe-sk-line.w40  { width: 40%; }

    /* ── Empty / Error ── */
    .pe-empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 20px;
      display: flex; flex-direction: column;
      align-items: center; gap: 12px;
    }
    .pe-empty-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.1rem; font-weight: 700;
      color: #1a2744; margin: 0;
    }
    .pe-empty-sub {
      font-size: 0.85rem; color: #9ca3af; margin: 0;
    }

    /* ── Animations ── */
    @keyframes pe-fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pe-shimmer {
      from { background-position: 200% 0; }
      to   { background-position: -200% 0; }
    }

    /* ── Responsive ── */
    @media (max-width: 576px) {
      .pe-grid { grid-template-columns: 1fr; gap: 16px; }
    }
  `;

  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

// ── INIT ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  PUBLIC_EVENTS.loadUpcomingEvents();
});
