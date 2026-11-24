/**
 * Cryptographically secure random bytes for key and salt generation.
 *
 * Never falls back to `Math.random`: encryption keys must come from the host CSPRNG
 * (Web Crypto `getRandomValues`, or Node.js `crypto.randomBytes`).
 *
 * @public
 */

import { UnsupportedEncryptionError } from './errors';

interface RandomHost {
    getRandomValues?: (array: Uint8Array) => Uint8Array;
    randomBytes?: (size: number) => Uint8Array;
}

type RandomValuesFn = (array: Uint8Array) => Uint8Array;
type RandomBytesFn = (size: number) => Uint8Array;
type RequireFn = (id: string) => unknown;

function isObject(value: unknown): value is { [key: string]: unknown } {
    return typeof value === 'object' && value !== null;
}

function isRandomValuesFn(value: unknown): value is RandomValuesFn {
    return typeof value === 'function';
}

function isRandomBytesFn(value: unknown): value is RandomBytesFn {
    return typeof value === 'function';
}

function isRequireFn(value: unknown): value is RequireFn {
    return typeof value === 'function';
}

function nodeRandomBytes(mod: unknown): RandomHost | undefined {
    if (isObject(mod) && isRandomBytesFn(mod.randomBytes)) {
        const rb: RandomBytesFn = mod.randomBytes;
        return { randomBytes: (n: number): Uint8Array => rb.call(mod, n) };
    }
    return undefined;
}

function hostGlobal(): unknown {
    try {
        // eslint-disable-next-line no-new-func
        return new Function('return this')();
    } catch {
        return undefined;
    }
}

function findWebCrypto(): RandomHost | undefined {
    const g: unknown = hostGlobal();
    if (isObject(g) && isObject(g.crypto)) {
        const c: { [key: string]: unknown } = g.crypto;
        const fn: unknown = c.getRandomValues;
        if (isRandomValuesFn(fn)) {
            return { getRandomValues: (a: Uint8Array): Uint8Array => fn.call(c, a) };
        }
    }
    return undefined;
}

function findNodeCrypto(): RandomHost | undefined {
    try {
        // @ts-ignore process is Node-only; not present in browser lib types
        const proc: unknown = typeof process !== 'undefined' ? process : undefined;
        if (isObject(proc)) {
            const getBuiltin: unknown = proc.getBuiltinModule;
            if (isRequireFn(getBuiltin)) {
                const found: RandomHost | undefined = nodeRandomBytes(getBuiltin.call(proc, 'crypto'));
                if (found !== undefined) {
                    return found;
                }
            }
        }
    } catch {
        // continue to require fallback
    }
    try {
        // eslint-disable-next-line no-eval
        const req: unknown = eval('require');
        if (isRequireFn(req)) {
            return nodeRandomBytes(req.call(undefined, 'crypto'));
        }
    } catch {
        return undefined;
    }
    return undefined;
}

/**
 * Returns `length` cryptographically secure random bytes.
 *
 * @param {number} length - Number of bytes (at most 65536 per call).
 * @returns {Uint8Array} Random bytes.
 * @throws UnsupportedEncryptionError when no secure random source exists.
 */
export function secureRandomBytes(length: number): Uint8Array {
    const web: RandomHost | undefined = findWebCrypto();
    if (web !== undefined && web.getRandomValues !== undefined) {
        const out: Uint8Array = new Uint8Array(length);
        web.getRandomValues(out);
        return out;
    }
    const node: RandomHost | undefined = findNodeCrypto();
    if (node !== undefined && node.randomBytes !== undefined) {
        return new Uint8Array(node.randomBytes(length));
    }
    throw new UnsupportedEncryptionError('No cryptographically secure random source is available; cannot encrypt the workbook');
}
