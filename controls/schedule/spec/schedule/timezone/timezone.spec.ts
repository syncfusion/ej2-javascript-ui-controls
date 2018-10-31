/**
 * Util spec
 */
import { Timezone } from '../../../src/schedule/timezone/timezone';
describe('Timezone module', () => {
    let timezone: Timezone;
    beforeAll(() => {
        timezone = new Timezone();
    });
    it('add and remove timezone to date', () => {
        let date: Date = new Date(2017, 9, 5);
        let fromDate: Date = timezone.add(new Date(2017, 9, 5), 'America/New_York');
        let toDate: Date = timezone.remove(fromDate, 'America/New_York');
        expect(date.toISOString()).toEqual(toDate.toISOString());
    });
});
