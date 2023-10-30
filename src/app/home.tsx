import { Loader } from '@aztec/aztec-ui';
import { CompleteAddress } from '@aztec/aztec.js';
import { useState } from 'react';
import { PXE_URL } from '../config.js';
import { WalletDropdown } from './components/wallet_dropdown.js';
import { Contract } from './contract.js';
import styles from './home.module.scss';
import { UserAccount } from './model/UserAccount.js';
import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';




export function Home() {
  const [account, setAccount] = useState<UserAccount | null>(null);
  return (
    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">Quetzal</h1>
      {account && <Main account={account}/>}
      {!account && <CreateAccount onAccountCreated={setAccount}/>}

      {/* <>
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
      </> */}
    </main>
  );
}
