import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SmithchartAlignment } from '../utils/enum';import { SmithchartFont } from '../utils/utils';import { SmithchartFontModel} from '../utils/utils-model';import { Theme} from '../model/theme';

/**
 * Interface for a class LegendTitle
 */
export interface LegendTitleModel {

    /**
 * visibility for legend title.
 * @default true
 */
    visible?: boolean;

    /**
 * text for legend title.
 * @default ''
 */

    text?: string;

    /**
 * description for legend title.
 * @default ''
 */
    description?: string;

    /**
 * alignment for legend title.
 * @default Center
 */

    textAlignment?: SmithchartAlignment;

    /**
 *  options for customizing font
 */


    textStyle?: SmithchartFont;

}

/**
 * Interface for a class LegendLocation
 */
export interface LegendLocationModel {

    /**
 * x location for legend.
 * @default 0
 */
    x?: number;

    /**
 * y location for legend.
 * @default 0
 */

    y?: number;

}

/**
 * Interface for a class LegendItemStyleBorder
 */
export interface LegendItemStyleBorderModel {

    /**
 * border width for legend item.
 * @default 1
 */
    width?: number;

    /**
 * border color for legend item.
 * @default null
 */

    color?: string;

}

/**
 * Interface for a class LegendItemStyle
 */
export interface LegendItemStyleModel {

    /**
 * specify the width for legend item.
 * @default 10
 */
    width?: number;

    /**
 * specify the height for legend item.
 * @default 10
 */
    height?: number;

    /**
 *  options for customizing legend item style border
 */

    border?: LegendItemStyleBorderModel;

}

/**
 * Interface for a class LegendBorder
 */
export interface LegendBorderModel {

    /**
     * border width for legend.
     * @default 1
     */
    width?: number;

    /**
 * border color for legend.
 * @default null
 */

    color?: string;

}

/**
 * Interface for a class SmithchartLegendSettings
 */
export interface SmithchartLegendSettingsModel {

    /**
 * visibility for legend.
 * @default false
 */
    visible?: boolean;

    /**
   * position for legend.
   * @default 'bottom'
   */

    position?: string;

    /**
   * alignment for legend.
   * @default Center
   */

    alignment?: SmithchartAlignment;

    /**
   * width for legend.
   * @default null
   */
    width?: number;

    /**
 * height for legend.
 * @default null
 */

    height?: number;

    /**
   * shape for legend.
   * @default 'circle'
   */

    shape?: string;

    /**
   * rowCount for legend.
   * @default null
   */

    rowCount?: number;

    /**
   * columnCount for legend.
   * @default null
   */

    columnCount?: number;

    /**
 * spacing between legend item.
 * @default 8
 */
    itemPadding?: number;

    /**
 * Padding between the legend shape and text.
 * @default 5
 */
    shapePadding?: number;

    /**
 * description for legend
 * @default ''
 */
    description?: string;

    /**
 * If set to true, series' visibility collapses based on the legend visibility.
 * @default true
 */
    toggleVisibility?: boolean;

    /**
    *  options for customizing legend title
    */


    title?: LegendTitleModel;

    /**
      *  options for customizing legend location
      */


    location?: LegendLocationModel;

    /**
      *  options for customizing legend item style
      */


    itemStyle?: LegendItemStyleModel;

    /**
      *  options for customizing legend border
      */


    border?: LegendBorderModel;

    /**
    *  options for customizing font
    */


    textStyle?: SmithchartFont;

}