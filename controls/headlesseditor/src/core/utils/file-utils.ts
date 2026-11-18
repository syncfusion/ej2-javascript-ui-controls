/**
 * file-utils.ts — Utility functions for file handling.
 *
 * Provides helpers for reading files as data URLs and extracting
 * image dimensions. These utilities are used by the image upload
 * plugin to create temporary previews and gather metadata.
 *
 * @hidden
 */

/**
 * Reads a file as a data URL for temporary preview.
 *
 * @param {File} file - The file to read.
 * @returns {Promise<string>} A promise that resolves to the data URL.
 * @hidden
 */
export function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (reason?: unknown) => void) => {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Extracts image dimensions from a File object.
 *
 * @param {File} file - The image file to analyze.
 * @returns {Promise} A promise that resolves to dimensions.
 */
export function readImageDimensions(file: File): Promise<{ width?: number; height?: number }> {
    return new Promise((resolve: (value: { width?: number; height?: number }) => void) => {
        const reader: FileReader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const img: HTMLImageElement = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
                resolve({});
            };
            img.src = e.target?.result as string;
        };
        reader.onerror = () => {
            resolve({});
        };
        reader.readAsDataURL(file);
    });
}
