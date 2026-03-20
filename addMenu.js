// ── NOVA ENGINE — ui/addMenu.js ───────────────────────────────────────────
// Popup "Add Object" menu with live search filter.

const ADD_MENU_ITEMS = [
  { type: 'Box',        label: 'Box',        icon: 'fa-cube',               group: 'Primitives' },
  { type: 'Sphere',     label: 'Sphere',     icon: 'fa-circle',             group: 'Primitives' },
  { type: 'Cylinder',   label: 'Cylinder',   icon: 'fa-database',           group: 'Primitives' },
  { type: 'Cone',       label: 'Cone',       icon: 'fa-play fa-rotate-270', group: 'Primitives' },
  { type: 'Torus',      label: 'Torus',      icon: 'fa-ring',               group: 'Primitives' },
  { type: 'Plane',      label: 'Plane',      icon: 'fa-square',             group: 'Primitives' },
  { type: 'Capsule',    label: 'Capsule',    icon: 'fa-capsules',           group: 'Primitives' },
  { type: 'PointLight', label: 'Point Light',icon: 'fa-lightbulb',          group: 'Lights'     },
  { type: 'SpotLight',  label: 'Spot Light', icon: 'fa-bullseye',           group: 'Lights'     },
  { type: 'DirLight',   label: 'Dir Light',  icon: 'fa-sun',                group: 'Lights'     },
  { type: 'Empty',      label: 'Empty Node', icon: 'fa-dot-circle',         group: 'Helpers', iconPre: 'fa-regular' },
  { type: 'Camera',     label: 'Camera',     icon: 'fa-video',              group: 'Helpers'    },
];

function buildMenuContent(filter) {
  const q       = (filter || '').trim().toLowerCase();
  const matched = q
    ? ADD_MENU_ITEMS.filter(i =>
        i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q))
    : ADD_MENU_ITEMS;

  if (!matched.length)
    return '<div style="padding:10px 14px;color:#555;font-size:11px;">No results.</div>';

  let html = '', lastGroup = null;
  matched.forEach(item => {
    if (!q && item.group !== lastGroup) {
      html += `<div class="add-menu-section">${item.group}</div>`;
      lastGroup = item.group;
    }
    const pre = item.iconPre || 'fa-solid';
    html += `<div class="add-menu-item" data-type="${item.type}">
      <i class="${pre} ${item.icon}"></i> ${item.label}
    </div>`;
  });
  return html;
}

function initAddObjectMenu() {
  const addMenu = document.getElementById('add-obj-menu');

  function openAddMenu(anchorEl) {
    renderMenu('');
    const rect = anchorEl.getBoundingClientRect();
    addMenu.style.left = rect.left + 'px';
    addMenu.style.top  = (rect.bottom + 4) + 'px';
    addMenu.classList.add('open');
    setTimeout(() => {
      const si = addMenu.querySelector('.add-menu-search');
      if (si) si.focus();
    }, 30);
  }

  function closeAddMenu() {
    addMenu.classList.remove('open');
  }

  function renderMenu(filter) {
    addMenu.innerHTML = `
      <div style="padding:6px 8px;border-bottom:1px solid #2a2a2a;">
        <input class="add-menu-search" type="text" placeholder="Search..."
          style="width:100%;background:#111;border:1px solid #333;border-radius:3px;
                 padding:4px 8px;color:#fff;font-size:11px;outline:none;"
          value="${filter || ''}">
      </div>
      <div class="add-menu-list">${buildMenuContent(filter)}</div>`;

    addMenu.querySelector('.add-menu-search').addEventListener('input', e => {
      addMenu.querySelector('.add-menu-list').innerHTML = buildMenuContent(e.target.value);
      bindItemClicks();
    });
    addMenu.querySelector('.add-menu-search').addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAddMenu();
    });

    bindItemClicks();
  }

  function bindItemClicks() {
    addMenu.querySelectorAll('.add-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        handleAdd(item.dataset.type);
        closeAddMenu();
      });
    });
  }

  function handleAdd(type) {
    const PRIMITIVES = ['Box','Sphere','Cylinder','Cone','Torus','Plane','Capsule'];
    if (PRIMITIVES.includes(type))      window._nova.addMesh(type);
    else if (type === 'PointLight')     window._nova.addLight('PointLight');
    else if (type === 'SpotLight')      window._nova.addLight('SpotLight');
    else if (type === 'DirLight')       window._nova.addLight('DirLight');
    else if (type === 'Empty')          window._nova.addEmpty();
    else if (type === 'Camera')         window._nova.addCameraNode();
  }

  // Prevent menu clicks from closing the menu
  addMenu.addEventListener('click', e => e.stopPropagation());

  ['btn-add-obj', 'btn-add-cube'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      e.stopPropagation();
      addMenu.classList.contains('open') ? closeAddMenu() : openAddMenu(e.currentTarget);
    });
  });

  document.addEventListener('click', () => closeAddMenu());
}
