use dep::aztec::{
    note::{
        note_header::NoteHeader,
        note_interface::NoteInterface,
        utils::compute_unique_siloed_note_hash,
    },
    hash::pedersen_hash,
    oracle::{
        get_secret_key::get_secret_key,
        get_public_key::get_public_key,
    },
    log::emit_encrypted_log,
    context::PrivateContext,
};

global PUBLIC_KEY_NOTE_LEN: Field = 5;

// Stores a public key composed of two fields
// TODO: Do we need to include a nonce, in case we want to read/nullify/recreate with the same pubkey value?
struct PublicKeyNote {
    x: [u8; 32],
    y: [u8; 32],
    owner: Field, // We store the owner address only to get the secret key to compute the nullifier and to broadcast
    header: NoteHeader,
}

impl PublicKeyNote {
    pub fn new(x: [u8; 32], y: [u8; 32], owner: Field) -> Self {
        PublicKeyNote {
            x,
            y,
            owner,
            header: NoteHeader::empty(),
        }
    }

    // serialize the note as 5 fields where:
    // [0] = x[0..31] (upper bound excluded)
    // [1] = x[31]
    // [2] = y[0..31]
    // [3] = y[31]
    // [4] = owner
    pub fn serialize(self) -> [Field; PUBLIC_KEY_NOTE_LEN] {
        let mut x: Field = 0;
        let mut y: Field = 0;
        let mut mul: Field = 1;

        for i in 1..32 {
          let byte_x: Field = self.x[31 - i] as Field;
          x = x + (byte_x * mul);
          let byte_y: Field = self.y[31 - i] as Field;
          y = y + (byte_y * mul);
          mul *= 256;
        }

        let last_x = self.x[31] as Field;
        let last_y = self.y[31] as Field;
        
        let res: [Field; PUBLIC_KEY_NOTE_LEN] = [x, last_x, y, last_y, self.owner];
        res
    }

    pub fn compute_nullifier(self) -> Field {
        let unique_siloed_note_hash = compute_unique_siloed_note_hash(PublicKeyNoteMethods, self);
        let secret = get_secret_key(self.owner);
        // TODO(#1205) Should use a non-zero generator index.
        pedersen_hash([
            unique_siloed_note_hash,
            secret.low,
            secret.high,
        ],0)
    }

    pub fn set_header(&mut self, header: NoteHeader) {
        self.header = header;
    }

    // Broadcasts the note as an encrypted log on L1.
    pub fn broadcast(self, context: &mut PrivateContext, slot: Field) {
        let encryption_pub_key = get_public_key(self.owner);
        emit_encrypted_log(
            context,
            (*context).this_address(),
            slot,
            encryption_pub_key,
            self.serialize(),
        );
    }
}

fn deserialize(preimage: [Field; PUBLIC_KEY_NOTE_LEN]) -> PublicKeyNote {
    let mut x: [u8; 32] = [0;32];
    let mut y: [u8; 32] = [0;32];

    let part_x = preimage[0].to_be_bytes(32);
    for i in 0..31 { x[i] = part_x[i + 1]; }
    x[31] = preimage[1].to_be_bytes(32)[31];

    let part_y = preimage[2].to_be_bytes(32);
    for i in 0..31 { y[i] = part_y[i + 1]; }
    y[31] = preimage[3].to_be_bytes(32)[31];

    PublicKeyNote {
        x,
        y,
        owner: preimage[4],
        header: NoteHeader::empty(),
    }
}

fn serialize(note: PublicKeyNote) -> [Field; PUBLIC_KEY_NOTE_LEN] {
    note.serialize()
}

fn compute_note_hash(note: PublicKeyNote) -> Field {
    // TODO(#1205) Should use a non-zero generator index.
    pedersen_hash(note.serialize(),0)
}

fn compute_nullifier(note: PublicKeyNote) -> Field {
    note.compute_nullifier()
}

fn get_header(note: PublicKeyNote) -> NoteHeader {
    note.header
}

fn set_header(note: &mut PublicKeyNote, header: NoteHeader) {
    note.set_header(header);
}

// Broadcasts the note as an encrypted log on L1.
fn broadcast(context: &mut PrivateContext, slot: Field, note: PublicKeyNote) {
    note.broadcast(context, slot);
}

global PublicKeyNoteMethods = NoteInterface {
    deserialize,
    serialize,
    compute_note_hash,
    compute_nullifier,
    get_header,
    set_header,
    broadcast,
};
