import { useState } from 'react';

import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { UserWallet } from './context/current_wallet/UserWallet.js';

export function Home() {
  const [account, setWallet] = useState<UserWallet | null>(null);

  return (
    <>
      {account && <Main account={account} />}
      {!account && (
        <CreateAccount
          onAccountCreated={account => {
            setWallet(account);
          }}
        />
      )}
    </>
  );
}
