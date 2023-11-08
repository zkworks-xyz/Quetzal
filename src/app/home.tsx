import { useState } from 'react';

import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { UserWallet } from './model/UserWallet.js';

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
