import test from 'node:test';
import assert from 'node:assert/strict';
import { targetDate, targetDateLabel, targetToeic, normalizeTargetGoal } from '../src/lib/ui/goalTarget.ts';

test('target date rejects impossible dates instead of normalizing into another month', () => {
  assert.ok(targetDate('31/02/2027', '2026-11-02').error);
  assert.ok(targetDate('29/02/2027', '2026-11-02').error);
  assert.equal(targetDate('29/02/2028', '2026-11-02').iso, '2028-02-29');
});
test('target date permits blank or today and enforces the observed 730-day window', () => {
  assert.deepEqual(targetDate('', '2026-11-02'), { iso: '', error: '' });
  assert.equal(targetDate('2/11/2026', '2026-11-02').iso, '2026-11-02');
  assert.ok(targetDate('1/11/2026', '2026-11-02').error);
  assert.equal(targetDate('1/11/2028', '2026-11-02').iso, '2028-11-01');
  assert.ok(targetDate('2/11/2028', '2026-11-02').error);
  assert.equal(targetDateLabel('2028-02-29'), '29/02/2028');
});
test('TOEIC entry rejects partial numeric strings and scores outside the displayed range', () => {
  for (const value of ['', '785abc', '10.5', '9', '991']) assert.equal(targetToeic(value), null);
  for (const value of ['10', '785', '990']) assert.equal(targetToeic(value), Number(value));
});
test('integer IELTS bands normalize without replacing unsupported legacy goals', () => {
  assert.equal(normalizeTargetGoal('IELTS Band 6'), 'IELTS Band 6.0');
  assert.equal(normalizeTargetGoal('IELTS 7'), 'IELTS Band 7.0');
  assert.equal(normalizeTargetGoal('Hoàn thành C2'), 'Hoàn thành C2');
});
