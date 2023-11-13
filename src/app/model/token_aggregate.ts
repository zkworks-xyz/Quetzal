import { TokenContract } from '@aztec/noir-contracts/types';
import { TokenInfo } from './token_info.js';

export interface Token {
  info: TokenInfo;
  contract?: TokenContract;
  balance?: bigint;
}

export type TokensAggregate = Token[];
