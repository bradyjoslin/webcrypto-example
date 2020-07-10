# Web Crypto Encryption and Decryption Example

Demonstrates a way to encrypt and decrypt data using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), a low level cryptography API available in modern browsers and in the cloud with [Cloudflare Workers](https://developers.cloudflare.com/workers/reference/apis/web-crypto/).

This basic example encrypts and decrypts values in the browser. The AES-GCM encryption and decryption keys are derived from a password based key (PBKDF2). The encrypted output is written to and read from the DOM, but such a solution could be used to store encrypted values on a server or database.

## Logic Flow

An overview of the logical steps used for encryption and decryption in `script.js`.

**Encryption:**

1. Create a password based key (PBKDF2) that will be used to derive the AES-GCM key used for encryption / decryption.
1. Create an AES-GCM key using the PBKDF2 key and a randomized salt value.
1. Encrypt the input data using the AES-GCM key and a randomized initialization vector (iv).
1. The values used for the password, salt, iv for encryption are needed for decryption. Therefore, create a base64 string to be stored that includes the salt that was used when creating the password based key (PBKDF2), iv used for creating the AES key, and the encrypted content. The password should remain secret.

**Decryption:**

1. Derive the salt, iv, and encrypted data from the base64 string.
1. Create a password based key (PBKDF2) that will be used to derive the AES-GCM key used for encryption / decryption. Password must be the same used for encryption.
1. Create an AES-GCM key using the PBKDF2 key and the salt from the base64 string.
1. Decrypt the input data using the AES-GCM key and the iv from the base64 string.
1. Decode the decrypted value to a string.

## Demo

[https://bradyjoslin.github.io/webcrypto-example/](https://bradyjoslin.github.io/webcrypto-example/)

## References

- [Ernie Turner: Dodging Web Crypto API Landmines | Web Rebels 2018](https://www.youtube.com/watch?v=lbt2_M1hZeg)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
