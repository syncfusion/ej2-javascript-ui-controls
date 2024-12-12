import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Alignment, LegendPosition, LegendType, LegendMode, Type, MarkerType, Orientation, MapAjax } from '../../index';import { SmartLabelMode, IntersectAction } from '../../index';import { Theme } from './theme';import { Point, GeoLocation, Coordinate } from '../utils/helper';import { LegendArrangement, LegendShape, BubbleType, ToolbarItem } from '../utils/enum';import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Gets or sets the content for the annotation in maps.
     *
     * @default ''
     * @aspType string
     */
    content?: string | Function;

    /**
     * Gets or sets the x position of the annotation in pixel or percentage format.
     *
     * @default '0px'
     */
    x?: string;

    /**
     * Gets or sets the y position of the annotation in pixel or percentage format.
     *
     * @default '0px'
     */
    y?: string;

    /**
     * Gets or sets the type of the placement when the annotation is to be aligned vertically.
     *
     * @default None
     */
    verticalAlignment?: AnnotationAlignment;

    /**
     * Gets or sets the type of the placement when the annotation is to be aligned horizontally.
     *
     * @default None
     */
    horizontalAlignment?: AnnotationAlignment;

    /**
     * Gets or sets the z-index of the annotation in maps.
     *
     * @default '-1'
     */
    zIndex?: string;

}

/**
 * Interface for a class Arrow
 */
export interface ArrowModel {

    /**
     * Gets or sets the type of the position to place the arrow in navigation lines.
     *
     * @default 'Start'
     */
    position?: string;

    /**
     * Enables or disables the visibility of the arrow in navigation line.
     *
     * @default false
     */
    showArrow?: boolean;

    /**
     * Gets or sets the size of the arrow in navigation line in maps.
     *
     * @default 2
     */
    size?: number;

    /**
     * Gets or sets the color for the arrow in navigation line.
     *
     * @default 'black'
     */
    color?: string;

    /**
     * Gets or sets the offset value to position the arrow from the navigation line.
     *
     * @default 0
     */
    offSet?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Gets or sets the size for the text in data label, legend and other texts.
     */
    size?: string;

    /**
     * Gets or sets the color for the text in data label, legend and other texts in maps.
     */
    color?: string;

    /**
     * Gets or sets the font family of the text in data label, legend and other texts in maps.
     */
    fontFamily?: string;

    /**
     * Gets or sets the font weight of the text in data label, legend and other texts in maps.
     */
    fontWeight?: string;

    /**
     * Gets or sets the style of the text in data label, legend and other texts in maps.
     */
    fontStyle?: string;

    /**
     * Gets or sets the opacity for the text in data label, legend and other texts in maps.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class ZoomToolbarButtonSettings
 */
export interface ZoomToolbarButtonSettingsModel {

    /**
     * Gets or sets the fill color of the button.
     *
     * @default 'transparent'
     */
    fill?: string;

    /**
     * Gets or sets the color of the icons inside the button.
     *
     * @default null
     */
    color?: string;

    /**
     * Gets or sets the opacity of the border of the button in the zoom toolbar.
     *
     * @default 1
     */
    borderOpacity?: number;

    /**
     * Gets or sets the width of the border of the button in the zoom toolbar.
     *
     * @default 1
     */
    borderWidth?: number;

    /**
     * Gets or sets the color of the border of the button in the zoom toolbar.
     *
     * @default null
     */
    borderColor?: string;

    /**
     * Gets or sets the radius of the button. This property is used to modify the size of the button.
     *
     * @default null
     */
    radius?: number;

    /**
     * Gets or sets the color of the icons inside the button when selection is performed.
     *
     * @default null
     */
    selectionColor?: string;

    /**
     * Gets or sets the color for the button when the mouse has hovered on the same.
     *
     * @default null
     */
    highlightColor?: string;

    /**
     * Gets or sets the padding space between each button.
     *
     * @default 5
     */
    padding?: number;

    /**
     * Gets or sets the opacity of the button.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the items that should be displayed in the Maps zoom toolbar. By default, zoom-in, zoom-out, and reset buttons are visible. Other options include selection zoom and panning.
     *
     * @default ZoomIn
     */
    toolbarItems?: ToolbarItem[];

}

/**
 * Interface for a class ZoomToolbarTooltipSettings
 */
export interface ZoomToolbarTooltipSettingsModel {

    /**
     * Enables or disables the tooltip of the zoom toolbar.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Gets or sets the background color of the tooltip of the zoom toolbar.
     *
     * @default 'white'
     */
    fill?: string;

    /**
     * Gets or sets the opacity of the border of the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    borderOpacity?: number;

    /**
     * Gets or sets the width of the border of the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    borderWidth?: number;

    /**
     * Gets or sets the color of the border of the tooltip of the zoom toolbar.
     *
     * @default '#707070'
     */
    borderColor?: string;

    /**
     * Gets or sets the color of the text in the tooltip of the zoom toolbar.
     *
     * @default 'black'
     */
    fontColor?: string;

    /**
     * Gets or sets the font family of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    fontFamily?: string;

    /**
     * Gets or sets the font style of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    fontStyle?: string;

    /**
     * Gets or sets the font weight of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    fontWeight?: string;

    /**
     * Gets or sets the size of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    fontSize?: string;

    /**
     * Gets or sets the font opacity of the text in the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    fontOpacity?: number;

}

/**
 * Interface for a class ZoomToolbarSettings
 */
export interface ZoomToolbarSettingsModel {

    /**
     * Gets or sets the background color of the zoom toolbar.
     *
     * @default 'transparent'
     */
    backgroundColor?: string;

    /**
     * Gets or sets the opacity of the border of the zoom toolbar.
     *
     * @default 1
     */
    borderOpacity?: number;

    /**
     * Gets or sets the thickness of the border of the zoom toolbar.
     *
     * @default 1
     */
    borderWidth?: number;

    /**
     * Gets or sets the color of the border of the zoom toolbar.
     *
     * @default 'transparent'
     */
    borderColor?: string;

    /**
     * Gets or sets the placement of the zoom toolbar when it is placed horizontally.
     *
     * @default Far
     */
    horizontalAlignment?: Alignment;

    /**
     * Gets or sets the placement of the zoom toolbar when it is placed vertically.
     *
     * @default Near
     */
    verticalAlignment?: Alignment;

    /**
     * Gets or sets the orientation of the zoom toolbar.
     *
     * @default Horizontal
     */
    orientation?: Orientation;

    /**
     * Specifies the options to customize the buttons in the zoom toolbar.
     *
     */
    buttonSettings?: ZoomToolbarButtonSettingsModel;

    /**
     * Specifies the options to customize the tooltip in the zoom toolbar.
     *
     */
    tooltipSettings?: ZoomToolbarTooltipSettingsModel;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Gets or sets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     */
    color?: string;

    /**
     * Gets or sets the width of the border of the maps.
     */
    width?: number;

    /**
     * Gets or sets the opacity of the border of the maps.
     */
    opacity?: number;

}

/**
 * Interface for a class CenterPosition
 */
export interface CenterPositionModel {

    /**
     * Gets or sets the latitude of the center position of maps.
     *
     * @default null
     */
    latitude?: number;

    /**
     * Gets or sets the longitude of the center position of maps.
     *
     * @default null
     */
    longitude?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables the tooltip visibility of layers, markers, and bubbles in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the tooltip template of layers, markers, and bubbles in maps to display custom elements as tooltip.
     *
     * @default ''
     * @aspType string
     */
    template?: string | Function;

    /**
     * Gets or sets the color of the tooltip in layers, markers, and bubbles of maps.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Gets or sets the options for customizing the style properties of the border of the tooltip in layers, markers, and bubbles of maps.
     */
    border?: BorderModel;

    /**
     * Gets or sets the options for customizing the style of the text in tooltip for layers, markers, and bubbles of maps.
     */
    textStyle?: FontModel;

    /**
     * Gets or sets the format of the tooltip in layers, markers, and bubbles of maps.
     *
     * @default null
     */
    format?: string;

    /**
     * Gets or sets the field name from the data source based on which the tooltip is visible on layers, markers, and bubbles of maps.
     * For the layer tooltip, the field name from the GeoJSON data can also be set.
     *
     * @default null
     */
    valuePath?: string;

    /**
     * Specifies the value within which the tooltip will be removed on a mobile device. The value represents time in milliseconds.
     * If the value is set to 0, the tooltip will not be removed. If the value is set to greater than 0, the tooltip will be removed at the specified time.
     *
     * @default 2000
     */
    duration?: number;

}

/**
 * Interface for a class PolygonTooltipSettings
 */
export interface PolygonTooltipSettingsModel {

    /**
     * Shows or hides the tooltip of the polygon shapes. When this property is set as false, the tooltip for all the polygon shapes in a layer will not be visible.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the fill color for the tooltip of the polygon shape.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Gets or sets the attributes such as width, color and opacity of the border of the tooltip element of the polygon shape.
     */
    border?: BorderModel;

    /**
     * Gets or sets the font properties of the text content of the tooltip element of the polygon shape.
     */
    textStyle?: FontModel;

    /**
     * Specifies the value within which the tooltip will be removed on a mobile device. The value represents time in milliseconds.
     * If the value is set to 0, the tooltip will not be removed. If the value is set to greater than 0, the tooltip will be removed at the specified time.
     *
     * @default 2000
     */
    duration?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Gets or sets the left margin of maps.
     *
     * @default 10
     */
    left?: number;

    /**
     * Gets or sets the right margin of maps.
     *
     * @default 10
     */
    right?: number;

    /**
     * Gets or sets the top margin of maps.
     *
     * @default 10
     */
    top?: number;

    /**
     * Gets or sets the bottom margin of maps.
     *
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class ConnectorLineSettings
 */
export interface ConnectorLineSettingsModel {

    /**
     * Gets or sets the color for connector line between the markers in marker cluster.
     *
     * @default '#000000'
     */
    color?: string;

    /**
     * Gets or sets the line width for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    width?: number;

    /**
     * Gets or sets the opacity for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class MarkerClusterSettings
 */
export interface MarkerClusterSettingsModel {

    /**
     * Enables or disables the visibility of the cluster of markers in the maps.
     *
     * @default false
     */
    allowClustering?: boolean;

    /**
     * Enables or disables intense marker clustering for improved accuracy.
     * The default value is true, and clustering logic will be executed twice for improved accuracy.
     * If set to false, the clustering logic will only be executed once, increasing performance while maintaining decent accuracy.
     *
     * @default true
     */
    allowDeepClustering?: boolean;

    /**
     * Gets or sets the options for customizing the style properties of the border of the clusters in maps.
     */
    border?: BorderModel;

    /**
     * Gets or sets the fill color of the cluster.
     *
     * @default '#D2691E'
     */
    fill?: string;

    /**
     * Gets or sets the opacity of the marker cluster.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets shape of the marker cluster.
     *
     * @default Rectangle
     */
    shape?: MarkerType;

    /**
     * Gets or sets the width of the marker cluster in maps.
     *
     * @default 12
     */
    width?: number;

    /**
     * Gets or sets the height of the marker cluster in maps.
     *
     * @default 12
     */
    height?: number;

    /**
     * Gets or sets the offset value to position the marker cluster from the intended position in maps.
     */
    offset?: Point;

    /**
     * Gets or sets the URL path for the marker cluster when the cluster shape is set as image in maps.
     *
     * @default ''
     */
    imageUrl?: string;

    /**
     * Gets or sets the dash array for the marker cluster in maps.
     *
     * @default ''
     */
    dashArray?: string;

    /**
     * Gets or sets the options to customize the label text in marker cluster.
     */
    labelStyle?: FontModel;

    /**
     * Enables or disables the expanding of the clusters when many markers are in same location.
     *
     * @default false
     */
    allowClusterExpand?: boolean;

    /**
     * Gets or sets the options to customize the connector line which is visible on cluster expand.
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
     * Gets or sets the value from where the range for the color-mapping starts.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    from?: number;

    /**
     * Gets or sets the value to where the range for the color-mapping ends.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    to?: number;

    /**
     * Gets or sets the value from the data source to map the corresponding colors to the shapes.
     *
     * @default null
     */
    value?: string;

    /**
     * Gets or sets the color for the color-mapping in maps.
     *
     * @default null
     */
    color?: string | string[];

    /**
     * Gets or sets the minimum opacity for the color-mapping in maps.
     *
     * @default null
     */
    minOpacity?: number;

    /**
     * Gets or sets the maximum opacity for the color-mapping in maps.
     *
     * @default null
     */
    maxOpacity?: number;

    /**
     * Gets or sets the label for the color-mapping to display in the legend item text.
     *
     * @default null
     */
    label?: string;

    /**
     * Enables or disables the visibility of legend for the corresponding color-mapped shapes in maps.
     *
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class InitialMarkerSelectionSettings
 */
export interface InitialMarkerSelectionSettingsModel {

    /**
     * Specifies the latitude of the marker to be selected.
     *
     * @default null
     */
    latitude?: number;

    /**
     * Specifies the longitude of the marker to be selected.
     *
     * @default null
     */
    longitude?: number;

}

/**
 * Interface for a class InitialShapeSelectionSettings
 */
export interface InitialShapeSelectionSettingsModel {

    /**
     * Gets or sets the property name from the data source in maps.
     *
     * @default null
     */
    shapePath?: string;

    /**
     * Gets or sets the value from the data source which is bound to the shape in maps.
     *
     * @default null
     */
    shapeValue?: string;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Enables or disables the selection for the layers, markers and bubbles in maps.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Gets or sets the color for the shape that is selected.
     *
     * @default null
     */
    fill?: string;

    /**
     * Gets or sets the opacity for the shape that is selected.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Enables or disables the selection of multiple shapes in maps.
     *
     * @default false
     */
    enableMultiSelect?: boolean;

    /**
     * Gets or sets the options for customizing the color and width of the border of selected shapes in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Gets or sets the color for the shapes on which the mouse has hovered in maps.
     *
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables the highlight functionality of the layers in maps.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Gets or sets the opacity for the highlighted shapes in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the options for customizing the style properties of the border of the highlighted shapes in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class PolygonSetting
 */
export interface PolygonSettingModel {

    /**
     * Gets or sets the width of the border of the polygon shape.
     *
     * @default 1
     */
    borderWidth?: number;

    /**
     * Gets or sets the opacity of the border of the polygon shape.
     *
     * @default 1
     */
    borderOpacity?: number;

    /**
     * Gets or sets the opacity of the polygon shape.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the color to be used in the border of the polygon shape.
     *
     * @default 'black'
     */
    borderColor?: string;

    /**
     * Gets or sets the color to be filled in the polygon shape.
     *
     * @default 'black'
     */
    fill?: string;

    /**
     * Gets or sets the points that define the polygon shape.
     * This property holds a collection of coordinates that define the polygon shape.
     *
     * @default []
     */
    points?: Coordinate[];

    /**
     * Specifies the tooltip text to be displayed for the polygon shape. If it is not set, the tooltip will not be displayed.
     *
     * @default ''
     */
    tooltipText?: string;

    /**
     * Specifies any HTML content as a tooltip on the polygon shape. If it is not set, the tooltip will not be displayed.
     *
     * @default ''
     * @aspType string
     */
    tooltipTemplate?: string | Function;

}

/**
 * Interface for a class PolygonSettings
 */
export interface PolygonSettingsModel {

    /**
     * Gets or sets the properties of all the polygon shapes that will be displayed in a layer.
     */
    polygons?: PolygonSettingModel[];

    /**
     * Gets or sets the properties for selecting polygon shapes in a map layer.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Gets or sets the properties for highlighting polygon shapes in a map layer.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Specifies the properties such as visibility, fill, border and text style to customize the tooltip.
     */
    tooltipSettings?: PolygonTooltipSettingsModel;

}

/**
 * Interface for a class NavigationLineSettings
 */
export interface NavigationLineSettingsModel {

    /**
     * Enables or disables the navigation lines to be drawn in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the width of the navigation lines in maps.
     *
     * @default 1
     */
    width?: number;

    /**
     * Gets or sets the longitude for the navigation lines to be drawn in maps.
     *
     * @default []
     */
    longitude?: number[];

    /**
     * Gets or sets the latitude value for the navigation lines to be drawn in maps.
     *
     * @default []
     */
    latitude?: number[];

    /**
     * Gets or sets the dash-array for the navigation lines drawn in maps.
     *
     * @default ''
     */
    dashArray?: string;

    /**
     * Gets or sets the color for the navigation lines in maps.
     *
     * @default 'black'
     */
    color?: string;

    /**
     * Gets or sets the angle of the curve connecting different locations in maps.
     *
     * @default 0
     */
    angle?: number;

    /**
     * Gets or sets the options to customize the arrow for the navigation line in maps.
     */
    arrowSettings?: ArrowModel;

    /**
     * Gets or sets the selection settings of the navigation line in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Gets or sets the highlight settings of the navigation line in maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class BubbleSettings
 */
export interface BubbleSettingsModel {

    /**
     * Gets or sets the options to customize the style properties of the border for the bubbles in maps.
     */
    border?: BorderModel;

    /**
     * Enables or disables the visibility of the bubbles in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the data source for the bubble.
     * The data source must contain the size value of the bubble that can be bound to the bubble
     * of the maps using the `valuePath` property in the `bubbleSettings`.
     * The data source can contain data such as color and other informations that can be bound to the bubble and tooltip of the bubble.
     *
     * @isObservable true
     * @default []
     */
    dataSource?: Object[] | DataManager;

    /**
     * Gets or sets the query to select particular data from the bubble data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    query?: Query;

    /**
     * Gets or sets the duration for the animation of the bubbles in maps.
     *
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Gets or sets the delay in animation for the bubbles in maps.
     *
     * @default 0
     */
    animationDelay?: number;

    /**
     * Gets or sets the color for the bubbles in maps.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Gets or sets the minimum radius for the bubbles in maps.
     *
     * @default 10
     */
    minRadius?: number;

    /**
     * Gets or sets the maximum radius for the bubbles in maps.
     *
     * @default 20
     */
    maxRadius?: number;

    /**
     * Gets or sets the opacity of the bubbles in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the field name from the data source of bubble settings based on which the bubbles are rendered on the maps.
     *
     * @default null
     */
    valuePath?: string;

    /**
     * Gets or sets the type of the bubble in maps.
     *
     * @default Circle
     */
    bubbleType?: BubbleType;

    /**
     * Gets or sets the field name from the data source of bubble settings to set the color for each bubble in maps.
     *
     * @default null
     */
    colorValuePath?: string;

    /**
     * Gets or sets the color-mapping for the bubbles in maps.
     *
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * Gets or sets the options to customize the tooltip of the bubbles in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Gets or sets the options to customize the selection of the bubbles in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Gets or sets the options to customize the highlight of the bubbles in maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class CommonTitleSettings
 */
export interface CommonTitleSettingsModel {

    /**
     * Gets or sets the text for the title in maps.
     *
     * @default ''
     */
    text?: string;

    /**
     * Gets or sets the description of the title in maps for assistive technology.
     *
     * @default ''
     */
    description?: string;

}

/**
 * Interface for a class SubTitleSettings
 */
export interface SubTitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Gets or sets the options for customizing the text in the subtitle of the maps.
     */
    textStyle?: FontModel;

    /**
     * Gets or sets the alignment of the subtitle of the maps.
     *
     * @default Center
     */
    alignment?: Alignment;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Gets or sets the options for customizing the text of the title in maps.
     */
    textStyle?: FontModel;

    /**
     * Gets or sets the alignment of the title of the maps.
     *
     * @default Center
     */
    alignment?: Alignment;

    /**
     * Gets or sets the options to customize the subtitle of the maps.
     */
    subtitleSettings?: SubTitleSettingsModel;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * Enables or disables the zooming operation in the maps.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Enables or disables the panning operation in the maps.
     *
     * @default true
     */
    enablePanning?: boolean;

    /**
     * Enables or disables the selection zooming operation in the maps.
     *
     * @default true
     */
    enableSelectionZooming?: boolean;

    /**
     * Enables or disables the mouse wheel zooming in maps.
     *
     * @default true
     */
    mouseWheelZoom?: boolean;

    /**
     * Enables or disables the double click zooming in maps.
     *
     * @default false
     */
    doubleClickZoom?: boolean;

    /**
     * Enables or disables the pinch zooming in maps.
     *
     * @default true
     */
    pinchZooming?: boolean;

    /**
     * Enables or disables the zooming on clicking the shapes in maps.
     *
     * @default false
     */
    zoomOnClick?: boolean;

    /**
     * Gets or sets the factor of zoom to be displayed while rendering the maps.
     *
     * @default 1
     */
    zoomFactor?: number;

    /**
     * Gets or sets the maximum zooming value in maps.
     *
     * @default 10
     */
    maxZoom?: number;

    /**
     * Gets or sets the minimum zooming value in maps.
     *
     * @default 1
     */
    minZoom?: number;

    /**
     * Enables or disables the ability to zoom based on the marker position while rendering the maps.
     *
     * @default false
     */
    shouldZoomInitially?: boolean;

    /**
     * Enables or disables the zoom to set to the initial State.
     *
     * @default true
     */
    resetToInitial?: boolean;

    /**
     * Gets or sets the detailed options to customize the entire zoom toolbar.
     */
    toolbarSettings?: ZoomToolbarSettingsModel;

}

/**
 * Interface for a class ToggleLegendSettings
 */
export interface ToggleLegendSettingsModel {

    /**
     * Enables or disables the legend to be toggled.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Specifies whether the property of the shape settings is to be set while toggling the legend item.
     *
     * @default true
     */
    applyShapeSettings?: boolean;

    /**
     * Gets or sets the opacity for the shape of the legend item which is toggled.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the color of the shape of the legend item which is toggled.
     *
     * @default ''
     */
    fill?: string;

    /**
     * Gets or sets the options to customize the style properties of the border for the shape in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Enables or disables to render the legend item based on the shapes from the data source of markers.
     *
     * @default false
     */
    useMarkerShape?: boolean;

    /**
     * Enables or disables the toggle visibility of the legend in maps.
     *
     * @default false
     */
    toggleVisibility?: boolean;

    /**
     * Enables or disables the visibility of the legend in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the background color for the legend in maps.
     *
     * @default 'transparent'
     */
    background?: string;

    /**
     * Gets or sets the type of the legend in maps.
     *
     * @default Layers
     */
    type?: LegendType;

    /**
     * Enables or disables the visibility of the inverted pointer in interactive legend in maps.
     *
     * @default false
     */
    invertedPointer?: boolean;

    /**
     * Gets or sets the position of the label in legend.
     *
     * @default After
     */
    labelPosition?: LabelPosition;

    /**
     * Gets or sets the action to perform when the legend item text intersects with others.
     *
     * @default None
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Gets or sets the shape of the legend in maps.
     *
     * @default Circle
     */
    shape?: LegendShape;

    /**
     * Gets or sets the width of the legend in maps.
     *
     * @default ''
     */
    width?: string;

    /**
     * Gets or sets the height of the legend in maps.
     *
     * @default ''
     */
    height?: string;

    /**
     * Gets or sets the options for customizing the text styles of the legend item text in maps.
     */
    textStyle?: FontModel;

    /**
     * Gets or sets the width of the shapes in legend.
     *
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Gets or sets the height of the shapes in legend.
     *
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Gets or sets the padding for the shapes in legend.
     *
     * @default 10
     */
    shapePadding?: number;

    /**
     * Gets or sets the options for customizing the style properties of the legend border.
     */
    border?: BorderModel;

    /**
     * Gets or sets the options for customizing the style properties of the border of the shapes of the legend items.
     */
    shapeBorder?: BorderModel;

    /**
     * Gets or sets the title for the legend in maps.
     */
    title?: CommonTitleSettingsModel;

    /**
     * Gets or sets the options for customizing the style of the title of the legend in maps.
     */
    titleStyle?: FontModel;

    /**
     * Gets or sets the position of the legend in maps.
     *
     * @default Bottom
     */
    position?: LegendPosition;

    /**
     * Gets or sets the alignment of the legend in maps.
     *
     * @default Center
     */
    alignment?: Alignment;

    /**
     * Gets or sets the orientation of the legend in maps.
     *
     * @default None
     */
    orientation?: LegendArrangement;

    /**
     * Gets or sets the location of the legend in pixels when the legend position is set as `Float`.
     */
    location?: Point;

    /**
     * Gets or sets the color of the legend in maps.
     *
     * @default null
     */
    fill?: string;

    /**
     * Gets or sets the opacity for the legend in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the mode of the legend in maps. The modes available are default and interactive modes.
     *
     * @default Default
     */
    mode?: LegendMode;

    /**
     * Gets or sets the field name from the data source which is used to provide visibility state for each legend item.
     *
     * @default null
     */
    showLegendPath?: string;

    /**
     * Set and gets the field name from the data source to display the legend item text.
     *
     * @default null
     */
    valuePath?: string;

    /**
     * Enables or disables the ability to remove the duplicate legend item.
     *
     * @default false
     */
    removeDuplicateLegend?: boolean;

    /**
     * Gets or sets the options for customizing the color and border width of the shape related to the legend when selecting the legend.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

}

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
     * Enables or disables the visibility of data labels in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Gets or sets the options for customizing the style properties of the border of the data labels.
     */
    border?: BorderModel;

    /**
     * Gets or sets the background color for the data labels in maps.
     *
     * @default 'black'
     */
    fill?: string;

    /**
     * Gets or sets the opacity of the data labels in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the x position for the data labels.
     *
     * @default 10
     */
    rx?: number;

    /**
     * Gets or sets the y position for the data labels in maps.
     *
     * @default 10
     */
    ry?: number;

    /**
     * Gets or sets the options for customizing the styles of the text in data labels.
     */
    textStyle?: FontModel;

    /**
     * Gets or sets the field name from the data source based on which the data labels gets rendered.
     * The field name from the GeoJSON data can also be set.
     *
     * @default ''
     */
    labelPath?: string;

    /**
     * Gets or sets the action to be performed when the data labels exceeds the shape over which it is rendered.
     *
     * @default None
     */
    smartLabelMode?: SmartLabelMode;

    /**
     * Gets or sets the action to be performed when a data-label intersect with other data labels in maps.
     *
     * @default None
     */
    intersectionAction?: IntersectAction;

    /**
     * Gets or sets the template for the data labels to render custom elements.
     *
     * @default ''
     * @aspType string
     */
    template?: string | Function;

    /**
     * Gets and sets the duration time for animating the data label.
     *
     * @default 0
     */
    animationDuration?: number;

}

/**
 * Interface for a class ShapeSettings
 */
export interface ShapeSettingsModel {

    /**
     * Gets or sets the color of the shapes in maps.
     *
     * @default null
     */
    fill?: string;

    /**
     * Gets or sets a set of colors for the shapes in maps.
     *
     * @default []
     */
    palette?: string[];

    /**
     * Gets or sets the radius of the "Point" and "MultiPoint" geometry shapes.
     * This property will be applicable only when the GeoJSON data has "Point" and "MultiPoint" geometry types.
     */
    circleRadius?: number;

    /**
     * Gets or sets the options for customizing the style properties of the border for the shapes in maps.
     */
    border?: BorderModel;

    /**
     * Gets or sets the dash-array for the shapes in maps.
     */
    dashArray?: string;

    /**
     * Gets or sets the opacity for the shapes in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the field name from the data source to set the color for the shapes in maps.
     *
     * @default null
     */
    colorValuePath?: string;

    /**
     * Gets or sets the field name from the data source to set the color for the border of a particular shape in maps.
     *
     * @default null
     */
    borderColorValuePath?: string;

    /**
     * Gets or sets the field name from the data source to set the width for the border of a particular shape in maps.
     *
     * @default null
     */
    borderWidthValuePath?: string;

    /**
     * Gets or sets the value from the data source based on which the shape gets rendered.
     *
     * @default null
     */
    valuePath?: string;

    /**
     * Gets or sets the options to map the color for some set of the shapes in maps.
     *
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * Enables or disables the filling of color, based on the palette, for the shapes automatically.
     *
     * @default false
     */
    autofill?: boolean;

}

/**
 * Interface for a class MarkerBase
 */
export interface MarkerBaseModel {

    /**
     * Gets or sets the options for customizing the style properties of the border of the marker in maps.
     */
    border?: BorderModel;

    /**
     * Gets or sets the dash-array for the marker.
     */
    dashArray?: string;

    /**
     * Enables or disables the visibility of the markers in maps.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Enables or disables marker drag and drop functionality at any location on the map.
     *
     * @default false
     */
    enableDrag?: boolean;

    /**
     * Gets or sets the color for the marker in maps.
     *
     * @default '#FF471A'
     */
    fill?: string;

    /**
     * Gets or sets the field name from the data source that determines the marker height.
     *
     * @default null
     */
    heightValuePath?: string;

    /**
     * Gets or sets the field name from the data source that determines the marker width.
     *
     * @default null
     */
    widthValuePath?: string;

    /**
     * Gets or sets the height of the marker in maps.
     *
     * @default 10
     */
    height?: number;

    /**
     * Gets or sets the width of the marker in maps.
     *
     * @default 10
     */
    width?: number;

    /**
     * Gets or sets the opacity for the marker in maps.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Gets or sets the field name from the marker data source based on which the color is applied for the marker.
     *
     * @default null
     */
    colorValuePath?: string;

    /**
     * Gets or sets the field name from the marker data source based on which the shape for individual markers are set.
     *
     * @default null
     */
    shapeValuePath?: string;

    /**
     * Gets or sets the field name from the marker data source based on which the image source for the image type marker is got individually.
     *
     * @default null
     */
    imageUrlValuePath?: string;

    /**
     * Gets or sets the shape of the marker in maps.
     *
     * @default Balloon
     */
    shape?: MarkerType;

    /**
     * Gets or sets the field name from the marker data source to render legend item text for the marker legend.
     *
     * @default ''
     */
    legendText?: string;

    /**
     * Gets or sets the offset value from which the marker must be rendered from the intended position.
     *
     */
    offset?: Point;

    /**
     * Gets or sets the URL for rendering the marker as image. This property acts as image source for all the markers in a marker settings.
     */
    imageUrl?: string;

    /**
     * Gets or sets the template for the marker to render custom elements.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Gets or sets the data source for the marker.
     * The data source for the marker will contain latitude and longitude values to specify the location
     * of the marker.
     * The data source can contain data such as color, shape, and other details that can be bound to the color, shape,
     * and tooltip of the marker.
     *
     * @isObservable true
     * @default []
     */
    dataSource?: Object[] | DataManager;

    /**
     * Gets or sets the query to select particular data from the marker data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    query?: Query;

    /**
     * Gets or sets the options to customize the tooltip of the marker in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Gets or sets the duration time for animating the marker.
     *
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Gets or sets the delay time for the animation in marker.
     *
     * @default 0
     */
    animationDelay?: number;

    /**
     * Gets or sets the options to customize the marker while selecting the marker in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Gets or sets the options to customize the marker when the mouse hovers over the markers in maps.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Defines the field name from the marker data source for setting latitude for a set of markers.
     */
    latitudeValuePath?: string;

    /**
     * Defines the field name from the marker data source for setting longitude for a set of markers.
     */
    longitudeValuePath?: string;

    /**
     * Gets or sets the options to select the markers at the initial rendering time of the maps.
     * The initial selection of markers will be performed only when the selection functionality of marker is enabled.
     */
    initialMarkerSelection?: InitialMarkerSelectionSettingsModel[];

    /**
     * Gets or sets the options for customizing the clustering of markers on the map.
     * This property is used to cluster markers based on the current marker settings, and it is applied only when the `allowClustering` property is enabled.
     */
    clusterSettings?: MarkerClusterSettingsModel;

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
     * Gets or sets the data for the maps to render.
     * The data is normally JSON object with GeoJSON format that defines the shapes and geometries of the map.
     *
     * @isObservable true
     * @default null
     */
    shapeData?: Object | DataManager | MapAjax;

    /**
     * Gets or sets the query to select particular data from the layer data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    query?: Query;

    /**
     * Gets or sets the options to customize the shape of the maps.
     */
    shapeSettings?: ShapeSettingsModel;

    /**
     * Gets or sets the data source for the layer.
     * The data bound to the shapes using data source can be used to display the tooltip, marker, and bubble.
     *
     * @isObservable true
     * @default []
     */
    dataSource?: Object[] | DataManager | MapAjax;

    /**
     * Gets or sets the type of the layer in maps. There are two types: Layer and SubLayer.
     *
     * @default Layer
     */
    type?: Type;

    /**
     * Gets or sets the geometry type for the layer in maps. There are two types: Geographic and Normal.
     * - Geographic type renders the shape maps with geographical coordinate system.
     * - Normal type renders the shape maps using default coordinate system.
     *
     * @default Geographic
     */
    geometryType?: GeometryType;

    /**
     * Gets or sets the URL of the online map providers.
     * The online map providers will be rendered only when the shape data is not set and layer type is set with default value.
     *
     * @default ''
     */
    urlTemplate?: string;

    /**
     * Enables or disables the visibility of the layers in maps.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Gets or sets the field name from the GeoJSON data to map the shape to the data defined in the layer data source.
     *
     * @default 'name'
     */
    shapeDataPath?: string;

    /**
     * Gets or sets the field name from the data source to map the shape to the data defined in the layer data source.
     *
     * @default 'name'
     */
    shapePropertyPath?: string | string[];

    /**
     * Gets or sets the duration of the animation of layers when the zooming is performed in maps.
     *
     * @default 0
     */
    animationDuration?: number;

    /**
     * Gets or sets the options for customizing the markers in maps.
     */
    markerSettings?: MarkerSettingsModel[];

    /**
     * Gets or sets the options for customizing the cluster of markers in maps.
     */
    markerClusterSettings?: MarkerClusterSettingsModel;

    /**
     * Gets or sets the options for customizing the data labels in maps.
     */
    dataLabelSettings?: DataLabelSettingsModel;

    /**
     * Gets or sets the options for customizing the bubbles in maps.
     */
    bubbleSettings?: BubbleSettingsModel[];

    /**
     * Gets or sets the options for customizing the navigation lines in maps.
     */
    navigationLineSettings?: NavigationLineSettingsModel[];

    /**
     * Gets or sets the properties of the polygon shapes that will be rendered on a map layer.
     * The selection and highlight settings for polygon shapes can also be defined.
     */
    polygonSettings?: PolygonSettingsModel;

    /**
     * Gets or sets the options for customizing the tooltip of the layers in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Gets or sets the options for customizing the shapes when clicking on the shapes in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Gets or sets the options for customizing the shapes when the mouse hovers over maps.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Gets or sets the options for customizing the toggle state of shapes when selecting the legend in maps.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

    /**
     * Gets or sets the settings for the shapes to be selected when the maps rendering initially.
     * The initial selection of shapes will be performed only when the selection functionality of layer is enabled.
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
     * Gets or sets the background color for the map area.
     *
     * @default null
     */
    background?: string;

    /**
     * Gets or sets the options for customizing the style properties of the border of maps area.
     */
    border?: BorderModel;

}