import {
  AccountWalletWithPrivateKey,
  AuthWitnessProvider,
  AztecAddress,
  CompleteAddress,
  DefaultAccountInterface,
  Fr,
  GrumpkinScalar,
  PXE,
  Point,
} from '@aztec/aztec.js';
import { WebAuthnWitnessProvider } from './aztec/webauthn_account_contract.js';
import { WebauthnSigner } from './webauthn/webauthn_signer.js';
import { UserWallet } from '../context/current_wallet/UserWallet.js';

export function serializeUserWallet(userWallet: UserWallet): string {
  const { wallet } = userWallet;
  const completeAddress = wallet.getCompleteAddress();

  return JSON.stringify({
    name: userWallet.name,
    wallet: {
      completeAddress: {
        address: completeAddress.address.toString(),
        publicKey: completeAddress.publicKey.toString(),
        partialAddress: completeAddress.partialAddress.toString(),
      },
      encryptionPrivateKey: wallet.getEncryptionPrivateKey().toString(),
    },
  });
}

export async function deserializeUserWallet(
  json: string,
  pxe: PXE,
  authWitnessProvider: AuthWitnessProvider | undefined = undefined,
): Promise<UserWallet> {
  const nodeInfo = await pxe.getNodeInfo();
  if (authWitnessProvider == null) {
    authWitnessProvider = new WebAuthnWitnessProvider(new WebauthnSigner('shouldNotUse'));
  }

  function reviver(key: string, value: any) {
    if (key == 'completeAddress') {
      return new CompleteAddress(
        AztecAddress.fromString(value.address),
        Point.fromString(value.publicKey),
        Fr.fromString(value.partialAddress),
      );
    } else if (key == 'encryptionPrivateKey') {
      return GrumpkinScalar.fromString(value);
    } else if (key == 'wallet') {
      const account = new DefaultAccountInterface(authWitnessProvider!, value.completeAddress, nodeInfo);
      return new AccountWalletWithPrivateKey(pxe, account, value.encryptionPrivateKey);
    }
    return value;
  }

  const userWallet = JSON.parse(json, reviver);
  if (!userWallet.name) {
    throw new TypeError('Deserialization error: userWallet name is missing');
  }
  if (!(userWallet.wallet instanceof AccountWalletWithPrivateKey)) {
    throw new TypeError('Deserialization error: wallet name is missing');
  }
  return userWallet;
}
