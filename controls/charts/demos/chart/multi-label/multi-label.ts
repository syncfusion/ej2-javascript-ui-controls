/**
 * area series
 */
import {  Chart, DataLabel, ColumnSeries, Category, ILoadedEventArgs,
    IPointRenderEventArgs, ChartTheme, MultiLevelLabel } from '../../../src/chart/index';
import '../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject( Chart, DataLabel, ColumnSeries, Category, MultiLevelLabel);

let chart: Chart = new Chart({

    //Initializing Primary X Axis
    primaryXAxis: {
        valueType: 'Category', labelRotation: 90,
        border: { width: 1, type: 'Rectangle' },
        isIndexed: true, interval: 1, majorGridLines: { width: 0 },
        multiLevelLabels : [
                {
                    border: { type: 'Rectangle' },
                    categories: [
                        { start: -0.5, end: 0.5, text: 'Seedless', },
                        { start: 0.5, end: 2.5, text: 'Seeded', },
                        { start: 2.5, end: 3.5, text: 'Seedless', },
                        { start: 3.5, end: 5.5, text: 'Seeded', },
                        { start: 5.5, end: 6.5, text: 'Seedless', },
                        { start: 6.5, end: 7.5, text: 'Seeded', },
                        { start: 7.5, end: 8.5, text: 'Seedless', },
                        { start: 8.5, end: 9.5, text: 'Seeded', }
                    ]
                }, {
                    border: { type: 'Rectangle' },
                    categories: [
                        { start: -0.5, end: 2.5, text: 'In Season', },
                        { start: 2.5, end: 5.5, text: 'Out of Season', },
                        { start: 5.5, end: 7.5, text: 'In Season', },
                        { start: 7.5, end: 9.5, text: 'Out of Season', },
                    ]
                }, {
                    border: { type: 'Rectangle' },
                    textStyle: { fontWeight: 'Bold' },
                    categories: [
                        { start: -0.5, end: 5.5, text: 'Fruits', },
                        { start: 5.5, end: 9.5, text: 'Vegetables', },
                    ]
                }]
    },
    chartArea: {
        border: { width: 0 }
    },
    //Initializing Primary Y Axis
    primaryYAxis:
        {
            minimum: 0, maximum: 120, interval: 30,
            majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
        },

    //Initializing Chart Series
    series: [
        {
            type: 'Column', xName: 'x', yName: 'y',
            dataSource: [
                { x: 'Grapes', y: 28 }, { x: 'Apples', y: 87 },
                { x: 'Pears', y: 42 }, { x: 'Grapes', y: 13 },
                { x: 'Apples', y: 13 }, { x: 'Pears', y: 10 },
                { x: 'Tomato', y: 31 }, { x: 'Potato', y: 96 },
                { x: 'Cucumber', y: 41 }, { x: 'Onion', y: 59 }],
            marker: {
                dataLabel: {
                    visible: true, position: 'Outer'
                }
            }, fill: '#8c3ed5', animation: { enable: false}
        },
    ],
    //Initializing Chart title
    title: 'Fruits and Vegetables - Season',
    legendSettings: { visible: false },
});
chart.appendTo('#container');