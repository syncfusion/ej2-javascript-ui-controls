import { _ContentParser, _PdfContentStream, _PdfCrossReference, _PdfRecord, _PdfReference, PdfColor, PdfDocument, PdfFontStyle, PdfPage, PdfPath, PdfRotationAngle, Rectangle } from '@syncfusion/ej2-pdf';
import { TextGlyph, TextLine, TextWord } from './text-structure';
import { _TextProcessingMode } from './enum';
import { PdfRedactor } from './redaction/pdf-redactor';
import { _GraphicState, _TextState } from './graphic-state';
import { _FontStructure } from './text-extraction';
import { _decodeEncodedText, _getXObject, canvasRenderCallback } from './utils';
import { _PdfTextParser } from './pdf-text-parser';
import { _PdfShapeParser } from './redaction/shape-parser-helper';
import { _ImageStructure } from './image-extraction/image-structure';
import { PdfEmbeddedImage } from './image-extraction/pdf-embedded-image';
import { _PdfImage } from './image-extraction/image';

export class _PdfContentParserHelper {
    _document: PdfDocument;
    _identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
    _fontSize: number;
    _width: number = 0;
    _imageInfo: PdfEmbeddedImage[] = [];
    _pt: number = 1.3333;
    _height: number = 0;
    _crossReference: _PdfCrossReference;
    _resultantText: string = '';
    _textGlyph: TextGlyph[] = [];
    _textWord: TextWord[] = [];
    _textLine: TextLine[] = []
    _mode: _TextProcessingMode;
    _isContainsRedactionText: boolean = false;
    _isNotUpdated: boolean;
    _redaction: PdfRedactor;
    _yPosition: number = 0;
    _xPosition: number = 0;
    _parser: _PdfTextParser = new _PdfTextParser();
    constructor();
    constructor(mode: _TextProcessingMode);
    constructor(mode: _TextProcessingMode, redaction?: PdfRedactor);
    constructor(mode?: _TextProcessingMode, redaction?: PdfRedactor) {
        if (typeof(mode) !== 'undefined') {
            this._mode = mode;
        }
        if (this._mode === _TextProcessingMode.redaction) {
            this._redaction = redaction;
            this._document = redaction._document;
        }
    }
    _getPageRecordCollection(page: PdfPage): _PdfRecord[] {
        const combinedContent: Uint8Array = page._combineContent();
        const parser: _ContentParser = new _ContentParser(combinedContent);
        const recordCollection: _PdfRecord[] = parser._readContent();
        return recordCollection;
    }
    _processTjOperator(record: _PdfRecord, textState: _TextState, currentFont: _FontStructure, page: PdfPage, fontCollection:
    Map<string, _FontStructure>): { updatedText: string; isChangeOperator: boolean } | void {
        currentFont = this._parser._getTextFont(fontCollection, textState, this._crossReference);
        let element: string = '';
        if (record._operator === '"') {
            element = record._operands[2];
        } else {
            element = record._operands[0];
        }
        let result: any; // eslint-disable-line
        let elements: any; // eslint-disable-line
        let textGlyphs: TextGlyph[] = [];
        let encodedText: string[] = [];
        let decodedText: string[] = [];
        let updatedText: string = '';
        let isChangeOperator: boolean = false;
        let object: any; // eslint-disable-line
        let extractedText: string;
        let text: string;
        if (this._mode === _TextProcessingMode.textLineExtraction) {
            result = this._parser._getSplitText(element, currentFont, record._splitText);
            object = this._getTextElementsFromTjOperator(result.decodedList, currentFont, textState, page);
            extractedText = object.extractedText;
            text = object.tempString;
            this._setTextLineCollection(text, currentFont, textState, page, extractedText);
        } else if (this._mode === _TextProcessingMode.textExtraction) {
            currentFont = this._parser._getTextFont(fontCollection, textState, this._crossReference);
            this._extractTextElement(element, currentFont, record._splitText);
            if (record._operator === "'" || record._operator === '"') { //eslint-disable-line
                this._resultantText += '\r\n';
            }
        } else if (this._mode === _TextProcessingMode.redaction) {
            if (this._isContainsRedactionText) {
                const glyphs: TextGlyph[] = [];
                result = this._parser._getSplitText(element, currentFont, record._splitText, true);
                elements = this._getTextElementsFromTjOperator(result.decodedList, currentFont, textState, page, glyphs, result.inputType);
                textGlyphs = elements.textGlyphs;
                decodedText = elements.decodedText;
                encodedText = elements.encodedText;
                updatedText = this._redaction._replacedText(textGlyphs, encodedText, element, decodedText);
                if (updatedText === record._operands[0]) {
                    this._isNotUpdated = true;
                } else {
                    isChangeOperator = true;
                }
                return { updatedText, isChangeOperator };
            }
        }
    }
    _setTextLineCollection(text: string, currentFont: _FontStructure, textState: _TextState, page: PdfPage, extractedText: string): void{
        if (text !== '') {
            const textWord: TextWord = new TextWord();
            textWord._text = text;
            textWord._glyphs = this._textGlyph;
            const pdfPath: PdfPath = new PdfPath();
            for (let i: number = 0; i < this._textGlyph.length; i++) {
                pdfPath.addRectangle(this._textGlyph[Number.parseInt(i.toString(), 10)]._bounds);
            }
            const pathBounds: number[] = pdfPath._getBounds();
            textWord._bounds  = {x: pathBounds[0], y: pathBounds[1], width: pathBounds[2], height: pathBounds[3]};
            textWord._fontName = currentFont._name;
            textWord._fontStyle = currentFont._fontStyle;
            textWord._fontSize = this._fontSize;
            this._textWord.push(textWord);
            this._height = 0;
        }
        this._width = 0;
        this._textGlyph = [];
        const textLine1: TextLine = new TextLine();
        textLine1._text = extractedText;
        textLine1._wordCollection = this._textWord;
        textLine1._fontName = currentFont._name;
        textLine1._fontStyle = currentFont._fontStyle;
        textLine1._fontSize = textState._fontSize;
        textLine1._pageIndex = page._pageIndex;
        const pdfPath: PdfPath = new PdfPath();
        for (let i: number = 0; i < this._textWord.length; i++) {
            pdfPath.addRectangle(this._textWord[Number.parseInt(i.toString(), 10)]._bounds);
        }
        const pathBounds: number[] = pdfPath._getBounds();
        textLine1._bounds = {x: pathBounds[0], y: pathBounds[1], width: pathBounds[2], height: pathBounds[3]};
        this._textLine.push(textLine1);
    }
    _processTJOperator(record: _PdfRecord, textState: _TextState, currentFont: _FontStructure, page: PdfPage, fontCollection:
    Map<string, _FontStructure>): { updatedText: string, isChangeOperator: boolean } {
        currentFont = this._parser._getTextFont(fontCollection, textState, this._crossReference);
        const element: string = record._operands[0];
        let result: any; // eslint-disable-line
        let elements: any; // eslint-disable-line
        let textGlyphs: TextGlyph[] = [];
        let encodedText: string[] = [];
        let updatedText: string = '';
        let decodedText: string[] = [];
        let isChangeOperator: boolean = false;
        currentFont = this._parser._getTextFont(fontCollection, textState, this._crossReference);
        if (this._mode === _TextProcessingMode.textLineExtraction) {
            result = this._parser._getSplitText(element[0], currentFont, record._splitText);
            const object: any = this._getTextElementsFromTJOperator(result.decodedList, currentFont, textState, page); // eslint-disable-line
            this._setTextLineCollection(object.tempString, currentFont, textState, page, object.extractedText);
        } else if (this._mode === _TextProcessingMode.textExtraction) {
            currentFont = this._parser._getTextFont(fontCollection, textState, this._crossReference);
            this._extractTextElement(element, currentFont, record._splitText);
            if (record._operator === "'") { //eslint-disable-line
                this._resultantText += '\r\n';
            }
        } else if (this._mode === _TextProcessingMode.redaction) {
            if (this._isContainsRedactionText) {
                const glyphs: TextGlyph[] = [];
                result = this._parser._getSplitText(element[0], currentFont, record._splitText, true);
                elements = this._getTextElementsFromTJOperator(result.decodedList, currentFont, textState, page, glyphs, result.inputType);
                textGlyphs = elements.textGlyphs;
                decodedText = elements.decodedText;
                encodedText = elements.encodeText;
                updatedText = this._redaction._replacedText(textGlyphs, encodedText, element, decodedText);
                if (updatedText === element) {
                    this._isNotUpdated = true;
                } else {
                    isChangeOperator = true;
                }
            }
        }
        return { updatedText, isChangeOperator };
    }
    _processSingleQuoteOperator(record: _PdfRecord, textState: _TextState, currentFont: _FontStructure, page: PdfPage, fontCollection:
    Map<string, _FontStructure>): { updatedText: string, isChangeOperator: boolean } | void {
        textState._carriageReturn();
        const result: any = this._processTjOperator(record, textState, currentFont, page, fontCollection); // eslint-disable-line
        if (typeof result === 'object' && result !== null) {
            const { updatedText, isChangeOperator } = result;
            return { updatedText, isChangeOperator };
        }
    }
    _intersect(redaction: Rectangle, imageBounds: Rectangle): Rectangle {
        const x1: number = Math.max(redaction.x, imageBounds.x);
        const x2: number = Math.min(redaction.x + redaction.width, imageBounds.x, imageBounds.width);
        const y1: number = Math.max(redaction.y, imageBounds.y);
        const y2: number = Math.min(redaction.y + redaction.height, imageBounds.y + imageBounds.height);
        if (x2 >= x1 && y2 >= y1) {
            return {x: x1, y: y1, width: x2 - x1, height: y2 - y1};
        }
        return {x: 0, y: 0, width: 0, height: 0};
    }
    _multiply(matrix1: number[], matrix2: number[]): number[] {
        const matrix: number[] = [];
        matrix[0] = matrix1[0] * matrix2[0] + matrix1[1] * matrix2[2];
        matrix[1] = matrix1[0] * matrix2[1] + matrix1[1] * matrix2[3];
        matrix[2] = matrix1[2] * matrix2[0] + matrix1[3] * matrix2[2];
        matrix[3] = matrix1[2] * matrix2[1] + matrix1[3] * matrix2[3];
        matrix[4] = matrix1[4] * matrix2[0] + matrix1[5] * matrix2[2] + matrix2[4];
        matrix[5] = matrix1[4] * matrix2[1] + (matrix1[5] * matrix2[3]) + matrix2[5];
        return matrix;
    }
    _processDoubleQuoteOperator(record: _PdfRecord, textState: _TextState, currentFont: _FontStructure, page: PdfPage, fontCollection:
    Map<string, _FontStructure>): { updatedText: string, isChangeOperator: boolean } | void {
        textState._wordSpacing = Number(record._operands[0]);
        textState._charSpacing = Number(record._operands[1]);
        textState._carriageReturn();
        const result: any = this._processTjOperator(record, textState, currentFont, page, fontCollection); // eslint-disable-line
        if (typeof result === 'object' && result !== null) {
            const { updatedText, isChangeOperator } = result;
            return { updatedText, isChangeOperator };
        }
    }
    _processRecordCollection(recordCollection: _PdfRecord[],  page: PdfPage, fontCollection: Map<string, _FontStructure>,
                             xObjectCollection: Map<string, any>, graphicState: _GraphicState, imageCollection?: // eslint-disable-line 
                             Map<string, _ImageStructure>): _PdfContentStream | void | string | TextLine[] | PdfEmbeddedImage[] {
        let textState: _TextState;
        const red: number = 0;
        const green: number = 0;
        const blue: number = 0;
        const updatedText: string = '';
        let parser: _PdfShapeParser;
        const skipUntil: number = -1;
        const stream: _PdfContentStream = new _PdfContentStream([]);
        for (let i: number = 0 ; i < recordCollection.length; i++) {
            const record: _PdfRecord = recordCollection[Number.parseInt(i.toString(), 10)];
            const token: string = record._operator;
            const element: string[] = record._operands;
            this._parser._processCommand(token, element, graphicState);
            textState = graphicState._state;
            i = this._processPdfRecordCollection(textState, i, updatedText, page, recordCollection, fontCollection, xObjectCollection,
                                                 graphicState, parser, red, green, blue, skipUntil, stream);
        }
        if (this._mode === _TextProcessingMode.redaction) {
            stream.write('\r\n');
            return stream;
        } else if (this._mode === _TextProcessingMode.textExtraction) {
            return this._resultantText;
        } else if (this._mode === _TextProcessingMode.textLineExtraction) {
            return this._textLine;
        }
        return;
    }
    async _processImageRecordCollection(recordCollection: _PdfRecord[],  page: PdfPage, fontCollection: Map<string, _FontStructure>,
                             xObjectCollection: Map<string, any>, graphicState: _GraphicState, callBack: canvasRenderCallback): Promise<any> { // eslint-disable-line 
        let textState: _TextState;
        const red: number = 0;
        const green: number = 0;
        const blue: number = 0;
        const updatedText: string = '';
        let parser: _PdfShapeParser;
        const skipUntil: number = -1;
        let bounds: number[] = [];
        const stream: _PdfContentStream = new _PdfContentStream([]);
        for (let i: number = 0 ; i < recordCollection.length; i++) {
            const record: _PdfRecord = recordCollection[Number.parseInt(i.toString(), 10)];
            const token: string = record._operator;
            const element: string[] = record._operands;
            this._parser._processCommand(token, element, graphicState);
            textState = graphicState._state;
            if (token !== 'Do') { //eslint-disable-line
                this._processPdfRecordCollection(textState, i, updatedText, page, recordCollection, fontCollection,
                                                 xObjectCollection, graphicState, parser, red, green, blue, skipUntil, stream);
            } else {
                const xobject: string = element[0].replace('/', '');
                if (xObjectCollection.has(xobject)) {
                    let base: any = xObjectCollection.get(xobject); //eslint-disable-line
                    if (base) {
                        if (this._mode === _TextProcessingMode.redaction) {
                            let pdfStream: any = _getXObject(element, page, xObjectCollection, this, this._mode, graphicState); // eslint-disable-line
                            delete base.dictionary._map.Length;
                            delete base.dictionary._map.Filter;
                            base.dictionary.update('Length', pdfStream.length);
                            pdfStream.dictionary = base.dictionary;
                            pdfStream.dictionary._updated = true;
                            let objectId: any = base.dictionary.objId; // eslint-disable-line
                            const strParts: string[] = objectId.split(' ');
                            const reference: _PdfReference = _PdfReference.get(Number(strParts[0]), Number(strParts[1]));
                            this._document._crossReference._cacheMap.set(reference, pdfStream);
                        } else if (this._mode === _TextProcessingMode.imageExtraction) {
                            const imageInfo: PdfEmbeddedImage = new PdfEmbeddedImage();
                            const ctm: number[] = graphicState._state._ctm;
                            const scaleMatrix: number[] = [1, 0, 0, -1.01, 0, 1];
                            let transformMatrix: number[] = this._multiply(scaleMatrix, graphicState._state._ctm);
                            const documentMatrix: number[] = [1.33333333333333, 0, 0, -1.33333333333333, 0,
                                page.size.height * 1.3333333333333];
                            transformMatrix = this._multiply(transformMatrix, documentMatrix);
                            if (page.rotation === PdfRotationAngle.angle90) {
                                if (transformMatrix[0] !== 0 && transformMatrix[3] !== 0) {
                                    bounds = [Math.floor(transformMatrix[5] / 1.33333333333333), (page.size.width) - (Math.round(
                                        (transformMatrix[4] / 1.33333333333333)) + transformMatrix[0] / 1.33333333333333), ctm[3],
                                    ctm[0]];
                                } else {
                                    bounds = [Math.floor(transformMatrix[5] / 1.33333333333333), (Math.floor(page.size.width)) -
                                        (Math.round((transformMatrix[4] / 1.33333333333333)) +
                                            Math.floor(transformMatrix[0] / 1.3333333333333333)),
                                    Math.abs(ctm[1]), Math.abs(ctm[2])];
                                }
                            } else if (page.rotation === PdfRotationAngle.angle180) {
                                if (transformMatrix[0] === 0 && transformMatrix[3] === 0) {
                                    bounds = [page.size.height - transformMatrix[5] / 1.33333333333333,
                                        transformMatrix[4] / 1.33333333333333, ctm[1], ctm[2]];
                                } else {
                                    bounds = [page.size.height - (transformMatrix[5] / 1.3333333333333333) - ctm[3],
                                        transformMatrix[4] / 1.3333333333333333, ctm[3], ctm[0]];
                                }
                            } else if (page.rotation === PdfRotationAngle.angle270) {
                                bounds = [page.size.width - (transformMatrix[4] / 1.33333333333333) - ctm[0], page.size.height - ctm[3] -
                                Math.round((transformMatrix[5] / 1.3333333333333333)), ctm[0], ctm[3]];
                            } else {
                                if (transformMatrix[0] === 0 && transformMatrix[3] === 0) {
                                    if (transformMatrix[1] < 0 && transformMatrix[2] > 0) {
                                        bounds = [(page.size.height - (transformMatrix[5] / 1.33333333333333)), Math.round(
                                            (transformMatrix[4] / 1.3333333333333333)), -(ctm[2]), (ctm[1])];
                                    } else if (transformMatrix[1] > 0 && transformMatrix[2] < 0) {
                                        bounds = [(transformMatrix[5] / 1.33333333333333), Math.round((page.size.width -
                                                   transformMatrix[4] / 1.3333333333333333)), -(ctm[2]), -(ctm[1])];
                                    } else if (transformMatrix[1] < 0 && transformMatrix[2] < 0) {
                                        bounds = [page.size.width - (transformMatrix[4] / 1.33333333333333) - ctm[0], page.size.height -
                                                                   ctm[3] - Math.round((transformMatrix[5] / 1.3333333333333333)), ctm[0],
                                        ctm[3]];
                                    } else {
                                        bounds = [page.size.width - (transformMatrix[4] / 1.33333333333333) - ctm[0], page.size.height -
                                                                  ctm[3] - Math.round((transformMatrix[5] / 1.3333333333333333)), ctm[0],
                                        ctm[3]];
                                    }
                                } else {
                                    bounds = [(transformMatrix[4] / 1.33333333333333), Math.round((transformMatrix[5] /
                                               1.3333333333333333)), ctm[0], ctm[3]];
                                }
                            }
                            let bytes: Uint8Array;
                            if (base._isImageMask) {
                                const image: _PdfImage = new _PdfImage(base._crossReference, base._stream, false, base._smask,
                                                                       base._mask, false );
                                image._imageFormat = base._imageFormat;
                                image._canvasRenderCallback = callBack;
                                bytes = await image._createMask(base._stream, true);
                                imageInfo._data = bytes;
                            } else {
                                const image: _PdfImage = new _PdfImage();
                                const pdfImage: any = image._buildImage(base._crossReference, base._stream, false); // eslint-disable-line
                                pdfImage._imageFormat = base._imageFormat;
                                pdfImage._canvasRenderCallback = callBack;
                                bytes = await pdfImage._createImageData(false, true);
                                imageInfo._data = bytes;
                            }
                            imageInfo._resourceName = xobject;
                            imageInfo._physicalDimension = {width: base._width, height: base._height};
                            imageInfo._type = base._imageFormat;
                            imageInfo._isImageInterpolated = base._isImageInterpolated;
                            imageInfo._isSoftMasked = base._isSoftMasked;
                            imageInfo._isImageInterpolated = base._isImageInterpolated;
                            imageInfo._pageIndex =  base._PageIndex;
                            imageInfo._bounds = {x: bounds[0], y: bounds[1], width: bounds[2], height: bounds[3]};
                            this._imageInfo.push(imageInfo);
                        }
                    }
                }
            }
        }
        if (this._mode === _TextProcessingMode.imageExtraction) {
            return this._imageInfo;
        }
        return;
    }
    _processPdfRecordCollection(textState: _TextState, index: number, updatedText: string, page: PdfPage, recordCollection: _PdfRecord[],
                                fontCollection: Map<string, _FontStructure>, xObjectCollection: Map<string, any>,  // eslint-disable-line
                                graphicState: _GraphicState, parser: _PdfShapeParser, red: number, green: number,
                                blue: number, skipUntil: number, stream: _PdfContentStream): any { // eslint-disable-line
        let isChangeOperator: boolean = false;
        let currentFont: _FontStructure;
        const currentIndex: number = index;
        const record: _PdfRecord = recordCollection[Number.parseInt(index.toString(), 10)];
        const token: string = record._operator;
        const element: string[] = record._operands;
        switch (token) {
        case 'Tm':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._setTextMatrix(element, textState);
            }
            if (this._mode === _TextProcessingMode.redaction) {
                const x: number = textState._textMatrix[4];
                const y: number = textState._textMatrix[5];
                if (this._parser._isFoundText(x, y, page, this._redaction._redactionRegion)) {
                    this._isContainsRedactionText = true;
                }
                if (recordCollection.length !== index + 1 && !this._isContainsRedactionText) {
                    this._isContainsRedactionText = true;
                }
                if (!this._isContainsRedactionText && page.size.height === y) {
                    this._isContainsRedactionText = true;
                }
            }
            break;
        case 'cm':
            {
                if (this._mode === _TextProcessingMode.redaction) {
                    const x: number = parseFloat(element[4]);
                    const y: number = parseFloat(element[5]);
                    if (this._parser._isFoundText(x, y, page, this._redaction._redactionRegion)) {
                        this._isContainsRedactionText = true;
                    }
                }
            }
            break;
        case 'BT':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._beginText(textState, this._identityMatrix);
            }
            break;
        case 'ET':
            if (this._mode === _TextProcessingMode.textExtraction) {
                this._resultantText += '\r\n';
            } else if (this._mode === _TextProcessingMode.redaction) {
                this._isContainsRedactionText = false;
                this._xPosition = 0;
                this._yPosition = 0;
            }
            break;
        case 'Tf':
            this._parser._setFont(element, textState);
            break;
        case 'Tc':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._setCharSpacing(element, textState);
            }
            break;
        case 'Tw':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._setWordSpacing(element, textState);
            }
            break;
        case 'Tz':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._setTextHorizontalScale(element, textState);
            }
            break;
        case 'TL':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._updateTextLeading(element, textState);
            }
            break;
        case 'Td':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._moveTextPlacement(element, textState);
            }
            if (this._mode === _TextProcessingMode.redaction) {
                this._xPosition = this._xPosition + parseFloat(element[0]);
                this._yPosition = this._yPosition - parseFloat(element[1]);
                if (this._parser._isFoundText(this._xPosition, this._yPosition, page, this._redaction._redactionRegion)) {
                    this._isContainsRedactionText = true;
                }
                if (recordCollection.length !== index + 1 && !this._isContainsRedactionText) {
                    const temp: string = recordCollection[index + 1]._operator;
                    if (temp === 'Tj' || temp === 'TJ' || temp === '"' || temp === "'") { // eslint-disable-line
                        this._isContainsRedactionText = true;
                    }
                }
            }
            break;
        case 'TD':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._moveTextPlacementAndSetLeading(element, textState);
            }
            if (this._mode === _TextProcessingMode.redaction) {
                this._xPosition = this._xPosition + parseFloat(element[0]);
                this._yPosition =  this._yPosition - parseFloat(element[1]);
                if (this._parser._isFoundText(this._xPosition, this._yPosition, page, this._redaction._redactionRegion)) {
                    this._isContainsRedactionText = true;
                }
                if (recordCollection.length !== index + 1 && !this._isContainsRedactionText) {
                    const temp: string = recordCollection[index + 1]._operator;
                    if (temp === 'Tj' || temp === 'TJ' || temp === '"' || temp === "'") { // eslint-disable-line
                        this._isContainsRedactionText = true;
                    }
                }
            }
            break;
        case 'Ts':
            if (this._mode !== _TextProcessingMode.textExtraction) {
                this._parser._setTextRise(element, textState);
            }
            break;
        case 'Tj':
        {
            if (this._mode !== _TextProcessingMode.imageExtraction) {
                const result: any = this._processTjOperator(record, textState, currentFont, page, fontCollection); // eslint-disable-line
                if (record._operands) {
                    if (typeof result === 'object' && result !== null) {
                        updatedText = result.updatedText;
                        isChangeOperator = result.isChangeOperator;
                    }
                }
            }
            break;
        }
        case 'TJ':
        {
            if (this._mode !== _TextProcessingMode.imageExtraction) {
                const result: any = this._processTJOperator(record, textState, currentFont, page, fontCollection); // eslint-disable-line
                if (typeof result === 'object' && result !== null) {
                    updatedText = result.updatedText;
                    isChangeOperator = result.isChangeOperator;
                }
            }
            break;
        }
        case "'": // eslint-disable-line
        {
            if (this._mode !== _TextProcessingMode.imageExtraction) {
                const result: any = this._processSingleQuoteOperator(record, textState, currentFont, page, // eslint-disable-line 
                                                                     fontCollection);
                if (typeof result === 'object' && result !== null) {
                    updatedText = result.updatedText;
                    isChangeOperator = result.isChangeOperator;
                }
            }
            break;
        }
        case '"':
        {
            if (this._mode !== _TextProcessingMode.imageExtraction) {
                const result: any = this._processDoubleQuoteOperator(record, textState, currentFont, page, // eslint-disable-line
                                                                     fontCollection);
                if (typeof result === 'object' && result !== null) {
                    updatedText = result.updatedText;
                    isChangeOperator = result.isChangeOperator;
                }
            }
            break;
        }
        case 'T*':
            if (this._mode === _TextProcessingMode.textExtraction) {
                this._resultantText += '\r\n';
            } else {
                this._parser._setNewLineWithLeading(textState);
            }
            break;
        case 'RG':
        case 'k':
        case 'g':
        case 'rg':
            red = Number(element[0]);
            green = Number(element[1]);
            blue = Number(element[2]);
            textState._textColor = {r: red, g: green, b: blue};
            break;
        case 'Do':
        {
            const xobject: string = element[0].replace('/', '');
            if (xObjectCollection.has(xobject)) {
                let base: any = xObjectCollection.get(xobject); //eslint-disable-line
                if (base) {
                    if (this._mode === _TextProcessingMode.textExtraction || this._mode === _TextProcessingMode.textLineExtraction) {
                        _getXObject(element, page, xObjectCollection, this, this._mode, graphicState);
                    } else if (this._mode === _TextProcessingMode.redaction) {
                        let pdfStream: any = _getXObject(element, page, xObjectCollection, this, this._mode, graphicState); // eslint-disable-line
                        delete base.dictionary._map.Length;
                        delete base.dictionary._map.Filter;
                        base.dictionary.update('Length', pdfStream.length);
                        pdfStream.dictionary = base.dictionary;
                        pdfStream.dictionary._updated = true;
                        let objectId: any = base.dictionary.objId; // eslint-disable-line
                        const strParts: string[] = objectId.split(' ');
                        const reference: _PdfReference = _PdfReference.get(Number(strParts[0]), Number(strParts[1]));
                        this._document._crossReference._cacheMap.set(reference, pdfStream);
                    }
                }
            }
            break;
        }
        case 're':
        {
            parser = new _PdfShapeParser();
            const records: _PdfRecord[] = parser._processRectangle(recordCollection, index, element);
            if (record && records.length > 0) {
                recordCollection.splice(index--, 1, ...records);
            }
            break;
        }
        case 'm':
            parser = new _PdfShapeParser();
            skipUntil = parser._findRedactPath(recordCollection, index, page, this._redaction, this._mode, stream);
            if (skipUntil !== -1) {
                index = skipUntil;
            }
            break;
        }
        if (this._mode === _TextProcessingMode.redaction && currentIndex === index) {
            if (!isChangeOperator) {
                updatedText = '';
            }
            this._redaction._optimizeContent(recordCollection, index, updatedText, stream);
            isChangeOperator = false;
        }
        if (this._mode !== _TextProcessingMode.imageExtraction) {
            return index;
        }
    }
    _extractTextElement(elements: string, currentFont: _FontStructure, inputText: string[]): void {
        const decodedText: string = _decodeEncodedText(elements, currentFont, inputText);
        this._resultantText += decodedText;
    }
    _getTextElementsFromTjOperator(decodedList: string[], currentFont: _FontStructure, textState: _TextState, page: PdfPage,
    textGlyphs?: TextGlyph[], inputType?: string[]): any {// eslint-disable-line
        this._textWord = [];
        let tempString: string = '';
        const text: string[] = decodedList;
        const previousRect: { x: number, y: number, width: number, height: number }  = {x: 0, y: 0, width: 0 , height: 0};
        const decodedText: string[] = [];
        let encodedText: string[] = [];
        let extractedText: string = '';
        const index: number = 0;
        let hex: string[] = [];
        if (text.length > 0) {
            if (typeof(textGlyphs) !== 'undefined') {
                if (inputType[0] !== ' ') {
                    hex = this._parser._splitHexString(inputType[0]);
                }
                const result: any = this._parser._getTextContentItem(currentFont, text[0], 0 , textState, page, tempString, previousRect, extractedText, this, textGlyphs, hex, index, encodedText); // eslint-disable-line
                decodedText[0] = '(' + result.extractedText + ')';
                encodedText = result.encodedText;
                extractedText = result.extractedText;
                return {textGlyphs, decodedText, encodedText};
            } else {
                const result: any = this._parser._getTextContentItem(currentFont, text[0], 0 , textState, page, tempString, previousRect, extractedText, this);  //eslint-disable-line
                tempString = result.tempString;
                extractedText = result.extractedText;
                this._fontSize = result.fontSize;
                return {tempString, extractedText};
            }
        }
    }
    _getTextElementsFromTJOperator(decodedList: string[], currentFont: _FontStructure, textState: _TextState, page: PdfPage,
     textGlyphs?: TextGlyph[], inputType?: string[]): any { //eslint-disable-line
        let textValues: string[] = [];
        this._textWord = [];
        let tempString: string = '';
        textValues = decodedList;
        let iszerspace: boolean = false;
        let text: string = '';
        let str: string = '';
        let previousRect: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
        const decodedText: string[] = [];
        let encodedText: string[] = [];
        let index: number = 0;
        let i: number = 0;
        let hex: string[] = [];
        let extractedText: string = '';
        const spaceFactor: number = ((currentFont._vertical ? 1 : -1) * textState._fontSize) / 1000;
        for (let j: number = 0; j < textValues.length; j++) {
            const word: string = textValues[Number.parseInt(j.toString(), 10)];
            const digit: any = Number(word); // eslint-disable-line
            if (digit || digit === 0) {
                if (typeof(textGlyphs) !== 'undefined') {
                    if (j > 0 && inputType[j - 1] !== ' ') {
                        hex = this._parser._splitHexString(inputType[j - 1]);
                    }
                    const result: any = this._parser._getTextContentItem(currentFont, text, digit * spaceFactor, textState, page, tempString, previousRect,  extractedText, this, textGlyphs, hex, index, encodedText); // eslint-disable-line
                    textGlyphs = result.textGlyphs;
                    extractedText = result.extractedText;
                    encodedText = result.encodedText;
                    index = result.index;
                    extractedText = '';
                    decodedText[i++] = '(' + result.extractedText + ')';
                    decodedText[i++] = word;
                } else {
                    const result: any = this._parser._getTextContentItem(currentFont, text, digit * spaceFactor, textState, page, tempString, previousRect, extractedText, this); // eslint-disable-line
                    tempString = result.tempString;
                    extractedText = result.extractedText;
                    this._fontSize = result.fontSize;
                    previousRect = result.previousRect;
                }
            } else if (digit !== 0) {
                text = word;
                if (iszerspace) {
                    text = str + text;
                    iszerspace = false;
                }
            } else {
                iszerspace = true;
                str = text;
            }
        }
        if (typeof(textGlyphs) !== 'undefined') {
            if (inputType[textValues.length - 1] !== ' ') {
                hex = this._parser._splitHexString(inputType[textValues.length - 1]);
            }
            const result: any = this._parser._getTextContentItem(currentFont, text, 0, textState, page, // eslint-disable-line
                                                                 tempString, previousRect, extractedText, this, textGlyphs,
                                                                 hex, index, encodedText);
            decodedText[Number.parseInt(i.toString(), 10)] = '(' + result.extractedText + ')';
            const encodeText: string[] = result.encodedText;
            return {textGlyphs, decodedText, encodeText};
        } else {
            const result: any = this._parser._getTextContentItem(currentFont, text, 0 ,  textState, page, // eslint-disable-line
                                                                 tempString, previousRect, extractedText, this);
            tempString = result.tempString;
            extractedText = result.extractedText;
            this._fontSize = result.fontSize;
            return {tempString, extractedText};
        }
    }
    _splitWords(glyph: string, tempString: string, fontName: string, fontStyle: PdfFontStyle , page: PdfPage,
                rotation?: number, textColor?: PdfColor, fontSize?: number, textBounds?:
                Rectangle,
                previousRect?: Rectangle): any {  //eslint-disable-line
        let isSpace: boolean = false;
        if (/\s/.test(glyph)) {
            isSpace = true;
        }
        const currentRect: Rectangle = textBounds;
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
            textWord._fontSize = fontSize;
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
            textGlyph._fontSize = fontSize;
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
            previousRect = null;
        } else if (previousRect !== null && previousRect.width > 0) {
            let spacingFactor: number = currentRect.height * 0.07;
            if (spacingFactor < 2) {
                spacingFactor = 2;
            }
            let difference: number;
            if (page.rotation === PdfRotationAngle.angle90) {
                difference = previousRect.y + previousRect.height - currentRect.y;
            } else if (page.rotation === PdfRotationAngle.angle270 || rotation === 90) {
                difference = currentRect.y + currentRect.height - previousRect.y;
            } else if (page.rotation === PdfRotationAngle.angle180) {
                difference = currentRect.x + currentRect.width - previousRect.x;
            } else {
                difference = previousRect.x + previousRect.width - currentRect.x;
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
                previousRect = {x: 0, y: 0, width: 0 , height: 0};
            }
        }
        if (!isSpace) {
            const textGlyph: TextGlyph = new TextGlyph();
            textGlyph._text = glyph;
            textGlyph._bounds = currentRect;
            textGlyph._fontName = fontName;
            textGlyph._fontStyle = fontStyle;
            textGlyph._fontSize = fontSize;
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
        return {tempString, previousRect};
    }
}
