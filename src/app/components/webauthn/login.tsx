import { convertBigIntToUint8Array, convertUint8ArrayToBigInt } from './convert.js';

const SUPPORTED_CLIENT_DATA_JSON_LENGTHS = [114, 134, 243];

export async function webAuthnLogin(
  challenge: Uint8Array = new Uint8Array([
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]),
) {
  const credentialRequestOptions = {
    publicKey: {
      timeout: 60000,
      allowCredentials: [],
      challenge: challenge,
    },
  };

  const assertation: any = await navigator.credentials.get(credentialRequestOptions);

  const clientDataJSONLength = new Uint8Array(assertation.response.clientDataJSON).length;

  if (!SUPPORTED_CLIENT_DATA_JSON_LENGTHS.includes(clientDataJSONLength)) {
    const len = SUPPORTED_CLIENT_DATA_JSON_LENGTHS;
    throw new Error(
      `Unsupported clientDataJSON. At the moment Noir contract only supports clientDataJSON of lengths ${len}`,
    );
  }

  const challenge1 = toBase64url(challenge)
    .replaceAll('=', '')
    .split('')
    .map(c => c.charCodeAt(0));
  const authenticatorData = new Uint8Array(assertation.response.authenticatorData);
  const clientDataJson = new Uint8Array(assertation.response.clientDataJSON);
  const signatureRaw = convertASN1toRaw(assertation.response.signature);
  return { challenge: challenge1, authenticatorData, clientDataJson, signatureRaw };
}

function toBase64url(buffer: ArrayBuffer): string {
  const txt: string = btoa(parseBuffer(buffer)); // base64
  return txt.replaceAll('+', '-').replaceAll('/', '_');
}

function parseBuffer(buffer: ArrayBuffer) {
  return String.fromCharCode(...new Uint8Array(buffer));
}

function convertASN1toRaw(signatureBuffer: ArrayBuffer) {
  // Convert signature from ASN.1 sequence to "raw" format
  const usignature = new Uint8Array(signatureBuffer);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);
  const secp256r1n = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n;
  const sInt = convertUint8ArrayToBigInt(s);
  let finalS = s;
  if (2n * sInt > secp256r1n) {
    finalS = convertBigIntToUint8Array(secp256r1n - sInt);
  }
  return new Uint8Array([...r, ...finalS]);
}
