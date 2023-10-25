import { beforeAll, describe, expect, it } from "@jest/globals";
import { setupSandbox } from "./utils.js";
import {
  AccountManager, AccountWalletWithPrivateKey,
  AuthWitnessProvider,
  BaseAccountContract,
  CompleteAddress,
  Fr,
  getSchnorrAccount,
  isContractDeployed,
  Point,
  PXE
} from "@aztec/aztec.js";
import { GrumpkinScalar } from "@aztec/circuits.js";
import { WebAuthnAccountContractArtifact } from "../contracts/artifacts/webauthn/WebAuthnAccount.js";
import { AuthWitness } from "@aztec/types";

class WebAuthnAccountContract extends BaseAccountContract {
  constructor() {
    super(WebAuthnAccountContractArtifact);
  }

  getDeploymentArgs(): Promise<any[]> {
    const publicKey = Point.ZERO;
    return Promise.resolve([publicKey.x, publicKey.y]);
  }

  getAuthWitnessProvider(_address: CompleteAddress): AuthWitnessProvider {
    return {
      async createAuthWitness(message: Fr): Promise<AuthWitness> {
        const signature: any[] = [] // TODO generate webauthn signature
        return new AuthWitness(message, [...signature]);
      },
    };
  }
}

describe("Quetzal wallet", () => {

  let pxe: PXE;

  beforeAll(async () => {
    pxe = await setupSandbox();
  }, 60_000);

  it("should deploy SchnorrAccount contract and check deployment status", async () => {
    const encryptionPrivateKey: GrumpkinScalar = GrumpkinScalar.random();
    const signingPrivateKey: GrumpkinScalar = GrumpkinScalar.random();
    const salt: Fr = Fr.ZERO;
    const schnorrAccount: AccountManager = getSchnorrAccount(pxe, encryptionPrivateKey, signingPrivateKey, salt);
    let accountWallet: AccountWalletWithPrivateKey = await schnorrAccount.waitDeploy();

    const isDeployed = await isContractDeployed(pxe, accountWallet.getAddress())
    expect(isDeployed).toBe(true);
  }, 60_000);

  it("should deploy WebAuthnAccount contract and check deployment status", async () => {
    const encryptionPrivateKey: GrumpkinScalar = GrumpkinScalar.random();
    const salt: Fr = Fr.ZERO;
    const webAuthnAccount: AccountManager = new AccountManager(pxe, encryptionPrivateKey, new WebAuthnAccountContract(), salt);
    let accountWallet: AccountWalletWithPrivateKey = await webAuthnAccount.waitDeploy();

    const isDeployed = await isContractDeployed(pxe, accountWallet.getAddress())
    expect(isDeployed).toBe(true);
  }, 60_000);
});