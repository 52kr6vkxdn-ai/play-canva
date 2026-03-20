// ── NOVA ENGINE — core/engine.js ─────────────────────────────────────────
// Bootstraps the Babylon.js engine, scene, camera, and render loop.
// Exposes: window._bje (engine), window._bjScene (scene)

function initBabylonEngine() {
  const wrap   = document.getElementById('bjs-wrap');
  const canvas = document.getElementById('bjs-canvas');

  // ── Engine ──────────────────────────────────────────────────────────────
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    adaptToDeviceRatio: true,
  });
  window._bje = engine;
  LOG.ok('Babylon.js Engine v' + BABYLON.Engine.Version + ' initialized.');

  // ── Scene ────────────────────────────────────────────────────────────────
  const scene = new BABYLON.Scene(engine);
  scene.clearColor   = new BABYLON.Color4(0.08, 0.08, 0.08, 1);
  scene.ambientColor = new BABYLON.Color3(0.15, 0.15, 0.15);
  scene.fogMode  = BABYLON.Scene.FOGMODE_LINEAR;
  scene.fogColor = new BABYLON.Color3(0.08, 0.08, 0.08);
  scene.fogStart = 60;
  scene.fogEnd   = 250;
  window._bjScene = scene;

  // ── Editor Camera ────────────────────────────────────────────────────────
  const camera = new BABYLON.ArcRotateCamera(
    'EditorCam', -Math.PI / 4, Math.PI / 3.5, 28, BABYLON.Vector3.Zero(), scene
  );
  camera.attachControl(canvas, true);
  camera.lowerBetaLimit       = 0.05;
  camera.upperBetaLimit       = Math.PI / 2 - 0.01;
  camera.minZ                 = 0.05;
  camera.maxZ                 = 2000;
  camera.wheelDeltaPercentage = 0.01;
  camera.panningSensibility   = 80;
  camera.angularSensibilityX  = 800;
  camera.angularSensibilityY  = 800;
  camera.panningMouseButton   = 1;
  window._editorCamera = camera;
  LOG.info('ArcRotateCamera attached.');

  // ── Resize observer ──────────────────────────────────────────────────────
  new ResizeObserver(() => engine.resize()).observe(wrap);

  return { engine, scene, camera };
}
