import { beforeAll, describe, expect, it } from "@jest/globals";
import { setupSandbox } from "./utils.js";
import { Fr, getSchnorrAccount, isContractDeployed, PXE } from "@aztec/aztec.js";
import { GrumpkinScalar } from "@aztec/circuits.js";

describe("Quetzal wallet", () => {

  let pxe: PXE;

  beforeAll(async () => {
    pxe = await setupSandbox();
  }, 60_000);

  it("should deploy SchnorrAccount contract and check deployment status", async () => {
    const encryptionPrivateKey = GrumpkinScalar.random();
    const signingPrivateKey = GrumpkinScalar.random();
    const salt = Fr.ZERO;
    const schnorrAccount = getSchnorrAccount(pxe, encryptionPrivateKey, signingPrivateKey, salt);
    let accountWallet = await schnorrAccount.waitDeploy();

    const isDeployed = await isContractDeployed(pxe, accountWallet.getAddress())
    expect(isDeployed).toBe(true);
  }, 60_000);
});