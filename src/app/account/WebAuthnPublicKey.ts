export class WebAuthnPublicKey {
  constructor(
    readonly x: Uint8Array,
    readonly y: Uint8Array,
  ) {}
}
