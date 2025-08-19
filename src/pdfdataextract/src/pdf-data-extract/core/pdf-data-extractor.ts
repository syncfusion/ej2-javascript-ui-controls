import { _MatrixHelper, _TransformationStack } from './text-extraction/matrix-helper';
import { TextGlyph, TextLine, TextWord } from './text-structure';
import { _PdfContentParserHelper } from './content-parser-helper';
import { _GraphicState } from './graphic-state';
import { _FontStructure } from './text-extraction';
import { _TextProcessingMode } from './enum';
import { _addFontResources, _getXObject, _getXObjectResources, _ignoreEscapeSequence, _isArrayEqual, _parseEncodedText } from './utils';
import { _PdfCrossReference, _PdfDictionary, _PdfRecord, PdfDocument, PdfFontStyle, PdfPage, PdfPath, PdfRotationAngle } from '@syncfusion/ej2-pdf';
import { _PdfTextParser } from './pdf-text-parser';

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
    _tempBoundingRectangle: { x: number, y: number, width: number, height: number };
    _boundingRectangle: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
    _previousRect: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
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
    /**
     * Initialize a new instance of the `PdfDataExtractor` class
     *
     * @param {PdfDocument} document PDF document
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data1);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extracts text from the PDF Page based on its layout
     * let text: string = extractor.extractText({isLayout: true});
     * // Save the output PDF
     * document.save(‘Output.pdf’);
     * // Destroy the documents
     * document.destroy();
     * ```
     */
    constructor(document: PdfDocument) {
        this._document = document;
        this._crossReference = document._crossReference;
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
        this._initialTransForm = new _MatrixHelper(1.3333333333333333, 0, 0, -1.3333333333333333, 0, page.size[1] * 1.3333333333333333);
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
                this._hasBeginMarkedContent = true;
                this._hasET = true;
                hexElement = element;
                break;
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
    }
    _renderText(page: PdfPage, fontCollection: Map<string, _FontStructure>, xObjectCollection: Map<string, any>, graphicState: _GraphicState): any { // eslint-disable-line
        const recordCollection: _PdfRecord[] = this._contentParser._getPageRecordCollection(page);
        let text: any; // eslint-disable-line
        if (this._isLayout) {
            this._renderTextAsLayOut(recordCollection, page, fontCollection, xObjectCollection);
        } else if (this._isExtractTextLines) {
            text = this._contentParser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            this._textLine = text;
        } else {
            text = this._contentParser._processRecordCollection(recordCollection, page, fontCollection, xObjectCollection, graphicState);
            this._resultantText = text;
        }
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
                textWord._bounds = [this._textGlyph[0]._bounds[0], this._textGlyph[0]._bounds[1], this._textGlyph[0]._bounds[2],
                    this._height];
            } else {
                textWord._bounds = [this._textGlyph[0]._bounds[0], this._textGlyph[0]._bounds[1], this._width,
                    this._textGlyph[0]._bounds[2]];
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
            pdfPath.addRectangle(this._textWord[Number.parseInt(i.toString(), 10)
            ]._bounds[0]
            , this._textWord[Number.parseInt(i.toString(), 10)
            ]._bounds[1], this._textWord[Number.parseInt(i.toString(), 10)
            ]._bounds[2],
                                 this._textWord[Number.parseInt(i.toString(), 10)]._bounds[3]);
        }
        textLine1._bounds = pdfPath._getBounds();
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
        const currentRect: any = this._boundingRectangle; //eslint-disable-line
        const addTextWord: any = (text: string, glyphs: TextGlyph[], width: number) => { //eslint-disable-line
            const textWord: TextWord = new TextWord();
            textWord._text = text;
            textWord._glyphs = glyphs;
            const pdfPath: PdfPath = new PdfPath();
            for (let i: number = 0; i < glyphs.length; i++) {
                pdfPath.addRectangle(glyphs[Number.parseInt(i.toString(), 10)
                ]._bounds[0]
                , glyphs[Number.parseInt(i.toString(), 10)
                ]._bounds[1], glyphs[Number.parseInt(i.toString(), 10)
                ]._bounds[2],
                                     glyphs[Number.parseInt(i.toString(), 10)]._bounds[3]);
            }
            textWord._bounds  = pdfPath._getBounds();
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
            textGlyph._bounds = [currentRect.x, currentRect.y, currentRect.width, currentRect.height];
            textGlyph._fontName = fontName;
            textGlyph._fontStyle = fontStyle;
            textGlyph._fontSize = this._fontSize;
            textGlyph._color = textColor;
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
            textGlyph._bounds = [currentRect.x, currentRect.y, currentRect.width, currentRect.height];
            textGlyph._fontName = fontName;
            textGlyph._fontStyle = fontStyle;
            textGlyph._fontSize = this._fontSize;
            textGlyph._color = textColor;
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
    _processPages(startIndex: number, endIndex: number): void {
        for (let pageIndex: number = startIndex; pageIndex <= endIndex; pageIndex++) {
            const page: PdfPage = this._document.getPage(pageIndex);
            if (page.rotation !== PdfRotationAngle.angle0 && !this._isLayout) {
                this._isRotatePage = true;
            }
            const graphicState: _GraphicState = new _GraphicState();
            const resource: _PdfDictionary = page._pageDictionary.get('Resources');
            if (resource !== null && typeof(resource) !== 'undefined') {
                const fontCollection: Map<string, _FontStructure> = _addFontResources(resource, this._crossReference);
                const xObjectCollection: Map<string, _FontStructure> = _getXObjectResources(resource, this._crossReference);
                this._renderText(page, fontCollection, xObjectCollection, graphicState);
            }
            this._isRotatePage = false;
        }
    }
}
