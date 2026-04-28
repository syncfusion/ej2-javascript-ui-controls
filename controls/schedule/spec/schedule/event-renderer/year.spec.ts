/* eslint-disable @typescript-eslint/no-explicit-any */
import { Browser, createElement, remove } from '@syncfusion/ej2-base';
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
                views: [{ option: 'TimelineYear' }, { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createGroupSchedule(1, model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Horizontal year checking', (done: Function) => {
            schObj.dataBound = () => {
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
            schObj.dataBound = () => {
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
                views: [{ option: 'TimelineYear' }, { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }]
            };
            schObj = util.createSchedule(model, yearData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });


        it('Horizontal year checking', (done: Function) => {
            schObj.dataBound = () => {
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
            schObj.dataBound = () => {
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
            const spannedApp: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
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
            expect(appointments.length).toEqual(7);
            const recurrenceApps: NodeListOf<Element> = schObj.element.querySelectorAll('[data-id="Appointment_18"]');
            expect(recurrenceApps.length).toEqual(2);
        });

        it('Enabling rowAutoHeight in timeline year horizontal view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const appointments: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toEqual(35);
                const allDayApp: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]');
                expect(allDayApp.offsetWidth).toEqual(100);
                expect(allDayApp.offsetTop).toEqual(518);
                const allDayAppWithNonEqualDates: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]');
                expect(allDayAppWithNonEqualDates.offsetWidth).toEqual(500);
                expect(allDayAppWithNonEqualDates.offsetTop).toEqual(252);
                const spannedApp: HTMLElement = schObj.element.querySelector('[data-id="Appointment_6"]');
                expect(spannedApp.offsetWidth).toEqual(700);
                expect(spannedApp.offsetTop).toEqual(496);
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

    describe('EJ2-70151 - Event misalignment in timeline year view', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Bering Sea Gold',
                StartTime: new Date(2023, 0, 10),
                EndTime: new Date(2023, 0, 12),
                IsAllDay: true,
                TaskId: 1
            }, {
                Id: 2,
                Subject: 'Guitar Class',
                StartTime: new Date(2023, 0, 10),
                EndTime: new Date(2023, 0, 11),
                IsAllDay: false,
                TaskId: 2
            }, {
                Id: 3,
                Subject: 'Meeting',
                StartTime: new Date(2023, 0, 11),
                EndTime: new Date(2023, 0, 13),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 4,
                Subject: 'Brazil - Mexico',
                StartTime: new Date(2023, 1, 9),
                EndTime: new Date(2023, 1, 11),
                IsAllDay: true,
                TaskId: 4
            }, {
                Id: 5,
                Subject: 'Traveling',
                StartTime: new Date(2023, 1, 9),
                EndTime: new Date(2023, 1, 11),
                IsAllDay: false,
                TaskId: 5
            }, {
                Id: 6,
                Subject: 'Maintenance',
                StartTime: new Date(2023, 1, 10),
                EndTime: new Date(2023, 1, 12),
                IsAllDay: false,
                TaskId: 1
            }, {
                Id: 7,
                Subject: 'Wedding Anniversary',
                StartTime: new Date(2023, 2, 8),
                EndTime: new Date(2023, 2, 10),
                IsAllDay: true,
                TaskId: 2
            }, {
                Id: 8,
                Subject: 'Farewell Celebration',
                StartTime: new Date(2023, 2, 8),
                EndTime: new Date(2023, 2, 10),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 9,
                Subject: 'Birthday Celebration',
                StartTime: new Date(2023, 2, 9),
                EndTime: new Date(2023, 2, 11),
                IsAllDay: false,
                TaskId: 4
            }, {
                Id: 10,
                Subject: 'Deadliest Catch',
                StartTime: new Date(2023, 3, 4),
                EndTime: new Date(2023, 3, 6),
                IsAllDay: true,
                TaskId: 5
            }, {
                Id: 11,
                Subject: 'Sports Day',
                StartTime: new Date(2023, 3, 4),
                EndTime: new Date(2023, 3, 6),
                IsAllDay: false,
                TaskId: 1
            }, {
                Id: 12,
                Subject: 'MoonShiners',
                StartTime: new Date(2023, 3, 5),
                EndTime: new Date(2023, 3, 7),
                IsAllDay: false,
                TaskId: 2
            }, {
                Id: 13,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 4, 11),
                EndTime: new Date(2023, 4, 13),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 14,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 4, 11),
                EndTime: new Date(2023, 4, 13),
                IsAllDay: false,
                TaskId: 4
            }, {
                Id: 15,
                Subject: 'Opening ceremony',
                StartTime: new Date(2023, 4, 12),
                EndTime: new Date(2023, 4, 14),
                IsAllDay: false,
                TaskId: 5
            }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 0, 1),
                views: [{ option: 'TimelineYear' }, { option: 'TimelineYear', displayName: 'Vertical', orientation: 'Vertical' }],
                height: '100%', width: '100%',
                rowAutoHeight: true,
                resources: [
                    {
                        field: 'TaskId', title: 'Category',
                        name: 'Categories',
                        dataSource: [
                            { text: 'Nancy', id: 1, color: '#df5286' },
                            { text: 'Steven', id: 2, color: '#7fa900' },
                            { text: 'Robert', id: 3, color: '#ea7a57' },
                            { text: 'Smith', id: 4, color: '#5978ee' },
                            { text: 'Michael', id: 5, color: '#df5286' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }
                ],
                eventSettings: { dataSource: sampleData },
                dataBound: () => {
                    util.disableScheduleAnimation(schObj);
                    done();
                }
            };
            const parentElement: HTMLElement = createElement('div', { id: 'ScheduleParent', styles: 'height: 1297px' });
            const schEle: HTMLElement = createElement('div', { id: 'Schedule' });
            parentElement.appendChild(schEle);
            schObj = new Schedule(model, schEle);
            document.body.appendChild(parentElement);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('ScheduleParent'));
        });
        it('checking events misalignment based on cell height and appointment top position', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements[11].offsetTop).toEqual(407);
            expect(eventElements[3].offsetTop).toEqual(139);
            expect(eventElements[6].offsetTop).toEqual(251);
            expect(eventElements[14].offsetTop).toEqual(519);
        });
        it('checking events misalignment based on cell height and appointment top position in vertical orientation', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements[0].offsetTop).toEqual(702);
                expect(eventElements[10].offsetTop).toEqual(836);
                expect(eventElements[19].offsetTop).toEqual(926);
                expect(eventElements[28].offsetTop).toEqual(1128);
                done();
            };
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-views')[1] as HTMLElement).click();
        });
    });
    describe('EJ2-70151 - Event misalignment in timeline year view with resources', () => {
        let schObj: Schedule;
        const sampleData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Bering Sea Gold',
                StartTime: new Date(2023, 0, 10),
                EndTime: new Date(2023, 0, 12),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 2,
                Subject: 'Guitar Class',
                StartTime: new Date(2023, 0, 10),
                EndTime: new Date(2023, 0, 11),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 3,
                Subject: 'Meeting',
                StartTime: new Date(2023, 0, 11),
                EndTime: new Date(2023, 0, 13),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 4,
                Subject: 'Brazil - Mexico',
                StartTime: new Date(2023, 1, 9),
                EndTime: new Date(2023, 1, 11),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 5,
                Subject: 'Traveling',
                StartTime: new Date(2023, 1, 9),
                EndTime: new Date(2023, 1, 11),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 6,
                Subject: 'Maintenance',
                StartTime: new Date(2023, 1, 10),
                EndTime: new Date(2023, 1, 12),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 7,
                Subject: 'Wedding Anniversary',
                StartTime: new Date(2023, 2, 8),
                EndTime: new Date(2023, 2, 10),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 8,
                Subject: 'Farewell Celebration',
                StartTime: new Date(2023, 2, 8),
                EndTime: new Date(2023, 2, 10),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 9,
                Subject: 'Birthday Celebration',
                StartTime: new Date(2023, 2, 9),
                EndTime: new Date(2023, 2, 11),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 10,
                Subject: 'Deadliest Catch',
                StartTime: new Date(2023, 3, 4),
                EndTime: new Date(2023, 3, 6),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 11,
                Subject: 'Sports Day',
                StartTime: new Date(2023, 3, 4),
                EndTime: new Date(2023, 3, 6),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 12,
                Subject: 'MoonShiners',
                StartTime: new Date(2023, 3, 5),
                EndTime: new Date(2023, 3, 7),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 13,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 4, 11),
                EndTime: new Date(2023, 4, 13),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 14,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 4, 11),
                EndTime: new Date(2023, 4, 13),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 15,
                Subject: 'Opening ceremony',
                StartTime: new Date(2023, 4, 12),
                EndTime: new Date(2023, 4, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 16,
                Subject: 'Alaska: The Last Frontier',
                StartTime: new Date(2023, 4, 12),
                EndTime: new Date(2023, 4, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 17,
                Subject: 'Close Encounters',
                StartTime: new Date(2023, 5, 12),
                EndTime: new Date(2023, 5, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 18,
                Subject: 'Basketball Practice',
                StartTime: new Date(2023, 5, 12),
                EndTime: new Date(2023, 5, 14),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 19,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 5, 12),
                EndTime: new Date(2023, 5, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 19,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 5, 12),
                EndTime: new Date(2023, 5, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 20,
                Subject: 'Basketball Practice',
                StartTime: new Date(2023, 3, 12),
                EndTime: new Date(2023, 3, 14),
                IsAllDay: true,
                TaskId: 3
            }, {
                Id: 21,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 3, 12),
                EndTime: new Date(2023, 3, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 22,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 3, 12),
                EndTime: new Date(2023, 3, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 23,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 2, 12),
                EndTime: new Date(2023, 2, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 24,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 2, 12),
                EndTime: new Date(2023, 2, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 25,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 1, 12),
                EndTime: new Date(2023, 1, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 26,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 1, 12),
                EndTime: new Date(2023, 1, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 27,
                Subject: 'Rugby Match',
                StartTime: new Date(2023, 0, 12),
                EndTime: new Date(2023, 0, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 28,
                Subject: 'Daily Planet',
                StartTime: new Date(2023, 0, 12),
                EndTime: new Date(2023, 0, 14),
                IsAllDay: false,
                TaskId: 3
            }, {
                Id: 29,
                Subject: 'Basketball Practice',
                StartTime: new Date(2023, 0, 12),
                EndTime: new Date(2023, 0, 14),
                IsAllDay: true,
                TaskId: 4
            }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 0, 1),
                views: [{ option: 'TimelineYear' }],
                height: '100%', width: '100%',
                rowAutoHeight: true,
                group: {
                    resources: ['Categories']
                },
                resources: [
                    {
                        field: 'TaskId', title: 'Category',
                        name: 'Categories',
                        dataSource: [
                            { text: 'Nancy', id: 1, color: '#df5286' },
                            { text: 'Steven', id: 2, color: '#7fa900' },
                            { text: 'Robert', id: 3, color: '#ea7a57' },
                            { text: 'Smith', id: 4, color: '#5978ee' },
                            { text: 'Michael', id: 5, color: '#df5286' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }
                ],
                dataBound: () => {
                    util.disableScheduleAnimation(schObj);
                    done();
                }
            };
            const parentElement: HTMLElement = createElement('div', { id: 'ScheduleParent', styles: 'height: 1297px; width: 1250px;' });
            const schEle: HTMLElement = createElement('div', { id: 'Schedule' });
            parentElement.appendChild(schEle);
            schObj = new Schedule(model, schEle);
            document.body.appendChild(parentElement);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('ScheduleParent'));
        });
        it('Checking  vertical scrollbar presence with rowAutoHeight in horizontal orientation', () => {
            const conWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(conWrap.offsetWidth > conWrap.clientWidth).toBeFalsy();
        });
        it('Checking rowAutoHeight with dynamic adding of vertical scrollbar in horizontal orientation', () => {
            schObj.dataBound = () => {
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                expect(eventElements[5].offsetLeft).toEqual(workCells[3].offsetLeft);
                expect(eventElements[5].offsetWidth).toEqual(workCells[3].offsetWidth);
                expect(eventElements[7].offsetLeft).toEqual(workCells[7].offsetLeft);
                expect(eventElements[7].offsetWidth).toEqual(workCells[7].offsetWidth);
            };
            schObj.eventSettings.dataSource = sampleData;
            schObj.dataBind();
        });
    });

    describe('Schedule Year view with maxEventsPerRow property when the row have enough height', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 10, 6),
                views: [
                    { option: 'Year' },
                    { option: 'TimelineYear', displayName: 'Horizontal Timeline Year', maxEventsPerRow: 2, isSelected: true },
                    { option: 'TimelineYear', displayName: 'Vertical Timeline Year', orientation: 'Vertical', maxEventsPerRow: 2 }
                ]
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('elements in DOM based on maxEventsPerRow', () => {
            const appointmentList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(2);
            (schObj.element.querySelectorAll('.e-more-indicator')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            const moreEvent: HTMLElement = (schObj.element.querySelector('.e-more-popup-wrapper').querySelector('.e-more-appointment-wrapper'));
            const moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            (schObj.element.querySelector('.e-close-icon') as HTMLElement).click();
        });

        it('elements in DOM with rowAutoHeight enabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(4);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();

        });
    });

    describe('Schedule Year view with maxEventsPerRow property when the row does not have enough height', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true
            }];
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 10, 6),
                views: [
                    { option: 'Year' },
                    { option: 'TimelineYear', displayName: 'Horizontal Timeline Year', maxEventsPerRow: 3, isSelected: true },
                    { option: 'TimelineYear', displayName: 'Vertical Timeline Year', orientation: 'Vertical', maxEventsPerRow: 3 }
                ]
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('elements in DOM based on maxEventsPerRow', () => {
            const appointmentList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(3);
            (schObj.element.querySelectorAll('.e-more-indicator')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            const moreEvent: HTMLElement = (schObj.element.querySelector('.e-more-popup-wrapper').querySelector('.e-more-appointment-wrapper'));
            const moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            (schObj.element.querySelector('.e-close-icon') as HTMLElement).click();
            const heightValue: string = (schObj.element.querySelector('.e-content-table tr td') as HTMLElement).style.height;
            expect(heightValue).toEqual('116px');
        });

        it('elements in DOM with rowAutoHeight enabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(4);
                const heightValue: string = (schObj.element.querySelector('.e-content-table tr td') as HTMLElement).style.height;
                expect(heightValue).toEqual('');
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('EJ2-855763 - Overlapping different appointments when they are on same date in vertical year view', () => {
        let schObj: Schedule;
        const events: Record<string, any>[] = [
            {
                Id: 1736,
                Subject: 'Project 1',
                StartTime: new Date(2023, 5, 10, 10, 30),
                EndTime: new Date(2023, 6, 10, 11, 0),
                ProjectId: 1,
                TaskId: 1,
                IsAllDay: false,
            },
            {
                Id: 1735,
                Subject: 'Project 2',
                StartTime: new Date(2023, 5, 10, 10, 30),
                EndTime: new Date(2023, 6, 10, 11, 0),
                ProjectId: 1,
                TaskId: 1,
                IsAllDay: false,
            },
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2023, 5, 10),
                height: '100%', width: '100%',
                views: [
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                eventSettings: { dataSource: events },
                group: {
                    resources: ['Projects', 'Categories']
                },
                resources: [
                    {
                        field: 'ProjectId', title: 'Choose Project', name: 'Projects',
                        dataSource: [
                            { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
                            { text: 'PROJECT 2', id: 2, color: '#56ca85' },
                            { text: 'PROJECT 3', id: 3, color: '#df5286' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'TaskId', title: 'Category',
                        name: 'Categories', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#df5286' },
                            { text: 'Steven', id: 2, groupId: 2, color: '#7fa900' },
                            { text: 'Robert', id: 3, groupId: 3, color: '#ea7a57' },
                            { text: 'Smith', id: 4, groupId: 1, color: '#5978ee' },
                            { text: 'Micheal', id: 5, groupId: 2, color: '#df5286' },
                            { text: 'Root', id: 6, groupId: 3, color: '#00bdae' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    },
                ],
                dataBound: () => {
                    util.disableScheduleAnimation(schObj);
                    done();
                }
            };
            const parentElement: HTMLElement = createElement('div', { id: 'ScheduleParent', styles: 'height: 1297px; width: 1250px;' });
            const schEle: HTMLElement = createElement('div', { id: 'Schedule' });
            parentElement.appendChild(schEle);
            schObj = new Schedule(model, schEle);
            document.body.appendChild(parentElement);
        });
        afterAll(() => {
            util.destroy(schObj);
            remove(document.getElementById('ScheduleParent'));
        });

        it('Checking appointment rendering in year view vertical orientation', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements.length).toEqual(2);
            expect(eventElements[0].offsetTop != eventElements[1].offsetTop).toEqual(true);
            
        });
    });

    describe('Schedule Year view', () => {
        let schObj: Schedule;
      
        beforeAll((done: DoneFn) => {
          const moreIndicatorData: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 0, 1, 0, 0),
                EndTime: new Date(2023, 0, 1, 6, 0),
                IsAllDay: true
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 0, 1, 0, 0),
                EndTime: new Date(2023, 0, 1, 4, 0),
                IsAllDay: true
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 0, 1, 0, 0),
                EndTime: new Date(2023, 0, 1, 3, 0),
                IsAllDay: true
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 0, 1, 0, 0),
                EndTime: new Date(2023, 0, 1, 7, 0),
                IsAllDay: true
            }
          ];
          
          const model: ScheduleModel = {
            selectedDate: new Date(2023, 10, 6),
            views: [{ option: 'Year' }]
          };
          
          schObj = util.createSchedule(model, moreIndicatorData, done);
        });
      
        afterAll(() => {
          util.destroy(schObj);
        });
      
        it('more popup appointments rendering and counts after deleting one appointment', () => {
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells:not(.e-other-month)'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            let moreEvent: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper .e-more-appointment-wrapper') as HTMLElement;
            let moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            const deleteAppointment: HTMLElement = moreAppointmentList[0] as HTMLElement;
            deleteAppointment.click();
            (schObj.element.querySelector('.e-delete-icon') as HTMLElement).click();
            schObj.dataBound = () => {
                setTimeout(() => {
                    const moreEvent = schObj.element.querySelector('.e-more-popup-wrapper .e-more-appointment-wrapper') as HTMLElement;
                    if (moreEvent) {
                        const moreAppointmentList = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
                        expect(moreAppointmentList.length).toEqual(3);
                        (schObj.element.querySelector('.e-more-popup-close') as HTMLElement).click();
                    }
                }, 100);
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('Testing the TimelineYear view With enableMaxHeight=true and enableIndicator=false', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Event 1',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 2,
                    Subject: 'Event 2',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 3,
                    Subject: 'Event 3',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 4,
                    Subject: 'Event 4',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 5,
                    Subject: 'Event 5',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                }
            ];
            const model: ScheduleModel = {
                width: '800px',
                height: '550px',
                selectedDate: new Date(2017, 3, 1),
                views: [
                    { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                eventSettings: {
                    dataSource: yearData,
                    enableMaxHeight: true,
                    enableIndicator: false
                }
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Check enableMaxHeight=true and enableIndicator=false in Horizontal TimelineYear view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(false);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(1);
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(0);
                done();
            };
            const timelineYearButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[0] as HTMLElement;
            util.triggerMouseEvent(timelineYearButton, 'click');
        });

        it('Check enableMaxHeight=true and enableIndicator=false in Vertical TimelineYear view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(false);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(1);
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(0);
                done();
            };
            const verticalTimelineButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement;
            util.triggerMouseEvent(verticalTimelineButton, 'click');
        });
    });

    describe('Testing the TimelineYear view With enableMaxHeight=true and enableIndicator=true', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Event 1',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 2,
                    Subject: 'Event 2',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 3,
                    Subject: 'Event 3',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 4,
                    Subject: 'Event 4',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 5,
                    Subject: 'Event 5',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                }
            ];
            const model: ScheduleModel = {
                width: '800px',
                height: '550px',
                selectedDate: new Date(2017, 3, 1),
                views: [
                    { option: 'Year', isSelected: true },
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                eventSettings: {
                    dataSource: yearData,
                    enableMaxHeight: true,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Check enableMaxHeight=true and enableIndicator=true in Horizontal TimelineYear view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(true);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(1);
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(1);
                if (moreIndicators.length > 0) {
                    util.triggerMouseEvent(moreIndicators[0] as HTMLElement, 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toBe(true);
                    const popupEvents = schObj.element.querySelectorAll('.e-more-popup-wrapper .e-appointment');
                    expect(popupEvents.length).toBe(5);
                    util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toBe(true);
                }
                done();
            };
            const timelineYearButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[0] as HTMLElement;
            util.triggerMouseEvent(timelineYearButton, 'click');
        });

        it('Check enableMaxHeight=true and enableIndicator=true in Vertical TimelineYear view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(true);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(1);
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(1);
                if (moreIndicators.length > 0) {
                    util.triggerMouseEvent(moreIndicators[0] as HTMLElement, 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toBe(true);
                    const popupEvents = schObj.element.querySelectorAll('.e-more-popup-wrapper .e-appointment');
                    expect(popupEvents.length).toBe(5);
                    util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toBe(true);
                }
                done();
            };
            const verticalTimelineButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement;
            util.triggerMouseEvent(verticalTimelineButton, 'click');
        });
    });

    describe('Testing the TimelineYear view With enableMaxHeight=true and enableIndicator=false with resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const resourceData: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Resource Event 1',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 1
                },
                {
                    Id: 2,
                    Subject: 'Resource Event 2',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 1
                },
                {
                    Id: 3,
                    Subject: 'Resource Event 3',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 2
                },
                {
                    Id: 4,
                    Subject: 'Resource Event 4',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 2
                },
                {
                    Id: 5,
                    Subject: 'Resource Event 5',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 3
                }
            ];
            const model: ScheduleModel = {
                width: '800px',
                height: '550px',
                selectedDate: new Date(2017, 3, 1),
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                group: {
                    resources: ['Resources']
                },
                resources: [{
                    field: 'ResourceId',
                    title: 'Resource',
                    name: 'Resources',
                    dataSource: [
                        { text: 'Resource 1', id: 1, color: '#1aaa55' },
                        { text: 'Resource 2', id: 2, color: '#7fa900' },
                        { text: 'Resource 3', id: 3, color: '#ea7a57' }
                    ],
                    textField: 'text',
                    idField: 'id',
                    colorField: 'color'
                }],
                eventSettings: {
                    dataSource: resourceData,
                    enableMaxHeight: true,
                    enableIndicator: false
                }
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Check enableMaxHeight=true and enableIndicator=false in Horizontal TimelineYear view with resources', (done: DoneFn) => {
            expect(schObj.eventSettings.enableMaxHeight).toBe(true);
            expect(schObj.eventSettings.enableIndicator).toBe(false);
            const appointments = schObj.element.querySelectorAll('.e-appointment');
            expect(appointments.length).toBe(3);
            const resourceElements = schObj.element.querySelectorAll('.e-resource-cells');
            expect(resourceElements.length).toBeGreaterThan(0);
            const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toBe(0);
            done();
        });

        it('Check enableMaxHeight=true and enableIndicator=false in Vertical TimelineYear view with resources', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(false);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(3);
                const resourceColumn = schObj.element.querySelector('.e-resource-column-wrap');
                expect(resourceColumn).not.toBeNull();
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(0);
                done();
            };

            const verticalTimelineButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement;
            util.triggerMouseEvent(verticalTimelineButton, 'click');
        });
    });

    describe('Testing the TimelineYear view With enableMaxHeight=true and enableIndicator=true with resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const resourceData: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Resource Event 1',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 1
                },
                {
                    Id: 2,
                    Subject: 'Resource Event 2',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 1
                },
                {
                    Id: 3,
                    Subject: 'Resource Event 3',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 2
                },
                {
                    Id: 4,
                    Subject: 'Resource Event 4',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 2
                },
                {
                    Id: 5,
                    Subject: 'Resource Event 5',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2),
                    ResourceId: 3
                }
            ];
            const model: ScheduleModel = {
                width: '800px',
                height: '550px',
                selectedDate: new Date(2017, 3, 1),
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                    { option: 'TimelineYear', displayName: 'Vertical Year', orientation: 'Vertical' }
                ],
                group: {
                    resources: ['Resources']
                },
                resources: [{
                    field: 'ResourceId',
                    title: 'Resource',
                    name: 'Resources',
                    dataSource: [
                        { text: 'Resource 1', id: 1, color: '#1aaa55' },
                        { text: 'Resource 2', id: 2, color: '#7fa900' },
                        { text: 'Resource 3', id: 3, color: '#ea7a57' }
                    ],
                    textField: 'text',
                    idField: 'id',
                    colorField: 'color'
                }],
                eventSettings: {
                    dataSource: resourceData,
                    enableMaxHeight: true,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Check enableMaxHeight=true and enableIndicator=true in Horizontal TimelineYear view with resources', (done: DoneFn) => {
            expect(schObj.eventSettings.enableMaxHeight).toBe(true);
            expect(schObj.eventSettings.enableIndicator).toBe(true);
            const appointments = schObj.element.querySelectorAll('.e-appointment');
            expect(appointments.length).toBe(3);
            const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
            expect(moreIndicators.length).toBe(2);
            if (moreIndicators.length > 0) {
                util.triggerMouseEvent(moreIndicators[0] as HTMLElement, 'click');
                expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toBe(true);
                const groupIndex = moreIndicators[0].getAttribute('data-group-index');
                expect(groupIndex).not.toBeNull();
                const popupEvents = schObj.element.querySelectorAll('.e-more-popup-wrapper .e-appointment');
                expect(popupEvents.length).toBe(2);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
                expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toBe(true);
            }
            done();
        });

        it('Check enableMaxHeight=true and enableIndicator=true in Vertical TimelineYear view with resources', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventSettings.enableMaxHeight).toBe(true);
                expect(schObj.eventSettings.enableIndicator).toBe(true);
                const appointments = schObj.element.querySelectorAll('.e-appointment');
                expect(appointments.length).toBe(3);
                const moreIndicators = schObj.element.querySelectorAll('.e-more-indicator');
                expect(moreIndicators.length).toBe(2);
                if (moreIndicators.length > 0) {
                    util.triggerMouseEvent(moreIndicators[0] as HTMLElement, 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toBe(true);
                    const popupEvents = schObj.element.querySelectorAll('.e-more-popup-wrapper .e-appointment');
                    expect(popupEvents.length).toBe(2);
                    util.triggerMouseEvent(schObj.element.querySelector('.e-more-event-close'), 'click');
                    expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-close')).toBe(true);
                }
                done();
            };
            const verticalTimelineButton: HTMLElement = schObj.element.querySelectorAll('.e-toolbar-item.e-views.e-timeline-year')[1] as HTMLElement;
            util.triggerMouseEvent(verticalTimelineButton, 'click');
        });
    });

    describe('EJ2-976753 - Appointments are overlapped in Timelineyear view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const overlapEventsData: Record<string, any>[] = [
                {
                    Id: 73652,
                    StartTime: '2025-04-03T00:00:00',
                    EndTime: '2025-04-04T23:00:00',
                    Subject: 'M2503 1404 - FanEnergy 16',
                    IsAllDay: true,
                    IsReadonly: true
                },
                {
                    Id: 66893,
                    StartTime: '2025-04-02T00:00:00',
                    EndTime: '2025-04-03T23:00:00',
                    Subject: 'OA09767 - 12-BXV-2',
                    IsAllDay: true,
                    IsReadonly: true
                },
            ];
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2025, 4, 1),
                views: [
                    { option: 'TimelineYear' }
                ],
                rowAutoHeight: true,
            };
            schObj = util.createSchedule(model, overlapEventsData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Testing overlapping appointments in Timelineyear view', () => {
            const appointmentList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(2);
            const firstAppointmentTop: string = appointmentList[0].style.top;
            const secondAppointmentTop: string = appointmentList[1].style.top;
            expect(firstAppointmentTop).not.toEqual(secondAppointmentTop);
        });
    });

    describe('Schedule Timeline Month view MoreIndicator rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const yearData: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Event 1',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 2,
                    Subject: 'Event 2',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 3,
                    Subject: 'Event 3',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 4,
                    Subject: 'Event 4',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                },
                {
                    Id: 5,
                    Subject: 'Event 5',
                    StartTime: new Date(2017, 2, 2),
                    EndTime: new Date(2017, 2, 2)
                }
            ];
            const model: ScheduleModel = {
                width: '800px',
                height: '550px',
                selectedDate: new Date(2017, 3, 1),
                views: [
                    { option: 'TimelineYear', displayName: 'Horizontal Year' },
                ],
                eventSettings: {
                    dataSource: yearData,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(model, [], done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking the more indicator styles in timeline year view', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1);
            const moreIndicatorElement: HTMLElement = moreIndicatorList[0] as HTMLElement;
            const startDateMs = parseInt(moreIndicatorElement.getAttribute('data-start-date') || 'NaN', 10);
            let selector = `.e-work-cells[data-date="${startDateMs}"]`;
            const workCell = schObj.element.querySelector(selector) as HTMLElement;
            expect(moreIndicatorElement.style.transform).toContain('translateY(-100%)');
            const cellBottom = () => workCell.getBoundingClientRect().bottom;
            const indicatorBottom = () => moreIndicatorElement.getBoundingClientRect().bottom;
            const differenece = Math.abs(indicatorBottom() - cellBottom());
            expect(differenece).toBeLessThanOrEqual(1);
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
