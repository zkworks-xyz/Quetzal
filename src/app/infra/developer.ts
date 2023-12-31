import {
  AccountManager,
  AccountWalletWithPrivateKey,
  AztecAddress,
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
import { TOKEN_LIST } from '../model/token_info.js';

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

export function randomSalts() {
  return TOKEN_LIST.map(_ => Fr.random());
}

export function deterministicSalts() {
  return TOKEN_LIST.map((_, index) => new Fr(index));
}

export const deployTestTokens = async (adminWallet: AccountWalletWithPrivateKey, salts: Fr[]) => {
  const tokenContracts: TokenContract[] = [];
  for (const salt of salts) {
    const contract = await TokenContract.deploy(adminWallet, adminWallet.getAddress())
      .send({ contractAddressSalt: new Fr(salt) })
      .deployed();
    tokenContracts.push(contract);
  }
  return tokenContracts;
};

const FAUCET_AMOUNT = 123n;

export const mintTestTokens = async (address: AztecAddress, adminWallet: AccountWalletWithPrivateKey) => {
  for (const [index, token] of TOKEN_LIST.entries()) {
    const tokenContract = await TokenContract.at(token.address, adminWallet);
    const amount = FAUCET_AMOUNT * BigInt(index + 1);
    const tx = tokenContract.methods.mint_public(address, amount).send();
    await tx.wait();
  }
};
