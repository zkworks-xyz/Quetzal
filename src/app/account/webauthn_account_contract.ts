import { WebAuthnAccountContractArtifact } from '../../artifacts/WebAuthnAccount.js';
import {
  AccountManager,
  AuthWitnessProvider,
  BaseAccountContract,
  CompleteAddress,
  Fr,
  GrumpkinPrivateKey,
  PXE,
  Salt,
} from '@aztec/aztec.js';

import { AuthWitness } from '@aztec/types';

const CLIENT_DATA_JSON_MAX_LEN = 255;

export function getWebAuthnAccount(
  pxe: PXE,
  encryptionPrivateKey: GrumpkinPrivateKey,
  webAuthnInterface: WebAuthnInterface,
  saltOrAddress: Salt | CompleteAddress = Fr.ZERO,
): AccountManager {
  return new AccountManager(pxe, encryptionPrivateKey, new WebAuthnAccountContract(webAuthnInterface), saltOrAddress);
}

export class WebAuthnPublicKey {
  constructor(
    readonly x: Uint8Array,
    readonly y: Uint8Array,
  ) {}
}

export class WebAuthnSignature {
  constructor(
    readonly challenge: Uint8Array,
    readonly authenticator_data: Uint8Array,
    readonly client_data_json: Uint8Array,
    readonly signatureRaw: Uint8Array,
  ) {}
}

export interface WebAuthnInterface {
  getPublicKey(): Promise<WebAuthnPublicKey>;

  sign(challenge: Uint8Array): Promise<WebAuthnSignature>;
}

/**
 * Account contract that authenticates transactions using WebAuthn signatures
 */
export class WebAuthnAccountContract extends BaseAccountContract {
  constructor(readonly webAuthnInterface: WebAuthnInterface) {
    super(WebAuthnAccountContractArtifact);
  }

  async getDeploymentArgs(): Promise<any[]> {
    const publicKey = await this.webAuthnInterface.getPublicKey();
    return Promise.resolve([publicKey.x, publicKey.y]);
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return new WebAuthnWitnessProvider(this.webAuthnInterface);
  }
}

/** Creates auth witnesses using WebAuthn signatures. */
class WebAuthnWitnessProvider implements AuthWitnessProvider {
  constructor(private webAuthnInterface: WebAuthnInterface) {}

  async createAuthWitness(message: Fr): Promise<AuthWitness> {
    // TODO generate webauthn signature
    const signature = await this.webAuthnInterface.sign(message.toBuffer());
    const witness = [
      ...signature.signatureRaw,
      ...signature.authenticator_data,
      ...signature.challenge,
      signature.client_data_json.length,
      ...signature.client_data_json,
      ...new Uint8Array(CLIENT_DATA_JSON_MAX_LEN - signature.client_data_json.length),
    ];
    return new AuthWitness(message, witness);
  }
}
