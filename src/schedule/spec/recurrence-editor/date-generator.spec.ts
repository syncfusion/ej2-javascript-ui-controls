import { generate } from '../../src/recurrence-editor/date-generator';
/**
 * test case for reccurence.
 */
describe('Schedule - recurrence Freq- Daily', () => {
    let startDate: Date = new Date('Tue, 06 May 2014');
    it('Default - Interval', () => {
        expect(JSON.stringify(generate(startDate
            , 'FREQ=DAILY;INTERVAL=2;UNTIL=20140606T000000Z', null, 0
        )))
            .toBe(JSON.stringify([new Date('Tue May 06 2014 ').getTime(),
            new Date('Thu May 08 2014').getTime(),
            new Date('Sat May 10 2014').getTime(), new Date('Mon May 12 2014').getTime(),
            new Date('Wed May 14 2014').getTime(), new Date('Fri May 16 2014').getTime(),
            new Date('Sun May 18 2014').getTime(), new Date('Tue May 20 2014 ').getTime(),
            new Date('Thu May 22 2014').getTime(), new Date('Sat May 24 2014').getTime(),
            new Date('Mon May 26 2014').getTime(), new Date('Wed May 28 2014').getTime(),
            new Date('Fri May 30 2014').getTime(), new Date('Sun Jun 01 2014').getTime(),
            new Date('Tue Jun 03 2014').getTime(), new Date('Thu Jun 05 2014 ').getTime()]));
    });
    it('Default - Interval - Count-10', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;INTERVAL=1;COUNT=10;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Tue May 06 2014 ').getTime(),
            new Date('Wed May 07 2014 ').getTime(), new Date('Thu May 08 2014 ').getTime(),
            new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
            new Date('Sun May 11 2014 ').getTime(), new Date('Mon May 12 2014 ').getTime(),
            new Date('Tue May 13 2014 ').getTime(), new Date('Wed May 14 2014 ').getTime(),
            new Date('Thu May 15 2014 ').getTime()]));
    });
    it('Default - ByDay', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Tue May 06 2014 ').getTime(),
            new Date('Wed May 07 2014 ').getTime(),
            new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
            new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
            new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
            new Date('Fri May 16 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
            new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
            new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
            new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
            new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
            new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
            new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
            new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
            new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
            new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
            new Date('Fri Jun 13 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
            new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
            new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
            new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
            new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
            new Date('Fri Jun 27 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
            new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
            new Date('Thu Jul 03 2014 ').getTime()]));
    });
    it('Default - ByDay - BYMONTH', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;BYMONTH=6;INTERVAL=1;UNTIL=20140629T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun Jun 01 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Sat Jun 07 2014 ').getTime(), new Date('Sun Jun 08 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sat Jun 14 2014 ').getTime(),
                new Date('Sun Jun 15 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Sat Jun 21 2014 ').getTime(), new Date('Sun Jun 22 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Sat Jun 28 2014 ').getTime(),
                new Date('Sun Jun 29 2014 ').getTime()]));
    });
    it('Default - ByDay - BYMONTHDAY', () => {
        expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'),
            'FREQ=DAILY;BYDAY=FR;BYMONTHDAY=13;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Fri Jun 13 2014 ').getTime()]));
    });
    it('Default - ByDay - BYYEARDAY', () => {
        expect(JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
            'FREQ=DAILY;BYYEARDAY=168;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Tue Jun 17 2014 ').getTime()]));
    });
});

describe('Schedule - recurrence Freq- Daily', () => {
    let startDate: Date = new Date('Tue May 06 2014 ');
    it('Default - Interval', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;INTERVAL=2', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Thu May 08 2014 ').getTime(),
                new Date('Sat May 10 2014 ').getTime(), new Date('Mon May 12 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Fri May 16 2014 ').getTime(),
                new Date('Sun May 18 2014 ').getTime(), new Date('Tue May 20 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Sat May 24 2014 ').getTime(),
                new Date('Mon May 26 2014 ').getTime(), new Date('Wed May 28 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Sun Jun 01 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Thu Jun 05 2014 ').getTime(),
                new Date('Sat Jun 07 2014 ').getTime(), new Date('Mon Jun 09 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Fri Jun 13 2014 ').getTime(),
                new Date('Sun Jun 15 2014 ').getTime(), new Date('Tue Jun 17 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Sat Jun 21 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Wed Jun 25 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Sun Jun 29 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Thu Jul 03 2014 ').getTime(),
                new Date('Sat Jul 05 2014 ').getTime(), new Date('Mon Jul 07 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Fri Jul 11 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Tue Jul 15 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Sat Jul 19 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Wed Jul 23 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime(), new Date('Sun Jul 27 2014 ').getTime(),
                new Date('Tue Jul 29 2014 ').getTime()]));
    });
    it('Default - Interval with modified startDate', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;INTERVAL=2;UNTIL=20140729T000000Z', null, 0, undefined, new Date('Thu Jul 03 2014 '))))
            .toBe(JSON.stringify([
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Sat Jul 05 2014 ').getTime(),
                new Date('Mon Jul 07 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Fri Jul 11 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Tue Jul 15 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Sat Jul 19 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Wed Jul 23 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime(), new Date('Sun Jul 27 2014 ').getTime(),
                new Date('Tue Jul 29 2014 ').getTime()]));
    });
    it('Default - Interval - Count-10', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;INTERVAL=1;COUNT=10', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Sat May 10 2014 ').getTime(), new Date('Sun May 11 2014 ').getTime(),
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime()]));
    });
    it('Default - ByDay', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                new Date('Fri May 16 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
                new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
                new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime()]));
    });
    it('Default - ByDay - BYMONTH', () => {
        expect(JSON.stringify(generate(startDate,
            'FREQ=DAILY;BYMONTH=6;INTERVAL=1;UNTIL=20140629T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun Jun 01 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Sat Jun 07 2014 ').getTime(), new Date('Sun Jun 08 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sat Jun 14 2014 ').getTime(),
                new Date('Sun Jun 15 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Sat Jun 21 2014 ').getTime(), new Date('Sun Jun 22 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Sat Jun 28 2014 ').getTime(),
                new Date('Sun Jun 29 2014 ').getTime()]));
    });
    it('Default - ByDay - BYMONTHDAY', () => {
        expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'),
            'FREQ=DAILY;BYMONTHDAY=13;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime(),
                new Date('Wed Aug 13 2014 ').getTime(), new Date('Sat Sep 13 2014 ').getTime(),
                new Date('Mon Oct 13 2014 ').getTime(), new Date('Thu Nov 13 2014 ').getTime(),
                new Date('Sat Dec 13 2014 ').getTime(), new Date('Tue Jan 13 2015 ').getTime(),
                new Date('Fri Feb 13 2015 ').getTime(), new Date('Fri Mar 13 2015 ').getTime(),
                new Date('Mon Apr 13 2015 ').getTime(), new Date('Wed May 13 2015 ').getTime(),
                new Date('Sat Jun 13 2015 ').getTime(), new Date('Mon Jul 13 2015 ').getTime(),
                new Date('Thu Aug 13 2015 ').getTime(), new Date('Sun Sep 13 2015 ').getTime(),
                new Date('Tue Oct 13 2015 ').getTime(), new Date('Fri Nov 13 2015 ').getTime(),
                new Date('Sun Dec 13 2015 ').getTime(), new Date('Wed Jan 13 2016 ').getTime(),
                new Date('Sat Feb 13 2016 ').getTime(), new Date('Sun Mar 13 2016 ').getTime(),
                new Date('Wed Apr 13 2016 ').getTime(), new Date('Fri May 13 2016 ').getTime(),
                new Date('Mon Jun 13 2016 ').getTime(), new Date('Wed Jul 13 2016 ').getTime(),
                new Date('Sat Aug 13 2016 ').getTime(), new Date('Tue Sep 13 2016 ').getTime(),
                new Date('Thu Oct 13 2016 ').getTime(), new Date('Sun Nov 13 2016 ').getTime(),
                new Date('Tue Dec 13 2016 ').getTime(), new Date('Fri Jan 13 2017 ').getTime(),
                new Date('Mon Feb 13 2017 ').getTime(), new Date('Mon Mar 13 2017 ').getTime(),
                new Date('Thu Apr 13 2017 ').getTime(), new Date('Sat May 13 2017 ').getTime(),
                new Date('Tue Jun 13 2017 ').getTime(), new Date('Thu Jul 13 2017 ').getTime(),
                new Date('Sun Aug 13 2017 ').getTime(), new Date('Wed Sep 13 2017 ').getTime(),
                new Date('Fri Oct 13 2017 ').getTime(), new Date('Mon Nov 13 2017 ').getTime(),
                new Date('Wed Dec 13 2017 ').getTime()]));
    });
    it('Default - ByDay - BYYEARDAY', () => {
        expect(JSON.stringify(generate(new Date('Sun Jun 01 2014'),
            'FREQ=DAILY;BYYEARDAY=168;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 17 2015 ').getTime(),
                new Date('Thu Jun 16 2016 ').getTime(), new Date('Sat Jun 17 2017 ').getTime(),
                new Date('Sun Jun 17 2018 ').getTime(), new Date('Mon Jun 17 2019 ').getTime(),
                new Date('Tue Jun 16 2020 ').getTime(), new Date('Thu Jun 17 2021 ').getTime(),
                new Date('Fri Jun 17 2022 ').getTime(), new Date('Sat Jun 17 2023 ').getTime(),
                new Date('Sun Jun 16 2024 ').getTime(), new Date('Tue Jun 17 2025 ').getTime(),
                new Date('Wed Jun 17 2026 ').getTime(), new Date('Thu Jun 17 2027 ').getTime(),
                new Date('Fri Jun 16 2028 ').getTime(), new Date('Sun Jun 17 2029 ').getTime(),
                new Date('Mon Jun 17 2030 ').getTime(), new Date('Tue Jun 17 2031 ').getTime(),
                new Date('Wed Jun 16 2032 ').getTime(), new Date('Fri Jun 17 2033 ').getTime(),
                new Date('Sat Jun 17 2034 ').getTime(), new Date('Sun Jun 17 2035 ').getTime(),
                new Date('Mon Jun 16 2036 ').getTime(), new Date('Wed Jun 17 2037 ').getTime(),
                new Date('Thu Jun 17 2038 ').getTime(), new Date('Fri Jun 17 2039 ').getTime(),
                new Date('Sat Jun 16 2040 ').getTime(), new Date('Mon Jun 17 2041 ').getTime(),
                new Date('Tue Jun 17 2042 ').getTime(), new Date('Wed Jun 17 2043 ').getTime(),
                new Date('Thu Jun 16 2044 ').getTime(), new Date('Sat Jun 17 2045 ').getTime(),
                new Date('Sun Jun 17 2046 ').getTime(), new Date('Mon Jun 17 2047 ').getTime(),
                new Date('Tue Jun 16 2048 ').getTime(), new Date('Thu Jun 17 2049 ').getTime(),
                new Date('Fri Jun 17 2050 ').getTime(), new Date('Sat Jun 17 2051 ').getTime(),
                new Date('Sun Jun 16 2052 ').getTime(), new Date('Tue Jun 17 2053 ').getTime(),
                new Date('Wed Jun 17 2054 ').getTime(), new Date('Thu Jun 17 2055 ').getTime(),
                new Date('Fri Jun 16 2056 ').getTime()]));
    });
});
describe('Schedule - recurrence Freq- Weekly', () => {
    let startDate: Date = new Date('Tue May 06 2014');
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                new Date('Fri May 16 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
                new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
                new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime()]));
    });
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=WE,TH,FR,MO,TU;INTERVAL=1;UNTIL=20140729T000000Z', null, 3)))
            .toBe(
            JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                new Date('Fri May 16 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
                new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
                new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime()]));
    });
    //interval
    it('Default - Interval 2', () => {
        //FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(),
                new Date('Wed May 07 2014 ').getTime(), new Date('Thu May 08 2014 ').getTime(),
                new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
                new Date('Sun May 18 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
                new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
                new Date('Sat May 24 2014 ').getTime(), new Date('Sun Jun 01 2014 ').getTime(),
                new Date('Mon Jun 02 2014 ').getTime(), new Date('Tue Jun 03 2014 ').getTime(),
                new Date('Wed Jun 04 2014 ').getTime(), new Date('Thu Jun 05 2014 ').getTime(),
                new Date('Fri Jun 06 2014 ').getTime(), new Date('Sat Jun 07 2014 ').getTime(),
                new Date('Sun Jun 15 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Sat Jun 21 2014 ').getTime(), new Date('Sun Jun 29 2014 ').getTime(),
                new Date('Mon Jun 30 2014 ').getTime(), new Date('Tue Jul 01 2014 ').getTime(),
                new Date('Wed Jul 02 2014 ').getTime(), new Date('Thu Jul 03 2014 ').getTime(),
                new Date('Fri Jul 04 2014 ').getTime(), new Date('Sat Jul 05 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Mon Jul 14 2014 ').getTime(),
                new Date('Tue Jul 15 2014 ').getTime(), new Date('Wed Jul 16 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Fri Jul 18 2014 ').getTime(),
                new Date('Sat Jul 19 2014 ').getTime(), new Date('Sun Jul 27 2014 ').getTime(),
                new Date('Mon Jul 28 2014 ').getTime(), new Date('Tue Jul 29 2014 ').getTime()]));
    });
    it('Default - BYMONTH', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140801T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Sat Jul 05 2014 ').getTime(), new Date('Sun Jul 06 2014 ').getTime(),
                new Date('Mon Jul 07 2014 ').getTime(), new Date('Tue Jul 08 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Thu Jul 10 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime(), new Date('Sat Jul 12 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Mon Jul 14 2014 ').getTime(),
                new Date('Tue Jul 15 2014 ').getTime(), new Date('Wed Jul 16 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Fri Jul 18 2014 ').getTime(),
                new Date('Sat Jul 19 2014 ').getTime(), new Date('Sun Jul 20 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Tue Jul 22 2014 ').getTime(),
                new Date('Wed Jul 23 2014 ').getTime(), new Date('Thu Jul 24 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime(), new Date('Sat Jul 26 2014 ').getTime(),
                new Date('Sun Jul 27 2014 ').getTime(), new Date('Mon Jul 28 2014 ').getTime(),
                new Date('Tue Jul 29 2014 ').getTime(), new Date('Wed Jul 30 2014 ').getTime(),
                new Date('Thu Jul 31 2014 ').getTime()]));
    });
    it('Default - BYMONTH count', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;COUNT=3', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=WEEKLY;BYDAY=FR;BYMONTHDAY=13;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Fri Jun 13 2014 ').getTime()]));
    });
    it('Default - BYYEARDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014'),
                'FREQ=WEEKLY;BYDAY=TU;BYYEARDAY=168;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Tue Jun 17 2014').getTime()]));
    });
});
describe('Schedule - recurrence Freq- Weekly (without EndDate)', () => {
    let startDate: Date = new Date('Tue May 06 2014');
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                new Date('Fri May 16 2014 ').getTime(), new Date('Mon May 19 2014 ').getTime(),
                new Date('Tue May 20 2014 ').getTime(), new Date('Wed May 21 2014 ').getTime(),
                new Date('Thu May 22 2014 ').getTime(), new Date('Fri May 23 2014 ').getTime(),
                new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Mon Jun 09 2014 ').getTime(), new Date('Tue Jun 10 2014 ').getTime(),
                new Date('Wed Jun 11 2014 ').getTime(), new Date('Thu Jun 12 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Mon Jun 16 2014 ').getTime(),
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 18 2014 ').getTime(),
                new Date('Thu Jun 19 2014 ').getTime(), new Date('Fri Jun 20 2014 ').getTime(),
                new Date('Mon Jun 23 2014 ').getTime(), new Date('Tue Jun 24 2014 ').getTime(),
                new Date('Wed Jun 25 2014 ').getTime(), new Date('Thu Jun 26 2014 ').getTime(),
                new Date('Fri Jun 27 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime()]));
    });
    //interval
    it('Default - Interval 2', () => {
        //FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;INTERVAL=2;BYDAY=SU,MO,TU,WE,TH,FR,SA', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue May 06 2014 ').getTime(), new Date('Wed May 07 2014 ').getTime(),
                new Date('Thu May 08 2014 ').getTime(), new Date('Fri May 09 2014 ').getTime(),
                new Date('Sat May 10 2014 ').getTime(), new Date('Sun May 18 2014 ').getTime(),
                new Date('Mon May 19 2014 ').getTime(), new Date('Tue May 20 2014 ').getTime(),
                new Date('Wed May 21 2014 ').getTime(), new Date('Thu May 22 2014 ').getTime(),
                new Date('Fri May 23 2014 ').getTime(), new Date('Sat May 24 2014 ').getTime(),
                new Date('Sun Jun 01 2014 ').getTime(), new Date('Mon Jun 02 2014 ').getTime(),
                new Date('Tue Jun 03 2014 ').getTime(), new Date('Wed Jun 04 2014 ').getTime(),
                new Date('Thu Jun 05 2014 ').getTime(), new Date('Fri Jun 06 2014 ').getTime(),
                new Date('Sat Jun 07 2014 ').getTime(), new Date('Sun Jun 15 2014 ').getTime(),
                new Date('Mon Jun 16 2014 ').getTime(), new Date('Tue Jun 17 2014 ').getTime(),
                new Date('Wed Jun 18 2014 ').getTime(), new Date('Thu Jun 19 2014 ').getTime(),
                new Date('Fri Jun 20 2014 ').getTime(), new Date('Sat Jun 21 2014 ').getTime(),
                new Date('Sun Jun 29 2014 ').getTime(), new Date('Mon Jun 30 2014 ').getTime(),
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Sat Jul 05 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime(),
                new Date('Mon Jul 14 2014 ').getTime(), new Date('Tue Jul 15 2014 ').getTime(),
                new Date('Wed Jul 16 2014 ').getTime(), new Date('Thu Jul 17 2014 ').getTime(),
                new Date('Fri Jul 18 2014 ').getTime(), new Date('Sat Jul 19 2014 ').getTime(),
                new Date('Sun Jul 27 2014 ').getTime(), new Date('Mon Jul 28 2014 ').getTime(),
                new Date('Tue Jul 29 2014 ').getTime()]));
    });
    it('Default - BYMONTH', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Sat Jul 05 2014 ').getTime(), new Date('Sun Jul 06 2014 ').getTime(),
                new Date('Mon Jul 07 2014 ').getTime(), new Date('Tue Jul 08 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Thu Jul 10 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime(), new Date('Sat Jul 12 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Mon Jul 14 2014 ').getTime(),
                new Date('Tue Jul 15 2014 ').getTime(), new Date('Wed Jul 16 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Fri Jul 18 2014 ').getTime(),
                new Date('Sat Jul 19 2014 ').getTime(), new Date('Sun Jul 20 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Tue Jul 22 2014 ').getTime(),
                new Date('Wed Jul 23 2014 ').getTime(), new Date('Thu Jul 24 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime(), new Date('Sat Jul 26 2014 ').getTime(),
                new Date('Sun Jul 27 2014 ').getTime(), new Date('Mon Jul 28 2014 ').getTime(),
                new Date('Tue Jul 29 2014 ').getTime(), new Date('Wed Jul 30 2014 ').getTime(),
                new Date('Thu Jul 31 2014 ').getTime(), new Date('Wed Jul 01 2015 ').getTime(),
                new Date('Thu Jul 02 2015 ').getTime(), new Date('Fri Jul 03 2015 ').getTime(),
                new Date('Sat Jul 04 2015 ').getTime(), new Date('Sun Jul 05 2015 ').getTime(),
                new Date('Mon Jul 06 2015 ').getTime(), new Date('Tue Jul 07 2015 ').getTime(),
                new Date('Wed Jul 08 2015 ').getTime(), new Date('Thu Jul 09 2015 ').getTime(),
                new Date('Fri Jul 10 2015 ').getTime(), new Date('Sat Jul 11 2015 ').getTime(),
                new Date('Sun Jul 12 2015 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=WEEKLY;BYDAY=FR;BYMONTHDAY=13;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Fri Feb 13 2015 ').getTime(),
                new Date('Fri Mar 13 2015 ').getTime(), new Date('Fri Nov 13 2015 ').getTime(),
                new Date('Fri May 13 2016 ').getTime(), new Date('Fri Jan 13 2017 ').getTime(),
                new Date('Fri Oct 13 2017 ').getTime(), new Date('Fri Apr 13 2018 ').getTime(),
                new Date('Fri Jul 13 2018 ').getTime(), new Date('Fri Sep 13 2019 ').getTime(),
                new Date('Fri Dec 13 2019 ').getTime(), new Date('Fri Mar 13 2020 ').getTime(),
                new Date('Fri Nov 13 2020 ').getTime(), new Date('Fri Aug 13 2021 ').getTime(),
                new Date('Fri May 13 2022 ').getTime(), new Date('Fri Jan 13 2023 ').getTime(),
                new Date('Fri Oct 13 2023 ').getTime(), new Date('Fri Sep 13 2024 ').getTime(),
                new Date('Fri Dec 13 2024 ').getTime(), new Date('Fri Jun 13 2025 ').getTime(),
                new Date('Fri Feb 13 2026 ').getTime(), new Date('Fri Mar 13 2026 ').getTime(),
                new Date('Fri Nov 13 2026 ').getTime(), new Date('Fri Aug 13 2027 ').getTime(),
                new Date('Fri Oct 13 2028 ').getTime(), new Date('Fri Apr 13 2029 ').getTime(),
                new Date('Fri Jul 13 2029 ').getTime(), new Date('Fri Sep 13 2030 ').getTime(),
                new Date('Fri Dec 13 2030 ').getTime(), new Date('Fri Jun 13 2031 ').getTime(),
                new Date('Fri Feb 13 2032 ').getTime(), new Date('Fri Aug 13 2032 ').getTime(),
                new Date('Fri May 13 2033 ').getTime(), new Date('Fri Jan 13 2034 ').getTime(),
                new Date('Fri Oct 13 2034 ').getTime(), new Date('Fri Apr 13 2035 ').getTime(),
                new Date('Fri Jul 13 2035 ').getTime(), new Date('Fri Jun 13 2036 ').getTime(),
                new Date('Fri Feb 13 2037 ').getTime(), new Date('Fri Mar 13 2037 ').getTime(),
                new Date('Fri Nov 13 2037 ').getTime(), new Date('Fri Aug 13 2038 ').getTime(),
                new Date('Fri May 13 2039 ').getTime()]));
    });
    it('Default - BYYEARDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=WEEKLY;BYDAY=TU;BYYEARDAY=168;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Tue Jun 16 2020 ').getTime(),
                new Date('Tue Jun 17 2025 ').getTime(), new Date('Tue Jun 17 2031 ').getTime(),
                new Date('Tue Jun 17 2042 ').getTime(), new Date('Tue Jun 16 2048 ').getTime(),
                new Date('Tue Jun 17 2053 ').getTime(), new Date('Tue Jun 17 2059 ').getTime(),
                new Date('Tue Jun 17 2070 ').getTime(), new Date('Tue Jun 16 2076 ').getTime(),
                new Date('Tue Jun 17 2081 ').getTime(), new Date('Tue Jun 17 2087 ').getTime(),
                new Date('Tue Jun 17 2098 ').getTime(), new Date('Tue Jun 17 2110 ').getTime(),
                new Date('Tue Jun 16 2116 ').getTime(), new Date('Tue Jun 17 2121 ').getTime(),
                new Date('Tue Jun 17 2127 ').getTime(), new Date('Tue Jun 17 2138 ').getTime(),
                new Date('Tue Jun 16 2144 ').getTime(), new Date('Tue Jun 17 2149 ').getTime(),
                new Date('Tue Jun 17 2155 ').getTime(), new Date('Tue Jun 17 2166 ').getTime(),
                new Date('Tue Jun 16 2172 ').getTime(), new Date('Tue Jun 17 2177 ').getTime(),
                new Date('Tue Jun 17 2183 ').getTime(), new Date('Tue Jun 17 2194 ').getTime(),
                new Date('Tue Jun 17 2200 ').getTime(), new Date('Tue Jun 17 2206 ').getTime(),
                new Date('Tue Jun 16 2212 ').getTime(), new Date('Tue Jun 17 2217 ').getTime(),
                new Date('Tue Jun 17 2223 ').getTime(), new Date('Tue Jun 17 2234 ').getTime(),
                new Date('Tue Jun 16 2240 ').getTime(), new Date('Tue Jun 17 2245 ').getTime(),
                new Date('Tue Jun 17 2251 ').getTime(), new Date('Tue Jun 17 2262 ').getTime(),
                new Date('Tue Jun 16 2268 ').getTime(), new Date('Tue Jun 17 2273 ').getTime(),
                new Date('Tue Jun 17 2279 ').getTime(), new Date('Tue Jun 17 2290 ').getTime(),
                new Date('Tue Jun 16 2296 ').getTime(), new Date('Tue Jun 17 2302 ').getTime(),
                new Date('Tue Jun 16 2308 ').getTime()]));
    });
});

describe('Schedule - recurrence Freq- MONTHLY', () => {
    let startDate: Date = new Date('Tue May 06 2014 ');
    it('Default - ByDay Single Day', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Fri Jun 13 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime()]));
    });
    it('Default - ByDay Multiple Days', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sat Jun 14 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime()]));
    });
    it('Default - ByDay Multiple Days Week startDay changed', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 5)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sat Jun 14 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime()]));
    });
    it('Default - ByDay Multiple Days Week startDay changed with count 3', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z;COUNT=3', null, 5)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime()]));
    });
    it('Default - BYMONTH', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Sat Jul 05 2014 ').getTime(), new Date('Sun Jul 06 2014 ').getTime(),
                new Date('Mon Jul 07 2014 ').getTime(), new Date('Tue Jul 08 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Thu Jul 10 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime(), new Date('Sat Jul 12 2014 ').getTime(),
                new Date('Sun Jul 13 2014 ').getTime(), new Date('Mon Jul 14 2014 ').getTime(),
                new Date('Tue Jul 15 2014 ').getTime(), new Date('Wed Jul 16 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Fri Jul 18 2014 ').getTime(),
                new Date('Sat Jul 19 2014 ').getTime(), new Date('Sun Jul 20 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Tue Jul 22 2014 ').getTime(),
                new Date('Wed Jul 23 2014 ').getTime(), new Date('Thu Jul 24 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime(), new Date('Sat Jul 26 2014 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=13;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime()]));
    });
    it('Default - BYMONTHDAY-set', () => {
        expect(
            JSON.stringify(generate(new Date('Wed Nov 01 2017'),
                'FREQ=MONTHLY;BYDAY=WE;BYSETPOS=1;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date("Wed Nov 01 2017").getTime(),
                new Date("Wed Dec 06 2017").getTime(),
                new Date("Wed Jan 03 2018").getTime(),
                new Date("Wed Feb 07 2018").getTime(),
                new Date("Wed Mar 07 2018").getTime(),
                new Date("Wed Apr 04 2018").getTime(),
                new Date("Wed May 02 2018").getTime(),
                new Date("Wed Jun 06 2018").getTime(),
                new Date("Wed Jul 04 2018").getTime(),
                new Date("Wed Aug 01 2018").getTime(),
                new Date("Wed Sep 05 2018").getTime(),
                new Date("Wed Oct 03 2018").getTime(),
                new Date("Wed Nov 07 2018").getTime(),
                new Date("Wed Dec 05 2018").getTime(),
                new Date("Wed Jan 02 2019").getTime(),
                new Date("Wed Feb 06 2019").getTime(),
                new Date("Wed Mar 06 2019").getTime(),
                new Date("Wed Apr 03 2019").getTime(),
                new Date("Wed May 01 2019").getTime(),
                new Date("Wed Jun 05 2019").getTime(),
                new Date("Wed Jul 03 2019").getTime(),
                new Date("Wed Aug 07 2019").getTime(),
                new Date("Wed Sep 04 2019").getTime(),
                new Date("Wed Oct 02 2019").getTime(),
                new Date("Wed Nov 06 2019").getTime(),
                new Date("Wed Dec 04 2019").getTime(),
                new Date("Wed Jan 01 2020").getTime(),
                new Date("Wed Feb 05 2020").getTime(),
                new Date("Wed Mar 04 2020").getTime(),
                new Date("Wed Apr 01 2020").getTime(),
                new Date("Wed May 06 2020").getTime(),
                new Date("Wed Jun 03 2020").getTime(),
                new Date("Wed Jul 01 2020").getTime(),
                new Date("Wed Aug 05 2020").getTime(),
                new Date("Wed Sep 02 2020").getTime(),
                new Date("Wed Oct 07 2020").getTime(),
                new Date("Wed Nov 04 2020").getTime(),
                new Date("Wed Dec 02 2020").getTime(),
                new Date("Wed Jan 06 2021").getTime(),
                new Date("Wed Feb 03 2021").getTime(),
                new Date("Wed Mar 03 2021").getTime(),
                new Date("Wed Apr 07 2021").getTime(),
                new Date("Wed May 05 2021").getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=31;INTERVAL=1;UNTIL=20150729T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Thu Jul 31 2014 ').getTime(), new Date('Sun Aug 31 2014 ').getTime(),
                new Date('Fri Oct 31 2014 ').getTime(), new Date('Wed Dec 31 2014 ').getTime(),
                new Date('Sat Jan 31 2015 ').getTime(), new Date('Tue Mar 31 2015 ').getTime(),
                new Date('Sun May 31 2015 ').getTime()]));
    });
    it('Default - BYMONTHDAY negative Value', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=-5;INTERVAL=1;UNTIL=20150729T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Thu Jun 26 2014 ').getTime(), new Date('Sun Jul 27 2014 ').getTime(),
                new Date('Wed Aug 27 2014 ').getTime(), new Date('Fri Sep 26 2014 ').getTime(),
                new Date('Mon Oct 27 2014 ').getTime(), new Date('Wed Nov 26 2014 ').getTime(),
                new Date('Sat Dec 27 2014 ').getTime(), new Date('Tue Jan 27 2015 ').getTime(),
                new Date('Tue Feb 24 2015 ').getTime(), new Date('Fri Mar 27 2015 ').getTime(),
                new Date('Sun Apr 26 2015 ').getTime(), new Date('Wed May 27 2015 ').getTime(),
                new Date('Fri Jun 26 2015 ').getTime(), new Date('Mon Jul 27 2015 ').getTime()]));
    });
    it('Default - BYMONTHDAY negative Value', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=-31;INTERVAL=1;UNTIL=20150729T000000Z', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Fri Aug 01 2014 ').getTime(),
                new Date('Wed Oct 01 2014 ').getTime(), new Date('Mon Dec 01 2014 ').getTime(),
                new Date('Thu Jan 01 2015 ').getTime(), new Date('Sun Mar 01 2015 ').getTime(),
                new Date('Fri May 01 2015 ').getTime(), new Date('Wed Jul 01 2015 ').getTime()]));
    });
    it('Default - BYMONTHDAY - feb 29', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1;UNTIL=20200729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Mon Feb 29 2016 ').getTime(), new Date('Sat Feb 29 2020 ').getTime()]));
    });
    it('Default - BYMONTHDAY - feb 29', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1;UNTIL=20200729T000000Z;COUNT=1', null, 0)))
            .toBe(JSON.stringify([new Date('Mon Feb 29 2016 ').getTime()]));
    });
    it('Default - BYYEARDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYYEARDAY=168;BYMONTH=6;INTERVAL=1;BYMONTHDAY=17;UNTIL=20140729T000000Z', null, 0)))
            .toBe(JSON.stringify([new Date('Tue Jun 17 2014 ').getTime()]));
    });
});
describe('Schedule - recurrence Freq- MONTHLY (without EndDate)', () => {
    let startDate: Date = new Date('Tue May 06 2014 ');
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYMONTHDAY=10,11,12,13,14,15;BYDAY=MO,TU,WE,TH,FR;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Mon May 12 2014 ').getTime(), new Date('Tue May 13 2014 ').getTime(),
                new Date('Wed May 14 2014 ').getTime(), new Date('Thu May 15 2014 ').getTime(),
                new Date('Tue Jun 10 2014 ').getTime(), new Date('Wed Jun 11 2014 ').getTime(),
                new Date('Thu Jun 12 2014 ').getTime(), new Date('Fri Jun 13 2014 ').getTime(),
                new Date('Thu Jul 10 2014 ').getTime(), new Date('Fri Jul 11 2014 ').getTime(),
                new Date('Mon Jul 14 2014 ').getTime(), new Date('Tue Jul 15 2014 ').getTime()]));
    });
    it('Default - ByDay Single Day', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR;BYSETPOS=2;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Fri Jun 13 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime()]));
    });
    it('Default - ByDay Multiple Days', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=MONTHLY;BYDAY=FR,SA;BYSETPOS=2;INTERVAL=1;UNTIL=20140711T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Fri May 09 2014 ').getTime(), new Date('Sat May 10 2014 ').getTime(),
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sat Jun 14 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=13;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Fri Jun 13 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime(),
                new Date('Wed Aug 13 2014 ').getTime(), new Date('Sat Sep 13 2014 ').getTime(),
                new Date('Mon Oct 13 2014 ').getTime(), new Date('Thu Nov 13 2014 ').getTime(),
                new Date('Sat Dec 13 2014 ').getTime(), new Date('Tue Jan 13 2015 ').getTime(),
                new Date('Fri Feb 13 2015 ').getTime(), new Date('Fri Mar 13 2015 ').getTime(),
                new Date('Mon Apr 13 2015 ').getTime(), new Date('Wed May 13 2015 ').getTime(),
                new Date('Sat Jun 13 2015 ').getTime(), new Date('Mon Jul 13 2015 ').getTime(),
                new Date('Thu Aug 13 2015 ').getTime(), new Date('Sun Sep 13 2015 ').getTime(),
                new Date('Tue Oct 13 2015 ').getTime(), new Date('Fri Nov 13 2015 ').getTime(),
                new Date('Sun Dec 13 2015 ').getTime(), new Date('Wed Jan 13 2016 ').getTime(),
                new Date('Sat Feb 13 2016 ').getTime(), new Date('Sun Mar 13 2016 ').getTime(),
                new Date('Wed Apr 13 2016 ').getTime(), new Date('Fri May 13 2016 ').getTime(),
                new Date('Mon Jun 13 2016 ').getTime(), new Date('Wed Jul 13 2016 ').getTime(),
                new Date('Sat Aug 13 2016 ').getTime(), new Date('Tue Sep 13 2016 ').getTime(),
                new Date('Thu Oct 13 2016 ').getTime(), new Date('Sun Nov 13 2016 ').getTime(),
                new Date('Tue Dec 13 2016 ').getTime(), new Date('Fri Jan 13 2017 ').getTime(),
                new Date('Mon Feb 13 2017 ').getTime(), new Date('Mon Mar 13 2017 ').getTime(),
                new Date('Thu Apr 13 2017 ').getTime(), new Date('Sat May 13 2017 ').getTime(),
                new Date('Tue Jun 13 2017 ').getTime(), new Date('Thu Jul 13 2017 ').getTime(),
                new Date('Sun Aug 13 2017 ').getTime(), new Date('Wed Sep 13 2017 ').getTime(),
                new Date('Fri Oct 13 2017 ').getTime(), new Date('Mon Nov 13 2017 ').getTime(),
                new Date('Wed Dec 13 2017 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=31;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Thu Jul 31 2014 ').getTime(), new Date('Sun Aug 31 2014 ').getTime(),
                new Date('Fri Oct 31 2014 ').getTime(), new Date('Wed Dec 31 2014 ').getTime(),
                new Date('Sat Jan 31 2015 ').getTime(), new Date('Tue Mar 31 2015 ').getTime(),
                new Date('Sun May 31 2015 ').getTime(), new Date('Fri Jul 31 2015 ').getTime(),
                new Date('Mon Aug 31 2015 ').getTime(), new Date('Sat Oct 31 2015 ').getTime(),
                new Date('Thu Dec 31 2015 ').getTime(), new Date('Sun Jan 31 2016 ').getTime(),
                new Date('Thu Mar 31 2016 ').getTime(), new Date('Tue May 31 2016 ').getTime(),
                new Date('Sun Jul 31 2016 ').getTime(), new Date('Wed Aug 31 2016 ').getTime(),
                new Date('Mon Oct 31 2016 ').getTime(), new Date('Sat Dec 31 2016 ').getTime(),
                new Date('Tue Jan 31 2017 ').getTime(), new Date('Fri Mar 31 2017 ').getTime(),
                new Date('Wed May 31 2017 ').getTime(), new Date('Mon Jul 31 2017 ').getTime(),
                new Date('Thu Aug 31 2017 ').getTime(), new Date('Tue Oct 31 2017 ').getTime(),
                new Date('Sun Dec 31 2017 ').getTime(), new Date('Wed Jan 31 2018 ').getTime(),
                new Date('Sat Mar 31 2018 ').getTime(), new Date('Thu May 31 2018 ').getTime(),
                new Date('Tue Jul 31 2018 ').getTime(), new Date('Fri Aug 31 2018 ').getTime(),
                new Date('Wed Oct 31 2018 ').getTime(), new Date('Mon Dec 31 2018 ').getTime(),
                new Date('Thu Jan 31 2019 ').getTime(), new Date('Sun Mar 31 2019 ').getTime(),
                new Date('Fri May 31 2019 ').getTime(), new Date('Wed Jul 31 2019 ').getTime(),
                new Date('Sat Aug 31 2019 ').getTime(), new Date('Thu Oct 31 2019 ').getTime(),
                new Date('Tue Dec 31 2019 ').getTime(), new Date('Fri Jan 31 2020 ').getTime(),
                new Date('Tue Mar 31 2020 ').getTime(), new Date('Sun May 31 2020 ').getTime(),
                new Date('Fri Jul 31 2020 ').getTime()]));
    });
    it('Default - BYMONTHDAY - feb 29', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYMONTHDAY=29;BYMONTH=2;INTERVAL=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Mon Feb 29 2016 ').getTime(), new Date('Sat Feb 29 2020 ').getTime(),
                new Date('Thu Feb 29 2024 ').getTime(), new Date('Tue Feb 29 2028 ').getTime(),
                new Date('Sun Feb 29 2032 ').getTime(), new Date('Fri Feb 29 2036 ').getTime(),
                new Date('Wed Feb 29 2040 ').getTime(), new Date('Mon Feb 29 2044 ').getTime(),
                new Date('Sat Feb 29 2048 ').getTime(), new Date('Thu Feb 29 2052 ').getTime(),
                new Date('Tue Feb 29 2056 ').getTime(), new Date('Sun Feb 29 2060 ').getTime(),
                new Date('Fri Feb 29 2064 ').getTime(), new Date('Wed Feb 29 2068 ').getTime(),
                new Date('Mon Feb 29 2072 ').getTime(), new Date('Sat Feb 29 2076 ').getTime(),
                new Date('Thu Feb 29 2080 ').getTime(), new Date('Tue Feb 29 2084 ').getTime(),
                new Date('Sun Feb 29 2088 ').getTime(), new Date('Fri Feb 29 2092 ').getTime(),
                new Date('Wed Feb 29 2096 ').getTime(), new Date('Fri Feb 29 2104 ').getTime(),
                new Date('Wed Feb 29 2108 ').getTime(), new Date('Mon Feb 29 2112 ').getTime(),
                new Date('Sat Feb 29 2116 ').getTime(), new Date('Thu Feb 29 2120 ').getTime(),
                new Date('Tue Feb 29 2124 ').getTime(), new Date('Sun Feb 29 2128 ').getTime(),
                new Date('Fri Feb 29 2132 ').getTime(), new Date('Wed Feb 29 2136 ').getTime(),
                new Date('Mon Feb 29 2140 ').getTime(), new Date('Sat Feb 29 2144 ').getTime(),
                new Date('Thu Feb 29 2148 ').getTime(), new Date('Tue Feb 29 2152 ').getTime(),
                new Date('Sun Feb 29 2156 ').getTime(), new Date('Fri Feb 29 2160 ').getTime(),
                new Date('Wed Feb 29 2164 ').getTime(), new Date('Mon Feb 29 2168 ').getTime(),
                new Date('Sat Feb 29 2172 ').getTime(), new Date('Thu Feb 29 2176 ').getTime(),
                new Date('Tue Feb 29 2180 ').getTime(), new Date('Sun Feb 29 2184 ').getTime(),
                new Date('Fri Feb 29 2188 ').getTime()]));
    });
    it('Default - BYYEARDAY', () => {
        expect(
            JSON.stringify(generate(new Date('Sun Jun 01 2014 '),
                'FREQ=MONTHLY;BYYEARDAY=168;BYMONTH=6;INTERVAL=1;BYMONTHDAY=17', null, 0)))
            .toBe(JSON.stringify([
                new Date('Tue Jun 17 2014 ').getTime(), new Date('Wed Jun 17 2015 ').getTime(),
                new Date('Sat Jun 17 2017 ').getTime(), new Date('Sun Jun 17 2018 ').getTime(),
                new Date('Mon Jun 17 2019 ').getTime(), new Date('Thu Jun 17 2021 ').getTime(),
                new Date('Fri Jun 17 2022 ').getTime(), new Date('Sat Jun 17 2023 ').getTime(),
                new Date('Tue Jun 17 2025 ').getTime(), new Date('Wed Jun 17 2026 ').getTime(),
                new Date('Thu Jun 17 2027 ').getTime(), new Date('Sun Jun 17 2029 ').getTime(),
                new Date('Mon Jun 17 2030 ').getTime(), new Date('Tue Jun 17 2031 ').getTime(),
                new Date('Fri Jun 17 2033 ').getTime(), new Date('Sat Jun 17 2034 ').getTime(),
                new Date('Sun Jun 17 2035 ').getTime(), new Date('Wed Jun 17 2037 ').getTime(),
                new Date('Thu Jun 17 2038 ').getTime(), new Date('Fri Jun 17 2039 ').getTime(),
                new Date('Mon Jun 17 2041 ').getTime(), new Date('Tue Jun 17 2042 ').getTime(),
                new Date('Wed Jun 17 2043 ').getTime(), new Date('Sat Jun 17 2045 ').getTime(),
                new Date('Sun Jun 17 2046 ').getTime(), new Date('Mon Jun 17 2047 ').getTime(),
                new Date('Thu Jun 17 2049 ').getTime(), new Date('Fri Jun 17 2050 ').getTime(),
                new Date('Sat Jun 17 2051 ').getTime(), new Date('Tue Jun 17 2053 ').getTime(),
                new Date('Wed Jun 17 2054 ').getTime(), new Date('Thu Jun 17 2055 ').getTime(),
                new Date('Sun Jun 17 2057 ').getTime(), new Date('Mon Jun 17 2058 ').getTime(),
                new Date('Tue Jun 17 2059 ').getTime(), new Date('Fri Jun 17 2061 ').getTime(),
                new Date('Sat Jun 17 2062 ').getTime(), new Date('Sun Jun 17 2063 ').getTime(),
                new Date('Wed Jun 17 2065 ').getTime(), new Date('Thu Jun 17 2066 ').getTime(),
                new Date('Fri Jun 17 2067 ').getTime(), new Date('Mon Jun 17 2069 ').getTime(),
                new Date('Tue Jun 17 2070 ').getTime()]));
    });
});
describe('Schedule - recurrence Freq- YEARLY', () => {
    let startDate: Date = new Date('Tue May 06 2014 ');
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Mon May 26 2014 ').getTime(), new Date('Tue May 27 2014 ').getTime(),
                new Date('Wed May 28 2014 ').getTime(), new Date('Thu May 29 2014 ').getTime(),
                new Date('Fri May 30 2014 ').getTime(), new Date('Mon Jun 23 2014 ').getTime(),
                new Date('Tue Jun 24 2014 ').getTime(), new Date('Wed Jun 25 2014 ').getTime(),
                new Date('Thu Jun 26 2014 ').getTime(), new Date('Fri Jun 27 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Tue Jul 22 2014 ').getTime(),
                new Date('Wed Jul 23 2014 ').getTime(), new Date('Thu Jul 24 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime()]));
    });
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Mon Jul 07 2014 ').getTime(), new Date('Tue Jul 08 2014 ').getTime(),
                new Date('Wed Jul 09 2014 ').getTime(), new Date('Thu Jul 10 2014 ').getTime(),
                new Date('Fri Jul 11 2014 ').getTime(), new Date('Mon Jul 14 2014 ').getTime(),
                new Date('Tue Jul 15 2014 ').getTime(), new Date('Wed Jul 16 2014 ').getTime(),
                new Date('Thu Jul 17 2014 ').getTime(), new Date('Fri Jul 18 2014 ').getTime(),
                new Date('Mon Jul 21 2014 ').getTime(), new Date('Tue Jul 22 2014 ').getTime(),
                new Date('Wed Jul 23 2014 ').getTime(), new Date('Thu Jul 24 2014 ').getTime(),
                new Date('Fri Jul 25 2014 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1;UNTIL=20140729T000000Z', null, 0)))
            .toBe(
            JSON.stringify([new Date('Sat Jul 12 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime()]));
    });
    it('Default - YearDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;INTERVAL=3;COUNT=10;BYYEARDAY=1,100,200', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Sat Jul 19 2014 ').getTime(), new Date('Sun Jan 01 2017 ').getTime(),
                new Date('Mon Apr 10 2017 ').getTime(), new Date('Wed Jul 19 2017 ').getTime(),
                new Date('Wed Jan 01 2020 ').getTime(), new Date('Thu Apr 09 2020 ').getTime(),
                new Date('Sat Jul 18 2020 ').getTime(), new Date('Sun Jan 01 2023 ').getTime(),
                new Date('Mon Apr 10 2023 ').getTime(), new Date('Wed Jul 19 2023 ').getTime()]));
    });
    it('Default - YearDay- 366 ', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;INTERVAL=1;COUNT=2;BYYEARDAY=366', null, 0)))
            .toBe(
            JSON.stringify([new Date('Sat Dec 31 2016 ').getTime(), new Date('Thu Dec 31 2020 ').getTime()]));
    });
    it('Default - YearDay- Negative Value ', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;INTERVAL=1;BYYEARDAY=-365', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Thu Jan 01 2015 ').getTime(), new Date('Sat Jan 02 2016 ').getTime(),
                new Date('Sun Jan 01 2017 ').getTime(), new Date('Mon Jan 01 2018 ').getTime(),
                new Date('Tue Jan 01 2019 ').getTime(), new Date('Thu Jan 02 2020 ').getTime(),
                new Date('Fri Jan 01 2021 ').getTime(), new Date('Sat Jan 01 2022 ').getTime(),
                new Date('Sun Jan 01 2023 ').getTime(), new Date('Tue Jan 02 2024 ').getTime(),
                new Date('Wed Jan 01 2025 ').getTime(), new Date('Thu Jan 01 2026 ').getTime(),
                new Date('Fri Jan 01 2027 ').getTime(), new Date('Sun Jan 02 2028 ').getTime(),
                new Date('Mon Jan 01 2029 ').getTime(), new Date('Tue Jan 01 2030 ').getTime(),
                new Date('Wed Jan 01 2031 ').getTime(), new Date('Fri Jan 02 2032 ').getTime(),
                new Date('Sat Jan 01 2033 ').getTime(), new Date('Sun Jan 01 2034 ').getTime(),
                new Date('Mon Jan 01 2035 ').getTime(), new Date('Wed Jan 02 2036 ').getTime(),
                new Date('Thu Jan 01 2037 ').getTime(), new Date('Fri Jan 01 2038 ').getTime(),
                new Date('Sat Jan 01 2039 ').getTime(), new Date('Mon Jan 02 2040 ').getTime(),
                new Date('Tue Jan 01 2041 ').getTime(), new Date('Wed Jan 01 2042 ').getTime(),
                new Date('Thu Jan 01 2043 ').getTime(), new Date('Sat Jan 02 2044 ').getTime(),
                new Date('Sun Jan 01 2045 ').getTime(), new Date('Mon Jan 01 2046 ').getTime(),
                new Date('Tue Jan 01 2047 ').getTime(), new Date('Thu Jan 02 2048 ').getTime(),
                new Date('Fri Jan 01 2049 ').getTime(), new Date('Sat Jan 01 2050 ').getTime(),
                new Date('Sun Jan 01 2051 ').getTime(), new Date('Tue Jan 02 2052 ').getTime(),
                new Date('Wed Jan 01 2053 ').getTime(), new Date('Thu Jan 01 2054 ').getTime(),
                new Date('Fri Jan 01 2055 ').getTime(), new Date('Sun Jan 02 2056 ').getTime(),
                new Date('Mon Jan 01 2057 ').getTime()]));
    });
    //FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO
    it('Default - WeekNo with day', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYWEEKNO=20;BYDAY=MO', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Mon May 12 2014 ').getTime(), new Date('Mon May 11 2015 ').getTime(),
                new Date('Mon May 09 2016 ').getTime(), new Date('Mon May 08 2017 ').getTime(),
                new Date('Mon May 14 2018 ').getTime(), new Date('Mon May 13 2019 ').getTime(),
                new Date('Mon May 11 2020 ').getTime(), new Date('Mon May 10 2021 ').getTime(),
                new Date('Mon May 09 2022 ').getTime(), new Date('Mon May 08 2023 ').getTime(),
                new Date('Mon May 13 2024 ').getTime(), new Date('Mon May 12 2025 ').getTime(),
                new Date('Mon May 11 2026 ').getTime(), new Date('Mon May 10 2027 ').getTime(),
                new Date('Mon May 08 2028 ').getTime(), new Date('Mon May 14 2029 ').getTime(),
                new Date('Mon May 13 2030 ').getTime(), new Date('Mon May 12 2031 ').getTime(),
                new Date('Mon May 10 2032 ').getTime(), new Date('Mon May 09 2033 ').getTime(),
                new Date('Mon May 08 2034 ').getTime(), new Date('Mon May 14 2035 ').getTime(),
                new Date('Mon May 12 2036 ').getTime(), new Date('Mon May 11 2037 ').getTime(),
                new Date('Mon May 10 2038 ').getTime(), new Date('Mon May 09 2039 ').getTime(),
                new Date('Mon May 07 2040 ').getTime(), new Date('Mon May 13 2041 ').getTime(),
                new Date('Mon May 12 2042 ').getTime(), new Date('Mon May 11 2043 ').getTime(),
                new Date('Mon May 09 2044 ').getTime(), new Date('Mon May 08 2045 ').getTime(),
                new Date('Mon May 14 2046 ').getTime(), new Date('Mon May 13 2047 ').getTime(),
                new Date('Mon May 11 2048 ').getTime(), new Date('Mon May 10 2049 ').getTime(),
                new Date('Mon May 09 2050 ').getTime(), new Date('Mon May 08 2051 ').getTime(),
                new Date('Mon May 13 2052 ').getTime(), new Date('Mon May 12 2053 ').getTime(),
                new Date('Mon May 11 2054 ').getTime(), new Date('Mon May 10 2055 ').getTime(),
                new Date('Mon May 08 2056 ').getTime()]));
    });
    it('Default - WeekNo with day negative Value', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYWEEKNO=-34;BYDAY=MO', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Mon May 12 2014 ').getTime(), new Date('Mon May 11 2015 ').getTime(),
                new Date('Mon May 09 2016 ').getTime(), new Date('Mon May 08 2017 ').getTime(),
                new Date('Mon May 14 2018 ').getTime(), new Date('Mon May 13 2019 ').getTime(),
                new Date('Mon May 11 2020 ').getTime(), new Date('Mon May 10 2021 ').getTime(),
                new Date('Mon May 09 2022 ').getTime(), new Date('Mon May 08 2023 ').getTime(),
                new Date('Mon May 13 2024 ').getTime(), new Date('Mon May 12 2025 ').getTime(),
                new Date('Mon May 11 2026 ').getTime(), new Date('Mon May 10 2027 ').getTime(),
                new Date('Mon May 08 2028 ').getTime(), new Date('Mon May 14 2029 ').getTime(),
                new Date('Mon May 13 2030 ').getTime(), new Date('Mon May 12 2031 ').getTime(),
                new Date('Mon May 10 2032 ').getTime(), new Date('Mon May 09 2033 ').getTime(),
                new Date('Mon May 08 2034 ').getTime(), new Date('Mon May 14 2035 ').getTime(),
                new Date('Mon May 12 2036 ').getTime(), new Date('Mon May 11 2037 ').getTime(),
                new Date('Mon May 10 2038 ').getTime(), new Date('Mon May 09 2039 ').getTime(),
                new Date('Mon May 07 2040 ').getTime(), new Date('Mon May 13 2041 ').getTime(),
                new Date('Mon May 12 2042 ').getTime(), new Date('Mon May 11 2043 ').getTime(),
                new Date('Mon May 09 2044 ').getTime(), new Date('Mon May 08 2045 ').getTime(),
                new Date('Mon May 14 2046 ').getTime(), new Date('Mon May 13 2047 ').getTime(),
                new Date('Mon May 11 2048 ').getTime(), new Date('Mon May 10 2049 ').getTime(),
                new Date('Mon May 09 2050 ').getTime(), new Date('Mon May 08 2051 ').getTime(),
                new Date('Mon May 13 2052 ').getTime(), new Date('Mon May 12 2053 ').getTime(),
                new Date('Mon May 11 2054 ').getTime(), new Date('Mon May 10 2055 ').getTime(),
                new Date('Mon May 08 2056 ').getTime()]));
    });
    it('Default - WeekNo - without Day', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20;COUNT=7', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun May 11 2014 ').getTime(), new Date('Mon May 12 2014 ').getTime(),
                new Date('Tue May 13 2014 ').getTime(), new Date('Wed May 14 2014 ').getTime(),
                new Date('Thu May 15 2014 ').getTime(), new Date('Fri May 16 2014 ').getTime(),
                new Date('Sat May 17 2014 ').getTime()]));
    });
    it('Default - WeekNo - without Day', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1;COUNT=7;', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun Dec 28 2014 ').getTime(), new Date('Mon Dec 29 2014 ').getTime(),
                new Date('Tue Dec 30 2014 ').getTime(), new Date('Wed Dec 31 2014 ').getTime(),
                new Date('Thu Jan 01 2015 ').getTime(), new Date('Fri Jan 02 2015 ').getTime(),
                new Date('Sat Jan 03 2015 ').getTime()]));
    });
    it('Default - WeekNo - without Day', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53;COUNT=7;', null, 1)))
            .toBe(JSON.stringify([
                new Date('Mon Dec 29 2014 ').getTime(), new Date('Tue Dec 30 2014 ').getTime(),
                new Date('Wed Dec 31 2014 ').getTime(), new Date('Thu Jan 01 2015 ').getTime(),
                new Date('Fri Jan 02 2015 ').getTime(), new Date('Sat Jan 03 2015 ').getTime(),
                new Date('Sun Jan 04 2015 ').getTime()]));
    });
});
describe('Schedule - recurrence Freq- YEARLY- No End date', () => {
    let startDate: Date = new Date('Tue May 06 2014 ');
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=1;BYMONTH=5,7;INTERVAL=1', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Fri May 01 2015 ').getTime(), new Date('Wed Jul 01 2015 ').getTime(),
                new Date('Thu Jul 02 2015 ').getTime(), new Date('Fri Jul 03 2015 ').getTime(),
                new Date('Mon May 02 2016 ').getTime(), new Date('Tue May 03 2016 ').getTime(),
                new Date('Wed May 04 2016 ').getTime(), new Date('Thu May 05 2016 ').getTime(),
                new Date('Fri May 06 2016 ').getTime(), new Date('Fri Jul 01 2016 ').getTime(),
                new Date('Mon May 01 2017 ').getTime(), new Date('Tue May 02 2017 ').getTime(),
                new Date('Wed May 03 2017 ').getTime(), new Date('Thu May 04 2017 ').getTime(),
                new Date('Fri May 05 2017 ').getTime(), new Date('Mon Jul 03 2017 ').getTime(),
                new Date('Tue Jul 04 2017 ').getTime(), new Date('Wed Jul 05 2017 ').getTime(),
                new Date('Thu Jul 06 2017 ').getTime(), new Date('Fri Jul 07 2017 ').getTime(),
                new Date('Tue May 01 2018 ').getTime(), new Date('Wed May 02 2018 ').getTime(),
                new Date('Thu May 03 2018 ').getTime(), new Date('Fri May 04 2018 ').getTime(),
                new Date('Mon Jul 02 2018 ').getTime(), new Date('Tue Jul 03 2018 ').getTime(),
                new Date('Wed Jul 04 2018 ').getTime(), new Date('Thu Jul 05 2018 ').getTime(),
                new Date('Fri Jul 06 2018 ').getTime(), new Date('Wed May 01 2019 ').getTime(),
                new Date('Thu May 02 2019 ').getTime(), new Date('Fri May 03 2019 ').getTime(),
                new Date('Mon Jul 01 2019 ').getTime(), new Date('Tue Jul 02 2019 ').getTime(),
                new Date('Wed Jul 03 2019 ').getTime(), new Date('Thu Jul 04 2019 ').getTime(),
                new Date('Fri Jul 05 2019 ').getTime(), new Date('Fri May 01 2020 ').getTime(),
                new Date('Wed Jul 01 2020 ').getTime()]));
    });
    it('Default - ByDay', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYDAY=MO,TU,WE,TH,FR;BYMONTH=7;BYSETPOS=1;INTERVAL=1', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Tue Jul 01 2014 ').getTime(), new Date('Wed Jul 02 2014 ').getTime(),
                new Date('Thu Jul 03 2014 ').getTime(), new Date('Fri Jul 04 2014 ').getTime(),
                new Date('Wed Jul 01 2015 ').getTime(), new Date('Thu Jul 02 2015 ').getTime(),
                new Date('Fri Jul 03 2015 ').getTime(), new Date('Fri Jul 01 2016 ').getTime(),
                new Date('Mon Jul 03 2017 ').getTime(), new Date('Tue Jul 04 2017 ').getTime(),
                new Date('Wed Jul 05 2017 ').getTime(), new Date('Thu Jul 06 2017 ').getTime(),
                new Date('Fri Jul 07 2017 ').getTime(), new Date('Mon Jul 02 2018 ').getTime(),
                new Date('Tue Jul 03 2018 ').getTime(), new Date('Wed Jul 04 2018 ').getTime(),
                new Date('Thu Jul 05 2018 ').getTime(), new Date('Fri Jul 06 2018 ').getTime(),
                new Date('Mon Jul 01 2019 ').getTime(), new Date('Tue Jul 02 2019 ').getTime(),
                new Date('Wed Jul 03 2019 ').getTime(), new Date('Thu Jul 04 2019 ').getTime(),
                new Date('Fri Jul 05 2019 ').getTime(), new Date('Wed Jul 01 2020 ').getTime(),
                new Date('Thu Jul 02 2020 ').getTime(), new Date('Fri Jul 03 2020 ').getTime(),
                new Date('Thu Jul 01 2021 ').getTime(), new Date('Fri Jul 02 2021 ').getTime(),
                new Date('Fri Jul 01 2022 ').getTime(), new Date('Mon Jul 03 2023 ').getTime(),
                new Date('Tue Jul 04 2023 ').getTime(), new Date('Wed Jul 05 2023 ').getTime(),
                new Date('Thu Jul 06 2023 ').getTime(), new Date('Fri Jul 07 2023 ').getTime(),
                new Date('Mon Jul 01 2024 ').getTime(), new Date('Tue Jul 02 2024 ').getTime(),
                new Date('Wed Jul 03 2024 ').getTime(), new Date('Thu Jul 04 2024 ').getTime(),
                new Date('Fri Jul 05 2024 ').getTime(), new Date('Tue Jul 01 2025 ').getTime(),
                new Date('Wed Jul 02 2025 ').getTime(), new Date('Thu Jul 03 2025 ').getTime(),
                new Date('Fri Jul 04 2025 ').getTime()]));
    });
    it('Default - BYMONTHDAY', () => {
        expect(
            JSON.stringify(generate(startDate,
                'FREQ=YEARLY;BYMONTHDAY=12,13;BYMONTH=7;INTERVAL=1', null, 0)))
            .toBe(
            JSON.stringify([
                new Date('Sat Jul 12 2014 ').getTime(), new Date('Sun Jul 13 2014 ').getTime(),
                new Date('Sun Jul 12 2015 ').getTime(), new Date('Mon Jul 13 2015 ').getTime(),
                new Date('Tue Jul 12 2016 ').getTime(), new Date('Wed Jul 13 2016 ').getTime(),
                new Date('Wed Jul 12 2017 ').getTime(), new Date('Thu Jul 13 2017 ').getTime(),
                new Date('Thu Jul 12 2018 ').getTime(), new Date('Fri Jul 13 2018 ').getTime(),
                new Date('Fri Jul 12 2019 ').getTime(), new Date('Sat Jul 13 2019 ').getTime(),
                new Date('Sun Jul 12 2020 ').getTime(), new Date('Mon Jul 13 2020 ').getTime(),
                new Date('Mon Jul 12 2021 ').getTime(), new Date('Tue Jul 13 2021 ').getTime(),
                new Date('Tue Jul 12 2022 ').getTime(), new Date('Wed Jul 13 2022 ').getTime(),
                new Date('Wed Jul 12 2023 ').getTime(), new Date('Thu Jul 13 2023 ').getTime(),
                new Date('Fri Jul 12 2024 ').getTime(), new Date('Sat Jul 13 2024 ').getTime(),
                new Date('Sat Jul 12 2025 ').getTime(), new Date('Sun Jul 13 2025 ').getTime(),
                new Date('Sun Jul 12 2026 ').getTime(), new Date('Mon Jul 13 2026 ').getTime(),
                new Date('Mon Jul 12 2027 ').getTime(), new Date('Tue Jul 13 2027 ').getTime(),
                new Date('Wed Jul 12 2028 ').getTime(), new Date('Thu Jul 13 2028 ').getTime(),
                new Date('Thu Jul 12 2029 ').getTime(), new Date('Fri Jul 13 2029 ').getTime(),
                new Date('Fri Jul 12 2030 ').getTime(), new Date('Sat Jul 13 2030 ').getTime(),
                new Date('Sat Jul 12 2031 ').getTime(), new Date('Sun Jul 13 2031 ').getTime(),
                new Date('Mon Jul 12 2032 ').getTime(), new Date('Tue Jul 13 2032 ').getTime(),
                new Date('Tue Jul 12 2033 ').getTime(), new Date('Wed Jul 13 2033 ').getTime(),
                new Date('Wed Jul 12 2034 ').getTime(), new Date('Thu Jul 13 2034 ').getTime(),
                new Date('Thu Jul 12 2035 ').getTime()]));
    });
    it('Default - WeekNo - without Day', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=20', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun May 11 2014 ').getTime(), new Date('Mon May 12 2014 ').getTime(),
                new Date('Tue May 13 2014 ').getTime(), new Date('Wed May 14 2014 ').getTime(),
                new Date('Thu May 15 2014 ').getTime(), new Date('Fri May 16 2014 ').getTime(),
                new Date('Sat May 17 2014 ').getTime(), new Date('Sun May 10 2015 ').getTime(),
                new Date('Mon May 11 2015 ').getTime(), new Date('Tue May 12 2015 ').getTime(),
                new Date('Wed May 13 2015 ').getTime(), new Date('Thu May 14 2015 ').getTime(),
                new Date('Fri May 15 2015 ').getTime(), new Date('Sat May 16 2015 ').getTime(),
                new Date('Sun May 08 2016 ').getTime(), new Date('Mon May 09 2016 ').getTime(),
                new Date('Tue May 10 2016 ').getTime(), new Date('Wed May 11 2016 ').getTime(),
                new Date('Thu May 12 2016 ').getTime(), new Date('Fri May 13 2016 ').getTime(),
                new Date('Sat May 14 2016 ').getTime(), new Date('Sun May 07 2017 ').getTime(),
                new Date('Mon May 08 2017 ').getTime(), new Date('Tue May 09 2017 ').getTime(),
                new Date('Wed May 10 2017 ').getTime(), new Date('Thu May 11 2017 ').getTime(),
                new Date('Fri May 12 2017 ').getTime(), new Date('Sat May 13 2017 ').getTime(),
                new Date('Sun May 13 2018 ').getTime(), new Date('Mon May 14 2018 ').getTime(),
                new Date('Tue May 15 2018 ').getTime(), new Date('Wed May 16 2018 ').getTime(),
                new Date('Thu May 17 2018 ').getTime(), new Date('Fri May 18 2018 ').getTime(),
                new Date('Sat May 19 2018 ').getTime(), new Date('Sun May 12 2019 ').getTime(),
                new Date('Mon May 13 2019 ').getTime(), new Date('Tue May 14 2019 ').getTime(),
                new Date('Wed May 15 2019 ').getTime(), new Date('Thu May 16 2019 ').getTime(),
                new Date('Fri May 17 2019 ').getTime(), new Date('Sat May 18 2019 ').getTime(),
                new Date('Sun May 10 2020 ').getTime()]));
    });
    it('Default - WeekNo - without Day', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=1', null, 0)))
            .toBe(JSON.stringify([
                new Date('Sun Dec 28 2014 ').getTime(), new Date('Mon Dec 29 2014 ').getTime(),
                new Date('Tue Dec 30 2014 ').getTime(), new Date('Wed Dec 31 2014 ').getTime(),
                new Date('Thu Jan 01 2015 ').getTime(), new Date('Fri Jan 02 2015 ').getTime(),
                new Date('Sat Jan 03 2015 ').getTime(), new Date('Sun Dec 27 2015 ').getTime(),
                new Date('Mon Dec 28 2015 ').getTime(), new Date('Tue Dec 29 2015 ').getTime(),
                new Date('Wed Dec 30 2015 ').getTime(), new Date('Thu Dec 31 2015 ').getTime(),
                new Date('Fri Jan 01 2016 ').getTime(), new Date('Sat Jan 02 2016 ').getTime(),
                new Date('Sun Dec 25 2016 ').getTime(), new Date('Mon Dec 26 2016 ').getTime(),
                new Date('Tue Dec 27 2016 ').getTime(), new Date('Wed Dec 28 2016 ').getTime(),
                new Date('Thu Dec 29 2016 ').getTime(), new Date('Fri Dec 30 2016 ').getTime(),
                new Date('Sat Dec 31 2016 ').getTime(), new Date('Sun Dec 25 2016 ').getTime(),
                new Date('Mon Dec 26 2016 ').getTime(), new Date('Tue Dec 27 2016 ').getTime(),
                new Date('Wed Dec 28 2016 ').getTime(), new Date('Thu Dec 29 2016 ').getTime(),
                new Date('Fri Dec 30 2016 ').getTime(), new Date('Sat Dec 31 2016 ').getTime(),
                new Date('Sun Dec 25 2016 ').getTime(), new Date('Mon Dec 26 2016 ').getTime(),
                new Date('Tue Dec 27 2016 ').getTime(), new Date('Wed Dec 28 2016 ').getTime(),
                new Date('Thu Dec 29 2016 ').getTime(), new Date('Fri Dec 30 2016 ').getTime(),
                new Date('Sat Dec 31 2016 ').getTime(), new Date('Sun Dec 25 2016 ').getTime(),
                new Date('Mon Dec 26 2016 ').getTime(), new Date('Tue Dec 27 2016 ').getTime(),
                new Date('Wed Dec 28 2016 ').getTime(), new Date('Thu Dec 29 2016 ').getTime(),
                new Date('Fri Dec 30 2016 ').getTime(), new Date('Sat Dec 31 2016 ').getTime(),
                new Date('Sun Dec 25 2016 ').getTime()]));
    });
    it('Default - WeekNo - without Day max week no', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53', null, 1)))
            .toBe(JSON.stringify([
                new Date('Mon Dec 29 2014 ').getTime(), new Date('Tue Dec 30 2014 ').getTime(),
                new Date('Wed Dec 31 2014 ').getTime(), new Date('Thu Jan 01 2015 ').getTime(),
                new Date('Fri Jan 02 2015 ').getTime(), new Date('Sat Jan 03 2015 ').getTime(),
                new Date('Sun Jan 04 2015 ').getTime(), new Date('Mon Dec 26 2016 ').getTime(),
                new Date('Tue Dec 27 2016 ').getTime(), new Date('Wed Dec 28 2016 ').getTime(),
                new Date('Thu Dec 29 2016 ').getTime(), new Date('Fri Dec 30 2016 ').getTime(),
                new Date('Sat Dec 31 2016 ').getTime(), new Date('Sun Jan 01 2017 ').getTime(),
                new Date('Mon Dec 24 2018 ').getTime(), new Date('Tue Dec 25 2018 ').getTime(),
                new Date('Wed Dec 26 2018 ').getTime(), new Date('Thu Dec 27 2018 ').getTime(),
                new Date('Fri Dec 28 2018 ').getTime(), new Date('Sat Dec 29 2018 ').getTime(),
                new Date('Sun Dec 30 2018 ').getTime(), new Date('Mon Dec 30 2019 ').getTime(),
                new Date('Tue Dec 31 2019 ').getTime(), new Date('Wed Jan 01 2020 ').getTime(),
                new Date('Thu Jan 02 2020 ').getTime(), new Date('Fri Jan 03 2020 ').getTime(),
                new Date('Sat Jan 04 2020 ').getTime(), new Date('Sun Jan 05 2020 ').getTime(),
                new Date('Mon Dec 27 2021 ').getTime(), new Date('Tue Dec 28 2021 ').getTime(),
                new Date('Wed Dec 29 2021 ').getTime(), new Date('Thu Dec 30 2021 ').getTime(),
                new Date('Fri Dec 31 2021 ').getTime(), new Date('Sat Jan 01 2022 ').getTime(),
                new Date('Sun Jan 02 2022 ').getTime(), new Date('Mon Dec 25 2023 ').getTime(),
                new Date('Tue Dec 26 2023 ').getTime(), new Date('Wed Dec 27 2023 ').getTime(),
                new Date('Thu Dec 28 2023 ').getTime(), new Date('Fri Dec 29 2023 ').getTime(),
                new Date('Sat Dec 30 2023 ').getTime(), new Date('Sun Dec 31 2023 ').getTime(),
                new Date('Mon Dec 23 2024 ').getTime()]));
    });
});
describe('Schedule - recurrence Freq- YEARLY- No End date', () => {
    let startDate: Date = new Date(1399314600000);
    it('Default - ByDay', () => {
        expect(JSON.stringify(generate(startDate, 'FREQ=YEARLY;BYWEEKNO=53;UNTIL=20140229T000000Z', null, 1)))
            .toBe(JSON.stringify([]));
    });
});