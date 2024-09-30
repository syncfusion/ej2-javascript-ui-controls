import { isNullOrUndefined, NumberFormatOptions, Internationalization, DateFormatOptions, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { ZipArchive, ZipArchiveItem } from '@syncfusion/ej2-compression';
import { LineWidget, ElementBox, BodyWidget, ParagraphWidget, TextElementBox, BlockWidget, TableRowWidget, TableCellWidget, TableWidget } from '../viewer/page';
import { WCharacterFormat, WCellFormat, TextPosition, TextSearchResults, WList, WAbstractList, Revision, CommentElementBox } from '../index';
import { HighlightColor, TextFormFieldType, CheckBoxSizeType, RevisionType, CollaborativeEditingAction, CompatibilityMode, BaselineAlignment, Underline, Strikethrough, BiDirectionalOverride, BreakClearType, LineStyle, TextAlignment, LineSpacingType, OutlineLevel, VerticalAlignment } from '../../base/types';
import { Widget, FieldElementBox, CommentCharacterElementBox } from '../viewer/page';
import { Dictionary, MentionDataEditInfo } from '../..';
import { WBorder, WBorders, WParagraphFormat } from '../format';
import {
    boldProperty, italicProperty, fontSizeProperty, fontFamilyProperty, underlineProperty, underlineColorProperty,
    strikethroughProperty, baselineAlignmentProperty, highlightColorProperty, fontColorProperty,
    styleNameProperty, bidiProperty, bdoProperty, boldBidiProperty, italicBidiProperty, fontSizeBidiProperty,
    fontFamilyBidiProperty, allCapsProperty, localeIdBidiProperty, localeIdProperty, complexScriptProperty, fontFamilyAsciiProperty,
    characterSpacingProperty, scalingProperty, fontFamilyFarEastProperty, fontFamilyNonFarEastProperty, bordersProperty, leftIndentProperty,
    rightIndentProperty, firstLineIndentProperty, textAlignmentProperty, beforeSpacingProperty,
    afterSpacingProperty, spaceBeforeAutoProperty, spaceAfterAutoProperty, lineSpacingProperty,
    lineSpacingTypeProperty, outlineLevelProperty, listFormatProperty, tabsProperty,
    keepLinesTogetherProperty, keepWithNextProperty, contextualSpacingProperty, widowControlProperty,
    topProperty, leftProperty, rightProperty, bottomProperty, horizontalProperty, verticalProperty,
    colorProperty, hasNoneStyleProperty, lineStyleProperty, lineWidthProperty, shadowProperty, spaceProperty, inlinesProperty,
    characterFormatProperty, textProperty, fieldTypeProperty, hasFieldEndProperty, localeIdFarEastProperty
} from '../../index';
import { FieldSettingsModel } from '@syncfusion/ej2-navigations';

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
     * @returns {string} returns a string value
     * @param {string} text takes string as parameter
     * @private
     */
    private static replaceSpecialChars(text: string): string {
        text = text.replace('^[\\s]*', '');
        /* eslint-disable quotes */
        text = text.replace("^[#@!~\\$%^&\\*\\(\\)\\-_\\+\\.=\\{\\}\\[\\]:;,<>\\?'\\\\\"\\“\\”\\//0123456789]+", '');
        text = text.replace("[#@!~\\$%^&\\*\\(\\)\\-_\\+\\.=\\{\\}\\[\\]:;,<>\\?'\\\\\"\\“\\”\\//0123456789]+$", '');
        /* eslint-enable quotes */
        return text;
    }
    /**
     * @returns {any} returns any type
     * @param {string} text gets string as a input
     * @public
     */
    public static getSpellCheckData(text: string): any {
        text = text.replace('\r\n', ' ');
        text = text.replace('\n', ' ');
        text = text.replace('\r', ' ');
        text = text.replace('\v', ' ');
        text = text.replace('\t', ' ');
        text = text.replace('/', ' ');

        const stringarr: string[] = text.split(' ');
        const spellColl: any = [];
        for (const str of stringarr) {
            const spellInfo: any = {};
            spellInfo.Text = this.replaceSpecialChars(str);
            spellInfo.HasSpellError = false;
            spellColl.push(spellInfo);
        }
        return spellColl;
    }
    /**
     * Check given string is a valid either roman or arabic number
     * @private
     * @param {string} input input string value to check if it is a number
     * @returns {boolean} weather given string is a number or not
     */
    public static checkTextFormat(input: string): boolean {
        // Regular expression patterns for Roman and Arabic numerals
        const romanPattern: RegExp = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
        const arabicPattern: RegExp = /^[0-9]+$/;
        // Check if the input matches either pattern
        if (romanPattern.test(input) || arabicPattern.test(input)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * @returns {string}
     * Sanitize the string for xss string content
     * @param {string} value accepts a string value
     * @public
     */
    public static sanitizeString(value: string): string {
        if (isNullOrUndefined(value)) {
            return '';
        }
        const sanitizedContent: string = SanitizeHtmlHelper.sanitize(value)
            .replace(/&amp;/g, '&')
            .replace(/&nbsp;/g, String.fromCharCode(160))
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<');
        return sanitizedContent;
    }
    /**
     * @returns {any} returns any type
     * Get the SFDT document from the optimized SFDT.
     * @param {any} json accepts a json file
     * @public
     */
    public static getSfdtDocument(json: any): any {
        json = (json instanceof Object) ? json : JSON.parse(json);
        if (!isNullOrUndefined(json.sfdt)) {
            const zipArchive: ZipArchive = new ZipArchive();
            zipArchive.open(JSON.stringify(json.sfdt));
            const zipItem: ZipArchiveItem = zipArchive.items[0] as ZipArchiveItem;
            const value: Uint8Array = new Uint8Array(zipItem.data as ArrayBuffer);
            const str: string = new TextDecoder('utf-8').decode(value);
            json = JSON.parse(str);
        }
        // json = JSON.parse(this.sanitizeString(JSON.stringify(json)));
        return json;
    }
    /**
     * @returns {number}
     * Generates a unique unique hexadecimal ID.
     * @param {WList[]} lists accepts list
     * @param {WAbstractList[]} abstractLists accepts array of abstractList
     * @public
     */
    public static generateUniqueId(lists: WList[], abstractLists?: WAbstractList[]): number {
        const isAbstractList: boolean = !isNullOrUndefined(abstractLists) ? true : false;
        const randomNumber: number = Math.floor(Math.random() * 100000000);
        if (isAbstractList) {
            return this.isSameListIDExists(randomNumber, undefined, abstractLists, isAbstractList) ?
                this.generateUniqueId(undefined, abstractLists) : randomNumber;
        } else {
            return this.isSameListIDExists(randomNumber, lists) ? this.generateUniqueId(lists) : randomNumber;
        }
    }
    /**
     * @private
     * @returns {string} returns a string value
     */
    public static generateHexDecimal(): string {
        return (Math.floor(Math.random() * (4000000000 - 270000000)) + 270000000).toString(16).toUpperCase();
    }
    /**
     * @private
     * @param {number} id id need to be converted
     * @returns {string} returns a string value
     */
    public static numberToHexDecimal(id: number): string {
        return id.toString(16).toUpperCase();
    }
    /**
     * @returns {boolean} returns a boolean value
     * @param {number} nsid accepts number as a parameter
     * @param {WList[]} lists accepts an array of type WList
     * @param {WAbstractList[]} abstractLists accepts an array of type WAbstractList
     * @param {boolean} isAbstractList accepts a boolean value
     * @private
     */
    public static isSameListIDExists(nsid: number, lists: WList[], abstractLists?: WAbstractList[], isAbstractList?: boolean): boolean {
        if (isAbstractList) {
            for (let i: number = 0; i < abstractLists.length; i++) {
                const abstractList: WAbstractList = abstractLists[parseInt(i.toString(), 10)];
                if (nsid === abstractList.nsid) {
                    return true;
                }
            }
        } else {
            for (let j: number = 0; j < lists.length; j++) {
                const list: WList = lists[parseInt(j.toString(), 10)];
                if (nsid === list.nsid) {
                    return true;
                }
            }
        }
        return false;
    }
    /* eslint-enable */
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
            const temp: number = text.indexOf(wordSplitCharacter[parseInt(j.toString(), 10)]);
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
                if (text[parseInt(i.toString(), 10)] === wordSplitCharacter[parseInt(j.toString(), 10)]) {
                    return i;
                }
            }
        }
        return -1;
    }
    /**
     * Convert ARGB to RGB
     * @private
     * @param {string} color accepts a color string
     * @returns {string} returns a string value
     */
    public static convertArgbToRgb(color: string): string {
        if (color.length >= 8) {
            return color.substr(0, 6);
        }
        return color;
    }

    public static convertRgbToHex(val: number): string {
        let hex: string = Number(val).toString(16);
        if (hex.length < 2) {
            hex = '0' + hex;
        }
        return hex;
    }
    // public static convertPointsToCentimetre(val: number): number {
    //     return val/28.34644;
    // }
    // public static convertCentimetreToPoints(val: number): number {
    //     return val*28.34644;
    // }
    /**
     * @returns {number} returns a number
     * @param {string} input accepts a string value as an input
     * @private
     */
    public static getNumberFromString(input: string): number {
        const numbers: number[] = [];
        let currentNumber: string = '';
        for (const char of input) {
            if (/\d|\./.test(char)) {
                currentNumber += char;
            } else if (currentNumber) {
                numbers.push(parseFloat(currentNumber));
                currentNumber = '';
            }
        }
        if (currentNumber) {
            numbers.push(parseFloat(currentNumber));
        }
        return parseFloat(numbers.join(''));
    }
    public static convertHexToRgb(colorCode: string): any  {
        let r: number;
        let g: number;
        let b: number;
        if (colorCode) {
            colorCode = colorCode.replace(/[^0-9A-â€Œâ€‹F]/gi, '');   // To remove # from color code string.
            const colCodeNo: number = parseInt(colorCode, 16);
            if (colorCode.length === 8) {
                r = (colCodeNo >> 32) & 255;
                g = (colCodeNo >> 16) & 255;
                b = (colCodeNo >> 8) & 255;
            } else if (colorCode.length === 6) {
                r = (colCodeNo >> 16) & 255;
                g = (colCodeNo >> 8) & 255;
                b = colCodeNo & 255;
            }
            return { 'r': r, 'g': g, 'b': b };
        }
        return undefined;
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

    /**
     * @returns {HTMLElement[]} returns an array of HTML elements
     * @param {NodeListOf<HTMLElement>} nodeList accepts a list of HTML elements
     * @public
     */
    public static convertNodeListToArray(nodeList: NodeListOf<HTMLElement>): HTMLElement[] {
        const array: HTMLElement[] = [];
        if (!isNullOrUndefined(nodeList)) {
            for (let i: number = 0; i < nodeList.length; i++) {
                array.push(nodeList[parseInt(i.toString(), 10)]);
            }
        }
        return array;
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

    public static getTextVerticalAlignment(textVerticalAlignment: number | VerticalAlignment): VerticalAlignment {
        switch (textVerticalAlignment) {
        case 0:
            return 'Top';
        case 1:
            return 'Middle';
        case 2:
            return 'Bottom';
        default:
            return textVerticalAlignment as VerticalAlignment;
        }
    }

    public static convertPointToPixel(point: number): number {
        point = HelperMethods.round(point, 5);
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
            if (text[parseInt(i.toString(), 10)] !== ' ') {
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
            if (text[parseInt(i.toString(), 10)] !== ' ') {
                break;
            }
        }
        return text.substring(0, i + 1);
    }
    /**
     * Checks whether string ends with whitespace.
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
    public static getBoolValue(value: boolean): number
    {
        return value ? 1 : 0;
    }
    public static getBoolInfo(value: boolean, keywordIndex: number): any
    {
        if (keywordIndex === 1) {
            return this.getBoolValue(value);
        }else {
            return value;
        }

    }
    public static parseBoolValue(value: any): boolean {
        if (value instanceof String) {
            if (isNullOrUndefined(value) || value === 'f' || value === '0' || value === 'off' || value === 'false') {
                return false;
            } else {
                return true;
            }
        }
        /* eslint-disable eqeqeq */
        else {
            if (value == 1) {
                return true;
            } else {
                return false;
            }
        }
    }
    /* eslint-enable eqeqeq */
    public static getBaselineAlignmentEnumValue(baselineAlignment: BaselineAlignment): number {
        switch (baselineAlignment) {
        case 'Normal':
            return 0;
        case 'Superscript':
            return 1;
        case 'Subscript':
            return 2;
        }
    }
    public static getUnderlineEnumValue(underline: Underline): number {
        switch (underline) {
        case 'None':
            return 0;
        case 'Single':
            return 1;
        case 'Words':
            return 2;
        case 'Double':
            return 3;
        case 'Dotted':
            return 4;
        case 'Thick':
            return 5;
        case 'Dash':
            return 6;
        case 'DashLong':
            return 7;
        case 'DotDash':
            return 8;
        case 'DotDotDash':
            return 9;
        case 'Wavy':
            return 10;
        case 'DottedHeavy':
            return 11;
        case 'DashHeavy':
            return 12;
        case 'DashLongHeavy':
            return 13;
        case 'DotDashHeavy':
            return 14;
        case 'DotDotDashHeavy':
            return 15;
        case 'WavyHeavy':
            return 16;
        case 'WavyDouble':
            return 17;
        }
    }
    /* eslint-disable */
    public static getStrikeThroughEnumValue(strikethrough: Strikethrough): number {
        switch (strikethrough) {
            case 'None':
                return 0;
            case 'SingleStrike':
                return 1;
            case 'DoubleStrike':
                return 2;
        }
    }
    public static getHighlightColorEnumValue(highlightColor: HighlightColor): number {
        switch (highlightColor) {
            case 'NoColor':
                return 0;
            case 'Yellow':
                return 1;
            case 'BrightGreen':
                return 2;
            case 'Turquoise':
                return 3;
            case 'Pink':
                return 4;
            case 'Blue':
                return 5;
            case 'Red':
                return 6;
            case 'DarkBlue':
                return 7;
            case 'Teal':
                return 8;
            case 'Green':
                return 9;
            case 'Violet':
                return 10;
            case 'DarkRed':
                return 11;
            case 'DarkYellow':
                return 12;
            case 'Gray50':
                return 13;
            case 'Gray25':
                return 14;
            case 'Black':
                return 15;
        }
    }
    public static getBiDirectionalOverride(biDirectionalOverride: BiDirectionalOverride): number {
        switch (biDirectionalOverride) {
            case 'None':
                return 0;
            case 'LTR':
                return 1;
            case 'RTL':
                return 2;
        }
    }

    public static getBreakClearType(breakClearType: BreakClearType): number {
        switch (breakClearType) {
            case 'None':
                return 0;
            case 'Left':
                return 1;
            case 'Right':
                return 2;
            case 'All':
                return 3;
        }
    }

    /* eslint-disable */
    public static getOutlineLevelEnumValue(outlineLevel: OutlineLevel): number {
        switch (outlineLevel) {
            case 'BodyText':
                return 0;
            case 'Level1':
                return 1;
            case 'Level2':
                return 2;
            case 'Level3':
                return 3;
            case 'Level4':
                return 4;
            case 'Level5':
                return 5;
            case 'Level6':
                return 6;
            case 'Level7':
                return 7;
            case 'Level8':
                return 8;
            case 'Level9':
                return 9;
        }
    }
    
    /* eslint-disable */
    public static getTextAlignmentEnumValue(textAlignment: TextAlignment): number {
        switch (textAlignment) {
            case 'Left':
                return 0;
            case 'Center':
                return 1;
            case 'Right':
                return 2;
            case 'Justify':
                return 3;
        }
    }

    /* eslint-disable */
    public static getLineStyleEnumValue(lineStyle: LineStyle): number {
        switch (lineStyle) {
            case 'Single':
                return 0;
            case 'None':
                return 1;
            case 'Dot':
                return 2;
            case 'DashSmallGap':
                return 3;
            case 'DashLargeGap':
                return 4;
            case 'DashDot':
                return 5;
            case 'DashDotDot':
                return 6;
            case 'Double':
                return 7;
            case 'Triple':
                return 8;
            case 'ThinThickSmallGap':
                return 9;
            case 'ThickThinSmallGap':
                return 10;
            case 'ThinThickThinSmallGap':
                return 11;
            case 'ThinThickMediumGap':
                return 12;
            case 'ThickThinMediumGap':
                return 13;
            case 'ThinThickThinMediumGap':
                return 14;
            case 'ThinThickLargeGap':
                return 15;
            case 'ThickThinLargeGap':
                return 16;
            case 'ThinThickThinLargeGap':
                return 17;
            case 'SingleWavy':
                return 18;
            case 'DoubleWavy':
                return 19;
            case 'DashDotStroked':
                return 20;
            case 'Emboss3D':
                return 21;
            case 'Engrave3D':
                return 22;
            case 'Outset':
                return 23;
            case 'Inset':
                return 24;
            case 'Thick':
                return 25;
            case 'Cleared':
                return 26;
        }
    }

    /* eslint-disable */
    public static getLineSpacingTypeEnumValue(lineSpacing: LineSpacingType): number {
        switch (lineSpacing) {
            case 'Multiple':
                return 0;
            case 'AtLeast':
                return 1;
            case 'Exactly':
                return 2;
        }
    }

    /* eslint-disable */
    public static writeBorder(wBorder: WBorder, keywordIndex: number): any {
        let border: any = {};
        border[colorProperty[keywordIndex]] = wBorder.hasValue('color') ? wBorder.color : undefined;
        border[hasNoneStyleProperty[keywordIndex]] = wBorder.hasValue('hasNoneStyle') ? HelperMethods.getBoolInfo(wBorder.hasNoneStyle, keywordIndex) : undefined;
        border[lineStyleProperty[keywordIndex]] = wBorder.hasValue('lineStyle') ? 
        keywordIndex == 1 ? this.getLineStyleEnumValue(wBorder.lineStyle) : wBorder.lineStyle : undefined;
        border[lineWidthProperty[keywordIndex]] = wBorder.hasValue('lineWidth') ? wBorder.lineWidth : undefined;
        border[shadowProperty[keywordIndex]] = wBorder.hasValue('shadow') ? HelperMethods.getBoolInfo(wBorder.shadow, keywordIndex) : undefined;
        border[spaceProperty[keywordIndex]] = wBorder.hasValue('space') ? wBorder.space : undefined;
        return border;
    }

    /* eslint-disable */
    public static writeBorders(wBorders: WBorders, keywordIndex: number): any {
        let borders: any = {};
        borders[topProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('top'), keywordIndex);
        borders[leftProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('left'), keywordIndex);
        borders[rightProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('right'), keywordIndex);
        borders[bottomProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('bottom'), keywordIndex);
        borders[horizontalProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('horizontal'), keywordIndex);
        borders[verticalProperty[keywordIndex]] = this.writeBorder(wBorders.getBorder('vertical'), keywordIndex);
        return borders;
    }

    /* eslint-disable */
    public static writeParagraphFormat(paragraphFormat: WParagraphFormat, isInline: boolean, format: WParagraphFormat, keywordIndex?: number): void {
        keywordIndex = isNullOrUndefined(keywordIndex) ? 0 : keywordIndex;
        paragraphFormat[bordersProperty[keywordIndex]] = this.writeBorders(format.borders, keywordIndex);
        paragraphFormat[leftIndentProperty[keywordIndex]] = isInline ? format.leftIndent : format.getValue('leftIndent');
        paragraphFormat[rightIndentProperty[keywordIndex]] = isInline ? format.rightIndent : format.getValue('rightIndent');
        paragraphFormat[firstLineIndentProperty[keywordIndex]] = isInline ? format.firstLineIndent : format.getValue('firstLineIndent');
        paragraphFormat[textAlignmentProperty[keywordIndex]] = isInline ? 
        keywordIndex == 1 ? this.getTextAlignmentEnumValue(format.textAlignment): format.textAlignment : 
        keywordIndex == 1 ? this.getTextAlignmentEnumValue(format.getValue('textAlignment') as TextAlignment) : format.getValue('textAlignment') as TextAlignment;
        paragraphFormat[beforeSpacingProperty[keywordIndex]] = isInline ? format.beforeSpacing : format.getValue('beforeSpacing');
        paragraphFormat[afterSpacingProperty[keywordIndex]] = isInline ? format.afterSpacing : format.getValue('afterSpacing');
        paragraphFormat[spaceBeforeAutoProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.spaceBeforeAuto, keywordIndex) : format.getValue('spaceBeforeAuto');
        paragraphFormat[spaceAfterAutoProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.spaceAfterAuto, keywordIndex) : format.getValue('spaceAfterAuto');
        paragraphFormat[lineSpacingProperty[keywordIndex]] = isInline ? format.lineSpacing : format.getValue('lineSpacing');
        paragraphFormat[lineSpacingTypeProperty[keywordIndex]] = isInline ? 
        keywordIndex == 1 ? this.getLineSpacingTypeEnumValue(format.lineSpacingType): format.lineSpacingType : 
        keywordIndex == 1 ? this.getLineSpacingTypeEnumValue(format.getValue('lineSpacingType') as LineSpacingType): format.getValue('lineSpacingType') as LineSpacingType;
        paragraphFormat[styleNameProperty[keywordIndex]] = !isNullOrUndefined(format.baseStyle) ? format.baseStyle.name : undefined;
        paragraphFormat[outlineLevelProperty[keywordIndex]] = isInline ? 
        keywordIndex == 1 ? this.getOutlineLevelEnumValue(format.outlineLevel):format.outlineLevel : 
        keywordIndex == 1 ? this.getOutlineLevelEnumValue(format.getValue('outlineLevel') as OutlineLevel) : format.getValue('outlineLevel') as OutlineLevel;
        paragraphFormat[bidiProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.bidi, keywordIndex) : format.getValue('bidi');
        paragraphFormat[keepLinesTogetherProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.keepLinesTogether, keywordIndex) : format.getValue('keepLinesTogether');
        paragraphFormat[keepWithNextProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.keepWithNext, keywordIndex) : format.getValue('keepWithNext');
        paragraphFormat[contextualSpacingProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.contextualSpacing, keywordIndex) : format.getValue('contextualSpacing');
        paragraphFormat[widowControlProperty[keywordIndex]] = isInline ? HelperMethods.getBoolInfo(format.widowControl, keywordIndex) : format.getValue('widowControl');
    }

    /* eslint-disable */
    public static writeCharacterFormat(characterFormat: any, isInline: boolean, format: WCharacterFormat, keywordIndex?: number, isWriteAllValues?: boolean): void {
        keywordIndex = isNullOrUndefined(keywordIndex) ? 0 : keywordIndex;
        characterFormat[boldProperty[keywordIndex]] = isWriteAllValues? HelperMethods.getBoolInfo(format.bold, keywordIndex) : isInline ? HelperMethods.getBoolInfo(format.bold, keywordIndex) : format.getValue('bold');
        characterFormat[italicProperty[keywordIndex]] =  isWriteAllValues? HelperMethods.getBoolInfo(format.italic, keywordIndex) : isInline ? HelperMethods.getBoolInfo(format.italic, keywordIndex) : format.getValue('italic');
        characterFormat[fontSizeProperty[keywordIndex]] = isWriteAllValues? format.fontSize :isInline ? this.toWriteInline(format, 'fontSize') : format.getValue('fontSize');
        characterFormat[fontFamilyProperty[keywordIndex]] = isWriteAllValues? format.fontFamily :isInline ? this.toWriteInline(format, 'fontFamily') : format.getValue('fontFamily');
        characterFormat[underlineProperty[keywordIndex]] = isWriteAllValues? format.underline :isInline ? 
        keywordIndex == 1 ? HelperMethods.getUnderlineEnumValue(format.underline): format.underline : 
        keywordIndex == 1 ? HelperMethods.getUnderlineEnumValue(format.getValue('underline') as Underline): format.getValue('underline') as Underline;
        characterFormat[underlineColorProperty[keywordIndex]] = isWriteAllValues? format.underlineColor :isInline ? this.toWriteInline(format, 'underlineColor') : format.getValue('underlineColor');
        characterFormat[strikethroughProperty[keywordIndex]] = isWriteAllValues? format.strikethrough :isInline ? 
        keywordIndex == 1 ? HelperMethods.getStrikeThroughEnumValue(format.strikethrough) :(format.strikethrough) : 
        keywordIndex == 1 ? HelperMethods.getStrikeThroughEnumValue(format.getValue('strikethrough') as Strikethrough):(format.getValue('strikethrough') as Strikethrough);
        characterFormat[baselineAlignmentProperty[keywordIndex]] = isWriteAllValues? format.baselineAlignment :isInline ? 
        keywordIndex == 1 ? HelperMethods.getBaselineAlignmentEnumValue(format.baselineAlignment) :(format.baselineAlignment) : 
        keywordIndex == 1 ? HelperMethods.getBaselineAlignmentEnumValue(format.getValue('baselineAlignment') as BaselineAlignment):(format.getValue('baselineAlignment') as BaselineAlignment);
        characterFormat[highlightColorProperty[keywordIndex]] = isWriteAllValues? format.highlightColor :isInline ? 
        keywordIndex == 1 ? HelperMethods.getHighlightColorEnumValue(format.highlightColor) :(format.highlightColor) : 
        keywordIndex == 1 ? HelperMethods.getHighlightColorEnumValue(format.getValue('highlightColor') as HighlightColor):(format.getValue('highlightColor') as HighlightColor);
        characterFormat[fontColorProperty[keywordIndex]] = isWriteAllValues? format.fontColor :isInline ? this.toWriteInline(format, 'fontColor') : format.getValue('fontColor');
        characterFormat[styleNameProperty[keywordIndex]] = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : undefined;
        characterFormat[bidiProperty[keywordIndex]] = isWriteAllValues? format.bidi :isInline ? HelperMethods.getBoolInfo(format.bidi, keywordIndex) : format.getValue('bidi');
        characterFormat[bdoProperty[keywordIndex]] = isWriteAllValues? format.bdo :isInline ? 
        keywordIndex == 1 ? HelperMethods.getBiDirectionalOverride(format.bdo): (format.bdo) : 
        keywordIndex == 1 ? HelperMethods.getBiDirectionalOverride(format.getValue('bdo') as BiDirectionalOverride): (format.getValue('bdo') as BiDirectionalOverride);
        characterFormat[boldBidiProperty[keywordIndex]] = isWriteAllValues? format.boldBidi :isInline ? HelperMethods.getBoolInfo(format.boldBidi, keywordIndex) : format.getValue('boldBidi');
        characterFormat[italicBidiProperty[keywordIndex]] = isWriteAllValues? format.italicBidi :isInline ? HelperMethods.getBoolInfo(format.italicBidi, keywordIndex) : format.getValue('italicBidi');
        characterFormat[fontSizeBidiProperty[keywordIndex]] = isWriteAllValues? format.fontSizeBidi :isInline ? format.fontSizeBidi : format.getValue('fontSizeBidi');
        characterFormat[fontFamilyBidiProperty[keywordIndex]] = isWriteAllValues? format.fontFamilyBidi :isInline ? format.fontFamilyBidi : format.getValue('fontFamilyBidi');
        characterFormat[allCapsProperty[keywordIndex]] = isWriteAllValues? format.allCaps :isInline ? HelperMethods.getBoolInfo(format.allCaps, keywordIndex) : format.getValue('allCaps');
        characterFormat[localeIdBidiProperty[keywordIndex]] = isWriteAllValues ? format.localeIdBidi : isInline ? format.localeIdBidi : format.getValue('localeIdBidi');
        characterFormat[localeIdProperty[keywordIndex]] = isWriteAllValues ? format.localeIdBidi : isInline ? format.localeIdAscii : format.getValue('localeIdAscii');
        characterFormat[localeIdFarEastProperty[keywordIndex]] = isWriteAllValues ? format.localeIdFarEast : isInline ? format.localeIdFarEast : format.getValue('localeIdFarEast');
        characterFormat[complexScriptProperty[keywordIndex]] = isWriteAllValues? format.complexScript :isInline ? HelperMethods.getBoolInfo(format.complexScript, keywordIndex) : format.getValue('complexScript');
        characterFormat[fontFamilyAsciiProperty[keywordIndex]] = isWriteAllValues? format.fontFamilyAscii :isInline ? this.toWriteInline(format, 'fontFamilyAscii') : format.getValue('fontFamilyAscii');
        characterFormat[fontFamilyNonFarEastProperty[keywordIndex]] = isWriteAllValues? format.fontFamilyNonFarEast :isInline ? this.toWriteInline(format, 'fontFamilyNonFarEast') : format.getValue('fontFamilyNonFarEast');
        characterFormat[fontFamilyFarEastProperty[keywordIndex]] = isWriteAllValues? format.fontFamilyFarEast :isInline ? this.toWriteInline(format, 'fontFamilyFarEast') : format.getValue('fontFamilyFarEast');
        characterFormat[characterSpacingProperty[keywordIndex]] = isWriteAllValues? format.characterSpacing :isInline ? this.toWriteInline(format, 'characterSpacing') : format.getValue('characterSpacing');
        characterFormat[scalingProperty[keywordIndex]] = isWriteAllValues? format.scaling :isInline ? this.toWriteInline(format, 'scaling') : format.getValue('scaling');
        if (format.hasValue('fontFamily') || isWriteAllValues) {
            if (isNullOrUndefined(characterFormat[fontFamilyAsciiProperty[keywordIndex]])) {
                characterFormat[fontFamilyAsciiProperty[keywordIndex]] = format.fontFamily;
            }
            if (isNullOrUndefined(characterFormat[fontFamilyNonFarEastProperty[keywordIndex]])) {
                characterFormat[fontFamilyNonFarEastProperty[keywordIndex]] = format.fontFamily;
            }
            if (isNullOrUndefined(characterFormat[fontFamilyFarEastProperty[keywordIndex]])) {
                characterFormat[fontFamilyFarEastProperty[keywordIndex]] = format.fontFamily;
            }
        }
    }
    /// <summary>
    /// To check whether the font name is theme font or not.
    /// </summary>
    /// <param name="fontName">Specify the font name.</param>
    /// <returns>Returns true if the font name is represent a theme font.</returns>
    public static isThemeFont(fontName: string): boolean {
        return (fontName == "majorAscii" || fontName == "majorBidi" || fontName == "majorEastAsia"
            || fontName == "majorHAnsi" || fontName == "minorAscii" || fontName == "minorBidi" || fontName == "minorEastAsia"
            || fontName == "minorHAnsi");
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
    /* eslint-disable  */
    public static removeInvalidXmlChars(text: string): string {
        // From xml spec valid chars:
        // #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
        // any Unicode character, excluding the surrogate blocks, FFFE, and FFFF.
        // and used unicodes in DocumentEditor \f | \v | \r | \u000E
        const invalidXMLChars = /[^\x09\x0A\x0C\x0D\v\f\r\u000E\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/ug;
        return text.replace(invalidXMLChars, '');
    }

    public static commentInlines(ctext: string, mentions: FieldSettingsModel[], keywordIndex: number): any {
        const blocks: any = [];
        let outputArray = ctext.split(/<\/?div>/).filter(Boolean).map(function (item) { return item.trim(); });
        outputArray = (outputArray.filter(Boolean).map(function (item) { return item === "<br>" ? item : item.split(/<br\s*\/?>/) }) as any).flat();
        outputArray.forEach(text => {
            let block: any = {};
            block[inlinesProperty[keywordIndex]] = [];
            if (text !== "" && text !== "<br>") {
                // Replace &nbsp; with a space
                text = text.replace(/&nbsp;/g, " ");
                // Extracting parts into an array
                let parts = text.match(/(<[^>]+>[^<]*<\/[^>]+>|[^<]+)/g);
                // Iterate through the parts array
                parts.forEach((content) => {
                    if (content.indexOf("<span") === 0) {
                        // Regular expression to match the content inside the span tag
                        const regex = /<span[^>]*>([^<]*)<\/span>/;
                        // Extract the text
                        const match = content.match(regex);
                        const name = match ? match[1].trim() : '';
                        const email = this.getEmailIdByName(name, mentions);
                        block = this.serializeMentions(name, email, block, keywordIndex);
                    } else {
                        const inlines: any = {};
                        inlines[textProperty[keywordIndex]] = content;
                        block[inlinesProperty[keywordIndex]].push(inlines);
                    }
                });
            }
            blocks.push(block);
        });
        return blocks;
    }
    public static parseCommentAsText(comment: CommentElementBox): string {
        // Create a temporary DOM element to manipulate the input string
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = comment.text;

        // Find all span elements with the class 'e-mention-chip'
        const spanElements = tempDiv.querySelectorAll('span.e-mention-chip');
        const inputDataStr: string = JSON.stringify(comment.mentions);
        const inputData: MentionDataEditInfo[] = JSON.parse(inputDataStr);
        let index = 0;
        if (spanElements.length !== inputData.length) {
            throw new Error("The lengths of spanElements and inputData do not match");
        }

        spanElements.forEach((span) => {
            if (index in inputData) {
                const data: MentionDataEditInfo = inputData[index] as MentionDataEditInfo;

                if (data && typeof data.value === 'string' && typeof data.text === 'string') {
                    const anchor = document.createElement('a');
                    anchor.href = `mailto:${data.value}`;
                    anchor.textContent = `@${data.text}`;
                    span.replaceWith(anchor);
                }

                index++;
            }
        });

        // Get the updated innerHTML
        let result = tempDiv.innerHTML;

        // Replace <br> with appropriate newline characters
        result = result.replace(/<br>/g, '\r\n');

        return result;
    }
    private static getEmailIdByName(name: string, mentions: FieldSettingsModel[]): string {
        for (let item of mentions) {
            if (item["text"] === name) {
                if(!isNullOrUndefined(item["value"])) {
                    return item["value"];
                } else {
                    return item["text"] + '.com';
                }
            }
        }
        return "";
    }

    private static serializeMentions(name: string, email: string, block: string, keywordIndex: number): any {
        var inlines = {};
        inlines[characterFormatProperty[keywordIndex]] = {};
        inlines[fieldTypeProperty[keywordIndex]] = 0;
        inlines[hasFieldEndProperty[keywordIndex]] = true;
        block[inlinesProperty[keywordIndex]].push(inlines);
        var inlines2 = {};
        inlines2[characterFormatProperty[keywordIndex]] = {};
        inlines2[textProperty[keywordIndex]] = ' HYPERLINK \"mailto:' + email + '\" ';
        block[inlinesProperty[keywordIndex]].push(inlines2);
        var inlines3 = {};
        inlines3[characterFormatProperty[keywordIndex]] = {};
        inlines3[fieldTypeProperty[keywordIndex]] = 2;
        block[inlinesProperty[keywordIndex]].push(inlines3);
        var inlines4 = {};
        inlines4[characterFormatProperty[keywordIndex]] = {
            "underline": "Single",
            "fontColor": "#0563c1",
            "bidi": false
        };
        inlines4[textProperty[keywordIndex]] = name;
        block[inlinesProperty[keywordIndex]].push(inlines4);
        var inlines5 = {};
        inlines5[characterFormatProperty[keywordIndex]] = {};
        inlines5[fieldTypeProperty[keywordIndex]] = 1;
        block[inlinesProperty[keywordIndex]].push(inlines5);
        return block;
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
        if (this.startsWith(base64ImageString, 'data:image/svg+xml;base64,')) {
            extension = '.svg';
            formatClippedString = base64ImageString.replace('data:image/svg+xml;base64,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/svg+xml;utf8,')) {
            extension = '.svg';
            formatClippedString = base64ImageString.replace('data:image/svg+xml;utf8,', '');
        } else if (this.startsWith(base64ImageString, 'data:image/bmp;base64,')) {
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
    /**
     * @private
     * @param sourceString 
     * @param startString 
     * @returns 
     */
    public static startsWith(sourceString: string, startString: string): boolean {
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
                text += splitBy ? valArry[parseInt(i.toString(), 10)].charAt(0).toUpperCase() + valArry[parseInt(i.toString(), 10)].slice(1, valArry[parseInt(i.toString(), 10)].length) : this.capitaliseFirstInternal(valArry[parseInt(i.toString(), 10)]);
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
        const modifiedDate: Date = HelperMethods.getLocaleDate(date);
        const dateString: string = modifiedDate.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
        const time: string = modifiedDate.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
        const dateTime: string = dateString + ' ' + time;
        return dateTime;
    }
    public static getUtcDate(dateTime?: Date): string {
        if (isNullOrUndefined(dateTime)) {
            dateTime = new Date();
        }
        return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000).toISOString();
    }
    public static getLocaleDate(date: string): Date {
        const dt: Date = new Date(date);
        return new Date(dt.getTime() + dt.getTimezoneOffset() * 60000);
    }
    public static getCompatibilityModeValue(compatibilityMode: number): string {
        let compatValue: string;
        switch (compatibilityMode) {
        case 1:
            compatValue = '11';
            break;
        case 2:
            compatValue = '12';
            break;
        case 3:
            compatValue = '14';
            break;
        default:
            compatValue = '15';
            break;
        }
        return compatValue;
    }
    /**
     * @private
     * @returns {string} - Returns the unique id for document editor.
     */
    public static getUniqueElementId(): string {
        return 'de_element' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    /**
     * @private
     * @param element - element to be splitted of space
     * @param fromStart - weather to removed space from start or end
     * @returns {Boolean} - is the input element is splitted
     */
    /* eslint-disable  */
    public static splitSpaceInTextElementBox(element: TextElementBox, fromStart: boolean): void {
        let elementText: string = element.text;
        let emptySpace: string = "";
        if(fromStart) {
            while(HelperMethods.startsWith(elementText, " ")) {
                emptySpace += ' ';
                elementText = elementText.substring(1);
            }
        } else {
            while(HelperMethods.endsWith(elementText)) {
                emptySpace += ' ';
                elementText = elementText.slice(0, -1);
            }
        }
        if(emptySpace != "") {
            const textBox: TextElementBox = new TextElementBox();
            textBox.characterFormat.copyFormat(element.characterFormat);
            if(element.revisions.length > 0) {
                for (let i: number = 0; i < element.revisions.length; i++) {
                    const currentRevision: Revision = element.revisions[i];
                    textBox.revisions.push(currentRevision);
                    let rangeIndex: number = currentRevision.range.indexOf(element);
                    if (rangeIndex < 0) {
                        currentRevision.range.push(textBox);
                    } else {
                        currentRevision.range.splice(rangeIndex + 1, 0, textBox);
                    }
                }
                textBox.isMarkedForRevision = element.isMarkedForRevision;
            }
            textBox.line = element.line;
            const lineChildren = textBox.line.children;
            if(fromStart) {
                element.text = emptySpace;
                textBox.text = elementText;
            } else {
                element.text = elementText;
                textBox.text = emptySpace;
            }
            lineChildren.splice(lineChildren.indexOf(element)+1, 0, textBox);
        }
    }
    /* eslint-disable */
    private static getTextIndexAfterWhitespace(text: string, startIndex: number): number {
        const length: number = text.length;
        let index: number = 0;
        index = text.indexOf(' ', startIndex) + 1;
        let nextIndex: number = index;
        if (nextIndex === 0 || nextIndex === length) {
            return nextIndex;
        }
        while (text[nextIndex] === ' ') {
            nextIndex++;
            if (nextIndex === length) {
                break;
            }
        }
        return nextIndex;
    }
    /**
     * @private
     * @param {TextElementBox} textElementBox text element box to split the text based on max text length.
     * @param {LineWidget} lineWidget  line widget to add the splitted text element box.
     * @returns {void}
     */
    public static splitWordByMaxLength(textElementBox: TextElementBox, lineWidget: LineWidget, isInitialParsing?: boolean): void {
        const text: string = textElementBox.text;
        let index: number = 0;
        const textLength: number = text.length;
        const maxLength: number = 90;
        let splittedText: string = '';
        const characterFormat: WCharacterFormat = textElementBox.characterFormat;
        const revisions: Revision[] = textElementBox.revisions;
        let spanIndex: number = lineWidget.children.indexOf(textElementBox);
        while (index < textLength) {
            let nextIndex: number = index + maxLength;
            if (nextIndex > textLength) {
                nextIndex = textLength;
            }
            let spaceIndex: number = HelperMethods.getTextIndexAfterWhitespace(text, nextIndex);
            if (spaceIndex === 0 || spaceIndex > textLength) {
                spaceIndex = nextIndex;
            }
            splittedText = text.substring(index, spaceIndex);
            if (index === 0) {
                textElementBox.text = splittedText;
                textElementBox.isWidthUpdated = false;
            } else {
                const splittedElement: TextElementBox = new TextElementBox();
                splittedElement.text = splittedText;
                splittedElement.line = lineWidget;
                splittedElement.characterFormat.copyFormat(characterFormat);
                if (revisions.length > 0) {
                    for (let i: number = 0; i < revisions.length; i++) {
                        const revision: Revision = revisions[i];
                        splittedElement.revisions.push(revision);
                        const rangeIndex: number = revision.range.indexOf(textElementBox);
                        if (isInitialParsing) {
                            revision.range.push(splittedElement);
                        } else {
                            if (rangeIndex < 0) {
                                revision.range.push(splittedElement);
                            } else {
                                revision.range.splice(rangeIndex + 1, 0, splittedElement);
                            }
                        }
                    }
                }
                if (isInitialParsing) {
                    lineWidget.children.push(splittedElement);
                } else {
                    lineWidget.children.splice(spanIndex + 1, 0, splittedElement);
                    spanIndex++;
                }
            }
            index = spaceIndex;
        }
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
    /**
     * @private
     * @returns {void}
     */
    public destroy(): void {
        this.keyStr = undefined;
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
 * ListSearchResultInfo
 */
export interface ListSearchResultInfo {
    paragraph: ParagraphWidget
    listId: number
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
    trimmedSpaceWidth: number
    subWidth: number
    spaceCount: number
    totalSpaceCount: number
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
 export interface ImageStringInfo {
    imageString: string
    metaFileImageString: string
}

/**
 * @private
 */
export interface PositionInfo {
    startPosition: TextPosition
    endPosition: TextPosition
}
/**
 * @private
 */
export interface BorderRenderInfo {
    skipTopBorder: boolean;
    skipBottomBorder: boolean
}
/**
 * @private
 */
export interface LineCountInfo {
    lineWidget: LineWidget
    lineCount: number
}
/**
 * Specifies the field information.
 */
export interface FieldInfo {
    /** 
     *  Specifies the field code.
     */
    code: string
    /** 
     *  Specifies the field result.
     */
    result: string
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
    /**
     * Specifies the name of the form field.
     *
     * > If a form field already exists in the document with the new name specified, the old form field name property will be cleared and it will not be accessible. Ensure the new name is unique.
     */
    name?: string
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
    /**
     * Specifies the name of the form field.
     *
     * > If a form field already exists in the document with the new name specified, the old form field name property will be cleared and it will not be accessible. Ensure the new name is unique.
     */
    name?: string
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
    /**
     * Specifies the name of the form field.
     *
     * > If a form field already exists in the document with the new name specified, the old form field name property will be cleared and it will not be accessible. Ensure the new name is unique.
     */
    name?: string

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
 export interface LtrRtlTextInfo {
    value?: boolean
}

/**
 * @private
 */
export interface FootNoteWidgetsInfo {
    footNoteWidgets: BodyWidget[];
    toBodyWidget: BodyWidget;
    fromBodyWidget: BodyWidget;
}

/**
 * @private
 */
export interface SelectedCommentInfo {
    commentStartInfo: CommentCharacterElementBox[]
    commentEndInfo: CommentCharacterElementBox[]
}

/**
 * @private
 */
export interface AbsolutePositionInfo {
    /**
     * Selection position.
     * @private
     */
    position?: number
    /**
     * Specifies whether the specfic element is reached or not.
     * @private
     */
    done: boolean

}
/**
 * @private
 */
export interface FieldResultInfo {
    /**
     * Specifies the field result length.
     * @private
     */
    length: number;
}

/**
 * @private
 */
export interface AbsoluteParagraphInfo {
    offset: number,
    currentLength: number,
    paragraph: ParagraphWidget,
    rowOrCellIndex?: number,
    tableWidget?: TableWidget
    rowWidget?: TableRowWidget,
    cellWidget?: TableCellWidget
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
