import { Literal } from '../core/literal-type';
/**
 * Encryption-related error types shared across Office libraries.
 *
 * @remarks
 * Messages must never include the consumer password or key material.
 * Citation: [MS-OFFCRYPTO] §1.3.3.4, §2.3.4.4–§2.3.4.15.
 */

/**
 * Shared fields for limit-breach errors.
 */
export interface SecurityErrorOptions {
    /** Package part that triggered the failure, when known. */
    readonly partName?: string;
    /** Observed value that exceeded the configured limit, when known. */
    readonly actual?: number;
}

/**
 * Decrypt-relevant numeric guards (subset of broader package security limits).
 */
export interface DecryptSecurityLimits {
    /** Maximum sum of uncompressed part bytes across the package. */
    readonly totalUncompressedBytes: number;
    /** Maximum uncompressed size of any single part / decrypted stream. */
    readonly singlePartUncompressedBytes: number;
    /** Maximum element nesting depth during EncryptionInfo XML parse. */
    readonly xmlNestingDepth?: number;
    /** Maximum attribute count on a single EncryptionInfo XML element. */
    readonly xmlAttributesPerElement?: number;
    /** Maximum length in bytes of a single EncryptionInfo XML text node. */
    readonly textNodeLengthBytes?: number;
}

const ONE_KIB: Literal<1024> = 1024;
const ONE_MIB: number = ONE_KIB * 1024;
const ONE_GIB: number = ONE_MIB * 1024;

/**
 * Default decrypt limits aligned with typical Office package security defaults.
 */
export const DEFAULT_DECRYPT_SECURITY_LIMITS: DecryptSecurityLimits = Object.freeze({
    totalUncompressedBytes: 1 * ONE_GIB,
    singlePartUncompressedBytes: 256 * ONE_MIB,
    xmlNestingDepth: 256,
    xmlAttributesPerElement: 4096,
    textNodeLengthBytes: 32 * ONE_MIB
});

/**
 * Builds effective decrypt limits from optional caller overrides.
 *
 * @param {Partial<DecryptSecurityLimits> | undefined} overrides - The overrides.
 * @returns {DecryptSecurityLimits} The result.
 */
export function resolveDecryptLimits(overrides?: Partial<DecryptSecurityLimits>): DecryptSecurityLimits {
    if (overrides === undefined) {
        return DEFAULT_DECRYPT_SECURITY_LIMITS;
    }
    const d: DecryptSecurityLimits = DEFAULT_DECRYPT_SECURITY_LIMITS;
    return Object.freeze({
        totalUncompressedBytes: overrides.totalUncompressedBytes != null ? overrides.totalUncompressedBytes : d.totalUncompressedBytes,
        singlePartUncompressedBytes: overrides.singlePartUncompressedBytes != null
            ? overrides.singlePartUncompressedBytes : d.singlePartUncompressedBytes,
        xmlNestingDepth: overrides.xmlNestingDepth != null ? overrides.xmlNestingDepth : d.xmlNestingDepth,
        xmlAttributesPerElement: overrides.xmlAttributesPerElement != null
            ? overrides.xmlAttributesPerElement : d.xmlAttributesPerElement,
        textNodeLengthBytes: overrides.textNodeLengthBytes != null ? overrides.textNodeLengthBytes : d.textNodeLengthBytes
    });
}

/** Stable machine-readable codes carried by every encryption error. */
export type EncryptionErrorCode =
    'INVALID_PASSWORD' | 'UNSUPPORTED_ENCRYPTION' | 'INVALID_PACKAGE' | 'PACKAGE_LIMIT' | 'INVALID_ARGUMENT';

/** Optional metadata for encryption errors. */
export interface EncryptionErrorOptions {
    readonly cause?: unknown;
    readonly partName?: string;
}

/**
 * A package security limit was exceeded (decrypted size, XML guards, spin count).
 *
 * @public
 */
export class PackageLimitError extends Error {
    public readonly code: EncryptionErrorCode;
    public readonly limit: keyof DecryptSecurityLimits | string;
    public readonly partName: string | undefined;
    public readonly actual: number | undefined;

    /**
     * Creates an instance.
     *
     * @param {string} limit - Name of the exceeded limit.
     * @param {SecurityErrorOptions} options - Optional part name and actual value.
     */
    public constructor(limit: keyof DecryptSecurityLimits | string, options: SecurityErrorOptions = {}) {
        const partSuffix: string = options.partName === undefined ? '' : ` (part: ${options.partName})`;
        const actualSuffix: string =
            options.actual === undefined ? '' : `; actual value: ${String(options.actual)}`;
        super(`Package security limit exceeded: ${limit}${partSuffix}${actualSuffix}`);
        this.name = 'PackageLimitError';
        this.code = 'PACKAGE_LIMIT';
        this.limit = limit;
        this.partName = options.partName;
        this.actual = options.actual;
        // ES5 / AMD emit: restore prototype so `instanceof` works in browsers.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * The encrypted container or its data is malformed, truncated, or failed its integrity check.
 *
 * @public
 */
export class EncryptedPackageError extends Error {
    public readonly code: EncryptionErrorCode;
    public readonly cause: unknown;
    public readonly partName: string | undefined;

    /**
     * Creates an instance.
     *
     * @param {string} message - The message.
     * @param {EncryptionErrorOptions} options - Optional cause and part name.
     */
    public constructor(message: string, options: EncryptionErrorOptions = {}) {
        super(message);
        this.name = 'EncryptedPackageError';
        this.code = 'INVALID_PACKAGE';
        this.cause = options.cause;
        this.partName = options.partName;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * The password is missing or wrong, or is not acceptable for encryption.
 *
 * @public
 */
export class InvalidPasswordError extends Error {
    public readonly code: EncryptionErrorCode;
    public readonly cause: unknown;

    /**
     * Creates an instance.
     *
     * @param {string} message - The message.
     * @param {EncryptionErrorOptions} options - Optional cause.
     */
    public constructor(message: string = 'Invalid password', options: EncryptionErrorOptions = {}) {
        super(message);
        this.name = 'InvalidPasswordError';
        this.code = 'INVALID_PASSWORD';
        this.cause = options.cause;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * The encryption scheme, algorithm, or container is not supported, or no secure random source exists.
 *
 * @public
 */
export class UnsupportedEncryptionError extends Error {
    public readonly code: EncryptionErrorCode;
    public readonly cause: unknown;

    /**
     * Creates an instance.
     *
     * @param {string} message - The message.
     * @param {EncryptionErrorOptions} options - Optional cause.
     */
    public constructor(message: string = 'Unsupported encryption method', options: EncryptionErrorOptions = {}) {
        super(message);
        this.name = 'UnsupportedEncryptionError';
        this.code = 'UNSUPPORTED_ENCRYPTION';
        this.cause = options.cause;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * A caller-supplied argument (for example a non-string password) is invalid.
 *
 * @public
 */
export class EncryptionArgumentError extends Error {
    public readonly code: EncryptionErrorCode;

    /**
     * Creates an instance.
     *
     * @param {string} message - The message.
     */
    public constructor(message: string) {
        super(message);
        this.name = 'EncryptionArgumentError';
        this.code = 'INVALID_ARGUMENT';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
