import { HeatMap } from '..';
import { TextOverflow } from '../utils/enum';
import { PaletteCollectionModel } from '../model/base-model';
import { BubbleTooltipData } from '../model/base';
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
    cellTextColor: string;
    emptyCellColor: string;
    palette: PaletteCollectionModel[];
}

export interface ILoadedEventArgs extends IHeatMapEventArgs {
    /** Defines the current heatmap instance */
    heatmap: HeatMap;
}

export interface IHeatMapEventArgs {
    /** Defines the name of the event */
    name: string;
    /** Defines the event cancel status */
    cancel: boolean;
}

export interface ICellClickEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance */
    heatmap: HeatMap;
    /** Defines current clicked cell element */
    cellElement: Element;
    /** Defines current clicked cell value */
    value: number;
    /** Defines x-axis label for current clicked cell */
    xLabel: string;
    /** Defines y-axis label for current clicked cell */
    yLabel: string;
    /** Defines x-axis value for current clicked cell */
    xValue: string | number | Date;
    /** Defines y-axis value for current clicked cell */
    yValue: string | number | Date;
}

export interface ITooltipEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance */
    heatmap: HeatMap;
    /** Defines current hover cell value */
    value: number | BubbleTooltipData[];
    /** Defines x-axis label for current hover cell */
    xLabel: string;
    /** Defines y-axis label for current hover cell */
    yLabel: string;
    /** Defines x-axis value for current hover cell */
    xValue: string | number | Date;
    /** Defines y-axis value for current hover cell */
    yValue: string | number | Date;
    /** Defines tooltip text value */
    content: string[];
}