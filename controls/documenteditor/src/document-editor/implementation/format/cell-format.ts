import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { CellVerticalAlignment, WidthType } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WBorders } from './borders';
import { WShading } from './shading';
/* eslint-disable */
/**
 * @private
 */
export class WCellFormat {
    private uniqueCellFormat: WUniqueFormat = undefined;
    private static uniqueCellFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 4;
    public borders: WBorders = new WBorders(this);
    public shading: WShading = new WShading(this);
    public ownerBase: Object;
    public get leftMargin(): number {
        return this.getPropertyValue('leftMargin') as number;
    }
    public set leftMargin(value: number) {
        this.setPropertyValue('leftMargin', value);
    }
    public get rightMargin(): number {
        return this.getPropertyValue('rightMargin') as number;
    }
    public set rightMargin(value: number) {
        this.setPropertyValue('rightMargin', value);
    }
    public get topMargin(): number {
        return this.getPropertyValue('topMargin') as number;
    }
    public set topMargin(value: number) {
        this.setPropertyValue('topMargin', value);
    }
    public get bottomMargin(): number {
        return this.getPropertyValue('bottomMargin') as number;
    }
    public set bottomMargin(value: number) {
        this.setPropertyValue('bottomMargin', value);
    }

    public get cellWidth(): number {
        return this.getPropertyValue('cellWidth') as number;
    }
    public set cellWidth(value: number) {
        this.setPropertyValue('cellWidth', value);
    }
    public get columnSpan(): number {
        return this.getPropertyValue('columnSpan') as number;
    }
    public set columnSpan(value: number) {
        this.setPropertyValue('columnSpan', value);
    }
    public get rowSpan(): number {
        return this.getPropertyValue('rowSpan') as number;
    }
    public set rowSpan(value: number) {
        this.setPropertyValue('rowSpan', value);
    }
    public get preferredWidth(): number {
        return this.getPropertyValue('preferredWidth') as number;
    }
    public set preferredWidth(value: number) {
        this.setPropertyValue('preferredWidth', value);
    }
    public get verticalAlignment(): CellVerticalAlignment {
        return this.getPropertyValue('verticalAlignment') as CellVerticalAlignment;
    }
    public set verticalAlignment(value: CellVerticalAlignment) {
        this.setPropertyValue('verticalAlignment', value);
    }
    public get preferredWidthType(): WidthType {
        return this.getPropertyValue('preferredWidthType') as WidthType;
    }
    public set preferredWidthType(value: WidthType) {
        this.setPropertyValue('preferredWidthType', value);
    }

    public constructor(node?: Object) {
        this.ownerBase = node;
        this.borders = new WBorders(this);
        this.shading = new WShading(this);
    }
    public getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WCellFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueCellFormat) && this.uniqueCellFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueCellFormat.propertiesHash.get(propertyType);
            }
        }
        return WCellFormat.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WCellFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueCellFormat)) {
            this.initializeUniqueCellFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCellFormat.uniqueFormatType, property);
            if (this.uniqueCellFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueCellFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueCellFormat = WCellFormat.uniqueCellFormats.updateUniqueFormat(this.uniqueCellFormat, property, value);
        }
    }
    private initializeUniqueCellFormat(property: string, propValue: Object): void {
        const uniqueCellFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueCellFormat('leftMargin', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('topMargin', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('bottomMargin', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('rightMargin', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('cellWidth', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('columnSpan', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('rowSpan', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('preferredWidth', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('verticalAlignment', property, propValue, uniqueCellFormatTemp);
        this.addUniqueCellFormat('preferredWidthType', property, propValue, uniqueCellFormatTemp);
        this.uniqueCellFormat = WCellFormat.uniqueCellFormats.addUniqueFormat(uniqueCellFormatTemp, WCellFormat.uniqueFormatType);
    }

    private addUniqueCellFormat(property: string, modifiedProperty: string, propValue: Object, uniqueCellFormatTemp: Dictionary<number, object>): void {
        const propertyType: number = WUniqueFormat.getPropertyType(WCellFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueCellFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
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
        case 'cellWidth':
            value = 0;
            break;
        case 'columnSpan':
            value = 1;
            break;
        case 'rowSpan':
            value = 1;
            break;
        case 'preferredWidth':
            value = 0;
            break;
        case 'verticalAlignment':
            value = 'Top';
            break;
        case 'preferredWidthType':
            value = 'Point';
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
    public destroy(): void {
        if (!isNullOrUndefined(this.borders)) {
            this.borders.destroy();
        }
        if (!isNullOrUndefined(this.shading)) {
            this.shading.destroy();
        }
        if (!isNullOrUndefined(this.uniqueCellFormat)) {
            WCellFormat.uniqueCellFormats.remove(this.uniqueCellFormat);
        }
        this.uniqueCellFormat = undefined;
        this.borders = undefined;
        this.shading = undefined;
    }
    public cloneFormat(): WCellFormat {
        const format: WCellFormat = new WCellFormat(undefined);
        format.verticalAlignment = this.verticalAlignment;
        format.leftMargin = this.leftMargin;
        format.rightMargin = this.rightMargin;
        format.topMargin = this.topMargin;
        format.bottomMargin = this.bottomMargin;
        format.preferredWidth = this.preferredWidth;
        format.preferredWidthType = this.preferredWidthType;
        format.cellWidth = this.cellWidth;
        format.borders = isNullOrUndefined(this.borders) ? undefined : this.borders.cloneFormat();
        format.shading = isNullOrUndefined(this.shading) ? undefined : this.shading.cloneFormat();
        return format;
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueCellFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueCellFormat.uniqueFormatType, property);
            return this.uniqueCellFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public copyFormat(format: WCellFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueCellFormat)) {
                this.cellWidth = format.cellWidth;
                this.leftMargin = format.leftMargin;
                this.topMargin = format.topMargin;
                this.rightMargin = format.rightMargin;
                this.bottomMargin = format.bottomMargin;
                this.preferredWidth = format.preferredWidth;
                this.columnSpan = format.columnSpan;
                this.rowSpan = format.rowSpan;
                this.preferredWidthType = format.preferredWidthType;
                this.verticalAlignment = format.verticalAlignment;
            }
            if (!isNullOrUndefined(format.shading)) {
                this.shading = new WShading(this);
                this.shading.copyFormat(format.shading);
            }
            if (!isNullOrUndefined(format.borders)) {
                this.borders = new WBorders(this);
                this.borders.copyFormat(format.borders);
            }
        }
    }
    public static clear(): void {
        this.uniqueCellFormats.clear();
    }
}
