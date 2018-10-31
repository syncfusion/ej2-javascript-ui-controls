/**
 * Waterfall series
 */
import {
    Chart, Category, ILoadedEventArgs, DataLabel,
    IPointRenderEventArgs, BoxAndWhiskerSeries, LineSeries, Tooltip, getElement, BoxPlotMode
} from '../../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { pointByIndex } from '../../../../src/index';
Chart.Inject(Category, BoxAndWhiskerSeries, Tooltip, LineSeries, DataLabel);
let chartData: any[] = [
    { x: 'Development', y: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
    { x: 'Testing', y: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
    { x: 'HR', y: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
    { x: 'Finance', y: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
    { x: 'R&D', y: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] },
    { x: 'Sales', y: [27, 26, 28, 29, 29, 29, 32, 35, 32, 38, 53] },
    { x: 'Inventory', y: [21, 23, 24, 25, 26, 27, 28, 30, 34, 36, 38] },
    { x: 'Graphics', y: [26, 28, 29, 30, 32, 33, 35, 36, 52] },
    { x: 'Training', y: [28, 29, 30, 31, 32, 34, 35, 36] }
];

let pointRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
    if (args.series.index === 3) {
        if (args.point.index === 3) {
            args.fill = 'blue';
            args.border.color = 'red';
            args.border.width = 1;
        }
    }
};

let chart: Chart = new Chart({
    axes: [{
        rowIndex: 0, columnIndex: 0,
        name: 'yAxis1', title: 'YAxis1', majorGridLines: { width: 0 },
    },
    {
        rowIndex: 1, columnIndex: 0, labelFormat: '{value}k',
        name: 'yAxis2', title: 'YAxis2', majorGridLines: { width: 0 },
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
        name: 'xAxis1', title: 'xAxis1', valueType: 'Category',
    },
    {
        columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
        name: 'xAxis2', title: 'xAxis2', valueType: 'Category',
    },
    {
        columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
        name: 'xAxis3', title: 'xAxis3', valueType: 'Category',
        opposedPosition: true,

    },
    {
        columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
        name: 'xAxis4', title: 'xAxis4', valueType: 'Category',
        opposedPosition: true,
    }],
    //Initializing Chart Series
    series: [
        {
            type: 'BoxAndWhisker',
            dataSource: chartData, xName: 'x', yName: 'y',
            marker: { visible: true, dataLabel: { visible: true } },
            animation: { enable: false }, xAxisName: 'xAxis1', yAxisName: 'yAxis1',
            name: 'Department1'
        },
        {
            type: 'BoxAndWhisker', boxPlotMode: 'Exclusive',
            dataSource: chartData, xName: 'x', yName: 'y',
            marker: { visible: true, width: 10, height: 10, dataLabel: { visible: true, position: 'Top' } },
            animation: { enable: false }, xAxisName: 'xAxis3', yAxisName: 'yAxis2',
            name: 'Department2'
        },
        {
            type: 'BoxAndWhisker', boxPlotMode: 'Inclusive',
            dataSource: chartData, xName: 'x', yName: 'y',
            marker: { visible: true, shape: 'Diamond', width: 10, height: 10, dataLabel: { visible: true, position: 'Bottom' } },
            animation: { enable: false }, xAxisName: 'xAxis2', yAxisName: 'yAxis3',
            name: 'Department3'
        },
        {
            type: 'BoxAndWhisker', xAxisName: 'xAxis4', yAxisName: 'yAxis4',
            dataSource: chartData, xName: 'x', yName: 'y',
            marker: { visible: true, width: 10, height: 10, dataLabel: { visible: true, position: 'Middle' } },
            animation: { enable: false }, showMean: false,
            name: 'Department4'
        },
        {
            type: 'BoxAndWhisker', xAxisName: 'xAxis4', yAxisName: 'yAxis4',
            dataSource: chartData, xName: 'x', yName: 'y',
            marker: { visible: true, width: 10, height: 10, dataLabel: { visible: true, position: 'Outer' } },
            animation: { enable: false }, showMean: false,
            name: 'Department5'
        }
    ],
    // Initializing the tooltip
    tooltip: {
        enable: true
    },
    pointRender: pointRender,
    height: '900',
    rows: [
        { height: '50%', border: { width: 2, color: 'red' } },
        { height: '50%', border: { width: 2, color: 'red' } },

    ],
    columns: [
        { width: '50%', border: { width: 2, color: 'black' } },
        { width: '50%', border: { width: 2, color: 'black' } },
    ],
    legendSettings: { visible: false },

}, '#container');
document.getElementById('axisinversed').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>getElement('axisinversed');
    for (let axis of chart.axisCollections) {
        axis.isInversed = element.checked;
    }
    chart.refresh();
};
let vertical: HTMLInputElement = document.getElementById('verticalchart') as HTMLInputElement;
vertical.onchange = () => {
    chart.isTransposed = vertical.checked;
    if (chart.isTransposed) {
        chart.axes = [{
            rowIndex: 0, columnIndex: 0,
            name: 'yAxis1', title: 'YAxis1', majorGridLines: { width: 0 },
        },
        {
            rowIndex: 0, columnIndex: 1, labelFormat: '{value}k',
            name: 'yAxis2', title: 'YAxis2', majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis3', title: 'YAxis3', opposedPosition: true,
        },

        {
            rowIndex: 1, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis4', title: 'YAxis4', opposedPosition: true,
        },
        {
            columnIndex: 0, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis1', title: 'xAxis1', valueType: 'Category',
        },
        {
            columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis2', title: 'xAxis2', valueType: 'Category',
        },
        {
            columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis3', title: 'xAxis3', valueType: 'Category',
            opposedPosition: true,

        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4', valueType: 'Category',
            opposedPosition: true,
        }];
    } else {
        chart.axes = [{
            rowIndex: 0, columnIndex: 0,
            name: 'yAxis1', title: 'YAxis1', majorGridLines: { width: 0 },
        },
        {
            rowIndex: 1, columnIndex: 0, labelFormat: '{value}k',
            name: 'yAxis2', title: 'YAxis2', majorGridLines: { width: 0 },
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
            name: 'xAxis1', title: 'xAxis1', valueType: 'Category',
        },
        {
            columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis2', title: 'xAxis2', valueType: 'Category',
        },
        {
            columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis3', title: 'xAxis3', valueType: 'Category',
            opposedPosition: true,

        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4', valueType: 'Category',
            opposedPosition: true,
        }];
    }
    chart.refresh();
};