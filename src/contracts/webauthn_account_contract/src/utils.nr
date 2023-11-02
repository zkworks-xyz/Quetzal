use dep::std;

fn convert_field_to_array(f: Field) -> [u8; 32] {
    let mut res = [0; 32];
    let slice = f.to_be_bytes(32);
    for i in 0..slice.len() {
        res[i] = slice[i];
    }
    res
}

fn convert_to_array_to_field(a: [u8; 32]) -> Field {
    let mut res: Field = 0;
    let mut multiplier = 1;
    for i in 0..32 {
        res = res + (a[31 - i] as Field) * multiplier;
        multiplier *= 256;
    }
    res
}

fn prefix_sha256_hash<N>(prefix_length: u8, input: [u8; N]) -> [u8; 32] {
    let mut result = [0; 32];
    assert([1, 2, 3].any(|x| x == prefix_length), "Length is not supported");
    if prefix_length == 1 {
        result = my_hash(input, [0; 1]);
    }
    if prefix_length == 2 {
        result = my_hash(input, [0; 2]);
    }
    if prefix_length == 3 {
        result = my_hash(input, [0; 3]);
    }
    result
}

fn my_hash<N, M>(input: [u8; N], mut hash_input: [u8; M]) -> [u8; 32] {
    for i in 0..M {
        hash_input[i] = input[i];
    }
    std::hash::sha256(hash_input)
}

#[test]
fn test_convert_field_to_array() {
    let max_field_value = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

    assert_eq([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,170], convert_field_to_array(16711850));
    assert_eq([48, 100, 78, 114, 225, 49, 160, 41, 184, 80, 69, 182, 129, 129, 88, 93, 40, 51, 232, 72, 121, 185, 112, 145, 67, 225, 245, 147, 240, 0, 0, 0], convert_field_to_array(max_field_value - 1));
    assert_eq([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ], convert_field_to_array(max_field_value));
}

#[test]
fn test_convert_array_to_field() {
    let max_field_value = 21888242871839275222246405745257275088548364400416034343698204186575808495617;

    assert_eq(16711850, convert_to_array_to_field([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,170]));
    assert_eq(max_field_value - 1, convert_to_array_to_field([48, 100, 78, 114, 225, 49, 160, 41, 184, 80, 69, 182, 129, 129, 88, 93, 40, 51, 232, 72, 121, 185, 112, 145, 67, 225, 245, 147, 240, 0, 0, 0]));
    assert_eq(max_field_value, convert_to_array_to_field([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]));
}

#[test]
fn test_f() {
    let input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert_eq(std::hash::sha256([1]), prefix_sha256_hash(1, input));
    assert_eq(std::hash::sha256([1, 2]), prefix_sha256_hash(2, input));
    assert_eq(std::hash::sha256([1, 2, 3]), prefix_sha256_hash(3, input));
}
