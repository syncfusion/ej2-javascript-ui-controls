/**
 * Shared OFFCRYPTO (MS-OFFCRYPTO) password encryption for Office Open XML packages.
 *
 * @remarks
 * One pure-TypeScript engine for browsers and Node.js:
 * Agile encrypt and decrypt, Standard (AES-ECB / SHA-1) decrypt, and an
 * MS-CFB reader/writer. Consumed by Excel, PowerPoint and other Office libraries.
 * The legacy async `decryptOffCryptoPackage` and its helper names are kept as
 * thin adapters over the same engine.
 *
 * @packageDocumentation
 */

export { encryptPackage, decryptPackage, isEncryptedContainer, MAX_PASSWORD_LENGTH } from './office-crypto';
export { CfbStream, isCfb, readCfb, writeCfb } from './cfb';
export { secureRandomBytes } from './random';
export {
    DEFAULT_DECRYPT_SECURITY_LIMITS,
    EncryptedPackageError,
    EncryptionArgumentError,
    EncryptionErrorCode,
    EncryptionErrorOptions,
    InvalidPasswordError,
    PackageLimitError,
    resolveDecryptLimits,
    UnsupportedEncryptionError,
    DecryptSecurityLimits,
    SecurityErrorOptions
} from './errors';
export {
    AGILE_ENCRYPTION_NS,
    AGILE_RESERVED,
    AGILE_VERSION_MAJOR,
    AGILE_VERSION_MINOR,
    AgileHashName,
    BLOCK_KEY_ENCRYPTOR_KEY,
    BLOCK_KEY_HMAC_KEY,
    BLOCK_KEY_HMAC_VALUE,
    BLOCK_KEY_VERIFIER_HASH,
    BLOCK_KEY_VERIFIER_INPUT,
    ENCRYPTED_PACKAGE_SEGMENT_SIZE,
    PASSWORD_KEY_ENCRYPTOR_NS,
    PASSWORD_KEY_ENCRYPTOR_URI,
    STREAM_ENCRYPTED_PACKAGE,
    STREAM_ENCRYPTION_INFO,
    aesCbcDecrypt,
    aesCbcEncrypt,
    concatBytes,
    decryptOffCryptoPackage,
    deriveAgileIv,
    deriveAgileKey,
    encodePasswordUtf16Le,
    hashBytes,
    hashDigestLength,
    hmacBytes,
    isOffCryptoPackage,
    timingSafeEqual
} from './legacy';
