/* eslint-disable max-len */
/**
 * Maps base document
 */
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Alignment, LegendPosition, LegendType, LegendMode, Type, MarkerType, Orientation, MapAjax } from '../../index';
import { SmartLabelMode, IntersectAction } from '../../index';
import { BorderModel, ColorMappingSettingsModel, FontModel, CommonTitleSettingsModel, NavigationLineSettingsModel, PolygonSettingsModel, ZoomToolbarTooltipSettingsModel } from './base-model';
import { MarkerSettingsModel, MarkerClusterSettingsModel, ShapeSettingsModel, BubbleSettingsModel, ArrowModel } from './base-model';
import { DataLabelSettingsModel, TooltipSettingsModel, SubTitleSettingsModel, SelectionSettingsModel, PolygonSettingModel } from './base-model';
import { HighlightSettingsModel, ToggleLegendSettingsModel, ConnectorLineSettingsModel, PolygonTooltipSettingsModel} from './base-model';
import { InitialShapeSelectionSettingsModel, InitialMarkerSelectionSettingsModel, ZoomToolbarSettingsModel, ZoomToolbarButtonSettingsModel } from './base-model';
import { Theme } from './theme';
import { Point, GeoLocation, Coordinate, RelativePoint } from '../utils/helper';
import { LegendArrangement, LegendShape, BubbleType, ToolbarItem } from '../utils/enum';
import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';


/**
 * Gets or sets the options for customizing the annotation element in maps.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Gets or sets the content for the annotation in maps.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public content: string | Function;

    /**
     * Gets or sets the x position of the annotation in pixel or percentage format.
     *
     * @default '0px'
     */
    @Property('0px')
    public x: string;

    /**
     * Gets or sets the y position of the annotation in pixel or percentage format.
     *
     * @default '0px'
     */
    @Property('0px')
    public y: string;

    /**
     * Gets or sets the type of the placement when the annotation is to be aligned vertically.
     *
     * @default None
     */
    @Property('None')
    public verticalAlignment: AnnotationAlignment;

    /**
     * Gets or sets the type of the placement when the annotation is to be aligned horizontally.
     *
     * @default None
     */
    @Property('None')
    public horizontalAlignment: AnnotationAlignment;

    /**
     * Gets or sets the z-index of the annotation in maps.
     *
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;
}
/**
 * Gets or sets the options to customize the arrow in the navigation line.
 */
export class Arrow extends ChildProperty<Arrow> {
    /**
     * Gets or sets the type of the position to place the arrow in navigation lines.
     *
     * @default 'Start'
     */
    @Property('Start')
    public position: string;
    /**
     * Enables or disables the visibility of the arrow in navigation line.
     *
     * @default false
     */
    @Property('false')
    public showArrow: boolean;
    /**
     * Gets or sets the size of the arrow in navigation line in maps.
     *
     * @default 2
     */
    @Property(2)
    public size: number;
    /**
     * Gets or sets the color for the arrow in navigation line.
     *
     * @default 'black'
     */
    @Property('black')
    public color: string;
    /**
     * Gets or sets the offset value to position the arrow from the navigation line.
     *
     * @default 0
     */
    @Property(0)
    public offSet: number;
}

/**
 * Gets or sets the options to customize the style of the text in data label, legend and other texts in maps.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Gets or sets the size for the text in data label, legend and other texts.
     */
    @Property(null)
    public size: string;

    /**
     * Gets or sets the color for the text in data label, legend and other texts in maps.
     */
    @Property(null)
    public color: string;

    /**
     * Gets or sets the font family of the text in data label, legend and other texts in maps.
     */
    @Property('Roboto, Noto, Sans-serif')
    public fontFamily: string;

    /**
     * Gets or sets the font weight of the text in data label, legend and other texts in maps.
     */
    @Property('Medium')
    public fontWeight: string;

    /**
     * Gets or sets the style of the text in data label, legend and other texts in maps.
     */
    @Property('Medium')
    public fontStyle: string;

    /**
     * Gets or sets the opacity for the text in data label, legend and other texts in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}
/**
 * Specifies the options to customize the buttons in the zoom toolbar.
 */
export class ZoomToolbarButtonSettings extends ChildProperty<ZoomToolbarButtonSettings> {
    /**
     * Gets or sets the fill color of the button.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public fill: string;
    /**
     * Gets or sets the color of the icons inside the button.
     *
     * @default null
     */
    @Property(null)
    public color: string;
    /**
     * Gets or sets the opacity of the border of the button in the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderOpacity: number;
    /**
     * Gets or sets the width of the border of the button in the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderWidth: number;
    /**
     * Gets or sets the color of the border of the button in the zoom toolbar.
     *
     * @default null
     */
    @Property(null)
    public borderColor: string;
    /**
     * Gets or sets the radius of the button. This property is used to modify the size of the button.
     *
     * @default null
     */
    @Property(null)
    public radius: number;
    /**
     * Gets or sets the color of the icons inside the button when selection is performed.
     *
     * @default null
     */
    @Property(null)
    public selectionColor: string;
    /**
     * Gets or sets the color for the button when the mouse has hovered on the same.
     *
     * @default null
     */
    @Property(null)
    public highlightColor: string;
    /**
     * Gets or sets the padding space between each button.
     *
     * @default 5
     */
    @Property(5)
    public padding: number;
    /**
     * Gets or sets the opacity of the button.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the items that should be displayed in the Maps zoom toolbar. By default, zoom-in, zoom-out, and reset buttons are visible. Other options include selection zoom and panning.
     *
     * @default ZoomIn
     */
    @Property(['ZoomIn', 'ZoomOut', 'Reset'])
    public toolbarItems: ToolbarItem[];
}
/**
 * Specifies the options to customize the tooltip of the zoom toolbar.
 */
export class ZoomToolbarTooltipSettings extends ChildProperty<ZoomToolbarTooltipSettings> {
    /**
     * Enables or disables the tooltip of the zoom toolbar.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Gets or sets the background color of the tooltip of the zoom toolbar.
     *
     * @default 'white'
     */
    @Property('white')
    public fill: string;
    /**
     * Gets or sets the opacity of the border of the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderOpacity: number;
    /**
     * Gets or sets the width of the border of the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderWidth: number;
    /**
     * Gets or sets the color of the border of the tooltip of the zoom toolbar.
     *
     * @default '#707070'
     */
    @Property('#707070')
    public borderColor: string;
    /**
     * Gets or sets the color of the text in the tooltip of the zoom toolbar.
     *
     * @default 'black'
     */
    @Property('black')
    public fontColor: string;
    /**
     * Gets or sets the font family of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    @Property('')
    public fontFamily: string;
    /**
     * Gets or sets the font style of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    @Property('')
    public fontStyle: string;
    /**
     * Gets or sets the font weight of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    @Property('')
    public fontWeight: string;
    /**
     * Gets or sets the size of the text in the tooltip of the zoom toolbar.
     *
     * @default ''
     */
    @Property('')
    public fontSize: string;
    /**
     * Gets or sets the font opacity of the text in the tooltip of the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public fontOpacity: number;
}
/**
 * Sets and gets the options to customize the border of the zoom toolbar.
 */
export class ZoomToolbarSettings extends ChildProperty<ZoomToolbarSettings> {
    /**
     * Gets or sets the background color of the zoom toolbar.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public backgroundColor: string;
    /**
     * Gets or sets the opacity of the border of the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderOpacity: number;
    /**
     * Gets or sets the thickness of the border of the zoom toolbar.
     *
     * @default 1
     */
    @Property(1)
    public borderWidth: number;
    /**
     * Gets or sets the color of the border of the zoom toolbar.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public borderColor: string;
    /**
     * Gets or sets the placement of the zoom toolbar when it is placed horizontally.
     *
     * @default Far
     */
    @Property('Far')
    public horizontalAlignment: Alignment;
    /**
     * Gets or sets the placement of the zoom toolbar when it is placed vertically.
     *
     * @default Near
     */
    @Property('Near')
    public verticalAlignment: Alignment;
    /**
     * Gets or sets the orientation of the zoom toolbar.
     *
     * @default Horizontal
     */
    @Property('Horizontal')
    public orientation: Orientation;
    /**
     * Specifies the options to customize the buttons in the zoom toolbar.
     *
     */
    @Complex<ZoomToolbarButtonSettingsModel>({}, ZoomToolbarButtonSettings)
    public buttonSettings: ZoomToolbarButtonSettingsModel;
    /**
     * Specifies the options to customize the tooltip in the zoom toolbar.
     *
     */
    @Complex<ZoomToolbarTooltipSettingsModel>({ }, ZoomToolbarTooltipSettings)
    public tooltipSettings: ZoomToolbarTooltipSettingsModel;
}

/**
 * Gets or sets the options to customize the border of the maps.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Gets or sets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     */
    @Property('')
    public color: string;

    /**
     * Gets or sets the width of the border of the maps.
     */
    @Property(0)
    public width: number;
    /**
     * Gets or sets the opacity of the border of the maps.
     */
    @Property(null)
    public opacity: number;

}
/**
 * Gets or sets the values to change the center position of the maps.
 */
export class CenterPosition extends ChildProperty<CenterPosition> {

    /**
     * Gets or sets the latitude of the center position of maps.
     *
     * @default null
     */
    @Property(null)
    public latitude: number;

    /**
     * Gets or sets the longitude of the center position of maps.
     *
     * @default null
     */
    @Property(null)
    public longitude: number;

}
/**
 * Gets or sets the options to customize the tooltip of layers, markers, and bubble in maps.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables the tooltip visibility of layers, markers, and bubbles in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Gets or sets the tooltip template of layers, markers, and bubbles in maps to display custom elements as tooltip.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Function;
    /**
     * Gets or sets the color of the tooltip in layers, markers, and bubbles of maps.
     *
     * @default ''
     */
    @Property('')
    public fill: string;

    /**
     * Gets or sets the options for customizing the style properties of the border of the tooltip in layers, markers, and bubbles of maps.
     */
    @Complex<BorderModel>({ color: null, width: 1 }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the options for customizing the style of the text in tooltip for layers, markers, and bubbles of maps.
     */
    @Complex<FontModel>({ fontFamily: null, size: null, fontWeight : null }, Font)
    public textStyle: FontModel;

    /**
     * Gets or sets the format of the tooltip in layers, markers, and bubbles of maps.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Gets or sets the field name from the data source based on which the tooltip is visible on layers, markers, and bubbles of maps.
     * For the layer tooltip, the field name from the GeoJSON data can also be set.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * Specifies the value within which the tooltip will be removed on a mobile device. The value represents time in milliseconds.
     * If the value is set to 0, the tooltip will not be removed. If the value is set to greater than 0, the tooltip will be removed at the specified time.
     *
     * @default 2000
     */
    @Property(2000)
    public duration: number;
}
/**
 * Specifies the properties such as visibility, fill, border and text style to customize the tooltip.
 */
export class PolygonTooltipSettings extends ChildProperty<PolygonTooltipSettings> {
    /**
     * Shows or hides the tooltip of the polygon shapes. When this property is set as false, the tooltip for all the polygon shapes in a layer will not be visible.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Gets or sets the fill color for the tooltip of the polygon shape.
     *
     * @default ''
     */
    @Property('')
    public fill: string;

    /**
     * Gets or sets the attributes such as width, color and opacity of the border of the tooltip element of the polygon shape.
     */
    @Complex<BorderModel>({ color: null, width: 1 }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the font properties of the text content of the tooltip element of the polygon shape.
     */
    @Complex<FontModel>({ fontFamily: null, size: null, fontWeight : null }, Font)
    public textStyle: FontModel;

    /**
     * Specifies the value within which the tooltip will be removed on a mobile device. The value represents time in milliseconds.
     * If the value is set to 0, the tooltip will not be removed. If the value is set to greater than 0, the tooltip will be removed at the specified time.
     *
     * @default 2000
     */
    @Property(2000)
    public duration: number;
}
/**
 * Gets or sets the options to customize the margin of the maps.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Gets or sets the left margin of maps.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Gets or sets the right margin of maps.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Gets or sets the top margin of maps.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Gets or sets the bottom margin of maps.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Gets or sets the options to customize the lines that connect the markers in marker cluster of the maps.
 */
export class ConnectorLineSettings extends ChildProperty<ConnectorLineSettings> {
    /**
     * Gets or sets the color for connector line between the markers in marker cluster.
     *
     * @default '#000000'
     */
    @Property('#000000')
    public color: string;

    /**
     * Gets or sets the line width for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public width: number;

    /**
     * Gets or sets the opacity for connector line between the markers in marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}

/**
 * Gets or sets the options to customize the cluster of markers in maps.
 */
export class MarkerClusterSettings extends ChildProperty<MarkerClusterSettings> {
    /**
     * Enables or disables the visibility of the cluster of markers in the maps.
     *
     * @default false
     */
    @Property(false)
    public allowClustering: boolean;
    /**
     * Enables or disables intense marker clustering for improved accuracy.
     * The default value is true, and clustering logic will be executed twice for improved accuracy.
     * If set to false, the clustering logic will only be executed once, increasing performance while maintaining decent accuracy.
     *
     * @default true
     */
    @Property(true)
    public allowDeepClustering: boolean;
    /**
     * Gets or sets the options for customizing the style properties of the border of the clusters in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;
    /**
     * Gets or sets the fill color of the cluster.
     *
     * @default '#D2691E'
     */
    @Property('#D2691E')
    public fill: string;
    /**
     * Gets or sets the opacity of the marker cluster.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets shape of the marker cluster.
     *
     * @default Rectangle
     */
    @Property('Rectangle')
    public shape: MarkerType;

    /**
     * Gets or sets the width of the marker cluster in maps.
     *
     * @default 12
     */
    @Property(12)
    public width: number;

    /**
     * Gets or sets the height of the marker cluster in maps.
     *
     * @default 12
     */
    @Property(12)
    public height: number;
    /**
     * Gets or sets the offset value to position the marker cluster from the intended position in maps.
     */
    @Property(new Point(0, 0))
    public offset: Point;
    /**
     * Gets or sets the URL path for the marker cluster when the cluster shape is set as image in maps.
     *
     * @default ''
     */
    @Property('')
    public imageUrl: string;
    /**
     * Gets or sets the dash array for the marker cluster in maps.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;
    /**
     * Gets or sets the options to customize the label text in marker cluster.
     */
    @Complex<FontModel>({}, Font)
    public labelStyle: FontModel;
    /**
     * Enables or disables the expanding of the clusters when many markers are in same location.
     *
     * @default false
     */
    @Property(false)
    public allowClusterExpand: boolean;
    /**
     * Gets or sets the options to customize the connector line which is visible on cluster expand.
     */
    @Complex<ConnectorLineSettingsModel>({}, ConnectorLineSettings)
    public connectorLineSettings: ConnectorLineSettingsModel;
}
/**
 * Gets or sets the data in the marker cluster.
 */
export class MarkerClusterData extends ChildProperty<MarkerClusterData> {
    /**
     * Gets or sets the data for the marker cluster.
     *
     * @private
     */
    public data: Object[];
    /**
     * Gets or sets the index value for the layer in which the marker cluster is rendered.
     *
     * @private
     */
    public layerIndex: number;
    /**
     * Gets or sets the index value for the marker in the maps.
     *
     * @private
     */
    public markerIndex: number;
    /**
     * Gets or sets the index value for the marker in the maps.
     *
     * @private
     */
    public dataIndex: number;
    /**
     * Gets or sets the index value for cluster for which the click operation is triggered.
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
 * Gets or sets the options to customize the color-mapping in maps.
 */
export class ColorMappingSettings extends ChildProperty<ColorMappingSettings> {
    /**
     * Gets or sets the value from where the range for the color-mapping starts.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Gets or sets the value to where the range for the color-mapping ends.
     *
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public to: number;
    /**
     * Gets or sets the value from the data source to map the corresponding colors to the shapes.
     *
     * @default null
     */
    @Property(null)
    public value: string;
    /**
     * Gets or sets the color for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public color: string | string[];
    /**
     * Gets or sets the minimum opacity for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public minOpacity: number;
    /**
     * Gets or sets the maximum opacity for the color-mapping in maps.
     *
     * @default null
     */
    @Property(null)
    public maxOpacity: number;
    /**
     * Gets or sets the label for the color-mapping to display in the legend item text.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Enables or disables the visibility of legend for the corresponding color-mapped shapes in maps.
     *
     * @default true
     */
    @Property(true)
    public showLegend: boolean;
}

/**
 * Gets or sets the options to select the marker shape when the maps is loaded initially.
 * The initial selection of the markers will work only when the selection settings of marker is enabled.
 */
export class InitialMarkerSelectionSettings extends ChildProperty<InitialMarkerSelectionSettings> {

    /**
     * Specifies the latitude of the marker to be selected.
     *
     * @default null
     */
    @Property(null)
    public latitude: number;
    /**
     * Specifies the longitude of the marker to be selected.
     *
     * @default null
     */
    @Property(null)
    public longitude: number;
}

/**
 * Gets or sets the options to select the shapes when the maps is loaded initially.
 * The initial selection of the shapes will work only when the selection settings of layer is enabled.
 */
export class InitialShapeSelectionSettings extends ChildProperty<InitialShapeSelectionSettings> {

    /**
     * Gets or sets the property name from the data source in maps.
     *
     * @default null
     */
    @Property(null)
    public shapePath: string;
    /**
     * Gets or sets the value from the data source which is bound to the shape in maps.
     *
     * @default null
     */
    @Property(null)
    public shapeValue: string;
}
/**
 * Gets or sets the options to customize the maps on selecting the shapes.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {

    /**
     * Enables or disables the selection for the layers, markers and bubbles in maps.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Gets or sets the color for the shape that is selected.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Gets or sets the opacity for the shape that is selected.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Enables or disables the selection of multiple shapes in maps.
     *
     * @default false
     */
    @Property(false)
    public enableMultiSelect: boolean;

    /**
     * Gets or sets the options for customizing the color and width of the border of selected shapes in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;
}
/**
 * Gets or sets the options to customize the shapes on which the mouse has hovered in maps.
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {

    /**
     * Gets or sets the color for the shapes on which the mouse has hovered in maps.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Enables or disables the highlight functionality of the layers in maps.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Gets or sets the opacity for the highlighted shapes in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the options for customizing the style properties of the border of the highlighted shapes in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

}
/**
 * Defines the properties for a single polygon shape to render over the Maps, such as coordinates, fill, border, and opacity.
 */
export class PolygonSetting extends ChildProperty<PolygonSettings> {
    /**
     * Gets or sets the width of the border of the polygon shape.
     *
     * @default 1
     */
    @Property(1)
    public borderWidth: number;
    /**
     * Gets or sets the opacity of the border of the polygon shape.
     *
     * @default 1
     */
    @Property(1)
    public borderOpacity: number;
    /**
     * Gets or sets the opacity of the polygon shape.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the color to be used in the border of the polygon shape.
     *
     * @default 'black'
     */
    @Property('#FF471A')
    public borderColor: string;
    /**
     * Gets or sets the color to be filled in the polygon shape.
     *
     * @default 'black'
     */
    @Property('#FF471A')
    public fill: string;
    /**
     * Gets or sets the points that define the polygon shape.
     * This property holds a collection of coordinates that define the polygon shape.
     *
     * @default []
     */
    @Property([])
    public points: Coordinate[];
    /**
     * Specifies the tooltip text to be displayed for the polygon shape. If it is not set, the tooltip will not be displayed.
     *
     * @default ''
     */
    @Property('')
    public tooltipText: string;
    /**
     * Specifies any HTML content as a tooltip on the polygon shape. If it is not set, the tooltip will not be displayed.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public tooltipTemplate: string | Function;
}

/**
 * Defines the properties of the polygon shapes that will be rendered on a map layer.
 * The selection and highlight settings for polygon shapes can also be defined.
 */
export class PolygonSettings extends ChildProperty<PolygonSettings> {
    /**
     * Gets or sets the properties of all the polygon shapes that will be displayed in a layer.
     * {% codeBlock src='maps/polygonSettingsPolygons/index.md' %}{% endcodeBlock %}
     */
    @Collection<PolygonSettingModel>([], PolygonSetting)
    public polygons: PolygonSettingModel[];
    /**
     * Gets or sets the properties for selecting polygon shapes in a map layer.
     * {% codeBlock src='maps/polygonSettingsSelectionSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Gets or sets the properties for highlighting polygon shapes in a map layer.
     * {% codeBlock src='maps/polygonSettingsHighlightSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Specifies the properties such as visibility, fill, border and text style to customize the tooltip.
     * {% codeBlock src='maps/polygonSettingsTooltipSettings/index.md' %}{% endcodeBlock %}
     */
    @Complex<PolygonTooltipSettingsModel>({}, PolygonTooltipSettings)
    public tooltipSettings: PolygonTooltipSettingsModel;
}
/**
 * Gets or sets the options to customize the navigation lines in maps which is used to connect different locations.
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
     * Gets or sets the width of the navigation lines in maps.
     *
     * @default 1
     */
    @Property(1)
    public width: number;
    /**
     * Gets or sets the longitude for the navigation lines to be drawn in maps.
     *
     * @default []
     */
    @Property(null)
    public longitude: number[];
    /**
     * Gets or sets the latitude value for the navigation lines to be drawn in maps.
     *
     * @default []
     */
    @Property(null)
    public latitude: number[];
    /**
     * Gets or sets the dash-array for the navigation lines drawn in maps.
     *
     * @default ''
     */
    @Property('')
    public dashArray: string;
    /**
     * Gets or sets the color for the navigation lines in maps.
     *
     * @default 'black'
     */
    @Property('black')
    public color: string;
    /**
     * Gets or sets the angle of the curve connecting different locations in maps.
     *
     * @default 0
     */
    @Property(0)
    public angle: number;
    /**
     * Gets or sets the options to customize the arrow for the navigation line in maps.
     */
    @Complex<ArrowModel>({ showArrow: false, position: 'Start', size: 5, color: 'black' }, Arrow)
    public arrowSettings: ArrowModel;
    /**
     * Gets or sets the selection settings of the navigation line in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Gets or sets the highlight settings of the navigation line in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}
/**
 * Gets or sets the options to customize the bubble elements in the maps.
 */
export class BubbleSettings extends ChildProperty<BubbleSettings> {
    /**
     * Gets or sets the options to customize the style properties of the border for the bubbles in maps.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Enables or disables the visibility of the bubbles in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Gets or sets the data source for the bubble.
     * The data source must contain the size value of the bubble that can be bound to the bubble
     * of the maps using the `valuePath` property in the `bubbleSettings`.
     * The data source can contain data such as color and other informations that can be bound to the bubble and tooltip of the bubble.
     *
     * @isObservable true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager;
    /**
     * Gets or sets the query to select particular data from the bubble data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;
    /**
     * Gets or sets the duration for the animation of the bubbles in maps.
     *
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Gets or sets the delay in animation for the bubbles in maps.
     *
     * @default 0
     */
    @Property(0)
    public animationDelay: number;

    /**
     * Gets or sets the color for the bubbles in maps.
     *
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * Gets or sets the minimum radius for the bubbles in maps.
     *
     * @default 10
     */
    @Property(10)
    public minRadius: number;
    /**
     * Gets or sets the maximum radius for the bubbles in maps.
     *
     * @default 20
     */
    @Property(20)
    public maxRadius: number;
    /**
     * Gets or sets the opacity of the bubbles in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the field name from the data source of bubble settings based on which the bubbles are rendered on the maps.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * Gets or sets the type of the bubble in maps.
     *
     * @default Circle
     */
    @Property('Circle')
    public bubbleType: BubbleType;
    /**
     * Gets or sets the field name from the data source of bubble settings to set the color for each bubble in maps.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Gets or sets the color-mapping for the bubbles in maps.
     *
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];

    /**
     * Gets or sets the options to customize the tooltip of the bubbles in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Gets or sets the options to customize the selection of the bubbles in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Gets or sets the options to customize the highlight of the bubbles in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}

/**
 * Gets or sets the options to customize the title of the maps.
 */
export class CommonTitleSettings extends ChildProperty<CommonTitleSettings> {
    /**
     * Gets or sets the text for the title in maps.
     *
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * Gets or sets the description of the title in maps for assistive technology.
     *
     * @default ''
     */
    @Property('')
    public description: string;
}
/**
 * Gets or sets the options to customize the subtitle of the maps.
 */
export class SubTitleSettings extends CommonTitleSettings {
    /**
     * Gets or sets the options for customizing the text in the subtitle of the maps.
     */
    @Complex<FontModel>({ size: null, fontWeight: null, fontFamily: null }, Font)
    public textStyle: FontModel;
    /**
     * Gets or sets the alignment of the subtitle of the maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
}
/**
 * Gets or sets the options to customize the title of the maps.
 */
export class TitleSettings extends CommonTitleSettings {
    /**
     * Gets or sets the options for customizing the text of the title in maps.
     */
    @Complex<FontModel>({ size: null, fontWeight: null, fontFamily: null }, Font)
    public textStyle: FontModel;
    /**
     * Gets or sets the alignment of the title of the maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * Gets or sets the options to customize the subtitle of the maps.
     */
    @Complex<SubTitleSettingsModel>({}, SubTitleSettings)
    public subtitleSettings: SubTitleSettingsModel;
}
/**
 * Gets or sets the options to configure maps zooming operations.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {
    /**
     * Enables or disables the zooming operation in the maps.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Enables or disables the panning operation in the maps.
     *
     * @default true
     */
    @Property(true)
    public enablePanning: boolean;

    /**
     * Enables or disables the selection zooming operation in the maps.
     *
     * @default true
     */
    @Property(true)
    public enableSelectionZooming: boolean;
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
    @Property(true)
    public pinchZooming: boolean;
    /**
     * Enables or disables the zooming on clicking the shapes in maps.
     *
     * @default false
     */
    @Property(false)
    public zoomOnClick: boolean;
    /**
     * Gets or sets the factor of zoom to be displayed while rendering the maps.
     *
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Gets or sets the maximum zooming value in maps.
     *
     * @default 10
     */
    @Property(10)
    public maxZoom: number;
    /**
     * Gets or sets the minimum zooming value in maps.
     *
     * @default 1
     */
    @Property(1)
    public minZoom: number;
    /**
     * Enables or disables the ability to zoom based on the marker position while rendering the maps.
     *
     * @default false
     */
    @Property(false)
    public shouldZoomInitially: boolean;
    /**
     * Enables or disables the zoom to set to the initial State.
     *
     * @default true
     */
    @Property(true)
    public resetToInitial: boolean;
    /**
     * Gets or sets the detailed options to customize the entire zoom toolbar.
     */
    @Complex<ZoomToolbarSettingsModel>({ }, ZoomToolbarSettings)
    public toolbarSettings: ZoomToolbarSettingsModel;

}

/**
 * Gets or sets the settings to customize the color-mapping visibility based on the legend visibility.
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
     * Specifies whether the property of the shape settings is to be set while toggling the legend item.
     *
     * @default true
     */
    @Property(true)
    public applyShapeSettings: boolean;
    /**
     * Gets or sets the opacity for the shape of the legend item which is toggled.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the color of the shape of the legend item which is toggled.
     *
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * Gets or sets the options to customize the style properties of the border for the shape in maps.
     */
    @Complex<BorderModel>({ color: '', width: 0 }, Border)
    public border: BorderModel;
}
/**
 * Gets or sets the options to customize the legend of the maps.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Enables or disables to render the legend item based on the shapes from the data source of markers.
     *
     * @default false
     */
    @Property(false)
    public useMarkerShape: boolean;
    /**
     * Enables or disables the toggle visibility of the legend in maps.
     *
     * @default false
     */
    @Property(false)
    public toggleVisibility: boolean;
    /**
     * Enables or disables the visibility of the legend in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Gets or sets the background color for the legend in maps.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;

    /**
     * Gets or sets the type of the legend in maps.
     *
     * @default Layers
     */
    @Property('Layers')
    public type: LegendType;

    /**
     * Enables or disables the visibility of the inverted pointer in interactive legend in maps.
     *
     * @default false
     */
    @Property(false)
    public invertedPointer: boolean;

    /**
     * Gets or sets the position of the label in legend.
     *
     * @default After
     */
    @Property('After')
    public labelPosition: LabelPosition;
    /**
     * Gets or sets the action to perform when the legend item text intersects with others.
     *
     * @default None
     */
    @Property('None')
    public labelDisplayMode: LabelIntersectAction;
    /**
     * Gets or sets the shape of the legend in maps.
     *
     * @default Circle
     */
    @Property('Circle')
    public shape: LegendShape;

    /**
     * Gets or sets the width of the legend in maps.
     *
     * @default ''
     */
    @Property('')
    public width: string;

    /**
     * Gets or sets the height of the legend in maps.
     *
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Gets or sets the options for customizing the text styles of the legend item text in maps.
     */
    @Complex<FontModel>({ fontFamily: null, fontWeight: null }, Font)
    public textStyle: FontModel;

    /**
     * Gets or sets the width of the shapes in legend.
     *
     * @default 15
     */
    @Property(15)
    public shapeWidth: number;

    /**
     * Gets or sets the height of the shapes in legend.
     *
     * @default 15
     */
    @Property(15)
    public shapeHeight: number;

    /**
     * Gets or sets the padding for the shapes in legend.
     *
     * @default 10
     */
    @Property(10)
    public shapePadding: number;

    /**
     * Gets or sets the options for customizing the style properties of the legend border.
     */
    @Complex<BorderModel>({ color: null, width: 0 }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the options for customizing the style properties of the border of the shapes of the legend items.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public shapeBorder: BorderModel;

    /**
     * Gets or sets the title for the legend in maps.
     */
    @Complex<CommonTitleSettingsModel>({}, CommonTitleSettings)
    public title: CommonTitleSettingsModel;

    /**
     * Gets or sets the options for customizing the style of the title of the legend in maps.
     */
    @Complex<FontModel>({ size: null, color: Theme.legendTitleFont.color, fontStyle: Theme.legendTitleFont.fontStyle, fontWeight: null,  fontFamily: null }, Font)
    public titleStyle: FontModel;

    /**
     * Gets or sets the position of the legend in maps.
     *
     * @default Bottom
     */
    @Property('Bottom')
    public position: LegendPosition;

    /**
     * Gets or sets the alignment of the legend in maps.
     *
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Gets or sets the orientation of the legend in maps.
     *
     * @default None
     */
    @Property('None')
    public orientation: LegendArrangement;

    /**
     * Gets or sets the location of the legend in pixels when the legend position is set as `Float`.
     */
    @Property({ x: 0, y: 0 })
    public location: RelativePoint | Point;

    /**
     * Gets or sets the color of the legend in maps.
     *
     * @default null
     */
    @Property(null)
    public fill: string;

    /**
     * Gets or sets the opacity for the legend in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Gets or sets the mode of the legend in maps. The modes available are default and interactive modes.
     *
     * @default Default
     */
    @Property('Default')
    public mode: LegendMode;

    /**
     * Gets or sets the field name from the data source which is used to provide visibility state for each legend item.
     *
     * @default null
     */
    @Property(null)
    public showLegendPath: string;

    /**
     * Set and gets the field name from the data source to display the legend item text.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;

    /**
     * Enables or disables the ability to remove the duplicate legend item.
     *
     * @default false
     */
    @Property(false)
    public removeDuplicateLegend: boolean;

    /**
     * Gets or sets the options for customizing the color and border width of the shape related to the legend when selecting the legend.
     */
    @Complex<ToggleLegendSettingsModel>({}, ToggleLegendSettings)
    public toggleLegendSettings: ToggleLegendSettingsModel;
}
/**
 * Gets or sets the options to customize the data labels in maps.
 */
export class DataLabelSettings extends ChildProperty<DataLabelSettings> {
    /**
     * Enables or disables the visibility of data labels in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Gets or sets the options for customizing the style properties of the border of the data labels.
     */
    @Complex<BorderModel>({ width: 0, color: 'transparent' }, Border)
    public border: BorderModel;
    /**
     * Gets or sets the background color for the data labels in maps.
     *
     * @default 'black'
     */
    @Property('black')
    public fill: string;
    /**
     * Gets or sets the opacity of the data labels in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the x position for the data labels.
     *
     * @default 10
     */
    @Property(5)
    public rx: number;

    /**
     * Gets or sets the y position for the data labels in maps.
     *
     * @default 10
     */
    @Property(5)
    public ry: number;
    /**
     * Gets or sets the options for customizing the styles of the text in data labels.
     */
    @Complex<FontModel>({fontWeight: null}, Font)
    public textStyle: FontModel;
    /**
     * Gets or sets the field name from the data source based on which the data labels gets rendered.
     * The field name from the GeoJSON data can also be set.
     *
     * @default ''
     */
    @Property('')
    public labelPath: string;
    /**
     * Gets or sets the action to be performed when the data labels exceeds the shape over which it is rendered.
     *
     * @default None
     */
    @Property('None')
    public smartLabelMode: SmartLabelMode;
    /**
     * Gets or sets the action to be performed when a data-label intersect with other data labels in maps.
     *
     * @default None
     */
    @Property('None')
    public intersectionAction: IntersectAction;
    /**
     * Gets or sets the template for the data labels to render custom elements.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Gets and sets the duration time for animating the data label.
     *
     * @default 0
     */
    @Property(0)
    public animationDuration: number;
}
/**
 * Gets or sets the options to customize the shapes in the maps.
 */
export class ShapeSettings extends ChildProperty<ShapeSettings> {
    /**
     * Gets or sets the color of the shapes in maps.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Gets or sets a set of colors for the shapes in maps.
     *
     * @default []
     */
    @Property([])
    public palette: string[];

    /**
     * Gets or sets the radius of the "Point" and "MultiPoint" geometry shapes.
     * This property will be applicable only when the GeoJSON data has "Point" and "MultiPoint" geometry types.
     */
    @Property(5)
    public circleRadius: number;

    /**
     * Gets or sets the options for customizing the style properties of the border for the shapes in maps.
     */
    @Complex<BorderModel>({ width: null, color: null }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the dash-array for the shapes in maps.
     */
    @Property('')
    public dashArray: string;

    /**
     * Gets or sets the opacity for the shapes in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Gets or sets the field name from the data source to set the color for the shapes in maps.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * Gets or sets the field name from the data source to set the color for the border of a particular shape in maps.
     *
     * @default null
     */
    @Property(null)
    public borderColorValuePath: string;
    /**
     * Gets or sets the field name from the data source to set the width for the border of a particular shape in maps.
     *
     * @default null
     */
    @Property(null)
    public borderWidthValuePath: string;
    /**
     * Gets or sets the value from the data source based on which the shape gets rendered.
     *
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * Gets or sets the options to map the color for some set of the shapes in maps.
     *
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];
    /**
     * Enables or disables the filling of color, based on the palette, for the shapes automatically.
     *
     * @default false
     */
    @Property(false)
    public autofill: boolean;
}

/**
 * Gets or sets the options to customize the markers in the maps.
 */
export class MarkerBase extends ChildProperty<MarkerBase> {

    /**
     * Gets or sets the options for customizing the style properties of the border of the marker in maps.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Gets or sets the dash-array for the marker.
     */
    @Property(null)
    public dashArray: string;

    /**
     * Enables or disables the visibility of the markers in maps.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Enables or disables marker drag and drop functionality at any location on the map.
     *
     * @default false
     */
    @Property(false)
    public enableDrag: boolean;

    /**
     * Gets or sets the color for the marker in maps.
     *
     * @default '#FF471A'
     */
    @Property('#FF471A')
    public fill: string;

    /**
     * Gets or sets the field name from the data source that determines the marker height.
     *
     * @default null
     */
    @Property(null)
    public heightValuePath: string;

    /**
     * Gets or sets the field name from the data source that determines the marker width.
     *
     * @default null
     */
    @Property(null)
    public widthValuePath: string;

    /**
     * Gets or sets the height of the marker in maps.
     *
     * @default 10
     */
    @Property(10)
    public height: number;

    /**
     * Gets or sets the width of the marker in maps.
     *
     * @default 10
     */
    @Property(10)
    public width: number;

    /**
     * Gets or sets the opacity for the marker in maps.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * Gets or sets the field name from the marker data source based on which the color is applied for the marker.
     *
     * @default null
     */
    @Property(null)
    public colorValuePath: string;

    /**
     * Gets or sets the field name from the marker data source based on which the shape for individual markers are set.
     *
     * @default null
     */
    @Property(null)
    public shapeValuePath: string;

    /**
     * Gets or sets the field name from the marker data source based on which the image source for the image type marker is got individually.
     *
     * @default null
     */
    @Property(null)
    public imageUrlValuePath: string;

    /**
     * Gets or sets the shape of the marker in maps.
     *
     * @default Balloon
     */
    @Property('Balloon')
    public shape: MarkerType;

    /**
     * Gets or sets the field name from the marker data source to render legend item text for the marker legend.
     *
     * @default ''
     */
    @Property('')
    public legendText: string;
    /**
     * Gets or sets the offset value from which the marker must be rendered from the intended position.
     *
     */
    @Property(new Point(0, 0))
    public offset: Point;
    /**
     * Gets or sets the URL for rendering the marker as image. This property acts as image source for all the markers in a marker settings.
     */
    @Property('')
    public imageUrl: string;

    /**
     * Gets or sets the template for the marker to render custom elements.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public template: string | Function;
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
    @Property([])
    public dataSource: Object[] | DataManager;

    /**
     * Gets or sets the query to select particular data from the marker data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Gets or sets the options to customize the tooltip of the marker in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;

    /**
     * Gets or sets the duration time for animating the marker.
     *
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Gets or sets the delay time for the animation in marker.
     *
     * @default 0
     */
    @Property(0)
    public animationDelay: number;
    /**
     * Gets or sets the options to customize the marker while selecting the marker in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Gets or sets the options to customize the marker when the mouse hovers over the markers in maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Defines the field name from the marker data source for setting latitude for a set of markers.
     */
    @Property(null)
    public latitudeValuePath: string;

    /**
     * Defines the field name from the marker data source for setting longitude for a set of markers.
     */
    @Property(null)
    public longitudeValuePath: string;

    /**
     * Gets or sets the options to select the markers at the initial rendering time of the maps.
     * The initial selection of markers will be performed only when the selection functionality of marker is enabled.
     */
    @Collection<InitialMarkerSelectionSettingsModel>([], InitialMarkerSelectionSettings)
    public initialMarkerSelection: InitialMarkerSelectionSettingsModel[];

    /**
     * Gets or sets the options for customizing the clustering of markers on the map.
     * This property is used to cluster markers based on the current marker settings, and it is applied only when the `allowClustering` property is enabled.
     */
    @Complex<MarkerClusterSettingsModel>({}, MarkerClusterSettings)
    public clusterSettings: MarkerClusterSettingsModel;

}

/**
 * Gets or sets the options to customize the markers in the maps.
 */
export class MarkerSettings extends MarkerBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
    // eslint-enable @typescript-eslint/no-explicit-any
    // eslint-enable @typescript-eslint/explicit-module-boundary-types
}

/**
 * Gets or sets the options to customize the layers of the maps.
 */
export class LayerSettings extends ChildProperty<LayerSettings> {
    /**
     * Gets or sets the data for the maps to render.
     * The data is normally JSON object with GeoJSON format that defines the shapes and geometries of the map.
     *
     * @isObservable true
     * @default null
     */
    @Property(null)
    public shapeData: Object | DataManager | MapAjax;

    /**
     * Gets or sets the query to select particular data from the layer data source.
     * This property is applicable only when the data source is created by data manager.
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Gets or sets the options to customize the shape of the maps.
     */
    @Complex<ShapeSettingsModel>({}, ShapeSettings)
    public shapeSettings: ShapeSettingsModel;

    /**
     * Gets or sets the data source for the layer.
     * The data bound to the shapes using data source can be used to display the tooltip, marker, and bubble.
     *
     * @isObservable true
     * @default []
     */
    @Property([])
    public dataSource: Object[] | DataManager | MapAjax;
    /**
     * Gets or sets the type of the layer in maps. There are two types: Layer and SubLayer.
     *
     * @default Layer
     */
    @Property('Layer')
    public type: Type;
    /**
     * Gets or sets the geometry type for the layer in maps. There are two types: Geographic and Normal.
     * - Geographic type renders the shape maps with geographical coordinate system.
     * - Normal type renders the shape maps using default coordinate system.
     *
     * @default Geographic
     */
    @Property('Geographic')
    public geometryType: GeometryType;
    /**
     * Gets or sets the URL of the online map providers.
     * The online map providers will be rendered only when the shape data is not set and layer type is set with default value.
     *
     * @default ''
     */
    @Property('')
    public urlTemplate: string;
    /**
     * Enables or disables the visibility of the layers in maps.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Gets or sets the field name from the GeoJSON data to map the shape to the data defined in the layer data source.
     *
     * @default 'name'
     */
    @Property('name')
    public shapeDataPath: string;
    /**
     * Gets or sets the field name from the data source to map the shape to the data defined in the layer data source.
     *
     * @default 'name'
     */
    @Property('name')
    public shapePropertyPath: string | string[];
    /**
     * Gets or sets the duration of the animation of layers when the zooming is performed in maps.
     *
     * @default 0
     */
    @Property(0)
    public animationDuration: number;

    /**
     * Gets or sets the options for customizing the markers in maps.
     */
    @Collection<MarkerSettingsModel>([], MarkerSettings)
    public markerSettings: MarkerSettingsModel[];
    /**
     * Gets or sets the options for customizing the cluster of markers in maps.
     */
    @Complex<MarkerClusterSettingsModel>({}, MarkerClusterSettings)
    public markerClusterSettings: MarkerClusterSettingsModel;
    /**
     * Gets or sets the options for customizing the data labels in maps.
     */
    @Complex<DataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabelSettings: DataLabelSettingsModel;
    /**
     * Gets or sets the options for customizing the bubbles in maps.
     */
    @Collection<BubbleSettingsModel>([], BubbleSettings)
    public bubbleSettings: BubbleSettingsModel[];
    /**
     * Gets or sets the options for customizing the navigation lines in maps.
     */
    @Collection<NavigationLineSettingsModel>([], NavigationLineSettings)
    public navigationLineSettings: NavigationLineSettingsModel[];
    /**
     * Gets or sets the properties of the polygon shapes that will be rendered on a map layer.
     * The selection and highlight settings for polygon shapes can also be defined.
     */
    @Complex<PolygonSettingsModel>({}, PolygonSettings)
    public polygonSettings: PolygonSettingsModel;
    /**
     * Gets or sets the options for customizing the tooltip of the layers in maps.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * Gets or sets the options for customizing the shapes when clicking on the shapes in maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * Gets or sets the options for customizing the shapes when the mouse hovers over maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
    /**
     * Gets or sets the options for customizing the toggle state of shapes when selecting the legend in maps.
     */
    @Complex<ToggleLegendSettingsModel>({}, ToggleLegendSettings)
    public toggleLegendSettings: ToggleLegendSettingsModel;
    /**
     * Gets or sets the settings for the shapes to be selected when the maps rendering initially.
     * The initial selection of shapes will be performed only when the selection functionality of layer is enabled.
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
 * Gets or sets the options to customize the area around the shapes in the map layer.
 */
export class MapsAreaSettings extends ChildProperty<MapsAreaSettings> {
    /**
     * Gets or sets the background color for the map area.
     *
     * @default null
     */
    @Property(null)
    public background: string;

    /**
     * Gets or sets the options for customizing the style properties of the border of maps area.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

}
