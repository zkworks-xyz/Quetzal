import { AccountWalletWithPrivateKey, AztecAddress } from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts/types';
import { Token, TokensAggregate } from '../model/token_aggregate.js';
import { TOKEN_LIST } from '../model/token_info.js';

export class TokensRepository {
  static getTokensAggregate(): TokensAggregate {
    const iter = TOKEN_LIST.map<Token>(info => {
      return { info };
    });
    return new Array(...iter);
  }

  static async fetchContracts(tokens: TokensAggregate, wallet: AccountWalletWithPrivateKey) {
    const result = [];
    for (const token of tokens) {
      result.push({
        ...token,
        contract: await TokenContract.at(token.info.address, wallet),
      });
    }
    return result;
  }

  static async fetchBalances(tokens: TokensAggregate, address: AztecAddress) {
    const result = [];
    for (const token of tokens) {
      const balance = await token.contract!.methods.balance_of_public(address).view();
      result.push({ ...token, balance });
    }
    return result;
  }
}
