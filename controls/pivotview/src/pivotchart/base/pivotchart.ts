import { PivotEngine, IAxisSet, IDataOptions, IField, IFormatSettings, IFieldListOptions, IDataSet } from '../../base/engine';
import { IPivotRows, INumberIndex, IFieldOptions, IDrilledItem } from '../../base/engine';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import { SeriesModel, Chart, ColumnSeries, LineSeries, Legend, Tooltip, Category, AreaSeries, Selection, StripLine, DataLabel, StackingLineSeries, AccumulationDataLabelSettingsModel, MultiLevelCategoriesModel } from '@syncfusion/ej2-charts';
import { ILegendClickEventArgs, IPrintEventArgs, IAnimationCompleteEventArgs, ILegendRenderEventArgs, ITextRenderEventArgs, IPointRenderEventArgs } from '@syncfusion/ej2-charts';
import {  ISeriesRenderEventArgs, IMouseEventArgs, IDragCompleteEventArgs, IZoomCompleteEventArgs, IScrollEventArgs } from '@syncfusion/ej2-charts';
import { AccumulationChart, PieSeries, FunnelSeries, PyramidSeries } from '@syncfusion/ej2-charts';
import { SplineAreaSeries, MultiColoredLineSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries } from '@syncfusion/ej2-charts';
import { MultiColoredAreaSeries, SplineSeries, StepLineSeries, AccumulationLegend, AccumulationTooltip } from '@syncfusion/ej2-charts';
import { StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries } from '@syncfusion/ej2-charts';
import { RadarSeries, AxisModel, RowModel, Series, ITooltipRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { IAxisLabelRenderEventArgs, ScrollBar, Zoom, IResizeEventArgs, TooltipSettingsModel, PolarSeries } from '@syncfusion/ej2-charts';
import { ZoomSettingsModel, ParetoSeries, Export, Crosshair, MultiLevelLabelsModel, MultiLevelLabel } from '@syncfusion/ej2-charts';
import { ColumnModel, IPointEventArgs, IMultiLevelLabelClickEventArgs, LegendSettingsModel, BubbleSeries } from '@syncfusion/ej2-charts';
import { AccumulationDataLabel, AccumulationSeriesModel, getSeriesColor } from '@syncfusion/ej2-charts';
import { createElement, remove, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { ChartSettingsModel, PivotSeriesModel } from '../../pivotview/model/chartsettings-model';
import { PivotView } from '../../pivotview/base/pivotview';
import { RowHeaderPositionGrouping, ChartSeriesType, ChartSeriesCreatedEventArgs, RowHeaderLevelGrouping, ChartLabelInfo } from '../../common';
import { DrillArgs, MultiLevelLabelClickEventArgs, EnginePopulatedEventArgs, EnginePopulatingEventArgs, MultiLevelLabelRenderEventArgs } from '../../common';
import { DrillOptionsModel } from '../../model/datasourcesettings-model';
import { PivotUtil } from '../../base/util';
import { OlapEngine, ITupInfo, IDrillInfo } from '../../base/olap/engine';
import { SummaryTypes } from '../../base/types';
import { ContextMenu, ContextMenuModel, MenuItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { hideSpinner, OffsetPosition } from '@syncfusion/ej2-popups';
import { DataManager } from '@syncfusion/ej2-data';

export class PivotChart {
    private chartSeries: SeriesModel[] | AccumulationSeriesModel[];
    private dataSourceSettings: IDataOptions;
    private accumulationMenu: ContextMenu;
    private currentColumn: string;
    private pivotIndex: { rIndex: number; cIndex: number };
    private chartSettings: ChartSettingsModel;
    private element: HTMLElement;
    private templateFn: Function;
    private chartElement: HTMLElement;
    private measureList: string[];
    private headerColl: RowHeaderPositionGrouping = {};
    private maxLevel: number = 0;
    private columnGroupObject: { [key: string]: { x: string; y: number; rIndex: number; cIndex: number }[] } = {};
    private persistSettings: ChartSettingsModel;
    private selectedLegend: number = 0;
    private chartSeriesInfo: { [key: string]: { uniqueName?: string; caption?: string; colorIndex?: number[] } } = {};
    private measurePos: number = -1;
    private measuresNames: { [key: string]: string } = {};
    private accumulationType: ChartSeriesType[] = ['Pie', 'Pyramid', 'Doughnut', 'Funnel'];
    private accEmptyPoint: boolean;
    private isChartInitial: boolean = true;
    /** @hidden */
    public calculatedWidth: number;
    /** @hidden */
    public currentMeasure: string;
    /** @hidden */
    public engineModule: PivotEngine | OlapEngine;
    /** @hidden */
    public parent: PivotView;

    /**
     * Constructor for pivot chart module.
     *
     *  @param {PivotView} parent - Instance of pivot table.
     */
    constructor(parent?: PivotView) {
        this.parent = parent;
    }

    /**
     * Get component name.
     *
     * @returns {string} - string
     * @private
     */
    public getModuleName(): string {
        return 'pivotChart';
    }

    /**
     * Initialize the pivot chart rendering
     *
     * @param {PivotView} parent - Specifies the pivot table component instance.
     * @param {ChartSettingsModel} chartSettings - Specifies the chart settings.
     * @returns {void}
     * @private
     */
    public loadChart(parent: PivotView, chartSettings: ChartSettingsModel): void {
        this.parent = parent;
        this.measuresNames = {};
        this.engineModule = this.parent.dataType === 'olap' ? this.parent.olapEngineModule : this.parent.engineModule;
        this.dataSourceSettings = this.parent.dataSourceSettings as IDataOptions;
        this.chartSettings = chartSettings;
        const isDataAvail: boolean = parent.dataType === 'olap' ?
            (parent.dataSourceSettings.url !== '' && !parent.olapEngineModule.isEmptyData &&
                parent.olapEngineModule.tupColumnInfo.length > 0 && parent.olapEngineModule.tupRowInfo.length > 0 &&
                (!isNullOrUndefined(parent.olapEngineModule.colMeasurePos) || !isNullOrUndefined(parent.olapEngineModule.rowMeasurePos)))
            : this.parent.dataSourceSettings.mode === 'Server' ? (!isNullOrUndefined(parent.dataSourceSettings.url) &&
                parent.dataSourceSettings.url !== '' && parent.dataSourceSettings.values.length > 0 && !parent.engineModule.isEmptyData) :
                (parent.dataSourceSettings.values.length > 0 && parent.dataSourceSettings.dataSource &&
                    ((parent.dataSourceSettings.dataSource as IDataSet[]).length > 0 ||
                    (parent.dataSourceSettings.dataSource instanceof DataManager)) && !parent.engineModule.isEmptyData);
        if (isDataAvail) {
            if (!this.parent.chart && (this.parent.element.querySelector('.e-chart') || this.parent.element.querySelector('.e-accumulationchart'))) {
                remove(select('#' + this.parent.element.id + '_chart', this.parent.element));
            }
            if (this.chartSettings.enableMultipleAxis && this.accumulationType.indexOf(chartSettings.chartSeries.type) < 0 && this.chartSettings.chartSeries.type !== 'Pareto') {
                this.measureList = this.dataSourceSettings.values.map((item: IFieldOptions) => { return item.name; });
            } else {
                this.measureList = [chartSettings.value === '' ? this.dataSourceSettings.values[0].name : chartSettings.value];
            }
            for (const field of this.dataSourceSettings.values) {
                const fieldName: string = field.name.replace(/[^A-Z0-9]+/ig, '_');
                this.measuresNames[field.name] = fieldName;
                this.measuresNames[fieldName as string] = field.name;
                if ((this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar')) {
                    this.measuresNames[field.caption ? field.caption : field.name] = field.name;
                }
            }
        } else if (this.parent.chart) {
            if (this.parent.element.querySelector('.e-chart')) {
                this.parent.chart.series = [];
                (this.parent.chart as Chart).rows = [];
                (this.parent.chart as Chart).primaryXAxis.title = '';
                (this.parent.chart as Chart).primaryYAxis.title = '';
                (this.parent.chart as Chart).primaryXAxis.multiLevelLabels = [];
                (this.parent.chart as Chart).primaryYAxis.multiLevelLabels = [];
                if ((this.parent.chart as Chart).axes.length > 0) {
                    (this.parent.chart as Chart).axes[0].title = '';
                }
                (this.parent.chart as Chart).primaryXAxis.zoomFactor = isNullOrUndefined(this.parent.chartSettings.primaryXAxis.zoomFactor)
                    ? 1 : this.parent.chartSettings.primaryXAxis.zoomFactor;
            } else if (this.parent.element.querySelector('.e-accumulationchart')) {
                this.parent.chart.series[0].dataSource = [{}];
                (this.parent.chart.series[0] as AccumulationSeriesModel).dataLabel = {};
            }
            this.parent.chart.refresh();
            return;
        } else {
            this.parent.appendChartElement();
            if (this.parent.enableVirtualization && this.isChartInitial) {
                this.isChartInitial = false;
                this.parent.onContentReady();
            }
            this.parent.notify(events.contentReady, {});
            return;
        }
        this.columnGroupObject = {};
        this.accEmptyPoint = false;
        const pivotValues: IAxisSet[][] = this.engineModule.pivotValues;
        this.currentMeasure = (chartSettings.enableMultipleAxis && this.accumulationType.indexOf(chartSettings.chartSeries.type) < 0 && this.chartSettings.chartSeries.type !== 'Pareto') ? this.measureList[0] :
            (((chartSettings.value === '' || this.dataSourceSettings.values.filter((item: IFieldOptions) => {
                return item.name === chartSettings.value;
            }).length === 0) && this.dataSourceSettings.values.length > 0) ? this.dataSourceSettings.values[0].name : chartSettings.value);
        const totColIndex: INumberIndex = this.getColumnTotalIndex(pivotValues);
        const rKeys: string[] = Object.keys(pivotValues);
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
        let drillDimension: string = '';
        this.chartSeriesInfo = {};
        this.selectedLegend = 0;
        let isDrill: boolean = false;
        const measureNames: { [key: string]: string } = {};
        let isValidHeader: boolean = false;
        const delimiter: string = this.parent.dataSourceSettings.valueSortSettings.headerDelimiter;
        for (const field of this.dataSourceSettings.values) {
            const fieldName: string = field.name;
            measureNames[fieldName as string] = field.caption ? field.caption : fieldName;
            measureNames[field.caption ? field.caption : fieldName] = fieldName;
        }
        if (this.parent.dataType === 'olap') {
            const fieldPosition: string[] = [];
            levelPos = this.groupHierarchyWithLevels(pivotValues as IAxisSet[], fieldPosition);
            lastHierarchy = fieldPosition[fieldPosition.length - 1];
            lastDimension = (this.measurePos === (fieldPosition.length - 1) && fieldPosition.length > 1) ?
                fieldPosition[fieldPosition.length - 2] : lastHierarchy;
            drillDimension = lastDimension;
        }
        let reductionLevel: number = 0;
        let reductionLevelCount: number = 0;
        let finalReductionLevel: number = 0;
        for (const rKey of rKeys) {
            const rowIndex: number = Number(rKey);
            let drillMem: boolean = false;
            if (!isNullOrUndefined(pivotValues[rowIndex as number])) {
                const colIndex: number = this.parent.gridSettings.layout === 'Tabular' ? this.parent.engineModule.rowMaxLevel : 0;
                const header: IAxisSet = pivotValues[rowIndex as number][colIndex as number] as IAxisSet;
                const valueSort: string[] = header && header.valueSort && !isNullOrUndefined(header.valueSort.levelName) ?
                    header.valueSort.levelName.toString().split(delimiter) : undefined;
                isValidHeader = false;
                if (valueSort && valueSort[0] !== 'Grand Total') {
                    if ((chartSettings.enableMultipleAxis && this.accumulationType.indexOf(chartSettings.chartSeries.type) < 0 && this.chartSettings.chartSeries.type !== 'Pareto') ||
                        valueSort.indexOf(measureNames[this.currentMeasure]) > -1) {
                        isValidHeader = true;
                    }
                    if (!isValidHeader) {
                        for (const levelName of valueSort) {
                            if (measureNames[levelName as string]) {
                                isValidHeader = true;
                                break;
                            }
                        }
                        isValidHeader = isValidHeader ? false : true;
                    }
                }
                if (header && header.axis === 'row' && (this.dataSourceSettings.rows.length === 0 ? true :
                    (header.type !== 'grand sum' && isValidHeader))) {
                    const firstRowCell: IAxisSet = pivotValues[rowIndex as number][this.parent.gridSettings.layout === 'Tabular' ?
                        this.parent.engineModule.rowMaxLevel : 0] as IAxisSet;
                    if (this.parent.gridSettings.layout !== 'Tabular') {
                        if (firstRowCell.isSum) {
                            continue;
                        }
                    }
                    const tupInfo: ITupInfo = this.parent.dataType === 'olap' ?
                        (this.engineModule as OlapEngine).tupRowInfo[firstRowCell.ordinal] : undefined;
                    let fieldPos: number = -1;
                    let currrentLevel: number = firstRowCell.level;
                    if (this.parent.dataType === 'olap') {
                        isDrill = firstRowCell.hierarchy === '[Measures]' ? isDrill : this.isAttributeDrill(firstRowCell.hierarchy, tupInfo.drillInfo);
                        drillDimension = drillDimension === lastDimension ? lastDimension : (firstRowCell.hierarchy === '[Measures]' || firstRowCell.isNamedSet || (this.engineModule.fieldList[firstRowCell.hierarchy] && !(this.engineModule as OlapEngine).fieldList[firstRowCell.hierarchy].hasAllMember)) ? lastDimension : drillDimension;
                        fieldPos = tupInfo.drillInfo.length - 1;
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
                            indexCount += (prevCell && drillDimension === prevCell.hierarchy && !(prevCell.isDrilled && prevCell.hasChild))
                                ? 1 : 0;
                            drillDimension = isDrill ? firstRowCell.hierarchy : lastDimension;
                            prevLevel = integratedLevel;
                            prevCell = firstRowCell;
                        }
                    } else if (firstRowCell.type !== 'value') {
                        if (this.parent.gridSettings.layout === 'Tabular') {
                            const firstRowLevelName: string = firstRowCell.valueSort.levelName as string;
                            const levelNameCollection: string[] = firstRowLevelName.split(delimiter);
                            const formattedTextCollection: string[] = firstRowCell.formattedText.split(' ');
                            for (let n: number = 0; n < this.parent.dataSourceSettings.drilledMembers.length; n++) {
                                const drillItems: string[] = this.parent.dataSourceSettings.drilledMembers[n as number].items;
                                for (let v: number = 0; v < drillItems.length; v++) {
                                    const drillItemsCollection: string[] = drillItems[v as number].split(this.parent.dataSourceSettings
                                        .drilledMembers[n as number].delimiter);
                                    if (drillItemsCollection[drillItemsCollection.length - 1] === firstRowCell.formattedText.split(' ')[0]
                                        && drillItemsCollection[0] === levelNameCollection[0]) {
                                        drillMem = true;
                                        break;
                                    }
                                }
                            }
                            const valueSortIndex: number = (valueSort.length - 2) !== (this.parent.engineModule.rowMaxLevel - 1) ?
                                (valueSort.length - 2) : this.parent.engineModule.rowMaxLevel - 1;
                            for (let k: number = 0; k <= this.parent.engineModule.rowMaxLevel; k++) {
                                if (this.headerColl[indexCount as number] && this.headerColl[indexCount as number][k as number]) {
                                    if (firstRowCell.isSum) {
                                        if (firstRowCell.level > 0) {
                                            indexCount = indexCount - (firstRowCell.level === this.parent.engineModule.rowMaxLevel - 1 ?
                                                reductionLevel - 1 : reductionLevelCount - 1);
                                            firstRowCell.formattedText = formattedTextCollection.length > 2 ? formattedTextCollection
                                                .slice(0, formattedTextCollection.length - 1).join(' ') : formattedTextCollection[0];
                                            firstRowCell.hasChild = true;
                                            break;
                                        } else {
                                            indexCount = indexCount - (finalReductionLevel - 1);
                                            firstRowCell.formattedText = formattedTextCollection.length > 2 ? formattedTextCollection
                                                .slice(0, formattedTextCollection.length - 1).join(' ') : formattedTextCollection[0];
                                            firstRowCell.hasChild = true;
                                            break;
                                        }
                                    } else {
                                        if (this.headerColl[indexCount as number][k as number] && valueSort[valueSortIndex as number] !==
                                            this.headerColl[indexCount as number][k as number].name) {
                                            indexCount++;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (!firstRowCell.isSum) {
                                reductionLevel++;
                                reductionLevelCount++;
                                finalReductionLevel++;
                            }
                            if (!this.parent.dataSourceSettings.expandAll) {
                                firstRowCell.isDrilled = drillMem ? true : false;
                            } else {
                                firstRowCell.isDrilled = drillMem ? false : true;
                            }
                        } else {
                            if (!(prevLevel === undefined || prevLevel < currrentLevel)) {
                                indexCount++;
                            }
                        }
                        prevLevel = currrentLevel;
                    }
                    this.maxLevel = currrentLevel > this.maxLevel ? currrentLevel : this.maxLevel;
                    const name: string = this.parent.dataType === 'olap' ? firstRowCell.formattedText :
                        (firstRowCell.actualText ? firstRowCell.actualText.toString() : firstRowCell.formattedText.toString());
                    const values: IFieldListOptions = this.engineModule.fieldList[this.currentMeasure] as IFieldListOptions;
                    const text: string = this.parent.dataSourceSettings.rows.length === 0 ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values.aggregateType as string) + ' ' +
                        this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values.caption) ? values.caption : values.name) : firstRowCell.formattedText ? firstRowCell.formattedText.toString() : name;
                    const caption: string = (firstRowCell.hasChild && !firstRowCell.isNamedSet) ?
                        ((firstRowCell.isDrilled ? ' - ' : ' + ') + text) : text;
                    const levelName: string = tupInfo ? tupInfo.uNameCollection : firstRowCell.valueSort.levelName.toString();
                    const cellInfo: ChartLabelInfo = {
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
                        if (this.headerColl[indexCount as number]) {
                            this.headerColl[indexCount as number][currrentLevel as number] = cellInfo;
                        } else {
                            this.headerColl[indexCount as number] = {};
                            this.headerColl[indexCount as number][currrentLevel as number] = cellInfo;
                        }
                        if (this.parent.gridSettings.layout === 'Tabular') {
                            if (firstRowCell.isSum) {
                                if (firstRowCell.level > 0) {
                                    indexCount = indexCount + (firstRowCell.level === this.parent.engineModule.rowMaxLevel - 1 ?
                                        reductionLevel - 1 : reductionLevelCount - 1);
                                } else {
                                    indexCount = indexCount + (finalReductionLevel - 1);
                                }
                            }
                            if (firstRowCell.level === 0) {
                                reductionLevelCount = 0;
                                reductionLevel = 0;
                                finalReductionLevel = 0;
                            } else if (firstRowCell.level === this.parent.engineModule.rowMaxLevel - 1) {
                                reductionLevel = 0;
                            } else if (firstRowCell.level < this.parent.engineModule.rowMaxLevel - 1 && firstRowCell.level !== 0) {
                                reductionLevelCount = 0;
                            }
                        }
                    }
                    const rows: IPivotRows = pivotValues[rowIndex as number];
                    const cKeys: string[] = Object.keys(rows);
                    let prevMemberCell: IAxisSet;
                    if (this.parent.dataType === 'olap') {
                        memberCell = firstRowCell.memberType !== 3 ? firstRowCell : memberCell;
                    } else {
                        memberCell = firstRowCell.type !== 'value' ? firstRowCell : memberCell;
                        if (firstRowCell.type !== 'value') {
                            memberCell = firstRowCell;
                        } else {
                            const valueSort: string[] = firstRowCell && firstRowCell.valueSort && firstRowCell.valueSort.levelName &&
                                firstRowCell.valueSort.levelName.toString().split(delimiter);
                            let levelName: string;
                            if (valueSort && valueSort.length > 0) {
                                valueSort.splice(valueSort.length - 1, 1);
                                levelName = valueSort.join(delimiter);
                            }
                            if ((this.parent.dataSourceSettings.valueIndex <= 0 || (this.engineModule as PivotEngine).valueAxis &&
                                this.dataSourceSettings.rows.length === (this.engineModule as PivotEngine).measureIndex) ||
                                isNullOrUndefined(memberCell.valueSort) || (levelName === memberCell.valueSort.levelName)) {
                                memberCell = memberCell as IAxisSet;
                            } else {
                                let prevIndex: number = rowIndex;
                                while (prevIndex > -1) {
                                    if (pivotValues[prevIndex as number] && pivotValues[prevIndex as number][0] &&
                                        (pivotValues[prevIndex as number][0] as IAxisSet).valueSort &&
                                        (pivotValues[prevIndex as number][0] as IAxisSet).valueSort.levelName === levelName) {
                                        memberCell = pivotValues[prevIndex as number][0] as IAxisSet;
                                        prevIndex = 0;
                                    }
                                    prevIndex--;
                                }
                            }
                        }
                    }
                    for (let f: number = this.parent.gridSettings.layout === 'Tabular' ? this.parent.engineModule.rowMaxLevel : 0; f < cKeys.length; f++) {
                        const cKey: string = cKeys[f as number];
                        const cellIndex: number = Number(cKey);
                        const cell: IAxisSet = pivotValues[rowIndex as number][cellIndex as number] as IAxisSet;
                        const measureAllow: boolean = isNullOrUndefined(cell.rowHeaders) ? this.dataSourceSettings.rows.length === 0 : true;
                        const actualText: string | number = (this.parent.dataType === 'olap' && tupInfo && tupInfo.measureName) ?
                            tupInfo.measureName : cell.actualText;
                        if (!(this.parent.dataType === 'olap' && cell.isGrandSum) && !totColIndex[cell.colIndex] && cell.axis === 'value' && firstRowCell.type !== 'header' &&
                            actualText !== '' && ((chartSettings.enableMultipleAxis && this.accumulationType.indexOf(chartSettings.chartSeries.type) < 0 && this.chartSettings.chartSeries.type !== 'Pareto') ? true : actualText === this.currentMeasure)) {
                            if (isNullOrUndefined(firstRowCell.members)) {
                                firstRowCell.members = [];
                            }
                            if (this.parent.dataType === 'olap' ? ((lastHierarchy === firstRowCell.hierarchy || isDrill) ?
                                ((firstRowCell.memberType === 3 && prevMemberCell) ?
                                    (fieldPos === this.measurePos ? (prevMemberCell.isDrilled && prevMemberCell.hasChild) : true) :
                                    (firstRowCell.isDrilled && firstRowCell.hasChild)) : true)
                                : (((firstRowCell.type === 'value' && prevMemberCell) ?
                                    (!isNullOrUndefined(prevMemberCell.members) && prevMemberCell.hasChild &&
                                    prevMemberCell.isDrilled) : firstRowCell.hasChild && firstRowCell.isDrilled) ||
                                    !measureAllow)) {
                                break;
                            }
                            if (this.parent.dataType === 'olap' && cell.isSum === true && this.parent.dataSourceSettings.valueAxis === 'row') {
                                continue;
                            }
                            let colHeaders: string = '';
                            if (this.parent.dataType === 'olap') {
                                colHeaders = cell.columnHeaders.toString().split(/~~|::/).join(' - ');
                            } else {
                                const values: string[] = cell.columnHeaders.toString().split(delimiter);
                                colHeaders = PivotUtil.formatChartHeaders(values, this, true, cell);
                            }
                            let rowHeaders: string = '';
                            if (this.parent.dataType === 'olap') {
                                rowHeaders = cell.rowHeaders.toString().split(/~~|::/).join(' - ');
                            } else {
                                const values: string[] = cell.rowHeaders.toString().split(delimiter);
                                rowHeaders = PivotUtil.formatChartHeaders(values, this, false, cell);
                            }
                            const columnSeries: string = colHeaders + ' | ' + actualText;
                            this.chartSeriesInfo[colHeaders as string] = { uniqueName: colHeaders, caption: cell.hierarchyName && cell.hierarchyName.toString().split(delimiter).join(' - '), colorIndex: [] };
                            this.chartSeriesInfo[this.chartSeriesInfo[colHeaders as string].caption] =
                            this.chartSeriesInfo[colHeaders as string];
                            let yValue: number = (this.parent.dataType === 'pivot' ? (this.engineModule.aggregatedValueMatrix[rowIndex as number] &&
                                !isNullOrUndefined(this.engineModule.aggregatedValueMatrix[rowIndex as number][cellIndex as number])) ?
                                Number(this.engineModule.aggregatedValueMatrix[rowIndex as number][cellIndex as number]) :
                                (!isNullOrUndefined(cell.value) ? Number(cell.value) : cell.value) : (!isNullOrUndefined(cell.value)
                                ? Number(cell.value) : cell.value));
                            yValue = yValue === Infinity ? null : yValue;
                            if (yValue === 0) {
                                this.accEmptyPoint = true;
                            }
                            if (this.columnGroupObject[columnSeries as string]) {
                                this.columnGroupObject[columnSeries as string].push({
                                    x: this.dataSourceSettings.rows.length === 0 ? firstRowCell.formattedText : rowHeaders,
                                    y: yValue,
                                    rIndex: rowIndex,
                                    cIndex: cellIndex
                                });
                            } else {
                                this.columnGroupObject[columnSeries as string] = [{
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
     *
     * @returns {void}
     * @hidden
     */
    public refreshChart(): void {
        this.chartSeries = [];
        let prevColorIndex: number = 0;
        const chartSeriesInfo: { [key: string]: { name?: string, color?: string } } = {};
        const columnKeys: string[] = Object.keys(this.columnGroupObject);
        this.persistSettings = JSON.parse(this.parent.getChartSettings()).chartSettings;
        const seriesColors: string[] = this.persistSettings.palettes && this.persistSettings.palettes.length > 0
            ? this.persistSettings.palettes : getSeriesColor(this.chartSettings.theme);
        const delimiter: string = (this.parent as PivotView).chartSettings.columnDelimiter ? (this.parent as PivotView).chartSettings.columnDelimiter : '-';
        const columnHeader: string = ((this.parent as PivotView).chartSettings.columnHeader && (this.parent as PivotView).chartSettings.columnHeader !== '') ?
            (this.parent as PivotView).chartSettings.columnHeader.split(delimiter).join(' - ') : '';
        const chartType: ChartSeriesType = this.chartSettings.chartSeries ? this.chartSettings.chartSeries.type : undefined;
        const fieldWithCaption: { [key: string]: string } = {};
        for (let i: number = 0; i < this.parent.dataSourceSettings.values.length; i++) {
            fieldWithCaption[this.parent.dataSourceSettings.values[i as number].name] =
            !isNullOrUndefined(this.parent.dataSourceSettings.values[i as number].caption) ?
                this.parent.dataSourceSettings.values[i as number].caption : undefined;
        }
        if (this.accumulationType.indexOf(chartType) > -1 && columnKeys.length > 0) {
            this.currentColumn = (columnKeys.indexOf(columnHeader + ' | ' + this.currentMeasure) > -1 && columnHeader !== undefined) ? columnHeader + ' | ' + this.currentMeasure : columnKeys[0];
            let currentSeries: AccumulationSeriesModel = {};
            currentSeries = this.persistSettings.chartSeries ? this.frameChartSeries(this.persistSettings.chartSeries as {
                [key: string]: Object
            }) as AccumulationSeriesModel : currentSeries;
            if ((isNullOrUndefined(currentSeries.palettes) || currentSeries.palettes.length === 0) &&
            !isNullOrUndefined(this.persistSettings.palettes) && this.persistSettings.palettes.length > 0) {
                currentSeries.palettes = this.persistSettings.palettes;
            }
            currentSeries.dataSource = this.columnGroupObject[this.currentColumn];
            currentSeries.xName = 'x';
            currentSeries.yName = 'y';
            if (this.persistSettings.chartSeries && this.persistSettings.chartSeries.dataLabel) {
                currentSeries.dataLabel = this.persistSettings.chartSeries.dataLabel as AccumulationDataLabelSettingsModel;
                currentSeries.dataLabel.name = 'x';
            } else {
                currentSeries.dataLabel = { visible: true, position: 'Outside', name: 'x' };
                this.parent.setProperties({ chartSettings: { chartSeries: { dataLabel: { visible: true, position: 'Outside' } } } }, true);
            }
            if (this.accEmptyPoint && currentSeries.emptyPointSettings) {
                currentSeries.emptyPointSettings.mode = 'Zero';
            } else if (this.accEmptyPoint) {
                currentSeries.emptyPointSettings = { mode: 'Zero' };
            }
            currentSeries.name = this.currentColumn;
            if (chartType === 'Doughnut') {
                currentSeries.type = 'Pie';
                currentSeries.innerRadius = this.chartSettings.chartSeries.innerRadius ? this.chartSettings.chartSeries.innerRadius : '40%';
            } else if (chartType === 'Pie') {
                currentSeries.innerRadius = this.chartSettings.chartSeries.innerRadius ? this.chartSettings.chartSeries.innerRadius : '0';
            }
            this.chartSeries = (this.chartSeries as AccumulationSeriesModel[]).concat(currentSeries);
        } else {
            for (const key of columnKeys) {
                let currentSeries: SeriesModel = {};
                currentSeries = this.persistSettings.chartSeries ? this.frameChartSeries(this.persistSettings.chartSeries as {
                    [key: string]: Object
                }) as SeriesModel : currentSeries;
                if (!isNullOrUndefined((currentSeries as PivotSeriesModel).palettes) &&
                    (currentSeries as PivotSeriesModel).palettes.length > 0 && (isNullOrUndefined(this.persistSettings.palettes) ||
                        this.persistSettings.palettes.length === 0)) {
                    this.chartSettings.palettes = (currentSeries as PivotSeriesModel).palettes;
                }
                for (let i: number = 0; i < this.columnGroupObject[key as string].length; i++) {
                    const values: IFieldListOptions = this.engineModule.fieldList[this.currentMeasure] as IFieldListOptions;
                    this.columnGroupObject[key as string][i as number].x = (this.parent.dataSourceSettings.rows.length === 0 && !this.chartSettings.showMultiLevelLabels) ? this.parent.localeObj.getConstant('total') + ' ' + this.parent.localeObj.getConstant(values.aggregateType as string) + ' ' +
                        this.parent.localeObj.getConstant('of') + ' ' + (!isNullOrUndefined(values.caption) ? values.caption : values.name) : this.columnGroupObject[key as string][i as number].x === '' ? this.parent.localeObj.getConstant('blank') : this.columnGroupObject[key as string][i as number].x;
                }
                currentSeries.dataSource = this.columnGroupObject[key as string];
                currentSeries.xName = 'x';
                currentSeries.yName = 'y';
                currentSeries.visible = true;
                let multiAxisKey: string;
                let fieldName : string;
                let currentSeriesName: string;
                for (let i: number = 0, j: string[] = key.split(' | '); i < j.length; i++) {
                    if (this.measuresNames && this.measuresNames[j[i as number] as string]) {
                        fieldName = j[i as number];
                        currentSeriesName = key.split((' | ' + fieldName))[0];
                    }
                }
                if (this.chartSettings.enableMultipleAxis) {
                    let fieldCaptionName: string = fieldName;
                    fieldCaptionName = !isNullOrUndefined(fieldWithCaption[fieldCaptionName as string]) ?
                        fieldWithCaption[fieldCaptionName as string] : fieldCaptionName;
                    multiAxisKey = currentSeriesName + ' | ' + fieldCaptionName;
                }
                currentSeries.name = this.chartSettings.enableMultipleAxis ? multiAxisKey : currentSeriesName;
                if (this.chartSettings.showPointColorByMembers && this.chartSettings.enableMultipleAxis) {
                    currentSeries.name = currentSeriesName;
                    const seriesName: string = this.chartSeriesInfo[currentSeries.name].caption;
                    currentSeries.name = seriesName !== undefined && seriesName !== null ? seriesName : currentSeries.name;
                    if (!chartSeriesInfo[currentSeries.name]) {
                        prevColorIndex = seriesColors[prevColorIndex as number] ? prevColorIndex : 0;
                        chartSeriesInfo[currentSeries.name] = { name: currentSeries.name, color: seriesColors[prevColorIndex as number] };
                        currentSeries.fill = seriesColors[prevColorIndex++];
                        this.chartSeriesInfo[currentSeries.name].colorIndex.push(this.selectedLegend++);
                    }
                    else {
                        currentSeries.fill = chartSeriesInfo[currentSeries.name].color;
                        this.chartSeriesInfo[currentSeries.name].colorIndex.push(this.selectedLegend++);
                        currentSeries.name = undefined;
                    }
                }
                if (['Radar', 'Polar'].indexOf(chartType) < 0) {
                    const measure: string = fieldName;
                    (currentSeries as SeriesModel).tooltipMappingName = this.measuresNames[measure as string];
                    (currentSeries as SeriesModel).yAxisName = (this.chartSettings.enableMultipleAxis && this.chartSettings.multipleAxisMode === 'Combined') ?
                        this.measureList.join('_') : this.measuresNames[measure as string] ? this.measuresNames[measure as string] : measure;
                }
                if (this.persistSettings.chartSeries && this.persistSettings.chartSeries.emptyPointSettings) {
                    currentSeries.emptyPointSettings = this.persistSettings.chartSeries.emptyPointSettings;
                }
                if (!currentSeries.emptyPointSettings) {
                    currentSeries.emptyPointSettings = { mode: 'Zero' };
                }
                this.chartSeries = (this.chartSeries as SeriesModel[]).concat(currentSeries);
            }
        }
        const seriesEvent: ChartSeriesCreatedEventArgs = { series: this.chartSeries as SeriesModel[], cancel: false };
        const pivotChart: PivotChart = this as PivotChart;
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

    private frameObjectWithKeys(series: { [key: string]: Object }): SeriesModel | AxisModel {
        const keys: string[] = Object.keys(series);
        let keyPos: number = 0;
        const framedSeries: { [key: string]: Object } = {};
        while (keyPos < keys.length) {
            framedSeries[keys[keyPos as number]] = series[keys[keyPos as number]];
            keyPos++;
        }
        return framedSeries;
    }

    private frameChartSeries(series: { [key: string]: Object }): SeriesModel | AccumulationSeriesModel {
        const keys: string[] = Object.keys(series);
        let keyPos: number = 0;
        const framedSeries: { [key: string]: Object } = {};
        while (keyPos < keys.length) {
            if ((this.accumulationType.indexOf(this.parent.chartSettings.chartSeries.type) > -1 && ['fill', 'dashArray', 'width', 'segmentAxis',
                'drawType', 'isClosed', 'segments', 'stackingGroup', 'marker', 'errorBar', 'trendlines', 'minRadius',
                'splineType', 'maxRadius', 'cardinalSplineTension', 'columnWidth', 'columnSpacing', 'cornerRadius'].indexOf(keys[keyPos as number]) > -1) ||
                (this.accumulationType.indexOf(this.parent.chartSettings.chartSeries.type) < 0 && ['endAngle', 'explode', 'explodeAll', 'explodeIndex',
                    'explodeOffset', 'gapRatio', 'groupMode', 'groupTo', 'neckHeight', 'neckWidth', 'pyramidMode', 'startAngle',
                    'dataLabel', 'innerRadius'].indexOf(keys[keyPos as number]) > -1)) {
                keyPos++;
                continue;
            }
            framedSeries[keys[keyPos as number]] = series[keys[keyPos as number]];
            keyPos++;
        }
        return framedSeries;
    }

    private bindChart(): void {
        this.parent.showWaitingPopup();
        const currentXAxis: AxisModel = this.configXAxis();
        const currentTooltipSettings: TooltipSettingsModel = this.configTooltipSettings();
        const currentLegendSettings: LegendSettingsModel = this.configLegendSettings();
        const currentZoomSettings: ZoomSettingsModel = this.configZoomSettings();
        const axesWithRows: { axes: AxisModel[], rows: RowModel[], columns: ColumnModel[] } = this.frameAxesWithRows();
        const type: ChartSeriesType = this.chartSettings.chartSeries.type;
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
        if (!this.chartElement && this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis && this.chartSettings.chartSeries.type !== 'Pareto') {
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).innerHTML = '';
            this.chartElement = (this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART).appendChild(createElement('div', {
                className: cls.PIVOTCHART_INNER, id: this.parent.element.id + '_chartInner'
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
        const height: string | number = this.getChartHeight();
        if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis &&
            this.accumulationType.indexOf(type) < 0 && this.chartSettings.chartSeries.type !== 'Pareto') {
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.height =
                (height === 'auto' ? this.getChartAutoHeight() : height) + 'px';
            ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.width = width + 'px';
            if (this.parent.chartSettings.chartSeries.type !== 'Polar' && this.parent.chartSettings.chartSeries.type !== 'Radar') {
                ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'auto';
                ((this.parent.element as HTMLElement).querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflowX = 'hidden';
            }
        }
        if (this.parent.chart && ((this.parent.chart.getModuleName() === 'accumulationchart' &&
            this.accumulationType.indexOf(type) < 0) || (this.parent.chart.getModuleName() === 'chart' &&
                this.accumulationType.indexOf(type) > -1 && this.chartSettings.chartSeries.type !== 'Pareto'))) {
            this.parent.chart.destroy();
            if (select('#' + this.parent.element.id + '_chart', this.parent.element)) {
                select('#' + this.parent.element.id + '_chart', this.parent.element).innerHTML = '';
                select('#' + this.parent.element.id + '_chart', this.parent.element).appendChild(createElement('div', {
                    className: cls.PIVOTCHART_INNER, id: this.parent.element.id + '_chartInner'
                }));
            }
        }
        if (!(this.parent.chart && this.parent.chart.element && this.parent.element.querySelector('.e-chart') || this.parent.element.querySelector('.e-accumulationchart')) ||
            (this.parent.toolbarModule && this.parent.toolbarModule.isMultiAxisChange)) {
            if (this.parent.toolbarModule && this.parent.toolbarModule.isMultiAxisChange && this.parent.chart) {
                if (!this.parent.chart.isDestroyed) {
                    this.parent.chart.destroy();
                }
                this.parent.chart = undefined;
                select('#' + this.parent.element.id + '_chart', this.parent.element).innerHTML = '';
                select('#' + this.parent.element.id + '_chart', this.parent.element).appendChild(createElement('div', {
                    className: cls.PIVOTCHART_INNER, id: this.parent.element.id + '_chartInner'
                }));
                this.parent.toolbarModule.isMultiAxisChange = false;
            }
            Chart.Inject(
                ColumnSeries, StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries, BubbleSeries,
                LineSeries, StepLineSeries, SplineSeries, SplineAreaSeries, MultiColoredLineSeries, PolarSeries, RadarSeries,
                AreaSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries, StackingLineSeries, MultiColoredAreaSeries, ParetoSeries,
                Legend, Tooltip, Category, MultiLevelLabel, ScrollBar, Zoom, Export, Crosshair, Selection, StripLine, DataLabel);
            AccumulationChart.Inject(
                PieSeries, FunnelSeries, PyramidSeries, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip, Export
            );
            if (this.accumulationType.indexOf(type) > -1) {
                this.parent.chart = new AccumulationChart(
                    {
                        series: this.chartSeries.length > 0 ? this.chartSeries as AccumulationSeriesModel[] : [{}],
                        legendSettings: currentLegendSettings,
                        tooltip: currentTooltipSettings,
                        width: width,
                        height: height.toString(),
                        title: this.chartSettings.title,
                        enableSmartLabels: this.chartSettings.enableSmartLabels,
                        center: this.chartSettings.pieCenter,
                        enableBorderOnMouseMove: this.chartSettings.enableBorderOnMouseMove,
                        highlightMode: this.chartSettings.highlightMode,
                        highlightPattern: this.chartSettings.highlightPattern,
                        titleStyle: this.chartSettings.titleStyle,
                        subTitle: this.chartSettings.subTitle,
                        subTitleStyle: this.chartSettings.subTitleStyle,
                        margin: this.chartSettings.margin,
                        border: this.chartSettings.border,
                        background: this.chartSettings.background,
                        theme: this.chartSettings.theme,
                        selectionMode: this.chartSettings.accumulationSelectionMode,
                        isMultiSelect: this.chartSettings.isMultiSelect,
                        enableExport: this.parent.allowPdfExport,
                        selectedDataIndexes: this.chartSettings.selectedDataIndexes,
                        enableAnimation: this.chartSettings.enableAnimation,
                        useGroupingSeparator: this.chartSettings.useGroupingSeparator,
                        locale: this.parent.locale,
                        enableRtl: this.parent.enableRtl,
                        beforePrint: this.beforePrint.bind(this),
                        animationComplete: this.animationComplete.bind(this),
                        legendRender: this.legendRender.bind(this),
                        textRender: this.textRender.bind(this),
                        pointRender: this.pointRender.bind(this),
                        seriesRender: this.seriesRender.bind(this),
                        chartMouseMove: this.chartMouseMove.bind(this),
                        chartMouseClick: this.chartMouseClick.bind(this),
                        pointMove: this.pointMove.bind(this),
                        pointClick: this.pointClick.bind(this),
                        chartMouseLeave: this.chartMouseLeave.bind(this),
                        chartMouseDown: this.chartMouseDown.bind(this),
                        chartMouseUp: this.chartMouseUp.bind(this),
                        tooltipRender: this.tooltipRender.bind(this),
                        loaded: this.loaded.bind(this),
                        load: this.load.bind(this),
                        resized: this.resized.bind(this)
                    });
            } else {
                this.parent.chart = new Chart(
                    {
                        series: this.chartSeries.length > 0 ? this.chartSeries as SeriesModel[] : [{}],
                        legendSettings: currentLegendSettings,
                        tooltip: currentTooltipSettings,
                        zoomSettings: currentZoomSettings,
                        axes: (type === 'Polar' || type === 'Radar') ? [] : axesWithRows.axes,
                        rows: (type === 'Polar' || type === 'Radar') ? [{}] :
                            (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' || type === 'Pareto' &&
                                this.chartSettings.enableMultipleAxis) ? [{ height: '100%' }] : axesWithRows.rows,
                        columns: (type === 'Polar' || type === 'Radar') ? [{}] :
                            (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' &&
                                this.chartSettings.enableMultipleAxis) ? axesWithRows.columns : [{ width: '100%' }],
                        primaryYAxis: (type === 'Polar' || type === 'Radar') ? axesWithRows.axes[0] : { visible: false },
                        primaryXAxis: currentXAxis,
                        width: width,
                        height: (this.parent.chartSettings.chartSeries.type !== 'Polar' &&
                            this.parent.chartSettings.chartSeries.type !== 'Radar' && this.parent.chartSettings.enableScrollOnMultiAxis &&
                            this.parent.chartSettings.enableMultipleAxis && this.parent.chartSettings.chartSeries.type !== 'Pareto' && this.parent.dataSourceSettings.values.length > 0) ?
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
                        chartArea: !isNullOrUndefined(this.persistSettings.chartArea) ? this.persistSettings.chartArea :
                            this.chartSettings.chartArea,
                        palettes: this.chartSettings.palettes,
                        theme: this.chartSettings.theme,
                        crosshair: this.chartSettings.crosshair,
                        selectionMode: this.chartSettings.selectionMode,
                        isMultiSelect: this.chartSettings.isMultiSelect,
                        enableExport: this.parent.allowPdfExport,
                        selectedDataIndexes: this.chartSettings.selectedDataIndexes,
                        isTransposed: this.chartSettings.isTransposed,
                        enableAnimation: this.chartSettings.enableAnimation,
                        enableCanvas: this.chartSettings.enableCanvas,
                        useGroupingSeparator: this.chartSettings.useGroupingSeparator,
                        description: this.chartSettings.description,
                        tabIndex: this.chartSettings.tabIndex,
                        locale: this.parent.locale,
                        enableRtl: this.parent.enableRtl,
                        enableSideBySidePlacement: this.chartSettings.enableSideBySidePlacement,
                        beforePrint: this.beforePrint.bind(this),
                        animationComplete: this.animationComplete.bind(this),
                        legendRender: this.legendRender.bind(this),
                        textRender: this.textRender.bind(this),
                        pointRender: this.pointRender.bind(this),
                        seriesRender: this.seriesRender.bind(this),
                        chartMouseMove: this.chartMouseMove.bind(this),
                        chartMouseClick: this.chartMouseClick.bind(this),
                        pointMove: this.pointMove.bind(this),
                        pointClick: this.pointClick.bind(this),
                        chartMouseLeave: this.chartMouseLeave.bind(this),
                        chartMouseDown: this.chartMouseDown.bind(this),
                        chartMouseUp: this.chartMouseUp.bind(this),
                        dragComplete: this.dragComplete.bind(this),
                        zoomComplete: this.zoomComplete.bind(this),
                        scrollStart: this.scrollStart.bind(this),
                        scrollEnd: this.scrollEnd.bind(this),
                        scrollChanged: this.scrollChanged.bind(this),
                        tooltipRender: this.tooltipRender.bind(this),
                        legendClick: this.legendClick.bind(this),
                        loaded: this.loaded.bind(this),
                        load: this.load.bind(this),
                        resized: this.resized.bind(this),
                        axisLabelRender: this.axisLabelRender.bind(this),
                        multiLevelLabelClick: this.multiLevelLabelClick.bind(this),
                        axisMultiLabelRender: this.multiLevelLabelRender.bind(this)
                    });
            }
            this.parent.chart.isStringTemplate = true;
        } else {
            this.parent.chart.series = this.chartSeries;
            this.parent.chart.title = this.parent.chartSettings.title;
            this.parent.chart.subTitle = this.parent.chartSettings.subTitle;
            this.parent.chart.background = this.parent.chartSettings.background;
            this.parent.chart.theme = this.parent.chartSettings.theme;
            this.parent.chart.legendSettings = currentLegendSettings;
            this.parent.chart.selectionMode = this.parent.chartSettings.selectionMode;
            this.parent.chart.enableExport = this.parent.allowPdfExport;
            this.parent.chart.isMultiSelect = this.parent.chartSettings.isMultiSelect;
            this.parent.chart.enableAnimation = this.parent.chartSettings.enableAnimation;
            this.parent.chart.useGroupingSeparator = this.parent.chartSettings.useGroupingSeparator;
            this.parent.chart.highlightPattern = this.parent.chartSettings.highlightPattern;
            if (this.accumulationType.indexOf(type) > -1) {
                (this.parent.chart as AccumulationChart).enableBorderOnMouseMove = this.parent.chartSettings.enableBorderOnMouseMove;
                (this.parent.chart as AccumulationChart).highlightMode = this.parent.chartSettings.highlightMode;
                (this.parent.chart as AccumulationChart).enableSmartLabels = this.parent.chartSettings.enableSmartLabels;
            } else {
                (this.parent.chart as Chart).palettes = this.parent.chartSettings.palettes;
                (this.parent.chart as Chart).isTransposed = this.parent.chartSettings.isTransposed;
                (this.parent.chart as Chart).enableSideBySidePlacement = this.parent.chartSettings.enableSideBySidePlacement;
                (this.parent.chart as Chart).tabIndex = this.parent.chartSettings.tabIndex;
                (this.parent.chart as Chart).description = this.parent.chartSettings.description;
                (this.parent.chart as Chart).enableCanvas = this.parent.chartSettings.enableCanvas;
            }
            if (type === 'Polar' || type === 'Radar') {
                (this.parent.chart as Chart).primaryXAxis = currentXAxis;
                (this.parent.chart as Chart).primaryYAxis.visible = true;
                (this.parent.chart as Chart).primaryYAxis = axesWithRows.axes[0];
                (this.parent.chart as Chart).axes = [];
                (this.parent.chart as Chart).rows = [{}];
            } else if ((this.accumulationType.indexOf(type) < 0) && this.parent.chart.getModuleName() === 'chart') {
                (this.parent.chart as Chart).primaryYAxis.visible = false;
                (this.parent.chart as Chart).primaryXAxis = currentXAxis;
                (this.parent.chart as Chart).axes = axesWithRows.axes;
                if (type === 'Bar' || type === 'StackingBar' || type === 'StackingBar100' &&
                    this.chartSettings.enableMultipleAxis) {
                    (this.parent.chart as Chart).rows = [{ height: '100%' }];
                    (this.parent.chart as Chart).columns = axesWithRows.columns;
                } else if (type === 'Pareto' && this.chartSettings.enableMultipleAxis) {
                    (this.parent.chart as Chart).rows = [{ height: '100%' }];
                    (this.parent.chart as Chart).columns = [{ width: '100%' }];
                } else {
                    (this.parent.chart as Chart).rows = axesWithRows.rows;
                    (this.parent.chart as Chart).columns = [{ width: '100%' }];
                }
            }
            this.parent.chart.refresh();
            if ((this.accumulationType.indexOf(type) > -1) && this.parent.chart.getModuleName() === 'accumulationchart' && (this.parent.dataSourceSettings.rows.length === 0 || this.parent.dataSourceSettings.columns.length === 0)) {
                this.parent.hideWaitingPopup();
                if (this.parent.pivotFieldListModule) {
                    hideSpinner(this.parent.pivotFieldListModule.fieldListSpinnerElement as HTMLElement);
                }
            }
        }
        if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis) {
            this.parent.chart.appendTo(select('#' + this.parent.element.id + '_chartInner', this.parent.element) as HTMLElement);
        } else {
            this.parent.chart.appendTo(select('#' + this.parent.element.id + '_chart', this.parent.element) as HTMLElement);
        }
    }

    private legendClick(args: ILegendClickEventArgs): void {
        if (this.chartSettings.showPointColorByMembers && this.chartSettings.enableMultipleAxis) {
            const colorIndex: number[] = this.chartSeriesInfo[args.legendText].colorIndex;
            for (let i: number = 1; i < colorIndex.length; i++) {
                args.chart.series[colorIndex[i as number]].visible = !args.chart.series[colorIndex[i as number]].visible;
            }
        }
        this.parent.trigger(events.chartLegendClick, args);
    }

    private pointClick(args: IPointEventArgs): void {
        const dataSource: Object | DataManager = args.series.dataSource ? args.series.dataSource :
            this.parent.chart.series[args.seriesIndex].dataSource;
        if (((['Pie', 'Funnel', 'Doughnut', 'Pyramid', 'Radar', 'Polar'].indexOf(this.parent.chartSettings.chartSeries.type) > -1) ||
            !this.parent.chartSettings.showMultiLevelLabels) && (this.parent.dataType === 'olap' ? true :
            this.parent.dataSourceSettings.rows.length > 1)) {
            this.pivotIndex = {
                rIndex: dataSource ? (dataSource as { [key: string]: number }[])[args.pointIndex].rIndex : undefined,
                cIndex: dataSource ? (dataSource as { [key: string]: number }[])[args.pointIndex].cIndex : undefined
            };
            this.creatMenu();
            const pos: OffsetPosition = this.parent.element.getBoundingClientRect();
            const y: number = (this.parent.element.querySelector('.e-pivot-toolbar') ?
                this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 0) +
                (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                    this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 0) +
                (window.scrollY || document.documentElement.scrollTop) + pos.top;
            this.accumulationMenu.open(y + args.y, args.x + pos.left + (window.scrollX || document.documentElement.scrollLeft));
        } else if ((this.parent.allowDrillThrough || this.parent.editSettings.allowEditing) && this.parent.drillThroughModule) {
            const rIndex: number = (dataSource as { [key: string]: number }[])[args.pointIndex].rIndex;
            const cIndex: number = (dataSource as { [key: string]: number }[])[args.pointIndex].cIndex;
            this.parent.drillThroughModule.executeDrillThrough(
                this.parent.pivotValues[rIndex as number][cIndex as number] as IAxisSet, rIndex, cIndex);
        }
        this.parent.trigger(events.chartPointClick, args);
    }

    private frameAxesWithRows(): { axes: AxisModel[]; rows: RowModel[]; columns: ColumnModel[] } {
        let axes: AxisModel[] = [];
        let rows: RowModel[] = [];
        let columns: ColumnModel[] = [];
        const yAxisTitles: string[] = [];
        const percentChart: boolean = this.persistSettings.chartSeries && (
            this.persistSettings.chartSeries.type === 'StackingColumn100' ||
            this.persistSettings.chartSeries.type === 'StackingBar100' ||
            this.persistSettings.chartSeries.type === 'StackingArea100' ||
            this.persistSettings.chartSeries.type === 'StackingLine100');
        const percentAggregateTypes: SummaryTypes[] = ['PercentageOfGrandTotal', 'PercentageOfColumnTotal', 'PercentageOfRowTotal',
            'PercentageOfDifferenceFrom', 'PercentageOfParentRowTotal', 'PercentageOfParentColumnTotal', 'PercentageOfParentTotal'];
        if (this.chartSettings.enableMultipleAxis) {
            let valCnt: number = 0;
            const divider: string = (100 / this.dataSourceSettings.values.length) + '%';
            for (const item of this.dataSourceSettings.values) {
                const measureField: IField = this.engineModule.fieldList[item.name];
                const measureAggregatedName: string =
                    (this.parent.dataType === 'olap' ? '' : (this.parent.localeObj.getConstant(measureField.aggregateType) + ' ' +
                        this.parent.localeObj.getConstant('of') + ' ')) + measureField.caption;
                // let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((itm: IFormatSettings) => {
                //     return itm.name === item.name;
                // })[0];
                yAxisTitles.push(measureAggregatedName);
                let formatSetting: IFormatSettings;
                for (const field of this.dataSourceSettings.formatSettings) {
                    if (field.name === item.name) {
                        formatSetting = field;
                        break;
                    }
                }
                const format: string = PivotUtil.inArray(measureField.aggregateType, percentAggregateTypes) !== -1 ? 'P2' : (formatSetting ?
                    (formatSetting.format.toLowerCase().match(/n|p|c/) === null ? 'N' : formatSetting.format) :
                    this.parent.dataType === 'olap' ? this.getFormat(measureField.formatString) : 'N');
                const resFormat: boolean =
                    (this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar') ? true : false;
                let currentYAxis: AxisModel = {};
                currentYAxis = this.persistSettings.primaryYAxis ? this.frameObjectWithKeys(this.persistSettings.primaryYAxis as {
                    [key: string]: Object
                }) : currentYAxis;
                currentYAxis.labelFormat = currentYAxis.labelFormat ?
                    currentYAxis.labelFormat : (percentChart ? '' : (!resFormat ? format : 'N'));
                currentYAxis.title = currentYAxis.title ? currentYAxis.title :
                    (this.chartSettings.multipleAxisMode === 'Combined') ? yAxisTitles.join(' - ') : measureAggregatedName;
                currentYAxis.zoomFactor = isNullOrUndefined(this.chartSettings.primaryYAxis.zoomFactor) ? 1
                    : this.chartSettings.primaryYAxis.zoomFactor;
                currentYAxis.edgeLabelPlacement = this.chartSettings.primaryYAxis.edgeLabelPlacement ?
                    this.chartSettings.primaryYAxis.edgeLabelPlacement : this.persistSettings.primaryYAxis.edgeLabelPlacement;
                if (this.chartSettings.chartSeries.type === 'Bar' || this.chartSettings.chartSeries.type === 'StackingBar' ||
                    this.chartSettings.chartSeries.type === 'StackingBar100') {
                    currentYAxis.plotOffsetRight = currentYAxis.plotOffsetRight ? currentYAxis.plotOffsetRight : 30;
                }
                else {
                    currentYAxis.plotOffsetTop = currentYAxis.plotOffsetTop ? currentYAxis.plotOffsetTop : 30;
                }
                if (!resFormat) {
                    currentYAxis.name = (this.chartSettings.multipleAxisMode === 'Combined') ? this.measureList.join('_') :
                        this.measuresNames[item.name] ? this.measuresNames[item.name] : item.name;
                }
                axes = axes.concat(currentYAxis);
                if (this.chartSettings.multipleAxisMode === 'Combined') {
                    axes = [axes[axes.length - 1]];
                }
                if (this.chartSettings.multipleAxisMode === 'Stacked') {
                    currentYAxis.rowIndex = valCnt;
                    currentYAxis.columnIndex = valCnt;
                    rows.push({ height: divider });
                    columns.push({ width: divider });
                } else {
                    currentYAxis.rowIndex = 0;
                    currentYAxis.columnIndex = 0;
                    rows = [{ height: '100%' }];
                    columns = [{ width: '100%' }];
                }
                valCnt++;
            }
        } else {
            const measureField: IField = this.engineModule.fieldList[this.currentMeasure];
            const measureAggregatedName: string = (this.parent.dataType === 'olap' ? '' :
                (this.parent.localeObj.getConstant(measureField.aggregateType) + ' ' +
                    this.parent.localeObj.getConstant('of') + ' ')) + measureField.caption;
            // let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((item: IFormatSettings) => {
            //     return item.name === this.currentMeasure;
            // })[0];
            let formatSetting: IFormatSettings;
            for (const item of this.dataSourceSettings.formatSettings) {
                if (item.name === this.currentMeasure) {
                    formatSetting = item;
                    break;
                }
            }
            let lengthofFormat: number;
            if (formatSetting) {
                lengthofFormat = formatSetting.format.length;
            }
            let currentYAxis: AxisModel = {};
            const format: string = PivotUtil.inArray(measureField.aggregateType, percentAggregateTypes) !== -1 ? 'P2' : (formatSetting ?
                (((formatSetting.format.toLowerCase().match(/n[0-10]|p[0-10]|c[0-10]/) === null) || lengthofFormat > 3) ? 'N' : formatSetting.format) :
                this.parent.dataType === 'olap' ? this.getFormat(measureField.formatString) : 'N');
            currentYAxis = this.persistSettings.primaryYAxis ? this.frameObjectWithKeys(this.persistSettings.primaryYAxis as {
                [key: string]: Object
            }) : currentYAxis;
            currentYAxis.zoomFactor = isNullOrUndefined(this.chartSettings.primaryYAxis.zoomFactor) ? 1
                : this.chartSettings.primaryYAxis.zoomFactor;
            currentYAxis.rowIndex = 0;
            currentYAxis.columnIndex = 0;
            currentYAxis.edgeLabelPlacement = this.chartSettings.primaryYAxis.edgeLabelPlacement ?
                this.chartSettings.primaryYAxis.edgeLabelPlacement : this.persistSettings.primaryYAxis.edgeLabelPlacement;
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

    /** @hidden */

    public getColumnTotalIndex(pivotValues: IAxisSet[][]): INumberIndex {
        const colIndexColl: INumberIndex = {};
        const rKeys: string[] = Object.keys(pivotValues);
        for (const rowIndex of rKeys) {
            const rows: IPivotRows = pivotValues[Number(rowIndex)];
            let cKeys: string[];
            if (!isNullOrUndefined(rows)) {
                cKeys = Object.keys(rows);
                for (const cellIndex of cKeys) {
                    const cell: IAxisSet = rows[Number(cellIndex)] as IAxisSet;
                    if (!isNullOrUndefined(cell)) {
                        if (cell.axis !== 'column') {
                            return colIndexColl;
                        } else if ((cell.type === 'sum' || (this.dataSourceSettings && this.dataSourceSettings.columns &&
                            this.dataSourceSettings.columns.length === 0 ? false : cell.type === 'grand sum')) && cell.rowSpan !== -1) {
                            colIndexColl[cell.colIndex] = cell.colIndex;
                        }
                    }
                }
            }
        }
        return colIndexColl;
    }

    private groupHierarchyWithLevels(pivotValues: IAxisSet[], fieldPosition: string[]): { [key: string]: { start: number; end: number }} {
        const group: { [key: string]: { [key: string]: string } } = {};
        let fieldCount: number = 0;
        const levelPos: { [key: string]: { start: number; end: number } } = {};
        this.measurePos = (this.engineModule as OlapEngine).tupRowInfo[0].measurePosition;
        for (let rowPos: number = 0; rowPos < pivotValues.length; rowPos++) {
            const cell: IAxisSet = (pivotValues[rowPos as number] as IAxisSet[])[0];
            if (cell && cell.axis === 'row' && cell.type !== 'grand sum') {
                if (isNullOrUndefined(group[cell.hierarchy])) {
                    if (cell.memberType === 3) {
                        if (fieldCount === this.measurePos) {
                            fieldPosition[this.measurePos] = cell.hierarchy;
                            group[cell.hierarchy] = { [cell.levelUniqueName]: cell.levelUniqueName };
                        } else {
                            fieldCount--;
                        }
                    } else {
                        fieldPosition[fieldCount as number] = cell.hierarchy;
                        group[cell.hierarchy] = { [cell.levelUniqueName]: cell.levelUniqueName };
                    }
                    fieldCount++;
                } else {
                    group[cell.hierarchy][cell.levelUniqueName] = cell.levelUniqueName;
                }
            }
        }
        let lastEnd: number = -1;
        for (let pos: number = 0; pos < fieldPosition.length; pos++) {
            if (this.measurePos !== pos) {
                levelPos[fieldPosition[pos as number]] = {
                    start: (lastEnd + 1),
                    end: (lastEnd + Object.keys(group[fieldPosition[pos as number]]).length)
                };
                lastEnd = levelPos[fieldPosition[pos as number]].end;
            }
        }
        return levelPos;
    }

    private frameMultiLevelLabels(): MultiLevelLabelsModel[] {
        const startKeys: string[] = Object.keys(this.headerColl);
        let parentHeaders: RowHeaderLevelGrouping = this.headerColl[-0.5];
        for (const startKey of startKeys) {
            const sKey: number = Number(startKey);
            const headers: RowHeaderLevelGrouping = this.headerColl[sKey as number];
            let levelPos: number = 0;
            let isAvail: boolean = false;
            while (levelPos <= this.maxLevel) {
                if (!isAvail) {
                    if (!headers[levelPos as number]) {
                        headers[levelPos as number] = parentHeaders[levelPos as number];
                    } else {
                        isAvail = true;
                    }
                } else if (!headers[levelPos as number]) {
                    headers[levelPos as number] = {
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
                        span: -1
                    };
                    // headers[levelPos - 1].span = 0;
                }
                levelPos++;
            }
            parentHeaders = this.headerColl[sKey as number];
        }
        const gRows: {
            [key: string]: {
                start: number;
                end: number;
                text: string;
                type: string;
                customAttributes: object;
            }[]
        } = {};
        for (const startKey of startKeys) {
            const sKey: number = Number(startKey);
            const headers: RowHeaderLevelGrouping = this.headerColl[sKey as number];
            const lKeys: string[] = Object.keys(headers);
            for (const levelKey of lKeys) {
                const lKey: number = Number(levelKey);
                if (gRows[lKey as number]) {
                    const len: number = gRows[lKey as number].length;
                    if (headers[lKey as number].levelName === parentHeaders[lKey as number].levelName) {
                        gRows[lKey as number][len - 1].end = gRows[lKey as number][len - 1].end as number + 1;
                    } else {
                        gRows[lKey as number].push({
                            start: sKey, end: sKey + 1, text: headers[lKey as number].text,
                            type: (headers[lKey as number].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'),
                            customAttributes: headers[lKey as number]
                        });
                    }
                } else {
                    gRows[lKey as number] = [{
                        start: sKey, end: sKey + 1, text: headers[lKey as number].text,
                        type: (headers[lKey as number].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'),
                        customAttributes: headers[lKey as number]
                    }];
                }
            }
            parentHeaders = headers;
        }
        const levellength: number = Object.keys(gRows).length;
        const multiLevelLabels: MultiLevelLabelsModel[] = [];
        for (let level: number = levellength - 1; level > -1; level--) {
            multiLevelLabels.push({ categories: gRows[level as number] as MultiLevelCategoriesModel[], border: { width: 1 }, overflow: 'Trim' });
        }
        return multiLevelLabels;
    }
    private getZoomFactor(): number {
        this.calculatedWidth = this.getCalulatedWidth();
        const seriesLength: number = (this.chartSeries.length * 10) > 120 ? (this.chartSeries.length * 10) : 120;
        let zoomFactor: number = this.chartSeries.length > 0 ?
            (this.calculatedWidth / (Object.keys(this.chartSeries[0].dataSource).length * seriesLength)) : 1;
        zoomFactor = (zoomFactor < 1 && zoomFactor > 0) ? zoomFactor : 1;
        return zoomFactor;
    }

    /** @hidden */

    public getCalulatedWidth(): number {
        if (!isNaN(Number(this.parent.width))) {
            this.calculatedWidth = Number(this.parent.width);
        } else if ((this.parent.width as string).indexOf('%') > -1) {
            this.calculatedWidth = this.parent.element.clientWidth * (parseFloat(this.parent.width as string) / 100);
        } else if ((this.parent.width as string).indexOf('px') > -1) {
            this.calculatedWidth = Number(this.parent.width.toString().split('px')[0]);
        } else {
            this.calculatedWidth = this.parent.element.clientWidth;
        }
        return this.calculatedWidth;
    }

    private configTooltipSettings(): TooltipSettingsModel {
        const tooltip: TooltipSettingsModel = this.persistSettings.tooltip ? this.persistSettings.tooltip :
            this.chartSettings.tooltip;
        tooltip.enable = tooltip.enable === undefined ? true : tooltip.enable;
        if (tooltip.enable && tooltip.template) {
            this.templateFn = this.parent.templateParser(tooltip.template);
        }
        if (this.parent.tooltipTemplate) {
            tooltip.template = tooltip.template ? tooltip.template : this.parent.tooltipTemplate;
        }
        tooltip.header = tooltip.header ? tooltip.header : '';
        tooltip.enableMarker = tooltip.enableMarker === undefined ? true : tooltip.enableMarker;
        return tooltip;
    }

    private configLegendSettings(): LegendSettingsModel {
        const legendSettings: { [key: string]: Object } = {};
        if (this.chartSettings.legendSettings) {
            let keyPos: number = 0;
            const keys: string[] = Object.keys(this.chartSettings.legendSettings);
            while (keyPos < keys.length) {
                legendSettings[keys[keyPos as number]] = (this.chartSettings.legendSettings as {
                    [key: string]: Object
                })[keys[keyPos as number]];
                keyPos++;
            }
        }
        legendSettings.visible = legendSettings.visible !== false;
        legendSettings.padding = legendSettings.padding ? legendSettings.padding : 25;
        legendSettings.shapePadding = legendSettings.shapePadding ? legendSettings.shapePadding : 10;
        return legendSettings;
    }

    private configXAxis(): AxisModel {
        let currentXAxis: AxisModel = {};
        currentXAxis = this.persistSettings.primaryXAxis ? this.frameObjectWithKeys(this.persistSettings.primaryXAxis as {
            [key: string]: Object
        }) : currentXAxis;
        currentXAxis.valueType = 'Category';
        currentXAxis.labelIntersectAction = currentXAxis.labelIntersectAction ? currentXAxis.labelIntersectAction : 'Rotate45';
        currentXAxis.title = currentXAxis.title ? currentXAxis.title :
            this.dataSourceSettings.rows.map((args: IFieldOptions) => {
                return args.caption || args.name;
            }).join(' / ');
        currentXAxis.zoomFactor = isNullOrUndefined(this.parent.chartSettings.primaryXAxis.zoomFactor) ? this.getZoomFactor()
            : this.parent.chartSettings.primaryXAxis.zoomFactor;
        if (!this.parent.chartSettings.zoomSettings.enableScrollbar) {
            currentXAxis.zoomFactor = 1;
        }
        if (this.chartSettings.showMultiLevelLabels && this.chartSettings.chartSeries.type !== 'Pareto') {
            currentXAxis.multiLevelLabels = this.frameMultiLevelLabels();
            currentXAxis.border = { width: 1, type: 'WithoutTopandBottomBorder' };
            currentXAxis.majorTickLines = { width: 0, height: -10 };
        } else {
            currentXAxis.multiLevelLabels = [];
            currentXAxis.border = { width: 1, type: 'Rectangle' };
            currentXAxis.majorTickLines = { width: 0, height: 5 };
        }
        return currentXAxis;
    }

    private configZoomSettings(): ZoomSettingsModel {
        const zoomSettings: ZoomSettingsModel = this.chartSettings.zoomSettings;
        zoomSettings.enableSelectionZooming = zoomSettings.enableSelectionZooming === undefined ? true :
            zoomSettings.enableSelectionZooming;
        zoomSettings.enableScrollbar = zoomSettings.enableScrollbar === undefined ? true : zoomSettings.enableScrollbar;
        return zoomSettings;
    }

    private tooltipRender(args: ITooltipRenderEventArgs): void {
        const measure: string = (this.chartSettings.enableMultipleAxis && this.chartSettings.multipleAxisMode === 'Combined' &&
            this.accumulationType.indexOf(this.chartSettings.chartSeries.type) < 0 && this.chartSettings.chartSeries.type !== 'Radar' &&
            this.chartSettings.chartSeries.type !== 'Polar') ? (args.series as Series).tooltipMappingName :
            (args.series as Series).yAxisName ? ((args.series as Series).yAxisName.split('_CumulativeAxis')[0]) :
                ((this.chartSettings.enableMultipleAxis && this.accumulationType.indexOf(this.chartSettings.chartSeries.type) < 0 &&
                    this.chartSettings.chartSeries.type !== 'Pareto') ? args.series.name ? args.series.name.split(' | ')[1] :
                        args.data.seriesName ? args.data.seriesName.split(' | ')[1] : this.currentMeasure : this.measuresNames[this.currentMeasure] ?
                        this.measuresNames[this.currentMeasure] : this.currentMeasure);
        const dataSource: Object | DataManager = args.series.dataSource ? args.series.dataSource
            : this.parent.chart.series[args.data.seriesIndex].dataSource;
        const rowIndex: number = dataSource ? (dataSource as { [key: string]: number }[])[args.data.pointIndex].rIndex : undefined;
        const colIndex: number = dataSource ? (dataSource as { [key: string]: number }[])[args.data.pointIndex].cIndex : undefined;
        const measureField: IField = this.engineModule.fieldList[this.measuresNames[measure as string]
            ? this.measuresNames[measure as string] : measure];
        const aggregateType: string = this.parent.dataType === 'olap' ? '' : this.parent.localeObj.getConstant(measureField.aggregateType);
        const measureAggregatedName: string = (this.parent.dataType === 'olap' ? '' : aggregateType + ' ' +
            this.parent.localeObj.getConstant('of') + ' ') + measureField.caption;
        const formattedText: string = (this.engineModule.pivotValues[rowIndex as number][colIndex as number] as IAxisSet).formattedText;
        const formatField: IField = this.engineModule.formatFields[measureField.id];
        const valueFormat: string | IAxisSet = this.engineModule.getFormattedValue(args.point.y as number, measureField.id, formattedText);
        const formattedValue: string = (formatField && formatField.format && formatField.format.toLowerCase().match(/n|p|c/) !== null &&
            this.chartSettings.useGroupingSeparator) ? this.parent.dataType === 'olap' ?
                valueFormat.toString() : (valueFormat as IAxisSet).formattedText :
            formattedText;
        const cell: IAxisSet = this.parent.pivotValues[rowIndex as number][colIndex as number];
        let text: string | number | Date = cell.columnHeaders;
        let columnText: string = '';
        if (isNullOrUndefined(text)) {
            columnText = undefined;
        } else if (this.parent.dataType === 'olap') {
            columnText = this.chartSeriesInfo[text.toString().split(/~~|::/).join(' - ')].uniqueName;
        } else {
            const values: string[] = text.toString().split(this.parent.dataSourceSettings.valueSortSettings.headerDelimiter);
            text = PivotUtil.formatChartHeaders(values, this, true, cell);
            columnText = this.chartSeriesInfo[text.toString()].uniqueName;
        }
        const rowText: Object = args.point.x;
        if (this.parent.tooltipTemplate && this.parent.getTooltipTemplate() !== undefined || this.chartSettings.tooltip.template) {
            const rowFields: string = dataSource ? this.parent.getHeaderField(rowIndex, colIndex, 'row') : '';
            const columnFields: string = dataSource ? this.parent.getHeaderField(rowIndex, colIndex, 'Column') : '';
            const templateVariable: Object = {
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
                template = this.parent.getTooltipTemplate()(
                    templateVariable, this, 'tooltipTemplate', this.element.id + 'tooltipTemplate')[0].outerHTML;
            }
            args.template = template;
        } else {
            args.text = measureAggregatedName + ': ' + formattedValue +
                (this.dataSourceSettings.columns.length === 0 ? '' :
                    (' <br/>' + this.parent.localeObj.getConstant('column') + ': ' + columnText)) +
                (this.dataSourceSettings.rows.length === 0 ? '' :
                    (' <br/>' + this.parent.localeObj.getConstant('row') + ': ' + rowText)) +
                ((args.data && args.data.seriesName === 'Pareto') ?
                    ` <br/>${this.parent.localeObj.getConstant('pareto')}: ${args.data.pointY}%` : '');
            this.parent.trigger(events.chartTooltipRender, args);
        }
    }

    private tooltipTemplateFn(): Function {
        return this.templateFn;
    }
    private loaded(args: ILoadedEventArgs): void {
        this.parent.isChartLoaded = true;
        const width: string = this.parent.grid ? this.parent.getGridWidthAsNumber().toString() : this.parent.getWidthAsNumber().toString();
        if (this.parent.chart && this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.showFieldList && this.parent.currentView === 'Chart') {
            this.parent.groupingBarModule.alignIcon();
        }
        if (this.chartSettings.showMultiLevelLabels) {
            const multilabelAxisName: string =
                PivotUtil.inArray(this.chartSettings.chartSeries.type, ['Bar', 'StackingBar', 'StackingBar100']) > -1 ?
                    '_chartYAxisMultiLevelLabel0' : '_chartXAxisMultiLevelLabel0';
            if (!isNullOrUndefined(select('#' + this.parent.element.id + multilabelAxisName, this.parent.element))) {
                this.parent.element.querySelector(
                    '#' + this.parent.element.id + multilabelAxisName).setAttribute('cursor', 'pointer');
            }
        }
        const height: string = this.getChartHeight();
        this.parent.chart.height = height;
        if (this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis) {
            if (['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Radar', 'Polar', 'Pareto'].indexOf(this.parent.chartSettings.chartSeries.type) >= 0) {
                (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'visible';
            }
            else {
                (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflow = 'auto';
                (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.overflowX = 'hidden';
            }
            (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.width = width + 'px';
            (this.parent.element.querySelector('.' + cls.PIVOTCHART) as HTMLElement).style.height = height + 'px';
        }
        this.updateView();
        if (this.parent.displayOption.primary === 'Chart' || this.parent.displayOption.view === 'Chart') {
            this.parent.notify(events.contentReady, {});
        }
        this.parent.trigger(events.chartLoaded, args);
        if ((this.parent.dataSourceSettings.mode === 'Server' && this.parent.isServerWaitingPopup) || this.parent.dataSourceSettings.mode === 'Local') {
            this.parent.hideWaitingPopup();
        }
    }
    /** @hidden */

    public updateView(): void {
        if (this.parent.grid && this.parent.chart && this.parent.showToolbar) {
            const groupingTable: HTMLElement = this.parent.element.querySelector('.e-pivot-grouping-bar') as HTMLElement;
            const groupingChartTable: HTMLElement = this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement;
            if (this.parent.currentView === 'Table') {
                this.parent.grid.element.style.display = '';
                this.parent.chart.element.style.display = 'none';
                if (this.parent.showGroupingBar && this.parent.groupingBarModule) {
                    if (groupingTable) {
                        groupingTable.style.display = '';
                        if (groupingTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) &&
                            this.parent.groupingBarModule.gridPanel != null && !this.parent.groupingBarModule.gridPanel.isDestroyed) {
                            this.parent.groupingBarModule.gridPanel.refreshOverflow();
                        }
                    }
                    if (groupingChartTable) {
                        groupingChartTable.style.display = 'none';
                    }
                }
                if (this.parent.chartSettings.enableMultipleAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                    (this.parent.element.querySelector('.e-pivotchart') as HTMLElement).style.display = 'none';
                }
            } else {
                this.parent.grid.element.style.display = 'none';
                this.parent.chart.element.style.display = '';
                if (this.parent.showGroupingBar && this.parent.groupingBarModule) {
                    if (groupingTable) {
                        groupingTable.style.display = 'none';
                    }
                    if (groupingChartTable) {
                        groupingChartTable.style.display = '';
                        if (groupingChartTable.querySelector('.' + cls.ALL_FIELDS_PANEL_CLASS) &&
                            this.parent.groupingBarModule.chartPanel != null && !this.parent.groupingBarModule.chartPanel.isDestroyed) {
                            this.parent.groupingBarModule.chartPanel.refreshOverflow();
                        }
                    }
                }
                if (this.parent.chartSettings.enableMultipleAxis && this.parent.chartSettings.enableScrollOnMultiAxis) {
                    (this.parent.element.querySelector('.e-pivotchart') as HTMLElement).style.display = '';
                }
            }
        }
    }

    private creatMenu(): void {
        if (this.accumulationMenu && !this.accumulationMenu.isDestroyed) {
            this.accumulationMenu.destroy();
        }
        const items: string[] = ((this.parent.allowDrillThrough || this.parent.editSettings.allowEditing)
            && this.parent.drillThroughModule) ? ['expand', 'collapse', 'drillThrough', 'exit'] :
            ['expand', 'collapse', 'exit'];
        const option: MenuItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            option.push({
                id: this.parent.element.id + '_DrillMenuChart_' + items[i as number],
                text: this.parent.localeObj.getConstant(items[i as number]),
                items: []
            });
        }
        const getString: { key: number; type: string; value: string }[] = this.getMenuItems();
        const expand: MenuItemModel[] = [];
        const collapse: MenuItemModel[] = [];
        for (let i: number = 0; i < getString.length; i++) {
            if (getString[i as number].type === 'expand') {
                expand.push({ id: this.element.id + 'drillExpand_' + getString[i as number].key, text: getString[i as number].value });
            } else {
                collapse.push({ id: this.element.id + 'drillCollapse_' + getString[i as number].key, text: getString[i as number].value });
            }
        }
        if (expand.length > 0) {
            option[0].items = expand;
        }
        if (collapse.length > 0) {
            option[1].items = collapse;
        }
        const menuOptions: ContextMenuModel = {
            cssClass: this.parent.element.id + '_accumulationChart' + (this.parent.cssClass ? (' ' + this.parent.cssClass) : ''),
            items: option,
            enableRtl: this.parent.enableRtl,
            beforeOpen: this.drillMenuOpen.bind(this),
            select: this.drillMenuSelect.bind(this),
            locale: this.parent.locale
        };
        this.accumulationMenu = new ContextMenu(menuOptions);
        let contextMenu: HTMLElement;
        if (select('#' + this.parent.element.id + '_accumulationChart', this.parent.element)) {
            contextMenu = select('#' + this.parent.element.id + '_accumulationChart', this.parent.element);
            contextMenu.innerHTML = '';
        } else {
            contextMenu = createElement('ul', {
                id: this.parent.element.id + '_accumulationChart'
            });
            this.parent.element.appendChild(contextMenu);
        }
        this.accumulationMenu.isStringTemplate = true;
        this.accumulationMenu.appendTo(contextMenu);
    }
    private drillMenuOpen(args: BeforeOpenCloseMenuEventArgs): void {
        if (args.items[0] && args.items[0].text === this.parent.localeObj.getConstant('expand') &&
            args.items[0].items && args.items[0].items.length === 0) {
            this.accumulationMenu.enableItems([this.parent.localeObj.getConstant('expand')], false);
        }
        if (args.items[1] && args.items[1].text === this.parent.localeObj.getConstant('collapse') &&
            args.items[1].items && args.items[1].items.length === 0) {
            this.accumulationMenu.enableItems([this.parent.localeObj.getConstant('collapse')], false);
        }
    }
    private getMenuItems(): { key: number; type: string; value: string }[] {
        let rowIndex: number = this.pivotIndex.rIndex;
        const menuItem: { key: number; type: string; value: string }[] = [];
        const pivotValues: IAxisSet[][] = this.engineModule.pivotValues as IAxisSet[][];
        let levelCol: number[] = [];
        let pivotValue: IAxisSet = pivotValues[rowIndex as number][this.pivotIndex.cIndex];
        // let hierarchy: string = pivotValues[rowIndex][0].hierarchy;
        let level: number = (!pivotValues[rowIndex as number][0].isNamedSet && pivotValues[rowIndex as number][0].hasChild) ?
            pivotValues[rowIndex as number][0].level : undefined;
        const levels: string[] = this.parent.dataType === 'olap' ? pivotValue.rowHeaders.toString().split(/~~|::/)
            : pivotValue.rowHeaders.toString().split(this.engineModule.valueSortSettings.headerDelimiter);
        while (pivotValues[rowIndex as number][0]) {
            pivotValue = pivotValues[rowIndex as number][0];
            if ((levels.length !== 0) && (levels.indexOf(pivotValue.formattedText.toString()) === (levels.length - 1))) {
                if (pivotValue.hasChild && !pivotValue.isNamedSet && levelCol.indexOf(pivotValue.level) < 0 &&
                    (level ? level >= pivotValue.level : (level === 0 ? (pivotValue.level === 0) : true))) {
                    if (!(pivotValue.isDrilled && pivotValue.hasChild)) {
                        menuItem.push({
                            key: rowIndex,
                            type: 'expand',
                            value: pivotValue.formattedText
                        });
                    } else {
                        menuItem.push({
                            key: rowIndex,
                            type: 'collapse',
                            value: pivotValue.formattedText
                        });
                    }
                    levelCol.push(pivotValue.level);
                    level = level ? (level - 1) : (pivotValue.level - 1);
                }
                const index: number = levels.indexOf(pivotValue.formattedText.toString());
                levels.splice(index, 1);
            }
            if (pivotValue.level === 0 && pivotValue.hasChild && !pivotValue.isNamedSet) {
                level = undefined;
                levelCol = [];
            }
            rowIndex--;
        }
        return menuItem;
    }

    private drillMenuSelect(args: MenuEventArgs): void {
        const pivotValues: IAxisSet[][] = (this.parent.dataType === 'olap' ?
            this.parent.olapEngineModule.pivotValues : this.parent.engineModule.pivotValues) as IAxisSet[][];
        const option: string = (args.element.id).split('_DrillMenuChart_')[1];
        if (args.element.id.indexOf(this.element.id + 'drill') === 0) {
            const type: string = args.element.id.split(this.element.id + 'drill')[1].indexOf('Expand') >= 0 ? 'drillExpand' : 'drillCollapse';
            const rowIndex: number = Number(args.element.id.split(this.element.id + type + '_')[1]);
            const pivotValue: IAxisSet = pivotValues[rowIndex as number][0];
            const name: string = this.parent.dataType === 'olap' ? pivotValue.formattedText :
                (pivotValue.actualText ? pivotValue.actualText.toString() : pivotValue.formattedText.toString());
            const text: string = pivotValue.formattedText ? pivotValue.formattedText.toString() : name;
            const caption: string = (pivotValue.hasChild && !pivotValue.isNamedSet) ?
                ((pivotValue.isDrilled ? ' - ' : ' + ') + text) : text;
            const tupInfo: ITupInfo = this.parent.dataType === 'olap' ?
                (this.engineModule as OlapEngine).tupRowInfo[pivotValue.ordinal] : undefined;
            const levelName: string = tupInfo ? tupInfo.uNameCollection : pivotValue.valueSort.levelName.toString();
            const customAttributes: ChartLabelInfo = {
                fieldName: pivotValue.valueSort.axis as string,
                level: pivotValue.level,
                hasChild: pivotValue.hasChild,
                levelName: levelName,
                name: name,
                text: caption,
                rowIndex: rowIndex,
                colIndex: 0,
                isDrilled: pivotValue.isDrilled,
                cell: pivotValue
            };
            if (this.parent.dataType === 'olap') {
                this.parent.onDrill(undefined, customAttributes);
            } else {
                this.onDrill({ customAttributes });
            }
        } else if (option === 'drillThrough') {
            this.parent.drillThroughModule.executeDrillThrough(
                pivotValues[this.pivotIndex.rIndex][this.pivotIndex.cIndex] as IAxisSet, this.pivotIndex.rIndex, this.pivotIndex.rIndex
            );
        } else if (option === 'exit') {
            this.accumulationMenu.close();
        }
    }

    /**
     *
     * @returns {string} - string.
     * @hidden
     */
    public getChartHeight(): string {
        let height: string;
        let offSetHeight: number;
        if (isNullOrUndefined(this.parent.getHeightAsNumber())) {
            height = 'auto';
        } else {
            const offSetVal: number = this.parent.showToolbar ? 6 : 5;
            height = (this.parent.getHeightAsNumber() - offSetVal).toString();
            offSetHeight = this.parent.getHeightAsNumber() - offSetVal;
        }
        if (!isNullOrUndefined(this.parent.getHeightAsNumber())) {
            let isNone: boolean = false;
            if (this.parent.element.querySelector('.e-chart-grouping-bar') !== null && (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display.toLowerCase() === 'none') {
                isNone = true;
                (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = 'block';
            }
            if (this.parent.showToolbar && this.parent.showGroupingBar) {
                height = (offSetHeight - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                    this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42) -
                    (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                        this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 62)).toString();
            } else if (this.parent.showToolbar) {
                height = (offSetHeight - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                    this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42)).toString();
            } else if (this.parent.showGroupingBar) {
                height = (offSetHeight - (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                    this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 62)).toString();
            } else if ((this.parent.chart && parseInt(this.parent.chart.height, 10) < 200) || offSetHeight < 200) {
                height = '200';
            }
            if (isNone) {
                (this.parent.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display = 'none';
            }
        } else {
            height = 'auto';
        }
        return height;
    }

    private getChartAutoHeight(): number {
        let height: number = this.parent.element.offsetHeight < this.parent.minHeight ? this.parent.minHeight :
            this.parent.element.offsetHeight;
        if (this.parent.showToolbar && this.parent.showGroupingBar) {
            height = height - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42) -
                (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                    this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 62);
        } else if (this.parent.showToolbar) {
            height = height - (this.parent.element.querySelector('.e-pivot-toolbar') ?
                this.parent.element.querySelector('.e-pivot-toolbar').clientHeight : 42);
        } else if (this.parent.showGroupingBar) {
            height = height - (this.parent.element.querySelector('.e-chart-grouping-bar') ?
                this.parent.element.querySelector('.e-chart-grouping-bar').clientHeight : 62);
        }
        return height;
    }

    private axisLabelRender(args: IAxisLabelRenderEventArgs): void {
        if (this.chartSettings.showMultiLevelLabels && this.chartSettings.chartSeries.type !== 'Pareto') {
            if (args.axis.name === 'primaryXAxis') {
                args.text = '';
            }
        }
        if (args.axis.name !== 'primaryXAxis' && !(this.parent.chartSettings.chartSeries.type === 'StackingColumn100' ||
            this.parent.chartSettings.chartSeries.type === 'StackingBar100' ||
            this.parent.chartSettings.chartSeries.type === 'StackingArea100' ||
            this.parent.chartSettings.chartSeries.type === 'StackingLine100')) {
            const formatField: IField = this.engineModule.formatFields[(this.chartSettings.enableMultipleAxis &&
                this.chartSettings.multipleAxisMode === 'Combined') ? this.currentMeasure : args.axis.name];
            const valueFormat: string | IAxisSet = this.engineModule.getFormattedValue(args.value, (this.chartSettings.enableMultipleAxis &&
                this.chartSettings.multipleAxisMode === 'Combined') ? this.currentMeasure : args.axis.name, args.text);
            const formattedValue: string = ((formatField && formatField.format &&
                this.chartSettings.useGroupingSeparator) ? this.parent.dataType === 'olap' ? valueFormat.toString() :
                    (valueFormat as IAxisSet).formattedText : args.value.toString());
            args.text = formattedValue;
        }
        this.parent.trigger(events.chartAxisLabelRender, args);
    }

    private multiLevelLabelClick(args: IMultiLevelLabelClickEventArgs): void {
        const eventArgs: MultiLevelLabelClickEventArgs = {
            axis: args.axis,
            text: args.text,
            cell: !isNullOrUndefined(args.customAttributes) ? (args.customAttributes as ChartLabelInfo).cell : undefined,
            cancel: false
        };
        this.parent.trigger(events.multiLevelLabelClick, eventArgs);
        if (!eventArgs.cancel && args.customAttributes && (args.customAttributes as ChartLabelInfo).hasChild &&
            !(args.customAttributes as ChartLabelInfo).cell.isNamedSet) {
            if (this.parent.dataType === 'olap') {
                this.parent.onDrill(undefined, args.customAttributes as ChartLabelInfo);
            } else {
                this.onDrill(args);
            }
        }
    }

    /**
     * It helped to drills the row or columns.
     *
     * @param {IMultiLevelLabelClickEventArgs} args - It contains the drillInfo.
     * @returns {void}
     * @hidden
     */
    public onDrill(args: IMultiLevelLabelClickEventArgs | { [key: string]: Object }): void {
        const labelInfo: { [key: string]: Object } = args.customAttributes as { [key: string]: Object };
        let delimiter: string = (this.dataSourceSettings.drilledMembers[0] && this.dataSourceSettings.drilledMembers[0].delimiter) ?
            this.dataSourceSettings.drilledMembers[0].delimiter : '**';
        const fieldName: string = labelInfo.fieldName as string;
        const currentColIndex: number = this.parent.gridSettings.layout === 'Tabular' ? this.parent.engineModule.rowMaxLevel : labelInfo.colIndex as number;
        const currentCell: IAxisSet = this.engineModule.pivotValues[labelInfo.rowIndex as number][
            currentColIndex as number] as IAxisSet;
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
                const field: DrillOptionsModel = this.dataSourceSettings.drilledMembers[fCnt as number];
                memberUqName = memberUqName.split(delimiter).join(field.delimiter ? field.delimiter : delimiter);
                delimiter = field.delimiter = field.delimiter ? field.delimiter : delimiter;
                if (field.name === fieldName) {
                    fieldAvail = true;
                    const memIndex: number = field.items.indexOf(memberUqName);
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
        const pivot: PivotChart = this as PivotChart;
        //setTimeout(() => {
        const drilledItem: IDrilledItem = {
            fieldName: fieldName, memberName: memberUqName, delimiter: delimiter,
            axis: 'row',
            action: labelInfo.isDrilled ? 'up' : 'down',
            currentCell: currentCell
        };
        const drillArgs: DrillArgs = {
            drillInfo: drilledItem,
            pivotview: pivot.parent
        };
        pivot.parent.trigger(events.drill, drillArgs);
        const enginePopulatingEventArgs: EnginePopulatingEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings)
        };
        this.parent.trigger(events.enginePopulating, enginePopulatingEventArgs);
        this.parent.setProperties({ dataSourceSettings: enginePopulatingEventArgs.dataSourceSettings }, true);
        if (pivot.parent.enableVirtualization || pivot.parent.enablePaging) {
            if (pivot.parent.dataSourceSettings.mode === 'Server') {
                pivot.parent.getEngine('onDrill', drilledItem, null, null, null, null, null);
            } else {
                pivot.engineModule.drilledMembers = pivot.dataSourceSettings.drilledMembers;
                (pivot.engineModule as PivotEngine).onDrill(drilledItem);
            }
        } else if (pivot.parent.dataSourceSettings.mode === 'Server') {
            pivot.parent.getEngine('onDrill', drilledItem, null, null, null, null, null);
        } else {
            (pivot.engineModule as PivotEngine).generateGridData(pivot.dataSourceSettings, true);
        }
        pivot.parent.allowServerDataBinding = false;
        pivot.parent.setProperties({ pivotValues: pivot.engineModule.pivotValues }, true);
        pivot.parent.allowServerDataBinding = true;
        const eventArgs: EnginePopulatedEventArgs = {
            dataSourceSettings: PivotUtil.getClonedDataSourceSettings(this.parent.dataSourceSettings),
            pivotValues: this.parent.pivotValues
        };
        this.parent.trigger(events.enginePopulated, eventArgs);
        pivot.engineModule.pivotValues = eventArgs.pivotValues;
        pivot.parent.renderPivotGrid();
        //});
    }

    private isAttributeDrill(hierarchy: string, drillInfo: IDrillInfo[]): boolean {
        let isDrill: boolean = false;
        for (let i: number = 0; i < this.dataSourceSettings.drilledMembers.length; i++) {
            if (this.dataSourceSettings.drilledMembers[i as number].name === hierarchy) {
                for (let j: number = 0; j < this.dataSourceSettings.drilledMembers[i as number].items.length; j++) {
                    const drillItems: string[] = this.dataSourceSettings.drilledMembers[i as number].items[j as number]
                        .split(this.dataSourceSettings.drilledMembers[i as number].delimiter);
                    let levelName: string = '';
                    for (let k: number = 0; k < drillItems.length; k++) {
                        if (drillInfo[k as number] && drillInfo[k as number].uName) {
                            levelName = levelName + (levelName === '' ? '' : this.dataSourceSettings.drilledMembers[i as number].delimiter) +
                            (drillInfo[k as number].uName.indexOf('[Measures]') > -1 ? '[Measures]' : drillInfo[k as number].uName);
                        }
                    }
                    if (levelName === this.dataSourceSettings.drilledMembers[i as number].items[j as number]) {
                        isDrill = true;
                        break;
                    }
                }
            }
        }
        return isDrill;
    }

    private load(args: ILoadedEventArgs): void {
        if (args.chart.zoomModule) {
            args.chart.zoomModule.isZoomed = true;
        }
        this.parent.trigger(events.chartLoad, args);
    }

    private beforePrint(args: IPrintEventArgs): void {
        this.parent.trigger(events.beforePrint, args);
    }

    private animationComplete(args: IAnimationCompleteEventArgs): void {
        this.parent.trigger(events.animationComplete, args);
    }

    private legendRender(args: ILegendRenderEventArgs): void {
        this.parent.trigger(events.legendRender, args);
    }

    private textRender(args: ITextRenderEventArgs): void {
        this.parent.trigger(events.textRender, args);
    }

    private pointRender(args: IPointRenderEventArgs): void {
        this.parent.trigger(events.pointRender, args);
    }

    private seriesRender(args: ISeriesRenderEventArgs): void {
        this.parent.trigger(events.seriesRender, args);
    }

    private chartMouseMove(args: IMouseEventArgs): void {
        this.parent.trigger(events.chartMouseMove, args);
    }

    private chartMouseClick(args: IMouseEventArgs): void {
        this.parent.trigger(events.chartMouseClick, args);
    }

    private pointMove(args: IPointEventArgs): void {
        this.parent.trigger(events.pointMove, args);
    }

    private chartMouseLeave(args: IMouseEventArgs): void {
        this.parent.trigger(events.chartMouseLeave, args);
    }

    private chartMouseDown(args: IMouseEventArgs): void {
        this.parent.trigger(events.chartMouseDown, args);
    }

    private chartMouseUp(args: IMouseEventArgs): void {
        this.parent.trigger(events.chartMouseUp, args);
    }

    private dragComplete(args: IDragCompleteEventArgs): void {
        this.parent.trigger(events.dragComplete, args);
    }

    private zoomComplete(args: IZoomCompleteEventArgs): void {
        this.parent.trigger(events.zoomComplete, args);
    }

    private scrollStart(args: IScrollEventArgs): void {
        this.parent.trigger(events.scrollStart, args);
    }

    private scrollEnd(args: IScrollEventArgs): void {
        this.parent.trigger(events.scrollEnd, args);
    }

    private scrollChanged(args: IScrollEventArgs): void {
        this.parent.trigger(events.scrollChanged, args);
    }

    private multiLevelLabelRender(args: MultiLevelLabelRenderEventArgs): void {
        this.parent.trigger(events.multiLevelLabelRender, args);
    }

    private resized(args: IResizeEventArgs): void {
        if (this.accumulationType.indexOf(this.chartSettings.chartSeries.type) < 0) {
            (args.chart as Chart).primaryXAxis.zoomFactor = isNullOrUndefined(this.parent.chartSettings.primaryXAxis.zoomFactor)
                ? this.getZoomFactor() : this.parent.chartSettings.primaryXAxis.zoomFactor;
            if (!this.parent.chartSettings.zoomSettings.enableScrollbar) {
                (args.chart as Chart).primaryXAxis.zoomFactor = isNullOrUndefined(this.parent.chartSettings.primaryXAxis.zoomFactor)
                    ? 1 : this.parent.chartSettings.primaryXAxis.zoomFactor;
            }
        }
        this.parent.trigger(events.chartResized, args);
    }

    /** @hidden */

    public getResizedChartHeight(): string {
        const height : string = ['Pie', 'Funnel', 'Pyramid', 'Doughnut', 'Radar', 'Polar', 'Pareto'].indexOf(this.parent.chartSettings.chartSeries.type) < 0 &&
            this.parent.chartSettings.enableScrollOnMultiAxis && this.parent.chartSettings.enableMultipleAxis &&
            this.parent.dataSourceSettings.values.length > 0 ? Number(this.parent.chart.height) >
            (this.parent.dataSourceSettings.values.length * 235) + 100 ? isNaN(Number(this.getChartHeight())) ?
                    this.getChartHeight().toString() : (Number(this.getChartHeight()) - 5).toString() :
                (!isNaN(Number(this.getChartHeight())) || this.parent.dataSourceSettings.values.length > 1) ?
                    ((this.parent.dataSourceSettings.values.length * 235) + 100).toString() : this.getChartHeight().toString()
            : this.getChartHeight().toString();
        return height;
    }

    /**
     * To destroy the chart module
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.parent && this.parent.isDestroyed) {
            return;
        }
        if (this.engineModule && !this.parent.destroyEngine) {
            this.engineModule.fieldList = {};
            this.engineModule = {} as PivotEngine | OlapEngine;
        }
        if (this.chartSeries) {
            this.chartSeries = null;
        }
        if (this.columnGroupObject) {
            this.columnGroupObject = null;
        }
        if (this.chartSeriesInfo) {
            this.chartSeriesInfo = {};
            this.selectedLegend = null;
        }
        if (this.chartSettings) {
            this.chartSettings = null;
        }
        if (this.dataSourceSettings) {
            this.dataSourceSettings = null;
        }
        if (this.accumulationMenu && !this.accumulationMenu.isDestroyed) {
            this.accumulationMenu.destroy();
            this.accumulationMenu = null;
        }
        if (this.parent && this.parent.chart && !this.parent.chart.isDestroyed) {
            this.parent.chart.destroy();
            this.parent.chart = null;
        } else {
            return;
        }
    }
}
