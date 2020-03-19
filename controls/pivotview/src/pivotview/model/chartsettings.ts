import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';
import { BorderModel as PivotChartBorderModel, ErrorBarSettingsModel as PivotChartErrorBarSettingsModel } from '@syncfusion/ej2-charts';
import { ChartDrawType, ChartShape, DataLabelSettingsModel as PivotChartDataLabelSettingsModel, ZoomMode } from '@syncfusion/ej2-charts';
import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes, ToolbarItems, IScrollEventArgs } from '@syncfusion/ej2-charts';
import { EmptyPointMode, TextOverflow, Alignment, ZIndex, Anchor, SizeType, BorderType, LineType } from '@syncfusion/ej2-charts';
import { TrendlineModel as PivotChartTrendlineModel, LegendShape, SplineType, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';
import { AnimationModel as PivotChartAnimationModel, ChartSegmentModel as PivotChartSegmentModel } from '@syncfusion/ej2-charts';
import { EdgeLabelPlacement, LabelPlacement, MajorTickLinesModel as PivotChartMajorTickLinesModel } from '@syncfusion/ej2-charts';
import { MinorGridLinesModel as PivotChartMinorGridLinesModel, AxisLineModel as PivotChartAxisLineModel } from '@syncfusion/ej2-charts';
import { ChartAreaModel as PivotChartAreaModel, IndexesModel as PivotChartIndexesModel } from '@syncfusion/ej2-charts';
import { IResizeEventArgs, IPrintEventArgs, FontModel as PivotChartFontModel, LegendPosition } from '@syncfusion/ej2-charts';
import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';
import { IMouseEventArgs, IPointEventArgs, EmptyPointSettingsModel as PivotChartEmptyPointSettingsModel } from '@syncfusion/ej2-charts';
import { LabelIntersectAction, ErrorBarCapSettingsModel as PivotChartErrorBarCapSettingsModel, ChartTheme } from '@syncfusion/ej2-charts';
import { CornerRadiusModel as PivotChartCornerRadiusModel } from '@syncfusion/ej2-charts';
import { MajorGridLinesModel as PivotChartMajorGridLinesModel } from '@syncfusion/ej2-charts';
import { IAnimationCompleteEventArgs, StripLineSettingsModel as PivotChartStripLineSettingsModel } from '@syncfusion/ej2-charts';
import { CrosshairTooltipModel as PivotChartCrosshairTooltipModel, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';
import { LocationModel, AccEmptyPointMode, MarkerSettingsModel as PivotChartMarkerSettingsModel } from '@syncfusion/ej2-charts';
import { CrosshairSettingsModel as PivotChartCrosshairSettingsModel, IDragCompleteEventArgs } from '@syncfusion/ej2-charts';
import { LabelBorderModel as PivotChartLabelBorderModel, MarginModel as PivotChartMarginModel } from '@syncfusion/ej2-charts';
import { MinorTickLinesModel as PivotChartMinorTickLinesModel, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-charts';
import { Segment, AxisPosition, LegendSettingsModel, ILoadedEventArgs, ChartLocation } from '@syncfusion/ej2-charts';
import { PivotSeriesModel, PivotAxisModel, PivotTooltipSettingsModel, PivotZoomSettingsModel } from './chartsettings-model';
import { ChartSeriesType, ChartSelectionMode } from '../../common';
import { Theme } from '../../common/base/themes';
import { OffsetModel as PivotChartOffsetModel } from '../../common/base/interface';
import { LabelPosition } from '../../common/base/enum';

/**
 * Configures the animation behavior for chart series.
 */

export class Animation extends ChildProperty<Animation> {

     /**
      * If set to true, series gets animated on initial loading.
      * @default true
      */

     @Property(true)
     public enable: boolean;

     /**
      * The duration of animation in milliseconds.
      * @default 1000
      */

     @Property(1000)
     public duration: number;

     /**
      * The option to delay animation of the series.
      * @default 0
      */

     @Property(0)
     public delay: number;
}

export class ChartSegment extends ChildProperty<ChartSegment> {

     /**
      * Defines the starting point of region.
      * @default null
      */

     @Property(null)
     public value: Object;

     /**
      * Defines the color of a region.
      * @default null
      */

     @Property(null)
     public color: string;

     /**
      * Defines the pattern of dashes and gaps to stroke.
      * @default '0'
      */

     @Property('0')
     public dashArray: string;

     /** @private */
     public startValue: number;

     /** @private */
     public endValue: number;

}

/**
 * Configures the fonts in charts.
 */

export class Font extends ChildProperty<Font> {

     /**
      * FontStyle for the text.
      * @default 'Normal'
      */
     @Property('Normal')
     public fontStyle: string;

     /**
      * Font size for the text.
      * @default '16px'
      */
     @Property('16px')
     public size: string;

     /**
      * FontWeight for the text.
      * @default 'Normal'
      */
     @Property('Normal')
     public fontWeight: string;

     /**
      * Color for the text.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * text alignment
      * @default 'Center'
      * @blazorType PivotChartAlignment
      * @blazorDefaultValue PivotChartAlignment.Center
      */
     @Property('Center')
     public textAlignment: Alignment;

     /**
      * FontFamily for the text.
      */
     @Property('Segoe UI')
     public fontFamily: string;

     /**
      * Opacity for the text.
      * @default 1
      */
     @Property(1)
     public opacity: number;

     /**
      * Specifies the chart title text overflow
      * @default 'Trim'
      */
     @Property('Trim')
     public textOverflow: TextOverflow;

}

/**
 * Configures the chart margins.
 */
export class Margin extends ChildProperty<Margin> {

     /**
      * Left margin in pixels.
      * @default 10
      * @blazorType int
      */
     @Property(10)
     public left: number;

     /**
      * Right margin in pixels.
      * @default 10
      * @blazorType int
      */
     @Property(10)
     public right: number;

     /**
      * Top margin in pixels.
      * @default 10
      */
     @Property(10)
     public top: number;

     /**
      * Bottom margin in pixels.
      * @default 10
      */
     @Property(10)
     public bottom: number;
}

/**
 * Configures the borders in the chart.
 */
export class Border extends ChildProperty<Border> {

     /**
      * The color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * The width of the border in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

}

/**
 * Configures the marker position in the chart.
 */
export class Offset extends ChildProperty<Offset> {

     /**
      * x value of the marker position
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public x: number;

     /**
      * y value of the marker position
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public y: number;

}

/**
 * Series and point index
 * @public
 */
export class Indexes extends ChildProperty<Indexes> {
     /**
      * Specifies the series index
      * @default 0
      * @aspType int
      * @blazorType int
      */
     @Property(0)
     public series: number;

     /**
      * Specifies the point index
      * @default 0
      * @aspType int
      * @blazorType int
      */
     @Property(0)
     public point: number;

}

/**
 * Configures the chart area.
 */
export class ChartArea extends ChildProperty<ChartArea> {

     /**
      * Options to customize the border of the chart area.
      */
     @Complex<PivotChartBorderModel>({}, Border)
     public border: PivotChartBorderModel;

     /**
      * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..
      * @default 'transparent'
      */
     @Property('transparent')
     public background: string;

     /**
      * The opacity for background.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public opacity: number;

     /**
      * The background image of the chart area that accepts value in string as url link or location of an image.
      * @default null
      */
     @Property(null)
     public backgroundImage: string;

}

/**
 * Configures the crosshair in the chart.
 */
export class CrosshairSettings extends ChildProperty<CrosshairSettings> {
     /**
      * If set to true, crosshair line becomes visible.
      * @default false
      */
     @Property(false)
     public enable: boolean;

     /**
      * DashArray for crosshair.
      * @default ''
      */
     @Property('')
     public dashArray: string;

     /**
      * Options to customize the crosshair line.
      */
     @Complex<PivotChartBorderModel>({ color: null, width: 1 }, Border)
     public line: PivotChartBorderModel;

     /**
      * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @default Both
      * @blazorType PivotChartLineType
      * @blazorDefaultValue PivotChartLineType.Both
      */
     @Property('Both')
     public lineType: LineType;

}

/**
 * Configures the data label in the series.
 */

export class DataLabelSettings extends ChildProperty<DataLabelSettings> {

     /**
      * If set true, data label for series renders.
      * @default false
      */

     @Property(false)
     public visible: boolean;

     /**
      * The DataSource field that contains the data label value.
      * @default null
      */

     @Property(null)
     public name: string;

     /**
      * The background color of the data label accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */

     @Property('transparent')
     public fill: string;

     /**
      * The opacity for the background.
      * @default 1
      */

     @Property(1)
     public opacity: number;

     /**
      * Specifies angle for data label.
      * @default 0
      * @blazorType int
      */

     @Property(0)
     public angle: number;

     /**
      * Enables rotation for data label.
      * @default false
      */

     @Property(false)
     public enableRotation: boolean;

     /**
      * Specifies the position of the data label. They are,
      * * Outer: Positions the label outside the point.
      * * top: Positions the label on top of the point.
      * * Bottom: Positions the label at the bottom of the point.
      * * Middle: Positions the label to the middle of the point.
      * * Auto: Positions the label based on series.
      * @default 'Auto'
      */

     @Property('Auto')
     public position: LabelPosition;

     /**
      * The roundedCornerX for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public rx: number;

     /**
      * The roundedCornerY for the data label. It requires `border` values not to be null.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public ry: number;

     /**
      * Specifies the alignment for data Label. They are,
      * * Near: Aligns the label to the left of the point.
      * * Center: Aligns the label to the center of the point.
      * * Far: Aligns the label to the right of the point.
      * @default 'Center'
      */
     @Property('Center')
     public alignment: Alignment;

     /**
      * Option for customizing the border lines.
      */

     @Complex<PivotChartBorderModel>({ width: null, color: null }, Border)
     public border: PivotChartBorderModel;

     /**
      * Margin configuration for the data label.
      */

     @Complex<PivotChartMarginModel>({ left: 5, right: 5, top: 5, bottom: 5 }, Margin)
     public margin: PivotChartMarginModel;

     /**
      * Option for customizing the data label text.
      */

     @Complex<PivotChartFontModel>({ size: '11px', color: '', fontStyle: 'Normal', fontWeight: 'Normal', fontFamily: 'Segoe UI' }, Font)
     public font: PivotChartFontModel;

     /**
      * Custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
      * text to display the corresponding data point.
      * @default null
      */

     @Property(null)
     public template: string;

}

/**
 *  Configures the marker in the series.
 */

export class MarkerSettings extends ChildProperty<MarkerSettings> {

     /**
      * If set to true the marker for series is rendered. This is applicable only for line and area type series.
      * @default false
      */

     @Property(false)
     public visible: boolean;

     /**
      * The different shape of a marker:
      * * Circle
      * * Rectangle
      * * Triangle
      * * Diamond
      * * HorizontalLine
      * * VerticalLine
      * * Pentagon
      * * InvertedTriangle
      * * Image
      * @default 'Circle'
      */

     @Property('Circle')
     public shape: ChartShape;


     /**
      * The URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
      * @default ''
      */

     @Property('')
     public imageUrl: string;

     /**
      * The width of the marker in pixels.
      * @default 5
      * @blazorType int
      */

     @Property(5)
     public width: number;

     /**
      * The height of the marker in pixels.
      * @default 5
      * @blazorType int
      */

     @Property(5)
     public height: number;

     /**
      * Options for customizing the border of a marker.
      */

     @Complex<PivotChartBorderModel>({ width: 2, color: null }, Border)
     public border: PivotChartBorderModel;

     /**
      * Options for customizing the marker position.
      */

     @Complex<PivotChartOffsetModel>({ x: 0, y: 0 }, Offset)
     public offset: PivotChartOffsetModel;

     /**
      *  The fill color of the marker that accepts value in hex and rgba as a valid CSS color string.
      *  By default, it will take series' color.
      * @default null
      */

     @Property(null)
     public fill: string;

     /**
      * The opacity of the marker.
      * @default 1
      */

     @Property(1)
     public opacity: number;

     /**
      * The data label for the series.
      */

     @Complex<PivotChartDataLabelSettingsModel>({}, DataLabelSettings)
     public dataLabel: PivotChartDataLabelSettingsModel;

}

/**
 * Configures Error bar in series.
 */

export class ErrorBarCapSettings extends ChildProperty<ErrorBarCapSettings> {

     /**
      * The width of the error bar in pixels.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public width: number;

     /**
      * The length of the error bar in pixels.
      * @default 10
      * @blazorType int
      */

     @Property(10)
     public length: number;

     /**
      *  The stroke color of the cap, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;

     /**
      * The opacity of the cap.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public opacity: number;

}

/**
 * Error bar settings
 * @public
 */
export class ErrorBarSettings extends ChildProperty<ErrorBarSettings> {

     /**
      * If set true, error bar for data gets rendered.
      * @default false
      */

     @Property(false)
     public visible: boolean;

     /**
      * The type of the error bar . They are
      * * Fixed -  Renders a fixed type error bar.
      * * Percentage - Renders a percentage type error bar.
      * * StandardDeviation - Renders a standard deviation type error bar.
      * * StandardError -Renders a standard error type error bar.
      * * Custom -Renders a custom type error bar.
      * @default 'Fixed'
      */

     @Property('Fixed')
     public type: ErrorBarType;

     /**
      * The direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.
      * @default 'Both'
      */

     @Property('Both')
     public direction: ErrorBarDirection;

     /**
      * The mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.
      * @default 'Vertical'
      */

     @Property('Vertical')
     public mode: ErrorBarMode;

     /**
      * The vertical error of the error bar.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public verticalError: number;

     /**
      *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;

     /**
      * The stroke width of the error bar..
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public width: number;

     /**
      * The horizontal error of the error bar.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public horizontalError: number;

     /**
      * The vertical negative error of the error bar.
      * @default 3
      * @blazorType int
      */

     @Property(3)
     public verticalNegativeError: number;

     /**
      * The vertical positive error of the error bar.
      * @default 3
      * @blazorType int
      */

     @Property(3)
     public verticalPositiveError: number;

     /**
      * The horizontal negative error of the error bar.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public horizontalNegativeError: number;

     /**
      * The horizontal positive error of the error bar.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public horizontalPositiveError: number;

     /**
      * Options for customizing the cap of the error bar.
      */
     @Complex<PivotChartErrorBarCapSettingsModel>(null, ErrorBarCapSettings)
     public errorBarCap: PivotChartErrorBarCapSettingsModel;

}

/**
 * Defines the behavior of the Trendlines
 */
export class Trendline extends ChildProperty<Trendline> {
     /**
      * Defines the name of trendline
      * @default ''
      */
     @Property('')
     public name: string;

     /**
      * Defines the pattern of dashes and gaps to stroke.
      * @default '0'
      */

     @Property('0')
     public dashArray: string;

     /**
      * Specifies the visibility of trendline.
      * @default true
      */

     @Property(true)
     public visible: boolean;

     /**
      * Defines the period, the price changes over which will be considered to predict moving average trend line
      * @default 2
      * @blazorType int
      */
     @Property(2)
     public period: number;

     /**
      * Defines the type of the trendline
      * @default 'Linear'
      */
     @Property('Linear')
     public type: TrendlineTypes;

     /**
      * Defines the period, by which the trend has to backward forecast
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public backwardForecast: number;

     /**
      * Defines the period, by which the trend has to forward forecast
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public forwardForecast: number;

     /**
      * Defines the polynomial order of the polynomial trendline
      * @default 2
      * @blazorType int
      */
     @Property(2)
     public polynomialOrder: number;

     /**
      * Options to customize the marker for trendlines
      * @deprecated
      */
     @Complex<PivotChartMarkerSettingsModel>({}, MarkerSettings)
     public marker: PivotChartMarkerSettingsModel;

     /**
      * Enables/disables tooltip for trendlines
      * @default true
      */
     @Property(true)
     public enableTooltip: boolean;

     /**
      * Options to customize the animation for trendlines
      */
     @Complex<PivotChartAnimationModel>({}, Animation)
     public animation: PivotChartAnimationModel;

     /**
      * Defines the fill color of trendline
      * @default ''
      */
     @Property('')
     public fill: string;

     /**
      * Defines the width of the trendline
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * Defines the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public intercept: number;

     /**
      * Sets the legend shape of the trendline
      * @default 'SeriesType'
      */
     @Property('SeriesType')
     public legendShape: LegendShape;

}

/**
 * Configures the Empty Points of series
 */

export class EmptyPointSettings extends ChildProperty<EmptyPointSettings> {

     /**
      * To customize the fill color of empty points.
      * @default null
      */
     @Property(null)
     public fill: string;

     /**
      * Options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
     @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
     public border: PivotChartBorderModel;

     /**
      * To customize the mode of empty points.
      * @default Gap
      */
     @Property('Gap')
     public mode: EmptyPointMode | AccEmptyPointMode;
}

/**
 * Column series rounded corner options
 */
export class CornerRadius extends ChildProperty<CornerRadius> {
     /**
      * Specifies the top left corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public topLeft: number;
     /**
      * Specifies the top right corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public topRight: number;
     /**
      * Specifies the bottom left corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public bottomLeft: number;
     /**
      * Specifies the bottom right corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public bottomRight: number;
}

/**
 * Configures the crosshair ToolTip.
 */
export class CrosshairTooltip extends ChildProperty<CrosshairTooltip> {

     /**
      * If set to true, crosshair ToolTip will be visible.
      *  @default false
      */

     @Property(false)
     public enable: Boolean;

     /**
      * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public fill: string;

     /**
      * Options to customize the crosshair ToolTip text.
      */

     @Complex<PivotChartFontModel>(Theme.crosshairLabelFont, Font)
     public textStyle: PivotChartFontModel;

}

/**
 * Strip line properties
 */
export class StripLineSettings extends ChildProperty<StripLineSettings> {

     /**
      * If set true, strip line for axis renders.
      * @default true
      */
     @Property(true)
     public visible: boolean;

     /**
      *  If set true, strip line get render from axis origin.
      *  @default false
      */
     @Property(false)
     public startFromAxis: boolean;

     /**
      * Start value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public start: number | Date;

     /**
      * End value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public end: number | Date;

     /**
      * Size of the strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public size: number;

     /**
      * Color of the strip line.
      * @default '#808080'
      */
     @Property('#808080')
     public color: string;

     /**
      * Dash Array of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public dashArray: string;

     /**
      * Size type of the strip line
      * @default Auto
      */
     @Property('Auto')
     public sizeType: SizeType;

     /**
      * isRepeat value of the strip line.
      * @default false
      * @aspDefaultValueIgnore
      */
     @Property(false)
     public isRepeat: boolean;

     /**
      * repeatEvery value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public repeatEvery: number | Date;

     /**
      * repeatUntil value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public repeatUntil: number | Date;

     /**
      * isSegmented value of the strip line
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(false)
     public isSegmented: boolean;

     /**
      * segmentStart value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentStart: number | Date;

     /**
      * segmentEnd value of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentEnd: number | Date;

     /**
      * segmentAxisName of the strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentAxisName: string;

     /**
      * Border of the strip line.
      */
     @Complex<PivotChartBorderModel>({ color: 'transparent', width: 1 }, Border)
     public border: PivotChartBorderModel;

     /**
      * Strip line text.
      * @default ''
      */
     @Property('')
     public text: string;

     /**
      * The angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public rotation: number;

     /**
      * Defines the position of the strip line text horizontally. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @default 'Middle'
      */
     @Property('Middle')
     public horizontalAlignment: Anchor;

     /**
      * Defines the position of the strip line text vertically. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @default 'Middle'
      */
     @Property('Middle')
     public verticalAlignment: Anchor;

     /**
      * Options to customize the strip line text.
      */
     @Complex<PivotChartFontModel>(Theme.stripLineLabelFont, Font)
     public textStyle: PivotChartFontModel;

     /**
      * Specifies the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @default 'Behind'
      */
     @Property('Behind')
     public zIndex: ZIndex;

     /**
      * Strip line Opacity
      * @default 1
      */
     @Property(1)
     public opacity: number;
}

/**
 * label border properties.
 */
export class LabelBorder extends ChildProperty<LabelBorder> {

     /**
      * The color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * The width of the border in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * Border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace
      * @default 'Rectangle'
      */
     @Property('Rectangle')
     public type: BorderType;

}

/**
 * Configures the major grid lines in the `axis`.
 */
export class MajorGridLines extends ChildProperty<MajorGridLines> {

     /**
      * The width of the line in pixels.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public width: number;

     /**
      * The dash array of the grid lines.
      * @default ''
      */

     @Property('')
     public dashArray: string;

     /**
      * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;
}
/**
 * Configures the minor grid lines in the `axis`.
 */
export class MinorGridLines extends ChildProperty<MinorGridLines> {

     /**
      * The width of the line in pixels.
      * @default 0.7
      */

     @Property(0.7)
     public width: number;

     /**
      * The dash array of grid lines.
      * @default ''
      */

     @Property('')
     public dashArray: string;

     /**
      * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;
}
/**
 * Configures the axis line of a chart.
 */
export class AxisLine extends ChildProperty<AxisLine> {

     /**
      * The width of the line in pixels.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public width: number;

     /**
      * The dash array of the axis line.
      * @default ''
      */

     @Property('')
     public dashArray: string;

     /**
      * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;
}
/**
 * Configures the major tick lines.
 */
export class MajorTickLines extends ChildProperty<MajorTickLines> {

     /**
      * The width of the tick lines in pixels.
      * @default 1
      * @blazorType int
      */

     @Property(1)
     public width: number;

     /**
      * The height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */

     @Property(5)
     public height: number;

     /**
      * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;
}
/**
 * Configures the minor tick lines.
 */
export class MinorTickLines extends ChildProperty<MinorTickLines> {

     /**
      * The width of the tick line in pixels.
      * @default 0.7
      */

     @Property(0.7)
     public width: number;

     /**
      * The height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */

     @Property(5)
     public height: number;
     /**
      * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */

     @Property(null)
     public color: string;
}

/**
 *  third party configures for chart series in chart settings.
 */
export class PivotChartSeriesBorder {
     /**
      * The color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * The width of the border in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;
}
export class PivotChartSeriesAnimation {
     /**
      * If set to true, series gets animated on initial loading.
      * @default true
      */
     @Property(true)
     public enable: boolean;

     /**
      * The duration of animation in milliseconds.
      * @default 1000
      * @blazorType int
      */
     @Property(1000)
     public duration: number;

     /**
      * The option to delay animation of the series.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public delay: number;
}
export class PivotChartSeriesSegment {
     /**
      * Defines the starting point of region.
      * @default null
      */
     @Property(null)
     public value: Object;

     /**
      * Defines the color of a region.
      * @default null
      */
     @Property(null)
     public color: string;

     /**
      * Defines the pattern of dashes and gaps to stroke.
      * @default '0'
      */
     @Property('0')
     public dashArray: string;

     /** @private */
     public startValue: number;

     /** @private */
     public endValue: number;
}
export class PivotChartSeriesMarkerSettings {
     /**
      * If set to true the marker for series is rendered. This is applicable only for line and area type series.
      * @default false
      */
     @Property(false)
     public visible: boolean;

     /**
      * The different shape of a marker:
      * * Circle
      * * Rectangle
      * * Triangle
      * * Diamond
      * * HorizontalLine
      * * VerticalLine
      * * Pentagon
      * * InvertedTriangle
      * * Image
      * @blazorType PivotChartShape
      * @default 'Circle'
      * @blazorDefaultValue PivotChartShape.Circle
      */
     @Property('Circle')
     public shape: ChartShape;


     /**
      * The URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
      * @default ''
      */
     @Property('')
     public imageUrl: string;

     /**
      * The height of the marker in pixels.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public height: number;

     /**
      * The width of the marker in pixels.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public width: number;

     /**
      * Options for customizing the border of a marker.
      */
     @Complex<PivotChartBorderModel>({ width: 2, color: null }, Border)
     public border: PivotChartBorderModel;

     /**
      * The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. 
      * By default, it will take series' color.
      * @default null
      */
     @Property(null)
     public fill: string;

     /**
      * The opacity of the marker.
      * @default 1
      */
     @Property(1)
     public opacity: number;

     /**
      * The data label for the series.
      */
     @Complex<PivotChartDataLabelSettingsModel>({}, DataLabelSettings)
     public dataLabel: PivotChartDataLabelSettingsModel;
}
export class PivotChartSeriesErrorSettings {
     /**
      * If set true, error bar for data gets rendered.
      * @default false
      */
     @Property(false)
     public visible: boolean;

     /**
      * The type of the error bar . They are
      * * Fixed -  Renders a fixed type error bar.
      * * Percentage - Renders a percentage type error bar.
      * * StandardDeviation - Renders a standard deviation type error bar.
      * * StandardError -Renders a standard error type error bar.
      * * Custom -Renders a custom type error bar.
      * @blazorType PivotChartErrorBarType
      * @default 'Fixed'
      * @blazorDefaultValue PivotChartErrorBarType.Fixed
      */
     @Property('Fixed')
     public type: ErrorBarType;

     /**
      * The direction of the error bar . They are
      * * both -  Renders both direction of error bar.
      * * minus - Renders minus direction of error bar.
      * * plus - Renders plus direction error bar.
      * @blazorType PivotChartErrorBarDirection
      * @default 'Both'
      * @blazorDefaultValue PivotChartErrorBarDirection.Both
      */
     @Property('Both')
     public direction: ErrorBarDirection;

     /**
      * The mode of the error bar . They are
      * * Vertical -  Renders a vertical error bar.
      * * Horizontal - Renders a horizontal error bar.
      * * Both - Renders both side error bar.
      * @blazorType PivotChartErrorBarMode
      * @default 'Vertical'
      * @blazorDefaultValue PivotChartErrorBarMode.Vertical
      */
     @Property('Vertical')
     public mode: ErrorBarMode;

     /**
      *  The color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;

     /**
      * The vertical error of the error bar.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public verticalError: number;

     /**
      * The stroke width of the error bar..
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * The horizontal error of the error bar.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public horizontalError: number;

     /**
      * The vertical positive error of the error bar.
      * @default 3
      * @blazorType int
      */
     @Property(3)
     public verticalPositiveError: number;

     /**
      * The vertical negative error of the error bar.
      * @default 3
      * @blazorType int
      */
     @Property(3)
     public verticalNegativeError: number;

     /**
      * The horizontal positive error of the error bar.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public horizontalPositiveError: number;

     /**
      * The horizontal negative error of the error bar.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public horizontalNegativeError: number;

     /**
      * Options for customizing the cap of the error bar.
      */
     @Complex<PivotChartErrorBarCapSettingsModel>(null, ErrorBarCapSettings)
     public errorBarCap: PivotChartErrorBarCapSettingsModel;
}
export class PivotChartSeriesTrendline {
     /**
      * Defines the name of trendline
      * @default ''
      */
     @Property('')
     public name: string;

     /**
      * Defines the type of the trendline
      * @blazorType PivotChartTrendlineTypes
      * @default 'Linear'
      * @blazorDefaultValue PivotChartTrendlineTypes.Linear
      */
     @Property('Linear')
     public type: TrendlineTypes;

     /**
      * Defines the period, the price changes over which will be considered to predict moving average trend line
      * @default 2
      * @blazorType int
      */
     @Property(2)
     public period: number;

     /**
      * Defines the polynomial order of the polynomial trendline
      * @default 2
      * @blazorType int
      */
     @Property(2)
     public polynomialOrder: number;

     /**
      * Defines the period, by which the trend has to backward forecast
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public backwardForecast: number;

     /**
      * Defines the period, by which the trend has to forward forecast
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public forwardForecast: number;

     /**
      * Options to customize the animation for trendlines
      */
     @Complex<PivotChartAnimationModel>({}, Animation)
     public animation: PivotChartAnimationModel;

     /**
      * Options to customize the marker for trendlines
      */
     @Complex<PivotChartMarkerSettingsModel>({}, MarkerSettings)
     public marker: PivotChartMarkerSettingsModel;

     /**
      * Enables/disables tooltip for trendlines
      * @default true
      */
     @Property(true)
     public enableTooltip: boolean;


     /**
      * Defines the intercept of the trendline
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public intercept: number;

     /**
      * Defines the fill color of trendline
      * @default ''
      */
     @Property('')
     public fill: string;

     /**
      * Defines the width of the trendline
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * Sets the legend shape of the trendline
      * @blazorType PivotChartLegendShape
      * @default 'SeriesType'
      * @blazorDefaultValue PivotChartLegendShape.SeriesType
      */
     @Property('SeriesType')
     public legendShape: LegendShape;
}
export class PivotChartSeriesEmptyPointSettings {
     /**
      * To customize the fill color of empty points.
      * @default null
      */
     @Property(null)
     public fill: string;

     /**
      * Options to customize the border of empty points.
      * @default "{color: 'transparent', width: 0}"
      */
     @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
     public border: PivotChartBorderModel;

     /**
      * To customize the mode of empty points.
      * @blazorType PivotChartEmptyPointMode
      * @default Gap
      * @blazorDefaultValue PivotChartEmptyPointMode.Gap
      */
     @Property('Gap')
     public mode: EmptyPointMode | AccEmptyPointMode;
}
export class PivotChartSeriesCornerRadius {
     /**
      * Specifies the top left corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public topLeft: number;

     /**
      * Specifies the top right corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public topRight: number;

     /**
      * Specifies the bottom left corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public bottomLeft: number;

     /**
      * Specifies the bottom right corner radius value
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public bottomRight: number;
}

/**
 *  third party configures for chart axis in chart settings.
 */
export class PivotChartAxisFont {
     /**
      * FontStyle for the text.
      * @default 'Normal'
      */
     @Property('Normal')
     public fontStyle: string;

     /**
      * Font size for the text.
      * @default '16px'
      */
     @Property('16px')
     public size: string;

     /**
      * FontWeight for the text.
      * @default 'Normal'
      */
     @Property('Normal')
     public fontWeight: string;

     /**
      * Color for the text.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * text alignment
      * @blazorType PivotChartAlignment
      * @default 'Center'
      * @blazorDefaultValue PivotChartAlignment.Center
      */
     @Property('Center')
     public textAlignment: Alignment;

     /**
      * FontFamily for the text.
      */
     @Property('Segoe UI')
     public fontFamily: string;

     /**
      * Opacity for the text.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public opacity: number;

     /**
      * Specifies the chart title text overflow
      * @blazorType PivotChartTextOverflow
      * @default 'Trim'
      * @blazorDefaultValue PivotChartTextOverflow.Trim
      */
     @Property('Trim')
     public textOverflow: TextOverflow;
}
export class PivotChartAxisCrosshairTooltip {
     /**
      * If set to true, crosshair ToolTip will be visible.
      *  @default false
      */
     @Property(false)
     public enable: Boolean;

     /**
      * The fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public fill: string;

     /**
      * Options to customize the crosshair ToolTip text.
      */
     @Complex<PivotChartFontModel>(Theme.crosshairLabelFont, Font)
     public textStyle: PivotChartFontModel;
}
export class PivotChartAxisMajorTickLines {
     /**
      * The width of the tick lines in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * The height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public height: number;

     /**
      * The color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;
}
export class PivotChartAxisMajorGridLines {
     /**
      * The width of the line in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * The dash array of the grid lines.
      * @default ''
      */
     @Property('')
     public dashArray: string;

     /**
      * The color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;
}
export class PivotChartAxisMinorTickLines {
     /**
      * The width of the tick line in pixels.
      * @default 0.7
      */
     @Property(0.7)
     public width: number;

     /**
      * The height of the ticks in pixels.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public height: number;

     /**
      * The color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;
}
export class PivotChartAxisMinorGridLines {
     /**
      * The width of the line in pixels.
      * @default 0.7
      */
     @Property(0.7)
     public width: number;

     /**
      * The dash array of grid lines.
      * @default ''
      */
     @Property('')
     public dashArray: string;

     /**
      * The color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;
}
export class PivotChartAxisAxisLine {
     /**
      * The width of the line in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * The dash array of the axis line.
      * @default ''
      */
     @Property('')
     public dashArray: string;

     /**
      * The color of the axis line that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public color: string;
}
export class PivotChartAxisStripLineSettings {
     /**
      * If set true, strip line for pivot chart axis renders.
      * @default true
      */
     @Property(true)
     public visible: boolean;

     /**
      *  If set true, strip line get render from  pivot chart axis origin.
      *  @default false
      */
     @Property(false)
     public startFromAxis: boolean;

     /**
      * Start value of the  pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public start: number | Date;

     /**
      * End value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public end: number | Date;

     /**
      * Size of the pivot chart strip line, when it starts from the origin.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public size: number;

     /**
      * Color of the pivot chart strip line.
      * @default '#808080'
      */
     @Property('#808080')
     public color: string;

     /**
      * Dash Array of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public dashArray: string;

     /**
      * Size type of the pivot chart strip line
      * @blazorType PivotChartSizeType
      * @default Auto
      * @blazorDefaultValue PivotChartSizeType.Auto
      */
     @Property('Auto')
     public sizeType: SizeType;

     /**
      * isRepeat value of the  pivot chart strip line.
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(false)
     public isRepeat: boolean;

     /**
      * repeatEvery value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public repeatEvery: number | Date;

     /**
      * repeatUntil value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public repeatUntil: number | Date;

     /**
      * isSegmented value of the pivot chart strip line
      * @default false
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(false)
     public isSegmented: boolean;

     /**
      * segmentStart value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentStart: number | Date;

     /**
      * segmentEnd value of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentEnd: number | Date;

     /**
      * segmentAxisName of the pivot chart strip line.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public segmentAxisName: string;

     /**
      * Border of the  pivot chart strip line.
      */
     @Complex<PivotChartBorderModel>({ color: 'transparent', width: 1 }, Border)
     public border: PivotChartBorderModel;

     /**
      * Strip line text.
      * @default ''
      */
     @Property('')
     public text: string;

     /**
      * The angle to which the strip line text gets rotated.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public rotation: number;

     /**
      * Defines the position of the strip line text horizontally. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      * @blazorDefaultValue PivotChartAnchor.Middle
      */
     @Property('Middle')
     public horizontalAlignment: Anchor;

     /**
      * Defines the position of the strip line text vertically. They are,
      * * Start: Places the strip line text at the start.
      * * Middle: Places the strip line text in the middle.
      * * End: Places the strip line text at the end.
      * @blazorType PivotChartAnchor
      * @default 'Middle'
      * @blazorDefaultValue PivotChartAnchor.Middle
      */
     @Property('Middle')
     public verticalAlignment: Anchor;

     /**
      * Options to customize the strip line text.
      */
     @Complex<PivotChartFontModel>(Theme.stripLineLabelFont, Font)
     public textStyle: PivotChartFontModel;

     /**
      * Specifies the order of the strip line. They are,
      * * Behind: Places the strip line behind the series elements.
      * * Over: Places the strip line over the series elements.
      * @blazorType PivotChartZIndex
      * @default 'Behind'
      * @blazorDefaultValue PivotChartZIndex.Behind
      */
     @Property('Behind')
     public zIndex: ZIndex;

     /**
      * Strip line Opacity
      * @default 1
      */
     @Property(1)
     public opacity: number;
}
export class PivotChartAxisLabelBorder {
     /**
      * The color of the border that accepts value in hex and rgba as a valid CSS color string.
      * @default ''
      */
     @Property('')
     public color: string;

     /**
      * The width of the border in pixels.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public width: number;

     /**
      * Border type for labels
      * * Rectangle
      * * Without Top Border
      * * Without Top and BottomBorder
      * * Without Border
      * * Brace
      * * CurlyBrace
      * @blazorType PivotChartBorderType
      * @default 'Rectangle'
      * @blazorDefaultValue PivotChartBorderType.Rectangle
      */
     @Property('Rectangle')
     public type: BorderType;
}

/**
 *  third party configures in chart settings.
 */
export class PivotChartSettingsChartArea {
     /**
      * Options to customize the border of the chart area.
      */
     @Complex<PivotChartBorderModel>({}, Border)
     public border: PivotChartBorderModel;

     /**
      * The background of the chart area that accepts value in hex and rgba as a valid CSS color string..
      * @default 'transparent'
      */
     @Property('transparent')
     public background: string;

     /**
      * The opacity for background.
      * @default 1
      */
     @Property(1)
     public opacity: number;
}
export class PivotChartSettingsCrosshairSettings {
     /**
      * If set to true, crosshair line becomes visible.
      * @default false
      */
     @Property(false)
     public enable: boolean;

     /**
      * DashArray for crosshair.
      * @default ''
      */
     @Property('')
     public dashArray: string;

     /**
      * Options to customize the crosshair line.
      */
     @Complex<PivotChartBorderModel>({ color: null, width: 1 }, Border)
     public line: PivotChartBorderModel;

     /**
      * Specifies the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
      * * None: Hides both vertical and horizontal crosshair lines.
      * * Both: Shows both vertical and horizontal crosshair lines.
      * * Vertical: Shows the vertical line.
      * * Horizontal: Shows the horizontal line.
      * @blazorType PivotChartLineType
      * @default Both
      * @blazorDefaultValue PivotChartLineType.Both
      */
     @Property('Both')
     public lineType: LineType;
}
export class PivotChartSettingsLegendSettings {
     /**
      * If set to true, legend will be visible.
      * @default true
      */
     @Property(true)
     public visible: boolean;

     /**
      * The height of the legend in pixels.
      * @default null
      */
     @Property(null)
     public height: string;

     /**
      * The width of the legend in pixels.
      * @default null
      */
     @Property(null)
     public width: string;

     /**
      * Specifies the location of the legend, relative to the chart.
      * If x is 20, legend moves by 20 pixels to the right of the chart. It requires the `position` to be `Custom`.
      * ```html
      * <div id='Chart'></div>
      * ```
      * ```typescript
      * let chart: Chart = new Chart({
      * ...
      *   legendSettings: {
      *     visible: true,
      *     position: 'Custom',
      *     location: { x: 100, y: 150 },
      *   },
      * ...
      * });
      * chart.appendTo('#Chart');
      * ```
      */
     @Complex<LocationModel>({ x: 0, y: 0 }, ChartLocation)
     public location: LocationModel;

     /**
      * Position of the legend in the chart are,
      * * Auto: Places the legend based on area type.
      * * Top: Displays the legend at the top of the chart.
      * * Left: Displays the legend at the left of the chart.
      * * Bottom: Displays the legend at the bottom of the chart.
      * * Right: Displays the legend at the right of the chart.
      * * Custom: Displays the legend  based on the given x and y values.
      * @blazorType PivotChartLegendPosition
      * @default 'Auto'
      * @blazorDefaultValue PivotChartLegendPosition.Auto
      */
     @Property('Auto')
     public position: LegendPosition;

     /**
      * Option to customize the padding between legend items.
      * @default 8
      * @blazorType int
      */
     @Property(8)
     public padding: number;

     /**
      * Legend in chart can be aligned as follows:
      * * Near: Aligns the legend to the left of the chart.
      * * Center: Aligns the legend to the center of the chart.
      * * Far: Aligns the legend to the right of the chart.
      * @blazorType PivotChartAlignment
      * @default 'Center'
      * @blazorDefaultValue PivotChartAlignment.Center
      */
     @Property('Center')
     public alignment: Alignment;

     /**
      * Options to customize the legend text.
      */
     @Complex<PivotChartFontModel>(Theme.legendLabelFont, Font)
     public textStyle: PivotChartFontModel;

     /**
      * Shape height of the legend in pixels.
      * @default 10
      * @blazorType int
      */
     @Property(10)
     public shapeHeight: number;

     /**
      * Shape width of the legend in pixels.
      * @default 10
      * @blazorType int
      */
     @Property(10)
     public shapeWidth: number;

     /**
      * Options to customize the border of the legend.
      */
     @Complex<PivotChartBorderModel>({}, Border)
     public border: PivotChartBorderModel;

     /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
     @Complex<PivotChartMarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
     public margin: PivotChartMarginModel;

     /**
      * Padding between the legend shape and text.
      * @default 5
      * @blazorType int
      */
     @Property(5)
     public shapePadding: number;

     /**
      * The background color of the legend that accepts value in hex and rgba as a valid CSS color string.
      * @default 'transparent'
      */
     @Property('transparent')
     public background: string;

     /**
      * Opacity of the legend.
      * @default 1
      */
     @Property(1)
     public opacity: number;

     /**
      * If set to true, series' visibility collapses based on the legend visibility.
      * @default true
      */
     @Property(true)
     public toggleVisibility: boolean;

     /**
      * Description for legends.
      * @default null
      */
     @Property(null)
     public description: string;

     /**
      * TabIndex value for the legend.
      * @default 3
      * @blazorType int
      */
     @Property(3)
     public tabIndex: number;
}
export class PivotChartSettingsIndexes {
     /**
      * Specifies the series index
      * @default 0
      * @aspType int
      * @blazorType int
      */
     @Property(0)
     public series: number;

     /**
      * Specifies the point index
      * @default 0
      * @aspType int
      * @blazorType int
      */
     @Property(0)
     public point: number;
}
export class PivotChartSettingsMargin {
     /**
      * Left margin in pixels.
      * @default 10
      */
     @Property(10)
     public left: number;

     /**
      * Right margin in pixels.
      * @default 10
      */
     @Property(10)
     public right: number;

     /**
      * Top margin in pixels.
      * @default 10
      */
     @Property(10)
     public top: number;

     /**
      * Bottom margin in pixels.
      * @default 10
      */
     @Property(10)
     public bottom: number;
}

/**
 *  Configures the series in charts.
 */
export class PivotSeries extends ChildProperty<PivotSeries> {

     /**
      * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public fill: string;

     /**
      * Options to customizing animation for the series.
      * @default null
      */
     @Complex<PivotChartAnimationModel>(null, Animation)
     public animation: PivotChartAnimationModel;

     /**
      * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.
      * @default '0'
      */
     @Property('0')
     public dashArray: string;

     /**
      * The stroke width for the series that is applicable only for `Line` type series.
      * @default 1
      */
     @Property(1)
     public width: number;


     /**
      * Defines the axis, based on which the line series will be split.
      */
     @Property('X')
     public segmentAxis: Segment;

     /**
      * Type of series to be drawn in radar or polar series. They are
      *  'Line'
      *  'Column'
      *  'Area'
      *  'Scatter'
      *  'Spline'
      *  'StackingColumn'
      *  'StackingArea'
      *  'RangeColumn'
      *  'SplineArea'
      * @blazorType PivotChartDrawType
      * @default 'Line'
      * @blazorDefaultValue PivotChartDrawType.Line
      */
     @Property('Line')
     public drawType: ChartDrawType;

     /**
      * Specifies whether to join start and end point of a line/area series used in polar/radar chart to form a closed path.
      * @default true
      */
     @Property(true)
     public isClosed: boolean;

     /**
      * Defines the collection of regions that helps to differentiate a line series.
      */
     @Collection<PivotChartSegmentModel>([], ChartSegment)
     public segments: PivotChartSegmentModel[];

     /**
      * This property allows grouping series in `stacked column / bar` charts.
      * Any string value can be provided to the stackingGroup property.
      * If any two or above series have the same value, those series will be grouped together.
      * @default ''
      */
     @Property('')
     public stackingGroup: string;

     /**
      * Options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
      */
     @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
     public border: PivotChartBorderModel;

     /**
      * Specifies the visibility of series.
      * @default true
      */
     @Property(true)
     public visible: boolean;

     /**
      * The opacity of the series.
      * @default 1
      */
     @Property(1)
     public opacity: number;

     /**
      * The type of the series are
      * * StackingColumn
      * * StackingArea
      * * StackingBar
      * * StepLine      
      * * Line
      * * Column
      * * Area
      * * Bar
      * * StepArea
      * * Pareto
      * * Bubble
      * * Scatter     
      * * Spline
      * * SplineArea
      * * StackingColumn100
      * * StackingBar100
      * * StackingArea100
      * * Polar
      * * Radar
      * @default 'Line'
      */

     @Property('Line')
     public type: ChartSeriesType;

     /**
      * Options for displaying and customizing markers for individual points in a series.
      */
     @Complex<PivotChartMarkerSettingsModel>(null, MarkerSettings)
     public marker: PivotChartMarkerSettingsModel;

     /**
      * Options for displaying and customizing error bar for individual point in a series.
      */
     @Complex<PivotChartErrorBarSettingsModel>(null, ErrorBarSettings)
     public errorBar: PivotChartErrorBarSettingsModel;

     /**
      * If set true, the Tooltip for series will be visible.
      * @default true
      */
     @Property(true)
     public enableTooltip: boolean;

     /**
      * Defines the collection of trendlines that are used to predict the trend
      */
     @Collection<PivotChartTrendlineModel>([], Trendline)
     public trendlines: PivotChartTrendlineModel[];

     /**
      * The provided value will be considered as a Tooltip name 
      * @default ''
      */
     @Property('')
     public tooltipMappingName: string;

     /**
      * The shape of the legend. Each series has its own legend shape. They are,
      * * Circle
      * * Rectangle
      * * VerticalLine
      * * Pentagon
      * * InvertedTriangle
      * * SeriesType     
      * * Triangle
      * * Diamond
      * * Cross
      * * HorizontalLine
      * @blazorType PivotChartLegendShape
      * @default 'SeriesType'
      * @blazorDefaultValue PivotChartLegendShape.SeriesType
      */

     @Property('SeriesType')
     public legendShape: LegendShape;

     /**
      * Minimum radius
      * @default 1
      */
     @Property(1)
     public minRadius: number;

     /**
      * Custom style for the selected series or points.
      * @default null
      */
     @Property(null)
     public selectionStyle: string;

     /**
      * Defines type of spline to be rendered.
      * @blazorType PivotChartSplineType
      * @default 'Natural'
      * @blazorDefaultValue PivotChartSplineType.Natural
      */
     @Property('Natural')
     public splineType: SplineType;

     /**
      * Maximum radius
      * @default 3
      */
     @Property(3)
     public maxRadius: number;

     /**
      * It defines tension of cardinal spline types
      * @default 0.5
      */
     @Property(0.5)
     public cardinalSplineTension: number;

     /**
      * To render the column series points with particular column width.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      */
     @Property(null)
     public columnWidth: number;

     /**
      * options to customize the empty points in series
      */
     @Complex<PivotChartEmptyPointSettingsModel>(null, EmptyPointSettings)
     public emptyPointSettings: PivotChartEmptyPointSettingsModel;


     /**
      * To render the column series points with particular rounded corner.
      */
     @Complex<PivotChartCornerRadiusModel>(null, CornerRadius)
     public cornerRadius: PivotChartCornerRadiusModel;

     /**
      * To render the column series points with particular column spacing. It takes value from 0 - 1.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public columnSpacing: number;
}

/**
 * Configures the axes in charts.
 */
export class PivotAxis extends ChildProperty<PivotAxis> {

     /**
      * Specifies the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
      * * Rotate45: Rotates the label to 45 degree when it intersects.
      * * Rotate90: Rotates the label to 90 degree when it intersects.     
      * * None: Shows all the labels.
      * * Hide: Hides the label when it intersects.
      * @blazorType PivotChartLabelIntersectAction
      * @default Rotate45
      * @blazorDefaultValue PivotChartLabelIntersectAction.Rotate45
      */
     @Property('Rotate45')
     public labelIntersectAction: LabelIntersectAction;

     /**
      * Options to customize the axis label.
      */
     @Complex<PivotChartFontModel>(Theme.axisLabelFont, Font)
     public labelStyle: PivotChartFontModel;

     /**
      * Specifies the title of an axis.
      * @default ''
      */
     @Property('')
     public title: string;

     /**
      * Options to customize the crosshair ToolTip.
      */
     @Complex<PivotChartCrosshairTooltipModel>({}, CrosshairTooltip)
     public crosshairTooltip: PivotChartCrosshairTooltipModel;

     /**
      * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
      * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
      * @default ''
      */
     @Property('')
     public labelFormat: string;

     /**
      * Options for customizing the axis title.
      */
     @Complex<PivotChartFontModel>(Theme.axisTitleFont, Font)
     public titleStyle: PivotChartFontModel;

     /**
      * Specifies indexed category  axis.
      * @default false
      */
     @Property(false)
     public isIndexed: boolean;

     /**
      * Left and right padding for the plot area in pixels.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public plotOffset: number;

     /**
      * Specifies the position of labels at the edge of the axis.They are,
      * * Shift: Shifts the edge labels.
      * * None: No action will be performed.
      * * Hide: Edge label will be hidden.     
      * @blazorType PivotChartEdgeLabelPlacement
      * @default 'None'
      * @blazorDefaultValue PivotChartEdgeLabelPlacement.None
      */
     @Property('None')
     public edgeLabelPlacement: EdgeLabelPlacement;

     /**
      * Specifies the placement of a label for category axis. They are,
      * * onTicks: Renders the label on the ticks.     
      * * betweenTicks: Renders the label between the ticks.
      * @blazorType PivotChartLabelPlacement
      * @default 'BetweenTicks'
      * @blazorDefaultValue PivotChartLabelPlacement.BetweenTicks
      */
     @Property('BetweenTicks')
     public labelPlacement: LabelPlacement;

     /**
      * Specifies the placement of a ticks to the axis line. They are,
      * * outside: Renders the ticks outside to the axis line.     
      * * inside: Renders the ticks inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      * @blazorDefaultValue PivotChartAxisPosition.Outside
      */
     @Property('Outside')
     public tickPosition: AxisPosition;

     /**
      * If set to true, the axis will render at the opposite side of its default position.
      * @default false
      */
     @Property(false)
     public opposedPosition: boolean;

     /**
      * If set to true, axis label will be visible.
      * @default true
      */
     @Property(true)
     public visible: boolean;

     /**
      * Specifies the placement of a labels to the axis line. They are,
      * * outside: Renders the labels outside to the axis line.     
      * * inside: Renders the labels inside to the axis line.
      * @blazorType PivotChartAxisPosition
      * @default 'Outside'
      * @blazorDefaultValue PivotChartAxisPosition.Outside
      */
     @Property('Outside')
     public labelPosition: AxisPosition;

     /**
      * The angle to which the axis label gets rotated.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public labelRotation: number;

     /**
      * Specifies the number of minor ticks per interval.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public minorTicksPerInterval: number;

     /**
      * Specifies the maximum range of an axis.
      * @default null
      */
     @Property(null)
     public maximum: Object;

     /**
      * Specifies the minimum range of an axis.
      * @default null
      */
     @Property(null)
     public minimum: Object;

     /**
      * Specifies the maximum width of an axis label.
      * @default 34.
      * @blazorType int
      */
     @Property(34)
     public maximumLabelWidth: number;

     /**
      * Specifies the interval for an axis.
      * @default null
      * @aspDefaultValueIgnore
      * @blazorDefaultValueIgnore
      * @blazorType int
      */
     @Property(null)
     public interval: number;

     /**
      * Options for customizing major tick lines.
      */
     @Complex<PivotChartMajorTickLinesModel>({}, MajorTickLines)
     public majorTickLines: PivotChartMajorTickLinesModel;

     /**
      * Specifies the Trim property for an axis.
      * @default false
      */
     @Property(false)
     public enableTrim: boolean;

     /**
      * Options for customizing major grid lines.
      */
     @Complex<PivotChartMajorGridLinesModel>({}, MajorGridLines)
     public majorGridLines: PivotChartMajorGridLinesModel;

     /**
      * Options for customizing minor tick lines.
      */
     @Complex<PivotChartMinorTickLinesModel>({}, MinorTickLines)
     public minorTickLines: PivotChartMinorTickLinesModel;

     /**
      * Options for customizing axis lines.
      */
     @Complex<PivotChartAxisLineModel>({}, AxisLine)
     public lineStyle: PivotChartAxisLineModel;

     /**
      * Options for customizing minor grid lines.
      */
     @Complex<PivotChartMinorGridLinesModel>({}, MinorGridLines)
     public minorGridLines: PivotChartMinorGridLinesModel;

     /**
      * It specifies whether the axis to be rendered in inversed manner or not.
      * @default false
      */
     @Property(false)
     public isInversed: boolean;

     /**
      * Description for axis and its element.
      * @default null
      */
     @Property(null)
     public description: string;

     /**
      * The start angle for the series.
      * @default 0
      * @blazorType int
      */
     @Property(0)
     public startAngle: number;

     /**
      * The polar radar radius position.
      * @default 100
      * @blazorType int
      */
     @Property(100)
     public coefficient: number;

     /**
      * Specifies the stripLine collection for the axis
      */
     @Collection<StripLineSettings>([], StripLineSettings)
     public stripLines: PivotChartStripLineSettingsModel[];

     /**
      * TabIndex value for the axis.
      * @default 2
      * @blazorType int
      */
     @Property(2)
     public tabIndex: number;

     /**
      * Border of the multi level labels.
      */
     @Complex<PivotChartLabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
     public border: PivotChartLabelBorderModel;
}


/**
 * Configures the ToolTips in the chart.
 */
export class PivotTooltipSettings extends ChildProperty<PivotTooltipSettings> {


     /**
      * Enables / Disables the visibility of the marker.
      * @default false.
      */
     @Property(false)
     public enableMarker: boolean;

     /**
      * Enables / Disables the visibility of the tooltip.
      * @default true.
      */
     @Property(true)
     public enable: boolean;

     /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
      * @default null 
      */

     @Property(null)
     public fill: string;

     /**
      * If set to true, a single ToolTip will be displayed for every index.
      * @default false.
      */
     @Property(false)
     public shared: boolean;

     /**
      * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string. 
      * @default 0.75
      */
     @Property(0.75)
     public opacity: number;

     /**
      * Header for tooltip. 
      * @default null
      */
     @Property(null)
     public header: string;

     /**
      * Format the ToolTip content.
      * @default null.
      */
     @Property(null)
     public format: string;

     /**
      * Options to customize the ToolTip text.
      */
     @Complex<PivotChartFontModel>(Theme.tooltipLabelFont, Font)
     public textStyle: PivotChartFontModel;

     /**
      * Custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
      * @default null.
      */
     @Property(null)
     public template: string;

     /**
      * Options to customize tooltip borders.
      */
     @Complex<PivotChartBorderModel>({ color: '#cccccc', width: 0.5 }, Border)
     public border: PivotChartBorderModel;

     /**
      * If set to true, ToolTip will animate while moving from one point to another.
      * @default true.
      */
     @Property(true)
     public enableAnimation: boolean;
}

/**
 * Configures the zooming behavior for the chart.
 */
export class PivotZoomSettings extends ChildProperty<PivotZoomSettings> {

     /**
      * If to true, chart can be pinched to zoom in / zoom out.
      * @default false
      */
     @Property(false)
     public enablePinchZooming: boolean;

     /**
      * If set to true, chart can be zoomed by a rectangular selecting region on the plot area.
      * @default true
      */
     @Property(true)
     public enableSelectionZooming: boolean;

     /**
      * If set to true, zooming will be performed on mouse up. It requires `enableSelectionZooming` to be true.
      * ...
      *    zoomSettings: {
      *      enableSelectionZooming: true,
      *      enableDeferredZooming: false
      *    }
      * ...
      * @default false
      */

     @Property(false)
     public enableDeferredZooming: boolean;

     /**
      * If set to true, chart can be zoomed by using mouse wheel.
      * @default false
      */
     @Property(false)
     public enableMouseWheelZooming: boolean;

     /**
      * Specifies whether to allow zooming vertically or horizontally or in both ways. They are,
      * * x: Chart can be zoomed horizontally.
      * * y: Chart can be zoomed  vertically.     
      * * x,y: Chart can be zoomed both vertically and horizontally.
      *  It requires `enableSelectionZooming` to be true.
      * 
      * ...
      *    zoomSettings: {
      *      enableSelectionZooming: true,
      *      mode: 'XY'
      *    }
      * ...
      * @blazorType PivotChartZoomMode
      * @default 'XY'
      * @blazorDefaultValue PivotChartZoomMode.XY
      */
     @Property('XY')
     public mode: ZoomMode;

     /**
      * Specifies the toolkit options for the zooming as follows:
      * * ZoomIn
      * * ZoomOut
      * * Pan     
      * * Zoom
      * * Reset
      * @blazorType List<PivotChartToolbarItems>
      * @default '["Zoom", "ZoomIn", "ZoomOut", "Pan", "Reset"]'
      */

     @Property(['Zoom', 'ZoomIn', 'ZoomOut', 'Pan', 'Reset'])
     public toolbarItems: ToolbarItems[];

     /**
      * Specifies whether axis needs to have scrollbar.
      * @default true.
      */
     @Property(true)
     public enableScrollbar: boolean;

     /**
      * Specifies whether chart needs to be panned by default.
      * @default false.
      */
     @Property(false)
     public enablePan: boolean;
}

/** 
 *  Configures the chart settings.
 */
export class ChartSettings extends ChildProperty<ChartSettings> {

     /**     
      * Options to configures the series of chart.
      */
     @Complex<PivotSeriesModel>({}, PivotSeries)
     public chartSeries: PivotSeriesModel;

     /**     
      * Options to configure the horizontal axis of chart.
      */
     @Complex<PivotAxisModel>({}, PivotAxis)
     public primaryXAxis: PivotAxisModel;

     /**     
      * Options to configure the vertical axis of chart.
      */
     @Complex<PivotAxisModel>({}, PivotAxis)
     public primaryYAxis: PivotAxisModel;

     /**     
      * Defines the measure to load in chart
      * @default ''
      */
     @Property('')
     public value: string;

     /**     
      * Defines the measure to load in chart
      * @default false
      */
     @Property(false)
     public enableMultiAxis: boolean;

     /**     
      * Enable or disable scroll bar while multiple axis.
      * @default false
      */
     @Property(false)
     public enableScrollOnMultiAxis: boolean;

     /**
      * Options for customizing the title of the Chart.
      */
     @Complex<PivotChartFontModel>(Theme.chartTitleFont, Font)
     public titleStyle: PivotChartFontModel;

     /**
      * Title of the chart
      * @default ''
      */
     @Property('')
     public title: string;

     /**
      * Options for customizing the Subtitle of the Chart.
      */
     @Complex<PivotChartFontModel>(Theme.chartSubTitleFont, Font)
     public subTitleStyle: PivotChartFontModel;

     /**
      * SubTitle of the chart
      * @default ''
      */
     @Property('')
     public subTitle: string;

     /**
      * Options for customizing the color and width of the chart border.
      */
     @Complex<PivotChartBorderModel>({ color: '#DDDDDD', width: 0 }, Border)
     public border: PivotChartBorderModel;

     /**
      *  Options to customize left, right, top and bottom margins of the chart.
      */
     @Complex<PivotChartMarginModel>({}, Margin)
     public margin: PivotChartMarginModel;

     /**
      * Options for configuring the border and background of the chart area.
      */
     @Complex<PivotChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
     public chartArea: PivotChartAreaModel;

     /**
      * The background color of the chart that accepts value in hex and rgba as a valid CSS color string.
      * @default null
      */
     @Property(null)
     public background: string;

     /**
      * Specifies the theme for the chart.
      * @blazorType PivotChartTheme
      * @default 'Material'
      * @blazorDefaultValue PivotChartTheme.Material
      */
     @Property('Material')
     public theme: ChartTheme;

     /**
      * Palette for the chart series.
      * @default []
      */
     @Property([])
     public palettes: string[];


     /**
      * Options for customizing the crosshair of the chart.
      */
     @Complex<PivotChartCrosshairSettingsModel>({}, CrosshairSettings)
     public crosshair: PivotChartCrosshairSettingsModel;

     /**
      * Options for customizing the tooltip of the chart.
      */
     @Complex<PivotTooltipSettingsModel>({}, PivotTooltipSettings)
     public tooltip: PivotTooltipSettingsModel;

     /**
      * Options to enable the zooming feature in the chart.
      */
     @Complex<PivotZoomSettingsModel>({}, PivotZoomSettings)
     public zoomSettings: PivotZoomSettingsModel;

     /**
      * Options for customizing the legend of the chart.
      */
     @Property()
     public legendSettings: LegendSettingsModel;

     /**
      * Specifies whether series or data point has to be selected. They are,
      * * none: Disables the selection.
      * * series: selects a series.
      * * dragXY: selects points by dragging with respect to both horizontal and vertical axes
      * * dragX: selects points by dragging with respect to horizontal axis.
      * * dragY: selects points by dragging with respect to vertical axis.      
      * * point: selects a point.
      * * cluster: selects a cluster of point
      * @default 'None'
      */
     @Property('None')
     public selectionMode: ChartSelectionMode;

     /**
      * To enable export feature in chart.
      * @default true
      */
     @Property(true)
     public enableExport: boolean;

     /**
      * If set true, enables the multi selection in chart. It requires `selectionMode` to be `Point` | `Series` | or `Cluster`.
      * @default false
      */
     @Property(false)
     public isMultiSelect: boolean;

     /**
      * Specifies the point indexes to be selected while loading a chart.
      * It requires `selectionMode` to be `Point` | `Series`.
      * ...
      *   selectionMode: 'Point',
      *   selectedDataIndexes: [ { series: 0, point: 1},
      *                          { series: 2, point: 3} ],
      * ...
      * @default []
      * @blazorType List<PivotChartIndexes>
      */
     @Collection<PivotChartIndexesModel>([], Indexes)
     public selectedDataIndexes: PivotChartIndexesModel[];

     /**
      * If set true, Animation process will be executed.
      * @default true
      */
     @Property(true)
     public enableAnimation: boolean;

     /**
      * Specifies whether a grouping separator should be used for a number.
      * @default true
      */
     @Property(true)
     public useGroupingSeparator: boolean;

     /**
      * It specifies whether the chart should be render in transposed manner or not.
      * @default false
      */
     @Property(false)
     public isTransposed: boolean;

     /**
      * TabIndex value for the chart.
      * @default 1
      * @blazorType int
      */
     @Property(1)
     public tabIndex: number;

     /**
      * Description for chart.
      * @default null
      */
     @Property(null)
     public description: string;

     /**
      * Triggers after resizing of chart
      * @event
      * @deprecated
      */
     @Event()
     public resized: EmitType<IResizeEventArgs>;

     /**
      * To enable the side by side placing the points for column type series.
      * @default true
      */
     @Property(true)
     public enableSideBySidePlacement: boolean;

     /**
      * Triggers after chart load.
      * @event
      * @deprecated
      */
     @Event()
     public loaded: EmitType<ILoadedEventArgs>;

     /**
      * Triggers before the prints gets started.
      * @event
      * @deprecated
      */
     @Event()
     public beforePrint: EmitType<IPrintEventArgs>;

     /**
      * Triggers after animation is completed for the series.
      * @event
      * @deprecated
      */
     @Event()
     public animationComplete: EmitType<IAnimationCompleteEventArgs>;

     /**
      * Triggers before chart load.
      * @event
      * @deprecated
      */
     @Event()
     public load: EmitType<ILoadedEventArgs>;

     /**
      * Triggers before the data label for series is rendered.
      * @event
      * @deprecated
      */

     @Event()
     public textRender: EmitType<ITextRenderEventArgs>;

     /**
      * Triggers before the legend is rendered.
      * @event
      * @deprecated
      */
     @Event()
     public legendRender: EmitType<ILegendRenderEventArgs>;

     /**
      * Triggers before the series is rendered.
      * @event
      * @deprecated
      */
     @Event()
     public seriesRender: EmitType<ISeriesRenderEventArgs>;

     /**
      * Triggers before each points for the series is rendered.
      * @event
      * @deprecated
      */
     @Event()
     public pointRender: EmitType<IPointRenderEventArgs>;

     /**
      * Triggers before the tooltip for series is rendered.
      * @event
      * @deprecated
      */
     @Event()
     public tooltipRender: EmitType<ITooltipRenderEventArgs>;

     /**
      * Triggers before each axis label is rendered.
      * @event
      * @deprecated
      */
     @Event()
     public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

     /**
      * Triggers on clicking the chart.
      * @event
      * @deprecated
      */
     @Event()
     public chartMouseClick: EmitType<IMouseEventArgs>;

     /**
      * Triggers on hovering the chart.
      * @event
      * @deprecated
      */
     @Event()
     public chartMouseMove: EmitType<IMouseEventArgs>;

     /**
      * Triggers on point move.
      * @event
      * @deprecated
      */
     @Event()
     public pointMove: EmitType<IPointEventArgs>;

     /**
      * Triggers on point click.
      * @event
      * @deprecated
      */
     @Event()
     public pointClick: EmitType<IPointEventArgs>;

     /**
      * Triggers on mouse down.
      * @event
      * @deprecated
      */
     @Event()
     public chartMouseDown: EmitType<IMouseEventArgs>;

     /**
      * Triggers when cursor leaves the chart.
      * @event
      * @deprecated
      */
     @Event()
     public chartMouseLeave: EmitType<IMouseEventArgs>;

     /**
      * Triggers after the drag selection is completed.
      * @event
      * @deprecated
      */
     @Event()
     public dragComplete: EmitType<IDragCompleteEventArgs>;

     /**
      * Triggers on mouse up.
      * @event
      * @deprecated
      */
     @Event()
     public chartMouseUp: EmitType<IMouseEventArgs>;

     /**
      * Triggers when start the scroll.
      * @event
      * @deprecated
      */
     @Event()
     public scrollStart: EmitType<IScrollEventArgs>;

     /**
      * Triggers after the zoom selection is completed.
      * @event
      * @deprecated
      */
     @Event()
     public zoomComplete: EmitType<IZoomCompleteEventArgs>;

     /**
      * Triggers when change the scroll.
      * @event
      * @deprecated
      */
     @Event()
     public scrollChanged: EmitType<IScrollEventArgs>;

     /**
      * Triggers after the scroll end.
      * @event
      * @deprecated
      */
     @Event()
     public scrollEnd: EmitType<IScrollEventArgs>;

     /**
      * Specifies whether to show multilevel labels in chart.
      * @default true
      */
     @Property(true)
     public showMultiLevelLabels: boolean;
}
