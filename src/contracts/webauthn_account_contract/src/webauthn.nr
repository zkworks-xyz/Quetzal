use dep::std;

fn validate_webauthn_signature(
    authenticator_data: [u8; 37],
    client_data_json: [u8; 113],
    signature: [u8; 64],
    challenge: [u8; 22],
    pub_key_x: [u8; 32], 
    pub_key_y: [u8; 32]
) {
    let client_data_json_hash = std::hash::sha256(client_data_json);
    let concat = concatenate_arrays(authenticator_data, client_data_json_hash);
    let hashed_data = std::hash::sha256(concat);

    for i in 0..22 {
        assert(challenge[i] == client_data_json[36 + i]);
    }

    let valid_signature = std::ecdsa_secp256r1::verify_signature(pub_key_x, pub_key_y, signature, hashed_data);
    assert(valid_signature);
}

fn concatenate_arrays(a: [u8; 37], b: [u8; 32]) -> [u8; 69] {
    let mut result = [0; 69];
    for i in 0..37 {
        result[i] = a[i];
    }
    for i in 0..32 {
        result[i+37] = b[i];
    }
    result
}

#[test]
fn test_validate_webauthn_signature() {
    let pub_key_x = [217,158,130,168,129,233,155,46,25,115,250,18,101,64,172,14,234,228,92,113,112,232,221,19,123,57,111,86,220,35,132,246];
    let pub_key_y = [229,136,123,29,86,165,119,186,41,110,106,191,99,136,215,178,37,21,156,150,227,168,91,237,13,116,1,216,182,138,120,90];

    let challenge = [65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81];
    let authenticator_data = [73,150,13,229,136,14,140,104,116,52,23,15,100,118,96,91,143,228,174,185,162,134,50,199,153,92,243,186,131,29,151,99,5,0,0,0,0];
    let client_data_json = [123,34,116,121,112,101,34,58,34,119,101,98,97,117,116,104,110,46,103,101,116,34,44,34,99,104,97,108,108,101,110,103,101,34,58,34,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,34,44,34,111,114,105,103,105,110,34,58,34,104,116,116,112,58,47,47,108,111,99,97,108,104,111,115,116,58,53,49,55,51,34,44,34,99,114,111,115,115,79,114,105,103,105,110,34,58,102,97,108,115,101,125];
    let signature = [151,135,109,248,42,207,232,38,120,212,186,172,172,189,87,32,165,250,124,120,175,220,199,244,118,38,243,177,149,214,207,22,93,53,161,59,31,133,144,14,255,133,143,37,70,157,226,94,185,130,230,225,31,249,222,130,105,126,173,117,73,60,157,227];
    validate_webauthn_signature(authenticator_data, client_data_json, signature, challenge, pub_key_x, pub_key_y);
}
