// ── NOVA ENGINE — ui/hierarchy.js ────────────────────────────────────────
// Left-panel scene hierarchy: per-type icons, filter input, visibility toggle.

function getNodeIcon(obj) {
  switch (obj.kind) {
    case 'PointLight': return '<i class="fa-solid fa-lightbulb"          style="color:#ffd060;font-size:10px;"></i>';
    case 'SpotLight':  return '<i class="fa-solid fa-bullseye"            style="color:#ffa040;font-size:10px;"></i>';
    case 'DirLight':   return '<i class="fa-solid fa-sun"                 style="color:#ffe080;font-size:10px;"></i>';
    case 'Camera':     return '<i class="fa-solid fa-video"               style="color:#60c0ff;font-size:10px;"></i>';
    case 'Empty':      return '<i class="fa-regular fa-dot-circle"        style="color:#888;font-size:10px;"></i>';
    case 'Sphere':     return '<i class="fa-solid fa-circle"              style="color:#aaa;font-size:10px;"></i>';
    case 'Cylinder':
    case 'Capsule':    return '<i class="fa-solid fa-database"            style="color:#aaa;font-size:10px;"></i>';
    case 'Plane':      return '<i class="fa-solid fa-square"              style="color:#aaa;font-size:10px;"></i>';
    case 'Torus':      return '<i class="fa-solid fa-ring"                style="color:#aaa;font-size:10px;"></i>';
    case 'Cone':       return '<i class="fa-solid fa-play fa-rotate-270"  style="color:#aaa;font-size:10px;"></i>';
    default:           return '<i class="fa-solid fa-cube"                style="color:#aaa;font-size:10px;"></i>';
  }
}

function refreshHierarchy() {
  const list    = document.getElementById('hierarchy-list');
  const filter  = (document.getElementById('filter-nodes').value || '').trim().toLowerCase();
  const objects = window._novaState.getAll();

  list.innerHTML = '';

  const visible = filter
    ? objects.filter(o => o.name.toLowerCase().includes(filter))
    : objects;

  if (visible.length === 0) {
    const msg = document.createElement('div');
    msg.style.cssText = 'opacity:0.5;text-align:center;margin-top:28px;font-size:11px;';
    msg.textContent   = filter ? 'No results.' : 'Hierarchy is empty.';
    list.appendChild(msg);
    return;
  }

  visible.forEach(obj => {
    const isHidden = obj.mesh ? !obj.mesh.isVisible : false;
    const eyeColor = isHidden ? '#3a3a3a' : '#555';

    const row = document.createElement('div');
    row.className = 'scene-node' + (window._novaState.getSelected() === obj ? ' selected' : '');
    row.style.opacity = isHidden ? '0.45' : '1';
    row.innerHTML =
      getNodeIcon(obj) +
      `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${obj.name}</span>` +
      `<i class="fa-solid ${isHidden ? 'fa-eye-slash' : 'fa-eye'} ib"
          title="${isHidden ? 'Show' : 'Hide'}"
          style="font-size:10px;color:${eyeColor};"
          data-eye="${obj.name}"></i>`;

    row.addEventListener('click', e => {
      if (e.target.closest('[data-eye]')) return;
      window._novaState.selectObject(obj);
    });

    row.querySelector('[data-eye]').addEventListener('click', e => {
      e.stopPropagation();
      if (obj.mesh) obj.mesh.isVisible = !obj.mesh.isVisible;
      refreshHierarchy();
    });

    list.appendChild(row);
  });
}

function initHierarchyFilter() {
  document.getElementById('filter-nodes').addEventListener('input', refreshHierarchy);
}
