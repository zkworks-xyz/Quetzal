import { NodeInfo, PXE, createPXEClient } from '@aztec/aztec.js';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext } from 'react';
import { InfoDialog } from '../../modals/InfoDialog.js';
import { useConfig } from '../config/useConfig.js';

export interface PXEInfo {
  pxe: PXE;
  nodeInfo: NodeInfo;
}

export const PXEContext = createContext<PXEInfo | null>(null);

export const PXEProvider = ({ children }: { children: ReactNode }) => {
  const { PXE_URL } = useConfig();
  const fetchPXE = async () => {
    const pxe = createPXEClient(PXE_URL);
    const nodeInfo = await pxe.getNodeInfo();
    return { pxe, nodeInfo };
  };
  const { data, isPending, isError, error, refetch } = useQuery<PXEInfo>({ queryKey: ['pxe'], queryFn: fetchPXE });

  if (isError) {
    return (
      <InfoDialog
        title="⚠️ Can't connect to Aztec network"
        message={error.message}
        primaryAction={refetch}
        primaryLabel="Retry"
      />
    );
  }
  if (isPending) {
    return <InfoDialog title="⏳ Connecting to Aztec network..." />;
  }
  return <PXEContext.Provider value={data}>{children}</PXEContext.Provider>;
};
