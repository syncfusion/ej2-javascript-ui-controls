/**
 * Util spec
 */
import * as util from '../../../src/schedule/base/util';
describe('Util module', () => {
    it('Week first date', () => {
        let weekFirstDate: Date = util.getWeekFirstDate(new Date(2017, 9, 5), 0);
        expect(weekFirstDate.getTime()).toBe(new Date(2017, 9, 1).getTime());
    });
    it('Week first date when dayOfWeek present', () => {
        let weekFirstDate: Date = util.getWeekFirstDate(new Date(2017, 9, 5), 3);
        expect(weekFirstDate.getTime()).toBe(new Date(2017, 9, 4).getTime());
    });
    it('First date of month', () => {
        let weekFirstDate: Date = util.firstDateOfMonth(new Date(2017, 9, 5));
        expect(weekFirstDate.getTime()).toBe(new Date(2017, 9, 1).getTime());
    });
    it('Last date of month', () => {
        let weekFirstDate: Date = util.lastDateOfMonth(new Date(2017, 9, 5));
        expect(weekFirstDate.getTime()).toBe(new Date(2017, 9, 31).getTime());
    });
    it('Get week number', () => {
        expect(util.getWeekNumber(new Date(2017, 9, 5))).toEqual(40);
    });
    it('Add millisecods to date', () => {
        let date: Date = new Date(2017, 9, 5, 4, 30);
        util.setTime(date, 5400000);
        expect(date).toEqual(new Date(2017, 9, 5, 6));
    });
    it('Reset date to zero hours', () => {
        expect(util.resetTime(new Date(2017, 9, 5, 4, 30))).toEqual(new Date(2017, 9, 5));
    });
    it('Get date in millisecods', () => {
        expect(util.getDateInMs(new Date(2017, 9, 5, 4, 30))).toEqual(16200000);
    });
    it('Add days to date', () => {
        expect(util.addDays(new Date(2017, 9, 5), 5)).toEqual(new Date(2017, 9, 10));
    });
    it('Add months to date', () => {
        expect(util.addMonths(new Date(2017, 9, 5), 1)).toEqual(new Date(2017, 10, 5));
    });
    it('Add months to date when max days 28', () => {
        expect(util.addMonths(new Date(2017, 0, 30), 1)).toEqual(new Date(2017, 1, 28));
    });
    it('Add years to date', () => {
        expect(util.addYears(new Date(2017, 0, 30), 1)).toEqual(new Date(2018, 0, 30));
    });
    it('Get max days in month', () => {
        expect(util.getMaxDays(new Date(2017, 0, 30))).toEqual(31);
    });
    it('Get max days in february month', () => {
        expect(util.getMaxDays(new Date(2017, 1, 15))).toEqual(28);
    });
    it('Get max days in february month leap year', () => {
        expect(util.getMaxDays(new Date(2016, 1, 15))).toEqual(29);
    });
});
