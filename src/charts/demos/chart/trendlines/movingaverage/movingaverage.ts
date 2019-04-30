/**
 * Moving Average Trendline
 */
import { Chart, ScatterSeries, Category, LineSeries, SplineSeries, Tooltip, Crosshair, Legend, DateTime } from '../../../../src/chart/index';
import { Trendlines } from '../../../../src/chart/trend-lines/trend-line';
Chart.Inject(ScatterSeries, LineSeries, SplineSeries,Trendlines, Category, Tooltip, Crosshair, Legend, DateTime);
let series1: Object[] = [];
let yValue: number[] = [7.66, 8.03, 8.41, 8.97, 8.77, 8.20, 8.16, 7.89, 8.68, 9.48, 10.11, 11.36, 12.34, 12.60, 12.95, 13.91, 16.21, 17.50, 22.72, 28.14, 31.26, 31.39, 32.43, 35.52, 36.36,
    41.33, 43.12, 45.00, 47.23, 48.62, 46.60, 45.28, 44.01, 45.17, 41.20, 43.41, 48.32, 45.65, 46.61, 53.34, 58.53];
let point1: Object;
let i: number; let j: number = 0;
for (i = 1973; i <= 2013; i++) {
    point1 = { x: i, y: yValue[j] };
    series1.push(point1);
    j++;
}

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
    },
    primaryYAxis: {
        title: 'Rupees against Dollars',
        interval: 5
    },
    height: '600px',
    width: '850px',
    series: [{
        dataSource: series1,
        xName: 'x', yName: 'y',
        name: 'Apple Inc',
        fill: '#0066FF',
       
        type: 'Scatter',

        trendlines: [{ type: 'MovingAverage' }]
    }],
    title: 'Online trading'
}, '#container');
