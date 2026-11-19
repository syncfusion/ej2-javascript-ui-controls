/*
 * Decrypt EncryptedPackage stream ([MS-OFFCRYPTO] §2.3.4.4, §2.3.4.15)
 * and optional DataIntegrity HMAC (§2.3.4.14).
 *
 * @remarks
 * Layout: 8-byte little-endian StreamSize (u64) + encrypted payload.
 * Payload is segmented in 4096-byte blocks; each segment uses blockKey =
 * segment number as LE u32 with KeyData.saltValue for the IV
 * (§2.3.4.12 / §2.3.4.15). Secret key is the intermediate key from the
 * password key encryptor.
 *
 * DataIntegrity: decrypt encryptedHmacKey with blockKey BLOCK_KEY_HMAC_KEY
 * and KeyData; decrypt encryptedHmacValue with BLOCK_KEY_HMAC_VALUE; HMAC
 * the **entire** EncryptedPackage stream (including StreamSize prefix)
 * with KeyData.hashAlgorithm; compare → fail closed as InvalidPasswordError.
 *
 * @private
 */

import { Literal } from '../core/literal-type';
import {
    EncryptedPackageError,
    InvalidPasswordError,
    PackageLimitError,
    DecryptSecurityLimits
} from './errors';
import {
    BLOCK_KEY_HMAC_KEY,
    BLOCK_KEY_HMAC_VALUE,
    ENCRYPTED_PACKAGE_SEGMENT_SIZE
} from './agile-constants';
import { AgileDataIntegrity, AgileKeyData } from './agile-encryption-info';
import {
    aesCbcDecrypt,
    deriveAgileIv,
    hashDigestLength,
    hmacBytes,
    timingSafeEqual
} from './crypto-primitives';

const STREAM_SIZE_BYTES: Literal<8> = 8;

/**
 * Decrypts EncryptedPackage ciphertext to plain OPC ZIP bytes.
 *
 * @param {Uint8Array} encryptedPackage - Full EncryptedPackage stream bytes.
 * @param {Uint8Array} secretKey - Intermediate key from password unlock (keyBits/8).
 * @param {AgileKeyData} keyData - KeyData from EncryptionInfo.
 * @param {AgileDataIntegrity | undefined} dataIntegrity - Optional integrity structure.
 * @param {DecryptSecurityLimits} limits - Security limits (single-part / total uncompressed caps).
 * @returns {Uint8Array} The result.
 * @throws {PackageLimitError} When StreamSize or ciphertext exceeds limits.
 * @throws {InvalidPasswordError} When DataIntegrity HMAC fails (fail-closed).
 * @throws {EncryptedPackageError} When stream structure is invalid.
 */
export function decryptEncryptedPackageStream(
    encryptedPackage: Uint8Array,
    secretKey: Uint8Array,
    keyData: AgileKeyData,
    dataIntegrity: AgileDataIntegrity | undefined,
    limits: DecryptSecurityLimits
): Uint8Array {
    if (encryptedPackage.byteLength < STREAM_SIZE_BYTES) {
        throw new EncryptedPackageError('EncryptedPackage stream is truncated');
    }

    // Hard cap ciphertext before any crypto work.
    const maxCipher: number = Math.max(limits.singlePartUncompressedBytes, limits.totalUncompressedBytes);
    if (
        encryptedPackage.byteLength >
    maxCipher + STREAM_SIZE_BYTES + ENCRYPTED_PACKAGE_SEGMENT_SIZE
    ) {
        throw new PackageLimitError('singlePartUncompressedBytes', {
            actual: encryptedPackage.byteLength
        });
    }

    const view: DataView = new DataView(
        encryptedPackage.buffer,
        encryptedPackage.byteOffset,
        encryptedPackage.byteLength
    );
    // StreamSize is u64 LE; JS safe integer covers realistic packages under limits.
    const streamSizeLow: number = view.getUint32(0, true);
    const streamSizeHigh: number = view.getUint32(4, true);
    if (streamSizeHigh !== 0) {
        throw new PackageLimitError('singlePartUncompressedBytes', {
            actual: Number.MAX_SAFE_INTEGER
        });
    }
    const streamSize: number = streamSizeLow;

    if (streamSize > limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', { actual: streamSize });
    }
    if (streamSize > limits.totalUncompressedBytes) {
        throw new PackageLimitError('totalUncompressedBytes', { actual: streamSize });
    }

    const ciphertext: Uint8Array = encryptedPackage.subarray(STREAM_SIZE_BYTES);
    if (ciphertext.byteLength === 0 && streamSize > 0) {
        throw new EncryptedPackageError('EncryptedPackage has StreamSize but no ciphertext');
    }

    // DataIntegrity over entire EncryptedPackage including StreamSize (§2.3.4.14).
    if (dataIntegrity !== undefined) {
        verifyDataIntegrity(encryptedPackage, secretKey, keyData, dataIntegrity);
    }

    const plain: Uint8Array = decryptSegments(ciphertext, secretKey, keyData);

    if (plain.byteLength < streamSize) {
        throw new EncryptedPackageError('Decrypted EncryptedPackage is shorter than StreamSize');
    }
    return plain.subarray(0, streamSize);
}

/**
 * The decrypt segments.
 *
 * @param {Uint8Array} ciphertext - The ciphertext.
 * @param {Uint8Array} secretKey - The secret key.
 * @param {AgileKeyData} keyData - The key data.
 * @returns {Uint8Array} The result.
 */
function decryptSegments(
    ciphertext: Uint8Array,
    secretKey: Uint8Array,
    keyData: AgileKeyData
): Uint8Array {
    const segmentSize: Literal<4096> = ENCRYPTED_PACKAGE_SEGMENT_SIZE;
    const blockSize: number = keyData.blockSize;
    const out: Uint8Array = new Uint8Array(ciphertext.byteLength);
    let outOffset: number = 0;
    let segmentIndex: number = 0;
    let offset: number = 0;

    while (offset < ciphertext.byteLength) {
        const remaining: number = ciphertext.byteLength - offset;
        // Last segment may be shorter but must still be block-aligned (zero-pad encrypt).
        const segmentLen: number = remaining > segmentSize ? segmentSize : remaining;
        // If not last full logical segment and remaining > segmentSize we took segmentSize.
        // Ciphertext of each segment is rounded up to blockSize on encrypt; remaining should
        // already be multiple of blockSize for every piece.
        if (segmentLen % blockSize !== 0) {
            // Pad expectation: encryptor wrote full blocks; tolerate by rounding down if corrupt.
            throw new EncryptedPackageError('EncryptedPackage segment is not block-aligned');
        }

        const segmentCt: Uint8Array = ciphertext.subarray(offset, offset + segmentLen);
        const blockKey: Uint8Array = segmentBlockKey(segmentIndex);
        const iv: Uint8Array = deriveAgileIv(keyData.hashAlgorithm, keyData.saltValue, blockKey, blockSize);
        const segmentPt: Uint8Array = aesCbcDecrypt(secretKey, iv, segmentCt);
        out.set(segmentPt, outOffset);
        outOffset += segmentPt.byteLength;
        offset += segmentLen;
        segmentIndex += 1;
    }

    return out.subarray(0, outOffset);
}

/**
 * The segment block key.
 *
 * @param {number} segmentIndex - The segment index.
 * @returns {Uint8Array} The result.
 */
function segmentBlockKey(segmentIndex: number): Uint8Array {
    const buf: Uint8Array = new Uint8Array(4);
    new DataView(buf.buffer).setUint32(0, segmentIndex >>> 0, true);
    return buf;
}

/**
 * §2.3.4.14 DataIntegrity verification.
 *
 * Fail-closed: HMAC mismatch → InvalidPasswordError (same public class as wrong
 * password; do not leak integrity vs password distinction).
 *
 * @param {Uint8Array} encryptedPackage - The encrypted package.
 * @param {Uint8Array} secretKey - The secret key.
 * @param {AgileKeyData} keyData - The key data.
 * @param {AgileDataIntegrity} dataIntegrity - The data integrity.
 * @returns {void} Nothing is returned.
 */
function verifyDataIntegrity(
    encryptedPackage: Uint8Array,
    secretKey: Uint8Array,
    keyData: AgileKeyData,
    dataIntegrity: AgileDataIntegrity
): void {
    const { hashAlgorithm, saltValue, blockSize } = keyData;

    const ivHmacKey: Uint8Array = deriveAgileIv(hashAlgorithm, saltValue, BLOCK_KEY_HMAC_KEY, blockSize);
    const hmacKeyDecrypted: Uint8Array = aesCbcDecrypt(secretKey, ivHmacKey, dataIntegrity.encryptedHmacKey);
    // HMAC key length is hash digest size; truncated after decrypt (zero-padded block).
    const digestLen: number = hashDigestLength(hashAlgorithm);
    if (hmacKeyDecrypted.byteLength < digestLen) {
        throw new InvalidPasswordError();
    }
    const hmacKey: Uint8Array = hmacKeyDecrypted.subarray(0, digestLen);

    const ivHmacValue: Uint8Array = deriveAgileIv(hashAlgorithm, saltValue, BLOCK_KEY_HMAC_VALUE, blockSize);
    const hmacValueDecrypted: Uint8Array = aesCbcDecrypt(
        secretKey,
        ivHmacValue,
        dataIntegrity.encryptedHmacValue
    );
    if (hmacValueDecrypted.byteLength < digestLen) {
        throw new InvalidPasswordError();
    }
    const expectedHmac: Uint8Array = hmacValueDecrypted.subarray(0, digestLen);

    const actualHmac: Uint8Array = hmacBytes(hashAlgorithm, hmacKey, encryptedPackage);
    if (!timingSafeEqual(actualHmac.subarray(0, digestLen), expectedHmac)) {
        throw new InvalidPasswordError();
    }
}
