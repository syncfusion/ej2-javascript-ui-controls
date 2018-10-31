/**
 * line series
 */
import {
    Chart, AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, StackingBarSeries, BarSeries, StackingAreaSeries,
    StepLineSeries, SplineSeries, StepAreaSeries, RangeColumnSeries, RangeAreaSeries, CandleSeries, DataLabel,
    HiloOpenCloseSeries, HiloSeries, ITextRenderEventArgs, Series, Tooltip, BubbleSeries, ErrorBar, ErrorBarType, ChartSeriesType
} from '../../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(
    AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, StackingBarSeries, BarSeries, DataLabel,
    StepLineSeries, SplineSeries, StepAreaSeries, RangeColumnSeries, RangeAreaSeries, CandleSeries,
    StackingAreaSeries, HiloOpenCloseSeries, HiloSeries, BubbleSeries, ErrorBar, Tooltip
);

let textRender: EmitType<ITextRenderEventArgs> = (args: ITextRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 2) {
        if (args.point.index === 2) {
            args.color = 'red';
        }
    }
};

let chartData1: any[] = [
    { x: 1000, y: 73, low: 20, high: 35, open: 25, close: 30, size: 55 },
    { x: 2000, y: null, low: null, high: 55, open: 35, close: 45, size: 200 },
    { x: 3000, y: 75, low: 25, high: 75, open: 45, close: 55, size: 35 },
    { x: 4000, y: -50, low: 15, high: 45, open: 20, close: 25, size: 25 },
    { x: 5000, y: 56, low: 26, high: 76, open: 30, close: 45, size: 45 },
];
let chartData3: any[] = [
    { x: 1000, y: 93, low: 20, high: 45, open: 35, close: 30 },
    { x: 2000, y: 60, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 95, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 50, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 76, low: 26, high: 76, open: 30, close: 45 },
];
let chartData4: any[] = [
    { x: 1000, y: 113, low: 20, high: 35, open: 25, close: 30, size: 65 },
    { x: 2000, y: 80, low: 35, high: 55, open: 35, close: 45, size: 500 },
    { x: 3000, y: 115, low: 25, high: 75, open: 45, close: 55, size: 85 },
    { x: 4000, y: 70, low: 15, high: 45, open: 20, close: 25, size: 25 },
    { x: 5000, y: 96, low: 26, high: 76, open: 30, close: 45, size: 45 },
    { x: 6000, y: 100, low: 30, high: 80, open: 45, close: 65, size: 30 },
    { x: 7000, y: 81, low: 11, high: 61, open: 15, close: 35, size: 100 },
    { x: 8000, y: 85, low: 35, high: 95, open: 55, close: 65, size: 55 }
];
let chartData5: any[] = [
    { x: 1000, y: 133, low: 20, high: 35, open: 25, close: 30 },
    { x: 2000, y: 100, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 125, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 90, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 116, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 120, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 101, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 105, low: 35, high: 95, open: 55, close: 65 }
];
let chartObj: Chart = new Chart(
    {
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
            rowIndex: 2, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis5', title: 'YAxis5', opposedPosition: true,
        },
        {
            rowIndex: 2, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis6', title: 'YAxis6',
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
        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4',
        }, {
            columnIndex: 0, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis5', title: 'xAxis5', opposedPosition: true,
        }, {
            columnIndex: 1, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis6', title: 'xAxis6', opposedPosition: true,
        }],
        height: '900',
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', stackingGroup: 'a', size: 'size', animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } }, errorBar: { visible: true, mode: 'Vertical' }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', stackingGroup: 'a', size: 'size',animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
                errorBar: { visible: true, mode: 'Vertical', verticalError: 5 }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', animation: { enable: false },
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', emptyPointSettings: { mode: 'Drop' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
                errorBar: {
                    visible: true, mode: 'Horizontal',
                    errorBarCap: { color: 'red', width: 4, length: 20, opacity: 0.5 }
                }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column', animation: { enable: false },
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', emptyPointSettings: { mode: 'Drop' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
                errorBar: {
                    visible: true, mode: 'Horizontal', horizontalError: 4
                }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', size: 'size', animation: { enable: false },
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', emptyPointSettings: { mode: 'Average', fill: 'red' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Bottom' } },
                errorBar: { visible: true, mode: 'Both', }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column', size: 'size', animation: { enable: false },
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', emptyPointSettings: { mode: 'Average' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Bottom' } },
                errorBar: { visible: true, mode: 'Both', verticalError: 3, horizontalError: 3, }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', size: 'size', animation: { enable: false },
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', emptyPointSettings: { mode: 'Zero' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Middle' } },
                errorBar: { visible: true, direction: 'Both', color: 'blue', }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column', size: 'size', animation: { enable: false },
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', emptyPointSettings: { mode: 'Zero' },
                marker: { visible: true, dataLabel: { visible: true, position: 'Middle' } },
                errorBar: { visible: true, direction: 'Both', color: 'blue', verticalError: 3, horizontalError: 3 }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis5', yAxisName: 'yAxis5', stackingGroup: 'a', size: 'size',
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
                errorBar: { visible: true, direction: 'Minus', },animation: { enable: false },
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Line', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis5', yAxisName: 'yAxis5', stackingGroup: 'a', size: 'size', animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Bottom' } },
                errorBar: { visible: true, direction: 'Minus', verticalError: 5, }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Column', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis6', yAxisName: 'yAxis6', stackingGroup: 'a', size: 'size', animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
                errorBar: { visible: true, direction: 'Plus', width: 3 }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column', emptyPointSettings: { mode: 'Gap' },
                xAxisName: 'xAxis6', yAxisName: 'yAxis6', stackingGroup: 'a', size: 'size',
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } }, animation: { enable: false },
                errorBar: { visible: true, direction: 'Plus', width: 3, verticalError: 3, horizontalError: 3 }
            }
        ],
        rows: [
            { height: '33%', border: { width: 2, color: 'red' } },
            { height: '33%', border: { width: 2, color: 'red' } },
            { height: '33%', border: { width: 2, color: 'red' } },
        ],
        columns: [
            { width: '50%', border: { width: 2, color: 'black' } },
            { width: '50%', border: { width: 2, color: 'black' } },
        ], legendSettings: { visible: false }, tooltip: { enable: true}
    });
chartObj.appendTo('#container');

let errortype: HTMLSelectElement = document.getElementById('errortype') as HTMLSelectElement;
errortype.onchange = () => {
    for (let series of chartObj.series) {
        series.errorBar.type = <ErrorBarType>errortype.value;
    }
    if (errortype.value === 'Custom') {
        for (let series of chartObj.series) {
            if ((<Series>series).index !== 0) {
                series.errorBar.verticalNegativeError = 5;
                series.errorBar.verticalPositiveError = 5;
                series.errorBar.horizontalNegativeError = 5;
                series.errorBar.horizontalPositiveError = 5;
            }
        }
    }
    chartObj.refresh();
};

let inversed: HTMLInputElement = document.getElementById('inversed') as HTMLInputElement;
inversed.onchange = () => {
    for (let axis of chartObj.axisCollections) {
        axis.isInversed = inversed.checked;
    }
    chartObj.refresh();
};
let stacking: HTMLInputElement = document.getElementById('stacking') as HTMLInputElement;
stacking.onchange = () => {
    for (let series of chartObj.series) {
        series.type = 'StackingColumn';
    }
    chartObj.refresh();
};

let vertical: HTMLInputElement = document.getElementById('vertical') as HTMLInputElement;
vertical.onchange = () => {
    chartObj.isTransposed = vertical.checked;
    if (chartObj.isTransposed) {
        chartObj.axes = [{
            rowIndex: 0, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis1', title: 'YAxis1',
        },
        {
            columnIndex: 1, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis2', title: 'YAxis2',
        },
        {
            columnIndex: 0, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis3', title: 'YAxis3', opposedPosition: true,
        },
        {
            rowIndex: 1, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis4', title: 'YAxis4', opposedPosition: true,
        },
        {
            rowIndex: 2, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis5', title: 'YAxis5', opposedPosition: true,
        },
        {
            rowIndex: 2, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis6', title: 'YAxis6',
        },
        {
            columnIndex: 0, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis1', title: 'xAxis1',
        },
        {
            rowIndex: 1, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis2', title: 'xAxis2',
        },
        {
            rowIndex: 0, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis3', title: 'xAxis3', opposedPosition: true,
        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4', opposedPosition: true,
        }, {
            columnIndex: 0, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis5', title: 'xAxis5', opposedPosition: true,
        }, {
            columnIndex: 1, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis6', title: 'xAxis6', opposedPosition: true,
        }];
    } else {
        chartObj.axes = [{
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
            rowIndex: 2, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'yAxis5', title: 'YAxis5', opposedPosition: true,
        },
        {
            rowIndex: 2, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'yAxis6', title: 'YAxis6',
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
            name: 'xAxis3', title: 'xAxis3', opposedPosition: true,
        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4', opposedPosition: true,
        }, {
            columnIndex: 0, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis5', title: 'xAxis5', opposedPosition: true,
        }, {
            columnIndex: 1, rowIndex: 2, majorGridLines: { width: 0 },
            name: 'xAxis6', title: 'xAxis6', opposedPosition: true,
        }];
    }
    chartObj.refresh();
};