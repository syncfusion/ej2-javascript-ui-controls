window.sf = window.sf || {};
var sfaccumulationchart = (function (exports) {
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
function getThemeColor(theme) {
    var style;
    var darkBackground = theme === 'MaterialDark' ? '#303030' : (theme === 'FabricDark' ? '#201F1F' : '1A1A1A');
    switch (theme) {
        case 'HighContrastLight':
        case 'Highcontrast':
        case 'HighContrast':
            style = {
                axisLabel: '#ffffff',
                axisTitle: '#ffffff',
                axisLine: '#ffffff',
                majorGridLine: '#BFBFBF',
                minorGridLine: '#969696',
                majorTickLine: '#BFBFBF',
                minorTickLine: '#969696',
                chartTitle: '#ffffff',
                legendLabel: '#ffffff',
                background: '#000000',
                areaBorder: '#ffffff',
                errorBar: '#ffffff',
                crosshairLine: '#ffffff',
                crosshairFill: '#ffffff',
                crosshairLabel: '#000000',
                tooltipFill: '#ffffff',
                tooltipBoldLabel: '#000000',
                tooltipLightLabel: '#000000',
                tooltipHeaderLine: '#969696',
                markerShadow: '#BFBFBF',
                selectionRectFill: 'rgba(255, 217, 57, 0.3)',
                selectionRectStroke: '#ffffff',
                selectionCircleStroke: '#FFD939'
            };
            break;
        case 'MaterialDark':
        case 'FabricDark':
        case 'BootstrapDark':
            style = {
                axisLabel: '#DADADA', axisTitle: '#ffffff',
                axisLine: ' #6F6C6C',
                majorGridLine: '#414040',
                minorGridLine: '#514F4F',
                majorTickLine: '#414040',
                minorTickLine: ' #4A4848',
                chartTitle: '#ffffff',
                legendLabel: '#DADADA',
                background: darkBackground,
                areaBorder: ' #9A9A9A',
                errorBar: '#ffffff',
                crosshairLine: '#F4F4F4',
                crosshairFill: '#F4F4F4',
                crosshairLabel: '#282727',
                tooltipFill: '#F4F4F4',
                tooltipBoldLabel: '#282727',
                tooltipLightLabel: '#333232',
                tooltipHeaderLine: '#9A9A9A',
                markerShadow: null,
                selectionRectFill: 'rgba(56,169,255, 0.1)',
                selectionRectStroke: '#38A9FF',
                selectionCircleStroke: '#282727'
            };
            break;
        case 'Bootstrap4':
            style = {
                axisLabel: '#212529', axisTitle: '#ffffff', axisLine: '#CED4DA', majorGridLine: '#CED4DA',
                minorGridLine: '#DEE2E6', majorTickLine: '#ADB5BD', minorTickLine: '#CED4DA', chartTitle: '#212529', legendLabel: '#212529',
                background: '#FFFFFF', areaBorder: '#DEE2E6', errorBar: '#000000', crosshairLine: '#6C757D', crosshairFill: '#495057',
                crosshairLabel: '#FFFFFF', tooltipFill: 'rgba(0, 0, 0, 0.9)', tooltipBoldLabel: 'rgba(255,255,255)',
                tooltipLightLabel: 'rgba(255,255,255, 0.9)', tooltipHeaderLine: 'rgba(255,255,255, 0.2)', markerShadow: null,
                selectionRectFill: 'rgba(255,255,255, 0.1)', selectionRectStroke: 'rgba(0, 123, 255)', selectionCircleStroke: '#495057'
            };
            break;
        default:
            style = {
                axisLabel: '#686868',
                axisTitle: '#424242',
                axisLine: '#b5b5b5',
                majorGridLine: '#dbdbdb',
                minorGridLine: '#eaeaea',
                majorTickLine: '#b5b5b5',
                minorTickLine: '#d6d6d6',
                chartTitle: '#424242',
                legendLabel: '#353535',
                background: '#FFFFFF',
                areaBorder: 'Gray',
                errorBar: '#000000',
                crosshairLine: '#4f4f4f',
                crosshairFill: '#4f4f4f',
                crosshairLabel: '#e5e5e5',
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff',
                markerShadow: null,
                selectionRectFill: 'rgba(41, 171, 226, 0.1)',
                selectionRectStroke: '#29abe2',
                selectionCircleStroke: '#29abe2'
            };
            break;
    }
    return style;
}
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
 * @private
 */
var Index = /** @class */ (function () {
    function Index(seriesIndex, pointIndex) {
        this.series = seriesIndex;
        this.point = pointIndex;
    }
    return Index;
}());
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
                axis.calculateVisibleRange(size);
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
var load = 'load';
/** @private */
var animationComplete = 'animationComplete';
/** @private */

/** @private */
var textRender = 'textRender';
/** @private */
var pointRender = 'pointRender';
/** @private */

/** @private */
var seriesRender = 'seriesRender';
/** @private */
var axisLabelRender = 'axisLabelRender';
/** @private */

/** @private */
var axisRangeCalculated = 'axisRangeCalculated';
/** @private */

/** @private */
var tooltipRender = 'tooltipRender';
/** @private */
var chartMouseMove = 'chartMouseMove';
/** @private */
var chartMouseClick = 'chartMouseClick';
/** @private */
var pointClick = 'pointClick';
/** @private */

/** @private */
var pointMove = 'pointMove';
/** @private */
var chartMouseLeave = 'chartMouseLeave';
/** @private */
var chartMouseDown = 'chartMouseDown';
/** @private */
var chartMouseUp = 'chartMouseUp';
/** @private */

/** @private */

/** @private */

/** @private */
var resized = 'resized';
/** @private */
var beforePrint = 'beforePrint';
/** @private */
var annotationRender = 'annotationRender';
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
var beforeExport = 'beforeExport';
/** @private */
var afterExport = 'afterExport';
/** @private */

/** @private */

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
 * Configures the Annotation for chart.
 */
var ChartAnnotationSettings = /** @class */ (function (_super) {
    __extends$5(ChartAnnotationSettings, _super);
    function ChartAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "x", void 0);
    __decorate$4([
        sf.base.Property('0')
    ], ChartAnnotationSettings.prototype, "y", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "content", void 0);
    __decorate$4([
        sf.base.Property('Center')
    ], ChartAnnotationSettings.prototype, "horizontalAlignment", void 0);
    __decorate$4([
        sf.base.Property('Pixel')
    ], ChartAnnotationSettings.prototype, "coordinateUnits", void 0);
    __decorate$4([
        sf.base.Property('Chart')
    ], ChartAnnotationSettings.prototype, "region", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], ChartAnnotationSettings.prototype, "verticalAlignment", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "xAxisName", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "yAxisName", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ChartAnnotationSettings.prototype, "description", void 0);
    return ChartAnnotationSettings;
}(sf.base.ChildProperty));
/**
 * label border properties.
 */
var LabelBorder = /** @class */ (function (_super) {
    __extends$5(LabelBorder, _super);
    function LabelBorder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('')
    ], LabelBorder.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], LabelBorder.prototype, "width", void 0);
    __decorate$4([
        sf.base.Property('Rectangle')
    ], LabelBorder.prototype, "type", void 0);
    return LabelBorder;
}(sf.base.ChildProperty));
/**
 * categories for multi level labels
 */
var MultiLevelCategories = /** @class */ (function (_super) {
    __extends$5(MultiLevelCategories, _super);
    function MultiLevelCategories() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "start", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "end", void 0);
    __decorate$4([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "maximumTextWidth", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], MultiLevelCategories.prototype, "customAttributes", void 0);
    __decorate$4([
        sf.base.Property('')
    ], MultiLevelCategories.prototype, "type", void 0);
    return MultiLevelCategories;
}(sf.base.ChildProperty));
/**
 * Strip line properties
 */
var StripLineSettings = /** @class */ (function (_super) {
    __extends$5(StripLineSettings, _super);
    function StripLineSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(true)
    ], StripLineSettings.prototype, "visible", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "startFromAxis", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "start", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "end", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "size", void 0);
    __decorate$4([
        sf.base.Property('#808080')
    ], StripLineSettings.prototype, "color", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "dashArray", void 0);
    __decorate$4([
        sf.base.Property('Auto')
    ], StripLineSettings.prototype, "sizeType", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isRepeat", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatEvery", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "repeatUntil", void 0);
    __decorate$4([
        sf.base.Property(false)
    ], StripLineSettings.prototype, "isSegmented", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentStart", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentEnd", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "segmentAxisName", void 0);
    __decorate$4([
        sf.base.Complex({ color: 'transparent', width: 1 }, Border)
    ], StripLineSettings.prototype, "border", void 0);
    __decorate$4([
        sf.base.Property('')
    ], StripLineSettings.prototype, "text", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], StripLineSettings.prototype, "rotation", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "horizontalAlignment", void 0);
    __decorate$4([
        sf.base.Property('Middle')
    ], StripLineSettings.prototype, "verticalAlignment", void 0);
    __decorate$4([
        sf.base.Complex(Theme.stripLineLabelFont, Font)
    ], StripLineSettings.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Property('Behind')
    ], StripLineSettings.prototype, "zIndex", void 0);
    __decorate$4([
        sf.base.Property(1)
    ], StripLineSettings.prototype, "opacity", void 0);
    return StripLineSettings;
}(sf.base.ChildProperty));
/**
 * MultiLevelLabels properties
 */
var MultiLevelLabels = /** @class */ (function (_super) {
    __extends$5(MultiLevelLabels, _super);
    function MultiLevelLabels() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property('Center')
    ], MultiLevelLabels.prototype, "alignment", void 0);
    __decorate$4([
        sf.base.Property('Wrap')
    ], MultiLevelLabels.prototype, "overflow", void 0);
    __decorate$4([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], MultiLevelLabels.prototype, "textStyle", void 0);
    __decorate$4([
        sf.base.Complex({ color: null, width: 1, type: 'Rectangle' }, LabelBorder)
    ], MultiLevelLabels.prototype, "border", void 0);
    __decorate$4([
        sf.base.Collection([], MultiLevelCategories)
    ], MultiLevelLabels.prototype, "categories", void 0);
    return MultiLevelLabels;
}(sf.base.ChildProperty));
/**
 * Specifies range for scrollbarSettings property
 * @public
 */
var ScrollbarSettingsRange = /** @class */ (function (_super) {
    __extends$5(ScrollbarSettingsRange, _super);
    function ScrollbarSettingsRange() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "minimum", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettingsRange.prototype, "maximum", void 0);
    return ScrollbarSettingsRange;
}(sf.base.ChildProperty));
/**
 * Scrollbar Settings Properties for Lazy Loading
 */
var ScrollbarSettings = /** @class */ (function (_super) {
    __extends$5(ScrollbarSettings, _super);
    function ScrollbarSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$4([
        sf.base.Property(false)
    ], ScrollbarSettings.prototype, "enable", void 0);
    __decorate$4([
        sf.base.Property(null)
    ], ScrollbarSettings.prototype, "pointsLength", void 0);
    __decorate$4([
        sf.base.Complex({}, ScrollbarSettingsRange)
    ], ScrollbarSettings.prototype, "range", void 0);
    return ScrollbarSettings;
}(sf.base.ChildProperty));

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
var axisPadding = 10;
/**
 * Configures the `rows` of the chart.
 */
var Row = /** @class */ (function (_super) {
    __extends$4(Row, _super);
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
    __decorate$3([
        sf.base.Property('100%')
    ], Row.prototype, "height", void 0);
    __decorate$3([
        sf.base.Complex({}, Border)
    ], Row.prototype, "border", void 0);
    return Row;
}(sf.base.ChildProperty));
/**
 * Configures the `columns` of the chart.
 */
var Column = /** @class */ (function (_super) {
    __extends$4(Column, _super);
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
    __decorate$3([
        sf.base.Property('100%')
    ], Column.prototype, "width", void 0);
    __decorate$3([
        sf.base.Complex({}, Border)
    ], Column.prototype, "border", void 0);
    return Column;
}(sf.base.ChildProperty));
/**
 * Configures the major grid lines in the `axis`.
 */
var MajorGridLines = /** @class */ (function (_super) {
    __extends$4(MajorGridLines, _super);
    function MajorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], MajorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MajorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MajorGridLines.prototype, "color", void 0);
    return MajorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor grid lines in the `axis`.
 */
var MinorGridLines = /** @class */ (function (_super) {
    __extends$4(MinorGridLines, _super);
    function MinorGridLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(0.7)
    ], MinorGridLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], MinorGridLines.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MinorGridLines.prototype, "color", void 0);
    return MinorGridLines;
}(sf.base.ChildProperty));
/**
 * Configures the axis line of a chart.
 */
var AxisLine = /** @class */ (function (_super) {
    __extends$4(AxisLine, _super);
    function AxisLine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], AxisLine.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property('')
    ], AxisLine.prototype, "dashArray", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], AxisLine.prototype, "color", void 0);
    return AxisLine;
}(sf.base.ChildProperty));
/**
 * Configures the major tick lines.
 */
var MajorTickLines = /** @class */ (function (_super) {
    __extends$4(MajorTickLines, _super);
    function MajorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(1)
    ], MajorTickLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], MajorTickLines.prototype, "height", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MajorTickLines.prototype, "color", void 0);
    return MajorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the minor tick lines.
 */
var MinorTickLines = /** @class */ (function (_super) {
    __extends$4(MinorTickLines, _super);
    function MinorTickLines() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(0.7)
    ], MinorTickLines.prototype, "width", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], MinorTickLines.prototype, "height", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], MinorTickLines.prototype, "color", void 0);
    return MinorTickLines;
}(sf.base.ChildProperty));
/**
 * Configures the crosshair ToolTip.
 */
var CrosshairTooltip = /** @class */ (function (_super) {
    __extends$4(CrosshairTooltip, _super);
    function CrosshairTooltip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$3([
        sf.base.Property(false)
    ], CrosshairTooltip.prototype, "enable", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], CrosshairTooltip.prototype, "fill", void 0);
    __decorate$3([
        sf.base.Complex(Theme.crosshairLabelFont, Font)
    ], CrosshairTooltip.prototype, "textStyle", void 0);
    return CrosshairTooltip;
}(sf.base.ChildProperty));
/**
 * Configures the axes in the chart.
 * @public
 */
var Axis = /** @class */ (function (_super) {
    __extends$4(Axis, _super);
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
        if (this.title) {
            titleSize = sf.svgbase.measureText(this.title, this.titleStyle).height + innerPadding;
        }
        if (this.labelPosition === 'Inside') {
            return titleSize + innerPadding;
        }
        var diff;
        var value;
        var labelSize = titleSize + innerPadding + axisPadding +
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
    Axis.prototype.calculateVisibleRange = function (size) {
        if (this.zoomFactor < 1 || this.zoomPosition > 0) {
            var baseRange = this.actualRange;
            var start = void 0;
            var end = void 0;
            if (!this.isInversed) {
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
    __decorate$3([
        sf.base.Complex(Theme.axisLabelFont, Font)
    ], Axis.prototype, "labelStyle", void 0);
    __decorate$3([
        sf.base.Complex({}, CrosshairTooltip)
    ], Axis.prototype, "crosshairTooltip", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "title", void 0);
    __decorate$3([
        sf.base.Complex(Theme.axisTitleFont, Font)
    ], Axis.prototype, "titleStyle", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "labelFormat", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "skeleton", void 0);
    __decorate$3([
        sf.base.Property('DateTime')
    ], Axis.prototype, "skeletonType", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "plotOffset", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetLeft", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetTop", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetRight", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "plotOffsetBottom", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "isIndexed", void 0);
    __decorate$3([
        sf.base.Property(10)
    ], Axis.prototype, "logBase", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "columnIndex", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "rowIndex", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], Axis.prototype, "span", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "desiredIntervals", void 0);
    __decorate$3([
        sf.base.Property(3)
    ], Axis.prototype, "maximumLabels", void 0);
    __decorate$3([
        sf.base.Property(1)
    ], Axis.prototype, "zoomFactor", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "zoomPosition", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "enableScrollbarOnZooming", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "opposedPosition", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "enableAutoIntervalOnZooming", void 0);
    __decorate$3([
        sf.base.Property('Auto')
    ], Axis.prototype, "rangePadding", void 0);
    __decorate$3([
        sf.base.Property('Double')
    ], Axis.prototype, "valueType", void 0);
    __decorate$3([
        sf.base.Property('None')
    ], Axis.prototype, "edgeLabelPlacement", void 0);
    __decorate$3([
        sf.base.Property('Auto')
    ], Axis.prototype, "intervalType", void 0);
    __decorate$3([
        sf.base.Property('BetweenTicks')
    ], Axis.prototype, "labelPlacement", void 0);
    __decorate$3([
        sf.base.Property('Outside')
    ], Axis.prototype, "tickPosition", void 0);
    __decorate$3([
        sf.base.Property('Outside')
    ], Axis.prototype, "labelPosition", void 0);
    __decorate$3([
        sf.base.Property('')
    ], Axis.prototype, "name", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "visible", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "minorTicksPerInterval", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "labelRotation", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "crossesAt", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "placeNextToAxisLine", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "crossesInAxis", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "minimum", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "maximum", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "interval", void 0);
    __decorate$3([
        sf.base.Property(34)
    ], Axis.prototype, "maximumLabelWidth", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "enableTrim", void 0);
    __decorate$3([
        sf.base.Property(5)
    ], Axis.prototype, "labelPadding", void 0);
    __decorate$3([
        sf.base.Complex({}, MajorTickLines)
    ], Axis.prototype, "majorTickLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MinorTickLines)
    ], Axis.prototype, "minorTickLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MajorGridLines)
    ], Axis.prototype, "majorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, MinorGridLines)
    ], Axis.prototype, "minorGridLines", void 0);
    __decorate$3([
        sf.base.Complex({}, AxisLine)
    ], Axis.prototype, "lineStyle", void 0);
    __decorate$3([
        sf.base.Property('Trim')
    ], Axis.prototype, "labelIntersectAction", void 0);
    __decorate$3([
        sf.base.Property(false)
    ], Axis.prototype, "isInversed", void 0);
    __decorate$3([
        sf.base.Property(100)
    ], Axis.prototype, "coefficient", void 0);
    __decorate$3([
        sf.base.Property(0)
    ], Axis.prototype, "startAngle", void 0);
    __decorate$3([
        sf.base.Property(true)
    ], Axis.prototype, "startFromZero", void 0);
    __decorate$3([
        sf.base.Property(null)
    ], Axis.prototype, "description", void 0);
    __decorate$3([
        sf.base.Property(2)
    ], Axis.prototype, "tabIndex", void 0);
    __decorate$3([
        sf.base.Collection([], StripLineSettings)
    ], Axis.prototype, "stripLines", void 0);
    __decorate$3([
        sf.base.Collection([], MultiLevelLabels)
    ], Axis.prototype, "multiLevelLabels", void 0);
    __decorate$3([
        sf.base.Complex({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    ], Axis.prototype, "border", void 0);
    __decorate$3([
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
function removeElement$1(id) {
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
function showTooltip(text, x, y, areaWidth, id, element, isTouch) {
    //let id1: string = 'EJ2_legend_tooltip';
    var tooltip = document.getElementById(id);
    var width = sf.svgbase.measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width + 5;
    x = (x + width > areaWidth) ? x - (width + 15) : x;
    if (!tooltip) {
        tooltip = sf.base.createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
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
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (isTouch) {
        setTimeout(function () { removeElement$1(id); }, 1500);
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
function subtractRect(rect, thickness) {
    rect.x += thickness.x;
    rect.y += thickness.y;
    rect.width -= thickness.x + thickness.width;
    rect.height -= thickness.y + thickness.height;
    return rect;
}
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
function getAngle(center, point) {
    var angle = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = angle < 0 ? (6.283 + angle) : angle;
    return angle * (180 / Math.PI);
}
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
function indexFinder(id, isPoint) {
    if (isPoint === void 0) { isPoint = false; }
    var ids = ['NaN', 'NaN'];
    if (id.indexOf('_Point_') > -1) {
        ids = id.split('_Series_')[1].split('_Point_');
    }
    else if (id.indexOf('_shape_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_shape_');
        ids[0] = '0';
    }
    else if (id.indexOf('_text_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_text_');
        ids[0] = '0';
    }
    return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
}
/** @private */

/** @private */

/** @private */

/** @private */

//Within bounds
/** @private */
function withInBounds(x, y, bounds, width, height) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = 0; }
    return (x >= bounds.x - width && x <= bounds.x + bounds.width + width && y >= bounds.y - height
        && y <= bounds.y + bounds.height + height);
}
/** @private */
function getValueXByPoint(value, size, axis) {
    var actualValue = !axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/** @private */
function getValueYByPoint(value, size, axis) {
    var actualValue = axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
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
        var elementData = templateFn ? templateFn(tempObject, null, null, dataLabelId ||
            childElement.id.replace(/[^a-zA-Z0-9]/g, '')) : [];
        if (elementData.length) {
            templateElement = Array.prototype.slice.call(elementData);
            var len = templateElement.length;
            for (var i = 0; i < len; i++) {
                childElement.appendChild(templateElement[i]);
            }
        }
    }
    catch (e) {
        return childElement;
    }
    return childElement;
}
/** @private */
function getFontStyle(font) {
    var style = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/** @private */
function measureElementRect(element, redraw) {
    if (redraw === void 0) { redraw = false; }
    var bounds;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    if (redraw) {
        sf.base.remove(element);
    }
    else {
        removeElement$1(element.id);
    }
    return bounds;
}
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
function appendElement(child, parent, redraw, animate, x, y) {
    if (redraw === void 0) { redraw = false; }
    if (animate === void 0) { animate = false; }
    if (x === void 0) { x = 'x'; }
    if (y === void 0) { y = 'y'; }
    if (child && child.hasChildNodes() && parent) {
        appendChildElement(false, parent, child, redraw, animate, x, y);
    }
    else {
        return null;
    }
}
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
function isOverlap(currentRect, rect) {
    return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
        currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
}
/** @private */
function containsRect(currentRect, rect) {
    return (currentRect.x <= rect.x && currentRect.x + currentRect.width >= rect.x + rect.width &&
        currentRect.y <= rect.y && currentRect.height + currentRect.y >= rect.y + rect.height);
}
/** @private */

/** @private */
function convertToHexCode(value) {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/** @private */
function componentToHex(value) {
    var hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
/** @private */
function convertHexToColor(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/** @private */
function colorNameToHex(color) {
    var element;
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(sf.base.createElement('text', { id: 'chartmeasuretext' }));
    element = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    sf.base.remove(element);
    var exp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    var isRGBValue = exp.exec(color);
    return convertToHexCode(new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10)));
}
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
    htmlObject = renderer.createText(renderOptions, text, seriesClipRect ? seriesClipRect.x : 0, seriesClipRect ? seriesClipRect.y : 0);
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
function blazorTemplatesReset(control) {
    for (var i = 0; i < control.annotations.length; i++) {
        sf.base.resetBlazorTemplate((control.element.id + '_Annotation_' + i).replace(/[^a-zA-Z0-9]/g, ''), 'ContentTemplate');
    }
    //This reset the tooltip templates
    sf.base.resetBlazorTemplate(control.element.id + '_tooltipparent_template' + '_blazorTemplate', 'Template');
    //Datalabel templates reset
    sf.base.resetBlazorTemplate(control.element.id + '_DataLabel');
}
/** @private */
var RectOption = /** @class */ (function (_super) {
    __extends$3(RectOption, _super);
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
var ImageOption = /** @class */ (function () {
    function ImageOption(height, width, href, x, y, id, visibility, preserveAspectRatio) {
        this.height = height;
        this.width = width;
        this.href = href;
        this.x = x;
        this.y = y;
        this.id = id;
        this.visibility = visibility;
        this.preserveAspectRatio = preserveAspectRatio;
    }
    return ImageOption;
}());
/** @private */
var CircleOption = /** @class */ (function (_super) {
    __extends$3(CircleOption, _super);
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
/** @private */
var ColorValue = /** @class */ (function () {
    function ColorValue(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return ColorValue;
}());
/** @private */
var PointData = /** @class */ (function () {
    function PointData(point, series, index) {
        if (index === void 0) { index = 0; }
        this.point = point;
        this.series = series;
        this.lierIndex = index;
    }
    return PointData;
}());
/** @private */
var AccPointData = /** @class */ (function () {
    function AccPointData(point, series, index) {
        if (index === void 0) { index = 0; }
        this.point = point;
        this.series = series;
    }
    return AccPointData;
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
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * AccumulationChart base file
 */
/**
 * Annotation for accumulation series
 */
var AccumulationAnnotationSettings = /** @class */ (function (_super) {
    __extends$2(AccumulationAnnotationSettings, _super);
    function AccumulationAnnotationSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationAnnotationSettings.prototype, "content", void 0);
    __decorate$2([
        sf.base.Property('0')
    ], AccumulationAnnotationSettings.prototype, "x", void 0);
    __decorate$2([
        sf.base.Property('0')
    ], AccumulationAnnotationSettings.prototype, "y", void 0);
    __decorate$2([
        sf.base.Property('Pixel')
    ], AccumulationAnnotationSettings.prototype, "coordinateUnits", void 0);
    __decorate$2([
        sf.base.Property('Chart')
    ], AccumulationAnnotationSettings.prototype, "region", void 0);
    __decorate$2([
        sf.base.Property('Middle')
    ], AccumulationAnnotationSettings.prototype, "verticalAlignment", void 0);
    __decorate$2([
        sf.base.Property('Center')
    ], AccumulationAnnotationSettings.prototype, "horizontalAlignment", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationAnnotationSettings.prototype, "description", void 0);
    return AccumulationAnnotationSettings;
}(sf.base.ChildProperty));
/**
 * Configures the dataLabel in accumulation chart.
 */
var AccumulationDataLabelSettings = /** @class */ (function (_super) {
    __extends$2(AccumulationDataLabelSettings, _super);
    function AccumulationDataLabelSettings() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property(false)
    ], AccumulationDataLabelSettings.prototype, "visible", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], AccumulationDataLabelSettings.prototype, "showZero", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationDataLabelSettings.prototype, "name", void 0);
    __decorate$2([
        sf.base.Property('transparent')
    ], AccumulationDataLabelSettings.prototype, "fill", void 0);
    __decorate$2([
        sf.base.Property('Inside')
    ], AccumulationDataLabelSettings.prototype, "position", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], AccumulationDataLabelSettings.prototype, "rx", void 0);
    __decorate$2([
        sf.base.Property(5)
    ], AccumulationDataLabelSettings.prototype, "ry", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], AccumulationDataLabelSettings.prototype, "angle", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], AccumulationDataLabelSettings.prototype, "enableRotation", void 0);
    __decorate$2([
        sf.base.Complex({ width: null, color: null }, Border)
    ], AccumulationDataLabelSettings.prototype, "border", void 0);
    __decorate$2([
        sf.base.Complex({ size: '11px', color: '', fontStyle: 'Normal', fontWeight: 'Normal', fontFamily: 'Segoe UI' }, Font)
    ], AccumulationDataLabelSettings.prototype, "font", void 0);
    __decorate$2([
        sf.base.Complex({}, Connector)
    ], AccumulationDataLabelSettings.prototype, "connectorStyle", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationDataLabelSettings.prototype, "template", void 0);
    return AccumulationDataLabelSettings;
}(sf.base.ChildProperty));
/**
 * Center value of the Pie series.
 */
var PieCenter = /** @class */ (function (_super) {
    __extends$2(PieCenter, _super);
    function PieCenter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate$2([
        sf.base.Property('50%')
    ], PieCenter.prototype, "x", void 0);
    __decorate$2([
        sf.base.Property('50%')
    ], PieCenter.prototype, "y", void 0);
    return PieCenter;
}(sf.base.ChildProperty));
/**
 * Points model for the series.
 * @public
 */
var AccPoints = /** @class */ (function () {
    function AccPoints() {
        /** accumulation point visibility */
        this.visible = true;
        /** accumulation point symbol location */
        this.symbolLocation = null;
        /** @private */
        this.region = null;
        /** @private */
        this.labelRegion = null;
        /** @private */
        this.labelVisible = true;
        this.regions = null;
        /** @private */
        this.isExplode = false;
        /** @private */
        this.isClubbed = false;
        /** @private */
        this.isSliced = false;
        /** @private  */
        this.argsData = null;
        /** @private */
        this.isLabelUpdated = null;
        /** @private */
        this.initialLabelRegion = null;
    }
    return AccPoints;
}());
/**
 *  Configures the series in accumulation chart.
 */
var AccumulationSeries = /** @class */ (function (_super) {
    __extends$2(AccumulationSeries, _super);
    function AccumulationSeries() {
        /**
         * Specifies the dataSource for the series. It can be an array of JSON objects or an instance of DataManager.
         * ```html
         * <div id='Pie'></div>
         * ```
         * ```typescript
         * let dataManager: DataManager = new DataManager({
         *         url: 'http://mvc.syncfusion.com/Services/Northwnd.svc/Tasks/'
         * });
         * let query: Query = new Query().take(50).where('Estimate', 'greaterThan', 0, false);
         * let pie: AccumulationChart = new AccumulationChart({
         * ...
         *     series: [{
         *        dataSource: dataManager,
         *        xName: 'Id',
         *        yName: 'Estimate',
         *        query: query
         *    }],
         * ...
         * });
         * pie.appendTo('#Pie');
         * ```
         * @default ''
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @private */
        _this.points = [];
        /** @private */
        _this.clubbedPoints = [];
        /** @private */
        _this.sumOfPoints = 0;
        /** @private */
        _this.isRectSeries = true;
        /** @private */
        _this.clipRect = new sf.svgbase.Rect(0, 0, 0, 0);
        /** @private */
        _this.category = 'Series';
        /** @private */
        _this.rightSidePoints = [];
        /** @private */
        _this.leftSidePoints = [];
        return _this;
    }
    /** @private To refresh the Datamanager for series */
    AccumulationSeries.prototype.refreshDataManager = function (accumulation, render) {
        var _this = this;
        var dateSource = this.dataSource || accumulation.dataSource;
        if (!(dateSource instanceof sf.data.DataManager) && sf.base.isNullOrUndefined(this.query)) {
            this.dataManagerSuccess({ result: dateSource, count: dateSource.length }, accumulation, render);
            return;
        }
        var dataManager = this.dataModule.getData(this.dataModule.generateQuery().requiresCount());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e, accumulation); });
    };
    /**
     * To get points on dataManager is success
     * @private
     */
    AccumulationSeries.prototype.dataManagerSuccess = function (e, accumulation, render) {
        if (render === void 0) { render = true; }
        var argsData = {
            name: seriesRender, series: this, data: e.result,
        };
        accumulation.allowServerDataBinding = false;
        accumulation.trigger(seriesRender, argsData);
        this.resultData = e.result !== '' ? e.result : [];
        if (!accumulation.isBlazor && !render) {
            this.getPoints(this.resultData, accumulation); // To update datasource using onPropertyChanged method. incident id: 290690
        }
        // tslint:disable
        if ((++accumulation.seriesCounts === accumulation.visibleSeries.length && render) || (window['Blazor'] && !render && accumulation.seriesCounts === 1)) {
            this.getPoints(this.resultData, accumulation);
            accumulation.refreshChart();
        }
    };
    /** @private To find points from result data */
    AccumulationSeries.prototype.getPoints = function (result, accumulation) {
        var length = Object.keys(result).length;
        this.sumOfPoints = 0;
        if (length === 0) {
            return null;
        }
        this.findSumOfPoints(result);
        this.points = [];
        this.clubbedPoints = [];
        this.sumOfClub = 0;
        var point;
        var colors = this.palettes.length ? this.palettes : getSeriesColor(accumulation.theme);
        var clubValue = stringToNumber(this.groupTo, this.sumOfPoints);
        for (var i = 0; i < length; i++) {
            point = this.setPoints(result, i, colors, accumulation);
            var currentY = point.y;
            if (!this.isClub(point, clubValue, i)) {
                if (sf.base.isNullOrUndefined(point.y)) {
                    point.visible = false;
                }
                this.pushPoints(point, colors);
            }
            else {
                point.index = this.clubbedPoints.length;
                point.isExplode = true;
                this.clubbedPoints.push(point);
                point.isSliced = true;
            }
        }
        this.lastGroupTo = this.groupTo;
        if (this.sumOfClub > 0) {
            var clubPoint_1 = this.generateClubPoint();
            this.pushPoints(clubPoint_1, colors);
            var pointsLength_1 = this.points.length - 1;
            this.clubbedPoints.map(function (point) {
                point.index += pointsLength_1;
                point.color = clubPoint_1.color;
            });
        }
        if (this.clubbedPoints.length && this.explode && this.type === 'Pie'
            && (this.explodeAll || this.points[this.points.length - 1].index === this.explodeIndex)) {
            this.points.splice(this.points.length - 1, 1);
            this.points = this.points.concat(this.clubbedPoints);
        }
    };
    AccumulationSeries.prototype.generateClubPoint = function () {
        var clubPoint = new AccPoints();
        clubPoint.isClubbed = true;
        clubPoint.x = 'Others';
        clubPoint.y = this.sumOfClub;
        clubPoint.text = clubPoint.originalText = clubPoint.x + ': ' + this.sumOfClub;
        clubPoint.sliceRadius = '80%';
        return clubPoint;
    };
    /**
     * Method to set point index and color
     */
    AccumulationSeries.prototype.pushPoints = function (point, colors) {
        point.index = this.points.length;
        point.isExplode = this.explodeAll || (point.index === this.explodeIndex);
        point.color = point.color || colors[point.index % colors.length];
        this.points.push(point);
    };
    /**
     * Method to find club point
     */
    AccumulationSeries.prototype.isClub = function (point, clubValue, index) {
        if (!sf.base.isNullOrUndefined(clubValue)) {
            if (this.groupMode === 'Value' && Math.abs(point.y) <= clubValue) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            }
            else if (this.groupMode === 'Point' && index >= clubValue) {
                this.sumOfClub += Math.abs(point.y);
                return true;
            }
        }
        return false;
    };
    /**
     * Method to find sum of points in the series
     */
    AccumulationSeries.prototype.findSumOfPoints = function (result) {
        var length = Object.keys(result).length;
        for (var i = 0; i < length; i++) {
            if (!sf.base.isNullOrUndefined(result[i]) && !sf.base.isNullOrUndefined(result[i][this.yName]) && !isNaN(result[i][this.yName])) {
                this.sumOfPoints += Math.abs(result[i][this.yName]);
            }
        }
    };
    /**
     * Method to set points x, y and text from data source
     */
    AccumulationSeries.prototype.setPoints = function (data, i, colors, accumulation) {
        var point = new AccPoints();
        point.x = sf.base.getValue(this.xName, data[i]);
        point.y = sf.base.getValue(this.yName, data[i]);
        point.percentage = (+(point.y / this.sumOfPoints * 100).toFixed(2));
        point.color = sf.base.getValue(this.pointColorMapping, data[i]);
        point.text = point.originalText = sf.base.getValue(this.dataLabel.name || '', data[i]);
        point.tooltip = sf.base.getValue(this.tooltipMappingName || '', data[i]);
        point.sliceRadius = sf.base.getValue(this.radius, data[i]);
        point.sliceRadius = sf.base.isNullOrUndefined(point.sliceRadius) ? '80%' : point.sliceRadius;
        point.separatorY = accumulation.intl.formatNumber(point.y, { useGrouping: accumulation.useGroupingSeparator });
        this.setAccEmptyPoint(point, i, data, colors);
        return point;
    };
    /**
     * Method render the series elements for accumulation chart
     * @private
     */
    AccumulationSeries.prototype.renderSeries = function (accumulation, redraw) {
        var seriesGroup = redraw ? getElement(accumulation.element.id + '_Series_' + this.index) :
            accumulation.renderer.createGroup({ id: accumulation.element.id + '_Series_' + this.index });
        this.renderPoints(accumulation, seriesGroup, redraw);
        var datalabelGroup;
        if (accumulation.accumulationDataLabelModule && this.dataLabel.visible) {
            datalabelGroup = accumulation.renderer.createGroup({ id: accumulation.element.id + '_datalabel_Series_' + this.index });
            datalabelGroup.style.visibility =
                (this.animation.enable && accumulation.animateSeries && this.type === 'Pie') ? 'hidden' : 'visible';
            this.renderDataLabel(accumulation, datalabelGroup, redraw);
        }
        if (this.type === 'Pie') {
            this.findMaxBounds(this.labelBound, this.accumulationBound);
            accumulation.pieSeriesModule.animateSeries(accumulation, this.animation, this, seriesGroup);
        }
        if (accumulation.accumulationLegendModule) {
            this.labelBound.x -= accumulation.explodeDistance;
            this.labelBound.y -= accumulation.explodeDistance;
            this.labelBound.height += (accumulation.explodeDistance - this.labelBound.y);
            this.labelBound.width += (accumulation.explodeDistance - this.labelBound.x);
        }
    };
    /**
     * Method render the points elements for accumulation chart series.
     */
    AccumulationSeries.prototype.renderPoints = function (accumulation, seriesGroup, redraw) {
        var pointId = accumulation.element.id + '_Series_' + this.index + '_Point_';
        var option;
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point = _a[_i];
            var argsData = {
                cancel: false, name: pointRender, series: this, point: point, fill: point.color,
                border: this.isEmpty(point) ? { width: this.emptyPointSettings.border.width, color: this.emptyPointSettings.border.color } :
                    { width: this.border.width, color: this.border.color }
            };
            accumulation.trigger(pointRender, argsData);
            point.color = argsData.fill;
            option = new sf.svgbase.PathOption(pointId + point.index, point.color, argsData.border.width || 1, argsData.border.color || point.color, this.opacity, '', '');
            accumulation[(firstToLowerCase(this.type) + 'SeriesModule')].
                renderPoint(point, this, accumulation, option, seriesGroup, redraw);
        }
        appendChildElement(false, accumulation.getSeriesElement(), seriesGroup, redraw);
    };
    /**
     * Method render the datalabel elements for accumulation chart.
     */
    AccumulationSeries.prototype.renderDataLabel = function (accumulation, datalabelGroup, redraw) {
        accumulation.accumulationDataLabelModule.findAreaRect();
        var element = sf.base.createElement('div', {
            id: accumulation.element.id + '_Series_0' + '_DataLabelCollections'
        });
        this.leftSidePoints = [], this.rightSidePoints = [];
        var firstQuarter = [];
        var secondQuarter = [];
        for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
            var point = _a[_i];
            if (point.visible) {
                if (this.dataLabel.showZero || (!this.dataLabel.showZero && ((point.y !== 0) || (point.y === 0 &&
                    this.emptyPointSettings.mode === 'Zero')))) {
                    accumulation.accumulationDataLabelModule.renderDataLabel(point, this.dataLabel, datalabelGroup, this.points, this.index, element, redraw);
                }
            }
            if (point.midAngle >= 90 && point.midAngle <= 270) {
                this.leftSidePoints.push(point);
            }
            else {
                if (point.midAngle >= 0 && point.midAngle <= 90) {
                    secondQuarter.push(point);
                }
                else {
                    firstQuarter.push(point);
                }
            }
        }
        firstQuarter.sort(function (a, b) { return a.midAngle - b.midAngle; });
        secondQuarter.sort(function (a, b) { return a.midAngle - b.midAngle; });
        this.leftSidePoints.sort(function (a, b) { return a.midAngle - b.midAngle; });
        this.rightSidePoints = firstQuarter.concat(secondQuarter);
        accumulation.accumulationDataLabelModule.drawDataLabels(this, this.dataLabel, datalabelGroup, element, redraw);
        if (this.dataLabel.template !== null && element.childElementCount) {
            appendChildElement(false, getElement(accumulation.element.id + '_Secondary_Element'), element, redraw);
        }
        appendChildElement(false, accumulation.getSeriesElement(), datalabelGroup, redraw);
    };
    /**
     * To find maximum bounds for smart legend placing
     * @private
     */
    AccumulationSeries.prototype.findMaxBounds = function (totalbound, bound) {
        totalbound.x = bound.x < totalbound.x ? bound.x : totalbound.x;
        totalbound.y = bound.y < totalbound.y ? bound.y : totalbound.y;
        totalbound.height = (bound.y + bound.height) > totalbound.height ? (bound.y + bound.height) : totalbound.height;
        totalbound.width = (bound.x + bound.width) > totalbound.width ? (bound.x + bound.width) : totalbound.width;
    };
    /**
     * To set empty point value for null points
     * @private
     */
    AccumulationSeries.prototype.setAccEmptyPoint = function (point, i, data, colors) {
        if (!(sf.base.isNullOrUndefined(point.y) || isNaN(point.y))) {
            return null;
        }
        point.color = this.emptyPointSettings.fill || point.color;
        switch (this.emptyPointSettings.mode) {
            case 'Zero':
                point.y = 0;
                point.visible = true;
                break;
            case 'Average':
                var previous = data[i - 1] ? (data[i - 1][this.yName] || 0) : 0;
                var next = data[i + 1] ? (data[i + 1][this.yName] || 0) : 0;
                point.y = (Math.abs(previous) + Math.abs(next)) / 2;
                this.sumOfPoints += point.y;
                point.visible = true;
                break;
            default:
                point.visible = false;
                break;
        }
    };
    /**
     * To find point is empty
     */
    AccumulationSeries.prototype.isEmpty = function (point) {
        return point.color === this.emptyPointSettings.fill;
    };
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "dataSource", void 0);
    __decorate$2([
        sf.base.Property()
    ], AccumulationSeries.prototype, "query", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "xName", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "name", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "tooltipMappingName", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "yName", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], AccumulationSeries.prototype, "visible", void 0);
    __decorate$2([
        sf.base.Complex({ color: null, width: 0 }, Border)
    ], AccumulationSeries.prototype, "border", void 0);
    __decorate$2([
        sf.base.Complex(null, Animation$1)
    ], AccumulationSeries.prototype, "animation", void 0);
    __decorate$2([
        sf.base.Property('SeriesType')
    ], AccumulationSeries.prototype, "legendShape", void 0);
    __decorate$2([
        sf.base.Property('')
    ], AccumulationSeries.prototype, "pointColorMapping", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationSeries.prototype, "selectionStyle", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationSeries.prototype, "groupTo", void 0);
    __decorate$2([
        sf.base.Property('Value')
    ], AccumulationSeries.prototype, "groupMode", void 0);
    __decorate$2([
        sf.base.Complex({}, AccumulationDataLabelSettings)
    ], AccumulationSeries.prototype, "dataLabel", void 0);
    __decorate$2([
        sf.base.Property([])
    ], AccumulationSeries.prototype, "palettes", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], AccumulationSeries.prototype, "startAngle", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationSeries.prototype, "endAngle", void 0);
    __decorate$2([
        sf.base.Property('80%')
    ], AccumulationSeries.prototype, "radius", void 0);
    __decorate$2([
        sf.base.Property('0')
    ], AccumulationSeries.prototype, "innerRadius", void 0);
    __decorate$2([
        sf.base.Property('Pie')
    ], AccumulationSeries.prototype, "type", void 0);
    __decorate$2([
        sf.base.Property(true)
    ], AccumulationSeries.prototype, "enableTooltip", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], AccumulationSeries.prototype, "explode", void 0);
    __decorate$2([
        sf.base.Property('30%')
    ], AccumulationSeries.prototype, "explodeOffset", void 0);
    __decorate$2([
        sf.base.Property(false)
    ], AccumulationSeries.prototype, "explodeAll", void 0);
    __decorate$2([
        sf.base.Property(null)
    ], AccumulationSeries.prototype, "explodeIndex", void 0);
    __decorate$2([
        sf.base.Complex({ mode: 'Drop' }, EmptyPointSettings)
    ], AccumulationSeries.prototype, "emptyPointSettings", void 0);
    __decorate$2([
        sf.base.Property(0)
    ], AccumulationSeries.prototype, "gapRatio", void 0);
    __decorate$2([
        sf.base.Property('80%')
    ], AccumulationSeries.prototype, "width", void 0);
    __decorate$2([
        sf.base.Property('80%')
    ], AccumulationSeries.prototype, "height", void 0);
    __decorate$2([
        sf.base.Property('20%')
    ], AccumulationSeries.prototype, "neckWidth", void 0);
    __decorate$2([
        sf.base.Property('20%')
    ], AccumulationSeries.prototype, "neckHeight", void 0);
    __decorate$2([
        sf.base.Property('Linear')
    ], AccumulationSeries.prototype, "pyramidMode", void 0);
    __decorate$2([
        sf.base.Property(1)
    ], AccumulationSeries.prototype, "opacity", void 0);
    return AccumulationSeries;
}(sf.base.ChildProperty));
/**
 * method to get series from index
 * @private
 */
function getSeriesFromIndex(index, visibleSeries) {
    for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
        var series = visibleSeries_1[_i];
        if (index === series.index) {
            return series;
        }
    }
    return visibleSeries[0];
}
/**
 * method to get point from index
 * @private
 */
function pointByIndex(index, points) {
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point = points_1[_i];
        if (point.index === index) {
            return point;
        }
    }
    return null;
}

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
        textElement(chart.renderer, legendTitleTextOptions, legend.titleStyle, legend.titleStyle.color, legendGroup);
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
        var element = textElement(chart.renderer, textOptions, legend.textStyle, fontcolor, group, false, false, false, false, null, this.currentPageNumber && isCanvas ?
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
            pageTextElement = textElement(chart.renderer, textOption, legend.textStyle, legend.textStyle.color, paginggroup, false, false, false, false, null, new sf.svgbase.Rect(bounds.width - (2 * (iconSize + padding) + padding + size.width), 0, 0, 0));
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
                        removeElement$1(this.chart.element.id + '_EJ2_Legend_Tooltip');
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
            removeElement$1(this.chart.element.id + '_EJ2_Legend_Tooltip');
        }
        if (this.chart.isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = setTimeout(function () { removeElement$1(_this.chart.element.id + '_EJ2_Legend_Tooltip'); }, 1000);
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

/**
 * Defines the common functionalities of accumulation series
 */
/**
 * Accumulation Base used to do some base calculation for accumulation chart.
 */
var AccumulationBase = /** @class */ (function () {
    /** @private */
    function AccumulationBase(accumulation) {
        this.accumulation = accumulation;
    }
    Object.defineProperty(AccumulationBase.prototype, "center", {
        /**
         * Gets the center of the pie
         * @private
         */
        get: function () {
            return this.pieCenter || (this.accumulation.visibleSeries[0].type === 'Pie' ?
                this.accumulation.pieSeriesModule.center : null);
        },
        /**
         * Sets the center of the pie
         * @private
         */
        set: function (value) {
            this.pieCenter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccumulationBase.prototype, "radius", {
        /**
         * Gets the radius of the pie
         * @private
         */
        get: function () {
            return this.pieRadius !== undefined ? this.pieRadius :
                this.accumulation.pieSeriesModule.radius;
        },
        /**
         * Sets the radius of the pie
         * @private
         */
        set: function (value) {
            this.pieRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccumulationBase.prototype, "labelRadius", {
        /**
         * Gets the label radius of the pie
         * @private
         */
        get: function () {
            return this.pieLabelRadius !== undefined ? this.pieLabelRadius :
                this.accumulation.pieSeriesModule.labelRadius;
        },
        /**
         * Sets the label radius of the pie
         * @private
         */
        set: function (value) {
            this.pieLabelRadius = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks whether the series is circular or not
     * @private
     */
    AccumulationBase.prototype.isCircular = function () {
        return this.accumulation.type === 'Pie';
    };
    /**
     * To check various radius pie
     * @private
     */
    AccumulationBase.prototype.isVariousRadius = function () {
        return this.accumulation.pieSeriesModule.isRadiusMapped;
    };
    /**
     * To process the explode on accumulation chart loading
     * @private
     */
    AccumulationBase.prototype.processExplode = function (event) {
        if (event.target.id.indexOf('_Series_') > -1 || event.target.id.indexOf('_datalabel_') > -1) {
            var pointIndex = indexFinder(event.target.id).point;
            if (isNaN(pointIndex) || (event.target.id.indexOf('_datalabel_') > -1 &&
                this.accumulation.visibleSeries[0].points[pointIndex].labelPosition === 'Outside')) {
                return null;
            }
            this.explodePoints(pointIndex, this.accumulation);
            this.deExplodeAll(pointIndex, this.accumulation.enableAnimation ? 300 : 0);
        }
    };
    /**
     * To invoke the explode on accumulation chart loading
     * @private
     */
    AccumulationBase.prototype.invokeExplode = function () {
        var series = this.accumulation.visibleSeries[0];
        var duration = this.accumulation.enableAnimation ? 300 : 0;
        for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
            var point = _a[_i];
            if (point.isExplode) {
                this.pointExplode(point.index, point, duration);
            }
        }
        if (this.accumulation.accumulationSelectionModule && this.accumulation.selectionMode !== 'None' &&
            this.accumulation.accumulationSelectionModule.selectedDataIndexes.length) {
            for (var _b = 0, _c = this.accumulation.accumulationSelectionModule.selectedDataIndexes; _b < _c.length; _b++) {
                var index = _c[_b];
                this.explodePoints(index.point, this.accumulation, true);
                this.deExplodeAll(index.point, duration);
            }
        }
    };
    /**
     * To deExplode all points in the series
     * @private
     */
    AccumulationBase.prototype.deExplodeAll = function (index, animationDuration) {
        var pointId = this.accumulation.element.id + '_Series_0_Point_';
        var points = this.accumulation.visibleSeries[0].points;
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var currentPoint = points_1[_i];
            if ((index !== currentPoint.index && !currentPoint.isSliced) || currentPoint.isClubbed) {
                currentPoint.isExplode = false;
                this.deExplodeSlice(currentPoint.index, pointId, animationDuration);
            }
        }
    };
    /**
     * To explode point by index
     * @private
     */
    AccumulationBase.prototype.explodePoints = function (index, chart, explode) {
        if (explode === void 0) { explode = false; }
        var series = chart.visibleSeries[0];
        var points = series.points;
        var point = pointByIndex(index, points);
        var explodePoints = true;
        var duration = this.accumulation.enableAnimation ? 300 : 0;
        if (sf.base.isNullOrUndefined(point)) {
            return null;
        }
        var clubPointsExploded = !explode &&
            (point.isSliced || (series.clubbedPoints.length &&
                points[points.length - 1].index === series.clubbedPoints[series.clubbedPoints.length - 1].index));
        if (series.type === 'Pie' && (clubPointsExploded || point.isClubbed)) {
            explodePoints = this.clubPointExplode(index, point, series, points, chart, duration, explode, clubPointsExploded);
        }
        if (explodePoints) {
            this.pointExplode(index, point, duration, explode);
        }
    };
    AccumulationBase.prototype.getSum = function (points) {
        var total = 0;
        points.map(function (point) {
            total += point.visible ? point.y : 0;
        });
        return total;
    };
    
    AccumulationBase.prototype.clubPointExplode = function (index, point, series, points, chart, duration, explode, clubPointsExploded) {
        if (explode === void 0) { explode = false; }
        if (clubPointsExploded === void 0) { clubPointsExploded = false; }
        if (point.isClubbed) {
            chart.animateSeries = false;
            points.splice(points.length - 1, 1);
            series.clubbedPoints.map(function (point) {
                point.visible = true;
                point.isExplode = true;
            });
            chart.visibleSeries[0].points = points.concat(series.clubbedPoints);
            this.deExplodeAll(index, duration);
            series.sumOfPoints = this.getSum(chart.visibleSeries[0].points);
            chart.refreshChart();
            return false;
        }
        else if (clubPointsExploded || point.isSliced) {
            chart.animateSeries = false;
            points.splice(points.length - series.clubbedPoints.length, series.clubbedPoints.length);
            var clubPoint = series.generateClubPoint();
            clubPoint.index = points.length;
            clubPoint.color = series.clubbedPoints[0].color;
            points.push(clubPoint);
            series.sumOfPoints = this.getSum(points);
            this.deExplodeAll(index, duration);
            clubPoint.isExplode = false;
            chart.visibleSeries[0].points = points;
            chart.refreshChart();
            this.pointExplode(clubPoint.index, points[clubPoint.index], 0, true);
            clubPoint.isExplode = false;
            this.deExplodeSlice(clubPoint.index, chart.element.id + '_Series_0_Point_', duration);
            if (point.isSliced) {
                return false;
            }
        }
        return true;
    };
    /**
     * To Explode points
     * @param index
     * @param point
     * @param explode
     */
    AccumulationBase.prototype.pointExplode = function (index, point, duration, explode) {
        var translate;
        var pointId = this.accumulation.element.id + '_Series_0_Point_';
        var chart = this.accumulation;
        if (!this.isCircular()) {
            translate = {
                x: ((point.labelRegion && point.labelRegion.x < point.region.x) ? -chart.explodeDistance :
                    chart.explodeDistance), y: 0
            };
        }
        else {
            translate = degreeToLocation(point.midAngle, chart.explodeDistance, this.center);
        }
        if (this.isExplode(pointId + index) || explode) {
            point.isExplode = true;
            this.explodeSlice(index, translate, pointId, this.center || { x: 0, y: 0 }, duration);
        }
        else {
            point.isExplode = false;
            this.deExplodeSlice(index, pointId, duration);
        }
    };
    /**
     * To check point is exploded by id
     */
    AccumulationBase.prototype.isExplode = function (id) {
        var element = getElement(id);
        var transform = element ? element.getAttribute('transform') : null;
        return (element && (transform === 'translate(0, 0)' || transform === null || transform === 'translate(0)'));
    };
    /**
     * To deExplode the point by index
     */
    AccumulationBase.prototype.deExplodeSlice = function (index, sliceId, animationDuration) {
        var element = getElement(sliceId + index);
        if (element) {
            var borderElement = element.parentNode.lastChild.hasAttribute('transform');
            if (borderElement) {
                element.parentNode.lastChild.removeAttribute('transform');
            }
        }
        var transform = element ? element.getAttribute('transform') : null;
        if (this.accumulation.enableAnimation && element && transform &&
            transform !== 'translate(0, 0)' && transform !== 'translate(0)') {
            var result = /translate\((-?\d+\.?\d*),?\s*(-?\d+[.]?\d*)?\)/.exec(transform);
            this.performAnimation(index, sliceId, 0, 0, +result[1], +result[2] || 0, animationDuration, true);
        }
        else {
            this.performAnimation(index, sliceId, 0, 0, 0, 0, animationDuration, true);
        }
    };
    /**
     * To translate the point elements by index and position
     */
    AccumulationBase.prototype.setTranslate = function (index, sliceId, position, transform) {
        this.setElementTransform(sliceId + index, position);
        if (this.accumulation.visibleSeries[0].dataLabel.visible) {
            sliceId = this.accumulation.element.id + '_datalabel_Series_0_';
            this.setElementTransform(sliceId + 'shape_' + index, position);
            this.setElementTransform(sliceId + 'text_' + index, position + transform);
            this.setElementTransform(sliceId + 'connector_' + index, position);
        }
    };
    /**
     * To translate the point element by id and position
     */
    AccumulationBase.prototype.setElementTransform = function (id, position) {
        var element = getElement(id);
        if (element) {
            element.setAttribute('transform', position);
        }
    };
    /**
     * To translate the point elements by index position
     */
    AccumulationBase.prototype.explodeSlice = function (index, translate, sliceId, center, animationDuration) {
        this.performAnimation(index, sliceId, 0, 0, translate.x - center.x, translate.y - center.y, animationDuration);
    };
    /**
     * To Perform animation point explode
     * @param index
     * @param sliceId
     * @param start
     * @param endX
     * @param endY
     */
    AccumulationBase.prototype.performAnimation = function (index, sliceId, startX, startY, endX, endY, duration, isReverse) {
        var _this = this;
        var chart = this.accumulation;
        var seriesIndex;
        var point;
        var values = sliceId.split('_');
        seriesIndex = parseInt(sliceId.split('_')[values.length - 3], 10);
        point = chart.visibleSeries[seriesIndex].points[index];
        if (duration <= 0) {
            this.setTranslate(index, sliceId, 'translate(' + (endX) + ', ' + (endY) + ')', point.transform);
            return null;
        }
        var xValue;
        var yValue;
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            progress: function (args) {
                xValue = linear(args.timeStamp, startX, endX, args.duration);
                yValue = linear(args.timeStamp, startY, endY, args.duration);
                _this.setTranslate(index, sliceId, 'translate(' + (isReverse ? endX - xValue : xValue) + ', ' + (isReverse ? endY - yValue : yValue) + ')', point.transform);
            },
            end: function (model) {
                _this.setTranslate(index, sliceId, 'translate(' + (isReverse ? startX : endX) + ', ' + (isReverse ? startX : endY) + ')', point.transform);
            }
        });
    };
    return AccumulationBase;
}());

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
 * Accumulation charts base file
 */
/**
 * PieBase class used to do pie base calculations.
 */
var PieBase = /** @class */ (function (_super) {
    __extends$8(PieBase, _super);
    function PieBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * To initialize the property values.
     * @private
     */
    PieBase.prototype.initProperties = function (chart, series) {
        this.accumulation = chart;
        this.size = Math.min(chart.initialClipRect.width, chart.initialClipRect.height);
        this.initAngles(series);
        var r = parseInt(series.radius, 10);
        if ((series.radius.indexOf('%') !== -1 || typeof r === 'number') && !isNaN(r)) {
            this.isRadiusMapped = false;
            this.radius = stringToNumber(series.radius, this.size / 2);
            this.innerRadius = stringToNumber(series.innerRadius, this.radius);
            this.labelRadius = series.dataLabel.position === 'Inside' ? (((this.radius - this.innerRadius) / 2) + this.innerRadius) :
                (this.radius + stringToNumber(series.dataLabel.connectorStyle.length || '4%', this.size / 2));
        }
        else {
            var radiusCollection = [];
            this.isRadiusMapped = true;
            for (var i = 0; i < Object.keys(series.points).length; i++) {
                if (series.points[i].sliceRadius.indexOf('%') !== -1) {
                    radiusCollection[i] = stringToNumber(series.points[i].sliceRadius, this.size / 2);
                }
                else {
                    radiusCollection[i] = parseInt(series.points[i].sliceRadius, 10);
                }
            }
            var minRadius = Math.min.apply(null, radiusCollection);
            var maxRadius = Math.max.apply(null, radiusCollection);
            this.radius = this.seriesRadius = maxRadius;
            this.innerRadius = stringToNumber(series.innerRadius, this.seriesRadius);
            this.innerRadius = this.innerRadius > minRadius ? (this.innerRadius / 2) : this.innerRadius;
        }
        // this.radius = stringToNumber(series.radius, size / 2);
        // this.innerRadius = stringToNumber(series.innerRadius, this.radius);
        // this.labelRadius = series.dataLabel.position === 'Inside' ? (((this.radius - this.innerRadius) / 2) + this.innerRadius) :
        //     (this.radius + stringToNumber(series.dataLabel.connectorStyle.length || '4%', size / 2));
        chart.explodeDistance = series.explode ? stringToNumber(series.explodeOffset, this.radius) : 0;
        this.findCenter(chart, series);
        this.defaultLabelBound(series, series.dataLabel.visible, series.dataLabel.position);
        this.totalAngle -= 0.001;
    };
    /*
     * To get label radius of the pie.
     * @private
     */
    PieBase.prototype.getLabelRadius = function (series, point) {
        return series.dataLabel.position === 'Inside' ?
            ((((stringToNumber(point.sliceRadius, this.radius) - this.innerRadius)) / 2) + this.innerRadius) :
            (stringToNumber(point.sliceRadius, this.seriesRadius) + stringToNumber(series.dataLabel.connectorStyle.length || '4%', this.size / 2));
    };
    /**
     * To find the center of the accumulation.
     * @private
     */
    PieBase.prototype.findCenter = function (accumulation, series) {
        this.accumulation = accumulation;
        this.center = {
            x: stringToNumber(accumulation.center.x, accumulation.initialClipRect.width) + (accumulation.initialClipRect.x),
            y: stringToNumber(accumulation.center.y, accumulation.initialClipRect.height) + (accumulation.initialClipRect.y)
        };
        var accumulationRect = this.getSeriesBound(series);
        var accumulationRectCenter = new ChartLocation(accumulationRect.x + accumulationRect.width / 2, accumulationRect.y + accumulationRect.height / 2);
        this.center.x += (this.center.x - accumulationRectCenter.x);
        this.center.y += (this.center.y - accumulationRectCenter.y);
        this.accumulation.origin = this.center;
    };
    /**
     * To find angles from series.
     */
    PieBase.prototype.initAngles = function (series) {
        var endAngle = sf.base.isNullOrUndefined(series.endAngle) ? series.startAngle : series.endAngle;
        this.totalAngle = (endAngle - series.startAngle) % 360;
        this.startAngle = series.startAngle - 90;
        this.totalAngle = this.totalAngle <= 0 ? (360 + this.totalAngle) : this.totalAngle;
        this.startAngle = (this.startAngle < 0 ? (this.startAngle + 360) : this.startAngle) % 360;
    };
    /**
     * To calculate data-label bound
     * @private
     */
    PieBase.prototype.defaultLabelBound = function (series, visible, position) {
        var accumulationBound = this.getSeriesBound(series);
        series.accumulationBound = accumulationBound;
        series.labelBound = new sf.svgbase.Rect(accumulationBound.x, accumulationBound.y, accumulationBound.width + accumulationBound.x, accumulationBound.height + accumulationBound.y);
        if (visible && position === 'Outside') {
            series.labelBound = new sf.svgbase.Rect(Infinity, Infinity, -Infinity, -Infinity);
        }
    };
    /**
     * To calculate series bound
     * @private
     */
    PieBase.prototype.getSeriesBound = function (series) {
        var rect = new sf.svgbase.Rect(Infinity, Infinity, -Infinity, -Infinity);
        this.initAngles(series);
        var start = this.startAngle;
        var total = this.totalAngle;
        var end = (this.startAngle + total) % 360;
        end = (end === 0) ? 360 : end;
        series.findMaxBounds(rect, this.getRectFromAngle(start));
        series.findMaxBounds(rect, this.getRectFromAngle(end));
        series.findMaxBounds(rect, new sf.svgbase.Rect(this.center.x, this.center.y, 0, 0));
        var nextQuandrant = (Math.floor(start / 90) * 90 + 90) % 360;
        var lastQuadrant = (Math.floor(end / 90) * 90) % 360;
        lastQuadrant = (lastQuadrant === 0) ? 360 : lastQuadrant;
        if (total >= 90 || lastQuadrant === nextQuandrant) {
            series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            series.findMaxBounds(rect, this.getRectFromAngle(lastQuadrant));
        }
        if (start === 0 || (start + total >= 360)) {
            series.findMaxBounds(rect, this.getRectFromAngle(0));
        }
        var length = nextQuandrant === lastQuadrant ? 0 : Math.floor(total / 90);
        for (var i = 1; i < length; i++) {
            nextQuandrant = nextQuandrant + 90;
            if ((nextQuandrant < lastQuadrant || end < start) || total === 360) {
                series.findMaxBounds(rect, this.getRectFromAngle(nextQuandrant));
            }
        }
        rect.width -= rect.x;
        rect.height -= rect.y;
        return rect;
    };
    /**
     * To get rect location size from angle
     */
    PieBase.prototype.getRectFromAngle = function (angle) {
        var location = degreeToLocation(angle, this.radius, this.center);
        return new sf.svgbase.Rect(location.x, location.y, 0, 0);
    };
    /**
     * To get path arc direction
     */
    PieBase.prototype.getPathArc = function (center, start, end, radius, innerRadius) {
        var degree = end - start;
        degree = degree < 0 ? (degree + 360) : degree;
        var flag = (degree < 180) ? 0 : 1;
        if (!innerRadius && innerRadius === 0) {
            return this.getPiePath(center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius, flag);
        }
        else {
            return this.getDoughnutPath(center, degreeToLocation(start, radius, center), degreeToLocation(end, radius, center), radius, degreeToLocation(start, innerRadius, center), degreeToLocation(end, innerRadius, center), innerRadius, flag);
        }
    };
    /**
     * To get pie direction
     */
    PieBase.prototype.getPiePath = function (center, start, end, radius, clockWise) {
        return 'M ' + center.x + ' ' + center.y + ' L ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
            radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y + ' Z';
    };
    /**
     * To get doughnut direction
     */
    PieBase.prototype.getDoughnutPath = function (center, start, end, radius, innerStart, innerEnd, innerRadius, clockWise) {
        return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' + clockWise +
            ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y + ' A ' + innerRadius +
            ' ' + innerRadius + ' 0 ' + clockWise + ',0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
    };
    /**
     * Method to start animation for pie series.
     */
    PieBase.prototype.doAnimation = function (slice, series) {
        var _this = this;
        var startAngle = series.startAngle - 90;
        var duration = this.accumulation.duration ? this.accumulation.duration : series.animation.duration;
        var value;
        this.center.x += 1;
        var radius = Math.max(this.accumulation.availableSize.height, this.accumulation.availableSize.width) * 0.75;
        radius += radius * (0.414); // formula r + r / 2 * (1.414 -1)
        var effect = getAnimationFunction('Linear'); // need to check animation type
        new sf.base.Animation({}).animate(slice, {
            duration: duration,
            delay: series.animation.delay,
            progress: function (args) {
                value = effect(args.timeStamp, startAngle, _this.totalAngle, args.duration);
                slice.setAttribute('d', _this.getPathArc(_this.center, startAngle, value, radius, 0));
            },
            end: function (args) {
                _this.center.x -= 1;
                slice.setAttribute('d', _this.getPathArc(_this.center, 0, 359.99999, radius, 0));
                _this.accumulation.trigger(animationComplete, _this.accumulation.isBlazor ? {} :
                    { series: series, accumulation: _this.accumulation, chart: _this.accumulation });
                var datalabelGroup = getElement(_this.accumulation.element.id + '_datalabel_Series_' + series.index);
                datalabelGroup.style.visibility = _this.accumulation.isDestroyed ? 'hidden' : 'visible';
            }
        });
    };
    return PieBase;
}(AccumulationBase));

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
 * PieSeries module used to render `Pie` Series.
 */
var PieSeries = /** @class */ (function (_super) {
    __extends$7(PieSeries, _super);
    function PieSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * To get path option, degree, symbolLocation from the point.
     * @private
     */
    PieSeries.prototype.renderPoint = function (point, series, chart, option, seriesGroup, redraw) {
        var sum$$1 = series.sumOfPoints;
        point.startAngle = this.startAngle;
        var yValue = point.visible ? point.y : 0;
        var degree = (sum$$1) ? ((Math.abs(yValue) / sum$$1) * (this.totalAngle)) : null;
        var start = Math.PI / 180 * ((90 - (360 - this.startAngle)) - 90);
        this.radius = this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius;
        option.d = this.getPathOption(point, degree, this.startAngle % 360, yValue);
        point.midAngle = (this.startAngle - (degree / 2)) % 360;
        point.endAngle = this.startAngle % 360;
        point.symbolLocation = degreeToLocation(point.midAngle, (this.radius + this.innerRadius) / 2, this.center);
        if (!redraw) {
            seriesGroup.appendChild(chart.renderer.drawPath(option));
            point.degree = degree;
            point.start = start;
        }
        else {
            this.refresh(point, degree, start, chart, option, seriesGroup);
        }
    };
    PieSeries.prototype.findSeries = function (e) {
        var innerRadius;
        var radius;
        var borderGap = 3; // Gap between pie/doughnut chart and border
        var width = 2; // width of the border
        radius = this.innerRadius === 0 ? this.radius + borderGap : this.innerRadius - borderGap;
        innerRadius = this.innerRadius === 0 ? radius + width : radius - width;
        this.toggleInnerPoint(e, radius, innerRadius);
    };
    PieSeries.prototype.toggleInnerPoint = function (event, radius, innerRadius) {
        var target = event.target;
        var id = indexFinder(target.id, true);
        var accumulationId = event.target.id.substring(0, (event.target.id.indexOf('Series') - 1));
        var borderElement = document.getElementById(this.accumulation.element.id + 'PointHover_Border');
        var createBorderEle;
        var seriesIndex = id.series;
        var pointIndex = id.point;
        var srcElem = getElement(accumulationId + '_Series_' + seriesIndex + '_Point_' + pointIndex);
        if (!isNaN(id.series) && srcElem) {
            if (!sf.base.isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !sf.base.isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                var point = this.accumulation.visibleSeries[0].points[pointIndex];
                var opacity = srcElem.getAttribute('class') === accumulationId + '_ej2_deselected' ?
                    this.accumulation.tooltip.enable ? 0.5 : 0.3 : this.accumulation.tooltip.enable ? 0.5 : 1;
                var innerPie = this.getPathArc(this.accumulation.pieSeriesModule.center, point.startAngle % 360, (point.startAngle + point.degree) % 360, radius, innerRadius);
                // while using annotation as a chart border will appear in both chart.so changed checked the id with target id
                if ((borderElement) && (accumulationId === this.accumulation.element.id) &&
                    (borderElement.getAttribute('d') !== innerPie || point.isExplode)) {
                    borderElement.parentNode.removeChild(borderElement);
                    borderElement = null;
                }
                var seriousGroup = getElement(accumulationId + '_Series_' + seriesIndex);
                if (!borderElement && ((!point.isExplode) || (point.isExplode && event.type !== 'click'))) {
                    var path = new sf.svgbase.PathOption(accumulationId + 'PointHover_Border', point.color, 1, point.color, opacity, '', innerPie);
                    createBorderEle = this.accumulation.renderer.drawPath(path);
                    createBorderEle.removeAttribute('transform');
                    if (this.accumulation.selectionMode !== 'None' && event.target.hasAttribute('class')) {
                        this.accumulation.accumulationSelectionModule.addSvgClass(createBorderEle, event.target.getAttribute('class'));
                    }
                    seriousGroup.appendChild(createBorderEle);
                    if (point.isExplode && createBorderEle) {
                        var borderExplode = srcElem.getAttribute('transform');
                        createBorderEle.setAttribute('transform', borderExplode);
                    }
                }
            }
        }
        else if (borderElement) {
            this.removeBorder(borderElement, 1000);
            borderElement = null;
        }
    };
    PieSeries.prototype.removeBorder = function (borderElement, duration) {
        if (borderElement) {
            setTimeout(function () {
                if (borderElement.parentNode) {
                    borderElement.parentNode.removeChild(borderElement);
                }
            }, duration);
        }
    };
    PieSeries.prototype.refresh = function (point, degree, start, chart, option, seriesGroup) {
        var _this = this;
        var seriesElement = getElement(option.id);
        var duration = chart.duration ? chart.duration : 300;
        var currentStartAngle;
        var curentDegree;
        new sf.base.Animation({}).animate(sf.base.createElement('div'), {
            duration: duration,
            delay: 0,
            progress: function (args) {
                curentDegree = linear(args.timeStamp, point.degree, (degree - point.degree), args.duration);
                currentStartAngle = linear(args.timeStamp, point.start, start - point.start, args.duration);
                currentStartAngle = ((currentStartAngle / (Math.PI / 180)) + 360) % 360;
                seriesElement.setAttribute('d', _this.getPathOption(point, curentDegree, currentStartAngle, point.y));
                if (point.isExplode) {
                    chart.accBaseModule.explodePoints(point.index, chart, true);
                }
                seriesElement.style.visibility = 'visible';
            },
            end: function (args) {
                seriesElement.style.visibility = point.visible ? 'visible' : 'hidden';
                seriesElement.setAttribute('d', option.d);
                point.degree = degree;
                point.start = start;
            }
        });
    };
    /**
     * To get path option from the point.
     */
    PieSeries.prototype.getPathOption = function (point, degree, startAngle, yValue) {
        if (!degree) {
            return '';
        }
        var path = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.isRadiusMapped ? stringToNumber(point.sliceRadius, this.seriesRadius) : this.radius, this.innerRadius);
        //let path: string = this.getPathArc(this.center, startAngle % 360, (startAngle + degree) % 360, this.radius, this.innerRadius);
        this.startAngle += degree;
        return path;
    };
    /**
     * To animate the pie series.
     * @private
     */
    PieSeries.prototype.animateSeries = function (accumulation, option, series, slice) {
        var groupId = accumulation.element.id + 'SeriesGroup' + series.index;
        if (series.animation.enable && accumulation.animateSeries) {
            var clippath = accumulation.renderer.createClipPath({ id: groupId + '_clipPath' });
            var path = new sf.svgbase.PathOption(groupId + '_slice', 'transparent', 1, 'transparent', 1, '', '');
            var clipslice = accumulation.renderer.drawPath(path);
            clippath.appendChild(clipslice);
            accumulation.svgObject.appendChild(clippath);
            // I263828 pie chart animation issue fixed for safari browser
            slice.setAttribute('style', 'clip-path:url(#' + clippath.id + '); -webkit-clip-path:url(#' + clippath.id + ');');
            this.doAnimation(clipslice, series);
        }
    };
    /**
     * To get the module name of the Pie series.
     */
    PieSeries.prototype.getModuleName = function () {
        return 'PieSeries';
    };
    /**
     * To destroy the pie series.
     * @return {void}
     * @private
     */
    PieSeries.prototype.destroy = function (accumulation) {
        /**
         * Destroy method calling here
         */
    };
    return PieSeries;
}(PieBase));

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
            removeElement$1(document.getElementById(this.control.element.id + '_canvas'));
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
 * AccumulationChart file
 */
/**
 * Represents the AccumulationChart control.
 * ```html
 * <div id="accumulation"/>
 * <script>
 *   var accObj = new AccumulationChart({ });
 *   accObj.appendTo("#accumulation");
 * </script>
 * ```
 * @public
 */
var AccumulationChart = /** @class */ (function (_super) {
    __extends(AccumulationChart, _super);
    /**
     * Constructor for creating the AccumulationChart widget
     * @private
     */
    function AccumulationChart(options, element) {
        var _this = _super.call(this, options, element) || this;
        /** @private */
        _this.animateselected = false;
        /** @private explode radius internal property */
        _this.explodeDistance = 0;
        _this.chartid = 57724;
        return _this;
    }
    /**
     * Animate the series bounds on data change.
     * @private
     */
    AccumulationChart.prototype.animate = function (duration) {
        this.duration = duration ? duration : 700;
        this.animateselected = true;
        this.animateSeries = false;
        var temIndex = 0;
        var tempcolor = [];
        var tempindex = [];
        var tempindex1 = [];
        var currentSeries = this.visibleSeries[0];
        var datasource = [];
        datasource = currentSeries.dataSource;
        currentSeries.sumOfPoints = 0;
        if (currentSeries.points.length < Object.keys(currentSeries.dataSource).length) {
            this.refresh();
        }
        else if (currentSeries.points.length > Object.keys(currentSeries.dataSource).length) {
            var currentSeries_1 = this.visibleSeries[0];
            currentSeries_1.points = currentSeries_1.points.filter(function (entry1) {
                entry1.visible = false;
                tempindex.push(entry1.index);
                tempcolor.push(entry1.color);
                return (datasource).some(function (entry2) {
                    var accPoint = entry2;
                    if (entry1.x === accPoint.x) {
                        entry1.visible = true;
                        tempindex1.push(entry1.index);
                        entry1.index = temIndex;
                        temIndex++;
                    }
                    return entry1.x === accPoint.x;
                });
            });
            var missing = tempindex.filter(function (item) { return tempindex1.indexOf(item) < 0; });
            var interval = tempindex.length - missing.length;
            for (var i = (tempindex.length - 1); i >= interval; i--) {
                removeElement$1('container_Series_0_Point_' + tempindex[i]);
            }
            for (var i = 0; i < currentSeries_1.points.length; i++) {
                currentSeries_1.points[i].y = currentSeries_1.dataSource[i].y;
                currentSeries_1.points[i].color = tempcolor[i];
                currentSeries_1.sumOfPoints += currentSeries_1.dataSource[i].y;
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.calculateBounds();
            this.renderElements();
        }
        else {
            for (var i = 0; i < currentSeries.points.length; i++) {
                currentSeries.points[i].y = currentSeries.dataSource[i].y;
                currentSeries.sumOfPoints += currentSeries.dataSource[i].y;
            }
            this.redraw = this.enableAnimation;
            this.animateSeries = false;
            this.removeSvg();
            this.refreshPoints(currentSeries.points);
            this.renderElements();
        }
    };
    Object.defineProperty(AccumulationChart.prototype, "type", {
        /** @private */
        get: function () {
            if (this.series && this.series.length) {
                return this.series[0].type;
            }
            return 'Pie';
        },
        enumerable: true,
        configurable: true
    });
    // accumulation chart methods
    /**
     *  To create svg object, renderer and binding events for the container.
     */
    AccumulationChart.prototype.preRender = function () {
        var blazor = 'Blazor';
        this.isBlazor = window[blazor];
        this.allowServerDataBinding = false;
        this.unWireEvents();
        this.setCulture();
        this.animateSeries = true;
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-accumulationchart').length;
            this.element.id = 'acc_chart_' + this.chartid + '_' + collection;
        }
        calculateSize(this);
        this.wireEvents();
    };
    /**
     * Themeing for chart goes here
     */
    AccumulationChart.prototype.setTheme = function () {
        /*! Set theme for accumulation chart */
        this.themeStyle = getThemeColor(this.theme);
    };
    /**
     * To render the accumulation chart elements
     */
    AccumulationChart.prototype.render = function () {
        var _this = this;
        if (this.element.className.indexOf('e-accumulationchart') === -1) {
            this.element.classList.add('e-accumulationchart');
        }
        var loadEventData = {
            chart: this.isBlazor ? {} : this,
            accumulation: this.isBlazor ? {} : this,
            theme: this.theme, name: load, cancel: false
        };
        this.trigger(load, loadEventData, function () {
            _this.theme = _this.isBlazor ? loadEventData.theme : _this.theme;
            _this.setTheme();
            _this.accBaseModule = new AccumulationBase(_this);
            _this.pieSeriesModule = new PieSeries(_this);
            _this.calculateVisibleSeries();
            _this.processData();
            _this.renderComplete();
            _this.allowServerDataBinding = true;
        });
    };
    /**
     * Method to unbind events for accumulation chart
     */
    AccumulationChart.prototype.unWireEvents = function () {
        /*! Find the Events type */
        var isIE11Pointer = sf.base.Browser.isPointer;
        var start = sf.base.Browser.touchStartEvent;
        var move = sf.base.Browser.touchMoveEvent;
        var stop = sf.base.Browser.touchEndEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! UnBind the Event handler */
        sf.base.EventHandler.remove(this.element, move, this.accumulationMouseMove);
        sf.base.EventHandler.remove(this.element, stop, this.accumulationMouseEnd);
        sf.base.EventHandler.remove(this.element, start, this.accumulationMouseStart);
        sf.base.EventHandler.remove(this.element, 'click', this.accumulationOnMouseClick);
        sf.base.EventHandler.remove(this.element, 'contextmenu', this.accumulationRightClick);
        sf.base.EventHandler.remove(this.element, cancel, this.accumulationMouseLeave);
        window.removeEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.accumulationResize);
    };
    /**
     * Method to bind events for the accumulation chart
     */
    AccumulationChart.prototype.wireEvents = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (!this.element) {
            return;
        }
        /*! Find the Events type */
        var isIE11Pointer = sf.base.Browser.isPointer;
        var start = sf.base.Browser.touchStartEvent;
        var stop = sf.base.Browser.touchEndEvent;
        var move = sf.base.Browser.touchMoveEvent;
        var cancel = isIE11Pointer ? 'pointerleave' : 'mouseleave';
        /*! Bind the Event handler */
        sf.base.EventHandler.add(this.element, move, this.accumulationMouseMove, this);
        sf.base.EventHandler.add(this.element, stop, this.accumulationMouseEnd, this);
        sf.base.EventHandler.add(this.element, start, this.accumulationMouseStart, this);
        sf.base.EventHandler.add(this.element, 'click', this.accumulationOnMouseClick, this);
        sf.base.EventHandler.add(this.element, 'contextmenu', this.accumulationRightClick, this);
        sf.base.EventHandler.add(this.element, cancel, this.accumulationMouseLeave, this);
        window.addEventListener((sf.base.Browser.isTouch && ('orientation' in window && 'onorientationchange' in window)) ? 'orientationchange' : 'resize', this.accumulationResize.bind(this));
        new sf.base.Touch(this.element); // To avoid geasture blocking for browser
        /*! Apply the style for chart */
        this.setStyle(this.element);
    };
    /**
     * Method to set mouse x, y from events
     */
    AccumulationChart.prototype.setMouseXY = function (e) {
        var pageX;
        var pageY;
        var svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        var rect = this.element.getBoundingClientRect();
        if (e.type.indexOf('touch') > -1) {
            this.isTouch = true;
            var touchArg = e;
            pageY = touchArg.changedTouches[0].clientY;
            pageX = touchArg.changedTouches[0].clientX;
        }
        else {
            this.isTouch = e.pointerType === 'touch' || e.pointerType === '2';
            pageX = e.clientX;
            pageY = e.clientY;
        }
        this.mouseY = (pageY - rect.top) - Math.max(svgRect.top - rect.top, 0);
        this.mouseX = (pageX - rect.left) - Math.max(svgRect.left - rect.left, 0);
    };
    /**
     * Handles the mouse end.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseEnd = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseUp, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY, this.isTouch);
            if (this.accumulationDataLabelModule && this.visibleSeries[0].dataLabel.visible) {
                this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY, this.isTouch);
            }
            if (this.accumulationLegendModule && this.legendSettings.visible) {
                this.accumulationLegendModule.move(e);
            }
        }
        this.notify(sf.base.Browser.touchEndEvent, e);
        return false;
    };
    /*public removeSvgOffset(x: number, y: number): ChartLocation {
        let rect: ClientRect = this.element.getBoundingClientRect();
        let svgRect: ClientRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        return { x: (x - rect.left) - Math.max(svgRect.left - rect.left, 0), y: (y - rect.top) - Math.max(svgRect.top - rect.top, 0)};
    }*/
    /**
     * Handles the mouse start.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseStart = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseDown, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        return false;
    };
    /**
     * Handles the accumulation chart resize.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationResize = function (e) {
        var _this = this;
        this.animateSeries = false;
        var args = {
            accumulation: this.isBlazor ? {} : this,
            previousSize: new sf.svgbase.Size(this.availableSize.width, this.availableSize.height),
            name: resized,
            currentSize: new sf.svgbase.Size(0, 0),
            chart: this.isBlazor ? {} : this,
        };
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        this.resizeTo = setTimeout(function () {
            if (_this.isDestroyed) {
                clearTimeout(_this.resizeTo);
                return;
            }
            calculateSize(_this);
            args.currentSize = _this.availableSize;
            _this.trigger(resized, args);
            _this.refreshSeries();
            _this.refreshChart();
        }, 500);
        return false;
    };
    /**
     * Handles the print method for accumulation chart control.
     */
    AccumulationChart.prototype.print = function (id) {
        // To handle the print funtion in IE and Edge browsers
        var clippath = document.getElementById(this.element.id + '_Series_0').style.clipPath;
        document.getElementById(this.element.id + '_Series_0').style.clipPath = '';
        var exportChart = new ExportUtils(this);
        exportChart.print(id);
        document.getElementById(this.element.id + '_Series_0').style.clipPath = clippath;
    };
    /**
     * Export method for the chart.
     */
    AccumulationChart.prototype.export = function (type, fileName) {
        if (this.exportModule) {
            this.exportModule.export(type, fileName);
            if (this.afterExport) {
                this.exportModule.getDataUrl(this);
            }
        }
    };
    /**
     * Applying styles for accumulation chart element
     */
    AccumulationChart.prototype.setStyle = function (element) {
        element.style.touchAction = 'element';
        element.style.msTouchAction = 'element';
        element.style.msContentZooming = 'none';
        element.style.msUserSelect = 'none';
        element.style.webkitUserSelect = 'none';
        element.style.position = 'relative';
        element.style.display = 'block';
    };
    /**
     * Method to set the annotation content dynamically for accumulation.
     */
    AccumulationChart.prototype.setAnnotationValue = function (annotationIndex, content) {
        var annotation = this.annotations[annotationIndex];
        var element;
        var parentNode = getElement(this.element.id + '_Annotation_Collections');
        if (content) {
            annotation.content = content;
            if (parentNode) {
                element = this.createElement('div');
                removeElement$1(this.element.id + '_Annotation_' + annotationIndex);
                this.annotationModule.processAnnotation(annotation, annotationIndex, element);
                parentNode.appendChild(element.children[0]);
            }
            else {
                this.annotationModule.renderAnnotations(getElement(this.element.id + '_Secondary_Element'));
            }
        }
    };
    /**
     * Handles the mouse move on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseMove = function (e) {
        if (!getElement(this.element.id + '_svg')) {
            return false;
        }
        this.setMouseXY(e);
        this.trigger(chartMouseMove, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.pointMove) {
            this.triggerPointEvent(pointMove, e.target);
        }
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.move(e);
        }
        if (this.accumulationDataLabelModule && this.visibleSeries[0] && this.visibleSeries[0].dataLabel.visible) {
            this.accumulationDataLabelModule.move(e, this.mouseX, this.mouseY);
        }
        if (!this.isTouch) {
            this.titleTooltip(e, this.mouseX, this.mouseY);
        }
        if (this.enableBorderOnMouseMove && this.type === 'Pie' && this.pieSeriesModule &&
            withInBounds(this.mouseX, this.mouseY, this.initialClipRect)) {
            this.pieSeriesModule.findSeries(e);
        }
        this.notify(sf.base.Browser.touchMoveEvent, e);
        return false;
    };
    AccumulationChart.prototype.titleTooltip = function (event, x, y, isTouch) {
        var targetId = event.target.id;
        var id = (targetId === (this.element.id + '_title') || targetId === (this.element.id + '_subTitle') ||
            targetId === (this.element.id + '_chart_legend_title'));
        if ((event.target.textContent.indexOf('...') > -1) && id) {
            var title = (targetId === (this.element.id + '_title')) ? this.title : (targetId === (this.element.id + '_subTitle')) ?
                this.subTitle : this.legendSettings.title;
            showTooltip(title, x, y, this.element.offsetWidth, this.element.id + '_EJ2_Title_Tooltip', getElement(this.element.id + '_Secondary_Element'), isTouch);
        }
        else {
            removeElement$1(this.element.id + '_EJ2_Title_Tooltip');
        }
    };
    /**
     * Handles the mouse click on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationOnMouseClick = function (e) {
        this.setMouseXY(e);
        if (this.accumulationLegendModule && this.legendSettings.visible) {
            this.accumulationLegendModule.click(e);
        }
        if (this.selectionMode !== 'None' && this.accumulationSelectionModule) {
            this.accumulationSelectionModule.calculateSelectedElements(this, e);
        }
        if (this.visibleSeries[0].explode) {
            this.accBaseModule.processExplode(e);
        }
        if (this.enableBorderOnMouseMove && this.pieSeriesModule && this.type === 'Pie') {
            this.pieSeriesModule.findSeries(e);
        }
        this.trigger(chartMouseClick, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        if (this.pointClick) {
            this.triggerPointEvent(pointClick, e.target);
        }
        return false;
    };
    AccumulationChart.prototype.triggerPointEvent = function (event, element) {
        var indexes = indexFinder(element.id, true);
        if (indexes.series >= 0 && indexes.point >= 0) {
            this.trigger(event, { series: this.isBlazor ? {} : this.series[indexes.series],
                point: this.series[indexes.series].points[indexes.point],
                seriesIndex: indexes.series, pointIndex: indexes.point,
                x: this.mouseX, y: this.mouseY });
        }
    };
    /**
     * Handles the mouse right click on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationRightClick = function (event) {
        if (event.buttons === 2 || event.pointerType === 'touch') {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        return true;
    };
    /**
     * Handles the mouse leave on accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.accumulationMouseLeave = function (e) {
        this.setMouseXY(e);
        this.trigger(chartMouseLeave, { target: e.target.id, x: this.mouseX, y: this.mouseY });
        this.notify(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', e);
        var borderElement = document.getElementById(this.element.id + 'PointHover_Border');
        if (borderElement) {
            this.pieSeriesModule.removeBorder(borderElement, 1000);
            borderElement = null;
        }
        return false;
    };
    /**
     * Method to set culture for chart
     */
    AccumulationChart.prototype.setCulture = function () {
        this.intl = new sf.base.Internationalization();
    };
    /**
     * Method to create SVG element for accumulation chart.
     */
    AccumulationChart.prototype.createPieSvg = function () {
        this.removeSvg();
        createSvg(this);
    };
    /**
     * To Remove the SVG from accumulation chart.
     * @return {boolean}
     * @private
     */
    AccumulationChart.prototype.removeSvg = function () {
        if (this.redraw) {
            return null;
        }
        blazorTemplatesReset(this);
        removeElement$1(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                sf.base.remove(this.svgObject);
            }
        }
        removeElement$1('EJ2_legend_tooltip');
        removeElement$1('EJ2_datalabel_tooltip');
        removeElement$1(this.element.id + 'PointHover_Border');
    };
    /**
     * Method to create the secondary element for tooltip, datalabel and annotaitons.
     */
    AccumulationChart.prototype.createSecondaryElement = function () {
        var element = redrawElement(this.redraw, this.element.id + '_Secondary_Element') ||
            this.createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: relative'
            });
        appendChildElement(false, this.element, element, this.redraw);
    };
    /**
     * Method to find visible series based on series types
     */
    AccumulationChart.prototype.calculateVisibleSeries = function () {
        this.visibleSeries = [];
        for (var i = 0, length_1 = this.series.length; i < length_1; i++) {
            this.series[i].index = i;
            if (this.series[i].type === this.type && this.visibleSeries.length === 0) {
                this.visibleSeries.push(this.series[i]);
                break;
            }
        }
    };
    /**
     * To find points from dataSource
     */
    AccumulationChart.prototype.processData = function (render) {
        if (render === void 0) { render = true; }
        this.seriesCounts = 0;
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            series.dataModule = new Data(series.dataSource || this.dataSource, series.query);
            series.refreshDataManager(this, render);
        }
    };
    /**
     * To refresh the accumulation chart
     * @private
     */
    AccumulationChart.prototype.refreshChart = function () {
        this.doGrouppingProcess();
        this.createPieSvg();
        this.calculateBounds();
        this.renderElements();
        removeElement$1('chartmeasuretext');
    };
    /**
     * Method to find groupped points
     */
    AccumulationChart.prototype.doGrouppingProcess = function () {
        var series = this.visibleSeries[0];
        if (!sf.base.isNullOrUndefined(series.resultData) && ((!sf.base.isNullOrUndefined(series.lastGroupTo) &&
            series.lastGroupTo !== series.groupTo))) {
            series.getPoints(series.resultData, this);
        }
    };
    /**
     * Method to calculate bounds for accumulation chart
     */
    AccumulationChart.prototype.calculateBounds = function () {
        this.initialClipRect = new sf.svgbase.Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height);
        this.titleCollection = [];
        this.subTitleCollection = [];
        var titleHeight = 0;
        var subTitleHeight = 0;
        var maxWidth = 0;
        var titleWidth = 0;
        this.titleCollection = getTitle(this.title, this.titleStyle, this.initialClipRect.width);
        titleHeight = this.title ? sf.svgbase.measureText(this.title, this.titleStyle).height * this.titleCollection.length : titleHeight;
        if (this.subTitle) {
            for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
                var titleText = _a[_i];
                titleWidth = sf.svgbase.measureText(titleText, this.titleStyle).width;
                maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
            }
            this.subTitleCollection = getTitle(this.subTitle, this.subTitleStyle, maxWidth);
            subTitleHeight = (sf.svgbase.measureText(this.subTitle, this.subTitleStyle).height * this.subTitleCollection.length);
        }
        subtractRect(this.initialClipRect, new sf.svgbase.Rect(0, (subTitleHeight + titleHeight), this.margin.right + this.margin.left, this.margin.bottom + this.margin.top));
        this.calculateLegendBounds();
    };
    /*
     * Method to calculate legend bounds for accumulation chart
     */
    AccumulationChart.prototype.calculateLegendBounds = function () {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        this.accumulationLegendModule.getLegendOptions(this, this.visibleSeries);
        this.accumulationLegendModule.calculateLegendBounds(this.initialClipRect, this.availableSize, null);
    };
    /**
     * To render elements for accumulation chart
     * @private
     */
    AccumulationChart.prototype.renderElements = function () {
        this.renderBorder();
        this.createSecondaryElement();
        this.renderSeries();
        this.renderTitle();
        this.renderLegend();
        appendChildElement(false, this.element, this.svgObject, this.redraw);
        this.processSelection();
        this.processExplode();
        this.renderAnnotation();
        this.setSecondaryElementPosition();
        sf.base.updateBlazorTemplate(this.element.id + '_DataLabel', 'Template', this.series[0].dataLabel);
        this.trigger('loaded', { accumulation: this.isBlazor ? {} : this, chart: this.isBlazor ? {} : this });
        this.animateSeries = false;
    };
    /**
     * To set the left and top position for data label template for center aligned chart
     * @private
     */
    AccumulationChart.prototype.setSecondaryElementPosition = function () {
        var tooltipParent = getElement(this.element.id + '_Secondary_Element');
        if (!tooltipParent) {
            return;
        }
        var rect = this.element.getBoundingClientRect();
        var svgRect = getElement(this.element.id + '_svg').getBoundingClientRect();
        tooltipParent.style.left = Math.max(svgRect.left - rect.left, 0) + 'px';
        tooltipParent.style.top = Math.max(svgRect.top - rect.top, 0) + 'px';
    };
    /**
     * To render the annotaitions for accumulation series.
     * @private
     */
    AccumulationChart.prototype.renderAnnotation = function () {
        if (this.annotationModule) {
            this.annotationModule.renderAnnotations(getElement(this.element.id + '_Secondary_Element'));
        }
    };
    /**
     * Method to process the explode in accumulation chart
     * @private
     */
    AccumulationChart.prototype.processExplode = function () {
        if (this.redraw) {
            return null;
        }
        if (!this.visibleSeries[0].explode) {
            return null;
        }
        this.accBaseModule.invokeExplode();
    };
    /**
     * Method to render series for accumulation chart
     */
    AccumulationChart.prototype.renderSeries = function () {
        if (!this.redraw) {
            this.svgObject.appendChild(this.renderer.createGroup({ id: this.element.id + '_SeriesCollection' }));
        }
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.visible && this[(firstToLowerCase(series.type) + 'SeriesModule')]) {
                this[(firstToLowerCase(series.type) + 'SeriesModule')].initProperties(this, series);
                series.renderSeries(this, this.redraw);
            }
        }
    };
    /**
     * Method to render border for accumulation chart
     */
    AccumulationChart.prototype.renderBorder = function () {
        var padding = this.border.width;
        appendChildElement(false, this.svgObject, this.renderer.drawRectangle(new RectOption(this.element.id + '_border', this.background || this.themeStyle.background, this.border, 1, new sf.svgbase.Rect(padding / 2, padding / 2, this.availableSize.width - padding, this.availableSize.height - padding))), this.redraw);
        // to draw back ground image for accumulation chart        
        var backGroundImage = this.backgroundImage;
        if (backGroundImage) {
            var image = new ImageOption(this.availableSize.height - padding, this.availableSize.width - padding, backGroundImage, 0, 0, this.element.id + '_background', 'visible', 'none');
            appendChildElement(false, this.svgObject, this.renderer.drawImage(image), this.redraw);
        }
    };
    /**
     * Method to render legend for accumulation chart
     */
    AccumulationChart.prototype.renderLegend = function () {
        if (!this.accumulationLegendModule || !this.legendSettings.visible) {
            return null;
        }
        if (this.accumulationLegendModule.legendCollections.length) {
            if (this.visibleSeries[0].type === 'Pie') {
                this.accumulationLegendModule.getSmartLegendLocation(this.visibleSeries[0].labelBound, this.accumulationLegendModule.legendBounds, this.margin);
            }
            this.accumulationLegendModule.renderLegend(this, this.legendSettings, this.accumulationLegendModule.legendBounds, this.redraw);
        }
    };
    /**
     * To process the selection in accumulation chart
     * @private
     */
    AccumulationChart.prototype.processSelection = function () {
        if (!this.accumulationSelectionModule || this.selectionMode === 'None') {
            return null;
        }
        var selectedDataIndexes = sf.base.extend([], this.accumulationSelectionModule.selectedDataIndexes, null, true);
        this.accumulationSelectionModule.invokeSelection(this);
        if (selectedDataIndexes.length > 0) {
            this.accumulationSelectionModule.selectedDataIndexes = selectedDataIndexes;
            this.accumulationSelectionModule.redrawSelection(this, this.selectionMode);
        }
    };
    /**
     * To render title for accumulation chart
     */
    AccumulationChart.prototype.renderTitle = function () {
        var rect;
        var margin = this.margin;
        if (!this.title) {
            return null;
        }
        var alignment = this.titleStyle.textAlignment;
        var getAnchor = alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        var titleSize = sf.svgbase.measureText(this.title, this.titleStyle);
        rect = new sf.svgbase.Rect(margin.left, 0, this.availableSize.width - margin.left - margin.right, 0);
        var options = new sf.svgbase.TextOption(this.element.id + '_title', titlePositionX(rect, this.titleStyle), this.margin.top + (titleSize.height * 3 / 4), getAnchor, this.titleCollection, '', 'auto');
        var element = textElement(this.renderer, options, this.titleStyle, this.titleStyle.color || this.themeStyle.chartTitle, this.svgObject, false, this.redraw);
        if (element) {
            element.setAttribute('aria-label', this.title);
        }
        if (this.subTitle) {
            this.renderSubTitle(options);
        }
    };
    AccumulationChart.prototype.renderSubTitle = function (options) {
        var maxWidth = 0;
        var titleWidth = 0;
        var padding = 10;
        var rect;
        var alignment = this.titleStyle.textAlignment;
        var getAnchor = function (alignment) {
            return alignment === 'Near' ? 'start' : alignment === 'Far' ? 'end' : 'middle';
        };
        var subTitleElementSize = sf.svgbase.measureText(this.subTitle, this.subTitleStyle);
        for (var _i = 0, _a = this.titleCollection; _i < _a.length; _i++) {
            var titleText = _a[_i];
            titleWidth = sf.svgbase.measureText(titleText, this.titleStyle).width;
            maxWidth = titleWidth > maxWidth ? titleWidth : maxWidth;
        }
        rect = new sf.svgbase.Rect(alignment === 'Center' ? (options.x - maxWidth / 2) : alignment === 'Far' ? options.x - maxWidth : options.x, 0, maxWidth, 0);
        var subTitleOption = new sf.svgbase.TextOption(this.element.id + '_subTitle', titlePositionX(rect, this.subTitleStyle), options.y * options.text.length + ((subTitleElementSize.height) * 3 / 4) + padding, getAnchor(this.subTitleStyle.textAlignment), this.subTitleCollection, '', 'auto');
        var element = textElement(this.renderer, subTitleOption, this.subTitleStyle, this.subTitleStyle.color || this.themeStyle.chartTitle, this.svgObject, false, this.redraw);
    };
    /**
     * To get the series parent element
     * @private
     */
    AccumulationChart.prototype.getSeriesElement = function () {
        return this.svgObject.getElementsByTagName('g')[0];
    };
    /**
     * To refresh the all visible series points
     * @private
     */
    AccumulationChart.prototype.refreshSeries = function () {
        for (var _i = 0, _a = this.visibleSeries; _i < _a.length; _i++) {
            var series = _a[_i];
            this.refreshPoints(series.points);
        }
    };
    /**
     * To refresh points label region and visible
     * @private
     */
    AccumulationChart.prototype.refreshPoints = function (points) {
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            point.labelPosition = null;
            point.labelRegion = null;
            point.labelVisible = true;
        }
    };
    /**
     * To get Module name
     *  @private
     */
    AccumulationChart.prototype.getModuleName = function () {
        return 'accumulationchart';
    };
    /**
     * To destroy the accumulationcharts
     * @private
     */
    AccumulationChart.prototype.destroy = function () {
        /**
         * To fix react timeout destroy issue.
         */
        if (this.element) {
            this.unWireEvents();
            _super.prototype.destroy.call(this);
            this.element.classList.remove('e-accumulationchart');
            this.element.innerHTML = '';
        }
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    AccumulationChart.prototype.requiredModules = function () {
        var modules = [];
        var enableAnnotation = false;
        modules.push({
            member: this.type + 'Series',
            args: [this]
        });
        if (this.legendSettings.visible) {
            modules.push({
                member: 'AccumulationLegend',
                args: [this]
            });
        }
        if (this.findDatalabelVisibility()) {
            modules.push({
                member: 'AccumulationDataLabel',
                args: [this]
            });
        }
        if (this.tooltip.enable) {
            modules.push({
                member: 'AccumulationTooltip',
                args: [this]
            });
        }
        if (this.selectionMode !== 'None') {
            modules.push({
                member: 'AccumulationSelection',
                args: [this]
            });
        }
        if (this.enableExport || this.allowExport) {
            modules.push({
                member: 'Export',
                args: [this]
            });
        }
        enableAnnotation = this.annotations.some(function (value) {
            return (value.content !== null);
        });
        if (enableAnnotation) {
            modules.push({
                member: 'Annotation',
                args: [this]
            });
        }
        return modules;
    };
    /**
     * To find datalabel visibility in series
     */
    AccumulationChart.prototype.findDatalabelVisibility = function () {
        for (var _i = 0, _a = this.series; _i < _a.length; _i++) {
            var series = _a[_i];
            if (series.dataLabel.visible) {
                return true;
            }
        }
        return false;
    };
    /**
     * Get visible series for accumulation chart by index
     */
    AccumulationChart.prototype.changeVisibleSeries = function (visibleSeries, index) {
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (index === series.index) {
                return series;
            }
        }
        return null;
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    AccumulationChart.prototype.getPersistData = function () {
        return '';
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    AccumulationChart.prototype.onPropertyChanged = function (newProp, oldProp) {
        var update = {
            refreshElements: false, refreshBounds: false
        };
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'theme':
                    this.animateSeries = true;
                    break;
                case 'title':
                case 'subTitle':
                case 'height':
                case 'width':
                case 'margin':
                    update.refreshBounds = true;
                    break;
                case 'titleStyle':
                    if (newProp.titleStyle && (newProp.titleStyle.size || newProp.titleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    }
                    else {
                        update.refreshElements = true;
                    }
                    break;
                case 'subTitleStyle':
                    if (newProp.subTitleStyle && (newProp.subTitleStyle.size || newProp.subTitleStyle.textOverflow)) {
                        update.refreshBounds = true;
                    }
                    else {
                        update.refreshElements = true;
                    }
                    break;
                case 'legendSettings':
                    update.refreshBounds = true;
                    update.refreshElements = true;
                    break;
                case 'dataSource':
                    this.processData(false);
                    update.refreshBounds = true;
                    break;
                case 'series':
                    if (!this.animateselected) {
                        var len = this.series.length;
                        var seriesRefresh = false;
                        var series = void 0;
                        var blazorProp = void 0;
                        for (var i = 0; i < len; i++) {
                            series = newProp.series[i];
                            if (this.isBlazor && (series.startAngle || series.endAngle || series.explodeOffset || series.neckHeight ||
                                series.neckWidth || series.radius || series.innerRadius || series.groupMode || series.emptyPointSettings)) {
                                blazorProp = true;
                            }
                            if (newProp.series[i] && (newProp.series[i].dataSource || newProp.series[i].yName || newProp.series[i].xName ||
                                blazorProp)) {
                                sf.base.extend(this.changeVisibleSeries(this.visibleSeries, i), series, null, true);
                                seriesRefresh = true;
                            }
                            if (newProp.series[i] && newProp.series[i].explodeIndex !== oldProp.series[i].explodeIndex) {
                                this.accBaseModule.explodePoints(newProp.series[i].explodeIndex, this);
                                this.accBaseModule.deExplodeAll(newProp.series[i].explodeIndex, this.enableAnimation ? 300 : 0);
                            }
                        }
                        if (seriesRefresh) {
                            this.processData(false);
                            update.refreshBounds = true;
                        }
                    }
                    this.animateselected = false;
                    this.redraw = false;
                    break;
                case 'locale':
                case 'currencyCode':
                    _super.prototype.refresh.call(this);
                    break;
                case 'background':
                case 'border':
                case 'annotations':
                case 'enableSmartLabels':
                    update.refreshElements = true;
                    break;
                case 'isMultiSelect':
                case 'selectedDataIndexes':
                case 'selectionMode':
                    if (this.accumulationSelectionModule) {
                        if (sf.base.isNullOrUndefined(this.accumulationSelectionModule.selectedDataIndexes)) {
                            this.accumulationSelectionModule.invokeSelection(this);
                        }
                        else {
                            this.accumulationSelectionModule.redrawSelection(this, oldProp.selectionMode);
                        }
                    }
                    break;
            }
        }
        if (!update.refreshBounds && update.refreshElements) {
            this.createPieSvg();
            this.renderElements();
        }
        else if (update.refreshBounds) {
            this.refreshSeries();
            this.createPieSvg();
            this.calculateBounds();
            this.renderElements();
        }
    };
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "width", void 0);
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "height", void 0);
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "title", void 0);
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "backgroundImage", void 0);
    __decorate([
        sf.base.Complex({}, PieCenter)
    ], AccumulationChart.prototype, "center", void 0);
    __decorate([
        sf.base.Property('')
    ], AccumulationChart.prototype, "dataSource", void 0);
    __decorate([
        sf.base.Complex(Theme.chartTitleFont, Font)
    ], AccumulationChart.prototype, "titleStyle", void 0);
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "subTitle", void 0);
    __decorate([
        sf.base.Complex(Theme.chartSubTitleFont, Font)
    ], AccumulationChart.prototype, "subTitleStyle", void 0);
    __decorate([
        sf.base.Complex({}, LegendSettings)
    ], AccumulationChart.prototype, "legendSettings", void 0);
    __decorate([
        sf.base.Complex({}, TooltipSettings)
    ], AccumulationChart.prototype, "tooltip", void 0);
    __decorate([
        sf.base.Property('None')
    ], AccumulationChart.prototype, "selectionMode", void 0);
    __decorate([
        sf.base.Property('None')
    ], AccumulationChart.prototype, "highLightMode", void 0);
    __decorate([
        sf.base.Property('None')
    ], AccumulationChart.prototype, "selectionPattern", void 0);
    __decorate([
        sf.base.Property('None')
    ], AccumulationChart.prototype, "highlightPattern", void 0);
    __decorate([
        sf.base.Property(true)
    ], AccumulationChart.prototype, "enableBorderOnMouseMove", void 0);
    __decorate([
        sf.base.Property(false)
    ], AccumulationChart.prototype, "isMultiSelect", void 0);
    __decorate([
        sf.base.Property(true)
    ], AccumulationChart.prototype, "enableAnimation", void 0);
    __decorate([
        sf.base.Collection([], Indexes)
    ], AccumulationChart.prototype, "selectedDataIndexes", void 0);
    __decorate([
        sf.base.Complex({}, Margin)
    ], AccumulationChart.prototype, "margin", void 0);
    __decorate([
        sf.base.Property(true)
    ], AccumulationChart.prototype, "enableSmartLabels", void 0);
    __decorate([
        sf.base.Complex({ color: '#DDDDDD', width: 0 }, Border)
    ], AccumulationChart.prototype, "border", void 0);
    __decorate([
        sf.base.Property(null)
    ], AccumulationChart.prototype, "background", void 0);
    __decorate([
        sf.base.Collection([{}], AccumulationSeries)
    ], AccumulationChart.prototype, "series", void 0);
    __decorate([
        sf.base.Collection([{}], AccumulationAnnotationSettings)
    ], AccumulationChart.prototype, "annotations", void 0);
    __decorate([
        sf.base.Property('Material')
    ], AccumulationChart.prototype, "theme", void 0);
    __decorate([
        sf.base.Property(false)
    ], AccumulationChart.prototype, "useGroupingSeparator", void 0);
    __decorate([
        sf.base.Property(true)
    ], AccumulationChart.prototype, "enableExport", void 0);
    __decorate([
        sf.base.Property(false)
    ], AccumulationChart.prototype, "allowExport", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "loaded", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "load", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "seriesRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "legendRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "textRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "tooltipRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "pointRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "annotationRender", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "beforePrint", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "chartMouseMove", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "chartMouseClick", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "pointClick", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "pointMove", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "animationComplete", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "chartMouseDown", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "chartMouseLeave", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "chartMouseUp", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "resized", void 0);
    __decorate([
        sf.base.Event()
    ], AccumulationChart.prototype, "afterExport", void 0);
    __decorate([
        sf.base.Property('USD')
    ], AccumulationChart.prototype, "currencyCode", void 0);
    AccumulationChart = __decorate([
        sf.base.NotifyPropertyChanges
    ], AccumulationChart);
    return AccumulationChart;
}(sf.base.Component));

/**
 * Defines the common behavior of funnel and pyramid series
 */
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
 * TriangularBase is used to calculate base functions for funnel/pyramid series.
 */
var TriangularBase = /** @class */ (function (_super) {
    __extends$10(TriangularBase, _super);
    function TriangularBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initializes the properties of funnel/pyramid series
     * @private
     */
    TriangularBase.prototype.initProperties = function (chart, series) {
        var actualChartArea = chart.initialClipRect;
        series.triangleSize = new sf.svgbase.Size(stringToNumber(series.width, actualChartArea.width), stringToNumber(series.height, actualChartArea.height));
        series.neckSize = new sf.svgbase.Size(stringToNumber(series.neckWidth, actualChartArea.width), stringToNumber(series.neckHeight, actualChartArea.height));
        this.defaultLabelBound(series, series.dataLabel.visible, series.dataLabel.position, chart);
        if (series.explodeOffset === '30%') {
            series.explodeOffset = '25px';
        }
        chart.explodeDistance = stringToNumber(series.explodeOffset, actualChartArea.width);
        var points = series.points;
        this.initializeSizeRatio(points, series);
    };
    /**
     * Initializes the size of the pyramid/funnel segments
     * @private
     */
    TriangularBase.prototype.initializeSizeRatio = function (points, series, reverse) {
        if (reverse === void 0) { reverse = false; }
        var sumOfPoints = series.sumOfPoints;
        //Limiting the ratio within the range of 0 to 1
        var gapRatio = Math.min(Math.max(series.gapRatio, 0), 1);
        //% equivalence of a value 1
        var coEff = 1 / (sumOfPoints * (1 + gapRatio / (1 - gapRatio)));
        var spacing = gapRatio / (points.length - 1);
        var y = 0;
        //starting from bottom
        for (var i = points.length - 1; i >= 0; i--) {
            var index = reverse ? points.length - 1 - i : i;
            if (points[index].visible) {
                var height = coEff * points[index].y;
                points[index].yRatio = y;
                points[index].heightRatio = height;
                y += height + spacing;
            }
        }
    };
    /**
     * Marks the label location from the set of points that forms a pyramid/funnel segment
     * @private
     */
    TriangularBase.prototype.setLabelLocation = function (series, point, points) {
        var last = points.length - 1;
        var bottom = series.type === 'Funnel' ? points.length - 2 : points.length - 1;
        var x = (points[0].x + points[bottom].x) / 2;
        var right = (points[1].x + points[bottom - 1].x) / 2;
        point.region = new sf.svgbase.Rect(x, points[0].y, right - x, points[bottom].y - points[0].y);
        point.symbolLocation = {
            x: point.region.x + point.region.width / 2,
            y: point.region.y + point.region.height / 2
        };
        point.labelOffset = {
            x: point.symbolLocation.x - (points[0].x + points[last].x) / 2,
            y: point.symbolLocation.y - (points[0].y + points[last].y) / 2
        };
    };
    /**
     * Finds the path to connect the list of points
     * @private
     */
    TriangularBase.prototype.findPath = function (locations) {
        var path = 'M';
        for (var i = 0; i < locations.length; i++) {
            path += locations[i].x + ' ' + locations[i].y;
            if (i !== locations.length - 1) {
                path += ' L';
            }
        }
        return path;
    };
    /**
     * To calculate data-label bounds
     * @private
     */
    TriangularBase.prototype.defaultLabelBound = function (series, visible, position, chart) {
        var x = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        var y = (chart.initialClipRect.height - series.triangleSize.height) / 2;
        var accumulationBound = new sf.svgbase.Rect(x, y, series.triangleSize.width, series.triangleSize.height);
        series.labelBound = new sf.svgbase.Rect(accumulationBound.x, accumulationBound.y, accumulationBound.width + accumulationBound.x, accumulationBound.height + accumulationBound.y);
        series.accumulationBound = accumulationBound;
        if (visible && position === 'Outside') {
            series.labelBound = new sf.svgbase.Rect(Infinity, Infinity, -Infinity, -Infinity);
        }
    };
    return TriangularBase;
}(AccumulationBase));

/**
 * Defines the behavior of a funnel series
 */
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
/**
 * FunnelSeries module used to render `Funnel` Series.
 */
var FunnelSeries = /** @class */ (function (_super) {
    __extends$9(FunnelSeries, _super);
    function FunnelSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Defines the path of a funnel segment
     */
    FunnelSeries.prototype.getSegmentData = function (point, series, chart) {
        var lineWidth;
        var topRadius;
        var bottomRadius;
        var endTop;
        var endBottom;
        var minRadius;
        var endMin;
        var bottomY;
        var area = series.triangleSize;
        var offset = 0;
        var extraSpace = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        var emptySpaceAtLeft = extraSpace + chart.initialClipRect.x;
        var seriesTop = chart.initialClipRect.y + (chart.initialClipRect.height - area.height) / 2;
        //defines the top and bottom of a segment
        var top = point.yRatio * area.height;
        var bottom = top + point.heightRatio * area.height;
        var neckSize = series.neckSize;
        lineWidth = neckSize.width + (area.width - neckSize.width) * ((area.height - neckSize.height - top) /
            (area.height - neckSize.height));
        topRadius = (area.width / 2) - lineWidth / 2;
        //Calculating the middle slope change and bottom
        endTop = topRadius + lineWidth;
        if (bottom > area.height - neckSize.height || area.height === neckSize.height) {
            lineWidth = neckSize.width;
        }
        else {
            lineWidth = neckSize.width + (area.width - neckSize.width) *
                ((area.height - neckSize.height - bottom) / (area.height - neckSize.height));
        }
        bottomRadius = (area.width / 2) - (lineWidth / 2);
        endBottom = bottomRadius + lineWidth;
        if (top >= area.height - neckSize.height) {
            topRadius = bottomRadius = minRadius = (area.width / 2) - neckSize.width / 2;
            endTop = endBottom = endMin = (area.width / 2) + neckSize.width / 2;
        }
        else if (bottom > (area.height - neckSize.height)) {
            minRadius = bottomRadius = (area.width / 2) - lineWidth / 2;
            endMin = endBottom = minRadius + lineWidth;
            bottomY = area.height - neckSize.height;
        }
        top += seriesTop;
        bottom += seriesTop;
        bottomY += seriesTop;
        var line1 = { x: emptySpaceAtLeft + offset + topRadius, y: top };
        var line2 = { x: emptySpaceAtLeft + offset + endTop, y: top };
        var line4 = { x: emptySpaceAtLeft + offset + endBottom, y: bottom };
        var line5 = { x: emptySpaceAtLeft + offset + bottomRadius, y: bottom };
        var line3 = { x: emptySpaceAtLeft + offset + endBottom, y: bottom };
        var line6 = { x: emptySpaceAtLeft + offset + bottomRadius, y: bottom };
        if (bottomY) {
            line3 = { x: emptySpaceAtLeft + offset + endMin, y: bottomY };
            line6 = { x: emptySpaceAtLeft + offset + minRadius, y: bottomY };
        }
        var polygon = [line1, line2, line3, line4, line5, line6];
        this.setLabelLocation(series, point, polygon);
        var direction = this.findPath(polygon);
        return direction;
    };
    /**
     * Renders a funnel segment
     * @private
     */
    FunnelSeries.prototype.renderPoint = function (point, series, chart, options, seriesGroup, redraw) {
        if (!point.visible) {
            removeElement$1(options.id);
            return null;
        }
        var direction = this.getSegmentData(point, series, chart);
        point.midAngle = 0;
        options.d = direction;
        appendChildElement(false, seriesGroup, chart.renderer.drawPath(options), redraw);
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    };
    /**
     * To get the module name of the funnel series.
     */
    FunnelSeries.prototype.getModuleName = function () {
        return 'FunnelSeries';
    };
    /**
     * To destroy the funnel series.
     * @return {void}
     * @private
     */
    FunnelSeries.prototype.destroy = function (accumulation) {
        /**
         * Destroys the funnel series
         */
    };
    return FunnelSeries;
}(TriangularBase));

/**
 * Defines the behavior of a pyramid series
 */
var __extends$11 = (undefined && undefined.__extends) || (function () {
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
 * PyramidSeries module used to render `Pyramid` Series.
 */
var PyramidSeries = /** @class */ (function (_super) {
    __extends$11(PyramidSeries, _super);
    function PyramidSeries() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Defines the path of a pyramid segment
     */
    PyramidSeries.prototype.getSegmentData = function (point, series, chart) {
        var area = series.triangleSize;
        //top of th series
        var seriesTop = chart.initialClipRect.y + (chart.initialClipRect.height - area.height) / 2;
        var offset = 0;
        var extraSpace = (chart.initialClipRect.width - series.triangleSize.width) / 2;
        var emptySpaceAtLeft = extraSpace + chart.initialClipRect.x;
        //top and bottom
        var top = point.yRatio;
        var bottom = point.yRatio + point.heightRatio;
        //width of the top and bottom edge
        var topRadius = 0.5 * (1 - point.yRatio);
        var bottomRadius = 0.5 * (1 - bottom);
        top += seriesTop / area.height;
        bottom += seriesTop / area.height;
        var line1 = {
            x: emptySpaceAtLeft + offset + topRadius * area.width,
            y: top * area.height
        };
        var line2 = {
            x: emptySpaceAtLeft + offset + (1 - topRadius) * area.width,
            y: top * area.height
        };
        var line3 = {
            x: emptySpaceAtLeft + offset + (1 - bottomRadius) * area.width,
            y: bottom * area.height
        };
        var line4 = {
            x: emptySpaceAtLeft + offset + bottomRadius * area.width,
            y: bottom * area.height
        };
        var polygon = [line1, line2, line3, line4];
        this.setLabelLocation(series, point, polygon);
        var direction = this.findPath(polygon);
        return direction;
    };
    /**
     * Initializes the size of the pyramid segments
     * @private
     */
    PyramidSeries.prototype.initializeSizeRatio = function (points, series) {
        if (series.pyramidMode === 'Linear') {
            _super.prototype.initializeSizeRatio.call(this, points, series, true);
        }
        else {
            this.calculateSurfaceSegments(series);
        }
    };
    /**
     * Defines the size of the pyramid segments, the surface of that will reflect the values
     */
    PyramidSeries.prototype.calculateSurfaceSegments = function (series) {
        var count = series.points.length;
        var sumOfValues = series.sumOfPoints;
        var y = [];
        var height = [];
        var gapRatio = Math.min(0, Math.max(series.gapRatio, 1));
        var gapHeight = gapRatio / (count - 1);
        var preSum = this.getSurfaceHeight(0, sumOfValues);
        var currY = 0;
        for (var i = 0; i < count; i++) {
            if (series.points[i].visible) {
                y[i] = currY;
                height[i] = this.getSurfaceHeight(currY, Math.abs(series.points[i].y));
                currY += height[i] + gapHeight * preSum;
            }
        }
        var coef = 1 / (currY - gapHeight * preSum);
        for (var i = 0; i < count; i++) {
            if (series.points[i].visible) {
                series.points[i].yRatio = coef * y[i];
                series.points[i].heightRatio = coef * height[i];
            }
        }
    };
    /**
     * Finds the height of pyramid segment
     */
    PyramidSeries.prototype.getSurfaceHeight = function (y, surface) {
        var result = this.solveQuadraticEquation(1, 2 * y, -surface);
        return result;
    };
    /**
     * Solves quadratic equation
     */
    PyramidSeries.prototype.solveQuadraticEquation = function (a, b, c) {
        var root1;
        var root2;
        var d = b * b - 4 * a * c;
        if (d >= 0) {
            var sd = Math.sqrt(d);
            root1 = (-b - sd) / (2 * a);
            root2 = (-b + sd) / (2 * a);
            return Math.max(root1, root2);
        }
        return 0;
    };
    /**
     * Renders a pyramid segment
     */
    PyramidSeries.prototype.renderPoint = function (point, series, chart, options, seriesGroup, redraw) {
        if (!point.visible) {
            sf.svgbase.removeElement(options.id);
            return null;
        }
        options.d = this.getSegmentData(point, series, chart);
        point.midAngle = 0;
        appendChildElement(false, seriesGroup, chart.renderer.drawPath(options), redraw);
        if (point.isExplode) {
            chart.accBaseModule.explodePoints(point.index, chart, true);
        }
    };
    /**
     * To get the module name of the Pyramid series.
     */
    PyramidSeries.prototype.getModuleName = function () {
        return 'PyramidSeries';
    };
    /**
     * To destroy the pyramid series
     * @return {void}
     * @private
     */
    PyramidSeries.prototype.destroy = function (accumulation) {
        /**
         * Destroys the pyramid series
         */
    };
    return PyramidSeries;
}(TriangularBase));

var __extends$12 = (undefined && undefined.__extends) || (function () {
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
 * AccumulationChart legend
 */
/**
 * AccumulationLegend module used to render `Legend` for Accumulation chart.
 */
var AccumulationLegend = /** @class */ (function (_super) {
    __extends$12(AccumulationLegend, _super);
    /**
     * Constructor for Accumulation Legend.
     * @param chart
     */
    function AccumulationLegend(chart) {
        var _this = _super.call(this, chart) || this;
        _this.library = _this;
        _this.titleRect = new sf.svgbase.Rect(0, chart.margin.top, 0, 0);
        return _this;
    }
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    AccumulationLegend.prototype.getLegendOptions = function (chart, series) {
        this.legendCollections = [];
        for (var i = 0; i < 1; i++) {
            var seriesType = series[i].type;
            if (seriesType === 'Pie' || seriesType === 'Doughnut') {
                seriesType = (series[i].innerRadius !== '0' && series[i].innerRadius !== '0%') ?
                    'Doughnut' : 'Pie';
            }
            for (var _i = 0, _a = series[i].points; _i < _a.length; _i++) {
                var point = _a[_i];
                if (!sf.base.isNullOrUndefined(point.x) && !sf.base.isNullOrUndefined(point.y)) {
                    this.legendCollections.push(new LegendOptions(point.x.toString(), point.color, series[i].legendShape, point.visible, seriesType, null, null, point.index, series[i].index));
                }
            }
        }
    };
    /**
     * To find legend bounds for accumulation chart.
     * @private
     */
    AccumulationLegend.prototype.getLegendBounds = function (availableSize, legendBounds, legend) {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        var extraWidth = 0;
        var extraHeight = 0;
        var padding = legend.padding;
        var titlePosition = legend.titlePosition;
        var titlePlusArrowSpace = 0;
        var arrowWidth = this.arrowWidth;
        var arrowHeight = legend.enablePages ? 0 : this.arrowHeight;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        }
        else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.width += extraWidth;
        legendBounds.height += extraHeight;
        var shapePadding = legend.shapePadding;
        var maximumWidth = 0;
        var shapeWidth = legend.shapeWidth;
        var rowWidth = 0;
        var rowCount = 0;
        var columnWidth = [];
        var columnHeight = 0;
        var legendWidth = 0;
        var titleHeight = 0;
        this.maxItemHeight = Math.max(sf.svgbase.measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        var legendEventArgs;
        var render = false;
        for (var _i = 0, _a = this.legendCollections; _i < _a.length; _i++) {
            var legendOption = _a[_i];
            legendEventArgs = { fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                name: 'legendRender', cancel: false };
            this.chart.trigger('legendRender', legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.textSize = sf.svgbase.measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                if (this.isVertical) {
                    ++rowCount;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + this.legendTitleSize.height + arrowHeight;
                    if ((rowCount * (this.maxItemHeight + padding)) + padding + arrowHeight > legendBounds.height) {
                        columnHeight = Math.max(columnHeight, (rowCount * (this.maxItemHeight + padding)) + padding + arrowHeight);
                        rowWidth = rowWidth + maximumWidth;
                        columnWidth.push(maximumWidth);
                        this.totalPages = Math.max(rowCount, this.totalPages || 1);
                        maximumWidth = 0;
                        rowCount = 1;
                    }
                    maximumWidth = Math.max(legendWidth, maximumWidth);
                }
                else {
                    if (!legend.enablePages) { // For new legend navigation support
                        titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                        titlePlusArrowSpace += arrowWidth;
                    }
                    rowWidth = rowWidth + legendWidth;
                    if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace)) {
                        maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - legendWidth));
                        if (rowCount === 0 && (legendWidth !== rowWidth)) {
                            rowCount = 1;
                        }
                        rowWidth = legendWidth;
                        rowCount++;
                        columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + this.legendTitleSize.height;
                    }
                }
            }
        }
        titleHeight = titlePosition === 'Top' ? this.legendTitleSize.height : 0;
        if (this.isVertical) {
            rowWidth = rowWidth + maximumWidth;
            this.isPaging = legendBounds.width < (rowWidth + padding);
            columnHeight = Math.max(columnHeight, ((this.totalPages || 1) * (this.maxItemHeight + padding)) + padding + arrowHeight);
            this.isPaging = this.isPaging && (this.totalPages > 1);
            if (columnWidth[columnWidth.length - 1] !== maximumWidth) {
                columnWidth.push(maximumWidth);
            }
        }
        else {
            this.isPaging = legendBounds.height < columnHeight;
            columnHeight = !legend.enablePages && this.isPaging ? (this.maxItemHeight + padding) + padding + titleHeight : columnHeight;
            this.totalPages = this.totalRowCount = rowCount;
            columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleHeight);
            if (!this.isPaging) { // For title left and right position
                rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
            }
        }
        this.maxColumns = 0; // initialization for max columns
        var width = this.isVertical ? this.getMaxColumn(columnWidth, legendBounds.width, padding, rowWidth + padding) :
            Math.max(rowWidth + padding, maximumWidth);
        if (render) { // if any legends not skipped in event check
            this.setBounds(width, columnHeight, legend, legendBounds);
        }
        else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    };
    /**
     * To find maximum column size for legend
     */
    AccumulationLegend.prototype.getMaxColumn = function (columns, width, padding, rowWidth) {
        var maxPageColumn = padding;
        this.maxColumnWidth = Math.max.apply(null, columns);
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var column = columns_1[_i];
            maxPageColumn += this.maxColumnWidth;
            this.maxColumns++;
            if (maxPageColumn + padding > width) {
                maxPageColumn -= this.maxColumnWidth;
                this.maxColumns--;
                break;
            }
        }
        this.isPaging = (maxPageColumn < rowWidth) && (this.totalPages > 1);
        if (maxPageColumn === padding) {
            maxPageColumn = width;
        }
        this.maxColumns = Math.max(1, this.maxColumns);
        this.maxWidth = maxPageColumn;
        return maxPageColumn;
    };
    /**
     * To find available width from legend x position.
     */
    AccumulationLegend.prototype.getAvailWidth = function (tx, width, legendX) {
        if (this.isVertical) {
            width = this.maxWidth;
        }
        return width - ((this.legend.padding * 2) + this.legend.shapeWidth + this.legend.shapePadding);
    };
    /**
     * To find legend rendering locations from legend options.
     * @private
     */
    AccumulationLegend.prototype.getRenderPoint = function (legendOption, start, textPadding, prevLegend, rect, count, firstLegend) {
        var padding = this.legend.padding;
        if (this.isVertical) {
            if (count === firstLegend || (prevLegend.location.y + (this.maxItemHeight * 1.5) + (padding * 2) > rect.y + rect.height)) {
                legendOption.location.x = prevLegend.location.x + ((count === firstLegend) ? 0 : this.maxColumnWidth);
                legendOption.location.y = start.y;
                this.pageXCollections.push(legendOption.location.x - (this.legend.shapeWidth / 2) - padding);
                this.totalPages++;
            }
            else {
                legendOption.location.x = prevLegend.location.x;
                legendOption.location.y = prevLegend.location.y + this.maxItemHeight + padding;
            }
        }
        else {
            var previousBound = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
            if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2)) {
                legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                    prevLegend.location.y + this.maxItemHeight + padding;
                legendOption.location.x = start.x;
            }
            else {
                legendOption.location.y = prevLegend.location.y;
                legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            }
            this.totalPages = this.totalRowCount;
        }
        var availablewidth = this.getAvailWidth(legendOption.location.x, this.legendBounds.width, this.legendBounds.x);
        legendOption.text = textTrim(+availablewidth.toFixed(4), legendOption.text, this.legend.textStyle);
    };
    /**
     * finding the smart legend place according to positions.
     * @return {void}
     * @private
     */
    AccumulationLegend.prototype.getSmartLegendLocation = function (labelBound, legendBound, margin) {
        var space;
        switch (this.position) {
            case 'Left':
                space = ((labelBound.x - legendBound.width) - margin.left) / 2;
                legendBound.x = (labelBound.x - legendBound.width) < margin.left ? legendBound.x :
                    (labelBound.x - legendBound.width) - space;
                break;
            case 'Right':
                space = ((this.chart.availableSize.width - margin.right) - (labelBound.x + labelBound.width + legendBound.width)) / 2;
                legendBound.x = (labelBound.x + labelBound.width + legendBound.width) > (this.chart.availableSize.width - margin.right) ?
                    legendBound.x : (labelBound.x + labelBound.width + space);
                break;
            case 'Top':
                this.getTitleRect(this.chart);
                space = ((labelBound.y - legendBound.height) - (this.titleRect.y + this.titleRect.height)) / 2;
                legendBound.y = (labelBound.y - legendBound.height) < margin.top ? legendBound.y :
                    (labelBound.y - legendBound.height) - space;
                break;
            case 'Bottom':
                space = ((this.chart.availableSize.height - margin.bottom) - (labelBound.y + labelBound.height + legendBound.height)) / 2;
                legendBound.y = labelBound.y + labelBound.height + legendBound.height > (this.chart.availableSize.height - margin.bottom) ?
                    legendBound.y : (labelBound.y + labelBound.height) + space;
                break;
        }
    };
    /**
     * To get title rect.
     */
    AccumulationLegend.prototype.getTitleRect = function (accumulation) {
        if (!accumulation.title) {
            return null;
        }
        var titleSize = sf.svgbase.measureText(accumulation.title, accumulation.titleStyle);
        this.titleRect = new sf.svgbase.Rect(accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
    };
    /**
     * To get legend by index
     */
    AccumulationLegend.prototype.legendByIndex = function (index, legendCollections) {
        for (var _i = 0, legendCollections_1 = legendCollections; _i < legendCollections_1.length; _i++) {
            var legend = legendCollections_1[_i];
            if (legend.pointIndex === index) {
                return legend;
            }
        }
        return null;
    };
    /**
     * To show or hide the legend on clicking the legend.
     * @return {void}
     */
    AccumulationLegend.prototype.click = function (event) {
        var targetId = event.target.id;
        var chart = this.chart;
        var legendItemsId = [this.legendID + '_text_', this.legendID + '_shape_',
            this.legendID + '_shape_marker_'];
        var selectedDataIndexes = [];
        if (this.chart.accumulationSelectionModule) {
            selectedDataIndexes = sf.base.extend([], this.chart.accumulationSelectionModule.selectedDataIndexes, null, true);
        }
        this.chart.animateSeries = false;
        for (var _i = 0, legendItemsId_1 = legendItemsId; _i < legendItemsId_1.length; _i++) {
            var id = legendItemsId_1[_i];
            if (targetId.indexOf(id) > -1) {
                var pointIndex = parseInt(targetId.split(id)[1], 10);
                if (this.chart.legendSettings.toggleVisibility && !isNaN(pointIndex)) {
                    var currentSeries = this.chart.visibleSeries[0];
                    var point = pointByIndex(pointIndex, currentSeries.points);
                    var legendOption = this.legendByIndex(pointIndex, this.legendCollections);
                    point.visible = !point.visible;
                    legendOption.visible = point.visible;
                    currentSeries.sumOfPoints += point.visible ? point.y : -point.y;
                    chart.redraw = chart.enableAnimation;
                    this.sliceVisibility(pointIndex, point.visible);
                    chart.removeSvg();
                    //To remove the blazor templates                  
                    blazorTemplatesReset(chart);
                    this.chart.refreshPoints(currentSeries.points);
                    this.chart.renderElements();
                }
                else if (this.chart.accumulationSelectionModule && !isNaN(pointIndex)) {
                    this.chart.accumulationSelectionModule.legendSelection(this.chart, 0, pointIndex);
                }
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        }
        else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        chart.redraw = false;
    };
    /**
     * To translate the point elements by index and position
     */
    AccumulationLegend.prototype.sliceVisibility = function (index, isVisible) {
        var sliceId = this.chart.element.id + '_Series_0_Point_';
        if (this.chart.visibleSeries[0].dataLabel.visible) {
            sliceId = this.chart.element.id + '_datalabel_Series_0_';
            this.sliceAnimate(getElement(sliceId + 'g_' + index), isVisible);
        }
    };
    /**
     * Slice animation
     * @param element
     * @param name
     * @param isVisible
     */
    AccumulationLegend.prototype.sliceAnimate = function (element, isVisible) {
        if (!element) {
            return null;
        }
        new sf.base.Animation({}).animate(element, {
            duration: 300,
            delay: 0,
            name: isVisible ? 'FadeIn' : 'FadeOut',
            end: function (args) {
                args.element.style.visibility = isVisible ? 'visible' : 'hidden';
            },
        });
    };
    /**
     * Get module name
     */
    AccumulationLegend.prototype.getModuleName = function () {
        return 'AccumulationLegend';
    };
    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    AccumulationLegend.prototype.destroy = function (chart) {
        /**
         * Destroy method calling here
         */
    };
    return AccumulationLegend;
}(BaseLegend));

var __extends$13 = (undefined && undefined.__extends) || (function () {
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
 * AccumulationChart DataLabel module file
 */
/**
 * AccumulationDataLabel module used to render `dataLabel`.
 */
var AccumulationDataLabel = /** @class */ (function (_super) {
    __extends$13(AccumulationDataLabel, _super);
    function AccumulationDataLabel(accumulation) {
        var _this = _super.call(this, accumulation) || this;
        _this.rightSideRenderingPoints = [];
        _this.leftSideRenderingPoints = [];
        _this.id = accumulation.element.id + '_datalabel_Series_';
        if (accumulation.title) {
            var titleSize = sf.svgbase.measureText(accumulation.title, accumulation.titleStyle);
            _this.titleRect = new sf.svgbase.Rect(accumulation.availableSize.width / 2 - titleSize.width / 2, accumulation.margin.top, titleSize.width, titleSize.height);
        }
        return _this;
    }
    /**
     * Method to get datalabel text location.
     * @private
     */
    AccumulationDataLabel.prototype.getDataLabelPosition = function (point, dataLabel, textSize, points, parent, id) {
        var radius = this.isCircular() ? (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);
        //let radius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);
        this.getLabelRegion(point, dataLabel.position, textSize, radius, this.marginValue);
        point.labelAngle = point.midAngle;
        point.labelPosition = dataLabel.position;
        if (this.accumulation.enableSmartLabels) {
            this.getSmartLabel(point, dataLabel, textSize, points, parent, id);
        }
    };
    /**
     * Method to get datalabel bound.
     */
    AccumulationDataLabel.prototype.getLabelRegion = function (point, position, textSize, labelRadius, margin, endAngle) {
        if (endAngle === void 0) { endAngle = 0; }
        var labelAngle = endAngle || point.midAngle;
        var space = 10;
        var location = degreeToLocation(labelAngle, labelRadius, this.isCircular() ? this.center :
            this.getLabelLocation(point, position));
        location.y = (position === 'Inside') ? (location.y - textSize.height / 2) : location.y;
        location.x = (position === 'Inside') ? (location.x - textSize.width / 2) : location.x;
        point.labelRegion = new sf.svgbase.Rect(location.x, location.y, textSize.width + (margin * 2), textSize.height + (margin * 2));
        if (position === 'Outside') {
            point.labelRegion.y -= point.labelRegion.height / 2;
            if (labelAngle >= 90 && labelAngle <= 270) {
                point.labelRegion.x -= (point.labelRegion.width + space);
            }
            else {
                point.labelRegion.x += space;
            }
        }
    };
    /**
     * Method to get datalabel smart position.
     */
    AccumulationDataLabel.prototype.getSmartLabel = function (point, dataLabel, textSize, points, parent, id) {
        var circular = this.isCircular();
        var labelRadius = circular ? this.radius : this.getLabelDistance(point, dataLabel);
        var connectorLength = circular ? (dataLabel.connectorStyle.length || '4%') :
            '0px';
        labelRadius += stringToNumber(connectorLength, labelRadius);
        var previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
        if (dataLabel.position === 'Inside') {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points)) || !circular && !containsRect(point.region, point.labelRegion)) {
                point.labelPosition = 'Outside';
                if (!circular) {
                    labelRadius = this.getLabelDistance(point, dataLabel);
                }
                this.getLabelRegion(point, point.labelPosition, textSize, labelRadius, this.marginValue);
                previousPoint = this.findPreviousPoint(points, point.index, point.labelPosition);
                if (previousPoint && (isOverlap(point.labelRegion, previousPoint.labelRegion) ||
                    this.isConnectorLineOverlapping(point, previousPoint))) {
                    this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
                }
            }
        }
        else {
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius, textSize, this.marginValue);
            }
        }
        if (this.isOverlapping(point, points) && (this.accumulation.type === 'Pyramid' || this.accumulation.type === 'Funnel')) {
            var position = 'OutsideLeft';
            var space = 10;
            var labelAngle = point.midAngle || 0;
            var labelRadius_1 = circular ? this.radius : this.getLabelDistance(point, dataLabel);
            var location_1 = degreeToLocation(labelAngle, -labelRadius_1, this.isCircular() ? this.center :
                this.getLabelLocation(point, position));
            point.labelRegion = new sf.svgbase.Rect(location_1.x, location_1.y, textSize.width + (this.marginValue * 2), textSize.height + (this.marginValue * 2));
            point.labelRegion.y -= point.labelRegion.height / 2;
            point.labelRegion.x = point.labelRegion.x - space - point.labelRegion.width;
            if (previousPoint && previousPoint.labelRegion && (isOverlap(point.labelRegion, previousPoint.labelRegion)
                || this.isOverlapping(point, points) || this.isConnectorLineOverlapping(point, previousPoint))) {
                this.setOuterSmartLabel(previousPoint, point, dataLabel.border.width, labelRadius_1, textSize, this.marginValue);
            }
        }
    };
    /**
     * To find trimmed datalabel tooltip needed.
     * @return {void}
     * @private
     */
    AccumulationDataLabel.prototype.move = function (e, x, y, isTouch) {
        var _this = this;
        if (e.target.textContent.indexOf('...') > -1) {
            var targetId = e.target.id.split(this.id);
            if (targetId.length === 2) {
                var seriesIndex = parseInt(targetId[1].split('_text_')[0], 10);
                var pointIndex = parseInt(targetId[1].split('_text_')[1], 10);
                if (!isNaN(seriesIndex) && !isNaN(pointIndex)) {
                    if (isTouch) {
                        removeElement$1(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
                    }
                    var point = getSeriesFromIndex(seriesIndex, (this.accumulation).visibleSeries).points[pointIndex];
                    showTooltip(point.text || point.y.toString(), x, y, this.areaRect.width, this.accumulation.element.id + '_EJ2_Datalabel_Tooltip', getElement(this.accumulation.element.id + '_Secondary_Element'));
                }
            }
        }
        else {
            removeElement$1(this.accumulation.element.id + '_EJ2_Datalabel_Tooltip');
        }
        if (isTouch) {
            clearTimeout(this.clearTooltip);
            this.clearTooltip = +setTimeout(function () { removeElement$1(_this.accumulation.element.id + '_EJ2_Datalabel_Tooltip'); }, 1000);
        }
    };
    /**
     * To find previous valid label point
     */
    AccumulationDataLabel.prototype.findPreviousPoint = function (points, index, position) {
        var point = points[0];
        for (var i = index - 1; i >= 0; i--) {
            point = points[i];
            if (point.visible && point.labelVisible && point.labelRegion && point.labelPosition === position) {
                return point;
            }
        }
        return null;
    };
    /**
     * To find current point datalabel is overlapping with other points
     */
    AccumulationDataLabel.prototype.isOverlapping = function (currentPoint, points) {
        for (var i = currentPoint.index - 1; i >= 0; i--) {
            if (points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    /**
     * To get text trimmed while exceeds the accumulation chart area.
     */
    AccumulationDataLabel.prototype.textTrimming = function (point, rect, font, position) {
        if (isOverlap(point.labelRegion, rect)) {
            var size = point.labelRegion.width;
            if (position === 'Right') {
                size = rect.x - point.labelRegion.x;
            }
            else if (position === 'Left') {
                size = point.labelRegion.x - (rect.x + rect.width);
                if (size < 0) {
                    size += point.labelRegion.width;
                    point.labelRegion.x = rect.x + rect.width;
                }
            }
            else if (position === 'InsideRight') {
                size = (rect.x + rect.width) - point.labelRegion.x;
            }
            else if (position === 'InsideLeft') {
                size = (point.labelRegion.x + point.labelRegion.width) - rect.x;
                if (size < point.labelRegion.width) {
                    point.labelRegion.x = rect.x;
                }
            }
            else {
                this.setPointVisibileFalse(point);
            }
            if (point.labelVisible && point.labelRegion) {
                if (size < point.labelRegion.width) {
                    point.label = textTrim(size - (this.marginValue * 2), point.label, font);
                    point.labelRegion.width = size;
                }
                if (point.label.length === 3 && point.label.indexOf('...') > -1) {
                    this.setPointVisibileFalse(point);
                }
            }
        }
    };
    /**
     * To set point label visible and region to disable.
     */
    AccumulationDataLabel.prototype.setPointVisibileFalse = function (point) {
        point.labelVisible = false;
        point.labelRegion = null;
    };
    /**
     * To set point label visible to enable.
     */
    AccumulationDataLabel.prototype.setPointVisibleTrue = function (point) {
        point.labelVisible = true;
    };
    /**
     * To set datalabel angle position for outside labels
     */
    AccumulationDataLabel.prototype.setOuterSmartLabel = function (previousPoint, point, border, labelRadius, textsize, margin) {
        if (!this.isCircular()) {
            this.setSmartLabelForSegments(point, previousPoint, labelRadius, textsize, margin);
        }
        else {
            var labelAngle = this.getOverlappedAngle(previousPoint.labelRegion, point.labelRegion, point.midAngle, border * 2);
            this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
            if (labelAngle > point.endAngle) {
                labelAngle = point.midAngle;
                //this.setPointVisibileFalse(point);
            }
            point.labelAngle = labelAngle;
            while (point.labelVisible && (isOverlap(previousPoint.labelRegion, point.labelRegion) || labelAngle <= previousPoint.labelAngle
                || this.isConnectorLineOverlapping(point, previousPoint))) {
                if (labelAngle > point.endAngle) {
                    //this.setPointVisibileFalse(point);
                    break;
                }
                point.labelAngle = labelAngle;
                this.getLabelRegion(point, 'Outside', textsize, labelRadius, margin, labelAngle);
                labelAngle += 0.1;
            }
        }
    };
    /**
     * Sets smart label positions for funnel and pyramid series
     */
    AccumulationDataLabel.prototype.setSmartLabelForSegments = function (point, prevPoint, distance, textSize, margin) {
        var textRegion = point.labelRegion;
        //let overlapWidth: number = prevPoint.labelRegion.x + prevPoint.labelRegion.width - textRegion.x;
        var overlapHeight = this.accumulation.type === 'Funnel' ?
            prevPoint.labelRegion.y - (textRegion.y + textRegion.height) :
            point.labelRegion.y - (prevPoint.labelRegion.y + prevPoint.labelRegion.height);
        if (overlapHeight < 0) {
            point.labelRegion.y += this.accumulation.type === 'Funnel' ? overlapHeight : -overlapHeight;
        }
    };
    /**
     * To find connector line overlapping.
     */
    AccumulationDataLabel.prototype.isConnectorLineOverlapping = function (point, previous) {
        var position;
        if (!this.isCircular() && point.labelRegion.x < point.region.x) {
            position = 'outsideLeft';
        }
        var start = this.getLabelLocation(point, position);
        var end = new ChartLocation(0, 0);
        this.getEdgeOfLabel(point.labelRegion, point.labelAngle, end, 0, point);
        var previousstart = this.getLabelLocation(previous);
        var previousend = new ChartLocation(0, 0);
        this.getEdgeOfLabel(previous.labelRegion, previous.labelAngle, previousend, 0, point);
        return this.isLineRectangleIntersect(start, end, point.labelRegion) ||
            this.isLineRectangleIntersect(start, end, previous.labelRegion) ||
            this.isLineRectangleIntersect(previousstart, previousend, point.labelRegion);
    };
    /**
     * To find two rectangle intersect
     */
    AccumulationDataLabel.prototype.isLineRectangleIntersect = function (line1, line2, rect) {
        var rectPoints = [
            new ChartLocation(Math.round(rect.x), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round(rect.y)),
            new ChartLocation(Math.round((rect.x + rect.width)), Math.round((rect.y + rect.height))),
            new ChartLocation(Math.round(rect.x), Math.round((rect.y + rect.height)))
        ];
        line1.x = Math.round(line1.x);
        line1.y = Math.round(line1.y);
        line2.x = Math.round(line2.x);
        line2.y = Math.round(line2.y);
        for (var i = 0; i < rectPoints.length; i++) {
            if (this.isLinesIntersect(line1, line2, rectPoints[i], rectPoints[(i + 1) % rectPoints.length])) {
                return true;
            }
        }
        return false;
    };
    /**
     * To find two line intersect
     */
    AccumulationDataLabel.prototype.isLinesIntersect = function (point1, point2, point11, point12) {
        var a1 = point2.y - point1.y;
        var b1 = point1.x - point2.x;
        var c1 = a1 * point1.x + b1 * point1.y;
        var a2 = point12.y - point11.y;
        var b2 = point11.x - point12.x;
        var c2 = a2 * point11.x + b2 * point11.y;
        var delta = a1 * b2 - a2 * b1;
        if (delta !== 0) {
            var x = (b2 * c1 - b1 * c2) / delta;
            var y = (a1 * c2 - a2 * c1) / delta;
            var lies = Math.min(point1.x, point2.x) <= x && x <= Math.max(point1.x, point2.x);
            lies = lies && Math.min(point1.y, point2.y) <= y && y <= Math.max(point1.y, point2.y);
            lies = lies && Math.min(point11.x, point12.x) <= x && x <= Math.max(point11.x, point12.x);
            lies = lies && Math.min(point11.y, point12.y) <= y && y <= Math.max(point11.y, point12.y);
            return lies;
        }
        return false;
    };
    /**
     * To get two rectangle overlapping angles.
     */
    AccumulationDataLabel.prototype.getOverlappedAngle = function (first, second, angle, padding) {
        var x = first.x;
        if (angle >= 90 && angle <= 270) {
            second.y = first.y - (padding + second.height / 2);
            x = first.x + first.width;
        }
        else {
            second.y = first.y + first.height + padding;
        }
        return getAngle(this.center, new ChartLocation(x, second.y));
    };
    /**
     * To get connector line path
     */
    AccumulationDataLabel.prototype.getConnectorPath = function (label, point, dataLabel, end) {
        if (end === void 0) { end = 0; }
        var connector = dataLabel.connectorStyle;
        var labelRadius = this.isCircular() ? (!this.isVariousRadius() ? this.labelRadius :
            this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], point)) :
            this.getLabelDistance(point, dataLabel);
        //let labelRadius: number = this.isCircular() ? this.labelRadius : this.getLabelDistance(point, dataLabel);
        var start = this.getConnectorStartPoint(point, connector);
        var labelAngle = this.accumulation.enableSmartLabels ? point.midAngle : end || point.midAngle;
        var middle = new ChartLocation(0, 0);
        var endPoint = this.getEdgeOfLabel(label, labelAngle, middle, connector.width, point);
        if (connector.type === 'Curve') {
            if (this.isCircular()) {
                var r = labelRadius - (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                    this.radius);
                //let r: number = labelRadius - this.radius;
                if (point.isLabelUpdated) {
                    middle = this.getPerpendicularDistance(start, point);
                }
                else {
                    middle = degreeToLocation(labelAngle, labelRadius - (r / 2), this.center);
                    if (point.labelPosition === 'Outside' && dataLabel.position === 'Inside') {
                        middle = degreeToLocation(labelAngle, labelRadius - r * 1.25, this.center);
                    }
                }
                return 'M ' + start.x + ' ' + start.y + ' Q ' + middle.x + ' ' + middle.y + ' ' + endPoint.x + ' ' + endPoint.y;
            }
            else {
                return this.getPolyLinePath(start, endPoint);
            }
        }
        else {
            return 'M ' + start.x + ' ' + start.y + ' L ' + middle.x + ' ' + middle.y + ' L ' + endPoint.x + ' ' + endPoint.y;
        }
    };
    /**
     * Finds the curved path for funnel/pyramid data label connectors
     */
    AccumulationDataLabel.prototype.getPolyLinePath = function (start, end) {
        var controlPoints = [start, end];
        if (start.y === end.y) {
            return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y;
        }
        var path = 'M';
        for (var i = 0; i <= 16; i++) {
            var t = i / 16;
            var points = this.getBezierPoint(t, controlPoints, 0, 2);
            path += points.x + ',' + points.y;
            if (i !== 16) {
                path += ' L';
            }
        }
        return path;
    };
    /**
     * Finds the bezier point for funnel/pyramid data label connectors
     */
    AccumulationDataLabel.prototype.getBezierPoint = function (t, controlPoints, index, count) {
        if (count === 1) {
            return controlPoints[index];
        }
        var p0 = this.getBezierPoint(t, controlPoints, index, count - 1);
        var p1 = this.getBezierPoint(t, controlPoints, index + 1, count - 1);
        var x = (p0.x) ? p0.x : p0.x;
        var y = (p0.y) ? p0.y : p0.y;
        var x1 = (p1.x) ? p1.x : p1.x;
        var y1 = (p1.y) ? p1.y : p1.y;
        var x2 = (1 - t) * x + t * x1;
        var y2 = (1 - t) * y + t * y1;
        if (p0.x) {
            return { x: x2, y: y2 };
        }
        else {
            return { x: x2, y: y2 };
        }
    };
    /**
     * To get label edges based on the center and label rect position.
     */
    AccumulationDataLabel.prototype.getEdgeOfLabel = function (labelshape, angle, middle, border, point) {
        if (border === void 0) { border = 1; }
        var edge = new ChartLocation(labelshape.x, labelshape.y);
        if (angle >= 90 && angle <= 270) {
            edge.x += labelshape.width + border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        }
        else if (point && point.region && point.region.x > point.labelRegion.x) {
            edge.x += border * 2 + labelshape.width;
            edge.y += labelshape.height / 2;
            middle.x = edge.x + 10;
            middle.y = edge.y;
        }
        else {
            edge.x -= border / 2;
            edge.y += labelshape.height / 2;
            middle.x = edge.x - 10;
            middle.y = edge.y;
        }
        return edge;
    };
    /**
     * Finds the distance between the label position and the edge/center of the funnel/pyramid
     */
    AccumulationDataLabel.prototype.getLabelDistance = function (point, dataLabel) {
        if (point.labelPosition && dataLabel.position !== point.labelPosition || dataLabel.connectorStyle.length) {
            var length_1 = stringToNumber(dataLabel.connectorStyle.length || '70px', this.accumulation.initialClipRect.width);
            if (length_1 < this.accumulation.initialClipRect.width) {
                return length_1;
            }
        }
        var position = point.labelPosition || dataLabel.position;
        var series = this.accumulation.visibleSeries[0];
        var extraSpace = (this.accumulation.initialClipRect.width - series.triangleSize.width) / 2;
        var labelLocation;
        switch (position) {
            case 'Inside':
                return 0;
            case 'Outside':
                labelLocation = point.symbolLocation.x + point.labelOffset.x;
                return this.accumulation.initialClipRect.width - labelLocation - extraSpace;
        }
    };
    /**
     * Finds the label position / beginning of the connector(ouside funnel labels)
     */
    AccumulationDataLabel.prototype.getLabelLocation = function (point, position) {
        if (position === void 0) { position = 'Outside'; }
        if (this.accumulation.type !== 'Pie') {
            position = position === 'OutsideLeft' ? 'OutsideLeft' : point.labelPosition || position;
            var location_2 = {
                x: point.symbolLocation.x,
                y: point.symbolLocation.y - point.labelOffset.y
            };
            switch (position) {
                case 'Inside':
                    location_2.y = point.region.y + point.region.height / 2;
                    break;
                case 'Outside':
                    location_2.x += point.labelOffset.x;
                    break;
                case 'OutsideLeft':
                    location_2.x -= point.labelOffset.x;
            }
            return location_2;
        }
        else {
            //return degreeToLocation(point.midAngle, this.radius, this.center);
            return degreeToLocation(point.midAngle, (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
                this.radius), this.center);
        }
    };
    /**
     * Finds the beginning of connector line
     */
    AccumulationDataLabel.prototype.getConnectorStartPoint = function (point, connector) {
        // return this.isCircular() ? degreeToLocation(point.midAngle, this.radius - connector.width, this.center) :
        //     this.getLabelLocation(point);
        var position;
        if (!this.isCircular() && point.region.x > point.labelRegion.x) {
            position = 'OutsideLeft';
        }
        return this.isCircular() ? degreeToLocation(point.midAngle, (this.isVariousRadius() ? stringToNumber(point.sliceRadius, this.accumulation.pieSeriesModule.seriesRadius) :
            this.radius) - connector.width, this.center) : this.getLabelLocation(point, position);
    };
    /**
     * To find area rect based on margin, available size.
     * @private
     */
    AccumulationDataLabel.prototype.findAreaRect = function () {
        this.areaRect = new sf.svgbase.Rect(0, 0, this.accumulation.availableSize.width, this.accumulation.availableSize.height);
        var margin = this.accumulation.margin;
        subtractThickness(this.areaRect, new Thickness(margin.left, margin.right, margin.top, margin.bottom));
    };
    /**
     * To render the data labels from series points.
     */
    AccumulationDataLabel.prototype.renderDataLabel = function (point, dataLabel, parent, points, series, templateElement, redraw) {
        var id = this.accumulation.element.id + '_datalabel_Series_' + series + '_';
        var datalabelGroup = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
        point.label = point.originalText || point.y.toString();
        var border = { width: dataLabel.border.width, color: dataLabel.border.color };
        var argsFont = (sf.base.extend({}, sf.base.getValue('properties', dataLabel.font), null, true));
        var argsData = {
            cancel: false, name: textRender, series: this.accumulation.visibleSeries[0], point: point,
            text: point.label, border: border, color: dataLabel.fill, template: dataLabel.template, font: argsFont
        };
        this.accumulation.trigger(textRender, argsData);
        point.argsData = argsData;
        var isTemplate = argsData.template !== null;
        point.labelVisible = !argsData.cancel;
        point.text = point.label = argsData.text;
        if (Number(point.label)) {
            point.label = this.accumulation.intl.formatNumber(+point.label, {
                useGrouping: this.accumulation.useGroupingSeparator
            });
        }
        this.marginValue = argsData.border.width ? (5 + argsData.border.width) : 1;
        var childElement = sf.base.createElement('div', {
            id: this.accumulation.element.id + '_Series_' + 0 + '_DataLabel_' + point.index,
            styles: 'position: absolute;background-color:' + argsData.color + ';' +
                getFontStyle(dataLabel.font) + ';border:' + argsData.border.width + 'px solid ' + argsData.border.color + ';'
        });
        var textSize = isTemplate ? this.getTemplateSize(childElement, point, argsData, redraw) :
            sf.svgbase.measureText(point.label, dataLabel.font);
        textSize.height += 4; // 4 for calculation with padding for smart label shape
        textSize.width += 4;
        point.textSize = textSize;
        point.templateElement = childElement;
        this.getDataLabelPosition(point, dataLabel, textSize, points, datalabelGroup, id);
        if (point.labelRegion) {
            this.correctLabelRegion(point.labelRegion, point.textSize);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    AccumulationDataLabel.prototype.drawDataLabels = function (series, dataLabel, parent, templateElement, redraw) {
        var angle;
        var degree;
        var modifiedPoints = series.leftSidePoints.concat(series.rightSidePoints);
        modifiedPoints.sort(function (a, b) { return a.index - b.index; });
        if (series.type === 'Pie' && this.accumulation.enableSmartLabels) {
            this.extendedLabelsCalculation();
        }
        for (var _i = 0, modifiedPoints_1 = modifiedPoints; _i < modifiedPoints_1.length; _i++) {
            var point = modifiedPoints_1[_i];
            if (!sf.base.isNullOrUndefined(point.argsData) && !sf.base.isNullOrUndefined(point.y)) {
                this.finalizeDatalabels(point, modifiedPoints, dataLabel);
                var id = this.accumulation.element.id + '_datalabel_Series_' + 0 + '_';
                var datalabelGroup = this.accumulation.renderer.createGroup({ id: id + 'g_' + point.index });
                var dataLabelElement = void 0;
                var location_3 = void 0;
                var element = void 0;
                if (point.visible && point.labelVisible) {
                    angle = degree = dataLabel.angle;
                    if (point.argsData.template) {
                        this.setTemplateStyle(point.templateElement, point, templateElement, dataLabel.font.color, point.color, redraw);
                    }
                    else {
                        location_3 = new ChartLocation(
                        // tslint:disable-next-line:max-line-length
                        point.labelRegion.x + this.marginValue, point.labelRegion.y + (point.textSize.height * 3 / 4) + this.marginValue);
                        element = getElement(id + 'shape_' + point.index);
                        var startLocation = element ? new ChartLocation(+element.getAttribute('x'), +element.getAttribute('y')) : null;
                        dataLabelElement = this.accumulation.renderer.drawRectangle(new RectOption(id + 'shape_' + point.index, point.argsData.color, point.argsData.border, 1, point.labelRegion, dataLabel.rx, dataLabel.ry));
                        appendChildElement(false, datalabelGroup, dataLabelElement, redraw, true, 'x', 'y', startLocation, null, false, false, null, this.accumulation.duration);
                        var textWidth = point.textSize.width;
                        var textHeight = point.textSize.height;
                        var rotate = void 0;
                        if (angle !== 0 && dataLabel.enableRotation) {
                            if (point.labelPosition === 'Outside') {
                                degree = 0;
                            }
                            else {
                                if (point.midAngle >= 90 && point.midAngle <= 270) {
                                    degree = point.midAngle + 180;
                                }
                                else {
                                    degree = point.midAngle;
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            rotate = 'rotate(' + degree + ',' + (location_3.x + (textWidth / 2)) + ',' + (location_3.y - (textHeight / 4)) + ')';
                        }
                        else {
                            if (angle) {
                                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
                            }
                            else {
                                degree = 0;
                            }
                            rotate = 'rotate(' + degree + ',' + (location_3.x + (textWidth / 2)) + ',' + (location_3.y) + ')';
                        }
                        point.transform = rotate;
                        textElement(this.accumulation.renderer, new sf.svgbase.TextOption(id + 'text_' + point.index, location_3.x, location_3.y, 'start', point.label, rotate, 'auto', degree), point.argsData.font, point.argsData.font.color || this.getSaturatedColor(point, point.argsData.color), datalabelGroup, false, redraw, true, false, this.accumulation.duration);
                        element = null;
                    }
                    // tslint:disable-next-line:max-line-length
                    if (this.accumulation.accumulationLegendModule && (dataLabel.position === 'Outside' || this.accumulation.enableSmartLabels)) {
                        this.accumulation.visibleSeries[0].findMaxBounds(this.accumulation.visibleSeries[0].labelBound, point.labelRegion);
                    }
                    if (point.labelPosition === 'Outside') {
                        var element_1 = getElement(id + 'connector_' + point.index);
                        var previousDirection = element_1 ? element_1.getAttribute('d') : '';
                        var pathElement = this.accumulation.renderer.drawPath(new sf.svgbase.PathOption(id + 'connector_' + point.index, 'transparent', dataLabel.connectorStyle.width, dataLabel.connectorStyle.color || point.color, 1, dataLabel.connectorStyle.dashArray, this.getConnectorPath(sf.base.extend({}, point.labelRegion, null, true), point, dataLabel, point.labelAngle)));
                        appendChildElement(false, datalabelGroup, pathElement, redraw, true, null, null, null, previousDirection, false, false, null, this.accumulation.duration);
                    }
                    appendChildElement(false, parent, datalabelGroup, redraw);
                }
            }
        }
    };
    /**
     * In this method datalabels region checked with legebdBounds and areaBounds.
     * Trimming of datalabel and point's visibility again changed here.
     * @param point current point in which trimming and visibility to be checked
     * @param points finalized points
     * @param dataLabel datalabel model
     */
    AccumulationDataLabel.prototype.finalizeDatalabels = function (point, points, dataLabel) {
        if (this.isOverlapping(point, points) ||
            (this.titleRect && point.labelRegion && isOverlap(point.labelRegion, this.titleRect))) {
            //this.setPointVisibileFalse(point);
        }
        if (this.accumulation.accumulationLegendModule && point.labelVisible && point.labelRegion) {
            var rect = this.accumulation.accumulationLegendModule.legendBounds;
            var padding = this.accumulation.legendSettings.border.width / 2;
            this.textTrimming(point, new sf.svgbase.Rect(rect.x - padding, rect.y - padding, rect.width + (2 * padding), rect.height + (2 * padding)), dataLabel.font, this.accumulation.accumulationLegendModule.position);
        }
        if (point.labelVisible && point.labelRegion) {
            var position = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';
            this.textTrimming(point, this.areaRect, dataLabel.font, position);
        }
        if (point.labelVisible && point.labelRegion && ((point.labelRegion.y + point.labelRegion.height >
            this.areaRect.y + this.areaRect.height || point.labelRegion.y < this.areaRect.y) || (point.labelRegion.x < this.areaRect.x ||
            point.labelRegion.x + point.labelRegion.width > this.areaRect.x + this.areaRect.width))) {
            this.setPointVisibileFalse(point);
        }
    };
    /**
     * To find the template element size
     * @param element
     * @param point
     * @param argsData
     */
    AccumulationDataLabel.prototype.getTemplateSize = function (element, point, argsData, redraw) {
        var clientRect;
        element = createTemplate(element, point.index, argsData.template, this.accumulation, point, this.accumulation.visibleSeries[0], this.accumulation.element.id + '_DataLabel');
        clientRect = measureElementRect(element, redraw);
        return { width: clientRect.width, height: clientRect.height };
    };
    /**
     * To set the template element style
     * @param childElement
     * @param point
     * @param parent
     * @param labelColor
     * @param fill
     */
    AccumulationDataLabel.prototype.setTemplateStyle = function (childElement, point, parent, labelColor, fill, redraw) {
        childElement.style.left = (point.labelRegion.x) + 'px';
        childElement.style.top = (point.labelRegion.y) + 'px';
        childElement.style.color = labelColor ||
            this.getSaturatedColor(point, fill);
        if (this.accumulation.isBlazor) {
            var position = this.isCircular() ? (point.labelRegion.x >= this.center.x) ? 'InsideRight' : 'InsideLeft' :
                (point.labelRegion.x >= point.region.x) ? 'InsideRight' : 'InsideLeft';
            if (position === 'InsideRight') {
                childElement.style.transform = 'translate(0%, -50%)';
            }
            else {
                childElement.style.transform = 'translate(-100%, -50%)';
            }
        }
        if (childElement.childElementCount) {
            appendChildElement(false, parent, childElement, redraw, true, 'left', 'top');
            this.doTemplateAnimation(this.accumulation, childElement);
        }
    };
    /**
     * To find saturated color for datalabel
     */
    AccumulationDataLabel.prototype.getSaturatedColor = function (point, color) {
        var saturatedColor;
        if (this.marginValue >= 1) {
            saturatedColor = color === 'transparent' ? this.getLabelBackground(point) : color;
        }
        else {
            saturatedColor = this.getLabelBackground(point);
        }
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        var rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        var contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    };
    /**
     * Animates the data label template.
     * @return {void}.
     * @private
     */
    AccumulationDataLabel.prototype.doTemplateAnimation = function (accumulation, element) {
        var series = accumulation.visibleSeries[0];
        var delay = series.animation.delay + series.animation.duration;
        if (series.animation.enable && accumulation.animateSeries) {
            element.style.visibility = 'hidden';
            templateAnimate(element, delay, 200, 'ZoomIn');
        }
    };
    /**
     * To find background color for the datalabel
     */
    AccumulationDataLabel.prototype.getLabelBackground = function (point) {
        return point.labelPosition === 'Outside' ?
            this.accumulation.background || this.accumulation.themeStyle.background : point.color;
    };
    /**
     * To correct the padding between datalabel regions.
     */
    AccumulationDataLabel.prototype.correctLabelRegion = function (labelRegion, textSize, padding) {
        if (padding === void 0) { padding = 4; }
        labelRegion.height -= padding;
        labelRegion.width -= padding;
        labelRegion.x += padding / 2;
        labelRegion.y += padding / 2;
        textSize.height -= padding;
        textSize.width -= padding;
    };
    /**
     * To get the dataLabel module name
     */
    AccumulationDataLabel.prototype.getModuleName = function () {
        return 'AccumulationDataLabel';
    };
    /**
     * To destroy the data label.
     * @return {void}
     * @private
     */
    AccumulationDataLabel.prototype.destroy = function (accumulation) {
        /**
         * Destroy method performed here
         */
    };
    //calculation for placing labels smartly
    AccumulationDataLabel.prototype.extendedLabelsCalculation = function () {
        var _this = this;
        var series = this.accumulation.series[0];
        series.rightSidePoints.forEach(function (point, index, halfSidePoints) {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            _this.skipPoints(point, halfSidePoints, index);
        });
        series.leftSidePoints.forEach(function (point, index, halfSidePoints) {
            point.initialLabelRegion = point.labelRegion;
            point.isLabelUpdated = 0;
            _this.skipPoints(point, halfSidePoints, index);
        });
        this.arrangeLeftSidePoints(series);
        this.isIncreaseAngle = false;
        this.arrangeRightSidePoints(series);
    };
    /**
     * Rightside points alignments calculation
     * @param series
     */
    AccumulationDataLabel.prototype.arrangeRightSidePoints = function (series) {
        var startFresh;
        var angleChanged;
        var rightSideRenderPoints = series.rightSidePoints.filter(function (point) { return (point.labelVisible && point.labelPosition === 'Outside'); });
        this.rightSideRenderingPoints = rightSideRenderPoints;
        var checkAngle;
        var currentPoint;
        var lastPoint = rightSideRenderPoints[rightSideRenderPoints.length - 1];
        var nextPoint;
        if (lastPoint) {
            if (lastPoint.labelAngle > 90 && lastPoint.labelAngle < 270) {
                this.isIncreaseAngle = true;
                this.changeLabelAngle(lastPoint, 89);
            }
        }
        /**
         * Right side points arranged from last point.
         * A point checked with successive points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 270, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (var i = rightSideRenderPoints.length - 1; i >= 0; i--) {
            currentPoint = rightSideRenderPoints[i];
            nextPoint = rightSideRenderPoints[i + 1];
            // A point checked for overlapping, label visibility
            if (this.isOverlapWithNext(currentPoint, rightSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle <= 90 || currentPoint.labelAngle >= 270)) {
                checkAngle = lastPoint.labelAngle + 10;
                angleChanged = true;
                //If last's point change angle in beyond the limit, stop the increasing angle and do decrease the angle.
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                else if (checkAngle > 90 && checkAngle < 270 && nextPoint.isLabelUpdated) {
                    this.isIncreaseAngle = true;
                }
                if (!this.isIncreaseAngle) {
                    for (var k = i + 1; k < rightSideRenderPoints.length; k++) {
                        this.increaseAngle(rightSideRenderPoints[k - 1], rightSideRenderPoints[k], series, true);
                    }
                }
                else {
                    for (var k = i + 1; k > 0; k--) {
                        this.decreaseAngle(rightSideRenderPoints[k], rightSideRenderPoints[k - 1], series, true);
                    }
                }
            }
            else {
                //If a point did not overlapped with previous points, increase the angle always for right side points.
                if (angleChanged && nextPoint && !nextPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    };
    /**
     * Leftside points alignments calculation
     * @param series
     */
    AccumulationDataLabel.prototype.arrangeLeftSidePoints = function (series) {
        var _this = this;
        var leftSideRenderPoints = series.leftSidePoints.filter(function (point) { return (point.labelVisible && point.labelPosition === 'Outside'); });
        this.leftSideRenderingPoints = leftSideRenderPoints;
        var previousPoint;
        var currentPoint;
        var angleChanged;
        var startFresh;
        /**
         * Left side points arranged from first point.
         * A point checked with previous points for overlapping.
         * If that is overlapped, its label angle is decreased and placing in optimal position
         * If one point's angle is decreased, its previous points in the half side points also decreased until it reaced optimum position.
         * When decreasing angle falls beyond 90, label angle increased.
         * If one point's angle is increased, its successive points in that half point also increased until it reaced optimum position.
         */
        for (var i = 0; i < leftSideRenderPoints.length; i++) {
            currentPoint = leftSideRenderPoints[i];
            previousPoint = leftSideRenderPoints[i - 1];
            // A point checked
            if (this.isOverlapWithPrevious(currentPoint, leftSideRenderPoints, i) && currentPoint.labelVisible
                || !(currentPoint.labelAngle < 270)) {
                angleChanged = true;
                if (startFresh) {
                    this.isIncreaseAngle = false;
                }
                if (!this.isIncreaseAngle) {
                    for (var k = i; k > 0; k--) {
                        this.decreaseAngle(leftSideRenderPoints[k], leftSideRenderPoints[k - 1], series, false);
                        leftSideRenderPoints.filter(function (point, index) {
                            if (point.isLabelUpdated && leftSideRenderPoints[index].labelAngle - 10 < 100) {
                                _this.isIncreaseAngle = true;
                            }
                        });
                    }
                }
                else {
                    for (var k = i; k < leftSideRenderPoints.length; k++) {
                        this.increaseAngle(leftSideRenderPoints[k - 1], leftSideRenderPoints[k], series, false);
                    }
                }
            }
            else {
                if (angleChanged && previousPoint && previousPoint.isLabelUpdated) {
                    startFresh = true;
                }
            }
        }
    };
    AccumulationDataLabel.prototype.decreaseAngle = function (currentPoint, previousPoint, series, isRightSide) {
        if (sf.base.isNullOrUndefined(currentPoint) || sf.base.isNullOrUndefined(previousPoint)) {
            return null;
        }
        var count = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                !((previousPoint.labelRegion.height + previousPoint.labelRegion.y) < currentPoint.labelRegion.y))) {
                var newAngle = previousPoint.midAngle - count;
                if (newAngle < 0) {
                    newAngle = 360 + newAngle;
                }
                if (newAngle <= 270 && newAngle >= 90) {
                    newAngle = 270;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                count++;
            }
        }
        else {
            if (currentPoint.labelAngle > 270) {
                this.changeLabelAngle(currentPoint, 270);
                previousPoint.labelAngle = 270;
            }
            while (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) || (!this.isVariousRadius() &&
                ((currentPoint.labelRegion.y + currentPoint.labelRegion.height) > previousPoint.labelRegion.y))) {
                var newAngle = previousPoint.midAngle - count;
                if (!(newAngle <= 270 && newAngle >= 90)) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(previousPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, previousPoint.labelRegion) &&
                    !series.leftSidePoints.indexOf(previousPoint) && (newAngle - 1 < 90 && newAngle - 1 > 270)) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle + 1);
                    this.arrangeLeftSidePoints(series);
                    break;
                }
                count++;
            }
        }
    };
    AccumulationDataLabel.prototype.increaseAngle = function (currentPoint, nextPoint, series, isRightSide) {
        if (sf.base.isNullOrUndefined(currentPoint) || sf.base.isNullOrUndefined(nextPoint)) {
            return null;
        }
        var count = 1;
        if (isRightSide) {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                !((currentPoint.labelRegion.y + currentPoint.labelRegion.height) < nextPoint.labelRegion.y))) {
                var newAngle = nextPoint.midAngle + count;
                if (newAngle < 270 && newAngle > 90) {
                    newAngle = 90;
                    this.isIncreaseAngle = true;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                if (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) && (newAngle + 1 > 90 && newAngle + 1 < 270) &&
                    this.rightSideRenderingPoints.indexOf(nextPoint) === this.rightSideRenderingPoints.length - 1) {
                    this.changeLabelAngle(currentPoint, currentPoint.labelAngle - 1);
                    nextPoint.labelRegion = nextPoint.initialLabelRegion;
                    this.arrangeRightSidePoints(series);
                    break;
                }
                count++;
            }
        }
        else {
            while (isOverlap(currentPoint.labelRegion, nextPoint.labelRegion) || (!this.isVariousRadius() &&
                (currentPoint.labelRegion.y < (nextPoint.labelRegion.y + nextPoint.labelRegion.height)))) {
                var newAngle = nextPoint.midAngle + count;
                if (!(newAngle < 270 && newAngle > 90)) {
                    newAngle = 270;
                    this.isIncreaseAngle = false;
                    break;
                }
                this.changeLabelAngle(nextPoint, newAngle);
                count++;
            }
        }
    };
    AccumulationDataLabel.prototype.changeLabelAngle = function (currentPoint, newAngle) {
        var dataLabel = this.accumulation.series[0].dataLabel;
        var variableR;
        if (!this.isVariousRadius()) {
            variableR = this.accumulation.pieSeriesModule.getLabelRadius(this.accumulation.visibleSeries[0], currentPoint);
        }
        //padding 10px is added to label radius for increasing the angle and avoid congestion.
        var labelRadius = (currentPoint.labelPosition === 'Outside' && this.accumulation.enableSmartLabels &&
            dataLabel.position === 'Inside') ?
            this.radius + stringToNumber(dataLabel.connectorStyle.length || '4%', this.accumulation.pieSeriesModule.size / 2) :
            (!this.isVariousRadius() ? this.accumulation.pieSeriesModule.labelRadius + 10 : variableR);
        var radius = (!this.isVariousRadius() ? labelRadius : variableR);
        this.getLabelRegion(currentPoint, 'Outside', currentPoint.textSize, radius, this.marginValue, newAngle);
        currentPoint.isLabelUpdated = 1;
        currentPoint.labelAngle = newAngle;
    };
    AccumulationDataLabel.prototype.isOverlapWithPrevious = function (currentPoint, points, currentPointIndex) {
        for (var i = 0; i < currentPointIndex; i++) {
            if (i !== points.indexOf(currentPoint) &&
                points[i].visible && points[i].labelVisible && points[i].labelRegion && currentPoint.labelRegion &&
                currentPoint.labelVisible && isOverlap(currentPoint.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    AccumulationDataLabel.prototype.isOverlapWithNext = function (point, points, pointIndex) {
        for (var i = pointIndex; i < points.length; i++) {
            if (i !== points.indexOf(point) && points[i].visible && points[i].labelVisible && points[i].labelRegion &&
                point.labelRegion && point.labelVisible && isOverlap(point.labelRegion, points[i].labelRegion)) {
                return true;
            }
        }
        return false;
    };
    AccumulationDataLabel.prototype.skipPoints = function (currentPoint, halfsidePoints, pointIndex) {
        if (pointIndex > 0 && ((currentPoint.midAngle < 285 && currentPoint.midAngle > 255) ||
            (currentPoint.midAngle < 105 && currentPoint.midAngle > 75))) {
            var previousPoint = halfsidePoints[pointIndex - 1];
            var angleDiff = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            var prevAngleDiff = previousPoint.endAngle % 360 - previousPoint.startAngle % 360;
            if (prevAngleDiff <= angleDiff && angleDiff < 5 && previousPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        }
        else if (pointIndex > 1 && ((currentPoint.midAngle < 300 && currentPoint.midAngle > 240) ||
            (currentPoint.midAngle < 120 && currentPoint.midAngle > 60))) {
            var prevPoint = halfsidePoints[pointIndex - 1];
            var secondPrevPoint = halfsidePoints[pointIndex - 2];
            var angleDiff = currentPoint.endAngle % 360 - currentPoint.startAngle % 360;
            var prevAngleDiff = prevPoint.endAngle % 360 - prevPoint.startAngle % 360;
            var thirdAngleDiff = secondPrevPoint.endAngle % 360 - secondPrevPoint.startAngle % 360;
            if (angleDiff < 3 && prevAngleDiff < 3 && thirdAngleDiff < 3 && prevPoint.labelVisible && currentPoint.labelVisible) {
                this.setPointVisibleTrue(currentPoint);
            }
        }
    };
    AccumulationDataLabel.prototype.getPerpendicularDistance = function (startPoint, point) {
        var increasedLocation;
        var add = 10;
        var height = add + 10 * Math.sin(point.midAngle * Math.PI / 360);
        if (point.midAngle > 270 && point.midAngle < 360) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((360 - point.midAngle) * Math.PI / 180)), startPoint.y - height * (Math.sin((360 - point.midAngle) * Math.PI / 180)));
        }
        else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x + height * (Math.cos((point.midAngle) * Math.PI / 180)), startPoint.y + height * (Math.sin((point.midAngle) * Math.PI / 180)));
        }
        else if (point.midAngle > 0 && point.midAngle < 90) {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 90) * Math.PI / 180)), startPoint.y + height * (Math.sin((point.midAngle - 90) * Math.PI / 180)));
        }
        else {
            increasedLocation = new ChartLocation(startPoint.x - height * (Math.cos((point.midAngle - 180) * Math.PI / 180)), startPoint.y - height * (Math.sin((point.midAngle - 180) * Math.PI / 180)));
        }
        return increasedLocation;
    };
    return AccumulationDataLabel;
}(AccumulationBase));

/**
 * To get the data on mouse move.
 * @private
 */
var ChartData = /** @class */ (function () {
    /**
     * Constructor for the data.
     * @private
     */
    function ChartData(chart) {
        /** @private */
        this.currentPoints = [];
        /** @private */
        this.previousPoints = [];
        this.insideRegion = false;
        this.chart = chart;
        this.lierIndex = 0;
    }
    /**
     * Method to get the Data.
     * @private
     */
    ChartData.prototype.getData = function () {
        var chart = this.chart;
        var point = null;
        var series = null;
        var width;
        var height;
        var mouseX;
        var mouseY;
        for (var len = chart.visibleSeries.length, i = len - 1; i >= 0; i--) {
            series = chart.visibleSeries[i];
            width = (series.type === 'Scatter' || series.drawType === 'Scatter' || (!series.isRectSeries && series.marker.visible))
                ? (series.marker.height + 5) / 2 : 0;
            height = (series.type === 'Scatter' || series.drawType === 'Scatter' || (!series.isRectSeries && series.marker.visible))
                ? (series.marker.width + 5) / 2 : 0;
            mouseX = chart.mouseX;
            mouseY = chart.mouseY;
            if (series.dragSettings.enable && series.isRectSeries) {
                if (!(series.type === 'Bar' && chart.isTransposed) && (chart.isTransposed || series.type === 'Bar')) {
                    var markerWidth = series.marker.width / 2;
                    mouseX = series.yAxis.isInversed ? mouseX + markerWidth : mouseX - markerWidth;
                }
                else {
                    var markerHeight = series.marker.height / 2;
                    mouseY = series.yAxis.isInversed ? mouseY - markerHeight : mouseY + markerHeight;
                }
            }
            if (series.visible && withInBounds(mouseX, mouseY, series.clipRect, width, height)) {
                point = this.getRectPoint(series, series.clipRect, mouseX, mouseY);
            }
            if (point) {
                return new PointData(point, series);
            }
        }
        return new PointData(point, series);
    };
    ChartData.prototype.isSelected = function (chart) {
        return ((chart.selectionMode.indexOf('Drag') > -1 || chart.selectionMode.indexOf('Lasso') > -1) && chart.selectionModule &&
            chart.selectionModule.rectPoints !== null);
    };
    ChartData.prototype.getRectPoint = function (series, rect, x, y) {
        var chart = this.chart;
        var fromCenterX;
        var fromCenterY;
        var clickAngle;
        var arcAngle = 0;
        var startAngle;
        var endAngle;
        var distanceFromCenter;
        if (chart.isScrolling) {
            return null;
        }
        for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
            var point = _a[_i];
            if (!point.regionData) {
                if (!point.regions || !point.regions.length) {
                    continue;
                }
            }
            if (point.regionData && this.chart.chartAreaType === 'PolarRadar' && series.drawType.indexOf('Column') > -1) {
                fromCenterX = x - (series.clipRect.width / 2 + series.clipRect.x);
                fromCenterY = y - (series.clipRect.height / 2 + series.clipRect.y);
                arcAngle = 2 * Math.PI * (point.regionData.currentXPosition < 0 ? 1 + point.regionData.currentXPosition
                    : point.regionData.currentXPosition);
                clickAngle = (Math.atan2(fromCenterY, fromCenterX) + 0.5 * Math.PI - arcAngle) % (2 * Math.PI);
                clickAngle = clickAngle < 0 ? 2 * Math.PI + clickAngle : clickAngle;
                clickAngle = clickAngle + 2 * Math.PI * series.chart.primaryXAxis.startAngle;
                startAngle = point.regionData.startAngle;
                startAngle -= arcAngle;
                startAngle = startAngle < 0 ? 2 * Math.PI + startAngle : startAngle;
                endAngle = point.regionData.endAngle;
                endAngle -= arcAngle;
                endAngle = endAngle < 0 ? 2 * Math.PI + endAngle : endAngle;
                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2));
                if (clickAngle >= startAngle && clickAngle <= endAngle &&
                    (((distanceFromCenter >= point.regionData.innerRadius && distanceFromCenter <= point.regionData.radius) ||
                        (distanceFromCenter <= point.regionData.innerRadius && distanceFromCenter >= point.regionData.radius))
                        && distanceFromCenter <= series.chart.radius)) {
                    return point;
                }
            }
            if (series.dragSettings.enable && series.isRectSeries) {
                if (this.rectRegion(x, y, point, rect, series)) {
                    this.insideRegion = true;
                    return point;
                }
            }
            if (!this.insideRegion && this.checkRegionContainsPoint(point.regions, rect, x, y)) {
                return point;
            }
            else if (this.insideRegion && this.checkRegionContainsPoint(point.regions, rect, x, y)) {
                return point;
            }
        }
        return null;
    };
    /**
     * Checks whether the region contains a point
     */
    ChartData.prototype.checkRegionContainsPoint = function (regionRect, rect, x, y) {
        var _this = this;
        return regionRect.some(function (region, index) {
            _this.lierIndex = index;
            return withInBounds(x, y, new sf.svgbase.Rect((_this.chart.chartAreaType === 'Cartesian' ? rect.x : 0) + region.x, (_this.chart.chartAreaType === 'Cartesian' ? rect.y : 0) + region.y, region.width, region.height));
        });
    };
    /**
     * To find drag region for column and bar series
     * @param x
     * @param y
     * @param point
     * @param rect
     * @param series
     */
    ChartData.prototype.rectRegion = function (x, y, point, rect, series) {
        var _this = this;
        var isBar = series.type === 'Bar';
        var isInversed = series.yAxis.isInversed;
        var isTransposed = series.chart.isTransposed;
        var heightValue = 10;
        var yValue = 0;
        var xValue = 0;
        var width;
        var height = width = 2 * heightValue;
        if (isInversed && isTransposed) {
            if (isBar) {
                yValue = point.regions[0].height - heightValue;
                width = point.regions[0].width;
            }
            else {
                xValue = -heightValue;
                height = point.regions[0].height;
            }
        }
        else if (isInversed || point.yValue < 0) {
            if (isBar) {
                xValue = -heightValue;
                height = point.regions[0].height;
            }
            else {
                yValue = point.regions[0].height - heightValue;
                width = point.regions[0].width;
            }
        }
        else if (isTransposed) {
            if (isBar) {
                yValue = -heightValue;
                width = point.regions[0].width;
            }
            else {
                xValue = point.regions[0].width - heightValue;
                height = point.regions[0].height;
            }
        }
        else {
            if (isBar) {
                xValue = point.regions[0].width - heightValue;
                height = point.regions[0].height;
            }
            else {
                yValue = -heightValue;
                width = point.regions[0].width;
            }
        }
        return point.regions.some(function (region) {
            return withInBounds(x, y, new sf.svgbase.Rect((_this.chart.chartAreaType === 'Cartesian' ? rect.x : 0) + region.x + xValue, (_this.chart.chartAreaType === 'Cartesian' ? rect.y : 0) + region.y + yValue, width, height));
        });
    };
    /**
     * @private
     */
    ChartData.prototype.getClosest = function (series, value) {
        var xData = series.xData;
        var closest;
        if (value >= series.xMin - 0.5 && value <= series.xMax + 0.5) {
            for (var _i = 0, xData_1 = xData; _i < xData_1.length; _i++) {
                var data = xData_1[_i];
                if (closest == null || Math.abs(data - value) < Math.abs(closest - value)) {
                    closest = data;
                }
            }
        }
        else if (xData.length === 1) {
            closest = xData[0];
        }
        return closest;
    };
    ChartData.prototype.getClosestX = function (chart, series) {
        var value;
        var rect = series.clipRect;
        if (!chart.requireInvertedAxis) {
            value = getValueXByPoint(chart.mouseX - rect.x, rect.width, series.xAxis);
        }
        else {
            value = getValueYByPoint(chart.mouseY - rect.y, rect.height, series.xAxis);
        }
        var closest = this.getClosest(series, value);
        for (var _i = 0, _a = series.points; _i < _a.length; _i++) {
            var point = _a[_i];
            if (closest === point.xValue && point.visible) {
                return new PointData(point, series);
            }
        }
        return null;
    };
    return ChartData;
}());

var __extends$15 = (undefined && undefined.__extends) || (function () {
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
 * Tooltip Module used to render the tooltip for series.
 */
var BaseTooltip = /** @class */ (function (_super) {
    __extends$15(BaseTooltip, _super);
    /**
     * Constructor for tooltip module.
     * @private.
     */
    function BaseTooltip(chart) {
        var _this = _super.call(this, chart) || this;
        _this.element = _this.chart.element;
        _this.textStyle = chart.tooltip.textStyle;
        _this.control = chart;
        return _this;
    }
    BaseTooltip.prototype.getElement = function (id) {
        return document.getElementById(id);
    };
    /**
     * Renders the tooltip.
     * @return {void}
     * @private
     */
    BaseTooltip.prototype.getTooltipElement = function (isTooltip) {
        this.inverted = this.chart.requireInvertedAxis;
        this.header = (this.control.tooltip.header === null) ?
            ((this.control.tooltip.shared) ? '<b>${point.x}</b>' : '<b>${series.name}</b>')
            : (this.control.tooltip.header);
        this.formattedText = [];
        var tooltipDiv = document.getElementById(this.chart.element.id + '_tooltip');
        var isStockChart = this.chart.element.id.indexOf('stockChart') > -1;
        if (!isTooltip && !tooltipDiv || isStockChart) {
            return this.createElement();
        }
        return null;
    };
    BaseTooltip.prototype.createElement = function () {
        var tooltipDiv = document.createElement('div');
        tooltipDiv.id = this.element.id + '_tooltip';
        tooltipDiv.className = 'ejSVGTooltip';
        tooltipDiv.setAttribute('style', 'pointer-events:none; position:absolute;z-index: 1');
        return tooltipDiv;
    };
    BaseTooltip.prototype.pushData = function (data, isFirst, tooltipDiv, isChart) {
        if (data.series.enableTooltip) {
            if (isChart) {
                this.currentPoints.push(data);
            }
            else {
                this.currentPoints.push(data);
            }
            this.stopAnimation();
            if (tooltipDiv && !document.getElementById(tooltipDiv.id)) {
                if (!this.chart.stockChart) {
                    document.getElementById(this.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                }
                else {
                    document.getElementById(this.chart.stockChart.element.id + '_Secondary_Element').appendChild(tooltipDiv);
                }
            }
            return true;
        }
        return false;
    };
    BaseTooltip.prototype.removeHighlight = function (chart) {
        var item;
        var series;
        for (var i = 0, len = this.previousPoints.length; i < len; i++) {
            item = this.previousPoints[i];
            if (item.series.isRectSeries) {
                if (item.series.visible) {
                    this.highlightPoint(item.series, item.point.index, false);
                }
                continue;
            }
            series = item.series;
            if (!series.marker.visible && item.series.type !== 'Scatter' && item.series.type !== 'Bubble') {
                this.previousPoints.shift();
                len -= 1;
            }
        }
    };
    BaseTooltip.prototype.highlightPoint = function (series, pointIndex, highlight) {
        var element = this.getElement(this.element.id + '_Series_' + series.index + '_Point_' + pointIndex);
        var selectionModule = this.control.accumulationSelectionModule;
        var isSelectedElement = selectionModule && selectionModule.selectedDataIndexes.length > 0 ? true : false;
        if (element) {
            if ((!isSelectedElement || isSelectedElement && element.getAttribute('class')
                && element.getAttribute('class').indexOf('_ej2_chart_selection_series_') === -1)) {
                element.setAttribute('opacity', (highlight ? series.opacity / 2 : series.opacity).toString());
            }
            else {
                element.setAttribute('opacity', series.opacity.toString());
            }
        }
    };
    BaseTooltip.prototype.highlightPoints = function () {
        for (var _i = 0, _a = this.currentPoints; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.series.isRectSeries && item.series.category === 'Series') {
                this.highlightPoint(item.series, item.point.index, true);
            }
        }
    };
    BaseTooltip.prototype.createTooltip = function (chart, isFirst, location, clipLocation, point, shapes, offset, bounds, extraPoints, templatePoint, customTemplate) {
        if (extraPoints === void 0) { extraPoints = null; }
        if (templatePoint === void 0) { templatePoint = null; }
        var series = this.currentPoints[0].series;
        var module = chart.tooltipModule || chart.accumulationTooltipModule;
        if (!module) { // For the tooltip enable is false.
            return;
        }
        if (isFirst) {
            this.svgTooltip = new sf.svgbase.Tooltip({
                opacity: chart.tooltip.opacity,
                header: this.headerText, content: this.text, fill: chart.tooltip.fill, border: chart.tooltip.border,
                enableAnimation: chart.tooltip.enableAnimation, location: location, shared: chart.tooltip.shared,
                shapes: shapes, clipBounds: this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation,
                areaBounds: bounds, palette: this.findPalette(), template: customTemplate || chart.tooltip.template, data: templatePoint,
                theme: chart.theme, offset: offset, textStyle: chart.tooltip.textStyle,
                isNegative: (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0),
                inverted: this.chart.requireInvertedAxis && series.isRectSeries,
                arrowPadding: this.text.length > 1 || this.chart.stockChart ? 0 : 12,
                availableSize: chart.availableSize, duration: this.chart.tooltip.duration,
                isCanvas: this.chart.enableCanvas, isTextWrap: chart.tooltip.enableTextWrap && chart.getModuleName() === 'chart',
                blazorTemplate: { name: 'Template', parent: this.chart.tooltip },
                tooltipRender: function () {
                    module.removeHighlight(module.control);
                    module.highlightPoints();
                    module.updatePreviousPoint(extraPoints);
                },
                animationComplete: function (args) {
                    if (args.tooltip.fadeOuted) {
                        module.fadeOut(module.previousPoints, chart);
                    }
                }
            }, '#' + this.element.id + '_tooltip');
        }
        else {
            if (this.svgTooltip) {
                this.svgTooltip.location = location;
                this.svgTooltip.content = this.text;
                this.svgTooltip.header = this.headerText;
                this.svgTooltip.offset = offset;
                this.svgTooltip.palette = this.findPalette();
                this.svgTooltip.shapes = shapes;
                this.svgTooltip.data = templatePoint;
                this.svgTooltip.template = chart.tooltip.template;
                this.svgTooltip.textStyle = chart.tooltip.textStyle;
                this.svgTooltip.isNegative = (series.isRectSeries && series.type !== 'Waterfall' && point && point.y < 0);
                this.svgTooltip.clipBounds = this.chart.chartAreaType === 'PolarRadar' ? new ChartLocation(0, 0) : clipLocation;
                this.svgTooltip.arrowPadding = this.text.length > 1 || this.chart.stockChart ? 0 : 12;
                this.svgTooltip.dataBind();
            }
        }
    };
    BaseTooltip.prototype.findPalette = function () {
        var colors = [];
        for (var _i = 0, _a = this.currentPoints; _i < _a.length; _i++) {
            var data = _a[_i];
            colors.push(this.findColor(data, data.series));
        }
        return colors;
    };
    BaseTooltip.prototype.findColor = function (data, series) {
        if (series.isRectSeries && (series.type === 'Candle' || series.type === 'Hilo' || series.type === 'HiloOpenClose')) {
            return data.point.color;
        }
        else {
            return (data.point.color && data.point.color !== '#ffffff' ? data.point.color
                : data.point.interior) ||
                series.marker.fill || series.interior;
        }
    };
    BaseTooltip.prototype.updatePreviousPoint = function (extraPoints) {
        if (extraPoints) {
            this.currentPoints = this.currentPoints.concat(extraPoints);
        }
        this.previousPoints = sf.base.extend([], this.currentPoints, null, true);
    };
    BaseTooltip.prototype.fadeOut = function (data, chart) {
        var svgElement = this.chart.enableCanvas ? this.getElement(this.element.id + '_tooltip_group') :
            this.getElement(this.element.id + '_tooltip_svg');
        var isTooltip = (svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0);
        if (!isTooltip) {
            this.valueX = null;
            this.valueY = null;
            this.currentPoints = [];
            this.removeHighlight(chart);
            this.removeHighlightedMarker(data);
            this.svgTooltip = null;
            this.control.trigger('animationComplete', {});
        }
    };
    /*
    * @hidden
    */
    BaseTooltip.prototype.removeHighlightedMarker = function (data) {
        if (this.chart.markerRender) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                removeElement$1(this.element.id + '_Series_' + item.series.index +
                    '_Point_' + item.point.index + '_Trackball');
            }
            this.chart.markerRender.removeHighlightedMarker();
        }
        this.previousPoints = [];
    };
    // public triggerEvent(point: PointData | AccPointData, isFirst: boolean, textCollection: string, firstText: boolean = true): boolean {
    //     let argsData: ITooltipRenderEventArgs = {
    //         cancel: false, name: tooltipRender, text: textCollection,
    //         point: point.point, series: point.series, textStyle: this.textStyle
    //     };
    //     this.chart.trigger(tooltipRender, argsData);
    //     if (!argsData.cancel) {
    //         if (point.series.type === 'BoxAndWhisker') {
    //             this.removeText();
    //             isFirst = true;
    //         }
    //         this.formattedText = this.formattedText.concat(argsData.text);
    //         this.text = this.formattedText;
    //     }
    //     return !argsData.cancel;
    // }
    BaseTooltip.prototype.removeText = function () {
        this.textElements = [];
        var element = this.getElement(this.element.id + '_tooltip_group');
        if (element && element.childNodes.length > 0) {
            while (element.lastChild && element.childNodes.length !== 1) {
                element.removeChild(element.lastChild);
            }
        }
    };
    BaseTooltip.prototype.stopAnimation = function () {
        stopTimer(this.toolTipInterval);
    };
    /**
     * Removes the tooltip on mouse leave.
     * @return {void}
     * @private
     */
    BaseTooltip.prototype.removeTooltip = function (duration) {
        var _this = this;
        var tooltipElement = this.getElement(this.element.id + '_tooltip');
        this.stopAnimation();
        if (tooltipElement && this.previousPoints.length > 0) {
            this.toolTipInterval = setTimeout(function () {
                if (_this.svgTooltip) {
                    _this.svgTooltip.fadeOut();
                }
            }, duration);
        }
    };
    return BaseTooltip;
}(ChartData));

var __extends$14 = (undefined && undefined.__extends) || (function () {
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
 * AccumulationChart Tooltip file
 */
/**
 * `AccumulationTooltip` module is used to render tooltip for accumulation chart.
 */
var AccumulationTooltip = /** @class */ (function (_super) {
    __extends$14(AccumulationTooltip, _super);
    function AccumulationTooltip(accumulation) {
        var _this = _super.call(this, accumulation) || this;
        _this.accumulation = accumulation;
        _this.addEventListener();
        return _this;
    }
    /**
     * @hidden
     */
    AccumulationTooltip.prototype.addEventListener = function () {
        if (this.accumulation.isDestroyed) {
            return;
        }
        this.accumulation.on(sf.base.Browser.isPointer ? 'pointerleave' : 'mouseleave', this.mouseLeaveHandler, this);
        this.accumulation.on(sf.base.Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.accumulation.on(sf.base.Browser.touchEndEvent, this.mouseUpHandler, this);
    };
    AccumulationTooltip.prototype.mouseLeaveHandler = function (e) {
        this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
    };
    AccumulationTooltip.prototype.mouseUpHandler = function (e) {
        var control = this.accumulation;
        if (control.tooltip.enable && control.isTouch && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
            this.removeTooltip(2000);
        }
    };
    AccumulationTooltip.prototype.mouseMoveHandler = function (e) {
        var control = this.accumulation;
        // Tooltip for chart series.
        if (control.tooltip.enable && withInBounds(control.mouseX, control.mouseY, control.initialClipRect)) {
            this.tooltip(e);
        }
    };
    /**
     * Renders the tooltip.
     * @param  {PointerEvent} event - Mouse move event.
     * @return {void}
     */
    AccumulationTooltip.prototype.tooltip = function (event) {
        var svgElement = this.getElement(this.element.id + '_tooltip_svg');
        var isTooltip = svgElement && parseInt(svgElement.getAttribute('opacity'), 10) > 0;
        var tooltipDiv = this.getTooltipElement(isTooltip);
        this.renderSeriesTooltip(event, this.accumulation, !isTooltip, tooltipDiv);
    };
    AccumulationTooltip.prototype.renderSeriesTooltip = function (e, chart, isFirst, tooltipDiv) {
        var data = this.getPieData(e, chart, chart.mouseX, chart.mouseY);
        var rect = chart.initialClipRect;
        this.currentPoints = [];
        if (data.point && (!this.previousPoints[0] || (this.previousPoints[0].point !== data.point))) {
            if (this.previousPoints[0] && data.point.index === this.previousPoints[0].point.index
                && data.series.index === this.previousPoints[0].series.index) {
                return null;
            }
            if (this.pushData(data, isFirst, tooltipDiv, false)) {
                this.triggerTooltipRender(data, isFirst, this.getTooltipText(data, chart.tooltip), this.findHeader(data));
            }
        }
        else {
            if (!data.point && this.isRemove) {
                this.removeTooltip(this.accumulation.tooltip.fadeOutDuration);
                this.isRemove = false;
            }
        }
    };
    AccumulationTooltip.prototype.triggerTooltipRender = function (point, isFirst, textCollection, headerText, firstText) {
        var _this = this;
        if (firstText === void 0) { firstText = true; }
        var argsData = {
            cancel: false, name: tooltipRender, text: textCollection, point: point.point, textStyle: this.textStyle,
            series: this.accumulation.isBlazor ? {} : point.series, headerText: headerText,
            data: { pointX: point.point.x, pointY: point.point.y, seriesIndex: point.series.index,
                pointIndex: point.point.index, pointText: point.point.text, seriesName: point.series.name }
        };
        var tooltipSuccess = function (argsData) {
            if (!argsData.cancel) {
                _this.formattedText = _this.formattedText.concat(argsData.text);
                _this.text = _this.formattedText;
                _this.headerText = argsData.headerText;
                _this.createTooltip(_this.chart, isFirst, point.point.symbolLocation, point.series.clipRect, point.point, ['Circle'], 0, _this.chart.initialClipRect, null, point.point, _this.accumulation.tooltip.template ? argsData.template : '');
            }
            else {
                _this.removeHighlight(_this.control);
                sf.base.remove(_this.getElement(_this.element.id + '_tooltip'));
            }
            _this.isRemove = true;
        };
        tooltipSuccess.bind(this, point);
        this.chart.trigger(tooltipRender, argsData, tooltipSuccess);
    };
    AccumulationTooltip.prototype.getPieData = function (e, chart, x, y) {
        var target = e.target;
        var id = indexFinder(target.id, true);
        if (!isNaN(id.series)) {
            var seriesIndex = id.series;
            var pointIndex = id.point;
            if (!sf.base.isNullOrUndefined(seriesIndex) && !isNaN(seriesIndex) && !sf.base.isNullOrUndefined(pointIndex) && !isNaN(pointIndex)) {
                var series = this.getSeriesFromIndex(seriesIndex, chart.visibleSeries);
                if (series.enableTooltip) {
                    return new AccPointData(series.points[pointIndex], series);
                }
            }
        }
        return new AccPointData(null, null);
    };
    /**
     * To get series from index
     */
    AccumulationTooltip.prototype.getSeriesFromIndex = function (index, visibleSeries) {
        return visibleSeries[0];
    };
    AccumulationTooltip.prototype.getTooltipText = function (data, tooltip) {
        var series = data.series;
        var format = this.accumulation.useGroupingSeparator ? '${point.x} : <b>${point.separatorY}</b>'
            : '${point.x} : <b>${point.y}</b>';
        format = tooltip.format ? tooltip.format : format;
        return this.parseTemplate(data.point, series, format);
    };
    AccumulationTooltip.prototype.findHeader = function (data) {
        if (this.header === '') {
            return '';
        }
        this.header = this.parseTemplate(data.point, data.series, this.header);
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            return this.header;
        }
        return '';
    };
    AccumulationTooltip.prototype.parseTemplate = function (point, series, format) {
        var value;
        var textValue;
        for (var _i = 0, _a = Object.keys(point); _i < _a.length; _i++) {
            var dataValue = _a[_i];
            value = new RegExp('${point' + '.' + dataValue + '}', 'gm');
            format = format.replace(value.source, point[dataValue]);
        }
        for (var _b = 0, _c = Object.keys(Object.getPrototypeOf(series)); _b < _c.length; _b++) {
            var dataValue = _c[_b];
            value = new RegExp('${series' + '.' + dataValue + '}', 'gm');
            textValue = series[dataValue];
            format = format.replace(value.source, textValue);
        }
        return format;
    };
    /**
     * Get module name
     */
    AccumulationTooltip.prototype.getModuleName = function () {
        return 'AccumulationTooltip';
    };
    /**
     * To destroy the Tooltip.
     * @return {void}
     * @private
     */
    AccumulationTooltip.prototype.destroy = function (chart) {
        /**
         * Destroy method calling here
         */
    };
    return AccumulationTooltip;
}(BaseTooltip));

/**
 * Selection Module handles the selection for chart.
 * @private
 */
var BaseSelection = /** @class */ (function () {
    function BaseSelection(control) {
        this.control = control;
    }
    /**
     * To create selection styles for series
     */
    BaseSelection.prototype.seriesStyles = function () {
        var seriesclass;
        var style = document.getElementById(this.styleId);
        var pattern = '{}';
        var fill;
        var opacity;
        var selectionPattern = this.control.selectionPattern;
        var highlightPattern = this.control.highlightPattern;
        if (sf.base.isNullOrUndefined(style) || selectionPattern !== 'None' || highlightPattern !== 'None') {
            style = document.createElement('style');
            style.setAttribute('id', this.styleId);
            for (var _i = 0, _a = this.control.visibleSeries; _i < _a.length; _i++) {
                var series = _a[_i];
                var visibleSeries = this.control.visibleSeries[series.index] ||
                    this.control.visibleSeries[series.index];
                if ((!sf.base.isNullOrUndefined(selectionPattern) || !sf.base.isNullOrUndefined(highlightPattern)) &&
                    (selectionPattern !== 'None' || highlightPattern !== 'None')) {
                    var patternName = this.styleId.indexOf('highlight') > 0 ? highlightPattern : selectionPattern;
                    if (visibleSeries.type === 'Pie' || visibleSeries.type === 'Funnel' ||
                        visibleSeries.type === 'Pyramid') {
                        for (var i = 0; i < visibleSeries.points.length; i++) {
                            opacity = visibleSeries.opacity;
                            fill = this.pattern(this.control, (visibleSeries.points[i]).color, series.index, patternName, opacity);
                            pattern = '{ fill:' + fill + '}';
                        }
                    }
                    else if (visibleSeries.type) {
                        opacity = visibleSeries.opacity;
                        fill = this.pattern(this.control, visibleSeries.interior, series.index, patternName, opacity);
                        pattern = '{ fill:' + fill + '}';
                    }
                }
                seriesclass = series.selectionStyle || this.styleId + '_series_' + series.index + ',' + '.' +
                    this.styleId + '_series_' + series.index + '> *';
                pattern = (pattern.indexOf('None') > -1) ? '{}' : pattern;
                style.innerHTML += series.selectionStyle ? '' : '.' + seriesclass + pattern;
            }
            style.innerHTML += '.' + this.unselected + ' { opacity:' + (0.3) + ';} ';
            document.body.appendChild(style);
        }
    };
    /**
     * To create the pattern for series/points
     */
    // tslint:disable-next-line:max-func-body-length
    BaseSelection.prototype.pattern = function (chart, color, index, patternName, opacity) {
        var backgroundColor = '#ffffff';
        var svg;
        svg = chart.svgObject;
        var pattern;
        var pathOptions = [];
        var patternGroup = { 'id': patternName + '_Selection' + '_' + index, 'patternUnits': 'userSpaceOnUse' };
        var heightStr = 'height';
        var widthStr = 'width';
        var width = 10;
        var height = 12;
        var patternNum = 6;
        switch (patternName) {
            case 'Dots':
                patternGroup[heightStr] = patternGroup[widthStr] = patternNum;
                patternGroup[widthStr] = patternNum;
                pathOptions[0] = {
                    'x': 0, 'y': 0, 'width': 7, 'height': 7, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
                };
                pathOptions[1] = {
                    'cx': 3,
                    'cy': 3,
                    'r': 2,
                    'stroke-width': 1,
                    'fill': color,
                    'name': 'circle'
                };
                break;
            case 'Pacman':
                patternGroup[heightStr] = '18.384';
                patternGroup[widthStr] = '17.917';
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': 17.917, 'height': 18.384,
                    'transform': 'translate(0,0)', 'fill': backgroundColor, 'opacity': opacity
                };
                // tslint:disable-next-line:max-line-length
                pathOptions[1] = {
                    'name': 'path', 'd': 'M9.081,9.194l5.806-3.08c-0.812-1.496-2.403-3.052-4.291-3.052H8.835C6.138,3.063,3,6.151,3,8.723v1.679   c0,2.572,3.138,5.661,5.835,5.661h1.761c2.085,0,3.835-1.76,4.535-3.514L9.081,9.194z', 'stroke-width': 1, 'stroke': color, 'fill': color
                };
                break;
            case 'Chessboard':
                patternGroup[heightStr] = patternGroup[widthStr] = width;
                pathOptions[0] = {
                    'x': 0, 'y': 0, 'width': width, 'height': width, 'fill': backgroundColor, 'opacity': opacity,
                    'name': 'rect'
                };
                pathOptions[1] = { 'x': 0, 'y': 0, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                pathOptions[2] = { 'x': 5, 'y': 5, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                break;
            case 'Crosshatch':
                patternGroup[heightStr] = patternGroup[widthStr] = '8';
                pathOptions[0] = {
                    'x': 0, 'y': 0, 'width': 8, 'height': 8, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
                };
                pathOptions[1] = {
                    'd': 'M0 0L8 8ZM8 0L0 8Z',
                    'stroke-width': 1,
                    'stroke': color,
                    'name': 'path'
                };
                break;
            case 'DiagonalForward':
                patternGroup[heightStr] = patternGroup[widthStr] = patternNum;
                pathOptions[0] = {
                    'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
                };
                pathOptions[1] = {
                    'd': 'M 3 -3 L 9 3 M 6 6 L 0 0 M 3 9 L -3 3',
                    'stroke-width': 2,
                    'stroke': color,
                    'name': 'path'
                };
                break;
            case 'DiagonalBackward':
                patternGroup[heightStr] = patternGroup[widthStr] = patternNum;
                pathOptions[0] = {
                    'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity, 'name': 'rect'
                };
                pathOptions[1] = {
                    'd': 'M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9',
                    'stroke-width': 2,
                    'stroke': color,
                    'name': 'path'
                };
                break;
            case 'Grid':
                patternGroup[heightStr] = patternGroup[widthStr] = patternNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': patternNum, 'height': patternNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path',
                    'd': 'M1 3.5L11 3.5 M0 3.5L11 3.5 M0 7.5L11 7.5 M0 11.5L11 11.5 M5.5 0L5.5 12 M11.5 0L11.5 12Z',
                    'stroke-width': 1,
                    'stroke': color
                };
                break;
            case 'Turquoise':
                var turquoiseNum = 17;
                var turstrokewidth = 1;
                patternGroup[heightStr] = patternGroup[widthStr] = turquoiseNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': turquoiseNum, 'height': turquoiseNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path', 'd': 'M0.5739999999999998,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[2] = {
                    'name': 'path', 'd': 'M11.805,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[3] = {
                    'name': 'path', 'd': 'M6.19,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[4] = {
                    'name': 'path', 'd': 'M11.805,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[5] = {
                    'name': 'path', 'd': 'M6.19,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[6] = {
                    'name': 'path', 'd': 'M11.805,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                pathOptions[7] = {
                    'name': 'path', 'd': 'M6.19,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0',
                    'stroke-width': turstrokewidth, 'stroke-miterlimit': width, 'stroke': color, 'fill': color
                };
                break;
            case 'Star':
                var starNum = 21;
                patternGroup[heightStr] = patternGroup[widthStr] = starNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': starNum, 'height': starNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path',
                    // tslint:disable-next-line:max-line-length
                    'd': 'M15.913,18.59L10.762 12.842 5.613 18.75 8.291 11.422 0.325 9.91 8.154 8.33 5.337 0.91 10.488 6.658 15.637 0.75 12.959 8.078 20.925 9.59 13.096 11.17 z',
                    'stroke-width': 1,
                    'stroke': color,
                    'fill': color
                };
                break;
            case 'Triangle':
                patternGroup[heightStr] = patternGroup[widthStr] = width;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': width, 'height': width, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path',
                    'd': 'M4.987,0L7.48 4.847 9.974 9.694 4.987 9.694 0 9.694 2.493 4.847 z',
                    'stroke-width': 1,
                    'stroke': color,
                    'fill': color
                };
                break;
            case 'Circle':
                var circleNum = 9;
                patternGroup[heightStr] = patternGroup[widthStr] = circleNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': circleNum, 'height': circleNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'circle',
                    'cx': 5.125,
                    'cy': 3.875,
                    'r': 3.625,
                    'stroke-width': 1,
                    'fill': color
                };
                break;
            case 'Tile':
                var tileNum = 18;
                var strokeWidth = 1;
                patternGroup[heightStr] = patternGroup[widthStr] = tileNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': tileNum, 'height': tileNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = { 'name': 'path', 'd': 'M0,9L0 0 9 0 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
                pathOptions[2] = { 'name': 'path', 'd': 'M9,9L9 0 18 0 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
                pathOptions[3] = { 'name': 'path', 'd': 'M0,18L0 9 9 9 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
                pathOptions[4] = { 'name': 'path', 'd': 'M9,18L9 9 18 9 z', 'stroke-width': strokeWidth, 'stroke': color, 'fill': color };
                break;
            case 'HorizontalDash':
                patternGroup[heightStr] = patternGroup[widthStr] = height;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': height, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path', 'd': 'M0,1.5 L10 1.5 M0,5.5 L10 5.5 M0,9.5 L10 9.5 z', 'stroke-width': 1,
                    'stroke': color, 'fill': color
                };
                break;
            case 'VerticalDash':
                patternGroup[heightStr] = patternGroup[widthStr] = height;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': height, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path', 'd': 'M1.5,0 L1.5 10 M5.5,0 L5.5 10 M9.5,0 L9.5 10 z', 'stroke-width': 1,
                    'stroke': color, 'fill': color
                };
                break;
            case 'Rectangle':
                patternGroup[heightStr] = patternGroup[widthStr] = height;
                pathOptions[0] = { 'name': 'rect', 'width': height, 'height': height, 'fill': backgroundColor, 'opacity': opacity };
                pathOptions[1] = { 'name': 'rect', 'x': 1, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                pathOptions[2] = { 'name': 'rect', 'x': 7, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                break;
            case 'Box':
                patternGroup[heightStr] = patternGroup[widthStr] = width;
                pathOptions[0] = { 'name': 'rect', 'width': 13, 'height': 13, 'fill': backgroundColor, 'opacity': opacity };
                pathOptions[1] = {
                    'name': 'rect', 'x': 1.5, 'y': 1.5, 'width': width, 'height': 9, 'fill': color,
                    'opacity': opacity
                };
                break;
            case 'HorizontalStripe':
                patternGroup[heightStr] = height;
                patternGroup[widthStr] = width;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': width, 'height': height,
                    'transform': 'translate(0,0)', 'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path', 'd': 'M0,0.5 L10 0.5 M0,4.5 L10 4.5 M0,8.5 L10 8.5 z', 'stroke-width': 1,
                    'stroke': color, 'fill': color
                };
                break;
            case 'VerticalStripe':
                patternGroup[heightStr] = width;
                patternGroup[widthStr] = height;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': height, 'height': width, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = {
                    'name': 'path', 'd': 'M0.5,0 L0.5 10 M4.5,0 L4.5 10 M8.5,0 L8.5 10 z', 'stroke-width': 1,
                    'stroke': color, 'fill': color
                };
                break;
            case 'Bubble':
                var bubNum = 20;
                patternGroup[heightStr] = patternGroup[widthStr] = bubNum;
                pathOptions[0] = {
                    'name': 'rect', 'x': 0, 'y': 0, 'width': bubNum, 'height': bubNum, 'transform': 'translate(0,0)',
                    'fill': backgroundColor, 'opacity': opacity
                };
                pathOptions[1] = { 'name': 'circle', 'cx': 5.217, 'cy': 11.325, 'r': 3.429, 'stroke-width': 1, 'fill': '#D0A6D1' };
                pathOptions[2] = { 'name': 'circle', 'cx': 13.328, 'cy': 6.24, 'r': 4.884, 'stroke-width': 1, 'fill': color };
                pathOptions[3] = {
                    'name': 'circle', 'cx': 13.277, 'cy': 14.66, 'r': 3.018, 'stroke-width': 1,
                    'fill': '#D0A6D1'
                };
                break;
        }
        var svgRenderer = (chart.svgRenderer || chart.renderer);
        pattern = svgRenderer.createPattern(patternGroup, 'pattern');
        this.loadPattern(chart, pathOptions, pattern, svgRenderer);
        svg.appendChild(pattern);
        return 'url(#' + patternName + '_' + 'Selection' + '_' + index + ')';
    };
    /**
     * To load the pattern into svg
     */
    BaseSelection.prototype.loadPattern = function (chart, options, pattern, svgRenderer) {
        var i;
        for (i = 0; i < options.length; i++) {
            var path = svgRenderer.createPattern(options[i], options[i].name);
            pattern.appendChild(path);
        }
    };
    /**
     * To concat indexes
     */
    BaseSelection.prototype.concatIndexes = function (userIndexes, localIndexes) {
        return userIndexes.concat(localIndexes);
    };
    /**
     * Selected points series visibility checking on legend click
     */
    BaseSelection.prototype.checkVisibility = function (selectedIndexes) {
        if (!selectedIndexes) {
            return false;
        }
        var visible = false;
        var uniqueSeries = [];
        for (var _i = 0, selectedIndexes_1 = selectedIndexes; _i < selectedIndexes_1.length; _i++) {
            var index = selectedIndexes_1[_i];
            if (uniqueSeries.indexOf(index.series) === -1) {
                uniqueSeries.push(index.series);
            }
        }
        for (var _a = 0, uniqueSeries_1 = uniqueSeries; _a < uniqueSeries_1.length; _a++) {
            var index = uniqueSeries_1[_a];
            if (this.control.series[index].visible) {
                visible = true;
                break;
            }
        }
        return visible;
    };
    /**
     * To add svg element style class
     * @private
     */
    BaseSelection.prototype.addSvgClass = function (element, className) {
        var elementClassName = element.getAttribute('class') || '';
        elementClassName += ((elementClassName !== '') ? ' ' : '');
        if (elementClassName.indexOf(className) === -1) {
            element.setAttribute('class', elementClassName + className);
        }
    };
    /**
     * To remove svg element style class
     * @private
     */
    BaseSelection.prototype.removeSvgClass = function (element, className) {
        var elementClassName = element.getAttribute('class') || '';
        if (elementClassName.indexOf(className) > -1) {
            element.setAttribute('class', elementClassName.replace(className, ''));
        }
    };
    /**
     * To get children from parent element
     */
    BaseSelection.prototype.getChildren = function (parent) {
        var children = [];
        for (var i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i].tagName !== 'defs') {
                children.push(parent.childNodes[i]);
            }
        }
        return children;
    };
    return BaseSelection;
}());

var __extends$16 = (undefined && undefined.__extends) || (function () {
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
 * AccumulationChart Selection src file
 */
/**
 * `AccumulationSelection` module handles the selection for accumulation chart.
 */
var AccumulationSelection = /** @class */ (function (_super) {
    __extends$16(AccumulationSelection, _super);
    function AccumulationSelection(accumulation) {
        var _this = _super.call(this, accumulation) || this;
        _this.renderer = accumulation.renderer;
        return _this;
    }
    /**
     * To initialize the private variables
     */
    AccumulationSelection.prototype.initPrivateVariables = function (accumulation) {
        this.styleId = accumulation.element.id + '_ej2_chart_selection';
        this.unselected = accumulation.element.id + '_ej2_deselected';
        this.selectedDataIndexes = [];
        this.rectPoints = null;
    };
    /**
     * Invoke selection for rendered chart.
     * @param  {AccumulationChart} chart - Define the chart to invoke the selection.
     * @return {void}
     */
    AccumulationSelection.prototype.invokeSelection = function (accumulation) {
        this.initPrivateVariables(accumulation);
        this.series = sf.base.extend({}, accumulation.visibleSeries, null, true);
        this.seriesStyles();
        this.selectDataIndex(this.concatIndexes(accumulation.selectedDataIndexes, this.selectedDataIndexes), accumulation);
    };
    /**
     * To get series selection style by series.
     */
    AccumulationSelection.prototype.generateStyle = function (series) {
        return (series.selectionStyle || this.styleId + '_series_' + series.index);
    };
    /**
     * To get elements by index, series
     */
    AccumulationSelection.prototype.findElements = function (accumulation, series, index) {
        return [this.getElementByIndex(index)];
    };
    /**
     * To get series point element by index
     */
    AccumulationSelection.prototype.getElementByIndex = function (index) {
        var elementId = this.control.element.id + '_Series_' + index.series + '_Point_' + index.point;
        return document.getElementById(elementId);
    };
    /**
     * To calculate selected elements on mouse click or touch
     * @private
     */
    AccumulationSelection.prototype.calculateSelectedElements = function (accumulation, event) {
        if (event.target.id.indexOf(accumulation.element.id + '_') === -1) {
            return;
        }
        if (event.target.id.indexOf('_Series_') > -1 || event.target.id.indexOf('_datalabel_') > -1) {
            this.performSelection(indexFinder(event.target.id), accumulation, event.target);
        }
    };
    /**
     * To perform the selection process based on index and element.
     */
    AccumulationSelection.prototype.performSelection = function (index, accumulation, element) {
        element = element.id.indexOf('datalabel') > -1 ?
            accumulation.getSeriesElement().childNodes[index.series].childNodes[index.point]
            : element;
        switch (accumulation.selectionMode) {
            case 'Point':
                if (!isNaN(index.point)) {
                    this.selection(accumulation, index, [element]);
                    this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
                }
                break;
        }
    };
    /**
     * To select the element by index. Adding or removing selection style class name.
     */
    AccumulationSelection.prototype.selection = function (accumulation, index, selectedElements) {
        if (!accumulation.isMultiSelect) {
            this.removeMultiSelectEelments(accumulation, this.selectedDataIndexes, index, accumulation.series);
        }
        var className = selectedElements[0] && (selectedElements[0].getAttribute('class') || '');
        if (selectedElements[0] && className.indexOf(this.getSelectionClass(selectedElements[0].id)) > -1) {
            this.removeStyles(selectedElements, index);
            this.addOrRemoveIndex(this.selectedDataIndexes, index);
            if (accumulation.enableBorderOnMouseMove) {
                var borderElement = document.getElementById(selectedElements[0].id.split('_')[0] + 'PointHover_Border');
                if (!sf.base.isNullOrUndefined(borderElement)) {
                    this.removeSvgClass(borderElement, borderElement.getAttribute('class'));
                }
            }
        }
        else {
            this.applyStyles(selectedElements, index);
            if (accumulation.enableBorderOnMouseMove) {
                var borderElement = document.getElementById(selectedElements[0].id.split('_')[0] + 'PointHover_Border');
                if (!sf.base.isNullOrUndefined(borderElement)) {
                    this.addSvgClass(borderElement, selectedElements[0].getAttribute('class'));
                }
            }
            this.addOrRemoveIndex(this.selectedDataIndexes, index, true);
        }
    };
    /**
     * To redraw the selection process on accumulation chart refresh.
     * @private
     */
    AccumulationSelection.prototype.redrawSelection = function (accumulation, oldMode) {
        var selectedDataIndexes = sf.base.extend([], this.selectedDataIndexes, null, true);
        this.removeSelectedElements(accumulation, this.selectedDataIndexes);
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
        this.selectDataIndex(selectedDataIndexes, accumulation);
    };
    /**
     * To remove the selected elements style classes by indexes.
     */
    AccumulationSelection.prototype.removeSelectedElements = function (accumulation, indexes) {
        var seriesgroup = accumulation.getSeriesElement();
        for (var _i = 0, indexes_1 = indexes; _i < indexes_1.length; _i++) {
            var index = indexes_1[_i];
            this.removeStyles([this.getElementByIndex(index)], index);
        }
    };
    /**
     * To perform the selection for legend elements.
     * @private
     */
    AccumulationSelection.prototype.legendSelection = function (accumulation, series, pointIndex) {
        var element = accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
        var seriesStyle = this.generateStyle(accumulation.visibleSeries[series]);
        var seriesElements = accumulation.getSeriesElement().childNodes[series].childNodes[pointIndex];
        this.selection(accumulation, new Index(series, pointIndex), [seriesElements]);
        this.blurEffect(accumulation.element.id, accumulation.visibleSeries);
    };
    /**
     * To select the element by selected data indexes.
     */
    AccumulationSelection.prototype.selectDataIndex = function (indexes, accumulation) {
        var element;
        for (var _i = 0, indexes_2 = indexes; _i < indexes_2.length; _i++) {
            var index = indexes_2[_i];
            element = this.getElementByIndex(index);
            if (element) {
                this.performSelection(index, accumulation, element);
            }
        }
    };
    /**
     * To remove the selection styles for multi selection process.
     */
    AccumulationSelection.prototype.removeMultiSelectEelments = function (accumulation, index, currentIndex, seriesCollection) {
        var series;
        for (var i = 0; i < index.length; i++) {
            series = seriesCollection[index[i].series];
            if (!this.checkEquals(index[i], currentIndex)) {
                this.removeStyles(this.findElements(accumulation, series, index[i]), index[i]);
                index.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * To apply the opacity effect for accumulation chart series elements.
     */
    AccumulationSelection.prototype.blurEffect = function (pieId, visibleSeries) {
        var visibility = this.checkPointVisibility(this.selectedDataIndexes); // legend click scenario
        for (var _i = 0, visibleSeries_1 = visibleSeries; _i < visibleSeries_1.length; _i++) {
            var series = visibleSeries_1[_i];
            if (series.visible) {
                this.checkSelectionElements(document.getElementById(pieId + '_SeriesCollection'), this.generateStyle(series), visibility);
            }
        }
    };
    /**
     * To check selection elements by style class name.
     */
    AccumulationSelection.prototype.checkSelectionElements = function (element, className, visibility) {
        var children = element.childNodes[0].childNodes;
        var legendShape;
        var elementClass;
        var parentClass;
        for (var i = 0; i < children.length; i++) {
            elementClass = children[i].getAttribute('class') || '';
            parentClass = children[i].parentNode.getAttribute('class') || '';
            if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                this.addSvgClass(children[i], this.unselected);
            }
            else {
                this.removeSvgClass(children[i], this.unselected);
            }
            if (this.control.accumulationLegendModule && this.control.legendSettings.visible) {
                legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + i);
                if (legendShape) {
                    if (elementClass.indexOf(className) === -1 && parentClass.indexOf(className) === -1 && visibility) {
                        this.addSvgClass(legendShape, this.unselected);
                    }
                    else {
                        this.removeSvgClass(legendShape, this.unselected);
                    }
                }
            }
        }
    };
    /**
     * To apply selection style for elements.
     */
    AccumulationSelection.prototype.applyStyles = function (elements, index) {
        var accumulationTooltip = this.control.accumulationTooltipModule;
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            var legendShape = void 0;
            if (element) {
                if (this.control.accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.unselected);
                    this.addSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
                this.removeSvgClass(element.parentNode, this.unselected);
                this.removeSvgClass(element, this.unselected);
                var opacity = accumulationTooltip && (accumulationTooltip.previousPoints.length > 0 &&
                    accumulationTooltip.previousPoints[0].point.index !== index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.addSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    };
    /**
     * To get selection style class name by id
     */
    AccumulationSelection.prototype.getSelectionClass = function (id) {
        return this.generateStyle(this.control.series[indexFinder(id).series]);
    };
    /**
     * To remove selection style for elements.
     */
    AccumulationSelection.prototype.removeStyles = function (elements, index) {
        var accumulationTooltip = this.control.accumulationTooltipModule;
        var legendShape;
        for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
            var element = elements_2[_i];
            if (element) {
                if (this.control.accumulationLegendModule && this.control.legendSettings.visible) {
                    legendShape = document.getElementById(this.control.element.id + '_chart_legend_shape_' + index.point);
                    this.removeSvgClass(legendShape, this.getSelectionClass(legendShape.id));
                }
                var opacity = accumulationTooltip && (accumulationTooltip.previousPoints[0].point.index === index.point) ?
                    accumulationTooltip.svgTooltip.opacity : this.series[index.series].opacity;
                element.setAttribute('opacity', opacity.toString());
                this.removeSvgClass(element, this.getSelectionClass(element.id));
            }
        }
    };
    /**
     * To apply or remove selected elements index.
     */
    AccumulationSelection.prototype.addOrRemoveIndex = function (indexes, index, add) {
        for (var i = 0; i < indexes.length; i++) {
            if (this.checkEquals(indexes[i], index)) {
                indexes.splice(i, 1);
                i--;
            }
        }
        if (add) {
            indexes.push(index);
        }
    };
    /**
     * To check two index, point and series are equal
     */
    AccumulationSelection.prototype.checkEquals = function (first, second) {
        return ((first.point === second.point) && (first.series === second.series));
    };
    /**
     * To check selected points are visibility
     */
    AccumulationSelection.prototype.checkPointVisibility = function (selectedDataIndexes) {
        var visible = false;
        for (var _i = 0, selectedDataIndexes_1 = selectedDataIndexes; _i < selectedDataIndexes_1.length; _i++) {
            var data = selectedDataIndexes_1[_i];
            if (pointByIndex(data.point, this.control.visibleSeries[0].points).visible) {
                visible = true;
                break;
            }
        }
        return visible;
    };
    /**
     * Get module name.
     */
    AccumulationSelection.prototype.getModuleName = function () {
        return 'AccumulationSelection';
    };
    /**
     * To destroy the selection.
     * @return {void}
     * @private
     */
    AccumulationSelection.prototype.destroy = function (accumulation) {
        // Destroy method performed here
    };
    return AccumulationSelection;
}(BaseSelection));

/**
 * Annotation Module handles the Annotation for chart and accumulation series.
 */
var AnnotationBase = /** @class */ (function () {
    /**
     * Constructor for chart and accumulation annotation
     * @param control
     */
    function AnnotationBase(control) {
        this.control = control;
    }
    /**
     * Method to render the annotation for chart and accumulation series.
     * @private
     * @param annotation
     * @param index
     */
    AnnotationBase.prototype.render = function (annotation, index) {
        this.isChart = this.control.getModuleName() === 'chart';
        this.annotation = annotation;
        var childElement = createTemplate(sf.base.createElement('div', {
            id: this.control.element.id + '_Annotation_' + index,
            styles: 'position: absolute; z-index: 1' //by default z-index set for annotation elements
        }), index, annotation.content, this.control);
        return childElement;
    };
    /**
     * Method to calculate the location for annotation - coordinate unit as pixel.
     * @private
     * @param location
     */
    AnnotationBase.prototype.setAnnotationPixelValue = function (location) {
        var rect;
        rect = this.annotation.region === 'Chart' ?
            new sf.svgbase.Rect(0, 0, this.control.availableSize.width, this.control.availableSize.height) :
            this.isChart ?
                this.control.chartAxisLayoutPanel.seriesClipRect :
                this.control.series[0].accumulationBound;
        location.x = ((typeof this.annotation.x !== 'string') ?
            ((typeof this.annotation.x === 'number') ? this.annotation.x : 0) :
            stringToNumber(this.annotation.x, rect.width)) + rect.x;
        location.y = ((typeof this.annotation.y === 'number') ? this.annotation.y :
            stringToNumber(this.annotation.y, rect.height)) + rect.y;
        return true;
    };
    /**
     * Method to calculate the location for annotation - coordinate unit as point.
     * @private
     * @param location
     */
    AnnotationBase.prototype.setAnnotationPointValue = function (location) {
        var symbolLocation = new ChartLocation(0, 0);
        if (this.isChart) {
            var xAxis = void 0;
            var yAxis = void 0;
            var chart = this.control;
            var annotation = this.annotation;
            var xValue = void 0;
            var isLog = false;
            var xAxisName = annotation.xAxisName;
            var yAxisName = annotation.yAxisName;
            var isInverted = chart.requireInvertedAxis;
            var stockChart = this.control.stockChart;
            for (var _i = 0, _a = chart.axisCollections; _i < _a.length; _i++) {
                var axis = _a[_i];
                if (xAxisName === axis.name || (xAxisName == null && axis.name === 'primaryXAxis')) {
                    xAxis = axis;
                    if (xAxis.valueType.indexOf('Category') > -1) {
                        var xAnnotation = xAxis.valueType === 'DateTimeCategory' ? (annotation.x.getTime()).toString() :
                            annotation.x;
                        if (xAxis.labels.indexOf(xAnnotation) < 0) {
                            return false;
                        }
                        else {
                            xValue = xAxis.labels.indexOf(xAnnotation);
                        }
                    }
                    else if (xAxis.valueType === 'DateTime') {
                        var option = { skeleton: 'full', type: 'dateTime' };
                        xValue = (typeof this.annotation.x === 'object' || typeof new Date(this.annotation.x) === 'object') ?
                            Date.parse(chart.intl.getDateParser(option)(chart.intl.getDateFormat(option)(new Date(sf.data.DataUtil.parse.parseJson({ val: annotation.x }).val)))) : 0;
                    }
                    else {
                        xValue = +annotation.x;
                    }
                }
                else if (yAxisName === axis.name || (yAxisName == null && axis.name === 'primaryYAxis')) {
                    yAxis = axis;
                    isLog = yAxis.valueType === 'Logarithmic';
                }
            }
            if (xAxis && yAxis && withIn(xAxis.valueType === 'Logarithmic' ? logBase(xValue, xAxis.logBase) : xValue, xAxis.visibleRange) && withIn(yAxis.valueType === 'Logarithmic' ? logBase(+annotation.y, yAxis.logBase) : +annotation.y, yAxis.visibleRange)) {
                symbolLocation = getPoint(xValue, +annotation.y, xAxis, yAxis, isInverted);
                location.x = symbolLocation.x + (isInverted ? yAxis.rect.x : xAxis.rect.x);
                // for stockchart, stockchart's toolbar height and title size is added for annotation content
                location.y = symbolLocation.y + (isInverted ? xAxis.rect.y : yAxis.rect.y) +
                    ((stockChart && stockChart.enablePeriodSelector) ? stockChart.toolbarHeight + stockChart.titleSize.height : 0);
            }
            else {
                return false;
            }
            return true;
        }
        else {
            return this.setAccumulationPointValue(location);
        }
    };
    /**
     * To process the annotation for accumulation chart
     * @param annotation
     * @param index
     * @param parentElement
     */
    AnnotationBase.prototype.processAnnotation = function (annotation, index, parentElement) {
        var annotationElement;
        var location;
        var chart = this.control;
        location = new ChartLocation(0, 0);
        annotationElement = this.render(annotation, index);
        if (this['setAnnotation' + annotation.coordinateUnits + 'Value'](location)) {
            this.setElementStyle(location, annotationElement, parentElement);
        }
        else if (this.control.redraw) {
            removeElement$1(annotationElement.id);
        }
        var annotationRendered = function () {
            annotationElement.style.transform = 'translate(-50%, -50%)';
        };
        annotationRendered.bind(location, this);
        sf.base.updateBlazorTemplate((this.control.element.id + 'Annotation' + index).replace(/[^a-zA-Z0-9]/g, ''), 'ContentTemplate', chart.stockChart ? chart.stockChart.annotations[index] : this.control.annotations[index], undefined, annotationRendered);
    };
    /**
     * Method to calculate the location for annotation - coordinate unit as point in accumulation chart.
     * @private
     * @param location
     */
    AnnotationBase.prototype.setAccumulationPointValue = function (location) {
        var accumulation = this.control;
        var point;
        for (var _i = 0, _a = accumulation.visibleSeries[0].points; _i < _a.length; _i++) {
            var accPoint = _a[_i];
            if (typeof accPoint.x === 'object') {
                if (Date.parse(accPoint.x) === Date.parse(this.annotation.x) &&
                    // tslint:disable-next-line    
                    accPoint.y == this.annotation.y) {
                    point = accPoint;
                    break;
                }
            }
            else {
                // tslint:disable-next-line
                if (accPoint.x == this.annotation.x && accPoint.y == this.annotation.y) {
                    point = accPoint;
                    break;
                }
            }
        }
        if (point && point.visible) {
            location.x = point.symbolLocation.x;
            location.y = point.symbolLocation.y;
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Method to set the element style for accumulation / chart annotation.
     * @private
     * @param location
     * @param element
     * @param parentElement
     */
    AnnotationBase.prototype.setElementStyle = function (location, element, parentElement) {
        var elementRect = measureElementRect(element, this.control.redraw);
        var argsData = {
            cancel: false, name: annotationRender, content: element,
            location: location
        };
        this.control.trigger(annotationRender, argsData);
        if (!argsData.cancel) {
            argsData.content.style.left = this.setAlignmentValue(this.annotation.horizontalAlignment, elementRect.width, argsData.location.x) + 'px';
            argsData.content.style.top = this.setAlignmentValue(this.annotation.verticalAlignment, elementRect.height, argsData.location.y) + 'px';
            argsData.content.setAttribute('aria-label', this.annotation.description || 'Annotation');
            appendElement(argsData.content, parentElement, this.control.redraw, true, 'left', 'top');
        }
    };
    /**
     * Method to calculate the alignment value for annotation.
     * @private
     * @param alignment
     * @param size
     * @param value
     */
    AnnotationBase.prototype.setAlignmentValue = function (alignment, size, value) {
        switch (alignment) {
            case 'Top':
            case 'Near':
                value -= size;
                break;
            case 'Bottom':
            case 'Far':
                value += 0;
                break;
            case 'Middle':
            case 'Center':
                value -= (size / 2);
                break;
        }
        return value;
    };
    return AnnotationBase;
}());

/**
 * AccumulationChart annotation properties
 */
var __extends$17 = (undefined && undefined.__extends) || (function () {
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
 * `AccumulationAnnotation` module handles the annotation for accumulation chart.
 */
var AccumulationAnnotation = /** @class */ (function (_super) {
    __extends$17(AccumulationAnnotation, _super);
    /**
     * Constructor for accumulation chart annotation.
     * @private.
     */
    function AccumulationAnnotation(control) {
        var _this = _super.call(this, control) || this;
        _this.pie = control;
        return _this;
    }
    /**
     * Method to render the annotation for accumulation chart
     * @param element
     */
    AccumulationAnnotation.prototype.renderAnnotations = function (element) {
        var _this = this;
        this.annotations = this.pie.annotations;
        var redraw = this.pie.redraw;
        this.parentElement = (redrawElement(redraw, this.pie.element.id + '_Annotation_Collections') ||
            sf.base.createElement('div', {
                id: this.pie.element.id + '_Annotation_Collections'
            }));
        this.annotations.map(function (annotation, index) {
            _this.processAnnotation(annotation, index, _this.parentElement);
        });
        appendElement(this.parentElement, element, redraw);
    };
    /**
     * Get module name.
     */
    AccumulationAnnotation.prototype.getModuleName = function () {
        // Returns te module name
        return 'Annotation';
    };
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    AccumulationAnnotation.prototype.destroy = function (control) {
        // Destroy method performed here
    };
    return AccumulationAnnotation;
}(AnnotationBase));

/**
 * `ExportModule` module is used to print and export the rendered chart.
 */
var Export = /** @class */ (function () {
    /**
     * Constructor for export module.
     * @private
     */
    function Export(chart) {
        this.chart = chart;
    }
    /**
     * Handles the export method for chart control.
     * @param type
     * @param fileName
     */
    Export.prototype.export = function (type, fileName, orientation, controls, width, height, isVertical, header, footer) {
        var exportChart = new ExportUtils(this.chart);
        controls = controls ? controls : [this.chart];
        var argsData = {
            cancel: false, name: beforeExport, width: width, height: height
        };
        this.chart.trigger(beforeExport, argsData);
        if (!argsData.cancel) {
            exportChart.export(type, fileName, orientation, controls, width = argsData.width, height = argsData.height, isVertical, header, footer);
        }
    };
    /**
     * To get data url for charts.
     */
    Export.prototype.getDataUrl = function (chart) {
        var exportUtil = new ExportUtils(chart);
        return exportUtil.getDataUrl(chart);
    };
    /**
     * Get module name.
     */
    Export.prototype.getModuleName = function () {
        // Returns the module name
        return 'Export';
    };
    /**
     * To destroy the chart.
     * @return {void}
     * @private
     */
    Export.prototype.destroy = function (chart) {
        // Destroy method performed here
    };
    return Export;
}());

/**
 * Pie Component items exported
 */

AccumulationChart.Inject(PieSeries, FunnelSeries, PyramidSeries, AccumulationTooltip, AccumulationLegend, AccumulationSelection, AccumulationDataLabel, AccumulationAnnotation, Export);

exports.AccumulationChart = AccumulationChart;
exports.AccumulationAnnotationSettings = AccumulationAnnotationSettings;
exports.AccumulationDataLabelSettings = AccumulationDataLabelSettings;
exports.PieCenter = PieCenter;
exports.AccPoints = AccPoints;
exports.AccumulationSeries = AccumulationSeries;
exports.getSeriesFromIndex = getSeriesFromIndex;
exports.pointByIndex = pointByIndex;
exports.PieSeries = PieSeries;
exports.FunnelSeries = FunnelSeries;
exports.PyramidSeries = PyramidSeries;
exports.AccumulationLegend = AccumulationLegend;
exports.AccumulationDataLabel = AccumulationDataLabel;
exports.AccumulationTooltip = AccumulationTooltip;
exports.AccumulationSelection = AccumulationSelection;
exports.AccumulationAnnotation = AccumulationAnnotation;
exports.Export = Export;

return exports;

});
sfBlazor.modules["accumulationchart"] = "charts.AccumulationChart";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.accumulationchart, () => {
    sf.charts = sf.base.extend({}, sf.charts, sfaccumulationchart({}));
});