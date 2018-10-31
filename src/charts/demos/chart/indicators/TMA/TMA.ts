/**
 * TMA Indicator
 */
import {
    Chart, CandleSeries, Category, Tooltip, Crosshair, Legend, DateTime, LineSeries,
    Zoom
} from '../../../../src/chart/index';
import { TmaIndicator } from '../../../../src/chart/technical-indicators/tma-indicator';
Chart.Inject(CandleSeries, Category, TmaIndicator, Tooltip, Crosshair, Legend, DateTime, LineSeries,
    Zoom);
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
        majorGridLines: { width: 0 }
    },

    axes: [{ name: 'secondary', minimum: 30, maximum: 110, opposedPosition: true, majorGridLines: { width: 0 } }],
    series: [{
        dataSource: chartData, width: 2,
        xName: 'x', yName: 'y', low: 'low', high: 'high', close: 'close', volume: 'volume', open: 'open',
        name: 'Apple Inc',
        //Series type as RangeColumn
        type: 'Candle', animation: { enable: true }
    }],
    indicators: [{
        type: 'Tma', field: 'Close', seriesName: 'Apple Inc', fill: 'blue',
        period: 14, animation: { enable: true }
    }],
    tooltip: { enable: true, shared: true },
    crosshair: { enable: true },
    zoomSettings: {
        enableMouseWheelZooming: true,
        enableSelectionZooming: true,
        enableDeferredZooming: true,
        mode: 'XY'
    },
    title: 'AAPL - 2016/2017'
}, '#container');
