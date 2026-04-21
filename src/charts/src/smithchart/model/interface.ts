import { Smithchart, SmithchartFontModel} from '../../index';

/**
 * Specifies Smithchart Events
 *
 * @private
 */

export interface ISmithchartEventArgs {
    /** Defines the name of the event. */
    name: string;
    /** Defines the event cancel status. */
    cancel: boolean;
}

export interface ISmithchartPrintEventArgs extends ISmithchartEventArgs {
    htmlContent: Element;
}

/**
 * Specifies the Load Event arguments.
 */
export interface ISmithchartLoadEventArgs extends ISmithchartEventArgs {
    /** Defines the current Smithchart instance. */
    smithchart: Smithchart;
}
/**
 * Specifies the Loaded Event arguments.
 */
export interface ISmithchartLoadedEventArgs extends ISmithchartEventArgs {
    /** Defines the current Smithchart instance. */
    smithchart: Smithchart;
}
export interface ISmithchartAnimationCompleteEventArgs extends ISmithchartEventArgs {
    /**
     * smithchart instance event argument.
     */
    smithchart?: Smithchart;
}

/**
 * Specifies the Title Render Event arguments.
 */
export interface ITitleRenderEventArgs extends ISmithchartEventArgs {
    /** Defines the current title text. */
    text: string;
    /** Defines the current title text x location. */
    x: number;
    /** Defines the current title text y location. */
    y: number;
}

/**
 * Specifies the SubTitle Render Event arguments.
 */
export interface ISubTitleRenderEventArgs extends ISmithchartEventArgs {
    /** Defines the current subtitle text. */
    text: string;
    /** Defines the current subtitle text x location. */
    x: number;
    /** Defines the current subtitle text y location. */
    y: number;
}

/**
 * Specifies the Text Render Event arguments.
 */
export interface ISmithchartTextRenderEventArgs extends ISmithchartEventArgs {
    /** Defines the current datalabel text. */
    text: string;
    /** Defines the current datalabel text x location. */
    x: number;
    /** Defines the current datalabel text y location. */
    y: number;
    /** Defines the current datalabel seriesIndex. */
    seriesIndex: number;
    /** Defines the current datalabel pointIndex. */
    pointIndex: number;
}

/**
 * Specifies the Axis Label Render Event arguments.
 */
export interface ISmithchartAxisLabelRenderEventArgs extends ISmithchartEventArgs {
    /** Defines the current axis label text. */
    text: string;
    /** Defines the current axis label x location. */
    x: number;
    /** Defines the current axis label y location. */
    y: number;
}

/**
 * Specifies the Series Render Event arguments.
 */
export interface ISmithchartSeriesRenderEventArgs extends ISmithchartEventArgs {
    /** Defines name of the event. */
    text: string;
    /** Defines the current series fill. */
    fill: string;
}

/**
 * Specifies the Legend Render Event arguments.
 */
export interface ISmithchartLegendRenderEventArgs extends ISmithchartEventArgs {
    /** Defines the current legend text. */
    text: string;
    /** Defines the current legend fill color. */
    fill: string;
    /** Defines the current legend shape. */
    shape: string;
}

export interface ISmithChartTooltipEventArgs extends ISmithchartEventArgs {
    /** Defines the tooltip text. */
    text: string[];
    /** Defines the headerText of tooltip. */
    headerText: string;
    /** Defines point of the tooltip. */
    point: ISmithChartPoint;
    /** template.
     *
     * @aspType string
     */
    template: string | Function;
}


/** @private */
export interface ISmithchartFontMapping {
    size?: string;
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
    fontFamily?: string;
}


export interface ISmithChartPoint {
    reactance: number;
    resistance: number;
    tooltip?: string;
}

export interface ISmithchartThemeStyle {
    axisLabel: string;
    axisLine: string;
    majorGridLine: string;
    minorGridLine: string;
    chartTitle: string;
    legendLabel: string;
    background: string;
    areaBorder: string;
    tooltipFill: string;
    dataLabel: string;
    tooltipBoldLabel: string;
    tooltipLightLabel: string;
    tooltipHeaderLine: string;
    fontFamily?: string;
    fontSize?: string;
    tooltipFontSize?: string;
    tooltipFontFamily?: string;
    smithchartTitleFont: SmithchartFontModel;
    legendLabelFont: SmithchartFontModel;
    legendTitleFont: SmithchartFontModel;
    dataLabelFont: SmithchartFontModel;
    axisLabelFont: SmithchartFontModel;
    smithchartSubtitleFont: SmithchartFontModel;
    labelFontFamily?: string;
    tooltipFillOpacity?: number;
    tooltipTextOpacity?: number;
    tabColor: string;
}
