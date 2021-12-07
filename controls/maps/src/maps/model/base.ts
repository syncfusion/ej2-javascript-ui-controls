/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Maps base document
 */
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Alignment, LegendPosition, LegendType, LegendMode, ShapeLayerType, Type, MarkerType, Orientation, MapAjax } from '../../index';
import { SmartLabelMode, IntersectAction } from '../../index';
import { BorderModel, ColorMappingSettingsModel, FontModel, CommonTitleSettingsModel, NavigationLineSettingsModel } from './base-model';
import { MarkerSettingsModel, MarkerClusterSettingsModel, ShapeSettingsModel, BubbleSettingsModel, ArrowModel } from './base-model';
import { DataLabelSettingsModel, TooltipSettingsModel, SubTitleSettingsModel, SelectionSettingsModel } from './base-model';
import { HighlightSettingsModel, ToggleLegendSettingsModel, ConnectorLineSettingsModel} from './base-model';
import { InitialShapeSelectionSettingsModel, InitialMarkerSelectionSettingsModel } from './base-model';
import { Theme } from './theme';
import { Point, GeoLocation } from '../utils/helper';
import { BingMapType, LegendArrangement, LegendShape, BubbleType, StaticMapType } from '../utils/enum';
import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';


/**
 * Sets and gets the options for customizing the annotation element in maps.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Sets and gets the content for the annotation in maps component.
     */
    @Property('')
    public content: string;

    /**
     * Sets and gets the x position of the annotation in maps component.
     */
    @Property('0px')
    public x: string;

    /**
     * Sets and gets the y position of the annotation in maps component.
     */
    @Property('0px')
    public y: string;

    /**
     * Sets and gets the annotation element to be aligned vertically.
     *
     * @default None
     */
    @Property('None')
    public verticalAlignment: AnnotationAlignment;

    /**
     * Sets and gets the annotation element to be aligned horizontally.
     *
     * @default None
     */
    @Property('None')
    public horizontalAlignment: AnnotationAlignment;

    /**
     * Sets and gets the z-index of the annotation in maps component.
     *
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;
}
export class Arrow extends ChildProperty<Arrow> {
    /**
     * Sets and gets the type of the position to place the arrow in navigation lines.
     */
    @Property('Start')
    public position: string;
    /**
     * Enables or disables the visibility state of the arrow in navigation line.
     */
    @Property('false')
    public showArrow: boolean;
    /**
     * Sets and gets the size of the arrow in navigation line in maps.
     */
    @Property(2)
    public size: number;
    /**
     * Sets and gets the color for the arrow in navigation line.
     */
    @Property('black')
    public color: string;
    /**
     * Sets and gets the offset value to position the arrow in navigation line.
     */
    @Property(0)
    public offSet: number;
}

/**
 * Sets and gets the options to customize the style of the text in data label, legend and other texts.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Sets and gets the size for the text in data label, legend and other texts.
     */
    @Property('12px')
    public size: string;

    /**
     * Sets and gets the color for the text in data label, legend and other texts in maps component.
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the style of the text in data label, legend and other texts in maps component.
     */
    @Property('Roboto, Noto, Sans-serif')
    public fontFamily: string;

    /**
     * Sets and gets the font weight of the text in data label, legend and other texts in maps component.
     */
    @Property('Medium')
    public fontWeight: string;

    /**
     * Sets and gets the style of the text in data label, legend and other texts in maps component.
     */
    @Property('Medium')
    public fontStyle: string;

    /**
     * Sets and gets the opacity for the text in data label, legend and other texts in maps component.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}
/**
 * Sets and gets the options to customize the border for the maps.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Sets and gets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     */
    @Property('')
    public color: string;

    /**
     * Sets and gets the width of the border in maps.
     */
    @Property(0)
    public width: number;
    /**
     * Sets and gets the opacity of the border in maps.
     */
    @Property(null)
    public opacity: number;

}
/**
 * Sets and gets the center position in maps.
 */
export class CenterPosition extends ChildProperty<CenterPosition> {

    /**
     * Sets and gets the latitude for the center position of maps.
     *
     * @default null
     */
    @Property(null)
    public latitude: number;

    /**
     * Sets and gets the longitude for the center position of maps.
     *
     * @default null
     */
    @Property(null)
    public longitude: number;

}
/**
 * Sets and gets the options to customize the tooltip for layers, markers, and bubble in maps.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables the tooltip visibility for layers, markers, and bubbles in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the tooltip template for layers, markers, and bubbles in maps.
     *
     * @default ''
     */
    @Property('')
    public template: string;
    /**
     * Sets and gets the color of the tooltip in layers, markers, and bubbles of maps.
     */
    @Property('')
    public fill: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the tooltip in layers, markers, and bubbles of maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the options for customizing the style of the text in tooltip for layers, markers, and bubbles of maps.
     */
    @Complex<FontModel>(Theme.tooltipLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the format of the tooltip in layers, markers, and bubbles of maps.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Sets and gets the value from the data source based on which the tooltip is visible on layers, markers, and bubbles of maps.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
}
/**
 * Sets and gets the margin for the maps component.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Sets and gets the left margin for maps.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Sets and gets the right margin for maps.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Sets and gets the top margin for maps.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Sets and gets the bottom margin for maps.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}
/*
 * Sets and gets the options to customize the line that connects the markers in marker cluster in maps.
 */
export class ConnectorLineSettings extends ChildProperty<ConnectorLineSettings> {
    /**
     * Sets and gets the color for connector line between the markers in marker cluster.
     *
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     * Sets and gets the line width for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Sets and gets the opacity for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}

/**
 * Sets and gets the options to customize the cluster of markers in Maps.
 */
export class MarkerClusterSettings extends ChildProperty<MarkerClusterSettings> {
    /**
     * Enables or disables the visibility state of the clustering of markers in the maps component.
     *
     * @default false
     */
    @Property(false)
    public allowClustering: boolean;
    /**
     * Sets and gets the options for customizing the color and width of the border of cluster in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;
    /**
     * Sets and gets the fill color of the cluster.
     *
     * @default '#D2691E'
     */
    @Property('#D2691E')
    public fill: string;
    /**
     * Sets and gets the opacity of the marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets shape for the cluster of markers.
     *
     * @default Rectangle
     */
    @Property('Rectangle')
    public shape: MarkerType;

    /**
     * Sets and gets the width of the marker cluster in maps.
     *
     * @default 12
     */
    @Property(12)
    public width: number;

    /**
     * Sets and gets the height of the marker cluster in maps.
     *
     * @default 12
     */
    @Property(12)
    public height: number;
    /**
     * Sets and gets the offset position for the marker cluster in maps.
     */
    @Property(new Point(0, 0))
    public offset: Point;
    /**
     * Sets and gets the URL path for the marker cluster when the cluster shape is set as image in maps.
     */
    @Property('')
    public imageUrl: string;
    /**
     * Sets and gets the dash array for the marker cluster in maps.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;
    /**
     * Sets and gets the options to customize the text in marker cluster.
     */
    @Complex<FontModel>({}, Font)
    public labelStyle: FontModel;
    /**
     * Enables or disables the cluster expand when many markers are in same location.
     *
     * @default false
     */
    @Property(false)
    public allowClusterExpand: boolean;
    /**
     * Sets and gets the options to customize the connector line in cluster separating the markers.
     */
    @Complex<ConnectorLineSettingsModel>({}, ConnectorLineSettings)
    public connectorLineSettings: ConnectorLineSettingsModel;
}
/**
 * Sets and gets the data in the marker cluster.
 */
export class MarkerClusterData extends ChildProperty<MarkerClusterData> {
    /**
     * Sets and gets the data for the marker cluster.
     *
     * @private
     */
    public data: Object[];
    /**
     * Sets and gets the index value for the layer in which the marker cluster is rendered.
     *
     * @private
     */
    public layerIndex: number;
    /**
     * Sets and gets the index value for the marker in the maps.
     *
     * @private
     */
    public markerIndex: number;
    /**
     * Sets and gets the index value for the marker in the maps.
     *
     * @private
     */
    public dataIndex: number;
    /**
     * Sets and gets the index value for cluster for which the click operation is triggered.
     *
     * @private
     */
    public targetClusterIndex: number;
    /**
     * Enables or disables the same cluster occurs in maps.
     *
     * @private
     */
    public isClusterSame: boolean;
}
/**
 * Sets and gets the options to customize the color-mapping in maps.
 */
export class ColorMappingSettings extends ChildProperty<ColorMappingSettings> {
    /**
     * Sets and gets the value from where the range color-mapping starts.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Sets and gets the value to where the range color-mapping ends.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public to: number;
    /**
     * Sets and gets the value for the color-mapping from the data source.
     *
     * @default null
     */
    @Property(null)
    public value: string;
    /**
     * Sets and gets the color for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public color: string | string[];
    /**
     * Sets and gets the minimum opacity for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public minOpacity: number;
    /**
     * Sets and gets the maximum opacity for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public maxOpacity: number;
    /**
     * Sets and gets the label for the color-mapping from the data source in maps.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Enables or disables the visibility state of legend for the color-mapping shapes in maps.
     *
     * @default true
     */
    @Property(true)
    public showLegend: boolean;
}

/**
 * To configure the initial marker shape selection settings
 */
export class InitialMarkerSelectionSettings extends ChildProperty<InitialMarkerSelectionSettings> {

    /**
     * To initially select the marker latitude.
     *
     * @default null
     */
    @Property(null)
    public latitude: number;
    /**
     * To initially select the marker longitude
     *
     * @default null
     */
    @Property(null)
    public longitude: number;
}

/**
 * Sets and gets the shapes that is selected initially on rendering the maps.
 */
export class InitialShapeSelectionSettings extends ChildProperty<InitialShapeSelectionSettings> {

    /**
     * Sets and gets the property name from the data source in maps.
     *
     * @default null
     */
    @Property(null)
    public shapePath: string;
    /**
     * Sets and gets the value for the shape from data source in maps.
     *
     * @default null
     */
    @Property(null)
    public shapeValue: string;
}
/**
 * Sets and gets the options to customize the maps on selecting the shapes.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {

    /**
     * Enables or disables the selection for the layers, markers in maps.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Sets and gets the color for the shape that is selected.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Sets and gets the opacity for the shape that is selected.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Enables or disables the selection for many shapes in maps.
     *
     * @default false
     */
    @Property(false)
    public enableMultiSelect: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border of selected shapes in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;
}
/**
 * Sets and gets the options to customize the shapes on which the mouse has hovered in maps.
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {

    /**
     * Sets and gets the color for the shapes on which the mouse has hovered in maps.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Enables or disables the highlight settings for maps.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Sets and gets the opacity for the highlighted shapes in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the options for customizing the color and width of the border for the highlighted shapes in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

}
/**
 * Sets and gets the options to customize the navigation line in maps.
 */
export class NavigationLineSettings extends ChildProperty<NavigationLineSettings> {
    /**
     * Enables or disables the navigation lines to be drawn in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the width of the navigation lines in maps.
     *
     * @default 1
     */
    @Property(1)
    public width: number;
    /**
     * Sets and gets the longitude for the navigation lines drawn in maps.
     *
     * @default []
     */
    @Property(null)
    public longitude: number[];
    /**
     * Sets and gets the latitude value for the navigation lines drawn in maps.
     *
     * @default []
     */
    @Property(null)
    public latitude: number[];
    /**
     * Sets and gets the dash-array for the navigation lines drawn in maps.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;
    /**
     * Sets and gets the color for the navigation lines in maps.
     *
     */
    @Property('black')
    public color: string;
    /**
     * Sets and gets the angle of curve connecting different locations in maps.
     *
     * @default 0
     */
    @Property(0)
    public angle: number;
    /**
     * Sets and gets the options to customize the arrow for the navigation line in maps.
     */
    @Complex<ArrowModel>({ showArrow: false, position: 'Start', size: 5, color: 'black' }, Arrow)
    public arrowSettings: ArrowModel;
    /**
     * Sets and gets the selection settings of the navigation line in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Sets and gets the highlight settings of the navigation line in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}
/**
 * Sets and gets the options to customize the bubble elements in maps.
 */
export class BubbleSettings extends ChildProperty<BubbleSettings> {
    /**
     * Sets and gets the options to customize the color and width of the border for the bubble in maps.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Enables or disables the visibility state of the bubbles in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the data source for the bubble.
     * The data source must contain the size value of the bubble that can be bound to the bubble
     * of the Maps using the valuePath property in the bubbleSettings.
     * The data source can contain data such as color, and the other information that can be bound to the bubble, and tooltip of the bubble.
     *
     * @isObservable true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;
    /**
     * Sets and gets the query to select particular data from the bubble data.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;
    /**
     * Sets and gets the duration for the animation for bubble in maps.
     *
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Sets and gets the delay in animation for bubble in maps.
     *
     * @default 0
     */
    @Property(0)
    public animationDelay: number;

    /**
     * Sets and gets the color for the bubble in maps.
     *
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * Sets and gets the minimum radius for the bubble in maps.
     *
     * @default 10
     */
    @Property(10)
    public minRadius: number;
    /**
     * Sets and gets the maximum radius for the bubble in maps.
     *
     * @default 20
     */
    @Property(20)
    public maxRadius: number;
    /**
     * Sets and gets the opacity of the bubble in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the value from the data source of bubble settings for the bubble to be rendered in maps.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * Sets and gets the type of the bubble in maps.
     *
     * @default Circle
     */
    @Property('Circle')
    public bubbleType: BubbleType;
    /**
     * Sets and gets the value from the data source of bubble settings for the color of the bubble in maps.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Sets and gets the color-mapping for the bubble in maps.
     *
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];

    /**
     * Sets and gets the options to customize the tooltip for the bubbles in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Sets and gets the selection settings for the bubble in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Sets and gets the highlight settings for the bubble in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}

/**
 * Sets and gets the title for the maps.
 */
export class CommonTitleSettings extends ChildProperty<CommonTitleSettings> {
    /**
     * Sets and gets the text for the title in maps.
     *
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * Sets and gets the description of the title in maps.
     *
     * @default ''
     */
    @Property('')
    public description: string;
}
/**
 * Sets and gets the subtitle for maps.
 */
export class SubTitleSettings extends CommonTitleSettings {
    /**
     * Sets and gets the options for customizing the text in the subtitle for maps.
     */
    @Complex<FontModel>({ size: Theme.mapsSubTitleFont.size, fontWeight: null }, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the alignment of the subtitle for maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
}
/**
 * Sets and gets the title for the maps.
 */
export class TitleSettings extends CommonTitleSettings {
    /**
     * Sets and gets the options for customizing the text of the title in Maps.
     */
    @Complex<FontModel>({ size: Theme.mapsTitleFont.size, fontWeight: null }, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the alignment for the text in the title for the maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * Sets and gets the subtitle for the maps.
     */
    @Complex<SubTitleSettingsModel>({}, SubTitleSettings)
    public subtitleSettings: SubTitleSettingsModel;
}
/**
 * Sets and gets the options to configure maps zooming operations.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {
    /**
     * Enables or disables the zooming operation in the maps component.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Enables or disables the panning operation in the maps component.
     *
     * @default true
     */
    @Property(true)
    public enablePanning: boolean;

    /**
     * Enables or disables the selection zooming operation in the maps component.
     *
     * @default true
     */
    @Property(true)
    public enableSelectionZooming: boolean;

    /**
     * Sets and gets the orientation of the zoom toolbar.
     *
     * @default Horizontal
     */
    @Property('Horizontal')
    public toolBarOrientation: Orientation;

    /**
     * Sets and gets the color for the toolbar in maps.
     */
    @Property(null)
    public color: string;
    /**
     * Sets and gets the color for the zooming toolbar when the mouse has hovered on toolbar element in maps.
     */
    @Property(null)
    public highlightColor: string;
    /**
     * Sets and gets the color for the zooming toolbar when clicking the zooming toolbar in maps.
     */
    @Property(null)
    public selectionColor: string;

    /**
     * Sets and gets the position type of toolbar when it is placed horizontally.
     *
     * @default Far
     */
    @Property('Far')
    public horizontalAlignment: Alignment;

    /**
     * Sets and gets the position type of toolbar when it is placed vertically.
     *
     * @default Near
     */
    @Property('Near')
    public verticalAlignment: Alignment;
    /**
     * Sets and gets the items that are to be shown in the zooming toolbar in maps.
     */
    @Property(['ZoomIn', 'ZoomOut', 'Reset'])
    public toolbars: string[];
    /**
     * Enables or disables the mouse wheel zooming in maps.
     *
     * @default true
     */
    @Property(true)
    public mouseWheelZoom: boolean;

    /**
     * Enables or disables the double click zooming in maps.
     *
     * @default false
     */
    @Property(false)
    public doubleClickZoom: boolean;
    /**
     * Enables or disables the pinch zooming in maps.
     *
     * @default true
     */
    @Property(false)
    public pinchZooming: boolean;
    /**
     * Enables or disables the zooming on clicking the shapes in maps.
     *
     * @default false
     */
    @Property(false)
    public zoomOnClick: boolean;
    /**
     * Sets and gets the factor of zoom to be displayed while rendering the maps.
     *
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Sets and gets the maximum zooming value in maps.
     *
     * @default 10
     */
    @Property(10)
    public maxZoom: number;
    /**
     * Sets and gets the minimum zooming value in maps.
     *
     * @default 1
     */
    @Property(1)
    public minZoom: number;
    /**
     * Enables or disables the zoom based on the marker position while rendering the maps.
     */
    @Property(false)
    public shouldZoomInitially: boolean;
    /**
     * Enables or disables the zoom to set the initial State.
     */
    @Property(true)
    public resetToInitial: boolean;
}
/**
 * Sets and gets the settings to customize the color-mapping visibility based on the legend visibility.
 */
export class ToggleLegendSettings extends ChildProperty<ToggleLegendSettings> {
    /**
     * Enables or disables the legend to be toggled.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Enables or disables the property of the shape settings to be displayed while clicking the legend.
     *
     * @default true
     */
    @Property(true)
    public applyShapeSettings: boolean;
    /**
     * Sets and gets the opacity for the shape for which the legend is selected.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the color of the shape for which the legend is selected.
     *
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * Sets and gets the options to customize the color and width of the border for the shape in maps.
     */
    @Complex<BorderModel>({ color: '', width: 0 }, Border)
    public border: BorderModel;
}
/**
 * Sets and gets the options to customize the legend of the maps.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Enables or disables the toggle visibility for legend in maps.
     *
     * @default false
     */
    @Property(false)
    public toggleVisibility: boolean;
    /**
     * Enables or disables the visibility state of the legend in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Sets and gets the background color for the legend in maps.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Sets and gets the type of the legend in maps.
     *
     * @default Layers
     */
    @Property('Layers')
    public type: LegendType;

    /**
     * Enables or disables the visibility of the inverted pointer in interactive legend in maps.
     */
    @Property(false)
    public invertedPointer: boolean;

    /**
     * Sets and gets the position of the label in legend.
     *
     * @default After
     */
    @Property('After')
    public labelPosition: LabelPosition;
    /**
     * Sets and gets the display mode for the label in legend.
     *
     * @default None
     */
    @Property('None')
    public labelDisplayMode: LabelIntersectAction;
    /**
     * Sets and gets the shape of the legend in maps.
     *
     * @default Circle
     */
    @Property('Circle')
    public shape: LegendShape;

    /**
     * Sets and gets the width of the legend in maps.
     *
     * @default ''
     */
    @Property('')
    public width: string;

    /**
     * Sets and gets the height of the legend in maps.
     *
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Sets and gets the options for customizing the text styles for the legend in maps.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the width of the shapes in legend.
     *
     * @default 15
     */
    @Property(15)
    public shapeWidth: number;

    /**
     * Sets and gets the width of the shapes in legend.
     *
     * @default 15
     */
    @Property(15)
    public shapeHeight: number;

    /**
     * Sets and gets the padding for the shapes in legend.
     *
     * @default 10
     */
    @Property(10)
    public shapePadding: number;

    /**
     * Sets and gets the options for customizing the color and width of the legend border.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the options for customizing the color and width of the border for the shape in legend.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public shapeBorder: BorderModel;

    /**
     * Sets and gets the title for the legend in maps.
     */
    @Complex<CommonTitleSettingsModel>({}, CommonTitleSettings)
    public title: CommonTitleSettingsModel;

    /**
     * Sets and gets the options for customizing the style of the title for the legend in maps.
     */
    @Complex<FontModel>({}, Font)
    public titleStyle: FontModel;

    /**
     * Sets and gets the position of the legend in maps.
     *
     * @default Bottom
     */
    @Property('Bottom')
    public position: LegendPosition;

    /**
     * Sets and gets the alignment for the legend in maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Sets and gets the orientation of the legend in maps.
     *
     * @default None
     */
    @Property('None')
    public orientation: LegendArrangement;

    /**
     * Sets and gets the location of the legend, given by x and y values.
     */
    @Property({ x: 0, y: 0 })
    public location: Point;

    /**
     * Sets and gets the color of the legend in maps.
     */
    @Property(null)
    public fill: string;

    /**
     * Sets and gets the opacity for the legend in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the mode of the legend in maps. The modes available are default and interactive modes.
     *
     * @default Default
     */
    @Property('Default')
    public mode: LegendMode;

    /**
     * Sets and gets the path for the legend from the data source to be shown.
     *
     * @default null
     */
    @Property(null)
    public showLegendPath: string;

    /**
     * Set and gets the value from the data source for legend.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;

    /**
     * Enables or disables to remove the duplicate legend item.
     *
     * @default false
     */
    @Property(false)
    public removeDuplicateLegend: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the shape related to the legend on selecting the legend.
     */
    @Complex<ToggleLegendSettingsModel>({}, ToggleLegendSettings)
    public toggleLegendSettings: ToggleLegendSettingsModel;
}
/**
 * Sets and gets the options to customize the data-labels in maps.
 */
export class DataLabelSettings extends ChildProperty<DataLabelSettings> {
    /**
     * Enables or disables the visibility of data-labels in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the options for customizing the color and width of the border for the data-labels.
     */
    @Complex<BorderModel>({ width: 0, color: 'transparent' }, Border)
    public border: BorderModel;
    /**
     * Sets and gets the color for the data-labels in maps.
     */
    @Property('black')
    public fill: string;
    /**
     * Sets and gets the opacity for the color of the data-labels in maps.
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the x position for the data-labels.
     *
     * @default 10
     */
    @Property(5)
    public rx: number;

    /**
     * Sets and gets the y position for the data-labels in maps.
     *
     * @default 10
     */
    @Property(5)
    public ry: number;
    /**
     * Sets and gets the options for customizing the styles of the text in data-labels.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the path from the data source based on which the data-labels gets rendered.
     *
     * @default ''
     */
    @Property('')
    public labelPath: string;
    /**
     * Sets and gets the label mode for the data-labels.
     *
     * @default None
     */
    @Property('None')
    public smartLabelMode: SmartLabelMode;
    /**
     * Sets and gets the intersection action for the data-labels in maps.
     *
     * @default None
     */
    @Property('None')
    public intersectionAction: IntersectAction;
    /**
     * Sets and gets the template for the data-labels in maps.
     *
     * @default ''
     */
    @Property('')
    public template: string;
}
/**
 * Sets and gets the options to customize the shapes in the maps.
 */
export class ShapeSettings extends ChildProperty<ShapeSettings> {
    /**
     * Sets and gets the color of the shapes in maps.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Sets and gets a set of colors for the shapes in maps.
     *
     * @default []
     */
    @Property([])
    public palette: string[];

    /**
     * Sets and gets the radius of the shape.
     */
    @Property(5)
    public circleRadius: number;

    /**
     * Sets and gets the options for customizing the color and width of the border for the shapes in maps.
     */
    @Complex<BorderModel>({ width: 0, color: '#000000' }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the dash-array for the shapes in maps.
     */
    @Property('')
    public dashArray: string;

    /**
     * Sets and gets the opacity for the shapes in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the value path from the data source to set the color for the shapes in maps.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Sets and gets the value path from the data source to set the color for the border of a particular shape in maps.
     *
     * @default null
     */
    @Property(null)
    public borderColorValuePath: string;
    /**
     * Sets and gets the value path from the data source to set the width for the border of a particular shape in maps.
     *
     * @default null
     */
    @Property(null)
    public borderWidthValuePath: string;
    /**
     * Sets and gets the value from the data source based on which the shape gets rendered.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * Sets and gets the options to map the color for some set of the shapes in maps.
     *
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];
    /**
     * Enables or disables the filling of color for the shapes automatically.
     *
     * @default false
     */
    @Property(false)
    public autofill: boolean;
}

/**
 * Sets and gets the options to customize the marker in the maps.
 */
export class MarkerBase extends ChildProperty<MarkerBase> {

    /**
     * Sets and gets the options for customizing the color and width of the border for the marker in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Sets and gets the dash-array for the marker.
     */
    @Property(null)
    public dashArray: string;

    /**
     * Enables or disables the visibility state of the marker based on the marker data source in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Sets and gets the color for the marker in maps.
     *
     * @default '#FF471A'
     */
    @Property('#FF471A')
    public fill: string;

    /**
     * Sets and gets the height of the marker in maps.
     *
     * @default 10
     */
    @Property(10)
    public height: number;

    /**
     * Sets and gets the width of the marker in maps.
     *
     * @default 10
     */
    @Property(10)
    public width: number;

    /**
     * Sets and gets the opacity for the marker in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Sets and gets the value path from the marker data source to apply color for the marker.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;

    /**
     * Sets and gets the value path from the marker data source to set the shape of the marker.
     *
     * @default null
     */
    @Property(null)
    public shapeValuePath: string;

    /**
     * Sets and gets the value path from the marker data source for the image of the marker.
     *
     * @default null
     */
    @Property(null)
    public imageUrlValuePath: string;

    /**
     * Sets and gets the shape of the marker in maps.
     *
     * @default Balloon
     */
    @Property('Balloon')
    public shape: MarkerType;

    /**
     * Sets and gets the text for the legend from the marker data source.
     *
     * @default ''
     */
    @Property('')
    public legendText: string;
    /**
     * Sets and gets the position to move the marker by setting specific value.
     *
     */
    @Property(new Point(0, 0))
    public offset: Point;
    /**
     * Sets and gets the URL for rendering the marker as image.
     */
    @Property('')
    public imageUrl: string;

    /**
     * Sets and gets the template for the marker.
     *
     * @default null
     */
    @Property(null)
    public template: string;
    /**
     * Sets and gets the data source for the marker.
     * The data source for the marker will contain latitude and longitude values to specify the location
     * of the marker.
     * The data source can contain data such as color, shape, and other details that can be bound to the color, shape,
     * and tooltip of the marker.
     *
     * @isObservable true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;

    /**
     * Sets and gets the query to select particular data from the marker data.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Sets and gets the options to customize the tooltip for the marker in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;

    /**
     * Sets and gets the duration time for animating the marker.
     *
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Sets and gets the delay time for the animation in marker.
     *
     * @default 0
     */
    @Property(0)
    public animationDelay: number;
    /**
     * Sets and gets the options to customize the marker while selecting the marker in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Sets and gets the options to customize the marker while the mouse has hovered on the marker in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Defines the value path from the marker data source for setting latitude for a set of markers.
     */
    @Property(null)
    public latitudeValuePath: string;

    /**
     * Defines the value path from the marker data source for setting longitude for a set of markers.
     */
    @Property(null)
    public longitudeValuePath: string;

    /**
     * To select the shape at the rendering time.
     */
    @Collection<InitialMarkerSelectionSettingsModel>([], InitialMarkerSelectionSettings)
    public initialMarkerSelection: InitialMarkerSelectionSettingsModel[];

}

export class MarkerSettings extends MarkerBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
}

/**
 * Sets and gets the options to customize the layers of the maps.
 */
export class LayerSettings extends ChildProperty<LayerSettings> {
    /**
     * Sets and gets the shape data for the maps to render.
     *
     * @isObservable true
     * @default null
     */
    @Property(null)
    public shapeData: Object | DataManager | MapAjax;

    /**
     * Sets and gets the query to select particular data from the shape data.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Sets and gets the options to customize the shape of the maps.
     */
    @Complex<ShapeSettingsModel>({}, ShapeSettings)
    public shapeSettings: ShapeSettingsModel;

    /**
     * * Sets and gets the data source for the layer.
     * * The data source can contain data that can be bound to the tooltip, marker, and bubble.
     *
     * @isObservable true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager | MapAjax;
    /**
     * Sets and gets the type of the layer in maps.
     *
     * @default Layer
     */
    @Property('Layer')
    public type: Type;
    /**
     * Sets and gets the geometry type for the layer in maps.
     *
     * @default Geographic
     */
    @Property('Geographic')
    public geometryType: GeometryType;
    /**
     * Sets and gets the Bing map type for the layer. If you use shape data with BingMapType without using layer type as Bing,
     * then the map will render based on shape data since default layer type will be set as Geometry.
     *
     * @default Aerial
     */
    @Property('Aerial')
    public bingMapType: BingMapType;
    /**
     * Sets and gets the type of the static maps.
     *
     * @default RoadMap
     */
    @Property('RoadMap')
    public staticMapType: StaticMapType;
    /**
     * Sets and gets the key for the tile map layer in maps.
     *
     * @default ''
     */
    @Property('')
    public key: string;
    /**
     * Sets and gets the type of the layer in maps. If we use layer type with shape data property in layer of the maps
     * then map will render based on the provided layer type.
     *
     * @default Geometry
     */
    @Property('Geometry')
    public layerType: ShapeLayerType;
    /**
     * Sets and gets the template for the map using the url.
     *
     * @default 'https://a.tile.openstreetmap.org/level/tileX/tileY.png'
     */
    @Property('https://a.tile.openstreetmap.org/level/tileX/tileY.png')
    public urlTemplate: string;
    /**
     * Enables or disables the visibility state for the layers in maps.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Sets and gets the path for the shape from the shape data in maps.
     *
     * @default 'name'
     */
    @Property('name')
    public shapeDataPath: string;
    /**
     * Sets and gets the path for the layers from the layer data source in maps.
     *
     * @default 'name'
     */
    @Property('name')
    public shapePropertyPath: string | string[];
    /**
     * Sets and gets the duration for the animation of layers in maps.
     *
     * @default 0
     */
    @Property(0)
    public animationDuration: number;

    /**
     * Sets and gets the options for customizing the marker in maps.
     */
    @Collection<MarkerSettingsModel>([], MarkerSettings)
    public markerSettings: MarkerSettingsModel[];
    /**
     * Sets and gets the options for customizing the cluster of markers in maps.
     */
    @Complex<MarkerClusterSettingsModel>({}, MarkerClusterSettings)
    public markerClusterSettings: MarkerClusterSettingsModel;
    /**
     * Sets and gets the options for customizing the data-label in maps.
     */
    @Complex<DataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabelSettings: DataLabelSettingsModel;
    /**
     * Sets and gets the options for customizing the bubble in maps.
     */
    @Collection<BubbleSettingsModel>([], BubbleSettings)
    public bubbleSettings: BubbleSettingsModel[];
    /**
     * Sets and gets the options for customizing the navigation line in maps.
     */
    @Collection<NavigationLineSettingsModel>([], NavigationLineSettings)
    public navigationLineSettings: NavigationLineSettingsModel[];
    /**
     * Sets and gets the options for customizing the tooltip for the layers, markers, and bubbles in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Sets and gets the options for customizing the shapes when clicking the shapes in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Sets and gets the options for customizing the shapes when the mouse has hovered on maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Sets and gets the options for customizing the toggle state of shapes when selecting the legend in maps.
     */
    @Complex<ToggleLegendSettingsModel>({}, ToggleLegendSettings)
    public toggleLegendSettings: ToggleLegendSettingsModel;
    /**
     * Sets and gets the settings for shapes that is selected at the time of rendering.
     */
    @Collection<InitialShapeSelectionSettingsModel>([], InitialShapeSelectionSettings)
    public initialShapeSelection: InitialShapeSelectionSettingsModel[];


    /** @private */
    public layerData: Object[];
    /**
     * @private
     */
    public isBaseLayer: boolean = false;
    /**
     * @private
     */
    public factor: number;
    /**
     * @private
     */
    public layerBounds: GeoLocation;
    /**
     * @private
     */
    public rectBounds: Object;
    /**
     * @private
     */
    public translatePoint: Point;
}
/**
 * Internal use for bing type layer rendering
 */
export class Tile {
    public x: number;
    public y: number;
    public top: number;
    public left: number;
    public height: number;
    public width: number;
    public src: string;
    constructor(x: number, y: number, height: number = 256, width: number = 256, top: number = 0, left: number = 0, src: string = null) {
        this.x = x;
        this.y = y;
        this.top = top;
        this.left = left;
        this.height = height;
        this.width = width;
        this.src = src;
    }
}
/**
 * Sets and gets the maps area settings
 */
export class MapsAreaSettings extends ChildProperty<MapsAreaSettings> {
    /**
     * Sets and gets the background color for the map area.
     */
    @Property(null)
    public background: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of maps area.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

}
