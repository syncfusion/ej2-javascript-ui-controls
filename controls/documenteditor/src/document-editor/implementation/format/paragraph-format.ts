import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { WBorders } from './borders';
import { LineSpacingType, TextAlignment, OutlineLevel, TabJustification, TabLeader } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WListFormat } from './list-format';
import { ParagraphWidget, BodyWidget, TableCellWidget, BlockContainer, TextFrame } from '../viewer/page';
import { WStyle, WParagraphStyle } from './style';
import { WListLevel } from '../list/list-level';
import { DocumentHelper } from '../viewer';
/* eslint-disable */
/**
 * @private
 */
export class WTabStop {
    private positionIn: number;
    private deletePositionIn: number;
    private justification: TabJustification;
    private leader: TabLeader;

    public get position(): number {
        return this.positionIn;
    }
    public set position(value: number) {
        this.positionIn = value;
    }

    public get deletePosition(): number {
        return this.deletePositionIn;
    }
    public set deletePosition(value: number) {
        this.deletePositionIn = value;
    }

    public get tabJustification(): TabJustification {
        return this.justification;
    }
    public set tabJustification(value: TabJustification) {
        this.justification = value;
    }

    public get tabLeader(): TabLeader {
        return this.leader;
    }
    public set tabLeader(value: TabLeader) {
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
    public borders: WBorders;
    public listFormat: WListFormat;
    public ownerBase: Object = undefined;
    public baseStyle: WStyle = undefined;
    public tabs: WTabStop[] = undefined;
    public getUpdatedTabs(): WTabStop[] {
        let inTabs: WTabStop[] = [];
        const tabStops: Dictionary<number, WTabStop> = new Dictionary<number, WTabStop>();
        let tabsInListFormat: WTabStop[] = this.getTabStopsFromListFormat();
        for (const tabStop of tabsInListFormat) {
            if (!tabStops.containsKey(tabStop.position)) {
                tabStops.add(tabStop.position, tabStop);
            }
        }
        if (!isNullOrUndefined(this.baseStyle) && this.baseStyle instanceof WParagraphStyle) {
            let baseStyle: any = this.baseStyle;
            while (!isNullOrUndefined(baseStyle)) {
                for (const tab of baseStyle.paragraphFormat.tabs) {
                    if (!tabStops.containsKey(tab.position)) {
                        tabStops.add(tab.position, tab);
                    }
                }
                baseStyle = baseStyle.basedOn;
            }
            for (const key of tabStops.keys) {
                if (!this.hasTabStop(parseFloat(key.toFixed(4)))) {
                    inTabs.push(tabStops.get(key));
                }
            }
        }
        inTabs = inTabs.concat(this.tabs.filter((a: WTabStop) => (a.position !== 0 && a.deletePosition === 0)));
        inTabs = inTabs.sort((a: WTabStop, b: WTabStop) => a.position - b.position);
        return inTabs;
    }
    private getTabStopsFromListFormat(): WTabStop[] {
        if (this.listFormat.listId > -1 && this.listFormat.listLevelNumber > -1) {
            const level: WListLevel = this.listFormat.listLevel;
            if (level && level.paragraphFormat) {
                return level.paragraphFormat.tabs;
            }
        }
        return [];
    }

    private hasTabStop(position: number): boolean {
        for (let i: number = 0; i < this.tabs.length; i++) {
            if (parseFloat(this.tabs[i].position.toFixed(4)) === position ||
                parseFloat(this.tabs[i].deletePosition.toFixed(4)) === position) {
                return true;
            }
        }
        return false;
    }
    public get leftIndent(): number {
        return this.getPropertyValue('leftIndent') as number;
    }
    public set leftIndent(value: number) {
        this.setPropertyValue('leftIndent', value);
    }
    public get rightIndent(): number {
        return this.getPropertyValue('rightIndent') as number;
    }
    public set rightIndent(value: number) {
        this.setPropertyValue('rightIndent', value);
    }
    public get firstLineIndent(): number {
        return this.getPropertyValue('firstLineIndent') as number;
    }
    public set firstLineIndent(value: number) {
        this.setPropertyValue('firstLineIndent', value);
    }
    public get beforeSpacing(): number {
        return this.getPropertyValue('beforeSpacing') as number;
    }
    public set beforeSpacing(value: number) {
        this.setPropertyValue('beforeSpacing', value);
    }
    public get afterSpacing(): number {
        return this.getPropertyValue('afterSpacing') as number;
    }
    public set afterSpacing(value: number) {
        this.setPropertyValue('afterSpacing', value);
    }
    public get spaceBeforeAuto(): boolean {
        return this.getPropertyValue('spaceBeforeAuto') as boolean;
    }
    public set spaceBeforeAuto(value: boolean) {
        this.setPropertyValue('spaceBeforeAuto', value);
    }
    public get spaceAfterAuto(): boolean {
        return this.getPropertyValue('spaceAfterAuto') as boolean;
    }
    public set spaceAfterAuto(value: boolean) {
        this.setPropertyValue('spaceAfterAuto', value);
    }  
    public get lineSpacing(): number {
        return this.getPropertyValue('lineSpacing') as number;
    }
    public set lineSpacing(value: number) {
        this.setPropertyValue('lineSpacing', value);
    }
    public get lineSpacingType(): LineSpacingType {
        return this.getPropertyValue('lineSpacingType') as LineSpacingType;
    }
    public set lineSpacingType(value: LineSpacingType) {
        this.setPropertyValue('lineSpacingType', value);
    }
    public get textAlignment(): TextAlignment {
        let value: TextAlignment = this.getPropertyValue('textAlignment') as TextAlignment;
        if (this.bidi) {
            if (value === 'Left') {
                value = 'Right'
            } else if (value === 'Right') {
                value = 'Left';
            }
        }
        return value;
    }
    public set textAlignment(value: TextAlignment) {
        this.setPropertyValue('textAlignment', value);
    }

    public get keepWithNext(): boolean {
        return this.getPropertyValue('keepWithNext') as boolean;
    }

    public set keepWithNext(value: boolean) {
        this.setPropertyValue('keepWithNext', value);
    }

    public get keepLinesTogether(): boolean {
        return this.getPropertyValue('keepLinesTogether') as boolean;
    }

    public set keepLinesTogether(value: boolean) {
        this.setPropertyValue('keepLinesTogether', value);
    }

    public get widowControl(): boolean {
        return this.getPropertyValue('widowControl') as boolean;
    }

    public set widowControl(value: boolean) {
        this.setPropertyValue('widowControl', value);
    }

    public get outlineLevel(): OutlineLevel {
        return this.getPropertyValue('outlineLevel') as OutlineLevel;
    }
    public set outlineLevel(value: OutlineLevel) {
        this.setPropertyValue('outlineLevel', value);
    }

    public get bidi(): boolean {
        return this.getPropertyValue('bidi') as boolean;
    }

    public set bidi(value: boolean) {
        this.setPropertyValue('bidi', value);
    }
    public get contextualSpacing(): boolean {
        return this.getPropertyValue('contextualSpacing') as boolean;
    }

    public set contextualSpacing(value: boolean) {
        this.setPropertyValue('contextualSpacing', value);
    }
    public constructor(node?: Object) {
        this.ownerBase = node;
        this.listFormat = new WListFormat(this);
        this.borders  = new WBorders(this);
        this.tabs = [];
    }
    private getListFormatParagraphFormat(property: string): object {
        const paragraphFormat: WParagraphFormat = this.getListPargaraphFormat(property);
        if (!isNullOrUndefined(paragraphFormat)) {
            return paragraphFormat.uniqueParagraphFormat.propertiesHash.get(WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property));
        }
        return undefined;
    }
    /**
    * @private
    */
    public getListPargaraphFormat(property: string): WParagraphFormat {
        if (this.listFormat.listId > -1 && this.listFormat.listLevelNumber > -1) {
            const level: WListLevel = this.listFormat.listLevel;
            const propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(level) && !isNullOrUndefined(level.paragraphFormat.uniqueParagraphFormat) &&
                level.paragraphFormat.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)) {
                return level.paragraphFormat;
            } else {
                return undefined;
            }
        } else if (this.listFormat.hasValue('listId') && this.listFormat.listId === -1
            && (property === 'leftIndent' || property === 'firstLineIndent')) {
            const paraFormat: WParagraphFormat = new WParagraphFormat();
            if (!this.hasValue('leftIndent')) {
                paraFormat.leftIndent = 0;
            }
            if (!this.hasValue('firstLineIndent')) {
                paraFormat.firstLineIndent = 0;
            }
            return paraFormat
        }
        return undefined;
    }

    public getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            const formatInList: object = this.getListFormatParagraphFormat(property);
            if (this.baseStyle instanceof WParagraphStyle) {
                let currentFormat: WParagraphFormat = this;
                let baseStyle: any = this.baseStyle;
                while (!isNullOrUndefined(baseStyle)) {
                    let listParaFormat: WParagraphFormat;
                    if (!this.listFormat.hasValue('listId')) {
                        listParaFormat = baseStyle.paragraphFormat.getListPargaraphFormat(property);
                    }
                    if (baseStyle.paragraphFormat.hasValue(property)) {
                        currentFormat = baseStyle.paragraphFormat;
                        break;
                    } else if (!isNullOrUndefined(listParaFormat) && listParaFormat.hasValue(property)) {
                        currentFormat = listParaFormat;
                        break;
                    } else {
                        baseStyle = baseStyle.basedOn;
                    }
                }
                if (!isNullOrUndefined(baseStyle)) {
                    if (!isNullOrUndefined(formatInList) && this.listFormat.hasValue('listId')
                        && currentFormat.listFormat.listId === -1 && currentFormat.listFormat.listLevelNumber <= 1
                        || !isNullOrUndefined(formatInList) && this.listFormat.listId !== currentFormat.listFormat.listId
                        && currentFormat.listFormat.listLevelNumber <= 1) {
                        return formatInList;
                    }
                    const propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
                    return currentFormat.uniqueParagraphFormat.propertiesHash.get(propertyType);
                }
            }
            if (!isNullOrUndefined(formatInList)) {
                return formatInList;
            }
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueParagraphFormat) && this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueParagraphFormat.propertiesHash.get(propertyType);
            }
        }
        return this.getDefaultValue(property);
    }
    private getDefaultValue(property: string): Object {
        const propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
        const docParagraphFormat: WParagraphFormat = this.getDocumentParagraphFormat();
        let isInsideBodyWidget: boolean = true;
        if (this.ownerBase && this.ownerBase instanceof ParagraphWidget) {
            isInsideBodyWidget = this.ownerBase.containerWidget instanceof BlockContainer ||  this.ownerBase.containerWidget instanceof TextFrame ||
                this.ownerBase.containerWidget instanceof TableCellWidget;
        }
        let isPaste: boolean = !isNullOrUndefined(this.ownerBase) && !isNullOrUndefined((this.ownerBase as ParagraphWidget).bodyWidget)
            && (this.ownerBase as ParagraphWidget).bodyWidget.page && !isNullOrUndefined((this.ownerBase as ParagraphWidget).bodyWidget.page.documentHelper) && (this.ownerBase as ParagraphWidget).bodyWidget.page.documentHelper.owner.editor
            && (this.ownerBase as ParagraphWidget).bodyWidget.page.documentHelper.owner.editor.isPaste;
        if (isInsideBodyWidget && !isPaste
            && !isNullOrUndefined(docParagraphFormat) && !isNullOrUndefined(docParagraphFormat.uniqueParagraphFormat)) {
            const propValue: Object = docParagraphFormat.uniqueParagraphFormat.propertiesHash.get(propertyType);
            if (!isNullOrUndefined(propValue)) {
                return propValue;
            }
        }
        return WParagraphFormat.getPropertyDefaultValue(property);
    }
    /**
    * @private
    */
    public getDocumentParagraphFormat(): WParagraphFormat {
        let docParagraphFormat: WParagraphFormat;
        if (!isNullOrUndefined(this.ownerBase)) {
            let documentHelper: DocumentHelper = this.getDocumentHelperObject();
            if (!isNullOrUndefined(documentHelper)) {
                docParagraphFormat = documentHelper.paragraphFormat;
            }
        }
        return docParagraphFormat;
    }
    /**
    * @private
    */
    public getDocumentHelperObject(): DocumentHelper {
        let documentHelper: DocumentHelper;
        if (this.ownerBase instanceof ParagraphWidget) {
            const bodyWidget: BlockContainer = (this.ownerBase as ParagraphWidget).bodyWidget;
            if (!isNullOrUndefined(bodyWidget) && !isNullOrUndefined(bodyWidget.page) && !isNullOrUndefined(bodyWidget.page.documentHelper)) {
                documentHelper = bodyWidget.page.documentHelper;
            }
        }
        return documentHelper;
    }
    private setPropertyValue(property: string, value: Object, clearProperty?:boolean): void {
        if (isNullOrUndefined(value) || value === '' && !clearProperty) {
            value = WParagraphFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueParagraphFormat)) {
            this.initializeUniqueParagraphFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueParagraphFormat.uniqueFormatType, property);
            if (this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueParagraphFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }

            this.uniqueParagraphFormat = WParagraphFormat.uniqueParagraphFormats.updateUniqueFormat(this.uniqueParagraphFormat, property, value);
        }
    }
    private initializeUniqueParagraphFormat(property: string, propValue: Object): void {
        const uniqueParaFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueParaFormat('leftIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('rightIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('firstLineIndent', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('textAlignment', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('beforeSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('afterSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('spaceBeforeAuto', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('spaceAfterAuto', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('lineSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('lineSpacingType', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('outlineLevel', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('bidi', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('contextualSpacing', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('keepWithNext', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('keepLinesTogether', property, propValue, uniqueParaFormatTemp);
        this.addUniqueParaFormat('widowControl', property, propValue, uniqueParaFormatTemp);

        this.uniqueParagraphFormat = WParagraphFormat.uniqueParagraphFormats.addUniqueFormat(uniqueParaFormatTemp, WParagraphFormat.uniqueFormatType);
    }

    private addUniqueParaFormat(property: string, modifiedProperty: string, propValue: Object, uniqueParaFormatTemp: Dictionary<number, object>): void {
        let propertyType: number = WUniqueFormat.getPropertyType(WParagraphFormat.uniqueFormatType, property);
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
            case 'spaceBeforeAuto':
                value = false;
                break;
            case 'spaceAfterAuto':
                value = false;
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
            case 'bidi':
                value = false;
                break;
            case 'contextualSpacing':
                value = false;
                break;
            case 'keepWithNext':
                value = false;
                break;
            case 'keepLinesTogether':
                value = false;
                break;
            case 'widowControl':
                value = true;
                break;
        }
        return value;
    }
    public clearIndent(): void {
        this.clearPropertyValue('leftIndent');
        this.clearPropertyValue('firstLineIndent');
    }
    public clearPropertyValue(property: string): void {
        this.setPropertyValue(property, undefined, true);
        if (!isNullOrUndefined(this.uniqueParagraphFormat)) {
            let key: number = WUniqueFormat.getPropertyType(this.uniqueParagraphFormat.uniqueFormatType, property);
            if (this.uniqueParagraphFormat.propertiesHash.containsKey(key)) {
                this.uniqueParagraphFormat.propertiesHash.remove(key);
            }
        }
    }
    public clearFormat(): void {
        if (!isNullOrUndefined(this.listFormat)) {
            this.listFormat.clearFormat();
        }
        if (!isNullOrUndefined(this.borders)) {
            this.borders.clearFormat();
        }
        if (!isNullOrUndefined(this.uniqueParagraphFormat) && this.uniqueParagraphFormat.referenceCount === 0) {
            WParagraphFormat.uniqueParagraphFormats.remove(this.uniqueParagraphFormat);
        }
        this.uniqueParagraphFormat = undefined;
        if(!isNullOrUndefined(this.getDocumentHelperObject())) {
            this.baseStyle = this.getDocumentHelperObject().styles.findByName('Normal') as WParagraphStyle;
        }
    }

    public destroy(): void {
        if (!isNullOrUndefined(this.uniqueParagraphFormat)) {
            WParagraphFormat.uniqueParagraphFormats.remove(this.uniqueParagraphFormat);
        }
        this.uniqueParagraphFormat = undefined;

        if (!isNullOrUndefined(this.listFormat)) {
            this.listFormat.destroy();
        }
        this.listFormat = undefined;

        if (this.tabs && this.tabs.length > 0) {
            for (let i: number = 0; i < this.tabs.length; i++) {
                this.tabs[i].destroy();
            }
            this.tabs = [];
            this.tabs = undefined;
        }
        if (!isNullOrUndefined(this.borders)) {
            this.borders.destroy();
        }
        this.borders = undefined;
        this.baseStyle = undefined;
        this.ownerBase = undefined;
    }
    public copyFormat(format: WParagraphFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueParagraphFormat)) {
                this.updateUniqueParagraphFormat(format);
            }
            if (!isNullOrUndefined(format.borders)) {
                //this.borders = new WBorders(this);
                (this.borders as WBorders).copyFormat(format.borders);
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
        const format: WParagraphFormat = new WParagraphFormat(undefined);
        format.uniqueParagraphFormat = this.uniqueParagraphFormat;
        format.baseStyle = this.baseStyle;
        if (isNullOrUndefined(this.listFormat)) {
            format.listFormat = undefined;
        } else {
            format.listFormat = this.listFormat.cloneListFormat();
            format.listFormat.ownerBase = format;
        }
        format.borders = isNullOrUndefined(this.borders) ? undefined : this.borders.cloneFormat();
        return format;
    }
    /**
     *
     * @private
     */
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueParagraphFormat) && !isNullOrUndefined(this.uniqueParagraphFormat.propertiesHash)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueParagraphFormat.uniqueFormatType, property);
            return this.uniqueParagraphFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public static clear(): void {
        this.uniqueParagraphFormats.clear();
    }
    public applyStyle(baseStyle: WStyle): void {
        this.baseStyle = baseStyle;
        this.listFormat.applyStyle(this.baseStyle);
    }
    public getValue(property: string): Object {
        return this.hasValue(property) ? this.getPropertyValue(property) : undefined;
    }
    public mergeFormat(format: WParagraphFormat, isStyle?: boolean): void {
        isStyle = isNullOrUndefined(isStyle) ? false : isStyle;
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
        if (isNullOrUndefined(this.getValue('spaceBeforeAuto'))) {
            this.spaceBeforeAuto = format.getValue('spaceBeforeAuto') as boolean;
        }
        if (isNullOrUndefined(this.getValue('spaceAfterAuto'))) {
            this.spaceAfterAuto = format.getValue('spaceAfterAuto') as boolean;
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
        if (!isStyle && isNullOrUndefined(this.getValue('bidi'))) {
            this.bidi = format.getValue('bidi') as boolean;
        }
        if (isNullOrUndefined(this.getValue('contextualSpacing'))) {
            this.contextualSpacing = format.getValue('contextualSpacing') as boolean;
        }
        if (isNullOrUndefined(this.getValue('keepWithNext'))) {
            this.keepWithNext = format.getValue('keepWithNext') as boolean;
        }
        if (isNullOrUndefined(this.getValue('keepLinesTogether'))) {
            this.keepLinesTogether = format.getValue('keepLinesTogether') as boolean;
        }
        if (isNullOrUndefined(this.getValue('widowControl'))) {
            this.widowControl = format.getValue('widowControl') as boolean;
        }
        if (isNullOrUndefined(this.listFormat)) {
            this.listFormat.mergeFormat(format.listFormat);
        }
    }
}
