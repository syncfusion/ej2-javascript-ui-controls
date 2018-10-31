import { TextElementBox, ParagraphWidget } from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { Underline, HighlightColor, BaselineAlignment, Strikethrough } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WStyle, WParagraphStyle } from './style';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/** 
 * @private
 */
export class WCharacterFormat {
    public uniqueCharacterFormat: WUniqueFormat = undefined;
    private static uniqueCharacterFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 2;
    public ownerBase: Object = undefined;
    public baseCharStyle: WStyle = undefined;
    get bold(): boolean {
        return this.getPropertyValue('bold') as boolean;
    }
    set bold(value: boolean) {
        this.setPropertyValue('bold', value);
    }
    get italic(): boolean {
        return this.getPropertyValue('italic') as boolean;
    }
    set italic(value: boolean) {
        this.setPropertyValue('italic', value);
    }
    get fontSize(): number {
        return this.getPropertyValue('fontSize') as number;
    }
    set fontSize(value: number) {
        this.setPropertyValue('fontSize', value);
    }
    get fontFamily(): string {
        return this.getPropertyValue('fontFamily') as string;
    }
    set fontFamily(value: string) {
        this.setPropertyValue('fontFamily', value);
    }
    get underline(): Underline {
        return this.getPropertyValue('underline') as Underline;
    }
    set underline(value: Underline) {
        this.setPropertyValue('underline', value);
    }
    get strikethrough(): Strikethrough {
        return this.getPropertyValue('strikethrough') as Strikethrough;
    }
    set strikethrough(value: Strikethrough) {
        this.setPropertyValue('strikethrough', value);
    }
    get baselineAlignment(): BaselineAlignment {
        return this.getPropertyValue('baselineAlignment') as BaselineAlignment;
    }
    set baselineAlignment(value: BaselineAlignment) {
        this.setPropertyValue('baselineAlignment', value);
    }
    get highlightColor(): HighlightColor {
        return this.getPropertyValue('highlightColor') as HighlightColor;
    }
    set highlightColor(value: HighlightColor) {
        this.setPropertyValue('highlightColor', value);
    }
    get fontColor(): string {
        return this.getPropertyValue('fontColor') as string;
    }
    set fontColor(value: string) {
        this.setPropertyValue('fontColor', value);
    }
    constructor(node?: Object) {
        this.ownerBase = node;
    }
    public getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            let charStyleValue: Object = this.checkCharacterStyle(property);
            if (!isNullOrUndefined(charStyleValue)) {
                return charStyleValue;
            } else {
                let baseStyleValue: Object = this.checkBaseStyle(property);
                if (!isNullOrUndefined(baseStyleValue)) {
                    return baseStyleValue;
                }
            }
        } else {
            let propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueCharacterFormat) && this.uniqueCharacterFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueCharacterFormat.propertiesHash.get(propertyType);
            }
        }
        return this.getDefaultValue(property);
    }
    private getDefaultValue(property: string): Object {
        let propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
        let docCharacterFormat: WCharacterFormat = this.documentCharacterFormat();
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(docCharacterFormat) && !isNullOrUndefined(docCharacterFormat.uniqueCharacterFormat) && docCharacterFormat.uniqueCharacterFormat.propertiesHash.containsKey(propertyType)) {
            return docCharacterFormat.uniqueCharacterFormat.propertiesHash.get(propertyType);
        } else {
            return WCharacterFormat.getPropertyDefaultValue(property);
        }
    }
    private documentCharacterFormat(): WCharacterFormat {
        let docCharacterFormat: WCharacterFormat;
        if (!isNullOrUndefined(this.ownerBase)) {
            if (!isNullOrUndefined((this.ownerBase as TextElementBox).paragraph)) {
                docCharacterFormat = (this.ownerBase as TextElementBox).paragraph.bodyWidget.page.viewer.characterFormat;
            } else {
                if (!isNullOrUndefined((this.ownerBase as ParagraphWidget).bodyWidget)) {
                    docCharacterFormat = (this.ownerBase as ParagraphWidget).bodyWidget.page.viewer.characterFormat;
                }
            }
        }
        return docCharacterFormat;
    }
    private checkBaseStyle(property: string): Object {
        /* tslint:disable-next-line:no-any */
        let baseStyle: any;
        if (!isNullOrUndefined(this.ownerBase)) {
            if (!isNullOrUndefined((this.ownerBase as TextElementBox).paragraph)) {
                baseStyle = (this.ownerBase as TextElementBox).paragraph.paragraphFormat.baseStyle;
            } else {
                // tslint:disable-next-line:max-line-length
                if ((this.ownerBase instanceof ParagraphWidget) && !isNullOrUndefined((this.ownerBase as ParagraphWidget).paragraphFormat)) {
                    baseStyle = (this.ownerBase as ParagraphWidget).paragraphFormat.baseStyle;
                } else {
                    if (!isNullOrUndefined(this.ownerBase instanceof WParagraphStyle)) {
                        baseStyle = (this.ownerBase as WStyle).basedOn;
                    }
                }

            }
        }
        while (!isNullOrUndefined(baseStyle)) {
            if (baseStyle.characterFormat.hasValue(property)) {
                break;
            } else {
                baseStyle = baseStyle.basedOn;
            }
        }
        if (!isNullOrUndefined(baseStyle)) {
            let propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
            return baseStyle.characterFormat.uniqueCharacterFormat.propertiesHash.get(propertyType);
        }
        return undefined;
    }
    private checkCharacterStyle(property: string): Object {
        /* tslint:disable-next-line:no-any */
        let baseStyle: any = this.baseCharStyle;
        if (!isNullOrUndefined(baseStyle)) {
            while (!isNullOrUndefined(baseStyle) && baseStyle.name !== 'Default Paragraph Font') {
                let hasKey: boolean = baseStyle.characterFormat.hasValue(property);
                if (hasKey) {
                    let returnPropertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
                    return baseStyle.characterFormat.uniqueCharacterFormat.propertiesHash.get(returnPropertyType);
                } else {
                    baseStyle = baseStyle.basedOn;
                }
            }
        }
        return undefined;
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WCharacterFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueCharacterFormat)) {
            this.initializeUniqueCharacterFormat(property, value);
        } else {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCharacterFormat.uniqueFormatType, property);
            if (this.uniqueCharacterFormat.propertiesHash.containsKey(propertyType) &&
                // tslint:disable-next-line:max-line-length
                this.uniqueCharacterFormat.propertiesHash.get(propertyType) === value) {  //Do nothing, since no change in property value and return
                return;
            }
            // tslint:disable-next-line:max-line-length
            this.uniqueCharacterFormat = WCharacterFormat.uniqueCharacterFormats.updateUniqueFormat(this.uniqueCharacterFormat, property, value);
        }
    }
    private initializeUniqueCharacterFormat(property: string, propValue: object): void {
        let uniqueCharFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueCharacterFormat('fontColor', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontFamily', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontSize', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('bold', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('italic', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('underline', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('strikethrough', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('baselineAlignment', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('highlightColor', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('styleName', property, propValue, uniqueCharFormatTemp);
        // tslint:disable-next-line:max-line-length
        this.uniqueCharacterFormat = WCharacterFormat.uniqueCharacterFormats.addUniqueFormat(uniqueCharFormatTemp, WCharacterFormat.uniqueFormatType);
    }
    // tslint:disable-next-line:max-line-length
    private addUniqueCharacterFormat(property: string, modifiedProperty: string, propValue: object, uniqueCharFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueCharFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
            case 'bold':
                value = false;
                break;
            case 'italic':
                value = false;
                break;
            case 'fontSize':
                value = 11;
                break;
            case 'underline':
                value = 'None';
                break;
            case 'strikethrough':
                value = 'None';
                break;
            case 'baselineAlignment':
                value = 'Normal';
                break;
            case 'highlightColor':
                value = 'NoColor';
                break;
            case 'fontColor':
                value = '#000000';
                break;
            case 'fontFamily':
                value = 'Calibri';
                break;
            case 'styleName':
                value = 'Default Paragraph Font';
                break;
        }
        return value;
    }
    public isEqualFormat(format: WCharacterFormat): boolean {
        return (this.fontSize === format.fontSize
            && this.fontFamily === format.fontFamily
            && this.bold === format.bold
            && this.italic === format.italic
            && this.baselineAlignment === format.baselineAlignment
            && this.underline === format.underline
            && this.fontColor === format.fontColor
            && this.strikethrough === format.strikethrough
            && this.highlightColor === format.highlightColor);
    }
    public isSameFormat(format: WCharacterFormat): boolean {
        return this.baseCharStyle === format.baseCharStyle &&
            this.uniqueCharacterFormat === format.uniqueCharacterFormat;
    }
    public cloneFormat(): WCharacterFormat {
        let format: WCharacterFormat = new WCharacterFormat(undefined);
        format.uniqueCharacterFormat = this.uniqueCharacterFormat;
        format.baseCharStyle = this.baseCharStyle;
        return format;
    }
    private hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueCharacterFormat) && !isNullOrUndefined(this.uniqueCharacterFormat.propertiesHash)) {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCharacterFormat.uniqueFormatType, property);
            return this.uniqueCharacterFormat.propertiesHash.containsKey(propertyType);
        }
        return false;

    }
    public clearFormat(): void {
        if (!isNullOrUndefined(this.uniqueCharacterFormat) && this.uniqueCharacterFormat.referenceCount === 0) {
            WCharacterFormat.uniqueCharacterFormats.remove(this.uniqueCharacterFormat);
        }
        this.uniqueCharacterFormat = undefined;
        this.baseCharStyle = undefined;
    }
    public destroy(): void {
        this.clearFormat();
    }
    public copyFormat(format: WCharacterFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueCharacterFormat) && format.uniqueCharacterFormat.propertiesHash) {
                this.updateUniqueCharacterFormat(format);
            }
            if (!isNullOrUndefined(format.baseCharStyle)) {
                this.baseCharStyle = format.baseCharStyle;
            }
        }
    }

    public updateUniqueCharacterFormat(format: WCharacterFormat): void {
        let hash: Dictionary<number, object> = undefined;
        if (this.uniqueCharacterFormat) {
            hash = this.uniqueCharacterFormat.mergeProperties(format.uniqueCharacterFormat);
            if (this.uniqueCharacterFormat.referenceCount === 0) {
                WCharacterFormat.uniqueCharacterFormats.remove(this.uniqueCharacterFormat);
                this.uniqueCharacterFormat = undefined;
            }
        }
        this.uniqueCharacterFormat = new WUniqueFormat(WCharacterFormat.uniqueFormatType);
        if (isNullOrUndefined(hash)) {
            hash = this.uniqueCharacterFormat.mergeProperties(format.uniqueCharacterFormat);
        }
        this.uniqueCharacterFormat = WCharacterFormat.uniqueCharacterFormats.addUniqueFormat(hash, WCharacterFormat.uniqueFormatType);
    }
    public static clear(): void {
        this.uniqueCharacterFormats.clear();
    }
    public ApplyStyle(baseCharStyle: WStyle): void {
        this.baseCharStyle = baseCharStyle;
    }
    /**
     * For internal use
     * @private
     */
    public getValue(property: string): Object {
        return this.hasValue(property) ? this.getPropertyValue(property) : undefined;
    }
    /**
     * For internal use
     * @private
     */
    public mergeFormat(format: WCharacterFormat): void {
        if (isNullOrUndefined(this.getValue('bold'))) {
            this.bold = format.getValue('bold') as boolean;
        }
        if (isNullOrUndefined(this.getValue('italic'))) {
            this.italic = format.getValue('italic') as boolean;
        }
        if (isNullOrUndefined(this.getValue('fontSize'))) {
            this.fontSize = format.getValue('fontSize') as number;
        }
        if (isNullOrUndefined(this.getValue('fontFamily'))) {
            this.fontFamily = format.getValue('fontFamily') as string;
        }
        if (isNullOrUndefined(this.getValue('underline'))) {
            this.underline = format.getValue('underline') as Underline;
        }
        if (isNullOrUndefined(this.getValue('strikethrough'))) {
            this.strikethrough = format.getValue('strikethrough') as Strikethrough;
        }
        if (isNullOrUndefined(this.getValue('baselineAlignment'))) {
            this.baselineAlignment = format.getValue('baselineAlignment') as BaselineAlignment;
        }
        if (isNullOrUndefined(this.getValue('highlightColor'))) {
            this.highlightColor = format.getValue('highlightColor') as HighlightColor;
        }
        if (isNullOrUndefined(this.getValue('fontColor'))) {
            this.fontColor = format.getValue('fontColor') as string;
        }
    }
}