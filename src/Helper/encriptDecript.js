import CryptoJS from "crypto-js";

export async function getCachedPublicKey() {
  const key = localStorage.getItem("rsaPublicKey");
  const expiry = localStorage.getItem("rsaPublicKeyExpiry");

  console.log({key});

  console.log({expiry});

  const now = Date.now();
  if (key && expiry && now < parseInt(expiry)) {
    return key;
  }

  // If not found or expired, fetch new key
  const publicKeyPem = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/publicKey`
  ).then((res) => res.text());

  const expireTime = parseInt(import.meta.env.VITE_COOKIE_EXPIRE_TIME); // e.g. 7200000 ms

  localStorage.setItem("rsaPublicKey", publicKeyPem);
  localStorage.setItem("rsaPublicKeyExpiry", (now + expireTime).toString());

  return publicKeyPem;
}

export async function encryptHybrid(data) {
  // 1. Get from localStorage if available
  const publicKeyPem = await getCachedPublicKey();

  // 2. Generate AES key
  const aesKey = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

  // 3. Encrypt payload using AES
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    aesKey
  ).toString();

  // 5. Encrypt AES key using RSA public key
  const encryptedAESKey = await rsaEncryptAESKey(aesKey, publicKeyPem);

  return {
    ciphertext,
    encryptedAESKey,
  };
}

async function rsaEncryptAESKey(aesKey, publicKeyPem) {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(publicKeyPem),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    encoder.encode(aesKey)
  );

  return bufferToBase64(encrypted);
}

function pemToArrayBuffer(pem) {
  // Strictly extract base64 string
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/[\r\n]+/g, "")
    .replace(/\s+/g, "") // Remove any remaining whitespace
    .trim();

  const binaryDerString = atob(base64);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }
  return binaryDer.buffer;
}

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
