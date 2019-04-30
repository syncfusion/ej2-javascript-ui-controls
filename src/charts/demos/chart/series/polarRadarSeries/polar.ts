/** 
 * Line
 */
import {
    Chart, Logarithmic, Zoom, PolarSeries, DateTime, Category, RadarSeries, AreaSeries, StackingAreaSeries,
    SplineSeries, Tooltip, LineSeries, DataLabel, ChartDrawType, ScatterSeries,
} from '../../../../src/chart/index';
import { Legend } from '../../../../src/chart/legend/legend';
import '../../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(Legend, Logarithmic, Zoom, PolarSeries, RadarSeries, DateTime, AreaSeries, StackingAreaSeries,
             SplineSeries, Tooltip, Category, LineSeries, DataLabel, ScatterSeries);

export let data: Object[] = [
                { x: 'Jan', low: 2.7, high: 6.1 }, { x: 'Feb', low: 3.3, high: 6.3 },
                { x: 'Mar', low: 3.9, high: 8.5 }, { x: 'Apr', low: 5.1, high: 10.8 },
                { x: 'May', low: 7.7, high: 14.4 }, { x: 'June', low: 10.4, high: 16.9 },
                { x: 'July', low: 12.6, high: 19.2 }, { x: 'Aug', low: 12.5, high: 18.9 },
                { x: 'Sep', low: 10.5, high: 16.1 }, { x: 'Oct', low: 8.0, high: 12.5 },
                { x: 'Nov', low: 3.5, high: 6.9 }, { x: 'Dec', low: 7.1, high: 12.1 }
            ];
export let data1: Object[] = [{ x: "North", y: 42 }, { x: "NorthEast", y: 28 },
{ x: "East", y: 40 }, { x: "SouthEast", y: 45 },
{ x: "South", y: 20 }, { x: "SouthWest", y: 40 },
{ x: "West", y: 25 }, { x: "NorthWest", y: 40 }];

export let data2: Object[] = [{ x: "North", y: 63 }, { x: "NorthEast", y: 73 },
{ x: "East", y: 58 }, { x: "SouthEast", y: 65 },
{ x: "South", y: 47 }, { x: "SouthWest", y: 70 },
{ x: "West", y: 45 }, { x: "NorthWest", y: 70 }];

export let data3: Object[] = [{ x: "North", y: 80 }, { x: "NorthEast", y: 88 },
{ x: "East", y: 79 }, { x: "SouthEast", y: 83 },
{ x: "South", y: 78 }, { x: "SouthWest", y: 90 },
{ x: "West", y: 78 }, { x: "NorthWest", y: 85 }];

let chart: Chart = new Chart({
    primaryXAxis: {
        valueType: 'Category',
    },
    primaryYAxis: {
    },
    series: [
        {
            dataSource: data1,
            border: { width: 1, color: 'white' },
            name: 'Series1', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
            fill: '#3d5ee0'
        },
        {
            dataSource: data2,
            border: { width: 1, color: 'white' },
            name: 'Series2', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
            fill: '#4de03d'
        },
        {
            dataSource: data3,
            border: { width: 1, color: 'white' },
            name: 'Series3', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
            fill: '#e03d9f'
        },
    ],
    tooltip: {
        enable: true
    },
});
chart.appendTo('#container');
document.getElementById("SelectSeriesDrawType").onchange = () => {
    let element: HTMLSelectElement = <HTMLSelectElement>(document.getElementById('SelectSeriesDrawType'));
    if (element.value === 'RangeColumn') {
        chart.series = [
        { dataSource: data, border: { width: 1, color: 'white' }, drawType: 'RangeColumn', fill: '#e03d9f',
        name: 'Series3', type: 'Polar', xName: 'x', low: 'low', high: 'high', animation: { enable: false },
        }
    ];
    } else if (element.value === 'Area') {
        chart.series = [
            {
                type: 'Polar', drawType: 'Area',
                dataSource: [{ x: '2000', y: 4 }, { x: '2001', y: 3.0 },
                { x: '2002', y: 3.8 }, { x: '2003', y: 3.4 },
                { x: '2004', y: 3.2 }, { x: '2005', y: 3.9 }],
                xName: 'x', width: 2,
                yName: 'y', name: 'Series1',
                border: { color: 'transparent' },
                fill: '#3d5ee0', animation: { enable: false },
            },
            {
                type: 'Polar', drawType: 'Area',
                dataSource: [{ x: '2000', y: 2.6 }, { x: '2001', y: 2.8 },
                { x: '2002', y: 2.6 }, { x: '2003', y: 3 },
                { x: '2004', y: 3.6 }, { x: '2005', y: 3 }],
                xName: 'x', width: 2,
                yName: 'y', name: 'Series2',
                border: { color: 'transparent' },
                fill: '#4de03d', animation: { enable: false },
            },
            {
                type: 'Polar', drawType: 'Area',
                dataSource: [{ x: '2000', y: 2.8 }, { x: '2001', y: 2.5 },
                { x: '2002', y: 2.8 }, { x: '2003', y: 3.2 },
                { x: '2004', y: 2.9 }, { x: '2005', y: 2 }],
                xName: 'x', width: 2,
                yName: 'y', name: 'Series3',
                border: { color: 'transparent' },
                fill: '#e03d9f', animation: { enable: false },

            }
        ];
    }
    else {
        chart.series = [
            {
                dataSource: data1,
                border: { width: 1, color: 'white' }, drawType: <ChartDrawType>element.value,
                name: 'Series1', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
                fill: '#3d5ee0'
            },
            {
                dataSource: data2,
                border: { width: 1, color: 'white' }, drawType: <ChartDrawType>element.value,
                name: 'Series2', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
                fill: '#4de03d'
            },
            {
                dataSource: data3,
                border: { width: 1, color: 'white' }, drawType: <ChartDrawType>element.value,
                name: 'Series3', type: 'Polar', xName: 'x', yName: 'y', animation: { enable: false },
                fill: '#e03d9f'
            },
        ];
    }
    chart.refresh();
};
document.getElementById("SelectSeriesType").onchange = () => {
    let element: HTMLSelectElement = <HTMLSelectElement>(document.getElementById('SelectSeriesType'));
    chart.series[0].type = <ChartDrawType>element.value;
    chart.series[1].type = <ChartDrawType>element.value;
    chart.series[2].type = <ChartDrawType>element.value;
    chart.refresh();
};
document.getElementById('xaxis').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('xaxis'));
    chart.primaryXAxis.isInversed = element.checked;
    chart.dataBind();
};
document.getElementById('yaxis').onchange = () => {
    let element: HTMLInputElement = <HTMLInputElement>(document.getElementById('yaxis'));
    chart.primaryYAxis.isInversed = element.checked;
    chart.dataBind();
};
