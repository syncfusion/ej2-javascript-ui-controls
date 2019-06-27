import {
    PivotEngine, IPivotValues, IAxisSet, IDataOptions, IField, IFormatSettings, IPivotRows, INumberIndex, IFieldOptions,
    IDrilledItem
} from '../../base/engine';
import * as events from '../../common/base/constant';
import * as cls from '../../common/base/css-constant';
import {
    SeriesModel, Chart, ColumnSeries, LineSeries, Legend, Tooltip, Category, AreaSeries, StepLineSeries, SplineSeries,
    SplineAreaSeries, MultiColoredLineSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries, MultiColoredAreaSeries,
    StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries, BubbleSeries, PolarSeries,
    RadarSeries, AxisModel, RowModel, Series, ITooltipRenderEventArgs, ILoadedEventArgs, MultiLevelLabel,
    IAxisLabelRenderEventArgs, ScrollBar, Zoom, IResizeEventArgs, TooltipSettingsModel, LegendSettingsModel,
    ZoomSettingsModel, ParetoSeries, Export, Crosshair, MultiLevelLabelsModel, IMultiLevelLabelClickEventArgs
} from '@syncfusion/ej2-charts';
import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartSettingsModel } from '../../pivotview/model/chartsettings-model';
import { PivotView } from '../../pivotview';
import { RowHeaderPositionGrouping, ChartSeriesType, ChartSeriesCreatedEventArgs, RowHeaderLevelGrouping } from '../../common';
import { DrillOptionsModel } from '../../pivotview/model/datasourcesettings-model';
import { showSpinner } from '@syncfusion/ej2-popups';
import { PivotUtil } from '../../base/util';

export class PivotChart {
    private chartSeries: SeriesModel[];
    private dataSourceSettings: IDataOptions;
    private chartSettings: ChartSettingsModel;
    private element: HTMLElement;
    private measureList: string[];
    private headerColl: RowHeaderPositionGrouping = {};
    private maxLevel: number = 0;
    private columnGroupObject: { [key: string]: { x: string, y: number }[] } = {};
    private persistSettings: ChartSettingsModel;
    /** @hidden */
    public calculatedWidth: number;
    /** @hidden */
    public currentMeasure: string;
    /** @hidden */
    public engineModule: PivotEngine;
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
        this.engineModule = this.parent.engineModule;
        this.dataSourceSettings = this.parent.dataSourceSettings;
        this.chartSettings = chartSettings;
        if (this.dataSourceSettings.values.length > 0) {
            if (this.chartSettings.enableMultiAxis) {
                this.measureList = this.dataSourceSettings.values.map(function (item) { return item.name; });
            }
            else {
                this.measureList = [chartSettings.value === '' ? this.dataSourceSettings.values[0].name : chartSettings.value];
            }
        } else if (this.parent.chart) {
            this.parent.chart.series = [];
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
            this.parent.notify(events.contentReady, {});
            return;
        }
        this.columnGroupObject = {};
        let pivotValues: IPivotValues = this.parent.engineModule.pivotValues;
        this.currentMeasure = chartSettings.enableMultiAxis ? this.measureList[0] :
            (((chartSettings.value === '' || this.dataSourceSettings.values.filter((item: IFieldOptions) => {
                return item.name === chartSettings.value;
            }).length === 0) && this.dataSourceSettings.values.length > 0) ? this.dataSourceSettings.values[0].name : chartSettings.value);
        let totColIndex: INumberIndex = this.getColumnTotalIndex(pivotValues);
        let rKeys: string[] = Object.keys(pivotValues);
        let prevLevel: number;
        let indexCount: number = -0.5;
        this.headerColl = {};
        this.maxLevel = 0;
        let memberCell: IAxisSet;
        for (let rKey of rKeys) {
            let rowIndex: number = Number(rKey);
            if (pivotValues[rowIndex][0] && (pivotValues[rowIndex][0] as IAxisSet).axis === 'row' &&
                (this.dataSourceSettings.rows.length === 0 ? true : (pivotValues[rowIndex][0] as IAxisSet).type !== 'grand sum')) {
                let firstRowCell: IAxisSet = pivotValues[rowIndex][0] as IAxisSet;
                if (firstRowCell.type !== 'value') {
                    if (!(prevLevel === undefined || prevLevel < firstRowCell.level)) {
                        indexCount++;
                    }
                    prevLevel = firstRowCell.level;
                }
                this.maxLevel = firstRowCell.level > this.maxLevel ? firstRowCell.level : this.maxLevel;
                let name: string = firstRowCell.actualText ? firstRowCell.actualText.toString() : firstRowCell.formattedText.toString();
                let caption: string = firstRowCell.hasChild ? ((firstRowCell.isDrilled ? ' - ' : ' + ') + name) : name;
                let cellInfo: any = {
                    name: name,
                    text: caption,
                    hasChild: firstRowCell.hasChild,
                    isDrilled: firstRowCell.isDrilled,
                    levelName: firstRowCell.valueSort['levelName'].toString(),
                    level: firstRowCell.level,
                    fieldName: firstRowCell.valueSort['axis'] ? firstRowCell.valueSort['axis'].toString() : '',
                    rowIndex: rowIndex,
                    colIndex: 0
                };
                if (firstRowCell.type !== 'value') {
                    if (this.headerColl[indexCount]) {
                        this.headerColl[indexCount][firstRowCell.level] = cellInfo;
                    } else {
                        this.headerColl[indexCount] = {};
                        this.headerColl[indexCount][firstRowCell.level] = cellInfo;
                    }
                }
                let prevMemberCell: IAxisSet;
                memberCell = firstRowCell.type !== 'value' ? firstRowCell : memberCell;
                let rows: IPivotRows = pivotValues[rowIndex];
                let cKeys: string[] = Object.keys(rows);
                for (let cKey of cKeys) {
                    let cellIndex: number = Number(cKey);
                    let cell: IAxisSet = pivotValues[rowIndex][cellIndex] as IAxisSet;
                    let measureAllow: boolean = cell.rowHeaders === '' ? this.dataSourceSettings.rows.length === 0 : true;
                    if (!totColIndex[cell.colIndex] && cell.axis === 'value' &&
                        (chartSettings.enableMultiAxis ? true : cell.actualText === this.currentMeasure)) {
                        if (((firstRowCell.type === 'value' && prevMemberCell) ?
                            prevMemberCell.members.length > 0 : firstRowCell.members.length > 0) || !measureAllow) {
                            break;
                        }
                        let columnSeries: string = cell.columnHeaders.toString().split('.').join(' - ') + ' | ' + cell.actualText;
                        if (this.columnGroupObject[columnSeries]) {
                            this.columnGroupObject[columnSeries].push({
                                x: this.dataSourceSettings.rows.length === 0 ? firstRowCell.formattedText :
                                    cell.rowHeaders.toString().split('.').join(' - '),
                                y: Number(cell.value)
                            });
                        } else {
                            this.columnGroupObject[columnSeries] = [{
                                x: this.dataSourceSettings.rows.length === 0 ? firstRowCell.formattedText :
                                    cell.rowHeaders.toString().split('.').join(' - '),
                                y: Number(cell.value)
                            }];
                        }
                    }
                    prevMemberCell = memberCell;
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
                currentSeries.yAxisName = key.split(' | ')[1];
            }
            this.chartSeries = this.chartSeries.concat(currentSeries);
        }
        let seriesEvent: ChartSeriesCreatedEventArgs = { series: this.chartSeries, cancel: false };
        this.parent.trigger(events.chartSeriesCreated, seriesEvent);
        if (!seriesEvent.cancel) {
            this.bindChart();
        } else {
            if (this.element) {
                remove(this.element);
            }
            this.parent.notify(events.contentReady, {});
        }
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
        let currentXAxis: AxisModel = this.configXAxis();
        let currentTooltipSettings: TooltipSettingsModel = this.configTooltipSettings();
        let currentLegendSettings: LegendSettingsModel = this.configLegendSettings();
        let currentZoomSettings: ZoomSettingsModel = this.configZoomSettings();
        let axesWithRows: { axes: AxisModel[], rows: RowModel[] } = this.frameAxesWithRows();
        let type: ChartSeriesType = this.chartSettings.chartSeries.type;
        if (this.parent.displayOption.view === 'Both') {
            this.element = this.parent.displayOption.primary === 'Chart' ? (this.parent.element.insertBefore((!this.element ? (createElement('div', {
                className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
            })) : this.element), this.parent.element.querySelector('.' + cls.GRID_CLASS))) :
                (this.parent.element.appendChild(!this.element ? (createElement('div', {
                    className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
                })) : this.element));
        } else if (!this.element) {
            this.element = (this.parent.element as HTMLElement).appendChild(createElement('div', {
                className: cls.PIVOTCHART, id: this.parent.element.id + '_chart'
            }));
        }
        if (!(this.parent.chart && this.parent.chart.element && this.parent.element.querySelector('.e-chart'))) {
            if (this.parent.showGroupingBar) {
                this.element.style.minWidth = '400px !important';
            } else {
                this.element.style.minWidth = '310px !important';
            }
            Chart.Inject(
                ColumnSeries, StackingColumnSeries, RangeColumnSeries, BarSeries, StackingBarSeries, ScatterSeries, BubbleSeries,
                LineSeries, StepLineSeries, SplineSeries, SplineAreaSeries, MultiColoredLineSeries, PolarSeries, RadarSeries,
                AreaSeries, RangeAreaSeries, StackingAreaSeries, StepAreaSeries, MultiColoredAreaSeries, ParetoSeries,
                Legend, Tooltip, Category, MultiLevelLabel, ScrollBar, Zoom, Export, Crosshair);
            this.parent.chart = new Chart(
                {
                    series: this.chartSeries,
                    legendSettings: currentLegendSettings,
                    tooltip: currentTooltipSettings,
                    zoomSettings: currentZoomSettings,
                    axes: (type === 'Polar' || type === 'Radar') ? [] : axesWithRows.axes,
                    rows: (type === 'Polar' || type === 'Radar') ? [{}] : axesWithRows.rows,
                    primaryYAxis: (type === 'Polar' || type === 'Radar') ? axesWithRows.axes[0] : { visible: false },
                    primaryXAxis: currentXAxis,
                    width: this.parent.width.toString(),
                    height: this.parent.height.toString(),
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
                    pointClick: this.chartSettings.pointClick ? this.chartSettings.pointClick.bind(this) : undefined,
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
                },
                '#' + this.parent.element.id + '_chart');
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
                this.parent.chart.rows = axesWithRows.rows;
            }
            this.parent.chart.refresh();
        }
    }

    private frameAxesWithRows(): { axes: AxisModel[], rows: RowModel[] } {
        let axes: AxisModel[] = [];
        let rows: RowModel[] = [];
        let percentChart: boolean = this.persistSettings.chartSeries && (
            this.persistSettings.chartSeries.type === 'StackingColumn100' ||
            this.persistSettings.chartSeries.type === 'StackingBar100' ||
            this.persistSettings.chartSeries.type === 'StackingArea100');
        if (this.chartSettings.enableMultiAxis) {
            let valCnt: number = 0;
            let divider: string = (100 / this.dataSourceSettings.values.length) + '%';
            for (let item of this.dataSourceSettings.values) {
                let measureField: IField = this.engineModule.fieldList[item.name];
                let measureAggregatedName: string =
                    this.parent.localeObj.getConstant(measureField.aggregateType) + ' of ' + measureField.caption;
                let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((itm: IFormatSettings) => {
                    return itm.name === item.name;
                })[0];
                let resFormat: boolean =
                    (this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar') ? true : false;
                let currentYAxis: AxisModel = {};
                currentYAxis = this.persistSettings.primaryYAxis ?
                    this.frameObjectWithKeys(this.persistSettings.primaryYAxis) : currentYAxis;
                currentYAxis.labelFormat = currentYAxis.labelFormat ?
                    currentYAxis.labelFormat : (percentChart ? '' : (formatSetting && !resFormat ? formatSetting.format : 'N'));
                currentYAxis.title = currentYAxis.title ? currentYAxis.title : measureAggregatedName;
                currentYAxis.plotOffset = currentYAxis.plotOffset ? currentYAxis.plotOffset : (valCnt % 2 !== 0 ? 30 : 0);
                currentYAxis.rowIndex = valCnt;
                if (!resFormat) {
                    currentYAxis.name = item.name;
                }
                axes = axes.concat(currentYAxis);
                rows.push({ height: divider });
                valCnt++;
            }
        } else {
            let measureField: IField = this.engineModule.fieldList[this.currentMeasure];
            let measureAggregatedName: string = this.parent.localeObj.getConstant(measureField.aggregateType) + ' of ' +
                measureField.caption;
            let formatSetting: IFormatSettings = this.dataSourceSettings.formatSettings.filter((item: IFormatSettings) => {
                return item.name === this.currentMeasure;
            })[0];
            let currentYAxis: AxisModel = {};
            currentYAxis = this.persistSettings.primaryYAxis ? this.frameObjectWithKeys(this.persistSettings.primaryYAxis) : currentYAxis;
            currentYAxis.rowIndex = 0;
            if (!(this.chartSettings.chartSeries.type === 'Polar' || this.chartSettings.chartSeries.type === 'Radar')) {
                currentYAxis.name = this.currentMeasure;
            }
            currentYAxis.labelFormat = currentYAxis.labelFormat ? currentYAxis.labelFormat : (percentChart ? '' : (formatSetting ?
                formatSetting.format : 'N'));
            currentYAxis.title = currentYAxis.title ? currentYAxis.title : measureAggregatedName;
            axes = axes.concat(currentYAxis);
            rows.push({ height: '100%' });
        }
        return { axes: axes, rows: rows };
    }

    private getColumnTotalIndex(pivotValues: IPivotValues): INumberIndex {
        let colIndexColl: INumberIndex = {};
        let rKeys: string[] = Object.keys(pivotValues);
        for (let rowIndex of rKeys) {
            let rows: IPivotRows = pivotValues[Number(rowIndex)];
            let cKeys: string[] = Object.keys(rows);
            for (let cellIndex of cKeys) {
                let cell: IAxisSet = rows[Number(cellIndex)] as IAxisSet;
                if (cell.axis !== 'column') {
                    return colIndexColl;
                } else if ((cell.type === 'sum' || (this.dataSourceSettings.columns.length === 0 ? false : cell.type === 'grand sum'))
                    && cell.rowSpan !== -1) {
                    colIndexColl[cell.colIndex] = cell.colIndex;
                }
            }
        }
        return colIndexColl;
    }

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
                            type: (headers[lKey].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'), customAttributes: headers[lKey]
                        });
                    }
                } else {
                    gRows[lKey] = [{
                        start: sKey, end: sKey + 1, text: headers[lKey].text,
                        type: (headers[lKey].span === -1 ? 'WithoutTopandBottomBorder' : 'WithoutTopBorder'), customAttributes: headers[lKey]
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
        tooltip.header = tooltip.header ? tooltip.header : '';
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
        if (this.chartSettings.showMultiLevelLabels) {
            currentXAxis.multiLevelLabels = this.frameMultiLevelLabels();
            currentXAxis.border = { width: 1, type: 'WithoutTopandBottomBorder' };
            currentXAxis.majorTickLines = { width: 0, height: -10 };
        }
        return currentXAxis;
    }

    private configZoomSettings(): ZoomSettingsModel {
        let zoomSettings: ZoomSettingsModel = this.chartSettings.zoomSettings;
        zoomSettings.enableSelectionZooming = zoomSettings.enableSelectionZooming === undefined ? true : zoomSettings.enableSelectionZooming;
        zoomSettings.enableScrollbar = zoomSettings.enableScrollbar === undefined ? true : zoomSettings.enableScrollbar;
        return zoomSettings;
    }

    private tooltipRender(args: ITooltipRenderEventArgs): void {
        let measureField: IField = this.engineModule.fieldList[
            (args.series as Series).yAxisName ? ((args.series as Series).yAxisName.split('_CumulativeAxis')[0]) :
                (this.chartSettings.enableMultiAxis ? args.series.name.split(' | ')[1] : this.currentMeasure)];
        let measureAggregatedName: string = this.parent.localeObj.getConstant(measureField.aggregateType) + ' of ' + measureField.caption;
        let formattedValue: string = (this.engineModule.formatFields[measureField.id] && this.chartSettings.useGroupingSeparator) ?
            this.parent.engineModule.getFormattedValue(args.point.y as number, measureField.id).formattedText :
            args.text.split('<b>')[1].split('</b>')[0];
        args.text = measureAggregatedName + ': ' + formattedValue +
            (this.dataSourceSettings.columns.length === 0 ? '' :
                (' <br/>' + this.parent.localeObj.getConstant('column') + ': ' + args.series.name.split(' | ')[0])) +
            (this.dataSourceSettings.rows.length === 0 ? '' :
                (' <br/>' + this.parent.localeObj.getConstant('row') + ': ' + args.point.x));
        this.parent.trigger(events.chartTooltipRender, args);
    }

    private loaded(args: ILoadedEventArgs): void {
        this.parent.isChartLoaded = true;
        if (this.parent.chart && this.parent.showGroupingBar && this.parent.groupingBarModule &&
            this.parent.showFieldList && this.parent.currentView === 'Chart') {
            this.parent.groupingBarModule.alignIcon();
        }
        if (this.chartSettings.showMultiLevelLabels) {
            let multilabelAxisName: string = PivotUtil.inArray(this.chartSettings.chartSeries.type, ['Bar', 'StackingBar', 'StackingBar100']) > -1 ?
                '_chartYAxisMultiLevelLabel0' : '_chartXAxisMultiLevelLabel0';
            if (!isNullOrUndefined(this.parent.element.querySelector("#" + this.parent.element.id + multilabelAxisName))) {
                this.parent.element.querySelector(
                    "#" + this.parent.element.id + multilabelAxisName).setAttribute('cursor', 'pointer');
            }
        }
        this.parent.notify(events.contentReady, {});
        this.parent.trigger(events.chartLoaded, args);
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
        if (args.customAttributes && (args.customAttributes as any).hasChild) {
            this.onDrill(args);
        }
    }
    /** @hidden */
    public onDrill(args: IMultiLevelLabelClickEventArgs): void {
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
            this.parent.setProperties({ dataSourceSettings: { drilledMembers: [{ name: fieldName, items: [memberUqName], delimiter: delimiter }] } }, true);
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
        showSpinner(this.parent.element);
        let drilledItem: IDrilledItem = {
            fieldName: fieldName, memberName: memberUqName, delimiter: delimiter,
            axis: 'row',
            action: labelInfo.isDrilled ? 'up' : 'down',
            currentCell: currentCell
        };
        this.parent.trigger(events.drill, {
            drillInfo: drilledItem,
            pivotview: this
        });
        if (this.parent.enableVirtualization) {
            this.engineModule.drilledMembers = this.dataSourceSettings.drilledMembers;
            (this.engineModule as PivotEngine).onDrill(drilledItem);
        } else {
            this.engineModule.generateGridData(this.dataSourceSettings);
        }
        this.parent.setProperties({ pivotValues: this.engineModule.pivotValues }, true);
        this.parent.renderPivotGrid();
    }

    private load(args: ILoadedEventArgs): void {
        if (args.chart.zoomModule) {
            args.chart.zoomModule.isZoomed = true;
        }
        this.parent.trigger(events.chartLoad, args);
    }

    private resized(args: IResizeEventArgs): void {
        (args.chart as Chart).primaryXAxis.zoomFactor = this.getZoomFactor();
        this.parent.trigger(events.chartResized, args);
    }

    /**
     * To destroy the chart module
     * @returns void
     * @hidden
     */
    /* tslint:disable:no-empty */
    public destroy(): void {
    }
}