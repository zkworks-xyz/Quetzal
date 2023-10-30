import {Button} from "@aztec/aztec-ui";
import * as React from "react";

export async function webAuthnLogin(
  challenge: Uint8Array = new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
) {
    const credentialRequestOptions = {
        publicKey: {
            timeout: 60000,
            allowCredentials: [],
            challenge: challenge,
        }
    };

    // @ts-ignore
    const assertation: any = await navigator.credentials.get(
        credentialRequestOptions
    );
    // @ts-ignore
    const challenge1 = toBase64url(challenge).replaceAll('=', '').split('').map((c) => c.charCodeAt(0));
    const authenticator_data = new Uint8Array((assertation.response.authenticatorData));
    const client_data_json = new Uint8Array((assertation.response.clientDataJSON));
    let signatureRaw = convertASN1toRaw(assertation.response.signature);
    return {challenge: challenge1, authenticator_data, client_data_json, signatureRaw};
}

const login = async () => {
    let {challenge, authenticator_data, client_data_json, signatureRaw} =
        await webAuthnLogin(new Uint8Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]));

    const challenge_str = `let challenge = [${challenge}];`;
    const client_data_json_str = `let client_data_json = [${client_data_json}];`;
    const authenticator_data_str = `let authenticator_data = [${authenticator_data}];`;
    const signature_str = `let signature = [${new Uint8Array(signatureRaw)}];`;

    console.log([challenge_str, authenticator_data_str, client_data_json_str, signature_str].join('\n'));
};

function toBase64url(buffer: ArrayBuffer): string {
    const txt: string = btoa(parseBuffer(buffer)); // base64
    // @ts-ignore
    return txt.replaceAll('+', '-').replaceAll('/', '_');
}

function parseBuffer(buffer: ArrayBuffer) {
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
    if (s[0] > 0x80) {
        // TODO if is greater than secp256r1n/2 we need to flip s := secp256r1n - s
        throw new Error('BAD SIGNATURE');
    }
    return new Uint8Array([...r, ...s]);
}

export default function WebAuthnLogin() {
    return (
        <Button text={'Sign transaction'} onClick={login}/>
    );
}
