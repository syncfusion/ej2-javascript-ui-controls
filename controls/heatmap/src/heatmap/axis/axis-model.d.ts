import { Property, Complex, ChildProperty, DateFormatOptions, isNullOrUndefined, Collection } from '@syncfusion/ej2-base';import { DataUtil } from '@syncfusion/ej2-data';import { Orientation } from '../utils/enum';import { FontModel, TitleModel, AxisLabelBorderModel, MultiLevelLabelsModel, MultiLevelCategoriesModel } from '../model/base-model';import { Font, Title, AxisLabelBorder, MultiLevelLabels, MultiLevelCategories, MultipleRow } from '../model/base';import { Theme } from '../model/theme';import { Rect, measureText, Size, rotateTextSize, increaseDateTimeInterval, formatValue, textTrim } from '../utils/helper';import { MultiLevelPosition, textWrap } from '../utils/helper';import { ValueType, IntervalType, LabelIntersectAction, LabelType } from '../utils/enum';import { HeatMap } from '../heatmap'

/**
 * Interface for a class Axis
 */
export interface AxisModel {

    /**
     * Title of heat map axis
     * @default ''
     */
    title?: TitleModel;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */

    opposedPosition?: boolean;

    /**
     * Options for label assignment.
     */
    labels?: string[];

    /**
     * Options for customizing the label text.
     */
    textStyle?: FontModel;

    /**
     * The angle to rotate the axis label
     * @default 0
     */

    labelRotation?: number;

    /**
     * It specifies whether the axis to be rendered in inversed manner or not.
     * @default false
     */

    isInversed?: boolean;

    /**
     * Specifies the type of data the axis is handling.
     * * Numeric:  Renders a numeric axis.
     * * DateTime: Renders a dateTime axis.
     * * Category: Renders a category axis.
     * @default Category
     * @aspType Syncfusion.EJ2.HeatMap.ValueType
     * @blazorType Syncfusion.EJ2.HeatMap.ValueType
     * @isEnumeration true
     */

    valueType?: ValueType;

    /**
     * Specifies the increment for an axis label.
     * @default 1
     */

    increment?: number;

    /**
     * Defines the axis label display type for date time axis.
     * * None: Axis labels displayed based on the value type.
     * * Years: Define the axis labels display in every year.
     * * Months: Define the axis labels display in every month.
     * * Days: Define the axis labels display in every day.
     * * Hours: Define the axis labels display in every hour. 
     * @default 'None'
     */

    showLabelOn?: LabelType;

    /**
     * Specifies the minimum range of an axis.
     * @default null
     */

    minimum?: Object;

    /**
     * Specifies the maximum range of an axis.
     * @default null
     */

    maximum?: Object;

    /**
     * Specifies the interval for an axis.
     * @default null
     */

    interval?: number;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     * @default ''
     */

    labelFormat?: string;

    /**
     * Specifies the types like `Years`, `Months`, `Days`, `Hours`, `Minutes` in date time axis.They are,
     * * Years: Defines the interval of the axis in years.
     * * Months: Defines the interval of the axis in months.
     * * Days: Defines the interval of the axis in days.
     * * Hours: Defines the interval of the axis in hours.
     * * Minutes: Defines the interval of the axis in minutes.
     * @default 'Days'
     */

    intervalType?: IntervalType;

    /**
     * Specifies the actions like `Rotate45`, `None` and `Trim` when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Rotate45: Rotates the label to 45 degree when it intersects.
     * * Trim : Trim the label when label text width exceed the label width
     * @default Trim
     */

    labelIntersectAction?: LabelIntersectAction;

    /**
     * Enable Trim for heatmap yAxis
     * @default false
     */

    enableTrim?: boolean;

    /**
     * Specifies the maximum length of an axis label.
     * @default 35.
     */
    maxLabelLength?: number;

    /**
     * Border of the axis labels.
     */

    border?: AxisLabelBorderModel;

    /**
     * Specifies the multi level labels collection for the axis
     */
    multiLevelLabels?: MultiLevelLabelsModel[];

}