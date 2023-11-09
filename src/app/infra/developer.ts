import {
  AccountManager,
  AccountWalletWithPrivateKey,
  Fr,
  INITIAL_SANDBOX_ENCRYPTION_KEYS,
  INITIAL_SANDBOX_SALTS,
  INITIAL_SANDBOX_SIGNING_KEYS,
  PXE,
  createPXEClient,
  getSchnorrAccount,
  waitForSandbox,
} from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts/types';

export function getSandboxAccounts(pxe: PXE): AccountManager[] {
  return INITIAL_SANDBOX_ENCRYPTION_KEYS.map((encryptionKey, i) =>
    getSchnorrAccount(pxe, encryptionKey, INITIAL_SANDBOX_SIGNING_KEYS[i], INITIAL_SANDBOX_SALTS[i]),
  );
}

export const setupSandbox = async () => {
  const { PXE_URL = 'http://localhost:8080' } = process.env;
  const pxe = createPXEClient(PXE_URL);
  await waitForSandbox(pxe);
  return pxe;
};

export const deployTestTokens = async (adminWallet: AccountWalletWithPrivateKey) => {
  const tokenContracts: TokenContract[] = [];
  for (const salt of [0n, 1n]) {
    const contract = await TokenContract.deploy(adminWallet, adminWallet.getAddress())
      .send({ contractAddressSalt: new Fr(salt) })
      .deployed();
    tokenContracts.push(contract);
  }
  return tokenContracts;
};
