/**
 * Browser base64 via `atob` / `btoa` (DOM lib, TS 3.3).
 * Does not use Node `Buffer`, which gulp's browser AMD emit cannot type or run.
 */

const BASE64_ALPHABET: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeWithBtoa(bytes: Uint8Array): string | undefined {
    if (typeof btoa !== 'function') {
        return undefined;
    }
    const chunkSize: number = 0x8000;
    let binary: string = '';
    for (let offset: number = 0; offset < bytes.length; offset += chunkSize) {
        const end: number = Math.min(offset + chunkSize, bytes.length);
        let slice: string = '';
        for (let i: number = offset; i < end; i++) {
            // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
            slice += String.fromCharCode(bytes[i]);
        }
        binary += slice;
    }
    return btoa(binary);
}

function decodeWithAtob(payload: string): Uint8Array | undefined {
    if (typeof atob !== 'function') {
        return undefined;
    }
    const binary: string = atob(payload);
    const out: Uint8Array = new Uint8Array(binary.length);
    for (let i: number = 0; i < binary.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        out[i] = binary.charCodeAt(i) & 0xff;
    }
    return out;
}

/**
 * Encode bytes as a standard base64 string (no data-URL prefix).
 *
 * @param {Uint8Array} bytes - The bytes.
 * @returns {string} The result.
 * @private
 */
export function encodeBase64(bytes: Uint8Array): string {
    const fromDom: string = encodeWithBtoa(bytes);
    if (fromDom !== undefined) {
        return fromDom;
    }
    let out: string = '';
    for (let i: number = 0; i < bytes.length; i += 3) {
        // eslint-disable-next-line security/detect-object-injection -- integer index bounded by the buffer or table length; not a user-controlled property name
        const b0: number = bytes[i];
        const b1: number = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const b2: number = i + 2 < bytes.length ? bytes[i + 2] : 0;
        const triple: number = (b0 << 16) | (b1 << 8) | b2;
        out += BASE64_ALPHABET[(triple >> 18) & 63];
        out += BASE64_ALPHABET[(triple >> 12) & 63];
        out += i + 1 < bytes.length ? BASE64_ALPHABET[(triple >> 6) & 63] : '=';
        out += i + 2 < bytes.length ? BASE64_ALPHABET[triple & 63] : '=';
    }
    return out;
}

/**
 * Decode a standard base64 payload (whitespace already stripped).
 * Throws if the payload is not valid base64.
 *
 * @param {string} payload - The payload.
 * @returns {Uint8Array} The result.
 * @private
 */
export function decodeBase64(payload: string): Uint8Array {
    const fromDom: Uint8Array = decodeWithAtob(payload);
    if (fromDom !== undefined) {
        return fromDom;
    }
    if (payload.length % 4 !== 0) {
        throw new Error('Invalid base64 payload');
    }
    const padChar: string = payload.length === 0 ? '' : payload.charAt(payload.length - 1);
    const padChar2: string = payload.length < 2 ? '' : payload.charAt(payload.length - 2);
    const padding: number = padChar2 === '=' && padChar === '=' ? 2 : padChar === '=' ? 1 : 0;
    const outLength: number = (payload.length / 4) * 3 - padding;
    const out: Uint8Array = new Uint8Array(outLength);
    let written: number = 0;
    for (let i: number = 0; i < payload.length; i += 4) {
        const c0: number = BASE64_ALPHABET.indexOf(payload.charAt(i));
        const c1: number = BASE64_ALPHABET.indexOf(payload.charAt(i + 1));
        const c2: number = payload.charAt(i + 2) === '=' ? 0 : BASE64_ALPHABET.indexOf(payload.charAt(i + 2));
        const c3: number = payload.charAt(i + 3) === '=' ? 0 : BASE64_ALPHABET.indexOf(payload.charAt(i + 3));
        if (c0 < 0 || c1 < 0 || (payload.charAt(i + 2) !== '=' && c2 < 0) || (payload.charAt(i + 3) !== '=' && c3 < 0)) {
            throw new Error('Invalid base64 payload');
        }
        const triple: number = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;
        out[written++] = (triple >> 16) & 0xff;
        if (payload.charAt(i + 2) !== '=' && written < outLength) {
            out[written++] = (triple >> 8) & 0xff;
        }
        if (payload.charAt(i + 3) !== '=' && written < outLength) {
            out[written++] = triple & 0xff;
        }
    }
    return out;
}
