use dep::std;
use crate::utils::as_byte;

global MAX_LEN = 255;

fn base64_encode_url_safe_no_pad<N, M>(input: [u8; N], mut result: [u8; M]) -> [u8; M] {
    assert(base64_calculate_length(input) == M);

    let mut max_result = [0; MAX_LEN];
    let mut max_input = [0; MAX_LEN];
    for i in 0..input.len() {
        max_input[i] = input[i];
    }
    for i in 0..((N as u32) / 3 + 1) {
        let chunk = convert_chunk([max_input[i * 3], max_input[i * 3 + 1], max_input[i * 3 + 2]]);
        for j in 0..4 {
            max_result[i * 4 + j] = chunk[j];
        }
    }

    for i in 0..result.len() {
        result[i] = max_result[i];
    }
    result
}

fn base64_calculate_length<N>(input: [u8; N]) -> u32 {
    let input_suffix_len: u32 = (input.len() as u32) % 3;
    let mut base64_suffix_len = 0;
    if input_suffix_len == 1 {
        base64_suffix_len = 2;
    } else if input_suffix_len == 2 {
        base64_suffix_len = 3;
    }

    4 * (input.len() as u32 / 3) + base64_suffix_len
}

fn convert_chunk(input: [u8; 3]) -> [u8; 4] {
    let mut result = [0; 4];
    result[0] = (input[0] >> 2);
    result[1] = ((input[0] << 6) >> 2) + (input[1] >> 4);
    result[2] = ((input[1] << 4) >> 2) + (input[2] >> 6);
    result[3] = (input[2] << 2) >> 2;
    for i in 0..4 {
        result[i] = convert_base64_number(result[i]);
    }
    result
}

fn convert_base64_number(n: u8) -> u8 {
    let mut result: u8 = 0;
    if n >= 0 & n <= 25 {
        result = n + 65;
    } else if n >= 26 & n <= 51 {
        result = n + 71;
    } else if n >= 52 & n <= 61 {
        result = n - 4;
    } else if n == 62 {
        result = 45;
    } else if n == 63 {
        result = 95;
    }
    result
}

#[test]
fn test_convert_base64_number() {
    assert_eq(as_byte("A"), convert_base64_number(0));
    assert_eq(as_byte("Z"), convert_base64_number(25));
    assert_eq(as_byte("a"), convert_base64_number(26));
    assert_eq(as_byte("z"), convert_base64_number(51));
    assert_eq(as_byte("0"), convert_base64_number(52));
    assert_eq(as_byte("9"), convert_base64_number(61));
    assert_eq(as_byte("-"), convert_base64_number(62));
    assert_eq(as_byte("_"), convert_base64_number(63));
}

#[test]
fn test_base64_encode_url_safe_no_pad_simple() {
    assert_eq(base64_encode_url_safe_no_pad([], []), []);
    assert_eq(base64_encode_url_safe_no_pad([0], [0; 2]), "AA".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([25 << 2], [0; 2]), "ZA".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([26 << 2], [0; 2]), "aA".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([52 << 2], [0; 2]), "0A".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([62 << 2], [0; 2]), "-A".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([63 << 2], [0; 2]), "_A".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2], [0; 3]), "AQI".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2,3], [0; 4]), "AQID".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2,3,4], [0; 6]), "AQIDBA".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2,3,4,5], [0; 7]), "AQIDBAU".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2,3,4,5,6], [0; 8]), "AQIDBAUG".as_bytes());
    assert_eq(base64_encode_url_safe_no_pad([1,2,3,4,5,6,7, 27<<2, 53<<2, 62<<2], [0; 14]), "AQIDBAUGB2zU-A".as_bytes());
}

#[test]
fn test_base64_encode_url_safe_no_pad_32_bytes_input() {
    assert_eq(
        base64_encode_url_safe_no_pad([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32], [0; 43]), 
        "AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyA".as_bytes());

    assert_eq(
        base64_encode_url_safe_no_pad([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], [0; 43]),
        [65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69,66,65,81,69]        
    );

    assert_eq(
        base64_encode_url_safe_no_pad([9,208,128,166,213,134,85,203,32,252,64,17,161,20,104,49,251,160,62,253,81,254,233,91,8,240,184,150,220,73,189,86], [0; 43]),
        [67,100,67,65,112,116,87,71,86,99,115,103,95,69,65,82,111,82,82,111,77,102,117,103,80,118,49,82,95,117,108,98,67,80,67,52,108,116,120,74,118,86,89]
    );
}
