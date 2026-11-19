import { SecurityLimits } from './limits';
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
 * Raised when a package-level or structural walk limit is exceeded.
 *
 * @remarks
 * Fail-closed: the open or walk aborts. The library never silently truncates content
 * to fit under a limit.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class PackageLimitError extends Error {
    /** Name of the {@link SecurityLimits} field that was exceeded. */
    readonly limit: keyof SecurityLimits;
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /** Observed value when known. */
    readonly actual: number | undefined;
    /**
     *
     * @param {*} limit - Key of the breached limit.
     * @param {SecurityErrorOptions} options - Optional part name and observed value.
     */
    constructor(limit: keyof SecurityLimits, options: SecurityErrorOptions = {}) {
        const partSuffix: string = options.partName === undefined ? '' : ` (part: ${options.partName})`;
        const actualSuffix: string = options.actual === undefined ? '' : `; actual value: ${String(options.actual)}`;
        super(`Package security limit exceeded: ${limit}${partSuffix}${actualSuffix}`);
        this.name = 'PackageLimitError';
        this.limit = limit;
        this.partName = options.partName;
        this.actual = options.actual;
    }
}
/**
 * Raised when an XML parse guard is exceeded (depth, attributes, or text length).
 *
 * @remarks
 * Fail-closed during parse — not after. DTD and external entity resolution remain
 * disabled independently of these limits.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class XmlLimitError extends Error {
    /** Name of the {@link SecurityLimits} field that was exceeded. */
    readonly limit: keyof SecurityLimits;
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /** Observed value when known. */
    readonly actual: number | undefined;
    /**
     *
     * @param {*} limit - Key of the breached XML limit.
     * @param {SecurityErrorOptions} options - Optional part name and observed value.
     */
    constructor(limit: keyof SecurityLimits, options: SecurityErrorOptions = {}) {
        const partSuffix: string = options.partName === undefined ? '' : ` (part: ${options.partName})`;
        const actualSuffix: string = options.actual === undefined ? '' : `; actual value: ${String(options.actual)}`;
        super(`XML security limit exceeded: ${limit}${partSuffix}${actualSuffix}`);
        this.name = 'XmlLimitError';
        this.limit = limit;
        this.partName = options.partName;
        this.actual = options.actual;
    }
}
/**
 * Raised when the package is encrypted and cannot be opened as supplied.
 *
 * @remarks
 * Encrypted OFFCRYPTO / OLE CFB packages are refused. Decrypt-open is not
 * supported in this build. Never put a password or key material in the message.
 *
 * Citation: [MS-OFFCRYPTO] section 1.3.3.4 ECMA-376 Document Encryption; section 2.3.4.4
 * EncryptedPackage stream.
 */
export class EncryptedPackageError extends Error {
    /**
     *
     * @param {string} message - Human-readable description of the refusal (never include the password).
     */
    constructor(message: string) {
        super(message);
        this.name = 'EncryptedPackageError';
    }
}
/**
 * Raised when a consumer-supplied password fails OFFCRYPTO verification.
 *
 * @remarks
 * Retained for API stability. Decrypt-open is not supported in this build.
 * Message text must stay generic — never echo the password.
 */
export class InvalidPasswordError extends Error {
    /**
     *
     * @param {string} message - Generic human-readable description (never include the password).
     */
    constructor(message: string = 'Invalid password') {
        super(message);
        this.name = 'InvalidPasswordError';
    }
}
/**
 * Raised when the package uses a recognized encryption container or method that
 * this build does not decrypt.
 *
 * @remarks
 * Prefer this over {@link InvalidPasswordError} when method/version detection is
 * definitive. Never include the password.
 */
export class UnsupportedEncryptionError extends Error {
    /**
     *
     * @param {string} message - Generic human-readable description (never include the password).
     */
    constructor(message: string = 'Unsupported encryption method') {
        super(message);
        this.name = 'UnsupportedEncryptionError';
    }
}
/**
 * Raised when the package is malformed or violates OPC structure rules required to open.
 *
 * @remarks
 * Examples include missing content types, path traversal in part names, or unreadable
 * ZIP structure. Distinct from limit breaches and encryption refusal.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * @internal
 */
export class InvalidPackageError extends Error {
    /** Offending part name when applicable. */
    readonly partName: string | undefined;
    /**
     * @param {string} message - Human-readable description of the defect.
     * @param {object} options - Optional part name.
     * @param {*} options.partName - The options.partName value.
     */
    constructor(message: string, options: {
        readonly partName?: string;
    } = {}) {
        super(message);
        this.name = 'InvalidPackageError';
        this.partName = options.partName;
    }
}
