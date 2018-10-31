import { Maps } from '../../index';
import { ShapeSettingsModel, ColorMappingSettingsModel } from '../index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * ColorMapping class
 */
export class ColorMapping {
    private maps: Maps;
    constructor(maps: Maps) {
        this.maps = maps;
    }
    /**
     * To get color based on shape settings.
     * @private
     */
    public getShapeColorMapping(shapeSettings: ShapeSettingsModel, layerData: object, color: string): string {
        let colorValuePath: string = shapeSettings.colorValuePath ? shapeSettings.colorValuePath : shapeSettings.valuePath;
        let equalValue: string = layerData[colorValuePath];
        let colorValue: number = Number(equalValue);
        let shapeColor: string = this.getColorByValue(shapeSettings.colorMapping, colorValue, equalValue);
        return shapeColor ? shapeColor : color;
    }
    /**
     * To color by value and color mapping
     */
    public getColorByValue(colorMapping: ColorMappingSettingsModel[], colorValue: number, equalValue: string): string {
        if (isNaN(colorValue) && isNullOrUndefined(equalValue)) {
            return null;
        }
        let fill: string = '';
        for (let colorMap of colorMapping) {
            if ((colorMap.from && colorMap.to && (colorValue >= colorMap.from && colorValue <= colorMap.to)) ||
                (colorMap.value === equalValue)) {
                fill = colorMap.color;
            }
        }
        return fill || ((!colorMapping.length) ? equalValue : null);
    }
}