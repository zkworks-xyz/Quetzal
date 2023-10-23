import {Button} from "@aztec/aztec-ui";
import * as React from "react";

import {decode} from "cbor-x";

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
        allowCredentials: [
            {type: "public-key", transports: ["internal"]},
            // ... more Credential IDs can be supplied.
        ],
        timeout: 60000,
        attestation: "direct",
    };

    // @ts-ignore
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

export default function WebAuthnRegister() {
    return (
        <Button text={'Create account'} onClick={register}/>
    );
}