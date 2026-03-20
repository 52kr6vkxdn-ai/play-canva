// ── NOVA ENGINE — ui/inspector.js ────────────────────────────────────────
// Right-panel property inspector for the currently selected scene object.

function propRow(label, valueHtml) {
  return `
    <div style="display:flex;align-items:center;padding:4px 6px;border-bottom:1px solid #111;gap:8px;">
      <div style="color:#666;font-size:11px;min-width:70px;">${label}</div>
      <div style="flex:1;font-size:11px;color:#ccc;">${valueHtml}</div>
    </div>`;
}

function vec3Row(label, v) {
  return propRow(label,
    `<span style="color:#c75;">${v.x.toFixed(2)}</span> &nbsp;
     <span style="color:#7c5;">${v.y.toFixed(2)}</span> &nbsp;
     <span style="color:#57c;">${v.z.toFixed(2)}</span>`
  );
}

function vec3EditRow(label, v, prop, objName) {
  const axes = ['x','y','z'];
  const cols  = ['#c75','#7c5','#57c'];
  const inputs = axes.map((ax, i) =>
    `<input type="number" step="0.1" value="${v[ax].toFixed(2)}"
      style="width:52px;background:#111;border:1px solid #2a2a2a;border-radius:3px;
             padding:2px 4px;color:${cols[i]};font-size:11px;text-align:right;"
      onchange="window._novaUI.applyTransform('${objName}','${prop}','${ax}',parseFloat(this.value))">`
  ).join(' ');
  return propRow(label, `<div style="display:flex;gap:4px;">${inputs}</div>`);
}

function showInspector(obj) {
  const body = document.getElementById('inspector-body');

  if (!obj) {
    body.innerHTML = `
      <div id="inspector-empty" style="display:flex;align-items:center;justify-content:center;
        height:100%;opacity:0.3;font-size:11px;text-align:center;padding:16px;">
        Select a node to edit its properties.
      </div>`;
    return;
  }

  const m = obj.mesh;

  // ── Kind-specific icon ──────────────────────────────────────────────────
  const kindIcon = {
    PointLight: 'fa-lightbulb', SpotLight: 'fa-bullseye', DirLight: 'fa-sun',
    Camera: 'fa-video', Empty: 'fa-dot-circle',
  }[obj.kind] || 'fa-cube';

  // ── Material section (meshes only) ──────────────────────────────────────
  const matSection = (!obj.light && obj.kind !== 'Camera' && obj.kind !== 'Empty' && m.material)
    ? `<div style="padding:6px 8px;color:#555;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">Material</div>
       ${propRow('Name', obj.mesh.material.name)}
       ${propRow('Metallic',  `<input type="range" min="0" max="1" step="0.01"
         value="${m.material.metallic ?? 0}"
         style="width:100%;accent-color:#007acc;"
         oninput="window._novaUI.applyMat('${obj.name}','metallic',parseFloat(this.value))">`)}
       ${propRow('Roughness', `<input type="range" min="0" max="1" step="0.01"
         value="${m.material.roughness ?? 0.5}"
         style="width:100%;accent-color:#007acc;"
         oninput="window._novaUI.applyMat('${obj.name}','roughness',parseFloat(this.value))">`)}`
    : '';

  // ── Light section ────────────────────────────────────────────────────────
  const lightSection = obj.light
    ? `<div style="padding:6px 8px;color:#555;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">Light</div>
       ${propRow('Intensity', `<input type="range" min="0" max="10" step="0.1"
         value="${obj.light.intensity}"
         style="width:100%;accent-color:#ffd060;"
         oninput="window._novaUI.applyLight('${obj.name}','intensity',parseFloat(this.value))">`)}
       ${obj.kind === 'SpotLight' ? propRow('Angle', `<input type="range" min="0.1" max="1.57" step="0.01"
         value="${obj.light.angle}"
         style="width:100%;accent-color:#ffa040;"
         oninput="window._novaUI.applyLight('${obj.name}','angle',parseFloat(this.value))">`) : ''}`
    : '';

  body.innerHTML = `
    <div style="padding:8px 8px 4px;color:#fff;font-size:12px;font-weight:600;
      border-bottom:1px solid #222;display:flex;align-items:center;gap:8px;">
      <i class="fa-solid ${kindIcon}" style="color:#007acc;"></i> ${obj.name}
    </div>

    <div style="padding:6px 8px;color:#555;font-size:10px;letter-spacing:1px;text-transform:uppercase;">Transform</div>
    ${vec3EditRow('Position', m.position, 'position', obj.name)}
    ${vec3EditRow('Rotation', m.rotation, 'rotation', obj.name)}
    ${vec3EditRow('Scale',    m.scaling,  'scaling',  obj.name)}

    <div style="padding:6px 8px;color:#555;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-top:4px;">Object</div>
    ${propRow('Kind', obj.kind)}
    ${propRow('Visible', `<input type="checkbox" ${m.isVisible ? 'checked' : ''}
      onchange="window._nova.setVisible('${obj.name}',this.checked)">`)}
    ${propRow('Cast Shadow', `<input type="checkbox" checked>`)}

    ${matSection}
    ${lightSection}

    <div style="padding:8px;">
      <button onclick="window._nova.deleteSelected()"
        style="width:100%;padding:5px;background:#3a1010;border:1px solid #5a2020;
               color:#e05555;border-radius:3px;cursor:pointer;font-size:11px;">
        <i class="fa-solid fa-trash"></i> Delete Node
      </button>
    </div>`;
}

function initInspectorBindings() {
  // Expose live-edit helpers to inline onchange handlers
  window._novaUI = window._novaUI || {};

  window._novaUI.applyTransform = (objName, prop, axis, value) => {
    const obj = window._novaState.getAll().find(o => o.name === objName);
    if (!obj || !obj.mesh) return;
    obj.mesh[prop][axis] = value;
  };

  window._novaUI.applyMat = (objName, prop, value) => {
    const obj = window._novaState.getAll().find(o => o.name === objName);
    if (!obj || !obj.mesh || !obj.mesh.material) return;
    obj.mesh.material[prop] = value;
  };

  window._novaUI.applyLight = (objName, prop, value) => {
    const obj = window._novaState.getAll().find(o => o.name === objName);
    if (!obj || !obj.light) return;
    obj.light[prop] = value;
  };
}
