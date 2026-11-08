import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
const layout = readFileSync('app/layout.tsx', 'utf8');
const source = layout.match(/const introBootstrap = `([^`]+)`;/)[1];
for (const [name, reduced, seen, blocked, expected] of [
  ['sesión nueva prepara la introducción cálida', false, false, false, 'pending'],
  ['sesión vista entra directamente', false, true, false, undefined],
  ['movimiento reducido omite introducción', true, false, false, undefined],
  ['almacenamiento bloqueado no causa error', false, false, true, 'pending'],
]) {
  test(name, () => {
    const root = { dataset: {} };
    const storage = { getItem(key) {
      assert.equal(key, 'una-foto-mas:intro-seen');
      if (blocked) throw new Error('Storage disabled');
      return seen ? '1' : null;
    } };
    vm.runInNewContext(source, { document: { documentElement: root }, window: { matchMedia: () => ({ matches: reduced }) }, sessionStorage: storage });
    assert.equal(root.dataset.intro, expected);
  });
}
