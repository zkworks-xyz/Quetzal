import { WebAuthnInterface } from '../app/account/webauthn_account_contract.js';
import { secp256r1 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha256';
import { base64encode, noPad, safeUrl, toNumberArray } from '../app/model/base64.js';
import { WebAuthnPublicKey } from '../app/account/WebAuthnPublicKey.js';
import { WebAuthnSignature } from '../app/account/WebAuthnSignature.js';

export class WebAuthnInterfaceStub implements WebAuthnInterface {
  private secretKey = Uint8Array.from([
    106, 113, 6, 18, 145, 37, 60, 49, 237, 121, 236, 243, 249, 170, 204, 206, 86, 235, 171, 238, 180, 132, 227, 97, 202,
    92, 2, 15, 245, 100, 169, 250,
  ]);

  constructor(readonly validSignature: boolean = true) {}

  getPublicKey(): Promise<WebAuthnPublicKey> {
    const pub = secp256r1.getPublicKey(this.secretKey, false);
    const x = pub.subarray(1, 33);
    const y = pub.subarray(33, 65);

    return Promise.resolve(new WebAuthnPublicKey(x, y));
  }

  async sign(challenge: Uint8Array): Promise<WebAuthnSignature> {
    const authenticatorData: number[] = [
      73, 150, 13, 229, 136, 14, 140, 104, 116, 52, 23, 15, 100, 118, 96, 91, 143, 228, 174, 185, 162, 134, 50, 199,
      153, 92, 243, 186, 131, 29, 151, 99, 29, 0, 0, 0, 0,
    ];

    const challengeBase64: number[] = toNumberArray(noPad(safeUrl(base64encode(challenge))));

    const clientDataJson: number[] = [
      ...[
        123, 34, 116, 121, 112, 101, 34, 58, 34, 119, 101, 98, 97, 117, 116, 104, 110, 46, 103, 101, 116, 34, 44, 34,
        99, 104, 97, 108, 108, 101, 110, 103, 101, 34, 58, 34,
      ],
      ...challengeBase64,
      ...[
        34, 44, 34, 111, 114, 105, 103, 105, 110, 34, 58, 34, 104, 116, 116, 112, 58, 47, 47, 108, 111, 99, 97, 108,
        104, 111, 115, 116, 58, 53, 49, 55, 51, 34, 125,
      ],
    ];

    const clientDataJsonHash: Uint8Array = sha256.create().update(Uint8Array.from(clientDataJson)).digest();

    const sig = secp256r1.sign(new Uint8Array([...authenticatorData, ...clientDataJsonHash]), this.secretKey, {
      prehash: true,
    });
    const signature = [...sig.toCompactRawBytes()];
    return Promise.resolve(
      new WebAuthnSignature(
        Uint8Array.from(authenticatorData),
        Uint8Array.from(clientDataJson),
        Uint8Array.from(this.validSignature ? signature : new Uint8Array(64).fill(0)),
      ),
    );
  }
}
