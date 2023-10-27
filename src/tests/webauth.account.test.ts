import { beforeAll, describe, expect, it, jest } from "@jest/globals";
import { setupSandbox } from "./utils.js";
import {
  AccountManager,
  AccountWalletWithPrivateKey,
  Fr,
  getSchnorrAccount,
  isContractDeployed,
  PXE,
  TxStatus
} from "@aztec/aztec.js";
import { GrumpkinScalar } from "@aztec/circuits.js";
import { getWebAuthnAccount } from "../app/account/webauthn_account_contract.js";
import { TokenContract } from "@aztec/noir-contracts/types";
import { WebAuntnInterfaceIntWitnessStub } from "./webauthn_stub.js";

describe("Quetzal wallet", () => {
  jest.setTimeout(60_000);

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
  });

  it("should deploy WebAuthnAccount contract and check deployment status", async () => {
    const encryptionPrivateKey: GrumpkinScalar = GrumpkinScalar.random();
    const webAuthnAccount: AccountManager = getWebAuthnAccount(pxe, encryptionPrivateKey, new WebAuntnInterfaceIntWitnessStub())
    let accountWallet = await webAuthnAccount.waitDeploy();

    const isDeployed = await isContractDeployed(pxe, accountWallet.getAddress())
    expect(isDeployed).toBe(true);
  });

  describe('token contract operations on webauthn account', () => {
    let asset: TokenContract;
    let account0: AccountWalletWithPrivateKey;
    let account1: AccountWalletWithPrivateKey;

    beforeAll(async () => {
      const encryptionPrivateKey0: GrumpkinScalar = GrumpkinScalar.random();
      const webAuthnAccount0: AccountManager = getWebAuthnAccount(pxe, encryptionPrivateKey0, new WebAuntnInterfaceIntWitnessStub())
      account0 = await webAuthnAccount0.waitDeploy();

      const encryptionPrivateKey1: GrumpkinScalar = GrumpkinScalar.random();
      const webAuthnAccount1: AccountManager = getWebAuthnAccount(pxe, encryptionPrivateKey1, new WebAuntnInterfaceIntWitnessStub())
      account1 = await webAuthnAccount1.waitDeploy();
    });

    it("should properly deploy token", async () => {
      asset = await TokenContract.deploy(account0, account0.getAddress()).send().deployed();
      console.log(`Token deployed to ${asset.address}`);
    });

    it("should mint public amount", async () => {
      const amount: bigint = 1000n;
      const tx = asset.methods.mint_public(account0.getAddress(), amount).send();
      const receipt = await tx.wait();
      expect(receipt.status).toBe(TxStatus.MINED);
      expect(await asset.methods.balance_of_public(account0.getAddress()).view()).toEqual(amount);
      expect(await asset.methods.total_supply().view()).toEqual(amount);
    });

    it("should transfer public amount", async () => {
      const tx = asset.methods.transfer_public(account0.getAddress(), account1.getAddress(), 7, 0).send();
      const receipt = await tx.wait();
      expect(receipt.status).toBe(TxStatus.MINED);
      expect(await asset.methods.balance_of_public(account0.getAddress()).view()).toEqual(993n);
      expect(await asset.methods.balance_of_public(account1.getAddress()).view()).toEqual(7n);
    })

    it("should fail mint public amount for invalid witness", async () => {
      const webAuthnAccount: AccountManager = getWebAuthnAccount(pxe, GrumpkinScalar.random(), new WebAuntnInterfaceIntWitnessStub(11))
      const account = await webAuthnAccount.waitDeploy();
      const asset = await TokenContract.deploy(account, account.getAddress()).send().deployed();

      const amount: bigint = 1000n;
      const tx = asset.methods.mint_public(account0.getAddress(), amount).send();
      await expect(
        tx.wait()
      ).rejects.toThrow("(JSON-RPC PROPAGATED) Cannot satisfy constraint 'assert_eq(13, witness[0])'");
    })
  });
});
