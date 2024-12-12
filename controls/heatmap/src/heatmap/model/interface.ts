import { HeatMap, SelectedCellDetails } from '..';
import { TextOverflow } from '../utils/enum';
import { PaletteCollectionModel } from '../model/base-model';
import { BubbleTooltipData } from '../model/base';
import { Size} from '../utils/helper';
/** @private */
export interface IFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
    textOverflow?: TextOverflow;
}

/**
 * Specifies the Theme style for heat map
 */
export interface IThemeStyle {
    heatMapTitle: string;
    axisTitle: string;
    axisLabel: string;
    legendLabel: string;
    background: string;
    cellBorder: string;
    cellTextColor?: string;
    toggledColor: string;
    emptyCellColor: string;
    palette: PaletteCollectionModel[];
}

export interface ILoadedEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
}

/**
 * Defines the basic and common options in the event arguments of the heatmap.
 */
export interface IHeatMapEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Specifies the cancel state for the event. The default value is false. If set as true, the event progress will be stopped. */
    cancel: boolean;
}

/**
 * Specifies the event arguments for the cell clicked event in the heatmap.
 */
export interface ICellClickEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
    /** Defines current cell element on which click is performed. */
    cellElement: Element;
    /** Defines current value of the cell on which click is performed. */
    value: number;
    /** Defines x-axis label of the cell on which click is performed. */
    xLabel: string;
    /** Defines y-axis label of the cell on which click is performed. */
    yLabel: string;
    /** Defines x-axis value of the cell on which click is performed. */
    xValue: string | number | Date;
    /** Defines y-axis value of the cell on which click is performed. */
    yValue: string | number | Date;
    /** Defines the pointer event for the click action. */
    event: PointerEvent;
}

/**
 * Specifies the event argument for the tooltip render event in heatmap.
 */
export interface ITooltipEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
    /** Defines value of the cell on which the tooltip is rendered. */
    value: number | BubbleTooltipData[];
    /** Defines x-axis label of the cell on which tooltip is rendered. */
    xLabel: string;
    /** Defines y-axis label of the cell on which tooltip is rendered. */
    yLabel: string;
    /** Defines x-axis value of the cell on which tooltip is rendered. */
    xValue: string | number | Date;
    /** Defines y-axis value of the cell on which tooltip is rendered. */
    yValue: string | number | Date;
    /** Defines content of the tooltip. */
    content: string[];
}

/**
 * Specifies the event argument for the cell render event.
 */
export interface ICellEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
    /** Defines value of the cell that is currently rendered. */
    value: number | BubbleTooltipData[];
    /** Defines x-axis label of the cell that is currently rendered. */
    xLabel: string;
    /** Defines y-axis label of the cell that is currently rendered. */
    yLabel: string;
    /** Defines x-axis value of the cell that is currently rendered. */
    xValue: string | number | Date;
    /** Defines y-axis value of the cell that is currently rendered. */
    yValue: string | number | Date;
    /** Defines label of the cell that is currently rendered. */
    displayText: string;
    /** Defines color of the cell that is currently rendered. */
    cellColor: string;
}

export interface ISelectedEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
    /** Defines details of the current selected cells. */
    data: SelectedCellDetails[];
}

/**
 * Specifies the event arguments for the resize event in heatmap.
 */
export interface IResizeEventArgs extends IHeatMapEventArgs  {
    /** Specifies the size of the heatmap before it gets resized. */
    previousSize: Size;
    /** Specifies the size of the heatmap after it gets resized. */
    currentSize: Size;
    /** Defines the current HeatMap instance. */
    heatmap: HeatMap;
}

/**
 * Specifies the event arguments for the legend render event.
 */
export interface ILegendRenderEventArgs extends IHeatMapEventArgs {
    /** Defines the legend text of the legend item that is currently rendered. */
    text: string;
}
