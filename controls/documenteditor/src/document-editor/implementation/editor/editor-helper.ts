import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat, WCellFormat } from '../index';
import { LineWidget, ElementBox, BodyWidget, ParagraphWidget } from '../viewer/page';
import { HighlightColor } from '../../base/types';
import { Widget, FieldElementBox } from '../viewer/page';
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
        '*', '(', ')', '"', '?', '/', '|', '\\', '”'];
    /**
     * Inserts text at specified index in string.
     * @param {string} spanText 
     * @param {number} index 
     * @param {string} text 
     * @private
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
     * @param {string} text
     * @param {number} index
     * @param {number} length
     * @private
     */
    public static remove(text: string, index: number, length: number): string {
        if (index === 0) {
            return text.substring(index + 1, text.length);
        } else {
            return text.substring(0, index) + text.substring(index + 1, text.length);
        }
    }
    /**
     * Returns the index of word split character in a string.
     * @param {string} text 
     * @param {string[]} wordSplitCharacter 
     * @private
     */
    /* tslint:disable:no-any */
    public static indexOfAny(text: string, wordSplitCharacter: string[]): any {
        let index: any = undefined;
        for (let j: number = 0; j < wordSplitCharacter.length; j++) {
            let temp: number = text.indexOf(wordSplitCharacter[j]);
            if (temp !== -1 && isNullOrUndefined(index)) {
                index = temp;
            } else if (temp !== -1 && temp < index) {
                index = temp;
            }
        }
        return isNullOrUndefined(index) ? -1 : index;
    }
    /**
     * Returns the last index of word split character in a string.
     * @param {string} text
     * @param {string[]} wordSplitCharacter
     * @private
     */
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
    /**
     * Adds css styles to document header.
     * @param {string} css 
     * @private
     */
    public static addCssStyle(css: string): void {
        let style: HTMLStyleElement = document.createElement('style');
        if (style.style.cssText) {
            style.style.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    /**
     * Gets highlight color code.
     * @param {HighlightColor} highlightColor 
     * @private
     */
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
    /**
     * Converts point to pixel.
     * @param {number} point 
     * @private
     */
    public static convertPointToPixel(point: number): number {
        let pixel: number = HelperMethods.round((point * 96 / 72), 5);
        return pixel;
    }
    /**
     * Converts pixel to point.
     * @param {number} pixel 
     * @private
     */
    public static convertPixelToPoint(pixel: number): number {
        let point: number = HelperMethods.round((pixel * 72 / 96), 5);
        return point;
    }
    /**
     * Return true if field linked
     * @private
     */
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
     * @param {string} text 
     * @private
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
     * @param {string} text 
     * @private
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
     * @param {string} text 
     * @private
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
     * @param {string} text 
     * @private
     */
    public static endsWith(text: string): boolean {
        if (!isNullOrUndefined(text) && text.length !== 0) {
            return text[text.length - 1] === ' ';
        }
        return false;
    }
    /**
     * @private
     * Write Characterformat
     * @param {any} characterFormat 
     * @param {boolean} isInline 
     * @param {WCharacterFormat} format 
     */
    public static writeCharacterFormat(characterFormat: any, isInline: boolean, format: WCharacterFormat): void {
        characterFormat.bold = isInline ? format.bold : format.getValue('bold');
        characterFormat.italic = isInline ? format.italic : format.getValue('italic');
        characterFormat.fontSize = isInline ? format.fontSize : format.getValue('fontSize');
        characterFormat.fontFamily = isInline ? format.fontFamily : format.getValue('fontFamily');
        characterFormat.underline = isInline ? format.underline : format.getValue('underline');
        characterFormat.strikethrough = isInline ? format.strikethrough : format.getValue('strikethrough');
        characterFormat.baselineAlignment = isInline ? format.baselineAlignment : format.getValue('baselineAlignment');
        characterFormat.highlightColor = isInline ? format.highlightColor : format.getValue('highlightColor');
        characterFormat.fontColor = isInline ? format.fontColor : format.getValue('fontColor');
        characterFormat.styleName = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : undefined;
    }
    /* tslint:enable:no-any */
    /**
     * Rounds the values with specified decimal digits.
     * @param {number} value
     * @param {number} decimalDigits
     * @private
     */
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
}
/** 
 * @private
 */
export class Point {
    private xIn: number = 0;
    private yIn: number = 0;
    /**
     * Gets or sets x value.
     * @private
     */
    get x(): number {
        return this.xIn;
    }
    set x(value: number) {
        this.xIn = value;
    }
    /**
     * Gets or sets y value.
     * @private
     */
    get y(): number {
        return this.yIn;
    }
    set y(value: number) {
        this.yIn = value;
    }

    constructor(xPosition: number, yPosition: number) {
        this.xIn = xPosition;
        this.yIn = yPosition;
    }
    /**
     * @private
     */
    public copy(point: Point): void {
        this.xIn = point.xIn;
        this.yIn = point.yIn;
    }
    /**
     * Destroys the internal objects maintained.
     * @returns void
     */
    public destroy(): void {
        this.xIn = undefined;
        this.yIn = undefined;
    }
}
/** 
 * @private
 */
export interface SubWidthInfo {
    subWidth: number;
    spaceCount: number;
}
/** 
 * @private
 */
export interface LineElementInfo {
    topMargin: number;
    bottomMargin: number;
    addSubWidth: boolean;
    whiteSpaceCount: number;
}
/** 
 * @private
 */
export interface Color {
    r: number;
    g: number;
    b: number;
}
/** 
 * @private
 */
export interface CaretHeightInfo {
    height: number;
    topMargin: number;
    isItalic?: boolean;
}
/** 
 * @private
 */
export interface SizeInfo {
    width: number;
    height: number;
    topMargin: number;
    bottomMargin: number;
}
/** 
 * @private
 */
export interface FirstElementInfo {
    element: ElementBox;
    left: number;
}
/** 
 * @private
 */
export interface IndexInfo {
    index: string;
}
/** 
 * @private
 */
export interface ImagePointInfo {
    selectedElement: HTMLElement;
    resizePosition: string;
}
/** 
 * @private
 */
export interface HyperlinkTextInfo {
    displayText: string;
    isNestedField: boolean;
    format: WCharacterFormat;
}
/** 
 * @private
 */
export interface BodyWidgetInfo {
    bodyWidget: BodyWidget;
    index: number;
}
/** 
 * @private
 */
export interface ParagraphInfo {
    paragraph: ParagraphWidget;
    offset: number;
}
/** 
 * @private
 */
export interface CellInfo {
    start: number;
    end: number;
}
/** 
 * @private
 */
export interface FieldCodeInfo {
    isNested: boolean;
    isParsed: boolean;
}
/** 
 * @private
 */
export interface LineInfo {
    line: LineWidget;
    offset: number;
}
/** 
 * @private
 */
export interface ElementInfo {
    element: ElementBox;
    index: number;
}

/** 
 * @private
 */
export interface TextPositionInfo {
    element: ElementBox;
    index: number;
    caretPosition: Point;
    isImageSelected: boolean;
}
/** 
 * @private
 */
export interface CellCountInfo {
    count: number;
    cellFormats: WCellFormat[];
}
/** 
 * @private
 */
export interface BlockInfo {
    node: Widget;
    position: IndexInfo;
}