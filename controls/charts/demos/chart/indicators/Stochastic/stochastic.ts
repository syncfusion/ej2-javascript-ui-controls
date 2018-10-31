/**
 * StepLine series
 */
import { Chart, CandleSeries, DateTime, StochasticIndicator,  Tooltip, LineSeries, Crosshair } from '../../../../src/chart/index';
Chart.Inject(CandleSeries, DateTime, StochasticIndicator,  Tooltip, LineSeries, Crosshair);
import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months'
    },
    primaryYAxis: {
        title: 'Price (Million Dollars)',
        minimum: 30, maximum: 180, interval: 30,
        rowIndex: 1
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
        type: 'Stochastic', field: 'Close', seriesName: 'USA', yAxisName: 'secondary', fill: 'blue',
        kPeriod: 2, dPeriod: 3, showZones: true, periodLine: { color: 'yellow' },
        period: 3, animation: { enable: false }, upperLine: { color: 'red' }, lowerLine: { color: 'green' }
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
