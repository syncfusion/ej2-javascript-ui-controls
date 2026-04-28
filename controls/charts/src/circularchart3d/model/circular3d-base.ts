import { Size } from '@syncfusion/ej2-svg-base';
import { CircularChart3DPoints, CircularChart3DSeries } from '../renderer/series';
import { CircularChart3DTextRenderEventArgs } from './pie-interface';
import { FontModel } from '../../common/model/base-model';
import { CircularChart3DMatrix } from '../renderer/3d-renderer';

/**
 * Interface for a 3D vector with components for x, y, and z coordinates.
 *
 * @interface
 * @private
 */
export interface CircularChart3DVector {
    /** The x-coordinate of the 3D vector. */
    x: number;
    /** The y-coordinate of the 3D vector. */
    y: number;
    /** The z-coordinate of the 3D vector. */
    z?: number;
}

/**
 * Represents the location information for a point in a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DSymbolLocation {
    /** The x-coordinate of the point. */
    x: number;
    /** The y-coordinate of the point. */
    y: number;
    /** The z-coordinate of the point. */
    z?: number;
    /** The radius of the point. */
    radius: number;
    /** The angle of the point in radians. */
    angle: number;
    /** The center coordinates of the point. */
    center?: CircularChart3DVector;
}

/**
 * Represents a 3D polygon in a chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DPolygon {
    /** * The normal vector of the polygon. */
    normal: CircularChart3DVector;
    /** * The array of 3D points defining the polygon. */
    points: CircularChart3DVector[];
    /** * An alternate array of 3D points defining the polygon. */
    vectorPoints: CircularChart3DVector[];
    /** * The index of the polygon. */
    index: number;
    /** * The associated chart in 3D space. */
    tag: CircularChart3DPolygon;
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
    element?: CircularChart3DLabelElement | null;
    /** * Flag indicating whether the polygon is split.*/
    isSplit?: boolean;
}

/**
 * Represents attributes associated with a 3D polygon.
 *
 * @interface
 * @private
 */
export interface CircularChart3DPolyAttributes {
    /** The index of the polygon.*/
    index: number,
    /** The result of an operation on the polygon.*/
    result: string,
    /** The 3D vector associated with the polygon.*/
    vector: CircularChart3DVector,
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
 * Represents a segment in a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DSegments {
    /** Gets or sets the starting value of the segment. */
    startValue: number,
    /** Gets or sets the ending value of the segment. */
    endValue: number,
    /** Gets or sets the depth of the segment in the 3D series*/
    depth: number,
    /** Gets or sets the radius of the segment in the 3D series. */
    radius: number,
    /** Gets or sets the index of the segment. */
    index: number,
    /** Gets or sets the YData associated with the segment. */
    yData: number,
    /** Gets or sets the center of the segment in a circular 3D vector. */
    center: CircularChart3DVector,
    /** Gets or sets the inside radius of the segment. */
    inSideRadius: number,
    /** Gets or sets the actual ending value of the segment. */
    actualEndValue: number,
    /** Gets or sets the actual starting value of the segment. */
    actualStartValue: number,
    /** Gets or sets the index of the point associated with the segment. */
    pointIndex: number,
    /** Gets or sets the series to which the segment belongs. */
    series: CircularChart3DSeries,
    /** Gets or sets the visibility status of the segment. */
    visible: boolean,
    /** Gets or sets the accessibility text of the segment. */
    accessibilityText: string,
}

/**
 * Represents the style configuration for a series of circular 3D elements.
 *
 * @interface
 * @private
 */
export interface CircularChart3DSeriesStyle {
    /** The opacity of the circular 3D series.*/
    opacity: number,
    /** The interior color of the circular 3D series point.*/
    interior: string,
}

/**
 * Represents basic transformation parameters for rendering.
 *
 * @interface CircularChart3DBasicTransform
 * @private
 */
export interface CircularChart3DBasicTransform {
    /** The size of the viewing area. */
    viewingArea: Size;
    /** The rotation angle in radians. */
    rotation: number;
    /** The tilt angle in radians. */
    tilt: number;
    /** The depth of the transformation. */
    depth: number;
    /** The perspective angle in radians. */
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
    chartObj?: CircularChart3DMatrix;
}

/**
 * Represents a 3D location with coordinates in a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DLocation {
    /** The x-coordinate of the 3D location.*/
    x?: number;
    /** The x-coordinate of the 3D location. */
    y?: number;
    /** The z-coordinate of the 3D location. */
    z?: number;
}

/**
 * Represents collections of polygons categorized as back and front.
 *
 * @interface
 * @private
 */
export interface CircularChart3DPolyCollections {
    /** Collection of polygons categorized as back.*/
    backPolygon: CircularChart3DPolygon[];
    /** Collection of polygons categorized as front.*/
    frontPolygon: CircularChart3DPolygon[]
}

/**
 * Represents a string builder with methods for appending, removing, inserting, and converting strings.
 *
 * @interface
 */
export interface CircularChart3DStringBuilder {

    /**
     * Appends the specified string to the end of the current string builder.
     *
     * @param s - The string to append.
     * @returns The updated CircularChart3DStringBuilder instance.
     */
    append: (s: string) => CircularChart3DStringBuilder;

    /**
     * Removes characters from the current string builder, starting at the specified position.
     *
     * @param i - The starting index for removal.
     * @param j - The number of characters to remove (default is 1).
     * @returns The updated CircularChart3DStringBuilder instance.
     */
    remove?: (i: number, j?: number) => CircularChart3DStringBuilder;

    /**
     * Inserts the specified string into the current string builder at the specified position.
     *
     * @param i - The index at which to insert the string.
     * @param s - The string to insert.
     * @returns The updated CircularChart3DStringBuilder instance.
     */
    insert?: (i: number, s: string) => CircularChart3DStringBuilder;

    /**
     * Converts the contents of the string builder to a string.
     *
     * @param s - The separator to use between concatenated elements (default is an empty string).
     * @returns The string representation of the current string builder.
     */
    toString: (s?: string) => string;
}

/**
 * Represents a color using red (R), green (G), and blue (B) components, with an optional alpha (A) component for transparency.
 *
 * @interface
 * @private
 */
export interface CircularChart3DColorFormat {
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
 * Represents the properties of a path element.
 *
 * @interface
 * @private
 */
export interface CircularChart3DPathOptions {
    /** The unique identifier of the path element. */
    id: string;
    /** The name associated with the path element. */
    name: string;
    /** The fill color of the path element. */
    fill: string;
    /** The stroke color of the path element. */
    stroke: string;
    /** The width of the stroke for the path element. */
    'stroke-width': number;
    /** The opacity of the path element. */
    opacity: number;
    /** The description of the path element. */
    d: string;
}

/**
 * Interface representing element data for a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DDataElement {
    /** The text content of the element.*/
    text: string;
    /** The location values associated with the element.*/
    location: CircularChart3DLocation;
    /** The three-dimensional series associated with the element.*/
    series?: CircularChart3DSeries;
    /** The index of the data point associated with the element.*/
    pointIndex?: number;
    /** An alternative text property for the element.*/
    alternativeText?: string;
}

/**
 * Interface representing a label element in a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DLabelElement {
    /** The width of the label element.*/
    width?: number;
    /** The height of the label element.*/
    height?: number;
    /** The content of the label, which can be either a string or an element data.*/
    label?: CircularChart3DDataElement;
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
    series?: CircularChart3DSeries;
    /** The index of the data point associated with the label.*/
    pointIndex?: number;
    /** The three-dimensional data point associated with the label.*/
    point?: CircularChart3DPoints;
    /** The index of the series associated with the label.*/
    seriesIndex?: number;
    /** Additional arguments data associated with the label.*/
    argsData?: CircularChart3DTextRenderEventArgs;
    /** The fill color of the label element.*/
    fill?: string;
    /** The stroke color of the label element.*/
    stroke?: string;
    /** The stroke width of the label element.*/
    dashArray?: string;
    /** The transform of the element.*/
    transform?: string;
}

/**
 * Represents the position of a circular 3D label in a two-dimensional space.
 *
 * @interface
 * @private
 */
export interface CircularChart3DTitlePosition {
    /**The x-coordinate of the label position.*/
    x: number,
    /**The y-coordinate of the label position.*/
    y: number,
    /** The size of the label. */
    size: Size
}

/**
 * Represents information about a point in a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DPointInformation {
    /** The x-value of the point. */
    pointX: object;
    /** The y-value of the point.*/
    pointY: object;
    /** The index of the point. */
    pointIndex: number;
    /** The index of the point. */
    seriesIndex: number;
    /** The name of the series. */
    seriesName: string;
    /** The text associated with the point. */
    pointText: string;
}

/**
 * Represents the theme style configuration for a circular 3D chart.
 *
 * @interface
 * @private
 */
export interface CircularChart3DThemeStyle {
    /** Gets or sets the title of the chart. */
    chartTitle: string;
    /** Gets or sets the label for the legend. */
    legendLabel: string;
    /** Gets or sets the background color of the chart. */
    background: string;
    /** Gets or sets the fill color of the chart tooltip. */
    tooltipFill: string;
    /** Gets or sets the font style for the bold labels in the chart tooltip. */
    tooltipBoldLabel: string;
    /** Gets or sets the font style for the light labels in the chart tooltip. */
    tooltipLightLabel: string;
    /** Gets or sets the color of the header line in the chart tooltip. */
    tooltipHeaderLine: string;
    /** Gets or sets the color of the tab in the chart. */
    tabColor: string;
    /** Gets or sets the font configuration for the chart title. */
    chartTitleFont: FontModel;
    /** Gets or sets the font configuration for the legend title. */
    legendTitleFont: FontModel;
    /** Gets or sets the font configuration for the legend labels. */
    legendLabelFont: FontModel;
    /** Gets or sets the opacity of the chart tooltip. */
    tooltipOpacity?: number;
    /** Gets or sets the font configuration for the labels in the chart tooltip. */
    tooltipLabelFont: FontModel;
    /** Gets or sets the font configuration for the subtitle of the chart. */
    chartSubTitleFont: FontModel;
    /** Gets or sets the font configuration for the data labels in the chart. */
    datalabelFont: FontModel;
}
