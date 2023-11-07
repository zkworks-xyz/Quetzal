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
    readonly authenticatorData: Uint8Array,
    readonly clientDataJson: Uint8Array,
    readonly signatureRaw: Uint8Array,
  ) {}

  toArray(): number[] {
    return [
      ...this.signatureRaw,
      ...this.authenticatorData,
      this.clientDataJson.length,
      ...this.clientDataJson,
      ...new Uint8Array(CLIENT_DATA_JSON_MAX_LEN - this.clientDataJson.length),
    ];
  }
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
    return <AuthWitnessProvider>{
      createAuthWitness: async (message: Fr): Promise<AuthWitness> => {
        const signature = await this.webAuthnInterface.sign(new Uint8Array(message.toBuffer()));
        return new AuthWitness(message, signature.toArray());
      },
    };
  }
}
