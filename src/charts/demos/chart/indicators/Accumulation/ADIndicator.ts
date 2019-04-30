/**
 * Accumulation Distribution Indicator
 */
import {
    Chart, CandleSeries, Category, Tooltip, LineSeries, Crosshair, Legend, DateTime,
    AccumulationDistributionIndicator, Logarithmic, Zoom
} from '../../../../src/chart/index';

Chart.Inject(CandleSeries, Category, LineSeries, Tooltip, Crosshair, AccumulationDistributionIndicator, Legend,
             DateTime, Logarithmic, Zoom);
import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months', majorGridLines: { width: 0}
    },
    primaryYAxis: {
        title: 'Price',
        labelFormat: '${value}',
        minimum: 50, maximum: 170,
        interval: 40, rowIndex: 1, majorGridLines: { width: 1}
    },
    rows: [
        {
            height: '30%'
        }, {
            height: '70%'
        }
    ],
    axes: [{
        name: 'secondary',
        opposedPosition: true, rowIndex: 0,
        majorGridLines: { width: 0 }
    }],
    series: [{
        dataSource: chartData, width: 2,
        xName: 'x', yName: 'y', low: 'low', high: 'high', close: 'close', volume: 'volume', open: 'open',
        name: 'Apple Inc',
        type: 'Candle', animation: { enable: true }
    }],
    indicators: [{
        type: 'AccumulationDistribution', field: 'Close', seriesName: 'Apple Inc', yAxisName: 'secondary', fill: 'blue',
        period: 3, animation: { enable: false }
    }],
    zoomSettings:
    {
        enableMouseWheelZooming: true,
        enablePinchZooming: true,
        enableSelectionZooming: true,
        mode: 'X'
    },
    tooltip: {
        enable: true, shared: true,
    },
    crosshair: { enable: true },
    title: 'AAPL Historical'
}, '#container');
