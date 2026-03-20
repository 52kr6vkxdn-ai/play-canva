// ── NOVA ENGINE — scene/shadows.js ───────────────────────────────────────
// Lazy shadow generator — created on first directional/spot light add.
// Exposes: window._novaShadows

function initShadows() {
  let shadowGen = null;

  /**
   * Returns the existing ShadowGenerator, or creates one attached to `light`.
   * @param {BABYLON.IShadowLight} light
   */
  function getOrCreate(light) {
    if (!shadowGen) {
      shadowGen = new BABYLON.ShadowGenerator(1024, light);
      shadowGen.useBlurExponentialShadowMap = true;
      shadowGen.blurKernel = 32;
      LOG.ok('ShadowGenerator created.');
    }
    return shadowGen;
  }

  function addCaster(mesh) {
    if (shadowGen) shadowGen.addShadowCaster(mesh);
  }

  function get() { return shadowGen; }

  window._novaShadows = { getOrCreate, addCaster, get };
  return window._novaShadows;
}
