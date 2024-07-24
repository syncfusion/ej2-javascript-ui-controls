import { generate } from '../../src/recurrence-editor/date-generator';
import { profile, inMB, getMemoryProfile } from '../common.spec';
/**
 * test case for reccurence.
 */
describe('Recurrence Date Generator Specs', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Schedule - recurrence Freq- Daily', () => {
        const startDate: Date = new Date('Tue, 06 May 2014');
        it('Default - Interval', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Thu May 08 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(), new Date('Mon May 12 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Fri May 16 2014').getTime(),
                    new Date('Sun May 18 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Sat May 24 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Wed May 28 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Thu Jun 05 2014').getTime()
                ]));
        });
        it('Default - Interval - Count-10', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;INTERVAL=1;COUNT=10;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(), new Date('Sun May 11 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime(),
                    new Date('Fri May 16 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Wed May 28 2014').getTime(), new Date('Thu May 29 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - ByDay - BYMONTH', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;BYMONTH=6;INTERVAL=1;UNTIL=20140629T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Jun 01 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Sat Jun 07 2014').getTime(), new Date('Sun Jun 08 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Sat Jun 14 2014').getTime(),
                    new Date('Sun Jun 15 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Sat Jun 21 2014').getTime(), new Date('Sun Jun 22 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Sat Jun 28 2014').getTime(),
                    new Date('Sun Jun 29 2014').getTime()
                ]));
        });
        it('Default - ByDay - BYMONTHDAY', () => {
            const rule: string = 'FREQ=DAILY;BYDAY=FR;BYMONTHDAY=13;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Fri Jun 13 2014 ').getTime()]));
        });
        it('Default - ByDay - BYYEARDAY', () => {
            const rule: string = 'FREQ=DAILY;BYYEARDAY=168;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014 '), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Tue Jun 17 2014 ').getTime()]));
        });
    });

    describe('Schedule - recurrence Freq- Daily (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - Interval', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;INTERVAL=2', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Thu May 08 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(), new Date('Mon May 12 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Fri May 16 2014').getTime(),
                    new Date('Sun May 18 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Sat May 24 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Wed May 28 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Thu Jun 05 2014').getTime(),
                    new Date('Sat Jun 07 2014').getTime(), new Date('Mon Jun 09 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Fri Jun 13 2014').getTime(),
                    new Date('Sun Jun 15 2014').getTime(), new Date('Tue Jun 17 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Sat Jun 21 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Wed Jun 25 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Sun Jun 29 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Thu Jul 03 2014').getTime(),
                    new Date('Sat Jul 05 2014').getTime(), new Date('Mon Jul 07 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Fri Jul 11 2014').getTime(),
                    new Date('Sun Jul 13 2014').getTime(), new Date('Tue Jul 15 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Sat Jul 19 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Wed Jul 23 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Sun Jul 27 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - Interval with modified startDate', () => {
            const rule: string = 'FREQ=DAILY;INTERVAL=2;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0, undefined, new Date('Thu Jul 03 2014 '))))
                .toBe(JSON.stringify([
                    new Date('Thu Jul 03 2014').getTime(), new Date('Sat Jul 05 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Wed Jul 09 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Sun Jul 13 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Thu Jul 17 2014').getTime(),
                    new Date('Sat Jul 19 2014').getTime(), new Date('Mon Jul 21 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Fri Jul 25 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - Interval - Count-10', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;INTERVAL=1;COUNT=10', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(), new Date('Sun May 11 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime(),
                    new Date('Fri May 16 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Wed May 28 2014').getTime(), new Date('Thu May 29 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime()
                ]));
        });
        it('Default - ByDay - BYMONTH', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=DAILY;BYMONTH=6;INTERVAL=1;UNTIL=20140629T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Jun 01 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Sat Jun 07 2014').getTime(), new Date('Sun Jun 08 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Sat Jun 14 2014').getTime(),
                    new Date('Sun Jun 15 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Sat Jun 21 2014').getTime(), new Date('Sun Jun 22 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Sat Jun 28 2014').getTime(),
                    new Date('Sun Jun 29 2014').getTime()
                ]));
        });
        it('Default - ByDay - BYMONTHDAY', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), 'FREQ=DAILY;BYMONTHDAY=13;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri Jun 13 2014').getTime(), new Date('Sun Jul 13 2014').getTime(),
                    new Date('Wed Aug 13 2014').getTime(), new Date('Sat Sep 13 2014').getTime(),
                    new Date('Mon Oct 13 2014').getTime(), new Date('Thu Nov 13 2014').getTime(),
                    new Date('Sat Dec 13 2014').getTime(), new Date('Tue Jan 13 2015').getTime(),
                    new Date('Fri Feb 13 2015').getTime(), new Date('Fri Mar 13 2015').getTime(),
                    new Date('Mon Apr 13 2015').getTime(), new Date('Wed May 13 2015').getTime(),
                    new Date('Sat Jun 13 2015').getTime(), new Date('Mon Jul 13 2015').getTime(),
                    new Date('Thu Aug 13 2015').getTime(), new Date('Sun Sep 13 2015').getTime(),
                    new Date('Tue Oct 13 2015').getTime(), new Date('Fri Nov 13 2015').getTime(),
                    new Date('Sun Dec 13 2015').getTime(), new Date('Wed Jan 13 2016').getTime(),
                    new Date('Sat Feb 13 2016').getTime(), new Date('Sun Mar 13 2016').getTime(),
                    new Date('Wed Apr 13 2016').getTime(), new Date('Fri May 13 2016').getTime(),
                    new Date('Mon Jun 13 2016').getTime(), new Date('Wed Jul 13 2016').getTime(),
                    new Date('Sat Aug 13 2016').getTime(), new Date('Tue Sep 13 2016').getTime(),
                    new Date('Thu Oct 13 2016').getTime(), new Date('Sun Nov 13 2016').getTime(),
                    new Date('Tue Dec 13 2016').getTime(), new Date('Fri Jan 13 2017').getTime(),
                    new Date('Mon Feb 13 2017').getTime(), new Date('Mon Mar 13 2017').getTime(),
                    new Date('Thu Apr 13 2017').getTime(), new Date('Sat May 13 2017').getTime(),
                    new Date('Tue Jun 13 2017').getTime(), new Date('Thu Jul 13 2017').getTime(),
                    new Date('Sun Aug 13 2017').getTime(), new Date('Wed Sep 13 2017').getTime(),
                    new Date('Fri Oct 13 2017').getTime(), new Date('Mon Nov 13 2017').getTime(),
                    new Date('Wed Dec 13 2017').getTime()
                ]));
        });
        it('Default - ByDay - BYYEARDAY', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), 'FREQ=DAILY;BYYEARDAY=168;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 17 2015').getTime(),
                    new Date('Thu Jun 16 2016').getTime(), new Date('Sat Jun 17 2017').getTime(),
                    new Date('Sun Jun 17 2018').getTime(), new Date('Mon Jun 17 2019').getTime(),
                    new Date('Tue Jun 16 2020').getTime(), new Date('Thu Jun 17 2021').getTime(),
                    new Date('Fri Jun 17 2022').getTime(), new Date('Sat Jun 17 2023').getTime(),
                    new Date('Sun Jun 16 2024').getTime(), new Date('Tue Jun 17 2025').getTime(),
                    new Date('Wed Jun 17 2026').getTime(), new Date('Thu Jun 17 2027').getTime(),
                    new Date('Fri Jun 16 2028').getTime(), new Date('Sun Jun 17 2029').getTime(),
                    new Date('Mon Jun 17 2030').getTime(), new Date('Tue Jun 17 2031').getTime(),
                    new Date('Wed Jun 16 2032').getTime(), new Date('Fri Jun 17 2033').getTime(),
                    new Date('Sat Jun 17 2034').getTime(), new Date('Sun Jun 17 2035').getTime(),
                    new Date('Mon Jun 16 2036').getTime(), new Date('Wed Jun 17 2037').getTime(),
                    new Date('Thu Jun 17 2038').getTime(), new Date('Fri Jun 17 2039').getTime(),
                    new Date('Sat Jun 16 2040').getTime(), new Date('Mon Jun 17 2041').getTime(),
                    new Date('Tue Jun 17 2042').getTime(), new Date('Wed Jun 17 2043').getTime(),
                    new Date('Thu Jun 16 2044').getTime(), new Date('Sat Jun 17 2045').getTime(),
                    new Date('Sun Jun 17 2046').getTime(), new Date('Mon Jun 17 2047').getTime(),
                    new Date('Tue Jun 16 2048').getTime(), new Date('Thu Jun 17 2049').getTime(),
                    new Date('Fri Jun 17 2050').getTime(), new Date('Sat Jun 17 2051').getTime(),
                    new Date('Sun Jun 16 2052').getTime(), new Date('Tue Jun 17 2053').getTime(),
                    new Date('Wed Jun 17 2054').getTime(), new Date('Thu Jun 17 2055').getTime(),
                    new Date('Fri Jun 16 2056').getTime()
                ]));
        });
        it('Default - ByDay with Start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 1, 10).getTime(), new Date(2022, 1, 2, 10).getTime(),
                    new Date(2022, 1, 3, 10).getTime(), new Date(2022, 1, 4, 10).getTime(),
                    new Date(2022, 1, 7, 10).getTime()]));
        });
    });

    describe('Schedule - recurrence Freq- Weekly', () => {
        const startDate: Date = new Date('Tue May 06 2014');
        it('Default - Having WEEKLY property alone and all other properties are not provided', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                    new Date('Tue May 20 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                    new Date('Tue Jun 03 2014 ').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime(),
                    new Date('Fri May 16 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Wed May 28 2014').getTime(), new Date('Thu May 29 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;BYDAY=WE,TH,FR,MO,TU;INTERVAL=1;UNTIL=20140729T000000Z', null, 3)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime(),
                    new Date('Fri May 16 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Wed May 28 2014').getTime(), new Date('Thu May 29 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        //interval
        it('Default - Interval 2', () => {
            //FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(),
                    new Date('Sun May 18 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Sat May 24 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
                    new Date('Mon Jun 02 2014').getTime(), new Date('Tue Jun 03 2014').getTime(),
                    new Date('Wed Jun 04 2014').getTime(), new Date('Thu Jun 05 2014').getTime(),
                    new Date('Fri Jun 06 2014').getTime(), new Date('Sat Jun 07 2014').getTime(),
                    new Date('Sun Jun 15 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Sat Jun 21 2014').getTime(), new Date('Sun Jun 29 2014').getTime(),
                    new Date('Mon Jun 30 2014').getTime(), new Date('Tue Jul 01 2014').getTime(),
                    new Date('Wed Jul 02 2014').getTime(), new Date('Thu Jul 03 2014').getTime(),
                    new Date('Fri Jul 04 2014').getTime(), new Date('Sat Jul 05 2014').getTime(),
                    new Date('Sun Jul 13 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Sat Jul 19 2014').getTime(), new Date('Sun Jul 27 2014').getTime(),
                    new Date('Mon Jul 28 2014').getTime(), new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('893683 - Weekly recurrence appointment date generation testing with repeat interval of 2', () => {
            //FREQ=WEEKLY;INTERVAL=2;BYDAY=MO
            expect(JSON.stringify(generate(new Date('Sat Jul 13 2024'), 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Jul 22 2024').getTime(), new Date('Mon Aug 05 2024').getTime(),
                    new Date('Mon Aug 19 2024').getTime(), new Date('Mon Sep 02 2024').getTime(),
                    new Date('Mon Sep 16 2024').getTime(),
                    new Date('Mon Sep 30 2024').getTime(), new Date('Mon Oct 14 2024').getTime(),
                    new Date('Mon Oct 28 2024').getTime(), new Date('Mon Nov 11 2024').getTime(),
                    new Date('Mon Nov 25 2024').getTime(), new Date('Mon Dec 09 2024').getTime(),
                    new Date('Mon Dec 23 2024').getTime(), new Date('Mon Jan 06 2025').getTime(),
                    new Date('Mon Jan 20 2025').getTime(), new Date('Mon Feb 03 2025').getTime(),
                    new Date('Mon Feb 17 2025').getTime(), new Date('Mon Mar 03 2025').getTime(),
                    new Date('Mon Mar 17 2025').getTime(), new Date('Mon Mar 31 2025').getTime(),
                    new Date('Mon Apr 14 2025').getTime(), new Date('Mon Apr 28 2025').getTime(),
                    new Date('Mon May 12 2025').getTime(), new Date('Mon May 26 2025').getTime(),
                    new Date('Mon Jun 09 2025').getTime(), new Date('Mon Jun 23 2025').getTime(),
                    new Date('Mon Jul 07 2025').getTime(), new Date('Mon Jul 21 2025').getTime(),
                    new Date('Mon Aug 04 2025').getTime(), new Date('Mon Aug 18 2025').getTime(),
                    new Date('Mon Sep 01 2025').getTime(), new Date('Mon Sep 15 2025').getTime(),
                    new Date('Mon Sep 29 2025').getTime(), new Date('Mon Oct 13 2025').getTime(),
                    new Date('Mon Oct 27 2025').getTime(), new Date('Mon Nov 10 2025').getTime(),
                    new Date('Mon Nov 24 2025').getTime(), new Date('Mon Dec 08 2025').getTime(),
                    new Date('Mon Dec 22 2025').getTime(), new Date('Mon Jan 05 2026').getTime(),
                    new Date('Mon Jan 19 2026').getTime(), new Date('Mon Feb 02 2026').getTime(),
                    new Date('Mon Feb 16 2026').getTime(), new Date('Mon Mar 02 2026').getTime()
                ]));
        });
        it('Default - BYMONTH', () => {
            const rule: string = 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140801T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Sat Jul 05 2014').getTime(), new Date('Sun Jul 06 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Sat Jul 12 2014').getTime(),
                    new Date('Sun Jul 13 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Sat Jul 19 2014').getTime(), new Date('Sun Jul 20 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Sat Jul 26 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime(), new Date('Wed Jul 30 2014').getTime(),
                    new Date('Thu Jul 31 2014').getTime()
                ]));
        });
        it('Default - BYMONTH count', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;COUNT=3', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(), new Date('Thu Jul 03 2014 ').getTime()
                ]));
        });
    });

    describe('Schedule - recurrence Freq- Weekly (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014');
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Wed May 14 2014').getTime(), new Date('Thu May 15 2014').getTime(),
                    new Date('Fri May 16 2014').getTime(), new Date('Mon May 19 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Wed May 21 2014').getTime(),
                    new Date('Thu May 22 2014').getTime(), new Date('Fri May 23 2014').getTime(),
                    new Date('Mon May 26 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Wed May 28 2014').getTime(), new Date('Thu May 29 2014').getTime(),
                    new Date('Fri May 30 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Mon Jun 09 2014').getTime(), new Date('Tue Jun 10 2014').getTime(),
                    new Date('Wed Jun 11 2014').getTime(), new Date('Thu Jun 12 2014').getTime(),
                    new Date('Fri Jun 13 2014').getTime(), new Date('Mon Jun 16 2014').getTime(),
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 18 2014').getTime(),
                    new Date('Thu Jun 19 2014').getTime(), new Date('Fri Jun 20 2014').getTime(),
                    new Date('Mon Jun 23 2014').getTime(), new Date('Tue Jun 24 2014').getTime(),
                    new Date('Wed Jun 25 2014').getTime(), new Date('Thu Jun 26 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime()
                ]));
        });
        //interval
        it('Default - Interval 2', () => {
            //FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 07 2014').getTime(),
                    new Date('Thu May 08 2014').getTime(), new Date('Fri May 09 2014').getTime(),
                    new Date('Sat May 10 2014').getTime(), new Date('Sun May 18 2014').getTime(),
                    new Date('Mon May 19 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Wed May 21 2014').getTime(), new Date('Thu May 22 2014').getTime(),
                    new Date('Fri May 23 2014').getTime(), new Date('Sat May 24 2014').getTime(),
                    new Date('Sun Jun 01 2014').getTime(), new Date('Mon Jun 02 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Wed Jun 04 2014').getTime(),
                    new Date('Thu Jun 05 2014').getTime(), new Date('Fri Jun 06 2014').getTime(),
                    new Date('Sat Jun 07 2014').getTime(), new Date('Sun Jun 15 2014').getTime(),
                    new Date('Mon Jun 16 2014').getTime(), new Date('Tue Jun 17 2014').getTime(),
                    new Date('Wed Jun 18 2014').getTime(), new Date('Thu Jun 19 2014').getTime(),
                    new Date('Fri Jun 20 2014').getTime(), new Date('Sat Jun 21 2014').getTime(),
                    new Date('Sun Jun 29 2014').getTime(), new Date('Mon Jun 30 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Sat Jul 05 2014').getTime(), new Date('Sun Jul 13 2014').getTime(),
                    new Date('Mon Jul 14 2014').getTime(), new Date('Tue Jul 15 2014').getTime(),
                    new Date('Wed Jul 16 2014').getTime(), new Date('Thu Jul 17 2014').getTime(),
                    new Date('Fri Jul 18 2014').getTime(), new Date('Sat Jul 19 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - BYMONTH', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Sat Jul 05 2014').getTime(), new Date('Sun Jul 06 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Sat Jul 12 2014').getTime(),
                    new Date('Sun Jul 13 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Sat Jul 19 2014').getTime(), new Date('Sun Jul 20 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Sat Jul 26 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime(), new Date('Wed Jul 30 2014').getTime(),
                    new Date('Thu Jul 31 2014').getTime(), new Date('Wed Jul 01 2015').getTime(),
                    new Date('Thu Jul 02 2015').getTime(), new Date('Fri Jul 03 2015').getTime(),
                    new Date('Sat Jul 04 2015').getTime(), new Date('Sun Jul 05 2015').getTime(),
                    new Date('Mon Jul 06 2015').getTime(), new Date('Tue Jul 07 2015').getTime(),
                    new Date('Wed Jul 08 2015').getTime(), new Date('Thu Jul 09 2015').getTime(),
                    new Date('Fri Jul 10 2015').getTime(), new Date('Sat Jul 11 2015').getTime(),
                    new Date('Sun Jul 12 2015').getTime()
                ]));
        });
        it('Default - WKST', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=SU', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Sun May 18 2014').getTime(),
                    new Date('Tue May 20 2014').getTime(), new Date('Sun Jun 01 2014').getTime()
                ]));
        });
        it('Default - WKST', () => {
            expect(JSON.stringify(generate(new Date('Sun May 11 2014'), 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 11 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Sun May 25 2014').getTime(), new Date('Tue Jun 03 2014').getTime()
                ]));
        });
        it('Default - WEEKLY Freq with WKST and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;WKST=MO;BYSETPOS=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Tue Jun 17 2014').getTime()
                ]));
        });
        it('Default - WEEKLY Freq without WKST and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;BYSETPOS=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Sun May 18 2014').getTime(),
                    new Date('Sun Jun 01 2014').getTime(), new Date('Sun Jun 15 2014').getTime()
                ]));
        });
        it('Default - WEEKLY Freq with single BYDAY value and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU;BYSETPOS=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Tue May 20 2014').getTime(),
                    new Date('Tue Jun 03 2014').getTime(), new Date('Tue Jun 17 2014').getTime()
                ]));
        });
        it('Default - Having BYMONTH with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=WEEKLY;BYDAY=SU;BYMONTH=12;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 11, 4, 10).getTime(), new Date(2022, 11, 11, 10).getTime(),
                    new Date(2022, 11, 18, 10).getTime(), new Date(2022, 11, 25, 10).getTime(),
                    new Date(2023, 11, 3, 10).getTime()
                ]));
        });
        it('Default - BYDAY with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=WEEKLY;INTERVAL=2;COUNT=4;BYDAY=TU,SU;', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 1, 10).getTime(), new Date(2022, 1, 13, 10).getTime(),
                    new Date(2022, 1, 15, 10).getTime(), new Date(2022, 1, 27, 10).getTime()
                ]));
        });
    });

    describe('Schedule - recurrence Freq- MONTHLY', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay Single Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri May 09 2014').getTime(), new Date('Fri Jun 13 2014').getTime(), new Date('Fri Jul 11 2014').getTime()
                ]));
        });
        it('Default - ByDay Multiple Days', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 0)))
                .toBe(JSON.stringify([new Date('Sat Jun 07 2014 ').getTime(), new Date('Sat Jul 05 2014 ').getTime()]));
        });
        it('Default - ByDay Multiple Days Week startDay changed', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 5)))
                .toBe(JSON.stringify([new Date('Sat Jun 07 2014 ').getTime(), new Date('Sat Jul 05 2014 ').getTime()]));
        });
        it('Default - ByDay Multiple Days Week startDay changed with count 3', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z;COUNT=3';
            expect(JSON.stringify(generate(startDate, rule, null, 5)))
                .toBe(JSON.stringify([new Date('Sat Jun 07 2014 ').getTime(), new Date('Sat Jul 05 2014 ').getTime()]));
        });
        it('Default - BYMONTH', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Sat Jul 05 2014').getTime(), new Date('Sun Jul 06 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Sat Jul 12 2014').getTime(),
                    new Date('Sun Jul 13 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Sat Jul 19 2014').getTime(), new Date('Sun Jul 20 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Sat Jul 26 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=13;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Fri Jun 13 2014').getTime(), new Date('Sun Jul 13 2014').getTime()]));
        });
        it('Default - BYMONTHDAY-set', () => {
            expect(JSON.stringify(generate(new Date('Wed Nov 01 2017'), 'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Wed Nov 01 2017').getTime(), new Date('Wed Dec 06 2017').getTime(),
                    new Date('Wed Jan 03 2018').getTime(), new Date('Wed Feb 07 2018').getTime(),
                    new Date('Wed Mar 07 2018').getTime(), new Date('Wed Apr 04 2018').getTime(),
                    new Date('Wed May 02 2018').getTime(), new Date('Wed Jun 06 2018').getTime(),
                    new Date('Wed Jul 04 2018').getTime(), new Date('Wed Aug 01 2018').getTime(),
                    new Date('Wed Sep 05 2018').getTime(), new Date('Wed Oct 03 2018').getTime(),
                    new Date('Wed Nov 07 2018').getTime(), new Date('Wed Dec 05 2018').getTime(),
                    new Date('Wed Jan 02 2019').getTime(), new Date('Wed Feb 06 2019').getTime(),
                    new Date('Wed Mar 06 2019').getTime(), new Date('Wed Apr 03 2019').getTime(),
                    new Date('Wed May 01 2019').getTime(), new Date('Wed Jun 05 2019').getTime(),
                    new Date('Wed Jul 03 2019').getTime(), new Date('Wed Aug 07 2019').getTime(),
                    new Date('Wed Sep 04 2019').getTime(), new Date('Wed Oct 02 2019').getTime(),
                    new Date('Wed Nov 06 2019').getTime(), new Date('Wed Dec 04 2019').getTime(),
                    new Date('Wed Jan 01 2020').getTime(), new Date('Wed Feb 05 2020').getTime(),
                    new Date('Wed Mar 04 2020').getTime(), new Date('Wed Apr 01 2020').getTime(),
                    new Date('Wed May 06 2020').getTime(), new Date('Wed Jun 03 2020').getTime(),
                    new Date('Wed Jul 01 2020').getTime(), new Date('Wed Aug 05 2020').getTime(),
                    new Date('Wed Sep 02 2020').getTime(), new Date('Wed Oct 07 2020').getTime(),
                    new Date('Wed Nov 04 2020').getTime(), new Date('Wed Dec 02 2020').getTime(),
                    new Date('Wed Jan 06 2021').getTime(), new Date('Wed Feb 03 2021').getTime(),
                    new Date('Wed Mar 03 2021').getTime(), new Date('Wed Apr 07 2021').getTime(),
                    new Date('Wed May 05 2021').getTime()
                ]));
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=31;INTERVAL=1;UNTIL=20150729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jul 31 2014').getTime(), new Date('Sun Aug 31 2014').getTime(),
                    new Date('Fri Oct 31 2014').getTime(), new Date('Wed Dec 31 2014').getTime(),
                    new Date('Sat Jan 31 2015').getTime(), new Date('Tue Mar 31 2015').getTime(),
                    new Date('Sun May 31 2015').getTime()
                ]));
        });
        it('Default - BYMONTHDAY negative Value', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=-5;INTERVAL=1;UNTIL=20150729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jun 26 2014').getTime(), new Date('Sun Jul 27 2014').getTime(),
                    new Date('Wed Aug 27 2014').getTime(), new Date('Fri Sep 26 2014').getTime(),
                    new Date('Mon Oct 27 2014').getTime(), new Date('Wed Nov 26 2014').getTime(),
                    new Date('Sat Dec 27 2014').getTime(), new Date('Tue Jan 27 2015').getTime(),
                    new Date('Tue Feb 24 2015').getTime(), new Date('Fri Mar 27 2015').getTime(),
                    new Date('Sun Apr 26 2015').getTime(), new Date('Wed May 27 2015').getTime(),
                    new Date('Fri Jun 26 2015').getTime(), new Date('Mon Jul 27 2015').getTime()
                ]));
        });
        it('Default - BYMONTHDAY negative Value', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=-31;INTERVAL=1;UNTIL=20150729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Fri Aug 01 2014').getTime(),
                    new Date('Wed Oct 01 2014').getTime(), new Date('Mon Dec 01 2014').getTime(),
                    new Date('Thu Jan 01 2015').getTime(), new Date('Sun Mar 01 2015').getTime(),
                    new Date('Fri May 01 2015').getTime(), new Date('Wed Jul 01 2015').getTime()
                ]));
        });
        it('Default - BYMONTHDAY - feb 29', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1;UNTIL=20200729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Mon Feb 29 2016').getTime(), new Date('Sat Feb 29 2020').getTime()]));
        });
        it('Default - BYMONTHDAY - feb 29', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1;UNTIL=20200729T000000Z;COUNT=1';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Mon Feb 29 2016').getTime()]));
        });
        it('Default - BYYEARDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYYEARDAY=168;BYMONTH=6;INTERVAL=1;BYMONTHDAY=17;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), rule, null, 0)))
                .toBe(JSON.stringify([new Date('Tue Jun 17 2014').getTime()]));
        });
    });

    describe('Schedule - recurrence Freq- MONTHLY (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=10,11,12,13,14,15;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                    new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                    new Date('Tue Jun 10 2014 ').getTime(), new Date('Wed Jun 11 2014 ').getTime(),
                    new Date('Thu Jun 12 2014 ').getTime(), new Date('Fri Jun 13 2014 ').getTime(),
                    new Date('Thu Jul 10 2014 ').getTime(), new Date('Fri Jul 11 2014 ').getTime(),
                    new Date('Mon Jul 14 2014 ').getTime(), new Date('Tue Jul 15 2014 ').getTime()
                ]));
        });
        it('Monthly FREQ with BYMONTHDAY and BYDAY properties', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=5,6,7;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;COUNT=10';
            expect(JSON.stringify(generate(new Date('Fri Jul 06 2019'), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Aug 05 2019').getTime(), new Date('Thu Sep 05 2019').getTime(),
                    new Date('Mon Oct 07 2019').getTime(), new Date('Tue Nov 05 2019').getTime(),
                    new Date('Thu Dec 05 2019').getTime(), new Date('Mon Jan 06 2020').getTime(),
                    new Date('Wed Feb 05 2020').getTime(), new Date('Thu Mar 05 2020').getTime(),
                    new Date('Mon Apr 06 2020').getTime(), new Date('Tue May 05 2020').getTime()
                ]));
        });
        it('Default - ByDay Single Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri May 09 2014').getTime(), new Date('Fri Jun 13 2014').getTime(), new Date('Fri Jul 11 2014').getTime()
                ]));
        });
        it('Default - ByDay Single Day without BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYDAY=FR;COUNT=3', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri May 09 2014').getTime(), new Date('Fri May 16 2014').getTime(), new Date('Fri May 23 2014').getTime()
                ]));
        });
        it('Default - ByDay Multiple Days', () => {
            const rule: string = 'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([new Date('Sat Jun 07 2014').getTime(), new Date('Sat Jul 05 2014').getTime()]));
        });
        it('Default - BYMONTHDAY', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), 'FREQ=MONTHLY;BYMONTHDAY=13;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri Jun 13 2014').getTime(), new Date('Sun Jul 13 2014').getTime(),
                    new Date('Wed Aug 13 2014').getTime(), new Date('Sat Sep 13 2014').getTime(),
                    new Date('Mon Oct 13 2014').getTime(), new Date('Thu Nov 13 2014').getTime(),
                    new Date('Sat Dec 13 2014').getTime(), new Date('Tue Jan 13 2015').getTime(),
                    new Date('Fri Feb 13 2015').getTime(), new Date('Fri Mar 13 2015').getTime(),
                    new Date('Mon Apr 13 2015').getTime(), new Date('Wed May 13 2015').getTime(),
                    new Date('Sat Jun 13 2015').getTime(), new Date('Mon Jul 13 2015').getTime(),
                    new Date('Thu Aug 13 2015').getTime(), new Date('Sun Sep 13 2015').getTime(),
                    new Date('Tue Oct 13 2015').getTime(), new Date('Fri Nov 13 2015').getTime(),
                    new Date('Sun Dec 13 2015').getTime(), new Date('Wed Jan 13 2016').getTime(),
                    new Date('Sat Feb 13 2016').getTime(), new Date('Sun Mar 13 2016').getTime(),
                    new Date('Wed Apr 13 2016').getTime(), new Date('Fri May 13 2016').getTime(),
                    new Date('Mon Jun 13 2016').getTime(), new Date('Wed Jul 13 2016').getTime(),
                    new Date('Sat Aug 13 2016').getTime(), new Date('Tue Sep 13 2016').getTime(),
                    new Date('Thu Oct 13 2016').getTime(), new Date('Sun Nov 13 2016').getTime(),
                    new Date('Tue Dec 13 2016').getTime(), new Date('Fri Jan 13 2017').getTime(),
                    new Date('Mon Feb 13 2017').getTime(), new Date('Mon Mar 13 2017').getTime(),
                    new Date('Thu Apr 13 2017').getTime(), new Date('Sat May 13 2017').getTime(),
                    new Date('Tue Jun 13 2017').getTime(), new Date('Thu Jul 13 2017').getTime(),
                    new Date('Sun Aug 13 2017').getTime(), new Date('Wed Sep 13 2017').getTime(),
                    new Date('Fri Oct 13 2017').getTime(), new Date('Mon Nov 13 2017').getTime(),
                    new Date('Wed Dec 13 2017').getTime()
                ]));
        });
        it('Default - BYMONTHDAY', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'), 'FREQ=MONTHLY;BYMONTHDAY=31;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jul 31 2014').getTime(), new Date('Sun Aug 31 2014').getTime(),
                    new Date('Fri Oct 31 2014').getTime(), new Date('Wed Dec 31 2014').getTime(),
                    new Date('Sat Jan 31 2015').getTime(), new Date('Tue Mar 31 2015').getTime(),
                    new Date('Sun May 31 2015').getTime(), new Date('Fri Jul 31 2015').getTime(),
                    new Date('Mon Aug 31 2015').getTime(), new Date('Sat Oct 31 2015').getTime(),
                    new Date('Thu Dec 31 2015').getTime(), new Date('Sun Jan 31 2016').getTime(),
                    new Date('Thu Mar 31 2016').getTime(), new Date('Tue May 31 2016').getTime(),
                    new Date('Sun Jul 31 2016').getTime(), new Date('Wed Aug 31 2016').getTime(),
                    new Date('Mon Oct 31 2016').getTime(), new Date('Sat Dec 31 2016').getTime(),
                    new Date('Tue Jan 31 2017').getTime(), new Date('Fri Mar 31 2017').getTime(),
                    new Date('Wed May 31 2017').getTime(), new Date('Mon Jul 31 2017').getTime(),
                    new Date('Thu Aug 31 2017').getTime(), new Date('Tue Oct 31 2017').getTime(),
                    new Date('Sun Dec 31 2017').getTime(), new Date('Wed Jan 31 2018').getTime(),
                    new Date('Sat Mar 31 2018').getTime(), new Date('Thu May 31 2018').getTime(),
                    new Date('Tue Jul 31 2018').getTime(), new Date('Fri Aug 31 2018').getTime(),
                    new Date('Wed Oct 31 2018').getTime(), new Date('Mon Dec 31 2018').getTime(),
                    new Date('Thu Jan 31 2019').getTime(), new Date('Sun Mar 31 2019').getTime(),
                    new Date('Fri May 31 2019').getTime(), new Date('Wed Jul 31 2019').getTime(),
                    new Date('Sat Aug 31 2019').getTime(), new Date('Thu Oct 31 2019').getTime(),
                    new Date('Tue Dec 31 2019').getTime(), new Date('Fri Jan 31 2020').getTime(),
                    new Date('Tue Mar 31 2020').getTime(), new Date('Sun May 31 2020').getTime(),
                    new Date('Fri Jul 31 2020').getTime()
                ]));
        });
        it('Default - BYMONTHDAY With BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYMONTHDAY=23,27,31;INTERVAL=1;BYSETPOS=2;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 27 2014').getTime(), new Date('Fri Jun 27 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Wed Aug 27 2014').getTime(),
                    new Date('Sat Sep 27 2014').getTime()
                ]));
        });
        it('Default - BYMONTHDAY Without BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;BYMONTHDAY=23,27,31;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri May 23 2014').getTime(), new Date('Tue May 27 2014').getTime(),
                    new Date('Sat May 31 2014').getTime(), new Date('Mon Jun 23 2014').getTime(),
                    new Date('Fri Jun 27 2014').getTime()
                ]));
        });
        it('Default - BYMONTHDAY With multiple BYMONTH', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014 '), 'FREQ=MONTHLY;BYMONTHDAY=23,27,31;BYMONTH=3,4;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Mar 23 2015').getTime(), new Date('Fri Mar 27 2015').getTime(),
                    new Date('Tue Mar 31 2015').getTime(), new Date('Thu Apr 23 2015').getTime(),
                    new Date('Mon Apr 27 2015').getTime()
                ]));
        });
        it('Default - BYMONTHDAY - feb 29', () => {
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014 '), 'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Feb 29 2016').getTime(), new Date('Sat Feb 29 2020').getTime(),
                    new Date('Thu Feb 29 2024').getTime(), new Date('Tue Feb 29 2028').getTime(),
                    new Date('Sun Feb 29 2032').getTime(), new Date('Fri Feb 29 2036').getTime(),
                    new Date('Wed Feb 29 2040').getTime(), new Date('Mon Feb 29 2044').getTime(),
                    new Date('Sat Feb 29 2048').getTime(), new Date('Thu Feb 29 2052').getTime(),
                    new Date('Tue Feb 29 2056').getTime(), new Date('Sun Feb 29 2060').getTime(),
                    new Date('Fri Feb 29 2064').getTime(), new Date('Wed Feb 29 2068').getTime(),
                    new Date('Mon Feb 29 2072').getTime(), new Date('Sat Feb 29 2076').getTime(),
                    new Date('Thu Feb 29 2080').getTime(), new Date('Tue Feb 29 2084').getTime(),
                    new Date('Sun Feb 29 2088').getTime(), new Date('Fri Feb 29 2092').getTime(),
                    new Date('Wed Feb 29 2096').getTime(), new Date('Fri Feb 29 2104').getTime(),
                    new Date('Wed Feb 29 2108').getTime(), new Date('Mon Feb 29 2112').getTime(),
                    new Date('Sat Feb 29 2116').getTime(), new Date('Thu Feb 29 2120').getTime(),
                    new Date('Tue Feb 29 2124').getTime(), new Date('Sun Feb 29 2128').getTime(),
                    new Date('Fri Feb 29 2132').getTime(), new Date('Wed Feb 29 2136').getTime(),
                    new Date('Mon Feb 29 2140').getTime(), new Date('Sat Feb 29 2144').getTime(),
                    new Date('Thu Feb 29 2148').getTime(), new Date('Tue Feb 29 2152').getTime(),
                    new Date('Sun Feb 29 2156').getTime(), new Date('Fri Feb 29 2160').getTime(),
                    new Date('Wed Feb 29 2164').getTime(), new Date('Mon Feb 29 2168').getTime(),
                    new Date('Sat Feb 29 2172').getTime(), new Date('Thu Feb 29 2176').getTime(),
                    new Date('Tue Feb 29 2180').getTime(), new Date('Sun Feb 29 2184').getTime(),
                    new Date('Fri Feb 29 2188').getTime()
                ]));
        });
        it('Default - BYYEARDAY', () => {
            const rule: string = 'FREQ=MONTHLY;BYYEARDAY=168;BYMONTH=6;INTERVAL=1;BYMONTHDAY=17';
            expect(JSON.stringify(generate(new Date('Sun Jun 01 2014 '), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jun 17 2014').getTime(), new Date('Wed Jun 17 2015').getTime(),
                    new Date('Sat Jun 17 2017').getTime(), new Date('Sun Jun 17 2018').getTime(),
                    new Date('Mon Jun 17 2019').getTime(), new Date('Thu Jun 17 2021').getTime(),
                    new Date('Fri Jun 17 2022').getTime(), new Date('Sat Jun 17 2023').getTime(),
                    new Date('Tue Jun 17 2025').getTime(), new Date('Wed Jun 17 2026').getTime(),
                    new Date('Thu Jun 17 2027').getTime(), new Date('Sun Jun 17 2029').getTime(),
                    new Date('Mon Jun 17 2030').getTime(), new Date('Tue Jun 17 2031').getTime(),
                    new Date('Fri Jun 17 2033').getTime(), new Date('Sat Jun 17 2034').getTime(),
                    new Date('Sun Jun 17 2035').getTime(), new Date('Wed Jun 17 2037').getTime(),
                    new Date('Thu Jun 17 2038').getTime(), new Date('Fri Jun 17 2039').getTime(),
                    new Date('Mon Jun 17 2041').getTime(), new Date('Tue Jun 17 2042').getTime(),
                    new Date('Wed Jun 17 2043').getTime(), new Date('Sat Jun 17 2045').getTime(),
                    new Date('Sun Jun 17 2046').getTime(), new Date('Mon Jun 17 2047').getTime(),
                    new Date('Thu Jun 17 2049').getTime(), new Date('Fri Jun 17 2050').getTime(),
                    new Date('Sat Jun 17 2051').getTime(), new Date('Tue Jun 17 2053').getTime(),
                    new Date('Wed Jun 17 2054').getTime(), new Date('Thu Jun 17 2055').getTime(),
                    new Date('Sun Jun 17 2057').getTime(), new Date('Mon Jun 17 2058').getTime(),
                    new Date('Tue Jun 17 2059').getTime(), new Date('Fri Jun 17 2061').getTime(),
                    new Date('Sat Jun 17 2062').getTime(), new Date('Sun Jun 17 2063').getTime(),
                    new Date('Wed Jun 17 2065').getTime(), new Date('Thu Jun 17 2066').getTime(),
                    new Date('Fri Jun 17 2067').getTime(), new Date('Mon Jun 17 2069').getTime(),
                    new Date('Tue Jun 17 2070').getTime()
                ]));
        });
        it('Default - BYMONTH having single value and ByDay Single Day with numeric value', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=-1TH;BYMONTH=6;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jun 26 2014').getTime(), new Date('Thu Jun 25 2015').getTime(),
                    new Date('Thu Jun 30 2016').getTime(), new Date('Thu Jun 29 2017').getTime(),
                    new Date('Thu Jun 28 2018').getTime()
                ]));
        });
        it('Default - BYMONTH having multiple value and ByDay Single Day with numeric value', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=-1TH;BYMONTH=6,7;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jun 26 2014').getTime(), new Date('Thu Jul 31 2014').getTime(),
                    new Date('Thu Jun 25 2015').getTime(), new Date('Thu Jul 30 2015').getTime(),
                    new Date('Thu Jun 30 2016').getTime()
                ]));
        });
        it('Default - BYMONTH having single value and ByDay Single Day with numeric value and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=-1TH;BYMONTH=6;COUNT=5;BYSETPOS=-1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Jun 26 2014').getTime(), new Date('Mon Jun 25 2015').getTime(),
                    new Date('Mon Jun 30 2016').getTime(), new Date('Mon Jun 29 2017').getTime(),
                    new Date('Mon Jun 28 2018').getTime()
                ]));
        });
        it('Default - BYMONTH having multiple value and ByDay Mulitple Day with numeric value and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;COUNT=6;BYDAY=-2MO,2TU;BYMONTH=5,6;BYSETPOS=-1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Jun 23 2014').getTime(), new Date('Mon Jun 22 2015').getTime(),
                    new Date('Mon Jun 20 2016').getTime(), new Date('Mon Jun 19 2017').getTime(),
                    new Date('Mon Jun 18 2018').getTime(), new Date('Mon Jun 17 2019').getTime()
                ]));
        });
        it('Default - BYMONTH having multiple value and ByDay Mulitple Day with numeric value and BYSETPOS', () => {
            expect(JSON.stringify(generate(new Date('2019,8,1'), 'FREQ=MONTHLY;BYDAY=TH;BYSETPOS=5;INTERVAL=1;COUNT=10', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Aug 29 2019').getTime(), new Date('Thu Sep 26 2019').getTime(),
                    new Date('Thu Oct 31 2019').getTime(), new Date('Thu Nov 28 2019').getTime(),
                    new Date('Thu Dec 26 2019').getTime(), new Date('Thu Jan 30 2020').getTime(),
                    new Date('Thu Feb 27 2020').getTime(), new Date('Thu Mar 26 2020').getTime(),
                    new Date('Thu Apr 30 2020').getTime(), new Date('Thu May 28 2020').getTime()
                ]));
        });
        it('Default - ByDay Single Day with numeric value', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;COUNT=6;BYDAY=-2MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 19 2014').getTime(), new Date('Mon Jun 23 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Mon Aug 18 2014').getTime(),
                    new Date('Mon Sep 22 2014').getTime(), new Date('Mon Oct 20 2014').getTime()
                ]));
        });
        it('Default - ByDay Single Day with negative BySetPos', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;INTERVAL=2;COUNT=5;BYDAY=SU;BYSETPOS=-2', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 18 2014').getTime(), new Date('Sun Jul 20 2014').getTime(),
                    new Date('Sun Sep 21 2014').getTime(), new Date('Sun Nov 23 2014').getTime(),
                    new Date('Sun Jan 18 2015').getTime()
                ]));
        });
        it('Default - ByDay Multiple Same Days', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;INTERVAL=2;COUNT=10;BYDAY=1SU,-1SU', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 25 2014').getTime(), new Date('Sun Jul 06 2014').getTime(),
                    new Date('Sun Jul 27 2014').getTime(), new Date('Sun Sep 07 2014').getTime(),
                    new Date('Sun Sep 28 2014').getTime(), new Date('Sun Nov 02 2014').getTime(),
                    new Date('Sun Nov 30 2014').getTime(), new Date('Sun Jan 04 2015').getTime(),
                    new Date('Sun Jan 25 2015').getTime(), new Date('Sun Mar 01 2015').getTime()
                ]));
        });
        it('Default - ByDay Multiple Days with BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=MONTHLY;COUNT=5;BYDAY=TU,WE;BYSETPOS=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Tue Jun 03 2014').getTime(),
                    new Date('Tue Jul 01 2014').getTime(), new Date('Tue Aug 05 2014').getTime(),
                    new Date('Tue Sep 02 2014').getTime()
                ]));
        });
        it('Default - Having BYMONTH with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=MONTHLY;BYDAY=SU;BYMONTH=12;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 11, 4, 10).getTime(), new Date(2022, 11, 11, 10).getTime(),
                    new Date(2022, 11, 18, 10).getTime(), new Date(2022, 11, 25, 10).getTime(),
                    new Date(2023, 11, 3, 10).getTime()
                ]));
        });
        it('Default - Having BYMONTH with multiple BYDAY with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=MONTHLY;BYDAY=SU,MO;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 6, 10).getTime(), new Date(2022, 1, 7, 10).getTime(),
                    new Date(2022, 1, 13, 10).getTime(), new Date(2022, 1, 14, 10).getTime(),
                    new Date(2022, 1, 20, 10).getTime()
                ]));
        });
        it('Default - BYDAY with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=MONTHLY;INTERVAL=2;COUNT=4;BYDAY=SU,2TU;', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 6, 10).getTime(), new Date(2022, 1, 8, 10).getTime(),
                    new Date(2022, 3, 3, 10).getTime(), new Date(2022, 3, 12, 10).getTime()
                ]));
        });
    });

    describe('Schedule - recurrence Freq- YEARLY', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;COUNT=5;INTERVAL=1;', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Wed Dec 31 2014').getTime(), new Date('Thu Dec 31 2015').getTime(),
                    new Date('Fri Dec 30 2016').getTime(), new Date('Fri Dec 29 2017').getTime(),
                    new Date('Mon Dec 31 2018').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 02 2014').getTime(),
                    new Date('Thu Jul 03 2014').getTime(), new Date('Fri Jul 04 2014').getTime(),
                    new Date('Mon Jul 07 2014').getTime(), new Date('Tue Jul 08 2014').getTime(),
                    new Date('Wed Jul 09 2014').getTime(), new Date('Thu Jul 10 2014').getTime(),
                    new Date('Fri Jul 11 2014').getTime(), new Date('Mon Jul 14 2014').getTime(),
                    new Date('Tue Jul 15 2014').getTime(), new Date('Wed Jul 16 2014').getTime(),
                    new Date('Thu Jul 17 2014').getTime(), new Date('Fri Jul 18 2014').getTime(),
                    new Date('Mon Jul 21 2014').getTime(), new Date('Tue Jul 22 2014').getTime(),
                    new Date('Wed Jul 23 2014').getTime(), new Date('Thu Jul 24 2014').getTime(),
                    new Date('Fri Jul 25 2014').getTime(), new Date('Mon Jul 28 2014').getTime(),
                    new Date('Tue Jul 29 2014').getTime()
                ]));
        });
        it('Default - ByDay single value', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=MO;BYSETPOS=-1;COUNT=5;', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Dec 29 2014').getTime(), new Date('Mon Dec 28 2015').getTime(),
                    new Date('Mon Dec 26 2016').getTime(), new Date('Mon Dec 25 2017').getTime(),
                    new Date('Mon Dec 31 2018').getTime()
                ]));
        });
        it('Default - BYMONTHDAY without BYMONTH property', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYMONTHDAY=20,25,28;BYSETPOS=2;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 25 2014').getTime(), new Date('Sun Jan 25 2015').getTime(),
                    new Date('Mon Jan 25 2016').getTime(), new Date('Wed Jan 25 2017').getTime(),
                    new Date('Thu Jan 25 2018').getTime()
                ]));
        });
        it('Default - BYMONTHDAY without BYMONTH and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYMONTHDAY=12,13;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 12 2014').getTime(), new Date('Tue May 13 2014').getTime(),
                    new Date('Thu Jun 12 2014').getTime(), new Date('Fri Jun 13 2014').getTime(),
                    new Date('Sat Jul 12 2014').getTime()
                ]));
        });
        it('Default - BYMONTHDAY', () => {
            const rule: string = 'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([new Date('Sat Jul 12 2014').getTime(), new Date('Sun Jul 13 2014').getTime()]));
        });
        it('Default - BYMONTHDAY for Multiple months', () => {
            const rule: string = 'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=6,7;INTERVAL=1;UNTIL=20140729T000000Z';
            expect(JSON.stringify(generate(startDate, rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jun 12 2014').getTime(), new Date('Fri Jun 13 2014').getTime(),
                    new Date('Sat Jul 12 2014').getTime(), new Date('Sun Jul 13 2014').getTime()
                ]));
        });
        it('Default - YearDay With BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYYEARDAY=20,28,-45;BYSETPOS=2;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Wed Jan 28 2015').getTime(), new Date('Thu Jan 28 2016').getTime(),
                    new Date('Sat Jan 28 2017').getTime(), new Date('Sun Jan 28 2018').getTime(),
                    new Date('Mon Jan 28 2019').getTime()
                ]));
        });
        it('Default - YearDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sat Jul 19 2014').getTime(), new Date('Sun Jan 01 2017').getTime(),
                    new Date('Mon Apr 10 2017').getTime(), new Date('Wed Jul 19 2017').getTime(),
                    new Date('Wed Jan 01 2020').getTime(), new Date('Thu Apr 09 2020').getTime(),
                    new Date('Sat Jul 18 2020').getTime(), new Date('Sun Jan 01 2023').getTime(),
                    new Date('Mon Apr 10 2023').getTime(), new Date('Wed Jul 19 2023').getTime()
                ]));
        });
        it('Default - YearDay With BYDAY', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=3;COUNT=5;BYYEARDAY=1,100,200;BYDAY=MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon Apr 10 2017').getTime(), new Date('Mon Apr 10 2023').getTime(),
                    new Date('Mon Jan 01 2029').getTime(), new Date('Mon Jan 01 2035').getTime(),
                    new Date('Mon Jul 19 2038').getTime()
                ]));
        });
        it('Default - YearDay- 366 ', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=1;COUNT=2;BYYEARDAY=366', null, 0)))
                .toBe(JSON.stringify([new Date('Sat Dec 31 2016').getTime(), new Date('Thu Dec 31 2020').getTime()]));
        });
        it('Default - YearDay- Negative Value ', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=1;BYYEARDAY=-365', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Thu Jan 01 2015').getTime(), new Date('Sat Jan 02 2016').getTime(),
                    new Date('Sun Jan 01 2017').getTime(), new Date('Mon Jan 01 2018').getTime(),
                    new Date('Tue Jan 01 2019').getTime(), new Date('Thu Jan 02 2020').getTime(),
                    new Date('Fri Jan 01 2021').getTime(), new Date('Sat Jan 01 2022').getTime(),
                    new Date('Sun Jan 01 2023').getTime(), new Date('Tue Jan 02 2024').getTime(),
                    new Date('Wed Jan 01 2025').getTime(), new Date('Thu Jan 01 2026').getTime(),
                    new Date('Fri Jan 01 2027').getTime(), new Date('Sun Jan 02 2028').getTime(),
                    new Date('Mon Jan 01 2029').getTime(), new Date('Tue Jan 01 2030').getTime(),
                    new Date('Wed Jan 01 2031').getTime(), new Date('Fri Jan 02 2032').getTime(),
                    new Date('Sat Jan 01 2033').getTime(), new Date('Sun Jan 01 2034').getTime(),
                    new Date('Mon Jan 01 2035').getTime(), new Date('Wed Jan 02 2036').getTime(),
                    new Date('Thu Jan 01 2037').getTime(), new Date('Fri Jan 01 2038').getTime(),
                    new Date('Sat Jan 01 2039').getTime(), new Date('Mon Jan 02 2040').getTime(),
                    new Date('Tue Jan 01 2041').getTime(), new Date('Wed Jan 01 2042').getTime(),
                    new Date('Thu Jan 01 2043').getTime(), new Date('Sat Jan 02 2044').getTime(),
                    new Date('Sun Jan 01 2045').getTime(), new Date('Mon Jan 01 2046').getTime(),
                    new Date('Tue Jan 01 2047').getTime(), new Date('Thu Jan 02 2048').getTime(),
                    new Date('Fri Jan 01 2049').getTime(), new Date('Sat Jan 01 2050').getTime(),
                    new Date('Sun Jan 01 2051').getTime(), new Date('Tue Jan 02 2052').getTime(),
                    new Date('Wed Jan 01 2053').getTime(), new Date('Thu Jan 01 2054').getTime(),
                    new Date('Fri Jan 01 2055').getTime(), new Date('Sun Jan 02 2056').getTime(),
                    new Date('Mon Jan 01 2057').getTime()
                ]));
        });
        //FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO
        it('Default - WeekNo with day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 12 2014').getTime(), new Date('Mon May 11 2015').getTime(),
                    new Date('Mon May 09 2016').getTime(), new Date('Mon May 08 2017').getTime(),
                    new Date('Mon May 14 2018').getTime(), new Date('Mon May 13 2019').getTime(),
                    new Date('Mon May 11 2020').getTime(), new Date('Mon May 10 2021').getTime(),
                    new Date('Mon May 09 2022').getTime(), new Date('Mon May 08 2023').getTime(),
                    new Date('Mon May 13 2024').getTime(), new Date('Mon May 12 2025').getTime(),
                    new Date('Mon May 11 2026').getTime(), new Date('Mon May 10 2027').getTime(),
                    new Date('Mon May 08 2028').getTime(), new Date('Mon May 14 2029').getTime(),
                    new Date('Mon May 13 2030').getTime(), new Date('Mon May 12 2031').getTime(),
                    new Date('Mon May 10 2032').getTime(), new Date('Mon May 09 2033').getTime(),
                    new Date('Mon May 08 2034').getTime(), new Date('Mon May 14 2035').getTime(),
                    new Date('Mon May 12 2036').getTime(), new Date('Mon May 11 2037').getTime(),
                    new Date('Mon May 10 2038').getTime(), new Date('Mon May 09 2039').getTime(),
                    new Date('Mon May 07 2040').getTime(), new Date('Mon May 13 2041').getTime(),
                    new Date('Mon May 12 2042').getTime(), new Date('Mon May 11 2043').getTime(),
                    new Date('Mon May 09 2044').getTime(), new Date('Mon May 08 2045').getTime(),
                    new Date('Mon May 14 2046').getTime(), new Date('Mon May 13 2047').getTime(),
                    new Date('Mon May 11 2048').getTime(), new Date('Mon May 10 2049').getTime(),
                    new Date('Mon May 09 2050').getTime(), new Date('Mon May 08 2051').getTime(),
                    new Date('Mon May 13 2052').getTime(), new Date('Mon May 12 2053').getTime(),
                    new Date('Mon May 11 2054').getTime(), new Date('Mon May 10 2055').getTime(),
                    new Date('Mon May 08 2056').getTime()
                ]));
        });
        it('Default - WeekNo without day and with BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20;BYSETPOS=2;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 12 2014').getTime(), new Date('Mon May 11 2015').getTime(),
                    new Date('Mon May 09 2016').getTime(), new Date('Mon May 08 2017').getTime(),
                    new Date('Mon May 14 2018').getTime()
                ]));
        });
        it('Default - WeekNo with day and with BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=-20;BYDAY=MO,TU,WE;BYSETPOS=2;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Aug 19 2014').getTime(), new Date('Tue Aug 18 2015').getTime(),
                    new Date('Tue Aug 16 2016').getTime(), new Date('Tue Aug 15 2017').getTime(),
                    new Date('Tue Aug 21 2018').getTime()
                ]));
        });
        it('Default - WeekNo with day negative Value', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=-34;BYDAY=MO', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 12 2014').getTime(), new Date('Mon May 11 2015').getTime(),
                    new Date('Mon May 09 2016').getTime(), new Date('Mon May 08 2017').getTime(),
                    new Date('Mon May 14 2018').getTime(), new Date('Mon May 13 2019').getTime(),
                    new Date('Mon May 11 2020').getTime(), new Date('Mon May 10 2021').getTime(),
                    new Date('Mon May 09 2022').getTime(), new Date('Mon May 08 2023').getTime(),
                    new Date('Mon May 13 2024').getTime(), new Date('Mon May 12 2025').getTime(),
                    new Date('Mon May 11 2026').getTime(), new Date('Mon May 10 2027').getTime(),
                    new Date('Mon May 08 2028').getTime(), new Date('Mon May 14 2029').getTime(),
                    new Date('Mon May 13 2030').getTime(), new Date('Mon May 12 2031').getTime(),
                    new Date('Mon May 10 2032').getTime(), new Date('Mon May 09 2033').getTime(),
                    new Date('Mon May 08 2034').getTime(), new Date('Mon May 14 2035').getTime(),
                    new Date('Mon May 12 2036').getTime(), new Date('Mon May 11 2037').getTime(),
                    new Date('Mon May 10 2038').getTime(), new Date('Mon May 09 2039').getTime(),
                    new Date('Mon May 07 2040').getTime(), new Date('Mon May 13 2041').getTime(),
                    new Date('Mon May 12 2042').getTime(), new Date('Mon May 11 2043').getTime(),
                    new Date('Mon May 09 2044').getTime(), new Date('Mon May 08 2045').getTime(),
                    new Date('Mon May 14 2046').getTime(), new Date('Mon May 13 2047').getTime(),
                    new Date('Mon May 11 2048').getTime(), new Date('Mon May 10 2049').getTime(),
                    new Date('Mon May 09 2050').getTime(), new Date('Mon May 08 2051').getTime(),
                    new Date('Mon May 13 2052').getTime(), new Date('Mon May 12 2053').getTime(),
                    new Date('Mon May 11 2054').getTime(), new Date('Mon May 10 2055').getTime(),
                    new Date('Mon May 08 2056').getTime()
                ]));
        });
        it('Default - WeekNo - without Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20;COUNT=7', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 11 2014').getTime(), new Date('Mon May 12 2014').getTime(),
                    new Date('Tue May 13 2014').getTime(), new Date('Wed May 14 2014').getTime(),
                    new Date('Thu May 15 2014').getTime(), new Date('Fri May 16 2014').getTime(),
                    new Date('Sat May 17 2014').getTime()
                ]));
        });
        it('Default - WeekNo - without Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1;COUNT=7;', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Dec 28 2014').getTime(), new Date('Mon Dec 29 2014').getTime(),
                    new Date('Tue Dec 30 2014').getTime(), new Date('Wed Dec 31 2014').getTime(),
                    new Date('Thu Jan 01 2015').getTime(), new Date('Fri Jan 02 2015').getTime(),
                    new Date('Sat Jan 03 2015').getTime()
                ]));
        });
        it('Default - WeekNo - without Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53;COUNT=7;', null, 1)))
                .toBe(JSON.stringify([
                    new Date('Mon Dec 29 2014').getTime(), new Date('Tue Dec 30 2014').getTime(),
                    new Date('Wed Dec 31 2014').getTime(), new Date('Thu Jan 01 2015').getTime(),
                    new Date('Fri Jan 02 2015').getTime(), new Date('Sat Jan 03 2015').getTime(),
                    new Date('Sun Jan 04 2015').getTime()
                ]));
        });
    });

    describe('Schedule - recurrence Freq- YEARLY (without EndDate)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;BYMONTH=5,7;INTERVAL=1;', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Fri May 01 2015').getTime(), new Date('Mon May 02 2016').getTime(),
                    new Date('Mon May 01 2017').getTime(), new Date('Tue May 01 2018').getTime(),
                    new Date('Wed May 01 2019').getTime(), new Date('Fri May 01 2020').getTime(),
                    new Date('Mon May 03 2021').getTime(), new Date('Mon May 02 2022').getTime(),
                    new Date('Mon May 01 2023').getTime(), new Date('Wed May 01 2024').getTime(),
                    new Date('Thu May 01 2025').getTime(), new Date('Fri May 01 2026').getTime(),
                    new Date('Mon May 03 2027').getTime(), new Date('Mon May 01 2028').getTime(),
                    new Date('Tue May 01 2029').getTime(), new Date('Wed May 01 2030').getTime(),
                    new Date('Thu May 01 2031').getTime(), new Date('Mon May 03 2032').getTime(),
                    new Date('Mon May 02 2033').getTime(), new Date('Mon May 01 2034').getTime(),
                    new Date('Tue May 01 2035').getTime(), new Date('Thu May 01 2036').getTime(),
                    new Date('Fri May 01 2037').getTime(), new Date('Mon May 03 2038').getTime(),
                    new Date('Mon May 02 2039').getTime(), new Date('Tue May 01 2040').getTime(),
                    new Date('Wed May 01 2041').getTime(), new Date('Thu May 01 2042').getTime(),
                    new Date('Fri May 01 2043').getTime(), new Date('Mon May 02 2044').getTime(),
                    new Date('Mon May 01 2045').getTime(), new Date('Tue May 01 2046').getTime(),
                    new Date('Wed May 01 2047').getTime(), new Date('Fri May 01 2048').getTime(),
                    new Date('Mon May 03 2049').getTime(), new Date('Mon May 02 2050').getTime(),
                    new Date('Mon May 01 2051').getTime(), new Date('Wed May 01 2052').getTime(),
                    new Date('Thu May 01 2053').getTime(), new Date('Fri May 01 2054').getTime(),
                    new Date('Mon May 03 2055').getTime(), new Date('Mon May 01 2056').getTime(),
                    new Date('Tue May 01 2057').getTime()
                ]));
        });
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;BYSETPOS=1;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue Jul 01 2014').getTime(), new Date('Wed Jul 01 2015').getTime(),
                    new Date('Fri Jul 01 2016').getTime(), new Date('Mon Jul 03 2017').getTime(),
                    new Date('Mon Jul 02 2018').getTime()
                ]));
        });
        it('Default - BYMONTHDAY', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sat Jul 12 2014').getTime(), new Date('Sun Jul 13 2014').getTime(),
                    new Date('Sun Jul 12 2015').getTime(), new Date('Mon Jul 13 2015').getTime(),
                    new Date('Tue Jul 12 2016').getTime(), new Date('Wed Jul 13 2016').getTime(),
                    new Date('Wed Jul 12 2017').getTime(), new Date('Thu Jul 13 2017').getTime(),
                    new Date('Thu Jul 12 2018').getTime(), new Date('Fri Jul 13 2018').getTime(),
                    new Date('Fri Jul 12 2019').getTime(), new Date('Sat Jul 13 2019').getTime(),
                    new Date('Sun Jul 12 2020').getTime(), new Date('Mon Jul 13 2020').getTime(),
                    new Date('Mon Jul 12 2021').getTime(), new Date('Tue Jul 13 2021').getTime(),
                    new Date('Tue Jul 12 2022').getTime(), new Date('Wed Jul 13 2022').getTime(),
                    new Date('Wed Jul 12 2023').getTime(), new Date('Thu Jul 13 2023').getTime(),
                    new Date('Fri Jul 12 2024').getTime(), new Date('Sat Jul 13 2024').getTime(),
                    new Date('Sat Jul 12 2025').getTime(), new Date('Sun Jul 13 2025').getTime(),
                    new Date('Sun Jul 12 2026').getTime(), new Date('Mon Jul 13 2026').getTime(),
                    new Date('Mon Jul 12 2027').getTime(), new Date('Tue Jul 13 2027').getTime(),
                    new Date('Wed Jul 12 2028').getTime(), new Date('Thu Jul 13 2028').getTime(),
                    new Date('Thu Jul 12 2029').getTime(), new Date('Fri Jul 13 2029').getTime(),
                    new Date('Fri Jul 12 2030').getTime(), new Date('Sat Jul 13 2030').getTime(),
                    new Date('Sat Jul 12 2031').getTime(), new Date('Sun Jul 13 2031').getTime(),
                    new Date('Mon Jul 12 2032').getTime(), new Date('Tue Jul 13 2032').getTime(),
                    new Date('Tue Jul 12 2033').getTime(), new Date('Wed Jul 13 2033').getTime(),
                    new Date('Wed Jul 12 2034').getTime(), new Date('Thu Jul 13 2034').getTime(),
                    new Date('Thu Jul 12 2035').getTime()
                ]));
        });
        it('Default - WeekNo - without Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun May 11 2014').getTime(), new Date('Mon May 12 2014').getTime(),
                    new Date('Tue May 13 2014').getTime(), new Date('Wed May 14 2014').getTime(),
                    new Date('Thu May 15 2014').getTime(), new Date('Fri May 16 2014').getTime(),
                    new Date('Sat May 17 2014').getTime(), new Date('Sun May 10 2015').getTime(),
                    new Date('Mon May 11 2015').getTime(), new Date('Tue May 12 2015').getTime(),
                    new Date('Wed May 13 2015').getTime(), new Date('Thu May 14 2015').getTime(),
                    new Date('Fri May 15 2015').getTime(), new Date('Sat May 16 2015').getTime(),
                    new Date('Sun May 08 2016').getTime(), new Date('Mon May 09 2016').getTime(),
                    new Date('Tue May 10 2016').getTime(), new Date('Wed May 11 2016').getTime(),
                    new Date('Thu May 12 2016').getTime(), new Date('Fri May 13 2016').getTime(),
                    new Date('Sat May 14 2016').getTime(), new Date('Sun May 07 2017').getTime(),
                    new Date('Mon May 08 2017').getTime(), new Date('Tue May 09 2017').getTime(),
                    new Date('Wed May 10 2017').getTime(), new Date('Thu May 11 2017').getTime(),
                    new Date('Fri May 12 2017').getTime(), new Date('Sat May 13 2017').getTime(),
                    new Date('Sun May 13 2018').getTime(), new Date('Mon May 14 2018').getTime(),
                    new Date('Tue May 15 2018').getTime(), new Date('Wed May 16 2018').getTime(),
                    new Date('Thu May 17 2018').getTime(), new Date('Fri May 18 2018').getTime(),
                    new Date('Sat May 19 2018').getTime(), new Date('Sun May 12 2019').getTime(),
                    new Date('Mon May 13 2019').getTime(), new Date('Tue May 14 2019').getTime(),
                    new Date('Wed May 15 2019').getTime(), new Date('Thu May 16 2019').getTime(),
                    new Date('Fri May 17 2019').getTime(), new Date('Sat May 18 2019').getTime(),
                    new Date('Sun May 10 2020').getTime()]));
        });
        it('Default - WeekNo - without Day', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Dec 28 2014').getTime(), new Date('Mon Dec 29 2014').getTime(),
                    new Date('Tue Dec 30 2014').getTime(), new Date('Wed Dec 31 2014').getTime(),
                    new Date('Thu Jan 01 2015').getTime(), new Date('Fri Jan 02 2015').getTime(),
                    new Date('Sat Jan 03 2015').getTime(), new Date('Sun Dec 27 2015').getTime(),
                    new Date('Mon Dec 28 2015').getTime(), new Date('Tue Dec 29 2015').getTime(),
                    new Date('Wed Dec 30 2015').getTime(), new Date('Thu Dec 31 2015').getTime(),
                    new Date('Fri Jan 01 2016').getTime(), new Date('Sat Jan 02 2016').getTime(),
                    new Date('Sun Dec 25 2016').getTime(), new Date('Mon Dec 26 2016').getTime(),
                    new Date('Tue Dec 27 2016').getTime(), new Date('Wed Dec 28 2016').getTime(),
                    new Date('Thu Dec 29 2016').getTime(), new Date('Fri Dec 30 2016').getTime(),
                    new Date('Sat Dec 31 2016').getTime(), new Date('Sun Dec 25 2016').getTime(),
                    new Date('Mon Dec 26 2016').getTime(), new Date('Tue Dec 27 2016').getTime(),
                    new Date('Wed Dec 28 2016').getTime(), new Date('Thu Dec 29 2016').getTime(),
                    new Date('Fri Dec 30 2016').getTime(), new Date('Sat Dec 31 2016').getTime(),
                    new Date('Sun Dec 25 2016').getTime(), new Date('Mon Dec 26 2016').getTime(),
                    new Date('Tue Dec 27 2016').getTime(), new Date('Wed Dec 28 2016').getTime(),
                    new Date('Thu Dec 29 2016').getTime(), new Date('Fri Dec 30 2016').getTime(),
                    new Date('Sat Dec 31 2016').getTime(), new Date('Sun Dec 25 2016').getTime(),
                    new Date('Mon Dec 26 2016').getTime(), new Date('Tue Dec 27 2016').getTime(),
                    new Date('Wed Dec 28 2016').getTime(), new Date('Thu Dec 29 2016').getTime(),
                    new Date('Fri Dec 30 2016').getTime(), new Date('Sat Dec 31 2016').getTime(),
                    new Date('Sun Dec 25 2016').getTime()
                ]));
        });
        it('Default - WeekNo - without Day max week no', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53', null, 1)))
                .toBe(JSON.stringify([
                    new Date('Mon Dec 29 2014').getTime(), new Date('Tue Dec 30 2014').getTime(),
                    new Date('Wed Dec 31 2014').getTime(), new Date('Thu Jan 01 2015').getTime(),
                    new Date('Fri Jan 02 2015').getTime(), new Date('Sat Jan 03 2015').getTime(),
                    new Date('Sun Jan 04 2015').getTime(), new Date('Mon Dec 26 2016').getTime(),
                    new Date('Tue Dec 27 2016').getTime(), new Date('Wed Dec 28 2016').getTime(),
                    new Date('Thu Dec 29 2016').getTime(), new Date('Fri Dec 30 2016').getTime(),
                    new Date('Sat Dec 31 2016').getTime(), new Date('Sun Jan 01 2017').getTime(),
                    new Date('Mon Dec 24 2018').getTime(), new Date('Tue Dec 25 2018').getTime(),
                    new Date('Wed Dec 26 2018').getTime(), new Date('Thu Dec 27 2018').getTime(),
                    new Date('Fri Dec 28 2018').getTime(), new Date('Sat Dec 29 2018').getTime(),
                    new Date('Sun Dec 30 2018').getTime(), new Date('Mon Dec 30 2019').getTime(),
                    new Date('Tue Dec 31 2019').getTime(), new Date('Wed Jan 01 2020').getTime(),
                    new Date('Thu Jan 02 2020').getTime(), new Date('Fri Jan 03 2020').getTime(),
                    new Date('Sat Jan 04 2020').getTime(), new Date('Sun Jan 05 2020').getTime(),
                    new Date('Mon Dec 27 2021').getTime(), new Date('Tue Dec 28 2021').getTime(),
                    new Date('Wed Dec 29 2021').getTime(), new Date('Thu Dec 30 2021').getTime(),
                    new Date('Fri Dec 31 2021').getTime(), new Date('Sat Jan 01 2022').getTime(),
                    new Date('Sun Jan 02 2022').getTime(), new Date('Mon Dec 25 2023').getTime(),
                    new Date('Tue Dec 26 2023').getTime(), new Date('Wed Dec 27 2023').getTime(),
                    new Date('Thu Dec 28 2023').getTime(), new Date('Fri Dec 29 2023').getTime(),
                    new Date('Sat Dec 30 2023').getTime(), new Date('Sun Dec 31 2023').getTime(),
                    new Date('Mon Dec 23 2024').getTime()
                ]));
        });
    });

    describe('Schedule - recurrence Freq- YEARLY (Having functionalities)', () => {
        const startDate: Date = new Date('Tue May 06 2014 ');
        it('Default - ByDay', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53;UNTIL=20140229T000000Z', null, 1)))
                .toBe(JSON.stringify([]));
        });
        it('Default - Having ByDay property alone', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYDAY=20MO;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Mon May 19 2014').getTime(), new Date('Mon May 18 2015').getTime(),
                    new Date('Mon May 16 2016').getTime(), new Date('Mon May 15 2017').getTime(),
                    new Date('Mon May 14 2018').getTime()
                ]));
        });
        it('Default - Having FREQ property alone and all other properties are not set', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 06 2015').getTime(),
                    new Date('Fri May 06 2016').getTime(), new Date('Sat May 06 2017').getTime(),
                    new Date('Sun May 06 2018').getTime()
                ]));
        });
        it('Default - Having FREQ property and BYMONTH property and all other properties are not set', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYMONTH=5;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Tue May 06 2014').getTime(), new Date('Wed May 06 2015').getTime(),
                    new Date('Fri May 06 2016').getTime(), new Date('Sat May 06 2017').getTime(),
                    new Date('Sun May 06 2018').getTime()
                ]));
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Dec 28 2014').getTime(), new Date('Sun Jan 03 2016').getTime(),
                    new Date('Sun Dec 25 2016').getTime(), new Date('Sun Jan 07 2018').getTime(),
                    new Date('Sun Dec 30 2018').getTime()
                ]));
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values and multiple BYMONTH values', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYMONTH=1,12;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU;', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Dec 07 2014').getTime(), new Date('Sun Dec 28 2014').getTime(),
                    new Date('Sun Jan 03 2016').getTime(), new Date('Sun Jan 31 2016').getTime(),
                    new Date('Sun Dec 04 2016').getTime()
                ]));
        });
        it('Default - Having FREQ property and multiple BYDAY property with integer values and BYSETPOS', () => {
            expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;INTERVAL=2;COUNT=5;BYDAY=1SU,-1SU;BYSETPOS=1', null, 0)))
                .toBe(JSON.stringify([
                    new Date('Sun Jan 03 2016').getTime(), new Date('Sun Jan 07 2018').getTime(),
                    new Date('Sun Jan 05 2020').getTime(), new Date('Sun Jan 02 2022').getTime(),
                    new Date('Sun Jan 07 2024').getTime()
                ]));
        });
        it('Default - Having BYMONTH and BYSETPOS with start time', () => {
            const rule: string = 'FREQ=YEARLY;BYDAY=SU;BYSETPOS=1;BYMONTH=12;INTERVAL=1;COUNT=5';
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), rule, null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 11, 4, 10).getTime(), new Date(2023, 11, 3, 10).getTime(),
                    new Date(2024, 11, 1, 10).getTime(), new Date(2025, 11, 7, 10).getTime(),
                    new Date(2026, 11, 6, 10).getTime()
                ]));
        });
        it('Default - BYDAY with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=YEARLY;BYDAY=SU;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 6, 10).getTime(), new Date(2022, 1, 13, 10).getTime(),
                    new Date(2022, 1, 20, 10).getTime(), new Date(2022, 1, 27, 10).getTime(),
                    new Date(2022, 2, 6, 10).getTime()
                ]));
        });
        it('Default - BYDAY with Mulitple values with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=YEARLY;BYDAY=1SU,-1MO;INTERVAL=1;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 6, 10).getTime(), new Date(2022, 11, 26, 10).getTime(),
                    new Date(2023, 0, 1, 10).getTime(), new Date(2023, 11, 25, 10).getTime(),
                    new Date(2024, 0, 7, 10).getTime()
                ]));
        });
        it('Default - BYDAY with single integer value and start time', () => {
            expect(
                JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=YEARLY;BYDAY=-20MO;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 7, 15, 10).getTime(), new Date(2023, 7, 14, 10).getTime(),
                    new Date(2024, 7, 19, 10).getTime(), new Date(2025, 7, 18, 10).getTime(),
                    new Date(2026, 7, 17, 10).getTime()
                ]));
        });
        it('Default - BYMONTHDAY with multipe value and start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=YEARLY;BYMONTHDAY=12,18,23;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 1, 12, 10).getTime(), new Date(2022, 1, 18, 10).getTime(),
                    new Date(2022, 1, 23, 10).getTime(), new Date(2022, 2, 12, 10).getTime(),
                    new Date(2022, 2, 18, 10).getTime()
                ]));
        });
        it('Default - BYMONTHDAY with start time', () => {
            expect(JSON.stringify(generate(new Date(2022, 1, 1, 10), 'FREQ=YEARLY;BYMONTHDAY=13;BYMONTH=12;COUNT=5', null, 0)))
                .toBe(JSON.stringify([
                    new Date(2022, 11, 13, 10).getTime(), new Date(2023, 11, 13, 10).getTime(),
                    new Date(2024, 11, 13, 10).getTime(), new Date(2025, 11, 13, 10).getTime(),
                    new Date(2026, 11, 13, 10).getTime()
                ]));
        });
    });

    describe('Schedule - recurrence rule with end date as never', () => {
        const startDate: Date = new Date('Tue, 06 May 2014');
        it('Yearly with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;', null, 0, 90);
            expect(dates.length).toBe(90);
        });
        it('WEEKLY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=WEEKLY;', null, 0, 120);
            expect(dates.length).toBe(120);
        });
        it('MONTHLY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=MONTHLY;', null, 0, 10);
            expect(dates.length).toBe(10);
        });
        it('YEARLY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;', null, 0, 30);
            expect(dates.length).toBe(30);
        });
        it('DAILY without max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;', null, 0);
            expect(dates.length).toBe(43);
        });
    });

    describe('Schedule - recurrence rule with end date as never and recurrence excecption', () => {
        const startDate: Date = new Date('Tue, 04 May 2014');
        it('DAILY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;', '20140505T043000Z,20140517T043000Z', 0, 90);
            expect(dates.length).toBe(90);
        });
        it('DAILY with max count and Until Date', () => {
            const rule: string = 'FREQ=DAILY;INTERVAL=1;UNTIL=20140531T043000Z;';
            const dates: number[] = generate(startDate, rule, '20140505T043000Z,20140516T043000Z', 0, 28);
            expect(dates.length).toBe(26);
        });
        it('DAILY with max count and Count property', () => {
            const dates: number[] = generate(startDate, 'FREQ=DAILY;INTERVAL=1;COUNT=20', '20140505T043000Z,20140516T043000Z', 0, 20);
            expect(dates.length).toBe(18);
        });
        it('WEEKLY with max count', () => {
            const rule: string = 'FREQ=WEEKLY;BYDAY=SU;INTERVAL=1;';
            const dates: number[] = generate(startDate, rule, '20140511T053000Z,20140608T053000Z,20141019T053000Z', 0, 20);
            expect(dates.length).toBe(20);
        });
        it('WEEKLY with max count and Until Date', () => {
            const dates: number[] = generate(startDate, 'FREQ=WEEKLY;BYDAY=SU;INTERVAL=1;UNTIL=20140531T043000Z;', '20140511T053000Z', 0, 4);
            expect(dates.length).toBe(3);
        });
        it('WEEKLY with max count and Count property', () => {
            const dates: number[] = generate(startDate, 'FREQ=WEEKLY;BYDAY=SU;INTERVAL=1;COUNT=15', '20140511T053000Z', 0, 15);
            expect(dates.length).toBe(14);
        });
        it('MONTHLY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=MONTHLY;BYMONTHDAY=4;INTERVAL=1;', '20140701T043000Z', 0, 20);
            expect(dates.length).toBe(20);
        });
        it('MONTHLY with max count and Until Date', () => {
            const rule: string = 'FREQ=MONTHLY;BYMONTHDAY=4;INTERVAL=1;UNTIL=20140731T043000Z;';
            const dates: number[] = generate(startDate, rule, '20140604T043000Z', 0, 3);
            expect(dates.length).toBe(2);
        });
        it('MONTHLY with max count and Count property', () => {
            const dates: number[] = generate(startDate, 'FREQ=MONTHLY;BYMONTHDAY=4;INTERVAL=1;COUNT=10;', '20140604T043000Z', 0, 10);
            expect(dates.length).toBe(9);
        });
        it('YEARLY with max count', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=5;INTERVAL=1;', '20150504T043000Z', 0, 30);
            expect(dates.length).toBe(30);
        });
        it('YEARLY with max count and Until Date', () => {
            const rule: string = 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=5;INTERVAL=1;UNTIL=20180531T050000Z;';
            const dates: number[] = generate(startDate, rule, '20150504T050000Z', 0, 5);
            expect(dates.length).toBe(4);
        });
        it('YEARLY with max count and Count property', () => {
            const dates: number[] = generate(startDate, 'FREQ=YEARLY;BYMONTHDAY=4;BYMONTH=5;INTERVAL=1;COUNT=10;', '20150504T050000Z', 0, 10);
            expect(dates.length).toBe(9);
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
