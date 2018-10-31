import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { HeightType, WidthType } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WBorders } from './borders';
import { TableRowWidget } from '../viewer/page';
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

    get gridBefore(): number {
        return this.getPropertyValue('gridBefore') as number;
    }
    set gridBefore(value: number) {
        this.setPropertyValue('gridBefore', value);
    }
    get gridBeforeWidth(): number {
        return this.getPropertyValue('gridBeforeWidth') as number;
    }
    set gridBeforeWidth(value: number) {
        this.setPropertyValue('gridBeforeWidth', value);
    }
    get gridBeforeWidthType(): WidthType {
        return this.getPropertyValue('gridBeforeWidthType') as WidthType;
    }
    set gridBeforeWidthType(value: WidthType) {
        this.setPropertyValue('gridBeforeWidthType', value);
    }
    get gridAfter(): number {
        return this.getPropertyValue('gridAfter') as number;
    }
    set gridAfter(value: number) {
        this.setPropertyValue('gridAfter', value);
    }
    get gridAfterWidth(): number {
        return this.getPropertyValue('gridAfterWidth') as number;
    }
    set gridAfterWidth(value: number) {
        this.setPropertyValue('gridAfterWidth', value);
    }
    get gridAfterWidthType(): WidthType {
        return this.getPropertyValue('gridAfterWidthType') as WidthType;
    }
    set gridAfterWidthType(value: WidthType) {
        this.setPropertyValue('gridAfterWidthType', value);
    }
    get allowBreakAcrossPages(): boolean {
        return this.getPropertyValue('allowBreakAcrossPages') as boolean;
    }
    set allowBreakAcrossPages(value: boolean) {
        this.setPropertyValue('allowBreakAcrossPages', value);
    }
    get isHeader(): boolean {
        return this.getPropertyValue('isHeader') as boolean;
    }
    set isHeader(value: boolean) {
        this.setPropertyValue('isHeader', value);
    }
    get height(): number {
        return this.getPropertyValue('height') as number;
    }
    set height(value: number) {
        if (value === 0 && (this.heightType === 'AtLeast' || this.heightType === 'Exactly')) {
            value = 1;
        } else if (this.heightType === 'Auto') {
            value = 0;
        }
        this.setPropertyValue('height', value);
    }
    get heightType(): HeightType {
        return this.getPropertyValue('heightType') as HeightType;
    }
    set heightType(value: HeightType) {
        if (value === 'AtLeast' || value === 'Exactly') {
            this.height = 1;
        } else {
            this.height = 0;
        }
        this.setPropertyValue('heightType', value);
    }
    constructor(node?: TableRowWidget) {
        this.ownerBase = node;
    }
    public getPropertyValue(property: string): Object {
        let hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            let propertyType: number = WUniqueFormat.getPropertyType(WRowFormat.uniqueFormatType, property);
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
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueRowFormat.uniqueFormatType, property);
            if (this.uniqueRowFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueRowFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueRowFormat = WRowFormat.uniqueRowFormats.updateUniqueFormat(this.uniqueRowFormat, property, value);
        }
    }
    private initializeUniqueRowFormat(property: string, propValue: Object): void {
        let uniqueRowFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
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
        this.uniqueRowFormat = WRowFormat.uniqueRowFormats.addUniqueFormat(uniqueRowFormatTemp, WRowFormat.uniqueFormatType);
    }
    // tslint:disable-next-line:max-line-length
    private addUniqueRowFormat(property: string, modifiedProperty: string, propValue: Object, uniqueRowFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WRowFormat.uniqueFormatType, property);
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
        }
        return value;
    }
    public cloneFormat(): WRowFormat {
        let format: WRowFormat = new WRowFormat();
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
        return format;
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueRowFormat)) {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueRowFormat.uniqueFormatType, property);
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
            }
            if (!isNullOrUndefined(format.borders)) {
                this.borders = new WBorders(this);
                this.borders.ownerBase = format as WRowFormat;
                (this.borders as WBorders).copyFormat(format.borders);
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