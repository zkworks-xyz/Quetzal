import { WebAuthnInterface, WebAuthnPublicKey, WebAuthnSignature } from "./webauthn_account_contract.js";
import { webAuthnFetchPublicKey } from "../components/webauthn/register.js";

export class WebauthnSigner implements WebAuthnInterface {

  constructor(readonly userName: string) {
  }

  private publicKey: WebAuthnPublicKey | null = null;

  async getPublicKey(): Promise<WebAuthnPublicKey> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const { x, y } = await webAuthnFetchPublicKey(this.userName);
    this.publicKey = new WebAuthnPublicKey(x, y);
    return this.publicKey;
  }

  sign(challenge: Uint8Array): Promise<WebAuthnSignature> {
    throw new Error('Method not implemented.');
  }
}
