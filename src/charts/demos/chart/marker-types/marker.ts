/**
 * padding of Legend
 */
import { Chart, LineSeries, StackingAreaSeries, RangeAreaSeries, IPointRenderEventArgs } from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(LineSeries, StackingAreaSeries, RangeAreaSeries);
let chartData1: any[] = [
    { x: 2005, y: 28 }, { x: 2006, y: 25 }, { x: 2007, y: 26 }, { x: 2008, y: 27 },
    { x: 2009, y: 32 }, { x: 2010, y: 35 }, { x: 2011, y: 30 }
];
let chartData2: any[] = [
    { x: 2005, y: 38 }, { x: 2006, y: 35 }, { x: 2007, y: 36 }, { x: 2008, y: 37 },
    { x: 2009, y: 42 }, { x: 2010, y: 45 }, { x: 2011, y: 40 }
];
let chartData3: any[] = [
    { x: 2005, y: 48 }, { x: 2006, y: 45 }, { x: 2007, y: 46 }, { x: 2008, y: 47 },
    { x: 2009, y: 52 }, { x: 2010, y: 55 }, { x: 2011, y: 50 }
];
let chartData4: any[] = [
    { x: 2005, y: 58 }, { x: 2006, y: 55 }, { x: 2007, y: 56 }, { x: 2008, y: 57 },
    { x: 2009, y: 62 }, { x: 2010, y: 65 }, { x: 2011, y: 60 }
];
let chartData5: any[] = [
    { x: 2005, y: 68 }, { x: 2006, y: 65 }, { x: 2007, y: 66 }, { x: 2008, y: 67 },
    { x: 2009, y: 72 }, { x: 2010, y: 75 }, { x: 2011, y: 70 }
];
let chartData6: any[] = [
    { x: 2005, y: 78 }, { x: 2006, y: 75 }, { x: 2007, y: 76 }, { x: 2008, y: 77 },
    { x: 2009, y: 82 }, { x: 2010, y: 85 }, { x: 2011, y: 80 }
];
let chartData7: any[] = [
    { x: 2005, y: 88 }, { x: 2006, y: 85 }, { x: 2007, y: 86 }, { x: 2008, y: 87 },
    { x: 2009, y: 92 }, { x: 2010, y: 95 }, { x: 2011, y: 90 }
];
let chartData8: any[] = [
    { x: 2005, y: 98 }, { x: 2006, y: 95 }, { x: 2007, y: 96 }, { x: 2008, y: 97 },
    { x: 2009, y: 102 }, { x: 2010, y: 105 }, { x: 2011, y: 100 }
];
let chartData9: any[] = [
    { x: 2005, y: 108 }, { x: 2006, y: 105 }, { x: 2007, y: 106 }, { x: 2008, y: 107 },
    { x: 2009, y: 112 }, { x: 2010, y: 115 }, { x: 2011, y: 110 }
];
let chartData10: any[] = [
    { x: 2005, y: 118 }, { x: 2006, y: null }, { x: 2007, y: 116 }, { x: 2008, y: 117 },
    { x: 2009, y: 122 }, { x: 2010, y: 125 }, { x: 2011, y: 120 }
];
let chartData11: any[] = [
    { x: 1000, y: 73, low: 20, high: 35, open: 25, close: 30 },
    { x: 2000, y: null, low: null, high: 55, open: 35, close: 45 },
    { x: 3000, y: 75, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 30, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 56, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 60, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 41, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 45, low: 35, high: 95, open: 55, close: 65 }
];
let pointRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
    if (args.series.index === 8) {
        if (args.point.index === 3) {
            args.fill = 'blue';
            args.border.color = 'red';
            args.border.width = 1;
        }
    }
};
let chart: Chart = new Chart({
    axes: [{
        rowIndex: 0, columnIndex: 0, minimum: 25,
        majorGridLines: { width: 0 },
        name: 'yAxis1', title: 'YAxis1', maximum: 80,
    },
    {
        rowIndex: 1, columnIndex: 0, maximum: 125, majorGridLines: { width: 0 },
        name: 'yAxis2', title: 'YAxis2', minimum: 60,
    },
    {
        rowIndex: 0, columnIndex: 1, majorGridLines: { width: 0 },
        name: 'yAxis3', title: 'YAxis3', opposedPosition: true,
    },

    {
        rowIndex: 1, columnIndex: 1, majorGridLines: { width: 0 },
        name: 'yAxis4', title: 'YAxis4', opposedPosition: true,
    },
    {
        columnIndex: 0, rowIndex: 0, majorGridLines: { width: 0 },
        name: 'xAxis1', title: 'xAxis1',

    },
    {
        columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
        name: 'xAxis2', title: 'xAxis2',

    },
    {
        columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
        name: 'xAxis3', title: 'xAxis3',
        opposedPosition: true,

    },
    {
        columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
        name: 'xAxis4', title: 'xAxis4',
        opposedPosition: true,
    },
    ],
    series: [
        {
            dataSource: chartData1, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true,
            },
        }, {
            dataSource: chartData2, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, height: 10, width: 10,
                shape: 'Rectangle',
                fill: 'Red',
                border: { width: 1, color: 'green' },
                opacity: 0.7
            },
        }, {
            dataSource: chartData3, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'Triangle'
            },
        }, {
            dataSource: chartData4, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'Diamond'
            },
        }, {
            dataSource: chartData5, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'Cross',
                height: 10, width: 10,
                border: { width: 1, color: 'black' },
            },
        }, {
            dataSource: chartData6, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'HorizontalLine',
                height: 10, width: 10,
                border: { width: 1, color: 'black' },
            },
        }, {
            dataSource: chartData7, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'VerticalLine',
                height: 10, width: 10,
            },
        }, {
            dataSource: chartData8, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'Pentagon'
            },
        }, {
            dataSource: chartData9, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'InvertedTriangle'
            },
        }, {
            dataSource: chartData10, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'India', type: 'Line', animation: { enable: false },
            marker: {
                visible: true, shape: 'Image',
                imageUrl: './img1.jpg',
                height: 10, width: 10,
            },
        },
        {
            dataSource: chartData1, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis2', yAxisName: 'yAxis3',
            name: 'India', type: 'StackingArea', animation: { enable: false },
            marker: {
                visible: true, height: 10, width: 10,
            },
        }, {
            dataSource: chartData2, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis2', yAxisName: 'yAxis3',
            name: 'India', type: 'StackingArea', animation: { enable: false },
            marker: {
                visible: true, height: 10, width: 10,
                shape: 'Rectangle',
                fill: 'Red',
                border: { width: 1, color: 'green' },
                opacity: 0.7
            },
        }, {
            dataSource: chartData3, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis2', yAxisName: 'yAxis3',
            name: 'India', type: 'StackingArea', animation: { enable: false },
            marker: {
                visible: true, shape: 'Triangle', height: 10, width: 10,
            },
        },
        {
            dataSource: chartData11, width: 2, xName: 'x', yName: 'y', xAxisName: 'xAxis4', yAxisName: 'yAxis4', low: 'low', high: 'high',
            name: 'India', type: 'RangeArea', animation: { enable: false },
            marker: {
                visible: true, height: 10, width: 10
            },
            emptyPointSettings: { mode: 'Average', border: {color: 'black'}}
        },
    ],
    height: '900',
    rows: [
        { height: '50%', border: { width: 2, color: 'red' } },
        { height: '50%', border: { width: 2, color: 'red' } },

    ],
    columns: [
        { width: '50%', border: { width: 2, color: 'black' } },
        { width: '50%', border: { width: 2, color: 'black' } },
    ],
    pointRender: pointRender,
    legendSettings: {
        visible: false
    },
}, '#container');