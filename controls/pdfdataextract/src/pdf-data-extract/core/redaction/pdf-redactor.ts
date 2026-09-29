import { _PdfContentStream, _PdfCrossReference, _PdfDictionary, _PdfRecord, PdfAnnotation, PdfDocument, PdfPage, PdfRedactionAnnotation, PdfRotationAngle, PdfTemplate, Rectangle} from '@syncfusion/ej2-pdf';
import { _GraphicState } from '../graphic-state';
import { TextGlyph } from '../text-structure';
import { _PdfContentParserHelper } from '../content-parser-helper';
import { _TextProcessingMode } from '../enum';
import { _FontStructure } from '../text-extraction';
import { _addFontResources, _getXObjectResources, canvasRenderCallback } from '../utils';
import { _TextGlyphMapper } from './text-glyph-mapper';
import { _PdfRedactionProcessor } from './pdf-redaction-processor';
import { PdfRedactionRegion } from './pdf-redaction-region';
import { initializeTelemetryFeature } from '@syncfusion/ej2-base';
/**
 * Represents a content redactor from an existing PDF document.
 *
 * ```typescript
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Create a new text extractor
 * let redactor: PdfRedactor = new PdfRedactor(document);
 * // Add redactions to the collection
 * let redactions: PdfRedactionRegion[] = [];
 * redactions.push(new PdfRedactionRegion(0, {x: 10, y: 10, width: 100, height: 50}));
 * redactions.push(new PdfRedactionRegion(2, {x: 10, y: 10, width: 100, height: 50}, true, {r: 255, g: 0, b: 0}));
 * redactor.add(redactions);
 * // Apply redactions on the PDF document
 * redactor.redactSync();
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfRedactor {
    /**
     * The loaded PDF document being redacted.
     *
     * @private
     */
    _document: PdfDocument;
    /**
     * Internal flag indicating hex-string context during text replacement.
     *
     * @private
     */
    _isHex: boolean = false;
    /**
     * Accumulated redaction regions for the current page batch.
     *
     * @private
     */
    _redactionRegion: PdfRedactionRegion[] = [];
    /**
     * Page-indexed map of pending redaction regions.
     *
     * @private
     */
    _redaction: Map<number, PdfRedactionRegion[]> = new Map<number, PdfRedactionRegion[]>();
    /**
     * Internal content parser helper configured for redaction.
     *
     * @private
     */
    _parser: _PdfContentParserHelper;
    /**
     * Cross-reference of the loaded document.
     *
     * @private
     */
    _crossReference: _PdfCrossReference;
    /**
     * Internal low-level processor to update page contents / annotations.
     *
     * @private
     */
    _object: _PdfRedactionProcessor = new _PdfRedactionProcessor();
    /**
     * Initializes a new instance of the `PdfRedactor` class.
     *
     * @param {PdfDocument} document The PDF document to which the redactions will be applied.
     * @throws {Error} If the document is null, undefined, or not a loaded document instance.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redactSync();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(document: PdfDocument)
    /**
     * Initializes a new instance of the `PdfRedactor` class with the specified redactions.
     *
     * @param {PdfDocument} document The PDF document to which the redactions will be applied.
     * @param {PdfRedactionRegion[]} redactions An array of redaction objects.
     * @throws {Error} If the document is null, undefined, or not a loaded document instance.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Initialize a new instance of the `PdfRedactor` class with redactions
     * let redactor: PdfRedactor = new PdfRedactor(document, redactions);
     * // Apply redactions on the PDF document
     * redactor.redactSync();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    constructor(document: PdfDocument, redactions: PdfRedactionRegion[])
    constructor(document: PdfDocument, redactions?: PdfRedactionRegion[]) {
        if (document) {
            if (document._isLoaded) {
                this._document = document;
                this._crossReference = document._crossReference;
            } else {
                throw new Error('Redaction cannot be applied to a newly created document.');
            }
            this._document.fileStructure.isIncrementalUpdate = false;
            this._parser = new _PdfContentParserHelper(_TextProcessingMode.redaction, this);
            if (redactions && redactions.length > 0) {
                this.add(redactions);
            }
        } else {
            throw new Error('PDF document instance cannot be null or undefined');
        }
    }
    /**
     * Add redactions with specified options.
     *
     * @param {PdfRedactionRegion[]} redactions An array of redaction objects to specify the page index, bounds and appearance of the redaction to be applied.
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redactSync();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    add(redactions: PdfRedactionRegion[]): void {
        const options: PdfRedactionRegion[] = redactions;
        for (let i: number = 0; i < options.length; i++) {
            const pageIndex: number = options[Number.parseInt(i.toString(), 10)].pageIndex;
            if (!this._redaction.has(pageIndex)) {
                this._redaction.set(pageIndex, []);
            }
            const redactionArray: PdfRedactionRegion[] = this._redaction.get(pageIndex);
            if (redactionArray) {
                redactionArray.push(options[Number.parseInt(i.toString(), 10)]);
            }
        }
    }
    /**
     * Redacts all marked regions in the PDF document synchronously.
     *
     * This method removes text and vector content within the specified redaction regions. It does **not** support image redaction.To redact images inside the PDF, use the asynchronous `redact()` method instead.
     *
     * @returns {void} Nothing.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(document);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Apply redactions on the PDF document
     * redactor.redactSync();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    redactSync(): void {
        initializeTelemetryFeature('RedactContent', 'PDFLibrary');
        if (this._document && this._document.pageCount > 0) {
            for (let i: number = 0; i < this._document.pageCount; i++) {
                const page: PdfPage = this._document.getPage(i);
                if (page && page.annotations.count > 0) {
                    this._applyRedaction(page);
                }
            }
        }
        this._redaction.forEach((value: PdfRedactionRegion[], key: number) => {
            this._redactionRegion = [];
            this._combineBounds(value);
            const option: PdfRedactionRegion[] = value;
            const page: PdfPage = this._document.getPage(key);
            const graphicState: _GraphicState = new _GraphicState();
            const recordCollection: _PdfRecord[] = this._parser._getPageRecordCollection(page);
            const resource: _PdfDictionary = page._pageDictionary.get('Resources');
            let fontCollection: Map<string, _FontStructure>;
            let xObjectCollection: Map<string, _FontStructure>;
            if (typeof(resource) !== 'undefined') {
                fontCollection = _addFontResources(resource, page._pageDictionary._crossReference );
                xObjectCollection = _getXObjectResources(resource, page._pageDictionary._crossReference);
            }
            let stream: any; // eslint-disable-line
            if (this._redactionRegion.length > 0) {
                stream = this._parser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            }
            page._needInitializeGraphics = true;
            this._object._updateContentStream(page, stream, option, this._document);
        });
    }
    /**
     * Redacts all marked regions in the PDF document.
     *
     * @param {Function} callBack - A function that supplies a canvas element along with the current application platform.The canvas is used internally to render and redact image content.
     * @returns {void} A promise that resolves once all redactions have been applied.
     *
     * ```typescript
     * // Load an existing PDF document
     * let doc: PdfDocument = new PdfDocument(data, password);
     * // Add redactions to the collection
     * let redactions: PdfRedactionRegion[] = [];
     * // Initialize a new instance of the `PdfRedactor` class
     * let redactor: PdfRedactor = new PdfRedactor(doc);
     * // Initialize a new instance of the `PdfRedactionRegion` class.
     * let redaction: PdfRedactionRegion = new PdfRedactionRegion(0, {x: 40, y: 41.809, width: 80, height: 90});
     * // Sets the fill color used to fill the redacted area.
     * redaction.fillColor = {r: 255, g: 0, b: 0};
     * redactions.push(redaction);
     * // Add redactions with specified options.
     * redactor.add(redactions);
     * // Define a canvas render callback that returns a canvas element and the application platform.
     * const canvasRenderCallback = (): {canvas: any, applicationPlatform: ApplicationPlatform} => {
     *     const canvas = document.createElement('canvas');
     *     return { canvas: canvas, applicationPlatform: ApplicationPlatform.typescript };
     * };
     * // Apply redactions on the PDF document
     * await redactor.redact(callBack: canvasRenderCallback);
     * // Save the document
     * doc.save('output.pdf');
     * // Destroy the document
     * doc.destroy();
     * ```
     */
    async redact(callBack: canvasRenderCallback): Promise<void> {
        initializeTelemetryFeature('RedactContent', 'PDFLibrary');
        if (this._document && this._document.pageCount > 0) {
            this._document.fileStructure.isIncrementalUpdate = false;
            for (let i: number = 0; i < this._document.pageCount; i++) {
                const page: PdfPage = this._document.getPage(i);
                if (page && page.annotations.count > 0) {
                    this._applyRedaction(page);
                }
            }
        }
        let canvas: any; // eslint-disable-line
        let isValidCanvas: boolean = false;
        if (typeof(callBack) !== 'undefined') {
            canvas = callBack();
            if (typeof(canvas) !== 'undefined' && typeof(canvas.canvas) !== 'undefined') {
                isValidCanvas = true;
            }
        }
        const entries: any = Array.from(this._redaction.entries()); // eslint-disable-line
        for (let i: number = 0; i < entries.length; i++) {
            const [key, value] = entries[<number>i];
            this._redactionRegion = [];
            this._combineBounds(value);
            const option: PdfRedactionRegion[] = value;
            const page: PdfPage = this._document.getPage(key);
            this._document._crossReference._isDecoderSupport = true;
            const graphicState: _GraphicState = new _GraphicState();
            const recordCollection: _PdfRecord[] = this._parser._getPageRecordCollection(page);
            const resource: any = page._pageDictionary.get('Resources'); // eslint-disable-line
            let fontCollection: Map<string, _FontStructure>;
            let xObjectCollection: Map<string, _FontStructure>;
            if (typeof(resource) !== 'undefined') {
                fontCollection = _addFontResources(resource, page._pageDictionary._crossReference );
                xObjectCollection = _getXObjectResources(resource, this._crossReference, _TextProcessingMode.imageRedaction, page);
            }
            let stream: any; // eslint-disable-line
            let mode: _TextProcessingMode;
            if (this._redactionRegion.length > 0) {
                mode = _TextProcessingMode.imageRedaction;
                stream = await this._parser._processImageRecordCollection(recordCollection, page, fontCollection, xObjectCollection,
                                                                          graphicState, canvas, mode, option, isValidCanvas);
            }
            page._needInitializeGraphics = true;
            this._object._updateContentStream(page, stream, option, this._document);
        }
    }
    /**
     * Converts any found redaction annotations into internal redaction regions,
     * creating their appearance streams and removing the original annotations.
     *
     * @private
     * @param {PdfPage} page The page whose annotations are analyzed.
     * @returns {void} nothing.
     */
    _applyRedaction(page: PdfPage): void {
        const redactRegions: PdfRedactionRegion[] = [];
        for (let k: number = 0; k < page.annotations.count; k++) {
            const annotation: PdfAnnotation = page.annotations.at(k);
            if (annotation && annotation instanceof PdfRedactionAnnotation) {
                const redactionAnnotation: PdfRedactionAnnotation = annotation as PdfRedactionAnnotation;
                redactionAnnotation.flatten = true;
                const rotation: PdfRotationAngle = page.rotation;
                if (redactionAnnotation.boundsCollection && redactionAnnotation.boundsCollection.length > 1) {
                    redactionAnnotation.boundsCollection.forEach((rawRect: Rectangle, index: number) => {
                        const normRect: Rectangle = this._calculateRotatedBounds(page, rawRect);
                        const appearance: PdfTemplate = redactionAnnotation._createNormalAppearance(index, normRect, rotation);
                        const redact: PdfRedactionRegion = new PdfRedactionRegion(page._pageIndex, normRect);
                        redact.appearance.normal = appearance;
                        redactRegions.push(redact);
                    });
                } else {
                    const normRect: Rectangle = this._calculateRotatedBounds(page, redactionAnnotation.bounds);
                    const appearance: PdfTemplate = redactionAnnotation._createNormalAppearance(undefined, normRect, rotation);
                    const redact: PdfRedactionRegion = new PdfRedactionRegion(page._pageIndex, normRect);
                    redact.appearance.normal = appearance;
                    redactRegions.push(redact);
                }
                page.annotations.removeAt(k);
                k--;
            }
        }
        if (redactRegions.length > 0) {
            const existingRedactions: PdfRedactionRegion[] = this._redaction.get(page._pageIndex) || [];
            this._redaction.set(page._pageIndex, existingRedactions.concat(redactRegions));
        }
    }
    /**
     * Computes page-space bounds for a rectangle after accounting for page rotation.
     *
     * @private
     * @param {PdfPage} page The page containing the bounds.
     * @param {Rectangle} bounds Unrotated rectangle.
     * @returns {Rectangle} Rotated-normalized rectangle.
     */
    _calculateRotatedBounds(page: PdfPage, bounds: Rectangle): Rectangle {
        const rotation: PdfRotationAngle = page.rotation;
        const pageWidth: number = page.size.width;
        const pageHeight: number = page.size.height;
        switch (rotation) {
        case PdfRotationAngle.angle0:
            return bounds;
        case PdfRotationAngle.angle90:
            return {
                x: pageHeight - (bounds.y + bounds.height),
                y: bounds.x,
                width: bounds.height,
                height: bounds.width
            };
        case PdfRotationAngle.angle180:
            return {
                x: pageWidth - (bounds.x + bounds.width),
                y: pageHeight - (bounds.y + bounds.height),
                width: bounds.width,
                height: bounds.height
            };
        case PdfRotationAngle.angle270:
            return {
                x: bounds.y,
                y: pageWidth - bounds.x - bounds.width,
                width: bounds.height,
                height: bounds.width
            };
        default:
            return bounds;
        }
    }
    /**
     * Appends the given list of redaction regions into the class-wide accumulator.
     *
     * @private
     * @param {PdfRedactionRegion[]} options Redaction regions for a page.
     * @returns {void} nothing.
     */
    _combineBounds(options: PdfRedactionRegion[]): void {
        for (let i: number = 0; i < options.length; i++) {
            this._redactionRegion.push(options[Number.parseInt(i.toString(), 10)]);
        }
    }
    /**
     * Writes a record back to a content stream, optionally replacing text showing operands.
     *
     * @private
     * @param {_PdfRecord[]} recordCollection The record collection for the page content.
     * @param {number} index Current record index.
     * @param {string} updatedText Updated text.
     * @param {_PdfContentStream} stream The destination stream to write to.
     * @returns {void} nothing.
     */
    _optimizeContent(recordCollection: _PdfRecord[], index: number, updatedText: string, stream: _PdfContentStream): void {
        const record: _PdfRecord = recordCollection[Number.parseInt(index.toString(), 10)];
        if (record) {
            if (typeof(record._operands) !== 'undefined' && record._operands.length >= 1) {
                if (record._operator === 'ID') {
                    const builder: string[] = [];
                    for (let k: number = 0; k < record._operands.length; k++) {
                        if (k + 1 < record._operands.length && record._operands[k].indexOf("/") !== -1 && record._operands[k + 1].indexOf("/") !==-1) { // eslint-disable-line
                            builder.push(record._operands[Number.parseInt(k.toString(), 10)], ' ', record._operands[k + 1], '\r\n');
                            k = k + 1;
                        } else if (k + 1 < record._operands.length && record._operands[k].indexOf("/") !== -1) { // eslint-disable-line
                            builder.push(record._operands[Number.parseInt(k.toString(), 10)], ' ', record._operands[k + 1], '\r\n');
                            k = k + 1;
                        } else {
                            builder.push(record._operands[Number.parseInt(k.toString(), 10)], ' ');
                        }
                    }
                    let text: string = builder.join(""); // eslint-disable-line
                    const bytes: number[] = this._getBytes(text);
                    stream.write(bytes);
                } else {
                    for (let i: number = 0; i < record._operands.length; i++) {
                        let operand: string = record._operands[Number.parseInt(i.toString(), 10)];
                        if (record._operator === 'Tj' || record._operator === "'" || record._operator === '\"' || record._operator === 'TJ') { // eslint-disable-line
                            if (updatedText !== '') {
                                operand = updatedText;
                                if (record._operator === "'" || record._operator === '\"') { // eslint-disable-line
                                    stream.write('T*');
                                    stream.write(' ');
                                    if (record._operator === '\"') { // eslint-disable-line
                                        i += 2;
                                    }
                                }
                                record._operator = 'TJ';
                            }
                        }
                        const bytes: number[] = this._getBytes(operand);
                        stream.write(bytes);
                        if (record._operator !== 'Tj' && record._operator !== "'" && record._operator !== '\"' && record._operator !== 'TJ') { // eslint-disable-line
                            stream.write(' ');
                        }
                    }
                }
            } else if (typeof(record._operands) === 'undefined' && typeof(record._inlineImageBytes) !== 'undefined') {
                const numberArray: number[] = Array.from(record._inlineImageBytes);
                stream.write(numberArray);
                stream.write(' ');
            }
            stream.write(record._operator);
        }
        const count: number = recordCollection.length;
        if ((index) < count) {
            if (record._operator === 'ID') {
                stream.write('\n');
            } else if ((record._operator === 'W' || record._operator === 'W*') && recordCollection[index + 1]._operator === 'n') {
                stream.write(' ');
            } else if (record._operator === 'w' || record._operator === 'EI') {
                stream.write(' ');
            } else {
                stream.write('\r\n');
            }
        }
    }
    /**
     * Encodes a JavaScript string into a byte array (UTF-16 code units cast down).
     *
     * @private
     * @param {string} text Input text.
     * @returns {number[]} Byte array of char codes.
     */
    _getBytes(text: string): number[] {
        const bytes: number[] = [];
        for (let i: number = 0; i < text.length; i++) {
            const charCode: number = text.charCodeAt(i);
            bytes.push(charCode);
        }
        return bytes;
    }
    /**
     * Returns whether the given rectangle intersects or lies within any of the provided redaction regions.
     *
     * @private
     * @param {Rectangle} values Candidate rectangle.
     * @param {PdfRedactionRegion[]} redactionBounds Redaction regions list.
     * @returns {boolean} `true` if found; otherwise, `false`.
     */
    _isFoundBounds(values: Rectangle, redactionBounds: PdfRedactionRegion[]): boolean {
        for (const bounds of redactionBounds) {
            if (this._contains(bounds._bounds, [values.x, values.y]) || this._intersectsWith(bounds._bounds, values)) {
                return true;
            }
        }
        return false;
    }
    /* eslint-disable */
    /**
     * Checks if a point lies within an axis-aligned rectangle (inclusive edges).
     *
     * @private
     * @param {{x: number, y: number, width: number, height: number}} bounds Rectangle bounds.
     * @param {number[]} point Point as `[x, y]`.
     * @returns {boolean} `true` if the point is inside; otherwise, `false`.
     */
    _contains(bounds: {x: number, y: number, width: number, height: number}, point: number[]): boolean {
        return (
            point[0] >= bounds.x &&
            point[0] <= bounds.x + bounds.width &&
            point[1] >= bounds.y &&
            point[1] <= bounds.y + bounds.height
        );
    }
    /**
     * Tests two rectangles for intersection.
     *
     * @private
     * @param {{x: number, y: number, width: number, height: number}} rect1 First rectangle.
     * @param {{x: number, y: number, width: number, height: number}} rect2 Second rectangle.
     * @returns {boolean} `true` if they intersect; otherwise, `false`.
     */
    _intersectsWith(rect1: {x: number, y: number, width: number, height: number}, rect2: {x: number, y: number, width: number,
        height: number}): boolean {
        return (rect2.x < rect1.x + rect1.width) && (rect1.x < (rect2.x + rect2.width)) && (rect2.y < rect1.y + rect1.height) &&
        (rect1.y < rect2.y + rect2.height);
    }
    /* eslint-enable */
    /**
     * Splits a hex string literal into chunks, accounting for line-break artifacts.
     *
     * @private
     * @param {string} hexString Hex string literal.
     * @returns {string[]} Array of hex chunks without wrapper.
     */
    _splitHexString(hexString: string): string[] {
        const hexList: string[] = [];
        hexString = hexString.slice(1, -1);
        const size: number = hexString.startsWith('0') ? 4 : 2;
        for (let i: number = 0; i < hexString.length; i += size) {
            let chunk: string = hexString.substring(i, i + size);
            if (chunk.indexOf('\n') !== -1) {
                const extraChar: string = hexString.charAt(i + size);
                chunk += extraChar;
                i++;
            }
            hexList.push(chunk);
        }
        return hexList;
    }
    /**
     * Builds replacement text for glyphs intersecting redaction regions and returns a new TJ array text.
     *
     * @private
     * @param {TextGlyph[]} glyph Glyphs extracted from the operator.
     * @param {string[]} text Decoded text units.
     * @param {string} originalText Original operand text.
     * @param {string[]} decodeText Decoded segments mapped from original text.
     * @returns {string} Updated TJ array text or original if nothing replaced.
     */
    _replacedText(glyph: TextGlyph[], text: string[], originalText: string, decodeText: string[]): string {
        let isReplacedText: boolean = false;
        let isOtherText: boolean = false;
        for (let i: number = 0; i < glyph.length; i++) {
            if (this._isFoundBounds(glyph[Number.parseInt(i.toString(), 10)]._bounds, this._redactionRegion)) {
                isReplacedText = true;
                glyph[Number.parseInt(i.toString(), 10)]._isReplace = true;
            } else {
                isOtherText = true;
                glyph[Number.parseInt(i.toString(), 10)]._text = text[Number.parseInt(i.toString(), 10)];
            }
        }
        let updatedText: string = '';
        if (!isReplacedText && isOtherText) {
            return originalText;
        } else {
            let mainTextCollection: string[] = [];
            if (originalText[0] === '(') {
                mainTextCollection = decodeText;
            } else if (originalText[0] === '[') {
                mainTextCollection = decodeText;
            } else if (originalText[0] === '<') {
                mainTextCollection = decodeText;
                this._isHex = true;
            }
            const map: _TextGlyphMapper[] = this._mapString(mainTextCollection, glyph);
            for (let i: number = 0; i < map.length; i++) {
                map[Number.parseInt(i.toString(), 10)]._isHex = this._isHex;
                updatedText += map[Number.parseInt(i.toString(), 10)]._getText();
            }
            updatedText = '[' + updatedText + ']';
            this._isHex = false;
        }
        return updatedText;
    }
    /**
     * Maps decoded text segments to glyph slices while preserving substring boundaries.
     *
     * @private
     * @param {string[]} mainTextCollection Text segments.
     * @param {TextGlyph[]} imageGlyph Full glyph list aligned with extracted text.
     * @returns {_TextGlyphMapper[]} Mapped text-glyph segments.
     */
    _mapString(mainTextCollection: string[], imageGlyph: TextGlyph[]): _TextGlyphMapper[] {
        const mappedString: _TextGlyphMapper[] = [];
        const glyphList: TextGlyph[] = imageGlyph;
        let startIndex: number = 0;
        for (let i: number = 0; i < mainTextCollection.length; i++) {
            const endChar: number = mainTextCollection[Number.parseInt(i.toString(), 10)].length - 1;
            if (mainTextCollection[Number.parseInt(i.toString(), 10)][0] !== '(' && mainTextCollection[
                Number.parseInt(i.toString(), 10)][Number.parseInt(endChar.toString(), 10)] !== ')') {
                const mapping: _TextGlyphMapper = new _TextGlyphMapper();
                mapping.text = mainTextCollection[Number.parseInt(i.toString(), 10)];
                mappedString.push(mapping);
            } else {
                const mapping: _TextGlyphMapper = new _TextGlyphMapper();
                mapping.text = mainTextCollection[Number.parseInt(i.toString(), 10)];
                let text: string = mainTextCollection[Number.parseInt(i.toString(), 10)];
                const subString: boolean = text.length >= 2;
                const start: boolean = text.startsWith('(');
                const end: boolean = text.endsWith(')');
                if (subString && start && !end) {
                    text = text.substring(1, text.length);
                } else if (subString && !start && end) {
                    text = text.substring(0, text.length - 1);
                } else if (subString) {
                    text = text.substring(1, text.length - 1);
                } else {
                    continue;
                }
                const length: number = text.length;
                mapping.glyph = glyphList.slice(startIndex, startIndex + length);
                startIndex += length;
                mappedString.push(mapping);
            }
        }
        return mappedString;
    }
}
