// ── NOVA ENGINE — scene/lightFactory.js ──────────────────────────────────
// Creates light objects (Point / Spot / Dir) and Camera nodes.
// Depends on: helpers/lightHelpers.js

function initLightFactory(scene) {

  function _markerMat(name, color) {
    const mm = new BABYLON.PBRMetallicRoughnessMaterial('lmat_' + name, scene);
    mm.baseColor     = color;
    mm.emissiveColor = color;
    mm.metallic      = 0.0;
    mm.roughness     = 1.0;
    return mm;
  }

  function addLight(type) {
    const id   = window._novaState.nextId();
    const name = type + '_' + id;
    const pos  = new BABYLON.Vector3(
      (Math.random() - 0.5) * 6,
      3 + Math.random() * 2,
      (Math.random() - 0.5) * 6
    );

    let light  = null;
    let lColor = new BABYLON.Color3(1, 0.9, 0.3);

    if (type === 'PointLight') {
      light = new BABYLON.PointLight(name + '_light', pos.clone(), scene);
      light.intensity = 1.5;
      light.diffuse   = new BABYLON.Color3(1, 0.95, 0.85);
      lColor          = new BABYLON.Color3(1, 0.9, 0.3);

    } else if (type === 'SpotLight') {
      light = new BABYLON.SpotLight(name + '_light', pos.clone(),
        new BABYLON.Vector3(0, -1, 0), Math.PI / 4, 2, scene);
      light.intensity = 2.0;
      light.diffuse   = new BABYLON.Color3(1, 0.85, 0.7);
      lColor          = new BABYLON.Color3(1, 0.55, 0.15);
      window._novaShadows.getOrCreate(light);

    } else if (type === 'DirLight') {
      light = new BABYLON.DirectionalLight(name + '_light', new BABYLON.Vector3(0, -1, 0), scene);
      light.intensity = 1.0;
      light.position  = pos.clone();
      light.diffuse   = new BABYLON.Color3(1, 0.98, 0.92);
      lColor          = new BABYLON.Color3(1, 0.95, 0.6);
      window._novaShadows.getOrCreate(light);
    }

    // Emissive marker sphere
    const marker    = BABYLON.MeshBuilder.CreateSphere(name + '_marker', { diameter: 0.22, segments: 8 }, scene);
    marker.position  = pos.clone();
    marker.isPickable = true;
    marker.material  = _markerMat(name, lColor);

    // Build initial visual helper
    let helper;
    if (type === 'PointLight') {
      helper = buildPointLightHelper(pos.clone(), lColor, scene);
    } else if (type === 'SpotLight') {
      helper = buildSpotLightHelper(pos.clone(), new BABYLON.Vector3(0, -1, 0), Math.PI / 4, lColor, scene);
    } else {
      helper = buildDirLightHelper(pos.clone(), new BABYLON.Vector3(0, -1, 0), lColor, scene);
    }

    const obj = { name, kind: type, mesh: marker, light, helper };
    window._novaState.register(obj);
    window._novaUI.refreshHierarchy();
    window._novaState.selectObject(obj);
    LOG.ok('Added ' + type + ': ' + name);
    return obj;
  }

  function addEmpty() {
    const id     = window._novaState.nextId();
    const name   = 'Empty_' + id;
    const marker = BABYLON.MeshBuilder.CreateSphere(name + '_marker', { diameter: 0.12, segments: 4 }, scene);
    marker.position  = BABYLON.Vector3.Zero();
    marker.isPickable = true;

    const mm = new BABYLON.PBRMetallicRoughnessMaterial('em_' + name, scene);
    mm.baseColor     = new BABYLON.Color3(0.5, 0.5, 0.5);
    mm.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    mm.wireframe     = true;
    marker.material  = mm;

    const obj = { name, kind: 'Empty', mesh: marker, light: null, helper: null };
    window._novaState.register(obj);
    window._novaUI.refreshHierarchy();
    window._novaState.selectObject(obj);
    LOG.ok('Added Empty: ' + name);
    return obj;
  }

  function addCameraNode() {
    const id   = window._novaState.nextId();
    const name = 'Camera_' + id;
    const pos  = new BABYLON.Vector3(
      (Math.random() - 0.5) * 4, 1.5, (Math.random() - 0.5) * 4
    );

    const marker    = BABYLON.MeshBuilder.CreateBox(name + '_marker', { size: 0.22 }, scene);
    marker.position  = pos.clone();
    marker.isPickable = true;

    const mm = new BABYLON.PBRMetallicRoughnessMaterial('cm_' + name, scene);
    mm.baseColor     = new BABYLON.Color3(0.2, 0.6, 1);
    mm.emissiveColor = new BABYLON.Color3(0.15, 0.45, 0.8);
    mm.metallic      = 0.1;
    mm.roughness     = 0.4;
    marker.material  = mm;

    const helper = buildCameraHelper(pos.clone(), new BABYLON.Vector3(0, 0, 1),
      new BABYLON.Color3(0.3, 0.7, 1), scene);

    const obj = { name, kind: 'Camera', mesh: marker, light: null, helper };
    window._novaState.register(obj);
    window._novaUI.refreshHierarchy();
    window._novaState.selectObject(obj);
    LOG.info('Added Camera: ' + name);
    return obj;
  }

  return { addLight, addEmpty, addCameraNode };
}
