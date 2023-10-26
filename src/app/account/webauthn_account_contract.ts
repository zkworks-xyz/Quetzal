import { WebAuthnAccountContractArtifact } from "../../artifacts/WebAuthnAccount.js";
import {
  AccountManager,
  AuthWitnessProvider,
  BaseAccountContract,
  CompleteAddress,
  Fr,
  GrumpkinPrivateKey,
  PXE,
  Salt,
} from "@aztec/aztec.js";

import { AuthWitness } from '@aztec/types';

export function getWebAuthnAccount(
  pxe: PXE,
  encryptionPrivateKey: GrumpkinPrivateKey,
  webAuntnInterface: WebAuntnInterface,
  saltOrAddress: Salt | CompleteAddress = Fr.ZERO,
): AccountManager {
  return new AccountManager(pxe, encryptionPrivateKey, new WebAuthnAccountContract(webAuntnInterface), saltOrAddress);
}

export class WebAuthnPublicKey {
  constructor(
    readonly x: Uint8Array,
    readonly y: Uint8Array,
  ) {
  }
}

export class WebAuthnSignature {
  constructor(
    readonly challenge: Uint8Array,
    readonly authenticator_data: Uint8Array,
    readonly client_data_json: Uint8Array,
    readonly signatureRaw: Uint8Array
  ) {
  }
}

export interface WebAuntnInterface {
  getPublicKey(): Promise<WebAuthnPublicKey>;

  sign(challenge: Uint8Array): Promise<WebAuthnSignature>;
}

/**
 * Account contract that authenticates transactions using WebAuthn signatures
 */
export class WebAuthnAccountContract extends BaseAccountContract {
  constructor(readonly webAuntnInterface: WebAuntnInterface) {
    super(WebAuthnAccountContractArtifact);
  }

  async getDeploymentArgs(): Promise<[number, number]> {
    const publicKey = await this.webAuntnInterface.getPublicKey();
    // return Promise.resolve([publicKey.x, publicKey.y]);
    return Promise.resolve([0, 0]);
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
