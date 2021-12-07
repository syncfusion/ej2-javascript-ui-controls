import { Size } from '@syncfusion/ej2-svg-base';
import { BulletChart } from '../bullet-chart';
import { ScaleGroup } from '../renderer/scale-render';
import { RangeModel } from '../model/bullet-base-model';
import { LegendShape, ChartTheme } from '../../chart/utils/enum';
/**
 * Interface for Bullet chart Theme Style
 */
export interface IBulletStyle {
    majorTickLineColor: string;
    minorTickLineColor: string;
    background: string;
    labelFontColor: string;
    categoryFontColor: string;
    labelFontFamily: string;
    tooltipFill: string;
    legendLabel: string;
    tooltipBoldLabel: string;
    featuredMeasureColor: string;
    comparativeMeasureColor: string;
    titleFontColor: string;
    titleFontFamily: string;
    dataLabelFontColor: string;
    subTitleFontColor: string;
    subTitleFontFamily: string;
    firstRangeColor: string;
    secondRangeColor: string;
    thirdRangeColor: string;
    rangeStrokes: Object[];
}
export interface IBulletChartEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}
/**
 * Interface for Bullet chart Resize events
 */
export interface IBulletResizeEventArgs {
    /** Defines the name of the Event */
    name: string;
    /** Defines the previous size of the bullet chart */
    previousSize: Size;
    /** Defines the current size of the bullet chart */
    currentSize: Size;
    /** Defines the bullet chart instance */
    chart: BulletChart;
}
/**
 * Interface for Bullet chart scale calculations
 */
export interface IBulletScaleBounds {
    /** Defines class values */
    object: ScaleGroup;
    /** Defines the index value of the range */
    rangeIndex: number;
    /** Defines the qualitative ranges */
    rangeOptions: RangeModel;
    /** Defines the end values of the ranges */
    rangeEndValue: number;
}
/**
 * Interface for feature and comparative bar bounds
 */
export interface IBulletBounds {
    /** Defines point x values */
    pointX: number;
    /** Defines the width of the feature bar */
    width: number;
    /** Defines point x values of the bar */
    lPointX: number;
}
/**
 * Interface for feature and comparative bar bounds
 */
export interface IVerticalBulletBounds {
    /** Defines point x values */
    pointY: number;
    /** Defines the width of the feature bar */
    height: number;
    /** Defines point x values of the bar */
    lPointY: number;
}
/**
 * Interface for feature bar bounds
 */
export interface IFeatureBarBounds {
    /** Defines point x values */
    x: number;
    /** Defines point y values */
    y: number;
    /** Defines the height of the feature bar */
    height: number;
    /** Defines the width of the feature bar */
    width: number;
}
/**
 * Interface for tooltip content
 */
export interface IBulletTooltipContent {
    /** Defines the actual value of the feature bar */
    value: string | number;
    /** Defines the target value of the comparative bar */
    target?: string[] | number[] | string;
    /** Defines the category values */
    category?: string | number;
}
/**
 * interface for loaded event
 */
export interface IBulletLoadedEventArgs {
    /** name of the event */
    name: string;
    /** bulletChart */
    bulletChart: BulletChart;
    /** theme */
    theme?: ChartTheme;
}
/**
 * Tooltip Event arguments
 */
export interface IBulletchartTooltipEventArgs {
    /** Defines the actual value of the feature bar - Read Only */
    value: string | number;
    /** Defines the target value of the comparative bar - Read Only */
    target: string[] | number[] | string;
    /** Defines the name of the Event - Read Only */
    name: string;
    /** Defines the tooltip template */
    template?: string;
    /** Defines the tooltip text */
    text?: string;
}
/**
 * Bullet chart tooltip template
 */
export interface IBulletTemplate {
    /** Defines the actual value of the feature bar */
    value: string;
    /** Defines the target value of the comparative bar */
    target: string;
    /** Defines the category values */
    category: string;
}
export interface IBarProperties {
    /** Defines class values */
    end: number;
    /** Defines the index value of the range */
    opacity: number;
    /** Defines the qualitative ranges */
    color: string;
    /** Defines the end values of the ranges */
    name: string;
    /** Defines the end values of the ranges */
    index: number;
    /** Defines the end values of the ranges */
    shape: LegendShape;
}
export interface IBulletMouseEventArgs extends IBulletChartEventArgs {
    /** Defines current mouse event target id */
    target: string;
    /** Defines current mouse x location */
    x: number;
    /** Defines current mouse y location */
    y: number;
}
export interface IBulletLegendRenderEventArgs extends IBulletChartEventArgs {
    /** Defines the current legend text */
    text: string;
    /** Defines the current legend fill color */
    fill: string;
    /** Defines the current legend shape */
    shape: LegendShape;
}
