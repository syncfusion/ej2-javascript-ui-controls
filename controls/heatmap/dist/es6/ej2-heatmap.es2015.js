import { Browser, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, Touch, createElement, extend, isBlazor, isNullOrUndefined, merge, remove } from '@syncfusion/ej2-base';
import { CanvasRenderer, SvgRenderer, Tooltip } from '@syncfusion/ej2-svg-base';
import { DataUtil } from '@syncfusion/ej2-data';

/**
 * Specifies HeatMaps Themes
 */
var Theme;
(function (Theme) {
    /** @private */
    Theme.heatMapTitleFont = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.titleFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None',
    };
    /** @private */
    Theme.axisTitleFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.legendLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None',
    };
    /** @private */
    Theme.rectLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None',
    };
    /** @private */
    Theme.tooltipFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI',
        textOverflow: 'None',
    };
})(Theme || (Theme = {}));
/** @private */
function getThemeColor(theme) {
    let style;
    switch (theme.toLowerCase()) {
        case 'highcontrastlight':
        case 'highcontrast':
            style = {
                heatMapTitle: '#ffffff',
                axisTitle: '#ffffff',
                axisLabel: '#ffffff',
                cellBorder: '#EEEEEE',
                background: '#000000',
                cellTextColor: '#000000',
                toggledColor: '#000000',
                emptyCellColor: '#EEEEEE',
                legendLabel: '#ffffff',
                palette: [{ 'color': '#BEE7EE' },
                    { 'color': '#85c4cf' },
                    { 'color': '#4CA1AF' }]
            };
            break;
        case 'materialdark':
        case 'fabricdark':
        case 'bootstrapdark':
            style = {
                heatMapTitle: '#ffffff',
                axisTitle: '#ffffff',
                axisLabel: '#DADADA',
                cellBorder: '#EEEEEE',
                background: '#000000',
                cellTextColor: '#000000',
                toggledColor: '#000000',
                emptyCellColor: '#EEEEEE',
                legendLabel: '#ffffff',
                palette: [{ 'color': '#BEE7EE' },
                    { 'color': '#85c4cf' },
                    { 'color': '#4CA1AF' }]
            };
            break;
        case 'bootstrap4':
            style = {
                heatMapTitle: '#212529',
                axisTitle: '#212529',
                axisLabel: '#212529',
                cellBorder: '#E9ECEF',
                background: '#FFFFFF',
                cellTextColor: '#212529',
                toggledColor: '#ffffff',
                emptyCellColor: '#E9ECEF',
                legendLabel: '#212529',
                palette: [{ 'color': '#BEE7EE' },
                    { 'color': '#85c4cf' },
                    { 'color': '#4CA1AF' }]
            };
            break;
        default:
            style = {
                heatMapTitle: '#424242',
                axisTitle: '#424242',
                axisLabel: '#686868',
                cellBorder: '#EEEEEE',
                cellTextColor: '#000000',
                toggledColor: '#ffffff',
                background: '#FFFFFF',
                emptyCellColor: '#EEEEEE',
                legendLabel: '#353535',
                palette: [{ 'color': '#BEE7EE' },
                    { 'color': '#85c4cf' },
                    { 'color': '#4CA1AF' }]
            };
            break;
    }
    return style;
}

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the fonts in heat map.
 */
class Font extends ChildProperty {
}
__decorate$2([
    Property('16px')
], Font.prototype, "size", void 0);
__decorate$2([
    Property('')
], Font.prototype, "color", void 0);
__decorate$2([
    Property('Segoe UI')
], Font.prototype, "fontFamily", void 0);
__decorate$2([
    Property('Normal')
], Font.prototype, "fontWeight", void 0);
__decorate$2([
    Property('Normal')
], Font.prototype, "fontStyle", void 0);
__decorate$2([
    Property('Center')
], Font.prototype, "textAlignment", void 0);
__decorate$2([
    Property('Trim')
], Font.prototype, "textOverflow", void 0);
/**
 * Configures the heat map margins.
 */
class Margin extends ChildProperty {
}
__decorate$2([
    Property(10)
], Margin.prototype, "left", void 0);
__decorate$2([
    Property(10)
], Margin.prototype, "right", void 0);
__decorate$2([
    Property(10)
], Margin.prototype, "top", void 0);
__decorate$2([
    Property(10)
], Margin.prototype, "bottom", void 0);
/**
 * Configures the borders in the heat map.
 */
class Border extends ChildProperty {
}
__decorate$2([
    Property('')
], Border.prototype, "color", void 0);
__decorate$2([
    Property(1)
], Border.prototype, "width", void 0);
__decorate$2([
    Property('')
], Border.prototype, "radius", void 0);
/**
 * Configures the tooltip borders in the heat map.
 */
class TooltipBorder extends ChildProperty {
}
__decorate$2([
    Property('')
], TooltipBorder.prototype, "color", void 0);
__decorate$2([
    Property(0)
], TooltipBorder.prototype, "width", void 0);
/**
 * Configures the mapping name for size and color in SizeAndColor type.
 */
class BubbleData extends ChildProperty {
}
__decorate$2([
    Property(null)
], BubbleData.prototype, "size", void 0);
__decorate$2([
    Property(null)
], BubbleData.prototype, "color", void 0);
/**
 * class used to maintain Title styles.
 */
class Title extends ChildProperty {
}
__decorate$2([
    Property('')
], Title.prototype, "text", void 0);
__decorate$2([
    Complex({}, Font)
], Title.prototype, "textStyle", void 0);
/**
 * class used to maintain the fill color value for cell color range
 */
class FillColor extends ChildProperty {
}
__decorate$2([
    Property('#eeeeee')
], FillColor.prototype, "minColor", void 0);
__decorate$2([
    Property('#eeeeee')
], FillColor.prototype, "maxColor", void 0);
/**
 * class used to maintain palette information.
 */
class PaletteCollection extends ChildProperty {
}
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "value", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "color", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "label", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "startValue", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "endValue", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "minColor", void 0);
__decorate$2([
    Property(null)
], PaletteCollection.prototype, "maxColor", void 0);
/**
 * label border properties.
 */
class AxisLabelBorder extends ChildProperty {
}
__decorate$2([
    Property('#b5b5b5')
], AxisLabelBorder.prototype, "color", void 0);
__decorate$2([
    Property(1)
], AxisLabelBorder.prototype, "width", void 0);
__decorate$2([
    Property('Rectangle')
], AxisLabelBorder.prototype, "type", void 0);
class BubbleSize extends ChildProperty {
}
__decorate$2([
    Property('0%')
], BubbleSize.prototype, "minimum", void 0);
__decorate$2([
    Property('100%')
], BubbleSize.prototype, "maximum", void 0);
/**
 * categories for multi level labels
 */
class MultiLevelCategories extends ChildProperty {
}
__decorate$2([
    Property(null)
], MultiLevelCategories.prototype, "start", void 0);
__decorate$2([
    Property(null)
], MultiLevelCategories.prototype, "end", void 0);
__decorate$2([
    Property('')
], MultiLevelCategories.prototype, "text", void 0);
__decorate$2([
    Property(null)
], MultiLevelCategories.prototype, "maximumTextWidth", void 0);
/**
 * MultiLevelLabels properties
 */
class MultiLevelLabels extends ChildProperty {
}
__decorate$2([
    Property('Center')
], MultiLevelLabels.prototype, "alignment", void 0);
__decorate$2([
    Property('Wrap')
], MultiLevelLabels.prototype, "overflow", void 0);
__decorate$2([
    Complex(Theme.axisLabelFont, Font)
], MultiLevelLabels.prototype, "textStyle", void 0);
__decorate$2([
    Complex({ color: '#b5b5b5', width: 1, type: 'Rectangle' }, AxisLabelBorder)
], MultiLevelLabels.prototype, "border", void 0);
__decorate$2([
    Collection([], MultiLevelCategories)
], MultiLevelLabels.prototype, "categories", void 0);
/**
 * Internal class used to maintain colorcollection.
 */
class ColorCollection {
    constructor(value, color, label, startValue, endValue, minColor, maxColor) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.startValue = startValue;
        this.endValue = endValue;
        this.minColor = minColor;
        this.maxColor = maxColor;
    }
}
/**
 * class used to maintain color and value collection.
 */
class BubbleTooltipData {
    constructor(mappingName, bubbleData, valueType) {
        this.mappingName = mappingName;
        this.bubbleData = bubbleData;
        this.valueType = valueType;
    }
}
/**
 * Internal class used to maintain legend colorcollection.
 */
class LegendColorCollection {
    constructor(value, color, label, startValue, endValue, minColor, maxColor, isHidden) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.startValue = startValue;
        this.endValue = endValue;
        this.minColor = minColor;
        this.maxColor = maxColor;
        this.isHidden = isHidden;
    }
}

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the color property in Heatmap.
 */
class PaletteSettings extends ChildProperty {
}
__decorate$1([
    Collection([{}], PaletteCollection)
], PaletteSettings.prototype, "palette", void 0);
__decorate$1([
    Property('Gradient')
], PaletteSettings.prototype, "type", void 0);
__decorate$1([
    Property('')
], PaletteSettings.prototype, "emptyPointColor", void 0);
__decorate$1([
    Property('Table')
], PaletteSettings.prototype, "colorGradientMode", void 0);
__decorate$1([
    Complex({}, FillColor)
], PaletteSettings.prototype, "fillColor", void 0);
/**
 * Helper class for colormapping
 */
class RgbColor {
    constructor(r, g, b) {
        this.R = r;
        this.G = g;
        this.B = b;
    }
}
class CellColor {
    constructor(heatMap) {
        this.heatMap = heatMap;
    }
    /**
     * To convert hexa color to RGB.
     * @return {RGB}
     * @private
     */
    convertToRGB(value, colorMapping) {
        let previousOffset = this.heatMap.isColorRange ? colorMapping[0].startValue : colorMapping[0].value;
        let nextOffset = 0;
        let i = 0;
        let previousColor;
        let nextColor;
        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
            for (i = 0; i < colorMapping.length; i++) {
                let offset = Number(colorMapping[i].endValue);
                if (value <= offset && value >= Number(colorMapping[i].startValue)) {
                    nextOffset = offset;
                    previousColor = this.heatMap.colorCollection[i].minColor;
                    nextColor = this.heatMap.colorCollection[i].maxColor;
                    break;
                }
                else if (colorMapping[0].startValue !== this.heatMap.dataSourceMinValue && value < colorMapping[0].startValue) {
                    nextOffset = colorMapping[0].startValue;
                    previousOffset = this.heatMap.dataSourceMinValue;
                    previousColor = this.heatMap.paletteSettings.fillColor.minColor;
                    nextColor = this.heatMap.paletteSettings.fillColor.maxColor;
                    break;
                }
                else if (value > offset && value <= (i === (colorMapping.length - 1) ? this.heatMap.dataSourceMaxValue :
                    colorMapping[i + 1].startValue)) {
                    nextOffset = (i === (colorMapping.length - 1)) ? this.heatMap.dataSourceMaxValue : colorMapping[i + 1].startValue;
                    previousOffset = offset;
                    previousColor = this.heatMap.paletteSettings.fillColor.minColor;
                    nextColor = this.heatMap.paletteSettings.fillColor.maxColor;
                    break;
                }
                else {
                    nextOffset = offset;
                    previousOffset = offset;
                }
            }
        }
        else {
            for (i = 1; i < colorMapping.length; i++) {
                let offset = Number(colorMapping[i].value);
                if (value <= offset) {
                    nextOffset = offset;
                    previousColor = this.getEqualColor(colorMapping, previousOffset);
                    nextColor = this.getEqualColor(colorMapping, nextOffset);
                    break;
                }
                else {
                    nextOffset = offset;
                    previousOffset = offset;
                }
            }
        }
        let percent = 0;
        let full = (nextOffset) - previousOffset;
        percent = (value - previousOffset) / full;
        percent = isNaN(percent) ? 0 : percent;
        return this.getPercentageColor(percent, previousColor, nextColor);
    }
    /**
     * To convert RGB to HEX.
     * @return {string}
     * @private
     */
    rgbToHex(r, g, b) {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }
    /**
     * To convert Component to HEX.
     * @return {string}
     * @private
     */
    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
    /**
     * To get similar color.
     * @return {string}
     * @private
     */
    getEqualColor(list, offset) {
        for (let i = 0; i < list.length; i++) {
            if (Number(list[i].value) === offset) {
                let color = list[i].color;
                if (color.indexOf('rgb') !== -1) {
                    color = this.convertToHex(color);
                }
                else if (color.indexOf('#') === -1) {
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
    convertToHex(color) {
        let itemColor = color.substr(3);
        itemColor = itemColor.split('(')[1].split(')')[0];
        let colorSplit = itemColor.split(',');
        itemColor = this.rgbToHex(parseInt(colorSplit[0], 10), parseInt(colorSplit[1], 10), parseInt(colorSplit[2], 10));
        return itemColor;
    }
    /**
     * To get RGB for percentage value.
     * @return {RGB}
     * @private
     */
    getPercentageColor(percent, previous, next) {
        let nextColor = next.split('#')[1];
        let prevColor = previous.split('#')[1];
        let r = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        let g = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        let b = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new RgbColor(r, g, b);
    }
    /**
     * To convert numbet to percentage.
     * @return {RGB}
     * @private
     */
    getPercentage(percent, previous, next) {
        let full = next - previous;
        return Math.round((previous + (full * percent)));
    }
    /**
     * To get complete color Collection.
     * @private
     */
    getColorCollection() {
        let heatMap = this.heatMap;
        heatMap.colorCollection = [];
        heatMap.legendColorCollection = [];
        let range;
        for (let j = 0; j < this.heatMap.paletteSettings.palette.length; j++) {
            if (this.heatMap.paletteSettings.palette[j].startValue === null || this.heatMap.paletteSettings.palette[j].endValue === null) {
                this.heatMap.isColorRange = false;
                break;
            }
            else {
                this.heatMap.isColorRange = true;
            }
        }
        let minValue = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        let maxValue = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        heatMap.emptyPointColor = heatMap.paletteSettings.emptyPointColor ? heatMap.paletteSettings.emptyPointColor :
            heatMap.themeStyle.emptyCellColor;
        let tempcolorMapping = this.orderbyOffset(heatMap.paletteSettings.palette && heatMap.paletteSettings.palette.length > 1 ?
            heatMap.paletteSettings.palette : heatMap.themeStyle.palette);
        if (!tempcolorMapping.isCompact) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length - 1);
            }
            else {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length);
            }
            if (tempcolorMapping.offsets.length >= 2) {
                for (let index = 0; index < tempcolorMapping.offsets.length; index++) {
                    heatMap.colorCollection.push(new ColorCollection((Math.round(((minValue) + (index * range)) * 100) / 100), tempcolorMapping.offsets[index].color, tempcolorMapping.offsets[index].label, tempcolorMapping.offsets[index].startValue, tempcolorMapping.offsets[index].endValue, tempcolorMapping.offsets[index].minColor, tempcolorMapping.offsets[index].maxColor));
                    heatMap.legendColorCollection.push(new LegendColorCollection(Math.round(((minValue) + (index * range)) * 100) / 100, tempcolorMapping.offsets[index].color, tempcolorMapping.offsets[index].label, tempcolorMapping.offsets[index].startValue, tempcolorMapping.offsets[index].endValue, tempcolorMapping.offsets[index].minColor, tempcolorMapping.offsets[index].maxColor, false));
                }
            }
        }
        else {
            heatMap.colorCollection = tempcolorMapping.offsets;
            heatMap.legendColorCollection = extend([], tempcolorMapping.offsets, null, true);
        }
        if (!this.heatMap.isColorRange) {
            this.updateLegendColorCollection(minValue, maxValue, tempcolorMapping);
        }
    }
    /**
     * To update legend color Collection.
     * @private
     */
    updateLegendColorCollection(minValue, maxValue, tempcolorMapping) {
        if (this.heatMap.paletteSettings.type === 'Fixed' && (tempcolorMapping.isCompact || tempcolorMapping.isLabel)) {
            return;
        }
        if (Math.round(minValue * 100) / 100 < this.heatMap.legendColorCollection[0].value) {
            this.heatMap.legendColorCollection.unshift(new LegendColorCollection(Math.round(minValue * 100) / 100, this.heatMap.legendColorCollection[0].color, this.heatMap.legendColorCollection[0].label, this.heatMap.legendColorCollection[0].startValue, this.heatMap.legendColorCollection[0].endValue, this.heatMap.legendColorCollection[0].minColor, this.heatMap.legendColorCollection[0].maxColor, true));
        }
        if (Math.round(maxValue * 100) / 100 > this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].value) {
            this.heatMap.legendColorCollection.push(new LegendColorCollection(Math.round(maxValue * 100) / 100, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].color, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].label, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].startValue, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].endValue, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].minColor, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].maxColor, true));
        }
    }
    /**
     * To get ordered palette color collection.
     * @private
     */
    orderbyOffset(offsets) {
        let returnCollection = new PaletterColor();
        let key = this.heatMap.isColorRange ? 'to' : 'value';
        let label = 'label';
        returnCollection.isCompact = true;
        returnCollection.isLabel = true;
        // tslint:disable-next-line:no-any
        returnCollection.offsets = offsets.sort((a, b) => {
            if (isNullOrUndefined(a[label]) && isNullOrUndefined(b[label])) {
                returnCollection.isLabel = false;
            }
            if (!isNullOrUndefined(a[key]) && !isNullOrUndefined(b[key])) {
                return a[key] - b[key];
            }
            else {
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
    getColorByValue(text) {
        let color = '';
        let rbg;
        let compareValue = 0;
        if (text.toString() !== '') {
            if (this.heatMap.cellSettings.tileType === 'Bubble' &&
                (this.heatMap.cellSettings.bubbleType === 'Size' || this.heatMap.cellSettings.bubbleType === 'Sector')) {
                color = this.heatMap.isColorRange ? this.heatMap.colorCollection[0].minColor : this.heatMap.colorCollection[0].color;
            }
            else if (this.heatMap.paletteSettings.type === 'Fixed') {
                for (let y = 0; y < this.heatMap.colorCollection.length; y++) {
                    compareValue = this.heatMap.isColorRange ? this.heatMap.paletteSettings.palette[y].startValue :
                        this.heatMap.colorCollection[y + 1] ? this.heatMap.colorCollection[y + 1].value :
                            this.heatMap.colorCollection[y].value;
                    let singleValue = this.heatMap.dataSourceMinValue === this.heatMap.dataSourceMaxValue;
                    if (this.heatMap.isColorRange) {
                        let legendRange;
                        if ((text <= this.heatMap.colorCollection[y].endValue && text >= this.heatMap.colorCollection[y].startValue)) {
                            if (this.heatMap.legendVisibilityByCellType) {
                                legendRange = this.heatMap.legendModule.legendRange;
                            }
                            color = (this.heatMap.legendVisibilityByCellType && legendRange[y] && !legendRange[y].visible) ?
                                this.heatMap.themeStyle.toggledColor : this.heatMap.colorCollection[y].minColor;
                            break;
                        }
                        else {
                            color = this.heatMap.paletteSettings.fillColor.minColor;
                        }
                    }
                    else {
                        if ((text <= compareValue && singleValue && y === 0) || text < compareValue ||
                            (text >= compareValue && y === this.heatMap.colorCollection.length - 1)) {
                            let legendRange;
                            if (this.heatMap.legendVisibilityByCellType) {
                                legendRange = this.heatMap.legendModule.legendRange;
                            }
                            color = (this.heatMap.legendVisibilityByCellType && legendRange[y] && !legendRange[y].visible) ?
                                this.heatMap.themeStyle.toggledColor : this.heatMap.colorCollection[y].color;
                            break;
                        }
                    }
                }
            }
            else {
                if (this.heatMap.paletteSettings.colorGradientMode !== 'Table') {
                    this.getColorCollection();
                }
                if (text < this.heatMap.colorCollection[0].value && !this.heatMap.isColorRange) {
                    color = this.heatMap.colorCollection[0].color;
                }
                else if (text > this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].value &&
                    !this.heatMap.isColorRange) {
                    color = this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].color;
                }
                else {
                    rbg = this.convertToRGB(text, this.heatMap.colorCollection);
                    color = this.rgbToHex(rbg.R, rbg.G, rbg.B);
                }
            }
        }
        else {
            color = this.heatMap.emptyPointColor;
        }
        return color;
    }
}

/**
 * Helper method for heatmap
 */
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Function to measure the height and width of the text.
 * @private
 */
function measureText(text, font) {
    let htmlObject = document.getElementById('heatmapmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'heatmapmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerText = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.fontSize = (font.size).indexOf('px') !== -1 ? font.size : font.size + 'px';
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
/** @private */
class TextElement {
    constructor(fontModel, fontColor) {
        this['font-size'] = fontModel.size;
        this['font-style'] = fontModel.fontStyle.toLowerCase();
        this['font-family'] = fontModel.fontFamily;
        this['font-weight'] = fontModel.fontWeight.toLowerCase();
        this.fill = fontColor ? fontColor : '';
    }
}
function titlePositionX(width, leftPadding, rightPadding, titleStyle) {
    let positionX;
    if (titleStyle.textAlignment === 'Near') {
        positionX = leftPadding;
    }
    else if (titleStyle.textAlignment === 'Center') {
        positionX = leftPadding + width / 2;
    }
    else {
        positionX = width + leftPadding;
    }
    return positionX;
}
/**
 * Internal class size for height and width
 * @private
 */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
/** @private */
class CustomizeOption {
    constructor(id) {
        this.id = id;
    }
}
/** @private */
class PathOption extends CustomizeOption {
    constructor(id, fill, width, color, opacity, dashArray, d) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color ? color : '';
        this['stroke-width'] = parseFloat(width.toString());
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}
/**
 * Class to define currentRect private property.
 * @private
 */
class CurrentRect {
    constructor(x, y, width, height, value, id, xIndex, yIndex, xValue, yValue, visible, displayText, textId, allowCollection) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.id = id;
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.xValue = xValue;
        this.yValue = yValue;
        this.visible = visible;
        this.displayText = displayText;
        this.textId = textId;
        /** @private */
        this.allowCollection = allowCollection;
    }
}
/**
 * Class to define the details of selected cell.
 * @private
 */
class SelectedCellDetails {
    constructor(value, xLabel, yLabel, xValue, yValue, cellElement, xPosition, yPosition, width, height, x, y) {
        this.value = value;
        this.xLabel = xLabel;
        this.yLabel = yLabel;
        this.xValue = xValue;
        this.yValue = yValue;
        this.cellElement = cellElement;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}
/**
 * Class to define property to draw rectangle.
 * @private
 */
class RectOption extends PathOption {
    constructor(id, fill, border, opacity, rect, borderColor, rx, ry, transform, dashArray) {
        super(id, fill, border.width, borderColor, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height > 0 ? rect.height : 0;
        this.width = rect.width > 0 ? rect.width : 0;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
    }
}
/**
 * Class to define property to draw circle.
 * @private
 */
class CircleOption extends PathOption {
    constructor(id, fill, border, opacity, borderColor, cx, cy, r) {
        super(id, fill, border.width, borderColor, opacity);
        this.cx = cx ? cx : 0;
        this.cy = cy ? cy : 0;
        this.r = r ? r : 0;
    }
}
/**
 * Helper Class to define property to draw rectangle.
 * @private
 */
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
/**
 * Class to define property to draw text.
 * @private
 */
class TextOption extends TextElement {
    constructor(id, basic, element, fontColor) {
        super(element, fontColor);
        this.transform = '';
        this['dominant-baseline'] = 'auto';
        this.labelRotation = 0;
        this.baseline = 'auto';
        this.id = id;
        this.x = basic.x;
        this.y = basic.y;
        this['text-anchor'] = basic['text-anchor'];
        this.text = basic.text;
        this.transform = basic.transform;
        this.labelRotation = basic.labelRotation;
        this['dominant-baseline'] = basic['dominant-baseline'];
        this.baseline = basic.baseline;
        this.dy = basic.dy;
    }
}
/**
 * Helper Class to define property to draw text.
 * @private
 */
class TextBasic {
    constructor(x, y, anchor, text, labelRotation, transform, baseLine, dy) {
        this.transform = '';
        this['dominant-baseline'] = 'auto';
        this.labelRotation = 0;
        this.baseline = 'auto';
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this['text-anchor'] = anchor ? anchor : 'start';
        this.text = text ? text : '';
        this.transform = transform ? transform : '';
        this.labelRotation = labelRotation;
        this['dominant-baseline'] = baseLine ? baseLine : 'auto';
        this.baseline = baseLine ? baseLine : '';
        this.dy = dy ? dy : '';
    }
}
/**
 * Class to define property to draw line.
 * @private
 */
class Line {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
/**
 * Class to define property to draw line.
 * @private
 */
class LineOption extends PathOption {
    constructor(id, line, stroke, strokewidth, opacity, dasharray) {
        super(id, null, strokewidth, stroke, opacity, dasharray, null);
        this.x1 = line.x1;
        this.y1 = line.y1;
        this.x2 = line.x2;
        this.y2 = line.y2;
    }
}
/**
 * Properties required to render path.
 * @private
 */
class PathAttributes extends PathOption {
    constructor(id, path, fill, border, borderWidth, opacity, borderColor) {
        super(id, fill, borderWidth, borderColor, opacity, null);
        this.d = path.d;
        this.x = path.x;
        this.y = path.y;
    }
}
/**
 * Helper Class to define property to path.
 * @private
 */
class Path {
    constructor(d, innerR, x, y, x1, y1, cx, cy, start, end, radius, counterClockWise) {
        this.d = d;
        this.innerR = innerR;
        this.cx = cx;
        this.cy = cy;
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.start = start;
        this.end = end;
        this.radius = radius;
        this.counterClockWise = counterClockWise;
    }
}
/** @private */
function sum(values) {
    let sum = 0;
    for (let value of values) {
        sum += value;
    }
    return sum;
}
/** @private */
function titlePositionY(heatmapSize, topPadding, bottomPadding, titleStyle) {
    let positionY;
    if (titleStyle.textAlignment === 'Near') {
        positionY = heatmapSize.height - bottomPadding;
    }
    else if (titleStyle.textAlignment === 'Center') {
        positionY = heatmapSize.height / 2;
    }
    else {
        positionY = topPadding;
    }
    return positionY;
}
/** @private */
function rotateTextSize(font, text, angle) {
    let renderer = new SvgRenderer('heatmapMeasureRotateText');
    let svgObject = renderer.createSvg({ id: 'heatmapMeasureRotateText_svg', width: 100, height: 100 });
    let box;
    let options;
    let htmlObject;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle.toLowerCase(),
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight.toLowerCase(),
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    htmlObject = renderer.createText(options, text);
    svgObject.appendChild(htmlObject);
    document.body.appendChild(svgObject);
    box = htmlObject.getBoundingClientRect();
    remove(svgObject);
    return new Size((box.right - box.left), (box.bottom - box.top));
}
/**
 * Class to draw SVG and Canvas Rectangle & Text.
 * @private
 */
class DrawSvgCanvas {
    constructor(heatmap) {
        this.heatMap = heatmap;
    }
    //Svg & Canvas Rectangle Part
    drawRectangle(properties, parentElement, isFromSeries) {
        if (!this.heatMap.enableCanvasRendering) {
            delete properties.d;
            parentElement.appendChild(this.heatMap.renderer.drawRectangle(properties));
        }
        else {
            this.drawCanvasRectangle(this.heatMap.canvasRenderer, properties, isFromSeries);
        }
    }
    //Svg & Canvas Bubble Part
    drawCircle(properties, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            delete properties.d;
            parentElement.appendChild(this.heatMap.renderer.drawCircle(properties));
        }
        else {
            this.drawCanvasCircle(this.heatMap.canvasRenderer, properties);
        }
    }
    //Svg & Canvas Pie Part
    drawPath(properties, options, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            delete properties.x;
            delete properties.y;
            parentElement.appendChild(this.heatMap.renderer.drawPath(properties));
        }
        else {
            this.drawCanvasPath(this.heatMap.canvasRenderer, properties, options);
        }
    }
    //Svg & Canvas Text Part
    createText(properties, parentElement, text) {
        if (!this.heatMap.enableCanvasRendering) {
            delete properties.labelRotation;
            delete properties.baseline;
            delete properties.text;
            parentElement.appendChild(this.heatMap.renderer.createText(properties, text));
            properties.text = text;
        }
        else {
            this.canvasDrawText(properties, text);
        }
    }
    //Draw the wrapped text for both SVG & canvas
    createWrapText(options, font, parentElement) {
        let renderOptions = {};
        let htmlObject;
        let tspanElement;
        let text;
        let height;
        renderOptions = {
            'id': options.id,
            'x': options.x,
            'y': options.y,
            'fill': options.fill,
            'font-size': font.size,
            'font-style': font.fontStyle,
            'font-family': font.fontFamily,
            'font-weight': font.fontWeight.toLowerCase(),
            'text-anchor': options['text-anchor'],
            'transform': options.transform,
            'dominant-baseline': options['dominant-baseline']
        };
        text = options.text[0];
        if (!this.heatMap.enableCanvasRendering) {
            htmlObject = this.heatMap.renderer.createText(renderOptions, text);
        }
        else {
            this.heatMap.canvasRenderer.createText(options, text);
        }
        if (typeof options.text !== 'string' && options.text.length > 1) {
            for (let i = 1, len = options.text.length; i < len; i++) {
                height = (measureText(options.text[i], font).height);
                if (!this.heatMap.enableCanvasRendering) {
                    tspanElement = this.heatMap.renderer.createTSpan({
                        'x': options.x, 'id': options.id + i,
                        'y': (options.y) + (i * height)
                    }, options.text[i]);
                    htmlObject.appendChild(tspanElement);
                }
                else {
                    options.id = options.id + i;
                    options.y += height;
                    this.heatMap.canvasRenderer.createText(options, options.text[i]);
                }
            }
        }
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(htmlObject);
        }
    }
    drawLine(properties, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            delete properties.d;
            parentElement.appendChild(this.heatMap.renderer.drawLine(properties));
        }
        else {
            this.heatMap.canvasRenderer.drawLine(properties);
        }
    }
    //Canvas Text Part
    canvasDrawText(options, label, translateX, translateY) {
        let ctx = this.heatMap.canvasRenderer.ctx;
        if (!translateX) {
            translateX = options.x;
        }
        if (!translateY) {
            translateY = options.y;
        }
        let fontWeight = this.getOptionValue(options, 'font-weight');
        if (!isNullOrUndefined(fontWeight) && fontWeight.toLowerCase() === 'regular') {
            fontWeight = 'normal';
        }
        let fontFamily = this.getOptionValue(options, 'font-family');
        let fontSize = (options['font-size'].toString()).indexOf('px') === -1 ? options['font-size'] + 'px' : options['font-size'];
        let anchor = this.getOptionValue(options, 'text-anchor');
        let fontStyle = this.getOptionValue(options, 'font-style').toLowerCase();
        let font = (fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily);
        if (anchor === 'middle') {
            anchor = 'center';
        }
        ctx.save();
        ctx.fillStyle = options.fill;
        ctx.font = font;
        ctx.textAlign = anchor;
        if (options.baseline) {
            ctx.textBaseline = options.baseline;
        }
        ctx.translate(translateX, translateY);
        ctx.rotate(options.labelRotation * Math.PI / 180);
        ctx.fillText(label, options.x - translateX, options.y - translateY);
        ctx.restore();
    }
    // method to get the attributes value
    /* tslint:disable */
    getOptionValue(options, key) {
        return options[key];
    }
    setAttributes(canvas, options) {
        canvas.ctx.lineWidth = options['stroke-width'];
        let dashArray = options['stroke-dasharray'];
        if (!isNullOrUndefined(dashArray)) {
            let dashArrayString = dashArray.split(',');
            canvas.ctx.setLineDash([parseInt(dashArrayString[0], 10), parseInt(dashArrayString[1], 10)]);
        }
        canvas.ctx.strokeStyle = options['stroke'];
    }
    ;
    drawCanvasRectangle(canvas, options, isFromSeries) {
        let canvasCtx = canvas.ctx;
        let cornerRadius = options.rx;
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = options['opacity'];
        this.setAttributes(canvas, options);
        this.drawCornerRadius(canvas, options);
        if ((options['stroke-width'] && options['stroke-width'] != 0) || isFromSeries) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
        canvas.ctx = canvasCtx;
    }
    ;
    // To draw the corner of a rectangle
    drawCornerRadius(canvas, options) {
        let cornerRadius = options.rx;
        let x = options.x;
        let y = options.y;
        let width = options.width;
        let height = options.height;
        if (options.fill === 'none') {
            options.fill = 'transparent';
        }
        canvas.ctx.fillStyle = options.fill;
        if (width < 2 * cornerRadius) {
            cornerRadius = width / 2;
        }
        if (height < 2 * cornerRadius) {
            cornerRadius = height / 2;
        }
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(x + width - cornerRadius, y);
        canvas.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
        canvas.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
        canvas.ctx.arcTo(x, y + height, x, y, cornerRadius);
        canvas.ctx.arcTo(x, y, x + width, y, cornerRadius);
        canvas.ctx.closePath();
        canvas.ctx.fill();
    }
    ;
    drawCanvasCircle(canvas, options) {
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
        canvas.ctx.fillStyle = options.fill;
        canvas.ctx.globalAlpha = options.opacity;
        canvas.ctx.fill();
        this.setAttributes(canvas, options);
        if (options['stroke-width'] && options['stroke-width'] !== 0) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
    }
    ;
    drawCanvasPath(canvas, properties, options) {
        let path = properties.d;
        let dataSplit = path.split(' ');
        let borderWidth = this.getOptionValue(options, 'stroke-width');
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = properties.opacity;
        canvas.ctx.fillStyle = properties.fill;
        this.setAttributes(canvas, properties);
        for (let i = 0; i < dataSplit.length; i = i + 3) {
            let x1 = parseFloat(dataSplit[i + 1]);
            let y1 = parseFloat(dataSplit[i + 2]);
            switch (dataSplit[i]) {
                case 'M':
                    canvas.ctx.moveTo(x1, y1);
                    break;
                case 'L':
                    canvas.ctx.lineTo(x1, y1);
                    break;
                case 'A':
                case 'a':
                    canvas.ctx.arc(options.x, options.y, options.radius, (options.start * 0.0174533), (options.end * 0.0174533), false);
                    i = dataSplit[i] === 'a' ? i + 13 : i + 5;
                    break;
                case 'Z':
                    canvas.ctx.closePath();
                    break;
            }
        }
        canvas.ctx.fill();
        if (properties['stroke-width'] && properties['stroke-width'] !== 0) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
    }
    ;
}
function getTitle(title, style, width) {
    let titleCollection = [];
    switch (style.textOverflow) {
        case 'Wrap':
            titleCollection = textWrap(title, width, style);
            break;
        case 'Trim':
            titleCollection.push(textTrim(width, title, style));
            break;
        default:
            titleCollection.push(textNone(width, title, style));
            break;
    }
    return titleCollection;
}
function textWrap(currentLabel, maximumWidth, font) {
    let textCollection = currentLabel.split(' ');
    let label = '';
    let labelCollection = [];
    let text;
    for (let i = 0, len = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (measureText(label.concat(text), font).width < maximumWidth) {
            label = label.concat((label === '' ? '' : ' ') + text);
        }
        else {
            if (label !== '') {
                labelCollection.push(textTrim(maximumWidth, label, font));
                label = text;
            }
            else {
                labelCollection.push(textTrim(maximumWidth, text, font));
                text = '';
            }
        }
        if (label && i === len - 1) {
            labelCollection.push(textTrim(maximumWidth, label, font));
        }
    }
    return labelCollection;
}
/** @private */
function textTrim(maxWidth, text, font) {
    let label = text;
    let size = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength = text.length;
        for (let index = textLength - 1; index >= 0; --index) {
            label = text.substring(0, index) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/** @private */
function textNone(maxWidth, text, font) {
    let label = text;
    let size = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength = text.length;
        for (let i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i);
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/** @private */
class Gradient {
    constructor(x, x1, x2, y1, y2) {
        this.id = x;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}
class GradientColor {
    constructor(color, colorStop) {
        this.color = color;
        this.colorStop = colorStop;
    }
}
/** @private */
function showTooltip(text, x, y, areaWidth, id, element, isTouch, heatmap) {
    let tooltip = document.getElementById(id);
    let initialClip = heatmap.initialClipRect;
    let size = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    });
    let width = size.width + 5;
    x = (x + width > areaWidth) ? x - width : x;
    x = x < 0 ? 5 : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: Segoe UI'
        });
        tooltip.innerText = text;
        element.appendChild(tooltip);
    }
    else {
        tooltip.innerText = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (text === heatmap.titleSettings.text) {
        tooltip.style.width = (x + 15) + size.width + 7 > heatmap.availableSize.width ?
            (heatmap.availableSize.width - (x + 15)).toString() + 'px' : '';
    }
    else {
        tooltip.style.left = (x + 15) + size.width + 7 > heatmap.availableSize.width ?
            (heatmap.availableSize.width - (size.width + 7)).toString() + 'px' : x.toString() + 'px';
        tooltip.style.top = (y + 15) + size.height + 6 > heatmap.availableSize.height ?
            (y - (size.height + 6) - 10).toString() + 'px' : tooltip.style.top; // 6 and 7 are padding and border width
    }
    if (isTouch) {
        setTimeout(() => { removeElement(id); }, 1500);
    }
}
/** @private */
function removeElement(id) {
    let element = getElement(id);
    if (element) {
        remove(element);
    }
}
/** @private */
function getElement(id) {
    return document.getElementById(id);
}
/** @private */
function increaseDateTimeInterval(value, interval, intervalType, increment) {
    let result = new Date(value);
    interval = Math.ceil(interval * increment);
    switch (intervalType) {
        case 'Years':
            result.setFullYear(result.getFullYear() + interval);
            break;
        case 'Months':
            result.setMonth(result.getMonth() + interval);
            break;
        case 'Days':
            result.setDate(result.getDate() + interval);
            break;
        case 'Hours':
            result.setHours(result.getHours() + interval);
            break;
        case 'Minutes':
            result.setMinutes(result.getMinutes() + interval);
            break;
    }
    return result;
}
/* private */
class CanvasTooltip {
    constructor(text, rect) {
        this.region = new Rect(0, 0, 0, 0);
        this.text = text;
        this.region = rect;
    }
}
/* private*/
/* Method to get the tool tip text in canvas based on region. */
function getTooltipText(tooltipCollection, xPosition, yPosition) {
    let length = tooltipCollection.length;
    let tooltip;
    let region;
    let text;
    for (let i = 0; i < length; i++) {
        tooltip = tooltipCollection[i];
        region = tooltip.region;
        if (xPosition >= region.x && xPosition <= (region.x + region.width) && yPosition >= region.y && yPosition <= (region.y + region.height)) {
            text = tooltip.text;
            break;
        }
    }
    return text;
}
/**
 * @private
 */
class PaletterColor {
}
/**
 * @private
 */
class GradientPointer {
    constructor(pathX1, pathY1, pathX2, pathY2, pathX3, pathY3) {
        this.pathX1 = pathX1;
        this.pathY1 = pathY1;
        this.pathX2 = pathX2;
        this.pathY2 = pathY2;
        this.pathX3 = pathX3;
        this.pathY3 = pathY3;
    }
}
/**
 * Class to define currentRect private property.
 * @private
 */
class CurrentLegendRect {
    constructor(x, y, width, height, label, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.id = id;
    }
}
/** @private */
class LegendRange {
    constructor(x, y, width, height, value, visible, currentPage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.visible = visible;
        this.currentPage = currentPage;
    }
}
/** @private */
class ToggleVisibility {
    constructor(visible, value, startValue, endValue) {
        this.visible = visible;
        this.value = value;
        this.startValue = startValue;
        this.endValue = endValue;
    }
}
/** @private */
function colorNameToHex(color) {
    let element;
    color = color === 'transparent' ? 'white' : color;
    element = document.getElementById('heatmapmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    let exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    let isRGBValue = exp.exec(color);
    return convertToHexCode(new RgbColor(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
/** @private */
function convertToHexCode(value) {
    return '#' + componentToHex(value.R) + componentToHex(value.G) + componentToHex(value.B);
}
/** @private */
function componentToHex(value) {
    let hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
function convertHexToColor(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new RgbColor(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new RgbColor(255, 255, 255);
}
/** @private */
function formatValue(isCustom, format, tempInterval, formatFun) {
    return isCustom ? format.replace('{value}', formatFun(tempInterval))
        : formatFun(tempInterval);
}
/** @private */
class MultiLevelPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * HeatMap Axis file
 */
class Axis extends ChildProperty {
    constructor() {
        super(...arguments);
        /** @private */
        this.rect = new Rect(undefined, undefined, 0, 0);
        /** @private */
        this.nearSizes = [];
        /** @private */
        this.farSizes = [];
        /** @private */
        this.maxLabelSize = new Size(0, 0);
        /** @private */
        this.titleSize = new Size(0, 0);
        /** @private */
        this.axisLabels = [];
        /** @private */
        this.tooltipLabels = [];
        /** @private */
        this.labelValue = [];
        /** @private */
        this.axisLabelSize = 0;
        /** @private */
        this.axisLabelInterval = 0;
        /** @private */
        this.dateTimeAxisLabelInterval = [];
        /** @private */
        this.maxLength = 0;
        /** @private */
        this.min = 0;
        /** @private */
        this.max = 0;
        /** @private */
        this.isIntersect = false;
        /** @private */
        this.jsonCellLabel = [];
        this.multiLevelSize = [];
        /** @private */
        this.xAxisMultiLabelHeight = [];
        /** @private */
        this.yAxisMultiLabelHeight = [];
        /** @private */
        this.multiLevelPosition = [];
    }
    /**
     * measure the axis title and label size
     * @param axis
     * @param heatmap
     * @private
     */
    computeSize(axis, heatmap, rect) {
        let size = new Size(0, 0);
        let innerPadding = 10;
        this.titleSize = axis.getTitleSize(axis, innerPadding);
        this.maxLabelSize = axis.getMaxLabelSize(axis, heatmap);
        this.getMultilevelLabelsHeight(axis, rect, heatmap);
        for (let i = 0; i < this.multiLevelLabels.length; i++) {
            size = axis.multiLevelLabelSize(innerPadding, i);
            this.multiLevelSize.push(size);
        }
    }
    /**
     * calculating x, y position of multi level labels
     * @private
     */
    multiPosition(axis, index) {
        let innerPadding = axis.orientation === 'Horizontal' ? 10 : 20;
        let multiPosition = new MultiLevelPosition(0, 0);
        if (axis.orientation === 'Horizontal') {
            let level0 = axis.maxLabelSize.height + innerPadding;
            let level1 = this.xAxisMultiLabelHeight[index - 1];
            multiPosition.x = (axis.isInversed ? axis.rect.x + axis.rect.width : axis.rect.x);
            multiPosition.y = index === 0 ? axis.rect.y + (axis.opposedPosition ? -level0 : level0) :
                axis.multiLevelPosition[index - 1].y + (axis.opposedPosition ? -level1 : level1);
        }
        else {
            let level0 = axis.maxLabelSize.width + innerPadding;
            let level1 = index !== 0 && (this.multiLevelSize[index - 1].width);
            multiPosition.x = index === 0 ? axis.rect.x - (axis.opposedPosition ? -level0 : level0) :
                axis.multiLevelPosition[index - 1].x - (axis.opposedPosition ? -(level1 + innerPadding) : level1 + innerPadding);
            multiPosition.y = axis.isInversed ? axis.rect.y : axis.rect.y + axis.rect.height;
        }
        return multiPosition;
    }
    multiLevelLabelSize(innerPadding, index) {
        let labelSize = new Size(0, 0);
        let multiLevel = this.multiLevelLabels;
        let categoryLabel = multiLevel[index].categories;
        for (let i = 0; i < categoryLabel.length; i++) {
            let size = measureText(categoryLabel[i].text, multiLevel[index].textStyle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        let size = (this.orientation === 'Horizontal') ? this.xAxisMultiLabelHeight[index] : this.yAxisMultiLabelHeight[index];
        if (this.opposedPosition) {
            this.farSizes.push(size);
        }
        else {
            this.nearSizes.push(size);
        }
        return labelSize;
    }
    getMultilevelLabelsHeight(axis, rect, heatmap) {
        let labelSize;
        let gap;
        let height;
        let multiLevelLabelsHeight = [];
        let start;
        let end;
        let startPosition;
        let endPosition;
        let isVertical = axis.orientation === 'Vertical';
        let axisValue = (isVertical ? rect.height : rect.width) / axis.axisLabelSize;
        let padding = axis.orientation === 'Vertical' ? 20 : 10;
        this.multiLevelLabels.map((multiLevel, index) => {
            multiLevel.categories.map((categoryLabel) => {
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(categoryLabel.end));
                if (categoryLabel.text !== '' && categoryLabel.start !== null && categoryLabel.end !== null) {
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    height = isVertical ? labelSize.width : labelSize.height;
                    startPosition = heatmap.heatMapAxis.calculateLeftPosition(axis, start, categoryLabel.start, rect);
                    endPosition = heatmap.heatMapAxis.calculateWidth(axis, categoryLabel.end, end, rect);
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endPosition - startPosition) :
                        categoryLabel.maximumTextWidth);
                    if ((labelSize.width > gap - padding) && (multiLevel.overflow === 'Wrap') && !isVertical) {
                        height = (height * (textWrap(categoryLabel.text, gap - padding, multiLevel.textStyle).length));
                    }
                    multiLevelLabelsHeight[index] = !multiLevelLabelsHeight[index] ? height + padding :
                        ((multiLevelLabelsHeight[index] < height) ? height + padding : multiLevelLabelsHeight[index]);
                }
            });
        });
        if (isVertical) {
            this.yAxisMultiLabelHeight = multiLevelLabelsHeight;
        }
        else {
            this.xAxisMultiLabelHeight = multiLevelLabelsHeight;
        }
    }
    getTitleSize(axis, innerPadding) {
        let titleSize = new Size(0, 0);
        if (this.title.text) {
            titleSize = measureText(this.title.text, this.title.textStyle);
            titleSize.height += innerPadding;
        }
        if (axis.opposedPosition) {
            this.farSizes.push(titleSize.height);
        }
        else {
            this.nearSizes.push(titleSize.height);
        }
        return titleSize;
    }
    getMaxLabelSize(axis, heatmap) {
        let labelSize = new Size(0, 0);
        let labels = this.axisLabels;
        let padding = (axis.border.width > 0 || axis.multiLevelLabels.length > 0) ? 10 : 0;
        axis.angle = axis.labelRotation;
        axis.isIntersect = false;
        if (axis.orientation === 'Horizontal' && (axis.labelIntersectAction === 'Rotate45' ||
            (axis.labelRotation % 180 === 0 && axis.labelIntersectAction === 'Trim'))) {
            let interval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                heatmap.initialClipRect.width / axis.axisLabelSize : heatmap.initialClipRect.width / axis.axisLabels.length;
            let startX = heatmap.initialClipRect.x + ((!axis.isInversed) ? 0 : heatmap.initialClipRect.width);
            let previousEnd;
            let previousStart;
            for (let i = 0, len = labels.length; i < len; i++) {
                let label = labels[i];
                let elementSize = measureText(label, axis.textStyle);
                let axisInterval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] * interval : interval;
                let startPoint = startX + (!axis.isInversed ?
                    ((interval - elementSize.width) / 2) : -((interval + elementSize.width) / 2));
                startPoint = startPoint < heatmap.initialClipRect.x ? heatmap.initialClipRect.x : startPoint;
                let endPoint = startPoint + elementSize.width;
                if (!axis.isInversed) {
                    if (isNullOrUndefined(previousEnd)) {
                        previousEnd = endPoint;
                    }
                    else if ((startPoint < previousEnd)) {
                        if (axis.labelIntersectAction === 'Rotate45') {
                            axis.angle = 45;
                        }
                        else {
                            axis.isIntersect = true;
                        }
                        break;
                    }
                    previousEnd = endPoint;
                }
                else {
                    if (isNullOrUndefined(previousStart)) {
                        previousStart = startPoint;
                    }
                    else if ((previousStart < endPoint)) {
                        if (axis.labelIntersectAction === 'Rotate45') {
                            axis.angle = 45;
                        }
                        else {
                            axis.isIntersect = true;
                        }
                        break;
                    }
                    previousStart = startPoint;
                }
                startX += axis.isInversed ? -axisInterval : axisInterval;
            }
        }
        for (let i = 0; i < labels.length; i++) {
            let size = (axis.angle % 180 === 0) ?
                measureText(labels[i], axis.textStyle) : rotateTextSize(axis.textStyle, labels[i], axis.angle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        if (axis.opposedPosition) {
            this.farSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        }
        else {
            this.nearSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        }
        return labelSize;
    }
    /**
     * Generate the axis lables for numeric axis
     * @param heatmap
     * @private
     */
    calculateNumericAxisLabels(heatmap) {
        //Axis Min
        let min = 0;
        let max = 0;
        let interval = this.interval ? this.interval : 1;
        let adaptorMin;
        let adaptorMax;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.min : heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.max : heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        min = !isNullOrUndefined(this.minimum) ? this.minimum : ((adaptorMin) ? adaptorMin : 0);
        max = !isNullOrUndefined(this.maximum) ? this.maximum :
            ((adaptorMax) ? adaptorMax : (this.maxLength * this.increment));
        let temp;
        if (this.minimum && this.maximum && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        max = !isNullOrUndefined(this.maximum) ? max : (adaptorMax ? adaptorMax : (max + min));
        let format = this.labelFormat;
        let isCustom = format.match('{value}') !== null;
        this.format = heatmap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        for (let i = min; i <= max; i = i + (interval * this.increment)) {
            let value = formatValue(isCustom, format, i, this.format);
            this.axisLabels.push(value);
        }
        this.min = 0;
        this.axisLabelSize = Math.floor(((max - min) / this.increment) + 1);
        this.max = this.axisLabelSize - 1;
        this.axisLabelInterval = interval;
        for (let i = min; i <= max; i = i + this.increment) {
            let value = formatValue(isCustom, format, i, this.format);
            this.tooltipLabels.push(value);
            this.labelValue.push(i);
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }
    /**
     * Generate the axis lables for category axis
     * @private
     */
    calculateCategoryAxisLabels() {
        let labels = this.labels ? this.labels : [];
        labels = (labels.length > 0) ? labels : this.jsonCellLabel;
        let min = !isNullOrUndefined(this.minimum) ? this.minimum : 0;
        let max = !isNullOrUndefined(this.maximum) ? this.maximum : this.maxLength;
        let interval = this.interval ? this.interval : 1;
        let temp;
        if (!isNullOrUndefined(this.minimum) && !isNullOrUndefined(this.maximum) && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        if (labels && labels.length > 0) {
            for (let i = min; i <= max; i = i + interval) {
                let value = labels[i] ? labels[i].toString() : i.toString();
                this.axisLabels.push(value);
            }
        }
        else {
            for (let i = min; i <= max; i = i + interval) {
                this.axisLabels.push(i.toString());
            }
        }
        for (let i = min; i <= max; i++) {
            this.tooltipLabels.push(labels[i] ? labels[i].toString() : i.toString());
            this.labelValue.push(labels[i] ? labels[i].toString() : i.toString());
        }
        this.min = min;
        this.max = max;
        this.axisLabelSize = max - min + 1;
        this.axisLabelInterval = interval;
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }
    /**
     * Generate the axis labels for date time axis.
     * @param heatmap
     * @private
     */
    calculateDateTimeAxisLabel(heatmap) {
        let interval = this.interval ? this.interval : 1;
        let option = {
            skeleton: 'full',
            type: 'dateTime'
        };
        let dateParser = heatmap.intl.getDateParser(option);
        let dateFormatter = heatmap.intl.getDateFormat(option);
        let min;
        let max;
        let adaptorMin = null;
        let adaptorMax = null;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.min :
                heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.max :
                heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        let minimum = this.minimum ? this.minimum : (adaptorMin ? adaptorMin : null);
        let maximum = this.maximum ? this.maximum : (adaptorMax ? adaptorMax : null);
        if (minimum === null && maximum === null) {
            min = 0;
            max = this.maxLength * this.increment;
            for (let i = min; i <= max; i = i + (interval * this.increment)) {
                this.axisLabels.push(i.toString());
                this.tooltipLabels.push(i.toString());
                this.labelValue.push(i.toString());
            }
            this.min = 0;
            this.max = this.maxLength;
            this.axisLabelSize = (max - min) / this.increment + 1;
            this.axisLabelInterval = interval;
        }
        else {
            if (minimum !== null && maximum === null) {
                min = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: minimum }).val))));
                max = increaseDateTimeInterval(min, this.maxLength, this.intervalType, this.increment).getTime();
            }
            else if (minimum === null && maximum !== null) {
                max = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: maximum }).val))));
                min = increaseDateTimeInterval(max, -this.maxLength, this.intervalType, this.increment).getTime();
            }
            else {
                min = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: minimum }).val))));
                max = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: maximum }).val))));
            }
            this.format = heatmap.intl.getDateFormat({
                format: this.labelFormat, skeleton: this.getSkeleton()
            });
            let tempInterval = min;
            while (tempInterval <= max) {
                let value = this.format(new Date(tempInterval));
                this.axisLabels.push(value);
                if (this.showLabelOn !== 'None') {
                    interval = this.calculateLabelInterval(tempInterval);
                    this.dateTimeAxisLabelInterval.push(interval);
                }
                tempInterval = increaseDateTimeInterval(tempInterval, interval, this.intervalType, this.increment).getTime();
            }
            this.min = 0;
            this.axisLabelInterval = interval;
            this.axisLabelSize = this.getTotalLabelLength(min, max); // this.tooltipLabels.length;
            this.max = this.axisLabelSize - 1;
            tempInterval = min;
            while (tempInterval <= max) {
                let value = this.format(new Date(tempInterval));
                this.tooltipLabels.push(value);
                this.labelValue.push(new Date(tempInterval));
                tempInterval = increaseDateTimeInterval(tempInterval, 1, this.intervalType, this.increment).getTime();
            }
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }
    calculateLabelInterval(interval) {
        let year = new Date(interval).getFullYear();
        let month = new Date(interval).getMonth() + 1;
        let day = new Date(interval).getDate();
        let numberOfDays;
        let tempInterval;
        if (this.showLabelOn === 'Years' || this.showLabelOn === 'Months') {
            if (this.showLabelOn === 'Years' && this.intervalType === 'Months') {
                tempInterval = Math.ceil(12 / this.increment);
            }
            else {
                numberOfDays = this.showLabelOn === 'Years' ? year % 4 === 0 ? 366 : 365 : new Date(year, month, 0).getDate();
                numberOfDays += 1 - day;
                tempInterval = this.intervalType === 'Days' ? Math.ceil(numberOfDays / this.increment) : this.intervalType === 'Hours' ?
                    Math.ceil((numberOfDays * 24) / this.increment) : this.intervalType === 'Minutes' ?
                    Math.ceil((numberOfDays * 24 * 60) / this.increment) : 1;
            }
        }
        else if (this.showLabelOn === 'Days') {
            tempInterval = this.intervalType === 'Hours' ? Math.ceil(24 / this.increment) : this.intervalType === 'Minutes' ?
                Math.ceil((24 * 60) / this.increment) : 1;
        }
        else if (this.showLabelOn === 'Hours') {
            let minutes = new Date(interval).getMinutes();
            tempInterval = this.intervalType === 'Minutes' ? Math.ceil((60 - minutes) / this.increment) : 1;
        }
        else {
            tempInterval = 1;
        }
        return tempInterval;
    }
    /**
     * @private
     */
    getSkeleton() {
        let skeleton;
        if (this.intervalType === 'Years') {
            skeleton = 'yMMM';
        }
        else if (this.intervalType === 'Months') {
            skeleton = 'MMMd';
        }
        else if (this.intervalType === 'Days') {
            skeleton = 'yMd';
        }
        else if (this.intervalType === 'Hours') {
            skeleton = 'EHm';
        }
        else if (this.intervalType === 'Minutes') {
            skeleton = 'Hms';
        }
        else {
            skeleton = 'Hms';
        }
        return skeleton;
    }
    /** @private */
    getTotalLabelLength(min, max) {
        let length = 0;
        let minimum = new Date(min);
        let maximum = new Date(max);
        let difference;
        let days;
        switch (this.intervalType) {
            case 'Years':
                let years = ((maximum.getFullYear() - minimum.getFullYear()) / this.increment) + 1;
                length = Math.floor(years);
                break;
            case 'Months':
                let months = (maximum.getFullYear() - minimum.getFullYear()) * 12;
                months -= minimum.getMonth();
                months += maximum.getMonth();
                length = months <= 0 ? 1 : Math.floor((months / this.increment) + 1);
                break;
            case 'Days':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                days = Math.floor(difference / (1000 * 3600 * 24));
                length = Math.floor((days / this.increment) + 1);
                break;
            case 'Hours':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                let hours = Math.floor(difference / (1000 * 3600));
                length = Math.floor(hours / this.increment) + 1;
                break;
            case 'Minutes':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                let minutes = Math.floor(difference / (1000 * 60));
                length = Math.floor(minutes / this.increment) + 1;
                break;
        }
        return length;
    }
    /**
     * Clear the axis label collection
     * @private
     */
    clearAxisLabel() {
        this.axisLabels = [];
        this.tooltipLabels = [];
        this.dateTimeAxisLabelInterval = [];
        this.labelValue = [];
    }
}
__decorate$3([
    Complex({ text: '', textStyle: Theme.axisTitleFont }, Title)
], Axis.prototype, "title", void 0);
__decorate$3([
    Property(false)
], Axis.prototype, "opposedPosition", void 0);
__decorate$3([
    Property(null)
], Axis.prototype, "labels", void 0);
__decorate$3([
    Complex(Theme.axisLabelFont, Font)
], Axis.prototype, "textStyle", void 0);
__decorate$3([
    Property(0)
], Axis.prototype, "labelRotation", void 0);
__decorate$3([
    Property(false)
], Axis.prototype, "isInversed", void 0);
__decorate$3([
    Property('Category')
], Axis.prototype, "valueType", void 0);
__decorate$3([
    Property(1)
], Axis.prototype, "increment", void 0);
__decorate$3([
    Property('None')
], Axis.prototype, "showLabelOn", void 0);
__decorate$3([
    Property(null)
], Axis.prototype, "minimum", void 0);
__decorate$3([
    Property(null)
], Axis.prototype, "maximum", void 0);
__decorate$3([
    Property(null)
], Axis.prototype, "interval", void 0);
__decorate$3([
    Property('')
], Axis.prototype, "labelFormat", void 0);
__decorate$3([
    Property('Days')
], Axis.prototype, "intervalType", void 0);
__decorate$3([
    Property('Trim')
], Axis.prototype, "labelIntersectAction", void 0);
__decorate$3([
    Complex({ color: '#b5b5b5', width: 0, type: 'Rectangle' }, AxisLabelBorder)
], Axis.prototype, "border", void 0);
__decorate$3([
    Collection([], MultiLevelLabels)
], Axis.prototype, "multiLevelLabels", void 0);

class AxisHelper {
    constructor(heatMap) {
        this.heatMap = heatMap;
        this.padding = 10;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }
    /**
     * To render the x and y axis.
     *  @private
     */
    renderAxes() {
        this.initialClipRect = this.heatMap.initialClipRect;
        let heatMap = this.heatMap;
        let axisElement;
        let element;
        if (!heatMap.enableCanvasRendering) {
            axisElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'AxisCollection' });
        }
        let axes = this.heatMap.axisCollections;
        for (let i = 0, len = axes.length; i < len; i++) {
            let axis = axes[i];
            if (axis.orientation === 'Horizontal') {
                if (!heatMap.enableCanvasRendering) {
                    element = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisGroup' });
                }
                this.drawXAxisLine(element, axis);
                this.drawXAxisTitle(axis, element, axis.rect);
                this.drawXAxisLabels(axis, element, axis.rect);
            }
            else {
                element = heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisGroup' });
                this.drawYAxisLine(element, axis);
                this.drawYAxisTitle(axis, element, axis.rect);
                this.drawYAxisLabels(axis, element, axis.rect);
            }
            if (axis.multiLevelLabels.length > 0) {
                this.drawMultiLevels(element, axis);
            }
            if (!heatMap.enableCanvasRendering) {
                axisElement.appendChild(element);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.heatMap.svgObject.appendChild(axisElement);
        }
    }
    drawXAxisLine(parent, axis) {
        let y = this.initialClipRect.y + (!axis.opposedPosition ? this.initialClipRect.height : 0);
        let line = new LineOption(this.heatMap.element.id + '_XAxisLine', new Line(this.initialClipRect.x, y, this.initialClipRect.x + this.initialClipRect.width, y), 'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }
    drawYAxisLine(parent, axis) {
        let x = this.initialClipRect.x + ((!axis.opposedPosition) ? 0 : this.initialClipRect.width);
        let line = new LineOption(this.heatMap.element.id + '_YAxisLine', new Line(x, this.initialClipRect.y, x, this.initialClipRect.height + this.initialClipRect.y), 'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }
    drawXAxisTitle(axis, parent, rect) {
        let titlepadding = (axis.textStyle.size === '0px' ? 0 : 10);
        let y = rect.y + (!axis.opposedPosition ? (axis.maxLabelSize.height + titlepadding +
            sum(axis.xAxisMultiLabelHeight)) : -(axis.maxLabelSize.height + titlepadding + sum(axis.xAxisMultiLabelHeight)));
        if (axis.title.text) {
            let heatMap = this.heatMap;
            let title = axis.title;
            let elementSize = measureText(title.text, title.textStyle);
            let padding = this.padding;
            let anchor = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            padding = axis.opposedPosition ? -(padding + elementSize.height / 4) : (padding + (3 * elementSize.height / 4));
            let options = new TextOption(heatMap.element.id + '_XAxisTitle', new TextBasic(rect.x + titlePositionX(rect.width, 0, 0, title.textStyle), y + padding, anchor, title.text), title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            this.drawSvgCanvas.createText(options, parent, title.text);
        }
    }
    drawYAxisTitle(axis, parent, rect) {
        if (axis.title.text) {
            let title = axis.title;
            let heatMap = this.heatMap;
            let labelRotation = (axis.opposedPosition) ? 90 : -90;
            let elementSize = measureText(title.text, title.textStyle);
            let anchor = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            let padding = 10;
            padding = axis.opposedPosition ? padding : -padding;
            let titlepadding = (axis.textStyle.size === '0px' ? 0 : padding);
            let x = rect.x + titlepadding + ((axis.opposedPosition) ? axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight) :
                -(axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight)));
            let y = rect.y + titlePositionY(rect, 0, 0, title.textStyle) + (axis.opposedPosition ? this.padding : -this.padding);
            let options = new TextOption(heatMap.element.id + '_YAxisTitle', new TextBasic(x, y - this.padding, anchor, title.text, labelRotation, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', 'auto'), title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            if (!this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.createText(options, parent, title.text);
            }
            else {
                this.drawSvgCanvas.canvasDrawText(options, title.text, x, y);
            }
        }
    }
    /**
     * Get the visible labels for both x and y axis
     * @private
     */
    calculateVisibleLabels() {
        let heatmap = this.heatMap;
        let axis;
        let axisCollection = heatmap.axisCollections;
        let data = this.heatMap.dataSourceSettings;
        let processLabels = !(data && data.isJsonData && data.adaptorType === 'Cell');
        for (let i = 0, len = axisCollection.length; i < len; i++) {
            axis = axisCollection[i];
            if (axis.valueType === 'Numeric' && processLabels) {
                axis.clearAxisLabel();
                axis.calculateNumericAxisLabels(this.heatMap);
            }
            else if (axis.valueType === 'DateTime' && processLabels) {
                axis.clearAxisLabel();
                axis.calculateDateTimeAxisLabel(this.heatMap);
            }
            else if (axis.valueType === 'Category') {
                axis.clearAxisLabel();
                axis.calculateCategoryAxisLabels();
            }
            axis.tooltipLabels = axis.isInversed ? axis.tooltipLabels.reverse() : axis.tooltipLabels;
        }
    }
    /**
     * Measure the title and labels rendering position for both X and Y axis.
     * @param rect
     * @private
     */
    measureAxis(rect) {
        let heatmap = this.heatMap;
        let axis;
        let axisCollection = heatmap.axisCollections;
        for (let i = axisCollection.length - 1; i >= 0; i--) {
            axis = axisCollection[i];
            let padding = axis.textStyle.size === '0px' ? 0 : this.padding;
            axis.nearSizes = [];
            axis.farSizes = [];
            axis.computeSize(axis, heatmap, rect);
            if (!axis.opposedPosition) {
                if (axis.orientation === 'Horizontal') {
                    rect.height -= (sum(axis.nearSizes) + padding);
                }
                else {
                    rect.x += sum(axis.nearSizes) + padding;
                    rect.width -= sum(axis.nearSizes) + padding;
                }
            }
            else {
                if (axis.orientation === 'Horizontal') {
                    rect.y += sum(axis.farSizes) + padding;
                    rect.height -= sum(axis.farSizes) + padding;
                }
                else {
                    rect.width -= sum(axis.farSizes) + padding;
                }
            }
        }
    }
    /**
     * Calculate the X and Y axis line position
     * @param rect
     * @private
     */
    calculateAxisSize(rect) {
        let heatmap = this.heatMap;
        let axisCollection = heatmap.axisCollections;
        for (let i = 0, len = axisCollection.length; i < len; i++) {
            let axis = axisCollection[i];
            axis.rect = extend({}, rect, null, true);
            if (axis.orientation === 'Horizontal' && !axis.opposedPosition) {
                axis.rect.y = rect.y + rect.height;
                axis.rect.height = 0;
            }
            if (axis.orientation === 'Vertical' && axis.opposedPosition) {
                axis.rect.x = rect.x + rect.width;
                axis.rect.width = 0;
            }
            axis.multiLevelPosition = [];
            for (let i = 0; i < axis.multiLevelLabels.length; i++) {
                let multiPosition = axis.multiPosition(axis, i);
                axis.multiLevelPosition.push(multiPosition);
            }
        }
    }
    drawXAxisLabels(axis, parent, rect) {
        let heatMap = this.heatMap;
        let labels = axis.axisLabels;
        let interval = rect.width / axis.axisLabelSize;
        let compactInterval = 0;
        let axisInterval = axis.interval ? axis.interval : 1;
        let tempintervel = rect.width / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1;
                tempintervel = rect.width / (axis.axisLabelSize / temp);
            }
        }
        else {
            temp = axis.tooltipLabels.length;
        }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp;
            labels = axis.tooltipLabels;
            axisInterval = temp;
        }
        let padding = 10;
        let lableStrtX = rect.x + (!axis.isInversed ? 0 : rect.width);
        let labelPadding;
        let angle = axis.angle;
        padding = this.padding;
        let labelElement;
        let borderElement;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabelBorder' });
        }
        for (let i = 0, len = labels.length; i < len; i++) {
            let lableRect = new Rect(lableStrtX, rect.y, interval, rect.height);
            let label = (axis.labelIntersectAction === 'Trim' && axis.isIntersect) ? axis.valueType !== 'DateTime' ||
                axis.showLabelOn === 'None' ? textTrim(interval * axisInterval, labels[i], axis.textStyle) :
                textTrim(axis.dateTimeAxisLabelInterval[i] * interval, labels[i], axis.textStyle) : labels[i];
            let elementSize = measureText(label, axis.textStyle);
            let transform;
            labelPadding = (axis.opposedPosition) ?
                -(padding)
                : (padding + ((angle % 360) === 0 ? (elementSize.height / 2) : 0));
            let x = lableRect.x + ((!axis.isInversed) ?
                (lableRect.width / 2) - (elementSize.width / 2) : -((lableRect.width / 2) + (elementSize.width / 2)));
            if (axis.labelIntersectAction === 'Trim') {
                x = (!axis.isInversed) ? (x >= lableRect.x ? x : lableRect.x) : (x > (lableStrtX - interval) ? x : (lableStrtX - interval));
            }
            else if (angle % 180 === 0) {
                x = x < rect.x ? rect.x : x;
                x = ((x + elementSize.width) > (rect.x + rect.width)) ? (rect.x + rect.width - elementSize.width) : x;
            }
            let y = rect.y + labelPadding;
            this.drawXAxisBorder(axis, borderElement, axis.rect, x, elementSize.width, i);
            if (angle % 360 !== 0) {
                angle = (angle > 360) ? angle % 360 : angle;
                let rotateSize = rotateTextSize(axis.textStyle, label, angle);
                let diffHeight = axis.maxLabelSize.height - Math.ceil(rotateSize.height - elementSize.height);
                let yLocation = axis.opposedPosition ? diffHeight / 2 : -diffHeight / 2;
                x = lableRect.x + (axis.isInversed ? -(lableRect.width / 2) : (lableRect.width / 2));
                y = y + (axis.opposedPosition ? -(rotateSize.height / 2) :
                    (((angle % 360) === 180 || (angle % 360) === -180) ? 0 : (rotateSize.height) / 2));
                transform = 'rotate(' + angle + ',' + x + ','
                    + y + ')';
            }
            let options = new TextOption(heatMap.element.id + '_XAxis_Label' + i, new TextBasic(x, y, (angle % 360 === 0) ? 'start' : 'middle', label, angle, transform), axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (angle !== 0 && this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.canvasDrawText(options, label);
            }
            else {
                this.drawSvgCanvas.createText(options, labelElement, label);
            }
            if (compactInterval === 0) {
                let labelInterval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStrtX = lableStrtX + (!axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            }
            else {
                lableStrtX = lableStrtX + (!axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
            }
            if (label.indexOf('...') !== -1) {
                this.heatMap.tooltipCollection.push(new CanvasTooltip(labels[i], new Rect(x, y - elementSize.height, elementSize.width, elementSize.height)));
            }
            if (compactInterval !== 0) {
                i = i + (compactInterval - 1);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
            parent.appendChild(borderElement);
        }
    }
    drawYAxisLabels(axis, parent, rect) {
        let heatMap = this.heatMap;
        let labels = axis.axisLabels;
        let interval = rect.height / axis.axisLabelSize;
        let compactInterval = 0;
        let tempintervel = rect.height / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1;
                tempintervel = rect.height / (axis.axisLabelSize / temp);
            }
        }
        else {
            temp = axis.tooltipLabels.length;
        }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp;
            labels = axis.tooltipLabels;
        }
        let padding = 10;
        let lableStartY = rect.y + (axis.isInversed ? 0 : rect.height);
        let anchor = axis.opposedPosition ? 'start' : 'end';
        padding = axis.opposedPosition ? padding : -padding;
        let labelElement;
        let borderElement;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabelBorder' });
        }
        for (let i = 0, len = labels.length; i < len; i++) {
            let labelRect = new Rect(rect.x, lableStartY, rect.width, interval);
            let position = labelRect.height / 2; //titlePositionY(lableRect, 0, 0, axis.textStyle);
            let x = labelRect.x + padding;
            let y = labelRect.y + (axis.isInversed ? position : -position);
            let options = new TextOption(heatMap.element.id + '_YAxis_Label' + i, new TextBasic(x, y, anchor, labels[i], 0, 'rotate(' + 0 + ',' + (x) + ',' + (y) + ')', 'middle'), axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                options.dy = '1ex';
            }
            this.drawSvgCanvas.createText(options, labelElement, labels[i]);
            if (compactInterval === 0) {
                let labelInterval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStartY = lableStartY + (axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            }
            else {
                lableStartY = lableStartY + (axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
                i = i + (compactInterval - 1);
            }
            let elementSize = measureText(labels[i], axis.textStyle);
            this.drawYAxisBorder(axis, borderElement, axis.rect, y, elementSize.height, i);
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
            parent.appendChild(borderElement);
        }
    }
    drawXAxisBorder(axis, parent, rect, lableX, width, index) {
        let interval = rect.width / axis.axisLabelSize;
        let path = '';
        let padding = 10;
        let axisInterval = axis.interval ? axis.interval : 1;
        let startX = axis.isInversed ? rect.x + rect.width - (interval * index * axisInterval) :
            rect.x + (interval * index * axisInterval);
        let startY = rect.y;
        let endX;
        let endY;
        endY = startY + (axis.opposedPosition ? -(axis.maxLabelSize.height + padding) : axis.maxLabelSize.height + padding);
        endX = axis.isInversed ? startX - interval : startX + interval;
        switch (axis.border.type) {
            case 'Rectangle':
                path = ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY);
                break;
            case 'WithoutTopBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
            case 'WithoutBottomBorder':
                path = 'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
                let padding = 3;
                endY = startY + ((endY - startY) / 2) + (axis.opposedPosition ? 0 : 5);
                let endY1 = axis.isInversed ? (lableX + width + padding) : (lableX - padding);
                let endY2 = axis.isInversed ? (lableX - padding) : (lableX + width + padding);
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endY1 + ' ' + endY + ' ' + 'M' + ' ' + endY2 +
                    ' ' + endY + ' ' + 'L' +
                    ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
        }
        if (axis.border.width > 0 && axis.border.type !== 'WithoutBorder') {
            this.createAxisBorderElement(axis, path, parent, index);
        }
    }
    drawYAxisBorder(axis, parent, rect, lableY, height, index) {
        let interval = rect.height / axis.axisLabelSize;
        let path = '';
        let padding = 20;
        let axisInterval = axis.interval ? axis.interval : 1;
        let startX = rect.x;
        let startY = axis.isInversed ? rect.y + (interval * index * axisInterval) :
            rect.y + rect.height - (interval * index * axisInterval);
        let endX;
        let endY;
        endX = startX + (!axis.opposedPosition ? -(axis.maxLabelSize.width + padding) : axis.maxLabelSize.width + padding);
        endY = axis.isInversed ? startY + interval : startY - interval;
        switch (axis.border.type) {
            case 'Rectangle':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY;
                break;
            case 'WithoutTopBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'WithoutBottomBorder':
                path = 'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'M' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'Brace':
                endX = startX - (startX - endX) / 2;
                let endY1 = axis.isInversed ? lableY - height / 2 : lableY + height / 2;
                let endY2 = axis.isInversed ? lableY + height / 2 : lableY - height / 2;
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY1 + ' ' + 'M' + ' ' +
                    endX + ' ' + endY2 + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ' +
                    'L' + ' ' + startX + ' ' + endY;
                break;
        }
        if (axis.border.width > 0 && axis.border.type !== 'WithoutBorder') {
            this.createAxisBorderElement(axis, path, parent, index);
        }
    }
    /**
     * To create border element for axis.
     * @return {void}
     * @private
     */
    createAxisBorderElement(axis, labelBorder, parent, index) {
        let canvasTranslate;
        let id = axis.orientation === 'Horizontal' ? '_XAxis_Label_Border' : '_YAxis_Label_Border';
        let pathOptions = new PathOption(this.heatMap.element.id + id + index, 'transparent', axis.border.width, axis.border.color, 1, 'none', labelBorder);
        if (!this.heatMap.enableCanvasRendering) {
            let borderElement = this.heatMap.renderer.drawPath(pathOptions);
            parent.appendChild(borderElement);
        }
        else {
            this.heatMap.canvasRenderer.drawPath(pathOptions, canvasTranslate);
        }
    }
    drawMultiLevels(parent, axis) {
        let element;
        if (!this.heatMap.enableCanvasRendering) {
            element = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_' + axis.orientation + '_MultiLevelLabel' });
        }
        axis.orientation === 'Horizontal' ? this.renderXAxisMultiLevelLabels(axis, element, axis.rect) :
            this.renderYAxisMultiLevelLabels(axis, element, axis.rect);
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(element);
        }
    }
    /**
     * render x axis multi level labels
     * @private
     * @return {void}
     */
    renderXAxisMultiLevelLabels(axis, parent, rect) {
        let x = 0;
        let y;
        let padding = 10;
        let startX;
        let startY;
        let endX = 0;
        let tooltip;
        let start;
        let end;
        let labelSize;
        let anchor;
        let isInversed = axis.isInversed;
        let labelElement;
        let opposedPosition = axis.opposedPosition;
        let pathRect = '';
        let gap;
        let width;
        let textLength;
        let position = (isInversed ? axis.rect.width : 0) + axis.rect.x;
        axis.multiLevelLabels.map((multiLevel, level) => {
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_XAxisMultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel, i) => {
                tooltip = false;
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(categoryLabel.end));
                startX = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                startY = axis.multiLevelPosition[level].y;
                endX = position + this.calculateWidth(axis, categoryLabel.end, end, axis.rect);
                labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endX - startX) : categoryLabel.maximumTextWidth) - padding;
                y = startY + (opposedPosition ? -((axis.xAxisMultiLabelHeight[level] - labelSize.height)) : labelSize.height);
                width = categoryLabel.maximumTextWidth ? categoryLabel.maximumTextWidth : labelSize.width;
                x = !isInversed ? startX + padding : startX - gap;
                if (multiLevel.alignment === 'Center') {
                    x = ((endX - startX) / 2) + startX;
                    x -= (labelSize.width > gap ? gap : labelSize.width) / 2;
                }
                else if (multiLevel.alignment === 'Far') {
                    x = !isInversed ? endX - padding : startX - padding;
                    x -= (labelSize.width > gap ? gap : labelSize.width);
                }
                else {
                    x = !isInversed ? startX + padding : endX + padding;
                }
                if (multiLevel.overflow === 'None' && labelSize.width > Math.abs(endX - startX)) {
                    x = !isInversed ? startX + padding : startX - labelSize.width - padding;
                    anchor = 'start';
                }
                let textBasic = new TextBasic(x, y, anchor, categoryLabel.text, 0, 'translate(0,0)');
                let options = new TextOption(this.heatMap.element.id + '_XAxis_MultiLevel' + level + '_Text' + i, textBasic, multiLevel.textStyle, multiLevel.textStyle.color || this.heatMap.themeStyle.axisLabel);
                if (multiLevel.overflow === 'Wrap') {
                    options.text = textWrap(categoryLabel.text, gap, multiLevel.textStyle);
                    textLength = options.text.length;
                }
                else if (multiLevel.overflow === 'Trim') {
                    options.text = textTrim(gap, categoryLabel.text, multiLevel.textStyle);
                    textLength = 1;
                }
                if (multiLevel.overflow === 'Wrap' && options.text.length > 1) {
                    this.drawSvgCanvas.createWrapText(options, multiLevel.textStyle, labelElement);
                    for (let i = 0; i < options.text.length; i++) {
                        if (options.text[i].indexOf('...') !== -1) {
                            tooltip = true;
                            break;
                        }
                    }
                }
                else {
                    this.drawSvgCanvas.createText(options, labelElement, options.text);
                }
                if (!this.heatMap.enableCanvasRendering) {
                    parent.appendChild(labelElement);
                }
                if (options.text.indexOf('...') !== -1 || options.text[0].indexOf('...') !== -1 || tooltip) {
                    this.heatMap.tooltipCollection.push(new CanvasTooltip(categoryLabel.text, new Rect(x, y - labelSize.height, gap, labelSize.height * textLength)));
                }
                if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                    pathRect = this.renderXAxisLabelBorder(level, axis, startX, startY, endX, pathRect, level, labelSize, gap, x);
                }
            });
            if (pathRect !== '') {
                this.createBorderElement(level, axis, pathRect, parent);
                pathRect = '';
            }
        });
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }
    /**
     * render x axis multi level labels border
     * @private
     * @return {void}
     */
    renderXAxisLabelBorder(labelIndex, axis, startX, startY, endX, path, level, labelSize, gap, x) {
        let path1;
        let path2;
        let endY = startY + (axis.opposedPosition ? -(axis.xAxisMultiLabelHeight[labelIndex]) :
            axis.xAxisMultiLabelHeight[labelIndex]);
        switch (axis.multiLevelLabels[level].border.type) {
            case 'Rectangle':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ';
                break;
            case 'WithoutTopBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
            case 'WithoutBottomBorder':
                path += 'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
                let padding = 3;
                path1 = axis.isInversed ? (labelSize.width > gap ? gap : labelSize.width) + x + padding : x - padding;
                path2 = axis.isInversed ? x - padding : (labelSize.width > gap ? gap : labelSize.width) + x + padding;
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + (startY + (endY - startY) / 2) + ' ' +
                    'L' + ' ' + path1 + ' ' + (startY + (endY - startY) / 2) + ' ' + 'M' + ' ' + path2 + ' ' + (startY +
                    (endY - startY) / 2) + ' ' + 'L' + ' ' + endX + ' ' + (startY + (endY - startY) / 2) +
                    ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
        }
        return path;
    }
    /**
     * render y axis multi level labels
     * @private
     * @return {void}
     */
    renderYAxisMultiLevelLabels(axis, parent, rect) {
        let x = 0;
        let y;
        let padding = 10;
        let startX;
        let startY;
        let startY2;
        let endY;
        let start;
        let end;
        let labelSize;
        let isInversed = axis.isInversed;
        let labelElement;
        let opposedPosition = axis.opposedPosition;
        let pathRect = '';
        let gap;
        let interval = (axis.rect.height / axis.axisLabelSize) / axis.increment;
        let text;
        let position = (!isInversed ? axis.rect.height : 0) + axis.rect.y;
        axis.multiLevelLabels.map((multiLevel, level) => {
            startY2 = axis.multiLevelPosition[level].y;
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_YAxisMultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel, i) => {
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(categoryLabel.end));
                startY = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                startX = axis.multiLevelPosition[level].x;
                endY = position + this.calculateWidth(axis, categoryLabel.start, end, axis.rect);
                labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(startX) : categoryLabel.maximumTextWidth) - padding;
                let maxWidth = Math.abs(startX - (startX - axis.multiLevelSize[level].width - 2 * padding)) / 2 -
                    (labelSize.width / 2);
                x = (axis.opposedPosition ? startX : startX - axis.multiLevelSize[level].width - 2 * padding) + maxWidth;
                y = startY + padding;
                if (multiLevel.overflow !== 'None') {
                    if (multiLevel.overflow === 'Wrap') {
                        text = textWrap(categoryLabel.text, gap, multiLevel.textStyle);
                    }
                    else {
                        text = textTrim(gap, categoryLabel.text, multiLevel.textStyle);
                    }
                }
                if (multiLevel.alignment === 'Center') {
                    y += ((endY - startY) / 2 - (text.length * labelSize.height) / 2);
                }
                else if (multiLevel.alignment === 'Far') {
                    y = isInversed ? endY - labelSize.height / 2 : y - labelSize.height;
                }
                else {
                    y = isInversed ? y + labelSize.height / 2 : endY + labelSize.height;
                }
                if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                    pathRect = this.renderYAxisLabelBorder(level, axis, startX, startY, endY, pathRect, level, labelSize, gap, y);
                }
                let textBasic = new TextBasic(x, y, 'start', categoryLabel.text, 0, 'translate(0,0)');
                let options = new TextOption(this.heatMap.element.id + '_YAxis_MultiLevel' + level + '_Text' + i, textBasic, multiLevel.textStyle, multiLevel.textStyle.color || this.heatMap.themeStyle.axisLabel);
                options.text = text;
                this.drawSvgCanvas.createText(options, labelElement, options.text);
                if (options.text.indexOf('...') !== -1) {
                    this.heatMap.tooltipCollection.push(new CanvasTooltip(categoryLabel.text, new Rect(x, y - labelSize.height, gap, labelSize.height)));
                }
                if (!this.heatMap.enableCanvasRendering) {
                    parent.appendChild(labelElement);
                }
            });
            if (pathRect !== '') {
                this.createBorderElement(level, axis, pathRect, parent);
                pathRect = '';
            }
        });
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }
    /**
     * render x axis multi level labels border
     * @private
     * @return {void}
     */
    renderYAxisLabelBorder(labelIndex, axis, startX, startY, endY, path, level, labelSize, gap, y) {
        let padding = 20;
        let path1;
        let path2;
        let endX = startX - (axis.opposedPosition ? -(axis.multiLevelSize[labelIndex].width + padding) :
            (axis.multiLevelSize[labelIndex].width + padding));
        switch (axis.multiLevelLabels[level].border.type) {
            case 'Rectangle':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ';
                break;
            case 'WithoutTopBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'WithoutBottomBorder':
                path += 'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
                let padding = 10;
                path1 = axis.isInversed ? (y - padding - 5) : (y + (labelSize.height) - padding);
                path2 = axis.isInversed ? (y + (labelSize.height) - padding) : (y - padding - 5);
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + (startX + (endX - startX) / 2) + ' ' + startY + ' ' +
                    'L' + ' ' + (startX + (endX - startX) / 2) + ' ' + path1 + ' ' + 'M' + ' ' + (startX + (endX - startX) / 2) +
                    ' ' + path2 + ' ' + 'L' + ' ' + (startX + (endX - startX) / 2) + ' ' +
                    endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
        }
        return path;
    }
    /**
     * create borer element
     * @return {void}
     * @private
     */
    createBorderElement(borderIndex, axis, path, parent) {
        let canvasTranslate;
        let id = axis.orientation === 'Horizontal' ? 'XAxis' : 'YAxis';
        let pathOptions = new PathOption(this.heatMap.element.id + '_' + id + '_MultiLevel_Rect_' + borderIndex, 'Transparent', axis.multiLevelLabels[borderIndex].border.width, axis.multiLevelLabels[borderIndex].border.color, 1, '', path);
        let borderElement = this.heatMap.renderer.drawPath(pathOptions);
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(borderElement);
        }
        else {
            this.heatMap.canvasRenderer.drawPath(pathOptions, canvasTranslate);
        }
    }
    /**
     * calculate left position of border element
     * @private
     */
    calculateLeftPosition(axis, start, label, rect) {
        let value;
        let interval;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                let min = axis.minimum ? axis.minimum : 0;
                start -= min;
            }
            let size = axis.orientation === 'Horizontal' ? rect.width : rect.height;
            interval = size / (axis.axisLabelSize * axis.increment);
            value = (axis.isInversed ? -1 : 1) * start * interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        else {
            interval = this.calculateNumberOfDays(start, axis, true, rect);
            value = axis.isInversed ? -interval : interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        return value;
    }
    /**
     * calculate width of border element
     * @private
     */
    calculateWidth(axis, label, end, rect) {
        let interval;
        let value;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                let min = axis.minimum ? axis.minimum : 0;
                end -= min;
            }
            let size = axis.orientation === 'Horizontal' ? rect.width : rect.height;
            interval = size / (axis.axisLabelSize * axis.increment);
            value = (axis.isInversed ? -1 : 1) * (end + 1) * interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        else {
            interval = this.calculateNumberOfDays(end, axis, false, rect);
            value = interval;
            value = axis.isInversed ? -value : value;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        return value;
    }
    calculateNumberOfDays(date, axis, start, rect) {
        let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let oneMinute = 60 * 1000;
        let firstDate;
        let secondDate;
        let labels = axis.labelValue;
        let position;
        let interval = (axis.orientation === 'Horizontal' ? rect.width : rect.height) / axis.axisLabelSize;
        let givenDate = new Date(Number(date));
        let days = 0;
        for (let index = 0; index < axis.axisLabelSize; index++) {
            firstDate = new Date(Number(labels[index]));
            secondDate = axis.isInversed ? new Date(Number(labels[index - 1])) : new Date(Number(labels[index + 1]));
            if (index === (axis.isInversed ? 0 : axis.axisLabelSize - 1)) {
                secondDate = new Date(Number(labels[index]));
                if (axis.intervalType === 'Hours') {
                    secondDate = new Date(Number(secondDate.setHours(secondDate.getHours() + 1)));
                }
                else if ((axis.intervalType === 'Minutes')) {
                    secondDate = new Date(Number(secondDate.setMinutes(secondDate.getMinutes() + 1)));
                }
                else if ((axis.intervalType === 'Days')) {
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + 1)));
                }
                else {
                    let numberOfDays = axis.intervalType === 'Months' ?
                        new Date(secondDate.getFullYear(), secondDate.getMonth() + 1, 0).getDate() :
                        secondDate.getFullYear() % 4 === 0 ? 366 : 365;
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + numberOfDays)));
                }
            }
            if (Number(firstDate) <= date && Number(secondDate) >= date) {
                if (axis.intervalType === 'Minutes' || axis.intervalType === 'Hours') {
                    let totalMinutes = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneMinute)));
                    let minutesInHours = Math.abs((firstDate.getTime() - givenDate.getTime()) / (oneMinute));
                    days = (interval / totalMinutes) * minutesInHours;
                    index = axis.isInversed ? axis.axisLabelSize - 1 - index : index;
                    position = index * interval + days;
                    break;
                }
                else {
                    let numberOfDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    start ? givenDate.getDate() : givenDate.setDate(givenDate.getDate() + 1);
                    if (numberOfDays !== 0) {
                        days = (interval / numberOfDays) * (Math.abs((firstDate.getTime() - givenDate.getTime()) / (oneDay)));
                    }
                    index = axis.isInversed ? axis.axisLabelSize - 1 - index : index;
                    position = index * interval + days;
                    break;
                }
            }
        }
        return position;
    }
}

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the CellSettings property in the Heatmap.
 */
class CellSettings extends ChildProperty {
}
__decorate$4([
    Property(true)
], CellSettings.prototype, "showLabel", void 0);
__decorate$4([
    Property('')
], CellSettings.prototype, "format", void 0);
__decorate$4([
    Property(true)
], CellSettings.prototype, "enableCellHighlighting", void 0);
__decorate$4([
    Complex({}, BubbleSize)
], CellSettings.prototype, "bubbleSize", void 0);
__decorate$4([
    Complex({}, Border)
], CellSettings.prototype, "border", void 0);
__decorate$4([
    Complex(Theme.rectLabelFont, Font)
], CellSettings.prototype, "textStyle", void 0);
__decorate$4([
    Property('Rect')
], CellSettings.prototype, "tileType", void 0);
__decorate$4([
    Property('Color')
], CellSettings.prototype, "bubbleType", void 0);
__decorate$4([
    Property(false)
], CellSettings.prototype, "isInversedBubbleSize", void 0);
class Series {
    constructor(heatMap) {
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(this.heatMap);
        this.cellColor = new CellColor(this.heatMap);
    }
    /**
     * To render rect series.
     * @return {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    renderRectSeries() {
        this.createSeriesGroup();
        let heatMap = this.heatMap;
        let isValueInRange = false;
        heatMap.xLength = heatMap.axisCollections[0].axisLabelSize;
        heatMap.yLength = heatMap.axisCollections[1].axisLabelSize; // Series Part
        let tempX = Math.round(heatMap.initialClipRect.x * 100) / 100;
        let tempY = Math.round(heatMap.initialClipRect.y * 100) / 100;
        let dataXIndex = 0;
        let dataYIndex = 0;
        let cellSetting = heatMap.cellSettings;
        let tempWidth = Math.round(((heatMap.initialClipRect.width -
            (cellSetting.border.width / 2)) / heatMap.xLength) * 100) / 100;
        let tempHeight = Math.round(((heatMap.initialClipRect.height -
            (cellSetting.border.width / 2)) / heatMap.yLength) * 100) / 100;
        let tempVal = 0;
        let themeStyle = heatMap.themeStyle;
        let tempBorder;
        let tempRectPosition = [];
        let circleRadius;
        tempBorder = cellSetting.border;
        let borderColor;
        let displayText;
        this.rectPositionCollection = [];
        this.color = '';
        this.bubbleColorValue = [];
        if (heatMap.yAxis.opposedPosition) {
            tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
        }
        circleRadius = this.getBubbleRadius(tempWidth, tempHeight);
        for (let x = 0; x < (heatMap.xLength * heatMap.yLength); x++) {
            if (heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataSourceMinValue = this.heatMap.dataMin[dataYIndex];
                this.heatMap.dataSourceMaxValue = this.heatMap.dataMax[dataYIndex];
            }
            else if (heatMap.paletteSettings.colorGradientMode === 'Row' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataSourceMinValue = this.heatMap.dataMin[dataXIndex];
                this.heatMap.dataSourceMaxValue = this.heatMap.dataMax[dataXIndex];
            }
            this.setTextAndColor(dataXIndex, dataYIndex);
            let rectPosition = new CurrentRect(0, 0, 0, 0, 0, '', 0, 0, 0, 0, true, '', '', true);
            borderColor = tempBorder.color;
            if (this.heatMap.bubbleSizeWithColor) {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, extend('', this.bubbleColorValue, null, true), x, dataYIndex, dataXIndex);
            }
            else {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, this.text, x, dataYIndex, dataXIndex);
            }
            if (cellSetting.showLabel) {
                displayText = this.getFormatedText(this.text, cellSetting.format);
            }
            else {
                displayText = '';
            }
            rectPosition.displayText = displayText;
            if (!isNullOrUndefined(this.heatMap.cellRender)) {
                displayText = this.cellRendering(rectPosition, displayText);
            }
            if ((heatMap.renderingMode === 'Canvas' && parseFloat(tempBorder.width.toString()) === 0) || (!borderColor &&
                cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                borderColor = this.color;
            }
            if (cellSetting.tileType === 'Rect') { // Rectangle/Tile Series
                this.renderTileCell(rectPosition, tempBorder, x, this.color, borderColor);
                this.updateLabelVisibleStatus(tempWidth, tempHeight, displayText);
            }
            else {
                if (cellSetting.bubbleType === 'Color') { // Bubble by same size and different color Series
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, circleRadius);
                    this.updateLabelVisibleStatus((circleRadius * 2) - 12, (circleRadius * 2) - 6, displayText); // 6, 12 - circle padding
                }
                else if (!isNullOrUndefined(this.text) && (cellSetting.bubbleType === 'Size' || cellSetting.bubbleType === 'SizeAndColor')
                    && this.text.toString() !== '') { // Bubble by same color and different size Series
                    if (this.heatMap.paletteSettings.colorGradientMode !== 'Table' && this.heatMap.paletteSettings.type === 'Gradient') {
                        this.heatMap.minColorValue = this.heatMap.dataSourceMinValue;
                        this.heatMap.maxColorValue = this.heatMap.dataSourceMaxValue;
                    }
                    let tempCircleRadius = this.getRadiusBypercentage(parseFloat(this.text.toString()), heatMap.dataSourceMinValue, heatMap.dataSourceMaxValue, circleRadius);
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, tempCircleRadius);
                    this.updateLabelVisibleStatus((tempCircleRadius * 2) - 12, (tempCircleRadius * 2) - 6, displayText);
                }
                else if (cellSetting.bubbleType === 'Sector' && !isNullOrUndefined(this.text) && this.text.toString() !== '') {
                    this.renderSectorCell(rectPosition, tempBorder, x.toString(), this.color, borderColor, circleRadius, this.text);
                    this.checkLabelXDisplay = false;
                    this.checkLabelYDisplay = false;
                }
            }
            tempRectPosition.push(rectPosition);
            if (heatMap.rangeSelection && heatMap.paletteSettings.type === 'Fixed') {
                isValueInRange = this.isCellValueInRange(dataXIndex, dataYIndex);
                rectPosition.visible = isValueInRange;
            }
            if (cellSetting.showLabel && this.checkLabelYDisplay && this.checkLabelXDisplay) {
                let themeCellTextStyle = cellSetting.textStyle;
                let options = new TextOption(heatMap.element.id + '_HeatMapRectLabels_' + x, new TextBasic(Math.round((tempX + tempWidth / 2) * 100) / 100, Math.round((tempY + tempHeight / 2) * 100) / 100, 'middle', displayText, null, null, 'middle'), themeCellTextStyle, themeCellTextStyle.color || this.getSaturatedColor(this.color));
                rectPosition.textId = options.id;
                if (heatMap.rangeSelection && heatMap.paletteSettings.type === 'Fixed') {
                    options.fill = isValueInRange ? options.fill : this.heatMap.themeStyle.toggledColor;
                }
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    options.dy = this.heatMap.cellSettings.tileType === 'Bubble' ? '0.5ex' : '1ex';
                }
                this.drawSvgCanvas.createText(options, this.containerTextObject, displayText);
            }
            if (tempVal === heatMap.xLength - 1) {
                tempY = Math.round((tempY + tempHeight) * 100) / 100;
                tempVal = 0;
                dataYIndex = 0;
                if (heatMap.yAxis.opposedPosition) {
                    tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
                }
                else {
                    tempX = Math.round(heatMap.initialClipRect.x * 100) / 100;
                }
                this.rectPositionCollection.push(tempRectPosition);
                tempRectPosition = [];
                dataXIndex++;
            }
            else {
                tempX = Math.round((tempX + tempWidth) * 100) / 100;
                tempVal++;
                dataYIndex++;
            }
        }
        if (!heatMap.enableCanvasRendering) {
            heatMap.svgObject.appendChild(this.containerRectObject);
            if (cellSetting.showLabel && !(cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                heatMap.svgObject.appendChild(this.containerTextObject);
            }
        }
    }
    /**
     * To toggle the cell text color based on legend selection.
     */
    isCellValueInRange(dataXIndex, dataYIndex) {
        let isValueInRange = false;
        for (let i = 0; i < this.heatMap.toggleValue.length; i++) {
            let minValue;
            let maxValue;
            minValue = (i === 0) && !this.heatMap.isColorRange ? this.heatMap.dataSourceMinValue : this.heatMap.isColorRange ?
                this.heatMap.toggleValue[i].startValue : this.heatMap.toggleValue[i].value;
            if (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'SizeAndColor') {
                maxValue = (i === this.heatMap.toggleValue.length - 1) ? this.heatMap.maxColorValue :
                    this.heatMap.toggleValue[i + 1].value - 0.01;
            }
            else {
                maxValue = (i === this.heatMap.toggleValue.length - 1 && !this.heatMap.isColorRange) ?
                    this.heatMap.dataSourceMaxValue : this.heatMap.isColorRange ?
                    this.heatMap.toggleValue[i].endValue : this.heatMap.toggleValue[i + 1].value - 0.01;
            }
            // tslint:disable-next-line:no-any
            let clonedDataSource = this.heatMap.clonedDataSource;
            let bubbleText = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][1] : '';
            let text = parseFloat(this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'SizeAndColor' ?
                bubbleText.toString() : this.text.toString());
            if (isNaN(text)) {
                isValueInRange = true;
            }
            else if (!isNaN(text) && text >= minValue && text <= maxValue) {
                if (!this.heatMap.toggleValue[i].visible) {
                    isValueInRange = false;
                    break;
                }
                else {
                    isValueInRange = true;
                    break;
                }
            }
            else if (this.heatMap.isColorRange &&
                maxValue >= this.heatMap.toggleValue[i].endValue && i === this.heatMap.toggleValue.length - 1) {
                isValueInRange = true;
                break;
            }
        }
        return isValueInRange;
    }
    /**
     * To customize the cell.
     * @return {void}
     * @private
     */
    cellRendering(rectPosition, text) {
        let xAxis = this.heatMap.axisCollections[0];
        let yAxis = this.heatMap.axisCollections[1];
        let xLabels = xAxis.tooltipLabels;
        let yLabels = yAxis.tooltipLabels.slice().reverse();
        let yLabelValue = yAxis.labelValue.slice().reverse();
        let argData = {
            heatmap: (this.heatMap.isBlazor ? null : this.heatMap),
            cancel: false,
            name: 'cellRender',
            value: rectPosition.value,
            xLabel: xLabels[rectPosition.xIndex].toString(),
            yLabel: yLabels[rectPosition.yIndex].toString(),
            displayText: text,
            xValue: xAxis.labelValue[rectPosition.xIndex],
            yValue: yLabelValue[rectPosition.yIndex],
            cellColor: this.color
        };
        this.heatMap.trigger('cellRender', argData);
        this.color = argData.cellColor;
        return argData.displayText;
    }
    /**
     * To set color and text details.
     * @private
     */
    setTextAndColor(dataXIndex, dataYIndex) {
        let cellSetting = this.heatMap.cellSettings;
        this.bubbleColorValue = [];
        let adaptData = this.heatMap.dataSourceSettings;
        // tslint:disable-next-line:no-any
        let clonedDataSource = this.heatMap.clonedDataSource;
        if (this.heatMap.bubbleSizeWithColor) {
            this.text = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][0]) &&
                clonedDataSource[dataXIndex][dataYIndex][0].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][0] : '';
            this.color = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ?
                this.cellColor.getColorByValue(clonedDataSource[dataXIndex][dataYIndex][1])
                : this.heatMap.isColorValueExist ? this.heatMap.emptyPointColor : this.cellColor.getColorByValue(this.text);
            let tempBubbleCollection = new BubbleTooltipData(adaptData.isJsonData && adaptData.adaptorType === 'Cell' ? adaptData.bubbleDataMapping.size : null, this.text, 'Size');
            this.bubbleColorValue.push(tempBubbleCollection);
            this.bubbleColorValue.push({
                mappingName: adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                    adaptData.bubbleDataMapping.color : null,
                bubbleData: !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                    clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][1] : '',
                valueType: 'Color'
            });
        }
        else {
            this.text = clonedDataSource[dataXIndex][dataYIndex];
            this.color = this.cellColor.getColorByValue(this.text);
        }
    }
    /**
     * To update rect details.
     * @private
     */
    createSeriesGroup() {
        if (!this.heatMap.enableCanvasRendering) {
            this.containerRectObject = this.heatMap.renderer.createGroup({
                id: this.heatMap.element.id + '_Container_RectGroup'
            });
            if (this.heatMap.cellSettings.showLabel &&
                !(this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Sector')) {
                this.containerTextObject = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_Container_TextGroup', transform: 'translate( 0, 0)' });
            }
        }
    }
    /**
     * To update rect details.
     * @private
     */
    updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, text, x, dataXIndex, dataYIndex) {
        rectPosition.x = tempX;
        rectPosition.y = tempY;
        rectPosition.width = tempWidth;
        rectPosition.height = tempHeight;
        rectPosition.value = text;
        rectPosition.id = this.heatMap.element.id + '_HeatMapRect_' + x;
        rectPosition.xIndex = dataXIndex;
        rectPosition.yIndex = dataYIndex;
    }
    /**
     * To Render Tile Cell.
     * @private
     */
    renderTileCell(rectPosition, tempBorder, x, color, borderColor) {
        let rect = new RectOption(this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1, new Rect(rectPosition.x, rectPosition.y, rectPosition.width, rectPosition.height), borderColor || this.heatMap.themeStyle.cellBorder, tempBorder.radius, tempBorder.radius);
        this.drawSvgCanvas.drawRectangle(rect, this.containerRectObject, true);
    }
    /**
     * To get bubble radius.
     * @private
     */
    getBubbleRadius(width, height) {
        let radius = (width / 2) - 2;
        if (height / 2 < width / 2) {
            radius = (height / 2) - 2;
        }
        return radius < 0 ? 0 : radius;
    }
    /**
     * To Render Bubble Cell.
     * @private
     */
    renderSectorCell(bubblePosition, tempBorder, x, color, borderColor, circleRadius, text) {
        let curve;
        let startAngle;
        let endAngle;
        let cX;
        let cY;
        let X1;
        let Y1;
        let tempcX;
        let tempcY;
        let pathBorderWidth;
        let centerX = Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100;
        let centerY = Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100;
        let tempColor = color;
        let sectorContibution = this.getRadiusBypercentage(text, this.heatMap.dataSourceMinValue, this.heatMap.dataSourceMaxValue, 360); // Circle total angle.
        for (let y = 0; y < 2; y++) {
            pathBorderWidth = parseFloat(tempBorder.width.toString());
            if (y === 0) {
                curve = sectorContibution >= 180 ? 1 : 0;
                startAngle = -90;
                if (sectorContibution === 0) {
                    endAngle = 270; // (360 - 90) for zero position adjustment.
                }
                else {
                    endAngle = (sectorContibution - 90);
                }
                cX = Math.round((centerX + circleRadius * Math.cos((sectorContibution - 90) * (Math.PI / 180))) * 100) / 100;
                cY = Math.round((centerY + circleRadius * Math.sin((sectorContibution - 90) * (Math.PI / 180))) * 100) / 100;
                X1 = Math.round(centerX * 100) / 100;
                Y1 = Math.round((centerY - circleRadius) * 100) / 100;
                if (sectorContibution === 0) {
                    tempColor = this.heatMap.emptyPointColor;
                }
            }
            else {
                curve = sectorContibution >= 180 ? 0 : 1;
                startAngle = endAngle;
                endAngle = 270; // (360 - 90) for zero position adjustment.
                tempColor = this.heatMap.emptyPointColor;
                x = x + '_Unfilled';
                tempcX = cX;
                tempcY = cY;
                cX = X1;
                cY = Y1;
                X1 = tempcX;
                Y1 = tempcY;
                if (sectorContibution === 0) {
                    pathBorderWidth = 1;
                    borderColor = color;
                }
            }
            let path = new Path('', false, centerX, centerY, X1, Y1, cX, cY, startAngle, endAngle, circleRadius, true);
            let sector = new PathAttributes(this.heatMap.element.id + '_HeatMapRect_' + x, path, tempColor, tempBorder, pathBorderWidth, 1, borderColor);
            this.calculateShapes(sector, path, sectorContibution, curve);
            this.drawSvgCanvas.drawPath(sector, path, this.containerRectObject);
            if (sectorContibution === 360) {
                break;
            }
        }
    }
    /**
     * To Render sector Cell.
     * @private
     */
    calculateShapes(options, path, sectorContibution, curve) {
        let pathString;
        switch (sectorContibution) {
            case 360:
            case 0:
                if (sectorContibution === 0 && path.start === path.end) {
                    pathString = 'M' + ' ' + options.x + ' ' + options.y + ' ' + 'L' + ' ' + path.x + ' ' + (path.y - path.radius);
                }
                else {
                    pathString = !this.heatMap.enableCanvasRendering ? 'M' + ' ' + options.x + ' ' + options.y + ' ' : '';
                    pathString = pathString + 'm' + ' ' + (-path.radius) + ' ' + '0' + ' ' +
                        'a' + ' ' + path.radius + ' ' + path.radius + ' ' + '0' + ' ' + '1' + ' ' + '0' +
                        ' ' + (path.radius * 2) + ' ' + '0' + ' ' + 'a' + ' ' + path.radius +
                        ' ' + path.radius + ' ' + '0' + ' ' + '1' + ' ' + '0' +
                        ' ' + (-(path.radius * 2)) + ' ' + '0' + ' ';
                }
                merge(options, { 'd': pathString });
                break;
            default:
                pathString = 'M' + ' ' + options.x + ' ' + options.y + ' ' + 'L' + ' ' + path.x1 + ' ' + path.y1 + ' ' +
                    'A' + ' ' + path.radius + ' ' + path.radius + ' ' + '0' + ' ' + curve + ' ' + '1' + ' ' +
                    path.cx + ' ' + path.cy + ' ' + 'Z';
                merge(options, { 'd': pathString });
                break;
        }
    }
    /**
     * To Render Bubble Cell.
     * @private
     */
    renderBubbleCell(bubblePosition, tempBorder, x, color, borderColor, circleRadius) {
        let circle = new CircleOption(this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1, borderColor || this.heatMap.themeStyle.cellBorder, Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100, Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100, circleRadius);
        this.drawSvgCanvas.drawCircle(circle, this.containerRectObject);
    }
    /**
     * To find whether the X,Y Label need to display or not.
     * @private
     */
    updateLabelVisibleStatus(tempWidth, tempHeight, displayText) {
        if (this.heatMap.cellSettings.showLabel) {
            this.checkLabelYDisplay = tempHeight > parseInt(this.heatMap.cellSettings.textStyle.size, 10) ? true : false;
            this.checkLabelXDisplay = tempWidth > (displayText.length *
                (parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2)) ? true : false;
        }
    }
    /**
     * To find percentage value.
     * @private
     */
    getRadiusBypercentage(text, min, max, radius) {
        let minimum = parseInt(this.heatMap.cellSettings.bubbleSize.minimum, 10);
        let maximum = parseInt(this.heatMap.cellSettings.bubbleSize.maximum, 10);
        if (minimum < 0 || minimum > 100 || isNaN(minimum)) {
            minimum = 0;
        }
        if (maximum < 0 || maximum > 100 || isNaN(maximum)) {
            maximum = 100;
        }
        let valueInPrecentage = ((text - min) /
            (max - min)) * 100;
        valueInPrecentage = isNaN(valueInPrecentage) ? 100 : valueInPrecentage;
        if ((this.heatMap.bubbleSizeWithColor ||
            (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Size'))) {
            if (this.heatMap.cellSettings.isInversedBubbleSize) {
                valueInPrecentage = 100 - valueInPrecentage;
            }
            valueInPrecentage = ((valueInPrecentage * (maximum - minimum)) / 100) + minimum;
        }
        radius = radius * (valueInPrecentage / 100);
        return (Math.round(radius * 100) / 100) < 0 ? 0 : (Math.round(radius * 100) / 100);
    }
    /**
     * To find saturated color for datalabel.
     * @return {string}
     * @private
     */
    getSaturatedColor(color) {
        let saturatedColor = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        let rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        let contrast = Math.round((rgbValue.R * 299 + rgbValue.G * 587 + rgbValue.B * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    }
    /**
     * To highlight the mouse hovered rect cell.
     * @return {void}
     * @private
     */
    highlightSvgRect(tempID) {
        if (tempID.indexOf('Celltooltip') === -1) {
            if (tempID.indexOf('_HeatMapRect') !== -1) {
                if (tempID.indexOf('_HeatMapRectLabels_') !== -1) {
                    let tempIndex = tempID.indexOf('_HeatMapRectLabels_') + 19;
                    tempID = this.heatMap.element.id + '_HeatMapRect_' + tempID.slice(tempIndex);
                }
                let element = document.getElementById(tempID);
                if (this.heatMap.tempRectHoverClass !== tempID) {
                    if (this.heatMap.cellSettings.enableCellHighlighting) {
                        let oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                        if (oldElement && !this.heatMap.rectSelected) {
                            oldElement.setAttribute('opacity', '1');
                        }
                        if (element && !this.heatMap.rectSelected) {
                            element.setAttribute('opacity', '0.65');
                        }
                    }
                    this.heatMap.tempRectHoverClass = tempID;
                }
            }
            else {
                if (this.heatMap.cellSettings.enableCellHighlighting) {
                    let oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                    if (oldElement && !this.heatMap.rectSelected) {
                        oldElement.setAttribute('opacity', '1');
                        this.heatMap.tempRectHoverClass = '';
                    }
                }
            }
        }
    }
    /**
     * To get the value depends to format.
     * @return {string}
     * @private
     */
    getFormatedText(val, getFormat) {
        let format = getFormat;
        let isCustom = format.match('{value}') !== null;
        this.format = this.heatMap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        let value = '';
        if (val.toString() !== '') {
            value = formatValue(isCustom, format, val, this.format);
        }
        return value;
    }
    /**
     * To get mouse hovered cell details.
     * @return {CurrentRect}
     * @private
     */
    getCurrentRect(x, y) {
        let currentRect;
        let firstRectDetails = [];
        firstRectDetails.push(this.heatMap.heatMapSeries.rectPositionCollection[0][0]);
        let rectX = Math.ceil((x - firstRectDetails[0].x) / firstRectDetails[0].width) <
            this.heatMap.axisCollections[0].axisLabelSize ?
            Math.ceil((x - firstRectDetails[0].x) / firstRectDetails[0].width) :
            this.heatMap.axisCollections[0].axisLabelSize;
        let rectY = Math.floor(((y - firstRectDetails[0].y) / firstRectDetails[0].height)) <
            this.heatMap.axisCollections[1].axisLabelSize ?
            Math.floor(((y - firstRectDetails[0].y) / firstRectDetails[0].height)) :
            this.heatMap.axisCollections[1].axisLabelSize - 1;
        rectX = rectX === 0 ? 1 : rectX;
        currentRect = this.heatMap.heatMapSeries.rectPositionCollection[rectY][rectX - 1];
        this.hoverXAxisLabel = this.heatMap.axisCollections[0].tooltipLabels[rectX - 1];
        this.hoverXAxisValue = this.heatMap.axisCollections[0].labelValue[rectX - 1];
        this.hoverYAxisLabel = this.heatMap.axisCollections[1].tooltipLabels[(this.heatMap.axisCollections[1].tooltipLabels.length - 1) - rectY];
        this.hoverYAxisValue = this.heatMap.axisCollections[1].labelValue[(this.heatMap.axisCollections[1].labelValue.length - 1) - rectY];
        return currentRect;
    }
}

/**
 * HeatMap tool tip file
 */
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the color property in Heatmap.
 */
class TooltipSettings extends ChildProperty {
}
__decorate$5([
    Property('')
], TooltipSettings.prototype, "template", void 0);
__decorate$5([
    Property('')
], TooltipSettings.prototype, "fill", void 0);
__decorate$5([
    Complex({}, TooltipBorder)
], TooltipSettings.prototype, "border", void 0);
__decorate$5([
    Complex(Theme.tooltipFont, Font)
], TooltipSettings.prototype, "textStyle", void 0);
/**
 *
 * The `Tooltip` module is used to render the tooltip for heatmap series.
 */
class Tooltip$1 {
    constructor(heatMap) {
        /* private */
        this.isFirst = true;
        /* private */
        this.isFadeout = false;
        this.heatMap = heatMap;
    }
    /**
     * Get module name
     */
    getModuleName() {
        return 'Tooltip';
    }
    /**
     * To show/hide Tooltip.
     * @private
     */
    showHideTooltip(isShow, isFadeout) {
        let ele = document.getElementById(this.heatMap.element.id + 'Celltooltipcontainer');
        if (!isShow) {
            if (ele && ele.style.visibility !== 'hidden') {
                if (this.tooltipObject && isFadeout) {
                    this.tooltipObject.fadeOut();
                }
                else {
                    if (this.tooltipObject && this.tooltipObject.element) {
                        let tooltipElement = this.tooltipObject.element.firstChild;
                        tooltipElement.setAttribute('opacity', '0');
                    }
                }
                ele.style.visibility = 'hidden';
            }
            this.isFadeout = true;
        }
        else {
            ele.style.visibility = 'visible';
        }
    }
    /**
     * To destroy the Tooltip.
     * @return {void}
     * @private
     */
    destroy(heatMap) {
        /**
         * Destroy method performed here
         */
    }
    ;
    /**
     * To add Tooltip to the rect cell.
     * @return {void}
     * @private
     */
    createTooltip(currentRect, x, y, tempTooltipText) {
        let offset = null;
        if (this.heatMap.cellSettings.showLabel && this.heatMap.heatMapSeries.checkLabelXDisplay &&
            this.heatMap.heatMapSeries.checkLabelYDisplay) {
            offset = parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2;
        }
        this.tooltipObject = new Tooltip({
            enableAnimation: false,
            offset: offset,
            location: { x: x, y: y },
            availableSize: this.heatMap.availableSize,
            data: {
                xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                value: currentRect.value,
                xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                    this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                    this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null,
            },
            theme: this.heatMap.theme,
            content: tempTooltipText,
            fill: this.heatMap.tooltipSettings.fill,
            template: this.heatMap.tooltipSettings.template === '' ? null : this.heatMap.tooltipSettings.template,
            border: {
                width: this.heatMap.tooltipSettings.border.width,
                color: this.heatMap.tooltipSettings.border.color
            },
            textStyle: {
                size: this.heatMap.tooltipSettings.textStyle.size,
                fontWeight: this.heatMap.tooltipSettings.textStyle.fontWeight.toLowerCase(),
                color: this.heatMap.tooltipSettings.textStyle.color,
                fontStyle: this.heatMap.tooltipSettings.textStyle.fontStyle.toLowerCase(),
                fontFamily: this.heatMap.tooltipSettings.textStyle.fontFamily
            },
            areaBounds: {
                height: this.heatMap.initialClipRect.height + this.heatMap.initialClipRect.y,
                width: this.heatMap.initialClipRect.width, x: this.heatMap.initialClipRect.x
            },
        }, '#' + this.heatMap.element.id + 'Celltooltipcontainer');
    }
    /**
     * To create div container for tooltip.
     * @return {void}
     * @private
     */
    createTooltipDiv(heatMap) {
        let position = 'absolute';
        let top = heatMap.enableCanvasRendering && heatMap.allowSelection ? heatMap.availableSize.height : 0;
        let element2 = createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipcontainer',
            styles: 'position:' + position + '; z-index: 3;top:-' + top + 'px'
        });
        this.heatMap.element.appendChild(createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipparent',
            styles: 'position:relative'
        })
            .appendChild(element2));
    }
    /**
     * To get default tooltip content.
     * @private
     */
    getTooltipContent(currentRect, hetmapSeries) {
        let value;
        let content;
        let heatMap = this.heatMap;
        let adaptData = this.heatMap.dataSourceSettings;
        if (heatMap.bubbleSizeWithColor) {
            let xAxis = heatMap.xAxis.title && heatMap.xAxis.title.text !== '' ? heatMap.xAxis.title.text : 'X-Axis';
            let yAxis = heatMap.yAxis.title && heatMap.yAxis.title.text !== '' ? heatMap.yAxis.title.text : 'Y-Axis';
            let value1 = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                adaptData.bubbleDataMapping.size : 'Value 1';
            let value2 = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                adaptData.bubbleDataMapping.color : 'Value 2';
            value = hetmapSeries.getFormatedText(currentRect.value[0].bubbleData, this.heatMap.cellSettings.format);
            content = [xAxis + ' : ' + hetmapSeries.hoverXAxisLabel + '<br/>'
                    + yAxis + ' : ' + hetmapSeries.hoverYAxisLabel + '<br/>'
                    + value1 + ' : ' + value + '<br/>'
                    + value2 + ' : '
                    + hetmapSeries.getFormatedText(currentRect.value[1].bubbleData, this.heatMap.cellSettings.format)];
        }
        else {
            value = currentRect.value;
            content = [hetmapSeries.hoverXAxisLabel + ' | ' + hetmapSeries.hoverYAxisLabel + ' : ' +
                    hetmapSeries.getFormatedText(value, this.heatMap.cellSettings.format)];
        }
        return content;
    }
    /**
     * To render tooltip.
     * @private
     */
    renderTooltip(currentRect) {
        let hetmapSeries = this.heatMap.heatMapSeries;
        let tempTooltipText = [''];
        let showTooltip = this.heatMap.bubbleSizeWithColor ?
            !isNullOrUndefined(currentRect.value) && !isNullOrUndefined(currentRect.value[0].bubbleData)
                && currentRect.value[0].bubbleData.toString() !== '' ? true : false
            : isNullOrUndefined(currentRect.value) || (!isNullOrUndefined(currentRect.value) &&
                currentRect.value.toString() === '') ? false : true;
        if (!showTooltip) {
            this.showHideTooltip(false, false);
            if (!currentRect.visible) {
                this.showHideTooltip(false, false);
            }
        }
        else {
            if (!isNullOrUndefined(this.heatMap.tooltipRender)) {
                // this.tooltipObject.header = '';
                // this.tooltipObject.content = this.getTemplateText(
                //     currentRect, this.heatMap.tooltipTemplate, hetmapSeries.hoverXAxisLabel,
                //     hetmapSeries.hoverYAxisLabel);
                let content = this.getTooltipContent(currentRect, hetmapSeries);
                let argData = {
                    heatmap: (this.heatMap.isBlazor ? null : this.heatMap),
                    cancel: false,
                    name: 'tooltipRender',
                    value: currentRect.value,
                    xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                    yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                    xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                        this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                    yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                        this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null,
                    content: content
                };
                this.heatMap.trigger('tooltipRender', argData, (observedArgs) => {
                    if (!observedArgs.cancel) {
                        tempTooltipText = observedArgs.content;
                        this.tooltipCallback(currentRect, tempTooltipText);
                    }
                    else {
                        if (this.tooltipObject) {
                            this.showHideTooltip(false);
                        }
                    }
                });
            }
            else {
                //  this.tooltipObject.header = hetmapSeries.hoverYAxisLabel.toString();
                tempTooltipText = this.getTooltipContent(currentRect, hetmapSeries);
                this.tooltipCallback(currentRect, tempTooltipText);
            }
        }
    }
    /**
     * To render tooltip.
     */
    tooltipCallback(currentRect, tempTooltipText) {
        if (!this.tooltipObject) {
            this.createTooltip(currentRect, currentRect.x + (currentRect.width / 2), currentRect.y + (currentRect.height / 2), tempTooltipText);
        }
        else {
            this.tooltipObject.content = tempTooltipText;
            this.tooltipObject.data = {
                xValue: this.heatMap.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMap.heatMapSeries.hoverYAxisValue,
                xLabel: this.heatMap.heatMapSeries.hoverXAxisLabel ?
                    this.heatMap.heatMapSeries.hoverXAxisLabel.toString() : null,
                yLabel: this.heatMap.heatMapSeries.hoverYAxisLabel ?
                    this.heatMap.heatMapSeries.hoverYAxisLabel.toString() : null,
                value: currentRect.value,
            };
        }
        this.showHideTooltip(true);
        this.tooltipObject.enableAnimation = (this.isFirst || this.isFadeout) ? false : true;
        this.isFirst = (this.isFirst) ? false : this.isFirst;
        this.isFadeout = (this.isFadeout) ? false : this.isFadeout;
        this.tooltipObject.location.x = currentRect.x + (currentRect.width / 2);
        this.tooltipObject.location.y = currentRect.y + (currentRect.height / 2);
        if (!currentRect.visible) {
            this.showHideTooltip(false, false);
        }
    }
}

class TwoDimensional {
    constructor(heatMap) {
        this.heatMap = heatMap;
    }
    /**
     * To reconstruct proper two dimensional dataSource depends on min and max values.
     *  @private
     */
    processDataSource(dataSource) {
        // tslint:disable-next-line:no-any
        let tempCloneData = extend([], dataSource, null, true);
        this.heatMap.clonedDataSource = [];
        this.completeDataSource = [];
        let axis = this.heatMap.axisCollections;
        let dataLength = axis[0].maxLength + 1;
        let labelLength = axis[0].axisLabelSize + (axis[0].min > 0 ? axis[0].min : 0);
        let xLength = dataLength > labelLength ? dataLength : labelLength;
        let minVal;
        let maxVal;
        dataLength = axis[1].maxLength + 1;
        labelLength = axis[1].axisLabelSize + (axis[1].min > 0 ? axis[1].min : 0);
        let yLength = dataLength > labelLength ? dataLength : labelLength;
        // tslint:disable-next-line:no-any 
        let tempVariable;
        let cloneDataIndex = 0;
        let minMaxDatasource = [];
        this.tempSizeArray = [];
        this.tempColorArray = [];
        this.heatMap.minColorValue = null;
        this.heatMap.maxColorValue = null;
        this.heatMap.dataMax = [];
        this.heatMap.dataMin = [];
        if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && xLength < yLength) {
            xLength = yLength;
        }
        for (let z = axis[1].valueType === 'Category' ? axis[1].min : 0; z < (this.heatMap.paletteSettings.colorGradientMode === 'Column' ? xLength : yLength); z++) {
            let tempIndex = axis[0].valueType === 'Category' ? axis[0].min : 0;
            this.completeDataSource.push([]);
            while (tempIndex < xLength) {
                if (tempIndex >= axis[0].min && tempIndex <= axis[0].max) {
                    this.processDataArray(tempCloneData, tempIndex, z, cloneDataIndex);
                }
                tempIndex++;
            }
            if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.paletteSettings.type === 'Gradient') {
                tempVariable = extend([], tempCloneData[cloneDataIndex], null, true);
                for (let i = 0; i < tempVariable.length; i++) {
                    if (typeof (tempVariable[i]) === 'object' && (tempVariable[i]) !== null || undefined || '') {
                        tempVariable[i] = tempVariable[i][0];
                    }
                }
            }
            else {
                tempVariable = extend([], this.completeDataSource[cloneDataIndex], null, true);
            }
            let minMaxVal = this.getMinMaxValue(minVal, maxVal, tempVariable);
            if ((this.heatMap.paletteSettings.colorGradientMode === 'Column' ||
                this.heatMap.paletteSettings.colorGradientMode === 'Row') && this.heatMap.paletteSettings.type === 'Gradient') {
                this.heatMap.dataMax[z] = minMaxVal[1];
                this.heatMap.dataMin[z] = minMaxVal[0];
            }
            else {
                minVal = minMaxVal[0];
                maxVal = minMaxVal[1];
            }
            if (this.heatMap.xAxis.isInversed) {
                this.completeDataSource[cloneDataIndex] = this.completeDataSource[cloneDataIndex].reverse();
            }
            if (z >= this.heatMap.axisCollections[1].min && z <= this.heatMap.axisCollections[1].max) {
                minMaxDatasource.push(this.completeDataSource[cloneDataIndex]);
            }
            cloneDataIndex++;
        }
        if (this.heatMap.paletteSettings.colorGradientMode === 'Row' && !this.heatMap.yAxis.isInversed &&
            this.heatMap.paletteSettings.type === 'Gradient') {
            this.heatMap.dataMax = this.heatMap.dataMax.reverse();
            this.heatMap.dataMin = this.heatMap.dataMin.reverse();
        }
        if (this.heatMap.paletteSettings.colorGradientMode === 'Column' && this.heatMap.xAxis.isInversed &&
            this.heatMap.paletteSettings.type === 'Gradient') {
            this.heatMap.dataMax = this.heatMap.dataMax.reverse();
            this.heatMap.dataMin = this.heatMap.dataMin.reverse();
        }
        if (!this.heatMap.yAxis.isInversed) {
            this.completeDataSource.reverse();
            minMaxDatasource.reverse();
        }
        this.heatMap.clonedDataSource = minMaxDatasource;
        this.heatMap.dataSourceMinValue = isNullOrUndefined(minVal) ? 0 : parseFloat(minVal.toString());
        this.heatMap.dataSourceMaxValue = isNullOrUndefined(maxVal) ? 0 : parseFloat(maxVal.toString());
        this.heatMap.isColorValueExist = isNullOrUndefined(this.heatMap.minColorValue) ? false : true;
        this.heatMap.minColorValue = isNullOrUndefined(this.heatMap.minColorValue) ?
            this.heatMap.dataSourceMinValue : parseFloat(this.heatMap.minColorValue.toString());
        this.heatMap.maxColorValue = isNullOrUndefined(this.heatMap.maxColorValue) ?
            this.heatMap.dataSourceMaxValue : parseFloat(this.heatMap.maxColorValue.toString());
    }
    /**
     * To process and create a proper data array.
     *  @private
     */
    // tslint:disable-next-line:no-any
    processDataArray(tempCloneData, tempIndex, z, cloneDataIndex) {
        if (this.heatMap.bubbleSizeWithColor) {
            if (tempCloneData[tempIndex] && !isNullOrUndefined(tempCloneData[tempIndex][z])
                && typeof (tempCloneData[tempIndex][z]) === 'object') {
                // tslint:disable-next-line:no-any 
                let internalArray = tempCloneData[tempIndex][z];
                for (let tempx = 0; tempx < internalArray.length; tempx++) {
                    if (isNullOrUndefined(internalArray[tempx]) || isNaN(internalArray[tempx])) {
                        internalArray[tempx] = '';
                    }
                    if (tempx === 0) {
                        this.tempSizeArray.push(internalArray[tempx]);
                    }
                    else if (tempx === 1) {
                        this.tempColorArray.push(internalArray[tempx]);
                        break;
                    }
                }
                this.completeDataSource[cloneDataIndex].push(internalArray);
            }
            else {
                if (!isNullOrUndefined(tempCloneData[tempIndex]) && (tempCloneData[tempIndex][z] ||
                    (tempCloneData[tempIndex][z] === 0 &&
                        tempCloneData[tempIndex][z].toString() !== ''))) {
                    this.completeDataSource[cloneDataIndex].push([tempCloneData[tempIndex][z]]);
                    this.tempSizeArray.push(tempCloneData[tempIndex][z]);
                }
                else {
                    this.completeDataSource[cloneDataIndex].push('');
                }
            }
        }
        else {
            if (tempCloneData[tempIndex] && (tempCloneData[tempIndex][z] ||
                (tempCloneData[tempIndex][z] === 0 &&
                    tempCloneData[tempIndex][z].toString() !== ''))) {
                if (typeof (tempCloneData[tempIndex][z]) === 'object') {
                    if (tempCloneData[tempIndex][z].length > 0 && !isNullOrUndefined(tempCloneData[tempIndex][z][0])) {
                        this.completeDataSource[cloneDataIndex].push(tempCloneData[tempIndex][z][0]);
                    }
                    else {
                        this.completeDataSource[cloneDataIndex].push('');
                    }
                }
                else {
                    this.completeDataSource[cloneDataIndex].push(tempCloneData[tempIndex][z]);
                }
            }
            else {
                this.completeDataSource[cloneDataIndex].push('');
            }
        }
    }
    /**
     * To get minimum and maximum value
     *  @private
     */
    getMinMaxValue(minVal, maxVal, tempVariable) {
        let minMaxValue = [];
        if (this.heatMap.bubbleSizeWithColor) {
            if (this.heatMap.paletteSettings.colorGradientMode !== 'Table' && this.heatMap.paletteSettings.type === 'Gradient') {
                this.tempSizeArray = tempVariable;
            }
            minMaxValue.push(this.getMinValue(minVal, this.tempSizeArray));
            minMaxValue.push(this.getMaxValue(maxVal, this.tempSizeArray));
            this.heatMap.minColorValue = this.getMinValue(this.heatMap.minColorValue, this.tempColorArray);
            this.heatMap.maxColorValue = this.getMaxValue(this.heatMap.maxColorValue, this.tempColorArray);
        }
        else {
            minMaxValue.push(this.getMinValue(minVal, tempVariable));
            minMaxValue.push(this.getMaxValue(maxVal, tempVariable));
        }
        return minMaxValue;
    }
    /**
     * To get minimum value
     *  @private
     */
    getMinValue(minVal, tempVariable) {
        if (isNullOrUndefined(minVal)) {
            minVal = this.performSort(tempVariable);
        }
        else if (this.performSort(tempVariable) < minVal) {
            minVal = this.performSort(tempVariable);
        }
        else if ((this.heatMap.paletteSettings.colorGradientMode === 'Row' ||
            this.heatMap.paletteSettings.colorGradientMode === 'Column') && this.heatMap.paletteSettings.type === 'Gradient') {
            minVal = this.performSort(tempVariable);
        }
        return !isNullOrUndefined(minVal) ? parseFloat(minVal.toString()) : minVal;
    }
    /**
     * To get maximum value
     *  @private
     */
    getMaxValue(maxVal, tempVariable) {
        if (isNullOrUndefined(maxVal) && tempVariable.length > 0) {
            maxVal = Math.max(...tempVariable);
        }
        else if (Math.max(...tempVariable) > maxVal) {
            maxVal = Math.max(...tempVariable);
        }
        else if ((this.heatMap.paletteSettings.colorGradientMode === 'Row' ||
            this.heatMap.paletteSettings.colorGradientMode === 'Column') && this.heatMap.paletteSettings.type === 'Gradient') {
            maxVal = Math.max(...tempVariable);
        }
        return !isNullOrUndefined(maxVal) ? parseFloat(maxVal.toString()) : maxVal;
    }
    /**
     * To perform sort operation.
     *  @private
     */
    // tslint:disable-next-line:no-any
    performSort(tempVariable) {
        return tempVariable.sort((a, b) => a - b).filter(this.checkmin)[0];
    }
    /**
     * To get minimum value
     *  @private
     */
    checkmin(val) {
        return !isNullOrUndefined(val) && val.toString() !== '';
    }
}

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Legend
 */
class LegendSettings extends ChildProperty {
}
__decorate$6([
    Property('')
], LegendSettings.prototype, "height", void 0);
__decorate$6([
    Property('')
], LegendSettings.prototype, "width", void 0);
__decorate$6([
    Complex({ text: '', textStyle: Theme.titleFont }, Title)
], LegendSettings.prototype, "title", void 0);
__decorate$6([
    Property('Right')
], LegendSettings.prototype, "position", void 0);
__decorate$6([
    Property(true)
], LegendSettings.prototype, "visible", void 0);
__decorate$6([
    Property('Center')
], LegendSettings.prototype, "alignment", void 0);
__decorate$6([
    Property(true)
], LegendSettings.prototype, "showLabel", void 0);
__decorate$6([
    Property(true)
], LegendSettings.prototype, "showGradientPointer", void 0);
__decorate$6([
    Property(false)
], LegendSettings.prototype, "enableSmartLegend", void 0);
__decorate$6([
    Property('All')
], LegendSettings.prototype, "labelDisplayType", void 0);
__decorate$6([
    Complex(Theme.legendLabelFont, Font)
], LegendSettings.prototype, "textStyle", void 0);
__decorate$6([
    Property('')
], LegendSettings.prototype, "labelFormat", void 0);
__decorate$6([
    Property(true)
], LegendSettings.prototype, "toggleVisibility", void 0);
/**
 *
 * The `Legend` module is used to render legend for the heatmap.
 */
class Legend {
    constructor(heatMap) {
        this.maxLegendLabelSize = new Size(0, 0);
        this.gradientScaleSize = 10;
        this.segmentCollections = [];
        this.segmentCollectionsLabels = [];
        this.textWrapCollections = [];
        this.labelCollections = [];
        this.labelCollection = [];
        this.legendSize = 10;
        this.previousOptions = new GradientPointer(0, 0, 0, 0, 0, 0);
        this.listPerPage = 0;
        this.numberOfPages = 1;
        this.listWidth = 0;
        this.fillRect = new Rect(0, 0, 0, 0);
        this.legendRect = new Rect(0, 0, 0, 0);
        this.currentPage = 1;
        this.lastList = [];
        this.navigationCollections = [];
        this.pagingRect = new Rect(0, 0, 0, 0);
        this.listInterval = 10; // padding between two lists
        this.legendLabelTooltip = [];
        this.legendTitleTooltip = [];
        this.labelXCollections = [];
        this.labelYCollections = [];
        this.legendXCollections = [];
        this.legendYCollections = [];
        /** @private */
        this.legendRectPositionCollection = [];
        /** @private */
        this.legendRange = [];
        /** @private */
        this.legendTextRange = [];
        /** @private */
        this.visibilityCollections = [];
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }
    ;
    /**
     * Get module name
     */
    getModuleName() {
        return 'Legend';
    }
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    destroy(heatMap) {
        /**
         * destory code
         */
    }
    ;
    /**
     * @private
     */
    renderLegendItems() {
        let heatMap = this.heatMap;
        heatMap.toggleValue = [];
        let tempBorder = { color: 'transparent', width: 0, };
        this.legend = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_Legend' });
        let rectItems = new RectOption(heatMap.element.id + '_LegendBound', 'none', tempBorder, 1, this.legendGroup);
        this.drawSvgCanvas.drawRectangle(rectItems, this.legend);
        let legendBound = this.legendRectScale;
        let ctx = heatMap.canvasRenderer.ctx;
        let rectItemsSvg = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height);
        let fill;
        if (heatMap.paletteSettings.type === 'Fixed') {
            let colorCollection = (!heatMap.legendSettings.enableSmartLegend) ?
                heatMap.colorCollection : heatMap.legendColorCollection;
            this.legendRange = (heatMap.resizing || (!heatMap.legendOnLoad && heatMap.rendering)) ? [] : this.legendRange;
            this.legendTextRange = (heatMap.resizing || (!heatMap.legendOnLoad && heatMap.rendering)) ? [] : this.legendTextRange;
            if (heatMap.enableCanvasRendering) {
                ctx.save();
                ctx.clip();
            }
            for (let i = 0; i < colorCollection.length; i++) {
                let visibility = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                heatMap.toggleValue.push(new ToggleVisibility(visibility, colorCollection[i].value, colorCollection[i].startValue, colorCollection[i].endValue));
            }
        }
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend === true)) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                if (heatMap.enableCanvasRendering) {
                    let grd;
                    let ctx = heatMap.canvasRenderer.ctx;
                    if (heatMap.horizontalGradient) {
                        grd = ctx.createLinearGradient(legendBound.x, 0, legendBound.x + legendBound.width, 0);
                    }
                    else {
                        grd = ctx.createLinearGradient(0, legendBound.y, 0, legendBound.y + legendBound.height);
                    }
                    if (heatMap.legendSettings.title.text) {
                        ctx.clip();
                    }
                    for (let i = 0; i < heatMap.legendColorCollection.length; i++) {
                        let value = (((this.heatMap.isColorRange ? heatMap.legendColorCollection[i].startValue :
                            heatMap.legendColorCollection[i].value) - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue));
                        value = isNaN(value) ? 0 : value;
                        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
                            this.calculateCanvasColorRange(i, grd);
                        }
                        else {
                            grd.addColorStop(value, heatMap.legendColorCollection[i].color);
                        }
                    }
                    ctx.fillStyle = grd;
                    fill = grd.toString();
                }
                else {
                    let gradientOptions;
                    let gradientColor;
                    let cgradientColors = [];
                    for (let i = 0; i < heatMap.legendColorCollection.length; i++) {
                        if (this.heatMap.isColorRange && this.heatMap.paletteSettings.type === 'Gradient') {
                            this.calculateColorRange(i, cgradientColors);
                        }
                        else {
                            let gradientPercentage = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                                (this.legendMaxValue - this.legendMinValue)) * 100;
                            gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
                            gradientColor = new GradientColor(heatMap.legendColorCollection[i].color, gradientPercentage + '%');
                            cgradientColors.push(gradientColor);
                        }
                        if (this.legendMaxValue === this.legendMinValue) {
                            break;
                        }
                    }
                    if (heatMap.horizontalGradient) {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '100%', '0%', '0%');
                    }
                    else {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '0%', '0%', '100%');
                    }
                    let linearGradient = heatMap.renderer.drawGradient('linearGradient', gradientOptions, cgradientColors);
                    this.legend.appendChild(linearGradient);
                    fill = 'url(#' + heatMap.element.id + '_lineargradient)';
                }
                let rectItem = new RectOption(heatMap.element.id + '_Gradient_Legend', fill, tempBorder, 1, rectItemsSvg);
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                this.renderElements(rectItemsSvg);
            }
            else {
                this.renderSmartLegend();
                this.renderTitle(rectItemsSvg);
            }
            if (!heatMap.enableCanvasRendering) {
                heatMap.svgObject.appendChild(this.legend);
            }
            if (heatMap.enableCanvasRendering) {
                ctx.restore();
            }
            this.renderLegendLabel(rectItemsSvg);
        }
        else {
            this.legendScale = heatMap.renderer.createGroup({ id: heatMap.element.id + 'Heatmap_GradientScale' });
            let listRect = new RectOption(heatMap.element.id + '_Gradient_Scale', 'none', tempBorder, 1, this.legendRectScale);
            this.drawSvgCanvas.drawRectangle(listRect, this.legendScale);
            this.renderTitle(rectItemsSvg);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(this.legendScale);
            }
            this.translategroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_translate' });
            this.calculateListPerPage(rectItemsSvg);
            if (this.numberOfPages > 1) {
                this.paginggroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_navigation' });
            }
            this.renderListLegendMode(rectItemsSvg, true);
            if (heatMap.enableCanvasRendering) {
                ctx.restore();
            }
        }
    }
    renderElements(rectItemsSvg) {
        this.renderTitle(rectItemsSvg);
        this.renderColorAxisGrid(rectItemsSvg);
    }
    calculateCanvasColorRange(i, grd) {
        let heatMap = this.heatMap;
        let value = ((((heatMap.legendColorCollection[i].startValue < heatMap.dataSourceMinValue &&
            heatMap.legendColorCollection[i].endValue > heatMap.dataSourceMinValue) ?
            heatMap.dataSourceMinValue : heatMap.legendColorCollection[i].startValue) - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue));
        value = isNaN(value) ? 0 : value;
        let value1 = ((heatMap.legendColorCollection[i].endValue >= this.heatMap.dataSourceMaxValue ?
            this.heatMap.dataSourceMaxValue : heatMap.legendColorCollection[i].endValue) - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue);
        if (this.heatMap.legendColorCollection[0].startValue !== this.heatMap.dataSourceMinValue && i === 0 &&
            this.heatMap.legendColorCollection[0].startValue > this.heatMap.dataSourceMinValue) {
            value = (this.heatMap.legendColorCollection[0].startValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value / 2, this.heatMap.paletteSettings.fillColor.minColor);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.maxColor);
        }
        grd.addColorStop(value, heatMap.legendColorCollection[i].minColor);
        grd.addColorStop(value1, heatMap.legendColorCollection[i].maxColor);
        if (this.heatMap.legendColorCollection[i].endValue !== ((i === this.heatMap.legendColorCollection.length - 1) ?
            this.heatMap.dataSourceMaxValue : this.heatMap.legendColorCollection[i + 1].startValue) &&
            this.heatMap.legendColorCollection[i].endValue < this.heatMap.dataSourceMaxValue) {
            value = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.minColor);
            value = ((i === this.heatMap.legendColorCollection.length - 1 ? this.heatMap.dataSourceMaxValue :
                heatMap.legendColorCollection[i + 1].startValue) - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue);
            grd.addColorStop(value, this.heatMap.paletteSettings.fillColor.maxColor);
        }
    }
    calculateColorRange(i, cgradientColors = []) {
        let heatMap = this.heatMap;
        heatMap.toggleValue = [];
        let gradientPercentage;
        let gradientColor;
        let gradientColor1;
        let gradientColor2;
        let gradientColor3;
        if (this.heatMap.legendColorCollection[0].startValue > this.heatMap.dataSourceMinValue && i === 0) {
            gradientPercentage = (this.heatMap.dataSourceMinValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
            gradientColor = new GradientColor(heatMap.paletteSettings.fillColor.minColor, gradientPercentage + '%');
            cgradientColors.push(gradientColor);
            gradientPercentage = (heatMap.legendColorCollection[0].startValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor = new GradientColor(heatMap.paletteSettings.fillColor.maxColor, gradientPercentage + '%');
            cgradientColors.push(gradientColor);
        }
        gradientPercentage = ((heatMap.legendColorCollection[i].startValue - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue)) * 100;
        gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
        gradientColor = new GradientColor(heatMap.legendColorCollection[i].minColor, gradientPercentage + '%');
        cgradientColors.push(gradientColor);
        gradientPercentage = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
            (this.legendMaxValue - this.legendMinValue) * 100;
        gradientColor1 = new GradientColor(heatMap.legendColorCollection[i].maxColor, gradientPercentage + '%');
        cgradientColors.push(gradientColor1);
        if (this.heatMap.legendColorCollection[i].endValue !== ((i === this.heatMap.legendColorCollection.length - 1) ?
            this.heatMap.dataSourceMaxValue : this.heatMap.legendColorCollection[i + 1].startValue)) {
            gradientPercentage = (heatMap.legendColorCollection[i].endValue - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor2 = new GradientColor(this.heatMap.paletteSettings.fillColor.minColor, (gradientPercentage) + '%');
            cgradientColors.push(gradientColor2);
            gradientPercentage = ((i === (this.heatMap.legendColorCollection.length - 1) ?
                this.heatMap.dataSourceMaxValue : heatMap.legendColorCollection[i + 1].startValue) - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue) * 100;
            gradientColor3 = new GradientColor(this.heatMap.paletteSettings.fillColor.maxColor, (gradientPercentage) + '%');
            cgradientColors.push(gradientColor3);
        }
    }
    renderTitle(rect) {
        let heatMap = this.heatMap;
        if (heatMap.legendSettings.title.text) {
            let title = heatMap.legendSettings.title;
            let titleSize = measureText(title.text, title.textStyle);
            let padding = !heatMap.legendSettings.showLabel ? heatMap.horizontalGradient ? 10 : 6 : this.labelPadding;
            let y;
            let anchor = 'start';
            let maxWidth;
            let dominantBaseline;
            let text = title.text;
            let options;
            let yValue;
            if (heatMap.legendSettings.title.textStyle.textOverflow === 'Trim') {
                maxWidth = this.width - 10;
                text = textTrim(maxWidth, text, title.textStyle);
            }
            if (!heatMap.horizontalGradient) {
                padding = -(padding + titleSize.height / 4);
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    this.legendTitleTooltip.push(new CanvasTooltip(title.text, new Rect(rect.x, rect.y - titleSize.height, maxWidth, titleSize.height)));
                }
                options = new TextOption(heatMap.element.id + '_legendTitle', new TextBasic(rect.x, rect.y + padding, anchor, text, 0, 'translate(0,0)', dominantBaseline), title.textStyle, title.textStyle.color || heatMap.themeStyle.heatMapTitle);
            }
            else {
                y = rect.y + (heatMap.legendSettings.position === 'Top' ? 0 :
                    -(10 + titleSize.height + padding));
                padding = heatMap.legendSettings.position === 'Top' ? -(padding + titleSize.height / 4) :
                    (padding + (3 * titleSize.height / 4));
                yValue = heatMap.legendSettings.position === 'Bottom' ? y : y - titleSize.height;
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    this.legendTitleTooltip.push(new CanvasTooltip(title.text, new Rect(rect.x, yValue, maxWidth, titleSize.height)));
                }
                titleSize.width = rect.width < titleSize.width ? rect.width : titleSize.width;
                options = new TextOption(heatMap.element.id + '_legendTitle', new TextBasic(rect.x + (rect.width / 2) - (titleSize.width / 2), y + padding, anchor, text, 0, 'translate(0,0)', dominantBaseline), title.textStyle, title.textStyle.color || heatMap.themeStyle.heatMapTitle);
            }
            this.drawSvgCanvas.createText(options, this.legend, text);
        }
    }
    renderSmartLegend() {
        let heatMap = this.heatMap;
        let colorCollection = heatMap.colorCollection;
        let smartLegendRect;
        let tempBorder = {
            color: 'transparent',
            width: 0,
        };
        let legendBound = this.legendRectScale;
        let legendX;
        let legendY;
        let legendWidth;
        let legendHeight;
        let width = legendBound.width / colorCollection.length;
        let height = legendBound.height / colorCollection.length;
        this.legendRectPositionCollection = [];
        this.legendRange = [];
        for (let i = 0; i < heatMap.legendColorCollection.length; i++) {
            let rectPosition = new CurrentLegendRect(0, 0, 0, 0, '', '');
            if (heatMap.horizontalGradient) {
                legendX = legendBound.x + (i * width);
                legendY = legendBound.y;
                legendWidth = width;
                legendHeight = legendBound.height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === heatMap.legendColorCollection.length - 1 && !heatMap.legendColorCollection[i].isHidden) ?
                    legendX + width : legendX);
            }
            else {
                legendX = legendBound.x;
                legendY = legendBound.y + (i * height);
                legendWidth = legendBound.width;
                legendHeight = height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === heatMap.legendColorCollection.length - 1 && !heatMap.legendColorCollection[i].isHidden) ?
                    legendY + height : legendY);
            }
            smartLegendRect = new Rect(legendX, legendY, legendWidth, legendHeight);
            let legendRange = new LegendRange(0, 0, 0, 0, 0, true, 0);
            legendRange.x = legendX;
            legendRange.y = legendY;
            legendRange.width = legendWidth;
            legendRange.height = legendHeight;
            legendRange.value = this.heatMap.isColorRange ?
                heatMap.legendColorCollection[i].endValue : heatMap.legendColorCollection[i].value;
            legendRange.currentPage = this.currentPage;
            if (colorCollection.length !== heatMap.legendColorCollection.length && i === heatMap.legendColorCollection.length - 1) {
                heatMap.horizontalGradient ? legendRange.width = 0 : legendRange.height = 0;
                this.visibilityCollections[i] = this.visibilityCollections[i - 1];
            }
            legendRange.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
            this.legendRange.push(legendRange);
            if (!heatMap.legendColorCollection[i].isHidden) {
                let color = heatMap.legendOnLoad ? this.heatMap.isColorRange ? colorCollection[i].minColor :
                    colorCollection[i].color : this.legendRange[i].visible ? this.heatMap.isColorRange ? colorCollection[i].minColor :
                    colorCollection[i].color : '#D3D3D3';
                let rectItem = new RectOption(heatMap.element.id + '_Smart_Legend' + i, color, tempBorder, 1, smartLegendRect);
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                rectPosition.x = legendX;
                rectPosition.y = legendY;
                rectPosition.width = legendWidth;
                rectPosition.height = legendHeight;
                rectPosition.label = this.labelCollections[i];
                rectPosition.id = heatMap.element.id + '_Smart_Legend' + i;
                this.legendRectPositionCollection.push(rectPosition);
                let text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, this.textWrapCollections[i]);
                if (text.length !== 0 && heatMap.enableCanvasRendering) {
                    let elementSize = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                    this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(rectPosition.x, rectPosition.y, elementSize.width, elementSize.height)));
                }
            }
        }
    }
    colorRangeLegendPosition(i, labelX) {
        if (this.segmentCollections.length !== this.segmentCollectionsLabels.length) {
            for (let k = 0; k < this.segmentCollections.length; k++) {
                if (this.segmentCollectionsLabels[i] === this.segmentCollections[k]) {
                    labelX = this.segmentCollectionsLabels[i] + (((k === this.segmentCollections.length - 1 ?
                        (this.heatMap.horizontalGradient ? this.width : this.height) :
                        this.segmentCollections[k + 1]) - this.segmentCollections[k]) / 2);
                    break;
                }
            }
        }
        else {
            labelX = this.segmentCollectionsLabels[i] + (((i === this.segmentCollectionsLabels.length - 1 ?
                (this.heatMap.horizontalGradient ? this.width : this.height) :
                this.segmentCollectionsLabels[i + 1]) - this.segmentCollectionsLabels[i]) / 2);
        }
        this.labelPosition = labelX;
    }
    renderLegendLabel(rect) {
        let heatMap = this.heatMap;
        this.legendTextRange = [];
        if (heatMap.legendSettings.showLabel && (heatMap.paletteSettings.type === 'Gradient' ||
            (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.labelDisplayType !== 'None'))) {
            let anchor = 'start';
            let dominantBaseline;
            let legendLabel;
            let textWrapWidth = 0;
            let text;
            this.legendLabelTooltip = [];
            let elementSize;
            let colorCollection = heatMap.legendColorCollection;
            if (heatMap.enableCanvasRendering) {
                let ctx = heatMap.canvasRenderer.ctx;
                ctx.rect(this.legendGroup.x, this.legendGroup.y, this.legendGroup.width, this.legendGroup.height);
                ctx.save();
                ctx.clip();
                ctx.restore();
            }
            else {
                legendLabel = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_LegendLabel' });
            }
            let labelX;
            let labelY;
            for (let i = 0; i < colorCollection.length; i++) {
                let value = ((colorCollection[i].value - (Math.round(this.legendMinValue * 100) / 100)) /
                    ((Math.round(this.legendMaxValue * 100) / 100) - (Math.round(this.legendMinValue * 100) / 100))) * 100;
                if (heatMap.horizontalGradient) {
                    if (this.heatMap.isColorRange && heatMap.paletteSettings.type === 'Gradient') {
                        this.colorRangeLegendPosition(i, labelX);
                        labelX = this.labelPosition;
                    }
                    else if (this.heatMap.legendSettings.enableSmartLegend && this.heatMap.isColorRange &&
                        heatMap.paletteSettings.type === 'Fixed') {
                        labelX = this.segmentCollections[i] + ((rect.width / colorCollection.length) / 2);
                    }
                    else {
                        labelX = this.segmentCollections[i];
                    }
                    labelY = rect.y + rect.height + this.labelPadding;
                    anchor = ((Math.round(value * 100) / 100) === 0 || (i === 0 && heatMap.paletteSettings.type === 'Fixed')) ? 'start' :
                        (((Math.round(value * 100) / 100) === 100 && heatMap.paletteSettings.type === 'Gradient') ||
                            (Math.round(heatMap.dataSourceMaxValue * 100) / 100) === colorCollection[i].value &&
                                heatMap.legendSettings.enableSmartLegend) || (heatMap.legendSettings.enableSmartLegend &&
                            heatMap.paletteSettings.type === 'Fixed' &&
                            heatMap.legendSettings.labelDisplayType === 'Edge') ? 'end' : 'middle';
                    dominantBaseline = 'hanging';
                }
                else {
                    labelX = rect.x + rect.width + this.labelPadding;
                    if (this.heatMap.isColorRange && heatMap.paletteSettings.type === 'Gradient') {
                        this.colorRangeLegendPosition(i, labelY);
                        labelY = this.labelPosition;
                    }
                    else if (this.heatMap.legendSettings.enableSmartLegend && this.heatMap.isColorRange &&
                        heatMap.paletteSettings.type === 'Fixed') {
                        labelY = this.segmentCollections[i] + ((rect.height / colorCollection.length) / 2);
                    }
                    else {
                        labelY = this.segmentCollections[i];
                    }
                    dominantBaseline = ((Math.round(value * 100) / 100) === 0 || (i === 0 && heatMap.paletteSettings.type === 'Fixed')) ?
                        'hanging' : (((Math.round(value * 100) / 100) === 100 && heatMap.paletteSettings.type === 'Gradient') ||
                        (Math.round(heatMap.dataSourceMaxValue * 100) / 100) === colorCollection[i].value &&
                            heatMap.legendSettings.enableSmartLegend) || (heatMap.legendSettings.enableSmartLegend &&
                        heatMap.legendSettings.labelDisplayType === 'Edge' &&
                        heatMap.paletteSettings.type === 'Fixed') ? 'auto' : 'middle';
                }
                textWrapWidth = heatMap.horizontalGradient ? this.textWrapCollections[i] : this.width - (this.legendRectScale.width +
                    this.labelPadding + this.legendRectPadding);
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                elementSize = measureText(text[0], heatMap.legendSettings.textStyle);
                if (heatMap.paletteSettings.type === 'Fixed') {
                    let rectY = dominantBaseline === 'hanging' ? labelY : dominantBaseline === 'middle' ?
                        labelY - elementSize.height / 2 : labelY - elementSize.height;
                    let rectX = anchor === 'end' ? labelX - elementSize.width : anchor === 'middle' ?
                        labelX - elementSize.width / 2 : labelX;
                    let textPosition = new LegendRange(rectX, rectY, elementSize.width, elementSize.height, colorCollection[i].value, true, this.currentPage);
                    textPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                    this.legendTextRange.push(textPosition);
                }
                if (this.labelCollections[i] !== '') {
                    if (text.length !== 0 && text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                        this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(labelX, labelY, elementSize.width, elementSize.height)));
                    }
                    let textBasic = new TextBasic(labelX, labelY, anchor, text, 0, 'translate(0,0)', dominantBaseline);
                    let options = new TextOption(heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                    options.fill = heatMap.legendOnLoad ? options.fill :
                        (heatMap.paletteSettings.type === 'Fixed' && !this.legendRange[i].visible) ? '#D3D3D3' : options.fill;
                    if (text.length > 1) {
                        this.drawSvgCanvas.createWrapText(options, heatMap.legendSettings.textStyle, legendLabel);
                    }
                    else {
                        this.drawSvgCanvas.createText(options, legendLabel, text[0]);
                    }
                    if (Browser.isIE && !heatMap.enableCanvasRendering) {
                        if (dominantBaseline === 'middle') {
                            legendLabel.lastChild.setAttribute('dy', '0.6ex');
                        }
                        else if (dominantBaseline === 'hanging') {
                            legendLabel.lastChild.setAttribute('dy', '1.5ex');
                        }
                    }
                }
                if (this.legendMaxValue === this.legendMinValue && heatMap.paletteSettings.type === 'Gradient') {
                    break;
                }
            }
            if (!heatMap.enableCanvasRendering) {
                this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
                this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
                this.legend.appendChild(legendLabel);
                let clippath = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_clipPath' });
                let clipRect = heatMap.renderer.drawRectangle(this.legendGroup);
                clippath.appendChild(clipRect);
                heatMap.svgObject.appendChild(clippath);
                this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            }
        }
    }
    /**
     * @private
     */
    renderGradientPointer(e, pageX, pageY) {
        let heatMap = this.heatMap;
        let currentRect = heatMap.heatMapSeries.getCurrentRect(pageX, pageY);
        let cellValue = heatMap.bubbleSizeWithColor ? currentRect.value[0].bubbleData.toString() !== '' ?
            !this.heatMap.isColorValueExist ? currentRect.value[0].bubbleData.toString() :
                currentRect.value[1].bubbleData.toString() : '' : currentRect.value.toString();
        let rect = this.legendRectScale;
        let legendPart;
        let direction;
        let options;
        let legendPath;
        let pathX1;
        let pathY1;
        let pathX2;
        let pathY2;
        let pathX3;
        let pathY3;
        if (cellValue.toString() !== '') {
            if (!heatMap.horizontalGradient) {
                legendPart = rect.height / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                legendPath = isNaN(legendPath) ? 0 : legendPath;
                pathX1 = rect.x - 1;
                pathY1 = rect.y + legendPath;
                pathX2 = pathX3 = rect.x - 8;
                pathY2 = rect.y - 5 + legendPath;
                pathY3 = rect.y + 5 + legendPath;
            }
            else {
                legendPart = rect.width / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
                legendPath = isNaN(legendPath) ? 0 : legendPath;
                pathX1 = rect.x + legendPath;
                pathY1 = rect.y + rect.height;
                pathX2 = rect.x - 5 + legendPath;
                pathY2 = pathY3 = rect.y + rect.height + 8;
                pathX3 = rect.x + 5 + legendPath;
            }
            direction = 'M' + ' ' + pathX1 + ' ' + pathY1 + ' ' +
                'L' + ' ' + pathX2 + ' ' + pathY2 + ' ' + 'L' + ' ' + pathX3 + ' ' + pathY3 + ' ' + 'Z';
            options = new PathOption(heatMap.element.id + '_Gradient_Pointer', 'gray', 0.01, '#A0A0A0', 1, '0,0', direction);
            if (!heatMap.enableCanvasRendering) {
                this.gradientPointer = heatMap.renderer.drawPath(options);
                this.gradientPointer.style.visibility = 'visible';
                this.legend.appendChild(this.gradientPointer);
            }
            else {
                this.removeGradientPointer();
                let canvasTranslate;
                heatMap.canvasRenderer.drawPath(options, canvasTranslate);
                this.previousOptions.pathX1 = pathX1;
                this.previousOptions.pathY1 = pathY1;
                this.previousOptions.pathX2 = pathX2;
                this.previousOptions.pathY2 = pathY2;
                this.previousOptions.pathX3 = pathX3;
                this.previousOptions.pathY3 = pathY3;
            }
        }
        else {
            this.removeGradientPointer();
        }
    }
    /**
     * @private
     */
    removeGradientPointer() {
        let heatMap = this.heatMap;
        if (this.gradientPointer && !heatMap.enableCanvasRendering) {
            this.gradientPointer.style.visibility = 'hidden';
        }
        else if (heatMap.enableCanvasRendering) {
            if (Object.keys(this.previousOptions).length !== 0) {
                if (heatMap.horizontalGradient) {
                    this.fillRect.x = this.previousOptions.pathX2 - 1;
                    this.fillRect.y = this.previousOptions.pathY1;
                    this.fillRect.width = this.previousOptions.pathX3 - this.previousOptions.pathX2 + 2;
                    this.fillRect.height = this.previousOptions.pathY2 + 1 - this.previousOptions.pathY1;
                }
                else {
                    this.fillRect.x = this.previousOptions.pathX2 - 1;
                    this.fillRect.y = this.previousOptions.pathY2 - 1;
                    this.fillRect.width = this.previousOptions.pathX1 - this.previousOptions.pathX2 + 1;
                    this.fillRect.height = this.previousOptions.pathY3 - this.previousOptions.pathY2 + 2;
                }
            }
            heatMap.canvasRenderer.ctx.fillStyle = heatMap.themeStyle.background;
            heatMap.canvasRenderer.ctx.fillRect(this.fillRect.x, this.fillRect.y, this.fillRect.width, this.fillRect.height);
        }
    }
    /**
     * @private
     */
    calculateLegendBounds(rect) {
        let heatMap = this.heatMap;
        let legendSettings = heatMap.legendSettings;
        this.labelCollection = [];
        this.labelCollections = [];
        let colorCollection = heatMap.legendColorCollection;
        if (legendSettings.position !== 'Bottom' && legendSettings.position !== 'Top' &&
            legendSettings.position !== 'Right' && legendSettings.position !== 'Left') {
            legendSettings.position = 'Right';
        }
        let title = heatMap.legendSettings.title;
        let titleSize = measureText(title.text, title.textStyle);
        heatMap.horizontalGradient = legendSettings.position === 'Bottom' || legendSettings.position === 'Top';
        this.legendRectPadding = heatMap.horizontalGradient ? heatMap.legendSettings.title.text ?
            titleSize.height + 16 : 16 : 10; // padding between rect and legend
        this.labelPadding = legendSettings.showLabel ? this.heatMap.horizontalGradient ? 10 : 6 : 0; // padding between list and label
        this.legendHeight = legendSettings.height;
        this.legendWidth = legendSettings.width;
        let format = heatMap.legendSettings.labelFormat;
        let isCustom = format.match('{value}') !== null;
        this.format = heatMap.intl.getNumberFormat({ format: isCustom ? '' : format });
        if (heatMap.paletteSettings.type === 'Fixed') {
            for (let i = 0; i < colorCollection.length; i++) {
                let label = colorCollection[i].label ? colorCollection[i].label : this.heatMap.isColorRange ?
                    colorCollection[i].startValue.toString() + '-' + colorCollection[i].endValue.toString() : formatValue(isCustom, format, colorCollection[i].value, this.format).toString();
                let legendEventArg = { cancel: false, text: label, name: 'legendRender' };
                this.labelCollection.push(label);
                this.heatMap.trigger('legendRender', legendEventArg);
                if (heatMap.legendRender) {
                    if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                        && i > 0 && i < colorCollection.length - 1) {
                        this.labelCollections.push('');
                    }
                    else {
                        if (!legendEventArg.cancel) {
                            this.labelCollections.push(legendEventArg.text);
                        }
                        else {
                            this.labelCollections.push('');
                        }
                    }
                }
                else {
                    if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                        && i > 0 && i < colorCollection.length - 1) {
                        this.labelCollections.push('');
                    }
                    else {
                        this.labelCollections.push(label);
                    }
                }
            }
        }
        else {
            for (let i = 0; i < colorCollection.length; i++) {
                let label = colorCollection[i].isHidden ? '' : colorCollection[i].label ? colorCollection[i].label :
                    this.heatMap.isColorRange ? colorCollection[i].startValue.toString() + '-' + colorCollection[i].endValue.toString() :
                        formatValue(isCustom, format, colorCollection[i].value, this.format).toString();
                let legendEventArg = { cancel: false, text: label, name: 'legendRender', };
                if (!colorCollection[i].isHidden) {
                    this.heatMap.trigger('legendRender', legendEventArg);
                }
                if (heatMap.legendRender) {
                    if (!legendEventArg.cancel) {
                        if (i > 0 && i < colorCollection.length - 1 && heatMap.legendSettings.labelDisplayType === 'Edge') {
                            this.labelCollections.push('');
                        }
                        else {
                            if (!legendEventArg.cancel) {
                                this.labelCollections.push(legendEventArg.text);
                            }
                            else {
                                this.labelCollections.push('');
                            }
                        }
                    }
                    else {
                        this.labelCollections.push('');
                    }
                }
                else {
                    if (i > 0 && i < colorCollection.length - 1 && heatMap.legendSettings.labelDisplayType === 'Edge') {
                        this.labelCollections.push('');
                    }
                    else {
                        this.labelCollections.push(label);
                    }
                }
            }
        }
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend)) {
            this.maxLegendLabelSize = this.getMaxLabelSize();
            if (heatMap.horizontalGradient && legendSettings.height === '') {
                this.legendHeight = ((2 * this.legendRectPadding) + this.legendSize + this.maxLegendLabelSize.height).toString();
            }
            else if (!heatMap.horizontalGradient && legendSettings.width === '' && (legendSettings.textStyle.textOverflow === 'None' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.enableSmartLegend &&
                    heatMap.legendSettings.labelDisplayType === 'None'))) {
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.maxLegendLabelSize.width).toString();
            }
            this.calculateTitleBounds();
        }
        else {
            this.calculateListLegendBounds(rect);
        }
        this.legendHeight = this.legendHeight ? this.legendHeight : heatMap.horizontalGradient ? '50' : '100%';
        this.legendWidth = this.legendWidth ? this.legendWidth : heatMap.horizontalGradient ?
            '100%' : heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ? '70' : '50';
        this.height = stringToNumber(this.legendHeight, rect.height);
        this.width = stringToNumber(this.legendWidth, rect.width);
        if (heatMap.horizontalGradient) {
            this.height = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                this.height < 50 ? 50 : this.height : this.height;
            if (legendSettings.position === 'Top') {
                rect.y += this.height;
            }
            rect.height -= this.height;
        }
        else {
            this.width = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                this.width < 50 ? 50 : this.width : this.width;
            if (legendSettings.position === 'Left') {
                rect.x += this.width;
            }
            rect.width -= this.width;
        }
    }
    calculateTitleBounds() {
        let heatMap = this.heatMap;
        let title = heatMap.legendSettings.title;
        let titleSize = measureText(title.text, title.textStyle);
        if (heatMap.legendSettings.title.text) {
            if ((heatMap.legendSettings.position === 'Top' || heatMap.legendSettings.position === 'Bottom') &&
                heatMap.legendSettings.height === '') {
                this.legendHeight = (((2 * this.legendRectPadding) - titleSize.height) +
                    this.legendSize + this.maxLegendLabelSize.height).toString();
            }
            if (heatMap.legendSettings.width === '' && (heatMap.legendSettings.textStyle.textOverflow === 'None' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.enableSmartLegend &&
                    heatMap.legendSettings.labelDisplayType === 'None'))) {
                if (heatMap.legendSettings.position === 'Right') {
                    this.legendWidth = ((2 * this.legendRectPadding + titleSize.width) +
                        this.legendSize + this.maxLegendLabelSize.width).toString();
                }
                else if (heatMap.legendSettings.position === 'Left') {
                    titleSize.width = titleSize.width > this.maxLegendLabelSize.width ? titleSize.width : this.maxLegendLabelSize.width;
                    this.legendWidth = ((2 * this.legendRectPadding + titleSize.width) + this.legendSize).toString();
                }
            }
        }
    }
    calculateListLegendBounds(rect) {
        let heatMap = this.heatMap;
        this.listWidth = 0;
        this.listHeight = 0;
        this.currentPage = 1;
        let padding = 10; // padding of paging elements
        let title = heatMap.legendSettings.title;
        let titleSize = measureText(title.text, title.textStyle);
        let height = (titleSize.height + 50).toString();
        if (heatMap.horizontalGradient) {
            for (let i = 0; i < heatMap.colorCollection.length; i++) {
                let size = 0;
                if (heatMap.legendSettings.showLabel) {
                    let text = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                let perListWidth = this.legendSize + this.labelPadding + size + this.listInterval;
                this.listWidth += perListWidth;
            }
            this.listWidth += this.listInterval + padding;
            if (this.legendWidth === '') {
                this.legendWidth = this.listWidth > rect.width ? rect.width.toString() : this.listWidth.toString();
            }
            if (this.legendHeight === '') {
                this.numberOfRows = Math.ceil(this.listWidth / stringToNumber(this.legendWidth, rect.width));
                this.numberOfRows = this.numberOfRows > 3 ? 3 : this.numberOfRows;
                this.legendHeight = (this.listWidth > rect.width || this.listWidth > stringToNumber(this.legendWidth, rect.width)) &&
                    this.numberOfRows > 3 ? (((this.legendSize + this.listInterval) * this.numberOfRows) + this.legendRectPadding +
                    parseInt(heatMap.legendSettings.textStyle.size, 10) + padding).toString() :
                    (((this.legendSize + this.listInterval) * this.numberOfRows) + this.legendRectPadding).toString();
            }
        }
        else {
            this.listHeight = ((this.legendSize + this.listInterval) * heatMap.colorCollection.length)
                + this.listInterval + (heatMap.legendSettings.title.text ? titleSize.height : 0);
            if (this.legendHeight === '') {
                this.legendHeight = this.listHeight > rect.height ? rect.height.toString() : this.listHeight.toString();
            }
            if (this.legendWidth === '' && heatMap.legendSettings.textStyle.textOverflow !== 'Trim') {
                this.maxLegendLabelSize = this.getMaxLabelSize();
                this.maxLegendLabelSize.width = titleSize.width > this.maxLegendLabelSize.width ?
                    titleSize.width : this.maxLegendLabelSize.width;
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.labelPadding +
                    this.maxLegendLabelSize.width).toString();
            }
        }
        if (stringToNumber(this.legendHeight, rect.height) < 50) {
            this.legendHeight = height;
        }
        if (stringToNumber(this.legendWidth, rect.width) < 70) {
            this.legendWidth = '70';
        }
    }
    getMaxLabelSize() {
        let heatMap = this.heatMap;
        this.maxLegendLabelSize = new Size(0, 0);
        if (!heatMap.legendSettings.showLabel || (heatMap.horizontalGradient && heatMap.paletteSettings.type === 'Fixed' &&
            !heatMap.legendSettings.enableSmartLegend) || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.labelDisplayType === 'None')) {
            return this.maxLegendLabelSize;
        }
        else {
            let labelSize = this.maxLegendLabelSize;
            for (let i = 0; i < heatMap.legendColorCollection.length; i++) {
                let size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
                labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
            }
            return labelSize;
        }
    }
    /**
     * @private
     */
    calculateLegendSize(rect, legendTop) {
        let heatMap = this.heatMap;
        let legendSettings = heatMap.legendSettings;
        let left;
        let top;
        let padding = 10; // inner padding for axis title and axil labels
        let alignment = legendSettings.alignment;
        let width;
        let height = stringToNumber(this.legendHeight, rect.height);
        if (!heatMap.legendSettings.title.text) {
            width = stringToNumber(this.legendWidth, rect.width);
        }
        else {
            width = this.width;
        }
        let axis = heatMap.axisCollections;
        let axisTitlePadding = 0;
        if (heatMap.horizontalGradient) {
            width = width > rect.width ? rect.width : width;
            height = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                height > 50 ? height : 50 : this.height;
            left = alignment === 'Near' ? rect.x : alignment === 'Far' ? rect.x + rect.width - width :
                rect.x + (rect.width / 2) - (width / 2);
            if (heatMap.xAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.xAxis.title.text, heatMap.xAxis.textStyle).height + padding;
            }
            let axisHeight = axis[0].opposedPosition ? 0 : sum(axis[0].xAxisMultiLabelHeight) + axis[0].maxLabelSize.height +
                axisTitlePadding + padding;
            top = legendSettings.position === 'Top' ? heatMap.titleSettings.text ? legendTop :
                heatMap.margin.top : rect.y + rect.height + axisHeight;
        }
        else {
            height = height > rect.height ? rect.height : height;
            width = heatMap.paletteSettings.type === 'Gradient' || heatMap.legendSettings.enableSmartLegend ?
                width > 50 ? width : 50 : width;
            top = alignment === 'Near' ? rect.y : alignment === 'Far' ? rect.y + rect.height - height :
                rect.y + (rect.height / 2) - (height / 2);
            if (heatMap.yAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.yAxis.title.text, heatMap.yAxis.textStyle).height + padding;
            }
            let axisWidth = axis[1].opposedPosition ? sum(axis[1].yAxisMultiLabelHeight) +
                axis[1].maxLabelSize.width + axisTitlePadding + 2 * padding : 0;
            left = legendSettings.position === 'Right' ? rect.x + rect.width + axisWidth : heatMap.margin.left;
        }
        this.legendGroup = new Rect(left, top, width, height);
        this.calculateGradientScale(this.legendGroup);
    }
    // calculating number of lists per page
    measureListLegendBound(rect) {
        let heatMap = this.heatMap;
        let title = heatMap.legendSettings.title;
        let padding = 15; // padding of paging element
        this.numberOfPages = 1;
        let titleSize = measureText(title.text, title.textStyle);
        if (heatMap.horizontalGradient) {
            if (this.listWidth > this.width) {
                this.numberOfRows = Math.ceil(this.listWidth / this.width);
                this.listHeight = ((this.legendSize + this.listInterval) * this.numberOfRows);
                this.listPerPage = this.numberOfRows <= 3 ? this.numberOfRows : Math.ceil((this.height - padding -
                    parseInt(heatMap.legendSettings.textStyle.size, 10) -
                    this.legendRectPadding) / (this.legendSize + this.listInterval));
                this.numberOfPages = Math.ceil(this.numberOfRows / this.listPerPage);
            }
            else {
                this.listPerPage = 1;
            }
        }
        else {
            if (this.listHeight > rect.height || this.listHeight > this.height) {
                let maxHeight = stringToNumber(this.legendHeight, rect.height);
                maxHeight = maxHeight > rect.height ? rect.height : maxHeight;
                maxHeight = heatMap.legendSettings.title.text ? maxHeight - titleSize.height : maxHeight;
                this.listPerPage = Math.floor(maxHeight / (this.legendSize + this.listInterval) - 1);
                this.numberOfPages = Math.max(1, Math.ceil(heatMap.colorCollection.length / this.listPerPage));
            }
            else {
                this.listPerPage = heatMap.colorCollection.length;
                this.legendHeight = this.listHeight.toString();
            }
        }
    }
    renderPagingElements() {
        let heatMap = this.heatMap;
        if (this.numberOfPages > 1) {
            this.navigationCollections = [];
            this.legend.appendChild(this.paginggroup);
            let iconSize = 10;
            let rightArrowX = this.legendGroup.x + this.legendGroup.width - iconSize;
            let rightArrowY = this.legendGroup.y + this.legendGroup.height - iconSize;
            let text = this.currentPage + '/' + this.numberOfPages;
            let textSize = measureText(text, heatMap.legendSettings.textStyle);
            let textX = rightArrowX - textSize.width - 15;
            let textBasic = new TextBasic(textX, rightArrowY, 'start', text, 0, 'translate(0,0)', 'middle');
            let options = new TextOption(heatMap.element.id + '_paging', textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
            this.drawSvgCanvas.createText(options, this.paginggroup, text);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                this.paginggroup.lastChild.setAttribute('dy', '0.6ex');
            }
            this.pagingRect = new Rect(textX, rightArrowY - textSize.height / 2, textSize.width, textSize.height);
            let pagingTextRect = new RectOption(heatMap.element.id + '_pagingText', 'none', { color: 'transparent', width: 0 }, 1, this.pagingRect);
            this.drawSvgCanvas.drawRectangle(pagingTextRect, this.paginggroup);
            let rightArrowRect = new RectOption(heatMap.element.id + '_rightArrow', 'none', { color: 'transparent', width: 0 }, 1, new Rect(rightArrowX - iconSize, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(rightArrowRect, this.paginggroup);
            let rightArrow = 'M' + ' ' + (rightArrowX) + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (rightArrowX - iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (rightArrowX - iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            let leftX = textX - 15;
            let leftArrow = 'M' + ' ' + leftX + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (leftX + iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (leftX + iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            let leftArrowRect = new RectOption(heatMap.element.id + '_leftArrow', 'none', { color: 'transparent', width: 0 }, 1, new Rect(leftX, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(leftArrowRect, this.paginggroup);
            let leftOption = new PathOption(heatMap.element.id + '_Legend_leftarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', leftArrow);
            let rightOption = new PathOption(heatMap.element.id + '_Legend_rightarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', rightArrow);
            this.navigationCollections.push(rightArrowRect);
            this.navigationCollections.push(leftArrowRect);
            if (!heatMap.enableCanvasRendering) {
                let arrow = heatMap.renderer.drawPath(leftOption);
                let rightarrow = heatMap.renderer.drawPath(rightOption);
                this.paginggroup.appendChild(arrow);
                this.paginggroup.appendChild(rightarrow);
            }
            else {
                let canvasTranslate;
                heatMap.canvasRenderer.drawPath(leftOption, canvasTranslate);
                heatMap.canvasRenderer.drawPath(rightOption, canvasTranslate);
            }
        }
    }
    calculateGradientScale(scale) {
        let heatMap = this.heatMap;
        let padding = 10; // padding between legend bounds and gradient scale
        let left;
        let top;
        let height;
        let width;
        let title = heatMap.legendSettings.title;
        let titleSize = measureText(title.text, title.textStyle);
        let titleHeight = heatMap.legendSettings.title.text ? titleSize.height : 0;
        if (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) {
            this.measureListLegendBound(heatMap.initialClipRect);
        }
        if (heatMap.horizontalGradient) {
            left = scale.x + padding;
            top = scale.y + this.legendRectPadding;
            width = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                scale.width - (2 * this.listInterval) : scale.width - 2 * padding;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval : this.gradientScaleSize;
        }
        else {
            left = scale.x + this.legendRectPadding;
            top = scale.y + padding + titleHeight;
            width = (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) ?
                scale.width - padding : this.gradientScaleSize;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval :
                scale.height - 2 * padding - titleHeight;
        }
        this.legendRectScale = new Rect(left, top, width, height);
        if (heatMap.paletteSettings.type === 'Gradient' || heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend) {
            this.calculateColorAxisGrid(this.legendRectScale);
        }
    }
    calculateColorAxisGrid(legendRect) {
        let heatMap = this.heatMap;
        let rect = this.legendRectScale;
        let legendPart;
        let text;
        let maxTextWrapLength = 0;
        this.segmentCollectionsLabels = [];
        this.segmentCollections = [];
        this.textWrapCollections = [];
        let pathX1;
        let pathY1;
        let colorCollection = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        let minValue = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        let maxValue = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        this.legendMinValue = this.heatMap.isColorRange ? (colorCollection[0].startValue > heatMap.dataSourceMinValue) ?
            heatMap.dataSourceMinValue : colorCollection[0].startValue : ((colorCollection[0].value > minValue) ? minValue :
            colorCollection[0].value);
        this.legendMaxValue = this.heatMap.isColorRange ? (colorCollection[colorCollection.length - 1].endValue <
            heatMap.dataSourceMaxValue) ? heatMap.dataSourceMaxValue : colorCollection[colorCollection.length - 1].endValue :
            (colorCollection[colorCollection.length - 1].value < maxValue ? maxValue : colorCollection[colorCollection.length - 1].value);
        if (heatMap.paletteSettings.type === 'Gradient') {
            for (let index = 0; index < colorCollection.length; index++) {
                let value;
                legendPart = (this.heatMap.isColorRange && heatMap.horizontalGradient ? rect.width : rect.height) / 100;
                if (this.heatMap.isColorRange) {
                    if (colorCollection[0].startValue !== this.heatMap.dataSourceMinValue && index === 0 &&
                        colorCollection[0].startValue > this.heatMap.dataSourceMinValue) {
                        value = (this.heatMap.dataSourceMinValue - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue) * 100;
                        pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                        this.segmentCollections.push(pathY1);
                    }
                    value = ((((colorCollection[index].startValue < heatMap.dataSourceMinValue && colorCollection[index].endValue >
                        heatMap.dataSourceMaxValue) ? heatMap.dataSourceMinValue : colorCollection[index].startValue) -
                        this.legendMinValue) / (this.legendMaxValue - this.legendMinValue)) * 100;
                    value = isNaN(value) ? 0 : value;
                    pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                    this.segmentCollections.push(pathY1);
                    this.segmentCollectionsLabels.push(pathY1);
                    if (colorCollection[index].endValue !== ((index === colorCollection.length - 1) ?
                        this.heatMap.dataSourceMaxValue : colorCollection[index + 1].startValue) &&
                        this.heatMap.legendColorCollection[index].endValue < this.heatMap.dataSourceMaxValue) {
                        if (index === colorCollection.length - 1) {
                            value = (colorCollection[index].endValue - this.legendMinValue) /
                                (this.legendMaxValue - this.legendMinValue) * 100;
                            pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                            this.segmentCollections.push(pathY1);
                        }
                        value = ((index === colorCollection.length - 1 ? this.heatMap.dataSourceMaxValue :
                            colorCollection[index].endValue) - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue) * 100;
                        pathY1 = (heatMap.horizontalGradient ? legendRect.x : legendRect.y) + (legendPart * value);
                        this.segmentCollections.push(pathY1);
                    }
                }
                else {
                    value = ((colorCollection[index].value - this.legendMinValue) / (this.legendMaxValue - this.legendMinValue)) * 100;
                    value = isNaN(value) ? 0 : value;
                    if (!heatMap.horizontalGradient) {
                        legendPart = rect.height / 100;
                        pathY1 = legendRect.y + (legendPart * value);
                        this.segmentCollections.push(pathY1);
                    }
                    else {
                        legendPart = rect.width / 100;
                        pathX1 = legendRect.x + (legendPart * value);
                        this.segmentCollections.push(pathX1);
                    }
                }
            }
        }
        let textWrapWidth;
        if (heatMap.horizontalGradient) {
            for (let i = 0; i < colorCollection.length; i++) {
                if (heatMap.paletteSettings.type === 'Gradient') {
                    let previousSegmentWidth = (this.segmentCollections[i] - this.segmentCollections[i - 1]) / 2;
                    let nextSegmentWidth = (this.segmentCollections[i + 1] - this.segmentCollections[i]) / 2;
                    if (i === colorCollection.length - 1) {
                        textWrapWidth = previousSegmentWidth;
                    }
                    else if (i === 0) {
                        textWrapWidth = nextSegmentWidth;
                    }
                    else {
                        textWrapWidth = previousSegmentWidth < nextSegmentWidth ? previousSegmentWidth : nextSegmentWidth;
                    }
                }
                else {
                    let width = this.legendRectScale.width / heatMap.colorCollection.length;
                    textWrapWidth = heatMap.legendSettings.labelDisplayType === 'Edge' ? width : width / 2;
                }
                this.textWrapCollections.push(textWrapWidth);
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                maxTextWrapLength = text.length > maxTextWrapLength ? text.length : maxTextWrapLength;
            }
            if (heatMap.legendSettings.position === 'Bottom') {
                heatMap.initialClipRect.height -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendGroup.y -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendRectScale.y = this.legendGroup.y + this.legendRectPadding;
                this.legendGroup.height = parseInt(this.legendHeight, 10) + (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
            }
            else {
                heatMap.initialClipRect.y += (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                heatMap.initialClipRect.height -= (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
                this.legendRectScale.y = this.legendGroup.y + this.legendRectPadding;
                this.legendGroup.height = parseInt(this.legendHeight, 10) + (this.maxLegendLabelSize.height * (maxTextWrapLength - 1));
            }
        }
    }
    renderColorAxisGrid(legendRect) {
        let heatMap = this.heatMap;
        let legendElement;
        let pathX1;
        let pathY1;
        let pathX2;
        let pathY2;
        if (!heatMap.enableCanvasRendering) {
            legendElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + '_ColorAxis_Grid' });
        }
        for (let i = 0; i < (heatMap.isColorRange ? this.segmentCollections.length : heatMap.legendColorCollection.length); i++) {
            if (!heatMap.horizontalGradient) {
                pathX1 = legendRect.x;
                pathY1 = pathY2 = this.segmentCollections[i];
                pathX2 = legendRect.x + legendRect.width;
            }
            else {
                pathX1 = pathX2 = this.segmentCollections[i];
                pathY1 = legendRect.y;
                pathY2 = legendRect.y + legendRect.height;
            }
            let direction = new Line(pathX1, pathY1, pathX2, pathY2);
            let line = new LineOption(this.heatMap.element.id + '_ColorAxis_Grid' + i, direction, '#EEEEEE', 1);
            this.drawSvgCanvas.drawLine(line, legendElement);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(legendElement);
            }
        }
    }
    /**
     * @private
     */
    renderLegendTitleTooltip(e, pageX, pageY) {
        if (e.target.id.indexOf('_legendTitle') !== -1 && e.target.textContent.indexOf('...') > -1) {
            showTooltip(this.heatMap.legendSettings.title.text, pageX, pageY, this.heatMap.element.offsetWidth, this.heatMap.element.id + '_legendTitle_Tooltip', getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
            document.getElementById(this.heatMap.element.id + '_legendTitle_Tooltip').style.visibility = 'visible';
        }
        else {
            let element = document.getElementById(this.heatMap.element.id + '_legendTitle_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    }
    /**
     * @private
     */
    renderLegendLabelTooltip(e, pageX, pageY) {
        if (e.target.id.indexOf('_Legend_Label') !== -1 && e.target.textContent.indexOf('...') > -1) {
            let targetId = e.target.id.split(this.heatMap.element.id + '_Legend_Label');
            if (targetId.length === 2) {
                let index;
                if (targetId[1].length === 1 || this.heatMap.legendSettings.textStyle.textOverflow === 'Trim') {
                    index = parseInt(targetId[1], 10);
                }
                else {
                    index = parseInt(targetId[1].substring(0, targetId[1].length - 1), 10);
                }
                showTooltip(this.labelCollections[index], pageX, pageY, this.heatMap.element.offsetWidth, this.heatMap.element.id + '_LegendLabel_Tooltip', getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
                document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip').style.visibility = 'visible';
            }
        }
        else {
            let element = document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    }
    calculateListPerPage(rect) {
        let heatMap = this.heatMap;
        if (heatMap.horizontalGradient) {
            this.lastList = [];
            let legendX = rect.x;
            let legendY = rect.y;
            let size = 0;
            let division = 0;
            let labelX = 0;
            let labelY = 0;
            let interval = 20;
            let i;
            let legendSize = 10;
            let padding = 5;
            this.labelXCollections = [];
            this.labelYCollections = [];
            this.legendXCollections = [];
            this.legendYCollections = [];
            for (i = 0; i < heatMap.colorCollection.length; i++) {
                if (heatMap.legendSettings.showLabel) {
                    let text = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                labelX = legendX + legendSize + padding;
                labelY = legendY + padding;
                let maxWidth = heatMap.legendSettings.showLabel ? labelX + size : legendX + this.legendSize + this.listInterval;
                if (i !== 0 && maxWidth > this.legendGroup.width + this.legendGroup.x - this.listInterval) {
                    division += 1;
                    legendX = rect.x;
                    legendY = rect.y + (division * interval);
                    labelX = legendX + legendSize + padding;
                    labelY = legendY + padding;
                    if (division % (this.listPerPage) === 0) {
                        this.lastList.push(i);
                        legendY = rect.y;
                        labelY = legendY + padding;
                        division = 0;
                    }
                }
                this.labelXCollections.push(labelX);
                this.labelYCollections.push(labelY);
                this.legendXCollections.push(legendX);
                this.legendYCollections.push(legendY);
                legendX = legendX + this.legendSize + this.labelPadding + size + this.listInterval;
            }
            this.lastList.push(i);
            this.numberOfPages = this.lastList.length;
        }
    }
    renderListLegendMode(rect, translate) {
        let heatMap = this.heatMap;
        let legendSize = 10;
        let tempBorder = {
            color: 'transparent', width: 0,
        };
        let padding = 5; // padding for legend label from top
        this.legendLabelTooltip = [];
        let listRect;
        let size = new Size(0, 0);
        let labelX = 0;
        let labelY = 0;
        let legendX = rect.x;
        let legendY = rect.y;
        if (translate) {
            this.renderPagingElements();
        }
        let x;
        let y;
        let textWrapWidth = heatMap.legendSettings.title.text ? this.width - (2 * (this.legendSize + this.labelPadding)) :
            this.legendGroup.width - (this.legendSize + this.legendRectPadding + this.labelPadding);
        if (!heatMap.horizontalGradient) {
            x = (this.currentPage * (this.listPerPage)) - (this.listPerPage);
            y = x + this.listPerPage;
            y = y < heatMap.colorCollection.length ? y : heatMap.colorCollection.length;
        }
        else {
            x = this.currentPage === 1 ? 0 : this.lastList[this.currentPage - 2];
            y = this.lastList[this.currentPage - 1];
        }
        for (let i = x; i < y; i++) {
            if (heatMap.legendSettings.showLabel) {
                let text = this.labelCollections[i];
                size = measureText(text, heatMap.legendSettings.textStyle);
            }
            let legendEventArgs = {
                cancel: false, text: this.labelCollection[i], name: 'legendRender',
            };
            if (heatMap.horizontalGradient) {
                legendX = this.legendXCollections[i];
                legendY = this.legendYCollections[i];
                labelX = this.labelXCollections[i];
                labelY = this.labelYCollections[i];
            }
            labelX = legendX + this.legendSize + this.labelPadding;
            labelY = legendY + padding;
            this.heatMap.trigger('legendRender', legendEventArgs);
            if (translate && heatMap.rendering && this.legendRange.length <= heatMap.colorCollection.length) {
                let rectPosition = new LegendRange(legendX, legendY, legendSize, legendSize, heatMap.colorCollection[i].value, true, this.currentPage);
                rectPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                if (!legendEventArgs.cancel) {
                    this.legendRange.push(rectPosition);
                }
                else {
                    let rectPosition = new LegendRange(legendX, legendY, 0, 0, heatMap.colorCollection[i].value, true, this.currentPage);
                    this.legendRange.push(rectPosition);
                }
                if (heatMap.legendSettings.showLabel) {
                    let textPosition = new LegendRange(labelX, (labelY - size.height / 2), size.width, size.height, heatMap.colorCollection[i].value, true, this.currentPage);
                    textPosition.visible = !isNullOrUndefined(this.visibilityCollections[i]) ? this.visibilityCollections[i] : true;
                    this.legendTextRange.push(textPosition);
                }
            }
            if (!legendEventArgs.cancel) {
                if (heatMap.legendSettings.showLabel) {
                    let text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                    if (text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                        this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(labelX, labelY, size.width, size.height)));
                    }
                    let textBasic = new TextBasic(labelX, labelY, 'start', text, 0, 'translate(0,0)', 'middle');
                    let options = new TextOption(heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                    options.fill = heatMap.legendOnLoad ? options.fill : this.legendRange[i].visible ? options.fill : '#D3D3D3';
                    this.drawSvgCanvas.createText(options, this.translategroup, text[0]);
                    if (Browser.isIE && !heatMap.enableCanvasRendering) {
                        this.translategroup.lastChild.setAttribute('dy', '0.6ex');
                    }
                }
                listRect = new Rect(legendX, legendY, legendSize, legendSize);
                let listColor = heatMap.legendOnLoad ? this.heatMap.isColorRange ? heatMap.colorCollection[i].minColor :
                    heatMap.colorCollection[i].color :
                    this.legendRange[i].visible ? this.heatMap.isColorRange ? heatMap.colorCollection[i].minColor :
                        heatMap.colorCollection[i].color : '#D3D3D3';
                let rectItems = new RectOption(heatMap.element.id + '_legend_list' + i, listColor, tempBorder, 1, listRect);
                this.drawSvgCanvas.drawRectangle(rectItems, this.translategroup);
                heatMap.horizontalGradient ? legendX = legendX + this.legendSize + this.labelPadding + size.width + this.listInterval :
                    legendY += this.legendSize + this.listInterval;
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            let clippath = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_LegendScale_ClipPath' });
            let clipRect = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            this.translategroup.appendChild(clippath);
            this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            this.legendScale.appendChild(this.translategroup);
            heatMap.svgObject.appendChild(this.legend);
        }
    }
    /**
     * @private
     */
    translatePage(heatMap, page, isNext) {
        let padding = 5;
        if ((isNext && page >= 1 && page < this.numberOfPages) || (!isNext && page > 1 && page <= this.numberOfPages)) {
            if (isNext) {
                this.currentPage += 1;
                this.legendRect.y += this.legendRect.height;
            }
            else {
                this.currentPage -= 1;
                this.legendRect.y -= this.legendRect.height;
            }
            if (!heatMap.enableCanvasRendering) {
                this.paginggroup.removeChild(this.paginggroup.firstChild);
                while (this.translategroup.childNodes.length) {
                    this.translategroup.removeChild(this.translategroup.firstChild);
                }
            }
            else {
                let ctx = heatMap.canvasRenderer.ctx;
                ctx.fillRect(this.legendRectScale.x - padding, this.legendRectScale.y - padding, this.legendRectScale.width +
                    padding, this.legendRectScale.height + (2 * padding));
                ctx.fillRect(this.pagingRect.x, this.pagingRect.y, this.pagingRect.width, this.pagingRect.height);
            }
            this.renderListLegendMode(this.legendRectScale, true);
        }
        if (heatMap.enableCanvasRendering && heatMap.allowSelection && heatMap.rectSelected) {
            let ctx = heatMap.secondaryCanvasRenderer.ctx;
            let position = heatMap.legendSettings.position;
            let initialRect = heatMap.initialClipRect;
            let rectX = position === 'Right' ? initialRect.x + initialRect.width : 0;
            let rectY = position === 'Bottom' ? initialRect.y + initialRect.height : 0;
            let rectWidth = position === 'Right' ? heatMap.availableSize.width - (initialRect.x +
                initialRect.width) : position === 'Left' ? initialRect.x : heatMap.availableSize.width;
            let rectHeight = position === 'Top' ? initialRect.y : position === 'Bottom' ?
                heatMap.availableSize.height - (initialRect.y + initialRect.height) : heatMap.availableSize.height;
            ctx.save();
            ctx.clearRect(rectX, rectY, rectWidth, rectHeight);
            ctx.restore();
            let oldCanvas = document.getElementById(heatMap.element.id + '_canvas');
            let newCanvas = document.getElementById(heatMap.element.id + '_secondary_canvas');
            let rectImage = oldCanvas.getContext('2d').getImageData(rectX, rectY, rectWidth, rectHeight);
            newCanvas.getContext('2d').putImageData(rectImage, rectX, rectY);
            oldCanvas.style.opacity = '0.3';
        }
    }
    /**
     * To create div container for tooltip which appears on hovering the smart legend.
     * @param heatmap
     * @private
     */
    createTooltipDiv(heatMap) {
        let element = createElement('div', {
            id: this.heatMap.element.id + 'legendLabelTooltipContainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(element);
    }
    /**
     * To render tooltip for smart legend.
     * @private
     */
    renderTooltip(currentLegendRect) {
        let heatMap = this.heatMap;
        let tempTooltipText = [currentLegendRect.label];
        let offset = null;
        offset = parseInt(heatMap.legendSettings.textStyle.size, 10) / 2;
        this.tooltipObject = new Tooltip({
            offset: offset,
            theme: heatMap.theme,
            content: tempTooltipText,
            location: {
                x: currentLegendRect.x + (currentLegendRect.width / 2),
                y: currentLegendRect.y + (currentLegendRect.height / 2)
            },
            inverted: heatMap.horizontalGradient ? false : true,
            areaBounds: {
                height: this.legendGroup.height + this.legendGroup.y,
                width: this.legendGroup.width + this.legendGroup.x,
                x: heatMap.legendSettings.position === 'Right' ? 0 : this.legendGroup.x,
                y: heatMap.legendSettings.position === 'Top' ? heatMap.titleSettings.text === '' ? this.legendGroup.height -
                    this.legendGroup.y : this.legendGroup.y : 0
            }
        }, '#' + this.heatMap.element.id + 'legendLabelTooltipContainer');
        this.tooltipObject.element.style.visibility = 'visible';
    }
    /**
     * To create tooltip for smart legend.
     * @private
     */
    createTooltip(pageX, pageY) {
        let currentLegendRect;
        for (let i = 0; i < this.heatMap.colorCollection.length; i++) {
            let position = this.legendRectPositionCollection[i];
            if (position && pageX > position.x && pageX < position.width + position.x &&
                pageY > position.y && pageY < position.height + position.y) {
                currentLegendRect = this.legendRectPositionCollection[i];
                break;
            }
        }
        let ele = document.getElementById(this.heatMap.element.id + 'legendLabelTooltipContainer');
        if (ele && ele.style.visibility === 'visible' && this.tooltipObject && !this.heatMap.isTouch) {
            this.tooltipObject.fadeOut();
            ele.style.visibility = 'hidden';
        }
        if (currentLegendRect) {
            this.renderTooltip(currentLegendRect);
        }
    }
    /**
     * Toggle the visibility of cells based on legend selection
     * @private
     */
    legendRangeSelection(index) {
        let heatMap = this.heatMap;
        let legendRange = this.legendRange;
        let padding = 5;
        let legendPadding = heatMap.horizontalGradient ? 10 : 0;
        let legendBound = this.legendRectScale;
        let ctx = heatMap.canvasRenderer.ctx;
        heatMap.rangeSelection = true;
        if (heatMap.enableCanvasRendering) {
            let ctx = heatMap.canvasRenderer.ctx;
            if (heatMap.legendSettings.enableSmartLegend) {
                ctx.fillRect(legendBound.x - padding, legendBound.y - padding, (legendBound.width + this.labelPadding +
                    this.maxLegendLabelSize.width) + padding, legendBound.height + 2 * (padding + legendPadding));
            }
            else {
                ctx.fillRect(legendBound.x - padding, legendBound.y - padding, legendBound.width +
                    padding, legendBound.height + (2 * padding));
            }
        }
        else {
            if (heatMap.legendSettings.enableSmartLegend) {
                while (this.legend && this.legend.childNodes.length) {
                    this.legend.removeChild(this.legend.firstChild);
                }
            }
            else {
                while (this.translategroup && this.translategroup.childNodes.length) {
                    this.translategroup.removeChild(this.translategroup.firstChild);
                }
            }
            removeElement(heatMap.heatMapSeries.containerRectObject.id);
            if (heatMap.cellSettings.showLabel) {
                removeElement(heatMap.heatMapSeries.containerTextObject.id);
            }
        }
        if (heatMap.legendSettings.enableSmartLegend) {
            if (heatMap.colorCollection.length !== heatMap.legendColorCollection.length) {
                if (index === heatMap.legendColorCollection.length - 1) {
                    heatMap.toggleValue[index - 1].visible = this.visibilityCollections[index - 1] =
                        legendRange[index - 1].visible = !legendRange[index].visible;
                }
                else {
                    if (index === heatMap.colorCollection.length - 1) {
                        heatMap.toggleValue[index + 1].visible = this.visibilityCollections[index + 1] =
                            legendRange[index + 1].visible = !legendRange[index].visible;
                    }
                }
            }
        }
        heatMap.toggleValue[index].visible = this.visibilityCollections[index] = legendRange[index].visible = !legendRange[index].visible;
        heatMap.legendOnLoad = false;
        if (heatMap.legendSettings.enableSmartLegend) {
            this.renderSmartLegend();
            let rectItemsSvg = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height);
            this.renderLegendLabel(rectItemsSvg);
            if (heatMap.enableCanvasRendering) {
                ctx.save();
                ctx.clip();
            }
            if (heatMap.renderingMode === 'SVG') {
                this.renderTitle(rectItemsSvg);
            }
        }
        else {
            this.renderListLegendMode(this.legendRectScale, false);
        }
        if (heatMap.enableCanvasRendering) {
            ctx.restore();
        }
        heatMap.heatMapSeries.renderRectSeries();
        heatMap.clearSelection();
        if (heatMap.enableCanvasRendering && heatMap.allowSelection) {
            // heatMap.createSvg();
            // heatMap.refreshBound();
            // heatMap.createMultiCellDiv(false);
        }
    }
    /**
     * update visibility collections of legend and series
     * @private
     */
    updateLegendRangeCollections() {
        let heatMap = this.heatMap;
        heatMap.rangeSelection = !heatMap.legendOnLoad ? true : false;
        this.visibilityCollections = !heatMap.legendOnLoad ? this.visibilityCollections : [];
        heatMap.toggleValue = !heatMap.legendOnLoad ? heatMap.toggleValue : [];
        this.legendRange = !heatMap.legendOnLoad ? this.legendRange : [];
        this.legendTextRange = !heatMap.legendOnLoad ? this.legendTextRange : [];
    }
}

var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Adaptor Property in the Heatmap.
 */
class Data extends ChildProperty {
}
__decorate$7([
    Property(false)
], Data.prototype, "isJsonData", void 0);
__decorate$7([
    Property('None')
], Data.prototype, "adaptorType", void 0);
__decorate$7([
    Property('')
], Data.prototype, "xDataMapping", void 0);
__decorate$7([
    Property('')
], Data.prototype, "yDataMapping", void 0);
__decorate$7([
    Property('')
], Data.prototype, "valueMapping", void 0);
__decorate$7([
    Complex({}, BubbleData)
], Data.prototype, "bubbleDataMapping", void 0);
class AdaptiveMinMax {
}
/**
 *
 * The `Adaptor` module is used to handle JSON and Table data.
 */
class Adaptor {
    constructor(heatMap) {
        this.reconstructedXAxis = [];
        this.reconstructedYAxis = [];
        this.adaptiveXMinMax = new AdaptiveMinMax();
        this.adaptiveYMinMax = new AdaptiveMinMax();
        this.heatMap = heatMap;
    }
    /**
     * Method to construct Two Dimentional Datasource.
     * @return {void}
     * @private
     */
    constructDatasource(dataSource, dataSourceSettings) {
        if (dataSourceSettings.adaptorType === 'Cell') {
            let xAxis = this.heatMap.xAxis;
            let yAxis = this.heatMap.yAxis;
            this.adaptiveXMinMax.min = xAxis.minimum;
            this.adaptiveXMinMax.max = xAxis.maximum;
            this.adaptiveYMinMax.min = yAxis.minimum;
            this.adaptiveYMinMax.max = yAxis.maximum;
            if (((xAxis.valueType === 'Numeric' || xAxis.valueType === 'DateTime') &&
                (isNullOrUndefined(xAxis.minimum) || isNullOrUndefined(xAxis.maximum))) ||
                ((yAxis.valueType === 'Numeric' || yAxis.valueType === 'DateTime') &&
                    (isNullOrUndefined(yAxis.minimum) || isNullOrUndefined(yAxis.maximum)))) {
                this.getMinMaxValue(dataSource, dataSourceSettings, xAxis, yAxis);
            }
            this.heatMap.isCellData = true;
        }
        if (dataSourceSettings.adaptorType === 'None') {
            this.heatMap.completeAdaptDataSource = dataSource;
        }
        else if (!dataSourceSettings.isJsonData && dataSourceSettings.adaptorType === 'Table') {
            this.heatMap.completeAdaptDataSource = dataSource;
        }
        else if (dataSourceSettings.isJsonData && dataSourceSettings.adaptorType === 'Table') {
            this.heatMap.completeAdaptDataSource = this.processJsonTableData(dataSource, dataSourceSettings);
        }
        else if (dataSourceSettings.isJsonData && dataSourceSettings.adaptorType === 'Cell') {
            this.heatMap.completeAdaptDataSource = this.processJsonCellData(dataSource, dataSourceSettings);
        }
        else if (!dataSourceSettings.isJsonData && dataSourceSettings.adaptorType === 'Cell') {
            this.constructAdaptiveAxis();
            this.heatMap.completeAdaptDataSource = this.processCellData(dataSource);
            this.heatMap.isCellData = true;
        }
    }
    /**
     * Method to construct Axis Collection.
     * @return {void}
     * @private
     */
    constructAdaptiveAxis() {
        let xAxis = this.heatMap.xAxis;
        let yAxis = this.heatMap.yAxis;
        if (xAxis.valueType === 'Numeric') {
            this.reconstructedXAxis = this.getNumericAxisCollection(this.adaptiveXMinMax.min, this.adaptiveXMinMax.max, xAxis.increment);
        }
        if (yAxis.valueType === 'Numeric') {
            this.reconstructedYAxis = this.getNumericAxisCollection(this.adaptiveYMinMax.min, this.adaptiveYMinMax.max, yAxis.increment);
        }
        if (xAxis.valueType === 'DateTime') {
            this.reconstructedXAxis = this.getDateAxisCollection(this.adaptiveXMinMax.min, this.adaptiveXMinMax.max, xAxis.intervalType, xAxis.increment);
        }
        if (yAxis.valueType === 'DateTime') {
            this.reconstructedYAxis = this.getDateAxisCollection(this.adaptiveYMinMax.min, this.adaptiveYMinMax.max, yAxis.intervalType, yAxis.increment);
        }
    }
    /**
     * Method to calculate Numeric Axis Collection.
     * @return {string[]}
     * @private
     */
    getNumericAxisCollection(min, max, increment) {
        let loopIndex = min;
        let tempAxisColl = [];
        while (loopIndex <= max) {
            tempAxisColl.push(loopIndex.toString());
            loopIndex = loopIndex + increment;
        }
        return tempAxisColl;
    }
    /**
     * Method to calculate DateTime Axis Collection.
     * @return {string[]}
     * @private
     */
    getDateAxisCollection(min, max, intervalType, increment) {
        let option = {
            skeleton: 'full',
            type: 'dateTime'
        };
        let dateParser = this.heatMap.intl.getDateParser(option);
        let dateFormatter = this.heatMap.intl.getDateFormat(option);
        min = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: min }).val))));
        let tempInterval = min;
        let tempAxisColl = [];
        while (tempInterval <= max) {
            tempAxisColl.push(new Date(tempInterval).toString());
            tempInterval = increaseDateTimeInterval(tempInterval, 1, intervalType, increment).getTime();
        }
        return tempAxisColl;
    }
    /**
     * Method to calculate Maximum and Minimum Value from datasource.
     * @return {void}
     * @private
     */
    getMinMaxValue(dataSource, adapData, xAxis, yAxis) {
        let data = dataSource;
        let label = Object.keys(data[0]);
        if (data.length > 0) {
            this.adaptiveXMinMax.min = !isNullOrUndefined(xAxis.minimum) ? xAxis.minimum : adapData.isJsonData ?
                // tslint:disable-next-line:no-any
                data[0][label[0]] : data[0][0];
            this.adaptiveYMinMax.min = !isNullOrUndefined(yAxis.minimum) ? yAxis.minimum : adapData.isJsonData ?
                // tslint:disable-next-line:no-any
                data[0][label[1]] : data[0][1];
            this.adaptiveXMinMax.max = !isNullOrUndefined(xAxis.maximum) ? xAxis.maximum : adapData.isJsonData ?
                // tslint:disable-next-line:no-any
                data[0][label[0]] : data[0][0];
            this.adaptiveYMinMax.max = !isNullOrUndefined(yAxis.maximum) ? yAxis.maximum : adapData.isJsonData ?
                // tslint:disable-next-line:no-any
                data[0][label[1]] : data[0][1];
        }
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            // tslint:disable-next-line:no-any
            let xDataIndex = adapData.isJsonData ? data[dataIndex][label[0]] : data[dataIndex][0];
            // tslint:disable-next-line:no-any
            let yDataIndex = adapData.isJsonData ? data[dataIndex][label[1]] : data[dataIndex][1];
            if (xDataIndex < this.adaptiveXMinMax.min && isNullOrUndefined(xAxis.minimum)) {
                this.adaptiveXMinMax.min = xDataIndex;
            }
            if (xDataIndex > this.adaptiveXMinMax.max && isNullOrUndefined(xAxis.maximum)) {
                this.adaptiveXMinMax.max = xDataIndex;
            }
            if (yDataIndex < this.adaptiveYMinMax.min && isNullOrUndefined(yAxis.minimum)) {
                this.adaptiveYMinMax.min = yDataIndex;
            }
            if (yDataIndex > this.adaptiveYMinMax.max && isNullOrUndefined(yAxis.maximum)) {
                this.adaptiveYMinMax.max = yDataIndex;
            }
        }
    }
    /**
     * Method to process Cell datasource.
     * @return {Object}
     * @private
     */
    processCellData(dataSource) {
        // tslint:disable-next-line:no-any 
        let tempDataCollection = dataSource;
        let xLabels = this.reconstructedXAxis;
        let yLabels = this.reconstructedYAxis;
        let currentDataXIndex = 0;
        let currentDataYIndex = 0;
        this.reconstructData = [];
        if (tempDataCollection && tempDataCollection.length) {
            for (let xindex = 0; xindex < tempDataCollection.length; xindex++) {
                if (this.heatMap.xAxis.valueType === 'Category') {
                    currentDataXIndex = tempDataCollection[xindex][0];
                }
                else {
                    currentDataXIndex = xLabels.indexOf(tempDataCollection[xindex][0].toString());
                }
                if (currentDataXIndex > -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    if (this.heatMap.yAxis.valueType === 'Category') {
                        currentDataYIndex = tempDataCollection[xindex][1];
                    }
                    else {
                        currentDataYIndex = yLabels.indexOf(tempDataCollection[xindex][1].toString());
                    }
                    if (currentDataYIndex !== -1) {
                        while (this.reconstructData[currentDataXIndex][currentDataYIndex] !== '') {
                            this.reconstructData[currentDataXIndex].push('');
                        }
                        this.reconstructData[currentDataXIndex][currentDataYIndex] = isNullOrUndefined(tempDataCollection[xindex][2]) ?
                            '' : tempDataCollection[xindex][2];
                    }
                }
            }
        }
        return this.reconstructData;
    }
    /**
     * Method to process JSON Cell datasource.
     * @return {Object}
     * @private
     */
    processJsonCellData(dataSource, adaptordata) {
        // tslint:disable-next-line:no-any 
        let tempDataCollection = dataSource;
        let xAxisLabels = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        let yAxisLabels = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        let axisCollections = this.heatMap.axisCollections;
        if (xAxisLabels.length === 0 || yAxisLabels.length === 0) {
            this.generateAxisLabels(dataSource, adaptordata);
        }
        let xLabels = (this.heatMap.xAxis.valueType === 'Category') ? (xAxisLabels.length > 0 ?
            this.heatMap.xAxis.labels : axisCollections[0].jsonCellLabel) : axisCollections[0].labelValue;
        let yLabels = (this.heatMap.yAxis.valueType === 'Category') ? (yAxisLabels.length > 0 ?
            this.heatMap.yAxis.labels : axisCollections[1].jsonCellLabel) : axisCollections[1].labelValue;
        let currentDataXIndex = 0;
        let currentDataYIndex = 0;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (let index = 0; index < tempDataCollection.length; index++) {
                currentDataXIndex = this.getSplitDataValue(tempDataCollection[index], adaptordata, xLabels, adaptordata.xDataMapping.split('.'), this.heatMap.xAxis.valueType);
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    currentDataYIndex = this.getSplitDataValue(tempDataCollection[index], adaptordata, yLabels, adaptordata.yDataMapping.split('.'), this.heatMap.yAxis.valueType);
                    if (currentDataYIndex !== -1) {
                        while (isNullOrUndefined(this.reconstructData[currentDataXIndex][currentDataYIndex])) {
                            this.reconstructData[currentDataXIndex].push('');
                        }
                        if (this.heatMap.bubbleSizeWithColor) {
                            this.reconstructData[currentDataXIndex][currentDataYIndex] = [
                                this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.size.split('.'), ''),
                                this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.color.split('.'), '')
                            ];
                        }
                        else {
                            this.reconstructData[currentDataXIndex][currentDataYIndex] = this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.valueMapping.split('.'), '');
                        }
                    }
                }
            }
        }
        return this.reconstructData;
    }
    /**
     * Method to generate axis labels when labels are not given.
     * @return {string}
     * @private
     */
    generateAxisLabels(dataSource, adaptordata) {
        // tslint:disable-next-line:no-any 
        let tempDataCollection = dataSource;
        let xLabels = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        let yLabels = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        let hasXLabels = xLabels.length > 0 ? true : false;
        let hasYLabels = yLabels.length > 0 ? true : false;
        let axisCollection = this.heatMap.axisCollections;
        for (let index = 0; index < axisCollection.length; index++) {
            let valueType = axisCollection[index].valueType;
            let axis = axisCollection[index];
            if (valueType === 'Category') {
                let hasLabels;
                let dataMapping;
                let labels;
                if (axis.orientation === 'Horizontal') {
                    hasLabels = hasXLabels;
                    dataMapping = adaptordata.xDataMapping;
                    axis.jsonCellLabel = labels = [];
                }
                else {
                    hasLabels = hasYLabels;
                    dataMapping = adaptordata.yDataMapping;
                    axis.jsonCellLabel = labels = [];
                }
                if (!hasLabels) {
                    for (let i = 0; i < tempDataCollection.length; i++) {
                        if (dataMapping in tempDataCollection[i]) {
                            let xValue = tempDataCollection[i][dataMapping].toString();
                            if (labels.indexOf(xValue.toString()) === -1) {
                                labels.push(xValue);
                            }
                        }
                    }
                }
            }
            else if (valueType === 'DateTime') {
                axis.clearAxisLabel();
                axis.calculateDateTimeAxisLabel(this.heatMap);
            }
            else {
                axis.clearAxisLabel();
                axis.calculateNumericAxisLabels(this.heatMap);
            }
        }
    }
    /**
     * Method to get data from complex mapping.
     * @return {number|string}
     * @private
     */
    getSplitDataValue(
    // tslint:disable-next-line:no-any 
    tempSplitDataCollection, adaptordata, labels, tempSplitData, valueType) {
        let value = -1;
        this.tempSplitDataCollection = tempSplitDataCollection;
        for (let splitIndex = 0; splitIndex < tempSplitData.length; splitIndex++) {
            value = !isNullOrUndefined(labels) ? (!(valueType === 'DateTime') ?
                labels.indexOf(this.tempSplitDataCollection[tempSplitData[splitIndex]]) :
                labels.map(Number).indexOf(+this.tempSplitDataCollection[tempSplitData[splitIndex]])) : null;
            if (!isNullOrUndefined(this.tempSplitDataCollection)) {
                this.tempSplitDataCollection = value !== -1 && !isNullOrUndefined(labels) ?
                    this.tempSplitDataCollection : this.tempSplitDataCollection[tempSplitData[splitIndex]];
            }
            if (isNullOrUndefined(this.tempSplitDataCollection)) {
                break;
            }
        }
        value = !isNullOrUndefined(labels) ? value : isNullOrUndefined(this.tempSplitDataCollection) ||
            this.tempSplitDataCollection.toString() === '' ? '' : parseFloat(this.tempSplitDataCollection.toString());
        return value;
    }
    /**
     * Method to process JSON Table datasource.
     * @return {Object}
     * @private
     */
    processJsonTableData(dataSource, adaptordata) {
        // tslint:disable-next-line:no-any 
        let tempDataCollection = dataSource;
        let currentDataXIndex = 0;
        let currentDataYIndex = 0;
        let xLabels = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        let yLabels = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        let key;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (let xindex = 0; xindex < tempDataCollection.length; xindex++) {
                currentDataXIndex = this.getSplitDataValue(tempDataCollection[xindex], adaptordata, xLabels, adaptordata.xDataMapping.split('.'), this.heatMap.xAxis.valueType);
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    for (let index = 0; index < Object.keys(this.tempSplitDataCollection).length; index++) {
                        key = Object.keys(this.tempSplitDataCollection)[index];
                        currentDataYIndex = key !== adaptordata.xDataMapping ? yLabels.indexOf(key) : -1;
                        if (currentDataYIndex !== -1) {
                            while (isNullOrUndefined(this.reconstructData[currentDataXIndex][currentDataYIndex])) {
                                this.reconstructData[currentDataXIndex].push('');
                            }
                            this.reconstructData[currentDataXIndex][currentDataYIndex] =
                                isNullOrUndefined(this.tempSplitDataCollection[key]) ?
                                    '' : this.tempSplitDataCollection[key];
                        }
                    }
                }
            }
        }
        return this.reconstructData;
    }
    /**
     * To destroy the Adaptor.
     * @return {void}
     * @private
     */
    destroy(heatMap) {
        /**
         * No Lines
         */
    }
    ;
    /**
     * To get Module name
     */
    getModuleName() {
        return 'Adaptor';
    }
}

/**
 * Heat Map Component
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
let HeatMap = class HeatMap extends Component {
    constructor() {
        /**
         * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
         * If specified as '100%, heatmap renders to the full width of its parent element.
         * @default null
         */
        super(...arguments);
        /** @private */
        this.enableCanvasRendering = false;
        /** @private */
        this.isColorRange = false;
        /** @private */
        this.isCellTapHold = false;
        /** @private */
        this.selectedCellCount = 0;
        /** @private */
        this.toggleValue = [];
        /** @private */
        this.legendOnLoad = true;
        /** @private */
        this.resizing = false;
        /** @private */
        this.rendering = true;
        /** @private */
        this.horizontalGradient = this.legendSettings.position === 'Bottom' || this.legendSettings.position === 'Top';
        /** @private */
        this.multiSelection = false;
        /** @private */
        this.rectSelected = false;
        /** @private */
        this.previousSelectedCellsRect = [];
        /** @private */
        this.multiCellCollection = [];
        /** @private */
        this.selectedMultiCellCollection = [];
        /** @private */
        this.tempMultiCellCollection = [];
        /**
         * @private
         */
        this.tooltipCollection = [];
        /**
         * @private
         */
        this.isCellData = false;
        /** @private */
        this.isBlazor = false;
    }
    preRender() {
        this.initPrivateVariable();
        this.unWireEvents();
        this.wireEvents();
    }
    initPrivateVariable() {
        this.renderer = new SvgRenderer(this.element.id);
        this.canvasRenderer = new CanvasRenderer(this.element.id);
        this.secondaryCanvasRenderer = new CanvasRenderer(this.element.id + '_secondary');
        this.heatMapAxis = new AxisHelper(this);
        this.heatMapSeries = new Series(this);
        this.drawSvgCanvas = new DrawSvgCanvas(this);
        this.twoDimensional = new TwoDimensional(this);
        this.cellColor = new CellColor(this);
        this.tempRectHoverClass = '';
        this.tempTooltipRectId = '';
        this.setCulture();
        this.isBlazor = isBlazor();
    }
    /**
     * Method to set culture for heatmap
     */
    setCulture() {
        this.intl = new Internationalization();
    }
    render() {
        this.updateBubbleHelperProperty();
        this.trigger('load', { heatmap: (this.isBlazor ? null : this) });
        this.initAxis();
        this.processInitData();
        this.setTheme();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.createSvg();
        this.cellColor.getColorCollection();
        this.calculateBounds();
        this.renderElements();
        this.appendSvgObject();
        if (this.tooltipModule) {
            this.tooltipModule.showHideTooltip(false);
        }
        this.renderComplete();
    }
    /**
     * To re-calculate the datasource while changing datasource property dynamically.
     * @private
     */
    reRenderDatasource() {
        this.dataSourceMinValue = null;
        this.dataSourceMaxValue = null;
        this.processInitData();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.cellColor.getColorCollection();
        this.calculateBounds();
    }
    /**
     * To process datasource property.
     * @private
     */
    processInitData() {
        if (this.adaptorModule) {
            this.adaptorModule.constructDatasource(this.dataSource, this.dataSourceSettings);
        }
        else {
            this.completeAdaptDataSource = this.dataSource;
        }
    }
    /**
     * To set render mode of heatmap as SVG or Canvas.
     * @private
     */
    setRenderMode() {
        if (this.renderingMode === 'Canvas') {
            this.enableCanvasRendering = true;
        }
        else if (this.renderingMode === 'Auto' &&
            (this.axisCollections[0].axisLabelSize * this.axisCollections[1].axisLabelSize) >= 10000) {
            this.enableCanvasRendering = true;
        }
        else {
            this.enableCanvasRendering = false;
        }
    }
    /**
     * To set bubble helper private property.
     * @private
     */
    updateBubbleHelperProperty() {
        if (this.cellSettings.tileType === 'Bubble' &&
            (this.cellSettings.bubbleType === 'Size' || this.cellSettings.bubbleType === 'Sector')) {
            this.legendVisibilityByCellType = false;
        }
        else if (this.legendModule && this.legendSettings.visible) {
            this.legendVisibilityByCellType = true;
        }
        if (this.cellSettings.tileType === 'Bubble' && this.cellSettings.bubbleType === 'SizeAndColor') {
            this.bubbleSizeWithColor = true;
        }
        else {
            this.bubbleSizeWithColor = false;
        }
    }
    renderElements() {
        this.tooltipCollection = [];
        this.renderSecondaryElement();
        this.renderBorder();
        this.renderTitle();
        this.heatMapAxis.renderAxes();
        if (this.tooltipModule && this.showTooltip) {
            this.tooltipModule.tooltipObject = null;
            this.tooltipModule.createTooltipDiv(this);
        }
        this.heatMapSeries.renderRectSeries();
        if (this.legendModule && this.legendSettings.visible
            && this.legendVisibilityByCellType) {
            this.legendModule.renderLegendItems();
            if (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                this.legendSettings.labelDisplayType === 'None') {
                this.legendModule.createTooltipDiv(this);
            }
        }
    }
    /**
     * Get component name
     */
    getModuleName() {
        return 'heatmap';
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        return '';
    }
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let renderer = false;
        let refreshBounds = false;
        let isUpdateSelection = true;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'renderingMode':
                    this.rendering = false;
                    isUpdateSelection = false;
                    renderer = true;
                    break;
                case 'cellSettings':
                    this.updateBubbleHelperProperty();
                    if (this.legendModule && ((newProp.cellSettings.tileType !==
                        oldProp.cellSettings.tileType) || (newProp.cellSettings.bubbleType !== oldProp.cellSettings.bubbleType))) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    if (this.cellSettings.tileType === 'Bubble') {
                        isUpdateSelection = false;
                    }
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'showTooltip':
                    refreshBounds = true;
                    break;
                case 'dataSource':
                case 'dataSourceSettings':
                    this.isCellData = false;
                    this.paletteCellSelectionUpdation();
                    this.reRenderDatasource();
                    isUpdateSelection = false;
                    renderer = true;
                    break;
                case 'titleSettings':
                case 'width':
                case 'height':
                case 'margin':
                    refreshBounds = true;
                    break;
                case 'legendSettings':
                    this.updateBubbleHelperProperty();
                    if (this.legendVisibilityByCellType && (((newProp.legendSettings.visible !== oldProp.legendSettings.visible) ||
                        (newProp.legendSettings.enableSmartLegend !== oldProp.legendSettings.enableSmartLegend)))) {
                        this.legendOnLoad = true;
                        this.legendModule.updateLegendRangeCollections();
                    }
                    else {
                        this.legendOnLoad = false;
                    }
                    refreshBounds = true;
                    break;
                case 'yAxis':
                case 'xAxis':
                    this.paletteCellSelectionUpdation();
                    this.reRenderDatasource();
                    isUpdateSelection = false;
                    refreshBounds = true;
                    break;
                case 'paletteSettings':
                    this.paletteCellSelectionUpdation();
                    this.twoDimensional.processDataSource(this.completeAdaptDataSource);
                    this.cellColor.getColorCollection();
                    this.calculateBounds();
                    renderer = true;
                    break;
                case 'theme':
                    this.setTheme();
                    renderer = true;
                    break;
                case 'tooltipSettings':
                    if (this.tooltipModule) {
                        this.tooltipModule.tooltipObject.fill = this.tooltipSettings.fill;
                        this.tooltipModule.tooltipObject.border = this.tooltipSettings.border;
                        this.tooltipModule.tooltipObject.textStyle = this.tooltipSettings.textStyle;
                        this.tooltipModule.tooltipObject.template = this.tooltipSettings.template;
                        this.tooltipModule.tooltipObject.refresh();
                    }
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.createSvg();
            this.renderElements();
            this.appendSvgObject();
            this.trigger('created');
            if (!isUpdateSelection) {
                this.clearSelection();
            }
        }
        else if (refreshBounds) {
            this.createSvg();
            this.refreshBound();
            this.appendSvgObject();
            this.trigger('created');
        }
        if (this.allowSelection && this.rectSelected) {
            if (isUpdateSelection) {
                this.updateCellSelection();
            }
            else {
                this.clearSelection();
            }
        }
        this.rendering = true;
    }
    paletteCellSelectionUpdation() {
        this.updateBubbleHelperProperty();
        if (this.legendVisibilityByCellType) {
            this.legendOnLoad = true;
            this.legendModule.updateLegendRangeCollections();
        }
    }
    /**
     * create svg or canvas element
     * @private
     */
    createSvg() {
        this.removeSvg();
        this.setRenderMode();
        this.calculateSize();
        if (!this.enableCanvasRendering) {
            this.svgObject = this.renderer.createSvg({
                id: this.element.id + '_svg',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            if (this.cellSettings.border.width.toString() === '0' && this.cellSettings.tileType === 'Rect') {
                this.svgObject.setAttribute('shape-rendering', 'crispEdges');
            }
        }
        else {
            this.svgObject = this.canvasRenderer.createCanvas({
                id: this.element.id + '_canvas',
                width: this.availableSize.width,
                height: this.availableSize.height
            });
            if (this.allowSelection) {
                this.createMultiCellDiv(true);
            }
        }
    }
    /**
     *  To Remove the SVG.
     * @private
     */
    removeSvg() {
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        if (document.getElementById(this.element.id + 'Celltooltipcontainer')) {
            remove(document.getElementById(this.element.id + 'Celltooltipcontainer'));
        }
        if (document.getElementById(this.element.id + 'legendLabelTooltipContainer')) {
            remove(document.getElementById(this.element.id + 'legendLabelTooltipContainer'));
        }
        if (document.getElementById(this.element.id + '_Multi_CellSelection_Canvas')) {
            remove(document.getElementById(this.element.id + '_Multi_CellSelection_Canvas'));
        }
        if (document.getElementById(this.element.id + '_CellSelection_Container')) {
            remove(document.getElementById(this.element.id + '_CellSelection_Container'));
        }
        if (this.svgObject) {
            let svgElement = document.getElementById(this.svgObject.id);
            if (svgElement) {
                while (this.svgObject.childNodes.length) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                remove(this.svgObject);
            }
        }
    }
    renderSecondaryElement() {
        let tooltipDiv = this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        this.element.appendChild(tooltipDiv);
        let divElement = this.createElement('div', {
            id: this.element.id + '_CellSelection_Container',
            styles: 'position:absolute; z-index: 2 ; top:' + this.initialClipRect.y + 'px' + '; left:' + this.initialClipRect.x + 'px',
        });
        this.element.appendChild(divElement);
    }
    /**
     * To provide the array of modules needed for control rendering
     * @return{ModuleDeclaration[]}
     * @private
     */
    requiredModules() {
        let modules = [];
        if (this.showTooltip) {
            modules.push({
                member: 'Tooltip',
                args: [this]
            });
        }
        if (this.legendSettings) {
            modules.push({
                member: 'Legend',
                args: [this]
            });
        }
        if (this.dataSource) {
            modules.push({
                member: 'Adaptor',
                args: [this]
            });
        }
        return modules;
    }
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of Heatmap
     */
    destroy() {
        this.unWireEvents();
        super.destroy();
        this.element.innerHTML = '';
        this.element.classList.remove('e-heatmap');
    }
    /**
     * Applies all the pending property changes and render the component again.
     * @method destroy
     * @return {void}.
     */
    refresh() {
        super.refresh();
        this.element.classList.add('e-heatmap');
    }
    /**
     * Appending svg object to the element
     * @private
     */
    appendSvgObject() {
        if (this.enableCanvasRendering && this.allowSelection) {
            this.createMultiCellDiv(false);
        }
        else {
            this.element.appendChild(this.svgObject);
        }
    }
    renderBorder() {
        this.border = {
            width: 0
        };
        let width = 0;
        let rect = new RectOption(this.element.id + '_HeatmapBorder', this.themeStyle.background, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
        this.drawSvgCanvas.drawRectangle(rect, this.svgObject);
    }
    calculateSize() {
        let width = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        let height = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    }
    renderTitle() {
        if (this.titleSettings.text) {
            let titleStyle = this.titleSettings.textStyle;
            let anchor = titleStyle.textAlignment === 'Near' ? 'start' :
                titleStyle.textAlignment === 'Far' ? 'end' : 'middle';
            this.elementSize = measureText(this.titleCollection[0], titleStyle);
            let options = new TextOption(this.element.id + '_HeatmapTitle', new TextBasic(titlePositionX(this.availableSize.width - this.margin.left - this.margin.right, this.margin.left, this.margin.right, titleStyle), this.margin.top + ((this.elementSize.height) * 3 / 4), anchor, this.titleCollection), titleStyle, titleStyle.color || this.themeStyle.heatMapTitle);
            if (this.titleCollection.length > 1) {
                this.drawSvgCanvas.createWrapText(options, titleStyle, this.svgObject);
            }
            else {
                this.drawSvgCanvas.createText(options, this.svgObject, this.titleCollection[0]);
                if (this.titleCollection[0].indexOf('...') !== -1 && this.enableCanvasRendering) {
                    this.tooltipCollection.push(new CanvasTooltip(this.titleSettings.text, new Rect(this.margin.left, this.margin.top, this.elementSize.width, this.elementSize.height)));
                }
            }
        }
    }
    titleTooltip(event, x, y, isTouch) {
        let targetId = event.target.id;
        if ((targetId === (this.element.id + '_HeatmapTitle')) && (event.target.textContent.indexOf('...') > -1)) {
            showTooltip(this.titleSettings.text, x, y, this.element.offsetWidth, this.element.id + '_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch, this);
        }
        else {
            removeElement(this.element.id + '_Title_Tooltip');
        }
    }
    axisTooltip(event, x, y, isTouch) {
        let targetId = event.target.id;
        if ((targetId.indexOf(this.element.id + '_XAxis_Label') !== -1) ||
            (targetId.indexOf(this.element.id + '_XAxis_MultiLevel') !== -1) ||
            (targetId.indexOf(this.element.id + '_YAxis_MultiLevel') !== -1)) {
            let tooltipText = getTooltipText(this.tooltipCollection, x, y);
            if (tooltipText) {
                showTooltip(tooltipText, x, y, this.element.offsetWidth, this.element.id + '_axis_Tooltip', getElement(this.element.id + '_Secondary_Element'), this.isTouch, this);
            }
            else {
                removeElement(this.element.id + '_axis_Tooltip');
            }
        }
        else {
            removeElement(this.element.id + '_axis_Tooltip');
        }
    }
    isHeatmapRect(x, y) {
        let firstRectDetails = [];
        let lastRectDetails = [];
        let isRect;
        firstRectDetails.push(this.heatMapSeries.rectPositionCollection[0][0]);
        lastRectDetails.push(this.heatMapSeries.rectPositionCollection[this.yLength - 1][this.xLength - 1]);
        isRect = (x >= firstRectDetails[0].x && y >= firstRectDetails[0].y &&
            x <= (lastRectDetails[0].x + lastRectDetails[0].width) &&
            y <= (lastRectDetails[0].y + lastRectDetails[0].height)) ? true : false;
        return isRect;
    }
    setTheme() {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    }
    calculateBounds() {
        let margin = this.margin;
        // Title Height;
        let titleHeight = 0;
        let padding = (this.legendModule && this.legendSettings.position === 'Top'
            && this.legendVisibilityByCellType) || this.titleSettings.textStyle.size === '0px' ? 0 : 16; // title padding
        let left = margin.left;
        let width = this.availableSize.width - left - margin.right;
        if ((this.paletteSettings.colorGradientMode === 'Column' || this.paletteSettings.colorGradientMode === 'Row') &&
            this.paletteSettings.type === 'Gradient') {
            if (this.paletteSettings.palette.length === 0) {
                this.legendVisibilityByCellType = false;
            }
            else {
                for (let i = 0; i < this.paletteSettings.palette.length; i++) {
                    if (this.paletteSettings.palette[i].value !== null || '') {
                        this.legendVisibilityByCellType = true;
                    }
                    else if (this.paletteSettings.palette[i].value === null || '') {
                        this.legendVisibilityByCellType = false;
                        break;
                    }
                }
            }
        }
        if (this.titleSettings.text) {
            this.titleCollection = getTitle(this.titleSettings.text, this.titleSettings.textStyle, width);
            titleHeight = (measureText(this.titleSettings.text, this.titleSettings.textStyle).height * this.titleCollection.length) +
                padding;
        }
        let top = margin.top + titleHeight;
        this.titleRect = new Rect(margin.left, margin.top, this.availableSize.width - margin.left - margin.right, titleHeight);
        let height = this.availableSize.height - top - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        let legendTop = this.initialClipRect.y;
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendBounds(this.initialClipRect);
        }
        this.heatMapAxis.measureAxis(this.initialClipRect);
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendSize(this.initialClipRect, legendTop);
        }
        this.heatMapAxis.calculateAxisSize(this.initialClipRect);
    }
    refreshBound() {
        this.updateBubbleHelperProperty();
        this.calculateBounds();
        this.renderElements();
    }
    initAxis() {
        let axis;
        let axes = [this.xAxis, this.yAxis];
        this.axisCollections = [];
        for (let i = 0, len = axes.length; i < len; i++) {
            axis = axes[i];
            axis.orientation = (i === 0) ? 'Horizontal' : 'Vertical';
            axis.jsonCellLabel = [];
            this.axisCollections.push(axis);
        }
    }
    /**
     * Method to bind events for HeatMap
     */
    wireEvents() {
        /*! Find the Events type */
        let isIE11Pointer = Browser.isPointer;
        let start = Browser.touchStartEvent;
        let stop = Browser.touchEndEvent;
        let move = Browser.touchMoveEvent;
        let cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick, this);
        EventHandler.add(this.element, start, this.heatMapMouseMove, this);
        EventHandler.add(this.element, stop, this.heatMapMouseLeave, this);
        EventHandler.add(this.element, move, this.heatMapMouseMove, this);
        EventHandler.add(this.element, cancel, this.heatMapMouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.heatMapResize.bind(this));
        let heatmap = this;
        /**
         * Support for touch tapHold and tap for HeatMap
         */
        let touchObj = new Touch(this.element, {
            tapHold: () => {
                heatmap.isCellTapHold = true;
                heatmap.getDataCollection();
                heatmap.currentRect.allowCollection = false;
                heatmap.setCellOpacity();
                let argData = {
                    heatmap: (this.isBlazor ? null : heatmap),
                    cancel: false,
                    name: 'cellSelected',
                    data: heatmap.multiCellCollection
                };
                heatmap.trigger('cellSelected', argData);
            },
            tap: () => {
                let isCellTap = false;
                if (!heatmap.isCellTapHold) {
                    isCellTap = true;
                }
                heatmap.tooltipOnMouseMove(null, heatmap.currentRect, isCellTap);
            }
        });
        this.setStyle(this.element);
    }
    /**
     * Applying styles for heatmap element
     */
    setStyle(element) {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    }
    /**
     * Method to unbind events for HeatMap
     */
    unWireEvents() {
        /*! Find the Events type */
        let isIE11Pointer = Browser.isPointer;
        let start = Browser.touchStartEvent;
        let stop = Browser.touchEndEvent;
        let move = Browser.touchMoveEvent;
        let cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick);
        EventHandler.remove(this.element, start, this.heatMapMouseMove);
        EventHandler.remove(this.element, move, this.heatMapMouseLeave);
        EventHandler.remove(this.element, move, this.heatMapMouseMove);
        EventHandler.remove(this.element, cancel, this.heatMapMouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.heatMapResize);
    }
    /**
     * Handles the heatmap resize.
     * @return {boolean}
     * @private
     */
    heatMapResize(e) {
        this.resizing = true;
        let argData = {
            heatmap: (this.isBlazor ? null : this),
            cancel: false,
            name: 'resized',
            currentSize: new Size(0, 0),
            previousSize: new Size(this.availableSize.width, this.availableSize.height),
        };
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
            if (this.isDestroyed) {
                clearTimeout(this.resizeTimer);
                return;
            }
            this.createSvg();
            argData.currentSize = this.availableSize;
            this.trigger('resized', argData);
            this.refreshBound();
            this.appendSvgObject();
            if (this.allowSelection) {
                this.updateCellSelection();
            }
            this.trigger('loaded', (this.isBlazor ? null : { heatmap: this }));
            this.resizing = false;
        }, 500);
        return false;
    }
    /**
     * Method to bind selection after window resize for HeatMap
     */
    updateCellSelection() {
        let wSize = this.initialClipRect.width / this.axisCollections[0].axisLabelSize;
        let hSize = this.initialClipRect.height / this.axisCollections[1].axisLabelSize;
        let x = this.initialClipRect.x;
        let y = this.initialClipRect.y;
        if (!this.enableCanvasRendering) {
            if (this.multiCellCollection.length !== 0) {
                let containersRect = document.getElementById(this.element.id + '_Container_RectGroup');
                let containerText = document.getElementById(this.element.id + '_Container_TextGroup');
                for (let i = 0; i < containersRect.childNodes.length; i++) {
                    containersRect.childNodes[i].setAttribute('opacity', '0.3');
                    if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                        containerText.childNodes[i].setAttribute('opacity', '0.3');
                    }
                }
                for (let i = 0; i < this.multiCellCollection.length; i++) {
                    let collectionClass = this.multiCellCollection[i].cellElement;
                    let cellIndex = collectionClass.id.replace(this.element.id + '_HeatMapRect_', '');
                    let index = parseInt(cellIndex, 10);
                    containersRect.childNodes[index].setAttribute('opacity', '1');
                    if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                        let getText = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                        if (getText) {
                            getText.setAttribute('opacity', '1');
                        }
                        this.addSvgClass(containersRect.childNodes[index]);
                    }
                }
            }
        }
        else if (this.enableCanvasRendering) {
            let rect = this.multiCellCollection;
            let oldCanvas = document.getElementById(this.element.id + '_canvas');
            let newCanvas = document.getElementById(this.element.id + '_secondary_canvas');
            let initialRect = this.initialClipRect;
            let rectHeight = initialRect.y + initialRect.height;
            let rectWidth = initialRect.x + initialRect.width;
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                this.multiCellCollection[i].width = rect[i].width = wSize;
                this.multiCellCollection[i].height = rect[i].height = hSize;
                this.multiCellCollection[i].x = rect[i].x = x + wSize * this.multiCellCollection[i].xPosition;
                this.multiCellCollection[i].y = rect[i].y = y + hSize * this.multiCellCollection[i].yPosition;
                let rectImage = oldCanvas.getContext('2d').getImageData(rect[i].x, rect[i].y, rect[i].width, rect[i].height);
                newCanvas.getContext('2d').putImageData(rectImage, rect[i].x, rect[i].y);
                oldCanvas.style.opacity = '0.3';
            }
            let topPositions = oldCanvas.getContext('2d').getImageData(0, 0, this.availableSize.width, initialRect.y);
            newCanvas.getContext('2d').putImageData(topPositions, 0, 0);
            let bottomPositions = oldCanvas.getContext('2d').getImageData(0, rectHeight, this.availableSize.width, this.availableSize.height - rectHeight);
            newCanvas.getContext('2d').putImageData(bottomPositions, 0, initialRect.y + initialRect.height);
            let rightPosition = oldCanvas.getContext('2d').
                getImageData(rectWidth, 0, this.availableSize.width - rectWidth, this.availableSize.height);
            newCanvas.getContext('2d').putImageData(rightPosition, rectWidth, 0);
            let leftPosition = oldCanvas.getContext('2d').getImageData(0, 0, initialRect.x, this.availableSize.height);
            newCanvas.getContext('2d').putImageData(leftPosition, 0, 0);
            removeElement(this.element.id + '_selectedCells');
        }
    }
    clearSVGSelection() {
        let rect = document.getElementById(this.element.id + '_Container_RectGroup');
        let text = document.getElementById(this.element.id + '_Container_TextGroup');
        for (let i = 0; i < rect.childNodes.length; i++) {
            let elementClassName = rect.childNodes[i].getAttribute('class');
            if (elementClassName === this.element.id + '_selected') {
                this.removeSvgClass(rect.childNodes[i], elementClassName);
            }
            rect.childNodes[i].setAttribute('opacity', '1');
            if (this.cellSettings.showLabel && text.childNodes[i]) {
                text.childNodes[i].setAttribute('opacity', '1');
            }
        }
    }
    /**
     * Get the maximum length of data source for both horizontal and vertical
     * @private
     */
    calculateMaxLength() {
        let dataSource = this.completeAdaptDataSource;
        if (dataSource && dataSource.length > 0) {
            let xAxisMax = dataSource.length - 1;
            let yAxisMax = 0;
            for (let i = 0; i <= xAxisMax; i++) {
                let length = dataSource[i].length;
                yAxisMax = yAxisMax > length ? yAxisMax : length;
            }
            this.axisCollections[0].maxLength = xAxisMax;
            this.axisCollections[1].maxLength = yAxisMax - 1;
        }
        else {
            this.axisCollections[0].maxLength = 0;
            this.axisCollections[1].maxLength = 0;
        }
    }
    /**
     * To find mouse x, y for aligned heatmap element svg position
     */
    setMouseXY(pageX, pageY) {
        let rect = this.element.getBoundingClientRect();
        let svgCanvasRect;
        if (this.enableCanvasRendering) {
            svgCanvasRect = document.getElementById(this.element.id + '_canvas').getBoundingClientRect();
        }
        else {
            svgCanvasRect = document.getElementById(this.element.id + '_svg').getBoundingClientRect();
        }
        this.mouseX = (pageX - rect.left) - Math.max(svgCanvasRect.left - rect.left, 0);
        this.mouseY = (pageY - rect.top) - Math.max(svgCanvasRect.top - rect.top, 0);
    }
    heatMapMouseClick(e) {
        let pageX;
        let pageY;
        let touchArg;
        let elementRect = this.element.getBoundingClientRect();
        if (e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        }
        else {
            this.isTouch = false;
            pageY = e.clientY;
            pageX = e.clientX;
        }
        pageX -= elementRect.left;
        pageY -= elementRect.top;
        let isheatmapRect = this.isHeatmapRect(pageX, pageY);
        if (isheatmapRect) {
            let currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
            this.trigger('cellClick', {
                heatmap: (this.isBlazor ? null : this),
                value: currentRect.value,
                x: currentRect.x,
                y: currentRect.y,
                xLabel: this.heatMapSeries.hoverXAxisLabel,
                yLabel: this.heatMapSeries.hoverYAxisLabel,
                xValue: this.heatMapSeries.hoverXAxisValue,
                yValue: this.heatMapSeries.hoverYAxisValue,
                cellElement: this.enableCanvasRendering ? null : document.getElementById(currentRect.id)
            });
        }
        this.notify('click', e);
        if (this.paletteSettings.type !== 'Gradient' && this.legendModule
            && this.legendSettings.visible && this.legendVisibilityByCellType) {
            let page = this.legendModule.navigationCollections;
            if (page.length && pageX > page[0].x && pageX < page[0].x + page[0].width &&
                pageY > page[0].y && pageY < page[0].y + page[0].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, true);
            }
            else if (page.length && pageX > page[1].x && pageX < page[1].x + page[1].width &&
                pageY > page[1].y && pageY < page[1].y + page[1].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, false);
            }
            let legendRange = this.legendModule.legendRange;
            let legendTextRange = this.legendModule.legendTextRange;
            let loop = true;
            for (let i = 0; i < legendRange.length; i++) {
                if (this.legendModule && this.legendSettings.toggleVisibility &&
                    this.legendModule.currentPage === legendRange[i].currentPage) {
                    if ((loop && (pageX >= legendRange[i].x && pageX <= legendRange[i].width + legendRange[i].x) &&
                        (pageY >= legendRange[i].y && pageY <= legendRange[i].y + legendRange[i].height) ||
                        ((this.legendSettings.showLabel && this.legendSettings.labelDisplayType !== 'None' &&
                            pageX >= legendTextRange[i].x && pageX <= legendTextRange[i].width + legendTextRange[i].x) &&
                            (pageY >= legendTextRange[i].y && pageY <= legendTextRange[i].y + legendTextRange[i].height)))) {
                        this.legendModule.legendRangeSelection(i);
                        loop = false;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Handles the mouse Move.
     * @return {boolean}
     * @private
     */
    heatMapMouseMove(e) {
        let pageX;
        let pageY;
        let tooltipText;
        let touchArg;
        let elementRect = this.element.getBoundingClientRect();
        if (e.type === 'touchmove' || e.type === 'touchstart') {
            this.isTouch = true;
            touchArg = e;
            pageX = touchArg.changedTouches[0].clientX;
            pageY = touchArg.changedTouches[0].clientY;
        }
        else {
            this.isTouch = false;
            pageX = e.clientX;
            pageY = e.clientY;
        }
        pageX -= elementRect.left;
        pageY -= elementRect.top;
        this.setMouseXY(pageX, pageY);
        if (e.target && e.target.id) {
            let isheatmapRect = this.isHeatmapRect(pageX, pageY);
            if (this.legendModule) {
                if (isheatmapRect) {
                    if (this.paletteSettings.type === 'Gradient' &&
                        this.legendSettings.showGradientPointer && this.legendSettings.visible && this.legendVisibilityByCellType) {
                        this.legendModule.renderGradientPointer(e, pageX, pageY);
                    }
                }
                else {
                    this.legendModule.removeGradientPointer();
                }
                this.renderMousePointer(pageX, pageY);
            }
            let isshowTooltip;
            let currentRect;
            isshowTooltip = this.showTooltip && this.tooltipModule ? isheatmapRect : false;
            if (isheatmapRect) {
                currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
                if (e.which !== 2 && e.which !== 3) {
                    isshowTooltip = this.cellSelectionOnMouseMove(e, currentRect, pageX, pageY, isshowTooltip);
                }
            }
            this.tooltipOnMouseMove(e, currentRect, isshowTooltip, isheatmapRect);
            if (this.legendModule && this.legendSettings.visible && this.paletteSettings.type === 'Fixed' &&
                this.legendSettings.enableSmartLegend && this.legendSettings.labelDisplayType === 'None') {
                this.legendModule.createTooltip(pageX, pageY);
            }
            if (!this.enableCanvasRendering) {
                if (this.titleSettings.text && this.titleSettings.textStyle.textOverflow === 'Trim') {
                    this.titleTooltip(e, pageX, pageY, this.isTouch);
                }
                this.axisTooltip(e, pageX, pageY, this.isTouch);
                if (this.legendModule && this.legendSettings.visible && this.legendSettings.showLabel && this.legendVisibilityByCellType) {
                    this.legendModule.renderLegendLabelTooltip(e, pageX, pageY);
                }
                if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
                    this.legendModule.renderLegendTitleTooltip(e, pageX, pageY);
                }
            }
            else {
                elementRect = this.element.getBoundingClientRect();
                let tooltipRect = (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                    this.legendSettings.labelDisplayType === 'None') ? false : true;
                tooltipText = getTooltipText(this.tooltipCollection, pageX, pageY) ||
                    (this.legendModule && tooltipRect && (getTooltipText(this.legendModule.legendLabelTooltip, pageX, pageY)
                        || getTooltipText(this.legendModule.legendTitleTooltip, pageX, pageY)));
                if (tooltipText) {
                    showTooltip(tooltipText, pageX, pageY, this.element.offsetWidth, this.element.id + '_canvas_Tooltip', getElement(this.element.id + '_Secondary_Element'), this.isTouch, this);
                }
                else {
                    removeElement(this.element.id + '_canvas_Tooltip');
                }
            }
        }
        return true;
    }
    /**
     * Triggering cell selection
     */
    cellSelectionOnMouseMove(e, currentRect, pageX, pageY, isshowTooltip) {
        if ((this.cellSettings.tileType === 'Rect' && e.type === 'mousedown' || e.type === 'touchstart'
            || e.type === 'pointerdown') && this.allowSelection) {
            this.previousRect = currentRect;
            this.multiSelection = true;
            this.rectSelected = true;
            this.initialCellX = pageX;
            this.initialCellY = pageY;
            e.preventDefault();
        }
        if (this.cellSettings.tileType === 'Rect' && this.multiSelection && currentRect) {
            isshowTooltip = false;
            this.highlightSelectedCells(this.previousRect, currentRect, pageX, pageY, e);
        }
        return isshowTooltip;
    }
    /**
     * Rendering tooltip on mouse move
     */
    tooltipOnMouseMove(e, currentRect, isshowTooltip, isheatmapRect) {
        if (isshowTooltip && currentRect) {
            if (this.tempTooltipRectId !== currentRect.id) {
                if (this.showTooltip) {
                    if ((this.cellSettings.enableCellHighlighting || (this.tooltipModule && this.showTooltip))
                        && !this.enableCanvasRendering) {
                        this.heatMapSeries.highlightSvgRect(currentRect.id);
                    }
                    this.tooltipModule.renderTooltip(currentRect);
                    if (this.isTouch) {
                        if (this.tooltipTimer) {
                            window.clearTimeout(this.tooltipTimer);
                        }
                        this.tooltipTimer = setTimeout(() => {
                            this.tooltipModule.tooltipObject.fadeOut();
                            this.tooltipModule.isFadeout = true;
                        }, 1500);
                        if (e) {
                            if (e.type === 'touchmove') {
                                e.preventDefault();
                            }
                        }
                    }
                }
                this.tempTooltipRectId = currentRect.id;
            }
        }
        else {
            if (e !== null) {
                if (!isheatmapRect) {
                    if ((this.cellSettings.enableCellHighlighting || this.showTooltip) && !this.enableCanvasRendering) {
                        this.heatMapSeries.highlightSvgRect(e.target.id);
                    }
                    if (this.tooltipModule && this.showTooltip) {
                        this.tooltipModule.showHideTooltip(false, true);
                    }
                }
            }
            this.tempTooltipRectId = '';
        }
    }
    /**
     * To select the multiple cells on mouse move action
     */
    highlightSelectedCells(previousRect, currentRect, pageX, pageY, e) {
        let pXIndex = previousRect.xIndex;
        let pYIndex = previousRect.yIndex;
        let cXIndex = currentRect.xIndex;
        let cYIndex = currentRect.yIndex;
        this.currentRect = currentRect;
        this.selectedCellsRect = new Rect(0, 0, 0, 0);
        this.selectedCellsRect.x = previousRect.x > currentRect.x ? currentRect.x : previousRect.x;
        this.selectedCellsRect.y = previousRect.y > currentRect.y ? currentRect.y : previousRect.y;
        this.selectedCellsRect.width = ((previousRect.x > currentRect.x ? (pXIndex - cXIndex) :
            (cXIndex - pXIndex)) + 1) * currentRect.width;
        this.selectedCellsRect.height = ((previousRect.y > currentRect.y ? (pYIndex - cYIndex) :
            (cYIndex - pYIndex)) + 1) * currentRect.height;
        if (e.type === 'touchstart') {
            this.isCellTapHold = true;
        }
        else {
            this.isCellTapHold = false;
        }
        e.preventDefault();
        if (e.ctrlKey === false && e.type !== 'touchstart' && e.type !== 'touchmove') {
            this.removeSelectedCellsBorder();
        }
        let x = this.initialCellX > pageX ? pageX : this.initialCellX;
        let y = this.initialCellY > pageY ? pageY : this.initialCellY;
        let parentDiv = document.getElementById(this.element.id + '_CellSelection_Container');
        let svgObject = this.renderer.createSvg({
            id: this.element.id + '_CellSelection_Container_svg',
            width: this.initialClipRect.width,
            height: this.initialClipRect.height,
        });
        parentDiv.appendChild(svgObject);
        let parent = document.getElementById(this.element.id + '_CellSelection_Container_svg');
        let rect = new Rect(x - this.initialClipRect.x, y - this.initialClipRect.y, Math.abs(pageX - this.initialCellX), Math.abs(pageY - this.initialCellY));
        let rectItems = new RectOption(this.element.id + '_selectedCells', '#87ceeb', { color: 'transparent', width: 1 }, 1, rect, '#0000ff');
        parent.appendChild(this.renderer.drawRectangle(rectItems));
        document.getElementById(this.element.id + '_selectedCells').style.opacity = '0.5';
    }
    /**
     * Method to get selected cell data collection for HeatMap
     */
    getDataCollection() {
        let pXIndex = this.previousRect.xIndex;
        let pYIndex = this.previousRect.yIndex;
        let cXIndex = this.currentRect.xIndex;
        let cYIndex = this.currentRect.yIndex;
        let minX = cXIndex > pXIndex ? pXIndex : cXIndex;
        let maxX = cXIndex > pXIndex ? cXIndex : pXIndex;
        let minY = cYIndex > pYIndex ? pYIndex : cYIndex;
        let maxY = cYIndex > pYIndex ? cYIndex : pYIndex;
        let tempX = minX;
        let tempY = minY;
        let cellX = this.previousRect.x;
        let cellY = this.previousRect.y;
        this.getCellCollection(this.currentRect, this.previousRect, true, tempX, tempY, maxX, maxY, minX, cellX, cellY);
        tempX = minX;
        tempY = minY;
        cellX = this.previousRect.x;
        cellY = this.previousRect.y;
        this.checkSelectedCells();
        this.getCellCollection(this.currentRect, this.previousRect, false, tempX, tempY, maxX, maxY, minX, cellX, cellY);
        this.selectedMultiCellCollection = [];
        this.canvasSelectedCells = new Rect(0, 0, 0, 0);
        this.selectedCellCount = 0;
    }
    /**
     * To get the selected datas.
     */
    getCellCollection(currentRect, previousRect, singleCellData, tempX, tempY, maxX, maxY, minX, cellX, cellY) {
        let xIndex = Math.abs((currentRect.xIndex === previousRect.xIndex ?
            0 : currentRect.xIndex - previousRect.xIndex)) + 1;
        let yIndex = Math.abs((currentRect.yIndex === previousRect.yIndex ?
            0 : currentRect.yIndex - previousRect.yIndex)) + 1;
        for (let i = 0; i < (xIndex * yIndex); i++) {
            if (singleCellData) {
                this.getSelectedCellData(cellX, cellY, true);
            }
            else {
                this.getSelectedCellData(cellX, cellY, false);
            }
            if (tempX < maxX) {
                cellX += currentRect.xIndex > previousRect.xIndex ? currentRect.width : -currentRect.width;
                tempX++;
            }
            else if (tempY < maxY) {
                cellY += currentRect.yIndex > previousRect.yIndex ? currentRect.height : -currentRect.height;
                cellX = previousRect.x;
                tempX = minX;
            }
        }
    }
    /**
     * To remove the selection on mouse click without ctrl key.
     */
    removeSelectedCellsBorder() {
        if (!this.enableCanvasRendering) {
            let containerRect = document.getElementById(this.element.id + '_Container_RectGroup');
            let containerText = document.getElementById(this.element.id + '_Container_TextGroup');
            for (let i = 0; i < containerRect.childNodes.length; i++) {
                let elementClassName = containerRect.childNodes[i].getAttribute('class');
                containerRect.childNodes[i].setAttribute('opacity', '0.3');
                if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                    containerText.childNodes[i].setAttribute('opacity', '0.3');
                    this.removeSvgClass(containerRect.childNodes[i], elementClassName);
                }
            }
        }
        else {
            let ctx = this.secondaryCanvasRenderer.ctx;
            for (let i = 0; i < this.previousSelectedCellsRect.length; i++) {
                let rect = this.previousSelectedCellsRect[i];
                ctx.save();
                ctx.clearRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
                ctx.restore();
            }
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                let rects = this.multiCellCollection[i];
                if (this.multiCellCollection.length > 0) {
                    ctx.save();
                    ctx.clearRect(rects.x - 1, rects.y - 1, rects.width + 2, rects.height + 2);
                }
            }
        }
        this.multiCellCollection = [];
    }
    /**
     * To highlight the selected multiple cells on mouse move action in canvas mode.
     */
    highlightSelectedAreaInCanvas(rect) {
        if (rect.x) {
            let oldCanvas = document.getElementById(this.element.id + '_canvas');
            let newCanvas = document.getElementById(this.element.id + '_secondary_canvas');
            let initialRect = this.initialClipRect;
            let rectImage = oldCanvas.getContext('2d').getImageData(rect.x, rect.y, rect.width, rect.height);
            newCanvas.getContext('2d').putImageData(rectImage, rect.x, rect.y);
            oldCanvas.style.opacity = '0.3';
            let topPosition = oldCanvas.getContext('2d').getImageData(0, 0, this.availableSize.width, initialRect.y);
            newCanvas.getContext('2d').putImageData(topPosition, 0, 0);
            let bottomPosition = oldCanvas.getContext('2d').getImageData(0, initialRect.y + initialRect.height, this.availableSize.width, this.availableSize.height - (initialRect.y + initialRect.height));
            newCanvas.getContext('2d').putImageData(bottomPosition, 0, initialRect.y + initialRect.height);
            let rightPosition = oldCanvas.getContext('2d').getImageData(initialRect.x + initialRect.width, 0, this.availableSize.width - (initialRect.x + initialRect.width), this.availableSize.height);
            newCanvas.getContext('2d').putImageData(rightPosition, initialRect.x + initialRect.width, 0);
            let leftPosition = oldCanvas.getContext('2d').getImageData(0, 0, initialRect.x, this.availableSize.height);
            newCanvas.getContext('2d').putImageData(leftPosition, 0, 0);
        }
    }
    /**
     * To get the collection of selected cells.
     */
    getSelectedCellData(cellX, cellY, cellCollection) {
        let xAxis = this.axisCollections[0];
        let yAxis = this.axisCollections[1];
        let xLabels = xAxis.tooltipLabels;
        let yLabels = yAxis.tooltipLabels.slice().reverse();
        let rectPosition = this.heatMapSeries.getCurrentRect(cellX + 1, cellY + 1);
        let currentRect = document.getElementById(rectPosition.id);
        let cellDetails = new SelectedCellDetails(null, '', '', 0, 0, null, 0, 0, 0, 0, 0, 0);
        cellDetails.value = rectPosition.value;
        cellDetails.xLabel = xLabels[rectPosition.xIndex].toString();
        cellDetails.yLabel = yLabels[rectPosition.yIndex].toString();
        cellDetails.xValue = xAxis.labelValue[rectPosition.xIndex];
        cellDetails.yValue = yAxis.labelValue.slice().reverse()[rectPosition.yIndex];
        cellDetails.cellElement = this.enableCanvasRendering ? null : currentRect;
        cellDetails.xPosition = rectPosition.xIndex;
        cellDetails.yPosition = rectPosition.yIndex;
        cellDetails.width = this.currentRect.width;
        cellDetails.height = this.currentRect.height;
        cellDetails.x = this.currentRect.x;
        cellDetails.y = this.currentRect.y;
        this.currentRect.allowCollection = true;
        this.addSvgClass(currentRect);
        if (cellCollection) {
            this.selectedMultiCellCollection.push(cellDetails);
            this.currentRect.allowCollection = false;
        }
        else {
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                if (this.multiCellCollection[i].xPosition === cellDetails.xPosition &&
                    this.multiCellCollection[i].yPosition === cellDetails.yPosition) {
                    this.currentRect.allowCollection = false;
                    if (this.selectedCellCount === this.selectedMultiCellCollection.length) {
                        this.currentRect.allowCollection = false;
                        if (!this.enableCanvasRendering) {
                            for (let j = 0; j < this.selectedMultiCellCollection.length; j++) {
                                let rectElement = this.selectedMultiCellCollection[j].cellElement;
                                if (rectElement) {
                                    let index = rectElement.id.replace(this.element.id + '_HeatMapRect_', '');
                                    let containerText = document.getElementById(this.element.id + '_Container_TextGroup');
                                    let elementClassName = rectElement.getAttribute('class');
                                    rectElement.setAttribute('opacity', '0.3');
                                    let getText = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                                    if (getText) {
                                        getText.setAttribute('opacity', '0.3');
                                    }
                                    this.removeSvgClass(rectElement, elementClassName);
                                }
                            }
                        }
                        else {
                            let ctx = this.secondaryCanvasRenderer.ctx;
                            let rect = this.canvasSelectedCells;
                            ctx.save();
                            ctx.clearRect(rect.x - 1, rect.y - 1, rect.width + 2, rect.height + 2);
                            ctx.restore();
                            this.selectedCellsRect = new Rect(0, 0, 0, 0);
                        }
                        this.multiCellCollection.splice(i, 1);
                    }
                }
            }
        }
        if (rectPosition.visible && !isNullOrUndefined(rectPosition.value) && this.currentRect.allowCollection === true) {
            this.multiCellCollection.push(cellDetails);
        }
    }
    /**
     * To add class for selected cells
     * @private
     */
    addSvgClass(element) {
        if (!this.enableCanvasRendering) {
            let className = this.element.id + '_selected';
            element.setAttribute('class', className);
        }
    }
    /**
     * To remove class for unselected cells
     * @private
     */
    removeSvgClass(rectElement, className) {
        if (className) {
            rectElement.setAttribute('class', className.replace(className, ''));
        }
    }
    /**
     * To clear the multi cell selection
     */
    clearSelection() {
        if (!this.enableCanvasRendering && this.allowSelection) {
            this.clearSVGSelection();
        }
        if (this.enableCanvasRendering) {
            let ctx = this.secondaryCanvasRenderer.ctx;
            for (let i = 0; i < this.previousSelectedCellsRect.length; i++) {
                ctx.save();
                ctx.clearRect(this.previousSelectedCellsRect[i].x - 1, this.previousSelectedCellsRect[i].y - 1, this.previousSelectedCellsRect[i].width + 2, this.previousSelectedCellsRect[i].height + 2);
                ctx.restore();
            }
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                let rects = this.multiCellCollection[i];
                if (this.multiCellCollection.length > 0) {
                    ctx.save();
                    ctx.clearRect(rects.x - 1, rects.y - 1, rects.width + 2, rects.height + 2);
                }
            }
            let canvas = document.getElementById(this.element.id + '_canvas');
            canvas.style.opacity = '1';
        }
        this.tempMultiCellCollection = [];
        this.multiCellCollection = [];
        this.rectSelected = false;
    }
    renderMousePointer(pageX, pageY) {
        let legendRange = this.legendModule.legendRange;
        let legendTextRange = this.legendModule.legendTextRange;
        let loop = true;
        for (let i = 0; i < legendRange.length; i++) {
            if (this.legendSettings.toggleVisibility && this.legendModule.currentPage === legendRange[i].currentPage) {
                if ((loop && (pageX >= legendRange[i].x && pageX <= legendRange[i].width + legendRange[i].x) &&
                    (pageY >= legendRange[i].y && pageY <= legendRange[i].y + legendRange[i].height) ||
                    ((this.legendSettings.showLabel && this.legendSettings.labelDisplayType !== 'None' &&
                        pageX >= legendTextRange[i].x && pageX <= legendTextRange[i].width + legendTextRange[i].x) &&
                        (pageY >= legendTextRange[i].y && pageY <= legendTextRange[i].y + legendTextRange[i].height)))) {
                    if (this.enableCanvasRendering) {
                        document.getElementById(this.element.id + '_canvas').style.cursor = 'Pointer';
                    }
                    else {
                        document.getElementById(this.element.id + '_svg').style.cursor = 'Pointer';
                    }
                    loop = false;
                }
                else if (loop) {
                    if (this.enableCanvasRendering) {
                        document.getElementById(this.element.id + '_canvas').style.cursor = '';
                    }
                    else {
                        document.getElementById(this.element.id + '_svg').style.cursor = '';
                    }
                }
            }
        }
    }
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    heatMapMouseLeave(e) {
        if (e.target && e.target.id &&
            (this.cellSettings.enableCellHighlighting || (this.tooltipModule && this.showTooltip))
            && !this.enableCanvasRendering) {
            this.heatMapSeries.highlightSvgRect(this.tempTooltipRectId);
        }
        if (this.allowSelection && this.multiSelection) {
            this.multiSelection = false;
            if (e.type === 'mouseup' || e.type === 'touchend' || e.type === 'pointerup') {
                if (e.which !== 2 && e.which !== 3) {
                    if (this.isCellTapHold === false) {
                        this.getDataCollection();
                        this.currentRect.allowCollection = false;
                        this.setCellOpacity();
                        let argData = {
                            heatmap: (this.isBlazor ? null : this),
                            cancel: false,
                            name: 'cellSelected',
                            data: this.multiCellCollection
                        };
                        this.trigger('cellSelected', argData);
                    }
                    else {
                        this.isCellTapHold = false;
                    }
                }
            }
            else if (e.type === 'mouseleave' && (this.element.id + '_selectedCells')) {
                removeElement(this.element.id + '_selectedCells');
            }
        }
        if (this.tooltipModule && this.showTooltip && e.type === 'mouseleave') {
            this.tooltipModule.showHideTooltip(false);
        }
        this.tempTooltipRectId = '';
        if (this.legendModule && this.legendSettings.visible && this.legendModule.tooltipObject &&
            this.legendModule.tooltipObject.element) {
            let tooltipElement = this.legendModule.tooltipObject.element.firstChild;
            if (e.type === 'mouseleave') {
                tooltipElement.setAttribute('opacity', '0');
            }
            else {
                if (this.legendTooltipTimer) {
                    window.clearTimeout(this.legendTooltipTimer);
                }
                this.legendTooltipTimer = setTimeout(() => {
                    tooltipElement.setAttribute('opacity', '0');
                }, 1500);
            }
        }
        if (this.paletteSettings.type === 'Gradient' && this.legendModule && this.legendSettings.showGradientPointer &&
            this.legendSettings.visible && this.legendVisibilityByCellType) {
            if (e.type === 'mouseleave') {
                this.legendModule.removeGradientPointer();
            }
            else {
                if (this.gradientTimer) {
                    window.clearTimeout(this.gradientTimer);
                }
                this.gradientTimer = setTimeout(() => { this.legendModule.removeGradientPointer(); }, 1500);
            }
        }
        if (this.enableCanvasRendering) {
            let main = document.getElementById(this.element.id + '_hoverRect_canvas');
            if (main) {
                main.style.visibility = 'hidden';
                this.tempRectHoverClass = '';
            }
        }
        if (this.titleSettings.text && this.titleCollection[0].indexOf('...') !== -1) {
            if (!this.enableCanvasRendering) {
                removeElement(this.element.id + '_Title_Tooltip');
            }
            else {
                removeElement(this.element.id + '_canvas_Tooltip');
            }
        }
        return true;
    }
    /**
     * Method to Check for deselection of cell.
     */
    checkSelectedCells() {
        if (!this.enableCanvasRendering) {
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                for (let j = 0; j < this.selectedMultiCellCollection.length; j++) {
                    if (this.selectedMultiCellCollection[j].cellElement.getAttribute('id')
                        === this.multiCellCollection[i].cellElement.getAttribute('id')) {
                        this.selectedCellCount++;
                    }
                }
            }
        }
        else {
            this.canvasSelectedCells = new Rect(0, 0, 0, 0);
            this.canvasSelectedCells.x = this.selectedCellsRect.x;
            this.canvasSelectedCells.y = this.selectedCellsRect.y;
            this.canvasSelectedCells.width = this.selectedCellsRect.width;
            this.canvasSelectedCells.height = this.selectedCellsRect.height;
            for (let i = 0; i < this.multiCellCollection.length; i++) {
                for (let j = 0; j < this.selectedMultiCellCollection.length; j++) {
                    if (this.selectedMultiCellCollection[j].xPosition === this.multiCellCollection[i].xPosition &&
                        this.selectedMultiCellCollection[j].yPosition === this.multiCellCollection[i].yPosition) {
                        this.selectedCellCount++;
                    }
                }
            }
            if (this.rectSelected && this.paletteSettings.type === 'Gradient') {
                this.legendModule.removeGradientPointer();
            }
        }
    }
    /**
     * Method to remove opacity for text of selected cell for HeatMap
     */
    removeOpacity(containersRect, containerText) {
        for (let i = 0; i < containersRect.childNodes.length; i++) {
            containersRect.childNodes[i].setAttribute('opacity', '0.3');
            if (this.cellSettings.showLabel && containerText.childNodes[i]) {
                containerText.childNodes[i].setAttribute('opacity', '0.3');
            }
        }
    }
    /**
     * Method to set opacity for selected cell for HeatMap
     */
    setCellOpacity() {
        if (!this.enableCanvasRendering) {
            if (this.multiCellCollection.length !== 0) {
                this.tempMultiCellCollection.push(this.multiCellCollection);
                let containersRect = document.getElementById(this.element.id + '_Container_RectGroup');
                let containerText = document.getElementById(this.element.id + '_Container_TextGroup');
                this.removeOpacity(containersRect, containerText);
                for (let i = 0; i < this.multiCellCollection.length; i++) {
                    let collectionClasss = this.multiCellCollection[i].cellElement;
                    let index = parseInt(collectionClasss.id.replace(this.element.id + '_HeatMapRect_', ''), 10);
                    containersRect.childNodes[index].setAttribute('opacity', '1');
                    if (this.cellSettings.showLabel) {
                        let getText = document.getElementById(this.element.id + '_HeatMapRectLabels_' + index);
                        if (getText) {
                            getText.setAttribute('opacity', '1');
                        }
                    }
                }
            }
        }
        else {
            this.previousSelectedCellsRect.push(this.selectedCellsRect);
            this.highlightSelectedAreaInCanvas(this.selectedCellsRect);
        }
        removeElement(this.element.id + '_selectedCells');
    }
    /**
     * To create div container for rendering two layers of canvas.
     * @return {void}
     * @private
     */
    createMultiCellDiv(onLoad) {
        if (onLoad) {
            let divElement = this.createElement('div', {
                id: this.element.id + '_Multi_CellSelection_Canvas',
                styles: 'position:relative'
            });
            this.element.appendChild(divElement);
            divElement.appendChild(this.svgObject);
            this.svgObject.style.position = 'absolute';
            this.svgObject.style.left = '0px';
            this.svgObject.style.top = '0px';
            this.svgObject.style.zIndex = '0';
        }
        else {
            let element = document.getElementById(this.element.id + '_Multi_CellSelection_Canvas');
            let secondaryCanvas = this.secondaryCanvasRenderer.createCanvas({
                width: this.availableSize.width,
                height: this.availableSize.height, x: 0, y: 0,
                style: 'position: absolute; z-index: 1'
            });
            element.appendChild(secondaryCanvas);
        }
    }
};
__decorate([
    Property(null)
], HeatMap.prototype, "width", void 0);
__decorate([
    Property(null)
], HeatMap.prototype, "height", void 0);
__decorate([
    Property(true)
], HeatMap.prototype, "showTooltip", void 0);
__decorate([
    Event()
], HeatMap.prototype, "tooltipRender", void 0);
__decorate([
    Event()
], HeatMap.prototype, "resized", void 0);
__decorate([
    Event()
], HeatMap.prototype, "loaded", void 0);
__decorate([
    Event()
], HeatMap.prototype, "cellRender", void 0);
__decorate([
    Event()
], HeatMap.prototype, "cellSelected", void 0);
__decorate([
    Property('SVG')
], HeatMap.prototype, "renderingMode", void 0);
__decorate([
    Property(null)
], HeatMap.prototype, "dataSource", void 0);
__decorate([
    Complex({}, Data)
], HeatMap.prototype, "dataSourceSettings", void 0);
__decorate([
    Property('Material')
], HeatMap.prototype, "theme", void 0);
__decorate([
    Property(false)
], HeatMap.prototype, "allowSelection", void 0);
__decorate([
    Complex({}, Margin)
], HeatMap.prototype, "margin", void 0);
__decorate([
    Complex({ text: '', textStyle: Theme.heatMapTitleFont }, Title)
], HeatMap.prototype, "titleSettings", void 0);
__decorate([
    Complex({}, Axis)
], HeatMap.prototype, "xAxis", void 0);
__decorate([
    Complex({}, LegendSettings)
], HeatMap.prototype, "legendSettings", void 0);
__decorate([
    Complex({}, PaletteSettings)
], HeatMap.prototype, "paletteSettings", void 0);
__decorate([
    Complex({}, TooltipSettings)
], HeatMap.prototype, "tooltipSettings", void 0);
__decorate([
    Complex({}, Axis)
], HeatMap.prototype, "yAxis", void 0);
__decorate([
    Complex({}, CellSettings)
], HeatMap.prototype, "cellSettings", void 0);
__decorate([
    Event()
], HeatMap.prototype, "created", void 0);
__decorate([
    Event()
], HeatMap.prototype, "load", void 0);
__decorate([
    Event()
], HeatMap.prototype, "cellClick", void 0);
__decorate([
    Event()
], HeatMap.prototype, "legendRender", void 0);
HeatMap = __decorate([
    NotifyPropertyChanges
], HeatMap);

/**
 * Heatmap component exported items
 */

/**
 * HeatMap index file
 */

export { HeatMap, Axis, AxisHelper, Data, AdaptiveMinMax, Adaptor, TwoDimensional, LegendSettings, Legend, Font, Margin, Border, TooltipBorder, BubbleData, Title, FillColor, PaletteCollection, AxisLabelBorder, BubbleSize, MultiLevelCategories, MultiLevelLabels, ColorCollection, BubbleTooltipData, LegendColorCollection, CellSettings, Series, PaletteSettings, RgbColor, CellColor, TooltipSettings, Tooltip$1 as Tooltip, stringToNumber, measureText, TextElement, titlePositionX, Size, CustomizeOption, PathOption, CurrentRect, SelectedCellDetails, RectOption, CircleOption, Rect, TextOption, TextBasic, Line, LineOption, PathAttributes, Path, sum, titlePositionY, rotateTextSize, DrawSvgCanvas, getTitle, textWrap, textTrim, textNone, Gradient, GradientColor, showTooltip, removeElement, getElement, increaseDateTimeInterval, CanvasTooltip, getTooltipText, PaletterColor, GradientPointer, CurrentLegendRect, LegendRange, ToggleVisibility, colorNameToHex, convertToHexCode, componentToHex, convertHexToColor, formatValue, MultiLevelPosition };
//# sourceMappingURL=ej2-heatmap.es2015.js.map
