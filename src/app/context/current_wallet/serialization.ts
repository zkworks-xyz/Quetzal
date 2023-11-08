import {
  AccountWalletWithPrivateKey,
  AuthWitnessProvider,
  AztecAddress,
  CompleteAddress,
  DefaultAccountInterface,
  Fr,
  GrumpkinScalar,
  NodeInfo,
  PXE,
  Point,
} from '@aztec/aztec.js';
import { UserWallet } from './UserWallet.js';

export function accountWalletWithPrivateKeyToObject(wallet: AccountWalletWithPrivateKey): object {
  const completeAddress = wallet.getCompleteAddress();
  return {
    completeAddress: {
      address: completeAddress.address.toString(),
      publicKey: completeAddress.publicKey.toString(),
      partialAddress: completeAddress.partialAddress.toString(),
    },
    encryptionPrivateKey: wallet.getEncryptionPrivateKey().toString(),
  };
}

const reviver =
  (pxe: PXE, authWitnessProvider: AuthWitnessProvider, nodeInfo: NodeInfo) => (key: string, value: any) => {
    if (key == 'completeAddress') {
      return new CompleteAddress(
        AztecAddress.fromString(value.address),
        Point.fromString(value.publicKey),
        Fr.fromString(value.partialAddress),
      );
    } else if (key == 'encryptionPrivateKey') {
      return GrumpkinScalar.fromString(value);
    } else if (key == 'wallet') {
      const account = new DefaultAccountInterface(authWitnessProvider, value.completeAddress, nodeInfo);
      return new AccountWalletWithPrivateKey(pxe, account, value.encryptionPrivateKey);
    }
    return value;
  };

export function serializeUserWallet(userWallet: UserWallet): string {
  return JSON.stringify({
    name: userWallet.name,
    wallet: accountWalletWithPrivateKeyToObject(userWallet.wallet),
  });
}

export async function deserializeUserWallet(
  json: string,
  pxe: PXE,
  authWitnessProvider: AuthWitnessProvider,
): Promise<UserWallet> {
  const userWallet = JSON.parse(json, reviver(pxe, authWitnessProvider, await pxe.getNodeInfo()));
  if (!userWallet.name) {
    throw new TypeError('Deserialization error: userWallet name is missing');
  }
  if (!(userWallet.wallet instanceof AccountWalletWithPrivateKey)) {
    throw new TypeError('Deserialization error: wallet name is missing');
  }
  return userWallet;
}
