import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { EditorHistory } from '../editor-history/editor-history';
import { FootEndNoteNumberFormat, FootnoteRestartIndex } from '../../base/types';
import { SelectionHeaderFooter } from '../selection';
import { HeaderFooterWidget } from '../viewer/page';
/* eslint-disable */
/**
 * @private
 */
export class WSectionFormat {
    private uniqueSectionFormat: WUniqueFormat = undefined;
    private static uniqueSectionFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 10;
    public ownerBase: Object;
    public columns: WColumnFormat[] = [];
    public removedHeaderFooters: HeaderFooterWidget[];

    public get headerDistance(): number {
        return this.getPropertyValue('headerDistance') as number;
    }
    public set headerDistance(value: number) {
        this.setPropertyValue('headerDistance', value);
    }
    public get footerDistance(): number {
        return this.getPropertyValue('footerDistance') as number;
    }
    public set footerDistance(value: number) {
        this.setPropertyValue('footerDistance', value);
    }
    public get differentFirstPage(): boolean {
        return this.getPropertyValue('differentFirstPage') as boolean;
    }
    public set differentFirstPage(value: boolean) {
        this.setPropertyValue('differentFirstPage', value);
    }
    public get differentOddAndEvenPages(): boolean {
        return this.getPropertyValue('differentOddAndEvenPages') as boolean;
    }
    public set differentOddAndEvenPages(value: boolean) {
        this.setPropertyValue('differentOddAndEvenPages', value);
    }
    public get pageHeight(): number {
        return this.getPropertyValue('pageHeight') as number;
    }
    public set pageHeight(value: number) {
        this.setPropertyValue('pageHeight', value);
    }
    public get rightMargin(): number {
        return this.getPropertyValue('rightMargin') as number;
    }
    public set rightMargin(value: number) {
        this.setPropertyValue('rightMargin', value);
    }
    public get pageWidth(): number {
        return this.getPropertyValue('pageWidth') as number;
    }
    public set pageWidth(value: number) {
        this.setPropertyValue('pageWidth', value);
    }
    public get leftMargin(): number {
        return this.getPropertyValue('leftMargin') as number;
    }
    public set leftMargin(value: number) {
        this.setPropertyValue('leftMargin', value);
    }
    public get bottomMargin(): number {
        return this.getPropertyValue('bottomMargin') as number;
    }
    public set bottomMargin(value: number) {
        this.setPropertyValue('bottomMargin', value);
    }
    public get topMargin(): number {
        return this.getPropertyValue('topMargin') as number;
    }
    public set topMargin(value: number) {
        this.setPropertyValue('topMargin', value);
    }
    public get bidi(): boolean {
        return this.getPropertyValue('bidi') as boolean;
    }
    public set bidi(value: boolean) {
        this.setPropertyValue('bidi', value);
    }
    public get restartPageNumbering(): boolean {
        return this.getPropertyValue('restartPageNumbering') as boolean;
    }
    public set restartPageNumbering(value: boolean) {
        this.setPropertyValue('restartPageNumbering', value);
    }
    public get pageStartingNumber(): number {
        return this.getPropertyValue('pageStartingNumber') as number;
    }
    public set pageStartingNumber(value: number) {
        this.setPropertyValue('pageStartingNumber', value);
    }
    public get endnoteNumberFormat(): FootEndNoteNumberFormat {
        return this.getPropertyValue('endnoteNumberFormat') as FootEndNoteNumberFormat;
    }
    public set endnoteNumberFormat(value: FootEndNoteNumberFormat) {
        this.setPropertyValue('endnoteNumberFormat', value);
    }
    public get restartIndexForEndnotes(): FootnoteRestartIndex {
        return this.getPropertyValue('restartIndexForEndnotes') as FootnoteRestartIndex;
    }
    public set restartIndexForEndnotes(value: FootnoteRestartIndex) {
        this.setPropertyValue('restartIndexForEndnotes', value);
    }
    public get restartIndexForFootnotes(): FootnoteRestartIndex {
        return this.getPropertyValue('restartIndexForFootnotes') as FootnoteRestartIndex;
    }
    public set restartIndexForFootnotes(value: FootnoteRestartIndex) {
        this.setPropertyValue('restartIndexForFootnotes', value);
    }
    public get footNoteNumberFormat(): FootEndNoteNumberFormat {
        return this.getPropertyValue('footNoteNumberFormat') as FootEndNoteNumberFormat;
    }
    public set footNoteNumberFormat(value: FootEndNoteNumberFormat) {
        this.setPropertyValue('footNoteNumberFormat', value);
    }
    public get initialFootNoteNumber(): number {
        return this.getPropertyValue('initialFootNoteNumber') as number;
    }
    public set initialFootNoteNumber(value: number) {
        this.setPropertyValue('initialFootNoteNumber', value);
    }
    public get initialEndNoteNumber(): number {
        return this.getPropertyValue('initialEndNoteNumber') as number;
    }
    public set initialEndNoteNumber(value: number) {
        this.setPropertyValue('initialEndNoteNumber', value);
    }
    public get pageNumberStyle(): FootEndNoteNumberFormat {
        return this.getPropertyValue('pageNumberStyle') as FootEndNoteNumberFormat;
    }
    public set pageNumberStyle(value: FootEndNoteNumberFormat) {
        this.setPropertyValue('pageNumberStyle', value);
    }
    public get numberOfColumns(): number {
        return this.getPropertyValue('numberOfColumns') as number;
    }
    public set numberOfColumns(value: number) {
        this.setPropertyValue('numberOfColumns', value);
    }
    public get equalWidth(): boolean {
        return this.getPropertyValue('equalWidth') as boolean;
    }
    public set equalWidth(value: boolean) {
        this.setPropertyValue('equalWidth', value);
    }
    public get lineBetweenColumns(): boolean {
        return this.getPropertyValue('lineBetweenColumns') as boolean;
    }
    public set lineBetweenColumns(value: boolean) {
        this.setPropertyValue('lineBetweenColumns', value);
    }
    public get breakCode(): string {
        return this.getPropertyValue('breakCode') as string;
    }
    public set breakCode(value: string) {
        this.setPropertyValue('breakCode', value);
    }
    public set firstPageHeader(value: SelectionHeaderFooter) {
        this.setPropertyValue('firstPageHeader', value);
    }

    public get firstPageHeader(): SelectionHeaderFooter {
        return this.getPropertyValue('firstPageHeader') as SelectionHeaderFooter;
    }

    public set firstPageFooter(value: SelectionHeaderFooter) {
        this.setPropertyValue('firstPageFooter', value);
    }

    public get firstPageFooter(): SelectionHeaderFooter {
        return this.getPropertyValue('firstPageFooter') as SelectionHeaderFooter;
    }

    public set oddPageHeader(value: SelectionHeaderFooter) {
        this.setPropertyValue('oddPageHeader', value);
    }

    public get oddPageHeader(): SelectionHeaderFooter {
        return this.getPropertyValue('oddPageHeader') as SelectionHeaderFooter;
    }

    public set oddPageFooter(value: SelectionHeaderFooter) {
        this.setPropertyValue('oddPageFooter', value);
    }

    public get oddPageFooter(): SelectionHeaderFooter {
        return this.getPropertyValue('oddPageFooter') as SelectionHeaderFooter;
    }

    public set evenPageHeader(value: SelectionHeaderFooter) {
        this.setPropertyValue('evenPageHeader', value);
    }

    public get evenPageHeader(): SelectionHeaderFooter {
        return this.getPropertyValue('evenPageHeader') as SelectionHeaderFooter;
    }

    public set evenPageFooter(value: SelectionHeaderFooter) {
        this.setPropertyValue('evenPageFooter', value);
    }

    public get evenPageFooter(): SelectionHeaderFooter {
        return this.getPropertyValue('evenPageFooter') as SelectionHeaderFooter;
    }

    public constructor(node?: Object) {
        this.ownerBase = node;
        this.columns = [];
        this.removedHeaderFooters = [];
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.uniqueSectionFormat)) {
            WSectionFormat.uniqueSectionFormats.remove(this.uniqueSectionFormat);
        }
        this.uniqueSectionFormat = undefined;
        this.ownerBase = undefined;
        this.columns = undefined;
        this.removedHeaderFooters = undefined;
    }
    private hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueSectionFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueSectionFormat.uniqueFormatType, property);
            return this.uniqueSectionFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }

    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
            case 'headerDistance':
                value = 36;
                break;
            case 'footerDistance':
                value = 36;
                break;
            case 'differentFirstPage':
                value = false;
                break;
            case 'differentOddAndEvenPages':
                value = false;
                break;
            case 'pageWidth':
                value = 612;
                break;
            case 'pageHeight':
                value = 792;
                break;
            case 'leftMargin':
                value = 72;
                break;
            case 'topMargin':
                value = 72;
                break;
            case 'rightMargin':
                value = 72;
                break;
            case 'bottomMargin':
                value = 72;
                break;
            case 'bidi':
                value = false;
                break;
            case 'restartPageNumbering':
                value = false;
                break;
            case 'pageStartingNumber':
                value = 1;
                break;
            case 'footnotePosition':
                value = 'PrintAtBottomOfPage';
                break;
            case 'endnoteNumberFormat':
                value = 'LowerCaseRoman';
                break;
            case 'endnotePosition':
                value = 'DisplayEndOfDocument';
                break;
            case 'restartIndexForEndnotes':
                value = 'DoNotRestart';
                break;
            case 'restartIndexForFootnotes':
                value = 'DoNotRestart';
                break;
            case 'footNoteNumberFormat':
                value = 'Arabic';
                break;
            case 'initialFootNoteNumber':
                value = 1;
                break;
            case 'initialEndNoteNumber':
                value = 1;
                break;
            case 'pageNumberStyle' :
                value = 'Arabic';
                break;
            case 'numberOfColumns' :
                value = 1;
                break;
            case 'equalWidth' :
                value = true;
                break;
            case 'lineBetweenColumns':
                value = false;
                break;
            case 'breakCode':
                value = 'NewPage';
                break;
            case 'firstPageHeader':
                value = undefined;
                break;
            case 'firstPageFooter':
                value = undefined;
                break;
            case 'oddPageHeader':
                value = undefined;
                break;
            case 'oddPageFooter':
                value = undefined;
                break;
            case 'evenPageHeader':
                value = undefined;
                break;
            case 'evenPageFooter':
                value = undefined;
                break;

        }
        return value;
    }
    public getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WSectionFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueSectionFormat) && this.uniqueSectionFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueSectionFormat.propertiesHash.get(propertyType);
            }
        }
        return WSectionFormat.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WSectionFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueSectionFormat)) {
            this.initializeUniqueSectionFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueSectionFormat.uniqueFormatType, property);
            if (this.uniqueSectionFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueSectionFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueSectionFormat = WSectionFormat.uniqueSectionFormats.updateUniqueFormat(this.uniqueSectionFormat, property, value);
        }
    }
    private initializeUniqueSectionFormat(property: string, propValue: Object): void {
        const uniqueSectionFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueSectionFormat('headerDistance', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('footerDistance', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('differentFirstPage', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('differentOddAndEvenPages', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('pageWidth', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('pageHeight', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('leftMargin', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('topMargin', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('rightMargin', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('bottomMargin', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('bidi', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('restartPageNumbering', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('pageStartingNumber', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('endnoteNumberFormat', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('endnotePosition', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('footNoteNumberFormat', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('footnotePosition', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('restartIndexForEndnotes', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('restartIndexForFootnotes', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('initialFootNoteNumber', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('initialEndNoteNumber', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('pageNumberStyle', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('numberOfColumns', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('equalWidth', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('lineBetweenColumns', property, propValue, uniqueSectionFormatTemp);
        this.addUniqueSectionFormat('breakCode', property, propValue, uniqueSectionFormatTemp);
        this.uniqueSectionFormat = WSectionFormat.uniqueSectionFormats.addUniqueFormat(uniqueSectionFormatTemp, WSectionFormat.uniqueFormatType);
    }

    private addUniqueSectionFormat(property: string, modifiedProperty: string, propValue: Object, uniqueSectionFormatTemp: Dictionary<number, object>): void {
        const propertyType: number = WUniqueFormat.getPropertyType(WSectionFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueSectionFormatTemp.add(propertyType, propValue);
        } else {
            uniqueSectionFormatTemp.add(propertyType, WSectionFormat.getPropertyDefaultValue(property));
        }
    }
    public copyFormat(format: WSectionFormat, history?: EditorHistory): void {
        if (history && (history.isUndoing || history.isRedoing)) {
            this.uniqueSectionFormat = format.uniqueSectionFormat;            
            this.columns = format.columns;
            this.removedHeaderFooters = format.removedHeaderFooters;
        } else {
            if (!isNullOrUndefined(format)) {
                this.removedHeaderFooters = format.removedHeaderFooters;
                if (!isNullOrUndefined(format.uniqueSectionFormat) && format.uniqueSectionFormat.propertiesHash) {
                    this.updateUniqueSectionFormat(format);
                    this.columns = format.columns;
                }
            }
        }
    }

    public updateUniqueSectionFormat(format: WSectionFormat): void {
        let hash: Dictionary<number, object> = undefined;
        if (this.uniqueSectionFormat) {
            hash = this.uniqueSectionFormat.mergeProperties(format.uniqueSectionFormat);
            if (this.uniqueSectionFormat.referenceCount === 0) {
                WSectionFormat.uniqueSectionFormats.remove(this.uniqueSectionFormat);
                this.uniqueSectionFormat = undefined;
            }
        }
        this.uniqueSectionFormat = new WUniqueFormat(WSectionFormat.uniqueFormatType);
        if (isNullOrUndefined(hash)) {
            hash = this.uniqueSectionFormat.mergeProperties(format.uniqueSectionFormat);
        }
        this.uniqueSectionFormat = WSectionFormat.uniqueSectionFormats.addUniqueFormat(hash, WSectionFormat.uniqueFormatType);
    }
    public cloneFormat(): WSectionFormat {
        const format: WSectionFormat = new WSectionFormat();
        format.uniqueSectionFormat = this.uniqueSectionFormat;
        format.columns = this.columns;
        return format;
    }
    public static clear(): void {
        this.uniqueSectionFormats.clear();
    }
}
/**
 * @private
 */
export class WColumnFormat {
    private uniqueColumnFormat: WUniqueFormat = undefined;
    private static uniqueColumnFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 11;
    public ownerBase: Object;
    private indexIn: number;
    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.uniqueColumnFormat)) {
            WColumnFormat.uniqueColumnFormats.remove(this.uniqueColumnFormat);
        }
        this.uniqueColumnFormat = undefined;
        this.ownerBase = undefined;
    }
    private hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueColumnFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueColumnFormat.uniqueFormatType, property);
            return this.uniqueColumnFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }

    get index() {
        return this.indexIn;
    }
    set index(value: number) {
        this.indexIn = value;
    }
    get width(): number {
        return this.getPropertyValue('width') as number;
    }
    set width(value: number) {
        this.setPropertyValue('width', value);
    }
    get space(): number {
        return this.getPropertyValue('space') as number;
    }
    set space(value: number) {
        this.setPropertyValue('space', value);
    }
    public getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WColumnFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueColumnFormat) && this.uniqueColumnFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueColumnFormat.propertiesHash.get(propertyType);
            }
        }
        return WColumnFormat.getPropertyDefaultValue(property);
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
            case 'width':
                value = 36;
                break;
            case 'space':
                value = 0;
                break;
        }
        return value;
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WColumnFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueColumnFormat)) {
            this.initializeUniqueColumnFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueColumnFormat.uniqueFormatType, property);
            if (this.uniqueColumnFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueColumnFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueColumnFormat = WColumnFormat.uniqueColumnFormats.updateUniqueFormat(this.uniqueColumnFormat, property, value);
        }
    }
    private initializeUniqueColumnFormat(property: string, propValue: Object): void {
        const uniqueColumnFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueColumnFormat('width', property, propValue, uniqueColumnFormatTemp);
        this.addUniqueColumnFormat('space', property, propValue, uniqueColumnFormatTemp);
        this.uniqueColumnFormat = WColumnFormat.uniqueColumnFormats.addUniqueFormat(uniqueColumnFormatTemp, WColumnFormat.uniqueFormatType);
    }
    private addUniqueColumnFormat(property: string, modifiedProperty: string, propValue: Object, uniqueColumnFormatTemp: Dictionary<number, object>): void {
        const propertyType: number = WUniqueFormat.getPropertyType(WColumnFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueColumnFormatTemp.add(propertyType, propValue);
        } else {
            uniqueColumnFormatTemp.add(propertyType, WColumnFormat.getPropertyDefaultValue(property));
        }
    }
    public updateUniqueColumnFormat(format: WColumnFormat): void {
        let hash: Dictionary<number, object> = undefined;
        if (this.uniqueColumnFormat) {
            hash = this.uniqueColumnFormat.mergeProperties(format.uniqueColumnFormat);
            if (this.uniqueColumnFormat.referenceCount === 0) {
                WColumnFormat.uniqueColumnFormats.remove(this.uniqueColumnFormat);
                this.uniqueColumnFormat = undefined;
            }
        }
        this.uniqueColumnFormat = new WUniqueFormat(WColumnFormat.uniqueFormatType);
        if (isNullOrUndefined(hash)) {
            hash = this.uniqueColumnFormat.mergeProperties(format.uniqueColumnFormat);
        }
        this.uniqueColumnFormat = WColumnFormat.uniqueColumnFormats.addUniqueFormat(hash, WColumnFormat.uniqueFormatType);
    }
    public cloneFormat(): WColumnFormat {
        const colFormat: WColumnFormat = new WColumnFormat(undefined);
        colFormat.width = this.width;
        colFormat.space = this.space;
        return colFormat;
    }
    public copyFormat(colFormat: WColumnFormat): void {
        if (!isNullOrUndefined(colFormat) && !isNullOrUndefined(colFormat.uniqueColumnFormat)) {
            this.width = colFormat.width;
            this.space = colFormat.space;
        }
    }
    public static clear(): void {
        this.uniqueColumnFormats.clear();
    }
}
