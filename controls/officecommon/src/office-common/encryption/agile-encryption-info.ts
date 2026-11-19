/*
 * Parse EncryptionInfo stream for Agile encryption ([MS-OFFCRYPTO] §2.3.4.10).
 *
 * @remarks
 * Binary header: VersionMajor, VersionMinor (2 bytes each LE), Reserved (4 bytes LE),
 * then UTF-8 XML. Agile is **4.4** with Reserved **0x00000040**.
 * Standard Encryption (minor version 2) is explicitly unsupported.
 *
 * @private
 */

import { Literal } from '../core/literal-type';
import {
    AGILE_ENCRYPTION_NS,
    AGILE_RESERVED,
    AGILE_VERSION_MAJOR,
    AGILE_VERSION_MINOR,
    MAX_SPIN_COUNT,
    PASSWORD_KEY_ENCRYPTOR_URI,
    STANDARD_ENCRYPTION_VERSION_MINOR
} from './agile-constants';
import {
    assertAesKeyBits,
    assertSupportedCipher,
    resolveHashAlgorithm,
    AgileHashName
} from './crypto-primitives';
import {
    EncryptedPackageError,
    UnsupportedEncryptionError,
    DecryptSecurityLimits
} from './errors';
import { parseEncryptionInfoXml, XmlElement } from './encryption-info-xml';

/**
 * The gt.
 *
 * @returns {any} The result.
 */
function __gt(): any {
    // Prefer Node global; fall back to browser window. Avoid @types/node.
    const g: any = (function (): any {
        try {
            // eslint-disable-next-line no-new-func
            return Function('return this')();
        } catch (e) {
            return {};
        }
    })();
    return g || {};
}

/* AMD/browser-safe Buffer for base64 (typed loosely for TS 3.3). */
declare const Buffer: {
    from(data: any, encoding?: string): Uint8Array;
};

/** Parsed KeyData from encryption XML. */
export interface AgileKeyData {
    readonly saltSize: number;
    readonly blockSize: number;
    readonly keyBits: number;
    readonly hashSize: number;
    readonly cipherAlgorithm: string;
    readonly cipherChaining: string;
    readonly hashAlgorithm: AgileHashName;
    readonly saltValue: Uint8Array;
}

/** Parsed DataIntegrity (optional but expected on modern packages). */
export interface AgileDataIntegrity {
    readonly encryptedHmacKey: Uint8Array;
    readonly encryptedHmacValue: Uint8Array;
}

/** Password key encryptor (p:encryptedKey attributes). */
export interface AgilePasswordKeyEncryptor {
    readonly spinCount: number;
    readonly saltSize: number;
    readonly blockSize: number;
    readonly keyBits: number;
    readonly hashSize: number;
    readonly cipherAlgorithm: string;
    readonly cipherChaining: string;
    readonly hashAlgorithm: AgileHashName;
    readonly saltValue: Uint8Array;
    readonly encryptedVerifierHashInput: Uint8Array;
    readonly encryptedVerifierHashValue: Uint8Array;
    readonly encryptedKeyValue: Uint8Array;
}

/** Full Agile EncryptionInfo model used by decrypt. */
export interface AgileEncryptionInfo {
    readonly keyData: AgileKeyData;
    readonly dataIntegrity: AgileDataIntegrity | undefined;
    readonly passwordKeyEncryptor: AgilePasswordKeyEncryptor;
}

const HEADER_BYTES: Literal<8> = 8;

/**
 * Parses EncryptionInfo stream bytes into an Agile model.
 *
 * @param {Uint8Array} encryptionInfo - The encryption info.
 * @param {DecryptSecurityLimits} limits - The limits.
 * @returns {AgileEncryptionInfo} The result.
 * @throws {UnsupportedEncryptionError} Standard Encryption or unknown version/alg.
 * @throws {EncryptedPackageError} Truncated or missing required Agile fields.
 */
export function parseAgileEncryptionInfo(
    encryptionInfo: Uint8Array,
    limits: DecryptSecurityLimits
): AgileEncryptionInfo {
    if (encryptionInfo.byteLength < HEADER_BYTES + 1) {
        throw new EncryptedPackageError('EncryptionInfo stream is truncated');
    }

    const view: DataView = new DataView(
        encryptionInfo.buffer,
        encryptionInfo.byteOffset,
        encryptionInfo.byteLength
    );
    const versionMajor: number = view.getUint16(0, true);
    const versionMinor: number = view.getUint16(2, true);
    const reserved: number = view.getUint32(4, true);

    // Standard Encryption: major 2|3|4, minor 2 ([MS-OFFCRYPTO] §2.3.4.5).
    if (
        versionMinor === STANDARD_ENCRYPTION_VERSION_MINOR &&
    (versionMajor === 2 || versionMajor === 3 || versionMajor === 4)
    ) {
        throw new UnsupportedEncryptionError(
            'OFFCRYPTO Standard Encryption (EncryptionInfo minor version 2) is not supported; Agile (4.4) only'
        );
    }

    if (versionMajor !== AGILE_VERSION_MAJOR || versionMinor !== AGILE_VERSION_MINOR) {
        throw new UnsupportedEncryptionError(
            `Unsupported EncryptionInfo version ${String(versionMajor)}.${String(versionMinor)}`
        );
    }
    if (reserved !== AGILE_RESERVED) {
        throw new UnsupportedEncryptionError(
            `Unsupported EncryptionInfo reserved field 0x${reserved.toString(16)}`
        );
    }

    const xmlBytes: Uint8Array = encryptionInfo.subarray(HEADER_BYTES);
    const xmlText: string = utf8Decode(xmlBytes);
    let root: XmlElement;
    try {
        root = parseEncryptionInfoXml(xmlText, limits, 'EncryptionInfo');
    } catch (err) {
        if (err instanceof EncryptedPackageError || err instanceof UnsupportedEncryptionError) {
            throw err;
        }
        if (err instanceof Error && err.name === 'PackageLimitError') {
            throw err;
        }
        const msg: string = err instanceof Error ? err.message : 'XML parse failed';
        throw new EncryptedPackageError(`EncryptionInfo XML is invalid: ${msg}`);
    }

    if (root.localName !== 'encryption' || root.namespaceUri !== AGILE_ENCRYPTION_NS) {
    // Accept default-ns resolution failures only when localName matches and NS empty
    // after serializers omit xmlns on root (rare); still require encryption localName.
        if (root.localName !== 'encryption') {
            throw new EncryptedPackageError('EncryptionInfo root element is not encryption');
        }
        if (root.namespaceUri !== '' && root.namespaceUri !== AGILE_ENCRYPTION_NS) {
            throw new EncryptedPackageError('EncryptionInfo root element is not encryption');
        }
    }

    const keyDataEl: XmlElement = findChild(root, AGILE_ENCRYPTION_NS, 'keyData');
    const dataIntegrityEl: XmlElement = findChildOptional(root, AGILE_ENCRYPTION_NS, 'dataIntegrity');
    const keyEncryptorsEl: XmlElement = findChild(root, AGILE_ENCRYPTION_NS, 'keyEncryptors');

    const keyData: AgileKeyData = parseKeyData(keyDataEl);
    const dataIntegrity: AgileDataIntegrity =
    dataIntegrityEl === undefined ? undefined : parseDataIntegrity(dataIntegrityEl);
    const passwordKeyEncryptor: AgilePasswordKeyEncryptor = parsePasswordKeyEncryptor(keyEncryptorsEl);

    return { keyData, dataIntegrity, passwordKeyEncryptor };
}

/**
 * The parse key data.
 *
 * @param {XmlElement} el - The el.
 * @returns {AgileKeyData} The result.
 */
function parseKeyData(el: XmlElement): AgileKeyData {
    const saltSize: number = requirePositiveIntAttr(el, 'saltSize');
    const blockSize: number = requirePositiveIntAttr(el, 'blockSize');
    const keyBits: number = requirePositiveIntAttr(el, 'keyBits');
    const hashSize: number = requirePositiveIntAttr(el, 'hashSize');
    const cipherAlgorithm: string = requireAttr(el, 'cipherAlgorithm');
    const cipherChaining: string = requireAttr(el, 'cipherChaining');
    const hashAlgorithmRaw: string = requireAttr(el, 'hashAlgorithm');
    const saltValue: Uint8Array = requireBase64Attr(el, 'saltValue');

    assertSupportedCipher(cipherAlgorithm, cipherChaining);
    assertAesKeyBits(keyBits);
    const hashAlgorithm: AgileHashName = resolveHashAlgorithm(hashAlgorithmRaw);

    if (blockSize !== 16) {
        throw new UnsupportedEncryptionError(
            `Unsupported OFFCRYPTO blockSize: ${String(blockSize)} (AES requires 16)`
        );
    }
    if (saltValue.byteLength !== saltSize) {
        throw new EncryptedPackageError('keyData saltValue length does not match saltSize');
    }

    return {
        saltSize,
        blockSize,
        keyBits,
        hashSize,
        cipherAlgorithm,
        cipherChaining,
        hashAlgorithm,
        saltValue
    };
}

/**
 * The parse data integrity.
 *
 * @param {XmlElement} el - The el.
 * @returns {AgileDataIntegrity} The result.
 */
function parseDataIntegrity(el: XmlElement): AgileDataIntegrity {
    return {
        encryptedHmacKey: requireBase64Attr(el, 'encryptedHmacKey'),
        encryptedHmacValue: requireBase64Attr(el, 'encryptedHmacValue')
    };
}

/**
 * The parse password key encryptor.
 *
 * @param {XmlElement} keyEncryptorsEl - The key encryptors el.
 * @returns {AgilePasswordKeyEncryptor} The result.
 */
function parsePasswordKeyEncryptor(keyEncryptorsEl: XmlElement): AgilePasswordKeyEncryptor {
    const encryptorEls: XmlElement[] = keyEncryptorsEl.children.filter(
        (c: XmlElement): c is XmlElement => c.kind === 'element' && c.localName === 'keyEncryptor'
    );
    if (encryptorEls.length === 0) {
        throw new EncryptedPackageError('EncryptionInfo has no keyEncryptor');
    }

    let passwordEl: XmlElement | undefined;
    for (const ke of encryptorEls) {
        const uri: string = getAttr(ke, 'uri');
        if (uri === PASSWORD_KEY_ENCRYPTOR_URI) {
            passwordEl = findEncryptedKey(ke);
            break;
        }
        if (uri !== undefined && uri.length > 0) {
            throw new UnsupportedEncryptionError(
                'OFFCRYPTO certificate (or non-password) keyEncryptor is not supported'
            );
        }
    }

    if (passwordEl === undefined) {
        throw new UnsupportedEncryptionError('OFFCRYPTO EncryptionInfo has no password keyEncryptor');
    }

    const spinCount: number = requireNonNegativeIntAttr(passwordEl, 'spinCount');
    if (spinCount > MAX_SPIN_COUNT) {
        throw new EncryptedPackageError(
            `OFFCRYPTO spinCount exceeds maximum allowed (${String(MAX_SPIN_COUNT)})`
        );
    }

    const saltSize: number = requirePositiveIntAttr(passwordEl, 'saltSize');
    const blockSize: number = requirePositiveIntAttr(passwordEl, 'blockSize');
    const keyBits: number = requirePositiveIntAttr(passwordEl, 'keyBits');
    const hashSize: number = requirePositiveIntAttr(passwordEl, 'hashSize');
    const cipherAlgorithm: string = requireAttr(passwordEl, 'cipherAlgorithm');
    const cipherChaining: string = requireAttr(passwordEl, 'cipherChaining');
    const hashAlgorithmRaw: string = requireAttr(passwordEl, 'hashAlgorithm');
    const saltValue: Uint8Array = requireBase64Attr(passwordEl, 'saltValue');
    const encryptedVerifierHashInput: Uint8Array = requireBase64Attr(passwordEl, 'encryptedVerifierHashInput');
    const encryptedVerifierHashValue: Uint8Array = requireBase64Attr(passwordEl, 'encryptedVerifierHashValue');
    const encryptedKeyValue: Uint8Array = requireBase64Attr(passwordEl, 'encryptedKeyValue');

    assertSupportedCipher(cipherAlgorithm, cipherChaining);
    assertAesKeyBits(keyBits);
    const hashAlgorithm: AgileHashName = resolveHashAlgorithm(hashAlgorithmRaw);

    if (blockSize !== 16) {
        throw new UnsupportedEncryptionError(
            `Unsupported password keyEncryptor blockSize: ${String(blockSize)}`
        );
    }
    if (saltValue.byteLength !== saltSize) {
        throw new EncryptedPackageError('encryptedKey saltValue length does not match saltSize');
    }

    return {
        spinCount,
        saltSize,
        blockSize,
        keyBits,
        hashSize,
        cipherAlgorithm,
        cipherChaining,
        hashAlgorithm,
        saltValue,
        encryptedVerifierHashInput,
        encryptedVerifierHashValue,
        encryptedKeyValue
    };
}

/**
 * The find encrypted key.
 *
 * @param {XmlElement} keyEncryptor - The key encryptor.
 * @returns {XmlElement | undefined} The result.
 */
function findEncryptedKey(keyEncryptor: XmlElement): XmlElement | undefined {
    for (const child of keyEncryptor.children) {
        if (child.kind !== 'element') {
            continue;
        }
        if (child.localName === 'encryptedKey') {
            return child;
        }
    }
    return undefined;
}

/**
 * The find child.
 *
 * @param {XmlElement} parent - The parent.
 * @param {string} ns - The ns.
 * @param {string} localName - The local name.
 * @returns {XmlElement} The result.
 */
function findChild(parent: XmlElement, ns: string, localName: string): XmlElement {
    const el: XmlElement = findChildOptional(parent, ns, localName);
    if (el === undefined) {
        throw new EncryptedPackageError(`EncryptionInfo missing element ${localName}`);
    }
    return el;
}

/**
 * The find child optional.
 *
 * @param {XmlElement} parent - The parent.
 * @param {string} ns - The ns.
 * @param {string} localName - The local name.
 * @returns {XmlElement | undefined} The result.
 */
function findChildOptional(
    parent: XmlElement,
    ns: string,
    localName: string
): XmlElement | undefined {
    for (const child of parent.children) {
        if (child.kind !== 'element') {
            continue;
        }
        if (child.localName === localName && (child.namespaceUri === ns || child.namespaceUri === '')) {
            return child;
        }
    }
    for (const child of parent.children) {
        if (child.kind === 'element' && child.localName === localName) {
            return child;
        }
    }
    return undefined;
}

/**
 * The get attr.
 *
 * @param {XmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {string | undefined} The result.
 */
function getAttr(el: XmlElement, localName: string): string | undefined {
    for (const a of el.attributes) {
        if (a.localName === localName) {
            return a.value;
        }
    }
    return undefined;
}

/**
 * The require attr.
 *
 * @param {XmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {string} The result.
 */
function requireAttr(el: XmlElement, localName: string): string {
    const v: string = getAttr(el, localName);
    if (v === undefined || v.length === 0) {
        throw new EncryptedPackageError(`EncryptionInfo missing attribute ${localName}`);
    }
    return v;
}

/**
 * The require positive int attr.
 *
 * @param {XmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {number} The result.
 */
function requirePositiveIntAttr(el: XmlElement, localName: string): number {
    const raw: string = requireAttr(el, localName);
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n <= 0) {
        throw new EncryptedPackageError(`EncryptionInfo attribute ${localName} is invalid`);
    }
    return n;
}

/**
 * The require non negative int attr.
 *
 * @param {XmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {number} The result.
 */
function requireNonNegativeIntAttr(el: XmlElement, localName: string): number {
    const raw: string = requireAttr(el, localName);
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        throw new EncryptedPackageError(`EncryptionInfo attribute ${localName} is invalid`);
    }
    return n;
}

/**
 * The require base64 attr.
 *
 * @param {XmlElement} el - The el.
 * @param {string} localName - The local name.
 * @returns {Uint8Array} The result.
 */
function requireBase64Attr(el: XmlElement, localName: string): Uint8Array {
    const raw: string = requireAttr(el, localName);
    try {
        return base64Decode(raw);
    } catch {
        throw new EncryptedPackageError(`EncryptionInfo attribute ${localName} is not valid base64`);
    }
}

/**
 * The base64 decode.
 *
 * @param {string} value - The value.
 * @returns {Uint8Array} The result.
 */
function base64Decode(value: string): Uint8Array {
    const normalized: string = value.replace(/\s+/g, '');
    if (typeof __gt().atob === 'function') {
        const bin: string = __gt().atob(normalized);
        const out: Uint8Array = new Uint8Array(bin.length);
        const codes: number[] = [];
        for (let i: number = 0; i < bin.length; i++) {
            codes.push(bin.charCodeAt(i));
        }
        out.set(codes);
        return out;
    }
    return new Uint8Array(Buffer.from(normalized, 'base64'));
}

/**
 * The utf8 decode.
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {string} The result.
 */
function utf8Decode(bytes: Uint8Array): string {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
