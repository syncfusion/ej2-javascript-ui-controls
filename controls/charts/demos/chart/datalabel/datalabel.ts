/**
 * line series
 */
import {
    Chart, AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, StackingBarSeries, BarSeries, StackingAreaSeries,
    StepLineSeries, SplineSeries, StepAreaSeries, RangeColumnSeries, RangeAreaSeries, CandleSeries, DataLabel,
    HiloOpenCloseSeries, HiloSeries, ITextRenderEventArgs, Series, BubbleSeries
} from '../../../src/chart/index';
import { EmitType } from '@syncfusion/ej2-base';
Chart.Inject(
    AreaSeries, LineSeries, ColumnSeries, StackingColumnSeries, StackingBarSeries, BarSeries, DataLabel,
    StepLineSeries, SplineSeries, StepAreaSeries, RangeColumnSeries, RangeAreaSeries, CandleSeries,
    StackingAreaSeries, HiloOpenCloseSeries, HiloSeries, BubbleSeries
);

let textRender: EmitType<ITextRenderEventArgs> = (args: ITextRenderEventArgs): void => {
    if ((<Series>(args.series)).index === 8) {
        if (args.point.index === 2) {
            args.color = 'red';
            args.border.color = 'black';
            args.border.width = 1.5;
            args.template = '<div id="temp">Template</div>';
        }
    };
    if ((<Series>(args.series)).index === 8) {
        if (args.point.index === 6) {
            args.border.color = 'grey';
            args.border.width = 1.5;
            args.text = 'text';
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
let chartData3: any[] = [
    { x: 1000, y: 93, low: 20, high: 45, open: 35, close: 30 },
    { x: 2000, y: 60, low: 35, high: 55, open: 35, close: 45 },
    { x: 3000, y: 95, low: 25, high: 75, open: 45, close: 55 },
    { x: 4000, y: 50, low: 15, high: 45, open: 20, close: 25 },
    { x: 5000, y: 76, low: 26, high: 76, open: 30, close: 45 },
    { x: 6000, y: 80, low: 30, high: 80, open: 45, close: 65 },
    { x: 7000, y: 61, low: 11, high: 61, open: 15, close: 35 },
    { x: 8000, y: 65, low: 35, high: 95, open: 55, close: 65 }
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
        }],
        height: '890',
        textRender: textRender,
        series: [
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Line', open: 'open', low: 'low', high: 'high', close: 'close',
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', stackingGroup: 'a', size: 'size',
                marker: { dataLabel: { visible: true } }, border: { width: 2, color: 'black' },
                emptyPointSettings: { mode: 'Drop' }, animation: { enable: false }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Line', fill: 'red',
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true } }, animation: { enable: false },
                bearFillColor: '#e56590', bullFillColor: '#f8b883', enableSolidCandles: true
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'Line', stackingGroup: 'a',
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true } }, animation: { enable: false },
                columnWidth: 0.5,
            },
            {
                dataSource: chartData5, xName: 'x', yName: 'y', type: 'Line', columnWidth: 0.4,
                xAxisName: 'xAxis1', yAxisName: 'yAxis1', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true } }, animation: { enable: false }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Area',
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Top' } },
                emptyPointSettings: { mode: 'Gap' }, animation: { enable: false }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'StepLine',
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Top' } }, animation: { enable: false }
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'StepLine', size: 'size',
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: {
                    dataLabel: {
                        visible: true, position: 'Top', margin: { right: 30 },
                        template: '#image'
                    }
                }, animation: { enable: false }
            },
            {
                dataSource: chartData5, xName: 'x', yName: 'y', type: 'StepLine',
                xAxisName: 'xAxis3', yAxisName: 'yAxis2', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: {
                    dataLabel: {
                        visible: true, position: 'Top', margin: { right: 30 },
                    }
                }, animation: { enable: false }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'StackingArea', size: 'size',
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Bottom' } },
                cornerRadius: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 },
                emptyPointSettings: { mode: 'Zero' }, animation: { enable: false }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'StackingArea',
                cornerRadius: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 },
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Bottom' } }, animation: { enable: false }
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'StackingArea', columnSpacing: 0.5,
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Bottom' } }, animation: { enable: false }
            },
            {
                dataSource: chartData5, xName: 'x', yName: 'y', type: 'StackingArea',
                xAxisName: 'xAxis2', yAxisName: 'yAxis3', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Bottom' } }, animation: { enable: false }
            },
            {
                dataSource: chartData1, xName: 'x', yName: 'y', type: 'Spline', stackingGroup: 'a', size: 'size',
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Middle' } },
                emptyPointSettings: { mode: 'Average' }, animation: { enable: false }
            },
            {
                dataSource: chartData3, xName: 'x', yName: 'y', type: 'Spline', stackingGroup: 'a',
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Middle' } }, animation: { enable: false }
            },
            {
                dataSource: chartData4, xName: 'x', yName: 'y', type: 'Spline', stackingGroup: 'b',
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Middle' } }, animation: { enable: false }
            },
            {
                dataSource: chartData5, xName: 'x', yName: 'y', type: 'Spline',
                xAxisName: 'xAxis4', yAxisName: 'yAxis4', open: 'open', low: 'low', high: 'high', close: 'close',
                marker: { dataLabel: { visible: true, position: 'Middle' } }, animation: { enable: false }
            },
        ],
        rows: [
            { height: '50%', border: { width: 2, color: 'red' } },
            { height: '50%', border: { width: 2, color: 'red' } },

        ],
        columns: [
            { width: '50%', border: { width: 2, color: 'black' } },
            { width: '50%', border: { width: 2, color: 'black' } },
        ], legendSettings: { visible: false },
    });
chartObj.appendTo('#container');

let seriesType: HTMLSelectElement = document.getElementById('seriestype') as HTMLSelectElement;
seriesType.onchange = () => {
    if (seriesType.value === 'Column') {
        chartObj.series[2].type = 'StackingColumn100'; chartObj.series[3].type = 'StackingColumn100';
        chartObj.series[0].type = 'StackingColumn100'; chartObj.series[1].type = 'StackingColumn100';
        chartObj.series[6].type = 'Column'; chartObj.series[7].type = 'Column';
        chartObj.series[4].type = 'StackingColumn'; chartObj.series[5].type = 'StackingColumn';
        chartObj.series[10].type = 'Column'; chartObj.series[11].type = 'Column';
        chartObj.series[8].type = 'StackingColumn'; chartObj.series[9].type = 'StackingColumn';
        chartObj.series[14].type = 'Column'; chartObj.series[15].type = 'StackingColumn';
        chartObj.series[12].type = 'StackingColumn'; chartObj.series[13].type = 'StackingColumn';
    } else if (seriesType.value === 'Bar') {
        chartObj.series[2].type = 'StackingBar100'; chartObj.series[3].type = 'StackingBar100';
        chartObj.series[0].type = 'StackingBar100'; chartObj.series[1].type = 'StackingBar100';
        chartObj.series[6].type = 'Bar'; chartObj.series[7].type = 'Bar';
        chartObj.series[4].type = 'StackingBar'; chartObj.series[5].type = 'StackingBar';
        chartObj.series[10].type = 'Bar'; chartObj.series[11].type = 'Bar';
        chartObj.series[8].type = 'StackingBar'; chartObj.series[9].type = 'StackingBar';
        chartObj.series[14].type = 'Bar'; chartObj.series[15].type = 'Bar';
        chartObj.series[13].type = 'StackingBar'; chartObj.series[12].type = 'StackingBar';
    } else if (seriesType.value === 'Line') {
        chartObj.series[0].type = 'Line'; chartObj.series[1].type = 'Line';
        chartObj.series[2].type = 'Line'; chartObj.series[3].type = 'Line';
        chartObj.series[4].type = 'Area'; chartObj.series[5].type = 'StepLine';
        chartObj.series[6].type = 'StepLine'; chartObj.series[7].type = 'StepLine';
        chartObj.series[8].type = 'StackingArea'; chartObj.series[9].type = 'StackingArea';
        chartObj.series[10].type = 'StackingArea'; chartObj.series[11].type = 'StackingArea';
        chartObj.series[12].type = 'Spline'; chartObj.series[15].type = 'Spline';
        chartObj.series[13].type = 'Spline'; chartObj.series[14].type = 'Spline';
    } else if (seriesType.value === 'Financial Series') {
        chartObj.series[0].type = 'RangeColumn'; chartObj.series[1].type = 'Candle';
        chartObj.series[2].type = 'Hilo'; chartObj.series[3].type = 'HiloOpenClose';
        chartObj.series[4].type = 'RangeColumn'; chartObj.series[5].type = 'Hilo';
        chartObj.series[6].type = 'HiloOpenClose'; chartObj.series[7].type = 'Candle';
        chartObj.series[8].type = 'RangeColumn'; chartObj.series[9].type = 'Hilo';
        chartObj.series[10].type = 'HiloOpenClose'; chartObj.series[11].type = 'Candle';
        chartObj.series[12].type = 'RangeColumn'; chartObj.series[13].type = 'Hilo';
        chartObj.series[14].type = 'HiloOpenClose'; chartObj.series[15].type = 'Candle';
    } else {
        for (let series of chartObj.series) {
            series.type = 'Bubble';
        }
    }
    if (seriesType.value === 'Bar') {
        chartObj.series[0].xAxisName = 'yAxis1'; chartObj.series[0].yAxisName = 'xAxis1';
        chartObj.series[1].xAxisName = 'yAxis1'; chartObj.series[1].yAxisName = 'xAxis1';
        chartObj.series[2].xAxisName = 'yAxis1'; chartObj.series[2].yAxisName = 'xAxis1';
        chartObj.series[3].xAxisName = 'yAxis1'; chartObj.series[3].yAxisName = 'xAxis1';
        chartObj.series[4].xAxisName = 'yAxis2'; chartObj.series[4].yAxisName = 'xAxis3';
        chartObj.series[5].xAxisName = 'yAxis2'; chartObj.series[5].yAxisName = 'xAxis3';
        chartObj.series[6].xAxisName = 'yAxis2'; chartObj.series[6].yAxisName = 'xAxis3';
        chartObj.series[7].xAxisName = 'yAxis2'; chartObj.series[7].yAxisName = 'xAxis3';
        chartObj.series[8].xAxisName = 'yAxis3'; chartObj.series[8].yAxisName = 'xAxis2';
        chartObj.series[9].xAxisName = 'yAxis3'; chartObj.series[9].yAxisName = 'xAxis2';
        chartObj.series[10].xAxisName = 'yAxis3'; chartObj.series[10].yAxisName = 'xAxis2';
        chartObj.series[11].xAxisName = 'yAxis3'; chartObj.series[11].yAxisName = 'xAxis2';
        chartObj.series[12].xAxisName = 'yAxis4'; chartObj.series[12].yAxisName = 'xAxis4';
        chartObj.series[13].xAxisName = 'yAxis4'; chartObj.series[13].yAxisName = 'xAxis4';
        chartObj.series[14].xAxisName = 'yAxis4'; chartObj.series[14].yAxisName = 'xAxis4';
        chartObj.series[15].xAxisName = 'yAxis4'; chartObj.series[15].yAxisName = 'xAxis4';
    } else {
        chartObj.series[0].yAxisName = 'yAxis1'; chartObj.series[0].xAxisName = 'xAxis1';
        chartObj.series[1].yAxisName = 'yAxis1'; chartObj.series[1].xAxisName = 'xAxis1';
        chartObj.series[2].yAxisName = 'yAxis1'; chartObj.series[2].xAxisName = 'xAxis1';
        chartObj.series[3].yAxisName = 'yAxis1'; chartObj.series[3].xAxisName = 'xAxis1';
        chartObj.series[4].yAxisName = 'yAxis2'; chartObj.series[4].xAxisName = 'xAxis3';
        chartObj.series[5].yAxisName = 'yAxis2'; chartObj.series[5].xAxisName = 'xAxis3';
        chartObj.series[6].yAxisName = 'yAxis2'; chartObj.series[6].xAxisName = 'xAxis3';
        chartObj.series[7].yAxisName = 'yAxis2'; chartObj.series[7].xAxisName = 'xAxis3';
        chartObj.series[8].yAxisName = 'yAxis3'; chartObj.series[8].xAxisName = 'xAxis2';
        chartObj.series[9].yAxisName = 'yAxis3'; chartObj.series[9].xAxisName = 'xAxis2';
        chartObj.series[10].yAxisName = 'yAxis3'; chartObj.series[10].xAxisName = 'xAxis2';
        chartObj.series[11].yAxisName = 'yAxis3'; chartObj.series[11].xAxisName = 'xAxis2';
        chartObj.series[12].yAxisName = 'yAxis4'; chartObj.series[12].xAxisName = 'xAxis4';
        chartObj.series[13].yAxisName = 'yAxis4'; chartObj.series[13].xAxisName = 'xAxis4';
        chartObj.series[14].yAxisName = 'yAxis4'; chartObj.series[14].xAxisName = 'xAxis4';
        chartObj.series[15].yAxisName = 'yAxis4'; chartObj.series[15].xAxisName = 'xAxis4';
    }
    if (seriesType.value !== 'Bubble') {
        for (let series of chartObj.series) {
            series.visible = true;
        }
    } else {
        for (let series of chartObj.series) {
            series.visible = false;
        }
        chartObj.series[0].visible = true;
        chartObj.series[6].visible = true;
        chartObj.series[8].visible = true;
        chartObj.series[12].visible = true;
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
let sidebyside: HTMLInputElement = document.getElementById('sidebyside') as HTMLInputElement;
sidebyside.onchange = () => {
    chartObj.enableSideBySidePlacement = sidebyside.checked;
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
            columnIndex: 0, rowIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis1', title: 'xAxis1',

        },
        {
            rowIndex: 1, columnIndex: 0, majorGridLines: { width: 0 },
            name: 'xAxis2', title: 'xAxis2',

        },
        {
            rowIndex: 0, columnIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis3', title: 'xAxis3',
            opposedPosition: true,

        },
        {
            columnIndex: 1, rowIndex: 1, majorGridLines: { width: 0 },
            name: 'xAxis4', title: 'xAxis4',
            opposedPosition: true,
        }];
        chartObj.series[5].marker.dataLabel.template = '';
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
        }];
        chartObj.series[5].marker.dataLabel.template = '#image';
    }
    chartObj.refresh();
};