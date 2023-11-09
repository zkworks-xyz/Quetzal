const CLIENT_DATA_JSON_MAX_LEN = 255;

export class WebAuthnSignature {
  constructor(
    readonly authenticatorData: Uint8Array,
    readonly clientDataJson: Uint8Array,
    readonly signatureRaw: Uint8Array,
  ) {}

  toArray(): number[] {
    return [
      ...this.signatureRaw,
      ...this.authenticatorData,
      this.clientDataJson.length,
      ...this.clientDataJson,
      ...new Uint8Array(CLIENT_DATA_JSON_MAX_LEN - this.clientDataJson.length),
    ];
  }
}
