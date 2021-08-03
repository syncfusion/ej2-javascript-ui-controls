import { TextElementBox, ParagraphWidget, LineWidget } from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { Underline, HighlightColor, BaselineAlignment, Strikethrough, BiDirectionalOverride } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WStyle, WParagraphStyle } from './style';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Revision } from '../track-changes/track-changes';
/* eslint-disable */
/**
 * @private
 */
export class WCharacterFormat {
    public uniqueCharacterFormat: WUniqueFormat = undefined;
    private static uniqueCharacterFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 2;
    public ownerBase: Object = undefined;
    public baseCharStyle: WStyle = undefined;
    /**
     * @private
     */
    public removedIds: string[] = [];
    /**
     * @private
     */
    public revisions: Revision[] = [];
    public get bold(): boolean {
        return this.getPropertyValue('bold') as boolean;
    }
    public set bold(value: boolean) {
        this.setPropertyValue('bold', value);
    }
    public get italic(): boolean {
        return this.getPropertyValue('italic') as boolean;
    }
    public set italic(value: boolean) {
        this.setPropertyValue('italic', value);
    }
    public get fontSize(): number {
        return this.getPropertyValue('fontSize') as number;
    }
    public set fontSize(value: number) {
        this.setPropertyValue('fontSize', value);
    }
    public get fontFamily(): string {
        return this.getPropertyValue('fontFamily') as string;
    }
    public set fontFamily(value: string) {
        this.setPropertyValue('fontFamily', value);
    }
    public get underline(): Underline {
        return this.getPropertyValue('underline') as Underline;
    }
    public set underline(value: Underline) {
        this.setPropertyValue('underline', value);
    }
    public get strikethrough(): Strikethrough {
        return this.getPropertyValue('strikethrough') as Strikethrough;
    }
    public set strikethrough(value: Strikethrough) {
        this.setPropertyValue('strikethrough', value);
    }
    public get baselineAlignment(): BaselineAlignment {
        return this.getPropertyValue('baselineAlignment') as BaselineAlignment;
    }
    public set baselineAlignment(value: BaselineAlignment) {
        this.setPropertyValue('baselineAlignment', value);
    }
    public get highlightColor(): HighlightColor {
        return this.getPropertyValue('highlightColor') as HighlightColor;
    }
    public set highlightColor(value: HighlightColor) {
        this.setPropertyValue('highlightColor', value);
    }
    public get fontColor(): string {
        return this.getPropertyValue('fontColor') as string;
    }
    public set fontColor(value: string) {
        this.setPropertyValue('fontColor', value);
    }

    public get bidi(): boolean {
        return this.getPropertyValue('bidi') as boolean;
    }

    public set bidi(value: boolean) {
        this.setPropertyValue('bidi', value);
    }

    public get bdo(): BiDirectionalOverride {
        return this.getPropertyValue('bdo') as BiDirectionalOverride;
    }

    public set bdo(value: BiDirectionalOverride) {
        this.setPropertyValue('bdo', value);
    }

    public get boldBidi(): boolean {
        return this.getPropertyValue('boldBidi') as boolean;
    }
    public set boldBidi(value: boolean) {
        this.setPropertyValue('boldBidi', value);
    }
    public get italicBidi(): boolean {
        return this.getPropertyValue('italicBidi') as boolean;
    }
    public set italicBidi(value: boolean) {
        this.setPropertyValue('italicBidi', value);
    }
    public get fontSizeBidi(): number {
        return this.getPropertyValue('fontSizeBidi') as number;
    }
    public set fontSizeBidi(value: number) {
        this.setPropertyValue('fontSizeBidi', value);
    }
    public get fontFamilyBidi(): string {
        return this.getPropertyValue('fontFamilyBidi') as string;
    }
    public set fontFamilyBidi(value: string) {
        this.setPropertyValue('fontFamilyBidi', value);
    }
    public get allCaps(): boolean {
        return this.getPropertyValue('allCaps') as boolean;
    }
    public set allCaps(value: boolean) {
        this.setPropertyValue('allCaps', value);
    }

    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    public getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            const charStyleValue: Object = this.checkCharacterStyle(property);
            if (!isNullOrUndefined(charStyleValue)) {
                return charStyleValue;
            } else {
                if (!isNullOrUndefined(this.baseCharStyle)) {
                    const paragraph: any = (this.ownerBase as TextElementBox).paragraph;
                    const line: LineWidget = (this.ownerBase as TextElementBox).line;
                    if (!isNullOrUndefined(paragraph) && !isNullOrUndefined(line)) {
                        const length: number = line.children.length;
                        for (let i: number = 0; i < length; i++) {
                            const element: any = (this.ownerBase as any).line.children[i];
                            if (element instanceof TextElementBox) {
                                const text: any = element.text;
                                if (text.startsWith('HYPERLINK')) {
                                    const index: number = text.indexOf('_Toc');
                                    if (index !== -1) {
                                        this.baseCharStyle = (this.ownerBase as TextElementBox).paragraph.paragraphFormat.baseStyle;
                                    }
                                }
                            }
                        }
                    }
                }
                const baseStyleValue: Object = this.checkBaseStyle(property);
                if (!isNullOrUndefined(baseStyleValue)) {
                    return baseStyleValue;
                }
            }
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueCharacterFormat) && this.uniqueCharacterFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueCharacterFormat.propertiesHash.get(propertyType);
            }
        }
        return this.getDefaultValue(property);
    }
    private getDefaultValue(property: string): Object {
        const propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
        const docCharacterFormat: WCharacterFormat = this.documentCharacterFormat();
        if (!isNullOrUndefined(docCharacterFormat) && !isNullOrUndefined(docCharacterFormat.uniqueCharacterFormat) && docCharacterFormat.uniqueCharacterFormat.propertiesHash.containsKey(propertyType)) {
            return docCharacterFormat.uniqueCharacterFormat.propertiesHash.get(propertyType);
        } else {
            return WCharacterFormat.getPropertyDefaultValue(property);
        }
    }
    private documentCharacterFormat(): WCharacterFormat {
        let docCharacterFormat: WCharacterFormat;
        if (!isNullOrUndefined(this.ownerBase)) {
            if (!isNullOrUndefined((this.ownerBase as TextElementBox).paragraph) && !isNullOrUndefined((this.ownerBase as TextElementBox).paragraph.bodyWidget)) {
                docCharacterFormat = (this.ownerBase as TextElementBox).paragraph.bodyWidget.page.documentHelper.characterFormat;
            } else {
                if (!isNullOrUndefined((this.ownerBase as ParagraphWidget).bodyWidget)) {
                    docCharacterFormat = (this.ownerBase as ParagraphWidget).bodyWidget.page.documentHelper.characterFormat;
                }
            }
        }
        return docCharacterFormat;
    }
    private checkBaseStyle(property: string): Object {
        let baseStyle: any;
        if (!isNullOrUndefined(this.ownerBase)) {
            if (!isNullOrUndefined((this.ownerBase as TextElementBox).paragraph)) {
                baseStyle = (this.ownerBase as TextElementBox).paragraph.paragraphFormat.baseStyle;
            } else {

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
            const propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
            return baseStyle.characterFormat.uniqueCharacterFormat.propertiesHash.get(propertyType);
        }
        return undefined;
    }
    private checkCharacterStyle(property: string): Object {
        let baseStyle: any = this.baseCharStyle;
        if (!isNullOrUndefined(baseStyle)) {
            while (!isNullOrUndefined(baseStyle) && baseStyle.name !== 'Default Paragraph Font') {
                const hasKey: boolean = baseStyle.characterFormat.hasValue(property);
                if (hasKey) {
                    const returnPropertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
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
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCharacterFormat.uniqueFormatType, property);
            if (this.uniqueCharacterFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueCharacterFormat.propertiesHash.get(propertyType) === value) {  //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueCharacterFormat = WCharacterFormat.uniqueCharacterFormats.updateUniqueFormat(this.uniqueCharacterFormat, property, value);
        }
    }
    private initializeUniqueCharacterFormat(property: string, propValue: object): void {
        const uniqueCharFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
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
        this.addUniqueCharacterFormat('bidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('bdo', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontFamilyBidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontSizeBidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('boldBidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('italicBidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('allCaps', property, propValue, uniqueCharFormatTemp);

        this.uniqueCharacterFormat = WCharacterFormat.uniqueCharacterFormats.addUniqueFormat(uniqueCharFormatTemp, WCharacterFormat.uniqueFormatType);
    }

    private addUniqueCharacterFormat(property: string, modifiedProperty: string, propValue: object, uniqueCharFormatTemp: Dictionary<number, object>): void {
        let propertyType: number = WUniqueFormat.getPropertyType(WCharacterFormat.uniqueFormatType, property);
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
            value = '#00000000';
            break;
        case 'fontFamily':
            value = 'Calibri';
            break;
        case 'styleName':
            value = 'Default Paragraph Font';
            break;
        case 'bidi':
            value = false;
            break;
        case 'bdo':
            value = 'None';
            break;
        case 'boldBidi':
            value = false;
            break;
        case 'italicBidi':
            value = false;
            break;
        case 'fontSizeBidi':
            value = 11;
            break;
        case 'fontFamilyBidi':
            value = 'Calibri';
            break;
        case 'allCaps':
            value = false;
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
            && this.highlightColor === format.highlightColor && this.bidi === format.bidi
            && this.bdo === format.bdo)
            && this.allCaps === format.allCaps;
    }
    public isSameFormat(format: WCharacterFormat): boolean {
        return this.baseCharStyle === format.baseCharStyle &&
            this.uniqueCharacterFormat === format.uniqueCharacterFormat;
    }
    public cloneFormat(): WCharacterFormat {
        const format: WCharacterFormat = new WCharacterFormat(undefined);
        format.uniqueCharacterFormat = this.uniqueCharacterFormat;
        format.baseCharStyle = this.baseCharStyle;
        if (this.revisions.length > 0) {
            format.removedIds = Revision.cloneRevisions(this.revisions);
        } else {
            format.removedIds = this.removedIds.slice();
        }
        return format;
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueCharacterFormat) && !isNullOrUndefined(this.uniqueCharacterFormat.propertiesHash)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCharacterFormat.uniqueFormatType, property);
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
            if (format.revisions.length > 0) {
                this.removedIds = Revision.cloneRevisions(format.revisions);
            } else {
                this.removedIds = format.removedIds.slice();
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
    public applyStyle(baseCharStyle: WStyle): void {
        this.baseCharStyle = baseCharStyle;
    }
    public getValue(property: string): Object {
        return this.hasValue(property) ? this.getPropertyValue(property) : undefined;
    }
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
        if (isNullOrUndefined(this.getValue('bidi'))) {
            this.bidi = format.getValue('bidi') as boolean;
        }
        if (isNullOrUndefined(this.getValue('bdo'))) {
            this.bdo = format.getValue('bdo') as BiDirectionalOverride;
        }
        if (isNullOrUndefined(this.getValue('allCaps'))) {
            this.allCaps = format.getValue('allCaps') as boolean;
        }
    }
}
