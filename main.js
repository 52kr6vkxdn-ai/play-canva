// ── NOVA ENGINE — main.js ─────────────────────────────────────────────────
// Entry point. Initializes all subsystems in dependency order and starts
// the Babylon render loop.
//
// Load order in index.html:
//   core/logger.js → core/state.js → core/engine.js → core/gizmos.js
//   → core/materials.js → scene/shadows.js → helpers/lightHelpers.js
//   → scene/grid.js → scene/meshFactory.js → scene/lightFactory.js
//   → ui/drag.js → ui/hierarchy.js → ui/inspector.js
//   → ui/addMenu.js → ui/stats.js → helpers/shortcuts.js → main.js

window.addEventListener('DOMContentLoaded', () => {

  // ── 1. Core systems ───────────────────────────────────────────────────────
  initDragHandles();
  initHierarchyFilter();
  initInspectorBindings();

  const { engine, scene, camera } = initBabylonEngine();

  initGizmos(scene);
  initMaterials(scene);
  initShadows();

  // ── 2. Scene systems ──────────────────────────────────────────────────────
  initGrid(scene);

  const { addMesh }      = initMeshFactory(scene);
  const { addLight, addEmpty, addCameraNode } = initLightFactory(scene);

  // ── 3. UI systems ─────────────────────────────────────────────────────────
  // Expose UI helpers needed by inspector inline handlers
  window._novaUI = window._novaUI || {};
  window._novaUI.refreshHierarchy = refreshHierarchy;
  window._novaUI.showInspector    = showInspector;

  initAddObjectMenu();

  const stats = initStats(engine, scene);

  // ── 4. Selection logic ────────────────────────────────────────────────────
  function selectObject(obj) {
    window._novaGizmos.attachTo(obj && obj.mesh ? obj.mesh : null);
    refreshHierarchy();
    showInspector(obj);
    if (obj) LOG.info('Selected: ' + obj.name);
  }

  window._novaState.setSelectCallback(selectObject);

  // Click-to-select in viewport
  scene.onPointerDown = (evt, pickResult) => {
    if (evt.button !== 0) return;
    if (pickResult.hit && pickResult.pickedMesh) {
      const found = window._novaState.getAll().find(o => o.mesh === pickResult.pickedMesh);
      window._novaState.selectObject(found || null);
    } else {
      window._novaState.selectObject(null);
    }
  };

  // ── 5. Public API ─────────────────────────────────────────────────────────
  window._nova = {
    addMesh,
    addLight,
    addEmpty,
    addCameraNode,

    deleteSelected() {
      const obj = window._novaState.getSelected();
      if (!obj) return;
      LOG.warn('Deleted: ' + obj.name);
      if (obj.mesh)   obj.mesh.dispose();
      if (obj.light)  obj.light.dispose();
      if (obj.helper) obj.helper.dispose();
      window._novaState.unregister(obj);
      window._novaState.selectObject(null);
      window._novaGizmos.detach();
      refreshHierarchy();
      showInspector(null);
    },

    setVisible(name, val) {
      const obj = window._novaState.getAll().find(o => o.name === name);
      if (!obj) return;
      if (obj.mesh)   obj.mesh.isVisible   = val;
      if (obj.helper) obj.helper.isVisible = val;
      refreshHierarchy();
      LOG.info(name + ' visibility: ' + val);
    },
  };

  // ── 6. Keyboard shortcuts ─────────────────────────────────────────────────
  initShortcuts(scene);

  // ── 7. Render loop ────────────────────────────────────────────────────────
  let frame = 0;

  const LIGHT_KINDS = new Set(['PointLight', 'SpotLight', 'DirLight', 'Camera']);

  engine.runRenderLoop(() => {
    scene.render();
    frame++;

    // Rebuild light/camera helpers every 3 frames
    if (frame % 3 === 0) {
      window._novaState.getAll().forEach(obj => {
        if (obj.helper && LIGHT_KINDS.has(obj.kind)) {
          updateHelperLines(obj, scene);
        }
      });
    }

    // Update stats overlay every 20 frames
    stats.update(frame);

    // Refresh inspector live (transform values)
    if (frame % 20 === 0) {
      const sel = window._novaState.getSelected();
      if (sel) showInspector(sel);
    }
  });

  LOG.ok('NOVA Engine ready.');
  LOG.info('Q/W/E/R = gizmos · F = frame · Del = delete · G = grid');
});
