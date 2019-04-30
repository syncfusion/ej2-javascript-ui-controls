/**
 * Waterfall series demo
 */

let chartData: any[] = [
    { x: 'income', y: 4711 }, { x: 'Market and Sales', y: -427 },
    { x: 'Research', y: -588 }, { x: 'Development', y: -688 },
    { x: 'other Revenue', y: 1030 }, { x: 'Administrative', y: -780 },
    { x: 'Other expense', y: -361 }, { x: 'Income tax', y: -695 }, { x: 'Net profit'},
];

let chartData2: any[] = [
    { x: 'income', y: 471 }, { x: 'Market and Sales', y: -27 },
    { x: 'Research', y: -88 }, { x: 'Development', y: -88 },
    { x: 'other Revenue', y: 30 }, { x: 'Administrative', y: -70 },
    { x: 'Other expense', y: -36 }, { x: 'Income tax', y: -95 },
];

import { Chart, Trendlines, LineSeries, ChartAnnotation, WaterfallSeries, Category } from '../../../../src/chart/index';
Chart.Inject(Trendlines, LineSeries, ChartAnnotation, WaterfallSeries, Category);

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'horizontalAxis1', name: 'horizontalAxis1', valueType: 'Category',
    },
    primaryYAxis: {
        title: 'verticalAxis1', name: 'verticalAxis1', maximum: 8000
    },
    rows: [
        { height: '33%', border: { color: 'black', width: 2 } },
        { height: '33%', border: { color: 'red', width: 2 } },
        { height: '33%', border: { color: 'brown', width: 2 } },
    ],
    columns: [
        { width: '50%', border: { color: 'green', width: 2 } },
        { width: '50%', border: { color: 'blue', width: 2 } },
    ],
    axes: [
        { name: 'horizontalAxis2', title: 'horizontalAxis2', rowIndex: 0, columnIndex: 1, valueType: 'Category', },
        { name: 'verticalAxis2', title: 'verticalAxis2', rowIndex: 1, columnIndex: 0 },
        { name: 'verticalAxis3', title: 'verticalAxis3', rowIndex: 2, columnIndex: 0 },
    ],
    series: [
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis1', name: '1',
            animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis1', name: '1',
            animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis1', name: '2',
            intermediateSumIndexes: [2], sumIndexes: [6, 8], animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis2', name: '3',
            summaryFillColor: '#4E81BC', animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis2', name: '4',
            intermediateSumIndexes: [3], animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis3', name: '5',
            sumIndexes: [6], animation: { enable: false }
        },
        {
            dataSource: chartData, xName: 'x', yName: 'y', type: 'Waterfall',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis3', name: '6',
            negativeFillColor: '#E94649', animation: { enable: false }
        },
    ],
    annotations: [
        {
            region: 'Series', coordinateUnits: 'Point', x: 'Research', y: -50,
            content: '<div>Multiple series</div>',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis1'
        },
        {
            region: 'Series', coordinateUnits: 'Point', x: 'Development', y: -3000,
            content: '<div>intermediateSumIndexes=2,sumIndexes=6,8</div>',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis1'
        },
        {
            region: 'Series', coordinateUnits: 'Point', x: 'Development', y: -2000, content: '<div>summaryFillColor as #4E81BC</div>',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis2'
        },
        {
            region: 'Series', coordinateUnits: 'Point', x: 'Development', y: -4000, content: '<div>intermediateSumIndexes as 2</div>',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis2'
        },
        {
            region: 'Series', coordinateUnits: 'Point', x: 'Development', y: -2000, content: '<div>SumIndex 6</div>',
            xAxisName: 'horizontalAxis1', yAxisName: 'verticalAxis3'
        },
        {
            region: 'Series', coordinateUnits: 'Point', x: 1978, y: 90, content: '<div>negativeFillColor-#E94649</div>',
            xAxisName: 'horizontalAxis2', yAxisName: 'verticalAxis3'
        },
    ],
    title: 'TrendLines',
});
chart.appendTo('#container');
