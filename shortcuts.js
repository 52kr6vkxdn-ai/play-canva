// ── NOVA ENGINE — helpers/shortcuts.js ───────────────────────────────────
// Global keyboard shortcuts for the editor.

function initShortcuts(scene) {
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;

    const selected = window._novaState.getSelected();
    const camera   = window._editorCamera;

    switch (e.key) {
      // ── Delete selected ──────────────────────────────────────────────────
      case 'Delete':
      case 'Backspace':
        window._nova.deleteSelected();
        break;

      // ── Frame selected / all ─────────────────────────────────────────────
      case 'f':
      case 'F': {
        const target = selected && selected.mesh
          ? selected.mesh.position
          : BABYLON.Vector3.Zero();
        camera.setTarget(target);
        camera.radius = 12;
        break;
      }

      // ── Grid toggle ──────────────────────────────────────────────────────
      case 'g':
        document.getElementById('btn-grid').click();
        break;

      // ── Gizmo modes ──────────────────────────────────────────────────────
      case 'q': document.querySelector('[data-mode="select"]').click(); break;
      case 'w': document.querySelector('[data-mode="move"]').click();   break;
      case 'e': document.querySelector('[data-mode="rotate"]').click(); break;
      case 'r': document.querySelector('[data-mode="scale"]').click();  break;
    }
  });
}
