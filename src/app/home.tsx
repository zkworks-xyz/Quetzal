import { CreateAccount } from './modals/CreateAccount.js';
import { Main } from './modals/Main.js';
import { useCurrentWallet } from './context/current_wallet/useCurrentWallet.js';

export function Home() {
  const { currentWallet, setCurrentWallet } = useCurrentWallet();
  return (
    <>
      {currentWallet && <Main account={currentWallet} />}
      {!currentWallet && (
        <CreateAccount
          onAccountCreated={account => {
            setCurrentWallet(account);
          }}
        />
      )}
    </>
  );
}
