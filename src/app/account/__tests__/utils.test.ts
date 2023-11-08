import { describe, expect } from '@jest/globals';
import { base64encode, convertBigIntToUint8Array, convertUint8ArrayToBigInt, noPad, safeUrl } from '../utils.js';

describe('utils', () => {
  it('should properly encode Uint8Array to base64', () => {
    expect(base64encode(new TextEncoder().encode('Many hands make light work.'))).toBe(
      'TWFueSBoYW5kcyBtYWtlIGxpZ2h0IHdvcmsu',
    );
  });

  it('should properly remove pad from base64 encoded string', () => {
    expect(noPad('bGlnaHQgd29yay4=')).toBe('bGlnaHQgd29yay4');
    expect(noPad('bGlnaHQgd29yaw==')).toBe('bGlnaHQgd29yaw');
  });

  it('should properly convert base64 encoded string to safe url base64 encoding', () => {
    expect(safeUrl('++//')).toBe('--__');
  });

  it('should properly convert Uint8Array to bigint', () => {
    expect(convertUint8ArrayToBigInt(new Uint8Array([0x01, 0x02, 0x03]))).toEqual(0x010203n);
  });

  it('should properly convert bigint to Uint8Array', () => {
    expect(convertBigIntToUint8Array(0x010203n, 6)).toEqual(new Uint8Array([0, 0, 0, 1, 2, 3]));
  });
});
