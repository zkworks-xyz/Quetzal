import { useState } from 'react';

import { UserAccount } from './model/UserAccount.js';
import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { TokenContract } from './account/token.js';

export function Home() {
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [tokenContract, setTokenContract] = useState<TokenContract | null>(null);
  return (
    <>
      {account && tokenContract && <Main account={account} tokenContract={tokenContract} />}
      {!account && (
        <CreateAccount
          onAccountCreated={(account, tokenContract) => {
            setAccount(account);
            setTokenContract(tokenContract);
          }}
        />
      )}
    </>
  );
}
