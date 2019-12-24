import { AccumulationChart, AccumulationDataLabel, AccumulationLegend, AccumulationTooltip, AreaSeries, BarSeries, BubbleSeries, Category, Chart, ColumnSeries, DataLabel, DateTime, ErrorBar, Export, Legend, LineSeries, PieSeries, PolarSeries, RadarSeries, ScatterSeries, SplineSeries, StackingAreaSeries, StackingBarSeries, StackingColumnSeries, StackingLineSeries, Tooltip, Trendlines } from '@syncfusion/ej2-charts';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { createElement } from '@syncfusion/ej2-base';

/* tslint:disable:no-any */
Chart.Inject(AreaSeries, StackingAreaSeries, BarSeries, PieSeries, StackingBarSeries, PolarSeries, ScatterSeries, BubbleSeries, RadarSeries, DateTime, ColumnSeries, StackingColumnSeries, LineSeries, StackingLineSeries, ErrorBar, Trendlines, SplineSeries, DataLabel, Category, Legend, Tooltip, Export);
AccumulationChart.Inject(AccumulationLegend, PieSeries, AccumulationTooltip, AccumulationDataLabel);
/**
 * Chart component is used to convert office charts to ej2-charts.
 */
var ChartComponent = /** @__PURE__ @class */ (function () {
    function ChartComponent() {
    }
    /**
     * @private
     */
    ChartComponent.prototype.chartRender = function (chart) {
        this.chartType = chart.chartType;
        this.isPieType = (this.chartType === 'Pie' || this.chartType === 'Doughnut');
        var chartData = this.chartData(chart, this.chartType);
        var chartModel = {
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
        for (var i = 0; i < this.chart.series.length; i++) {
            this.chart.series[i].animation.enable = false;
        }
        this.chart.title = chart.chartTitle;
        this.chart.legendSettings = this.parseChartLegend(chart.chartLegend);
    };
    /**
     * @private
     */
    ChartComponent.prototype.convertChartToImage = function (chart, elementWidth, elementHeight) {
        var _this = this;
        var promise;
        return promise = new Promise(function (resolve, reject) {
            var width = 0;
            var height = 0;
            var dataInfo = _this.getControlsValue([chart], elementWidth, elementHeight);
            width = width ? width : dataInfo.width;
            height = height ? height : dataInfo.height;
            var element = createElement('canvas');
            var displayPixelRatio = Math.max(1, window.devicePixelRatio || 1);
            element.width = width * (displayPixelRatio);
            element.height = height * (displayPixelRatio);
            element.style.width = width + 'px';
            element.style.height = height + 'px';
            // tslint:disable-next-line:max-line-length
            var url = window.URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(dataInfo.svg)], { type: 'image/svg+xml' }));
            var image = new Image();
            var canvasContext = element.getContext('2d');
            canvasContext.scale(displayPixelRatio, displayPixelRatio);
            image.onload = (function () {
                canvasContext.drawImage(image, 0, 0);
                window.URL.revokeObjectURL(url);
                var dataURL = element.toDataURL('image/png');
                resolve(dataURL);
            });
            image.onerror = (function () {
                reject('Invalid data');
            });
            image.src = url;
        });
    };
    ChartComponent.prototype.getControlsValue = function (controls, elementWidth, elementHeight) {
        var width = 0;
        var height = 0;
        var content = '';
        var svgRenderer = new SvgRenderer('').createSvg({
            id: 'Image_Export',
            width: 200, height: 200
        });
        controls.map(function (control) {
            if (control) {
                var svgElement = control.svgObject.cloneNode(true);
                var groupElement = control.renderer.createGroup({
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
    };
    ChartComponent.prototype.officeChartType = function (type) {
        var chartType = '';
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
    };
    ChartComponent.prototype.chartSeries = function (series, data, type) {
        // json data
        var chartSeries = [];
        for (var i = 0; i < series.length; i++) {
            var seriesData = series[i];
            var seriesValue = this.writeChartSeries(seriesData, data, type, i);
            chartSeries.push(seriesValue);
        }
        return chartSeries;
    };
    ChartComponent.prototype.writeChartSeries = function (seriesData, data, type, count) {
        var chartType = this.officeChartType(type);
        // let isAreaType: boolean = (type === 'Area_Stacked_100' || type === 'Area' || type === 'Area_Stacked');
        var series = {};
        var fill;
        series.type = chartType;
        series.dataSource = data;
        series.name = seriesData.seriesName;
        series.xName = 'x';
        series.yName = 'y' + count;
        if (type === 'Bubble') {
            series.size = 'size' + count;
        }
        var seriesFormat = seriesData.dataPoints[0];
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
                var data_1 = {};
                data_1.dataLabel = this.parseDataLabels(seriesData.dataLabel);
                series.marker = data_1;
            }
        }
        if (seriesData.hasOwnProperty('errorBar')) {
            var errorBarData = seriesData.errorBar;
            series.errorBar = this.parseErrorBars(errorBarData);
        }
        if (seriesData.hasOwnProperty('trendLines')) {
            var trendLines = seriesData.trendLines;
            var trendLinesData = [];
            for (var count_1 = 0; count_1 < trendLines.length; count_1++) {
                var trendLine = trendLines[count_1];
                var data_2 = {};
                data_2 = this.parseTrendLines(trendLine, fill);
                trendLinesData.push(data_2);
                series.trendlines = trendLinesData;
            }
        }
        return series;
    };
    ChartComponent.prototype.parseDataLabels = function (label) {
        var dataLabel = {};
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
    };
    ChartComponent.prototype.parseErrorBars = function (errorBarData) {
        var errorBar = {};
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
    };
    ChartComponent.prototype.parseTrendLines = function (trendLines, fill) {
        var trendLine = {};
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
    };
    ChartComponent.prototype.dataLabelPosition = function (position) {
        var labelPosition = 'Auto';
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
    };
    ChartComponent.prototype.chartFormat = function (dataPoints, type) {
        var format = dataPoints;
        if (type === 'Line' || type === 'StackingLine' || type === 'StackingLine100') {
            return format.line.rgb;
        }
        else {
            return format.fill.rgb;
        }
    };
    ChartComponent.prototype.chartPrimaryXAxis = function (data, type) {
        // json data
        var primaryXAxis = {};
        if (data.chartTitle) {
            primaryXAxis.title = data.chartTitle;
        }
        var categoryType = this.chartCategoryType(data.categoryType);
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
    };
    ChartComponent.prototype.chartCategoryType = function (categoryType) {
        var type = '';
        switch (categoryType) {
            case 'Time':
                type = 'DateTime';
                break;
            case 'Automatic':
                type = 'Category';
                break;
        }
        return type;
    };
    ChartComponent.prototype.chartPrimaryYAxis = function (data) {
        // json data
        var primaryYAxis = {};
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
    };
    ChartComponent.prototype.checkAndSetAxisValue = function (primaryYAxis, data) {
        if (data.minimumValue !== 0) {
            primaryYAxis.minimum = data.minimumValue;
        }
        if (data.maximumValue !== 0) {
            primaryYAxis.maximum = data.maximumValue;
        }
        if (data.majorUnit !== 0) {
            primaryYAxis.interval = data.majorUnit;
        }
    };
    ChartComponent.prototype.chartData = function (chart, type) {
        // json data
        var data = chart.chartCategory;
        var chartData = [];
        for (var i = 0; i < data.length; i++) {
            var xData = data[i];
            var plotValue = this.chartPlotData(xData, chart, type, i);
            chartData.push(plotValue);
        }
        return chartData;
    };
    ChartComponent.prototype.chartPlotData = function (data, chart, type, count) {
        var plotValue = {};
        var series = chart.chartSeries;
        if (chart.chartPrimaryCategoryAxis.numberFormat === 'm/d/yyyy') {
            var date = data.categoryXName;
            var array = date.split('/');
            var month = Number(array[0]);
            var day = Number(array[1]);
            var year = Number(array[2]);
            plotValue.x = new Date(year, month - 1, day);
        }
        else {
            plotValue.x = data.categoryXName;
        }
        for (var j = 0; j < series.length; j++) {
            var yData = data.chartData[j];
            plotValue['y' + j] = yData.yValue;
            if (type === 'Bubble') {
                plotValue['size' + j] = yData.size;
            }
            if (chart.chartType === 'Pie' || chart.chartType === 'Doughnut') {
                var seriesData = series[j];
                var seriesDataPoints = seriesData.dataPoints[count];
                plotValue.color = this.chartFormat(seriesDataPoints, type);
            }
        }
        return plotValue;
    };
    ChartComponent.prototype.parseChartLegend = function (data) {
        var legendSettings = {};
        var position = data.position;
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
    };
    /**
     * Destroys the internal objects which is maintained.
     */
    ChartComponent.prototype.destroy = function () {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = undefined;
    };
    return ChartComponent;
}());

/**
 * export word-chart modules
 */

/**
 * export word-chart modules
 */

export { ChartComponent };
//# sourceMappingURL=ej2-office-chart.es5.js.map
