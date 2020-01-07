/**
 * Polar Chart Issues
 *
 */

import {
    Chart, Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries, ChartModel
} from '../../../src/index';
import { DataManager, Query, ODataV4Adaptor } from '@syncfusion/ej2-data';
Chart.Inject(Tooltip, Legend, Category, AreaSeries, LineSeries, Selection, ColumnSeries);

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