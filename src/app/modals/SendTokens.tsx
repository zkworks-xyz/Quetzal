import { AztecAddress } from '@aztec/aztec.js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Input, Label } from '../components/Input.js';
import { PrimaryButton, SecondaryButton } from '../components/button.js';
import { useCurrentWallet } from '../context/current_wallet/useCurrentWallet.js';
import { Token } from '../model/token_aggregate.js';
import { InfoDialog } from './InfoDialog.js';

export interface SendTokensProps {
  token: Token;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendTokens({ token, onClose, onSuccess }: SendTokensProps) {
  const { currentWallet } = useCurrentWallet();
  const { wallet } = currentWallet!;
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const sendTokens = async () => {
    if (isNaN(Number(amount))) {
      alert('Amount should be a number');
      return;
    }
    const tx = token
      .contract!.methods.transfer_public(wallet.getAddress(), AztecAddress.fromString(toAddress), BigInt(amount), 0)
      .send();
    return tx.wait();
  };

  const mutation = useMutation({ mutationFn: sendTokens, onSuccess });
  if (mutation.isPending) {
    const from = wallet.getAddress().toShortString();
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
          <Label htmlFor="address">To (address)</Label>
          <Input
            id="address"
            placeholder="0x2f45f498b7912c779dde8e3594622e36d7908088b09e99ab91caaafb40d1f9ef"
            onChange={e => setToAddress(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" placeholder="10" onChange={e => setAmount(e.target.value)} />
        </div>

        <div className="sm:col-span-2">
          <div className="w-full mt-10 block font-medium leading-6 text-gray-500 dark:text-gray-400 text-left">
            {token.info.symbol}
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
