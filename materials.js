// ── NOVA ENGINE — core/materials.js ──────────────────────────────────────
// PBR material cache and default color palette.
// Exposes: window._novaMaterials

const NOVA_PALETTE = [
  '#5a8fff', '#ff6b6b', '#6bff6b',
  '#ffd700', '#c875ff', '#ff8c42', '#00bcd4',
];

function initMaterials(scene) {
  const cache = {};

  /** Returns a cached PBRMetallicRoughnessMaterial for the given hex color. */
  function getPBRMat(hexColor) {
    if (cache[hexColor]) return cache[hexColor];
    const mat = new BABYLON.PBRMetallicRoughnessMaterial('pbr_' + hexColor, scene);
    mat.baseColor            = BABYLON.Color3.FromHexString(hexColor);
    mat.metallic             = 0.0;
    mat.roughness            = 0.5;
    mat.environmentIntensity = 0.3;
    cache[hexColor] = mat;
    return mat;
  }

  /** Returns the palette color at index i (wraps around). */
  function paletteColor(i) {
    return NOVA_PALETTE[i % NOVA_PALETTE.length];
  }

  window._novaMaterials = { getPBRMat, paletteColor };
  return window._novaMaterials;
}
