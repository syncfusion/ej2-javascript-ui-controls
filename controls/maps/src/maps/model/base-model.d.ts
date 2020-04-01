import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { DataManager, Query } from '@syncfusion/ej2-data';import { Alignment, LegendPosition, LegendType, LegendMode, ShapeLayerType, Type, MarkerType, Orientation, MapAjax } from '../../index';import { SmartLabelMode, IntersectAction } from '../../index';import { Theme } from './theme';import { Point, GeoLocation } from '../utils/helper';import { BingMapType, LegendArrangement, LegendShape, BubbleType, StaticMapType } from '../utils/enum';import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';

/**
 * Interface for a class Annotation
 */
export interface AnnotationModel {

    /**
     * Sets and gets the content for the annotation in maps component.
     */
    content?: string;

    /**
     * Sets and gets the x position of the annotation in maps component.
     */
    x?: string;

    /**
     * Sets and gets the y position of the annotation in maps component.
     */
    y?: string;

    /**
     * Sets and gets the annotation element to be aligned vertically.
     * @default None
     */
    verticalAlignment?: AnnotationAlignment;

    /**
     * Sets and gets the annotation element to be aligned horizontally.
     * @default None
     */
    horizontalAlignment?: AnnotationAlignment;

    /**
     * Sets and gets the z-index of the annotation in maps component.
     * @default '-1'
     */
    zIndex?: string;

}

/**
 * Interface for a class Arrow
 */
export interface ArrowModel {

    /**
     * Sets and gets the type of the position to place the arrow in navigation lines.
     */
    position?: string;

    /**
     * Enables or disables the visibility state of the arrow in navigation line.
     */
    showArrow?: boolean;

    /**
     * Sets and gets the size of the arrow in navigation line in maps.
     */
    size?: number;

    /**
     * Sets and gets the color for the arrow in navigation line.
     */
    color?: string;

    /**
     * Sets and gets the offset value to position the arrow in navigation line.
     */
    offSet?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Sets and gets the size for the text in data label, legend and other texts.
     */
    size?: string;

    /**
     * Sets and gets the color for the text in data label, legend and other texts in maps component.
     */
    color?: string;

    /**
     * Sets and gets the style of the text in data label, legend and other texts in maps component.
     */
    fontFamily?: string;

    /**
     * Sets and gets the font weight of the text in data label, legend and other texts in maps component.
     */
    fontWeight?: string;

    /**
     * Sets and gets the style of the text in data label, legend and other texts in maps component.
     */
    fontStyle?: string;

    /**
     * Sets and gets the opacity for the text in data label, legend and other texts in maps component.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Sets and gets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     */
    color?: string;

    /**
     * Sets and gets the width of the border in maps.
     */
    width?: number;

}

/**
 * Interface for a class CenterPosition
 */
export interface CenterPositionModel {

    /**
     * Sets and gets the latitude for the center position of maps.
     * @default null
     */
    latitude?: number;

    /**
     * Sets and gets the longitude for the center position of maps.
     * @default null
     */
    longitude?: number;

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables the tooltip visibility for layers, markers, and bubbles in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the tooltip template for layers, markers, and bubbles in maps.
     * @default ''
     */
    template?: string;

    /**
     * Sets and gets the color of the tooltip in layers, markers, and bubbles of maps.
     */
    fill?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the tooltip in layers, markers, and bubbles of maps.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the style of the text in tooltip for layers, markers, and bubbles of maps.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the format of the tooltip in layers, markers, and bubbles of maps.
     * @default null
     */
    format?: string;

    /**
     * Sets and gets the value from the data source based on which the tooltip is visible on layers, markers, and bubbles of maps.
     * @default null
     */
    valuePath?: string;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Sets and gets the left margin for maps.
     * @default 10
     */
    left?: number;

    /**
     * Sets and gets the right margin for maps.
     * @default 10
     */
    right?: number;

    /**
     * Sets and gets the top margin for maps.
     * @default 10
     */
    top?: number;

    /**
     * Sets and gets the bottom margin for maps.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class ConnectorLineSettings
 */
export interface ConnectorLineSettingsModel {

    /**
     * Sets and gets the color for connector line between the markers in marker cluster.
     * @default '#000000'
     */
    color?: string;

    /**
     * Sets and gets the line width for connector line between the markers in marker cluster.
     * @default 1
     */
    width?: number;

    /**
     * Sets and gets the opacity for connector line between the markers in marker cluster.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class MarkerClusterSettings
 */
export interface MarkerClusterSettingsModel {

    /**
     * Enables or disables the visibility state of the clustering of markers in the maps component.
     * @default false
     */
    allowClustering?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border of cluster in maps.
     */
    border?: BorderModel;

    /**
     * Sets and gets the fill color of the cluster.
     * @default '#D2691E'
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the marker cluster.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets shape for the cluster of markers.
     * @default Rectangle
     */
    shape?: MarkerType;

    /**
     * Sets and gets the width of the marker cluster in maps.
     * @default 12
     */
    width?: number;

    /**
     * Sets and gets the height of the marker cluster in maps.
     * @default 12
     */
    height?: number;

    /**
     * Sets and gets the offset position for the marker cluster in maps.
     */
    offset?: Point;

    /**
     * Sets and gets the URL path for the marker cluster when the cluster shape is set as image in maps.
     */
    imageUrl?: string;

    /**
     * Sets and gets the dash array for the marker cluster in maps.
     *  @default ''
     */
    dashArray?: string;

    /**
     * Sets and gets the options to customize the text in marker cluster.
     */
    labelStyle?: FontModel;

    /**
     * Enables or disables the cluster expand when many markers are in same location.
     * @default false
     */
    allowClusterExpand?: boolean;

    /**
     * Sets and gets the options to customize the connector line in cluster separating the markers.
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
     * Sets and gets the value from where the range color-mapping starts.
     * @aspDefaultValueIgnore
     * @default null
     * @isBlazorNullableType true
     */
    from?: number;

    /**
     * Sets and gets the value to where the range color-mapping ends.
     * @aspDefaultValueIgnore
     * @default null
     * @isBlazorNullableType true
     */
    to?: number;

    /**
     * Sets and gets the value for the color-mapping from the data source.
     * @default null
     */
    value?: string;

    /**
     * Sets and gets the color for the color-mapping in maps.
     * @default null
     */
    color?: string | string[];

    /**
     * Sets and gets the minimum opacity for the color-mapping in maps.
     * @default null
     */
    minOpacity?: number;

    /**
     * Sets and gets the maximum opacity for the color-mapping in maps.
     * @default null
     */
    maxOpacity?: number;

    /**
     * Sets and gets the label for the color-mapping from the data source in maps.
     * @default null
     */
    label?: string;

    /**
     * Enables or disables the visibility state of legend for the color-mapping shapes in maps.
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class InitialShapeSelectionSettings
 */
export interface InitialShapeSelectionSettingsModel {

    /**
     * Sets and gets the property name from the data source in maps.
     * @default null
     */
    shapePath?: string;

    /**
     * Sets and gets the value for the shape from data source in maps.
     * @default null
     */
    shapeValue?: string;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Enables or disables the selection for the layers, markers in maps.
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the color for the shape that is selected.
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity for the shape that is selected.
     * @default 1
     */
    opacity?: number;

    /**
     * Enables or disables the selection for many shapes in maps.
     * @default false
     */
    enableMultiSelect?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border of selected shapes in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Sets and gets the color for the shapes on which the mouse has hovered in maps. 
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables the highlight settings for maps.
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the opacity for the highlighted shapes in maps.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the options for customizing the color and width of the border for the highlighted shapes in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class NavigationLineSettings
 */
export interface NavigationLineSettingsModel {

    /**
     * Enables or disables the navigation lines to be drawn in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the width of the navigation lines in maps.
     * @default 1
     */
    width?: number;

    /**
     * Sets and gets the longitude for the navigation lines drawn in maps.
     * @default []
     */
    longitude?: number[];

    /**
     * Sets and gets the latitude value for the navigation lines drawn in maps.
     * @default []
     */
    latitude?: number[];

    /**
     * Sets and gets the dash-array for the navigation lines drawn in maps.
     * @default ''
     */
    dashArray?: string;

    /**
     * Sets and gets the color for the navigation lines in maps.
     */
    color?: string;

    /**
     * Sets and gets the angle of curve connecting different locations in maps.
     * @default 0
     */
    angle?: number;

    /**
     * Sets and gets the options to customize the arrow for the navigation line in maps.
     */
    arrowSettings?: ArrowModel;

    /**
     * Sets and gets the selection settings of the navigation line in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Sets and gets the highlight settings of the navigation line in maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class BubbleSettings
 */
export interface BubbleSettingsModel {

    /**
     * Sets and gets the options to customize the color and width of the border for the bubble in maps.
     */
    border?: BorderModel;

    /**
     * Enables or disables the visibility state of the bubbles in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the data source for the bubble.
     * The data source must contain the size value of the bubble that can be bound to the bubble 
     * of the Maps using the valuePath property in the bubbleSettings.
     * The data source can contain data such as color, and the other information that can be bound to the bubble, and tooltip of the bubble.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: object[];

    /**
     * Sets and gets the duration for the animation for bubble in maps.
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Sets and gets the delay in animation for bubble in maps.
     * @default 0
     */
    animationDelay?: number;

    /**
     * Sets and gets the color for the bubble in maps.
     * @default ''
     */
    fill?: string;

    /**
     * Sets and gets the minimum radius for the bubble in maps.
     * @default 10
     */
    minRadius?: number;

    /**
     * Sets and gets the maximum radius for the bubble in maps.
     * @default 20
     */
    maxRadius?: number;

    /**
     * Sets and gets the opacity of the bubble in maps.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the value from the data source of bubble settings for the bubble to be rendered in maps.
     * @default null
     */
    valuePath?: string;

    /**
     * Sets and gets the type of the bubble in maps.
     * @default Circle
     */
    bubbleType?: BubbleType;

    /**
     * Sets and gets the value from the data source of bubble settings for the color of the bubble in maps.
     * @default null
     */
    colorValuePath?: string;

    /**
     * Sets and gets the color-mapping for the bubble in maps.
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * Sets and gets the options to customize the tooltip for the bubbles in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Sets and gets the selection settings for the bubble in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Sets and gets the highlight settings for the bubble in maps.
     */
    highlightSettings?: HighlightSettingsModel;

}

/**
 * Interface for a class CommonTitleSettings
 */
export interface CommonTitleSettingsModel {

    /**
     * Sets and gets the text for the title in maps.
     * @default ''
     */
    text?: string;

    /**
     * Sets and gets the description of the title in maps.
     * @default ''
     */
    description?: string;

}

/**
 * Interface for a class SubTitleSettings
 */
export interface SubTitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Sets and gets the options for customizing the text in the subtitle for maps.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the alignment of the subtitle for maps.
     * @default Center
     */
    alignment?: Alignment;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Sets and gets the options for customizing the text of the title in Maps.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the alignment for the text in the title for the maps.
     * @default Center
     */
    alignment?: Alignment;

    /**
     * Sets and gets the subtitle for the maps.
     */
    subtitleSettings?: SubTitleSettingsModel;

}

/**
 * Interface for a class ZoomSettings
 */
export interface ZoomSettingsModel {

    /**
     * Enables or disables the zooming operation in the maps component.
     * @default false
     */
    enable?: boolean;

    /**
     * Enables or disables the panning operation in the maps component.
     * @default true
     */
    enablePanning?: boolean;

    /**
     * Enables or disables the selection zooming operation in the maps component.
     * @default true
     */
    enableSelectionZooming?: boolean;

    /**
     * Sets and gets the orientation of the zoom toolbar.
     * @default Horizontal
     * @blazorProperty 'ToolbarOrientation'
     */
    toolBarOrientation?: Orientation;

    /**
     * Sets and gets the color for the toolbar in maps.
     */
    color?: string;

    /**
     * Sets and gets the color for the zooming toolbar when the mouse has hovered on toolbar element in maps.
     */
    highlightColor?: string;

    /**
     * Sets and gets the color for the zooming toolbar when clicking the zooming toolbar in maps.
     */
    selectionColor?: string;

    /**
     * Sets and gets the position type of toolbar when it is placed horizontally.
     * @default Far
     */
    horizontalAlignment?: Alignment;

    /**
     * Sets and gets the position type of toolbar when it is placed vertically.
     * @default Near
     */
    verticalAlignment?: Alignment;

    /**
     * Sets and gets the items that are to be shown in the zooming toolbar in maps.
     */
    toolbars?: string[];

    /**
     * Enables or disables the mouse wheel zooming in maps.
     * @default true
     */
    mouseWheelZoom?: boolean;

    /**
     * Enables or disables the double click zooming in maps.
     * @default false
     * @blazorProperty 'ZoomOnDoubleClick'
     */
    doubleClickZoom?: boolean;

    /**
     * Enables or disables the pinch zooming in maps.
     * @default true
     */
    pinchZooming?: boolean;

    /**
     * Enables or disables the zooming on clicking the shapes in maps.
     * @default false
     */
    zoomOnClick?: boolean;

    /**
     * Sets and gets the factor of zoom to be displayed while rendering the maps.
     * @default 1
     */
    zoomFactor?: number;

    /**
     * Sets and gets the maximum zooming value in maps.
     * @default 10
     */
    maxZoom?: number;

    /**
     * Sets and gets the minimum zooming value in maps.
     * @default 1
     */
    minZoom?: number;

    /**
     * Enables or disables the zoom based on the marker position while rendering the maps.
     */
    shouldZoomInitially?: boolean;

    /**
     * Enables or disables the zoom to set the initial State.
     */
    resetToInitial?: boolean;

}

/**
 * Interface for a class ToggleLegendSettings
 */
export interface ToggleLegendSettingsModel {

    /**
     * Enables or disables the legend to be toggled.
     * @default false
     */
    enable?: boolean;

    /**
     * Enables or disables the property of the shape settings to be displayed while clicking the legend.
     * @default true
     */
    applyShapeSettings?: boolean;

    /**
     * Sets and gets the opacity for the shape for which the legend is selected.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the color of the shape for which the legend is selected.
     * @default ''
     */
    fill?: string;

    /**
     * Sets and gets the options to customize the color and width of the border for the shape in maps.
     */
    border?: BorderModel;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Enables or disables the toggle visibility for legend in maps.
     * @default false
     */
    toggleVisibility?: boolean;

    /**
     * Enables or disables the visibility state of the legend in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the background color for the legend in maps.
     * @default 'transparent'
     */
    background?: string;

    /**
     * Sets and gets the type of the legend in maps.
     * @default Layers
     */
    type?: LegendType;

    /**
     * Enables or disables the visibility of the inverted pointer in interactive legend in maps.
     */
    invertedPointer?: boolean;

    /**
     * Sets and gets the position of the label in legend.
     * @default After
     */
    labelPosition?: LabelPosition;

    /**
     * Sets and gets the display mode for the label in legend.
     * @default None
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Sets and gets the shape of the legend in maps.
     * @default Circle
     */
    shape?: LegendShape;

    /**
     * Sets and gets the width of the legend in maps.
     * @default ''
     */
    width?: string;

    /**
     * Sets and gets the height of the legend in maps.
     * @default ''
     */
    height?: string;

    /**
     * Sets and gets the options for customizing the text styles for the legend in maps.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the width of the shapes in legend.
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Sets and gets the width of the shapes in legend.
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Sets and gets the padding for the shapes in legend.
     * @default 10
     */
    shapePadding?: number;

    /**
     * Sets and gets the options for customizing the color and width of the legend border.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the color and width of the border for the shape in legend.
     */
    shapeBorder?: BorderModel;

    /**
     * Sets and gets the title for the legend in maps.
     */
    title?: CommonTitleSettingsModel;

    /**
     * Sets and gets the options for customizing the style of the title for the legend in maps.
     */
    titleStyle?: FontModel;

    /**
     * Sets and gets the position of the legend in maps.
     * @default Bottom
     */
    position?: LegendPosition;

    /**
     * Sets and gets the alignment for the legend in maps.
     * @default Center
     */
    alignment?: Alignment;

    /**
     * Sets and gets the orientation of the legend in maps.
     * @default None
     */
    orientation?: LegendArrangement;

    /**
     * Sets and gets the location of the legend, given by x and y values. 
     */
    location?: Point;

    /**
     * Sets and gets the color of the legend in maps.
     */
    fill?: string;

    /**
     * Sets and gets the opacity for the legend in maps.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the mode of the legend in maps. The modes available are default and interactive modes.
     * @default Default
     */
    mode?: LegendMode;

    /**
     * Sets and gets the path for the legend from the data source to be shown.
     * @default null
     * @blazorProperty 'LegendPath'
     */
    showLegendPath?: string;

    /**
     * Set and gets the value from the data source for legend.
     * @default null
     */
    valuePath?: string;

    /**
     * Enables or disables to remove the duplicate legend item.
     * @default false
     */
    removeDuplicateLegend?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the shape related to the legend on selecting the legend.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

}

/**
 * Interface for a class DataLabelSettings
 */
export interface DataLabelSettingsModel {

    /**
     * Enables or disables the visibility of data-labels in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border for the data-labels.
     */
    border?: BorderModel;

    /**
     * Sets and gets the color for the data-labels in maps.
     */
    fill?: string;

    /**
     * Sets and gets the opacity for the color of the data-labels in maps.
     */
    opacity?: number;

    /**
     * Sets and gets the x position for the data-labels.
     * @default 10
     */
    rx?: number;

    /**
     * Sets and gets the y position for the data-labels in maps.
     * @default 10
     */
    ry?: number;

    /**
     * Sets and gets the options for customizing the styles of the text in data-labels.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the path from the data source based on which the data-labels gets rendered.
     * @default ''
     */
    labelPath?: string;

    /**
     * Sets and gets the label mode for the data-labels.
     * @default None
     */
    smartLabelMode?: SmartLabelMode;

    /**
     * Sets and gets the intersection action for the data-labels in maps.
     * @default None
     */
    intersectionAction?: IntersectAction;

    /**
     * Sets and gets the template for the data-labels in maps.
     * @default ''
     */
    template?: string;

}

/**
 * Interface for a class ShapeSettings
 */
export interface ShapeSettingsModel {

    /**
     * Sets and gets the color of the shapes in maps.
     * @default '#A6A6A6'
     */
    fill?: string;

    /**
     * Sets and gets a set of colors for the shapes in maps.
     * @default []
     */
    palette?: string[];

    /**
     * Sets and gets the radius of the shape.
     */
    circleRadius?: number;

    /**
     * Sets and gets the options for customizing the color and width of the border for the shapes in maps.
     */
    border?: BorderModel;

    /**
     * Sets and gets the dash-array for the shapes in maps.
     */
    dashArray?: string;

    /**
     * Sets and gets the opacity for the shapes in maps.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the value path from the data source to set the color for the shapes in maps.
     * @default null
     */
    colorValuePath?: string;

    /**
     * Sets and gets the value from the data source based on which the shape gets rendered.
     * @default null
     */
    valuePath?: string;

    /**
     * Sets and gets the options to map the color for some set of the shapes in maps.
     * @default []
     */
    colorMapping?: ColorMappingSettingsModel[];

    /**
     * Enables or disables the filling of color for the shapes automatically.
     * @default false
     */
    autofill?: boolean;

}

/**
 * Interface for a class MarkerBase
 */
export interface MarkerBaseModel {

    /**
     * Sets and gets the options for customizing the color and width of the border for the marker in maps.
     */
    border?: BorderModel;

    /**
     * Sets and gets the dash-array for the marker.
     */
    dashArray?: string;

    /**
     * Enables or disables the visibility state of the marker based on the marker data source in maps.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the color for the marker in maps.
     * @default '#FF471A'
     */
    fill?: string;

    /**
     * Sets and gets the height of the marker in maps.
     * @default 10
     */
    height?: number;

    /**
     * Sets and gets the width of the marker in maps.
     * @default 10
     */
    width?: number;

    /**
     * Sets and gets the opacity for the marker in maps.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the value path from the marker data source to apply color for the marker.
     * @default null
     */
    colorValuePath?: string;

    /**
     * Sets and gets the value path from the marker data source to set the shape of the marker.
     * @default null
     */
    shapeValuePath?: string;

    /**
     * Sets and gets the value path from the marker data source for the image of the marker.
     * @default null
     */
    imageUrlValuePath?: string;

    /**
     * Sets and gets the shape of the marker in maps.
     * @default Balloon
     */
    shape?: MarkerType;

    /**
     * Sets and gets the text for the legend from the marker data source.
     * @default ''
     */
    legendText?: string;

    /**
     * Sets and gets the position to move the marker by setting specific value.
     */
    offset?: Point;

    /**
     * Sets and gets the URL for rendering the marker as image.
     */
    imageUrl?: string;

    /**
     * Sets and gets the template for the marker.
     * @default null
     */
    template?: string;

    /**
     * Sets and gets the data source for the marker.
     * The data source for the marker will contain latitude and longitude values to specify the location 
     * of the marker.
     * The data source can contain data such as color, shape, and other details that can be bound to the color, shape,
     * and tooltip of the marker.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: Object[];

    /**
     * Sets and gets the options to customize the tooltip for the marker in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Sets and gets the duration time for animating the marker.
     * @default 1000
     */
    animationDuration?: number;

    /**
     * Sets and gets the delay time for the animation in marker.
     * @default 0
     */
    animationDelay?: number;

    /**
     * Sets and gets the options to customize the marker while selecting the marker in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Sets and gets the options to customize the marker while the mouse has hovered on the marker in maps.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Defines the value path from the marker data source for setting latitude for a set of markers.
     */
    latitudeValuePath?: string;

    /**
     * Defines the value path from the marker data source for setting longitude for a set of markers.
     */
    longitudeValuePath?: string;

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
     * Sets and gets the shape data for the maps to render.
     * @isdatamanager false
     * @default null
     */
    shapeData?: Object | DataManager | MapAjax;

    /**
     * Sets and gets the query to select particular data from the shape data. 
     * This property is applicable only when the data source is created by data manager.
     * @default null
     */
    query?: Query;

    /**
     * Sets and gets the options to customize the shape of the maps.
     */
    shapeSettings?: ShapeSettingsModel;

    /**
     * * Sets and gets the data source for the layer.
     * * The data source can contain data that can be bound to the tooltip, marker, and bubble.
     * @isdatamanager false
     * @isObservable true
     * @default []
     */
    dataSource?: Object[] | DataManager | MapAjax;

    /**
     * Sets and gets the type of the layer in maps.
     * @default Layer
     */
    type?: Type;

    /**
     * Sets and gets the geometry type for the layer in maps.
     * @default Geographic
     */
    geometryType?: GeometryType;

    /**
     * Sets and gets the Bing map type for the layer. If you use shape data with BingMapType without using layer type as Bing,
     * then the map will render based on shape data since default layer type will be set as Geometry.
     * @default Aerial
     */
    bingMapType?: BingMapType;

    /**
     * Sets and gets the type of the static maps.
     * @default RoadMap
     */
    staticMapType?: StaticMapType;

    /**
     * Sets and gets the key for the tile map layer in maps.
     * @default ''
     */
    key?: string;

    /**
     * Sets and gets the type of the layer in maps. If we use layer type with shape data property in layer of the maps 
     * then map will render based on the provided layer type.
     * @default Geometry
     */
    layerType?: ShapeLayerType;

    /**
     * Sets and gets the template for the map using the url.
     * @default 'https://a.tile.openstreetmap.org/level/tileX/tileY.png'
     */
    urlTemplate?: string;

    /**
     * Enables or disables the visibility state for the layers in maps.
     * @default true
     */
    visible?: boolean;

    /**
     * Sets and gets the path for the shape from the shape data in maps.
     * @default 'name'
     */
    shapeDataPath?: string;

    /**
     * Sets and gets the path for the layers from the layer data source in maps.
     * @default 'name'
     */
    shapePropertyPath?: string | string[];

    /**
     * Sets and gets the duration for the animation of layers in maps.
     * @default 0
     */
    animationDuration?: number;

    /**
     * Sets and gets the options for customizing the marker in maps.
     */
    markerSettings?: MarkerSettingsModel[];

    /**
     * Sets and gets the options for customizing the cluster of markers in maps.
     */
    markerClusterSettings?: MarkerClusterSettingsModel;

    /**
     * Sets and gets the options for customizing the data-label in maps.
     */
    dataLabelSettings?: DataLabelSettingsModel;

    /**
     * Sets and gets the options for customizing the bubble in maps.
     */
    bubbleSettings?: BubbleSettingsModel[];

    /**
     * Sets and gets the options for customizing the navigation line in maps.
     */
    navigationLineSettings?: NavigationLineSettingsModel[];

    /**
     * Sets and gets the options for customizing the tooltip for the layers, markers, and bubbles in maps.
     */
    tooltipSettings?: TooltipSettingsModel;

    /**
     * Sets and gets the options for customizing the shapes when clicking the shapes in maps.
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Sets and gets the options for customizing the shapes when the mouse has hovered on maps.
     */
    highlightSettings?: HighlightSettingsModel;

    /**
     * Sets and gets the options for customizing the toggle state of shapes when selecting the legend in maps.
     */
    toggleLegendSettings?: ToggleLegendSettingsModel;

    /**
     * Sets and gets the settings for shapes that is selected at the time of rendering.
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
     * Sets and gets the background color for the map area.
     */
    background?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of maps area.
     */
    border?: BorderModel;

}