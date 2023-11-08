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
import {
  deserializeAccountWalletWithPrivateKey,
  serializeAccountWalletWithPrivateKey,
} from '../app/context/current_account/serialization.js';

const TEST_ADDRESS = AztecAddress.fromString('0x1eb060c038bf73cb4e070e44e88a319a8f75bcee2b0d326966b3594c88f9f160');
const TEST_PUBLIC_KEY = new Point(
  new Fr(14753298674887310801998089404254958140363103082942238233403745418111498325964n),
  new Fr(4756837637600385606455388659519220960665685238537319498283378634552802022905n),
);
const TEST_PARTIAL_ADDRESS = new Fr(6349771019136114247461010303772709108805550710281971556137359982371867675906n);
const TEST_COMPLETE_ADDRESS = new CompleteAddress(TEST_ADDRESS, TEST_PUBLIC_KEY, TEST_PARTIAL_ADDRESS);

const TEST_ENCRYPTION_PRIVATE_KEY = new GrumpkinScalar(
  18379267687739255569405876019247933532445267054176851471598688189245092777366n,
);

const TEST_WEB_AUTH_WITNESS_PROVIDER = {} as AuthWitnessProvider;

const NODE_INFO: NodeInfo = {} as NodeInfo;

const TEST_ACCOUNT = new DefaultAccountInterface(TEST_WEB_AUTH_WITNESS_PROVIDER, TEST_COMPLETE_ADDRESS, NODE_INFO);

describe('AccountWalletWithPrivateKey', () => {
  let pxe: PXE;
  let wallet: AccountWalletWithPrivateKey;

  beforeAll(async () => {
    pxe = {
      getNodeInfo: () => {
        return NODE_INFO;
      },
    } as any;
    wallet = new AccountWalletWithPrivateKey(pxe, TEST_ACCOUNT, TEST_ENCRYPTION_PRIVATE_KEY);
  }, 60_000);

  it('roundtrip', async () => {
    const serialized = serializeAccountWalletWithPrivateKey(wallet);
    const deserialized = await deserializeAccountWalletWithPrivateKey(serialized, pxe, TEST_WEB_AUTH_WITNESS_PROVIDER);
    expect(deserialized.getCompleteAddress()).toStrictEqual(wallet.getCompleteAddress());
    expect(deserialized.getEncryptionPrivateKey()).toStrictEqual(wallet.getEncryptionPrivateKey());
  });

  it('deserialize with missing field', async () => {
    const serialized = '{"encryptionPrivateKey":"0x28a24bff8661d4b203c0b16327ebad7bccc31718a49dcedb4a288aa3b2f7cd96"}';
    await expect(
      async () => await deserializeAccountWalletWithPrivateKey(serialized, pxe, TEST_WEB_AUTH_WITNESS_PROVIDER),
    ).rejects.toThrow(TypeError);
  });
});
