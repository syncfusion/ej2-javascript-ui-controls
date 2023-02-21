import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat } from '../index';
import { defaultFont, Dictionary } from '../../index'
import { TextElementBox, ListTextElementBox, ParagraphWidget } from './page';
import { DocumentHelper } from './viewer';
import { HelperMethods, LtrRtlTextInfo, RtlInfo } from '../editor/editor-helper';
import { BaselineAlignment, BiDirectionalOverride, CharacterRangeType, FontScriptType, MajorMinorFontScheme, FontScheme, FontHintType, FontSchemeStruct } from '../../index';
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


    private static wordSplitCharacters: string[] = [ String.fromCharCode(32), String.fromCharCode(33), String.fromCharCode(34), String.fromCharCode(35), String.fromCharCode(36), String.fromCharCode(37), String.fromCharCode(38), String.fromCharCode(39), String.fromCharCode(40), String.fromCharCode(41), String.fromCharCode(42), String.fromCharCode(43), String.fromCharCode(44), String.fromCharCode(45), String.fromCharCode(46), String.fromCharCode(47), String.fromCharCode(58), String.fromCharCode(59), String.fromCharCode(60), String.fromCharCode(61), String.fromCharCode(62), String.fromCharCode(63), String.fromCharCode(64), String.fromCharCode(91), String.fromCharCode(92), String.fromCharCode(93), String.fromCharCode(94), String.fromCharCode(95), String.fromCharCode(96), String.fromCharCode(123), String.fromCharCode(124), String.fromCharCode(125), String.fromCharCode(126), String.fromCharCode(1548), String.fromCharCode(1563), String.fromCharCode(8211), String.fromCharCode(8212), String.fromCharCode(8216), String.fromCharCode(8217), String.fromCharCode(8221), String.fromCharCode(12288), String.fromCharCode(8207) ];

    private static numberNonReversingCharacters: string[] = [String.fromCharCode(44), String.fromCharCode(46), String.fromCharCode(47), String.fromCharCode(58), String.fromCharCode(1548) ];

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
        if (this.paragraphMarkInfo[`${format}`]) {
            return this.paragraphMarkInfo[`${format}`];
        }
        // Gets the text element's width;
        const width: number = this.getWidth(this.paragraphMark, characterFormat);
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat);
        const textSizeInfo: TextSizeInfo = {
            'Width': width, 'Height': textHelper.Height, 'BaselineOffset': textHelper.BaselineOffset
        };
        return this.paragraphMarkInfo[`${format}`] = textSizeInfo;
    }
    public getTextSize(elementBox: TextElementBox, characterFormat: WCharacterFormat): number {
        // Gets the text element's width;
        let textTrimEndWidth: number = 0;
        const isRTL: boolean = characterFormat.bidi || this.isRTLText(elementBox.text);
        const text: string = this.setText(elementBox.text, isRTL, characterFormat.bdo);
        textTrimEndWidth = this.getWidth(text, characterFormat, elementBox.scriptType);
        elementBox.width = textTrimEndWidth;
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat, elementBox.scriptType);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
        if (elementBox.text[elementBox.text.length - 1] === ' ') {
            textTrimEndWidth = this.getWidth(HelperMethods.trimEnd(elementBox.text), characterFormat, elementBox.scriptType);
        }
        elementBox.trimEndWidth = textTrimEndWidth;
        return textTrimEndWidth;
    }
    public getHeight(characterFormat: WCharacterFormat, scriptType?: FontScriptType): TextSizeInfo {
        let fontToRender: string = this.getFontNameToRender(scriptType, characterFormat);
        // Get character format property as  below predefined structure to make it easy to check and retrieve
        // Predefined static structure `[FontName];[FontSize];bold;italic` to maintain as key in the collection
        const key: string = this.getFormatText(characterFormat, fontToRender);
        if (!isNullOrUndefined(this.documentHelper.heightInfoCollection[`${key}`])) {
            return this.documentHelper.heightInfoCollection[`${key}`];
        }
        const sizeInfo: TextSizeInfo = this.documentHelper.owner.textMeasureHelper.getHeightInternal(characterFormat, fontToRender);
        this.documentHelper.heightInfoCollection[`${key}`] = sizeInfo;
        return sizeInfo;
    }
    public getFormatText(characterFormat: WCharacterFormat, fontToRender?: string): string {
        let formatText: string = '';
        if(!isNullOrUndefined(fontToRender)){
            formatText = fontToRender.toLocaleLowerCase();
        }else{
            formatText = characterFormat.fontFamily.toLocaleLowerCase();
        }        
        formatText += ';' + characterFormat.fontSize;
        if (characterFormat.bold) {
            formatText += ';' + 'bold';
        }
        if (characterFormat.italic) {
            formatText += ';' + 'italic';
        }
        return formatText;
    }
    public measureTextExcludingSpaceAtEnd(text: string, characterFormat: WCharacterFormat, scriptType: FontScriptType): number {
        return this.getWidth(HelperMethods.trimEnd(text), characterFormat, scriptType);
    }
    public getWidth(text: string, characterFormat: WCharacterFormat, scriptType?: FontScriptType): number {
        if (text.match('\v')) {
            text.replace('\v', this.lineBreakMark);
        }
        let bold: string = '';
        let italic: string = '';
        let fontFamily: string = '';
        let fontSize: number = characterFormat.fontSize;
        bold = characterFormat.bold ? 'bold' : '';
        italic = characterFormat.italic ? 'italic' : '';
        fontFamily = this.getFontNameToRender(scriptType, characterFormat);
        fontSize = fontSize === 0 ? 0.5 : fontSize / (characterFormat.baselineAlignment === 'Normal' ? 1 : 1.5);
        this.context.font = bold + ' ' + italic + ' ' + fontSize + 'pt' + ' ' + '"' + fontFamily + '"';
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

    public measureText(text: string, characterFormat: WCharacterFormat, scriptType?: FontScriptType): TextSizeInfo {
        // Gets the text element's width;
        const width: number = this.getWidth(text, characterFormat, scriptType);
        // Calculate the text element's height and baseline offset.
        const textHelper: TextSizeInfo = this.getHeight(characterFormat, scriptType);
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
        format.destroy();
    }
    public containsSpecialCharAlone(text: string): boolean {
        /* eslint-disable */
        let specialChars: string = '*|.\:[]{}-`\;()@&$#%!~?,' + ' ' + "'";
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
                if ((temp >= String.fromCharCode(1424) && temp <= String.fromCharCode(1535)) ////Script-Hebr, Hebrew characters https://en.wikipedia.org/wiki/Hebrew_alphabet#Unicode_and_HTML (https://en.wikipedia.org/wiki/Hebrew_(Unicode_block))
                    || (temp >= String.fromCharCode(64285) && temp <= String.fromCharCode(64335)) //Script-Hebr, Hebrew Alphabetic Presentation Forms characters https://en.wikipedia.org/wiki/Alphabetic_Presentation_Forms 
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

    /**
     * @private
     */
    public splitTextByConsecutiveLtrAndRtl(text: string, isTextBidi: boolean, isRTLLang: boolean, characterRangeTypes: CharacterRangeType[], isPrevLTRText: LtrRtlTextInfo, hasRTLCharacter: LtrRtlTextInfo): string[] {
        let charTypeIndex: number = characterRangeTypes.length;
        let splittedText: string[] = [];
        if (isNullOrUndefined(text) || text === '') {
            return splittedText;
        }

        let lastLtrIndex: number = -1;
        let ltrText: string = '';
        let rtlText: string = '';
        let wordSplitChars: string = '';
        let numberText: string = '';

        for (let i: number = 0; i < text.length; i++) {
            let currentCharacterType: number = 0;
            let separateEachWordSplitChars: boolean = false;

            if ((!isNullOrUndefined(isPrevLTRText.value) ? !isPrevLTRText.value : isTextBidi) && this.isNumber(text[i])) {
                numberText += text[i];
                currentCharacterType = 4;
            } else if (this.isWordSplitChar(text[i])) {
                currentCharacterType = 2;
                if (separateEachWordSplitChars = (isTextBidi || (text.charCodeAt(i) == 32 && wordSplitChars == ''))) {
                    wordSplitChars += text[i];
                } else {
                    wordSplitChars += text[i];
                }
            } else if (this.isRTLText(text[i]) && !this.isNumber(text[i])) {
                isPrevLTRText.value = false;
                hasRTLCharacter.value = true;
                rtlText += text[i];
                currentCharacterType = 1;
            } else {
                isPrevLTRText.value = true;
                ltrText += text[i];
            }

            if (numberText != '' && currentCharacterType != 4) {
                splittedText.push(numberText);
                characterRangeTypes.push(CharacterRangeType.Number);
                numberText = '';
            }

            if (rtlText != '' && currentCharacterType != 1) {
                splittedText.push(rtlText);
                characterRangeTypes.push(CharacterRangeType.RightToLeft);
                rtlText = '';
            }

            if (ltrText != '' && currentCharacterType != 0) {
                splittedText.push(ltrText);
                lastLtrIndex = splittedText.length - 1;
                characterRangeTypes.push(CharacterRangeType.LeftToRight);
                ltrText = '';
            }

            if (wordSplitChars != '' && (currentCharacterType != 2 || separateEachWordSplitChars)) {
                splittedText.push(wordSplitChars);
                characterRangeTypes.push(CharacterRangeType.WordSplit);
                wordSplitChars = '';
            }
        }

        if (numberText != '') {
            splittedText.push(numberText);
            characterRangeTypes.push(CharacterRangeType.Number);
        } else if (rtlText != '') {
            splittedText.push(rtlText);
            characterRangeTypes.push(CharacterRangeType.RightToLeft);
        } else if (ltrText != '') {
            splittedText.push(ltrText);
            lastLtrIndex = splittedText.length - 1;
            characterRangeTypes.push(CharacterRangeType.LeftToRight);
        } else if (wordSplitChars != '') {
            splittedText.push(wordSplitChars);
            characterRangeTypes.push(CharacterRangeType.WordSplit);
        }

        if (hasRTLCharacter.value || (!isNullOrUndefined(isPrevLTRText.value) && !isPrevLTRText.value)) {
            for (let i = 1; i < splittedText.length; i++) {
                //Combines the consecutive LTR, RTL, and Number (Number get combined only if it's splitted by non reversing characters (.,:)) 
                //along with single in-between word split character.
                let charType: CharacterRangeType = characterRangeTypes[i + charTypeIndex];
                if (charType == CharacterRangeType.WordSplit && splittedText[i].length == 1
                    && i + charTypeIndex + 1 < characterRangeTypes.length
                    && characterRangeTypes[i + charTypeIndex - 1] != CharacterRangeType.WordSplit
                    && (characterRangeTypes[i + charTypeIndex - 1] != CharacterRangeType.Number
                        //Else handled to combine consecutive number when text bidi is false and middle word split character is not white space.
                        || TextHelper.isNumberNonReversingCharacter(splittedText[i], isTextBidi))
                    && characterRangeTypes[i + charTypeIndex - 1] == characterRangeTypes[i + charTypeIndex + 1]) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + splittedText[i + 1];
                    splittedText.splice(i, 1);
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                }
            }
        } else if (lastLtrIndex != -1) {
            if (isTextBidi) {
                for (let i = 1; i < lastLtrIndex; i++) {
                    //Combines the first and last LTR along with all in-between splited text's.
                    let charType: CharacterRangeType = characterRangeTypes[i + charTypeIndex];
                    if (charType == CharacterRangeType.WordSplit && i < lastLtrIndex
                        && characterRangeTypes[i + charTypeIndex - 1] == CharacterRangeType.LeftToRight) {
                        ltrText = '';
                        for (let j = i + 1; j <= lastLtrIndex; j++) {
                            ltrText += splittedText[j];
                            splittedText.splice(j, 1);
                            characterRangeTypes.splice(j + charTypeIndex, 1);
                            j--;
                            lastLtrIndex--;
                        }

                        splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + ltrText;
                        splittedText.splice(i, 1);
                        characterRangeTypes.splice(i + charTypeIndex, 1);
                        i--;
                        lastLtrIndex--;
                    }
                }
            } else {
                //Return the input text if text bidi is false.
                splittedText.length = 0;
                splittedText.push(text);
            }
        } else if (!isTextBidi) {
            //Return the input text if text bidi is false.
            splittedText.length = 0;
            splittedText.push(text);
        }


        if (isTextBidi) {
            for (let i = 1; i < splittedText.length; i++) {
                //Combines the consecutive LTR, RTL, and Number (Number get combined only if it's splitted by non reversing characters (.,:)
                //or if it's lang attribute is represent a RTL language)
                //along with single in-between number non reversing word split character.
                let charType: CharacterRangeType = characterRangeTypes[i + charTypeIndex];
                if (charType == CharacterRangeType.WordSplit && splittedText[i].length == 1
                    && i + charTypeIndex + 1 < characterRangeTypes.length
                    && characterRangeTypes[i + charTypeIndex - 1] != CharacterRangeType.WordSplit
                    && (characterRangeTypes[i + charTypeIndex - 1] != CharacterRangeType.Number
                        || TextHelper.isNumberNonReversingCharacter(splittedText[i], isTextBidi) || !isRTLLang)
                    && characterRangeTypes[i + charTypeIndex - 1] == characterRangeTypes[i + charTypeIndex + 1]) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i] + splittedText[i + 1];
                    splittedText.splice(i, 1);
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                }
                //Combines the Number along with single non-word split characters (% $ #).
                else if (charType == CharacterRangeType.WordSplit
                    && characterRangeTypes[i + charTypeIndex - 1] == CharacterRangeType.Number
                    && this.isNonWordSplitCharacter(splittedText[i]) && !isRTLLang) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i];
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                }
                //Combines the consecutive LTR and Number
                else if (charType == CharacterRangeType.LeftToRight
                    && (characterRangeTypes[i + charTypeIndex - 1] == CharacterRangeType.Number
                        || characterRangeTypes[i + charTypeIndex - 1] == CharacterRangeType.LeftToRight)) {
                    splittedText[i - 1] = splittedText[i - 1] + splittedText[i];
                    characterRangeTypes[i + charTypeIndex - 1] = CharacterRangeType.LeftToRight;
                    splittedText.splice(i, 1);
                    characterRangeTypes.splice(i + charTypeIndex, 1);
                    i--;
                }
            }
        }
        return splittedText;
    }

    /**
     * @private
     */
    public isRightToLeftLanguage(lang: number): boolean {
        return (lang == 14337 || lang == 15361 || lang == 5121 || lang == 3073 || lang == 2049 ||
            lang == 11265 || lang == 13313 || lang == 12289 || lang == 4097 || lang == 8193 ||
            lang == 16385 || lang == 1025 || lang == 10241 || lang == 7169 || lang == 9217 || lang == 10655);
    }

    private isNumber(ch: string): boolean {
        if (!isNaN(parseInt(ch, 10))) {
            //This logic works for universal digits 0 to 9.
            return true;
        } else if (ch >= String.fromCharCode(1632) && ch <= String.fromCharCode(1641)) {
            //This logic works for ARABIC-INDIC DIGIT
            return true;
        } else if (ch >= String.fromCharCode(1776) && ch <= String.fromCharCode(1785)) {
            //This logic works for EXTENDED ARABIC-INDIC DIGIT
            return true;
        } else {
            //TODO: Extend this for language specific 
            return false;
        }
    }
    /**
     * @private
     */
    public isWordSplitChar(character: string): boolean {
        for (let i: number = 0; i < TextHelper.wordSplitCharacters.length; i++) {
            if (TextHelper.wordSplitCharacters[i] === character) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public static isNumberNonReversingCharacter(character: string, isTextBidi: boolean): boolean {
        for (let i: number = 0; i < TextHelper.numberNonReversingCharacters.length; i++) {
            let ch: string = TextHelper.numberNonReversingCharacters[i];
            if (character[0] == ch && (ch.charCodeAt(0) == 47 ? !isTextBidi : true)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @private
     */
    public isNonWordSplitCharacter(character: string): boolean {
        let isNonWordSplitChar: boolean = false;
        for (let i = 0; i < character.length; i++) {
            let charCode: number = character.charCodeAt(i);
            //Consider a (% $ #) as non-word split characters
            if (charCode == 35 || charCode == 36 || charCode == 37) {
                isNonWordSplitChar = true;
            } else {
                isNonWordSplitChar = false;
                break;
            }
        }
        return isNonWordSplitChar;
    }
    public getFontNameToRender(scriptType: FontScriptType, charFormat: WCharacterFormat): string {
        if (!isNullOrUndefined(scriptType)) {
            if (charFormat.bidi || charFormat.complexScript) {
                return this.getFontNameBidiToRender(scriptType, charFormat);
            } else {
                if (this.isEastAsiaScript(scriptType))
                    return this.getFontNameEAToRender(scriptType, charFormat);

                else
                return this.getFontNameAsciiToRender(scriptType, charFormat);
            }
        } else {
            return charFormat.fontFamily;
        }
    }
    /// <summary>
    /// Check whether specified script is EastAsia script or not.
    /// </summary>
    /// <param name="scriptType">Represent a FontScriptType to check.</param>
    /// <returns></returns>
    private isEastAsiaScript(scriptType: FontScriptType): boolean
    {
        return scriptType == FontScriptType.Japanese || scriptType == FontScriptType.Korean
            || scriptType == FontScriptType.Chinese;
    }
            /// <summary>
        /// Get the font name East Asia to render
        /// </summary>
        /// <param name="scriptType">Represent a CharacterRangeType.</param>
        /// <returns>Returns a eastAsia font name to draw the text.</returns>
        private getFontNameEAToRender(scriptType: FontScriptType, charFormat: WCharacterFormat)
        {            
            let fontName: string = charFormat.fontFamilyFarEast;
            if (isNullOrUndefined(fontName) || HelperMethods.isThemeFont(fontName))
                return this.getFontNameFromTheme(charFormat, fontName, scriptType, FontHintType.EastAsia);
            else
                return fontName;
        }
    private getFontNameBidiToRender(scriptType: FontScriptType, charFormat: WCharacterFormat)
    
            {
                //If CharacterFormat.Bidi is true, then font is determined in the order: FontNameBidi, Script-Arab, font scheme(latin, ea, cs), default font (Times New Roman)
                //CharacterRangeType of a text and FontHintType (IdctHint) has no impact in this behavior.
                //Note: Behavior is traced using Word version 1808 (build 10730.20304)
                //Determines the font nmae to used for RTL characters based on its script from direct or font scheme (Document theme file)
                let fontName: string = charFormat.fontFamilyBidi;
                if (!isNullOrUndefined(fontName) || HelperMethods.isThemeFont(fontName))
                    return this.getFontNameFromTheme(charFormat, fontName, scriptType, FontHintType.CS);
                else
                    return fontName;
            }
            private getFontNameAsciiToRender(scriptType: FontScriptType, charFormat: WCharacterFormat)
            {            
                let fontName: string = charFormat.fontFamilyAscii;
                if (HelperMethods.isThemeFont(fontName))
                    return this.getFontNameFromTheme(charFormat, fontName, scriptType, FontHintType.Default);
                else
                    return charFormat.fontFamily;
            }
        private getFontNameFromTheme(charFormat: WCharacterFormat, fontName:string,  scriptType:FontScriptType, hintType: FontHintType,isAscii?:boolean): string
        {            
            let fontScheme: FontScheme;
            if(this.documentHelper.hasThemes && !isNullOrUndefined(this.documentHelper.themes) && !isUndefined(this.documentHelper.themes.fontScheme))
                 fontScheme = this.documentHelper.themes.fontScheme;

            if (fontName == "majorAscii" || fontName == "majorBidi" || fontName == "majorEastAsia" || fontName == "majorHAnsi")
            {
                let majorFontScheme: MajorMinorFontScheme;
                if (fontScheme != null && fontScheme.majorFontScheme != null) {
                    majorFontScheme = fontScheme.majorFontScheme;
                }
                fontName = this.updateFontNameFromTheme(charFormat, majorFontScheme, scriptType, fontName, hintType);
            }
            else if (fontName == "minorAscii" || fontName == "minorBidi" || fontName == "minorEastAsia" || fontName == "minorHAnsi")
            {
                let minorFontScheme: MajorMinorFontScheme;
                if (fontScheme != null && fontScheme.majorFontScheme != null) {
                    minorFontScheme = fontScheme.minorFontScheme;
                }
                fontName = this.updateFontNameFromTheme(charFormat, minorFontScheme, scriptType, fontName, hintType);
            }
            if (isNullOrUndefined(fontName) || HelperMethods.isThemeFont(fontName)){
                //Gets the default font (Times New Roman)
                fontName = defaultFont;               
            }
            return fontName;
        }

                /// <summary>
        /// Update a font name from theme, based on FontHintType.
        /// </summary>
        /// <param name="majorMinorFontScheme"></param>
        /// <param name="scriptType"></param>
        /// <param name="fontName"></param>
        /// <param name="hintType"></param>
        private updateFontNameFromTheme(charFormat: WCharacterFormat, majorMinorFontScheme: MajorMinorFontScheme, scriptType: FontScriptType, fontName: string, hintType: FontHintType): string 
        {
            //Script-Arab, font scheme(latin, ea, cs), default font (Times New Roman)
            let fontNameFromTheme: string = "";
            //Gets font from font scheme(latin, ea, cs) of document theme.
            if (majorMinorFontScheme != null && majorMinorFontScheme.fontSchemeList != null
                && majorMinorFontScheme.fontSchemeList.length > 0)
            {
                 majorMinorFontScheme.fontSchemeList.forEach((fontSchemeStruct: FontSchemeStruct) => {
                    
                        if (fontSchemeStruct.name == "cs" && (fontName == "majorBidi" || fontName == "minorBidi"))
                            fontNameFromTheme = fontSchemeStruct.typeface;
                        else if (fontSchemeStruct.name == "ea" && (fontName == "majorEastAsia" || fontName == "minorEastAsia"))
                            fontNameFromTheme = fontSchemeStruct.typeface;
                        else if (fontSchemeStruct.name == "latin" && (fontName == "majorAscii" || fontName == "majorHAnsi"
                            || fontName == "minorAscii" || fontName == "minorHAnsi"))
                            fontNameFromTheme = fontSchemeStruct.typeface;
                    
                 })
                
            }
            if (majorMinorFontScheme != null && majorMinorFontScheme.fontTypeface != null)
            {
                if (hintType == FontHintType.CS)
                {
                    // //If it's an complex script and "themeFontLang" element has a "bidi" attribute, then we need to locate the font name
                    // //from the "theme.xml" for the language specified by the bidi attribute
                    // if (charFormat.complexScript && Document != null && Document.Settings.ThemeFontLanguages != null &&
                    //     Document.Settings.ThemeFontLanguages.HasValue(WCharacterFormat.LidBiKey))
                    // {
                    //     fontName = this.getFontNameWithFontScript(majorMinorFontScheme, Document.Settings.ThemeFontLanguages.LocaleIdBidi, hintType);
                    //     if (fontName != null)
                    //         fontNameFromTheme = fontName;
                    // }
                    // //To-Do: Have to implement the font name retrieval behavior, when a bidi attribute is not available in theme.
                    // else 
                    if (majorMinorFontScheme.fontTypeface.containsKey('Arab'))
                    {
                        //map(object => object.id).indexOf('c');
                        //Gets the Arab-script (language) based font from font scheme (theme)
                        fontNameFromTheme = majorMinorFontScheme.fontTypeface.get('Arab');
                    }
                }
                else if (hintType == FontHintType.EastAsia)
                {
                    // if (Document != null && Document.Settings.ThemeFontLanguages != null &&
                    //     Document.Settings.ThemeFontLanguages.HasValue(WCharacterFormat.LocaleIdFarEastKey))
                    // {
                    //     fontName = this.getFontNameWithFontScript(majorMinorFontScheme, Document.Settings.ThemeFontLanguages.LocaleIdFarEast, hintType);
                    //     if (fontName != null)
                    //         fontNameFromTheme = fontName;
                    // }
                }
            }
            
            if (isNullOrUndefined(fontNameFromTheme))
                //Gets the default font (Times New Roman)
                fontNameFromTheme = defaultFont;

            fontName = fontNameFromTheme;
            return fontName;
        }
        // /// <summary>
        // /// Gets the font name from a theme part for the specified font script.
        // /// </summary>
        // private getFontNameWithFontScript(majorMinorFontScheme: MajorMinorFontScheme, localeID: number, hintType: FontHintType): string
        // {
        //     let fontName: string = null;
        //     //To-Do: Should extend this behavior deponds on the localeID.
        //     let lang: string = LocaleIDs[localeID];
        //     let fontTypeFaces: Dictionary<string, string> = majorMinorFontScheme.fontTypeface;
        //     //Gujarati
        //     //If lang script is "gu-IN" or "gu", we should retrive the "Gujr" font from a theme part.
        //     if ((lang == 'gu_IN' || localeID == 71) && fontTypeFaces.containsKey("Gujr"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Hindi
        //     //If lang script is "hi-IN" or "hi", we should retrive the "Deva" font from a theme part.
        //     //Marathi
        //     //If lang script is "mr-IN" or "mr", we should retrive the "Deva" font from a theme part.
        //     else if ((lang == 'hi_IN' || lang == 'mr_IN' || localeID == 57 || localeID == 78)
        //         && fontTypeFaces.containsKey("Deva"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Korean
        //     //If lang script is "ko-KR" or "ko", we should retrive the "Hang" font from a theme part.
        //     else if ((lang == 'ko_KR' || localeID == 18) && fontTypeFaces.containsKey("Hang"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Chinese - Simplified
        //     //If lang script is "zh-CN", "zh-SG" or "zh", we should retrive the "Hans" font from a theme part.
        //     else if ((lang == 'zh_CN' || lang == 'zh_SG' || localeID == 4) && fontTypeFaces.containsKey("Hans"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Chinese - Traditional
        //     //If lang script is "zh-TW", "zh-HK", or "zh-MO", we should retrive the "Hant" font from a theme part.
        //     else if ((lang == 'zh_TW' || lang == 'zh_HK' || lang == 'zh_MO') 
        //         && fontTypeFaces.containsKey("Hant"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Japanese
        //     //If lang script is "ja-JP" or "ja", we should retrive the "Jpan" font from a theme part.
        //     else if ((lang == 'ja_JP' || localeID == 17) && fontTypeFaces.containsKey("Jpan"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Tamil
        //     //If lang script is "ta-IN" or "ta", we should retrive the "Taml" font from a theme part.
        //     else if ((lang == 'ta_IN' || localeID == 73) && fontTypeFaces.containsKey("Taml"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Telugu
        //     //If lang script is "te-IN" or "te", we should retrive the "Telu" font from a theme part.
        //     else if ((lang == 'te_IN' || localeID == 74) && fontTypeFaces.containsKey("Telu"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Hebrew
        //     //If lang script is "he-IL" or "he", we should retrive the "Hebr" font from a theme part.
        //     else if ((lang == 'he_IL' || lang == 'yi_Hebr' || localeID == 13) && fontTypeFaces.containsKey("Hebr"))
        //         fontName = fontTypeFaces.get("Arab");
        //     //Thai
        //     //If lang script is "th_TH" or "th", we should retrive the "Thai" font from a theme part.
        //     else if ((lang == 'th_TH' || localeID == 30) && fontTypeFaces.containsKey("Thai"))
        //         fontName = fontTypeFaces.get("Thai");
        //     //Arabic
        //     else if (hintType == FontHintType.CS && fontTypeFaces.containsKey("Arab"))
        //         fontName = fontTypeFaces.get("Arab");

        //     return fontName;
        // }

    public destroy(): void {
        this.documentHelper = undefined;
        this.context = undefined;
        this.paragraphMarkInfo = {};
        this.paragraphMarkInfo = undefined;
    }
}