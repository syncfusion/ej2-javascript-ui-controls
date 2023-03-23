/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ajax, HijriParser, loadCldr, createElement, remove } from '@syncfusion/ej2-base';
import { RecurrenceEditor } from '../../src/recurrence-editor/recurrence-editor';
import { generate, generateSummary } from '../../src/recurrence-editor/date-generator';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { CallbackFunction } from '../../src';

/**
 * test case for islamic reccurence.
 *
 * @param {number[]} dates Accepts the collection of dates in number format
 * @returns {Object[]} Returns the collection of objects
 * @private
 */
export function getHijriDates(dates: number[]): Record<string, any>[] {
    const hijriDates: Record<string, any>[] = [];
    for (let i: number = 0; i < dates.length; i++) {
        const hijriObject: Record<string, any> =
            HijriParser.getHijriDate(new Date(dates[parseInt(i.toString(), 10)])) as Record<string, any>;
        hijriDates.push(hijriObject);
    }
    return hijriDates;
}

describe('Islamic mode', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Schedule - recurrence Freq- Daily', () => {
        const startDate: Date = new Date('Tue, 06 May 2014');
        it('Default - Interval', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":9},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":13},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":17},{"year":1435,"month":7,"date":19},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":25},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":29},{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":3},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":7}]');
        });
        it('Default - Interval - Count-10', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=DAILY;INTERVAL=1;COUNT=10;UNTIL=20140729T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16}]');
        });
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(startDate, rule, null, 0, 43, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},{"year":1435,"month":7,"date":8},' +
                '{"year":1435,"month":7,"date":9},{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},{"year":1435,"month":7,"date":16},' +
                '{"year":1435,"month":7,"date":17},{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},{"year":1435,"month":7,"date":24},' +
                '{"year":1435,"month":7,"date":27},{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1435,"month":8,"date":1},{"year":1435,"month":8,"date":4},' +
                '{"year":1435,"month":8,"date":5},{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":11},{"year":1435,"month":8,"date":12},' +
                '{"year":1435,"month":8,"date":13},{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":20},' +
                '{"year":1435,"month":8,"date":21},{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},{"year":1435,"month":8,"date":28},' +
                '{"year":1435,"month":8,"date":29},{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6},{"year":1435,"month":9,"date":7},' +
                '{"year":1435,"month":9,"date":10},{"year":1435,"month":9,"date":11},{"year":1435,"month":9,"date":12},' +
                '{"year":1435,"month":9,"date":13},{"year":1435,"month":9,"date":14},{"year":1435,"month":9,"date":17},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":19},{"year":1435,"month":9,"date":20},' +
                '{"year":1435,"month":9,"date":21},{"year":1435,"month":9,"date":24},{"year":1435,"month":9,"date":25},' +
                '{"year":1435,"month":9,"date":26},{"year":1435,"month":9,"date":27},{"year":1435,"month":9,"date":28},' +
                '{"year":1435,"month":10,"date":1},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - ByDay - BYMONTH', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=DAILY;BYMONTH=8;INTERVAL=1;UNTIL=20140629T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":2},{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":9},' +
                '{"year":1435,"month":8,"date":10},{"year":1435,"month":8,"date":11},' +
                '{"year":1435,"month":8,"date":12},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":16},{"year":1435,"month":8,"date":17},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},' +
                '{"year":1435,"month":8,"date":20},{"year":1435,"month":8,"date":21},' +
                '{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":23},' +
                '{"year":1435,"month":8,"date":24},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},' +
                '{"year":1435,"month":8,"date":28},{"year":1435,"month":8,"date":29}]');

        });
        it('Default - ByDay - BYMONTHDAY', () => {
            const rule: string = 'FREQ=DAILY;BYDAY=FR;BYMONTHDAY=15;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014'), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":15}]');
        });
        it('Default - ByDay - BYYEARDAY', () => {
            const rule: string = 'FREQ=DAILY;BYYEARDAY=30;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(new Date('2013/11/04'), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":1,"date":30}]');
        });
    });
    describe('Schedule - recurrence Freq- Daily (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - Interval', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;INTERVAL=2', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":9},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":13},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":17},{"year":1435,"month":7,"date":19},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":25},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":29},{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":3},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":7},{"year":1435,"month":8,"date":9},' +
                '{"year":1435,"month":8,"date":11},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":15},{"year":1435,"month":8,"date":17},' +
                '{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":21},' +
                '{"year":1435,"month":8,"date":23},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":27},{"year":1435,"month":8,"date":29},' +
                '{"year":1435,"month":9,"date":2},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":6},{"year":1435,"month":9,"date":8},' +
                '{"year":1435,"month":9,"date":10},{"year":1435,"month":9,"date":12},' +
                '{"year":1435,"month":9,"date":14},{"year":1435,"month":9,"date":16},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":20},' +
                '{"year":1435,"month":9,"date":22},{"year":1435,"month":9,"date":24},' +
                '{"year":1435,"month":9,"date":26},{"year":1435,"month":9,"date":28},' +
                '{"year":1435,"month":9,"date":30},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - Interval with modified startDate', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=DAILY;INTERVAL=2;UNTIL=20140729T000000Z', null, 0, undefined, new Date('Thu Jul 03 2014 '), 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":9,"date":6},' +
                '{"year":1435,"month":9,"date":8},{"year":1435,"month":9,"date":10},' +
                '{"year":1435,"month":9,"date":12},{"year":1435,"month":9,"date":14},' +
                '{"year":1435,"month":9,"date":16},{"year":1435,"month":9,"date":18},' +
                '{"year":1435,"month":9,"date":20},{"year":1435,"month":9,"date":22},' +
                '{"year":1435,"month":9,"date":24},{"year":1435,"month":9,"date":26},' +
                '{"year":1435,"month":9,"date":28},{"year":1435,"month":9,"date":30},' +
                '{"year":1435,"month":10,"date":2}]');
        });
        it('Default - Interval - Count-10', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;INTERVAL=1;COUNT=10', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16}]');
        });
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":11},' +
                '{"year":1435,"month":8,"date":12},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},' +
                '{"year":1435,"month":8,"date":20},{"year":1435,"month":8,"date":21},' +
                '{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},' +
                '{"year":1435,"month":8,"date":28},{"year":1435,"month":8,"date":29},' +
                '{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6}]');
        });
        it('Default - ByDay - BYMONTH', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=DAILY;BYMONTH=8;INTERVAL=1;UNTIL=20140629T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":2},{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":9},' +
                '{"year":1435,"month":8,"date":10},{"year":1435,"month":8,"date":11},' +
                '{"year":1435,"month":8,"date":12},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":16},{"year":1435,"month":8,"date":17},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},' +
                '{"year":1435,"month":8,"date":20},{"year":1435,"month":8,"date":21},' +
                '{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":23},' +
                '{"year":1435,"month":8,"date":24},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},' +
                '{"year":1435,"month":8,"date":28},{"year":1435,"month":8,"date":29}]');
        });
        it('Default - ByDay - BYMONTHDAY', () => {
            const dates: number[] = generate(
                new Date('Sun Jun 01 2014'), 'FREQ=DAILY;BYMONTHDAY=15;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":9,"date":15},{"year":1435,"month":10,"date":15},' +
                '{"year":1435,"month":11,"date":15},{"year":1435,"month":12,"date":15},' +
                '{"year":1436,"month":1,"date":15},{"year":1436,"month":2,"date":15},' +
                '{"year":1436,"month":3,"date":15},{"year":1436,"month":4,"date":15},' +
                '{"year":1436,"month":5,"date":15},{"year":1436,"month":6,"date":15},' +
                '{"year":1436,"month":7,"date":15},{"year":1436,"month":8,"date":15},' +
                '{"year":1436,"month":9,"date":15},{"year":1436,"month":10,"date":15},' +
                '{"year":1436,"month":11,"date":15},{"year":1436,"month":12,"date":15},' +
                '{"year":1437,"month":1,"date":15},{"year":1437,"month":2,"date":15},' +
                '{"year":1437,"month":3,"date":15},{"year":1437,"month":4,"date":15},' +
                '{"year":1437,"month":5,"date":15},{"year":1437,"month":6,"date":15},' +
                '{"year":1437,"month":7,"date":15},{"year":1437,"month":8,"date":15},' +
                '{"year":1437,"month":9,"date":15},{"year":1437,"month":10,"date":15},' +
                '{"year":1437,"month":11,"date":15},{"year":1437,"month":12,"date":15},' +
                '{"year":1438,"month":1,"date":15},{"year":1438,"month":2,"date":15},' +
                '{"year":1438,"month":3,"date":15},{"year":1438,"month":4,"date":15},' +
                '{"year":1438,"month":5,"date":15},{"year":1438,"month":6,"date":15},' +
                '{"year":1438,"month":7,"date":15},{"year":1438,"month":8,"date":15},' +
                '{"year":1438,"month":9,"date":15},{"year":1438,"month":10,"date":15},' +
                '{"year":1438,"month":11,"date":15},{"year":1438,"month":12,"date":15},' +
                '{"year":1439,"month":1,"date":15},{"year":1439,"month":2,"date":15}]');
        });
        it('Default - ByDay - BYYEARDAY', () => {
            const dates: number[] = generate(
                new Date('Sun Jun 01 2014'), 'FREQ=DAILY;BYYEARDAY=168;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":6,"date":21},' +
                '{"year":1437,"month":6,"date":20},{"year":1438,"month":6,"date":19},' +
                '{"year":1439,"month":6,"date":19},{"year":1440,"month":6,"date":20},' +
                '{"year":1441,"month":6,"date":20},{"year":1442,"month":6,"date":21},' +
                '{"year":1443,"month":6,"date":20},{"year":1444,"month":6,"date":20},' +
                '{"year":1445,"month":6,"date":20},{"year":1446,"month":6,"date":19},' +
                '{"year":1447,"month":6,"date":19},{"year":1448,"month":6,"date":20},' +
                '{"year":1449,"month":6,"date":21},{"year":1450,"month":6,"date":21},' +
                '{"year":1451,"month":6,"date":20},{"year":1452,"month":6,"date":19},' +
                '{"year":1453,"month":6,"date":20},{"year":1454,"month":6,"date":20},' +
                '{"year":1455,"month":6,"date":21},{"year":1456,"month":6,"date":21},' +
                '{"year":1457,"month":6,"date":21},{"year":1458,"month":6,"date":21},' +
                '{"year":1459,"month":6,"date":20},{"year":1460,"month":6,"date":20},' +
                '{"year":1461,"month":6,"date":20},{"year":1462,"month":6,"date":20},' +
                '{"year":1463,"month":6,"date":21},{"year":1464,"month":6,"date":21},' +
                '{"year":1465,"month":6,"date":21},{"year":1466,"month":6,"date":20},' +
                '{"year":1467,"month":6,"date":20},{"year":1468,"month":6,"date":20},' +
                '{"year":1469,"month":6,"date":21},{"year":1470,"month":6,"date":20},' +
                '{"year":1471,"month":6,"date":21},{"year":1472,"month":6,"date":20},' +
                '{"year":1473,"month":6,"date":20},{"year":1474,"month":6,"date":19},' +
                '{"year":1475,"month":6,"date":20},{"year":1476,"month":6,"date":20},' +
                '{"year":1477,"month":6,"date":21},{"year":1478,"month":6,"date":21}]');
        });
    });
    describe('Schedule - recurrence Freq- Weekly', () => {
        const startDate: Date = new Date('Tue May 06 2014');
        it('Default - Having WEEKLY property alone and all other properties are not provided', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;COUNT=5', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":8,"date":5}]');
        });
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},{"year":1435,"month":7,"date":8},' +
                '{"year":1435,"month":7,"date":9},{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},{"year":1435,"month":7,"date":16},' +
                '{"year":1435,"month":7,"date":17},{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},{"year":1435,"month":7,"date":24},' +
                '{"year":1435,"month":7,"date":27},{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1435,"month":8,"date":1},{"year":1435,"month":8,"date":4},' +
                '{"year":1435,"month":8,"date":5},{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":11},{"year":1435,"month":8,"date":12},' +
                '{"year":1435,"month":8,"date":13},{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":20},' +
                '{"year":1435,"month":8,"date":21},{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},{"year":1435,"month":8,"date":28},' +
                '{"year":1435,"month":8,"date":29},{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6},{"year":1435,"month":9,"date":7},' +
                '{"year":1435,"month":9,"date":10},{"year":1435,"month":9,"date":11},{"year":1435,"month":9,"date":12},' +
                '{"year":1435,"month":9,"date":13},{"year":1435,"month":9,"date":14},{"year":1435,"month":9,"date":17},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":19},{"year":1435,"month":9,"date":20},' +
                '{"year":1435,"month":9,"date":21},{"year":1435,"month":9,"date":24},{"year":1435,"month":9,"date":25},' +
                '{"year":1435,"month":9,"date":26},{"year":1435,"month":9,"date":27},{"year":1435,"month":9,"date":28},' +
                '{"year":1435,"month":10,"date":1},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;BYDAY=WE,TH,FR,MO,TU;INTERVAL=1;UNTIL=20140729T000000Z', null, 3, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},{"year":1435,"month":7,"date":8},' +
                '{"year":1435,"month":7,"date":9},{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},{"year":1435,"month":7,"date":16},' +
                '{"year":1435,"month":7,"date":17},{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},{"year":1435,"month":7,"date":24},' +
                '{"year":1435,"month":7,"date":27},{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1435,"month":8,"date":1},{"year":1435,"month":8,"date":4},' +
                '{"year":1435,"month":8,"date":5},{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":11},{"year":1435,"month":8,"date":12},' +
                '{"year":1435,"month":8,"date":13},{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":20},' +
                '{"year":1435,"month":8,"date":21},{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},{"year":1435,"month":8,"date":28},' +
                '{"year":1435,"month":8,"date":29},{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6},{"year":1435,"month":9,"date":7},' +
                '{"year":1435,"month":9,"date":10},{"year":1435,"month":9,"date":11},{"year":1435,"month":9,"date":12},' +
                '{"year":1435,"month":9,"date":13},{"year":1435,"month":9,"date":14},{"year":1435,"month":9,"date":17},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":19},{"year":1435,"month":9,"date":20},' +
                '{"year":1435,"month":9,"date":21},{"year":1435,"month":9,"date":24},{"year":1435,"month":9,"date":25},' +
                '{"year":1435,"month":9,"date":26},{"year":1435,"month":9,"date":27},{"year":1435,"month":9,"date":28},' +
                '{"year":1435,"month":10,"date":1},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - Interval 2', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA;UNTIL=20140729T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":19},{"year":1435,"month":7,"date":20},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":7,"date":22},' +
                '{"year":1435,"month":7,"date":23},{"year":1435,"month":7,"date":24},' +
                '{"year":1435,"month":7,"date":25},{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":9},' +
                '{"year":1435,"month":8,"date":17},{"year":1435,"month":8,"date":18},' +
                '{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":20},' +
                '{"year":1435,"month":8,"date":21},{"year":1435,"month":8,"date":22},' +
                '{"year":1435,"month":8,"date":23},{"year":1435,"month":9,"date":2},' +
                '{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6},' +
                '{"year":1435,"month":9,"date":7},{"year":1435,"month":9,"date":8},' +
                '{"year":1435,"month":9,"date":16},{"year":1435,"month":9,"date":17},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":19},' +
                '{"year":1435,"month":9,"date":20},{"year":1435,"month":9,"date":21},' +
                '{"year":1435,"month":9,"date":22},{"year":1435,"month":9,"date":30},' +
                '{"year":1435,"month":10,"date":1},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - BYMONTH', () => {
            const rule: string = 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140801T000000Z';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":18},{"year":1435,"month":7,"date":19},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":25},' +
                '{"year":1435,"month":7,"date":26},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30}]');
        });
        it('Default - BYMONTH count', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;COUNT=3', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9}]');
        });
    });
    describe('Schedule - recurrence Freq- Weekly (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014');
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1435,"month":8,"date":1},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":11},' +
                '{"year":1435,"month":8,"date":12},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":8,"date":18},{"year":1435,"month":8,"date":19},' +
                '{"year":1435,"month":8,"date":20},{"year":1435,"month":8,"date":21},' +
                '{"year":1435,"month":8,"date":22},{"year":1435,"month":8,"date":25},' +
                '{"year":1435,"month":8,"date":26},{"year":1435,"month":8,"date":27},' +
                '{"year":1435,"month":8,"date":28},{"year":1435,"month":8,"date":29},' +
                '{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6}]');
        });
        it('Default - Interval 2', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":19},{"year":1435,"month":7,"date":20},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":7,"date":22},' +
                '{"year":1435,"month":7,"date":23},{"year":1435,"month":7,"date":24},' +
                '{"year":1435,"month":7,"date":25},{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":4},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":6},{"year":1435,"month":8,"date":7},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":8,"date":9},' +
                '{"year":1435,"month":8,"date":17},{"year":1435,"month":8,"date":18},' +
                '{"year":1435,"month":8,"date":19},{"year":1435,"month":8,"date":20},' +
                '{"year":1435,"month":8,"date":21},{"year":1435,"month":8,"date":22},' +
                '{"year":1435,"month":8,"date":23},{"year":1435,"month":9,"date":2},' +
                '{"year":1435,"month":9,"date":3},{"year":1435,"month":9,"date":4},' +
                '{"year":1435,"month":9,"date":5},{"year":1435,"month":9,"date":6},' +
                '{"year":1435,"month":9,"date":7},{"year":1435,"month":9,"date":8},' +
                '{"year":1435,"month":9,"date":16},{"year":1435,"month":9,"date":17},' +
                '{"year":1435,"month":9,"date":18},{"year":1435,"month":9,"date":19},' +
                '{"year":1435,"month":9,"date":20},{"year":1435,"month":9,"date":21},' +
                '{"year":1435,"month":9,"date":22},{"year":1435,"month":9,"date":30},' +
                '{"year":1435,"month":10,"date":1},{"year":1435,"month":10,"date":2}]');
        });
        it('Default - BYMONTH', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":18},{"year":1435,"month":7,"date":19},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":25},' +
                '{"year":1435,"month":7,"date":26},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30},{"year":1436,"month":7,"date":1},' +
                '{"year":1436,"month":7,"date":2},{"year":1436,"month":7,"date":3},' +
                '{"year":1436,"month":7,"date":4},{"year":1436,"month":7,"date":5},' +
                '{"year":1436,"month":7,"date":6},{"year":1436,"month":7,"date":7},' +
                '{"year":1436,"month":7,"date":8},{"year":1436,"month":7,"date":9},' +
                '{"year":1436,"month":7,"date":10},{"year":1436,"month":7,"date":11},' +
                '{"year":1436,"month":7,"date":12},{"year":1436,"month":7,"date":13},' +
                '{"year":1436,"month":7,"date":14},{"year":1436,"month":7,"date":15},' +
                '{"year":1436,"month":7,"date":16},{"year":1436,"month":7,"date":17},' +
                '{"year":1436,"month":7,"date":18},{"year":1436,"month":7,"date":19}]');
        });
        it('Default - WKST', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":19},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":8,"date":3}]');
        });
        it('Default - WKST', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":26}]');
        });
        it('Default - WEEKLY Freq with WKST and BYSETPOS', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO;BYSETPOS=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":19}]');
        });
        it('Default - WEEKLY Freq without WKST and BYSETPOS', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;BYSETPOS=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":19},{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":17}]');
        });
        it('Default - WEEKLY Freq with single BYDAY value and BYSETPOS', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU;BYSETPOS=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":21},{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":8,"date":19}]');
        });
    });
    describe('Schedule - recurrence Freq- MONTHLY', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay Single Day', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":10},' +
                '{"year":1435,"month":8,"date":8},{"year":1435,"month":9,"date":14}]');
        });
        it('Default - ByDay Multiple Days', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":2},{"year":1435,"month":9,"date":7}]');
        });
        it('Default - ByDay Multiple Days Week startDay changed', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 5, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":2},{"year":1435,"month":9,"date":7}]');
        });
        it('Default - ByDay Multiple Days Week startDay changed with count 3', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z;COUNT=3';
            const dates: number[] = generate(startDate, rule, null, 5, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":2},{"year":1435,"month":9,"date":7}]');
        });
        it('Default - BYMONTH', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":11},' +
                '{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":18},{"year":1435,"month":7,"date":19},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":25},' +
                '{"year":1435,"month":7,"date":26},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30}]');
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=15;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":15},{"year":1435,"month":9,"date":15}]');
        });
        it('Default - BYMONTHDAY-set', () => {
            const dates: number[] = generate(
                new Date('Wed Nov 01 2017'), 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1439,"month":3,"date":4},' +
                '{"year":1439,"month":4,"date":2},{"year":1439,"month":5,"date":7},' +
                '{"year":1439,"month":6,"date":5},{"year":1439,"month":7,"date":4},' +
                '{"year":1439,"month":8,"date":2},{"year":1439,"month":9,"date":1},' +
                '{"year":1439,"month":10,"date":6},{"year":1439,"month":11,"date":5},' +
                '{"year":1439,"month":12,"date":4},{"year":1440,"month":1,"date":2},' +
                '{"year":1440,"month":2,"date":1},{"year":1440,"month":3,"date":6},' +
                '{"year":1440,"month":4,"date":5},{"year":1440,"month":5,"date":3},' +
                '{"year":1440,"month":6,"date":1},{"year":1440,"month":7,"date":6},' +
                '{"year":1440,"month":8,"date":5},{"year":1440,"month":9,"date":3},' +
                '{"year":1440,"month":10,"date":2},{"year":1440,"month":11,"date":7},' +
                '{"year":1440,"month":12,"date":6},{"year":1441,"month":1,"date":5},' +
                '{"year":1441,"month":2,"date":3},{"year":1441,"month":3,"date":2},' +
                '{"year":1441,"month":4,"date":7},{"year":1441,"month":5,"date":6},' +
                '{"year":1441,"month":6,"date":4},{"year":1441,"month":7,"date":2},' +
                '{"year":1441,"month":8,"date":1},{"year":1441,"month":9,"date":6},' +
                '{"year":1441,"month":10,"date":4},{"year":1441,"month":11,"date":3},' +
                '{"year":1441,"month":12,"date":1},{"year":1442,"month":1,"date":7},' +
                '{"year":1442,"month":2,"date":6},{"year":1442,"month":3,"date":4},' +
                '{"year":1442,"month":4,"date":3},{"year":1442,"month":5,"date":1},' +
                '{"year":1442,"month":6,"date":7},{"year":1442,"month":7,"date":5},' +
                '{"year":1442,"month":8,"date":4},{"year":1442,"month":9,"date":2}]');
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=30;INTERVAL=1;UNTIL=20150729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":9,"date":30},' +
                '{"year":1435,"month":10,"date":30},{"year":1435,"month":12,"date":30},' +
                '{"year":1436,"month":2,"date":30},{"year":1436,"month":4,"date":30},' +
                '{"year":1436,"month":6,"date":30},{"year":1436,"month":8,"date":30}]');
        });
        it('Default - BYMONTHDAY negative Value', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=-5;INTERVAL=1;UNTIL=20150729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":10,"date":26},' +
                '{"year":1436,"month":4,"date":26},{"year":1436,"month":6,"date":26},' +
                '{"year":1436,"month":7,"date":25},{"year":1436,"month":8,"date":26},' +
                '{"year":1436,"month":9,"date":25}]');
        });
        it('Default - BYMONTHDAY negative Value', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=-29;INTERVAL=1;UNTIL=20150729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":9,"date":2},' +
                '{"year":1435,"month":12,"date":2},{"year":1436,"month":1,"date":1},' +
                '{"year":1436,"month":2,"date":2},{"year":1436,"month":3,"date":1},' +
                '{"year":1436,"month":4,"date":2}]');
        });
        it('Default - BYYEARDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYYEARDAY=10;BYMONTH=1;INTERVAL=1;BYMONTHDAY=10;UNTIL=20140429T000000Z';
            const dates: number[] = generate(new Date('Sun Nov 01 2013 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":1,"date":10}]');
        });
    });
    describe('Schedule - recurrence Freq- MONTHLY (without EndDate)', () => {
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=10,11,12,13,14,15;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":11},' +
                '{"year":1435,"month":8,"date":12},{"year":1435,"month":8,"date":13},' +
                '{"year":1435,"month":8,"date":14},{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":9,"date":10},{"year":1435,"month":9,"date":11},' +
                '{"year":1435,"month":9,"date":12},{"year":1435,"month":9,"date":13},' +
                '{"year":1435,"month":9,"date":14}]');
        });
        it('Default - ByDay Single Day', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":8},{"year":1435,"month":9,"date":14}]');
        });
        it('Default - ByDay Single Day without BYSETPOS', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR;COUNT=3';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":8},' +
                '{"year":1435,"month":8,"date":15},{"year":1435,"month":8,"date":22}]');
        });
        it('Default - ByDay Multiple Days', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":9,"date":7}]');
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=15;INTERVAL=1';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":15},' +
                '{"year":1435,"month":9,"date":15},{"year":1435,"month":10,"date":15},' +
                '{"year":1435,"month":11,"date":15},{"year":1435,"month":12,"date":15},' +
                '{"year":1436,"month":1,"date":15},{"year":1436,"month":2,"date":15},' +
                '{"year":1436,"month":3,"date":15},{"year":1436,"month":4,"date":15},' +
                '{"year":1436,"month":5,"date":15},{"year":1436,"month":6,"date":15},' +
                '{"year":1436,"month":7,"date":15},{"year":1436,"month":8,"date":15},' +
                '{"year":1436,"month":9,"date":15},{"year":1436,"month":10,"date":15},' +
                '{"year":1436,"month":11,"date":15},{"year":1436,"month":12,"date":15},' +
                '{"year":1437,"month":1,"date":15},{"year":1437,"month":2,"date":15},' +
                '{"year":1437,"month":3,"date":15},{"year":1437,"month":4,"date":15},' +
                '{"year":1437,"month":5,"date":15},{"year":1437,"month":6,"date":15},' +
                '{"year":1437,"month":7,"date":15},{"year":1437,"month":8,"date":15},' +
                '{"year":1437,"month":9,"date":15},{"year":1437,"month":10,"date":15},' +
                '{"year":1437,"month":11,"date":15},{"year":1437,"month":12,"date":15},' +
                '{"year":1438,"month":1,"date":15},{"year":1438,"month":2,"date":15},' +
                '{"year":1438,"month":3,"date":15},{"year":1438,"month":4,"date":15},' +
                '{"year":1438,"month":5,"date":15},{"year":1438,"month":6,"date":15},' +
                '{"year":1438,"month":7,"date":15},{"year":1438,"month":8,"date":15},' +
                '{"year":1438,"month":9,"date":15},{"year":1438,"month":10,"date":15},' +
                '{"year":1438,"month":11,"date":15},{"year":1438,"month":12,"date":15},' +
                '{"year":1439,"month":1,"date":15},{"year":1439,"month":2,"date":15}]');
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=30;INTERVAL=1';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":9,"date":30},' +
                '{"year":1435,"month":10,"date":30},{"year":1435,"month":12,"date":30},' +
                '{"year":1436,"month":2,"date":30},{"year":1436,"month":4,"date":30},' +
                '{"year":1436,"month":6,"date":30},{"year":1436,"month":8,"date":30},' +
                '{"year":1436,"month":10,"date":30},{"year":1436,"month":12,"date":30},' +
                '{"year":1437,"month":1,"date":30},{"year":1437,"month":3,"date":30},' +
                '{"year":1437,"month":4,"date":30},{"year":1437,"month":7,"date":30},' +
                '{"year":1437,"month":9,"date":30},{"year":1437,"month":12,"date":30},' +
                '{"year":1438,"month":1,"date":30},{"year":1438,"month":3,"date":30},' +
                '{"year":1438,"month":4,"date":30},{"year":1438,"month":5,"date":30},' +
                '{"year":1438,"month":8,"date":30},{"year":1438,"month":11,"date":30},' +
                '{"year":1439,"month":1,"date":30},{"year":1439,"month":3,"date":30},' +
                '{"year":1439,"month":4,"date":30},{"year":1439,"month":5,"date":30},' +
                '{"year":1439,"month":7,"date":30},{"year":1439,"month":9,"date":30},' +
                '{"year":1439,"month":12,"date":30},{"year":1440,"month":2,"date":30},' +
                '{"year":1440,"month":4,"date":30},{"year":1440,"month":5,"date":30},' +
                '{"year":1440,"month":6,"date":30},{"year":1440,"month":8,"date":30},' +
                '{"year":1440,"month":10,"date":30},{"year":1441,"month":1,"date":30},' +
                '{"year":1441,"month":3,"date":30},{"year":1441,"month":5,"date":30},' +
                '{"year":1441,"month":6,"date":30},{"year":1441,"month":8,"date":30},' +
                '{"year":1441,"month":9,"date":30},{"year":1441,"month":11,"date":30},' +
                '{"year":1442,"month":2,"date":30},{"year":1442,"month":4,"date":30}]');
        });
        it('Default - BYYEARDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYYEARDAY=10;BYMONTH=1;INTERVAL=1;BYMONTHDAY=10';
            const dates: number[] = generate(new Date('Sun Nov 05 2013 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":1,"date":10},' +
                '{"year":1436,"month":1,"date":10},{"year":1437,"month":1,"date":10},' +
                '{"year":1438,"month":1,"date":10},{"year":1439,"month":1,"date":10},' +
                '{"year":1440,"month":1,"date":10},{"year":1441,"month":1,"date":10},' +
                '{"year":1442,"month":1,"date":10},{"year":1443,"month":1,"date":10},' +
                '{"year":1444,"month":1,"date":10},{"year":1445,"month":1,"date":10},' +
                '{"year":1446,"month":1,"date":10},{"year":1447,"month":1,"date":10},' +
                '{"year":1448,"month":1,"date":10},{"year":1449,"month":1,"date":10},' +
                '{"year":1450,"month":1,"date":10},{"year":1451,"month":1,"date":10},' +
                '{"year":1452,"month":1,"date":10},{"year":1453,"month":1,"date":10},' +
                '{"year":1454,"month":1,"date":10},{"year":1455,"month":1,"date":10},' +
                '{"year":1456,"month":1,"date":10},{"year":1457,"month":1,"date":10},' +
                '{"year":1458,"month":1,"date":10},{"year":1459,"month":1,"date":10},' +
                '{"year":1460,"month":1,"date":10},{"year":1461,"month":1,"date":10},' +
                '{"year":1462,"month":1,"date":10},{"year":1463,"month":1,"date":10},' +
                '{"year":1464,"month":1,"date":10},{"year":1465,"month":1,"date":10},' +
                '{"year":1466,"month":1,"date":10},{"year":1467,"month":1,"date":10},' +
                '{"year":1468,"month":1,"date":10},{"year":1469,"month":1,"date":10},' +
                '{"year":1470,"month":1,"date":10},{"year":1471,"month":1,"date":10},' +
                '{"year":1472,"month":1,"date":10},{"year":1473,"month":1,"date":10},' +
                '{"year":1474,"month":1,"date":10},{"year":1475,"month":1,"date":10},' +
                '{"year":1476,"month":1,"date":10},{"year":1477,"month":1,"date":10}]');
        });
        it('Default - ByDay Single Day with numeric value', () => {
            const rule: string = 'FREQ=MONTHLY;COUNT=6;BYDAY=-2MO';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":18},' +
                '{"year":1435,"month":9,"date":17},{"year":1435,"month":10,"date":22},' +
                '{"year":1435,"month":11,"date":20},{"year":1435,"month":12,"date":19},' +
                '{"year":1436,"month":1,"date":17}]');
        });
        it('Default - ByDay Single Day with negative BySetPos', () => {
            const rule: string = 'FREQ=MONTHLY;INTERVAL=2;COUNT=5;BYDAY=SU;BYSETPOS=-2';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":17},' +
                '{"year":1435,"month":10,"date":21},{"year":1435,"month":12,"date":18},' +
                '{"year":1436,"month":2,"date":22},{"year":1436,"month":4,"date":19}]');
        });
        it('Default - ByDay Multiple Same Days', () => {
            const rule: string = 'FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":3},' +
                '{"year":1435,"month":8,"date":24},{"year":1435,"month":10,"date":7},' +
                '{"year":1435,"month":10,"date":28},{"year":1435,"month":12,"date":4},' +
                '{"year":1435,"month":12,"date":25},{"year":1436,"month":2,"date":1},' +
                '{"year":1436,"month":2,"date":29},{"year":1436,"month":4,"date":5},' +
                '{"year":1436,"month":4,"date":26}]');
        });
        it('Default - ByDay Multiple Days with BYSETPOS', () => {
            const rule: string = 'FREQ=MONTHLY;COUNT=5;BYDAY=TU,WE;BYSETPOS=1';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":8,"date":5},' +
                '{"year":1435,"month":9,"date":4},{"year":1435,"month":10,"date":2},' +
                '{"year":1435,"month":11,"date":1},{"year":1435,"month":12,"date":6}]');
        });
    });
    describe('Schedule - recurrence Freq- YEARLY', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;COUNT=5;INTERVAL=1;';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":30},' +
                '{"year":1436,"month":12,"date":30},{"year":1437,"month":12,"date":29},' +
                '{"year":1438,"month":12,"date":29},{"year":1439,"month":12,"date":30}]');
        });
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":7},' +
                '{"year":1435,"month":7,"date":8},{"year":1435,"month":7,"date":9},' +
                '{"year":1435,"month":7,"date":10},{"year":1435,"month":7,"date":13},' +
                '{"year":1435,"month":7,"date":14},{"year":1435,"month":7,"date":15},' +
                '{"year":1435,"month":7,"date":16},{"year":1435,"month":7,"date":17},' +
                '{"year":1435,"month":7,"date":20},{"year":1435,"month":7,"date":21},' +
                '{"year":1435,"month":7,"date":22},{"year":1435,"month":7,"date":23},' +
                '{"year":1435,"month":7,"date":24},{"year":1435,"month":7,"date":27},' +
                '{"year":1435,"month":7,"date":28},{"year":1435,"month":7,"date":29},' +
                '{"year":1435,"month":7,"date":30}]');
        });
        it('Default - ByDay single value', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=MO;BYSETPOS=-1;COUNT=5;';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":26},' +
                '{"year":1436,"month":12,"date":29},{"year":1437,"month":12,"date":25},' +
                '{"year":1438,"month":12,"date":27},{"year":1439,"month":12,"date":30}]');
        });
        it('Default - BYMONTHDAY', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":12},{"year":1435,"month":7,"date":13}]');
        });
        it('Default - YearDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":23},' +
                '{"year":1438,"month":1,"date":1},{"year":1438,"month":4,"date":11},' +
                '{"year":1438,"month":7,"date":22},{"year":1441,"month":1,"date":1},' +
                '{"year":1441,"month":4,"date":11},{"year":1441,"month":7,"date":22},' +
                '{"year":1444,"month":1,"date":1},{"year":1444,"month":4,"date":12},' +
                '{"year":1444,"month":7,"date":23}]');
        });
        it('Default - YearDay- 355 ', () => {
            const rule: string = 'FREQ=YEARLY;INTERVAL=1;COUNT=2;BYYEARDAY=355';
            const dates: number[] = generate(new Date('Sun Jun 01 2014 '), rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1439,"month":12,"date":30},{"year":1447,"month":12,"date":29}]');
        });
        it('Default - YearDay- Negative Value ', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;INTERVAL=1;BYYEARDAY=-354', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":1,"date":2},' +
                '{"year":1437,"month":1,"date":1},{"year":1438,"month":1,"date":1},' +
                '{"year":1439,"month":1,"date":2},{"year":1440,"month":1,"date":1},' +
                '{"year":1441,"month":1,"date":1},{"year":1442,"month":1,"date":2},' +
                '{"year":1443,"month":1,"date":1},{"year":1444,"month":1,"date":1},' +
                '{"year":1445,"month":1,"date":2},{"year":1446,"month":1,"date":1},' +
                '{"year":1447,"month":1,"date":2},{"year":1448,"month":1,"date":1},' +
                '{"year":1449,"month":1,"date":1},{"year":1450,"month":1,"date":2},' +
                '{"year":1451,"month":1,"date":1},{"year":1452,"month":1,"date":1},' +
                '{"year":1453,"month":1,"date":2},{"year":1454,"month":1,"date":1},' +
                '{"year":1455,"month":1,"date":1},{"year":1456,"month":1,"date":2},' +
                '{"year":1457,"month":1,"date":1},{"year":1458,"month":1,"date":2},' +
                '{"year":1459,"month":1,"date":1},{"year":1460,"month":1,"date":1},' +
                '{"year":1461,"month":1,"date":2},{"year":1462,"month":1,"date":1},' +
                '{"year":1463,"month":1,"date":1},{"year":1464,"month":1,"date":2},' +
                '{"year":1465,"month":1,"date":1},{"year":1466,"month":1,"date":2},' +
                '{"year":1467,"month":1,"date":1},{"year":1468,"month":1,"date":1},' +
                '{"year":1469,"month":1,"date":2},{"year":1470,"month":1,"date":1},' +
                '{"year":1471,"month":1,"date":1},{"year":1472,"month":1,"date":2},' +
                '{"year":1473,"month":1,"date":1},{"year":1474,"month":1,"date":1},' +
                '{"year":1475,"month":1,"date":2},{"year":1476,"month":1,"date":1},' +
                '{"year":1477,"month":1,"date":2},{"year":1478,"month":1,"date":1}]');
        });
        it('Default - WeekNo with day', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":11},' +
                '{"year":1437,"month":5,"date":13},{"year":1438,"month":5,"date":9},' +
                '{"year":1439,"month":5,"date":12},{"year":1440,"month":5,"date":15},' +
                '{"year":1441,"month":5,"date":11},{"year":1442,"month":5,"date":13},' +
                '{"year":1443,"month":5,"date":16},{"year":1444,"month":5,"date":11},' +
                '{"year":1445,"month":5,"date":13},{"year":1446,"month":5,"date":9},' +
                '{"year":1447,"month":5,"date":12},{"year":1448,"month":5,"date":15},' +
                '{"year":1449,"month":5,"date":11},{"year":1450,"month":5,"date":13},' +
                '{"year":1451,"month":5,"date":15},{"year":1452,"month":5,"date":11},' +
                '{"year":1453,"month":5,"date":13},{"year":1454,"month":5,"date":9},' +
                '{"year":1455,"month":5,"date":12},{"year":1456,"month":5,"date":15},' +
                '{"year":1457,"month":5,"date":11},{"year":1458,"month":5,"date":13},' +
                '{"year":1459,"month":5,"date":15},{"year":1460,"month":5,"date":11},' +
                '{"year":1461,"month":5,"date":14},{"year":1462,"month":5,"date":10},' +
                '{"year":1463,"month":5,"date":13},{"year":1464,"month":5,"date":15},' +
                '{"year":1465,"month":5,"date":10},{"year":1466,"month":5,"date":13},' +
                '{"year":1467,"month":5,"date":15},{"year":1468,"month":5,"date":11},' +
                '{"year":1469,"month":5,"date":14},{"year":1470,"month":5,"date":10},' +
                '{"year":1471,"month":5,"date":13},{"year":1472,"month":5,"date":15},' +
                '{"year":1473,"month":5,"date":10},{"year":1474,"month":5,"date":13},' +
                '{"year":1475,"month":5,"date":16},{"year":1476,"month":5,"date":12},' +
                '{"year":1477,"month":5,"date":15},{"year":1478,"month":5,"date":10}]');
        });
        it('Default - WeekNo with day negative Value', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYWEEKNO=-34;BYDAY=MO', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":11},' +
                '{"year":1437,"month":5,"date":13},{"year":1438,"month":5,"date":9},' +
                '{"year":1439,"month":5,"date":12},{"year":1440,"month":5,"date":15},' +
                '{"year":1441,"month":5,"date":11},{"year":1442,"month":5,"date":13},' +
                '{"year":1443,"month":5,"date":16},{"year":1444,"month":5,"date":11},' +
                '{"year":1445,"month":5,"date":13},{"year":1446,"month":5,"date":9},' +
                '{"year":1447,"month":5,"date":12},{"year":1448,"month":5,"date":15},' +
                '{"year":1449,"month":5,"date":11},{"year":1450,"month":5,"date":13},' +
                '{"year":1451,"month":5,"date":15},{"year":1452,"month":5,"date":11},' +
                '{"year":1453,"month":5,"date":13},{"year":1454,"month":5,"date":9},' +
                '{"year":1455,"month":5,"date":12},{"year":1456,"month":5,"date":15},' +
                '{"year":1457,"month":5,"date":11},{"year":1458,"month":5,"date":13},' +
                '{"year":1459,"month":5,"date":15},{"year":1460,"month":5,"date":11},' +
                '{"year":1461,"month":5,"date":14},{"year":1462,"month":5,"date":10},' +
                '{"year":1463,"month":5,"date":13},{"year":1464,"month":5,"date":15},' +
                '{"year":1465,"month":5,"date":10},{"year":1466,"month":5,"date":13},' +
                '{"year":1467,"month":5,"date":15},{"year":1468,"month":5,"date":11},' +
                '{"year":1469,"month":5,"date":14},{"year":1470,"month":5,"date":10},' +
                '{"year":1471,"month":5,"date":13},{"year":1472,"month":5,"date":15},' +
                '{"year":1473,"month":5,"date":10},{"year":1474,"month":5,"date":13},' +
                '{"year":1475,"month":5,"date":16},{"year":1476,"month":5,"date":12},' +
                '{"year":1477,"month":5,"date":15},{"year":1478,"month":5,"date":10}]');
        });
        it('Default - WeekNo - without Day', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20;COUNT=7', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":10},' +
                '{"year":1436,"month":5,"date":11},{"year":1436,"month":5,"date":12},' +
                '{"year":1436,"month":5,"date":13},{"year":1436,"month":5,"date":14},' +
                '{"year":1436,"month":5,"date":15},{"year":1436,"month":5,"date":16}]');
        });
        it('Default - WeekNo - without Day', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1;COUNT=7;', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":25},' +
                '{"year":1435,"month":12,"date":26},{"year":1435,"month":12,"date":27},' +
                '{"year":1435,"month":12,"date":28},{"year":1435,"month":12,"date":29},' +
                '{"year":1435,"month":12,"date":30},{"year":1436,"month":1,"date":1}]');
        });
        it('Default - WeekNo - without Day', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53;COUNT=7;', null, 1, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":1,"date":3},' +
                '{"year":1436,"month":1,"date":4},{"year":1436,"month":1,"date":5},' +
                '{"year":1436,"month":1,"date":6},{"year":1436,"month":1,"date":7},' +
                '{"year":1436,"month":1,"date":8},{"year":1436,"month":1,"date":9}]');
        });
    });
    describe('Schedule - recurrence Freq- YEARLY (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;BYSETPOS=1;INTERVAL=1;COUNT=5', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":7,"date":1},' +
                '{"year":1437,"month":7,"date":1},{"year":1438,"month":7,"date":1},' +
                '{"year":1439,"month":7,"date":2},{"year":1440,"month":7,"date":1}]');
        });
        it('Default - ByDay', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;BYMONTH=5,6;INTERVAL=1;', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":1},' +
                '{"year":1437,"month":5,"date":1},{"year":1438,"month":5,"date":2},' +
                '{"year":1439,"month":5,"date":1},{"year":1440,"month":5,"date":1},' +
                '{"year":1441,"month":5,"date":1},{"year":1442,"month":5,"date":1},' +
                '{"year":1443,"month":5,"date":2},{"year":1444,"month":5,"date":1},' +
                '{"year":1445,"month":5,"date":1},{"year":1446,"month":5,"date":2},' +
                '{"year":1447,"month":5,"date":1},{"year":1448,"month":5,"date":1},' +
                '{"year":1449,"month":5,"date":1},{"year":1450,"month":5,"date":1},' +
                '{"year":1451,"month":5,"date":1},{"year":1452,"month":5,"date":1},' +
                '{"year":1453,"month":5,"date":1},{"year":1454,"month":5,"date":2},' +
                '{"year":1455,"month":5,"date":1},{"year":1456,"month":5,"date":1},' +
                '{"year":1457,"month":5,"date":1},{"year":1458,"month":5,"date":1},' +
                '{"year":1459,"month":5,"date":1},{"year":1460,"month":5,"date":1},' +
                '{"year":1461,"month":5,"date":1},{"year":1462,"month":5,"date":3},' +
                '{"year":1463,"month":5,"date":1},{"year":1464,"month":5,"date":1},' +
                '{"year":1465,"month":5,"date":3},{"year":1466,"month":5,"date":1},' +
                '{"year":1467,"month":5,"date":1},{"year":1468,"month":5,"date":1},' +
                '{"year":1469,"month":5,"date":1},{"year":1470,"month":5,"date":3},' +
                '{"year":1471,"month":5,"date":1},{"year":1472,"month":5,"date":1},' +
                '{"year":1473,"month":5,"date":3},{"year":1474,"month":5,"date":1},' +
                '{"year":1475,"month":5,"date":2},{"year":1476,"month":5,"date":1},' +
                '{"year":1477,"month":5,"date":1},{"year":1478,"month":5,"date":3}]');
        });
        it('Default - BYMONTHDAY', () => {
            const dates: number[] = generate(
                startDate, 'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":7,"date":12},' +
                '{"year":1435,"month":7,"date":13},{"year":1436,"month":7,"date":12},' +
                '{"year":1436,"month":7,"date":13},{"year":1437,"month":7,"date":12},' +
                '{"year":1437,"month":7,"date":13},{"year":1438,"month":7,"date":12},' +
                '{"year":1438,"month":7,"date":13},{"year":1439,"month":7,"date":12},' +
                '{"year":1439,"month":7,"date":13},{"year":1440,"month":7,"date":12},' +
                '{"year":1440,"month":7,"date":13},{"year":1441,"month":7,"date":12},' +
                '{"year":1441,"month":7,"date":13},{"year":1442,"month":7,"date":12},' +
                '{"year":1442,"month":7,"date":13},{"year":1443,"month":7,"date":12},' +
                '{"year":1443,"month":7,"date":13},{"year":1444,"month":7,"date":12},' +
                '{"year":1444,"month":7,"date":13},{"year":1445,"month":7,"date":12},' +
                '{"year":1445,"month":7,"date":13},{"year":1446,"month":7,"date":12},' +
                '{"year":1446,"month":7,"date":13},{"year":1447,"month":7,"date":12},' +
                '{"year":1447,"month":7,"date":13},{"year":1448,"month":7,"date":12},' +
                '{"year":1448,"month":7,"date":13},{"year":1449,"month":7,"date":12},' +
                '{"year":1449,"month":7,"date":13},{"year":1450,"month":7,"date":12},' +
                '{"year":1450,"month":7,"date":13},{"year":1451,"month":7,"date":12},' +
                '{"year":1451,"month":7,"date":13},{"year":1452,"month":7,"date":12},' +
                '{"year":1452,"month":7,"date":13},{"year":1453,"month":7,"date":12},' +
                '{"year":1453,"month":7,"date":13},{"year":1454,"month":7,"date":12},' +
                '{"year":1454,"month":7,"date":13},{"year":1455,"month":7,"date":12},' +
                '{"year":1455,"month":7,"date":13},{"year":1456,"month":7,"date":12}]');
        });
        it('Default - WeekNo - without Day', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":10},' +
                '{"year":1436,"month":5,"date":11},{"year":1436,"month":5,"date":12},' +
                '{"year":1436,"month":5,"date":13},{"year":1436,"month":5,"date":14},' +
                '{"year":1436,"month":5,"date":15},{"year":1436,"month":5,"date":16},' +
                '{"year":1437,"month":5,"date":12},{"year":1437,"month":5,"date":13},' +
                '{"year":1437,"month":5,"date":14},{"year":1437,"month":5,"date":15},' +
                '{"year":1437,"month":5,"date":16},{"year":1437,"month":5,"date":17},' +
                '{"year":1437,"month":5,"date":18},{"year":1438,"month":5,"date":8},' +
                '{"year":1438,"month":5,"date":9},{"year":1438,"month":5,"date":10},' +
                '{"year":1438,"month":5,"date":11},{"year":1438,"month":5,"date":12},' +
                '{"year":1438,"month":5,"date":13},{"year":1438,"month":5,"date":14},' +
                '{"year":1439,"month":5,"date":11},{"year":1439,"month":5,"date":12},' +
                '{"year":1439,"month":5,"date":13},{"year":1439,"month":5,"date":14},' +
                '{"year":1439,"month":5,"date":15},{"year":1439,"month":5,"date":16},' +
                '{"year":1439,"month":5,"date":17},{"year":1440,"month":5,"date":14},' +
                '{"year":1440,"month":5,"date":15},{"year":1440,"month":5,"date":16},' +
                '{"year":1440,"month":5,"date":17},{"year":1440,"month":5,"date":18},' +
                '{"year":1440,"month":5,"date":19},{"year":1440,"month":5,"date":20},' +
                '{"year":1441,"month":5,"date":10},{"year":1441,"month":5,"date":11},' +
                '{"year":1441,"month":5,"date":12},{"year":1441,"month":5,"date":13},' +
                '{"year":1441,"month":5,"date":14},{"year":1441,"month":5,"date":15},' +
                '{"year":1441,"month":5,"date":16},{"year":1442,"month":5,"date":12}]');
        });
        it('Default - WeekNo - without Day', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1', null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":25},' +
                '{"year":1435,"month":12,"date":26},{"year":1435,"month":12,"date":27},' +
                '{"year":1435,"month":12,"date":28},{"year":1435,"month":12,"date":29},' +
                '{"year":1435,"month":12,"date":30},{"year":1436,"month":1,"date":1},' +
                '{"year":1436,"month":12,"date":28},{"year":1436,"month":12,"date":29},' +
                '{"year":1436,"month":12,"date":30},{"year":1437,"month":1,"date":1},' +
                '{"year":1437,"month":1,"date":2},{"year":1437,"month":1,"date":3},' +
                '{"year":1437,"month":1,"date":4},{"year":1437,"month":12,"date":24},' +
                '{"year":1437,"month":12,"date":25},{"year":1437,"month":12,"date":26},' +
                '{"year":1437,"month":12,"date":27},{"year":1437,"month":12,"date":28},' +
                '{"year":1437,"month":12,"date":29},{"year":1437,"month":12,"date":30},' +
                '{"year":1437,"month":12,"date":24},{"year":1437,"month":12,"date":25},' +
                '{"year":1437,"month":12,"date":26},{"year":1437,"month":12,"date":27},' +
                '{"year":1437,"month":12,"date":28},{"year":1437,"month":12,"date":29},' +
                '{"year":1437,"month":12,"date":30},{"year":1437,"month":12,"date":24},' +
                '{"year":1437,"month":12,"date":25},{"year":1437,"month":12,"date":26},' +
                '{"year":1437,"month":12,"date":27},{"year":1437,"month":12,"date":28},' +
                '{"year":1437,"month":12,"date":29},{"year":1437,"month":12,"date":30},' +
                '{"year":1437,"month":12,"date":24},{"year":1437,"month":12,"date":25},' +
                '{"year":1437,"month":12,"date":26},{"year":1437,"month":12,"date":27},' +
                '{"year":1437,"month":12,"date":28},{"year":1437,"month":12,"date":29},' +
                '{"year":1437,"month":12,"date":30},{"year":1437,"month":12,"date":24}]');
        });
        it('Default - WeekNo - without Day max week no', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53', null, 1, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":1,"date":3},' +
                '{"year":1436,"month":1,"date":4},{"year":1436,"month":1,"date":5},' +
                '{"year":1436,"month":1,"date":6},{"year":1436,"month":1,"date":7},' +
                '{"year":1436,"month":1,"date":8},{"year":1436,"month":1,"date":9},' +
                '{"year":1438,"month":1,"date":9},{"year":1438,"month":1,"date":10},' +
                '{"year":1438,"month":1,"date":11},{"year":1438,"month":1,"date":12},' +
                '{"year":1438,"month":1,"date":13},{"year":1438,"month":1,"date":14},' +
                '{"year":1438,"month":1,"date":15},{"year":1440,"month":1,"date":7},' +
                '{"year":1440,"month":1,"date":8},{"year":1440,"month":1,"date":9},' +
                '{"year":1440,"month":1,"date":10},{"year":1440,"month":1,"date":11},' +
                '{"year":1440,"month":1,"date":12},{"year":1440,"month":1,"date":13},' +
                '{"year":1442,"month":1,"date":5},{"year":1442,"month":1,"date":6},' +
                '{"year":1442,"month":1,"date":7},{"year":1442,"month":1,"date":8},' +
                '{"year":1442,"month":1,"date":9},{"year":1442,"month":1,"date":10},' +
                '{"year":1442,"month":1,"date":11},{"year":1444,"month":1,"date":3},' +
                '{"year":1444,"month":1,"date":4},{"year":1444,"month":1,"date":5},' +
                '{"year":1444,"month":1,"date":6},{"year":1444,"month":1,"date":7},' +
                '{"year":1444,"month":1,"date":8},{"year":1444,"month":1,"date":9},' +
                '{"year":1446,"month":1,"date":9},{"year":1446,"month":1,"date":10},' +
                '{"year":1446,"month":1,"date":11},{"year":1446,"month":1,"date":12},' +
                '{"year":1446,"month":1,"date":13},{"year":1446,"month":1,"date":14},' +
                '{"year":1446,"month":1,"date":15},{"year":1448,"month":1,"date":7}]');
        });
    });
    describe('Schedule - recurrence Freq- YEARLY (Having functionalities)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=YEARLY;BYWEEKNO=53;UNTIL=20140229T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 1, undefined, null, 'Islamic')))
                .toBe(JSON.stringify([]));
        });
        it('Default - Having ByDay property alone', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=20MO;COUNT=5';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":4,"date":20},' +
                '{"year":1437,"month":3,"date":10},{"year":1438,"month":3,"date":20},' +
                '{"year":1439,"month":3,"date":9},{"year":1440,"month":2,"date":27}]');
        });
        it('Default - Having FREQ property alone and all other properties are not set', () => {
            const rule: string = 'FREQ=YEARLY;COUNT=5';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":6},' +
                '{"year":1437,"month":5,"date":6},{"year":1438,"month":5,"date":6},' +
                '{"year":1439,"month":5,"date":6},{"year":1440,"month":5,"date":6}]');
        });
        it('Default - Having FREQ property and BYMONTH property and all other properties are not set', () => {
            const rule: string = 'FREQ=YEARLY;BYMONTH=5;COUNT=5';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1436,"month":5,"date":6},' +
                '{"year":1437,"month":5,"date":6},{"year":1438,"month":5,"date":6},' +
                '{"year":1439,"month":5,"date":6},{"year":1440,"month":5,"date":6}]');
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values', () => {
            const rule: string = 'FREQ=YEARLY;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":25},' +
                '{"year":1437,"month":1,"date":5},{"year":1437,"month":12,"date":24},' +
                '{"year":1439,"month":1,"date":4},{"year":1439,"month":12,"date":29}]');
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values and multiple BYMONTH values', () => {
            const rule: string = 'FREQ=YEARLY;BYMONTH=1,12;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU;';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1435,"month":12,"date":4},' +
                '{"year":1435,"month":12,"date":25},{"year":1437,"month":1,"date":5},' +
                '{"year":1437,"month":1,"date":26},{"year":1437,"month":12,"date":3}]');
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values and BYSETPOS', () => {
            const rule: string = 'FREQ=YEARLY;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU;BYSETPOS=1';
            const dates: number[] = generate(startDate, rule, null, 0, undefined, null, 'Islamic');
            const hDates: Record<string, any>[] = getHijriDates(dates);
            expect(JSON.stringify(hDates)).toBe('[{"year":1437,"month":1,"date":5},' +
                '{"year":1439,"month":1,"date":4},{"year":1441,"month":1,"date":2},' +
                '{"year":1443,"month":1,"date":7},{"year":1445,"month":1,"date":5}]');
        });
    });

    describe('recurrence summary in islamic mode', () => {
        const loadCultureFiles: CallbackFunction = (name: string, base?: boolean): void => {
            const files: string[] = base ? ['numberingSystems.json'] :
                ['ca-gregorian.json', 'ca-islamic.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'];
            for (const prop of files) {
                let ajax: Ajax;
                if (base) {
                    ajax = new Ajax('base/spec/cldr-data/supplemental/' + prop, 'GET', false);
                } else {
                    ajax = new Ajax('base/spec/cldr-data/main/' + name + '/' + prop, 'GET', false);
                }
                ajax.onSuccess = (value: string) => loadCldr(JSON.parse(value));
                ajax.send();
            }
        };
        let recObj: RecurrenceEditor;
        const elem: HTMLElement = createElement('div', { id: 'RecurrenceEditor' });
        beforeAll(() => {
            document.body.appendChild(elem);
            loadCultureFiles('fr-CH');
            recObj = new RecurrenceEditor({ startDate: new Date('Fri, 25 Oct 2019'), calendarMode: 'Islamic', locale: 'fr-CH' });
            recObj.appendTo('#RecurrenceEditor');
        });
        afterAll(() => {
            if (recObj) {
                recObj.destroy();
            }
            remove(elem);
        });
        it('getRuleSummary public method testing', () => {
            const rule: string = 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z';
            const ruleSummary: string = recObj.getRuleSummary(rule);
            expect(ruleSummary).toEqual('every 2 day(s), until 6 Joum. th. 2014');
        });
        it('generate recurrence summary public method testing', () => {
            const rule: string = 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z';
            const ruleSummary: string = generateSummary(rule, recObj.localeObj, 'en');
            expect(ruleSummary).toEqual('every 2 day(s), until 6 Jun 2014');
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
