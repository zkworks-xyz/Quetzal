import { AccountWalletWithPrivateKey } from '@aztec/aztec.js';

export interface UserWallet {
  name: string;
  wallet: AccountWalletWithPrivateKey;
}
