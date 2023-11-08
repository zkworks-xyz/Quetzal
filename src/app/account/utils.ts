import { createPXEClient, waitForSandbox } from '@aztec/aztec.js';

export const setupSandbox = async () => {
  const { PXE_URL = 'http://localhost:8080' } = process.env;
  const pxe = createPXEClient(PXE_URL);
  await waitForSandbox(pxe);
  return pxe;
};

export function base64encode(input: Uint8Array): string {
  return Buffer.from(input).toString('base64');
}

export function noPad(input: string): string {
  return input.replaceAll('=', '');
}

export function safeUrl(input: string): string {
  return input.replaceAll('+', '-').replaceAll('/', '_');
}

export function toNumberArray(input: string): number[] {
  return input.split('').map(c => c.charCodeAt(0));
}

export const convertUint8ArrayToBigInt = (u8Array: Uint8Array): bigint => {
  return BigInt('0x' + Buffer.from(u8Array).toString('hex'));
};

export const convertBigIntToUint8Array = (bigInt: bigint, arrayLength: number | null = null): Uint8Array => {
  const hexString = bigInt.toString(16);
  const hexStringPadded = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  const buffer = Buffer.from(hexStringPadded, 'hex');
  if (arrayLength && buffer.length > arrayLength) {
    throw new Error(`Buffer length ${buffer.length} is greater than arrayLength ${arrayLength}`);
  }
  const padding = new Uint8Array((arrayLength ? arrayLength : buffer.length) - buffer.length);
  return new Uint8Array([...padding, ...new Uint8Array(buffer)]);
};
