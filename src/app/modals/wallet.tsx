import { useState } from 'react';
import SelectWallet from '../components/select_wallet.js';
import { CompleteAddress } from '@aztec/aztec.js';
import { classNames } from '../utils.js';
import Toggle from '../components/toggle.js';

const balances = [
  {
    token: {
      name: 'ETH',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    },
    balance: '10',
  },
  {
    token: {
      name: 'ETH',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    },
    balance: '0',
  },
  {
    token: {
      name: 'DAI',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    },
    balance: '1',
  },
  {
    token: {
      name: 'DAI',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    },
    balance: '123.223',
  },
];

export function Wallet() {
  const [address, setAddress] = useState<CompleteAddress | null>(null);
  return (
    <>
      <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8">
        <p className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 text-left">Wallets:</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <SelectWallet onWalletChange={setAddress} />
          </div>
          <div className="pl-4 flex flex-row items-center">
            <span className="pr-2"> 🕵️ </span>
            <Toggle />
          </div>
        </div>
        <div className="container flex flex-col items-left justify-center px-6 mx-auto">
          <div className="bg-gray-900">
            <h2 className="px-4 text-xxl pt-8 pb-2 font-semibold text-white">Balance</h2>
            {balances.map(item => (
              <div className="flex items-center gap-x-1 justify-left py-2 pl-2 pr-2">
                <img src={item.token.imageUrl} alt="" className="h-8 w-8 rounded-full bg-gray-800" />
                <span className="font-bold text-xl text-white pl-2">{item.balance}</span>
                <span className="text-lg text-gray-400">{item.token.name}</span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-md mx-auto mt-6">
            <button className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Send
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
