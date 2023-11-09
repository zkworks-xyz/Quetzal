import { describe, expect } from '@jest/globals';
import { convertBigIntToUint8Array, convertUint8ArrayToBigInt } from './bigint.js';

describe('bigint', () => {
  it('should properly convert Uint8Array to bigint', () => {
    expect(convertUint8ArrayToBigInt(new Uint8Array([1, 2, 3]))).toEqual(0x010203n);
  });

  it('should properly convert bigint to Uint8Array', () => {
    expect(convertBigIntToUint8Array(0x010203n, 6)).toEqual(new Uint8Array([0, 0, 0, 1, 2, 3]));
  });
});
