/**
 * Integration of the shared OFFCRYPTO engine from `@syncfusion/ej2-office-common`.
 *
 * The cryptography lives in ej2-office-common. This module only re-exposes it with
 * the ej2-xlsx error types, so callers keep catching `InvalidPasswordError`,
 * `UnsupportedEncryptionError`, `InvalidPackageError`, `PackageLimitError` and
 * `InvalidArgumentError` (all `XlsxError`s with stable `code` values).
 *
 * @private
 */

import {
    decryptPackage as sharedDecryptPackage,
    encryptPackage as sharedEncryptPackage,
    isEncryptedContainer as sharedIsEncryptedContainer,
    MAX_PASSWORD_LENGTH as SHARED_MAX_PASSWORD_LENGTH,
    secureRandomBytes as sharedSecureRandomBytes
} from '@syncfusion/ej2-office-common';
import {
    InvalidArgumentError,
    InvalidPackageError,
    InvalidPasswordError,
    PackageLimitError,
    UnsupportedEncryptionError
} from './errors';

/** Excel accepts at most 255 characters in an open password. */
export const MAX_PASSWORD_LENGTH: number = SHARED_MAX_PASSWORD_LENGTH;

interface SharedError {
    readonly code?: string;
    readonly message: string;
    readonly cause?: unknown;
    readonly partName?: string;
}

function isSharedError(value: unknown): value is SharedError {
    return value instanceof Error && typeof (value as SharedError).code === 'string';
}

function toXlsxError(error: unknown): unknown {
    if (!isSharedError(error)) {
        return error;
    }
    const options: { readonly cause?: unknown; readonly partName?: string } = { cause: error.cause, partName: error.partName };
    switch (error.code) {
    case 'INVALID_PASSWORD':
        return new InvalidPasswordError(error.message, options);
    case 'UNSUPPORTED_ENCRYPTION':
        return new UnsupportedEncryptionError(error.message, options);
    case 'INVALID_PACKAGE':
        return new InvalidPackageError(error.message, options);
    case 'PACKAGE_LIMIT':
        return new PackageLimitError(error.message, options);
    case 'INVALID_ARGUMENT':
        return new InvalidArgumentError(error.message, options);
    default:
        return error;
    }
}

function translate<T>(run: () => T): T {
    try {
        return run();
    } catch (e) {
        throw toXlsxError(e);
    }
}

/**
 * Returns `true` when the bytes are a CFB container (an encrypted or legacy Office file) rather than a ZIP.
 *
 * @param {Uint8Array} data - File bytes.
 * @returns {boolean} Whether the file must be decrypted before it can be opened as OPC.
 */
export function isEncryptedContainer(data: Uint8Array): boolean {
    return sharedIsEncryptedContainer(data);
}

/**
 * Decrypts a password-protected OOXML package.
 *
 * @param {Uint8Array} fileBytes - CFB file bytes.
 * @param {string} [password] - Open password; omitted tries Excel's default password.
 * @returns {Uint8Array} The plain `.xlsx` ZIP bytes.
 */
export function decryptPackage(fileBytes: Uint8Array, password?: string): Uint8Array {
    return translate((): Uint8Array => sharedDecryptPackage(fileBytes, password));
}

/**
 * Encrypts package bytes with ECMA-376 Agile encryption.
 *
 * @param {Uint8Array} packageBytes - Plain `.xlsx` ZIP bytes.
 * @param {string} password - Open password (1 to 255 characters).
 * @returns {Uint8Array} The encrypted CFB file bytes.
 */
export function encryptPackage(packageBytes: Uint8Array, password: string): Uint8Array {
    return translate((): Uint8Array => sharedEncryptPackage(packageBytes, password));
}

/**
 * Cryptographically secure random bytes.
 *
 * @param {number} length - Number of bytes.
 * @returns {Uint8Array} Random bytes.
 */
export function secureRandomBytes(length: number): Uint8Array {
    return translate((): Uint8Array => sharedSecureRandomBytes(length));
}
