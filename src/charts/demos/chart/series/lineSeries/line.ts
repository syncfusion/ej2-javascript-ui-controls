/**
 * area series
 */
import { Chart, LineSeries, Tooltip } from '../../../../src/chart/index';
Chart.Inject(LineSeries, Tooltip);
let chartData: any[] = [
    { x: 2005, y: 28 }, { x: 2006, y: 25 },{ x: 2007, y: 26 }, { x: 2008, y: 27 },
    { x: 2009, y: 32 }, { x: 2010, y: 35 }, { x: 2011, y: 30 }
];
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Year',
        minimum: 2004, maximum: 2012, interval: 1
    },
    primaryYAxis: {
        minimum: 20, maximum: 40, interval: 5,
        title: 'Efficiency',
        labelFormat: '{value}%'
    },
    series:[{
        dataSource: chartData, width:2,
        xName: 'x', yName: 'y',
        name: 'India',
        marker:{visible: true},
        //Series type as line
        type: 'Line', animation: { enable: false}
    }],
    tooltip: { enable: true},
    title: 'Efficiency of oil-fired power production'
}, '#container');

