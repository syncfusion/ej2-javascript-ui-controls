import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { TextureStyle } from '../../base/types';
import { WUniqueFormat } from '../../base/unique-format';
import { WUniqueFormats } from '../../base/unique-formats';
import { Dictionary } from '../../base/dictionary';
/* eslint-disable */
/**
 * @private
 */
export class WShading {
    private uniqueShadingFormat: WUniqueFormat = undefined;
    private static uniqueShadingFormats: WUniqueFormats = new WUniqueFormats();
    private static uniqueFormatType: number = 5;
    public ownerBase: Object = undefined;

    public get backgroundColor(): string {
        return this.getPropertyValue('backgroundColor') as string;
    }
    public set backgroundColor(value: string) {
        this.setPropertyValue('backgroundColor', value);
    }
    public get foregroundColor(): string {
        return this.getPropertyValue('foregroundColor') as string;
    }
    public set foregroundColor(value: string) {
        this.setPropertyValue('foregroundColor', value);
    }
    public get textureStyle(): TextureStyle {
        return this.getPropertyValue('textureStyle') as TextureStyle;
    }
    public set textureStyle(value: TextureStyle) {
        this.setPropertyValue('textureStyle', value);
    }
    public constructor(node?: Object) {
        this.ownerBase = node;
    }
    private getPropertyValue(property: string): Object {
        const hasValue: boolean = this.hasValue(property);
        if (hasValue) {
            const propertyType: number = WUniqueFormat.getPropertyType(WShading.uniqueFormatType, property);
            if (!isNullOrUndefined(this.uniqueShadingFormat) && this.uniqueShadingFormat.propertiesHash.containsKey(propertyType)) {
                return this.uniqueShadingFormat.propertiesHash.get(propertyType);
            }
        }
        return WShading.getPropertyDefaultValue(property);
    }
    private setPropertyValue(property: string, value: Object): void {
        if (isNullOrUndefined(value) || value === '') {
            value = WShading.getPropertyDefaultValue(property);
        }
        if (isNullOrUndefined(this.uniqueShadingFormat)) {
            this.initializeUniqueShading(property, value);
        } else {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueShadingFormat.uniqueFormatType, property);
            if (this.uniqueShadingFormat.propertiesHash.containsKey(propertyType) &&
                this.uniqueShadingFormat.propertiesHash.get(propertyType) === value) {
                //Do nothing, since no change in property value and return
                return;
            }
            this.uniqueShadingFormat = WShading.uniqueShadingFormats.updateUniqueFormat(this.uniqueShadingFormat, property, value);
        }
    }
    private static getPropertyDefaultValue(property: string): Object {
        let value: Object = undefined;
        switch (property) {
        case 'backgroundColor':
            value = 'empty';
            break;
        case 'foregroundColor':
            value = 'empty';
            break;
        case 'textureStyle':
            value = 'TextureNone';
            break;
        }
        return value;
    }
    private initializeUniqueShading(property: string, propValue: Object): void {
        const uniqueShadingTemp: Dictionary<number, object> = new Dictionary<number, object>();
        this.addUniqueShading('backgroundColor', property, propValue, uniqueShadingTemp);
        this.addUniqueShading('foregroundColor', property, propValue, uniqueShadingTemp);
        this.addUniqueShading('textureStyle', property, propValue, uniqueShadingTemp);
        this.uniqueShadingFormat = WShading.uniqueShadingFormats.addUniqueFormat(uniqueShadingTemp, WShading.uniqueFormatType);
    }

    private addUniqueShading(property: string, modifiedProperty: string, propValue: Object, uniqueShadingTemp: Dictionary<number, object>): void {
        const propertyType: number = WUniqueFormat.getPropertyType(WShading.uniqueFormatType, property);
        if (property === modifiedProperty) {
            uniqueShadingTemp.add(propertyType, propValue);
        } else {
            uniqueShadingTemp.add(propertyType, WShading.getPropertyDefaultValue(property));
        }
    }
    public destroy(): void {
        if (!isNullOrUndefined(this.uniqueShadingFormat)) {
            WShading.uniqueShadingFormats.remove(this.uniqueShadingFormat);
        }
        this.uniqueShadingFormat = undefined;
    }
    public cloneFormat(): WShading {
        const shading: WShading = new WShading(undefined);
        shading.backgroundColor = this.backgroundColor;
        shading.foregroundColor = this.foregroundColor;
        shading.textureStyle = this.textureStyle;
        return shading;
    }
    public copyFormat(shading: WShading): void {
        if (!isNullOrUndefined(shading) && !isNullOrUndefined(shading.uniqueShadingFormat)) {
            this.backgroundColor = shading.backgroundColor;
            this.foregroundColor = shading.foregroundColor;
            this.textureStyle = shading.textureStyle;
        }
    }
    public hasValue(property: string): boolean {
        if (!isNullOrUndefined(this.uniqueShadingFormat)) {
            const propertyType: number = WUniqueFormat.getPropertyType(this.uniqueShadingFormat.uniqueFormatType, property);
            return this.uniqueShadingFormat.propertiesHash.containsKey(propertyType);
        }
        return false;
    }
    public static clear(): void {
        this.uniqueShadingFormats.clear();
    }
}
