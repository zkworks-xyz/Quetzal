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
    const credentialRequestOptions = {
        publicKey: {
            timeout: 60000,
            allowCredentials: [],	 // see below
            challenge: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).buffer,
        }
    };

    const assertation: any = await navigator.credentials.get(
        credentialRequestOptions
    );

    const enc = new TextEncoder()
    console.log(assertation);
    console.log(`authenticatorData: ${enc.encode(assertation.response.authenticatorData)}`);
    console.log(`clientDataJSON: ${enc.encode(assertation.response.clientDataJSON)}`);
    const utf8Decoder = new TextDecoder('utf-8');
    const decodedClientData = utf8Decoder.decode(assertation.response.clientDataJSON)
    console.log(`clientDataJSON: ${decodedClientData}`);

    const hash = await crypto.subtle.digest('SHA-256', assertation.response.clientDataJSON);
    console.log(`hash: ${arrayBufferToString(hash)}`);

    const signedData = assertation.response.authenticatorData + hash;
    console.log(`signedData: ${enc.encode(signedData)}`)
    console.log(`signature: ${enc.encode(assertation.response.signature)}`)

    // TODO: check verifySignature(publicKey, signedData, signature)
    // https://noir-lang.org/standard_library/cryptographic_primitives/ecdsa_sig_verification#ecdsa_secp256r1verify_signature
};

function arrayBufferToString(buffer: ArrayBuffer) {
    return new Uint8Array(buffer).toString();
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
