use dep::aztec::types::type_serialization::TypeSerializationInterface;
use dep::safe_math::SafeU120;

global SAFE_U120_SERIALIZED_LEN: Field = 1;

// This is safe when reading from storage IF only correct safeu120 was written to storage
fn deserializeU120(fields: [Field; SAFE_U120_SERIALIZED_LEN]) -> SafeU120 {
    SafeU120{value: fields[0] as u120}
}

fn serializeU120(value: SafeU120) -> [Field; SAFE_U120_SERIALIZED_LEN] {
    [value.value as Field]
}

global SafeU120SerializationMethods = TypeSerializationInterface {
    deserialize: deserializeU120,
    serialize: serializeU120,
};

#[test]
fn test_serialize_roundtrip() {
    let cases = [0, 1, 2, 7, 2.pow_32(120) - 1];
    for i in 1..cases.len() {
        let serialized = serializeU120(SafeU120::new(cases[i]));
        let deserialized = deserializeU120(serialized);
        assert(deserialized.value == cases[i] as u120);
    }
}

#[test]
fn test_deserialize_overflow() {
    let deserialized = deserializeU120([2.pow_32(130)]);
    assert(deserialized.value == 0 as u120);
}
