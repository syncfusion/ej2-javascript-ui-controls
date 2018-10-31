import {
    Chart, DataLabel, DateTime, LineSeries, ColumnSeries, CandleSeries, IPointRenderEventArgs, ILegendRenderEventArgs,
    ITextRenderEventArgs, Category, Selection, MacdIndicator, Crosshair, Tooltip, Zoom,
} from '../../../../src/chart/index';
Chart.Inject(DataLabel, DateTime, ColumnSeries, LineSeries, MacdIndicator, CandleSeries, Category, Crosshair, Selection, Tooltip, Zoom);

import { chartData } from '../indicatordata';

/**
 * Candle Series
 */

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
    series: [{
        name: 'gold',
        type: 'Candle',
        xName: 'x',
        low: 'low',
        high: 'high',
        open: 'open',
        animation: { enable: true },
        close: 'close',
        dataSource: chartData
    }],


    axes: [{ name: 'secondary', opposedPosition: true, rowIndex: 0 }],
    indicators: [{
        type: 'Macd',
        period: 3,
        fastPeriod: 8,
        slowPeriod: 5,
        seriesName: 'gold',
        macdType: 'Both',
        width: 2,
        fill: 'blue',
        yAxisName: 'secondary',
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

});
chart.appendTo('#container');