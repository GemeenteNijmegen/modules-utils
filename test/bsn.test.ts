import { Bsn } from '../src/Bsn';

describe('Creating a BSN', () => {
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
});

describe('Validating a BSN', () => {
  test('Elfproef succeeds for valid BSN', async() => {
    expect(Bsn.elfproef('999996708')).toBeTruthy();
    expect(Bsn.elfproef('999996630')).toBeTruthy();
  });
  test('Elfproef fails for invalid BSN', async() => {
    expect(Bsn.elfproef('999998620')).toBeFalsy();
  });

  test('Validation fails for invalid BSN', async() => {
    expect(Bsn.validate('ditisgeenbsn').success).toBeFalsy();
    // Does not conform to elfproef
    expect(Bsn.validate('999998620').success).toBeFalsy();
    // Too short
    expect(Bsn.validate('123456').success).toBeFalsy();
    // Too long
    expect(Bsn.validate('1234567890').success).toBeFalsy();
  });
});
