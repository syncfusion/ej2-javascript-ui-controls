/**
 * Instantiates and manages chart rendering for Office Charts (Spreadsheet, Document Editor, Presentation).
 */
import {
    AccumulationChart,
    AccumulationDataLabel,
    AccumulationLegend,
    AccumulationTooltip,
    AreaSeries,
    BarSeries,
    Category,
    Chart,
    ColumnSeries,
    DataLabel,
    DateTime,
    Legend,
    LineSeries,
    PieSeries,
    ScatterSeries,
    StackingAreaSeries,
    StackingBarSeries,
    StackingColumnSeries,
    StackingLineSeries,
    BubbleSeries,
    Trendlines,
    ErrorBar,
    Tooltip,
    ILoadedEventArgs,
    IAccLoadedEventArgs,
    IBeforeResizeEventArgs,
    ITooltipRenderEventArgs,
    IAxisLabelRenderEventArgs,
    ISeriesRenderEventArgs,
    AccumulationTheme,
    ChartTheme as EJ2ChartTheme,
    LegendPosition as ChartLegendPosition,
    AccumulationSeriesModel,
    SeriesModel as ChartSeriesModel,
    AxisModel
} from '@syncfusion/ej2-charts';
import { ChartModel } from '../base/chart';
import { OfficeSeriesModel } from '../integrations/data-provider';

Chart.Inject(
    ColumnSeries, LineSeries, BarSeries, AreaSeries,
    StackingColumnSeries, StackingLineSeries, StackingBarSeries, StackingAreaSeries,
    ScatterSeries, BubbleSeries, Trendlines, ErrorBar,
    Category, Legend, Tooltip, DataLabel, DateTime
);
AccumulationChart.Inject(PieSeries, AccumulationTooltip, AccumulationDataLabel, AccumulationLegend);

export interface IChartRenderOptions {
    background?: string;
    width?: string;
    height?: string;
    enableRtl?: boolean;
    enableCanvas?: boolean;
    primaryXAxis?: Object;
    primaryYAxis?: Object;
    legendSettings?: Object;
    tooltip?: Object;
    tooltipRender?: (args: ITooltipRenderEventArgs) => void;
    axisLabelRender?: (args: IAxisLabelRenderEventArgs) => void;
    seriesRender?: (args: ISeriesRenderEventArgs) => void;
    load?: (args: ILoadedEventArgs | IAccLoadedEventArgs) => void;
    beforeResize?: (args: IBeforeResizeEventArgs) => void;
}

/**
 * Returns the theme background color matching Office chart standards.
 *
 * @param {string} theme - Theme name.
 * @returns {string} Theme background color string.
 */
export function getThemeBgColor(theme: string): string {
    let bg: string;
    if (theme && theme.includes('Dark')) {
        switch (theme) {
        case 'MaterialDark':
            bg = '#383838';
            break;
        case 'FabricDark':
            bg = '#242424';
            break;
        case 'BootstrapDark':
            bg = '#1b1b1b';
            break;
        case 'Bootstrap5Dark':
            bg = '#212529';
            break;
        case 'TailwindDark':
            bg = '#1f2937';
            break;
        case 'Tailwind3Dark':
            bg = '#111827';
            break;
        case 'FluentDark':
            bg = '#1b1a19';
            break;
        case 'Fluent2Dark':
            bg = '#292929';
            break;
        case 'Material3Dark':
            bg = '#1C1B1F';
            break;
        default:
            bg = '#1b1b1b';
            break;
        }
    } else if (theme && theme.includes('HighContrast')) {
        bg = '#000000';
    } else {
        bg = '#FFFFFF';
    }
    return bg;
}

export class ChartRenderer {
    private chartInstance: Chart | AccumulationChart | null = null;

    /**
     * Renders a chart or accumulation chart component.
     *
     * @param {ChartModel} model - Chart model.
     * @param {OfficeSeriesModel[]} series - Series array.
     * @param {HTMLElement} container - Target DOM container.
     * @param {IChartRenderOptions} [extraOptions] - Additional render options.
     * @returns {Chart | AccumulationChart} Chart component.
     */
    public render(
        model: ChartModel, series: OfficeSeriesModel[], container: HTMLElement, extraOptions?: IChartRenderOptions
    ): Chart | AccumulationChart {
        if (this.chartInstance) {
            this.destroy();
        }
        const isAccumulation: boolean = model.type === 'Pie' || model.type === 'Doughnut';
        const opts: IChartRenderOptions = extraOptions || {};
        const theme: string = model.theme || 'Material';
        const bg: string = opts.background || getThemeBgColor(theme);
        const titleText: string = (model.title && typeof model.title === 'object') ? (model.title as { text?: string }).text || '' : (model.title || '');
        if (isAccumulation) {
            const legendSettings: Object = opts.legendSettings || (model.legendSettings ?
                { visible: model.legendSettings.visible, position: model.legendSettings.position as ChartLegendPosition } :
                { visible: true, position: 'Bottom' as ChartLegendPosition });
            this.chartInstance = new AccumulationChart({
                series: (series.length ? [series[0]] : series) as unknown as AccumulationSeriesModel[],
                theme: theme as unknown as AccumulationTheme,
                title: titleText,
                legendSettings: legendSettings,
                background: bg,
                width: opts.width ? opts.width : (model.width ? model.width + 'px' : '100%'),
                height: opts.height ? opts.height : (model.height ? model.height + 'px' : '100%'),
                center: { x: '50%', y: '50%' },
                tooltip: opts.tooltip || { enable: true, format: '${point.x} : <b>${point.tooltip}</b>' },
                enableSmartLabels: true,
                enableAnimation: true,
                enableRtl: opts.enableRtl || false,
                load: (args: IAccLoadedEventArgs) => {
                    args.chart.theme = (model.theme || 'Material') as unknown as AccumulationTheme;
                    if (opts.load) { opts.load(args); }
                },
                beforeResize: (args: IBeforeResizeEventArgs) => {
                    args.cancelResizedEvent = true;
                    if (opts.beforeResize) { opts.beforeResize(args); }
                }
            });
        } else {
            const legendSettings: Object = opts.legendSettings || (model.legendSettings ?
                { visible: model.legendSettings.visible, position: model.legendSettings.position as ChartLegendPosition } : {});
            this.chartInstance = new Chart({
                series: series as unknown as ChartSeriesModel[],
                theme: theme as unknown as EJ2ChartTheme,
                title: titleText,
                enableCanvas: Boolean(model.enableCanvas || opts.enableCanvas),
                primaryXAxis: (opts.primaryXAxis || model.primaryXAxis || { valueType: 'Category' }) as AxisModel,
                primaryYAxis: (opts.primaryYAxis || model.primaryYAxis || {}) as AxisModel,
                legendSettings: legendSettings,
                background: bg,
                chartArea: { border: { width: 0 } },
                tooltip: opts.tooltip || { enable: true, format: '${point.x} : <b>${point.y}</b>' },
                width: opts.width ? opts.width : (model.width ? model.width + 'px' : '100%'),
                height: opts.height ? opts.height : (model.height ? model.height + 'px' : '100%'),
                enableRtl: opts.enableRtl || false,
                load: (args: ILoadedEventArgs) => {
                    args.chart.theme = (model.theme || 'Material') as unknown as EJ2ChartTheme;
                    if (opts.load) { opts.load(args); }
                },
                beforeResize: (args: IBeforeResizeEventArgs) => {
                    args.cancelResizedEvent = true;
                    if (opts.beforeResize) { opts.beforeResize(args); }
                },
                tooltipRender: opts.tooltipRender,
                axisLabelRender: opts.axisLabelRender,
                seriesRender: opts.seriesRender
            });
        }
        this.chartInstance.appendTo(container);
        return this.chartInstance;
    }

    public refresh(series: OfficeSeriesModel[], model?: ChartModel): void {
        if (!this.chartInstance) { return; }
        (this.chartInstance as Chart).series = series as unknown as ChartSeriesModel[];
        if (model && model.title) {
            this.chartInstance.title = model.title;
        }
        this.chartInstance.refresh();
    }

    public getChartInstance(): Chart | AccumulationChart | null {
        return this.chartInstance;
    }

    public destroy(): void {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}
