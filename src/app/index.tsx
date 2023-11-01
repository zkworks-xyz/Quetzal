import { Home } from './home.js';
import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PXEProvider } from './context/pxe.js';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PXEProvider>
        <Home />
      </PXEProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
