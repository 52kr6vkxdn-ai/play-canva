// ── NOVA ENGINE — ui/stats.js ─────────────────────────────────────────────
// Updates the FPS / mesh count / draw call overlay every N frames.

function initStats(engine, scene, getInterval) {
  const fpsStat  = document.getElementById('stat-fps');
  const meshStat = document.getElementById('stat-meshes');
  const drawStat = document.getElementById('stat-draws');

  const interval = getInterval || 20;

  function update(frame) {
    if (frame % interval !== 0) return;
    fpsStat.textContent  = engine.getFps().toFixed(0);
    meshStat.textContent = window._novaState.getAll().length;
    drawStat.textContent = scene.getActiveMeshes().length;
  }

  return { update };
}
