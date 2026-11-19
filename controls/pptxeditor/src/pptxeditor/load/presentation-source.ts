/** Browser-side presentation source acquisition. OOXML parsing stays in ej2-pptx. */

import { PptxError } from '../base/pptx-error';

/** Input forms accepted by the browser presentation loader. */
export type PresentationSource =
  | { readonly kind: 'url'; readonly url: string; readonly requestInit?: RequestInit }
  | { readonly kind: 'blob'; readonly blob: Blob; readonly fileName?: string }
  | {
      readonly kind: 'buffer';
      readonly data: ArrayBuffer | ArrayBufferView;
      readonly fileName?: string;
  }
  | { readonly kind: 'base64'; readonly data: string; readonly fileName?: string };

/** Stable, localizable categories reported when presentation loading fails. */
export type PresentationLoadErrorCode =
    | 'Network'
    | 'Cors'
    | 'Http'
    | 'NotZip'
    | 'NotPptx'
    | 'Corrupt'
    | 'Encrypted'
    | 'Unsupported'
    | 'TooLarge'
    | 'Aborted';

const MESSAGE_KEYS: Record<PresentationLoadErrorCode, string> = {
    Network: 'LoadErrorNetwork',
    Cors: 'LoadErrorCors',
    Http: 'LoadErrorHttp',
    NotZip: 'LoadErrorNotZip',
    NotPptx: 'LoadErrorNotPptx',
    Corrupt: 'LoadErrorCorrupt',
    Encrypted: 'LoadErrorEncrypted',
    Unsupported: 'LoadErrorUnsupported',
    TooLarge: 'LoadErrorTooLarge',
    Aborted: 'LoadErrorAborted'
};

/** Byte progress reported while a presentation source is acquired. */
export interface PresentationLoadProgress {
    readonly loaded: number;
    readonly total: number | undefined;
    readonly lengthComputable: boolean;
    readonly percent: number | undefined;
    readonly sourceKind: PresentationSource['kind'];
}

/** Owned, ZIP-signature-validated bytes and their source metadata. */
export interface AcquiredPresentation {
    readonly bytes: ArrayBuffer;
    readonly sourceKind: PresentationSource['kind'];
    readonly fileName: string | undefined;
    readonly sourceUrl: string | undefined;
}

/** Optional cancellation, size and progress controls for source acquisition. */
export interface AcquirePresentationOptions {
    readonly signal?: AbortSignal;
    readonly maxBytes?: number;
    readonly fetchImpl?: typeof fetch;
    readonly onProgress?: (progress: PresentationLoadProgress) => void;
}

/** Load failure carrying a stable code and localization key. */
export class PresentationLoadError extends PptxError<PresentationLoadErrorCode> {
    public readonly messageKey: string;
    public readonly status: number | undefined;
    public readonly cause: unknown;

    public constructor(
        code: PresentationLoadErrorCode,
        options?: { readonly status?: number; readonly cause?: unknown }
    ) {
        const messageKey: string = MESSAGE_KEYS[code];
        super('PresentationLoadError', code, messageKey);
        this.messageKey = messageKey;
        this.status = options && options.status;
        this.cause = options && options.cause;
    }
}

/**
 * Converts any supported source to one owned, ZIP-signature-validated buffer.
 * @param {PresentationSource} source - source
 * @param {AcquirePresentationOptions} options - options
 * @returns {Promise} result
 */
export async function acquirePresentationSource(
    source: PresentationSource,
    options: AcquirePresentationOptions = {}
): Promise<AcquiredPresentation> {
    throwIfAborted(options.signal);
    let bytes: Uint8Array;
    let fileName: string | undefined;
    let sourceUrl: string | undefined;

    switch (source.kind) {
    case 'url': {
        const fetched: { readonly bytes: Uint8Array; readonly fileName: string; } = await fetchSource(source, options);
        bytes = fetched.bytes;
        fileName = fetched.fileName;
        sourceUrl = source.url;
        break;
    }
    case 'blob':
        fileName = source.fileName || fileNameFromBlob(source.blob);
        bytes = await readBlob(source.blob, source.kind, options);
        break;
    case 'buffer':
        fileName = source.fileName;
        bytes = copyBufferSource(source.data);
        enforceMaxBytes(bytes.byteLength, options.maxBytes);
        emitProgress(options, source.kind, bytes.byteLength, bytes.byteLength);
        break;
    case 'base64':
        fileName = source.fileName;
        bytes = decodeBase64(source.data);
        enforceMaxBytes(bytes.byteLength, options.maxBytes);
        emitProgress(options, source.kind, bytes.byteLength, bytes.byteLength);
        break;
    default:
        throw new PresentationLoadError('Unsupported');
    }

    validateZipSignature(bytes);
    return {
        bytes: exactArrayBuffer(bytes),
        sourceKind: source.kind,
        fileName,
        sourceUrl
    };
}

function copyBufferSource(data: ArrayBuffer | ArrayBufferView): Uint8Array {
    if (data instanceof ArrayBuffer) {
        return new Uint8Array(data.slice(0));
    }
    return new Uint8Array(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
}

function decodeBase64(value: string): Uint8Array {
    let encoded: string = value.trim();
    if (encoded.indexOf('data:') === 0) {
        const comma: number = encoded.indexOf(',');
        const metadata: string = comma >= 0 ? encoded.slice(0, comma) : '';
        if (comma < 0 || metadata.toLowerCase().indexOf(';base64') < 0) {
            throw new PresentationLoadError('Unsupported');
        }
        encoded = encoded.slice(comma + 1);
    }
    try {
        const binary: string = atob(encoded.replace(/\s/g, ''));
        const bytes: Uint8Array = new Uint8Array(binary.length);
        for (let index: number = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    } catch (error) {
        throw new PresentationLoadError('Unsupported', { cause: error });
    }
}

function validateZipSignature(bytes: Uint8Array): void {
    if (bytes.byteLength >= 8 &&
      bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0 &&
      bytes[4] === 0xa1 && bytes[5] === 0xb1 && bytes[6] === 0x1a && bytes[7] === 0xe1) {
        throw new PresentationLoadError('Encrypted');
    }
    const signature: number =
    bytes.byteLength >= 4
        ? bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24)
        : 0;
    if (signature !== 0x04034b50 && signature !== 0x06054b50 && signature !== 0x08074b50) {
        throw new PresentationLoadError('NotZip');
    }
}

async function readBlob(
    blob: Blob,
    sourceKind: PresentationSource['kind'],
    options: AcquirePresentationOptions
): Promise<Uint8Array> {
    enforceMaxBytes(blob.size, options.maxBytes);
    throwIfAborted(options.signal);
    const bytes: Uint8Array = new Uint8Array(await blobArrayBuffer(blob));
    throwIfAborted(options.signal);
    emitProgress(options, sourceKind, bytes.byteLength, blob.size);
    return bytes;
}

function blobArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    const modern: Blob & { arrayBuffer?: () => Promise<ArrayBuffer> } = blob;
    if (typeof modern.arrayBuffer === 'function') {
        return modern.arrayBuffer();
    }
    return new Promise<ArrayBuffer>((
        resolve: (value: ArrayBuffer | PromiseLike<ArrayBuffer>) => void,
        reject: (reason?: unknown) => void
    ): void => {
        const reader: FileReader = new FileReader();
        reader.onerror = (): void => reject(reader.error);
        reader.onload = (): void => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
            } else {
                reject(new PresentationLoadError('Unsupported'));
            }
        };
        reader.readAsArrayBuffer(blob);
    });
}

async function fetchSource(
    source: Extract<PresentationSource, { readonly kind: 'url' }>,
    options: AcquirePresentationOptions
): Promise<{ readonly bytes: Uint8Array; readonly fileName: string | undefined }> {
    const fetchImpl: typeof fetch = options.fetchImpl || fetch;
    let response: Response;
    try {
        response = await fetchImpl(source.url, {
            ...source.requestInit,
            signal: options.signal
        });
    } catch (error) {
        if (isAbort(error, options.signal)) {
            throw new PresentationLoadError('Aborted', { cause: error });
        }
        throw new PresentationLoadError(
            isLikelyCrossOrigin(source.url)
                ? 'Cors'
                : 'Network',
            { cause: error }
        );
    }
    if (!response.ok) {
        throw new PresentationLoadError('Http', {
            status: response.status
        });
    }
    const total: number | undefined = parseContentLength(response.headers.get('content-length'));
    enforceMaxBytes(total, options.maxBytes);
    const bytes: Uint8Array = await readResponseBody(response, total, options);
    return {
        bytes,
        fileName: contentDispositionFileName(response.headers.get('content-disposition')) ||
      fileNameFromUrl(response.url || source.url)
    };
}

async function readResponseBody(
    response: Response,
    total: number | undefined,
    options: AcquirePresentationOptions
): Promise<Uint8Array> {
    if (!response.body || typeof response.body.getReader !== 'function') {
        const fallback: Uint8Array = new Uint8Array(await response.arrayBuffer());
        enforceMaxBytes(fallback.byteLength, options.maxBytes);
        emitProgress(options, 'url', fallback.byteLength, total);
        return fallback;
    }
    const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded: number = 0;
    try {
        for (;;) {
            throwIfAborted(options.signal);
            const result: ReadableStreamReadResult<Uint8Array> = await reader.read();
            if (result.done) {
                break;
            }
            if (result.value) {
                loaded += result.value.byteLength;
                enforceMaxBytes(loaded, options.maxBytes);
                chunks.push(result.value);
                emitProgress(options, 'url', loaded, total);
            }
        }
    } catch (error) {
        void reader.cancel();
        if (isAbort(error, options.signal)) {
            throw new PresentationLoadError('Aborted', { cause: error });
        }
        if (error instanceof PresentationLoadError) {
            throw error;
        }
        throw new PresentationLoadError('Network', { cause: error });
    }
    const bytes: Uint8Array = new Uint8Array(loaded);
    let offset: number = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
    }
    emitProgress(options, 'url', loaded, total === undefined ? loaded : total);
    return bytes;
}

function emitProgress(
    options: AcquirePresentationOptions,
    sourceKind: PresentationSource['kind'],
    loaded: number,
    total: number | undefined
): void {
    if (!options.onProgress) {
        return;
    }
    const lengthComputable: boolean = total !== undefined && total >= 0;
    options.onProgress({
        loaded,
        total,
        lengthComputable,
        percent: lengthComputable && total !== 0 ? Math.min(100, (loaded / total) * 100) : undefined,
        sourceKind
    });
}

function enforceMaxBytes(size: number | undefined, maximum: number | undefined): void {
    if (size !== undefined && maximum !== undefined && size > maximum) {
        throw new PresentationLoadError('TooLarge');
    }
}

function throwIfAborted(signal: AbortSignal | undefined): void {
    if (signal && signal.aborted) {
        throw new PresentationLoadError('Aborted');
    }
}

function isAbort(error: unknown, signal: AbortSignal | undefined): boolean {
    return Boolean(signal && signal.aborted) ||
    (error instanceof DOMException && error.name === 'AbortError');
}

function isLikelyCrossOrigin(url: string): boolean {
    try {
        return typeof location !== 'undefined' && new URL(url, location.href).origin !== location.origin;
    } catch (_error) {
        return false;
    }
}

function parseContentLength(value: string | null): number | undefined {
    if (value === null || !/^\d+$/.test(value)) {
        return undefined;
    }
    const parsed: number = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function contentDispositionFileName(value: string | null): string | undefined {
    if (!value) {
        return undefined;
    }
    const utf8: RegExpMatchArray | null = value.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8) {
        try {
            return decodeURIComponent(utf8[1]);
        } catch (_error) {
            return utf8[1];
        }
    }
    const basic: RegExpMatchArray | null = value.match(/filename\s*=\s*"?([^";]+)"?/i);
    return basic ? basic[1].trim() : undefined;
}

function fileNameFromBlob(blob: Blob): string | undefined {
    const candidate: Blob & { readonly name?: string } = blob;
    return typeof candidate.name === 'string' && candidate.name.length > 0
        ? candidate.name
        : undefined;
}

function fileNameFromUrl(value: string): string | undefined {
    try {
        const path: string = new URL(value, typeof location === 'undefined' ? undefined : location.href).pathname;
        const segment: string = path.slice(path.lastIndexOf('/') + 1);
        return segment ? decodeURIComponent(segment) : undefined;
    } catch (_error) {
        return undefined;
    }
}

function exactArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

