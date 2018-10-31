/**
 * Interface for range navigator
 */
import { RangeNavigator } from '../index';
import { DataPoint } from '../utils/helper';
import { FontModel, Rect } from '../../chart/index';
import { ItemModel } from '@syncfusion/ej2-navigations';
/**
 * interface for load event
 */
export interface ILoadEventArgs {
    /** name of the event */
    name: string;
    /** rangeNavigator */
    rangeNavigator: RangeNavigator;
}
/**
 * interface for loaded event
 */
export interface IRangeLoadedEventArgs {
    /** name of the event */
    name: string;
    /** rangeNavigator */
    rangeNavigator: RangeNavigator;
}
export interface IRangeTooltipRenderEventArgs extends IRangeEventArgs {
    /** Defines tooltip text collections */
    text?: string[];
    /** Defines tooltip text style */
    textStyle?: FontModel;
}
export interface IRangeSelectorRenderEventArgs extends IRangeEventArgs {
    /** Defines selector collections */
    selector: ItemModel[];
    /** enable custom format for calendar */
    enableCustomFormat: boolean;
    /** content fro calendar format */
    content: string;
}
/**
 * Interface for label render event
 */
export interface ILabelRenderEventsArgs {
    /** name of the event */
    name: string;
    /** labelStyle */
    labelStyle: FontModel;
    /** region */
    region: Rect;
    /** text  */
    text: string;
    /** cancel for the event */
    cancel: boolean;
    /** value */
    value: number;
}
/**
 * Interface for Theme Style
 */
export interface IRangeStyle {
    gridLineColor: string;
    axisLineColor: string;
    labelFontColor: string;
    unselectedRectColor: string;
    thumpLineColor: string;
    thumbBackground: string;
    thumbHoverColor: string;
    gripColor: string;
    selectedRegionColor: string;
    background: string;
    tooltipBackground: string;
    tooltipFontColor: string;
    thumbWidth: number;
    thumbHeight: number;
}
/**
 * Interface for range events
 */
export interface IRangeEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defined the whether event has to trigger */
    cancel: boolean;
}
/**
 * Interface for changed events
 */
export interface IChangedEventArgs extends IRangeEventArgs {
    /** Defines the start value */
    start: number | Date;
    /** Defines the end value */
    end: number | Date;
    /** Defines the selected data */
    selectedData: DataPoint[];
    /** Defined the zoomPosition of the range navigator */
    zoomPosition: number;
    /** Defined the zoomFactor of the range navigator */
    zoomFactor: number;
}
