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

export interface WebAuntnInterfaceIntWitness {
  getPublicKey(): Promise<WebAuthnPublicKey>;

  intWitness(): number;
}

/**
 * Account contract that authenticates transactions using WebAuthn signatures
 */
export class WebAuthnAccountContract extends BaseAccountContract {
  constructor(readonly webAuntnInterface: WebAuntnInterface) {
    super(WebAuthnAccountContractArtifact);
  }

  async getDeploymentArgs(): Promise<any[]> {
    const publicKey = await this.webAuntnInterface.getPublicKey();
    return Promise.resolve([publicKey.x, publicKey.y]);
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return new WebAuthnWitnessProvider(this.webAuntnInterface);
  }
}

/** Creates auth witnesses using WebAuthn signatures. */
class WebAuthnWitnessProvider implements AuthWitnessProvider {
  constructor(private webAuntnInterface: WebAuntnInterface) {
  }

  async createAuthWitness(message: Fr): Promise<AuthWitness> {
    // TODO generate webauthn signature
    const signature = await this.webAuntnInterface.sign(message.toBuffer());
    const witness = [
      ...signature.signatureRaw,
      ...signature.authenticator_data,
      ...signature.challenge,
      ...signature.client_data_json
    ];
    return new AuthWitness(message, witness);
  }
}
