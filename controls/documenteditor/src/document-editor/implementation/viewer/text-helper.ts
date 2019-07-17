import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat } from '../index';
import { TextElementBox, ListTextElementBox, ParagraphWidget } from './page';
import { LayoutViewer } from './viewer';
import { HelperMethods, RtlInfo } from '../editor/editor-helper';
import { BaselineAlignment, BiDirectionalOverride } from '../../index';
/** 
 * @private
 */
export interface TextSizeInfo {
    Height?: number;
    BaselineOffset?: number;
    Width?: number;
}
/** 
 * @private
 */
export interface TextHeightInfo {
    [key: string]: TextSizeInfo;
}
/** 
 * @private
 */
export class TextHelper {
    private owner: LayoutViewer;
    private context: CanvasRenderingContext2D;
    private paragraphMarkInfo: TextHeightInfo = {};
    private get paragraphMark(): string {
        return '¶';
    }
    private get lineBreakMark(): string {
        return '↲';
    }

    constructor(viewer: LayoutViewer) {
        this.owner = viewer;
        if (!isNullOrUndefined(viewer)) {
            this.context = viewer.containerContext;
        }
    }
    /**
     * @private
     */
    public getParagraphMarkWidth(characterFormat: WCharacterFormat): number {
        return this.getParagraphMarkSize(characterFormat).Width;
    }
    /**
     * @private
     */
    public getParagraphMarkSize(characterFormat: WCharacterFormat): TextSizeInfo {
        let format: string = this.getFormatText(characterFormat);
        if (this.paragraphMarkInfo[format]) {
            return this.paragraphMarkInfo[format];
        }
        // Gets the text element's width;
        let width: number = this.getWidth(this.paragraphMark, characterFormat);
        // Calculate the text element's height and baseline offset.
        let textHelper: TextSizeInfo = this.getHeight(characterFormat);
        let textSizeInfo: TextSizeInfo = {
            'Width': width, 'Height': textHelper.Height, 'BaselineOffset': textHelper.BaselineOffset
        };
        return this.paragraphMarkInfo[format] = textSizeInfo;
    }
    /**
     * @private
     */
    public getTextSize(elementBox: TextElementBox, characterFormat: WCharacterFormat): number {
        // Gets the text element's width;
        let textTrimEndWidth: number = 0;
        let isRTL: boolean = characterFormat.bidi || this.isRTLText(elementBox.text);
        let text: string = this.setText(elementBox.text, isRTL, characterFormat.bdo);
        textTrimEndWidth = this.getWidth(text, characterFormat);
        elementBox.width = textTrimEndWidth;
        // Calculate the text element's height and baseline offset.
        let textHelper: TextSizeInfo = this.getHeight(characterFormat);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
        if (elementBox.text[elementBox.text.length - 1] === ' ') {
            textTrimEndWidth = this.getWidth(HelperMethods.trimEnd(elementBox.text), characterFormat);
        }
        return textTrimEndWidth;
    }
    /**
     * @private
     */
    public getHeight(characterFormat: WCharacterFormat): TextSizeInfo {
        // Get character format property as  below predefined structure to make it easy to check and retrieve
        // Predefined static structure `[FontName];[FontSize];bold;italic` to maintain as key in the collection 
        let key: string = this.getFormatText(characterFormat);
        if (!isNullOrUndefined(this.owner.heightInfoCollection[key])) {
            return this.owner.heightInfoCollection[key];
        }
        let sizeInfo: TextSizeInfo = this.getHeightInternal(characterFormat);
        this.owner.heightInfoCollection[key] = sizeInfo;
        return sizeInfo;
    }
    /**
     * @private
     */
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
    /**
     * @private
     */
    public getHeightInternal(characterFormat: WCharacterFormat): TextSizeInfo {
        let textHeight: number = 0;
        let baselineOffset: number = 0;
        let spanElement: HTMLSpanElement = document.createElement('span');
        spanElement.innerText = 'm';
        this.applyStyle(spanElement, characterFormat);
        let parentDiv: HTMLDivElement = document.createElement('div');
        parentDiv.style.display = 'inline-block';
        let tempDiv: HTMLDivElement = document.createElement('div');
        tempDiv.setAttribute('style', 'display:inline-block;width: 1px; height: 0px;vertical-align: baseline;');
        parentDiv.appendChild(spanElement);
        parentDiv.appendChild(tempDiv);
        document.body.appendChild(parentDiv);
        // Sets the text element's height.
        textHeight = spanElement.offsetHeight;
        // Calculate the text element's baseline offset.
        let textTopVal: number = spanElement.offsetTop;
        let tempDivTopVal: number = tempDiv.offsetTop + (parentDiv.offsetWidth - spanElement.offsetWidth);
        baselineOffset = tempDivTopVal - textTopVal;
        document.body.removeChild(parentDiv);
        return { 'Height': textHeight, 'BaselineOffset': baselineOffset };
    }
    /**
     * @private
     */
    public measureTextExcludingSpaceAtEnd(text: string, characterFormat: WCharacterFormat): number {
        return this.getWidth(HelperMethods.trimEnd(text), characterFormat);
    }
    /**
     * @private
     */
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
        return this.context.measureText(text).width;
    }

    public setText(textToRender: string, isBidi: boolean, bdo: BiDirectionalOverride, isRender?: boolean): string {
        if (isNullOrUndefined(isRender)) {
            isRender = false;
        }
        if (textToRender.length === 0) {
            return '';
        }
        let isRtlText: boolean = isBidi;
        if ((!isRtlText && (bdo === 'RTL')) || (isRtlText && (bdo === 'LTR'))) {
            textToRender = HelperMethods.ReverseString(textToRender);
        } else if (isRender && isRtlText && HelperMethods.endsWith(textToRender)) {
            let spaceCount: number = textToRender.length - HelperMethods.trimEnd(textToRender).length;
            textToRender = HelperMethods.addSpace(spaceCount) + HelperMethods.trimEnd(textToRender);
        }
        return textToRender;
    }
    /**
     * @private
     */
    public applyStyle(spanElement: HTMLSpanElement, characterFormat: WCharacterFormat): void {
        if (!isNullOrUndefined(spanElement) && !isNullOrUndefined(characterFormat)) {
            let style: string = 'white-space:nowrap;';
            if (characterFormat.fontFamily !== '') {
                style += 'font-family:' + characterFormat.fontFamily + ';';
            }
            let fontSize: number = characterFormat.fontSize;
            if (fontSize <= 0.5) {
                fontSize = 0.5;
            }
            style += 'font-size:' + fontSize.toString() + 'pt;';
            if (characterFormat.bold) {
                style += 'font-weight:bold;';
            }
            if (characterFormat.italic) {
                style += 'font-style:italic;';
            }
            spanElement.setAttribute('style', style);
        }
    }
    /**
     * @private
     */
    public measureText(text: string, characterFormat: WCharacterFormat): TextSizeInfo {
        // Gets the text element's width;
        let width: number = this.getWidth(text, characterFormat);
        let height: number = 0;
        let baselineOffset: number = 0;
        // Calculate the text element's height and baseline offset.
        let textHelper: TextSizeInfo = this.getHeight(characterFormat);
        return {
            'Width': width, 'Height': textHelper.Height, 'BaselineOffset': textHelper.BaselineOffset
        };
    }
    /**
     * @private
     */
    public updateTextSize(elementBox: ListTextElementBox, paragraph: ParagraphWidget): void {
        let format: WCharacterFormat = new WCharacterFormat(undefined);
        let listCharacterFormat: WCharacterFormat = elementBox.listLevel.characterFormat;
        let breakCharacterFormat: WCharacterFormat = paragraph.characterFormat;
        format.fontSize = listCharacterFormat.fontSize === 11 ? breakCharacterFormat.fontSize : listCharacterFormat.fontSize;
        format.fontFamily = listCharacterFormat.fontFamily === 'Verdana' ? breakCharacterFormat.fontFamily
            : listCharacterFormat.fontFamily;
        let bold: string = '';
        let italic: string = '';
        let baselineAlignment: BaselineAlignment = listCharacterFormat.baselineAlignment === 'Normal' ?
            breakCharacterFormat.baselineAlignment : listCharacterFormat.baselineAlignment;
        bold = listCharacterFormat.bold ? 'bold' : breakCharacterFormat.bold ? 'bold' : '';
        italic = listCharacterFormat.italic ? 'italic' : breakCharacterFormat.italic ? 'italic' : '';
        format.baselineAlignment = baselineAlignment;
        if (bold) {
            format.bold = true;
        }
        if (italic) {
            format.italic = true;
        }
        let isRTL: boolean = format.bidi || this.isRTLText(elementBox.text);
        let text: string = this.setText(elementBox.text, isRTL, format.bdo);
        elementBox.width = this.getWidth(text, format);
        // Calculate the text element's height and baseline offset.
        let textHelper: TextSizeInfo = this.getHeight(format);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
    }

    /**
     * @private
     */
    public isRTLText(text: string): boolean {
        let isRTL: boolean = false;
        if (!isNullOrUndefined(text)) {
            for (let i: number = 0; i < text.length; i++) {
                let temp: string = text[i];
                if ((temp >= '\u0590' && temp <= '\u05ff') //Hebrew characters
                    || (temp >= '\u0600' && temp <= '\u06ff') //Arabic - Urdu characters
                    || (temp >= '\u0750' && temp <= '\u077f') //Arabic - Urdu characters
                    || (temp >= '\u08a0' && temp <= '\u08ff') //Arabic characters
                    || (temp >= '\ufb50' && temp <= '\ufdff') //Arabic - Urdu characters
                    || (temp >= '\ufe70' && temp <= '\ufeff') //Arabic - Urdu characters
                    || (temp >= '\ua980' && temp <= '\ua9df') //Javanese characters
                    || (temp >= '\u0700' && temp <= '\u074f') //Syriac characters
                    || (temp >= '\u0780' && temp <= '\u07bf') //Thaana characters
                    || (temp >= '\u0840' && temp <= '\u085f') //Mandiac characters
                    || (temp >= '\u07c0' && temp <= '\u07ff') //N'Ko characters
                    || (temp >= '\u0800' && temp <= '\u083f') //Samaritan characters
                    //Tifinag characters 
                    || (temp >= '\u2d30' && temp <= '\u2d7f')) {
                    isRTL = true;
                    break;
                }
            }
        }
        return isRTL;
    }
    /**
     * @private     
     */
    public getRtlLanguage(text: string): RtlInfo {
        if (isNullOrUndefined(text) || text === '') {
            return { isRtl: false, id: 0 };
        }
        if (text >= '\u0590' && text <= '\u05ff') {
            return { isRtl: true, id: 1 };
            //Arabic - Urdu characters
        } else if ((text >= '\u0600' && text <= '\u06ff')
            || (text >= '\u0750' && text <= '\u077f')
            || (text >= '\u08a0' && text <= '\u08ff')
            || (text >= '\ufb50' && text <= '\ufdff')
            || (text >= '\ufe70' && text <= '\ufeff')) {
            return { isRtl: true, id: 2 };
        } else if (text >= '\ua980' && text <= '\ua9df') {
            return { isRtl: true, id: 3 };
        } else if (text >= '\u0700' && text <= '\u074f') {
            return { isRtl: true, id: 4 };
        } else if (text >= '\u0780' && text <= '\u07bf') {
            return { isRtl: true, id: 5 };
        } else if (text >= '\u0840' && text <= '\u085f') {
            return { isRtl: true, id: 6 };
        } else if (text >= '\u07c0' && text <= '\u07ff') {
            return { isRtl: true, id: 7 };
        } else if (text >= '\u0800' && text <= '\u083f') {
            return { isRtl: true, id: 8 };
        } else if (text >= '\u2d30' && text <= '\u2d7f') {
            return { isRtl: true, id: 9 };
        }
        return { isRtl: false, id: 0 };
    }
    public destroy(): void {
        this.owner = undefined;
        this.context = undefined;
        this.paragraphMarkInfo = {};
        this.paragraphMarkInfo = undefined;
    }
}