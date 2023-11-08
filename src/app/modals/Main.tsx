import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import { Alert } from '../components/alert/Alert.js';
import { AlertType } from '../components/alert/AlertType.js';
import { PrimaryButton, SmallButton } from '../components/button.js';
import { UserWallet } from '../context/current_wallet/UserWallet.js';
import {
  BalanceMap,
  TOKEN_LIST,
  TokenContractMap,
  fetchTokenBalances,
  fetchTokenContracts,
  formatBalance,
} from '../model/token_list.js';
import { SendTokens } from './SendTokens.js';

interface MainProps {
  account: UserWallet;
}

enum CurrentModal {
  Main,
  SendTokens,
}

export function Main({ account }: MainProps) {
  const [modal, setModal] = useState<CurrentModal>(CurrentModal.Main);
  const [tokenContracts, setTokenContracts] = useState<TokenContractMap | null>(null);
  const [balances, setBalances] = useState<BalanceMap>(
    () => new Map(TOKEN_LIST.map(token => [token.address.toString(), 0n])),
  );

  const fetchContracts = async () => {
    const tokenContracts = await fetchTokenContracts(account.account);
    setTokenContracts(tokenContracts);
    return tokenContracts;
  };

  useQuery({
    queryKey: ['tokenContracts'],
    queryFn: fetchContracts,
  });

  const fetchBalances = async () => {
    const balances = await fetchTokenBalances(account.account.getAddress(), tokenContracts!.values());
    setBalances(balances);
    return balances;
  };

  const { isError, isPending, refetch } = useQuery({
    queryKey: ['balances'],
    queryFn: fetchBalances,
    enabled: tokenContracts !== null && tokenContracts.size > 0,
  });

  const copy = async () => {
    const value = account.account.getAddress().toString();
    await navigator.clipboard.writeText(value);
  };

  if (CurrentModal.SendTokens === modal) {
    return (
      <SendTokens
        account={account}
        tokenContract={tokenContracts!.values().next().value}
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
      <p className="mt-16 text-gray-500 dark:text-gray-400 text-base text-left">Assets:</p>
      <div
        className={classNames(
          'mt-1 text-3xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl',
          'dark:text-white flex flex-col',
        )}
      >
        {TOKEN_LIST.map(token => (
          <div className="flex items-center justify-between py-4" key={token.address.toString()}>
            <div className="flex-shrink-0">
              <img className="max-w-full h-8" src={token.logoURI} alt={token.symbol} />
            </div>
            <div className="flex-grow px-2">
              <p>
                {formatBalance(balances.get(token.address.toString()))} {token.symbol}
              </p>
            </div>
          </div>
        ))}
      </div>
      <PrimaryButton action={() => setModal(CurrentModal.SendTokens)} classes="w-full mt-24" label="Send" />
    </section>
  );
}
