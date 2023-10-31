import { useEffect, useState } from 'react';
import { UserAccount } from '../model/UserAccount.js';
import { SendTokens } from './SentTokens.js';
import { setupSandbox } from "../account/utils.js";
import { AztecAddress, PXE } from "@aztec/aztec.js";
import { TokenContract } from "../account/token.js";

interface MainProps {
  account: UserAccount;
  tokenContract: TokenContract;
}

export function Main({ account, tokenContract }: MainProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<string | null>(null);
  const openSendTokens = () => {
    setShowModal(true);
  };

  const refresh = async () => {
    console.log('Check balance...');
    const balance = await tokenContract.methods.balance_of_public(account.account.getAddress()).view();
    console.log(`Check balance DONE. balance: ${balance.toString()}`);
    setBalance(balance.toString());
  };

  useEffect(() => {
    const fetchBalance = async () => {
      await refresh();
    };
    fetchBalance().catch(console.error);
  }, []);

  const copy = () => {
    const value = account.account.getAddress().toString();
    navigator.clipboard.writeText(value);
  };

  return showModal ? (
    <SendTokens account={account} tokenContract={tokenContract} onClose={() => setShowModal(false)} onSuccess={() => setShowModal(false)} />
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
        <button
          onClick={() => refresh()}
          className="px-3 py-1 ml-4 text-xs font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Refresh
        </button>
      </div>
      <p className="mt-16 text-gray-500 dark:text-gray-400 text-base text-left">Balance:</p>
      <div className="mt-1 text-3xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl dark:text-white flex flex-col">
        <div className="flex-none">{balance} aztecs</div>
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
