import { _MatrixHelper, _TransformationStack } from './text-extraction/matrix-helper';
import { TextGlyph, TextLine, TextWord } from './text-structure';
import { _PdfContentParserHelper } from './content-parser-helper';
import { _GraphicState } from './graphic-state';
import { _FontStructure } from './text-extraction/font-structure';
import { PdfTagType } from './text-extraction/enumerator';
import { _TextProcessingMode } from './enum';
import { _addFontResources, _getXObject, _getXObjectResources, _ignoreEscapeSequence, _isArrayEqual, _parseEncodedText, canvasRenderCallback } from './utils';
import { PdfDocument, _PdfDictionary, _PdfReference, PdfPage, PdfPath, _ContentParser, _PdfRecord, _PdfCrossReference, PdfFontStyle, PdfRotationAngle, _PdfName, Rectangle } from '@syncfusion/ej2-pdf';
import { _PdfTextParser } from './pdf-text-parser';
import { PdfStructureElement } from './pdf-structure-element';
import { PdfEmbeddedImage } from './image-extraction/pdf-embedded-image';

/**
 * Represents a utility for extracting data from a PDF document.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data, password);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract `TextLine` from the PDF document.
 * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class PdfDataExtractor {
    _document: PdfDocument;
    _rotation: number = 0;
    _textMatrix: _MatrixHelper;
    _textLeading: number = 0;
    _textColor: number[] = [0, 0, 0];
    _textLineMatrix: _MatrixHelper;
    _extractedText: string = '';
    _hasLeading: boolean;
    _hasNoSpacing: boolean;
    _textLines: TextLine[] = [];
    _transformations: _TransformationStack;
    _identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
    _currentLocation: number[] = [0, 0]
    _currentFont: string;
    _tempBoundingRectangle: Rectangle;
    _boundingRectangle: Rectangle = {x: 0, y: 0, width: 0 , height: 0};
    _previousRect: Rectangle = {x: 0, y: 0, width: 0 , height: 0};
    _fontSize: number;
    _textHorizontalScaling: number = 100;
    _previousTextMatrix: _MatrixHelper = new _MatrixHelper(0, 0, 0, 0, 0, 0);
    _previousFontSize: number;
    _previousExtractText: string;
    _arise: number = 0;
    _isTextMatrix: boolean;
    _currentTextMatrix: _MatrixHelper = new _MatrixHelper(0, 0, 0, 0, 0, 0);
    _text: string = '';
    _hasTj: boolean;
    _hasTm: boolean;
    _hasET: boolean;
    _characterSpacing: number = 0;
    _wordSpacing: number = 0;
    _hasBeginMarkedContent: boolean;
    _differenceX: number;
    _textScale: number = 1;
    _textRise: number = 0;
    _width: number = 0;
    _height: number = 0;
    _crossReference: _PdfCrossReference;
    _resultantText: string = '';
    _currentExtractedText: string;
    _initialTransForm: _MatrixHelper;
    _textGlyph: TextGlyph[] = [];
    _textWord: TextWord[] = [];
    _textLine: TextLine[] = []
    _textExtraction: string[] = [];
    _fontCollection: Map<string, _FontStructure> = new Map<string, _FontStructure>();
    _ctm: _MatrixHelper = new _MatrixHelper(1, 0, 0, 1, 0, 0);
    _objects: _MatrixHelper[] = [];
    _isLayout: boolean = false;
    _isRotatePage: boolean = false;
    _isExtractTextLines: boolean;
    _contentParser: _PdfContentParserHelper;
    _parser: _PdfTextParser = new _PdfTextParser();
    _structureElement: PdfStructureElement;
    _referenceCollection: _PdfReference[];
    _elementOrder: number = 0;
    _pageElements: PdfStructureElement[] = [];
    _elementCollection: PdfStructureElement[] = [];
    _orderSet: Set<number> = new Set<number>();
    _mcidTextMap: Map<number, string[]> = new Map<number, string[]>();
    _extractTaggedText: boolean = false;
    _currentContentId: number;
    _elementBoundsMap: Map<number[], number> = new Map<number[], number>();
    _hasContentID: boolean  = false;
    _imageInfo: PdfEmbeddedImage[] = [];
    _canvasRenderCallback: canvasRenderCallback;
    /**
     * Initialize a new instance of the `PdfDataExtractor` class
     *
     * @param {PdfDocument} document PDF document to get pages
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * let data: Uint8Array = imageInfo.data;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    constructor(document: PdfDocument);
    /**
     * Initialize a new instance of the `PdfDataExtractor` class
     *
     * @param {PdfDocument} document PDF document to get pages
     * @param {Function} callBack - A callback function that returns a canvas element for rendering.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Define a canvas render callback that returns a canvas
     * const canvasRenderCallback = (): HTMLCanvasElement => {
     *     const canvas = document.createElement('canvas');
     *     return canvas;
     * };
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document, callBack: canvasRenderCallback);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * let data: Uint8Array = imageInfo.data;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    constructor(document: PdfDocument, callBack: canvasRenderCallback);
    constructor(document: PdfDocument, callBack?: canvasRenderCallback) {
        this._document = document;
        if (document) {
            this._crossReference = document._crossReference;
        }
        if (callBack) {
            this._canvasRenderCallback = callBack;
        }
        this._objects.push(this._ctm);
    }
    /**
     * Extract text from the PDF document
     *
     * @returns {string} The extracted text
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data1);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract text content from the PDF document.
     * let text: string = extractor.extractText();
     * // Save the output PDF
     * document.save(‘Output.pdf’);
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    extractText(): string
    /**
     * Extract text from the page ranges specified by start and end page number
     *
     * @param {object} options Options to specify the page range to be selected and to extract the text.
     * @returns {string} The extracted text
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data1);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract text content from the PDF document.
     * let text: string = extractor.extractText({ startPageIndex: 0, endPageIndex: document.pageCount - 1 });
     * // Save the output PDF
     * document.save(‘Output.pdf’);
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    extractText(options: { isLayout?: boolean; startPageIndex?: number; endPageIndex?: number }): string
    extractText(options?: { isLayout?: boolean; startPageIndex?: number; endPageIndex?: number }): string {
        let startIndex: number = 0;
        let endIndex: number = this._document.pageCount - 1;
        this._resultantText = '';
        if (options) {
            if (options.isLayout) {
                this._isLayout = true;
            }
            this._contentParser = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
            if (options.startPageIndex !== null && typeof options.startPageIndex === 'number') {
                startIndex = options.startPageIndex;
            }
            if (options.endPageIndex !== null && typeof options.endPageIndex === 'number') {
                endIndex = options.endPageIndex;
            }
        }
        this._processPages(startIndex, endIndex);
        if (this._resultantText.length) {
            this._resultantText = _ignoreEscapeSequence(this._resultantText);
        }
        this._isLayout = false;
        return this._resultantText;
    }
    _renderTextAsLayOut(recordCollection: _PdfRecord[],  page: PdfPage, fontCollection: Map<string, _FontStructure>, xObjectCollection: Map<string, any>): any { //eslint-disable-line
        const currentTd: number[] = [];
        let currentYLocation: number;
        let hexElement: string[];
        let spaceBetweenWord: boolean = false;
        let differenceX: number = 0;
        let currentCmY: number = 0;
        let prevCmY: number = 0;
        this._hasTm = false;
        this._hasET = false;
        this._hasBeginMarkedContent = false;
        this._hasTj = false;
        let textlineMatrix: _MatrixHelper = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        let prevYLocation: number;
        const structElement: PdfStructureElement = new PdfStructureElement();
        this._initialTransForm = new _MatrixHelper(1.3333333333333333, 0, 0, -1.3333333333333333, 0, page.size.height * 1.3333333333333333);
        const mcidTextMap: Map<number, string[]> = new Map();
        recordCollection.forEach((record: _PdfRecord) => {
            const token: string = record._operator;
            const element: string[] = record._operands;
            let a: number;
            let b: number;
            let c: number;
            let d: number;
            let e: number;
            let f: number;
            let red: number;
            let green: number;
            let blue: number;
            let endTextPosition: number;
            let current: number;
            let prev: number;
            let locationY: number;
            let difference: number;
            switch (token) {
            case 'q':
                this._hasET = false;
                this._objects.unshift(this._objects[0]);
                this._ctm = this._objects[0];
                break;
            case 'Q':
                this._objects.splice(0, 1);
                this._ctm = this._objects[0];
                break;
            case 'Tc':
                this._characterSpacing = Number(element[0]);
                break;
            case 'Tw':
                this._wordSpacing = Number(element[0]);
                break;
            case 'Tm':
                this._hasTm = true;
                a = Number(element[0]);
                b = Number(element[1]);
                c = Number(element[2]);
                d = Number(element[3]);
                e = Number(element[4]);
                f = Number(element[5]);
                this._textMatrix = new _MatrixHelper(a, b, c, d, e, f);
                this._textLineMatrix = this._textMatrix;
                this._currentLocation = [0, 0];
                this._isTextMatrix = true;
                textlineMatrix = this._textLineMatrix;
                if (this._textMatrix._offsetY === this._textLineMatrix._offsetY &&
                     this._textMatrix._offsetX !== this._textLineMatrix._offsetX) {
                    this._textLineMatrix = this._textMatrix;
                }
                if (this._textLineMatrix._offsetY !== this._currentTextMatrix._offsetY ||
                    ((this._textLineMatrix._offsetX !== this._currentTextMatrix._offsetX) && this._hasBeginMarkedContent && !this._hasTj))
                {
                    this._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 } ;
                    this._hasBeginMarkedContent = false;
                }
                break;
            case 'Tf':
                this._renderFont(element);
                break;
            case 'TL':
                this._textLeading = -Number(element);
                break;
            case 'T*':
                this._moveToNextLine(0, this._textLeading, textlineMatrix);
                textlineMatrix = this._textLineMatrix;
                break;
            case 'BT':
                this._textMatrix = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                this._textLineMatrix = textlineMatrix = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
                break;
            case 'ET':
                this._hasET = true;
                endTextPosition = (this._textLineMatrix._offsetX - (this._tempBoundingRectangle.width + this._tempBoundingRectangle.x))
                                   / 10;
                if (this._isLayout && this._hasLeading && endTextPosition === 0 && this._hasNoSpacing) {
                    this._resultantText += String.fromCharCode(32);
                    this._tempBoundingRectangle = {x: 0, y: 0, width: 0 , height: 0};
                    this._hasLeading = false;
                }
                this._currentLocation = [];
                if (this._isTextMatrix) {
                    this._isTextMatrix = false;
                }
                this._characterSpacing = 0;
                this._wordSpacing = 0;
                break;
            case 're':
                break;
            case 'cm':
                a = parseFloat(element[0]);
                b = parseFloat(element[1]);
                c = parseFloat(element[2]);
                d = parseFloat(element[3]);
                e = parseFloat(element[4]);
                f = parseFloat(element[5]);
                this._hasET = false;
                currentCmY = Number(element[5]);
                current = currentCmY;
                prev = prevCmY;
                this._ctm = new _MatrixHelper(a, b, c, d, e, f)._multiply(this._objects[0]);
                this._objects[0] = this._ctm;
                locationY = (current - prev) / 10;
                if ((current !== prev) && this._hasTm && (locationY < 0 || locationY >= 1)) {
                    this._resultantText += '\r\n';
                    this._hasTm = false;
                }
                prevCmY = currentCmY;
                break;
            case 'BDC':
            {
                this._hasBeginMarkedContent = true;
                this._hasET = true;
                hexElement = element;
                const markedContentId: number = structElement._parseContent(element);
                if (this._currentContentId !== markedContentId) {
                    this._currentContentId = markedContentId;
                }
                if (!mcidTextMap.has(this._currentContentId)) {
                    mcidTextMap.set(this._currentContentId, []);
                }
                break;
            }
            case 'TD':
                this._setTextLeading(Number(-element[1]));
                this._moveToNextLine(Number(element[0]), Number(element[1]), textlineMatrix);
                textlineMatrix = this._textLineMatrix;
                if (this._textLineMatrix._offsetY !== this._currentTextMatrix._offsetY ||
                    (this._hasBeginMarkedContent && this._textLineMatrix._offsetX !== this._currentTextMatrix._offsetX && !this._hasTj)) {
                    this._tempBoundingRectangle = {x: 0, y: 0, width: 0, height: 0};
                    this._hasBeginMarkedContent = false;
                }
                break;
            case 'Td':
                this._moveToNextLine(Number(element[0]), Number(element[1]), textlineMatrix);
                textlineMatrix = this._textLineMatrix;
                if (this._textLineMatrix._offsetY !== this._currentTextMatrix._offsetY ||
                     (this._hasBeginMarkedContent && this._textLineMatrix._offsetX !== this._currentTextMatrix._offsetX)) {
                    this._tempBoundingRectangle = {x: 0, y: 0, width: 0, height: 0};
                    this._hasBeginMarkedContent = false;
                }
                if (Math.abs(this._textLineMatrix._offsetX - this._currentTextMatrix._offsetX) > 0 && !spaceBetweenWord && this._hasTj) {
                    this._differenceX = Math.abs(this._textLineMatrix._offsetX - this._currentTextMatrix._offsetX);
                    spaceBetweenWord = true;
                }
                currentTd[0] = Number(element[0]);
                currentTd[1] = Number(element[1]);
                break;
            case 'Tz':
                this._textHorizontalScaling = Number(element[0]);
                break;
            case "'": // eslint-disable-line
            {
                this._moveToNextLine(0, this._textLeading, textlineMatrix);
                textlineMatrix = this._textLineMatrix;
                currentYLocation = this._textMatrix._offsetY;
                this._hasNoSpacing = false;
                difference = 0;
                if (this._fontSize >= 10) {
                    difference = Math.round((currentYLocation - prevYLocation) / 10);
                } else {
                    difference = Math.round((currentYLocation - prevYLocation) / this._fontSize);
                }
                if (difference < 0) {
                    difference = -difference;
                }
                this._hasLeading = true;
                if (prevYLocation !== 0 && difference >= 1) {
                    this._resultantText += '\r\n';
                }
                const currentXPosition: number = Math.floor(this._textLineMatrix._offsetX);
                const prevXPosition: number = Math.floor(this._currentTextMatrix._offsetX);
                if ((prevXPosition - currentXPosition) > 0) {
                    this._hasNoSpacing = true;
                }
                const backUpMatrix: _MatrixHelper = this._textLineMatrix;
                if (this._isRotatePage) {
                    this._buildTextContentStream(element, page, fontCollection);
                } else {
                    this._currentExtractedText = this._renderTextElementFromTJ(element, page, fontCollection);
                }
                prevYLocation = currentYLocation;
                if (this._isLayout) {
                    this._resultantText += this._currentExtractedText;
                } else {
                    this._textLineMatrix = backUpMatrix;
                }
                this._currentTextMatrix = this._textLineMatrix;
                this._textMatrix = this._textLineMatrix;
                if (this._currentContentId !== null && typeof this._currentContentId !== 'undefined') {
                    const text: string = this._currentExtractedText;
                    const textCollection: string[] = mcidTextMap.get(this._currentContentId);
                    if (text && textCollection) {
                        textCollection.push(text);
                    }
                }
                break;
            }
            case 'TJ':
                currentYLocation = this._textMatrix._offsetY;
                difference = 0;
                if (this._fontSize >= 10) {
                    difference = Math.round((currentYLocation - prevYLocation) / 10);
                } else {
                    difference = Math.round((currentYLocation - prevYLocation) / this._fontSize);
                }
                if (difference < 0) {
                    difference = -difference;
                }
                if (spaceBetweenWord) {
                    if (differenceX > this._fontSize) {
                        differenceX = 0;
                    }
                    spaceBetweenWord = false;
                }
                this._hasTj =  true;
                if (prevYLocation !== 0 && difference >= 1) {
                    this._resultantText += '\r\n';
                }
                if (this._isRotatePage) {
                    this._buildTextContentStream(element, page, fontCollection);
                } else {
                    this._currentExtractedText = this._renderTextElementFromTJ(element, page, fontCollection);
                }
                prevYLocation = currentYLocation;
                if (this._isLayout) {
                    this._resultantText += this._currentExtractedText;
                }
                this._currentTextMatrix = this._textLineMatrix;
                this._text += this._currentExtractedText;
                if (this._isLayout && this._textLineMatrix._m11 !== -1 && this._textLineMatrix._m22 !== 1) {
                    this._resultantText += ' ';
                }
                this._textMatrix = this._textLineMatrix;
                this._hasET = false;
                this._hasBeginMarkedContent = true;
                if (this._currentContentId !== null && typeof this._currentContentId !== 'undefined') {
                    const text: string = this._currentExtractedText;
                    const textCollection: string[] = mcidTextMap.get(this._currentContentId);
                    if (text && textCollection) {
                        textCollection.push(text);
                    }
                }
                break;
            case 'Tj':
                {
                    currentYLocation = this._textMatrix._offsetY;
                    let difference: number = 0;
                    let hex: string = '';
                    let hexChar: string = '';
                    if (this._fontSize >= 10) {
                        difference = Math.round((currentYLocation - prevYLocation) / 10);
                    } else {
                        difference = Math.round((currentYLocation - prevYLocation) / this._fontSize);
                    }
                    if (difference < 0) {
                        difference = -difference;
                    }
                    if (spaceBetweenWord) {
                        if (differenceX > this._fontSize) {
                            differenceX = 0;
                        }
                        if (typeof(hexElement) !== 'undefined' && hexElement.length > 1) {
                            hexElement[1] = hexElement[1].replace(/^</, '');
                            hex = hexElement[1].replace(/>$/, '');
                            hexChar = element[0].replace(/^\(|\)$/g, '');
                            if (hex !== '' && hex.indexOf('<') !== -1 && hexChar.length === 1 && /^[a-zA-Z]$/.test(hexChar)) {
                                this._hasET = false;
                            }
                        }
                        if (this._hasET) {
                            this._resultantText += ' ';
                        }
                        this._hasET = false;
                        spaceBetweenWord = false;
                    }
                    this._hasTj = true;
                    if (prevYLocation !== 0 && difference >= 1) {
                        this._resultantText += '\r\n';
                    }
                    if (this._isRotatePage) {
                        this._buildTextContentStream(element, page, fontCollection);
                    } else {
                        this._currentExtractedText = this._renderTextElementFromTJ(element, page, fontCollection);
                    }
                    this._currentTextMatrix = this._textLineMatrix;
                    prevYLocation = currentYLocation;
                    this._previousExtractText = this._currentExtractedText;
                    if (this._previousTextMatrix._offsetY !== 0 && this._currentTextMatrix._offsetY !== 0 &&
                         this._previousTextMatrix._offsetY + this._previousFontSize > this._currentTextMatrix._offsetY + this._fontSize &&
                        this._previousTextMatrix._offsetY < this._currentTextMatrix._offsetY) {
                        if (this._resultantText.length >= 2 && this._resultantText.slice(-2) === '\r\n') {
                            this._resultantText = this._resultantText.slice(0, -2);
                        }
                    }
                    this._previousFontSize = this._fontSize;
                    if (this._isLayout) {
                        this._resultantText += this._currentExtractedText;
                    }
                    this._textMatrix = this._textLineMatrix;
                    this._previousTextMatrix = this._textLineMatrix;
                    if (this._currentContentId !== null && typeof this._currentContentId !== 'undefined') {
                        const text: string = this._currentExtractedText;
                        const textCollection: string[] = mcidTextMap.get(this._currentContentId);
                        if (text && textCollection) {
                            textCollection.push(text);
                        }
                    }
                }
                break;
            case 'Do':
                _getXObject(element, page, xObjectCollection, this);
                break;
            case 'RG':
            case 'k':
            case 'g':
            case 'rg':
                red = Number(element[0]);
                green = Number(element[1]);
                blue = Number(element[2]);
                this._textColor = [red, green, blue];
            }
        });
        if (mcidTextMap && mcidTextMap.size > 0) {
            this._mcidTextMap = mcidTextMap;
        }
    }
    _renderText(page: PdfPage, fontCollection: Map<string, _FontStructure>, xObjectCollection: Map<string, any>, graphicState: _GraphicState, imageExtraction?: boolean): any { // eslint-disable-line
        if (!(this._contentParser)) {
            this._contentParser = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        }
        const recordCollection: _PdfRecord[] = this._contentParser._getPageRecordCollection(page);
        let text: any; // eslint-disable-line
        if (this._isLayout) {
            this._renderTextAsLayOut(recordCollection, page, fontCollection, xObjectCollection);
        } else if (this._isExtractTextLines) {
            text = this._contentParser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            this._textLine = text;
        } else if (this._extractTaggedText) {
            text = this._contentParser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            this._textLine = text;
            this._renderTextAsLayOut(recordCollection, page, fontCollection, xObjectCollection);
        } else {
            text = this._contentParser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            this._resultantText = text;
        }
    }
    async _extractImagcollection(page: PdfPage, fontCollection: Map<string, _FontStructure>,
        xObjectCollection: Map<string, any>, graphicState: _GraphicState): Promise<any> { // eslint-disable-line
        const recordCollection: _PdfRecord[] = this._contentParser._getPageRecordCollection(page);
        this._imageInfo = await this._contentParser._processImageRecordCollection(recordCollection, page, fontCollection,
                                                                                  xObjectCollection, graphicState,
                                                                                  this._canvasRenderCallback);
    }
    _setTextLeading(textLeading: number): void {
        this._textLeading = -textLeading;
    }
    _moveToNextLine(tx: number, ty: number, textLineMatrix: _MatrixHelper): void {
        const matrix: _MatrixHelper = new _MatrixHelper(1, 0 , 0, 1, tx, ty);
        this._textLineMatrix = this._textMatrix = matrix._multiply(textLineMatrix);
    }
    _updateTextMatrix(tj: number): _MatrixHelper {
        const x: number = - (tj * 0.001 * this._fontSize * this._textHorizontalScaling / 100);
        const point: number[] = this._textLineMatrix._transform(0.0, 0.0);
        const point2: number[] = this._textLineMatrix._transform(x, 0.0);
        if (point[0] !== point2[0]) {
            this._textLineMatrix._offsetX = point2[0];
        } else {
            this._textLineMatrix._offsetY = point2[1];
        }
        return this._textLineMatrix;
    }
    _updateTextLineMatrix(char: string, width: number): void {
        let wordSpacing: number = 0;
        if (char.indexOf(' ') !== -1) {
            wordSpacing = this._wordSpacing;
        }
        const offsetX: number = (width * this._fontSize + this._characterSpacing + wordSpacing) * (this._textHorizontalScaling / 100);
        const matrix: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, offsetX, 0.0);
        const result: _MatrixHelper = matrix._multiply(this._textLineMatrix);
        this._textLineMatrix = result;
    }
    _renderTextElementFromTJ(elements: string[], page: PdfPage, fontCollection: Map<string, _FontStructure>): string {
        let extractedText: string = '';
        const curretFont: _FontStructure = fontCollection.get(this._currentFont);
        let textValues: string[] = [];
        let widthTable: number[][] = [];
        this._textWord = [];
        let charWidth: number = 0;
        let k: number = 0;
        const textMarix: _MatrixHelper =  new _MatrixHelper(this._textMatrix._m11, this._textMatrix._m12, this._textMatrix._m21,
                                                            this._textMatrix._m22, this._textMatrix._offsetX, this._textMatrix._offsetY);
        const decodedList: [string[], number[][]] = _parseEncodedText(elements[0], curretFont);
        textValues = decodedList[0];
        widthTable = decodedList[1];
        this._previousRect = {x: 0, y: 0, width: 0 , height: 0};
        for (let j: number = 0; j < textValues.length; j++) {
            const word: string = textValues[Number.parseInt(j.toString(), 10)];
            const tj: number = Number(word);
            if (Number(word)) {
                this._textLineMatrix = this._updateTextMatrix(tj);
                if (Math.round(this._textLineMatrix._offsetX - this._textMatrix._offsetX) > 1 && !this._hasBeginMarkedContent) {
                    extractedText += String.fromCharCode(32);
                }
            } else {
                let text: string = word.slice(0, -1);
                text = _ignoreEscapeSequence(text);
                for (let i: number = 0; i < text.length; i++) {
                    const ch: string = text[Number.parseInt(i.toString(), 10)];
                    let matrixTransform: _MatrixHelper = new _MatrixHelper(1, 0, 0, 1, 0, 0);
                    this._textMatrix = this._getTextRenderingMatrix();
                    let identity: _MatrixHelper = new _MatrixHelper(1, 0, 0, 1, 0, 0);
                    identity = identity._scale(0.01, 0.01, 0.0, 0.0);
                    identity = identity._translate(0.0, 1.0);
                    this._transformations = new _TransformationStack(this._initialTransForm);
                    this._transformations._pushTransform(identity._multiply(this._textMatrix));
                    const transform: _MatrixHelper = matrixTransform;
                    let matrix: _MatrixHelper = transform._clone();
                    const mat: _MatrixHelper = this._transformations._CurrentTransform;
                    matrix = matrix._multiply(mat);
                    matrixTransform = matrix;
                    let tempFontSize: number = 0;
                    if (this._textMatrix._m11 > 0) {
                        tempFontSize = this._textMatrix._m11;
                    } else if (this._textMatrix._m12 !== 0 && this._textMatrix._m21 !== 0) {
                        if (this._textMatrix._m12 < 0) {
                            tempFontSize = -this._textMatrix._m12;
                        } else {
                            tempFontSize = this._textMatrix._m12;
                        }
                    }
                    let height: number = 0;
                    if (curretFont._isType3Font) {
                        height = this._getTextHeight(curretFont, textMarix);
                    }
                    const width: number = widthTable[Number.parseInt(k.toString(), 10)][Number.parseInt(i.toString(), 10)];
                    let scale: number;
                    if (curretFont._fontMatrix) {
                        scale = curretFont._fontMatrix[0];
                    } else {
                        scale = 0.001;
                    }
                    this._boundingRectangle.x = (matrix._offsetX / 1.3333333333333333) / 1.0;
                    if (this._isLayout) {
                        charWidth = this._parser._getCharacterWidth((scale * width), curretFont);
                    } else {
                        charWidth = scale * width;
                    }
                    this._boundingRectangle.width = charWidth * tempFontSize;
                    if (!curretFont._isType3Font) {
                        this._boundingRectangle.y = ((matrix._offsetY / 1.3333333333333333) - ((tempFontSize * 1.0) /
                        1.3333333333333333)) / 1.0;
                        this._boundingRectangle.height = tempFontSize;
                    } else {
                        this._boundingRectangle.y = ((matrix._offsetY / 1.3333333333333333) - ((height * 1.0) / 1.3333333333333333))
                        / 1.0;
                        this._boundingRectangle.height = height;
                    }
                    const right: number = this._tempBoundingRectangle.x + this._tempBoundingRectangle.width;
                    if (this._tempBoundingRectangle) {
                        const boundDifference: number = Math.round((this._boundingRectangle.x - right) / 10);
                        if ((right !== 0 && this._boundingRectangle.x !== 0) && (boundDifference > 1)) {
                            extractedText += String.fromCharCode(32);
                        }
                    }
                    extractedText += ch;
                    this._updateTextLineMatrix(ch, charWidth);
                    this._transformations._popTransform();
                    this._tempBoundingRectangle = this._boundingRectangle;
                    this._textMatrix = new _MatrixHelper(this._textLineMatrix._m11, this._textLineMatrix._m12, this._textLineMatrix._m21,
                                                         this._textLineMatrix._m22, this._textLineMatrix._offsetX,
                                                         this._textLineMatrix._offsetY);
                }
                if (text.length > 0) {
                    k++;
                }
            }
        }
        return extractedText;
    }
    _getTextHeight(font: _FontStructure, textMatrix: _MatrixHelper): number {
        const tsm: number[] = [this._fontSize * this._textHorizontalScaling / 100, 0, 0, this._fontSize, 0, this._arise];
        if (this._fontSize <= 1 && !_isArrayEqual(font._fontMatrix, [0.001, 0, 0, 0.001, 0, 0])) {
            const glyphHeight: number = font._boundingBox[3] - font._boundingBox[1];
            if (glyphHeight > 0) {
                tsm[3] *= glyphHeight * font._fontMatrix[3];
            }
        }
        const currentTextMatrix: number[] = [textMatrix._m11, textMatrix._m12, textMatrix._m21,
            textMatrix._m22, textMatrix._offsetX, textMatrix._offsetY];
        const ctm: number[] = [this._ctm._m11, this._ctm._m12, this._ctm._m21,
            this._ctm._m22, this._ctm._offsetX, this._ctm._offsetY];
        const matrix: number[] = this._transform(currentTextMatrix, tsm);
        const transform: number[] = this._transform(ctm, matrix);
        const height: number = Math.hypot(transform[2], transform[3]);
        return height;
    }
    _transform(m1: number[], m2: number[]): number[] {
        return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3]
            , m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
    }
    _buildTextContentStream(elements: string[], page: PdfPage, fontCollection: Map<string, _FontStructure>): void {
        const curretFont: _FontStructure = fontCollection.get(this._currentFont);
        let textValues: string[] = [];
        this._textWord = [];
        let tempString: string = '';
        const decodedList: [string[], number[][]] = _parseEncodedText(elements[0], curretFont);
        textValues = decodedList[0];
        let iszerspace: boolean = false;
        let text: string = '';
        let str: string = '';
        this._previousRect = {x: 0, y: 0, width: 0 , height: 0};
        for (let j: number = 0; j < textValues.length; j++) {
            const word: string = textValues[Number.parseInt(j.toString(), 10)];
            const digit: any = Number(word); // eslint-disable-line
            if (digit) {
                tempString = this._getTextWidth(text, Number(word) * -0.001, curretFont, page, tempString);
            } else if (digit !== 0) {
                text = word.slice(0, -1);
                if (iszerspace) {
                    text = str + text;
                    iszerspace = false;
                }
            } else {
                iszerspace = true;
                str = text;
            }
        }
        if (text.length > 0) {
            tempString = this._getTextWidth(text, 0, curretFont, page , tempString);
        }
        if (tempString !== '') {
            const textWord: TextWord = new TextWord();
            textWord._text = tempString;
            textWord._glyphs = this._textGlyph;
            if (this._isRotatePage) {
                textWord._bounds = {x: this._textGlyph[0]._bounds.x, y: this._textGlyph[0]._bounds.y,
                    width: this._textGlyph[0]._bounds.width, height: this._height};
            } else {
                textWord._bounds = {x: this._textGlyph[0]._bounds.x, y: this._textGlyph[0]._bounds.y, width: this._width,
                    height: this._textGlyph[0]._bounds.width};
            }
            textWord._fontName = curretFont._name;
            textWord._fontStyle = curretFont._fontStyle;
            textWord._fontSize = this._fontSize;
            this._textWord.push(textWord);
            this._height = 0;
        }
        this._width = 0;
        this._textGlyph = [];
        const textLine1: TextLine = new TextLine();
        textLine1._text = this._extractedText;
        textLine1._wordCollection = this._textWord;
        textLine1._fontName = curretFont._name;
        textLine1._fontStyle = curretFont._fontStyle;
        textLine1._fontSize = this._fontSize;
        textLine1._pageIndex = page._pageIndex;
        const pdfPath: PdfPath = new PdfPath();
        for (let i: number = 0; i < this._textWord.length; i++) {
            pdfPath.addRectangle(this._textWord[Number.parseInt(i.toString(), 10)]._bounds);
        }
        const pathBounds: number[] = pdfPath._getBounds();
        textLine1._bounds = {x: pathBounds[0], y: pathBounds[1], width: pathBounds[2], height: pathBounds[3]};
        this._textLine.push(textLine1);
        this._textExtraction.push(this._extractedText);
        this._extractedText = '';
    }
    _getTextWidth(text: string, extraSpacing: number, currentFont: _FontStructure, page: PdfPage, tempString: string): string {
        let scale: number = 0;
        if (currentFont._fontMatrix) {
            scale = currentFont._fontMatrix[0] * this._fontSize;
        } else {
            scale = 0.001 * this._fontSize;
        }
        let g: any = currentFont._charsToGlyphs(text); // eslint-disable-line
        for (let i: number = 0; i < g.length; i++) {
            const glyph: string = g[Number.parseInt(i.toString(), 10)]._unicode;
            let charSpacing: number = this._characterSpacing + (i + 1 === text.length ? extraSpacing : 0 );
            let tempFontSize: number = 0;
            if (this._textMatrix._m11 > 0) {
                tempFontSize = this._textMatrix._m11;
            } else if (this._textMatrix._m12 !== 0 && this._textMatrix._m21 !== 0) {
                if (this._textMatrix._m12 < 0) {
                    tempFontSize = -this._textMatrix._m12;
                } else {
                    tempFontSize = this._textMatrix._m12;
                }
            }
            const width: number = g[Number.parseInt(i.toString(), 10)]._width;
            const w: number = scale * width * tempFontSize;
            if (tempFontSize < this._fontSize) {
                tempFontSize = this._fontSize;
            }
            let charWidth: number;
            let charHeight: number;
            const scaledDim: number = scale * width * (this._textHorizontalScaling / 100);
            this._boundingRectangle.x = this._textMatrix._offsetY;
            this._boundingRectangle.y = this._textMatrix._offsetX;
            if (glyph === ' ') {
                charWidth = w + this._wordSpacing;
                charSpacing += scaledDim + this._wordSpacing;
                this._textMatrix = this._parser._translateTextMatrix(charSpacing * (this._textHorizontalScaling / 100), 0,
                                                                     this._textMatrix);
            } else {
                charWidth = w;
            }
            if (this._textMatrix._m11 > 0) {
                charHeight = tempFontSize;
            } else {
                charHeight = -(tempFontSize);
            }
            if (this._textMatrix._m11 <= 0 && this._textMatrix._m22 <= 0) {
                this._boundingRectangle.width = charWidth;
                this._boundingRectangle.height = charHeight;
            } else {
                this._boundingRectangle.width = charHeight;
                this._boundingRectangle.height = charWidth;
            }
            if (glyph !== ' ') {
                this._textMatrix = this._parser._translateTextMatrix(scaledDim, 0, this._textMatrix);
            }
            this._extractedText += glyph;
            tempString = this._splitWords(glyph, tempString, currentFont._name, currentFont._fontStyle, page);
            if (this._previousRect) {
                this._previousRect = {x: this._boundingRectangle.x, y: this._boundingRectangle.y,
                    width: this._boundingRectangle.width, height: this._boundingRectangle.height};
            } else {
                this._previousRect = {x: 0, y: 0, width: 0 , height: 0};
            }
            if (glyph === ' ') {
                continue;
            }
            if (charSpacing) {
                this._textMatrix = this._parser._translateTextMatrix(charSpacing * (this._textHorizontalScaling / 100), 0,
                                                                     this._textMatrix);
            }
        }
        return tempString;
    }
    _splitWords(glyph: string, tempString: string, fontName: string, fontStyle: PdfFontStyle , page: PdfPage,
                rotation?: number, textColor?: number[]): string {
        let isSpace: boolean = false;
        if (/\s/.test(glyph)) {
            isSpace = true;
        }
        const currentRect: Rectangle = this._boundingRectangle;
        const addTextWord: any = (text: string, glyphs: TextGlyph[], width: number) => { //eslint-disable-line
            const textWord: TextWord = new TextWord();
            textWord._text = text;
            textWord._glyphs = glyphs;
            const pdfPath: PdfPath = new PdfPath();
            for (let i: number = 0; i < glyphs.length; i++) {
                pdfPath.addRectangle(glyphs[Number.parseInt(i.toString(), 10)]._bounds);
            }
            const pathBounds: number[] = pdfPath._getBounds();
            textWord._bounds  = {x: pathBounds[0], y: pathBounds[1], width: pathBounds[2], height: pathBounds[3]};
            textWord._fontName = fontName;
            textWord._fontStyle = fontStyle;
            textWord._fontSize = this._fontSize;
            this._textWord.push(textWord);
        };
        if (isSpace) {
            if (tempString) {
                if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270 || rotation === 90) {
                    addTextWord(tempString, this._textGlyph, this._height);
                } else {
                    addTextWord(tempString, this._textGlyph, this._width);
                }
                this._textGlyph = [];
                tempString = '';
            }
            const textGlyph: TextGlyph = new TextGlyph();
            textGlyph._text = glyph;
            textGlyph._bounds = currentRect;
            textGlyph._fontName = fontName;
            textGlyph._fontStyle = fontStyle;
            textGlyph._fontSize = this._fontSize;
            if (Array.isArray(textColor) && textColor.length === 3) {
                textGlyph._color = {r: textColor[0], g: textColor[1], b: textColor[2]};
            }
            if (page.rotation !== PdfRotationAngle.angle0) {
                textGlyph._isRotated = true;
            } else {
                textGlyph._isRotated = false;
            }
            this._textGlyph.push(textGlyph);
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270 || rotation === 90) {
                addTextWord(glyph, this._textGlyph, currentRect.height);
            } else {
                addTextWord(glyph, this._textGlyph, currentRect.width);
            }
            this._width = 0;
            this._height = 0;
            this._textGlyph = [];
            this._previousRect = null;
        } else if (this._previousRect !== null && this._previousRect.width > 0) {
            let spacingFactor: number = currentRect.height * 0.07;
            if (spacingFactor < 2) {
                spacingFactor = 2;
            }
            let difference: number;
            if (page.rotation === PdfRotationAngle.angle90) {
                difference = this._previousRect.y + this._previousRect.height - currentRect.y;
            } else if (page.rotation === PdfRotationAngle.angle270 || rotation === 90) {
                difference = currentRect.y + currentRect.height - this._previousRect.y;
            } else if (page.rotation === PdfRotationAngle.angle180) {
                difference = currentRect.x + currentRect.width - this._previousRect.x;
            } else {
                difference = this._previousRect.x + this._previousRect.width - currentRect.x;
            }
            if (difference > 0) {
                if (spacingFactor === 2) {
                    spacingFactor = 2.5;
                }
            }
            if (Math.abs(difference) > spacingFactor) {
                if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270) {
                    addTextWord(tempString, this._textGlyph, this._height);
                } else {
                    addTextWord(tempString, this._textGlyph, this._width);
                }
                this._width = 0;
                this._height = 0;
                this._textGlyph = [];
                tempString = '';
                this._previousRect = {x: 0, y: 0, width: 0 , height: 0};
            }
        }
        if (!isSpace) {
            const textGlyph: TextGlyph = new TextGlyph();
            textGlyph._text = glyph;
            textGlyph._bounds = currentRect;
            textGlyph._fontName = fontName;
            textGlyph._fontStyle = fontStyle;
            textGlyph._fontSize = this._fontSize;
            if (Array.isArray(textColor) && textColor.length === 3) {
                textGlyph._color = {r: textColor[0], g: textColor[1], b: textColor[2]};
            }
            if (page.rotation !== PdfRotationAngle.angle0) {
                textGlyph._isRotated = true;
            } else {
                textGlyph._isRotated = false;
            }
            textGlyph._isRotated = false;
            this._textGlyph.push(textGlyph);
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle270 || rotation === 90) {
                this._height += currentRect.height;
            } else {
                this._width += currentRect.width;
            }
            tempString += glyph;
        }
        return tempString;
    }
    _getTextRenderingMatrix(): _MatrixHelper {
        let matrix: _MatrixHelper = new _MatrixHelper(this._fontSize, 0, 0, -this._fontSize, 0, this._fontSize + this._arise);
        matrix = matrix._multiply(this._textLineMatrix);
        matrix = matrix._multiply(this._ctm);
        return matrix;
    }
    _renderFont(fontElements: string[]): void {
        let i: number = 0;
        for (i; i < fontElements.length; i++) {
            if (fontElements[Number.parseInt(i.toString(), 10)].indexOf('/') !== -1) {
                this._currentFont = fontElements[Number.parseInt(i.toString(), 10)].replace('/', '');
                break;
            }
        }
        this._fontSize = Number(fontElements[i + 1]);
    }
    /**
     * Extract `TextLine` collection from the PDF document.
     *
     * @returns {TextLine[]} The extracted textLines
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data1);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textCollection: TextLine[] = extractor.extractTextLines();
     * // Save the output PDF
     * document.save(‘Output.pdf’);
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    extractTextLines(): TextLine[];
    /**
     * Extract `TextLine` from the PDF document.
     *
     * @param {object} options The options to specify the page range to be selected.
     * @returns {TextLine[]} The extracted textLines
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data1);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textCollection: TextLine[] = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * // Save the output PDF
     * document.save(‘Output.pdf’);
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    extractTextLines(options: { startPageIndex?: number, endPageIndex?: number }): TextLine[];
    extractTextLines(options?: { startPageIndex?: number, endPageIndex?: number }): TextLine[] {
        let startIndex: number = 0;
        this._isExtractTextLines = true;
        this._contentParser = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        if (options && typeof(options.startPageIndex) === 'number') {
            startIndex = options.startPageIndex;
        }
        let endIndex: number = this._document.pageCount - 1;
        if (options && typeof(options.endPageIndex) === 'number') {
            endIndex = options.endPageIndex;
        }
        this._textLine = [];
        this._processPages(startIndex, endIndex);
        this._isExtractTextLines = false;
        return this._textLine;
    }
    /**
     * //Extract all image information from the PDF document
     *
     * @returns {Promise<PdfEmbeddedImage[]>} The extracted collection of image information
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * let data: Uint8Array = imageInfo.data;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    async extractImages(): Promise<PdfEmbeddedImage[]>;
    /**
     * Extract all image information from the PDF document
     *
     * @param {object} options The options to specify the page range to be selected.
     * @returns {Promise<PdfEmbeddedImage[]>} The extracted collection of image information
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract collection of `PdfEmbeddedImage` from the PDF document.
     * let imageInfoCollection: PdfEmbeddedImage[] = extractor.extractImages({ startPageIndex: 0, endPageIndex: document.pageCount - 1});
     * let imageInfo: PdfEmbeddedImage = imageInfoCollection[0];
     * let data: Uint8Array = imageInfo.data;
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    async extractImages(options: { startPageIndex?: number, endPageIndex?: number }): Promise<PdfEmbeddedImage[]>;
    async extractImages(options?: { startPageIndex?: number, endPageIndex?: number }): Promise<PdfEmbeddedImage[]> {
        const isImageExtraction: boolean = true;
        this._document._crossReference._isDecoderSupport = true;
        let startIndex: number = 0;
        this._contentParser = new _PdfContentParserHelper(_TextProcessingMode.imageExtraction);
        if (options && typeof(options.startPageIndex) === 'number') {
            startIndex = options.startPageIndex;
        }
        let endIndex: number = this._document.pageCount - 1;
        if (options && typeof(options.endPageIndex) === 'number') {
            endIndex = options.endPageIndex;
        }
        const fontCache: Map<string, Map<string, _FontStructure>> = new Map();
        const xObjectCache: Map<string, Map<string, _FontStructure>> = new Map();
        for (let pageIndex: number = startIndex; pageIndex <= endIndex; pageIndex++) {
            const page: PdfPage = this._document.getPage(pageIndex);
            if (page.rotation !== PdfRotationAngle.angle0 && !this._isLayout) {
                this._isRotatePage = true;
            }
            const graphicState: _GraphicState = new _GraphicState();
            const resource: _PdfDictionary = page._pageDictionary.get('Resources');
            if (resource) {
                const resourceId: any = resource._reference ? resource._reference.toString() : ''; //eslint-disable-line
                let fontCollection: Map<string, _FontStructure>;
                let xObjectCollection: Map<string, _FontStructure>;
                if (resourceId && xObjectCache.has(resourceId)) {
                    xObjectCollection = xObjectCache.get(resourceId);
                } else {
                    xObjectCollection = _getXObjectResources(resource, this._crossReference, isImageExtraction, page);
                    if (resourceId) {
                        xObjectCache.set(resourceId, xObjectCollection);
                    }
                }
                await this._extractImagcollection(page, fontCollection, xObjectCollection,  graphicState);
            }
            this._isRotatePage = false;
        }
        fontCache.clear();
        xObjectCache.clear();
        return this._imageInfo;
    }
    _processPages(startIndex: number, endIndex: number, isImageExtraction?: boolean): void {
        const fontCache: Map<string, Map<string, _FontStructure>> = new Map();
        const xObjectCache: Map<string, Map<string, _FontStructure>> = new Map();
        for (let pageIndex: number = startIndex; pageIndex <= endIndex; pageIndex++) {
            const page: PdfPage = this._document.getPage(pageIndex);
            if (page.rotation !== PdfRotationAngle.angle0 && !this._isLayout) {
                this._isRotatePage = true;
            }
            const graphicState: _GraphicState = new _GraphicState();
            const resource: _PdfDictionary = page._pageDictionary.get('Resources');
            if (resource !== null && typeof resource !== 'undefined') {
                const resourceId: any = resource._reference ? resource._reference.toString() : ''; //eslint-disable-line
                let fontCollection: Map<string, _FontStructure>;
                if (!isImageExtraction) {
                    if (resourceId && fontCache.has(resourceId)) {
                        fontCollection = fontCache.get(resourceId);
                    } else {
                        fontCollection = _addFontResources(resource, this._crossReference);
                        if (resourceId) {
                            fontCache.set(resourceId, fontCollection);
                        }
                    }
                }
                let xObjectCollection: Map<string, _FontStructure>;
                if (resourceId && xObjectCache.has(resourceId)) {
                    xObjectCollection = xObjectCache.get(resourceId);
                } else {
                    xObjectCollection = _getXObjectResources(resource, this._crossReference, isImageExtraction, page);
                    if (resourceId) {
                        xObjectCache.set(resourceId, xObjectCollection);
                    }
                }
                this._renderText(page, fontCollection, xObjectCollection, graphicState, isImageExtraction);
            }
            this._isRotatePage = false;
        }
        fontCache.clear();
        xObjectCache.clear();
    }
    /**
     * Gets the root structure element of the PDF document.
     *
     * @returns {PdfStructureElement} The root structure element of the PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Access the structure element of the PDF document
     * let rootStructureElement: PdfStructureElement = extractor.getStructureElement();
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getStructureElement(): PdfStructureElement {
        if (!(this._structureElement)) {
            this._structureElement = this._getStructureTreeRoot();
        }
        return this._structureElement;
    }
    /**
     * Gets the structure elements of PDF page.
     *
     * @param {PdfPage} page PDF page
     * @returns {PdfStructureElement[]} Structure elements
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data, password);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Retrieve structure elements from the first page
     * let page: PdfPage = document.getPage(0);
     * let structureElements: PdfStructureElement[] = extractor.getStructureElements(page);
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    getStructureElements(page: PdfPage): PdfStructureElement[] {
        const loadedDocument: PdfDocument = this._document;
        this._contentParser = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        if (this._pageElements.length === 0 && loadedDocument) {
            const extractor: PdfDataExtractor = new PdfDataExtractor(loadedDocument);
            const root: PdfStructureElement = extractor.getStructureElement();
            if (root) {
                this._getPageElements(root, page);
            }
        }
        return this._pageElements;
    }
    _getPageElements(element: PdfStructureElement, page: PdfPage): void {
        if (element.page === page && element.tagType !== PdfTagType.documentType) {
            this._pageElements.push(element);
        } else if (element.childElements.length > 0) {
            for (let i: number = 0; i < element.childElements.length; i++) {
                this._getPageElements(element.childElements[Number.parseInt(i.toString(), 10)], page);
            }
        }
    }
    _getStructureTreeRoot(): PdfStructureElement {
        let structureRoot: PdfStructureElement;
        const catalogDictionary: _PdfDictionary = this._document._catalog._catalogDictionary;
        if (catalogDictionary && catalogDictionary.has('StructTreeRoot')) {
            const treeRoot: _PdfDictionary = catalogDictionary.get('StructTreeRoot');
            if (treeRoot) {
                if (this._isSingleRootElement(treeRoot)) {
                    structureRoot = this._getStructureElement(treeRoot);
                } else {
                    structureRoot = PdfStructureElement._load(this._document);
                    this._getStructureElement(treeRoot, structureRoot);
                }
            }
            const collection: PdfStructureElement[] = this._elementCollection;
            if (collection && collection.length > 0) {
                structureRoot._getTaggedContent(collection);
            }
        }
        return structureRoot;
    }
    _getStructureElement(structureDictionary: _PdfDictionary, parent?: PdfStructureElement): PdfStructureElement {
        let structureElement: PdfStructureElement;
        if (structureDictionary.has('K')) {
            const elements: any = structureDictionary.getArray('K'); // eslint-disable-line
            if ((elements)) {
                if (Array.isArray(elements)) {
                    for (let i: number = 0; i < elements.length; i++) {
                        const dictionary: _PdfDictionary = elements[Number.parseInt(i.toString(), 10)];
                        if (dictionary instanceof _PdfDictionary) {
                            if (parent) {
                                structureElement = PdfStructureElement._load(this._document, dictionary, this._elementOrder, parent);
                            } else {
                                structureElement = PdfStructureElement._load(this._document, dictionary, this._elementOrder);
                            }
                            if (structureElement.tagType === PdfTagType.none && dictionary.has('S')) {
                                const tagType: _PdfName = dictionary.get('S');
                                if (tagType) {
                                    structureElement._tagType = structureElement._getTagType(tagType.name);
                                }
                            } else if (structureElement.tagType === PdfTagType.none && structureElement.parent
                                       && structureElement.parent.tagType !== PdfTagType.none) {
                                structureElement._tagType = structureElement.parent.tagType;
                            }
                            if (!this._orderSet.has(structureElement._order)) {
                                this._elementCollection.push(structureElement);
                                this._orderSet.add(structureElement._order);
                            }
                            this._elementOrder++;
                        }
                        if (dictionary instanceof _PdfDictionary && dictionary.has('K')) {
                            const tempElement: PdfStructureElement = this._getStructureElement(dictionary, structureElement);
                            if (tempElement) {
                                structureElement._childElements.push(tempElement);
                                if (!this._orderSet.has(tempElement._order)) {
                                    this._elementCollection.push(tempElement);
                                    this._orderSet.add(tempElement._order);
                                }
                            }
                            if (parent) {
                                parent._childElements.push(structureElement);
                            } else {
                                return structureElement;
                            }
                        } else if (parent && structureElement && parent._childElements.indexOf(structureElement) === -1) {
                            parent._childElements.push(structureElement);
                        }
                        if (dictionary instanceof _PdfDictionary && dictionary.has('Pg')) {
                            structureElement._pageDictionary = dictionary.get('Pg');
                        }
                        if (typeof dictionary === 'number') {
                            if (parent) {
                                parent._contentId.push(dictionary);
                            }
                        }
                    }
                    return null;
                } else if (typeof elements === 'number') {
                    parent._contentId.push(elements);
                } else if (elements instanceof _PdfDictionary) {
                    if (parent) {
                        structureElement = PdfStructureElement._load(this._document, elements, this._elementOrder, parent);
                    } else {
                        structureElement = PdfStructureElement._load(this._document, elements, this._elementOrder);
                    }
                    if (!this._orderSet.has(structureElement._order)) {
                        this._elementCollection.push(structureElement);
                        this._orderSet.add(structureElement._order);
                    }
                    this._elementOrder++;
                    if (structureElement.tagType === PdfTagType.none && elements !== null &&
                        typeof elements !== 'undefined' && elements.has('S')) {
                        const tagType: _PdfName = elements.get('S');
                        if (tagType) {
                            structureElement._tagType = structureElement._getTagType(tagType.name);
                        }
                    } else if (structureElement.tagType === PdfTagType.none && structureElement.parent &&
                               structureElement.parent.tagType !== PdfTagType.none) {
                        structureElement._tagType = structureElement.parent.tagType;
                    }
                    if (elements.has('K')) {
                        const tempElement: PdfStructureElement = this._getStructureElement(elements, structureElement);
                        if (tempElement) {
                            structureElement._childElements.push(tempElement);
                            if (!this._orderSet.has(tempElement._order)) {
                                this._elementCollection.push(tempElement);
                                this._orderSet.add(tempElement._order);
                            }
                        }
                    }
                    if (elements.has('Pg') && structureElement.tagType !== PdfTagType.documentType) {
                        structureElement._pageDictionary = elements.get('Pg');
                    }
                }
            }
        }
        return structureElement;
    }
    _isSingleRootElement(treeRoot: _PdfDictionary): boolean {
        let isSingle: boolean = true;
        if (treeRoot.has('K')) {
            const elements: any[] = treeRoot.get('K'); // eslint-disable-line
            if (elements && elements.length > 1) {
                isSingle = false;
            }
        }
        return isSingle;
    }
    _getFigureBounds(structElement: PdfStructureElement, page: PdfPage): Rectangle {
        const combinedContent: Uint8Array = page._combineContent();
        const parser: _ContentParser = new _ContentParser(combinedContent);
        const recordCollection: _PdfRecord[] = parser._readContent();
        let currentCmY: number = 0;
        let prevCmY: number = 0;
        this._hasTm = false;
        this._hasET = false;
        this._hasBeginMarkedContent = false;
        this._hasTj = false;
        this._initialTransForm = new _MatrixHelper(1.3333333333333333, 0, 0, -1.3333333333333333, 0, page.size.height * 1.3333333333333333);
        const id: number[] = [];
        let elementBounds: Rectangle;
        let hexElement: string[] = []; // eslint-disable-line
        const objects: _MatrixHelper[] = [];
        recordCollection.forEach((record: _PdfRecord) => {
            const token: string = record._operator;
            const element: string[] = record._operands;
            let a: number;
            let b: number;
            let c: number;
            let d: number;
            let e: number;
            let f: number;
            let current: number;
            let prev: number;
            let locationY: number;
            switch (token) {
            case 'q':
                this._hasET = false;
                this._objects.unshift(this._objects[0]);
                this._ctm = this._objects[0];
                break;
            case 'cm':
            {
                a = parseFloat(element[0]);
                b = parseFloat(element[1]);
                c = parseFloat(element[2]);
                d = parseFloat(element[3]);
                e = parseFloat(element[4]);
                f = parseFloat(element[5]);
                this._hasET = false;
                currentCmY = Number(element[5]);
                current = currentCmY;
                prev = prevCmY;
                const ctm: _MatrixHelper = new _MatrixHelper(a, b, c, d, e, f)._multiply(this._objects[0]);
                objects[0] = ctm;
                locationY = (current - prev) / 10;
                if ((current !== prev) && this._hasTm && (locationY < 0 || locationY >= 1)) {
                    this._resultantText += '\r\n';
                    this._hasTm = false;
                }
                prevCmY = currentCmY;
                break;
            }
            case 'BDC':
            {
                this._hasBeginMarkedContent = true;
                this._hasET = true;
                hexElement = element;
                const markedContentId: number = structElement._parseContent(element);
                if (id.indexOf(markedContentId) === -1) {
                    id.push(markedContentId);
                }
                break;
            }
            case 'Do':
                if (id.indexOf(structElement._contentId[0]) !== -1) {
                    const scaleMatrix: _MatrixHelper = new _MatrixHelper(1, 0, 0, -1.01, 0, 1);
                    let transformMatrix: _MatrixHelper = new _MatrixHelper(scaleMatrix._m11, scaleMatrix._m12,
                                                                           scaleMatrix._m21, scaleMatrix._m22,
                                                                           scaleMatrix._offsetX, scaleMatrix._offsetY).
                        _multiply(objects[0]);
                    const documentMatrix: _MatrixHelper = new _MatrixHelper(1.33, 0, 0, -1.33, 0, page.size.height * 1.33);
                    transformMatrix = transformMatrix._multiply(documentMatrix);
                    if (page.rotation === PdfRotationAngle.angle270) {
                        if (transformMatrix._m11 !== 0 && transformMatrix._m12 !== 0) {
                            elementBounds = {x: transformMatrix._offsetY / 1.33,
                                y: page.size.width - (Math.round(transformMatrix._offsetX / 1.33), 5) + transformMatrix._m11 / 1.33,
                                width: objects[0]._m22, height: objects[0]._m12};
                        } else {
                            elementBounds = {x: transformMatrix._offsetY / 1.33, y: Math.floor(page.size.width) -
                                (Math.round(transformMatrix._offsetX / 1.33), 5) +
                                    Math.floor(transformMatrix._m11 / 1.33), width: objects[0]._m12, height: objects[0]._m21};
                        }
                    } else if (page.rotation === PdfRotationAngle.angle90) {
                        if (transformMatrix._m11 === 0 && transformMatrix._m21 === 0) {
                            elementBounds = {x: page.size.height - (transformMatrix._offsetY / 1.33),
                                y: (transformMatrix._offsetX / 1.33), width: objects[0]._m12, height: - objects[0]._m21};
                        } else {
                            elementBounds = {x: page.size.height - (transformMatrix._offsetY / 1.33) - objects[0]._m22,
                                y: transformMatrix._offsetX / 1.33, width: objects[0]._m22, height: objects[0]._m11};
                        }
                    } else if (page.rotation === PdfRotationAngle.angle180) {
                        elementBounds = {x: page.size.width - (transformMatrix._offsetX / 1.33) -
                                objects[0]._m11 , y: page.size.height - objects[0]._m22 -
                        Math.round((transformMatrix._offsetY / 1.33)),
                        width: objects[0]._m11, height: objects[0]._offsetY};
                    } else {
                        if (transformMatrix._m11 === 0  && transformMatrix._m22 > 0) {
                            if (transformMatrix._m12 < 0  && transformMatrix._m21 > 0) {
                                elementBounds = {x: (page.size.height - (transformMatrix._offsetY /  1.33)),
                                    y: Math.round((transformMatrix._offsetX / 1.33)),
                                    width: - objects[0]._m21, height: objects[0]._m12};
                            } else if (transformMatrix._m12 > 0 && transformMatrix._m21 < 0) {
                                elementBounds = {x: (transformMatrix._offsetY / 1.33),
                                    y: (page.size.width - transformMatrix._offsetX / 1.33),
                                    width: - objects[0]._m21, height: objects[0]._m12};
                            } else if (transformMatrix._m12 < 0 && transformMatrix._m21 < 0) {
                                elementBounds = {x: (page.size.height - (transformMatrix._offsetY / 1.33) - objects[0]._m11),
                                    y: (page.size.height - objects[0]._m21 - (transformMatrix._offsetY / 1.33)),
                                    width: objects[0]._m11, height: objects[0]._m22};
                            } else {
                                elementBounds = {x: (page.size.width - (transformMatrix._offsetX / 1.33) - objects[0]._m11),
                                    y: page.size.height - objects[0]._m22 - transformMatrix._offsetY / 1.33,
                                    width: objects[0]._m11, height: objects[0]._m21};
                            }
                        } else {
                            elementBounds = {x: transformMatrix._offsetX / 1.33,
                                y: Math.round(transformMatrix._offsetY / 1.33),
                                width: objects[0]._m11, height: objects[0]._m22};
                        }
                    }
                }
                break;
            }
        });
        return elementBounds;
    }
}
