import {
  AccountManager,
  AztecAddress,
  ExtendedContractData,
  Fr,
  INITIAL_SANDBOX_ENCRYPTION_KEYS,
  INITIAL_SANDBOX_SALTS,
  INITIAL_SANDBOX_SIGNING_KEYS,
  PXE,
  getSchnorrAccount,
} from '@aztec/aztec.js';
import { ReactNode } from 'react';
import { TokenContract } from '../account/token.js';
import { usePXE } from './pxe.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { InfoDialog } from '../modals/InfoDialog.js';

function getSandboxAccounts(pxe: PXE): AccountManager[] {
  return INITIAL_SANDBOX_ENCRYPTION_KEYS.map((encryptionKey, i) =>
    getSchnorrAccount(pxe, encryptionKey, INITIAL_SANDBOX_SIGNING_KEYS[i], INITIAL_SANDBOX_SALTS[i]),
  );
}

const TOKEN_CONTRACT_ADDRESS = '0x2f45f498b7912c779dde8e3594622e36d7908088b09e99ab91caaafb40d1f9ef';

export function DeveloperModeProvider({ children }: { children: ReactNode }) {
  const { pxe } = usePXE();
  const adminAccount = getSandboxAccounts(pxe)[0];

  const fetchTokenContract = async (): Promise<ExtendedContractData | null> => {
    const adminWallet = await adminAccount.getWallet();
    const result =  await adminWallet.getExtendedContractData(AztecAddress.fromString(TOKEN_CONTRACT_ADDRESS));
    return result === undefined ? null : result;
  };

  const { data, isPending, isError, error, refetch } = useQuery<ExtendedContractData | null>({
    queryKey: ['extendedContractData'],
    queryFn: fetchTokenContract,
  });

  const deployExampleTokens = async () => {
    const adminWallet = await adminAccount.getWallet();
    return TokenContract.deploy(adminWallet, adminWallet.getAddress())
      .send({ contractAddressSalt: Fr.ZERO })
      .deployed();
  };

  const mutation = useMutation({
    mutationFn: deployExampleTokens,
    onSuccess: (data, variables, context) => {
      refetch();
    },
  });

  if (isError) {
    return <InfoDialog title="⚠️ Error fetching token contract" message={error.message} />;
  }

  if (isPending) {
    return <InfoDialog title="⏳ Fetching token contract" message="Please wait..." />;
  }

  return data ? (
    <>{children}</>
  ) : (
    <section className="bg-white dark:bg-gray-900 max-w-2xl rounded-lg px-8 py-16">
      <div className="container flex flex-col items-center justify-center px-6 mx-auto">
        <h1 className="mt-4 text-2xl font-semibold tracking-wide text-center text-gray-800 md:text-3xl dark:text-white">
          👷🏻 Developer mode
        </h1>
        <div className="w-full max-w-md mx-auto mt-6">
          <p className="mt-6 text-gray-500 dark:text-gray-400 text-base text-left">
            You are connected to Aztec Developer Sandbox. Before you can start wallet, deploy example tokens.
          </p>
        </div>

        <button
          onClick={() => mutation.mutate()}
          className="w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
        >
          Start developer mode
        </button>
      </div>
    </section>
  );
}
