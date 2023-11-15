import { AztecAddress } from '@aztec/circuits.js';
import { createContext } from 'react';

export interface DeveloperContextInterface {
  faucet: (address: AztecAddress) => Promise<void>;
}

export const DeveloperContext = createContext<DeveloperContextInterface>({
  faucet: (_address: AztecAddress) => {
    return Promise.reject(new Error('DeveloperContext not initialized'));
  },
});
