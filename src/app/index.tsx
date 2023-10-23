import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Home} from "./home.js";
import WebAuthnRegister from "./components/webauthn/register.js";
import WebAuthnLogin from "./components/webauthn/login.js";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Home/>
            <WebAuthnRegister/>
            <WebAuthnLogin/>
        </QueryClientProvider>
    </React.StrictMode>,
);
