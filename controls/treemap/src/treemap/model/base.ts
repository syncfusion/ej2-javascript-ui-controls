/**
 * Maps base doc
 */
import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';
import { LabelPosition, Alignment, HighLightMode, SelectionMode, LabelIntersectAction, LabelPlacement } from '../utils/enum';
import { LabelAlignment, LegendShape, LegendPosition, LegendMode, LegendOrientation, MarkerShape } from '../utils/enum';
import { BorderModel, FontModel, SubTitleSettingsModel, ColorMappingModel, CommonTitleSettingsModel } from './base-model';
import { Location } from '../utils/helper';
import { defaultFont } from './constants';

/**
 * Sets and gets the options for customizing the color and width of the border in treemap.
 */
export class Border extends ChildProperty<Border> {

    /**
     * Sets and gets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     *
     * @default '#808080'
     */
    @Property('#808080')
    public color: string;

    /**
     * Defines the width of the border in the treemap.
     *
     * @default 0
     */
    @Property(0)
    public width: number;

}

/**
 * Sets and gets the margin for the treemap.
 */
export class Margin extends ChildProperty<Margin> {

    /**
     * Sets and gets the left margin for the treemap.
     *
     * @default 10
     */
    @Property(10)
    public left: number;

    /**
     * Sets and gets the right margin for the treemap.
     *
     * @default 10
     */
    @Property(10)
    public right: number;

    /**
     * Sets and gets the top margin for the treemap.
     *
     * @default 10
     */
    @Property(10)
    public top: number;

    /**
     * Sets and gets the bottom margin for the treemap.
     *
     * @default 10
     */
    @Property(10)
    public bottom: number;
}

/**
 * Sets and gets the options to customize the style of the text contents in the treemap.
 */
export class Font extends ChildProperty<Font> {

    /**
     * Sets and gets the size for the text in the treemap.
     *
     * @default null
     */
    @Property(null)
    public size: string;

    /**
     * Sets and gets the color for the text in the treemap.
     *
     * @default null
     */
    @Property(null)
    public color: string;

    /**
     * Sets and gets the font family for the text in the treemap.
     *
     * @default ''
     */
    @Property(defaultFont)
    public fontFamily: string;

    /**
     * Sets and gets the font weight for the text in the treemap.
     *
     * @default null
     */
    @Property('')
    public fontWeight: string;

    /**
     * Sets and gets the font style for the text in the treemap.
     *
     * @default 'Normal'
     */
    @Property('Normal')
    public fontStyle: string;

    /**
     * Sets and gets the opacity of the text in the treemap.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
}


/**
 * Sets and gets the options for customizing the title of the treemap.
 */
export class CommonTitleSettings extends ChildProperty<CommonTitleSettings> {
    /**
     * Sets and gets the text for the title in the treemap.
     *
     * @default ''
     */
    @Property('')
    public text: string;
    /**
     * Define the description of the title for the accessibility in the treemap.
     *
     * @default ''
     */
    @Property('')
    public description: string;
}
/**
 * Sets and gets the options for customizing the subtitle of the treemap.
 */
export class SubTitleSettings extends CommonTitleSettings {
    /**
     * Sets and gets the options to customize the text style for the subtitle in the treemap.
     */
    @Complex<FontModel>({ fontFamily: null , fontWeight: null }, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the alignment of the subtitle text in the treemap.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;
}
/**
 * Sets and gets the options for customizing the title of the treemap.
 */
export class TitleSettings extends CommonTitleSettings {
    /**
     * Sets and gets the options to customize the text style of the title of the treemap.
     */
    @Complex<FontModel>({ fontFamily: null, fontWeight: null }, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the text position of the title text in the treemap.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * Sets and gets the options to customize the subtitle for the treemap.
     */
    @Complex<SubTitleSettingsModel>({}, SubTitleSettings)
    public subtitleSettings: SubTitleSettingsModel;
}
/**
 * Sets and gets the options to customize the color-mapping in treemap.
 */
export class ColorMapping extends ChildProperty<ColorMapping> {
    /**
     * Sets and gets the value from which the range of color mapping starts.
     *
     * @default null
     */
    @Property(null)
    public from: number;
    /**
     * Sets and gets the value to which the range of color mapping ends.
     *
     * @default null
     */
    @Property(null)
    public to: number;
    /**
     * Sets and gets the color for the color-mapping in treemap.
     *
     * @default null
     */
    @Property(null)
    public color: string | string[];
    /**
     * Sets and gets the label text for the legend when it is rendered based on color mapping.
     *
     * @default null
     */
    @Property(null)
    public label: string;
    /**
     * Sets and gets the value for the color-mapping from the data source.
     *
     * @default null
     */
    @Property(null)
    public value: string | number;
    /**
     * Sets and gets the minimum opacity for the color-mapping in the treemap.
     *
     * @default null
     */
    @Property(null)
    public minOpacity: number;
    /**
     * Sets and gets the maximum opacity for the color-mapping in the treemap.
     *
     * @default null
     */
    @Property(null)
    public maxOpacity: number;
    /**
     * Enables or disables the visibility of the legend for color mapping in the treemap.
     *
     * @default true
     */
    @Property(true)
    public showLegend: boolean;
}

/**
 * Sets and gets the options for customizing the legend of the treemap.
 */
export class LegendSettings extends ChildProperty<LegendSettings> {
    /**
     * Enables or disables the visibility of legend in the treemap.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the mode of legend in the treemap. The modes available are default and interactive modes.
     *
     * @default 'Default'
     */
    @Property('Default')
    public mode: LegendMode;
    /**
     * Sets and gets the background color of legend in the treemap.
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public background: string;
    /**
     * Sets and gets the shape of legend in the treemap.
     *
     * @default 'Circle'
     */
    @Property('Circle')
    public shape: LegendShape;
    /**
     * Sets and gets the width of legend in the treemap.
     *
     * @default ''
     */
    @Property('')
    public width: string;
    /**
     * Sets and gets the height of legend in the treemap.
     *
     * @default ''
     */
    @Property('')
    public height: string;
    /**
     * Sets and gets the options to customize the text style of legend in the treemap.
     */
    @Complex<FontModel>({ size: '12px', fontFamily: null , fontWeight: null}, Font)
    public textStyle: FontModel;
    /**
     * Sets and gets the shape color of legend in the treemap.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Sets and gets the opacity of the legend in the treemap.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Sets and gets the width of the shapes in legend in the treemap.
     *
     * @default 15
     */
    @Property(15)
    public shapeWidth: number;

    /**
     * Sets and gets the height of the shapes of legend in the treemap.
     *
     * @default 15
     */
    @Property(15)
    public shapeHeight: number;
    /**
     * Sets and gets the shape padding of legend in the treemap.
     *
     * @default 10
     */
    @Property(10)
    public shapePadding: number;
    /**
     * Sets and gets the URL path of the legend shapes that is set as image.
     *
     * @default null
     */
    @Property(null)
    public imageUrl: string;
    /**
     * Sets and gets the options for customizing the color and width of the border of the legend in the treemap.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public border: BorderModel;
    /**
     * Sets and gets the options for customizing the color and width of the border of the legend shape in the treemap.
     */
    @Complex<BorderModel>({ color: '#000000', width: 0 }, Border)
    public shapeBorder: BorderModel;
    /**
     * Sets and gets the options to customize the title of the legend in the treemap.
     */
    @Complex<CommonTitleSettingsModel>({}, CommonTitleSettings)
    public title: CommonTitleSettingsModel;
    /**
     * Sets and gets the options to customize the text style of the legend item text in the treemap.
     */
    @Complex<FontModel>({ size: '14px' }, Font)
    public titleStyle: FontModel;
    /**
     * Sets and gets the position of legend in the treemap.
     *
     * @default 'Bottom'
     */
    @Property('Bottom')
    public position: LegendPosition;
    /**
     * Sets and gets the orientation of legend in the treemap.
     *
     * @default 'None'
     */
    @Property('None')
    public orientation: LegendOrientation;
    /**
     * Enables or disables the pointer for interactive legend in the treemap.
     *
     * @default false
     */
    @Property(false)
    public invertedPointer: boolean;
    /**
     * Sets and gets the label position for interactive legend in the treemap.
     *
     * @default 'After'
     */
    @Property('After')
    public labelPosition: LabelPlacement;
    /**
     * Sets and gets the action of legend item text when they intersect with each other.
     *
     * @default 'None'
     */
    @Property('None')
    public labelDisplayMode: LabelIntersectAction;
    /**
     * Sets and gets the alignment of legend in the treemap.
     *
     * @default 'Center'
     */
    @Property('Center')
    public alignment: Alignment;
    /**
     * Sets and gets the location to place the legend in a custom location in the treemap.
     */
    @Property({ x: 0, y: 0 })
    public location: Location;
    /**
     * Sets and gets the value path from the data source for the visibility state of the legend item in the treemap.
     *
     * @default null
     */
    @Property(null)
    public showLegendPath: string;
    /**
     * Sets and gets the value path from the data source to render legend in the treemap.
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
}
/**
 * Sets and gets the settings for drill down to visualize the treemap rendered in the initial state.
 */
export class InitialDrillSettings extends ChildProperty<InitialDrillSettings> {
    /**
     * Sets and gets the initial rendering level index in the treemap.
     *
     * @default null
     */
    @Property(null)
    public groupIndex: number;
    /**
     * Sets and gets the initial rendering level name in the treemap.
     *
     * @default null
     */
    @Property(null)
    public groupName: string;

}
/**
 * Sets and gets the options for customizing the leaf item of the treemap.
 */
export class LeafItemSettings extends ChildProperty<LeafItemSettings> {
    /**
     * Sets and gets the fill color of leaf items in the treemap.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Enables or disables automatic filling of colors from the palette in the leaf items of the treemap.
     *
     * @default false
     */
    @Property(false)
    public autoFill: boolean;
    /**
     * Sets and gets the options for customizing the color and width of the border of the leaf item in the treemap.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the gap between the leaf item in the treemap.
     *
     * @default 0
     */
    @Property(0)
    public gap: number;
    /**
     * Sets and gets the padding of leaf item in the treemap.
     *
     * @default 10
     */
    @Property(10)
    public padding: number;
    /**
     * Sets and gets the opacity of leaf item in the treemap.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Shows or hides the labels in the treemap.
     *
     * @default true
     */
    @Property(true)
    public showLabels: boolean;
    /**
     * Sets and gets the value path from the data source for label of leaf item in the treemap.
     *
     * @default null
     */
    @Property(null)
    public labelPath: string;
    /**
     * Sets and gets the string to format the label text of leaf item in the treemap.
     *
     * @default null
     */
    @Property(null)
    public labelFormat: string;
    /**
     * Sets and gets the position of the labels in the treemap.
     *
     * @default 'TopLeft'
     */
    @Property('TopLeft')
    public labelPosition: LabelPosition;
    /**
     * Sets and gets the options to customize the style of the labels of treemap leaf item.
     */
    @Complex<FontModel>({ color: null, size: '12px' }, Font)
    public labelStyle: FontModel;
    /**
     * Sets and gets the label template of leaf item in the treemap to render custom elements in the labels.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public labelTemplate: string | Function;
    /**
     * Sets and gets the position of the label template of treemap leaf item.
     *
     * @default 'Center'
     */
    @Property('Center')
    public templatePosition: LabelPosition;
    /**
     * Sets and gets the actions to perform when labels intersects with other labels in a treemap leaf item.
     *
     * @default 'Trim'
     */
    @Property('Trim')
    public interSectAction: LabelAlignment;
    /**
     * Sets and gets the options to customize color-mapping of the treemap leaf items.
     */
    @Collection<ColorMappingModel>([], ColorMapping)
    public colorMapping: ColorMappingModel[];
}
/**
 * Sets and gets the options for customizing the tooltip of the treemap.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables the visibility of the tooltip in the treemap.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;
    /**
     * Sets and gets the template for tooltip in the treemap.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public template: string | Function;
    /**
     * Sets and gets the string to format the tooltip in the treemap.
     *
     * @default null
     */
    @Property(null)
    public format: string;
    /**
     * Sets and gets the background color of tooltip in the treemap.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Sets and gets the opacity of tooltip in the treemap.
     *
     * @default 0.75
     */
    @Property(0.75)
    public opacity: number;
    /**
     * Sets and gets the marker shapes in the treemap.
     *
     * @default '[Circle]'
     * @private
     */
    @Property(['Circle'])
    public markerShapes: MarkerShape[];
    /**
     * Sets and gets the options for customizing the color and width of the border of the tooltip.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the options for customizing the text style of tooltip of the treemap.
     */
    @Complex<FontModel>({fontFamily: defaultFont, size: null, fontWeight: null }, Font)
    public textStyle: FontModel;
}
/**
 * Sets and gets the options for customizing the selection of the leaf items in treemap.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Enables or disables the selection functionality in the treemap.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Sets and gets the color of the selection when the leaf item is selected in the treemap.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Sets and gets the opacity of the selection when the leaf item is selected in the treemap.
     *
     * @default '0.5'
     */
    @Property('0.5')
    public opacity: string;
    /**
     * Sets and gets the options to customize the border of the selected items in the treemap.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the type of the elements in which selection must be done in the treemap.
     *
     * @default 'Item'
     */
    @Property('Item')
    public mode: SelectionMode;
}
/**
 * Sets and gets the options for customizing the highlighting of the treemap item,
 * when the mouse hover is performed in it.
 */
export class HighlightSettings extends ChildProperty<HighlightSettings> {
    /**
     * Enables or disables the highlight functionality of the treemap.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;
    /**
     * Sets and gets the highlight color of the treemap.
     *
     * @default '#808080'
     */
    @Property('#808080')
    public fill: string;
    /**
     * Sets and gets the opacity of the treemap.
     *
     * @default '0.5'
     */
    @Property('0.5')
    public opacity: string;
    /**
     * Sets and gets the options for customizing the color and width of the border of the
     * highlighted item in the treemap.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the element in which highlight must be done in the treemap.
     *
     * @default 'Item'
     */
    @Property('Item')
    public mode: HighLightMode;
}

/**
 * Sets and gets the options for customizing the level leaf items of the treemap.
 */
export class LevelSettings extends ChildProperty<LevelSettings> {
    /**
     * Sets and gets the value path from the data source in the treemap to render the item.
     *
     * @default null
     */
    @Property(null)
    public groupPath: string;
    /**
     * Sets and gets the gap between the level leaf items in the treemap.
     *
     * @default 0
     */
    @Property(0)
    public groupGap: number;
    /**
     * Sets and gets the padding of level leaf items in the treemap.
     *
     * @default 10
     */
    @Property(10)
    public groupPadding: number;
    /**
     * Sets and gets the options for customizing the color and width of the border of
     * the level leaf items of the treemap.
     */
    @Complex<BorderModel>({}, Border)
    public border: BorderModel;
    /**
     * Sets and gets the fill color of the level leaf item in the treemap.
     *
     * @default null
     */
    @Property(null)
    public fill: string;
    /**
     * Enables or disables the automatic filling of the colors from the palette in the items of the treemap.
     *
     * @default false
     */
    @Property(false)
    public autoFill: boolean;
    /**
     * Sets and gets the opacity in the level leaf item of the treemap.
     *
     * @default 1
     */
    @Property(1)
    public opacity: number;
    /**
     * Shows or hides the header in level leaf item of the treemap.
     *
     * @default true
     */
    @Property(true)
    public showHeader: boolean;
    /**
     * Sets and gets the height of header in the treemap.
     *
     * @default 20
     */
    @Property(20)
    public headerHeight: number;
    /**
     * Sets and gets the template for header in the treemap.
     *
     * @default null
     * @aspType string
     */
    @Property(null)
    public headerTemplate: string | Function;
    /**
     * Sets and gets the string to format the header label of the level leaf items in the treemap.
     *
     * @default null
     */
    @Property(null)
    public headerFormat: string;
    /**
     * Sets and gets the alignment of the header of the treemap.
     *
     * @default 'Near'
     */
    @Property('Near')
    public headerAlignment: Alignment;
    /**
     * Sets and gets the options for customizing the text style of header label of the level leaf item.
     */
    @Complex<FontModel>({ color: null, size: '13px' }, Font)
    public headerStyle: FontModel;
    /**
     * Sets and gets the options for customizing the template position of the treemap.
     *
     * @default 'TopLeft'
     */
    @Property('TopLeft')
    public templatePosition: LabelPosition;
    /**
     * Sets and gets the options for customizing the color-mapping of the level leaf items in the treemap.
     */
    @Collection<ColorMappingModel>([], ColorMapping)
    public colorMapping: ColorMappingModel[];
}