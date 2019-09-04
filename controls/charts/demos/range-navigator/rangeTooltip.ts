/**
 * Range navigator rendering
 */
import { RangeNavigator, DateTime, RangeTooltip, StepLineSeries, StepAreaSeries, AreaSeries } from '../../src/index';
RangeNavigator.Inject(DateTime, RangeTooltip, StepLineSeries, StepAreaSeries, AreaSeries);

export function GetNumericData(start: number, end: number, min?: number, max?: number): object[] {
    let series1: object[] = [];
    let point: object = {};
    let value: number = 30;

    for (let i: number = start; i <= end; i++) {
        if (min || max) {
            value = getRandomInt(min, max);
        } else {
            if (Math.random() > .5) {
                value += Math.random();
            } else {
                value -= Math.random();
            }
        }
        point = { x: i, y: Math.round(value) };
        series1.push(point);
    }
    return series1;
}

export function GetDateTimeData(start: Date, end: Date, min?: number, max?: number, inc?: number): object[] {
    let series1: object[] = [];
    let point: object = {};
    let value: number = 100;
    let date: number;
    inc = inc ? inc : 1;
    for (let i: number = 0; start <= end; i += inc) {
        date = start.getTime();
        if (min || max) {
            value = getRandomInt(min, max);
        } else {
            if (Math.random() > .5) {
                value += Math.random();
            } else {
                value -= Math.random();
            }
        }
        point = { x: new Date(date), y: value };
        new Date(start.setDate(start.getDate() + 1));
        series1.push(point);
    }
    return series1;
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let data: object[] = GetDateTimeData(new Date('2018-01-01'), new Date('2019-01-01'));

let range1: RangeNavigator = new RangeNavigator({
    dataSource: data, xName: 'x', yName: 'y', valueType: 'DateTime',
    value: [new Date('2018-06-01'), new Date('2018-07-01')],
    tooltip: { enable: true, displayMode: 'Always'},
    navigatorStyleSettings: { thumb : { type: 'Rectangle', border: { color: 'blue'}}},
    navigatorBorder: { width: 3, color: 'red'}
});
range1.appendTo('#range1');


data = GetDateTimeData(new Date('2018-01-01'), new Date('2018-02-01'));
let range2: RangeNavigator = new RangeNavigator({
    series: [{
        dataSource: data, xName: 'x', yName: 'y', type: 'StepLine'
    }],
    value: [new Date('2018-01-13'), new Date('2018-01-25')]
   , valueType: 'DateTime', enableGrouping: true,
    tooltip: { enable: true, displayMode: 'Always'},
    navigatorBorder: { width: 3, color: 'black'}
});
range2.appendTo('#range2');
data = GetDateTimeData(new Date('2018-01-01'), new Date('2018-08-01'));
let range3: RangeNavigator = new RangeNavigator({
    series: [{
        dataSource: data, xName: 'x', yName: 'y', type: 'StepLine'
    }]
   , valueType: 'DateTime', enableGrouping: true,
    tooltip: { enable: true, displayMode: 'Always'},
    navigatorStyleSettings: { thumb : { type: 'Rectangle', border: { color: 'blue'}, height: 20, width: 20}},
    navigatorBorder: { width: 3, color: 'black'},
});
range3.appendTo('#range3');

let range4: RangeNavigator = new RangeNavigator();
range4.appendTo('#range4');

let range5: RangeNavigator = new RangeNavigator({
    series: [{
        dataSource: data, xName: 'x', yName: 'y', type: 'Area', fill: 'Pink'
    }],
    value: [new Date('2018-06-01'), new Date('2018-07-01')]
   , valueType: 'DateTime', enableGrouping: true,
    tooltip: { enable: true, displayMode: 'Always'},
    navigatorStyleSettings: { thumb : { type: 'Rectangle', border: { color: 'red'}, height: 10, width: 10, fill: 'black'}, 
                              selectedRegionColor : '#ffe6e6'},
    navigatorBorder: { width: 3, color: 'black'},
});
range5.appendTo('#range5');

let doubledata = GetNumericData(100, 1000);

let range6: RangeNavigator = new RangeNavigator({
    series: [{
        dataSource: doubledata, xName: 'x', yName: 'y', type: 'Area', fill: 'Pink'
    }],
    value: [300, 500],
    tooltip: { enable: true, displayMode: 'Always'},
    navigatorStyleSettings: { thumb : { border: { color: 'red'}, height: 10, width: 10, fill: 'black'},
                              selectedRegionColor : '#eaeafa'},
    navigatorBorder: { width: 0, color: 'black'},
    majorGridLines: { width: 2, color: 'blue'}
});
range6.appendTo('#range6');
