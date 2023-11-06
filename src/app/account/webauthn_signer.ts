import { WebAuthnInterface, WebAuthnPublicKey, WebAuthnSignature } from './webauthn_account_contract.js';
import { webAuthnFetchPublicKey } from '../components/webauthn/webAuthnFetchPublicKey.js';
import { webAuthnLogin } from '../components/webauthn/login.js';

export class WebauthnSigner implements WebAuthnInterface {
  constructor(readonly userName: string) {}

  private publicKey: WebAuthnPublicKey | null = null;

  async getPublicKey(): Promise<WebAuthnPublicKey> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const { x, y } = await webAuthnFetchPublicKey(this.userName);
    this.publicKey = new WebAuthnPublicKey(x, y);
    return this.publicKey;
  }

  async sign(_challengeParam: Uint8Array): Promise<WebAuthnSignature> {
    const { challenge, authenticatorData, clientDataJson, signatureRaw } = await webAuthnLogin();
    return new WebAuthnSignature(new Uint8Array(challenge), authenticatorData, clientDataJson, signatureRaw);
  }
}
