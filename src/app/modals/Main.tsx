import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { useState } from 'react';
import { Alert } from '../components/alert/Alert.js';
import { AlertType } from '../components/alert/AlertType.js';
import { CloseButton, SmallButton } from '../components/button.js';
import { UserWallet } from '../context/current_wallet/UserWallet.js';
import { useCurrentWallet } from '../context/current_wallet/useCurrentWallet.js';
import { TokensRepository } from '../infra/tokens_repository.js';
import { Token, TokensAggregate } from '../model/token_aggregate.js';
import { formatBalance } from '../model/token_info.js';
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
  const [tokens, setTokens] = useState<TokensAggregate>(TokensRepository.getTokensAggregate());
  const [currentToken, setCurrentToken] = useState<Token | undefined>(undefined);
  const { clearCurrentWallet, currentWallet } = useCurrentWallet();

  const fetchContracts = async () => {
    const updatedTokens = await TokensRepository.enrichTokensWithContracts(tokens, currentWallet!.wallet);
    setTokens(updatedTokens);
    return updatedTokens;
  };

  useQuery({
    queryKey: ['tokenContracts'],
    queryFn: fetchContracts,
  });

  const fetchBalances = async () => {
    const updatedTokens = await TokensRepository.enrichTokensWithBalances(tokens, currentWallet!.wallet.getAddress());
    setTokens(updatedTokens);
    return updatedTokens;
  };

  const { isError, isPending, refetch } = useQuery({
    queryKey: ['balances'],
    queryFn: fetchBalances,
    enabled: tokens[0].contract !== undefined,
  });

  const copy = async () => {
    const value = account.wallet.getAddress().toString();
    await navigator.clipboard.writeText(value);
  };

  if (CurrentModal.SendTokens === modal) {
    return (
      <SendTokens
        token={currentToken!}
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
        {tokens.map(token => (
          <div className="flex items-center justify-between py-4" key={token.info.address.toString()}>
            <div className="flex-shrink-0">
              <img className="max-w-full h-8" src={token.info.logoURI} alt={token.info.symbol} />
            </div>
            <div className="flex-grow px-2">
              <p>
                {formatBalance(token.balance)} {token.info.symbol}
              </p>
            </div>
            <SmallButton
              action={() => {
                setCurrentToken(token);
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
