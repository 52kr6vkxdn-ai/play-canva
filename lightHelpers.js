// ── NOVA ENGINE — helpers/lightHelpers.js ────────────────────────────────
// Builds wireframe line helpers for lights and camera nodes.
// All helpers return a Babylon LineSystem mesh.

/** Internal: creates a named LineSystem from an array of [Vector3, Vector3] pairs. */
function makeLineSystem(name, segments, color, scene) {
  const ls = BABYLON.MeshBuilder.CreateLineSystem(name, { lines: segments }, scene);
  ls.color            = color;
  ls.isPickable       = false;
  ls.renderingGroupId = 1;
  return ls;
}

// ── Point Light Helper ────────────────────────────────────────────────────
function buildPointLightHelper(pos, color, scene) {
  const R = 0.6;
  const segments = [
    [pos.add(new BABYLON.Vector3(-R, 0, 0)),   pos.add(new BABYLON.Vector3(R, 0, 0))],
    [pos.add(new BABYLON.Vector3(0, -R, 0)),   pos.add(new BABYLON.Vector3(0, R, 0))],
    [pos.add(new BABYLON.Vector3(0, 0, -R)),   pos.add(new BABYLON.Vector3(0, 0, R))],
    [pos.add(new BABYLON.Vector3(-R*0.7, -R*0.7, 0)), pos.add(new BABYLON.Vector3(R*0.7, R*0.7, 0))],
    [pos.add(new BABYLON.Vector3(-R*0.7, 0, -R*0.7)), pos.add(new BABYLON.Vector3(R*0.7, 0, R*0.7))],
    [pos.add(new BABYLON.Vector3(0, -R*0.7, -R*0.7)), pos.add(new BABYLON.Vector3(0, R*0.7, R*0.7))],
  ];

  const STEPS = 16;
  const ringXY = [], ringXZ = [], ringYZ = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = Math.PI * 2 * i / STEPS, b = Math.PI * 2 * (i + 1) / STEPS;
    ringXY.push([
      pos.add(new BABYLON.Vector3(Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8, 0)),
      pos.add(new BABYLON.Vector3(Math.cos(b) * R * 0.8, Math.sin(b) * R * 0.8, 0)),
    ]);
    ringXZ.push([
      pos.add(new BABYLON.Vector3(Math.cos(a) * R * 0.8, 0, Math.sin(a) * R * 0.8)),
      pos.add(new BABYLON.Vector3(Math.cos(b) * R * 0.8, 0, Math.sin(b) * R * 0.8)),
    ]);
    ringYZ.push([
      pos.add(new BABYLON.Vector3(0, Math.cos(a) * R * 0.8, Math.sin(a) * R * 0.8)),
      pos.add(new BABYLON.Vector3(0, Math.cos(b) * R * 0.8, Math.sin(b) * R * 0.8)),
    ]);
  }
  return makeLineSystem('plh_' + Date.now(), [...segments, ...ringXY, ...ringXZ, ...ringYZ], color, scene);
}

// ── Spot Light Helper ─────────────────────────────────────────────────────
function buildSpotLightHelper(pos, dir, angle, color, scene) {
  const L = 3.0;
  const R = Math.tan(angle) * L;
  const STEPS = 16;

  const d      = dir.normalize();
  const up     = Math.abs(d.y) < 0.99 ? new BABYLON.Vector3(0, 1, 0) : new BABYLON.Vector3(1, 0, 0);
  const right  = BABYLON.Vector3.Cross(d, up).normalize();
  const realUp = BABYLON.Vector3.Cross(right, d).normalize();

  const tip  = pos.clone();
  const segs = [];

  // Cone rim
  const ringPts = [];
  for (let i = 0; i <= STEPS; i++) {
    const a = Math.PI * 2 * i / STEPS;
    ringPts.push(
      tip.add(d.scale(L))
         .add(right.scale(Math.cos(a) * R))
         .add(realUp.scale(Math.sin(a) * R))
    );
  }
  for (let i = 0; i < ringPts.length - 1; i++) segs.push([ringPts[i], ringPts[i + 1]]);

  // Spokes
  for (let i = 0; i < 4; i++) {
    const a  = Math.PI * 2 * i / 4;
    const pt = tip.add(d.scale(L))
                  .add(right.scale(Math.cos(a) * R))
                  .add(realUp.scale(Math.sin(a) * R));
    segs.push([tip.clone(), pt]);
  }
  segs.push([tip.clone(), tip.add(d.scale(L * 1.1))]);

  return makeLineSystem('slh_' + Date.now(), segs, color, scene);
}

// ── Directional Light Helper ──────────────────────────────────────────────
function buildDirLightHelper(pos, dir, color, scene) {
  const L    = 2.0;
  const GRID = 3, STEP = 0.7, half = (GRID - 1) * STEP / 2;
  const d      = dir.normalize();
  const up     = Math.abs(d.y) < 0.99 ? new BABYLON.Vector3(0, 1, 0) : new BABYLON.Vector3(1, 0, 0);
  const right  = BABYLON.Vector3.Cross(d, up).normalize();
  const realUp = BABYLON.Vector3.Cross(right, d).normalize();
  const segs   = [];

  for (let ix = 0; ix < GRID; ix++) {
    for (let iy = 0; iy < GRID; iy++) {
      const origin = pos
        .add(right.scale(ix * STEP - half))
        .add(realUp.scale(iy * STEP - half));
      const end = origin.add(d.scale(L));
      segs.push([origin, end]);

      const as = 0.15;
      segs.push([end, end.subtract(d.scale(as * 2)).add(right.scale(as))]);
      segs.push([end, end.subtract(d.scale(as * 2)).subtract(right.scale(as))]);
    }
  }
  return makeLineSystem('dlh_' + Date.now(), segs, color, scene);
}

// ── Camera Frustum Helper ─────────────────────────────────────────────────
function buildCameraHelper(pos, dir, color, scene) {
  const nearD = 0.5, farD = 3.0, fovY = 0.5, aspect = 1.6;
  const nearH = Math.tan(fovY) * nearD, nearW = nearH * aspect;
  const farH  = Math.tan(fovY) * farD,  farW  = farH * aspect;

  const d      = dir.normalize();
  const up     = Math.abs(d.y) < 0.99 ? new BABYLON.Vector3(0, 1, 0) : new BABYLON.Vector3(1, 0, 0);
  const r      = BABYLON.Vector3.Cross(d, up).normalize();
  const u      = BABYLON.Vector3.Cross(r, d).normalize();

  const nBL = pos.add(d.scale(nearD)).subtract(r.scale(nearW)).subtract(u.scale(nearH));
  const nBR = pos.add(d.scale(nearD)).add(r.scale(nearW)).subtract(u.scale(nearH));
  const nTL = pos.add(d.scale(nearD)).subtract(r.scale(nearW)).add(u.scale(nearH));
  const nTR = pos.add(d.scale(nearD)).add(r.scale(nearW)).add(u.scale(nearH));
  const fBL = pos.add(d.scale(farD)).subtract(r.scale(farW)).subtract(u.scale(farH));
  const fBR = pos.add(d.scale(farD)).add(r.scale(farW)).subtract(u.scale(farH));
  const fTL = pos.add(d.scale(farD)).subtract(r.scale(farW)).add(u.scale(farH));
  const fTR = pos.add(d.scale(farD)).add(r.scale(farW)).add(u.scale(farH));

  const segs = [
    [nBL, nBR], [nBR, nTR], [nTR, nTL], [nTL, nBL],
    [fBL, fBR], [fBR, fTR], [fTR, fTL], [fTL, fBL],
    [pos.clone(), nBL], [pos.clone(), nBR], [pos.clone(), nTL], [pos.clone(), nTR],
    [nBL, fBL], [nBR, fBR], [nTL, fTL], [nTR, fTR],
    [pos.add(u.scale(0.5)).subtract(r.scale(0.15)), pos.add(u.scale(0.8))],
    [pos.add(u.scale(0.5)).add(r.scale(0.15)),      pos.add(u.scale(0.8))],
    [pos.subtract(r.scale(0.2)), pos.add(r.scale(0.2))],
    [pos.subtract(u.scale(0.2)), pos.add(u.scale(0.2))],
  ];
  return makeLineSystem('camh_' + Date.now(), segs, color, scene);
}

// ── Helper Updater — rebuilds helpers each frame for live tracking ─────────
function updateHelperLines(obj, scene) {
  if (!obj || !obj.helper) return;
  const mesh = obj.mesh;
  const pos  = mesh.absolutePosition.clone();

  obj.helper.dispose();

  if (obj.kind === 'PointLight') {
    obj.helper = buildPointLightHelper(pos, new BABYLON.Color3(1, 0.9, 0.3), scene);
    if (obj.light) obj.light.position = pos.clone();

  } else if (obj.kind === 'SpotLight') {
    const dir = _getWorldDir(mesh, new BABYLON.Vector3(0, -1, 0));
    obj.helper = buildSpotLightHelper(pos, dir,
      obj.light ? obj.light.angle : Math.PI / 4, new BABYLON.Color3(1, 0.55, 0.15), scene);
    if (obj.light) { obj.light.position = pos.clone(); obj.light.direction = dir.clone(); }

  } else if (obj.kind === 'DirLight') {
    const dir = _getWorldDir(mesh, new BABYLON.Vector3(0, -1, 0));
    obj.helper = buildDirLightHelper(pos, dir, new BABYLON.Color3(1, 0.95, 0.6), scene);
    if (obj.light) obj.light.direction = dir.clone();

  } else if (obj.kind === 'Camera') {
    const dir = _getWorldDir(mesh, new BABYLON.Vector3(0, 0, 1));
    obj.helper = buildCameraHelper(pos, dir, new BABYLON.Color3(0.3, 0.7, 1), scene);
  }
}

/** Transforms a local-space direction into world space using mesh rotation. */
function _getWorldDir(mesh, localDir) {
  const rotMat = new BABYLON.Matrix();
  if (mesh.rotationQuaternion) {
    mesh.rotationQuaternion.toRotationMatrix(rotMat);
  } else {
    BABYLON.Matrix.RotationYawPitchRollToRef(
      mesh.rotation.y, mesh.rotation.x, mesh.rotation.z, rotMat
    );
  }
  return BABYLON.Vector3.TransformNormal(localDir, rotMat).normalize();
}
