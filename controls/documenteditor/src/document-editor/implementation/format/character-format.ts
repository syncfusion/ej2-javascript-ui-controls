import { TextElementBox, ParagraphWidget, LineWidget, BlockContainer, ElementBox } from '../viewer/page';
import { Dictionary } from '../../base/dictionary';
import { Underline, HighlightColor, BaselineAlignment, Strikethrough, BiDirectionalOverride, FontScriptType, FontHintType } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WStyle, WParagraphStyle, WCharacterStyle } from './style';
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
    private revisions: Revision[] = [];
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
    public get characterSpacing(): number {
        return this.getPropertyValue('characterSpacing') as number;
    }
    public set characterSpacing(value: number) {
        this.setPropertyValue('characterSpacing', value);
    }
    public get scaling(): number {
        return this.getPropertyValue('scaling') as number;
    }
    public set scaling(value: number) {
        this.setPropertyValue('scaling', value);
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
    public get underlineColor(): string {
        return this.getPropertyValue('underlineColor') as string;
    }
    public set underlineColor(value: string) {
        this.setPropertyValue('underlineColor', value);
    }
    public get fontHintType(): FontHintType {
        return this.getPropertyValue('fontHintType') as FontHintType;
    }
    public set fontHintType(value: FontHintType) {
        this.setPropertyValue('fontHintType', value);
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

    public get localeIdBidi(): number {
        return this.getPropertyValue('localeIdBidi') as number;
    }

    public set localeIdBidi(value: number) {
        this.setPropertyValue('localeIdBidi', value);
    }
    public get localeIdFarEast(): number {
        return this.getPropertyValue('localeIdFarEast') as number;
    }

    public set localeIdFarEast(value: number) {
        this.setPropertyValue('localeIdFarEast', value);
    }
    public get localeIdAscii(): number {
        return this.getPropertyValue('localeIdAscii') as number;
    }

    public set localeIdAscii(value: number) {
        this.setPropertyValue('localeIdAscii', value);
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
    public get Lowercase(): boolean {
        return this.getPropertyValue('Lowercase') as boolean;
    }
    public set Lowercase(value: boolean) {
        this.setPropertyValue('Lowercase', value);
    }
    public get Uppercase(): boolean {
        return this.getPropertyValue('Uppercase') as boolean;
    }
    public set Uppercase(value: boolean) {
        this.setPropertyValue('Uppercase', value);
    }
    public get SentenceCase(): boolean {
        return this.getPropertyValue('SentenceCase') as boolean;
    }
    public set SentenceCase(value: boolean) {
        this.setPropertyValue('SentenceCase', value);
    }
    public get ToggleCase(): boolean {
        return this.getPropertyValue('ToggleCase') as boolean;
    }
    public set ToggleCase(value: boolean) {
        this.setPropertyValue('ToggleCase', value);
    }
    public get CapitalizeEachWord(): boolean {
        return this.getPropertyValue('CapitalizeEachWord') as boolean;
    }
    public set CapitalizeEachWord(value: boolean) {
        this.setPropertyValue('CapitalizeEachWord', value);
    }
    public get complexScript(): boolean {
        return this.getPropertyValue('complexScript') as boolean;
    }
    public set complexScript(value: boolean) {
        this.setPropertyValue('complexScript', value);
    }
    public get hidden(): boolean {
        return this.getPropertyValue('hidden') as boolean;
    }
    public set hidden(value: boolean) {
        this.setPropertyValue('hidden', value);
    }
    public get fontFamilyFarEast(): string {
        return this.getPropertyValue('fontFamilyFarEast') as string;
    }
    public set fontFamilyFarEast(value: string) {
        this.setPropertyValue('fontFamilyFarEast', value);
    }
    public get fontFamilyAscii(): string {
        return this.getPropertyValue('fontFamilyAscii') as string;
    }
    public set fontFamilyAscii(value: string) {
        this.setPropertyValue('fontFamilyAscii', value);
    }
    public get fontFamilyNonFarEast(): string {
        return this.getPropertyValue('fontFamilyNonFarEast') as string;
    }
    public set fontFamilyNonFarEast(value: string) {
        this.setPropertyValue('fontFamilyNonFarEast', value);
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
                    let paragraph: any = undefined;
                    let line: LineWidget = undefined;
                    if (!isNullOrUndefined(this.ownerBase)) {
                        paragraph = (this.ownerBase as TextElementBox).paragraph;
                        line = (this.ownerBase as TextElementBox).line;
                    }
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
        if (isNullOrUndefined(this.ownerBase)) {
            return undefined;
        }
        let paragraph: ParagraphWidget;
        if (this.ownerBase instanceof ElementBox) {
            paragraph = this.ownerBase.paragraph;
        } else if (this.ownerBase instanceof ParagraphWidget) {
            paragraph = this.ownerBase;
        }
        if (paragraph) {
            let bodyWidget: BlockContainer = paragraph.bodyWidget;
            if (bodyWidget && bodyWidget.page && bodyWidget.page.documentHelper) {
                return bodyWidget.page.documentHelper.characterFormat;
            }
        }
        return undefined;
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
            } else if (!isNullOrUndefined(baseStyle.link) && isNullOrUndefined(baseStyle.basedOn) && baseStyle.link.type == 'Character' && baseStyle.link.characterFormat.hasValue(property) && baseStyle.name != "Normal") {
                baseStyle = baseStyle.link;
                break;
            }
            else {
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
                    if (property === 'bold' && !isNullOrUndefined(this.ownerBase) && this.ownerBase instanceof TextElementBox && !isNullOrUndefined(this.ownerBase.paragraph) &&
                        !isNullOrUndefined(this.ownerBase.paragraph.paragraphFormat.baseStyle) && this.ownerBase.paragraph.paragraphFormat.baseStyle instanceof WParagraphStyle &&
                        this.ownerBase.paragraph.paragraphFormat.baseStyle.characterFormat && baseStyle.name !== this.ownerBase.paragraph.paragraphFormat.baseStyle.name &&
                        baseStyle.characterFormat.hasValue(property) === this.ownerBase.paragraph.paragraphFormat.baseStyle.characterFormat.hasValue(property)) {
                        return this.hasValue(property);
                    }
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
        if (isNullOrUndefined(this.uniqueCharacterFormat) 
            || (isNullOrUndefined(this.uniqueCharacterFormat.propertiesHash) 
            && isNullOrUndefined(this.uniqueCharacterFormat.uniqueFormatType) 
            && isNullOrUndefined(this.uniqueCharacterFormat.referenceCount))) {
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
        this.addUniqueCharacterFormat('underlineColor', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontHintType', property, propValue, uniqueCharFormatTemp);
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
        this.addUniqueCharacterFormat('Uppercase', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('Lowercase', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('SentenceCase', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('ToggleCase', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('CapitalizeEachWord', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('localeIdAscii', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('localeIdFarEast', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('localeIdBidi', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontFamilyFarEast', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontFamilyAscii', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('fontFamilyNonFarEast', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('complexScript', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('characterSpacing', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('scaling', property, propValue, uniqueCharFormatTemp);
        this.addUniqueCharacterFormat('hidden', property, propValue, uniqueCharFormatTemp);
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
        case 'underlineColor':
            value = undefined;
            break;
        case 'fontHintType':
            value = 'Default';
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
        case 'Uppercase':
        case 'Lowercase':  
        case 'CapitalizeEachWord':
        case 'SentenceCase':
        case 'ToggleCase': 
            value = false;
            break;
        case 'localeIdAscii':
        case 'localeIdFarEast':
        case 'localeIdBidi':
            value = 0;
            break;
        case 'complexScript':
            value = false;
            break;
        case 'hidden':
            value = false;
            break;
        case 'fontFamilyFarEast':
        case 'fontFamilyAscii':
        case 'fontFamilyNonFarEast':
            value = undefined;
            break;
        case 'characterSpacing':
            value = 0;
            break;
        case 'scaling':
            value = 100;
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
            && this.bdo === format.bdo
            && this.allCaps === format.allCaps
            && this.Uppercase === format.Uppercase
            && this.Lowercase === format.Lowercase
            && this.ToggleCase === format.ToggleCase
            && this.SentenceCase === format.SentenceCase
            && this.CapitalizeEachWord === format.CapitalizeEachWord
            && this.localeIdBidi === format.localeIdBidi
            && this.localeIdAscii === format.localeIdAscii
            && this.localeIdFarEast === format.localeIdFarEast
            && this.complexScript === format.complexScript
            && this.fontFamilyAscii === format.fontFamilyAscii
            && this.fontFamilyBidi === format.fontFamilyBidi
            && this.fontFamilyFarEast === format.fontFamilyFarEast
            && this.characterSpacing === format.characterSpacing
            && this.scaling === format.scaling
            && this.fontFamilyNonFarEast === format.fontFamilyNonFarEast
            && this.hidden === format.hidden);
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
        if (!isNullOrUndefined(this.uniqueCharacterFormat)) {
            WCharacterFormat.uniqueCharacterFormats.remove(this.uniqueCharacterFormat);
        }
        this.uniqueCharacterFormat = undefined;
        this.baseCharStyle = undefined;
        this.ownerBase = undefined;
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

    public isEqualTocFormat(format: WCharacterFormat): boolean {
        return (this.fontFamily === format.fontFamily
            && this.bold === format.bold
            && this.italic === format.italic
            && this.strikethrough === format.strikethrough
            && this.highlightColor === format.highlightColor
            && this.fontFamilyAscii === format.fontFamilyAscii
            && this.fontFamilyFarEast === format.fontFamilyFarEast
            && this.fontFamilyNonFarEast === format.fontFamilyNonFarEast);
    }
    public copyTocFormat(format: WCharacterFormat): void {
        if (!isNullOrUndefined(format.bold)) {
            this.bold = format.bold;
        }
        if (!isNullOrUndefined(format.italic)) {
            this.italic = format.italic;
        }
        if (!isNullOrUndefined(format.strikethrough)) {
            this.strikethrough = format.strikethrough;
        }
        if (!isNullOrUndefined(format.highlightColor)) {
            this.highlightColor = format.highlightColor;
        }
        if (!isNullOrUndefined(format.fontFamily)) {
            this.fontFamily = format.fontFamily;
            this.fontFamilyAscii = format.fontFamily;
            this.fontFamilyFarEast = format.fontFamily;
            this.fontFamilyNonFarEast = format.fontFamily;
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
        if (isNullOrUndefined(this.getValue('boldBidi'))) {
            this.boldBidi = format.getValue('boldBidi') as boolean;
        }
        if (isNullOrUndefined(this.getValue('italicBidi'))) {
            this.italicBidi = format.getValue('italicBidi') as boolean;
        }
        if (isNullOrUndefined(this.getValue('fontSizeBidi'))) {
            this.fontSizeBidi = format.getValue('fontSizeBidi') as number;
        }
        if (isNullOrUndefined(this.getValue('characterSpacing'))) {
            this.characterSpacing = format.getValue('characterSpacing') as number;
        }
        if (isNullOrUndefined(this.getValue('scaling'))) {
            this.scaling = format.getValue('scaling') as number;
        }
        if (isNullOrUndefined(this.getValue('fontFamily'))) {
            this.fontFamily = format.getValue('fontFamily') as string;
        } else {
            if (isNullOrUndefined(this.getValue('fontFamilyAscii'))) {
                this.fontFamilyAscii = format.getValue('fontFamily') as string;
            }
            if (isNullOrUndefined(this.getValue('fontFamilyFarEast'))) {
                this.fontFamilyFarEast = format.getValue('fontFamily') as string;
            }
            if (isNullOrUndefined(this.getValue('fontFamilyNonFarEast'))) {
                this.fontFamilyNonFarEast = format.getValue('fontFamily') as string;
            }
        }
        if (isNullOrUndefined(this.getValue('underline'))) {
            this.underline = format.getValue('underline') as Underline;
        }
        if (isNullOrUndefined(this.getValue('fontHintType'))) {
            this.fontHintType = format.getValue('fontHintType') as FontHintType;
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
        if (isNullOrUndefined(this.getValue('Lowercase'))) {
            this.Lowercase = format.getValue('Lowercase') as boolean;
        }
        if (isNullOrUndefined(this.getValue('SentenceCase'))) {
            this.SentenceCase = format.getValue('SentenceCase')as boolean;
        }
        if (isNullOrUndefined(this.getValue('ToggleCase'))) {
            this.ToggleCase = format.getValue('ToggleCase')as boolean;
        }
        if (isNullOrUndefined(this.getValue('CapitalizeEachWord'))) {
            this.CapitalizeEachWord = format.getValue('CapitalizeEachWord')as boolean;
        }
        if (isNullOrUndefined(this.getValue('Uppercase'))) {
            this.Uppercase = format.getValue('Uppercase')as boolean;
        }
        if (isNullOrUndefined(this.getValue('localeIdBidi'))) {
            this.localeIdBidi = format.getValue('localeIdBidi') as number;
        }
        if (isNullOrUndefined(this.getValue('localeIdAscii'))) {
            this.localeIdAscii = format.getValue('localeIdAscii') as number;
        }
        if (isNullOrUndefined(this.getValue('localeIdFarEast'))) {
            this.localeIdFarEast = format.getValue('localeIdFarEast') as number;
        }
        if (isNullOrUndefined(this.getValue('complexScript'))) {
            this.complexScript = format.getValue('complexScript') as boolean;
        }
        if (isNullOrUndefined(this.getValue('fontFamilyAscii'))) {
            this.fontFamilyAscii = format.getValue('fontFamilyAscii') as string;
        }
        if (isNullOrUndefined(this.getValue('fontFamilyBidi'))) {
            this.fontFamilyBidi = format.getValue('fontFamilyBidi') as string;
        }
        if (isNullOrUndefined(this.getValue('fontFamilyFarEast'))) {
            this.fontFamilyFarEast = format.getValue('fontFamilyFarEast') as string;
        }
        if (isNullOrUndefined(this.getValue('fontFamilyNonFarEast'))) {
            this.fontFamilyNonFarEast = format.getValue('fontFamilyNonFarEast') as string;
        }
    }
    /**
     * Assinging the value for style dialog
     * @private
     * @returns {void}
     */
    public assignFormat(format: WCharacterFormat): void {
        if (format.hasValue('bold')) {
            this.bold = format.getValue('bold') as boolean;
        }
        if (format.hasValue('italic')) {
            this.italic = format.getValue('italic') as boolean;
        }
        if (format.hasValue('fontSize')) {
            this.fontSize = format.getValue('fontSize') as number;
        }
        if (format.hasValue('characterSpacing')) {
            this.characterSpacing = format.getValue('characterSpacing') as number;
        }
        if (format.hasValue('scaling')) {
            this.scaling = format.getValue('scaling') as number;
        }
        if (format.hasValue('fontFamily')) {
            this.fontFamily = format.getValue('fontFamily') as string;
            this.fontFamilyFarEast = format.getValue('fontFamily') as string;
            this.fontFamilyAscii = format.getValue('fontFamily') as string;
            this.fontFamilyNonFarEast = format.getValue('fontFamily') as string;
            this.fontFamilyBidi = format.getValue('fontFamily') as string;
        }
        if (format.hasValue('underline')) {
            this.underline = format.getValue('underline') as Underline;
        }
        if (format.hasValue('fontHintType')) {
            this.fontHintType = format.getValue('fontHintType') as FontHintType;
        }
        if (format.hasValue('strikethrough')) {
            this.strikethrough = format.getValue('strikethrough') as Strikethrough;
        }
        if (format.hasValue('baselineAlignment')) {
            this.baselineAlignment = format.getValue('baselineAlignment') as BaselineAlignment;
        }
        if (format.hasValue('highlightColor')) {
            this.highlightColor = format.getValue('highlightColor') as HighlightColor;
        }
        if (format.hasValue('fontColor')) {
            this.fontColor = format.getValue('fontColor') as string;
        }
        if (format.hasValue('bidi')) {
            this.bidi = format.getValue('bidi') as boolean;
        }
        if (format.hasValue('bdo')) {
            this.bdo = format.getValue('bdo') as BiDirectionalOverride;
        }
        if (format.hasValue('allCaps')) {
            this.allCaps = format.getValue('allCaps') as boolean;
        }
        if (format.hasValue('Lowercase')) {
            this.Lowercase = format.getValue('Lowercase') as boolean;
        }
        if (format.hasValue('SentenceCase')) {
            this.SentenceCase = format.getValue('SentenceCase') as boolean;
        }
        if (format.hasValue('ToggleCase')) {
            this.ToggleCase = format.getValue('ToggleCase') as boolean;
        }
        if (format.hasValue('CapitalizeEachWord')) {
            this.CapitalizeEachWord = format.getValue('CapitalizeEachWord') as boolean;
        }
        if (format.hasValue('Uppercase')) {
            this.Uppercase = format.getValue('Uppercase') as boolean;
        }
        if (format.hasValue('localeIdBidi')) {
            this.localeIdBidi = format.getValue('localeIdBidi') as number;
        }
        if (format.hasValue('localeIdAscii')) {
            this.localeIdAscii = format.getValue('localeIdAscii') as number;
        }
        if (format.hasValue('localeIdFarEast')) {
            this.localeIdFarEast = format.getValue('localeIdFarEast') as number;
        }
        if (format.hasValue('complexScript')) {
            this.complexScript = format.getValue('complexScript') as boolean;
        }
    }

    public hasValueWithParent(property: string): boolean {
        // 2.1 Define direct VALUE
        let hasValue: boolean = this.hasValue(property);
        // 2.2 If SELF VALUE is NULL get BASE VALUE
        // if (!hasValue && this.BaseFormat != null && this.BaseFormat is WCharacterFormat)
        //     hasValue = (this.BaseFormat as WCharacterFormat).HasValueWithParent(propertyKey);
        // 2.3 If VALUE not in hash, get CharStyle VALUE
        if (!hasValue && !isNullOrUndefined(this.baseCharStyle) && this.baseCharStyle instanceof WCharacterStyle) {
            hasValue = (this.baseCharStyle as WCharacterStyle).characterFormat.hasValue(property);
        }
        // 3. If VALUE is NULL get DEFAULT VALUE
        let defFormat: WCharacterFormat = this.documentCharacterFormat();
        if (!hasValue && !isNullOrUndefined(defFormat)) {
            hasValue = defFormat.hasValue(property);
        }
        return hasValue;
    }

    /**
     * @private
     */
    get revisionLength(): number {
        if (!isNullOrUndefined(this.revisions)) {
            return this.revisions.length;
        }
        return 0;
    }
    /**
     * @private
     */
    public getRevision(index: number): Revision {
        if (!isNullOrUndefined(this.revisions)) {
            return this.revisions[index];
        }
        return undefined;
    }
    /**
     * @private
     */
    public addRevision(revision: Revision): void {
        if (this.revisions.indexOf(revision) === -1) {
            this.revisions.push(revision);
        }
        revision.hasChanges = true;
    }
    /**
     * @private
     */
    public insertRevisionAt(index: number, revision: Revision): void {
        this.revisions.splice(index, 0, revision)
        revision.hasChanges = true;
    }
    /**
     * @private
     */
    public removeRevision(index: number): Revision {
        let revision: Revision = this.revisions.splice(index, 1)[0];
        revision.hasChanges = true;
        return revision;
    }

    /**
     * @private
     */
    public getAllRevision(): Revision[] {
        return this.revisions;
    }

    /**
     * @private
     */
    public clearRevision(): void {
        this.revisions = [];
    }

    /**
     * @private
     */
    public getRevisionRange(revision: Revision): WCharacterFormat[] {
        let range: WCharacterFormat[] = [];
        if (this.revisions.indexOf(revision) !== -1) {
            range.push(this)
        }
        return range;
    }
    
}
