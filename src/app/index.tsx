import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {QueryClient} from '@tanstack/react-query';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const register = async () => {
    const publicKeyCredentialCreationOptions: any = {
        rp: {
            name: "Quezal test",
        },
        user: {
            id: new Uint8Array(16),
            name: "test",
            displayName: "test",
        },
        challenge: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
        pubKeyCredParams: [{type: "public-key", alg: -7}],
        timeout: 60000,
        attestation: "direct",
    };

    const credential: any = await navigator.credentials.create({
        "publicKey": publicKeyCredentialCreationOptions
    });

    console.log(credential);

    // TODO:
    // 1. Extract (x, y) values from public key
    // 2. save user id => (x, y)
}

const login = async () => {

}

root.render(
    <React.StrictMode>
        {/*<QueryClientProvider client={queryClient}>*/}
        {/*    <Home/>*/}
        {/*</QueryClientProvider>*/}
        <div>
            <button type="button" onClick={register}>Register</button>
        </div>

        <div>
            <button type="button" onClick={login}>Login</button>
        </div>
    </React.StrictMode>,
);
