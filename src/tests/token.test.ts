import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { deployTestTokens, getSandboxAccounts, randomSalts, setupSandbox } from '../app/infra/developer.js';
import { AccountWalletWithPrivateKey } from '@aztec/aztec.js';
import { fetchTokenBalances, fetchTokenContracts } from '../app/infra/tokens.js';

describe('Token', () => {
  jest.setTimeout(60_000);

  let adminWallet: AccountWalletWithPrivateKey;

  beforeAll(async () => {
    const pxe = await setupSandbox();
    const [admin] = getSandboxAccounts(pxe);
    adminWallet = await admin.getWallet();
    await deployTestTokens(adminWallet, randomSalts());
  });

  it('Fetch balances', async () => {
    const contracts = await fetchTokenContracts(adminWallet);
    const tokenBalances = await fetchTokenBalances(adminWallet.getAddress(), contracts.values());
    const actual = Array.from(tokenBalances.values());
    expect(actual).toStrictEqual([0n, 0n]);
  });
});
