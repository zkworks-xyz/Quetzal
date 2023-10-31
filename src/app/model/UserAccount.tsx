import { AccountWalletWithPrivateKey, AztecAddress } from "@aztec/aztec.js";

export interface UserAccount {
  username: string;
  account: AccountWalletWithPrivateKey;
}
