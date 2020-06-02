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
    cellTextColor: string;
    toggledColor: string;
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
    /** Defines mouse event */
    event: PointerEvent;
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

export interface ICellEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance */
    heatmap: HeatMap;
    /** Defines current hover cell value */
    value: number | BubbleTooltipData[];
    /** Defines x-axis label */
    xLabel: string;
    /** Defines y-axis label */
    yLabel: string;
    /** Defines x-axis value */
    xValue: string | number | Date;
    /** Defines y-axis value */
    yValue: string | number | Date;
    /** Defines cell value */
    displayText: string;
    /** Defines cell color of a particular cell */
    cellColor: string;
}

export interface ISelectedEventArgs extends IHeatMapEventArgs {
    /** Defines the current HeatMap instance */
    heatmap: HeatMap;
    /** Defines details of a cell */
    data: SelectedCellDetails[];
}
export interface IResizeEventArgs extends IHeatMapEventArgs  {
    /** Defines the previous size of the heatmap */
    previousSize: Size;
    /** Defines the current size of the heatmap */
    currentSize: Size;
    /** Defines the current HeatMap instance */
    heatmap: HeatMap;
}
export interface ILegendRenderEventArgs extends IHeatMapEventArgs {
    /** Defines the current legend text */
    text: string;
}
