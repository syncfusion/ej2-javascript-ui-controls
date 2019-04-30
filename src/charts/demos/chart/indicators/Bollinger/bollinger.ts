/**
 * Bollinger Band
 */
import { Chart, CandleSeries, DateTime, BollingerBands, Tooltip, LineSeries, Crosshair, Zoom,
       RangeAreaSeries } from '../../../../src/chart/index';
Chart.Inject(CandleSeries, DateTime, BollingerBands,  Tooltip, LineSeries, Crosshair, Zoom, RangeAreaSeries);
import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months', majorGridLines: { width: 0}
    },
    primaryYAxis: {
        title: 'Price (Million Dollars)',
        minimum: 50, maximum: 170, interval: 40
    },

    series: [{
        dataSource: chartData, width: 2, low: 'low', high: 'high', close: 'close', open: 'open',
        xName: 'x', yName: 'y',
        name: 'USA',
        type: 'Candle',
    }],
    indicators: [{
        type: 'BollingerBands', field: 'Close', seriesName: 'USA', //fill: 'blue',
        period: 14, animation: { enable: true }, upperLine: { color: 'orange' }, lowerLine: { color: 'yellow' }
    }],
    tooltip: { enable: true, shared: true },
    crosshair: { enable: true },
    zoomSettings: {
        enableMouseWheelZooming: true,
        enableSelectionZooming: true,
        enableDeferredZooming: true,
        enablePinchZooming: true,
        mode: 'X'
    },
    title: 'AAPL - 2016/2017'
}, '#container');
