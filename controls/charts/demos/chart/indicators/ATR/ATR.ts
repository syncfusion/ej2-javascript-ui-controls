/**
 * ATR Indicator
 */
import { Chart, CandleSeries, Category, Tooltip, Crosshair, Legend, DateTime, LineSeries} from '../../../../src/chart/index';
import { AtrIndicator } from '../../../../src/chart/technical-indicators/atr-indicator';
Chart.Inject(CandleSeries, Category, AtrIndicator,  LineSeries,Tooltip, Crosshair,  Legend, DateTime);
import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months'
    },
    primaryYAxis: {
        title: 'Price (Million Dollars)',
        minimum: 80, maximum: 180,
        majorGridLines: { width: 0 }
    },
    axes: [{ name: 'secondary',  minimum: 0, maximum: 15, interval: 2, opposedPosition: true }],
    series: [{
        dataSource: chartData, width: 2,
        xName: 'x', yName: 'y', low: 'low', high: 'high', close : 'close', volume: 'volume',open:'open',
        name: 'Apple Inc',
         //Series type as RangeColumn
        type: 'Candle', animation: { enable: true }
    }],
    indicators: [{
        type: 'Atr', field: 'Low', seriesName: 'Apple Inc', yAxisName: 'secondary', fill: 'blue',
        period: 3, animation: { enable: true}
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
