import { arrayAt } from './util/es5-compat';
/**
 * Internal errors shared across core presentation operations.
 */
/**
 * Stable machine-readable error codes for {@link Error}.
 *
 * @remarks
 * Members are namespaced `area/reason` and are **never removed or
 * repurposed** once shipped (API-RULES R7.2). This list is a starting point;
 * every code actually thrown by the library is enumerated here.
 *
 * Citation: `docs/api/API-RULES.md` R7.2.
 */
export type PresentationErrorCode = 'package/invalid-zip' | 'package/missing-part' | 'package/unwritable' | 'xml/malformed' | 'xml/markup-compatibility' | 'security/limit-exceeded' | 'model/detached-object' | 'model/invariant-violated' | 'model/out-of-range' | 'model/invalid-argument' | 'content/unsupported';
/**
 * Typed error thrown by the library for domain-level failures whose contract
 * is caller-correctable: out-of-range indices, detached objects, invariant
 * violations, unsupported content, package/XML/security failures.
 *
 * @remarks
 * The `code` field is the stable, machine-readable discriminator (API-RULES
 * R7.2). `message` is human-readable and not a contract. Use
 * `instanceof PresentationError` for typed catch sites; compare `code` for
 * specific handling. Codes are never removed or repurposed once shipped.
 *
 * Package/XML/security-level failures may surface as more specific subclasses
 * (e.g. {@link Error}, {@link MarkupCompatibilityError}) where
 * the failure site has its own typed contract. `PresentationError` is used
 * where the failure is a model-level invariant or argument violation.
 *
 * Citation: `docs/api/API-RULES.md` R7.2; `docs/api/API-STANDARD.md`.
 */
export class PresentationError extends Error {
    /** Stable machine-readable code (API-RULES R7.2). */
    readonly code: PresentationErrorCode;
    /**
     *
     * @param {PresentationErrorCode} code - One of {@link PresentationErrorCode}.
     * @param {string} message - Human-readable description (not a contract).
     */
    constructor(code: PresentationErrorCode, message: string) {
        super(message);
        this.name = 'PresentationError';
        this.code = code;
    }
}
/**
 * Thrown when an operation attempts to delete a shape targeted by animation
 * timing elements (`<p:spTgt spid="...">`).
 *
 * @remarks
 * The shape-delete API and `removeAnimationTargets()` are deferred. This error
 * defines the typed refuse-delete contract for those future operations.
 * Not part of the public package surface; import only from core internals/tests.
 *
 * Citation: requirement 021, shape-delete ID policy: refuse.
 *
 * @internal
 */
export class AnimationTargetError extends Error {
    /**
     *
     * @param {string} message - Diagnostic describing the targeted shape.
     */
    constructor(message: string) {
        super(message);
        this.name = 'AnimationTargetError';
    }
}
/**
 * Returns a function that converts a value to bigint.
 *
 * @private
 * @returns {*} The bigInt
 */
export function _getBigInt(): (value: string | number | boolean) => bigint {
    return (Function('return BigInt'))();
}
/**
 * Decode bytes from base64 string.
 *
 * @private
 * @param {string} input - The base64 string to decode.
 * @param {boolean} isDirect - Whether to return object or number[]. Default is false.
 * @returns {*} Decoded bytes.
 */
export function _decode(input: string, isDirect: boolean = false): Uint8Array | number[] {
    const chunkSize: number = 3000000;
    if (input.length >= chunkSize) {
        input = input.replace(/[^A-Za-z0-9+/=]/g, '');
        const outputChunks: Uint8Array[] = [];
        let totalLength: number = 0;
        for (let i: number = 0; i < input.length; i += chunkSize) {
            const chunk: string = input.substring(i, i + chunkSize);
            const decodedChunk: Uint8Array = _decodeChunk(chunk);
            outputChunks.push(decodedChunk);
            totalLength += decodedChunk.length;
        }
        const output: Uint8Array = new Uint8Array(totalLength);
        let offset: number = 0;
        for (let i2: number = 0; i2 < outputChunks.length; i2++) {
            const chunk: Uint8Array = arrayAt(outputChunks, i2);
            output.set(chunk, offset);
            offset += chunk.length;

        }
        return isDirect ? Array.from(output) : output;
    } else {
        const key: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let enc1: number;
        let enc2: number;
        let enc3: number;
        let enc4: number;
        let i: number = 0;
        let resultIndex: number = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ''); // eslint-disable-line
        let totalLength: number = input.length * 3 / 4;
        // Each trailing '=' padding char removes one output byte (`==` → two).
        if (input.charAt(input.length - 1) === key.charAt(64)) {
            totalLength--;
            if (input.charAt(input.length - 2) === key.charAt(64)) {
                totalLength--;
            }
        }
        const output: Array<number> = new Array<number>(totalLength | 0);
        while (i < input.length) {
            enc1 = key.indexOf(input.charAt(i++));
            enc2 = key.indexOf(input.charAt(i++));
            enc3 = key.indexOf(input.charAt(i++));
            enc4 = key.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            if (resultIndex < totalLength) {
                output[resultIndex++] = chr1;
            }
            if (resultIndex < totalLength) {
                output[resultIndex++] = chr2;
            }
            if (resultIndex < totalLength) {
                output[resultIndex++] = chr3;
            }
        }
        return isDirect ? output : new Uint8Array(output);
    }
}
/**
 * Decode a chunk of base64 string into Uint8Array.
 *
 * @private
 * @param {string} input - The base64 string to decode.
 * @returns {Uint8Array} Decoded bytes as Uint8Array.
 */
function _decodeChunk(input: string): Uint8Array {
    const key: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let chr1: number;
    let chr2: number;
    let chr3: number;
    let enc1: number;
    let enc2: number;
    let enc3: number;
    let enc4: number;
    let i: number = 0;
    let resultIndex: number = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ''); // eslint-disable-line
    let totalLength: number = input.length * 3 / 4;
    if (input.charAt(input.length - 1) === key.charAt(64)) {
        totalLength--;
        if (input.charAt(input.length - 2) === key.charAt(64)) {
            totalLength--;
        }
    }
    const output: Array<number> = new Array<number>(totalLength | 0);
    while (i < input.length) {
        enc1 = key.indexOf(input.charAt(i++));
        enc2 = key.indexOf(input.charAt(i++));
        enc3 = key.indexOf(input.charAt(i++));
        enc4 = key.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        if (resultIndex < totalLength) {
            output[resultIndex++] = chr1;
        }
        if (resultIndex < totalLength) {
            output[resultIndex++] = chr2;
        }
        if (resultIndex < totalLength) {
            output[resultIndex++] = chr3;
        }
    }
    return new Uint8Array(output);
}

