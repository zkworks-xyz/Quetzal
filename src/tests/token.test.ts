import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { deployTestTokens, getSandboxAccounts, randomSalts, setupSandbox } from '../app/infra/developer.js';
import { AccountWalletWithPrivateKey } from '@aztec/aztec.js';
import { TokensRepository } from '../app/infra/tokens_repository.js';

describe('TokensRepository', () => {
  jest.setTimeout(60_000);

  let adminWallet: AccountWalletWithPrivateKey;

  beforeAll(async () => {
    const pxe = await setupSandbox();
    const [admin] = getSandboxAccounts(pxe);
    adminWallet = await admin.getWallet();
    await deployTestTokens(adminWallet, randomSalts());
  });

  it('Fetch balances', async () => {
    let tokens = TokensRepository.getTokensAggregate();
    tokens = await TokensRepository.fetchContracts(tokens, adminWallet);
    tokens = await TokensRepository.fetchBalances(tokens, adminWallet.getAddress());
    expect(tokens[0].balance).toBe(0n);
    expect(tokens[1].balance).toBe(0n);
  });
});
