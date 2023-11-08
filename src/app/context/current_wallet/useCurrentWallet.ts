import { useContext } from 'react';
import { CurrentWalletContext, CurrentWalletContextInterface } from './CurrentWalletContext.js';

export const useCurrentWallet = (): CurrentWalletContextInterface => {
  return useContext(CurrentWalletContext);
};
