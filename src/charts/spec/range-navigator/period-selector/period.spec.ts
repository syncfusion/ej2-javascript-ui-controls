import { RangeNavigator, AreaSeries, DateTime, PeriodSelector, IChangedEventArgs } from '../../../src/range-navigator/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { MouseEvents } from '../../chart/base/events.spec';
RangeNavigator.Inject(AreaSeries, DateTime, PeriodSelector);

/**
 * Spec for range navigator
 */
let value: number = 0;
let point: object;
let data: object[] = [];
let dateTime: object[] = [];

for (let j: number = 0; j < 1000; j++) {
    value += (Math.random() * 10 - 5);
    point = { x: new Date(2018, 3, j), y: value, y1: value + 10 };
    data.push(point);
}
describe('Range navigator', () => {
    describe('with default case', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let trigger: MouseEvents = new MouseEvents();
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{ dataSource: data, xName: 'x', yName: 'y', type: 'Line' }], valueType: 'DateTime', height: '500', animationDuration: 0,
                periodSelectorSettings: { position: 'Top', height: 200, periods: [{ intervalType: 'Days', interval: 3, text: '3d' }] }

            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking with selector position as bottom', (done: Function) => {
            range.loaded = (args: Object) => {
                let period: HTMLElement = document.getElementById('container_Secondary_Element');
                //expect(period.style.top).toBe('300px');
                done();
            };
            isCheck = false;
            range.periodSelectorSettings.position = 'Bottom';
            range.refresh();
        });
        it('checking with selector position as bottom', (done: Function) => {
            range.loaded = (args: Object) => {
                let period: HTMLElement = document.getElementById('container_Secondary_Element');
                //expect(period.style.top).toBe('0px');
                done();
            };
            isCheck = false;
            range.periodSelectorSettings.position = 'Top';
            range.refresh();
        });
        it('checking days click', (done: Function) => {
            let i: number = 0;
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_6');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString() === ('Wed May 02 2018 00:00:00 GMT+0530 (India Standard Time)')
                           || args.start.toString() === ('Wed May 02 2018 00:00:00 GMT+0000 (Coordinated Universal Time)')).toBe(true);
                    //expect((args.start.toString())).toEqual('Wed May 02 2018 00:00:00 GMT+0530 (India Standard Time)');
                    isCheck = false;
                }
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 4, 1), y: 12 }, { x: new Date(2018, 4, 2), y: 10 },
            { x: new Date(2018, 4, 3), y: 8 }, { x: new Date(2018, 4, 5), y: 12 }];
            range.periodSelectorSettings.position = 'Top';
            range.series[0].animation.duration = 0;
            range.intervalType = 'Days';
            range.refresh();
        });
        it('checking weeks click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_8');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString().indexOf('May') > -1 || args.start.toString().indexOf('Apr') > -1).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 3), y: 23 }, { x: new Date(2018, 4, 1), y: 12 },
            { x: new Date(2018, 4, 2), y: 10 }, { x: new Date(2018, 4, 5), y: 12 }];
            range.intervalType = 'Weeks';
            range.periodSelectorSettings.periods = [{ intervalType: 'Weeks', interval: 2, text: '3w' }];
            range.refresh();
        });
        it('checking months click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_10');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString().indexOf('Mar') > -1 || args.start.toString().indexOf('Apr') > -1).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2017, 5), y: 45 }, { x: new Date(2018, 3), y: 23 }, { x: new Date(2018, 4, 1), y: 12 },
            { x: new Date(2018, 4, 2), y: 10 }, { x: new Date(2018, 4, 5), y: 12 }];
            range.intervalType = 'Months';
            range.periodSelectorSettings.periods = [{ intervalType: 'Months', interval: 2, text: '2m' }];
            range.refresh();
        });
        it('checking quarter click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_12');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    //expect(args.start.toString()).toEqual('Mon Mar 05 2018 00:00:00 GMT+0530 (India Standard Time)');
                    isCheck = false;
                }
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2017, 1), y: 10 }, { x: new Date(2017, 5), y: 45 }, { x: new Date(2018, 3), y: 23 }, { x: new Date(2018, 4, 1), y: 12 },
            { x: new Date(2018, 4, 2), y: 10 }, { x: new Date(2018, 4, 5), y: 12 }];
            range.intervalType = 'Quarter';
            range.periodSelectorSettings.periods = [{ intervalType: 'Quarter', interval: 1, text: '1q' }];
            range.refresh();
        });
        it('checking ytd click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_15');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    // expect(args.start.toString() === ('Mon Feb 05 2018 00:00:00 GMT+0530 (India Standard Time)')
                    //        || args.start.toString() === ('Mon Feb 05 2018 00:00:00 GMT+0000 (UTC)')).toBe(true);
                    // expect(args.start.toString()).toEqual('Mon Jan 01 2018 05:30:00 GMT+0530 (India Standard Time)');
                    isCheck = false;
                }
                done();
            };
            range.intervalType = 'Auto';
            range.periodSelectorSettings.periods = [{ intervalType: 'Quarter', interval: 1, text: '1q' }, { text: 'ytd' }, { text: 'all' }];
            range.refresh();
        });
        it('checking all click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_20');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    isCheck = false;
                }
                done();
            };
            range.intervalType = 'Auto';
            range.periodSelectorSettings.periods = [{ intervalType: 'Years', interval: 1, text: '1y' }, { text: 'ytd' }, { text: 'all' }];
            range.refresh();
        });
        it('checking years click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_22');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    isCheck = false;
                }
                done();
            };
            range.intervalType = 'Auto';
            range.periodSelectorSettings.periods = [{ intervalType: 'Years', interval: 1, text: '1y' }, { text: 'ytd' }, { text: 'all' }];
            range.refresh();
        });
    });
    describe('with default case', () => {
        let element: Element;
        let range: RangeNavigator;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        let trigger: MouseEvents = new MouseEvents();
        let isCheck: boolean = false;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{ dataSource: [{ x: new Date(2018, 4, 3, 4), y: 5 }, { x: new Date(2018, 4, 3, 5), y: 5 }], xName: 'x', yName: 'y', type: 'Line' }], valueType: 'DateTime', height: '500', animationDuration: 0,
                periodSelectorSettings: {
                     position: 'Top', height: 200, periods: [{ intervalType: 'Hours', interval: 3, text: '3h' },
                    { intervalType: 'Minutes', interval: 30, text: '30m' }, { intervalType: 'Seconds', interval: 100, text: '100sec' }]
                }

            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checking hours click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_30');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString() === ('Thu May 03 2018 04:00:00 GMT+0530 (India Standard Time)')
                           || args.start.toString() === ('Thu May 03 2018 04:00:00 GMT+0000 (Coordinated Universal Time)')).toBe(true);
                    //expect(args.start.toString()).toEqual('Thu May 03 2018 04:00:00 GMT+0530 (India Standard Time)');
                    isCheck = false;
                }
                done();
            };
            range.refresh();
        });
        it('checking minutes click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_35');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString().indexOf('May') > 1).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.refresh();
        });
        it('checking seconds click', (done: Function) => {
            range.loaded = (args: Object) => {
                let dayButton: HTMLElement = document.getElementById('e-tbr-btn_38');
                trigger.clickEvent(dayButton);
                isCheck = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString().indexOf('May') > 1 ).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.periodSelectorSettings = {
                position: 'Top', height: 200, periods: [{ intervalType: 'Seconds', interval: 100, text: '100sec' }, 
                { text: 'all'}]
            };
            range.refresh();
        });
        it('checing date range changed', (done: Function) => {
            range.loaded = (args: Object) => {                
                isCheck = true;
                range.periodSelectorModule.datePicker.startDate =  new Date(2018, 4, 3, 4);
                range.periodSelectorModule.datePicker.endDate =  new Date(2018, 4, 3, 4);
                range.periodSelectorModule.triggerChange = true;
            };
            range.changed = (args: IChangedEventArgs) => {
                if (isCheck) {
                    expect(args.start.toString().indexOf('May') > 1 ).toBe(true);
                    isCheck = false;
                }
                done();
            };
            range.refresh();
        });
    });
});