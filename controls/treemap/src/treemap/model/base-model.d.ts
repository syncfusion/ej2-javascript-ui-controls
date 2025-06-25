import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { LabelPosition, Alignment, HighLightMode, SelectionMode, LabelIntersectAction, LabelPlacement } from '../utils/enum';import { LabelAlignment, LegendShape, LegendPosition, LegendMode, LegendOrientation, MarkerShape } from '../utils/enum';import { Location } from '../utils/helper';import { defaultFont } from './constants';

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Sets and gets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     *
     * @default '#808080'
     */
    color?: string;

    /**
     * Defines the width of the border in the treemap.
     *
     * @default 0
     */
    width?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Sets and gets the left margin for the treemap.
     *
     * @default 10
     */
    left?: number;

    /**
     * Sets and gets the right margin for the treemap.
     *
     * @default 10
     */
    right?: number;

    /**
     * Sets and gets the top margin for the treemap.
     *
     * @default 10
     */
    top?: number;

    /**
     * Sets and gets the bottom margin for the treemap.
     *
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Sets and gets the size for the text in the treemap.
     *
     * @default null
     */
    size?: string;

    /**
     * Sets and gets the color for the text in the treemap.
     *
     * @default null
     */
    color?: string;

    /**
     * Sets and gets the font family for the text in the treemap.
     *
     * @default ''
     */
    fontFamily?: string;

    /**
     * Sets and gets the font weight for the text in the treemap.
     *
     * @default null
     */
    fontWeight?: string;

    /**
     * Sets and gets the font style for the text in the treemap.
     *
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Sets and gets the opacity of the text in the treemap.
     *
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class CommonTitleSettings
 */
export interface CommonTitleSettingsModel {

    /**
     * Sets and gets the text for the title in the treemap.
     *
     * @default ''
     */
    text?: string;

    /**
     * Define the description of the title for the accessibility in the treemap.
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
     * Sets and gets the options to customize the text style for the subtitle in the treemap.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the alignment of the subtitle text in the treemap.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Sets and gets the options to customize the text style of the title of the treemap.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the text position of the title text in the treemap.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Sets and gets the options to customize the subtitle for the treemap.
     */
    subtitleSettings?: SubTitleSettingsModel;

}

/**
 * Interface for a class ColorMapping
 */
export interface ColorMappingModel {

    /**
     * Sets and gets the value from which the range of color mapping starts.
     *
     * @default null
     */
    from?: number;

    /**
     * Sets and gets the value to which the range of color mapping ends.
     *
     * @default null
     */
    to?: number;

    /**
     * Sets and gets the color for the color-mapping in treemap.
     *
     * @default null
     */
    color?: string | string[];

    /**
     * Sets and gets the label text for the legend when it is rendered based on color mapping.
     *
     * @default null
     */
    label?: string;

    /**
     * Sets and gets the value for the color-mapping from the data source.
     *
     * @default null
     */
    value?: string | number;

    /**
     * Sets and gets the minimum opacity for the color-mapping in the treemap.
     *
     * @default null
     */
    minOpacity?: number;

    /**
     * Sets and gets the maximum opacity for the color-mapping in the treemap.
     *
     * @default null
     */
    maxOpacity?: number;

    /**
     * Enables or disables the visibility of the legend for color mapping in the treemap.
     *
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Enables or disables the visibility of legend in the treemap.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the mode of legend in the treemap. The modes available are default and interactive modes.
     *
     * @default 'Default'
     */
    mode?: LegendMode;

    /**
     * Sets and gets the background color of legend in the treemap.
     *
     * @default 'transparent'
     */
    background?: string;

    /**
     * Sets and gets the shape of legend in the treemap.
     *
     * @default 'Circle'
     */
    shape?: LegendShape;

    /**
     * Sets and gets the width of legend in the treemap.
     *
     * @default ''
     */
    width?: string;

    /**
     * Sets and gets the height of legend in the treemap.
     *
     * @default ''
     */
    height?: string;

    /**
     * Sets and gets the options to customize the text style of legend in the treemap.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the shape color of legend in the treemap.
     *
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the legend in the treemap.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the width of the shapes in legend in the treemap.
     *
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Sets and gets the height of the shapes of legend in the treemap.
     *
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Sets and gets the shape padding of legend in the treemap.
     *
     * @default 10
     */
    shapePadding?: number;

    /**
     * Sets and gets the URL path of the legend shapes that is set as image.
     *
     * @default null
     */
    imageUrl?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the legend in the treemap.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the color and width of the border of the legend shape in the treemap.
     */
    shapeBorder?: BorderModel;

    /**
     * Sets and gets the options to customize the title of the legend in the treemap.
     */
    title?: CommonTitleSettingsModel;

    /**
     * Sets and gets the options to customize the text style of the legend item text in the treemap.
     */
    titleStyle?: FontModel;

    /**
     * Sets and gets the position of legend in the treemap.
     *
     * @default 'Bottom'
     */
    position?: LegendPosition;

    /**
     * Sets and gets the orientation of legend in the treemap.
     *
     * @default 'None'
     */
    orientation?: LegendOrientation;

    /**
     * Enables or disables the pointer for interactive legend in the treemap.
     *
     * @default false
     */
    invertedPointer?: boolean;

    /**
     * Sets and gets the label position for interactive legend in the treemap.
     *
     * @default 'After'
     */
    labelPosition?: LabelPlacement;

    /**
     * Sets and gets the action of legend item text when they intersect with each other.
     *
     * @default 'None'
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Sets and gets the alignment of legend in the treemap.
     *
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Sets and gets the location to place the legend in a custom location in the treemap.
     */
    location?: Location;

    /**
     * Sets and gets the value path from the data source for the visibility state of the legend item in the treemap.
     *
     * @default null
     */
    showLegendPath?: string;

    /**
     * Sets and gets the value path from the data source to render legend in the treemap.
     *
     * @default null
     */
    valuePath?: string;

    /**
     * Enables or disables to remove the duplicate legend item.
     *
     * @default false
     */
    removeDuplicateLegend?: boolean;

}

/**
 * Interface for a class InitialDrillSettings
 */
export interface InitialDrillSettingsModel {

    /**
     * Sets and gets the initial rendering level index in the treemap.
     *
     * @default null
     */
    groupIndex?: number;

    /**
     * Sets and gets the initial rendering level name in the treemap.
     *
     * @default null
     */
    groupName?: string;

}

/**
 * Interface for a class LeafItemSettings
 */
export interface LeafItemSettingsModel {

    /**
     * Sets and gets the fill color of leaf items in the treemap.
     *
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables automatic filling of colors from the palette in the leaf items of the treemap.
     *
     * @default false
     */
    autoFill?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border of the leaf item in the treemap.
     */
    border?: BorderModel;

    /**
     * Sets and gets the gap between the leaf item in the treemap.
     *
     * @default 0
     */
    gap?: number;

    /**
     * Sets and gets the padding of leaf item in the treemap.
     *
     * @default 10
     */
    padding?: number;

    /**
     * Sets and gets the opacity of leaf item in the treemap.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Shows or hides the labels in the treemap.
     *
     * @default true
     */
    showLabels?: boolean;

    /**
     * Sets and gets the value path from the data source for label of leaf item in the treemap.
     *
     * @default null
     */
    labelPath?: string;

    /**
     * Sets and gets the string to format the label text of leaf item in the treemap.
     *
     * @default null
     */
    labelFormat?: string;

    /**
     * Sets and gets the position of the labels in the treemap.
     *
     * @default 'TopLeft'
     */
    labelPosition?: LabelPosition;

    /**
     * Sets and gets the options to customize the style of the labels of treemap leaf item.
     */
    labelStyle?: FontModel;

    /**
     * Sets and gets the label template of leaf item in the treemap to render custom elements in the labels.
     *
     * @default null
     * @aspType string
     */
    labelTemplate?: string | Function;

    /**
     * Sets and gets the position of the label template of treemap leaf item.
     *
     * @default 'Center'
     */
    templatePosition?: LabelPosition;

    /**
     * Sets and gets the actions to perform when labels intersects with other labels in a treemap leaf item.
     *
     * @default 'Trim'
     */
    interSectAction?: LabelAlignment;

    /**
     * Sets and gets the options to customize color-mapping of the treemap leaf items.
     */
    colorMapping?: ColorMappingModel[];

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables the visibility of the tooltip in the treemap.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the template for tooltip in the treemap.
     *
     * @default ''
     * @aspType string
     */
    template?: string | Function;

    /**
     * Sets and gets the string to format the tooltip in the treemap.
     *
     * @default null
     */
    format?: string;

    /**
     * Sets and gets the background color of tooltip in the treemap.
     *
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity of tooltip in the treemap.
     *
     * @default 0.75
     */
    opacity?: number;

    /**
     * Sets and gets the marker shapes in the treemap.
     *
     * @default '[Circle]'
     * @private
     */
    markerShapes?: MarkerShape[];

    /**
     * Sets and gets the options for customizing the color and width of the border of the tooltip.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the text style of tooltip of the treemap.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Enables or disables the selection functionality in the treemap.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the color of the selection when the leaf item is selected in the treemap.
     *
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the selection when the leaf item is selected in the treemap.
     *
     * @default '0.5'
     */
    opacity?: string;

    /**
     * Sets and gets the options to customize the border of the selected items in the treemap.
     */
    border?: BorderModel;

    /**
     * Sets and gets the type of the elements in which selection must be done in the treemap.
     *
     * @default 'Item'
     */
    mode?: SelectionMode;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Enables or disables the highlight functionality of the treemap.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the highlight color of the treemap.
     *
     * @default '#808080'
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the treemap.
     *
     * @default '0.5'
     */
    opacity?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the
     * highlighted item in the treemap.
     */
    border?: BorderModel;

    /**
     * Sets and gets the element in which highlight must be done in the treemap.
     *
     * @default 'Item'
     */
    mode?: HighLightMode;

}

/**
 * Interface for a class LevelSettings
 */
export interface LevelSettingsModel {

    /**
     * Sets and gets the value path from the data source in the treemap to render the item.
     *
     * @default null
     */
    groupPath?: string;

    /**
     * Sets and gets the gap between the level leaf items in the treemap.
     *
     * @default 0
     */
    groupGap?: number;

    /**
     * Sets and gets the padding of level leaf items in the treemap.
     *
     * @default 10
     */
    groupPadding?: number;

    /**
     * Sets and gets the options for customizing the color and width of the border of
     * the level leaf items of the treemap.
     */
    border?: BorderModel;

    /**
     * Sets and gets the fill color of the level leaf item in the treemap.
     *
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables the automatic filling of the colors from the palette in the items of the treemap.
     *
     * @default false
     */
    autoFill?: boolean;

    /**
     * Sets and gets the opacity in the level leaf item of the treemap.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Shows or hides the header in level leaf item of the treemap.
     *
     * @default true
     */
    showHeader?: boolean;

    /**
     * Sets and gets the height of header in the treemap.
     *
     * @default 20
     */
    headerHeight?: number;

    /**
     * Sets and gets the template for header in the treemap.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Sets and gets the string to format the header label of the level leaf items in the treemap.
     *
     * @default null
     */
    headerFormat?: string;

    /**
     * Sets and gets the alignment of the header of the treemap.
     *
     * @default 'Near'
     */
    headerAlignment?: Alignment;

    /**
     * Sets and gets the options for customizing the text style of header label of the level leaf item.
     */
    headerStyle?: FontModel;

    /**
     * Sets and gets the options for customizing the template position of the treemap.
     *
     * @default 'TopLeft'
     */
    templatePosition?: LabelPosition;

    /**
     * Sets and gets the options for customizing the color-mapping of the level leaf items in the treemap.
     */
    colorMapping?: ColorMappingModel[];

}