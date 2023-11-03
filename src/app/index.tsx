import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { DeveloperModeProvider } from './context/developer_mode.js';
import { PXEProvider } from './context/pxe.js';
import { Home } from './home.js';
import './index.css';
import styles from './home.module.scss';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold">Quetzal</h1>
        <PXEProvider>
          <DeveloperModeProvider>
            <Home />
          </DeveloperModeProvider>
        </PXEProvider>
      </main>
    </QueryClientProvider>
  </StrictMode>,
);
