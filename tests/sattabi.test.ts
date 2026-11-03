import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sattabiScene as scene } from '../src/documentary/scenes/sattabi';
import { stateIndex } from '../src/documentary/scenes/types';

test('Sattabi holds one tap, loses cloud access, then verifies locally before the door moves',()=>{
  assert.equal(scene.parts(.2).card.transform,scene.parts(.28).card.transform);
  assert.equal(scene.parts(.44).door.d,scene.parts(0).door.d);
  assert.equal(scene.parts(.44).local.opacity,0);
  assert.equal(scene.parts(.64).local.opacity,1);
  assert.equal(scene.parts(.64).check.strokeDashoffset,0);
  assert.equal(scene.parts(.64).door.d,scene.parts(0).door.d);
  assert.equal(scene.parts(scene.thresholds[0]).cut.opacity,1);
  assert.equal(stateIndex(scene,.5),1);
});

test('Sattabi opens once into light, keeps its hinge fixed and leaves the cloud offline',()=>{
  const closed=scene.parts(0),local=scene.parts(.96);
  assert.notEqual(closed.door.d,local.door.d);
  assert.ok(String(local.door.d).includes('L420 40L420 446'));
  assert.equal(local.cut.opacity,1);
  assert.equal(local.local.opacity,1);
  assert.equal(local.check.strokeDashoffset,0);
  assert.equal(local.light.opacity,1);
  assert.equal(scene.parts(1).door.d,local.door.d);
  for(let i=0;i<=1000;i++) assert.doesNotMatch(JSON.stringify(scene.parts(i/1000)),/NaN|Infinity/);
});
