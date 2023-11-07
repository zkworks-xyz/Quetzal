import {
  AccountContract,
  AccountManager,
  AccountWalletWithPrivateKey,
  AztecAddress,
  CompleteAddress,
  Fr,
  GrumpkinScalar,
  PXE,
  Point,
} from '@aztec/aztec.js';

export function serializeCompleteAddress(completeAddress: CompleteAddress): string {
  return JSON.stringify({
    address: completeAddress.address.toString(),
    publicKey: completeAddress.publicKey.toString(),
    partialAddress: completeAddress.partialAddress.toString(),
  });
}

export function deserializeCompleteAddress(serialized: string): CompleteAddress {
  const data = JSON.parse(serialized);
  return new CompleteAddress(
    AztecAddress.fromString(data.address),
    Point.fromString(data.publicKey),
    Fr.fromString(data.partialAddress),
  );
}

export function serializeAccountWalletWithPrivateKey(wallet: AccountWalletWithPrivateKey): string {
  return JSON.stringify({
    completeAddress: serializeCompleteAddress(wallet.getCompleteAddress()),
    encryptionPrivateKey: wallet.getEncryptionPrivateKey().toString(),
  });
}

export async function deserializeAccountWalletWithPrivateKey(
  pxe: PXE,
  accountContract: AccountContract,
  serialized: string,
): Promise<AccountWalletWithPrivateKey> {
  const data = JSON.parse(serialized);
  const completeAddress = deserializeCompleteAddress(data.completeAddress);
  const manager = new AccountManager(pxe, data.encryptionPrivateKey, accountContract, completeAddress);
  const account = await manager.getAccount();
  return new AccountWalletWithPrivateKey(pxe, account, GrumpkinScalar.fromString(data.encryptionPrivateKey));
}
