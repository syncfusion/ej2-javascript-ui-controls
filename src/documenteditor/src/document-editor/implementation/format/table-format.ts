import { Dictionary } from '../../base/dictionary';
import { TableAlignment, WidthType, HorizontalAlignment } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WBorders } from './borders';
import { WShading } from './shading';
import { TableWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * @private
 */
export class WTableFormat {
    private uniqueTableFormat: WUniqueFormat = undefined;
    private static uniqueTableFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 8;
    public borders: WBorders = new WBorders(this);
    public shading: WShading = new WShading(this);
    public ownerBase: TableWidget = undefined;

    public get allowAutoFit(): boolean {
        return this.getPropertyValue('allowAutoFit') as boolean;
    }
    public set allowAutoFit(value: boolean) {
        this.setPropertyValue('allowAutoFit', value);
    }
    public get cellSpacing(): number {
        return this.getPropertyValue('cellSpacing') as number;
    }
    public set cellSpacing(value: number) {
        if (value < 0 || value > 264.6) {
            throw new RangeError('The measurement must be between 0 px and 264.6 px.');
        }
        this.setPropertyValue('cellSpacing', value);
    }
    public get leftMargin(): number {
        return this.getPropertyValue('leftMargin') as number;
    }
    public set leftMargin(value: number) {
        this.setPropertyValue('leftMargin', value);
    }
    public get topMargin(): number {
        return this.getPropertyValue('topMargin') as number;
    }
    public set topMargin(value: number) {
        this.setPropertyValue('topMargin', value);
    }
    public get rightMargin(): number {
        return this.getPropertyValue('rightMargin') as number;
    }
    public set rightMargin(value: number) {
        this.setPropertyValue('rightMargin', value);
    }
    public get bottomMargin(): number {
        return this.getPropertyValue('bottomMargin') as number;
    }
    public set bottomMargin(value: number) {
        this.setPropertyValue('bottomMargin', value);
    }
    public get tableAlignment(): TableAlignment {
        return this.getPropertyValue('tableAlignment') as TableAlignment;
    }
    public set tableAlignment(value: TableAlignment) {
        this.setPropertyValue('tableAlignment', value);
    }
    public get leftIndent(): number {
        return this.getPropertyValue('leftIndent') as number;
    }
    public set leftIndent(value: number) {
        if (value < -1440 || value > 1440) {
            throw new RangeError('The measurement must be between -1440 px and 1440 px.');
        }
        this.setPropertyValue('leftIndent', value);
    }
    public get preferredWidth(): number {
        return this.getPropertyValue('preferredWidth') as number;
    }
    public set preferredWidth(value: number) {
        this.setPropertyValue('preferredWidth', value);
    }
    public get preferredWidthType(): WidthType {
        return this.getPropertyValue('preferredWidthType') as WidthType;
    }
    public set preferredWidthType(value: WidthType) {
        this.setPropertyValue('preferredWidthType', value);
    }

    public get bidi(): boolean {
        return this.getPropertyValue('bidi') as boolean;
    }

    public set bidi(value: boolean) {
        this.setPropertyValue('bidi', value);
    }
    public get horizontalPositionAbs(): HorizontalAlignment {
        return this.getPropertyValue('horizontalPositionAbs') as HorizontalAlignment;
    }
    public set horizontalPositionAbs(value: HorizontalAlignment) {
        this.setPropertyValue('horizontalPositionAbs', value);
    }
    public get horizontalPosition(): number {
        return this.getPropertyValue('horizontalPosition') as number;
    }
    public set horizontalPosition(value: number) {
        this.setPropertyValue('horizontalPosition', value);
    }
    public constructor(owner?: TableWidget) {
        this.ownerBase = owner;
        this.assignTableMarginValue(5.4, 0, 5.4, 0);
    }
    /* eslint-disable */
    public getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WTableFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueTableFormat) && this.uniqueTableFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueTableFormat.propertiesHash.get(propertyType);
            }
        }
        return WTableFormat.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WTableFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueTableFormat)) {
            this.initializeUniqueTableFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueTableFormat.uniqueFormatType, property);
            if (this.uniqueTableFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueTableFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueTableFormat = WTableFormat.uniqueTableFormats.updateUniqueFormat(this.uniqueTableFormat, property, value);
        }
    }
    private initializeUniqueTableFormat(property: string, propValue: Object): void {
        const uniqueTableFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueTableFormat('allowAutoFit', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('cellSpacing', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('leftMargin', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('topMargin', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('bottomMargin', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('rightMargin', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('leftIndent', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('tableAlignment', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('preferredWidth', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('preferredWidthType', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('bidi', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('horizontalPositionAbs', property, propValue, uniqueTableFormatTemp);
        this.addUniqueTableFormat('horizontalPosition', property, propValue, uniqueTableFormatTemp);
        this.uniqueTableFormat = WTableFormat.uniqueTableFormats.addUniqueFormat(uniqueTableFormatTemp, WTableFormat.uniqueFormatType);
    }

    private addUniqueTableFormat(property: string, modifiedProperty: string, propValue: Object, uniqueTableFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WTableFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueTableFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
        case 'allowAutoFit':
            value = false;
            break;
        case 'cellSpacing':
            value = 0;
            break;
        case 'leftMargin':
            value = 5.4;
            break;
        case 'topMargin':
            value = 0;
            break;
        case 'bottomMargin':
            value = 0;
            break;
        case 'rightMargin':
            value = 5.4;
            break;
        case 'leftIndent':
            value = 0;
            break;
        case 'tableAlignment':
            value = 'Left';
            break;
        case 'preferredWidth':
            value = 0;
            break;
        case 'preferredWidthType':
            value = 'Point';
            break;
        case 'bidi':
            value = false;
            break;
        case 'horizontalPositionAbs':
            value = null;
            break;
        case 'horizontalPosition':
            value = 0;
            break;
        }
        return value;
    }

    private assignTableMarginValue(left: number, top: number, right: number, bottom: number): void {
        this.leftMargin = left;
        this.topMargin = top;
        this.rightMargin = right;
        this.bottomMargin = bottom;
    }
    public initializeTableBorders(): void {
        this.borders.left.lineStyle = 'Single';
        this.borders.left.lineWidth = 0.5;
        this.borders.right.lineStyle = 'Single';
        this.borders.right.lineWidth = 0.5;
        this.borders.top.lineStyle = 'Single';
        this.borders.top.lineWidth = 0.5;
        this.borders.bottom.lineStyle = 'Single';
        this.borders.bottom.lineWidth = 0.5;
        this.borders.horizontal.lineStyle = 'Single';
        this.borders.horizontal.lineWidth = 0.5;
        this.borders.vertical.lineStyle = 'Single';
        this.borders.vertical.lineWidth = 0.5;
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.borders)) {
            this.borders.destroy();
        }
        if (!isNullOrUndefined(this.shading)) {
            this.shading.destroy();
        }
        if (!isNullOrUndefined(this.uniqueTableFormat)) {
            WTableFormat.uniqueTableFormats.remove(this.uniqueTableFormat);
        }
        this.uniqueTableFormat = undefined;
        this.borders = undefined;
        this.shading = undefined;
    }
    public cloneFormat(): WTableFormat {
        const tableFormat: WTableFormat = new WTableFormat(undefined);
        tableFormat.leftIndent = this.leftIndent;
        tableFormat.tableAlignment = this.tableAlignment;
        tableFormat.cellSpacing = this.cellSpacing;
        tableFormat.leftMargin = this.leftMargin;
        tableFormat.rightMargin = this.rightMargin;
        tableFormat.topMargin = this.topMargin;
        tableFormat.bottomMargin = this.bottomMargin;
        tableFormat.preferredWidth = this.preferredWidth;
        tableFormat.preferredWidthType = this.preferredWidthType;
        tableFormat.horizontalPositionAbs = this.horizontalPositionAbs;
        tableFormat.horizontalPosition = this.horizontalPosition;
        tableFormat.borders = isNullOrUndefined(this.borders) ? undefined : this.borders.cloneFormat();
        tableFormat.shading = isNullOrUndefined(this.shading) ? undefined : this.shading.cloneFormat();
        tableFormat.bidi = this.bidi;
        tableFormat.allowAutoFit = this.allowAutoFit;
        return tableFormat;
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueTableFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueTableFormat.uniqueFormatType, property);
            return this.uniqueTableFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public copyFormat(format: WTableFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueTableFormat)) {
                this.cellSpacing = format.cellSpacing;
                this.leftMargin = format.leftMargin;
                this.topMargin = format.topMargin;
                this.rightMargin = format.rightMargin;
                this.bottomMargin = format.bottomMargin;
                this.leftIndent = format.leftIndent;
                this.tableAlignment = format.tableAlignment;
                this.preferredWidth = format.preferredWidth;
                this.preferredWidthType = format.preferredWidthType;
                this.bidi = format.bidi;
                this.allowAutoFit = format.allowAutoFit;
                this.horizontalPosition = format.horizontalPosition;
                this.horizontalPositionAbs = format.horizontalPositionAbs;
            }
            if (!isNullOrUndefined(format.borders)) {
                this.borders = new WBorders(this);
                (this.borders as WBorders).copyFormat(format.borders);
            }
            if (!isNullOrUndefined(format.shading)) {
                this.shading = new WShading(this);
                (this.shading as WShading).copyFormat(format.shading);
            }
        }
    }
    public static clear(): void {
        this.uniqueTableFormats.clear();
    }
}
