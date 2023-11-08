import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { DeveloperModeProvider } from './context/developer_mode/DeveloperModeProvider.js';
import { PXEProvider } from './context/pxe/PxeProvider.js';
import { Home } from './home.js';
import './index.css';
import styles from './home.module.scss';
import { CurrentWalletProvider } from './context/current_wallet/CurrentWalletProvider.js';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold">Quetzal</h1>
        <PXEProvider>
          <DeveloperModeProvider>
            <CurrentWalletProvider>
              <Home />
            </CurrentWalletProvider>
          </DeveloperModeProvider>
        </PXEProvider>
      </main>
    </QueryClientProvider>
  </StrictMode>,
);
