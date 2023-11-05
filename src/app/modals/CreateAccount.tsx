import { AccountManager, AccountWalletWithPrivateKey, GrumpkinScalar } from '@aztec/aztec.js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { getWebAuthnAccount } from '../account/webauthn_account_contract.js';
import { WebauthnSigner } from '../account/webauthn_signer.js';
import { useDeveloperMode } from '../context/developer_mode.js';
import { usePXE } from '../context/pxe.js';
import { UserAccount } from '../model/UserAccount.js';
import { InfoDialog } from './InfoDialog.js';

export interface CreateAccountProps {
  onAccountCreated: (account: UserAccount) => void;
}

const FAUCET_AMOUNT = 1234n;

export function CreateAccount({ onAccountCreated }: CreateAccountProps) {
  const [userName, setUserName] = useState<string>('');
  const { pxe } = usePXE();
  const { faucet } = useDeveloperMode();
  const amount: bigint = 1234n;

  const deployWallet = async () => {
    const encryptionPrivateKey1: GrumpkinScalar = GrumpkinScalar.random();
    const webAuthnAccount1: AccountManager = getWebAuthnAccount(
      pxe,
      encryptionPrivateKey1,
      new WebauthnSigner(userName),
    );
    return webAuthnAccount1.waitDeploy();
  };

  const mintTokens = async (account: AccountWalletWithPrivateKey) => {
    await faucet(account.getAddress(), FAUCET_AMOUNT);
    onAccountCreated({ username: userName, account });
  };

  const walletMutation = useMutation({
    mutationFn: deployWallet,
    onSuccess: account => {
      mintMutation.mutate(account);
    },
  });
  const mintMutation = useMutation({ mutationFn: mintTokens });

  if (mintMutation.isPending) {
    const to = mintMutation.variables.getAddress().toShortString();
    const message = `Minting ${amount} tokens to ${to}`;
    return <InfoDialog title="⏳ Minting tokens" message={message} />;
  } else if (mintMutation.isError) {
    return (
      <InfoDialog
        title="⚠️ Failed to mint tokens"
        primaryLabel="Try again"
        primaryAction={() => mintMutation.mutate(walletMutation.data!)}
      />
    );
  } else if (walletMutation.isPending) {
    return <InfoDialog title="⏳ Deploying account..." />;
  } else if (walletMutation.isError) {
    return (
      <InfoDialog
        title="⚠️ Failed to deploy account"
        message={walletMutation.error.message}
        primaryLabel="Try again"
        primaryAction={() => walletMutation.mutate()}
        secondaryLabel="Cancel"
        secondaryAction={() => walletMutation.reset()}
      />
    );
  }

  return (
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
          className="min-w-0 w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Enter your email"
        />
        <button
          onClick={() => walletMutation.mutate()}
          className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Create wallet
        </button>
      </div>
    </section>
  );
}
