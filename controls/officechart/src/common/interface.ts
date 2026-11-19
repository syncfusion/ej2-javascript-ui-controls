/**
 * Public chart contracts.
 */
import { AxisModel } from '../base/chart-model';
import { ChartModel } from '../base/chart';
import { ChartTheme } from '@syncfusion/ej2-charts';
import { DEFAULT_LABEL_SIZE, DEFAULT_MAJOR_TICK_WIDTH } from './constant';
import { IChartRenderOptions } from '../renderers/chart-renderer';

export interface MajorTickLinesModel {
    width?: number;
}

export interface LabelStyleModel {
    size?: string;
}

export interface ExtendedChartModel extends ChartModel {
    enableCanvas?: boolean;
    skipDateInterpolation?: boolean;
    address?: number[];
    series?: { range?: string; name?: string; category?: string }[];
}

export interface ExtendedAxisModel extends AxisModel {
    majorTickLines?: MajorTickLinesModel;
    labelStyle?: LabelStyleModel;
}

export const defaultMajorTickLines: MajorTickLinesModel = { width: DEFAULT_MAJOR_TICK_WIDTH };
export const defaultLabelStyle: LabelStyleModel = { size: DEFAULT_LABEL_SIZE };

export type ChartActionType = 'move' | 'resize' | 'type' | 'theme' | 'element' | 'switch' | 'delete';

export interface ChartEventArgs {
    chartId: string;
    action: ChartActionType;
    properties: Partial<ChartModel>;
    model: ChartModel;
}

export interface ChartCreatedEventArgs {
    chart: ChartModel;
}

export interface ChartUpdatedEventArgs {
    chartId?: string;
    chart?: ChartModel;
    action?: ChartActionType;
    properties?: Partial<ChartModel>;
    model?: ChartModel;
}

export interface ChartRefreshedEventArgs {
    chart: ChartModel;
}

export interface ChartDeletedEventArgs {
    chartId: string;
}

export interface ChartOptions {
    id?: string;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    enableOverlay?: boolean;
    keywordIndex?: number;
    isSpreadsheet?: boolean;
    renderOptions?: IChartRenderOptions;
}

export type ChartUpdateAction =
    | 'create'
    | 'delete'
    | 'resize'
    | 'move'
    | 'chartType'
    | 'theme'
    | 'title'
    | 'legend'
    | 'dataLabels'
    | 'gridlines'
    | 'axis'
    | 'axisTitle'
    | 'switchRowColumn';

export interface IChartUpdateOptions {
    action: ChartUpdateAction;
    value?: string;
    chartType?: string;
    theme?: ChartTheme | string;
    title?: string;
    legendPosition?: 'None' | 'Right' | 'Left' | 'Bottom' | 'Top' | string;
    dataLabelPosition?: 'None' | 'Center' | 'InsideEnd' | 'InsideBase' | 'OutsideEnd' | string;
    gridlineType?: 'MajorHorizontal' | 'MajorVertical' | 'MinorHorizontal' | 'MinorVertical' | string;
    axisType?: 'PrimaryHorizontal' | 'PrimaryVertical' | string;
    axisTitleType?: 'PrimaryHorizontal' | 'PrimaryVertical' | string;
    bounds?: { top?: number; left?: number; width?: number; height?: number };
    markerVisible?: boolean;
}

export interface IChartBeforeActionEventArgs {
    id: string;
    action: ChartUpdateAction;
    options: IChartUpdateOptions;
    cancel?: boolean;
    chartModel?: ChartModel;
    chartJson?: object;
    chartComponent?: object;
}

export interface IChartAfterActionEventArgs {
    id: string;
    action: ChartUpdateAction;
    options: IChartUpdateOptions;
    chartModel?: ChartModel;
    chartJson?: object;
    chartComponent?: object;
}

/**
 * Action identifiers supported by onRibbonAction.
 */
export type RibbonAction =
    | 'switchRowColumn'
    | 'theme'
    | 'chartType'
    | ChartTheme
    | 'DLNone'
    | 'DLCenter'
    | 'DLInsideend'
    | 'DLInsidebase'
    | 'DLOutsideend'
    | 'LegendNone'
    | 'LegendsRight'
    | 'LegendsLeft'
    | 'LegendsBottom'
    | 'LegendsTop'
    | 'GLMajorHorizontal'
    | 'GLMajorVertical'
    | 'GLMinorHorizontal'
    | 'GLMinorVertical'
    | 'ChartTitleNone'
    | 'ChartTitleAbove'
    | 'AboveChart'
    | 'CenteredOverlay'
    | 'PHAxes'
    | 'PVAxes'
    | 'PHAxisTitle'
    | 'PVAxisTitle';

