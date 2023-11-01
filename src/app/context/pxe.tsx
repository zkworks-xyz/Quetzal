import { PXE, createPXEClient, waitForSandbox } from '@aztec/aztec.js';
import { useEffect, useState, createContext, ReactNode, useContext } from 'react';
import { WaitDialog } from '../modals/WaitDialog.js';
import { useConfig } from './config.js';

export const PXEContext = createContext<PXE | null>(null);

export const PXEProvider = ({ children }: { children: ReactNode }) => {
  const [pxe, setPXE] = useState<PXE | null>(null);
  const { PXE_URL } = useConfig();

  useEffect(() => {
    const init = async () => {
      const pxe = createPXEClient(PXE_URL);
      await waitForSandbox(pxe);
      setPXE(pxe);
    };
    init();
  }, []);

  return pxe ? (
    <PXEContext.Provider value={pxe}>{children}</PXEContext.Provider>
  ) : (
    <WaitDialog message="Can't connect to PXE" />
  );
};

export const usePXE = () => {
  const pxe = useContext(PXEContext);
  if (!pxe) {
    throw new Error('usePXE must be used within a PXEProvider');
  }
  return pxe;
};
