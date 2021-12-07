import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { HeightType, WidthType } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WBorders } from './borders';
import { TableRowWidget } from '../viewer/page';
import { Revision } from '../track-changes/track-changes';
/* eslint-disable */
/**
 * @private
 */
export class WRowFormat {
    private uniqueRowFormat: WUniqueFormat = undefined;
    private static uniqueRowFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 6;

    /**
     * @private
     */
    public borders: WBorders = new WBorders(this);
    /**
     * @private
     */
    public ownerBase: TableRowWidget = undefined;
    /**
     * @private
     */
    public beforeWidth: number = 0;
    /**
     * @private
     */
    public afterWidth: number = 0;
    /**
     * @private
     */
    public revisions: Revision[] = [];
    /**
     * @private
     */
    public removedIds: string[] = [];

    public get gridBefore(): number {
        return this.getPropertyValue('gridBefore') as number;
    }
    public set gridBefore(value: number) {
        this.setPropertyValue('gridBefore', value);
    }
    public get gridBeforeWidth(): number {
        return this.getPropertyValue('gridBeforeWidth') as number;
    }
    public set gridBeforeWidth(value: number) {
        this.setPropertyValue('gridBeforeWidth', value);
    }
    public get gridBeforeWidthType(): WidthType {
        return this.getPropertyValue('gridBeforeWidthType') as WidthType;
    }
    public set gridBeforeWidthType(value: WidthType) {
        this.setPropertyValue('gridBeforeWidthType', value);
    }
    public get gridAfter(): number {
        return this.getPropertyValue('gridAfter') as number;
    }
    public set gridAfter(value: number) {
        this.setPropertyValue('gridAfter', value);
    }
    public get gridAfterWidth(): number {
        return this.getPropertyValue('gridAfterWidth') as number;
    }
    public set gridAfterWidth(value: number) {
        this.setPropertyValue('gridAfterWidth', value);
    }
    public get gridAfterWidthType(): WidthType {
        return this.getPropertyValue('gridAfterWidthType') as WidthType;
    }
    public set gridAfterWidthType(value: WidthType) {
        this.setPropertyValue('gridAfterWidthType', value);
    }
    public get allowBreakAcrossPages(): boolean {
        return this.getPropertyValue('allowBreakAcrossPages') as boolean;
    }
    public set allowBreakAcrossPages(value: boolean) {
        this.setPropertyValue('allowBreakAcrossPages', value);
    }
    public get isHeader(): boolean {
        return this.getPropertyValue('isHeader') as boolean;
    }
    public set isHeader(value: boolean) {
        this.setPropertyValue('isHeader', value);
    }
    public get rightMargin(): number {
        return this.getPropertyValue('rightMargin') as number;
    }
    public set rightMargin(value: number) {
        this.setPropertyValue('rightMargin', value);
    }
    public get height(): number {
        return this.getPropertyValue('height') as number;
    }
    public set height(value: number) {
        if (value === 0 && (this.heightType === 'AtLeast' || this.heightType === 'Exactly')) {
            value = 1;
        } else if (this.heightType === 'Auto') {
            value = 0;
        }
        this.setPropertyValue('height', value);
    }
    public get heightType(): HeightType {
        return this.getPropertyValue('heightType') as HeightType;
    }
    public set heightType(value: HeightType) {
        if (value === 'AtLeast' || value === 'Exactly') {
            this.height = 1;
        } else {
            this.height = 0;
        }
        this.setPropertyValue('heightType', value);
    }
    public get bottomMargin(): number {
        return this.getPropertyValue('bottomMargin') as number;
    }
    public set bottomMargin(value: number) {
        this.setPropertyValue('bottomMargin', value);
    }
    public get leftIndent(): number {
        return this.getPropertyValue('leftIndent') as number;
    }
    public set leftIndent(value: number) {
        this.setPropertyValue('leftIndent', value);
    }
    public get topMargin(): number {
        return this.getPropertyValue('topMargin') as number;
    }
    public set topMargin(value: number) {
        this.setPropertyValue('topMargin', value);
    }
    public get leftMargin(): number {
        return this.getPropertyValue('leftMargin') as number;
    }
    public set leftMargin(value: number) {
        this.setPropertyValue('leftMargin', value);
    }
    public constructor(node?: TableRowWidget) {
        this.ownerBase = node;
    }
    public getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WRowFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueRowFormat) && this.uniqueRowFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueRowFormat.propertiesHash.get(propertyType);
            }
        }
        return WRowFormat.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WRowFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueRowFormat)) {
            this.initializeUniqueRowFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueRowFormat.uniqueFormatType, property);
            if (this.uniqueRowFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueRowFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueRowFormat = WRowFormat.uniqueRowFormats.updateUniqueFormat(this.uniqueRowFormat, property, value);
        }
    }
    private initializeUniqueRowFormat(property: string, propValue: Object): void {
        const uniqueRowFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueRowFormat('allowBreakAcrossPages', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('isHeader', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('height', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('heightType', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridBefore', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridBeforeWidth', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridBeforeWidthType', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridAfter', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridAfterWidth', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridgridAfterWidth', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('gridBeforeWidthType', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('leftMargin', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('rightMargin', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('topMargin', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('bottomMargin', property, propValue, uniqueRowFormatTemp);
        this.addUniqueRowFormat('leftIndent', property, propValue, uniqueRowFormatTemp);
        this.uniqueRowFormat = WRowFormat.uniqueRowFormats.addUniqueFormat(uniqueRowFormatTemp, WRowFormat.uniqueFormatType);
    }

    private addUniqueRowFormat(property: string, modifiedProperty: string, propValue: Object, uniqueRowFormatTemp: Dictionary<number, object>): void {
        const propertyType = WUniqueFormat.getPropertyType(WRowFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueRowFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
        case 'allowBreakAcrossPages':
            value = true;
            break;
        case 'isHeader':
            value = false;
            break;
        case 'height':
            value = 0;
            break;
        case 'heightType':
            value = 'Auto';
            break;
        case 'gridBefore':
            value = 0;
            break;
        case 'gridBeforeWidth':
            value = 0;
            break;
        case 'gridBeforeWidthType':
            value = 'Point';
            break;
        case 'gridAfter':
            value = 0;
            break;
        case 'gridAfterWidth':
            value = 0;
            break;
        case 'gridAfterWidthType':
            value = 'Point';
            break;
        case 'leftMargin':
            value = undefined;
            break;
        case 'topMargin':
            value = undefined;
            break;
        case 'bottomMargin':
            value = undefined;
            break;
        case 'rightMargin':
            value = undefined;
            break;
        case 'leftIndent':
            value = 0;
            break;
        }
        return value;
    }

    public containsMargins(): boolean {
        return (!isNullOrUndefined(this.leftMargin)
            || !isNullOrUndefined(this.rightMargin)
            || !isNullOrUndefined(this.bottomMargin)
            || !isNullOrUndefined(this.topMargin));
    }
    public cloneFormat(): WRowFormat {
        const format: WRowFormat = new WRowFormat();
        format.allowBreakAcrossPages = this.allowBreakAcrossPages;
        format.heightType = this.heightType;
        format.height = this.height;
        format.isHeader = this.isHeader;
        format.gridBefore = this.gridBefore;
        format.gridBeforeWidth = this.gridBeforeWidth;
        format.gridBeforeWidthType = this.gridBeforeWidthType;
        format.gridAfter = this.gridAfter;
        format.gridAfterWidth = this.gridAfterWidth;
        format.gridAfterWidthType = this.gridAfterWidthType;
        format.leftMargin = this.leftMargin;
        format.rightMargin = this.rightMargin;
        format.topMargin = this.topMargin;
        format.bottomMargin = this.bottomMargin;
        format.leftIndent = this.leftIndent;
        if (this.revisions.length > 0) {
            format.removedIds = Revision.cloneRevisions(this.revisions);
        } else {
            format.removedIds = this.removedIds.slice();
        }
        return format;
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueRowFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueRowFormat.uniqueFormatType, property);
            return this.uniqueRowFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public copyFormat(format: WRowFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueRowFormat)) {
                this.allowBreakAcrossPages = format.allowBreakAcrossPages;
                this.isHeader = format.isHeader;
                this.heightType = format.heightType;
                this.height = format.height;
                this.gridBefore = format.gridBefore;
                this.gridBeforeWidth = format.gridBeforeWidth;
                this.gridBeforeWidthType = format.gridBeforeWidthType;
                this.gridAfter = format.gridAfter;
                this.gridAfterWidth = format.gridAfterWidth;
                this.gridAfterWidthType = format.gridAfterWidthType;
                this.leftMargin = format.leftMargin;
                this.topMargin = format.topMargin;
                this.rightMargin = format.rightMargin;
                this.bottomMargin = format.bottomMargin;
                this.leftIndent = format.leftIndent;
            }
            if (!isNullOrUndefined(format.borders)) {
                this.borders = new WBorders(this);
                this.borders.ownerBase = format as WRowFormat;
                (this.borders as WBorders).copyFormat(format.borders);
            }
            if (format.revisions.length > 0) {
                this.removedIds = Revision.cloneRevisions(format.revisions);
            } else {
                this.removedIds = format.removedIds.slice();
            }
        }
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.borders)) {
            this.borders.destroy();
        }
        if (!isNullOrUndefined(this.uniqueRowFormat)) {
            WRowFormat.uniqueRowFormats.remove(this.uniqueRowFormat);
        }
        this.beforeWidth = undefined;
        this.afterWidth = undefined;
        this.borders = undefined;
        this.uniqueRowFormat = undefined;
    }
    public static clear(): void {
        this.uniqueRowFormats.clear();
    }
}
