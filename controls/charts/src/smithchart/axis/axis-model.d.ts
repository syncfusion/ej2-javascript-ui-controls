import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SmithchartFont} from '../utils/utils';import { AxisLabelPosition, SmithchartLabelIntersectAction} from '../utils/enum';import { SmithchartFontModel} from '../utils/utils-model';import { Theme} from '../model/theme';

/**
 * Interface for a class SmithchartMajorGridLines
 */
export interface SmithchartMajorGridLinesModel {

    /**
    * width of the major grid lines

    */
    width?: number;

    /**
     * The dash array of the major grid lines.

     */

    dashArray?: string;

    /**
     * visibility of  major grid lines.

     */

    visible?: boolean;

    /**
     * option for customizing the majorGridLine color

     */

    color?: string;

    /**
     * opacity of  major grid lines.

     */

    opacity?: number;

}

/**
 * Interface for a class SmithchartMinorGridLines
 */
export interface SmithchartMinorGridLinesModel {

    /**
     * width of the minor grid lines

     */
    width?: number;

    /**
     * The dash array of the minor grid lines.

     */

    dashArray?: string;

    /**
     * visibility of  minor grid lines.

     */

    visible?: boolean;

    /**
     * option for customizing the minorGridLine color

     */

    color?: string;

    /**
     * count of  minor grid lines.

     */
    count?: number;

}

/**
 * Interface for a class SmithchartAxisLine
 */
export interface SmithchartAxisLineModel {

    /**
     * visibility of  axis line.

     */
    visible?: boolean;

    /**
    * width of the axis lines

    */
    width?: number;

    /**
     * option for customizing the axisLine color

     */

    color?: string;

    /**
     * The dash array of the axis line.

     */

    dashArray?: string;

}

/**
 * Interface for a class SmithchartAxis
 */
export interface SmithchartAxisModel {

    /**
     * visibility of  axis.

     */
    visible?: boolean;

    /**
     * position of  axis line.

     */

    labelPosition?: AxisLabelPosition;

    /**
     * axis labels will be hide when overlap with each other.

     */
    labelIntersectAction?: SmithchartLabelIntersectAction;

    /**
     * Options for customizing major grid lines.
     */
    majorGridLines?: SmithchartMajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     */

    minorGridLines?: SmithchartMinorGridLinesModel;

    /**
     * Options for customizing axis lines.
     */

    axisLine?: SmithchartAxisLineModel;

    /**
     * Options for customizing font.
     */

    labelStyle?: SmithchartFontModel;

}