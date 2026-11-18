/**
 * Chart sub-models and helper classes.
 */
import { ChartShape, LabelPosition, LegendPosition, ValueType } from '../common/enum';

/**
 * Represents the Legend.
 */
export interface LegendSettingsModel {
    /**
     * If set to true, legend will be visible.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Position of the legend in the chart are,
     * * Auto: Places the legend based on area type.
     * * Top: Displays the legend at the top of the chart.
     * * Left: Displays the legend at the left of the chart.
     * * Bottom: Displays the legend at the bottom of the chart.
     * * Right: Displays the legend at the right of the chart.
     *
     * @default 'Auto'
     */
    position?: LegendPosition;
}

/**
 * Represents the DataLabelSettings.
 */
export interface DataLabelSettingsModel {
    /**
     * If set true, data label for series renders.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * Specifies the position of the data label. They are,
     * * Outer: Positions the label outside the point.
     * * top: Positions the label on top of the point.
     * * Bottom: Positions the label at the bottom of the point.
     * * Middle: Positions the label to the middle of the point.
     * * Auto: Positions the label based on series.
     *
     * @default 'Auto'
     */
    position?: LabelPosition;

    /**
     * Specifies the data source field name for data label text mapping.
     *
     * @default ''
     */
    name?: string;
}

/**
 * Represents the Border.
 */
export interface BorderModel {
    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     *
     * @default ''
     */
    color?: string;

    /**
     * The width of the border in pixels.
     *
     * @default 1
     */
    width?: number;
}

/**
 * Represents the MarkerSettings.
 */
export interface MarkerSettingsModel {
    /**
     * If set to true the marker for series is rendered. This is applicable only for line and area type series.
     *
     * @default false
     */
    visible?: boolean;

    /**
     * The different shape of a marker:
     * * Circle
     * * Triangle
     * * Diamond
     * * Plus
     * * None
     *
     * @default 'Circle'
     */
    shape?: ChartShape;

    /**
     * The size of the marker in pixels.
     *
     * @default 5
     */
    size?: number;

    /**
     * The fill color of the marker that accepts value in hex and rgba as a valid CSS color string. By default, it will take series color.
     * This property will work only if the `isFilled` property is set to true.
     *
     * @default null
     */
    fill?: string;

    /**
     * By default, the marker gets filled with the fill color. If set to false, the marker background will be transparent.
     *
     * @default true
     */
    isFilled?: boolean;

    /**
     * Options for customizing the border of a marker.
     *
     * @default {}
     */
    border?: BorderModel;
}

/**
 * Specifies the major grid lines in the `axis`.
 */
export interface MajorGridLinesModel {
    /**
     * The width of the line in pixels.
     *
     * @default 0
     */
    width?: number;
}

/**
 * Specifies the minor grid lines in the `axis`.
 */
export interface MinorGridLinesModel {
    /**
     * The width of the line in pixels.
     *
     * @default 0
     */
    width?: number;
}

/**
 * Represents the axis.
 */
export interface MajorTickLinesModel {
    /**
     * The width of the line in pixels.
     *
     * @default 1
     */
    width?: number;
}

export interface LabelStyleModel {
    /**
     * Font size for the axis labels.
     *
     * @default '12px'
     */
    size?: string;
}

/**
 * Represents the axis.
 */
export interface AxisModel {
    /**
     * Specifies the title of an axis.
     *
     * @default ''
     */
    title?: string;

    /**
     * Options for customizing major grid lines.
     *
     * @default {}
     */
    majorGridLines?: MajorGridLinesModel;

    /**
     * Options for customizing minor grid lines.
     *
     * @default {}
     */
    minorGridLines?: MinorGridLinesModel;

    /**
     * Options for customizing major tick lines.
     */
    majorTickLines?: MajorTickLinesModel;

    /**
     * Options for customizing the axis label style.
     */
    labelStyle?: LabelStyleModel;

    /**
     * If set to true, axis label will be visible.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies the value type of an axis.
     *
     * @default 'Category'
     */
    valueType?: ValueType;

    /**
     * The minimum value of the axis.
     */
    minimum?: Date | number;

    /**
     * The maximum value of the axis.
     */
    maximum?: Date | number;

    /**
     * Specifies the range padding of an axis.
     */
    rangePadding?: string;

    /**
     * Specifies the placement of edge labels.
     */
    edgeLabelPlacement?: string;

    /**
     * Specifies the minor ticks per interval.
     */
    minorTicksPerInterval?: number;

    /**
     * Options for customizing the axis line.
     */
    lineStyle?: { width?: number; color?: string };

    /**
     * Specifies the interval between axis labels.
     */
    interval?: number;

    /**
     * Specifies the value at which axis crosses with other axis.
     */
    crossesAt?: number;
}
