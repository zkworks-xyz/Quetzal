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