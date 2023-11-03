import { useState } from 'react';

import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { UserAccount } from './model/UserAccount.js';

export function Home() {
  const [account, setAccount] = useState<UserAccount | null>(null);

  return (
    <>
      {account && <Main account={account} />}
      {!account && (
        <CreateAccount
          onAccountCreated={(account) => {
            setAccount(account);
          }}
        />
      )}
    </>
  );
}
