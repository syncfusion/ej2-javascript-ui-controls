/**
 * Exponential Trendline
 */
import { Chart, ScatterSeries, SplineSeries, Category, LineSeries, Tooltip, Crosshair, Legend, DateTime } from '../../../src/chart/index';
import { Trendlines } from '../../../src/chart/trend-lines/trend-line';
Chart.Inject(ScatterSeries, LineSeries, SplineSeries, Category, Tooltip, Crosshair, Trendlines, Legend, DateTime);
let series1: Object[] = [];
let series2: Object[] = [];
let series3: Object[] = [];
let yValue: number[] = [7.66, 8.03, 8.41, 8.97, 8.77, 8.20, 8.16, 7.89, 8.68, 9.48, 10.11, 11.36, 12.34, 12.60, 12.95, 13.91,
    16.21, 17.50, 22.72, 28.14, 31.26, 31.39, 32.43, 35.52, 36.36,
    41.33, 43.12, 45.00, 47.23, 48.62, 46.60, 45.28, 44.01, 45.17, 41.20, 43.41, 48.32, 45.65, 46.61, 53.34, 58.53];
let point1: Object;
let point2: Object;
let point3: Object;
let i: number; let j: number = 0;
for (i = 1973; i <= 2013; i++) {
    point1 = { x: i, y: yValue[j] };
    point2 = { x: i, y: yValue[j] + 20};
    point3 = { x: i, y: yValue[j] + 40};
    series1.push(point1);
    series2.push(point2);
    series3.push(point3);
    j++;
}

let chart: Chart = new Chart({
    primaryXAxis: { title: 'Months', },
    primaryYAxis: { title: 'Rupees against Dollars' },
    tooltip: { enable: true },
    series: [
        {
            dataSource: series1, xName: 'x', yName: 'y', name: 'Default', type: 'Scatter', animation: { enable: false},
            trendlines: [{ type: 'Linear', enableTooltip: true, animation: { enable: false}, marker: { visible: true } }]
        },
        {
            dataSource: series2, xName: 'x', yName: 'y', name: 'BackwardForecast 5', type: 'Line',animation: { enable: false},
            trendlines: [{ type: 'Linear', marker: { visible: true }, animation: { enable: false}, backwardForecast: 5 }]
        },
        {
            dataSource: series3, xName: 'x', yName: 'y', name: 'ForwardwardForecast 10', type: 'Scatter',animation: { enable: false},
            trendlines: [{ type: 'Linear', marker: { visible: true }, animation: { enable: false}, backwardForecast: 5 }]
        },
    ],
    title: 'Linear Trendline'
}, '#container1');

let exponential: Chart = new Chart({
    primaryXAxis: { title: 'Months', },
    primaryYAxis: { title: 'Rupees against Dollars' },
    tooltip: { enable: true },
        series: [
        {
            dataSource: series1, xName: 'x', yName: 'y', name: 'Default', type: 'Scatter',animation: { enable: false},
            trendlines: [{ type: 'Exponential', enableTooltip: true, animation: { enable: false}, marker: { visible: true } }]
        },
        {
            dataSource: series2, xName: 'x', yName: 'y', name: 'BackwardForecast 5', type: 'Line',animation: { enable: false},
            trendlines: [{ type: 'Exponential', marker: { visible: true },animation: { enable: false}, backwardForecast: 5 }]
        },
        {
            dataSource: series3, xName: 'x', yName: 'y', name: 'ForwardwardForecast 10', type: 'Scatter',animation: { enable: false},
            trendlines: [{ type: 'Exponential', marker: { visible: true },animation: { enable: false},  backwardForecast: 5 }]
        },
    ],
    title: 'Exponential trendline'
}, '#container2');

let log: Chart = new Chart({
    primaryXAxis: { title: 'Months', },
    primaryYAxis: { title: 'Rupees against Dollars' },
    tooltip: { enable: true },
        series: [
        {
            dataSource: series1, xName: 'x', yName: 'y', name: 'Default', type: 'Scatter', animation: { enable: false},
            trendlines: [{ type: 'Logarithmic', enableTooltip: true, animation: { enable: false}, marker: { visible: true } }]
        },
        {
            dataSource: series2, xName: 'x', yName: 'y', name: 'BackwardForecast 5', type: 'Line', animation: { enable: false},
            trendlines: [{ type: 'Logarithmic', marker: { visible: true },animation: { enable: false}, backwardForecast: 5 }]
        },
        {
            dataSource: series3, xName: 'x', yName: 'y', name: 'ForwardwardForecast 10', type: 'Scatter', animation: { enable: false},
            trendlines: [{ type: 'Logarithmic', marker: { visible: true },animation: { enable: false}, backwardForecast: 5 }]
        },
    ],
    title: 'Logarithmic trendline'
}, '#container3');

let polynomial: Chart = new Chart({
    primaryXAxis: { title: 'Months', },
    primaryYAxis: { title: 'Rupees against Dollars' },
    tooltip: { enable: true },
        series: [
        {
            dataSource: series1, xName: 'x', yName: 'y', name: 'Default-order:3', type: 'Scatter', animation: { enable: false},
            trendlines: [{ type: 'Polynomial', enableTooltip: true,animation: { enable: false}, marker: { visible: true }, polynomialOrder: 3 }]
        },
        {
            dataSource: series2, xName: 'x', yName: 'y', name: 'BackwardForecast 5-order:12', type: 'Line', animation: { enable: false},
            trendlines: [{ type: 'Polynomial', marker: { visible: true }, animation: { enable: false},backwardForecast: 5, polynomialOrder: 12 }]
        },
        {
            dataSource: series3, xName: 'x', yName: 'y', name: 'ForwardwardForecast 10-order:8', type: 'Scatter', animation: { enable: false},
            trendlines: [{ type: 'Polynomial', marker: { visible: true },animation: { enable: false}, backwardForecast: 5, polynomialOrder: 8 }]
        },
    ],
    title: 'Polynomial trendline'
}, '#container4');