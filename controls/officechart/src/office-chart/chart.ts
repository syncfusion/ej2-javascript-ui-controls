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
    public chartRender(chart: any): void {
        
        this.chartType = chart.chartType;
        this.isPieType = (this.chartType === 'Pie' || this.chartType === 'Doughnut');
        let chartData: object[] = this.chartData(chart, this.chartType);
        let chartModel: AccumulationChartModel | ChartModel = {
            enableAnimation: false,
            width: chart.width * (96 / 72) + 'px',
            height: chart.height * (96 / 72) + 'px'
        };
        if (this.isPieType) {
            this.chart = new AccumulationChart(chartModel as AccumulationChartModel);
        } else {
            this.chart = new Chart(chartModel as ChartModel);
            this.chart.primaryXAxis = this.chartPrimaryXAxis(chart.chartPrimaryCategoryAxis, this.chartType);
            this.chart.primaryYAxis = this.chartPrimaryYAxis(chart.chartPrimaryValueAxis);
        }
        this.chart.series = this.chartSeries(chart.chartSeries, chartData, this.chartType);
        for (let i: number = 0; i < this.chart.series.length; i++) {
            this.chart.series[i].animation.enable = false;
        }
        this.chart.title = chart.chartTitle;
        this.chart.legendSettings = this.parseChartLegend(chart.chartLegend);
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
            let seriesData: any = series[i];
            let seriesValue: any = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    }

    private writeChartSeries(seriesData: any, data: any[], type: string, count: number): any {
        let chartType: string = this.officeChartType(type);
        // let isAreaType: boolean = (type === 'Area_Stacked_100' || type === 'Area' || type === 'Area_Stacked');
        let seriesFormat: any = seriesData.dataPoints[count];        
        let series: any = {};
        let fill: string;
        series.type = chartType;
        series.dataSource = data;
        series.name = seriesData.seriesName;
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
                seriesFormat = seriesData.dataPoints[0];
            }
            fill = this.chartFormat(seriesFormat, chartType);
            series.fill = fill;
            if (!isNullOrUndefined(seriesFormat.fill.foreColor)) {
                series.pointColorMapping = 'color';
            }
        }
        if (type === 'Line_Markers' || type === 'Line_Markers_Stacked' || type === 'Line_Markers_Stacked_100') {
            series.marker = { visible: true };
        }
        if (seriesData.hasOwnProperty('dataLabel')) {
            if (this.isPieType) {
                series.dataLabel = this.parseDataLabels(seriesData.dataLabel);
            } else {
                let data: any = {};
                data.dataLabel = this.parseDataLabels(seriesData.dataLabel);
                series.marker = data;
            }
        }
        if (seriesData.hasOwnProperty('errorBar')) {
            let errorBarData: any = seriesData.errorBar;
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty('trendLines')) {
            let trendLines: any = seriesData.trendLines;
            let trendLinesData: any[] = [];
            for (let count: number = 0; count < trendLines.length; count++) {
                let trendLine: any = trendLines[count];
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
            if (label.position === 'BestFit' || label.position === 'Inside') {
                dataLabel.position = 'Inside';
            } else {
                dataLabel.position = 'Outside';
            }
        } else {
            dataLabel.position = this.dataLabelPosition(label.position);
        }
        return dataLabel;
    }

    private parseErrorBars(errorBarData: any): any {
        let errorBar: any = {};
        errorBar.visible = true;
        errorBar.type = errorBarData.type;
        errorBar.direction = errorBarData.direction;
        if (errorBarData.endStyle === 'Cap') {
            errorBar.errorBarCap = { width: 1 };
        } else {
            errorBar.errorBarCap = { width: 0 };
        }
        return errorBar;
    }

    private parseTrendLines(trendLines: any, fill: string): any {
        let trendLine: any = {};
        trendLine.type = trendLines.type;
        trendLine.name = trendLines.name;
        trendLine.forwardForecast = trendLines.forward;
        trendLine.backwardForecast = trendLines.backward;
        if (trendLines.intercept === 'NaN') {
            trendLine.intercept = 0;
        } else {
            trendLine.intercept = trendLines.intercept;
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
            return format.line.rgb;
        } else {
            return format.fill.rgb;
        }
    }
    private chartPrimaryXAxis(data: any, type: string): object {
        // json data
        let primaryXAxis: any = {};
        if (data.chartTitle) {
            primaryXAxis.title = data.chartTitle;
        }
        let categoryType: string = this.chartCategoryType(data.categoryType);
        primaryXAxis.valueType = categoryType;
        if (categoryType === 'DateTime') {
            primaryXAxis.intervalType = 'Days';
            primaryXAxis.labelFormat = 'M/d/yyyy';
            primaryXAxis.edgeLabelPlacement = 'Shift';
        }
        if (type === 'Scatter_Markers' || type === 'Bubble') {
            this.checkAndSetAxisValue(primaryXAxis, data);
        }
        if (data.hasMajorGridLines) {
            primaryXAxis.majorGridLines = { width: 1 };
        }
        if (data.hasMinorGridLines) {
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
        if (data.chartTitle) {
            primaryYAxis.title = data.chartTitle;
        }
        this.checkAndSetAxisValue(primaryYAxis, data);
        if (data.hasMajorGridLines) {
            primaryYAxis.majorGridLines = { width: 1 };
        }
        if (data.hasMinorGridLines) {
            primaryYAxis.minorTicksPerInterval = 4;
        }
        return primaryYAxis;
    }
    private checkAndSetAxisValue(primaryYAxis: any, data: any): any {
        if (data.minimumValue !== 0) {
            primaryYAxis.minimum = data.minimumValue;
        }
        if (data.maximumValue !== 0) {
            primaryYAxis.maximum = data.maximumValue;
        }
        if (data.majorUnit !== 0) {
            primaryYAxis.interval = data.majorUnit;
        }
    }

    private chartData(chart: any, type: string): any[] {
        // json data
        let data: any[] = chart.chartCategory;
        let chartData: object[] = [];
        for (let i: number = 0; i < data.length; i++) {
            let xData: any = data[i];
            let plotValue: any = this.chartPlotData(xData, chart, type, i);
            chartData.push(plotValue);
        }
        return chartData;
    }

    private chartPlotData(data: any, chart: any, type: string, count: number): any {
        let plotValue: any = {};
        let series: any = chart.chartSeries;
        if (chart.chartPrimaryCategoryAxis.numberFormat === 'm/d/yyyy') {
            let date: string = data.categoryXName;
            let array: string[] = date.split('/');
            let month: number = Number(array[0]);
            let day: number = Number(array[1]);
            let year: number = Number(array[2]);
            plotValue.x = new Date(year, month - 1, day);
        } else {
            plotValue.x = data.categoryXName;
        }
        for (let j: number = 0; j < series.length; j++) {
            let yData: any = data.chartData[j];
            plotValue['y' + j] = yData.yValue;
            if (type === 'Bubble') {
                plotValue['size' + j] = yData.size;
            }
            if (chart.chartType === 'Pie' || chart.chartType === 'Doughnut' || chart.chartType === 'Column_Stacked') {
                let seriesData: any = series[j];
                let seriesDataPoints: any = seriesData.dataPoints.find((obj: any) => {
                    return obj.id === count
                });
                if (!isNullOrUndefined(seriesDataPoints)) {
                    plotValue.color = this.chartFormat(seriesDataPoints, type);
                }
                else {
                    if (seriesData.dataPoints.length > 1 && seriesData.dataPoints[count].id === 0) {
                        seriesDataPoints = seriesData.dataPoints[count];
                        plotValue.color = this.chartFormat(seriesDataPoints, type);
                    }
                    else {
                        if (!isNullOrUndefined(seriesData.seriesFormat) && !isNullOrUndefined(seriesData.seriesFormat.fill)) {
                            if (seriesData.seriesFormat.fill.rgb.length > 7) {
                                plotValue.color = this.getColor(seriesData.seriesFormat.fill.rgb);
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
        let position: string = data.position;
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