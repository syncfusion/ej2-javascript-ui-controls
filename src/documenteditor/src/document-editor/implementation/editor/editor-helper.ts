import { isNullOrUndefined, NumberFormatOptions, Internationalization, DateFormatOptions } from '@syncfusion/ej2-base';
import { LineWidget, ElementBox, BodyWidget, ParagraphWidget, TextElementBox, BlockWidget } from '../viewer/page';
import { WCharacterFormat, WCellFormat, TextPosition, TextSearchResults } from '../index';
import { HighlightColor, TextFormFieldType, CheckBoxSizeType, RevisionType, CollaborativeEditingAction, CompatibilityMode } from '../../base/types';
import { Widget, FieldElementBox } from '../viewer/page';
import { Dictionary } from '../..';
import { WBorder } from '../format';
/**
 * @private
 */
export class HelperMethods {
    /**
     * @private
     */
    public static wordBefore: string = '\\b';
    /**
     * @private
     */
    public static wordAfter: string = '\\b';
    /**
     * @private
     */
    public static wordSplitCharacters: string[] = [' ', ',', '.', ':', ';', '<', '>', '=',
        '+', '-', '_', '{', '}', '[', ']', '`', '~', '!', '@', '#', '$', '%', '^', '&',
        '*', '(', ')', '"', '?', '/', '|', '\\', '”', '　', '،', '؟', '؛', '’', '‘'];
    /**
     * Inserts text at specified index in string.
     *
     * @private
     * @param {string} spanText - Specifies the span text.
     * @param {number} index - Specifies the index
     * @param {string} text - Specifies the text
     * @returns {string} - Returns modified string
     */
    public static insert(spanText: string, index: number, text: string): string {
        if (index >= 0) {
            return [spanText.slice(0, index) + text + spanText.slice(index)].join('');
        } else {
            return text + this;
        }
    }
    /**
     * Removes text from specified index in string.
     *
     * @private
     * @param {string} text - Specifies the text
     * @param {number} index - Specifies the index
     * @returns {string} - Returns modified string
     */
    public static remove(text: string, index: number): string {
        if (index === 0) {
            return text.substring(index + 1, text.length);
        } else {
            return text.substring(0, index) + text.substring(index + 1, text.length);
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    public static indexOfAny(text: string, wordSplitCharacter: string[]): any {
        let index: any = undefined;
        for (let j: number = 0; j < wordSplitCharacter.length; j++) {
            const temp: number = text.indexOf(wordSplitCharacter[j]);
            if (temp !== -1 && isNullOrUndefined(index)) {
                index = temp;
            } else if (temp !== -1 && temp < index) {
                index = temp;
            }
        }
        return isNullOrUndefined(index) ? -1 : index;
    }

    public static lastIndexOfAny(text: string, wordSplitCharacter: string[]): number {
        for (let i: number = text.length - 1; i >= 0; i--) {
            for (let j: number = 0; j <= wordSplitCharacter.length - 1; j++) {
                if (text[i] === wordSplitCharacter[j]) {
                    return i;
                }
            }
        }
        return -1;
    }

    public static addCssStyle(css: string): void {
        const style: HTMLStyleElement = document.createElement('style');
        if (style.style.cssText) {
            style.style.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    public static getHighlightColorCode(highlightColor: HighlightColor): string {
        let color: string = '#ffffff';
        switch (highlightColor) {
        case 'Yellow': color = '#ffff00';
            break;
        case 'BrightGreen': color = '#00ff00';
            break;
        case 'Turquoise': color = '#00ffff';
            break;
        case 'Pink': color = '#ff00ff';
            break;
        case 'Blue': color = '#0000ff';
            break;
        case 'Red': color = '#ff0000';
            break;
        case 'DarkBlue': color = '#000080';
            break;
        case 'Teal': color = '#008080';
            break;
        case 'Green': color = '#008000';
            break;
        case 'Violet': color = '#800080';
            break;
        case 'DarkRed': color = '#800000';
            break;
        case 'DarkYellow': color = '#808000';
            break;
        case 'Gray50': color = '#808080';
            break;
        case 'Gray25': color = '#c0c0c0';
            break;
        case 'Black': color = '#000000';
            break;
        }
        return color;
    }
    public static isVeryDark(backColor: string): boolean {
        const backgroundColor: string = backColor.substring(1);
        const r: number = parseInt(backgroundColor.substr(0, 2), 16);
        const g: number = parseInt(backgroundColor.substr(2, 2), 16);
        const b: number = parseInt(backgroundColor.substr(4, 2), 16);
        const contrast: number = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return contrast <= 60;
    }
    public static getColor(color: string): string {
        if (color.length > 0) {
            if (color[0] === '#') {
                if (color.length > 7) {
                    return color.substr(0, 7);
                }
            }
        }
        return color;
    }

    public static convertPointToPixel(point: number): number {
        const pixel: number = HelperMethods.round((point * 96 / 72), 5);
        return pixel;
    }

    public static convertPixelToPoint(pixel: number): number {
        const point: number = HelperMethods.round((pixel * 72 / 96), 5);
        return point;
    }

    public static isLinkedFieldCharacter(inline: ElementBox): boolean {
        if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 0) {
            return !isNullOrUndefined(inline.fieldEnd);
        } else if (inline instanceof FieldElementBox && (inline as FieldElementBox).fieldType === 2) {
            return !isNullOrUndefined(inline.fieldBegin) && !isNullOrUndefined(inline.fieldEnd);
        } else {
            return !isNullOrUndefined((inline as FieldElementBox).fieldBegin);
        }
    }
    /**
     * Removes white space in a string.
     *
     * @private
     * @param {string} text - Specifies text to trim.
     * @returns {string} - Returns modified text.
     */
    public static removeSpace(text: string): string {
        if (!isNullOrUndefined(text) && text.length !== 0) {
            for (let i: number = 0; i < text.length; i++) {
                if (text.charAt(i) === ' ') {
                    //replace the space by empty string in string
                    text = text.replace(' ', '');
                }
            }
        }
        return text;
    }
    /**
     * Trims white space at start of the string.
     *
     * @private
     * @param {string} text - Specifies text to trim.
     * @returns {string} - Returns modified text.
     */
    public static trimStart(text: string): string {
        let i: number = 0;
        for (i; i < text.length; i++) {
            if (text[i] !== ' ') {
                break;
            }
        }
        return text.substring(i, text.length);
    }
    /**
     * Trims white space at end of the string.
     *
     * @private
     * @param {string} text - Specifies text to trim.
     * @returns {string} - Returns modified text.
     */
    public static trimEnd(text: string): string {
        let i: number = text.length - 1;
        for (i; i >= 0; i--) {
            if (text[i] !== ' ') {
                break;
            }
        }
        return text.substring(0, i + 1);
    }
    /**
     * Checks whether string ends with whitespace.
     *
     * @private
     * @param {string} text - Specifies the text.
     * @returns {boolean} - Returns true if text ends with specified text.
     */
    public static endsWith(text: string): boolean {
        if (!isNullOrUndefined(text) && text.length !== 0) {
            return text[text.length - 1] === ' ';
        }
        return false;
    }

    public static addSpace(length: number): string {
        let str: string = '';
        if (length > 0) {
            for (let i: number = 0; i < length; i++) {
                str += ' ';
            }
        }
        return str;
    }

    /* eslint-disable */
    public static writeCharacterFormat(characterFormat: any, isInline: boolean, format: WCharacterFormat): void {
        characterFormat.bold = isInline ? format.bold : format.getValue('bold');
        characterFormat.italic = isInline ? format.italic : format.getValue('italic');
        characterFormat.fontSize = isInline ? this.toWriteInline(format, 'fontSize') : format.getValue('fontSize');
        characterFormat.fontFamily = isInline ? this.toWriteInline(format, 'fontFamily') : format.getValue('fontFamily');
        characterFormat.underline = isInline ? format.underline : format.getValue('underline');
        characterFormat.strikethrough = isInline ? format.strikethrough : format.getValue('strikethrough');
        characterFormat.baselineAlignment = isInline ? format.baselineAlignment : format.getValue('baselineAlignment');
        characterFormat.highlightColor = isInline ? format.highlightColor : format.getValue('highlightColor');
        characterFormat.fontColor = isInline ? this.toWriteInline(format, 'fontColor') : format.getValue('fontColor');
        characterFormat.styleName = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : undefined;
        characterFormat.bidi = isInline ? format.bidi : format.getValue('bidi');
        characterFormat.bdo = isInline ? format.bdo : format.getValue('bdo');
        characterFormat.boldBidi = isInline ? format.boldBidi : format.getValue('boldBidi');
        characterFormat.italicBidi = isInline ? format.italicBidi : format.getValue('italicBidi');
        characterFormat.fontSizeBidi = isInline ? format.fontSizeBidi : format.getValue('fontSizeBidi');
        characterFormat.fontFamilyBidi = isInline ? format.fontFamilyBidi : format.getValue('fontFamilyBidi');
        characterFormat.allCaps = isInline ? format.allCaps : format.getValue('allCaps');
    }
    public static toWriteInline(format: WCharacterFormat, propertyName: string): any {
        if (!isNullOrUndefined(format.ownerBase) && (format.ownerBase instanceof ElementBox)) {
            return format.hasValue(propertyName) ? format[propertyName] : format.getValue(propertyName);
        } else {
            return format[propertyName];
        }
    }
    /* eslint-enable */
    public static round(value: number, decimalDigits: number): number {
        let temp: number = value;
        for (let i: number = 0; i < decimalDigits; i++) {
            temp = temp * 10;
        }
        temp = Math.round(temp);
        for (let i: number = 0; i < decimalDigits; i++) {
            temp = temp / 10;
        }
        return temp;
    }
    public static reverseString(text: string): string {
        if (!isNullOrUndefined(text) && text !== '') {

            // return a new array
            const splitString: string[] = text.split('');
            // reverse the new created array
            const reverseString: string[] = splitString.reverse();
            // join all elements of the array into a string
            text = reverseString.join('');
        }
        return text;
    }

    public static formatClippedString(base64ImageString: string): ImageFormatInfo {
        let extension: string = '';
        let formatClippedString: string = '';
        if (this.startsWith(base64ImageString, 'data:image/bmp;base64,')) {
            extension = '.bmp';
            formatClippedString = base64ImageString.replace('data:image/bmp;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/x-emf;base64,')) {
            extension = '.emf';
            formatClippedString = base64ImageString.replace('data:image/x-emf;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/exif;base64,')) {
            extension = '.exif';
            formatClippedString = base64ImageString.replace('data:image/exif;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/gif;base64,')) {
            extension = '.gif';
            formatClippedString = base64ImageString.replace('data:image/gif;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/icon;base64,')) {
            extension = '.ico';
            formatClippedString = base64ImageString.replace('data:image/icon;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/jpeg;base64,')) {
            extension = '.jpeg';
            formatClippedString = base64ImageString.replace('data:image/jpeg;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/jpg;base64,')) {
            extension = '.jpg';
            formatClippedString = base64ImageString.replace('data:image/jpg;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/png;base64,')) {
            extension = '.png';
            formatClippedString = base64ImageString.replace('data:image/png;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/tiff;base64,')) {
            extension = '.tif';
            formatClippedString = base64ImageString.replace('data:image/tiff;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/x-wmf;base64,')) {
            extension = '.wmf';
            formatClippedString = base64ImageString.replace('data:image/x-wmf;base64,', '');
        } else {
            extension = '.jpeg';
        }
        return { 'extension': extension, 'formatClippedString': formatClippedString };
    }
    private static startsWith(sourceString: string, startString: string): boolean {
        return startString.length > 0 && sourceString.substring(0, startString.length) === startString;
    }

    public static formatText(format: string, value: string): string {
        let text: string = value;
        switch (format.toLowerCase()) {
        case 'uppercase':
            text = value.toUpperCase();
            break;
        case 'lowercase':
            text = value.toLowerCase();
            break;
        case 'firstlower':
            text = this.lowerFirstChar(value);
            break;
        case 'firstcapital':
            text = this.capitaliseFirst(value, 'FirstCapital');
            break;
        case 'titlecase':
            text = this.capitaliseFirst(value, 'Titlecase');
            break;
        }
        return text;
    }
    public static formatNumber(format: string, value: string): string {
        const intl: Internationalization = new Internationalization();
        const dotData: string[] = value.split('.');
        value = dotData[0];
        const numberValue: number = intl.parseNumber(value);
        if (value.toString() === 'NaN') {
            return '';
        }
        if (format === '') {
            format = '0';
        }
        const numberFormat: NumberFormatOptions = { format: format };
        return intl.formatNumber(numberValue, numberFormat);
    }

    public static formatDate(format: string, value: string): string {
        const intl: Internationalization = new Internationalization();
        const date: Date = new Date(value);
        if (isNaN(date.getDate())) {
            return '';
        }
        if (format === '') {
            return value;
        }
        if (format.indexOf('am/pm') !== -1) {
            format = format.replace(/am\/pm/gi, 'a');
        }
        const dateFormat: DateFormatOptions = { 'format': format };
        return intl.formatDate(date, dateFormat);
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    private static capitaliseFirst(value: string, type: string, splitBy?: string): string {
        let text: string = '';
        if (type === 'Titlecase') {
            const valArry: string[] = splitBy ? value.split(splitBy) : value.split(' ');
            for (let i: number = 0; i < valArry.length; i++) {
                /* eslint-disable-next-line max-len */
                text += splitBy ? valArry[i].charAt(0).toUpperCase() + valArry[i].slice(1, valArry[i].length) : this.capitaliseFirstInternal(valArry[i]);
                if (valArry.length >= 0 && !splitBy) {
                    text += ' ';
                }
            }
            if (!splitBy) {
                text = this.capitaliseFirst(text, 'Titlecase', '\r');
            }
        } else if (type === 'FirstCapital') {
            text = this.capitaliseFirstInternal(value);
        }
        return text;
    }

    private static lowerFirstChar(value: string): string {
        return (value.charAt(0).toLowerCase() + value.slice(1, value.length));
    }

    private static capitaliseFirstInternal(value: string): string {
        return (value.charAt(0).toUpperCase() + value.slice(1, value.length).toLowerCase());
    }
    public static getModifiedDate(date: string): string {
        const modifiedDate: Date = new Date(date);
        const dateString: string = modifiedDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        const time: string = modifiedDate.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
        const dateTime: string = dateString + ' ' + time;
        return dateTime;
    }
    public static getCompatibilityModeValue(compatibilityMode: CompatibilityMode): string {
        let compatValue: string;
        switch (compatibilityMode) {
        case 'Word2003':
            compatValue = '11';
            break;
        case 'Word2007':
            compatValue = '12';
            break;
        case 'Word2010':
            compatValue = '14';
            break;
        default:
            compatValue = '15';
            break;
        }
        return compatValue;
    }

}
/**
 * @private
 */
export class Point {
    private xIn: number = 0;
    private yIn: number = 0;

    public get x(): number {
        return this.xIn;
    }
    public set x(value: number) {
        this.xIn = value;
    }
    public get y(): number {
        return this.yIn;
    }
    public set y(value: number) {
        this.yIn = value;
    }

    public constructor(xPosition: number, yPosition: number) {
        this.xIn = xPosition;
        this.yIn = yPosition;
    }
    public copy(point: Point): void {
        this.xIn = point.xIn;
        this.yIn = point.yIn;
    }
    /**
     * Destroys the internal objects maintained.
     *
     * @returns {void}
     */
    public destroy(): void {
        this.xIn = undefined;
        this.yIn = undefined;
    }
}
/**
 * @private
 */
export class Base64 {
    private keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    // public method for encoding
    public encodeString(input: string): string {
        let output: string = '';
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let enc1: number;
        let enc2: number;
        let enc3: number;
        let enc4: number;
        let i: number = 0;

        input = this.unicodeEncode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);
        }
        return output;
    }
    // private method for UTF-8 encoding
    private unicodeEncode(input: string): string {
        const tempInput: string = input.replace(/\r\n/g, '\n');
        let utftext: string = '';

        for (let n: number = 0; n < tempInput.length; n++) {

            const c: number = tempInput.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    }

    public decodeString(input: string): Uint8Array {
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let enc1: number;
        let enc2: number;
        let enc3: number;
        let enc4: number;
        let i: number = 0;
        let resultIndex: number = 0;

        /*let dataUrlPrefix: string = 'data:';*/

        input = input.replace(/[^A-Za-z0-9+/=]/g, '');

        let totalLength: number = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === this.keyStr.charAt(64)) {
            totalLength--;
        }
        if (input.charAt(input.length - 2) === this.keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the input is not a base64 content
            // - the input is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the input uses a base64 variant (base64url for example)
            throw new Error('Invalid base64 input, bad content length.');
        }


        const output: Uint8Array = new Uint8Array(totalLength | 0);

        while (i < input.length) {

            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output[resultIndex++] = chr1;

            if (enc3 !== 64) {
                output[resultIndex++] = chr2;
            }
            if (enc4 !== 64) {
                output[resultIndex++] = chr3;
            }
        }
        return output;
    }
}
/**
 * TextSearchResultInfo
 */
export interface TextSearchResultInfo {
    startOffset: string
    endOffset: string
}

/**
 * Locked region selection info.
 */
export interface LockSelectionInfo {
    /**
     * Selection start of the locked region.
     */
    start: string
    /**
     * Selection end of the locked region.
     */
    end: string
    /**
     * Specifies collaborative editing room name.
     */
    roomName: string
    /**
     * Specifies author of the locked region.
     */
    author: string
    /**
     * Version of the collaborative editing session.
     */
    version: number
    /**
     * @private
     */
    previousLockInfo?: LockSelectionInfo
}
/**
 * Document Editor data
 */
export interface CollaborativeEditingEventArgs {
    /**
     * Specifies current action in collaborative session.
     */
    action: CollaborativeEditingAction
    /**
     * Specifies selection info.
     */
    selectionInfo?: LockSelectionInfo
    /**
     * Collaborative session version.
     */
    version?: number
    /**
     * Specifies modified data in SFDT format.
     */
    data?: string
    /**
     * Specifies author of the edit action.
     */
    author?: string
    /**
     * Specifies collaborative editing room name.
     */
    roomName?: string
}

/**
 * @private
 */
export interface SubWidthInfo {
    subWidth: number
    spaceCount: number
}
/**
 * @private
 */
export interface LineElementInfo {
    topMargin: number
    bottomMargin: number
    addSubWidth: boolean
    whiteSpaceCount: number
}
/**
 * @private
 */
export interface Color {
    r: number
    g: number
    b: number
}
/**
 * @private
 */
export interface CaretHeightInfo {
    height: number
    topMargin: number
    isItalic?: boolean
}
/**
 * @private
 */
export interface SizeInfo {
    width: number
    height: number
    topMargin: number
    bottomMargin: number
}
/**
 * @private
 */
export interface FirstElementInfo {
    element: ElementBox
    left: number
}
/**
 * @private
 */
export interface IndexInfo {
    index: string
}
/**
 * @private
 */
export interface ImagePointInfo {
    selectedElement: HTMLElement
    resizePosition: string
}
/**
 * @private
 */
export interface HyperlinkTextInfo {
    displayText: string
    isNestedField: boolean
    format: WCharacterFormat
}
/**
 * @private
 */
export interface BodyWidgetInfo {
    bodyWidget: BodyWidget
    index: number
}
/**
 * @private
 */
export interface ParagraphInfo {
    paragraph: ParagraphWidget
    offset: number
}
/**
 * @private
 */
export interface ErrorInfo {
    errorFound: boolean
    /* eslint-disable @typescript-eslint/no-explicit-any */
    elements: any[]
}
/**
 * @private
 */
export interface SpaceCharacterInfo {
    width: number
    wordLength: number
    isBeginning: boolean
}
/**
 * @private
 */
export interface SpecialCharacterInfo {
    beginningWidth: number
    endWidth: number
    wordLength: number
}
/**
 * @private
 */
export interface ContextElementInfo {
    element: ElementBox
    text: string
}
/**
 * @private
 */
export interface WordSpellInfo {
    hasSpellError: boolean
    isElementPresent: boolean
}
/**
 * @private
 */
export interface TextInLineInfo {
    elementsWithOffset: Dictionary<TextElementBox, number>
    fullText: string
}
/**
 * @private
 */
export interface CellInfo {
    start: number
    end: number
}
/**
 * @private
 */
export interface FieldCodeInfo {
    isNested: boolean
    isParsed: boolean
}
/**
 * @private
 */
export interface LineInfo {
    line: LineWidget
    offset: number
}
/**
 * @private
 */
export interface ElementInfo {
    element: ElementBox
    index: number
}
/**
 * @private
 */
export interface RevisionMatchedInfo {
    element: ElementBox
    isMatched: boolean
}
/**
 * @private
 */
export interface RevisionInfo {
    type: RevisionType
    color: string
}

/**
 * @private
 */
export interface MatchResults {
    matches: RegExpExecArray[]
    elementInfo: Dictionary<TextElementBox, number>
    textResults: TextSearchResults
}

/**
 * @private
 */
export interface TextPositionInfo {
    element: ElementBox
    index: number
    caretPosition: Point
    isImageSelected: boolean
}
/**
 * @private
 */
export interface ShapeInfo {
    element: ElementBox
    caretPosition: Point
    isShapeSelected: boolean
    isInShapeBorder: boolean
}
/**
 * @private
 */
export interface PageInfo {
    height: number
    width: number
    viewerWidth: number
    viewerHeight: number

}
/**
 * @private
 */
export interface CanvasInfo {
    height: number
    width: number
    viewerWidth: number
    viewerHeight: number
    containerHeight: number
    containerWidth: number
}
/**
 * @private
 */
export interface CellCountInfo {
    count: number
    cellFormats: WCellFormat[]
}
/**
 * @private
 */
export interface BlockInfo {
    node: Widget
    position: IndexInfo
}
/**
 * @private
 */
export interface WidthInfo {
    minimumWordWidth: number
    maximumWordWidth: number
}
/**
 * @private
 */
export interface RtlInfo {
    isRtl: boolean
    id: number
}

/**
 * @private
 */
export interface ImageFormatInfo {
    extension: string
    formatClippedString: string
}

/**
 * @private
 */
export interface PositionInfo {
    startPosition: TextPosition
    endPosition: TextPosition
}

/**
 * Text form field info
 */

export interface TextFormFieldInfo {
    /**
     * Specifies text form field type.
     */
    type: TextFormFieldType
    /**
     * Text form field default value.
     */
    defaultValue: string
    /**
     * Text form field format
     */
    format: string
    /**
     * Maximum text length.
     */
    maxLength: number
    /**
     * Enable or disable form field.
     */
    enabled: boolean
    /**
     * Tooltip text.
     */
    helpText: string
}

/**
 * CheckBox form field info
 */

export interface CheckBoxFormFieldInfo {
    /**
     * CheckBox form field size type.
     */
    sizeType: CheckBoxSizeType
    /**
     * CheckBox form field size.
     */
    size: number
    /**
     * CheckBox form field default value.
     */
    defaultValue: boolean
    /**
     * Enable or disable form field.
     */
    enabled: boolean
    /**
     * Tooltip text.
     */
    helpText: string
}

/**
 * DropDown form field info
 */

export interface DropDownFormFieldInfo {
    /**
     * DropDown items
     */
    dropdownItems: string[]
    /**
     * Enable or disable form field.
     */
    enabled: boolean
    /**
     * Tooltip text.
     */
    helpText: string

}

/**
 * @private
 */
export interface BorderInfo {
    border: WBorder
    width: number
}

/**
 * @private
 */
export interface FootNoteWidgetsInfo {
    footNoteWidgets: BlockWidget[];
    toBodyWidget: BodyWidget;
    fromBodyWidget: BodyWidget;
}

/**
 * @private
 */
export class WrapPosition {
    x: number = 0;
    width: number = 0;
    get right(): number {
        return this.x + this.width;
    }
    constructor(x: number, width: number) {
        this.x = x;
        this.width = width;
    }
}
