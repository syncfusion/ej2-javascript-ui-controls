/* eslint-disable */
/* tslint:disable:no-any */
import { ChartModel, AccumulationChartModel, SeriesModel, AxisModel, LegendSettingsModel } from '@syncfusion/ej2-charts';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { ChartType } from '../common/enum';
import {
    chartTypeProperty, widthProperty, heightProperty, chartDataProperty, chartCategoryProperty, chartLegendProperty,
    chartPrimaryCategoryAxisProperty, chartSeriesProperty, chartTitleProperty, chartPrimaryValueAxisProperty,
    dataPointsProperty, seriesNameProperty, errorBarProperty, dataLabelProperty, trendLinesProperty, fillProperty,
    foreColorProperty, positionProperty, typeProperty, directionProperty, endStyleProperty, nameProperty, forwardProperty,
    backwardProperty, interceptProperty, lineProperty, rgbProperty, categoryTypeProperty, hasMajorGridLinesProperty,
    hasMinorGridLinesProperty, minimumValueProperty, maximumValueProperty, majorUnitProperty, categoryXNameProperty,
    idProperty, seriesFormatProperty,
    numberFormatProperty,
    isAutoMajorProperty,
    yValueProperty,
    sizeProperty
} from '../common/constant';

export interface JsonChartProcessResult {
    model: ChartModel | AccumulationChartModel;
    series: any[];
    primaryXAxis?: any;
    primaryYAxis?: any;
    legendSettings: any;
    title?: string;
    isPie: boolean;
    chartType: string;
}

/**
 * Checks if the chart type string is supported by the Office Chart converter.
 */
export function isSupportedType(type: string): boolean {
    switch (type) {
        case 'Area_Stacked':
        case 'Area':
        case 'Area_Stacked_100':
        case 'Bar_Clustered':
        case 'Bar_Stacked':
        case 'Bar_Stacked_100':
        case 'Column_Clustered':
        case 'Column_Stacked':
        case 'Column_Stacked_100':
        case 'Scatter':
        case 'Scatter_Markers':
        case 'Bubble':
        case 'Doughnut':
        case 'Pie':
        case 'Line_Stacked_100':
        case 'Line_Markers_Stacked_100':
        case 'Line':
        case 'Line_Markers':
        case 'Line_Stacked':
        case 'Line_Markers_Stacked':
            return true;
        default:
            return false;
    }
}

/**
 * JsonSeriesProcessor converts Office/DocIO JSON charts into EJ2 chart configuration objects.
 */
export class JsonSeriesProcessor {
    private keywordIndex: number = 0;
    private chartYValues: number[] = [];
    private chartType: string = '';
    private isPieType: boolean = false;

    /**
     * Process office chart JSON to EJ2 Chart configuration.
     * Dimensions are converted from points to px (pt * 96 / 72).
     */
    public process(chart: any, keywordIndex?: number): JsonChartProcessResult {
        let chartObj: any = chart;
        if (typeof chart === 'string') {
            try {
                chartObj = JSON.parse(chart);
            } catch (e) {
                chartObj = {};
            }
        }
        this.chartYValues = [];
        this.keywordIndex = !isNullOrUndefined(keywordIndex) ? keywordIndex : 0;
        this.chartType = chartObj[chartTypeProperty[this.keywordIndex]];
        this.isPieType = (this.chartType === 'Pie' || this.chartType === 'Doughnut');
        const chartData: object[] = this.buildChartData(chartObj, this.chartType);
        // Convert points to px exactly once
        const widthPt: number = chartObj[widthProperty[this.keywordIndex]];
        const heightPt: number = chartObj[heightProperty[this.keywordIndex]];
        const widthPx: string = (widthPt ? widthPt * (96 / 72) : 400) + 'px';
        const heightPx: string = (heightPt ? heightPt * (96 / 72) : 300) + 'px';
        const chartModel: ChartModel | AccumulationChartModel = {
            enableAnimation: false,
            width: widthPx,
            height: heightPx
        };
        const result: JsonChartProcessResult = {
            model: chartModel,
            series: [],
            legendSettings: this.parseChartLegend(chartObj[chartLegendProperty[this.keywordIndex]]),
            title: chartObj[chartTitleProperty[this.keywordIndex]],
            isPie: this.isPieType,
            chartType: this.chartType
        };
        if (!this.isPieType) {
            result.primaryXAxis = this.chartPrimaryXAxis(chartObj[chartPrimaryCategoryAxisProperty[this.keywordIndex]], this.chartType, chartObj);
            result.primaryYAxis = this.chartPrimaryYAxis(chartObj[chartPrimaryValueAxisProperty[this.keywordIndex]]);
        }
        result.series = this.chartSeries(chartObj[chartSeriesProperty[this.keywordIndex]], chartData, this.chartType);
        for (let i: number = 0; i < result.series.length; i++) {
            if (result.series[parseInt(i.toString(), 10)].animation) {
                result.series[parseInt(i.toString(), 10)].animation.enable = false;
            } else {
                result.series[parseInt(i.toString(), 10)].animation = { enable: false };
            }
        }
        return result;
    }

    public mapOfficeChartType(type: string): ChartType {
        switch (type) {
            case 'Area_Stacked':
                return 'StackingArea';
            case 'Area':
                return 'Area';
            case 'Area_Stacked_100':
                return 'StackingArea100';
            case 'Bar_Clustered':
                return 'Bar';
            case 'Bar_Stacked':
                return 'StackingBar';
            case 'Bar_Stacked_100':
                return 'StackingBar100';
            case 'Column_Clustered':
                return 'Column';
            case 'Column_Stacked':
                return 'StackingColumn';
            case 'Column_Stacked_100':
                return 'StackingColumn100';
            case 'Scatter':
            case 'Scatter_Markers':
                return 'Scatter';
            case 'Bubble':
                return 'Bubble';
            case 'Doughnut':
            case 'Pie':
                return 'Pie';
            case 'Line_Stacked_100':
            case 'Line_Markers_Stacked_100':
                return 'StackingLine100';
            case 'Line':
            case 'Line_Markers':
                return 'Line';
            case 'Line_Stacked':
            case 'Line_Markers_Stacked':
                return 'StackingLine';
            default:
                return 'Column';
        }
    }

    private chartSeries(series: any[], data: any[], type: string): object[] {
        const chartSeries: object[] = [];
        if (!series) {
            return chartSeries;
        }
        for (let i: number = 0; i < series.length; i++) {
            const seriesData: any = series[parseInt(i.toString(), 10)];
            const seriesValue: any = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    }

    private writeChartSeries(seriesData: any, data: any[], type: string, count: number): any {
        const chartType: string = this.mapOfficeChartType(type);
        const dp: any = seriesData ? seriesData[dataPointsProperty[this.keywordIndex]] : null;
        let seriesFormat: any = dp ? dp[parseInt(count.toString(), 10)] : null;
        const series: any = {};
        let fill: string;
        series.type = chartType;
        series.dataSource = data;
        series.name = seriesData[seriesNameProperty[this.keywordIndex]];
        series.xName = 'x';
        series.yName = 'y' + count;
        if (chartType !== 'Line' && chartType !== 'StackingLine' && chartType !== 'StackingLine100'
            && chartType !== 'Scatter' && chartType !== 'Bubble') {
            series.legendShape = 'Rectangle';
        }
        if (type === 'Bubble') {
            series.size = 'size' + count;
        }
        if (this.isPieType) {
            series.radius = series.radius || '100%';
            series.innerRadius = type === 'Doughnut' ? '40%' : '0%';
            series.tooltipMappingName = 'tooltip';
            const hasColors: boolean = Array.isArray(data) && data.length > 0 && data.every((pt: any) => !isNullOrUndefined(pt) && !isNullOrUndefined(pt.color));
            if (hasColors) {
                series.pointColorMapping = 'color';
            }
        } else {
            if (isNullOrUndefined(seriesFormat) && seriesData && seriesData[dataPointsProperty[this.keywordIndex]]) {
                seriesFormat = seriesData[dataPointsProperty[this.keywordIndex]][0];
            }
            if (!isNullOrUndefined(seriesFormat)) {
                fill = this.chartFormat(seriesFormat, chartType);
                series.fill = fill;
                const fillObj: any = seriesFormat[fillProperty[this.keywordIndex]];
                if (fillObj && !isNullOrUndefined(fillObj[foreColorProperty[this.keywordIndex]])) {
                    series.pointColorMapping = 'color';
                }
            }
        }
        if (type === 'Line_Markers' || type === 'Line_Markers_Stacked' || type === 'Line_Markers_Stacked_100') {
            series.marker = { visible: true, shape: 'Circle', isFilled: true };
            const sf: any = seriesData ? seriesData[seriesFormatProperty[this.keywordIndex]] : null;
            if (sf) {
                if (sf.markerSize) { series.marker.size = sf.markerSize; }
                if (sf.markerStyle) { series.marker.shape = sf.markerStyle; }
                if (sf.markerColor) {
                    const mCol: string = String(sf.markerColor);
                    series.marker.fill = mCol.startsWith('#') ? mCol : ('#' + mCol);
                }
            }
        }
        if (seriesData.hasOwnProperty(dataLabelProperty[this.keywordIndex])) {
            if (this.isPieType) {
                series.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]], count);
            } else {
                series.marker = series.marker || {};
                series.marker.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]], count);
            }
        }
        if (seriesData.hasOwnProperty(errorBarProperty[this.keywordIndex])) {
            const errorBarData: any = seriesData[errorBarProperty[this.keywordIndex]];
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty(trendLinesProperty[this.keywordIndex])) {
            const trendLines: any = seriesData[trendLinesProperty[this.keywordIndex]];
            let trendLinesData: any[] = [];
            for (let countIdx: number = 0; countIdx < trendLines.length; countIdx++) {
                let trendLine: any = trendLines[parseInt(countIdx.toString(), 10)];
                let dataObj: any = this.parseTrendLines(trendLine, fill);
                trendLinesData.push(dataObj);
            }
            series.trendlines = trendLinesData;
        }
        return series;
    }

    private parseDataLabels(label: any, count?: number): any {
        let dataLabel: any = {};
        dataLabel.visible = true;
        dataLabel.name = this.isPieType ? 'tooltip' : ('tooltip' + (!isNullOrUndefined(count) ? count : 0));
        if (this.isPieType) {
            dataLabel.font = { fontWeight: '600' };
            if (label[positionProperty[this.keywordIndex]] === 'BestFit' || label[positionProperty[this.keywordIndex]] === 'Inside') {
                dataLabel.position = 'Inside';
            } else {
                dataLabel.position = 'Outside';
            }
        } else {
            dataLabel.position = this.dataLabelPosition(label[positionProperty[this.keywordIndex]]);
        }
        return dataLabel;
    }

    private parseErrorBars(errorBarData: any): any {
        let errorBar: any = {};
        errorBar.visible = true;
        errorBar.type = errorBarData[typeProperty[this.keywordIndex]];
        errorBar.direction = errorBarData[directionProperty[this.keywordIndex]];
        if (errorBarData[endStyleProperty[this.keywordIndex]] === 'Cap') {
            errorBar.errorBarCap = { width: 1 };
        } else {
            errorBar.errorBarCap = { width: 0 };
        }
        return errorBar;
    }

    private parseTrendLines(trendLines: any, fill: string): any {
        let trendLine: any = {};
        trendLine.type = trendLines[typeProperty[this.keywordIndex]];
        trendLine.name = trendLines[nameProperty[this.keywordIndex]];
        trendLine.forwardForecast = trendLines[forwardProperty[this.keywordIndex]];
        trendLine.backwardForecast = trendLines[backwardProperty[this.keywordIndex]];
        if (trendLines[interceptProperty[this.keywordIndex]] === 'NaN') {
            trendLine.intercept = 0;
        } else {
            trendLine.intercept = trendLines[interceptProperty[this.keywordIndex]];
        }
        trendLine.fill = fill;
        return trendLine;
    }

    public dataLabelPosition(position: string): string {
        let labelPosition: string = 'Auto';
        switch (position) {
            case 'Outside':
                labelPosition = 'Outer';
                break;
            case 'Center':
                labelPosition = 'Middle';
                break;
            case 'Inside':
                labelPosition = 'Top';
                break;
            case 'OutsideBase':
                labelPosition = 'Bottom';
                break;
        }
        return labelPosition;
    }

    public chartFormat(dataPoints: any, type: string): any {
        const isLine: boolean = type === 'Line' || type === 'StackingLine' || type === 'StackingLine100';
        const primary: string = isLine ? lineProperty[this.keywordIndex] : fillProperty[this.keywordIndex];
        const fallback: string = isLine ? fillProperty[this.keywordIndex] : lineProperty[this.keywordIndex];
        const obj: any = dataPoints ? (dataPoints[primary] || dataPoints[fallback]) : null;
        return obj ? obj[rgbProperty[this.keywordIndex]] : undefined;
    }

    private chartPrimaryXAxis(data: any, type: string, chart: any): object {
        let primaryXAxis: any = {
            majorGridLines: { width: 0 },
            minorGridLines: { width: 0 },
            majorTickLines: { width: 1 },
            edgeLabelPlacement: 'Shift',
            lineStyle: { width: 0 },
            valueType: (type === 'Scatter_Markers' || type === 'Scatter') ? 'Double' : 'Category'
        };
        if (!data) {
            return primaryXAxis;
        }
        if (data[chartTitleProperty[this.keywordIndex]]) {
            primaryXAxis.title = data[chartTitleProperty[this.keywordIndex]];
        }
        let categoryType: string = this.chartCategoryType(data[categoryTypeProperty[this.keywordIndex]], data[numberFormatProperty[this.keywordIndex]]);
        if (categoryType === 'DateTime' || !(type === 'Scatter' || type === 'Scatter_Markers' || type === 'Bubble')) {
            primaryXAxis.valueType = categoryType;
        }
        if (categoryType === 'DateTime') {
            primaryXAxis.intervalType = 'Days';
            primaryXAxis.labelFormat = 'M/d/yyyy';
            primaryXAxis.edgeLabelPlacement = 'Shift';
            this.calculateDateAxisRange(primaryXAxis, chart);
        }
        if (type === 'Scatter_Markers' || type === 'Bubble') {
            this.checkAndSetAxisValue(primaryXAxis, data);
        }
        if (this.parseBoolValue(data[hasMajorGridLinesProperty[this.keywordIndex]])) {
            primaryXAxis.majorGridLines = { width: 1 };
        }
        if (this.parseBoolValue(data[hasMinorGridLinesProperty[this.keywordIndex]])) {
            primaryXAxis.minorTicksPerInterval = 4;
        }
        return primaryXAxis;
    }

    public chartCategoryType(categoryType: string, labelFormat: string): any {
        let type: string = 'Category';
        switch (categoryType) {
            case 'Time':
                type = 'DateTime';
                break;
            case 'Automatic':
                if (labelFormat && labelFormat === 'm/d/yyyy') {
                    type = 'DateTime';
                } else {
                    type = 'Category';
                }
                break;
            default:
                type = 'Category';
                break;
        }
        return type;
    }

    private calculateDateAxisRange(primaryXAxis: any, chart: any): void {
        const chartData: any[] = chart[chartCategoryProperty[this.keywordIndex]];
        if (!chartData || chartData.length === 0) {
            return;
        }
        const dates: Date[] = [];
        for (let i: number = 0; i < chartData.length; i++) {
            const dateStr: string = chartData[i][categoryXNameProperty[this.keywordIndex]];
            if (dateStr) {
                const date: Date = this.parseDateString(dateStr);
                if (date) {
                    dates.push(date);
                }
            }
        }
        if (dates.length === 0) {
            return;
        }
        let minDate: Date = dates[0];
        let maxDate: Date = dates[0];
        for (let i: number = 1; i < dates.length; i++) {
            if (dates[i] < minDate) {
                minDate = dates[i];
            }
            if (dates[i] > maxDate) {
                maxDate = dates[i];
            }
        }
        const rangeInDays: number = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
        const paddingDays: number = Math.ceil(rangeInDays * 0.10);
        const adjustedMinDate: Date = new Date(minDate);
        adjustedMinDate.setDate(adjustedMinDate.getDate() - paddingDays);
        const adjustedMaxDate: Date = new Date(maxDate);
        adjustedMaxDate.setDate(adjustedMaxDate.getDate() + paddingDays);
        primaryXAxis.minimum = adjustedMinDate;
        primaryXAxis.maximum = adjustedMaxDate;
        primaryXAxis.interval = this.calculateDateInterval(rangeInDays);
    }

    public parseDateString(dateStr: string): Date {
        if (!dateStr || typeof dateStr !== 'string') {
            return null;
        }
        let parts: string[];
        if (dateStr.indexOf('/') !== -1) {
            parts = dateStr.split('/');
        } else if (dateStr.indexOf('-') !== -1) {
            parts = dateStr.split('-');
        } else {
            return null;
        }
        if (parts.length === 3) {
            const month: number = Number(parts[0]) - 1;
            const day: number = Number(parts[1]);
            const year: number = Number(parts[2]);
            if (isNaN(month) || isNaN(day) || isNaN(year)) {
                return null;
            }
            return new Date(year, month, day);
        }
        return null;
    }

    private calculateDateInterval(rangeInDays: number): number {
        if (rangeInDays <= 7) {
            return 1;
        } else if (rangeInDays <= 14) {
            return 2;
        } else if (rangeInDays <= 30) {
            return 5;
        } else if (rangeInDays <= 60) {
            return 10;
        } else if (rangeInDays <= 180) {
            return 30;
        } else if (rangeInDays <= 365) {
            return 60;
        } else {
            return 180;
        }
    }

    private chartPrimaryYAxis(data: any): any {
        let primaryYAxis: any = {
            majorGridLines: { width: 1 },
            minorGridLines: { width: 0 },
            majorTickLines: { width: 1 },
            lineStyle: { width: 0 }
        };
        if (!data) {
            return primaryYAxis;
        }
        if (data[chartTitleProperty[this.keywordIndex]]) {
            primaryYAxis.title = data[chartTitleProperty[this.keywordIndex]];
        }
        this.checkAndSetAxisValue(primaryYAxis, data);
        if (this.parseBoolValue(data[hasMajorGridLinesProperty[this.keywordIndex]])) {
            primaryYAxis.majorGridLines = { width: 1 };
        }
        if (this.parseBoolValue(data[hasMinorGridLinesProperty[this.keywordIndex]])) {
            primaryYAxis.minorTicksPerInterval = 4;
        }
        return primaryYAxis;
    }

    private checkAndSetAxisValue(primaryYAxis: any, data: any): any {
        if (!data) {
            return;
        }
        if (!isNullOrUndefined(data[minimumValueProperty[this.keywordIndex]])) {
            primaryYAxis.minimum = data[minimumValueProperty[this.keywordIndex]];
        }
        if (!isNullOrUndefined(data[maximumValueProperty[this.keywordIndex]]) && data[maximumValueProperty[this.keywordIndex]] !== 0) {
            primaryYAxis.maximum = data[maximumValueProperty[this.keywordIndex]];
        }
        if (data[majorUnitProperty[this.keywordIndex]] !== 0) {
            const isAutoMajor: any = data[isAutoMajorProperty[this.keywordIndex]];
            if (isAutoMajor && this.parseBoolValue(isAutoMajor)) {
                const majorUnit: number = this.calculateMajorUnit(this.chartYValues);
                const is100Stacked: boolean = (this.chartType && this.chartType.indexOf('100') !== -1) ||
                    this.chartType === "Bar_Stacked_100" || this.chartType === "Line_Stacked_100" ||
                    this.chartType === "Column_Stacked_100" || this.chartType === "Line_Markers_Stacked_100" ||
                    this.chartType === "Area_Stacked_100" || this.chartType === "StackingColumn100" ||
                    this.chartType === "StackingBar100" || this.chartType === "StackingLine100" ||
                    this.chartType === "StackingArea100";
                if (majorUnit < 10 && is100Stacked) {
                    primaryYAxis.interval = 10;
                }
                else {
                    primaryYAxis.interval = majorUnit;
                }
            } else {
                primaryYAxis.interval = data[majorUnitProperty[this.keywordIndex]];
            }
        }
    }

    private calculateMajorUnit(chartYValues: number[]): number {
        if (chartYValues && chartYValues.length > 0) {
            let maxValue: number = -Infinity;
            let minValue: number = Infinity;
            for (let i: number = 0; i < chartYValues.length; i++) {
                const yValue: number = chartYValues[parseInt(i.toString(), 10)];
                if (yValue > maxValue) {
                    maxValue = yValue;
                }
                if (yValue < minValue) {
                    minValue = yValue;
                }
            }
            const range: number = maxValue - minValue;
            if (range <= 0 || !isFinite(range)) {
                return 1;
            }
            const intervalSize: number = range / 1.5;
            return this.roundToNiceNumber(intervalSize);
        }
        return 1;
    }

    private roundToNiceNumber(range: number): number {
        const log10: number = Math.floor(Math.log(range) / Math.log(10));
        const pow10: number = Math.pow(10, log10);
        const frac: number = range / pow10;
        if (frac < 1.5) {
            return 1 * pow10;
        } else if (frac < 3) {
            return 2 * pow10;
        } else if (frac < 7) {
            return 5 * pow10;
        } else {
            return 10 * pow10;
        }
    }

    private buildChartData(chart: any, type: string): any[] {
        const data: any[] = chart[chartCategoryProperty[this.keywordIndex]];
        const chartData: object[] = [];
        if (!data) {
            return chartData;
        }
        for (let i: number = 0; i < data.length; i++) {
            const xData: any = data[parseInt(i.toString(), 10)];
            const plotValue: any = this.chartPlotData(xData, chart, type, i);
            chartData.push(plotValue);
        }
        return chartData;
    }

    private chartPlotData(data: any, chart: any, type: string, count: number): any {
        let plotValue: any = {};
        let series: any = chart[chartSeriesProperty[this.keywordIndex]];
        const catAxis = chart[chartPrimaryCategoryAxisProperty[this.keywordIndex]];
        if (catAxis && catAxis[numberFormatProperty[this.keywordIndex]] === 'm/d/yyyy') {
            const date: string = data[categoryXNameProperty[this.keywordIndex]];
            const d = this.parseDateString(date);
            if (d) {
                plotValue.x = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
            } else {
                plotValue.x = date;
            }
        } else {
            plotValue.x = data[categoryXNameProperty[this.keywordIndex]];
        }
        for (let j: number = 0; j < series.length; j++) {
            const chartDataArray: any = data[chartDataProperty[this.keywordIndex]];
            const yData: any = chartDataArray ? chartDataArray[parseInt(j.toString(), 10)] : undefined;
            if (!isNullOrUndefined(yData)) {
                const yValue: any = yData[yValueProperty[this.keywordIndex]];
                this.chartYValues.push(yValue);
                plotValue['y' + j] = yValue;
                plotValue['tooltip' + j] = yValue;
                if (j === 0) {
                    plotValue.tooltip = yValue;
                }
                if (type === 'Bubble') {
                    plotValue['size' + j] = yData[sizeProperty[this.keywordIndex]];
                }
            }
            if (chart[chartTypeProperty[this.keywordIndex]] === 'Pie' || chart[chartTypeProperty[this.keywordIndex]] === 'Doughnut' || chart[chartTypeProperty[this.keywordIndex]] === 'Column_Stacked') {
                let seriesData: any = series[parseInt(j.toString(), 10)];
                const dpArray: any = seriesData ? seriesData[dataPointsProperty[this.keywordIndex]] : null;
                let seriesDataPoints: any = null;
                if (Array.isArray(dpArray)) {
                    seriesDataPoints = dpArray.find((obj: any) => {
                        return obj && obj[idProperty[this.keywordIndex]] === count;
                    });
                }
                if (!isNullOrUndefined(seriesDataPoints)) {
                    const color: any = this.getColor(this.chartFormat(seriesDataPoints, type));
                    if (chart[chartTypeProperty[this.keywordIndex]] !== 'Column_Stacked') {
                        plotValue.color = color;
                    } else {
                        plotValue['color' + j] = color;
                    }
                } else if (Array.isArray(dpArray) && dpArray.length > count && dpArray[count] && dpArray[count][idProperty[this.keywordIndex]] === 0) {
                    seriesDataPoints = dpArray[count];
                    const color: any = this.getColor(this.chartFormat(seriesDataPoints, type));
                    if (chart[chartTypeProperty[this.keywordIndex]] !== 'Column_Stacked') {
                        plotValue.color = color;
                    } else {
                        plotValue['color' + j] = color;
                    }
                } else if (seriesData && !isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]]) && !isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]])) {
                    const fillObj: any = seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]];
                    const rgbVal: string = fillObj ? fillObj[rgbProperty[this.keywordIndex]] : '';
                    if (rgbVal && rgbVal.length > 7 && chart[chartTypeProperty[this.keywordIndex]] === 'Column_Stacked') {
                        const color: any = this.getColor(rgbVal);
                        plotValue['color' + j] = color;
                    }
                }
            }
        }
        return plotValue;
    }

    public getColor(color: string): string {
        if (!color) {
            return color;
        }
        if (color.length > 0) {
            if (color[0] === '#') {
                if (color.length > 7) {
                    return color.slice(0, 7);
                }
            }
        }
        return color;
    }

    private parseChartLegend(data: any): any {
        const legendSettings: any = {};
        if (!data) {
            legendSettings.visible = false;
            return legendSettings;
        }
        let position: string = data[positionProperty[this.keywordIndex]] || data.position;
        if (position === 'Corner') {
            position = 'right';
        }
        if (position) {
            legendSettings.visible = true;
            legendSettings.position = position.charAt(0).toUpperCase() + position.slice(1);
        } else {
            legendSettings.visible = false;
        }
        return legendSettings;
    }

    public parseBoolValue(value: any): boolean {
        if (typeof value === 'string' || value instanceof String) {
            if (isNullOrUndefined(value) || value === 'f' || value === '0' || value === 'off' || value === 'false') {
                return false;
            } else {
                return true;
            }
        } else {
            if (value === 1 || value === true) {
                return true;
            } else {
                return false;
            }
        }
    }
}
