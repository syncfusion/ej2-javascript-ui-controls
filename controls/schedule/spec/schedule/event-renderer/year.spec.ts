/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, TimelineViews, TimelineYear, EventRenderedArgs } from '../../../src/schedule/index';
import { yearDataGenerator, timelineResourceData, defaultData, timelineData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

/**
 * Year view events rendering spec
 */

Schedule.Inject(Day, TimelineViews, TimelineYear);

describe('Year and TimelineYear View Event Render Module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Testing the year view rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2016, 0, 1),
                views: [{ option: 'Year' }]
            };
            schObj = util.createSchedule(model, defaultData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            const monthCalendar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-calendar');
            expect(monthCalendar.length).toEqual(12);
            const eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toEqual(0);
            expect(schObj.element.offsetHeight).toEqual(580);
        });

        it('weekNumber elements checking in DOM', (done: DoneFn) => {
            schObj.dataBound = () => {
                const weekNumber: NodeListOf<Element> = schObj.element.querySelectorAll('.e-week-number');
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
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2017');
                done();
            };
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2016');
            util.triggerMouseEvent(schObj.element.querySelector('.e-schedule-toolbar .e-next'), 'click');
        });

        it('year view appointments checking', () => {
            const eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toEqual(28);
        });

        it('more popup events checking', () => {
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells:not(.e-other-month)'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('Testing the min/max date in year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Test event-1',
                StartTime: new Date(2022, 0, 1),
                EndTime: new Date(2022, 0, 1)
            }, {
                Id: 2,
                Subject: 'Test event-2',
                StartTime: new Date(2022, 0, 2),
                EndTime: new Date(2022, 0, 2)
            }, {
                Id: 3,
                Subject: 'Test event-3',
                StartTime: new Date(2022, 0, 5),
                EndTime: new Date(2022, 0, 5)
            }, {
                Id: 4,
                Subject: 'Test event-4',
                StartTime: new Date(2022, 0, 16),
                EndTime: new Date(2022, 0, 16)
            }, {
                Id: 5,
                Subject: 'Test event-5',
                StartTime: new Date(2022, 0, 30),
                EndTime: new Date(2022, 0, 30)
            }];
            const model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2022, 0, 1),
                views: [{ option: 'Year' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('year view min/maxDate checking', (done: Function) => {
            schObj.dataBound = function () {
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].firstElementChild as HTMLElement, 'click');
                expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
                expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].classList.contains('e-disable-dates')).toBe(true);
                expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].children.length).toEqual(1);
                util.triggerMouseEvent(schObj.element.querySelectorAll('.e-cell.e-work-cells')[21].firstElementChild as HTMLElement, 'click');
                expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
                const appointment: HTMLElement = schObj.element.querySelectorAll('.e-cell.e-work-cells')[21].children[1] as HTMLElement;
                expect(appointment.classList.contains('e-appointment')).toEqual(true);
                done();
            };
            const monthCalendar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-calendar');
            expect(monthCalendar.length).toEqual(12);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-cell.e-work-cells')[21].firstElementChild as HTMLElement, 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            const appointment: HTMLElement = schObj.element.querySelectorAll('.e-cell.e-work-cells')[21].children[1] as HTMLElement;
            expect(appointment.classList.contains('e-appointment')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].firstElementChild as HTMLElement, 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].classList.contains('e-disable-dates')).toBe(false);
            expect(schObj.element.querySelectorAll('.e-cell.e-work-cells')[6].children[1].classList.contains('e-appointment')).toEqual(true);
            schObj.minDate = new Date(2022, 0, 15);
            schObj.dataBind();
            schObj.maxDate = new Date(2022, 1, 15);
            schObj.dataBind();
        });
    });

    describe('Testing the min/max dates with resources in Timeline year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Events - Within a day',
                StartTime: new Date(2018, 4, 1, 10, 0),
                EndTime: new Date(2018, 4, 1, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 2,
                Subject: 'Events - Within a day',
                StartTime: new Date(2018, 3, 1, 10, 0),
                EndTime: new Date(2018, 3, 1, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 3,
                Subject: 'Events - Within a day',
                StartTime: new Date(2018, 4, 1, 10, 0),
                EndTime: new Date(2018, 4, 1, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 4,
                Subject: 'Events - In multiple day',
                StartTime: new Date(2018, 4, 2, 10, 0),
                EndTime: new Date(2018, 4, 8, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            }
            ];
            const model: ScheduleModel = {
                width: '900px', height: '800px', selectedDate: new Date(2018, 0, 1),
                views: [{ option: 'TimelineYear' },
                { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createGroupSchedule(1, model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Horizontal year checking', (done: Function) => {
            schObj.dataBound = function () {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            schObj.minDate = new Date(2018, 3, 30);
            schObj.dataBind();
            schObj.maxDate = new Date(2018, 5, 30);
            schObj.dataBind();
            done();
        });
        it('Vertical year checking', (done: Function) => {
            schObj.dataBound = function () {
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-icon-timeline-year-vertical'), 'click');
            done();
        });
    });

    describe('Testing the min/max dates without resources in Timeline year view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Test event-1',
                StartTime: new Date(2022, 1, 1),
                EndTime: new Date(2022, 1, 1)
            }, {
                Id: 2,
                Subject: 'Test event-2',
                StartTime: new Date(2022, 1, 2),
                EndTime: new Date(2022, 1, 2)
            }, {
                Id: 3,
                Subject: 'Test event-3',
                StartTime: new Date(2022, 2, 5),
                EndTime: new Date(2022, 2, 5)
            }, {
                Id: 4,
                Subject: 'Test event-4',
                StartTime: new Date(2022, 2, 16),
                EndTime: new Date(2022, 2, 16)
            }, {
                Id: 5,
                Subject: 'Test event-5',
                StartTime: new Date(2022, 2, 30),
                EndTime: new Date(2022, 2, 30)
            }];
            const model: ScheduleModel = {
                width: '900px', height: '1000px', selectedDate: new Date(2022, 0, 1),
                views: [{ option: 'TimelineYear' },
                { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });


        it('Horizontal year checking', (done: Function) => {
            schObj.dataBound = function () {
                expect(schObj.element.querySelectorAll('.e-appointment-wrapper')[0].childNodes.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-cells')[106].classList.contains('e-disable-dates')).toBe(true);
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_2"]'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            expect(schObj.element.querySelectorAll('.e-work-cells')[111].classList.contains('e-disable-dates')).toBe(false);
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            schObj.minDate = new Date(2022, 1, 28);
            schObj.dataBind();
            schObj.maxDate = new Date(2022, 2, 30);
            schObj.dataBind();
            done();
        });
        it('Vertical year checking', (done: Function) => {
            schObj.dataBound = function () {
                expect(schObj.element.querySelectorAll('.e-appointment-wrapper')[0].childNodes.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-cells')[106].classList.contains('e-disable-dates')).toBe(true);
                util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_3"]'), 'click');
                expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-icon-timeline-year-vertical'), 'click');
            done();
        });
    });

    describe('Testing the year view rendering in mobile with resources', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                height: '500px', width: '300px', selectedDate: new Date(2018, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createGroupSchedule(1, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('DOM elements checking', () => {
            const eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toBeGreaterThan(0);
            const resourceToolbar: NodeListOf<Element> = schObj.element.querySelectorAll('.e-schedule-resource-toolbar-container');
            expect(resourceToolbar.length).toEqual(1);
        });
    });

    describe('Testing the more indicators in mobile with resources', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Events - Within a day',
                StartTime: new Date(2018, 4, 1, 10, 0),
                EndTime: new Date(2018, 4, 1, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 2,
                Subject: 'Events - Within a day',
                StartTime: new Date(2018, 4, 1, 10, 0),
                EndTime: new Date(2018, 4, 1, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 3,
                Subject: 'Events - In multiple day',
                StartTime: new Date(2018, 4, 2, 10, 0),
                EndTime: new Date(2018, 4, 8, 12, 30),
                IsAllDay: false,
                FId: 1,
                HallId: 1,
                RoomId: 1,
                OwnerId: 1
            }
            ];
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2018, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createGroupSchedule(1, model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('More indicators checking', () => {
            expect(schObj.element.querySelectorAll('.e-more-indicator').length).toEqual(1);
            expect(schObj.element.querySelector('.e-more-indicator').getAttribute('data-count')).toBe('1');
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            util.triggerMouseEvent(moreIndicator, 'click');
            const MorePopupWrapper: HTMLElement = document.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(MorePopupWrapper.classList.contains('e-popup-open')).toEqual(true);
            expect(MorePopupWrapper.classList.contains('e-popup-close')).toEqual(false);
            expect(document.querySelector('.e-more-appointment-wrapper').childElementCount).toEqual(2);
            util.triggerMouseEvent(document.querySelector('.e-more-event-close'), 'click');
            expect(MorePopupWrapper.classList.contains('e-popup-open')).toEqual(false);
            expect(MorePopupWrapper.classList.contains('e-popup-close')).toEqual(true);
        });

        it('Spanned appointment checking in mobile mode', () => {
            const spannedApp: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement
            expect(spannedApp.offsetWidth).toEqual(700);
            expect(spannedApp.offsetTop).toEqual(327);
        });
    });

    describe('Testing the timeline year view appointments rendering without resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2018, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createSchedule(model, timelineData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Rendered appointments elements checking', () => {
            const appointments: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(appointments.length).toEqual(8);
            const recurrenceApps: NodeListOf<Element> = schObj.element.querySelectorAll('[data-id="Appointment_18"]');
            expect(recurrenceApps.length).toEqual(2);
        });

        it('Enabling rowAutoHeight in timeline year horizontal view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const appointments: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toEqual(35);
                const allDayApp: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]');
                expect(allDayApp.offsetWidth).toEqual(100);
                expect(allDayApp.offsetTop).toEqual(496);
                const allDayAppWithNonEqualDates: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]');
                expect(allDayAppWithNonEqualDates.offsetWidth).toEqual(500);
                expect(allDayAppWithNonEqualDates.offsetTop).toEqual(252);
                const spannedApp: HTMLElement = schObj.element.querySelector('[data-id="Appointment_6"]');
                expect(spannedApp.offsetWidth).toEqual(700);
                expect(spannedApp.offsetTop).toEqual(474);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Testing the timeline year view appointments rendering with resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2018, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createGroupSchedule(1, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Rendered appointments elements checking', () => {
            const appointments: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(appointments.length).toEqual(20);
        });
    });

    describe('Testing the timeline year view rendering with default orientation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = yearDataGenerator(500);
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            const monthHeader: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-header');
            expect(monthHeader.length).toEqual(12);
            const headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(36);
            const totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(432);
            const currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(365);
            const otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(67);
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(workCell.offsetWidth).toEqual(100);
            expect(workCell.offsetHeight).toEqual(75);
        });

        it('decade calendar testing', () => {
            const dateRange: HTMLElement = schObj.element.querySelector('.e-date-range') as HTMLElement;
            util.triggerMouseEvent(dateRange, 'click');
            const headerPopup: HTMLElement = schObj.element.querySelector('.e-schedule .e-header-popup') as HTMLElement;
            expect(headerPopup.classList.contains('e-popup-open')).toEqual(true);
            expect(headerPopup.classList.contains('e-popup-close')).toEqual(false);
            const headerCalendar: HTMLElement = schObj.element.querySelector('.e-schedule .e-header-calendar') as HTMLElement;
            expect(headerCalendar.querySelector('.e-day.e-title').innerHTML).toEqual('2010 - 2019');
            util.triggerMouseEvent(dateRange, 'click');
            expect(headerPopup.classList.contains('e-popup-open')).toEqual(false);
            expect(headerPopup.classList.contains('e-popup-close')).toEqual(true);
        });

        it('Scroll dimension checking', (done: DoneFn) => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
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

    describe('Testing the timeline year view rendering with resource in default orientation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear' }]
            };
            schObj = util.createGroupSchedule(2, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            const resourceCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells');
            expect(resourceCells.length).toEqual(5);
            const headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(0);
            const totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(36);
            const currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(36);
            const otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(0);
        });
    });

    describe('Testing the timeline year view rendering with vertical orientation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = yearDataGenerator(500);
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            const monthHeader: NodeListOf<Element> = schObj.element.querySelectorAll('.e-month-header');
            expect(monthHeader.length).toEqual(36);
            const headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(12);
            const totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(432);
            const currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(365);
            const otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(67);
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(workCell.offsetWidth).toEqual(100);
            expect(workCell.offsetHeight).toEqual(75);
        });

        it('ScrollTo check', (done: DoneFn) => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(0);
            schObj.scrollTo(null, new Date(2019, 1, 3));
            setTimeout(
                () => {
                    expect(contentArea.scrollLeft).toEqual(100);
                    expect(contentArea.scrollTop).toEqual(525);
                    done();
                },
                400);
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

    describe('Testing the timeline year view rendering with resource in vertical orientation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createGroupSchedule(2, model, timelineResourceData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('DOM elements checking', () => {
            const resourceCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap .e-resource-cells');
            expect(resourceCells.length).toEqual(5);
            const headerCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells');
            expect(headerCells.length).toEqual(12);
            const totalWorkCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(totalWorkCells.length).toEqual(60);
            const currentMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells:not(.e-other-month)');
            expect(currentMonthCells.length).toEqual(60);
            const otherMonthCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells.e-other-month');
            expect(otherMonthCells.length).toEqual(0);
        });
    });

    describe('Testing the long spanned event in timeline year view horizontal orientation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                StartTime: new Date(2019, 1, 1, 10, 0, 0),
                EndTime: new Date(2019, 5, 1, 10, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear', displayName: 'Horizontal' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Testing long spanned event in horizontal year view', () => {
            expect(schObj.element.querySelectorAll('[data-id="Appointment_1"]').length).toEqual(5);
        });

        it('ScrollTo check', (done: DoneFn) => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(0);
            schObj.scrollTo(null, new Date(2019, 1, 3));
            setTimeout(
                () => {
                    expect(contentArea.scrollLeft).toEqual(700);
                    done();
                },
                400);
        });
    });

    describe('Testing the Appointment rendering for longer appointments renders after shorter one', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Short Event',
                StartTime: new Date(2019, 1, 1, 10, 0, 0),
                EndTime: new Date(2019, 1, 5, 10, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                width: '500px', selectedDate: new Date(2019, 0, 1),
                views: [{ option: 'TimelineYear', displayName: 'Horizontal' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before rendering longer appointments', () => {
            expect(schObj.element.querySelectorAll('.e-more-indicator').length).toEqual(0);
        });

        it('After rendering longer appointment checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-more-indicator').length).toEqual(9);
                done();
            };
            schObj.addEvent([{
                Id: 2,
                Subject: 'Long Event',
                StartTime: new Date(2019, 1, 2, 10, 0, 0),
                EndTime: new Date(2019, 1, 10, 10, 0, 0),
                IsAllDay: true
            }]);
        });
    });

    describe('EJ2-56503 - Timeline year view event rendered arguments checking', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 8, 10),
            EndTime: new Date(2017, 10, 8, 12)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: ['TimelineYear'],
                height: 'auto', width: '100%',
                selectedDate: new Date(2017, 10, 6)
            };
            schObj = util.createSchedule(model, sampleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking event rendered event args', (done: DoneFn) => {
            schObj.eventRendered = (args: EventRenderedArgs) => {
                expect((args.data[schObj.eventFields.startTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 10).getTime());
                expect((args.data[schObj.eventFields.endTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 12).getTime());
                done();
            };
            schObj.refreshEvents();
        });
    });

    describe('EJ2-58944 - Horizontal timeline year view event rendered arguments checking', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Normal event',
            StartTime: new Date(2017, 10, 8, 10),
            EndTime: new Date(2017, 10, 8, 12)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                views: ['TimelineYear'],
                height: 'auto', width: '100%',
                selectedDate: new Date(2017, 10, 31)
            };
            schObj = util.createSchedule(model, sampleData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking event rendered event args', (done: DoneFn) => {
            schObj.eventRendered = (args: EventRenderedArgs) => {
                expect((args.data[schObj.eventFields.startTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 10).getTime());
                expect((args.data[schObj.eventFields.endTime] as Date).getTime()).toEqual(new Date(2017, 10, 8, 12).getTime());
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            expect(schObj.eventsProcessed.length).toEqual(1);
            schObj.refreshEvents();
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
