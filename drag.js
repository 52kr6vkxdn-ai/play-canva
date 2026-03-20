// ── NOVA ENGINE — ui/drag.js ──────────────────────────────────────────────
// Resizable panel splitters (horizontal and vertical).

function hDrag(handleId, panelId) {
  const h = document.getElementById(handleId);
  const p = document.getElementById(panelId);

  h.addEventListener('mousedown', e => {
    e.preventDefault();
    const sx = e.clientX, sw = p.offsetWidth;
    h.classList.add('active');

    const mv = e2 => {
      const dx = e2.clientX - sx;
      p.style.width = Math.max(150, Math.min(800, sw + dx)) + 'px';
      if (window._bje) window._bje.resize();
    };
    const up = () => {
      h.classList.remove('active');
      removeEventListener('mousemove', mv);
      removeEventListener('mouseup', up);
    };
    addEventListener('mousemove', mv);
    addEventListener('mouseup', up);
  });
}

function vDragConsole() {
  const h = document.getElementById('cv-handle');
  const c = document.getElementById('console-area');

  h.addEventListener('mousedown', e => {
    e.preventDefault();
    const sy = e.clientY, sh = c.offsetHeight;
    h.classList.add('active');

    const mv = e2 => {
      c.style.height = Math.max(28, Math.min(600, sh + (sy - e2.clientY))) + 'px';
      if (window._bje) window._bje.resize();
    };
    const up = () => {
      h.classList.remove('active');
      removeEventListener('mousemove', mv);
      removeEventListener('mouseup', up);
    };
    addEventListener('mousemove', mv);
    addEventListener('mouseup', up);
  });
}

function vDragLeft() {
  const h     = document.getElementById('lv-handle');
  const top   = document.getElementById('scene-pane');
  const bot   = document.getElementById('fs-pane');
  const split = document.getElementById('scene-split');

  h.addEventListener('mousedown', e => {
    e.preventDefault();
    const sy = e.clientY, st = top.offsetHeight;
    h.classList.add('active');

    const mv = e2 => {
      const total = split.offsetHeight - h.offsetHeight;
      const nt = Math.max(60, Math.min(total - 60, st + (e2.clientY - sy)));
      top.style.flex   = 'none';
      top.style.height = nt + 'px';
      bot.style.height = (total - nt) + 'px';
    };
    const up = () => {
      h.classList.remove('active');
      removeEventListener('mousemove', mv);
      removeEventListener('mouseup', up);
    };
    addEventListener('mousemove', mv);
    addEventListener('mouseup', up);
  });
}

function initDragHandles() {
  hDrag('lh-handle', 'left-panel');
  hDrag('rh-handle', 'right-panel');
  vDragConsole();
  vDragLeft();
}
