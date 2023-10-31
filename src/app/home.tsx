import { useState } from 'react';
import styles from './home.module.scss';
import { UserAccount } from './model/UserAccount.js';
import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { TokenContract } from "./account/token.js";

export function Home() {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [tokenContract, setTokenContract] = useState<TokenContract | null>(null);
  return (
    <main className={styles.main}>
      <h1 className="text-3xl font-bold underline">Quetzal</h1>
      {account && tokenContract && <Main account={account} tokenContract={tokenContract}/>}
      {!account && <CreateAccount onAccountCreated={(account, tokenContract) => {
        setAccount(account);
        setTokenContract(tokenContract);
      }}/>}

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
