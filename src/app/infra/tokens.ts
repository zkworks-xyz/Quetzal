import { AccountWalletWithPrivateKey, AztecAddress } from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts/types';
import { TOKEN_LIST, TokenContractMap } from '../model/token_list.js';

export const fetchTokenBalances = async (address: AztecAddress, tokenContracts: IterableIterator<TokenContract>) => {
  const balances = new Map();
  for (const tokenContract of tokenContracts) {
    const balance = await tokenContract!.methods.balance_of_public(address).view();
    balances.set(tokenContract!.address.toString(), balance);
  }
  return balances;
};

export const fetchTokenContracts = async (wallet: AccountWalletWithPrivateKey): Promise<TokenContractMap> => {
  const tokenContracts = new Map();
  for (const token of TOKEN_LIST) {
    tokenContracts.set(token.address.toString(), await TokenContract.at(token.address, wallet));
  }
  return tokenContracts;
};
