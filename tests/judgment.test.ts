import assert from 'node:assert/strict';
import {test} from 'node:test';
import {judgmentScene as scene} from '../src/documentary/scenes/judgment';

test('the interrupted request holds before the local fallback moves it, with the failed path still cut',()=>{
 const stopped=scene.parts(.31),held=scene.parts(.43),ready=scene.parts(.62),arrived=scene.parts(.96);
 assert.equal(stopped.request.transform,held.request.transform);
 assert.equal(held.fallback.opacity,0);
 assert.equal(ready.fallback.strokeDashoffset,0);
 assert.equal(ready.request.transform,held.request.transform);
 assert.notEqual(scene.parts(.76).request.transform,held.request.transform);
 assert.equal(arrived.cut.opacity,1);
 assert.equal(arrived.arrival.opacity,1);
 assert.equal(arrived.request.opacity,0);
 assert.match(scene.alts[2],/not the platform architecture/);
});
