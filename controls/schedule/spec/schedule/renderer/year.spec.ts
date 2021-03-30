/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule Week view spec
 */
import { Schedule, ScheduleModel, Year, TimelineYear } from '../../../src/schedule/index';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Year, TimelineYear);

describe('Schedule year view', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                views: [
                    { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                selectedDate: new Date(2021, 1, 24)
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-year-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-year');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(504);
        });

        it('check header elements', () => {
            expect(schObj.element.querySelectorAll('.e-month-calendar').length).toEqual(12);
            expect((schObj.element.querySelectorAll('.e-header')[0] as HTMLElement).innerHTML)
                .toEqual('<div class="e-day e-title">January</div>');
            expect(schObj.element.querySelectorAll('.e-week-header').length).toEqual(12);
        });

        it('work cells', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('role')).toEqual('gridcell');
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('aria-selected')).toEqual('false');
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('data-date')).toEqual(new Date(2020, 11, 27).getTime().toString());
            expect(schObj.element.querySelectorAll('.e-work-cells')[0].innerHTML).toEqual('<span class="e-day">27</span>');
        });

        it('check week number', () => {
            schObj.showWeekNumber = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number').length).toEqual(72);
            expect(schObj.element.querySelectorAll('.e-week-number')[0].getAttribute('role')).toEqual('gridcell');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].getAttribute('title')).toEqual('Week 1');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toEqual('1');
        });

        it('cell click', () => {
            (schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement).click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.firstElementChild.classList.contains('e-more-event-popup')).toBeTruthy();
            expect(schObj.element.querySelector('.e-more-event-popup').firstElementChild.classList.contains('e-more-event-header')).toBeTruthy();
            const moreEventHeader: HTMLElement = schObj.element.querySelector('.e-more-event-header');
            expect(moreEventHeader.firstElementChild.classList.contains('e-more-event-close')).toBeTruthy();
            expect(moreEventHeader.firstElementChild.innerHTML).toEqual('<span class="e-btn-icon e-icons e-close-icon"></span>');
            expect(moreEventHeader.lastElementChild.classList.contains('e-more-event-date-header')).toBeTruthy();
            const moreDateHeader: HTMLElement = schObj.element.querySelector('.e-more-event-date-header');
            expect(moreDateHeader.firstElementChild.classList.contains('e-header-day')).toBeTruthy();
            expect(moreDateHeader.firstElementChild.innerHTML).toEqual('Sun');
            expect(moreDateHeader.lastElementChild.classList.contains('e-header-date')).toBeTruthy();
            expect(moreDateHeader.lastElementChild.innerHTML).toEqual('27');
            expect(moreDateHeader.lastElementChild.getAttribute('tabindex')).toEqual('0');
            expect(moreDateHeader.lastElementChild.getAttribute('data-date')).toEqual(new Date(2020, 11, 27).getTime().toString());
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
