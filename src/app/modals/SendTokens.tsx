import { useState } from 'react';
import { UserAccount } from '../model/UserAccount.js';
import { InfoDialog } from './InfoDialog.js';
import { TokenContract } from '../account/token.js';
import { AztecAddress } from '@aztec/aztec.js';

export interface SendTokensProps {
  account: UserAccount;
  tokenContract: TokenContract;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendTokens({ account, tokenContract, onClose, onSuccess }: SendTokensProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const sendTokens = async () => {
    setShowDialog(true);
    setMessage('Sending tokens...');
    if (isNaN(Number(amount))) {
      alert("Amount should be a number");
      return;
    }
    console.log(`Sending tokens from ${account.account.getAddress().toString()} to ${toAddress} amount: ${amount}`);
    const tx = tokenContract.methods.transfer_public(
      account.account.getAddress(),
      AztecAddress.fromString(toAddress),
      BigInt(amount),
      0)
      .send();
    const receipt = await tx.wait();
    console.log(`Sending tokens DONE. Status: ${receipt.status}`);
    setShowDialog(false);
    onSuccess();
  };

  return showDialog ? (<InfoDialog title={message}/>) : (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8 w-1/2">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          Send tokens
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">
            To (address)
          </label>
          <div className="mt-2">
            <input
              id="address"
              name="address"
              type="text"
              placeholder="0x2f45f498b7912c779dde8e3594622e36d7908088b09e99ab91caaafb40d1f9ef"
              className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              onChange={e => setToAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">
            Amount
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="amount"
              id="amount"
              placeholder="10"
              autoComplete="transaction-amount"
              className="min-w-0 w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              onChange={e => setAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="w-full mt-10 block font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">ETH</div>
        </div>
      </div>
      <div className="mt-16">
        <button
          onClick={() => sendTokens()}
          className="px-6 py-2  text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          {' '}
          Send{' '}
        </button>

        <button
          onClick={() => onClose()}
          className="px-6 py-2 ml-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          {' '}
          Cancel{' '}
        </button>
      </div>
    </section>
  );
}