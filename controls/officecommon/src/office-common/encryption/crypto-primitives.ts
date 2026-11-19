/*
 * Hash / HMAC / AES-CBC primitives for Agile OFFCRYPTO.
 *
 * @remarks
 * [MS-OFFCRYPTO] §2.3.4.11–§2.3.4.15 pads AES-CBC plaintexts with **0x00** to
 * `blockSize`, not PKCS #7. Node's Web Crypto `AES-CBC` decrypt expects PKCS #7
 * and rejects Office ciphertexts. This module therefore uses the **Node.js
 * built-in** `node:crypto` (`createHash`, `createHmac`, `createDecipheriv` with
 * `setAutoPadding(false)`). That is a platform API, not a new npm dependency
 * (ADR / dependencies policy). No third-party crypto packages.
 *
 * Supported for v1: AES-128/192/256 + CBC; SHA-1 / SHA-256 / SHA-384 / SHA-512.
 * Symbols re-exported from the encryption package entry are public; keep
 * `@private`
 * only on helpers that are not part of that surface.
 *
 * @packageDocumentation
 */


import { ownValue } from '../core/own-value';
import { Literal } from '../core/literal-type';
import { UnsupportedEncryptionError } from './errors';
import { IV_PAD_BYTE, KEY_PAD_BYTE } from './agile-constants';

/* AMD/browser-safe Node crypto access (typed loosely for TS 3.3). */
declare const require: any;
declare const Buffer: {
    from(data: any, encoding?: string): { buffer: ArrayBuffer; byteOffset: number; byteLength: number } & Uint8Array;
};
/**
 * The node crypto.
 *
 * @returns {any} The result.
 */
function __nodeCrypto(): any {
    try {
        return require('crypto');
    } catch (e) {
        throw new Error('Node crypto is required for Agile encryption');
    }
}

const { createCipheriv, createDecipheriv, createHash, createHmac } = __nodeCrypto();

/** Hash algorithm names as in EncryptionInfo XML ([MS-OFFCRYPTO] §2.3.4.10). */
export type AgileHashName = 'SHA-1' | 'SHA256' | 'SHA384' | 'SHA512';

const HASH_TO_NODE: Readonly<Record<AgileHashName, string>> = {
    'SHA-1': 'sha1',
    SHA256: 'sha256',
    SHA384: 'sha384',
    SHA512: 'sha512'
};

const HASH_DIGEST_BYTES: Readonly<Record<AgileHashName, number>> = {
    'SHA-1': 20,
    SHA256: 32,
    SHA384: 48,
    SHA512: 64
};

/**
 * Maps OFFCRYPTO hashAlgorithm attribute to an internal name.
 *
 * @param {string} name - The name.
 * @returns {AgileHashName} The result.
 * @throws {UnsupportedEncryptionError} When the algorithm is not in the v1 set.
 */
export function resolveHashAlgorithm(name: string): AgileHashName {
    switch (name) {
    case 'SHA-1':
    case 'SHA1':
        return 'SHA-1';
    case 'SHA256':
        return 'SHA256';
    case 'SHA384':
        return 'SHA384';
    case 'SHA512':
        return 'SHA512';
    default:
        throw new UnsupportedEncryptionError(
            `Unsupported OFFCRYPTO hashAlgorithm: ${sanitizeAlgToken(name)}`
        );
    }
}

/**
 * Validates cipherAlgorithm + cipherChaining for v1 (AES + CBC only).
 *
 * @param {string} cipherAlgorithm - The cipher algorithm.
 * @param {string} cipherChaining - The cipher chaining.
 * @returns {void} Nothing is returned.
 * @throws {UnsupportedEncryptionError} When not AES/CBC.
 */
export function assertSupportedCipher(cipherAlgorithm: string, cipherChaining: string): void {
    if (cipherAlgorithm !== 'AES') {
        throw new UnsupportedEncryptionError(
            `Unsupported OFFCRYPTO cipherAlgorithm: ${sanitizeAlgToken(cipherAlgorithm)}`
        );
    }
    if (cipherChaining !== 'ChainingModeCBC') {
        throw new UnsupportedEncryptionError(
            `Unsupported OFFCRYPTO cipherChaining: ${sanitizeAlgToken(cipherChaining)}`
        );
    }
}

/**
 * Validates AES keyBits (128 / 192 / 256).
 *
 * @param {number} keyBits - The key bits.
 * @returns {void} Nothing is returned.
 * @throws {UnsupportedEncryptionError} When key length is not a supported AES size.
 */
export function assertAesKeyBits(keyBits: number): void {
    if (keyBits !== 128 && keyBits !== 192 && keyBits !== 256) {
        throw new UnsupportedEncryptionError(`Unsupported OFFCRYPTO AES keyBits: ${String(keyBits)}`);
    }
}

/**
 * Digest length in bytes for a resolved hash algorithm.
 *
 * @param {AgileHashName} hash - The hash.
 * @returns {number} The result.
 */
export function hashDigestLength(hash: AgileHashName): number {
    return ownValue<number>(HASH_DIGEST_BYTES, hash) as number;
}

/**
 * One-shot hash.
 *
 * @param {AgileHashName} hash - The hash.
 * @param {Uint8Array} data - The data.
 * @returns {Uint8Array} The result.
 */
export function hashBytes(hash: AgileHashName, data: Uint8Array): Uint8Array {
    const h: any = createHash(ownValue<string>(HASH_TO_NODE, hash));
    h.update(data);
    return new Uint8Array(h.digest());
}

/**
 * HMAC over message with key (DataIntegrity §2.3.4.14).
 *
 * @param {AgileHashName} hash - The hash.
 * @param {Uint8Array} key - The key.
 * @param {Uint8Array} message - The message.
 * @returns {Uint8Array} The result.
 */
export function hmacBytes(hash: AgileHashName, key: Uint8Array, message: Uint8Array): Uint8Array {
    const h: any = createHmac(ownValue<string>(HASH_TO_NODE, hash), Buffer.from(key));
    h.update(message);
    return new Uint8Array(h.digest());
}

/**
 * Concatenates byte arrays.
 *
 * @param {*} parts - The parts.
 * @returns {Uint8Array} The result.
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
 * Encodes a JavaScript string as UTF-16LE (Unicode password bytes, §2.3.4.11).
 *
 * @param {string} password - The password.
 * @returns {Uint8Array} The result.
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

/**
 * Password-based encryption key (§2.3.4.11).
 *
 * H0 = H(salt + password); Hn = H(iterator LE u32 + Hn-1) for spinCount iterations;
 * Hfinal = H(Hn + blockKey); pad/truncate to keyBits/8 with 0x36.
 *
 * @param {AgileHashName} hash - The hash.
 * @param {Uint8Array} salt - The salt.
 * @param {Uint8Array} passwordUtf16Le - The password utf16 le.
 * @param {number} spinCount - The spin count.
 * @param {Uint8Array} blockKey - The block key.
 * @param {number} keyBits - The key bits.
 * @returns {Uint8Array} The result.
 */
export function deriveAgileKey(
    hash: AgileHashName,
    salt: Uint8Array,
    passwordUtf16Le: Uint8Array,
    spinCount: number,
    blockKey: Uint8Array,
    keyBits: number
): Uint8Array {
    let hn: Uint8Array = hashBytes(hash, concatBytes(salt, passwordUtf16Le));
    const iterator: Uint8Array = new Uint8Array(4);
    const iteratorView: DataView = new DataView(iterator.buffer);
    for (let i: number = 0; i < spinCount; i++) {
        iteratorView.setUint32(0, i, true);
        hn = hashBytes(hash, concatBytes(iterator, hn));
    }
    const hfinal: Uint8Array = hashBytes(hash, concatBytes(hn, blockKey));
    return padOrTruncate(hfinal, keyBits / 8, KEY_PAD_BYTE);
}

/**
 * Initialization vector (§2.3.4.12).
 *
 * With blockKey: IV = H(keySalt + blockKey); without: IV = keySalt.
 * Pad/truncate to blockSize with 0x36.
 *
 * @param {AgileHashName} hash - The hash.
 * @param {Uint8Array} keySalt - The key salt.
 * @param {Uint8Array | undefined} blockKey - The block key.
 * @param {number} blockSize - The block size.
 * @returns {Uint8Array} The result.
 */
export function deriveAgileIv(
    hash: AgileHashName,
    keySalt: Uint8Array,
    blockKey: Uint8Array | undefined,
    blockSize: number
): Uint8Array {
    const raw: Uint8Array = blockKey === undefined ? keySalt : hashBytes(hash, concatBytes(keySalt, blockKey));
    return padOrTruncate(raw, blockSize, IV_PAD_BYTE);
}

/**
 * AES-CBC decrypt with zero padding (no PKCS #7 strip).
 *
 * @param {Uint8Array} key - AES key (16/24/32 bytes).
 * @param {Uint8Array} iv - IV of blockSize bytes (AES block is 16; OFFCRYPTO blockSize is 16 for AES).
 * @param {Uint8Array} ciphertext - Length MUST be a multiple of 16.
 * @returns {Uint8Array} Plaintext of the same length as ciphertext (including zero pad).
 */
export function aesCbcDecrypt(key: Uint8Array, iv: Uint8Array, ciphertext: Uint8Array): Uint8Array {
    if (ciphertext.byteLength === 0) {
        return new Uint8Array(0);
    }
    if (ciphertext.byteLength % 16 !== 0) {
        throw new UnsupportedEncryptionError(
            'OFFCRYPTO AES-CBC ciphertext length is not block-aligned'
        );
    }
    if (iv.byteLength !== 16) {
        throw new UnsupportedEncryptionError('OFFCRYPTO AES-CBC IV must be 16 bytes');
    }
    const algo: string = aesAlgorithmName(key.byteLength);
    const decipher: any = createDecipheriv(algo, Buffer.from(key), Buffer.from(iv));
    decipher.setAutoPadding(false);
    const part1: any = decipher.update(Buffer.from(ciphertext));
    const part2: any = decipher.final();
    if (part2.byteLength === 0) {
        return new Uint8Array(part1);
    }
    const out: Uint8Array = new Uint8Array(part1.byteLength + part2.byteLength);
    out.set(part1, 0);
    out.set(part2, part1.byteLength);
    return out;
}

/**
 * AES-CBC encrypt with zero padding (no PKCS #7).
 *
 * @param {Uint8Array} key - The key.
 * @param {Uint8Array} iv - The iv.
 * @param {Uint8Array} plaintext - The plaintext.
 * @returns {Uint8Array} The result.
 * @remarks
 * Used by test fixture builders and host encrypt harnesses. Same zero-pad
 * rules as decrypt ([MS-OFFCRYPTO] §2.3.4.13 / §2.3.4.15).
 * @public
 */
export function aesCbcEncrypt(key: Uint8Array, iv: Uint8Array, plaintext: Uint8Array): Uint8Array {
    if (iv.byteLength !== 16) {
        throw new UnsupportedEncryptionError('OFFCRYPTO AES-CBC IV must be 16 bytes');
    }
    const blockSize: Literal<16> = 16;
    const paddedLen: number =
    plaintext.byteLength === 0
        ? blockSize
        : Math.ceil(plaintext.byteLength / blockSize) * blockSize;
    const padded: Uint8Array = new Uint8Array(paddedLen);
    padded.set(plaintext, 0);
    // remaining bytes stay 0x00 (Agile zero-pad, §2.3.4.13 / §2.3.4.15).

    const algo: string = aesAlgorithmName(key.byteLength);
    const cipher: any = createCipheriv(algo, Buffer.from(key), Buffer.from(iv));
    cipher.setAutoPadding(false);
    const part1: any = cipher.update(Buffer.from(padded));
    const part2: any = cipher.final();
    if (part2.byteLength === 0) {
        return new Uint8Array(part1);
    }
    const out: Uint8Array = new Uint8Array(part1.byteLength + part2.byteLength);
    out.set(part1, 0);
    out.set(part2, part1.byteLength);
    return out;
}

/**
 * Constant-time comparison of two equal-length buffers.
 * Returns false when lengths differ (not constant-time on length).
 *
 * @param {Uint8Array} a - The a.
 * @param {Uint8Array} b - The b.
 * @returns {boolean} The result.
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    let diff: number = 0;
    const viewA: DataView = new DataView(a.buffer, a.byteOffset, a.byteLength);
    const viewB: DataView = new DataView(b.buffer, b.byteOffset, b.byteLength);
    for (let i: number = 0; i < a.byteLength; i++) {
        // Lengths already equal; index is in range.
        diff |= viewA.getUint8(i) ^ viewB.getUint8(i);
    }
    return diff === 0;
}

/**
 * The pad or truncate.
 *
 * @param {Uint8Array} data - The data.
 * @param {number} size - The size.
 * @param {number} padByte - The pad byte.
 * @returns {Uint8Array} The result.
 */
function padOrTruncate(data: Uint8Array, size: number, padByte: number): Uint8Array {
    if (data.byteLength === size) {
        return data;
    }
    if (data.byteLength > size) {
        return data.subarray(0, size);
    }
    const out: Uint8Array = new Uint8Array(size);
    out.set(data, 0);
    out.fill(padByte, data.byteLength);
    return out;
}

/**
 * The aes algorithm name.
 *
 * @param {number} keyBytes - The key bytes.
 * @returns {string} The result.
 */
function aesAlgorithmName(keyBytes: number): string {
    switch (keyBytes) {
    case 16:
        return 'aes-128-cbc';
    case 24:
        return 'aes-192-cbc';
    case 32:
        return 'aes-256-cbc';
    default:
        throw new UnsupportedEncryptionError('Unsupported AES key length');
    }
}

/**
 * Strip control chars so algorithm tokens cannot smuggle secrets into messages.
 *
 * @param {string} token - The token.
 * @returns {string} The result.
 */
function sanitizeAlgToken(token: string): string {
    const cleaned: string = token.replace(/[^\w.\-:/+]/g, '').slice(0, 64);
    return cleaned.length > 0 ? cleaned : '(unrecognized)';
}
