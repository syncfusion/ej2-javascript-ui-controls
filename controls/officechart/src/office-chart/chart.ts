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
import { chartTypeProperty, widthProperty, heightProperty, chartDataProperty, chartCategoryProperty, chartLegendProperty, chartPrimaryCategoryAxisProperty, chartSeriesProperty, chartTitleProperty, chartPrimaryValueAxisProperty, dataPointsProperty, seriesNameProperty, errorBarProperty, dataLabelProperty, trendLinesProperty, fillProperty, foreColorProperty, positionProperty, typeProperty, directionProperty, endStyleProperty, nameProperty, forwardProperty, backwardProperty, interceptProperty, lineProperty, rgbProperty, categoryTypeProperty, hasMajorGridLinesProperty, hasMinorGridLinesProperty, minimumValueProperty, maximumValueProperty, majorUnitProperty, categoryXNameProperty, numberFormatProperty, yValueProperty, sizeProperty, seriesFormatProperty, idProperty } from '../index';
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
    public chartRender(chart: any, keywordIndex?: number): void {
        this.keywordIndex = !isNullOrUndefined(keywordIndex)? keywordIndex : 0;
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
            this.chart.primaryXAxis = this.chartPrimaryXAxis(chart[chartPrimaryCategoryAxisProperty[this.keywordIndex]], this.chartType);
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
            let dataInfo: ChartImageInfo = this.getControlsValue([chart], elementWidth, elementHeight);
            width = width ? width : dataInfo.width;
            height = height ? height : dataInfo.height;
            let element: HTMLCanvasElement = <HTMLCanvasElement>createElement('canvas');
            let displayPixelRatio: number = Math.max(1, window.devicePixelRatio || 1);
            element.width = width * (displayPixelRatio);
            element.height = height * (displayPixelRatio);
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            // tslint:disable-next-line:max-line-length
            let url: string = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(dataInfo.svg)], { type: 'image/svg+xml' }));
            let image: HTMLImageElement = new Image();
            let canvasContext: CanvasRenderingContext2D = element.getContext('2d');
            canvasContext.scale(displayPixelRatio, displayPixelRatio);
            image.onload = (() => {
                canvasContext.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                let dataURL: string = element.toDataURL('image/png');
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
        let svgRenderer: Element = new SvgRenderer('').createSvg({
            id: 'Image_Export',
            width: 200, height: 200
        });
        controls.map((control: Chart | AccumulationChart) => {
            if (control) {
                let svgElement: Node = control.svgObject.cloneNode(true);
                let groupElement: Element = control.renderer.createGroup({
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
        let chartSeries: object[] = [];
        for (let i: number = 0; i < series.length; i++) {
            let seriesData: any = series[parseInt(i.toString(), 10)];
            let seriesValue: any = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    }

    private writeChartSeries(seriesData: any, data: any[], type: string, count: number): any {
        let chartType: string = this.officeChartType(type);
        // let isAreaType: boolean = (type === 'Area_Stacked_100' || type === 'Area' || type === 'Area_Stacked');
        let seriesFormat: any = seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)];        
        let series: any = {};
        let fill: string;
        series.type = chartType;
        series.dataSource = data;
        series.name = seriesData[seriesNameProperty[this.keywordIndex]];
        series.xName = 'x';
        series.yName = 'y' + count;
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
            if(isNullOrUndefined(seriesFormat)){
                seriesFormat = seriesData[dataPointsProperty[this.keywordIndex]][0];
            }
            fill = this.chartFormat(seriesFormat, chartType);
            series.fill = fill;
            if (!isNullOrUndefined(seriesFormat[fillProperty[this.keywordIndex]][foreColorProperty[this.keywordIndex]])) {
                series.pointColorMapping = 'color';
            }
        }
        if (type === 'Line_Markers' || type === 'Line_Markers_Stacked' || type === 'Line_Markers_Stacked_100') {
            series.marker = { visible: true };
        }
        if (seriesData.hasOwnProperty(dataLabelProperty[this.keywordIndex])) {
            if (this.isPieType) {
                series.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]]);
            } else {
                let data: any = {};
                data.dataLabel = this.parseDataLabels(seriesData[dataLabelProperty[this.keywordIndex]]);
                series.marker = data;
            }
        }
        if (seriesData.hasOwnProperty(errorBarProperty[this.keywordIndex])) {
            let errorBarData: any = seriesData[errorBarProperty[this.keywordIndex]];
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty(trendLinesProperty[this.keywordIndex])) {
            let trendLines: any = seriesData[trendLinesProperty[this.keywordIndex]];
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
    private chartPrimaryXAxis(data: any, type: string): object {
        // json data
        let primaryXAxis: any = {};
        if (data[chartTitleProperty[this.keywordIndex]]) {
            primaryXAxis.title = data[chartTitleProperty[this.keywordIndex]];
        }
        let categoryType: string = this.chartCategoryType(data[categoryTypeProperty[this.keywordIndex]]);
        primaryXAxis.valueType = categoryType;
        if (categoryType === 'DateTime') {
            primaryXAxis.intervalType = 'Days';
            primaryXAxis.labelFormat = 'M/d/yyyy';
            primaryXAxis.edgeLabelPlacement = 'Shift';
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

    private chartCategoryType(categoryType: string): any {
        let type: string = '';
        switch (categoryType) {
            case 'Time':
                type = 'DateTime';
                break;
            case 'Automatic':
                type = 'Category';
                break;
        }
        return type;
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
            primaryYAxis.interval = data[majorUnitProperty[this.keywordIndex]];
        }
    }

    private chartData(chart: any, type: string): any[] {
        // json data
        let data: any[] = chart[chartCategoryProperty[this.keywordIndex]];
        let chartData: object[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let xData: any = data[parseInt(i.toString(), 10)];
            let plotValue: any = this.chartPlotData(xData, chart, type, i);
            chartData.push(plotValue);
        }
        return chartData;
    }

    private chartPlotData(data: any, chart: any, type: string, count: number): any {
        let plotValue: any = {};
        let series: any = chart[chartSeriesProperty[this.keywordIndex]];
        if (chart[chartPrimaryCategoryAxisProperty[this.keywordIndex]][numberFormatProperty[this.keywordIndex]] === 'm/d/yyyy') {
            let date: string = data[categoryXNameProperty[this.keywordIndex]];
            let array: string[] = date.split('/');
            let month: number = Number(array[0]);
            let day: number = Number(array[1]);
            let year: number = Number(array[2]);
            plotValue.x = new Date(year, month - 1, day);
        } else {
            plotValue.x = data[categoryXNameProperty[this.keywordIndex]];
        }
        for (let j: number = 0; j < series.length; j++) {
            let yData: any = data[chartDataProperty[this.keywordIndex]][parseInt(j.toString(), 10)];
            plotValue['y' + j] = yData[yValueProperty[this.keywordIndex]];
            if (type === 'Bubble') {
                plotValue['size' + j] = yData[sizeProperty[this.keywordIndex]];
            }
            if (chart[chartTypeProperty[this.keywordIndex]] === 'Pie' || chart[chartTypeProperty[this.keywordIndex]] === 'Doughnut' || chart[chartTypeProperty[this.keywordIndex]] === 'Column_Stacked') {
                let seriesData: any = series[parseInt(j.toString(), 10)];
                let seriesDataPoints: any = seriesData[dataPointsProperty[this.keywordIndex]].find((obj: any) => {
                    return obj[idProperty[this.keywordIndex]] === count
                });
                if (!isNullOrUndefined(seriesDataPoints)) {
                    plotValue.color = this.chartFormat(seriesDataPoints, type);
                }
                else {
                    if (seriesData[dataPointsProperty[this.keywordIndex]].length > 1 && seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)][idProperty[this.keywordIndex]] === 0) {
                        seriesDataPoints = seriesData[dataPointsProperty[this.keywordIndex]][parseInt(count.toString(), 10)];
                        plotValue.color = this.chartFormat(seriesDataPoints, type);
                    }
                    else {
                        if (!isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]]) && !isNullOrUndefined(seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]])) {
                            if (seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]].length > 7) {
                                plotValue.color = this.getColor(seriesData[seriesFormatProperty[this.keywordIndex]][fillProperty[this.keywordIndex]][rgbProperty[this.keywordIndex]]);
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
                    return color.substr(0, 7);
                }
            }
        }
        return color;
    }
    private parseChartLegend(data: any): any {
        let legendSettings: any = {};
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
        if (value instanceof String) {
            if (isNullOrUndefined(value) || value == "f" || value == "0" || value == "off" || value == "false") {
                return false;
            } else {
                return true;
            }
        } else {
            if (value == 1) {
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