/**
 * Datetime - EST issue
 */
import { RangeNavigator, DateTime, RangeTooltip, Chart, LineSeries } from '../../../src/index';
import { DataManager } from '@syncfusion/ej2-data';
RangeNavigator.Inject(DateTime, RangeTooltip);
Chart.Inject(DateTime, LineSeries);
var naviData = [{ "xValue": getFormattedDate("2001-01-01"), "yValue": 1569172.0 }, { "xValue": getFormattedDate("2002-01-01"), "yValue": 4326228.0 }, { "xValue": getFormattedDate("2003-12-31"), "yValue": 2954475.0 }];
let range: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    dataSource: new DataManager(naviData),
    xName: 'xValue', yName: 'yValue',
    intervalType: 'Years',

    tooltip: { enable: true }
});

let range2: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    series: [{
        dataSource: [{ x: new Date(2000, 2, 4), y: 23 }, { x: new Date(2010, 2, 4), y: 55 }], xName: 'x', yName: 'y'
    }],

});
function getFormattedDate(date: any) {
    let formattedString: string = ':00:00:00 GMT';
    return (date + formattedString);
}
range2.appendTo('#radarLabel');
range.appendTo('#dateEST');

