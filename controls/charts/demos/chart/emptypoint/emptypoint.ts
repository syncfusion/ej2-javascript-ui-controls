/**
 * padding of Legend
 */
import { Chart, LineSeries, AreaSeries, ColumnSeries, ChartSeriesType, EmptyPointMode, Category, DataLabel } from '../../../src/chart/index';
Chart.Inject(LineSeries, AreaSeries, ColumnSeries, Category, DataLabel);
let chartData: any[] = [
    { x: 'Rice', y: 80 }, { x: 'Wheat', y: null }, { x: 'Oil', y: 70 },
    { x: 'Corn', y: 60 }, { x: 'Gram', y: null },
    { x: 'Milk', y: 70 }, { x: 'Peas', y: 80 },
    { x: 'Fruit', y: 60 }, { x: 'Butter', y: null }
];
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Product', valueType: 'Category', interval: 1
    },
    primaryYAxis: {
        title: 'Profit', minimum: 0, maximum: 100, interval: 20, labelFormat: '{value}%'
    },
    series: [{
        type: 'Column', xName: 'x', width: 2, yName: 'y', name: 'Profit',
        dataSource: [
            { x: 'Rice', y: 80 }, { x: 'Wheat', y: null }, { x: 'Oil', y: 70 },
            { x: 'Corn', y: 60 }, { x: 'Gram', y: null },
            { x: 'Milk', y: 70 }, { x: 'Peas', y: 80 },
            { x: 'Fruit', y: 60 }, { x: 'Butter', y: null }
        ],
        marker: { visible: true, height: 10, width: 10, dataLabel: { visible: true} },
        animation: { enable: false },
        emptyPointSettings: {
            fill: '#e6e6e6',
        }
    }],
    legendSettings: {
        visible: false
    },
    title: 'Annual Product-Wise Profit Analysis'
}, '#container');

let seriesType: HTMLSelectElement = document.getElementById('seriestype') as HTMLSelectElement;
(seriesType as HTMLSelectElement).onchange = () => {
    for (let series of chart.series) {
        series.type = seriesType.value as ChartSeriesType;
        chart.refresh();
    }
};
let emptyPointMode: HTMLSelectElement = document.getElementById('emptypointmode') as HTMLSelectElement;
(emptyPointMode as HTMLSelectElement).onchange = () => {
    for (let series of chart.series) {
        series.emptyPointSettings.mode = emptyPointMode.value as EmptyPointMode;
        chart.refresh();
    }
};