/**
 * area series
 */
import { Chart, AreaSeries, Tooltip } from '../../../../src/chart/index';
import '../../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(AreaSeries, Tooltip);

let chartData: any[] = [
    { x: 1900, y: 4 }, { x: 1920, y: 3.0 }, { x: 1940, y: 3.8 },
    { x: 1960, y: 3.4 }, { x: 1980, y: 3.2 }, { x: 2000, y: 3.9 }
];
let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Year',
        minimum: 1900, maximum: 2000, interval: 10,
        edgeLabelPlacement: 'Shift'
    },
    primaryYAxis: {
        minimum: 2, maximum: 5, interval: 0.5,
        title: 'Sales Amount in Millions'
    },
    series: [{
        dataSource: chartData,
        xName: 'x', yName: 'y',
        opacity: 0.5, fill: '#69D2E7',
        name: 'Product A',
        // Series type as area series
        type: 'Area', animation: { enable: false},
        marker: { visible: true}
    }],
    tooltip: {
        enable: true,
        format: '${series.name} ${point.x} : ${point.y}',
        fill: '#7bb4eb',
        border: {
            width: 2,
            color: 'grey'
        }
    },
    title: 'Average Sales Comparison'
});
chart.appendTo('#container');
