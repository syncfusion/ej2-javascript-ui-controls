/**
 * area series
 */
import { Chart, BarSeries, Category, LabelPosition, DataLabel, Tooltip, Crosshair, Selection } from '../../../../src/chart/index';
import '../../../../node_modules/es6-promise/dist/es6-promise';
import { MouseEvents } from '../../../../spec/chart/base/events.spec';
Chart.Inject(BarSeries, Category, DataLabel, Tooltip, Crosshair, Selection);

let chartData: any[] = [
    { x: 2006, y: 7.8 }, { x: 2007, y: 7.2 },
    { x: 2008, y: 6.8 }, { x: 2009, y: -3.2 },
    { x: 2010, y: 10.8 }, { x: 2011, y: 9.8 }
];
let mouseEvents: MouseEvents = new MouseEvents();
let chart: Chart = new Chart({
    primaryXAxis: {
        minimum: 2005, maximum: 2012, interval: 1,
        title: 'Year'
    },
    primaryYAxis: {
        interval: 5, title: 'Percentage',
        labelFormat: '{value}%'
    },
    series: [{
        dataSource: chartData,
        xName: 'x', yName: 'y',
        name: 'India',
        // Series type as bar series
        type: 'Bar', animation: { enable: false }
    }],
    title: 'Unemployment rate (%)',
    tooltip: { enable: true }
}, '#container');