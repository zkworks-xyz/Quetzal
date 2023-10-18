import { PXE_URL } from '../config.js';
import { WalletDropdown } from './components/wallet_dropdown.js';
import { Contract } from './contract.js';
import { DeveloperMode } from './modals/developer_mode.js';
import styles from './home.module.scss';
import { Loader } from '@aztec/aztec-ui';
import { CompleteAddress } from '@aztec/aztec.js';
import { useEffect, useRef, useState } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Home() {
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<CompleteAddress>();
  const [selectWalletError, setSelectedWalletError] = useState('');

  const handleSelectWallet = (address: CompleteAddress | undefined) => {
    setSelectedWallet(address);
    setIsLoadingWallet(false);
  };

  const handleSelectWalletError = (msg: string) => {
    setSelectedWalletError(msg);
    setIsLoadingWallet(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline">Quetzal</h1>
        <>
          {isLoadingWallet && <Loader />}
          {!isLoadingWallet && (
            <>
              {!!selectWalletError && (
                <>
                  {`Failed to load accounts. Error: ${selectWalletError}`}
                  <br />
                  {`Make sure PXE from Aztec Sandbox is running at: ${PXE_URL}`}
                </>
              )}
              {!selectWalletError && !selectedWallet && `No accounts.`}
              {!selectWalletError && !!selectedWallet && <Contract wallet={selectedWallet} />}
            </>
          )}
          <WalletDropdown
            selected={selectedWallet}
            onSelectChange={handleSelectWallet}
            onError={handleSelectWalletError}
          />
        </>
      </main>
    </QueryClientProvider>
  );
}
