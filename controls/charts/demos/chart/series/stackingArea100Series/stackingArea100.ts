/**
 * area series
 */
import { Chart, StackingAreaSeries, DateTime } from '../../../../src/chart/index';
Chart.Inject(StackingAreaSeries, DateTime);
let chartData: any[] = [
    { x: new Date(2006, 0, 1), y: 34, y1: 51, y2: 14, y3: 37 },
    { x: new Date(2007, 0, 1), y: 20, y1: 26, y2: 34, y3: 15 },
    { x: new Date(2008, 0, 1), y: 40, y1: 37, y2: 73, y3: 53 },
    { x: new Date(2009, 0, 1), y: 51, y1: 51, y2: 51, y3: 51 },
    { x: new Date(2010, 0, 1), y: 26, y1: 26, y2: 26, y3: 26 },
    { x: new Date(2011, 0, 1), y: 37, y1: 37, y2: 37, y3: 37 },
    { x: new Date(2012, 0, 1), y: 54, y1: 43, y2: 12, y3: 54 },
    { x: new Date(2013, 0, 1), y: 44, y1: 23, y2: 16, y3: 44 },
    { x: new Date(2014, 0, 1), y: 48, y1: 55, y2: 34, y3: 23 }
];
let chart: Chart = new Chart({
        primaryXAxis: {
            title: 'Years',
            valueType: 'DateTime',
            intervalType: 'Years',
            labelFormat: 'y',
            edgeLabelPlacement: 'Shift'
        },
        primaryYAxis:
        {
            title: 'Temperature (%)',
            labelFormat: '{value}%',
            rangePadding: 'None'
        },
        series: [
            {
                dataSource: chartData, xName: 'x', yName: 'y',
                //Series type as 100% stacked area series
                type: 'StackingArea100',
                name: 'USA', animation: { enable: false}
            }, {
                dataSource: chartData, xName: 'x', yName: 'y1',
                type: 'StackingArea100', name: 'UK', animation: { enable: false}
            }, {
                dataSource: chartData, xName: 'x', yName: 'y2',
                type: 'StackingArea100', name: 'Canada', animation: { enable: false}
            }, {
                dataSource: chartData, xName: 'x', yName: 'y3',
                type: 'StackingArea100', name: 'China', animation: { enable: false}
            }
        ],
        title: 'Annual Temperature Comparison'
}, '#container');