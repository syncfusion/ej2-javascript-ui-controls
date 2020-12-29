window.sf = window.sf || {};
var sfrangenavigator = (function (exports) {
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
function getSeriesColor(theme) {
    var palette;
    switch (theme) {
        case 'Fabric':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'Bootstrap4':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        case 'Bootstrap':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        case 'HighContrastLight':
        case 'Highcontrast':
        case 'HighContrast':
            palette = ['#79ECE4', '#E98272', '#DFE6B6', '#C6E773', '#BA98FF',
                '#FA83C3', '#00C27A', '#43ACEF', '#D681EF', '#D8BC6E'];
            break;
        case 'MaterialDark':
            palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
                '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
            break;
        case 'FabricDark':
            palette = ['#4472c4', '#ed7d31', '#ffc000', '#70ad47', '#5b9bd5',
                '#c1c1c1', '#6f6fe2', '#e269ae', '#9e480e', '#997300'];
            break;
        case 'BootstrapDark':
            palette = ['#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#ff6ea6',
                '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52'];
            break;
        // palette = ['#B586FF', '#71F9A3', '#FF9572', '#5BD5FF', '#F9F871',
        //     '#B6F971', '#8D71F9', '#FF6F91', '#FFC75F', '#D55DB1'];
        // break;
        default:
            palette = ['#00bdae', '#404041', '#357cd2', '#e56590', '#f8b883',
                '#70ad47', '#dd8abd', '#7f84e8', '#7bb4eb', '#ea7a57'];
            break;
    }
    return palette;
}
/** @private */

/** @private */

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
 * Defines the appearance of the connectors
 */
var Connector = /** @class */ (function (_super) {
    __extends$2(Connector, _super);
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
    __extends$2(Font, _super);
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
    __extends$2(Border, _super);
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
    __extends$2(Offset, _super);
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
    __extends$2(ChartArea, _super);
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
    __extends$2(Margin, _super);
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
    __extends$2(Animation$$1, _super);
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
    __extends$2(Indexes, _super);
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
    __extends$2(CornerRadius, _super);
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
    __extends$2(EmptyPointSettings, _super);
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
    __extends$2(DragSettings, _super);
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
    __extends$2(TooltipSettings, _super);
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
    return TooltipSettings;
}(sf.base.ChildProperty));
/**
 * button settings in period selector
 */
var Periods = /** @class */ (function (_super) {
    __extends$2(Periods, _super);
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
    __extends$2(PeriodSelectorSettings, _super);
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
        var duplicateTempInterval;
        for (; (tempInterval <= axis.visibleRange.max) && (duplicateTempInterval !== tempInterval); tempInterval += axis.visibleRange.interval) {
            duplicateTempInterval = tempInterval;
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

/** @private */
function inside(value, range) {
    return (value < range.max) && (value > range.min);
}
/** @private */
function withIn(value, range) {
    return (value <= range.max) && (value >= range.min);
}
/** @private */
function logWithIn(value, axis) {
    if (axis.valueType === 'Logarithmic') {
        value = logBase(value, axis.logBase);
    }
    else {
        value = value;
    }
    return value;
}
/** @private */
function withInRange(previousPoint, currentPoint, nextPoint, series) {
    var mX2 = logWithIn(currentPoint.xValue, series.xAxis);
    var mX1 = previousPoint ? logWithIn(previousPoint.xValue, series.xAxis) : mX2;
    var mX3 = nextPoint ? logWithIn(nextPoint.xValue, series.xAxis) : mX2;
    var xStart = Math.floor(series.xAxis.visibleRange.min);
    var xEnd = Math.ceil(series.xAxis.visibleRange.max);
    return ((mX1 >= xStart && mX1 <= xEnd) || (mX2 >= xStart && mX2 <= xEnd) ||
        (mX3 >= xStart && mX3 <= xEnd) || (xStart >= mX1 && xStart <= mX3));
}
/** @private */

/** @private */

/** @private */

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
function TransformToVisible(x, y, xAxis, yAxis, isInverted, series) {
    x = (xAxis.valueType === 'Logarithmic' ? logBase(x > 1 ? x : 1, xAxis.logBase) : x);
    y = (yAxis.valueType === 'Logarithmic' ?
        logBase(y > 1 ? y : 1, yAxis.logBase) : y);
    x += xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks' && series.type !== 'Radar' ? 0.5 : 0;
    var radius = series.chart.radius * valueToCoefficient(y, yAxis);
    var point = CoefficientToVector(valueToPolarCoefficient(x, xAxis), series.chart.primaryXAxis.startAngle);
    return {
        x: (series.clipRect.width / 2 + series.clipRect.x) + radius * point.x,
        y: (series.clipRect.height / 2 + series.clipRect.y) + radius * point.y
    };
}
/**
 * method to find series, point index by element id
 * @private
 */

/** @private */
function CoefficientToVector(coefficient, startAngle) {
    startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
    var angle = Math.PI * (1.5 - 2 * coefficient);
    angle = angle + (startAngle * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
}
/** @private */
function valueToPolarCoefficient(value, axis) {
    var range = axis.visibleRange;
    var delta;
    var length;
    if (axis.valueType !== 'Category') {
        delta = (range.max - (axis.valueType === 'DateTime' ? axis.dateTimeInterval : range.interval)) - range.min;
        length = axis.visibleLabels.length - 1;
        delta = delta === 0 ? 1 : delta;
    }
    else {
        // To split an interval equally based on visible labels count
        delta = axis.visibleLabels.length === 1 ? 1 :
            (axis.visibleLabels[axis.visibleLabels.length - 1].value - axis.visibleLabels[0].value);
        length = axis.visibleLabels.length;
    }
    return axis.isInversed ? ((value - range.min) / delta) * (1 - 1 / (length)) :
        1 - ((value - range.min) / delta) * (1 - 1 / (length));
}
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
function getTemplateFunction(template) {
    var templateFn = null;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = sf.base.compile(document.querySelector(template).innerHTML.trim());
        }
    }
    catch (e) {
        templateFn = sf.base.compile(template);
    }
    return templateFn;
}
/** @private */
function createTemplate(childElement, pointIndex, content, chart, point, series, dataLabelId) {
    var templateFn;
    var templateElement;
    templateFn = getTemplateFunction(content);
    try {
        var blazor = 'Blazor';
        var tempObject = window[blazor] ? (dataLabelId ? point : { point: point }) : { chart: chart, series: series, point: point };
        var elementData = templateFn ? templateFn(tempObject, chart, 'template', dataLabelId ||
            childElement.id.replace(/[^a-zA-Z0-9]/g, '')) : [];
        if (elementData.length) {
            templateElement = Array.prototype.slice.call(elementData);
            var len = templateElement.length;
            for (var i = 0; i < len; i++) {
                childElement.appendChild(templateElement[i]);
            }
        }
        // tslint:disable-next-line:no-any
        if (chart.isReact) {
            chart.renderReactTemplates();
        }
    }
    catch (e) {
        return childElement;
    }
    return childElement;
}
/** @private */

/** @private */

/** @private */

/** @private */
function getPoint(x, y, xAxis, yAxis, isInverted, series) {
    x = ((xAxis.valueType === 'Logarithmic') ? logBase(((x > 0) ? x : 1), xAxis.logBase) : x);
    y = ((yAxis.valueType === 'Logarithmic') ? logBase(((y > 0) ? y : 1), yAxis.logBase) : y);
    x = valueToCoefficient(x, xAxis);
    y = valueToCoefficient(y, yAxis);
    var xLength = (isInverted ? xAxis.rect.height : xAxis.rect.width);
    var yLength = (isInverted ? yAxis.rect.width : yAxis.rect.height);
    var locationX = isInverted ? y * (yLength) : x * (xLength);
    var locationY = isInverted ? (1 - x) * (xLength) : (1 - y) * (yLength);
    return new ChartLocation(locationX, locationY);
}
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
function stopTimer(timer) {
    window.clearInterval(timer);
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
function textElement(renderer, option, font, color, parent, isMinus, redraw, isAnimate, forceAnimate, animateDuration, seriesClipRect, labelSize, isRotatedLabelIntersect, isCanvas) {
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
function calculateSize(chart) {
    // fix for Chart rendered with default width in IE issue
    var containerWidth = chart.element.clientWidth || chart.element.offsetWidth;
    var containerHeight = chart.element.clientHeight;
    if (chart.stockChart) {
        containerWidth = chart.stockChart.element.clientWidth;
    }
    var height = 450;
    var marginHeight;
    if (chart.getModuleName() === 'rangeNavigator') {
        var range = chart;
        var tooltipSpace = range.tooltip.enable ? 35 : 0;
        var periodHeight = range.periodSelectorSettings.periods.length ?
            range.periodSelectorSettings.height : 0;
        marginHeight = range.margin.top + range.margin.bottom + tooltipSpace;
        var labelSize = sf.svgbase.measureText('tempString', range.labelStyle).height;
        var labelPadding = 15;
        height = (chart.series.length ? (sf.base.Browser.isDevice ? 80 : 120) : ((range.enableGrouping ? (40 + labelPadding + labelSize) : 40)
            + marginHeight)) + periodHeight;
        if (range.disableRangeSelector) {
            height = periodHeight;
        }
    }
    chart.availableSize = new sf.svgbase.Size(stringToNumber(chart.width, containerWidth) || containerWidth || 600, stringToNumber(chart.height, containerHeight || height) || containerHeight || height);
}
function createSvg(chart) {
    chart.canvasRender = new sf.svgbase.CanvasRenderer(chart.element.id);
    chart.renderer = chart.enableCanvas ? chart.canvasRender : new sf.svgbase.SvgRenderer(chart.element.id);
    calculateSize(chart);
    if (chart.stockChart && chart.getModuleName() === 'chart') {
        chart.svgObject = chart.stockChart.chartObject;
    }
    else if (chart.stockChart && chart.getModuleName() === 'rangeNavigator') {
        chart.svgObject = chart.stockChart.selectorObject;
    }
    else {
        if (chart.enableCanvas) {
            chart.svgObject = chart.renderer.createCanvas({
                id: chart.element.id + '_canvas',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        }
        else {
            chart.svgObject = chart.renderer.createSvg({
                id: chart.element.id + '_svg',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        }
    }
}
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
    __extends$1(RectOption, _super);
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
    __extends$1(CircleOption, _super);
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
/**
 * Common axis classes
 * @private
 */
var NiceInterval = /** @class */ (function (_super) {
    __extends$6(NiceInterval, _super);
    function NiceInterval() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Method to calculate numeric datetime interval
     */
    NiceInterval.prototype.calculateDateTimeNiceInterval = function (axis, size, start, end, isChart) {
        if (isChart === void 0) { isChart = true; }
        var oneDay = 24 * 60 * 60 * 1000;
        var startDate = new Date(start);
        var endDate = new Date(end);
        //var axisInterval ;
        var totalDays = (Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
        var interval;
        axis.actualIntervalType = axis.intervalType;
        var type = axis.intervalType;
        switch (type) {
            case 'Years':
                interval = this.calculateNumericNiceInterval(axis, totalDays / 365, size);
                break;
            case 'Quarter':
                interval = this.calculateNumericNiceInterval(axis, (totalDays / 365) * 4, size);
                break;
            case 'Months':
                interval = this.calculateNumericNiceInterval(axis, totalDays / 30, size);
                break;
            case 'Weeks':
                interval = this.calculateNumericNiceInterval(axis, totalDays / 7, size);
                break;
            case 'Days':
                interval = this.calculateNumericNiceInterval(axis, totalDays, size);
                break;
            case 'Hours':
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24, size);
                break;
            case 'Minutes':
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60, size);
                break;
            case 'Seconds':
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60 * 60, size);
                break;
            case 'Auto':
                interval = this.calculateNumericNiceInterval(axis, totalDays / 365, size);
                if (interval >= 1) {
                    axis.actualIntervalType = 'Years';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, (totalDays / 365) * 4, size);
                if (interval >= 1 && !isChart) {
                    axis.actualIntervalType = 'Quarter';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays / 30, size);
                if (interval >= 1) {
                    axis.actualIntervalType = 'Months';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays / 7, size);
                if (interval >= 1 && !isChart) {
                    axis.actualIntervalType = 'Weeks';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays, size);
                if (interval >= 1) {
                    axis.actualIntervalType = 'Days';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24, size);
                if (interval >= 1) {
                    axis.actualIntervalType = 'Hours';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60, size);
                if (interval >= 1) {
                    axis.actualIntervalType = 'Minutes';
                    return interval;
                }
                interval = this.calculateNumericNiceInterval(axis, totalDays * 24 * 60 * 60, size);
                axis.actualIntervalType = 'Seconds';
                return interval;
        }
        return interval;
    };
    /**
     * To get the skeleton for the DateTime axis.
     * @return {string}
     * @private
     */
    NiceInterval.prototype.getSkeleton = function (axis, currentValue, previousValue, isBlazor) {
        var skeleton;
        var intervalType = axis.actualIntervalType;
        if (axis.skeleton) {
            return axis.skeleton;
        }
        if (intervalType === 'Years') {
            if (isBlazor) {
                skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'y' : 'y') : 'y';
            }
            else {
                skeleton = axis.isChart ? ((axis.valueType === 'DateTime' && axis.isIntervalInDecimal) ? 'y' : 'yMMM') : 'y';
            }
        }
        else if (intervalType === 'Quarter') {
            skeleton = isBlazor ? 'y' : 'yMMM';
        }
        else if (intervalType === 'Months') {
            if (isBlazor) {
                skeleton = axis.isChart ? 'm' : 'm';
            }
            else {
                skeleton = axis.isChart ? 'MMMd' : 'MMM';
            }
        }
        else if (intervalType === 'Weeks') {
            skeleton = isBlazor ? 'm' : 'MEd';
        }
        else if (intervalType === 'Days') {
            if (isBlazor) {
                skeleton = 'd';
            }
            else {
                skeleton = axis.isChart ? this.getDayFormat(axis, currentValue, previousValue) : 'MMMd';
            }
        }
        else if (intervalType === 'Hours') {
            if (isBlazor) {
                skeleton = 't';
            }
            else {
                skeleton = axis.isChart ? (axis.valueType === 'DateTime' ? 'Hm' : 'EHm') : 'h';
            }
        }
        else if (intervalType === 'Minutes') {
            if (isBlazor) {
                skeleton = 'T';
            }
            else {
                skeleton = axis.isChart ? 'Hms' : 'hm';
            }
        }
        else {
            if (isBlazor) {
                skeleton = 'T';
            }
            else {
                skeleton = axis.isChart ? 'Hms' : 'hms';
            }
        }
        return skeleton;
    };
    /**
     * Get intervalType month format
     * @param currentValue
     * @param previousValue
     */
    NiceInterval.prototype.getMonthFormat = function (axis, currentValue, previousValue) {
        return ((new Date(currentValue).getFullYear() === new Date(previousValue).getFullYear()) ?
            (axis.isIntervalInDecimal ? 'MMM' : 'MMM d') : 'y MMM');
    };
    /**
     * Get intervalType day label format for the axis
     * @param axis
     * @param currentValue
     * @param previousValue
     */
    NiceInterval.prototype.getDayFormat = function (axis, currentValue, previousValue) {
        return (axis.valueType === 'DateTime' ?
            ((new Date(currentValue).getMonth() !== new Date(previousValue).getMonth()) ? 'MMMd' :
                (axis.isIntervalInDecimal ? 'd' : 'Ehm')) : 'yMd');
    };
    /**
     * Find label format for axis
     * @param axis
     * @param currentValue
     * @param previousValue
     * @private
     */
    NiceInterval.prototype.findCustomFormats = function (axis, currentValue, previousValue) {
        var labelFormat = axis.labelFormat ? axis.labelFormat : '';
        if (axis.isChart && !axis.skeleton && axis.actualIntervalType === 'Months' && !labelFormat) {
            labelFormat = axis.valueType === 'DateTime' ? this.getMonthFormat(axis, currentValue, previousValue) : 'yMMM';
        }
        return labelFormat;
    };
    return NiceInterval;
}(Double));

/**
 * Methods for calculating coefficient.
 */
/** @private */
function rangeValueToCoefficient(value, range, inversed) {
    var result = (value - range.min) / (range.delta);
    return inversed ? (1 - result) : result;
}
/** @private */
function getXLocation(x, range, size, inversed) {
    x = rangeValueToCoefficient(x, range, inversed);
    return x * size;
}
/** @private */
function getRangeValueXByPoint(value, size, range, inversed) {
    var actualValue = !inversed ? value / size : (1 - (value / size));
    return actualValue * (range.delta) + range.min;
}
/** @private */
function getExactData(points, start, end) {
    var selectedData = [];
    points.map(function (point) {
        if (point.xValue >= start && point.xValue <= end) {
            selectedData.push({
                'x': point.x,
                'y': point.y
            });
        }
    });
    return selectedData;
}
/** @private */
function getNearestValue(values, point) {
    return values.reduce(function (prev, curr) {
        return (Math.abs(curr - point) < Math.abs(prev - point) ? curr : prev);
    });
}
/**
 * Data point
 * @public
 */
var DataPoint = /** @class */ (function () {
    function DataPoint(x, y, xValue, yValue, visible) {
        if (visible === void 0) { visible = true; }
        this.x = x;
        this.y = y;
        this.xValue = xValue;
        this.visible = visible;
    }
    return DataPoint;
}());

/**
 * data module is used to generate query and dataSource
 */
var Data = /** @class */ (function () {
    /**
     * Constructor for data module
     * @private
     */
    function Data(dataSource, query) {
        this.initDataManager(dataSource, query);
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof sf.data.DataManager ? dataSource : new sf.data.DataManager(dataSource);
        this.query = query instanceof sf.data.Query ? query : new sf.data.Query();
    };
    /**
     * The function used to generate updated Query from chart model
     * @return {void}
     * @private
     */
    Data.prototype.generateQuery = function () {
        var query = this.query.clone();
        return query;
    };
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        var _this = this;
        if (this.dataManager.ready) {
            var deferred_1 = new sf.data.Deferred();
            var ready = this.dataManager.ready;
            ready.then(function (e) {
                _this.dataManager.executeQuery(query).then(function (result) {
                    deferred_1.resolve(result);
                });
            }).catch(function (e) {
                deferred_1.reject(e);
            });
            return deferred_1.promise;
        }
        else {
            return this.dataManager.executeQuery(query);
        }
    };
    return Data;
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
/**
 * To render Chart series
 */
var RangeSeries = /** @class */ (function (_super) {
    __extends$5(RangeSeries, _super);
    function RangeSeries(range) {
        var _this = _super.call(this) || this;
        _this.dataSource = range.dataSource;
        _this.xName = range.xName;
        _this.yName = range.yName;
        _this.query = range.query;
        _this.xMin = Infinity;
        _this.xMax = -Infinity;
        _this.yMin = Infinity;
        _this.yMax = -Infinity;
        return _this;
    }
    /**
     * To render light weight and data manager process
     * @param control
     */
    RangeSeries.prototype.renderChart = function (control) {
        var _this = this;
        var dataSource;
        var query;
        this.seriesLength = 0;
        control.rangeSlider.points = [];
        if (control.series.length) {
            control.series.map(function (series) {
                dataSource = series.dataSource || control.dataSource;
                query = series.query || control.query;
                series.points = [];
                _this.processDataSource(dataSource, query, control, series);
            });
        }
        else {
            this.processDataSource(control.dataSource, control.query, control);
        }
    };
    RangeSeries.prototype.processDataSource = function (dataSource, query, control, series) {
        var _this = this;
        if (!(dataSource instanceof sf.data.DataManager) && !sf.base.isNullOrUndefined(dataSource) && sf.base.isNullOrUndefined(query)) {
            this.dataManagerSuccess({ result: dataSource, count: dataSource.length }, control, series);
            return;
        }
        control.dataModule = new Data(dataSource, query);
        var dataManager = control.dataModule.getData(control.dataModule.generateQuery().requiresCount());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e, control, series); });
    };
    /**
     * data manager process calculated here
     * @param e
     */
    RangeSeries.prototype.dataManagerSuccess = function (e, control, series) {
        var viewData = e.count ? e.result : [];
        control.allowServerDataBinding = false;
        this.processJsonData(viewData, control, Object.keys(viewData).length, series);
        this.seriesLength += series ? 1 : this.seriesLength;
        if (!series || this.seriesLength === control.series.length) {
            this.processXAxis(control);
            this.calculateGroupingBounds(control);
            this.processYAxis(control);
            control.renderChart();
        }
    };
    /**
     * Process JSON data from data source
     * @param control
     * @param len
     */
    RangeSeries.prototype.processJsonData = function (viewData, control, len, series) {
        var i = 0;
        var point;
        var xName = (series && series.xName) || control.xName;
        var yName = (series && series.yName) || control.yName;
        while (i < len) {
            point = new DataPoint(sf.base.getValue(xName, viewData[i]), sf.base.getValue(yName, viewData[i]));
            point.yValue = control.isBlazor ? (sf.base.isNullOrUndefined(point.y) ? 0 : +point.y) : +point.y;
            if (control.valueType === 'DateTime') {
                var dateParser = control.intl.getDateParser({ skeleton: 'full', type: 'dateTime' });
                var dateFormatter = control.intl.getDateFormat({ skeleton: 'full', type: 'dateTime' });
                point.x = new Date(sf.data.DataUtil.parse.parseJson({ val: point.x }).val);
                point.xValue = control.isBlazor ? Date.parse(point.x.toString()) : Date.parse(dateParser(dateFormatter(point.x)));
            }
            else {
                point.xValue = control.isBlazor ? (sf.base.isNullOrUndefined(point.x) ? 0 : +point.x) : +point.x;
            }
            if (series) {
                series.points.push(point);
            }
            this.xMin = Math.min(this.xMin, point.xValue);
            this.yMin = Math.min(this.yMin, point.yValue);
            this.xMax = Math.max(this.xMax, point.xValue);
            this.yMax = Math.max(this.yMax, point.yValue);
            control.rangeSlider.points.push(point);
            i++;
        }
    };
    RangeSeries.prototype.processXAxis = function (control) {
        var axisModule;
        var axis = {
            minimum: control.minimum, maximum: control.maximum,
            interval: control.interval, valueType: control.valueType,
            isInversed: control.enableRtl, labelFormat: control.labelFormat,
            logBase: control.logBase, skeleton: control.skeleton, skeletonType: control.skeletonType
        };
        this.xAxis = axis;
        this.xAxis.intervalType = control.intervalType;
        this.xAxis.maximumLabels = 3;
        this.xAxis.skeleton = control.skeleton;
        this.xAxis.intervalDivs = [10, 5, 2, 1];
        this.xAxis.rect = control.bounds;
        this.xAxis.visibleLabels = [];
        this.xAxis.orientation = 'Horizontal';
        axisModule = control[firstToLowerCase(control.valueType) + 'Module'];
        axisModule.min = this.xMin;
        axisModule.max = this.xMax;
        axisModule.getActualRange(this.xAxis, control.bounds);
        if (this.xAxis.valueType === 'Double' || this.xAxis.valueType === 'DateTime') {
            axisModule.updateActualRange(this.xAxis, this.xAxis.actualRange.min, this.xAxis.actualRange.max, this.xAxis.actualRange.interval);
        }
        this.xAxis.actualRange.delta = this.xAxis.actualRange.max - this.xAxis.actualRange.min;
        this.xAxis.visibleRange = this.xAxis.actualRange;
        axisModule.calculateVisibleLabels(this.xAxis, control);
    };
    /**
     * Process yAxis for range navigator
     * @param control
     */
    RangeSeries.prototype.processYAxis = function (control) {
        var axis = {
            majorGridLines: { width: 0 }, rangePadding: 'None',
            majorTickLines: { width: 0 }, labelStyle: { size: '0' },
            visible: false, valueType: 'Double', minimum: null, maximum: null,
            interval: null
        };
        this.yAxis = axis;
        this.yAxis.rect = control.bounds;
        this.yAxis.maximumLabels = 3;
        this.yAxis.intervalDivs = [10, 5, 2, 1];
        this.yAxis.orientation = 'Vertical';
        control.doubleModule.min = this.yMin;
        control.doubleModule.max = this.yMax;
        control.doubleModule.getActualRange(this.yAxis, control.bounds);
        control.doubleModule.updateActualRange(this.yAxis, this.yAxis.actualRange.min, this.yAxis.actualRange.max, this.yAxis.actualRange.interval);
        this.yAxis.actualRange.delta = this.yAxis.actualRange.max - this.yAxis.actualRange.min;
        this.yAxis.visibleRange = this.yAxis.actualRange;
    };
    /**
     * Process Light weight control
     * @param control
     * @private
     */
    RangeSeries.prototype.renderSeries = function (control) {
        var _this = this;
        this.chartGroup = control.renderer.createGroup({ id: control.element.id + '_chart' });
        var colors = getSeriesColor(control.theme);
        control.series.map(function (series, index) {
            series.xAxis = _this.xAxis;
            series.yAxis = _this.yAxis;
            series.chart = control;
            series.index = index;
            series.xAxis.isInversed = control.enableRtl;
            series.interior = series.fill || colors[index % colors.length];
            _this.createSeriesElement(control, series, index);
            if (control[firstToLowerCase(series.type) + 'SeriesModule']) {
                control[firstToLowerCase(series.type) + 'SeriesModule'].render(series, _this.xAxis, _this.yAxis, false);
            }
            else {
                control['line' + 'SeriesModule'].render(series, _this.xAxis, _this.yAxis, false);
            }
            _this.chartGroup.appendChild(series.seriesElement);
            if (series.animation.enable && control.animateSeries) {
                if (control[firstToLowerCase(series.type) + 'SeriesModule']) {
                    control[firstToLowerCase(series.type) + 'SeriesModule'].doAnimation(series);
                }
                else {
                    //control['line' + 'SeriesModule'].doAnimation(series);
                }
            }
        });
    };
    /**
     * Append series elements in element
     */
    RangeSeries.prototype.appendSeriesElements = function (control) {
        control.svgObject.appendChild(this.chartGroup);
        if (control.series.length) {
            this.drawSeriesBorder(control, this.chartGroup);
        }
    };
    RangeSeries.prototype.createSeriesElement = function (control, series, index) {
        var elementId = control.element.id;
        series.clipRect = new sf.svgbase.Rect(this.xAxis.rect.x, this.yAxis.rect.y, this.xAxis.rect.width, this.yAxis.rect.height);
        series.clipRectElement = control.renderer.drawClipPath(new RectOption(elementId + '_RangeSeriesClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1, {
            x: 0, y: 0,
            width: series.clipRect.width,
            height: series.clipRect.height
        }));
        series.seriesElement = control.renderer.createGroup({
            'id': elementId + 'SeriesGroup' + index,
            'transform': 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')',
            'clip-path': 'url(#' + elementId + '_RangeSeriesClipRect_' + index + ')'
        });
        series.seriesElement.appendChild(series.clipRectElement);
    };
    RangeSeries.prototype.calculateGroupingBounds = function (control) {
        var padding = control.margin.bottom;
        var labelHeight = sf.svgbase.measureText('string', control.labelStyle).height;
        this.calculateDateTimeNiceInterval(this.xAxis, new sf.svgbase.Size(control.bounds.width, control.bounds.height), this.xMin, this.xMax, false);
        if (control.enableGrouping && control.valueType === 'DateTime'
            && (this.xAxis.actualIntervalType !== 'Years' || !control.series.length)) {
            control.bounds.height -= (control.labelPosition === 'Outside' || control.series.length === 0) ? padding + labelHeight :
                (labelHeight + 2 * padding);
        }
        if (!control.series.length) {
            control.bounds.y += control.bounds.height / 4;
            control.bounds.height = control.bounds.height / 2;
        }
    };
    RangeSeries.prototype.drawSeriesBorder = function (control, chartElement) {
        var start = control.stockChart ? 'M' : 'L';
        var close = control.stockChart ? '' : 'Z';
        var options = new sf.svgbase.PathOption(control.element.id + '_SeriesBorder', 'transparent', control.navigatorBorder.width, control.navigatorBorder.color, 1, '', ('M ' + (control.bounds.x) + ' ' + (control.bounds.y) +
            ' L ' + (control.bounds.x + control.bounds.width) + ' ' + control.bounds.y +
            start + (control.bounds.x + control.bounds.width) + ' ' + (control.bounds.y + control.bounds.height) +
            ' L ' + (control.bounds.x) + ' ' + (control.bounds.y + control.bounds.height) + close));
        var htmlObject = control.renderer.drawPath(options);
        control.svgObject.appendChild(htmlObject);
    };
    return RangeSeries;
}(NiceInterval));

var __extends$8 = (undefined && undefined.__extends) || (function () {
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
 * `DateTime` module is used to render datetime axis.
 */
var DateTime = /** @class */ (function (_super) {
    __extends$8(DateTime, _super);
    /**
     * Constructor for the dateTime module.
     * @private
     */
    function DateTime(chart) {
        return _super.call(this, chart) || this;
    }
    /**
     * The function to calculate the range and labels for the axis.
     * @return {void}
     */
    DateTime.prototype.calculateRangeAndInterval = function (size, axis) {
        this.calculateRange(axis, size);
        this.getActualRange(axis, size);
        this.applyRangePadding(axis, size);
        this.calculateVisibleLabels(axis, this.chart);
    };
    /**
     * Actual Range for the axis.
     * @private
     */
    DateTime.prototype.getActualRange = function (axis, size) {
        var option = {
            skeleton: 'full',
            type: 'dateTime'
        };
        var dateParser = this.chart.intl.getDateParser(option);
        var dateFormatter = this.chart.intl.getDateFormat(option);
        // Axis min
        if ((axis.minimum) !== null) {
            this.min = this.chart.isBlazor ? Date.parse(axis.minimum.toString()) : Date.parse(dateParser(dateFormatter(new Date(sf.data.DataUtil.parse.parseJson({ val: axis.minimum }).val))));
        }
        else if (this.min === null || this.min === Number.POSITIVE_INFINITY) {
            this.min = Date.parse(dateParser(dateFormatter(new Date(1970, 1, 1))));
        }
        // Axis Max
        if ((axis.maximum) !== null) {
            this.max = this.chart.isBlazor ? Date.parse(axis.maximum.toString()) : Date.parse(dateParser(dateFormatter(new Date(sf.data.DataUtil.parse.parseJson({ val: axis.maximum }).val))));
        }
        else if (this.max === null || this.max === Number.NEGATIVE_INFINITY) {
            this.max = Date.parse(dateParser(dateFormatter(new Date(1970, 5, 1))));
        }
        if (this.min === this.max) {
            this.max = this.max + 2592000000;
            this.min = this.min - 2592000000;
        }
        axis.actualRange = {};
        axis.doubleRange = new DoubleRange(this.min, this.max);
        var datetimeInterval = this.calculateDateTimeNiceInterval(axis, size, axis.doubleRange.start, axis.doubleRange.end);
        if (!axis.interval) {
            axis.actualRange.interval = datetimeInterval;
        }
        else {
            axis.actualRange.interval = axis.interval;
        }
        axis.actualRange.min = axis.doubleRange.start;
        axis.actualRange.max = axis.doubleRange.end;
    };
    /**
     * Apply padding for the range.
     * @private
     */
    DateTime.prototype.applyRangePadding = function (axis, size) {
        this.min = (axis.actualRange.min);
        this.max = (axis.actualRange.max);
        var minimum;
        var maximum;
        var interval = axis.actualRange.interval;
        if (!setRange(axis)) {
            var rangePadding = axis.getRangePadding(this.chart);
            minimum = new Date(this.min);
            maximum = new Date(this.max);
            var intervalType = axis.actualIntervalType;
            if (rangePadding === 'None') {
                this.min = minimum.getTime();
                this.max = maximum.getTime();
            }
            else if (rangePadding === 'Additional' || rangePadding === 'Round') {
                switch (intervalType) {
                    case 'Years':
                        this.getYear(minimum, maximum, rangePadding, interval);
                        break;
                    case 'Months':
                        this.getMonth(minimum, maximum, rangePadding, interval);
                        break;
                    case 'Days':
                        this.getDay(minimum, maximum, rangePadding, interval);
                        break;
                    case 'Hours':
                        this.getHour(minimum, maximum, rangePadding, interval);
                        break;
                    case 'Minutes':
                        var minute = (minimum.getMinutes() / interval) * interval;
                        var endMinute = maximum.getMinutes() + (minimum.getMinutes() - minute);
                        if (rangePadding === 'Round') {
                            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), minimum.getDate(), minimum.getHours(), minute, 0)).getTime();
                            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), maximum.getHours(), endMinute, 59)).getTime();
                        }
                        else {
                            this.min = (new Date(minimum.getFullYear(), maximum.getMonth(), minimum.getDate(), minimum.getHours(), minute + (-interval), 0)).getTime();
                            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), maximum.getHours(), endMinute + (interval), 0)).getTime();
                        }
                        break;
                    case 'Seconds':
                        var second = (minimum.getSeconds() / interval) * interval;
                        var endSecond = maximum.getSeconds() + (minimum.getSeconds() - second);
                        if (rangePadding === 'Round') {
                            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), minimum.getDate(), minimum.getHours(), minimum.getMinutes(), second, 0)).getTime();
                            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), maximum.getHours(), maximum.getMinutes(), endSecond, 0)).getTime();
                        }
                        else {
                            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), minimum.getDate(), minimum.getHours(), minimum.getMinutes(), second + (-interval), 0)).getTime();
                            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), maximum.getHours(), maximum.getMinutes(), endSecond + (interval), 0)).getTime();
                        }
                        break;
                }
            }
        }
        axis.actualRange.min = (axis.minimum != null) ? this.min : this.min;
        axis.actualRange.max = (axis.maximum != null) ? this.max : this.max;
        axis.actualRange.delta = (axis.actualRange.max - axis.actualRange.min);
        axis.doubleRange = new DoubleRange(axis.actualRange.min, axis.actualRange.max);
        this.calculateVisibleRange(size, axis);
    };
    DateTime.prototype.getYear = function (minimum, maximum, rangePadding, interval) {
        var startYear = minimum.getFullYear();
        var endYear = maximum.getFullYear();
        if (rangePadding === 'Additional') {
            this.min = (new Date(startYear - interval, 1, 1, 0, 0, 0)).getTime();
            this.max = (new Date(endYear + interval, 1, 1, 0, 0, 0)).getTime();
        }
        else {
            this.min = new Date(startYear, 0, 0, 0, 0, 0).getTime();
            this.max = new Date(endYear, 11, 30, 23, 59, 59).getTime();
        }
    };
    DateTime.prototype.getMonth = function (minimum, maximum, rangePadding, interval) {
        var month = minimum.getMonth();
        var endMonth = maximum.getMonth();
        if (rangePadding === 'Round') {
            this.min = (new Date(minimum.getFullYear(), month, 0, 0, 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), endMonth, new Date(maximum.getFullYear(), maximum.getMonth(), 0).getDate(), 23, 59, 59)).getTime();
        }
        else {
            this.min = (new Date(minimum.getFullYear(), month + (-interval), 1, 0, 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), endMonth + (interval), endMonth === 2 ? 28 : 30, 0, 0, 0)).getTime();
        }
    };
    DateTime.prototype.getDay = function (minimum, maximum, rangePadding, interval) {
        var day = minimum.getDate();
        var endDay = maximum.getDate();
        if (rangePadding === 'Round') {
            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), day, 0, 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), endDay, 23, 59, 59)).getTime();
        }
        else {
            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), day + (-interval), 0, 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), endDay + (interval), 0, 0, 0)).getTime();
        }
    };
    DateTime.prototype.getHour = function (minimum, maximum, rangePadding, interval) {
        var hour = (minimum.getHours() / interval) * interval;
        var endHour = maximum.getHours() + (minimum.getHours() - hour);
        if (rangePadding === 'Round') {
            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), minimum.getDate(), hour, 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), endHour, 59, 59)).getTime();
        }
        else {
            this.min = (new Date(minimum.getFullYear(), minimum.getMonth(), minimum.getDate(), hour + (-interval), 0, 0)).getTime();
            this.max = (new Date(maximum.getFullYear(), maximum.getMonth(), maximum.getDate(), endHour + (interval), 0, 0)).getTime();
        }
    };
    /**
     * Calculate visible range for axis.
     * @private
     */
    DateTime.prototype.calculateVisibleRange = function (size, axis) {
        axis.visibleRange = {
            min: axis.actualRange.min,
            max: axis.actualRange.max,
            interval: axis.actualRange.interval,
            delta: axis.actualRange.delta,
        };
        var isLazyLoad = sf.base.isNullOrUndefined(axis.zoomingScrollBar) ? false : axis.zoomingScrollBar.isLazyLoad;
        if ((isZoomSet(axis)) && !isLazyLoad) {
            axis.calculateVisibleRangeOnZooming(this.chart);
            axis.calculateAxisRange(size, this.chart);
            axis.visibleRange.interval = (axis.enableAutoIntervalOnZooming) ?
                this.calculateDateTimeNiceInterval(axis, size, axis.visibleRange.min, axis.visibleRange.max)
                : axis.visibleRange.interval;
        }
        axis.dateTimeInterval = this.increaseDateTimeInterval(axis, axis.visibleRange.min, axis.visibleRange.interval).getTime()
            - axis.visibleRange.min;
        axis.triggerRangeRender(this.chart, axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.interval);
    };
    /**
     * Calculate visible labels for the axis.
     * @param axis
     * @param chart
     * @private
     */
    DateTime.prototype.calculateVisibleLabels = function (axis, chart) {
        axis.visibleLabels = [];
        var tempInterval = axis.visibleRange.min;
        var labelStyle;
        var previousValue;
        var axisLabels = axis.visibleLabels;
        if (!setRange(axis)) {
            tempInterval = this.alignRangeStart(axis, tempInterval, axis.visibleRange.interval, axis.actualIntervalType).getTime();
        }
        while (tempInterval <= axis.visibleRange.max) {
            labelStyle = (sf.base.extend({}, sf.base.getValue('properties', axis.labelStyle), null, true));
            previousValue = axisLabels.length ? axis.visibleLabels[axisLabels.length - 1].value : tempInterval;
            axis.format = chart.intl.getDateFormat({
                format: this.findCustomFormats(axis, tempInterval, previousValue) || this.blazorCustomFormat(axis),
                type: firstToLowerCase(axis.skeletonType),
                skeleton: this.getSkeleton(axis, tempInterval, previousValue, chart.isBlazor)
            });
            axis.startLabel = axis.format(new Date(axis.visibleRange.min));
            axis.endLabel = axis.format(new Date(axis.visibleRange.max));
            if (withIn(tempInterval, axis.visibleRange)) {
                triggerLabelRender(chart, tempInterval, axis.format(new Date(tempInterval)), labelStyle, axis);
            }
            tempInterval = this.increaseDateTimeInterval(axis, tempInterval, axis.visibleRange.interval).getTime();
        }
        //tooltip and crosshair formats for 'Months' and 'Days' interval types
        if ((axis.actualIntervalType === 'Months' || axis.actualIntervalType === 'Days') && axis.isChart) {
            axis.format = chart.intl.getDateFormat({
                format: axis.labelFormat || (axis.actualIntervalType === 'Months' && !axis.skeleton ? 'y MMM' : ''),
                type: firstToLowerCase(axis.skeletonType), skeleton: axis.skeleton || (axis.actualIntervalType === 'Days' ? 'MMMd' : '')
            });
        }
        if (axis.getMaxLabelWidth) {
            axis.getMaxLabelWidth(this.chart);
        }
    };
    /** @private */
    DateTime.prototype.blazorCustomFormat = function (axis) {
        if (this.chart.isBlazor) {
            return axis.actualIntervalType === 'Years' ? (axis.isIntervalInDecimal ? 'yyyy' : 'MMM y') :
                (axis.actualIntervalType === 'Days' && !axis.isIntervalInDecimal) ? 'ddd HH tt' : '';
        }
        else {
            return '';
        }
    };
    /** @private */
    DateTime.prototype.increaseDateTimeInterval = function (axis, value, interval) {
        var result = new Date(value);
        if (axis.interval) {
            axis.isIntervalInDecimal = (interval % 1) === 0;
            axis.visibleRange.interval = interval;
        }
        else {
            interval = Math.ceil(interval);
            axis.visibleRange.interval = interval;
        }
        var intervalType = axis.actualIntervalType;
        if (axis.isIntervalInDecimal) {
            switch (intervalType) {
                case 'Years':
                    result.setFullYear(result.getFullYear() + interval);
                    return result;
                case 'Quarter':
                    result.setMonth(result.getMonth() + (3 * interval));
                    return result;
                case 'Months':
                    result.setMonth(result.getMonth() + interval);
                    return result;
                case 'Weeks':
                    result.setDate(result.getDate() + (interval * 7));
                    return result;
                case 'Days':
                    result.setDate(result.getDate() + interval);
                    return result;
                case 'Hours':
                    result.setHours(result.getHours() + interval);
                    return result;
                case 'Minutes':
                    result.setMinutes(result.getMinutes() + interval);
                    return result;
                case 'Seconds':
                    result.setSeconds(result.getSeconds() + interval);
                    return result;
            }
        }
        else {
            result = this.getDecimalInterval(result, interval, intervalType);
        }
        return result;
    };
    DateTime.prototype.alignRangeStart = function (axis, sDate, intervalSize, intervalType) {
        var sResult = new Date(sDate);
        switch (axis.actualIntervalType) {
            case 'Years':
                var year = Math.floor(Math.floor(sResult.getFullYear() / intervalSize) * intervalSize);
                sResult = new Date(year, sResult.getMonth(), sResult.getDate(), 0, 0, 0);
                return sResult;
            case 'Months':
                var month = Math.floor(Math.floor((sResult.getMonth()) / intervalSize) * intervalSize);
                sResult = new Date(sResult.getFullYear(), month, sResult.getDate(), 0, 0, 0);
                return sResult;
            case 'Days':
                var day = Math.floor(Math.floor((sResult.getDate()) / intervalSize) * intervalSize);
                sResult = new Date(sResult.getFullYear(), sResult.getMonth(), day, 0, 0, 0);
                return sResult;
            case 'Hours':
                var hour = Math.floor(Math.floor((sResult.getHours()) / intervalSize) * intervalSize);
                sResult = new Date(sResult.getFullYear(), sResult.getMonth(), sResult.getDate(), hour, 0, 0);
                return sResult;
            case 'Minutes':
                var minutes = Math.floor(Math.floor((sResult.getMinutes()) / intervalSize) * intervalSize);
                sResult = new Date(sResult.getFullYear(), sResult.getMonth(), sResult.getDate(), sResult.getHours(), minutes, 0, 0);
                return sResult;
            case 'Seconds':
                var seconds = Math.floor(Math.floor((sResult.getSeconds()) / intervalSize) * intervalSize);
                sResult = new Date(sResult.getFullYear(), sResult.getMonth(), sResult.getDate(), sResult.getHours(), sResult.getMinutes(), seconds, 0);
                return sResult;
        }
        return sResult;
    };
    DateTime.prototype.getDecimalInterval = function (result, interval, intervalType) {
        var roundValue = Math.floor(interval);
        var decimalValue = interval - roundValue;
        switch (intervalType) {
            case 'Years':
                var month = Math.round(12 * decimalValue);
                result.setFullYear(result.getFullYear() + roundValue);
                result.setMonth(result.getMonth() + month);
                return result;
            case 'Quarter':
                result.setMonth(result.getMonth() + (3 * interval));
                return result;
            case 'Months':
                var days = Math.round(30 * decimalValue);
                result.setMonth(result.getMonth() + roundValue);
                result.setDate(result.getDate() + days);
                return result;
            case 'Weeks':
                result.setDate(result.getDate() + (interval * 7));
                return result;
            case 'Days':
                var hour = Math.round(24 * decimalValue);
                result.setDate(result.getDate() + roundValue);
                result.setHours(result.getHours() + hour);
                return result;
            case 'Hours':
                var min = Math.round(60 * decimalValue);
                result.setHours(result.getHours() + roundValue);
                result.setMinutes(result.getMinutes() + min);
                return result;
            case 'Minutes':
                var sec = Math.round(60 * decimalValue);
                result.setMinutes(result.getMinutes() + roundValue);
                result.setSeconds(result.getSeconds() + sec);
                return result;
            case 'Seconds':
                var milliSec = Math.round(1000 * decimalValue);
                result.setSeconds(result.getSeconds() + roundValue);
                result.setMilliseconds(result.getMilliseconds() + milliSec);
                return result;
        }
        return result;
    };
    /**
     * Get module name
     */
    DateTime.prototype.getModuleName = function () {
        /**
         * Returns the module name
         */
        return 'DateTime';
    };
    /**
     * To destroy the category axis.
     * @return {void}
     * @private
     */
    DateTime.prototype.destroy = function (chart) {
        /**
         * Destroy method performed here
         */
    };
    return DateTime;
}(NiceInterval));

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
 * class for axis
 */
var RangeNavigatorAxis = /** @class */ (function (_super) {
    __extends$7(RangeNavigatorAxis, _super);
    function RangeNavigatorAxis(range) {
        var _this = _super.call(this) || this;
        _this.firstLevelLabels = [];
        _this.secondLevelLabels = [];
        _this.rangeNavigator = range;
        return _this;
    }
    /**
     * To render grid lines of axis
     */
    RangeNavigatorAxis.prototype.renderGridLines = function () {
        var pointX = 0;
        var control = this.rangeNavigator;
        var majorGridLines = control.majorGridLines;
        var majorTickLines = control.majorTickLines;
        var majorGrid = '';
        var majorTick = '';
        var rect = control.bounds;
        var chartAxis = control.chartSeries.xAxis;
        var labelLength;
        var range = chartAxis.visibleRange;
        var disabledColor = (control.disableRangeSelector) ? 'transparent' : null;
        this.gridLines = control.renderer.createGroup({ id: control.element.id + '_GridLines' });
        var tick = (control.tickPosition === 'Outside' || control.series.length === 0) ?
            rect.y + rect.height + majorTickLines.height : rect.y + rect.height - majorTickLines.height;
        //Gridlines
        this.firstLevelLabels = [];
        chartAxis.labelStyle = control.labelStyle;
        chartAxis.skeleton = control.skeleton;
        chartAxis.skeletonType = control.skeletonType;
        chartAxis.isChart = false;
        if (control.valueType === 'DateTime') {
            this.calculateDateTimeNiceInterval(chartAxis, rect, chartAxis.doubleRange.start, chartAxis.doubleRange.end, chartAxis.isChart);
            this.actualIntervalType = chartAxis.actualIntervalType;
            this.findAxisLabels(chartAxis);
        }
        this.firstLevelLabels = chartAxis.visibleLabels;
        this.lowerValues = [];
        labelLength = chartAxis.visibleLabels.length;
        for (var i = 0; i < labelLength; i++) {
            this.lowerValues.push(this.firstLevelLabels[i].value);
            pointX = (valueToCoefficient(this.firstLevelLabels[i].value, chartAxis) * rect.width) + rect.x;
            if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                majorGrid = majorGrid.concat('M ' + pointX + ' ' + (control.bounds.y + control.bounds.height) +
                    ' L ' + pointX + ' ' + control.bounds.y + ' ');
                majorTick = majorTick.concat('M ' + (pointX) + ' ' + (rect.y + rect.height) +
                    ' L ' + (pointX) + ' ' + tick + ' ');
            }
        }
        var options = new sf.svgbase.PathOption(control.element.id + '_MajorGridLine', 'transparent', majorGridLines.width, control.series.length ? disabledColor || majorGridLines.color || control.themeStyle.gridLineColor : 'transparent', 1, majorGridLines.dashArray, majorGrid);
        this.gridLines.appendChild(control.renderer.drawPath(options));
        options = new sf.svgbase.PathOption(control.element.id + '_MajorTickLine', 'transparent', majorTickLines.width, disabledColor || majorTickLines.color || control.themeStyle.gridLineColor, 1, majorGridLines.dashArray, majorTick);
        this.gridLines.appendChild(control.renderer.drawPath(options));
    };
    /**
     * To render of axis labels
     */
    RangeNavigatorAxis.prototype.renderAxisLabels = function () {
        var axis = this.rangeNavigator.chartSeries.xAxis;
        var control = this.rangeNavigator;
        var pointY;
        var rect = control.bounds;
        var labelElement = control.renderer.createGroup({ id: control.element.id + '_AxisLabels' });
        var firstLevelElement = control.renderer.createGroup({ id: control.element.id + '_FirstLevelAxisLabels' });
        var secondLevelElement = control.renderer.createGroup({ id: control.element.id + '_SecondLevelAxisLabels' });
        var secondaryAxis = axis;
        pointY = this.findLabelY(control, false);
        this.placeAxisLabels(axis, pointY, '_AxisLabel_', control, firstLevelElement);
        secondaryAxis.intervalType = secondaryAxis.actualIntervalType = (control.groupBy ||
            this.getSecondaryLabelType(axis.actualIntervalType));
        secondaryAxis.labelFormat = '';
        if (control.enableGrouping && control.valueType === 'DateTime' && this.actualIntervalType !== 'Years') {
            secondaryAxis.visibleRange.interval = 1;
            secondaryAxis.visibleLabels = [];
            this.findAxisLabels(secondaryAxis);
            this.secondLevelLabels = secondaryAxis.visibleLabels;
            pointY = this.findLabelY(control, true);
            var border = this.placeAxisLabels(secondaryAxis, pointY, '_SecondaryLabel_', control, secondLevelElement);
            var path = new sf.svgbase.PathOption(control.element.id + '_SecondaryMajorLines', 'transparent', control.majorTickLines.width, control.majorTickLines.color || control.themeStyle.gridLineColor, 1, control.majorGridLines.dashArray, border);
            this.gridLines.appendChild(control.renderer.drawPath(path));
        }
        control.chartSeries.xAxis.visibleLabels = control.chartSeries.xAxis.visibleLabels.concat(secondaryAxis.visibleLabels);
        labelElement.appendChild(firstLevelElement);
        labelElement.appendChild(secondLevelElement);
        //gridlines and axis label append to element
        control.svgObject.appendChild(this.gridLines);
        control.svgObject.appendChild(labelElement);
    };
    /**
     * To find secondary level label type
     * @param type
     */
    RangeNavigatorAxis.prototype.getSecondaryLabelType = function (type) {
        var types = ['Years', 'Quarter', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];
        return (type === 'Years' ? 'Years' : types[types.indexOf(type) - 1]);
    };
    /**
     * To find labels for date time axis
     * @param axis
     */
    RangeNavigatorAxis.prototype.findAxisLabels = function (axis) {
        axis.visibleLabels = [];
        var start = new Date(axis.visibleRange.min);
        var nextInterval;
        var text;
        var interval = this.rangeNavigator.interval ? this.rangeNavigator.interval : 1;
        switch (axis.actualIntervalType) {
            case 'Years':
                start = new Date(start.getFullYear(), 0, 1);
                break;
            case 'Quarter':
                if (start.getMonth() <= 2) {
                    start = new Date(start.getFullYear(), 0, 1);
                }
                else if (start.getMonth() <= 5) {
                    start = new Date(start.getFullYear(), 3, 1);
                }
                else if (start.getMonth() <= 8) {
                    start = new Date(start.getFullYear(), 6, 1);
                }
                else {
                    start = new Date(start.getFullYear(), 9, 1);
                }
                break;
            case 'Months':
                start = new Date(start.getFullYear(), start.getMonth());
                break;
            case 'Weeks':
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate() - start.getDay());
                break;
            case 'Days':
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                break;
            case 'Hours':
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours());
                break;
            case 'Minutes':
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
                break;
            case 'Seconds':
                start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds());
                break;
        }
        nextInterval = start.getTime();
        this.rangeNavigator.format = this.rangeNavigator.intl.getDateFormat({
            format: axis.labelFormat || this.blazorFormat(axis),
            type: firstToLowerCase(axis.skeletonType), skeleton: this.getSkeleton(axis, null, null, this.rangeNavigator.isBlazor)
        });
        while (nextInterval <= axis.visibleRange.max) {
            text = this.dateFormats(this.rangeNavigator.format(new Date(nextInterval)), axis, axis.visibleLabels.length);
            axis.visibleLabels.push(new VisibleLabels(text, nextInterval, this.rangeNavigator.labelStyle, text));
            nextInterval = this.increaseDateTimeInterval(axis, nextInterval, interval).getTime();
        }
    };
    RangeNavigatorAxis.prototype.blazorFormat = function (axis) {
        if (this.rangeNavigator.isBlazor && axis.actualIntervalType === 'Years') {
            return 'yyyy';
        }
        else {
            return '';
        }
    };
    /**
     * To find date time formats for Quarter and week interval type
     * @param text
     * @param axis
     * @param index
     */
    RangeNavigatorAxis.prototype.dateFormats = function (text, axis, index) {
        var changedText = text;
        var isBlazor = this.rangeNavigator.isBlazor;
        var isFirstLevel = this.rangeNavigator.enableGrouping && this.firstLevelLabels.length === 0;
        switch (axis.actualIntervalType) {
            case 'Quarter':
                if (text.indexOf('Jan') > -1) {
                    changedText = !isFirstLevel ? text.replace(isBlazor ? 'January' : 'Jan', 'Quarter1') : 'Quarter1';
                }
                else if (text.indexOf('Apr') > -1) {
                    changedText = !isFirstLevel ? text.replace(isBlazor ? 'April' : 'Apr', 'Quarter2') : 'Quarter2';
                }
                else if (text.indexOf('Jul') > -1) {
                    changedText = !isFirstLevel ? text.replace(isBlazor ? 'July' : 'Jul', 'Quarter3') : 'Quarter3';
                }
                else if (text.indexOf('Oct') > -1) {
                    changedText = !isFirstLevel ? text.replace(isBlazor ? 'October' : 'Oct', 'Quarter4') : 'Quarter4';
                }
                break;
            case 'Weeks':
                changedText = 'Week' + ++index;
                break;
            default:
                changedText = text;
                break;
        }
        return changedText;
    };
    /**
     * To find the y co-ordinate for axis labels
     * @param control - rangeNavigator
     * @param isSecondary sets true if the axis is secondary axis
     */
    RangeNavigatorAxis.prototype.findLabelY = function (control, isSecondary) {
        var pointY;
        var reference = control.bounds.y + control.bounds.height;
        var tickHeight = control.majorTickLines.height;
        var textHeight = sf.svgbase.measureText('Quarter1 2011', control.labelStyle).height;
        var padding = 8;
        if ((control.labelPosition === 'Outside' && control.tickPosition === 'Outside') || control.series.length === 0) {
            pointY = reference + tickHeight + padding + textHeight * 0.75;
        }
        else if (control.labelPosition === 'Inside' && control.tickPosition === 'Inside') {
            pointY = reference - tickHeight - padding;
        }
        else if (control.labelPosition === 'Inside' && control.tickPosition === 'Outside') {
            pointY = reference - padding;
        }
        else {
            pointY = reference + padding + (textHeight * 0.75);
        }
        if (isSecondary) {
            padding = 15;
            if (control.labelPosition === 'Outside' || control.series.length === 0) {
                pointY += padding + textHeight * 0.75;
            }
            else {
                pointY = (control.tickPosition === 'Outside' || control.series.length === 0) ?
                    reference + tickHeight + padding + textHeight * 0.75 : reference + padding + textHeight * 0.75;
            }
        }
        return pointY;
    };
    /**
     * It places the axis labels and returns border for secondary axis labels
     * @param axis axis for the lables placed
     * @param pointY y co-ordinate for axis labels
     * @param id id for the axis elements
     * @param control range navigator
     * @param labelElement parent element in which axis labels appended
     */
    RangeNavigatorAxis.prototype.placeAxisLabels = function (axis, pointY, id, control, labelElement) {
        var maxLabels = axis.visibleLabels.length;
        var label;
        var prevLabel;
        var pointX;
        var rect = control.bounds;
        var border = '';
        var pointXGrid;
        var disabledColor = (control.disableRangeSelector) ? 'transparent' : null;
        var prevX = control.enableRtl ? (rect.x + rect.width) : rect.x;
        var intervalType = axis.actualIntervalType;
        var intervalInTime = control.valueType === 'DateTime' ?
            maxLabels > 1 ? (axis.visibleLabels[1].value - axis.visibleLabels[0].value) :
                (axis.visibleRange.max - axis.visibleLabels[0].value) / 2 : 0;
        if (control.valueType === 'DateTime' && (intervalType === 'Quarter' || intervalType === 'Weeks')) {
            this.findSuitableFormat(axis, control);
        }
        for (var i = 0, len = maxLabels; i < len; i++) {
            label = axis.visibleLabels[i];
            label.size = sf.svgbase.measureText(label.text, axis.labelStyle);
            if (control.secondaryLabelAlignment === 'Middle') {
                pointX = (valueToCoefficient((label.value + intervalInTime / 2), axis) * rect.width) + rect.x;
            }
            else if ((id.indexOf('Secondary') > -1)) {
                pointX = this.findAlignment(axis, i);
            }
            pointXGrid = (valueToCoefficient((label.value), axis) * rect.width) + rect.x;
            //edgelabelPlacements
            if ((i === 0 || (i === axis.visibleLabels.length - 1 && control.enableRtl)) && pointX < rect.x) {
                pointX = rect.x + label.size.width / 2;
            }
            if ((i === axis.visibleLabels.length - 1 || (i === 0 && control.enableRtl)) &&
                ((pointX + label.size.width) > (rect.x + rect.width))) {
                pointX = rect.x + rect.width - label.size.width / 2;
            }
            //secondary axis grid lines
            if (id.indexOf('_SecondaryLabel_') > -1) {
                if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                    border = border.concat('M ' + pointXGrid + ' ' + pointY +
                        ' L ' + pointXGrid + ' ' + (pointY - label.size.height));
                }
            }
            //smart axis label position,
            if (control.labelIntersectAction === 'Hide' &&
                i !== 0 && this.isIntersect(axis, pointX, label.size.width, prevX, prevLabel.size.width)) {
                continue;
            }
            //label alignment for single visible label
            if (control.secondaryLabelAlignment === 'Middle' && axis.visibleLabels.length === 1) {
                pointX = valueToCoefficient(label.value, axis) + (rect.x + (rect.width / 2));
            }
            //labelrender event
            var argsData = void 0;
            var labelStyle = control.labelStyle;
            var style = {
                size: labelStyle.size, color: disabledColor || labelStyle.color || control.themeStyle.labelFontColor,
                fontFamily: labelStyle.fontFamily,
                fontStyle: labelStyle.fontStyle || control.labelStyle.fontStyle,
                fontWeight: labelStyle.fontWeight || control.labelStyle.fontWeight,
                opacity: labelStyle.opacity || control.labelStyle.opacity,
                textAlignment: labelStyle.textAlignment || control.labelStyle.textAlignment,
                textOverflow: labelStyle.textOverflow || control.labelStyle.textOverflow
            };
            argsData = {
                cancel: false, name: 'labelRender',
                text: label.text, value: label.value, labelStyle: style,
                region: new sf.svgbase.Rect(pointX, pointY, label.size.width, label.size.height)
            };
            control.trigger('labelRender', argsData);
            if (!argsData.cancel) {
                control.labels.push(argsData);
            }
            else {
                continue;
            }
            textElement(this.rangeNavigator.renderer, new sf.svgbase.TextOption(this.rangeNavigator.element.id + id + i, pointX, pointY, 'middle', argsData.text), argsData.labelStyle, argsData.labelStyle.color || control.themeStyle.labelFontColor, labelElement).style.cursor = axis.valueType === 'DateTime' ? 'cursor: pointer' : 'cursor: default';
            prevX = pointX;
            prevLabel = label;
        }
        return border;
    };
    /**
     * To check label is intersected with successive label or not
     */
    RangeNavigatorAxis.prototype.isIntersect = function (axis, currentX, currentWidth, prevX, prevWidth) {
        return (axis.isInversed) ? (currentX + currentWidth / 2 > prevX - prevWidth / 2) :
            (currentX - currentWidth / 2 < prevX + prevWidth / 2);
    };
    /**
     * To find suitable label format for Quarter and week Interval types
     * @param axis
     * @param control
     */
    RangeNavigatorAxis.prototype.findSuitableFormat = function (axis, control) {
        var labels = axis.visibleLabels;
        var labelLength = labels.length;
        var bounds = control.bounds;
        var prevX;
        var currentX;
        var interval = control.valueType === 'DateTime' ?
            labelLength > 1 ? (labels[1].value - labels[0].value) : axis.visibleRange.interval
            : 0;
        for (var i = 0; i < labelLength; i++) {
            currentX = (valueToCoefficient((labels[i].value + interval / 2), axis) * bounds.width) + bounds.x;
            labels[i].size = sf.svgbase.measureText(labels[i].text, axis.labelStyle);
            //edgelabelPlacements
            if (i === 0 && currentX < bounds.x) {
                currentX = bounds.x + labels[i].size.width / 2;
            }
            if (axis.actualIntervalType === 'Quarter') {
                if (i !== 0) {
                    if ((labels[i].text.indexOf('Quarter') > -1) &&
                        (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width))) {
                        labels.every(function (label) {
                            label.text = label.text.toString().replace('Quarter', 'QTR');
                            return true;
                        });
                        axis.visibleLabels = labels;
                        this.findSuitableFormat(axis, control);
                    }
                    else {
                        if (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width)) {
                            labels.every(function (label) {
                                label.text = label.text.toString().replace('QTR', 'Q');
                                return true;
                            });
                            axis.visibleLabels = labels;
                        }
                    }
                }
            }
            else if (axis.actualIntervalType === 'Weeks') {
                if ((i !== 0) && ((labels[i].text.indexOf('Week') > -1) &&
                    (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width)))) {
                    labels.every(function (label) {
                        label.text = label.text.toString().replace('Week', 'W');
                        return true;
                    });
                    axis.visibleLabels = labels;
                }
            }
            prevX = currentX;
        }
    };
    /**
     * Alignment position for secondary level labels in date time axis
     * @param axis
     * @param index
     */
    RangeNavigatorAxis.prototype.findAlignment = function (axis, index) {
        var label = axis.visibleLabels[index];
        var nextLabel = axis.visibleLabels[index + 1];
        var bounds = this.rangeNavigator.bounds;
        return (this.rangeNavigator.secondaryLabelAlignment === 'Near' ?
            (valueToCoefficient((label.value), axis) * bounds.width) + bounds.x + label.size.width / 2 :
            (valueToCoefficient((nextLabel ? nextLabel.value : axis.visibleRange.max), axis) * bounds.width) + bounds.x - label.size.width);
    };
    return RangeNavigatorAxis;
}(DateTime));

/**
 *
 */

(function (RangeNavigatorTheme) {
    /** @private */
    RangeNavigatorTheme.axisLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
    /** @private */
    RangeNavigatorTheme.tooltipLabelFont = {
        size: '12px',
        fontWeight: 'Normal',
        color: null,
        fontStyle: 'Normal',
        fontFamily: 'Segoe UI'
    };
})(exports.RangeNavigatorTheme || (exports.RangeNavigatorTheme = {}));
/** @private */
// tslint:disable-next-line:max-func-body-length
function getRangeThemeColor(theme, range) {
    var thumbSize = range.navigatorStyleSettings.thumb;
    var thumbWidth = sf.base.isNullOrUndefined(thumbSize.width) ? (sf.base.Browser.isDevice ? 15 : 20) : thumbSize.width;
    var thumbHeight = sf.base.isNullOrUndefined(thumbSize.height) ? (sf.base.Browser.isDevice ? 15 : 20) : thumbSize.height;
    var darkAxisColor = (theme === 'HighContrast') ? '#969696' : '#6F6C6C';
    var darkGridlineColor = (theme === 'HighContrast') ? '#4A4848' : '#414040';
    var darkBackground = theme === 'MaterialDark' ? '#303030' : (theme === 'FabricDark' ? '#201F1F' : '1A1A1A');
    var style = {
        gridLineColor: '#E0E0E0',
        axisLineColor: '#000000',
        labelFontColor: '#686868',
        unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#EEEEEE',
        thumpLineColor: 'rgba(189, 189, 189, 1)',
        thumbBackground: 'rgba(250, 250, 250, 1)',
        gripColor: '#757575',
        background: '#FFFFFF',
        thumbHoverColor: '#EEEEEE',
        selectedRegionColor: range.series.length ? 'transparent' : '#FF4081',
        tooltipBackground: 'rgb(0, 8, 22)',
        tooltipFontColor: '#dbdbdb',
        thumbWidth: thumbWidth,
        thumbHeight: thumbHeight
    };
    switch (theme) {
        case 'Fabric':
            style.selectedRegionColor = range.series.length ? 'transparent' : '#007897';
            break;
        case 'Bootstrap':
            style.selectedRegionColor = range.series.length ? 'transparent' : '#428BCA';
            break;
        case 'HighContrastLight':
            style = {
                gridLineColor: '#bdbdbd',
                axisLineColor: '#969696',
                labelFontColor: '#ffffff',
                unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.3)' : '#EEEEEE',
                thumpLineColor: '#ffffff',
                thumbBackground: '#262626',
                gripColor: '#ffffff',
                background: darkBackground,
                thumbHoverColor: '#BFBFBF',
                selectedRegionColor: range.series.length ? 'transparent' : '#FFD939',
                tooltipBackground: '#ffffff',
                tooltipFontColor: '#000000',
                thumbWidth: thumbWidth,
                thumbHeight: thumbHeight
            };
            break;
        case 'Highcontrast':
        case 'HighContrast':
            style = {
                gridLineColor: darkGridlineColor,
                axisLineColor: darkAxisColor,
                labelFontColor: '#DADADA',
                unselectedRectColor: range.series.length ? 'rgba(43, 43, 43, 0.6)' : '#514F4F',
                thumpLineColor: '#969696',
                thumbBackground: '#333232',
                gripColor: '#DADADA',
                background: '#000000',
                thumbHoverColor: '#BFBFBF',
                selectedRegionColor: range.series.length ? 'rgba(22, 22, 22, 0.6)' : '#FFD939',
                tooltipBackground: '#F4F4F4',
                tooltipFontColor: '#282727',
                thumbWidth: thumbWidth,
                thumbHeight: thumbHeight
            };
            break;
        case 'MaterialDark':
        case 'FabricDark':
        case 'BootstrapDark':
            style = {
                labelFontColor: '#DADADA',
                axisLineColor: ' #6F6C6C',
                gridLineColor: '#414040',
                tooltipBackground: '#F4F4F4',
                tooltipFontColor: '#333232',
                unselectedRectColor: range.series.length ? 'rgba(43, 43, 43, 0.6)' : '#514F4F',
                thumpLineColor: '#969696',
                thumbBackground: '#333232',
                gripColor: '#DADADA',
                background: darkBackground,
                thumbHoverColor: '#BFBFBF',
                selectedRegionColor: range.series.length ? 'rgba(22, 22, 22, 0.6)' :
                    theme === 'FabricDark' ? '#007897' : theme === 'BootstrapDark' ? '#428BCA' : '#FF4081',
                thumbWidth: thumbWidth,
                thumbHeight: thumbHeight
            };
            break;
        case 'Bootstrap4':
            style = {
                gridLineColor: '#E0E0E0',
                axisLineColor: '#CED4DA',
                labelFontColor: '#212529',
                unselectedRectColor: range.series.length ? 'rgba(255, 255, 255, 0.6)' : '#514F4F',
                thumpLineColor: 'rgba(189, 189, 189, 1)',
                thumbBackground: '#FFFFFF',
                gripColor: '#495057',
                background: 'rgba(255, 255, 255, 0.6)',
                thumbHoverColor: '#EEEEEE',
                selectedRegionColor: range.series.length ? 'transparent' : '#FFD939',
                tooltipBackground: 'rgba(0, 0, 0, 0.9)',
                tooltipFontColor: 'rgba(255, 255, 255)',
                thumbWidth: thumbWidth,
                thumbHeight: thumbHeight
            };
            break;
        default:
            style.selectedRegionColor = range.series.length ? 'transparent' : '#FF4081';
            break;
    }
    return style;
}

var __extends$9 = (undefined && undefined.__extends) || (function () {
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
 * Series class for the range navigator
 */
var RangeNavigatorSeries = /** @class */ (function (_super) {
    __extends$9(RangeNavigatorSeries, _super);
    function RangeNavigatorSeries() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.clipRect = new sf.svgbase.Rect(0, 0, 0, 0);
        return _this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], RangeNavigatorSeries.prototype, "dataSource", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeNavigatorSeries.prototype, "xName", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeNavigatorSeries.prototype, "yName", void 0);
    __decorate$4([
        sf.base.Property()
    ], RangeNavigatorSeries.prototype, "query", void 0);
    __decorate$4([
        sf.base.Property('Line')
    ], RangeNavigatorSeries.prototype, "type", void 0);
    __decorate$4([
        sf.base.Complex({ enable: false }, Animation$1)
    ], RangeNavigatorSeries.prototype, "animation", void 0);
    __decorate$4([
        sf.base.Complex({ color: 'transparent', width: 2 }, Border)
    ], RangeNavigatorSeries.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeNavigatorSeries.prototype, "fill", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], RangeNavigatorSeries.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], RangeNavigatorSeries.prototype, "opacity", void 0);
    __decorate$4([
        sf.base.Property('0')
    ], RangeNavigatorSeries.prototype, "dashArray", void 0);
    return RangeNavigatorSeries;
}(sf.base.ChildProperty));
/**
 * Thumb settings
 */
var ThumbSettings = /** @class */ (function (_super) {
    __extends$9(ThumbSettings, _super);
    function ThumbSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], ThumbSettings.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ThumbSettings.prototype, "height", void 0);
    __decorate$4([
        sf.base.Complex({ width: 1, color: null }, Border)
    ], ThumbSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ThumbSettings.prototype, "fill", void 0);
    __decorate$4([
        sf.base.Property('Circle')
    ], ThumbSettings.prototype, "type", void 0);
    return ThumbSettings;
}(sf.base.ChildProperty));
/**
 * Style settings
 */
var StyleSettings = /** @class */ (function (_super) {
    __extends$9(StyleSettings, _super);
    function StyleSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Complex({}, ThumbSettings)
    ], StyleSettings.prototype, "thumb", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StyleSettings.prototype, "selectedRegionColor", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StyleSettings.prototype, "unselectedRegionColor", void 0);
    return StyleSettings;
}(sf.base.ChildProperty));
/*
 * Configures the ToolTips in the chart.
 */
var RangeTooltipSettings = /** @class */ (function (_super) {
    __extends$9(RangeTooltipSettings, _super);
    function RangeTooltipSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], RangeTooltipSettings.prototype, "enable", void 0);
    __decorate$4([
        sf.base.Property(0.85)
    ], RangeTooltipSettings.prototype, "opacity", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeTooltipSettings.prototype, "fill", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeTooltipSettings.prototype, "format", void 0);
    __decorate$4([
        sf.base.Complex(exports.RangeNavigatorTheme.tooltipLabelFont, Font)
    ], RangeTooltipSettings.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], RangeTooltipSettings.prototype, "template", void 0);
    __decorate$4([
        sf.base.Complex({ color: '#cccccc', width: 0.5 }, Border)
    ], RangeTooltipSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property('OnDemand')
    ], RangeTooltipSettings.prototype, "displayMode", void 0);
    return RangeTooltipSettings;
}(sf.base.ChildProperty));

/**
 * Class for slider
 */
var RangeSlider = /** @class */ (function () {
    function RangeSlider(range) {
        this.control = range;
        this.points = [];
        this.isIOS = sf.base.Browser.isIos || sf.base.Browser.isIos7;
        var thumb = range.navigatorStyleSettings.thumb;
        this.thumbVisible = (range.themeStyle.thumbWidth !== 0 && range.themeStyle.thumbHeight !== 0);
        this.elementId = range.element.id;
        this.thumpPadding = range.themeStyle.thumbWidth / 2;
        this.addEventListener();
        this.thumbColor = range.disableRangeSelector ? 'transparent' :
            (thumb.fill || range.themeStyle.thumbBackground);
    }
    /**
     * Render Slider elements for range navigator
     * @param range
     */
    RangeSlider.prototype.render = function (range) {
        var renderer = range.renderer;
        var style = range.navigatorStyleSettings;
        var disabledColor = (range.disableRangeSelector) ? 'transparent' : null;
        var sliderGroup = renderer.createGroup({
            'id': this.elementId + '_sliders',
            style: (range.disableRangeSelector) ? 'pointer-events:none;' : ''
        });
        var option = new RectOption(this.elementId + '_leftUnSelectedArea', disabledColor || style.unselectedRegionColor || range.themeStyle.unselectedRectColor, { width: 0 }, 1, {
            x: range.bounds.x, y: range.bounds.y,
            width: range.bounds.width / 3,
            height: range.bounds.height
        });
        this.leftUnSelectedElement = renderer.drawRectangle(option);
        option.id = this.elementId + '_rightUnSelectedArea';
        this.rightUnSelectedElement = renderer.drawRectangle(option);
        option.id = this.elementId + '_SelectedArea';
        option.fill = disabledColor || style.selectedRegionColor || range.themeStyle.selectedRegionColor;
        this.selectedElement = renderer.drawRectangle(option);
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grab');
        this.leftSlider = renderer.createGroup({
            'id': this.elementId + '_LeftSlider', 'style': 'cursor: ew-resize'
        });
        this.rightSlider = renderer.createGroup({
            'id': this.elementId + '_RightSlider', 'style': 'cursor: ew-resize'
        });
        this.createThump(renderer, range.bounds, this.leftSlider, this.elementId + '_LeftSlider', sliderGroup);
        this.createThump(renderer, range.bounds, this.rightSlider, this.elementId + '_RightSlider');
        sliderGroup.appendChild(this.leftUnSelectedElement);
        sliderGroup.appendChild(this.rightUnSelectedElement);
        sliderGroup.appendChild(this.selectedElement);
        sliderGroup.appendChild(this.leftSlider);
        sliderGroup.appendChild(this.rightSlider);
        range.svgObject.appendChild(sliderGroup);
    };
    /**
     * Thumb creation performed
     * @param render
     * @param bounds
     * @param parent
     * @param id
     */
    RangeSlider.prototype.createThump = function (render, bounds, parent, id, sliderGroup) {
        var control = this.control;
        var thump = control.navigatorStyleSettings.thumb;
        var style = control.themeStyle;
        var y = bounds.y + bounds.height / 2;
        var x = this.thumpPadding;
        var tickLength = (control.themeStyle.thumbHeight / 2) - 5;
        var disabledColor = control.disableRangeSelector ? 'transparent' : null;
        var lineColor = disabledColor || thump.border.color || style.thumpLineColor;
        var shadowElement;
        parent.appendChild(render.drawPath(new sf.svgbase.PathOption(id + '_ThumpLine', 'transparent', thump.border.width, control.series.length ? lineColor : 'transparent', 1, null, 'M' + ' ' + (x) + ' ' + (bounds.y) + ' ' + 'L' + ' ' + (x) + ' ' + (bounds.y + bounds.height) + ' ')));
        this.thumpY = y - (control.themeStyle.thumbHeight / 2);
        this.sliderY = bounds.y > this.thumpY ? this.thumpY : bounds.y;
        if (sliderGroup && !control.disableRangeSelector) {
            shadowElement = render.createDefs();
            shadowElement.innerHTML = '<rect xmlns="http://www.w3.org/2000/svg" id="' + this.control.element.id + '_shadow' + '" x="0" ' +
                'y="' + this.thumpY + '" width="' + control.themeStyle.thumbWidth + '" height="' + control.themeStyle.thumbHeight + '"' +
                ' rx="' + (thump.type === 'Circle' ? '50%' : '0%') + '"/>' +
                '<filter xmlns="http://www.w3.org/2000/svg" x="-25.0%" y="-20.0%" width="150.0%" height="150.0%"' +
                ' filterUnits="objectBoundingBox" id="ej2-range-shadow"><feOffset dx="0" dy="1" in="SourceAlpha"' +
                'result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="1.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>' +
                '<feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>' +
                '<feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1"/>' +
                '</filter>';
            sliderGroup.appendChild(shadowElement);
        }
        parent.innerHTML += '<use xmlns="http://www.w3.org/2000/svg" fill="black" fill-opacity="1" filter="url(#ej2-range-shadow)"' +
            ' xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#path-1"/>';
        if (thump.type === 'Circle') {
            parent.appendChild(drawSymbol({ x: x, y: y }, 'Circle', { width: control.themeStyle.thumbWidth, height: control.themeStyle.thumbHeight }, '', new sf.svgbase.PathOption(id + '_ThumpSymbol', disabledColor || this.thumbColor, thump.border.width, lineColor, 1, null), 'Thumb'));
        }
        else {
            parent.appendChild(render.drawRectangle(new RectOption(id + '_ThumpSymbol', disabledColor || this.thumbColor, { width: thump.border.width, color: lineColor }, 1, {
                x: x - (control.themeStyle.thumbWidth / 2), y: y - (control.themeStyle.thumbHeight / 2),
                width: control.themeStyle.thumbWidth,
                height: control.themeStyle.thumbHeight
            }, 2, 2)));
        }
        if (this.thumbVisible) {
            parent.appendChild(render.drawPath(new sf.svgbase.PathOption(id + '_ThumpGrip', 'transparent', 1, disabledColor || control.themeStyle.gripColor, 1, null, 'M' + ' ' + (x + 2) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x + 2) + ' ' + (y - tickLength) + ' ' +
                'M' + ' ' + (x) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x) + ' ' + (y - tickLength) + ' ' +
                'M' + ' ' + (x - 2) + ' ' + (y + tickLength) + ' ' + 'L' + ' ' + (x - 2) + ' ' + (y - tickLength) + ' ')));
        }
    };
    /**
     * Set slider value for range navigator
     * @param start
     * @param end
     */
    RangeSlider.prototype.setSlider = function (start, end, trigger, showTooltip$$1) {
        var range = this.control;
        var padding = range.bounds.x;
        var axisRange = range.chartSeries.xAxis.actualRange;
        var isLeightWeight = range.series.length === 0;
        if (!(end >= start)) {
            start = [end, end = start][0];
        }
        start = end >= start ? start : [end, end = start][0];
        start = Math.max(start, axisRange.min);
        end = Math.min(end, axisRange.max);
        this.startX = padding + getXLocation(start, axisRange, range.bounds.width, range.enableRtl);
        this.endX = padding + getXLocation(end, axisRange, range.bounds.width, range.enableRtl);
        var selectedX = range.enableRtl ? this.endX : this.startX;
        var rightPadding = range.enableRtl ? this.startX : this.endX;
        this.sliderWidth = Math.abs(this.endX - this.startX);
        this.selectedElement.setAttribute('x', (selectedX) + '');
        this.selectedElement.setAttribute('width', this.sliderWidth + '');
        this.leftUnSelectedElement.setAttribute('width', (selectedX - padding) + '');
        this.rightUnSelectedElement.setAttribute('x', rightPadding + '');
        this.rightUnSelectedElement.setAttribute('width', (range.bounds.width - (rightPadding - padding)) + '');
        this.leftSlider.setAttribute('transform', 'translate(' + (this.startX - this.thumpPadding) + ', 0)');
        this.rightSlider.setAttribute('transform', 'translate(' + (this.endX - this.thumpPadding) + ', 0)');
        var left = this.control.svgObject.getBoundingClientRect().left -
            this.control.element.getBoundingClientRect().left;
        var leftX = this.control.enableRtl ? this.endX : this.startX;
        var rightX = this.control.enableRtl ? this.startX : this.endX;
        this.leftRect = {
            x: isLeightWeight ? left + padding : padding,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: isLeightWeight ? leftX - padding : leftX,
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.rightRect = {
            x: isLeightWeight ? left + rightX : rightX,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: (range.bounds.width - (rightPadding - padding)),
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.midRect = {
            x: isLeightWeight ? leftX + left : 0,
            y: isLeightWeight ? 0 : range.bounds.y,
            width: isLeightWeight ? Math.abs(this.endX - this.startX) : rightX,
            height: isLeightWeight ? this.thumpY : range.bounds.height
        };
        this.currentStart = start;
        this.currentEnd = end;
        if (showTooltip$$1) {
            this.control.rangeTooltipModule.renderLeftTooltip(this);
            this.control.rangeTooltipModule.renderRightTooltip(this);
        }
        if (trigger) {
            this.triggerEvent(axisRange);
        }
    };
    /**
     * Trigger changed event
     * @param private
     */
    RangeSlider.prototype.triggerEvent = function (range) {
        var argsData;
        var xAxis = this.control.chartSeries.xAxis;
        var valueType = xAxis.valueType;
        var trigger = this.control.enableDeferredUpdate;
        var enabledTooltip = this.control.tooltip.enable;
        if (this.isDrag && this.control.allowSnapping) {
            this.isDrag = false;
            this.setAllowSnapping(this.control, this.currentStart, this.currentEnd, trigger, enabledTooltip);
        }
        argsData = {
            cancel: false,
            start: valueType === 'DateTime' ? new Date(this.currentStart) :
                (valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, this.currentStart) : this.currentStart),
            end: valueType === 'DateTime' ? new Date(this.currentEnd) :
                (valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, this.currentEnd) : this.currentEnd),
            name: 'changed',
            selectedData: getExactData(this.points, this.currentStart, this.currentEnd),
            zoomPosition: (this.control.enableRtl ? range.max - this.currentEnd :
                this.currentStart - range.min) / range.delta,
            zoomFactor: (this.currentEnd - this.currentStart) / range.delta
        };
        this.control.trigger('changed', argsData);
    };
    /**
     * @hidden
     */
    RangeSlider.prototype.addEventListener = function () {
        if (this.control.isDestroyed) {
            return;
        }
        this.control.on(sf.base.Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.control.on(sf.base.Browser.touchStartEvent, this.mouseDownHandler, this);
        this.control.on(sf.base.Browser.touchEndEvent, this.mouseUpHandler, this);
        this.control.on(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseCancelHandler, this);
    };
    /**
     * @hidden
     */
    RangeSlider.prototype.removeEventListener = function () {
        if (this.control.isDestroyed) {
            return;
        }
        this.control.off(sf.base.Browser.touchMoveEvent, this.mouseMoveHandler);
        this.control.off(sf.base.Browser.touchStartEvent, this.mouseDownHandler);
        this.control.off(sf.base.Browser.touchEndEvent, this.mouseUpHandler);
        this.control.off(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseCancelHandler);
    };
    /**
     * Move move handler perfomed here
     * @hidden
     * @param e
     */
    RangeSlider.prototype.mouseMoveHandler = function (e) {
        var control = this.control;
        var axisRange = control.chartSeries.xAxis.actualRange;
        var bounds = control.bounds;
        var start;
        var end;
        this.getCurrentSlider(e.target.id);
        if (this.isDrag && control.mouseX >= bounds.x) {
            switch (this.currentSlider) {
                case 'Left':
                    control.startValue = this.getRangeValue(Math.abs(control.mouseX - bounds.x));
                    break;
                case 'Right':
                    control.endValue = this.getRangeValue(Math.abs(control.mouseX - bounds.x));
                    break;
                case 'Middle':
                    start = Math.max(this.getRangeValue(Math.abs(this.startX - (this.previousMoveX - control.mouseX) - bounds.x)), axisRange.min);
                    end = Math.min(this.getRangeValue(Math.abs(this.endX - (this.previousMoveX - control.mouseX) - bounds.x)), axisRange.max);
                    var currentWidth = Math.floor(Math.abs(getXLocation(end, axisRange, control.bounds.width, control.enableRtl) -
                        getXLocation(start, axisRange, control.bounds.width, control.enableRtl)));
                    if (currentWidth === Math.floor(this.sliderWidth)) {
                        control.startValue = start;
                        control.endValue = end;
                    }
                    break;
            }
            if (e.preventDefault && this.isIOS) {
                e.preventDefault();
            }
            this.setSlider(control.startValue, control.endValue, !control.enableDeferredUpdate, (control.rangeTooltipModule && control.tooltip.enable));
            this.previousMoveX = control.mouseX;
        }
    };
    /**
     * To get the range value
     * @param x
     */
    RangeSlider.prototype.getRangeValue = function (x) {
        var control = this.control;
        var axisRange = control.chartSeries.xAxis.actualRange;
        var bounds = control.bounds;
        return getRangeValueXByPoint(x, bounds.width, axisRange, control.enableRtl);
    };
    /**
     * Moused down handler for slider perform here
     * @param e
     */
    RangeSlider.prototype.mouseDownHandler = function (e) {
        this.currentSlider = this.getCurrentSlider(e.target.id);
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grabbing');
        this.isDrag = !(this.currentSlider === 'UnSelectedArea' || !this.currentSlider);
        this.previousMoveX = this.control.mouseDownX;
    };
    /**
     * To get the current slider element
     * @param id
     */
    RangeSlider.prototype.getCurrentSlider = function (id) {
        var hoverColor = this.control.themeStyle.thumbHoverColor;
        if (id.indexOf(this.elementId + '_LeftSlider') > -1) {
            this.leftSlider.childNodes[2].setAttribute('fill', hoverColor);
            return 'Left';
        }
        else if (id.indexOf(this.elementId + '_RightSlider') > -1) {
            this.rightSlider.childNodes[2].setAttribute('fill', hoverColor);
            return 'Right';
        }
        else if (id.indexOf(this.elementId + '_SelectedArea') > -1) {
            return 'Middle';
        }
        else if (id.indexOf('UnSelectedArea') > -1) {
            this.leftSlider.childNodes[2].setAttribute('fill', this.thumbColor);
            this.rightSlider.childNodes[2].setAttribute('fill', this.thumbColor);
            return 'UnSelectedArea';
        }
        else if (id.indexOf(this.elementId + '_AxisLabel_') > -1 && this.control.valueType === 'DateTime') {
            this.labelIndex = +id.substring(id.lastIndexOf('_') + 1, id.length);
            return 'firstLevelLabels';
        }
        else if (id.indexOf(this.elementId + '_SecondaryLabel') > -1 && this.control.valueType === 'DateTime') {
            this.labelIndex = +id.substring(id.lastIndexOf('_') + 1, id.length);
            return 'secondLevelLabels';
        }
        else {
            this.leftSlider.childNodes[2].setAttribute('fill', this.thumbColor);
            this.rightSlider.childNodes[2].setAttribute('fill', this.thumbColor);
            if (this.control.periodSelectorModule) {
                this.control.periodSelectorModule.triggerChange = true;
            }
            return null;
        }
    };
    /**
     * Mouse up handler performed here
     * @param e
     */
    RangeSlider.prototype.mouseUpHandler = function (e) {
        var control = this.control;
        var range = control.chartSeries.xAxis.actualRange;
        var trigger = control.enableDeferredUpdate;
        var enabledTooltip = control.tooltip.enable;
        if (control.stockChart) {
            control.stockChart.zoomChange = false;
        }
        if (this.currentSlider === 'UnSelectedArea') {
            var value = void 0;
            var start = void 0;
            var end = void 0;
            var isRtl = control.enableRtl;
            var difference = control.endValue - control.startValue;
            if (control.mouseDownX < this.startX) {
                value = Math.max(this.getRangeValue((control.mouseDownX - (this.sliderWidth / 2) - control.bounds.x)), range.min);
                end = isRtl ? value : (value + difference);
                start = isRtl ? (value - difference) : value;
            }
            else {
                value = Math.min(this.getRangeValue((control.mouseDownX + (this.sliderWidth / 2) - control.bounds.x)), range.max);
                start = isRtl ? value : (value - difference);
                end = isRtl ? (value + difference) : value;
            }
            this.performAnimation(start, end, control);
            trigger = false;
        }
        else if (this.currentSlider === 'firstLevelLabels' || this.currentSlider === 'secondLevelLabels') {
            var secondLabel = control.rangeAxis[this.currentSlider][this.labelIndex + 1];
            /**
             * One millisecond is subtracted from the label to indicate the previous label value
             */
            this.performAnimation(control.rangeAxis[this.currentSlider][this.labelIndex].value, (secondLabel ? (control.allowIntervalData ? secondLabel.value - 1 : secondLabel.value) : range.max), control);
            trigger = false;
        }
        if (this.isDrag && control.allowSnapping) {
            this.setAllowSnapping(control, this.currentStart, this.currentEnd, trigger, enabledTooltip);
            trigger = false;
        }
        if (trigger) {
            this.setSlider(this.currentStart, this.currentEnd, true, enabledTooltip);
        }
        if (this.currentSlider !== null) {
            if (this.control.periodSelectorSettings.periods.length > 0) {
                this.control.periodSelectorModule.triggerChange = false;
                this.control.periodSelectorModule.datePicker.startDate = new Date(this.currentStart);
                this.control.periodSelectorModule.datePicker.endDate = new Date(this.currentEnd);
            }
        }
        this.selectedElement.setAttribute('style', 'cursor: -webkit-grab');
        control.startValue = this.currentStart;
        control.endValue = this.currentEnd;
        this.isDrag = false;
        this.labelIndex = null;
        this.currentSlider = null;
    };
    /**
     * Allow Snapping perfomed here
     * @param control
     * @param start
     * @param end
     */
    RangeSlider.prototype.setAllowSnapping = function (control, start, end, trigger, tooltip) {
        var values = control.rangeAxis.lowerValues;
        values.push(control.chartSeries.xAxis.actualRange.max);
        this.setSlider(getNearestValue(values, start), getNearestValue(values, end), trigger, tooltip);
        control.startValue = this.currentStart;
        control.endValue = this.currentEnd;
    };
    /**
     * Animation Calculation for slider navigation
     * @param start
     * @param end
     */
    RangeSlider.prototype.performAnimation = function (start, end, control, animationDuration) {
        var _this = this;
        var currentStart = this.currentStart;
        var currentEnd = this.currentEnd;
        var isDeffered = control.enableDeferredUpdate;
        var enableTooltip = control.tooltip.enable;
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: !sf.base.isNullOrUndefined(animationDuration) ? animationDuration : this.control.animationDuration,
            progress: function (args) {
                _this.setSlider(linear(args.timeStamp, 0, start - currentStart, args.duration) + currentStart, linear(args.timeStamp, 0, end - currentEnd, args.duration) + currentEnd, !isDeffered, enableTooltip);
            },
            end: function (model) {
                if (control.allowSnapping) {
                    _this.setAllowSnapping(control, start, end, true, enableTooltip);
                }
                else {
                    _this.setSlider(start, end, true, enableTooltip);
                }
                _this.control.startValue = _this.currentStart;
                _this.control.endValue = _this.currentEnd;
                if (_this.control.periodSelectorSettings.periods.length > 0) {
                    _this.control.periodSelectorModule.triggerChange = false;
                    _this.control.periodSelectorModule.datePicker.startDate = new Date(_this.currentStart);
                    _this.control.periodSelectorModule.datePicker.endDate = new Date(_this.currentEnd);
                }
            }
        });
    };
    /**
     * Mouse Cancel Handler
     */
    RangeSlider.prototype.mouseCancelHandler = function () {
        if (this.isDrag && this.control.allowSnapping) {
            this.setAllowSnapping(this.control, this.currentStart, this.currentEnd, false, this.control.tooltip.enable);
        }
        this.isDrag = false;
        this.currentSlider = null;
        this.control.startValue = this.currentStart;
        this.control.endValue = this.currentEnd;
    };
    /**
     * Destroy Method Calling here
     */
    RangeSlider.prototype.destroy = function () {
        this.removeEventListener();
    };
    return RangeSlider;
}());

/**
 * Base for line type series.
 */
var LineBase = /** @class */ (function () {
    /** @private */
    function LineBase(chartModule) {
        this.chart = chartModule;
    }
    /**
     * To improve the chart performance.
     * @return {void}
     * @private
     */
    LineBase.prototype.enableComplexProperty = function (series) {
        var tempPoints = [];
        var tempPoints2 = [];
        var xVisibleRange = series.xAxis.visibleRange;
        var yVisibleRange = series.yAxis.visibleRange;
        var seriesPoints = series.points;
        var areaBounds = series.clipRect;
        var xTolerance = Math.abs(xVisibleRange.delta / areaBounds.width);
        var yTolerance = Math.abs(yVisibleRange.delta / areaBounds.height);
        var prevXValue = (seriesPoints[0] && seriesPoints[0].x > xTolerance) ? 0 : xTolerance;
        var prevYValue = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance;
        var xVal = 0;
        var yVal = 0;
        for (var _i = 0, seriesPoints_1 = seriesPoints; _i < seriesPoints_1.length; _i++) {
            var currentPoint = seriesPoints_1[_i];
            currentPoint.symbolLocations = [];
            xVal = currentPoint.xValue ? currentPoint.xValue : xVisibleRange.min;
            yVal = currentPoint.yValue ? currentPoint.yValue : yVisibleRange.min;
            if (Math.abs(prevXValue - xVal) >= xTolerance || Math.abs(prevYValue - yVal) >= yTolerance) {
                tempPoints.push(currentPoint);
                prevXValue = xVal;
                prevYValue = yVal;
            }
        }
        var tempPoint;
        for (var i = 0; i < tempPoints.length; i++) {
            tempPoint = tempPoints[i];
            if (sf.base.isNullOrUndefined(tempPoint.x) || tempPoint.x === '') {
                continue;
            }
            else {
                tempPoints2.push(tempPoint);
            }
        }
        return tempPoints2;
    };
    /**
     * To generate the line path direction
     * @param firstPoint
     * @param secondPoint
     * @param series
     * @param isInverted
     * @param getPointLocation
     * @param startPoint
     */
    LineBase.prototype.getLineDirection = function (firstPoint, secondPoint, series, isInverted, getPointLocation, startPoint) {
        var direction = '';
        if (firstPoint != null) {
            var point1 = getPointLocation(firstPoint.xValue, firstPoint.yValue, series.xAxis, series.yAxis, isInverted, series);
            var point2 = getPointLocation(secondPoint.xValue, secondPoint.yValue, series.xAxis, series.yAxis, isInverted, series);
            direction = startPoint + ' ' + (point1.x) + ' ' + (point1.y) + ' ' +
                'L' + ' ' + (point2.x) + ' ' + (point2.y) + ' ';
        }
        return direction;
    };
    /**
     * To append the line path.
     * @return {void}
     * @private
     */
    LineBase.prototype.appendLinePath = function (options, series, clipRect) {
        var element = getElement(options.id);
        var chart = series.chart;
        var previousDirection = element ? element.getAttribute('d') : null;
        var htmlObject = series.chart.renderer.drawPath(options, new Int32Array([series.clipRect.x, series.clipRect.y]));
        if (htmlObject) {
            htmlObject.setAttribute('clip-path', clipRect);
        }
        series.pathElement = htmlObject;
        if (!series.chart.enableCanvas) {
            series.seriesElement.appendChild(htmlObject);
        }
        series.isRectSeries = false;
        pathAnimation(element, options.d, series.chart.redraw, previousDirection, chart.duration);
    };
    /**
     * To render the marker for the series.
     * @return {void}
     * @private
     */
    LineBase.prototype.renderMarker = function (series) {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    };
    /**
     * To do the progressive animation.
     * @return {void}
     * @private
     */
    LineBase.prototype.doProgressiveAnimation = function (series, option) {
        var animation = new sf.base.Animation({});
        var path = series.pathElement;
        var strokeDashArray = path.getAttribute('stroke-dasharray');
        var pathLength = series.pathElement.getTotalLength();
        var currentTime;
        path.style.visibility = 'hidden';
        animation.animate(path, {
            duration: option.duration,
            delay: option.delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    path.style.visibility = 'visible';
                    currentTime = Math.abs(Math.round(((args.timeStamp - args.delay) * pathLength) / args.duration));
                    path.setAttribute('stroke-dasharray', currentTime + ',' + pathLength);
                }
            },
            end: function (model) {
                path.setAttribute('stroke-dasharray', strokeDashArray);
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        });
    };
    /**
     * To store the symbol location and region
     * @param point
     * @param series
     * @param isInverted
     * @param getLocation
     */
    LineBase.prototype.storePointLocation = function (point, series, isInverted, getLocation) {
        var markerWidth = (series.marker && series.marker.width) ? series.marker.width : 0;
        var markerHeight = (series.marker && series.marker.height) ? series.marker.height : 0;
        point.symbolLocations.push(getLocation(point.xValue, point.yValue, series.xAxis, series.yAxis, isInverted, series));
        point.regions.push(new sf.svgbase.Rect(point.symbolLocations[0].x - markerWidth, point.symbolLocations[0].y - markerHeight, 2 * markerWidth, 2 * markerHeight));
    };
    /**
     * To find point with in the visible range
     * @param point
     * @param yAxis
     * @private
     */
    LineBase.prototype.withinYRange = function (point, yAxis) {
        return point.yValue >= yAxis.visibleRange.min && point.yValue <= yAxis.visibleRange.max;
    };
    /**
     * To get first and last visible points
     * @private
     */
    LineBase.prototype.getFirstLastVisiblePoint = function (points) {
        var first = null;
        var last = null;
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            if (first === null && point.visible) {
                first = last = point;
            }
            last = point.visible ? point : last;
        }
        return { first: first ? first : points[0], last: last ? last : points[points.length - 1] };
    };
    /**
     * To do the linear animation.
     * @return {void}
     * @private
     */
    LineBase.prototype.doLinearAnimation = function (series, animation) {
        var clipRect = series.clipRectElement.childNodes[0].childNodes[0];
        var duration = series.chart.animated ? series.chart.duration : animation.duration;
        var effect = getAnimationFunction('Linear');
        var elementHeight = +clipRect.getAttribute('height');
        var elementWidth = +clipRect.getAttribute('width');
        var xCenter = +clipRect.getAttribute('x');
        var yCenter = series.chart.requireInvertedAxis ? +clipRect.getAttribute('height') + +clipRect.getAttribute('y') :
            +clipRect.getAttribute('y');
        var value;
        clipRect.style.visibility = 'hidden';
        new sf.base.Animation({}).animate(clipRect, {
            duration: duration,
            delay: animation.delay,
            progress: function (args) {
                if (args.timeStamp >= args.delay) {
                    clipRect.style.visibility = 'visible';
                    if (series.chart.requireInvertedAxis) {
                        value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(1,' + (value / elementHeight) + ') translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                    else {
                        value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                        clipRect.setAttribute('transform', 'translate(' + xCenter + ' ' + yCenter +
                            ') scale(' + (value / elementWidth) + ', 1) translate(' + (-xCenter) + ' ' + (-yCenter) + ')');
                    }
                }
            },
            end: function (model) {
                clipRect.setAttribute('transform', 'translate(0,0)');
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }
        });
    };
    return LineBase;
}());

var __extends$10 = (undefined && undefined.__extends) || (function () {
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
 * `LineSeries` module used to render the line series.
 */
var LineSeries = /** @class */ (function (_super) {
    __extends$10(LineSeries, _super);
    function LineSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Render Line Series.
     * @return {void}.
     * @private
     */
    LineSeries.prototype.render = function (series, xAxis, yAxis, isInverted) {
        var point1;
        var point2;
        var direction = '';
        var prevPoint = null;
        var startPoint = 'M';
        var options;
        var isPolar = (series.chart && series.chart.chartAreaType === 'PolarRadar');
        var isDrop = (series.emptyPointSettings && series.emptyPointSettings.mode === 'Drop');
        var getCoordinate = isPolar ? TransformToVisible : getPoint;
        var visiblePoints = series.category === 'TrendLine' ? series.points : this.enableComplexProperty(series);
        for (var _i = 0, visiblePoints_1 = visiblePoints; _i < visiblePoints_1.length; _i++) {
            var point = visiblePoints_1[_i];
            point.regions = [];
            point.symbolLocations = [];
            if (point.visible && withInRange(visiblePoints[point.index - 1], point, visiblePoints[point.index + 1], series)) {
                direction += this.getLineDirection(prevPoint, point, series, isInverted, getCoordinate, startPoint);
                startPoint = prevPoint ? 'L' : startPoint;
                prevPoint = point;
                this.storePointLocation(point, series, isInverted, getCoordinate);
            }
            else {
                prevPoint = isDrop ? prevPoint : null;
                startPoint = isDrop ? startPoint : 'M';
            }
        }
        if (isPolar) {
            if (series.isClosed) {
                var points = this.getFirstLastVisiblePoint(visiblePoints);
                point2 = getCoordinate(points.last.xValue, points.last.yValue, xAxis, yAxis, isInverted, series);
                point1 = getCoordinate(points.first.xValue, points.first.yValue, xAxis, yAxis, isInverted, series);
                direction = direction.concat(startPoint + ' ' + point2.x + ' ' + point2.y + ' ' + 'L' + ' ' + point1.x + ' ' + point1.y);
            }
        }
        var name = series.category === 'Indicator' ? series.chart.element.id + '_Indicator_' + series.index + '_' + series.name :
            series.category === 'TrendLine' ? series.chart.element.id + '_Series_' + series.sourceIndex + '_TrendLine_' + series.index :
                series.chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index);
        options = new sf.svgbase.PathOption(name, 'none', series.width, series.interior, series.opacity, series.dashArray, direction);
        this.appendLinePath(options, series, '');
        this.renderMarker(series);
    };
    /**
     * Animates the series.
     * @param  {Series} series - Defines the series to animate.
     * @return {void}
     */
    LineSeries.prototype.doAnimation = function (series) {
        var option = series.animation;
        this.doProgressiveAnimation(series, option);
    };
    /**
     * Get module name.
     */
    LineSeries.prototype.getModuleName = function () {
        /**
         * Returns the module name of the series
         */
        return 'LineSeries';
    };
    /**
     * To destroy the line series.
     * @return {void}
     * @private
     */
    LineSeries.prototype.destroy = function (chart) {
        /**
         * Destroy method performed here
         */
    };
    return LineSeries;
}(LineBase));

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

/**
 * Period selector class
 */
var PeriodSelector = /** @class */ (function () {
    //constructor for period selector
    function PeriodSelector(control) {
        this.control = {};
        this.rootControl = control;
    }
    /**
     * To set the control values
     * @param control
     */
    PeriodSelector.prototype.setControlValues = function (control) {
        if (control.getModuleName() === 'rangeNavigator') {
            this.control.periods = this.rootControl.periodSelectorSettings.periods;
            this.control.seriesXMax = control.chartSeries.xMax;
            this.control.seriesXMin = control.chartSeries.xMin;
            this.control.rangeSlider = control.rangeSlider;
            this.control.rangeNavigatorControl = control;
            this.control.endValue = control.endValue;
            this.control.startValue = control.startValue;
        }
        else {
            this.control.periods = this.rootControl.periods;
            this.control.endValue = this.control.seriesXMax = control.seriesXMax;
            this.control.startValue = this.control.seriesXMin = control.seriesXMin;
            this.control.rangeNavigatorControl = this.rootControl.rangeNavigator;
            if (this.control.rangeNavigatorControl) {
                this.control.rangeSlider = this.rootControl.rangeNavigator.rangeSlider;
            }
        }
        this.control.element = control.element;
        this.control.disableRangeSelector = control.disableRangeSelector;
    };
    /**
     *  To initialize the period selector properties
     */
    PeriodSelector.prototype.appendSelector = function (options, x) {
        if (x === void 0) { x = 0; }
        this.renderSelectorElement(null, options, x);
        this.renderSelector();
    };
    /**
     * renderSelector div
     * @param control
     */
    PeriodSelector.prototype.renderSelectorElement = function (control, options, x) {
        //render border
        this.periodSelectorSize = control ? this.periodSelectorSize : new sf.svgbase.Rect(x, this.rootControl.titleSize.height, options.width, options.height);
        var thumbSize;
        var element;
        if (control) {
            thumbSize = control.themeStyle.thumbWidth;
            element = control.element;
        }
        else {
            thumbSize = options.thumbSize;
            element = options.element;
        }
        if (getElement(element.id + '_Secondary_Element')) {
            sf.base.remove(getElement(element.id + '_Secondary_Element'));
        }
        this.periodSelectorDiv = sf.base.createElement('div', {
            id: element.id + '_Secondary_Element',
            styles: 'width: ' + (this.periodSelectorSize.width - thumbSize) + 'px;height: ' +
                this.periodSelectorSize.height + 'px;top:' +
                this.periodSelectorSize.y + 'px;left:' +
                (this.periodSelectorSize.x + thumbSize / 2) + 'px; position: absolute'
        });
        element.appendChild(this.periodSelectorDiv);
    };
    /**
     * renderSelector elements
     */
    // tslint:disable-next-line:max-func-body-length
    PeriodSelector.prototype.renderSelector = function () {
        var _this = this;
        this.setControlValues(this.rootControl);
        var enableCustom = true;
        var controlId = this.control.element.id;
        var selectorElement = sf.base.createElement('div', { id: controlId + '_selector' });
        this.periodSelectorDiv.appendChild(selectorElement);
        var buttons = this.control.periods;
        var selector = this.updateCustomElement();
        var buttonStyles = 'text-transform: none; text-overflow: unset';
        for (var i = 0; i < buttons.length; i++) {
            selector.push({ align: 'Left', text: buttons[i].text });
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            enableCustom = this.rootControl.enableCustomRange;
        }
        var selctorArgs;
        if (enableCustom) {
            this.calendarId = controlId + '_calendar';
            selector.push({ template: '<button id=' + this.calendarId + '></button>', align: 'Right' });
        }
        selctorArgs = {
            selector: selector, name: 'RangeSelector', cancel: false, enableCustomFormat: true, content: 'Date Range'
        };
        if (this.rootControl.getModuleName() === 'stockChart') {
            selector.push({ template: sf.base.createElement('button', { id: controlId + '_reset', innerHTML: 'Reset',
                    styles: buttonStyles, className: 'e-dropdown-btn e-btn' }),
                align: 'Right' });
            if (this.rootControl.exportType.indexOf('Print') > -1) {
                selector.push({ template: sf.base.createElement('button', { id: controlId + '_print', innerHTML: 'Print', styles: buttonStyles,
                        className: 'e-dropdown-btn e-btn' }),
                    align: 'Right' });
            }
            if (this.rootControl.exportType.length) {
                selector.push({ template: sf.base.createElement('button', { id: controlId + '_export', innerHTML: 'Export', styles: buttonStyles,
                        className: 'e-dropdown-btn e-btn' }),
                    align: 'Right' });
            }
        }
        this.rootControl.trigger('selectorRender', selctorArgs);
        this.toolbar = new sf.navigations.Toolbar({
            items: selctorArgs.selector, height: this.periodSelectorSize.height,
            clicked: function (args) {
                _this.buttonClick(args, _this.control);
            }, created: function () {
                _this.nodes = _this.toolbar.element.querySelectorAll('.e-toolbar-left')[0];
                if (sf.base.isNullOrUndefined(_this.selectedIndex)) {
                    buttons.map(function (period, index) {
                        if (period.selected) {
                            _this.control.startValue = _this.changedRange(period.intervalType, _this.control.endValue, period.interval).getTime();
                            _this.selectedIndex = (_this.nodes.childNodes.length - buttons.length) + index;
                        }
                    });
                }
                _this.setSelectedStyle(_this.selectedIndex);
            }
        });
        var isStringTemplate = 'isStringTemplate';
        var dateRangeId = controlId + 'customRange';
        this.toolbar[isStringTemplate] = true;
        this.toolbar.appendTo(selectorElement);
        this.triggerChange = true;
        if (enableCustom) {
            this.datePicker = new sf.calendars.DateRangePicker({
                min: new Date(this.control.seriesXMin),
                max: new Date(this.control.seriesXMax),
                format: 'dd\'\/\'MM\'\/\'yyyy', placeholder: 'Select a range',
                showClearButton: false, startDate: new Date(this.control.startValue),
                endDate: new Date(this.control.endValue),
                created: function (args) {
                    if (selctorArgs.enableCustomFormat) {
                        var datePicker = document.getElementsByClassName('e-date-range-wrapper');
                        var datePickerElement = void 0;
                        for (var i = 0; i < datePicker.length; i++) {
                            if (datePicker[i].children[0].id.indexOf(controlId) !== -1) {
                                datePickerElement = datePicker[i];
                            }
                        }
                        datePickerElement.style.display = 'none';
                        datePickerElement.insertAdjacentElement('afterend', sf.base.createElement('div', {
                            id: dateRangeId,
                            innerHTML: selctorArgs.content, className: 'e-btn e-dropdown-btn',
                            styles: 'font-family: "Segoe UI"; font-size: 14px; font-weight: 500; text-transform: none '
                        }));
                        getElement(dateRangeId).insertAdjacentElement('afterbegin', (sf.base.createElement('span', {
                            id: controlId + 'dateIcon', className: 'e-input-group-icon e-range-icon e-btn-icon e-icons',
                            styles: 'font-size: 16px; min-height: 0px; margin: -3px 0 0 0; outline: none; min-width: 30px'
                            // fix for date range icon alignment issue.
                        })));
                        document.getElementById(dateRangeId).onclick = function () {
                            _this.datePicker.show(getElement(dateRangeId));
                        };
                    }
                },
                change: function (args) {
                    if (_this.triggerChange) {
                        if (_this.control.rangeSlider && args.event) {
                            _this.control.rangeSlider.performAnimation(args.startDate.getTime(), args.endDate.getTime(), _this.control.rangeNavigatorControl);
                        }
                        else if (args.event) {
                            _this.rootControl.rangeChanged(args.startDate.getTime(), args.endDate.getTime());
                        }
                        _this.nodes = _this.toolbar.element.querySelectorAll('.e-toolbar-left')[0];
                        if (!_this.rootControl.resizeTo && _this.control.rangeSlider && _this.control.rangeSlider.isDrag) {
                            /**
                             * Issue: While disabling range navigator console error throws
                             * Fix:Check with rangeSlider present or not. Then checked with isDrag.
                             */
                            for (var i = 0, length_1 = _this.nodes.childNodes.length; i < length_1; i++) {
                                _this.nodes.childNodes[i].childNodes[0].classList.remove('e-active');
                                _this.nodes.childNodes[i].childNodes[0].classList.remove('e-active');
                            }
                        }
                    }
                }
            });
            this.datePicker.appendTo('#' + this.calendarId);
        }
    };
    PeriodSelector.prototype.updateCustomElement = function () {
        var selector = [];
        var controlId = this.rootControl.element.id;
        var buttonStyles = 'text-transform: none; text-overflow: unset';
        if (this.rootControl.getModuleName() === 'stockChart') {
            if (this.rootControl.seriesType.length) {
                selector.push({ template: sf.base.createElement('button', { id: controlId + '_seriesType', innerHTML: 'Series',
                        styles: buttonStyles }),
                    align: 'Left' });
            }
            if (this.rootControl.indicatorType.length) {
                selector.push({ template: sf.base.createElement('button', { id: controlId + '_indicatorType', innerHTML: 'Indicators',
                        styles: buttonStyles }),
                    align: 'Left' });
            }
            if (this.rootControl.trendlineType.length) {
                selector.push({ template: sf.base.createElement('button', { id: controlId + '_trendType', innerHTML: 'Trendline',
                        styles: buttonStyles }),
                    align: 'Left' });
            }
        }
        return selector;
    };
    /**
     * To set and deselect the acrive style
     * @param buttons
     */
    PeriodSelector.prototype.setSelectedStyle = function (selectedIndex) {
        if (this.control.disableRangeSelector || this.rootControl.getModuleName() === 'stockChart') {
            for (var i = 0, length_2 = this.nodes.childNodes.length; i < length_2; i++) {
                this.nodes.childNodes[i].childNodes[0].classList.remove('e-active');
                this.nodes.childNodes[i].childNodes[0].classList.remove('e-active');
            }
            this.nodes.childNodes[selectedIndex].childNodes[0].classList.add('e-flat');
            this.nodes.childNodes[selectedIndex].childNodes[0].classList.add('e-active');
        }
    };
    /**
     * Button click handling
     */
    PeriodSelector.prototype.buttonClick = function (args, control) {
        var _this = this;
        var toolBarItems = this.toolbar.items;
        var clickedEle = args.item;
        var slider = this.control.rangeSlider;
        var updatedStart;
        var updatedEnd;
        var buttons = this.control.periods;
        var button = buttons.filter(function (btn) { return (btn.text === clickedEle.text); });
        buttons.map(function (period, index) {
            if (period.text === args.item.text) {
                _this.selectedIndex = (_this.nodes.childNodes.length - buttons.length) + index;
            }
        });
        if (args.item.text !== '') {
            this.setSelectedStyle(this.selectedIndex);
        }
        if (clickedEle.text.toLowerCase() === 'all') {
            updatedStart = control.seriesXMin;
            updatedEnd = control.seriesXMax;
            if (slider) {
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            }
            else {
                this.rootControl.rangeChanged(updatedStart, updatedEnd);
            }
        }
        else if (clickedEle.text.toLowerCase() === 'ytd') {
            if (slider) {
                updatedStart = new Date(new Date(slider.currentEnd).getFullYear().toString()).getTime();
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            }
            else {
                updatedStart = new Date(new Date(this.rootControl.currentEnd).getFullYear().toString()).getTime();
                updatedEnd = this.rootControl.currentEnd;
                this.rootControl.rangeChanged(updatedStart, updatedEnd);
            }
        }
        else if (clickedEle.text.toLowerCase() !== '') {
            if (slider) {
                updatedStart = this.changedRange(button[0].intervalType, slider.currentEnd, button[0].interval).getTime();
                updatedEnd = slider.currentEnd;
                slider.performAnimation(updatedStart, updatedEnd, this.control.rangeNavigatorControl);
            }
            else {
                updatedStart = this.changedRange(button[0].intervalType, this.rootControl.currentEnd, button[0].interval).getTime();
                updatedEnd = this.rootControl.currentEnd;
                this.rootControl.rangeChanged(updatedStart, updatedEnd);
            }
        }
        if (this.rootControl.getModuleName() === 'stockChart') {
            this.rootControl.zoomChange = false;
        }
        if (getElement(this.calendarId + '_popup') && !sf.base.Browser.isDevice) {
            var element = getElement(this.calendarId + '_popup');
            element.querySelectorAll('.e-range-header')[0].style.display = 'none';
        }
    };
    /**
     *
     * @param type updatedRange for selector
     * @param end
     * @param interval
     */
    PeriodSelector.prototype.changedRange = function (type, end, interval) {
        var result = new Date(end);
        switch (type) {
            case 'Quarter':
                result.setMonth(result.getMonth() - (3 * interval));
                break;
            case 'Months':
                result.setMonth(result.getMonth() - interval);
                break;
            case 'Weeks':
                result.setDate(result.getDate() - (interval * 7));
                break;
            case 'Days':
                result.setDate(result.getDate() - interval);
                break;
            case 'Hours':
                result.setHours(result.getHours() - interval);
                break;
            case 'Minutes':
                result.setMinutes(result.getMinutes() - interval);
                break;
            case 'Seconds':
                result.setSeconds(result.getSeconds() - interval);
                break;
            default:
                result.setFullYear(result.getFullYear() - interval);
                break;
        }
        return result;
    };
    
    /**
     * Get module name
     */
    PeriodSelector.prototype.getModuleName = function () {
        return 'PeriodSelector';
    };
    /**
     * To destroy the period selector.
     * @return {void}
     * @private
     */
    PeriodSelector.prototype.destroy = function () {
        /**
         * destroy method
         */
    };
    return PeriodSelector;
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
 * Range Navigator
 */
var RangeNavigator = /** @class */ (function (_super) {
    __extends(RangeNavigator, _super);
    /**
     * Constructor for creating the widget
     * @hidden
     */
    function RangeNavigator(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.animateSeries = true;
        _this.chartid = 57725;
        return _this;
    }
    /**
     * Starting point of the control initialization
     */
    RangeNavigator.prototype.preRender = function () {
        var blazor = 'Blazor';
        this.isBlazor = window[blazor];
        this.unWireEvents();
        this.setCulture();
        this.allowServerDataBinding = false;
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-rangenavigator').length;
            this.element.id = 'rangenavigator_' + this.chartid + '_' + collection;
        }
        this.wireEvents();
    };
    /**
     * To initialize the private variables
     */
    RangeNavigator.prototype.initPrivateVariables = function () {
        this.doubleModule = new Double();
        this.labels = [];
        this.rangeSlider = new RangeSlider(this);
        this.chartSeries = new RangeSeries(this);
        this.lineSeriesModule = new LineSeries();
        this.rangeAxis = new RangeNavigatorAxis(this);
    };
    /**
     * Method to set culture for chart
     */
    RangeNavigator.prototype.setCulture = function () {
        this.intl = new sf.base.Internationalization();
    };
    /**
     * to initialize the slider
     */
    RangeNavigator.prototype.setSliderValue = function () {
        var isDateTime = this.valueType === 'DateTime';
        var range = this.chartSeries.xAxis.actualRange;
        this.startValue = this.startValue ? this.startValue : (!this.value[0] ? range.min :
            (isDateTime ? (new Date(this.value[0].toString())).getTime() : +this.value[0]));
        this.endValue = this.endValue ? this.endValue : (!this.value[1] ? range.max :
            (isDateTime ? (new Date(this.value[1].toString())).getTime() : +this.value[1]));
    };
    /**
     * To render the range navigator
     */
    RangeNavigator.prototype.render = function () {
        var _this = this;
        var loadEventData = {
            name: 'load', rangeNavigator: this.isBlazor ? {} : this,
            theme: this.theme
        };
        this.trigger('load', loadEventData, function () {
            _this.theme = _this.isBlazor ? loadEventData.theme : _this.theme;
            _this.setTheme();
            _this.initPrivateVariables();
            _this.createRangeSvg();
            _this.calculateBounds();
            _this.chartSeries.renderChart(_this);
            removeElement('chartmeasuretext');
            _this.renderComplete();
            _this.allowServerDataBinding = true;
        });
    };
    /**
     * Theming for rangeNavigator
     */
    RangeNavigator.prototype.setTheme = function () {
        /*! Set theme */
        this.themeStyle = getRangeThemeColor(this.theme, this);
    };
    /**
     * Method to create SVG for Range Navigator
     */
    RangeNavigator.prototype.createRangeSvg = function () {
        this.removeSvg();
        createSvg(this);
        this.renderChartBackground();
    };
    /**
     * Bounds calculation for widget performed.
     */
    RangeNavigator.prototype.calculateBounds = function () {
        var labelPadding = this.enableGrouping ? 15 : 8;
        var thumb = this.navigatorStyleSettings.thumb;
        var labelSize = sf.svgbase.measureText('tempString', this.labelStyle).height;
        var margin = this.margin;
        var isLeightWeight = !this.series.length;
        var tooltipSpace = (!this.disableRangeSelector) &&
            isLeightWeight && this.tooltip.enable ? 35 : 0;
        if (this.isBlazor && !this.periodSelectorModule && this.periodSelectorSettings.periods.length && !this.stockChart) {
            this.periodSelectorModule = new PeriodSelector(this);
        }
        var selector = this.periodSelectorModule;
        if (this.periodSelectorModule && this.periodSelectorSettings.periods.length > 0) {
            selector.periodSelectorSize = { x: 0, y: 0, height: 0, width: 0 };
            selector.periodSelectorSize.width = this.availableSize.width;
            selector.periodSelectorSize.height = this.periodSelectorSettings.height;
            selector.periodSelectorSize.y = this.periodSelectorSettings.position === 'Bottom' ?
                this.availableSize.height - selector.periodSelectorSize.height : 0;
        }
        var periodSelectorY = this.periodSelectorSettings.position === 'Top' && selector ?
            selector.periodSelectorSize.y + selector.periodSelectorSize.height : 0;
        this.bounds = new sf.svgbase.Rect((this.themeStyle.thumbWidth / 2 + thumb.border.width + margin.left), margin.top + tooltipSpace + periodSelectorY, this.availableSize.width - this.themeStyle.thumbWidth - (thumb.border.width * 2) - margin.left - margin.right, this.availableSize.height - margin.top - margin.bottom - tooltipSpace - (selector ? selector.periodSelectorSize.height : 0));
        var deductHeight = ((this.labelPosition === 'Outside' || isLeightWeight) ?
            (labelSize + labelPadding) : 0) + ((this.tickPosition === 'Outside' || isLeightWeight) ?
            (this.majorTickLines.height) : 0);
        this.bounds.height -= deductHeight;
        if (isLeightWeight) {
            var height = this.enableGrouping ? this.bounds.height - ((labelSize) + labelPadding) : this.bounds.height;
            this.bounds.y += (this.themeStyle.thumbHeight > height ? (this.themeStyle.thumbHeight - height) / 2 : 0);
        }
        if (this.disableRangeSelector) {
            this.bounds.y = 0;
            this.bounds.height = this.periodSelectorSettings.height;
        }
    };
    /**
     * Creating Chart for range navigator
     */
    RangeNavigator.prototype.renderChart = function () {
        this.chartSeries.renderSeries(this);
        this.rangeAxis.renderGridLines();
        this.rangeAxis.renderAxisLabels();
        this.chartSeries.appendSeriesElements(this);
        this.createSecondaryElement();
        this.setSliderValue();
        this.renderPeriodSelector();
        this.renderSlider();
        if (!this.stockChart) {
            this.element.appendChild(this.svgObject);
        }
        this.trigger('loaded', { rangeNavigator: this.isBlazor ? {} : this });
        this.rangeSlider.setSlider(this.startValue, this.endValue, false, this.tooltip.enable && this.tooltip.displayMode === 'Always');
    };
    /**
     * To render period selector value
     */
    RangeNavigator.prototype.renderPeriodSelector = function () {
        if (this.periodSelectorModule) {
            this.periodSelectorModule.renderSelectorElement(this);
            this.periodSelectorModule.renderSelector();
        }
    };
    /**
     * Creating secondary range navigator
     */
    RangeNavigator.prototype.createSecondaryElement = function () {
        // For userInteraction
        if (this.tooltip.enable) {
            var tooltipDiv = this.createElement('div');
            tooltipDiv.id = this.element.id + '_Secondary_Element';
            tooltipDiv.setAttribute('style', 'position: relative');
            this.element.appendChild(tooltipDiv);
        }
    };
    /**
     * Slider Calculation ane rendering performed here
     */
    RangeNavigator.prototype.renderSlider = function () {
        this.rangeSlider.render(this);
        this.rangeSlider.setSlider(this.startValue, this.endValue, true, this.tooltip.enable && this.tooltip.displayMode === 'Always');
    };
    /**
     * To Remove the SVG.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.removeSvg = function () {
        if (getElement(this.element.id + '_Secondary_Element')) {
            sf.base.remove(getElement(this.element.id + '_Secondary_Element'));
            // tslint:disable-next-line:no-any
            if (this.isReact) {
                this.clearTemplate();
            }
        }
        var removeLength = 0;
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > removeLength) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode && !this.stockChart) {
                sf.base.remove(this.svgObject);
            }
        }
    };
    /** Wire, UnWire and Event releated calculation Started here */
    /**
     * Method to un-bind events for range navigator
     */
    RangeNavigator.prototype.unWireEvents = function () {
        /*! Find the Events type */
        var startEvent = sf.base.Browser.touchStartEvent;
        var moveEvent = sf.base.Browser.touchMoveEvent;
        var stopEvent = sf.base.Browser.touchEndEvent;
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        sf.base.EventHandler.remove(this.element, startEvent, this.rangeOnMouseDown);
        sf.base.EventHandler.remove(this.element, moveEvent, this.mouseMove);
        sf.base.EventHandler.remove(this.element, stopEvent, this.mouseEnd);
        sf.base.EventHandler.remove(this.element, 'click', this.rangeOnMouseClick);
        //EventHandler.remove(this.element, 'contextmenu', this.rangeRightClick);
        sf.base.EventHandler.remove(this.element, cancelEvent, this.mouseLeave);
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize);
    };
    /**
     * Method to bind events for range navigator
     */
    RangeNavigator.prototype.wireEvents = function () {
        /*! Find the Events type */
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchStartEvent, this.rangeOnMouseDown, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchMoveEvent, this.mouseMove, this);
        sf.base.EventHandler.add(this.element, sf.base.Browser.touchEndEvent, this.mouseEnd, this);
        sf.base.EventHandler.add(this.element, 'click', this.rangeOnMouseClick, this);
        //EventHandler.add(this.element, 'contextmenu', this.rangeRightClick, this);
        sf.base.EventHandler.add(this.element, cancelEvent, this.mouseLeave, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.rangeResize.bind(this));
        var element = this.element;
        element.style.touchAction = 'none';
        element.style.msTouchAction = 'none';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    };
    /**
     * Handles the widget resize.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.rangeResize = function (e) {
        var _this = this;
        // To avoid resize console error
        if (!document.getElementById(this.element.id)) {
            return false;
        }
        this.animateSeries = false;
        this.removeAllTooltip();
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        var arg = {
            rangeNavigator: this,
            name: 'resized',
            currentSize: new sf.svgbase.Size(0, 0),
            previousSize: new sf.svgbase.Size(this.availableSize.width, this.availableSize.height),
        };
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            _this.createRangeSvg();
            arg.currentSize = _this.availableSize;
            _this.trigger('resized', arg);
            _this.calculateBounds();
            _this.chartSeries.renderChart(_this);
        }, 500);
        return false;
    };
    /**
     * Bug task ID: EJ2-30797
     * while resizing tooltip shows in wrong position
     * Cause: Due to time lag in resize, tooltip did not remove until the component calculation
     * Fix: Removed the tooltip element on resize
     */
    RangeNavigator.prototype.removeAllTooltip = function () {
        if (this.tooltip.enable && this.tooltip.displayMode === 'Always') {
            if (getElement(this.element.id + '_leftTooltip')) {
                sf.base.remove(getElement(this.element.id + '_leftTooltip'));
            }
            if (getElement(this.element.id + '_rightTooltip')) {
                sf.base.remove(getElement(this.element.id + '_rightTooltip'));
            }
        }
    };
    /**
     * Handles the mouse move.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.mouseMove = function (e) {
        if (getElement(!this.stockChart ? this.element.id + '_svg' : this.element.id)) {
            this.mouseX = this.setMouseX(e);
            this.notify(sf.base.Browser.touchMoveEvent, e);
        }
        return false;
    };
    /**
     * Handles the mouse leave.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.mouseLeave = function (e) {
        var rangeSlider = this.rangeSlider;
        if (rangeSlider.isDrag) {
            rangeSlider.triggerEvent(this.chartSeries.xAxis.actualRange);
        }
        var cancelEvent = sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave';
        this.mouseX = this.setMouseX(e);
        this.notify(cancelEvent, e);
        return false;
    };
    /**
     * Handles the mouse click on range navigator.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.rangeOnMouseClick = function (e) {
        this.notify('click', e);
        return false;
    };
    /**
     * Handles the print method for range navigator control.
     */
    RangeNavigator.prototype.print = function (id) {
        new ExportUtils(this).print(id);
    };
    /**
     * Handles the export method for range navigator control.
     * @param type
     * @param fileName
     */
    RangeNavigator.prototype.export = function (type, fileName, orientation, controls, width, height, isVertical) {
        controls = controls ? controls : [this];
        new ExportUtils(this).export(type, fileName, orientation, controls, width, height, isVertical);
    };
    /**
     * Creating a background element to the svg object
     */
    RangeNavigator.prototype.renderChartBackground = function () {
        var rect = new RectOption(this.element.id + '_ChartBorder', this.themeStyle.background, { width: 0, color: 'transparent' }, 1, new sf.svgbase.Rect(0, 0, this.availableSize.width, this.availableSize.height));
        this.svgObject.appendChild(this.renderer.drawRectangle(rect));
    };
    /**
     * Handles the mouse down on range navigator.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.rangeOnMouseDown = function (e) {
        this.mouseDownX = this.setMouseX(e);
        this.notify(sf.base.Browser.touchStartEvent, e);
        return false;
    };
    /**
     * Handles the mouse up.
     * @return {boolean}
     * @private
     */
    RangeNavigator.prototype.mouseEnd = function (e) {
        this.mouseX = this.setMouseX(e);
        this.notify(sf.base.Browser.touchEndEvent, e);
        return false;
    };
    // private rangeRightClick(event: MouseEvent | PointerEvent): boolean {
    //     if (event.buttons === 2 || event.which === 0 || (<PointerEvent>event).pointerType === 'touch') {
    //         event.preventDefault();
    //         event.stopPropagation();
    //         return false;
    //     }
    //     return true;
    // }
    /**
     * To find mouse x, y for aligned range navigator element svg position
     */
    RangeNavigator.prototype.setMouseX = function (e) {
        var pageX = e.type.indexOf('touch') > -1 ?
            e.changedTouches[0].clientX : e.clientX;
        var rect = this.element.getBoundingClientRect();
        var svgRect = !this.stockChart ? getElement(this.element.id + '_svg').getBoundingClientRect() :
            getElement(this.element.id).getBoundingClientRect();
        return (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    /** Wire, UnWire and Event releated calculation End here */
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    RangeNavigator.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * OnProperty change method calling here
     * @param newProp
     * @param oldProp
     */
    RangeNavigator.prototype.onPropertyChanged = function (newProp, oldProp) {
        var renderer = false;
        var refreshBounds = false;
        var refreshRange = false;
        this.animateSeries = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                case 'height':
                case 'navigatorBorder':
                case 'enableGrouping':
                case 'labelPosition':
                case 'tickPosition':
                case 'labelStyle':
                    refreshBounds = true;
                    break;
                case 'enableRtl':
                case 'xName':
                case 'yName':
                case 'query':
                case 'minimum':
                case 'maximum':
                case 'interval':
                case 'intervalType':
                case 'logBase':
                case 'valueType':
                case 'majorGridLines':
                case 'minorGridLines':
                case 'navigatorStyleSettings':
                case 'labelFormat':
                case 'skeleton':
                case 'skeletonType':
                case 'secondaryLabelAlignment':
                    renderer = true;
                    break;
                case 'dataSource':
                case 'series':
                    renderer = true;
                    refreshBounds = true;
                    break;
                case 'theme':
                    this.animateSeries = true;
                    break;
                case 'locale':
                    _super.prototype.refresh.call(this);
                    break;
                case 'value':
                    this.startValue = null;
                    this.endValue = null;
                    refreshRange = true;
                    break;
            }
        }
        if (!refreshBounds && renderer) {
            this.removeSvg();
            this.chartSeries.xMin = Infinity;
            this.chartSeries.xMax = -Infinity;
            this.chartSeries.renderChart(this);
        }
        // issue fix for Range Navigator size gets reduced when the data source is refreshed
        if (refreshBounds && renderer) {
            this.removeSvg();
            this.chartSeries.xMin = this.chartSeries.yMin = Infinity;
            this.chartSeries.xMax = this.chartSeries.yMax = -Infinity;
            this.calculateBounds();
            this.chartSeries.renderChart(this);
        }
        if (refreshBounds && !renderer) {
            this.removeSvg();
            this.calculateBounds();
            this.chartSeries.renderChart(this);
        }
        if (!refreshBounds && !renderer && refreshRange) {
            this.setSliderValue();
            this.rangeSlider.setSlider(this.startValue, this.endValue, true, this.tooltip.enable && this.tooltip.displayMode === 'Always');
        }
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    RangeNavigator.prototype.requiredModules = function () {
        var _this = this;
        var modules = [];
        this.series.map(function (series) {
            modules.push({
                member: series.type + 'Series',
                args: [_this]
            });
        });
        if (this.periodSelectorSettings.periods.length > 0) {
            modules.push({
                member: 'PeriodSelector',
                args: [this]
            });
        }
        if (this.valueType !== 'Double') {
            modules.push({
                member: this.valueType,
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'RangeTooltip',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To get the module name of the widget
     */
    RangeNavigator.prototype.getModuleName = function () {
        return 'rangeNavigator';
    };
    /**
     * To destroy the widget
     * @method destroy
     * @return {void}.
     * @member of rangeNavigator
     */
    RangeNavigator.prototype.destroy = function () {
        this.unWireEvents();
        // tslint:disable-next-line:no-any
        if (this.isReact) {
            this.clearTemplate();
        }
        this.rangeSlider.destroy();
        _super.prototype.destroy.call(this);
        this.element.innerHTML = '';
        this.element.classList.remove('e-rangenavigator');
    };
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "height", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "xName", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "yName", void 0);
    __decorate([
        sf.base.Property()
    ], RangeNavigator.prototype, "query", void 0);
    __decorate([
        sf.base.Collection([], RangeNavigatorSeries)
    ], RangeNavigator.prototype, "series", void 0);
    __decorate([
        sf.base.Complex({}, RangeTooltipSettings)
    ], RangeNavigator.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "minimum", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "maximum", void 0);
    __decorate([
        sf.base.Property(null)
    ], RangeNavigator.prototype, "interval", void 0);
    __decorate([
        sf.base.Property('Auto')
    ], RangeNavigator.prototype, "intervalType", void 0);
    __decorate([
        sf.base.Property('Hide')
    ], RangeNavigator.prototype, "labelIntersectAction", void 0);
    __decorate([
        sf.base.Property(10)
    ], RangeNavigator.prototype, "logBase", void 0);
    __decorate([
        sf.base.Property('Double')
    ], RangeNavigator.prototype, "valueType", void 0);
    __decorate([
        sf.base.Property('Outside')
    ], RangeNavigator.prototype, "labelPosition", void 0);
    __decorate([
        sf.base.Property(500)
    ], RangeNavigator.prototype, "animationDuration", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "enableGrouping", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "enableDeferredUpdate", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "disableRangeSelector", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "allowSnapping", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "allowIntervalData", void 0);
    __decorate([
        sf.base.Property(false)
    ], RangeNavigator.prototype, "useGroupingSeparator", void 0);
    __decorate([
        sf.base.Property()
    ], RangeNavigator.prototype, "groupBy", void 0);
    __decorate([
        sf.base.Property('Outside')
    ], RangeNavigator.prototype, "tickPosition", void 0);
    __decorate([
        sf.base.Complex(exports.RangeNavigatorTheme.axisLabelFont, Font)
    ], RangeNavigator.prototype, "labelStyle", void 0);
    __decorate([
        sf.base.Complex({}, MajorGridLines)
    ], RangeNavigator.prototype, "majorGridLines", void 0);
    __decorate([
        sf.base.Complex({}, MajorTickLines)
    ], RangeNavigator.prototype, "majorTickLines", void 0);
    __decorate([
        sf.base.Complex({}, StyleSettings)
    ], RangeNavigator.prototype, "navigatorStyleSettings", void 0);
    __decorate([
        sf.base.Complex({}, PeriodSelectorSettings)
    ], RangeNavigator.prototype, "periodSelectorSettings", void 0);
    __decorate([
        sf.base.Complex({ color: '#DDDDDD', width: 1 }, Border)
    ], RangeNavigator.prototype, "navigatorBorder", void 0);
    __decorate([
        sf.base.Property('Material')
    ], RangeNavigator.prototype, "theme", void 0);
    __decorate([
        sf.base.Property([])
    ], RangeNavigator.prototype, "value", void 0);
    __decorate([
        sf.base.Property('')
    ], RangeNavigator.prototype, "labelFormat", void 0);
    __decorate([
        sf.base.Property('')
    ], RangeNavigator.prototype, "skeleton", void 0);
    __decorate([
        sf.base.Property('DateTime')
    ], RangeNavigator.prototype, "skeletonType", void 0);
    __decorate([
        sf.base.Property('Middle')
    ], RangeNavigator.prototype, "secondaryLabelAlignment", void 0);
    __decorate([
        sf.base.Complex({ top: 5, bottom: 5, right: 5, left: 5 }, Margin)
    ], RangeNavigator.prototype, "margin", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "load", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "loaded", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "resized", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "labelRender", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "changed", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "tooltipRender", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "selectorRender", void 0);
    __decorate([
        sf.base.Event()
    ], RangeNavigator.prototype, "beforePrint", void 0);
    RangeNavigator = __decorate([
        sf.base.NotifyPropertyChanges
    ], RangeNavigator);
    return RangeNavigator;
}(sf.base.Component));

/**
 * `Tooltip` module is used to render the tooltip for chart series.
 */
var RangeTooltip = /** @class */ (function () {
    /**
     * Constructor for tooltip module.
     * @private.
     */
    function RangeTooltip(range) {
        this.control = range;
        this.elementId = range.element.id;
    }
    /**
     * Left tooltip method called here
     * @param rangeSlider
     */
    RangeTooltip.prototype.renderLeftTooltip = function (rangeSlider) {
        this.fadeOutTooltip();
        var content = this.getTooltipContent(rangeSlider.currentStart);
        var contentWidth = this.getContentSize(content);
        var rect = this.control.enableRtl ? rangeSlider.rightRect : rangeSlider.leftRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
        }
        this.leftTooltip = this.renderTooltip(rect, this.createElement('_leftTooltip'), rangeSlider.startX, content);
    };
    /**
     * get the content size
     * @param value
     */
    RangeTooltip.prototype.getContentSize = function (value) {
        var width;
        var font = this.control.tooltip.textStyle;
        if (this.control.tooltip.template) {
            width = createTemplate(sf.base.createElement('div', {
                id: 'measureElement',
                styles: 'position: absolute;'
            }), 0, this.control.tooltip.template, this.control).getBoundingClientRect().width;
        }
        else {
            // 20 for tooltip padding
            width = sf.svgbase.measureText(value[0], font).width + 20;
        }
        return width;
    };
    /**
     * Right tooltip method called here
     * @param rangeSlider
     */
    RangeTooltip.prototype.renderRightTooltip = function (rangeSlider) {
        this.fadeOutTooltip();
        var content = this.getTooltipContent(rangeSlider.currentEnd);
        var contentWidth = this.getContentSize(content);
        var rect = this.control.enableRtl ? rangeSlider.leftRect : rangeSlider.rightRect;
        if (contentWidth > rect.width) {
            rect = rangeSlider.midRect;
            rect.x = !this.control.series.length ? rect.x : 0;
        }
        this.rightTooltip = this.renderTooltip(rect, this.createElement('_rightTooltip'), rangeSlider.endX, content);
    };
    /**
     * Tooltip element creation
     * @param id
     */
    RangeTooltip.prototype.createElement = function (id) {
        if (getElement(this.elementId + id)) {
            return getElement(this.elementId + id);
        }
        else {
            var element = document.createElement('div');
            element.id = this.elementId + id;
            element.className = 'ejSVGTooltip';
            element.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
            if (!this.control.stockChart) {
                getElement(this.elementId + '_Secondary_Element').appendChild(element);
            }
            else {
                var stockChart = this.control.stockChart;
                getElement(stockChart.element.id + '_Secondary_Element').appendChild(element);
                element.style.transform = 'translateY(' + (((stockChart.availableSize.height - stockChart.toolbarHeight - 80) +
                    stockChart.toolbarHeight) + stockChart.titleSize.height) + 'px)';
            }
            return element;
        }
    };
    /**
     * Tooltip render called here
     * @param bounds
     * @param parent
     * @param pointX
     * @param value
     */
    RangeTooltip.prototype.renderTooltip = function (bounds, parent, pointX, content) {
        var control = this.control;
        var tooltip = control.tooltip;
        var argsData = {
            cancel: false, name: 'tooltipRender', text: content,
            textStyle: tooltip.textStyle
        };
        this.control.trigger('tooltipRender', argsData);
        var left = control.svgObject.getBoundingClientRect().left -
            control.element.getBoundingClientRect().left;
        if (!argsData.cancel) {
            return new sf.svgbase.Tooltip({
                location: { x: pointX, y: control.rangeSlider.sliderY },
                content: argsData.text, marginX: 2,
                enableShadow: false,
                marginY: 2, arrowPadding: 8, rx: 0, ry: 0,
                inverted: control.series.length > 0,
                areaBounds: bounds, fill: tooltip.fill,
                theme: this.control.theme,
                //enableShadow: false,
                clipBounds: { x: left },
                border: tooltip.border, opacity: tooltip.opacity,
                template: tooltip.template,
                textStyle: argsData.textStyle,
                availableSize: control.availableSize,
                data: {
                    'start': this.getTooltipContent(this.control.startValue)[0],
                    'end': this.getTooltipContent(this.control.endValue)[0],
                    'value': content[0]
                }
            }, parent);
        }
        else {
            return null;
        }
    };
    /**
     * Tooltip content processed here
     * @param value
     */
    RangeTooltip.prototype.getTooltipContent = function (value) {
        var control = this.control;
        var tooltip = control.tooltip;
        var xAxis = control.chartSeries.xAxis;
        var text;
        var format = tooltip.format || xAxis.labelFormat;
        var isCustom = format.match('{value}') !== null;
        var valueType = xAxis.valueType;
        if (valueType === 'DateTime') {
            text = (control.intl.getDateFormat({
                format: format || 'MM/dd/yyyy',
                type: firstToLowerCase(control.skeletonType),
                skeleton: control.dateTimeModule.getSkeleton(xAxis, null, null, control.isBlazor)
            }))(new Date(value));
        }
        else {
            xAxis.format = control.intl.getNumberFormat({
                format: isCustom ? '' : format,
                useGrouping: control.useGroupingSeparator
            });
            text = control.doubleModule.formatValue(xAxis, isCustom, format, valueType === 'Logarithmic' ? Math.pow(xAxis.logBase, value) : value);
        }
        return [text];
    };
    /**
     * Fadeout animation performed here
     */
    RangeTooltip.prototype.fadeOutTooltip = function () {
        var _this = this;
        var tooltip = this.control.tooltip;
        if (tooltip.displayMode === 'OnDemand') {
            stopTimer(this.toolTipInterval);
            if (this.rightTooltip) {
                this.toolTipInterval = setTimeout(function () {
                    _this.leftTooltip.fadeOut();
                    _this.rightTooltip.fadeOut();
                }, 1000);
            }
        }
    };
    /**
     * Get module name.
     */
    RangeTooltip.prototype.getModuleName = function () {
        return 'RangeTooltip';
    };
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    RangeTooltip.prototype.destroy = function (chart) {
        // Destroy method called here
    };
    return RangeTooltip;
}());

/**
 * Range Navigator component export methods
 */

RangeNavigator.Inject(RangeTooltip);
RangeNavigator.Inject(sf.charts.DateTime,sf.charts.AreaSeries,sf.charts.StepLineSeries,sf.charts.Logarithmic);

exports.RangeNavigator = RangeNavigator;
exports.rangeValueToCoefficient = rangeValueToCoefficient;
exports.getXLocation = getXLocation;
exports.getRangeValueXByPoint = getRangeValueXByPoint;
exports.getExactData = getExactData;
exports.getNearestValue = getNearestValue;
exports.DataPoint = DataPoint;
exports.getRangeThemeColor = getRangeThemeColor;
exports.RangeNavigatorAxis = RangeNavigatorAxis;
exports.RangeSeries = RangeSeries;
exports.RangeSlider = RangeSlider;
exports.RangeNavigatorSeries = RangeNavigatorSeries;
exports.ThumbSettings = ThumbSettings;
exports.StyleSettings = StyleSettings;
exports.RangeTooltipSettings = RangeTooltipSettings;
exports.RangeTooltip = RangeTooltip;

return exports;

});

    sf.charts = sf.base.extend({}, sf.charts, sfrangenavigator({}));