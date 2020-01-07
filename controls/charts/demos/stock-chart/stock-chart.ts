/**
 * Stock Chart sample
 */
import { StockChart, DateTime, CandleSeries } from '../../src/index';
StockChart.Inject(DateTime, CandleSeries);
import { chartData } from './indicatordata';

let customPicker: StockChart = new StockChart({
    series: [
        { dataSource: chartData, xName: 'x'}
    ],
    seriesType: [],
    indicatorType: [],
    trendlineType: [],
    periods: [{text: 'YTD', selected: true}, { text: 'All'}],
   enableCustomRange: false
});

customPicker.appendTo('#picker');

let calendarStock: StockChart =  new StockChart({
    series: [
        { dataSource: chartData, xName: 'x'}
    ],
    seriesType: [],
    indicatorType: [],
    trendlineType: []
});
calendarStock.appendTo('#calendarStockChart');