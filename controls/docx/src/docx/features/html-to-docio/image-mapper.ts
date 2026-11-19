/* eslint-disable security/detect-object-injection, security/detect-unsafe-regex, valid-jsdoc */
import { _HTMLElement, _HTMLImageElement } from '../html-parser/dom-node.js';
export class _ImageMapper {
    private static resolvedImages: Record<string, Uint8Array> | undefined;
    /**
     * Register image bytes (keyed by the exact `src` value) that were resolved by the caller
     * or downloaded before conversion. Pass `undefined` to clear.
     *
     * @param {Record<string, Uint8Array> | undefined} images - Image bytes keyed by `src`
     * @private
     */
    static setResolvedImages(images: Record<string, Uint8Array> | undefined): void {
        _ImageMapper.resolvedImages = images;
    }
    /**
     * Get the currently registered image bytes keyed by the exact `src` value
     * (supplied by the caller via `LoadOptions.images`).
     *
     * @returns {Record<string, Uint8Array> | undefined} The registered image bytes
     * @private
     */
    static getResolvedImages(): Record<string, Uint8Array> | undefined {
        return _ImageMapper.resolvedImages;
    }
    /**
     * Map an HTML image element to a DocIO Picture.
     *
     * Handles:
     * - Image source extraction (src attribute)
     * - Data URI decoding (base64 images)
     * - Image dimensions (width, height attributes)
     * - Image attributes (alt, title)
     * - Image styles (border, opacity, etc.)
     *
     * @param {_HTMLElement} imgElement - The HTML <img> element to map
     * @returns {ImageData | null} Image data and properties, or null if image cannot be extracted
     * @private
     */
    static extractImageData(imgElement: _HTMLElement): ImageData | null {
        try {
            const imageData: ImageData = {
                bytes: null,
                width: undefined,
                height: undefined,
                alt: undefined,
                title: undefined,
                style: undefined,
                name: undefined
            };
            // Extract src attribute
            const src: string | null = imgElement.getAttribute('src');
            if (!src) {
                console.warn('Image element missing src attribute');
                return null;
            }

            // Check if image was pre-resolved during parsing (HTML parser level).
            // parseAsync() sets _resolvedImageBytes only when download succeeds; on
            // failure it stays undefined and the converter falls back to alt text.
            const parserResolved: Uint8Array | undefined = (imgElement as any)._resolvedImageBytes;
            if (parserResolved) {
                imageData.bytes = parserResolved;
            } else {
                // Fallback: Extract image data from src (legacy path for sync parse)
                imageData.bytes = this.extractImageBytes(src);
            }
            if (!imageData.bytes) {
                // No bytes available anywhere (sync path without resolution).
                // Fall back to alt text.
                return null;
            }
            // Extract dimensions
            const width: string | null = imgElement.getAttribute('width');
            if (width) {
                const widthValue: number = parseInt(width, 10);
                if (widthValue > 0 && width.indexOf('%') === -1) {
                    imageData.width = widthValue * 0.75;
                }
            }
            const height: string | null = imgElement.getAttribute('height');
            if (height) {
                const heightValue: number = parseInt(height, 10);
                if (heightValue > 0 && height.indexOf('%') === -1) {
                    imageData.height = heightValue * 0.75;
                }
            }
            // Extract alt text
            const alt: string | null = imgElement.getAttribute('alt');
            if (alt) {
                imageData.alt = alt;
            }
            // Extract title
            const title: string | null = imgElement.getAttribute('title');
            if (title) {
                imageData.title = title;
            }
            // Extract class (for name mapping)
            const className: string | null = imgElement.getAttribute('class');
            if (className) {
                imageData.name = className;
            }
            // Extract align attribute
            const align: string | null = imgElement.getAttribute('align');
            const alignValues: string[] = ['left', 'center', 'right', 'top', 'bottom', 'middle', 'texttop', 'textmiddle', 'textbottom'];
            if (align && alignValues.indexOf(align) !== -1) {
                imageData.align = align as ImageData['align'];
            }
            // Extract border attribute
            const border: string | null = imgElement.getAttribute('border');
            if (border) {
                const borderValue: number = parseInt(border, 10);
                if (borderValue > 0) {
                    imageData.border = borderValue;
                }
            }
            // Extract hspace attribute (horizontal spacing)
            const hspace: string | null = imgElement.getAttribute('hspace');
            if (hspace) {
                const hspaceValue: number = parseInt(hspace, 10);
                if (hspaceValue > 0) {
                    imageData.hspace = hspaceValue;
                }
            }
            // Extract vspace attribute (vertical spacing)
            const vspace: string | null = imgElement.getAttribute('vspace');
            if (vspace) {
                const vspaceValue: number = parseInt(vspace, 10);
                if (vspaceValue > 0) {
                    imageData.vspace = vspaceValue;
                }
            }
            // Extract id attribute
            const id: string | null = imgElement.getAttribute('id');
            if (id) {
                imageData.id = id;
            }
            // Extract loading attribute
            const loading: string | null = imgElement.getAttribute('loading');
            const loadingValues: string[] = ['lazy', 'eager'];
            if (loading && loadingValues.indexOf(loading) !== -1) {
                imageData.loading = loading as 'lazy' | 'eager';
            }
            // Extract srcset attribute (responsive images)
            const srcset: string | null = imgElement.getAttribute('srcset');
            if (srcset) {
                imageData.srcset = srcset;
            }
            // Extract sizes attribute (responsive images)
            const sizes: string | null = imgElement.getAttribute('sizes');
            if (sizes) {
                imageData.sizes = sizes;
            }
            // Extract data-* attributes
            imageData.customData = this.extractCustomDataAttributes(imgElement);
            // Extract inline styles
            if (imgElement._styles) {
                imageData.style = imgElement._styles;
                this.extractAdvancedStyles(imageData, imgElement._styles);
            }
            // Sync properties to HTMLImageElement if applicable
            if (imgElement instanceof _HTMLImageElement) {
                this.syncPropertiesToElement(imgElement, imageData);
            }
            return imageData;
        } catch (error) {
            console.error('Error extracting image data:', error);
            return null;
        }
    }
    /**
     * Synchronize extracted ImageData properties to HTMLImageElement typed properties.
     *
     * This populates the typed properties on HTMLImageElement so they can be
     * accessed programmatically without going through getAttribute().
     *
     * @param {any} element - The element value
     * @param {any} imageData - The imageData value
     * @returns {void}
     * @private
     */
    private static syncPropertiesToElement(element: _HTMLImageElement, imageData: ImageData): void {
    // Basic properties
        element.src = imageData.bytes ? 'data:image/*' : null;
        element.width = imageData.width || null;
        element.height = imageData.height || null;
        element.alt = imageData.alt || null;
        element.title = imageData.title || null;
        // Alignment and layout
        element.align = imageData.align;
        element.border = imageData.border;
        element.hspace = imageData.hspace;
        element.vspace = imageData.vspace;
        // Identity and metadata
        element.id = imageData.id;
        element.loading = imageData.loading;
        // Responsive image support
        element.srcset = imageData.srcset;
        element.sizes = imageData.sizes;
        // CSS style effects
        element.opacity = imageData.opacity;
        element.rotation = imageData.rotation;
        element.flipHorizontal = imageData.flipHorizontal;
        element.flipVertical = imageData.flipVertical;
        // Custom data attributes
        element.customData = imageData.customData;
    }
    /**
     * Extract image bytes from src attribute.
     *
     * Supports:
     * - Data URIs (base64 encoded)
     * - File paths (local files)
     * - External URLs (would require download)
     *
     * @param {any} src - The src value
     * @returns {Uint8Array | null}
     * @private
     */
    private static extractImageBytes(src: string): Uint8Array | null {
    // tslint:disable-next-line: no-any
        try {
            // Data URI format: data:image/png;base64,...
            if (src.startsWith('data:')) {
                return this.decodeDataUri(src);
            }
            const resolved: Uint8Array | undefined = _ImageMapper.resolvedImages ? _ImageMapper.resolvedImages[src] : undefined;
            if (resolved) {
                return resolved;
            }
            // For file paths and URLs, return null if not already resolved by openAsync.
            // HTTP/HTTPS URLs should have been downloaded and pre-resolved by openAsync's
            // downloadHtmlImages flow before reaching this point. If we get here for an
            // http(s) URL, it means the download failed (see console warnings above).
            if (/^https?:\/\//i.test(src)) {
                // Already logged by downloadHtmlImages; this is the graceful fallback
                return null;
            }
            console.warn('Local file image not embedded (relative/file:// paths are not supported):', src);
            return null;
        } catch (error) {
            console.error('Error extracting image bytes:', error);
            return null;
        }
    }
    /**
     * Decode a data URI to image bytes.
     *
     * @param {any} dataUri - The dataUri value
     * @returns {Uint8Array | null}
     * @private
     */
    private static decodeDataUri(dataUri: string): Uint8Array | null {
        try {
            // Parse data URI
            // Format: data:[<mediatype>][;base64],<data>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const match: RegExpMatchArray | null = dataUri.match(/^data:[^;]*(;base64)?,(.*)$/);
            if (!match) {
                console.warn('Invalid data URI format');
                return null;
            }
            const isBase64: boolean = !!match[1];
            const data: string | null = match[2];
            if (isBase64) {
                // Decode base64 to bytes
                return this.base64ToBytes(data);
            } else {
                // URL-encoded data
                return this.urlDecodeToBytes(data);
            }
        } catch (error) {
            console.error('Error decoding data URI:', error);
            return null;
        }
    }
    /**
     * Convert base64 string to Uint8Array.
     *
     * @param {any} base64 - The base64 value
     * @returns {Uint8Array | null}
     * @private
     */
    private static base64ToBytes(base64: string): Uint8Array | null {
    // tslint:disable-next-line: no-any
        try {
            // Decode base64 to binary string
            // tslint:disable-next-line: no-any
            const binaryString: string = atob(base64);
            // Convert to byte array
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bytes: any = new Uint8Array(binaryString.length);
            for (let i: number = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        } catch (error) {
            console.error('Error decoding base64:', error);
            return null;
        }
    }
    /**
     * Convert URL-encoded string to Uint8Array.
     *
     * @param {string} urlEncoded - The urlEncoded value
     * @returns {Uint8Array | null}
     * @private
     */
    private static urlDecodeToBytes(urlEncoded: string): Uint8Array | null {
        try {
            const decoded: string = decodeURIComponent(urlEncoded);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bytes: any = new Uint8Array(decoded.length);
            for (let i: number = 0; i < decoded.length; i++) {
                bytes[i] = decoded.charCodeAt(i);
            }
            return bytes;
        } catch (error) {
            console.error('Error decoding URL-encoded data:', error);
            return null;
        }
    }
    /**
     * Parse image dimensions from style attribute.
     *
     * @param {any} style - The style value
     * @private
     */
    static parseImageDimensions(
        style?: Record<string, string>
    ): { width?: number | undefined; height?: number | undefined } {
    // tslint:disable-next-line: no-any
        const dimensions: { width?: number | undefined; height?: number | undefined } = {};
        if (!style) {
            return dimensions;
        }
        // Parse width from style
        if (style.width) {
            const widthValue: number | null = this.parseSize(style.width);
            if (widthValue !== null) {
                dimensions.width = widthValue;
            }
        }
        // Parse height from style
        if (style.height) {
            const heightValue: number | null = this.parseSize(style.height);
            if (heightValue !== null) {
                dimensions.height = heightValue;
            }
        }
        return dimensions;
    }
    /**
     * Parse a CSS size value (e.g., "100px", "50%", "10em").
     *
     * @param {any} sizeStr - The sizeStr value
     * @returns {number | null}
     * @private
     */
    private static parseSize(sizeStr: string): number | null {
        if (!sizeStr) {
            return null;
        }
        // Extract numeric value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const match: RegExpMatchArray | null = sizeStr.match(/(\d+(?:\.\d+)?)/);
        if (match) {
            return parseFloat(match[1]);
        }
        return null;
    }
    /**
     * Get image format from src or media type.
     *
     * @param {any} src - The src value
     * @private
     */
    static getImageFormat(src: string): string {
    // Data URI: data:image/png;base64,...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataUriMatch: RegExpMatchArray | null = src.match(/^data:image\/([^;]+)/);
        if (dataUriMatch) {
            return dataUriMatch[1].toLowerCase();
        }
        // File extension: image.png, image.jpg, etc.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const extMatch: RegExpMatchArray | null = src.match(/\.([a-z]+)(?:\?|#|$)/i);
        if (extMatch) {
            return extMatch[1].toLowerCase();
        }
        // Default to PNG
        return 'png';
    }
    /**
     * Validate image data for embedding.
     *
     * @param {any} imageData - The imageData value
     * @private
     */
    static validateImageData(imageData: ImageData): boolean {
    // Must have image bytes
        if (!imageData.bytes || imageData.bytes.length === 0) {
            console.warn('Image data is empty');
            return false;
        }
        // Maximum image size: 50MB (limit for embedding)
        const MAX_SIZE: number = 50 * 1024 * 1024;
        if (imageData.bytes.length > MAX_SIZE) {
            console.warn('Image data exceeds maximum size limit');
            return false;
        }
        // Valid dimensions if provided
        if (imageData.width !== undefined && imageData.width <= 0) {
            console.warn('Image width must be positive');
            return false;
        }
        if (imageData.height !== undefined && imageData.height <= 0) {
            console.warn('Image height must be positive');
            return false;
        }
        return true;
    }
    /**
     * Extract advanced CSS styles from style attribute.
     *
     * Handles:
     * - opacity
     * - transform (rotation, flip)
     * - border styling
     * - margin spacing
     *
     * @param {any} imageData - The imageData value
     * @param {any} styles - The styles value
     * @private
     */
    private static extractAdvancedStyles(
        imageData: ImageData,
        styles: Record<string, string>
    ): void {
    // Parse opacity
        if (styles.opacity !== undefined) {
            const opacityValue: number = parseFloat(styles.opacity);
            if (opacityValue >= 0 && opacityValue <= 1) {
                imageData.opacity = opacityValue;
            }
        }
        // Parse rotation and flips from transform
        if (styles.transform) {
            // Parse rotate() from transform
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rotateMatch: RegExpMatchArray | null = styles.transform.match(/rotate\(([0-9.-]+)deg\)/);
            if (rotateMatch) {
                imageData.rotation = parseFloat(rotateMatch[1]);
            }
            // Parse scaleX(-1) for horizontal flip
            if (styles.transform.includes('scaleX(-1)')) {
                imageData.flipHorizontal = true;
            }
            // Parse scaleY(-1) for vertical flip
            if (styles.transform.includes('scaleY(-1)')) {
                imageData.flipVertical = true;
            }
        }
        // Parse border
        if (styles.border || styles.borderWidth) {
            const borderStr: string = styles.border || styles.borderWidth;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const borderMatch: RegExpMatchArray | null = (borderStr as string).match(/(\d+)px/);
            if (borderMatch) {
                imageData.border = parseInt(borderMatch[1], 10);
            }
        }
    }
    /**
     * Extract custom data-* attributes from HTML element.
     *
     * Converts data-category="value" to customData: { category: "value" }
     *
     * @param {any} imgElement - The imgElement value
     * @private
     */
    private static extractCustomDataAttributes(
        imgElement: _HTMLElement
    ): Record<string, string> | undefined {
        const customData: Record<string, string> = {};
        // Extract all attributes and filter for data-* prefix
        // This depends on how HTMLElement exposes attributes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((imgElement as any).attributes) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const attrs: string[] = (imgElement as any).attributes;
            for (const key in attrs) {
                if (key.startsWith('data-')) {
                    const dataKey: string = key.substring(5); // Remove 'data-' prefix
                    customData[dataKey] = attrs[key];
                }
            }
        }
        // Return undefined if no custom data found
        return Object.keys(customData).length > 0 ? customData : undefined;
    }
    /**
     * Map HTML align attribute to DocIO text wrapping style.
     *
     * @param {any} align - The align value
     * @private
     */
    static mapHorizontalAlign(align?: string): 'left' | 'center' | 'right' | undefined {
        switch (align) {
        case 'left':
            return 'left';
        case 'center':
            return 'center';
        case 'right':
            return 'right';
        default:
            return undefined;
        }
    }
    /**
     * Map HTML align attribute to DocIO vertical alignment.
     *
     * @param {any} align - The align value
     * @private
     */
    static mapVerticalAlign(
        align?: string
    ): 'top' | 'center' | 'bottom' | undefined {
        switch (align) {
        case 'top':
        case 'texttop':
            return 'top';
        case 'middle':
        case 'textmiddle':
            return 'center';
        case 'bottom':
        case 'textbottom':
            return 'bottom';
        default:
            return undefined;
        }
    }
}
/**
 * @private
 */
export interface ImageData {
    bytes: Uint8Array | null;
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
    style?: Record<string, string>;
    name?: string;
    // Alignment properties
    align?: 'left' | 'center' | 'right' | 'top' | 'bottom' | 'middle' | 'texttop' | 'textmiddle' | 'textbottom';
    // Spacing properties
    border?: number;
    hspace?: number;
    vspace?: number;
    // Additional standard attributes
    id?: string;
    loading?: 'lazy' | 'eager';
    // CSS style parsing results
    opacity?: number;
    rotation?: number;
    flipHorizontal?: boolean;
    flipVertical?: boolean;
    // Custom data attributes (data-*)
    customData?: Record<string, string>;
    // Responsive image support
    srcset?: string;
    sizes?: string;
}
