import { Property, Complex, ChildProperty } from '@syncfusion/ej2-base';import { SmithchartFont} from '../utils/utils';import { AxisLabelPosition, SmithchartLabelIntersectAction} from '../utils/enum';import { SmithchartFontModel} from '../utils/utils-model';import { Theme} from '../model/theme';

/**
 * Interface for a class SmithchartMajorGridLines
 */
export interface SmithchartMajorGridLinesModel {

    /**
     * width of the major grid lines
     *
     * @default 1
     */

    width?: number;

    /**
     * The dash array of the major grid lines.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * visibility of  major grid lines.
     *
     * @default true
     */

    visible?: boolean;

    /**
     * option for customizing the majorGridLine color
     *
     * @default null
     */

    color?: string;

    /**
     * opacity of  major grid lines.
     *
     * @default 1
     */

    opacity?: number;

}

/**
 * Interface for a class SmithchartMinorGridLines
 */
export interface SmithchartMinorGridLinesModel {

    /**
     * width of the minor grid lines
     *
     * @default 1
     */
    width?: number;

    /**
     * The dash array of the minor grid lines.
     *
     * @default ''
     */

    dashArray?: string;

    /**
     * visibility of  minor grid lines.
     *
     * @default false
     */

    visible?: boolean;

    /**
     * option for customizing the minorGridLine color
     *
     * @default null
     */

    color?: string;

    /**
     * count of  minor grid lines.
     *
     * @default 8
     */
    count?: number;

}

/**
 * Interface for a class SmithchartAxisLine
 */
export interface SmithchartAxisLineModel {

    /**
     * visibility of  axis line.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * width of the axis lines
     *
     * @default 1
     */
    width?: number;

    /**
     * option for customizing the axisLine color
     *
     * @default null
     */

    color?: string;

    /**
     * The dash array of the axis line.
     *
     * @default ''
     */

    dashArray?: string;

}

/**
 * Interface for a class SmithchartAxis
 */
export interface SmithchartAxisModel {

    /**
     * visibility of  axis.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * position of  axis line.
     *
     * @default Outside
     */

    labelPosition?: AxisLabelPosition;

    /**
     * axis labels will be hide when overlap with each other.
     *
     * @default Hide
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