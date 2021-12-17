import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat } from '../index';
import { TextElementBox, ListTextElementBox, ParagraphWidget } from './page';
import { DocumentHelper } from './viewer';
import { HelperMethods, RtlInfo } from '../editor/editor-helper';
import { BaselineAlignment, BiDirectionalOverride } from '../../index';
/**
 * @private
 */
export interface TextSizeInfo {
    Height?: number
    BaselineOffset?: number
    Width?: number
}
/**
 * @private
 */
export interface FontSizeInfo {
    HeightFactor?: number
    BaselineFactor?: number
}
/**
 * @private
 */
export interface TextHeightInfo {
    [key: string]: TextSizeInfo
}
/**
 * @private
 */
export interface FontHeightInfo {
    [key: string]: FontSizeInfo
}
/**
 * @private
 */
export class TextHelper {
    private documentHelper: DocumentHelper;
    private context: CanvasRenderingContext2D;
    private paragraphMarkInfo: TextHeightInfo = {};
    private get paragraphMark(): string {
        return '¶';
    }
    private get lineBreakMark(): string {
        return '↲';
    }
    public getEnSpaceCharacter(): string {
        return String.fromCharCode(8194);
    }
    public repeatChar(char: string, count: number): string {
        let text: string = '';
        for (let i: number = 0; i < count; i++) {
            text += char;
        }
        return text;
    }
    public constructor(documentHelper: DocumentHelper) {
        this.documentHelper = documentHelper;
        if (!isNullOrUndefined(documentHelper)) {
            this.context = documentHelper.containerContext;
        }
    }
    public getParagraphMarkWidth(characterFormat: WCharacterFormat): number {
        return this.getParagraphMarkSize(characterFormat).Width;
    }
    public getParagraphMarkSize(characterFormat: WCharacterFormat): TextSizeInfo {
        const format: string = this.getFormatText(characterFormat);
        if (this.paragraphMarkInfo[format]) {
            return this.paragraphMarkInfo[format];
        }
        // Gets the text element's width;
        const width: number = this.getWidth(this.paragraphMark, characterFormat);
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat);
        const textSizeInfo: TextSizeInfo = {
            'Width': width, 'Height': textHelper.Height, 'BaselineOffset': textHelper.BaselineOffset
        };
        return this.paragraphMarkInfo[format] = textSizeInfo;
    }
    public getTextSize(elementBox: TextElementBox, characterFormat: WCharacterFormat): number {
        // Gets the text element's width;
        let textTrimEndWidth: number = 0;
        const isRTL: boolean = characterFormat.bidi || this.isRTLText(elementBox.text);
        const text: string = this.setText(elementBox.text, isRTL, characterFormat.bdo);
        textTrimEndWidth = this.getWidth(text, characterFormat);
        elementBox.width = textTrimEndWidth;
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
        if (elementBox.text[elementBox.text.length - 1] === ' ') {
            textTrimEndWidth = this.getWidth(HelperMethods.trimEnd(elementBox.text), characterFormat);
        }
        elementBox.trimEndWidth = textTrimEndWidth;
        return textTrimEndWidth;
    }
    public getHeight(characterFormat: WCharacterFormat): TextSizeInfo {
        // Get character format property as  below predefined structure to make it easy to check and retrieve
        // Predefined static structure `[FontName];[FontSize];bold;italic` to maintain as key in the collection
        const key: string = this.getFormatText(characterFormat);
        if (!isNullOrUndefined(this.documentHelper.heightInfoCollection[key])) {
            return this.documentHelper.heightInfoCollection[key];
        }
        const sizeInfo: TextSizeInfo = this.documentHelper.owner.textMeasureHelper.getHeightInternal(characterFormat);
        this.documentHelper.heightInfoCollection[key] = sizeInfo;
        return sizeInfo;
    }
    public getFormatText(characterFormat: WCharacterFormat): string {
        let formatText: string = characterFormat.fontFamily.toLocaleLowerCase();
        formatText += ';' + characterFormat.fontSize;
        if (characterFormat.bold) {
            formatText += ';' + 'bold';
        }
        if (characterFormat.italic) {
            formatText += ';' + 'italic';
        }
        return formatText;
    }
    public measureTextExcludingSpaceAtEnd(text: string, characterFormat: WCharacterFormat): number {
        return this.getWidth(HelperMethods.trimEnd(text), characterFormat);
    }
    public getWidth(text: string, characterFormat: WCharacterFormat): number {
        if (text.match('\v')) {
            text.replace('\v', this.lineBreakMark);
        }
        let bold: string = '';
        let italic: string = '';
        let fontFamily: string = '';
        let fontSize: number = characterFormat.fontSize;
        bold = characterFormat.bold ? 'bold' : '';
        italic = characterFormat.italic ? 'italic' : '';
        fontFamily = characterFormat.fontFamily;
        fontSize = fontSize === 0 ? 0.5 : fontSize / (characterFormat.baselineAlignment === 'Normal' ? 1 : 1.5);
        this.context.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + fontFamily;
        if (characterFormat.allCaps) {
            text = text.toUpperCase();
        }
        return this.context.measureText(text).width;
    }

    public setText(textToRender: string, isBidi: boolean, bdo: BiDirectionalOverride, isRender?: boolean): string {
        if (isNullOrUndefined(isRender)) {
            isRender = false;
        }
        if (textToRender.length === 0) {
            return '';
        }
        const isRtlText: boolean = isBidi;
        if ((!isRtlText && (bdo === 'RTL')) || (isRtlText && (bdo === 'LTR'))) {
            textToRender = HelperMethods.reverseString(textToRender);
        } else if (isRender && isRtlText && HelperMethods.endsWith(textToRender)) {
            const spaceCount: number = textToRender.length - HelperMethods.trimEnd(textToRender).length;
            textToRender = HelperMethods.addSpace(spaceCount) + HelperMethods.trimEnd(textToRender);
        }
        return textToRender;
    }

    public measureText(text: string, characterFormat: WCharacterFormat): TextSizeInfo {
        // Gets the text element's width;
        const width: number = this.getWidth(text, characterFormat);
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat);
        return {
            'Width': width, 'Height': textHelper.Height, 'BaselineOffset': textHelper.BaselineOffset
        };
    }
    public updateTextSize(elementBox: ListTextElementBox, paragraph: ParagraphWidget): void {
        const format: WCharacterFormat = new WCharacterFormat(undefined);
        const listCharacterFormat: WCharacterFormat = elementBox.listLevel.characterFormat;
        const breakCharacterFormat: WCharacterFormat = paragraph.characterFormat;
        format.fontSize = listCharacterFormat.hasValue('fontSize') ? listCharacterFormat.fontSize : breakCharacterFormat.fontSize;
        format.fontFamily = listCharacterFormat.hasValue('fontFamily') ? listCharacterFormat.fontFamily : breakCharacterFormat.fontFamily;
        let bold: string = '';
        let italic: string = '';
        const baselineAlignment: BaselineAlignment = listCharacterFormat.baselineAlignment === 'Normal' ?
            breakCharacterFormat.baselineAlignment : listCharacterFormat.baselineAlignment;
        bold = listCharacterFormat.hasValue('bold') ? listCharacterFormat.bold ? 'bold' : '' : breakCharacterFormat.bold ? 'bold' : '';
        italic = listCharacterFormat.hasValue('italic') ? listCharacterFormat.italic ? 'italic' : ''
            : breakCharacterFormat.italic ? 'italic' : '';
        format.baselineAlignment = baselineAlignment;
        if (bold) {
            format.bold = true;
        }
        if (italic) {
            format.italic = true;
        }
        const isRTL: boolean = format.bidi || this.isRTLText(elementBox.text);
        const text: string = this.setText(elementBox.text, isRTL, format.bdo);
        elementBox.width = this.getWidth(text, format);
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(format);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
    }
    public containsSpecialCharAlone(text: string): boolean {
        /* eslint-disable */
        let specialChars: string = '*|.\:[]{}-`\;()@&$#%!~?' + ' ' + "'";
        for (let i: number = 0; i < text.length; i++) {
            if (specialChars.indexOf(text.charAt(i)) === -1) {
                return false;
            }
        }
        return true;
    }
    public containsNumberAlone(text: string): boolean {
        /* eslint-disable */
        let number: string = '0123456789';
        if (text === '') {
            return false;
        }
        for (let i: number = 0; i < text.length; i++) {
            if (number.indexOf(text.charAt(i)) === -1) {
                return false;
            }
        }
        return true;
    }

    public containsCombinationText(element: TextElementBox): boolean {
        /* eslint-disable */
        if (element.text.match(/^[0-9]+$/) && element.paragraph.bidi) {
            return true;
        } else {
            return false;
        }
    }

    public inverseCharacter(ch: string): string {
        switch (ch) {
            //Specify the '('
            case '(':
                //Specify the ')'
                return ')';

            //Specify the ')'
            case ')':
                //Specify the '('
                return '(';

            //Specify the '<'
            case '<':
                //Specify the '>'
                return '>';

            //Specify the '>'
            case '>':
                //Specify the '<'
                return '<';

            //Specify the '{'
            case '{':
                //Specify the '}'
                return '}';

            //Specify the '}'
            case '}':
                //Specify the '{'
                return '{';

            //Specify the '['
            case '[':
                //Specify the ']'
                return ']';

            //Specify the ']'
            case ']':
                //Specify the '['
                return '[';

            default:
                return ch;
        }
    }

    public containsSpecialChar(text: string): boolean {
        let specialChars: string = '*|.\:[]{}-`\;()@&$#%!~?' + ' ';
        for (let i: number = 0; i < text.length; i++) {
            if (specialChars.indexOf(text.charAt(i)) !== -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     * @param {string} text - Specifies the text
     * @returns {boolean} - Returns true if given text it right to left.
     */
    public isRTLText(text: string): boolean {
        let isRTL: boolean = false;
        if (!isNullOrUndefined(text)) {
            for (let i: number = 0; i < text.length; i++) {
                let temp: string = text[i];
                if ((temp >= String.fromCharCode(1424) && temp <= String.fromCharCode(1535)) //Hebrew characters
                    || (temp >= String.fromCharCode(1536) && temp <= String.fromCharCode(1791)) //Arabic - Urdu characters
                    || (temp >= String.fromCharCode(1872) && temp <= String.fromCharCode(1919)) //Arabic - Urdu characters
                    || (temp >= String.fromCharCode(2208) && temp <= String.fromCharCode(2303)) //Arabic characters
                    || (temp >= String.fromCharCode(64336) && temp <= String.fromCharCode(65023)) //Arabic - Urdu characters
                    || (temp >= String.fromCharCode(65136) && temp <= String.fromCharCode(65279)) //Arabic - Urdu characters
                    || (temp >= String.fromCharCode(43392) && temp <= String.fromCharCode(43487)) //Javanese characters
                    || (temp >= String.fromCharCode(1792) && temp <= String.fromCharCode(1871)) //Syriac characters
                    || (temp >= String.fromCharCode(1920) && temp <= String.fromCharCode(1983)) //Thaana characters
                    || (temp >= String.fromCharCode(2112) && temp <= String.fromCharCode(2143)) //Mandiac characters
                    || (temp >= String.fromCharCode(1984) && temp <= String.fromCharCode(2047)) //N'Ko characters
                    || (temp >= String.fromCharCode(2048) && temp <= String.fromCharCode(2111)) //Samaritan characters
                    //Tifinag characters 
                    || (temp >= String.fromCharCode(11568) && temp <= String.fromCharCode(11647))) {
                    isRTL = true;
                    break;
                }
            }
        }
        return isRTL;
    }
    /**
     * @private
     * @param {string} text - Specifies the text
     * @returns {RtlInfo} - Returns the text info.
     */
    public getRtlLanguage(text: string): RtlInfo {
        if (isNullOrUndefined(text) || text === '') {
            return { isRtl: false, id: 0 };
        }
        if (text >= String.fromCharCode(1424) && text <= String.fromCharCode(1535)) {
            return { isRtl: true, id: 1 };
            //Arabic - Urdu characters
        } else if ((text >= String.fromCharCode(1536) && text <= String.fromCharCode(1791))
            || (text >= String.fromCharCode(1872) && text <= String.fromCharCode(1919))
            || (text >= String.fromCharCode(2208) && text <= String.fromCharCode(2303))
            || (text >= String.fromCharCode(64336) && text <= String.fromCharCode(65023))
            || (text >= String.fromCharCode(65136) && text <= String.fromCharCode(65279))) {
            return { isRtl: true, id: 2 };
        } else if (text >= String.fromCharCode(43392) && text <= String.fromCharCode(43487)) {
            return { isRtl: true, id: 3 };
        } else if (text >= String.fromCharCode(1792) && text <= String.fromCharCode(1871)) {
            return { isRtl: true, id: 4 };
        } else if (text >= String.fromCharCode(1920) && text <= String.fromCharCode(1983)) {
            return { isRtl: true, id: 5 };
        } else if (text >= String.fromCharCode(2112) && text <= String.fromCharCode(2143)) {
            return { isRtl: true, id: 6 };
        } else if (text >= String.fromCharCode(1984) && text <= String.fromCharCode(2047)) {
            return { isRtl: true, id: 7 };
        } else if (text >= String.fromCharCode(2048) && text <= String.fromCharCode(2111)) {
            return { isRtl: true, id: 8 };
        } else if (text >= String.fromCharCode(11568) && text <= String.fromCharCode(11647)) {
            return { isRtl: true, id: 9 };
        }
        return { isRtl: false, id: 0 };
    }
    public destroy(): void {
        this.documentHelper = undefined;
        this.context = undefined;
        this.paragraphMarkInfo = {};
        this.paragraphMarkInfo = undefined;
    }
}