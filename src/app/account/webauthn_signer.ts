import { WebAuthnInterface } from './webauthn_account_contract.js';
import { webauthnCreatePublicKey } from './webauthn_create_public_key.js';
import { webAuthnSignChallenge } from './webauth_sign_challange.js';
import { WebAuthnPublicKey } from './WebAuthnPublicKey.js';
import { WebAuthnSignature } from './WebAuthnSignature.js';

export class WebauthnSigner implements WebAuthnInterface {
  constructor(readonly userName: string) {}

  private publicKey: WebAuthnPublicKey | null = null;

  async getPublicKey(): Promise<WebAuthnPublicKey> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const { x, y } = await webauthnCreatePublicKey(this.userName);
    this.publicKey = new WebAuthnPublicKey(x, y);
    return this.publicKey;
  }

  async sign(challengeParam: Uint8Array): Promise<WebAuthnSignature> {
    const { authenticatorData, clientDataJson, signatureRaw } = await webAuthnSignChallenge(challengeParam);
    return new WebAuthnSignature(authenticatorData, clientDataJson, signatureRaw);
  }
}
