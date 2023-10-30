export const convertUint8ArrayToBigInt = (u8Array: Uint8Array): bigint => {
  return BigInt('0x' + Buffer.from(u8Array).toString('hex'));
}



export const convertBigIntToUint8Array = (bigInt: bigint): Uint8Array => {
  // convert bigint to u8array
  const hexString = bigInt.toString(16);
  const hexStringPadded = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  const buffer = Buffer.from(hexStringPadded, 'hex');
  return new Uint8Array(buffer);
}