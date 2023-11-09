import { convertBigIntToUint8Array, convertUint8ArrayToBigInt } from '../model/bigint.js';

const SUPPORTED_CLIENT_DATA_JSON_LENGTHS = [114, 134, 243];

export async function webAuthnSignChallenge(challenge: Uint8Array): Promise<{
  signatureRaw: Uint8Array;
  clientDataJson: Uint8Array;
  authenticatorData: Uint8Array;
}> {
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

  const authenticatorData = new Uint8Array(assertation.response.authenticatorData);
  const clientDataJson = new Uint8Array(assertation.response.clientDataJSON);
  const signatureRaw = convertSignatureInASN1FormatToRaw(assertation.response.signature);
  return { authenticatorData, clientDataJson, signatureRaw };
}

function convertSignatureInASN1FormatToRaw(signatureBuffer: ArrayBuffer): Uint8Array {
  const usignature = new Uint8Array(signatureBuffer);
  const rStart = usignature[4] === 0 ? 5 : 4;
  const rEnd = rStart + 32;
  const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
  const r = usignature.slice(rStart, rEnd);
  const s = usignature.slice(sStart);
  const finalS = flipSValueIfBiggerThanHalfOfN(s);
  return new Uint8Array([...r, ...finalS]);
}

function flipSValueIfBiggerThanHalfOfN(s: Uint8Array) {
  const secp256r1n: bigint = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n;
  const sInt = convertUint8ArrayToBigInt(s);
  if (2n * sInt > secp256r1n) {
    return convertBigIntToUint8Array(secp256r1n - sInt);
  } else {
    return s;
  }
}
