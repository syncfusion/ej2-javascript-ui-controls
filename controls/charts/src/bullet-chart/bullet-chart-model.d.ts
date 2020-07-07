import { Component, Property, NotifyPropertyChanges, Browser, Complex, Event, EmitType } from '@syncfusion/ej2-base';import { EventHandler, remove, INotifyPropertyChanged, ModuleDeclaration, Collection, isNullOrUndefined } from '@syncfusion/ej2-base';import { Internationalization } from '@syncfusion/ej2-base';import { SvgRenderer, Rect, Size, measureText, TextOption } from '@syncfusion/ej2-svg-base';import { Query } from '@syncfusion/ej2-data';import { OrientationType, TickPosition, LabelsPlacement, TextPosition, FeatureType, TargetType } from './utils/enum';import { AnimationModel, BorderModel } from '../common/model/base-model';import { Margin, Animation, Border } from '../common/model/base';import { MarginModel } from '../common/model/base-model';import { Data } from '../common/model/data';import { BulletChartAxis } from './renderer/bullet-axis';import { BulletChartTheme } from './utils/theme';import { ScaleGroup } from './renderer/scale-render';import { redrawElement, textElement, getElement, appendChildElement, RectOption, stringToNumber } from '../common/utils/helper';import { BulletTooltip } from './user-interaction/tooltip';import { IPrintEventArgs } from '../chart/model/chart-interface';import { ExportType } from '../common/utils/enum';import { AccumulationChart } from '../accumulation-chart/accumulation';import { Chart } from '../chart/chart';import { ChartTheme} from '../chart/utils/enum';import { RangeNavigator } from '../range-navigator/range-navigator';import { getTitle, logBase } from '../common/utils/helper';import { BulletTooltipSettings, Range, BulletLabelStyle, BulletDataLabel } from './model/bullet-base';import { MajorTickLinesSettings, MinorTickLinesSettings } from './model/bullet-base';import { BulletChartLegendSettings } from '../bullet-chart/model/bullet-base';import { BulletChartLegendSettingsModel } from '../bullet-chart/model/bullet-base-model';import {  IBulletMouseEventArgs, IBulletLegendRenderEventArgs } from '../bullet-chart/model/bullet-interface';import { BulletChartLegend } from '../bullet-chart/legend/legend';import { BulletTooltipSettingsModel, RangeModel } from './model/bullet-base-model';import { MajorTickLinesSettingsModel, MinorTickLinesSettingsModel } from './model/bullet-base-model';import { BulletLabelStyleModel, BulletDataLabelModel } from './model/bullet-base-model';import { resized, bulletChartMouseClick } from '../common/model/constants';import { IBulletResizeEventArgs, IBulletStyle, IBulletchartTooltipEventArgs, IBulletLoadedEventArgs } from './model/bullet-interface';import { IFeatureBarBounds } from './model/bullet-interface';import { getBulletThemeColor } from './utils/theme';import { ExportUtils } from '../common/utils/export';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BulletChart
 */
export interface BulletChartModel extends ComponentModel{

    /**
     * The width of the bullet chart as a string accepts input as both like '100px' or '100%'.
     * If specified as '100%, bullet chart renders to the full width of its parent element.
     * @default null
     * @aspDefaultValueIgnore
     */

    width?: string;

    /**
     * The height of the bullet chart as a string accepts input both as '100px' or '100%'.
     * If specified as '100%, bullet chart renders to the full height of its parent element.
     * @default null
     * @aspDefaultValueIgnore
     */

    height?: string;

    /**
     * The locale of the bullet chart as a string.
     * @default null
     * @aspDefaultValueIgnore
     */

    locale?: string;

    /**
     * Options for customizing major tick lines.
     */

    majorTickLines?: MajorTickLinesSettingsModel;

    /**
     * Options for customizing minor tick lines.
     */

    minorTickLines?: MinorTickLinesSettingsModel;

    /**
     * Specifies the minimum range of an scale.
     * @default null
     */

    minimum?: number;

    /**
     * Specifies the maximum range of an scale.
     * @default null
     */

    maximum?: number;

    /**
     * Specifies the interval for an scale.
     * @default null
     */

    interval?: number;

    /**
     * specifies the interval of minor ticks
     * @default 4
     */

    minorTicksPerInterval?: number;

    /**
     * Options for customizing labels
     */

    labelStyle?: BulletLabelStyleModel;

    /**
     * Options for customizing values labels
     */

    categoryLabelStyle?: BulletLabelStyleModel;

    /**
     * Specifies the format of the bullet chart axis labels.
     * @default ''
     */

    labelFormat?: string;

    /**
     * Specifies the title of the bullet chart.
     * @default ''
     */

    title?: string;

    /**
     * Options for customizing the title styles of the bullet chart
     */
    titleStyle?: BulletLabelStyleModel;

    /**
     * Specifies the sub title of the bullet chart.
     * @default ''
     */

    subtitle?: string;

    /**
     * Options for customizing the sub title styles of the bullet chart
     */
    subtitleStyle?: BulletLabelStyleModel;

    /**
     * Orientation of the scale
     * @default 'Horizontal'
     */
    orientation?: OrientationType;

    /**
     * Options for customizing the color and width of the chart border.
     */

    border?: BorderModel;

    /**
     * Options for customizing the tooltip of the BulletChart.
     */

    tooltip?: BulletTooltipSettingsModel;

    /**
     * provides Qualitative ranges of the bullet chart.
     */
    // tslint:disable-next-line:max-line-length
    ranges?: RangeModel[];

    /**
     * specifies the axis label position of the bullet chart
     * @default 'Outside'
     */

    labelPosition?: LabelsPlacement;

    /**
     * specifies the tick position of the bullet chart
     * @default 'Outside'
     */

    tickPosition?: TickPosition;

    /**
     * Sets the title position of bullet chart.
     * @default 'Top'.
     */

    titlePosition?: TextPosition;

    /**
     * If set to true, the axis will render at the opposite side of its default position.
     * @default false
     */

    opposedPosition?: boolean;

    /**
     * Specifies the theme for the bullet chart.
     * @default 'Material'
     */
    theme?: ChartTheme;

    /**
     * Options for customizing animation of the feature bar.
     */

    animation?: AnimationModel;

    /**
     * Options for customizing data label of the feature bar.
     */

    dataLabel?: BulletDataLabelModel;

    /**
     * Options for customizing the legend of the bullet chart.
     */
    legendSettings?: BulletChartLegendSettingsModel;

    /**
     * default value for enableGroupSeparator
     * @default false
     */
    enableGroupSeparator?: boolean;

    /**
     *  Options to customize left, right, top and bottom margins of the bullet chart.
     */

    margin?: MarginModel;

    /**
     * Options for customizing comparative bar color bullet chart
     * @default 5
     */

    targetWidth?: number;

    /**
     * Default stroke of comparative measure.
     * @default '#191919'
     */

    targetColor?: string;

    /**
     * Options for customizing feature bar height of the bullet chart
     * @default 6
     */

    valueHeight?: number;

    /**
     * Default stroke color of feature measure.
     * @default null
     */

    valueFill?: string;

    /**
     * Options for customizing the color and width of the feature bar border.
     */

    valueBorder?: BorderModel;

    /**
     * default value of multiple data bullet chart.
     * @isdatamanager false
     * @default null
     */

    dataSource?: Object;

    /**
     * It defines the query for the data source.
     * @default null
     */
    query?: Query;

    /**
     * It defines the category for the data source.
     * @default null
     */
    categoryField?: string;

    /**
     * Default type on feature measure.
     * @default 'Rect'
     */

    type?: FeatureType;

    /**
     * The DataSource field that contains the value value.
     * @default ''
     */

    valueField?: string;

    /**
     * The DataSource field that contains the target value.
     * @default ''
     */

    targetField?: string;

    /**
     * The DataSource field that contains the target value.
     * @default ['Rect', 'Cross', 'Circle']
     */
    targetTypes?: TargetType[];

    /**
     * TabIndex value for the bullet chart.
     * @default 1
     */
    tabIndex?: number;

    /**
     * Triggers before the bulletchart tooltip is rendered.
     * @event
     */
    tooltipRender?: EmitType<IBulletchartTooltipEventArgs>;

    /**
     * Triggers before bullet chart load.
     * @event
     */
    load?: EmitType<IBulletLoadedEventArgs>;

    /**
     * Triggers after the bullet chart rendering
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<IBulletLoadedEventArgs>;

    /**
     * Triggers on clicking the chart.
     * @event
     * @blazorProperty 'OnBulletChartMouseClick'
     */

    bulletChartMouseClick?: EmitType<IBulletMouseEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * @event
     * @deprecated
     */
    legendRender?: EmitType<IBulletLegendRenderEventArgs>;

    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */

    beforePrint?: EmitType<IPrintEventArgs>;

}