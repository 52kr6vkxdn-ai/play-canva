// ── NOVA ENGINE — core/logger.js ──────────────────────────────────────────
// Global console logger. Exposes window.LOG for use across all modules.

const LOG = (() => {
  const body   = document.getElementById('console-body');
  const colors = { info: '#888', ok: '#6abf6a', warn: '#c8a840', error: '#e05555' };

  function add(msg, type = 'info') {
    const d   = document.createElement('div');
    d.style.color        = colors[type] || colors.info;
    d.style.marginBottom = '2px';
    const ts  = new Date().toLocaleTimeString('en', { hour12: false });
    d.textContent = `[${ts}] ${msg}`;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }

  document.getElementById('btn-clear-console').onclick = () => (body.innerHTML = '');

  return {
    info:  m => add(m, 'info'),
    ok:    m => add(m, 'ok'),
    warn:  m => add(m, 'warn'),
    error: m => add(m, 'error'),
  };
})();

window.LOG = LOG;
