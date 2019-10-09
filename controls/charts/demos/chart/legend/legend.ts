/**
 * line series
 */
import {
    Chart, AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, RadarSeries, PolarSeries, StackingAreaSeries,
    SplineSeries, StepAreaSeries, RangeColumnSeries, DataLabel, Category, Legend, ScatterSeries,
    ITextRenderEventArgs, Series, ErrorBar, Logarithmic, DateTime, ILegendRenderEventArgs, BarSeries, StackingBarSeries, StepLineSeries,
} from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { ChartSeriesType } from '../../../src/index';
Chart.Inject(
    AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, RadarSeries, PolarSeries, DataLabel,
    SplineSeries, StepAreaSeries, RangeColumnSeries, ErrorBar, Category, Legend, ScatterSeries,
    StackingAreaSeries, Logarithmic, DateTime
);

let chartData1: any[] = [
    { x: 1000, y: 73, low: 20, high: 35, open: 25, close: 30, size: 55 },
    { x: 2000, y: null, low: null, high: 55, open: 35, close: 45, size: 200 },
    { x: 3000, y: 75, low: 25, high: 75, open: 45, close: 55, size: 35 },
    { x: 4000, y: -50, low: 15, high: 45, open: 20, close: 25, size: 25 },
    { x: 5000, y: 56, low: 26, high: 76, open: 30, close: 45, size: 45 },
    { x: 6000, y: 60, low: 30, high: 80, open: 45, close: 65, size: 10 },
    { x: 7000, y: 41, low: 11, high: 61, open: 15, close: 35, size: 240 },
    { x: 8000, y: 45, low: 35, high: 95, open: 55, close: 65, size: 45 }
];
let chartData2: any[] = [
    { x: 1000, y: 133, low: 20, high: 35, open: 25, close: 30 },
    { x: 2000, y: 100, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 125, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 90, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 116, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 120, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 101, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 105, low: 35, high: 95, open: 55, close: 65 }
];

let chartData3: any[] = [
    { x: 1000, y: 163, low: 20, high: 35, open: 25, close: 30 },
    { x: 2000, y: 160, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 185, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 150, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 176, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 180, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 161, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 165, low: 35, high: 95, open: 55, close: 65 }
];
let chartData4: any[] = [
    { x: 1000, y: 223, low: 20, high: 35, open: 25, close: 30 },
    { x: 2000, y: 220, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 245, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 210, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 236, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 240, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 221, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 225, low: 35, high: 95, open: 55, close: 65 }
];
let legendRender: EmitType<ILegendRenderEventArgs> = (args: ILegendRenderEventArgs): void => {
    args.fill = 'red';
    args.text = 'legend';
    args.shape = 'Rectangle';
    args.markerShape = 'Triangle';
};

let chartObj: Chart = new Chart(
    {
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line',
                animation: { enable: false }, name: 'series1',
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'StepLine',
                animation: { enable: false }, name: 'series2',
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Spline',
                animation: { enable: false }, name: 'series3',
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'Area',
                animation: { enable: false }, name: 'series4'
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'StepArea',
                animation: { enable: false }, name: 'series5'
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column',
                animation: { enable: false }, name: 'series6'
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line',
                animation: { enable: false }, name: 'series7', marker: { visible: true }
            },
        ],
        legendSettings: { visible: true, position: 'Left', background: '#98FB98', border: { color: 'black', width: 2 } },
    });
chartObj.appendTo('#container1');
let chartObj1: Chart = new Chart(
    {
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line',
                animation: { enable: false }, name: 'series1', legendShape: 'Circle'
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'StepLine',
                animation: { enable: false }, name: 'series2', legendShape: 'Rectangle'
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Spline',
                animation: { enable: false }, name: 'series3', legendShape: 'Triangle'
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'Area',
                animation: { enable: false }, name: 'series4', legendShape: 'Diamond'
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'StepArea',
                animation: { enable: false }, name: 'series5', legendShape: 'Cross'
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column',
                animation: { enable: false }, name: 'series6', legendShape: 'HorizontalLine'
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line', legendShape: 'VerticalLine',
                animation: { enable: false }, name: 'series7', marker: { visible: true }
            },
            {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'StepArea',
                animation: { enable: false }, name: 'series8', legendShape: 'Pentagon'
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Column',
                animation: { enable: false }, name: 'series9', legendShape: 'InvertedTriangle'
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line', legendShape: 'SeriesType',
                animation: { enable: false }, name: 'series10', marker: { visible: true }
            },
        ],
        legendSettings: {
            visible: true, position: 'Bottom', alignment: 'Near', padding: 10, shapePadding: 8, shapeHeight: 12, shapeWidth: 12
        },
    });
chartObj1.appendTo('#container2');
let chartObj2: Chart = new Chart(
    {
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', drawType: 'Area',
                animation: { enable: false }, name: 'series1'
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', name: 'series2',
                animation: { enable: false }, marker: { visible: true, },
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y',
                animation: { enable: false }, name: 'series3',
                marker: { visible: true, dataLabel: { visible: true } },
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y',
                animation: { enable: false }, name: 'series4',
                marker: { visible: true, dataLabel: { visible: true } }, isClosed: false
            },
        ],
        legendSettings: {
            visible: true, position: 'Right', alignment: 'Far',
            textStyle: { size: '20px', color: 'blue', fontStyle: 'Bold', fontFamily: 'Times New Roman', }
        },
    });
chartObj2.appendTo('#container3');
let chartObj3: Chart = new Chart(
    {
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y',
                animation: { enable: false }, name: 'series1',
                marker: { visible: true, dataLabel: { visible: true } },
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y',
                animation: { enable: false }, name: 'series2',
                marker: { visible: true, dataLabel: { visible: true } },
            },
        ],
        legendRender: legendRender,
        legendSettings: { visible: true, position: 'Custom', location: { x: 550, y: 350 }, opacity: 0.3 },
    });
chartObj3.appendTo('#container4');