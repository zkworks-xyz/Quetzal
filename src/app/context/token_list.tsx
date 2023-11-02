import { AztecAddress } from '@aztec/aztec.js';

export const TOKEN_CONTRACT_ADDRESS_AS_STRING = '0x2f45f498b7912c779dde8e3594622e36d7908088b09e99ab91caaafb40d1f9ef';
export const TOKEN_CONTRACT_ADDRESS = AztecAddress.fromString(TOKEN_CONTRACT_ADDRESS_AS_STRING);

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
    address: AztecAddress.fromString(TOKEN_CONTRACT_ADDRESS_AS_STRING),
    decimals: 18,
    icon_url:
      'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    address: AztecAddress.fromString(TOKEN_CONTRACT_ADDRESS_AS_STRING),
    decimals: 18,
    icon_url:
      'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
  }
];

export const useTokenList = () => {
    return TOKEN_LIST;
}
