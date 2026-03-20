// ── NOVA ENGINE — core/state.js ───────────────────────────────────────────
// Central scene registry. All modules read/write scene state through here.
// Keeps a flat list of scene objects and tracks the active selection.

const NovaState = (() => {
  const sceneObjects = [];   // { name, kind, mesh, light, helper, helperLines }
  let   selectedObj  = null;
  let   objCount     = 0;
  let   _selectCallback = null;  // set by engine after init

  function nextId()   { return ++objCount; }
  function getCount() { return objCount; }

  function register(obj) {
    sceneObjects.push(obj);
  }

  function unregister(obj) {
    const idx = sceneObjects.indexOf(obj);
    if (idx !== -1) sceneObjects.splice(idx, 1);
  }

  function setSelectCallback(fn) { _selectCallback = fn; }

  function selectObject(obj) {
    selectedObj = obj;
    if (_selectCallback) _selectCallback(obj);
  }

  function getSelected()    { return selectedObj; }
  function getAll()         { return sceneObjects; }

  return {
    nextId,
    getCount,
    register,
    unregister,
    selectObject,
    setSelectCallback,
    getSelected,
    getAll,
  };
})();

window._novaState = NovaState;
