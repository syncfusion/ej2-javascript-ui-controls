/**
 * Util spec
 */
import { Timezone } from '../../../src/schedule/timezone/timezone';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

describe('Timezone module', () => {
    let timezone: Timezone;
    beforeAll(() => {
        timezone = new Timezone();

        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    it('add and remove timezone to date', () => {
        let date: Date = new Date(2017, 9, 5);
        let fromDate: Date = timezone.add(new Date(2017, 9, 5), 'America/New_York');
        let toDate: Date = timezone.remove(fromDate, 'America/New_York');
        expect(date.toISOString()).toEqual(toDate.toISOString());
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
