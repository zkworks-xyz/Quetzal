import './index.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {QueryClient} from '@tanstack/react-query';
import {decode} from 'cbor-x';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const register = async () => {
    const publicKeyCredentialCreationOptions: any = {
        rp: {
            name: "Quezal smart contract",
        },
        user: {
            id: new Uint8Array(16),
            name: "test@zkworks.xyz",
            displayName: "Test",
        },
        challenge: new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]).buffer,
        pubKeyCredParams: [{type: "public-key", alg: -7}],
        timeout: 60000,
        attestation: "direct",
    };

    const credential: any = await navigator.credentials.create({
        "publicKey": publicKeyCredentialCreationOptions
    });

    const decodedAttestationObj = decode(new Uint8Array(credential.response.attestationObject));
    const {authData} = decodedAttestationObj;
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);
    idLenBytes.forEach((value: any, index: any) => dataView.setUint8(index, value));
    // @ts-ignore
    const credentialIdLength = dataView.getUint16();
    const publicKeyBytes = authData.slice(55 + credentialIdLength);
    const publicKeyObject = decode(new Uint8Array(publicKeyBytes.buffer));
    const x = publicKeyObject[-2];
    const y = publicKeyObject[-3];
    const pub_key_x_str = `pub_key_x = [${x}]`;
    const pub_key_y_str = `pub_key_y = [${y}]`;
    const noir_parameters = [pub_key_x_str, pub_key_y_str].join('\n');
    console.log(noir_parameters);
}

const login = async () => {
    let challenge = new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]).buffer;
    const credentialRequestOptions = {
        publicKey: {
            timeout: 60000,
            allowCredentials: [],
            challenge: challenge,
        }
    };

    const assertation: any = await navigator.credentials.get(
        credentialRequestOptions
    );
    const challenge_str = `challenge = [${toBase64url(challenge).replaceAll('=', '').split('').map((c) => c.charCodeAt(0))}}]`;
    const authenticator_data_str = `authenticator_data = [${new Uint8Array((assertation.response.authenticatorData))}]`;
    const client_data_json_str = `client_data_json = [${new Uint8Array((assertation.response.clientDataJSON))}]`;
    let signatureRaw = convertASN1toRaw(assertation.response.signature);
    const signature_str = `signature = [${new Uint8Array(signatureRaw)}]`;

    console.log([challenge_str, authenticator_data_str, client_data_json_str, signature_str].join('\n'));
};

function arrayBufferToString(buffer: ArrayBuffer) {
    return new Uint8Array(buffer).toString();
}

export function toBase64url(buffer: ArrayBuffer) {
    const txt = btoa(parseBuffer(buffer)); // base64
    return txt.replaceAll('+', '-').replaceAll('/', '_');
}

export function parseBuffer(buffer: ArrayBuffer) {
    return String.fromCharCode(...new Uint8Array(buffer));
}

function convertASN1toRaw(signatureBuffer: ArrayBuffer) {
    // Convert signature from ASN.1 sequence to "raw" format
    const usignature = new Uint8Array(signatureBuffer);
    const rStart = usignature[4] === 0 ? 5 : 4;
    const rEnd = rStart + 32;
    const sStart = usignature[rEnd + 2] === 0 ? rEnd + 3 : rEnd + 2;
    const r = usignature.slice(rStart, rEnd);
    const s = usignature.slice(sStart);
    return new Uint8Array([...r, ...s]);
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
