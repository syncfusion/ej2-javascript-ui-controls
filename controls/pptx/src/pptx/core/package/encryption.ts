/**
 * Password encryption and write protection for presentation packages.
 *
 * Cipher, key derivation, and password checks stay in
 * `@syncfusion/ej2-office-common`. This module only decides when to call that
 * engine and where `p:modifyVerifier` sits in PresentationML.
 *
 * Citations: [MS-OFFCRYPTO] §2.3.4 (Agile) via office-common;
 * Transitional `pml.xsd` `CT_Presentation` / `CT_ModifyVerifier`
 * (`modifyVerifier` follows `defaultTextStyle` and precedes `extLst`);
 * ECMA-376-1 §22.9.1.7 `ST_AlgClass` / `ST_AlgType` / `ST_CryptProv`.
 */
import {
    decryptPackage,
    encryptPackage,
    isEncryptedContainer,
    EncryptedPackageError as OfficeEncryptedPackageError,
    EncryptionArgumentError,
    InvalidPasswordError as OfficeInvalidPasswordError,
    PackageLimitError as OfficePackageLimitError,
    UnsupportedEncryptionError as OfficeUnsupportedEncryptionError
} from '@syncfusion/ej2-office-common';
import { EncryptedPackageError, InvalidPasswordError, PackageLimitError, UnsupportedEncryptionError } from '../security/errors';
import { OoxmlAttribute, OoxmlElement, OoxmlText } from '../xml/dom';
import { arrayAt } from '../util/es5-compat';

/** ECMA-376 `ST_AlgClass` hash. */
const ALG_CLASS_HASH: string = 'hash';
/** ECMA-376 `ST_AlgType` typeAny. */
const ALG_TYPE_ANY: string = 'typeAny';
/** ECMA-376 `ST_CryptProv` rsaAES — the provider PowerPoint writes for SHA-512. */
const CRYPT_PROVIDER_RSA_AES: string = 'rsaAES';
/**
 * Iterations on `p:modifyVerifier`. ECMA-376 §19.2.1.19 (`spinValue`) and the
 * ISO document-protection profile PowerPoint checks both use 100000.
 */
const WRITE_PROTECTION_SPIN_COUNT: number = 100000;
/** SHA-512 algorithm id PowerPoint stores on `cryptAlgorithmSid` for this profile. */
const SHA_512_SID: string = '14';

/**
 * Password applied on every {@link Presentation.save} until removed. Never logged.
 *
 * @internal
 */
export interface PendingEncryption {
    readonly password: string;
}

/**
 * True when the bytes are an OFFCRYPTO compound file rather than a plain ZIP.
 *
 * @internal
 * @param {Uint8Array} bytes - File bytes.
 * @returns {boolean} Whether office-common treats the bytes as an encrypted container.
 */
export function wasEncryptedContainer(bytes: Uint8Array): boolean {
    return isEncryptedContainer(bytes);
}

/**
 * Returns plain OPC bytes, decrypting an OFFCRYPTO container when `password` is set.
 *
 * @throws {EncryptedPackageError} CFB container opened without a password, or damaged ciphertext.
 * @throws {InvalidPasswordError} Password does not verify.
 * @throws {UnsupportedEncryptionError} Scheme this build does not decrypt.
 * @internal
 * @param {Uint8Array} bytes - File bytes.
 * @param {string | undefined} password - Open password, when the caller supplied one.
 * @param {number} maxOutputBytes - Decrypted-size cap.
 * @returns {Uint8Array} OPC ZIP bytes.
 */
export function decryptIfEncrypted(bytes: Uint8Array, password: string | undefined, maxOutputBytes: number): Uint8Array {
    if (!isEncryptedContainer(bytes)) {
        return bytes;
    }
    if (password === undefined || password.length === 0) {
        throw new EncryptedPackageError(
            'Package uses the OLE compound-file format (often OFFCRYPTO encryption); encrypted packages require a password to open'
        );
    }
    try {
        return decryptPackage(bytes, password, maxOutputBytes);
    } catch (error) {
        throw mapOfficeCryptoError(error);
    }
}

/**
 * Encrypts OPC ZIP bytes when a password is pending. Plain packages pass through.
 *
 * @throws {InvalidPasswordError} Password is empty or longer than the Office limit.
 * @internal
 * @param {Uint8Array} packageBytes - Plain OPC ZIP.
 * @param {PendingEncryption | undefined} pending - Password from {@link Presentation.encrypt}.
 * @returns {Uint8Array} CFB bytes when encrypting, otherwise `packageBytes`.
 */
export function encryptIfPending(packageBytes: Uint8Array, pending: PendingEncryption | undefined): Uint8Array {
    if (pending === undefined) {
        return packageBytes;
    }
    try {
        return encryptPackage(packageBytes, pending.password);
    } catch (error) {
        throw mapOfficeCryptoError(error instanceof Error ? error : new EncryptedPackageError('Encrypted package could not be read'));
    }
}

/**
 * Confirms a write-protection password is acceptable, using the same check as encrypt.
 *
 * @throws {InvalidPasswordError} Password is empty, too long, or not a string.
 * @internal
 * @param {string} password - Caller password.
 * @returns {void} Nothing.
 */
export function assertPasswordAcceptable(password: string): void {
    try {
        // office-common validates type and length before touching package bytes.
        encryptPackage(new Uint8Array(0), password);
    } catch (error) {
        throw mapOfficeCryptoError(error instanceof Error ? error : new InvalidPasswordError('Invalid password'));
    }
}

/**
 * True when `p:presentation` has a `p:modifyVerifier` child (write protection).
 *
 * @internal
 * @param {OoxmlElement} root - Presentation root.
 * @returns {boolean} Whether write-protection markup is present.
 */
export function hasModifyVerifier(root: OoxmlElement): boolean {
    return indexOfVerifier(root) >= 0;
}

/**
 * Inserts or replaces `p:modifyVerifier`.
 *
 * PowerPoint verifies `hashData`, not `hashValue` ([MS-OI29500] §2.1.1104):
 * `H0 = SHA-512(salt ‖ UTF-16LE password)`, then `spinCount` rounds of
 * `Hn = SHA-512(H(n-1) ‖ iterator)` with the iterator a 0-based little-endian
 * uint32 that is not counted in the initial hash. The ISO attributes
 * (`algorithmName`, `hashValue`, `saltValue`, `spinValue`) carry the same
 * values. The password is not stored.
 *
 * @internal
 * @param {OoxmlElement} root - Presentation root (mutated).
 * @param {string} password - Write-protection password.
 * @returns {void} Nothing.
 */
export function applyModifyVerifier(root: OoxmlElement, password: string): void {
    assertPasswordAcceptable(password);
    const salt: Uint8Array = randomSalt(16);
    const hash: Uint8Array = agilePasswordHash(password, salt, WRITE_PROTECTION_SPIN_COUNT);
    const saltText: string = toBase64(salt);
    const hashText: string = toBase64(hash);
    const spins: string = String(WRITE_PROTECTION_SPIN_COUNT);
    const verifier: OoxmlElement = {
        kind: 'element',
        namespaceUri: root.namespaceUri,
        localName: 'modifyVerifier',
        prefixHint: root.prefixHint,
        attributes: [
            attr('algorithmName', 'SHA-512'),
            attr('hashValue', hashText),
            attr('saltValue', saltText),
            attr('spinValue', spins),
            attr('cryptProviderType', CRYPT_PROVIDER_RSA_AES),
            attr('cryptAlgorithmClass', ALG_CLASS_HASH),
            attr('cryptAlgorithmType', ALG_TYPE_ANY),
            attr('cryptAlgorithmSid', SHA_512_SID),
            attr('spinCount', spins),
            attr('saltData', saltText),
            attr('hashData', hashText)
        ],
        children: []
    };
    const children: Array<OoxmlElement | OoxmlText> = root.children.slice();
    const existing: number = indexOfVerifier(root);
    const next: Array<OoxmlElement | OoxmlText> = [];
    for (let i: number = 0; i < children.length; i++) {
        next.push(existing === i ? verifier : arrayAt(children, i));
    }
    if (existing < 0) {
        const at: number = insertionIndex(root);
        next.splice(at, 0, verifier);
    }
    (root as unknown as { children: Array<OoxmlElement | OoxmlText> }).children = next;
}

/**
 * Removes `p:modifyVerifier` when present. Other children keep their order.
 *
 * @internal
 * @param {OoxmlElement} root - Presentation root (mutated).
 * @returns {void} Nothing.
 */
export function removeModifyVerifier(root: OoxmlElement): void {
    const index: number = indexOfVerifier(root);
    if (index < 0) {
        return;
    }
    const children: Array<OoxmlElement | OoxmlText> = root.children.slice();
    children.splice(index, 1);
    (root as unknown as { children: Array<OoxmlElement | OoxmlText> }).children = children;
}

/**
 * Maps office-common encryption errors onto this library's public error classes.
 *
 * @param {Error} error - Thrown value.
 * @returns {Error} Public error.
 */
function mapOfficeCryptoError(error: Error): Error {
    if (error instanceof OfficeInvalidPasswordError || error instanceof EncryptionArgumentError) {
        return new InvalidPasswordError('Invalid password');
    }
    if (error instanceof OfficeUnsupportedEncryptionError) {
        return new UnsupportedEncryptionError(error.message);
    }
    if (error instanceof OfficePackageLimitError) {
        return new PackageLimitError('singlePartUncompressedBytes', {
            actual: error.actual
        });
    }
    if (error instanceof OfficeEncryptedPackageError) {
        return new EncryptedPackageError(error.message);
    }
    return error;
}

/**
 * [MS-OI29500] §2.1.1104: SHA-512(salt || UTF-16LE password), then spinCount
 * rounds of SHA-512(previous || iterator LE). The initial hash is not counted.
 *
 * @param {string} password - Password.
 * @param {Uint8Array} salt - Salt.
 * @param {number} spinCount - Iterations.
 * @returns {Uint8Array} Digest.
 */
function agilePasswordHash(password: string, salt: Uint8Array, spinCount: number): Uint8Array {
    const passwordBytes: Uint8Array = encodeUtf16Le(password);
    let hash: Uint8Array = sha512(concat(salt, passwordBytes));
    const block: Uint8Array = new Uint8Array(64 + 4);
    for (let i: number = 0; i < spinCount; i++) {
        block.set(hash, 0);
        block[64] = i & 0xff;
        block[65] = (i >>> 8) & 0xff;
        block[66] = (i >>> 16) & 0xff;
        block[67] = (i >>> 24) & 0xff;
        hash = sha512(block);
    }
    return hash;
}

/**
 * Salt for `p:modifyVerifier`, from the host Web Crypto random source.
 * No Node `crypto` module. Browsers and current Node expose this on `crypto`.
 *
 * @param {number} size - Byte length.
 * @returns {Uint8Array} Salt.
 */
function randomSalt(size: number): Uint8Array {
    const out: Uint8Array = new Uint8Array(size);
    const hostCrypto: { getRandomValues?: (bytes: Uint8Array) => Uint8Array } | undefined =
        typeof crypto === 'undefined' ? undefined : crypto;
    if (hostCrypto === undefined || typeof hostCrypto.getRandomValues !== 'function') {
        throw new EncryptedPackageError('Write protection requires a cryptographic random source');
    }
    hostCrypto.getRandomValues(out);
    return out;
}

/** FIPS 180-4 SHA-512 round constants, high word then low word. */
const SHA512_K: number[] = [
    0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
    0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
    0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe, 0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
    0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
    0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
    0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
    0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
    0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725, 0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
    0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
    0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
    0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
    0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
    0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53, 0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
    0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
    0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
    0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
    0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
    0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6, 0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
    0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
    0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

/** Int32 view of {@link SHA512_K}, interleaved high/low per round constant. */
const SHA512_K32: Int32Array = new Int32Array(SHA512_K);

/** Initial hash value, interleaved high/low (FIPS 180-4 §5.3.5). */
const SHA512_H0: Int32Array = new Int32Array([
    0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b, 0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f, 0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179
]);

/** Hash state, 8 words as interleaved high/low. Reused across calls. */
const sha512State: Int32Array = new Int32Array(16);

/** Message schedule, 80 words as interleaved high/low. Reused across calls. */
const sha512Schedule: Int32Array = new Int32Array(160);

/** Padded block scratch for inputs of at most 111 bytes (one block). */
const sha512Block: Uint8Array = new Uint8Array(128);

/* eslint-disable security/detect-object-injection */
/**
 * SHA-512 (FIPS 180-4) in 32-bit arithmetic. ES5 has no `BigInt`, so each
 * 64-bit word is a high/low pair held in an `Int32Array`. The compression loop
 * does not allocate: every 64-bit add, rotate, shift, xor, Ch and Maj is inlined
 * on local numbers. This is the hash `p:modifyVerifier` names
 * (`cryptAlgorithmSid` 14); package encryption itself stays in office-common.
 *
 * @param {Uint8Array} data - Input.
 * @returns {Uint8Array} 64-byte digest.
 */
function sha512(data: Uint8Array): Uint8Array {
    const length: number = data.length;
    const total: number = length + 1 + ((128 - ((length + 1 + 16) % 128)) % 128) + 16;
    let msg: Uint8Array = sha512Block;
    if (total === 128) {
        for (let z: number = 0; z < 128; z++) {
            msg[z] = 0;
        }
    } else {
        msg = new Uint8Array(total);
    }
    msg.set(data, 0);
    msg[length] = 0x80;
    const bitLength: number = length * 8;
    const bitHigh: number = Math.floor(bitLength / 0x100000000);
    const bitLow: number = bitLength >>> 0;
    msg[total - 8] = (bitHigh >>> 24) & 0xff;
    msg[total - 7] = (bitHigh >>> 16) & 0xff;
    msg[total - 6] = (bitHigh >>> 8) & 0xff;
    msg[total - 5] = bitHigh & 0xff;
    msg[total - 4] = (bitLow >>> 24) & 0xff;
    msg[total - 3] = (bitLow >>> 16) & 0xff;
    msg[total - 2] = (bitLow >>> 8) & 0xff;
    msg[total - 1] = bitLow & 0xff;
    const state: Int32Array = sha512State;
    const w: Int32Array = sha512Schedule;
    const k: Int32Array = SHA512_K32;
    state.set(SHA512_H0);
    for (let off: number = 0; off < total; off += 128) {
        for (let i: number = 0; i < 32; i++) {
            const b: number = off + i * 4;
            w[i] = (msg[b] << 24) | (msg[b + 1] << 16) | (msg[b + 2] << 8) | msg[b + 3];
        }
        for (let i: number = 16; i < 80; i++) {
            const i15: number = (i - 15) * 2;
            const xHi: number = w[i15];
            const xLo: number = w[i15 + 1];
            // sigma0 = ROTR1 ^ ROTR8 ^ SHR7
            const s0Hi: number = ((xHi >>> 1) | (xLo << 31)) ^ ((xHi >>> 8) | (xLo << 24)) ^ (xHi >>> 7);
            const s0Lo: number = ((xLo >>> 1) | (xHi << 31)) ^ ((xLo >>> 8) | (xHi << 24)) ^ ((xLo >>> 7) | (xHi << 25));
            const i2: number = (i - 2) * 2;
            const yHi: number = w[i2];
            const yLo: number = w[i2 + 1];
            // sigma1 = ROTR19 ^ ROTR61 ^ SHR6
            const s1Hi: number = ((yHi >>> 19) | (yLo << 13)) ^ ((yLo >>> 29) | (yHi << 3)) ^ (yHi >>> 6);
            const s1Lo: number = ((yLo >>> 19) | (yHi << 13)) ^ ((yHi >>> 29) | (yLo << 3)) ^ ((yLo >>> 6) | (yHi << 26));
            const i16: number = (i - 16) * 2;
            const i7: number = (i - 7) * 2;
            const lo1: number = (w[i16 + 1] >>> 0) + (s0Lo >>> 0);
            const lo2: number = (w[i7 + 1] >>> 0) + (s1Lo >>> 0);
            const lo3: number = (lo1 >>> 0) + (lo2 >>> 0);
            w[i * 2 + 1] = lo3 | 0;
            w[i * 2] = (w[i16] + s0Hi + (lo1 > 0xffffffff ? 1 : 0) + w[i7] + s1Hi + (lo2 > 0xffffffff ? 1 : 0) +
                (lo3 > 0xffffffff ? 1 : 0)) | 0;
        }
        let aHi: number = state[0];
        let aLo: number = state[1];
        let bHi: number = state[2];
        let bLo: number = state[3];
        let cHi: number = state[4];
        let cLo: number = state[5];
        let dHi: number = state[6];
        let dLo: number = state[7];
        let eHi: number = state[8];
        let eLo: number = state[9];
        let fHi: number = state[10];
        let fLo: number = state[11];
        let gHi: number = state[12];
        let gLo: number = state[13];
        let hHi: number = state[14];
        let hLo: number = state[15];
        for (let i: number = 0; i < 80; i++) {
            // Sigma1(e) = ROTR14 ^ ROTR18 ^ ROTR41
            const S1Hi: number = ((eHi >>> 14) | (eLo << 18)) ^ ((eHi >>> 18) | (eLo << 14)) ^ ((eLo >>> 9) | (eHi << 23));
            const S1Lo: number = ((eLo >>> 14) | (eHi << 18)) ^ ((eLo >>> 18) | (eHi << 14)) ^ ((eHi >>> 9) | (eLo << 23));
            const chHi: number = (eHi & fHi) ^ (~eHi & gHi);
            const chLo: number = (eLo & fLo) ^ (~eLo & gLo);
            const t1a: number = (hLo >>> 0) + (S1Lo >>> 0) + (chLo >>> 0) + (k[i * 2 + 1] >>> 0) + (w[i * 2 + 1] >>> 0);
            const t1Lo: number = t1a | 0;
            const t1Hi: number = (hHi + S1Hi + chHi + k[i * 2] + w[i * 2] + Math.floor(t1a / 0x100000000)) | 0;
            // Sigma0(a) = ROTR28 ^ ROTR34 ^ ROTR39
            const S0Hi: number = ((aHi >>> 28) | (aLo << 4)) ^ ((aLo >>> 2) | (aHi << 30)) ^ ((aLo >>> 7) | (aHi << 25));
            const S0Lo: number = ((aLo >>> 28) | (aHi << 4)) ^ ((aHi >>> 2) | (aLo << 30)) ^ ((aHi >>> 7) | (aLo << 25));
            const majHi: number = (aHi & bHi) ^ (aHi & cHi) ^ (bHi & cHi);
            const majLo: number = (aLo & bLo) ^ (aLo & cLo) ^ (bLo & cLo);
            const t2a: number = (S0Lo >>> 0) + (majLo >>> 0);
            const t2Lo: number = t2a | 0;
            const t2Hi: number = (S0Hi + majHi + Math.floor(t2a / 0x100000000)) | 0;
            hHi = gHi;
            hLo = gLo;
            gHi = fHi;
            gLo = fLo;
            fHi = eHi;
            fLo = eLo;
            const ea: number = (dLo >>> 0) + (t1Lo >>> 0);
            eLo = ea | 0;
            eHi = (dHi + t1Hi + Math.floor(ea / 0x100000000)) | 0;
            dHi = cHi;
            dLo = cLo;
            cHi = bHi;
            cLo = bLo;
            bHi = aHi;
            bLo = aLo;
            const aa: number = (t1Lo >>> 0) + (t2Lo >>> 0);
            aLo = aa | 0;
            aHi = (t1Hi + t2Hi + Math.floor(aa / 0x100000000)) | 0;
        }
        const sa: number = (state[1] >>> 0) + (aLo >>> 0);
        state[1] = sa | 0;
        state[0] = (state[0] + aHi + Math.floor(sa / 0x100000000)) | 0;
        const sb: number = (state[3] >>> 0) + (bLo >>> 0);
        state[3] = sb | 0;
        state[2] = (state[2] + bHi + Math.floor(sb / 0x100000000)) | 0;
        const sc: number = (state[5] >>> 0) + (cLo >>> 0);
        state[5] = sc | 0;
        state[4] = (state[4] + cHi + Math.floor(sc / 0x100000000)) | 0;
        const sd: number = (state[7] >>> 0) + (dLo >>> 0);
        state[7] = sd | 0;
        state[6] = (state[6] + dHi + Math.floor(sd / 0x100000000)) | 0;
        const se: number = (state[9] >>> 0) + (eLo >>> 0);
        state[9] = se | 0;
        state[8] = (state[8] + eHi + Math.floor(se / 0x100000000)) | 0;
        const sf: number = (state[11] >>> 0) + (fLo >>> 0);
        state[11] = sf | 0;
        state[10] = (state[10] + fHi + Math.floor(sf / 0x100000000)) | 0;
        const sg: number = (state[13] >>> 0) + (gLo >>> 0);
        state[13] = sg | 0;
        state[12] = (state[12] + gHi + Math.floor(sg / 0x100000000)) | 0;
        const sh: number = (state[15] >>> 0) + (hLo >>> 0);
        state[15] = sh | 0;
        state[14] = (state[14] + hHi + Math.floor(sh / 0x100000000)) | 0;
    }
    const out: Uint8Array = new Uint8Array(64);
    for (let i: number = 0; i < 16; i++) {
        const v: number = state[i];
        out[i * 4] = (v >>> 24) & 0xff;
        out[i * 4 + 1] = (v >>> 16) & 0xff;
        out[i * 4 + 2] = (v >>> 8) & 0xff;
        out[i * 4 + 3] = v & 0xff;
    }
    return out;
}
/* eslint-enable security/detect-object-injection */

/**
 * @param {string} value - Password.
 * @returns {Uint8Array} UTF-16LE bytes, no BOM.
 */
function encodeUtf16Le(value: string): Uint8Array {
    let text: string = value;
    if (text.length > 0 && text.charCodeAt(0) === 0xfeff) {
        text = text.substring(1);
    }
    const maxChars: number = 255;
    if (text.length > maxChars) {
        text = text.substring(0, maxChars);
    }
    const out: Uint8Array = new Uint8Array(text.length * 2);
    for (let i: number = 0; i < text.length; i++) {
        const code: number = text.charCodeAt(i);
        out[i * 2] = code & 0xff;
        out[i * 2 + 1] = (code >>> 8) & 0xff;
    }
    return out;
}

/**
 * @param {Uint8Array} a - Left.
 * @param {Uint8Array} b - Right.
 * @returns {Uint8Array} Concatenation.
 */
function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
    const out: Uint8Array = new Uint8Array(a.length + b.length);
    out.set(a, 0);
    out.set(b, a.length);
    return out;
}

/**
 * @param {Uint8Array} bytes - Raw bytes.
 * @returns {string} Base64.
 */
function toBase64(bytes: Uint8Array): string {
    const alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let out: string = '';
    for (let i: number = 0; i < bytes.length; i += 3) {
        const b0: number = arrayAt(bytes, i);
        const b1: number = i + 1 < bytes.length ? arrayAt(bytes, i + 1) : 0;
        const b2: number = i + 2 < bytes.length ? arrayAt(bytes, i + 2) : 0;
        out += alphabet.charAt(b0 >> 2) + alphabet.charAt(((b0 & 3) << 4) | (b1 >> 4));
        out += i + 1 < bytes.length ? alphabet.charAt(((b1 & 15) << 2) | (b2 >> 6)) : '=';
        out += i + 2 < bytes.length ? alphabet.charAt(b2 & 63) : '=';
    }
    return out;
}

/**
 * @param {string} localName - Attribute name (no namespace).
 * @param {string} value - Attribute value.
 * @returns {OoxmlAttribute} Attribute node.
 */
function attr(localName: string, value: string): OoxmlAttribute {
    return { namespaceUri: '', localName, value };
}

/**
 * @param {OoxmlElement} root - Presentation root.
 * @returns {number} Child index, or -1.
 */
function indexOfVerifier(root: OoxmlElement): number {
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind === 'element' && child.namespaceUri === root.namespaceUri && child.localName === 'modifyVerifier') {
            return i;
        }
    }
    return -1;
}

/**
 * Schema order: `modifyVerifier` immediately before `extLst`, else at the end.
 *
 * @param {OoxmlElement} root - Presentation root.
 * @returns {number} Insertion index.
 */
function insertionIndex(root: OoxmlElement): number {
    for (let i: number = 0; i < root.children.length; i++) {
        const child: OoxmlElement | OoxmlText = arrayAt(root.children, i);
        if (child.kind === 'element' && child.namespaceUri === root.namespaceUri && child.localName === 'extLst') {
            return i;
        }
    }
    return root.children.length;
}
