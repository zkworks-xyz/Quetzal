import { useState } from 'react';
import { UserAccount } from '../model/UserAccount.js';
import { WaitCreating } from './WaitCreating.js';

export interface CreateAccountProps {
  onAccountCreated: (account: UserAccount) => void;
}

enum CreationStatus {
  NotStarted,
  Creating,
}

export function CreateAccount({ onAccountCreated }: CreateAccountProps) {
  const [userName, setUserName] = useState<string>('');
  const [status, setStatus] = useState<CreationStatus>(CreationStatus.NotStarted);
  const deployWallet = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus(CreationStatus.Creating);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onAccountCreated({ username: userName, address: '0x123' });
  };

  return status === CreationStatus.Creating ? (
    <WaitCreating />
  ) : (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          Create Account
        </h1>
        <div className="w-full max-w-md mx-auto mt-6">
          <p className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">
            Aztec is a privacy focused Layer 2 for Ethereum, currently under development. Hence, for now, Quetzal is
            available in the developer mode only.
          </p>
          <ul className="list-disc px-8 pb-8 mt-6 text-gray-500 dark:text-gray-400 text-base text-left">
            <li>Before you proceed, make sure you have Aztec Sandbox installed and running.</li>
            <li>To deploy example tokens and start the wallet, click the Continue button below.</li>
          </ul>
        </div>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={userName}
          onChange={e => setUserName(e.target.value)}
          className="min-w-0 w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Enter your email"
        />
        <button
          onClick={() => deployWallet()}
          className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Create wallet
        </button>
        Main
      </div>
    </section>
  );
}
