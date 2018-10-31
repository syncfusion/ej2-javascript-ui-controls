/**
 * Power Trendline
 */
import { Chart, ScatterSeries, Category, LineSeries, SplineSeries, Tooltip, Crosshair, Legend, DateTime } from '../../../../src/chart/index';
import { Trendlines } from '../../../../src/chart/trend-lines/trend-line';
Chart.Inject(ScatterSeries, LineSeries,Trendlines, SplineSeries, Category, Tooltip, Crosshair, Legend, DateTime);
let powerData: any[] = [
    { x: 1, y: 10 }, { x: 2, y: 50 },{ x: 3, y: 80 }, { x: 4, y: 110 },
    { x: 5, y: 180 }, { x: 6, y: 220 }, { x: 7, y: 300 }, { x: 8, y: 370 }, { x: 9, y: 490 }, { x: 10, y: 500 }
];

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
    },
    primaryYAxis: {
        title: 'Rupees against Dollars',
        interval: 50
    },
    height: '600px',
    width: '850px',
    series: [{
        dataSource: powerData,
        xName: 'x', yName: 'y',
        name: 'Apple Inc',
        fill: '#0066FF',
      
        type: 'Scatter',

        trendlines: [{ type: 'Power' }]
    }],
    title: 'Online trading'
}, '#container');
