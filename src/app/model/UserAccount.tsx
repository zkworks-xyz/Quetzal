import { AccountWalletWithPrivateKey } from '@aztec/aztec.js';

export interface UserAccount {
  username: string;
  account: AccountWalletWithPrivateKey;
}
