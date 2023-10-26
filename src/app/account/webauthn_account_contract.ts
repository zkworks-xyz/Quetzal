import { WebAuthnAccountContractArtifact } from "../../artifacts/WebAuthnAccount.js";
import {
  AuthWitnessProvider,
  BaseAccountContract,
  CompleteAddress,
  Fr,
  Point,
  PXE,
  GrumpkinPrivateKey,
  Salt,
  AccountManager,
} from "@aztec/aztec.js";

import { AuthWitness } from '@aztec/types';

export function getWebAuthnAccount(
  pxe: PXE,
  encryptionPrivateKey: GrumpkinPrivateKey,
  publicKeyX: bigint,
  publicKeyY: bigint,
  saltOrAddress: Salt | CompleteAddress = Fr.ZERO,
): AccountManager {
  return new AccountManager(pxe, encryptionPrivateKey, new WebAuthnAccountContract(publicKeyX, publicKeyY), saltOrAddress);
}

/**
 * Account contract that authenticates transactions using WebAuthn signatures
 */
export class WebAuthnAccountContract extends BaseAccountContract {
  constructor(readonly publicKeyX: bigint, readonly publicKeyY: bigint) {
    super(WebAuthnAccountContractArtifact);
  }

  getDeploymentArgs(): Promise<any[]> {
    return Promise.resolve([this.publicKeyX, this.publicKeyY]);
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return new WebAuthnWitnessProvider();
  }
}

/** Creates auth witnesses using WebAuthn signatures. */
class WebAuthnWitnessProvider implements AuthWitnessProvider {
  async createAuthWitness(message: Fr): Promise<AuthWitness> {
    // TODO generate webauthn signature
    return new AuthWitness(message, [13]);
  }
}
