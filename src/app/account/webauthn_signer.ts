import { WebAuthnInterface, WebAuthnPublicKey, WebAuthnSignature } from './webauthn_account_contract.js';
import { webAuthnFetchPublicKey } from '../components/webauthn/register.js';
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

  async sign(challengeParam: Uint8Array): Promise<WebAuthnSignature> {
    // TODO use challengeParam
    const { challenge, authenticator_data, client_data_json, signatureRaw } = await webAuthnLogin();
    const webAuthnSignature = new WebAuthnSignature(
      new Uint8Array(challenge),
      authenticator_data,
      client_data_json,
      signatureRaw,
    );
    console.log(webAuthnSignature);
    return webAuthnSignature;
  }
}
