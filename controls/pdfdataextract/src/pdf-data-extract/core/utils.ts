import {_ContentParser, _PdfBaseStream, _PdfContentStream, _PdfCrossReference, _PdfDictionary, _PdfRecord, _PdfReference, PdfPage } from '@syncfusion/ej2-pdf';
import { _FontStructure } from './text-extraction/font-structure';
import { _GraphicState, _TextState } from './graphic-state';
import { _TextProcessingMode } from './enum';
import { _PdfContentParserHelper } from './content-parser-helper';
import { PdfDataExtractor } from './pdf-data-extractor';

/**
 * Removes escape sequences from a text string and returns the cleaned text.
 *
 * @param {string} text - The string to process.
 * @returns {string} The processed string without escape sequences.
 */
export function _ignoreEscapeSequence(text: string): string {
    let index: number = -1;
    do {
        index = text.indexOf('\\', index + 1);
        if (index >= 0) {
            if (text.length > index + 1) {
                const nextLiteral: string = text[index + 1];
                if (nextLiteral === '\\' || nextLiteral === '(' || nextLiteral === ')') {
                    text = text.slice(0, index) + text.slice(index + 1);
                }
            } else {
                text = text.slice(0, index) + text.slice(index + 1);
                index = -1;
            }
        }
    } while (index >= 0);
    return text;
}
/**
 * Adds font resources from a PDF dictionary into a collection.
 *
 * @param {_PdfDictionary} dictionary - PDF Dictionary containing font resources.
 * @param {_PdfCrossReference} crossReference - The cross-reference of the PDF document.
 * @returns {Map<string, _FontStructure>} A map of font structure objects.
 */
export function _addFontResources(dictionary: _PdfDictionary, crossReference: _PdfCrossReference): Map<string, _FontStructure> {
    const font: _PdfDictionary = dictionary.get('Font');
    const fontCollection: Map<string, _FontStructure> = new Map<string, _FontStructure>();
    if (typeof(font) !== 'undefined' && font !== null) {
        font.forEach((key: any, value: any) => { //eslint-disable-line
            const fontDictionary: _PdfDictionary = crossReference._fetch(value);
            const fontstruct: _FontStructure = new _FontStructure(fontDictionary, crossReference);
            fontCollection.set(key.toString(), fontstruct);
        });
    }
    return fontCollection;
}
/**
 * Retrieves XObject resources from a PDF dictionary and their associated cross-references.
 *
 * @param {_PdfDictionary} resources - The resources dictionary from a PDF page.
 * @param {_PdfCrossReference} crossReference - The cross-reference of the PDF document.
 * @returns {Map<string, any>} A map of XObject resources.
 */
export function _getXObjectResources(resources: _PdfDictionary, crossReference: _PdfCrossReference): Map<string, any> { //eslint-disable-line
    const xObjectCollection: Map<string, any> = new Map<string, any>(); //eslint-disable-line
    if (resources && resources.has('XObject')) {
        const xObjects: _PdfDictionary = resources.get('XObject') as _PdfDictionary;
        xObjects.forEach((key: any, value: any) => { //eslint-disable-line
            if (value instanceof _PdfReference) {
                const xobject: _PdfDictionary = crossReference._fetch(value) as _PdfDictionary;
                if (xobject instanceof _PdfBaseStream && xobject.dictionary.has('Subtype') && xobject.dictionary.get('Subtype').name === 'Form') {
                    xObjectCollection.set(key, xobject);
                }
            }
        });
    }
    return xObjectCollection;
}
/**
 * Converts a hexadecimal string to its equivalent character representation.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {string} The resulting string of characters.
 */
export function _hexToChar(hex: string): string {
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }
    hex = hex.replace(/\s+/g, '');
    let result: string = '';
    for (let i: number = 0; i < hex.length; i += 2) {
        const byte: string = hex.slice(i, i + 2);
        const charCode: number = parseInt(byte, 16);
        result += String.fromCharCode(charCode);
    }
    return result;
}
/**
 * Skips recognized escape sequences in a text string.
 *
 * @param {string} text - The string containing escape sequences.
 * @returns {string} A new string with escape sequences removed or handled appropriately.
 */
export function _skipEscapeSequence(text: string): string {
    let isDefault: boolean = false;
    let replaceText: string = text;
    let isAlphabetic: boolean = false;
    while (replaceText.indexOf('\\') !== -1) {
        isAlphabetic = false;
        const i: number = replaceText.indexOf('\\');
        if (i + 1 !== replaceText.length) {
            const escapeSequence: string = replaceText.substring(i + 1, i + 2);
            switch (escapeSequence) {
            case 'a':
                text = text.replace(/\\a/g, '\x07');
                break;
            case '(':
                text = text.replace(/\\\(/g, '(');
                break;
            case ')':
                text = text.replace(/\\\)/g, ')');
                break;
            case 'b':
                text = text.replace(/\\b/g, '\b');
                break;
            case 'e':
                text = text.replace(/\\e/g, '\\e');
                isAlphabetic = true;
                break;
            case 'f':
                text = text.replace(/\\f/g, '\f');
                break;
            case 'n':
                text = text.replace(/\\n/g, '\n');
                break;
            case 'r':
                text = text.replace(/\\r/g, '\r');
                break;
            case 't':
                text = text.replace(/\\t/g, '\t');
                break;
            case 'v':
                text = text.replace(/\\v/g, '\v');
                break;
            case "'": //eslint-disable-line
                text = text.replace(/\\'/g, "'"); //eslint-disable-line
                break;
            default: {
                const charCode: number = escapeSequence.charCodeAt(0);
                if (charCode === 3) {
                    text = text.replace(/\\/g, '\\');
                    isDefault = true;
                } else if (charCode >= 127) {
                    text = text.replace(/\\/g, '');
                    isDefault = true;
                } else if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
                    replaceText = replaceText.slice(0, i) + replaceText.slice(i + 1);
                    isAlphabetic = true;
                } else {
                    let isUnrecognizedEscapeSequence: boolean = false;
                    if (text.includes('\\')) {
                        for (let c: number = 0; c < text.length - 1; c++) {
                            const nextChar: string = text[c + 1];
                            if (text[Number.parseInt(c.toString(), 10)] === '\\' && text[c + 1] === '\\') {
                                c++;
                            } else if (text[Number.parseInt(c.toString(), 10)] === '\\' && /[A-Zdghijklmopqswyz]/.test(nextChar)) {
                                isUnrecognizedEscapeSequence = true;
                                break;
                            }
                        }
                    }
                    if (isUnrecognizedEscapeSequence) {
                        text = text.replace(/\\/g, '');
                    } else {
                        text = _parseEscapedText(text);
                    }
                    isDefault = true;
                }
                break;
            }
            }
            if (isDefault) {
                break;
            } else if (!isAlphabetic){
                replaceText = text;
            }
        } else {
            break;
        }
    }
    return text;
}
/**
 * Converts escape sequences in a string to their corresponding literal characters.
 *
 * @param {string} text The input string containing escape sequences.
 *
 * @returns {string} The parsed string with escape sequences replaced by literal characters.
 */
export function _parseEscapedText(text: string): string {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '\"') // eslint-disable-line
        .replace(/\\'/g, "'") // eslint-disable-line
        .replace(/\\</g, '<')
        .replace(/\\>/g, '>')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\{/g, '{')
        .replace(/\\\}/g, '}')
        .replace(/\\\[/g, '[')
        .replace(/\\\]/g, ']')
        .replace(/\\\|/g, '|')
        .replace(/\\\*/g, '*')
        .replace(/\\\?/g, '?')
        .replace(/\\\-/g, "-") // eslint-disable-line
        .replace(/\\\+/g, '+')
        .replace(/\\\./g, '.')
        .replace(/\\\//g, '/')
        .replace(/\\,/g, ',')
        .replace(/\\:/g, ':')
        .replace(/\\;/g, ';')
        .replace(/\\=/g, '=')
        .replace(/\\&/g, '&')
        .replace(/\\%/g, '%')
        .replace(/\\#/g, '#')
        .replace(/\\!/g, '!')
        .replace(/\\u([0-9A-Fa-f]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))) // eslint-disable-line
        .replace(/\\\\/g, '\\');
}
/**
 * Retrieves a literal string, decoding escape sequences and null characters.
 *
 * @param {string} encodedText - The encoded string to decode.
 * @param {string} [encoding] - The encoding used in the text.
 * @returns {string} The decoded literal string.
 */
export function _getLiteralString(encodedText: string, encoding?: string): string {
    let decodedText: string = encodedText;
    let octalIndex: number = -1;
    let limit: number = 3;
    let temp: string = '';
    while ((decodedText.indexOf('\\') !== -1 && (decodedText.indexOf('\\\\') === -1)) ||
           decodedText.indexOf('\0') ||
           ((decodedText.indexOf('\\\\') !== -1) && encoding === 'Encoding')) {
        let octalText: string = '';
        if (decodedText.indexOf('\\', octalIndex + 1) >= 0) {
            const nullPosition: number = decodedText.indexOf('\0', octalIndex + 1);
            octalIndex = decodedText.indexOf('\\', octalIndex + 1);
            if (nullPosition > -1 && octalIndex > nullPosition) {
                octalIndex = nullPosition;
                limit = 2;
            }
        } else {
            octalIndex = decodedText.indexOf('\0', octalIndex + 1);
            if (octalIndex < 0) {
                break;
            }
            limit = 2;
        }
        for (let i: number = octalIndex + 1; i <= octalIndex + limit; i++) {
            if (i < decodedText.length) {
                const val: number = parseInt(decodedText[Number.parseInt(i.toString(), 10)], 10);
                if (!isNaN(val) && val <= 8) {
                    octalText += decodedText[Number.parseInt(i.toString(), 10)];
                } else {
                    octalText = '';
                    break;
                }
            } else {
                octalText = '';
            }
        }
        if (octalText !== '') {
            const decimalValue: number = parseInt(octalText, 8);
            temp = String.fromCharCode(decimalValue);
            decodedText = decodedText.substring(0, octalIndex) + decodedText.substring(octalIndex + limit + 1);
            decodedText = decodedText.substring(0, octalIndex) + temp + decodedText.substring(octalIndex);
        }
    }
    if (decodedText.indexOf('\\') !== -1 && encoding === 'Encoding') {
        if (decodedText.indexOf('\\\\') === -1) {
            let initialLength: number = 0;
            while ((decodedText.indexOf('\\') === -1 && decodedText.indexOf('\\') !== -1) && (decodedText.length !== initialLength)) {
                initialLength = decodedText.length;
                decodedText = _skipEscapeSequence(decodedText);
            }
        }
    }
    return decodedText;
}
/**
 * Decodes encoded text using the specified font structure, adjusting for encoding differences.
 *
 * @param {string} encodedText - The encoded string to decode.
 * @param {_FontStructure} font - The font structure for decoding glyphs.
 * @param {string[]} inputText - An array of strings representing parts of the text.
 * @returns {string} The decoded text.
 */
export function _decodeEncodedText(encodedText: string, font: _FontStructure, inputText: string[]): string {
    let key: string = '';
    let isHex: boolean = false;
    let decodedText: any ; // eslint-disable-line
    let tempString: string = '';
    const decodedList: string[] = [];
    const encoding: string = font._encoding;
    let splittedText: string[] = inputText;
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
        decodedText = font._charsToGlyphs(encodedText);
        for (let i: number = 0; i < decodedText.length; i++) {
            key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
        }
        decodedText += key;
        break;
    case '[':
        splittedText = inputText;
        for (let i: number = 0; i < splittedText.length; i++) {
            let input: string = splittedText[Number.parseInt(i.toString(), 10)];
            if (input.indexOf('\\\n') !== -1) {
                input = input.replace(/\\\n/g, '');
            }
            if (input[0] === '<') {
                isHex = true;
                input = input.slice(1, -1);
            } else if (input[0] === '(') {
                input = input.slice(1, -1);
            } else if (input.length > 0){
                input = input.replace('\n', '');
                decodedList.push(input);
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
            decodedText = font._charsToGlyphs(tempString);
            for (let i: number = 0; i < decodedText.length; i++) {
                key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
            }
        }
        break;
    case '<':
        encodedText = encodedText.substring(1, encodedText.length - 1);
        tempString =  _hexToChar(encodedText);
        decodedText = font._charsToGlyphs(tempString);
        for (let i: number = 0; i < decodedText.length; i++) {
            key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
        }
        decodedText += key;
        break;
    }
    return key;
}
/**
 * Retrieves a content stream object for a specified XObject, processing it according to the provided mode.
 *
 * @param {string[]} xObjectElement - The XObject elements to process.
 * @param {PdfPage} page - The PDF page to which the content stream belongs.
 * @param {Map<string, any>} xObjectCollection - A collection of XObject elements.
 * @param {_PdfContentParserHelper | PdfDataExtractor} data - The data extractor or content parser helper.
 * @param {_TextProcessingMode} [mode] - The mode of text processing.
 * @param {_GraphicState} [graphicState] - The current graphic state.
 * @returns {_PdfContentStream | void} The processed PDF content stream or void.
 */
export function _getXObject(xObjectElement: string[], page: PdfPage, xObjectCollection: Map<string, any>, data?: _PdfContentParserHelper | PdfDataExtractor, mode?: _TextProcessingMode, graphicState?: _GraphicState): _PdfContentStream | void { //eslint-disable-line
    const xobject: string = xObjectElement[0].replace('/', '');
    let array: Uint8Array;
    let contentParser: _PdfContentParserHelper;
    let extractor: PdfDataExtractor;
    if (data instanceof _PdfContentParserHelper) {
        contentParser = data;
    } else {
        extractor = data;
    }
    if (xObjectCollection.has(xobject)) {
        let base: any = xObjectCollection.get(xobject); //eslint-disable-line
        if (base) {
            if (base instanceof _PdfContentStream) {
                array = new Uint8Array(base._bytes);
            } else if (base instanceof _PdfBaseStream) {
                array = base.getBytes();
            }
            if (array) {
                const parser: _ContentParser = new _ContentParser(array);
                const recordCollection: _PdfRecord[] = parser._readContent();
                let childFontCollection: Map<string, _FontStructure> = new Map<string, _FontStructure>();
                let xObjectCollection: Map<string, any> = new Map<string, any>();  //eslint-disable-line
                if (base.dictionary.has('Resources')) {
                    const childResources: _PdfDictionary = base.dictionary.get('Resources');
                    childFontCollection = _addFontResources(childResources, childResources._crossReference);
                    xObjectCollection = _getXObjectResources(childResources, childResources._crossReference);
                }
                let state: _GraphicState;
                if (typeof(mode) !== 'undefined') {
                    if (base.dictionary.has('Matrix')) {
                        const currentState: _TextState = graphicState._state._clone();
                        state = new _GraphicState(currentState);
                        const matrix: number[] = base.dictionary.get('Matrix');
                        if (matrix) {
                            state._transform(matrix);
                        }
                    } else {
                        state = graphicState;
                    }
                }
                if (mode === _TextProcessingMode.textLineExtraction || mode === _TextProcessingMode.textExtraction) {
                    contentParser._processRecordCollection(recordCollection, page, childFontCollection, xObjectCollection, state);
                } else if (mode === _TextProcessingMode.redaction) {
                    const pdfStream: any = contentParser._processRecordCollection(recordCollection, page, // eslint-disable-line
                                                                                  childFontCollection, xObjectCollection, state);
                    return pdfStream;
                } else {
                    extractor._renderTextAsLayOut(recordCollection, page, childFontCollection, xObjectCollection);
                }
            }
        }
    }
}
/**
 * Parses encoded text and returns both the decoded string list and width table.
 *
 * @param {string} encodedText - The encoded text string to be parsed.
 * @param {_FontStructure} font - The font structure used to map encoded characters to glyphs.
 * @returns {object} An object containing `decodedStrings`, a list of decoded strings, and `charWidths`, a list of character widths.
 */
export function _parseEncodedText(encodedText: string, font: _FontStructure): [string[], number[][]] {
    const decodedList: string[] = [];
    let key: string = '';
    let decodedText: any; // eslint-disable-line
    let widths: number[] = [];
    const widthtable: number[][] = [];
    let tempString: string = '';
    const isRotatePage: boolean = false;
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
        encodedText = _getLiteralString(encodedText);
        encodedText = _skipEscapeSequence(encodedText);

        if (!isRotatePage) {
            decodedText = font._charsToGlyphs(encodedText);
            for (let i: number = 0; i < decodedText.length; i++) {
                if (decodedText[Number.parseInt(i.toString(), 10)]._unicode.length > 1) {
                    key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
                    for (let j: number = 0; j < decodedText[Number.parseInt(i.toString(), 10)]._unicode.length; j++) {
                        widths.push(decodedText[Number.parseInt(i.toString(), 10)]._width);
                    }
                } else {
                    key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
                    widths.push(decodedText[Number.parseInt(i.toString(), 10)]._width);
                }
            }
        } else {
            key = encodedText;
        }
        key += 's';
        decodedList.push(key);
        widthtable.push(widths);
        break;
    case '[':
        encodedText = encodedText.replace(/\\\n/g, '');
        if (encodedText.length > 1) {
            encodedText = encodedText.substring(1, encodedText.length - 1);
        }
        while (encodedText.length > 0) {
            let isHex: boolean = false;
            let listElement: string = '';
            let textStart: number = encodedText.indexOf('(');
            let textEnd: number = encodedText.indexOf(')');
            for (let j: number = textEnd + 1; j < encodedText.length; j++) {
                if (encodedText[Number.parseInt(j.toString(), 10)] === '(') {
                    break;
                } else if (encodedText[Number.parseInt(j.toString(), 10)] === ')') {
                    textEnd = j;
                    break;
                }
            }
            const textHexStart: number = encodedText.indexOf('<');
            const textHexEnd: number = encodedText.indexOf('>');
            if (textHexStart < textStart && textHexStart > -1) {
                textStart = textHexStart;
                textEnd = textHexEnd;
                isHex = true;
            }
            if (textStart < 0) {
                textStart = encodedText.indexOf('<');
                textEnd = encodedText.indexOf('>');
                if (textStart >= 0) {
                    isHex = true;
                } else {
                    decodedList.push(encodedText);
                    break;
                }
            }
            if (textEnd < 0 && encodedText.length > 0) {
                decodedList.push(encodedText);
                break;
            } else if (textEnd > 0) {
                while (encodedText[textEnd - 1] === '\\') {
                    if (textEnd - 1 > 0 && encodedText[textEnd - 2] === '\\') {
                        break;
                    }
                    const nextEnd: number = encodedText.indexOf(')', textEnd + 1);
                    if (nextEnd >= 0) {
                        textEnd = nextEnd;
                    } else {
                        break;
                    }
                }
            }
            if (textStart !== 0) {
                listElement = encodedText.substring(0, textStart);
                decodedList.push(listElement);
            }
            let tempString: string = encodedText.substring(textStart + 1, textEnd);
            if (isHex) {
                tempString = _hexToChar(tempString);
            } else {
                tempString = _getLiteralString(tempString);
                if (tempString.indexOf('\\') !== -1) {
                    tempString = _skipEscapeSequence(tempString);
                }
            }
            if (!isRotatePage) {
                decodedText = font._charsToGlyphs(tempString);
                for (let i: number = 0; i < decodedText.length; i++) {
                    if (decodedText[Number.parseInt(i.toString(), 10)]._unicode.length > 1) {
                        key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
                        for (let j: number = 0; j < decodedText[Number.parseInt(i.toString(), 10)]._unicode.length; j++) {
                            widths.push(decodedText[Number.parseInt(i.toString(), 10)]._width);
                        }
                    } else {
                        key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
                        widths.push(decodedText[Number.parseInt(i.toString(), 10)]._width);
                    }
                }
            } else {
                key = tempString;
            }
            key += 's';
            decodedList.push(key);
            widthtable.push(widths);
            key = '';
            widths = [];
            encodedText = encodedText.substring(textEnd + 1);
        }
        break;

    case '<':
        encodedText = encodedText.substring(1, encodedText.length - 1);
        tempString = _hexToChar(encodedText);
        if (!isRotatePage) {
            decodedText = font._charsToGlyphs(tempString);
            for (let i: number = 0; i < decodedText.length; i++) {
                key += decodedText[Number.parseInt(i.toString(), 10)]._unicode;
                widths.push(decodedText[Number.parseInt(i.toString(), 10)]._width);
            }
        } else {
            key = tempString;
        }
        key += 's';
        decodedList.push(key);
        widthtable.push(widths);
        break;
    }
    return [decodedList, widthtable];
}
/**
 * Compare two arrays of numbers to determine if they are equal.
 *
 * This function checks if two arrays have the same length and
 * identical elements in the same order.
 *
 * @param {number[]} arr1 - The first array to compare.
 * @param {number[]} arr2 - The second array to compare.
 * @returns {boolean} 'true' if the arrays are equal, otherwise 'false'.
 */
export function _isArrayEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i: number = 0, ii: number = arr1.length; i < ii; i++) {
        if (arr1[Number.parseInt(i.toString(), 10)] !== arr2[Number.parseInt(i.toString(), 10)]) {
            return false;
        }
    }
    return true;
}
