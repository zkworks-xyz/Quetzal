import { AztecAddress, CompleteAddress } from '@aztec/aztec.js';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { TokenContractArtifact } from '../../artifacts/Token.js';
import { pxe } from '../../config.js';
import { deployContract } from '../../scripts/deploy_contract.js';
import SelectWallet from '../components/select_wallet.js';
import Spinner from '../components/spinner.js';

interface DeveloperModeProps {
  onContractDeployed: (address: AztecAddress) => void;
}

export function DeveloperMode({ onContractDeployed }: DeveloperModeProps) {
  const [address, setAddress] = useState<CompleteAddress | null>(null);

  const deployExampleTokens = async () => {
    const args = { admin: { address: address?.address.toString() } };
    return deployContract(address!, TokenContractArtifact, args, pxe);
  };

  const mutation = useMutation({
    mutationFn: deployExampleTokens,
    onSuccess: (result: AztecAddress) => {
      onContractDeployed(result);
    },
  });

  return (
    <>
      <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-16">
        <div className="container flex flex-col items-center justify-center px-6 mx-auto">
          <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
            Quetzal is a wallet for Aztec
          </h1>

          <div className="flex items-center mt-6">
            <div className="flex items-center mx-2">
              <span className="mx-1 text-gray-800 dark:text-white">⚠️ Developer mode</span>
            </div>
          </div>

          <div className="w-full max-w-md mx-auto mt-6">
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">
              Aztec is a privacy focused Layer 2 for Ethereum, currently under development. Hence, for now, Quetzal is
              available in the developer mode only.
            </p>
            <ul className="list-disc px-8 pb-8 mt-6 text-gray-500 dark:text-gray-400 text-base text-left">
              <li>Before you proceed, make sure you have Aztec Sandbox installed and running.</li>
              <li>To deploy example tokens and start the wallet, click the Continue button below.</li>
            </ul>

            <p className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 text-left">
              Pick a admin wallet:
            </p>
            <SelectWallet onWalletChange={setAddress} />

            {mutation.isPending ? (
              <div className="py-3">
                <Spinner />
              </div>
            ) : (
              <button
                onClick={() => mutation.mutate()}
                className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
