import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sattabiScene as scene } from '../src/documentary/scenes/sattabi';
import { stateIndex } from '../src/documentary/scenes/types';

test('Sattabi holds contact before controller response, and severs the cloud before its failure caption',()=>{
  assert.equal(scene.parts(.11).card.transform,scene.parts(.15).card.transform);
  assert.equal(scene.parts(.15).signal.strokeDashoffset,1);
  assert.equal(scene.parts(.23).signal.strokeDashoffset,0);
  assert.equal(scene.parts(.25).door.d,scene.parts(0).door.d);
  assert.equal(scene.parts(scene.thresholds[0]).cut.opacity,1);
  assert.equal(stateIndex(scene,.5),1);
});

test('Sattabi opens around a fixed hinge, verifies locally, and keeps the cloud disconnected',()=>{
  const closed=scene.parts(0),open=scene.parts(.35),local=scene.parts(.94);
  assert.notEqual(closed.door.d,open.door.d);
  assert.ok(String(open.door.d).includes('L524 90L524 324'));
  assert.equal(local.door.d,open.door.d);
  assert.equal(local.cut.opacity,1);
  assert.equal(local.local.opacity,1);
  assert.equal(local.check.strokeDashoffset,0);
  assert.equal(local.signal.strokeDashoffset,0);
  for(let i=0;i<=1000;i++) assert.doesNotMatch(JSON.stringify(scene.parts(i/1000)),/NaN|Infinity/);
});
