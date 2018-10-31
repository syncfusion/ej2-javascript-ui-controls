/**
 * Maps base doc
 */
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { LabelPosition, Alignment, HighLightMode, SelectionMode, LabelIntersectAction, LabelPlacement } from '../utils/enum';
import { LabelAlignment, LegendShape, LegendPosition, LegendMode, LegendOrientation } from '../utils/enum';
import { BorderModel, FontModel, SubTitleSettingsModel, ColorMappingModel, CommonTitleSettingsModel } from './base-model';
import { Location } from '../utils/helper';
import { defaultFont } from './constants';

/**
 * Configures the borders in the maps.
 */

export type MarkerShape = 'Circle' | 'Rectangle' | 'Triangle' | 'Diamond' | 'Cross' |
    'HorizontalLine' | 'VerticalLine' | 'Pentagon' | 'InvertedTriangle' | 'Image';
export class Border extends ChildProperty<Border> {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default '#808080'
     */
    @Property('#808080')
    public color: string;

    /**
     * The width of the border in pixels.
     * @default 0
     */
    @Property(0)
    public width: number;

}

/**
 * Configures the treemap margin.
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
 * Configures the fonts in treemap.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Font size for the text.
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Color for the text.
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * fontFamily for the text.
     * @default ''
     */
    @Property(defaultFont)
    public fontFamily: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontWeight: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    @Property(1)
    public opacity: number;
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
    @Complex<FontModel>({ size: '14px' }, Font)
    public textStyle: FontModel;
    /**
     * Options for customize the text alignment.
     * @default 'Center'
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
    @Complex<FontModel>({ size: '15px' }, Font)
    public textStyle: FontModel;
    /**
     * Options for customize the text alignment.
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * To configure sub title of maps.
     */
    @Complex<SubTitleSettingsModel>({}, SubTitleSettings)
    public subtitleSettings: SubTitleSettingsModel;
}
export class ColorMapping extends ChildProperty<ColorMapping> {
    /**
     * Specifies the from
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Specifies the to
     * @default null
     */
    @Property(null)
    public to: number;
    /**
     * specifies the color
     * @default null 
     */
    @Property(null)
    public color: string;
    /**
     * Specifies the label text.
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Specifies the value
     * @default null
     */
    @Property(null)
    public value: string | number;
    /**
     * Specifies the minOpacity
     * @default null 
     */
    @Property(null)
    public minOpacity: number;
    /**
     * maxOpacity
     * @default null 
     */
    @Property(null)
    public maxOpacity: number;
}

/**
 * Configures the legend settings.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Toggle the legend visibility.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Customize the legend mode.
     * @default 'Default'
     */
    @Property('Default')
    public mode: LegendMode;
    /**
     * Customize the legend background
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;
    /**
     * Customize the legend shape.
     * @default 'Circle'
     */
    @Property('Circle')
    public shape: LegendShape;
    /**
     * Customize the legend width.
     * @default ''
     */
    @Property('')
    public width: string;
    /**
     * Customize the legend height.
     * @default ''
     */
    @Property('')
    public height: string;
    /**
     * Options for customize the legend text.
     */
    @Complex<FontModel>({ size: '13px' }, Font)
    public textStyle: FontModel;
    /**
     * Specifies the legend shape color
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Customize the shape width.
     * @default 15
     */
    @Property(15)
    public shapeWidth: number;

    /**
     * Customize the shape height.
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
     * Specifies the images url.
     * @default null
     */
    @Property(null)
    public imageUrl: string;
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
    @Complex<FontModel>({ size: '14px' }, Font)
    public titleStyle: FontModel;
    /**
     * Customize the legend position of the maps.
     * @default 'Bottom'
     */
    @Property('Bottom')
    public position: LegendPosition;
    /**
     * Customize the legend items placed
     * @default 'None'
     */
    @Property('None')
    public orientation: LegendOrientation;
    /**
     * Inverted pointer for interactive legend
     * @default false
     */
    @Property(false)
    public invertedPointer: boolean;
    /**
     * To place the label position for interactive legend.
     * @default 'After'
     */
    @Property('After')
    public labelPosition: LabelPlacement;
    /**
     * Specifies the label intersect action.
     * @default 'None'
     */
    @Property('None')
    public labelDisplayMode: LabelIntersectAction;
    /**
     * Customize the legend alignment.
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;
    /** 
     * Customize the legend placed by given x and y values. 
     */
    @Property({ x: 0, y: 0 })
    public location: Location;
}

export class InitialDrillSettings extends ChildProperty<InitialDrillSettings> {
    /**
     * Specifies the initial rendering level.
     * @default null
     */
    @Property(null)
    public groupIndex: number;
    /**
     * Specifies the initial rendering name.
     * @default null
     */
    @Property(null)
    public groupName: string;

}
export class LeafItemSettings extends ChildProperty<LeafItemSettings> {
    /**
     * Specifies the fill color for leaf items.
     * @default '#808080'
     */
    @Property('#808080')
    public fill: string;
    /**
     * Items rendering with random colors.
     * @default false
     */
    @Property(false)
    public autoFill: boolean;
    /**
     * Specifies the border
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Specifies the item gap.
     * @default 0
     */
    @Property(0)
    public gap: number;
    /**
     * Specifies the padding.
     * @default 10
     */
    @Property(10)
    public padding: number;
    /**
     * Specifies the opacity for color.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To show or hide the labels
     * @default true
     */
    @Property(true)
    public showLabels: boolean;
    /**
     * Specifies the field name from the dataSource.
     * @default null
     */
    @Property(null)
    public labelPath: string;
    /**
     * Specifies the label format.
     * @default null
     */
    @Property(null)
    public labelFormat: string;
    /**
     * Specifies the alignment of label.
     * @default 'TopLeft'
     */
    @Property('TopLeft')
    public labelPosition: LabelPosition;
    /**
     * Customize the label style.
     */
    @Complex<FontModel>({ color: null, size: '12px' }, Font)
    public labelStyle: FontModel;
    /**
     * Specifies the label template.
     * @default null
     */
    @Property(null)
    public labelTemplate: string;
    /**
     * Specifies the alignment of template.
     * @default 'Center'
     */
    @Property('Center')
    public templatePosition: LabelPosition;
    /**
     * Specifies the label intersect action.
     * @default 'Trim'
     */
    @Property('Trim')
    public interSectAction: LabelAlignment;
    /**
     * Specifies the colorMapping
     */
    @Collection<ColorMappingModel>([], ColorMapping)
    public colorMapping: ColorMappingModel[];
}

export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * To enable or disable the Tooltip.
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * To specifies the template for tooltip.
     * @default ''
     */
    @Property('')
    public template: string;
    /**
     * Specifies the format by given ${data}
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * To fill the tooltip background.
     * @default '#000816'
     */
    @Property('#000816')
    public fill: string;
    /**
     * Specifies the opacity for fill.
     * @default 0.75
     */
    @Property(0.75)
    public opacity: number;
    /**
     * Specifies the marker shapes.
     * @default '[Circle]'
     */
    @Property(['Circle'])
    public markerShapes: MarkerShape[];
    /**
     * Specifies the tooltip border.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Specifies the text style.
     */
    @Complex<FontModel>({fontFamily: defaultFont, size: '13px' }, Font)
    public textStyle: FontModel;
}

export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * To enable or disable the selection
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * To specifies the selection color
     * @default '#808080'
     */
    @Property('#808080')
    public fill: string;
    /**
     * To specified the opacity of color.
     * @default '0.5'
     */
    @Property('0.5')
    public opacity: string;
    /**
     * To specifies the border
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * To specifies the selection mode.
     * @default 'Item'
     */
    @Property('Item')
    public mode: SelectionMode;
}

export class HighlightSettings extends ChildProperty<HighlightSettings> {
    /**
     * To enable or disable the highlight.
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * To specifies the highlight color.
     * @default '#808080'
     */
    @Property('#808080')
    public fill: string;
    /**
     * To specified the opacity of color.
     * @default '0.5'
     */
    @Property('0.5')
    public opacity: string;
    /**
     * To specifies the border
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * To specifies the highlight mode.
     * @default 'Item'
     */
    @Property('Item')
    public mode: HighLightMode;
}

/**
 * Options for customizing the tree map levels.
 */
export class LevelSettings extends ChildProperty<LevelSettings> {
    /**
     * Specifies the field name from the dataSource.
     * @default null
     */
    @Property(null)
    public groupPath: string;
    /**
     * Specifies the padding.
     * @default 0
     */
    @Property(0)
    public groupGap: number;
    /**
     * Specifies the padding.
     * @default 10
     */
    @Property(10)
    public groupPadding: number;
    /**
     * Specifies the border
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Specifies the background of level.
     * @default '#808080'
     */
    @Property('#808080')
    public fill: string;
    /**
     * Items rendering with random colors.
     * @default false
     */
    @Property(false)
    public autoFill: boolean;
    /**
     * Specifies the opacity for color.
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * To Show or hide the header in level.
     * @default true
     */
    @Property(true)
    public showHeader: boolean;
    /**
     * To specifies the height of header.
     * @default 20
     */
    @Property(20)
    public headerHeight: number;
    /**
     * Specifies the template for header rendering.
     * @default null
     */
    @Property(null)
    public headerTemplate: string;
    /**
     * Specifies the header format.
     * @default null
     */
    @Property(null)
    public headerFormat: string;
    /**
     * Customize the text alignment
     * @default 'Near'
     */
    @Property('Near')
    public headerAlignment: Alignment;
    /**
     * Customize the header style.
     */
    @Complex<FontModel>({ color: null, size: '13px' }, Font)
    public headerStyle: FontModel;
    /**
     * Specifies the label position in level.
     * @default 'TopLeft'
     */
    @Property('TopLeft')
    public templatePosition: LabelPosition;
    /**
     * Specifies the colorMapping
     */
    @Collection<ColorMappingModel>([], ColorMapping)
    public colorMapping: ColorMappingModel[];
}