import { decode } from 'cbor-x';

export async function webauthnCreatePublicKey(userName: string): Promise<{ x: Uint8Array; y: Uint8Array }> {
  const userId: Uint8Array = userName.length > 0 ? new TextEncoder().encode(userName) : new Uint8Array(16);
  const publicKeyCredentialCreationOptions: any = {
    rp: {
      name: 'Quezal smart contract',
    },
    user: {
      id: userId,
      name: userName,
      displayName: 'Test',
    },
    challenge: new Uint8Array(32),
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    allowCredentials: [
      {
        type: 'public-key',
        transports: ['internal'],
      },
    ],
    timeout: 60000,
    attestation: 'direct',
  };

  const credential: any = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions,
  });

  return getPublicKeyXYFromAttestationObject(credential.response.attestationObject);
}

function getPublicKeyXYFromAttestationObject(attestationObject: ArrayBuffer): { x: Uint8Array; y: Uint8Array } {
  const decodedAttestationObj = decode(new Uint8Array(attestationObject));
  const { authData } = decodedAttestationObj;
  const dataView = new DataView(new ArrayBuffer(2));
  const idLenBytes = authData.slice(53, 55);
  idLenBytes.forEach((value: any, index: any) => dataView.setUint8(index, value));
  const credentialIdLength = dataView.getUint16(0);
  const publicKeyBytes = authData.slice(55 + credentialIdLength);
  const publicKeyObject = decode(new Uint8Array(publicKeyBytes.buffer));
  const x: Uint8Array = publicKeyObject[-2] as Uint8Array;
  const y: Uint8Array = publicKeyObject[-3] as Uint8Array;
  return { x, y };
}
