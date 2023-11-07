import { AccountWalletWithPrivateKey, AztecAddress, Fr } from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts/types';

export const ETHER_CONTRACT_ADDRESS_AS_STRING = '0x2f45f498b7912c779dde8e3594622e36d7908088b09e99ab91caaafb40d1f9ef';
export const ETHER_CONTRACT_ADDRESS = AztecAddress.fromString(ETHER_CONTRACT_ADDRESS_AS_STRING);
export const DAI_CONTRACT_ADDRESS_AS_STRING = '0x2c85abd98f07477ebef15793047d3eb9bee47f92731edb690068e73c6f5484ed';
export const DAI_CONTRACT_ADDRESS = AztecAddress.fromString(DAI_CONTRACT_ADDRESS_AS_STRING);

export interface TokenInfo {
  readonly name: string;
  readonly symbol: string;
  readonly address: AztecAddress;
  readonly decimals: number;
  readonly logoURI?: string;
}

export const TOKEN_LIST = [
  {
    name: 'Ether',
    symbol: 'ETH',
    address: ETHER_CONTRACT_ADDRESS,
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    address: DAI_CONTRACT_ADDRESS,
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
  },
];

export type TokenContractMap = Map<string, TokenContract>;

export type BalanceMap = Map<string, bigint>;

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

export const fetchTokenBalances = async (address: AztecAddress, tokenContracts: IterableIterator<TokenContract>) => {
  const balances = new Map();
  for (const tokenContract of tokenContracts) {
    const balance = await tokenContract!.methods.balance_of_public(address).view();
    balances.set(tokenContract!.address.toString(), balance);
  }
  return balances;
};

export const fetchTokenContracts = async (wallet: AccountWalletWithPrivateKey) => {
  const tokenContracts = new Map();
  for (const token of TOKEN_LIST) {
    tokenContracts.set(token.address.toString(), await TokenContract.at(token.address, wallet));
  }
  return tokenContracts;
};

export function formatBalance(balance: bigint | undefined) {
  return balance ? balance.toString() : '0';
}
