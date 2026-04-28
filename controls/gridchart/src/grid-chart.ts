import { closest, createElement, extend, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { ChartType, IGrid } from '@syncfusion/ej2-grids';
import { ChartExportItem } from './enum';
import { CategorySeries, ChartChanges, ChartPopupArgs, ChartPopupSettings, DialogInformation, InitDialogUIArgs, UpdateChartArgs } from './interface';
import {
    Chart, BarSeries, ChartSeriesType, StackingBarSeries, LineSeries, StackingLineSeries, AreaSeries, Legend, Category,
    StackingColumnSeries, ColumnSeries, SeriesModel, StackingAreaSeries, ScatterSeries, PieSeries, AccumulationChart, AccumulationLegend,
    AccumulationTooltip, Tooltip, DataLabel, Export, AccumulationChartModel, ChartModel, AccumulationSeriesModel, AccumulationType,
    AccumulationDataLabel, Zoom, ScrollBar, DateTime
} from '@syncfusion/ej2-charts';
import { deepMerge } from './util';
import { ChartPanel } from './chart-panel';
import { ChartExport } from './chart-export';
import { Dialog } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';

Chart.Inject(Legend, Category, BarSeries, StackingBarSeries, ColumnSeries, StackingColumnSeries, LineSeries, StackingLineSeries,
             AreaSeries, StackingAreaSeries, ScatterSeries, Tooltip, DataLabel, Export, Zoom, DateTime, ScrollBar);

AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, Export);

/**
 * Configuration options for integrating a chart with the Grid component.
 */
export interface GridChartModel {
    /**
     * Enables or disables export functionality for the chart.
     *
     * @default false
     */
    allowExport?: boolean;

    /**
     * Defines the list of export formats available to the user.
     *
     * @default []
     */
    chartExportItems?: ChartExportItem[];

    /**
     * Enables the chart settings panel within the chart dialog,
     * allowing end-users to customize chart properties interactively.
     *
     * @default false
     */
    enablePropertyPanel?: boolean;

    /**
     * Callback function triggered before the chart is updated with new changes.
     *
     * @returns {void}
     */
    updateChartSettings?: Function;

    /**
     * Defines the settings for the chart dialog, such as dimensions and target container.
     *
     * @default {}
     */
    chartPopupSettings?: ChartPopupSettings;

    /**
     * Enable or disable rendering component in right to left direction.
     *
     * @default false
     */
    enableRtl?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default ''
     */
    locale?: string;

    /**
     * Defines the own class for the grid chart element.
     *
     * @default ''
     */
    cssClass?: string;
}

/**
 * Provides functionality to render, update, and destroy charts linked to a Grid instance.
 */
export class GridChart {

    /** @hidden */
    public chartSettings: GridChartModel = {
        allowExport: false,
        chartExportItems: [],
        enablePropertyPanel: false,
        updateChartSettings: null,
        chartPopupSettings: {},
        enableRtl: false,
        locale: '',
        cssClass: ''
    };
    private commonChartModel: ChartModel | AccumulationChartModel = {
        width: '100%',
        height: '100%',
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
        background: null,
        title: null,
        titleStyle: { fontFamily: null, size: '15px', color: null },
        subTitle: null,
        subTitleStyle: { fontFamily: null, size: '15px', color: null },
        legendSettings: {
            visible: true,
            position: 'Auto',
            textStyle: { fontFamily: null, size: '12px', color: null },
            enablePages: true,
            textOverflow: 'Ellipsis'
        },
        tooltip: { enable: true }
    };
    private defaultAccumulationChartModel: AccumulationChartModel = extend({
        enableSmartLabels: true
    }, this.commonChartModel, {}, true);
    private defaultChartModel: ChartModel = extend({
        primaryXAxis: {
            isInversed: false,
            title: null,
            titleStyle: { fontFamily: null, size: '16px', color: null },
            labelStyle: { fontFamily: null, size: '12px', color: null },
            labelRotation: 0
        },
        primaryYAxis: {
            isInversed: false,
            title: null,
            titleStyle: { fontFamily: null, size: '16px', color: null },
            labelStyle: { fontFamily: null, size: '12px', color: null },
            labelRotation: 0
        }
    }, this.commonChartModel, {}, true);
    /** @hidden */
    public category: string[];
    /** @hidden */
    public series: string[];
    /** @hidden */
    public parent: IGrid;
    /** @hidden */
    public enableRtl: boolean;
    private defaultChartLocale: Object;
    private localeObj: L10n;
    private dialogElement: HTMLElement;
    private dialogObj: Dialog;
    private chartPanel: ChartPanel;
    private chartExport: ChartExport;
    private element: HTMLElement;
    private dataSource: Object[];
    /** @hidden */
    public chartType: ChartType;
    /** @hidden */
    public previousChartType: ChartType;
    private chartElement: HTMLElement;
    /** @hidden */
    public chart: Chart;
    private accumulationChartElement: HTMLElement;
    /** @hidden */
    public accumulationChart: AccumulationChart;
    /** @hidden */
    public currentChart: Chart | AccumulationChart;
    /** @hidden */
    public exportContainer: HTMLElement;
    private exportChartContainer: HTMLElement;
    private exportChartHolder: HTMLElement;
    private dialogChartContainer: HTMLElement;
    private chartContainer: HTMLElement;
    /** @hidden */
    public tabContainer: HTMLElement;
    private minMaxButtonElement: HTMLElement;
    private minMaxButton: Button;
    private boundMinMax: (event: Event) => void;
    private dialogInformation: DialogInformation;
    private showHidePropertyPanelButtonElement: HTMLElement;
    private showHidePropertyPanelButton: Button;

    /**
     * Initializes a new instance of the GridChart class.
     *
     * @param {GridChartModel} options - Optional configuration for chart behavior.
     * @hidden
     */
    constructor(options?: GridChartModel) {
        extend(this.chartSettings, options, {}, true);
        return this;
    }

    /**
     * Renders a chart using the specified grid selection and chart configuration.
     *
     * @param {ChartPopupArgs} chartPopupArgs - Contains information about the selected grid records and chart type.
     * @param {ChartChanges} chartModel - Chart configuration model.
     * @param {CategorySeries} categorySeries - Defines the chart category and series.
     *
     * @returns {void}
     *
     */
    public render(chartPopupArgs: ChartPopupArgs, chartModel: ChartChanges, categorySeries: CategorySeries): void {
        this.category = categorySeries.category;
        this.series = categorySeries.series;
        this.chartType = chartPopupArgs.chartType;
        this.dataSource = chartPopupArgs.records;
        this.parent = chartPopupArgs.gridInstance;
        this.enableRtl = this.parent.enableRtl || this.chartSettings.enableRtl;
        this.generateChartLocale();
        this.localeObj = new L10n('gridchart', this.defaultChartLocale, this.chartSettings.locale);
        if (this.chartSettings.enablePropertyPanel) {
            this.chartPanel = new ChartPanel(this);
        }
        if (this.chartSettings.allowExport) {
            this.chartExport = new ChartExport(this);
        }
        this.initDialogUI(chartPopupArgs, this.destroy.bind(this)).then((args: InitDialogUIArgs) => {
            this.addMinMaxButton();
            this.element = args.target;
            this.initializeLayout();
            this.renderChart(chartModel);
        });
    }

    private addMinMaxButton(): void {
        this.minMaxButtonElement = createElement('button', { className: 'e-dlg-closeicon-btn e-grid-chart-min-max-btn' });
        const headerContent: HTMLElement = this.dialogObj.element.querySelector('.e-dlg-header-content');
        headerContent.querySelector('.e-dlg-closeicon-btn').insertAdjacentElement('afterend', this.minMaxButtonElement);
        this.minMaxButton = new Button({
            iconCss: 'e-grid-chart-max-icon e-icons',
            cssClass: this.chartSettings.cssClass ? 'e-flat ' + this.chartSettings.cssClass : 'e-flat',
            locale: this.chartSettings.locale,
            enableRtl: this.enableRtl
        });
        this.minMaxButton.appendTo(this.minMaxButtonElement);
        this.minMaxButton.element.setAttribute('title', this.getLocaleText('Maximize'));
        this.boundMinMax = (args: Event): void => {
            let target: HTMLElement = args.target as HTMLElement;
            target = target.classList.contains('e-icons') ? target : target.querySelector('.e-icons');
            const maxIcon: boolean = target.classList.contains('e-grid-chart-max-icon');
            if (maxIcon) {
                target.classList.remove('e-grid-chart-max-icon');
                target.classList.add('e-grid-chart-min-icon');
                this.dialogInformation = {
                    target: this.dialogObj.target as HTMLElement,
                    width: this.dialogObj.width,
                    height: this.dialogObj.height,
                    minHeight: this.dialogObj.minHeight,
                    overflow: document.body.style.overflow
                };
                window.scrollTo(0, 0);
                this.dialogObj.target = document.body;
                this.dialogObj.width = '100%';
                this.dialogObj.height = '100%';
                this.dialogObj.minHeight = '100%';
                document.body.style.overflow = 'hidden';
                this.minMaxButton.element.setAttribute('title', this.getLocaleText('Minimize'));
            } else {
                target.classList.remove('e-grid-chart-min-icon');
                target.classList.add('e-grid-chart-max-icon');
                this.dialogObj.target = this.dialogInformation.target;
                this.dialogObj.width = this.dialogInformation.width;
                this.dialogObj.height = this.dialogInformation.height;
                this.dialogObj.minHeight = this.dialogInformation.minHeight;
                document.body.style.overflow = this.dialogInformation.overflow;
                this.minMaxButton.element.setAttribute('title', this.getLocaleText('Maximize'));
            }
            setTimeout(() => {
                this.currentChart.refresh();
            }, 0);
        };
        this.minMaxButton.element.addEventListener('click', this.boundMinMax);
    }

    private generateChartLocale(): void {
        this.defaultChartLocale = {
            ...this.parent.defaultChartLocale,
            ChartPreview: 'Chart Preview',
            PieChart: 'Pie Chart',
            Pie: 'Pie',
            ScatterChart: 'Scatter Chart',
            Scatter: 'Scatter',
            Export: 'Export',
            Data: 'Data',
            Format: 'Format',
            Print: 'Print',
            JPEG: 'JPEG',
            PNG: 'PNG',
            SVG: 'SVG',
            PDF: 'PDF',
            XLSX: 'XLSX',
            CSV: 'CSV',
            CategoryAxis: 'Category Axis',
            Series: 'Series',
            ValueAxis: 'Value Axis',
            ChartStyle: 'Chart Style',
            TitleStyle: 'Title Style',
            Legend: 'Legend',
            Axes: 'Axes',
            Margin: 'Margin',
            Top: 'Top',
            Bottom: 'Bottom',
            Right: 'Right',
            Left: 'Left',
            Color: 'Color',
            ApplyTo: 'Apply To',
            Title: 'Title',
            Subtitle: 'Subtitle',
            Font: 'Font',
            Size: 'Size',
            ShowLegend: 'Show Legend',
            Position: 'Position',
            ShowTooltip: 'Show Tooltip',
            ShowDataLabel: 'Show Data Label',
            ApplyToAxis: 'Apply To Axis',
            Category: 'Category',
            Value: 'Value',
            ReverseOrder: 'Reverse Order',
            Text: 'Text',
            Label: 'Label',
            Rotation: 'Rotation',
            ExportTitle: 'Export',
            ShowSidePanel: 'Show Side Panel',
            HideSidePanel: 'Hide Side Panel',
            Maximize: 'Maximize',
            Minimize: 'Minimize'
        };
    }

    /**
     * @param {string} item – Defines the locale key.
     * @hidden
     * @returns {string} Returns the locale text.
     */
    public getLocaleText(item: string): string {
        return this.localeObj.getConstant(item);
    }

    private isBiggerTheme(gridObj: IGrid): boolean {
        return closest(gridObj.element, '.e-bigger') ? true : false;
    }

    private getChartDialogWidth(gridObj: IGrid): string | number {
        if (this.chartSettings.chartPopupSettings.width) {
            return this.chartSettings.chartPopupSettings.width;
        }
        return this.isBiggerTheme(gridObj) ? 833 : 825;
    }

    private getChartDialogHeight(gridObj: IGrid): string | number {
        if (this.chartSettings.chartPopupSettings.height) {
            return this.chartSettings.chartPopupSettings.height;
        }
        return this.isBiggerTheme(gridObj) ? 552 : 490;
    }

    /**
     * Initializes the dialog UI for the "Chart" options.
     * This function attaches a dialog with custom components to the target element within the grid,
     * using selected records for dynamic data representation.
     *
     * @param {ChartPopupArgs} args - specifies the dialog properties.
     * @param {Function} beforeDestroy – defines the destroy function which is executed before the dialog close.
     *
     * @returns {Promise<InitDialogUIArgs>} A promise that resolves with the target element, grid instance, and selected records.
     */
    public initDialogUI(args: ChartPopupArgs, beforeDestroy?: Function): Promise<InitDialogUIArgs> {
        return new Promise((resolve: Function) => {
            const gridObj: IGrid = args.gridInstance;
            const target: HTMLElement = this.chartSettings.chartPopupSettings.target ? this.chartSettings.chartPopupSettings.target
                : gridObj.element;
            this.dialogElement = gridObj.createElement('div', { id: gridObj.element.id + '_grid_context_menu_dialog' });
            if (this.isBiggerTheme(gridObj)) {
                this.dialogElement.classList.add('e-bigger');
            }
            target.appendChild(this.dialogElement);
            this.dialogObj = new Dialog({
                width: this.getChartDialogWidth(gridObj),
                height: this.getChartDialogHeight(gridObj),
                minHeight: this.getChartDialogHeight(gridObj),
                header: this.chartSettings.chartPopupSettings.title ? this.chartSettings.chartPopupSettings.title : this.getLocaleText('ChartPreview'),
                cssClass: this.chartSettings.cssClass ? 'e-grid-context-menu-dialog ' + this.chartSettings.cssClass : 'e-grid-context-menu-dialog',
                showCloseIcon: true,
                allowDragging: true,
                isModal: true,
                target,
                closeOnEscape: true,
                animationSettings: { effect: 'None' },
                enableRtl: this.enableRtl,
                locale: this.chartSettings.locale,
                created: () => {
                    if (isNullOrUndefined(this.chartSettings.chartPopupSettings.target)
                        && this.dialogObj.element.getBoundingClientRect().height > gridObj.element.getBoundingClientRect().height) {
                        this.dialogObj.target = document.body;
                        this.dialogObj.refresh();
                    }
                    const initDialogUIArgs: InitDialogUIArgs = {
                        ...args,
                        target: this.dialogObj.element.querySelector('.e-dlg-content'),
                        dialog: this.dialogObj
                    };
                    resolve(initDialogUIArgs);
                },
                close: () => {
                    if (beforeDestroy) {
                        beforeDestroy();
                    }
                    this.dialogObj.destroy();
                    this.dialogObj = null;
                    this.dialogElement.remove();
                    this.dialogElement = null;
                }
            });
            this.dialogObj.appendTo(this.dialogElement);
            this.dialogObj.element.addEventListener('keydown', this.preventParentComponentKeyNavigation);
        });
    }

    private preventParentComponentKeyNavigation(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    private initializeLayout(): void {
        const dialogHeaderHeight: number = this.dialogObj.element.querySelector('.e-dlg-header-content').getBoundingClientRect().height;
        this.element.style.width = '100%';
        this.element.style.height = 'calc(100% - ' + dialogHeaderHeight + 'px)';
        this.dialogChartContainer = createElement('div', { className: 'e-grid-dialogchart-container' });
        this.dialogChartContainer.style.width = '100%';
        this.dialogChartContainer.style.height = '100%';
        this.element.append(this.dialogChartContainer);
        let targetElement: HTMLElement = this.dialogChartContainer;
        if (this.chartSettings.enablePropertyPanel) {
            this.dialogChartContainer.classList.add('e-grid-dialogchart-display-flex');
            this.chartContainer = createElement('div');
            this.chartContainer.style.width = '67%';
            this.chartContainer.style.height = '100%';
            this.dialogChartContainer.append(this.chartContainer);
            this.tabContainer = createElement('div', { className: 'e-grid-dialog-tab-container' });
            this.tabContainer.style.width = '33%';
            this.tabContainer.style.height = '100%';
            this.dialogChartContainer.append(this.tabContainer);
            this.chartPanel.initializeLayout();
            targetElement = this.chartContainer;
        }
        if (this.chartSettings.allowExport || this.chartSettings.enablePropertyPanel) {
            this.exportContainer = createElement('div', { className: 'e-grid-dialog-chart-export-container' });
            this.exportChartContainer = createElement('div');
            const appendElement: HTMLElement = this.chartSettings.enablePropertyPanel ? this.chartContainer : this.dialogChartContainer;
            appendElement.append(this.exportContainer);
            appendElement.append(this.exportChartContainer);
            if (this.chartSettings.allowExport) {
                this.chartExport.addExportButton();
            }
            if (this.chartSettings.enablePropertyPanel) {
                this.addShowHidePanelButton();
            }
            const exportContainerHeight: number = this.exportContainer.getBoundingClientRect().height;
            this.exportChartContainer.style.width = '100%';
            this.exportChartContainer.style.height = 'calc(100% - ' + exportContainerHeight + 'px)';
            this.exportChartHolder = createElement('div');
            this.exportChartHolder.style.width = '100%';
            this.exportChartHolder.style.height = '100%';
            this.exportChartContainer.append(this.exportChartHolder);
            targetElement = this.exportChartHolder;
        }
        this.chartElement = createElement('div');
        this.accumulationChartElement = createElement('div');
        targetElement.append(this.chartElement);
        targetElement.append(this.accumulationChartElement);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public addShowHidePanelButton(): void {
        const showHideContainer: HTMLElement = createElement('div');
        showHideContainer.style.display = this.chartSettings.allowExport ? 'inline' : 'flow-root';
        this.showHidePropertyPanelButtonElement = createElement('button');
        showHideContainer.append(this.showHidePropertyPanelButtonElement);
        this.showHidePropertyPanelButtonElement.style.cssFloat = this.enableRtl ? 'left' : 'right';
        this.exportContainer.append(showHideContainer);
        this.showHidePropertyPanelButton = new Button({
            iconCss: 'e-view-side e-icons',
            cssClass: this.chartSettings.cssClass,
            locale: this.chartSettings.locale,
            enableRtl: this.enableRtl
        });
        this.showHidePropertyPanelButton.appendTo(this.showHidePropertyPanelButtonElement);
        this.showHidePropertyPanelButton.element.setAttribute('title', this.getLocaleText('HideSidePanel'));
        this.showHidePropertyPanelButton.element.addEventListener('click', this.showHidePropertyPanel.bind(this));
    }

    private showHidePropertyPanel(args: Event): void {
        let target: HTMLElement = args.target as HTMLElement;
        target = target.classList.contains('e-icons') ? target : target.querySelector('.e-icons');
        if (this.tabContainer.style.display !== 'none') {
            target.classList.remove('e-view-side');
            target.classList.add('e-show-hide-panel');
            this.tabContainer.style.display = 'none';
            this.chartContainer.style.width = '100%';
            this.showHidePropertyPanelButton.element.setAttribute('title', this.getLocaleText('ShowSidePanel'));
        } else {
            target.classList.remove('e-show-hide-panel');
            target.classList.add('e-view-side');
            this.tabContainer.style.display = 'inline-flex';
            this.chartContainer.style.width = '67%';
            this.showHidePropertyPanelButton.element.setAttribute('title', this.getLocaleText('HideSidePanel'));
        }
        if (this.isAccumulationChart()) {
            this.chartElement.style.display = 'none';
            this.accumulationChart.refresh();
            this.currentChart = this.accumulationChart;
        } else {
            this.chart.refresh();
        }
    }

    /**
     * To identify the type of chart.
     *
     * @hidden
     * @returns {boolean} Returns `true` if the chart type is one of the standard types (e.g., Bar, Line, Area); otherwise, `false`.
     */
    public isChart(): boolean {
        return [
            'Bar', 'StackingBar', 'StackingBar100',
            'Column', 'StackingColumn', 'StackingColumn100',
            'Line', 'StackingLine', 'StackingLine100',
            'Area', 'StackingArea', 'StackingArea100',
            'Scatter'
        ].indexOf(this.chartType) !== -1;
    }

    /**
     * To identify the type of chart.
     *
     * @hidden
     * @returns {boolean} Returns `true` if the chart type is 'Pie'; otherwise, `false`.
     */
    public isAccumulationChart(): boolean {
        return this.chartType === 'Pie';
    }

    private renderChart(chartModel: ChartChanges): void {
        const isChart: boolean = this.isChart();
        const isAccumulationChart: boolean = this.isAccumulationChart();
        const defaultChartModel: ChartModel = extend({
            cssClass: this.chartSettings.cssClass,
            locale: this.chartSettings.locale,
            enableRtl: this.enableRtl
        }, this.defaultChartModel, {}, true);
        defaultChartModel.series = [];
        if (this.category.length && this.series.length) {
            for (let i: number = 0; i < this.series.length; i++) {
                const series: SeriesModel = {
                    dataSource: this.dataSource,
                    xName: this.category[0],
                    yName: this.series[parseInt(i.toString(), 10)],
                    type: isChart ? this.chartType as ChartSeriesType : 'Bar',
                    name: this.series[parseInt(i.toString(), 10)],
                    fill: null,
                    marker: { dataLabel: { visible: false } },
                    columnSpacing: 0.2
                };
                defaultChartModel.series.push(series);
            }
        }
        deepMerge(defaultChartModel, chartModel.chart);
        this.chart = new Chart(defaultChartModel);
        this.chart.appendTo(this.chartElement);
        this.chartElement.style.display = isAccumulationChart ? 'none' : '';
        const defaultAccumulationChartModel: AccumulationChartModel = extend({
            cssClass: this.chartSettings.cssClass,
            locale: this.chartSettings.locale,
            enableRtl: this.enableRtl
        }, this.defaultAccumulationChartModel, {}, true);
        defaultAccumulationChartModel.series = [];
        if (this.category.length && this.series.length) {
            const accumulationSeries: AccumulationSeriesModel = {
                dataSource: this.dataSource.slice(0, 10),
                xName: this.category[0],
                yName: this.series[0],
                type: isAccumulationChart ? this.chartType as AccumulationType : 'Pie',
                name: this.series[0],
                dataLabel: { visible: true, position: 'Outside' }
            };
            defaultAccumulationChartModel.series.push(accumulationSeries);
        }
        deepMerge(defaultAccumulationChartModel, chartModel.accumulationChart);
        this.accumulationChart = new AccumulationChart(defaultAccumulationChartModel);
        this.accumulationChart.appendTo(this.accumulationChartElement);
        this.accumulationChartElement.style.display = isChart ? 'none' : '';
        this.currentChart = isChart ? this.chart : this.accumulationChart;
        if (this.chartSettings.enablePropertyPanel) {
            this.chartPanel.tabRenderer();
        }
    }

    private refreshChart(chartModel: ChartChanges): void {
        deepMerge(this.chart, chartModel.chart);
        deepMerge(this.accumulationChart, chartModel.accumulationChart);
        if (this.isChart()) {
            this.accumulationChartElement.style.display = 'none';
            this.chart.refresh();
            this.currentChart = this.chart;
        } else if (this.isAccumulationChart()) {
            this.chartElement.style.display = 'none';
            this.accumulationChart.refresh();
            this.currentChart = this.accumulationChart;
        }
        if (this.chartSettings.enablePropertyPanel) {
            this.chartPanel.tabRenderer();
        }
    }

    /**
     * Updates the chart with new data or settings.
     *
     * @param {ChartChanges} changes - Defines the changes to apply for the chart.
     * @returns {void}
     *
     */
    public refresh(changes: ChartChanges): void {
        const updateChartArgs: UpdateChartArgs = {
            changes,
            chartInstance: this.currentChart,
            chartType: this.chartType,
            previousChartType: this.previousChartType,
            gridInstance: this.parent,
            records: this.dataSource
        };
        if (this.chartSettings.updateChartSettings) {
            this.chartSettings.updateChartSettings(updateChartArgs);
        }
        this.refreshChart(updateChartArgs.changes);
    }

    /**
     * Cleans up and disposes the chart instance(s).
     *
     * @returns {void}
     */
    private destroy(): void {
        if (this.dialogInformation) {
            document.body.style.overflow = this.dialogInformation.overflow;
        }
        this.chartType = null;
        this.previousChartType = null;
        this.currentChart = null;
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.chartElement.remove();
        this.chartElement = null;
        if (this.accumulationChart) {
            this.accumulationChart.destroy();
            this.accumulationChart = null;
        }
        this.accumulationChartElement.remove();
        this.accumulationChartElement = null;
        if (this.chartSettings.allowExport) {
            this.chartExport.destroy();
            this.chartExport = null;
        }
        if (this.chartSettings.allowExport || this.chartSettings.enablePropertyPanel) {
            this.exportChartHolder.remove();
            this.exportChartHolder = null;
            this.exportChartContainer.remove();
            this.exportChartContainer = null;
            this.exportContainer.remove();
            this.exportContainer = null;
        }
        if (this.chartSettings.enablePropertyPanel) {
            this.chartPanel.destroy();
            this.chartPanel = null;
            this.tabContainer.remove();
            this.tabContainer = null;
            this.chartContainer.remove();
            this.chartContainer = null;
        }
        this.dialogObj.element.removeEventListener('keydown', this.preventParentComponentKeyNavigation);
        if (this.chartSettings.enablePropertyPanel) {
            this.showHidePropertyPanelButton.element.removeEventListener('click', this.showHidePropertyPanel.bind(this));
            this.showHidePropertyPanelButton.destroy();
            this.showHidePropertyPanelButton = null;
            this.showHidePropertyPanelButtonElement.remove();
            this.showHidePropertyPanelButtonElement = null;
        }
        this.dialogChartContainer.remove();
        this.dialogChartContainer = null;
        this.element = null;
        this.parent = null;
        this.dataSource = null;
        this.category = null;
        this.series = null;
        this.enableRtl = null;
        this.localeObj = null;
        this.defaultChartLocale = null;
        this.dialogInformation = null;
        this.minMaxButton.element.removeEventListener('click', this.boundMinMax);
        this.boundMinMax = null;
        this.minMaxButton.destroy();
        this.minMaxButton = null;
        this.minMaxButtonElement.remove();
        this.minMaxButtonElement = null;
    }
}
