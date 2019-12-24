/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, PolarSeries, RadarSeries, Category, AreaSeries, LineSeries, Selection, IPointEventArgs, StackingAreaSeries, DataLabel
} from '../../../src/index';
Chart.Inject(Tooltip, Legend, PolarSeries, Category, AreaSeries, RadarSeries, LineSeries, Selection, StackingAreaSeries, DataLabel);

let chart: Chart = new Chart({
    //Initializing Primary X Axis
    primaryXAxis: {
        valueType: 'Category',
        labelPlacement: 'OnTicks',
        interval: 1,
        coefficient: 80
    },

    //Initializing Primary Y Axis
    primaryYAxis:
    {


        //labelFormat: '{value}'
        minimum: 5000,
        maximum: 15000,
        interval: 2000

    },

    //Initializing Chart Series
    series: [
        {
            type: 'Radar', drawType: 'StackingArea',
            dataSource: [{ x: 'Argentina', y: 598.58, }, { x: 'Austria', y: 7391.5, }, { x: 'Belgium', y: 1280.14, }, { x: 'Brazil', y: 4880.19, }, { x: 'Canada', y: 2198.09, }, { x: 'Denmark', y: 1396.19, }, { x: 'Finland', y: 910.89, }, { x: 'France', y: 4237.84, }, { x: 'Germany', y: 11283.28, }, { x: 'Ireland', y: 2755.24, }, { x: 'Italy', y: 864.44, }, { x: 'Mexico', y: 1122.78, }, { x: 'Norway', y: 275.5, }, { x: 'Poland', y: 175.74, }, { x: 'Portugal', y: 643.53, }, { x: 'Spain', y: 861.89, }, { x: 'Sweden', y: 3237.6, }, { x: 'Switzerland', y: 1368.53, }, { x: 'UK', y: 2954.27, }, { x: 'USA', y: 13771.29, }, { x: 'Venezuela', y: 2735.18, }],
            xName: 'x', width: 2,
            yName: 'y', name: 'Product A',
            border: { color: 'transparent' },
            opacity: 0.5,
            animation: { enable: false },
            marker: { visible: true, dataLabel: { visible: true} }
        },
        {
            type: 'Radar', drawType: 'StackingArea',
            dataSource: [{ x: 'Argentina', y: 10793.9375 }, { x: 'Austria', y: 10649.575 }, { x: 'Belgium', y: 10736.842105 }, { x: 'Brazil', y: 10674.337349 }, { x: 'Canada', y: 10646.466666 }, { x: 'Denmark', y: 10665.944444 }, { x: 'Finland', y: 10609.681818 }, { x: 'France', y: 10637.376623 }, { x: 'Germany', y: 10642.631147 }, { x: 'Ireland', y: 10616.315789 }, { x: 'Italy', y: 10697.392857 }, { x: 'Mexico', y: 10592.142857 }, { x: 'Norway', y: 10716.833333 }, { x: 'Poland', y: 10799.285714 }, { x: 'Portugal', y: 10543.615384 }, { x: 'Spain', y: 10699.652173 }, { x: 'Sweden', y: 10680.972972 }, { x: 'Switzerland', y: 10724.0 }, { x: 'UK', y: 10661.464285 }, { x: 'USA', y: 10667.008196 }, { x: 'Venezuela', y: 10683.23913 }],
            xName: 'x', width: 2,
            yName: 'y', name: 'Product B',
            opacity: 0.5,
            border: { color: 'transparent' },
            animation: { enable: false },
            marker: { visible: true, dataLabel: { visible: true} }
        },

    ],
    //Initializing Chart title
    title: 'Average Sales Comparison',
    tooltip: { enable: true }
});
chart.appendTo('#polarLabel');

let data: Object[] = [
    // {x: 'China', y: 9635, y1: 10535, y2: 11226, y3: 11218},
    { x: 'JPN', text: 'Japan', y: 5156, y1: 4849, y2: 4382, y3: 4939 },
    { x: 'DEU', text: 'Germany', y: 3754, y1: 3885, y2: 3365, y3: 3467 },
    { x: 'FRA', text: 'France', y: 2809, y1: 2844, y2: 2420, y3: 2463 },
    { x: 'GBR', text: 'UK', y: 2721, y1: 3002, y2: 2863, y3: 2629 },
    { x: 'BRA', text: 'Brazil', y: 2472, y1: 2456, y2: 1801, y3: 1799 },
    { x: 'RUS', text: 'Russia', y: 2231, y1: 2064, y2: 1366, y3: 1281 },
    { x: 'ITA', text: 'Italy', y: 2131, y1: 2155, y2: 1826, y3: 1851 },
    { x: 'IND', text: 'India', y: 1857, y1: 2034, y2: 2088, y3: 2256 },
    { x: 'CAN', text: 'Canada', y: 1843, y1: 1793, y2: 1553, y3: 1529 }
];
let chartSample: Chart = new Chart({

    //Initializing Primary X Axis
    primaryXAxis: {
        valueType: 'Category',
        labelPlacement: 'OnTicks'
    },

    //Initializing Chart Series
    series: [
        {
            type: 'Polar', drawType: 'StackingArea', dataSource: data,
            animation: { enable: true },
            xName: 'x', yName: 'y', name: '2013'
        },
        {
            type: 'Polar', drawType: 'StackingArea', dataSource: data,
            animation: { enable: true },
            xName: 'x', yName: 'y1', name: '2014'
        },
        {
            type: 'Polar', drawType: 'StackingArea', dataSource: data,
            animation: { enable: true },
            xName: 'x', yName: 'y2', name: '2015'
        },
        {
            type: 'Polar', drawType: 'StackingArea', dataSource: data,
            animation: { enable: true },
            xName: 'x', yName: 'y3', name: '2016'
        },
    ],
    //Initializing Chart Sample
    title: 'GDP, Current Prices (in Billions)',
    legendSettings: {
        visible: true
    },
    //Initializing User Interaction Tooltip
    tooltip: {
        enable: true
    },

});
chartSample.appendTo('#radarLabel');