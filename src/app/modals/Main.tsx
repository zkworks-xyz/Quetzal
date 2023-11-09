import { TokenContract } from '@aztec/noir-contracts/types';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import { Alert } from '../components/alert/Alert.js';
import { AlertType } from '../components/alert/AlertType.js';
import { CloseButton, SmallButton } from '../components/button.js';
import { UserWallet } from '../context/current_wallet/UserWallet.js';
import { useCurrentWallet } from '../context/current_wallet/useCurrentWallet.js';
import { fetchTokenBalances, fetchTokenContracts } from '../infra/tokens.js';
import { BalanceMap, TOKEN_LIST, TokenContractMap, formatBalance, getTokenByAddress } from '../model/token_list.js';
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
  const [currentToken, setCurrentToken] = useState<TokenContract | undefined>(undefined);
  const [balances, setBalances] = useState<BalanceMap>(
    () => new Map(TOKEN_LIST.map(token => [token.address.toString(), 0n])),
  );
  const { clearCurrentWallet } = useCurrentWallet();

  const fetchContracts = async () => {
    const tokenContracts = await fetchTokenContracts(account.wallet);
    setTokenContracts(tokenContracts);
    return tokenContracts;
  };

  useQuery({
    queryKey: ['tokenContracts'],
    queryFn: fetchContracts,
  });

  const fetchBalances = async () => {
    const balances = await fetchTokenBalances(account.wallet.getAddress(), tokenContracts!.values());
    setBalances(balances);
    return balances;
  };

  const { isError, isPending, refetch } = useQuery({
    queryKey: ['balances'],
    queryFn: fetchBalances,
    enabled: tokenContracts !== null && tokenContracts.size > 0,
  });

  const copy = async () => {
    const value = account.wallet.getAddress().toString();
    await navigator.clipboard.writeText(value);
  };

  if (CurrentModal.SendTokens === modal) {
    return (
      <SendTokens
        tokenContract={currentToken!}
        tokenInfo={getTokenByAddress(currentToken!.address)!}
        onClose={() => setModal(CurrentModal.Main)}
        onSuccess={() => setModal(CurrentModal.Main)}
      />
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8 flex-auto flex-col">
      {isError && <Alert message="Error fetching balance" />}
      {isPending && <Alert message="Fetching balance" alertType={AlertType.info} />}
      <div className="flex flex-row-reverse">
        <CloseButton action={clearCurrentWallet} />
      </div>

      <div className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">Your address</div>
      <div className="items-center mt-1 text-gray-800 md:text-xl dark:text-white text-base text-left flex-row">
        {account.wallet.getAddress().toShortString()}
        <SmallButton action={() => copy()} label="Copy" classes="ml-4 self-center" />
        <SmallButton action={() => refetch()} label="Refresh" classes="ml-4 self-center" />
      </div>
      <p className="mt-16 text-gray-500 dark:text-gray-400 text-base text-left">Assets:</p>
      <div
        className={classNames(
          'mt-1 text-3xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl',
          'dark:text-white flex flex-col',
        )}
      >
        {TOKEN_LIST.map(tokenInfo => (
          <div className="flex items-center justify-between py-4" key={tokenInfo.address.toString()}>
            <div className="flex-shrink-0">
              <img className="max-w-full h-8" src={tokenInfo.logoURI} alt={tokenInfo.symbol} />
            </div>
            <div className="flex-grow px-2">
              <p>
                {formatBalance(balances.get(tokenInfo.address.toString()))} {tokenInfo.symbol}
              </p>
            </div>
            <SmallButton
              action={() => {
                setCurrentToken(
                  tokenContracts!.get(
                    tokenInfo.address.toString()
                    )!
                  );
                setModal(CurrentModal.SendTokens);
              }}
              classes="mx-0 self-center"
              label="Send"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
