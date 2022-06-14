import { Bsn } from '../src/Bsn';

test('bsns valid', async () => {
  expect(() => new Bsn('999996708')).not.toThrow();
  expect(() => new Bsn('999996630')).not.toThrow();
  expect(() => new Bsn('999996642')).not.toThrow();
  expect(() => new Bsn('999996654')).not.toThrow();
  expect(() => new Bsn('999996666')).not.toThrow();
  expect(() => new Bsn('999996678')).not.toThrow();
});

test('bsns invalid', async () => {
  // Not numeric
  expect(() => new Bsn('ditisgeenbsn')).toThrow();
  // Does not conform to elfproef
  expect(() => new Bsn('999998620')).toThrow();
  // Too short
  expect(() => new Bsn('123456')).toThrow();
  // Too long
  expect(() => new Bsn('1234567890')).toThrow();
});