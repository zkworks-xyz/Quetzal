import { WebAuthnAccountContractArtifact } from "../../artifacts/WebAuthnAccount.js";
import { AuthWitnessProvider, BaseAccountContract, CompleteAddress, Fr, Point } from "@aztec/aztec.js";
import { AuthWitness } from "@aztec/types";

/**
 * Account contract that authenticates transactions using WebAuthn signatures
 */
export class WebAuthnAccountContract extends BaseAccountContract {
  constructor() {
    super(WebAuthnAccountContractArtifact);
  }

  getDeploymentArgs(): Promise<any[]> {
    const publicKey = Point.ZERO;
    return Promise.resolve([publicKey.x, publicKey.y]);
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return new WebAuthnWitnessProvider();
  }
}

/** Creates auth witnesses using WebAuthn signatures. */
class WebAuthnWitnessProvider implements AuthWitnessProvider {
  async createAuthWitness(message: Fr): Promise<AuthWitness> {
    const signature: any[] = [] // TODO generate webauthn signature
    return new AuthWitness(message, [...signature]);
  }
}
