/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries, Zoom
} from '../../../src/index';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
Chart.Inject(Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries, Tooltip, Zoom);

let query: Query = new Query().where('Freight', 'equal', 6.40, false);
let data: DataManager = new DataManager({
    url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
    adaptor: new ODataV4Adaptor(),
    offline: true
});

let chartOptions: Chart = new Chart({
    height: '300',
    primaryXAxis: { valueType: 'Category' },
    title: 'Chart Offline DataManager in Series',
    series: [{
        dataSource: data, query: query,
        animation: { enable: false },
        xName: 'CustomerID', yName: 'Freight', type: 'Column'
    }]
}, '#offlineChart');

document.getElementById('query').addEventListener(
    'click', () => {
        chartOptions.series[0].query = new Query().where('Freight', 'equal', 32.38, false);
    });

    let chartOptionsDirect: Chart = new Chart({
        height: '300',
        title: 'Chart Offline DataManager in Direct DataSource',
        dataSource: data,
        primaryXAxis: { valueType: 'Category' },
        series: [{
            query: query,
            animation: { enable: false },
            xName: 'CustomerID', yName: 'Freight',
            marker: { visible: true }
        }]
    }, '#offlineChartDirectData');

    document.getElementById('queryDirect').addEventListener(
        'click', () => {
            chartOptionsDirect.series[0].query = new Query().where('Freight', 'equal', 32.38, false);
        });

    let tooltipChart: Chart = new Chart({
        primaryXAxis: { valueType: 'Category'},
        series: [
            { dataSource: [
                { x: 'CHN', y: 17 },
                { x: 'USA', y: 19 },
                { x: 'IDN', y: 29 },
                { x: 'JAP', y: 13 },
                { x: 'BRZ', y: 24 }
            ], type: 'Line', xName: 'x', yName: 'y', marker: { visible: true }}
        ],
        tooltip: { enable: true },
        title: 'Tooltip doesnot appears after zooming and hovering on same point',
        zoomSettings: {enableMouseWheelZooming: true }
    }, '#tooltip')