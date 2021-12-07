import { Property, extend, ChildProperty, Collection, isNullOrUndefined, Complex } from '@syncfusion/ej2-base';
import { HeatMap } from '../heatmap';
import { PaletteType, ColorGradientMode} from '../utils/enum';
import { ColorCollection, LegendColorCollection, PaletteCollection, FillColor } from '../model/base';
import { PaletteCollectionModel, FillColorModel } from '../model/base-model';
import { PaletterColor, LegendRange } from './helper';

/**
 * Configures the color property in Heatmap.
 */
export class PaletteSettings extends ChildProperty<PaletteSettings> {

    /**
     * Specifies the color collection for heat map cell.
     *
     * @default ''
     */
    @Collection<PaletteCollectionModel>([{}], PaletteCollection)
    public palette: PaletteCollectionModel[];

    /**
     * Specifies the color style
     * * Gradient - Render a HeatMap cells with linear gradient color.
     * * Fixed - Render a HeatMap cells with fixed color.
     *
     * @default 'Gradient'
     */
    @Property('Gradient')
    public type: PaletteType;

    /**
     * Specifies the color for empty points in Heatmap.
     *
     * @default ''
     */
    @Property('')
    public emptyPointColor: string;
    /**
     * Specifies the colorGradientMode in Heatmap.
     *
     * @default 'Table'
     */
    @Property('Table')
    public colorGradientMode: ColorGradientMode;

    /**
     * Options to set fill colors.
     */

    @Complex<FillColorModel>({}, FillColor)
    public fillColor: FillColorModel;
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
     *
     * @returns {any}
     * @private
     */

    public convertToRGB(value: number, colorMapping: ColorCollection[]): RgbColor {
        let previousOffset: number = this.heatMap.isColorRange ? colorMapping[0].startValue : colorMapping[0].value;
        let nextOffset: number = 0;
        let i: number = 0;
        let previousColor: string;
        let nextColor: string;
        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
            for (i = 0; i < colorMapping.length; i++) {
                const offset: number = Number(colorMapping[i].endValue);
                if (value <= offset && value >= Number (colorMapping[i].startValue)) {
                    nextOffset = offset;
                    previousColor = this.heatMap.colorCollection[i].minColor;
                    nextColor =  this.heatMap.colorCollection[i].maxColor;
                    break;
                } else if (colorMapping[0].startValue !== this.heatMap.dataSourceMinValue && value < colorMapping[0].startValue) {
                    nextOffset = colorMapping[0].startValue;
                    previousOffset = this.heatMap.dataSourceMinValue;
                    previousColor = this.heatMap.paletteSettings.fillColor.minColor;
                    nextColor = this.heatMap.paletteSettings.fillColor.maxColor;
                    break;
                } else if (value > offset && value <= ( i === (colorMapping.length - 1) ?  this.heatMap.dataSourceMaxValue :
                    colorMapping[ i + 1].startValue) ) {
                    nextOffset =  (i === (colorMapping.length - 1) ) ?  this.heatMap.dataSourceMaxValue : colorMapping[i + 1].startValue;
                    previousOffset = offset;
                    previousColor = this.heatMap.paletteSettings.fillColor.minColor;
                    nextColor = this.heatMap.paletteSettings.fillColor.maxColor;
                    break;
                } else {
                    nextOffset = offset;
                    previousOffset = offset;
                }
            }
        } else {
            for (i = 1; i < colorMapping.length; i++) {
                const offset: number = Number(colorMapping[i].value);
                if (value <= offset) {
                    nextOffset = offset;
                    previousColor = this.getEqualColor(colorMapping, previousOffset);
                    nextColor = this.getEqualColor(colorMapping, nextOffset);
                    break;
                } else {
                    nextOffset = offset;
                    previousOffset = offset;
                }
            }
        }

        let percent: number = 0;
        const full: number = (nextOffset ) - previousOffset;
        percent = (value - previousOffset) / full;
        percent = isNaN(percent) ? 0 : percent;

        return this.getPercentageColor(percent, previousColor, nextColor);
    }

    /**
     * To convert RGB to HEX.
     *
     * @returns {string}
     * @private
     */

    public rgbToHex(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    /**
     * To convert Component to HEX.
     *
     * @returns {string}
     * @private
     */

    protected componentToHex(c: number): string {
        const hex: string = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    /**
     * To get similar color.
     *
     * @returns {string}
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
     *
     * @returns {string}
     * @private
     */

    protected convertToHex(color: string): string {
        let itemColor: string = color.substr(3);
        itemColor = itemColor.split('(')[1].split(')')[0];
        const colorSplit: string[] = itemColor.split(',');
        itemColor = this.rgbToHex(parseInt(colorSplit[0], 10), parseInt(colorSplit[1], 10), parseInt(colorSplit[2], 10));
        return itemColor;
    }

    /**
     * To get RGB for percentage value.
     *
     * @returns {any}
     * @private
     */

    protected getPercentageColor(percent: number, previous: string, next: string): RgbColor {
        const nextColor: string = next.split('#')[1];
        const prevColor: string = previous.split('#')[1];
        const r: number = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        const g: number = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        const b: number = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new RgbColor(r, g, b);
    }

    /**
     * To convert numbet to percentage.
     *
     * @returns {any}
     * @private
     */

    protected getPercentage(percent: number, previous: number, next: number): number {
        const full: number = next - previous;
        return Math.round((previous + (full * percent)));
    }

    /**
     * To get complete color Collection.
     *
     * @private
     */

    public getColorCollection(): void {
        const heatMap: HeatMap = this.heatMap;
        heatMap.colorCollection = [];
        heatMap.legendColorCollection = [];
        let range: number;
        for (let j: number = 0; j < this.heatMap.paletteSettings.palette.length; j++) {
            if (this.heatMap.paletteSettings.palette[j].startValue === null || this.heatMap.paletteSettings.palette[j].endValue === null) {
                this.heatMap.isColorRange = false;
                break;
            } else {
                this.heatMap.isColorRange = true;
            }
        }
        const minValue: number = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        const maxValue: number = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        heatMap.emptyPointColor = heatMap.paletteSettings.emptyPointColor ? heatMap.paletteSettings.emptyPointColor :
            heatMap.themeStyle.emptyCellColor;
        const tempcolorMapping: PaletterColor = this.orderbyOffset(
            this.heatMap.isColorRange ? heatMap.paletteSettings.palette :
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
                        (Math.round(((minValue) + (index * range)) * 100) / 100),
                        tempcolorMapping.offsets[index].color, tempcolorMapping.offsets[index ].label,
                        tempcolorMapping.offsets[index ].startValue, tempcolorMapping.offsets[index].endValue,
                        tempcolorMapping.offsets[index].minColor, tempcolorMapping.offsets[index].maxColor));
                    heatMap.legendColorCollection.push(new LegendColorCollection(
                        Math.round(((minValue) + (index * range)) * 100) / 100, tempcolorMapping.offsets[index].color,
                        tempcolorMapping.offsets[index].label, tempcolorMapping.offsets[index].startValue,
                        tempcolorMapping.offsets[index].endValue,
                        tempcolorMapping.offsets[index].minColor,
                        tempcolorMapping.offsets[index].maxColor, false));
                }
            }
        } else {
            heatMap.colorCollection = <ColorCollection[]>tempcolorMapping.offsets;
            heatMap.legendColorCollection = <LegendColorCollection[]>extend([], tempcolorMapping.offsets, null, true);
        }
        if (!this.heatMap.isColorRange) {
            this.updateLegendColorCollection(minValue, maxValue, tempcolorMapping);
        }
    }

    /**
     * To update legend color Collection.
     *
     * @private
     */

    private updateLegendColorCollection(minValue: number, maxValue: number, tempcolorMapping: PaletterColor ): void {
        if (this.heatMap.paletteSettings.type === 'Fixed' && (tempcolorMapping.isCompact || tempcolorMapping.isLabel)) {
            return;
        }
        if (Math.round(minValue * 100) / 100 < this.heatMap.legendColorCollection[0].value) {
            this.heatMap.legendColorCollection.unshift(new LegendColorCollection(
                Math.round(minValue * 100) / 100,
                this.heatMap.legendColorCollection[0].color,
                this.heatMap.legendColorCollection[0].label,
                this.heatMap.legendColorCollection[0].startValue,
                this.heatMap.legendColorCollection[0].endValue,
                this.heatMap.legendColorCollection[0].minColor,
                this.heatMap.legendColorCollection[0].maxColor,
                true));
        }
        if (Math.round(maxValue * 100) / 100 > this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].value) {
            this.heatMap.legendColorCollection.push(new LegendColorCollection(
                Math.round(maxValue * 100) / 100,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].color,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].label,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].startValue,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].endValue,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].minColor,
                this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].maxColor,
                true));
        }
    }

    /**
     * To get ordered palette color collection.
     *
     * @private
     */

    private orderbyOffset(offsets: PaletteCollectionModel[]): PaletterColor {
        const returnCollection: PaletterColor = new PaletterColor();
        const key: string = this.heatMap.isColorRange ? 'to' : 'value';
        const label: string = 'label';
        returnCollection.isCompact = true;
        returnCollection.isLabel = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        returnCollection.offsets = offsets.sort((a: any, b: any) => {
            if (isNullOrUndefined(a[label]) && isNullOrUndefined(b[label])) {
                returnCollection.isLabel = false;
            }
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
     *
     * @private
     */

    public getColorByValue(text: number) : string {
        let color : string = '';
        let rbg: RgbColor;
        let compareValue : number = 0;
        if (text.toString() !== '') {
            if (this.heatMap.cellSettings.tileType === 'Bubble' &&
                (this.heatMap.cellSettings.bubbleType === 'Size' || this.heatMap.cellSettings.bubbleType === 'Sector')) {
                color = this.heatMap.isColorRange ? this.heatMap.colorCollection[0].minColor : this.heatMap.colorCollection[0].color;
            } else if (this.heatMap.paletteSettings.type === 'Fixed') {
                for (let y: number = 0; y < this.heatMap.colorCollection.length; y++) {
                    compareValue = this.heatMap.isColorRange ? this.heatMap.paletteSettings.palette[y].startValue :
                        this.heatMap.colorCollection[y + 1] ? this.heatMap.colorCollection[y + 1].value :
                            this.heatMap.colorCollection[y].value;
                    const singleValue: boolean = this.heatMap.dataSourceMinValue === this.heatMap.dataSourceMaxValue;
                    if (this.heatMap.isColorRange) {
                        let legendRange: LegendRange[];
                        if ((text <= this.heatMap.colorCollection[y].endValue && text >= this.heatMap.colorCollection[y].startValue)) {
                            if (this.heatMap.legendVisibilityByCellType) {
                                legendRange = this.heatMap.legendModule.legendRange;
                            }
                            color = (this.heatMap.legendVisibilityByCellType && legendRange[y] && !legendRange[y].visible) ?
                                this.heatMap.themeStyle.toggledColor : this.heatMap.colorCollection[y].minColor;
                            break;
                        } else {
                            color = this.heatMap.paletteSettings.fillColor.minColor;
                        }
                    } else {
                        if ((text <= compareValue && singleValue && y === 0) || text < compareValue ||
                        (text >= compareValue && y === this.heatMap.colorCollection.length - 1)) {
                            let legendRange: LegendRange[];
                            if (this.heatMap.legendVisibilityByCellType) {
                                legendRange = this.heatMap.legendModule.legendRange;
                            }
                            color = (this.heatMap.legendVisibilityByCellType && legendRange[y] && !legendRange[y].visible) ?
                                this.heatMap.themeStyle.toggledColor : this.heatMap.colorCollection[y].color;
                            break;
                        }
                    }
                }
            } else {
                if (this.heatMap.paletteSettings.colorGradientMode !== 'Table') {
                    this.getColorCollection();
                }
                if (text < this.heatMap.colorCollection[0].value && !this.heatMap.isColorRange) {
                    color = this.heatMap.colorCollection[0].color;
                } else if (text > this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].value &&
                        !this.heatMap.isColorRange ) {
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
