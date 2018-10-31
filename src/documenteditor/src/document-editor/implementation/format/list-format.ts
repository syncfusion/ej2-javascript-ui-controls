import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { WStyle, WParagraphStyle } from './style';
import { WList } from '../list/list';
import { WListLevel } from '../list/list-level';

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
    get listId(): number {
        return this.getPropertyValue('listId') as number;
    }
    set listId(listId: number) {
        this.setPropertyValue('listId', listId);
    }
    get listLevelNumber(): number {
        return this.getPropertyValue('listLevelNumber') as number;
    }
    set listLevelNumber(value: number) {
        this.setPropertyValue('listLevelNumber', value);
    }
    get listLevel(): WListLevel {
        let list: WList = undefined;
        if (!isNullOrUndefined(this.list)) {
            list = this.list;
        } else {
            /* tslint:disable-next-line:no-any */
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
    constructor(node?: Object) {
        this.ownerBase = node;
    }
    private getPropertyValue(property: string): Object {
        if (!this.hasValue(property)) {
            if (this.baseStyle instanceof WParagraphStyle) {
                /* tslint:disable-next-line:no-any */
                let baseStyle: any = this.baseStyle;
                while (!isNullOrUndefined(baseStyle)) {
                    if (baseStyle.paragraphFormat.listFormat.hasValue(property)) {
                        break;
                    } else {
                        baseStyle = baseStyle.basedOn;
                    }
                }
                if (!isNullOrUndefined(baseStyle)) {
                    let propertyType: number = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
                    return baseStyle.paragraphFormat.listFormat.uniqueListFormat.propertiesHash.get(propertyType);
                }
            }
        } else {
            let propertyType: number = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
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
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueListFormat.uniqueFormatType, property);
            if (this.uniqueListFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueListFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueListFormat = WListFormat.uniqueListFormats.updateUniqueFormat(this.uniqueListFormat, property, value);
        }
    }
    private initializeUniqueListFormat(property: string, propValue: Object): void {
        let uniqueListFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueListFormat('listId', property, propValue, uniqueListFormatTemp);
        this.addUniqueListFormat('listLevelNumber', property, propValue, uniqueListFormatTemp);
        this.uniqueListFormat = WListFormat.uniqueListFormats.addUniqueFormat(uniqueListFormatTemp, WListFormat.uniqueFormatType);
    }
    // tslint:disable-next-line:max-line-length
    private addUniqueListFormat(property: string, modifiedProperty: string, propValue: Object, uniqueListFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WListFormat.uniqueFormatType, property);
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
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueListFormat.uniqueFormatType, property);
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
    public ApplyStyle(baseStyle: WStyle): void {
        this.baseStyle = baseStyle;
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
}