import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WStyle, WParagraphStyle } from './style';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';
/* eslint-disable */
/**
 * @private
 */
export class WListFormat {
    private uniqueListFormat: WUniqueFormat = undefined;
    private static uniqueListFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 7;
    public ownerBase: Object = undefined;
    public baseStyle: WStyle = undefined;
    public list: WList = undefined;
    public get listId(): number {
        return this.getPropertyValue('listId') as number;
    }
    public set listId(listId: number) {
        this.setPropertyValue('listId', listId);
    }
    public get listLevelNumber(): number {
        return this.getPropertyValue('listLevelNumber') as number;
    }
    public set listLevelNumber(value: number) {
        this.setPropertyValue('listLevelNumber', value);
    }
    public get listLevel(): WListLevel {
        let list: WList = undefined;
        if (!isNullOrUndefined(this.list)) {
            list = this.list;
        } else {
            let baseListStyle: any = this.baseStyle;
            while (!isNullOrUndefined(baseListStyle)) {
                if (baseListStyle.paragraphFormat.listFormat.list) {
                    list = baseListStyle.paragraphFormat.listFormat.list;
                    break;
                } else {
                    baseListStyle = baseListStyle.basedOn;
                }
            }
        }
        if (!isNullOrUndefined(list)) {
            return list.getListLevel(this.listLevelNumber);
        } else {
            return undefined;
        }
    }
    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    private getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            if (this.baseStyle instanceof WParagraphStyle) {
                let baseStyle: any = this.baseStyle;
                while (!isNullOrUndefined(baseStyle)) {
                    if (baseStyle.paragraphFormat.listFormat.hasValue(property)) {
                        break;
                    } else {
                        baseStyle = baseStyle.basedOn;
                    }
                }
                if (!isNullOrUndefined(baseStyle)) {
                    const propertyType: number = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
                    return baseStyle.paragraphFormat.listFormat.uniqueListFormat.propertiesHash.get(propertyType);
                }
            }
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueListFormat) && this.uniqueListFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueListFormat.propertiesHash.get(propertyType);
            }
        }
        return WListFormat.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WListFormat.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueListFormat)) {
            this.initializeUniqueListFormat(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueListFormat.uniqueFormatType, property);
            if (this.uniqueListFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueListFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueListFormat = WListFormat.uniqueListFormats.updateUniqueFormat(this.uniqueListFormat, property, value);
        }
    }
    private initializeUniqueListFormat(property: string, propValue: Object): void {
        const uniqueListFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueListFormat('listId', property, propValue, uniqueListFormatTemp);
        this.addUniqueListFormat('listLevelNumber', property, propValue, uniqueListFormatTemp);
        this.uniqueListFormat = WListFormat.uniqueListFormats.addUniqueFormat(uniqueListFormatTemp, WListFormat.uniqueFormatType);
    }

    private addUniqueListFormat(property: string, modifiedProperty: string, propValue: Object, uniqueListFormatTemp: Dictionary<number, object>): void {
        const propertyType: number = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueListFormatTemp.add(propertyType, propValue);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
        case 'listId':
            value = -1;
            break;
        case 'listLevelNumber':
            value = 0;
            break;
        }
        return value;
    }
    public copyFormat(format: WListFormat): void {
        if (!isNullOrUndefined(format)) {
            if (!isNullOrUndefined(format.uniqueListFormat)) {
                this.listId = format.listId;
                this.listLevelNumber = format.listLevelNumber;
            }
            if (!isNullOrUndefined(format.baseStyle)) {
                this.baseStyle = format.baseStyle;
            }
            if (!isNullOrUndefined(format.list)) {
                this.list = format.list;
            }
        }
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueListFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueListFormat.uniqueFormatType, property);
            return this.uniqueListFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public clearFormat(): void {
        if (!isNullOrUndefined(this.uniqueListFormat) && this.uniqueListFormat.referenceCount === 0) {
            WListFormat.uniqueListFormats.remove(this.uniqueListFormat);
        }
        this.uniqueListFormat = undefined;
        this.list = undefined;
    }
    public destroy(): void {
        this.clearFormat();
    }
    public static clear(): void {
        this.uniqueListFormats.clear();
    }
    public applyStyle(baseStyle: WStyle): void {
        this.baseStyle = baseStyle;
    }

    public getValue(property: string): Object {
        return this.hasValue(property) ? this.getPropertyValue(property) : undefined;
    }
    public mergeFormat(format: WListFormat): void {
        if (isNullOrUndefined(this.getValue('listId'))) {
            this.listId = format.getValue('listId') as number;
        }
        if (isNullOrUndefined(this.getValue('listLevelNumber'))) {
            this.listLevelNumber = format.getValue('listLevelNumber') as number;
        }
        if (!isNullOrUndefined(format.list)) {
            if (isNullOrUndefined(this.list)) {
                this.list = new WList();
            }
            this.list.mergeList(format.list);
        }
    }
    public cloneListFormat(): WListFormat {
        const format: WListFormat = new WListFormat(undefined);
        format.list = this.list;
        format.listId = this.listId;
        format.baseStyle = this.baseStyle;
        format.listLevelNumber = this.listLevelNumber;
        format.uniqueListFormat = this.uniqueListFormat;
        return format;
    }
}
