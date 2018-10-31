import { Browser, CanvasRenderer, ChildProperty, Collection, Complex, Component, Event, EventHandler, Internationalization, NotifyPropertyChanges, Property, SvgRenderer, createElement, extend, isNullOrUndefined, merge, remove } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Tooltip } from '@syncfusion/ej2-svg-base';

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the fonts in heat map.
 */
var Font = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Font;
}(ChildProperty));
/**
 * Configures the heat map margins.
 */
var Margin = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Margin;
}(ChildProperty));
/**
 * Configures the borders in the heat map.
 */
var Border = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return Border;
}(ChildProperty));
/**
 * Configures the mapping name for size and color in SizeAndColor type.
 */
var BubbleData = /** @__PURE__ @class */ (function (_super) {
    __extends$3(BubbleData, _super);
    function BubbleData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property(null)
    ], BubbleData.prototype, "size", void 0);
    __decorate$2([
        Property(null)
    ], BubbleData.prototype, "color", void 0);
    return BubbleData;
}(ChildProperty));
/**
 * class used to maintain Title styles.
 */
var Title = /** @__PURE__ @class */ (function (_super) {
    __extends$3(Title, _super);
    function Title() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        Property('')
    ], Title.prototype, "text", void 0);
    __decorate$2([
        Complex({}, Font)
    ], Title.prototype, "textStyle", void 0);
    return Title;
}(ChildProperty));
/**
 * class used to maintain palette information.
 */
var PaletteCollection = /** @__PURE__ @class */ (function (_super) {
    __extends$3(PaletteCollection, _super);
    function PaletteCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return PaletteCollection;
}(ChildProperty));
/**
 * Internal class used to maintain colorcollection.
 */
var ColorCollection = /** @__PURE__ @class */ (function () {
    function ColorCollection(value, color, label) {
        this.value = value;
        this.color = color;
        this.label = label;
    }
    return ColorCollection;
}());
/**
 * class used to maintain color and value collection.
 */
var BubbleTooltipData = /** @__PURE__ @class */ (function () {
    function BubbleTooltipData(mappingName, bubbleData, valueType) {
        this.mappingName = mappingName;
        this.bubbleData = bubbleData;
        this.valueType = valueType;
    }
    return BubbleTooltipData;
}());
/**
 * Internal class used to maintain legend colorcollection.
 */
var LegendColorCollection = /** @__PURE__ @class */ (function () {
    function LegendColorCollection(value, color, label, isHidden) {
        this.value = value;
        this.color = color;
        this.label = label;
        this.isHidden = isHidden;
    }
    return LegendColorCollection;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the color property in Heatmap.
 */
var PaletteSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$2(PaletteSettings, _super);
    function PaletteSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return PaletteSettings;
}(ChildProperty));
/**
 * Helper class for colormapping
 */
var RgbColor = /** @__PURE__ @class */ (function () {
    function RgbColor(r, g, b) {
        this.R = r;
        this.G = g;
        this.B = b;
    }
    return RgbColor;
}());
var CellColor = /** @__PURE__ @class */ (function () {
    function CellColor(heatMap) {
        this.heatMap = heatMap;
    }
    /**
     * To convert hexa color to RGB.
     * @return {RGB}
     * @private
     */
    CellColor.prototype.convertToRGB = function (value, colorMapping) {
        var previousOffset = colorMapping[0].value;
        var nextOffset = 0;
        for (var i = 1; i < colorMapping.length; i++) {
            var offset = Number(colorMapping[i].value);
            if (value <= offset) {
                nextOffset = offset;
                break;
            }
            else {
                nextOffset = offset;
                previousOffset = offset;
            }
        }
        var percent = 0;
        var full = nextOffset - previousOffset;
        percent = (value - previousOffset) / full;
        var previousColor = this.getEqualColor(colorMapping, previousOffset);
        var nextColor = this.getEqualColor(colorMapping, nextOffset);
        return this.getPercentageColor(percent, previousColor, nextColor);
    };
    /**
     * To convert RGB to HEX.
     * @return {string}
     * @private
     */
    CellColor.prototype.rgbToHex = function (r, g, b) {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    };
    /**
     * To convert Component to HEX.
     * @return {string}
     * @private
     */
    CellColor.prototype.componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    /**
     * To get similar color.
     * @return {string}
     * @private
     */
    CellColor.prototype.getEqualColor = function (list, offset) {
        for (var i = 0; i < list.length; i++) {
            if (Number(list[i].value) === offset) {
                var color = list[i].color;
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
    };
    /**
     * To convert RGB to HEX.
     * @return {string}
     * @private
     */
    CellColor.prototype.convertToHex = function (color) {
        var itemColor = color.substr(3);
        itemColor = itemColor.split('(')[1].split(')')[0];
        var colorSplit = itemColor.split(',');
        itemColor = this.rgbToHex(parseInt(colorSplit[0], 10), parseInt(colorSplit[1], 10), parseInt(colorSplit[2], 10));
        return itemColor;
    };
    /**
     * To get RGB for percentage value.
     * @return {RGB}
     * @private
     */
    CellColor.prototype.getPercentageColor = function (percent, previous, next) {
        var nextColor = next.split('#')[1];
        var prevColor = previous.split('#')[1];
        var r = this.getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
        var g = this.getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
        var b = this.getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
        return new RgbColor(r, g, b);
    };
    /**
     * To convert numbet to percentage.
     * @return {RGB}
     * @private
     */
    CellColor.prototype.getPercentage = function (percent, previous, next) {
        var full = next - previous;
        return Math.round((previous + (full * percent)));
    };
    /**
     * To get complete color Collection.
     * @private
     */
    CellColor.prototype.getColorCollection = function () {
        var heatMap = this.heatMap;
        heatMap.colorCollection = [];
        heatMap.legendColorCollection = [];
        var range;
        var minValue = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        var maxValue = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        heatMap.emptyPointColor = heatMap.paletteSettings.emptyPointColor ? heatMap.paletteSettings.emptyPointColor :
            heatMap.themeStyle.emptyCellColor;
        var tempcolorMapping = this.orderbyOffset(heatMap.paletteSettings.palette && heatMap.paletteSettings.palette.length > 1 ?
            heatMap.paletteSettings.palette : heatMap.themeStyle.palette);
        if (!tempcolorMapping.isCompact) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length - 1);
            }
            else {
                range = (maxValue - minValue) / (tempcolorMapping.offsets.length);
            }
            if (tempcolorMapping.offsets.length >= 2) {
                for (var index = 0; index < tempcolorMapping.offsets.length; index++) {
                    heatMap.colorCollection.push(new ColorCollection(Math.round(((minValue) + (index * range)) * 100) / 100, tempcolorMapping.offsets[index].color, tempcolorMapping.offsets[index].label));
                    heatMap.legendColorCollection.push(new LegendColorCollection(Math.round(((minValue) + (index * range)) * 100) / 100, tempcolorMapping.offsets[index].color, tempcolorMapping.offsets[index].label, false));
                }
            }
        }
        else {
            heatMap.colorCollection = tempcolorMapping.offsets;
            heatMap.legendColorCollection = extend([], tempcolorMapping.offsets, null, true);
        }
        this.updateLegendColorCollection(minValue, maxValue);
    };
    /**
     * To update legend color Collection.
     * @private
     */
    CellColor.prototype.updateLegendColorCollection = function (minValue, maxValue) {
        if (minValue < this.heatMap.legendColorCollection[0].value) {
            this.heatMap.legendColorCollection.unshift(new LegendColorCollection(minValue, this.heatMap.legendColorCollection[0].color, this.heatMap.legendColorCollection[0].label, true));
        }
        if (maxValue > this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].value) {
            this.heatMap.legendColorCollection.push(new LegendColorCollection(maxValue, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].color, this.heatMap.legendColorCollection[this.heatMap.legendColorCollection.length - 1].label, true));
        }
    };
    /**
     * To get ordered palette color collection.
     * @private
     */
    CellColor.prototype.orderbyOffset = function (offsets) {
        var returnCollection = new PaletterColor();
        var key = 'value';
        returnCollection.isCompact = true;
        // tslint:disable-next-line:no-any 
        returnCollection.offsets = offsets.sort(function (a, b) {
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
    };
    /**
     * To get color depends to value.
     * @private
     */
    CellColor.prototype.getColorByValue = function (text) {
        var color = '';
        var rbg;
        var compareValue = 0;
        if (text.toString() !== '') {
            if (this.heatMap.cellSettings.tileType === 'Bubble' &&
                (this.heatMap.cellSettings.bubbleType === 'Size' || this.heatMap.cellSettings.bubbleType === 'Sector')) {
                color = this.heatMap.colorCollection[0].color;
            }
            else if (this.heatMap.paletteSettings.type === 'Fixed') {
                for (var y = 0; y < this.heatMap.colorCollection.length; y++) {
                    compareValue = this.heatMap.colorCollection[y + 1] ? this.heatMap.colorCollection[y + 1].value :
                        this.heatMap.colorCollection[y].value;
                    if (text < compareValue || (text >= compareValue && y === this.heatMap.colorCollection.length - 1)) {
                        color = this.heatMap.colorCollection[y].color;
                        break;
                    }
                }
            }
            else {
                if (text < this.heatMap.colorCollection[0].value) {
                    color = this.heatMap.colorCollection[0].color;
                }
                else if (text > this.heatMap.colorCollection[this.heatMap.colorCollection.length - 1].value) {
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
    };
    return CellColor;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var htmlObject = document.getElementById('heatmapmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'heatmapmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
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
var TextElement = /** @__PURE__ @class */ (function () {
    function TextElement(fontModel, fontColor) {
        this['font-size'] = fontModel.size;
        this['font-style'] = fontModel.fontStyle;
        this['font-family'] = fontModel.fontFamily;
        this['font-weight'] = fontModel.fontWeight;
        this.fill = fontColor ? fontColor : '';
    }
    return TextElement;
}());
function titlePositionX(width, leftPadding, rightPadding, titleStyle) {
    var positionX;
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
var Size = /** @__PURE__ @class */ (function () {
    function Size(width, height) {
        this.width = width;
        this.height = height;
    }
    return Size;
}());
/** @private */
var CustomizeOption = /** @__PURE__ @class */ (function () {
    function CustomizeOption(id) {
        this.id = id;
    }
    return CustomizeOption;
}());
/** @private */
var PathOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(PathOption, _super);
    function PathOption(id, fill, width, color, opacity, dashArray, d) {
        var _this = _super.call(this, id) || this;
        _this.opacity = opacity;
        _this.fill = fill;
        _this.stroke = color ? color : '';
        _this['stroke-width'] = parseFloat(width.toString());
        _this['stroke-dasharray'] = dashArray;
        _this.d = d;
        return _this;
    }
    return PathOption;
}(CustomizeOption));
/**
 * Class to define currentRect private property.
 * @private
 */
var CurrentRect = /** @__PURE__ @class */ (function () {
    function CurrentRect(x, y, width, height, value, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.id = id;
    }
    return CurrentRect;
}());
/**
 * Class to define property to draw rectangle.
 * @private
 */
var RectOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, borderColor, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, border.width, borderColor, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height > 0 ? rect.height : 0;
        _this.width = rect.width > 0 ? rect.width : 0;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        return _this;
    }
    return RectOption;
}(PathOption));
/**
 * Class to define property to draw circle.
 * @private
 */
var CircleOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, borderColor, cx, cy, r) {
        var _this = _super.call(this, id, fill, border.width, borderColor, opacity) || this;
        _this.cx = cx ? cx : 0;
        _this.cy = cy ? cy : 0;
        _this.r = r ? r : 0;
        return _this;
    }
    return CircleOption;
}(PathOption));
/**
 * Helper Class to define property to draw rectangle.
 * @private
 */
var Rect = /** @__PURE__ @class */ (function () {
    function Rect(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    return Rect;
}());
/**
 * Class to define property to draw text.
 * @private
 */
var TextOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(TextOption, _super);
    function TextOption(id, basic, element, fontColor) {
        var _this = _super.call(this, element, fontColor) || this;
        _this.transform = '';
        _this['dominant-baseline'] = 'auto';
        _this.labelRotation = 0;
        _this.baseline = 'auto';
        _this.id = id;
        _this.x = basic.x;
        _this.y = basic.y;
        _this['text-anchor'] = basic['text-anchor'];
        _this.text = basic.text;
        _this.transform = basic.transform;
        _this.labelRotation = basic.labelRotation;
        _this['dominant-baseline'] = basic['dominant-baseline'];
        _this.baseline = basic.baseline;
        _this.dy = basic.dy;
        return _this;
    }
    return TextOption;
}(TextElement));
/**
 * Helper Class to define property to draw text.
 * @private
 */
var TextBasic = /** @__PURE__ @class */ (function () {
    function TextBasic(x, y, anchor, text, labelRotation, transform, baseLine, dy) {
        this.transform = '';
        this['dominant-baseline'] = 'auto';
        this.labelRotation = 0;
        this.baseline = 'auto';
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this['text-anchor'] = anchor ? anchor : '';
        this.text = text ? text : '';
        this.transform = transform ? transform : '';
        this.labelRotation = labelRotation;
        this['dominant-baseline'] = baseLine ? baseLine : '';
        this.baseline = baseLine ? baseLine : '';
        this.dy = dy ? dy : '';
    }
    return TextBasic;
}());
/**
 * Class to define property to draw line.
 * @private
 */
var Line = /** @__PURE__ @class */ (function () {
    function Line(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    return Line;
}());
/**
 * Class to define property to draw line.
 * @private
 */
var LineOption = /** @__PURE__ @class */ (function (_super) {
    __extends$1(LineOption, _super);
    function LineOption(id, line, stroke, strokewidth, opacity, dasharray) {
        var _this = _super.call(this, id, null, strokewidth, stroke, opacity, dasharray, null) || this;
        _this.x1 = line.x1;
        _this.y1 = line.y1;
        _this.x2 = line.x2;
        _this.y2 = line.y2;
        return _this;
    }
    return LineOption;
}(PathOption));
/**
 * Properties required to render path.
 * @private
 */
var PathAttributes = /** @__PURE__ @class */ (function (_super) {
    __extends$1(PathAttributes, _super);
    function PathAttributes(id, path, fill, border, borderWidth, opacity, borderColor) {
        var _this = _super.call(this, id, fill, borderWidth, borderColor, opacity, null) || this;
        _this.d = path.d;
        _this.x = path.x;
        _this.y = path.y;
        return _this;
    }
    return PathAttributes;
}(PathOption));
/**
 * Helper Class to define property to path.
 * @private
 */
var Path = /** @__PURE__ @class */ (function () {
    function Path(d, innerR, x, y, x1, y1, cx, cy, start, end, radius, counterClockWise) {
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
    return Path;
}());
/** @private */
function sum(values) {
    var sum = 0;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        sum += value;
    }
    return sum;
}
/** @private */
function titlePositionY(heatmapSize, topPadding, bottomPadding, titleStyle) {
    var positionY;
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
    var renderer = new SvgRenderer('heatmapMeasureRotateText');
    var svgObject = renderer.createSvg({ id: 'heatmapMeasureRotateText_svg', width: 100, height: 100 });
    var box;
    var options;
    var htmlObject;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
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
var DrawSvgCanvas = /** @__PURE__ @class */ (function () {
    function DrawSvgCanvas(heatmap) {
        this.heatMap = heatmap;
    }
    //Svg & Canvas Rectangle Part
    DrawSvgCanvas.prototype.drawRectangle = function (properties, parentElement, isFromSeries) {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawRectangle(properties));
        }
        else {
            this.drawCanvasRectangle(this.heatMap.canvasRenderer, properties, isFromSeries);
        }
    };
    //Svg & Canvas Bubble Part
    DrawSvgCanvas.prototype.drawCircle = function (properties, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawCircle(properties));
        }
        else {
            this.drawCanvasCircle(this.heatMap.canvasRenderer, properties);
        }
    };
    //Svg & Canvas Pie Part
    DrawSvgCanvas.prototype.drawPath = function (properties, options, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawPath(properties));
        }
        else {
            this.drawCanvasPath(this.heatMap.canvasRenderer, properties, options);
        }
    };
    //Svg & Canvas Text Part
    DrawSvgCanvas.prototype.createText = function (properties, parentElement, text) {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.createText(properties, text));
        }
        else {
            this.canvasDrawText(properties, text);
        }
    };
    //Draw the wrapped text for both SVG & canvas
    DrawSvgCanvas.prototype.createWrapText = function (options, font, parentElement) {
        var renderOptions = {};
        var htmlObject;
        var tspanElement;
        var text;
        var height;
        renderOptions = {
            'id': options.id,
            'x': options.x,
            'y': options.y,
            'fill': options.fill,
            'font-size': font.size,
            'font-style': font.fontStyle,
            'font-family': font.fontFamily,
            'font-weight': font.fontWeight,
            'text-anchor': options['text-anchor'],
            'transform': options.transform,
            'dominant-baseline': options['dominant-baseline']
        };
        text = options.text[0];
        if (!this.heatMap.enableCanvasRendering) {
            htmlObject = this.heatMap.renderer.createText(renderOptions, text);
        }
        else {
            this.heatMap.canvasRenderer.drawText(options, text);
        }
        if (typeof options.text !== 'string' && options.text.length > 1) {
            for (var i = 1, len = options.text.length; i < len; i++) {
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
                    this.heatMap.canvasRenderer.drawText(options, options.text[i]);
                }
            }
        }
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(htmlObject);
        }
    };
    DrawSvgCanvas.prototype.drawLine = function (properties, parentElement) {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawLine(properties));
        }
        else {
            this.heatMap.canvasRenderer.drawLine(properties);
        }
    };
    //Canvas Text Part
    DrawSvgCanvas.prototype.canvasDrawText = function (options, label, translateX, translateY) {
        var ctx = this.heatMap.canvasRenderer.ctx;
        if (!translateX) {
            translateX = options.x;
        }
        if (!translateY) {
            translateY = options.y;
        }
        var fontWeight = this.getOptionValue(options, 'font-weight');
        if (!isNullOrUndefined(fontWeight) && fontWeight.toLowerCase() === 'regular') {
            fontWeight = 'normal';
        }
        var fontFamily = this.getOptionValue(options, 'font-family');
        var fontSize = (options['font-size'].toString()).indexOf('px') === -1 ? options['font-size'] + 'px' : options['font-size'];
        var anchor = this.getOptionValue(options, 'text-anchor');
        var fontStyle = this.getOptionValue(options, 'font-style').toLowerCase();
        var font = (fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily);
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
    };
    // method to get the attributes value
    /* tslint:disable */
    DrawSvgCanvas.prototype.getOptionValue = function (options, key) {
        return options[key];
    };
    DrawSvgCanvas.prototype.setAttributes = function (canvas, options) {
        canvas.ctx.lineWidth = options['stroke-width'];
        var dashArray = options['stroke-dasharray'];
        if (!isNullOrUndefined(dashArray)) {
            var dashArrayString = dashArray.split(',');
            canvas.ctx.setLineDash([parseInt(dashArrayString[0], 10), parseInt(dashArrayString[1], 10)]);
        }
        canvas.ctx.strokeStyle = options['stroke'];
    };
    
    DrawSvgCanvas.prototype.drawCanvasRectangle = function (canvas, options, isFromSeries) {
        var canvasCtx = canvas.ctx;
        var cornerRadius = options.rx;
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
    };
    
    // To draw the corner of a rectangle
    DrawSvgCanvas.prototype.drawCornerRadius = function (canvas, options) {
        var cornerRadius = options.rx;
        var x = options.x;
        var y = options.y;
        var width = options.width;
        var height = options.height;
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
    };
    
    DrawSvgCanvas.prototype.drawCanvasCircle = function (canvas, options) {
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
    };
    
    DrawSvgCanvas.prototype.drawCanvasPath = function (canvas, properties, options) {
        var path = properties.d;
        var dataSplit = path.split(' ');
        var borderWidth = this.getOptionValue(options, 'stroke-width');
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = properties.opacity;
        canvas.ctx.fillStyle = properties.fill;
        this.setAttributes(canvas, properties);
        for (var i = 0; i < dataSplit.length; i = i + 3) {
            var x1 = parseFloat(dataSplit[i + 1]);
            var y1 = parseFloat(dataSplit[i + 2]);
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
    };
    
    return DrawSvgCanvas;
}());
function getTitle(title, style, width) {
    var titleCollection = [];
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
    var textCollection = currentLabel.split(' ');
    var label = '';
    var labelCollection = [];
    var text;
    for (var i = 0, len = textCollection.length; i < len; i++) {
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
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var index = textLength - 1; index >= 0; --index) {
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
    var label = text;
    var size = measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
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
var Gradient = /** @__PURE__ @class */ (function () {
    function Gradient(x, x1, x2, y1, y2) {
        this.id = x;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
    return Gradient;
}());
var GradientColor = /** @__PURE__ @class */ (function () {
    function GradientColor(color, colorStop) {
        this.color = color;
        this.colorStop = colorStop;
    }
    return GradientColor;
}());
/** @private */
function showTooltip(text, x, y, areaWidth, id, element, isTouch, heatmap) {
    var tooltip = document.getElementById(id);
    var initialClip = heatmap.initialClipRect;
    var size = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    });
    var width = size.width + 5;
    x = (x + width > areaWidth) ? x - width : x;
    x = x < 0 ? 5 : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: Segoe UI'
        });
        element.appendChild(tooltip);
    }
    else {
        tooltip.innerHTML = text;
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
            (initialClip.height + initialClip.y - (size.height + 6) + 5).toString() + 'px' : tooltip.style.top; // 6 and 7 are padding and border width
    }
    if (isTouch) {
        setTimeout(function () { removeElement(id); }, 1500);
    }
}
/** @private */
function removeElement(id) {
    var element = getElement(id);
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
    var result = new Date(value);
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
var CanvasTooltip = /** @__PURE__ @class */ (function () {
    function CanvasTooltip(text, rect) {
        this.region = new Rect(0, 0, 0, 0);
        this.text = text;
        this.region = rect;
    }
    return CanvasTooltip;
}());
/* private*/
/* Method to get the tool tip text in canvas based on region. */
function getTooltipText(tooltipCollection, xPosition, yPosition) {
    var length = tooltipCollection.length;
    var tooltip;
    var region;
    var text;
    for (var i = 0; i < length; i++) {
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
var PaletterColor = /** @__PURE__ @class */ (function () {
    function PaletterColor() {
    }
    return PaletterColor;
}());
/**
 * @private
 */
var GradientPointer = /** @__PURE__ @class */ (function () {
    function GradientPointer(pathX1, pathY1, pathX2, pathY2, pathX3, pathY3) {
        this.pathX1 = pathX1;
        this.pathY1 = pathY1;
        this.pathX2 = pathX2;
        this.pathY2 = pathY2;
        this.pathX3 = pathX3;
        this.pathY3 = pathY3;
    }
    return GradientPointer;
}());
/**
 * Class to define currentRect private property.
 * @private
 */
var CurrentLegendRect = /** @__PURE__ @class */ (function () {
    function CurrentLegendRect(x, y, width, height, label, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.id = id;
    }
    return CurrentLegendRect;
}());
/** @private */
function colorNameToHex(color) {
    var element;
    color = color === 'transparent' ? 'white' : color;
    element = document.getElementById('heatmapmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    var exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    var isRGBValue = exp.exec(color);
    return convertToHexCode(new RgbColor(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
/** @private */
function convertToHexCode(value) {
    return '#' + componentToHex(value.R) + componentToHex(value.G) + componentToHex(value.B);
}
/** @private */
function componentToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
function convertHexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new RgbColor(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new RgbColor(255, 255, 255);
}

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
})(Theme || (Theme = {}));
/** @private */
function getThemeColor(theme) {
    var style;
    switch (theme) {
        case 'Highcontrast':
            style = {
                heatMapTitle: '#ffffff',
                axisTitle: '#ffffff',
                axisLabel: '#ffffff',
                cellBorder: '#EEEEEE',
                background: '#000000',
                cellTextColor: '#000000',
                emptyCellColor: '#EEEEEE',
                legendLabel: '#ffffff',
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

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * HeatMap Axis file
 */
var Axis = /** @__PURE__ @class */ (function (_super) {
    __extends$4(Axis, _super);
    function Axis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.rect = new Rect(undefined, undefined, 0, 0);
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        /** @private */
        _this.maxLabelSize = new Size(0, 0);
        /** @private */
        _this.titleSize = new Size(0, 0);
        /** @private */
        _this.axisLabels = [];
        /** @private */
        _this.tooltipLabels = [];
        /** @private */
        _this.labelValue = [];
        /** @private */
        _this.axisLabelSize = 0;
        /** @private */
        _this.axisLabelInterval = 0;
        /** @private */
        _this.dateTimeAxisLabelInterval = [];
        /** @private */
        _this.maxLength = 0;
        /** @private */
        _this.min = 0;
        /** @private */
        _this.max = 0;
        /** @private */
        _this.isIntersect = false;
        return _this;
    }
    /**
     * measure the axis title and label size
     * @param axis
     * @param heatmap
     * @private
     */
    Axis.prototype.computeSize = function (axis, heatmap) {
        var innerPadding = 10;
        this.titleSize = axis.getTitleSize(axis, innerPadding);
        this.maxLabelSize = axis.getMaxLabelSize(axis, heatmap);
    };
    Axis.prototype.getTitleSize = function (axis, innerPadding) {
        var titleSize = new Size(0, 0);
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
    };
    Axis.prototype.getMaxLabelSize = function (axis, heatmap) {
        var labelSize = new Size(0, 0);
        var labels = this.axisLabels;
        axis.angle = axis.labelRotation;
        axis.isIntersect = false;
        if (axis.orientation === 'Horizontal' && (axis.labelIntersectAction === 'Rotate45' ||
            (axis.labelRotation % 180 === 0 && axis.labelIntersectAction === 'Trim'))) {
            var interval = heatmap.initialClipRect.width / axis.axisLabels.length;
            var startX = heatmap.initialClipRect.x + ((!axis.isInversed) ? 0 : heatmap.initialClipRect.width);
            var previousEnd = void 0;
            for (var i = 0, len = labels.length; i < len; i++) {
                var label = labels[i];
                var elementSize = measureText(label, axis.textStyle);
                var startPoint = startX + (!axis.isInversed ?
                    ((interval - elementSize.width) / 2) : -((interval + elementSize.width) / 2));
                startPoint = startPoint < heatmap.initialClipRect.x ? heatmap.initialClipRect.x : startPoint;
                var endPoint = startPoint + elementSize.width;
                if (isNullOrUndefined(previousEnd)) {
                    previousEnd = endPoint;
                }
                else {
                    if (startPoint < previousEnd) {
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
                startX += axis.isInversed ? -interval : interval;
            }
        }
        for (var i = 0; i < labels.length; i++) {
            var size = (axis.angle % 180 === 0) ?
                measureText(labels[i], axis.textStyle) : rotateTextSize(axis.textStyle, labels[i], axis.angle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        if (axis.opposedPosition) {
            this.farSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width);
        }
        else {
            this.nearSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width);
        }
        return labelSize;
    };
    /**
     * Generate the axis lables for numeric axis
     * @param heatmap
     * @private
     */
    Axis.prototype.calculateNumericAxisLabels = function (heatmap) {
        //Axis Min
        var min = 0;
        var max = 0;
        var interval = this.interval ? this.interval : 1;
        var adaptorMin;
        var adaptorMax;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.min : heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.max : heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        min = !isNullOrUndefined(this.minimum) ? this.minimum : ((adaptorMin) ? adaptorMin : 0);
        max = !isNullOrUndefined(this.maximum) ? this.maximum :
            ((adaptorMax) ? adaptorMax : (this.maxLength * this.increment));
        var temp;
        if (this.minimum && this.maximum && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        max = !isNullOrUndefined(this.maximum) ? max : (adaptorMax ? adaptorMax : (max + min));
        var format = this.labelFormat;
        var isCustom = format.match('{value}') !== null;
        this.format = heatmap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        for (var i = min; i <= max; i = i + (interval * this.increment)) {
            var value = this.formatValue(isCustom, format, i);
            this.axisLabels.push(value);
        }
        this.min = 0;
        this.axisLabelSize = Math.floor(((max - min) / this.increment) + 1);
        this.max = this.axisLabelSize - 1;
        this.axisLabelInterval = interval;
        for (var i = min; i <= max; i = i + this.increment) {
            var value = this.formatValue(isCustom, format, i);
            this.tooltipLabels.push(value);
            this.labelValue.push(i);
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    };
    /**
     * Generate the axis lables for category axis
     * @private
     */
    Axis.prototype.calculateCategoryAxisLabels = function () {
        var labels = this.labels ? this.labels : [];
        var min = !isNullOrUndefined(this.minimum) ? this.minimum : 0;
        var max = !isNullOrUndefined(this.maximum) ? this.maximum : this.maxLength;
        var interval = this.interval ? this.interval : 1;
        var temp;
        if (!isNullOrUndefined(this.minimum) && !isNullOrUndefined(this.maximum) && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        if (labels && labels.length > 0) {
            for (var i = min; i <= max; i = i + interval) {
                var value = labels[i] ? labels[i].toString() : i.toString();
                this.axisLabels.push(value);
            }
        }
        else {
            for (var i = min; i <= max; i = i + interval) {
                this.axisLabels.push(i.toString());
            }
        }
        for (var i = min; i <= max; i++) {
            this.tooltipLabels.push(labels[i] ? labels[i].toString() : i.toString());
            this.labelValue.push(labels[i] ? labels[i].toString() : i.toString());
        }
        this.min = min;
        this.max = max;
        this.axisLabelSize = max - min + 1;
        this.axisLabelInterval = interval;
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    };
    /**
     * Generate the axis labels for date time axis.
     * @param heatmap
     * @private
     */
    Axis.prototype.calculateDateTimeAxisLabel = function (heatmap) {
        var interval = this.interval ? this.interval : 1;
        var option = {
            skeleton: 'full',
            type: 'dateTime'
        };
        var dateParser = heatmap.intl.getDateParser(option);
        var dateFormatter = heatmap.intl.getDateFormat(option);
        var min;
        var max;
        var adaptorMin = null;
        var adaptorMax = null;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.min :
                heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.max :
                heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        var minimum = this.minimum ? this.minimum : (adaptorMin ? adaptorMin : null);
        var maximum = this.maximum ? this.maximum : (adaptorMax ? adaptorMax : null);
        if (minimum === null && maximum === null) {
            min = 0;
            max = this.maxLength * this.increment;
            for (var i = min; i <= max; i = i + (interval * this.increment)) {
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
            var tempInterval = min;
            while (tempInterval <= max) {
                var value = this.format(new Date(tempInterval));
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
                var value = this.format(new Date(tempInterval));
                this.tooltipLabels.push(value);
                this.labelValue.push(new Date(tempInterval));
                tempInterval = increaseDateTimeInterval(tempInterval, 1, this.intervalType, this.increment).getTime();
            }
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    };
    Axis.prototype.calculateLabelInterval = function (interval) {
        var year = new Date(interval).getFullYear();
        var month = new Date(interval).getMonth() + 1;
        var day = new Date(interval).getDate();
        var numberOfDays;
        var tempInterval;
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
            var minutes = new Date(interval).getMinutes();
            tempInterval = this.intervalType === 'Minutes' ? Math.ceil((60 - minutes) / this.increment) : 1;
        }
        else {
            tempInterval = 1;
        }
        return tempInterval;
    };
    /**
     * @private
     */
    Axis.prototype.getSkeleton = function () {
        var skeleton;
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
    };
    /**
     * Formatted the axis label.
     * @private
     */
    Axis.prototype.formatValue = function (isCustom, format, tempInterval) {
        return isCustom ? format.replace('{value}', this.format(tempInterval))
            : this.format(tempInterval);
    };
    /** @private */
    Axis.prototype.getTotalLabelLength = function (min, max) {
        var length = 0;
        var minimum = new Date(min);
        var maximum = new Date(max);
        var difference;
        var days;
        switch (this.intervalType) {
            case 'Years':
                var years = ((maximum.getFullYear() - minimum.getFullYear()) / this.increment) + 1;
                length = Math.floor(years);
                break;
            case 'Months':
                var months = (maximum.getFullYear() - minimum.getFullYear()) * 12;
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
                var hours = Math.floor(difference / (1000 * 3600));
                length = Math.floor(hours / this.increment) + 1;
                break;
            case 'Minutes':
                difference = Math.abs(minimum.getTime() - maximum.getTime());
                var minutes = Math.floor(difference / (1000 * 60));
                length = Math.floor(minutes / this.increment) + 1;
                break;
        }
        return length;
    };
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
    return Axis;
}(ChildProperty));

var AxisHelper = /** @__PURE__ @class */ (function () {
    function AxisHelper(heatMap) {
        this.heatMap = heatMap;
        this.padding = 10;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }
    /**
     * To render the x and y axis.
     *  @private
     */
    AxisHelper.prototype.renderAxes = function () {
        this.initialClipRect = this.heatMap.initialClipRect;
        var heatMap = this.heatMap;
        var axisElement;
        var element;
        if (!heatMap.enableCanvasRendering) {
            axisElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'AxisCollection' });
        }
        var axes = this.heatMap.axisCollections;
        for (var i = 0, len = axes.length; i < len; i++) {
            var axis = axes[i];
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
            if (!heatMap.enableCanvasRendering) {
                axisElement.appendChild(element);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.heatMap.svgObject.appendChild(axisElement);
        }
    };
    AxisHelper.prototype.drawXAxisLine = function (parent, axis) {
        var y = this.initialClipRect.y + (!axis.opposedPosition ? this.initialClipRect.height : 0);
        var line = new LineOption(this.heatMap.element.id + '_XAxisLine', new Line(this.initialClipRect.x, y, this.initialClipRect.x + this.initialClipRect.width, y), 'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    };
    AxisHelper.prototype.drawYAxisLine = function (parent, axis) {
        var x = this.initialClipRect.x + ((!axis.opposedPosition) ? 0 : this.initialClipRect.width);
        var line = new LineOption(this.heatMap.element.id + '_YAxisLine', new Line(x, this.initialClipRect.y, x, this.initialClipRect.height + this.initialClipRect.y), 'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    };
    AxisHelper.prototype.drawXAxisTitle = function (axis, parent, rect) {
        var y = rect.y + (!axis.opposedPosition ?
            (axis.maxLabelSize.height + this.padding) : -(axis.maxLabelSize.height + this.padding));
        if (axis.title.text) {
            var heatMap = this.heatMap;
            var title = axis.title;
            var elementSize = measureText(title.text, title.textStyle);
            var padding = this.padding;
            var anchor = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            padding = axis.opposedPosition ? -(padding + elementSize.height / 4) : (padding + (3 * elementSize.height / 4));
            var options = new TextOption(heatMap.element.id + '_XAxisTitle', new TextBasic(rect.x + titlePositionX(rect.width, 0, 0, title.textStyle), y + padding, anchor, title.text), title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            this.drawSvgCanvas.createText(options, parent, title.text);
        }
    };
    AxisHelper.prototype.drawYAxisTitle = function (axis, parent, rect) {
        if (axis.title.text) {
            var title = axis.title;
            var heatMap = this.heatMap;
            var labelRotation = (axis.opposedPosition) ? 90 : -90;
            var elementSize = measureText(title.text, title.textStyle);
            var anchor = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            var padding = 10;
            padding = axis.opposedPosition ? padding : -padding;
            var x = rect.x + padding + ((axis.opposedPosition) ? axis.maxLabelSize.width : -axis.maxLabelSize.width);
            var y = rect.y + titlePositionY(rect, 0, 0, title.textStyle) + (axis.opposedPosition ? this.padding : -this.padding);
            var options = new TextOption(heatMap.element.id + '_YAxisTitle', new TextBasic(x, y - this.padding, anchor, title.text, labelRotation, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', 'auto'), title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            if (!this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.createText(options, parent, title.text);
            }
            else {
                this.drawSvgCanvas.canvasDrawText(options, title.text, x, y);
            }
        }
    };
    /**
     * Get the visible labels for both x and y axis
     * @private
     */
    AxisHelper.prototype.calculateVisibleLabels = function () {
        var heatmap = this.heatMap;
        var axis;
        var axisCollection = heatmap.axisCollections;
        for (var i = 0, len = axisCollection.length; i < len; i++) {
            axis = axisCollection[i];
            axis.axisLabels = [];
            axis.tooltipLabels = [];
            axis.dateTimeAxisLabelInterval = [];
            axis.labelValue = [];
            if (axis.valueType === 'Numeric') {
                axis.calculateNumericAxisLabels(this.heatMap);
            }
            else if (axis.valueType === 'DateTime') {
                axis.calculateDateTimeAxisLabel(this.heatMap);
            }
            else {
                axis.calculateCategoryAxisLabels();
            }
            axis.tooltipLabels = axis.isInversed ? axis.tooltipLabels.reverse() : axis.tooltipLabels;
        }
    };
    /**
     * Measure the title and labels rendering position for both X and Y axis.
     * @param rect
     * @private
     */
    AxisHelper.prototype.measureAxis = function (rect) {
        var heatmap = this.heatMap;
        var axis;
        var axisCollection = heatmap.axisCollections;
        for (var i = axisCollection.length - 1; i >= 0; i--) {
            axis = axisCollection[i];
            var padding = axis.textStyle.size === '0px' ? 0 : this.padding;
            axis.nearSizes = [];
            axis.farSizes = [];
            axis.computeSize(axis, heatmap);
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
    };
    /**
     * Calculate the X and Y axis line position
     * @param rect
     * @private
     */
    AxisHelper.prototype.calculateAxisSize = function (rect) {
        var heatmap = this.heatMap;
        var axisCollection = heatmap.axisCollections;
        for (var i = 0, len = axisCollection.length; i < len; i++) {
            var axis_1 = axisCollection[i];
            axis_1.rect = extend({}, rect, null, true);
            if (axis_1.orientation === 'Horizontal' && !axis_1.opposedPosition) {
                axis_1.rect.y = rect.y + rect.height;
                axis_1.rect.height = 0;
            }
            if (axis_1.orientation === 'Vertical' && axis_1.opposedPosition) {
                axis_1.rect.x = rect.x + rect.width;
                axis_1.rect.width = 0;
            }
        }
    };
    AxisHelper.prototype.drawXAxisLabels = function (axis, parent, rect) {
        var heatMap = this.heatMap;
        var labels = axis.axisLabels;
        var interval = rect.width / axis.axisLabelSize;
        var compactInterval = 0;
        var axisInterval = axis.interval ? axis.interval : 1;
        var tempintervel = rect.width / (axis.axisLabelSize / axis.axisLabelInterval);
        var temp = axis.axisLabelInterval;
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
        var padding = 10;
        var lableStrtX = rect.x + (!axis.isInversed ? 0 : rect.width);
        var labelPadding;
        var angle = axis.angle;
        padding = this.padding;
        var labelElement;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabels' });
        }
        for (var i = 0, len = labels.length; i < len; i++) {
            var lableRect = new Rect(lableStrtX, rect.y, interval, rect.height);
            var label = (axis.labelIntersectAction === 'Trim' && axis.isIntersect) ? axis.valueType !== 'DateTime' ||
                axis.showLabelOn === 'None' ? textTrim(interval * axisInterval, labels[i], axis.textStyle) :
                textTrim(axis.dateTimeAxisLabelInterval[i] * interval, labels[i], axis.textStyle) : labels[i];
            var elementSize = measureText(label, axis.textStyle);
            var transform = void 0;
            labelPadding = (axis.opposedPosition) ?
                -(padding)
                : padding + (3 * (elementSize.height / 4));
            var x = lableRect.x + ((!axis.isInversed) ?
                (lableRect.width / 2) - (elementSize.width / 2) : -((lableRect.width / 2) + (elementSize.width / 2)));
            if (axis.labelIntersectAction === 'Trim') {
                x = (!axis.isInversed) ? (x >= lableRect.x ? x : lableRect.x) : (x > (lableStrtX - interval) ? x : (lableStrtX - interval));
            }
            else if (angle % 180 === 0) {
                x = x < rect.x ? rect.x : x;
                x = ((x + elementSize.width) > (rect.x + rect.width)) ? (rect.x + rect.width - elementSize.width) : x;
            }
            var y = rect.y + labelPadding;
            if (angle % 360 !== 0) {
                angle = (angle > 360) ? angle % 360 : angle;
                var rotateSize = rotateTextSize(axis.textStyle, label, angle);
                var diffHeight = axis.maxLabelSize.height - Math.ceil(rotateSize.height - elementSize.height);
                var yLocation = axis.opposedPosition ? diffHeight / 2 : -diffHeight / 2;
                x = lableRect.x + (axis.isInversed ? -(lableRect.width / 2) : (lableRect.width / 2));
                y = y + (axis.opposedPosition ? -(rotateSize.height / 2) : ((rotateSize.height - elementSize.height) / 2));
                transform = 'rotate(' + angle + ',' + x + ','
                    + y + ')';
            }
            var options = new TextOption(heatMap.element.id + '_XAxis_Label' + i, new TextBasic(x, y, (angle % 360 === 0) ? 'start' : 'middle', label, angle, transform), axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (angle !== 0 && this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.canvasDrawText(options, label);
            }
            else {
                this.drawSvgCanvas.createText(options, labelElement, label);
            }
            if (compactInterval === 0) {
                var labelInterval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStrtX = lableStrtX + (!axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            }
            else {
                lableStrtX = lableStrtX + (!axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
            }
            if (label.indexOf('...') !== -1 && this.heatMap.enableCanvasRendering) {
                this.heatMap.tooltipCollection.push(new CanvasTooltip(labels[i], new Rect(x, y - elementSize.height, elementSize.width, elementSize.height)));
            }
            if (compactInterval !== 0) {
                i = i + (compactInterval - 1);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    };
    AxisHelper.prototype.drawYAxisLabels = function (axis, parent, rect) {
        var heatMap = this.heatMap;
        var labels = axis.axisLabels;
        var interval = rect.height / axis.axisLabelSize;
        var compactInterval = 0;
        var tempintervel = rect.height / (axis.axisLabelSize / axis.axisLabelInterval);
        var temp = axis.axisLabelInterval;
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
        var padding = 10;
        var lableStartY = rect.y + (axis.isInversed ? 0 : rect.height);
        var anchor = axis.opposedPosition ? 'start' : 'end';
        padding = axis.opposedPosition ? padding : -padding;
        var labelElement;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabels' });
        }
        for (var i = 0, len = labels.length; i < len; i++) {
            var labelRect = new Rect(rect.x, lableStartY, rect.width, interval);
            var position = labelRect.height / 2; //titlePositionY(lableRect, 0, 0, axis.textStyle);
            var x = labelRect.x + padding;
            var y = labelRect.y + (axis.isInversed ? position : -position);
            var options = new TextOption(heatMap.element.id + '_YAxis_Label' + i, new TextBasic(x, y, anchor, labels[i], 0, 'rotate(' + 0 + ',' + (x) + ',' + (y) + ')', 'middle'), axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                options.dy = '1ex';
            }
            this.drawSvgCanvas.createText(options, labelElement, labels[i]);
            if (compactInterval === 0) {
                var labelInterval = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStartY = lableStartY + (axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            }
            else {
                lableStartY = lableStartY + (axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
                i = i + (compactInterval - 1);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    };
    return AxisHelper;
}());

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the CellSettings property in the Heatmap.
 */
var CellSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$5(CellSettings, _super);
    function CellSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    return CellSettings;
}(ChildProperty));
var Series = /** @__PURE__ @class */ (function () {
    function Series(heatMap) {
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(this.heatMap);
        this.cellColor = new CellColor(this.heatMap);
    }
    /**
     * To render rect series.
     * @return {void}
     * @private
     */
    Series.prototype.renderRectSeries = function () {
        this.createSeriesGroup();
        var heatMap = this.heatMap;
        heatMap.xLength = heatMap.axisCollections[0].axisLabelSize;
        heatMap.yLength = heatMap.axisCollections[1].axisLabelSize; // Series Part
        var tempX = Math.round(heatMap.initialClipRect.x * 100) / 100;
        var tempY = Math.round(heatMap.initialClipRect.y * 100) / 100;
        var dataXIndex = 0;
        var dataYIndex = 0;
        var cellSetting = heatMap.cellSettings;
        var tempWidth = Math.round(((heatMap.initialClipRect.width -
            (cellSetting.border.width / 2)) / heatMap.xLength) * 100) / 100;
        var tempHeight = Math.round(((heatMap.initialClipRect.height -
            (cellSetting.border.width / 2)) / heatMap.yLength) * 100) / 100;
        var tempVal = 0;
        var themeStyle = heatMap.themeStyle;
        var tempBorder;
        var tempRectPosition = [];
        var circleRadius;
        tempBorder = cellSetting.border;
        var borderColor;
        this.rectPositionCollection = [];
        this.color = '';
        this.bubbleColorValue = [];
        if (heatMap.yAxis.opposedPosition) {
            tempX = Math.round((heatMap.initialClipRect.x + (parseFloat(tempBorder.width.toString()) / 2)) * 100) / 100;
        }
        circleRadius = this.getBubbleRadius(tempWidth, tempHeight);
        for (var x = 0; x < (heatMap.xLength * heatMap.yLength); x++) {
            this.setTextAndColor(dataXIndex, dataYIndex);
            var rectPosition = new CurrentRect(0, 0, 0, 0, 0, '');
            borderColor = tempBorder.color;
            if ((heatMap.renderingMode === 'Canvas' && parseFloat(tempBorder.width.toString()) === 0) || (!borderColor &&
                cellSetting.tileType === 'Bubble' && cellSetting.bubbleType === 'Sector')) {
                borderColor = this.color;
            }
            if (this.heatMap.bubbleSizeWithColor) {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, extend('', this.bubbleColorValue, null, true), x);
            }
            else {
                this.updateRectDetails(rectPosition, tempX, tempY, tempWidth, tempHeight, this.text, x);
            }
            if (cellSetting.tileType === 'Rect') { // Rectangle/Tile Series
                this.renderTileCell(rectPosition, tempBorder, x, this.color, borderColor);
                this.updateLabelVisibleStatus(tempWidth, tempHeight);
            }
            else {
                if (cellSetting.bubbleType === 'Color') { // Bubble by same size and different color Series
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, circleRadius);
                    this.updateLabelVisibleStatus((circleRadius * 2) - 12, (circleRadius * 2) - 6); // 6, 12 - circle padding
                }
                else if (!isNullOrUndefined(this.text) && (cellSetting.bubbleType === 'Size' || cellSetting.bubbleType === 'SizeAndColor')
                    && this.text.toString() !== '') { // Bubble by same color and different size Series
                    var tempCircleRadius = this.getRadiusBypercentage(parseFloat(this.text.toString()), heatMap.dataSourceMinValue, heatMap.dataSourceMaxValue, circleRadius);
                    this.renderBubbleCell(rectPosition, tempBorder, x, this.color, borderColor, tempCircleRadius);
                    this.updateLabelVisibleStatus((tempCircleRadius * 2) - 12, (tempCircleRadius * 2) - 6);
                }
                else if (cellSetting.bubbleType === 'Sector' && !isNullOrUndefined(this.text) && this.text.toString() !== '') {
                    this.renderSectorCell(rectPosition, tempBorder, x.toString(), this.color, borderColor, circleRadius, this.text);
                    this.checkLabelXDisplay = false;
                    this.checkLabelYDisplay = false;
                }
            }
            tempRectPosition.push(rectPosition);
            if (cellSetting.showLabel && this.checkLabelYDisplay && this.checkLabelXDisplay) {
                var displayText = this.getFormatedText(this.text, cellSetting.format);
                var themeCellTextStyle = cellSetting.textStyle;
                var options = new TextOption(heatMap.element.id + '_HeatMapRectLabels_' + x, new TextBasic(Math.round((tempX + tempWidth / 2) * 100) / 100, Math.round((tempY + tempHeight / 2) * 100) / 100, 'middle', displayText, null, null, 'middle'), themeCellTextStyle, themeCellTextStyle.color || this.getSaturatedColor(this.color));
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
    };
    /**
     * To set color and text details.
     * @private
     */
    Series.prototype.setTextAndColor = function (dataXIndex, dataYIndex) {
        var cellSetting = this.heatMap.cellSettings;
        this.bubbleColorValue = [];
        var adaptData = this.heatMap.dataSource;
        // tslint:disable-next-line:no-any
        var clonedDataSource = this.heatMap.clonedDataSource;
        if (this.heatMap.bubbleSizeWithColor) {
            this.text = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][0]) &&
                clonedDataSource[dataXIndex][dataYIndex][0].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][0] : '';
            this.color = !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ?
                this.cellColor.getColorByValue(clonedDataSource[dataXIndex][dataYIndex][1])
                : this.heatMap.isColorValueExist ? this.heatMap.emptyPointColor : this.cellColor.getColorByValue(this.text);
            var tempBubbleCollection = new BubbleTooltipData(adaptData.isJsonData && adaptData.adaptorType === 'Cell' ? this.heatMap.dataSource.bubbleDataMapping.size : null, this.text, 'Size');
            this.bubbleColorValue.push(tempBubbleCollection);
            this.bubbleColorValue.push({
                mappingName: adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                    this.heatMap.dataSource.bubbleDataMapping.color : null,
                bubbleData: !isNullOrUndefined(clonedDataSource[dataXIndex][dataYIndex][1]) &&
                    clonedDataSource[dataXIndex][dataYIndex][1].toString() !== '' ? clonedDataSource[dataXIndex][dataYIndex][1] : '',
                valueType: 'Color'
            });
        }
        else {
            this.text = clonedDataSource[dataXIndex][dataYIndex];
            this.color = this.cellColor.getColorByValue(this.text);
        }
    };
    /**
     * To update rect details.
     * @private
     */
    Series.prototype.createSeriesGroup = function () {
        if (!this.heatMap.enableCanvasRendering) {
            this.containerRectObject = this.heatMap.renderer.createGroup({
                id: this.heatMap.element.id + '_Container_RectGroup',
                x: this.heatMap.initialClipRect.x, y: this.heatMap.initialClipRect.y, transform: 'translate( 0, 0)'
            });
            if (this.heatMap.cellSettings.showLabel &&
                !(this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Sector')) {
                this.containerTextObject = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_Container_TextGroup', transform: 'translate( 0, 0)' });
            }
        }
    };
    /**
     * To update rect details.
     * @private
     */
    Series.prototype.updateRectDetails = function (rectPosition, tempX, tempY, tempWidth, tempHeight, text, x) {
        rectPosition.x = tempX;
        rectPosition.y = tempY;
        rectPosition.width = tempWidth;
        rectPosition.height = tempHeight;
        rectPosition.value = text;
        rectPosition.id = this.heatMap.element.id + '_HeatMapRect_' + x;
    };
    /**
     * To Render Tile Cell.
     * @private
     */
    Series.prototype.renderTileCell = function (rectPosition, tempBorder, x, color, borderColor) {
        var rect = new RectOption(this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1, new Rect(rectPosition.x, rectPosition.y, rectPosition.width, rectPosition.height), borderColor || this.heatMap.themeStyle.cellBorder, tempBorder.radius, tempBorder.radius);
        this.drawSvgCanvas.drawRectangle(rect, this.containerRectObject, true);
    };
    /**
     * To get bubble radius.
     * @private
     */
    Series.prototype.getBubbleRadius = function (width, height) {
        var radius = (width / 2) - 2;
        if (height / 2 < width / 2) {
            radius = (height / 2) - 2;
        }
        return radius < 0 ? 0 : radius;
    };
    /**
     * To Render Bubble Cell.
     * @private
     */
    Series.prototype.renderSectorCell = function (bubblePosition, tempBorder, x, color, borderColor, circleRadius, text) {
        var curve;
        var startAngle;
        var endAngle;
        var cX;
        var cY;
        var X1;
        var Y1;
        var tempcX;
        var tempcY;
        var pathBorderWidth;
        var centerX = Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100;
        var centerY = Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100;
        var tempColor = color;
        var sectorContibution = this.getRadiusBypercentage(text, this.heatMap.dataSourceMinValue, this.heatMap.dataSourceMaxValue, 360); // Circle total angle.
        for (var y = 0; y < 2; y++) {
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
            var path = new Path('', false, centerX, centerY, X1, Y1, cX, cY, startAngle, endAngle, circleRadius, true);
            var sector = new PathAttributes(this.heatMap.element.id + '_HeatMapRect_' + x, path, tempColor, tempBorder, pathBorderWidth, 1, borderColor);
            this.calculateShapes(sector, path, sectorContibution, curve);
            this.drawSvgCanvas.drawPath(sector, path, this.containerRectObject);
            if (sectorContibution === 360) {
                break;
            }
        }
    };
    /**
     * To Render sector Cell.
     * @private
     */
    Series.prototype.calculateShapes = function (options, path, sectorContibution, curve) {
        var pathString;
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
    };
    /**
     * To Render Bubble Cell.
     * @private
     */
    Series.prototype.renderBubbleCell = function (bubblePosition, tempBorder, x, color, borderColor, circleRadius) {
        var circle = new CircleOption(this.heatMap.element.id + '_HeatMapRect_' + x, color, tempBorder, 1, borderColor || this.heatMap.themeStyle.cellBorder, Math.round((bubblePosition.x + (bubblePosition.width / 2)) * 100) / 100, Math.round((bubblePosition.y + (bubblePosition.height / 2)) * 100) / 100, circleRadius);
        this.drawSvgCanvas.drawCircle(circle, this.containerRectObject);
    };
    /**
     * To find whether the X,Y Label need to display or not.
     * @private
     */
    Series.prototype.updateLabelVisibleStatus = function (tempWidth, tempHeight) {
        var tempMaxString = this.getFormatedText(this.text, this.heatMap.cellSettings.format);
        this.checkLabelYDisplay = tempHeight > parseInt(this.heatMap.cellSettings.textStyle.size, 10) ? true : false;
        this.checkLabelXDisplay = tempWidth > (tempMaxString.length *
            (parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2)) ? true : false;
    };
    /**
     * To find percentage value.
     * @private
     */
    Series.prototype.getRadiusBypercentage = function (text, min, max, radius) {
        var valueInPrecentage = ((text - min) /
            (max - min)) * 100;
        radius = ((this.heatMap.bubbleSizeWithColor ||
            (this.heatMap.cellSettings.tileType === 'Bubble' && this.heatMap.cellSettings.bubbleType === 'Size'))
            && this.heatMap.cellSettings.isInversedBubbleSize) ? radius - (radius * (valueInPrecentage / 100))
            : radius * (valueInPrecentage / 100);
        return (Math.round(radius * 100) / 100) < 0 ? 0 : (Math.round(radius * 100) / 100);
    };
    /**
     * To find saturated color for datalabel.
     * @return {string}
     * @private
     */
    Series.prototype.getSaturatedColor = function (color) {
        var saturatedColor = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        var rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        var contrast = Math.round((rgbValue.R * 299 + rgbValue.G * 587 + rgbValue.B * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    };
    /**
     * To highlight the mouse hovered rect cell.
     * @return {void}
     * @private
     */
    Series.prototype.highlightSvgRect = function (tempID) {
        if (tempID.indexOf('Celltooltip') === -1) {
            if (tempID.indexOf('_HeatMapRect') !== -1) {
                if (tempID.indexOf('_HeatMapRectLabels_') !== -1) {
                    var tempIndex = tempID.indexOf('_HeatMapRectLabels_') + 19;
                    tempID = this.heatMap.element.id + '_HeatMapRect_' + tempID.slice(tempIndex);
                }
                var element = document.getElementById(tempID);
                if (this.heatMap.tempRectHoverClass !== tempID) {
                    if (this.heatMap.cellSettings.enableCellHighlighting) {
                        var oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                        if (oldElement) {
                            oldElement.style.opacity = '1';
                        }
                        if (element) {
                            element.style.opacity = '0.65';
                        }
                    }
                    this.heatMap.tempRectHoverClass = tempID;
                }
            }
            else {
                if (this.heatMap.cellSettings.enableCellHighlighting) {
                    var oldElement = document.getElementById(this.heatMap.tempRectHoverClass);
                    if (oldElement) {
                        oldElement.style.opacity = '1';
                        this.heatMap.tempRectHoverClass = '';
                    }
                }
            }
        }
    };
    /**
     * To get the value depends to format.
     * @return {string}
     * @private
     */
    Series.prototype.getFormatedText = function (val, getFormat) {
        var format = getFormat;
        var isCustom = format.match('{value}') !== null;
        this.format = this.heatMap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        var value = '';
        if (val.toString() !== '') {
            value = this.formatValue(isCustom, format, val);
        }
        return value;
    };
    /**
     * To get mouse hovered cell details.
     * @return {CurrentRect}
     * @private
     */
    Series.prototype.getCurrentRect = function (x, y) {
        var currentRect;
        var firstRectDetails = [];
        firstRectDetails.push(this.heatMap.heatMapSeries.rectPositionCollection[0][0]);
        var rectX = Math.ceil((x - firstRectDetails[0].x) / firstRectDetails[0].width) <
            this.heatMap.axisCollections[0].axisLabelSize ?
            Math.ceil((x - firstRectDetails[0].x) / firstRectDetails[0].width) :
            this.heatMap.axisCollections[0].axisLabelSize;
        var rectY = Math.floor(((y - firstRectDetails[0].y) / firstRectDetails[0].height)) <
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
    };
    /**
     * Format the cell label.
     * @private
     */
    Series.prototype.formatValue = function (isCustom, format, tempInterval) {
        return isCustom ? format.replace('{value}', this.format(tempInterval))
            : this.format(tempInterval);
    };
    return Series;
}());

var TwoDimensional = /** @__PURE__ @class */ (function () {
    function TwoDimensional(heatMap) {
        this.heatMap = heatMap;
    }
    /**
     * To reconstruct proper two dimensional dataSource depends on min and max values.
     *  @private
     */
    TwoDimensional.prototype.processDataSource = function (dataSource) {
        // tslint:disable-next-line:no-any
        var tempCloneData = extend([], dataSource, null, true);
        this.heatMap.clonedDataSource = [];
        this.completeDataSource = [];
        var axis = this.heatMap.axisCollections;
        var dataLength = axis[0].maxLength + 1;
        var labelLength = axis[0].axisLabelSize + (axis[0].min > 0 ? axis[0].min : 0);
        var xLength = dataLength > labelLength ? dataLength : labelLength;
        var minVal;
        var maxVal;
        dataLength = axis[1].maxLength + 1;
        labelLength = axis[1].axisLabelSize + (axis[1].min > 0 ? axis[1].min : 0);
        var yLength = dataLength > labelLength ? dataLength : labelLength;
        // tslint:disable-next-line:no-any 
        var tempVariable;
        var cloneDataIndex = 0;
        var minMaxDatasource = [];
        this.tempSizeArray = [];
        this.tempColorArray = [];
        this.heatMap.minColorValue = null;
        this.heatMap.maxColorValue = null;
        for (var z = axis[1].valueType === 'Category' ? axis[1].min : 0; z < yLength; z++) {
            var tempIndex = axis[0].valueType === 'Category' ? axis[0].min : 0;
            this.completeDataSource.push([]);
            while (tempIndex < xLength) {
                if (tempIndex >= axis[0].min && tempIndex <= axis[0].max) {
                    this.processDataArray(tempCloneData, tempIndex, z, cloneDataIndex);
                }
                tempIndex++;
            }
            tempVariable = extend([], this.completeDataSource[cloneDataIndex], null, true);
            var minMaxVal = this.getMinMaxValue(minVal, maxVal, tempVariable);
            minVal = minMaxVal[0];
            maxVal = minMaxVal[1];
            if (this.heatMap.xAxis.isInversed) {
                this.completeDataSource[cloneDataIndex] = this.completeDataSource[cloneDataIndex].reverse();
            }
            if (z >= this.heatMap.axisCollections[1].min && z <= this.heatMap.axisCollections[1].max) {
                minMaxDatasource.push(this.completeDataSource[cloneDataIndex]);
            }
            cloneDataIndex++;
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
    };
    /**
     * To process and create a proper data array.
     *  @private
     */
    // tslint:disable-next-line:no-any
    TwoDimensional.prototype.processDataArray = function (tempCloneData, tempIndex, z, cloneDataIndex) {
        if (this.heatMap.bubbleSizeWithColor) {
            if (tempCloneData[tempIndex] && !isNullOrUndefined(tempCloneData[tempIndex][z])
                && typeof (tempCloneData[tempIndex][z]) === 'object') {
                // tslint:disable-next-line:no-any 
                var internalArray = tempCloneData[tempIndex][z];
                for (var tempx = 0; tempx < internalArray.length; tempx++) {
                    if (isNullOrUndefined(internalArray[tempx])) {
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
    };
    /**
     * To get minimum and maximum value
     *  @private
     */
    TwoDimensional.prototype.getMinMaxValue = function (minVal, maxVal, tempVariable) {
        var minMaxValue = [];
        if (this.heatMap.bubbleSizeWithColor) {
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
    };
    /**
     * To get minimum value
     *  @private
     */
    TwoDimensional.prototype.getMinValue = function (minVal, tempVariable) {
        if (isNullOrUndefined(minVal)) {
            minVal = this.performSort(tempVariable);
        }
        else if (this.performSort(tempVariable) < minVal) {
            minVal = this.performSort(tempVariable);
        }
        return !isNullOrUndefined(minVal) ? parseFloat(minVal.toString()) : minVal;
    };
    /**
     * To get maximum value
     *  @private
     */
    TwoDimensional.prototype.getMaxValue = function (maxVal, tempVariable) {
        if (isNullOrUndefined(maxVal) && tempVariable.length > 0) {
            maxVal = Math.max.apply(Math, tempVariable);
        }
        else if (Math.max.apply(Math, tempVariable) > maxVal) {
            maxVal = Math.max.apply(Math, tempVariable);
        }
        return !isNullOrUndefined(maxVal) ? parseFloat(maxVal.toString()) : maxVal;
    };
    /**
     * To perform sort operation.
     *  @private
     */
    // tslint:disable-next-line:no-any
    TwoDimensional.prototype.performSort = function (tempVariable) {
        return tempVariable.sort(function (a, b) { return a - b; }).filter(this.checkmin)[0];
    };
    /**
     * To get minimum value
     *  @private
     */
    TwoDimensional.prototype.checkmin = function (val) {
        return !isNullOrUndefined(val) && val.toString() !== '';
    };
    return TwoDimensional;
}());

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Legend
 */
var LegendSettings = /** @__PURE__ @class */ (function (_super) {
    __extends$6(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        Property('')
    ], LegendSettings.prototype, "height", void 0);
    __decorate$5([
        Property('')
    ], LegendSettings.prototype, "width", void 0);
    __decorate$5([
        Property('Right')
    ], LegendSettings.prototype, "position", void 0);
    __decorate$5([
        Property(true)
    ], LegendSettings.prototype, "visible", void 0);
    __decorate$5([
        Property('Center')
    ], LegendSettings.prototype, "alignment", void 0);
    __decorate$5([
        Property(true)
    ], LegendSettings.prototype, "showLabel", void 0);
    __decorate$5([
        Property(true)
    ], LegendSettings.prototype, "showGradientPointer", void 0);
    __decorate$5([
        Property(false)
    ], LegendSettings.prototype, "enableSmartLegend", void 0);
    __decorate$5([
        Property('All')
    ], LegendSettings.prototype, "labelDisplayType", void 0);
    __decorate$5([
        Complex(Theme.legendLabelFont, Font)
    ], LegendSettings.prototype, "textStyle", void 0);
    return LegendSettings;
}(ChildProperty));
/**
 *
 * The `Legend` module is used to render legend for the heatmap.
 */
var Legend = /** @__PURE__ @class */ (function () {
    function Legend(heatMap) {
        this.maxLegendLabelSize = new Size(0, 0);
        this.gradientScaleSize = 10;
        this.segmentCollections = [];
        this.textWrapCollections = [];
        this.labelCollections = [];
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
        this.labelXCollections = [];
        this.labelYCollections = [];
        this.legendXCollections = [];
        this.legendYCollections = [];
        /** @private */
        this.legendRectPositionCollection = [];
        this.heatMap = heatMap;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }
    
    /**
     * Get module name
     */
    Legend.prototype.getModuleName = function () {
        return 'Legend';
    };
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    Legend.prototype.destroy = function (heatMap) {
        /**
         * destory code
         */
    };
    
    /**
     * @private
     */
    Legend.prototype.renderLegendItems = function () {
        var heatMap = this.heatMap;
        var tempBorder = {
            color: 'transparent',
            width: 0,
        };
        this.legend = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_Legend' });
        var rectItems = new RectOption(heatMap.element.id + '_LegendBound', 'none', tempBorder, 1, this.legendGroup);
        this.drawSvgCanvas.drawRectangle(rectItems, this.legend);
        var legendBound = this.legendRectScale;
        var rectItemsSvg = new Rect(legendBound.x, legendBound.y, legendBound.width, legendBound.height);
        if (heatMap.paletteSettings.type === 'Gradient' || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend === true)) {
            if (heatMap.paletteSettings.type === 'Gradient') {
                var fill = void 0;
                if (heatMap.enableCanvasRendering) {
                    var grd = void 0;
                    var ctx = heatMap.canvasRenderer.ctx;
                    if (heatMap.horizontalGradient) {
                        grd = ctx.createLinearGradient(legendBound.x, 0, legendBound.x + legendBound.width, 0);
                    }
                    else {
                        grd = ctx.createLinearGradient(0, legendBound.y, 0, legendBound.y + legendBound.height);
                    }
                    for (var i = 0; i < heatMap.legendColorCollection.length; i++) {
                        var value = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue));
                        value = isNaN(value) ? 0 : value;
                        grd.addColorStop(value, heatMap.legendColorCollection[i].color);
                    }
                    ctx.fillStyle = grd;
                    fill = grd.toString();
                }
                else {
                    var gradientOptions = void 0;
                    var gradientColor = void 0;
                    var cgradientColors = [];
                    for (var i = 0; i < heatMap.legendColorCollection.length; i++) {
                        var gradientPercentage = ((heatMap.legendColorCollection[i].value - this.legendMinValue) /
                            (this.legendMaxValue - this.legendMinValue)) * 100;
                        gradientPercentage = isNaN(gradientPercentage) ? 0 : gradientPercentage;
                        gradientColor = new GradientColor(heatMap.legendColorCollection[i].color, gradientPercentage + '%');
                        cgradientColors.push(gradientColor);
                    }
                    if (heatMap.horizontalGradient) {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '100%', '0%', '0%');
                    }
                    else {
                        gradientOptions = new Gradient(heatMap.element.id + '_lineargradient', '0%', '0%', '0%', '100%');
                    }
                    var linearGradient = heatMap.renderer.drawGradient('linearGradient', gradientOptions, cgradientColors);
                    this.legend.appendChild(linearGradient);
                    fill = 'url(#' + heatMap.element.id + '_lineargradient)';
                }
                var rectItem = new RectOption(heatMap.element.id + '_Gradient_Legend', fill, tempBorder, 1, rectItemsSvg);
                this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
                this.renderColorAxisGrid(rectItemsSvg);
            }
            else {
                this.renderSmartLegend();
            }
            if (!heatMap.enableCanvasRendering) {
                heatMap.svgObject.appendChild(this.legend);
            }
            if (heatMap.legendSettings.showLabel && (heatMap.paletteSettings.type === 'Gradient' ||
                (heatMap.paletteSettings.type === 'Fixed' && heatMap.legendSettings.labelDisplayType !== 'None'))) {
                this.renderLegendLabel(rectItemsSvg);
            }
        }
        else {
            this.legendScale = heatMap.renderer.createGroup({ id: heatMap.element.id + 'Heatmap_GradientScale' });
            var listRect = new RectOption(heatMap.element.id + '_Gradient_Scale', 'none', tempBorder, 1, this.legendRectScale);
            this.drawSvgCanvas.drawRectangle(listRect, this.legendScale);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(this.legendScale);
            }
            this.translategroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_translate' });
            this.calculateListPerPage(rectItemsSvg);
            if (this.numberOfPages > 1) {
                this.paginggroup = heatMap.renderer.createGroup({ id: heatMap.element.id + '_navigation' });
            }
            this.renderListLegendMode(rectItemsSvg);
        }
    };
    Legend.prototype.renderSmartLegend = function () {
        var heatMap = this.heatMap;
        var colorCollection = heatMap.colorCollection;
        var smartLegendRect;
        var tempBorder = {
            color: 'transparent',
            width: 0,
        };
        var legendBound = this.legendRectScale;
        var legendX;
        var legendY;
        var legendWidth;
        var legendHeight;
        var width = legendBound.width / colorCollection.length;
        var height = legendBound.height / colorCollection.length;
        this.legendRectPositionCollection = [];
        for (var i = 0; i < colorCollection.length; i++) {
            var rectPosition = new CurrentLegendRect(0, 0, 0, 0, '', '');
            if (heatMap.horizontalGradient) {
                legendX = legendBound.x + (i * width);
                legendY = legendBound.y;
                legendWidth = width;
                legendHeight = legendBound.height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === colorCollection.length - 1) ? legendX + width : legendX);
            }
            else {
                legendX = legendBound.x;
                legendY = legendBound.y + (i * height);
                legendWidth = legendBound.width;
                legendHeight = height;
                this.segmentCollections.push((heatMap.legendSettings.labelDisplayType === 'Edge' &&
                    i === colorCollection.length - 1) ? legendY + height : legendY);
            }
            smartLegendRect = new Rect(legendX, legendY, legendWidth, legendHeight);
            var rectItem = new RectOption(heatMap.element.id + '_Smart_Legend' + i, colorCollection[i].color, tempBorder, 1, smartLegendRect);
            this.drawSvgCanvas.drawRectangle(rectItem, this.legend);
            rectPosition.x = legendX;
            rectPosition.y = legendY;
            rectPosition.width = legendWidth;
            rectPosition.height = legendHeight;
            rectPosition.label = this.labelCollections[i];
            rectPosition.id = heatMap.element.id + '_Smart_Legend' + i;
            this.legendRectPositionCollection.push(rectPosition);
            var text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, this.textWrapCollections[i]);
            if (text.length !== 0 && heatMap.enableCanvasRendering) {
                var elementSize = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(rectPosition.x, rectPosition.y, elementSize.width, elementSize.height)));
            }
        }
    };
    Legend.prototype.renderLegendLabel = function (rect) {
        var heatMap = this.heatMap;
        var anchor;
        var dominantBaseline;
        var legendLabel;
        var textWrapWidth = 0;
        var text;
        this.legendLabelTooltip = [];
        var colorCollection = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        if (heatMap.enableCanvasRendering) {
            var ctx = heatMap.canvasRenderer.ctx;
            ctx.rect(this.legendGroup.x, this.legendGroup.y, this.legendGroup.width, this.legendGroup.height);
            ctx.clip();
        }
        else {
            legendLabel = heatMap.renderer.createGroup({ id: heatMap.element.id + '_Heatmap_LegendLabel' });
        }
        var labelX;
        var labelY;
        for (var i = 0; i < colorCollection.length; i++) {
            var value = ((colorCollection[i].value - this.legendMinValue) /
                (this.legendMaxValue - this.legendMinValue)) * 100;
            if (heatMap.horizontalGradient) {
                labelX = this.segmentCollections[i];
                labelY = rect.y + rect.height + this.labelPadding;
                anchor = (value === 0) || (heatMap.paletteSettings.type === 'Fixed') ?
                    (heatMap.legendSettings.labelDisplayType === 'Edge' &&
                        i === colorCollection.length - 1) ? 'end' : 'start' : (i === colorCollection.length - 1) ? 'end' : 'middle';
                dominantBaseline = 'hanging';
            }
            else {
                labelX = rect.x + rect.width + this.labelPadding;
                labelY = this.segmentCollections[i];
                dominantBaseline = (value === 0) || (heatMap.paletteSettings.type === 'Fixed') ?
                    (heatMap.legendSettings.labelDisplayType === 'Edge' &&
                        i === colorCollection.length - 1) ? 'baseline' : 'hanging' :
                    (i === colorCollection.length - 1) ? 'baseline' : 'middle';
            }
            textWrapWidth = heatMap.horizontalGradient ? this.textWrapCollections[i] : this.width - (this.legendRectScale.width +
                this.labelPadding + this.legendRectPadding);
            if (this.labelCollections[i] !== '') {
                text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                if (text.length !== 0 && text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                    var elementSize = measureText(text[0], heatMap.legendSettings.textStyle);
                    this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(labelX, labelY, elementSize.width, elementSize.height)));
                }
                var textBasic = new TextBasic(labelX, labelY, anchor, text, 0, 'translate(0,0)', dominantBaseline);
                var options = new TextOption(heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
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
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            this.legend.appendChild(legendLabel);
            var clippath = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_clipPath' });
            var clipRect = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            heatMap.svgObject.appendChild(clippath);
            this.legend.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
    };
    /**
     * @private
     */
    Legend.prototype.renderGradientPointer = function (e, pageX, pageY) {
        var heatMap = this.heatMap;
        var currentRect = heatMap.heatMapSeries.getCurrentRect(pageX, pageY);
        var cellValue = heatMap.bubbleSizeWithColor ? currentRect.value[0].bubbleData.toString() !== '' ?
            !this.heatMap.isColorValueExist ? currentRect.value[0].bubbleData.toString() :
                currentRect.value[1].bubbleData.toString() : '' : currentRect.value.toString();
        var rect = this.legendRectScale;
        var legendPart;
        var direction;
        var options;
        var legendPath;
        var pathX1;
        var pathY1;
        var pathX2;
        var pathY2;
        var pathX3;
        var pathY3;
        if (cellValue.toString() !== '') {
            if (!heatMap.horizontalGradient) {
                legendPart = rect.height / 100;
                legendPath = legendPart * ((Number(cellValue) - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
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
                var canvasTranslate = void 0;
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
    };
    /**
     * @private
     */
    Legend.prototype.removeGradientPointer = function () {
        var heatMap = this.heatMap;
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
    };
    /**
     * @private
     */
    Legend.prototype.calculateLegendBounds = function (rect) {
        var heatMap = this.heatMap;
        var legendSettings = heatMap.legendSettings;
        var colorCollection = heatMap.legendColorCollection;
        this.labelCollections = [];
        if (legendSettings.position !== 'Bottom' && legendSettings.position !== 'Top' &&
            legendSettings.position !== 'Right' && legendSettings.position !== 'Left') {
            legendSettings.position = 'Right';
        }
        heatMap.horizontalGradient = legendSettings.position === 'Bottom' || legendSettings.position === 'Top';
        this.legendRectPadding = heatMap.horizontalGradient ? 16 : 10; // padding between rect and legend
        this.labelPadding = legendSettings.showLabel ? this.heatMap.horizontalGradient ? 10 : 6 : 0; // padding between list and label
        this.legendHeight = legendSettings.height;
        this.legendWidth = legendSettings.width;
        if (heatMap.paletteSettings.type === 'Fixed') {
            var paletteCollection = heatMap.colorCollection;
            for (var i = 0; i < paletteCollection.length; i++) {
                var label = paletteCollection[i].label ? paletteCollection[i].label :
                    paletteCollection[i].value.toString();
                if (heatMap.legendSettings.enableSmartLegend && heatMap.legendSettings.labelDisplayType === 'Edge'
                    && i > 0 && i < paletteCollection.length - 1) {
                    this.labelCollections.push('');
                }
                else {
                    this.labelCollections.push(label);
                }
            }
        }
        else {
            for (var i = 0; i < colorCollection.length; i++) {
                var label = colorCollection[i].isHidden ? '' : colorCollection[i].label ?
                    colorCollection[i].label : colorCollection[i].value.toString();
                this.labelCollections.push(label);
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
            this.height = heatMap.paletteSettings.type === 'Gradient' ? this.height < 50 ? 50 : this.height : this.height;
            if (legendSettings.position === 'Top') {
                rect.y += this.height;
            }
            rect.height -= this.height;
        }
        else {
            this.width = heatMap.paletteSettings.type === 'Gradient' ? this.width < 50 ? 50 : this.width : this.width;
            if (legendSettings.position === 'Left') {
                rect.x += this.width;
            }
            rect.width -= this.width;
        }
    };
    Legend.prototype.calculateListLegendBounds = function (rect) {
        var heatMap = this.heatMap;
        this.listWidth = 0;
        this.listHeight = 0;
        this.currentPage = 1;
        var padding = 10; // padding of paging elements
        if (heatMap.horizontalGradient) {
            for (var i = 0; i < heatMap.colorCollection.length; i++) {
                var size = 0;
                if (heatMap.legendSettings.showLabel) {
                    var text = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                var perListWidth = this.legendSize + this.labelPadding + size + this.listInterval;
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
            this.listHeight = ((this.legendSize + this.listInterval) * heatMap.colorCollection.length) + this.listInterval;
            if (this.legendHeight === '') {
                this.legendHeight = this.listHeight > rect.height ? rect.height.toString() : this.listHeight.toString();
            }
            if (this.legendWidth === '' && heatMap.legendSettings.textStyle.textOverflow !== 'Trim') {
                this.maxLegendLabelSize = this.getMaxLabelSize();
                this.legendWidth = ((2 * this.legendRectPadding) + this.legendSize + this.labelPadding +
                    this.maxLegendLabelSize.width).toString();
            }
        }
        if (stringToNumber(this.legendHeight, rect.height) < 50) {
            this.legendHeight = '50';
        }
        if (stringToNumber(this.legendWidth, rect.width) < 70) {
            this.legendWidth = '70';
        }
    };
    Legend.prototype.getMaxLabelSize = function () {
        var heatMap = this.heatMap;
        this.maxLegendLabelSize = new Size(0, 0);
        if (!heatMap.legendSettings.showLabel || (heatMap.horizontalGradient && heatMap.paletteSettings.type === 'Fixed' &&
            !heatMap.legendSettings.enableSmartLegend) || (heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.labelDisplayType === 'None')) {
            return this.maxLegendLabelSize;
        }
        else {
            var labelSize = this.maxLegendLabelSize;
            for (var i = 0; i < heatMap.colorCollection.length; i++) {
                var size = measureText(this.labelCollections[i], heatMap.legendSettings.textStyle);
                labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
                labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
            }
            return labelSize;
        }
    };
    /**
     * @private
     */
    Legend.prototype.calculateLegendSize = function (rect, legendTop) {
        var heatMap = this.heatMap;
        var legendSettings = heatMap.legendSettings;
        var left;
        var top;
        var padding = 10; // inner padding for axis title and axil labels
        var alignment = legendSettings.alignment;
        var height = stringToNumber(this.legendHeight, rect.height);
        var width = stringToNumber(this.legendWidth, rect.width);
        var axis = heatMap.axisCollections;
        var axisTitlePadding = 0;
        if (heatMap.horizontalGradient) {
            width = width > rect.width ? rect.width : width;
            height = heatMap.paletteSettings.type === 'Gradient' ? height > 50 ? height : 50 : this.height;
            left = alignment === 'Near' ? rect.x : alignment === 'Far' ? rect.x + rect.width - width :
                rect.x + (rect.width / 2) - (width / 2);
            if (heatMap.xAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.xAxis.title.text, heatMap.xAxis.textStyle).height + padding;
            }
            var axisHeight = axis[0].opposedPosition ? 0 : axis[0].maxLabelSize.height + axisTitlePadding + padding;
            top = legendSettings.position === 'Top' ? heatMap.titleSettings.text ? legendTop :
                heatMap.margin.top : rect.y + rect.height + axisHeight;
        }
        else {
            height = height > rect.height ? rect.height : height;
            width = heatMap.paletteSettings.type === 'Gradient' ? width > 50 ? width : 50 : width;
            top = alignment === 'Near' ? rect.y : alignment === 'Far' ? rect.y + rect.height - height :
                rect.y + (rect.height / 2) - (height / 2);
            if (heatMap.yAxis.title.text !== '') {
                axisTitlePadding = measureText(heatMap.yAxis.title.text, heatMap.yAxis.textStyle).height + padding;
            }
            var axisWidth = axis[1].opposedPosition ? axis[1].maxLabelSize.width + axisTitlePadding + padding : 0;
            left = legendSettings.position === 'Right' ? rect.x + rect.width + axisWidth : heatMap.margin.left;
        }
        this.legendGroup = new Rect(left, top, width, height);
        this.calculateGradientScale(this.legendGroup);
    };
    // calculating number of lists per page
    Legend.prototype.measureListLegendBound = function (rect) {
        var heatMap = this.heatMap;
        var padding = 15; // padding of paging element
        this.numberOfPages = 1;
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
                var maxHeight = stringToNumber(this.legendHeight, rect.height);
                maxHeight = maxHeight > rect.height ? rect.height : maxHeight;
                this.listPerPage = Math.floor(maxHeight / (this.legendSize + this.listInterval) - 1);
                this.numberOfPages = Math.max(1, Math.ceil(heatMap.colorCollection.length / this.listPerPage));
            }
            else {
                this.listPerPage = heatMap.colorCollection.length;
                this.legendHeight = this.listHeight.toString();
            }
        }
    };
    Legend.prototype.renderPagingElements = function () {
        var heatMap = this.heatMap;
        if (this.numberOfPages > 1) {
            this.navigationCollections = [];
            this.legend.appendChild(this.paginggroup);
            var iconSize = 10;
            var rightArrowX = this.legendGroup.x + this.legendGroup.width - iconSize;
            var rightArrowY = this.legendGroup.y + this.legendGroup.height - iconSize;
            var text = this.currentPage + '/' + this.numberOfPages;
            var textSize = measureText(text, heatMap.legendSettings.textStyle);
            var textX = rightArrowX - textSize.width - 15;
            var textBasic = new TextBasic(textX, rightArrowY, 'start', text, 0, 'translate(0,0)', 'middle');
            var options = new TextOption(heatMap.element.id + '_paging', textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
            this.drawSvgCanvas.createText(options, this.paginggroup, text);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                this.paginggroup.lastChild.setAttribute('dy', '0.6ex');
            }
            this.pagingRect = new Rect(textX, rightArrowY - textSize.height / 2, textSize.width, textSize.height);
            var pagingTextRect = new RectOption(heatMap.element.id + '_pagingText', 'none', { color: 'transparent', width: 0 }, 1, this.pagingRect);
            this.drawSvgCanvas.drawRectangle(pagingTextRect, this.paginggroup);
            var rightArrowRect = new RectOption(heatMap.element.id + '_rightArrow', 'none', { color: 'transparent', width: 0 }, 1, new Rect(rightArrowX - iconSize, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(rightArrowRect, this.paginggroup);
            var rightArrow = 'M' + ' ' + (rightArrowX) + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (rightArrowX - iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (rightArrowX - iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            var leftX = textX - 15;
            var leftArrow = 'M' + ' ' + leftX + ' ' + rightArrowY + ' ' +
                'L' + ' ' + (leftX + iconSize) + ' ' + (rightArrowY - iconSize / 2) + ' ' + 'L' + ' ' +
                (leftX + iconSize) + ' ' + (rightArrowY + (iconSize / 2)) + 'Z';
            var leftArrowRect = new RectOption(heatMap.element.id + '_leftArrow', 'none', { color: 'transparent', width: 0 }, 1, new Rect(leftX, rightArrowY - iconSize / 2, iconSize, iconSize));
            this.drawSvgCanvas.drawRectangle(leftArrowRect, this.paginggroup);
            var leftOption = new PathOption(heatMap.element.id + '_Legend_leftarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', leftArrow);
            var rightOption = new PathOption(heatMap.element.id + '_Legend_rightarrow', 'gray', 0.01, '#A0A0A0', 1, '0,0', rightArrow);
            this.navigationCollections.push(rightArrowRect);
            this.navigationCollections.push(leftArrowRect);
            if (!heatMap.enableCanvasRendering) {
                var arrow = heatMap.renderer.drawPath(leftOption);
                var rightarrow = heatMap.renderer.drawPath(rightOption);
                this.paginggroup.appendChild(arrow);
                this.paginggroup.appendChild(rightarrow);
            }
            else {
                var canvasTranslate = void 0;
                heatMap.canvasRenderer.drawPath(leftOption, canvasTranslate);
                heatMap.canvasRenderer.drawPath(rightOption, canvasTranslate);
            }
        }
    };
    Legend.prototype.calculateGradientScale = function (scale) {
        var heatMap = this.heatMap;
        var padding = 10; // padding between legend bounds and gradient scale
        var left;
        var top;
        var height;
        var width;
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
            top = scale.y + padding;
            width = (heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend) ?
                scale.width - padding : this.gradientScaleSize;
            height = heatMap.paletteSettings.type === 'Fixed' && !heatMap.legendSettings.enableSmartLegend ?
                (this.legendSize + this.listInterval) * this.listPerPage - this.listInterval : scale.height - 2 * padding;
        }
        this.legendRectScale = new Rect(left, top, width, height);
        if (heatMap.paletteSettings.type === 'Gradient' || heatMap.paletteSettings.type === 'Fixed' &&
            heatMap.legendSettings.enableSmartLegend) {
            this.calculateColorAxisGrid(this.legendRectScale);
        }
    };
    Legend.prototype.calculateColorAxisGrid = function (legendRect) {
        var heatMap = this.heatMap;
        var rect = this.legendRectScale;
        var legendPart;
        var text;
        var maxTextWrapLength = 0;
        this.segmentCollections = [];
        this.textWrapCollections = [];
        var pathX1;
        var pathY1;
        var colorCollection = heatMap.paletteSettings.type === 'Gradient' ?
            heatMap.legendColorCollection : heatMap.colorCollection;
        var minValue = heatMap.bubbleSizeWithColor ? heatMap.minColorValue : heatMap.dataSourceMinValue;
        var maxValue = heatMap.bubbleSizeWithColor ? heatMap.maxColorValue : heatMap.dataSourceMaxValue;
        this.legendMinValue = colorCollection[0].value > minValue ? minValue : colorCollection[0].value;
        this.legendMaxValue = colorCollection[colorCollection.length - 1].value < maxValue ? maxValue :
            colorCollection[colorCollection.length - 1].value;
        if (heatMap.paletteSettings.type === 'Gradient') {
            for (var index = 0; index < colorCollection.length; index++) {
                var value = ((colorCollection[index].value - this.legendMinValue) /
                    (this.legendMaxValue - this.legendMinValue)) * 100;
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
        var textWrapWidth;
        if (heatMap.horizontalGradient) {
            for (var i = 0; i < colorCollection.length; i++) {
                if (heatMap.paletteSettings.type === 'Gradient') {
                    var previousSegmentWidth = (this.segmentCollections[i] - this.segmentCollections[i - 1]) / 2;
                    var nextSegmentWidth = (this.segmentCollections[i + 1] - this.segmentCollections[i]) / 2;
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
                    textWrapWidth = this.legendRectScale.width / heatMap.colorCollection.length;
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
    };
    Legend.prototype.renderColorAxisGrid = function (legendRect) {
        var heatMap = this.heatMap;
        var legendElement;
        var pathX1;
        var pathY1;
        var pathX2;
        var pathY2;
        if (!heatMap.enableCanvasRendering) {
            legendElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + '_ColorAxis_Grid' });
        }
        for (var i = 0; i < heatMap.legendColorCollection.length; i++) {
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
            var direction = new Line(pathX1, pathY1, pathX2, pathY2);
            var line = new LineOption(this.heatMap.element.id + '_ColorAxis_Grid' + i, direction, '#EEEEEE', 1);
            this.drawSvgCanvas.drawLine(line, legendElement);
            if (!heatMap.enableCanvasRendering) {
                this.legend.appendChild(legendElement);
            }
        }
    };
    /**
     * @private
     */
    Legend.prototype.renderLegendLabelTooltip = function (e) {
        var x = this.heatMap.mouseX;
        var y = this.heatMap.mouseY;
        if (e.target.id.indexOf('_Legend_Label') !== -1 && event.target.textContent.indexOf('...') > -1) {
            var targetId = event.target.id.split(this.heatMap.element.id + '_Legend_Label');
            if (targetId.length === 2) {
                var index = void 0;
                if (targetId[1].length === 1 || this.heatMap.legendSettings.textStyle.textOverflow === 'Trim') {
                    index = parseInt(targetId[1], 10);
                }
                else {
                    index = parseInt(targetId[1].substring(0, targetId[1].length - 1), 10);
                }
                showTooltip(this.labelCollections[index], x, y, this.heatMap.element.offsetWidth, this.heatMap.element.id + '_LegendLabel_Tooltip', getElement(this.heatMap.element.id + '_Secondary_Element'), null, this.heatMap);
                document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip').style.visibility = 'visible';
            }
        }
        else {
            var element = document.getElementById(this.heatMap.element.id + '_LegendLabel_Tooltip');
            if (element) {
                element.style.visibility = 'hidden';
            }
        }
    };
    Legend.prototype.calculateListPerPage = function (rect) {
        var heatMap = this.heatMap;
        if (heatMap.horizontalGradient) {
            this.lastList = [];
            var legendX = rect.x;
            var legendY = rect.y;
            var size = 0;
            var division = 0;
            var labelX = 0;
            var labelY = 0;
            var interval = 20;
            var i = void 0;
            var legendSize = 10;
            var padding = 5;
            this.labelXCollections = [];
            this.labelYCollections = [];
            this.legendXCollections = [];
            this.legendYCollections = [];
            for (i = 0; i < heatMap.colorCollection.length; i++) {
                if (heatMap.legendSettings.showLabel) {
                    var text = this.labelCollections[i];
                    size = measureText(text, heatMap.legendSettings.textStyle).width;
                }
                labelX = legendX + legendSize + padding;
                labelY = legendY + padding;
                var maxWidth = heatMap.legendSettings.showLabel ? labelX + size : legendX + this.legendSize + this.listInterval;
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
    };
    Legend.prototype.renderListLegendMode = function (rect) {
        var heatMap = this.heatMap;
        var legendSize = 10;
        var tempBorder = {
            color: 'transparent',
            width: 0,
        };
        var padding = 5; // padding for legend label from top
        this.legendLabelTooltip = [];
        var listRect;
        var size = new Size(0, 0);
        var labelX = 0;
        var labelY = 0;
        var legendX = rect.x;
        var legendY = rect.y;
        this.renderPagingElements();
        var x;
        var y;
        var textWrapWidth = this.legendGroup.width - (this.legendSize +
            this.legendRectPadding + this.labelPadding);
        if (!heatMap.horizontalGradient) {
            x = (this.currentPage * (this.listPerPage)) - (this.listPerPage);
            y = x + this.listPerPage;
            y = y < heatMap.colorCollection.length ? y : heatMap.colorCollection.length;
        }
        else {
            x = this.currentPage === 1 ? 0 : this.lastList[this.currentPage - 2];
            y = this.lastList[this.currentPage - 1];
        }
        for (var i = x; i < y; i++) {
            if (heatMap.legendSettings.showLabel) {
                var text = this.labelCollections[i];
                size = measureText(text, heatMap.legendSettings.textStyle);
            }
            if (heatMap.horizontalGradient) {
                legendX = this.legendXCollections[i];
                legendY = this.legendYCollections[i];
                labelX = this.labelXCollections[i];
                labelY = this.labelYCollections[i];
            }
            if (heatMap.legendSettings.showLabel) {
                labelX = legendX + this.legendSize + this.labelPadding;
                labelY = legendY + padding;
                var text = getTitle(this.labelCollections[i], heatMap.legendSettings.textStyle, textWrapWidth);
                if (text[0].indexOf('...') !== -1 && heatMap.enableCanvasRendering) {
                    this.legendLabelTooltip.push(new CanvasTooltip(this.labelCollections[i], new Rect(labelX, labelY, size.width, size.height)));
                }
                var textBasic = new TextBasic(labelX, labelY, 'start', text, 0, 'translate(0,0)', 'middle');
                var options = new TextOption(heatMap.element.id + '_Legend_Label' + i, textBasic, heatMap.legendSettings.textStyle, heatMap.legendSettings.textStyle.color || heatMap.themeStyle.legendLabel);
                if (text.length > 1) {
                    this.drawSvgCanvas.createWrapText(options, heatMap.legendSettings.textStyle, this.translategroup);
                }
                else {
                    this.drawSvgCanvas.createText(options, this.translategroup, text[0]);
                }
                if (Browser.isIE && !heatMap.enableCanvasRendering) {
                    this.translategroup.lastChild.setAttribute('dy', '0.6ex');
                }
            }
            listRect = new Rect(legendX, legendY, legendSize, legendSize);
            var rectItems = new RectOption(heatMap.element.id + '_legend_list' + i, heatMap.colorCollection[i].color, tempBorder, 1, listRect);
            this.drawSvgCanvas.drawRectangle(rectItems, this.translategroup);
            heatMap.horizontalGradient ? legendX = legendX + this.legendSize + this.labelPadding + size.width + this.listInterval :
                legendY += this.legendSize + this.listInterval;
        }
        if (!heatMap.enableCanvasRendering) {
            this.legendGroup.height = this.legendGroup.height > 0 ? this.legendGroup.height : 0;
            this.legendGroup.width = this.legendGroup.width > 0 ? this.legendGroup.width : 0;
            var clippath = heatMap.renderer.createClipPath({ id: heatMap.element.id + '_LegendScale_ClipPath' });
            var clipRect = heatMap.renderer.drawRectangle(this.legendGroup);
            clippath.appendChild(clipRect);
            this.translategroup.appendChild(clippath);
            this.translategroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
            this.legendScale.appendChild(this.translategroup);
            heatMap.svgObject.appendChild(this.legend);
        }
    };
    /**
     * @private
     */
    Legend.prototype.translatePage = function (heatMap, page, isNext) {
        var padding = 5;
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
                var ctx = heatMap.canvasRenderer.ctx;
                ctx.fillRect(this.legendRectScale.x - padding, this.legendRectScale.y - padding, this.legendRectScale.width +
                    padding, this.legendRectScale.height + (2 * padding));
                ctx.fillRect(this.pagingRect.x, this.pagingRect.y, this.pagingRect.width, this.pagingRect.height);
            }
            this.renderListLegendMode(this.legendRectScale);
        }
    };
    /**
     * To create div container for tooltip which appears on hovering the smart legend.
     * @param heatmap
     * @private
     */
    Legend.prototype.createTooltipDiv = function (heatMap) {
        var element = createElement('div', {
            id: this.heatMap.element.id + 'legendLabelTooltipContainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(element);
    };
    /**
     * To render tooltip for smart legend.
     * @private
     */
    Legend.prototype.renderTooltip = function (currentLegendRect) {
        var heatMap = this.heatMap;
        var tempTooltipText = [currentLegendRect.label];
        var offset = null;
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
    };
    /**
     * To create tooltip for smart legend.
     * @private
     */
    Legend.prototype.createTooltip = function (pageX, pageY) {
        var currentLegendRect;
        for (var i = 0; i < this.heatMap.colorCollection.length; i++) {
            var position = this.legendRectPositionCollection[i];
            if (pageX > position.x && pageX < position.width + position.x &&
                pageY > position.y && pageY < position.height + position.y) {
                currentLegendRect = this.legendRectPositionCollection[i];
                break;
            }
        }
        var ele = document.getElementById(this.heatMap.element.id + 'legendLabelTooltipContainer');
        if (ele && ele.style.visibility === 'visible' && this.tooltipObject && !this.heatMap.isTouch) {
            this.tooltipObject.fadeOut();
            ele.style.visibility = 'hidden';
        }
        if (currentLegendRect) {
            this.renderTooltip(currentLegendRect);
        }
    };
    return Legend;
}());

/**
 * Heat Map Component
 */
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HeatMap = /** @__PURE__ @class */ (function (_super) {
    __extends(HeatMap, _super);
    function HeatMap() {
        /**
         * The width of the heatmap as a string accepts input as both like '100px' or '100%'.
         * If specified as '100%, heatmap renders to the full width of its parent element.
         * @default null
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.enableCanvasRendering = false;
        /** @private */
        _this.horizontalGradient = _this.legendSettings.position === 'Bottom' || _this.legendSettings.position === 'Top';
        /**
         * @private
         */
        _this.tooltipCollection = [];
        /**
         * @private
         */
        _this.isCellData = false;
        return _this;
    }
    HeatMap.prototype.preRender = function () {
        this.initPrivateVariable();
        this.unWireEvents();
        this.wireEvents();
    };
    HeatMap.prototype.initPrivateVariable = function () {
        this.renderer = new SvgRenderer(this.element.id);
        this.canvasRenderer = new CanvasRenderer(this.element.id);
        this.heatMapAxis = new AxisHelper(this);
        this.heatMapSeries = new Series(this);
        this.drawSvgCanvas = new DrawSvgCanvas(this);
        this.twoDimensional = new TwoDimensional(this);
        this.cellColor = new CellColor(this);
        this.tempRectHoverClass = '';
        this.tempTooltipRectId = '';
        this.setCulture();
    };
    /**
     * Method to set culture for heatmap
     */
    HeatMap.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    HeatMap.prototype.render = function () {
        this.updateBubbleHelperProperty();
        this.trigger('load', { heatmap: this });
        this.processInitData();
        this.setTheme();
        this.initAxis();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.createSvg();
        this.cellColor.getColorCollection();
        this.calculateBounds();
        this.renderElements();
        this.element.appendChild(this.svgObject);
        if (this.tooltipModule) {
            this.tooltipModule.showHideTooltip(false);
        }
        this.trigger('created', { heatmap: this });
    };
    /**
     * To re-calculate the datasource while changing datasource property dynamically.
     * @private
     */
    HeatMap.prototype.reRenderDatasource = function () {
        this.dataSourceMinValue = null;
        this.dataSourceMaxValue = null;
        this.processInitData();
        this.calculateMaxLength();
        this.heatMapAxis.calculateVisibleLabels();
        this.twoDimensional.processDataSource(this.completeAdaptDataSource);
        this.cellColor.getColorCollection();
        this.calculateBounds();
    };
    /**
     * To process datasource property.
     * @private
     */
    HeatMap.prototype.processInitData = function () {
        if (this.adaptorModule) {
            this.adaptorModule.constructDatasource(this.dataSource);
        }
        else {
            this.completeAdaptDataSource = this.dataSource;
        }
    };
    /**
     * To set render mode of heatmap as SVG or Canvas.
     * @private
     */
    HeatMap.prototype.setRenderMode = function () {
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
    };
    /**
     * To set bubble helper private property.
     * @private
     */
    HeatMap.prototype.updateBubbleHelperProperty = function () {
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
    };
    HeatMap.prototype.renderElements = function () {
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
    };
    /**
     * Get component name
     */
    HeatMap.prototype.getModuleName = function () {
        return 'heatmap';
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    HeatMap.prototype.getPersistData = function () {
        return '';
    };
    HeatMap.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'renderingMode':
                    renderer = true;
                    break;
                case 'cellSettings':
                    this.updateBubbleHelperProperty();
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'showTooltip':
                    refreshBounds = true;
                    break;
                case 'dataSource':
                    this.isCellData = false;
                    this.updateBubbleHelperProperty();
                    this.reRenderDatasource();
                    renderer = true;
                    break;
                case 'titleSettings':
                case 'width':
                case 'height':
                case 'margin':
                case 'legendSettings':
                    refreshBounds = true;
                    break;
                case 'yAxis':
                case 'xAxis':
                    this.reRenderDatasource();
                    refreshBounds = true;
                    break;
                case 'paletteSettings':
                    this.cellColor.getColorCollection();
                    this.calculateBounds();
                    renderer = true;
                    break;
                case 'theme':
                    this.setTheme();
                    renderer = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.createSvg();
            this.renderElements();
            this.element.appendChild(this.svgObject);
            this.trigger('created', { heatmap: this });
        }
        else if (refreshBounds) {
            this.createSvg();
            this.refreshBound();
            this.element.appendChild(this.svgObject);
            this.trigger('created', { heatmap: this });
        }
    };
    HeatMap.prototype.createSvg = function () {
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
        }
    };
    /**
     *  To Remove the SVG.
     * @private
     */
    HeatMap.prototype.removeSvg = function () {
        if (document.getElementById(this.element.id + '_Secondary_Element')) {
            remove(document.getElementById(this.element.id + '_Secondary_Element'));
        }
        if (document.getElementById(this.element.id + 'Celltooltipcontainer')) {
            remove(document.getElementById(this.element.id + 'Celltooltipcontainer'));
        }
        if (document.getElementById(this.element.id + 'legendLabelTooltipContainer')) {
            remove(document.getElementById(this.element.id + 'legendLabelTooltipContainer'));
        }
        if (this.svgObject) {
            var svgElement = document.getElementById(this.svgObject.id);
            if (svgElement) {
                while (this.svgObject.childNodes.length) {
                    this.svgObject.removeChild(this.svgObject.firstChild);
                }
                remove(this.svgObject);
            }
        }
    };
    HeatMap.prototype.renderSecondaryElement = function () {
        var tooltipDiv = this.createElement('div');
        tooltipDiv.id = this.element.id + '_Secondary_Element';
        tooltipDiv.setAttribute('style', 'position: relative');
        this.element.appendChild(tooltipDiv);
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return{ModuleDeclaration[]}
     * @private
     */
    HeatMap.prototype.requiredModules = function () {
        var modules = [];
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
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of Heatmap
     */
    HeatMap.prototype.destroy = function () {
        this.unWireEvents();
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        this.element.classList.remove('e-heatmap');
    };
    /**
     * Applies all the pending property changes and render the component again.
     * @method destroy
     * @return {void}.
     */
    HeatMap.prototype.refresh = function () {
        _super.prototype.refresh.call(this);
        this.element.classList.add('e-heatmap');
    };
    HeatMap.prototype.renderBorder = function () {
        this.border = {
            width: 0
        };
        var width = 0;
        var rect = new RectOption(this.element.id + '_HeatmapBorder', this.themeStyle.background, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
        this.drawSvgCanvas.drawRectangle(rect, this.svgObject);
    };
    HeatMap.prototype.calculateSize = function () {
        var width = stringToNumber(this.width, this.element.offsetWidth) || this.element.offsetWidth || 600;
        var height = stringToNumber(this.height, this.element.offsetHeight) || this.element.offsetHeight || 450;
        this.availableSize = new Size(width, height);
    };
    HeatMap.prototype.renderTitle = function () {
        if (this.titleSettings.text) {
            var titleStyle = this.titleSettings.textStyle;
            var anchor = titleStyle.textAlignment === 'Near' ? 'start' :
                titleStyle.textAlignment === 'Far' ? 'end' : 'middle';
            this.elementSize = measureText(this.titleCollection[0], titleStyle);
            var options = new TextOption(this.element.id + '_HeatmapTitle', new TextBasic(titlePositionX(this.availableSize.width - this.margin.left - this.margin.right, this.margin.left, this.margin.right, titleStyle), this.margin.top + ((this.elementSize.height) * 3 / 4), anchor, this.titleCollection), titleStyle, titleStyle.color || this.themeStyle.heatMapTitle);
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
    };
    HeatMap.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        if ((targetId === (this.element.id + '_HeatmapTitle')) && (event.target.textContent.indexOf('...') > -1)) {
            showTooltip(this.titleSettings.text, x, y, this.element.offsetWidth, this.element.id + '_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch, this);
        }
        else {
            removeElement(this.element.id + '_Title_Tooltip');
        }
    };
    HeatMap.prototype.axisTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        if ((targetId.indexOf(this.element.id + '_XAxis_Label') !== -1) && (event.target.textContent.indexOf('...') > -1)) {
            var index = parseInt(targetId.replace(this.element.id + '_XAxis_Label', ''), 10);
            showTooltip(this.axisCollections[0].axisLabels[index], x, y, this.element.offsetWidth, this.element.id + '_axis_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch, this);
        }
        else {
            removeElement(this.element.id + '_axis_Tooltip');
        }
    };
    HeatMap.prototype.isHeatmapRect = function (x, y) {
        var firstRectDetails = [];
        var lastRectDetails = [];
        var isRect;
        firstRectDetails.push(this.heatMapSeries.rectPositionCollection[0][0]);
        lastRectDetails.push(this.heatMapSeries.rectPositionCollection[this.yLength - 1][this.xLength - 1]);
        isRect = (x >= firstRectDetails[0].x && y >= firstRectDetails[0].y &&
            x <= (lastRectDetails[0].x + lastRectDetails[0].width) &&
            y <= (lastRectDetails[0].y + lastRectDetails[0].height)) ? true : false;
        return isRect;
    };
    HeatMap.prototype.setTheme = function () {
        /*! Set theme */
        this.themeStyle = getThemeColor(this.theme);
    };
    HeatMap.prototype.calculateBounds = function () {
        var margin = this.margin;
        // Title Height;
        var titleHeight = 0;
        var padding = (this.legendModule && this.legendSettings.position === 'Top'
            && this.legendVisibilityByCellType) || this.titleSettings.textStyle.size === '0px' ? 0 : 16; // title padding
        var left = margin.left;
        var width = this.availableSize.width - left - margin.right;
        if (this.titleSettings.text) {
            this.titleCollection = getTitle(this.titleSettings.text, this.titleSettings.textStyle, width);
            titleHeight = (measureText(this.titleSettings.text, this.titleSettings.textStyle).height * this.titleCollection.length) +
                padding;
        }
        var top = margin.top + titleHeight;
        var height = this.availableSize.height - top - margin.bottom;
        this.initialClipRect = new Rect(left, top, width, height);
        var legendTop = this.initialClipRect.y;
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendBounds(this.initialClipRect);
        }
        this.heatMapAxis.measureAxis(this.initialClipRect);
        if (this.legendModule && this.legendSettings.visible && this.legendVisibilityByCellType) {
            this.legendModule.calculateLegendSize(this.initialClipRect, legendTop);
        }
        this.heatMapAxis.calculateAxisSize(this.initialClipRect);
    };
    HeatMap.prototype.refreshBound = function () {
        this.updateBubbleHelperProperty();
        this.calculateBounds();
        this.renderElements();
    };
    HeatMap.prototype.initAxis = function () {
        var axis;
        var axes = [this.xAxis, this.yAxis];
        this.axisCollections = [];
        for (var i = 0, len = axes.length; i < len; i++) {
            axis = axes[i];
            axis.orientation = (i === 0) ? 'Horizontal' : 'Vertical';
            this.axisCollections.push(axis);
        }
    };
    /**
     * Method to bind events for HeatMap
     */
    HeatMap.prototype.wireEvents = function () {
        /*! Find the Events type */
        var isIE11Pointer = Browser.isPointer;
        var start = Browser.touchStartEvent;
        var stop = Browser.touchEndEvent;
        var move = Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.add(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick, this);
        EventHandler.add(this.element, start, this.heatMapMouseMove, this);
        EventHandler.add(this.element, stop, this.heatMapMouseLeave, this);
        EventHandler.add(this.element, move, this.heatMapMouseMove, this);
        EventHandler.add(this.element, cancel, this.heatMapMouseLeave, this);
        window.addEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.heatMapResize.bind(this));
        this.setStyle(this.element);
    };
    /**
     * Applying styles for heatmap element
     */
    HeatMap.prototype.setStyle = function (element) {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    };
    /**
     * Method to unbind events for HeatMap
     */
    HeatMap.prototype.unWireEvents = function () {
        /*! Find the Events type */
        var isIE11Pointer = Browser.isPointer;
        var start = Browser.touchStartEvent;
        var stop = Browser.touchEndEvent;
        var move = Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        EventHandler.remove(this.element, Browser.isDevice ? start : 'click', this.heatMapMouseClick);
        EventHandler.remove(this.element, start, this.heatMapMouseMove);
        EventHandler.remove(this.element, move, this.heatMapMouseLeave);
        EventHandler.remove(this.element, move, this.heatMapMouseMove);
        EventHandler.remove(this.element, cancel, this.heatMapMouseLeave);
        window.removeEventListener((Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.heatMapResize);
    };
    /**
     * Handles the heatmap resize.
     * @return {boolean}
     * @private
     */
    HeatMap.prototype.heatMapResize = function (e) {
        var _this = this;
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTimer);
                return;
            }
            _this.createSvg();
            _this.refreshBound();
            _this.element.appendChild(_this.svgObject);
        }, 500);
        return false;
    };
    /**
     * Get the maximum length of data source for both horizontal and vertical
     * @private
     */
    HeatMap.prototype.calculateMaxLength = function () {
        var dataSource = this.completeAdaptDataSource;
        if (dataSource && dataSource.length > 0) {
            var xAxisMax = dataSource.length - 1;
            var yAxisMax = 0;
            for (var i = 0; i <= xAxisMax; i++) {
                var length_1 = dataSource[i].length;
                yAxisMax = yAxisMax > length_1 ? yAxisMax : length_1;
            }
            this.axisCollections[0].maxLength = xAxisMax;
            this.axisCollections[1].maxLength = yAxisMax - 1;
        }
        else {
            this.axisCollections[0].maxLength = 0;
            this.axisCollections[1].maxLength = 0;
        }
    };
    /**
     * To find mouse x, y for aligned heatmap element svg position
     */
    HeatMap.prototype.setMouseXY = function (pageX, pageY) {
        var rect = this.element.getBoundingClientRect();
        var svgCanvasRect;
        if (this.enableCanvasRendering) {
            svgCanvasRect = document.getElementById(this.element.id + '_canvas').getBoundingClientRect();
        }
        else {
            svgCanvasRect = document.getElementById(this.element.id + '_svg').getBoundingClientRect();
        }
        this.mouseX = (pageX - rect.left) - Math.max(svgCanvasRect.left - rect.left, 0);
        this.mouseY = (pageY - rect.top) - Math.max(svgCanvasRect.top - rect.top, 0);
    };
    HeatMap.prototype.heatMapMouseClick = function (e) {
        var pageX;
        var pageY;
        var touchArg;
        var elementRect = this.element.getBoundingClientRect();
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
        var isheatmapRect = this.isHeatmapRect(pageX, pageY);
        if (isheatmapRect) {
            var currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
            this.trigger('cellClick', {
                heatmap: this,
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
            var page = this.legendModule.navigationCollections;
            if (page.length && pageX > page[0].x && pageX < page[0].x + page[0].width &&
                pageY > page[0].y && pageY < page[0].y + page[0].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, true);
            }
            else if (page.length && pageX > page[1].x && pageX < page[1].x + page[1].width &&
                pageY > page[1].y && pageY < page[1].y + page[1].height) {
                this.legendModule.translatePage(this, this.legendModule.currentPage, false);
            }
        }
        return false;
    };
    /**
     * Handles the mouse Move.
     * @return {boolean}
     * @private
     */
    HeatMap.prototype.heatMapMouseMove = function (e) {
        var _this = this;
        var pageX;
        var pageY;
        var tooltipText;
        var touchArg;
        var elementRect = this.element.getBoundingClientRect();
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
            var isheatmapRect = this.isHeatmapRect(pageX, pageY);
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
            }
            var isshowTooltip = void 0;
            isshowTooltip = this.showTooltip && this.tooltipModule ? this.isHeatmapRect(pageX, pageY) : false;
            if (isshowTooltip) {
                var currentRect = void 0;
                currentRect = this.heatMapSeries.getCurrentRect(pageX, pageY);
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
                            this.tooltipTimer = setTimeout(function () {
                                _this.tooltipModule.tooltipObject.fadeOut();
                                _this.tooltipModule.isFadeout = true;
                            }, 1500);
                            if (e.type === 'touchmove') {
                                e.preventDefault();
                            }
                        }
                    }
                    this.tempTooltipRectId = currentRect.id;
                }
            }
            else {
                if (e.target.id.indexOf('Celltooltip') === -1) {
                    if ((this.cellSettings.enableCellHighlighting || this.showTooltip) && !this.enableCanvasRendering) {
                        this.heatMapSeries.highlightSvgRect(e.target.id);
                    }
                    if (this.tooltipModule && this.showTooltip) {
                        this.tooltipModule.showHideTooltip(false, true);
                    }
                }
                this.tempTooltipRectId = '';
            }
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
                    this.legendModule.renderLegendLabelTooltip(e);
                }
            }
            else {
                elementRect = this.element.getBoundingClientRect();
                var tooltipRect = (this.paletteSettings.type === 'Fixed' && this.legendSettings.enableSmartLegend &&
                    this.legendSettings.labelDisplayType === 'None') ? false : true;
                tooltipText = getTooltipText(this.tooltipCollection, pageX, pageY) ||
                    (this.legendModule && tooltipRect && getTooltipText(this.legendModule.legendLabelTooltip, pageX, pageY));
                if (tooltipText) {
                    showTooltip(tooltipText, this.mouseX, this.mouseY, this.element.offsetWidth, this.element.id + '_canvas_Tooltip', getElement(this.element.id + '_Secondary_Element'), this.isTouch, this);
                }
                else {
                    removeElement(this.element.id + '_canvas_Tooltip');
                }
            }
        }
        return true;
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    HeatMap.prototype.heatMapMouseLeave = function (e) {
        var _this = this;
        if (e.target && e.target.id &&
            (this.cellSettings.enableCellHighlighting || (this.tooltipModule && this.showTooltip))
            && !this.enableCanvasRendering) {
            this.heatMapSeries.highlightSvgRect(this.tempTooltipRectId);
        }
        if (this.tooltipModule && this.showTooltip && e.type === 'mouseleave') {
            this.tooltipModule.showHideTooltip(false);
        }
        this.tempTooltipRectId = '';
        if (this.legendModule && this.legendSettings.visible && this.legendModule.tooltipObject &&
            this.legendModule.tooltipObject.element) {
            var tooltipElement_1 = this.legendModule.tooltipObject.element.firstChild;
            if (e.type === 'mouseleave') {
                tooltipElement_1.setAttribute('opacity', '0');
            }
            else {
                if (this.legendTooltipTimer) {
                    window.clearTimeout(this.legendTooltipTimer);
                }
                this.legendTooltipTimer = setTimeout(function () {
                    tooltipElement_1.setAttribute('opacity', '0');
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
                this.gradientTimer = setTimeout(function () { _this.legendModule.removeGradientPointer(); }, 1500);
            }
        }
        if (this.enableCanvasRendering) {
            var main = document.getElementById(this.element.id + '_hoverRect_canvas');
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
        Property('SVG')
    ], HeatMap.prototype, "renderingMode", void 0);
    __decorate([
        Property(null)
    ], HeatMap.prototype, "dataSource", void 0);
    __decorate([
        Property('Material')
    ], HeatMap.prototype, "theme", void 0);
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
    HeatMap = __decorate([
        NotifyPropertyChanges
    ], HeatMap);
    return HeatMap;
}(Component));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the Adaptor Property in the Heatmap.
 */
var Data = /** @__PURE__ @class */ (function (_super) {
    __extends$7(Data, _super);
    function Data() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$6([
        Property(null)
    ], Data.prototype, "data", void 0);
    __decorate$6([
        Property(false)
    ], Data.prototype, "isJsonData", void 0);
    __decorate$6([
        Property('cell')
    ], Data.prototype, "adaptorType", void 0);
    __decorate$6([
        Property('')
    ], Data.prototype, "xDataMapping", void 0);
    __decorate$6([
        Property('')
    ], Data.prototype, "yDataMapping", void 0);
    __decorate$6([
        Property('')
    ], Data.prototype, "valueMapping", void 0);
    __decorate$6([
        Complex({}, BubbleData)
    ], Data.prototype, "bubbleDataMapping", void 0);
    return Data;
}(ChildProperty));
var AdaptiveMinMax = /** @__PURE__ @class */ (function () {
    function AdaptiveMinMax() {
    }
    return AdaptiveMinMax;
}());
/**
 *
 * The `Adaptor` module is used to handle JSON and Table data.
 */
var Adaptor = /** @__PURE__ @class */ (function () {
    function Adaptor(heatMap) {
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
    Adaptor.prototype.constructDatasource = function (adaptData) {
        if (adaptData && adaptData.data === undefined) {
            this.heatMap.completeAdaptDataSource = adaptData;
        }
        else if (!adaptData.isJsonData && adaptData.adaptorType === 'Table' || adaptData.data === null) {
            this.heatMap.completeAdaptDataSource = adaptData.data;
        }
        else if (adaptData.isJsonData && adaptData.adaptorType === 'Table') {
            this.heatMap.completeAdaptDataSource = this.processJsonTableData(adaptData);
        }
        else if (adaptData.isJsonData && adaptData.adaptorType === 'Cell') {
            this.heatMap.completeAdaptDataSource = this.processJsonCellData(adaptData);
        }
        else if (!adaptData.isJsonData && adaptData.adaptorType === 'Cell') {
            var xAxis = this.heatMap.xAxis;
            var yAxis = this.heatMap.yAxis;
            this.adaptiveXMinMax.min = xAxis.minimum;
            this.adaptiveXMinMax.max = xAxis.maximum;
            this.adaptiveYMinMax.min = yAxis.minimum;
            this.adaptiveYMinMax.max = yAxis.maximum;
            if (((xAxis.valueType === 'Numeric' || xAxis.valueType === 'DateTime') &&
                (isNullOrUndefined(xAxis.minimum) || isNullOrUndefined(xAxis.maximum))) ||
                ((yAxis.valueType === 'Numeric' || yAxis.valueType === 'DateTime') &&
                    (isNullOrUndefined(yAxis.minimum) || isNullOrUndefined(yAxis.maximum)))) {
                this.getMinMaxValue(adaptData.data, xAxis, yAxis);
            }
            this.constructAdaptiveAxis();
            this.heatMap.completeAdaptDataSource = this.processCellData(adaptData);
            this.heatMap.isCellData = true;
        }
    };
    /**
     * Method to construct Axis Collection.
     * @return {void}
     * @private
     */
    Adaptor.prototype.constructAdaptiveAxis = function () {
        var xAxis = this.heatMap.xAxis;
        var yAxis = this.heatMap.yAxis;
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
    };
    /**
     * Method to calculate Numeric Axis Collection.
     * @return {string[]}
     * @private
     */
    Adaptor.prototype.getNumericAxisCollection = function (min, max, increment) {
        var loopIndex = min;
        var tempAxisColl = [];
        while (loopIndex <= max) {
            tempAxisColl.push(loopIndex.toString());
            loopIndex = loopIndex + increment;
        }
        return tempAxisColl;
    };
    /**
     * Method to calculate DateTime Axis Collection.
     * @return {string[]}
     * @private
     */
    Adaptor.prototype.getDateAxisCollection = function (min, max, intervalType, increment) {
        var option = {
            skeleton: 'full',
            type: 'dateTime'
        };
        var dateParser = this.heatMap.intl.getDateParser(option);
        var dateFormatter = this.heatMap.intl.getDateFormat(option);
        min = Date.parse(dateParser(dateFormatter(new Date(DataUtil.parse.parseJson({ val: min }).val))));
        var tempInterval = min;
        var tempAxisColl = [];
        while (tempInterval <= max) {
            tempAxisColl.push(new Date(tempInterval).toString());
            tempInterval = increaseDateTimeInterval(tempInterval, 1, intervalType, increment).getTime();
        }
        return tempAxisColl;
    };
    /**
     * Method to calculate Maximum and Minimum Value from datasource.
     * @return {void}
     * @private
     */
    Adaptor.prototype.getMinMaxValue = function (data, xAxis, yAxis) {
        if (data.length > 0) {
            this.adaptiveXMinMax.min = !isNullOrUndefined(xAxis.minimum) ? xAxis.minimum : data[0][0];
            this.adaptiveYMinMax.min = !isNullOrUndefined(yAxis.minimum) ? yAxis.minimum : data[0][1];
            this.adaptiveXMinMax.max = !isNullOrUndefined(xAxis.maximum) ? xAxis.maximum : data[0][0];
            this.adaptiveYMinMax.max = !isNullOrUndefined(yAxis.maximum) ? yAxis.maximum : data[0][1];
        }
        for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
            if (data[dataIndex][0] < this.adaptiveXMinMax.min && isNullOrUndefined(xAxis.minimum)) {
                this.adaptiveXMinMax.min = data[dataIndex][0];
            }
            if (data[dataIndex][0] > this.adaptiveXMinMax.max && isNullOrUndefined(xAxis.maximum)) {
                this.adaptiveXMinMax.max = data[dataIndex][0];
            }
            if (data[dataIndex][1] < this.adaptiveYMinMax.min && isNullOrUndefined(yAxis.minimum)) {
                this.adaptiveYMinMax.min = data[dataIndex][1];
            }
            if (data[dataIndex][1] > this.adaptiveYMinMax.max && isNullOrUndefined(yAxis.maximum)) {
                this.adaptiveYMinMax.max = data[dataIndex][1];
            }
        }
    };
    /**
     * Method to process Cell datasource.
     * @return {Object}
     * @private
     */
    Adaptor.prototype.processCellData = function (adaptordata) {
        // tslint:disable-next-line:no-any 
        var tempDataCollection = adaptordata.data;
        var xLabels = this.reconstructedXAxis;
        var yLabels = this.reconstructedYAxis;
        var currentDataXIndex = 0;
        var currentDataYIndex = 0;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (var xindex = 0; xindex < tempDataCollection.length; xindex++) {
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
    };
    /**
     * Method to process JSON Cell datasource.
     * @return {Object}
     * @private
     */
    Adaptor.prototype.processJsonCellData = function (adaptordata) {
        // tslint:disable-next-line:no-any 
        var tempDataCollection = adaptordata.data;
        var xLabels = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        var yLabels = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        var currentDataXIndex = 0;
        var currentDataYIndex = 0;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (var index = 0; index < tempDataCollection.length; index++) {
                currentDataXIndex = this.getSplitDataValue(tempDataCollection[index], adaptordata, xLabels, adaptordata.xDataMapping.split('.'));
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    currentDataYIndex = this.getSplitDataValue(tempDataCollection[index], adaptordata, yLabels, adaptordata.yDataMapping.split('.'));
                    if (currentDataYIndex !== -1) {
                        while (isNullOrUndefined(this.reconstructData[currentDataXIndex][currentDataYIndex])) {
                            this.reconstructData[currentDataXIndex].push('');
                        }
                        if (this.heatMap.bubbleSizeWithColor) {
                            this.reconstructData[currentDataXIndex][currentDataYIndex] = [
                                this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.size.split('.')),
                                this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.bubbleDataMapping.color.split('.'))
                            ];
                        }
                        else {
                            this.reconstructData[currentDataXIndex][currentDataYIndex] = this.getSplitDataValue(tempDataCollection[index], adaptordata, null, adaptordata.valueMapping.split('.'));
                        }
                    }
                }
            }
        }
        return this.reconstructData;
    };
    /**
     * Method to get data from complex mapping.
     * @return {number|string}
     * @private
     */
    Adaptor.prototype.getSplitDataValue = function (
    // tslint:disable-next-line:no-any 
    tempSplitDataCollection, adaptordata, labels, tempSplitData) {
        var value = -1;
        this.tempSplitDataCollection = tempSplitDataCollection;
        for (var splitIndex = 0; splitIndex < tempSplitData.length; splitIndex++) {
            value = !isNullOrUndefined(labels) ? labels.indexOf(this.tempSplitDataCollection[tempSplitData[splitIndex]]) : null;
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
    };
    /**
     * Method to process JSON Table datasource.
     * @return {Object}
     * @private
     */
    Adaptor.prototype.processJsonTableData = function (adaptordata) {
        // tslint:disable-next-line:no-any 
        var tempDataCollection = adaptordata.data;
        var currentDataXIndex = 0;
        var currentDataYIndex = 0;
        var xLabels = this.heatMap.xAxis.labels ? this.heatMap.xAxis.labels : [];
        var yLabels = this.heatMap.yAxis.labels ? this.heatMap.yAxis.labels : [];
        var key;
        if (tempDataCollection.length) {
            this.reconstructData = [];
            for (var xindex = 0; xindex < tempDataCollection.length; xindex++) {
                currentDataXIndex = this.getSplitDataValue(tempDataCollection[xindex], adaptordata, xLabels, adaptordata.xDataMapping.split('.'));
                if (currentDataXIndex !== -1) {
                    while (!this.reconstructData[currentDataXIndex]) {
                        this.reconstructData.push([]);
                    }
                    for (var index = 0; index < Object.keys(this.tempSplitDataCollection).length; index++) {
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
    };
    /**
     * To destroy the Adaptor.
     * @return {void}
     * @private
     */
    Adaptor.prototype.destroy = function (heatMap) {
        /**
         * No Lines
         */
    };
    
    /**
     * To get Module name
     */
    Adaptor.prototype.getModuleName = function () {
        return 'Adaptor';
    };
    return Adaptor;
}());

/**
 * HeatMap tool tip file
 */
/**
 *
 * The `Tooltip` module is used to render the tooltip for heatmap series.
 */
var Tooltip$1 = /** @__PURE__ @class */ (function () {
    function Tooltip$$1(heatMap) {
        /* private */
        this.isFirst = true;
        /* private */
        this.isFadeout = false;
        this.heatMap = heatMap;
    }
    /**
     * Get module name
     */
    Tooltip$$1.prototype.getModuleName = function () {
        return 'Tooltip';
    };
    /**
     * To show/hide Tooltip.
     * @private
     */
    Tooltip$$1.prototype.showHideTooltip = function (isShow, isFadeout) {
        var ele = document.getElementById(this.heatMap.element.id + 'Celltooltipcontainer');
        if (!isShow) {
            if (ele && ele.style.visibility !== 'hidden') {
                if (this.tooltipObject && isFadeout) {
                    this.tooltipObject.fadeOut();
                }
                else {
                    if (this.tooltipObject && this.tooltipObject.element) {
                        var tooltipElement = this.tooltipObject.element.firstChild;
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
    };
    /**
     * To destroy the Tooltip.
     * @return {void}
     * @private
     */
    Tooltip$$1.prototype.destroy = function (heatMap) {
        /**
         * Destroy method performed here
         */
    };
    
    /**
     * To add Tooltip to the rect cell.
     * @return {void}
     * @private
     */
    Tooltip$$1.prototype.createTooltip = function (x, y, tempTooltipText) {
        var offset = null;
        if (this.heatMap.cellSettings.showLabel && this.heatMap.heatMapSeries.checkLabelXDisplay &&
            this.heatMap.heatMapSeries.checkLabelYDisplay) {
            offset = parseInt(this.heatMap.cellSettings.textStyle.size, 10) / 2;
        }
        this.tooltipObject = new Tooltip({
            enableAnimation: false,
            offset: offset,
            location: { x: x, y: y },
            theme: this.heatMap.theme,
            content: tempTooltipText,
            areaBounds: {
                height: this.heatMap.initialClipRect.height + this.heatMap.initialClipRect.y,
                width: this.heatMap.initialClipRect.width, x: this.heatMap.initialClipRect.x
            }
        }, '#' + this.heatMap.element.id + 'Celltooltipcontainer');
    };
    /**
     * To create div container for tooltip.
     * @return {void}
     * @private
     */
    Tooltip$$1.prototype.createTooltipDiv = function (heatMap) {
        var element2 = createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipcontainer',
            styles: 'position:absolute'
        });
        this.heatMap.element.appendChild(createElement('div', {
            id: this.heatMap.element.id + 'Celltooltipparent',
            styles: 'position:relative'
        })
            .appendChild(element2));
    };
    /**
     * To get default tooltip content.
     * @private
     */
    Tooltip$$1.prototype.getTooltipContent = function (currentRect, hetmapSeries) {
        var value;
        var content;
        var heatMap = this.heatMap;
        var adaptData = this.heatMap.dataSource;
        if (heatMap.bubbleSizeWithColor) {
            var xAxis = heatMap.xAxis.title && heatMap.xAxis.title.text !== '' ? heatMap.xAxis.title.text : 'X-Axis';
            var yAxis = heatMap.yAxis.title && heatMap.yAxis.title.text !== '' ? heatMap.yAxis.title.text : 'Y-Axis';
            var value1 = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                heatMap.dataSource.bubbleDataMapping.size : 'Value 1';
            var value2 = adaptData.isJsonData && adaptData.adaptorType === 'Cell' ?
                heatMap.dataSource.bubbleDataMapping.color : 'Value 2';
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
    };
    /**
     * To render tooltip.
     * @private
     */
    Tooltip$$1.prototype.renderTooltip = function (currentRect) {
        var hetmapSeries = this.heatMap.heatMapSeries;
        var tempTooltipText = [''];
        var showTooltip = this.heatMap.bubbleSizeWithColor ?
            !isNullOrUndefined(currentRect.value) && !isNullOrUndefined(currentRect.value[0].bubbleData)
                && currentRect.value[0].bubbleData.toString() !== '' ? true : false
            : isNullOrUndefined(currentRect.value) || (!isNullOrUndefined(currentRect.value) &&
                currentRect.value.toString() === '') ? false : true;
        if (!showTooltip) {
            this.showHideTooltip(false, false);
        }
        else {
            if (!isNullOrUndefined(this.heatMap.tooltipRender)) {
                // this.tooltipObject.header = '';
                // this.tooltipObject.content = this.getTemplateText(
                //     currentRect, this.heatMap.tooltipTemplate, hetmapSeries.hoverXAxisLabel,
                //     hetmapSeries.hoverYAxisLabel);
                var content = this.getTooltipContent(currentRect, hetmapSeries);
                var argData = {
                    heatmap: this.heatMap,
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
                this.heatMap.trigger('tooltipRender', argData);
                if (!argData.cancel) {
                    tempTooltipText = argData.content;
                }
                else {
                    if (this.tooltipObject) {
                        this.showHideTooltip(false);
                    }
                    return;
                }
            }
            else {
                //  this.tooltipObject.header = hetmapSeries.hoverYAxisLabel.toString();
                tempTooltipText = this.getTooltipContent(currentRect, hetmapSeries);
            }
            if (!this.tooltipObject) {
                this.createTooltip(currentRect.x + (currentRect.width / 2), currentRect.y + (currentRect.height / 2), tempTooltipText);
            }
            else {
                this.tooltipObject.content = tempTooltipText;
            }
            this.showHideTooltip(true);
            this.tooltipObject.enableAnimation = (this.isFirst || this.isFadeout) ? false : true;
            this.isFirst = (this.isFirst) ? false : this.isFirst;
            this.isFadeout = (this.isFadeout) ? false : this.isFadeout;
            this.tooltipObject.location.x = currentRect.x + (currentRect.width / 2);
            this.tooltipObject.location.y = currentRect.y + (currentRect.height / 2);
        }
    };
    return Tooltip$$1;
}());

/**
 * Heatmap component exported items
 */

/**
 * HeatMap index file
 */

export { HeatMap, Axis, AxisHelper, Data, AdaptiveMinMax, Adaptor, TwoDimensional, LegendSettings, Legend, Font, Margin, Border, BubbleData, Title, PaletteCollection, ColorCollection, BubbleTooltipData, LegendColorCollection, CellSettings, Series, PaletteSettings, RgbColor, CellColor, Tooltip$1 as Tooltip, stringToNumber, measureText, TextElement, titlePositionX, Size, CustomizeOption, PathOption, CurrentRect, RectOption, CircleOption, Rect, TextOption, TextBasic, Line, LineOption, PathAttributes, Path, sum, titlePositionY, rotateTextSize, DrawSvgCanvas, getTitle, textWrap, textTrim, textNone, Gradient, GradientColor, showTooltip, removeElement, getElement, increaseDateTimeInterval, CanvasTooltip, getTooltipText, PaletterColor, GradientPointer, CurrentLegendRect, colorNameToHex, convertToHexCode, componentToHex, convertHexToColor };
//# sourceMappingURL=ej2-heatmap.es5.js.map
