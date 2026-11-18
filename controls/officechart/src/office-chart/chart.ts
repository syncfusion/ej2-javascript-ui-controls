/* eslint-disable */
/* tslint:disable:no-any */
import {
    Chart, AccumulationChart, AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel, DateTime, BarSeries,
    StackingBarSeries, LineSeries, StackingLineSeries, ColumnSeries, StackingColumnSeries, AreaSeries, StackingAreaSeries,
    Trendlines, ScatterSeries, BubbleSeries, RadarSeries, PolarSeries, ErrorBar, SplineSeries,
    DataLabel, Category, Legend, Tooltip, Export, ChartModel, AccumulationChartModel
} from '@syncfusion/ej2-charts';
Chart.Inject(
    AreaSeries, StackingAreaSeries, BarSeries, PieSeries, StackingBarSeries, PolarSeries, ScatterSeries, BubbleSeries,
    RadarSeries, DateTime, ColumnSeries, StackingColumnSeries, LineSeries, StackingLineSeries, ErrorBar, Trendlines,
    SplineSeries, DataLabel, Category, Legend, Tooltip, Export);
AccumulationChart.Inject(AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel);
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { chartTypeProperty, widthProperty, heightProperty, chartDataProperty, chartCategoryProperty, chartLegendProperty, chartPrimaryCategoryAxisProperty, chartSeriesProperty, chartTitleProperty, chartPrimaryValueAxisProperty, dataPointsProperty, seriesNameProperty, errorBarProperty, dataLabelProperty, trendLinesProperty, fillProperty, foreColorProperty, positionProperty, typeProperty, directionProperty, endStyleProperty, nameProperty, forwardProperty, backwardProperty, interceptProperty, lineProperty, rgbProperty, categoryTypeProperty, hasMajorGridLinesProperty, hasMinorGridLinesProperty, minimumValueProperty, maximumValueProperty, majorUnitProperty, categoryXNameProperty, numberFormatProperty, yValueProperty, sizeProperty, seriesFormatProperty, idProperty, isAutoMajorProperty } from './keywords';
/**
 * Chart component is used to convert office charts to ej2-charts.
 */
export class ChartComponent {
    /**
     * @private
     */
    public chart: Chart | AccumulationChart;
    /**
     * @private
     */
    private chartType: string;
    /**
     * @private
     */
    private isPieType: boolean;
    /**
     * @private
     */
    private keywordIndex: number = undefined;
    /**
     * @private
     */
    private chartYValues: number[] = [];
    /**
     * @private
     */
    public chartRender(chart: any, keywordIndex?: number): void {
        this.keywordIndex = !isNullOrUndefined(keywordIndex) ? keywordIndex : 0;
        this.chartType = chart[chartTypeProperty[this.keywordIndex]];
        this.isPieType = (this.chartType === 'Pie' || this.chartType === 'Doughnut');
        let chartData: object[] = this.chartData(chart, this.chartType);
        let chartModel: AccumulationChartModel | ChartModel = {
            enableAnimation: false,
            width: chart[widthProperty[this.keywordIndex]] * (96 / 72) + 'px',
            height: chart[heightProperty[this.keywordIndex]] * (96 / 72) + 'px'
        };
        if (this.isPieType) {
            this.chart = new AccumulationChart(chartModel as AccumulationChartModel);
        } else {
            this.chart = new Chart(chartModel as ChartModel);
            this.chart.primaryXAxis = this.chartPrimaryXAxis(chart[chartPrimaryCategoryAxisProperty[this.keywordIndex]], this.chartType, chart);
            this.chart.primaryYAxis = this.chartPrimaryYAxis(chart[chartPrimaryValueAxisProperty[this.keywordIndex]]);
        }
        this.chart.series = this.chartSeries(chart[chartSeriesProperty[this.keywordIndex]], chartData, this.chartType);
        for (let i: number = 0; i < this.chart.series.length; i++) {
            this.chart.series[parseInt(i.toString(), 10)].animation.enable = false;
        }
        this.chart.title = chart[chartTitleProperty[this.keywordIndex]];
        this.chart.legendSettings = this.parseChartLegend(chart[chartLegendProperty[this.keywordIndex]]);
    }
    /**
     * @private
     */
    public convertChartToImage(chart: Chart | AccumulationChart, elementWidth: number, elementHeight: number): Promise<string> {
        let promise: Promise<string>;
        return promise = new Promise((resolve: Function, reject: Function) => {
            let width: number = 0;
            let height: number = 0;
            const dataInfo: ChartImageInfo = this.getControlsValue([chart], elementWidth, elementHeight);
            width = width ? width : dataInfo.width;
            height = height ? height : dataInfo.height;
            const element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas');
            const displayPixelRatio: number = Math.max(1, window.devicePixelRatio || 1);
            element.width = width * (displayPixelRatio);
            element.height = height * (displayPixelRatio);
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            // tslint:disable-next-line:max-line-length
            const url: string = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(dataInfo.svg)], { type: 'image/svg+xml' }));
            const image: HTMLImageElement = new Image();
            const canvasContext: CanvasRenderingContext2D = element.getContext('2d');
            canvasContext.scale(displayPixelRatio, displayPixelRatio);
            image.onload = (() => {
                canvasContext.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                const dataURL: string = element.toDataURL('image/png');
                resolve(dataURL);
            });
            image.onerror = (() => {
                reject('Invalid data');
            });
            image.src = url;
        });
    }

    private getControlsValue(controls: (Chart | AccumulationChart)[], elementWidth: number, elementHeight: number): ChartImageInfo {
        let width: number = 0;
        let height: number = 0;
        let content: string = '';
        const svgRenderer: Element = new SvgRenderer('').createSvg({
            id: 'Image_Export',
            width: 200, height: 200
        });
        controls.map((control: Chart | AccumulationChart) => {
            if (control) {
                const svgElement: Node = control.svgObject.cloneNode(true);
                const groupElement: Element = control.renderer.createGroup({
                    style: 'transform: translateY(' + height + 'px)'
                });
                groupElement.appendChild(svgElement);
                width = Math.max(control.availableSize.width, elementWidth);
                height += control.availableSize.height;
                content += control.svgObject.outerHTML;
                svgRenderer.appendChild(groupElement);
            }
        });
        svgRenderer.setAttribute('width', width + '');
        svgRenderer.setAttribute('height', height + '');
        return {
            'width': width,
            'height': height,
            'svg': svgRenderer
        };

    }


    private officeChartType(type: string): any {
        let chartType: string = '';
        switch (type) {
            case 'Area_Stacked':
                chartType = 'StackingArea';
                break;
            case 'Area':
                chartType = 'Area';
                break;
            case 'Area_Stacked_100':
                chartType = 'StackingArea100';
                break;
            case 'Bar_Clustered':
                chartType = 'Bar';
                break;
            case 'Bar_Stacked':
                chartType = 'StackingBar';
                break;
            case 'Bar_Stacked_100':
                chartType = 'StackingBar100';
                break;
            case 'Column_Clustered':
                chartType = 'Column';
                break;
            case 'Column_Stacked':
                chartType = 'StackingColumn';
                break;
            case 'Column_Stacked_100':
                chartType = 'StackingColumn100';
                break;
            case 'Scatter_Markers':
                chartType = 'Scatter';
                break;
            case 'Bubble':
                chartType = 'Bubble';
                break;
            case 'Doughnut':
            case 'Pie':
                chartType = 'Pie';
                break;
            case 'Line_Stacked_100':
            case 'Line_Markers_Stacked_100':
                chartType = 'StackingLine100';
                break;
            case 'Line':
            case 'Line_Markers':
                chartType = 'Line';
                break;
            case 'Line_Stacked':
            case 'Line_Markers_Stacked':
                chartType = 'StackingLine';
                break;
        }
        return chartType;
    }

    private chartSeries(series: any[], data: any[], type: string): object[] {
        // json data
        const chartSeries: object[] = [];
        for (let i: number = 0; i < series.length; i++) {
            const seriesData: any = series[parseInt(i.toString(), 10)];
            const seriesValue: any = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    }

    private writeChartSeries(seriesData: any, data: any[], type: string, count: number): any {
        const chartType: string = this.officeChartType(type);
        // let isAreaType: boolean = (type === 'Area_Stacked_100' || type === 'Area' || type === 'Area_Stacked');
        let seriesFormat: any = seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)];
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
            series.pointColorMapping = 'color';
            if (type === 'Doughnut') {
                series.innerRadius = '75%';
                series.radius = '70%';
            }
        } else {
            if (isNullOrUndefined(seriesFormat)) {
                seriesFormat = seriesData[dataPointsProperty[this.keywordIndex]][0];
            }
            fill = this.chartFormat(seriesFormat, chartType);
            series.fill = fill;
            if (!isNullOrUndefined(seriesFormat[fillProperty[this.keywordIndex]][foreColorProperty[this.keywordIndex]])) {
                series.pointColorMapping = 'color';
            }
        }
        if (type === 'Line_Markers' || type === 'Line_Markers_Stacked' || type === 'Line_Markers_Stacked_100') {
            series.marker = { visible: true, shape: 'Circle', isFilled: true };
        }
        if (seriesData.hasOwnProperty(dataLabelProperty[this.keywordIndex])) {
            if (this.isPieType) {
                series.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]]);
            } else {
                const data: any = {};
                data.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]]);
                series.marker = data;
            }
        }
        if (seriesData.hasOwnProperty(errorBarProperty[this.keywordIndex])) {
            const errorBarData: any = seriesData[errorBarProperty[this.keywordIndex]];
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty(trendLinesProperty[this.keywordIndex])) {
            const trendLines: any = seriesData[trendLinesProperty[this.keywordIndex]];
            let trendLinesData: any[] = [];
            for (let count: number = 0; count < trendLines.length; count++) {
                let trendLine: any = trendLines[parseInt(count.toString(), 10)];
                let data: any = {};
                data = this.parseTrendLines(trendLine, fill);
                trendLinesData.push(data);
                series.trendlines = trendLinesData;
            }
        }
        return series;
    }

    private parseDataLabels(label: any): any {
        let dataLabel: any = {};
        dataLabel.visible = true;

        if (this.isPieType) {
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
    private dataLabelPosition(position: string): string {
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

    private chartFormat(dataPoints: any, type: string): any {
        let format: any = dataPoints;
        if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
            return format[lineProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]];
        } else {
            return format[fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]];
        }
    }
    private chartPrimaryXAxis(data: any, type: string, chart: any): object {
        // json data
        let primaryXAxis: any = {};
        if (data[chartTitleProperty[this.keywordIndex]]) {
            primaryXAxis.title = data[chartTitleProperty[this.keywordIndex]];
        }
        let categoryType: string = this.chartCategoryType(data[categoryTypeProperty[this.keywordIndex]], data[numberFormatProperty[this.keywordIndex]]);
        primaryXAxis.valueType = categoryType;
        if (categoryType === 'DateTime') {
            primaryXAxis.intervalType = 'Days';
            primaryXAxis.labelFormat = 'M/d/yyyy';
            primaryXAxis.edgeLabelPlacement = 'Shift';
            // Calculate date range for DateTime axis (MS Word behavior)
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

    private chartCategoryType(categoryType: string, labelFormat: string): any {
        let type: string = '';
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
        }
        return type;
    }
    
    private calculateDateAxisRange(primaryXAxis: any, chart: any): void {
        // Extract all dates from chart data and calculate min/max for MS Word-like behavior
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

        // Find min and max dates
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

        // Calculate range in days
        const rangeInDays: number = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

        // Add 10% padding on each side (MS Word behavior)
        const paddingDays: number = Math.ceil(rangeInDays * 0.10);
        const adjustedMinDate: Date = new Date(minDate);
        adjustedMinDate.setDate(adjustedMinDate.getDate() - paddingDays);

        const adjustedMaxDate: Date = new Date(maxDate);
        adjustedMaxDate.setDate(adjustedMaxDate.getDate() + paddingDays);

        // Set axis minimum and maximum
        primaryXAxis.minimum = adjustedMinDate;
        primaryXAxis.maximum = adjustedMaxDate;

        // Determine interval based on date range
        primaryXAxis.interval = this.calculateDateInterval(rangeInDays);
    }

    private parseDateString(dateStr: string): Date {
        let parts: string[];
        if (dateStr.indexOf('/') !== -1) {
            parts = dateStr.split('/');
        } else if (dateStr.indexOf('-') !== -1) {
            parts = dateStr.split('-');
        } else {
            return new Date();
        }

        if (parts.length === 3) {
            const month: number = Number(parts[0]) - 1;
            const day: number = Number(parts[1]);
            const year: number = Number(parts[2]);

            return new Date(year, month, day);
        }

        return new Date();
    }

    private calculateDateInterval(rangeInDays: number): number {
        // Determine appropriate interval in days based on range
        if (rangeInDays <= 7) {
            return 1; // Daily intervals for short ranges
        } else if (rangeInDays <= 14) {
            return 2; // Every 2 days
        } else if (rangeInDays <= 30) {
            return 5; // Every 5 days
        } else if (rangeInDays <= 60) {
            return 10; // Every 10 days
        } else if (rangeInDays <= 180) {
            return 30; // Monthly intervals
        } else if (rangeInDays <= 365) {
            return 60; // Bi-monthly intervals
        } else {
            return 180; // Semi-annual intervals for longer ranges
        }
    }

    private chartPrimaryYAxis(data: any): any {
        // json data
        let primaryYAxis: any = {};
        if (data[chartTitleProperty[this.keywordIndex]]) {
            primaryYAxis.title = data[chartTitleProperty[this.keywordIndex]];
        }
        this.checkAndSetAxisValue(primaryYAxis, data);
        if (data[hasMajorGridLinesProperty[this.keywordIndex]]) {
            primaryYAxis.majorGridLines = { width: 1 };
        }
        if (data[hasMinorGridLinesProperty[this.keywordIndex]]) {
            primaryYAxis.minorTicksPerInterval = 4;
        }
        return primaryYAxis;
    }
    private checkAndSetAxisValue(primaryYAxis: any, data: any): any {
        if (data[minimumValueProperty[this.keywordIndex]] !== 0) {
            primaryYAxis.minimum = data[minimumValueProperty[this.keywordIndex]];
        }
        if (data[maximumValueProperty[this.keywordIndex]] !== 0) {
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
            let maxValue: number = Number.MIN_VALUE;
            let minValue: number = Number.MAX_VALUE;
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

    private chartData(chart: any, type: string): any[] {
        // json data
        const data: any[] = chart[chartCategoryProperty[this.keywordIndex]];
        const chartData: object[] = [];
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
        if (chart[chartPrimaryCategoryAxisProperty[this.keywordIndex]][numberFormatProperty[this.keywordIndex]] === 'm/d/yyyy') {
            const date: string = data[categoryXNameProperty[this.keywordIndex]];
            const d = this.parseDateString(date);
            plotValue.x = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        } else {
            plotValue.x = data[categoryXNameProperty[this.keywordIndex]];
        }
        for (let j: number = 0; j < series.length; j++) {
            const yData: any = data[chartDataProperty[this.keywordIndex]][parseInt(j.toString(), 10)];
            if (!isNullOrUndefined(yData)) {
                const yValue: any = yData[yValueProperty[this.keywordIndex]];
                this.chartYValues.push(yValue);
                plotValue['y' + j] = yValue;
                if (type === 'Bubble') {
                    plotValue['size' + j] = yData[sizeProperty[this.keywordIndex]];
                }
            }
            if (chart[chartTypeProperty[this.keywordIndex]] === 'Pie' || chart[chartTypeProperty[this.keywordIndex]] === 'Doughnut' || chart[chartTypeProperty[this.keywordIndex]] === 'Column_Stacked') {
                let seriesData: any = series[parseInt(j.toString(), 10)];
                let seriesDataPoints: any = seriesData[dataPointsProperty[this.keywordIndex]].find((obj: any) => {
                    return obj[idProperty[this.keywordIndex]] === count
                });
                if (!isNullOrUndefined(seriesDataPoints)) {
                    const color: any = this.chartFormat(seriesDataPoints, type);
                    if (chart[chartTypeProperty[this.keywordIndex]] !== 'Column_Stacked') {
                        plotValue.color = color;
                    }
                    else {
                        plotValue['color' + j] = color;
                    }
                }
                else {
                    if (seriesData[dataPointsProperty[this.keywordIndex]].length > 1 && seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)][idProperty[this.keywordIndex]] === 0) {
                        seriesDataPoints = seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)];
                        const color: any = this.chartFormat(seriesDataPoints, type);
                        if (chart[chartTypeProperty[this.keywordIndex]] !== 'Column_Stacked') {
                            plotValue.color = color;
                        } else {
                            plotValue['color' + j] = color;
                        }
                    }
                    else {
                        if (!isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]]) && !isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]])) {
                            if (seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]].length > 7) {
                                const color: any = this.getColor(seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]]);
                                if (chart[chartTypeProperty[this.keywordIndex]] !== 'Column_Stacked') {
                                    plotValue.color = color;
                                } else {
                                    plotValue['color' + j] = color;
                                }
                            }
                        }
                    }
                }
            }
        }
        return plotValue;
    }
    public getColor(color: string): string {
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
        let position: string = data[positionProperty[this.keywordIndex]];
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
    private parseBoolValue(value: any): boolean {
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

    /**
     * Destroys the internal objects which is maintained.
     */
    public destroy(): void {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = undefined;
        if (this.chartYValues) {
            this.chartYValues = [];
        }
        this.chartYValues = undefined;
    }
}

/**
 * @private
 */
interface ChartImageInfo {
    width: number;
    height: number;
    svg: Element;
}
