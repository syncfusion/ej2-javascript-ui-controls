import { Component, Property, NotifyPropertyChanges, Complex, Collection, Browser } from '@syncfusion/ej2-base';import { EventHandler, remove, ModuleDeclaration, Internationalization } from '@syncfusion/ej2-base';import { Event, EmitType } from '@syncfusion/ej2-base';import { createSvg, removeElement } from '../common/utils/helper';import { Rect, measureText, Size, SvgRenderer } from '@syncfusion/ej2-svg-base';import { RangeTooltip } from '../range-navigator/user-interaction/tooltip';import { Border, Margin, PeriodSelectorSettings } from '../common/model/base';import { BorderModel, MarginModel, PeriodSelectorSettingsModel } from '../common/model/base-model';import { RangeSeries } from './renderer/chart-render';import { RangeNavigatorAxis } from './renderer/range-axis';import { RangeNavigatorSeries, StyleSettings, RangeTooltipSettings } from './model/range-base';import { RangeNavigatorSeriesModel, StyleSettingsModel } from './model/range-base-model';import { ThumbSettingsModel, RangeTooltipSettingsModel } from './model/range-base-model';import { RangeSlider } from './renderer/slider';import { AxisPosition, StepLineSeries, ExportType, IPrintEventArgs, RectOption } from '../chart/index';import { Chart, getElement, ChartTheme, LineSeries, AreaSeries } from '../chart/index';import { DateTime, Logarithmic, IResizeRangeNavigatorEventArgs } from '../range-navigator/index';import { ILabelRenderEventsArgs, IRangeTooltipRenderEventArgs } from './model/range-navigator-interface';import { IRangeLoadedEventArgs, IRangeStyle, IChangedEventArgs } from './model/range-navigator-interface';import { getRangeThemeColor } from './utils/theme';import { RangeValueType, LabelAlignment, RangeLabelIntersectAction } from './utils/enum';import { Font } from '../common/model/base';import { FontModel } from '../common/model/base-model';import { MajorGridLines, MajorTickLines, VisibleRangeModel } from '../chart/axis/axis';import { MajorGridLinesModel, MajorTickLinesModel } from '../chart/axis/axis-model';import { RangeNavigatorTheme } from './utils/theme';import { SkeletonType } from '../chart/utils/enum';import { DataManager, Query } from '@syncfusion/ej2-data';import { Double } from '../chart/axis/double-axis';import { Data } from '../common/model/data';import { ExportUtils } from '../common/utils/export';import { RangeIntervalType } from '../common/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { PeriodSelector } from '../common/period-selector/period-selector';import { AccumulationChart } from '../accumulation-chart/index';import { IRangeSelectorRenderEventArgs } from '../chart/model/chart-interface';import { StockChart } from '../stock-chart/stock-chart';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RangeNavigator
 */
export interface RangeNavigatorModel extends ComponentModel{

    /**
     * The width of the range navigator as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, range navigator renders to the full width of its parent element.


     */

    width?: string;

    /**
     * The height of the chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, range navigator renders to the full height of its parent element.


     */

    height?: string;

    /**
     * It defines the data source for a range navigator.

     */
    dataSource?: Object | DataManager;

    /**
     * It defines the xName for the range navigator.

     */
    xName?: string;

    /**
     * It defines the yName for the range navigator.

     */
    yName?: string;

    /**
     * It defines the query for the data source.

     */
    query?: Query;

    /**
     * It defines the configuration of series in the range navigator
     */
    series?: RangeNavigatorSeriesModel[];

    /**
     * Options for customizing the tooltip of the chart.
     */

    tooltip?: RangeTooltipSettingsModel;

    /**
     * Minimum value for the axis


     */
    minimum?: number | Date;

    /**
     * Maximum value for the axis


     */
    maximum?: number | Date;

    /**
     * interval value for the axis


     */
    interval?: number;

    /**
     * IntervalType for the dateTime axis

     */
    intervalType?: RangeIntervalType;

    /**
     * Specifies, when the axis labels intersect with each other.They are,
     * * None: Shows all the labels.
     * * Hide: Hides the label when it intersects.

     */

    labelIntersectAction?: RangeLabelIntersectAction;

    /**
     * base value for log axis

     */
    logBase?: number;

    /**
     * ValueType for the axis

     */
    valueType?: RangeValueType;

    /**
     * Label positions for the axis

     */
    labelPosition?: AxisPosition;

    /**
     * Duration of the animation

     */
    animationDuration?: number;

    /**
     * Enable grouping for the labels

     */
    enableGrouping?: boolean;

    /**
     * Enable deferred update for the range navigator

     */
    enableDeferredUpdate?: boolean;

    /**
     * To render the period selector with out range navigator.

     */
    disableRangeSelector?: boolean;

    /**
     * Enable snapping for range navigator sliders

     */
    allowSnapping?: boolean;

    /**
     * Specifies whether a grouping separator should be used for a number.

     */
    useGroupingSeparator?: boolean;

    /**
     * GroupBy property for the axis

     */
    groupBy?: RangeIntervalType;

    /**
     * Tick Position for the axis

     */
    tickPosition?: AxisPosition;

    /**
     * Label style for the labels
     */
    labelStyle?: FontModel;

    /**
     * MajorGridLines
     */
    majorGridLines?: MajorGridLinesModel;

    /**
     * MajorTickLines
     */
    majorTickLines?: MajorTickLinesModel;

    /**
     * Navigator style settings
     */
    navigatorStyleSettings?: StyleSettingsModel;

    /**
     * Period selector settings
     */
    periodSelectorSettings?: PeriodSelectorSettingsModel;

    /**
     * Options for customizing the color and width of the chart border.
     */
    navigatorBorder?: BorderModel;

    /**
     * Specifies the theme for the range navigator.

     */
    theme?: ChartTheme;

    /**
     * Selected range for range navigator.

     */
    value?: number[] | Date[];

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.

     */

    labelFormat?: string;

    /**
     * Specifies the skeleton format in which the dateTime format will process.

     */

    skeleton?: string;

    /**
     * It specifies the type of format to be used in dateTime format process.

     */

    skeletonType?: SkeletonType;

    /**
     * It specifies the label alignment for secondary axis labels

     */

    secondaryLabelAlignment?: LabelAlignment;

    /**
     * Margin for the range navigator

     */
    margin?: MarginModel;

    /**
     * Triggers before the range navigator rendering
     * @event

     */
    load?: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator rendering
     * @event

     */
    loaded?: EmitType<IRangeLoadedEventArgs>;

    /**
     * Triggers after the range navigator resized
     * @event

     */
    resized?: EmitType<IResizeRangeNavigatorEventArgs>;

    /**
     * Triggers before the label rendering
     * @event

     */
    labelRender?: EmitType<ILabelRenderEventsArgs>;

    /**
     * Triggers after change the slider.
     * @event

     */
    changed?: EmitType<IChangedEventArgs>;

    /**
     * Triggers before the tooltip for series is rendered.
     * @event

     */

    tooltipRender?: EmitType<IRangeTooltipRenderEventArgs>;

    /**
     * Triggers before the range navigator selector rendering
     * @event

     */
    selectorRender?: EmitType<IRangeSelectorRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event

     */

    beforePrint?: EmitType<IPrintEventArgs>;

}