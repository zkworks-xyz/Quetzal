import { convertBigIntToUint8Array, convertUint8ArrayToBigInt } from "./webauthn.utils.js";

describe('webauthn utils', () => {
  it('convert u8array to bigint', () => {
    expect(convertUint8ArrayToBigInt(new Uint8Array([0x01, 0x02]))).toBe(258n);
    expect(convertUint8ArrayToBigInt(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 0, 170],))).toBe(16711850n);
    expect(convertUint8ArrayToBigInt(new Uint8Array([48, 100, 78, 114, 225, 49, 160, 41, 184, 80, 69, 182, 129, 129, 88, 93, 40, 51, 232, 72, 121, 185, 112, 145, 67, 225, 245, 147, 240, 0, 0, 0],)))
      .toBe(21888242871839275222246405745257275088548364400416034343698204186575808495617n - 1n);
  });

// write test fot convertBigIntToUint8Array
  it('convert bigint to u8array', () => {
    expect(convertBigIntToUint8Array(258n)).toEqual(new Uint8Array([0x01, 0x02]));
    // expect(convertBigIntToUint8Array(16711850n)).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 170, 255]));
    // expect(convertBigIntToUint8Array(21888242871839275222246405745257275088548364400416034343698204186575808495617n - 1n))
    //   .toEqual(new Uint8Array([48, 100, 78, 114, 225, 49, 160, 41, 184, 80, 69, 182, 129, 129, 88, 93, 40, 51, 232, 72, 121, 185, 112, 145, 67, 225, 245, 147, 240, 0, 0, 0]));
  });
})
