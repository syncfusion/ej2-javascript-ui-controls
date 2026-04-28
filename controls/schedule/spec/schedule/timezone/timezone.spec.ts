/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Util spec
 */
import { Timezone } from '../../../src/schedule/timezone/timezone';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

describe('Timezone module', () => {
    let timezone: Timezone;
    beforeAll(() => {
        timezone = new Timezone();

        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    it('add and remove timezone to date', () => {
        const date: Date = new Date(2017, 9, 5);
        const fromDate: Date = timezone.add(new Date(2017, 9, 5), 'America/New_York');
        const toDate: Date = timezone.remove(fromDate, 'America/New_York');
        expect(date.toISOString()).toEqual(toDate.toISOString());
    });

    it('checking negative timezone', () => {
        const offset: number = timezone.offset(new Date(2017, 9, 5), 'IST');
        expect(offset).toEqual(-330);
        const invalidOffset: number = timezone.offset(new Date('test'), 'UTC');
        expect(invalidOffset).toEqual(0);
    });

    it('window Intl test case checking', () => {
        const intl: any = (window as any).Intl;
        (window as any).Intl = null;
        expect(timezone.getLocalTimezoneName()).toEqual('UTC');
        (window as any).Intl = intl;

        const resolvedOptions: any = Intl.DateTimeFormat.prototype.resolvedOptions;
        const tzData: Record<string, any> = { 'timeZone': null };
        Intl.DateTimeFormat.prototype.resolvedOptions = () => tzData as any;
        expect(timezone.getLocalTimezoneName()).toEqual('UTC');
        Intl.DateTimeFormat.prototype.resolvedOptions = resolvedOptions;
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
