import { Property, ChildProperty, Complex, Collection } from '@syncfusion/ej2-base';import { LabelPosition, Alignment, HighLightMode, SelectionMode, LabelIntersectAction, LabelPlacement } from '../utils/enum';import { LabelAlignment, LegendShape, LegendPosition, LegendMode, LegendOrientation } from '../utils/enum';import { Location } from '../utils/helper';import { defaultFont } from './constants';
import {MarkerShape} from "./base";

/**
 * Interface for a class Border
 */
export interface BorderModel {

    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     * @default '#808080'
     */
    color?: string;

    /**
     * The width of the border in pixels.
     * @default 0
     */
    width?: number;

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
 * Interface for a class Font
 */
export interface FontModel {

    /**
     * Font size for the text.
     * @default null
     */
    size?: string;

    /**
     * Color for the text.
     * @default null
     */
    color?: string;

    /**
     * fontFamily for the text.
     * @default ''
     */
    fontFamily?: string;

    /**
     * FontWeight for the text.
     * @default 'Normal'
     */
    fontWeight?: string;

    /**
     * FontStyle for the text.
     * @default 'Normal'
     */
    fontStyle?: string;

    /**
     * Opacity for the text.
     * @default 1
     */
    opacity?: number;

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
     * Options for customize the text alignment.
     * @default 'Center'
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
     * Options for customize the text alignment.
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * To configure sub title of maps.
     */
    subtitleSettings?: SubTitleSettingsModel;

}

/**
 * Interface for a class ColorMapping
 */
export interface ColorMappingModel {

    /**
     * Specifies the from
     * @default null
     * @isBlazorNullableType true
     */
    from?: number;

    /**
     * Specifies the to
     * @default null
     * @isBlazorNullableType true
     */
    to?: number;

    /**
     * specifies the color
     * @default null 
     */
    color?: string | string[];

    /**
     * Specifies the label text.
     * @default null
     */
    label?: string;

    /**
     * Specifies the value
     * @default null
     */
    value?: string | number;

    /**
     * Specifies the minOpacity
     * @default null 
     */
    minOpacity?: number;

    /**
     * maxOpacity
     * @default null 
     */
    maxOpacity?: number;

    /**
     * Specifies the visibility of the legend for color mapping
     * @default true
     */
    showLegend?: boolean;

}

/**
 * Interface for a class LegendSettings
 */
export interface LegendSettingsModel {

    /**
     * Toggle the legend visibility.
     * @default false
     */
    visible?: boolean;

    /**
     * Customize the legend mode.
     * @default 'Default'
     */
    mode?: LegendMode;

    /**
     * Customize the legend background
     * @default 'transparent'
     */
    background?: string;

    /**
     * Customize the legend shape.
     * @default 'Circle'
     */
    shape?: LegendShape;

    /**
     * Customize the legend width.
     * @default ''
     */
    width?: string;

    /**
     * Customize the legend height.
     * @default ''
     */
    height?: string;

    /**
     * Options for customize the legend text.
     */
    textStyle?: FontModel;

    /**
     * Specifies the legend shape color
     * @default null
     */
    fill?: string;

    /**
     * Specifies the legend opacity of shape color
     * @default 1
     */
    opacity?: number;

    /**
     * Customize the shape width.
     * @default 15
     */
    shapeWidth?: number;

    /**
     * Customize the shape height.
     * @default 15
     */
    shapeHeight?: number;

    /**
     * Customize the shape padding
     * @default 10
     */
    shapePadding?: number;

    /**
     * Specifies the images url.
     * @default null
     */
    imageUrl?: string;

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
     * @default 'Bottom'
     */
    position?: LegendPosition;

    /**
     * Customize the legend items placed
     * @default 'None'
     */
    orientation?: LegendOrientation;

    /**
     * Inverted pointer for interactive legend
     * @default false
     */
    invertedPointer?: boolean;

    /**
     * To place the label position for interactive legend.
     * @default 'After'
     */
    labelPosition?: LabelPlacement;

    /**
     * Specifies the label intersect action.
     * @default 'None'
     */
    labelDisplayMode?: LabelIntersectAction;

    /**
     * Customize the legend alignment.
     * @default 'Center'
     */
    alignment?: Alignment;

    /**
     * Customize the legend placed by given x and y values. 
     */
    location?: Location;

    /**
     * Enable or disable the visibility of the legend.
     * @default null
     */
    showLegendPath?: string;

    /**
     * Used to render particular field in dataSource as legend.
     * @default null
     */
    valuePath?: string;

    /**
     * Used to remove duplicate of the legend items.
     * @default false
     */
    removeDuplicateLegend?: boolean;

}

/**
 * Interface for a class InitialDrillSettings
 */
export interface InitialDrillSettingsModel {

    /**
     * Specifies the initial rendering level.
     * @default null
     */
    groupIndex?: number;

    /**
     * Specifies the initial rendering name.
     * @default null
     */
    groupName?: string;

}

/**
 * Interface for a class LeafItemSettings
 */
export interface LeafItemSettingsModel {

    /**
     * Specifies the fill color for leaf items.
     * @default null
     */
    fill?: string;

    /**
     * Items rendering with random colors.
     * @default false
     */
    autoFill?: boolean;

    /**
     * Specifies the border
     */
    border?: BorderModel;

    /**
     * Specifies the item gap.
     * @default 0
     */
    gap?: number;

    /**
     * Specifies the padding.
     * @default 10
     */
    padding?: number;

    /**
     * Specifies the opacity for color.
     * @default 1
     */
    opacity?: number;

    /**
     * To show or hide the labels
     * @default true
     */
    showLabels?: boolean;

    /**
     * Specifies the field name from the dataSource.
     * @default null
     */
    labelPath?: string;

    /**
     * Specifies the label format.
     * @default null
     */
    labelFormat?: string;

    /**
     * Specifies the alignment of label.
     * @default 'TopLeft'
     */
    labelPosition?: LabelPosition;

    /**
     * Customize the label style.
     */
    labelStyle?: FontModel;

    /**
     * Specifies the label template.
     * @default null
     */
    labelTemplate?: string;

    /**
     * Specifies the alignment of template.
     * @default 'Center'
     */
    templatePosition?: LabelPosition;

    /**
     * Specifies the label intersect action.
     * @default 'Trim'
     */
    interSectAction?: LabelAlignment;

    /**
     * Specifies the colorMapping
     */
    colorMapping?: ColorMappingModel[];

}

/**
 * Interface for a class TooltipSettings
 */
export interface TooltipSettingsModel {

    /**
     * To enable or disable the Tooltip.
     * @default false
     */
    visible?: boolean;

    /**
     * To specifies the template for tooltip.
     * @default ''
     */
    template?: string;

    /**
     * Specifies the format by given ${data}
     * @default null
     */
    format?: string;

    /**
     * To fill the tooltip background.
     * @default '#000816'
     */
    fill?: string;

    /**
     * Specifies the opacity for fill.
     * @default 0.75
     */
    opacity?: number;

    /**
     * Specifies the marker shapes.
     * @default '[Circle]'
     */
    markerShapes?: MarkerShape[];

    /**
     * Specifies the tooltip border.
     */
    border?: BorderModel;

    /**
     * Specifies the text style.
     */
    textStyle?: FontModel;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * To enable or disable the selection
     * @default false
     */
    enable?: boolean;

    /**
     * To specifies the selection color
     * @default '#808080'
     */
    fill?: string;

    /**
     * To specified the opacity of color.
     * @default '0.5'
     */
    opacity?: string;

    /**
     * To specifies the border
     */
    border?: BorderModel;

    /**
     * To specifies the selection mode.
     * @default 'Item'
     */
    mode?: SelectionMode;

}

/**
 * Interface for a class HighlightSettings
 */
export interface HighlightSettingsModel {

    /**
     * To enable or disable the highlight.
     * @default false
     */
    enable?: boolean;

    /**
     * To specifies the highlight color.
     * @default '#808080'
     */
    fill?: string;

    /**
     * To specified the opacity of color.
     * @default '0.5'
     */
    opacity?: string;

    /**
     * To specifies the border
     */
    border?: BorderModel;

    /**
     * To specifies the highlight mode.
     * @default 'Item'
     */
    mode?: HighLightMode;

}

/**
 * Interface for a class LevelSettings
 */
export interface LevelSettingsModel {

    /**
     * Specifies the field name from the dataSource.
     * @default null
     */
    groupPath?: string;

    /**
     * Specifies the padding.
     * @default 0
     */
    groupGap?: number;

    /**
     * Specifies the padding.
     * @default 10
     */
    groupPadding?: number;

    /**
     * Specifies the border
     */
    border?: BorderModel;

    /**
     * Specifies the background of level.
     * @default null
     */
    fill?: string;

    /**
     * Items rendering with random colors.
     * @default false
     */
    autoFill?: boolean;

    /**
     * Specifies the opacity for color.
     * @default 1
     */
    opacity?: number;

    /**
     * To Show or hide the header in level.
     * @default true
     */
    showHeader?: boolean;

    /**
     * To specifies the height of header.
     * @default 20
     */
    headerHeight?: number;

    /**
     * Specifies the template for header rendering.
     * @default null
     */
    headerTemplate?: string;

    /**
     * Specifies the header format.
     * @default null
     */
    headerFormat?: string;

    /**
     * Customize the text alignment
     * @default 'Near'
     */
    headerAlignment?: Alignment;

    /**
     * Customize the header style.
     */
    headerStyle?: FontModel;

    /**
     * Specifies the label position in level.
     * @default 'TopLeft'
     */
    templatePosition?: LabelPosition;

    /**
     * Specifies the colorMapping
     */
    colorMapping?: ColorMappingModel[];

}