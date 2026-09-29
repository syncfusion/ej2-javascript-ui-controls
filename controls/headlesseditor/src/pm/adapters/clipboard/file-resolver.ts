/**
 * File Resolver - Converts File objects into image src values
 *
 * Bridges the gap between browser-only file APIs (FileReader, Image) and
 * schema-level image node attributes. Pure utility — no ProseMirror types
 * or event bus touched here, so it can be unit-tested in isolation and
 * swapped with a product-specific resolver (e.g. CDN upload pipeline).
 *
 */

/**
 * Result returned by a FileSourceResolver.
 *
 * @hidden
 */
export interface ResolvedFileSource {
    /** Original file, kept for downstream listeners (uploads, telemetry). */
    file: File;
    /** Either a data: URL (Base64 — survives undo/redo across reloads) or a blob URL. */
    src: string;
    /** Image natural width, when read successfully from the binary. */
    width?: number | null;
    /** Image natural height, when read successfully from the binary. */
    height?: number | null;
}

/**
 * Resolver signature — receives a single File plus the allowBase64 flag
 * from image extension config. Implementations may upload the binary
 * externally and return a CDN URL.
 *
 * @hidden
 */
export type FileSourceResolver = (
    file: File,
    allowBase64: boolean
) => Promise<ResolvedFileSource>;

/** Soft cap (5 MB) for blob-URL fallback; data URL has no such limit in this resolver. */
const LARGE_FILE_BYTES: number = 5 * 1024 * 1024;

/**
 * Reads the natural width/height of an image file using an off-DOM Image element.
 * Falls back to no dimensions when the binary is unreadable as an image.
 *
 * @param {File} file - Image file.
 * @returns {Promise<object>} Dimensions or empty object.
 * @hidden
 */
async function readImageDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
    return new Promise((resolve: (value: { width: number | null; height: number | null }) => void) => {
        // Brief URL — revoked as soon as the load callback fires.
        const url: string = URL.createObjectURL(file);
        const img: HTMLImageElement = new Image();

        const cleanup: () => void = (): void => {
            URL.revokeObjectURL(url);
        };

        img.onload = (): void => {
            const result: { width: number | null; height: number | null } = {
                width: img.naturalWidth || null,
                height: img.naturalHeight || null
            };
            cleanup();
            resolve(result);
        };

        img.onerror = (): void => {
            cleanup();
            resolve({ width: null, height: null });
        };

        img.src = url;
    });
}

/**
 * Reads a File as a Base64-encoded data: URL using FileReader.
 *
 * @param {File} file - File to read.
 * @returns {Promise<string>} data URL string.
 * @hidden
 */
async function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (reason: Error) => void) => {
        const reader: FileReader = new FileReader();
        reader.onload = (): void => {
            // FileReader.result is ArrayBuffer | string — for readAsDataURL it is string.
            const result: string | ArrayBuffer | null = reader.result;
            if (typeof result !== 'string') {
                reject(new Error('FileReader returned non-string result'));
                return;
            }
            resolve(result);
        };
        reader.onerror = (): void => {
            reject(reader.error ?? new Error('FileReader error'));
        };
        // Image MIME — sane default; caller may override with custom resolver.
        reader.readAsDataURL(file);
    });
}

/**
 * Default file resolver — produces data: URLs when allowed (preferred —
 * survives clipboard round-trips and undo/redo across reloads), otherwise
 * falls back to blob: URLs that live in the current document.
 *
 * @param {File} file - File to resolve.
 * @param {boolean} allowBase64 - Whether data: URLs are permitted.
 * @returns {Promise<ResolvedFileSource>} Resolved source descriptor.
 * @hidden
 */
export const defaultFileResolver: FileSourceResolver =
    async (file: File, allowBase64: boolean): Promise<ResolvedFileSource> => {
        // Reject non-image inputs at the boundary; keep this resolver single-purpose.
        if (!file.type.startsWith('image/')) {
            throw new Error(`defaultFileResolver: unsupported MIME type "${file.type}"`);
        }

        let src: string;

        if (allowBase64) {
            // data: URLs survive undo/redo history and clipboard paste cycles.
            src = await readFileAsDataURL(file);
        } else {
            // Only honor blob URLs up to the soft cap; oversized files throw a clear error
            // so the caller can publish a structured failure event instead of staying silent.
            if (file.size > LARGE_FILE_BYTES) {
                throw new Error(
                    `File "${file.name}" exceeds ${LARGE_FILE_BYTES} bytes and Base64 is disabled`
                );
            }
            src = URL.createObjectURL(file);
        }

        const dims: { width: number | null; height: number | null } = await readImageDimensions(file);

        return {
            file,
            src,
            width: dims.width,
            height: dims.height
        };
    };
