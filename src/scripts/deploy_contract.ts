import { AztecAddress, CompleteAddress, DeployMethod, Fr } from '@aztec/aztec.js';
import { ContractArtifact } from '@aztec/foundation/abi';
import { PXE } from '@aztec/types';
import { convertArgs } from './util.js';

export async function deployContract(
  activeWallet: CompleteAddress,
  artifact: ContractArtifact,
  args: any,
  pxe: PXE,
  salt: Fr = Fr.random(),
): Promise<AztecAddress> {
  const functionAbi = artifact.functions.find(f => f.name === "constructor")!;
  const typedArgs: any[] = convertArgs(functionAbi, args);
  return await deployContractTypedArgs(activeWallet!, artifact, typedArgs, salt, pxe);
}


export async function deployContractTypedArgs(
  activeWallet: CompleteAddress,
  artifact: ContractArtifact,
  typedArgs: Fr[], // encode prior to passing in
  salt: Fr,
  pxe: PXE,
): Promise<AztecAddress> {
  const tx = new DeployMethod(activeWallet.publicKey, pxe, artifact, typedArgs).send({
    contractAddressSalt: salt,
  });
  await tx.wait();
  const receipt = await tx.getReceipt();
  if (receipt.contractAddress) {
    return receipt.contractAddress;
  } else {
    throw new Error(`Contract not deployed (${receipt.toJSON()})`);
  }
}
