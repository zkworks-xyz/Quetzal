import { useState } from 'react';
import { UserAccount } from '../model/UserAccount.js';
import { SendTokens } from './SentTokens.js';

interface MainProps {
  account: UserAccount;
}

export function Main({ account }: MainProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const openSendTokens = () => {
    setShowModal(true);
  };

  const refresh = () => {};

  const copy = () => {
    const value = account.account.getAddress().toString();
    navigator.clipboard.writeText(value);
  };

  return showModal ? (
    <SendTokens account={account} onClose={() => setShowModal(false)} />
  ) : (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8 flex-auto flex-col">
      <div className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">Your address</div>
      <div className="mt-1 text-gray-800 md:text-xl dark:text-white text-base text-left flex-col">
        {account.account.getAddress().toShortString()}
        <button
          onClick={() => copy()}
          className="px-3 py-1 ml-4 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Copy{' '}
        </button>
      </div>
      <p className="mt-16 text-gray-500 dark:text-gray-400 text-base text-left">Balance:</p>
      <div className="mt-1 text-3xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl dark:text-white flex flex-col">
        <div className="flex-none">1000 aztecs</div>
      </div>
      <button
        onClick={() => openSendTokens()}
        className="w-full px-6 py-2 mt-24 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
      >
        {' '}
        Send{' '}
      </button>
    </section>
  );
}
