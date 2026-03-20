// ── NOVA ENGINE — core/gizmos.js ─────────────────────────────────────────
// Manages the Babylon.js GizmoManager and toolbar mode switching.
// Exposes: window._novaGizmos

function initGizmos(scene) {
  const gizmoManager = new BABYLON.GizmoManager(scene);
  gizmoManager.usePointerToAttachGizmos = false;
  gizmoManager.positionGizmoEnabled     = false;
  gizmoManager.rotationGizmoEnabled     = false;
  gizmoManager.scaleGizmoEnabled        = false;
  gizmoManager.boundingBoxGizmoEnabled  = false;

  let currentMode = 'select';

  function setMode(mode) {
    currentMode = mode;
    gizmoManager.positionGizmoEnabled = (mode === 'move');
    gizmoManager.rotationGizmoEnabled = (mode === 'rotate');
    gizmoManager.scaleGizmoEnabled    = (mode === 'scale');

    const obj = window._novaState.getSelected();
    if (obj && obj.mesh) gizmoManager.attachToMesh(obj.mesh);
  }

  function attachTo(mesh) {
    gizmoManager.attachToMesh(mesh);
    if (mesh && currentMode !== 'select') setMode(currentMode);
  }

  function detach() {
    gizmoManager.attachToMesh(null);
  }

  function getMode() { return currentMode; }

  // ── Toolbar buttons ──────────────────────────────────────────────────────
  document.querySelectorAll('.gizmo-tool').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gizmo-tool').forEach(b => (b.style.color = ''));
      btn.style.color = '#fff';
      setMode(btn.dataset.mode);
    });
  });

  window._novaGizmos = { setMode, attachTo, detach, getMode };
  return window._novaGizmos;
}
