import { PdfBrush, PdfGraphics } from '../graphics/pdf-graphics';
import { PdfPage } from '../pdf-page';
import { PdfColor, Rectangle, PdfBarcodeQuietZone, PdfDataMatrixBarcodeOptions, _DataMatrixEncodeResult, _DmLayout, _DmSymbolInfo } from '../pdf-document-helper';
import {
    PdfDataMatrixEncoding, PdfDataMatrixSize, PdfBarcodeTextEncoding
} from '../enumerator';
import { PdfBidimensionalBarcode } from './pdf-bidimensional-barcode';
/**
 * Represents a Data Matrix ECC 200 barcode that can be drawn onto a PDF page or graphics.
 *
 * ```typescript
 * // Create a new PDF document
 * let document: PdfDocument = new PdfDocument();
 * // Add a page to the document
 * let page: PdfPage = document.addPage();
 * // Create and configure the barcode
 * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
 * barcode.xDimension = 5;
 * // Draw the barcode on the page
 * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document and release its resources
 * document.destroy();
 * ```
 */
export class PdfDataMatrixBarcode extends PdfBidimensionalBarcode {
    /**
     * Requested Data Matrix encodation.
     *
     * @private
     */
    private _encoding: PdfDataMatrixEncoding = PdfDataMatrixEncoding.Auto;
    /**
     * Requested symbol size.
     *
     * @private
     */
    private _symbolSize: PdfDataMatrixSize = PdfDataMatrixSize.Auto;
    /**
     * Requested string-to-byte conversion.
     *
     * @private
     */
    private _textEncoding: PdfBarcodeTextEncoding = PdfBarcodeTextEncoding.Utf8;
    /**
     * Rows of the most recently encoded symbol.
     *
     * @private
     */
    private _actualRows: number;
    /**
     * Columns of the most recently encoded symbol.
     *
     * @private
     */
    private _actualColumns: number;
    /**
     * Creates a Data Matrix ECC 200 barcode.
     *
     * @param {string} text The payload text.
     * @param {PdfDataMatrixBarcodeOptions} options The barcode options.
     */
    public constructor(text: string, options?: PdfDataMatrixBarcodeOptions) {
        super(text);
        this.quietZone = { all: 1 };
        if (options) {
            if (options.encoding !== null && typeof options.encoding !== 'undefined') {
                this.encoding = options.encoding;
            }
            if (options.symbolSize !== null && typeof options.symbolSize !== 'undefined') {
                this.symbolSize = options.symbolSize;
            }
            if (options.textEncoding !== null && typeof options.textEncoding !== 'undefined') {
                this.textEncoding = options.textEncoding;
            }
            if (options.xDimension !== null && typeof options.xDimension !== 'undefined') {
                this.xDimension = options.xDimension;
            }
            if (options.quietZone !== null && typeof options.quietZone !== 'undefined') {
                this.quietZone = options.quietZone;
            }
            if (options.foreColor !== null && typeof options.foreColor !== 'undefined') {
                this.foreColor = options.foreColor;
            }
            if (options.backColor !== null && typeof options.backColor !== 'undefined') {
                this.backColor = options.backColor;
            }
        }
    }
    /**
     * Gets the requested Data Matrix encodation.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Read the configured encodation
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * console.log(barcode.encoding); // PdfDataMatrixEncoding.Auto
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfDataMatrixEncoding} The currently configured encodation.
     */
    public get encoding(): PdfDataMatrixEncoding {
        return this._encoding;
    }
    /**
     * Sets the requested Data Matrix encodation.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Configure numeric-only encodation for a digit payload
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('001234567890');
     * barcode.encoding = PdfDataMatrixEncoding.AsciiNumeric;
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfDataMatrixEncoding} value The encodation to apply.
     */
    public set encoding(value: PdfDataMatrixEncoding) {
        this._validateEnum('encoding', value, 0, 3);
        this._encoding = value;
    }
    /**
     * Gets the requested symbol size.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Read the configured symbol size
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * console.log(barcode.symbolSize); // PdfDataMatrixSize.Auto
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfDataMatrixSize} The currently configured symbol size.
     */
    public get symbolSize(): PdfDataMatrixSize {
        return this._symbolSize;
    }
    /**
     * Sets the requested symbol size.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw the payload in a fixed 20 x 20 symbol
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('ITEM-2026-0001');
     * barcode.symbolSize = PdfDataMatrixSize.Size20x20;
     * barcode.draw(page, { x: 50, y: 50, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfDataMatrixSize} value The symbol size to apply.
     */
    public set symbolSize(value: PdfDataMatrixSize) {
        this._validateEnum('symbolSize', value, 0, 30);
        this._symbolSize = value;
    }
    /**
     * Gets the requested string-to-byte conversion.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Read the configured text conversion
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * console.log(barcode.textEncoding); // PdfBarcodeTextEncoding.Utf8
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {PdfBarcodeTextEncoding} The currently configured conversion.
     */
    public get textEncoding(): PdfBarcodeTextEncoding {
        return this._textEncoding;
    }
    /**
     * Sets the requested string-to-byte conversion.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Use ISO-8859-1 conversion for the payload
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * barcode.textEncoding = PdfBarcodeTextEncoding.Iso88591;
     * barcode.draw(page, { x: 40, y: 40, width: 32, height: 32 });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @param {PdfBarcodeTextEncoding} value The conversion to apply.
     */
    public set textEncoding(value: PdfBarcodeTextEncoding) {
        this._validateEnum('textEncoding', value, 0, 1);
        this._textEncoding = value;
    }
    /**
     * Gets the row count of the most recently encoded symbol.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw and read the encoded symbol dimensions
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * console.log(barcode.actualRows); // for example 12
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The encoded row count, or undefined before the first successful draw.
     */
    public get actualRows(): number {
        return this._actualRows;
    }
    /**
     * Gets the column count of the most recently encoded symbol.
     *
     * ```typescript
     * // Create a new PDF document
     * let document: PdfDocument = new PdfDocument();
     * // Add a page to the document
     * let page: PdfPage = document.addPage();
     * // Draw and read the encoded symbol dimensions
     * let barcode: PdfDataMatrixBarcode = new PdfDataMatrixBarcode('Test');
     * barcode.draw(page, {x: 10, y: 10, width: 100, height: 100});
     * console.log(barcode.actualColumns); // for example 12
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     *
     * @returns {number} The encoded column count, or undefined before the first successful draw.
     */
    public get actualColumns(): number {
        return this._actualColumns;
    }
    /**
     * Validates that a value is a whole number within an enum range.
     *
     * @param {string} name The property name used in the error message.
     * @param {number} value The value to validate.
     * @param {number} min The smallest valid value.
     * @param {number} max The largest valid value.
     * @returns {void} - Throws when the value is outside the range.
     * @private
     */
    private _validateEnum(name: string, value: number, min: number, max: number): void {
        if (typeof value !== 'number' || Math.floor(value) !== value || value < min || value > max) {
            throw new Error(
                `${name} is not a valid enum value`);
        }
    }
    /**
     * Validates all public drawing inputs before any PDF content is emitted.
     *
     * @returns {void} - Throws the first validation failure.
     * @private
     */
    private _validate(): void {
        this._validatePayload();
        this._validateQuietZone();
        this._validateColors();
    }
    /**
     * Validates the configured foreground and background colors.
     *
     * @returns {void} - Throws when a color is malformed.
     * @private
     */
    private _validateColors(): void {
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
     * Validates that exactly one non-empty payload is configured.
     *
     * @returns {void} - Throws when the payload combination is invalid.
     * @private
     */
    private _validatePayload(): void {
        const hasText: boolean = this.text !== undefined && this.text !== null &&
            typeof this.text === 'string' && this.text.length > 0;
        if (!hasText) {
            throw new Error(
                'text must be a non-empty string payload');
        }
    }
    /**
     * Validates the configured quiet-zone sides.
     *
     * @returns {void} - Throws when a quiet-zone value is invalid.
     * @private
     */
    private _validateQuietZone(): void {
        if (typeof this.xDimension !== 'number' || !isFinite(this.xDimension) || this.xDimension <= 0) {
            throw new Error(
                'xDimension must be a finite positive number');
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
    }
    /**
     * Encodes the configured payload and returns the symbol matrix.
     *
     * @returns {_DataMatrixEncodeResult} The encoded symbol result.
     * @private
     */
    private _encode(): _DataMatrixEncodeResult {
        return this._encodeDataMatrixText(this.text, this._encoding, this._symbolSize, this._textEncoding);
    }
    /**
     * Draws the barcode within the supplied bounds and returns the occupied bounds.
     * Throws an error if the bounds are too small for the required quiet zone.
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
        if (outerBounds.width < 0 || outerBounds.height < 0 || !isFinite(outerBounds.width) ||
            !isFinite(outerBounds.height)) {
            throw new Error('draw bounds must be finite non-negative');
        }
        // Validate every public input before any PDF content is emitted.
        this._validate();
        const result: _DataMatrixEncodeResult = this._encode();
        const layout: _DmLayout = this._resolveLayout(result.rows, result.columns, outerBounds);
        const occupied: Rectangle = this._render(graphics, outerBounds, result.matrix as boolean[][], result.rows, result.columns, layout);
        this._actualRows = result.rows;
        this._actualColumns = result.columns;
        return occupied;
    }
    /**
     * Resolves the output layout for a rectangular symbol. Explicit bounds
     * control the fitted size; otherwise the natural `xDimension` size is used.
     * The same module size is applied horizontally and vertically so the
     * symbol aspect ratio is preserved and the content is centered inside the
     * supplied bounds.
     *
     * @param {number} rows - The symbol row count.
     * @param {number} columns - The symbol column count.
     * @param {Rectangle} outerBounds - The resolved output bounds.
     * @returns {_DmLayout} The resolved layout values.
     * @private
     */
    private _resolveLayout(rows: number, columns: number, outerBounds: Rectangle): _DmLayout {
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
            // Fit uniformly: one module size for both axes, aspect preserved.
            moduleSize = Math.min(availableWidth / columns, availableHeight / rows);
            totalWidth = outerBounds.width;
            totalHeight = outerBounds.height;
            offsetX = (availableWidth - moduleSize * columns) / 2;
            offsetY = (availableHeight - moduleSize * rows) / 2;
        } else {
            moduleSize = this.xDimension;
            totalWidth = columns * moduleSize + quietWidth;
            totalHeight = rows * moduleSize + quietHeight;
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
     * Renders the module matrix as vector graphics with run coalescing.
     * Consecutive dark modules in a row are merged into single filled
     * rectangles to minimize the number of emitted PDF operators.
     *
     * @param {PdfGraphics} graphics - The graphics context to draw on.
     * @param {Rectangle} outerBounds - The resolved output bounds.
     * @param {boolean[]} matrix - The module matrix; dark modules are true.
     * @param {number} rows - The symbol row count.
     * @param {number} columns - The symbol column count.
     * @param {_DmLayout} layout - The resolved output layout.
     * @returns {Rectangle} The occupied bounds.
     * @private
     */
    private _render(graphics: PdfGraphics, outerBounds: Rectangle, matrix: boolean[][], rows: number,
                    columns: number, layout: _DmLayout): Rectangle {
        const zone: { left: number; top: number; right: number; bottom: number } = layout.zone;
        const moduleSize: number = layout.moduleSize;
        const bgBrush: PdfBrush = new PdfBrush(this.backColor);
        graphics.drawRectangle(
            { x: outerBounds.x, y: outerBounds.y, width: layout.totalWidth, height: layout.totalHeight }, bgBrush);
        const fgBrush: PdfBrush = new PdfBrush(this.foreColor);
        const startX: number = outerBounds.x + zone.left * this.xDimension + layout.offsetX;
        const startY: number = outerBounds.y + zone.top * this.xDimension + layout.offsetY;
        // Scan rows and merge consecutive dark modules into horizontal runs so that
        // one filled rectangle is emitted per run (fewer PDF operators, no seams).
        for (let row: number = 0; row < rows; row++) {
            const y: number = startY + row * moduleSize;
            let runStart: number = -1;
            for (let col: number = 0; col <= columns; col++) {
                const dark: boolean = col < columns && matrix[<number>row][<number>col];
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
        return { x: outerBounds.x, y: outerBounds.y, width: layout.totalWidth, height: layout.totalHeight };
    }
    /**
     * Encodes a payload into a Data Matrix ECC 200 matrix.
     *
     * @param {Uint8Array} bytes The payload bytes.
     * @param {PdfDataMatrixEncoding} encoding The requested encodation.
     * @param {PdfDataMatrixSize} symbolSize The requested symbol size.
     * @param {PdfBarcodeTextEncoding} textEncoding The string-to-byte conversion.
     * @returns {_DataMatrixEncodeResult} The encoded symbol dimensions and matrix.
     * @private
     */
    private _encodeDataMatrix(bytes: Uint8Array, encoding: PdfDataMatrixEncoding,
                              symbolSize: PdfDataMatrixSize, textEncoding: PdfBarcodeTextEncoding): _DataMatrixEncodeResult {
        // Binary payload is validated by the caller; the parameter is kept for the
        // future string overload so the public contract stays stable.
        void textEncoding;
        if (encoding !== PdfDataMatrixEncoding.Auto && encoding !== PdfDataMatrixEncoding.Ascii &&
            encoding !== PdfDataMatrixEncoding.AsciiNumeric && encoding !== PdfDataMatrixEncoding.Base256) {
            throw new Error('encoding is not a valid PdfDataMatrixEncoding value');
        }
        if (symbolSize !== PdfDataMatrixSize.Auto &&
            (typeof symbolSize !== 'number' || Math.floor(symbolSize) !== symbolSize ||
                symbolSize < 1 || symbolSize > 30)) {
            throw new Error('symbolSize is not a valid PdfDataMatrixSize value');
        }
        if (bytes === null || bytes === undefined || bytes.length === 0) {
            throw new Error('payload must not be empty');
        }
        const payload: number[] = [];
        for (let i: number = 0; i < bytes.length; i++) {
            payload.push(bytes[<number>i]);
        }
        // Primary encodation.
        let codewords: number[];
        if (encoding === PdfDataMatrixEncoding.Base256) {
            codewords = this._dmEncodeBase256(payload);
        } else if (encoding === PdfDataMatrixEncoding.AsciiNumeric) {
            for (let i: number = 0; i < payload.length; i++) {
                const b: number = payload[<number>i];
                if (b < 48 || b > 57) {
                    throw new Error(
                        'asciiNumeric encoding accepts decimal digits only');
                }
            }
            codewords = this._dmEncodeAsciiNumeric(payload);
        } else if (encoding === PdfDataMatrixEncoding.Ascii) {
            codewords = this._dmEncodeAscii(payload);
        } else {
            // Auto: ASCII encodation with digit-pair compaction covers the exposed
            // modes; Base256 is used only for payloads that ASCII cannot represent.
            let needsBase256: boolean = false;
            for (let i: number = 0; i < payload.length; i++) {
                if (payload[<number>i] > 127) { needsBase256 = true; break; }
            }
            codewords = needsBase256 ? this._dmEncodeBase256(payload) : this._dmEncodeAscii(payload);
        }
        // Symbol selection and validation.
        let symbol: _DmSymbolInfo;
        if (symbolSize === PdfDataMatrixSize.Auto) {
            symbol = this._dmSelectSymbol(codewords.length);
        } else {
            symbol = this._dataMatrixSizeToSymbol[<number>symbolSize - 1];
            if (codewords.length > symbol.dataCapacity) {
                throw new Error(
                    `payload does not fit the fixed symbol size (${symbol.dataCapacity} data codewords)`);
            }
        }
        // Padding: the first standard pad codeword, then randomized pads
        // (ISO/IEC 16022 5.3.1.3).
        if (codewords.length < symbol.dataCapacity) {
            codewords.push(this._dataMatrixPad);
        }
        while (codewords.length < symbol.dataCapacity) {
            codewords.push(this._dmRandomize253State(codewords.length + 1));
        }
        // Error correction and final symbol construction.
        const full: number[] = this._dmAppendEcc(codewords, symbol);
        const regionCols: number = this._dmHorizontalRegions(symbol.dataRegions) * symbol.matrixWidth;
        const regionRows: number = this._dmVerticalRegions(symbol.dataRegions) * symbol.matrixHeight;
        if (full.length * 8 > regionCols * regionRows) {
            throw new Error('codeword stream exceeds the data region modules');
        }
        const states: number[] = this._dmPlaceCodewords(full, regionCols, regionRows);
        const matrix: boolean[][] = this._dmBuildMatrix(states, symbol);
        return {
            rows: matrix.length,
            columns: matrix[<number>0].length,
            dataCodewordCount: symbol.dataCapacity,
            errorCodewordCount: symbol.errorCodewords,
            matrix: matrix
        };
    }
    /**
     * ECC 200 symbol table. Values follow ISO/IEC 16022 (verified against the
     * authoritative ZXing symbol table): data capacity, error codewords, one data
     * region size, region count and the Reed-Solomon block split for the symbols
     * that use interleaved blocks.
     *
     * @private
     */
    private readonly _dataMatrixSymbols: _DmSymbolInfo[] = [
        { rectangular: false, dataCapacity: 3, errorCodewords: 5, matrixWidth: 8, matrixHeight: 8,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 5, errorCodewords: 7, matrixWidth: 10, matrixHeight: 10,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 5, errorCodewords: 7, matrixWidth: 16, matrixHeight: 6,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 8, errorCodewords: 10, matrixWidth: 12, matrixHeight: 12,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 10, errorCodewords: 11, matrixWidth: 14, matrixHeight: 6,
            dataRegions: 2, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 12, errorCodewords: 12, matrixWidth: 14, matrixHeight: 14,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 16, errorCodewords: 14, matrixWidth: 24, matrixHeight: 10,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 18, errorCodewords: 14, matrixWidth: 16, matrixHeight: 16,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 22, errorCodewords: 18, matrixWidth: 18, matrixHeight: 18,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 22, errorCodewords: 18, matrixWidth: 16, matrixHeight: 10,
            dataRegions: 2, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 30, errorCodewords: 20, matrixWidth: 20, matrixHeight: 20,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 32, errorCodewords: 24, matrixWidth: 16, matrixHeight: 14,
            dataRegions: 2, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 36, errorCodewords: 24, matrixWidth: 22, matrixHeight: 22,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 44, errorCodewords: 28, matrixWidth: 24, matrixHeight: 24,
            dataRegions: 1, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: true, dataCapacity: 49, errorCodewords: 28, matrixWidth: 22, matrixHeight: 14,
            dataRegions: 2, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 62, errorCodewords: 36, matrixWidth: 14, matrixHeight: 14,
            dataRegions: 4, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 86, errorCodewords: 42, matrixWidth: 16, matrixHeight: 16,
            dataRegions: 4, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 114, errorCodewords: 48, matrixWidth: 18, matrixHeight: 18,
            dataRegions: 4, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 144, errorCodewords: 56, matrixWidth: 20, matrixHeight: 20,
            dataRegions: 4, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 174, errorCodewords: 68, matrixWidth: 22, matrixHeight: 22,
            dataRegions: 4, rsBlockData: 0, rsBlockError: 0 },
        { rectangular: false, dataCapacity: 204, errorCodewords: 84, matrixWidth: 24, matrixHeight: 24,
            dataRegions: 4, rsBlockData: 102, rsBlockError: 42 },
        { rectangular: false, dataCapacity: 280, errorCodewords: 112, matrixWidth: 14, matrixHeight: 14,
            dataRegions: 16, rsBlockData: 140, rsBlockError: 56 },
        { rectangular: false, dataCapacity: 368, errorCodewords: 144, matrixWidth: 16, matrixHeight: 16,
            dataRegions: 16, rsBlockData: 92, rsBlockError: 36 },
        { rectangular: false, dataCapacity: 456, errorCodewords: 192, matrixWidth: 18, matrixHeight: 18,
            dataRegions: 16, rsBlockData: 114, rsBlockError: 48 },
        { rectangular: false, dataCapacity: 576, errorCodewords: 224, matrixWidth: 20, matrixHeight: 20,
            dataRegions: 16, rsBlockData: 144, rsBlockError: 56 },
        { rectangular: false, dataCapacity: 696, errorCodewords: 272, matrixWidth: 22, matrixHeight: 22,
            dataRegions: 16, rsBlockData: 174, rsBlockError: 68 },
        { rectangular: false, dataCapacity: 816, errorCodewords: 336, matrixWidth: 24, matrixHeight: 24,
            dataRegions: 16, rsBlockData: 136, rsBlockError: 56 },
        { rectangular: false, dataCapacity: 1050, errorCodewords: 408, matrixWidth: 18, matrixHeight: 18,
            dataRegions: 36, rsBlockData: 175, rsBlockError: 68 },
        { rectangular: false, dataCapacity: 1304, errorCodewords: 496, matrixWidth: 20, matrixHeight: 20,
            dataRegions: 36, rsBlockData: 163, rsBlockError: 62 },
        // 144 x 144 symbol: uneven data block distribution is handled by the
        // dedicated block-length helpers (1558 data codewords, 10 blocks).
        { rectangular: false, dataCapacity: 1558, errorCodewords: 620, matrixWidth: 22, matrixHeight: 22,
            dataRegions: 36, rsBlockData: -1, rsBlockError: 62 }
    ];
    /**
     * Maps each `PdfDataMatrixSize` member to its symbol table entry.
     * Index 0 (auto) is absent; members 1 through 30 map to this._dataMatrixSymbols entries in
     * the order of the enum declaration (verified by table-consistency tests).
     *
     * @private
     */
    private readonly _dataMatrixSizeToSymbol: _DmSymbolInfo[] = [
        this._dataMatrixSymbols[0],  // size10x10 (3 data codewords)
        this._dataMatrixSymbols[1],  // size12x12 (5)
        this._dataMatrixSymbols[3],  // size14x14 (8)
        this._dataMatrixSymbols[5],  // size16x16 (12)
        this._dataMatrixSymbols[7],  // size18x18 (18)
        this._dataMatrixSymbols[8],  // size20x20 (22)
        this._dataMatrixSymbols[10], // size22x22 (30)
        this._dataMatrixSymbols[12], // size24x24 (36)
        this._dataMatrixSymbols[13], // size26x26 (44)
        this._dataMatrixSymbols[15], // size32x32 (62)
        this._dataMatrixSymbols[16], // size36x36 (86)
        this._dataMatrixSymbols[17], // size40x40 (114)
        this._dataMatrixSymbols[18], // size44x44 (144)
        this._dataMatrixSymbols[19], // size48x48 (174)
        this._dataMatrixSymbols[20], // size52x52 (204)
        this._dataMatrixSymbols[21], // size64x64 (280)
        this._dataMatrixSymbols[22], // size72x72 (368)
        this._dataMatrixSymbols[23], // size80x80 (456)
        this._dataMatrixSymbols[24], // size88x88 (576)
        this._dataMatrixSymbols[25], // size96x96 (696)
        this._dataMatrixSymbols[26], // size104x104 (816)
        this._dataMatrixSymbols[27], // size120x120 (1050)
        this._dataMatrixSymbols[28], // size132x132 (1304)
        this._dataMatrixSymbols[29], // size144x144 (1558)
        this._dataMatrixSymbols[2],  // size8x18 (5)
        this._dataMatrixSymbols[4],  // size8x32 (10)
        this._dataMatrixSymbols[6],  // size12x26 (16)
        this._dataMatrixSymbols[9],  // size12x36 (22)
        this._dataMatrixSymbols[11], // size16x36 (32)
        this._dataMatrixSymbols[14]  // size16x48 (49)
    ];
    /**
     * ECC 200 Reed-Solomon generator polynomial factor sets indexed by error
     * codeword count (ISO/IEC 16022 Annex A; verified against the authoritative
     * ZXing factor table).
     *
     * @private
     */
    private readonly _dataMatrixFactorSets: number[] = [5, 7, 10, 11, 12, 14, 18, 20, 24, 28, 36, 42, 48, 56, 62, 68];
    /**
     * ECC 200 Reed-Solomon generator polynomial coefficients per factor set.
     *
     * @private
     */
    private readonly _dataMatrixFactors: number[][] = [
        [228, 48, 15, 111, 62],
        [23, 68, 144, 134, 240, 92, 254],
        [28, 24, 185, 166, 223, 248, 116, 255, 110, 61],
        [175, 138, 205, 12, 194, 168, 39, 245, 60, 97, 120],
        [41, 153, 158, 91, 61, 42, 142, 213, 97, 178, 100, 242],
        [156, 97, 192, 252, 95, 9, 157, 119, 138, 45, 18, 186, 83, 185],
        [83, 195, 100, 39, 188, 75, 66, 61, 241, 213, 109, 129, 94, 254, 225, 48, 90, 188],
        [15, 195, 244, 9, 233, 71, 168, 2, 188, 160, 153, 145, 253, 79, 108, 82, 27, 174, 186, 172],
        [52, 190, 88, 205, 109, 39, 176, 21, 155, 197, 251, 223, 155, 21, 5, 172, 254, 124, 12, 181, 184, 96, 50, 193],
        [211, 231, 43, 97, 71, 96, 103, 174, 37, 151, 170, 53, 75, 34, 249, 121, 17, 138, 110, 213, 141, 136, 120, 151, 233, 168, 93, 255],
        [
            245, 127, 242, 218, 130, 250, 162, 181, 102, 120, 84, 179,
            220, 251, 80, 182, 229, 18, 2, 4, 68, 33, 101, 137,
            95, 119, 115, 44, 175, 184, 59, 25, 225, 98, 81, 112
        ],
        [
            77, 193, 137, 31, 19, 38, 22, 153, 247, 105, 122, 2,
            245, 133, 242, 8, 175, 95, 100, 9, 167, 105, 214, 111,
            57, 121, 21, 1, 253, 57, 54, 101, 248, 202, 69, 50,
            150, 177, 226, 5, 9, 5
        ],
        [
            245, 132, 172, 223, 96, 32, 117, 22, 238, 133, 238, 231,
            205, 188, 237, 87, 191, 106, 16, 147, 118, 23, 37, 90,
            170, 205, 131, 88, 120, 100, 66, 138, 186, 240, 82, 44,
            176, 87, 187, 147, 160, 175, 69, 213, 92, 253, 225, 19
        ],
        [
            175, 9, 223, 238, 12, 17, 220, 208, 100, 29, 175, 170,
            230, 192, 215, 235, 150, 159, 36, 223, 38, 200, 132, 54,
            228, 146, 218, 234, 117, 203, 29, 232, 144, 238, 22, 150,
            201, 117, 62, 207, 164, 13, 137, 245, 127, 67, 247, 28,
            155, 43, 203, 107, 233, 53, 143, 46
        ],
        [
            242, 93, 169, 50, 144, 210, 39, 118, 202, 188, 201, 189,
            143, 108, 196, 37, 185, 112, 134, 230, 245, 63, 197, 190,
            250, 106, 185, 221, 175, 64, 114, 71, 161, 44, 147, 6,
            27, 218, 51, 63, 87, 10, 40, 130, 188, 17, 163, 31,
            176, 170, 4, 107, 232, 7, 94, 166, 224, 124, 86, 47,
            11, 204
        ],
        [
            220, 228, 173, 89, 251, 149, 159, 56, 89, 33, 147, 244, 154, 36, 73, 127, 213, 136, 248, 180, 234, 197, 158,
            177, 68, 122, 93, 213, 15, 160, 227, 236, 66, 139, 153, 185, 202, 167, 179, 25, 220, 232, 96, 210, 231, 136,
            223, 239, 181, 241, 59, 52, 172, 25, 49, 232, 211, 189, 64, 54, 108, 153, 132, 63, 96, 103, 82, 186
        ]
    ];
    /**
     * GF(256) logarithm and exponent tables over the ECC 200 primitive polynomial
     * 0x12D (ISO/IEC 16022 Annex A).
     *
     * @private
     */
    private readonly _dataMatrixLog: number[] = (() => {
        const log: number[] = new Array<number>(256);
        let value: number = 1;
        for (let i: number = 0; i < 255; i++) {
            log[<number>value] = i;
            value <<= 1;
            if (value >= 256) { value ^= 0x12D; }
        }
        return log;
    })();
    /**
     * GF(256) exponent table.
     *
     * @private
     */
    private readonly _dataMatrixAlgorithm: number[] = (() => {
        const alog: number[] = new Array<number>(255);
        let value: number = 1;
        for (let i: number = 0; i < 255; i++) {
            alog[<number>i] = value;
            value <<= 1;
            if (value >= 256) { value ^= 0x12D; }
        }
        return alog;
    })();
    /**
     * ECC 200 mode constants (ISO/IEC 16022 5.5).
     *
     * @private
     */
    private readonly _dataMatrixPad: number = 129;
    private readonly _dataMatrixLatchToBase256: number = 231;
    private readonly _dataMatrixUpperShift: number = 235;
    /**
     * GF(256) multiplication over the ECC 200 primitive polynomial 0x12D.
     *
     * @param {number} x The first factor.
     * @param {number} y The second factor.
     * @returns {number} The product in GF(256).
     * @private
     */
    private _dmGfMul(x: number, y: number): number {
        if (x === 0 || y === 0) { return 0; }
        return this._dataMatrixAlgorithm[(this._dataMatrixLog[<number>x] + this._dataMatrixLog[<number>y]) % 255];
    }
    /**
     * Returns the horizontal data region count of a symbol.
     *
     * @param {number} dataRegions The total region count of the symbol.
     * @returns {number} The horizontal region count.
     * @private
     */
    private _dmHorizontalRegions(dataRegions: number): number {
        switch (dataRegions) {
        case 1: return 1;
        case 2:
        case 4: return 2;
        case 16: return 4;
        case 36: return 6;
        default:
            throw new Error('unsupported data region count');
        }
    }
    /**
     * Returns the vertical data region count of a symbol.
     *
     * @param {number} dataRegions The total region count of the symbol.
     * @returns {number} The vertical region count.
     * @private
     */
    private _dmVerticalRegions(dataRegions: number): number {
        switch (dataRegions) {
        case 1:
        case 2: return 1;
        case 4: return 2;
        case 16: return 4;
        case 36: return 6;
        default:
            throw new Error('unsupported data region count');
        }
    }
    /**
     * Returns the interleaved data block count of a symbol.
     *
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {number} The interleaved block count.
     * @private
     */
    private _dmBlockCount(symbol: _DmSymbolInfo): number {
        if (symbol.rsBlockData === 0) { return 1; }
        if (symbol.rsBlockData === -1) { return 10; } // 144 x 144 symbol
        return Math.floor(symbol.dataCapacity / symbol.rsBlockData);
    }
    /**
     * Returns the error codeword count of one interleaved block.
     *
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {number} The block error length.
     * @private
     */
    private _dmBlockErrorLength(symbol: _DmSymbolInfo): number {
        return symbol.rsBlockError === 0 ? symbol.errorCodewords : symbol.rsBlockError;
    }
    /**
     * Returns the final symbol column count including finder borders.
     *
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {number} The symbol width in modules.
     * @private
     */
    private _dmSymbolWidth(symbol: _DmSymbolInfo): number {
        return this._dmHorizontalRegions(symbol.dataRegions) * (symbol.matrixWidth + 2);
    }
    /**
     * Returns the final symbol row count including finder borders.
     *
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {number} The symbol height in modules.
     * @private
     */
    private _dmSymbolHeight(symbol: _DmSymbolInfo): number {
        return this._dmVerticalRegions(symbol.dataRegions) * (symbol.matrixHeight + 2);
    }
    /**
     * Converts text to bytes using the selected conversion.
     *
     * @param {string} text The payload text.
     * @param {PdfBarcodeTextEncoding} encoding The string-to-byte conversion.
     * @returns {number[]} The converted byte values.
     * @private
     */
    private _dmTextToBytes(text: string, encoding: PdfBarcodeTextEncoding): number[] {
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
            const code: number = text.charCodeAt(i);
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xC0 | (code >> 6), 0x80 | (code & 0x3F));
            } else if (code >= 0xD800 && code <= 0xDFFF) {
                throw new Error('text contains an unpaired surrogate');
            } else {
                bytes.push(0xE0 | (code >> 12), 0x80 | ((code >> 6) & 0x3F), 0x80 | (code & 0x3F));
            }
        }
        return bytes;
    }
    /**
     * Encodes payload bytes into ASCII codewords with digit-pair compaction
     * (ISO/IEC 16022 5.3.1). Digits pairs become one codeword; other byte values
     * use the value + 1 mapping with upper shift for values above 127.
     *
     * @param {number[]} bytes The payload bytes.
     * @returns {number[]} The ASCII codewords.
     * @private
     */
    private _dmEncodeAscii(bytes: number[]): number[] {
        const codewords: number[] = [];
        let i: number = 0;
        while (i < bytes.length) {
            const b: number = bytes[<number>i];
            if (b >= 48 && b <= 57 && i + 1 < bytes.length && bytes[<number>i + 1] >= 48 && bytes[<number>i + 1] <= 57) {
                codewords.push((b - 48) * 10 + (bytes[<number>i + 1] - 48) + 130);
                i += 2;
            } else if (b > 127) {
                codewords.push(this._dataMatrixUpperShift, b - 128 + 1);
                i += 1;
            } else {
                codewords.push(b + 1);
                i += 1;
            }
        }
        return codewords;
    }
    /**
     * Encodes decimal digit values with digit-pair compaction only. A single odd
     * trailing digit uses the standard ASCII mapping.
     *
     * @param {number[]} digits The payload digit character codes.
     * @returns {number[]} The ASCII numeric codewords.
     * @private
     */
    private _dmEncodeAsciiNumeric(digits: number[]): number[] {
        const codewords: number[] = [];
        let i: number = 0;
        while (i + 1 < digits.length) {
            codewords.push((digits[<number>i] - 48) * 10 + (digits[<number>i + 1] - 48) + 130);
            i += 2;
        }
        if (i < digits.length) {
            // A single odd trailing digit uses the standard ASCII mapping: the
            // digit's character code plus one (ISO/IEC 16022 5.3.1).
            codewords.push(digits[<number>i] + 1);
        }
        return codewords;
    }
    /**
     * Randomizes a Base256 codeword with the position-dependent 255 state rule
     * (ISO/IEC 16022 5.5.3).
     *
     * @param {number} value The raw codeword value.
     * @param {number} position The one-based codeword position.
     * @returns {number} The randomized codeword value.
     * @private
     */
    private _dmRandomize255State(value: number, position: number): number {
        const pseudoRandom: number = ((149 * position) % 255) + 1;
        const sum: number = value + pseudoRandom;
        return sum <= 255 ? sum : sum - 256;
    }
    /**
     * Encodes payload bytes into Base256 codewords with the latch, the one- or
     * two-codeword length field and position randomization (ISO/IEC 16022 5.5.3).
     *
     * @param {number[]} bytes The payload bytes.
     * @returns {number[]} The Base256 codewords.
     * @private
     */
    private _dmEncodeBase256(bytes: number[]): number[] {
        const codewords: number[] = [];
        codewords.push(this._dataMatrixLatchToBase256);
        if (bytes.length <= 249) {
            codewords.push(this._dmRandomize255State(bytes.length, codewords.length + 1));
        } else if (bytes.length <= 1555) {
            codewords.push(this._dmRandomize255State(Math.floor(bytes.length / 250) + 249, codewords.length + 1));
            codewords.push(this._dmRandomize255State(bytes.length % 250, codewords.length + 1));
        } else {
            throw new Error('base256 payload exceeds 1555 bytes');
        }
        for (let i: number = 0; i < bytes.length; i++) {
            codewords.push(this._dmRandomize255State(bytes[<number>i], codewords.length + 1));
        }
        return codewords;
    }
    /**
     * Randomizes a pad codeword with the position-dependent 253 state rule
     * (ISO/IEC 16022 5.3.1.3).
     *
     * @param {number} position The one-based codeword position.
     * @returns {number} The randomized pad codeword value.
     * @private
     */
    private _dmRandomize253State(position: number): number {
        const pseudoRandom: number = ((149 * position) % 253) + 1;
        const sum: number = this._dataMatrixPad + pseudoRandom;
        return sum <= 254 ? sum : sum - 254;
    }
    /**
     * Generates the ECC 200 error correction codewords for one block using the
     * authoritative factor sets over GF(256) (ISO/IEC 16022 Annex A).
     *
     * @param {number[]} codewords The block data codewords.
     * @param {number} errorCount The block error codeword count.
     * @returns {number[]} The block error codewords.
     * @private
     */
    private _dmCreateEccBlock(codewords: number[], errorCount: number): number[] {
        let tableIndex: number = -1;
        for (let i: number = 0; i < this._dataMatrixFactorSets.length; i++) {
            if (this._dataMatrixFactorSets[<number>i] === errorCount) {
                tableIndex = i;
                break;
            }
        }
        if (tableIndex < 0) {
            throw new Error('unsupported error codeword count');
        }
        const poly: number[] = this._dataMatrixFactors[<number>tableIndex];
        const ecc: number[] = new Array<number>(errorCount).fill(0);
        for (let i: number = 0; i < codewords.length; i++) {
            const m: number = ecc[<number>errorCount - 1] ^ codewords[<number>i];
            for (let k: number = errorCount - 1; k > 0; k--) {
                const coef: number = poly[<number>k];
                ecc[<number>k] = m !== 0 && coef !== 0
                    ? ecc[<number>k - 1] ^ this._dmGfMul(m, coef)
                    : ecc[<number>k - 1];
            }
            const lead: number = poly[<number>0];
            ecc[<number>0] = m !== 0 && lead !== 0 ? this._dmGfMul(m, lead) : 0;
        }
        const reversed: number[] = [];
        for (let i: number = 0; i < errorCount; i++) {
            reversed.push(ecc[<number>errorCount - i - 1]);
        }
        return reversed;
    }
    /**
     * Appends ECC 200 error correction codewords and interleaves multi-block
     * symbols (ISO/IEC 16022 7.3). The 144 x 144 symbol uses its dedicated uneven
     * block distribution.
     *
     * @param {number[]} data The data codewords matching the symbol capacity.
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {number[]} The full codeword stream (data + interleaved ECC).
     * @private
     */
    private _dmAppendEcc(data: number[], symbol: _DmSymbolInfo): number[] {
        if (data.length !== symbol.dataCapacity) {
            throw new Error('codeword count does not match the symbol capacity');
        }
        const result: number[] = data.slice();
        const blockCount: number = this._dmBlockCount(symbol);
        if (blockCount === 1) {
            const ecc: number[] = this._dmCreateEccBlock(data, symbol.errorCodewords);
            for (let i: number = 0; i < ecc.length; i++) {
                result.push(ecc[<number>i]);
            }
            return result;
        }
        for (let e: number = 0; e < symbol.errorCodewords; e++) {
            result.push(0);
        }
        for (let block: number = 0; block < blockCount; block++) {
            const blockData: number[] = [];
            for (let d: number = block; d < symbol.dataCapacity; d += blockCount) {
                blockData.push(data[<number>d]);
            }
            const blockError: number = this._dmBlockErrorLength(symbol);
            const ecc: number[] = this._dmCreateEccBlock(blockData, blockError);
            let pos: number = 0;
            for (let e: number = block; e < blockError * blockCount; e += blockCount) {
                result[<number>symbol.dataCapacity + e] = ecc[<number>pos++];
            }
        }
        return result;
    }
    /**
     * Places the codeword bits into the data-region matrix using the ECC 200
     * eight-module Utah pattern, the four corner cases and negative-coordinate
     * wrapping (ISO/IEC 16022 Annex F). `bitStates` uses 2 for unset modules.
     *
     * @param {number[]} codewords The full codeword stream.
     * @param {number} columns The data-region column count.
     * @param {number} rows The data-region row count.
     * @returns {number[]} The flat bit state array (0 light, 1 dark, 2 unset).
     * @private
     */
    private _dmPlaceCodewords(codewords: number[], columns: number, rows: number): number[] {
        const states: number[] = new Array<number>(columns * rows).fill(2);
        const module: (r0: number, c0: number, p0: number, b0: number) => void =
            (row: number, col: number, pos: number, bit: number): void => {
                if (row < 0) {
                    row += rows;
                    col += 4 - ((rows + 4) % 8);
                }
                if (col < 0) {
                    col += columns;
                    row += 4 - ((columns + 4) % 8);
                }
                const value: number = codewords[<number>pos] & (1 << (8 - bit));
                states[<number>row * columns + col] = value !== 0 ? 1 : 0;
            };
        const utah: (row: number, col: number, pos: number) => void = (row: number, col: number, pos: number): void => {
            module(row - 2, col - 2, pos, 1);
            module(row - 2, col - 1, pos, 2);
            module(row - 1, col - 2, pos, 3);
            module(row - 1, col - 1, pos, 4);
            module(row - 1, col, pos, 5);
            module(row, col - 2, pos, 6);
            module(row, col - 1, pos, 7);
            module(row, col, pos, 8);
        };
        const corner1: (pos: number) => void = (pos: number): void => {
            module(rows - 1, 0, pos, 1);
            module(rows - 1, 1, pos, 2);
            module(rows - 1, 2, pos, 3);
            module(0, columns - 2, pos, 4);
            module(0, columns - 1, pos, 5);
            module(1, columns - 1, pos, 6);
            module(2, columns - 1, pos, 7);
            module(3, columns - 1, pos, 8);
        };
        const corner2: (pos: number) => void = (pos: number): void => {
            module(rows - 3, 0, pos, 1);
            module(rows - 2, 0, pos, 2);
            module(rows - 1, 0, pos, 3);
            module(0, columns - 4, pos, 4);
            module(0, columns - 3, pos, 5);
            module(0, columns - 2, pos, 6);
            module(0, columns - 1, pos, 7);
            module(1, columns - 1, pos, 8);
        };
        const corner3: (pos: number) => void = (pos: number): void => {
            module(rows - 3, 0, pos, 1);
            module(rows - 2, 0, pos, 2);
            module(rows - 1, 0, pos, 3);
            module(0, columns - 2, pos, 4);
            module(0, columns - 1, pos, 5);
            module(1, columns - 1, pos, 6);
            module(2, columns - 1, pos, 7);
            module(3, columns - 1, pos, 8);
        };
        const corner4: (pos: number) => void = (pos: number): void => {
            module(rows - 1, 0, pos, 1);
            module(rows - 1, columns - 1, pos, 2);
            module(0, columns - 3, pos, 3);
            module(0, columns - 2, pos, 4);
            module(0, columns - 1, pos, 5);
            module(1, columns - 3, pos, 6);
            module(1, columns - 2, pos, 7);
            module(1, columns - 1, pos, 8);
        };
        let pos: number = 0;
        let row: number = 4;
        let col: number = 0;
        do {
            if (row === rows && col === 0) {
                corner1(pos++);
            }
            if (row === rows - 2 && col === 0 && columns % 4 !== 0) {
                corner2(pos++);
            }
            if (row === rows - 2 && col === 0 && columns % 8 === 4) {
                corner3(pos++);
            }
            if (row === rows + 4 && col === 2 && columns % 8 === 0) {
                corner4(pos++);
            }
            do {
                if (row < rows && col >= 0 && states[<number>row * columns + col] === 2) {
                    utah(row, col, pos++);
                }
                row -= 2;
                col += 2;
            } while (row >= 0 && col < columns);
            row++;
            col += 3;
            do {
                if (row >= 0 && col < columns && states[<number>row * columns + col] === 2) {
                    utah(row, col, pos++);
                }
                row += 2;
                col -= 2;
            } while (row < rows && col >= 0);
            row += 3;
            col++;
        } while (row < rows || col < columns);
        if (states[<number>rows * columns - 1] === 2) {
            // Fixed final modules: the lower-right corner and its diagonal neighbor.
            states[<number>rows * columns - 1] = 1;
            states[<number>(rows - 2) * columns + (columns - 2)] = 1;
        }
        return states;
    }
    /**
     * Builds the final symbol matrix with finder and clock-track borders around
     * every data region (ISO/IEC 16022 4.3). The data-region bits are copied into
     * the bordered output.
     *
     * @param {number[]} states The placed data-region bit states.
     * @param {_DmSymbolInfo} symbol The symbol definition.
     * @returns {boolean[]} The final dark-module matrix.
     * @private
     */
    private _dmBuildMatrix(states: number[], symbol: _DmSymbolInfo): boolean[][] {
        const regionCols: number = symbol.matrixWidth;
        const regionRows: number = symbol.matrixHeight;
        const horizontalRegions: number = this._dmHorizontalRegions(symbol.dataRegions);
        const verticalRegions: number = this._dmVerticalRegions(symbol.dataRegions);
        const width: number = this._dmSymbolWidth(symbol);
        const height: number = this._dmSymbolHeight(symbol);
        const matrix: boolean[][] = [];
        for (let r: number = 0; r < height; r++) {
            matrix.push(new Array<boolean>(width).fill(false));
        }
        let matrixRow: number = 0;
        for (let y: number = 0; y < verticalRegions * regionRows; y++) {
            let matrixCol: number;
            if (y % regionRows === 0) {
                // Top border of the region: alternating dark and light modules.
                matrixCol = 0;
                for (let x: number = 0; x < width; x++) {
                    matrix[<number>matrixRow][<number>matrixCol] = x % 2 === 0;
                    matrixCol++;
                }
                matrixRow++;
            }
            matrixCol = 0;
            for (let x: number = 0; x < horizontalRegions * regionCols; x++) {
                if (x % regionCols === 0) {
                    // Left border of the region: solid dark.
                    matrix[<number>matrixRow][<number>matrixCol] = true;
                    matrixCol++;
                }
                // The placement grid spans all regions; read the state at the
                // absolute coordinates of the combined data area.
                const state: number = states[<number>y * (horizontalRegions * regionCols) + x];
                matrix[<number>matrixRow][<number>matrixCol] = state === 1;
                matrixCol++;
                if (x % regionCols === regionCols - 1) {
                    // Right border of the region: alternating clock track.
                    matrix[<number>matrixRow][<number>matrixCol] = y % 2 === 0;
                    matrixCol++;
                }
            }
            matrixRow++;
            if (y % regionRows === regionRows - 1) {
                // Bottom border of the region: solid dark.
                matrixCol = 0;
                for (let x: number = 0; x < width; x++) {
                    matrix[<number>matrixRow][<number>matrixCol] = true;
                    matrixCol++;
                }
                matrixRow++;
            }
        }
        return matrix;
    }
    /**
     * Selects the smallest symbol that fits the codeword count. Deterministic
     * preference follows the spec: smallest physical area first, square before
     * rectangular on ties.
     *
     * @param {number} codewordCount The required data codeword count.
     * @returns {_DmSymbolInfo} The selected symbol definition.
     * @private
     */
    private _dmSelectSymbol(codewordCount: number): _DmSymbolInfo {
        let best: _DmSymbolInfo | null = null;
        let bestArea: number = 0;
        for (let i: number = 0; i < this._dataMatrixSymbols.length; i++) {
            const symbol: _DmSymbolInfo = this._dataMatrixSymbols[<number>i];
            if (codewordCount > symbol.dataCapacity) { continue; }
            const area: number = this._dmSymbolWidth(symbol) * this._dmSymbolHeight(symbol);
            if (best === null || area < bestArea || (area === bestArea && !symbol.rectangular && best.rectangular)) {
                best = symbol;
                bestArea = area;
            }
        }
        if (best === null) {
            throw new Error(
                'payload exceeds the maximum supported symbol capacity');
        }
        return best;
    }
    /**
     * Encodes text into a Data Matrix ECC 200 matrix.
     *
     * @param {string} text The payload text.
     * @param {PdfDataMatrixEncoding} encoding The requested encodation.
     * @param {PdfDataMatrixSize} symbolSize The requested symbol size.
     * @param {PdfBarcodeTextEncoding} textEncoding The string-to-byte conversion.
     * @returns {_DataMatrixEncodeResult} The encoded symbol dimensions and matrix.
     * @private
     */
    private _encodeDataMatrixText(text: string, encoding: PdfDataMatrixEncoding,
                                  symbolSize: PdfDataMatrixSize, textEncoding: PdfBarcodeTextEncoding): _DataMatrixEncodeResult {
        if (textEncoding !== PdfBarcodeTextEncoding.Utf8 &&
            textEncoding !== PdfBarcodeTextEncoding.Iso88591) {
            throw new Error(
                'textEncoding is not a valid PdfBarcodeTextEncoding value');
        }
        if (encoding === PdfDataMatrixEncoding.AsciiNumeric) {
            for (let i: number = 0; i < text.length; i++) {
                const code: number = text.charCodeAt(i);
                if (code < 48 || code > 57) {
                    throw new Error(
                        'asciiNumeric encoding accepts decimal digits only');
                }
            }
        }
        const bytes: number[] = this._dmTextToBytes(text, textEncoding);
        const array: Uint8Array = new Uint8Array(bytes);
        return this._encodeDataMatrix(array, encoding, symbolSize, textEncoding);
    }
}
