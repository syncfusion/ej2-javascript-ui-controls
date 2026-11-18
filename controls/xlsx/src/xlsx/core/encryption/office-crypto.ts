/**
 * Password-based encryption of OOXML packages (MS-OFFCRYPTO).
 *
 * Write path: ECMA-376 Agile encryption (version 4.4) — AES-256-CBC with SHA-512,
 * a 100 000-round password hash, and an HMAC-SHA512 data-integrity record — stored
 * in a CFB container with the standard `\u0006DataSpaces` storage.
 *
 * Read path: Agile encryption (any supported hash / AES key size) and Standard
 * encryption (AES-ECB with SHA-1, versions 2.2 / 3.2 / 4.2) as produced by Excel
 * 2007 and later. Extensible (certificate / RMS) encryption is not supported.
 *
 * Verification order on read: password verifier first (wrong password →
 * {@link InvalidPasswordError}), then the Agile HMAC over the encrypted stream.
 * Nothing here evaluates workbook content.
 *
 * Specs: `specs/microsoft/` MS-OFFCRYPTO §2.3.4 (Agile / Standard), MS-CFB.
 *
 * @private
 */

import {
    InvalidArgumentError,
    InvalidPackageError,
    InvalidPasswordError,
    PackageLimitError,
    UnsupportedEncryptionError,
} from '../errors';
import { decodeUtf8, encodeUtf8, findElementsWithAttrs, XmlElementAttrs } from '../xml/minimal-xml';
import { AesCipher } from './aes';
import { CfbStream, isCfb, readCfb, writeCfb } from './cfb';
import { computeHash, computeHmac, HashAlgorithm, hashSize } from './hash';
import { secureRandomBytes } from './random';

const ENCRYPTION_INFO: string = 'EncryptionInfo';
const ENCRYPTED_PACKAGE: string = 'EncryptedPackage';
const SEGMENT_SIZE: number = 4096;
const AGILE_SPIN_COUNT: number = 100000;
const MAX_SPIN_COUNT: number = 10000000;
const STANDARD_SPIN_COUNT: number = 50000;
/** Excel accepts at most 255 characters in an open password. */
export const MAX_PASSWORD_LENGTH: number = 255;
/** Password Excel uses for "read-only recommended" files that have no real open password. */
const DEFAULT_PASSWORD: string = 'VelvetSweatshop';

const BLOCK_VERIFIER_INPUT: number[] = [0xfe, 0xa7, 0xd2, 0x76, 0x3b, 0x4b, 0x9e, 0x79];
const BLOCK_VERIFIER_VALUE: number[] = [0xd7, 0xaa, 0x0f, 0x6d, 0x30, 0x61, 0x34, 0x4e];
const BLOCK_KEY_VALUE: number[] = [0x14, 0x6e, 0x0b, 0xe7, 0xab, 0xac, 0xd0, 0xd6];
const BLOCK_HMAC_KEY: number[] = [0x5f, 0xb2, 0xad, 0x01, 0x0c, 0xb9, 0xe1, 0xf6];
const BLOCK_HMAC_VALUE: number[] = [0xa0, 0x67, 0x7f, 0x02, 0xb2, 0x2c, 0x84, 0x33];

const B64: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64(bytes: Uint8Array): string {
    let out: string = '';
    for (let i: number = 0; i < bytes.length; i += 3) {
        const b0: number = bytes[i];
        const b1: number = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const b2: number = i + 2 < bytes.length ? bytes[i + 2] : 0;
        out += B64.charAt(b0 >> 2) + B64.charAt(((b0 & 3) << 4) | (b1 >> 4));
        out += i + 1 < bytes.length ? B64.charAt(((b1 & 15) << 2) | (b2 >> 6)) : '=';
        out += i + 2 < bytes.length ? B64.charAt(b2 & 63) : '=';
    }
    return out;
}

function fromBase64(text: string): Uint8Array {
    const clean: string = text.replace(/[^A-Za-z0-9+/]/g, '');
    const out: Uint8Array = new Uint8Array(Math.floor((clean.length * 3) / 4));
    let o: number = 0;
    for (let i: number = 0; i < clean.length; i += 4) {
        const c0: number = B64.indexOf(clean.charAt(i));
        const c1: number = B64.indexOf(clean.charAt(i + 1));
        const c2: number = i + 2 < clean.length ? B64.indexOf(clean.charAt(i + 2)) : -1;
        const c3: number = i + 3 < clean.length ? B64.indexOf(clean.charAt(i + 3)) : -1;
        out[o++] = (c0 << 2) | (c1 >> 4);
        if (c2 >= 0 && o < out.length + 1) {
            out[o++] = ((c1 & 15) << 4) | (c2 >> 2);
        }
        if (c3 >= 0) {
            out[o++] = ((c2 & 3) << 6) | c3;
        }
    }
    return out.subarray(0, o);
}

function utf16le(text: string): Uint8Array {
    const out: Uint8Array = new Uint8Array(text.length * 2);
    for (let i: number = 0; i < text.length; i++) {
        const c: number = text.charCodeAt(i);
        out[i * 2] = c & 0xff;
        out[i * 2 + 1] = c >>> 8;
    }
    return out;
}

function u32le(value: number): Uint8Array {
    return new Uint8Array([value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff]);
}

function concat(parts: Uint8Array[]): Uint8Array {
    let total: number = 0;
    for (let i: number = 0; i < parts.length; i++) {
        total += parts[i].length;
    }
    const out: Uint8Array = new Uint8Array(total);
    let o: number = 0;
    for (let i: number = 0; i < parts.length; i++) {
        out.set(parts[i], o);
        o += parts[i].length;
    }
    return out;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array, length: number): boolean {
    if (a.length < length || b.length < length) {
        return false;
    }
    let diff: number = 0;
    for (let i: number = 0; i < length; i++) {
        diff |= a[i] ^ b[i];
    }
    return diff === 0;
}

/** Zero-pads to a multiple of `block`. */
function padTo(data: Uint8Array, block: number): Uint8Array {
    const size: number = Math.ceil(data.length / block) * block;
    if (size === data.length) {
        return data;
    }
    const out: Uint8Array = new Uint8Array(size);
    out.set(data);
    return out;
}

/** Truncates, or pads with `fill`, to exactly `length` bytes. */
function fit(data: Uint8Array, length: number, fill: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(length).fill(fill);
    out.set(data.subarray(0, length));
    return out;
}

// ---------------------------------------------------------------------------
// Agile encryption
// ---------------------------------------------------------------------------

interface AgileParams {
    readonly saltValue: Uint8Array;
    readonly blockSize: number;
    readonly keyBits: number;
    readonly hashAlgorithm: HashAlgorithm;
}

function parseHashAlgorithm(name: string | undefined): HashAlgorithm {
    switch (name) {
    case 'SHA1': return 'SHA1';
    case 'SHA256': return 'SHA256';
    case 'SHA384': return 'SHA384';
    case 'SHA512': return 'SHA512';
    default:
        throw new UnsupportedEncryptionError('Unsupported encryption hash algorithm: ' + String(name));
    }
}

function requireAttr(el: XmlElementAttrs | undefined, name: string): string {
    const value: string | undefined = el === undefined ? undefined : el.attrs.get(name);
    if (value === undefined) {
        throw new InvalidPackageError('Encryption info is missing attribute "' + name + '"');
    }
    return value;
}

function intAttr(el: XmlElementAttrs | undefined, name: string): number {
    const n: number = parseInt(requireAttr(el, name), 10);
    if (!isFinite(n) || n < 0) {
        throw new InvalidPackageError('Encryption info attribute "' + name + '" is not a valid number');
    }
    return n;
}

function readAgileParams(el: XmlElementAttrs | undefined): AgileParams {
    if (requireAttr(el, 'cipherAlgorithm') !== 'AES' || requireAttr(el, 'cipherChaining') !== 'ChainingModeCBC') {
        throw new UnsupportedEncryptionError('Only AES-CBC Agile encryption is supported');
    }
    const keyBits: number = intAttr(el, 'keyBits');
    if (keyBits !== 128 && keyBits !== 192 && keyBits !== 256) {
        throw new UnsupportedEncryptionError('Unsupported AES key size: ' + keyBits);
    }
    const blockSize: number = intAttr(el, 'blockSize');
    if (blockSize !== 16) {
        throw new UnsupportedEncryptionError('Unsupported AES block size: ' + blockSize);
    }
    const saltValue: Uint8Array = fromBase64(requireAttr(el, 'saltValue'));
    if (saltValue.length !== intAttr(el, 'saltSize') || saltValue.length < 1) {
        throw new InvalidPackageError('Encryption info salt size mismatch');
    }
    return { saltValue, blockSize, keyBits, hashAlgorithm: parseHashAlgorithm(requireAttr(el, 'hashAlgorithm')) };
}

/** Iterated password hash H_n (MS-OFFCRYPTO 2.3.4.11). */
function iteratedHash(password: string, salt: Uint8Array, algorithm: HashAlgorithm, spinCount: number): Uint8Array {
    let h: Uint8Array = computeHash(algorithm, concat([salt, utf16le(password)]));
    const buf: Uint8Array = new Uint8Array(4 + h.length);
    for (let i: number = 0; i < spinCount; i++) {
        buf[0] = i & 0xff;
        buf[1] = (i >>> 8) & 0xff;
        buf[2] = (i >>> 16) & 0xff;
        buf[3] = (i >>> 24) & 0xff;
        buf.set(h, 4);
        h = computeHash(algorithm, buf);
    }
    return h;
}

function agileKey(hn: Uint8Array, blockKey: number[], algorithm: HashAlgorithm, keyBits: number): Uint8Array {
    return fit(computeHash(algorithm, concat([hn, new Uint8Array(blockKey)])), keyBits / 8, 0x36);
}

function segmentIv(keySalt: Uint8Array, index: number, algorithm: HashAlgorithm, blockSize: number): Uint8Array {
    return fit(computeHash(algorithm, concat([keySalt, u32le(index)])), blockSize, 0x36);
}

function blockIv(keySalt: Uint8Array, blockKey: number[], algorithm: HashAlgorithm, blockSize: number): Uint8Array {
    return fit(computeHash(algorithm, concat([keySalt, new Uint8Array(blockKey)])), blockSize, 0x36);
}

function readPackageSize(stream: Uint8Array): number {
    if (stream.length < 8) {
        throw new InvalidPackageError('EncryptedPackage stream is truncated');
    }
    const lo: number = (stream[0] | (stream[1] << 8) | (stream[2] << 16) | (stream[3] << 24)) >>> 0;
    const hi: number = (stream[4] | (stream[5] << 8) | (stream[6] << 16) | (stream[7] << 24)) >>> 0;
    return lo + hi * 4294967296;
}

function decryptAgile(info: Uint8Array, encrypted: Uint8Array, password: string): Uint8Array {
    const xml: string = decodeUtf8(info.subarray(8));
    const keyData: XmlElementAttrs | undefined = findElementsWithAttrs(xml, 'keyData')[0];
    const integrity: XmlElementAttrs | undefined = findElementsWithAttrs(xml, 'dataIntegrity')[0];
    const keyEl: XmlElementAttrs | undefined = findElementsWithAttrs(xml, 'encryptedKey')[0];
    const data: AgileParams = readAgileParams(keyData);
    const pwd: AgileParams = readAgileParams(keyEl);
    const spin: number = intAttr(keyEl, 'spinCount');
    if (spin > MAX_SPIN_COUNT) {
        throw new PackageLimitError('Encryption spin count exceeds the supported maximum');
    }

    const hn: Uint8Array = iteratedHash(password, pwd.saltValue, pwd.hashAlgorithm, spin);
    const hSize: number = hashSize(pwd.hashAlgorithm);
    const verifierInput: Uint8Array = new AesCipher(agileKey(hn, BLOCK_VERIFIER_INPUT, pwd.hashAlgorithm, pwd.keyBits))
        .cbcDecrypt(fit(pwd.saltValue, 16, 0x36), fromBase64(requireAttr(keyEl, 'encryptedVerifierHashInput')));
    const verifierValue: Uint8Array = new AesCipher(agileKey(hn, BLOCK_VERIFIER_VALUE, pwd.hashAlgorithm, pwd.keyBits))
        .cbcDecrypt(fit(pwd.saltValue, 16, 0x36), fromBase64(requireAttr(keyEl, 'encryptedVerifierHashValue')));
    const expected: Uint8Array = computeHash(pwd.hashAlgorithm, verifierInput.subarray(0, pwd.saltValue.length));
    if (!constantTimeEqual(expected, verifierValue, hSize)) {
        throw new InvalidPasswordError('The password is incorrect');
    }
    const intermediate: Uint8Array = new AesCipher(agileKey(hn, BLOCK_KEY_VALUE, pwd.hashAlgorithm, pwd.keyBits))
        .cbcDecrypt(fit(pwd.saltValue, 16, 0x36), fromBase64(requireAttr(keyEl, 'encryptedKeyValue')))
        .subarray(0, data.keyBits / 8);
    const cipher: AesCipher = new AesCipher(intermediate);

    if (integrity !== undefined) {
        const dSize: number = hashSize(data.hashAlgorithm);
        const hmacKey: Uint8Array = cipher.cbcDecrypt(
            blockIv(data.saltValue, BLOCK_HMAC_KEY, data.hashAlgorithm, data.blockSize),
            fromBase64(requireAttr(integrity, 'encryptedHmacKey'))).subarray(0, dSize);
        const hmacValue: Uint8Array = cipher.cbcDecrypt(
            blockIv(data.saltValue, BLOCK_HMAC_VALUE, data.hashAlgorithm, data.blockSize),
            fromBase64(requireAttr(integrity, 'encryptedHmacValue')));
        if (!constantTimeEqual(computeHmac(data.hashAlgorithm, hmacKey, encrypted), hmacValue, dSize)) {
            throw new InvalidPackageError('Encrypted package failed its integrity check (data is corrupt or was modified)');
        }
    }

    const size: number = readPackageSize(encrypted);
    if (size > encrypted.length - 8) {
        throw new InvalidPackageError('EncryptedPackage declares more data than it contains');
    }
    const out: Uint8Array = new Uint8Array(size);
    for (let index: number = 0, off: number = 8; off - 8 < size; index++, off += SEGMENT_SIZE) {
        const remaining: number = encrypted.length - off;
        const chunk: number = Math.min(SEGMENT_SIZE, Math.ceil(Math.min(remaining, size - (off - 8)) / 16) * 16);
        const plain: Uint8Array = cipher.cbcDecrypt(
            segmentIv(data.saltValue, index, data.hashAlgorithm, data.blockSize),
            encrypted.subarray(off, off + chunk));
        const take: number = Math.min(plain.length, size - (off - 8));
        out.set(plain.subarray(0, take), off - 8);
    }
    return out;
}

function agileXml(
    keySalt: Uint8Array, passwordSalt: Uint8Array, spinCount: number, encVerifierInput: Uint8Array,
    encVerifierValue: Uint8Array, encKeyValue: Uint8Array, encHmacKey: Uint8Array, encHmacValue: Uint8Array
): string {
    const common: string = 'saltSize="16" blockSize="16" keyBits="256" hashSize="64" cipherAlgorithm="AES" ' +
        'cipherChaining="ChainingModeCBC" hashAlgorithm="SHA512"';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' +
        '<encryption xmlns="http://schemas.microsoft.com/office/2006/encryption" ' +
        'xmlns:p="http://schemas.microsoft.com/office/2006/keyEncryptor/password" ' +
        'xmlns:c="http://schemas.microsoft.com/office/2006/keyEncryptor/certificate">' +
        '<keyData ' + common + ' saltValue="' + toBase64(keySalt) + '"/>' +
        '<dataIntegrity encryptedHmacKey="' + toBase64(encHmacKey) + '" encryptedHmacValue="' + toBase64(encHmacValue) + '"/>' +
        '<keyEncryptors><keyEncryptor uri="http://schemas.microsoft.com/office/2006/keyEncryptor/password">' +
        '<p:encryptedKey spinCount="' + spinCount + '" ' + common + ' saltValue="' + toBase64(passwordSalt) + '"' +
        ' encryptedVerifierHashInput="' + toBase64(encVerifierInput) + '"' +
        ' encryptedVerifierHashValue="' + toBase64(encVerifierValue) + '"' +
        ' encryptedKeyValue="' + toBase64(encKeyValue) + '"/>' +
        '</keyEncryptor></keyEncryptors></encryption>';
}

// ---------------------------------------------------------------------------
// Standard encryption (read only)
// ---------------------------------------------------------------------------

function readU32(b: Uint8Array, o: number): number {
    return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}

function decryptStandard(info: Uint8Array, encrypted: Uint8Array, password: string): Uint8Array {
    if (info.length < 12) {
        throw new InvalidPackageError('EncryptionInfo is truncated');
    }
    const headerSize: number = readU32(info, 8);
    const header: number = 12;
    const verifier: number = header + headerSize;
    if (headerSize < 32 || verifier + 4 > info.length) {
        throw new InvalidPackageError('EncryptionInfo header is truncated');
    }
    const algId: number = readU32(info, header + 8);
    const algHash: number = readU32(info, header + 12);
    const keyBits: number = readU32(info, header + 16);
    if (algId < 0x660e || algId > 0x6610 || algHash !== 0x8004 || (keyBits !== 128 && keyBits !== 192 && keyBits !== 256)) {
        throw new UnsupportedEncryptionError('Only AES / SHA-1 Standard encryption is supported');
    }
    const saltSize: number = readU32(info, verifier);
    if (saltSize !== 16 || verifier + 4 + 16 + 16 + 4 + 32 > info.length) {
        throw new InvalidPackageError('EncryptionInfo verifier is truncated');
    }
    const salt: Uint8Array = info.subarray(verifier + 4, verifier + 20);
    const encVerifier: Uint8Array = info.subarray(verifier + 20, verifier + 36);
    const encVerifierHash: Uint8Array = info.subarray(verifier + 40, verifier + 72);

    let h: Uint8Array = computeHash('SHA1', concat([salt, utf16le(password)]));
    for (let i: number = 0; i < STANDARD_SPIN_COUNT; i++) {
        h = computeHash('SHA1', concat([u32le(i), h]));
    }
    const hFinal: Uint8Array = computeHash('SHA1', concat([h, u32le(0)]));
    const x1: Uint8Array = computeHash('SHA1', xorPad(hFinal, 0x36));
    const x2: Uint8Array = computeHash('SHA1', xorPad(hFinal, 0x5c));
    const key: Uint8Array = concat([x1, x2]).subarray(0, keyBits / 8);
    const cipher: AesCipher = new AesCipher(key);
    const verifierPlain: Uint8Array = cipher.ecbDecrypt(encVerifier);
    const hashPlain: Uint8Array = cipher.ecbDecrypt(encVerifierHash);
    if (!constantTimeEqual(computeHash('SHA1', verifierPlain), hashPlain, 20)) {
        throw new InvalidPasswordError('The password is incorrect');
    }
    const size: number = readPackageSize(encrypted);
    const body: Uint8Array = encrypted.subarray(8, 8 + Math.floor((encrypted.length - 8) / 16) * 16);
    if (size > body.length) {
        throw new InvalidPackageError('EncryptedPackage declares more data than it contains');
    }
    return cipher.ecbDecrypt(body).subarray(0, size);
}

function xorPad(hash: Uint8Array, pad: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(64).fill(pad);
    for (let i: number = 0; i < hash.length; i++) {
        out[i] ^= hash[i];
    }
    return out;
}

// ---------------------------------------------------------------------------
// DataSpaces storage (MS-OFFCRYPTO 2.3.4.x)
// ---------------------------------------------------------------------------

/** UNICODE-LP-P4: 32-bit byte length, UTF-16LE text, padded to a 4-byte boundary. */
function lpP4(text: string): Uint8Array {
    const body: Uint8Array = utf16le(text);
    return concat([u32le(body.length), padTo(body, 4)]);
}

function versionInfo(): Uint8Array {
    return new Uint8Array([1, 0, 0, 0]);
}

function dataSpaceStreams(): CfbStream[] {
    const dataSpace: string = 'StrongEncryptionDataSpace';
    const transform: string = 'StrongEncryptionTransform';
    const mapEntryBody: Uint8Array = concat([u32le(1), u32le(0), lpP4(ENCRYPTED_PACKAGE), lpP4(dataSpace)]);
    const mapEntry: Uint8Array = concat([u32le(mapEntryBody.length + 4), mapEntryBody]);
    const transformId: Uint8Array = lpP4('{FF9A3F03-56EF-4613-BDD5-5A41C1D07246}');
    return [
        {
            path: '\u0006DataSpaces/Version',
            data: concat([lpP4('Microsoft.Container.DataSpaces'), versionInfo(), versionInfo(), versionInfo()]),
        },
        { path: '\u0006DataSpaces/DataSpaceMap', data: concat([u32le(8), u32le(1), mapEntry]) },
        { path: '\u0006DataSpaces/DataSpaceInfo/' + dataSpace, data: concat([u32le(8), u32le(1), lpP4(transform)]) },
        {
            path: '\u0006DataSpaces/TransformInfo/' + transform + '/\u0006Primary',
            data: concat([
                u32le(8 + transformId.length), u32le(1), transformId, lpP4('Microsoft.Container.EncryptionTransform'),
                versionInfo(), versionInfo(), versionInfo(),
                // EncryptionTransformInfo: empty name, block size 0, cipher mode 0, reserved 4
                u32le(0), u32le(0), u32le(0), u32le(4),
            ]),
        },
    ];
}

// ---------------------------------------------------------------------------
// Public (internal) entry points
// ---------------------------------------------------------------------------

/**
 * Encrypts an OOXML (ZIP) package with a password, producing a CFB file.
 *
 * @param {Uint8Array} packageBytes - The plain `.xlsx` ZIP bytes.
 * @param {string} password - Open password (1–255 characters).
 * @returns {Uint8Array} The encrypted file bytes (ECMA-376 Agile, AES-256 / SHA-512).
 * @throws InvalidPasswordError when the password is empty or longer than 255 characters.
 */
export function encryptPackage(packageBytes: Uint8Array, password: string): Uint8Array {
    if (typeof password !== 'string' || password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
        throw new InvalidPasswordError('The open password must be 1 to ' + MAX_PASSWORD_LENGTH + ' characters long');
    }
    const algorithm: HashAlgorithm = 'SHA512';
    const keySalt: Uint8Array = secureRandomBytes(16);
    const passwordSalt: Uint8Array = secureRandomBytes(16);
    const intermediate: Uint8Array = secureRandomBytes(32);
    const verifierInput: Uint8Array = secureRandomBytes(16);
    const hmacSalt: Uint8Array = secureRandomBytes(64);

    // EncryptedPackage: 8-byte plain size, then 4096-byte CBC segments.
    const segments: number = Math.ceil(packageBytes.length / SEGMENT_SIZE);
    const encrypted: Uint8Array = new Uint8Array(8 + Math.ceil(packageBytes.length / 16) * 16);
    encrypted.set(u32le(packageBytes.length), 0);
    encrypted.set(u32le(Math.floor(packageBytes.length / 4294967296)), 4);
    const cipher: AesCipher = new AesCipher(intermediate);
    for (let i: number = 0; i < segments; i++) {
        const chunk: Uint8Array = padTo(packageBytes.subarray(i * SEGMENT_SIZE, (i + 1) * SEGMENT_SIZE), 16);
        encrypted.set(cipher.cbcEncrypt(segmentIv(keySalt, i, algorithm, 16), chunk), 8 + i * SEGMENT_SIZE);
    }

    // Password key encryptor.
    const hn: Uint8Array = iteratedHash(password, passwordSalt, algorithm, AGILE_SPIN_COUNT);
    const ivPwd: Uint8Array = passwordSalt;
    const encVerifierInput: Uint8Array = new AesCipher(agileKey(hn, BLOCK_VERIFIER_INPUT, algorithm, 256))
        .cbcEncrypt(ivPwd, verifierInput);
    const encVerifierValue: Uint8Array = new AesCipher(agileKey(hn, BLOCK_VERIFIER_VALUE, algorithm, 256))
        .cbcEncrypt(ivPwd, padTo(computeHash(algorithm, verifierInput), 16));
    const encKeyValue: Uint8Array = new AesCipher(agileKey(hn, BLOCK_KEY_VALUE, algorithm, 256))
        .cbcEncrypt(ivPwd, intermediate);

    // Data integrity.
    const hmac: Uint8Array = computeHmac(algorithm, hmacSalt, encrypted);
    const encHmacKey: Uint8Array = cipher.cbcEncrypt(blockIv(keySalt, BLOCK_HMAC_KEY, algorithm, 16), padTo(hmacSalt, 16));
    const encHmacValue: Uint8Array = cipher.cbcEncrypt(blockIv(keySalt, BLOCK_HMAC_VALUE, algorithm, 16), padTo(hmac, 16));

    const xml: Uint8Array = encodeUtf8(agileXml(
        keySalt, passwordSalt, AGILE_SPIN_COUNT, encVerifierInput, encVerifierValue, encKeyValue, encHmacKey, encHmacValue));
    const info: Uint8Array = concat([new Uint8Array([4, 0, 4, 0, 0x40, 0, 0, 0]), xml]);
    return writeCfb(dataSpaceStreams().concat([
        { path: ENCRYPTION_INFO, data: info },
        { path: ENCRYPTED_PACKAGE, data: encrypted },
    ]));
}

/**
 * Returns `true` when the bytes are a CFB container (an encrypted or legacy Office file) rather than a ZIP.
 *
 * @param {Uint8Array} data - File bytes.
 * @returns {boolean} Whether the file must be decrypted before it can be opened as OPC.
 */
export function isEncryptedContainer(data: Uint8Array): boolean {
    return isCfb(data);
}

/**
 * Decrypts a password-protected OOXML package.
 *
 * @param {Uint8Array} fileBytes - CFB file bytes.
 * @param {string} [password] - Open password. When omitted, Excel's default `VelvetSweatshop` password is tried.
 * @returns {Uint8Array} The plain `.xlsx` ZIP bytes.
 * @throws InvalidPasswordError when the password is missing or incorrect.
 * @throws UnsupportedEncryptionError when the file is not an encrypted OOXML package or uses an unsupported scheme.
 * @throws InvalidPackageError when the encrypted data is damaged.
 */
export function decryptPackage(fileBytes: Uint8Array, password?: string): Uint8Array {
    let streams: { [path: string]: Uint8Array };
    try {
        streams = readCfb(fileBytes);
    } catch (e) {
        throw new UnsupportedEncryptionError('Package is an OLE compound document that could not be read as an encrypted workbook', { cause: e });
    }
    const info: Uint8Array | undefined = streams[ENCRYPTION_INFO];
    const encrypted: Uint8Array | undefined = streams[ENCRYPTED_PACKAGE];
    if (info === undefined || encrypted === undefined || info.length < 8) {
        throw new UnsupportedEncryptionError('Package is a legacy Office binary file or has no encrypted OOXML package');
    }
    const major: number = info[0] | (info[1] << 8);
    const minor: number = info[2] | (info[3] << 8);
    let run: (pwd: string) => Uint8Array;
    if (major === 4 && minor === 4) {
        run = (pwd: string): Uint8Array => decryptAgile(info, encrypted, pwd);
    } else if ((major === 2 || major === 3 || major === 4) && minor === 2) {
        run = (pwd: string): Uint8Array => decryptStandard(info, encrypted, pwd);
    } else {
        throw new UnsupportedEncryptionError('Unsupported encryption version ' + major + '.' + minor);
    }
    if (password === undefined || password === null) {
        try {
            return run(DEFAULT_PASSWORD);
        } catch (e) {
            if (e instanceof InvalidPasswordError) {
                throw new InvalidPasswordError('The workbook is encrypted; a password is required to open it');
            }
            throw e;
        }
    }
    if (typeof password !== 'string') {
        throw new InvalidArgumentError('password must be a string');
    }
    return run(password);
}
