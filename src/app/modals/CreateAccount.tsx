import { AccountManager, AccountWalletWithPrivateKey, GrumpkinScalar } from '@aztec/aztec.js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { getWebAuthnAccount } from '../infra/aztec/webauthn_account_contract.js';
import { WebAuthnSigner } from '../infra/webauthn/webauthn_signer.js';
import { useDeveloperMode } from '../context/developer_mode/useDeveloperMode.js';
import { usePXE } from '../context/pxe/usePxe.js';
import { UserWallet } from '../context/current_wallet/UserWallet.js';
import { InfoDialog } from './InfoDialog.js';
import { PrimaryButton } from '../components/button.js';
import { Input } from '../components/Input.js';

export interface CreateAccountProps {
  onAccountCreated: (account: UserWallet) => void;
}

export function CreateAccount({ onAccountCreated }: CreateAccountProps) {
  const [name, setName] = useState<string>('');
  const { pxe } = usePXE();
  const { faucet } = useDeveloperMode();

  const deployWallet = async () => {
    const encryptionPrivateKey1: GrumpkinScalar = GrumpkinScalar.random();
    const webAuthnAccount1: AccountManager = getWebAuthnAccount(pxe, encryptionPrivateKey1, new WebAuthnSigner(name));
    return webAuthnAccount1.waitDeploy();
  };

  const mintTokens = async (wallet: AccountWalletWithPrivateKey) => {
    await faucet(wallet.getAddress());
    onAccountCreated({ name, wallet });
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
    const message = `Minting test tokens to ${to}`;
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
        <Input id="email-address" placeholder="Enter account name" onChange={e => setName(e.target.value)} />
        <PrimaryButton classes="w-full py-3" label="Create wallet" action={() => walletMutation.mutate()} />
      </div>
    </section>
  );
}
