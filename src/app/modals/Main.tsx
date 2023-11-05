import { TokenContract } from '@aztec/noir-contracts/types';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import { Alert, AlertType } from '../components/alert.js';
import { PrimaryButton, SmallButton } from '../components/button.js';
import { UserAccount } from '../model/UserAccount.js';
import { TOKEN_LIST } from '../model/token_list.js';
import { SendTokens } from './SendTokens.js';

interface MainProps {
  account: UserAccount;
}

enum CurrentModal {
  Main,
  SendTokens,
}

export function Main({ account }: MainProps) {
  const [modal, setModal] = useState<CurrentModal>(CurrentModal.Main);

  const fetchTokenContract = () => {
    const token = TOKEN_LIST[0];
    return TokenContract.at(token.address, account.account);
  };

  const { data: tokenContract } = useQuery({
    queryKey: ['tokenContract'],
    queryFn: fetchTokenContract,
  });

  const fetchBalance = async () => {
    return tokenContract!.methods.balance_of_public(account.account.getAddress()).view();
  };

  const { data, isError, isPending, refetch } = useQuery({
    queryKey: ['balance'],
    queryFn: fetchBalance,
    enabled: !!tokenContract,
  });

  const copy = async () => {
    const value = account.account.getAddress().toString();
    await navigator.clipboard.writeText(value);
  };

  if (CurrentModal.SendTokens === modal) {
    return (
      <SendTokens
        account={account}
        tokenContract={tokenContract!}
        onClose={() => setModal(CurrentModal.Main)}
        onSuccess={() => setModal(CurrentModal.Main)}
      />
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8 flex-auto flex-col">
      {isError && <Alert message="Error fetching balance" />}
      {isPending && <Alert message="Fetching balance" alertType={AlertType.info} />}
      <div className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">Your address</div>
      <div className="mt-1 text-gray-800 md:text-xl dark:text-white text-base text-left flex-col">
        {account.account.getAddress().toShortString()}
        <SmallButton action={() => copy()} label="Copy" />
        <SmallButton action={() => refetch()} label="Refresh" />
      </div>
      <p className="mt-16 text-gray-500 dark:text-gray-400 text-base text-left">Balance:</p>
      <div
        className={classNames(
          'mt-1 text-3xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl',
          'dark:text-white flex flex-col',
        )}
      >
        <div className="flex-none">
          {data?.toString()} {TOKEN_LIST[0].symbol}
        </div>
      </div>
      <PrimaryButton action={() => setModal(CurrentModal.SendTokens)} classes="w-full mt-24" label="Send" />
    </section>
  );
}
