import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WCharacterFormat } from '../index';
import { TextElementBox, ListTextElementBox, ParagraphWidget } from './page';
import { LayoutViewer } from './viewer';
import { HelperMethods } from '../editor/editor-helper';
import { BaselineAlignment } from '../../index';
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
        return this.getWidth(this.paragraphMark, characterFormat);
    }
    /**
     * @private
     */
    public getParagraphMarkSize(characterFormat: WCharacterFormat): TextSizeInfo {
        // Gets the text element's width;
        let width: number = this.getWidth(this.paragraphMark, characterFormat);
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
    public getTextSize(elementBox: TextElementBox, characterFormat: WCharacterFormat): number {
        // Gets the text element's width;
        let textTrimEndWidth: number = 0;
        textTrimEndWidth = this.getWidth(elementBox.text, characterFormat);
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
        spanElement.id = 'tempSpan';
        spanElement.style.whiteSpace = 'nowrap';
        spanElement.innerText = 'm';
        this.applyStyle(spanElement, characterFormat);
        let body: NodeListOf<HTMLBodyElement> = document.getElementsByTagName('body');
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
        let tempDivTopVal: number = tempDiv.offsetTop;
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
    /**
     * @private
     */
    public applyStyle(spanElement: HTMLSpanElement, characterFormat: WCharacterFormat): void {
        if (!isNullOrUndefined(spanElement) && !isNullOrUndefined(characterFormat)) {
            if (characterFormat.fontFamily !== '') {
                spanElement.style.fontFamily = characterFormat.fontFamily;
            }
            let fontSize: number = characterFormat.fontSize;
            if (fontSize <= 0.5) {
                fontSize = 0.5;
            }
            spanElement.style.fontSize = fontSize.toString() + 'pt';
            if (characterFormat.bold) {
                spanElement.style.fontWeight = 'bold';
            }
            if (characterFormat.italic) {
                spanElement.style.fontStyle = 'italic';
            }
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
        elementBox.width = this.getWidth(elementBox.text, format);
        // Calculate the text element's height and baseline offset.
        let textHelper: TextSizeInfo = this.getHeight(format);
        elementBox.height = textHelper.Height;
        elementBox.baselineOffset = textHelper.BaselineOffset;
    }
    public destroy(): void {
        this.owner = undefined;
        this.context = undefined;
    }
}