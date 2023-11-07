import { AccountInterface, AccountWalletWithPrivateKey, GrumpkinScalar, PXE } from '@aztec/aztec.js';
import { WebAuthnAccountContract, getWebAuthnAccount } from '../app/account/webauthn_account_contract.js';
import {
  deserializeAccountWalletWithPrivateKey,
  deserializeCompleteAddress,
  serializeAccountWalletWithPrivateKey,
  serializeCompleteAddress,
} from '../app/context/current_account/serialization.js';
import { setupSandbox } from './utils.js';
import { WebAuthnInterfaceStub } from './webauthn_stub.js';

describe('AccountWalletWithPrivateKey serialization', () => {
  const encryptionPrivateKey = GrumpkinScalar.random();
  let pxe: PXE;
  let wallet: AccountWalletWithPrivateKey;
  let account: AccountInterface;

  beforeAll(async () => {
    pxe = await setupSandbox();
    const webAuthnAccount = getWebAuthnAccount(pxe, encryptionPrivateKey, new WebAuthnInterfaceStub());

    account = await webAuthnAccount.getAccount();
    wallet = new AccountWalletWithPrivateKey(pxe, account, encryptionPrivateKey);
  }, 60_000);

  it('CompleteAddress roundtrip', () => {
    const completeAddress = wallet.getCompleteAddress();
    const serialized = serializeCompleteAddress(completeAddress);
    const deserialized = deserializeCompleteAddress(serialized);
    expect(deserialized).toStrictEqual(completeAddress);
  });

  it('AccountWalletWithPrivateKey roundtrip', async () => {
    const serialized = serializeAccountWalletWithPrivateKey(wallet);
    const accountContract = new WebAuthnAccountContract(new WebAuthnInterfaceStub());
    const deserialized = await deserializeAccountWalletWithPrivateKey(pxe, accountContract, serialized);
    expect(deserialized.getCompleteAddress()).toStrictEqual(wallet.getCompleteAddress());
    expect(deserialized.getEncryptionPrivateKey()).toStrictEqual(wallet.getEncryptionPrivateKey());
  });
});
