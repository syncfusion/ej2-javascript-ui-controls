import { Component, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Property, isBlazor } from '@syncfusion/ej2-base';import { isNullOrUndefined, Browser, ModuleDeclaration } from '@syncfusion/ej2-base';import { createElement, remove, Event, EmitType, EventHandler } from '@syncfusion/ej2-base';import { createSvg, RectOption, measureText, TextOption, renderTextElement } from '../smithchart/utils/helper';import { removeElement, textTrim } from '../smithchart/utils/helper';import { SmithchartRect, SmithchartSize } from '../smithchart/utils/utils';import { SmithchartMarginModel, SmithchartBorderModel, SmithchartFontModel } from '../smithchart/utils/utils-model';import { SmithchartMargin, SmithchartBorder, SmithchartFont } from '../smithchart/utils/utils';import { TitleModel, SubtitleModel } from '../smithchart/title/title-model';import { SmithchartLegendSettingsModel } from '../smithchart/legend/legend-model';import { SmithchartAxisModel } from '../smithchart/axis/axis-model';import { TooltipRender } from '../smithchart/series/tooltip';import { ISmithchartLoadedEventArgs, ISmithchartLoadEventArgs, ISmithchartThemeStyle } from '../smithchart/model/interface';import { ISmithchartLegendRenderEventArgs, ITitleRenderEventArgs, ISubTitleRenderEventArgs } from '../smithchart/model/interface';import { ISmithchartAxisLabelRenderEventArgs, ISmithchartPrintEventArgs } from '../smithchart/model/interface';import { ISmithchartSeriesRenderEventArgs, ISmithchartAnimationCompleteEventArgs } from '../smithchart/model/interface';import { ISmithchartTextRenderEventArgs } from '../smithchart/model/interface';import { getThemeColor } from '../smithchart/model/theme';import { SmithchartLegendSettings } from '../smithchart/legend/legend';import { SmithchartAxis } from '../smithchart/axis/axis';import { Title } from '../smithchart/title/title';import { SmithchartSeriesModel } from '../smithchart/series/series-model';import { SmithchartSeries } from '../smithchart/series/series';import { AreaBounds } from '../smithchart/utils/area';import { AxisRender } from '../smithchart/axis/axisrender';import { SmithchartLegend } from '../smithchart/legend/legendrender';import { SeriesRender } from '../smithchart/series/seriesrender';import { Collection } from '@syncfusion/ej2-base';import { getSeriesColor } from '../smithchart/model/theme';import { SmithchartTheme, RenderType } from '../smithchart/utils/enum';import { Tooltip, SvgRenderer } from '@syncfusion/ej2-svg-base';import { ExportUtils } from '../smithchart/utils/export';import { SmithchartExportType } from '../smithchart/utils/enum';import { PdfPageOrientation } from '@syncfusion/ej2-pdf-export';import { titleRender, subtitleRender, load, loaded } from '../smithchart/model/constant';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Smithchart
 */
export interface SmithchartModel extends ComponentModel{

    /**
     * render type of smithchart.
     * @default Impedance
     */

    renderType?: RenderType;

    /**
     * width for smithchart.
     * @default ''
     */
    width?: string;

    /**
     * height for smithchart.
     * @default ''
     */
    height?: string;

    /**
     * theme for smithchart.
     * @default Material
     */

    theme?: SmithchartTheme;

    /**
     *  options for customizing margin
     */
    margin?: SmithchartMarginModel;

    /**
     *  options for customizing margin
     */
    font?: SmithchartFontModel;

    /**
     *  options for customizing border
     */

    border?: SmithchartBorderModel;

    /**
     *  options for customizing title
     */

    title?: TitleModel;

    /**
     *  options for customizing series
     */

    series?: SmithchartSeriesModel[];

    /**
     *  options for customizing legend
     */

    legendSettings?: SmithchartLegendSettingsModel;

    /**
     * Options to configure the horizontal axis.
     */

    horizontalAxis?: SmithchartAxisModel;

    /**
     * Options to configure the vertical axis.
     */

    radialAxis?: SmithchartAxisModel;

    /**
     * The background color of the smithchart.
     */
    background?: string;

    /**
     *  Spacing between elements
     * @default 10
     */

    elementSpacing?: number;

    /**
     *  Spacing between elements
     * @default 1
     */

    radius?: number;

    /**
     * Triggers before the prints gets started.
     * @event
     * @blazorProperty 'OnPrint'
     */
    beforePrint?: EmitType<ISmithchartPrintEventArgs>;

    /**
     * Triggers after the animation completed.
     * @event
     * @blazorProperty 'AnimationCompleted'
     */
    animationComplete?: EmitType<ISmithchartAnimationCompleteEventArgs>;

    /**
     * Triggers before smithchart rendered.
     * @event
     * @blazorProperty 'OnLoad'
     */
    load?: EmitType<ISmithchartLoadEventArgs>;

    /**
     * Triggers after smithchart rendered.
     * @event
     * @blazorProperty 'Loaded'
     */
    loaded?: EmitType<ISmithchartLoadedEventArgs>;

    /**
     * Triggers before the legend is rendered.
     * @event
     * @blazorProperty 'LegendRendering'
     */
    legendRender?: EmitType<ISmithchartLegendRenderEventArgs>;

    /**
     * Triggers before the title is rendered.
     * @event
     * @blazorProperty 'TitleRendering'
     */
    titleRender?: EmitType<ITitleRenderEventArgs>;

    /**
     * Triggers before the sub-title is rendered.
     * @event
     * @blazorProperty 'SubtitleRendering'
     */
    subtitleRender?: EmitType<ISubTitleRenderEventArgs>;

    /**
     * Triggers before the datalabel text is rendered.
     * @event
     * @blazorProperty 'TextRendering'
     */
    textRender?: EmitType<ISmithchartTextRenderEventArgs>;

    /**
     * Triggers before the axis label is rendered
     * @event
     * @blazorProperty 'AxisLabelRendering'
     */
    axisLabelRender?: EmitType<ISmithchartAxisLabelRenderEventArgs>;

    /**
     * Triggers before the series is rendered.
     * @event
     */

    seriesRender?: EmitType<ISmithchartSeriesRenderEventArgs>;

}