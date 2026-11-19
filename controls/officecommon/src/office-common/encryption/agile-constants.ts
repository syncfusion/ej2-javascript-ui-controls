/*
 * Agile OFFCRYPTO constants cited from local [MS-OFFCRYPTO].
 *
 * @remarks
 * Never invent algorithm URIs, element names, or block keys. All values below
 * are taken from `specs/microsoft/[MS-OFFCRYPTO].md` §2.3.4.10–§2.3.4.15.
 * Re-exported from the encryption public surface for fixture / host harness use.
 *
 * @packageDocumentation
 */

import { Literal } from '../core/literal-type';
/**
 * EncryptionVersionInfo major for Agile: `0x0004` ([MS-OFFCRYPTO] §2.3.4.10).
 *
 * @public
 */
export const AGILE_VERSION_MAJOR: Literal<4> = 0x0004;

/**
 * EncryptionVersionInfo minor for Agile: `0x0004` ([MS-OFFCRYPTO] §2.3.4.10).
 *
 * @public
 */
export const AGILE_VERSION_MINOR: Literal<4> = 0x0004;

/** Reserved field after version MUST be 0x00000040 (§2.3.4.10). */
export const AGILE_RESERVED: Literal<64> = 0x00000040;

/** EncryptionInfo XML target namespace (§2.3.4.10). */
export const AGILE_ENCRYPTION_NS: Literal<'http://schemas.microsoft.com/office/2006/encryption'> = 'http://schemas.microsoft.com/office/2006/encryption';

/** PasswordKeyEncryptor URI on keyEncryptor (§2.3.4.10). */
export const PASSWORD_KEY_ENCRYPTOR_URI: Literal<'http://schemas.microsoft.com/office/2006/keyEncryptor/password'> =
  'http://schemas.microsoft.com/office/2006/keyEncryptor/password';

/** PasswordKeyEncryptor element namespace (§2.3.4.10). */
export const PASSWORD_KEY_ENCRYPTOR_NS: Literal<'http://schemas.microsoft.com/office/2006/keyEncryptor/password'> =
  'http://schemas.microsoft.com/office/2006/keyEncryptor/password';

/**
 * Block key for encryptedVerifierHashInput (§2.3.4.13).
 * Bytes: fe a7 d2 76 3b 4b 9e 79.
 */
export const BLOCK_KEY_VERIFIER_INPUT: Uint8Array = Uint8Array.of(
    0xfe,
    0xa7,
    0xd2,
    0x76,
    0x3b,
    0x4b,
    0x9e,
    0x79
);

/**
 * Block key for encryptedVerifierHashValue (§2.3.4.13).
 * Bytes: d7 aa 0f 6d 30 61 34 4e.
 */
export const BLOCK_KEY_VERIFIER_HASH: Uint8Array = Uint8Array.of(
    0xd7,
    0xaa,
    0x0f,
    0x6d,
    0x30,
    0x61,
    0x34,
    0x4e
);

/**
 * Block key for encryptedKeyValue (§2.3.4.13).
 * Bytes: 14 6e 0b e7 ab ac d0 d6.
 */
export const BLOCK_KEY_ENCRYPTOR_KEY: Uint8Array = Uint8Array.of(
    0x14,
    0x6e,
    0x0b,
    0xe7,
    0xab,
    0xac,
    0xd0,
    0xd6
);

/**
 * Block key for encryptedHmacKey (§2.3.4.14).
 * Bytes: 5f b2 ad 01 0c b9 e1 f6.
 */
export const BLOCK_KEY_HMAC_KEY: Uint8Array = Uint8Array.of(0x5f, 0xb2, 0xad, 0x01, 0x0c, 0xb9, 0xe1, 0xf6);

/**
 * Block key for encryptedHmacValue (§2.3.4.14).
 * Bytes: a0 67 7f 02 b2 2c 84 33.
 */
export const BLOCK_KEY_HMAC_VALUE: Uint8Array = Uint8Array.of(0xa0, 0x67, 0x7f, 0x02, 0xb2, 0x2c, 0x84, 0x33);

/** EncryptedPackage segment size in bytes (§2.3.4.15). */
export const ENCRYPTED_PACKAGE_SEGMENT_SIZE: Literal<4096> = 4096;

/** CFB root stream names for OFFCRYPTO (§2.3.4.4, §2.3.4.10). */
export const STREAM_ENCRYPTION_INFO: Literal<'EncryptionInfo'> = 'EncryptionInfo';
export const STREAM_ENCRYPTED_PACKAGE: Literal<'EncryptedPackage'> = 'EncryptedPackage';

/** Maximum spinCount from ST_SpinCount (§2.3.4.10). */
export const MAX_SPIN_COUNT: Literal<10000000> = 10000000;

/**
 * Standard Encryption EncryptionVersionInfo minor version (§2.3.4.5).
 * Major is 2, 3, or 4 with minor 0x0002 — explicitly unsupported in Phase 6.
 */
export const STANDARD_ENCRYPTION_VERSION_MINOR: Literal<2> = 0x0002;

/** Key padding byte when Hfinal is shorter than keyBits/8 (§2.3.4.11). */
export const KEY_PAD_BYTE: Literal<54> = 0x36;

/** IV padding byte when IV is shorter than blockSize (§2.3.4.12). */
export const IV_PAD_BYTE: Literal<54> = 0x36;
