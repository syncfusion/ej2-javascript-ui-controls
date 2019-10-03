import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SmithchartAlignment } from '../utils/enum';import { SmithchartFont } from '../utils/utils';import { SmithchartFontModel} from '../utils/utils-model';import { Theme} from '../model/theme';

/**
 * Interface for a class LegendTitle
 */
export interface LegendTitleModel {

    /**
 * visibility for legend title.

 */
    visible?: boolean;

    /**
 * text for legend title.

 */

    text?: string;

    /**
 * description for legend title.

 */
    description?: string;

    /**
 * alignment for legend title.

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

 */
    x?: number;

    /**
 * y location for legend.

 */

    y?: number;

}

/**
 * Interface for a class LegendItemStyleBorder
 */
export interface LegendItemStyleBorderModel {

    /**
 * border width for legend item.

 */
    width?: number;

    /**
 * border color for legend item.

 */

    color?: string;

}

/**
 * Interface for a class LegendItemStyle
 */
export interface LegendItemStyleModel {

    /**
 * specify the width for legend item.

 */
    width?: number;

    /**
 * specify the height for legend item.

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

     */
    width?: number;

    /**
 * border color for legend.

 */

    color?: string;

}

/**
 * Interface for a class SmithchartLegendSettings
 */
export interface SmithchartLegendSettingsModel {

    /**
 * visibility for legend.

 */
    visible?: boolean;

    /**
   * position for legend.

   */

    position?: string;

    /**
   * alignment for legend.

   */

    alignment?: SmithchartAlignment;

    /**
   * width for legend.

   */
    width?: number;

    /**
 * height for legend.

 */

    height?: number;

    /**
   * shape for legend.

   */

    shape?: string;

    /**
   * rowCount for legend.

   */

    rowCount?: number;

    /**
   * columnCount for legend.

   */

    columnCount?: number;

    /**
 * spacing between legend item.

 */
    itemPadding?: number;

    /**
 * Padding between the legend shape and text.

 */
    shapePadding?: number;

    /**
 * description for legend

 */
    description?: string;

    /**
 * If set to true, series' visibility collapses based on the legend visibility.

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