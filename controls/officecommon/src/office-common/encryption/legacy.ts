/**
 * Backward-compatible surface of the former Agile-only `encryption` module.
 *
 * @remarks
 * Every function here is a thin adapter over the single engine in `aes.ts`,
 * `hash.ts`, `cfb.ts` and `office-crypto.ts`; no cryptography is implemented here.
 * New code should use `decryptPackage` / `encryptPackage` instead.
 *
 * @packageDocumentation
 */

import { AesCipher } from './aes';
import { isCfb } from './cfb';
import { DecryptSecurityLimits, DEFAULT_DECRYPT_SECURITY_LIMITS, resolveDecryptLimits, UnsupportedEncryptionError } from './errors';
import { computeHash, computeHmac, hashSize, HashAlgorithm } from './hash';
import { decryptPackage } from './office-crypto';

/** Hash algorithm names accepted by the legacy helpers. */
export type AgileHashName = 'SHA-1' | 'SHA1' | 'SHA256' | 'SHA384' | 'SHA512';

/** Block key for the verifier-input key ([MS-OFFCRYPTO] §2.3.4.13). */
export const BLOCK_KEY_VERIFIER_INPUT: Uint8Array = Uint8Array.of(0xfe, 0xa7, 0xd2, 0x76, 0x3b, 0x4b, 0x9e, 0x79);
/** Block key for the verifier-hash key. */
export const BLOCK_KEY_VERIFIER_HASH: Uint8Array = Uint8Array.of(0xd7, 0xaa, 0x0f, 0x6d, 0x30, 0x61, 0x34, 0x4e);
/** Block key for the encrypted-key value. */
export const BLOCK_KEY_ENCRYPTOR_KEY: Uint8Array = Uint8Array.of(0x14, 0x6e, 0x0b, 0xe7, 0xab, 0xac, 0xd0, 0xd6);
/** Block key for the HMAC key. */
export const BLOCK_KEY_HMAC_KEY: Uint8Array = Uint8Array.of(0x5f, 0xb2, 0xad, 0x01, 0x0c, 0xb9, 0xe1, 0xf6);
/** Block key for the HMAC value. */
export const BLOCK_KEY_HMAC_VALUE: Uint8Array = Uint8Array.of(0xa0, 0x67, 0x7f, 0x02, 0xb2, 0x2c, 0x84, 0x33);
/** EncryptedPackage segment size in bytes. */
export const ENCRYPTED_PACKAGE_SEGMENT_SIZE: number = 4096;
/** Name of the EncryptionInfo CFB stream. */
export const STREAM_ENCRYPTION_INFO: string = 'EncryptionInfo';
/** Name of the EncryptedPackage CFB stream. */
export const STREAM_ENCRYPTED_PACKAGE: string = 'EncryptedPackage';
/** Agile EncryptionInfo major version. */
export const AGILE_VERSION_MAJOR: number = 4;
/** Agile EncryptionInfo minor version. */
export const AGILE_VERSION_MINOR: number = 4;
/** Agile EncryptionInfo reserved flags. */
export const AGILE_RESERVED: number = 0x40;
/** Agile EncryptionInfo XML namespace. */
export const AGILE_ENCRYPTION_NS: string = 'http://schemas.microsoft.com/office/2006/encryption';
/** Password key-encryptor URI. */
export const PASSWORD_KEY_ENCRYPTOR_URI: string = 'http://schemas.microsoft.com/office/2006/keyEncryptor/password';
/** Password key-encryptor namespace. */
export const PASSWORD_KEY_ENCRYPTOR_NS: string = 'http://schemas.microsoft.com/office/2006/keyEncryptor/password';

function engineHash(name: AgileHashName): HashAlgorithm {
    return name === 'SHA-1' ? 'SHA1' : name;
}

/**
 * Returns whether `input` begins with the OLE compound-file signature.
 *
 * @param {Uint8Array | ArrayBuffer} input - Entire package bytes.
 * @returns {boolean} `true` when the CFB signature matches.
 * @public
 */
export function isOffCryptoPackage(input: Uint8Array | ArrayBuffer): boolean {
    return isCfb(input instanceof Uint8Array ? input : new Uint8Array(input));
}

/**
 * Decrypts an OFFCRYPTO OLE CFB package (Agile or Standard) to OPC ZIP bytes.
 *
 * @param {Uint8Array} input - Entire encrypted package bytes (CFB).
 * @param {string} password - Open password (never logged or retained).
 * @param {DecryptSecurityLimits} limits - Decrypted-size guards.
 * @returns {Promise<Uint8Array>} Decrypted OPC package bytes.
 * @public
 */
export function decryptOffCryptoPackage(
    input: Uint8Array,
    password: string,
    limits: DecryptSecurityLimits = DEFAULT_DECRYPT_SECURITY_LIMITS
): Promise<Uint8Array> {
    try {
        const resolved: DecryptSecurityLimits = resolveDecryptLimits(limits);
        const limit: number = Math.min(resolved.singlePartUncompressedBytes, resolved.totalUncompressedBytes);
        return Promise.resolve(decryptPackage(input, password === undefined ? '' : password, limit));
    } catch (e) {
        return Promise.reject(e);
    }
}

/**
 * Byte-wise constant-time comparison.
 *
 * @param {Uint8Array} a - First value.
 * @param {Uint8Array} b - Second value.
 * @returns {boolean} `true` when equal.
 * @public
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    let diff: number = a.length ^ b.length;
    const n: number = Math.max(a.length, b.length);
    for (let i: number = 0; i < n; i++) {
        diff |= (i < a.length ? a[i] : 0) ^ (i < b.length ? b[i] : 0);
    }
    return diff === 0;
}

/**
 * Digest length in bytes.
 *
 * @param {AgileHashName} hash - Algorithm.
 * @returns {number} Digest size.
 * @public
 */
export function hashDigestLength(hash: AgileHashName): number {
    return hashSize(engineHash(hash));
}

/**
 * One-shot hash.
 *
 * @param {AgileHashName} hash - Algorithm.
 * @param {Uint8Array} data - Input.
 * @returns {Uint8Array} Digest.
 * @public
 */
export function hashBytes(hash: AgileHashName, data: Uint8Array): Uint8Array {
    return computeHash(engineHash(hash), data);
}

/**
 * HMAC over a message.
 *
 * @param {AgileHashName} hash - Algorithm.
 * @param {Uint8Array} key - HMAC key.
 * @param {Uint8Array} message - Message.
 * @returns {Uint8Array} MAC.
 * @public
 */
export function hmacBytes(hash: AgileHashName, key: Uint8Array, message: Uint8Array): Uint8Array {
    return computeHmac(engineHash(hash), key, message);
}

/**
 * Concatenates byte arrays.
 *
 * @param {Uint8Array[]} parts - Arrays to join.
 * @returns {Uint8Array} Joined bytes.
 * @public
 */
export function concatBytes(...parts: Uint8Array[]): Uint8Array {
    let total: number = 0;
    for (const p of parts) {
        total += p.byteLength;
    }
    const out: Uint8Array = new Uint8Array(total);
    let offset: number = 0;
    for (const p of parts) {
        out.set(p, offset);
        offset += p.byteLength;
    }
    return out;
}

/**
 * Encodes a password as UTF-16LE.
 *
 * @param {string} password - Password text.
 * @returns {Uint8Array} UTF-16LE bytes.
 * @public
 */
export function encodePasswordUtf16Le(password: string): Uint8Array {
    const out: Uint8Array = new Uint8Array(password.length * 2);
    for (let i: number = 0; i < password.length; i++) {
        const code: number = password.charCodeAt(i);
        out[i * 2] = code & 0xff;
        out[i * 2 + 1] = (code >>> 8) & 0xff;
    }
    return out;
}

function padOrTruncate(data: Uint8Array, length: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(length).fill(0x36);
    out.set(data.subarray(0, Math.min(length, data.length)));
    return out;
}

/**
 * Derives an Agile key from a password ([MS-OFFCRYPTO] §2.3.4.11).
 *
 * @param {AgileHashName} hash - Algorithm.
 * @param {Uint8Array} salt - Password salt.
 * @param {Uint8Array} passwordUtf16Le - Password bytes.
 * @param {number} spinCount - Hash iterations.
 * @param {Uint8Array} blockKey - Block key.
 * @param {number} keyBits - Key size in bits.
 * @returns {Uint8Array} Derived key.
 * @public
 */
export function deriveAgileKey(
    hash: AgileHashName, salt: Uint8Array, passwordUtf16Le: Uint8Array,
    spinCount: number, blockKey: Uint8Array, keyBits: number
): Uint8Array {
    let hn: Uint8Array = hashBytes(hash, concatBytes(salt, passwordUtf16Le));
    const iterator: Uint8Array = new Uint8Array(4);
    const view: DataView = new DataView(iterator.buffer);
    for (let i: number = 0; i < spinCount; i++) {
        view.setUint32(0, i, true);
        hn = hashBytes(hash, concatBytes(iterator, hn));
    }
    return padOrTruncate(hashBytes(hash, concatBytes(hn, blockKey)), keyBits / 8);
}

/**
 * Derives an Agile IV ([MS-OFFCRYPTO] §2.3.4.12).
 *
 * @param {AgileHashName} hash - Algorithm.
 * @param {Uint8Array} keySalt - Salt.
 * @param {Uint8Array | undefined} blockKey - Block key, or a segment index encoded as bytes.
 * @param {number} blockSize - IV size.
 * @returns {Uint8Array} IV.
 * @public
 */
export function deriveAgileIv(
    hash: AgileHashName, keySalt: Uint8Array, blockKey: Uint8Array | undefined, blockSize: number
): Uint8Array {
    return padOrTruncate(blockKey === undefined ? keySalt : hashBytes(hash, concatBytes(keySalt, blockKey)), blockSize);
}

/**
 * AES-CBC decrypt, no padding removal.
 *
 * @param {Uint8Array} key - AES key.
 * @param {Uint8Array} iv - 16-byte IV.
 * @param {Uint8Array} ciphertext - Block-aligned cipher bytes.
 * @returns {Uint8Array} Plain bytes.
 * @public
 */
export function aesCbcDecrypt(key: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Uint8Array {
    if (ciphertext.byteLength === 0) {
        return new Uint8Array(0);
    }
    if (ciphertext.byteLength % 16 !== 0 || iv.byteLength !== 16) {
        throw new UnsupportedEncryptionError('OFFCRYPTO AES-CBC requires block-aligned data and a 16-byte IV');
    }
    return new AesCipher(key).cbcDecrypt(iv, ciphertext);
}

/**
 * AES-CBC encrypt, zero-padding the plaintext to a block multiple.
 *
 * @param {Uint8Array} key - AES key.
 * @param {Uint8Array} iv - 16-byte IV.
 * @param {Uint8Array} plaintext - Plain bytes.
 * @returns {Uint8Array} Cipher bytes.
 * @public
 */
export function aesCbcEncrypt(key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array): Uint8Array {
    if (iv.byteLength !== 16) {
        throw new UnsupportedEncryptionError('OFFCRYPTO AES-CBC requires a 16-byte IV');
    }
    const padded: Uint8Array = new Uint8Array(Math.ceil(plaintext.byteLength / 16) * 16);
    padded.set(plaintext);
    return new AesCipher(key).cbcEncrypt(iv, padded);
}
