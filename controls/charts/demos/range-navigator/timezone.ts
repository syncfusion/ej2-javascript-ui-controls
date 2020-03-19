/**
 * Range navigator rendering
 */
import { RangeNavigator, DateTime, RangeTooltip, StepLineSeries, StepAreaSeries, AreaSeries, IChangedEventArgs } from '../../src/index';
import { DataManager, Query } from '@syncfusion/ej2-data';
RangeNavigator.Inject(DateTime, RangeTooltip, StepLineSeries, StepAreaSeries, AreaSeries);


let offset: number = new Date().getTimezoneOffset() * 60 * 1000;
let yearData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Years',
    tooltip: { enable: true, displayMode: 'Always' },
    allowIntervalData: true,
    enableDeferredUpdate: true,
    changed: (args: IChangedEventArgs) => {
        debugger;
    },
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1), value: 10 },
                { date: new Date(2001, 0, 1), value: 20 },
                { date: new Date(2002, 0, 1), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range1');

let QuaretrData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Quarter',
    enableGrouping: true,
    allowIntervalData: true,
    tooltip: { enable: true, displayMode: 'Always'  },
    enableDeferredUpdate: true,
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1), value: 10 },
                { date: new Date(2001, 0, 1), value: 20 },
                { date: new Date(2001, 5, 1), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range2');

let MonthData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Months',
    enableGrouping: true,
    allowIntervalData: true,
    tooltip: { enable: true, displayMode: 'Always'  },
    enableDeferredUpdate: true,
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1), value: 10 },
                { date: new Date(2000, 9, 1), value: 20 },
                { date: new Date(2000, 11, 1), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range3');

let WeekData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Weeks',
    enableGrouping: true,
    allowIntervalData: true,
    tooltip: { enable: true, displayMode: 'Always'  },
    enableDeferredUpdate: true,
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1), value: 10 },
                { date: new Date(2000, 1, 1), value: 20 },
                { date: new Date(2000, 2, 1), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range4');

let DayData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Days',
    enableGrouping: true,
    allowIntervalData: true,
    tooltip: { enable: true, displayMode: 'Always'  },
    enableDeferredUpdate: true,
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1), value: 10 },
                { date: new Date(2000, 0, 10), value: 20 },
                { date: new Date(2000, 0, 30), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range5');

let MinuteData: RangeNavigator = new RangeNavigator({
    valueType: 'DateTime',
    intervalType: 'Minutes',
    enableGrouping: true,
    allowIntervalData: true,
    tooltip: { enable: true, displayMode: 'Always' },
    enableDeferredUpdate: true,
    series: [
        {
            dataSource: [
                { date: new Date(2000, 0, 1, 10, 10), value: 10 },
                { date: new Date(2000, 0, 1, 11, 10), value: 20 },
                { date: new Date(2000, 0, 1, 12, 10), value: 5 },
            ],
            xName: 'date', yName: 'value'
        }
    ]
}, '#range6');