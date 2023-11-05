import { useState } from 'react';
import { UserAccount } from '../model/UserAccount.js';
import { InfoDialog } from './InfoDialog.js';
import { TokenContract } from '../account/token.js';
import { AztecAddress } from '@aztec/aztec.js';
import { useMutation } from '@tanstack/react-query';
import { PrimaryButton, SecondaryButton } from '../components/button.js';
import { TOKEN_LIST } from '../model/token_list.js';

export interface SendTokensProps {
  account: UserAccount;
  tokenContract: TokenContract;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendTokens({ account, tokenContract, onClose, onSuccess }: SendTokensProps) {
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const sendTokens = async () => {
    if (isNaN(Number(amount))) {
      alert('Amount should be a number');
      return;
    }
    const tx = tokenContract.methods
      .transfer_public(account.account.getAddress(), AztecAddress.fromString(toAddress), BigInt(amount), 0)
      .send();
    return tx.wait();
  };

  const mutation = useMutation({ mutationFn: sendTokens, onSuccess });
  if (mutation.isPending) {
    const from = account.account.getAddress().toShortString();
    const to = AztecAddress.fromString(toAddress).toShortString();
    const message = `Sending tokens from ${from} to ${to} amount: ${amount}`;
    return <InfoDialog title="⏳ Sending tokens" message={message} />;
  }
  if (mutation.isError) {
    return (
      <InfoDialog
        title="⚠️ Error sending tokens"
        message={mutation.error.message}
        primaryLabel="Try again"
        primaryAction={() => mutation.mutate()}
        secondaryLabel="Cancel"
        secondaryAction={() => onClose()}
      />
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-8 w-1/2">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          Send tokens
        </h1>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-2 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label
            htmlFor="address"
            className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 text-left"
          >
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
          <label
            htmlFor="amount"
            className="block text-sm font-medium leading-6 text-gray-500 dark:text-gray-400 text-left"
          >
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
          <div className="w-full mt-10 block font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">
            {TOKEN_LIST[0].symbol}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full mt-6 space-x-2">
        <PrimaryButton label="Send" action={() => mutation.mutate()} />
        <SecondaryButton label="Cancel" action={() => onClose()} />
      </div>
    </section>
  );
}
