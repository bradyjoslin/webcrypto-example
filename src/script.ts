const buff_to_base64 = (buff: Uint8Array) =>
  btoa(String.fromCharCode.apply(null, Array.from(buff)));

const base64_to_buf = (b64: string): Uint8Array =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const enc = new TextEncoder();
const dec = new TextDecoder();

async function encrypt(): Promise<void> {
  const data = (<HTMLInputElement>window.document.getElementById("data")).value;
  let encryptedDataOut = <HTMLInputElement>(
    window.document.getElementById("encryptedData")
  );
  const password = window.prompt("Password") || "";
  const encryptedData = await encryptData(data, password, 250000);
  encryptedDataOut.value = encryptedData;
}

async function decrypt(): Promise<void> {
  const password = window.prompt("Password") || "";
  const encryptedData = (<HTMLInputElement>(
    window.document.getElementById("encryptedData")
  )).value;
  let decryptedDataOut = <HTMLInputElement>(
    window.document.getElementById("decrypted")
  );
  const decryptedData = await decryptData(encryptedData, password);
  decryptedDataOut.value = decryptedData || "decryption failed!";
}

const getPasswordKey = (password: string) =>
  window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (
  passwordKey: CryptoKey,
  salt: Uint8Array,
  iterations: number,
  keyUsage: CryptoKey["usages"]
): PromiseLike<CryptoKey> =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

async function encryptData(
  secretData: string,
  password: string,
  iterations: number
): Promise<string> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, iterations, ["encrypt"]);
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      enc.encode(secretData)
    );

    const encryptedContentArr = new Uint8Array(encryptedContent);
    let iterationsArr = new Uint8Array(enc.encode(iterations.toString()));
    let buff = new Uint8Array(
      iterationsArr.byteLength +
        salt.byteLength +
        iv.byteLength +
        encryptedContentArr.byteLength
    );
    let bytes = 0;
    buff.set(iterationsArr, bytes);
    buff.set(salt, (bytes += iterationsArr.byteLength));
    buff.set(iv, (bytes += salt.byteLength));
    buff.set(encryptedContentArr, (bytes += iv.byteLength));
    const base64Buff = buff_to_base64(buff);
    return base64Buff;
  } catch (e) {
    console.log(`Error - ${e}`);
    throw Error();
  }
}

async function decryptData(
  encryptedData: string,
  password: string
): Promise<string> {
  try {
    const encryptedDataBuff = base64_to_buf(encryptedData);
    let bytes = 0;
    const iterations = Number(
      dec.decode(encryptedDataBuff.slice(bytes, (bytes += 6)))
    );
    const salt = new Uint8Array(encryptedDataBuff.slice(bytes, (bytes += 16)));
    const iv = new Uint8Array(encryptedDataBuff.slice(bytes, (bytes += 12)));
    const data = new Uint8Array(encryptedDataBuff.slice(bytes));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, iterations, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      data
    );
    return dec.decode(decryptedContent);
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
}
