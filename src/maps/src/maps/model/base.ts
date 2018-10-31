/**
 * Maps base document
 */
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Alignment, LegendPosition, LegendType, LegendMode, ShapeLayerType, Type, MarkerType, Orientation, MapAjax } from '../../index';
import { SmartLabelMode, IntersectAction } from '../../index';
import { BorderModel, ColorMappingSettingsModel, FontModel, CommonTitleSettingsModel, NavigationLineSettingsModel } from './base-model';
import { MarkerSettingsModel, ShapeSettingsModel, BubbleSettingsModel, ArrowModel } from './base-model';
import { DataLabelSettingsModel, TooltipSettingsModel, SubTitleSettingsModel, SelectionSettingsModel } from './base-model';
import { HighlightSettingsModel } from './base-model';
import { Theme } from './theme';
import { Point, GeoLocation } from '../utils/helper';
import { BingMapType, LegendArrangement, LegendShape, BubbleType } from '../utils/enum';
import { AnnotationAlignment, GeometryType, LabelPosition, LabelIntersectAction } from '../index';


/**
 * Options for customizing the annotation.
 */

export class Annotation extends ChildProperty<Annotation> {

    /**
     * Specifies the id of html element.
     */
    @Property('')
    public content: string;

    /**
     * Specifies the position of x.
     */
    @Property('0px')
    public x: string;

    /**
     * Specifies the position of y.
     */
    @Property('0px')
    public y: string;

    /**
     * Specifies the vertical alignment of annotation.
     * @default None
     */
    @Property('None')
    public verticalAlignment: AnnotationAlignment;

    /**
     * Specifies the horizontal alignment of annotation.
     * @default None
     */
    @Property('None')
    public horizontalAlignment: AnnotationAlignment;

    /**
     * Specifies the zIndex of the annotation.
     * @default '-1'
     */
    @Property('-1')
    public zIndex: string;
}
export class Arrow extends ChildProperty<Arrow> {
    /**
     * arrowPosition
     */
    @Property('Start')
    public position: string;
    /**
     * show
     */
    @Property('false')
    public showArrow: boolean;
    /**
     * size
     */
    @Property(2)
    public size: number;
    /**
     * color
     */
    @Property('black')
    public color: string;
    /**
     * offset the arrow in navigation line by specified pixels
     */
    @Property(0)
    public offSet: number;
}

/**
 * Configures the fonts in maps.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Font size for the text.
     */
    @Property(null)
    public size: string;

    /**
     * Color for the text.
     */
    @Property(null)
    public color: string;

    /**
     * FontFamily for the text.
     */
    @Property(null)
    public fontFamily: string;

    /**
     * FontWeight for the text.
     */
    @Property(null)
    public fontWeight: string;

    /**
     * FontStyle for the text.
     */
    @Property(null)
    public fontStyle: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;
}
/**
 * Configures the borders in the maps.
 */
export class Border extends ChildProperty<Border> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     */
    @Property('')
    public color: string;

    /**
     * The width of the border in pixels.
     */
    @Property(0)
    public width: number;

}
/**
 * To configure the tooltip settings of the maps.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Toggle the tooltip visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * To customize the tooltip template.
     * @default ''
     */
    @Property('')
    public template: string;
    /**
     * To customize the fill color of the tooltip.
     * @default '#363F4C'
     */
    @Property('#363F4C')
    public fill: string;

    /**
     * Options for customizing the color and width of the tooltip.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing text styles of the tooltip.
     */
    @Complex<FontModel>(Theme.tooltipLabelFont, Font)
    public textStyle: FontModel;
    /**
     * To customize the format of the tooltip.
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * To customize the value of the tooltip.
     * @default null
     */
    @Property(null)
    public valuePath: string;
}
/**
 * Configures the maps margins.
 */
export class Margin extends ChildProperty<Margin> {

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
 * To configure ColorMapping in Maps
 */
export class ColorMappingSettings extends ChildProperty<ColorMappingSettings> {
    /**
     * To configure from
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * To configure to
     * @aspDefaultValueIgnore
     * @default null
     */
    @Property(null)
    public to: number;
    /**
     * To configure value
     * @default null
     */
    @Property(null)
    public value: string;
    /**
     * To configure color
     * @default null
     */
    @Property(null)
    public color: string;
    /**
     * To configure labels
     * @default null
     */
    @Property(null)
    public label: string;
}
/**
 * To configure the selection settings
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {

    /**
     * Toggle the selection settings.
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * To customize the fill color of the Selection.
     * @default '#D2691E'
     */
    @Property('#D2691E')
    public fill: string;
    /**
     * To customize the opacity of the Selection.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Toggle the multi selection.
     * @default false
     */
    @Property(false)
    public enableMultiSelect: boolean;
    /**
     * Options for customizing the color and width of the selection.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;
}
/**
 * To configure the highlight settings
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {

    /**
     * To customize the fill color of the highlight.
     * @default '#6B8E23'
     */
    @Property('#6B8E23')
    public fill: string;
    /**
     * Toggle the highlight settings.
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * To customize the opacity of the highlight.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Options for customizing the color and width of the highlight.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 0 }, Border)
    public border: BorderModel;

}
/**
 * NavigationSelectedLine
 */
export class NavigationLineSettings extends ChildProperty<NavigationLineSettings> {
    /**
     * NavigationSelectedLine visible
     *  @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Configures the label border
     * @default 1
     */
    @Property(1)
    public width: number;
    /**
     * NavigationSelectedLine longitude
     *  @default []
     */
    @Property(null)
    public longitude: number[];
    /**
     * NavigationSelectedLine latitude
     *  @default []
     */
    @Property(null)
    public latitude: number[];
    /**
     * dashArray
     *  @default ''
     */
    @Property('')
    public dashArray: string;
    /**
     * NavigationSelectedLine color
     */
    @Property('black')
    public color: string;
    /**
     * Specifies the angle of curve connecting different locations in map
     * @default 0
     */
    @Property(0)
    public angle: number;
    /**
     * arrow
     */
    @Complex<ArrowModel>({ showArrow: false, position: 'Start', size: 5, color: 'black' }, Arrow)
    public arrowSettings: ArrowModel;
    /**
     * To configure the selection settings of the maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * To configure the highlight settings of the maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}
/**
 * Bubble settings model class
 */
export class BubbleSettings extends ChildProperty<BubbleSettings> {
    /**
     * Configures the bubble border
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Toggle the visibility of bubble
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Specifies the data source for bubble.
     * @default []
     */
    @Property([])
    public dataSource: object[];
    /**
     * To configure bubble animation duration
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Animation duration
     * @default 0
     */
    @Property(0)
    public animationDelay: number;

    /**
     * To configure bubble fill color
     * @default ''
     */
    @Property('')
    public fill: string;
    /**
     * To configure bubble minRadius
     * @default 10
     */
    @Property(10)
    public minRadius: number;
    /**
     * To configure bubble maxRadius
     * @default 20
     */
    @Property(20)
    public maxRadius: number;
    /**
     * To configure bubble opacity
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To configure bubble valuePath
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * To configure bubble shape type
     * @default Circle
     */
    @Property('Circle')
    public bubbleType: BubbleType;
    /**
     * To configure bubble colorValuePath
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * To configure bubble colorMapping
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];

    /**
     * To configure the tooltip settings of the bubble .
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * To configure the selection settings of the maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * To configure the highlight settings of the maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;
}

/**
 * To configure title of the maps.
 */
export class CommonTitleSettings extends ChildProperty<CommonTitleSettings> {
    /**
     * To customize the text of the title.
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * To customize title description for the accessibility.
     * @default ''
     */
    @Property('')
    public description: string;
}
/**
 * To configure subtitle of the maps.
 */
export class SubTitleSettings extends CommonTitleSettings {
    /**
     * Options for customizing title styles of the Maps.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
    /**
     * text alignment
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
}
/**
 * To configure title of the maps.
 */
export class TitleSettings extends CommonTitleSettings {
    /**
     * Options for customizing title styles of the Maps.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
    /**
     * text alignment
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * To configure sub title of maps.
     */
    @Complex<SubTitleSettingsModel>({}, SubTitleSettings)
    public subtitleSettings: SubTitleSettingsModel;
}
/**
 * Options to configure maps Zooming Settings.
 */
export class ZoomSettings extends ChildProperty<ZoomSettings> {
    /**
     * Toggle the visibility of zooming.
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Configures tool bar orientation
     * @default Horizontal
     */
    @Property('Horizontal')
    public toolBarOrientation: Orientation;

    /**
     * Specifies the tool bar color.
     */
    @Property(null)
    public color: string;
    /**
     * Specifies the tool bar highlight color.
     */
    @Property('#e61576')
    public highlightColor: string;
    /**
     * Specifies the tool bar selection color.
     * 
     */
    @Property('#e61576')
    public selectionColor: string;

    /**
     * Configures vertical placement of tool bar 
     * @default Far
     */
    @Property('Far')
    public horizontalAlignment: Alignment;

    /**
     * Configures vertical placement of tool bar 
     * @default Near
     */
    @Property('Near')
    public verticalAlignment: Alignment;
    /**
     * To configure zooming items.
     */
    @Property(['ZoomIn', 'ZoomOut', 'Reset'])
    public toolbars: string[];
    /**
     * Toggle the mouse wheel zooming.
     * @default true
     */
    @Property(true)
    public mouseWheelZoom: boolean;

    /**
     * Double tab zooming
     * @default false
     */
    @Property(false)
    public doubleClickZoom: boolean;
    /**
     * Toggle the pinch zooming.
     * @default true
     */
    @Property(false)
    public pinchZooming: boolean;
    /**
     * Toggle the selection on zooming.
     * @default false
     */
    @Property(false)
    public zoomOnClick: boolean;
    /**
     * Configures zoom factor.
     * @default 1
     */
    @Property(1)
    public zoomFactor: number;
    /**
     * Configures max zooming.
     * @default 10
     */
    @Property(10)
    public maxZoom: number;
    /**
     * Configures minimum zooming.
     * @default 1
     */
    @Property(1)
    public minZoom: number;
}
/**
 * Configures the legend settings.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Toggle the legend selection
     * @default false
     */
    @Property(false)
    public toggleVisibility: boolean;
    /**
     * Toggle the legend visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Customize the legend background
     * @default transparent
     */
    @Property('transparent')
    public background: string;

    /**
     * Type of the legend rendering
     * @default Layers
     */
    @Property('Layers')
    public type: LegendType;

    /**
     * Inverted pointer for interactive legend
     */
    @Property(false)
    public invertedPointer: boolean;

    /**
     * To place the label position for interactive legend.
     * @default After
     */
    @Property('After')
    public labelPosition: LabelPosition;
    /**
     * Specifies the label intersect action.
     * @default None
     */
    @Property('None')
    public labelDisplayMode: LabelIntersectAction;
    /**
     * Customize the legend shape of the maps.
     * @default Circle
     */
    @Property('Circle')
    public shape: LegendShape;

    /**
     * Customize the legend width of the maps.
     * @default ''
     */
    @Property('')
    public width: string;

    /**
     * Customize the legend height of the maps.
     * @default ''
     */
    @Property('')
    public height: string;

    /**
     * Options for customizing text styles of the legend.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;

    /**
     * Customize the legend width of the maps.
     * @default 15
     */
    @Property(15)
    public shapeWidth: number;

    /**
     * Customize the legend height of the maps.
     * @default 15
     */
    @Property(15)
    public shapeHeight: number;

    /**
     * Customize the shape padding
     * @default 10
     */
    @Property(10)
    public shapePadding: number;

    /**
     * Options for customizing the color and width of the legend border.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the color and width of the shape border.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public shapeBorder: BorderModel;

    /**
     * To configure the title of the legend.
     */
    @Complex<CommonTitleSettingsModel>({}, CommonTitleSettings)
    public title: CommonTitleSettingsModel;

    /**
     * Options for customizing text styles of the legend.
     */
    @Complex<FontModel>({}, Font)
    public titleStyle: FontModel;

    /**
     * Customize the legend position of the maps.
     * @default Bottom
     */
    @Property('Bottom')
    public position: LegendPosition;

    /**
     * Customize the legend alignment of the maps.
     * @default Center
     */
    @Property('Center')
    public alignment: Alignment;

    /**
     * Customize the legend items placed
     * @default None
     */
    @Property('None')
    public orientation: LegendArrangement;

    /** 
     * Customize the legend placed by given x and y values. 
     */
    @Property({ x: 0, y: 0 })
    public location: Point;

    /**
     * Specifies the legend shape color
     */
    @Property(null)
    public fill: string;

    /**
     * Customize the legend mode.
     * @default Default
     */
    @Property('Default')
    public mode: LegendMode;

}
/**
 * Customization for Data label settings.
 */
export class DataLabelSettings extends ChildProperty<DataLabelSettings> {
    /**
     * Toggle the data label visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Configures the label border
     */
    @Complex<BorderModel>({ width: 0, color: 'transparent' }, Border)
    public border: BorderModel;
    /**
     * configure the fill
     */
    @Property('black')
    public fill: string;
    /**
     * configure the label opacity
     */
    @Property(1)
    public opacity: number;
    /**
     * rectangle rx 
     * @default 10
     */
    @Property(5)
    public rx: number;

    /**
     * ry value
     * @default 10
     */
    @Property(5)
    public ry: number;
    /**
     * Options for customizing text styles of the data label.
     */
    @Complex<FontModel>({}, Font)
    public textStyle: FontModel;
    /**
     * To customize the label path values.
     * @default ''
     */
    @Property('')
    public labelPath: string;
    /**
     * To customize the smartLabels.
     * @default None
     */
    @Property('None')
    public smartLabelMode: SmartLabelMode;
    /**
     * intersection action
     * @default None
     */
    @Property('None')
    public intersectionAction: IntersectAction;
    /**
     * To customize the data label template.
     * @default ''
     */
    @Property('')
    public template: string;
}
/**
 * To configure the shapeSettings in the maps.
 */
export class ShapeSettings extends ChildProperty<ShapeSettings> {
    /**
     * To customize the fill color of the shape.
     * @default '#A6A6A6'
     */
    @Property('#A6A6A6')
    public fill: string;
    /**
     * To customize the palette of the shape.
     * @default []
     */
    @Property([])
    public palette: string[];

    /**
     * Customize the radius for points
     */
    @Property(5)
    public circleRadius: number;
    /**
     * Options for customizing the color and width of the shape.
     */
    @Complex<BorderModel>({ width: 0, color: '#000000' }, Border)
    public border: BorderModel;

    /**
     * Dash array of line
     */
    @Property('')
    public dashArray: string;

    /**
     * To customize the opacity of the shape.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To customize the colorValuePath of the shape.
     * @default null
     */
    @Property(null)
    public colorValuePath: string;
    /**
     * To customize the valuePath of the shape.
     * @default null
     */
    @Property(null)
    public valuePath: string;
    /**
     * To configure shape colorMapping
     * @default []
     */
    @Collection<ColorMappingSettingsModel>([], ColorMappingSettings)
    public colorMapping: ColorMappingSettingsModel[];
    /**
     * Toggle the auto fill.
     * @default false
     */
    @Property(false)
    public autofill: boolean;
}
/**
 * To configure the marker settings for the maps.
 */
export class MarkerSettings extends ChildProperty<MarkerSettings> {

    /**
     * Options for customizing the color and width of the marker.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

    /**
     * Options for customizing the dash array options
     */
    @Property(null)
    public dashArray: string;

    /**
     * Toggle the visibility of the marker.
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * To customize the fill color of the marker.
     * @default '#FF471A'
     */
    @Property('#FF471A')
    public fill: string;

    /**
     * To customize the height of the marker.
     * @default 1
     */
    @Property(10)
    public height: number;

    /**
     * To customize the width of the marker.
     * @default 1
     */
    @Property(10)
    public width: number;

    /**
     * To customize the opacity of the marker.
     * @default 1
     */
    @Property(1)
    public opacity: number;

    /**
     * To customize the shape of the marker.
     * @default Balloon
     */
    @Property('Balloon')
    public shape: MarkerType;

    /**
     * To provide the dataSource field to display legend text
     * @default ''
     */
    @Property('')
    public legendText: string;
    /**
     * To move the marker by setting offset values
     */
    @Property(new Point(0, 0))
    public offset: Point;
    /**
     * To provide the image url for rendering marker image
     */
    @Property('')
    public imageUrl: string;

    /**
     * To customize the template of the marker.
     * @default null
     */
    @Property(null)
    public template: string;
    /**
     * To configure the dataSource of the marker.
     * @default []
     */
    @Property([])
    public dataSource: Object[];

    /**
     * To configure the tooltip settings of the maps marker.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;

    /**
     * Animation duration time
     * @default 1000
     */
    @Property(1000)
    public animationDuration: number;

    /**
     * Animation delay time
     * @default 0
     */
    @Property(0)
    public animationDelay: number;
    /**
     * To configure the selection settings of the maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * To configure the highlight settings of the maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;

}


/**
 * To configure the layers of the maps.
 */
export class LayerSettings extends ChildProperty<LayerSettings> {
    /**
     * Specifies the shape data for the layer.
     * @default null
     */
    @Property(null)
    public shapeData: object | DataManager | MapAjax;

    /**
     * Specifies the query to select particular data from the shape data. 
     * This property is applicable only when the DataSource is `ej.DataManager`.
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Specifies the shape properties 
     */
    @Complex<ShapeSettingsModel>({}, ShapeSettings)
    public shapeSettings: ShapeSettingsModel;

    /**
     * Specifies the data source for the layer.
     * @default []
     */
    @Property([])
    public dataSource: object[] | DataManager | MapAjax;
    /**
     * Specifies the type for the layer.
     * @default Layer
     */
    @Property('Layer')
    public type: Type;
    /**
     * Specifies the geometry type
     * @default Geographic
     */
    @Property('Geographic')
    public geometryType: GeometryType;
    /**
     * Specifies the type for the bing map.
     * @default Aerial
     */
    @Property('Aerial')
    public bingMapType: BingMapType;
    /**
     * Specifies the key for the layer.
     * @default ''
     */
    @Property('')
    public key: string;
    /**
     * Specifies the layerType for the layer.
     * @default Geometry
     */
    @Property('Geometry')
    public layerType: ShapeLayerType;
    /**
     * Specifies the urlTemplate for the layer.
     * @default 'http://a.tile.openstreetmap.org/level/tileX/tileY.png'
     */
    @Property('http://a.tile.openstreetmap.org/level/tileX/tileY.png')
    public urlTemplate: string;
    /**
     * Toggle the visibility of the layers.
     * @default true
     */
    @Property(true)
    public visible: boolean;
    /**
     * Specifies the shapeDataPath for the layer.
     * @default 'name'
     */
    @Property('name')
    public shapeDataPath: string;
    /**
     * Specifies the shapePropertyPath for the layer.
     * @default 'name'
     */
    @Property('name')
    public shapePropertyPath: string;
    /**
     * Specifies the animation duration for the layer.
     * @default 0
     */
    @Property(0)
    public animationDuration: number;

    /**
     * To configure the marker settings.
     */
    @Collection<MarkerSettingsModel>([], MarkerSettings)
    public markerSettings: MarkerSettingsModel[];
    /**
     * To configure the datalabel settings of the maps.
     */
    @Complex<DataLabelSettingsModel>({}, DataLabelSettings)
    public dataLabelSettings: DataLabelSettingsModel;
    /**
     * To configure the bubble settings of the maps.
     */
    @Collection<BubbleSettingsModel>([], BubbleSettings)
    public bubbleSettings: BubbleSettingsModel[];
    /**
     * navigationLineSetting
     */
    @Collection<NavigationLineSettingsModel>([], NavigationLineSettings)
    public navigationLineSettings: NavigationLineSettingsModel[];
    /**
     * To configure the tooltip settings of the maps layer.
     */
    @Complex<TooltipSettingsModel>({}, TooltipSettings)
    public tooltipSettings: TooltipSettingsModel;
    /**
     * To configure the selection settings of the maps.
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;
    /**
     * To configure the highlight settings of the maps.
     */
    @Complex<HighlightSettingsModel>({}, HighlightSettings)
    public highlightSettings: HighlightSettingsModel;

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
     * Stores the layer bounds
     */
    public layerBounds: GeoLocation;
    /**
     * @private
     * Stores the rect bounds
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
 * Maps area configuration
 */
export class MapsAreaSettings extends ChildProperty<MapsAreaSettings> {
    /**
     * To configure maps area background color
     */
    @Property(null)
    public background: string;

    /**
     * Options for customizing the color and width of maps area.
     */
    @Complex<BorderModel>({ color: 'transparent', width: 1 }, Border)
    public border: BorderModel;

}
