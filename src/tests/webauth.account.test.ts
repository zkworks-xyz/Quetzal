import { beforeAll, describe, expect, it } from "@jest/globals";
import { setupSandbox } from "./utils.js";
import {
  AccountManager,
  AccountWalletWithPrivateKey,
  Fr,
  getSchnorrAccount,
  isContractDeployed,
  PXE
} from "@aztec/aztec.js";
import { GrumpkinScalar } from "@aztec/circuits.js";
import { getWebAuthnAccount } from "../app/account/webauthn_account_contract.js";

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
    const webAuthnAccount: AccountManager = getWebAuthnAccount(pxe, encryptionPrivateKey, 0n, 0n)
    let accountWallet: AccountWalletWithPrivateKey = await webAuthnAccount.waitDeploy();

    const isDeployed = await isContractDeployed(pxe, accountWallet.getAddress())
    expect(isDeployed).toBe(true);
  }, 60_000);
});