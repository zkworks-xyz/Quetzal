import { WebAuthnAccountContractArtifact } from '../../../artifacts/WebAuthnAccount.js';
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
import { SigningPublicKey } from '../../model/webauthn/SigningPublicKey.js';
import { WebAuthnSignature } from '../../model/webauthn/WebAuthnSignature.js';

export function getWebAuthnAccount(
  pxe: PXE,
  encryptionPrivateKey: GrumpkinPrivateKey,
  webAuthnInterface: WebAuthnInterface,
  saltOrAddress: Salt | CompleteAddress = Fr.ZERO,
): AccountManager {
  return new AccountManager(pxe, encryptionPrivateKey, new WebAuthnAccountContract(webAuthnInterface), saltOrAddress);
}

export interface WebAuthnInterface {
  getPublicKey(): Promise<SigningPublicKey>;

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

export class WebAuthnWitnessProvider implements AuthWitnessProvider {
  constructor(readonly webAuthnInterface: WebAuthnInterface) {}

  async createAuthWitness(message: Fr): Promise<AuthWitness> {
    const signature = await this.webAuthnInterface.sign(new Uint8Array(message.toBuffer()));
    return new AuthWitness(message, signature.toArray());
  }
}
