import { createContext } from 'react';
import { UserWallet } from './UserWallet.js';

export interface CurrentWalletContextInterface {
  currentWallet: UserWallet | null;
  setCurrentWallet: (wallet: UserWallet) => void;
  clearCurrentWallet: () => void;
}

export const CurrentWalletContext = createContext<CurrentWalletContextInterface>({
  setCurrentWallet: (_wallet: UserWallet) => {
    throw Error('CurrentAccountContext not initialized');
  },
  clearCurrentWallet: () => {
    throw Error('CurrentAccountContext not initialized');
  },
  currentWallet: null,
});
