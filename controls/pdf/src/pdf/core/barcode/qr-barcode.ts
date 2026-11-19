import { PdfBrush, PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { PdfColor, Rectangle, PdfBarcodeQuietZone, PdfQRBarcodeOptions, _QrEncodeResult, _QrSegment, _QrLayout, PdfQRBarcodeLogo } from '../pdf-document-helper';
import {
    PdfQRErrorCorrectionLevel, PdfQRInputMode, PdfBarcodeTextEncoding, PdfQRVersion
} from '../enumerator';
import { PdfBidimensionalBarcode } from './pdf-bidimensional-barcode';
import { PdfBitmap } from '../graphics/images/pdf-bitmap';
/**
 * Represents a QR Code Model 2 barcode for drawing on a PDF page or graphics context.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create and configure the QR barcode
 * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
 * barcode.errorCorrectionLevel = PdfQRErrorCorrectionLevel.Medium;
 * barcode.xDimension = 3;
 * // Draw the barcode on the page
 * barcode.draw(page, { x: 40, y: 40, width: 150, height: 150 });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document and release resources
 * document.destroy();
 * ```
 */
export class PdfQRBarcode extends PdfBidimensionalBarcode {
    /**
     * The requested input encoding mode.
     *
     * @private
     */
    private _inputMode: PdfQRInputMode = PdfQRInputMode.Mixed;
    /**
     * The requested error correction level.
     *
     * @private
     */
    private _errorCorrectionLevel: PdfQRErrorCorrectionLevel = PdfQRErrorCorrectionLevel.Medium;
    /**
     * The requested QR symbol version.
     *
     * @private
     */
    private _version: PdfQRVersion = PdfQRVersion.Auto;
    /**
     * The byte conversion used by byte segments.
     *
     * @private
     */
    private _textEncoding: PdfBarcodeTextEncoding = PdfBarcodeTextEncoding.Utf8;
    /**
     * The version selected during the most recent successful draw.
     *
     * @private
     */
    private _actualVersion: number;
    /**
     * The module count of the most recent successful draw.
     *
     * @private
     */
    private _moduleCount: number;
    /**
     * The module count used for layout resolution during the current draw.
     *
     * @private
     */
    private _moduleCountSymbol: number = 0;
    private _logo: PdfQRBarcodeLogo;
    private _logoSource: PdfBitmap | Uint8Array;
    private _logoBitmap: PdfBitmap;
    /**
     * Creates a QR barcode.
     *
     * @param {string} text The payload text.
     * @param {PdfQRBarcodeOptions} options The barcode options.
     */
    public constructor(text: string, options?: PdfQRBarcodeOptions) {
        super(text);
        if (options !== null && typeof options !== 'undefined') {
            if (options.inputMode !== null && typeof options.inputMode !== 'undefined') { this.inputMode = options.inputMode; }
            if (options.errorCorrectionLevel !== null && typeof options.errorCorrectionLevel !== 'undefined') {
                this.errorCorrectionLevel = options.errorCorrectionLevel;
            }
            if (options.version !== null && typeof options.version !== 'undefined') { this.version = options.version; }
            if (options.textEncoding !== null && typeof options.textEncoding !== 'undefined') { this.textEncoding = options.textEncoding; }
            if (options.xDimension !== null && typeof options.xDimension !== 'undefined') { this.xDimension = options.xDimension; }
            if (options.quietZone !== null && typeof options.quietZone !== 'undefined') { this.quietZone = options.quietZone; }
            if (options.foreColor !== null && typeof options.foreColor !== 'undefined') { this.foreColor = options.foreColor; }
            if (options.backColor !== null && typeof options.backColor !== 'undefined') { this.backColor = options.backColor; }
            if (options.logo !== null && typeof options.logo !== 'undefined') {
                this.logo = options.logo;
            }
        }
    }
    /**
     * Gets the optional centered logo.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create and configure the QR barcode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * let logo: PdfQRBarcodeLogo = barcode.logo;
     * // Draw the barcode on the page
     * barcode.draw(page, { x: 40, y: 40, width: 150, height: 150 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document and release resources
     * document.destroy();
     * ```
     *
     * @returns {PdfQRBarcodeLogo} The configured logo, or undefined when none is set.
     */
    public get logo(): PdfQRBarcodeLogo {
        return this._logo;
    }
    /**
     * Sets the optional centered logo.
     * The value must be a `PdfQRBarcodeLogo` object or `undefined` to remove an
     * existing logo. Logo placement is validated before any PDF content is
     * emitted; unsafe coverage throws an `Error` when strict validation is enabled on the logo.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Create QR barcode with centered logo onto the symbol
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://example.com/verify/12345', {
     *     errorCorrectionLevel: PdfQRErrorCorrectionLevel.High,
     *     logo: {
     *         data: pngBytes,
     *         size: {
     *             width: 32,
     *             height: 32
     *         }
     *     }
     * });
     * // Draw the barcode on the page
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfQRBarcodeLogo} value The logo configuration, or undefined to remove the logo.
     */
    public set logo(value: PdfQRBarcodeLogo) {
        this._logo = value;
    }
    /**
     * Gets the input encoding mode applied to the payload.
     *
     * ```typescript
     * // Read the input mode of a QR barcode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('0123456789');
     * console.log(barcode.inputMode);   // PdfQRInputMode.Mixed
     * ```
     *
     * @returns {PdfQRInputMode} The active input encoding mode.
     */
    public get inputMode(): PdfQRInputMode {
        return this._inputMode;
    }
    /**
     * Sets the input encoding mode applied to the payload.
     * The value must be one of the `PdfQRInputMode` members; any other value
     * throws an `Error`. Forced modes
     * reject unsupported characters at draw time instead of silently converting
     * them, so `PdfQRInputMode.AlphaNumeric` rejects lowercase input.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Force numeric input mode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('0123456789');
     * barcode.inputMode = PdfQRInputMode.Numeric;
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfQRInputMode} value One of the `PdfQRInputMode` members.
     */
    public set inputMode(value: PdfQRInputMode) {
        this._validateEnum('inputMode', value, 0, 3);
        this._inputMode = value;
    }
    /**
     * Gets the error correction level of the symbol.
     *
     * ```typescript
     * // Read the error correction level of a QR barcode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('Hello');
     * console.log(barcode.errorCorrectionLevel);   // PdfQRErrorCorrectionLevel.Medium
     * ```
     *
     * @returns {PdfQRErrorCorrectionLevel} The active error correction level.
     */
    public get errorCorrectionLevel(): PdfQRErrorCorrectionLevel {
        return this._errorCorrectionLevel;
    }
    /**
     * Sets the error correction level of the symbol.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Use high error correction
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * barcode.errorCorrectionLevel = PdfQRErrorCorrectionLevel.High;
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfQRErrorCorrectionLevel} value One of the `PdfQRErrorCorrectionLevel` members.
     */
    public set errorCorrectionLevel(value: PdfQRErrorCorrectionLevel) {
        this._validateEnum('errorCorrectionLevel', value, 0, 3);
        this._errorCorrectionLevel = value;
    }
    /**
     * Gets the QR symbol version selection.
     *
     * ```typescript
     * // Read the version selection of a QR barcode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('Hello');
     * console.log(barcode.version);   // PdfQRVersion.Auto
     * ```
     *
     * @returns {PdfQRVersion} The active version selection.
     */
    public get version(): PdfQRVersion {
        return this._version;
    }
    /**
     * Sets the QR symbol version selection.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Pin the symbol to version 5
     * let barcode: PdfQRBarcode = new PdfQRBarcode('INVOICE-2026-000123');
     * barcode.version = PdfQRVersion.Version05;
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfQRVersion} value The automatic selection or a fixed version member.
     */
    public set version(value: PdfQRVersion) {
        this._validateEnum('version', value, 0, 40);
        this._version = value;
    }
    /**
     * Gets the byte conversion used by byte segments.
     *
     * ```typescript
     * // Read the text encoding of a QR barcode
     * let barcode: PdfQRBarcode = new PdfQRBarcode('Hello');
     * console.log(barcode.textEncoding);   // PdfBarcodeTextEncoding.Utf8
     * ```
     *
     * @returns {PdfBarcodeTextEncoding} The active byte conversion.
     */
    public get textEncoding(): PdfBarcodeTextEncoding {
        return this._textEncoding;
    }
    /**
     * Sets the byte conversion used by byte segments.
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Encode byte segments as ISO-8859-1
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * barcode.textEncoding = PdfBarcodeTextEncoding.Iso88591;
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfBarcodeTextEncoding} value One of the `PdfBarcodeTextEncoding` members.
     */
    public set textEncoding(value: PdfBarcodeTextEncoding) {
        this._validateEnum('textEncoding', value, 0, 1);
        this._textEncoding = value;
    }
    /**
     * Gets the version selected during the most recent successful draw.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw and inspect the automatically selected version
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * console.log(barcode.actualVersion);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The selected QR version, or undefined before the first draw.
     */
    public get actualVersion(): number {
        return this._actualVersion;
    }
    /**
     * Gets the module count of the most recent successful draw.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw and inspect the module count
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * console.log(barcode.moduleCount);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The symbol module count per side, or undefined before the first draw.
     */
    public get moduleCount(): number {
        return this._moduleCount;
    }
    /**
     * Validates that a value is a whole number inside an inclusive enum range.
     *
     * @param {string} name - The public property name used in the error message.
     * @param {number} value - The candidate enum value.
     * @param {number} min - The inclusive lower bound.
     * @param {number} max - The inclusive upper bound.
     * @returns {void} - Throws when the value is not a valid enum member.
     * @private
     */
    private _validateEnum(name: string, value: number, min: number, max: number): void {
        if (typeof value !== 'number' || Math.floor(value) !== value || value < min || value > max) {
            throw new Error(`${name} is not a valid enum value`);
        }
    }
    /**
     * Validates all public drawing inputs before any PDF content is emitted.
     *
     * @returns {void} - Throws the first validation failure.
     * @private
     */
    private _validate(): void {
        if (this.text === null || this.text === undefined || typeof this.text !== 'string' || this.text.length === 0) {
            throw new Error('text must be a non-empty string');
        }
        if (typeof this.xDimension !== 'number' || !isFinite(this.xDimension) || this.xDimension <= 0) {
            throw new Error('xDimension must be a finite positive number');
        }
        const zone: PdfBarcodeQuietZone = this.quietZone;
        const allSide: number = zone.all !== null && typeof zone.all !== 'undefined' ? zone.all : 0;
        const leftSide: number = zone.left !== null && typeof zone.left !== 'undefined' ? zone.left : allSide;
        const topSide: number = zone.top !== null && typeof zone.top !== 'undefined' ? zone.top : allSide;
        const rightSide: number = zone.right !== null && typeof zone.right !== 'undefined' ? zone.right : allSide;
        const bottomSide: number = zone.bottom !== null && typeof zone.bottom !== 'undefined' ? zone.bottom : allSide;
        if (!isFinite(allSide) || allSide < 0 || !isFinite(leftSide) || leftSide < 0 ||
            !isFinite(topSide) || topSide < 0 || !isFinite(rightSide) || rightSide < 0 ||
            !isFinite(bottomSide) || bottomSide < 0) {
            throw new Error(
                'quietZone values must be finite non-negative numbers');
        }
        const foreColor: PdfColor = this.foreColor;
        if (typeof foreColor.r !== 'number' || typeof foreColor.g !== 'number' || typeof foreColor.b !== 'number') {
            throw new Error('foreColor must contain numeric r, g and b values');
        }
        const backColor: PdfColor = this.backColor;
        if (typeof backColor.r !== 'number' || typeof backColor.g !== 'number' || typeof backColor.b !== 'number') {
            throw new Error('backColor must contain numeric r, g and b values');
        }
    }
    /**
     * Resolves the logo data into a decoded bitmap, caching the result per source.
     *
     * @param {PdfQRBarcodeLogo} logo - The logo configuration.
     * @returns {PdfBitmap} The decoded logo bitmap.
     * @private
     */
    private _resolveLogoImage(logo: PdfQRBarcodeLogo): PdfBitmap {
        const data: PdfBitmap | Uint8Array = logo.data;
        if (data instanceof PdfBitmap) {
            return data;
        }
        if (!(data instanceof Uint8Array)) {
            throw new Error('logo source must be a PdfBitmap or Uint8Array');
        }
        if (this._logoSource !== data || this._logoBitmap === null || typeof this._logoBitmap === 'undefined') {
            this._logoBitmap = new PdfBitmap(data);
            this._logoSource = data;
        }
        return this._logoBitmap;
    }
    /**
     * Validates logo dimensions and coverage before any PDF content is emitted.
     *
     * @param {_QrLayout} layout - The resolved output layout.
     * @returns {void} - Throws the first logo validation failure.
     * @private
     */
    private _validateLogo(layout: _QrLayout): void {
        if (this._logo === undefined || this._logo === null) {
            return;
        }
        const logo: PdfQRBarcodeLogo = this._logo;
        const logoWidth: number = logo.size ? logo.size.width : undefined;
        const logoHeight: number = logo.size ? logo.size.height : undefined;
        const padding: number = logo.padding !== null && typeof logo.padding !== 'undefined' ? logo.padding : 0;
        const preserveAspectRatio: boolean = logo.preserveAspectRatio !== null && typeof logo.preserveAspectRatio !== 'undefined' ? logo.preserveAspectRatio : true;
        const strictValidation: boolean = logo.strictValidation !== null && typeof logo.strictValidation !== 'undefined' ? logo.strictValidation : true;
        const image: PdfBitmap = this._resolveLogoImage(logo);
        if (image === null || image === undefined || !(image.width > 0) || !(image.height > 0)) {
            throw new Error('logo image is invalid or unsupported');
        }
        if (logoWidth !== null && typeof logoWidth !== 'undefined' && logoWidth <= 0) {
            throw new Error('logo width must be positive');
        }
        if (logoHeight !== null && typeof logoHeight !== 'undefined' && logoHeight <= 0) {
            throw new Error('logo height must be positive');
        }
        if (typeof padding !== 'number' || !isFinite(padding) || padding < 0) {
            throw new Error('logo padding must be a finite non-negative number');
        }
        if (!strictValidation) {
            return;
        }
        if ((logoWidth === null || typeof logoWidth === 'undefined') && (logoHeight === null || typeof logoHeight === 'undefined')) {
            throw new Error(
                'logo width or height must be supplied for strict validation');
        }
        // Resolve the rendered logo size with the same rules as _renderLogo and
        // verify conservative coverage before any content is emitted.
        const contentSize: number = this._moduleCountSymbol * layout.moduleSize;
        const maxRatio: number = 0.25;
        const defaultSize: number = contentSize * maxRatio;
        let width: number = logoWidth !== null && typeof logoWidth !== 'undefined' ? logoWidth : defaultSize;
        let height: number = logoHeight !== null && typeof logoHeight !== 'undefined' ? logoHeight : defaultSize;
        if (preserveAspectRatio) {
            const ratio: number = image.width / image.height;
            if (logoWidth !== null && typeof logoWidth !== 'undefined' && (logoHeight === null || typeof logoHeight === 'undefined')) {
                height = width / ratio;
            } else if (logoHeight !== null && typeof logoHeight !== 'undefined' && (logoWidth === null || typeof logoWidth === 'undefined')) {
                width = height * ratio;
            } else {
                const fitRatio: number = Math.min(width / image.width, height / image.height);
                width = image.width * fitRatio;
                height = image.height * fitRatio;
            }
        }
        if (width <= 0 || height <= 0) {
            throw new Error('logo dimensions resolve to a non-positive size');
        }
        const covered: number = ((width + 2 * padding) / contentSize) * ((height + 2 * padding) / contentSize);
        if (covered > maxRatio) {
            throw new Error(
                'logo covers too much of the QR symbol; reduce the logo dimensions');
        }
    }
    /**
     * Resolves the quiet-zone sides in modules.
     *
     * @returns {object} The resolved quiet-zone sides.
     * @private
     */
    private _quietZoneSides(): { left: number; top: number; right: number; bottom: number } {
        const zone: PdfBarcodeQuietZone = this.quietZone;
        const all: number = zone.all !== null && typeof zone.all !== 'undefined' ? zone.all : 0;
        return {
            left: zone.left !== null && typeof zone.left !== 'undefined' ? zone.left : all,
            top: zone.top !== null && typeof zone.top !== 'undefined' ? zone.top : all,
            right: zone.right !== null && typeof zone.right !== 'undefined' ? zone.right : all,
            bottom: zone.bottom !== null && typeof zone.bottom !== 'undefined' ? zone.bottom : all
        };
    }
    /**
     * Draws the barcode within the supplied bounds and returns the occupied bounds.
     * Throws an error if the bounds are too small for the required quiet zone.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw the barcode within the supplied bounds
     * let barcode: PdfQRBarcode = new PdfQRBarcode('https://www.syncfusion.com');
     * barcode.draw(page, { x: 40, y: 40, width: 150, height: 150 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document and release resources
     * document.destroy();
     * ```
     *
     * @param {PdfPage | PdfGraphics} target The PDF page or graphics context to draw on.
     * @param {Rectangle} bounds The drawing bounds for the barcode.
     * @returns {Rectangle} The bounds occupied by the barcode.
     */
    public draw(target: PdfPage | PdfGraphics, bounds: Rectangle): Rectangle {
        if (target === null || target === undefined ||
            (!(target instanceof PdfPage) && !(target instanceof PdfGraphics))) {
            throw new Error(
                'draw target must be a PdfPage or PdfGraphics instance');
        }
        const graphics: PdfGraphics = target instanceof PdfPage ? target.graphics : target;
        return this._drawOnGraphics(graphics, this._resolveBounds(bounds));
    }
    /**
     * Resolves the output bounds from the draw argument, validating the supplied bounds.
     *
     * @param {Rectangle} bounds - The supplied drawing bounds.
     * @returns {Rectangle} The resolved output bounds.
     * @private
     */
    private _resolveBounds(bounds: Rectangle): Rectangle {
        if (bounds === undefined || bounds === null) {
            return { x: 0 , y: 0, width: 100, height: 100 };
        }
        if (typeof bounds.x !== 'number' || typeof bounds.y !== 'number' ||
            typeof bounds.width !== 'number' || typeof bounds.height !== 'number') {
            throw new Error(
                'draw bounds must contain numeric x, y, width and height');
        }
        return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    }
    /**
     * Validates the state, encodes the payload and renders the symbol.
     *
     * @param {PdfGraphics} graphics - The graphics context to draw on.
     * @param {Rectangle} outerBounds - The resolved output bounds.
     * @returns {Rectangle} The bounds occupied by the barcode.
     * @private
     */
    private _drawOnGraphics(graphics: PdfGraphics, outerBounds: Rectangle): Rectangle {
        if (!isFinite(outerBounds.x) || !isFinite(outerBounds.y)) {
            throw new Error('draw location coordinates must be finite');
        }
        // Validate every public input before any PDF content is emitted.
        this._validate();
        const result: _QrEncodeResult = this._encodeQr(
            this.text, this._inputMode, this._errorCorrectionLevel, this._version, this._textEncoding);
        this._moduleCountSymbol = result.size;
        const layout: _QrLayout = this._resolveLayout(result.size, outerBounds);
        this._validateLogo(layout);
        const occupied: Rectangle = this._render(graphics, outerBounds, result.matrix as boolean[][], layout);
        this._actualVersion = result.version;
        this._moduleCount = result.size;
        return occupied;
    }
    /**
     * Resolves the output layout (module size, bounds and offsets) for a symbol.
     *
     * @param {number} moduleCount - The symbol module count per side.
     * @param {Rectangle} outerBounds - The resolved output bounds.
     * @returns {_QrLayout} The resolved layout values.
     * @private
     */
    private _resolveLayout(moduleCount: number, outerBounds: Rectangle): _QrLayout {
        const zone: { left: number; top: number; right: number; bottom: number } = this._quietZoneSides();
        const quietWidth: number = (zone.left + zone.right) * this.xDimension;
        const quietHeight: number = (zone.top + zone.bottom) * this.xDimension;
        const hasExplicitSize: boolean = outerBounds.width > 0 && outerBounds.height > 0;
        let moduleSize: number;
        let totalWidth: number;
        let totalHeight: number;
        let offsetX: number = 0;
        let offsetY: number = 0;
        if (hasExplicitSize) {
            const availableWidth: number = outerBounds.width - quietWidth;
            const availableHeight: number = outerBounds.height - quietHeight;
            if (availableWidth <= 0 || availableHeight <= 0) {
                throw new Error(
                    'size is too small for the quiet zone');
            }
            moduleSize = Math.min(availableWidth, availableHeight) / moduleCount;
            totalWidth = outerBounds.width;
            totalHeight = outerBounds.height;
            offsetX = (availableWidth - moduleSize * moduleCount) / 2;
            offsetY = (availableHeight - moduleSize * moduleCount) / 2;
        } else {
            moduleSize = this.xDimension;
            totalWidth = moduleCount * moduleSize + quietWidth;
            totalHeight = moduleCount * moduleSize + quietHeight;
        }
        return {
            zone: zone,
            moduleSize: moduleSize,
            totalWidth: totalWidth,
            totalHeight: totalHeight,
            offsetX: offsetX,
            offsetY: offsetY
        };
    }
    /**
     * Renders the module matrix as vector graphics with run coalescing.
     * Consecutive dark modules in a row are merged into single filled
     * rectangles to minimize the number of emitted PDF operators.
     *
     * @param {PdfGraphics} graphics - The graphics context to draw on.
     * @param {Rectangle} outerBounds - The resolved output bounds.
     * @param {boolean[]} matrix - The module matrix; dark modules are true.
     * @param {_QrLayout} layout - The resolved output layout.
     * @returns {Rectangle} The occupied bounds.
     * @private
     */
    private _render(graphics: PdfGraphics, outerBounds: Rectangle, matrix: boolean[][], layout: _QrLayout): Rectangle {
        const zone: { left: number; top: number; right: number; bottom: number } = layout.zone;
        const moduleCount: number = this._moduleCountSymbol;
        const moduleSize: number = layout.moduleSize;
        const bgBrush: PdfBrush = new PdfBrush(this.backColor);
        graphics.drawRectangle(
            { x: outerBounds.x, y: outerBounds.y, width: layout.totalWidth, height: layout.totalHeight }, bgBrush);
        const fgBrush: PdfBrush = new PdfBrush(this.foreColor);
        const startX: number = outerBounds.x + zone.left * this.xDimension + layout.offsetX;
        const startY: number = outerBounds.y + zone.top * this.xDimension + layout.offsetY;
        // Scan rows and merge consecutive dark modules into horizontal runs so that
        // one filled rectangle is emitted per run (fewer PDF operators, no seams).
        for (let row: number = 0; row < moduleCount; row++) {
            const y: number = startY + row * moduleSize;
            let runStart: number = -1;
            for (let col: number = 0; col <= moduleCount; col++) {
                const dark: boolean = col < moduleCount && matrix[<number>row][<number>col];
                if (dark && runStart === -1) {
                    runStart = col;
                } else if (!dark && runStart !== -1) {
                    const x: number = startX + runStart * moduleSize;
                    const runWidth: number = (col - runStart) * moduleSize;
                    graphics.drawRectangle(
                        { x: x, y: y, width: runWidth, height: moduleSize }, fgBrush);
                    runStart = -1;
                }
            }
        }
        if (this._logo !== undefined && this._logo !== null) {
            this._renderLogo(graphics, startX, startY, moduleCount, moduleSize);
        }
        return { x: outerBounds.x, y: outerBounds.y, width: layout.totalWidth, height: layout.totalHeight };
    }
    /**
     * Renders the centered logo after the QR modules are painted.
     *
     * @param {PdfGraphics} graphics - The graphics context to draw on.
     * @param {number} startX - The symbol content left edge.
     * @param {number} startY - The symbol content top edge.
     * @param {number} moduleCount - The symbol module count per side.
     * @param {number} moduleSize - The rendered module size.
     * @returns {void} - Paints the logo into the graphics context.
     * @private
     */
    private _renderLogo(graphics: PdfGraphics, startX: number, startY: number,
                        moduleCount: number, moduleSize: number): void {
        const logo: PdfQRBarcodeLogo = this._logo;
        const logoWidth: number = logo.size ? logo.size.width : undefined;
        const logoHeight: number = logo.size ? logo.size.height : undefined;
        const padding: number = logo.padding !== null && typeof logo.padding !== 'undefined' ? logo.padding : 0;
        const preserveAspectRatio: boolean = logo.preserveAspectRatio !== null && typeof logo.preserveAspectRatio !== 'undefined' ? logo.preserveAspectRatio : true;
        const image: PdfBitmap = this._resolveLogoImage(logo);
        const contentSize: number = moduleCount * moduleSize;
        const maxRatio: number = 0.25;
        const defaultSize: number = contentSize * maxRatio;
        let width: number = logoWidth !== null && typeof logoWidth !== 'undefined' ? logoWidth : defaultSize;
        let height: number = logoHeight !== null && typeof logoHeight !== 'undefined' ? logoHeight : defaultSize;
        if (preserveAspectRatio) {
            const ratio: number = image.width / image.height;
            if (logoWidth !== null && typeof logoWidth !== 'undefined' && (logoHeight === null || typeof logoHeight === 'undefined')) {
                height = width / ratio;
            } else if (logoHeight !== null && typeof logoHeight !== 'undefined' && (logoWidth === null || typeof logoWidth === 'undefined')) {
                width = height * ratio;
            } else {
                const fitRatio: number = Math.min(width / image.width, height / image.height);
                width = image.width * fitRatio;
                height = image.height * fitRatio;
            }
        }
        if (width <= 0 || height <= 0) {
            throw new Error('logo dimensions resolve to a non-positive size');
        }
        if (padding > 0) {
            const padBrush: PdfBrush = new PdfBrush(this.backColor);
            graphics.drawRectangle(
                {
                    x: startX + (contentSize - width) / 2 - padding,
                    y: startY + (contentSize - height) / 2 - padding,
                    width: width + 2 * padding,
                    height: height + 2 * padding
                },
                padBrush
            );
        }
        graphics.drawImage(
            image,
            {
                x: startX + (contentSize - width) / 2,
                y: startY + (contentSize - height) / 2,
                width: width,
                height: height
            }
        );
    }
    /**
     * Alphanumeric character set (ISO/IEC 18004).
     *
     * @private
     */
    private readonly _alphanumericCharset: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
    /**
     * Alphanumeric value map (0 through 44).
     *
     * @private
     */
    private readonly _alphanumericValues: { [key: string]: number } = (() => {
        const map: { [key: string]: number } = {};
        for (let i: number = 0; i < this._alphanumericCharset.length; i++) {
            map[this._alphanumericCharset.charAt(i)] = i;
        }
        return map;
    })();
    /**
     * GF(256) exponent table over the QR primitive polynomial 0x11D.
     *
     * @private
     */
    private readonly _galoisFieldExponential: number[] = (() => {
        const exp: number[] = new Array<number>(512);
        let value: number = 1;
        for (let i: number = 0; i < 255; i++) {
            exp[<number>i] = value;
            value <<= 1;
            if (value >= 256) { value ^= 0x11D; }
        }
        for (let i: number = 255; i < 512; i++) {
            exp[<number>i] = exp[i - 255];
        }
        return exp;
    })();
    /**
     * GF(256) logarithm table.
     *
     * @private
     */
    private readonly _galoisFieldLogarithm: number[] = (() => {
        const log: number[] = new Array<number>(256);
        for (let i: number = 0; i < 255; i++) {
            log[this._galoisFieldExponential[<number>i]] = i;
        }
        return log;
    })();
    /**
     * GF(256) multiplication.
     *
     * @param {number} x - Description.
     * @param {number} y - Description.
     * @returns {number} Description.
     * @private
     */
    private _gfMul(x: number, y: number): number {
        if (x === 0 || y === 0) { return 0; }
        return this._galoisFieldExponential[this._galoisFieldLogarithm[<number>x] + this._galoisFieldLogarithm[<number>y]];
    }
    /**
     * Reed-Solomon divisor polynomial cache keyed by degree (ISO/IEC 18004).
     *
     * @private
     */
    private readonly _divisorCache: { [key: number]: number[] } = {};
    /**
     * Computes the Reed-Solomon divisor polynomial for a degree. Coefficients are
     * stored from the highest to the lowest power, excluding the leading 1.
     *
     * @param {number} degree - Description.
     * @returns {number[]} Description.
     * @private
     */
    private _rsComputeDivisor(degree: number): number[] {
        const cached: number[] = this._divisorCache[<number>degree];
        if (cached) { return cached.slice(); }
        const result: number[] = [];
        for (let i: number = 0; i < degree - 1; i++) {
            result.push(0);
        }
        result.push(1);
        let root: number = 1;
        for (let i: number = 0; i < degree; i++) {
            for (let j: number = 0; j < result.length; j++) {
                result[<number>j] = this._gfMul(result[<number>j], root);
                if (j + 1 < result.length) {
                    result[<number>j] ^= result[j + 1];
                }
            }
            root = this._gfMul(root, 0x02);
        }
        this._divisorCache[<number>degree] = result.slice();
        return result;
    }
    /**
     * Computes the Reed-Solomon remainder (error-correction codewords) of a data block.
     *
     * @param {number[]} data - Description.
     * @param {number[]} divisor - Description.
     * @returns {number[]} Description.
     * @private
     */
    private _rsComputeRemainder(data: number[], divisor: number[]): number[] {
        const result: number[] = [];
        for (let i: number = 0; i < divisor.length; i++) {
            result.push(0);
        }
        for (let i: number = 0; i < data.length; i++) {
            const factor: number = data[<number>i] ^ (result.shift() as number);
            result.push(0);
            for (let j: number = 0; j < divisor.length; j++) {
                result[<number>j] = result[<number>j] ^ this._gfMul(divisor[<number>j], factor);
            }
        }
        return result;
    }
    /**
     * ECC codewords per block indexed [level][version] (ISO/IEC 18004 Annex A, tables 13-22).
     *
     * @private
     */
    private readonly _errorCorrectionCodewordsPerBlock: number[][] = [
        // Index 0 is unused padding; indices 1 through 40 are the QR versions (ISO/IEC 18004).
        [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28,
            28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], // Low
        [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26,
            26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28], // Medium
        [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26,
            30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30], // Quartile
        [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26,
            28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30] // High
    ];
    /**
     * Error-correction block count indexed [level][version] (ISO/IEC 18004 Annex A, tables 13-22).
     *
     * @private
     */
    private readonly _blockCount: number[][] = [
        // Index 0 is unused padding; indices 1 through 40 are the QR versions (ISO/IEC 18004).
        [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17,
            18, 19, 19, 20, 21, 22, 24, 25], // Low
        [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29,
            31, 33, 35, 37, 38, 40, 43, 45, 47, 49], // Medium
        [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38,
            40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68], // Quartile
        [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45,
            48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81] // High
    ];
    /**
     * Returns the number of raw data modules for a version (ISO/IEC 18004 section 8.3.3).
     *
     * @param {number} version - Description.
     * @returns {number} Description.
     * @private
     */
    private _getNumRawDataModules(version: number): number {
        let result: number = (16 * version + 128) * version + 64;
        if (version >= 2) {
            const numAlign: number = Math.floor(version / 7) + 2;
            result -= (25 * numAlign - 10) * numAlign - 55;
            if (version >= 7) {
                result -= 36;
            }
        }
        return result;
    }
    /**
     * Returns the number of data codewords for a version and level (remainder bits discarded).
     *
     * @param {number} version - Description.
     * @param {number} level - Description.
     * @returns {number} Description.
     * @private
     */
    private _getNumDataCodewords(version: number, level: number): number {
        return Math.floor(this._getNumRawDataModules(version) / 8) -
            this._errorCorrectionCodewordsPerBlock[<number>level][<number>version] * this._blockCount[<number>level][<number>version];
    }
    /**
     * Character-count-indicator bit widths per mode and version range (ISO/IEC 18004).
     * Modes: 1=numeric, 2=alphanumeric, 4=byte.
     *
     * @param {number} mode - Description.
     * @param {number} version - Description.
     * @returns {number} Description.
     * @private
     */
    private _charCountBits(mode: number, version: number): number {
        const range: number = version <= 9 ? 0 : (version <= 26 ? 1 : 2);
        if (mode === 1) { return [10, 12, 14][<number>range]; }
        if (mode === 2) { return [9, 11, 13][<number>range]; }
        return [8, 16, 16][<number>range];
    }
    /**
     * Appends the low-order bits of a value into a bit array.
     *
     * @param {number} value - Description.
     * @param {number} bitCount - Description.
     * @param {number[]} bits - Description.
     * @returns {void}
     * @private
     */
    private _appendBits(value: number, bitCount: number, bits: number[]): void {
        for (let i: number = bitCount - 1; i >= 0; i--) {
            bits.push((value >>> i) & 1);
        }
    }
    /**
     * Converts text to bytes using the configured encoding.
     *
     * @param {string} text - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @returns {number[]} Description.
     * @private
     */
    private _encodeText(text: string, encoding: PdfBarcodeTextEncoding): number[] {
        const bytes: number[] = [];
        if (encoding === PdfBarcodeTextEncoding.Iso88591) {
            for (let i: number = 0; i < text.length; i++) {
                const code: number = text.charCodeAt(i);
                if (code > 255) {
                    throw new Error(
                        'textEncoding iso88591 cannot encode characters above U+00FF');
                }
                bytes.push(code);
            }
            return bytes;
        }
        for (let i: number = 0; i < text.length; i++) {
            let code: number = text.charCodeAt(i);
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
            } else if (code >= 0xD800 && code <= 0xDFFF) {
                if (code > 0xDBFF || i + 1 >= text.length) {
                    throw new Error('text contains an unpaired surrogate');
                }
                const low: number = text.charCodeAt(i + 1);
                if (low < 0xDC00 || low > 0xDFFF) {
                    throw new Error('text contains an unpaired surrogate');
                }
                code = 0x10000 + ((code - 0xD800) << 10) + (low - 0xDC00);
                bytes.push(
                    0xF0 | (code >> 18), 0x80 | ((code >> 12) & 0x3F),
                    0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
                i++;
            } else {
                bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            }
        }
        return bytes;
    }
    /**
     * Classifies a character: 1 = numeric, 2 = alphanumeric, 3 = byte only.
     *
     * @param {string} ch - Description.
     * @returns {number} Description.
     * @private
     */
    private _classifyChar(ch: string): number {
        const code: number = ch.charCodeAt(0);
        if (code >= 48 && code <= 57) { return 1; }
        if (Object.prototype.hasOwnProperty.call(this._alphanumericValues, ch)) { return 2; }
        return 3;
    }
    /**
     * Builds a mode-specific segment for a character range.
     *
     * @param {string} text - Description.
     * @param {number} start - Description.
     * @param {number} end - Description.
     * @param {number} mode - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @returns {_QrSegment} Description.
     * @private
     */
    private _buildSegmentForRange(text: string, start: number, end: number,
                                  mode: number, encoding: PdfBarcodeTextEncoding): _QrSegment {
        if (mode === 1) {
            const bits: number[] = [];
            let i: number = start;
            while (i + 3 <= end) {
                this._appendBits(
                    (text.charCodeAt(i) - 48) * 100 +
                    (text.charCodeAt(i + 1) - 48) * 10 +
                    (text.charCodeAt(i + 2) - 48), 10, bits);
                i += 3;
            }
            if (i + 2 === end) {
                this._appendBits((text.charCodeAt(i) - 48) * 10 + (text.charCodeAt(i + 1) - 48), 7, bits);
                i += 2;
            } else if (i + 1 === end) {
                this._appendBits(text.charCodeAt(i) - 48, 4, bits);
                i += 1;
            }
            if (i !== end) {
                throw new Error('qr numeric segment length mismatch');
            }
            return { mode: 1, count: end - start, bits: bits };
        }
        if (mode === 2) {
            const bits: number[] = [];
            let i: number = start;
            while (i + 2 <= end) {
                this._appendBits(this._alphanumericValues[text.charAt(i)] * 45 + this._alphanumericValues[text.charAt(i + 1)], 11, bits);
                i += 2;
            }
            if (i + 1 === end) {
                this._appendBits(this._alphanumericValues[text.charAt(i)], 6, bits);
                i += 1;
            }
            if (i !== end) {
                throw new Error('qr alphanumeric segment length mismatch');
            }
            return { mode: 2, count: end - start, bits: bits };
        }
        const bytes: number[] = this._encodeText(text.substring(start, end), encoding);
        const bits: number[] = [];
        for (let i: number = 0; i < bytes.length; i++) {
            this._appendBits(bytes[<number>i], 8, bits);
        }
        return { mode: 4, count: bytes.length, bits: bits };
    }
    /**
     * Validates that every character of the text is encodable in a forced mode.
     *
     * @param {string} text - Description.
     * @param {PdfQRInputMode} mode - Description.
     * @returns {void}
     * @private
     */
    private _validateForcedMode(text: string, mode: PdfQRInputMode): void {
        if (mode === PdfQRInputMode.Numeric) {
            for (let i: number = 0; i < text.length; i++) {
                const code: number = text.charCodeAt(i);
                if (code < 48 || code > 57) {
                    throw new Error(
                        'inputMode numeric only accepts digits 0-9');
                }
            }
        } else if (mode === PdfQRInputMode.AlphaNumeric) {
            for (let i: number = 0; i < text.length; i++) {
                if (this._alphanumericValues[text.charAt(i)] === undefined) {
                    throw new Error(
                        'inputMode alphaNumeric only accepts 0-9, A-Z, space and $%*+-./:');
                }
            }
        }
    }
    /**
     * Returns the segment list for the input mode and version.
     *
     * @param {string} text - Description.
     * @param {PdfQRInputMode} mode - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @param {number} version - Description.
     * @returns {_QrSegment[]} Description.
     * @private
     */
    private _buildSegments(text: string, mode: PdfQRInputMode, encoding: PdfBarcodeTextEncoding, version: number): _QrSegment[] {
        if (mode === PdfQRInputMode.Numeric || mode === PdfQRInputMode.AlphaNumeric) {
            this._validateForcedMode(text, mode);
            const numericMode: number = mode === PdfQRInputMode.Numeric ? 1 : 2;
            return [this._buildSegmentForRange(text, 0, text.length, numericMode, encoding)];
        }
        if (mode === PdfQRInputMode.Byte) {
            return [this._buildSegmentForRange(text, 0, text.length, 4, encoding)];
        }
        return this._buildMixedSegments(text, encoding, version);
    }
    /**
     * Builds mixed-mode segments via dynamic programming, minimizing total bit length.
     *
     * @param {string} text - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @param {number} version - Description.
     * @returns {_QrSegment[]} Description.
     * @private
     */
    private _buildMixedSegments(text: string, encoding: PdfBarcodeTextEncoding, version: number): _QrSegment[] {
        const n: number = text.length;
        if (n === 0) { return []; }
        const classes: number[] = [];
        for (let i: number = 0; i < n; i++) {
            classes.push(this._classifyChar(text.charAt(i)));
        }
        const INF: number = 1 << 30;
        const dp: number[] = [];
        const prevIndex: number[] = [];
        const prevMode: number[] = [];
        for (let i: number = 0; i <= n; i++) {
            dp.push(i === 0 ? 0 : INF);
            prevIndex.push(-1);
            prevMode.push(-1);
        }
        for (let i: number = 0; i < n; i++) {
            if (dp[<number>i] >= INF) { continue; }
            if (classes[<number>i] === 1) {
                let groupBits: number = 0;
                let processed: number = 0;
                let j: number = i;
                while (j < n && classes[<number>j] === 1) {
                    processed++;
                    if (processed % 3 === 0) { groupBits += 10; }
                    j++;
                    const cost: number = dp[<number>i] + 4 + this._charCountBits(1, version) + groupBits +
                        (processed % 3 === 1 ? 4 : processed % 3 === 2 ? 7 : 0);
                    if (cost < dp[<number>j]) {
                        dp[<number>j] = cost;
                        prevIndex[<number>j] = i;
                        prevMode[<number>j] = 1;
                    }
                }
            }
            // Alphanumeric stretch: 0-9, A-Z, space and $%*+-./: (digits included).
            if (classes[<number>i] === 1 || classes[<number>i] === 2) {
                let pairBits: number = 0;
                let processed: number = 0;
                let j: number = i;
                while (j < n && (classes[<number>j] === 1 || classes[<number>j] === 2)) {
                    processed++;
                    if (processed % 2 === 0) { pairBits += 11; }
                    j++;
                    const cost: number = dp[<number>i] + 4 + this._charCountBits(2, version) + pairBits +
                        (processed % 2 === 1 ? 6 : 0);
                    if (cost < dp[<number>j]) {
                        dp[<number>j] = cost;
                        prevIndex[<number>j] = i;
                        prevMode[<number>j] = 2;
                    }
                }
            }
            let byteBits: number = 0;
            let j: number = i;
            while (j < n) {
                const ch: string = text.charAt(j);
                const code: number = ch.charCodeAt(0);
                if (encoding === PdfBarcodeTextEncoding.Iso88591 && code > 255) { break; }
                byteBits += code < 0x80 ? 8 : code < 0x800 ? 16 :
                    (code >= 0xD800 && code <= 0xDFFF) ? 32 : 24;
                j++;
                const cost: number = dp[<number>i] + 4 + this._charCountBits(4, version) + byteBits;
                if (cost < dp[<number>j]) {
                    dp[<number>j] = cost;
                    prevIndex[<number>j] = i;
                    prevMode[<number>j] = 4;
                }
            }
        }
        if (dp[<number>n] >= INF) {
            throw new Error('qr mixed segmentation failed');
        }
        // Reconstruct run boundaries and merge adjacent runs of the same mode.
        const runs: { start: number; end: number; mode: number }[] = [];
        let pos: number = n;
        while (pos > 0) {
            const start: number = prevIndex[<number>pos];
            runs.unshift({ start: start, end: pos, mode: prevMode[<number>pos] });
            pos = start;
        }
        // Reconstruct boundaries and merge adjacent segments of the same mode.
        const merged: { start: number; end: number; mode: number }[] = [];
        for (let i: number = runs.length - 1; i >= 0; i--) {
            const run: { start: number; end: number; mode: number } = runs[<number>i];
            const last: { start: number; end: number; mode: number } = merged.length > 0 ? merged[0] : undefined;
            if (last && last.mode === run.mode) {
                last.start = run.start;
            } else {
                merged.unshift({ start: run.start, end: run.end, mode: run.mode });
            }
        }
        const segments: _QrSegment[] = [];
        for (let i: number = 0; i < merged.length; i++) {
            const run: { start: number; end: number; mode: number } = merged[<number>i];
            segments.push(this._buildSegmentForRange(text, run.start, run.end, run.mode, encoding));
        }
        return segments;
    }
    /**
     * Serializes segments into the final data codeword array for a version and level.
     *
     * @param {string} text - Description.
     * @param {PdfQRInputMode} mode - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @param {number} version - Description.
     * @param {number} level - Description.
     * @returns {number[]} Description.
     * @private
     */
    private _buildDataCodewords(text: string, mode: PdfQRInputMode, encoding: PdfBarcodeTextEncoding,
                                version: number, level: number): number[] {
        const segments: _QrSegment[] = this._buildSegments(text, mode, encoding, version);
        const bits: number[] = [];
        for (let s: number = 0; s < segments.length; s++) {
            const segment: _QrSegment = segments[<number>s];
            this._appendBits(segment.mode, 4, bits);
            this._appendBits(segment.count, this._charCountBits(segment.mode, version), bits);
            for (let i: number = 0; i < segment.bits.length; i++) {
                bits.push(segment.bits[<number>i]);
            }
        }
        const capacityBits: number = this._getNumDataCodewords(version, level) * 8;
        const dataBits: number = bits.length;
        if (dataBits > capacityBits) {
            throw new Error(
                `payload does not fit in version ${version} at the selected error correction level`);
        }
        this._appendBits(0, Math.min(4, capacityBits - dataBits), bits);
        while (bits.length % 8 !== 0) {
            bits.push(0);
        }
        const data: number[] = [];
        for (let i: number = 0; i < bits.length; i += 8) {
            let byte: number = 0;
            for (let j: number = 0; j < 8; j++) {
                byte = (byte << 1) | bits[i + j];
            }
            data.push(byte);
        }
        let pad: number = 0xEC;
        while (data.length < capacityBits / 8) {
            data.push(pad);
            pad = pad === 0xEC ? 0x11 : 0xEC;
        }
        return data;
    }
    /**
     * Adds error correction and interleaves data codewords (ISO/IEC 18004 section 8.6).
     *
     * @param {number[]} data - Description.
     * @param {number} version - Description.
     * @param {number} level - Description.
     * @returns {number[]} Description.
     * @private
     */
    private _addEccAndInterleave(data: number[], version: number, level: number): number[] {
        const numBlocks: number = this._blockCount[<number>level][<number>version];
        const blockEccLen: number = this._errorCorrectionCodewordsPerBlock[<number>level][<number>version];
        const rawCodewords: number = Math.floor(this._getNumRawDataModules(version) / 8);
        const numShortBlocks: number = numBlocks - rawCodewords % numBlocks;
        const shortBlockLen: number = Math.floor(rawCodewords / numBlocks);
        const blocks: number[][] = [];
        const divisor: number[] = this._rsComputeDivisor(blockEccLen);
        let k: number = 0;
        for (let i: number = 0; i < numBlocks; i++) {
            const dat: number[] = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
            k += dat.length;
            const ecc: number[] = this._rsComputeRemainder(dat, divisor);
            if (i < numShortBlocks) {
                dat.push(0);
            }
            const block: number[] = dat.slice();
            for (let j: number = 0; j < ecc.length; j++) {
                block.push(ecc[<number>j]);
            }
            blocks.push(block);
        }
        const result: number[] = [];
        for (let i: number = 0; i < blocks[0].length; i++) {
            for (let j: number = 0; j < blocks.length; j++) {
                if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
                    result.push(blocks[<number>j][<number>i]);
                }
            }
        }
        if (result.length !== rawCodewords) {
            throw new Error('qr interleaving length mismatch');
        }
        return result;
    }
    /**
     * Returns a bit of a value.
     *
     * @param {number} x - Description.
     * @param {number} i - Description.
     * @returns {number} Description.
     * @private
     */
    private _getBit(x: number, i: number): number {
        return (x >>> i) & 1;
    }
    /**
     * Returns true when a mask formula inverts the module at (x, y) (ISO/IEC 18004 table 24).
     *
     * @param {number} mask - Description.
     * @param {number} x - Description.
     * @param {number} y - Description.
     * @returns {boolean} Description.
     * @private
     */
    private _maskInvert(mask: number, x: number, y: number): boolean {
        switch (mask) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
        case 5: return x * y % 2 + x * y % 3 === 0;
        case 6: return (x * y % 2 + x * y % 3) % 2 === 0;
        default: return ((x + y) % 2 + x * y % 3) % 2 === 0;
        }
    }
    /**
     * Computes the format information bits for a level and mask (ISO/IEC 18004 section 8.9).
     *
     * @param {number} level - Description.
     * @param {number} mask - Description.
     * @returns {number} Description.
     * @private
     */
    private _formatBits(level: number, mask: number): number {
        const data: number = [1, 0, 3, 2][<number>level] << 3 | mask;
        let rem: number = data;
        for (let i: number = 0; i < 10; i++) {
            rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
        }
        return (data << 10 | rem) ^ 0x5412;
    }
    /**
     * Reserves both format-information regions as function modules so that data
     * placement and masking skip them (ISO/IEC 18004 section 8.9).
     *
     * @param {boolean[]} isFunction - Description.
     * @param {number} size - Description.
     * @returns {void}
     * @private
     */
    private _reserveFormatRegions(isFunction: boolean[][], size: number): void {
        for (let i: number = 0; i <= 8; i++) {
            isFunction[<number>i][<number>8] = true;
            isFunction[<number>8][<number>i] = true;
        }
        for (let i: number = 0; i < 8; i++) {
            isFunction[<number>8][<number>size - 1 - i] = true;
            isFunction[<number>size - 1 - i][<number>8] = true;
        }
        isFunction[<number>size - 8][<number>8] = true;
    }
    /**
     * Writes the format information bits into both format regions of a matrix copy.
     *
     * @param {boolean[]} modules - Description.
     * @param {number} size - Description.
     * @param {number} level - Description.
     * @param {number} mask - Description.
     * @returns {void}
     * @private
     */
    private _drawFormatBitsInto(modules: boolean[][], size: number, level: number, mask: number): void {
        const bits: number = this._formatBits(level, mask);
        for (let i: number = 0; i <= 5; i++) {
            modules[<number>i][<number>8] = this._getBit(bits, i) === 1;
        }
        modules[<number>7][<number>8] = this._getBit(bits, 6) === 1;
        modules[<number>8][<number>8] = this._getBit(bits, 7) === 1;
        modules[<number>8][<number>7] = this._getBit(bits, 8) === 1;
        for (let i: number = 9; i < 15; i++) {
            modules[<number>8][<number>14 - i] = this._getBit(bits, i) === 1;
        }
        for (let i: number = 0; i < 8; i++) {
            modules[<number>8][<number>size - 1 - i] = this._getBit(bits, i) === 1;
        }
        for (let i: number = 8; i < 15; i++) {
            modules[<number>size - 15 + i][<number>8] = this._getBit(bits, i) === 1;
        }
        modules[<number>size - 8][<number>8] = true; // always dark module
    }
    /**
     * Mask penalty constants (ISO/IEC 18004 section 8.8.2).
     *
     * @private
     */
    private readonly _penaltyNumberOne: number = 3;

    private readonly _penaltyNumberTwo: number = 3;

    private readonly _penaltyNumberThree: number = 40;

    private readonly _penaltyNumberFour: number = 10;
    /**
     * Finder-penalty helper: counts 1:1:3:1:1 patterns in the run history.
     *
     * @param {number[]} runHistory - Description.
     * @returns {number} Description.
     * @private
     */
    private _finderCountPatterns(runHistory: number[]): number {
        const n: number = runHistory[1];
        const core: boolean = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 &&
            runHistory[4] === n && runHistory[5] === n;
        return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) +
            (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
    }
    /**
     * Finder-penalty helper: adds a run length to the history.
     *
     * @param {number} currentRunLength - Description.
     * @param {number[]} runHistory - Description.
     * @param {number} size - Description.
     * @returns {void}
     * @private
     */
    private _finderAddHistory(currentRunLength: number, runHistory: number[], size: number): void {
        if (runHistory[0] === 0) {
            currentRunLength += size;
        }
        runHistory.pop();
        runHistory.unshift(currentRunLength);
    }
    /**
     * Finder-penalty helper: terminates a run and counts the remaining patterns.
     *
     * @param {boolean} currentRunColor - Description.
     * @param {number} currentRunLength - Description.
     * @param {number[]} runHistory - Description.
     * @param {number} size - Description.
     * @returns {number} Description.
     * @private
     */
    private _finderTerminateAndCount(currentRunColor: boolean, currentRunLength: number,
                                     runHistory: number[], size: number): number {
        if (currentRunColor) {
            this._finderAddHistory(currentRunLength, runHistory, size);
            currentRunLength = 0;
        }
        currentRunLength += size;
        this._finderAddHistory(currentRunLength, runHistory, size);
        return this._finderCountPatterns(runHistory);
    }
    /**
     * Computes the total mask penalty score of a module matrix (ISO/IEC 18004 section 8.8.2).
     *
     * @param {boolean[]} modules - Description.
     * @param {number} size - Description.
     * @returns {number} Description.
     * @private
     */
    private _penaltyScore(modules: boolean[][], size: number): number {
        let result: number = 0;
        for (let y: number = 0; y < size; y++) {
            let runColor: boolean = false;
            let runX: number = 0;
            const runHistory: number[] = [0, 0, 0, 0, 0, 0, 0];
            for (let x: number = 0; x < size; x++) {
                if (modules[<number>y][<number>x] === runColor) {
                    runX++;
                    if (runX === 5) { result += this._penaltyNumberOne; } else if (runX > 5) { result += 1; }
                } else {
                    this._finderAddHistory(runX, runHistory, size);
                    if (!runColor) {
                        result += this._finderCountPatterns(runHistory) * this._penaltyNumberThree;
                    }
                    runColor = modules[<number>y][<number>x];
                    runX = 1;
                }
            }
            result += this._finderTerminateAndCount(runColor, runX, runHistory, size) * this._penaltyNumberThree;
        }
        for (let x: number = 0; x < size; x++) {
            let runColor: boolean = false;
            let runY: number = 0;
            const runHistory: number[] = [0, 0, 0, 0, 0, 0, 0];
            for (let y: number = 0; y < size; y++) {
                if (modules[<number>y][<number>x] === runColor) {
                    runY++;
                    if (runY === 5) { result += this._penaltyNumberOne; } else if (runY > 5) { result += 1; }
                } else {
                    this._finderAddHistory(runY, runHistory, size);
                    if (!runColor) {
                        result += this._finderCountPatterns(runHistory) * this._penaltyNumberThree;
                    }
                    runColor = modules[<number>y][<number>x];
                    runY = 1;
                }
            }
            result += this._finderTerminateAndCount(runColor, runY, runHistory, size) * this._penaltyNumberThree;
        }
        for (let y: number = 0; y < size - 1; y++) {
            for (let x: number = 0; x < size - 1; x++) {
                const color: boolean = modules[<number>y][<number>x];
                if (color === modules[<number>y][<number>x + 1] &&
                    color === modules[<number>y + 1][<number>x] &&
                    color === modules[<number>y + 1][<number>x + 1]) {
                    result += this._penaltyNumberTwo;
                }
            }
        }
        let dark: number = 0;
        for (let y: number = 0; y < size; y++) {
            for (let x: number = 0; x < size; x++) {
                if (modules[<number>y][<number>x]) { dark++; }
            }
        }
        const total: number = size * size;
        const k: number = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
        result += k * this._penaltyNumberFour;
        return result;
    }
    /**
     * Builds the base module matrix with all function patterns for a version.
     *
     * @param {number} version - Description.
     * @returns {void}
     * @private
     */
    private _buildBaseMatrix(version: number): { modules: boolean[][]; isFunction: boolean[][] } {
        const size: number = 17 + 4 * version;
        const modules: boolean[][] = [];
        const isFunction: boolean[][] = [];
        for (let i: number = 0; i < size; i++) {
            modules.push(new Array<boolean>(size).fill(false));
            isFunction.push(new Array<boolean>(size).fill(false));
        }
        const setFunction: (x: number, y: number, isDark: boolean) => void = (x: number, y: number, isDark: boolean): void => {
            modules[<number>y][<number>x] = isDark;
            isFunction[<number>y][<number>x] = true;
            return;
        };
        // Timing patterns.
        for (let i: number = 0; i < size; i++) {
            setFunction(6, i, i % 2 === 0);
            setFunction(i, 6, i % 2 === 0);
        }
        // Finder patterns with separators.
        const drawFinder: (cx: number, cy: number) => void = (cx: number, cy: number): void => {
            for (let dy: number = -4; dy <= 4; dy++) {
                for (let dx: number = -4; dx <= 4; dx++) {
                    const dist: number = Math.max(Math.abs(dx), Math.abs(dy));
                    const xx: number = cx + dx;
                    const yy: number = cy + dy;
                    if (0 <= xx && xx < size && 0 <= yy && yy < size) {
                        setFunction(xx, yy, dist !== 2 && dist !== 4);
                    }
                }
            }
            return;
        };
        drawFinder(3, 3);
        drawFinder(size - 4, 3);
        drawFinder(3, size - 4);
        // Alignment patterns.
        if (version >= 2) {
            const numAlign: number = Math.floor(version / 7) + 2;
            const step: number = Math.floor((version * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
            const positions: number[] = [6];
            for (let pos: number = size - 7; positions.length < numAlign; pos -= step) {
                positions.splice(1, 0, pos);
            }
            const numPos: number = positions.length;
            for (let i: number = 0; i < numPos; i++) {
                for (let j: number = 0; j < numPos; j++) {
                    const skipCorner: boolean = (i === 0 && j === 0) ||
                        (i === 0 && j === numPos - 1) ||
                        (i === numPos - 1 && j === 0);
                    if (!skipCorner) {
                        const cx: number = positions[<number>i];
                        const cy: number = positions[<number>j];
                        for (let dy: number = -2; dy <= 2; dy++) {
                            for (let dx: number = -2; dx <= 2; dx++) {
                                setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
                            }
                        }
                    }
                }
            }
        }
        // Reserve both format-information regions (dummy format bits are drawn so
        // the cells hold a defined value; the final masked copy rewrites them).
        this._reserveFormatRegions(isFunction, size);
        this._drawFormatBitsInto(modules, size, 0, 0);
        // Version information for versions 7 through 40.
        if (version >= 7) {
            let rem: number = version;
            for (let i: number = 0; i < 12; i++) {
                rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
            }
            const bits: number = version << 12 | rem;
            for (let i: number = 0; i < 18; i++) {
                const color: boolean = this._getBit(bits, i) === 1;
                const a: number = size - 11 + i % 3;
                const b: number = Math.floor(i / 3);
                setFunction(a, b, color);
                setFunction(b, a, color);
            }
        }
        return { modules: modules, isFunction: isFunction };
    }
    /**
     * Places the message codewords into the matrix in zigzag order (ISO/IEC 18004 section 8.7.3).
     *
     * @param {boolean[]} modules - Description.
     * @param {boolean[]} isFunction - Description.
     * @param {number[]} codewords - Description.
     * @param {number} size - Description.
     * @returns {void}
     * @private
     */
    private _placeCodewords(modules: boolean[][], isFunction: boolean[][], codewords: number[], size: number): void {
        let i: number = 0;
        for (let right: number = size - 1; right >= 1; right -= 2) {
            if (right === 6) { right = 5; }
            for (let vert: number = 0; vert < size; vert++) {
                for (let j: number = 0; j < 2; j++) {
                    const x: number = right - j;
                    const upward: boolean = ((right + 1) & 2) === 0;
                    const y: number = upward ? size - 1 - vert : vert;
                    if (!isFunction[<number>y][<number>x] && i < codewords.length * 8) {
                        modules[<number>y][<number>x] = this._getBit(codewords[<number>Math.floor(i / 8)], 7 - (i % 8)) === 1;
                        i++;
                    }
                }
            }
        }
        if (i !== codewords.length * 8) {
            throw new Error(
                'qr codeword placement mismatch with available data modules');
        }
    }
    /**
     * Returns a masked copy of the module matrix.
     *
     * @param {boolean[]} modules - Description.
     * @param {boolean[]} isFunction - Description.
     * @param {number} mask - Description.
     * @param {number} size - Description.
     * @returns {boolean[]} Description.
     * @private
     */
    private _applyMask(modules: boolean[][], isFunction: boolean[][], mask: number, size: number): boolean[][] {
        const copy: boolean[][] = [];
        for (let y: number = 0; y < size; y++) {
            const row: boolean[] = modules[<number>y].slice();
            for (let x: number = 0; x < size; x++) {
                if (!isFunction[<number>y][<number>x] && this._maskInvert(mask, x, y)) {
                    row[<number>x] = !row[<number>x];
                }
            }
            copy.push(row);
        }
        return copy;
    }
    /**
     * Encodes the payload and returns the final QR matrix with the selected mask.
     *
     * @param {string} text - The non-empty payload to encode.
     * @param {PdfQRInputMode} mode - The requested input encoding mode.
     * @param {PdfQRErrorCorrectionLevel} level - The requested error correction level.
     * @param {PdfQRVersion} version - The requested version or automatic selection.
     * @param {PdfBarcodeTextEncoding} encoding - The byte conversion for byte segments.
     * @returns {_QrEncodeResult} The encoded version, size, mask and matrix.
     * @private
     */
    public _encodeQr(text: string, mode: PdfQRInputMode, level: PdfQRErrorCorrectionLevel,
                     version: PdfQRVersion, encoding: PdfBarcodeTextEncoding): _QrEncodeResult {
        if (text === null || text === undefined || typeof text !== 'string' || text.length === 0) {
            throw new Error('text must be a non-empty string');
        }
        if (level === null || level === undefined || typeof level !== 'number' ||
            Math.floor(level) !== level || level < 0 || level > 3) {
            throw new Error('errorCorrectionLevel is invalid');
        }
        if (mode === null || mode === undefined || typeof mode !== 'number' ||
            Math.floor(mode) !== mode || mode < 0 || mode > 3) {
            throw new Error('inputMode is invalid');
        }
        if (encoding !== PdfBarcodeTextEncoding.Utf8 && encoding !== PdfBarcodeTextEncoding.Iso88591) {
            throw new Error('textEncoding is invalid');
        }
        if (version !== PdfQRVersion.Auto && (typeof version !== 'number' ||
            Math.floor(version) !== version || version < 1 || version > 40)) {
            throw new Error('version must be auto or a value from 1 through 40');
        }
        const levelIndex: number = level as number;
        let resolvedVersion: number;
        if (version === PdfQRVersion.Auto) {
            // Select the smallest fitting version, rerunning mixed segmentation per
            // character-count width range (versions 1-9, 10-26, 27-40).
            resolvedVersion = -1;
            const rangeEnds: number[] = [9, 26, 40];
            let rangeStart: number = 1;
            for (let r: number = 0; r < rangeEnds.length && resolvedVersion === -1; r++) {
                for (let v: number = rangeStart; v <= rangeEnds[<number>r]; v++) {
                    try {
                        this._buildDataCodewords(text, mode, encoding, v, levelIndex);
                        resolvedVersion = v;
                        break;
                    } catch (error) {
                        // Only a capacity overflow moves on to the next version; any other failure is final.
                        const message: string = (error as Error).message;
                        if (message.indexOf('payload does not fit in version') !== 0) { throw error; }
                    }
                }
                rangeStart = rangeEnds[<number>r] + 1;
            }
            if (resolvedVersion === -1) {
                throw new Error('payload exceeds the version 40 capacity');
            }
        } else {
            resolvedVersion = version as number;
        }
        const data: number[] = this._buildDataCodewords(text, mode, encoding, resolvedVersion, levelIndex);
        const codewords: number[] = this._addEccAndInterleave(data, resolvedVersion, levelIndex);
        const size: number = 17 + 4 * resolvedVersion;
        const base: { modules: boolean[][]; isFunction: boolean[][] } = this._buildBaseMatrix(resolvedVersion);
        this._placeCodewords(base.modules, base.isFunction, codewords, size);
        // Evaluate all eight masks and pick the lowest penalty; ties keep the lower index.
        let bestMask: number = -1;
        let bestPenalty: number = 1 << 30;
        let bestModules: boolean[][] | null = null;
        for (let mask: number = 0; mask < 8; mask++) {
            const candidate: boolean[][] = this._applyMask(base.modules, base.isFunction, mask, size);
            this._drawFormatBitsInto(candidate, size, levelIndex, mask);
            const penalty: number = this._penaltyScore(candidate, size);
            if (penalty < bestPenalty) {
                bestPenalty = penalty;
                bestMask = mask;
                bestModules = candidate;
            }
        }
        if (bestModules === null || bestMask === -1) {
            throw new Error('qr mask selection failed');
        }
        return {
            version: resolvedVersion,
            size: size,
            maskPattern: bestMask,
            matrix: bestModules
        };
    }
    /**
     * Returns the data codeword count for a version and level. Exported for capacity tests.
     *
     * @param {number} version - Description.
     * @param {number} level - Description.
     * @returns {number} Description.
     * @private
     */
    public _qrNumDataCodewords(version: number, level: number): number {
        return this._getNumDataCodewords(version, level);
    }
    /**
     * Returns the raw data module count for a version. Exported for tests.
     *
     * @param {number} version - Description.
     * @returns {number} Description.
     * @private
     */
    public _qrNumRawDataModules(version: number): number {
        return this._getNumRawDataModules(version);
    }
    /**
     * Encodes text into bytes using the configured encoding. Exported for tests.
     *
     * @param {string} text - Description.
     * @param {PdfBarcodeTextEncoding} encoding - Description.
     * @returns {number[]} Description.
     * @private
     */
    public _qrEncodeText(text: string, encoding: PdfBarcodeTextEncoding): number[] {
        return this._encodeText(text, encoding);
    }
}
