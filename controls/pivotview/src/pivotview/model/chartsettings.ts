import { Property, ChildProperty, EmitType, Event, Complex, Collection } from '@syncfusion/ej2-base';
import { BorderModel as PivotChartBorderModel, ErrorBarSettingsModel as PivotChartErrorBarSettingsModel, AccumulationLabelPosition, ILegendClickEventArgs } from '@syncfusion/ej2-charts';
import { ChartDrawType, ChartShape, DataLabelSettingsModel as PivotChartDataLabelSettingsModel, ZoomMode } from '@syncfusion/ej2-charts';
import { ErrorBarType, ErrorBarDirection, ErrorBarMode, TrendlineTypes, ToolbarItems, IScrollEventArgs } from '@syncfusion/ej2-charts';
import { EmptyPointMode, TextOverflow, Alignment, ZIndex, Anchor, SizeType, BorderType, LineType } from '@syncfusion/ej2-charts';
import { TrendlineModel as PivotChartTrendlineModel, LegendShape, SplineType, ILegendRenderEventArgs } from '@syncfusion/ej2-charts';
import { AnimationModel as PivotChartAnimationModel, ChartSegmentModel as PivotChartSegmentModel } from '@syncfusion/ej2-charts';
import { EdgeLabelPlacement, LabelPlacement, MajorTickLinesModel as PivotChartMajorTickLinesModel } from '@syncfusion/ej2-charts';
import { MinorGridLinesModel as PivotChartMinorGridLinesModel, AxisLineModel as PivotChartAxisLineModel } from '@syncfusion/ej2-charts';
import { ChartAreaModel as PivotChartAreaModel, IndexesModel as PivotChartIndexesModel, GroupModes } from '@syncfusion/ej2-charts';
import { IResizeEventArgs, IPrintEventArgs, FontModel as PivotChartFontModel, LegendPosition } from '@syncfusion/ej2-charts';
import { ITextRenderEventArgs, IPointRenderEventArgs, ISeriesRenderEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-charts';
import { IMouseEventArgs, IPointEventArgs, EmptyPointSettingsModel as PivotChartEmptyPointSettingsModel } from '@syncfusion/ej2-charts';
import { LabelIntersectAction, ErrorBarCapSettingsModel as PivotChartErrorBarCapSettingsModel, ChartTheme } from '@syncfusion/ej2-charts';
import { CornerRadiusModel as PivotChartCornerRadiusModel, AccumulationSelectionMode } from '@syncfusion/ej2-charts';
import { MajorGridLinesModel as PivotChartMajorGridLinesModel, ConnectorType, PyramidModes } from '@syncfusion/ej2-charts';
import { IAnimationCompleteEventArgs, StripLineSettingsModel as PivotChartStripLineSettingsModel } from '@syncfusion/ej2-charts';
import { CrosshairTooltipModel as PivotChartCrosshairTooltipModel, IZoomCompleteEventArgs } from '@syncfusion/ej2-charts';
import { LocationModel as PivotChartLocationModel, AccEmptyPointMode, MarkerSettingsModel as PivotChartMarkerSettingsModel } from '@syncfusion/ej2-charts';
import { CrosshairSettingsModel as PivotChartCrosshairSettingsModel, IDragCompleteEventArgs } from '@syncfusion/ej2-charts';
import { LabelBorderModel as PivotChartLabelBorderModel, MarginModel as PivotChartMarginModel } from '@syncfusion/ej2-charts';
import { MinorTickLinesModel as PivotChartMinorTickLinesModel, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-charts';
import { Segment, AxisPosition, LegendSettingsModel, ILoadedEventArgs, SelectionPattern } from '@syncfusion/ej2-charts';
import { PivotSeriesModel, PivotAxisModel, PivotTooltipSettingsModel, PivotZoomSettingsModel } from './chartsettings-model';
import { PivotPieChartCenterModel, PivotChartDataLabelModel, PivotChartConnectorStyleModel } from './chartsettings-model';
import { ChartSeriesType, ChartSelectionMode } from '../../common/base/enum';
import { Theme } from '../../common/base/themes';
import { MultiLevelLabelClickEventArgs, MultiLevelLabelRenderEventArgs, OffsetModel as PivotChartOffsetModel } from '../../common/base/interface';
import { LabelPosition, MultipleAxisMode } from '../../common/base/enum';

/**
 * Allows to configure the animation behavior for chart series such as animation duration and delay.
 */
export class Animation extends ChildProperty<Animation> {

    /**
     * Allow the chart series gets animated on initial loading.
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Allows to set the duration of animation in milliseconds.
     * @default 1000
     */
    @Property(1000)
    public duration: number;

    /**
     * Allows to delay the animation of the chart series.
     * @default 0
     */
    @Property(0)
    public delay: number;
}
/**
 * Allows to customize specific region for line type series with a variety of means such as value, color, pattern of dashes.
 */
export class ChartSegment extends ChildProperty<ChartSegment> {

    /**
     * Allows to set the starting point of region.
     * @default null
     */
    @Property(null)
    public value: Object;   /* eslint-disable-line */

    /**
     * Allows to set the color of a region.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Allows to set the pattern of dashes and gaps to stroke.
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
 * Allows to customize the apprearance of the text in the chart such as font style, font size, font weight, font color, font family, text alignment, opacity, text overflow.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Allows to set the font style to the text in the chart.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Allows to set the font size to the text in the chart.
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Allows to set the font weight to the text in the chart.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Allows to set color to the text in the chart.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set text alignment in the chart
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Allows to set font family to the text in the chart.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Allows to set opacity to the text in the chart.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to specify the chart title text overflow
     * @default 'Trim'
     */
    @Property('Trim')
    public textOverflow: TextOverflow;
}

/**
 * Allow options to customize the left, right, top and bottom margins of the pivot chart.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Allows to set the left margin in pixels.
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Allows to set the right margin in pixels.
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Allows to set the top margin in pixels.
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Allows to set the bottom margin in pixels.
     * @default 10
     */
    @Property(10)
    public bottom: number;
}


/**
 * Allow options to customize the border of the chart such as color and border size in the pivot chart.
 * For example, to display the chart border color as red, set the properties `color` to either **"red"**
 * or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set the width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

}

/**
 * Allows to configure the position of the marker such as top and left in the chart.
 */
export class Offset extends ChildProperty<Offset> {

    /**
     * Allows to set the x(left) value of the marker position
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Allows to set the y(top) value of the marker position
     * @default 0
     */
    @Property(0)
    public y: number;

}

/**
 * Allows you to highlight a specific point of the series while rendering the pivot chart.
 * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
 * @public
 */
export class Indexes extends ChildProperty<Indexes> {
    /**
     * Allows to specify the series index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public series: number;

    /**
     * Allows to specify the point index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public point: number;

}

/**
 * Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart.
 * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
 */
export class ChartArea extends ChildProperty<ChartArea> {

    /**
     * Allows options to customize the border of the chart area.
     */
    @Complex<PivotChartBorderModel>({}, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the background of the chart area that accepts value in hex and rgba as a valid CSS color string..
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Allows to set the opacity to the background of the chart area.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to set the background image of the chart area that accepts value in string as url link or location of an image.
     * @default null
     */
    @Property(null)
    public backgroundImage: string;

}


/**
 * Allow options to customize the crosshair line with different settings such as color and width of the line,
 * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
 */
export class CrosshairSettings extends ChildProperty<CrosshairSettings> {
    /**
     * Allows to show the crosshair lines in the chart.
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Allows to set the pattern of dashes and gaps to crosshair.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allow options to customize the border of the crosshair line such as color and border size in the pivot chart.
     */
    @Complex<PivotChartBorderModel>({ color: null, width: 1 }, Border)
    public line: PivotChartBorderModel;

    /**
     * Allows to specify the line type of the crosshair. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
     * * None: Hides both vertical and horizontal crosshair lines.
     * * Both: Shows both vertical and horizontal crosshair lines.
     * * Vertical: Shows the vertical line.
     * * Horizontal: Shows the horizontal line.
     * @default Both
     */
    @Property('Both')
    public lineType: LineType;

}

/**
 * Allows to configure the data label with different settings such as name, fill color, opacity, rotation angle, border, marging, etc in the chart.
 */

export class DataLabelSettings extends ChildProperty<DataLabelSettings> {

    /**
     * Allows to set the visibility of data label to the series renders.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Allows to set the data source field that contains the data label value.
     * @default null
     */
    @Property(null)
    public name: string;

    /**
     * Allows to set the background color of the data label accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;

    /**
     * Allows to set the opacity to the background.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to specify the rotation angle to data label.
     * @default 0
     */
    @Property(0)
    public angle: number;

    /**
     * Allows to set whether rotation to data label is enable or not.
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;

    /**
     * Allows to specify the position of the data label. They are,
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
     * Allows to set the roundedCornerX for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public rx: number;

    /**
     * Allows to set the roundedCornerY for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public ry: number;

    /**
     * Allows to set the alignment for data Label. They are,
     * * Near: Aligns the label to the left of the point.
     * * Center: Aligns the label to the center of the point.
     * * Far: Aligns the label to the right of the point.
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Allows option for customizing the border lines.
     */
    @Complex<PivotChartBorderModel>({ width: null, color: null }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows customize the margin to the data label.
     */
    @Complex<PivotChartMarginModel>({ left: 5, right: 5, top: 5, bottom: 5 }, Margin)
    public margin: PivotChartMarginModel;

    /**
     * Allows option for customizing the data label text.
     */
    @Complex<PivotChartFontModel>({ size: '11px', color: '', fontStyle: 'Normal', fontWeight: 'Normal', fontFamily: 'Segoe UI' }, Font)
    public font: PivotChartFontModel;

    /**
     * Allows custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     * @default null
     */
    @Property(null)
    public template: string;

}

/**
 * Allow options to customize the pie, funnel, doughnut and pyramid chart data label connector.
 */
export class PivotChartConnectorStyle extends ChildProperty<PivotChartConnectorStyle> {

    /**
     * specifies the type of the connector line for pie, funnel, doughnut and pyramid chart. They are
     * * curve
     * * Line
     * @default 'Line'
     */
    @Property('Line')
    public type: ConnectorType;

    /**
     * Specifies the color of the connector line for pie, funnel, doughnut and pyramid chart.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Width of the connector line in pixels for pie, funnel, doughnut and pyramid chart.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Length of the connector line in pixels for pie, funnel, doughnut and pyramid chart.
     * @default 'null'
     */
    @Property(null)
    public length: string;

    /**
     * dashArray of the connector line for pie, funnel, doughnut and pyramid chart.
     * @default ''
     */
    @Property('')
    public dashArray: string;
}

/**
 * Allow options to customize the pie, funnel, doughnut and pyramid chart data label connector.
 */
export class PivotChartDataLabel extends ChildProperty<PivotChartDataLabel> {

    /**
     * Allows to set the visibility of data label to the series renders.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
    * Allows to set the border to data labels.
    */
    @Complex<PivotChartBorderModel>({ width: null, color: null }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to customize the font of data labels.
     */
    @Complex<PivotChartFontModel>({ size: '11px', color: '', fontStyle: 'Normal', fontWeight: 'Normal', fontFamily: 'Segoe UI' }, Font)
    public font: PivotChartFontModel;

    /**
     * Allows to set the background color of the data label accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;

    /**
     * Allows to specify the rotation angle to data label.
     * @default 0
     */
    @Property(0)
    public angle: number;

    /**
     * Allows to set whether rotation to data label is enable or not.
     * @default false
     */
    @Property(false)
    public enableRotation: boolean;

    /**
     * Allows to specify the position of the data label. They are,
     * * Outside: Positions the label outside the point.
     * * Inside: Positions the label on top of the point.
     * @default 'Outside'
     */
    @Property('Outside')
    public position: AccumulationLabelPosition;

    /**
     * Allows to set the roundedCornerX for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public rx: number;

    /**
     * Allows to set the roundedCornerY for the data label. It requires `border` values not to be null.
     * @default 5
     */
    @Property(5)
    public ry: number;

    /**
     * Allows custom template to show the data label. Use ${point.x} and ${point.y} as a placeholder
     * text to display the corresponding data point.
     * @default null
     */
    @Property(null)
    public template: string;

    /**
     * Allows custom connector of the pie, funnel, pyramid and doughnut chart data label.
     * @default null
     */
    @Complex<PivotChartConnectorStyleModel>({}, PivotChartConnectorStyle)
    public connectorStyle: PivotChartConnectorStyleModel;
}

/**
 *  Allows to configure the marker of the series such as shape, width, height, border, position, fill color, opacity, data label etc in the chart
 */
export class MarkerSettings extends ChildProperty<MarkerSettings> {

    /**
     * Allows the visibility of the marker for chart series.
     * > This is applicable only for line and area type series.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Allows to spcify the shape of a marker.They are
     * * Circle - Renders a circle.
     * * Rectangle - Renders a rectangle.
     * * Triangle - Renders a triangle.
     * * Diamond - Renders a diamond.
     * * Cross - Renders a cross.
     * * HorizontalLine - Renders a horizontalLine.
     * * VerticalLine - Renders a verticalLine.
     * * Pentagon- Renders a pentagon.
     * * InvertedTriangle - Renders a invertedTriangle.
     * * Image - Renders a image.
     * @default 'Circle'
     */
    @Property('Circle')
    public shape: ChartShape;

    /**
     * Allows to set the URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
     * @default ''
     */
    @Property('')
    public imageUrl: string;

    /**
     * Allows to set the width of the marker in pixels.
     * @default 5
     */
    @Property(5)
    public width: number;

    /**
     * Allows to set the height of the marker in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows options for customizing the border of a marker.
     */
    @Complex<PivotChartBorderModel>({ width: 2, color: null }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows options for customizing the marker position.
     */
    @Complex<PivotChartOffsetModel>({ x: 0, y: 0 }, Offset)
    public offset: PivotChartOffsetModel;

    /**
     *  Allows to set the fill color of the marker that accepts value in hex and rgba as a valid CSS color string.
     *  By default, it will take series' color.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows to set the opacity of the marker.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to set the data label for the series.
     */
    @Complex<PivotChartDataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabel: PivotChartDataLabelSettingsModel;
}

/**
 * Allows to configure the error bar cap settings such as cap width, length, color, opacity.
 */
export class ErrorBarCapSettings extends ChildProperty<ErrorBarCapSettings> {

    /**
     * Allows to set the width of the error bar in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the length of the error bar in pixels.
     * @default 10
     */
    @Property(10)
    public length: number;

    /**
     *  Allows to set the stroke color of the cap, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Allows to set the opacity of the cap.
     * @default 1
     */
    @Property(1)
    public opacity: number;
}

/**
 * Allows options for customize the error bar chart with diffent settings such as type, direction, mode, color, width, etc.
 * @public
 */
export class ErrorBarSettings extends ChildProperty<ErrorBarSettings> {

    /**
     * Allows to set the visibility of the error bar gets rendered.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Allows to set the type of the error bar . They are
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
     * Allows to set the direction of the error bar . They are
     * * both -  Renders both direction of error bar.
     * * minus - Renders minus direction of error bar.
     * * plus - Renders plus direction error bar.
     * @default 'Both'
     */
    @Property('Both')
    public direction: ErrorBarDirection;

    /**
     * Allows to set the mode of the error bar . They are
     * * Vertical -  Renders a vertical error bar.
     * * Horizontal - Renders a horizontal error bar.
     * * Both - Renders both side error bar.
     * @default 'Vertical'
     */
    @Property('Vertical')
    public mode: ErrorBarMode;

    /**
     * Allows to set the vertical error of the error bar.
     * @default 1
     */
    @Property(1)
    public verticalError: number;

    /**
     *  Allows to set the color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Allows to set the stroke width of the error bar..
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the horizontal error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalError: number;

    /**
     * Allows to set the vertical negative error of the error bar.
     * @default 3
     */
    @Property(3)
    public verticalNegativeError: number;

    /**
     * Allows to set the vertical positive error of the error bar.
     * @default 3
     */
    @Property(3)
    public verticalPositiveError: number;

    /**
     * Allows to set the horizontal negative error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalNegativeError: number;

    /**
     * Allows to set the horizontal positive error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalPositiveError: number;

    /**
     * Allows options for customizing the cap of the error bar.
     */
    @Complex<PivotChartErrorBarCapSettingsModel>(null, ErrorBarCapSettings)
    public errorBarCap: PivotChartErrorBarCapSettingsModel;
}

/**
 * Allows to configure the trendlines of the chart such as name, period, type, tooltip, marker, animation, color, legend shape, etc.
 */
export class Trendline extends ChildProperty<Trendline> {
    /**
     * Allows to set the name of trendline
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Allows to set the pattern of dashes and gaps to stroke.
     * @default '0'
     */
    @Property('0')
    public dashArray: string;

    /**
     * Allows to specify the visibility of trendline.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Allows to set the period, the price changes over which will be considered to predict moving average trend line
     * @default 2
     */
    @Property(2)
    public period: number;

    /**
     * Allows to set the type of the trendline
     * @default 'Linear'
     */
    @Property('Linear')
    public type: TrendlineTypes;

    /**
     * Allows to set the period, by which the trend has to backward forecast
     * @default 0
     */
    @Property(0)
    public backwardForecast: number;

    /**
     * Allows to set the period, by which the trend has to forward forecast
     * @default 0
     */
    @Property(0)
    public forwardForecast: number;

    /**
     * Allows to set the polynomial order of the polynomial trendline
     * @default 2
     */
    @Property(2)
    public polynomialOrder: number;

    /**
     * Allows options to customize the marker for trendlines
     * @deprecated
     */
    @Complex<PivotChartMarkerSettingsModel>({}, MarkerSettings)
    public marker: PivotChartMarkerSettingsModel;

    /**
     * Allows to set the visibility of the tooltip for trendlines
     * @default true
     */
    @Property(true)
    public enableTooltip: boolean;

    /**
     * Allows options to customize the animation for trendlines
     */
    @Complex<PivotChartAnimationModel>({}, Animation)
    public animation: PivotChartAnimationModel;

    /**
     * Allows to set the fill color of trendline
     * @default ''
     */
    @Property('')
    public fill: string;

    /**
     * Allows to set the width of the trendline
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the intercept of the trendline
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public intercept: number;

    /**
     * Allows to set the legend shape of the trendline
     * @default 'SeriesType'
     */
    @Property('SeriesType')
    public legendShape: LegendShape;
}

/**
 * Allows to configure the empty points with a variety of means such as fill color, border and mode in the chart.
 */
export class EmptyPointSettings extends ChildProperty<EmptyPointSettings> {

    /**
     * Allows you to customize the fill color of empty points.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows options to customize the border of empty points.
     * @default "{color: 'transparent', width: 0}"
     */
    @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows you To customize the mode of empty points.
     * @default Zero
     */
    @Property('Zero')
    public mode: EmptyPointMode | AccEmptyPointMode;
}

/**
 * Allows to customize the rounded corners of the column series in the chart.
 */
export class CornerRadius extends ChildProperty<CornerRadius> {
    /**
     * Allows to set the top left corner radius value
     * @default 0
     */
    @Property(0)
    public topLeft: number;
    /**
     * Allows to set the top right corner radius value
     * @default 0
     */
    @Property(0)
    public topRight: number;
    /**
     * Allows to set the bottom left corner radius value
     * @default 0
     */
    @Property(0)
    public bottomLeft: number;
    /**
     * Allows to set the bottom right corner radius value
     * @default 0
     */
    @Property(0)
    public bottomRight: number;
}

/**
 * Allows to configure the crosshair tooltip with text style and fill color in the chart.
 */
export class CrosshairTooltip extends ChildProperty<CrosshairTooltip> {

    /**
     * Allows to set the visibility of the crosshair tooltip.
     *  @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Allows to set the fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows options to customize the crosshair ToolTip text.
     */
    @Complex<PivotChartFontModel>(Theme.crosshairLabelFont, Font)
    public textStyle: PivotChartFontModel;

}

/**
 * Allows to congifure the strip line properties such as line position, size, color, size type, border, text and opacity in the chart.
 */
export class StripLineSettings extends ChildProperty<StripLineSettings> {

    /**
     * Allows to set the visibility of the strip line for axis to be rendered.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     *  Allows the strip line to be rendered from axis origin.
     *  @default false
     */
    @Property(false)
    public startFromAxis: boolean;

    /**
     * Allows to set the start value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number | Date;

    /**
     * Allows to set the end value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number | Date;

    /**
     * Allows to set the size of the strip line, when it starts from the origin.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public size: number;

    /**
     * Allows to set the color of the strip line.
     * @default '#808080'
     */
    @Property('#808080')
    public color: string;

    /**
     * Allows to set the dash array of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public dashArray: string;

    /**
     * Allows to set the size type of the strip line
     * @default Auto
     */
    @Property('Auto')
    public sizeType: SizeType;

    /**
     * Allows to set repeated value of the strip line.
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isRepeat: boolean;

    /**
     * Allows to set the repeatEvery value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatEvery: number | Date;

    /**
     * Allows to set the repeatUntil value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatUntil: number | Date;

    /**
     * Allows to set the isSegmented value of the strip line
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isSegmented: boolean;

    /**
     * Allows to set the segmentStart value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentStart: number | Date;

    /**
     * Allows to set the segmentEnd value of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentEnd: number | Date;

    /**
     * Allows to set the segmentAxisName of the strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentAxisName: string;

    /**
     * Allows to customize the border of the strip line with different settings such as text, rotation, line alignment, text style and opacity in the chart.
     */
    @Complex<PivotChartBorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the strip line text.
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Allows to set the angle to which the strip line text gets rotated.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public rotation: number;

    /**
     * Allows to set the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    @Property('Middle')
    public horizontalAlignment: Anchor;

    /**
     * Allows to set the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    @Property('Middle')
    public verticalAlignment: Anchor;

    /**
     * Allows options to customize the strip line text.
     */
    @Complex<PivotChartFontModel>(Theme.stripLineLabelFont, Font)
    public textStyle: PivotChartFontModel;

    /**
     * Allows to set the order of the strip line. They are,
     * * Behind: Places the strip line behind the series elements.
     * * Over: Places the strip line over the series elements.
     * @default 'Behind'
     */
    @Property('Behind')
    public zIndex: ZIndex;

    /**
     * Allows to set the opacity of the strip line
     * @default 1
     */
    @Property(1)
    public opacity: number;
}

/**
 * Allows to customize the label border with a variety of means such as label color, width and labe type in the chart.
 */
export class LabelBorder extends ChildProperty<LabelBorder> {

    /**
     * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set the width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the border type for labels
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
 * Allows to configure the major grid lines such as line width, color and dashArray in the `axis`.
 */
export class MajorGridLines extends ChildProperty<MajorGridLines> {

    /**
     * Allows to set the width of the line in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the dash array of the grid lines.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the minor grid lines such as line width, dashArray and color in the `axis`.
 */
export class MinorGridLines extends ChildProperty<MinorGridLines> {

    /**
     * Allows to set the width of the line in pixels.
     * @default 0.7
     */
    @Property(0.7)
    public width: number;

    /**
     * Allows to set the dash array of grid lines.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the axis line such as line width, dashArray and color in a chart.
 */
export class AxisLine extends ChildProperty<AxisLine> {

    /**
     * Allows to set the width of the line in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the dash array of the axis line.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the axis line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the major tick lines such as width, height and color in the chart.
 */
export class MajorTickLines extends ChildProperty<MajorTickLines> {

    /**
     * Allows to set the width of the tick lines in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the height of the ticks in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows to set the color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the minor tick lines such as width, height and color in the chart.
 */
export class MinorTickLines extends ChildProperty<MinorTickLines> {

    /**
     * Allows to set the width of the tick line in pixels.
     * @default 0.7
     */
    @Property(0.7)
    public width: number;

    /**
     * Allows to set the height of the ticks in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows to set the color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}

/**
 * Allows to configure the position of the legend such as top and left in the chart.
 */
export class ChartLocation extends ChildProperty<ChartLocation> {

    /**
     * Allows to set the x(left) value of the legend position
     * @default 0
     */
    @Property(0)
    public x: number;

    /**
     * Allows to set the y(top) value of the legend position
     * @default 0
     */
    @Property(0)
    public y: number;

}

/**
 * Allow options to customize the border of the chart series such as color and border size in the pivot chart.
 * For example, to display the chart series border color as red, set the properties `color` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
 */
export class PivotChartSeriesBorder {
    /**
     * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set the width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;
}
/**
 * Allows to configure the animation behavior for chart series such as animation duration and delay.
 */
export class PivotChartSeriesAnimation {
    /**
     * Allows to set the visibility of the series to be animated on initial loading.
     * @default true
     */
    @Property(true)
    public enable: boolean;

    /**
     * Allows to set the duration of animation in milliseconds.
     * @default 1000
     */
    @Property(1000)
    public duration: number;

    /**
     * Allows to set the option to delay animation of the series.
     * @default 0
     */
    @Property(0)
    public delay: number;
}
/**
 * Allows to customize specific region for line type series with a variety of means such as value, color, pattern of dashes.
 */
export class PivotChartSeriesSegment {
    /**
     * Allows to set the starting point of region.
     * @default null
     */
    @Property(null)
    public value: Object;   /* eslint-disable-line */

    /**
     * Allows to set the color of a region.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Allows to set the pattern of dashes and gaps to stroke.
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
 *  Allows to configure the marker of the series such as shape, width, height, border, position, fill color, opacity, data label etc in the chart
 */
export class PivotChartSeriesMarkerSettings {
    /**
     * If set to true the marker for series is rendered. This is applicable only for line and area type series.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Allows to set the different shape of a marker:
     * * circle - Renders the marker shaper as circle.
     * * rectangle - Renders the marker shaper as rectangle.
     * * triangle - Renders the marker shaper as triangle.
     * * diamond - Renders the marker shaper as diamond.
     * * cross - Renders the marker shaper as cross.
     * * horizontalLine - Renders the marker shaper as horizontalLine.
     * * verticalLine - Renders the marker shaper as verticalLine.
     * * pentagon- Renders the marker shaper as pentagon.
     * * invertedTriangle - Renders the marker shaper as invertedTriangle.
     * * image - Renders the marker shaper as image.
     * @default 'Circle'
     */
    @Property('Circle')
    public shape: ChartShape;


    /**
     * Allows to set the URL for the Image that is to be displayed as a marker.  It requires marker `shape` value to be an `Image`.
     * @default ''
     */
    @Property('')
    public imageUrl: string;

    /**
     * Allows to set the height of the marker in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows to set the width of the marker in pixels.
     * @default 5
     */
    @Property(5)
    public width: number;

    /**
     * Allows options for customizing the border of a marker.
     */
    @Complex<PivotChartBorderModel>({ width: 2, color: null }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the fill color of the marker that accepts value in hex and rgba as a valid CSS color string.
     * By default, it will take series' color.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows to set the opacity of the marker.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to set the data label for the series.
     */
    @Complex<PivotChartDataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabel: PivotChartDataLabelSettingsModel;
}
/**
 * Allows options for customize the error bar chart series with diffent settings such as type, direction, mode, color, width, etc.
 */
export class PivotChartSeriesErrorSettings {
    /**
     * If set true, error bar for data gets rendered.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Allows to set the type of the error bar . They are
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
     * Allows to set the direction of the error bar . They are
     * * both -  Renders both direction of error bar.
     * * minus - Renders minus direction of error bar.
     * * plus - Renders plus direction error bar.
     * @default 'Both'
     */
    @Property('Both')
    public direction: ErrorBarDirection;

    /**
     * Allows to set the mode of the error bar . They are
     * * Vertical -  Renders a vertical error bar.
     * * Horizontal - Renders a horizontal error bar.
     * * Both - Renders both side error bar.
     * @default 'Vertical'
     */
    @Property('Vertical')
    public mode: ErrorBarMode;

    /**
     *  Allows to set the color for stroke of the error bar, which accepts value in hex, rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Allows to set the vertical error of the error bar.
     * @default 1
     */
    @Property(1)
    public verticalError: number;

    /**
     * Allows to set the stroke width of the error bar..
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the horizontal error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalError: number;

    /**
     * Allows to set the vertical positive error of the error bar.
     * @default 3
     */
    @Property(3)
    public verticalPositiveError: number;

    /**
     * Allows to set the vertical negative error of the error bar.
     * @default 3
     */
    @Property(3)
    public verticalNegativeError: number;

    /**
     * Allows to set the horizontal positive error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalPositiveError: number;

    /**
     * Allows to set the horizontal negative error of the error bar.
     * @default 1
     */
    @Property(1)
    public horizontalNegativeError: number;

    /**
     * Allows options for customizing the cap of the error bar.
     */
    @Complex<PivotChartErrorBarCapSettingsModel>(null, ErrorBarCapSettings)
    public errorBarCap: PivotChartErrorBarCapSettingsModel;
}
/**
 * Allows to configure the trendlines of the chart series such as name, period, type, tooltip, marker, animation, color, legend shape, etc.
 */
export class PivotChartSeriesTrendline {
    /**
     * Allows to set the name of trendline
     * @default ''
     */
    @Property('')
    public name: string;

    /**
     * Allows to set the type of the trendline
     * @default 'Linear'
     */
    @Property('Linear')
    public type: TrendlineTypes;

    /**
     * Allows to set the period, the price changes over which will be considered to predict moving average trend line
     * @default 2
     */
    @Property(2)
    public period: number;

    /**
     * Allows to set the polynomial order of the polynomial trendline
     * @default 2
     */
    @Property(2)
    public polynomialOrder: number;

    /**
     * Allows to set the period, by which the trend has to backward forecast
     * @default 0
     */
    @Property(0)
    public backwardForecast: number;

    /**
     * Allows to set the period, by which the trend has to forward forecast
     * @default 0
     */
    @Property(0)
    public forwardForecast: number;

    /**
     * Allows options to customize the animation for trendlines
     */
    @Complex<PivotChartAnimationModel>({}, Animation)
    public animation: PivotChartAnimationModel;

    /**
     * Allows options to customize the marker for trendlines
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
     * Allows to set the intercept of the trendline
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public intercept: number;

    /**
     * Allows to set the fill color of trendline
     * @default ''
     */
    @Property('')
    public fill: string;

    /**
     * Allows to set the width of the trendline
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the legend shape of the trendline
     * @default 'SeriesType'
     */
    @Property('SeriesType')
    public legendShape: LegendShape;
}
/**
 * Allows to configure the empty points with a variety of means such as fill color, border and mode in the chart.
 */
export class PivotChartSeriesEmptyPointSettings {
    /**
     * Allows to customize the fill color of empty points.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows options to customize the border of empty points.
     * @default "{color: 'transparent', width: 0}"
     */
    @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: PivotChartBorderModel;

    /**
     * To customize the mode of empty points.
     * @default Zero
     */
    @Property('Zero')
    public mode: EmptyPointMode | AccEmptyPointMode;
}
/**
 * Allows to customize the rounded corners of the column series in the chart.
 */
export class PivotChartSeriesCornerRadius {
    /**
     * Allows to set the top left corner radius value
     * @default 0
     */
    @Property(0)
    public topLeft: number;

    /**
     * Allows to set the top right corner radius value
     * @default 0
     */
    @Property(0)
    public topRight: number;

    /**
     * Allows to set the bottom left corner radius value
     * @default 0
     */
    @Property(0)
    public bottomLeft: number;

    /**
     * Allows to set the bottom right corner radius value
     * @default 0
     */
    @Property(0)
    public bottomRight: number;
}

/**
 * Allows to customize the apprearance of the text in the chart such as font style, font size, font weight, font color, font family, text alignment, opacity, text overflow.
 */
export class PivotChartAxisFont {
    /**
     * Allows to set the font style for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Allows to set the font size for the text.
     * @default '16px'
     */
    @Property('16px')
    public size: string;

    /**
     * Allows to set the font weight for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * Allows to set the color for the text.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set the text alignment
     * @default 'Center'
     */
    @Property('Center')
    public textAlignment: Alignment;

    /**
     * Allows to set the font family for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Allows to set the opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to set the chart title text overflow
     * @default 'Trim'
     */
    @Property('Trim')
    public textOverflow: TextOverflow;
}
/**
 * Allows to configure the crosshair tooltip with text style and fill color in the chart.
 */
export class PivotChartAxisCrosshairTooltip {
    /**
     * If set to true, crosshair ToolTip will be visible.
     *  @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Allows to set the fill color of the ToolTip accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows options to customize the crosshair ToolTip text.
     */
    @Complex<PivotChartFontModel>(Theme.crosshairLabelFont, Font)
    public textStyle: PivotChartFontModel;
}
/**
 * Allows to configure the major tick lines such as width, height and color in the chart.
 */
export class PivotChartAxisMajorTickLines {
    /**
     * Allows to set the width of the tick lines in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the height of the ticks in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows to set the color of the major tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the major grid lines such as line width, color and dashArray in the `axis`.
 */
export class PivotChartAxisMajorGridLines {
    /**
     * Allows to set the width of the line in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the dash array of the grid lines.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the major grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the minor tick lines such as width, height and color in the chart.
 */
export class PivotChartAxisMinorTickLines {
    /**
     * Allows to set the width of the tick line in pixels.
     * @default 0.7
     */
    @Property(0.7)
    public width: number;

    /**
     * Allows to set the height of the ticks in pixels.
     * @default 5
     */
    @Property(5)
    public height: number;

    /**
     * Allows to set the color of the minor tick line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the minor grid lines such as line width, dashArray and color in the `axis`.
 */
export class PivotChartAxisMinorGridLines {
    /**
     * Allows to set the width of the line in pixels.
     * @default 0.7
     */
    @Property(0.7)
    public width: number;

    /**
     * Allows to set the dash array of grid lines.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the minor grid line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to configure the axis line such as line width, dashArray and color in a chart.
 */
export class PivotChartAxisAxisLine {
    /**
     * Allows to set the width of the line in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the dash array of the axis line.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows to set the color of the axis line that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public color: string;
}
/**
 * Allows to congifure the strip line properties such as line position, size, color, size type, border, text and opacity in the chart.
 */
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
     * Allows to set the start value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public start: number | Date;

    /**
     * Allows to set the end value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public end: number | Date;

    /**
     * Allows to set the size of the pivot chart strip line, when it starts from the origin.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public size: number;

    /**
     * Allows to set the color of the pivot chart strip line.
     * @default '#808080'
     */
    @Property('#808080')
    public color: string;

    /**
     * Allows to set the dash Array of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public dashArray: string;

    /**
     * Allows to set the size type of the pivot chart strip line
     * @default Auto
     */
    @Property('Auto')
    public sizeType: SizeType;

    /**
     * Allows to set the isRepeat value of the pivot chart strip line.
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isRepeat: boolean;

    /**
     * Allows to set the repeatEvery value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatEvery: number | Date;

    /**
     * Allows to set the repeatUntil value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public repeatUntil: number | Date;

    /**
     * Allows to set the isSegmented value of the pivot chart strip line
     * @default false
     * @aspDefaultValueIgnore
     */
    @Property(false)
    public isSegmented: boolean;

    /**
     * Allows to set the segmentStart value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentStart: number | Date;

    /**
     * Allows to set the segmentEnd value of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentEnd: number | Date;

    /**
     * Allows to set the segmentAxisName of the pivot chart strip line.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public segmentAxisName: string;

    /**
     * Allows to set the border of the pivot chart strip line.
     */
    @Complex<PivotChartBorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the strip line text.
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Allows to set the angle to which the strip line text gets rotated.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public rotation: number;

    /**
     * Allows to set the position of the strip line text horizontally. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    @Property('Middle')
    public horizontalAlignment: Anchor;

    /**
     * Allows to set the position of the strip line text vertically. They are,
     * * Start: Places the strip line text at the start.
     * * Middle: Places the strip line text in the middle.
     * * End: Places the strip line text at the end.
     * @default 'Middle'
     */
    @Property('Middle')
    public verticalAlignment: Anchor;

    /**
     * Allows options to customize the strip line text.
     */
    @Complex<PivotChartFontModel>(Theme.stripLineLabelFont, Font)
    public textStyle: PivotChartFontModel;

    /**
     * Allows to set the order of the strip line. They are,
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
 * Allows to customize the label border with a variety of means such as label color, width and labe type in the chart.
 */
export class PivotChartAxisLabelBorder {
    /**
     * Allows to set the color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default ''
     */
    @Property('')
    public color: string;

    /**
     * Allows to set the width of the border in pixels.
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Allows to set the border type for labels
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
 * Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart.
 * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
 */
export class PivotChartSettingsChartArea {
    /**
     * Allows options to customize the border of the chart area.
     */
    @Complex<PivotChartBorderModel>({}, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the background of the chart area that accepts value in hex and rgba as a valid CSS color string..
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Allows to set the opacity for background.
     * @default 1
     */
    @Property(1)
    public opacity: number;
}
/**
 * Allow options to customize the crosshair line with different settings such as color and width of the line,
 * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
 */
export class PivotChartSettingsCrosshairSettings {
    /**
     * If set to true, crosshair line becomes visible.
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Allows to set the DashArray for crosshair.
     * @default ''
     */
    @Property('')
    public dashArray: string;

    /**
     * Allows options to customize the crosshair line.
     */
    @Complex<PivotChartBorderModel>({ color: null, width: 1 }, Border)
    public line: PivotChartBorderModel;

    /**
     * Allows to set the line type. Horizontal mode enables the horizontal line and Vertical mode enables the vertical line. They are,
     * * None: Hides both vertical and horizontal crosshair lines.
     * * Both: Shows both vertical and horizontal crosshair lines.
     * * Vertical: Shows the vertical line.
     * * Horizontal: Shows the horizontal line.
     * @default Both
     */
    @Property('Both')
    public lineType: LineType;
}
/**
 * Allow options for customizing legends with different properties such as legend visibility,
 * height, width, position, legend padding, alignment, textStyle, border, margin, background, opacity, description, tabIndex in the pivot chart.
 */
export class PivotChartSettingsLegendSettings {
    /**
     * If set to true, legend will be visible.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Allows to set the height of the legend in pixels.
     * @default null
     */
    @Property(null)
    public height: string;

    /**
     * Allows to set the width of the legend in pixels.
     * @default null
     */
    @Property(null)
    public width: string;

    /**
     * Allows to set the location of the legend, relative to the chart.
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
    @Complex<PivotChartLocationModel>({ x: 0, y: 0 }, ChartLocation)
    public location: PivotChartLocationModel;

    /**
     * Allows to set the position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     * * Custom: Displays the legend  based on the given x and y values.
     * @default 'Auto'
     */
    @Property('Auto')
    public position: LegendPosition;

    /**
     * Allows option to customize the padding between legend items.
     * @default 8
     */
    @Property(8)
    public padding: number;

    /**
     * Allows to set the legend in chart can be aligned as follows:
     * * Near: Aligns the legend to the left of the chart.
     * * Center: Aligns the legend to the center of the chart.
     * * Far: Aligns the legend to the right of the chart.
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Allows options to customize the legend text.
     */
    @Complex<PivotChartFontModel>(Theme.legendLabelFont, Font)
    public textStyle: PivotChartFontModel;

    /**
     * Allows to set the shape height of the legend in pixels.
     * @default 10
     */
    @Property(10)
    public shapeHeight: number;

    /**
     * Allows to set the shape width of the legend in pixels.
     * @default 10
     */
    @Property(10)
    public shapeWidth: number;

    /**
     * Allows options to customize the border of the legend.
     */
    @Complex<PivotChartBorderModel>({}, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows options to customize left, right, top and bottom margins of the chart.
     */
    @Complex<PivotChartMarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
    public margin: PivotChartMarginModel;

    /**
     * Allows to set the padding between the legend shape and text.
     * @default 5
     */
    @Property(5)
    public shapePadding: number;

    /**
     * Allows to set the background color of the legend that accepts value in hex and rgba as a valid CSS color string.
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Allows to set the opacity of the legend.
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
     * Allows to set the description for legends.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Allows to set the tabindex value for the legend.
     * @default 3
     */
    @Property(3)
    public tabIndex: number;
}
/**
 * Allows you to highlight a specific point of the series while rendering the pivot chart.
 * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
 */
export class PivotChartSettingsIndexes {
    /**
     * Allows to set the series index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public series: number;

    /**
     * Allows to set the point index
     * @default 0
     * @aspType int
     */
    @Property(0)
    public point: number;
}
/**
 * Allow options to customize the left, right, top and bottom margins of the pivot chart.
 */
export class PivotChartSettingsMargin {
    /**
     * Allows to set the left margin in pixels.
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Allows to set the right margin in pixels.
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Allows to set the top margin in pixels.
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Allows to set the bottom margin in pixels.
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Allow options to customize the chart series with different settings such as fill color, animation of the series,
 * series width, border, visibility of the series, opacity, chart series types, marker, tooltip, trendlines, etc., in the pivot chart.
 * For example, to display the line type pivot chart, set the property `type` to **Line**.
 */
export class PivotSeries extends ChildProperty<PivotSeries> {

    /**
     * Allows to set the fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Allows to set the end angle for the pie and doughnut chart series.
     * @default null
     */
    @Property(null)
    public endAngle: number;

    /**
     * Allows to enable or disable series point explode on mouse click or touch for pie, funnel, doughnut and pyramid chart.
     * @default false
     */
    @Property(false)
    public explode: boolean;

    /**
     * Allows to enable or disable all series point explode on mouse click or touch for  pie, funnel, doughnut and pyramid chart.
     * @default false
     */
    @Property(false)
    public explodeAll: boolean;

    /**
     * Allows to set Index of the point to be exploded on load for pie, funnel, doughnut and pyramid chart.
     * @default null
     */
    @Property(null)
    public explodeIndex: number;

    /**
     * Allows to set inner radius for pie and doughnut series chart.
     * @default null
     */
    @Property(null)
    public innerRadius: string;

    /**
     * Allows to set distance of the point from the center, which takes values in both pixels and
     * percentage for pie, funnel, doughnut and pyramid chart.
     * @default "30%"
     */
    @Property('30%')
    public explodeOffset: string;

    /**
     * Allows to set the distance between the segments of a funnel/pyramid series. The range will be from 0 to 1.
     * @default 0
     */
    @Property(0)
    public gapRatio: number;

    /**
     * Allows to define the mode of grouping for pie, funnel, doughnut and pyramid chart series.
     * @default "Value"
     */
    @Property('Value')
    public groupMode: GroupModes;

    /**
     * Allows to combine the y values into slice named other for  pie, funnel, doughnut and pyramid chart Series.
     * @default null
     */
    @Property(null)
    public groupTo: string;

    /**
     * Allows to defines the height of the funnel chart neck with respect to the chart area.
     * @default "20%"
     */
    @Property('20%')
    public neckHeight: string;

    /**
     * Allows to defines the width of the funnel chart neck with respect to the chart area.
     * @default "20%"
     */
    @Property('20%')
    public neckWidth: string;

    /**
     * Defines how the values have to be reflected, whether through height/surface of the segments in pyramid series.
     * @default 'Linear'
     */
    @Property('Linear')
    public pyramidMode: PyramidModes;

    /**
     * Allows you to draw the chart series points with custom color for the pie, funnel, doughnut and pyramid chart types.
     * @default []
     */
    @Property([])
    public palettes: string[];

    /**
     * Allows to defines start angle for the pie, funnel, doughnut and pyramid chart series.
     * @default 0
     */
    @Property(0)
    public startAngle: number;

    /**
     * Allows options to customizing animation for the series.
     * @default null
     */
    @Complex<PivotChartAnimationModel>(null, Animation)
    public animation: PivotChartAnimationModel;

    /**
     * Allows options to customize data label for the pie, funnel, pyramid, doughnut chart series.
     * @default null
     */
    @Complex<PivotChartDataLabelModel>(null, PivotChartDataLabel)
    public dataLabel: PivotChartDataLabelModel;

    /**
     * Allows to set the pattern of dashes and gaps to stroke the lines in `Line` type series.
     * @default '0'
     */
    @Property('0')
    public dashArray: string;

    /**
     * Allows to set the stroke width for the series that is applicable only for `Line` type series.
     * @default 1
     */
    @Property(1)
    public width: number;


    /**
     * Allows to set the axis, based on which the line series will be split.
     */
    @Property('X')
    public segmentAxis: Segment;

    /**
     * Allows to set the type of series to be drawn in radar or polar series. They are
     *  'Line'
     *  'Column'
     *  'Area'
     *  'Scatter'
     *  'Spline'
     *  'StackingColumn'
     *  'StackingArea'
     *  'RangeColumn'
     *  'SplineArea'
     * @default 'Line'
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
     * Allows to set the collection of regions that helps to differentiate a line series.
     */
    @Collection<PivotChartSegmentModel>([], ChartSegment)
    public segments: PivotChartSegmentModel[];

    /**
     * This allows grouping the chart series in `stacked column / bar` charts.
     * Any string value can be provided to the stackingGroup property.
     * If any two or above series have the same value, those series will be grouped together.
     * @default ''
     */
    @Property('')
    public stackingGroup: string;

    /**
     * Allows options to customizing the border of the series. This is applicable only for `Column` and `Bar` type series.
     */
    @Complex<PivotChartBorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: PivotChartBorderModel;

    /**
     * Allows to set the visibility of series.
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Allows to set the opacity of the series.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Allows to set the type of the series are
     * * StackingColumn
     * * StackingArea
     * * StackingBar
     * * StackingLine
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
     * * StackingLine100
     * * Polar
     * * Radar
     * @default 'Line'
     */
    @Property('Line')
    public type: ChartSeriesType;

    /**
     * Allows options for displaying and customizing markers for individual points in a series.
     */
    @Complex<PivotChartMarkerSettingsModel>(null, MarkerSettings)
    public marker: PivotChartMarkerSettingsModel;

    /**
     * Allows options for displaying and customizing error bar for individual point in a series.
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
     * Allows to set the collection of trendlines that are used to predict the trend
     */
    @Collection<PivotChartTrendlineModel>([], Trendline)
    public trendlines: PivotChartTrendlineModel[];

    /**
     * Allows to set the provided value will be considered as a Tooltip name
     * @default ''
     */
    @Property('')
    public tooltipMappingName: string;

    /**
     * Allows to set the shape of the legend. Each series has its own legend shape. They are,
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
     * @default 'SeriesType'
     */
    @Property('SeriesType')
    public legendShape: LegendShape;

    /**
     * Allows to set the minimum radius.
     * @default 1
     */
    @Property(1)
    public minRadius: number;

    /**
     * Allows to set the custom style for the selected series or points.
     * @default null
     */
    @Property(null)
    public selectionStyle: string;

    /**
     * Allows to set the type of spline to be rendered.
     * @default 'Natural'
     */
    @Property('Natural')
    public splineType: SplineType;

    /**
     * Allows to set the maximum radius.
     * @default 3
     */
    @Property(3)
    public maxRadius: number;

    /**
     * Allows to set the tension of cardinal spline types
     * @default 0.5
     */
    @Property(0.5)
    public cardinalSplineTension: number;

    /**
     * Allows to render the column series points with particular column width.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public columnWidth: number;

    /**
     * Allows options to customize the empty points in series
     */
    @Complex<PivotChartEmptyPointSettingsModel>(null, EmptyPointSettings)
    public emptyPointSettings: PivotChartEmptyPointSettingsModel;

    /**
     * Allows to render the column series points with particular rounded corner.
     */
    @Complex<PivotChartCornerRadiusModel>(null, CornerRadius)
    public cornerRadius: PivotChartCornerRadiusModel;

    /**
     * Allows to render the column series points with particular column spacing. It takes value from 0 - 1.
     * @default 0
     */
    @Property(0)
    public columnSpacing: number;
}

/**
 * Allow options to customize the axis with different properties such as labelIntersectAction, labelStyle, title,
 * description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and
 * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
 */
export class PivotAxis extends ChildProperty<PivotAxis> {

    /**
     * Allows to set the actions like `Hide`, `Rotate45`, and `Rotate90` when the axis labels intersect with each other.They are,
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Rotate90: Rotates the label to 90 degree when it intersects.
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.
     * @default Rotate45
     */
    @Property('Rotate45')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * Allows options to customize the axis label.
     */
    @Complex<PivotChartFontModel>(Theme.axisLabelFont, Font)
    public labelStyle: PivotChartFontModel;

    /**
     * Allows to set the title of an axis.
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Allows to scale the axis by this value. When zoomFactor is 0.5, the chart is scaled by 200% along this axis. Value ranges from 0 to 1.
     * @default null
     */
    @Property(null)
    public zoomFactor: number;

    /**
     * Allows options to customize the crosshair ToolTip.
     */
    @Complex<PivotChartCrosshairTooltipModel>({}, CrosshairTooltip)
    public crosshairTooltip: PivotChartCrosshairTooltipModel;

    /**
     * It used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */
    @Property('')
    public labelFormat: string;

    /**
     * Allows options for customizing the axis title.
     */
    @Complex<PivotChartFontModel>(Theme.axisTitleFont, Font)
    public titleStyle: PivotChartFontModel;

    /**
     * Allows to specify the indexed category to the axis.
     * @default false
     */
    @Property(false)
    public isIndexed: boolean;

    /**
     * Allows to set the left and right padding for the plot area in pixels.
     * @default 0
     */
    @Property(0)
    public plotOffset: number;

    /**
     * Allows to set the position of labels at the edge of the axis.They are,
     * * Shift: Shifts the edge labels.
     * * None: No action will be performed.
     * * Hide: Edge label will be hidden.
     * @default 'Shift'
     */
    @Property('Shift')
    public edgeLabelPlacement: EdgeLabelPlacement;

    /**
     * Allows to set the placement of a label for category axis. They are,
     * * onTicks: Renders the label on the ticks.
     * * betweenTicks: Renders the label between the ticks.
     * @default 'BetweenTicks'
     */
    @Property('BetweenTicks')
    public labelPlacement: LabelPlacement;

    /**
     * Allows to set the placement of a ticks to the axis line. They are,
     * * outside: Renders the ticks outside to the axis line.
     * * inside: Renders the ticks inside to the axis line.
     * @default 'Outside'
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
     * Allows to set the placement of a labels to the axis line. They are,
     * * outside: Renders the labels outside to the axis line.
     * * inside: Renders the labels inside to the axis line.
     * @default 'Outside'
     */
    @Property('Outside')
    public labelPosition: AxisPosition;

    /**
     * Allows to set the angle to which the axis label gets rotated.
     * @default 0
     */
    @Property(0)
    public labelRotation: number;

    /**
     * Allows to set the number of minor ticks per interval.
     * @default 0
     */
    @Property(0)
    public minorTicksPerInterval: number;

    /**
     * Allows to set the maximum range of an axis.
     * @default null
     */
    @Property(null)
    public maximum: Object; /* eslint-disable-line */

    /**
     * Allows to set the minimum range of an axis.
     * @default null
     */
    @Property(null)
    public minimum: Object; /* eslint-disable-line */

    /**
     * Allows to set the maximum width of an axis label.
     * @default 34.
     */
    @Property(34)
    public maximumLabelWidth: number;

    /**
     * Allows to set the interval for an axis.
     * @default null
     * @aspDefaultValueIgnore
     */
    @Property(null)
    public interval: number;

    /**
     * Allows options for customizing major tick lines.
     */
    @Complex<PivotChartMajorTickLinesModel>({}, MajorTickLines)
    public majorTickLines: PivotChartMajorTickLinesModel;

    /**
     * Allows to set the Trim property for an axis.
     * @default false
     */
    @Property(false)
    public enableTrim: boolean;

    /**
     * Allows options for customizing major grid lines.
     */
    @Complex<PivotChartMajorGridLinesModel>({}, MajorGridLines)
    public majorGridLines: PivotChartMajorGridLinesModel;

    /**
     * Allows options for customizing minor tick lines.
     */
    @Complex<PivotChartMinorTickLinesModel>({}, MinorTickLines)
    public minorTickLines: PivotChartMinorTickLinesModel;

    /**
     * Allows options for customizing axis lines.
     */
    @Complex<PivotChartAxisLineModel>({}, AxisLine)
    public lineStyle: PivotChartAxisLineModel;

    /**
     * Allows options for customizing minor grid lines.
     */
    @Complex<PivotChartMinorGridLinesModel>({}, MinorGridLines)
    public minorGridLines: PivotChartMinorGridLinesModel;

    /**
     * Allows to specify whether the axis to be rendered in inversed manner or not.
     * @default false
     */
    @Property(false)
    public isInversed: boolean;

    /**
     * Allows to set the description for axis and its element.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * Allows to set the start angle for the series.
     * @default 0
     */
    @Property(0)
    public startAngle: number;

    /**
     * Allows to set the polar radar radius position.
     * @default 100
     */
    @Property(100)
    public coefficient: number;

    /**
     * Allows to set the stripLine collection for the axis
     */
    @Collection<StripLineSettings>([], StripLineSettings)
    public stripLines: PivotChartStripLineSettingsModel[];

    /**
     * Allows to set the tabindex value for the axis.
     * @default 2
     */
    @Property(2)
    public tabIndex: number;

    /**
     * Allows to set the border of the multi level labels.
     */
    @Complex<PivotChartLabelBorderModel>({ color: null, width: 0, type: 'Rectangle' }, LabelBorder)
    public border: PivotChartLabelBorderModel;
}



/**
 * Allow options to customize the tooltip of the pivot chart with different properties such as visibility of the tooltip, enableMarker, fill color, opacity, header for tooltip,
 * format, textStyle, template, border, enableAnimation.
 */
export class PivotTooltipSettings extends ChildProperty<PivotTooltipSettings> {


    /**
     * Allows to set the visibility of the marker.
     * @default false.
     */
    @Property(false)
    public enableMarker: boolean;

    /**
     * Allows to set the visibility of the tooltip.
     * @default true.
     */
    @Property(true)
    public enable: boolean;

    /**
     * Allows to set the fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
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
     * Allows to set the fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.
     * @default 0.75
     */
    @Property(0.75)
    public opacity: number;

    /**
     * Allows to set the header for tooltip.
     * @default null
     */
    @Property(null)
    public header: string;

    /**
     * Allows to set the format the ToolTip content.
     * @default null.
     */
    @Property(null)
    public format: string;

    /**
     * Allows options to customize the ToolTip text.
     */
    @Complex<PivotChartFontModel>(Theme.tooltipLabelFont, Font)
    public textStyle: PivotChartFontModel;

    /**
     * Allows to set the custom template to format the ToolTip content. Use ${x} and ${y} as the placeholder text to display the corresponding data point.
     * @default null.
     */
    @Property(null)
    public template: string;

    /**
     * Allows options to customize tooltip borders.
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
 * Allow options to customize the center of the pivot pie series chart.
 */
export class PivotPieChartCenter extends ChildProperty<PivotPieChartCenter> {

    /**
     * X value of the center.
     * @default "50%"
     */
    @Property('50%')
    public x: string;

    /**
     * Y value of the center.
     * @default "50%"
     */
    @Property('50%')
    public y: string;
}

/**
 * Allow options to customize the pivot chart zooming with different properties such as enablePinchZooming, enableSelectionZooming,
 * enableDeferredZooming, enableMouseWheelZooming, zoom modes, toolbarItems, enableScrollbar and enablePan.
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
     * Allows to specify whether to allow zooming vertically or horizontally or in both ways. They are,
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
     * @default 'XY'
     */
    @Property('XY')
    public mode: ZoomMode;

    /**
     * Allows to set the toolkit options for the zooming as follows:
     * * ZoomIn
     * * ZoomOut
     * * Pan
     * * Zoom
     * * Reset
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
 * Allows a set of options to customize a pivot chart with a variety of settings, such as chart series, chart area, axis labels, legends, border, crosshairs, theme, title, tooltip, zooming, etc.
 * The following options are available to customize the pivot chart.
 * * `background`: Allows you to change the background color of the chart series in the pivot chart.
 * For example, to display the chart series with background color as red, set the property `background` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"**.
 * * `border`: Allow options to customize the border of the chart series such as color and border size in the pivot chart.
 * For example, to display the chart series border color as red, set the properties `color` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
 * * `chartArea`: Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart.
 * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
 * * `chartSeries`: Allow options to customize the chart series with different settings such as fill color, animation of the series,
 * series width, border, visibility of the series, opacity, chart series types, marker, tooltip, trendlines, etc., in the pivot chart.
 * For example, to display the line type pivot chart, set the property `type` to **Line**.
 * * `crosshair`: Allow options to customize the crosshair line with different settings such as color and width of the line,
 * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
 * * `description`: Allows you to add a description of the pivot chart.
 * * `enableAnimation`: Allows you to enable/disable the tooltip animation while performing the mouse move from one point to another in the pivot chart.
 * * `enableCanvas`: Allows you to render the pivot chart in canvas mode.
 * * `enableExport`: Allows the pivot chart to be exported to either **PDF** or **PNG** or **JPEG** or **SVG** filter formats.
 * * `enableMultipleAxis`: Allows you to draw the pivot chart with multiple value fields as separate chart area.
 * * `enableSideBySidePlacement`: Allows you to draw points of the column type pivot chart series as side by side.
 * * `isMultiSelect`: Allows you to perform multiple selection in the pivot chart. To enable this option, it requires the property `selectionMode` to be **Point** or **Series** or **Cluster**.
 * * `isTransposed`: Allows you to render the pivot chart in a transposed manner or not.
 * * `legendSettings`: Allow options for customizing legends with different properties such as legend visibility,
 * height, width, position, legend padding, alignment, textStyle, border, margin, background, opacity, description, tabIndex in the pivot chart.
 * * `margin`: Allow options to customize the left, right, top and bottom margins of the pivot chart.
 * * `palettes`: Allows you to draw the chart series points with custom color in the pivot chart.
 * * `primaryXAxis`: Allow options to customize the horzontal(row) axis with different properties such as labelIntersectAction, labelStyle, title,
 * description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and
 * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
 * * `primaryYAxis`: Allow options to customize the vertical(value) axis with different properties such as labelIntersectAction, labelStyle,
 * title, description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and
 * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
 * * `selectedDataIndexes`: Allows you to highlight a specific point of the series while rendering the pivot chart.
 * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
 * * `selectionMode`: Allow options for customizing the selection mode to be done either by a specific series or point or cluster or by dragging it to the pivot chart.
 * For example, to highlight a specific point in a specific series of the pivot chart, set the property `selectionMode` to **Point**.
 * * `showMultiLevelLabels`: Allows you to display the multi-level label feature in the pivot chart. This multi-level labels used to perform drill operation in the pivot chart.
 * * `subTitle`: Allows you to add the subtitle to the pivot chart.
 * * `subTitleStyle`: Allow options to customize the subtitle in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
 * * `tabIndex`: Allows you to highlight specific legends by clicking the mouse or by interacting with the keyboard in the pivot chart.
 * * `theme`: Allows you to draw a pivot chart with either material, fabric, bootstrap, highcontrast light, material dark, fabric dark, highcontrast, bootstrap dark, bootstrap4 theme.
 * * `title`: Allows you to add title to the pivot chart.
 * * `titleStyle`: Allow options to customize the title in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
 * * `tooltip`: Allow options to customize the tooltip of the pivot chart with different properties such as visibility of the tooltip, enableMarker, fill color, opacity, header for tooltip,
 * format, textStyle, template, border, enableAnimation.
 * * `useGroupingSeparator`: Allows the group separator to be shown to the values in the pivot chart.
 * * `value`: Allows you to draw a pivot chart with a specific value field during initial loading.
 * * `zoomSettings`: Allow options to customize the pivot chart zooming with different properties such as enablePinchZooming, enableSelectionZooming,
 * enableDeferredZooming, enableMouseWheelZooming, zoom modes, toolbarItems, enableScrollbar and enablePan.
 */
export class ChartSettings extends ChildProperty<ChartSettings> {

    /**
     * Allow options to customize the chart series with different settings such as fill color, animation of the series,
     * series width, border, visibility of the series, opacity, chart series types, marker, tooltip, trendlines, etc., in the pivot chart.
     * For example, to display the line type pivot chart, set the property `type` to **Line**.
     */
    @Complex<PivotSeriesModel>({}, PivotSeries)
    public chartSeries: PivotSeriesModel;

    /**
     * Allow options to customize the horzontal(row) axis with different properties such as labelIntersectAction, labelStyle, title,
     * description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and
     * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
     */
    @Complex<PivotAxisModel>({}, PivotAxis)
    public primaryXAxis: PivotAxisModel;

    /**
     * Allow options to customize the vertical(value) axis with different properties such as labelIntersectAction, labelStyle,
     * title, description, crosshairTooltip, labelFormat, titleStyle, plotOffset, edgeLabelPlacement, labelPlacement, tickPosition, opposedPosition, minor and
     * major grid lines, minor and major tick lines, border, etc. in the pivot chart.
     */
    @Complex<PivotAxisModel>({}, PivotAxis)
    public primaryYAxis: PivotAxisModel;

    /**
     * Allows you to draw a pivot chart with a specific value field during initial loading.
     * @default ''
     */
    @Property('')
    public value: string;

    /**
     * Allows to specify the column whose values will be considered to draw the pivot chart. The is applicable
     * for pie, doughnut, funnel and pyramid chart types.
     * @default ''
     */
    @Property('')
    public columnHeader: string;

    /**
     * Allows to specify the delimiter to split the column headers. The is applicable for pie, doughnut,
     * funnel and pyramid chart types.
     * @default '-'
     */
    @Property('-')
    public columnDelimiter: string;

    /**
     * It allows you to draw a pivot chart with multiple value fields as a single or stacked chart area.
     * Use the `multipleAxisMode` enum options, either **Stacked** or **Single**, to show the chart area as either stacked or single based on value fields.
     * > The `enableMultiAxis` property is deprecated and will no longer be used. Use `enableMultipleAxis` with  to achieve the same.
     * @default false
     * @deprecated
     */
    @Property(false)
    public enableMultiAxis: boolean;

    /**
     * It allows you to draw a pivot chart with multiple value fields as a single or stacked chart area.
     * Use the `multipleAxisMode` enum options, either **Stacked** or **Single**, to show the chart area as either stacked or single based on value fields.
     * @default false
     */
    @Property(false)
    public enableMultipleAxis: boolean;

    /**
     * Allows the chart series to be displayed, depending on the value fields specified, in either a stacked or single chart area.
     * The options available are:
     * * Stacked: Allows the chart series to be displayed in a separate chart area depending on the value fields specified.
     * * Single: Allows the chart series to be displayed in a single chart area for different value fields.
     * @default 'Stacked'
     */
    @Property('Stacked')
    public multipleAxisMode: MultipleAxisMode;

    /**
     * Enable or disable scroll bar while multiple axis.
     * @default false
     */
    @Property(false)
    public enableScrollOnMultiAxis: boolean;

    /**
    * Allows to display chart series in accordance with member name in all chart area.
    * > It is applicable only when `enableMultipleAxis` property is set to **true**.
    * @default false
    */
    @Property(false)
    public showMemberSeries: boolean;

    /**
     * Allow options to customize the title in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
     */
    @Complex<PivotChartFontModel>(Theme.chartTitleFont, Font)
    public titleStyle: PivotChartFontModel;

    /**
     * Allows you to add title to the pivot chart.
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Allow options to customize the subtitle in the pivot chart with different properties such as fontStyle, font size, fontWeight, font color, testAlignment, fontFamily, opacity, textOverflow.
     */
    @Complex<PivotChartFontModel>(Theme.chartSubTitleFont, Font)
    public subTitleStyle: PivotChartFontModel;

    /**
     * Allows you to add the subtitle to the pivot chart.
     * @default ''
     */
    @Property('')
    public subTitle: string;

    /**
     * Allow options to customize the border of the chart series such as color and border size in the pivot chart.
     * For example, to display the chart series border color as red, set the properties `color` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"** and `width` to **0.5**.
     */
    @Complex<PivotChartBorderModel>({ color: '#DDDDDD', width: 0 }, Border)
    public border: PivotChartBorderModel;

    /**
     *  Allow options to customize the left, right, top and bottom margins of the pivot chart.
     */
    @Complex<PivotChartMarginModel>({}, Margin)
    public margin: PivotChartMarginModel;

    /**
     * Allow options to customize the chart area with a variety of settings such as background color, border, opacity and background image in the pivot chart.
     * For example, to change the of the pivot chart's background, set the property `opacity` to **0.5**.
     */
    @Complex<PivotChartAreaModel>({ border: { color: null, width: 0.5 }, background: 'transparent' }, ChartArea)
    public chartArea: PivotChartAreaModel;

    /**
     * Allows you to change the background color of the chart series in the pivot chart.
     * For example, to display the chart series with background color as red, set the property `background` to either **"red"** or **"#FF0000"** or **"rgba(255,0,0,1.0)"**.
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Allows you to draw a pivot chart with either material, fabric, bootstrap, highcontrast light, material dark, fabric dark, highcontrast, bootstrap dark, bootstrap4 theme.
     * @default 'Material'
     */
    @Property('Material')
    public theme: ChartTheme;

    /**
     * Allows you to draw the chart series points with custom color in the pivot chart.
     * @default []
     */
    @Property([])
    public palettes: string[];


    /**
     * Allow options to customize the crosshair line with different settings such as color and width of the line,
     * line types that are shown horizontally and vertically to indicate the value of the axis at the mouse hover or touch position in the pivot chart.
     */
    @Complex<PivotChartCrosshairSettingsModel>({}, CrosshairSettings)
    public crosshair: PivotChartCrosshairSettingsModel;

    /**
     * Allow options to customize the tooltip of the pivot chart with different properties such as visibility of the tooltip, enableMarker, fill color, opacity, header for tooltip,
     * format, textStyle, template, border, enableAnimation.
     */
    @Complex<PivotTooltipSettingsModel>({}, PivotTooltipSettings)
    public tooltip: PivotTooltipSettingsModel;

    /**
     * Allow options to customize the center of pie series chart with properties x and y.
     */
    @Complex<PivotPieChartCenterModel>(null, PivotPieChartCenter)
    public pieCenter: PivotPieChartCenterModel;

    /**
     * Allow options to customize the pivot chart zooming with different properties such as enablePinchZooming, enableSelectionZooming,
     * enableDeferredZooming, enableMouseWheelZooming, zoom modes, toolbarItems, enableScrollbar and enablePan.
     */
    @Complex<PivotZoomSettingsModel>({}, PivotZoomSettings)
    public zoomSettings: PivotZoomSettingsModel;

    /**
     * Allow options for customizing legends with different properties such as legend visibility,
     * height, width, position, legend padding, alignment, textStyle, border, margin, background, opacity, description, tabIndex in the pivot chart.
     */
    @Property()
    public legendSettings: LegendSettingsModel;

    /**
     * Allow options for customizing the selection mode to be done either by a specific series or point or cluster or by dragging it to the pivot chart.
     * For example, to highlight a specific point in a specific series of the pivot chart, set the property `selectionMode` to **Point**. The available modes are,
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
     * Allow options for customizing the selection mode to be done either by a specific series or point or cluster
     * or by dragging it to the pivot chart. For example, to highlight a specific point in a specific series of the
     * pivot chart, set the property `accumulationSelectionMode` to **Point**. It is applicable for chart types pie,
     * funnel, doughnut and pyramid. The available modes are,
     * * none: Disables the selection.
     * * point: selects a point.
     * @default 'None'
     */
    @Property('None')
    public accumulationSelectionMode: AccumulationSelectionMode;

    /**
     * Allows to set the labels placed smartly without overlapping. It is applicable for chart types pie,
     * funnel, doughnut and pyramid.
     * @default true
     */
    @Property(true)
    public enableSmartLabels: boolean;

    /**
     * Allows to Enable or disable the border in pie and doughnut chart while mouse moving.
     * @default true
     */
    @Property(true)
    public enableBorderOnMouseMove: boolean;

    /**
     * Specifies whether point has to get highlighted or not. It is applicable for chart types pie,
     * funnel, doughnut and pyramid. Takes value either 'None 'or 'Point'.
     * @default None
     */
    @Property('None')
    public highlightMode: AccumulationSelectionMode;

    /**
     * Specifies whether series or data point for accumulation chart has to be selected. They are,
     * * none: sets none as selecting pattern to accumulation chart .
     * * chessboard: sets chess board as selecting pattern accumulation chart .
     * * dots: sets dots as  selecting pattern accumulation chart .
     * * diagonalForward: sets diagonal forward as selecting pattern to accumulation chart .
     * * crosshatch: sets crosshatch as selecting pattern to accumulation chart.
     * * pacman: sets pacman selecting pattern to accumulation chart.
     * * diagonalbackward: sets diagonal backward as selecting pattern to accumulation chart.
     * * grid: sets grid as selecting pattern to accumulation chart.
     * * turquoise: sets turquoise as selecting pattern to accumulation chart.
     * * star: sets star as selecting pattern to accumulation chart.
     * * triangle: sets triangle as selecting pattern to accumulation chart.
     * * circle: sets circle as selecting pattern to accumulation chart.
     * * tile: sets tile as selecting pattern to accumulation chart.
     * * horizontaldash: sets horizontal dash as selecting pattern to accumulation chart.
     * * verticaldash: sets vertical dash as selecting pattern to accumulation chart.
     * * rectangle: sets rectangle as selecting pattern.
     * * box: sets box as selecting pattern to accumulation chart.
     * * verticalstripe: sets vertical stripe as  selecting pattern to accumulation chart.
     * * horizontalstripe: sets horizontal stripe as selecting pattern to accumulation chart.
     * * bubble: sets bubble as selecting pattern to accumulation chart.
     * It is applicable for chart types pie, funnel, doughnut and pyramid.
     * @default None
     */
    @Property('None')
    public highlightPattern: SelectionPattern;

    /**
     * Allows the pivot chart to be exported to either **PDF** or **PNG** or **JPEG** or **SVG** filter formats.
     * @default true
     */
    @Property(true)
    public enableExport: boolean;

    /**
     * Allows you to perform multiple selection in the pivot chart. To enable this option, it requires the property `selectionMode` to be **Point** or **Series** or **Cluster**.
     * @default false
     */
    @Property(false)
    public isMultiSelect: boolean;

    /**
     * Allows you to highlight a specific point of the series while rendering the pivot chart.
     * For example, to highlight first point in the first series, set the properties series to 0 and points to 1. To use this option, it requires the property `selectionMode` to be **Point** or **Series**.
     * @default []
     */
    @Collection<PivotChartIndexesModel>([], Indexes)
    public selectedDataIndexes: PivotChartIndexesModel[];

    /**
     * Allows you to enable/disable the tooltip animation while performing the mouse move from one point to another in the pivot chart.
     * @default true
     */
    @Property(true)
    public enableAnimation: boolean;

    /**
     * Allows you to render the pivot chart in canvas mode.
     *
     * @default false
     */
    @Property(false)
    public enableCanvas: boolean;

    /**
     * Allows the group separator to be shown to the values in the pivot chart.
     * @default true
     */
    @Property(true)
    public useGroupingSeparator: boolean;

    /**
     * Allows you to render the pivot chart in a transposed manner or not.
     * @default false
     */
    @Property(false)
    public isTransposed: boolean;

    /**
     * Allows you to highlight specific legends by clicking the mouse or by interacting with the keyboard in the pivot chart.
     * @default 1
     */
    @Property(1)
    public tabIndex: number;

    /**
     * Allows you to add a description of the pivot chart.
     * @default null
     */
    @Property(null)
    public description: string;

    /**
     * It triggers after the pivot chart resized.
     * @event
     * @deprecated
     */
    @Event()
    public resized: EmitType<IResizeEventArgs>;

    /**
     * Allows you to draw points of the column type pivot chart series as side by side.
     * @default true
     */
    @Property(true)
    public enableSideBySidePlacement: boolean;

    /**
     * It triggers after the pivot chart loaded.
     * @event
     * @deprecated
     */
    @Event()
    public loaded: EmitType<ILoadedEventArgs>;

    /**
     * It triggers before the pivot chart prints.
     * @event
     * @deprecated
     */
    @Event()
    public beforePrint: EmitType<IPrintEventArgs>;

    /**
     * It triggers after the pivot chart series animation is completed.
     * @event
     * @deprecated
     */
    @Event()
    public animationComplete: EmitType<IAnimationCompleteEventArgs>;

    /**
     * It triggers before chart loads.
     * @event
     * @deprecated
     */
    @Event()
    public load: EmitType<ILoadedEventArgs>;

    /**
     * It triggers before the data label for series renders in the pivot chart.
     * @event
     * @deprecated
     */
    @Event()
    public textRender: EmitType<ITextRenderEventArgs>;

    /**
     * It triggers before the legend renders in the pivot chart.
     * @event
     * @deprecated
     */
    @Event()
    public legendRender: EmitType<ILegendRenderEventArgs>;

    /**
     * It triggers before the series is rendered in the pivot chart.
     * @event
     * @deprecated
     */
    @Event()
    public seriesRender: EmitType<ISeriesRenderEventArgs>;

    /**
     * Event to customize the multi-level labels of the pivot chart. This triggers while rendering the multi-level labels
     * @event
     */
    @Event()
    public multiLevelLabelRender: EmitType<MultiLevelLabelRenderEventArgs>;

    /**
     * It triggers before each points for the series is rendered.
     * @event
     * @deprecated
     */
    @Event()
    public pointRender: EmitType<IPointRenderEventArgs>;

    /**
     * It triggers before the tooltip for series is rendered.
     * @event
     * @deprecated
     */
    @Event()
    public tooltipRender: EmitType<ITooltipRenderEventArgs>;

    /**
     * It triggers when the legend series clicked.
     * @event
     */
     @Event()
    public legendClick: EmitType<ILegendClickEventArgs>;

    /**
     * It triggers before each axis label is rendered.
     * @event
     * @deprecated
     */
    @Event()
    public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;

    /**
     * It triggers when clicked multi-level label.
     * @event
     * @deprecated
     */
    @Event()
    public multiLevelLabelClick: EmitType<MultiLevelLabelClickEventArgs>;

    /**
     * It triggers on clicking the pivot chart.
     * @event
     * @deprecated
     */
    @Event()
    public chartMouseClick: EmitType<IMouseEventArgs>;

    /**
     * It triggers on hovering the pivot chart.
     * @event
     * @deprecated
     */
    @Event()
    public chartMouseMove: EmitType<IMouseEventArgs>;

    /**
     * It triggers on series point move.
     * @event
     * @deprecated
     */
    @Event()
    public pointMove: EmitType<IPointEventArgs>;

    /**
     * It triggers on series point click.
     * @event
     * @deprecated
     */
    @Event()
    public pointClick: EmitType<IPointEventArgs>;

    /**
     * It triggers when mouse down on chart series.
     * @event
     * @deprecated
     */
    @Event()
    public chartMouseDown: EmitType<IMouseEventArgs>;

    /**
     * It triggers when cursor leaves the chart.
     * @event
     * @deprecated
     */
    @Event()
    public chartMouseLeave: EmitType<IMouseEventArgs>;

    /**
     * It triggers after the drag selection is completed on chart series.
     * @event
     * @deprecated
     */
    @Event()
    public dragComplete: EmitType<IDragCompleteEventArgs>;

    /**
     * It triggers when mouse up on chart series.
     * @event
     * @deprecated
     */
    @Event()
    public chartMouseUp: EmitType<IMouseEventArgs>;

    /**
     * It triggers when start scroll the chart series.
     * @event
     * @deprecated
     */
    @Event()
    public scrollStart: EmitType<IScrollEventArgs>;

    /**
     * It triggers after the zoom selection is completed.
     * @event
     * @deprecated
     */
    @Event()
    public zoomComplete: EmitType<IZoomCompleteEventArgs>;

    /**
     * It triggers when change the scroll of the chart seires.
     * @event
     * @deprecated
     */
    @Event()
    public scrollChanged: EmitType<IScrollEventArgs>;

    /**
     * It triggers after the scroll end.
     * @event
     * @deprecated
     */
    @Event()
    public scrollEnd: EmitType<IScrollEventArgs>;

    /**
     * Allows you to display the multi-level label feature in the pivot chart. This multi-level labels used to perform drill operation in the pivot chart.
     * @default true
     */
    @Property(true)
    public showMultiLevelLabels: boolean;
}
