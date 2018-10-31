/**
 * area series
 */
import { Chart, LineSeries, ScatterSeries, SplineSeries, Tooltip, Legend, } from '../../../src/chart/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
Chart.Inject(Chart, LineSeries, ScatterSeries, SplineSeries, Tooltip, Legend);

export let selectionData: any[] = [
    { country: "USA", gold: 50, silver: 70, bronze: 45 },
    { country: "China", gold: 40, silver: 60, bronze: 55 },
    { country: "Japan", gold: 70, silver: 60, bronze: 50 },
    { country: "Australia", gold: 60, silver: 56, bronze: 40 },
    { country: "France", gold: 50, silver: 45, bronze: 35 },
    { country: "Germany", gold: 40, silver: 30, bronze: 22 },
    { country: "Italy", gold: 40, silver: 35, bronze: 37 },
    { country: "Sweden", gold: 30, silver: 25, bronze: 27 }
];

let chart: Chart = new Chart({
    primaryXAxis: {
        minimum: -8, maximum: 8, interval: 2,
        valueType: 'Double',
        lineStyle: {
            width: 2
        },
        minorTickLines: { width: 0 },
        majorTickLines: { width: 0 },
        crossesAt: 5,
        minorTicksPerInterval: 3
    },
    primaryYAxis: {
        minimum: -8, maximum: 8, interval: 2,
        lineStyle: {
            width: 2
        },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        crossesAt: 0,
        minorTicksPerInterval: 3,
    },
    series: [
        {
            type: 'Line',
            dataSource: [
                { x: -6, y: 2 }, { x: -5, y: 0 }, { x: -4.511, y: -0.977 }, { x: -3, y: -4 }, { x: -1.348, y: -1.247 },
                { x: -0.6, y: 0 }, { x: 0, y: 1 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 },
            ],
            fill: 'Blue', name: 'Linear Interpolation',
            enableTooltip: false, xName: 'x', width: 2, yName: 'y', animation: { enable: false }
        },
        {
            type: 'Spline',
            dataSource: [
                { x: -6, y: 2 }, { x: -5.291, y: 0 }, { x: -5, y: -0.774 }, { x: -3, y: -4 }, { x: -0.6, y: -0.965 },
                { x: -0.175, y: 0 }, { x: 0, y: 0.404 }, { x: 1.5, y: 3.5 }, { x: 3.863, y: 5.163 }, { x: 6, y: 4.5 },
            ],
            fill: 'Green', name: 'Cubic Spline Interpolation',
            xName: 'x', width: 2, enableTooltip: false, yName: 'y', animation: { enable: false }
        }, {
            type: 'Scatter',
            dataSource: [
                { x: -6, y: 2 }, { x: -3, y: -4 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 },
            ],
            fill: 'Red', name: 'Data Points', xName: 'x', width: 2,
            yName: 'y', marker: { visible: false, width: 12, height: 12 }, animation: { enable: false }
        }
    ],
    tooltip: { enable: true },
    title: 'Spline Interpolation',
});
chart.appendTo('#container1');
let chart1: Chart = new Chart({
    primaryXAxis: {
        minimum: -8, maximum: 8, interval: 2,
        valueType: 'Double',
        lineStyle: {
            width: 2
        },
        minorTickLines: { width: 0 },
        majorTickLines: { width: 0 },
        crossesAt: 0,
        minorTicksPerInterval: 3
    },
    primaryYAxis: {
        minimum: -8, maximum: 8, interval: 2,
        lineStyle: {
            width: 2
        },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        crossesAt: 6,
        minorTicksPerInterval: 3,
    },
    series: [
        {
            type: 'Line',
            dataSource: [
                { x: -6, y: 2 }, { x: -5, y: 0 }, { x: -4.511, y: -0.977 }, { x: -3, y: -4 }, { x: -1.348, y: -1.247 },
                { x: -0.6, y: 0 }, { x: 0, y: 1 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 },
            ],
            fill: 'Blue', name: 'Linear Interpolation',
            enableTooltip: false, xName: 'x', width: 2, yName: 'y', animation: { enable: false }
        },
        {
            type: 'Spline',
            dataSource: [
                { x: -6, y: 2 }, { x: -5.291, y: 0 }, { x: -5, y: -0.774 }, { x: -3, y: -4 }, { x: -0.6, y: -0.965 },
                { x: -0.175, y: 0 }, { x: 0, y: 0.404 }, { x: 1.5, y: 3.5 }, { x: 3.863, y: 5.163 }, { x: 6, y: 4.5 },
            ],
            fill: 'Green', name: 'Cubic Spline Interpolation',
            xName: 'x', width: 2, enableTooltip: false, yName: 'y', animation: { enable: false }
        }, {
            type: 'Scatter',
            dataSource: [
                { x: -6, y: 2 }, { x: -3, y: -4 }, { x: 1.5, y: 3.5 }, { x: 6, y: 4.5 },
            ],
            fill: 'Red', name: 'Data Points', xName: 'x', width: 2,
            yName: 'y', marker: { visible: false, width: 12, height: 12 }, animation: { enable: false }
        }
    ],
    tooltip: { enable: true },
    title: 'Spline Interpolation',
});
chart1.appendTo('#container2');


