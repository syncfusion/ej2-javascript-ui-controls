import { Browser } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, TimelineViews, TimelineYear } from '../../../src/schedule/index';
import { yearDataGenerator, timelineResourceData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

/**
 * Year view events rendering spec
 */

Schedule.Inject(Day, TimelineViews, TimelineYear);

describe('Year and TimelineYear View Event Render Module', () => {
    beforeAll(() => {
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    xdescribe('Testing the year view rendering', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let yearData: Object[] = yearDataGenerator(500);
            let model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2019, 0, 1),
                views: [
                    // { option: 'Day' }, { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal' },
                    { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }
                ]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            let monthCalendar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-calendar');
            expect(monthCalendar.length).toEqual(12);
            let eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toBeGreaterThan(0);
            expect(schObj.element.offsetHeight).toEqual(580);
        });

        it('weekNumber elements checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                let weekNumber: NodeListOf<Element> = schObj.element.querySelectorAll('.e-week-number');
                expect(weekNumber.length).toEqual(72);
                done();
            };
            schObj.showWeekNumber = true;
            schObj.dataBind();
        });

        it('schedule height checking with DOM elements', () => {
            schObj.dataBound = () => expect(schObj.element.offsetHeight).toEqual(500);
            schObj.height = '500px';
            schObj.dataBind();
        });

        it('year range checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2020');
                done();
            };
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2019');
            util.triggerMouseEvent(schObj.element.querySelector('.e-schedule-toolbar .e-next'), 'click');
        });

        it('morepopup events checking', () => {
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells:not(.e-other-month)'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
    });

    xdescribe('Testing the year view rendering in mobile with resources', () => {
        let schObj: Schedule;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = {
                height: '500px', width: '300px', selectedDate: new Date(2018, 0, 1),
                // views: [{ option: 'Year', isSelected: true }, { option: 'TimelineYear' }]
            };
            schObj = util.createGroupSchedule(1, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('DOM elements checking', () => {
            let monthCalendar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-calendar');
            expect(monthCalendar.length).toEqual(12);
            let eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toBeGreaterThan(0);
            let resourceToolbar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-schedule-resource-toolbar-container');
            expect(resourceToolbar.length).toEqual(1);
        });
    });

    describe('Testing the timelineyear view rendering with default orientation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let yearData: Object[] = yearDataGenerator(500);
            let model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineYear', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }
                ]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            let monthHeader: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-header');
            expect(monthHeader.length).toEqual(12);
            let headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(36);
            let totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(432);
            let currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(365);
            let otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(67);
            let workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(workCell.offsetWidth).toEqual(60);
            expect(workCell.offsetHeight).toEqual(70);
        });

        it('decade calendar testing', () => {
            let dateRange: HTMLElement = schObj.element.querySelector('.e-date-range') as HTMLElement;
            util.triggerMouseEvent(dateRange, 'click');
            let headerPopup: HTMLElement = schObj.element.querySelector('.e-schedule .e-header-popup') as HTMLElement;
            expect(headerPopup.classList.contains('e-popup-open')).toEqual(true);
            expect(headerPopup.classList.contains('e-popup-close')).toEqual(false);
            let headerCalendar: HTMLElement = schObj.element.querySelector('.e-schedule .e-header-calendar') as HTMLElement;
            expect(headerCalendar.querySelector('.e-day.e-title').innerHTML).toEqual('2010 - 2019');
            util.triggerMouseEvent(dateRange, 'click');
            expect(headerPopup.classList.contains('e-popup-open')).toEqual(false);
            expect(headerPopup.classList.contains('e-popup-close')).toEqual(true);
        });

        it('Scroll dimension checking', (done: DoneFn) => {
            let contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            contentWrap.scrollTo({ top: 100, left: 100, behavior: 'smooth' });
            setTimeout(
                () => {
                    expect(schObj.element.querySelector('.e-month-header-wrapper').scrollTop).toEqual(100);
                    expect(schObj.element.querySelector('.e-date-header-wrap').scrollLeft).toEqual(100);
                    done();
                },
                400);
        });
    });

    describe('Testing the timelineyear view rendering with resource in default orientation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineYear', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }
                ]
            };
            schObj = util.createGroupSchedule(2, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            let resourceCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells');
            expect(resourceCells.length).toEqual(5);
            let headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(0);
            let totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(36);
            let currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(36);
            let otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(0);
        });
    });

    describe('Testing the timelineyear view rendering with vertical orientation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let yearData: Object[] = yearDataGenerator(500);
            let model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineYear', displayName: 'Horizontal' },
                    { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical', isSelected: true }
                ]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            let monthHeader: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-header');
            expect(monthHeader.length).toEqual(36);
            let headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(12);
            let totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(432);
            let currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(365);
            let otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(67);
            let workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(workCell.offsetWidth).toEqual(60);
            expect(workCell.offsetHeight).toEqual(70);
        });

        it('Current date testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-month-header.e-current-day').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-work-cells.e-current-day').length).toEqual(1);
                done();
            };
            expect(schObj.element.querySelectorAll('.e-month-header.e-current-day').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-work-cells.e-current-day').length).toEqual(0);
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });
    });

    describe('Testing the timelineyear view rendering with resource in vertical orientation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineYear', displayName: 'Horizontal' },
                    { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical', isSelected: true }
                ]
            };
            schObj = util.createGroupSchedule(2, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            let resourceCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap .e-resource-cells');
            expect(resourceCells.length).toEqual(5);
            let headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(12);
            let totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(60);
            let currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(60);
            let otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(0);
        });
    });

    describe('Testing the long spanned event in timeline year view horizontal orientation', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let yearData: Object[] = [{
                Id: 1,
                StartTime: new Date(2019, 1, 1, 10, 0, 0),
                EndTime: new Date(2019, 5, 1, 10, 0, 0),
                IsAllDay: true
            }];
            let model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2019, 0, 1),
                views: [
                    // { option: 'Day' }, { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal' }
                ]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Testing long spanned event in horizontal year view', () => {
            expect(schObj.element.querySelectorAll('[data-id="Appointment_1"]').length).toEqual(5);
        });
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
