// ── NOVA ENGINE — scene/meshFactory.js ───────────────────────────────────
// Creates primitive mesh objects and registers them in NovaState.

function initMeshFactory(scene) {

  function addMesh(type) {
    const id   = window._novaState.nextId();
    const col  = window._novaMaterials.paletteColor(id - 1);
    const name = type + '_' + id;
    const rand = () => (Math.random() - 0.5) * 6;

    let mesh;
    switch (type) {
      case 'Box':
        mesh = BABYLON.MeshBuilder.CreateBox(name, { size: 1 }, scene);
        break;
      case 'Sphere':
        mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: 1, segments: 32 }, scene);
        break;
      case 'Cylinder':
        mesh = BABYLON.MeshBuilder.CreateCylinder(name, { height: 2, diameter: 1, tessellation: 32 }, scene);
        break;
      case 'Plane':
        mesh = BABYLON.MeshBuilder.CreatePlane(name, { size: 2 }, scene);
        mesh.rotation.x = Math.PI / 2;
        break;
      case 'Torus':
        mesh = BABYLON.MeshBuilder.CreateTorus(name, { diameter: 1.5, thickness: 0.4, tessellation: 32 }, scene);
        break;
      case 'Cone':
        mesh = BABYLON.MeshBuilder.CreateCylinder(name,
          { height: 2, diameterTop: 0, diameterBottom: 1, tessellation: 32 }, scene);
        break;
      case 'Capsule':
        mesh = BABYLON.MeshBuilder.CreateCapsule(name, { height: 2, radius: 0.5, tessellation: 16 }, scene);
        break;
      default:
        LOG.warn('Unknown mesh type: ' + type);
        return null;
    }

    mesh.position       = new BABYLON.Vector3(rand(), 0.5, rand());
    mesh.material       = window._novaMaterials.getPBRMat(col);
    mesh.receiveShadows = true;
    window._novaShadows.addCaster(mesh);

    const obj = { name, kind: type, mesh, light: null, helper: null, helperLines: [] };
    window._novaState.register(obj);
    window._novaUI.refreshHierarchy();
    window._novaState.selectObject(obj);
    LOG.ok('Added ' + type + ': ' + name);
    return obj;
  }

  return { addMesh };
}
