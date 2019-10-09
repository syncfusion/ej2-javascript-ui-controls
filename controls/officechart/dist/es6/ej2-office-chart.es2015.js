import { AccumulationChart, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip, AreaSeries, BarSeries, BubbleSeries, Category, Chart, ColumnSeries, DataLabel, DateTime, ErrorBar, Export, Legend, LineSeries, PieSeries, PolarSeries, RadarSeries, ScatterSeries, SplineSeries, StackingAreaSeries, StackingBarSeries, StackingColumnSeries, StackingLineSeries, Tooltip, Trendlines } from '@syncfusion/ej2-charts';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { createElement } from '@syncfusion/ej2-base';

/* tslint:disable:no-any */
Chart.Inject(AreaSeries, StackingAreaSeries, BarSeries, PieSeries, StackingBarSeries, PolarSeries, ScatterSeries, BubbleSeries, RadarSeries, DateTime, ColumnSeries, StackingColumnSeries, LineSeries, StackingLineSeries, ErrorBar, Trendlines, SplineSeries, DataLabel, Category, Legend, Tooltip, Export);
AccumulationChart.Inject(AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel);
/**
 * Chart component is used to convert office charts to ej2-charts.
 */
class ChartComponent {
    /**
     * @private
     */
    chartRender(chart) {
        this.chartType = chart.chartType;
        this.isPieType = (this.chartType === 'Pie' || this.chartType === 'Doughnut');
        let chartData = this.chartData(chart, this.chartType);
        let chartModel = {
            enableAnimation: false,
            width: chart.width * (96 / 72) + 'px',
            height: chart.height * (96 / 72) + 'px'
        };
        if (this.isPieType) {
            this.chart = new AccumulationChart(chartModel);
        }
        else {
            this.chart = new Chart(chartModel);
            this.chart.primaryXAxis = this.chartPrimaryXAxis(chart.chartPrimaryCategoryAxis, this.chartType);
            this.chart.primaryYAxis = this.chartPrimaryYAxis(chart.chartPrimaryValueAxis);
        }
        this.chart.series = this.chartSeries(chart.chartSeries, chartData, this.chartType);
        for (let i = 0; i < this.chart.series.length; i++) {
            this.chart.series[i].animation.enable = false;
        }
        this.chart.title = chart.chartTitle;
        this.chart.legendSettings = this.parseChartLegend(chart.chartLegend);
    }
    /**
     * @private
     */
    convertChartToImage(chart, elementWidth, elementHeight) {
        let promise;
        return promise = new Promise((resolve, reject) => {
            let width = 0;
            let height = 0;
            let dataInfo = this.getControlsValue([chart], elementWidth, elementHeight);
            width = width ? width : dataInfo.width;
            height = height ? height : dataInfo.height;
            let element = createElement('canvas');
            let displayPixelRatio = Math.max(1, window.devicePixelRatio || 1);
            element.width = width * (displayPixelRatio);
            element.height = height * (displayPixelRatio);
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            // tslint:disable-next-line:max-line-length
            let url = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(dataInfo.svg)], { type: 'image/svg+xml' }));
            let image = new Image();
            let canvasContext = element.getContext('2d');
            canvasContext.scale(displayPixelRatio, displayPixelRatio);
            image.onload = (() => {
                canvasContext.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                let dataURL = element.toDataURL('image/png');
                resolve(dataURL);
            });
            image.onerror = (() => {
                reject('Invalid data');
            });
            image.src = url;
        });
    }
    getControlsValue(controls, elementWidth, elementHeight) {
        let width = 0;
        let height = 0;
        let content = '';
        let svgRenderer = new SvgRenderer('').createSvg({
            id: 'Image_Export',
            width: 200, height: 200
        });
        controls.map((control) => {
            if (control) {
                let svgElement = control.svgObject.cloneNode(true);
                let groupElement = control.renderer.createGroup({
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
    officeChartType(type) {
        let chartType = '';
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
    chartSeries(series, data, type) {
        // json data
        let chartSeries = [];
        for (let i = 0; i < series.length; i++) {
            let seriesData = series[i];
            let seriesValue = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    }
    writeChartSeries(seriesData, data, type, count) {
        let chartType = this.officeChartType(type);
        // let isAreaType: boolean = (type === 'Area_Stacked_100' || type === 'Area' || type === 'Area_Stacked');
        let series = {};
        let fill;
        series.type = chartType;
        series.dataSource = data;
        series.name = seriesData.seriesName;
        series.xName = 'x';
        series.yName = 'y' + count;
        if (type === 'Bubble') {
            series.size = 'size' + count;
        }
        let seriesFormat = seriesData.dataPoints[0];
        if (this.isPieType) {
            series.pointColorMapping = 'color';
            if (type === 'Doughnut') {
                series.innerRadius = '75%';
                series.radius = '70%';
            }
        }
        else {
            fill = this.chartFormat(seriesFormat, chartType);
            series.fill = fill;
        }
        if (type === 'Line_Markers' || type === 'Line_Markers_Stacked' || type === 'Line_Markers_Stacked_100') {
            series.marker = { visible: true };
        }
        if (seriesData.hasOwnProperty('dataLabel')) {
            if (this.isPieType) {
                series.dataLabel = this.parseDataLabels(seriesData.dataLabel);
            }
            else {
                let data = {};
                data.dataLabel = this.parseDataLabels(seriesData.dataLabel);
                series.marker = data;
            }
        }
        if (seriesData.hasOwnProperty('errorBar')) {
            let errorBarData = seriesData.errorBar;
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty('trendLines')) {
            let trendLines = seriesData.trendLines;
            let trendLinesData = [];
            for (let count = 0; count < trendLines.length; count++) {
                let trendLine = trendLines[count];
                let data = {};
                data = this.parseTrendLines(trendLine, fill);
                trendLinesData.push(data);
                series.trendlines = trendLinesData;
            }
        }
        return series;
    }
    parseDataLabels(label) {
        let dataLabel = {};
        dataLabel.visible = true;
        if (this.isPieType) {
            if (label.position === 'BestFit' || label.position === 'Inside') {
                dataLabel.position = 'Inside';
            }
            else {
                dataLabel.position = 'Outside';
            }
        }
        else {
            dataLabel.position = this.dataLabelPosition(label.position);
        }
        return dataLabel;
    }
    parseErrorBars(errorBarData) {
        let errorBar = {};
        errorBar.visible = true;
        errorBar.type = errorBarData.type;
        errorBar.direction = errorBarData.direction;
        if (errorBarData.endStyle === 'Cap') {
            errorBar.errorBarCap = { width: 1 };
        }
        else {
            errorBar.errorBarCap = { width: 0 };
        }
        return errorBar;
    }
    parseTrendLines(trendLines, fill) {
        let trendLine = {};
        trendLine.type = trendLines.type;
        trendLine.name = trendLines.name;
        trendLine.forwardForecast = trendLines.forward;
        trendLine.backwardForecast = trendLines.backward;
        if (trendLines.intercept === 'NaN') {
            trendLine.intercept = 0;
        }
        else {
            trendLine.intercept = trendLines.intercept;
        }
        trendLine.fill = fill;
        return trendLine;
    }
    dataLabelPosition(position) {
        let labelPosition = 'Auto';
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
    chartFormat(dataPoints, type) {
        let format = dataPoints;
        if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
            return format.line.rgb;
        }
        else {
            return format.fill.rgb;
        }
    }
    chartPrimaryXAxis(data, type) {
        // json data
        let primaryXAxis = {};
        if (data.chartTitle) {
            primaryXAxis.title = data.chartTitle;
        }
        let categoryType = this.chartCategoryType(data.categoryType);
        primaryXAxis.valueType = categoryType;
        if (categoryType === 'DateTime') {
            primaryXAxis.intervalType = 'Days';
            primaryXAxis.labelFormat = 'M/d/yyyy';
            primaryXAxis.edgeLabelPlacement = 'Shift';
        }
        if (type === 'Scatter_Markers' || type === 'Bubble') {
            primaryXAxis.minimum = data.minimumValue;
            primaryXAxis.maximum = data.maximumValue;
            primaryXAxis.interval = data.majorUnit;
        }
        if (data.hasMajorGridLines) {
            primaryXAxis.majorGridLines = { width: 1 };
        }
        if (data.hasMinorGridLines) {
            primaryXAxis.minorTicksPerInterval = 4;
        }
        return primaryXAxis;
    }
    chartCategoryType(categoryType) {
        let type = '';
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
    chartPrimaryYAxis(data) {
        // json data
        let primaryYAxis = {};
        if (data.chartTitle) {
            primaryYAxis.title = data.chartTitle;
        }
        primaryYAxis.minimum = data.minimumValue;
        primaryYAxis.maximum = data.maximumValue;
        primaryYAxis.interval = data.majorUnit;
        if (data.hasMajorGridLines) {
            primaryYAxis.majorGridLines = { width: 1 };
        }
        if (data.hasMinorGridLines) {
            primaryYAxis.minorTicksPerInterval = 4;
        }
        return primaryYAxis;
    }
    chartData(chart, type) {
        // json data
        let data = chart.chartCategory;
        let chartData = [];
        for (let i = 0; i < data.length; i++) {
            let xData = data[i];
            let plotValue = this.chartPlotData(xData, chart, type, i);
            chartData.push(plotValue);
        }
        return chartData;
    }
    chartPlotData(data, chart, type, count) {
        let plotValue = {};
        let series = chart.chartSeries;
        if (chart.chartPrimaryCategoryAxis.numberFormat === 'm/d/yyyy') {
            let date = data.categoryXName;
            let array = date.split('/');
            let month = Number(array[0]);
            let day = Number(array[1]);
            let year = Number(array[2]);
            plotValue.x = new Date(year, month - 1, day);
        }
        else {
            plotValue.x = data.categoryXName;
        }
        for (let j = 0; j < series.length; j++) {
            let yData = data.chartData[j];
            plotValue['y' + j] = yData.yValue;
            if (type === 'Bubble') {
                plotValue['size' + j] = yData.size;
            }
            if (chart.chartType === 'Pie' || chart.chartType === 'Doughnut') {
                let seriesData = series[j];
                let seriesDataPoints = seriesData.dataPoints[count];
                plotValue.color = this.chartFormat(seriesDataPoints, type);
            }
        }
        return plotValue;
    }
    parseChartLegend(data) {
        let legendSettings = {};
        let position = data.position;
        if (position === 'Corner') {
            position = 'right';
        }
        if (position) {
            legendSettings.visible = true;
            legendSettings.position = position.charAt(0).toUpperCase() + position.slice(1);
        }
        else {
            legendSettings.visible = false;
        }
        return legendSettings;
    }
    /**
     * Destroys the internal objects which is maintained.
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = undefined;
    }
}

/**
 * export word-chart modules
 */

/**
 * export word-chart modules
 */

export { ChartComponent };
//# sourceMappingURL=ej2-office-chart.es2015.js.map
