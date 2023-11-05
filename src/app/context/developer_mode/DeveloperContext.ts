import { AztecAddressLike, TxReceipt } from '@aztec/aztec.js';
import { FieldsOf } from '@aztec/circuits.js';
import { createContext } from 'react';

export interface DeveloperContextInterface {
  faucet: (address: AztecAddressLike, amount: bigint) => Promise<FieldsOf<TxReceipt>>;
}

export const DeveloperContext = createContext<DeveloperContextInterface>({
  faucet: (_address: AztecAddressLike, _amount: bigint) => {
    return Promise.reject(new Error('DeveloperContext not initialized'));
  },
});
