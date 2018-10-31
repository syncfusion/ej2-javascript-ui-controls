/**
 * StepLine series
 */
import { Chart, CandleSeries, DateTime, RsiIndicator,  Tooltip, LineSeries,
    Crosshair } from '../../../../src/chart/index';
Chart.Inject(CandleSeries, DateTime, RsiIndicator,  Tooltip, LineSeries, Crosshair);

import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months'
    },
    primaryYAxis: {
        title: 'Price',
        labelFormat : '${value}',
        minimum: 50, maximum: 180,
        interval: 30, rowIndex: 1
    },
    rows: [
        {
            height: '30%'
        }, {
            height: '70%'
        }
    ],
    axes: [{
        name: 'secondary', minimum: 0, maximum: 120, interval: 10, opposedPosition: true, rowIndex: 0,
        majorGridLines: { width: 0 }
    }],
    series: [{
        dataSource: chartData, width: 2, low: 'low', high: 'high', close: 'close', open: 'open',
        xName: 'x', yName: 'y',
        name: 'USA',
        type: 'Candle',
    }],
    indicators: [{
        type: 'Rsi', field: 'Close', seriesName: 'USA', yAxisName: 'secondary', fill: 'blue',
        showZones: true, overBought: 70, overSold: 30,
        period: 3, animation: { enable: true }, upperLine: { color: 'red' }, lowerLine: { color: 'green' }
    }],
    tooltip: { enable: true, shared: true },
    crosshair: { enable: true },
    zoomSettings: {
        enableMouseWheelZooming: true,
        enableSelectionZooming: true,
        enableDeferredZooming: true,
        mode: 'X'
    },
    title: 'AAPL - 2016/2017'
}, '#container');
