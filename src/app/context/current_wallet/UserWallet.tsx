import { AccountWalletWithPrivateKey } from '@aztec/aztec.js';

export interface UserWallet {
  username: string;
  account: AccountWalletWithPrivateKey;
}
