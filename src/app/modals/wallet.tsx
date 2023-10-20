import { useState } from 'react';
import SelectWallet from '../components/select_wallet.js';
import { CompleteAddress } from '@aztec/aztec.js';
import { classNames } from '../utils.js';

export function Wallet() {
  const [address, setAddress] = useState<CompleteAddress | null>(null);
  return (
    <>
      <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-16">
        <p className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 text-left">Wallets:</p>

        <SelectWallet onWalletChange={setAddress} />

        <div className="container flex flex-col items-left justify-center px-6 mx-auto">
          <div className="flex flex-col items-left mt-6 mx-2">
            <h1 className="mt-4 text-2xl font-semibold tracking-wide text-left text-gray-800 md:text-3xl dark:text-white">
              Balance
            </h1>

            <div className="mx-1 text-gray-800 text-left dark:text-white">
              🤨 100 eth <span className="dark:text-gray-400 text-base text-left">public</span>
            </div>

            <div className="mx-1 text-gray-800 text-left dark:text-white">
              😎 20 eth <span className="dark:text-gray-400 text-base text-left">private</span>
            </div>
          </div>
          <Example />

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

const statuses: { [id: string]: string } = {
  Public: 'text-green-400 bg-green-400/10',
  Shielded: 'text-blue-400 bg-rose-400/10',
};

const activityItems = [
  {
    user: {
      name: 'ETH',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    },
    commit: '10',
    branch: 'main',
    status: 'Public',
  },
  {
    user: {
      name: 'ETH',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    },
    commit: '0',
    branch: 'main',
    status: 'Shielded',
  },
  {
    user: {
      name: 'DAI',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    },
    commit: '1',
    branch: 'main',
    status: 'Public',
  },
  {
    user: {
      name: 'DAI',
      imageUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    },
    commit: '123.223',
    branch: 'main',
    status: 'Shielded',
  },
];

export default function Example() {
  return (
    <div className="bg-gray-900">
      <h2 className="px-4 text-base font-semibold text-white">Balance</h2>
      <table className="mt-2 w-full whitespace-nowrap text-left">
        <colgroup>
          <col className="w-full sm:w-8/12" />
          <col className="lg:w-4/12" />
        </colgroup>
        <tbody className="divide-y divide-white/5">
          {activityItems.map(item => (
            <tr key={item.commit}>
              <td className="py-4 pl-4 pr-4">
                <div className="flex items-center gap-x-4">
                  <img src={item.user.imageUrl} alt="" className="h-8 w-8 rounded-full bg-gray-800" />
                  <span className="text-sm font-medium text-white">{item.commit}</span>
                  <span className="font-mono text-sm text-gray-400">{item.user.name}</span>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm sm:pr-8 ">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  <div className={classNames(statuses[item.status], 'flex-none rounded-full p-1')}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <div className="rounded-md bg-gray-700/40 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-white/10">
                    {item.status}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
