import { WebAuthnInterface } from '../aztec/webauthn_account_contract.js';
import { webauthnCreatePublicKey } from './webauthn_create_public_key.js';
import { webAuthnSignChallenge } from './webauth_sign_challange.js';
import { SigningPublicKey } from '../../model/webauthn/SigningPublicKey.js';
import { WebAuthnSignature } from '../../model/webauthn/WebAuthnSignature.js';

export class WebauthnSigner implements WebAuthnInterface {
  constructor(readonly userName: string) {}

  private publicKey: SigningPublicKey | null = null;

  async getPublicKey(): Promise<SigningPublicKey> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const { x, y } = await webauthnCreatePublicKey(this.userName);
    this.publicKey = new SigningPublicKey(x, y);
    return this.publicKey;
  }

  async sign(challengeParam: Uint8Array): Promise<WebAuthnSignature> {
    const { authenticatorData, clientDataJson, signatureRaw } = await webAuthnSignChallenge(challengeParam);
    return new WebAuthnSignature(authenticatorData, clientDataJson, signatureRaw);
  }
}
