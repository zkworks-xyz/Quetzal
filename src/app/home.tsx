import { useState } from 'react';

import { UserAccount } from './model/UserAccount.js';
import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { TokenContract } from './account/token.js';
import { useTokenList } from './context/token_list.js';

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
