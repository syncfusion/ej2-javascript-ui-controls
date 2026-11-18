import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Convert a decoded PDF appearance image into a base64 data URL so that it can be
 * serialized (JSON export, session storage, XFDF) and restored later.
 *
 * The appearance image is a live `HTMLImageElement`, which does not survive any
 * string based serialization. Keeping the raster in a data URL lets the annotation
 * collection round-trip it.
 *
 * @hidden
 * @param {HTMLImageElement} image - The appearance image to serialize.
 * @returns {string} The data URL, or undefined when the image is unusable.
 */
export function getCanvasDataURL(image: HTMLImageElement): string {
    if (isNullOrUndefined(image) || !image.src) {
        return undefined;
    }
    try {
        const width: number = image.naturalWidth || image.width;
        const height: number = image.naturalHeight || image.height;
        if (!width || !height) {
            return undefined;
        }
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        if (!ctx) {
            return undefined;
        }
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL('image/png');
    } catch (error) {
        return undefined;
    }
}

/**
 * Rebuild an appearance image from its serialized data URL.
 *
 * @hidden
 * @param {string} dataUrl - The serialized appearance image.
 * @returns {HTMLImageElement} The rebuilt image, or null when the data URL is missing.
 */
export function decodeDataURLImage(dataUrl: string): HTMLImageElement {
    if (isNullOrUndefined(dataUrl) || !dataUrl) {
        return null;
    }
    const image: HTMLImageElement = new Image();
    image.src = dataUrl;
    return image;
}

/**
 * Resolve the appearance image of an annotation.
 *
 * The live `HTMLImageElement` does not survive the JSON round trip that the
 * annotation collection performs, so the serialized data URL is used to rebuild
 * it. The resolved image is written back onto the annotation so that the render
 * path and the print path both paint the same appearance.
 *
 * @hidden
 * @param {any} annotation - The annotation to resolve the appearance image for.
 * @returns {HTMLImageElement} The appearance image, or null when there is none.
 */
export function resolveAppearanceImage(annotation: any): HTMLImageElement {
    if (isNullOrUndefined(annotation)) {
        return null;
    }
    if (annotation.templateAppearanceImage) {
        return annotation.templateAppearanceImage;
    }
    return null;
}
