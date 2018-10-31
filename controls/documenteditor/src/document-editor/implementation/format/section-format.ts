import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dictionary } from '../../base/dictionary';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { EditorHistory } from '../editor-history/editor-history';

/** 
 * @private
 */
export class WSectionFormat {
    private uniqueSectionFormat: WUniqueFormat = undefined;
    private static uniqueSectionFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 10;
    public ownerBase: Object;

    get headerDistance(): number {
        return this.getPropertyValue('headerDistance') as number;
    }
    set headerDistance(value: number) {
        this.setPropertyValue('headerDistance', value);
    }
    get footerDistance(): number {
        return this.getPropertyValue('footerDistance') as number;
    }
    set footerDistance(value: number) {
        this.setPropertyValue('footerDistance', value);
    }
    get differentFirstPage(): boolean {
        return this.getPropertyValue('differentFirstPage') as boolean;
    }
    set differentFirstPage(value: boolean) {
        this.setPropertyValue('differentFirstPage', value);
    }
    get differentOddAndEvenPages(): boolean {
        return this.getPropertyValue('differentOddAndEvenPages') as boolean;
    }
    set differentOddAndEvenPages(value: boolean) {
        this.setPropertyValue('differentOddAndEvenPages', value);
    }
    get pageHeight(): number {
        return this.getPropertyValue('pageHeight') as number;
    }
    set pageHeight(value: number) {
        this.setPropertyValue('pageHeight', value);
    }
    get rightMargin(): number {
        return this.getPropertyValue('rightMargin') as number;
    }
    set rightMargin(value: number) {
        this.setPropertyValue('rightMargin', value);
    }
    get pageWidth(): number {
        return this.getPropertyValue('pageWidth') as number;
    }
    set pageWidth(value: number) {
        this.setPropertyValue('pageWidth', value);
    }
    get leftMargin(): number {
        return this.getPropertyValue('leftMargin') as number;
    }
    set leftMargin(value: number) {
        this.setPropertyValue('leftMargin', value);
    }
    get bottomMargin(): number {
        return this.getPropertyValue('bottomMargin') as number;
    }
    set bottomMargin(value: number) {
        this.setPropertyValue('bottomMargin', value);
    }
    get topMargin(): number {
        return this.getPropertyValue('topMargin') as number;
    }
    set topMargin(value: number) {
        this.setPropertyValue('topMargin', value);
    }
    constructor(node?: Object) {
        this.ownerBase = node;
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.uniqueSectionFormat)) {
            WSectionFormat.uniqueSectionFormats.remove(this.uniqueSectionFormat);
        }
        this.uniqueSectionFormat = undefined;
    }
    private hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueSectionFormat)) {
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueSectionFormat.uniqueFormatType, property);
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
        }
        return value;
    }
    public getPropertyValue(property: string): Object {
        let hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            let propertyType: number = WUniqueFormat.getPropertyType(WSectionFormat.uniqueFormatType, property);
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
            let propertyType: number = WUniqueFormat.getPropertyType(this.uniqueSectionFormat.uniqueFormatType, property);
            if (this.uniqueSectionFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueSectionFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            // tslint:disable-next-line:max-line-length
            this.uniqueSectionFormat = WSectionFormat.uniqueSectionFormats.updateUniqueFormat(this.uniqueSectionFormat, property, value);
        }
    }
    private initializeUniqueSectionFormat(property: string, propValue: Object): void {
        let uniqueSectionFormatTemp: Dictionary<number, object> = new Dictionary<number, object>();
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
        // tslint:disable-next-line:max-line-length
        this.uniqueSectionFormat = WSectionFormat.uniqueSectionFormats.addUniqueFormat(uniqueSectionFormatTemp, WSectionFormat.uniqueFormatType);
    }
    // tslint:disable-next-line:max-line-length
    private addUniqueSectionFormat(property: string, modifiedProperty: string, propValue: Object, uniqueSectionFormatTemp: Dictionary<number, object>): void {
        let propertyType: number;
        propertyType = WUniqueFormat.getPropertyType(WSectionFormat.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueSectionFormatTemp.add(propertyType, propValue);
        } else {
            uniqueSectionFormatTemp.add(propertyType, WSectionFormat.getPropertyDefaultValue(property));
        }
    }
    public copyFormat(format: WSectionFormat, history?: EditorHistory): void {
        if (history && (history.isUndoing || history.isRedoing)) {
            this.uniqueSectionFormat = format.uniqueSectionFormat;
        } else {
            if (!isNullOrUndefined(format)) {
                if (!isNullOrUndefined(format.uniqueSectionFormat) && format.uniqueSectionFormat.propertiesHash) {
                    this.updateUniqueSectionFormat(format);
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
        let format: WSectionFormat = new WSectionFormat();
        format.uniqueSectionFormat = this.uniqueSectionFormat;
        return format;
    }
    public static clear(): void {
        this.uniqueSectionFormats.clear();
    }
}
