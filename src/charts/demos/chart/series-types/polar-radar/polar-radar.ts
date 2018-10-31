/**
 * line series
 */
import {
    Chart, AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, RadarSeries, PolarSeries, StackingAreaSeries,
    SplineSeries, StepAreaSeries, RangeColumnSeries, DataLabel, Category, Legend, ScatterSeries, IAxisLabelRenderEventArgs,
    ITextRenderEventArgs, Series, ErrorBar, Logarithmic, DateTime, IPointRenderEventArgs, ISeriesRenderEventArgs,
} from '../../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { ChartSeriesType } from '../../../../src/index';
import { seriesData1 } from '../../../../spec/chart/base/data.spec';
Chart.Inject(
    AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, RadarSeries, PolarSeries, DataLabel,
    SplineSeries, StepAreaSeries, RangeColumnSeries, ErrorBar, Category, Legend, ScatterSeries,
    StackingAreaSeries, Logarithmic, DateTime
);

let textRender: EmitType<ITextRenderEventArgs> = (args: ITextRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 2) {
        if (args.point.index === 2) {
            args.color = 'red';
            args.border.color = 'black';
            args.border.width = 1.5;
            args.template = '<div id="temp">Template</div>';
        }
    }
};
let seriesRender: EmitType<ISeriesRenderEventArgs> = (args: ISeriesRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 0) {
        args.name = 'seriesRender';
        args.fill = 'grey';
    }
};
let labelRender: EmitType<IAxisLabelRenderEventArgs> = (args: IAxisLabelRenderEventArgs): void => {
    if (args.axis.columnIndex === 0) {
        if (args.value === 1000) {
            args.text = 'axis Render';
        }
    }
};
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
let chartData11: any[] = [
    { x: 'USA', y: 50 }, { x: 'China', y: 40 },
    { x: 'Japan', y: 70 }, { x: 'Australia', y: 60 },
    { x: 'France', y: 50 }, { x: 'Germany', y: null },
    { x: 'Italy', y: 40 }, { x: 'Sweden', y: 30 }
];
let chartData22: any[] = [
    { x: 'USA', y: 70 }, { x: 'China', y: 60 },
    { x: 'Japan', y: 60 }, { x: 'Australia', y: 56 },
    { x: 'France', y: 45 }, { x: 'Germany', y: 30 },
    { x: 'Italy', y: 35 }, { x: 'Sweden', y: 25 }
];

export let rotateData1: any[] = [{ x: new Date(2000, 6, 11), low: 10, high: 20 }, { x: new Date(2002, 3, 7), low: -30, high: 40 },
{ x: new Date(2004, 3, 6), low: 15, high: 35 }, { x: new Date(2006, 3, 30), low: -65, high: 30 },
{ x: new Date(2008, 3, 8), low: 0, high: 40 }, { x: new Date(2010, 3, 8), low: 85, high: 30 }];

export let rotateData2: any[] = [{ x: new Date(2000, 6, 11), low: -30, high: 50 }, { x: new Date(2002, 3, 7), low: 10, high: 60 },
{ x: new Date(2004, 3, 6), low: 0, high: 40 }, { x: new Date(2006, 3, 30), low: 75, high: 100 },
{ x: new Date(2008, 3, 8), low: 45, high: 10 }, { x: new Date(2010, 3, 8), low: 32, high: 39 }];

let pointRender: EmitType<IPointRenderEventArgs> = (args: IPointRenderEventArgs): void => {
    if (args.series.index === 1) {
        if (args.point.index === 3) {
            args.fill = 'blue';
            args.border.color = 'red';
            args.border.width = 1;
        }
    }
};

let chartObj: Chart = new Chart(
    {
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Area',
                animation: { enable: false },
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'Polar',
                animation: { enable: false }, marker: { visible: true, },
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Polar',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } }, drawType: 'Scatter'
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'Polar',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } }, isClosed: false
            },
        ],
        textRender: textRender,
        axisLabelRender: labelRender,
        legendSettings: { visible: false },
    });
chartObj.appendTo('#container1');
let chartObj1: Chart = new Chart(
    {
        primaryXAxis: {
            isInversed: true,
            minorGridLines: {
                width: 1, color: 'red'
            },
            minorTickLines: {
                width: 1, color: 'red'
            },
            minorTicksPerInterval: 2
        },
        primaryYAxis: {
            isInversed: true,
            valueType: 'Logarithmic'
        },
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Polar',
                animation: { enable: false }, name: 'series1', drawType: 'Spline',
                marker: { visible: true, dataLabel: { visible: true } },
            }, {
                dataSource: chartData2, xName: 'x', yName: 'y', type: 'Polar',
                animation: { enable: false }, name: 'series2', drawType: 'Spline',
                marker: { visible: true, dataLabel: { visible: true } },
            },
        ],
        legendSettings: { visible: true },
    });
chartObj1.appendTo('#container2');
let chartObj2: Chart = new Chart(
    {
        primaryXAxis: {
            startAngle: 90,
            coefficient: 80,
            valueType: 'DateTime'
        },
        primaryYAxis: {
        },
        series: [
            {
                dataSource: rotateData1, xName: 'x', yName: 'low', type: 'Polar', drawType: 'RangeColumn',
                animation: { enable: false }, high: 'high', low: 'low',
                marker: { visible: true, dataLabel: { visible: true } },
            }, {
                dataSource: rotateData2, xName: 'x', yName: 'low', type: 'Polar', drawType: 'RangeColumn',
                animation: { enable: false }, high: 'high', low: 'low',
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
            },
            {
                dataSource: rotateData1, xName: 'x', yName: 'low', type: 'Polar', drawType: 'RangeColumn',
                animation: { enable: false }, high: 'high', low: 'low',
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
            },
        ],
        seriesRender: seriesRender,
        legendSettings: { visible: false },
    });
chartObj2.appendTo('#container3');
let chartObj3: Chart = new Chart(
    {
        primaryXAxis: {
            valueType: 'Category'
        },
        series: [
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Column',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } }, errorBar: { visible: true, mode: 'Vertical' }
            }, {
                dataSource: chartData22, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Column',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
            },
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Column',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Bottom' } },
            },
            {
                dataSource: chartData22, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Column',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Middle' } },
            },
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'Column',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
            },
        ],
        pointRender: pointRender,
        legendSettings: { visible: false },
    });
chartObj3.appendTo('#container4');
let chartObj4: Chart = new Chart(
    {
        primaryXAxis: {
            valueType: 'Category',
            labelPlacement: 'OnTicks'
        },
        series: [
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'a',
                marker: { visible: true, dataLabel: { visible: true } }, errorBar: { visible: true, mode: 'Vertical' }
            }, {
                dataSource: chartData22, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'a',
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
            },
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'b',
                marker: { visible: true, dataLabel: { visible: true, position: 'Bottom' } },
            },
            {
                dataSource: chartData22, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn',
                animation: { enable: false }, stackingGroup: 'b',
                marker: { visible: true, dataLabel: { visible: true, position: 'Outer' } },
            },
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingColumn',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true, position: 'Top' } },
            },
        ],
        legendSettings: { visible: false },
    });
chartObj4.appendTo('#container5');
let chartObj5: Chart = new Chart(
    {
        primaryXAxis: {
            valueType: 'Category', isIndexed: true
        },
        series: [
            {
                dataSource: chartData11, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingArea',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } },
            }, {
                dataSource: chartData22, xName: 'x', yName: 'y', type: 'Polar', drawType: 'StackingArea',
                animation: { enable: false },
                marker: { visible: true, dataLabel: { visible: true } },
            },
        ],
        title: 'Polar Radar Charts',
        palettes: ['#E94649', '#F6B53F', '#6FAAB0', '#C4C24A'],
        legendSettings: { visible: false },
    });
chartObj5.appendTo('#container6');

document.getElementById('seriestype').onchange = () => {
    let element: HTMLSelectElement = <HTMLSelectElement>document.getElementById('seriestype');
    for (let series of chartObj.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj.refresh();
    for (let series of chartObj1.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj1.refresh();
    for (let series of chartObj2.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj2.refresh();
    for (let series of chartObj3.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj3.refresh();
    for (let series of chartObj4.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj4.refresh();
    for (let series of chartObj5.series) {
        series.type = element.value as ChartSeriesType;
    }
    chartObj5.refresh();
};