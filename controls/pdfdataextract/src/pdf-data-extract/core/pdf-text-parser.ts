import { _PdfCrossReference, _PdfDictionary, _PdfName, PdfPage, PdfRotationAngle } from '@syncfusion/ej2-pdf';
import { _GraphicState, _TextState } from './graphic-state';
import { _getLiteralString, _hexToChar, _isArrayEqual, _skipEscapeSequence } from './utils';
import { _FontStructure } from './text-extraction/font-structure';
import { TextGlyph, TextLine, TextWord } from './text-structure';
import { _MatrixHelper } from './text-extraction/matrix-helper';
import { _PdfContentParserHelper } from './content-parser-helper';

export class _PdfTextParser {
    _textGlyph: TextGlyph[] = [];
    _textWord: TextWord[] = [];
    _textLine: TextLine[] = [];
    _extractedText: string = '';
    _width: number = 0;
    _height: number = 0;
    _index: number = 0;
    _fontSize: number =  0;
    _encodedText: string[] = [];
    _previousRect: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
    _boundingRectangle: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
    _translateTextMatrix(x: number, y: number, textMatrix: _MatrixHelper): _MatrixHelper {
        const matrix: _MatrixHelper = new _MatrixHelper(textMatrix._m11, textMatrix._m12, textMatrix._m21, textMatrix._m22,
                                                        textMatrix._m11 * x + textMatrix._m21 * y + textMatrix._offsetX,
                                                        textMatrix._m12 * x + textMatrix._m22 * y + textMatrix._offsetY);
        return matrix;
    }
    _getCharacterWidth(width: number, currentFont: _FontStructure): number {
        let advancedWidth: number;
        if (currentFont._type === 'TrueType') {
            advancedWidth = width;
        } else {
            advancedWidth = 1 ;
        }
        return advancedWidth;
    }
    _setNewLineWithLeading(textState: _TextState): void {
        textState._carriageReturn();
    }
    _setTextMatrix(element: string[], textState: _TextState): void {
        textState._setTextMatrix(
            parseFloat(element[0]), parseFloat(element[1]), parseFloat(element[2]),
            parseFloat(element[3]), parseFloat(element[4]), parseFloat(element[5])
        );
        textState._setTextLineMatrix(
            parseFloat(element[0]), parseFloat(element[1]), parseFloat(element[2]),
            parseFloat(element[3]), parseFloat(element[4]), parseFloat(element[5])
        );
    }
    _beginText(textState: _TextState, identityMatrix: number[]): void {
        textState._textMatrix = identityMatrix.slice();
        textState._textLineMatrix = identityMatrix.slice();
    }
    _setFont(element: string[], textState: _TextState): void {
        for (let j: number = 0; j < element.length; j++) {
            if (element[Number.parseInt(j.toString(), 10)].indexOf('/') !== -1) {
                textState._font = element[Number.parseInt(j.toString(), 10)].replace('/', '');
                break;
            }
        }
        textState._fontSize = Number(element[1]);
    }
    _moveTextPlacementAndSetLeading(element: string[], textState: _TextState): void {
        textState._leading = -Number(element[1]);
        textState._translateTextLineMatrix(Number(element[0]), Number(element[1]));
        textState._textMatrix = textState._textLineMatrix.slice();
    }
    _setTextRise(element: string[], textState: _TextState): void {
        textState._textRise = Number(element[0]);
    }
    _setCharSpacing(element: string[], textState: _TextState): void {
        textState._charSpacing = Number(element[0]);
    }
    _setWordSpacing(element: string[], textState: _TextState): void {
        textState._wordSpacing = Number(element[0]);
    }
    _setTextHorizontalScale(element: string[], textState: _TextState): void {
        textState._textHScale = Number(element[0]) / 100;
    }
    _updateTextLeading(element: string[], textState: _TextState): void {
        textState._leading = Number(element[0]);
    }
    _moveTextPlacement(element: string[], textState: _TextState): void {
        textState._translateTextLineMatrix(Number(element[0]), Number(element[1]));
        textState._textMatrix = textState._textLineMatrix.slice();
    }
    _getCurrentTransform(font: _FontStructure, fontMatrix: number[], textState: _TextState): number[] {
        const  tsm: number[] = [textState._fontSize * textState._textHScale, 0, 0, textState._fontSize, 0, textState._textRise];
        if (font._isType3Font && textState._fontSize <= 1 && !_isArrayEqual(fontMatrix, [0.001, 0, 0, 0.001, 0, 0])) {
            const glyphHeight: number = font._boundingBox[3] - font._boundingBox[1];
            if (glyphHeight > 0) {
                tsm[3] *= glyphHeight * fontMatrix[3];
            }
        }
        return this._transform(textState._ctm, this._transform(textState._textMatrix, tsm));
    }
    _isFoundText(x: number, y: number, page: PdfPage, redactBounds: {x: number, y: number, width: number, height: number}[]): boolean {
        let isFound: boolean = false;
        let location: number[] = [];
        if (y < 0) {
            y = -y;
        }
        const rectValue: {x: number, y: number, width: number, height: number} = {x: 0, y: 0, width: 0, height: 0};
        const redactionBounds: {x: number, y: number, width: number, height: number}[] = redactBounds;
        location = this._getRelativeLocation(x, y, page);
        let yPosition: number = Math.floor(location[1]);
        const count: number = redactionBounds.length;
        for (let i: number = 0; i < count; i++) {
            const bounds: {x: number, y: number, width: number, height: number} = redactionBounds[Number.parseInt(i.toString(), 10)];
            const ypos: number = Math.floor(redactionBounds[Number.parseInt(i.toString(), 10)].y);
            if (ypos === yPosition || (ypos === (yPosition - 1)) || (ypos === (yPosition + 1))) {
                isFound = true;
                break;
            }
            if ((bounds.y >=  yPosition  && yPosition >= (bounds.y - bounds.height)) || (bounds.y <= yPosition && yPosition <= (bounds.y
                 + bounds.height))) {
                isFound = true;
                break;
            }
            const size: number[] = page.size;
            yPosition = Math.floor(size[1] - y);
            if ((bounds.y >= yPosition && yPosition >= (bounds.y - bounds.height)) || (bounds.y <= yPosition && yPosition <= (bounds.y +
                 bounds.height))) {
                isFound = true;
                break;
            }
            if (rectValue.y !== 0) {
                if (rectValue.y < 0) {
                    rectValue.y = -rectValue.y;
                }
                yPosition = Math.floor(y + rectValue.y);
                if ((bounds.y >= yPosition && yPosition >= (bounds.y - bounds.height)) || (bounds.y <= yPosition && yPosition <= (bounds.y +
                     bounds.height))) {
                    isFound = true;
                    break;
                }
                if (rectValue.height < 0) {
                    rectValue.height = -rectValue.height;
                }
                yPosition = Math.floor(rectValue.height - yPosition);
                if ((bounds.y >= yPosition && yPosition >= (bounds.y - bounds.height)) || (bounds.y <= yPosition && yPosition <= (bounds.y +
                     bounds.height))) {
                    isFound = true;
                    break;
                }
            }
        }
        return isFound;
    }
    _getRelativeLocation(x: number, y: number , page: PdfPage): number[] {
        const location: number[] = [x, y];
        if (page.rotation === PdfRotationAngle.angle90) {
            location[0] = page.size[1] - y;
            location[1] = x;
        } else if (page.rotation === PdfRotationAngle.angle270) {
            location[0] = page.size[0] - x;
            location[1] = y;
        }
        return location;
    }
    _transform(m1: number[], m2: number[]): number[] {
        return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3]
            , m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
    }
    _getCropOrMediaBox(page: PdfPage): number[] {
        const cropOrMediaBox: number[] = [];
        if (page.cropBox[0] !== 0 || page.cropBox[3] !== 0) {
            cropOrMediaBox[0] = page.cropBox[0];
            cropOrMediaBox[1] = page.cropBox[2];
            cropOrMediaBox[2] = page.cropBox[3];
        } else if (page.mediaBox[0] !== 0 || page.mediaBox[3] !== 0) {
            cropOrMediaBox[0] = page.mediaBox[0];
            cropOrMediaBox[1] = page.mediaBox[2];
            cropOrMediaBox[2] = page.mediaBox[3];
        }
        return cropOrMediaBox;
    }
    _getSplitText(encodedText: string, font: _FontStructure, inputText: string[], isForRedaction: boolean = false): { decodedList:
    string[], inputType?: string[] } {
        const decodedList: string[] = [];
        let key: string = '';
        const encoding: string = font._encoding;
        const inputType: string[] = isForRedaction ? [] : undefined;
        let tempString: string = '';
        let splittedText: string[];
        let isHex: boolean = false;
        let isWidth: boolean;
        switch (encodedText[0]) {
        case '(':
            encodedText = encodedText.substring(1, encodedText.length - 1);
            if (encodedText.indexOf('\\\n') !== -1 || encodedText.indexOf('\\(') !== -1 || encodedText.indexOf('\\)') !== -1) {
                if (encodedText.indexOf('\\\n') !== -1) {
                    encodedText = encodedText.replace(/\\\n/g, '');
                }
                if (encodedText.indexOf('\\(') !== -1) {
                    encodedText = encodedText.replace(/\\\(/g, '(');
                }
                if (encodedText.indexOf('\\)') !== -1) {
                    encodedText = encodedText.replace(/\\\)/g, ')');
                }
            }
            if (encodedText.indexOf('\\n') !== -1) {
                encodedText = encodedText.replace(/\\n/g, '\n');
            }
            if (encodedText.indexOf('\\r') !== -1) {
                encodedText = encodedText.replace(/\\r/g, '\r');
            }
            encodedText = _getLiteralString(encodedText, encoding);
            encodedText = _skipEscapeSequence(encodedText);
            key = encodedText + 's';
            decodedList.push(key);
            if (isForRedaction) {
                inputType.push(' ');
            }
            break;
        case '[':
            splittedText = inputText;
            isHex = false;
            for (let i: number = 0; i < splittedText.length; i++) {
                let input: string = splittedText[Number.parseInt(i.toString(), 10)];
                isWidth = false;
                if (input.indexOf('\\\n') !== -1) {
                    input = input.replace(/\\\n/g, '');
                }
                if (input[0] === '<') {
                    isHex = true;
                    if (isForRedaction) {
                        inputType.push(input);
                    }
                    input = input.slice(1, -1);
                } else if (input[0] === '(') {
                    input = input.slice(1, -1);
                } else if (input.length > 0){
                    input = input.replace('\n', '');
                    decodedList.push(input);
                    if (isForRedaction) {
                        inputType.push(' ');
                    }
                    continue;
                }
                if (isHex) {
                    tempString = _hexToChar(input);
                } else {
                    tempString = _getLiteralString(input, encoding);
                    if (tempString.indexOf('\\') !== -1) {
                        tempString = _skipEscapeSequence(tempString);
                    }
                }
                if (!isWidth && input.length > 0) {
                    key = tempString + 's';
                    decodedList.push(key);
                    key = '';
                    if (isForRedaction && !isHex) {
                        inputType.push(' ');
                    }
                    isHex = false;
                }
            }
            break;
        case '<':
            encodedText = encodedText.substring(1, encodedText.length - 1);
            tempString =  _hexToChar(encodedText);
            key = tempString + 's';
            decodedList.push(key);
            break;
        }
        return isForRedaction ? { decodedList, inputType } : { decodedList };
    }
    _getPageRotation(textState: _TextState): number {
        let rotation: number = 0;
        if (textState._textMatrix[0] === 0 && textState._textMatrix[1] > 0 && textState._textMatrix[2] < 0 &&
            textState._textMatrix[3] >= 0) {
            rotation = 90;
        } else if (textState._textMatrix[0] === 0 && textState._textMatrix[1] < 0 && textState._textMatrix[2] > 0
            && textState._textMatrix[3] === 0) {
            rotation = 270;
        }
        return rotation;
    }
    _splitHexString(hexString: string): string[] {
        const hexList: string[] = [];
        if (typeof(hexString) === 'undefined') {
            return hexList;
        }
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
    _getFallBackFontDictionary(crossReference: _PdfCrossReference): _PdfDictionary {
        const dictionary: _PdfDictionary = new _PdfDictionary(crossReference);
        dictionary.set('BaseFont', new _PdfName('Helvetica'));
        dictionary.set('Type', new _PdfName('FallbackType'));
        dictionary.set('Subtype', new _PdfName('FallbackType'));
        dictionary.set('Encoding', new _PdfName('WinAnsiEncoding'));
        return dictionary;
    }
    _processCommand(token: string, element: string[], state: _GraphicState): void {
        let args: number[] = [];
        switch (token) {
        case 'q':
            state._save();
            break;
        case 'Q':
            state._restore();
            break;
        case 'cm':
            args = [parseFloat(element[0]), parseFloat(element[1]), parseFloat(
                element[2]), parseFloat(element[3]), parseFloat(element[4]), parseFloat(element[5])];
            state._transform(args);
        }
    }
    _getTextFont(fontCollection: Map<string, _FontStructure>, textState: _TextState, crossReference: _PdfCrossReference): _FontStructure {
        let currentFont: _FontStructure;
        if (fontCollection.get(textState._font)) {
            currentFont = fontCollection.get(textState._font);
        } else {
            const dictionary: _PdfDictionary = this._getFallBackFontDictionary(crossReference);
            currentFont = new _FontStructure(dictionary, crossReference);
        }
        return currentFont;
    }
    _getTextContentItem(currentFont: _FontStructure, text: string, extraSpacing: number, textState: _TextState, page: PdfPage,
                        tempString: string, previousRect: { x: number, y: number, width: number, height: number }, extractedText: string, parser?: _PdfContentParserHelper, textGlyphs?: TextGlyph[], hex?: string[], index?: number, encodedText?: string[]): any { // eslint-disable-line
        text = text.slice(0, -1  );
        let fontSize: number = 0;
        let isHex: boolean = false;
        let textBounds: { x: number, y: number, width: number, height: number } = {x: 0, y: 0, width: 0 , height: 0};
        if (typeof(hex) !== 'undefined' && hex.length > 0) {
            isHex = true;
        }
        let glyphs: any = currentFont._charsToGlyphs(text); // eslint-disable-line
        const ii: number = glyphs.length;
        let scale: number = 0;
        if (currentFont. _fontMatrix) {
            scale = currentFont._fontMatrix[0];
        } else {
            currentFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
            scale = 0.001;
        }
        const rotation: number = this._getPageRotation(textState);
        for (let i: number = 0; i < ii; i++) {
            const glyph: any = glyphs[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
            // this._resultantText += glyph._unicode;
            let width: number;
            let charSpacing: number = textState._charSpacing + (i + 1 === ii ? extraSpacing : 0);
            let glyphWidth: number = glyph._width;
            if (currentFont._vertical) {
                glyphWidth = glyph.vmetric ? glyph.vmetric[0] : -glyphWidth;
            }
            let scaledDim: number = glyphWidth * scale * textState._fontSize;
            width = scale * glyphWidth;
            let height: number = 0;
            let tempFontSize: number = 0;
            const transform: number[] = this._getCurrentTransform(currentFont, currentFont._fontMatrix, textState);
            const cropOrMediaBox: number[] = this._getCropOrMediaBox(page);
            let x: number = transform[4];
            let y: number = 0;
            if (page.rotation === PdfRotationAngle.angle180 || page.rotation === PdfRotationAngle.angle270) {
                x = cropOrMediaBox[1] - x;
            } else {
                x = x - cropOrMediaBox[0];
            }
            if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle180) {
                y = transform[5];
            } else {
                y = cropOrMediaBox[2] - transform[5];
            }
            if (!currentFont._vertical) {
                height = Math.hypot(transform[2], transform[3]);
            } else {
                width = Math.hypot(transform[0], transform[1]);
            }
            if (transform[0] > 0) {
                tempFontSize = transform[0];
            } else if (transform[1] !== 0 && transform[2] !== 0) {
                if (transform[1] < 0) {
                    tempFontSize = -transform[1];
                } else {
                    tempFontSize = transform[1];
                }
            }
            if (glyph._unicode === ' ') {
                if (!currentFont._vertical) {
                    charSpacing += scaledDim + textState._wordSpacing;
                    textState._translateTextMatrix(charSpacing * (textState._textHScale), 0);
                    width *= tempFontSize;
                    if (rotation === 90) {
                        y = y - width;
                        x = x - height + height / 4 ;
                    } else if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle180) {
                        y = y -  height + (height / 1.3333333333333333);
                    } else  {
                        y = y - height / 1.3333333333333333;
                    }
                } else {
                    charSpacing += -scaledDim + textState._wordSpacing;
                    textState._translateTextMatrix(0, -charSpacing);
                    height += tempFontSize;
                    x = x - width / 2;
                }
            }
            if (glyph._unicode !== ' ') {
                if (!currentFont._vertical) {
                    scaledDim *= textState._textHScale;
                    textState._translateTextMatrix(scaledDim, 0);
                    width *= tempFontSize;
                    if (rotation === 90) {
                        y = y - width;
                        x = x - height + height / 4 ;
                    } else if (page.rotation === PdfRotationAngle.angle90 || page.rotation === PdfRotationAngle.angle180) {
                        y = y - height + (height / 1.3333333333333333);
                    } else {
                        y = y - (height / 1.3333333333333333);
                    }
                } else {
                    textState._translateTextMatrix(0, scaledDim);
                    scaledDim = Math.abs(scaledDim);
                    height += scaledDim + tempFontSize;
                    x = x - width / 2;
                }
            }
            if (page.rotation === PdfRotationAngle.angle0 && rotation === 90) {
                textBounds = {x: x, y: y, width: height, height: width};
            } else if (page.rotation === PdfRotationAngle.angle90) {
                textBounds = {x: y, y: x, width: height, height: width};
            } else if (page.rotation === PdfRotationAngle.angle180) {
                textBounds = {x: x - width, y: y, width: width, height: height};
            } else if (page.rotation === PdfRotationAngle.angle270) {
                textBounds = {x: y, y: x - width, width: height, height: width};
            } else {
                textBounds = {x: x, y: y, width: width, height: height};
            }
            extractedText += glyph._unicode;
            if (typeof(textGlyphs) !== 'undefined') {
                const bounds: { x: number, y: number, width: number, height: number } = textBounds;
                const textGlyph: TextGlyph = new TextGlyph();
                if (isHex && hex.length >= i) {
                    textGlyph._isHex = true;
                    encodedText[Number.parseInt(index.toString(), 10)] = hex[Number.parseInt(i.toString(), 10)];
                } else {
                    encodedText[Number.parseInt(index.toString(), 10)] = glyph._fontCharacter;
                }
                textGlyph._text = glyph._unicode;
                textGlyph._bounds = [bounds.x, bounds.y, bounds.width, bounds.height];
                textGlyph._fontName = currentFont._name;
                textGlyph._fontStyle = currentFont._fontStyle;
                textGlyph._fontSize = textState._fontSize;
                textGlyph._color = textState._textColor;
                textGlyph._width = glyph._width;
                textGlyph._charSpacing = textState._charSpacing;
                textGlyph._wordSpacing = textState._wordSpacing;
                index++;
                if (page.rotation !== PdfRotationAngle.angle0) {
                    textGlyph._isRotated = true;
                } else {
                    textGlyph._isRotated = false;
                }
                textGlyphs.push(textGlyph);
            } else {
                fontSize = textState._fontSize;
                const result: any = parser._splitWords(glyph._unicode, tempString, currentFont._name,// eslint-disable-line
                                                       currentFont._fontStyle, page, rotation, textState._textColor, textState._fontSize,
                                                       textBounds, previousRect);
                previousRect = result.previousRect;
                tempString = result.tempString;
                if (previousRect) {
                    previousRect = {x: textBounds.x, y: textBounds.y,
                        width: textBounds.width, height: textBounds.height};
                } else {
                    previousRect = {x: 0, y: 0, width: 0 , height: 0};
                }
            }
            if (charSpacing && glyph._unicode !== ' ') {
                if (!currentFont._vertical) {
                    textState._translateTextMatrix(charSpacing * textState._textHScale, 0);
                } else {
                    textState._translateTextMatrix(0, -charSpacing);
                }
            }
        }
        if (typeof(textGlyphs) !== 'undefined') {
            return {textGlyphs, extractedText, encodedText, index};
        } else {
            return {tempString, extractedText, fontSize, previousRect};
        }
    }
}
