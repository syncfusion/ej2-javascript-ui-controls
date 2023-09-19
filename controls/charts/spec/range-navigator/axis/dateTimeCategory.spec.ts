import { RangeNavigator  } from '../../../src/range-navigator/index';
import { AreaSeries } from '../../../src/chart/index';
import { Logarithmic, DateTime, LineSeries, DateTimeCategory } from '../../../src/chart/index';
import { createElement } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { PeriodSelector, PeriodSelectorSettingsModel } from '../../../src/index';
RangeNavigator.Inject(Logarithmic, DateTime, LineSeries, AreaSeries, DateTimeCategory, PeriodSelector);
/**
 * Spec for range navigator axis
 */
let value: number = 0;
let point: object;
const data: object[] = [];
for (let j: number = 0; j < 1200; j++) {
    value += (Math.random() * 10 - 5);
    value = value < 0 ? Math.abs(value) : value;
    point = { x: new Date(2000, 2, j), y: value, y1: value + 10 };
    data.push(point);
}
let dateTime: object[] = [];
dateTime = [{ x: new Date(2000, 3), y: 34 }, { x: new Date(2000, 6), y: 32 },
    { x: new Date(2000, 11), y: 23 }, { x: new Date(2001, 3), y: 12 },
    { x: new Date(2001, 6), y: 83 }, { x: new Date(2001, 11), y: 76 },
    { x: new Date(2002, 3), y: 34 }, { x: new Date(2002, 6), y: 32 },
    { x: new Date(2002, 11), y: 65 }, { x: new Date(2003, 3), y: 98 },
    { x: new Date(2003, 6), y: 10 }, { x: new Date(2003, 11), y: 34 }];
let dateTimeCat: object[] = [];
dateTimeCat = [{ x: new Date(2000, 3), y: 36 }, { x: new Date(2000, 6), y: 34 },
    { x: new Date(2000, 11), y: 25 }, { x: new Date(2001, 3), y: 14 },
    { x: new Date(2001, 6), y: 85 }, { x: new Date(2001, 11), y: 78 },
    { x: new Date(2002, 3), y: 36 }, { x: new Date(2002, 6), y: 34 },
    { x: new Date(2002, 11), y: 67 }, { x: new Date(2003, 3), y: 100 },
    { x: new Date(2003, 6), y: 12 }, { x: new Date(2003, 11), y: 36 }];
let unorderedData: object[] = [];
unorderedData = [{ x: new Date(2000, 11), y: 36 }, { x: new Date(2000, 6), y: 34 },
    { x: new Date(2000, 3), y: 25 }, { x: new Date(2001, 3), y: 14 },
    { x: new Date(2001, 6), y: 85 }, { x: new Date(2001, 11), y: 78 },
    { x: new Date(2002, 3), y: 36 }, { x: new Date(2002, 6), y: 34 },
    { x: new Date(2002, 11), y: 67 }, { x: new Date(2003, 11), y: 100 },
    { x: new Date(2003, 3), y: 12 }, { x: new Date(2003, 6), y: 36 }];
const periodsValue: PeriodSelectorSettingsModel = {
    periods: [
        { text: '1M', interval: 1, intervalType: 'Months' }, { text: '3M', interval: 3, intervalType: 'Months' },
        { text: '6M', interval: 6, intervalType: 'Months' }, { text: 'YTD' },
        { text: '1Y', interval: 1, intervalType: 'Years' },
        {
            text: '2Y', interval: 2, intervalType: 'Years', selected: true
        },
        { text: 'All' }
    ]
};
describe('Range navigator', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('with default case', () => {
        let element: Element;
        let range: RangeNavigator;
        let chart: Element;
        let rangeElement: Element = createElement('div', { id: 'container' });
        let axisLabel: Element;
        beforeAll(() => {
            document.body.appendChild(rangeElement);
            range = new RangeNavigator({
                series: [{
                    dataSource: dateTime,
                    xName: 'x', yName: 'y', type: 'Line'
                }],
                value: [new Date(2000, 8), new Date(2001, 10)],
                valueType: 'DateTimeCategory',
                width: '800'
            });
            range.appendTo('#container');
        });
        afterAll((): void => {
            range.destroy();
            rangeElement.remove();
        });
        it('checked with quarter as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.firstChild.childNodes[2].textContent).toBe('Quarter3 2018');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1), y: 23 }, { x: new Date(2018, 4, 12), y: 34 },
                { x: new Date(2018, 8, 23), y: 32 }, { x: new Date(2018, 10, 45), y: 56 }];
            range.intervalType = 'Quarter';
            range.refresh();
        });
        it('checked with month as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                let axisLabel: Element = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].firstChild.textContent).toBe('Jan');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1), y: 23 }, { x: new Date(2018, 2, 12), y: 34 },
                { x: new Date(2018, 4, 23), y: 32 }, { x: new Date(2018, 6, 45), y: 56 }];
            range.intervalType = 'Months';
            range.refresh();
        });
        it('checked with weeks as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].firstChild.textContent).toBe('Week1');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 12), y: 23 }, { x: new Date(2018, 0, 23), y: 34 },
                { x: new Date(2018, 1, 23), y: 32 }, { x: new Date(2018, 1, 25), y: 56 }];
            range.intervalType = 'Weeks';
            range.refresh();
        });
        it('checked with days as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].firstChild.textContent).toBe('Jan 1');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1), y: 23 }, { x: new Date(2018, 0, 2), y: 34 },
                { x: new Date(2018, 1, 3), y: 32 }, { x: new Date(2018, 1, 10), y: 56 }];
            range.intervalType = 'Days';
            range.width = '800';
            range.refresh();
        });
        it('checked with hours as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].firstChild.textContent).toBe('4 AM');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1, 4), y: 23 }, { x: new Date(2018, 0, 1, 5), y: 34 },
                { x: new Date(2018, 0, 1, 8), y: 32 }, { x: new Date(2018, 0, 1, 9), y: 56 }];
            range.intervalType = 'Hours';
            range.refresh();
        });
        it('checked with Minutes as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toBe('10:42 AM');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1, 10, 12), y: 23 }, { x: new Date(2018, 0, 1, 10, 22), y: 34 },
                { x: new Date(2018, 0, 1, 10, 33), y: 32 }, { x: new Date(2018, 0, 1, 10, 42), y: 56 }];
            range.intervalType = 'Minutes';
            range.refresh();
        });
        it('checked with seconds as label type', (done: Function) => {
            range.loaded = (args: Object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toBe('10:12:40 AM');
                done();
            };
            range.series[0].dataSource = [{ x: new Date(2018, 0, 1, 10, 12, 10), y: 23 }, { x: new Date(2018, 0, 1, 10, 12, 20), y: 34 },
                { x: new Date(2018, 0, 1, 10, 12, 30), y: 32 }, { x: new Date(2018, 0, 1, 10, 12, 40), y: 56 }];
            range.intervalType = 'Seconds';
            range.interval = 10;
            range.refresh();
        });
        it('checking with date value as string', (done: Function) => {
            range.loaded = (args: object) => {
                axisLabel = document.getElementById('container_FirstLevelAxisLabels');
                expect(axisLabel.firstElementChild.textContent).toEqual('12:00:00 AM');
                done();
            };
            range.series[0].dataSource = [{ x: '2018/01/01 00:00:00', y: 21 },
                { x: '2018/02/01 00:00:00', y: 70 }, { x: '2019/02/01 00:00:00', y: 70 }];
            range.labelIntersectAction = 'Hide';
            range.refresh();
        });
        it('checking with default grouping', (done: Function) => {
            range.loaded = (args: object): void => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toEqual('Quarter3');
                expect(axisLabel.childNodes[1].lastChild.textContent).toEqual('2003');
                done();
            };
            range.series[0].dataSource = dateTime;
            range.intervalType = 'Quarter';
            range.groupBy = 'Years';
            range.enableGrouping = true;
            range.refresh();
        });
        it('checking with skeleton formats', (done: Function) => {
            range.loaded = (args: Object) => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toEqual('7/1/2003');
                done();
            };
            range.skeleton = 'yMd';
            range.enableGrouping = false;
            range.refresh();
        });
        it('checking with unordered data', (done: Function) => {
            range.loaded = (args: Object) => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toEqual('7/1/2003');
                done();
            };
            range.series = [{
                dataSource: unorderedData,
                xName: 'x', yName: 'y', type: 'Line'
            }
            ];
            range.intervalType = 'Months';
            range.refresh();
        });
        it('checking with multiple series', (done: Function) => {
            range.loaded = (args: Object) => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toEqual('7/1/2003');
                done();
            };
            range.series = [{
                dataSource: dateTime,
                xName: 'x', yName: 'y', type: 'Line'
            },
            {
                dataSource: dateTimeCat,
                xName: 'x', yName: 'y', type: 'Line'
            }
            ];
            range.intervalType = 'Months';
            range.refresh();
        });
        it('checking with period selector', (done: Function) => {
            range.loaded = (args: object) => {
                axisLabel = document.getElementById('container_AxisLabels');
                expect(axisLabel.childNodes[0].lastChild.textContent).toEqual('7/1/2003');
                done();
            };
            range. periodSelectorSettings = periodsValue;
            range.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
