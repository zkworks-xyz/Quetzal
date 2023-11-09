import { AztecAddress } from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts/types';

export const ETHER_CONTRACT_ADDRESS_AS_STRING = '0x0ed3aaa22d69559ee368b32fbafb24b49b103c0a07bd834fd519c8157553ec1f';
export const ETHER_CONTRACT_ADDRESS = AztecAddress.fromString(ETHER_CONTRACT_ADDRESS_AS_STRING);
export const DAI_CONTRACT_ADDRESS_AS_STRING = '0x1c293ee87ce6d43af8ba5da8a2b4c40f076226b0bb87edb16e603d05cab6cfb7';
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

export function formatBalance(balance: bigint | undefined) {
  return balance ? balance.toString() : '0';
}
