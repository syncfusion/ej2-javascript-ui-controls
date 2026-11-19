/**
 * Shared OFFCRYPTO Agile password decrypt for Office Open XML packages.
 *
 * @remarks
 * Implements [MS-OFFCRYPTO] Agile EncryptionInfo (4.4) + password keyEncryptor
 * + AES-CBC EncryptedPackage segment decrypt. Consumed by PowerPoint and other
 * Office libraries via `@syncfusion/ej2-office-common`.
 * @packageDocumentation
 */

import { parseAgileEncryptionInfo, AgileEncryptionInfo } from './agile-encryption-info';
import { unlockIntermediateKey } from './agile-password';
import { readOffCryptoStreams, OffCryptoStreams } from './cfb-reader';
import { decryptEncryptedPackageStream } from './decrypt-encrypted-package';
import {
    DEFAULT_DECRYPT_SECURITY_LIMITS,
    resolveDecryptLimits,
    DecryptSecurityLimits
} from './errors';

/** OLE CFB header signature used by ECMA-376 OFFCRYPTO packages ([MS-CFB]). */
const OLE_CFB_SIGNATURE: ReadonlyArray<number> = Object.freeze([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);

/**
 * Returns whether `input` begins with the OLE compound-file signature used by
 * ECMA-376 OFFCRYPTO packages.
 *
 * @param {Uint8Array | ArrayBuffer} input - Entire package bytes.
 * @returns {boolean} `true` when the CFB signature matches.
 * @public
 */
export function isOffCryptoPackage(input: Uint8Array | ArrayBuffer): boolean {
    const bytes: Uint8Array = input instanceof Uint8Array ? input : new Uint8Array(input);
    if (bytes.byteLength < OLE_CFB_SIGNATURE.length) {
        return false;
    }
    const head: number[] = Array.prototype.slice.call(bytes, 0, OLE_CFB_SIGNATURE.length);
    return head.join(',') === OLE_CFB_SIGNATURE.join(',');
}

/**
 * Decrypts an OFFCRYPTO OLE CFB package to OPC ZIP bytes.
 *
 * @param {Uint8Array} input - Entire encrypted package bytes (CFB).
 * @param {string} password - Consumer password (never logged; not retained).
 * @param {DecryptSecurityLimits} limits - Decrypt size / XML guards (duck-types broader SecurityLimits).
 * @returns {Promise<Uint8Array>} Decrypted OPC package bytes.
 * @public
 */
export async function decryptOffCryptoPackage(
    input: Uint8Array,
    password: string,
    limits: DecryptSecurityLimits = DEFAULT_DECRYPT_SECURITY_LIMITS
): Promise<Uint8Array> {
    const resolved: DecryptSecurityLimits = resolveDecryptLimits(limits);
    const streams: OffCryptoStreams = readOffCryptoStreams(input);
    const info: AgileEncryptionInfo = parseAgileEncryptionInfo(streams.encryptionInfo, resolved);
    const secretKey: Uint8Array = unlockIntermediateKey(password, info.passwordKeyEncryptor);
    return decryptEncryptedPackageStream(
        streams.encryptedPackage,
        secretKey,
        info.keyData,
        info.dataIntegrity,
        resolved
    );
}

export {
    DEFAULT_DECRYPT_SECURITY_LIMITS,
    EncryptedPackageError,
    InvalidPasswordError,
    PackageLimitError,
    resolveDecryptLimits,
    UnsupportedEncryptionError,
    DecryptSecurityLimits,
    SecurityErrorOptions
} from './errors';

// Re-export internals needed by test fixtures / host encrypt harnesses.
export {
    AGILE_ENCRYPTION_NS,
    AGILE_RESERVED,
    AGILE_VERSION_MAJOR,
    AGILE_VERSION_MINOR,
    BLOCK_KEY_ENCRYPTOR_KEY,
    BLOCK_KEY_HMAC_KEY,
    BLOCK_KEY_HMAC_VALUE,
    BLOCK_KEY_VERIFIER_HASH,
    BLOCK_KEY_VERIFIER_INPUT,
    ENCRYPTED_PACKAGE_SEGMENT_SIZE,
    PASSWORD_KEY_ENCRYPTOR_NS,
    PASSWORD_KEY_ENCRYPTOR_URI,
    STREAM_ENCRYPTED_PACKAGE,
    STREAM_ENCRYPTION_INFO
} from './agile-constants';

export {
    aesCbcDecrypt,
    aesCbcEncrypt,
    concatBytes,
    deriveAgileIv,
    deriveAgileKey,
    encodePasswordUtf16Le,
    hashBytes,
    hashDigestLength,
    hmacBytes,
    timingSafeEqual,
    AgileHashName
} from './crypto-primitives';
