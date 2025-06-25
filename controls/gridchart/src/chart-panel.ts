import { closest, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Axes, TitleSection } from './enum';
import { AxesStyleInformation, ChartChanges, ChartStyleInformation, DataTabInformation, FormatTabInformation, InputRadio, LegendStyleInformation, SeriesStyleInformation, TitleStyleInformation } from './interface';
import { Chart, ChartSeriesType, SeriesModel, AccumulationChartModel, ChartModel, AccumulationSeriesModel, AccumulationType, LegendPosition } from '@syncfusion/ej2-charts';
import { DropDownList, ChangeEventArgs as DropDownChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { ColorPicker, NumericTextBox, TextBox, ChangeEventArgs as NumericChangeEventArgs, ColorPickerEventArgs, InputEventArgs } from '@syncfusion/ej2-inputs';
import { CheckBox, ChangeEventArgs as CheckBoxChangeEventArgs } from '@syncfusion/ej2-buttons';
import { Accordion, ClickEventArgs, ExpandEventArgs, MenuItemModel, SelectEventArgs, Tab } from '@syncfusion/ej2-navigations';
import { ChartType, DeleteEventArgs, Grid, IGrid, RowDragEventArgs, Edit, Toolbar, CommandColumn, RowDD, ColumnModel, ContextMenu } from '@syncfusion/ej2-grids';
import { GridChart } from './grid-chart';

export class ChartPanel {

    private font: string[] = ['Default', 'Lucida Console', 'Trebuchet MS', 'Times New Roman', 'Courier New', 'Georgia'];
    private fontSize: string[] = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
    private legendPosition: string[] = ['Auto', 'Top', 'Left', 'Bottom', 'Right'];
    private parent: IGrid;
    private gridChart: GridChart;
    private rotation: number[] = [0, 45, 90, 135, 180, 225, 270, 315];
    private deletedSeries: SeriesModel[] = [];
    private titleSection: TitleSection = 'Title';
    private stylingSeries: string = 'All';
    private axes: Axes = 'Category';
    private tabElement: HTMLElement;
    private tab: Tab;
    private chartListElement: HTMLElement;
    private chartListAccordion: Accordion;
    private chartTabElement: HTMLElement;
    private formatTabElement: HTMLElement;
    private dataTabElement: HTMLElement;
    private dataTabInformation: DataTabInformation = {};
    private formatTabInformation: FormatTabInformation = {};
    private chartStyleInformation: ChartStyleInformation = {};
    private titleStyleInformation: TitleStyleInformation = {};
    private legendStyleInformation: LegendStyleInformation = {};
    private seriesStyleInformation: SeriesStyleInformation = {};
    private axesStyleInformation: AxesStyleInformation = {};
    private boundChangeChartType: (event: Event) => void;
    private boundSelectTitle: (event: Event) => void;
    private boundSelectAxes: (event: Event) => void;

    constructor(gridChart: GridChart) {
        this.parent = gridChart.parent;
        this.gridChart = gridChart;
        return this;
    }

    /**
     * @hidden
     * @returns {void}
     */
    public tabRenderer(): void {
        this.chartTab();
        this.dataTab();
        this.formatTab();
    }

    /**
     * @hidden
     * @returns {void}
     */
    public initializeLayout(): void {
        this.tabElement = createElement('div');
        this.gridChart.tabContainer.append(this.tabElement);
        this.chartTabElement = createElement('div');
        this.dataTabElement = createElement('div', { className: 'e-grid-dialog-data-tab-container' });
        this.formatTabElement = createElement('div', { className: 'e-grid-dialog-format-tab-container' });
        this.addTab();
    }

    private addTab(): void {
        this.tab = new Tab({
            height: '100%',
            items: [
                {
                    header: { text: this.gridChart.getLocaleText('Chart') },
                    content: this.chartTabElement
                },
                {
                    header: { text: this.gridChart.getLocaleText('Data') },
                    content: this.dataTabElement
                },
                {
                    header: { text: this.gridChart.getLocaleText('Format') },
                    content: this.formatTabElement
                }
            ],
            selected: (args: SelectEventArgs) => {
                if (args.selectedIndex === 1 && this.dataTabInformation.seriesGrid) {
                    this.dataTabInformation.seriesGrid.freezeRefresh();
                }
            },
            loadOn: 'Init',
            cssClass: this.gridChart.chartSettings.cssClass,
            locale: this.gridChart.chartSettings.locale,
            enableRtl: this.gridChart.enableRtl
        });
        this.tab.appendTo(this.tabElement);
    }

    private getChartList(): HTMLElement[] {
        return [].slice.call(this.chartListAccordion.element.querySelectorAll('.e-grid-chart-list'));
    }

    private chartTab(): void {
        const gridObj: IGrid = this.parent;
        const contextMenuModule: ContextMenu = gridObj.contextMenuModule;
        if (this.gridChart.chartType) {
            if (this.chartListAccordion) {
                const chartList: HTMLElement[] = this.getChartList();
                const previousSelectedChart: HTMLElement = chartList
                    .find((element: HTMLElement) => element.classList.contains('e-grid-chart-list-selected'));
                previousSelectedChart.classList.remove('e-grid-chart-list-selected');
                const currentSelectedChart: HTMLElement = chartList
                    .find((element: HTMLElement) => element.getAttribute('chartType') === this.gridChart.chartType);
                currentSelectedChart.classList.add('e-grid-chart-list-selected');
            } else {
                this.boundChangeChartType = (args: Event): void => {
                    const target: HTMLElement = (args.target as HTMLElement).classList.contains('e-grid-chart-list')
                        ? args.target as HTMLElement : closest(args.target as HTMLElement, '.e-grid-chart-list') as HTMLElement;
                    this.gridChart.previousChartType = this.gridChart.chartType;
                    this.gridChart.chartType = target.getAttribute('charttype') as ChartType;
                    const chartChanges: ChartModel = {};
                    if (this.gridChart.isChart()) {
                        chartChanges.series = [...this.gridChart.chart.series];
                        for (let i: number = 0; i < chartChanges.series.length; i++) {
                            chartChanges.series[parseInt(i.toString(), 10)].type = this.gridChart.chartType as ChartSeriesType;
                        }
                    }
                    const accumulationChartChanges: AccumulationChartModel = {};
                    if (this.gridChart.isAccumulationChart()) {
                        accumulationChartChanges.series = [...this.gridChart.accumulationChart.series];
                        for (let i: number = 0; i < accumulationChartChanges.series.length; i++) {
                            accumulationChartChanges.series[parseInt(i.toString(), 10)].type = this.gridChart.chartType as AccumulationType;
                        }
                    }
                    const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                    this.gridChart.refresh(changes);
                };
                const [chartIndex]: number[] = contextMenuModule.contextMenu.getItemIndex(contextMenuModule.generateID('Chart'), true);
                const chartItem: MenuItemModel = contextMenuModule.contextMenu.items[parseInt(chartIndex.toString(), 10)];
                this.chartListElement = createElement('div');
                this.chartTabElement.append(this.chartListElement);
                this.chartListAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!content.querySelector('.e-grid-chart-list')) {
                            const chartType: string = content.innerText;
                            content.innerHTML = '';
                            const chartInfo: MenuItemModel = chartItem.items
                                .find((item: MenuItemModel) => contextMenuModule.getKeyFromId(item.id) === chartType);
                            if (chartInfo.items.length) {
                                for (const item of chartInfo.items) {
                                    this.createChartList(item, content);
                                }
                            } else {
                                this.createChartList(chartInfo, content);
                            }
                        }
                    },
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                for (const item of chartItem.items) {
                    const key: string = contextMenuModule.getKeyFromId(item.id);
                    const localekey: string = key === 'Pie' ? 'PieChart' : key === 'Scatter' ? 'ScatterChart' : key;
                    this.chartListAccordion.items.push({
                        header: this.gridChart.getLocaleText(localekey),
                        content: key,
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    });
                }
                this.chartListAccordion.appendTo(this.chartListElement);
            }
        } else if (this.chartListAccordion) {
            const chartList: HTMLElement[] = this.getChartList();
            for (let i: number = 0; i < chartList.length; i++) {
                let element: HTMLElement = chartList[parseInt(i.toString(), 10)];
                element.removeEventListener('click', this.boundChangeChartType);
                element.remove();
                element = null;
            }
            this.boundChangeChartType = null;
            this.chartListAccordion.destroy();
            this.chartListAccordion = null;
            this.chartListElement.remove();
            this.chartListElement = null;
        }
    }

    private createChartList(item: MenuItemModel, target: HTMLElement): void {
        const gridObj: IGrid = this.parent;
        const contextMenuModule: ContextMenu = gridObj.contextMenuModule;
        const chartType: string = contextMenuModule.getKeyFromId(item.id);
        const infoElement: HTMLElement = createElement('div', { className: 'e-grid-chart-list', attrs: { charttype: chartType } });
        infoElement.addEventListener('click', this.boundChangeChartType);
        const icon: HTMLElement = createElement('span', { className: item.iconCss });
        const text: HTMLElement = createElement('span', { className: 'e-grid-chart-text' });
        text.innerText = this.gridChart.getLocaleText(chartType);
        infoElement.append(icon);
        infoElement.append(text);
        target.append(infoElement);
        if (this.gridChart.chartType === chartType) {
            infoElement.classList.add('e-grid-chart-list-selected');
        }
    }

    private dataTab(): void {
        if (this.gridChart.chartType) {
            if (!this.dataTabInformation.categoryAxisDataStyle) {
                this.dataTabInformation.categoryAxisDataStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                this.dataTabInformation.categoryAxisDataStyle.innerText = this.gridChart.getLocaleText('CategoryAxis');
                this.dataTabElement.append(this.dataTabInformation.categoryAxisDataStyle);
            }
        } else if (this.dataTabInformation.categoryAxisDataStyle) {
            this.dataTabInformation.categoryAxisDataStyle.remove();
            this.dataTabInformation.categoryAxisDataStyle = null;
        }
        if (this.gridChart.chartType) {
            if (this.dataTabInformation.categoryAxisDropDownListObject) {
                this.dataTabInformation.categoryAxisDropDownListObject.value = this.gridChart.currentChart.series.length
                    ? this.gridChart.currentChart.series[0].xName : null;
                this.dataTabInformation.categoryAxisDropDownListObject.refresh();
            } else {
                this.dataTabInformation.categoryAxisElement = createElement('input');
                this.dataTabElement.append(this.dataTabInformation.categoryAxisElement);
                this.dataTabInformation.categoryAxisDropDownListObject = new DropDownList({
                    cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                    dataSource: this.gridChart.category,
                    value: this.gridChart.currentChart.series.length ? this.gridChart.currentChart.series[0].xName : null,
                    change: (args: DropDownChangeEventArgs) => {
                        const chartChanges: ChartModel = { series: [...this.gridChart.chart.series] };
                        for (let i: number = 0; i < chartChanges.series.length; i++) {
                            chartChanges.series[parseInt(i.toString(), 10)].xName = args.value as string;
                        }
                        const accumulationChartChanges: AccumulationChartModel = { series: [...this.gridChart.accumulationChart.series] };
                        for (let i: number = 0; i < accumulationChartChanges.series.length; i++) {
                            accumulationChartChanges.series[parseInt(i.toString(), 10)].xName = args.value as string;
                        }
                        const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                        this.gridChart.refresh(changes);
                    },
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.dataTabInformation.categoryAxisDropDownListObject.appendTo(this.dataTabInformation.categoryAxisElement);
            }
        } else if (this.dataTabInformation.categoryAxisDropDownListObject) {
            this.dataTabInformation.categoryAxisDropDownListObject.destroy();
            this.dataTabInformation.categoryAxisDropDownListObject = null;
            this.dataTabInformation.categoryAxisElement.remove();
            this.dataTabInformation.categoryAxisElement = null;
        }
        if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
            if (!this.dataTabInformation.seriesGridDataStyle) {
                this.dataTabInformation.seriesGridDataStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                this.dataTabInformation.seriesGridDataStyle.innerText = this.gridChart.getLocaleText('Series');
                this.dataTabElement.append(this.dataTabInformation.seriesGridDataStyle);
            }
        } else if (this.dataTabInformation.seriesGridDataStyle) {
            this.dataTabInformation.seriesGridDataStyle.remove();
            this.dataTabInformation.seriesGridDataStyle = null;
        }
        if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
            if (this.dataTabInformation.seriesGrid) {
                this.dataTabInformation.seriesGrid.dataSource = (this.gridChart.currentChart.series as SeriesModel[])
                    .map((series: SeriesModel) => ({ Series: series.yName }));
                this.setSeriesGridAction();
                this.dataTabInformation.seriesGrid.freezeRefresh();
            } else {
                this.dataTabInformation.seriesGridElement = createElement('div', { id: 'series_grid' });
                this.dataTabElement.append(this.dataTabInformation.seriesGridElement);
                Grid.Inject(Edit, Toolbar, CommandColumn, RowDD);
                this.dataTabInformation.seriesGrid = new Grid({
                    allowRowDragAndDrop: true,
                    toolbar: ['Add'],
                    dataBound: () => {
                        (this.dataTabInformation.seriesGrid.getHeaderTable() as HTMLElement).classList.add('e-hide');
                    },
                    allowKeyboard: false,
                    actionComplete: (args: DeleteEventArgs) => {
                        if (args.requestType === 'delete') {
                            setTimeout(() => {
                                const newArray: SeriesModel[] = [...this.gridChart.currentChart.series] as SeriesModel[];
                                const index: number = newArray
                                    .findIndex((data: SeriesModel) => data.yName === (<{ Series?: string }>args.data[0]).Series);
                                const [deletedItem]: SeriesModel[] = newArray.splice(index, 1);
                                this.deletedSeries.push(deletedItem as SeriesModel);
                                this.setSeriesGridAction();
                                this.dataTabInformation.seriesGrid.freezeRefresh();
                                const chartChanges: ChartModel = { series: newArray as SeriesModel[] };
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        }
                    },
                    toolbarClick: (args: ClickEventArgs) => {
                        if (args.item.id === 'series_grid_add') {
                            args.cancel = true;
                            setTimeout(() => {
                                const newArray: SeriesModel[] = [...this.gridChart.currentChart.series] as SeriesModel[];
                                this.deletedSeries[0].type = this.gridChart.chartType as ChartSeriesType;
                                newArray.push(this.deletedSeries[0]);
                                this.deletedSeries.shift();
                                this.dataTabInformation.seriesGrid.dataSource = (newArray as SeriesModel[])
                                    .map((series: SeriesModel) => ({ Series: series.yName }));
                                this.setSeriesGridAction();
                                this.dataTabInformation.seriesGrid.freezeRefresh();
                                const chartChanges: ChartModel = { series: newArray as SeriesModel[] };
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        }
                    },
                    rowDrop: (args: RowDragEventArgs) => {
                        if (args.fromIndex !== args.dropIndex) {
                            setTimeout(() => {
                                const newArray: SeriesModel[] = [...this.gridChart.currentChart.series] as SeriesModel[];
                                const [movedItem]: SeriesModel[] = newArray.splice(args.fromIndex, 1);
                                newArray.splice(args.dropIndex, 0, movedItem);
                                const chartChanges: ChartModel = { series: newArray as SeriesModel[] };
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        }
                    },
                    cssClass: this.gridChart.chartSettings.cssClass,
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.dataTabInformation.seriesGrid.dataSource = (this.gridChart.currentChart.series as SeriesModel[])
                    .map((series: SeriesModel) => ({ Series: series.yName }));
                this.setSeriesGridAction();
                this.dataTabInformation.seriesGrid.appendTo(this.dataTabInformation.seriesGridElement);
            }
        } else if (this.dataTabInformation.seriesGrid) {
            this.dataTabInformation.seriesGrid.destroy();
            this.dataTabInformation.seriesGrid = null;
            this.dataTabInformation.seriesGridElement.remove();
            this.dataTabInformation.seriesGridElement = null;
        }
        if (this.gridChart.chartType && this.gridChart.chartType === 'Pie') {
            if (!this.dataTabInformation.accumulationValueAxisDataStyle) {
                this.dataTabInformation.accumulationValueAxisDataStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                this.dataTabInformation.accumulationValueAxisDataStyle.innerText = this.gridChart.getLocaleText('ValueAxis');
                this.dataTabElement.append(this.dataTabInformation.accumulationValueAxisDataStyle);
            }
        } else if (this.dataTabInformation.accumulationValueAxisDataStyle) {
            this.dataTabInformation.accumulationValueAxisDataStyle.remove();
            this.dataTabInformation.accumulationValueAxisDataStyle = null;
        }
        if (this.gridChart.chartType && this.gridChart.chartType === 'Pie') {
            if (this.dataTabInformation.accumulationValueAxisDropDown) {
                this.dataTabInformation.accumulationValueAxisDropDown.value = this.gridChart.currentChart.series.length
                    ? this.gridChart.currentChart.series[0].yName : null;
                this.dataTabInformation.accumulationValueAxisDropDown.refresh();
            } else {
                this.dataTabInformation.accumulationValueAxisElement = createElement('input');
                this.dataTabElement.append(this.dataTabInformation.accumulationValueAxisElement);
                this.dataTabInformation.accumulationValueAxisDropDown = new DropDownList({
                    dataSource: this.gridChart.series,
                    value: this.gridChart.currentChart.series.length ? this.gridChart.currentChart.series[0].yName : null,
                    change: (args: DropDownChangeEventArgs) => {
                        const accumulationChartChanges: AccumulationChartModel = {
                            series: [...this.gridChart.currentChart.series] as AccumulationSeriesModel[]
                        };
                        for (let i: number = 0; i < accumulationChartChanges.series.length; i++) {
                            accumulationChartChanges.series[parseInt(i.toString(), 10)].yName = args.value as string;
                        }
                        const changes: ChartChanges = { chart: {}, accumulationChart: accumulationChartChanges };
                        this.gridChart.refresh(changes);
                    },
                    cssClass: this.gridChart.chartSettings.cssClass,
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.dataTabInformation.accumulationValueAxisDropDown.appendTo(this.dataTabInformation.accumulationValueAxisElement);
            }
        } else if (this.dataTabInformation.accumulationValueAxisDropDown) {
            this.dataTabInformation.accumulationValueAxisDropDown.destroy();
            this.dataTabInformation.accumulationValueAxisDropDown = null;
            this.dataTabInformation.accumulationValueAxisElement.remove();
            this.dataTabInformation.accumulationValueAxisElement = null;
        }
    }

    private setSeriesGridAction(): void {
        const columns: ColumnModel[] = [{ field: 'Series', isPrimaryKey: true }];
        this.dataTabInformation.seriesGrid.editSettings = { allowAdding: this.deletedSeries.length ? true : false, allowDeleting: false };
        if ((this.dataTabInformation.seriesGrid.dataSource as Object[]).length > 1) {
            this.dataTabInformation.seriesGrid.editSettings.allowDeleting = true;
            columns.push({
                commands: [
                    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } }
                ]
            });
        }
        this.dataTabInformation.seriesGrid.columns = columns;
    }

    private formatTab(): void {
        if (this.gridChart.chartType) {
            if (this.formatTabInformation.chartStyleAccordion) {
                this.renderChartStyleList();
            } else {
                this.formatTabInformation.chartStyleElement = createElement('div');
                this.formatTabElement.append(this.formatTabInformation.chartStyleElement);
                this.formatTabInformation.chartStyleAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!this.formatTabInformation.chartStyleContainer) {
                            content.innerHTML = '';
                            this.formatTabInformation.chartStyleContainer = createElement('div');
                            content.append(this.formatTabInformation.chartStyleContainer);
                            this.renderChartStyleList();
                        }
                    },
                    items: [{
                        header: this.gridChart.getLocaleText('ChartStyle'),
                        content: 'Chart Style',
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    }],
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.formatTabInformation.chartStyleAccordion.appendTo(this.formatTabInformation.chartStyleElement);
            }
        } else if (this.formatTabInformation.chartStyleAccordion) {
            this.renderChartStyleList();
            if (this.formatTabInformation.chartStyleContainer) {
                this.formatTabInformation.chartStyleContainer.remove();
                this.formatTabInformation.chartStyleContainer = null;
            }
            this.formatTabInformation.chartStyleAccordion.destroy();
            this.formatTabInformation.chartStyleAccordion = null;
            this.formatTabInformation.chartStyleElement.remove();
            this.formatTabInformation.chartStyleElement = null;
        }
        if (this.gridChart.chartType) {
            if (this.formatTabInformation.titleStyleAccordion) {
                this.renderTitleStyleList();
            } else {
                this.formatTabInformation.titleStyleElement = createElement('div');
                this.formatTabElement.append(this.formatTabInformation.titleStyleElement);
                this.formatTabInformation.titleStyleAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!this.formatTabInformation.titleStyleContainer) {
                            content.innerHTML = '';
                            this.formatTabInformation.titleStyleContainer = createElement('div');
                            content.append(this.formatTabInformation.titleStyleContainer);
                            this.renderTitleStyleList();
                        }
                    },
                    items: [{
                        header: this.gridChart.getLocaleText('TitleStyle'),
                        content: 'Title Style',
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    }],
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.formatTabInformation.titleStyleAccordion.appendTo(this.formatTabInformation.titleStyleElement);
            }
        } else if (this.formatTabInformation.titleStyleAccordion) {
            this.renderTitleStyleList();
            if (this.formatTabInformation.titleStyleContainer) {
                this.formatTabInformation.titleStyleContainer.remove();
                this.formatTabInformation.titleStyleContainer = null;
            }
            this.formatTabInformation.titleStyleAccordion.destroy();
            this.formatTabInformation.titleStyleAccordion = null;
            this.formatTabInformation.titleStyleElement.remove();
            this.formatTabInformation.titleStyleElement = null;
        }
        if (this.gridChart.chartType) {
            if (this.formatTabInformation.legendStyleAccordion) {
                this.renderLegendStyleList();
            } else {
                this.formatTabInformation.legendStyleElement = createElement('div');
                this.formatTabElement.append(this.formatTabInformation.legendStyleElement);
                this.formatTabInformation.legendStyleAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!this.formatTabInformation.legendStyleContainer) {
                            content.innerHTML = '';
                            this.formatTabInformation.legendStyleContainer = createElement('div');
                            content.append(this.formatTabInformation.legendStyleContainer);
                            this.renderLegendStyleList();
                        }
                    },
                    items: [{
                        header: this.gridChart.getLocaleText('Legend'),
                        content: 'Legend',
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    }],
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.formatTabInformation.legendStyleAccordion.appendTo(this.formatTabInformation.legendStyleElement);
            }
        } else if (this.formatTabInformation.legendStyleAccordion) {
            this.renderLegendStyleList();
            if (this.formatTabInformation.legendStyleContainer) {
                this.formatTabInformation.legendStyleContainer.remove();
                this.formatTabInformation.legendStyleContainer = null;
            }
            this.formatTabInformation.legendStyleAccordion.destroy();
            this.formatTabInformation.legendStyleAccordion = null;
            this.formatTabInformation.legendStyleElement.remove();
            this.formatTabInformation.legendStyleElement = null;
        }
        if (this.gridChart.chartType) {
            if (this.formatTabInformation.seriesStyleAccordion) {
                this.renderSeriesStyleList();
            } else {
                this.formatTabInformation.seriesStyleElement = createElement('div');
                this.formatTabElement.append(this.formatTabInformation.seriesStyleElement);
                this.formatTabInformation.seriesStyleAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!this.formatTabInformation.seriesStyleContainer) {
                            content.innerHTML = '';
                            this.formatTabInformation.seriesStyleContainer = createElement('div');
                            content.append(this.formatTabInformation.seriesStyleContainer);
                            this.renderSeriesStyleList();
                        }
                    },
                    items: [{
                        header: this.gridChart.getLocaleText('Series'),
                        content: 'Series',
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    }],
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.formatTabInformation.seriesStyleAccordion.appendTo(this.formatTabInformation.seriesStyleElement);
            }
        } else if (this.formatTabInformation.seriesStyleAccordion) {
            this.renderSeriesStyleList();
            if (this.formatTabInformation.seriesStyleContainer) {
                this.formatTabInformation.seriesStyleContainer.remove();
                this.formatTabInformation.seriesStyleContainer = null;
            }
            this.formatTabInformation.seriesStyleAccordion.destroy();
            this.formatTabInformation.seriesStyleAccordion = null;
            this.formatTabInformation.seriesStyleElement.remove();
            this.formatTabInformation.seriesStyleElement = null;
        }
        if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
            if (this.formatTabInformation.axesStyleAccordion) {
                this.renderAxesStyleList();
            } else {
                this.formatTabInformation.axesStyleElement = createElement('div');
                this.formatTabElement.append(this.formatTabInformation.axesStyleElement);
                this.formatTabInformation.axesStyleAccordion = new Accordion({
                    expanding: (args: ExpandEventArgs) => {
                        const content: HTMLElement = args.content.firstChild as HTMLElement;
                        if (!this.formatTabInformation.axesStyleContainer) {
                            content.innerHTML = '';
                            this.formatTabInformation.axesStyleContainer = createElement('div');
                            content.append(this.formatTabInformation.axesStyleContainer);
                            this.renderAxesStyleList();
                        }
                    },
                    items: [{
                        header: this.gridChart.getLocaleText('Axes'),
                        content: 'Axes',
                        cssClass: this.gridChart.chartSettings.cssClass,
                        expanded: true
                    }],
                    locale: this.gridChart.chartSettings.locale,
                    enableRtl: this.gridChart.enableRtl
                });
                this.formatTabInformation.axesStyleAccordion.appendTo(this.formatTabInformation.axesStyleElement);
            }
        } else if (this.formatTabInformation.axesStyleAccordion) {
            this.renderAxesStyleList();
            if (this.formatTabInformation.axesStyleContainer) {
                this.formatTabInformation.axesStyleContainer.remove();
                this.formatTabInformation.axesStyleContainer = null;
            }
            this.formatTabInformation.axesStyleAccordion.destroy();
            this.formatTabInformation.axesStyleAccordion = null;
            this.formatTabInformation.axesStyleElement.remove();
            this.formatTabInformation.axesStyleElement = null;
        }
    }

    private renderAxesStyleList(): void {
        if (this.formatTabInformation.axesStyleContainer) {
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.applyToAxesStyle) {
                    this.axesStyleInformation.applyToAxesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.axesStyleInformation.applyToAxesStyle.innerText = this.gridChart.getLocaleText('ApplyToAxis');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.applyToAxesStyle);
                }
            } else if (this.axesStyleInformation.applyToAxesStyle) {
                this.axesStyleInformation.applyToAxesStyle.remove();
                this.axesStyleInformation.applyToAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.axesElement) {
                    this.boundSelectAxes = (args: Event): void => {
                        const target: HTMLInputElement = args.target as HTMLInputElement;
                        if (target.value === 'categoryaxis') {
                            this.axes = 'Category';
                        } else if (target.value === 'valueaxis') {
                            this.axes = 'Value';
                        }
                        this.renderAxesStyleList();
                    };
                    this.axesStyleInformation.axesElement = createElement('div', { className: 'e-btn-group e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    if (this.gridChart.enableRtl) {
                        this.axesStyleInformation.axesElement.classList.add('e-rtl');
                    }
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesElement);
                    const categoryAxis: InputRadio = this.createRadio('axes-categoryaxis', 'axes', 'categoryaxis', this.gridChart.getLocaleText('Category'));
                    this.axesStyleInformation.axesCategoryElement = categoryAxis.input;
                    this.axesStyleInformation.axesCategoryElement.addEventListener('click', this.boundSelectAxes);
                    this.axesStyleInformation.axesElement.append(this.axesStyleInformation.axesCategoryElement);
                    this.axesStyleInformation.axesElement.append(categoryAxis.label);
                    const valueAxis: InputRadio = this.createRadio('axes-valueaxis', 'axes', 'valueaxis', this.gridChart.getLocaleText('Value'));
                    this.axesStyleInformation.axesValueElement = valueAxis.input;
                    this.axesStyleInformation.axesValueElement.addEventListener('click', this.boundSelectAxes);
                    this.axesStyleInformation.axesElement.append(this.axesStyleInformation.axesValueElement);
                    this.axesStyleInformation.axesElement.append(valueAxis.label);
                    (this.axesStyleInformation.axesCategoryElement as HTMLInputElement).checked = this.axes === 'Category';
                    (this.axesStyleInformation.axesValueElement as HTMLInputElement).checked = this.axes === 'Value';
                }
            } else if (this.axesStyleInformation.axesElement) {
                this.axesStyleInformation.axesCategoryElement.removeEventListener('click', this.boundSelectAxes);
                this.axesStyleInformation.axesCategoryElement.remove();
                this.axesStyleInformation.axesCategoryElement = null;
                this.axesStyleInformation.axesValueElement.removeEventListener('click', this.boundSelectAxes);
                this.axesStyleInformation.axesValueElement.remove();
                this.axesStyleInformation.axesValueElement = null;
                this.boundSelectAxes = null;
                this.axesStyleInformation.axesElement.remove();
                this.axesStyleInformation.axesElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const checked: boolean = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.isInversed
                    : (this.gridChart.currentChart as Chart).primaryYAxis.isInversed;
                if (this.axesStyleInformation.axesInversedCheckBox) {
                    this.axesStyleInformation.axesInversedCheckBox.checked = checked;
                } else {
                    this.axesStyleInformation.axesInversedElement = createElement('input');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesInversedElement);
                    this.axesStyleInformation.axesInversedCheckBox = new CheckBox({
                        checked,
                        label: this.gridChart.getLocaleText('ReverseOrder'),
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        change: (args: CheckBoxChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { isInversed: args.checked };
                            } else {
                                chartChanges.primaryYAxis = { isInversed: args.checked };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesInversedCheckBox.appendTo(this.axesStyleInformation.axesInversedElement);
                }
            } else if (this.axesStyleInformation.axesInversedCheckBox) {
                this.axesStyleInformation.axesInversedCheckBox.destroy();
                this.axesStyleInformation.axesInversedCheckBox = null;
                this.axesStyleInformation.axesInversedElement.remove();
                this.axesStyleInformation.axesInversedElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.titleHeaderAxesStyle) {
                    this.axesStyleInformation.titleHeaderAxesStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                    this.axesStyleInformation.titleHeaderAxesStyle.innerText = this.gridChart.getLocaleText('Title');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.titleHeaderAxesStyle);
                }
            } else if (this.axesStyleInformation.titleHeaderAxesStyle) {
                this.axesStyleInformation.titleHeaderAxesStyle.remove();
                this.axesStyleInformation.titleHeaderAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.titleTextAxesStyle) {
                    this.axesStyleInformation.titleTextAxesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.axesStyleInformation.titleTextAxesStyle.innerText = this.gridChart.getLocaleText('Text');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.titleTextAxesStyle);
                }
            } else if (this.axesStyleInformation.titleTextAxesStyle) {
                this.axesStyleInformation.titleTextAxesStyle.remove();
                this.axesStyleInformation.titleTextAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.title
                    : (this.gridChart.currentChart as Chart).primaryYAxis.title;
                if (this.axesStyleInformation.axesTitleTextBox) {
                    this.axesStyleInformation.axesTitleTextBox.value = value;
                } else {
                    this.axesStyleInformation.axesTitleElement = createElement('input');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesTitleElement);
                    this.axesStyleInformation.axesTitleTextBox = new TextBox({
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        value,
                        input: (args: InputEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { title: args.value };
                            } else {
                                chartChanges.primaryYAxis = { title: args.value };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesTitleTextBox.appendTo(this.axesStyleInformation.axesTitleElement);
                }
            } else if (this.axesStyleInformation.axesTitleTextBox) {
                this.axesStyleInformation.axesTitleTextBox.destroy();
                this.axesStyleInformation.axesTitleTextBox = null;
                this.axesStyleInformation.axesTitleElement.remove();
                this.axesStyleInformation.axesTitleElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.titleFontAxesStyle) {
                    this.axesStyleInformation.titleFontAxesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.axesStyleInformation.titleFontAxesStyle.innerText = this.gridChart.getLocaleText('Font');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.titleFontAxesStyle);
                }
            } else if (this.axesStyleInformation.titleFontAxesStyle) {
                this.axesStyleInformation.titleFontAxesStyle.remove();
                this.axesStyleInformation.titleFontAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                let value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.titleStyle.fontFamily
                    : (this.gridChart.currentChart as Chart).primaryYAxis.titleStyle.fontFamily;
                value = isNullOrUndefined(value) ? 'Default' : value;
                if (this.axesStyleInformation.axesTitleFontDropDownList) {
                    this.axesStyleInformation.axesTitleFontDropDownList.value = value;
                    this.axesStyleInformation.axesTitleFontDropDownList.refresh();
                } else {
                    this.axesStyleInformation.axesTitleFontElement = createElement('input');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesTitleFontElement);
                    this.axesStyleInformation.axesTitleFontDropDownList = new DropDownList({
                        dataSource: this.font,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartValue: string = args.value === 'Default' ? null : args.value as string;
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { titleStyle: { fontFamily: chartValue } };
                            } else {
                                chartChanges.primaryYAxis = { titleStyle: { fontFamily: chartValue } };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesTitleFontDropDownList.appendTo(this.axesStyleInformation.axesTitleFontElement);
                }
            } else if (this.axesStyleInformation.axesTitleFontDropDownList) {
                this.axesStyleInformation.axesTitleFontDropDownList.destroy();
                this.axesStyleInformation.axesTitleFontDropDownList = null;
                this.axesStyleInformation.axesTitleFontElement.remove();
                this.axesStyleInformation.axesTitleFontElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.axesTitleSizeColorContainer) {
                    this.axesStyleInformation.axesTitleSizeColorContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesTitleSizeColorContainer);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.axesTitleSizeContainer) {
                    this.axesStyleInformation.axesTitleSizeContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Size');
                    this.axesStyleInformation.axesTitleSizeContainer.append(text);
                    this.axesStyleInformation.axesTitleSizeColorContainer.append(this.axesStyleInformation.axesTitleSizeContainer);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: string = this.axes === 'Category'
                    ? (this.gridChart.currentChart as Chart).primaryXAxis.titleStyle.size.replace('px', '')
                    : (this.gridChart.currentChart as Chart).primaryYAxis.titleStyle.size.replace('px', '');
                if (this.axesStyleInformation.axesTitleSizeDropDownList) {
                    this.axesStyleInformation.axesTitleSizeDropDownList.value = value;
                    this.axesStyleInformation.axesTitleSizeDropDownList.refresh();
                } else {
                    this.axesStyleInformation.axesTitleSizeElement = createElement('input');
                    this.axesStyleInformation.axesTitleSizeContainer.append(this.axesStyleInformation.axesTitleSizeElement);
                    this.axesStyleInformation.axesTitleSizeDropDownList = new DropDownList({
                        dataSource: this.fontSize,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { titleStyle: { size: args.value + 'px' } };
                            } else {
                                chartChanges.primaryYAxis = { titleStyle: { size: args.value + 'px' } };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesTitleSizeDropDownList.appendTo(this.axesStyleInformation.axesTitleSizeElement);
                }
            } else if (this.axesStyleInformation.axesTitleSizeDropDownList) {
                this.axesStyleInformation.axesTitleSizeDropDownList.destroy();
                this.axesStyleInformation.axesTitleSizeDropDownList = null;
                this.axesStyleInformation.axesTitleSizeElement.remove();
                this.axesStyleInformation.axesTitleSizeElement = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.axesTitleSizeContainer) {
                this.axesStyleInformation.axesTitleSizeContainer.remove();
                this.axesStyleInformation.axesTitleSizeContainer = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.titleColorAxesStyle) {
                    this.axesStyleInformation.titleColorAxesStyle = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const color: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    color.innerText = this.gridChart.getLocaleText('Color');
                    this.axesStyleInformation.titleColorAxesStyle.append(color);
                    this.axesStyleInformation.axesTitleSizeColorContainer.append(this.axesStyleInformation.titleColorAxesStyle);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.titleStyle.color
                    : (this.gridChart.currentChart as Chart).primaryYAxis.titleStyle.color;
                if (this.axesStyleInformation.axesTitleColorPicker) {
                    this.axesStyleInformation.axesTitleColorPicker.value = value;
                    this.axesStyleInformation.axesTitleColorPicker.refresh();
                } else {
                    this.axesStyleInformation.axesTitleColorElement = createElement('input');
                    this.axesStyleInformation.titleColorAxesStyle.append(this.axesStyleInformation.axesTitleColorElement);
                    this.axesStyleInformation.axesTitleColorPicker = new ColorPicker({
                        value,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const chartChanges: ChartModel = {};
                                if (this.axes === 'Category') {
                                    chartChanges.primaryXAxis = { titleStyle: { color: args.value } };
                                } else {
                                    chartChanges.primaryYAxis = { titleStyle: { color: args.value } };
                                }
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesTitleColorPicker.appendTo(this.axesStyleInformation.axesTitleColorElement);
                }
            } else if (this.axesStyleInformation.axesTitleColorPicker) {
                this.axesStyleInformation.axesTitleColorPicker.destroy();
                this.axesStyleInformation.axesTitleColorPicker = null;
                this.axesStyleInformation.axesTitleColorElement.remove();
                this.axesStyleInformation.axesTitleColorElement = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.titleColorAxesStyle) {
                this.axesStyleInformation.titleColorAxesStyle.remove();
                this.axesStyleInformation.titleColorAxesStyle = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.axesTitleSizeColorContainer) {
                this.axesStyleInformation.axesTitleSizeColorContainer.remove();
                this.axesStyleInformation.axesTitleSizeColorContainer = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.labelHeaderAxesStyle) {
                    this.axesStyleInformation.labelHeaderAxesStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                    this.axesStyleInformation.labelHeaderAxesStyle.innerText = this.gridChart.getLocaleText('Label');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.labelHeaderAxesStyle);
                }
            } else if (this.axesStyleInformation.labelHeaderAxesStyle) {
                this.axesStyleInformation.labelHeaderAxesStyle.remove();
                this.axesStyleInformation.labelHeaderAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.labelFontAxesStyle) {
                    this.axesStyleInformation.labelFontAxesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.axesStyleInformation.labelFontAxesStyle.innerText = this.gridChart.getLocaleText('Font');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.labelFontAxesStyle);
                }
            } else if (this.axesStyleInformation.labelFontAxesStyle) {
                this.axesStyleInformation.labelFontAxesStyle.remove();
                this.axesStyleInformation.labelFontAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                let value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.labelStyle.fontFamily
                    : (this.gridChart.currentChart as Chart).primaryYAxis.labelStyle.fontFamily;
                value = isNullOrUndefined(value) ? 'Default' : value;
                if (this.axesStyleInformation.axesLabelFontDropDownList) {
                    this.axesStyleInformation.axesLabelFontDropDownList.value = value;
                    this.axesStyleInformation.axesLabelFontDropDownList.refresh();
                } else {
                    this.axesStyleInformation.axesLabelFontElement = createElement('input');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesLabelFontElement);
                    this.axesStyleInformation.axesLabelFontDropDownList = new DropDownList({
                        dataSource: this.font,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartValue: string = args.value === 'Default' ? null : args.value as string;
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { labelStyle: { fontFamily: chartValue } };
                            } else {
                                chartChanges.primaryYAxis = { labelStyle: { fontFamily: chartValue } };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesLabelFontDropDownList.appendTo(this.axesStyleInformation.axesLabelFontElement);
                }
            } else if (this.axesStyleInformation.axesLabelFontDropDownList) {
                this.axesStyleInformation.axesLabelFontDropDownList.destroy();
                this.axesStyleInformation.axesLabelFontDropDownList = null;
                this.axesStyleInformation.axesLabelFontElement.remove();
                this.axesStyleInformation.axesLabelFontElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.axesLabelSizeColorContainer) {
                    this.axesStyleInformation.axesLabelSizeColorContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesLabelSizeColorContainer);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.axesLabelSizeContainer) {
                    this.axesStyleInformation.axesLabelSizeContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Size');
                    this.axesStyleInformation.axesLabelSizeContainer.append(text);
                    this.axesStyleInformation.axesLabelSizeColorContainer.append(this.axesStyleInformation.axesLabelSizeContainer);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.labelStyle.size.replace('px', '')
                    : (this.gridChart.currentChart as Chart).primaryYAxis.labelStyle.size.replace('px', '');
                if (this.axesStyleInformation.axesLabelSizeDropDownList) {
                    this.axesStyleInformation.axesLabelSizeDropDownList.value = value;
                    this.axesStyleInformation.axesLabelSizeDropDownList.refresh();
                } else {
                    this.axesStyleInformation.axesLabelSizeElement = createElement('input');
                    this.axesStyleInformation.axesLabelSizeContainer.append(this.axesStyleInformation.axesLabelSizeElement);
                    this.axesStyleInformation.axesLabelSizeDropDownList = new DropDownList({
                        dataSource: this.fontSize,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { labelStyle: { size: args.value + 'px' } };
                            } else {
                                chartChanges.primaryYAxis = { labelStyle: { size: args.value + 'px' } };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesLabelSizeDropDownList.appendTo(this.axesStyleInformation.axesLabelSizeElement);
                }
            } else if (this.axesStyleInformation.axesLabelSizeDropDownList) {
                this.axesStyleInformation.axesLabelSizeDropDownList.destroy();
                this.axesStyleInformation.axesLabelSizeDropDownList = null;
                this.axesStyleInformation.axesLabelSizeElement.remove();
                this.axesStyleInformation.axesLabelSizeElement = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.axesLabelSizeContainer) {
                this.axesStyleInformation.axesLabelSizeContainer.remove();
                this.axesStyleInformation.axesLabelSizeContainer = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.labelColorAxesStyle) {
                    this.axesStyleInformation.labelColorAxesStyle = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const color: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    color.innerText = this.gridChart.getLocaleText('Color');
                    this.axesStyleInformation.labelColorAxesStyle.append(color);
                    this.axesStyleInformation.axesLabelSizeColorContainer.append(this.axesStyleInformation.labelColorAxesStyle);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: string = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.labelStyle.color
                    : (this.gridChart.currentChart as Chart).primaryYAxis.labelStyle.color;
                if (this.axesStyleInformation.axesLabelColorPicker) {
                    this.axesStyleInformation.axesLabelColorPicker.value = value;
                    this.axesStyleInformation.axesLabelColorPicker.refresh();
                } else {
                    this.axesStyleInformation.axesLabelColorElement = createElement('input');
                    this.axesStyleInformation.labelColorAxesStyle.append(this.axesStyleInformation.axesLabelColorElement);
                    this.axesStyleInformation.axesLabelColorPicker = new ColorPicker({
                        value,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const chartChanges: ChartModel = {};
                                if (this.axes === 'Category') {
                                    chartChanges.primaryXAxis = { labelStyle: { color: args.value } };
                                } else {
                                    chartChanges.primaryYAxis = { labelStyle: { color: args.value } };
                                }
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesLabelColorPicker.appendTo(this.axesStyleInformation.axesLabelColorElement);
                }
            } else if (this.axesStyleInformation.axesLabelColorPicker) {
                this.axesStyleInformation.axesLabelColorPicker.destroy();
                this.axesStyleInformation.axesLabelColorPicker = null;
                this.axesStyleInformation.axesLabelColorElement.remove();
                this.axesStyleInformation.axesLabelColorElement = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.labelColorAxesStyle) {
                this.axesStyleInformation.labelColorAxesStyle.remove();
                this.axesStyleInformation.labelColorAxesStyle = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.axesStyleInformation.axesLabelSizeColorContainer) {
                this.axesStyleInformation.axesLabelSizeColorContainer.remove();
                this.axesStyleInformation.axesLabelSizeColorContainer = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.axesStyleInformation.labelRotationAxesStyle) {
                    this.axesStyleInformation.labelRotationAxesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.axesStyleInformation.labelRotationAxesStyle.innerText = this.gridChart.getLocaleText('Rotation');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.labelRotationAxesStyle);
                }
            } else if (this.axesStyleInformation.labelRotationAxesStyle) {
                this.axesStyleInformation.labelRotationAxesStyle.remove();
                this.axesStyleInformation.labelRotationAxesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const value: number = this.axes === 'Category' ? (this.gridChart.currentChart as Chart).primaryXAxis.labelRotation
                    : (this.gridChart.currentChart as Chart).primaryYAxis.labelRotation;
                if (this.axesStyleInformation.axesLabelRotationDropDownList) {
                    this.axesStyleInformation.axesLabelRotationDropDownList.value = value;
                    this.axesStyleInformation.axesLabelRotationDropDownList.refresh();
                } else {
                    this.axesStyleInformation.axesLabelRotationElement = createElement('input');
                    this.formatTabInformation.axesStyleContainer.append(this.axesStyleInformation.axesLabelRotationElement);
                    this.axesStyleInformation.axesLabelRotationDropDownList = new DropDownList({
                        dataSource: this.rotation,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.axes === 'Category') {
                                chartChanges.primaryXAxis = { labelRotation: args.value as number };
                            } else {
                                chartChanges.primaryYAxis = { labelRotation: args.value as number };
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.axesStyleInformation.axesLabelRotationDropDownList.appendTo(this.axesStyleInformation.axesLabelRotationElement);
                }
            } else if (this.axesStyleInformation.axesLabelRotationDropDownList) {
                this.axesStyleInformation.axesLabelRotationDropDownList.destroy();
                this.axesStyleInformation.axesLabelRotationDropDownList = null;
                this.axesStyleInformation.axesLabelRotationElement.remove();
                this.axesStyleInformation.axesLabelRotationElement = null;
            }
        }
    }

    private renderSeriesStyleList(): void {
        if (this.formatTabInformation.seriesStyleContainer) {
            if (this.gridChart.chartType) {
                if (this.seriesStyleInformation.tooltipCheckBox) {
                    this.seriesStyleInformation.tooltipCheckBox.checked = this.gridChart.currentChart.tooltip.enable;
                } else {
                    this.seriesStyleInformation.tooltipElement = createElement('input');
                    this.formatTabInformation.seriesStyleContainer.append(this.seriesStyleInformation.tooltipElement);
                    this.seriesStyleInformation.tooltipCheckBox = new CheckBox({
                        checked: this.gridChart.currentChart.tooltip.enable,
                        label: this.gridChart.getLocaleText('ShowTooltip'),
                        change: (args: CheckBoxChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { tooltip: { enable: args.checked } },
                                accumulationChart: { tooltip: { enable: args.checked } }
                            };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.seriesStyleInformation.tooltipCheckBox.appendTo(this.seriesStyleInformation.tooltipElement);
                }
            } else if (this.seriesStyleInformation.tooltipCheckBox) {
                this.seriesStyleInformation.tooltipCheckBox.destroy();
                this.seriesStyleInformation.tooltipCheckBox = null;
                this.seriesStyleInformation.tooltipElement.remove();
                this.seriesStyleInformation.tooltipElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.seriesStyleInformation.applyToSeriesStyle) {
                    this.seriesStyleInformation.applyToSeriesStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.seriesStyleInformation.applyToSeriesStyle.innerText = this.gridChart.getLocaleText('ApplyTo');
                    closest(this.seriesStyleInformation.tooltipElement, '.e-checkbox-wrapper').insertAdjacentElement('afterend', this.seriesStyleInformation.applyToSeriesStyle);
                }
            } else if (this.seriesStyleInformation.applyToSeriesStyle) {
                this.seriesStyleInformation.applyToSeriesStyle.remove();
                this.seriesStyleInformation.applyToSeriesStyle = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const dataSource: string[] = ['All', ...(this.gridChart.currentChart.series as SeriesModel[]).map((series: SeriesModel) => series.yName)];
                this.stylingSeries = dataSource.indexOf(this.stylingSeries) !== -1 ? this.stylingSeries : 'All';
                if (this.seriesStyleInformation.stylingSeriesDropDownList) {
                    this.seriesStyleInformation.stylingSeriesDropDownList.dataSource = dataSource;
                    this.seriesStyleInformation.stylingSeriesDropDownList.value = this.stylingSeries;
                    this.seriesStyleInformation.stylingSeriesDropDownList.refresh();
                } else {
                    this.seriesStyleInformation.stylingSeriesElement = createElement('input');
                    this.seriesStyleInformation.applyToSeriesStyle.insertAdjacentElement('afterend', this.seriesStyleInformation.stylingSeriesElement);
                    this.seriesStyleInformation.stylingSeriesDropDownList = new DropDownList({
                        dataSource: dataSource,
                        value: this.stylingSeries,
                        change: (args: DropDownChangeEventArgs) => {
                            this.stylingSeries = args.value as string;
                            this.renderSeriesStyleList();
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.seriesStyleInformation.stylingSeriesDropDownList.appendTo(this.seriesStyleInformation.stylingSeriesElement);
                }
            } else if (this.seriesStyleInformation.stylingSeriesDropDownList) {
                this.seriesStyleInformation.stylingSeriesDropDownList.destroy();
                this.seriesStyleInformation.stylingSeriesDropDownList = null;
                this.seriesStyleInformation.stylingSeriesElement.remove();
                this.seriesStyleInformation.stylingSeriesElement = null;
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                if (!this.seriesStyleInformation.colorSeriesStyle) {
                    this.seriesStyleInformation.colorSeriesStyle = createElement('div', { className: 'e-grid-dialogchart-bottom-spacer' });
                    const color: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    color.innerText = this.gridChart.getLocaleText('Color');
                    this.seriesStyleInformation.colorSeriesStyle.append(color);
                    closest(this.seriesStyleInformation.stylingSeriesElement, '.e-control-wrapper').insertAdjacentElement('afterend', this.seriesStyleInformation.colorSeriesStyle);
                }
            }
            if (this.gridChart.chartType && this.gridChart.chartType !== 'Pie') {
                const disabled: boolean = this.stylingSeries === 'All';
                const value: string = disabled ? null
                    : (this.gridChart.currentChart.series as SeriesModel[])
                        .find((series: SeriesModel) => series.yName === this.stylingSeries).fill;
                if (this.seriesStyleInformation.seriesColorPicker) {
                    this.seriesStyleInformation.seriesColorPicker.disabled = disabled;
                    this.seriesStyleInformation.seriesColorPicker.value = value;
                    this.seriesStyleInformation.seriesColorPicker.refresh();
                } else {
                    this.seriesStyleInformation.seriesColorElement = createElement('input');
                    this.seriesStyleInformation.colorSeriesStyle.append(this.seriesStyleInformation.seriesColorElement);
                    this.seriesStyleInformation.seriesColorPicker = new ColorPicker({
                        value: value,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const chartChanges: ChartModel = { series: [...this.gridChart.currentChart.series] as SeriesModel[] };
                                chartChanges.series.find((series: SeriesModel) => series.yName === this.stylingSeries).fill = args.value;
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: {} };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl,
                        disabled: disabled
                    });
                    this.seriesStyleInformation.seriesColorPicker.appendTo(this.seriesStyleInformation.seriesColorElement);
                }
            } else if (this.seriesStyleInformation.seriesColorPicker) {
                this.seriesStyleInformation.seriesColorPicker.destroy();
                this.seriesStyleInformation.seriesColorPicker = null;
                this.seriesStyleInformation.seriesColorElement.remove();
                this.seriesStyleInformation.seriesColorElement = null;
            }
            if (!(this.gridChart.chartType && this.gridChart.chartType !== 'Pie') && this.seriesStyleInformation.colorSeriesStyle) {
                this.seriesStyleInformation.colorSeriesStyle.remove();
                this.seriesStyleInformation.colorSeriesStyle = null;
            }
            if (this.gridChart.chartType) {
                let checked: boolean = false;
                if (this.gridChart.isAccumulationChart() || (this.gridChart.isChart() && this.stylingSeries === 'All')) {
                    if (this.gridChart.isChart()) {
                        checked = !(this.gridChart.currentChart.series as SeriesModel[])
                            .some((series: SeriesModel) => series.marker.dataLabel.visible === false);
                    } else {
                        checked = !(this.gridChart.currentChart.series as AccumulationSeriesModel[])
                            .some((series: AccumulationSeriesModel) => series.dataLabel.visible === false);
                    }
                } else {
                    checked = (this.gridChart.currentChart.series as SeriesModel[])
                        .find((series: SeriesModel) => series.yName === this.stylingSeries).marker.dataLabel.visible;
                }
                if (this.seriesStyleInformation.seriesDataLabelCheckBox) {
                    this.seriesStyleInformation.seriesDataLabelCheckBox.checked = checked;
                } else {
                    this.seriesStyleInformation.seriesDataLabelElement = createElement('input');
                    this.formatTabInformation.seriesStyleContainer.append(this.seriesStyleInformation.seriesDataLabelElement);
                    this.seriesStyleInformation.seriesDataLabelCheckBox = new CheckBox({
                        checked: checked,
                        label: this.gridChart.getLocaleText('ShowDataLabel'),
                        change: (args: CheckBoxChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            if (this.gridChart.isChart()) {
                                chartChanges.series = [...this.gridChart.chart.series];
                                for (let i: number = 0; i < chartChanges.series.length; i++) {
                                    if (this.stylingSeries === 'All'
                                        || this.stylingSeries === chartChanges.series[parseInt(i.toString(), 10)].yName) {
                                        chartChanges.series[parseInt(i.toString(), 10)].marker.dataLabel.visible = args.checked;
                                    }
                                }
                            }
                            const accumulationChartChanges: AccumulationChartModel = {};
                            if (this.gridChart.isAccumulationChart()) {
                                accumulationChartChanges.series = [...this.gridChart.accumulationChart.series];
                                for (let i: number = 0; i < accumulationChartChanges.series.length; i++) {
                                    accumulationChartChanges.series[parseInt(i.toString(), 10)].dataLabel.visible = args.checked;
                                }
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.seriesStyleInformation.seriesDataLabelCheckBox.appendTo(this.seriesStyleInformation.seriesDataLabelElement);
                }
            } else if (this.seriesStyleInformation.seriesDataLabelCheckBox) {
                this.seriesStyleInformation.seriesDataLabelCheckBox.destroy();
                this.seriesStyleInformation.seriesDataLabelCheckBox = null;
                this.seriesStyleInformation.seriesDataLabelElement.remove();
                this.seriesStyleInformation.seriesDataLabelElement = null;
            }
        }
    }

    private renderLegendStyleList(): void {
        if (this.formatTabInformation.legendStyleContainer) {
            if (this.gridChart.chartType) {
                if (this.legendStyleInformation.legendCheckBox) {
                    this.legendStyleInformation.legendCheckBox.checked = this.gridChart.currentChart.legendSettings.visible;
                } else {
                    this.legendStyleInformation.legendElement = createElement('input');
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.legendElement);
                    this.legendStyleInformation.legendCheckBox = new CheckBox({
                        checked: this.gridChart.currentChart.legendSettings.visible,
                        label: this.gridChart.getLocaleText('ShowLegend'),
                        change: (args: CheckBoxChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { legendSettings: { visible: args.checked } },
                                accumulationChart: { legendSettings: { visible: args.checked } }
                            };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.legendStyleInformation.legendCheckBox.appendTo(this.legendStyleInformation.legendElement);
                }
            } else if (this.legendStyleInformation.legendCheckBox) {
                this.legendStyleInformation.legendCheckBox.destroy();
                this.legendStyleInformation.legendCheckBox = null;
                this.legendStyleInformation.legendElement.remove();
                this.legendStyleInformation.legendElement = null;
            }
            if (this.gridChart.chartType) {
                if (!this.legendStyleInformation.fontLegendStyle) {
                    this.legendStyleInformation.fontLegendStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.legendStyleInformation.fontLegendStyle.innerText = this.gridChart.getLocaleText('Font');
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.fontLegendStyle);
                }
            } else if (this.legendStyleInformation.fontLegendStyle) {
                this.legendStyleInformation.fontLegendStyle.remove();
                this.legendStyleInformation.fontLegendStyle = null;
            }
            if (this.gridChart.chartType) {
                let value: string = this.gridChart.currentChart.legendSettings.textStyle.fontFamily;
                value = isNullOrUndefined(value) ? 'Default' : value;
                if (this.legendStyleInformation.legendFontDropDownList) {
                    this.legendStyleInformation.legendFontDropDownList.value = value;
                    this.legendStyleInformation.legendFontDropDownList.refresh();
                } else {
                    this.legendStyleInformation.legendFontElement = createElement('input');
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.legendFontElement);
                    this.legendStyleInformation.legendFontDropDownList = new DropDownList({
                        dataSource: this.font,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartValue: string = args.value === 'Default' ? null : args.value as string;
                            const changes: ChartChanges = {
                                chart: { legendSettings: { textStyle: { fontFamily: chartValue } } },
                                accumulationChart: { legendSettings: { textStyle: { fontFamily: chartValue } } }
                            };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.legendStyleInformation.legendFontDropDownList.appendTo(this.legendStyleInformation.legendFontElement);
                }
            } else if (this.legendStyleInformation.legendFontDropDownList) {
                this.legendStyleInformation.legendFontDropDownList.destroy();
                this.legendStyleInformation.legendFontDropDownList = null;
                this.legendStyleInformation.legendFontElement.remove();
                this.legendStyleInformation.legendFontElement = null;
            }
            if (this.gridChart.chartType) {
                if (!this.legendStyleInformation.legendSizeColorContainer) {
                    this.legendStyleInformation.legendSizeColorContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.legendSizeColorContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (!this.legendStyleInformation.legendSizeContainer) {
                    this.legendStyleInformation.legendSizeContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Size');
                    this.legendStyleInformation.legendSizeContainer.append(text);
                    this.legendStyleInformation.legendSizeColorContainer.append(this.legendStyleInformation.legendSizeContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.legendStyleInformation.legendSizeDropDownList) {
                    this.legendStyleInformation.legendSizeDropDownList.value = this.gridChart.currentChart.legendSettings.textStyle.size.replace('px', '');
                    this.legendStyleInformation.legendSizeDropDownList.refresh();
                } else {
                    this.legendStyleInformation.legendSizeElement = createElement('input');
                    this.legendStyleInformation.legendSizeContainer.append(this.legendStyleInformation.legendSizeElement);
                    this.legendStyleInformation.legendSizeDropDownList = new DropDownList({
                        dataSource: this.fontSize,
                        value: this.gridChart.currentChart.legendSettings.textStyle.size.replace('px', ''),
                        change: (args: DropDownChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { legendSettings: { textStyle: { size: args.value + 'px' } } },
                                accumulationChart: { legendSettings: { textStyle: { size: args.value + 'px' } } }
                            };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.legendStyleInformation.legendSizeDropDownList.appendTo(this.legendStyleInformation.legendSizeElement);
                }
            } else if (this.legendStyleInformation.legendSizeDropDownList) {
                this.legendStyleInformation.legendSizeDropDownList.destroy();
                this.legendStyleInformation.legendSizeDropDownList = null;
                this.legendStyleInformation.legendSizeElement.remove();
                this.legendStyleInformation.legendSizeElement = null;
            }
            if (!(this.gridChart.chartType) && this.legendStyleInformation.legendSizeContainer) {
                this.legendStyleInformation.legendSizeContainer.remove();
                this.legendStyleInformation.legendSizeContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.legendStyleInformation.colorLegendStyle) {
                    this.legendStyleInformation.colorLegendStyle = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const color: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    color.innerText = this.gridChart.getLocaleText('Color');
                    this.legendStyleInformation.colorLegendStyle.append(color);
                    this.legendStyleInformation.legendSizeColorContainer.append(this.legendStyleInformation.colorLegendStyle);
                }
            }
            if (this.gridChart.chartType) {
                if (this.legendStyleInformation.legendColorPicker) {
                    this.legendStyleInformation.legendColorPicker.value = this.gridChart.currentChart.legendSettings.textStyle.color;
                    this.legendStyleInformation.legendColorPicker.refresh();
                } else {
                    this.legendStyleInformation.legendColorElement = createElement('input');
                    this.legendStyleInformation.colorLegendStyle.append(this.legendStyleInformation.legendColorElement);
                    this.legendStyleInformation.legendColorPicker = new ColorPicker({
                        value: this.gridChart.currentChart.legendSettings.textStyle.color,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const changes: ChartChanges = {
                                    chart: { legendSettings: { textStyle: { color: args.value } } },
                                    accumulationChart: { legendSettings: { textStyle: { color: args.value } } }
                                };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.legendStyleInformation.legendColorPicker.appendTo(this.legendStyleInformation.legendColorElement);
                }
            } else if (this.legendStyleInformation.legendColorPicker) {
                this.legendStyleInformation.legendColorPicker.destroy();
                this.legendStyleInformation.legendColorPicker = null;
                this.legendStyleInformation.legendColorElement.remove();
                this.legendStyleInformation.legendColorElement = null;
            }
            if (!this.gridChart.chartType && this.legendStyleInformation.colorLegendStyle) {
                this.legendStyleInformation.colorLegendStyle.remove();
                this.legendStyleInformation.colorLegendStyle = null;
            }
            if (!this.gridChart.chartType && this.legendStyleInformation.legendSizeColorContainer) {
                this.legendStyleInformation.legendSizeColorContainer.remove();
                this.legendStyleInformation.legendSizeColorContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.legendStyleInformation.positionLegendStyle) {
                    this.legendStyleInformation.positionLegendStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.legendStyleInformation.positionLegendStyle.innerText = this.gridChart.getLocaleText('Position');
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.positionLegendStyle);
                }
            } else if (this.legendStyleInformation.positionLegendStyle) {
                this.legendStyleInformation.positionLegendStyle.remove();
                this.legendStyleInformation.positionLegendStyle = null;
            }
            if (this.gridChart.chartType) {
                if (this.legendStyleInformation.legendPositionDropDownList) {
                    this.legendStyleInformation.legendPositionDropDownList.value = this.gridChart.currentChart.legendSettings.position;
                    this.legendStyleInformation.legendPositionDropDownList.refresh();
                } else {
                    this.legendStyleInformation.legendPositionElement = createElement('input');
                    this.formatTabInformation.legendStyleContainer.append(this.legendStyleInformation.legendPositionElement);
                    this.legendStyleInformation.legendPositionDropDownList = new DropDownList({
                        dataSource: this.legendPosition,
                        value: this.gridChart.currentChart.legendSettings.position,
                        change: (args: DropDownChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { legendSettings: { position: args.value as LegendPosition } },
                                accumulationChart: { legendSettings: { position: args.value as LegendPosition } }
                            };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.legendStyleInformation.legendPositionDropDownList.appendTo(this.legendStyleInformation.legendPositionElement);
                }
            } else if (this.legendStyleInformation.legendPositionDropDownList) {
                this.legendStyleInformation.legendPositionDropDownList.destroy();
                this.legendStyleInformation.legendPositionDropDownList = null;
                this.legendStyleInformation.legendPositionElement.remove();
                this.legendStyleInformation.legendPositionElement = null;
            }
        }
    }

    private createRadio(id: string, name: string, value: string, labelText: string): InputRadio {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'radio';
        input.id = id;
        input.name = name;
        input.value = value;
        const label: HTMLLabelElement = document.createElement('label');
        label.classList.add('e-btn', 'e-grid-dialogchart-display-flex-50');
        label.htmlFor = id;
        label.textContent = labelText;
        return { input, label };
    }

    private renderTitleStyleList(): void {
        if (this.formatTabInformation.titleStyleContainer) {
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.applyToTitleStyle) {
                    this.titleStyleInformation.applyToTitleStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.titleStyleInformation.applyToTitleStyle.innerText = this.gridChart.getLocaleText('ApplyTo');
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.applyToTitleStyle);
                }
            } else if (this.titleStyleInformation.applyToTitleStyle) {
                this.titleStyleInformation.applyToTitleStyle.remove();
                this.titleStyleInformation.applyToTitleStyle = null;
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.titleSectionElement) {
                    this.boundSelectTitle = (args: Event): void => {
                        const target: HTMLInputElement = args.target as HTMLInputElement;
                        if (target.value === 'title') {
                            this.titleSection = 'Title';
                        } else if (target.value === 'subtitle') {
                            this.titleSection = 'Subtitle';
                        }
                        this.renderTitleStyleList();
                    };
                    this.titleStyleInformation.titleSectionElement = createElement('div', { className: 'e-btn-group e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    if (this.gridChart.enableRtl) {
                        this.titleStyleInformation.titleSectionElement.classList.add('e-rtl');
                    }
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.titleSectionElement);
                    const title: InputRadio = this.createRadio('title-section-title', 'title', 'title', this.gridChart.getLocaleText('Title'));
                    this.titleStyleInformation.titleSectionTitleElement = title.input;
                    this.titleStyleInformation.titleSectionTitleElement.addEventListener('click', this.boundSelectTitle);
                    this.titleStyleInformation.titleSectionElement.append(this.titleStyleInformation.titleSectionTitleElement);
                    this.titleStyleInformation.titleSectionElement.append(title.label);
                    const subtitle: InputRadio = this.createRadio('title-section-subtitle', 'title', 'subtitle', this.gridChart.getLocaleText('Subtitle'));
                    this.titleStyleInformation.titleSectionSubtitleElement = subtitle.input;
                    this.titleStyleInformation.titleSectionSubtitleElement.addEventListener('click', this.boundSelectTitle);
                    this.titleStyleInformation.titleSectionElement.append(this.titleStyleInformation.titleSectionSubtitleElement);
                    this.titleStyleInformation.titleSectionElement.append(subtitle.label);
                    (this.titleStyleInformation.titleSectionTitleElement as HTMLInputElement).checked = this.titleSection === 'Title';
                    (this.titleStyleInformation.titleSectionSubtitleElement as HTMLInputElement).checked = this.titleSection === 'Subtitle';
                }
            } else if (this.titleStyleInformation.titleSectionElement) {
                this.titleStyleInformation.titleSectionTitleElement.removeEventListener('click', this.boundSelectTitle);
                this.titleStyleInformation.titleSectionTitleElement.remove();
                this.titleStyleInformation.titleSectionTitleElement = null;
                this.titleStyleInformation.titleSectionSubtitleElement.removeEventListener('click', this.boundSelectTitle);
                this.titleStyleInformation.titleSectionSubtitleElement.remove();
                this.titleStyleInformation.titleSectionSubtitleElement = null;
                this.boundSelectTitle = null;
                this.titleStyleInformation.titleSectionElement.remove();
                this.titleStyleInformation.titleSectionElement = null;
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.titleTitleStyle) {
                    this.titleStyleInformation.titleTitleStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.titleStyleInformation.titleTitleStyle.innerText = this.gridChart.getLocaleText('Title');
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.titleTitleStyle);
                }
            } else if (this.titleStyleInformation.titleTitleStyle) {
                this.titleStyleInformation.titleTitleStyle.remove();
                this.titleStyleInformation.titleTitleStyle = null;
            }
            if (this.gridChart.chartType) {
                if (this.titleStyleInformation.titleTextBox) {
                    this.titleStyleInformation.titleTextBox.value = this.titleSection === 'Title' ? this.gridChart.currentChart.title
                        : this.gridChart.currentChart.subTitle;
                } else {
                    this.titleStyleInformation.titleElement = createElement('input');
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.titleElement);
                    this.titleStyleInformation.titleTextBox = new TextBox({
                        value: this.titleSection === 'Title' ? this.gridChart.currentChart.title
                            : this.gridChart.currentChart.subTitle,
                        input: (args: InputEventArgs) => {
                            const chartChanges: ChartModel = {};
                            const accumulationChartChanges: AccumulationChartModel = {};
                            if (this.titleSection === 'Title') {
                                chartChanges.title = args.value;
                                accumulationChartChanges.title = args.value;
                            } else {
                                chartChanges.subTitle = args.value;
                                accumulationChartChanges.subTitle = args.value;
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.titleStyleInformation.titleTextBox.appendTo(this.titleStyleInformation.titleElement);
                }
            } else if (this.titleStyleInformation.titleTextBox) {
                this.titleStyleInformation.titleTextBox.destroy();
                this.titleStyleInformation.titleTextBox = null;
                this.titleStyleInformation.titleElement.remove();
                this.titleStyleInformation.titleElement = null;
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.fontTitleStyle) {
                    this.titleStyleInformation.fontTitleStyle = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    this.titleStyleInformation.fontTitleStyle.innerText = this.gridChart.getLocaleText('Font');
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.fontTitleStyle);
                }
            } else if (this.titleStyleInformation.fontTitleStyle) {
                this.titleStyleInformation.fontTitleStyle.remove();
                this.titleStyleInformation.fontTitleStyle = null;
            }
            if (this.gridChart.chartType) {
                let value: string = this.titleSection === 'Title' ? this.gridChart.currentChart.titleStyle.fontFamily
                    : this.gridChart.currentChart.subTitleStyle.fontFamily;
                value = isNullOrUndefined(value) ? 'Default' : value;
                if (this.titleStyleInformation.titleFontDropDownList) {
                    this.titleStyleInformation.titleFontDropDownList.value = value;
                    this.titleStyleInformation.titleFontDropDownList.refresh();
                } else {
                    this.titleStyleInformation.titleFontElement = createElement('input');
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.titleFontElement);
                    this.titleStyleInformation.titleFontDropDownList = new DropDownList({
                        dataSource: this.font,
                        value,
                        change: (args: DropDownChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            const accumulationChartChanges: AccumulationChartModel = {};
                            const chartValue: string = args.value === 'Default' ? null : args.value as string;
                            if (this.titleSection === 'Title') {
                                chartChanges.titleStyle = {};
                                chartChanges.titleStyle.fontFamily = chartValue;
                                accumulationChartChanges.titleStyle = {};
                                accumulationChartChanges.titleStyle.fontFamily = chartValue;
                            } else {
                                chartChanges.subTitleStyle = {};
                                chartChanges.subTitleStyle.fontFamily = chartValue;
                                accumulationChartChanges.subTitleStyle = {};
                                accumulationChartChanges.subTitleStyle.fontFamily = chartValue;
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass ? 'e-grid-dialogchart-bottom-spacer ' + this.gridChart.chartSettings.cssClass : 'e-grid-dialogchart-bottom-spacer',
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.titleStyleInformation.titleFontDropDownList.appendTo(this.titleStyleInformation.titleFontElement);
                }
            } else if (this.titleStyleInformation.titleFontDropDownList) {
                this.titleStyleInformation.titleFontDropDownList.destroy();
                this.titleStyleInformation.titleFontDropDownList = null;
                this.titleStyleInformation.titleFontElement.remove();
                this.titleStyleInformation.titleFontElement = null;
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.titleSizeColorContainer) {
                    this.titleStyleInformation.titleSizeColorContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex' });
                    this.formatTabInformation.titleStyleContainer.append(this.titleStyleInformation.titleSizeColorContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.titleSizeContainer) {
                    this.titleStyleInformation.titleSizeContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Size');
                    this.titleStyleInformation.titleSizeContainer.append(text);
                    this.titleStyleInformation.titleSizeColorContainer.append(this.titleStyleInformation.titleSizeContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.titleStyleInformation.titleSizeDropDownList) {
                    this.titleStyleInformation.titleSizeDropDownList.value = this.titleSection === 'Title' ? this.gridChart.currentChart.titleStyle.size.replace('px', '')
                        : this.gridChart.currentChart.subTitleStyle.size.replace('px', '');
                    this.titleStyleInformation.titleSizeDropDownList.refresh();
                } else {
                    this.titleStyleInformation.titleSizeElement = createElement('input');
                    this.titleStyleInformation.titleSizeContainer.append(this.titleStyleInformation.titleSizeElement);
                    this.titleStyleInformation.titleSizeDropDownList = new DropDownList({
                        dataSource: this.fontSize,
                        value: this.titleSection === 'Title' ? this.gridChart.currentChart.titleStyle.size.replace('px', '')
                            : this.gridChart.currentChart.subTitleStyle.size.replace('px', ''),
                        change: (args: DropDownChangeEventArgs) => {
                            const chartChanges: ChartModel = {};
                            const accumulationChartChanges: AccumulationChartModel = {};
                            if (this.titleSection === 'Title') {
                                chartChanges.titleStyle = {};
                                chartChanges.titleStyle.size = args.value + 'px';
                                accumulationChartChanges.titleStyle = {};
                                accumulationChartChanges.titleStyle.size = args.value + 'px';
                            } else {
                                chartChanges.subTitleStyle = {};
                                chartChanges.subTitleStyle.size = args.value + 'px';
                                accumulationChartChanges.subTitleStyle = {};
                                accumulationChartChanges.subTitleStyle.size = args.value + 'px';
                            }
                            const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                            this.gridChart.refresh(changes);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.titleStyleInformation.titleSizeDropDownList.appendTo(this.titleStyleInformation.titleSizeElement);
                }
            } else if (this.titleStyleInformation.titleSizeDropDownList) {
                this.titleStyleInformation.titleSizeDropDownList.destroy();
                this.titleStyleInformation.titleSizeDropDownList = null;
                this.titleStyleInformation.titleSizeElement.remove();
                this.titleStyleInformation.titleSizeElement = null;
            }
            if (!this.gridChart.chartType && this.titleStyleInformation.titleSizeContainer) {
                this.titleStyleInformation.titleSizeContainer.remove();
                this.titleStyleInformation.titleSizeContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.titleStyleInformation.colorTitleStyle) {
                    this.titleStyleInformation.colorTitleStyle = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const color: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    color.innerText = this.gridChart.getLocaleText('Color');
                    this.titleStyleInformation.colorTitleStyle.append(color);
                    this.titleStyleInformation.titleSizeColorContainer.append(this.titleStyleInformation.colorTitleStyle);
                }
            }
            if (this.gridChart.chartType) {
                if (this.titleStyleInformation.titleColorPicker) {
                    this.titleStyleInformation.titleColorPicker.value = this.titleSection === 'Title' ? this.gridChart.currentChart.titleStyle.color
                        : this.gridChart.currentChart.subTitleStyle.color;
                    this.titleStyleInformation.titleColorPicker.refresh();
                } else {
                    this.titleStyleInformation.titleColorElement = createElement('input');
                    this.titleStyleInformation.colorTitleStyle.append(this.titleStyleInformation.titleColorElement);
                    this.titleStyleInformation.titleColorPicker = new ColorPicker({
                        value: this.titleSection === 'Title' ? this.gridChart.currentChart.titleStyle.color
                            : this.gridChart.currentChart.subTitleStyle.color,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const chartChanges: ChartModel = {};
                                const accumulationChartChanges: AccumulationChartModel = {};
                                if (this.titleSection === 'Title') {
                                    chartChanges.titleStyle = {};
                                    chartChanges.titleStyle.color = args.value;
                                    accumulationChartChanges.titleStyle = {};
                                    accumulationChartChanges.titleStyle.color = args.value;
                                } else {
                                    chartChanges.subTitleStyle = {};
                                    chartChanges.subTitleStyle.color = args.value;
                                    accumulationChartChanges.subTitleStyle = {};
                                    accumulationChartChanges.subTitleStyle.color = args.value;
                                }
                                const changes: ChartChanges = { chart: chartChanges, accumulationChart: accumulationChartChanges };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.titleStyleInformation.titleColorPicker.appendTo(this.titleStyleInformation.titleColorElement);
                }
            } else if (this.titleStyleInformation.titleColorPicker) {
                this.titleStyleInformation.titleColorPicker.destroy();
                this.titleStyleInformation.titleColorPicker = null;
                this.titleStyleInformation.titleColorElement.remove();
                this.titleStyleInformation.titleColorElement = null;
            }
            if (!this.gridChart.chartType && this.titleStyleInformation.colorTitleStyle) {
                this.titleStyleInformation.colorTitleStyle.remove();
                this.titleStyleInformation.colorTitleStyle = null;
            }
            if (!this.gridChart.chartType && this.titleStyleInformation.titleSizeColorContainer) {
                this.titleStyleInformation.titleSizeColorContainer.remove();
                this.titleStyleInformation.titleSizeColorContainer = null;
            }
        }
    }

    private renderChartStyleList(): void {
        if (this.formatTabInformation.chartStyleContainer) {
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginHeaderChartStyle) {
                    this.chartStyleInformation.marginHeaderChartStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                    this.chartStyleInformation.marginHeaderChartStyle.innerText = this.gridChart.getLocaleText('Margin');
                    this.formatTabInformation.chartStyleContainer.append(this.chartStyleInformation.marginHeaderChartStyle);
                }
            } else if (this.chartStyleInformation.marginHeaderChartStyle) {
                this.chartStyleInformation.marginHeaderChartStyle.remove();
                this.chartStyleInformation.marginHeaderChartStyle = null;
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginTopBottomContainer) {
                    this.chartStyleInformation.marginTopBottomContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    this.formatTabInformation.chartStyleContainer.append(this.chartStyleInformation.marginTopBottomContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginTopContainer) {
                    this.chartStyleInformation.marginTopContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Top');
                    this.chartStyleInformation.marginTopContainer.append(text);
                    this.chartStyleInformation.marginTopBottomContainer.append(this.chartStyleInformation.marginTopContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.chartStyleInformation.marginTopNumericTextBoxObject) {
                    this.chartStyleInformation.marginTopNumericTextBoxObject.value = this.gridChart.currentChart.margin.top;
                } else {
                    this.chartStyleInformation.marginTopElement = createElement('input');
                    this.chartStyleInformation.marginTopContainer.append(this.chartStyleInformation.marginTopElement);
                    this.chartStyleInformation.marginTopNumericTextBoxObject = new NumericTextBox({
                        format: '##',
                        value: this.gridChart.currentChart.margin.top,
                        change: (args: NumericChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { margin: { top: args.value } },
                                accumulationChart: { margin: { top: args.value } }
                            };
                            setTimeout(() => {
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.chartStyleInformation.marginTopNumericTextBoxObject.appendTo(this.chartStyleInformation.marginTopElement);
                }
            } else if (this.chartStyleInformation.marginTopNumericTextBoxObject) {
                this.chartStyleInformation.marginTopNumericTextBoxObject.destroy();
                this.chartStyleInformation.marginTopNumericTextBoxObject = null;
                this.chartStyleInformation.marginTopElement.remove();
                this.chartStyleInformation.marginTopElement = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginTopContainer) {
                this.chartStyleInformation.marginTopContainer.remove();
                this.chartStyleInformation.marginTopContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginBottomContainer) {
                    this.chartStyleInformation.marginBottomContainer = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Bottom');
                    this.chartStyleInformation.marginBottomContainer.append(text);
                    this.chartStyleInformation.marginTopBottomContainer.append(this.chartStyleInformation.marginBottomContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.chartStyleInformation.marginBottomNumericTextBoxObject) {
                    this.chartStyleInformation.marginBottomNumericTextBoxObject.value = this.gridChart.currentChart.margin.bottom;
                } else {
                    this.chartStyleInformation.marginBottomElement = createElement('input');
                    this.chartStyleInformation.marginBottomContainer.append(this.chartStyleInformation.marginBottomElement);
                    this.chartStyleInformation.marginBottomNumericTextBoxObject = new NumericTextBox({
                        format: '##',
                        value: this.gridChart.currentChart.margin.bottom,
                        change: (args: NumericChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { margin: { bottom: args.value } },
                                accumulationChart: { margin: { bottom: args.value } }
                            };
                            setTimeout(() => {
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.chartStyleInformation.marginBottomNumericTextBoxObject.appendTo(this.chartStyleInformation.marginBottomElement);
                }
            } else if (this.chartStyleInformation.marginBottomNumericTextBoxObject) {
                this.chartStyleInformation.marginBottomNumericTextBoxObject.destroy();
                this.chartStyleInformation.marginBottomNumericTextBoxObject = null;
                this.chartStyleInformation.marginBottomElement.remove();
                this.chartStyleInformation.marginBottomElement = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginBottomContainer) {
                this.chartStyleInformation.marginBottomContainer.remove();
                this.chartStyleInformation.marginBottomContainer = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginTopBottomContainer) {
                this.chartStyleInformation.marginTopBottomContainer.remove();
                this.chartStyleInformation.marginTopBottomContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginRightLeftContainer) {
                    this.chartStyleInformation.marginRightLeftContainer = createElement('div', { className: 'e-grid-dialogchart-display-flex e-grid-dialogchart-bottom-spacer' });
                    this.formatTabInformation.chartStyleContainer.append(this.chartStyleInformation.marginRightLeftContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginRightContainer) {
                    this.chartStyleInformation.marginRightContainer = createElement('div');
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Right');
                    this.chartStyleInformation.marginRightContainer.append(text);
                    this.chartStyleInformation.marginRightLeftContainer.append(this.chartStyleInformation.marginRightContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.chartStyleInformation.marginRightNumericTextBoxObject) {
                    this.chartStyleInformation.marginRightNumericTextBoxObject.value = this.gridChart.currentChart.margin.right;
                } else {
                    this.chartStyleInformation.marginRightElement = createElement('input');
                    this.chartStyleInformation.marginRightContainer.append(this.chartStyleInformation.marginRightElement);
                    this.chartStyleInformation.marginRightNumericTextBoxObject = new NumericTextBox({
                        format: '##',
                        value: this.gridChart.currentChart.margin.right,
                        change: (args: NumericChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { margin: { right: args.value } },
                                accumulationChart: { margin: { right: args.value } }
                            };
                            setTimeout(() => {
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.chartStyleInformation.marginRightNumericTextBoxObject.appendTo(this.chartStyleInformation.marginRightElement);
                }
            } else if (this.chartStyleInformation.marginRightNumericTextBoxObject) {
                this.chartStyleInformation.marginRightNumericTextBoxObject.destroy();
                this.chartStyleInformation.marginRightNumericTextBoxObject = null;
                this.chartStyleInformation.marginRightElement.remove();
                this.chartStyleInformation.marginRightElement = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginRightContainer) {
                this.chartStyleInformation.marginRightContainer.remove();
                this.chartStyleInformation.marginRightContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.marginLeftContainer) {
                    this.chartStyleInformation.marginLeftContainer = createElement('div', { className: 'e-grid-dialogchart-intermediate-spacer' });
                    const text: HTMLElement = createElement('div', { className: 'e-grid-chart-props-normal-header' });
                    text.innerText = this.gridChart.getLocaleText('Left');
                    this.chartStyleInformation.marginLeftContainer.append(text);
                    this.chartStyleInformation.marginRightLeftContainer.append(this.chartStyleInformation.marginLeftContainer);
                }
            }
            if (this.gridChart.chartType) {
                if (this.chartStyleInformation.marginLeftNumericTextBoxObject) {
                    this.chartStyleInformation.marginLeftNumericTextBoxObject.value = this.gridChart.currentChart.margin.left;
                } else {
                    this.chartStyleInformation.marginLeftElement = createElement('input');
                    this.chartStyleInformation.marginLeftContainer.append(this.chartStyleInformation.marginLeftElement);
                    this.chartStyleInformation.marginLeftNumericTextBoxObject = new NumericTextBox({
                        format: '##',
                        value: this.gridChart.currentChart.margin.left,
                        change: (args: NumericChangeEventArgs) => {
                            const changes: ChartChanges = {
                                chart: { margin: { left: args.value } },
                                accumulationChart: { margin: { left: args.value } }
                            };
                            setTimeout(() => {
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.chartStyleInformation.marginLeftNumericTextBoxObject.appendTo(this.chartStyleInformation.marginLeftElement);
                }
            } else if (this.chartStyleInformation.marginLeftNumericTextBoxObject) {
                this.chartStyleInformation.marginLeftNumericTextBoxObject.destroy();
                this.chartStyleInformation.marginLeftNumericTextBoxObject = null;
                this.chartStyleInformation.marginLeftElement.remove();
                this.chartStyleInformation.marginLeftElement = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginLeftContainer) {
                this.chartStyleInformation.marginLeftContainer.remove();
                this.chartStyleInformation.marginLeftContainer = null;
            }
            if (!this.gridChart.chartType && this.chartStyleInformation.marginRightLeftContainer) {
                this.chartStyleInformation.marginRightLeftContainer.remove();
                this.chartStyleInformation.marginRightLeftContainer = null;
            }
            if (this.gridChart.chartType) {
                if (!this.chartStyleInformation.colorChartStyle) {
                    this.chartStyleInformation.colorChartStyle = createElement('div', { className: 'e-grid-chart-props-header' });
                    this.chartStyleInformation.colorChartStyle.innerText = this.gridChart.getLocaleText('Color');
                    this.formatTabInformation.chartStyleContainer.append(this.chartStyleInformation.colorChartStyle);
                }
            } else if (this.chartStyleInformation.colorChartStyle) {
                this.chartStyleInformation.colorChartStyle.remove();
                this.chartStyleInformation.colorChartStyle = null;
            }
            if (this.gridChart.chartType) {
                if (this.chartStyleInformation.backgroundColorPicker) {
                    this.chartStyleInformation.backgroundColorPicker.value = this.gridChart.currentChart.background;
                    this.chartStyleInformation.backgroundColorPicker.refresh();
                } else {
                    this.chartStyleInformation.backgroundColorElement = createElement('input');
                    this.formatTabInformation.chartStyleContainer.append(this.chartStyleInformation.backgroundColorElement);
                    this.chartStyleInformation.backgroundColorPicker = new ColorPicker({
                        value: this.gridChart.currentChart.background,
                        change: (args: ColorPickerEventArgs) => {
                            setTimeout(() => {
                                const changes: ChartChanges = {
                                    chart: { background: args.value },
                                    accumulationChart: { background: args.value }
                                };
                                this.gridChart.refresh(changes);
                            }, 0);
                        },
                        cssClass: this.gridChart.chartSettings.cssClass,
                        locale: this.gridChart.chartSettings.locale,
                        enableRtl: this.gridChart.enableRtl
                    });
                    this.chartStyleInformation.backgroundColorPicker.appendTo(this.chartStyleInformation.backgroundColorElement);
                }
            } else if (this.chartStyleInformation.backgroundColorPicker) {
                this.chartStyleInformation.backgroundColorPicker.destroy();
                this.chartStyleInformation.backgroundColorPicker = null;
                this.chartStyleInformation.backgroundColorElement.remove();
                this.chartStyleInformation.backgroundColorElement = null;
            }
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public destroy(): void {
        this.deletedSeries = null;
        this.axes = null;
        this.stylingSeries = null;
        this.titleSection = null;
        this.formatTab();
        this.dataTab();
        this.chartTab();
        this.axesStyleInformation = null;
        this.seriesStyleInformation = null;
        this.legendStyleInformation = null;
        this.titleStyleInformation = null;
        this.chartStyleInformation = null;
        this.formatTabInformation = null;
        this.dataTabInformation = null;
        this.formatTabElement.remove();
        this.formatTabElement = null;
        this.dataTabElement.remove();
        this.dataTabElement = null;
        this.chartTabElement.remove();
        this.chartTabElement = null;
        this.tab.destroy();
        this.tab = null;
        this.tabElement.remove();
        this.tabElement = null;
    }
}
