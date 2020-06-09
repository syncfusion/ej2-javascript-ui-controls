import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IField, IFormatSettings, } from '../../base/engine';
import { IPivotRows, INumberIndex, IFieldOptions, IDrilledItem } from '../../base/engine';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { SeriesModel, Chart, ColumnSeries, LineSeries, Legend, Tooltip, Category, AreaSeries } from '@syncfusion/ej2-charts';
import { SplineAreaSeries, MultiColoredLineSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries } from '@syncfusion/ej2-charts';
import { MultiColoredAreaSeries, SplineSeries, StepLineSeries } from '@syncfusion/ej2-charts';
import { StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries } from '@syncfusion/ej2-charts';
import { RadarSeries, AxisModel, RowModel, Series, ITooltipRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { IAxisLabelRenderEventArgs, ScrollBar, Zoom, IResizeEventArgs, TooltipSettingsModel, PolarSeries } from '@syncfusion/ej2-charts';
import { ZoomSettingsModel, ParetoSeries, Export, Crosshair, MultiLevelLabelsModel, MultiLevelLabel } from '@syncfusion/ej2-charts';
import { ColumnModel, IPointEventArgs, IMultiLevelLabelClickEventArgs, LegendSettingsModel, BubbleSeries } from '@syncfusion/ej2-charts';
import { createElement, remove, isNullOrUndefined, isBlazor } from '@syncfusion/ej2-base';
import { ChartSettingsModel } from '../../pivotview/model/chartsettings-model';
import { PivotView } from '../../pivotview';
import {
    RowHeaderPositionGrouping, ChartSeriesType, ChartSeriesCreatedEventArgs, RowHeaderLevelGrouping, ChartLabelInfo, DrillArgs
} from '../../common';
import { DrillOptionsModel } from '../../pivotview/model/datasourcesettings-model';
import { PivotUtil } from '../../base/util';
import { OlapEngine, ITupInfo } from '../../base/olap/engine';
import { SummaryTypes } from '../../base/types';

export class PivotChart {
    private chartSeries: SeriesModel[];
    private dataSourceSettings: IDataOptions;
    private chartSettings: ChartSettingsModel;
    private element: HTMLElement;
    private templateFn: Function;
    private chartElement: HTMLElement;
    private measureList: string[];
    private headerColl: RowHeaderPositionGrouping = {};
    private maxLevel: number = 0;
    private columnGroupObject: { [key: string]: { x: string, y: number, rIndex: number, cIndex: number }[] } = {};
    private persistSettings: ChartSettingsModel;
    private fieldPosition: string[] = [];
    private measurePos: number = -1;
    private measuresNames: { [key: string]: string } = {};
    /** @hidden */
    public calculatedWidth: number;
    /** @hidden */
    public currentMeasure: string;
    /** @hidden */
    public engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    public parent: PivotView;

    /**
     * Get component name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'pivotchart';
    }

    /* tslint:disable */
    public loadChart(parent: PivotView, chartSettings: ChartSettingsModel): void {
        this.parent = parent;
        this.measuresNames = {};
        this.engineModule = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.dataSourceSettings = this.parent.dataSourceSettings as IDataOptions;
        this.chartSettings = chartSettings;
        let isDataAvail: boolean = parent.dataType === 'olap' ?
            (parent.olapEngineModule.tupColumnInfo.length > 0 && parent.olapEngineModule.tupRowInfo.length > 0 &&
                (!isNullOrUndefined(parent.olapEngineModule.colMeasurePos) || !isNullOrUndefined(parent.olapEngineModule.rowMeasurePos)))
            : parent.dataSourceSettings.values.length > 0;
        if (isDataAvail) {
            if (!this.parent.chart && this.parent.element.querySelector('.e-chart')) {
                remove(this.parent.element.querySelector('#' + this.parent.element.id + '_chart'));
            }
            if (this.chartSettings.enableMultiAxis) {
                this.measureList = this.dataSourceSettings.values.map((item) => { return item.name; });
            } else {
                this.measureList = [chartSettings.value === '' ? this.dataSourceSettings.values[0].name : chartSettings.value];
            }
            for (let field of this.dataSourceSettings.values) {
                let fieldName: string = field.name.replace(/[^A-Z0-9]+/ig, '_');
                this.measuresNames[field.name] = fieldName;
                this.measuresNames[fieldName] = field.name;
            }
        } else if (this.parent.chart) {
            this.parent.chart.series = [];
            this.parent.chart.rows = [];
            this.parent.chart.primaryXAxis.title = '';
            this.parent.chart.primaryYAxis.title = '';
            this.parent.chart.primaryXAxis.multiLevelLabels = [];
            this.parent.chart.primaryYAxis.multiLevelLabels = [];
            if (this.parent.chart.axes.length > 0) {
                this.parent.chart.axes[0].title = '';
            }
            this.parent.chart.primaryXAxis.zoomFactor = 1;
            this.parent.chart.refresh();
            return;
        } else {
            if (!this.parent.element.querySelector('#' + this.parent.element.id + '_chart')) {
                if (this.parent.displayOption.view === 'Both') {
                    this.parent.displayOption.primary === 'Chart' ?
                        (this.parent.element.insertBefore(
                            (createElement('div', {
                                className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                            })), this.parent.element.querySelector('.' + cls.GRID_CLASS))) :
                        (this.parent.element.appendChild(createElement('div', {
                            className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                        })));
                }
                else {
                    this.parent.element.appendChild(createElement('div', {
                        className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                    }));
                }
                let width: string = this.parent.width.toString();
                if (this.parent.showToolbar && this.parent.grid) {
                    width = this.parent.getGridWidthAsNumber().toString();
                }
                let height: string | number = this.getChartHeight();
                let tmpChart: Chart = new Chart({ width: width, height: height });
                tmpChart.appendTo('#' + this.parent.element.id + '_chart');
                if (this.parent.showToolbar) {
                    if (this.parent.displayOption.view === 'Both' && this.parent.currentView === 'Chart') {
                        this.parent.grid.element.style.display = 'none';
                    }
                    if (this.parent.currentView !== 'Chart') {
                        (this.parent.element.querySelector('#' + this.parent.element.id + '_chart') as HTMLElement).style.display = 'none';
                    }
                }
            }
            this.parent.notify(events.contentReady, {});
            return;
        }
        this.columnGroupObject = {};
        let pivotValues: IPivotValues = this.engineModule.pivotValues;
        this.currentMeasure = chartSettings.enableMultiAxis ? this.measureList[0] :
            (((chartSettings.value === '' || this.dataSourceSettings.values.filter((item: IFieldOptions) => {
                return item.name === chartSettings.value;
            }).length === 0) && this.dataSourceSettings.values.length > 0) ? this.dataSourceSettings.values[0].name : chartSettings.value);
        let totColIndex: INumberIndex = this.getColumnTotalIndex(pivotValues);
        let rKeys: string[] = Object.keys(pivotValues);
        let prevLevel: number;
        let firstLevelUName: string;
        let levelCollection: { [key: string]: number } = {};
        let prevCell: IAxisSet;
        let integratedLevel: number = 0;
        let indexCount: number = -0.5;
        this.headerColl = {};
        this.maxLevel = 0;
        let levelPos: { [key: string]: { start: number, end: number } } = {};
        let lastHierarchy: string = '';
        let lastDimension: string = '';
        let memberCell: IAxisSet;
        if (this.parent.dataType === 'olap') {
            levelPos = this.groupHierarchyWithLevels(pivotValues as any);
            lastHierarchy = this.fieldPosition[this.fieldPosition.length - 1];
            lastDimension = (this.measurePos === (this.fieldPosition.length - 1) && this.fieldPosition.length > 1) ?
                this.fieldPosition[this.fieldPosition.length - 2] : lastHierarchy;
        }
        for (let rKey of rKeys) {
            let rowIndex: number = Number(rKey);
            if (!isNullOrUndefined(pivotValues[rowIndex])) {
                if (pivotValues[rowIndex][0] && (pivotValues[rowIndex][0] as IAxisSet).axis === 'row' &&
                    (this.dataSourceSettings.rows.length === 0 ? true : (pivotValues[rowIndex][0] as IAxisSet).type !== 'grand sum')) {
                    let firstRowCell: IAxisSet = pivotValues[rowIndex][0] as IAxisSet;
                    let tupInfo: ITupInfo = this.parent.dataType === 'olap' ?
                        (this.engineModule as OlapEngine).tupRowInfo[firstRowCell.ordinal] : undefined;
                    let fieldPos: number = -1;
                    let currrentLevel: number = firstRowCell.level;
                    if (this.parent.dataType === 'olap') {
                        fieldPos = tupInfo.uNameCollection.split('::[').length - 1;
                        if (firstRowCell.memberType !== 3 && (tupInfo.measureName ?
                            tupInfo.measureName === this.dataSourceSettings.values[0].name : true)) {
                            firstLevelUName = firstLevelUName === undefined ? firstRowCell.levelUniqueName : firstLevelUName;
                            integratedLevel = firstLevelUName === firstRowCell.levelUniqueName ? 0 : integratedLevel;
                            levelCollection = integratedLevel === 0 ? {} : levelCollection;
                            integratedLevel = (prevCell && firstLevelUName !== firstRowCell.levelUniqueName) ?
                                (prevCell.hierarchy === firstRowCell.hierarchy ?
                                    (integratedLevel + (firstRowCell.level - prevCell.level)) :
                                    (isNullOrUndefined(levelCollection[firstRowCell.levelUniqueName]) ?
                                        (levelPos[firstRowCell.hierarchy].start) :
                                        levelCollection[firstRowCell.levelUniqueName])) : integratedLevel;
                            levelCollection[firstRowCell.levelUniqueName] = integratedLevel;
                            currrentLevel = integratedLevel;
                            indexCount += (prevCell && lastDimension === prevCell.hierarchy && !prevCell.isDrilled) ? 1 : 0;
                            prevLevel = integratedLevel;
                            prevCell = firstRowCell;
                        }
                    } else if (firstRowCell.type !== 'value') {
                        if (!(prevLevel === undefined || prevLevel < currrentLevel)) {
                            indexCount++;
                        }
                        prevLevel = currrentLevel;
                    }
                    this.maxLevel = currrentLevel > this.maxLevel ? currrentLevel : this.maxLevel;
                    let name: string = this.parent.dataType === 'olap' ? firstRowCell.formattedText :
                        (firstRowCell.actualText ? firstRowCell.actualText.toString() : firstRowCell.formattedText.toString());
                    let text: string = firstRowCell.formattedText ? firstRowCell.formattedText.toString() : name;
                    let caption: string = (firstRowCell.hasChild && !firstRowCell.isNamedSet) ?
                        ((firstRowCell.isDrilled ? ' - ' : ' + ') + text) : text;
                    let levelName: string = tupInfo ? tupInfo.uNameCollection : firstRowCell.valueSort.levelName.toString();
                    let cellInfo: ChartLabelInfo = {
                        name: name,
                        text: caption,
                        hasChild: firstRowCell.hasChild,
                        isDrilled: firstRowCell.isDrilled,
                        levelName: levelName,
                        level: currrentLevel,
                        fieldName: firstRowCell.valueSort.axis ? firstRowCell.valueSort.axis.toString() : '',
                        rowIndex: rowIndex,
                        colIndex: 0,
                        cell: firstRowCell
                    };
                    if (this.parent.dataType === 'olap' ? firstRowCell.memberType !== 3 : firstRowCell.type !== 'value') {
                        if (this.headerColl[indexCount]) {
                            this.headerColl[indexCount][currrentLevel] = cellInfo;
                        } else {
                            this.headerColl[indexCount] = {};
                            this.headerColl[indexCount][currrentLevel] = cellInfo;
                        }
                    }
                    let rows: IPivotRows = pivotValues[rowIndex];
                    let cKeys: string[] = Object.keys(rows);
                    let prevMemberCell: IAxisSet;
                    if (this.parent.dataType === 'olap') {
                        memberCell = firstRowCell.memberType !== 3 ? firstRowCell : memberCell;
                    } else {
                        memberCell = firstRowCell.type !== 'value' ? firstRowCell : memberCell;
                    }
                    for (let cKey of cKeys) {
                        let cellIndex: number = Number(cKey);
                        let cell: IAxisSet = pivotValues[rowIndex][cellIndex] as IAxisSet;
                        let measureAllow: boolean = cell.rowHeaders === '' ? this.dataSourceSettings.rows.length === 0 : true;
                        let actualText: any = (this.parent.dataType === 'olap' && tupInfo && tupInfo.measureName) ?
                            tupInfo.measureName : cell.actualText;
                        if (!totColIndex[cell.colIndex] && cell.axis === 'value' && firstRowCell.type !== 'header' &&
                            actualText !== '' && (chartSettings.enableMultiAxis ? true : actualText === this.currentMeasure)) {
                            if (isNullOrUndefined(firstRowCell.members)) {
                                firstRowCell.members = [];
                            }
                            if (this.parent.dataType === 'olap' ? (lastHierarchy === firstRowCell.hierarchy ?
                                ((firstRowCell.memberType === 3 && prevMemberCell) ?
                                    (fieldPos === this.measurePos ? prevMemberCell.isDrilled : true) : firstRowCell.isDrilled) : true)
                                : (((firstRowCell.type === 'value' && prevMemberCell) ?
                                    prevMemberCell.members.length > 0 : firstRowCell.members.length > 0) || !measureAllow)) {
                                break;
                            }
                            let colHeaders: string = this.parent.dataType === 'olap' ? cell.columnHeaders.toString().split(/~~|::/).join(' - ')
                                : cell.columnHeaders.toString().split('.').join(' - ');
                            let rowHeaders: string = this.parent.dataType === 'olap' ? cell.rowHeaders.toString().split(/~~|::/).join(' - ')
                                : cell.rowHeaders.toString().split('.').join(' - ');
                            let columnSeries: string = colHeaders + ' | ' + actualText;
                            let yValue: number = (this.parent.dataType === 'pivot' ? (this.engineModule.aggregatedValueMatrix[rowIndex] &&
                                !isNullOrUndefined(this.engineModule.aggregatedValueMatrix[rowIndex][cellIndex])) ?
                                Number(this.engineModule.aggregatedValueMatrix[rowIndex][cellIndex]) : Number(cell.value) : Number(cell.value));
                            if (this.columnGroupObject[columnSeries]) {
                                this.columnGroupObject[columnSeries].push({
                                    x: this.dataSourceSettings.rows.length === 0 ? firstRowCell.formattedText : rowHeaders,
                                    y: yValue,
                                    rIndex: rowIndex,
                                    cIndex: cellIndex
                                });
                            } else {
                                this.columnGroupObject[columnSeries] = [{
                                    x: this.dataSourceSettings.rows.length === 0 ? firstRowCell.formattedText : rowHeaders,
                                    y: yValue,
                                    rIndex: rowIndex,
                                    cIndex: cellIndex
                                }];
                            }
                        }
                        prevMemberCell = memberCell;
                    }
                }
            }
        }
        this.refreshChart();
    }

    /**
     * Refreshing chart based on the updated chartSettings. 
     * @returns void  
     */
    public refreshChart(): void {
        this.chartSeries = [];
        let columnKeys: string[] = Object.keys(this.columnGroupObject);
        this.persistSettings = JSON.parse(this.parent.getPersistData()).chartSettings;
        for (let key of columnKeys) {
            let currentSeries: SeriesModel = {};
            currentSeries = this.persistSettings.chartSeries ? this.frameObjectWithKeys(this.persistSettings.chartSeries) : currentSeries;
            currentSeries.dataSource = this.columnGroupObject[key];
            currentSeries.xName = 'x';
            currentSeries.yName = 'y';
            currentSeries.name = this.chartSettings.enableMultiAxis ? key : key.split(' | ')[0];
            if (!(this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar')) {
                let measure: string = key.split(' | ')[1];
                currentSeries.yAxisName = this.measuresNames[measure] ? this.measuresNames[measure] : measure;
            }
            this.chartSeries = this.chartSeries.concat(currentSeries);
        }
        let seriesEvent: ChartSeriesCreatedEventArgs = { series: this.chartSeries, cancel: false };
        let pivotChart: PivotChart = this;
        this.parent.trigger(events.chartSeriesCreated, seriesEvent, (observedArgs: ChartSeriesCreatedEventArgs) => {
            if (!observedArgs.cancel) {
                pivotChart.bindChart();
            } else {
                if (pivotChart.element) {
                    remove(pivotChart.element);
                }
                pivotChart.parent.notify(events.contentReady, {});
            }
        });

    }
    private frameObjectWithKeys(series: any): SeriesModel | AxisModel {
        let keys: string[] = Object.keys(series);
        let keyPos: number = 0;
        let framedSeries: any = {};
        while (keyPos < keys.length) {
            framedSeries[keys[keyPos]] = series[keys[keyPos]];
            keyPos++;
        }
        return framedSeries;
    }

    private bindChart(): void {
        this.parent.showWaitingPopup();
        let currentXAxis: AxisModel = this.configXAxis();
        let currentTooltipSettings: TooltipSettingsModel = this.configTooltipSettings();
        let currentLegendSettings: LegendSettingsModel = this.configLegendSettings();
        let currentZoomSettings: ZoomSettingsModel = this.configZoomSettings();
        let axesWithRows: { axes: AxisModel[], rows: RowModel[], columns: ColumnModel[] } = this.frameAxesWithRows();
        let type: ChartSeriesType = this.chartSettings.chartSeries.type;
        if (this.parent.displayOption.view === 'Both') {
            this.element = this.parent.displayOption.primary === 'Chart' ?
                (this.parent.element.insertBefore(
                    (!this.element ?
                        (createElement('div', {
                            className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                        }))
                        : this.element), this.parent.element.querySelector('.' + cls.GRID_CLASS))) :
                (this.parent.element.appendChild(!this.element ? (createElement('div', {
                    className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                })) : this.element));
        } else if (!this.element) {
            this.element = (this.parent.element as HTMLElement).appendChild(createElement('div', {
                className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
            }));
        }
        if (!this.chartElement && this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultiAxis) {
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).innerHTML = '';
            this.chartElement = (this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART).appendChild(createElement('div', {
                className: cls.PIVOTCHART_INNER, id: this.parent.element.id + '_chartInner',
            }));
        }
        if ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART_INNER) as HTMLElement) {
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART_INNER) as HTMLElement).innerHTML = '';
        }
        if (this.parent.showGroupingBar) {
            this.element.style.minWidth = '400px !important';
        } else {
            this.element.style.minWidth = '310px !important';
        }
        let width: string = this.parent.width.toString();
        if (this.parent.showToolbar && this.parent.grid) {
            width = this.parent.getGridWidthAsNumber().toString();
        }
        let height: string | number = this.getChartHeight();
        if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultiAxis) {
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.height =
                (height === 'auto' ? this.getChartAutoHeight() : height) + 'px';
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.width = width + 'px';
            if (this.parent.chartSettings.chartSeries.type !== 'Polar' && this.parent.chartSettings.chartSeries.type !== 'Radar') {
                ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'auto';
                ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflowX = 'hidden';
            }
        }
        if (!(this.parent.chart && this.parent.chart.element && this.parent.element.querySelector('.e-chart'))) {
            Chart.Inject(
                ColumnSeries, StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries, BubbleSeries,
                LineSeries, StepLineSeries, SplineSeries, SplineAreaSeries, MultiColoredLineSeries, PolarSeries, RadarSeries,
                AreaSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries, MultiColoredAreaSeries, ParetoSeries,
                Legend, Tooltip, Category, MultiLevelLabel, ScrollBar, Zoom, Export, Crosshair);
            this.parent.chart = new Chart(
                {
                    series: this.chartSeries.length > 0 ? this.chartSeries : [{}],
                    legendSettings: currentLegendSettings,
                    tooltip: currentTooltipSettings,
                    zoomSettings: currentZoomSettings,
                    axes: (type === 'Polar' || type === 'Radar') ? [] : axesWithRows.axes,
                    rows: (type === 'Polar' || type === 'Radar') ? [{}] :
                        (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' &&
                            this.chartSettings.enableMultiAxis) ? [{ height: '100%' }] : axesWithRows.rows,
                    columns: (type === 'Polar' || type === 'Radar') ? [{}] :
                        (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' &&
                            this.chartSettings.enableMultiAxis) ? axesWithRows.columns : [{ width: '100%' }],
                    primaryYAxis: (type === 'Polar' || type === 'Radar') ? axesWithRows.axes[0] : { visible: false },
                    primaryXAxis: currentXAxis,
                    width: width,
                    height: (this.parent.chartSettings.chartSeries.type !== 'Polar' &&
                        this.parent.chartSettings.chartSeries.type !== 'Radar' && this.parent.chartSettings.enableScrollOnMultiAxis &&
                        this.parent.chartSettings.enableMultiAxis && this.parent.dataSourceSettings.values.length > 0) ?
                        Number(height) > (this.parent.dataSourceSettings.values.length * 235) + 100 ? isNaN(Number(height)) ?
                            height.toString() : (Number(height) - 5).toString() :
                            (!isNaN(Number(height)) || this.parent.dataSourceSettings.values.length > 1) ?
                                ((this.parent.dataSourceSettings.values.length * 235) + 100).toString() :
                                height.toString() : height.toString(),
                    title: this.chartSettings.title,
                    titleStyle: this.chartSettings.titleStyle,
                    subTitle: this.chartSettings.subTitle,
                    subTitleStyle: this.chartSettings.subTitleStyle,
                    margin: this.chartSettings.margin,
                    border: this.chartSettings.border,
                    background: this.chartSettings.background,
                    chartArea: this.chartSettings.chartArea,
                    palettes: this.chartSettings.palettes,
                    theme: this.chartSettings.theme,
                    crosshair: this.chartSettings.crosshair,
                    selectionMode: this.chartSettings.selectionMode,
                    isMultiSelect: this.chartSettings.isMultiSelect,
                    enableExport: this.chartSettings.enableExport,
                    selectedDataIndexes: this.chartSettings.selectedDataIndexes,
                    isTransposed: this.chartSettings.isTransposed,
                    enableAnimation: this.chartSettings.enableAnimation,
                    useGroupingSeparator: this.chartSettings.useGroupingSeparator,
                    description: this.chartSettings.description,
                    tabIndex: this.chartSettings.tabIndex,
                    locale: this.parent.locale,
                    enableSideBySidePlacement: this.chartSettings.enableSideBySidePlacement,
                    beforePrint: this.chartSettings.beforePrint ? this.chartSettings.beforePrint.bind(this) : undefined,
                    animationComplete: this.chartSettings.animationComplete ? this.chartSettings.animationComplete.bind(this) : undefined,
                    legendRender: this.chartSettings.legendRender ? this.chartSettings.legendRender.bind(this) : undefined,
                    textRender: this.chartSettings.textRender ? this.chartSettings.textRender.bind(this) : undefined,
                    pointRender: this.chartSettings.pointRender ? this.chartSettings.pointRender.bind(this) : undefined,
                    seriesRender: this.chartSettings.seriesRender ? this.chartSettings.seriesRender.bind(this) : undefined,
                    chartMouseMove: this.chartSettings.chartMouseMove ? this.chartSettings.chartMouseMove.bind(this) : undefined,
                    chartMouseClick: this.chartSettings.chartMouseClick ? this.chartSettings.chartMouseClick.bind(this) : undefined,
                    pointMove: this.chartSettings.pointMove ? this.chartSettings.pointMove.bind(this) : undefined,
                    pointClick: this.pointClick.bind(this),
                    chartMouseLeave: this.chartSettings.chartMouseLeave ? this.chartSettings.chartMouseLeave.bind(this) : undefined,
                    chartMouseDown: this.chartSettings.chartMouseDown ? this.chartSettings.chartMouseDown.bind(this) : undefined,
                    chartMouseUp: this.chartSettings.chartMouseUp ? this.chartSettings.chartMouseUp.bind(this) : undefined,
                    dragComplete: this.chartSettings.dragComplete ? this.chartSettings.dragComplete.bind(this) : undefined,
                    zoomComplete: this.chartSettings.zoomComplete ? this.chartSettings.zoomComplete.bind(this) : undefined,
                    scrollStart: this.chartSettings.scrollStart ? this.chartSettings.scrollStart.bind(this) : undefined,
                    scrollEnd: this.chartSettings.scrollEnd ? this.chartSettings.scrollEnd.bind(this) : undefined,
                    scrollChanged: this.chartSettings.scrollChanged ? this.chartSettings.scrollChanged.bind(this) : undefined,
                    tooltipRender: this.tooltipRender.bind(this),
                    loaded: this.loaded.bind(this),
                    load: this.load.bind(this),
                    resized: this.resized.bind(this),
                    axisLabelRender: this.axisLabelRender.bind(this),
                    multiLevelLabelClick: this.multiLevelLabelClick.bind(this),
                });
            this.parent.chart.isStringTemplate = true;
        } else {
            this.parent.chart.series = this.chartSeries;
            this.parent.chart.primaryXAxis = currentXAxis;
            if (type === 'Polar' || type === 'Radar') {
                this.parent.chart.primaryYAxis.visible = true;
                this.parent.chart.primaryYAxis = axesWithRows.axes[0];
                this.parent.chart.axes = [];
                this.parent.chart.rows = [{}];
            } else {
                this.parent.chart.primaryYAxis.visible = false;
                this.parent.chart.axes = axesWithRows.axes;
                if (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' &&
                    this.chartSettings.enableMultiAxis) {
                    this.parent.chart.rows = [{ height: '100%' }];
                    this.parent.chart.columns = axesWithRows.columns;
                } else {
                    this.parent.chart.rows = axesWithRows.rows;
                    this.parent.chart.columns = [{ width: '100%' }];
                }
            }
            this.parent.chart.refresh();
        }
        if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultiAxis) {
            this.parent.chart.appendTo('#' + this.parent.element.id + '_chartInner');
        } else {
            this.parent.chart.appendTo('#' + this.parent.element.id + '_chart');
        }
    }

    private pointClick(args: IPointEventArgs): void {
        if ((this.parent.allowDrillThrough || this.parent.editSettings.allowEditing) && this.parent.drillThroughModule) {
            let rIndex: number = (args.series.dataSource as any)[args.pointIndex].rIndex;
            let cIndex: number = (args.series.dataSource as any)[args.pointIndex].cIndex;
            this.parent.drillThroughModule.executeDrillThrough(this.parent.pivotValues[rIndex][cIndex] as IAxisSet, rIndex, cIndex);
        }
        this.parent.trigger(events.chartPointClick, args);
    }
    /* tslint:enable */

    private frameAxesWithRows(): { axes: AxisModel[], rows: RowModel[], columns: ColumnModel[] } {
        let axes: AxisModel[] = [];
        let rows: RowModel[] = [];
        let columns: ColumnModel[] = [];
        let percentChart: boolean = this.persistSettings.chartSeries && (
            this.persistSettings.chartSeries.type === 'StackingColumn100' ||
            this.persistSettings.chartSeries.type === 'StackingBar100' ||
            this.persistSettings.chartSeries.type === 'StackingArea100');
        let percentAggregateTypes: SummaryTypes[] = ['PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
            'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal'];
        if (this.chartSettings.enableMultiAxis) {
            let valCnt: number = 0;
            let divider: string = (100 / this.dataSourceSettings.values.length) + '%';
            for (let item of this.dataSourceSettings.values) {
                let measureField: IField = this.engineModule.fieldList[item.name];
                let measureAggregatedName: string =
                    (this.parent.dataType === 'olap' ? '' : (this.parent.localeObj.getConstant(measureField.aggregateType) + ' ' +
                        this.parent.localeObj.getConstant('of') + ' ')) + measureField.caption;
                // let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((itm: IFormatSettings) => {
                //     return itm.name === item.name;
                // })[0];
                let formatSetting: IFormatSettings;
                for (let field of this.dataSourceSettings.formatSettings) {
                    if (field.name === item.name) {
                        formatSetting = field;
                        break;
                    }
                }
                let format: string = PivotUtil.inArray(measureField.aggregateType, percentAggregateTypes) !== -1 ? 'P2' : (formatSetting ?
                    (formatSetting.format.toLowerCase().match(/n|p|c/) === null ? 'N' : formatSetting.format) :
                    this.parent.dataType === 'olap' ? this.getFormat(measureField.formatString) : 'N');
                let resFormat: boolean =
                    (this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar') ? true : false;
                let currentYAxis: AxisModel = {};
                currentYAxis = this.persistSettings.primaryYAxis ?
                    this.frameObjectWithKeys(this.persistSettings.primaryYAxis) : currentYAxis;
                currentYAxis.labelFormat = currentYAxis.labelFormat ?
                    currentYAxis.labelFormat : (percentChart ? '' : (!resFormat ? format : 'N'));
                currentYAxis.title = currentYAxis.title ? currentYAxis.title : measureAggregatedName;
                currentYAxis.plotOffsetTop = currentYAxis.plotOffsetTop ? currentYAxis.plotOffsetTop :
                    this.chartSettings.chartSeries.type === 'Bar' || this.chartSettings.chartSeries.type === 'StackingBar' ||
                        this.chartSettings.chartSeries.type === 'StackingBar100' ? 50 : 30;
                currentYAxis.rowIndex = valCnt;
                currentYAxis.columnIndex = valCnt;
                if (!resFormat) {
                    currentYAxis.name = this.measuresNames[item.name] ? this.measuresNames[item.name] : item.name;
                }
                axes = axes.concat(currentYAxis);
                rows.push({ height: divider });
                columns.push({ width: divider });
                valCnt++;
            }
        } else {
            let measureField: IField = this.engineModule.fieldList[this.currentMeasure];
            let measureAggregatedName: string = (this.parent.dataType === 'olap' ? '' :
                (this.parent.localeObj.getConstant(measureField.aggregateType) + ' ' +
                    this.parent.localeObj.getConstant('of') + ' ')) + measureField.caption;
            // let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((item: IFormatSettings) => {
            //     return item.name === this.currentMeasure;
            // })[0];
            let formatSetting: IFormatSettings;
            for (let item of this.dataSourceSettings.formatSettings) {
                if (item.name === this.currentMeasure) {
                    formatSetting = item;
                    break;
                }
            }
            let currentYAxis: AxisModel = {};
            let format: string = PivotUtil.inArray(measureField.aggregateType, percentAggregateTypes) !== -1 ? 'P2' : (formatSetting ?
                (formatSetting.format.toLowerCase().match(/n|p|c/) === null ? 'N' : formatSetting.format) :
                this.parent.dataType === 'olap' ? this.getFormat(measureField.formatString) : 'N');
            currentYAxis = this.persistSettings.primaryYAxis ? this.frameObjectWithKeys(this.persistSettings.primaryYAxis) : currentYAxis;
            currentYAxis.rowIndex = 0;
            currentYAxis.columnIndex = 0;
            if (!(this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar')) {
                currentYAxis.name = this.measuresNames[this.currentMeasure] ? this.measuresNames[this.currentMeasure] : this.currentMeasure;
            }
            currentYAxis.labelFormat = currentYAxis.labelFormat ? currentYAxis.labelFormat : (percentChart ? '' : format);
            currentYAxis.title = currentYAxis.title ? currentYAxis.title : measureAggregatedName;
            axes = axes.concat(currentYAxis);
            rows.push({ height: '100%' });
            columns.push({ width: '100%' });
        }
        return { axes: axes, rows: rows, columns: columns };
    }

    private getFormat(format: string): string {
        if (format === 'Currency') {
            format = 'C';
        } else if (format === 'Percent') {
            format = 'P';
        } else {
            format = 'N';
        }
        return format;
    }

    private getColumnTotalIndex(pivotValues: IPivotValues): INumberIndex {
        let colIndexColl: INumberIndex = {};
        let rKeys: string[] = Object.keys(pivotValues);
        for (let rowIndex of rKeys) {
            let rows: IPivotRows = pivotValues[Number(rowIndex)];
            let cKeys: string[];
            if (!isNullOrUndefined(rows)) { 
                cKeys = Object.keys(rows);
            }
            for (let cellIndex of cKeys) {
                let cell: IAxisSet = rows[Number(cellIndex)] as IAxisSet;
                if (!isNullOrUndefined(cell)) {
                    if (cell.axis !== 'column') {
                        return colIndexColl;
                    } else if ((cell.type === 'sum' || (this.dataSourceSettings.columns.length === 0 ? false : cell.type === 'grand sum'))
                        && cell.rowSpan !== -1) {
                        colIndexColl[cell.colIndex] = cell.colIndex;
                    }
                }
            }
        }
        return colIndexColl;
    }

    private groupHierarchyWithLevels(pivotValues: IAxisSet[]): { [key: string]: { start: number, end: number } } {
        this.fieldPosition = [];
        let group: { [key: string]: { [key: string]: string } } = {};
        let fieldCount: number = 0;
        let levelPos: { [key: string]: { start: number, end: number } } = {};
        this.measurePos = (this.engineModule as OlapEngine).tupRowInfo[0].measurePosition;
        for (let rowPos: number = 0; rowPos < pivotValues.length; rowPos++) {
            let cell: IAxisSet = (pivotValues[rowPos] as IAxisSet[])[0];
            if (cell && cell.axis === 'row' && cell.type !== 'grand sum') {
                if (isNullOrUndefined(group[cell.hierarchy])) {
                    if (cell.memberType === 3) {
                        if (fieldCount === this.measurePos) {
                            this.fieldPosition[this.measurePos] = cell.hierarchy;
                            group[cell.hierarchy] = { [cell.levelUniqueName]: cell.levelUniqueName };
                        } else {
                            fieldCount--;
                        }
                    } else {
                        this.fieldPosition[fieldCount] = cell.hierarchy;
                        group[cell.hierarchy] = { [cell.levelUniqueName]: cell.levelUniqueName };
                    }
                    fieldCount++;
                } else {
                    group[cell.hierarchy][cell.levelUniqueName] = cell.levelUniqueName;
                }
            }
        }
        let lastEnd: number = -1;
        for (let pos: number = 0; pos < this.fieldPosition.length; pos++) {
            if (this.measurePos !== pos) {
                levelPos[this.fieldPosition[pos]] = {
                    start: (lastEnd + 1),
                    end: (lastEnd + Object.keys(group[this.fieldPosition[pos]]).length)
                };
                lastEnd = levelPos[this.fieldPosition[pos]].end;
            }
        }
        return levelPos;
    }
    /* tslint:disable */
    private frameMultiLevelLabels(): MultiLevelLabelsModel[] {
        let startKeys: string[] = Object.keys(this.headerColl);
        let parentHeaders: RowHeaderLevelGrouping = this.headerColl[-0.5];
        for (let startKey of startKeys) {
            let sKey: number = Number(startKey);
            let headers = this.headerColl[sKey];
            let levelPos: number = 0;
            let isAvail: boolean = false;
            while (levelPos <= this.maxLevel) {
                if (!isAvail) {
                    if (!headers[levelPos]) {
                        headers[levelPos] = parentHeaders[levelPos];
                    } else {
                        isAvail = true;
                    }
                } else if (!headers[levelPos]) {
                    headers[levelPos] = {
                        name: headers[levelPos - 1].name,
                        // text: headers[levelPos - 1].text,
                        text: '',
                        hasChild: headers[levelPos - 1].hasChild,
                        isDrilled: headers[levelPos - 1].isDrilled,
                        levelName: headers[levelPos - 1].levelName,
                        level: headers[levelPos - 1].level,
                        fieldName: headers[levelPos - 1].fieldName,
                        rowIndex: headers[levelPos - 1].rowIndex,
                        colIndex: headers[levelPos - 1].colIndex,
                        span: -1,
                    };
                    // headers[levelPos - 1].span = 0;
                }
                levelPos++;
            }
            parentHeaders = this.headerColl[sKey];
        }
        let gRows: { [key: number]: any } = {};
        for (let startKey of startKeys) {
            let sKey: number = Number(startKey);
            let headers = this.headerColl[sKey];
            let lKeys: string[] = Object.keys(headers);
            for (let levelKey of lKeys) {
                let lKey: number = Number(levelKey);
                if (gRows[lKey]) {
                    let len: number = gRows[lKey].length;
                    if (headers[lKey].levelName === parentHeaders[lKey].levelName) {
                        gRows[lKey][len - 1].end = gRows[lKey][len - 1].end as number + 1;
                    } else {
                        gRows[lKey].push({
                            start: sKey, end: sKey + 1, text: headers[lKey].text,
                            type: (headers[lKey].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'),
                            customAttributes: headers[lKey]
                        });
                    }
                } else {
                    gRows[lKey] = [{
                        start: sKey, end: sKey + 1, text: headers[lKey].text,
                        type: (headers[lKey].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'),
                        customAttributes: headers[lKey]
                    }];
                }
            }
            parentHeaders = headers;
        }
        let levellength: number = Object.keys(gRows).length;
        let multiLevelLabels: MultiLevelLabelsModel[] = [];
        for (let level: number = levellength - 1; level > -1; level--) {
            multiLevelLabels.push({ categories: gRows[level], border: { width: 1 }, overflow: 'Trim' });
        }
        return multiLevelLabels;
    }
    /* tslint:enable */
    private getZoomFactor(): number {
        if (!isNaN(Number(this.parent.width))) {
            this.calculatedWidth = Number(this.parent.width);
        } else if ((this.parent.width as string).indexOf('%') > -1) {
            this.calculatedWidth = this.parent.element.clientWidth * (parseFloat(this.parent.width as string) / 100);
        } else if ((this.parent.width as string).indexOf('px') > -1) {
            this.calculatedWidth = Number(this.parent.width.toString().split('px')[0]);
        } else {
            this.calculatedWidth = this.parent.element.clientWidth;
        }
        let seriesLength: number = (this.chartSeries.length * 10) > 120 ? (this.chartSeries.length * 10) : 120;
        let zoomFactor: number = this.chartSeries.length > 0 ?
            (this.calculatedWidth / (Object.keys(this.chartSeries[0].dataSource).length * seriesLength)) : 1;
        zoomFactor = (zoomFactor < 1 && zoomFactor > 0) ? zoomFactor : 1;
        return zoomFactor;
    }

    private configTooltipSettings(): TooltipSettingsModel {
        let tooltip: TooltipSettingsModel = this.chartSettings.tooltip;
        tooltip.enable = tooltip.enable === undefined ? true : tooltip.enable;
        if (tooltip.enable && tooltip.template) {
            this.templateFn = this.parent.templateParser(tooltip.template);
        }
        if (this.parent.tooltipTemplate) {
            tooltip.template = tooltip.template ? tooltip.template : this.parent.tooltipTemplate;
        }
        if (isBlazor()) {
            this.parent.allowServerDataBinding = false;
            this.parent.setProperties({ chartSettings: { tooltip: { header: tooltip.header ? tooltip.header : '' } } }, true);
            this.parent.allowServerDataBinding = true;
        } else {
            tooltip.header = tooltip.header ? tooltip.header : '';
        }
        tooltip.enableMarker = tooltip.enableMarker === undefined ? true : tooltip.enableMarker;
        return tooltip;
    }

    private configLegendSettings(): LegendSettingsModel {
        let legendSettings: LegendSettingsModel = {};
        legendSettings = this.chartSettings.legendSettings ? this.chartSettings.legendSettings : legendSettings;
        legendSettings.padding = legendSettings.padding ? legendSettings.padding : 25;
        legendSettings.shapePadding = legendSettings.shapePadding ? legendSettings.shapePadding : 10;
        return legendSettings;
    }

    private configXAxis(): AxisModel {
        let currentXAxis: AxisModel = {};
        currentXAxis = this.persistSettings.primaryXAxis ? this.frameObjectWithKeys(this.persistSettings.primaryXAxis) : currentXAxis;
        currentXAxis.valueType = 'Category';
        currentXAxis.labelIntersectAction = currentXAxis.labelIntersectAction ? currentXAxis.labelIntersectAction : 'Rotate45';
        currentXAxis.title = currentXAxis.title ? currentXAxis.title :
            this.dataSourceSettings.rows.map((args: IFieldOptions) => { return args.caption || args.name; }).join(' / ');
        currentXAxis.zoomFactor = this.getZoomFactor();
        if (!this.parent.chartSettings.zoomSettings.enableScrollbar) {
            currentXAxis.zoomFactor = 1;
        }
        if (this.chartSettings.showMultiLevelLabels) {
            currentXAxis.multiLevelLabels = this.frameMultiLevelLabels();
            currentXAxis.border = { width: 1, type: 'WithoutTopandBottomBorder' };
            currentXAxis.majorTickLines = { width: 0, height: -10 };
        }
        return currentXAxis;
    }

    private configZoomSettings(): ZoomSettingsModel {
        let zoomSettings: ZoomSettingsModel = this.chartSettings.zoomSettings;
        zoomSettings.enableSelectionZooming = zoomSettings.enableSelectionZooming === undefined ? true :
            zoomSettings.enableSelectionZooming;
        zoomSettings.enableScrollbar = zoomSettings.enableScrollbar === undefined ? true : zoomSettings.enableScrollbar;
        return zoomSettings;
    }

    private tooltipRender(args: ITooltipRenderEventArgs): void {
        let measure: string = (args.series as Series).yAxisName ? ((args.series as Series).yAxisName.split('_CumulativeAxis')[0]) :
            (this.chartSettings.enableMultiAxis ? args.series.name ? args.series.name.split(' | ')[1] : args.data.seriesName ?
                args.data.seriesName.split(' | ')[1] : this.currentMeasure : this.measuresNames[this.currentMeasure] ?
                    this.measuresNames[this.currentMeasure] : this.currentMeasure);
        /* tslint:disable:no-any */
        let rowIndex: number = args.series.dataSource ? (args.series.dataSource as any)[args.data.pointIndex].rIndex : undefined;
        let colIndex: number = args.series.dataSource ? (args.series.dataSource as any)[args.data.pointIndex].cIndex : undefined;
        let measureField: IField = this.engineModule.fieldList[this.measuresNames[measure] ? this.measuresNames[measure] : measure];
        let aggregateType: string = this.parent.dataType === 'olap' ? '' : this.parent.localeObj.getConstant(measureField.aggregateType);
        let measureAggregatedName: string = (this.parent.dataType === 'olap' ? '' : aggregateType + ' ' +
            this.parent.localeObj.getConstant('of') + ' ') + measureField.caption;
        let formattedText: string = args.text.split('<b>')[1].split('</b>')[0];
        let formatField: IField = this.engineModule.formatFields[measureField.id];
        let formattedValue: string = ((formatField && formatField.format && formatField.format.toLowerCase().match(/n|p|c/) !== null &&
            this.chartSettings.useGroupingSeparator) ? this.parent.dataType === 'olap' ?
                (this.engineModule as OlapEngine).getFormattedValue(args.point.y as number, measureField.id, formattedText) :
                this.parent.engineModule.getFormattedValue(args.point.y as number, measureField.id).formattedText :
            formattedText);
        let columnText: string = (args.series.name ? args.series.name.split(' | ')[0] : args.data.seriesName.split(' | ')[0]);
        let rowText: any = args.point.x;
        if (this.parent.tooltipTemplate && this.parent.getTooltipTemplate() !== undefined || this.chartSettings.tooltip.template) {
            let rowFields: string = args.series.dataSource ? this.parent.getHeaderField(rowIndex, colIndex, 'row') : '';
            let columnFields: string = args.series.dataSource ? this.parent.getHeaderField(rowIndex, colIndex, 'Column') : '';
            let templateVariable: any = {
                rowHeaders: rowText,
                columnHeaders: columnText,
                aggregateType: aggregateType,
                value: formattedValue,
                valueField: measureField.caption,
                rowFields: rowFields,
                columnFields: columnFields
            };
            let template: string;
            if (this.parent.chartSettings && this.parent.chartSettings.tooltip &&
                this.parent.chartSettings.tooltip.enable && this.parent.chartSettings.tooltip.template) {
                template = this.tooltipTemplateFn()(
                    templateVariable, this, 'tooltipTemplate', this.element.id + '1tooltipTemplate')[0].outerHTML;
            } else {
                /* tslint:enable:no-any */
                template = this.parent.getTooltipTemplate()(
                    templateVariable, this, 'tooltipTemplate', this.element.id + 'tooltipTemplate')[0].outerHTML;
            }
            args.template = template;
        } else {
            args.text = measureAggregatedName + ': ' + formattedValue +
                (this.dataSourceSettings.columns.length === 0 ? '' :
                    (' <br/>' + this.parent.localeObj.getConstant('column') + ': ' + columnText)) +
                (this.dataSourceSettings.rows.length === 0 ? '' :
                    (' <br/>' + this.parent.localeObj.getConstant('row') + ': ' + rowText));
            this.parent.trigger(events.chartTooltipRender, args);
        }
    }

    private tooltipTemplateFn(): Function {
        return this.templateFn;
    }
    private loaded(args: ILoadedEventArgs): void {
        this.parent.isChartLoaded = true;
        if (this.parent.chart && this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.showFieldList && this.parent.currentView === 'Chart') {
            this.parent.groupingBarModule.alignIcon();
        }
        if (this.chartSettings.showMultiLevelLabels) {
            let multilabelAxisName: string =
                PivotUtil.inArray(this.chartSettings.chartSeries.type, ['Bar', 'StackingBar', 'StackingBar100']) > -1 ?
                    '_chartYAxisMultiLevelLabel0' : '_chartXAxisMultiLevelLabel0';
            if (!isNullOrUndefined(this.parent.element.querySelector('#' + this.parent.element.id + multilabelAxisName))) {
                this.parent.element.querySelector(
                    '#' + this.parent.element.id + multilabelAxisName).setAttribute('cursor', 'pointer');
            }
        }
        if ((this.parent.chartSettings.chartSeries.type === 'Polar' || this.parent.chartSettings.chartSeries.type === 'Radar') &&
            this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultiAxis) {
            (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'hidden';
        } else if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultiAxis) {
            (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'auto';
            (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflowX = 'hidden';
        }
        this.parent.chart.height = this.parent.chartSettings.chartSeries.type !== 'Polar' &&
            this.parent.chartSettings.chartSeries.type !== 'Radar' && this.parent.chartSettings.enableScrollOnMultiAxis &&
            this.parent.chartSettings.enableMultiAxis && this.parent.dataSourceSettings.values.length > 0 ?
            Number(this.parent.chart.height) > (this.parent.dataSourceSettings.values.length * 235) + 100 ?
                isNaN(Number(this.getChartHeight())) ? this.getChartHeight().toString() : (Number(this.getChartHeight()) - 5).toString() :
                (!isNaN(Number(this.getChartHeight())) || this.parent.dataSourceSettings.values.length > 1) ?
                    ((this.parent.dataSourceSettings.values.length * 235) + 100).toString() :
                    this.getChartHeight().toString() : this.getChartHeight().toString();
        this.updateView();
        this.parent.notify(events.contentReady, {});
        this.parent.trigger(events.chartLoaded, args);
        this.parent.hideWaitingPopup();
    }
    /** @hidden */
    public updateView(): void {
        if (this.parent.grid && this.parent.chart && this.parent.showToolbar) {
            if (this.parent.currentView === 'Table') {
                this.parent.grid.element.style.display = '';
                this.parent.chart.element.style.display = 'none';
                if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                    this.parent.element.querySelector('.e-pivot-grouping-bar') &&
                    this.parent.element.querySelector('.e-chart-grouping-bar')) {
                    (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = '';
                    (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = 'none';
                }
                if (this.parent.chartSettings.enableMultiAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                    (this.parent.element.querySelector('.e-pivotchart') as HTMLElement).style.display = 'none';
                }
            } else {
                this.parent.grid.element.style.display = 'none';
                this.parent.chart.element.style.display = '';
                if (this.parent.showGroupingBar && this.parent.groupingBarModule &&
                    this.parent.element.querySelector('.e-pivot-grouping-bar') &&
                    this.parent.element.querySelector('.e-chart-grouping-bar')) {
                    (this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement).style.display = 'none';
                    (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = '';
                }
                if (this.parent.chartSettings.enableMultiAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                    (this.parent.element.querySelector('.e-pivotchart') as HTMLElement).style.display = '';
                }
            }
        }
    }

    private getChartHeight(): string {
        let height: string = isNullOrUndefined(this.parent.getHeightAsNumber()) ? 'auto' :
            this.parent.getHeightAsNumber().toString();
        if (!isNullOrUndefined(this.parent.getHeightAsNumber())) {
            if (this.parent.showToolbar && this.parent.showGroupingBar) {
                height = (this.parent.getHeightAsNumber() - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                    this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42) -
                    (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                        this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
            } else if (this.parent.showToolbar) {
                height = (this.parent.getHeightAsNumber() - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                    this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42)).toString();
            } else if (this.parent.showGroupingBar) {
                height = (this.parent.getHeightAsNumber() - (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                    this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
            } else if ((this.parent.chart && parseInt(this.parent.chart.height, 10) < 200) || this.parent.getHeightAsNumber() < 200) {
                height = '200';
            }
        } else {
            height = 'auto';
        }
        return height;
    }

    private getChartAutoHeight(): number {
        let height: number = this.parent.element.offsetHeight;
        if (this.parent.showToolbar && this.parent.showGroupingBar) {
            height = this.parent.element.offsetHeight - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42) -
                (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                    this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 76);
        } else if (this.parent.showToolbar) {
            height = this.parent.element.offsetHeight - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42);
        } else if (this.parent.showGroupingBar) {
            height = this.parent.element.offsetHeight - (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 76);
        }
        return height;
    }

    private axisLabelRender(args: IAxisLabelRenderEventArgs): void {
        if (this.chartSettings.showMultiLevelLabels) {
            if (args.axis.name === 'primaryXAxis') {
                args.text = '';
            }
        }
        this.parent.trigger(events.chartAxisLabelRender, args);
    }

    private multiLevelLabelClick(args: IMultiLevelLabelClickEventArgs): void {
        /* tslint:disable-next-line:no-any */
        if (args.customAttributes && (args.customAttributes as any).hasChild && !(args.customAttributes as any).cell.isNamedSet) {
            if (this.parent.dataType === 'olap') {
                this.parent.onDrill(undefined, args.customAttributes as ChartLabelInfo);
            } else {
                this.onDrill(args);
            }
        }
    }
    /** @hidden */
    public onDrill(args: IMultiLevelLabelClickEventArgs): void {
        /* tslint:disable-next-line:no-any */
        let labelInfo: any = args.customAttributes;
        let delimiter: string = (this.dataSourceSettings.drilledMembers[0] && this.dataSourceSettings.drilledMembers[0].delimiter) ?
            this.dataSourceSettings.drilledMembers[0].delimiter : '**';
        let fieldName: string = labelInfo.fieldName;
        let currentCell: IAxisSet = this.engineModule.pivotValues[labelInfo.rowIndex][labelInfo.colIndex] as IAxisSet;
        let memberUqName: string =
            (currentCell.valueSort.levelName as string).
                split(this.engineModule.valueSortSettings.headerDelimiter).join(delimiter);
        let fieldAvail: boolean = false;
        if (this.dataSourceSettings.drilledMembers.length === 0) {
            this.parent.setProperties(
                {
                    dataSourceSettings: { drilledMembers: [{ name: fieldName, items: [memberUqName], delimiter: delimiter }] }
                },
                true);
        } else {
            for (let fCnt: number = 0; fCnt < this.dataSourceSettings.drilledMembers.length; fCnt++) {
                let field: DrillOptionsModel = this.dataSourceSettings.drilledMembers[fCnt];
                memberUqName = memberUqName.split(delimiter).join(field.delimiter ? field.delimiter : delimiter);
                delimiter = field.delimiter = field.delimiter ? field.delimiter : delimiter;
                if (field.name === fieldName) {
                    fieldAvail = true;
                    let memIndex: number = field.items.indexOf(memberUqName);
                    if (memIndex > -1) {
                        field.items.splice(memIndex, 1);
                    } else {
                        field.items.push(memberUqName);
                    }
                } else {
                    continue;
                }
            }
            if (!fieldAvail) {
                this.dataSourceSettings.drilledMembers.push({ name: fieldName, items: [memberUqName], delimiter: delimiter });
            }
        }
        this.parent.showWaitingPopup();
        let pivot: PivotChart = this;
        //setTimeout(() => {
        let drilledItem: IDrilledItem = {
            fieldName: fieldName, memberName: memberUqName, delimiter: delimiter,
            axis: 'row',
            action: labelInfo.isDrilled ? 'up' : 'down',
            currentCell: currentCell
        };
        let drillArgs: DrillArgs = {
            drillInfo: drilledItem,
            pivotview: isBlazor() ? undefined : pivot.parent
        };
        pivot.parent.trigger(events.drill, drillArgs);
        if (pivot.parent.enableVirtualization) {
            if (isBlazor()) {
                /* tslint:disable */
                let sfBlazor: string = 'sfBlazor';
                let dataSourceSettings: any = (window as any)[sfBlazor].copyWithoutCircularReferences([pivot.dataSourceSettings], pivot.dataSourceSettings);
                let drillItem: any = (window as any)[sfBlazor].copyWithoutCircularReferences([drilledItem], drilledItem);
                let args: any = (window as any)[sfBlazor].copyWithoutCircularReferences([drillArgs], drillArgs);
                (pivot.parent as any).interopAdaptor.invokeMethodAsync('PivotInteropMethod', 'onDrill',
                    { 'dataSourceSettings': dataSourceSettings, 'drilledItem': drillItem }).then((data: any) => {
                        pivot.parent.updateBlazorData(data, pivot.parent);
                        pivot.parent.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                        pivot.parent.allowServerDataBinding = false;
                        pivot.parent.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
                        delete (pivot.parent as any).bulkChanges.pivotValues;
                        pivot.parent.allowServerDataBinding = true;
                        pivot.parent.renderPivotGrid();
                    });
                /* tslint:enable */
            } else {
                pivot.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                (pivot.engineModule as PivotEngine).onDrill(drilledItem);
            }
            
        } else {
            (pivot.engineModule as PivotEngine).generateGridData(pivot.dataSourceSettings);
        }
        pivot.parent.allowServerDataBinding = false;
        pivot.parent.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
        /* tslint:disable-next-line:no-any */
        delete (pivot.parent as any).bulkChanges.pivotValues;
        pivot.parent.allowServerDataBinding = true;
        pivot.parent.renderPivotGrid();
        //});
    }

    private load(args: ILoadedEventArgs): void {
        if (args.chart.zoomModule) {
            args.chart.zoomModule.isZoomed = true;
        }
        this.parent.trigger(events.chartLoad, args);
    }

    private resized(args: IResizeEventArgs): void {
        if (isBlazor()) {
            args.chart = this.parent.chart;
        }
        (args.chart as Chart).primaryXAxis.zoomFactor = this.getZoomFactor();
        if (!this.parent.chartSettings.zoomSettings.enableScrollbar) {
            (args.chart as Chart).primaryXAxis.zoomFactor = 1;
        }
        this.parent.trigger(events.chartResized, args);
    }

    /**
     * To destroy the chart module
     * @returns void
     * @hidden
     */
    /* tslint:disable:no-empty */
    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        if (this.parent.chart && !this.parent.chart.isDestroyed) {
            this.parent.chart.destroy();
        } else {
            return;
        }
    }
    /* tslint:enable:no-empty */
}