import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { LineSpacingType, TextAlignment, OutlineLevel, TabJustification, TabLeader } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WListFormat } from './list-format';
import { ParagraphWidget } from '../viewer/page';
import { WStyle, WParagraphStyle } from './style';
import { WListLevel } from '../list/list-level';

/** 
 * @private
 */
export class WTabStop {
    private positionIn: number;
    private deletePositionIn: number;
    private justification: TabJustification;
    private leader: TabLeader;

    get position(): number {
        return this.positionIn;
    }
    set position(value: number) {
        this.positionIn = value;
    }

    get deletePosition(): number {
        return this.deletePositionIn;
    }
    set deletePosition(value: number) {
        this.deletePositionIn = value;
    }

    get tabJustification(): TabJustification {
        return this.justification;
    }
    set tabJustification(value: TabJustification) {
        this.justification = value;
    }

    get tabLeader(): TabLeader {
        return this.leader;
    }
    set tabLeader(value: TabLeader) {
        this.leader = value;
    }

    public destroy(): void {
        this.position = undefined;
        this.deletePosition = undefined;
        this.tabJustification = undefined;
        this.leader = undefined;
    }

}
/** 
 * @private
 */
export class WParagraphFormat {
    public uniqueParagraphFormat: WUniqueFormat = undefined;
    private static uniqueParagraphFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 3;
    public listFormat: WListFormat;
    public ownerBase: Object = undefined;
    public baseStyle: WStyle = undefined;
    public tabs: WTabStop[] = undefined;
    public getUpdatedTabs(): WTabStop[] {
        let inTabs: WTabStop[] = [];
        if (!isNullOrUndefined(this.baseStyle)) {
            /* tslint:disable-next-line:no-any */
            let baseStyle: any = this.baseStyle;
            let tabStops: Dictionary<number, WTabStop> = new Dictionary<number, WTabStop>();
            while (!isNullOrUndefined(baseStyle)) {
                for (let tab of baseStyle.paragraphFormat.tabs) {
                    if (!tabStops.containsKey(tab.position)) {
                        tabStops.add(tab.position, tab);
                    }
                }
                baseStyle = baseStyle.basedOn;
            }
            for (let key of tabStops.keys) {
                if (!this.hasTabStop(key)) {
                    inTabs.push(tabStops.get(key));
                }
            }
            inTabs = inTabs.concat(this.tabs.filter((a: WTabStop) => (a.position !== 0 && a.deletePosition === 0)));
            inTabs = inTabs.sort((a: WTabStop, b: WTabStop) => a.position - b.position);
        }
        return inTabs;
    }
    private hasTabStop(position: number): boolean {
        for (let i: number = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].deletePosition === position) {
                return true;
            }
        }
        return false;
    }
    get leftIndent(): number {
        return this.getPropertyValue('leftIndent') as number;
    }
    set leftIndent(value: number) {
        this.setPropertyValue('leftIndent', value);
    }
    get rightIndent(): number {
        return this.getPropertyValue('rightIndent') as number;
    }
    set rightIndent(value: number) {
        this.setPropertyValue('rightIndent', value);
    }
    get firstLineIndent(): number {
        return this.getPropertyValue('firstLineIndent') as number;
    }
    set firstLineIndent(value: number) {
        this.setPropertyValue('firstLineIndent', value);
    }
    get beforeSpacing(): number {
        return this.getPropertyValue('beforeSpacing') as number;
    }
    set beforeSpacing(value: number) {
        this.setPropertyValue('beforeSpacing', value);
    }
    get afterSpacing(): number {
        return this.getPropertyValue('afterSpacing') as number;
    }
    set afterSpacing(value: number) {
        this.setPropertyValue('afterSpacing', value);
    }
    get lineSpacing(): number {
        return this.getPropertyValue('lineSpacing') as number;
    }
    set lineSpacing(value: number) {
        this.setPropertyValue('lineSpacing', value);
    }
    get lineSpacingType(): LineSpacingType {
        return this.getPropertyValue('lineSpacingType') as LineSpacingType;
    }
    set lineSpacingType(value: LineSpacingType) {
        this.setPropertyValue('lineSpacingType', value);
    }
    get textAlignment(): TextAlignment {
        return this.getPropertyValue('textAlignment') as TextAlignment;
    }
    set textAlignment(value: TextAlignment) {
        this.setPropertyValue('textAlignment', value);
    }
    get outlineLevel(): OutlineLevel {
        return this.getPropertyValue('outlineLevel') as OutlineLevel;
    }
    set outlineLevel(value: OutlineLevel) {
        this.setPropertyValue('outlineLevel', value);
    }
    constructor(node?: Object) {
        this.ownerBase = node;
        this.listFormat = new WListFormat(this);
        this.tabs = [];
    }
    private getListFormatParagraphFormat(property: string): object {
        if (this.listFormat.listId > -1 && this.listFormat.listLevelNumber > -1) {
            let level: WListLevel = this.listFormat.listLevel;
            let propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(level) && !isNullOrUndefined(level.paragraphFormat.uniqueParagraphFormat) && level.paragraphFormat.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)) {
                return level.paragraphFormat.uniqueParagraphFormat.propertiesHash.get(propertyType);
            } else {
                return undefined;
            }
        }
        return undefined;
    }

    public getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            let ifListFormat: object = this.getListFormatParagraphFormat(property);
            if (!isNullOrUndefined(ifListFormat)) {
                return ifListFormat;
            } else {
                if (this.baseStyle instanceof WParagraphStyle) {
                    /* tslint:disable-next-line:no-any */
                    let baseStyle: any = this.baseStyle;
                    while (!isNullOrUndefined(baseStyle)) {
                        if (baseStyle.paragraphFormat.hasValue(property)) {
                            break;
                        } else {
                            baseStyle = baseStyle.basedOn;
                        }
                    }
                    if (!isNullOrUndefined(baseStyle)) {
                        let propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
                        return baseStyle.paragraphFormat.uniqueParagraphFormat.propertiesHash.get(propertyType);
                    }
                }
            }
        } else {
            let propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueParagraphFormat) && this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueParagraphFormat.propertiesHash.get(propertyType);
            }
        }
        return this.getDefaultValue(property);
    }
    private getDefaultValue(property: string): Object {
        let propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
        let docParagraphFormat: WParagraphFormat = this.documentParagraphFormat();
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(docParagraphFormat) && !isNullOrUndefined(docParagraphFormat.uniqueParagraphFormat) && docParagraphFormat.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)) {
            return docParagraphFormat.uniqueParagraphFormat.propertiesHash.get(propertyType);
        } else {
            return WParagraphFormat.getPropertyDefaultValue(property);
        }
    }
    private documentParagraphFormat(): WParagraphFormat {
        let docParagraphFormat: WParagraphFormat;
        if (!isNullOrUndefined(this.ownerBase)) {
            if (!isNullOrUndefined((this.ownerBase as ParagraphWidget).bodyWidget)) {
                docParagraphFormat = (this.ownerBase as ParagraphWidget).bodyWidget.page.viewer.paragraphFormat;
            }
        }
        return docParagraphFormat;
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WParagraphFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueParagraphFormat)) {
            this.initializeUniqueParagraphFormat(property, value);
        } else {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueParagraphFormat.uniqueFormatType, property);
            if (this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueParagraphFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            // tslint:disable-next-line:max-line-length
            this.uniqueParagraphFormat = WParagraphFormat.uniqueParagraphFormats.updateUniqueFormat(this.uniqueParagraphFormat, property, value);
        }
    }
    private initializeUniqueParagraphFormat(property: string, propValue: Object): void {
        let uniqueParaFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueParaFormat('leftIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('rightIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('firstLineIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('textAlignment', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('beforeSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('afterSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('lineSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('lineSpacingType', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('outlineLevel', property, propValue, uniqueParaFormatTemp);
        // tslint:disable-next-line:max-line-length
        this.uniqueParagraphFormat = WParagraphFormat.uniqueParagraphFormats.addUniqueFormat(uniqueParaFormatTemp, WParagraphFormat.uniqueFormatType);
    }
    // tslint:disable-next-line:max-line-length
    private addUniqueParaFormat(property: string, modifiedProperty: string, propValue: Object, uniqueParaFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueParaFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
            case 'leftIndent':
                value = 0;
                break;
            case 'rightIndent':
                value = 0;
                break;
            case 'firstLineIndent':
                value = 0;
                break;
            case 'textAlignment':
                value = 'Left';
                break;
            case 'beforeSpacing':
                value = 0;
                break;
            case 'afterSpacing':
                value = 0;
                break;
            case 'lineSpacing':
                value = 1;
                break;
            case 'lineSpacingType':
                value = 'Multiple';
                break;
            case 'styleName':
                value = 'Normal';
                break;
            case 'outlineLevel':
                value = 'BodyText';
                break;
        }
        return value;
    }
    public clearFormat(): void {
        if (!isNullOrUndefined(this.listFormat)) {
            this.listFormat.clearFormat();
        }
        if (!isNullOrUndefined(this.uniqueParagraphFormat) && this.uniqueParagraphFormat.referenceCount === 0) {
            WParagraphFormat.uniqueParagraphFormats.remove(this.uniqueParagraphFormat);
        }
        this.uniqueParagraphFormat = undefined;
        this.baseStyle = undefined;
    }
    public destroy(): void {
        this.clearFormat();
        if (!isNullOrUndefined(this.listFormat)) {
            this.listFormat.destroy();
        }
        this.listFormat = undefined;

        if (this.tabs !== undefined) {
            for (let i: number = 0; i < this.tabs.length; i++) {
                this.tabs[i].destroy();
            }
            this.tabs = undefined;
        }
    }
    public copyFormat(format: WParagraphFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueParagraphFormat)) {
                this.updateUniqueParagraphFormat(format);
            }
            if (!isNullOrUndefined(format.listFormat)) {
                this.listFormat.copyFormat(format.listFormat);
            }
            if (!isNullOrUndefined(format.baseStyle)) {
                this.baseStyle = format.baseStyle;
            }
            if (!isNullOrUndefined(format.tabs)) {
                for (let i: number = 0; i < format.tabs.length; i++) {
                    this.tabs[i] = format.tabs[i];
                }
            }
        }
    }
    public updateUniqueParagraphFormat(format: WParagraphFormat): void {
        let hash: Dictionary<number, object> = undefined;
        if (this.uniqueParagraphFormat) {
            hash = this.uniqueParagraphFormat.mergeProperties(format.uniqueParagraphFormat);
            if (this.uniqueParagraphFormat.referenceCount === 0) {
                WParagraphFormat.uniqueParagraphFormats.remove(this.uniqueParagraphFormat);
                this.uniqueParagraphFormat = undefined;
            }
        }
        this.uniqueParagraphFormat = new WUniqueFormat(WParagraphFormat.uniqueFormatType);
        if (isNullOrUndefined(hash)) {
            hash = this.uniqueParagraphFormat.mergeProperties(format.uniqueParagraphFormat);
        }
        this.uniqueParagraphFormat = WParagraphFormat.uniqueParagraphFormats.addUniqueFormat(hash, WParagraphFormat.uniqueFormatType);
    }
    public cloneFormat(): WParagraphFormat {
        let format: WParagraphFormat = new WParagraphFormat(undefined);
        format.uniqueParagraphFormat = this.uniqueParagraphFormat;
        format.baseStyle = this.baseStyle;
        if (isNullOrUndefined(this.listFormat)) {
            format.listFormat = undefined;
        } else {
            format.listFormat = new WListFormat();
            format.listFormat.listId = this.listFormat.listId;
            format.listFormat.listLevelNumber = this.listFormat.listLevelNumber;
        }
        return format;
    }
    private hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueParagraphFormat) && !isNullOrUndefined(this.uniqueParagraphFormat.propertiesHash)) {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueParagraphFormat.uniqueFormatType, property);
            return this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public static clear(): void {
        this.uniqueParagraphFormats.clear();
    }
    public ApplyStyle(baseStyle: WStyle): void {
        this.baseStyle = baseStyle;
        this.listFormat.ApplyStyle(this.baseStyle);
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
    public mergeFormat(format: WParagraphFormat): void {
        if (isNullOrUndefined(this.getValue('leftIndent'))) {
            this.leftIndent = format.getValue('leftIndent') as number;
        }
        if (isNullOrUndefined(this.getValue('rightIndent'))) {
            this.rightIndent = format.getValue('rightIndent') as number;
        }
        if (isNullOrUndefined(this.getValue('firstLineIndent'))) {
            this.firstLineIndent = format.getValue('firstLineIndent') as number;
        }
        if (isNullOrUndefined(this.getValue('beforeSpacing'))) {
            this.beforeSpacing = format.getValue('beforeSpacing') as number;
        }
        if (isNullOrUndefined(this.getValue('afterSpacing'))) {
            this.afterSpacing = format.getValue('afterSpacing') as number;
        }
        if (isNullOrUndefined(this.getValue('lineSpacing'))) {
            this.lineSpacing = format.getValue('lineSpacing') as number;
        }
        if (isNullOrUndefined(this.getValue('lineSpacingType'))) {
            this.lineSpacingType = format.getValue('lineSpacingType') as LineSpacingType;
        }
        if (isNullOrUndefined(this.getValue('textAlignment'))) {
            this.textAlignment = format.getValue('textAlignment') as TextAlignment;
        }
        if (isNullOrUndefined(this.getValue('outlineLevel'))) {
            this.outlineLevel = format.getValue('outlineLevel') as OutlineLevel;
        }
        if (isNullOrUndefined(this.listFormat)) {
            this.listFormat.mergeFormat(format.listFormat);
        }
    }
}