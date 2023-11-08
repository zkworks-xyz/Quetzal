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

export function serializeAccountWalletWithPrivateKey(wallet: AccountWalletWithPrivateKey): string {
  const completeAddress = wallet.getCompleteAddress();
  return JSON.stringify({
    completeAddress: {
      address: completeAddress.address.toString(),
      publicKey: completeAddress.publicKey.toString(),
      partialAddress: completeAddress.partialAddress.toString(),
    },
    encryptionPrivateKey: wallet.getEncryptionPrivateKey().toString(),
  });
}

export async function deserializeAccountWalletWithPrivateKey(
  serialized: string,
  pxe: PXE,
  authWitnessProvider: AuthWitnessProvider,
): Promise<AccountWalletWithPrivateKey> {
  function reviver(key: string, value: any) {
    if (key == 'completeAddress') {
      return new CompleteAddress(
        AztecAddress.fromString(value.address),
        Point.fromString(value.publicKey),
        Fr.fromString(value.partialAddress),
      );
    } else if (key == 'encryptionPrivateKey') {
      return GrumpkinScalar.fromString(value);
    } else if (key == '') {
      const account = new DefaultAccountInterface(authWitnessProvider, value.completeAddress, nodeInfo);
      return new AccountWalletWithPrivateKey(pxe, account, value.encryptionPrivateKey);
    }
    return value;
  }

  const nodeInfo = await pxe.getNodeInfo();
  return JSON.parse(serialized, reviver);
}
