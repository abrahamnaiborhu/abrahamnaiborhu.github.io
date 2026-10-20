import assert from 'node:assert/strict';
import { test } from 'node:test';
import { glinstaScene } from '../src/documentary/scenes/glinsta';
import { sattabiScene } from '../src/documentary/scenes/sattabi';
import { avadScene } from '../src/documentary/scenes/avad';
import { startingScene } from '../src/documentary/scenes/startingPoint';
import { stateIndex } from '../src/documentary/scenes/types';

test('scene boundaries select matching captions and complete still frames', () => {
  for (const scene of [glinstaScene, sattabiScene, avadScene, startingScene]) {
    if(scene.words) assert.equal(scene.words.length,scene.states.length);
    assert.equal(scene.thresholds.length, scene.states.length - 1);
    assert.equal(scene.captions.length, scene.states.length);
    assert.equal(scene.alts.length, scene.states.length);
    assert.equal(scene.settled.length, scene.states.length);
    scene.thresholds.forEach((p, i) => {
      assert.equal(stateIndex(scene, p - .001), i);
      assert.equal(stateIndex(scene, p), i + 1);
    });
    scene.settled.forEach((p, i) => assert.equal(stateIndex(scene, p), i));
  }
});

