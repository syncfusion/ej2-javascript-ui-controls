import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { LabelPosition, Alignment, HighLightMode, SelectionMode, LabelIntersectAction, LabelPlacement } from '../utils/enum';import { LabelAlignment, LegendShape, LegendPosition, LegendMode, LegendOrientation } from '../utils/enum';import { Location } from '../utils/helper';import { defaultFont } from './constants';
import {MarkerShape} from "./base";

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * Sets and gets the color of the border. This property accepts the value in hex code and rgba string as a valid CSS color string.
     * @default '#808080'
     */
    color?: string;

    /**
     * Defines the width of the border in the treemap component.
     * @default 0
     */
    width?: number;

}

/**
 * Interface for a class Margin
 */
export interface MarginModel {

    /**
     * Sets and gets the left margin for the treemap component.
     * @default 10
     */
    left?: number;

    /**
     * Sets and gets the right margin for the treemap component.
     * @default 10
     */
    right?: number;

    /**
     * Sets and gets the top margin for the treemap component.
     * @default 10
     */
    top?: number;

    /**
     * Sets and gets the bottom margin for the treemap component.
     * @default 10
     */
    bottom?: number;

}

/**
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Sets and gets the size for the text in the treemap component.
     * @default null
     */
    size?: string;

    /**
     * Sets and gets the color for the text in the treemap component.
     * @default null
     */
    color?: string;

    /**
     * Sets and gets the font family for the text in the treemap component.
     * @default ''
     */
    fontFamily?: string;

    /**
     * Sets and gets the font weight for the text in the treemap component.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * Sets and gets the font style for the text in the treemap component.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Sets and gets the opacity of the text in the treemap component.
     * @default 1
     */
    opacity?: number;

}

/**
 * Interface for a class CommonTitleSettings
 */
export interface CommonTitleSettingsModel {

    /**
     * Sets and gets the text for the title in the treemap component.
     * @default ''
     */
    text?: string;

    /**
     * Define the description of the title for the accessibility in the treemap component.
     * @default ''
     */
    description?: string;

}

/**
 * Interface for a class SubTitleSettings
 */
export interface SubTitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Sets and gets the text style for the subtitle in the treemap component.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the alignment of the subtitle text in the treemap component.
     * @default 'Center'
     */
    alignment?: Alignment;

}

/**
 * Interface for a class TitleSettings
 */
export interface TitleSettingsModel extends CommonTitleSettingsModel{

    /**
     * Sets and gets the options to customizing the text styles of the treemap component.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the text position of the title text in the treemap component.
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
     * @default null
     * @isBlazorNullableType true
     */
    from?: number;

    /**
     * Sets and gets the value to which the range of color mapping ends.
     * @default null
     * @isBlazorNullableType true
     */
    to?: number;

    /**
     * Sets and gets the color for the color-mapping in treemap.
     * @default null 
     */
    color?: string | string[];

    /**
     * Sets and gets the label text for the legend based on color mapping.
     * @default null
     */
    label?: string;

    /**
     * Sets and gets the value for the color-mapping from the data source.
     * @default null
     */
    value?: string | number;

    /**
     * Sets and gets the minimum opacity for the color-mapping in the treemap component.
     * @default null 
     */
    minOpacity?: number;

    /**
     * Sets and gets the maximum opacity for the color-mapping in the treemap component.
     * @default null 
     */
    maxOpacity?: number;

    /**
     * Enables or disables the visibility of the legend for color mapping in the treemap component.
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Enables or disables the visibility of legend in the treemap component.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the mode of legend in the treemap component. The modes available are default and interactive modes.
     * @default 'Default'
     */
    mode?: LegendMode;

    /**
     * Sets and gets the background color of legend in the treemap component.
     * @default 'transparent'
     */
    background?: string;

    /**
     * Sets and gets the shape of legend in the treemap component.
     * @default 'Circle'
     */
    shape?: LegendShape;

    /**
     * Sets and gets the width of legend in the treemap component.
     * @default ''
     */
    width?: string;

    /**
     * Sets and gets the height of legend in the treemap component.
     * @default ''
     */
    height?: string;

    /**
     * Sets and gets the options to customize the text style of legend in the treemap component.
     */
    textStyle?: FontModel;

    /**
     * Sets and gets the shape color of legend in the treemap component.
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity of legends in the treemap component.
     * @default 1
     */
    opacity?: number;

    /**
     * Sets and gets the width of the shapes in legend in the treemap component.
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Sets and gets the height of the shapes of legend in the treemap component.
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Sets and gets the shape padding of legend in the treemap component.
     * @default 10
     */
    shapePadding?: number;

    /**
     * Sets and gets the URL path of the legend shapes rendered as image in the treemap component.
     * @default null
     */
    imageUrl?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the legend in the treemap component.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the color and width of the border of the legend shape in the treemap.
     */
    shapeBorder?: BorderModel;

    /**
     * Sets and gets the options to customize the title of the legend in the treemap component.
     */
    title?: CommonTitleSettingsModel;

    /**
     * Sets and gets the options to customize the text style of the legend in the treemap component.
     */
    titleStyle?: FontModel;

    /**
     * Sets and gets the position of legend in the treemap component.
     * @default 'Bottom'
     */
    position?: LegendPosition;

    /**
     * Sets and gets the orientation of legend in the treemap component.
     * @default 'None'
     */
    orientation?: LegendOrientation;

    /**
     * Enables or disables the pointer for interactive legend in the treemap component.
     * @default false
     */
    invertedPointer?: boolean;

    /**
     * Sets and gets the label position for interactive legend in the treemap component.
     * @default 'After'
     */
    labelPosition?: LabelPlacement;

    /**
     * Sets and gets the label intersect action of legend in the treemap component.
     * @default 'None'
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Sets and gets the alignment of legend in the treemap component.
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Sets and gets the location of the legend using x and y values in the treemap component. 
     */
    location?: Location;

    /**
     * Sets and gets the visibility state of the legend in the treemap component.
     * @default null
     */
    showLegendPath?: string;

    /**
     * Sets and gets the value path from the data source to render legend in the treemap component.
     * @default null
     */
    valuePath?: string;

    /**
     * Enables or disables to remove the duplicate legend item.
     * @default false
     */
    removeDuplicateLegend?: boolean;

}

/**
 * Interface for a class InitialDrillSettings
 */
export interface InitialDrillSettingsModel {

    /**
     * Sets and gets the initial rendering level index in the treemap component.
     * @default null
     */
    groupIndex?: number;

    /**
     * Sets and gets the initial rendering level name in the treemap component.
     * @default null
     */
    groupName?: string;

}

/**
 * Interface for a class LeafItemSettings
 */
export interface LeafItemSettingsModel {

    /**
     * Sets and gets the fill color of leaf items in the treemap component.
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables automatic filling of colors in leaf items of the treemap component.
     * @default false
     */
    autoFill?: boolean;

    /**
     * Sets and gets the options for customizing the color and width of the border of the leaf item in the treemap component.
     */
    border?: BorderModel;

    /**
     * Sets and gets the gap between the leaf item in the treemap component.
     * @default 0
     */
    gap?: number;

    /**
     * Sets and gets the padding of leaf item in the treemap component.
     * @default 10
     */
    padding?: number;

    /**
     * Sets and gets the opacity of leaf item in the treemap component.
     * @default 1
     */
    opacity?: number;

    /**
     * Shows or hides the labels in the treemap component.
     * @default true
     */
    showLabels?: boolean;

    /**
     * Sets and gets the value path from the data source for label of leaf item in the treemap component.
     * @default null
     */
    labelPath?: string;

    /**
     * Sets and gets the label text format of leaf item in the treemap component.
     * @default null
     */
    labelFormat?: string;

    /**
     * Sets and gets the position of the labels in the treemap component.
     * @default 'TopLeft'
     */
    labelPosition?: LabelPosition;

    /**
     * Sets and gets the style of the labels of leaf item in the treemap component.
     */
    labelStyle?: FontModel;

    /**
     * Sets and gets the label template of leaf item in the treemap component.
     * @default null
     */
    labelTemplate?: string;

    /**
     * Sets and gets the position of the template of leaf item in the treemap component.
     * @default 'Center'
     */
    templatePosition?: LabelPosition;

    /**
     * Sets and gets the label intersect action of leaf item in the treemap component.
     * @default 'Trim'
     */
    interSectAction?: LabelAlignment;

    /**
     * Sets and gets the options to customize color-mapping of the treemap component.
     */
    colorMapping?: ColorMappingModel[];

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * Enables or disables the visibility state of tooltip in the treemap component.
     * @default false
     */
    visible?: boolean;

    /**
     * Sets and gets the template for tooltip in the treemap component.
     * @default ''
     */
    template?: string;

    /**
     * Sets and gets the format of the tooltip in the treemap component.
     * @default null
     */
    format?: string;

    /**
     * Sets and gets the background color of tooltip in the treemap component.
     * @default '#000816'
     */
    fill?: string;

    /**
     * Sets and gets the opacity of tooltip in the treemap component.
     * @default 0.75
     */
    opacity?: number;

    /**
     * Sets and gets the marker shapes in the treemap component.
     * @default '[Circle]'
     */
    markerShapes?: MarkerShape[];

    /**
     * Sets and gets the options for customizing the color and width of the border of the tooltip.
     */
    border?: BorderModel;

    /**
     * Sets and gets the options for customizing the text style of tooltip of the treemap component.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Enables or disables the selection functionality in the treemap component.
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the color of the selection when the leaf item is selected in the treemap component.
     * @default null
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the selection when the leaf item is selected in the treemap component.
     * @default '0.5'
     */
    opacity?: string;

    /**
     * Sets and gets the border of the selected items in the treemap component.
     */
    border?: BorderModel;

    /**
     * Sets and gets the element in which selection must be done in the treemap component.
     * @default 'Item'
     */
    mode?: SelectionMode;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * Enables or disables the highlight functionality of the treemap component.
     * @default false
     */
    enable?: boolean;

    /**
     * Sets and gets the highlight color of the treemap component.
     * @default '#808080'
     */
    fill?: string;

    /**
     * Sets and gets the opacity of the treemap component.
     * @default '0.5'
     */
    opacity?: string;

    /**
     * Sets and gets the options for customizing the color and width of the border of the
     * highlighted item in the treemap component.
     */
    border?: BorderModel;

    /**
     * Sets and gets the element in which highlight must be done in the treemap component.
     * @default 'Item'
     */
    mode?: HighLightMode;

}

/**
 * Interface for a class LevelSettings
 */
export interface LevelSettingsModel {

    /**
     * Sets and gets the value path from the data source in the treemap component to render the item.
     * @default null
     */
    groupPath?: string;

    /**
     * Sets and gets the gap between the levels in the treemap component.
     * @default 0
     */
    groupGap?: number;

    /**
     * Sets and gets the padding of levels in the treemap component.
     * @default 10
     */
    groupPadding?: number;

    /**
     * Sets and gets the options for customizing the color and width of the border of
     * the levels of the treemap component.
     */
    border?: BorderModel;

    /**
     * Sets and gets the fill color of the level in the treemap component.
     * @default null
     */
    fill?: string;

    /**
     * Enables or disables the automatic filling of the colors in the items in the treemap component.
     * @default false
     */
    autoFill?: boolean;

    /**
     * Sets and gets the opacity in the treemap component.
     * @default 1
     */
    opacity?: number;

    /**
     * Shows or hides the header in level of the treemap component.
     * @default true
     */
    showHeader?: boolean;

    /**
     * Sets and gets the height of header in the treemap component.
     * @default 20
     */
    headerHeight?: number;

    /**
     * Sets and gets the template for header in the treemap component.
     * @default null
     */
    headerTemplate?: string;

    /**
     * Sets and gets the format of header of the levels in the treemap component.
     * @default null
     */
    headerFormat?: string;

    /**
     * Sets and gets the alignment of the header of the treemap component.
     * @default 'Near'
     */
    headerAlignment?: Alignment;

    /**
     * Sets and gets the options for customizing the style of header of the treemap component.
     */
    headerStyle?: FontModel;

    /**
     * Sets and gets the options for customizing the template position of the treemap component.
     * @default 'TopLeft'
     */
    templatePosition?: LabelPosition;

    /**
     * Sets and gets the options for customizing the color-mapping in the treemap component.
     */
    colorMapping?: ColorMappingModel[];

}