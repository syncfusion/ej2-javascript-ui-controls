/**
 * StepLine series
 */
import { Chart, CandleSeries, DateTime, MomentumIndicator, Tooltip, LineSeries, Crosshair } from '../../../../src/chart/index';
Chart.Inject(CandleSeries, DateTime, MomentumIndicator, Tooltip, LineSeries, Crosshair);

import { chartData } from '../indicatordata';

let chart: Chart = new Chart({
    primaryXAxis: {
        title: 'Months',
        valueType: 'DateTime',
        intervalType: 'Months'
    },
    primaryYAxis: {
        title: 'Price',
        labelFormat: '${value}',
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
        name: 'secondary', minimum: 50, maximum: 150, opposedPosition: true,
        majorGridLines: { width: 0 }, rowIndex: 0
    }],
    series: [{
        dataSource: chartData, width: 2,
        xName: 'x', yName: 'y', low: 'low', high: 'high', close: 'close', open: 'open',
        name: 'USA', animation: { enable: true },
        // Series type as StepLine
        type: 'Candle',
    }],
    indicators: [{
        type: 'Momentum', field: 'Close', seriesName: 'USA', yAxisName: 'secondary',
        upperLine: { color: 'red' },
        period: 3, animation: { enable: true }
    }],
    tooltip: { enable: true, shared: true },
    crosshair: { enable: true },
    zoomSettings: {
        enableMouseWheelZooming: true,
        enableSelectionZooming: true,
        enableDeferredZooming: true,
        mode: 'XY'
    },
}, '#container');
