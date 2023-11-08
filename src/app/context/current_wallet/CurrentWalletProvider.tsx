import { ReactNode, useEffect, useState } from 'react';
import { usePXE } from '../pxe/usePxe.js';
import { CurrentWalletContext } from './CurrentWalletContext.js';
import { UserWallet } from './UserWallet.js';
import { deserializeUserWallet, serializeUserWallet } from './serialization.js';

const LOCAL_STORAGE_KEY = 'quetzal.current_wallet';

export function CurrentWalletProvider({ children }: { children: ReactNode }) {
  const [currentWallet, setCurrentWallet] = useState<UserWallet | null>(null);
  const { pxe } = usePXE();

  useEffect(() => {
    async function fetchWallet() {
      const serializedWallet = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (serializedWallet) {
        const wallet = await deserializeUserWallet(serializedWallet, pxe);
        setCurrentWallet(wallet);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchWallet();
  }, [pxe]);

  const wallet = {
    currentWallet,
    setCurrentWallet: (wallet: UserWallet) => {
      localStorage.setItem('quetzal.current_wallet', serializeUserWallet(wallet));
      setCurrentWallet(wallet);
    },
    clearCurrentWallet: () => {
      setCurrentWallet(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    },
  };

  return <CurrentWalletContext.Provider value={wallet}>{children} </CurrentWalletContext.Provider>;
}
