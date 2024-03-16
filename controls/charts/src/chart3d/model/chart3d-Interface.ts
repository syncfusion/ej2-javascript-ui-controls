import { RectAttributes, Size } from '@syncfusion/ej2-svg-base';
import { Chart3D } from '../chart3D';
import { Chart3DSeries, Chart3DPoint } from '../series/chart-series';
import { Chart3DAxis, Visible3DLabels } from '../axis/axis';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { Chart3DSeriesModel } from '../series/chart-series-model';
import { Matrix3D } from '../utils/chart3dRender';
import { Alignment, ChartTheme, LegendShape, TextOverflow, TitlePosition } from '../../common/utils/enum';
import { VisibleRangeModel } from '../../common/model/interface';
import { ChildProperty, Complex, Property } from '@syncfusion/ej2-base';
import { Chart3DTextFontModel, TitleBorderModel } from './chart3d-Interface-model';

/**
 * Interface for event argument objects in a 3D chart.
 */
export interface Chart3DEventArgs {
    /** Defines the event cancel status. */
    cancel: boolean;
}

/**
 * Interface for event argument objects representing the "3D loaded" event in a 3D chart.
 */
export interface Chart3DLoadedEventArgs extends Chart3DEventArgs {
    /** Defines the chart instance. */
    chart: Chart3D;
    /** Defines the theme in which the chart renders. */
    theme?: ChartTheme;
}

/**
 * Represents a string builder with methods for appending, removing, inserting, and converting strings.
 */
export interface Chart3DStringBuilder {
    append: (s: string) => Chart3DStringBuilder;
    remove: (i: number, j?: number) => Chart3DStringBuilder;
    insert: (i: number, s: string) => Chart3DStringBuilder;
    toString: (s?: string) => string;
}

/**
 * Represents a color using red (R), green (G), and blue (B) components, with an optional alpha (A) component for transparency.
 */
export interface Chart3DColorFormat {
    /** The red component of the color. */
    red: number;
    /** The green component of the color. */
    green: number;
    /** The blue component of the color. */
    blue: number;
    /**
     * The optional alpha component of the color, representing transparency.
     * It can be a number in the range [0, 1] or a string representation (e.g., "0.5").
     */
    alpha?: number | string;
}

/**
 * Interface for event argument objects representing the rendering of a 3D series in a chart.
 */
export interface Chart3DSeriesRenderEventArgs {
    /** Defines the series that is getting rendered. */
    series: Chart3DSeries;
    /** Defines the current series data source. */
    data: Object;
    /** Defines the current series fill. */
    fill: string;
}

/**
 * Interface for event argument objects representing the calculated range of an axis in a 3D chart.
 */
export interface Chart3DAxisRangeCalculatedEventArgs extends Chart3DEventArgs {
    /** Defines the current axis. */
    axis: Chart3DAxis;
    /** Defines axis current range. */
    minimum: number;
    /** Defines axis current range. */
    maximum: number;
    /** Defines axis current interval. */
    interval: number;
}

/**
 * Interface for event argument objects representing the rendering of labels on a 3D axis in a chart.
 */
export interface Chart3DAxisLabelRenderEventArgs extends Chart3DEventArgs {
    /** Defines the current axis. */
    axis: Chart3DAxis;
    /** Defines axis current label text. */
    text: string;
    /** Defines axis current label value. */
    value: number;
    /** Defines axis current label font style. */
    labelStyle: FontModel;
}

/**
 * Interface for a 3D vector with components for x, y, and z coordinates.
 */
export interface Chart3DVector {
    /** The x-coordinate of the 3D vector. */
    x: number;
    /** The y-coordinate of the 3D vector. */
    y: number;
    /** The z-coordinate of the 3D vector. */
    z: number;
}

/**
 * Interface for defining the position of ticks in a chart, including their coordinates.
 */
export interface Chart3DTickPosition {
    /** The x-coordinate of the starting point of the tick. */
    x1: number;
    /** The y-coordinate of the starting point of the tick. */
    y1: number;
    /** The x-coordinate of the ending point of the tick. */
    x2: number;
    /** The y-coordinate of the ending point of the tick. */
    y2: number;
}

/**
 * Interface representing properties and attributes for tick elements in a chart.
 */
export interface Chart3DTickElement {
    /**  The opacity of the tick element (optional). */
    opacity?: number;
    /** The width of the tick element. */
    width: number;
    /** The stroke color of the tick element. */
    stroke: string;
    /** The name of the axis associated with the tick (optional). */
    axisName?: string;
    /** The child element associated with the tick. */
    child: Element;
    /** * A tag associated with the tick element. */
    tag: string;
    /** The unique identifier of the tick element. */
    id: string,
    /** * The font style for text-based ticks (optional). */
    font?: FontModel;
}

/**
 * Represents a 3D location with coordinates in a 3D chart.
 *
 * @private
 */
export interface Chart3DLocation {
    /** The x-coordinate of the 3D location.*/
    x?: number;
    /** The x-coordinate of the 3D location. */
    y?: number;
    /** The z-coordinate of the 3D location. */
    z?: number;
}

/**
 * Represents the dimensions of a rectangular wall in 3D space.
 */
export interface Chart3DWallRect {
    /** The left coordinate of the wall's bounding box.*/
    left: number;
    /** The right coordinate of the wall's bounding box. */
    right: number;
    /** The top coordinate of the wall's bounding box. */
    top: number;
    /** The bottom coordinate of the wall's bounding box. */
    bottom: number;
}

/**
 * Represents a labeled rectangle with coordinates and size.
 *
 */
export interface Chart3DLabelRect {
    /** The x-coordinate of the top-left corner of the rectangle. */
    x: number;
    /** The y-coordinate of the top-left corner of the rectangle. */
    y: number;
    /** The size of the rectangle, defined by its width and height. */
    size: Size;
}

/**
 * Interface representing a label element in a three-dimensional chart.
 *
 * @interface
 */
export interface Chart3DLabelElement {
    /** The width of the label element.*/
    width?: number;
    /** The height of the label element.*/
    height?: number;
    /** The content of the label, which can be either a string or an element data.*/
    label?: Visible3DLabels | Chart3DDataElement;
    /** The text anchor property specifying the alignment of the text.*/
    textAnchor?: string;
    /** A tag associated with the label element.*/
    tag: string;
    /** The font settings for the label element.*/
    font?: FontModel;
    /** The unique identifier for the label element.*/
    id?: string;
    /** Child element associated with the label.*/
    child?: Element;
    /** The rotation angle of the label element.*/
    angle?: number;
    /** The three-dimensional series associated with the label.*/
    series?: Chart3DSeries;
    /** The index of the data point associated with the label.*/
    pointIndex?: number;
    /** The three-dimensional data point associated with the label.*/
    point?: Chart3DPoint;
    /** The index of the series associated with the label.*/
    seriesIndex?: number;
    /** Additional arguments data associated with the label.*/
    argsData?: Chart3DTextRenderEventArgs;
    /** The fill color of the label element.*/
    fill?: string;
}

/**
 * Interface representing element data for a three-dimensional chart.
 *
 * @interface
 */
export interface Chart3DDataElement {
    /** The text content of the element.*/
    text: string;
    /** The location values associated with the element.*/
    location: Chart3DLocation;
    /** The three-dimensional series associated with the element.*/
    series?: Chart3DSeries;
    /** The index of the data point associated with the element.*/
    pointIndex?: number;
    /** An alternative text property for the element.*/
    alternativeText?: string;
}

/**
 * Interface representing style options for a three-dimensional chart element.
 *
 * @interface
 */
export interface Chart3DStyleOptions {
    /** The interior color of the element.*/
    interior: string;
    /** The opacity of the element.*/
    opacity: number;
    /** The dash array property of the element.*/
    dashArray?: string;
}

/**
 * Properties required to render a rectangle
 *
 * @private
 */
export interface Chart3DBoderElements extends RectAttributes {
    /**
     * Corner radius value of a rectangle
     */
    ry?: number;
}

/**
 * Represents the properties of a grid element.
 *
 * @interface Chart3DPathOptions
 */
export interface Chart3DPathOptions {
    /** The unique identifier of the grid element.*/
    id: string;
    /** The name associated with the grid element.*/
    name: string;
    /** The fill color of the grid element.*/
    fill: string;
    /** The stroke color of the grid element.*/
    stroke: string;
    /** The width of the stroke for the grid element.*/
    'stroke-width': number;
    /** The opacity of the grid element.*/
    opacity: number;
    /** The description of the grid element.*/
    d: string;
}

/**
 * Represents a 3D polygon in a chart.
 *
 * @interface Chart3DPolygon
 */
export interface Chart3DPolygon {
    /** * The normal vector of the polygon. */
    normal: Chart3DVector;
    /** * The array of 3D points defining the polygon. */
    points: Chart3DVector[];
    /** * An alternate array of 3D points defining the polygon. */
    vectorPoints: Chart3DVector[];
    /** * The index of the polygon. */
    index: number;
    /** * The associated chart in 3D space. */
    tag: Chart3D;
    /** * The name of the polygon. */
    name: string;
    /** * The thickness of the stroke used to outline the polygon. */
    strokeThickness: number;
    /** * The opacity of the polygon. */
    opacity: number;
    /** * The fill color of the polygon. */
    fill: string;
    /** * An additional numeric property 'd'. */
    d: number;
    /** * Element information associated with the polygon. */
    polygonElement: { tag: string, parent: Element };
    /** * Optional text associated with the polygon. */
    text?: string;
    /** * Optional element information associated with the polygon, can be null. */
    element?: Chart3DTickElement | Chart3DLabelElement | null;
    /** * Flag indicating whether the polygon is split.*/
    isSplit?: boolean;
}

/**
 * Represents attributes associated with a 3D polygon.
 *
 * @interface Chart3DPolyAttributes
 */
export interface Chart3DPolyAttributes {
    /** The index of the polygon.*/
    index: number,
    /** The result of an operation on the polygon.*/
    result: string,
    /** The 3D vector associated with the polygon.*/
    vector: Chart3DVector,
    /** Indicates if the point is a cutting back point.*/
    isCuttingBackPoint: boolean,
    /** The index of the cutting back pair, if applicable.*/
    cuttingBackPairIndex: number | null,
    /** Indicates if the polygon has already been cut back.*/
    alreadyCutBack: boolean,
    /** Indicates if the point is a cutting front point.*/
    isCuttingFrontPoint: boolean,
    /** The index of the cutting front pair, if applicable.*/
    cuttingFrontPairIndex: number | null,
    /** Indicates if the polygon has already been cut front.*/
    alreadyCutFront: boolean,
    /** An optional flag indicating if it is a cutting back point.*/
    cuttingBackPoint?: boolean,
    /** An optional index of the cutting back pair.*/
    alterCuttingBackPairIndex?: number,
    /** An optional flag indicating if it is a cutting front point.*/
    cuttingFrontPoint?: boolean,
    /** An optional index of the cutting front pair.*/
    alterCuttingFrontPairIndex?: number,
}

/**
 * Represents collections of polygons categorized as back and front.
 *
 * @interface Chart3DPolyCollections
 */
export interface Chart3DPolyCollections {
    /** Collection of polygons categorized as back.*/
    backPolygon: Chart3DPolygon[];
    /** Collection of polygons categorized as front.*/
    frontPolygon: Chart3DPolygon[]
}

/**
 * Represents the arguments for the 3D text rendering event in a chart.
 *
 * @interface Chart3DTextRenderEventArgs
 */
export interface Chart3DTextRenderEventArgs extends Chart3DEventArgs {
    /** Defines the text for the data label. */
    text: string;
    /** Defines data label text style. */
    textStyle: Chart3DTextFontModel;
    /** Defines the data label border. */
    border: BorderModel;
    /** Defines the data label template.
     *
     * @aspType string
     */
    template: string | Function;
    /** Defines the series information for the data label. */
    series: Chart3DSeriesModel;
    /** Defines the point information for the data label. */
    point: Chart3DPoint;
    /** Defines the data label color. */
    color: string;
    /** Specifies whether to cancel the text render. */
    cancel: boolean;
}

/**
 * Represents options for rendering text.
 *
 * @interface Chart3DTextOption
 */
export interface Chart3DTextOption {
    /** Unique identifier for the text element. */
    id: string;
    /** The x-coordinate of the text element. */
    x: number;
    /** The y-coordinate of the text element. */
    y: number;
    /** The fill color of the text. */
    fill: string;
    /** The font size of the text. */
    'font-size': string;
    /** The font family for the text. */
    'font-family': string;
    /** The font style (e.g., normal, italic) of the text.*/
    'font-style': string;
    /** The font weight (e.g., normal, bold) of the text. */
    'font-weight': string;
    /** The opacity of the text. */
    opacity: number;
    /**The text anchor position (e.g., start, middle, end).*/
    'text-anchor': string;
    /**The cursor type for the text element.*/
    cursor: string;
    /** The transformation applied to the text. */
    transform: string;
}

/**
 * Represents basic transformation parameters for rendering.
 *
 * @interface Chart3DBasicTransform
 */
export interface Chart3DBasicTransform {
    /** The size of the viewing area. */
    viewingArea: Size;
    /** The rotation angle. */
    rotation: number;
    /** The tilt angle. */
    tilt: number;
    /** The depth of the transformation. */
    depth: number;
    /** The perspective angle. */
    perspectiveAngle: number;
    /** Flag indicating whether an update is needed. */
    needUpdate: boolean;
    /** The centered matrix used in transformation. */
    centeredMatrix: number[][];
    /** The perspective matrix used in transformation. */
    perspective: number[][];
    /** The result matrix after transformation.*/
    resultMatrix: number[][];
    /** The view matrix used in transformation. */
    viewMatrix: number[][];
    /**  Reference to the chart object. */
    chartObj?: Matrix3D;
}

/**
 * Represents the arguments for 3D tooltip rendering event.
 *
 * @interface Chart3DTooltipRenderEventArgs
 */
export interface Chart3DTooltipRenderEventArgs extends Chart3DEventArgs {
    /** Specifies collections of tooltip text. */
    text?: string;
    /** Defines tooltip text style. */
    textStyle?: FontModel;
    /** Defines the header text for the tooltip. */
    headerText?: string;
    /** Defines the point information for the tooltip. */
    data?: Chart3DPointInformation;
    /** Defines the tooltip template. */
    template?: string;
    /** Specifies whether to cancel the tooltip render. */
    cancel: boolean;
}

/**
 * Represents information about a 3D point.
 *
 * @interface Chart3DPointInformation
 */
export interface Chart3DPointInformation {
    /** point xValue. */
    pointX: object;
    /** point yValue. */
    pointY: object;
    /** point index. */
    pointIndex: number;
    /** series index. */
    seriesIndex: number;
    /** series name. */
    seriesName: string;
    /** point text. */
    pointText: string;
}

/**
 * Represents event arguments for 3D point interactions.
 *
 * @interface Chart3DPointEventArgs
 */
export interface Chart3DPointEventArgs extends Chart3DEventArgs {
    /** Defines the series where the mouse hovered or clicked. */
    series: Chart3DSeriesModel;
    /** Defines the point where the mouse hovered or clicked. */
    point: Chart3DPoint;
    /** Defines the point index where the mouse hovered or clicked. */
    pointIndex: number;
    /** Defines the series index where the mouse hovered or clicked. */
    seriesIndex: number;
    /** Specifies the current mouse X-coordinate. */
    x: number;
    /** Specifies the current mouse Y-coordinate. */
    y: number;
}

/**
 * Represents event arguments for 3D legend rendering.
 *
 * @interface Chart3DLegendRenderEventArgs
 */
export interface Chart3DLegendRenderEventArgs extends Chart3DEventArgs {
    /** Defines the legend text. */
    text: string;
    /** Defines the legend fill color. */
    fill: string;
    /** Defines the legend shape. */
    shape: LegendShape;
    /** Specifies whether to cancel the legend render. */
    cancel: boolean;
}

/**
 * Represents event arguments for 3D mouse interaction.
 *
 * @interface Chart3DMouseEventArgs
 */
export interface Chart3DMouseEventArgs extends Chart3DEventArgs {
    /** Defines current mouse event target id. */
    target: string;
    /** Defines current mouse x location. */
    x: number;
    /** Defines current mouse y location. */
    y: number;
}

/**
 * Represents event arguments for the completion of 3D selection.
 *
 * @interface Chart3DSelectionCompleteEventArgs
 */
export interface Chart3DSelectionCompleteEventArgs extends Chart3DEventArgs {
    /** Defines current selected Data X, Y values. */
    selectedDataValues: { x?: string | number | Date, y?: number, seriesIndex?: number, pointIndex?: number }[];
    /**
     * Reference to the 3D chart instance.
     */
    chart: Chart3D;
}

/**
 * Represents event arguments for 3D chart export.
 *
 * @interface Chart3DExportEventArgs
 */
export interface Chart3DExportEventArgs extends Chart3DEventArgs {
    /**
     * The width of the exported chart.
     */
    width: number;
    /**
     * The height of the exported chart.
     */
    height: number;
}
/**
 * Represents the arguments for the 3D print event in a chart.
 *
 * @interface Chart3DPrintEventArgs
 */
export interface Chart3DPrintEventArgs extends Chart3DEventArgs {
    /** Specifies the HTML content to be printed. */
    htmlContent: Element;
}

/**
 * Represents event arguments for 3D chart printing.
 *
 * @interface Chart3DPointRenderEventArgs
 */
export interface Chart3DPointRenderEventArgs extends Chart3DEventArgs {
    /** Defines the series for the point. */
    series: Chart3DSeries;
    /** Defines the point. */
    point: Chart3DPoint;
    /** Defines the point fill color. */
    fill: string;
    /** Specifies whether to cancel the point render. */
    cancel: boolean;
}

/**
 * Represents event arguments for 3D chart legend click.
 *
 * @interface Chart3DLegendClickEventArgs
 */
export interface Chart3DLegendClickEventArgs extends Chart3DEventArgs {
    /** Defines the shape of the legend clicked. */
    legendShape: LegendShape;
    /** Defines the series for the legend clicked. */
    series: Chart3DSeries;
    /** Defines the legend text. */
    legendText: string;
    /** Defines the legend fill color. */
    cancel: boolean;
}

/**
 * Represents event arguments for 3D chart resize.
 *
 * @interface Chart3DResizeEventArgs
 */
export interface Chart3DResizeEventArgs {
    /** Specifies the previous size of the 3D chart. */
    previousSize: Size;
    /** Specifies the current size of the 3D chart. */
    currentSize: Size;
    /** Defines the 3D chart instance. */
    chart: Chart3D;
}

/**
 * Represents event arguments before 3D chart resize.
 *
 * @interface Chart3DBeforeResizeEventArgs
 */
export interface Chart3DBeforeResizeEventArgs {
    /** Specifies whether to cancel the resize event. */
    cancel: boolean;
}

/**
 * Represents the style settings for 3D chart theme.
 *
 * @interface Chart3DThemeStyle
 */
export interface Chart3DThemeStyle {
    /** The color of axis labels. */
    axisLabel: string;
    /** The color of axis titles. */
    axisTitle: string;
    /** The color of major grid lines. */
    majorGridLine: string;
    /** The color of minor grid lines. */
    minorGridLine: string;
    /** The color of major tick lines. */
    majorTickLine: string;
    /** The color of minor tick lines. */
    minorTickLine: string;
    /** The color of the chart title. */
    chartTitle: string;
    /** The color of legend labels. */
    legendLabel: string;
    /** The background color of the chart. */
    background: string;
    /** The fill color of tooltip. */
    tooltipFill: string;
    /** The color of bold labels in tooltip. */
    tooltipBoldLabel: string;
    /** The color of light labels in tooltip. */
    tooltipLightLabel: string;
    /** The color of the header line in tooltip. */
    tooltipHeaderLine: string;
    /** The color of tab headers. */
    tabColor: string;
    /** The font settings for the chart title. */
    chartTitleFont: FontModel;
    /** The font settings for axis labels. */
    axisLabelFont: FontModel;
    /** The font settings for legend titles. */
    legendTitleFont: FontModel;
    /** The font settings for legend labels. */
    legendLabelFont: FontModel;
    /** The opacity of tooltip. */
    tooltipOpacity?: number;
    /** The font settings for tooltip labels. */
    tooltipLabelFont: FontModel;
    /** The font settings for axis titles. */
    axisTitleFont: FontModel;
    /** The font settings for chart subtitles. */
    chartSubTitleFont: FontModel;
    /** The font settings for data labels. */
    datalabelFont: FontModel;
    /** The color of the 3D wall */
    backWallColor: string;
    /** The color of the 3D wall */
    leftWallColor: string;
}

/**
 * Represents the position information for a rectangle.
 *
 * @interface
 */
export interface Chart3DRectPosition {
    /** The position value for the rectangle. */
    position: number;
    /** The count of rectangles. */
    rectCount: number;
}

/**
 * Represents information about the depth.
 *
 * @interface
 */
export interface Chart3DDepthInfoType {
    /** The starting value of the depth. */
    start: number;
    /** The ending value of the depth. */
    end: number;
    /** The change in depth. */
    delta: number;
}

/**
 * Represents values related to a range.
 *
 * @interface
 */
export interface Chart3DRangeValues {
    /** The starting value of the range. */
    start: number;
    /** The ending value of the range. */
    end: number;
    /** The change in value within the range. */
    delta: number;
    /** The median value within the range. */
    median: number;
    /** Indicates whether the range is empty. */
    isEmpty: boolean;
}

/**
 * Defines the tooltip fade out mode of the chart.
 * * Click - Used to remove the tooltip on click.
 * * Move - Used to remove the tooltip with some delay.
 */
export type Chart3DFadeOutMode =
    /** Used to remove the tooltip on click  */
    'Click' |
    /** Used to remove the tooltip with some delay  */
    'Move';

/**
 * Configures the fonts in charts.
 */

export class Chart3DTextFont extends ChildProperty<Chart3DTextFont> {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     *
     * @default '16px'
     */

    @Property('16px')
    public size: string;

    /**
     * FontWeight for the text.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontWeight: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * FontFamily for the text.
     */
    @Property('Segoe UI')
    public fontFamily: string;

    /**
     * Opacity for the text.
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

}

/**
 * Configures the borders in the 3D chart title.
 */
export class TitleBorder extends ChildProperty<TitleBorder> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public color: string;

    /**
     * The width of the border in pixels.
     *
     * @default 0
     */

    @Property(0)
    public width: number;

    /**
     * corder radius for the border.
     *
     * @default 0.8
     */

    @Property(0.8)
    public cornerRadius: number;

}

/**
 * Configures the title settings in 3D chart.
 */
export class TitleSettings extends ChildProperty<TitleSettings> {

    /**
     * FontStyle for the text.
     *
     * @default 'Normal'
     */

    @Property('Normal')
    public fontStyle: string;

    /**
     * Font size for the text.
     *
     * @default '15px'
     */

    @Property('15px')
    public size: string;

    /**
     * FontWeight for the text.
     *
     * @default '500'
     */

    @Property('500')
    public fontWeight: string;

    /**
     * Color for the text.
     *
     * @default ''
     */

    @Property('')
    public color: string;

    /**
     * text alignment.
     *
     * @default 'Center'
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
     *
     * @default 1
     */

    @Property(1)
    public opacity: number;

    /**
     * Specifies the chart title text overflow.
     *
     * @default 'Wrap'
     */

    @Property('Wrap')
    public textOverflow: TextOverflow;

    /**
     * Defines the position for the chart title.
     * * Top: Displays the title at the top of the chart.
     * * Left: Displays the title at the left of the chart.
     * * Bottom: Displays the title at the bottom of the chart.
     * * Right: Displays the title at the right of the chart.
     * * Custom: Displays the title based on the given x and y values.
     *
     * @default 'Top'
     */

    @Property('Top')
    public position: TitlePosition;

    /**
     * Defines the X coordinate for the chart title.
     *
     * @default 0
     */

    @Property(0)
    public x: number;

    /**
     * Defines the Y coordinate for the chart title.
     *
     * @default 0
     */

    @Property(0)
    public y: number;

    /**
     * Background of the title border.
     *
     * @default 'transparent'
     */

    @Property('transparent')
    public background: string;

    /**
     * Options to customize the border of the chart title.
     */

    @Complex<TitleBorderModel>({}, TitleBorder)
    public border: TitleBorderModel;
}