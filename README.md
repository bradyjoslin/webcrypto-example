# Web Crypto Encryption Decryption Example

Demonstrates a way to encrypt and decrypt data using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). Creates an AES-GCM key derived from a password based key (PBKDF2) for encryption. The AES-GCM key is regenerated using the same password for decryption. The encrypted value is represented by a base64 string that includes the salt that was used when creating the password based key (PBKDF2), the initialization vector (iv) used for creating the AES key, and the encrypted content.

## Demo

[https://bradyjoslin.github.io/webcrypto-example/](https://bradyjoslin.github.io/webcrypto-example/)

## References

- [Ernie Turner: Dodging Web Crypto API Landmines | Web Rebels 2018](https://www.youtube.com/watch?v=lbt2_M1hZeg)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
