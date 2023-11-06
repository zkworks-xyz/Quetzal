import { useContext } from 'react';
import { PXEContext } from './PxeProvider.js';

export const usePXE = () => {
  const pxeInfo = useContext(PXEContext);
  if (!pxeInfo) {
    throw new Error('usePXE must be used within a PXEProvider');
  }
  return pxeInfo;
};
