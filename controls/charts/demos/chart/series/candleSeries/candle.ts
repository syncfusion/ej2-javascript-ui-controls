import {
    Chart, BarSeries, Legend, DataLabel, ColumnSeries, ChartSeriesType, LineSeries, AreaSeries, SplineSeries, Logarithmic, Crosshair, 
    StackingAreaSeries,CandleSeries, StackingBarSeries, StackingColumnSeries, LabelPosition, RangeColumnSeries, Tooltip, Category, DateTime, BubbleSeries, ScatterSeries, HiloSeries
} from '../../../../src/chart/index';
Chart.Inject(Chart, BarSeries, Legend,CandleSeries, DataLabel, ColumnSeries, LineSeries, AreaSeries, SplineSeries, Category, DateTime, Logarithmic,BubbleSeries, ScatterSeries, HiloSeries,
             StackingAreaSeries, StackingBarSeries, StackingColumnSeries, RangeColumnSeries, Tooltip, Crosshair);

/**
 * Candle Series
 */
export let candleData: any[] = [
    { x: 'Mumbai', low: -22,open:-10,close:15, high: 34 },
     { x: 'Cape town', low: -30, open:5,close:25, high: 30 }
   ];

let chart: Chart = new Chart({

    primaryXAxis: {
        title: 'primaryXAxis',
        name: 'primaryXAxis',
        rangePadding: 'Additional',
        valueType: 'Category'
    },
    primaryYAxis: {
        title: 'primaryYAxis',
        name: 'primaryYAxis',
        minimum:-40,
        maximum:60,
        interval:10,
        //isInversed:true,
    },

    series: [
        {
            type: 'Candle',
            dataSource: candleData, animation: { enable: true},
            marker: { dataLabel: { visible: true, fill: 'pink', border: {color: 'red', width: 2} } },
            xName: 'x', low: 'low', high: 'high',open:'open',close:'close'
        },
    ],
    title: 'Chart Samples',
    //isTransposed: true,
    tooltip: { enable: true},
    
});
chart.appendTo('#container');


