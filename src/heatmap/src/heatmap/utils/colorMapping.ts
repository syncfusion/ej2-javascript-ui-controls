import { Property, extend, ChildProperty, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { PaletteType } from '../utils/enum';
import { ColorCollection, LegendColorCollection, PaletteCollection } from '../model/base';
import { PaletteCollectionModel } from '../model/base-model';
import { PaletterColor } from './helper';

/**
 * Configures the color property in Heatmap.
 */
export class PaletteSettings extends ChildProperty<PaletteSettings> {

    /**
     * Specifies the color collection for heat map cell. 
     * @default ''
     */
    @Collection<PaletteCollectionModel>([{}], PaletteCollection)
    public palette: PaletteCollectionModel[];

    /**
     * Specifies the color style
     * * Gradient - Render a HeatMap cells with linear gradient color.
     * * Fixed - Render a HeatMap cells with fixed color.
     * @default 'Gradient'
     */
    @Property('Gradient')
    public type: PaletteType;

    /**
     * Specifies the color for empty points in Heatmap.
     * @default ''
     */
    @Property('')
    public emptyPointColor: string;
}
/**
 * Helper class for colormapping
 */
export class RgbColor {
    public R: number;
    public G: number;
    public B: number;
    constructor(r: number, g: number, b: number) {
        this.R = r;
        this.G = g;
        this.B = b;
    }
}

export class CellColor {
    public heatMap: HeatMap;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
    }

    /**
     * To convert hexa color to RGB.
     * @return {RGB}
     * @private
     */
    public convertToRGB(value: number, colorMapping: ColorCollection[]): RgbColor {
        let previousOffset: number = colorMapping[0].value;
        let nextOffset: number = 0;
        for (let i: number = 1; i < colorMapping.length; i++) {
            let offset: number = Number(colorMapping[i].value);
            if (value <= offset) {
                nextOffset = offset;
                break;
            } else {
                nextOffset = offset;
                previousOffset = offset;
            }
        }
        let percent: number = 0;
        let full: number = nextOffset - previousOffset;
        percent = (value - previousOffset) / full;
        let previousColor: string = this.getEqualColor(colorMapping, previousOffset);
        let nextColor: string = this.getEqualColor(colorMapping, nextOffset);
        return this.getPercentageColor(percent, previousColor, nextColor);
    }

    /**
     * To convert RGB to HEX.
     * @return {string}
     * @private
     */
    public rgbToHex(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /**
     * To convert Component to HEX.
     * @return {string}
     * @private
     */
    protected componentToHex(c: number): string {
        let hex: string = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    /**
     * To get similar color.
     * @return {string}
     * @private
     */
    protected getEqualColor(list: ColorCollection[], offset: number): string {
        for (let i: number = 0; i < list.length; i++) {
            if (Number(list[i].value) === offset) {
                let color: string = list[i].color;
                if (color.indexOf('rgb') !== -1) {
                    color = this.convertToHex(color);
                } else if (color.indexOf('#') === -1) {
                    color = '#FFFFFF';
                }
                return color;
            }
        }
        return '#00000';
    }

    /**
     * To convert RGB to HEX.
     * @return {string}
     * @private
     */
    protected convertToHex(color: string): string {
        let itemColor: string = color.substr(3);
        itemColor = itemColor.split('(')[1].split(')')[0];
        let colorSplit : string[] = itemColor.split(',');
        itemColor = this.rgbToHex(parseInt(colorSplit[0], 10), parseInt(colorSplit[1], 10), parseInt(colorSplit[2], 10));
        return itemColor;
    }

    /**
     * To get RGB for percentage value.
     * @return {RGB}
     * @private
     */
    protected getPercentageColor(percent: number, previous: string, next: string): RgbColor {
        let nextColor: string = next.split('#')[1];
        let prevColor: string = previous.split('#')[1];
        let r: number = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        let g: number = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        let b: number = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new RgbColor(r, g, b);
    }

    /**
     * To convert numbet to percentage.
     * @return {RGB}
     * @private
     */
    protected getPercentage(percent: number, previous: number, next: number): number {
        let full: number = next - previous;
        return Math.round((previous + (full * percent)));
    }

    /**
     * To get complete color Collection.
     * @private
     */
    public getColorCollection(): void {
        let heatMap: HeatMap = this.heatMap;
        heatMap.colorCollection = [];
        heatMap.legendColorCollection = [];
        let range: number;
        let minValue: number = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        let maxValue: number = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        heatMap.emptyPointColor = heatMap.paletteSettings.emptyPointColor ? heatMap.paletteSettings.emptyPointColor :
            heatMap.themeStyle.emptyCellColor;
        let tempcolorMapping: PaletterColor = this.orderbyOffset(
            heatMap.paletteSettings.palette && heatMap.paletteSettings.palette.length > 1 ?
                heatMap.paletteSettings.palette : heatMap.themeStyle.palette);
        if (!tempcolorMapping.isCompact) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length - 1);
            } else {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length);
            }

            if (tempcolorMapping.offsets.length >= 2) {
                for (let index: number = 0; index < tempcolorMapping.offsets.length; index++) {
                    heatMap.colorCollection.push(new ColorCollection(
                        Math.round(((minValue) + (index * range)) * 100) / 100,
                        tempcolorMapping.offsets[index].color,
                        tempcolorMapping.offsets[index].label)
                    );
                    heatMap.legendColorCollection.push(new LegendColorCollection(
                        Math.round(((minValue) + (index * range)) * 100) / 100,
                        tempcolorMapping.offsets[index].color,
                        tempcolorMapping.offsets[index].label,
                        false));
                }
            }
        } else {
            heatMap.colorCollection = <ColorCollection[]>tempcolorMapping.offsets;
            heatMap.legendColorCollection = <LegendColorCollection[]>extend([], tempcolorMapping.offsets, null, true);
        }
        this.updateLegendColorCollection(minValue, maxValue);
    }

    /**
     * To update legend color Collection.
     * @private
     */
    private updateLegendColorCollection(minValue: number, maxValue: number): void {
        if (minValue < this.heatMap.legendColorCollection[0].value) {
            this.heatMap.legendColorCollection.unshift(new LegendColorCollection(
                minValue,
                this.heatMap.legendColorCollection[0].color,
                this.heatMap.legendColorCollection[0].label,
                true));
        }
        if (maxValue > this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].value) {
            this.heatMap.legendColorCollection.push(new LegendColorCollection(
                maxValue,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].color,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].label,
                true));
        }
    }

    /**
     * To get ordered palette color collection.
     * @private
     */
    private orderbyOffset(offsets: PaletteCollectionModel[]): PaletterColor {
        let returnCollection: PaletterColor = new PaletterColor();
        let key: string = 'value';
        returnCollection.isCompact = true;
        // tslint:disable-next-line:no-any 
        returnCollection.offsets = offsets.sort((a: any, b: any) => {
            if (!isNullOrUndefined(a[key]) && !isNullOrUndefined(b[key])) {
                return a[key] - b[key];
            } else {
                returnCollection.isCompact = false;
                return a;
            }
        });
        if (!returnCollection.isCompact) {
            returnCollection.offsets = this.heatMap.paletteSettings.palette && this.heatMap.paletteSettings.palette.length > 1 ?
                this.heatMap.paletteSettings.palette : this.heatMap.themeStyle.palette;
        }
        return returnCollection;
    }

    /**
     * To get color depends to value.
     * @private
     */
    public getColorByValue(text: number) : string {
        let color : string = '';
        let rbg: RgbColor;
        let compareValue : number = 0;
        if (text.toString() !== '') {
            if (this.heatMap.cellSettings.tileType === 'Bubble' &&
                (this.heatMap.cellSettings.bubbleType === 'Size' || this.heatMap.cellSettings.bubbleType === 'Sector')) {
                color = this.heatMap.colorCollection[0].color;
            } else if (this.heatMap.paletteSettings.type === 'Fixed') {
                for (let y: number = 0; y < this.heatMap.colorCollection.length; y++) {
                    compareValue = this.heatMap.colorCollection[y + 1] ? this.heatMap.colorCollection[y + 1].value :
                        this.heatMap.colorCollection[y].value;
                    if (text < compareValue || (text >= compareValue && y === this.heatMap.colorCollection.length - 1)) {
                        color = this.heatMap.colorCollection[y].color;
                        break;
                    }
                }
            } else {
                if (text < this.heatMap.colorCollection[0].value) {
                    color = this.heatMap.colorCollection[0].color;
                } else if (text > this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].value) {
                    color = this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].color;
                } else {
                    rbg = this.convertToRGB(text, this.heatMap.colorCollection);
                    color = this.rgbToHex(rbg.R, rbg.G, rbg.B);
                }
            }
        } else {
            color = this.heatMap.emptyPointColor;
        }
        return color;
    }
}
