import {
    Chart, HiloOpenCloseSeries, Legend, DataLabel, ChartSeriesType, Logarithmic, Crosshair, Tooltip, Category, DateTime
} from '../../../../src/chart/index';
Chart.Inject(Chart, HiloOpenCloseSeries, Legend, DataLabel, Category, DateTime, Logarithmic, Tooltip, Crosshair);

/**
 * HiloOpenClose Series
 */
export let candleData: any[] = [
    { x: 'German', low: 8, open: 34, close: 13, high: 50 },
    { x: 'Mumbai', low: -22, open: -10, close: 15, high: 34 },
    { x: 'Cape', low: -30, open: 25, close: 5, high: 30 },
    { x: 'Austria', low: 30, open: 15, close: 25, high: 10 },
    { x: 'France', low: 2, open: 115, close: 55, high: 160 },
    { x: 'USA', low: 10, open: 35, close: 25, high: 47 },
    { x: 'China', low: 45, open: 70, close: 50, high: 100 },
    { x: 'Japan', low: 70, open: 140, close: 130, high: 150 },
    { x: 'Saudi', low: 170, open: 175, close: 220, high: 225, },
    { x: 'India', low: 180, open: 223, close: 190, high: 230, },
    { x: 'UK', low: 140.69, open: 160.74, close: 190.28, high: 200.12, },

];

let chart: Chart = new Chart({

    primaryXAxis: {
        title: 'primaryXAxis',
        name: 'primaryXAxis',
        rangePadding: 'Additional',
        valueType: 'Category'
    },
    primaryYAxis: {
        title: 'primaryYAxis',
        name: 'primaryYAxis',
        minimum: -30,
        maximum: 240,
        interval: 10,
        //isInversed:true,
    },

    series: [
        {
            type: 'HiloOpenClose',
            dataSource: candleData,
            animation: { enable: false },
            marker: { dataLabel: { visible: true, font: { color: 'black' }, position:'Outer' } },
            xName: 'x', low: 'low', high: 'high', open: 'open', close: 'close'
        },
    ],
    title: 'Chart Samples',
    //isTransposed: true,
    tooltip: { enable: true },

});
chart.appendTo('#container');


