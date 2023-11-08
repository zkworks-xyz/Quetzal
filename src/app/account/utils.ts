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
  return input
    .replaceAll('+', '-')
    .replaceAll('/', '_');
}

export function toNumberArray(input: string): number[] {
  return input.split('').map(c => c.charCodeAt(0));
}
