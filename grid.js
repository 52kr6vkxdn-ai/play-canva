// ── NOVA ENGINE — scene/grid.js ───────────────────────────────────────────
// Builds the editor grid lines and world axis arrows.
// Exposes: window._novaGrid

function initGrid(scene) {
  const gridLines = [];
  let   gridVisible = true;

  // ── Grid ─────────────────────────────────────────────────────────────────
  const gsz = 200, divs = 200, step = gsz / divs, half = gsz / 2;
  for (let i = 0; i <= divs; i++) {
    const p   = -half + i * step;
    const col = (i % 10 === 0)
      ? new BABYLON.Color3(0.22, 0.22, 0.22)
      : new BABYLON.Color3(0.13, 0.13, 0.13);

    const lz = BABYLON.MeshBuilder.CreateLines('gz' + i,
      { points: [new BABYLON.Vector3(p, 0, -half), new BABYLON.Vector3(p, 0, half)] }, scene);
    lz.color = col; lz.isPickable = false;

    const lx = BABYLON.MeshBuilder.CreateLines('gx' + i,
      { points: [new BABYLON.Vector3(-half, 0, p), new BABYLON.Vector3(half, 0, p)] }, scene);
    lx.color = col; lx.isPickable = false;

    gridLines.push(lz, lx);
  }

  // ── World Axes ────────────────────────────────────────────────────────────
  const AL  = 500;
  const axX = BABYLON.MeshBuilder.CreateLines('axX',
    { points: [new BABYLON.Vector3(-AL, 0, 0), new BABYLON.Vector3(AL, 0, 0)] }, scene);
  axX.color = new BABYLON.Color3(0.9, 0.25, 0.3);
  axX.renderingGroupId = 1; axX.isPickable = false;

  const axY = BABYLON.MeshBuilder.CreateLines('axY',
    { points: [new BABYLON.Vector3(0, -AL, 0), new BABYLON.Vector3(0, AL, 0)] }, scene);
  axY.color = new BABYLON.Color3(0.4, 0.8, 0.25);
  axY.renderingGroupId = 1; axY.isPickable = false;

  const axZ = BABYLON.MeshBuilder.CreateLines('axZ',
    { points: [new BABYLON.Vector3(0, 0, -AL), new BABYLON.Vector3(0, 0, AL)] }, scene);
  axZ.color = new BABYLON.Color3(0.15, 0.5, 0.95);
  axZ.renderingGroupId = 1; axZ.isPickable = false;

  const axes = [axX, axY, axZ];

  // ── Toggle ────────────────────────────────────────────────────────────────
  function toggle() {
    gridVisible = !gridVisible;
    gridLines.forEach(l => (l.isVisible = gridVisible));
    axes.forEach(a   => (a.isVisible = gridVisible));
    LOG.info('Grid ' + (gridVisible ? 'shown' : 'hidden'));
  }

  document.getElementById('btn-grid').addEventListener('click', toggle);

  window._novaGrid = { toggle, isVisible: () => gridVisible };
  return window._novaGrid;
}
