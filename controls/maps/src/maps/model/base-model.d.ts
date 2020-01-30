import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Alignment, LegendPosition, LegendType, LegendMode, ShapeLayerType, Type, MarkerType, Orientation, MapAjax } from '../../index';import { SmartLabelMode, IntersectAction } from '../../index';import { Theme } from './theme';import { Point, GeoLocation } from '../utils/helper';import { BingMapType, LegendArrangement, LegendShape, BubbleType, StaticMapType } from '../utils/enum';import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Specifies the id of html element.
     */
    content?: string;

    /**
     * Specifies the position of x.
     */
    x?: string;

    /**
     * Specifies the position of y.
     */
    y?: string;

    /**
     * Specifies the vertical alignment of annotation.
     * @default None
     */
    verticalAlignment?: AnnotationAlignment;

    /**
     * Specifies the horizontal alignment of annotation.
     * @default None
     */
    horizontalAlignment?: AnnotationAlignment;

    /**
     * Specifies the zIndex of the annotation.
     * @default '-1'
     */
    zIndex?: string;

}

/**
 * Interface for a class Arrow
 */
export interface ArrowModel {

    /**
     * arrowPosition
     */
    position?: string;

    /**
     * show
     */
    showArrow?: boolean;

    /**
     * size
     */
    size?: number;

    /**
     * color
     */
    color?: string;

    /**
     * offset the arrow in navigation line by specified pixels
     */
    offSet?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for the text.
     */
    size?: string;

    /**
     * Color for the text.
     */
    color?: string;

    /**
     * FontFamily for the text.
     */
    fontFamily?: string;

    /**
     * FontWeight for the text.
     */
    fontWeight?: string;

    /**
     * FontStyle for the text.
     */
    fontStyle?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     */
    color?: string;

    /**
     * The width of the border in pixels.
     */
    width?: number;

}

/**
 * Interface for a class CenterPosition
 */
export interface CenterPositionModel {

    /**
     * latitude for the center position of maps
     * @default null
     */
    latitude?: number;

    /**
     * longitude for the center position of maps
     * @default null
     */
    longitude?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Toggle the tooltip visibility.
     * @default false
     */
    visible?: boolean;

    /**
     * To customize the tooltip template.
     * @default ''
     */
    template?: string;

    /**
     * To customize the fill color of the tooltip.
     */
    fill?: string;

    /**
     * Options for customizing the color and width of the tooltip.
     */
    border?: BorderModel;

    /**
     * Options for customizing text styles of the tooltip.
     */
    textStyle?: FontModel;

    /**
     * To customize the format of the tooltip.
     * @default null
     */
    format?: string;

    /**
     * To customize the value of the tooltip.
     * @default null
     */
    valuePath?: string;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Left margin in pixels.
     * @default 10
     */
    left?: number;

    /**
     * Right margin in pixels.
     * @default 10
     */
    right?: number;

    /**
     * Top margin in pixels.
     * @default 10
     */
    top?: number;

    /**
     * Bottom margin in pixels.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class ConnectorLineSettings
 */
export interface ConnectorLineSettingsModel {

    /**
     * Set the color for connector line
     * @default '#000000'
     */
    color?: string;

    /**
     * Set the line width for connector line
     * @default 1
     */
    width?: number;

    /**
     * Set the opacity for connector line
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class MarkerClusterSettings
 */
export interface MarkerClusterSettingsModel {

    /**
     * Toggle the Clustering visibility.
     * @default false
     */
    allowClustering?: boolean;

    /**
     * Options for customizing the color and width of the Clustering.
     */
    border?: BorderModel;

    /**
     * To customize the fill color of the Clustering.
     * @default '#D2691E'
     */
    fill?: string;

    /**
     * To customize the opacity of the Clustering.
     * @default 1
     */
    opacity?: number;

    /**
     * To customize the Clustering of the marker.
     * @default Rectangle
     */
    shape?: MarkerType;

    /**
     * Customize the legend width of the maps.
     * @default 12
     */
    width?: number;

    /**
     * Customize the legend height of the maps.
     * @default 12
     */
    height?: number;

    /**
     * To move the marker by setting offset values
     */
    offset?: Point;

    /**
     * To provide the image url for rendering marker image
     */
    imageUrl?: string;

    /**
     * dashArray
     *  @default ''
     */
    dashArray?: string;

    /**
     * cluster style
     */
    labelStyle?: FontModel;

    /**
     * Toggle the cluster separate
     * @default false
     */
    allowClusterExpand?: boolean;

    /**
     * Set connector style for cluster separating
     */
    connectorLineSettings?: ConnectorLineSettingsModel;

}

/**
 * Interface for a class MarkerClusterData
 */
export interface MarkerClusterDataModel {

}

/**
 * Interface for a class ColorMappingSettings
 */
export interface ColorMappingSettingsModel {

    /**
     * To configure from
     * @aspDefaultValueIgnore
     * @default null
     * @isBlazorNullableType true
     */
    from?: number;

    /**
     * To configure to
     * @aspDefaultValueIgnore
     * @default null
     * @isBlazorNullableType true
     */
    to?: number;

    /**
     * To configure value
     * @default null
     */
    value?: string;

    /**
     * To configure color
     * @default null
     */
    color?: string | string[];

    /**
     * To configure min opacity
     * @default null
     */
    minOpacity?: number;

    /**
     * To configure max opacity
     * @default null
     */
    maxOpacity?: number;

    /**
     * To configure labels
     * @default null
     */
    label?: string;

    /**
     * To enable or disable the legend
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class InitialShapeSelectionSettings
 */
export interface InitialShapeSelectionSettingsModel {

    /**
     * To customize the fill color of the highlight.
     * @default null
     */
    shapePath?: string;

    /**
     * Toggle the highlight settings.
     * @default null
     */
    shapeValue?: string;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Toggle the selection settings.
     * @default false
     */
    enable?: boolean;

    /**
     * To customize the fill color of the Selection.
     * @default null
     */
    fill?: string;

    /**
     * To customize the opacity of the Selection.
     * @default 1
     */
    opacity?: number;

    /**
     * Toggle the multi selection.
     * @default false
     */
    enableMultiSelect?: boolean;

    /**
     * Options for customizing the color and width of the selection.
     */
    border?: BorderModel;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * To customize the fill color of the highlight.
     * @default null
     */
    fill?: string;

    /**
     * Toggle the highlight settings.
     * @default false
     */
    enable?: boolean;

    /**
     * To customize the opacity of the highlight.
     * @default 1
     */
    opacity?: number;

    /**
     * Options for customizing the color and width of the highlight.
     */
    border?: BorderModel;

}

/**
 * Interface for a class NavigationLineSettings
 */
export interface NavigationLineSettingsModel {

    /**
     * NavigationSelectedLine visible
     *  @default false
     */
    visible?: boolean;

    /**
     * Configures the label border
     * @default 1
     */
    width?: number;

    /**
     * NavigationSelectedLine longitude
     *  @default []
     */
    longitude?: number[];

    /**
     * NavigationSelectedLine latitude
     *  @default []
     */
    latitude?: number[];

    /**
     * dashArray
     *  @default ''
     */
    dashArray?: string;

    /**
     * NavigationSelectedLine color
     */
    color?: string;

    /**
     * Specifies the angle of curve connecting different locations in map
     * @default 0
     */
    angle?: number;

    /**
     * arrow
     */
    arrowSettings?: ArrowModel;

    /**
     * To configure the selection settings of the maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * To configure the highlight settings of the maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class BubbleSettings
 */
export interface BubbleSettingsModel {

    /**
     * Configures the bubble border
     */
    border?: BorderModel;

    /**
     * Toggle the visibility of bubble
     * @default false
     */
    visible?: boolean;

    /**
     * * Specifies dataSource for the bubble.
     * * The datasource must contain the size value of the bubble that can be bound to the bubble 
     * of the Maps using the valuePath property in the bubbleSettings.
     * * The datasource can contain data such as color, and the other information that can be bound to the color, and tooltip of the bubble.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: object[];

    /**
     * To configure bubble animation duration
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Animation duration
     * @default 0
     */
    animationDelay?: number;

    /**
     * To configure bubble fill color
     * @default ''
     */
    fill?: string;

    /**
     * To configure bubble minRadius
     * @default 10
     */
    minRadius?: number;

    /**
     * To configure bubble maxRadius
     * @default 20
     */
    maxRadius?: number;

    /**
     * To configure bubble opacity
     * @default 1
     */
    opacity?: number;

    /**
     * To configure bubble valuePath
     * @default null
     */
    valuePath?: string;

    /**
     * To configure bubble shape type
     * @default Circle
     */
    bubbleType?: BubbleType;

    /**
     * To configure bubble colorValuePath
     * @default null
     */
    colorValuePath?: string;

    /**
     * To configure bubble colorMapping
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * To configure the tooltip settings of the bubble .
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * To configure the selection settings of the maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * To configure the highlight settings of the maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class CommonTitleSettings
 */
export interface CommonTitleSettingsModel {

    /**
     * To customize the text of the title.
     * @default ''
     */
    text?: string;

    /**
     * To customize title description for the accessibility.
     * @default ''
     */
    description?: string;

}

/**
 * Interface for a class SubTitleSettings
 */
export interface SubTitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Options for customizing title styles of the Maps.
     */
    textStyle?: FontModel;

    /**
     * text alignment
     * @default Center
     */
    alignment?: Alignment;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Options for customizing title styles of the Maps.
     */
    textStyle?: FontModel;

    /**
     * text alignment
     * @default Center
     */
    alignment?: Alignment;

    /**
     * To configure sub title of maps.
     */
    subtitleSettings?: SubTitleSettingsModel;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * Toggle the visibility of zooming.
     * @default false
     */
    enable?: boolean;

    /**
     * Toggle the visibility of Panning
     * @default true
     */
    enablePanning?: boolean;

    /**
     * Configures tool bar orientation
     * @default Horizontal
     * @blazorProperty 'ToolbarOrientation'
     */
    toolBarOrientation?: Orientation;

    /**
     * Specifies the tool bar color.
     */
    color?: string;

    /**
     * Specifies the tool bar highlight color.
     */
    highlightColor?: string;

    /**
     * Specifies the tool bar selection color.
     * 
     */
    selectionColor?: string;

    /**
     * Configures vertical placement of tool bar 
     * @default Far
     */
    horizontalAlignment?: Alignment;

    /**
     * Configures vertical placement of tool bar 
     * @default Near
     */
    verticalAlignment?: Alignment;

    /**
     * To configure zooming items.
     */
    toolbars?: string[];

    /**
     * Toggle the mouse wheel zooming.
     * @default true
     */
    mouseWheelZoom?: boolean;

    /**
     * Double tab zooming
     * @default false
     * @blazorProperty 'ZoomOnDoubleClick'
     */
    doubleClickZoom?: boolean;

    /**
     * Toggle the pinch zooming.
     * @default true
     */
    pinchZooming?: boolean;

    /**
     * Toggle the selection on zooming.
     * @default false
     */
    zoomOnClick?: boolean;

    /**
     * Configures zoom factor.
     * @default 1
     */
    zoomFactor?: number;

    /**
     * Configures max zooming.
     * @default 10
     */
    maxZoom?: number;

    /**
     * Configures minimum zooming.
     * @default 1
     */
    minZoom?: number;

    /**
     * Zoom map based on marker positions.
     */
    shouldZoomInitially?: boolean;

}

/**
 * Interface for a class ToggleLegendSettings
 */
export interface ToggleLegendSettingsModel {

    /**
     * To toggle the legend
     * @default false
     */
    enable?: boolean;

    /**
     * To apply the shape settings
     * @default true
     */
    applyShapeSettings?: boolean;

    /**
     * To specify the opacity of the shape
     * @default 1
     */
    opacity?: number;

    /**
     * To fill the color for shape
     * @default ''
     */
    fill?: string;

    /**
     * To apply border for the shapes
     */
    border?: BorderModel;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Toggle the legend selection
     * @default false
     */
    toggleVisibility?: boolean;

    /**
     * Toggle the legend visibility.
     * @default false
     */
    visible?: boolean;

    /**
     * Customize the legend background
     * @default 'transparent'
     */
    background?: string;

    /**
     * Type of the legend rendering
     * @default Layers
     */
    type?: LegendType;

    /**
     * Inverted pointer for interactive legend
     */
    invertedPointer?: boolean;

    /**
     * To place the label position for interactive legend.
     * @default After
     */
    labelPosition?: LabelPosition;

    /**
     * Specifies the label intersect action.
     * @default None
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Customize the legend shape of the maps.
     * @default Circle
     */
    shape?: LegendShape;

    /**
     * Customize the legend width of the maps.
     * @default ''
     */
    width?: string;

    /**
     * Customize the legend height of the maps.
     * @default ''
     */
    height?: string;

    /**
     * Options for customizing text styles of the legend.
     */
    textStyle?: FontModel;

    /**
     * Customize the legend width of the maps.
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Customize the legend height of the maps.
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Customize the shape padding
     * @default 10
     */
    shapePadding?: number;

    /**
     * Options for customizing the color and width of the legend border.
     */
    border?: BorderModel;

    /**
     * Options for customizing the color and width of the shape border.
     */
    shapeBorder?: BorderModel;

    /**
     * To configure the title of the legend.
     */
    title?: CommonTitleSettingsModel;

    /**
     * Options for customizing text styles of the legend.
     */
    titleStyle?: FontModel;

    /**
     * Customize the legend position of the maps.
     * @default Bottom
     */
    position?: LegendPosition;

    /**
     * Customize the legend alignment of the maps.
     * @default Center
     */
    alignment?: Alignment;

    /**
     * Customize the legend items placed
     * @default None
     */
    orientation?: LegendArrangement;

    /**
     * Customize the legend placed by given x and y values. 
     */
    location?: Point;

    /**
     * Specifies the legend shape color
     */
    fill?: string;

    /**
     * Specifies the opacity of legend shape color
     * @default 1
     */
    opacity?: number;

    /**
     * Customize the legend mode.
     * @default Default
     */
    mode?: LegendMode;

    /**
     * Enable or disable the visibility of legend
     * @default null
     * @blazorProperty 'LegendPath'
     */
    showLegendPath?: string;

    /**
     * Bind the dataSource field for legend
     * @default null
     */
    valuePath?: string;

    /**
     * Removes the duplicate legend item
     * @default false
     */
    removeDuplicateLegend?: boolean;

    /**
     * Options for customizing the color and width of the selection.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

}

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
     * Toggle the data label visibility.
     * @default false
     */
    visible?: boolean;

    /**
     * Configures the label border
     */
    border?: BorderModel;

    /**
     * configure the fill
     */
    fill?: string;

    /**
     * configure the label opacity
     */
    opacity?: number;

    /**
     * rectangle rx 
     * @default 10
     */
    rx?: number;

    /**
     * ry value
     * @default 10
     */
    ry?: number;

    /**
     * Options for customizing text styles of the data label.
     */
    textStyle?: FontModel;

    /**
     * To customize the label path values.
     * @default ''
     */
    labelPath?: string;

    /**
     * To customize the smartLabels.
     * @default None
     */
    smartLabelMode?: SmartLabelMode;

    /**
     * intersection action
     * @default None
     */
    intersectionAction?: IntersectAction;

    /**
     * To customize the data label template.
     * @default ''
     */
    template?: string;

}

/**
 * Interface for a class ShapeSettings
 */
export interface ShapeSettingsModel {

    /**
     * To customize the fill color of the shape.
     * @default '#A6A6A6'
     */
    fill?: string;

    /**
     * To customize the palette of the shape.
     * @default []
     */
    palette?: string[];

    /**
     * Customize the radius for points
     */
    circleRadius?: number;

    /**
     * Options for customizing the color and width of the shape.
     */
    border?: BorderModel;

    /**
     * Dash array of line
     */
    dashArray?: string;

    /**
     * To customize the opacity of the shape.
     * @default 1
     */
    opacity?: number;

    /**
     * To customize the colorValuePath of the shape.
     * @default null
     */
    colorValuePath?: string;

    /**
     * To customize the valuePath of the shape.
     * @default null
     */
    valuePath?: string;

    /**
     * To configure shape colorMapping
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * Toggle the auto fill.
     * @default false
     */
    autofill?: boolean;

}

/**
 * Interface for a class MarkerBase
 */
export interface MarkerBaseModel {

    /**
     * Options for customizing the color and width of the marker.
     */
    border?: BorderModel;

    /**
     * Options for customizing the dash array options
     */
    dashArray?: string;

    /**
     * Toggle the visibility of the marker.
     * @default false
     */
    visible?: boolean;

    /**
     * To customize the fill color of the marker.
     * @default '#FF471A'
     */
    fill?: string;

    /**
     * To customize the height of the marker.
     * @default 10
     */
    height?: number;

    /**
     * To customize the width of the marker.
     * @default 10
     */
    width?: number;

    /**
     * To customize the opacity of the marker.
     * @default 1
     */
    opacity?: number;

    /**
     * To customize the color of marker from marker dataSource.
     * @default null
     */
    colorValuePath?: string;

    /**
     * To customize the shape of marker from marker dataSource.
     * @default null
     */
    shapeValuePath?: string;

    /**
     * To customize the shape image of marker from marker dataSource.
     * @default null
     */
    imageUrlValuePath?: string;

    /**
     * To customize the shape of the marker.
     * @default Balloon
     */
    shape?: MarkerType;

    /**
     * To provide the dataSource field to display legend text
     * @default ''
     */
    legendText?: string;

    /**
     * To move the marker by setting offset values
     */
    offset?: Point;

    /**
     * To provide the image url for rendering marker image
     */
    imageUrl?: string;

    /**
     * To customize the template of the marker.
     * @default null
     */
    template?: string;

    /**
     * * Specifies datasource for the marker.
     * * The datasource for the marker will contain latitude and longitude values to specify the location 
     * of the marker.
     * * The datasource can contain data such as color, shape, and other details that can be bound to the color, shape,
     *  and tooltip of the marker.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: Object[];

    /**
     * To configure the tooltip settings of the maps marker.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Animation duration time
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Animation delay time
     * @default 0
     */
    animationDelay?: number;

    /**
     * To configure the selection settings of the maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * To configure the highlight settings of the maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class MarkerSettings
 */
export interface MarkerSettingsModel extends MarkerBaseModel{

}

/**
 * Interface for a class LayerSettings
 */
export interface LayerSettingsModel {

    /**
     * Specifies the shape data for the layer.
     * @isdatamanager false
     * @default null
     */
    shapeData?: Object | DataManager | MapAjax;

    /**
     * Specifies the query to select particular data from the shape data. 
     * This property is applicable only when the DataSource is `ej.DataManager`.
     * @default null
     */
    query?: Query;

    /**
     * Specifies the shape properties 
     */
    shapeSettings?: ShapeSettingsModel;

    /**
     * * Specifies dataSource for the layer.
     * * The datasource can contain data that can be bound to the tooltip, marker, and bubble.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: Object[] | DataManager | MapAjax;

    /**
     * Specifies the type for the layer.
     * @default Layer
     */
    type?: Type;

    /**
     * Specifies the geometry type
     * @default Geographic
     */
    geometryType?: GeometryType;

    /**
     * Specifies the type for the bing map.
     * @default Aerial
     */
    bingMapType?: BingMapType;

    /**
     * Specifies the type for the static map.
     * @default RoadMap
     */
    staticMapType?: StaticMapType;

    /**
     * Specifies the key for the layer.
     * @default ''
     */
    key?: string;

    /**
     * Specifies the layerType for the layer.
     * @default Geometry
     */
    layerType?: ShapeLayerType;

    /**
     * Specifies the urlTemplate for the layer.
     * @default 'https://a.tile.openstreetmap.org/level/tileX/tileY.png'
     */
    urlTemplate?: string;

    /**
     * Toggle the visibility of the layers.
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies the shapeDataPath for the layer.
     * @default 'name'
     */
    shapeDataPath?: string;

    /**
     * Specifies the shapePropertyPath for the layer.
     * @default 'name'
     */
    shapePropertyPath?: string | string[];

    /**
     * Specifies the animation duration for the layer.
     * @default 0
     */
    animationDuration?: number;

    /**
     * To configure the marker settings.
     */
    markerSettings?: MarkerSettingsModel[];

    /**
     * To configure the cluster settings.
     */
    markerClusterSettings?: MarkerClusterSettingsModel;

    /**
     * To configure the datalabel settings of the maps.
     */
    dataLabelSettings?: DataLabelSettingsModel;

    /**
     * To configure the bubble settings of the maps.
     */
    bubbleSettings?: BubbleSettingsModel[];

    /**
     * navigationLineSetting
     */
    navigationLineSettings?: NavigationLineSettingsModel[];

    /**
     * To configure the tooltip settings of the maps layer.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * To configure the selection settings of the maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * To configure the highlight settings of the maps.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * To configure the legend toggle settings.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

    /**
     * To select the shape at the rendering time.
     */
    initialShapeSelection?: InitialShapeSelectionSettingsModel[];

}

/**
 * Interface for a class Tile
 */
export interface TileModel {

}

/**
 * Interface for a class MapsAreaSettings
 */
export interface MapsAreaSettingsModel {

    /**
     * To configure maps area background color
     */
    background?: string;

    /**
     * Options for customizing the color and width of maps area.
     */
    border?: BorderModel;

}