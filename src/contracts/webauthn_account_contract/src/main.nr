mod public_key_note;
mod webauthn;
mod utils;

// Account contract that uses Schnorr signatures for authentication.
// The signing key is stored in an immutable private note and should be different from the encryption/nullifying key.
contract WebAuthnAccount {
    use dep::std;
    use dep::std::option::Option;

    use dep::aztec::{
        context::{PrivateContext, Context},
        note::{ note_header::NoteHeader, utils as note_utils },
        oracle::get_public_key::get_public_key,
        state_vars::immutable_singleton::ImmutableSingleton,
    };
    use dep::authwit:: {
        entrypoint::{ EntrypointPayload, ENTRYPOINT_PAYLOAD_SIZE },
        account::AccountActions,
        auth_witness::get_auth_witness,
    };
    use dep::aztec::log::{
        emit_unencrypted_log_from_private,
        emit_unencrypted_log,
    };

    use crate::public_key_note::{PublicKeyNote, PublicKeyNoteMethods, PUBLIC_KEY_NOTE_LEN};
    use crate::webauthn::validate_webauthn_signature;

    struct Storage {
        // docs:start:storage
        signing_public_key: ImmutableSingleton<PublicKeyNote, PUBLIC_KEY_NOTE_LEN>,
        // docs:end:storage
    }

    impl Storage {
        fn init(context: Context) -> pub Self {
            Storage {
                // docs:start:storage_init
                signing_public_key: ImmutableSingleton::new(context, 1, PublicKeyNoteMethods),
                // docs:end:storage_init
            }
        }
    }

    global ACCOUNT_ACTIONS_STORAGE_SLOT = 2;

    // Constructs the contract
    #[aztec(private)]
    fn constructor(
        signing_pub_key_x: pub [u8; 32],
        signing_pub_key_y: pub [u8; 32],
    ) {
        emit_unencrypted_log_from_private(&mut context, "constructor");
        let this = context.this_address();
        // docs:start:initialize
        let mut pub_key_note = PublicKeyNote::new(signing_pub_key_x, signing_pub_key_y, this);
        storage.signing_public_key.initialize(&mut pub_key_note, Option::none(), true);
        // docs:end:initialize
    }

    #[aztec(private)]
    fn entrypoint(payload: pub EntrypointPayload) {
        emit_unencrypted_log_from_private(&mut context, "entrypoint");
        let actions = AccountActions::private(&mut context, ACCOUNT_ACTIONS_STORAGE_SLOT, is_valid_impl);
        actions.entrypoint(payload);
    }

    #[aztec(private)]
    fn is_valid(message_hash: Field) -> Field {
        emit_unencrypted_log_from_private(&mut context, "is_valid");
        let actions = AccountActions::private(&mut context, ACCOUNT_ACTIONS_STORAGE_SLOT, is_valid_impl);
        actions.is_valid(message_hash)
    }

    #[aztec(public)]
    fn is_valid_public(message_hash: Field) -> Field {
        emit_unencrypted_log(&mut context, "is_valid_public");
        let actions = AccountActions::public(&mut context, ACCOUNT_ACTIONS_STORAGE_SLOT, is_valid_impl);
        actions.is_valid_public(message_hash)
    }

    #[aztec(public)]
    internal fn set_is_valid_storage(message_hash: Field, value: bool) {
        emit_unencrypted_log(&mut context, "set_is_valid_storage");
        let actions = AccountActions::public(&mut context, ACCOUNT_ACTIONS_STORAGE_SLOT, is_valid_impl);
        actions.internal_set_is_valid_storage(message_hash, value)
    }

    #[contract_library_method]
    fn is_valid_impl(context: &mut PrivateContext, message_hash: Field) -> pub bool {
        emit_unencrypted_log_from_private(context, "is_valid_impl");

        // Load public key from storage
        let storage = Storage::init(Context::private(context));

        let public_key = storage.signing_public_key.get_note();

        // Load auth witness
        let witness: [Field; WEBAUTHN_WITNESS_MAX_LEN] = get_auth_witness(message_hash);
        deserialize_and_validate_webauthn_witness(witness, message_hash, public_key.x, public_key.y);

        true
    }

    global SIGNATURE_LEN = 64;
    global AUTHENTICATOR_DATA_LEN = 37;
    global CHALLENGE_LEN = 43;
    global CLIENT_DATA_JSON_LEN = 114;
    global WEBAUTHN_WITNESS_MAX_LEN = 258; // SIGNATURE_LEN + AUTHENTICATOR_DATA_LEN + CHALLENGE_LEN + CLIENT_DATA_JSON_LEN

    fn deserialize_and_validate_webauthn_witness(witness: [Field; WEBAUTHN_WITNESS_MAX_LEN], challenge: Field, public_key_x: [u8; 32], public_key_y: [u8; 32]) {
        let mut signature: [u8; 64] = [0; 64];
        let mut authenticator_data: [u8; 37] = [0; 37];
        let mut challenge: [u8; CHALLENGE_LEN] = [0; CHALLENGE_LEN];
        let mut client_data_json: [u8; CLIENT_DATA_JSON_LEN] = [0; CLIENT_DATA_JSON_LEN];

        for i in 0..SIGNATURE_LEN {
            signature[i] = witness[i] as u8;
        }
        for i in 0..AUTHENTICATOR_DATA_LEN {
            authenticator_data[i] = witness[i + SIGNATURE_LEN] as u8;
        }
        for i in 0..CHALLENGE_LEN {
            // TODO use challenge from params
            challenge[i] = witness[i + (SIGNATURE_LEN + AUTHENTICATOR_DATA_LEN)] as u8;
        }
        for i in 0..CLIENT_DATA_JSON_LEN {
            client_data_json[i] = witness[i + (SIGNATURE_LEN + AUTHENTICATOR_DATA_LEN + CHALLENGE_LEN)] as u8;
        }
        validate_webauthn_signature(authenticator_data, client_data_json, signature, challenge, public_key_x, public_key_y);
    }

    // Computes notes hash and nullifier.
    // Note 1: Needs to be defined by every contract producing logs.
    // Note 2: Having it in all the contracts gives us the ability to compute the note hash and nullifier differently for different kind of notes.
    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, preimage: [Field; PUBLIC_KEY_NOTE_LEN]) -> [Field; 4] {
        assert(storage_slot == 1);
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(PublicKeyNoteMethods, note_header, preimage)
    }
}
