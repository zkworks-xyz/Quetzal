import { PXE, createPXEClient, waitForSandbox } from '@aztec/aztec.js';
import React from 'react';
import { WaitDialog } from '../modals/WaitDialog.js';

export const PXEContext = React.createContext<PXE | null>(null);

export const PXEProvider = ({ children } : {children: React.ReactNode}) => {
    const [pxe, setPXE] = React.useState<PXE | null>(null);

    React.useEffect(() => {
        const init = async () => {
            const { PXE_URL = 'http://localhost:8081' } = process.env;
            const pxe = createPXEClient(PXE_URL);
            await waitForSandbox(pxe);
            setPXE(pxe);
        }
        init();
    }, []);


    return pxe ? (
        <PXEContext.Provider value={pxe}>
            {children}
        </PXEContext.Provider>
    ) : <WaitDialog message="Can't connect to PXE"/>;
}

export const usePXE = () => {
    const pxe = React.useContext(PXEContext);
    if (!pxe) {
        throw new Error('usePXE must be used within a PXEProvider');
    }
    return pxe;
}
