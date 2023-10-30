export const convertUint8ArrayToBigInt = (u8Array: Uint8Array): bigint => {
  return BigInt('0x' + Buffer.from(u8Array).toString('hex'));
}

export const convertBigIntToUint8Array = (bigInt: bigint, arrayLength: number | null = null): Uint8Array => {
  const hexString = bigInt.toString(16);
  const hexStringPadded = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  const buffer = Buffer.from(hexStringPadded, 'hex');
  if (arrayLength && buffer.length > arrayLength) {
    throw new Error(`Buffer length ${buffer.length} is greater than arrayLength ${arrayLength}`);
  }
  const padding = new Uint8Array((arrayLength ? arrayLength : buffer.length) - buffer.length);
  return new Uint8Array([...padding, ...(new Uint8Array(buffer))]);
}