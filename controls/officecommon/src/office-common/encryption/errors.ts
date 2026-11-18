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
export function resolveDecryptLimits(
    overrides?: Partial<DecryptSecurityLimits>
): DecryptSecurityLimits {
    if (overrides === undefined) {
        return DEFAULT_DECRYPT_SECURITY_LIMITS;
    }
    const xmlNestingDepth: number =
    (overrides.xmlNestingDepth != null ? overrides.xmlNestingDepth : DEFAULT_DECRYPT_SECURITY_LIMITS.xmlNestingDepth);
    const xmlAttributesPerElement: number =
    (overrides.xmlAttributesPerElement != null
        ? overrides.xmlAttributesPerElement
        : DEFAULT_DECRYPT_SECURITY_LIMITS.xmlAttributesPerElement);
    const textNodeLengthBytes: number =
    (overrides.textNodeLengthBytes != null ? overrides.textNodeLengthBytes : DEFAULT_DECRYPT_SECURITY_LIMITS.textNodeLengthBytes);
    const resolved: DecryptSecurityLimits = {
        totalUncompressedBytes:
      (overrides.totalUncompressedBytes != null
          ? overrides.totalUncompressedBytes
          : DEFAULT_DECRYPT_SECURITY_LIMITS.totalUncompressedBytes),
        singlePartUncompressedBytes:
      (overrides.singlePartUncompressedBytes != null
          ? overrides.singlePartUncompressedBytes
          : DEFAULT_DECRYPT_SECURITY_LIMITS.singlePartUncompressedBytes),
        ...(xmlNestingDepth === undefined ? {} : { xmlNestingDepth }),
        ...(xmlAttributesPerElement === undefined ? {} : { xmlAttributesPerElement }),
        ...(textNodeLengthBytes === undefined ? {} : { textNodeLengthBytes })
    };
    return Object.freeze(resolved);
}

export class PackageLimitError extends Error {
    /** Name of the limit field that was exceeded. */
    readonly limit: keyof DecryptSecurityLimits | string;
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /** Observed value when known. */
    readonly actual: number | undefined;

    constructor(
        limit: keyof DecryptSecurityLimits | string,
        options: SecurityErrorOptions = {}
    ) {
        const partSuffix: string = options.partName === undefined ? '' : ` (part: ${options.partName})`;
        const actualSuffix: string =
      options.actual === undefined ? '' : `; actual value: ${String(options.actual)}`;
        super(`Package security limit exceeded: ${limit}${partSuffix}${actualSuffix}`);
        this.name = 'PackageLimitError';
        this.limit = limit;
        this.partName = options.partName;
        this.actual = options.actual;
        // ES5 / AMD emit: restore prototype so `instanceof` works in browsers.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Raised when the package is encrypted and cannot be opened as supplied.
 */
export class EncryptedPackageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'EncryptedPackageError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Raised when a consumer-supplied password fails OFFCRYPTO verification.
 */
export class InvalidPasswordError extends Error {
    constructor(message: string = 'Invalid password') {
        super(message);
        this.name = 'InvalidPasswordError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Raised when the package uses a recognized encryption method this build does not decrypt.
 */
export class UnsupportedEncryptionError extends Error {
    constructor(message: string = 'Unsupported encryption method') {
        super(message);
        this.name = 'UnsupportedEncryptionError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
