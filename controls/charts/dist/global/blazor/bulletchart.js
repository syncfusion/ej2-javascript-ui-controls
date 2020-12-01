window.sf = window.sf || {};
var sfbulletchart = (function (exports) {
'use strict';

/**
 * Specifies Chart Themes
 */
var Theme;
(function (Theme) {
    /** @private */
    Theme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.axisTitleFont = {
        size: '14px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.chartTitleFont = {
        size: '15px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.chartSubTitleFont = {
        size: '11px',
        fontWeight: '500',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.crosshairLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.tooltipLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.legendTitleFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.stripLineLabelFont = {
        size: '12px',
        fontWeight: 'Regular',
        color: '#353535',
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    Theme.stockEventFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
})(Theme || (Theme = {}));
/** @private */

/** @private */

/** @private */

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
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Defines the appearance of the connectors
 */
var Connector = /** @class */ (function (_super) {
    __extends$1(Connector, _super);
    function Connector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('Line')
    ], Connector.prototype, "type", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], Connector.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], Connector.prototype, "width", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], Connector.prototype, "length", void 0);
    __decorate$1([
        sf.base.Property('')
    ], Connector.prototype, "dashArray", void 0);
    return Connector;
}(sf.base.ChildProperty));
/**
 * Configures the fonts in charts.
 */
var Font = /** @class */ (function (_super) {
    __extends$1(Font, _super);
    function Font() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('Normal')
    ], Font.prototype, "fontStyle", void 0);
    __decorate$1([
        sf.base.Property('16px')
    ], Font.prototype, "size", void 0);
    __decorate$1([
        sf.base.Property('Normal')
    ], Font.prototype, "fontWeight", void 0);
    __decorate$1([
        sf.base.Property('')
    ], Font.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property('Center')
    ], Font.prototype, "textAlignment", void 0);
    __decorate$1([
        sf.base.Property('Segoe UI')
    ], Font.prototype, "fontFamily", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], Font.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Property('Trim')
    ], Font.prototype, "textOverflow", void 0);
    return Font;
}(sf.base.ChildProperty));
/**
 * Configures the borders in the chart.
 */
var Border = /** @class */ (function (_super) {
    __extends$1(Border, _super);
    function Border() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('')
    ], Border.prototype, "color", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], Border.prototype, "width", void 0);
    return Border;
}(sf.base.ChildProperty));
/**
 * Configures the marker position in the chart.
 */
var Offset = /** @class */ (function (_super) {
    __extends$1(Offset, _super);
    function Offset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(0)
    ], Offset.prototype, "x", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], Offset.prototype, "y", void 0);
    return Offset;
}(sf.base.ChildProperty));
/**
 * Configures the chart area.
 */
var ChartArea = /** @class */ (function (_super) {
    __extends$1(ChartArea, _super);
    function ChartArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Complex({}, Border)
    ], ChartArea.prototype, "border", void 0);
    __decorate$1([
        sf.base.Property('transparent')
    ], ChartArea.prototype, "background", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], ChartArea.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], ChartArea.prototype, "backgroundImage", void 0);
    return ChartArea;
}(sf.base.ChildProperty));
/**
 * Configures the chart margins.
 */
var Margin = /** @class */ (function (_super) {
    __extends$1(Margin, _super);
    function Margin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(10)
    ], Margin.prototype, "left", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], Margin.prototype, "right", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], Margin.prototype, "top", void 0);
    __decorate$1([
        sf.base.Property(10)
    ], Margin.prototype, "bottom", void 0);
    return Margin;
}(sf.base.ChildProperty));
/**
 * Configures the animation behavior for chart series.
 */
var Animation$1 = /** @class */ (function (_super) {
    __extends$1(Animation$$1, _super);
    function Animation$$1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(true)
    ], Animation$$1.prototype, "enable", void 0);
    __decorate$1([
        sf.base.Property(1000)
    ], Animation$$1.prototype, "duration", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], Animation$$1.prototype, "delay", void 0);
    return Animation$$1;
}(sf.base.ChildProperty));
/**
 * Series and point index
 * @public
 */
var Indexes = /** @class */ (function (_super) {
    __extends$1(Indexes, _super);
    function Indexes() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(0)
    ], Indexes.prototype, "series", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], Indexes.prototype, "point", void 0);
    return Indexes;
}(sf.base.ChildProperty));
/**
 * Column series rounded corner options
 */
var CornerRadius = /** @class */ (function (_super) {
    __extends$1(CornerRadius, _super);
    function CornerRadius() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(0)
    ], CornerRadius.prototype, "topLeft", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], CornerRadius.prototype, "topRight", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], CornerRadius.prototype, "bottomLeft", void 0);
    __decorate$1([
        sf.base.Property(0)
    ], CornerRadius.prototype, "bottomRight", void 0);
    return CornerRadius;
}(sf.base.ChildProperty));
/**
 * Configures the Empty Points of series
 */
var EmptyPointSettings = /** @class */ (function (_super) {
    __extends$1(EmptyPointSettings, _super);
    function EmptyPointSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(null)
    ], EmptyPointSettings.prototype, "fill", void 0);
    __decorate$1([
        sf.base.Complex({ color: 'transparent', width: 0 }, Border)
    ], EmptyPointSettings.prototype, "border", void 0);
    __decorate$1([
        sf.base.Property('Gap')
    ], EmptyPointSettings.prototype, "mode", void 0);
    return EmptyPointSettings;
}(sf.base.ChildProperty));
/**
 * Configures the drag settings of series
 */
var DragSettings = /** @class */ (function (_super) {
    __extends$1(DragSettings, _super);
    function DragSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(false)
    ], DragSettings.prototype, "enable", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], DragSettings.prototype, "minY", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], DragSettings.prototype, "maxY", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], DragSettings.prototype, "fill", void 0);
    return DragSettings;
}(sf.base.ChildProperty));
/**
 * Configures the ToolTips in the chart.
 * @public
 */
var TooltipSettings = /** @class */ (function (_super) {
    __extends$1(TooltipSettings, _super);
    function TooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "enable", void 0);
    __decorate$1([
        sf.base.Property(true)
    ], TooltipSettings.prototype, "enableMarker", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "shared", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "fill", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "header", void 0);
    __decorate$1([
        sf.base.Property(0.75)
    ], TooltipSettings.prototype, "opacity", void 0);
    __decorate$1([
        sf.base.Complex(Theme.tooltipLabelFont, Font)
    ], TooltipSettings.prototype, "textStyle", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "format", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], TooltipSettings.prototype, "template", void 0);
    __decorate$1([
        sf.base.Property(true)
    ], TooltipSettings.prototype, "enableAnimation", void 0);
    __decorate$1([
        sf.base.Property(300)
    ], TooltipSettings.prototype, "duration", void 0);
    __decorate$1([
        sf.base.Property(1000)
    ], TooltipSettings.prototype, "fadeOutDuration", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], TooltipSettings.prototype, "enableTextWrap", void 0);
    __decorate$1([
        sf.base.Complex({ color: '#cccccc', width: 0.5 }, Border)
    ], TooltipSettings.prototype, "border", void 0);
    __decorate$1([
        sf.base.Property('None')
    ], TooltipSettings.prototype, "position", void 0);
    return TooltipSettings;
}(sf.base.ChildProperty));
/**
 * button settings in period selector
 */
var Periods = /** @class */ (function (_super) {
    __extends$1(Periods, _super);
    function Periods() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property('Years')
    ], Periods.prototype, "intervalType", void 0);
    __decorate$1([
        sf.base.Property(1)
    ], Periods.prototype, "interval", void 0);
    __decorate$1([
        sf.base.Property(null)
    ], Periods.prototype, "text", void 0);
    __decorate$1([
        sf.base.Property(false)
    ], Periods.prototype, "selected", void 0);
    return Periods;
}(sf.base.ChildProperty));
/**
 * Period Selector Settings
 */
var PeriodSelectorSettings = /** @class */ (function (_super) {
    __extends$1(PeriodSelectorSettings, _super);
    function PeriodSelectorSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$1([
        sf.base.Property(43)
    ], PeriodSelectorSettings.prototype, "height", void 0);
    __decorate$1([
        sf.base.Property('Bottom')
    ], PeriodSelectorSettings.prototype, "position", void 0);
    __decorate$1([
        sf.base.Collection([], Periods)
    ], PeriodSelectorSettings.prototype, "periods", void 0);
    return PeriodSelectorSettings;
}(sf.base.ChildProperty));

/**
 * Class for Bullet chart axis
 */
var BulletChartAxis = /** @class */ (function () {
    function BulletChartAxis(bullet) {
        //super();
        this.bulletChart = bullet;
        this.isVertical = (bullet.orientation === 'Vertical');
        this.isLabelsInside = (bullet.labelPosition === 'Inside');
        this.isHorizontal = (bullet.orientation === 'Horizontal');
        this.isLeft = bullet.titlePosition === 'Left';
        this.isRight = bullet.titlePosition === 'Right';
        this.isTop = bullet.titlePosition === 'Top';
        this.majorTickSize = bullet.majorTickLines.height;
        this.location = 10;
        this.labelOffset = 15;
        this.labelSize = parseFloat(bullet.labelStyle.size);
        this.isLabelBelow = !this.bulletChart.opposedPosition;
    }
    BulletChartAxis.prototype.renderMajorTickLines = function (intervalValue, scale) {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXMajorTickLines(intervalValue, scale);
        }
        else {
            this.renderYMajorTickLines(intervalValue, scale);
        }
    };
    BulletChartAxis.prototype.renderMinorTickLines = function (intervalValue, scale) {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXMinorTickLines(intervalValue, scale);
        }
        else {
            this.renderYMinorTickLines(intervalValue, scale);
        }
    };
    BulletChartAxis.prototype.renderAxisLabels = function (intervalValue, scale) {
        if (this.bulletChart.orientation === 'Horizontal') {
            this.renderXAxisLabels(intervalValue, scale);
        }
        else {
            this.renderYAxisLabels(intervalValue, scale);
        }
    };
    /**
     * To render grid lines of bullet chart axis
     */
    BulletChartAxis.prototype.renderXMajorTickLines = function (intervalValue, scale) {
        var bullet = this.bulletChart;
        var tickGroup = bullet.renderer.createGroup({ 'id': bullet.svgObject.id + '_majorTickGroup' });
        var min = bullet.minimum;
        var max = bullet.maximum;
        var interval = bullet.interval;
        var enableRtl = bullet.enableRtl;
        var y1 = bullet.initialClipRect.y + ((bullet.opposedPosition) ? 0 : bullet.initialClipRect.height);
        // tslint:disable-next-line:max-line-length
        var y2 = y1 + ((!bullet.opposedPosition) ? ((bullet.tickPosition !== 'Inside' ? this.majorTickSize : -this.majorTickSize)) :
            ((bullet.tickPosition !== 'Inside' ? -this.majorTickSize : this.majorTickSize)));
        var majorTick = bullet.majorTickLines;
        var strokeColor = majorTick.color || bullet.themeStyle.majorTickLineColor;
        var options;
        var condition;
        var size = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        var majorPointX = bullet.initialClipRect.x + majorTick.width / 2 + ((enableRtl) ? bullet.initialClipRect.width : 0);
        for (var i = min; i <= max; i += interval) {
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (condition) {
                majorPointX -= majorTick.width / 2;
            }
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (bullet.majorTickLines.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(majorPointX - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size, this.bulletChart.orientation, bullet.enableRtl);
            }
            options = this.majorTicks(majorPointX, majorPointX, y1, y2, strokeColor, i);
            var majorTicks = bullet.renderer.drawLine(options);
            majorPointX = majorPointX + ((enableRtl ? -intervalValue : intervalValue));
            tickGroup.appendChild(majorTicks);
            scale.appendChild(tickGroup);
        }
    };
    /**
     * To render grid lines of bullet chart axis
     */
    BulletChartAxis.prototype.renderYMajorTickLines = function (intervalValue, scale) {
        var bulletChart = this.bulletChart;
        var tickGroup = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_majorTickGroup' });
        var min = bulletChart.minimum;
        var max = bulletChart.maximum;
        var interval = bulletChart.interval;
        var enableRtl = bulletChart.enableRtl;
        var rect = bulletChart.initialClipRect;
        var x1 = rect.x + ((!bulletChart.opposedPosition) ? 0 : rect.width);
        // tslint:disable-next-line:max-line-length
        var x2 = x1 - ((!bulletChart.opposedPosition) ? ((bulletChart.tickPosition !== 'Inside' ? this.majorTickSize : -this.majorTickSize)) :
            ((bulletChart.tickPosition !== 'Inside' ? -this.majorTickSize : this.majorTickSize)));
        var majorTick = bulletChart.majorTickLines;
        var strokeColor = majorTick.color || bulletChart.themeStyle.majorTickLineColor;
        var condition;
        var options;
        var size = rect.y + ((!bulletChart.enableRtl) ? rect.height : 0);
        var majorPointY = rect.y + majorTick.width / 2 + ((!enableRtl) ? rect.height : 0);
        for (var i = min; i <= max; i += interval) {
            condition = (bulletChart.enableRtl) ? (i === max) : (i === min);
            if (condition) {
                majorPointY -= majorTick.width / 2;
            }
            condition = (!bulletChart.enableRtl) ? (i === max) : (i === min);
            if (bulletChart.majorTickLines.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(majorPointY - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size, this.bulletChart.orientation, bulletChart.enableRtl);
            }
            options = this.majorTicks(x1, x2, majorPointY, majorPointY, strokeColor, i);
            var majorTicks = bulletChart.renderer.drawLine(options);
            majorPointY = majorPointY + ((!enableRtl ? -intervalValue : intervalValue));
            tickGroup.appendChild(majorTicks);
            scale.appendChild(tickGroup);
        }
    };
    BulletChartAxis.prototype.majorTicks = function (x1, x2, y1, y2, strokeColor, i) {
        var options = {
            'id': this.bulletChart.svgObject.id + '_MajorTickLine_' + i,
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y2,
            'stroke-width': this.bulletChart.majorTickLines.width,
            'stroke': (this.bulletChart.majorTickLines.useRangeColor && strokeColor) ? strokeColor :
                this.bulletChart.majorTickLines.color || strokeColor
        };
        return options;
    };
    BulletChartAxis.prototype.bindingRangeStrokes = function (majorPointX, size, orientation, rtl) {
        if ((orientation === 'Vertical' && !rtl) || (rtl && orientation === 'Horizontal')) {
            return this.backwardStrokeBinding(majorPointX, size);
        }
        else {
            return this.forwardStrokeBinding(majorPointX, size);
        }
    };
    /**
     * To render minor tick lines of bullet chart
     */
    BulletChartAxis.prototype.renderXMinorTickLines = function (intervalValue, scaleGroup) {
        var minorTickGroup = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_minorTickGroup' });
        var bullet = this.bulletChart;
        var max = bullet.maximum;
        var min = bullet.minimum;
        var interval = bullet.interval;
        var minorTick = bullet.minorTickLines.height;
        var minorTicksPerInterval = this.bulletChart.minorTicksPerInterval;
        var minorPointX;
        var x;
        var majorPointX = bullet.initialClipRect.x;
        var y1 = bullet.initialClipRect.y + ((bullet.opposedPosition) ? 0 : bullet.initialClipRect.height);
        var y2 = y1 + ((!bullet.opposedPosition) ? ((bullet.tickPosition !== 'Inside' ? minorTick : -minorTick)) :
            ((bullet.tickPosition !== 'Inside' ? -minorTick : minorTick)));
        var strokeColor = bullet.minorTickLines.color || bullet.themeStyle.minorTickLineColor;
        var options;
        var minorTicks;
        var size = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        for (var i = min; i < max; i += interval) {
            minorPointX = intervalValue / minorTicksPerInterval;
            for (var j = 1; j <= minorTicksPerInterval; j++) {
                x = majorPointX + minorPointX - (minorPointX / (minorTicksPerInterval + 1));
                if (bullet.minorTickLines.useRangeColor) {
                    strokeColor = this.bindingRangeStrokes(x, size, this.bulletChart.orientation, bullet.enableRtl);
                }
                options = this.minorXTicks(x, x, y1, y2, strokeColor, i.toString() + j.toString());
                minorTicks = this.bulletChart.renderer.drawLine(options);
                minorTickGroup.appendChild(minorTicks);
                scaleGroup.appendChild(minorTickGroup);
                minorPointX = (intervalValue / minorTicksPerInterval) * (j + 1);
            }
            majorPointX += intervalValue;
        }
    };
    /**
     * To render minor tick lines of bullet chart
     */
    BulletChartAxis.prototype.renderYMinorTickLines = function (intervalValue, scaleGroup) {
        var minorTickGroup = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_minorTickGroup' });
        var bulletChart = this.bulletChart;
        var max = bulletChart.maximum;
        var min = bulletChart.minimum;
        var interval = bulletChart.interval;
        var minorTick = bulletChart.minorTickLines.height;
        var minorTicksPerInterval = this.bulletChart.minorTicksPerInterval;
        var minorPointY;
        var y;
        var majorPointY = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        var x1 = bulletChart.initialClipRect.x + ((!bulletChart.opposedPosition) ? 0 : bulletChart.initialClipRect.width);
        var x2 = x1 - ((!bulletChart.opposedPosition) ? ((bulletChart.tickPosition !== 'Inside' ? minorTick : -minorTick)) :
            ((bulletChart.tickPosition !== 'Inside' ? -minorTick : minorTick)));
        var strokeColor = bulletChart.minorTickLines.color || bulletChart.themeStyle.minorTickLineColor;
        var options;
        var minorTicks;
        var size = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        for (var i = min; i < max; i += interval) {
            minorPointY = intervalValue / minorTicksPerInterval;
            for (var j = 1; j <= minorTicksPerInterval; j++) {
                if (!this.bulletChart.enableRtl) {
                    y = majorPointY - minorPointY + (minorPointY / (minorTicksPerInterval + 1));
                }
                else {
                    y = majorPointY + minorPointY - (minorPointY / (minorTicksPerInterval + 1));
                }
                if (bulletChart.minorTickLines.useRangeColor) {
                    strokeColor = this.bindingRangeStrokes(y, size, this.bulletChart.orientation, bulletChart.enableRtl);
                }
                options = this.minorXTicks(x1, x2, y, y, strokeColor, i.toString() + j.toString());
                minorTicks = this.bulletChart.renderer.drawLine(options);
                minorTickGroup.appendChild(minorTicks);
                scaleGroup.appendChild(minorTickGroup);
                minorPointY = (intervalValue / minorTicksPerInterval) * (j + 1);
            }
            majorPointY -= (this.bulletChart.enableRtl) ? -intervalValue : intervalValue;
        }
    };
    BulletChartAxis.prototype.minorXTicks = function (x1, x2, y1, y2, strokeColor, i) {
        var options = {
            'id': this.bulletChart.svgObject.id + '_MajorTickLine_' + i,
            'x1': x1,
            'x2': x2,
            'y1': y1,
            'y2': y2,
            'stroke-width': this.bulletChart.minorTickLines.width,
            'stroke': (this.bulletChart.minorTickLines.useRangeColor && strokeColor) ? strokeColor :
                this.bulletChart.minorTickLines.color || strokeColor
        };
        return options;
    };
    BulletChartAxis.prototype.forwardStrokeBinding = function (position, size) {
        var bullet = this.bulletChart;
        var previous = size;
        // (bullet.orientation === 'Horizontal') ? bullet.initialClipRect.x :
        // (bullet.initialClipRect.y + bullet.initialClipRect.height);
        for (var k = 0; k <= bullet.rangeCollection.length - 1; k++) {
            previous += (!k) ? 0 : bullet.rangeCollection[k - 1];
            if (position >= previous && position < previous + bullet.rangeCollection[k]) {
                return bullet.ranges[k].color;
            }
        }
        return null;
    };
    BulletChartAxis.prototype.backwardStrokeBinding = function (position, size) {
        var bullet = this.bulletChart;
        var previous = size;
        for (var k = 0; k <= bullet.rangeCollection.length - 1; k++) {
            previous -= (!k) ? 0 : bullet.rangeCollection[k - 1];
            if (Math.round(position) >= Math.round(previous - bullet.rangeCollection[k]) && position <= previous) {
                return bullet.ranges[k].color;
            }
        }
        return null;
    };
    /**
     * To render axis labels of bullet chart
     */
    BulletChartAxis.prototype.renderXAxisLabels = function (intervalValue, scaleGroup) {
        var axisLabelGroup = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_axisLabelGroup' });
        var text;
        var bullet = this.bulletChart;
        var locale = this.bulletChart.locale;
        var padding = 5;
        var enableRtl = bullet.enableRtl;
        var tick = (((bullet.tickPosition === bullet.labelPosition) ? bullet.majorTickLines.height : 0) + padding * 2);
        var y = bullet.initialClipRect.y + ((bullet.opposedPosition) ? ((bullet.labelPosition === 'Inside') ? tick : -tick)
            : bullet.initialClipRect.height + ((bullet.labelPosition === 'Inside') ? -tick : tick));
        var x = bullet.initialClipRect.x + ((enableRtl) ? bullet.initialClipRect.width : 0);
        var min = bullet.minimum;
        var max = bullet.maximum;
        var interval = bullet.interval;
        var localizedText = locale && this.bulletChart.enableGroupSeparator;
        var format = this.getFormat(this.bulletChart);
        var strokeColor = bullet.labelStyle.color || bullet.themeStyle.labelFontColor;
        var condition;
        var isCustomFormat = format.match('{value}') !== null;
        this.format = this.bulletChart.intl.getNumberFormat({
            format: isCustomFormat ? '' : format, useGrouping: this.bulletChart.enableGroupSeparator
        });
        var size = bullet.initialClipRect.x + ((bullet.enableRtl) ? bullet.initialClipRect.width : 0);
        y += sf.svgbase.measureText(this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bullet.labelStyle).height / 3;
        for (var i = min; i <= max; i += interval) {
            condition = (!bullet.enableRtl) ? (i === max) : (i === min);
            if (bullet.labelStyle.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(x - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size, this.bulletChart.orientation, bullet.enableRtl);
            }
            text = localizedText ? i.toLocaleString(locale) : this.formatValue(this, isCustomFormat, format, i);
            var labelOptions = this.labelXOptions(x, y, text, i);
            var label = sf.svgbase.textElement(labelOptions, this.bulletChart.labelStyle, strokeColor, scaleGroup);
            axisLabelGroup.appendChild(label);
            x += (enableRtl) ? -intervalValue : intervalValue;
        }
        scaleGroup.appendChild(axisLabelGroup);
    };
    BulletChartAxis.prototype.labelXOptions = function (labelX, pointY, displayText, i) {
        var labelOptions = {
            'id': this.bulletChart.svgObject.id + '_AxisLabel_' + i,
            'anchor': 'middle',
            'text': displayText,
            'transform': '',
            'x': labelX,
            'y': pointY,
            'baseLine': '',
            'labelRotation': 0,
        };
        return labelOptions;
    };
    /**
     * To render axis labels of bullet chart
     */
    BulletChartAxis.prototype.renderYAxisLabels = function (intervalValue, scaleGroup) {
        var axisLabelGroup = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_axisLabelGroup' });
        var text;
        var bulletChart = this.bulletChart;
        var locale = bulletChart.locale;
        var padding = 5;
        var enableRtl = bulletChart.enableRtl;
        var tick = (((bulletChart.tickPosition === bulletChart.labelPosition) ?
            bulletChart.majorTickLines.height : 0) + padding * 2);
        var y = bulletChart.initialClipRect.y + ((!enableRtl) ? bulletChart.initialClipRect.height : 0);
        var x = bulletChart.initialClipRect.x + ((!bulletChart.opposedPosition) ?
            ((bulletChart.labelPosition === 'Inside') ? (tick + padding * 2) : -tick)
            : bulletChart.initialClipRect.width + ((bulletChart.labelPosition === 'Inside') ? -(tick + padding * 2) : tick));
        var min = bulletChart.minimum;
        var max = bulletChart.maximum;
        var interval = bulletChart.interval;
        var localizedText = locale && this.bulletChart.enableGroupSeparator;
        var strokeColor = bulletChart.labelStyle.color || bulletChart.themeStyle.labelFontColor;
        var format = this.getFormat(this.bulletChart);
        var isCustomFormat = format.match('{value}') !== null;
        var condition;
        this.format = this.bulletChart.intl.getNumberFormat({
            format: isCustomFormat ? '' : format, useGrouping: this.bulletChart.enableGroupSeparator
        });
        var size = bulletChart.initialClipRect.y + ((!bulletChart.enableRtl) ? bulletChart.initialClipRect.height : 0);
        var labelWidth = sf.svgbase.measureText(this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bulletChart.labelStyle).width / 2;
        var height = sf.svgbase.measureText(this.formatValue(this, isCustomFormat, format, this.bulletChart.maximum), bulletChart.labelStyle).height / 3;
        y += height;
        for (var i = min; i <= max; i += interval) {
            condition = (bulletChart.enableRtl) ? (i === max) : (i === min);
            if (bulletChart.labelStyle.useRangeColor) {
                strokeColor = this.bindingRangeStrokes(y - height - ((condition) ? this.bulletChart.majorTickLines.width / 2 : 0), size, this.bulletChart.orientation, bulletChart.enableRtl);
            }
            text = localizedText ? i.toLocaleString(locale) : this.formatValue(this, isCustomFormat, format, i);
            //labelWidth = measureText(text, bullet.labelStyle).width / 2;
            var labelOptions = this.labelXOptions(x - (!this.bulletChart.opposedPosition ? labelWidth : -labelWidth), y, text, i);
            var label = sf.svgbase.textElement(labelOptions, this.bulletChart.labelStyle, strokeColor, scaleGroup);
            axisLabelGroup.appendChild(label);
            y += (!enableRtl) ? -intervalValue : intervalValue;
        }
        scaleGroup.appendChild(axisLabelGroup);
    };
    /**
     * Format of the axis label.
     * @private
     */
    BulletChartAxis.prototype.getFormat = function (axis) {
        if (axis.labelFormat) {
            return axis.labelFormat;
        }
        return '';
    };
    /**
     * Formatted the axis label.
     * @private
     */
    BulletChartAxis.prototype.formatValue = function (axis, isCustom, format, tempInterval) {
        return isCustom ? format.replace('{value}', axis.format(tempInterval))
            : axis.format(tempInterval);
    };
    return BulletChartAxis;
}());

/**
 *
 */

(function (BulletChartTheme) {
    /** @private */
    BulletChartTheme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
    /** @private */
    BulletChartTheme.tooltipLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    BulletChartTheme.legendLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    BulletChartTheme.dataLabelFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    BulletChartTheme.titleFont = {
        size: '15px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
    /** @private */
    BulletChartTheme.subTitleFont = {
        size: '13px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Roboto-Regular'
    };
})(exports.BulletChartTheme || (exports.BulletChartTheme = {}));
/** @private */
// tslint:disable-next-line:max-func-body-length
function getBulletThemeColor(theme, bullet) {
    var style = {
        majorTickLineColor: '#424242',
        minorTickLineColor: '#424242',
        background: '#FFFFFF',
        labelFontColor: 'rgba(0,0,0,0.54)',
        categoryFontColor: '#666666',
        labelFontFamily: 'SegoeUI',
        tooltipFill: 'rgba(0, 8, 22, 0.75)',
        legendLabel: '#353535',
        tooltipBoldLabel: '#ffffff',
        featuredMeasureColor: '#181818',
        comparativeMeasureColor: '#181818',
        titleFontColor: 'rgba(0,0,0,0.87)',
        dataLabelFontColor: '#ffffff',
        titleFontFamily: 'SegoeUI',
        subTitleFontColor: ' rgba(0,0,0,0.54)',
        subTitleFontFamily: 'SegoeUI',
        firstRangeColor: '#959595',
        secondRangeColor: '#BDBDBD',
        thirdRangeColor: '#E3E2E2',
        rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
    };
    switch (theme) {
        case 'Fabric':
            style = {
                majorTickLineColor: '#424242',
                minorTickLineColor: '#424242',
                background: '#FFFFFF',
                labelFontColor: '#666666',
                categoryFontColor: '#666666',
                labelFontFamily: 'SegoeUI',
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                legendLabel: '#353535',
                tooltipBoldLabel: '#ffffff',
                featuredMeasureColor: '#181818',
                comparativeMeasureColor: '#181818',
                titleFontColor: '#333333',
                dataLabelFontColor: '#ffffff',
                titleFontFamily: 'SegoeUI',
                subTitleFontColor: '#666666',
                subTitleFontFamily: 'SegoeUI',
                firstRangeColor: '#959595',
                secondRangeColor: '#BDBDBD',
                thirdRangeColor: '#E3E2E2',
                rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
            };
            break;
        case 'Bootstrap':
            style = {
                majorTickLineColor: '#424242',
                minorTickLineColor: '#424242',
                background: '#FFFFFF',
                labelFontColor: 'rgba(0,0,0,0.54)',
                categoryFontColor: 'rgba(0,0,0,0.54)',
                labelFontFamily: 'Helvetica',
                tooltipFill: 'rgba(0, 0, 0, 0.9)',
                legendLabel: '#212529',
                tooltipBoldLabel: 'rgba(255,255,255)',
                featuredMeasureColor: '#181818',
                comparativeMeasureColor: '#181818',
                titleFontColor: 'rgba(0,0,0,0.87)',
                dataLabelFontColor: '#ffffff',
                titleFontFamily: 'Helvetica-Bold',
                subTitleFontColor: ' rgba(0,0,0,0.54)',
                subTitleFontFamily: 'Helvetica',
                firstRangeColor: '#959595',
                secondRangeColor: '#BDBDBD',
                thirdRangeColor: '#E3E2E2',
                rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
            };
            break;
        case 'HighContrast':
            style = {
                majorTickLineColor: '#FFFFFF',
                minorTickLineColor: '#FFFFFF',
                background: '#000000',
                labelFontColor: '#FFFFFF',
                categoryFontColor: '#FFFFFF',
                labelFontFamily: 'SegoeUI',
                tooltipFill: '#ffffff',
                legendLabel: '#ffffff',
                tooltipBoldLabel: '#000000',
                featuredMeasureColor: '#000000',
                comparativeMeasureColor: '#000000',
                titleFontColor: '#FFFFFF',
                dataLabelFontColor: '#ffffff',
                titleFontFamily: 'HelveticaNeue',
                subTitleFontColor: '#FFFFFF',
                subTitleFontFamily: 'SegoeUI',
                firstRangeColor: '#959595',
                secondRangeColor: '#BDBDBD',
                thirdRangeColor: '#E3E2E2',
                rangeStrokes: [{ color: '#757575' }, { color: '#BDBDBD' }, { color: '#EEEEEE' }]
            };
            break;
        case 'MaterialDark':
        case 'FabricDark':
        case 'BootstrapDark':
            style = {
                majorTickLineColor: '#F0F0F0',
                minorTickLineColor: '#F0F0F0',
                background: '#000000',
                labelFontColor: '#FFFFFF',
                categoryFontColor: '#FFFFFF',
                labelFontFamily: 'Helvetica',
                tooltipFill: '#F4F4F4',
                legendLabel: '#DADADA',
                tooltipBoldLabel: '#282727',
                featuredMeasureColor: '#181818',
                comparativeMeasureColor: '#181818',
                titleFontColor: '#FFFFFF',
                dataLabelFontColor: '#ffffff',
                titleFontFamily: 'Helvetica-Bold',
                subTitleFontColor: '#FFFFFF',
                subTitleFontFamily: 'Helvetica',
                firstRangeColor: '#8D8D8D',
                secondRangeColor: '#ADADAD',
                thirdRangeColor: '#EEEEEE',
                rangeStrokes: [{ color: '#8D8D8D' }, { color: '#ADADAD' }, { color: '#EEEEEE' }]
            };
            break;
        case 'Bootstrap4':
            style = {
                majorTickLineColor: '#424242',
                minorTickLineColor: '#424242',
                background: '#FFFFFF',
                labelFontColor: '#202528',
                categoryFontColor: '#202528',
                labelFontFamily: 'HelveticaNeue',
                tooltipFill: 'rgba(0, 0, 0, 0.9)',
                legendLabel: '#212529',
                tooltipBoldLabel: 'rgba(255,255,255)',
                featuredMeasureColor: '#181818',
                comparativeMeasureColor: '#181818',
                titleFontColor: '#202528',
                dataLabelFontColor: '#ffffff',
                titleFontFamily: 'HelveticaNeue-Bold',
                subTitleFontColor: 'HelveticaNeue',
                subTitleFontFamily: '#202528',
                firstRangeColor: '#959595',
                secondRangeColor: '#BDBDBD',
                thirdRangeColor: '#E3E2E2',
                rangeStrokes: [{ color: '#959595' }, { color: '#BDBDBD' }, { color: '#E3E2E2' }]
            };
            break;
        default:
            style = style;
            break;
    }
    return style;
}

/**
 * Numeric Range.
 * @private
 */
var DoubleRange = /** @class */ (function () {
    function DoubleRange(start, end) {
        /*
          if (!isNaN(start) && !isNaN(end)) {
           this.mIsEmpty = true;
          } else {
              this.mIsEmpty = false;
          }*/
        if (start < end) {
            this.mStart = start;
            this.mEnd = end;
        }
        else {
            this.mStart = end;
            this.mEnd = start;
        }
    }
    Object.defineProperty(DoubleRange.prototype, "start", {
        //private mIsEmpty: boolean;
        /** @private */
        get: function () {
            return this.mStart;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "end", {
        /** @private */
        get: function () {
            return this.mEnd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "delta", {
        /*
          get isEmpty(): boolean {
             return this.mIsEmpty;
         }*/
        /** @private */
        get: function () {
            return (this.mEnd - this.mStart);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DoubleRange.prototype, "median", {
        /** @private */
        get: function () {
            return this.mStart + (this.mEnd - this.mStart) / 2;
        },
        enumerable: true,
        configurable: true
    });
    return DoubleRange;
}());

/**
 * Numeric module is used to render numeric axis.
 */
var Double = /** @class */ (function () {
    /**
     * Constructor for the dateTime module.
     * @private
     */
    function Double(chart) {
        this.isColumn = 0;
        this.chart = chart;
    }
    /**
     * Numeric Nice Interval for the axis.
     * @private
     */
    Double.prototype.calculateNumericNiceInterval = function (axis, delta, size) {
        var actualDesiredIntervalsCount = getActualDesiredIntervalsCount(size, axis);
        var niceInterval = delta / actualDesiredIntervalsCount;
        if (!sf.base.isNullOrUndefined(axis.desiredIntervals)) {
            return niceInterval;
        }
        var minInterval = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (var _i = 0, _a = axis.intervalDivs; _i < _a.length; _i++) {
            var interval = _a[_i];
            var currentInterval = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    };
    /**
     * Actual Range for the axis.
     * @private
     */
    Double.prototype.getActualRange = function (axis, size) {
        this.initializeDoubleRange(axis);
        if ((!axis.startFromZero) && (this.isColumn > 0)) {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.max = axis.doubleRange.end + axis.actualRange.interval;
            if ((axis.doubleRange.start - axis.actualRange.interval < 0 && axis.doubleRange.start > 0)) {
                axis.actualRange.min = 0;
            }
            else {
                axis.actualRange.min = axis.doubleRange.start - axis.actualRange.interval;
            }
        }
        else {
            axis.actualRange.interval = axis.interval || this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            axis.actualRange.min = axis.doubleRange.start;
            axis.actualRange.max = axis.doubleRange.end;
        }
    };
    /**
     * Range for the axis.
     * @private
     */
    Double.prototype.initializeDoubleRange = function (axis) {
        //Axis Min
        if (axis.minimum !== null) {
            this.min = axis.minimum;
        }
        else if (this.min === null || this.min === Number.POSITIVE_INFINITY) {
            this.min = 0;
        }
        // Axis Max
        if (axis.maximum !== null) {
            this.max = axis.maximum;
        }
        else if (this.max === null || this.max === Number.NEGATIVE_INFINITY) {
            this.max = 5;
        }
        if (this.min === this.max) {
            this.max = axis.valueType.indexOf('Category') > -1 ? this.max : this.min + 1;
        }
        axis.doubleRange = new DoubleRange(this.min, this.max);
        axis.actualRange = {};
    };
    /**
     * The function to calculate the range and labels for the axis.
     * @return {void}
     * @private
     */
    Double.prototype.calculateRangeAndInterval = function (size, axis) {
        this.calculateRange(axis, size);
        this.getActualRange(axis, size);
        this.applyRangePadding(axis, size);
        this.calculateVisibleLabels(axis, this.chart);
    };
    /**
     * Calculate Range for the axis.
     * @private
     */
    Double.prototype.calculateRange = function (axis, size) {
        /*! Generate axis range */
        this.min = null;
        this.max = null;
        if (!setRange(axis)) {
            for (var _i = 0, _a = axis.series; _i < _a.length; _i++) {
                var series_1 = _a[_i];
                if (!series_1.visible) {
                    continue;
                }
                this.paddingInterval = 0;
                axis.maxPointLength = series_1.points.length;
                if (((series_1.type.indexOf('Column') > -1 || series_1.type.indexOf('Histogram') > -1) && axis.orientation === 'Horizontal')
                    || (series_1.type.indexOf('Bar') > -1 && axis.orientation === 'Vertical')) {
                    if ((series_1.xAxis.valueType === 'Double' || series_1.xAxis.valueType === 'DateTime')
                        && series_1.xAxis.rangePadding === 'Auto') {
                        this.paddingInterval = getMinPointsDelta(series_1.xAxis, axis.series) * 0.5;
                    }
                }
                //For xRange
                if (axis.orientation === 'Horizontal') {
                    if (this.chart.requireInvertedAxis) {
                        this.yAxisRange(axis, series_1);
                    }
                    else {
                        this.findMinMax(series_1.xMin - this.paddingInterval, series_1.xMax + this.paddingInterval);
                    }
                }
                // For yRange
                if (axis.orientation === 'Vertical') {
                    this.isColumn += (series_1.type === 'Column' || series_1.type === 'Bar' || series_1.drawType === 'Column') ? 1 : 0;
                    if (this.chart.requireInvertedAxis) {
                        this.findMinMax(series_1.xMin - this.paddingInterval, series_1.xMax + this.paddingInterval);
                    }
                    else {
                        this.yAxisRange(axis, series_1);
                    }
                }
            }
        }
    };
    Double.prototype.yAxisRange = function (axis, series) {
        if (series.dragSettings.enable && this.chart.dragY) {
            if (this.chart.dragY >= axis.visibleRange.max) {
                series.yMax = this.chart.dragY + axis.visibleRange.interval;
            }
            if (this.chart.dragY <= axis.visibleRange.min) {
                series.yMin = this.chart.dragY - axis.visibleRange.interval;
            }
        }
        this.findMinMax(series.yMin, series.yMax);
    };
    Double.prototype.findMinMax = function (min, max) {
        if (this.min === null || this.min > min) {
            this.min = min;
        }
        if (this.max === null || this.max < max) {
            this.max = max;
        }
        if ((this.max === this.min) && this.max < 0 && this.min < 0) { // max == min
            this.max = 0;
        }
    };
    /**
     * Apply padding for the range.
     * @private
     */
    Double.prototype.applyRangePadding = function (axis, size) {
        var start = axis.actualRange.min;
        var end = axis.actualRange.max;
        if (!setRange(axis)) {
            var interval = axis.actualRange.interval;
            var padding = axis.getRangePadding(this.chart);
            if (padding === 'Additional' || padding === 'Round') {
                this.findAdditional(axis, start, end, interval);
            }
            else if (padding === 'Normal') {
                this.findNormal(axis, start, end, interval, size);
            }
            else {
                this.updateActualRange(axis, start, end, interval);
            }
        }
        axis.actualRange.delta = axis.actualRange.max - axis.actualRange.min;
        this.calculateVisibleRange(size, axis);
    };
    Double.prototype.updateActualRange = function (axis, minimum, maximum, interval) {
        axis.actualRange = {
            min: axis.minimum != null ? axis.minimum : minimum,
            max: axis.maximum != null ? axis.maximum : maximum,
            interval: axis.interval != null ? axis.interval : interval,
            delta: axis.actualRange.delta
        };
    };
    Double.prototype.findAdditional = function (axis, start, end, interval) {
        var minimum;
        var maximum;
        minimum = Math.floor(start / interval) * interval;
        maximum = Math.ceil(end / interval) * interval;
        if (axis.rangePadding === 'Additional') {
            minimum -= interval;
            maximum += interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    };
    Double.prototype.findNormal = function (axis, start, end, interval, size) {
        var remaining;
        var minimum;
        var maximum;
        var startValue = start;
        if (start < 0) {
            startValue = 0;
            minimum = start + (start * 0.05);
            remaining = interval + (minimum % interval);
            if ((0.365 * interval) >= remaining) {
                minimum -= interval;
            }
            if (minimum % interval < 0) {
                minimum = (minimum - interval) - (minimum % interval);
            }
        }
        else {
            minimum = start < ((5.0 / 6.0) * end) ? 0 : (start - (end - start) * 0.5);
            if (minimum % interval > 0) {
                minimum -= (minimum % interval);
            }
        }
        maximum = (end > 0) ? (end + (end - startValue) * 0.05) : (end - (end - startValue) * 0.05);
        remaining = interval - (maximum % interval);
        if ((0.365 * interval) >= remaining) {
            maximum += interval;
        }
        if (maximum % interval > 0) {
            maximum = (maximum + interval) - (maximum % interval);
        }
        axis.doubleRange = new DoubleRange(minimum, maximum);
        if (minimum === 0) {
            interval = this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size);
            maximum = Math.ceil(maximum / interval) * interval;
        }
        this.updateActualRange(axis, minimum, maximum, interval);
    };
    /**
     * Calculate visible range for axis.
     * @private
     */
    Double.prototype.calculateVisibleRange = function (size, axis) {
        axis.visibleRange = {
            max: axis.actualRange.max, min: axis.actualRange.min,
            delta: axis.actualRange.delta, interval: axis.actualRange.interval
        };
        if (this.chart.chartAreaType === 'Cartesian') {
            var isLazyLoad = sf.base.isNullOrUndefined(axis.zoomingScrollBar) ? false : axis.zoomingScrollBar.isLazyLoad;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && !isLazyLoad) {
                axis.calculateVisibleRangeOnZooming(this.chart);
                axis.calculateAxisRange(size, this.chart);
                axis.visibleRange.interval = (axis.enableAutoIntervalOnZooming && axis.valueType !== 'Category') ?
                    this.calculateNumericNiceInterval(axis, axis.doubleRange.delta, size)
                    : axis.visibleRange.interval;
            }
        }
        axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
    };
    /**
     * Calculate label for the axis.
     * @private
     */
    Double.prototype.calculateVisibleLabels = function (axis, chart) {
        /*! Generate axis labels */
        axis.visibleLabels = [];
        var tempInterval = axis.visibleRange.min;
        var labelStyle;
        var controlName = chart.getModuleName();
        var isPolarRadar = controlName === 'chart' && chart.chartAreaType === 'PolarRadar';
        if (!isPolarRadar && (axis.zoomFactor < 1 || axis.zoomPosition > 0 || this.paddingInterval)) {
            tempInterval = axis.visibleRange.min - (axis.visibleRange.min % axis.visibleRange.interval);
        }
        var format = this.getFormat(axis);
        var isCustom = format.match('{value}') !== null;
        var intervalDigits = 0;
        var formatDigits = 0;
        if (axis.labelFormat && axis.labelFormat.indexOf('n') > -1) {
            formatDigits = parseInt(axis.labelFormat.substring(1, axis.labelFormat.length), 10);
        }
        axis.format = chart.intl.getNumberFormat({
            format: isCustom ? '' : format,
            useGrouping: chart.useGroupingSeparator
        });
        axis.startLabel = axis.format(axis.visibleRange.min);
        axis.endLabel = axis.format(axis.visibleRange.max);
        if (axis.visibleRange.interval && (axis.visibleRange.interval + '').indexOf('.') >= 0) {
            intervalDigits = (axis.visibleRange.interval + '').split('.')[1].length;
        }
        for (; tempInterval <= axis.visibleRange.max; tempInterval += axis.visibleRange.interval) {
            labelStyle = (sf.base.extend({}, sf.base.getValue('properties', axis.labelStyle), null, true));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (tempInterval && (tempInterval + '').indexOf('.') >= 0 && (tempInterval + '').split('.')[1].length > 10) {
            tempInterval = (tempInterval + '').split('.')[1].length > (formatDigits || intervalDigits) ?
                +tempInterval.toFixed(formatDigits || intervalDigits) : tempInterval;
            if (tempInterval <= axis.visibleRange.max) {
                triggerLabelRender(chart, tempInterval, this.formatValue(axis, isCustom, format, tempInterval), labelStyle, axis);
            }
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    };
    /**
     * Format of the axis label.
     * @private
     */
    Double.prototype.getFormat = function (axis) {
        if (axis.labelFormat) {
            if (axis.labelFormat.indexOf('p') === 0 && axis.labelFormat.indexOf('{value}') === -1 && axis.isStack100) {
                return '{value}%';
            }
            return axis.labelFormat;
        }
        return axis.isStack100 ? '{value}%' : '';
    };
    /**
     * Formatted the axis label.
     * @private
     */
    Double.prototype.formatValue = function (axis, isCustom, format, tempInterval) {
        return isCustom ? format.replace('{value}', axis.format(tempInterval))
            : axis.format(tempInterval);
    };
    return Double;
}());

/**
 * Specifies the chart constant value
 */
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
var legendRender = 'legendRender';
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
var axisLabelRender = 'axisLabelRender';
/** @private */

/** @private */
var axisRangeCalculated = 'axisRangeCalculated';
/** @private */

/** @private */
var tooltipRender = 'tooltipRender';
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
var resized = 'resized';
/** @private */
var beforePrint = 'beforePrint';
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/*** @private*/

/*** @private*/

/** @private */

/** @private */
var afterExport = 'afterExport';
/** @private */
var bulletChartMouseClick = 'chartMouseClick';
/** @private */

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
 * Configures the Annotation for chart.
 */
var ChartAnnotationSettings = /** @class */ (function (_super) {
    __extends$4(ChartAnnotationSettings, _super);
    function ChartAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "x", void 0);
    __decorate$3([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "y", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "content", void 0);
    __decorate$3([
        sf.base.Property('Center')
    ], ChartAnnotationSettings.prototype, "horizontalAlignment", void 0);
    __decorate$3([
        sf.base.Property('Pixel')
    ], ChartAnnotationSettings.prototype, "coordinateUnits", void 0);
    __decorate$3([
        sf.base.Property('Chart')
    ], ChartAnnotationSettings.prototype, "region", void 0);
    __decorate$3([
        sf.base.Property('Middle')
    ], ChartAnnotationSettings.prototype, "verticalAlignment", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "xAxisName", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "yAxisName", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "description", void 0);
    return ChartAnnotationSettings;
}(sf.base.ChildProperty));
/**
 * label border properties.
 */
var LabelBorder = /** @class */ (function (_super) {
    __extends$4(LabelBorder, _super);
    function LabelBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property('')
    ], LabelBorder.prototype, "color", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], LabelBorder.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('Rectangle')
    ], LabelBorder.prototype, "type", void 0);
    return LabelBorder;
}(sf.base.ChildProperty));
/**
 * categories for multi level labels
 */
var MultiLevelCategories = /** @class */ (function (_super) {
    __extends$4(MultiLevelCategories, _super);
    function MultiLevelCategories() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "start", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "end", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "text", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "maximumTextWidth", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "customAttributes", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "type", void 0);
    return MultiLevelCategories;
}(sf.base.ChildProperty));
/**
 * Strip line properties
 */
var StripLineSettings = /** @class */ (function (_super) {
    __extends$4(StripLineSettings, _super);
    function StripLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(true)
    ], StripLineSettings.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "startFromAxis", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "start", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "end", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "size", void 0);
    __decorate$3([
        sf.base.Property('#808080')
    ], StripLineSettings.prototype, "color", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property('Auto')
    ], StripLineSettings.prototype, "sizeType", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isRepeat", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatEvery", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatUntil", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isSegmented", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentStart", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentEnd", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentAxisName", void 0);
    __decorate$3([
        sf.base.Complex({ color: 'transparent', width: 1 }, Border)
    ], StripLineSettings.prototype, "border", void 0);
    __decorate$3([
        sf.base.Property('')
    ], StripLineSettings.prototype, "text", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "rotation", void 0);
    __decorate$3([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "horizontalAlignment", void 0);
    __decorate$3([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "verticalAlignment", void 0);
    __decorate$3([
        sf.base.Complex(Theme.stripLineLabelFont, Font)
    ], StripLineSettings.prototype, "textStyle", void 0);
    __decorate$3([
        sf.base.Property('Behind')
    ], StripLineSettings.prototype, "zIndex", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], StripLineSettings.prototype, "opacity", void 0);
    return StripLineSettings;
}(sf.base.ChildProperty));
/**
 * MultiLevelLabels properties
 */
var MultiLevelLabels = /** @class */ (function (_super) {
    __extends$4(MultiLevelLabels, _super);
    function MultiLevelLabels() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property('Center')
    ], MultiLevelLabels.prototype, "alignment", void 0);
    __decorate$3([
        sf.base.Property('Wrap')
    ], MultiLevelLabels.prototype, "overflow", void 0);
    __decorate$3([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], MultiLevelLabels.prototype, "textStyle", void 0);
    __decorate$3([
        sf.base.Complex({ color: null, width: 1, type: 'Rectangle' }, LabelBorder)
    ], MultiLevelLabels.prototype, "border", void 0);
    __decorate$3([
        sf.base.Collection([], MultiLevelCategories)
    ], MultiLevelLabels.prototype, "categories", void 0);
    return MultiLevelLabels;
}(sf.base.ChildProperty));
/**
 * Specifies range for scrollbarSettings property
 * @public
 */
var ScrollbarSettingsRange = /** @class */ (function (_super) {
    __extends$4(ScrollbarSettingsRange, _super);
    function ScrollbarSettingsRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "minimum", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "maximum", void 0);
    return ScrollbarSettingsRange;
}(sf.base.ChildProperty));
/**
 * Scrollbar Settings Properties for Lazy Loading
 */
var ScrollbarSettings = /** @class */ (function (_super) {
    __extends$4(ScrollbarSettings, _super);
    function ScrollbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(false)
    ], ScrollbarSettings.prototype, "enable", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], ScrollbarSettings.prototype, "pointsLength", void 0);
    __decorate$3([
        sf.base.Complex({}, ScrollbarSettingsRange)
    ], ScrollbarSettings.prototype, "range", void 0);
    return ScrollbarSettings;
}(sf.base.ChildProperty));

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
var axisPadding = 5;
/**
 * Configures the `rows` of the chart.
 */
var Row = /** @class */ (function (_super) {
    __extends$3(Row, _super);
    function Row() {
        /**
         * The height of the row as a string accept input both as '100px' and '100%'.
         * If specified as '100%, row renders to the full height of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        return _this;
    }
    /**
     * Measure the row size
     * @return {void}
     * @private
     */
    Row.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var width = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            width += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(width);
        }
        else {
            this.nearSizes.push(width);
        }
    };
    __decorate$2([
        sf.base.Property('100%')
    ], Row.prototype, "height", void 0);
    __decorate$2([
        sf.base.Complex({}, Border)
    ], Row.prototype, "border", void 0);
    return Row;
}(sf.base.ChildProperty));
/**
 * Configures the `columns` of the chart.
 */
var Column = /** @class */ (function (_super) {
    __extends$3(Column, _super);
    function Column() {
        /**
         * The width of the column as a string accepts input both as like '100px' or '100%'.
         * If specified as '100%, column renders to the full width of its chart.
         * @default '100%'
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.axes = [];
        /** @private */
        _this.nearSizes = [];
        /** @private */
        _this.farSizes = [];
        /** @private */
        _this.padding = 0;
        return _this;
    }
    /**
     * Measure the column size
     * @return {void}
     * @private
     */
    Column.prototype.computeSize = function (axis, clipRect, scrollBarHeight) {
        var height = 0;
        var innerPadding = 5;
        if (axis.visible && axis.internalVisibility) {
            height += (axis.findTickSize(axis.crossInAxis) + scrollBarHeight +
                axis.findLabelSize(axis.crossInAxis, innerPadding) + axis.lineStyle.width * 0.5);
        }
        if (axis.opposedPosition) {
            this.farSizes.push(height);
        }
        else {
            this.nearSizes.push(height);
        }
    };
    __decorate$2([
        sf.base.Property('100%')
    ], Column.prototype, "width", void 0);
    __decorate$2([
        sf.base.Complex({}, Border)
    ], Column.prototype, "border", void 0);
    return Column;
}(sf.base.ChildProperty));
/**
 * Configures the major grid lines in the `axis`.
 */
var MajorGridLines = /** @class */ (function (_super) {
    __extends$3(MajorGridLines, _super);
    function MajorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(1)
    ], MajorGridLines.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property('')
    ], MajorGridLines.prototype, "dashArray", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], MajorGridLines.prototype, "color", void 0);
    return MajorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor grid lines in the `axis`.
 */
var MinorGridLines = /** @class */ (function (_super) {
    __extends$3(MinorGridLines, _super);
    function MinorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0.7)
    ], MinorGridLines.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property('')
    ], MinorGridLines.prototype, "dashArray", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], MinorGridLines.prototype, "color", void 0);
    return MinorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the axis line of a chart.
 */
var AxisLine = /** @class */ (function (_super) {
    __extends$3(AxisLine, _super);
    function AxisLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(1)
    ], AxisLine.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AxisLine.prototype, "dashArray", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AxisLine.prototype, "color", void 0);
    return AxisLine;
}(sf.base.ChildProperty));
/**
 * Configures the major tick lines.
 */
var MajorTickLines = /** @class */ (function (_super) {
    __extends$3(MajorTickLines, _super);
    function MajorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(1)
    ], MajorTickLines.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], MajorTickLines.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], MajorTickLines.prototype, "color", void 0);
    return MajorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor tick lines.
 */
var MinorTickLines = /** @class */ (function (_super) {
    __extends$3(MinorTickLines, _super);
    function MinorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(0.7)
    ], MinorTickLines.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], MinorTickLines.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], MinorTickLines.prototype, "color", void 0);
    return MinorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the crosshair ToolTip.
 */
var CrosshairTooltip = /** @class */ (function (_super) {
    __extends$3(CrosshairTooltip, _super);
    function CrosshairTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], CrosshairTooltip.prototype, "enable", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], CrosshairTooltip.prototype, "fill", void 0);
    __decorate$2([
        sf.base.Complex(Theme.crosshairLabelFont, Font)
    ], CrosshairTooltip.prototype, "textStyle", void 0);
    return CrosshairTooltip;
}(sf.base.ChildProperty));
/**
 * Configures the axes in the chart.
 * @public
 */
var Axis = /** @class */ (function (_super) {
    __extends$3(Axis, _super);
    // tslint:disable-next-line:no-any
    function Axis(parent, propName, defaultValue, isArray) {
        var _this = _super.call(this, parent, propName, defaultValue, isArray) || this;
        /** @private */
        _this.visibleLabels = [];
        /** @private */
        _this.series = [];
        /** @private */
        _this.rect = new sf.svgbase.Rect(undefined, undefined, 0, 0);
        /** @private */
        _this.axisBottomLine = null;
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        /** @private */
        _this.angle = _this.labelRotation;
        /** @private */
        _this.isStack100 = false;
        /** @private */
        _this.crossAt = null;
        /** @private */
        _this.updatedRect = null;
        /** @private */
        _this.multiLevelLabelHeight = 0;
        /** @private */
        _this.isChart = true;
        /** @private */
        _this.isIntervalInDecimal = true;
        /** @private */
        _this.titleCollection = [];
        /** @private */
        _this.titleSize = new sf.svgbase.Size(0, 0);
        /**
         * @private
         * Task: BLAZ-2044
         * This property used to hide the axis when series hide from legend click
         */
        _this.internalVisibility = true;
        return _this;
    }
    /**
     * The function used to find tick size.
     * @return {number}
     * @private
     */
    Axis.prototype.findTickSize = function (crossAxis) {
        if (this.tickPosition === 'Inside') {
            return 0;
        }
        if (crossAxis && (!crossAxis.visibleRange || this.isInside(crossAxis.visibleRange))) {
            return 0;
        }
        return this.majorTickLines.height;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.isInside = function (range) {
        return (inside(this.crossAt, range) ||
            (!this.opposedPosition && this.crossAt >= range.max) || (this.opposedPosition && this.crossAt <= range.min));
    };
    /**
     * The function used to find label Size.
     * @return {number}
     * @private
     */
    Axis.prototype.findLabelSize = function (crossAxis, innerPadding) {
        var titleSize = 0;
        var isHorizontal = this.orientation === 'Horizontal';
        if (this.title) {
            this.titleSize = sf.svgbase.measureText(this.title, this.titleStyle);
            titleSize = this.titleSize.height + innerPadding;
            if (this.rect.width || this.rect.height) {
                var length_1 = isHorizontal ? this.rect.width : this.rect.height;
                this.titleCollection = getTitle(this.title, this.titleStyle, length_1);
                titleSize = (titleSize * this.titleCollection.length);
            }
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        var diff;
        var value;
        var labelSize = titleSize + innerPadding + axisPadding + this.labelPadding +
            ((this.orientation === 'Vertical') ? this.maxLabelSize.width : this.maxLabelSize.height) + this.multiLevelLabelHeight;
        if (crossAxis && this.placeNextToAxisLine) {
            var range = crossAxis.visibleRange;
            var size = (crossAxis.orientation === 'Horizontal') ? crossAxis.rect.width : crossAxis.rect.height;
            if (!range || !size) {
                return 0;
            }
            else if (this.isInside(range)) {
                value = this.findDifference(crossAxis);
                diff = (value) * (size / range.delta);
                diff = (value) * ((size - (diff < labelSize ? (labelSize - diff) : 0)) / range.delta);
                labelSize = (diff < labelSize) ? (labelSize - diff) : 0;
            }
        }
        return labelSize;
    };
    /**
     * The function used to find axis position.
     * @return {number}
     * @private
     */
    Axis.prototype.updateCrossValue = function (chart) {
        var value = this.crossAt;
        if (value === null || !this.isInside(this.crossInAxis.visibleRange)) {
            this.updatedRect = this.rect;
            return null;
        }
        var range = this.crossInAxis.visibleRange;
        if (!this.opposedPosition) {
            if (this.crossAt > range.max) {
                value = range.max;
            }
        }
        else {
            if (this.crossAt < range.min) {
                value = range.min;
            }
        }
        this.updatedRect = sf.base.extend({}, this.rect, null, true);
        if (this.orientation === 'Horizontal') {
            value = this.crossInAxis.rect.height - (valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.height);
            this.updatedRect.y = this.crossInAxis.rect.y + value;
        }
        else {
            value = valueToCoefficient(value, this.crossInAxis) * this.crossInAxis.rect.width;
            this.updatedRect.x = this.crossInAxis.rect.x + value;
        }
    };
    Axis.prototype.findDifference = function (crossAxis) {
        var value = 0;
        if (this.opposedPosition) {
            value = crossAxis.isInversed ? crossAxis.visibleRange.min : crossAxis.visibleRange.max;
        }
        else {
            value = crossAxis.isInversed ? crossAxis.visibleRange.max : crossAxis.visibleRange.min;
        }
        return Math.abs(this.crossAt - value);
    };
    /**
     * Calculate visible range for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateVisibleRangeOnZooming = function (chart) {
        if (isZoomSet(this)) {
            var baseRange = this.actualRange;
            var start = void 0;
            var end = void 0;
            if (!this.isInversed || chart.zoomModule) {
                start = this.actualRange.min + this.zoomPosition * this.actualRange.delta;
                end = start + this.zoomFactor * this.actualRange.delta;
            }
            else {
                start = this.actualRange.max - (this.zoomPosition * this.actualRange.delta);
                end = start - (this.zoomFactor * this.actualRange.delta);
            }
            if (start < baseRange.min) {
                end = end + (baseRange.min - start);
                start = baseRange.min;
            }
            if (end > baseRange.max) {
                start = start - (end - baseRange.max);
                end = baseRange.max;
            }
            this.doubleRange = new DoubleRange(start, end);
            this.visibleRange = { min: this.doubleRange.start, max: this.doubleRange.end,
                delta: this.doubleRange.delta, interval: this.visibleRange.interval };
        }
    };
    /**
     * Calculate range for x and y axis after zoom.
     * @return {void}
     * @private
     */
    Axis.prototype.calculateAxisRange = function (size, chart) {
        if (chart.enableAutoIntervalOnBothAxis) {
            if (this.orientation === 'Horizontal' && chart.zoomSettings.mode === 'X') {
                for (var i = 0; i < this.series.length; i++) {
                    var yValue = [];
                    for (var _i = 0, _a = this.series[i].visiblePoints; _i < _a.length; _i++) {
                        var points = _a[_i];
                        if ((points.xValue > this.visibleRange.min) && (points.xValue < this.visibleRange.max)) {
                            yValue.push(points.yValue);
                        }
                    }
                    for (var _b = 0, _c = chart.axisCollections; _b < _c.length; _b++) {
                        var axis = _c[_b];
                        if (axis.orientation === 'Vertical' && !sf.base.isNullOrUndefined(axis.series[i])) {
                            axis.series[i].yMin = Math.min.apply(Math, yValue);
                            axis.series[i].yMax = Math.max.apply(Math, yValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
            if (this.orientation === 'Vertical' && chart.zoomSettings.mode === 'Y') {
                for (var i = 0; i < this.series.length; i++) {
                    var xValue = [];
                    for (var _d = 0, _e = this.series[i].visiblePoints; _d < _e.length; _d++) {
                        var points = _e[_d];
                        if ((points.yValue > this.visibleRange.min) && (points.yValue < this.visibleRange.max)) {
                            xValue.push(points.xValue);
                        }
                    }
                    for (var _f = 0, _g = chart.axisCollections; _f < _g.length; _f++) {
                        var axis = _g[_f];
                        if (axis.orientation === 'Horizontal' && !sf.base.isNullOrUndefined(axis.series[i])) {
                            axis.series[i].xMin = Math.min.apply(Math, xValue);
                            axis.series[i].xMax = Math.max.apply(Math, xValue);
                            axis.baseModule.calculateRangeAndInterval(size, axis);
                        }
                    }
                }
            }
        }
    };
    /**
     * Triggers the event.
     * @return {void}
     * @private
     */
    Axis.prototype.triggerRangeRender = function (chart, minimum, maximum, interval) {
        var argsData;
        argsData = {
            cancel: false, name: axisRangeCalculated, axis: this,
            minimum: minimum, maximum: maximum, interval: interval
        };
        chart.trigger(axisRangeCalculated, argsData);
        if (!argsData.cancel) {
            this.visibleRange = { min: argsData.minimum, max: argsData.maximum, interval: argsData.interval,
                delta: argsData.maximum - argsData.minimum };
        }
    };
    /**
     * Calculate padding for the axis.
     * @return {string}
     * @private
     */
    Axis.prototype.getRangePadding = function (chart) {
        var padding = this.rangePadding;
        if (padding !== 'Auto') {
            return padding;
        }
        switch (this.orientation) {
            case 'Horizontal':
                if (chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
            case 'Vertical':
                if (!chart.requireInvertedAxis) {
                    padding = (this.isStack100 || this.baseModule.chart.stockChart ? 'Round' : 'Normal');
                }
                else {
                    padding = 'None';
                }
                break;
        }
        return padding;
    };
    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    Axis.prototype.getMaxLabelWidth = function (chart) {
        var pointX;
        var previousEnd = 0;
        var isIntersect = false;
        var isAxisLabelBreak;
        this.angle = this.labelRotation;
        this.maxLabelSize = new sf.svgbase.Size(0, 0);
        var action = this.labelIntersectAction;
        var label;
        for (var i = 0, len = this.visibleLabels.length; i < len; i++) {
            label = this.visibleLabels[i];
            isAxisLabelBreak = isBreakLabel(label.originalText);
            if (isAxisLabelBreak) {
                label.size = sf.svgbase.measureText(label.originalText.replace(/<br>/g, ' '), this.labelStyle);
                label.breakLabelSize = sf.svgbase.measureText(this.enableTrim ? label.text.join('<br>') : label.originalText, this.labelStyle);
            }
            else {
                label.size = sf.svgbase.measureText(label.text, this.labelStyle);
            }
            var width = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
            if (width > this.maxLabelSize.width) {
                this.maxLabelSize.width = width;
                this.rotatedLabel = label.text;
            }
            var height = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
            if (height > this.maxLabelSize.height) {
                this.maxLabelSize.height = height;
            }
            if (isAxisLabelBreak) {
                label.text = this.enableTrim ? label.text : label.originalText.split('<br>');
            }
            if (action === 'None' || action === 'Hide' || action === 'Trim') {
                continue;
            }
            if ((action !== 'None' || this.angle % 360 === 0) && this.orientation === 'Horizontal' &&
                this.rect.width > 0 && !isIntersect) {
                var width1 = isAxisLabelBreak ? label.breakLabelSize.width : label.size.width;
                var height1 = isAxisLabelBreak ? label.breakLabelSize.height : label.size.height;
                pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
                pointX -= width1 / 2;
                if (this.edgeLabelPlacement === 'Shift') {
                    if (i === 0 && pointX < this.rect.x) {
                        pointX = this.rect.x;
                    }
                    if (i === this.visibleLabels.length - 1 && ((pointX + width1) > (this.rect.x + this.rect.width))) {
                        pointX = this.rect.x + this.rect.width - width1;
                    }
                }
                switch (action) {
                    case 'MultipleRows':
                        if (i > 0) {
                            this.findMultiRows(i, pointX, label, isAxisLabelBreak);
                        }
                        break;
                    case 'Rotate45':
                    case 'Rotate90':
                        if (i > 0 && (!this.isInversed ? pointX <= previousEnd : pointX + width1 >= previousEnd)) {
                            this.angle = (action === 'Rotate45') ? 45 : 90;
                            isIntersect = true;
                        }
                        break;
                    default:
                        if (isAxisLabelBreak) {
                            var result = void 0;
                            var result1 = [];
                            var str = void 0;
                            for (var index = 0; index < label.text.length; index++) {
                                result = textWrap(label.text[index], this.rect.width / this.visibleLabels.length, this.labelStyle);
                                if (result.length > 1) {
                                    for (var j = 0; j < result.length; j++) {
                                        str = result[j];
                                        result1.push(str);
                                    }
                                }
                                else {
                                    result1.push(result[0]);
                                }
                            }
                            label.text = result1;
                        }
                        else {
                            label.text = textWrap(label.text, this.rect.width / this.visibleLabels.length, this.labelStyle);
                        }
                        var height_1 = (height1 * label.text.length);
                        if (height_1 > this.maxLabelSize.height) {
                            this.maxLabelSize.height = height_1;
                        }
                        break;
                }
                previousEnd = this.isInversed ? pointX : pointX + width1;
            }
        }
        if (this.angle !== 0 && this.orientation === 'Horizontal') {
            //I264474: Fix for datasource bind im mounted console error ocurred
            this.rotatedLabel = sf.base.isNullOrUndefined(this.rotatedLabel) ? '' : this.rotatedLabel;
            if (isBreakLabel(this.rotatedLabel)) {
                this.maxLabelSize = sf.svgbase.measureText(this.rotatedLabel, this.labelStyle);
            }
            else {
                this.maxLabelSize = rotateTextSize(this.labelStyle, this.rotatedLabel, this.angle, chart);
            }
        }
        if (chart.multiLevelLabelModule && this.multiLevelLabels.length > 0) {
            chart.multiLevelLabelModule.getMultilevelLabelsHeight(this);
        }
    };
    /**
     * Finds the multiple rows for axis.
     * @return {void}
     */
    Axis.prototype.findMultiRows = function (length, currentX, currentLabel, isBreakLabels) {
        var label;
        var pointX;
        var width2;
        var store = [];
        var isMultiRows;
        for (var i = length - 1; i >= 0; i--) {
            label = this.visibleLabels[i];
            width2 = isBreakLabels ? label.breakLabelSize.width : label.size.width;
            pointX = (valueToCoefficient(label.value, this) * this.rect.width) + this.rect.x;
            isMultiRows = !this.isInversed ? currentX < (pointX + width2 * 0.5) :
                currentX + currentLabel.size.width > (pointX - width2 * 0.5);
            if (isMultiRows) {
                store.push(label.index);
                currentLabel.index = (currentLabel.index > label.index) ? currentLabel.index : label.index + 1;
            }
            else {
                currentLabel.index = store.indexOf(label.index) > -1 ? currentLabel.index : label.index;
            }
        }
        var height = ((isBreakLabels ? currentLabel.breakLabelSize.height : currentLabel.size.height) * currentLabel.index) +
            (5 * (currentLabel.index - 1));
        if (height > this.maxLabelSize.height) {
            this.maxLabelSize.height = height;
        }
    };
    /**
     * Finds the default module for axis.
     * @return {void}
     * @private
     */
    Axis.prototype.getModule = function (chart) {
        if (this.valueType === 'Double') {
            this.baseModule = new Double(chart);
        }
        else {
            this.baseModule = chart[firstToLowerCase(this.valueType) + 'Module'];
        }
    };
    __decorate$2([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], Axis.prototype, "labelStyle", void 0);
    __decorate$2([
        sf.base.Complex({}, CrosshairTooltip)
    ], Axis.prototype, "crosshairTooltip", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Axis.prototype, "title", void 0);
    __decorate$2([
        sf.base.Complex(Theme.axisTitleFont, Font)
    ], Axis.prototype, "titleStyle", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Axis.prototype, "labelFormat", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Axis.prototype, "skeleton", void 0);
    __decorate$2([
        sf.base.Property('DateTime')
    ], Axis.prototype, "skeletonType", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "plotOffset", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetLeft", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetTop", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetRight", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetBottom", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Axis.prototype, "isIndexed", void 0);
    __decorate$2([
        sf.base.Property(10)
    ], Axis.prototype, "logBase", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "columnIndex", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "rowIndex", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Axis.prototype, "span", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "desiredIntervals", void 0);
    __decorate$2([
        sf.base.Property(3)
    ], Axis.prototype, "maximumLabels", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], Axis.prototype, "zoomFactor", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "zoomPosition", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Axis.prototype, "enableScrollbarOnZooming", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Axis.prototype, "opposedPosition", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Axis.prototype, "enableAutoIntervalOnZooming", void 0);
    __decorate$2([
        sf.base.Property('Auto')
    ], Axis.prototype, "rangePadding", void 0);
    __decorate$2([
        sf.base.Property('Double')
    ], Axis.prototype, "valueType", void 0);
    __decorate$2([
        sf.base.Property('None')
    ], Axis.prototype, "edgeLabelPlacement", void 0);
    __decorate$2([
        sf.base.Property('Auto')
    ], Axis.prototype, "intervalType", void 0);
    __decorate$2([
        sf.base.Property('BetweenTicks')
    ], Axis.prototype, "labelPlacement", void 0);
    __decorate$2([
        sf.base.Property('Outside')
    ], Axis.prototype, "tickPosition", void 0);
    __decorate$2([
        sf.base.Property('Outside')
    ], Axis.prototype, "labelPosition", void 0);
    __decorate$2([
        sf.base.Property('')
    ], Axis.prototype, "name", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Axis.prototype, "visible", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "minorTicksPerInterval", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "labelRotation", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "crossesAt", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Axis.prototype, "placeNextToAxisLine", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "crossesInAxis", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "minimum", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "maximum", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "interval", void 0);
    __decorate$2([
        sf.base.Property(34)
    ], Axis.prototype, "maximumLabelWidth", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Axis.prototype, "enableTrim", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], Axis.prototype, "labelPadding", void 0);
    __decorate$2([
        sf.base.Complex({}, MajorTickLines)
    ], Axis.prototype, "majorTickLines", void 0);
    __decorate$2([
        sf.base.Complex({}, MinorTickLines)
    ], Axis.prototype, "minorTickLines", void 0);
    __decorate$2([
        sf.base.Complex({}, MajorGridLines)
    ], Axis.prototype, "majorGridLines", void 0);
    __decorate$2([
        sf.base.Complex({}, MinorGridLines)
    ], Axis.prototype, "minorGridLines", void 0);
    __decorate$2([
        sf.base.Complex({}, AxisLine)
    ], Axis.prototype, "lineStyle", void 0);
    __decorate$2([
        sf.base.Property('Trim')
    ], Axis.prototype, "labelIntersectAction", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], Axis.prototype, "isInversed", void 0);
    __decorate$2([
        sf.base.Property(100)
    ], Axis.prototype, "coefficient", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], Axis.prototype, "startAngle", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], Axis.prototype, "startFromZero", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], Axis.prototype, "description", void 0);
    __decorate$2([
        sf.base.Property(2)
    ], Axis.prototype, "tabIndex", void 0);
    __decorate$2([
        sf.base.Collection([], StripLineSettings)
    ], Axis.prototype, "stripLines", void 0);
    __decorate$2([
        sf.base.Collection([], MultiLevelLabels)
    ], Axis.prototype, "multiLevelLabels", void 0);
    __decorate$2([
        sf.base.Complex({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    ], Axis.prototype, "border", void 0);
    __decorate$2([
        sf.base.Complex({}, ScrollbarSettings)
    ], Axis.prototype, "scrollbarSettings", void 0);
    return Axis;
}(sf.base.ChildProperty));
/** @private */
var VisibleLabels = /** @class */ (function () {
    function VisibleLabels(text, value, labelStyle, originalText, size, breakLabelSize, index) {
        if (size === void 0) { size = new sf.svgbase.Size(0, 0); }
        if (breakLabelSize === void 0) { breakLabelSize = new sf.svgbase.Size(0, 0); }
        if (index === void 0) { index = 1; }
        this.text = text;
        this.originalText = originalText;
        this.value = value;
        this.labelStyle = labelStyle;
        this.size = size;
        this.breakLabelSize = breakLabelSize;
        this.index = 1;
    }
    return VisibleLabels;
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
/**
 * Function to sort the dataSource, by default it sort the data in ascending order.
 * @param  {Object} data
 * @param  {string} fields
 * @param  {boolean} isDescending
 * @returns Object
 */

/** @private */
function isBreakLabel(label) {
    return label.indexOf('<br>') !== -1;
}

/** @private */
function rotateTextSize(font, text, angle, chart) {
    var renderer = new sf.svgbase.SvgRenderer(chart.element.id);
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
    if (!chart.delayRedraw && !chart.redraw) {
        chart.element.appendChild(chart.svgObject);
    }
    chart.svgObject.appendChild(htmlObject);
    box = htmlObject.getBoundingClientRect();
    sf.base.remove(htmlObject);
    if (!chart.delayRedraw && !chart.redraw) {
        sf.base.remove(chart.svgObject);
    }
    return new sf.svgbase.Size((box.right - box.left), (box.bottom - box.top));
}
/** @private */
function removeElement(id) {
    if (!id) {
        return null;
    }
    var element = typeof id === 'string' ? getElement(id) : id;
    if (element) {
        sf.base.remove(element);
    }
}
/** @private */
function logBase(value, base) {
    return Math.log(value) / Math.log(base);
}
/** @private */
function showTooltip(text, x, y, areaWidth, id, element, isTouch, isTitleOrLegendEnabled) {
    //let id1: string = 'EJ2_legend_tooltip';
    var tooltip = document.getElementById(id);
    var size = sf.svgbase.measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    });
    var width = size.width + 5;
    x = (x + width > areaWidth) ? x - (width + 15) : x;
    y = isTitleOrLegendEnabled ? (y - size.height / 2) : y + 15;
    if (!tooltip) {
        tooltip = sf.base.createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        element.appendChild(tooltip);
        var left = parseInt(tooltip.style.left.replace('px', ''), 10);
        if (left < 0) {
            tooltip.style.left = '0px';
        }
    }
    else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (isTouch) {
        setTimeout(function () { removeElement(id); }, 1500);
    }
}
/** @private */
function inside(value, range) {
    return (value < range.max) && (value > range.min);
}
/** @private */
function withIn(value, range) {
    return (value <= range.max) && (value >= range.min);
}
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
function subtractThickness(rect, thickness) {
    rect.x += thickness.left;
    rect.y += thickness.top;
    rect.width -= thickness.left + thickness.right;
    rect.height -= thickness.top + thickness.bottom;
    return rect;
}
/** @private */

/** @private */
function degreeToLocation(degree, radius, center) {
    var radian = (degree * Math.PI) / 180;
    return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/** @private */

/** @private */

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */

function getAccumulationLegend(locX, locY, r, height, width, mode) {
    var cartesianlarge = degreeToLocation(270, r, new ChartLocation(locX, locY));
    var cartesiansmall = degreeToLocation(270, r, new ChartLocation(locX + (width / 10), locY));
    return 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + ' ' + (locX + r) + ' ' + (locY) + ' ' + 'A' + ' ' + (r) + ' ' + (r) +
        ' ' + 0 + ' ' + 1 + ' ' + 1 + ' ' + cartesianlarge.x + ' ' + cartesianlarge.y + ' ' + 'Z' + ' ' + 'M' + ' ' + (locX +
        (width / 10)) + ' ' + (locY - (height / 10)) + ' ' + 'L' + (locX + (r)) + ' ' + (locY - height / 10) + ' ' + 'A' + ' '
        + (r) + ' ' + (r) + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + cartesiansmall.x + ' ' + cartesiansmall.y + ' ' + 'Z';
}
/** @private */

/** @private */

/** @private */
function valueToCoefficient(value, axis) {
    var range = axis.visibleRange;
    var result = (value - range.min) / (range.delta);
    return axis.isInversed ? (1 - result) : result;
}
/** @private */

/**
 * method to find series, point index by element id
 * @private
 */

/** @private */

/** @private */

/** @private */

/** @private */

//Within bounds
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
function firstToLowerCase(str) {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
/** @private */

/** @private */
function getMinPointsDelta(axis, seriesCollection) {
    var minDelta = Number.MAX_VALUE;
    var xValues;
    var minVal;
    var seriesMin;
    for (var index = 0; index < seriesCollection.length; index++) {
        var series = seriesCollection[index];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null)
                || (axis.name === series.chart.primaryXAxis.name && !series.xAxisName))) {
            xValues = series.points.map(function (point, index) {
                return point.xValue;
            });
            xValues.sort(function (first, second) { return first - second; });
            if (xValues.length === 1) {
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - 2592000000) : series.xMin;
                minVal = xValues[0] - (!sf.base.isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            }
            else {
                for (var index_1 = 0; index_1 < xValues.length; index_1++) {
                    var value = xValues[index_1];
                    if (index_1 > 0 && value) {
                        minVal = value - xValues[index_1 - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                }
            }
        }
    }
    if (minDelta === Number.MAX_VALUE) {
        minDelta = 1;
    }
    return minDelta;
}
/** @private */
function getAnimationFunction(effect) {
    var functionName;
    switch (effect) {
        case 'Linear':
            functionName = linear;
            break;
    }
    return functionName;
}
/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */
function linear(currentTime, startValue, endValue, duration) {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}
/**
 * Animation Effect Calculation End
 * @private
 */

/**
 * Animate the rect element
 */
function animateRectElement(element, delay, duration, currentRect, previousRect) {
    var setStyle = function (rect) {
        element.setAttribute('x', rect.x + '');
        element.setAttribute('y', rect.y + '');
        element.setAttribute('width', rect.width + '');
        element.setAttribute('height', rect.height + '');
    };
    new sf.base.Animation({}).animate(sf.base.createElement('div'), {
        duration: duration,
        delay: delay,
        name: name,
        progress: function (args) {
            setStyle(new sf.svgbase.Rect(linear(args.timeStamp, previousRect.x, currentRect.x - previousRect.x, args.duration), linear(args.timeStamp, previousRect.y, currentRect.y - previousRect.y, args.duration), linear(args.timeStamp, previousRect.width, currentRect.width - previousRect.width, args.duration), linear(args.timeStamp, previousRect.height, currentRect.height - previousRect.height, args.duration)));
        },
        end: function () {
            setStyle(currentRect);
        },
    });
}
/**
 * Animation after legend click a path
 * @param element element to be animated
 * @param direction current direction of the path
 * @param previousDirection previous direction of the path
 */
function pathAnimation(element, direction, redraw, previousDirection, animateDuration) {
    if (!redraw || (!previousDirection && !element)) {
        return null;
    }
    var duration = 300;
    if (animateDuration) {
        duration = animateDuration;
    }
    var startDirections = previousDirection || element.getAttribute('d');
    var splitDirections = startDirections.split(/(?=[LMCZAQ])/);
    var endDirections = direction.split(/(?=[LMCZAQ])/);
    var currentDireciton;
    var startPath = [];
    var endPath = [];
    var c;
    var end;
    element.setAttribute('d', startDirections);
    new sf.base.Animation({}).animate(sf.base.createElement('div'), {
        duration: duration,
        progress: function (args) {
            currentDireciton = '';
            splitDirections.map(function (directions, index) {
                startPath = directions.split(' ');
                endPath = endDirections[index] ? endDirections[index].split(' ') : startPath;
                if (startPath[0] === 'Z') {
                    currentDireciton += 'Z' + ' ';
                }
                else {
                    currentDireciton += startPath[0] + ' ' +
                        linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                }
                if (startPath[0] === 'C' || startPath[0] === 'Q') {
                    c = 3;
                    end = startPath[0] === 'Q' ? 4 : 6;
                    while (c < end) {
                        currentDireciton += linear(args.timeStamp, +startPath[c], (+endPath[c] - +startPath[c]), args.duration) + ' ' +
                            linear(args.timeStamp, +startPath[++c], (+endPath[c] - +startPath[c]), args.duration) + ' ';
                        ++c;
                    }
                }
                if (startPath[0] === 'A') {
                    currentDireciton += 0 + ' ' + 0 + ' ' + 1 + ' ' +
                        linear(args.timeStamp, +startPath[6], (+endPath[6] - +startPath[6]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[7], (+endPath[7] - +startPath[7]), args.duration) + ' ';
                }
            });
            element.setAttribute('d', currentDireciton);
        },
        end: function () {
            element.setAttribute('d', direction);
        }
    });
}
/**
 * To append the clip rect element
 * @param redraw
 * @param options
 * @param renderer
 * @param clipPath
 */

/**
 * Triggers the event.
 * @return {void}
 * @private
 */
function triggerLabelRender(chart, tempInterval, text, labelStyle, axis) {
    var argsData;
    argsData = {
        cancel: false, name: axisLabelRender, axis: axis,
        text: text, value: tempInterval, labelStyle: labelStyle
    };
    chart.trigger(axisLabelRender, argsData);
    if (!argsData.cancel) {
        var isLineBreakLabels = argsData.text.indexOf('<br>') !== -1;
        var text_1 = (axis.enableTrim) ? (isLineBreakLabels ?
            lineBreakLabelTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle) :
            textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle)) : argsData.text;
        axis.visibleLabels.push(new VisibleLabels(text_1, argsData.value, argsData.labelStyle, argsData.text));
    }
}
/**
 * The function used to find whether the range is set.
 * @return {boolean}
 * @private
 */
function setRange(axis) {
    return (axis.minimum != null && axis.maximum != null);
}
/**
 * To check whether the axis is zoomed or not.
 * @param axis
 */
function isZoomSet(axis) {
    return (axis.zoomFactor < 1 && axis.zoomPosition >= 0);
}
/**
 * Calculate desired interval for the axis.
 * @return {void}
 * @private
 */
function getActualDesiredIntervalsCount(availableSize, axis) {
    var size = axis.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
    if (sf.base.isNullOrUndefined(axis.desiredIntervals)) {
        var desiredIntervalsCount = (axis.orientation === 'Horizontal' ? 0.533 : 1) * axis.maximumLabels;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    }
    else {
        return axis.desiredIntervals;
    }
}
/**
 * Animation for template
 * @private
 */
function templateAnimate(element, delay, duration, name, isRemove) {
    new sf.base.Animation({}).animate(element, {
        duration: duration,
        delay: delay,
        name: name,
        progress: function (args) {
            args.element.style.visibility = 'visible';
        },
        end: function (args) {
            if (isRemove) {
                sf.base.remove(args.element);
            }
            else {
                args.element.style.visibility = 'visible';
            }
        },
    });
}
/** @private */
function drawSymbol(location, shape, size, url, options, label, renderer, clipRect, isChartControl, control) {
    var chartRenderer = renderer ? renderer : new sf.svgbase.SvgRenderer('');
    var shapeOption = calculateShapes(location, size, shape, options, url, isChartControl, control);
    var drawElement = chartRenderer['draw' + shapeOption.functionName](shapeOption.renderOption, clipRect ? new Int32Array([clipRect.x, clipRect.y]) : null);
    //drawElement.setAttribute('aria-label', label);
    return drawElement;
}
/** @private */
// tslint:disable-next-line:max-func-body-length
function calculateShapes(location, size, shape, options, url, isChart, control) {
    var dir;
    var functionName = 'Path';
    var isBulletChart = isChart;
    var width = (isBulletChart && shape === 'Circle') ? (size.width - 2) : size.width;
    var height = (isBulletChart && shape === 'Circle') ? (size.height - 2) : size.height;
    var sizeBullet = (isBulletChart) ? control.targetWidth : 0;
    var lx = location.x;
    var ly = location.y;
    var y = location.y + (-height / 2);
    var x = location.x + (-width / 2);
    switch (shape) {
        case 'Bubble':
        case 'Circle':
            functionName = 'Ellipse';
            sf.base.merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': lx, 'cy': ly });
            break;
        case 'Cross':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' +
                (ly + (-height / 2));
            sf.base.merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'Multiply':
            dir = 'M ' + (lx - sizeBullet) + ' ' + (ly - sizeBullet) + ' L ' +
                (lx + sizeBullet) + ' ' + (ly + sizeBullet) + ' M ' +
                (lx - sizeBullet) + ' ' + (ly + sizeBullet) + ' L ' + (lx + sizeBullet) + ' ' + (ly - sizeBullet);
            sf.base.merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'HorizontalLine':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly;
            sf.base.merge(options, { 'd': dir });
            break;
        case 'VerticalLine':
            dir = 'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' + (ly + (-height / 2));
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Diamond':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + ly + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'ActualRect':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 8)) + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'TargetRect':
            dir = 'M' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Rectangle':
        case 'Hilo':
        case 'HiloOpenClose':
        case 'Candle':
        case 'Waterfall':
        case 'BoxAndWhisker':
        case 'StepArea':
        case 'StackingStepArea':
        case 'Square':
        case 'Flag':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 2)) + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Pyramid':
        case 'Triangle':
            dir = 'M' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Funnel':
        case 'InvertedTriangle':
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx - (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Pentagon':
            var eq = 72;
            var xVal = void 0;
            var yVal = void 0;
            for (var i = 0; i <= 5; i++) {
                xVal = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yVal = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    dir = 'M' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ';
                }
                else {
                    dir = dir.concat('L' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ');
                }
            }
            dir = dir.concat('Z');
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Image':
            functionName = 'Image';
            sf.base.merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    options = calculateLegendShapes(location, new sf.svgbase.Size(width, height), shape, options).renderOption;
    return { renderOption: options, functionName: functionName };
}
/** @private */

/** @private */

/** @private */
function getElement(id) {
    return document.getElementById(id);
}
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/**
 * Method to append child element
 * @param parent
 * @param childElement
 * @param isReplace
 */
function appendChildElement(isCanvas, parent, childElement, redraw, isAnimate, x, y, start, direction, forceAnimate, isRect, previousRect, animateDuration) {
    if (isAnimate === void 0) { isAnimate = false; }
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    if (forceAnimate === void 0) { forceAnimate = false; }
    if (isRect === void 0) { isRect = false; }
    if (previousRect === void 0) { previousRect = null; }
    if (isCanvas) {
        return null;
    }
    var existChild = parent.querySelector('#' + childElement.id);
    var element = (existChild || getElement(childElement.id));
    var child = childElement;
    var duration = animateDuration ? animateDuration : 300;
    if (redraw && isAnimate && element) {
        start = start || (element.tagName === 'DIV' ?
            new ChartLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
            new ChartLocation(+element.getAttribute(x), +element.getAttribute(y)));
        if (direction && direction !== 'undefined') {
            pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction, duration);
        }
        else if (isRect && previousRect) {
            animateRectElement(child, 0, duration, new sf.svgbase.Rect(+element.getAttribute('x'), +element.getAttribute('y'), +element.getAttribute('width'), +element.getAttribute('height')), previousRect);
        }
        else {
            var end = child.tagName === 'DIV' ?
                new ChartLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                new ChartLocation(+child.getAttribute(x), +child.getAttribute(y));
            animateRedrawElement(child, duration, start, end, x, y);
        }
    }
    else if (redraw && isAnimate && !element && forceAnimate) {
        templateAnimate(child, 0, 600, 'FadeIn');
    }
    if (existChild) {
        parent.replaceChild(child, element);
    }
    else {
        parent.appendChild(child);
    }
}
/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */

/** @private */
// tslint:disable-next-line:max-func-body-length
function calculateLegendShapes(location, size, shape, options) {
    var padding = 10;
    var dir = '';
    var space = 2;
    var height = size.height;
    var width = size.width;
    var lx = location.x;
    var ly = location.y;
    switch (shape) {
        case 'MultiColoredLine':
        case 'Line':
        case 'StackingLine':
        case 'StackingLine100':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly);
            sf.base.merge(options, { 'd': dir });
            break;
        case 'StepLine':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx + (-width / 2) - (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx +
                (-width / 2) + (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 2) + (width / 10))
                + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10)) + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10))
                + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' +
                ' ' + (lx + (width / 5)) + ' ' + (ly + (-height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly +
                (-height / 2)) + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + '' + (lx + (width / 2)
                + (padding / 4)) + ' ' + (ly + (height / 2));
            sf.base.merge(options, { 'd': dir });
            break;
        case 'UpArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) +
                'L' + ' ' + (lx + (width / 2) - space) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly - (height / 2) + (2 * space)) +
                'L' + (lx - (width / 2) + space) + ' ' + (ly + (height / 2)) + ' Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'DownArrow':
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) +
                'L' + ' ' + (lx + (width / 2) - space) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly + (height / 2) - (2 * space)) +
                'L' + (lx - (width / 2) + space) + ' ' + (ly - (height / 2)) + ' Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'RightArrow':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (-width / 2)) + ' ' + (ly + (height / 2)) + ' L' + ' ' + (lx + (-width / 2)) + ' ' +
                (ly + (height / 2) - space) + ' ' + 'L' + ' ' + (lx + (width / 2) - (2 * space)) + ' ' + (ly) +
                ' L' + (lx + (-width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2) - space) + ' L' + ' ' + (lx + (-width / 2) + (2 * space))
                + ' ' + (ly) + ' L' + (lx + (width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Column':
        case 'Pareto':
        case 'StackingColumn':
        case 'StackingColumn100':
        case 'RangeColumn':
        case 'Histogram':
            dir = 'M' + ' ' + (lx - 3 * (width / 5)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx - 3 *
                (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' +
                (lx + (-width / 10) - (width / 20)) + ' ' + (ly - (height / 4) - (padding / 2))
                + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly - (height / 4) -
                (padding / 2)) + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly
                + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 10) - (width / 20)) + ' ' + (ly +
                (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + 3 * (width / 5)) + ' ' + (ly) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
            dir = 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 5)) + ' '
                + 'L' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'L' + ' ' +
                (lx - (width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'Z' + ' '
                + 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - (height / 5)
                + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4)) + ' ' + (ly
                - (height / 5) + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4))
                + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'L' + ' ' + (lx - (width / 2)
                + (-padding / 4)) + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + (lx - (width / 2) + (-padding / 4)) + ' ' + (ly + (height / 5)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 5)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 2)
                + (padding / 10)) + ' ' + 'L' + ' ' + (lx - (width / 2) + (-padding / 4))
                + ' ' + (ly + (height / 2) + (padding / 10)) + ' ' + 'Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Spline':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' '
                + lx + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5))
                + ' ' + 'M' + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx
                + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2));
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Area':
        case 'MultiColoredArea':
        case 'RangeArea':
        case 'StackingArea':
        case 'StackingArea100':
            dir = 'M' + ' ' + (lx - (width / 2) - (padding / 4)) + ' ' + (ly + (height / 2))
                + ' ' + 'L' + ' ' + (lx + (-width / 4) + (-padding / 8)) + ' ' + (ly - (height / 2))
                + ' ' + 'L' + ' ' + (lx) + ' ' + (ly + (height / 4)) + ' ' + 'L' + ' ' + (lx
                + (width / 4) + (padding / 8)) + ' ' + (ly + (-height / 2) + (height / 4)) + ' '
                + 'L' + ' ' + (lx + (height / 2) + (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'SplineArea':
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + lx
                + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx + (width / 2)) + ' '
                + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2)) + ' ' + ' Z';
            sf.base.merge(options, { 'd': dir });
            break;
        case 'Pie':
        case 'Doughnut':
            options.stroke = 'transparent';
            var r = Math.min(height, width) / 2;
            dir = getAccumulationLegend(lx, ly, r, height, width, shape);
            sf.base.merge(options, { 'd': dir });
            break;
    }
    return { renderOption: options };
}
/** @private */
function textTrim(maxWidth, text, font) {
    var label = text;
    var size = sf.svgbase.measureText(text, font).width;
    if (size > maxWidth) {
        var textLength = text.length;
        for (var i = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = sf.svgbase.measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/**
 * To trim the line break label
 * @param maxWidth
 * @param text
 * @param font
 */
function lineBreakLabelTrim(maxWidth, text, font) {
    var labelCollection = [];
    var breakLabels = text.split('<br>');
    for (var i = 0; i < breakLabels.length; i++) {
        text = breakLabels[i];
        var size = sf.svgbase.measureText(text, font).width;
        if (size > maxWidth) {
            var textLength = text.length;
            for (var i_1 = textLength - 1; i_1 >= 0; --i_1) {
                text = text.substring(0, i_1) + '...';
                size = sf.svgbase.measureText(text, font).width;
                if (size <= maxWidth) {
                    labelCollection.push(text);
                    break;
                }
            }
        }
        else {
            labelCollection.push(text);
        }
    }
    return labelCollection;
}
/** @private */
function stringToNumber(value, containerSize) {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
function redrawElement(redraw, id, options, renderer) {
    if (!redraw) {
        return null;
    }
    var element = getElement(id);
    if (element && options) {
        renderer.setElementAttributes(options, element.tagName === 'clipPath' ? element.childNodes[0] : element);
    }
    return element;
}
/** @private */
function animateRedrawElement(element, duration, start, end, x, y) {
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    var isDiv = element.tagName === 'DIV';
    var setStyle = function (xValue, yValue) {
        if (isDiv) {
            element.style[x] = xValue + 'px';
            element.style[y] = yValue + 'px';
        }
        else {
            element.setAttribute(x, xValue + '');
            element.setAttribute(y, yValue + '');
        }
    };
    setStyle(start.x, start.y);
    new sf.base.Animation({}).animate(sf.base.createElement('div'), {
        duration: duration,
        progress: function (args) {
            setStyle(linear(args.timeStamp, start.x, end.x - start.x, args.duration), linear(args.timeStamp, start.y, end.y - start.y, args.duration));
        },
        end: function () {
            setStyle(end.x, end.y);
        }
    });
}
/** @private */
function textElement$1(renderer, option, font, color, parent, isMinus, redraw, isAnimate, forceAnimate, animateDuration, seriesClipRect, labelSize, isRotatedLabelIntersect, isCanvas) {
    if (isMinus === void 0) { isMinus = false; }
    if (forceAnimate === void 0) { forceAnimate = false; }
    var renderOptions = {};
    var htmlObject;
    var tspanElement;
    //let renderer: SvgRenderer = new SvgRenderer('');
    var text;
    var height;
    var dy;
    var label;
    renderOptions = {
        'id': option.id,
        'x': option.x,
        'y': option.y,
        'fill': color ? color : 'black',
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': option.anchor,
        'labelRotation': option.labelRotation,
        'transform': option.transform,
        'opacity': font.opacity,
        'dominant-baseline': option.baseLine
    };
    text = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    var transX = seriesClipRect ? seriesClipRect.x : 0;
    var transY = seriesClipRect ? seriesClipRect.y : 0;
    htmlObject = renderer.createText(renderOptions, text, transX, transY);
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.color = font.color;
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (var i = 1, len = option.text.length; i < len; i++) {
            height = (sf.svgbase.measureText(option.text[i], font).height);
            dy = (option.y) + ((isMinus) ? -(i * height) : (i * height));
            label = isMinus ? option.text[option.text.length - (i + 1)] : option.text[i];
            if (isCanvas) {
                tspanElement = renderer.createText(renderOptions, label, null, null, dy, true);
            }
            else {
                tspanElement = renderer.createTSpan({
                    'x': option.x, 'id': option.id,
                    'y': dy
                }, label);
                htmlObject.appendChild(tspanElement);
            }
        }
    }
    if (!isRotatedLabelIntersect) {
        appendChildElement(renderer instanceof sf.svgbase.CanvasRenderer, parent, htmlObject, redraw, isAnimate, 'x', 'y', null, null, forceAnimate, false, null, animateDuration);
    }
    return htmlObject;
}
/**
 * Method to calculate the width and height of the chart
 */


/**
 * To calculate chart title and height
 * @param title
 * @param style
 * @param width
 */
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
            titleCollection.push(title);
            break;
    }
    return titleCollection;
}
/**
 * Method to calculate x position of title
 */
function titlePositionX(rect, titleStyle) {
    var positionX;
    if (titleStyle.textAlignment === 'Near') {
        positionX = rect.x;
    }
    else if (titleStyle.textAlignment === 'Center') {
        positionX = rect.x + rect.width / 2;
    }
    else {
        positionX = rect.x + rect.width;
    }
    return positionX;
}
/**
 * Method to find new text and element size based on textOverflow
 */
function textWrap(currentLabel, maximumWidth, font) {
    var textCollection = currentLabel.split(' ');
    var label = '';
    var labelCollection = [];
    var text;
    for (var i = 0, len = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (sf.svgbase.measureText(label.concat(text), font).width < maximumWidth) {
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
/**
 * Method to support the subscript and superscript value to text
 */

/**
 * Method to reset the blazor templates
 */

/** @private */
var RectOption = /** @class */ (function (_super) {
    __extends$2(RectOption, _super);
    function RectOption(id, fill, border, opacity, rect, rx, ry, transform, dashArray) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity, dashArray) || this;
        _this.y = rect.y;
        _this.x = rect.x;
        _this.height = rect.height;
        _this.width = rect.width;
        _this.rx = rx ? rx : 0;
        _this.ry = ry ? ry : 0;
        _this.transform = transform ? transform : '';
        _this.stroke = (border.width !== 0 && _this.stroke !== '') ? border.color : 'transparent';
        return _this;
    }
    return RectOption;
}(sf.svgbase.PathOption));
/** @private */
var CircleOption = /** @class */ (function (_super) {
    __extends$2(CircleOption, _super);
    function CircleOption(id, fill, border, opacity, cx, cy, r) {
        var _this = _super.call(this, id, fill, border.width, border.color, opacity) || this;
        _this.cy = cy;
        _this.cx = cx;
        _this.r = r;
        return _this;
    }
    return CircleOption;
}(sf.svgbase.PathOption));
/** @private */
var ChartLocation = /** @class */ (function () {
    function ChartLocation(x, y) {
        this.x = x;
        this.y = y;
    }
    return ChartLocation;
}());
/** @private */
var Thickness = /** @class */ (function () {
    function Thickness(left, right, top, bottom) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
    return Thickness;
}());

/**
 * class for Bullet chart Scale Group
 */
var ScaleGroup = /** @class */ (function () {
    function ScaleGroup(bulletChart) {
        this.comparative = [];
        //super();
        this.dataSource = bulletChart.dataSource;
        this.isVertical = (bulletChart.orientation === 'Vertical');
        this.isTicksInside = (bulletChart.tickPosition === 'Inside');
        this.isLabelsInside = (bulletChart.labelPosition === 'Inside');
        this.isHorizontal = (bulletChart.orientation === 'Horizontal');
        this.isLeft = bulletChart.titlePosition === 'Left';
        this.isRight = bulletChart.titlePosition === 'Right';
        this.isTop = bulletChart.titlePosition === 'Top';
        this.location = 10;
        this.featureBarBounds = [];
        this.majorTickSize = bulletChart.majorTickLines.height;
        this.labelOffset = 15;
        this.labelSize = 12;
        this.bulletChart = bulletChart;
        this.isLabelBelow = !this.bulletChart.opposedPosition;
        this.scaleOrientation = this.bulletChart.orientation;
        this.rangeColor = [];
    }
    /**
     * To render range scale of the bulletChart graph
     * @param scaleGroup
     */
    ScaleGroup.prototype.drawScaleGroup = function (scaleGroup) {
        var rangeGroup = this.bulletChart.renderer.createGroup({ 'id': this.bulletChart.svgObject.id + '_rangeGroup' });
        var max = this.bulletChart.maximum;
        var ranges = this.bulletChart.ranges;
        this.scaleSettingsGroup = scaleGroup;
        var rect;
        var bullet = this.bulletChart;
        var enableRtl = bullet.enableRtl;
        var initialRect = bullet.initialClipRect;
        var locX = initialRect.x + ((enableRtl && bullet.orientation === 'Horizontal') ? initialRect.width : 0);
        var locY = initialRect.y + ((!enableRtl && bullet.orientation === 'Vertical') ? initialRect.height : 0);
        var area = 0;
        bullet.rangeCollection = [];
        var start = 0;
        var range = (bullet.orientation === 'Horizontal') ? initialRect.width : initialRect.height;
        var fillRange = (bullet.orientation === 'Horizontal') ? initialRect.height : initialRect.width;
        for (var i = 0; i < ranges.length; i++) {
            area = (range) * ((ranges[i].end - start) / max);
            if (bullet.orientation === 'Horizontal') {
                locX -= (enableRtl) ? area : 0;
            }
            else {
                locY -= (!enableRtl) ? area : 0;
            }
            rect = new RectOption(bullet.svgObject.id + '_range_' + i, 
            // tslint:disable-next-line:no-string-literal
            ranges[i].color || this.bulletChart.themeStyle.rangeStrokes[i]['color'], { width: 1 }, ranges[i].opacity, new sf.svgbase.Rect(locX, locY, ((bullet.orientation === 'Horizontal') ? area : fillRange), ((bullet.orientation === 'Horizontal') ? fillRange : area)));
            var svgRect = bullet.renderer.drawRectangle(rect);
            rangeGroup.appendChild(svgRect);
            scaleGroup.appendChild(rangeGroup);
            if (bullet.orientation === 'Horizontal') {
                locX += (enableRtl) ? 0 : area;
            }
            else {
                locY += (!enableRtl) ? 0 : area;
            }
            bullet.rangeCollection.push(area);
            start = ranges[i].end;
        }
        return this.bulletChart.rangeCollection;
    };
    ScaleGroup.prototype.sortRangeCollection = function (a, b) {
        return (a - b);
    };
    /**
     * To render the feature bar of the bulletChart chart
     * @param dataCount
     */
    ScaleGroup.prototype.renderFeatureBar = function (dataCount) {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonFeatureBar(dataCount, this.isHorizontal);
    };
    /**
     * To render the horizontal feature bar of the bulletChart chart
     * @param dataCount
     */
    ScaleGroup.prototype.renderCommonFeatureBar = function (dataCount, isHorizontal) {
        var categoryValue;
        var dotWidth = 6;
        var padding = 5;
        var bulletChart = this.bulletChart;
        var initialBoundsStart = isHorizontal ? (bulletChart.initialClipRect.y + bulletChart.initialClipRect.height) :
            bulletChart.initialClipRect.x;
        var lPoint;
        var featueGroup = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_featureGroup' });
        var data;
        var featureBarSize = (isHorizontal ? bulletChart.initialClipRect.height : bulletChart.initialClipRect.width) / dataCount;
        var bounds;
        for (var i = 0; i < dataCount; i++) {
            data = bulletChart.dataSource[i];
            categoryValue = data[bulletChart.categoryField];
            if (isHorizontal) {
                lPoint = initialBoundsStart - (featureBarSize * i) - (featureBarSize + bulletChart.valueHeight) / 2;
            }
            else {
                lPoint = initialBoundsStart + (featureBarSize * i) + (featureBarSize / 2) - bulletChart.valueHeight / 2;
            }
            bounds = this.calculateFeatureMeasureBounds(data[bulletChart.valueField], categoryValue, isHorizontal);
            if (data && bulletChart.type === 'Dot') {
                var value = data[bulletChart.valueField];
                if (isHorizontal) {
                    bounds.pointX = bounds.pointX + (((value > 0) && !bulletChart.enableRtl) ||
                        ((value < 0) && bulletChart.enableRtl) ? (bounds.width) : 0) - dotWidth / 2;
                }
                else {
                    bounds.pointX = bounds.pointX + (((value > 0) && bulletChart.enableRtl) ||
                        ((value < 0) && !bulletChart.enableRtl) ? (bounds.width) : 0) - dotWidth / 2;
                }
                bounds.width = dotWidth;
            }
            // Drawing feature bar rect element
            if (bounds) {
                var svgRect = isHorizontal ? this.featureBar(bounds.pointX, lPoint, bounds.width, i) :
                    this.verticalFeatureBar(lPoint, bounds.pointX, bounds.width, i);
                featueGroup.appendChild(svgRect);
                this.feature = svgRect;
                this.scaleSettingsGroup.appendChild(featueGroup);
                this.featureBarBounds[i] = { x: bounds.pointX, y: lPoint, width: bounds.width, height: bulletChart.valueHeight };
                // Drawing category text element
                if (!sf.base.isNullOrUndefined(categoryValue)) {
                    var categoryTextSize = sf.svgbase.measureText(categoryValue, bulletChart.categoryLabelStyle);
                    var categorySize = isHorizontal ? categoryTextSize.width : categoryTextSize.height;
                    var initialRect = bulletChart.initialClipRect;
                    var x = void 0;
                    var categoryOptions = void 0;
                    if (isHorizontal) {
                        x = (bulletChart.enableRtl) ? (initialRect.x + initialRect.width + padding + categorySize / 2) :
                            initialRect.x - padding - categorySize / 2;
                        categoryOptions = this.drawcategory(x, lPoint, categoryValue);
                    }
                    else {
                        x = (bulletChart.enableRtl) ? (initialRect.y - padding - categorySize / 2) :
                            initialRect.y + initialRect.height + padding + categorySize / 2;
                        categoryOptions = this.drawcategory(lPoint + bulletChart.valueHeight / 2, x, categoryValue);
                    }
                    sf.svgbase.textElement(categoryOptions, bulletChart.categoryLabelStyle, bulletChart.categoryLabelStyle.color || bulletChart.themeStyle.categoryFontColor, this.scaleSettingsGroup);
                }
            }
            if (bulletChart.animation.enable) {
                this.doValueBarAnimation(this.scaleSettingsGroup);
            }
        }
    };
    ScaleGroup.prototype.featureBar = function (pointX, pointY, width, i) {
        var featureBarOptions = new RectOption(this.bulletChart.svgObject.id + '_FeatureMeasure_' + i, this.bulletChart.valueFill, this.bulletChart.valueBorder, 1, new sf.svgbase.Rect(pointX, pointY, width, this.bulletChart.valueHeight));
        var svgRect = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        return svgRect;
    };
    ScaleGroup.prototype.verticalFeatureBar = function (pointX, pointY, width, i) {
        var featureBarOptions = new RectOption(this.bulletChart.svgObject.id + '_FeatureMeasure_' + i, this.bulletChart.valueFill, this.bulletChart.valueBorder, 1, new sf.svgbase.Rect(pointX, pointY, this.bulletChart.valueHeight, width));
        var svgRect = this.bulletChart.renderer.drawRectangle(featureBarOptions);
        svgRect.setAttribute('class', this.bulletChart.svgObject.id + '_FeatureMeasure');
        svgRect.id = this.bulletChart.svgObject.id + '_FeatureMeasure_' + i;
        return svgRect;
    };
    ScaleGroup.prototype.drawcategory = function (lPointX, lPointY, categoryValue) {
        var categoryOptions = {
            'id': '',
            'anchor': 'middle',
            'x': lPointX,
            'y': lPointY + (this.bulletChart.valueHeight),
            'transform': '',
            'text': categoryValue,
            'baseLine': '',
            'labelRotation': 0
        };
        return categoryOptions;
    };
    /**
     * To render comparative symbol of the bulletChart chart
     * @param dataCount
     */
    ScaleGroup.prototype.renderComparativeSymbol = function (dataCount) {
        if (dataCount === 0) {
            return;
        }
        this.renderCommonComparativeSymbol(dataCount, this.isHorizontal);
    };
    ScaleGroup.prototype.renderCommonComparativeSymbol = function (dataCount, isHorizontal) {
        var bulletChart = this.bulletChart;
        var value;
        var rect = bulletChart.initialClipRect;
        var scaleLength = isHorizontal ? rect.width : rect.height;
        var y1;
        var y2;
        var x1;
        var pointY = isHorizontal ? (rect.y + rect.height) : rect.x;
        var comparativeGroup = bulletChart.renderer.createGroup({ 'id': bulletChart.svgObject.id + '_comparativeGroup' });
        var minimum = bulletChart.minimum;
        var maximum = bulletChart.maximum;
        var delta = maximum - minimum;
        var targetWidth = bulletChart.targetWidth;
        var pointX = isHorizontal ? (rect.x - (targetWidth / 2)) : (rect.y + rect.height);
        var temp;
        var values = [];
        var targetTypes = bulletChart.targetTypes;
        var targetType = 'Rect';
        var targetTypeLength = targetTypes.length;
        var featureBarSize = (isHorizontal ? rect.height : rect.width) / dataCount;
        var svgElement;
        for (var k = 0; k < dataCount; k++) {
            value = bulletChart.dataSource[k][bulletChart.targetField];
            values = values.concat(value);
            for (var i = 0; i < values.length; i++) {
                targetType = targetTypes[i % targetTypeLength];
                if (values[i] >= minimum && values[i] <= maximum) {
                    if (isHorizontal) {
                        temp = pointY - (featureBarSize * k) - (featureBarSize / 2);
                    }
                    else {
                        temp = pointY + (featureBarSize * k) + (featureBarSize / 2);
                    }
                    y1 = temp - targetWidth * 1.5;
                    y2 = temp + targetWidth * 1.5;
                    temp = (scaleLength / (delta / (delta - (maximum - values[i]))));
                    if (isHorizontal) {
                        x1 = pointX + (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    }
                    else {
                        x1 = pointX - (bulletChart.enableRtl ? (scaleLength - temp) : temp);
                    }
                    svgElement = this.getTargetElement(targetType, isHorizontal, x1, y1, y2, values[i], k);
                    this.comparative.push(svgElement);
                    comparativeGroup.appendChild(svgElement);
                    y1 = 0;
                    y2 = 0;
                }
                this.scaleSettingsGroup.appendChild(comparativeGroup);
            }
            values = [];
            if (bulletChart.animation.enable) {
                this.doTargetBarAnimation(0);
            }
        }
    };
    ScaleGroup.prototype.getTargetElement = function (targetType, isHorizontal, x1, y1, y2, value, k) {
        var shapeObject;
        var shapeElement;
        var bulletChart = this.bulletChart;
        var strokeWidth = (targetType === 'Cross') ? bulletChart.targetWidth - 1 : 1;
        var size = (targetType === 'Circle') ? bulletChart.targetWidth - 1 : bulletChart.targetWidth;
        var lx = isHorizontal ? x1 + (size / 2) : y1 + ((y2 - y1) / 2);
        var ly = isHorizontal ? y1 + ((y2 - y1) / 2) : x1;
        var id = bulletChart.svgObject.id + '_ComparativeMeasure_' + k;
        var className = bulletChart.svgObject.id + '_ComparativeMeasure';
        if (targetType === 'Rect') {
            shapeObject = isHorizontal ? this.compareMeasure(x1, y1, y2, k, value) : this.compareVMeasure(y1, y2, x1, k, value);
            shapeElement = bulletChart.renderer.drawLine(shapeObject);
        }
        else if (targetType === 'Circle') {
            shapeObject = new CircleOption(id, bulletChart.targetColor, { width: 1, color: bulletChart.targetColor || 'black' }, 1, lx, ly, size);
            shapeElement = bulletChart.renderer.drawCircle(shapeObject);
        }
        else {
            var crossDirection = 'M ' + (lx - size) + ' ' + (ly - size) + ' L ' + (lx + size) + ' ' + (ly + size) + ' M ' +
                (lx - size) + ' ' + (ly + size) + ' L ' + (lx + size) + ' ' + (ly - size);
            shapeObject = new sf.svgbase.PathOption(id, 'transparent', strokeWidth, bulletChart.targetColor, 1, '', crossDirection);
            shapeElement = bulletChart.renderer.drawPath(shapeObject);
        }
        shapeElement.setAttribute('class', className);
        return shapeElement;
    };
    ScaleGroup.prototype.compareMeasure = function (x1, y1, y2, i, value) {
        var bulletChart = this.bulletChart;
        var compareMeasureOptions = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y1': y1,
            'x2': (value === bulletChart.maximum) ? x1 - (bulletChart.targetWidth / 2) :
                (value === bulletChart.minimum) ? x1 + (bulletChart.targetWidth / 2) : x1,
            'y2': y2,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor || 'black'
        };
        return compareMeasureOptions;
    };
    ScaleGroup.prototype.compareVMeasure = function (x1, x2, y1, i, value) {
        var bulletChart = this.bulletChart;
        var compareMeasureOptions = {
            'class': bulletChart.svgObject.id + '_ComparativeMeasure',
            'id': bulletChart.svgObject.id + '_ComparativeMeasure_' + i,
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y1,
            'stroke-width': bulletChart.targetWidth,
            'stroke': bulletChart.targetColor || 'black'
        };
        return compareMeasureOptions;
    };
    /**
     * To calculate the bounds on vertical and horizontal orientation changes
     * @param value
     * @param categoryValue
     */
    ScaleGroup.prototype.calculateFeatureMeasureBounds = function (value, categoryValue, isHorizontal) {
        var bulletChart = this.bulletChart;
        var min = bulletChart.minimum;
        value = (value < min && min < 0) ? min : value;
        if (value >= min) {
            var pointX = void 0;
            var lastPointX = void 0;
            var width = void 0;
            var loc = isHorizontal ? bulletChart.initialClipRect.x : bulletChart.initialClipRect.y;
            var scaleLength = isHorizontal ? bulletChart.initialClipRect.width : bulletChart.initialClipRect.height;
            var delta = bulletChart.maximum - bulletChart.minimum;
            var valueDiff = bulletChart.maximum - value;
            var orientation_1 = ((!bulletChart.enableRtl) ? 'forward' : 'backward') + this.scaleOrientation.toLowerCase();
            categoryValue = sf.base.isNullOrUndefined(categoryValue) ? '' : categoryValue;
            var stringLength = sf.svgbase.measureText(categoryValue.toString(), bulletChart.labelStyle).width;
            switch (orientation_1) {
                case 'forwardhorizontal':
                case 'backwardvertical':
                    pointX = loc + ((min > 0) ? 0 : scaleLength / delta * Math.abs(min));
                    width = scaleLength / (delta / ((min > 0) ? delta - valueDiff : value));
                    if (value < 0) {
                        width = Math.abs(width);
                        pointX -= width;
                    }
                    width = (pointX + width < loc + scaleLength) ? width : loc + scaleLength - pointX;
                    lastPointX = loc - ((orientation_1 === 'forwardhorizontal') ? (stringLength / 2 + 5) :
                        this.labelOffset);
                    break;
                default:
                    pointX = loc + (scaleLength - scaleLength / (delta / (delta - valueDiff)));
                    width = (min > 0) ? scaleLength / (delta / (delta - valueDiff)) : scaleLength / (delta / (value));
                    if (value < 0) {
                        width = Math.abs(width);
                        pointX -= width;
                    }
                    if (pointX < loc) {
                        width = pointX + width - loc;
                        pointX = loc;
                    }
                    lastPointX = loc + scaleLength + ((orientation_1 === 'backwardhorizontal') ? (stringLength / 2 +
                        5) : 5);
                    break;
            }
            return { pointX: pointX, width: width, lastPointX: lastPointX };
        }
        return null;
    };
    /**
     * Animates the feature bar.
     * @param  {FeatureBar} scale - Defines the feature bar to animate.
     * @return {void}
     */
    ScaleGroup.prototype.doValueBarAnimation = function (scale) {
        var valueBarElement = this.feature;
        if (!valueBarElement) {
            return null;
        }
        var animateOption = this.bulletChart.animation;
        var animateDuration = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : animateOption.duration;
        var effectType = getAnimationFunction('Linear');
        var isValuePlot = this.bulletChart.dataSource < 0;
        var valueX;
        var valueY;
        var elementBarHeight = valueBarElement.getBoundingClientRect().height;
        var elementBarWidth = valueBarElement.getBoundingClientRect().width;
        var centerX;
        var centerY;
        var valueActual;
        if (this.bulletChart.orientation === 'Horizontal' && valueBarElement) {
            valueY = parseInt(valueBarElement.getAttribute('height'), 10);
            valueX = parseInt(valueBarElement.getAttribute('x'), 10);
            centerY = isValuePlot ? valueY : valueY + elementBarHeight;
            centerX = valueX;
        }
        valueBarElement.style.visibility = 'hidden';
        new sf.base.Animation({}).animate(valueBarElement, {
            duration: animateDuration,
            delay: animateOption.delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    valueBarElement.style.visibility = 'visible';
                    elementBarWidth = elementBarWidth ? elementBarWidth : 1;
                    valueActual = effectType(args.timeStamp - args.delay, 0, elementBarWidth, args.duration);
                    valueBarElement.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                        ') scale(' + (valueActual / elementBarWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                }
            },
            end: function (model) {
                valueBarElement.setAttribute('transform', 'translate(0,0)');
                valueBarElement.style.visibility = 'visible';
            }
        });
    };
    /**
     * Animates the comparative bar.
     * @param  {FeatureBar} scale - Defines the feature bar to animate.
     * @return {void}
     */
    ScaleGroup.prototype.doTargetBarAnimation = function (index) {
        var targetBarelement;
        var option = this.bulletChart.animation;
        var x;
        var y;
        var centerX;
        var centerY;
        targetBarelement = this.comparative[index];
        if (!targetBarelement) {
            return null;
        }
        if (this.bulletChart.orientation === 'Horizontal' && targetBarelement) {
            y = parseFloat(targetBarelement.getAttribute('y1')) + parseFloat(targetBarelement.getAttribute('y2'));
            x = parseFloat(targetBarelement.getAttribute('x1'));
            centerY = y;
            centerX = x;
        }
        targetBarelement.style.visibility = 'hidden';
        this.animateRect(targetBarelement, centerX, centerY, index + 1);
    };
    ScaleGroup.prototype.animateRect = function (targetBarelement, centerX, centerY, index) {
        var _this = this;
        var effect = getAnimationFunction('Linear');
        var value;
        var option = this.bulletChart.animation;
        var threshold = this.comparative.length;
        var duration = this.bulletChart.animateSeries ? this.bulletChart.animation.duration : option.duration;
        new sf.base.Animation({}).animate(targetBarelement, {
            duration: duration,
            delay: option.delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    targetBarelement.style.visibility = 'visible';
                    value = effect(args.timeStamp - args.delay, 0, 1, args.duration);
                    targetBarelement.setAttribute('transform', 'translate(' + centerX + ' ' + centerY / 2 +
                        ') scale(1,' + (value) + ') translate(' + (-centerX) + ' ' + (-centerY / 2) + ')');
                }
            },
            end: function (model) {
                targetBarelement.setAttribute('transform', 'translate(0,0)');
                if (index < threshold) {
                    _this.doTargetBarAnimation(index + 1);
                }
            }
        });
    };
    return ScaleGroup;
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
 * Configures the location for the legend.
 */
var Location = /** @class */ (function (_super) {
    __extends$6(Location, _super);
    function Location() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(0)
    ], Location.prototype, "x", void 0);
    __decorate$5([
        sf.base.Property(0)
    ], Location.prototype, "y", void 0);
    return Location;
}(sf.base.ChildProperty));
/**
 * Configures the legends in charts.
 */
var LegendSettings = /** @class */ (function (_super) {
    __extends$6(LegendSettings, _super);
    function LegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$5([
        sf.base.Property(true)
    ], LegendSettings.prototype, "visible", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], LegendSettings.prototype, "height", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], LegendSettings.prototype, "width", void 0);
    __decorate$5([
        sf.base.Complex({ x: 0, y: 0 }, Location)
    ], LegendSettings.prototype, "location", void 0);
    __decorate$5([
        sf.base.Property('Auto')
    ], LegendSettings.prototype, "position", void 0);
    __decorate$5([
        sf.base.Property(8)
    ], LegendSettings.prototype, "padding", void 0);
    __decorate$5([
        sf.base.Property('Center')
    ], LegendSettings.prototype, "alignment", void 0);
    __decorate$5([
        sf.base.Complex(Theme.legendLabelFont, Font)
    ], LegendSettings.prototype, "textStyle", void 0);
    __decorate$5([
        sf.base.Property(10)
    ], LegendSettings.prototype, "shapeHeight", void 0);
    __decorate$5([
        sf.base.Property(10)
    ], LegendSettings.prototype, "shapeWidth", void 0);
    __decorate$5([
        sf.base.Complex({}, Border)
    ], LegendSettings.prototype, "border", void 0);
    __decorate$5([
        sf.base.Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    ], LegendSettings.prototype, "margin", void 0);
    __decorate$5([
        sf.base.Property(5)
    ], LegendSettings.prototype, "shapePadding", void 0);
    __decorate$5([
        sf.base.Property('transparent')
    ], LegendSettings.prototype, "background", void 0);
    __decorate$5([
        sf.base.Property(1)
    ], LegendSettings.prototype, "opacity", void 0);
    __decorate$5([
        sf.base.Property(true)
    ], LegendSettings.prototype, "toggleVisibility", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], LegendSettings.prototype, "description", void 0);
    __decorate$5([
        sf.base.Property(3)
    ], LegendSettings.prototype, "tabIndex", void 0);
    __decorate$5([
        sf.base.Property(null)
    ], LegendSettings.prototype, "title", void 0);
    __decorate$5([
        sf.base.Complex(Theme.legendTitleFont, Font)
    ], LegendSettings.prototype, "titleStyle", void 0);
    __decorate$5([
        sf.base.Property('Top')
    ], LegendSettings.prototype, "titlePosition", void 0);
    __decorate$5([
        sf.base.Property(100)
    ], LegendSettings.prototype, "maximumTitleWidth", void 0);
    __decorate$5([
        sf.base.Property(true)
    ], LegendSettings.prototype, "enablePages", void 0);
    return LegendSettings;
}(sf.base.ChildProperty));
/**
 * Legend base class for Chart and Accumulation chart.
 * @private
 */
var BaseLegend = /** @class */ (function () {
    /**
     * Constructor for the dateTime module.
     * @private
     */
    function BaseLegend(chart) {
        this.fivePixel = 5;
        this.rowCount = 0; // legend row counts per page
        this.columnCount = 0; // legend column counts per page
        this.pageButtonSize = 8;
        this.pageXCollections = []; // pages of x locations
        this.maxColumns = 0;
        this.isTrimmed = false;
        this.maxWidth = 0;
        this.currentPage = 1;
        this.backwardArrowOpacity = 0;
        this.forwardArrowOpacity = 1;
        this.arrowWidth = (2 * (this.fivePixel + this.pageButtonSize + this.fivePixel));
        this.arrowHeight = this.arrowWidth;
        this.legendTitleCollections = [];
        this.isTop = false;
        this.isTitle = false;
        this.currentPageNumber = 1;
        this.legendRegions = [];
        this.pagingRegions = [];
        this.chart = chart;
        this.legend = chart.legendSettings;
        this.legendID = chart.element.id + '_chart_legend';
        this.isChartControl = (chart.getModuleName() === 'chart');
        this.isBulletChartControl = (chart.getModuleName() === 'bulletChart');
        this.bulletChart = this.chart;
    }
    /**
     * Calculate the bounds for the legends.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.calculateLegendBounds = function (rect, availableSize, maxLabelSize) {
        var legend = this.legend;
        this.getPosition(legend.position, availableSize);
        this.legendBounds = new sf.svgbase.Rect(rect.x, rect.y, 0, 0);
        var defaultValue = (this.isBulletChartControl) ? '40%' : '20%';
        this.isVertical = (this.position === 'Left' || this.position === 'Right');
        if (this.isVertical) {
            this.legendBounds.height = stringToNumber(legend.height, availableSize.height - (rect.y - this.chart.margin.top)) || rect.height;
            this.legendBounds.width = stringToNumber(legend.width || defaultValue, availableSize.width);
        }
        else {
            this.legendBounds.width = stringToNumber(legend.width, availableSize.width) || rect.width;
            this.legendBounds.height = stringToNumber(legend.height || defaultValue, availableSize.height);
        }
        this.library.getLegendBounds(availableSize, this.legendBounds, legend);
        this.getLocation(this.position, legend.alignment, this.legendBounds, rect, availableSize, maxLabelSize);
    };
    /**
     * To find legend position based on available size for chart and accumulation chart
     */
    BaseLegend.prototype.getPosition = function (position, availableSize) {
        var chart = this.chart;
        var accumulation = this.chart;
        if (this.isChartControl || this.isBulletChartControl) {
            this.position = (position !== 'Auto') ? position : 'Bottom';
        }
        else {
            if (position === 'Auto' && ((chart || accumulation).visibleSeries && (chart || accumulation).visibleSeries[0].type === 'Funnel' || (chart || accumulation).visibleSeries[0].type === 'Pyramid')) {
                position = 'Top';
            }
            this.position = (position !== 'Auto') ? position :
                (availableSize.width > availableSize.height ? 'Right' : 'Bottom');
        }
    };
    /**
     * To set bounds for chart and accumulation chart
     */
    BaseLegend.prototype.setBounds = function (computedWidth, computedHeight, legend, legendBounds) {
        var titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        if (this.isVertical && this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            titleHeight = legend.title && legend.titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
            titleHeight += (this.pageButtonSize + this.fivePixel);
        }
        computedWidth = Math.min(computedWidth, legendBounds.width);
        computedHeight = Math.min(computedHeight, legendBounds.height);
        legendBounds.width = !legend.width ? computedWidth : legendBounds.width;
        legendBounds.height = !legend.height ? computedHeight : legendBounds.height;
        if (!this.isBulletChartControl) {
            if (this.isTop && legend.titleStyle.textOverflow !== 'None') {
                this.calculateLegendTitle(legend, legendBounds);
                legendBounds.height += legend.titleStyle.textOverflow === 'Wrap' && this.legendTitleCollections.length > 1 ?
                    (this.legendTitleSize.height - (this.legendTitleSize.height / this.legendTitleCollections.length)) : 0;
            }
        }
        this.rowCount = Math.max(1, Math.ceil((legendBounds.height - legend.padding - titleHeight) /
            (this.maxItemHeight + legend.padding)));
    };
    /**
     * To find legend location based on position, alignment for chart and accumulation chart
     */
    BaseLegend.prototype.getLocation = function (position, alignment, legendBounds, rect, availableSize, maxLabelSize) {
        var padding = this.legend.border.width;
        var isBulletChart = this.isBulletChartControl;
        var bulletChart = this.bulletChart;
        var labelIns = bulletChart.labelPosition === 'Inside';
        var ticklIns = bulletChart.tickPosition === 'Inside';
        var isVertical = bulletChart.orientation === 'Vertical';
        // tslint:disable-next-line:max-line-length
        var categoryFieldValue = (isBulletChart && bulletChart.categoryField !== '') ? maxLabelSize.width + this.chart.border.width + padding * 3 : 0;
        var legendHeight = legendBounds.height + padding + this.legend.margin.top + this.legend.margin.bottom;
        var legendWidth = legendBounds.width + padding + this.legend.margin.left + this.legend.margin.right;
        var marginBottom = this.chart.margin.bottom;
        if (position === 'Bottom') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            // tslint:disable-next-line:max-line-length
            legendBounds.y = rect.y + (rect.height - legendHeight) + padding + this.legend.margin.top;
            legendBounds.y += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns
                // tslint:disable-next-line:max-line-length
                //tslint:disable-next-line:max-line-length
                && !isVertical) ? bulletChart.majorTickLines.height + marginBottom + this.legend.border.width + padding * 2 :
                (isVertical && bulletChart.categoryField !== '') ? maxLabelSize.height + padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, 0, legendHeight));
        }
        else if (position === 'Top') {
            legendBounds.x = this.alignLegend(legendBounds.x, availableSize.width, legendBounds.width, alignment);
            legendBounds.y = rect.y + padding + this.legend.margin.top;
            legendBounds.y -= (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
                // // tslint:disable-next-line:max-line-length
                !isVertical) ? bulletChart.majorTickLines.height + this.chart.margin.top : 0;
            legendHeight -= (isBulletChart) ? -padding * 2 : 0;
            subtractThickness(rect, new Thickness(0, 0, legendHeight, 0));
        }
        else if (position === 'Right') {
            legendBounds.x = rect.x + (rect.width - legendBounds.width) - this.legend.margin.right;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            legendWidth += (isBulletChart && bulletChart.opposedPosition && !labelIns && !ticklIns &&
                isVertical) ? (this.chart.margin.left + this.chart.margin.right + bulletChart.majorTickLines.height) : 0;
            subtractThickness(rect, new Thickness(0, legendWidth, 0, 0));
        }
        else if (position === 'Left') {
            legendBounds.x = legendBounds.x + this.legend.margin.left;
            legendBounds.y = rect.y + this.alignLegend(0, availableSize.height - (rect.y + marginBottom), legendBounds.height, alignment);
            legendWidth += (isBulletChart && !bulletChart.opposedPosition && !labelIns && !ticklIns &&
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line:max-line-length
                isVertical) ? (legendBounds.x - this.chart.margin.left + padding + bulletChart.majorTickLines.height) :
                (bulletChart.orientation !== 'Vertical' && bulletChart.categoryField !== '') ? categoryFieldValue : 0;
            subtractThickness(rect, new Thickness(legendWidth, 0, 0, 0));
        }
        else {
            legendBounds.x = this.legend.location.x;
            legendBounds.y = this.legend.location.y;
            subtractThickness(rect, new Thickness(0, 0, 0, 0));
        }
    };
    /**
     * To find legend alignment for chart and accumulation chart
     */
    BaseLegend.prototype.alignLegend = function (start, size, legendSize, alignment) {
        switch (alignment) {
            case 'Far':
                start = (size - legendSize) - start;
                break;
            case 'Center':
                start = ((size - legendSize) / 2);
                break;
        }
        return start;
    };
    /**
     * Renders the legend.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.renderLegend = function (chart, legend, legendBounds, redraw) {
        var firstLegend = this.findFirstLegendPosition(this.legendCollections);
        var padding = legend.padding;
        var titleHeight = 0;
        var titlePlusArrowWidth = 0;
        var isPaging = legend.enablePages;
        var titlePosition = legend.titlePosition;
        var upArrowHeight = this.isPaging && !legend.enablePages && this.isVertical ? this.pageButtonSize : 0;
        this.legendRegions = [];
        this.maxItemHeight = Math.max(this.legendCollections[0].textSize.height, legend.shapeHeight);
        var legendGroup = chart.renderer.createGroup({ id: this.legendID + '_g' });
        var legendTranslateGroup = this.createLegendElements(chart, legendBounds, legendGroup, legend, this.legendID, redraw);
        // For new legend navigation
        if (!isPaging && this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = !this.isTitle ? 0 : titlePosition === 'Left' ? this.legendTitleSize.width : 0;
            titlePlusArrowWidth += (this.pageButtonSize + (2 * this.fivePixel));
        }
        else if (!this.isPaging && !this.isVertical) {
            titlePlusArrowWidth = this.isTitle && titlePosition === 'Left' ? (this.fivePixel + this.legendTitleSize.width) : 0;
        }
        titleHeight = !this.isTitle ? 0 : (this.isTop || this.isVertical ? this.legendTitleSize.height : 0);
        var pagingLegendBounds = new sf.svgbase.Rect(0, 0, 0, 0);
        var requireLegendBounds = new sf.svgbase.Rect(0, 0, 0, 0);
        if (firstLegend !== this.legendCollections.length) {
            var legendSeriesGroup = void 0; // legendItem group for each series group element
            var start = void 0; // starting shape center x,y position && to resolve lint error used new line for declaration
            start = new ChartLocation(legendBounds.x + titlePlusArrowWidth + padding + (legend.shapeWidth / 2), legendBounds.y + titleHeight + upArrowHeight + padding + this.maxItemHeight / 2);
            var anchor = chart.isRtlEnabled ? 'end' : 'start';
            var textOptions = new sf.svgbase.TextOption('', start.x, start.y, anchor);
            //  initialization for totalPages legend click totalpage again calculate
            this.totalPages = this.totalPages = (this.isChartControl || this.isBulletChartControl) ? this.totalPages : 0;
            var textPadding = legend.shapePadding + padding + legend.shapeWidth;
            var count = 0;
            this.pageXCollections = [];
            this.legendCollections[firstLegend].location = start;
            var previousLegend = this.legendCollections[firstLegend];
            if (!legend.enablePages && this.isPaging) {
                var x = start.x - this.fivePixel;
                var y = start.y - this.fivePixel;
                var rightSpace = this.isTitle && !this.isVertical && titlePosition === 'Right' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                var leftSpace = this.isTitle && !this.isVertical && titlePosition === 'Left' ?
                    this.legendTitleSize.width + this.fivePixel : 0;
                rightSpace += this.isVertical ? 0 : (this.fivePixel + this.pageButtonSize + this.fivePixel);
                var bottomSapce = this.isVertical ? (this.pageButtonSize) + Math.abs(y - legendBounds.y) : 0;
                pagingLegendBounds = new sf.svgbase.Rect(x, y, legendBounds.width - rightSpace - leftSpace, legendBounds.height - bottomSapce);
                requireLegendBounds = pagingLegendBounds;
            }
            else {
                requireLegendBounds = legendBounds;
            }
            for (var _i = 0, _a = this.legendCollections; _i < _a.length; _i++) {
                var legendOption = _a[_i];
                if (this.chart.getModuleName() === 'accumulationchart') {
                    // tslint:disable-next-line:max-line-length
                    legendOption.fill = (this.chart || this.chart).visibleSeries[0].points[legendOption.pointIndex].color;
                }
                this.accessbilityText = (this.isBulletChartControl) ? 'Legend of bullet chart' + '' + legendOption.text
                    : 'Click to show or hide the ' + legendOption.text + ' series';
                if (legendOption.render && legendOption.text !== '') {
                    legendSeriesGroup = chart.renderer.createGroup({
                        id: this.legendID + this.generateId(legendOption, '_g_', count)
                    });
                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('tabindex', legend.tabIndex.toString());
                        legendSeriesGroup.setAttribute('aria-label', legend.description ||
                            this.accessbilityText);
                    }
                    this.library.getRenderPoint(legendOption, start, textPadding, previousLegend, requireLegendBounds, count, firstLegend);
                    this.renderSymbol(legendOption, legendSeriesGroup, count);
                    this.renderText(chart, legendOption, legendSeriesGroup, textOptions, count);
                    if (legendSeriesGroup) {
                        legendSeriesGroup.setAttribute('style', 'cursor: ' + ((!legend.toggleVisibility && (chart.selectionMode === 'None' ||
                            chart.highlightMode === 'None' ||
                            chart.selectionMode === 'None') || this.isBulletChartControl) ? 'auto' : 'pointer'));
                    }
                    if (legendTranslateGroup) {
                        legendTranslateGroup.appendChild(legendSeriesGroup);
                    }
                    previousLegend = legendOption;
                }
                count++;
            }
            if (this.isPaging) {
                this.renderPagingElements(chart, legendBounds, textOptions, legendGroup);
            }
            else {
                this.totalPages = 1;
            }
        }
        appendChildElement(chart.enableCanvas, chart.svgObject, legendGroup, redraw);
    };
    /**
     * To find first valid legend text index for chart and accumulation chart
     */
    BaseLegend.prototype.findFirstLegendPosition = function (legendCollection) {
        var count = 0;
        for (var _i = 0, legendCollection_1 = legendCollection; _i < legendCollection_1.length; _i++) {
            var legend = legendCollection_1[_i];
            if (legend.render && legend.text !== '') {
                break;
            }
            count++;
        }
        return count;
    };
    /**
     * To get the legend title text width and height.
     * @param legend
     * @param legendBounds
     */
    BaseLegend.prototype.calculateLegendTitle = function (legend, legendBounds) {
        if (legend.title) {
            this.isTop = legend.titlePosition === 'Top';
            var padding = legend.titleStyle.textOverflow === 'Trim' ? 2 * legend.padding : 0;
            if (this.isTop || this.isVertical) {
                this.legendTitleCollections = getTitle(legend.title, legend.titleStyle, (legendBounds.width - padding));
            }
            else {
                this.legendTitleCollections[0] = textTrim(legend.maximumTitleWidth, legend.title, legend.titleStyle);
            }
            var text = this.isTop ? legend.title : this.legendTitleCollections[0];
            this.legendTitleSize = sf.svgbase.measureText(text, legend.titleStyle);
            this.legendTitleSize.height *= this.legendTitleCollections.length;
        }
        else {
            this.legendTitleSize = new sf.svgbase.Size(0, 0);
        }
    };
    /**
     * Render the legend title
     * @param chart
     * @param legend
     * @param legendBounds
     * @param legendGroup
     */
    BaseLegend.prototype.renderLegendTitle = function (chart, legend, legendBounds, legendGroup) {
        var padding = legend.padding;
        this.isTop = legend.titlePosition === 'Top';
        var alignment = legend.titleStyle.textAlignment;
        var anchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        anchor = this.isTop || this.isVertical ? anchor : '';
        var x = titlePositionX(legendBounds, legend.titleStyle);
        x = alignment === 'Near' ? (x + padding) : alignment === 'Far' ? (x - padding) : x;
        x = (this.isTop || this.isVertical) ? x : ((legendBounds.x) + (legend.titlePosition === 'Left' ? 5 :
            (legendBounds.width - this.legendTitleSize.width - 5)));
        var topPadding = (legendBounds.height / 2) + (this.legendTitleSize.height / 4);
        var y = legendBounds.y + (!this.isTop && !this.isVertical ? topPadding :
            (this.legendTitleSize.height / this.legendTitleCollections.length));
        var legendTitleTextOptions = new sf.svgbase.TextOption(this.legendID + '_title', x, y, anchor, this.legendTitleCollections);
        textElement$1(chart.renderer, legendTitleTextOptions, legend.titleStyle, legend.titleStyle.color, legendGroup);
    };
    /**
     * To create legend rendering elements for chart and accumulation chart
     * @param chart
     * @param legendBounds
     * @param legendGroup
     * @param legend
     * @param id
     * @param redraw
     */
    BaseLegend.prototype.createLegendElements = function (chart, legendBounds, legendGroup, legend, id, redraw) {
        var padding = legend.padding;
        var options = new RectOption(id + '_element', legend.background, legend.border, legend.opacity, legendBounds);
        legendGroup ? legendGroup.appendChild(chart.renderer.drawRectangle(options)) : chart.renderer.drawRectangle(options);
        if (legend.title) {
            this.renderLegendTitle(chart, legend, legendBounds, legendGroup);
        }
        var legendItemsGroup = chart.renderer.createGroup({ id: id + '_collections' });
        var isCanvas = chart.enableCanvas;
        if (!isCanvas) {
            legendGroup.appendChild(legendItemsGroup);
        }
        this.legendTranslateGroup = chart.renderer.createGroup({ id: id + '_translate_g' });
        if (!isCanvas) {
            legendItemsGroup.appendChild(this.legendTranslateGroup);
        }
        var clippath = chart.renderer.createClipPath({ id: id + '_clipPath' });
        options.y += padding + (this.isTop ? this.legendTitleSize.height : 0);
        options.id += '_clipPath_rect';
        options.width = ((!this.isChartControl && chart.getModuleName() !== 'bulletChart') && this.isVertical) ? this.maxWidth - padding : legendBounds.width;
        if (!isCanvas) {
            this.clipRect = chart.renderer.drawRectangle(options);
            clippath.appendChild(this.clipRect);
        }
        else {
            this.pagingClipRect = options;
        }
        appendChildElement(isCanvas, chart.svgObject, clippath, redraw);
        if (!isCanvas) {
            legendItemsGroup.setAttribute('style', 'clip-path:url(#' + clippath.id + ')');
        }
        return this.legendTranslateGroup;
    };
    /**
     * To render legend symbols for chart and accumulation chart
     */
    BaseLegend.prototype.renderSymbol = function (legendOption, group, i) {
        var borderColor;
        var control = this.isBulletChartControl ? this.chart : null;
        var symbolColor = legendOption.visible ? legendOption.fill : '#D3D3D3';
        var shape = (legendOption.shape === 'SeriesType') ? legendOption.type : legendOption.shape;
        shape = shape === 'Scatter' ? legendOption.markerShape : shape;
        var isStrokeWidth = (this.chart.getModuleName() === 'chart' && (legendOption.shape === 'SeriesType') &&
            (legendOption.type.toLowerCase().indexOf('line') > -1) && (legendOption.type.toLowerCase().indexOf('area') === -1));
        var strokewidth = isStrokeWidth ? this.chart.visibleSeries[i].width :
            (this.isBulletChartControl && legendOption.shape === 'Multiply') ? 4 : 1;
        var isCustomBorder = this.chart.getModuleName() === 'chart' &&
            (legendOption.type === 'Scatter' || legendOption.type === 'Bubble');
        if (isCustomBorder && i < this.chart.visibleSeries.length) {
            var seriesBorder = this.chart.visibleSeries[i].border;
            borderColor = seriesBorder.color ? seriesBorder.color : symbolColor;
            strokewidth = seriesBorder.width ? seriesBorder.width : 1;
        }
        var symbolOption = new sf.svgbase.PathOption(this.legendID + this.generateId(legendOption, '_shape_', i), symbolColor, strokewidth, (isCustomBorder ? borderColor : symbolColor), 1, '', '');
        var regionPadding;
        var isCanvas = this.chart.enableCanvas;
        if (!isCanvas) {
            group.appendChild(drawSymbol(legendOption.location, shape, new sf.svgbase.Size(this.legend.shapeWidth, this.legend.shapeHeight), '', 
            // tslint:disable-next-line:max-line-length
            // tslint:disable-next-line:align
            symbolOption, this.accessbilityText, this.chart.renderer, null, this.isBulletChartControl, control));
        }
        else {
            regionPadding = -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber);
            drawSymbol(legendOption.location, shape, new sf.svgbase.Size(this.legend.shapeWidth, this.legend.shapeHeight), '', 
            // tslint:disable-next-line:align
            symbolOption, this.accessbilityText, this.chart.renderer, this.currentPageNumber ? new sf.svgbase.Rect(0, regionPadding, 0, 0) : null, this.isBulletChartControl, control);
            this.legendRegions.push({
                rect: new sf.svgbase.Rect(legendOption.location.x, legendOption.location.y, 
                // tslint:disable-next-line:align
                this.legend.shapeWidth, this.legend.shapeHeight + regionPadding), index: i
            });
        }
        if (shape === 'Line' && legendOption.markerVisibility && legendOption.markerShape !== 'Image' ||
            legendOption.type === 'Doughnut') {
            symbolOption.id = this.legendID + this.generateId(legendOption, '_shape_marker_', i);
            shape = legendOption.type === 'Doughnut' ? 'Circle' : legendOption.markerShape;
            symbolOption.fill = legendOption.type === 'Doughnut' ? '#FFFFFF' : symbolOption.fill;
            if (!isCanvas) {
                // tslint:disable-next-line:max-line-length
                group.appendChild(drawSymbol(legendOption.location, shape, new sf.svgbase.Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2), 
                // tslint:disable-next-line:align
                '', symbolOption, this.accessbilityText, null, null, this.isBulletChartControl, control));
            }
            else {
                drawSymbol(legendOption.location, shape, new sf.svgbase.Size(this.legend.shapeWidth / 2, this.legend.shapeHeight / 2), 
                // tslint:disable-next-line:align
                '', symbolOption, this.accessbilityText, this.chart.renderer, this.currentPageNumber ?
                    new sf.svgbase.Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) : null, this.isBulletChartControl, control);
            }
        }
    };
    /**
     * To render legend text for chart and accumulation chart
     */
    BaseLegend.prototype.renderText = function (chart, legendOption, group, textOptions, i) {
        var legend = chart.legendSettings;
        var hiddenColor = '#D3D3D3';
        textOptions.id = this.legendID + this.generateId(legendOption, '_text_', i);
        var fontcolor = legendOption.visible ? legend.textStyle.color || chart.themeStyle.legendLabel : hiddenColor;
        textOptions.text = legendOption.text;
        textOptions.x = legendOption.location.x + (legend.shapeWidth / 2) + legend.shapePadding;
        textOptions.y = legendOption.location.y + this.maxItemHeight / 4;
        var isCanvas = this.chart.enableCanvas;
        var element = textElement$1(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false, null, this.currentPageNumber && isCanvas ?
            new sf.svgbase.Rect(0, -this.translatePage(null, this.currentPageNumber - 1, this.currentPageNumber), 0, 0) : null);
        if (element) {
            element.setAttribute('aria-label', legend.description || this.accessbilityText);
        }
        if (isCanvas) {
            var textSize = sf.svgbase.measureText(textOptions.text, legend.textStyle);
            this.legendRegions[i].rect.y = textOptions.y < this.legendRegions[i].rect.y ? textOptions.y : this.legendRegions[i].rect.y;
            this.legendRegions[i].rect.width += textSize.width;
            this.legendRegions[i].rect.height = textSize.height;
            this.legendRegions[i].rect.y -= textSize.height * 0.5;
        }
    };
    /**
     * To render legend paging elements for chart and accumulation chart
     */
    // tslint:disable-next-line:max-func-body-length
    BaseLegend.prototype.renderPagingElements = function (chart, bounds, textOption, legendGroup) {
        var paginggroup = chart.renderer.createGroup({ id: this.legendID + '_navigation' });
        this.pagingRegions = [];
        var pageTextElement;
        var isCanvas = chart.enableCanvas;
        var titleHeight = this.isBulletChartControl ? 0 : this.legendTitleSize.height;
        this.backwardArrowOpacity = this.currentPage !== 1 ? 1 : 0;
        this.forwardArrowOpacity = this.currentPage === this.totalPages ? 0 : 1;
        if (!isCanvas) {
            legendGroup.appendChild(paginggroup);
        }
        var grayColor = '#545454';
        var legend = chart.legendSettings; // to solve parameter lint error, legend declaration is here
        var padding = 8; // const padding for paging elements
        if (this.isChartControl || this.isBulletChartControl || !this.isVertical) {
            this.totalPages = Math.ceil(this.totalPages / Math.max(1, this.rowCount - 1));
        }
        else {
            this.totalPages = Math.ceil(this.totalPages / this.maxColumns);
        }
        var symbolOption = new sf.svgbase.PathOption(this.legendID + '_pageup', 'transparent', 5, grayColor, 1, '', '');
        var iconSize = this.pageButtonSize;
        if (paginggroup) {
            paginggroup.setAttribute('style', 'cursor: pointer');
        }
        // Page left arrow drawing calculation started here
        var rowCount = !legend.enablePages && this.isPaging && !this.isVertical && !this.isBulletChartControl ? 1 :
            (this.rowCount - 1);
        this.clipPathHeight = rowCount * (this.maxItemHeight + legend.padding);
        if (!isCanvas) {
            this.clipRect.setAttribute('height', this.clipPathHeight.toString());
        }
        else {
            //paging clipRect only for canvas mode
            this.pagingClipRect.height = this.legendBounds.height - this.clipPathHeight -
                (this.pagingClipRect.y - this.legendBounds.y) - legend.border.width;
            this.pagingClipRect.y = this.pagingClipRect.y + this.clipPathHeight;
            this.pagingClipRect.x += legend.border.width;
            this.pagingClipRect.width -= (legend.border.width + legend.border.width / 2);
            this.chart.renderer.clearRect(new sf.svgbase.Rect(this.pagingClipRect.x, this.pagingClipRect.y, this.pagingClipRect.width, this.pagingClipRect.height));
        }
        var titleWidth = this.isTitle && legend.titlePosition === 'Left' ? this.legendTitleSize.width : 0;
        var x = (bounds.x + iconSize / 2);
        var y = bounds.y + this.clipPathHeight + ((titleHeight + bounds.height - this.clipPathHeight) / 2);
        if (this.isPaging && !legend.enablePages && !this.isVertical && !this.isBulletChartControl) {
            x = (bounds.x + this.fivePixel + this.pageButtonSize + titleWidth);
            y = legend.title && this.isTop ? (bounds.y + padding + titleHeight + (iconSize / 1) + 0.5) :
                (bounds.y + padding + iconSize + 0.5);
        }
        var size = sf.svgbase.measureText(this.totalPages + '/' + this.totalPages, legend.textStyle);
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + (iconSize / 2) + padding + titleHeight;
                symbolOption.opacity = this.backwardArrowOpacity;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'UpArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'UpArrow'));
            }
            else {
                symbolOption.opacity = this.isBulletChartControl ? symbolOption.opacity :
                    (legend.enablePages ? 1 : this.backwardArrowOpacity);
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'LeftArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'LeftArrow'));
            }
        }
        else {
            drawSymbol({ x: x, y: y }, 'LeftArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'LeftArrow', this.chart.renderer, new sf.svgbase.Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new sf.svgbase.Rect(x + bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5, y - iconSize * 0.5, iconSize, iconSize));
        // Page numbering rendering calculation started here
        textOption.x = x + (iconSize / 2) + padding;
        textOption.y = y + (size.height / 4);
        textOption.id = this.legendID + '_pagenumber';
        textOption.text = '1/' + this.totalPages;
        if (isCanvas && this.totalNoOfPages) {
            textOption.text = this.currentPageNumber + '/' + this.totalNoOfPages;
        }
        if (legend.enablePages || this.isBulletChartControl) {
            pageTextElement = textElement$1(chart.renderer, textOption, legend.textStyle, legend.textStyle.color, paginggroup, false, false, false, false, null, new sf.svgbase.Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        // Page right arrow rendering calculation started here
        x = textOption.x + padding + (iconSize / 2) + size.width;
        if (this.isPaging && !legend.enablePages && !this.isVertical) {
            x = (bounds.x + bounds.width - this.fivePixel - this.pageButtonSize - (legend.title && legend.titlePosition === 'Right' ?
                this.legendTitleSize.width + this.fivePixel : 0));
        }
        symbolOption.id = this.legendID + '_pagedown';
        symbolOption.opacity = !legend.enablePages ? this.forwardArrowOpacity : 1;
        if (!isCanvas) {
            if (this.isVertical && !legend.enablePages && !this.isBulletChartControl) {
                x = bounds.x + (bounds.width / 2);
                y = bounds.y + bounds.height - (iconSize / 2) - padding;
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'DownArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'DownArrow'));
            }
            else {
                paginggroup.appendChild(drawSymbol({ x: x, y: y }, 'RightArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'RightArrow'));
            }
        }
        else {
            drawSymbol({ x: x, y: y }, 'RightArrow', new sf.svgbase.Size(iconSize, iconSize), '', symbolOption, 'RightArrow', this.chart.renderer, new sf.svgbase.Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
        }
        this.pagingRegions.push(new sf.svgbase.Rect(x + (bounds.width - (2 * (iconSize + padding) + padding + size.width) - iconSize * 0.5), y - iconSize * 0.5, iconSize, iconSize));
        if (!isCanvas && (legend.enablePages || this.isBulletChartControl)) {
            //placing the navigation buttons and page numbering in legend right corner
            paginggroup.setAttribute('transform', 'translate(' + (bounds.width - (2 * (iconSize + padding) +
                padding + size.width)) + ', ' + 0 + ')');
        }
        else {
            if (this.currentPageNumber === 1 && this.calTotalPage && (legend.enablePages || this.isBulletChartControl)) {
                this.totalNoOfPages = this.totalPages;
                this.calTotalPage = false;
            }
            if (!legend.enablePages && !this.isBulletChartControl) { // For new legend page navigation
                this.translatePage(null, this.currentPage - 1, this.currentPage, legend);
            }
        }
        if (legend.enablePages || this.isBulletChartControl) {
            this.translatePage(pageTextElement, this.currentPage - 1, this.currentPage, legend);
        }
    };
    /**
     * To translate legend pages for chart and accumulation chart
     */
    BaseLegend.prototype.translatePage = function (pagingText, page, pageNumber, legend) {
        var size = (this.clipPathHeight) * page;
        var translate = 'translate(0,-' + size + ')';
        if (!this.isChartControl && !this.isBulletChartControl && this.isVertical) {
            var pageLength = page * this.maxColumns;
            size = this.pageXCollections[page * this.maxColumns] - this.legendBounds.x;
            size = size < 0 ? 0 : size; // to avoid small pixel variation
            translate = 'translate(-' + size + ',0)';
        }
        if (!this.chart.enableCanvas) {
            this.legendTranslateGroup.setAttribute('transform', translate);
        }
        if (!this.chart.enableCanvas && (legend.enablePages || this.isBulletChartControl)) {
            pagingText.textContent = (pageNumber) + '/' + this.totalPages;
        }
        this.currentPage = pageNumber;
        return size;
    };
    /**
     * To change legend pages for chart and accumulation chart
     */
    BaseLegend.prototype.changePage = function (event, pageUp) {
        var legend = this.chart.legendSettings;
        var backwardArrow = document.getElementById(this.legendID + '_pageup');
        var forwardArrow = document.getElementById(this.legendID + '_pagedown');
        var pageText = (legend.enablePages || this.isBulletChartControl) ?
            document.getElementById(this.legendID + '_pagenumber') : null;
        var page = (legend.enablePages || this.isBulletChartControl) ? parseInt(pageText.textContent.split('/')[0], 10) :
            this.currentPage;
        if (pageUp && page > 1) {
            this.translatePage(pageText, (page - 2), (page - 1), legend);
        }
        else if (!pageUp && page < this.totalPages) {
            this.translatePage(pageText, page, (page + 1), legend);
        }
        if (this.isPaging && !legend.enablePages && !this.isBulletChartControl) {
            this.currentPage === this.totalPages ? this.hideArrow(forwardArrow) : this.showArrow(forwardArrow);
            this.currentPage === 1 ? this.hideArrow(backwardArrow) : this.showArrow(backwardArrow);
        }
    };
    /**
     * To hide the backward and forward arrow
     * @param arrowElement
     */
    BaseLegend.prototype.hideArrow = function (arrowElement) {
        arrowElement.setAttribute('opacity', '0');
    };
    /**
     * To show the  backward and forward arrow
     * @param arrowElement
     */
    BaseLegend.prototype.showArrow = function (arrowElement) {
        arrowElement.setAttribute('opacity', '1');
    };
    /**
     * To find legend elements id based on chart or accumulation chart
     * @private
     */
    BaseLegend.prototype.generateId = function (option, prefix, count) {
        if (this.isChartControl) {
            return prefix + count;
        }
        else {
            return prefix + option.pointIndex;
        }
    };
    /**
     * To show or hide trimmed text tooltip for legend.
     * @return {void}
     * @private
     */
    BaseLegend.prototype.move = function (event) {
        var _this = this;
        var x = this.chart.mouseX;
        var y = this.chart.mouseY;
        if (event.target.textContent.indexOf('...') > -1) {
            var targetId = event.target.id.split(this.legendID + '_text_');
            if (targetId.length === 2) {
                var index = parseInt(targetId[1], 10);
                var element = this.chart.element;
                if (!isNaN(index)) {
                    if (this.chart.isTouch) {
                        removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
                    }
                    if (this.isChartControl) {
                        showTooltip(this.chart.series[index].name, x, y, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip', getElement(this.chart.element.id + '_Secondary_Element'));
                    }
                    else {
                        showTooltip(this.chart.visibleSeries[0].points[index].x.toString(), x + 10, y + 10, element.offsetWidth, element.id + '_EJ2_Legend_Tooltip', getElement(this.chart.element.id + '_Secondary_Element'));
                    }
                }
            }
        }
        else {
            removeElement(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
        if (this.chart.isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = setTimeout(function () { removeElement(_this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
        }
    };
    return BaseLegend;
}());
/**
 * Class for legend options
 * @private
 */
var LegendOptions = /** @class */ (function () {
    function LegendOptions(text, fill, shape, visible, type, markerShape, markerVisibility, pointIndex, seriesIndex) {
        this.location = { x: 0, y: 0 };
        this.text = text;
        this.fill = fill;
        this.shape = shape;
        this.visible = visible;
        this.type = type;
        this.markerVisibility = markerVisibility;
        this.markerShape = markerShape;
        this.pointIndex = pointIndex;
        this.seriesIndex = seriesIndex;
    }
    return LegendOptions;
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
 * Configuration of the bullet chart ranges
 */
var Range = /** @class */ (function (_super) {
    __extends$5(Range, _super);
    function Range() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], Range.prototype, "end", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], Range.prototype, "opacity", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], Range.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], Range.prototype, "index", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], Range.prototype, "name", void 0);
    __decorate$4([
        sf.base.Property('Rectangle')
    ], Range.prototype, "shape", void 0);
    return Range;
}(sf.base.ChildProperty));
/**
 * Configures the major tick lines.
 */
var MajorTickLinesSettings = /** @class */ (function (_super) {
    __extends$5(MajorTickLinesSettings, _super);
    function MajorTickLinesSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(12)
    ], MajorTickLinesSettings.prototype, "height", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], MajorTickLinesSettings.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MajorTickLinesSettings.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], MajorTickLinesSettings.prototype, "useRangeColor", void 0);
    return MajorTickLinesSettings;
}(sf.base.ChildProperty));
/**
 * Configures the minor tick lines.
 */
var MinorTickLinesSettings = /** @class */ (function (_super) {
    __extends$5(MinorTickLinesSettings, _super);
    function MinorTickLinesSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(8)
    ], MinorTickLinesSettings.prototype, "height", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], MinorTickLinesSettings.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MinorTickLinesSettings.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], MinorTickLinesSettings.prototype, "useRangeColor", void 0);
    return MinorTickLinesSettings;
}(sf.base.ChildProperty));
/**
 * Configures the fonts in bullet chart.
 */
var BulletLabelStyle = /** @class */ (function (_super) {
    __extends$5(BulletLabelStyle, _super);
    function BulletLabelStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('Normal')
    ], BulletLabelStyle.prototype, "fontStyle", void 0);
    __decorate$4([
        sf.base.Property('16px')
    ], BulletLabelStyle.prototype, "size", void 0);
    __decorate$4([
        sf.base.Property('')
    ], BulletLabelStyle.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property('Normal')
    ], BulletLabelStyle.prototype, "fontWeight", void 0);
    __decorate$4([
        sf.base.Property('Segoe UI')
    ], BulletLabelStyle.prototype, "fontFamily", void 0);
    __decorate$4([
        sf.base.Property('Center')
    ], BulletLabelStyle.prototype, "textAlignment", void 0);
    __decorate$4([
        sf.base.Property('None')
    ], BulletLabelStyle.prototype, "textOverflow", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], BulletLabelStyle.prototype, "opacity", void 0);
    __decorate$4([
        sf.base.Property(true)
    ], BulletLabelStyle.prototype, "enableTrim", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], BulletLabelStyle.prototype, "maximumTitleWidth", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], BulletLabelStyle.prototype, "useRangeColor", void 0);
    return BulletLabelStyle;
}(sf.base.ChildProperty));
/**
 * Configures the ToolTips in the bullet chart.
 */
var BulletTooltipSettings = /** @class */ (function (_super) {
    __extends$5(BulletTooltipSettings, _super);
    function BulletTooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], BulletTooltipSettings.prototype, "enable", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], BulletTooltipSettings.prototype, "fill", void 0);
    __decorate$4([
        sf.base.Complex(exports.BulletChartTheme.tooltipLabelFont, BulletLabelStyle)
    ], BulletTooltipSettings.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Complex({ color: '#cccccc', width: 0.5 }, Border)
    ], BulletTooltipSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], BulletTooltipSettings.prototype, "template", void 0);
    return BulletTooltipSettings;
}(sf.base.ChildProperty));
/**
 * Configures the DataLabel in the bullet chart.
 */
var BulletDataLabel = /** @class */ (function (_super) {
    __extends$5(BulletDataLabel, _super);
    function BulletDataLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], BulletDataLabel.prototype, "enable", void 0);
    __decorate$4([
        sf.base.Complex(exports.BulletChartTheme.dataLabelFont, BulletLabelStyle)
    ], BulletDataLabel.prototype, "labelStyle", void 0);
    return BulletDataLabel;
}(sf.base.ChildProperty));
/**
 * Configures the legends in charts.
 */
var BulletChartLegendSettings = /** @class */ (function (_super) {
    __extends$5(BulletChartLegendSettings, _super);
    function BulletChartLegendSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], BulletChartLegendSettings.prototype, "visible", void 0);
    __decorate$4([
        sf.base.Complex({ x: 0, y: 0 }, Location)
    ], BulletChartLegendSettings.prototype, "location", void 0);
    __decorate$4([
        sf.base.Property(8)
    ], BulletChartLegendSettings.prototype, "padding", void 0);
    __decorate$4([
        sf.base.Property('Center')
    ], BulletChartLegendSettings.prototype, "alignment", void 0);
    __decorate$4([
        sf.base.Property(10)
    ], BulletChartLegendSettings.prototype, "shapeHeight", void 0);
    __decorate$4([
        sf.base.Property(10)
    ], BulletChartLegendSettings.prototype, "shapeWidth", void 0);
    __decorate$4([
        sf.base.Complex(exports.BulletChartTheme.legendLabelFont, BulletLabelStyle)
    ], BulletChartLegendSettings.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Property('Auto')
    ], BulletChartLegendSettings.prototype, "position", void 0);
    __decorate$4([
        sf.base.Complex({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    ], BulletChartLegendSettings.prototype, "margin", void 0);
    __decorate$4([
        sf.base.Complex({}, Border)
    ], BulletChartLegendSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property(5)
    ], BulletChartLegendSettings.prototype, "shapePadding", void 0);
    __decorate$4([
        sf.base.Property('transparent')
    ], BulletChartLegendSettings.prototype, "background", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], BulletChartLegendSettings.prototype, "opacity", void 0);
    __decorate$4([
        sf.base.Property(3)
    ], BulletChartLegendSettings.prototype, "tabIndex", void 0);
    return BulletChartLegendSettings;
}(sf.base.ChildProperty));

var ExportUtils = /** @class */ (function () {
    /**
     * Constructor for chart and accumulation annotation
     * @param control
     */
    function ExportUtils(control) {
        this.control = control;
    }
    /**
     * To print the accumulation and chart elements
     * @param elements
     */
    ExportUtils.prototype.print = function (elements) {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        var argsData = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger(beforePrint, argsData);
        if (!argsData.cancel) {
            sf.base.print(argsData.htmlContent, this.printWindow);
        }
    };
    /**
     * To get the html string of the chart and accumulation
     * @param elements
     * @private
     */
    ExportUtils.prototype.getHTMLContent = function (elements) {
        var div = sf.base.createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                for (var j = 0; j < elements.length; j++) {
                    var value = elements[j];
                    div.appendChild(getElement(value).cloneNode(true));
                }
            }
            else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true));
            }
            else {
                div.appendChild(getElement(elements).cloneNode(true));
            }
        }
        else {
            div.appendChild(this.control.element.cloneNode(true));
        }
        return div;
    };
    /**
     * To export the file as image/svg format
     * @param type
     * @param fileName
     */
    ExportUtils.prototype.export = function (type, fileName, orientation, controls, width, height, isVertical, header, footer) {
        var _this = this;
        var controlValue = this.getControlsValue(controls, isVertical);
        width = width ? width : controlValue.width;
        height = height ? height : controlValue.height;
        var element = this.control.svgObject;
        var isCanvas = this.control.enableCanvas;
        var image;
        if (!isCanvas) {
            element = sf.base.createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': width.toString(),
                    'height': height.toString()
                }
            });
        }
        var isDownload = !(sf.base.Browser.userAgent.toString().indexOf('HeadlessChrome') > -1);
        orientation = sf.base.isNullOrUndefined(orientation) ? sf.pdfexport.PdfPageOrientation.Landscape : orientation;
        var svgData = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
            controlValue.svg.outerHTML +
            '</svg>';
        var url = window.URL.createObjectURL(new Blob(type === 'SVG' ? [svgData] :
            [(new XMLSerializer()).serializeToString(controlValue.svg)], { type: 'image/svg+xml' }));
        if (type === 'SVG') {
            if (sf.base.Browser.info.name === 'msie') {
                var svg = new Blob([(new XMLSerializer()).serializeToString(controlValue.svg)], { type: 'application/octet-stream' });
                window.navigator.msSaveOrOpenBlob(svg, fileName + '.' + type.toLocaleLowerCase());
            }
            else {
                this.triggerDownload(fileName, type, url, isDownload);
            }
        }
        else if (sf.base.Browser.info.name === 'msie') {
            var canvas = element;
            if (!isCanvas) {
                canvas = this.createCanvas();
            }
            image = canvas.toDataURL();
            if (type === 'PDF') {
                this.exportPdf(canvas, orientation, width, height, isDownload, fileName, header, footer);
            }
            else {
                this.doexport(type, image, fileName);
            }
        }
        else {
            var image_1 = new Image();
            var ctx_1 = element.getContext('2d');
            image_1.onload = (function () {
                ctx_1.drawImage(image_1, 0, 0);
                window.URL.revokeObjectURL(url);
                if (type === 'PDF') {
                    _this.exportPdf(element, orientation, width, height, isDownload, fileName, header, footer);
                }
                else {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(element.msToBlob(), fileName + '.' + type.toLocaleLowerCase());
                    }
                    else {
                        _this.triggerDownload(fileName, type, element.toDataURL('image/' + type.toLowerCase()), isDownload);
                    }
                }
            });
            image_1.src = url;
        }
        if (!isCanvas) {
            removeElement(document.getElementById(this.control.element.id + '_canvas'));
        }
    };
    /**
     * To get data url for charts.
     */
    ExportUtils.prototype.getDataUrl = function (chart) {
        var controlValue = this.getControlsValue([chart]);
        var element = this.control.svgObject;
        var isCanvas = this.control.enableCanvas;
        if (!isCanvas) {
            element = sf.base.createElement('canvas', {
                id: 'ej2-canvas',
                attrs: {
                    'width': controlValue.width.toString(),
                    'height': controlValue.height.toString()
                }
            });
        }
        var url = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(controlValue.svg)], { type: 'image/svg+xml' }));
        if (sf.base.Browser.info.name === 'msie') {
            var canvas = element;
            if (!isCanvas) {
                canvas = this.createCanvas();
            }
            var argsData = {
                name: afterExport, cancel: false, dataUrl: element.toDataURL('image/png')
            };
            chart.trigger(afterExport, argsData);
            return { element: canvas, dataUrl: canvas.toDataURL() };
        }
        else {
            var image_2 = new Image();
            var ctx_2 = element.getContext('2d');
            image_2.onload = (function () {
                ctx_2.drawImage(image_2, 0, 0);
                window.URL.revokeObjectURL(url);
                var argsData = {
                    name: afterExport, cancel: false, dataUrl: element.toDataURL('image/png')
                };
                chart.trigger(afterExport, argsData);
                return argsData.dataUrl;
            });
            image_2.src = url;
            return { element: element, blobUrl: url };
        }
    };
    /**
     * To trigger the download element
     * @param fileName
     * @param type
     * @param url
     */
    ExportUtils.prototype.triggerDownload = function (fileName, type, url, isDownload) {
        sf.base.createElement('a', {
            attrs: {
                'download': fileName + '.' + type.toLocaleLowerCase(),
                'href': url
            }
        }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
            view: window,
            bubbles: false,
            cancelable: true
        }));
    };
    /**
     * To get the maximum size value
     * @param controls
     * @param name
     */
    // tslint:disable-next-line:max-line-length
    ExportUtils.prototype.getControlsValue = function (controls, isVertical) {
        var width = 0;
        var height = 0;
        var content = '';
        var isCanvas = this.control.enableCanvas;
        var svgObject = new sf.svgbase.SvgRenderer('').createSvg({
            id: 'Svg_Export_Element',
            width: 200, height: 200
        });
        controls.map(function (control) {
            var svg = control.svgObject.cloneNode(true);
            var groupEle = control.renderer.createGroup({
                style: (sf.base.isNullOrUndefined(isVertical) || isVertical) ? 'transform: translateY(' + height + 'px)' :
                    'transform: translateX(' + width + 'px)'
            });
            if (!isCanvas) {
                groupEle.appendChild(svg);
            }
            width = (sf.base.isNullOrUndefined(isVertical) || isVertical) ? Math.max(control.availableSize.width, width) :
                width + control.availableSize.width;
            height = (sf.base.isNullOrUndefined(isVertical) || isVertical) ? height + control.availableSize.height :
                Math.max(control.availableSize.height, height);
            content += control.svgObject.outerHTML;
            if (!isCanvas) {
                svgObject.appendChild(groupEle);
            }
        });
        if (!isCanvas) {
            svgObject.setAttribute('width', width + '');
            svgObject.setAttribute('height', height + '');
        }
        return {
            'width': width,
            'height': height,
            'svg': svgObject
        };
    };
    ExportUtils.prototype.createCanvas = function () {
        var chart = this.control;
        this.canvasRender(true, chart);
        var canvas = chart.svgObject;
        this.canvasRender(false, chart);
        return canvas;
    };
    /**
     * To convert svg chart into canvas chart to fix export issue in IE
     * We cant export svg to other formats in IE
     */
    // tslint:disable:no-string-literal
    ExportUtils.prototype.canvasRender = function (enableCanvas, chart) {
        chart.enableCanvas = enableCanvas;
        chart['preRender']();
        chart['render']();
    };
    // tslint:disable-next-line:max-line-length
    ExportUtils.prototype.exportPdf = function (element, orientation, width, height, isDownload, fileName, header, footer) {
        var document = new sf.pdfexport.PdfDocument();
        var margin = document.pageSettings.margins;
        var pdfDefaultWidth = document.pageSettings.width;
        var pdfDefaultHeight = document.pageSettings.height;
        var exactWidth;
        var exactHeight;
        var imageString = element.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
        document.pageSettings.orientation = orientation;
        exactWidth = (pdfDefaultWidth < width) ? (width + margin.left + margin.right) : pdfDefaultWidth;
        exactHeight = (pdfDefaultHeight < height) ? (height + margin.top + margin.bottom) : pdfDefaultHeight;
        if (header !== undefined) {
            var font = new sf.pdfexport.PdfStandardFont(1, header.fontSize || 15);
            var pdfHeader = new sf.pdfexport.PdfPageTemplateElement(exactWidth, 40);
            // tslint:disable-next-line:max-line-length
            pdfHeader.graphics.drawString(header.content + '', font, null, new sf.pdfexport.PdfSolidBrush(new sf.pdfexport.PdfColor(0, 0, 0)), header.x, header.y, null);
            document.template.top = pdfHeader;
        }
        if (footer !== undefined) {
            var font = new sf.pdfexport.PdfStandardFont(1, footer.fontSize || 15);
            var pdfFooter = new sf.pdfexport.PdfPageTemplateElement(exactWidth, 40);
            // tslint:disable-next-line:max-line-length
            pdfFooter.graphics.drawString(footer.content + '', font, null, new sf.pdfexport.PdfSolidBrush(new sf.pdfexport.PdfColor(0, 0, 0)), footer.x, footer.y, null);
            document.template.bottom = pdfFooter;
        }
        document.pageSettings.size = new sf.pdfexport.SizeF(exactWidth, exactHeight);
        imageString = imageString.slice(imageString.indexOf(',') + 1);
        document.pages.add().graphics.drawImage(new sf.pdfexport.PdfBitmap(imageString), 0, 0, width, height);
        if (isDownload) {
            document.save(fileName + '.pdf');
            document.destroy();
        }
    };
    ExportUtils.prototype.doexport = function (type, image, fileName) {
        var images = [];
        var fileType = type || 'JPG';
        images = [image];
        this.exportImage(images, fileName, fileType, image);
    };
    ExportUtils.prototype.exportImage = function (images, fileName, fileType, image) {
        var buffers = [];
        var length = (!(images instanceof HTMLElement)) ? images.length : 0;
        for (var g = 0; g < length; g++) {
            image = images[g];
            image = image.replace(/^data:[a-z]*;,/, '');
            var image1 = image.split(',');
            var byteString = atob(image1[1]);
            var buffer = new ArrayBuffer(byteString.length);
            var intArray = new Uint8Array(buffer);
            for (var i = 0; i < byteString.length; i++) {
                intArray[i] = byteString.charCodeAt(i);
            }
            buffers.push(buffer);
        }
        for (var j = 0; j < buffers.length; j++) {
            var b = new Blob([buffers[j]], { type: 'application/octet-stream' });
            if (sf.base.Browser.info.name === 'msie') {
                window.navigator.msSaveOrOpenBlob(b, fileName + '.' + fileType.toLocaleLowerCase());
            }
        }
    };
    return ExportUtils;
}());

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
/**
 * bullet chart
 */
var BulletChart = /** @class */ (function (_super) {
    __extends(BulletChart, _super);
    /**
     * Constructor for creating the bullet chart
     * @hidden
     */
    function BulletChart(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.bulletid = 57726;
        /** @private */
        _this.animateSeries = true;
        _this.padding = 5;
        /** @private */
        _this.leftSize = 0;
        /** @private */
        _this.rightSize = 0;
        /** @private */
        _this.topSize = 0;
        /** @private */
        _this.bottomSize = 0;
        /** @private */
        _this.maxLabelSize = new sf.svgbase.Size(0, 0);
        _this.maxTitleSize = new sf.svgbase.Size(0, 0);
        /** @private */
        _this.intervalDivs = [10, 5, 2, 1];
        return _this;
    }
    /**
     * Initialize the event handler.
     */
    BulletChart.prototype.preRender = function () {
        var blazor = 'Blazor';
        this.isBlazor = window[blazor];
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.initPrivateValues();
        this.setCulture();
        this.wireEvents();
    };
    /**
     * To initialize the private variables
     */
    BulletChart.prototype.initPrivateValues = function () {
        this.delayRedraw = false;
        this.scale = new ScaleGroup(this);
        this.bulletAxis = new BulletChartAxis(this);
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-BulletChart').length;
            this.element.id = 'BulletChart_' + this.bulletid + '_' + collection;
        }
    };
    /**
     * Method to set culture for BulletChart
     */
    BulletChart.prototype.setCulture = function () {
        this.intl = new sf.base.Internationalization();
    };
    /**
     * To Initialize the bullet chart rendering.
     */
    BulletChart.prototype.render = function () {
        var _this = this;
        var loadEventData = {
            bulletChart: this.isBlazor ? {} : this,
            theme: this.theme, name: 'load'
        };
        this.trigger('load', loadEventData, function () {
            _this.theme = _this.isBlazor ? loadEventData.theme : _this.theme;
            _this.setTheme();
            _this.createSvg(_this);
            _this.findRange();
            if (_this.bulletChartLegendModule && _this.legendSettings.visible) {
                _this.calculateVisibleElements();
                _this.bulletChartLegendModule.getLegendOptions(_this.visibleRanges, _this);
            }
            _this.calculatePosition();
            _this.renderBulletElements();
            var blazor = 'Blazor';
            _this.trigger('loaded', { bulletChart: window[blazor] ? {} : _this });
            _this.allowServerDataBinding = true;
            _this.renderComplete();
        });
    };
    /**
     * Theming for bullet chart
     */
    BulletChart.prototype.setTheme = function () {
        this.themeStyle = getBulletThemeColor(this.theme, this);
    };
    BulletChart.prototype.findRange = function () {
        if (!this.minimum) {
            this.minimum = 0;
        }
        if (!this.maximum) {
            this.maximum = 0;
            for (var i = 0; i < this.ranges.length; i++) {
                this.maximum = this.maximum > this.ranges[i].end ? this.maximum : this.ranges[i].end;
            }
        }
        if (this.maximum === null) {
            if (!sf.base.isNullOrUndefined(this.dataSource)) {
                for (var i = 0; i < Object.keys(this.dataSource).length; i++) {
                    if (this.dataSource[i][this.targetField] > this.dataSource[i][this.valueField]) {
                        this.maximum = this.maximum > this.dataSource[i][this.targetField] ? this.maximum + this.interval :
                            this.dataSource[i][this.targetField] + this.interval;
                    }
                    else {
                        this.maximum = this.maximum > this.dataSource[i][this.valueField] ? this.maximum + this.interval :
                            this.dataSource[i][this.valueField] + this.interval;
                    }
                }
            }
            else {
                this.maximum = 10;
            }
        }
        if (!this.interval) {
            this.interval = this.calculateNumericNiceInterval(this.maximum - this.minimum);
        }
    };
    BulletChart.prototype.getActualDesiredIntervalsCount = function (availableSize) {
        var size = this.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
        // tslint:disable-next-line:align
        var desiredIntervalsCount = (this.orientation === 'Horizontal' ? 0.533 : 1) * 3;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    };
    /**
     * Numeric Nice Interval for the axis.
     * @private
     */
    BulletChart.prototype.calculateNumericNiceInterval = function (delta) {
        var actualDesiredIntervalsCount = this.getActualDesiredIntervalsCount(this.availableSize);
        var niceInterval = delta / actualDesiredIntervalsCount;
        var minInterval = Math.pow(10, Math.floor(logBase(niceInterval, 10)));
        for (var _i = 0, _a = this.intervalDivs; _i < _a.length; _i++) {
            var interval = _a[_i];
            var currentInterval = minInterval * interval;
            if (actualDesiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    };
    /**
     * To set the left and top position for data label template for center aligned bulletchart
     */
    BulletChart.prototype.setSecondaryElementPosition = function () {
        var element = getElement(this.element.id + '_Secondary_Element');
        if (!element) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        element.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        element.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
        element.style.position = 'relative';
    };
    /**
     * Method to create SVG element.
     */
    BulletChart.prototype.createSvg = function (chart) {
        this.removeSvg();
        chart.renderer = new sf.svgbase.SvgRenderer(chart.element.id);
        this.calculateAvailableSize(this);
        chart.svgObject = chart.renderer.createSvg({
            id: chart.element.id + '_svg',
            width: chart.availableSize.width,
            height: chart.availableSize.height
        });
        this.renderChartBackground();
    };
    /**
     * Creating a background element to the svg object
     */
    BulletChart.prototype.renderChartBackground = function () {
        var rect = new RectOption(this.element.id + '_ChartBorder', this.themeStyle.background, { width: this.border.width || 0, color: this.border.color || 'transparent' }, 1, new sf.svgbase.Rect(0, 0, this.availableSize.width, this.availableSize.height));
        this.svgObject.appendChild(this.renderer.drawRectangle(rect));
    };
    /**
     * Rendering the bullet elements
     */
    BulletChart.prototype.renderBulletElements = function () {
        var scaleGroup = this.renderer.createGroup({ 'id': this.svgObject.id + '_scaleGroup' });
        this.svgObject.appendChild(scaleGroup);
        this.renderBulletChartTitle();
        this.rangeCollection = this.scale.drawScaleGroup(scaleGroup);
        var size = (this.orientation === 'Horizontal') ? this.initialClipRect.width : this.initialClipRect.height;
        var intervalValue = size / ((this.maximum - this.minimum) / this.interval);
        this.bulletAxis.renderMajorTickLines(intervalValue, scaleGroup);
        this.bulletAxis.renderMinorTickLines(intervalValue, scaleGroup);
        this.bulletAxis.renderAxisLabels(intervalValue, scaleGroup);
        this.bulletChartRect.x = (this.titlePosition === 'Left' ||
            this.titlePosition === 'Right' || this.orientation === 'Vertical') ? this.bulletChartRect.x : 0;
        var categoryWidth = (this.categoryField != null) ? (this.maxLabelSize.width + this.margin.left) : 0;
        var elementId = this.element.id;
        if (this.element.tagName !== 'g') {
            var tooltipDiv = redrawElement(this.redraw, elementId + '_Secondary_Element') ||
                this.createElement('div');
            tooltipDiv.id = elementId + '_Secondary_Element';
            appendChildElement(false, this.element, tooltipDiv, this.redraw);
        }
        if (this.tooltip.enable) {
            appendChildElement(false, this.svgObject, this.renderer.createGroup({ id: elementId + '_UserInteraction', style: 'pointer-events:none;' }), this.redraw);
        }
        //this.bulletAxis.renderYAxisLabels(intervalValue, scaleGroup, this.bulletChartRect);
        this.bindData();
        this.renderDataLabel();
        this.renderBulletLegend();
        //this.changeOrientation(scaleGroup);
        this.element.appendChild(this.svgObject);
        this.setSecondaryElementPosition();
    };
    /**
     * To render the legend
     */
    BulletChart.prototype.renderBulletLegend = function () {
        if (this.bulletChartLegendModule && this.bulletChartLegendModule.legendCollections.length) {
            this.bulletChartLegendModule.calTotalPage = true;
            var bounds = this.bulletChartLegendModule.legendBounds;
            this.bulletChartLegendModule.renderLegend(this, this.legendSettings, bounds);
        }
    };
    /**
     * Handles the bullet chart resize.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.bulletResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        var arg = {
            chart: this,
            name: resized,
            currentSize: new sf.svgbase.Size(0, 0),
            previousSize: new sf.svgbase.Size(this.availableSize.width, this.availableSize.height),
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            _this.createSvg(_this);
            arg.currentSize = _this.availableSize;
            _this.trigger(resized, arg);
            _this.calculatePosition();
            _this.renderBulletElements();
        }, 500);
        return false;
    };
    /**
     * Process the data values of feature and comparative measure bar
     */
    BulletChart.prototype.bindData = function () {
        if (this.dataSource != null) {
            this.dataCount = this.dataSource.length;
            this.drawMeasures(this.dataCount);
        }
    };
    /**
     * Rendering the feature and comaparative measure bars
     */
    BulletChart.prototype.drawMeasures = function (dataCount) {
        this.scale.renderFeatureBar(dataCount);
        this.scale.renderComparativeSymbol(dataCount);
    };
    /**
     * To calculate the title bounds
     */
    BulletChart.prototype.calculatePosition = function () {
        var margin = this.margin;
        // Title Height;
        var titleHeight = 0;
        var subTitleHeight = 0;
        var titleSize = new sf.svgbase.Size(0, 0);
        var padding = 5;
        this.titleCollections = [];
        this.subTitleCollections = [];
        var maxTitlteWidth = 0;
        var maxTitlteHeight = 0;
        var maxVerticalTitlteHeight = padding;
        if (this.title) {
            this.titleCollections = getTitle(this.title, this.titleStyle, this.titleStyle.maximumTitleWidth);
            titleHeight = (sf.svgbase.measureText(this.title, this.titleStyle).height * this.titleCollections.length) + padding;
            for (var _i = 0, _a = this.titleCollections; _i < _a.length; _i++) {
                var titleText = _a[_i];
                titleSize = sf.svgbase.measureText(titleText, this.titleStyle);
                maxTitlteWidth = titleSize.width > maxTitlteWidth ? titleSize.width : maxTitlteWidth;
                maxTitlteHeight = titleSize.height > maxTitlteHeight ? titleSize.height : maxTitlteHeight;
            }
            maxVerticalTitlteHeight += maxTitlteHeight;
            this.subTitleCollections = getTitle(this.subtitle, this.subtitleStyle, this.titleStyle.maximumTitleWidth);
            if (this.subtitle) {
                for (var _b = 0, _c = this.subTitleCollections; _b < _c.length; _b++) {
                    var subText = _c[_b];
                    titleSize = sf.svgbase.measureText(subText, this.subtitleStyle);
                    maxTitlteWidth = titleSize.width > maxTitlteWidth ? titleSize.width : maxTitlteWidth;
                    maxTitlteHeight = titleSize.height > maxTitlteHeight ? titleSize.height : maxTitlteHeight;
                }
                subTitleHeight = (sf.svgbase.measureText(this.subtitle, this.subtitleStyle).height * this.subTitleCollections.length) +
                    padding;
                maxVerticalTitlteHeight += maxTitlteHeight;
            }
        }
        this.maxTitleSize = new sf.svgbase.Size(maxTitlteWidth, this.orientation === 'Vertical' ? maxVerticalTitlteHeight : maxTitlteHeight);
        this.maxLabelSize = this.getMaxLabelWidth(this);
        this.initialClipRect = this.getBulletBounds((this.orientation === 'Vertical' ? maxVerticalTitlteHeight : maxTitlteWidth), titleHeight, subTitleHeight, margin);
        this.bulletChartRect = new sf.svgbase.Rect(this.initialClipRect.x, this.initialClipRect.y, this.initialClipRect.width, this.initialClipRect.height);
        if (this.bulletChartLegendModule) {
            this.bulletChartLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, this.maxLabelSize);
        }
    };
    /**
     * Calculate the rect values based on title position.
     * @return {void}
     * @private
     */
    BulletChart.prototype.getBulletBounds = function (maxTitlteWidth, titleHeight, subTitleHeight, margin) {
        var padding = 5;
        var rect = new sf.svgbase.Rect(0, 0, 0, 0);
        var enableRtl = this.enableRtl;
        var labelSpace = (this.labelPosition === this.tickPosition) ? padding : 0;
        var tickSize = ((this.tickPosition === 'Inside') ? 0 : (this.majorTickLines.height));
        // tslint:disable-next-line:max-line-length
        var labelSize = ((this.labelPosition === 'Inside') ? 0 : padding +
            ((this.tickPosition === 'Outside') ? 0 : (sf.svgbase.measureText(this.maximum.toString(), this.labelStyle).height)));
        var topAxisLabel = 0;
        var bottomAxisLabel = 0;
        var leftAxisLabel = 0;
        var rightAxisLabel = 0;
        var topCategory = 0;
        var bottomCategory = 0;
        var leftCategory = 0;
        var rightCategory = 0;
        var title = maxTitlteWidth;
        var format = this.bulletAxis.getFormat(this);
        var isCustomFormat = format.match('{value}') !== null;
        this.bulletAxis.format = this.intl.getNumberFormat({
            format: isCustomFormat ? '' : format, useGrouping: this.enableGroupSeparator
        });
        var formatted = sf.svgbase.measureText(this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, this.maximum), this.labelStyle).width;
        var categoryLabelSize;
        if (this.orientation === 'Horizontal') {
            categoryLabelSize = this.maxLabelSize.width;
            topAxisLabel = (this.opposedPosition) ? tickSize + labelSize + labelSpace : 0;
            bottomAxisLabel = (!this.opposedPosition) ? tickSize + labelSize + labelSpace : 0;
            leftCategory = ((categoryLabelSize && !enableRtl) ? (categoryLabelSize) : 0);
            leftCategory += (title && this.titlePosition === 'Left') ? padding * 3 : 0;
            rightCategory = ((categoryLabelSize && enableRtl) ? (categoryLabelSize) : 0);
            rightCategory += (title && this.titlePosition === 'Right') ? padding : 0;
        }
        else {
            categoryLabelSize = this.maxLabelSize.height;
            rightAxisLabel = (this.opposedPosition) ? tickSize + labelSpace : 0;
            rightAxisLabel += (this.opposedPosition && this.labelPosition !== 'Inside') ?
                formatted : 0;
            leftAxisLabel = (!this.opposedPosition) ? tickSize + labelSpace : 0;
            leftAxisLabel += (!this.opposedPosition && this.labelPosition !== 'Inside') ?
                formatted : 0;
            topCategory = ((categoryLabelSize && enableRtl) ? (categoryLabelSize + padding) : 0);
            bottomCategory = ((categoryLabelSize && !enableRtl) ? (categoryLabelSize + padding) : 0);
        }
        switch (this.titlePosition) {
            case 'Left':
                rect.x = margin.left + title + leftCategory + leftAxisLabel;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Right':
                rect.x = margin.left + leftCategory + leftAxisLabel;
                // tslint:disable-next-line:max-line-length
                rect.width = this.availableSize.width - rightAxisLabel - margin.right - rect.x - (title + padding) - rightCategory;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Top':
                rect.x = margin.left + leftAxisLabel + leftCategory;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                rect.y = margin.top + (titleHeight + subTitleHeight) + topAxisLabel + topCategory;
                rect.height = this.availableSize.height - rect.y - margin.bottom - bottomAxisLabel - bottomCategory;
                break;
            case 'Bottom':
                rect.x = margin.left + leftAxisLabel + leftCategory;
                rect.y = margin.top + topAxisLabel + topCategory;
                rect.width = this.availableSize.width - margin.right - rect.x - rightCategory - rightAxisLabel;
                // tslint:disable-next-line:max-line-length
                rect.height = this.availableSize.height - rect.y - bottomCategory - margin.bottom - bottomAxisLabel - (titleHeight + subTitleHeight);
                break;
        }
        return rect;
    };
    /**
     * Calculate maximum label width for category values.
     * @return {void}
     * @private
     */
    BulletChart.prototype.getMaxLabelWidth = function (bulletChart) {
        this.maxLabelSize = new sf.svgbase.Size(0, 0);
        if (!this.categoryField) {
            return this.maxLabelSize;
        }
        var label;
        for (var i = 0, len = Object.keys(this.dataSource).length; i < len; i++) {
            label = sf.svgbase.measureText((this.dataSource[i][this.categoryField] || ''), this.categoryLabelStyle);
            if (label.width > this.maxLabelSize.width) {
                this.maxLabelSize.width = label.width;
            }
            if (label.height > this.maxLabelSize.height) {
                this.maxLabelSize.height = label.height;
            }
        }
        return this.maxLabelSize;
    };
    BulletChart.prototype.calculateVisibleElements = function () {
        var range;
        var rangeCollection;
        this.visibleRanges = [];
        rangeCollection = this.ranges;
        for (var i = 0, len = rangeCollection.length; i < len; i++) {
            range = rangeCollection[i];
            range.index = i;
            range.color = range.color;
            this.visibleRanges.push(range);
            rangeCollection[i] = range;
        }
    };
    /**
     * To render the title of the bullet chart
     */
    BulletChart.prototype.renderBulletChartTitle = function () {
        var margin = this.margin;
        var x = 0;
        var y = 0;
        var padding = 5;
        var anchor = 'middle';
        var transform = '';
        var alignment = this.titleStyle.textAlignment;
        var elementSize = sf.svgbase.measureText(this.title, this.titleStyle);
        var subTitleSize = (this.subtitle) ? sf.svgbase.measureText(this.subtitle, this.subtitleStyle) : new sf.svgbase.Size(0, 0);
        if (this.title) {
            if (this.orientation === 'Horizontal') {
                switch (this.titlePosition) {
                    case 'Top':
                        x = this.findHorizontalAlignment(margin);
                        anchor = (alignment === 'Far') ? 'end' : ((alignment === 'Near') ? 'start' : 'middle');
                        y = margin.top + elementSize.height / 2 + padding;
                        break;
                    case 'Bottom':
                        x = this.findHorizontalAlignment(margin);
                        anchor = (alignment === 'Far') ? 'end' : ((alignment === 'Near') ? 'start' : 'middle');
                        // tslint:disable-next-line:max-line-length
                        y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding * 2 - ((subTitleSize.height) ? subTitleSize.height + padding : 0);
                        break;
                    case 'Left':
                        anchor = 'end';
                        x = margin.left + this.maxTitleSize.width;
                        // tslint:disable-next-line:max-line-length
                        y = (this.margin.top + (this.availableSize.height) / 2 - elementSize.height / 3) - ((subTitleSize.height) ? subTitleSize.height : 0);
                        break;
                    case 'Right':
                        anchor = 'start';
                        x = (this.availableSize.width - margin.right - this.maxTitleSize.width + padding);
                        // tslint:disable-next-line:max-line-length
                        y = (this.margin.top + (this.availableSize.height) / 2 - elementSize.height / 3) - ((subTitleSize.height) ? subTitleSize.height : 0);
                        break;
                }
            }
            else {
                switch (this.titlePosition) {
                    case 'Top':
                        x = (this.availableSize.width) / 2 + padding * 2;
                        y = this.margin.top + elementSize.height / 2 + padding;
                        break;
                    case 'Bottom':
                        x = (this.availableSize.width) / 2;
                        // tslint:disable-next-line:max-line-length
                        y = this.availableSize.height - this.margin.bottom - elementSize.height / 3 + padding * 2 - ((subTitleSize.height) ? subTitleSize.height + padding : 0);
                        break;
                    case 'Left':
                        y = this.findVerticalAlignment(margin);
                        anchor = (alignment === 'Far') ? 'start' : ((alignment === 'Near') ? 'end' : 'middle');
                        x = margin.left;
                        // tslint:disable-next-line:max-line-length
                        break;
                    case 'Right':
                        x = (this.availableSize.width - margin.right - elementSize.height / 3);
                        anchor = (alignment === 'Far') ? 'start' : ((alignment === 'Near') ? 'end' : 'middle');
                        // tslint:disable-next-line:max-line-length
                        y = this.findVerticalAlignment(margin);
                        break;
                }
                transform = (this.titlePosition === 'Left') ? 'rotate(-90,' + x + ',' + y + ')' :
                    ((this.titlePosition === 'Right') ? 'rotate(90,' + x + ',' + y + ')' : '');
            }
            var options = new sf.svgbase.TextOption(this.element.id + '_BulletChartTitle', x, y, anchor, this.titleCollections, transform, 'auto');
            var element = textElement$1(this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.titleFontColor, this.svgObject);
            if (element) {
                element.setAttribute('aria-label', this.title);
                element.setAttribute('tabindex', this.tabIndex.toString());
            }
            if (this.subtitle) {
                this.renderBulletChartSubTitle(x, y, anchor, options);
            }
        }
    };
    /**
     * To render the data label for bullet chart
     */
    BulletChart.prototype.renderDataLabel = function () {
        var x = 0;
        var y = 0;
        var elementSpacing = 10;
        var anchor;
        var transform = '';
        var enableRtl = this.enableRtl;
        var data;
        var featureBounds;
        var format = this.labelFormat ? this.labelFormat : '';
        var isCustomFormat = format.match('{value}') !== null;
        if (this.dataLabel.enable) {
            for (var i = 0, len = Object.keys(this.dataSource).length; i < len; i++) {
                data = this.dataSource[i];
                featureBounds = this.scale.featureBarBounds[i];
                var labelText = (data[this.valueField]).toString();
                this.format = this.intl.getNumberFormat({
                    format: isCustomFormat ? '' : format, useGrouping: this.enableGroupSeparator
                });
                labelText = isCustomFormat ? format.replace('{value}', this.format(labelText)) : labelText;
                var labelSize = sf.svgbase.measureText(labelText, this.dataLabel.labelStyle);
                // tslint:disable:no-string-literal
                var textWidth = labelSize['width'];
                var textHeight = labelSize['height'];
                if (this.orientation === 'Horizontal') {
                    anchor = this.type === 'Rect' ? 'end' : (enableRtl ? 'end' : 'start');
                    x = featureBounds.x + (enableRtl ? (this.type === 'Rect' ? textWidth + elementSpacing : -elementSpacing) :
                        featureBounds.width) + (this.type === 'Rect' ? -elementSpacing / 2 : elementSpacing / 2);
                    y = featureBounds.y + featureBounds.height / 2;
                }
                else {
                    anchor = 'middle';
                    x = featureBounds.y + featureBounds.height / 2;
                    y = featureBounds.x + (enableRtl ? featureBounds.width + (this.type === 'Rect' ? -textHeight : textHeight) : 0) +
                        (this.type === 'Rect' ? elementSpacing : -elementSpacing);
                }
                var labelOptions = new sf.svgbase.TextOption(this.element.id + '_DataLabel_' + i, x, y, anchor, labelText, transform, 'middle');
                var label = textElement$1(this.renderer, labelOptions, this.dataLabel.labelStyle, this.dataLabel.labelStyle.color || this.themeStyle.dataLabelFontColor, this.svgObject);
            }
        }
    };
    BulletChart.prototype.findHorizontalAlignment = function (margin) {
        var x = 0;
        switch (this.titleStyle.textAlignment) {
            case 'Center':
                x = (this.availableSize.width - margin.left - margin.right) / 2;
                break;
            case 'Near':
                x = margin.left;
                break;
            case 'Far':
                x = this.availableSize.width - margin.right;
                break;
        }
        return x;
    };
    BulletChart.prototype.findVerticalAlignment = function (margin) {
        var y = 0;
        switch (this.titleStyle.textAlignment) {
            case 'Center':
                y = (this.availableSize.height - margin.top - margin.bottom) / 2;
                break;
            case 'Near':
                y = margin.top;
                break;
            case 'Far':
                y = this.availableSize.height - margin.bottom;
                break;
        }
        return y;
    };
    /**
     * To render the sub title of the bullet chart
     */
    BulletChart.prototype.renderBulletChartSubTitle = function (x, y, anchor, options) {
        var margin = this.margin;
        var padding = 5;
        var transform = '';
        var elementSize = sf.svgbase.measureText(this.subtitle, this.subtitleStyle);
        if (this.orientation === 'Horizontal') {
            switch (this.titlePosition) {
                case 'Top':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Bottom':
                    y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding;
                    break;
                case 'Left':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Right':
                    y = y + elementSize.height + padding / 2;
                    break;
            }
        }
        else {
            switch (this.titlePosition) {
                case 'Top':
                    y = y + elementSize.height + padding / 2;
                    break;
                case 'Bottom':
                    y = this.availableSize.height - margin.bottom - elementSize.height / 3 + padding;
                    break;
                case 'Left':
                    x += elementSize.height + padding / 2;
                    break;
                case 'Right':
                    x -= elementSize.height + padding / 2;
                    break;
            }
            transform = (this.titlePosition === 'Left') ? 'rotate(-90,' + x + ',' + y + ')' :
                ((this.titlePosition === 'Right') ? 'rotate(90,' + x + ',' + y + ')' : '');
        }
        var subTitleOptions = new sf.svgbase.TextOption(this.element.id + '_BulletChartSubTitle', x, y, anchor, this.subTitleCollections, transform, 'auto');
        var element = textElement$1(this.renderer, subTitleOptions, this.subtitleStyle, this.subtitleStyle.color || this.themeStyle.subTitleFontColor, this.svgObject);
        if (element) {
            element.setAttribute('aria-label', this.title);
            element.setAttribute('tabindex', this.tabIndex.toString());
        }
    };
    /**
     * To calculate the available size and width of the container
     */
    BulletChart.prototype.calculateAvailableSize = function (bulletChart) {
        var containerWidth = this.element.clientWidth || this.element.offsetWidth || 200;
        // tslint:disable-next-line:max-line-length
        var height = (this.orientation === 'Vertical') ? 450 : ((this.titlePosition === 'Left' || this.titlePosition === 'Right') ? 83 : 126);
        var containerHeight = this.element.clientHeight || height;
        bulletChart.availableSize = new sf.svgbase.Size(stringToNumber(bulletChart.width, containerWidth) || containerWidth, stringToNumber(bulletChart.height, containerHeight) || containerHeight);
    };
    BulletChart.prototype.removeSvg = function () {
        var svgElement = document.getElementById(this.element.id + '_svg');
        if (svgElement) {
            sf.base.remove(svgElement);
        }
    };
    BulletChart.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /** Wire, UnWire and Event releated calculation Started here */
    /**
     * Method to un-bind events for bullet chart
     */
    BulletChart.prototype.unWireEvents = function () {
        /*! Find the Events type */
        var startEvent = sf.base.Browser.touchStartEvent;
        var moveEvent = sf.base.Browser.touchMoveEvent;
        var stopEvent = sf.base.Browser.touchEndEvent;
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        sf.base.EventHandler.remove(this.element, startEvent, this.bulletMouseDown);
        sf.base.EventHandler.remove(this.element, moveEvent, this.bulletMouseMove);
        sf.base.EventHandler.remove(this.element, cancelEvent, this.bulletMouseLeave);
        sf.base.EventHandler.remove(this.element, 'click', this.bulletChartOnMouseClick);
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
    };
    /**
     * Method to bind events for bullet chart
     */
    BulletChart.prototype.wireEvents = function () {
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.bulletMouseMove, this);
        sf.base.EventHandler.add(this.element, cancelEvent, this.bulletMouseLeave, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.bulletMouseDown, this);
        sf.base.EventHandler.add(this.element, 'click', this.bulletChartOnMouseClick, this);
        this.resizeBound = this.bulletResize.bind(this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.resizeBound);
        /*! Apply the style for chart */
        this.setStyle(this.element);
    };
    BulletChart.prototype.setStyle = function (element) {
        element.style.position = 'relative';
        element.style.display = 'block';
    };
    /**
     * Handles the mouse move on the bullet chart.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.bulletMouseMove = function (e) {
        var pageX;
        var pageY;
        pageX = e.clientX;
        pageY = e.clientY;
        this.setPointMouseXY(pageX, pageY);
        var targetId;
        var targetClass;
        targetId = e.target.id;
        /* tslint:disable:no-string-literal */
        targetClass = e.target.className['baseVal'];
        /* tslint:enable:no-string-literal */
        if (targetClass !== this.svgObject.id + '_FeatureMeasure' || this.svgObject.id + '_ComparativeMeasure') {
            if (!sf.base.isNullOrUndefined(this.dataSource)) {
                for (var i = 0; i < Object.keys(this.dataSource).length; i++) {
                    document.getElementById(this.svgObject.id + '_FeatureMeasure_' + i).setAttribute('opacity', '1');
                    document.getElementById(this.svgObject.id + '_ComparativeMeasure_' + i).setAttribute('opacity', '1');
                }
            }
        }
        if (!this.isTouchEvent(e)) {
            var id = 'tooltipDiv' + this.element.id;
            var tooltipDiv = document.getElementById(id);
            if (tooltipDiv) {
                // tslint:disable-next-line:no-any
                if (this.isReact) {
                    this.clearTemplate();
                }
                sf.base.remove(tooltipDiv);
            }
            if (this.bulletTooltipModule) {
                this.bulletTooltipModule._elementTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
                this.bulletTooltipModule._displayTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
            }
        }
    };
    /**
     * To find mouse x, y for aligned bullet chart element svg position
     */
    BulletChart.prototype.setPointMouseXY = function (pageX, pageY) {
        var svgClientRect = getElement(this.svgObject.id).getBoundingClientRect();
        var elemntClientRect = this.element.getBoundingClientRect();
        this.mouseX = (pageX - elemntClientRect.left) - Math.max(svgClientRect.left - elemntClientRect.left, 0);
        this.mouseY = (pageY - elemntClientRect.top) - Math.max(svgClientRect.top - elemntClientRect.top, 0);
    };
    /**
     * Handles the mouse leave on the bullet chart.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.bulletMouseLeave = function (e) {
        if (!this.isTouchEvent(e)) {
            var tooltipDiv = document.getElementById('.tooltipDiv' + this.element.id);
            if (tooltipDiv) {
                // tslint:disable-next-line:no-any
                if (this.isReact) {
                    this.clearTemplate();
                }
                sf.base.remove(tooltipDiv);
            }
        }
    };
    /**
     * Handles the touch event.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.isTouchEvent = function (event) {
        if ((event.pointerType === 'touch') || (event.type.indexOf('touch') > -1)) {
            return true;
        }
        return false;
    };
    /**
     * Handles the mouse down on the bullet chart.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.bulletMouseDown = function (e) {
        if (this.isTouchEvent(e)) {
            // tslint:disable-next-line:no-any
            if (this.isReact) {
                this.clearTemplate();
            }
            sf.base.remove(document.getElementById(('tooltipDiv' + this.element.id)));
            var targetId = e.target.id;
            /* tslint:disable:no-string-literal */
            var targetClass = e.target.className['baseVal'];
            if (this.bulletTooltipModule) {
                this.bulletTooltipModule._elementTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
                this.bulletTooltipModule._displayTooltip(e, targetClass, targetId, this.mouseX, this.mouseY);
            }
        }
    };
    /**
     * Handles the mouse click on bullet chart.
     * @return {boolean}
     * @private
     */
    BulletChart.prototype.bulletChartOnMouseClick = function (e) {
        var element = e.target;
        this.trigger(bulletChartMouseClick, { target: element.id, x: this.mouseX, y: this.mouseY });
        this.notify('click', e);
        return false;
    };
    /**
     * Handles the print method for bullet chart control.
     */
    BulletChart.prototype.print = function (id) {
        new ExportUtils(this).print(id);
    };
    /**
     * Handles the export method for bullet chart control.
     * @param type
     * @param fileName
     */
    BulletChart.prototype.export = function (type, fileName, orientation, controls, width, height, isVertical) {
        controls = controls ? controls : [this];
        new ExportUtils(this).export(type, fileName, orientation, controls, width, height, isVertical);
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    BulletChart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        this.animateSeries = false;
        if (!this.delayRedraw) {
            for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
                var prop = _a[_i];
                switch (prop) {
                    case 'height':
                    case 'width':
                        this.createSvg(this);
                        refreshBounds = true;
                        break;
                    case 'subtitle':
                    case 'title':
                        refreshBounds = true;
                        break;
                    case 'tickPosition':
                        renderer = true;
                        break;
                    case 'labelPosition':
                        renderer = true;
                        break;
                    case 'titlePosition':
                        renderer = true;
                        break;
                    case 'minimum':
                    case 'maximum':
                    case 'interval':
                        refreshBounds = true;
                        break;
                    case 'majorTickLines':
                    case 'minorTickLines':
                    case 'type':
                    case 'ranges':
                    case 'valueFill':
                    case 'targetColor':
                        refreshBounds = true;
                        break;
                    case 'titleStyle':
                        if (newProp.titleStyle) {
                            refreshBounds = true;
                        }
                        else {
                            renderer = true;
                        }
                        break;
                    case 'subtitleStyle':
                        if (newProp.subtitleStyle && (newProp.subtitleStyle.size || newProp.subtitleStyle.textOverflow)) {
                            refreshBounds = true;
                        }
                        else {
                            renderer = true;
                        }
                        break;
                    case 'border':
                        renderer = true;
                        break;
                    case 'opposedPosition':
                        renderer = true;
                        break;
                    case 'dataSource':
                        this.bindData();
                        refreshBounds = true;
                        break;
                    case 'theme':
                        this.animateSeries = true;
                        break;
                    case 'locale':
                    case 'currencyCode':
                        _super.prototype.refresh.call(this);
                        break;
                }
            }
            if (!refreshBounds && renderer) {
                this.removeSvg();
                this.renderBulletElements();
                var blazor = 'Blazor';
                this.trigger('loaded', { bulletChart: window[blazor] ? {} : this });
            }
            if (refreshBounds) {
                this.render();
                var blazor = 'Blazor';
                this.trigger('loaded', { bulletChart: window[blazor] ? {} : this });
                this.redraw = false;
            }
        }
    };
    /**
     * To provide the array of modules needed for bullet chart rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    BulletChart.prototype.requiredModules = function () {
        var modules = [];
        var rangeName;
        for (var i = 0; i < this.ranges.length; i++) {
            if (this.ranges[i].name !== null) {
                rangeName = true;
            }
        }
        this.isLegend = (this.legendSettings.visible && ((rangeName) || !!this.isLegend || this.targetField !== '' || this.valueField !== ''));
        if (this.tooltip.enable) {
            modules.push({
                member: 'BulletTooltip',
                args: [this]
            });
        }
        if (this.isLegend) {
            modules.push({
                member: 'BulletChartLegend',
                args: [this]
            });
        }
        return modules;
    };
    BulletChart.prototype.getModuleName = function () {
        return 'bulletChart';
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of BulletChart
     */
    BulletChart.prototype.destroy = function () {
        this.unWireEvents();
        _super.prototype.destroy.call(this);
        this.removeSvg();
        this.svgObject = null;
        this.element.classList.remove('e-BulletChart');
        this.element.innerHTML = '';
    };
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "height", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "locale", void 0);
    __decorate([
        sf.base.Complex({}, MajorTickLinesSettings)
    ], BulletChart.prototype, "majorTickLines", void 0);
    __decorate([
        sf.base.Complex({}, MinorTickLinesSettings)
    ], BulletChart.prototype, "minorTickLines", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "minimum", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "maximum", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "interval", void 0);
    __decorate([
        sf.base.Property(4)
    ], BulletChart.prototype, "minorTicksPerInterval", void 0);
    __decorate([
        sf.base.Complex(exports.BulletChartTheme.axisLabelFont, BulletLabelStyle)
    ], BulletChart.prototype, "labelStyle", void 0);
    __decorate([
        sf.base.Complex(exports.BulletChartTheme.axisLabelFont, BulletLabelStyle)
    ], BulletChart.prototype, "categoryLabelStyle", void 0);
    __decorate([
        sf.base.Property('')
    ], BulletChart.prototype, "labelFormat", void 0);
    __decorate([
        sf.base.Property('')
    ], BulletChart.prototype, "title", void 0);
    __decorate([
        sf.base.Complex(exports.BulletChartTheme.titleFont, BulletLabelStyle)
    ], BulletChart.prototype, "titleStyle", void 0);
    __decorate([
        sf.base.Property('')
    ], BulletChart.prototype, "subtitle", void 0);
    __decorate([
        sf.base.Complex(exports.BulletChartTheme.subTitleFont, BulletLabelStyle)
    ], BulletChart.prototype, "subtitleStyle", void 0);
    __decorate([
        sf.base.Property('Horizontal')
    ], BulletChart.prototype, "orientation", void 0);
    __decorate([
        sf.base.Complex({ color: '#DDDDDD', width: 0 }, Border)
    ], BulletChart.prototype, "border", void 0);
    __decorate([
        sf.base.Complex({}, BulletTooltipSettings)
    ], BulletChart.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Collection([{ end: null, opacity: 1, color: '' }, { end: null, opacity: 1, color: '' }, { end: null, opacity: 1, color: '' }], Range)
    ], BulletChart.prototype, "ranges", void 0);
    __decorate([
        sf.base.Property('Outside')
    ], BulletChart.prototype, "labelPosition", void 0);
    __decorate([
        sf.base.Property('Outside')
    ], BulletChart.prototype, "tickPosition", void 0);
    __decorate([
        sf.base.Property('Top')
    ], BulletChart.prototype, "titlePosition", void 0);
    __decorate([
        sf.base.Property(false)
    ], BulletChart.prototype, "opposedPosition", void 0);
    __decorate([
        sf.base.Property('Material')
    ], BulletChart.prototype, "theme", void 0);
    __decorate([
        sf.base.Complex({}, Animation$1)
    ], BulletChart.prototype, "animation", void 0);
    __decorate([
        sf.base.Complex({}, BulletDataLabel)
    ], BulletChart.prototype, "dataLabel", void 0);
    __decorate([
        sf.base.Complex({}, BulletChartLegendSettings)
    ], BulletChart.prototype, "legendSettings", void 0);
    __decorate([
        sf.base.Property(false)
    ], BulletChart.prototype, "enableGroupSeparator", void 0);
    __decorate([
        sf.base.Complex({ top: 15, bottom: 10, left: 15, right: 15 }, Margin)
    ], BulletChart.prototype, "margin", void 0);
    __decorate([
        sf.base.Property(5)
    ], BulletChart.prototype, "targetWidth", void 0);
    __decorate([
        sf.base.Property('#191919')
    ], BulletChart.prototype, "targetColor", void 0);
    __decorate([
        sf.base.Property(6)
    ], BulletChart.prototype, "valueHeight", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "valueFill", void 0);
    __decorate([
        sf.base.Complex({ color: 'transparent', width: 0 }, Border)
    ], BulletChart.prototype, "valueBorder", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "query", void 0);
    __decorate([
        sf.base.Property(null)
    ], BulletChart.prototype, "categoryField", void 0);
    __decorate([
        sf.base.Property('Rect')
    ], BulletChart.prototype, "type", void 0);
    __decorate([
        sf.base.Property('')
    ], BulletChart.prototype, "valueField", void 0);
    __decorate([
        sf.base.Property('')
    ], BulletChart.prototype, "targetField", void 0);
    __decorate([
        sf.base.Property(['Rect', 'Cross', 'Circle'])
    ], BulletChart.prototype, "targetTypes", void 0);
    __decorate([
        sf.base.Property(1)
    ], BulletChart.prototype, "tabIndex", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "tooltipRender", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "load", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "loaded", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "bulletChartMouseClick", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "legendRender", void 0);
    __decorate([
        sf.base.Event()
    ], BulletChart.prototype, "beforePrint", void 0);
    BulletChart = __decorate([
        sf.base.NotifyPropertyChanges
    ], BulletChart);
    return BulletChart;
}(sf.base.Component));

/**
 * `BulletTooltip` module is used to render the tooltip for bullet chart.
 */
var BulletTooltip = /** @class */ (function () {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    function BulletTooltip(bullet) {
        this.control = bullet;
        this.elementId = bullet.element.id;
        this.bulletAxis = new BulletChartAxis(this.control);
    }
    /**
     * To create tooltip div element
     */
    BulletTooltip.prototype._elementTooltip = function (e, targetClass, targetId, mouseX, mouseY) {
        var titleStyle = this.control.titleStyle;
        var tooltipDiv = this.control.createElement('div');
        tooltipDiv.id = 'tooltip';
        tooltipDiv.className = 'tooltipDiv';
        var target = e.target;
        var pageX = mouseX + 20;
        var pageY = e.clientY;
        var str = '';
        var font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
            exports.BulletChartTheme.tooltipLabelFont.fontStyle;
        var fill = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
        var color = exports.BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
        var fontSize = exports.BulletChartTheme.titleFont.size;
        var style = 'left:' + pageX + 'px;' + 'top:' + pageY + 'px;' +
            'display: block; position: absolute; "z-index": "13000",cursor: default;' +
            'font-family: Segoe UI;' + 'color:' + color + '; font-size: 13px; background-color:' +
            fill + '; border: 1px solid #707070;' + 'font-style:' + font + ';';
        // adding css prop to the div
        tooltipDiv.setAttribute('style', style);
        if (targetClass === this.control.svgObject.id + '_Caption') {
            str = target.textContent === this.control.title ? '' : this.control.title;
        }
        else if (targetClass === this.control.svgObject.id + '_SubTitle') {
            str = target.textContent === this.control.subtitle ? '' : this.control.subtitle;
        }
        if (str !== '') {
            tooltipDiv.innerHTML = '&nbsp' + str + '&nbsp';
            document.body.insertAdjacentElement('afterbegin', tooltipDiv);
        }
    };
    /**
     * To display the bullet chart tooltip
     */
    // tslint:disable-next-line:max-func-body-length
    BulletTooltip.prototype._displayTooltip = function (e, targetClass, targetId, mouseX, mouseY) {
        if (targetClass !== 'undefined' && this.control.tooltip.enable && (targetClass === this.control.svgObject.id + '_FeatureMeasure' ||
            targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
            var locale = this.control.locale;
            var localizedText = locale && this.control.enableGroupSeparator;
            var data = void 0;
            var blazorTooltipData = void 0;
            var measureId = void 0;
            var currentVal = void 0;
            var targetVal = [];
            var categoryVal = void 0;
            var tooltipdiv = void 0;
            var format = this.bulletAxis.getFormat(this.control);
            var isCustomFormat = format.match('{value}') !== null;
            measureId = targetId.substring(targetId.lastIndexOf('_') + 1);
            var targetValues = [];
            this.bulletAxis.format = this.bulletAxis.bulletChart.intl.getNumberFormat({
                format: isCustomFormat ? '' : format, useGrouping: this.bulletAxis.bulletChart.enableGroupSeparator
            });
            currentVal = this.control.dataSource[measureId][this.control.valueField];
            targetVal = targetVal.concat(this.control.dataSource[measureId][this.control.targetField]);
            categoryVal = this.control.dataSource[measureId][this.control.categoryField];
            var labelCurrentText = currentVal ? (currentVal).toString() : '';
            var labelTargetText = targetVal ? (targetVal).toString() : '';
            var labelCategoryText = categoryVal ? (categoryVal).toString() : '';
            labelCurrentText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +currentVal);
            for (var i = 0; i < targetVal.length; i++) {
                // tslint:disable-next-line:max-line-length
                targetValues = targetValues.concat(this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +targetVal[i]));
            }
            labelCategoryText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +categoryVal);
            data = { value: labelCurrentText, target: targetValues, category: labelCategoryText };
            blazorTooltipData = { value: labelCurrentText, target: labelTargetText, category: labelCategoryText };
            var style = 'position: absolute; z-index: 13000; display: block;';
            if (document.getElementsByClassName('tooltipDiv' + this.control.element.id).length === 0) {
                tooltipdiv = this.control.createElement('div');
                tooltipdiv.id = 'tooltipDiv' + this.control.element.id;
                tooltipdiv.setAttribute('style', style);
                document.getElementById(this.control.element.id + '_Secondary_Element').appendChild(tooltipdiv);
            }
            var argsData = {
                value: data.value, target: data.target, name: tooltipRender
            };
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                this.updateTemplateFn();
                var elem = this.control.createElement('div', { id: this.control.element.id + 'parent_template' });
                var templateElement = this.templateFn(blazorTooltipData, this.control, 'template', elem.id + '_blazorTemplate', '', null, elem);
                while (templateElement && templateElement.length > 0) {
                    if (sf.base.isBlazor() || templateElement.length === 1) {
                        elem.appendChild(templateElement[0]);
                        templateElement = null;
                    }
                    else {
                        elem.appendChild(templateElement[0]);
                    }
                }
                argsData.template = elem.innerHTML;
                this.control.trigger(tooltipRender, argsData);
                elem.innerHTML = argsData.template;
                tooltipdiv.appendChild(elem);
            }
            else {
                var argsText = 'Value : ' + argsData.value;
                for (var i = 0; i < argsData.target.length; i++) {
                    argsText += '<br/> Target' + (i === 0 ? '' : '_' + i) + ' : ' + argsData.target[i];
                }
                argsData.text = argsText;
                this.control.trigger(tooltipRender, argsData);
                tooltipdiv.innerHTML = argsData.text;
                tooltipdiv.style.font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
                    exports.BulletChartTheme.tooltipLabelFont.fontStyle;
                tooltipdiv.style.color = exports.BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
                tooltipdiv.style.fontSize = exports.BulletChartTheme.titleFont.size;
            }
            var fill = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
            var borderWidth = this.control.tooltip.border.width ? this.control.tooltip.border.width : 1;
            var borderColor = this.control.tooltip.border.color ? this.control.tooltip.border.color : 'Black';
            var xPos = mouseX;
            var yPos = mouseY;
            xPos = ((xPos + stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth) < window.innerWidth) ?
                (xPos) : stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth));
            yPos = ((yPos + stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight) < window.innerHeight) ?
                (yPos) : stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight));
            if (xPos === undefined || xPos === null) {
                xPos = mouseX;
            }
            if (yPos === undefined || yPos === null) {
                yPos = e.clientY;
            }
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                tooltipdiv.setAttribute('style', 'position: absolute;left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;');
                if (sf.base.isBlazor()) {
                    sf.base.updateBlazorTemplate(this.control.element.id + 'parent_template' + '_blazorTemplate', 'Template', this.control.tooltip);
                }
            }
            else {
                var divStyle = style + 'left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;' +
                    '-webkit-border-radius: 5px 5px 5px 5px; -moz-border-radius: 5px 5px 5px 5px;-o-border-radius: 5px 5px 5px 5px;' +
                    'border-radius: 5px 5px 5px 5px;' + 'background-color:' + fill + ';' + 'color:' +
                    tooltipdiv.style.color + '; border:' + borderWidth + 'px Solid' + ' ' + borderColor + ';' +
                    'padding-bottom: 7px;' + 'font-style:' + exports.BulletChartTheme.tooltipLabelFont.fontStyle +
                    '; padding-left: 10px; font-family: Segoe UI; padding-right: 10px; padding-top: 7px';
                tooltipdiv.setAttribute('style', divStyle);
                if ((targetClass === this.control.svgObject.id + '_FeatureMeasure') ||
                    (targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
                    document.getElementById(targetId).setAttribute('opacity', '0.6');
                }
            }
            // tslint:disable-next-line:no-any
            if (this.control.isReact) {
                this.control.renderReactTemplates();
            }
        }
    };
    /**
     * To update template values in the tooltip
     */
    BulletTooltip.prototype.updateTemplateFn = function () {
        if (this.control.tooltip.template) {
            try {
                if (document.querySelectorAll(this.control.tooltip.template).length) {
                    this.templateFn = sf.base.compile(document.querySelector(this.control.tooltip.template).innerHTML.trim());
                }
            }
            catch (e) {
                this.templateFn = sf.base.compile(this.control.tooltip.template);
            }
        }
    };
    /**
     * Get module name.
     */
    BulletTooltip.prototype.getModuleName = function () {
        return 'BulletTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    BulletTooltip.prototype.destroy = function (chart) {
        // Destroy method called here
    };
    return BulletTooltip;
}());

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
/**
 * Chart legend
 */
/**
 * `Legend` module is used to render legend for the chart.
 */
var BulletChartLegend = /** @class */ (function (_super) {
    __extends$7(BulletChartLegend, _super);
    function BulletChartLegend(chart) {
        var _this = _super.call(this, chart) || this;
        _this.library = _this;
        _this.addEventListener();
        return _this;
    }
    /**
     * Binding events for legend module.
     */
    BulletChartLegend.prototype.addEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.on('click', this.click, this);
        this.chart.on(sf.base.Browser.touchEndEvent, this.mouseEnd, this);
        this.chart.on(sf.base.Browser.touchMoveEvent, this.bulletMouseMove, this);
    };
    /**
     * UnBinding events for bullet chart legend module.
     */
    BulletChartLegend.prototype.removeEventListener = function () {
        if (this.chart.isDestroyed) {
            return;
        }
        this.chart.off('click', this.click);
        this.chart.off(sf.base.Browser.touchEndEvent, this.mouseEnd);
        this.chart.off(sf.base.Browser.touchMoveEvent, this.bulletMouseMove);
    };
    /**
     * To handle mosue move for legend module
     */
    BulletChartLegend.prototype.bulletMouseMove = function (e) {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    };
    /**
     * To handle mosue end for legend module
     */
    BulletChartLegend.prototype.mouseEnd = function (e) {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    };
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    BulletChartLegend.prototype.getLegendOptions = function (visibleRangeCollection, chart) {
        this.legendCollections = [];
        var fill;
        var count = 0;
        var key = 'color';
        var bulletChart = this.chart;
        for (var _i = 0, visibleRangeCollection_1 = visibleRangeCollection; _i < visibleRangeCollection_1.length; _i++) {
            var range = visibleRangeCollection_1[_i];
            if (range.name !== null) {
                fill = range.color ? range.color : bulletChart.themeStyle.rangeStrokes[range.index][key];
                this.legendCollections.push(new LegendOptions(range.name, fill, range.shape, this.chart.legendSettings.visible, null, null, false, range.index, null));
                count++;
            }
        }
        if (bulletChart.dataSource !== null && bulletChart.valueField !== '') {
            fill = bulletChart.valueFill || 'black';
            var shape = bulletChart.orientation === 'Vertical' ? 'TargetRect' : 'ActualRect';
            this.legendCollections.push(new LegendOptions('Actual', fill, shape, this.chart.legendSettings.visible, null, null, false, count++, null));
        }
        if (bulletChart.dataSource !== null && bulletChart.targetField !== '') {
            fill = bulletChart.targetColor || 'black';
            var shape = bulletChart.orientation === 'Vertical' ? 'ActualRect' : 'TargetRect';
            for (var i = 0; i < Object.keys(bulletChart.dataSource).length; i++) {
                if (sf.base.isNullOrUndefined(bulletChart.dataSource[i][bulletChart.targetField].length)
                    || bulletChart.dataSource[i][bulletChart.targetField].length === 1) {
                    while (i === 0) {
                        this.legendCollections.push(new LegendOptions('Target', fill, shape, this.chart.legendSettings.visible, null, null, false, count++, null));
                        break;
                    }
                }
                else {
                    var targetTypes = bulletChart.targetTypes;
                    var targetType = [];
                    var targetTypeLength = targetTypes.length;
                    while (i === 0) {
                        for (var i_1 = 0; i_1 < targetTypeLength; i_1++) {
                            targetType[i_1] = targetTypes[i_1 % targetTypeLength];
                            targetType[i_1] = (targetType[i_1] === 'Rect') ? bulletChart.orientation === 'Vertical' ?
                                'ActualRect' : 'TargetRect' : (targetType[i_1]);
                            targetType[i_1] = (targetType[i_1] === 'Cross') ? 'Multiply' : targetType[i_1];
                            this.legendCollections.push(new LegendOptions('Target_' + i_1, fill, targetType[i_1], this.chart.legendSettings.visible, null, null, false, count++, null));
                        }
                        break;
                    }
                }
            }
        }
    };
    /** @private */
    BulletChartLegend.prototype.getLegendBounds = function (availableSize, bulletLegendBounds, legend) {
        var extraWidth = 0;
        var padding = legend.padding;
        var extraHeight = 0;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        }
        else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        bulletLegendBounds.height += extraHeight;
        bulletLegendBounds.width += extraWidth;
        var maximumWidth = 0;
        var legendRowWidth = 0;
        var legendRowCount = 0;
        var legendWidth = 0;
        var columnHeight = 0;
        var shapeHeight = legend.shapeHeight;
        var shapeWidth = legend.shapeWidth;
        var shapePadding = legend.shapePadding;
        var legendEventArgs;
        this.maxItemHeight = Math.max(sf.svgbase.measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        var render = false;
        for (var _i = 0, _a = this.legendCollections; _i < _a.length; _i++) {
            var bulletLegendOption = _a[_i];
            legendEventArgs = {
                fill: bulletLegendOption.fill, text: bulletLegendOption.text, shape: bulletLegendOption.shape,
                name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            bulletLegendOption.render = !legendEventArgs.cancel;
            bulletLegendOption.text = legendEventArgs.text;
            bulletLegendOption.fill = legendEventArgs.fill;
            bulletLegendOption.shape = legendEventArgs.shape;
            bulletLegendOption.textSize = sf.svgbase.measureText(bulletLegendOption.text, legend.textStyle);
            if (bulletLegendOption.render && bulletLegendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + bulletLegendOption.textSize.width + padding;
                legendRowWidth = legendRowWidth + legendWidth;
                if (bulletLegendBounds.width < (padding + legendRowWidth) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (legendRowWidth + padding - (this.isVertical ? 0 : legendWidth)));
                    if (legendRowCount === 0 && (legendWidth !== legendRowWidth)) {
                        legendRowCount = 1;
                    }
                    legendRowWidth = this.isVertical ? 0 : legendWidth;
                    legendRowCount++;
                    columnHeight = (legendRowCount * (this.maxItemHeight + padding)) + padding;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding);
        this.isPaging = bulletLegendBounds.height < columnHeight;
        this.totalPages = legendRowCount;
        if (render) {
            this.setBounds(Math.max((legendRowWidth + padding), maximumWidth), columnHeight, legend, bulletLegendBounds);
        }
        else {
            this.setBounds(0, 0, legend, bulletLegendBounds);
        }
    };
    /** @private */
    BulletChartLegend.prototype.getRenderPoint = function (bulletLegendOption, start, textPadding, prevLegend, rect, count, firstLegend) {
        var previousBound = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        var padding = this.legend.padding;
        if ((previousBound + (bulletLegendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            bulletLegendOption.location.x = start.x;
            bulletLegendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        }
        else {
            bulletLegendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            bulletLegendOption.location.y = prevLegend.location.y;
        }
        var availwidth = (this.legendBounds.x + this.legendBounds.width) - (bulletLegendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        bulletLegendOption.text = textTrim(+availwidth.toFixed(4), bulletLegendOption.text, this.legend.textStyle);
    };
    /**
     * To show the tooltip for the trimmed text in legend.
     * @return {void}
     */
    BulletChartLegend.prototype.click = function (event) {
        var symbolTargetId = event.target.id;
        if (symbolTargetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        else if (symbolTargetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
    };
    /**
     * Get module name
     */
    BulletChartLegend.prototype.getModuleName = function () {
        return 'BulletChartLegend';
    };
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    BulletChartLegend.prototype.destroy = function (chart) {
        /**
         * Destroy method calling here
         */
        this.removeEventListener();
    };
    return BulletChartLegend;
}(BaseLegend));

/**
 * Bullet Chart component export methods
 */

BulletChart.Inject(BulletTooltip, BulletChartLegend);

exports.BulletChart = BulletChart;
exports.Range = Range;
exports.MajorTickLinesSettings = MajorTickLinesSettings;
exports.MinorTickLinesSettings = MinorTickLinesSettings;
exports.BulletLabelStyle = BulletLabelStyle;
exports.BulletTooltipSettings = BulletTooltipSettings;
exports.BulletDataLabel = BulletDataLabel;
exports.BulletChartLegendSettings = BulletChartLegendSettings;
exports.getBulletThemeColor = getBulletThemeColor;
exports.BulletTooltip = BulletTooltip;
exports.BulletChartLegend = BulletChartLegend;

return exports;

});

    sf.charts = sf.base.extend({}, sf.charts, sfbulletchart({}));