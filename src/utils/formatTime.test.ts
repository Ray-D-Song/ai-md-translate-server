import { expect, test } from 'bun:test';
import formatTime from './formatTime.js';

test('formatTime', () => {
  expect(formatTime(500)).toBe('0 seconds');
  expect(formatTime(1_500)).toBe('1 second');
  expect(formatTime(5_200)).toBe('5 seconds');
  expect(formatTime(90_000)).toBe('1:30');
  expect(formatTime(60_000)).toBe('1:00');
  expect(formatTime(600_000)).toBe('10:00');
});
