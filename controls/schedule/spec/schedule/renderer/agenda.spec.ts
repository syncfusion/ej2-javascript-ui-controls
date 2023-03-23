/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule agenda view spec
 */
import { closest } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, EventRenderedArgs } from '../../../src/schedule/index';
import { triggerScrollEvent, createSchedule, destroy, triggerMouseEvent } from '../util.spec';
import { resourceData, generateObject, defaultData, cloneDataSource } from '../base/datasource.spec';
import * as util from '../../../src/schedule/base/util';
import * as cls from '../../../src/schedule/base/css-constant';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Agenda View', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Checking without datasource', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Agenda', selectedDate: new Date(2017, 10, 1),
                views: [{ option: 'Agenda', allowVirtualScrolling: true }]
            };
            schObj = createSchedule(model, [], done);
        }, 4000);
        afterAll(() => {
            destroy(schObj);
        });

        it('Initial load testing', () => {
            expect(schObj.activeView.getDateSlots([], []).length).toEqual(0);
            expect(schObj.activeView.generateColumnLevels().length).toEqual(0);
            expect(schObj.activeView.getColumnLevels()).toBeUndefined();
            schObj.activeViewOptions.startHour = '';
            schObj.activeViewOptions.endHour = '';
            const startEndHour: Date = new Date(2000, 0, 0, 0);
            expect(schObj.activeView.getStartHour().getTime()).toEqual(startEndHour.getTime());
            expect(schObj.activeView.getEndHour().getTime()).toEqual(startEndHour.getTime());
        });

        it('Checking view class name in container', () => {
            expect(schObj.element.querySelector('.e-agenda-view')).toBeTruthy();
        });

        it('Checking hideEmptyAgendaDays default value', () => {
            expect(schObj.hideEmptyAgendaDays).toEqual(true);
        });

        it('Checking agendaDaysCount default value', () => {
            expect(schObj.agendaDaysCount).toEqual(7);
        });

        it('Checking Agenda elements count', () => {
            expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(0);
        });

        it('Checking selected Date', () => {
            expect(util.resetTime(schObj.selectedDate)).toEqual(util.resetTime(new Date(2017, 10, 1)));
        });

        it('Checking Virtual Scrolling default value', () => {
            expect(schObj.activeViewOptions.allowVirtualScrolling).toEqual(true);
        });

        it('Checking Header text', () => {
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 2017');
        });

        it('Checking prev next icon disabled', () => {
            expect(schObj.element.querySelector('.e-prev').classList.contains('e-hidden')).toEqual(true);
            expect(schObj.element.querySelector('.e-next').classList.contains('e-hidden')).toEqual(true);
        });

        it('Checking Header text', () => {
            const element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 2017');
            schObj.views = [
                { option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
                { option: 'Agenda', allowVirtualScrolling: false }
            ];
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 01 - 07, 2017');
        });

        it('Checking previous navigation', () => {
            const prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('Oct 31 - Nov 06, 2017');
        });

        it('Checking next navigation', () => {
            const nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('November 01 - 07, 2017');
        });

        it('Checking hideEmptyAgendaDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(7);
                done();
            };
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                const scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollUp, 0);
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(14);
                const patentTd: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
                expect(patentTd.getAttribute('data-date')).toEqual(new Date(2017, 9, 25).getTime().toString());
                done();
            };
            expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(7);
            const td: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
            expect(td.getAttribute('data-date')).toEqual(new Date(2017, 10, 1).getTime().toString());
            schObj.views = [
                { option: 'Day' }, { option: 'Week' }, { option: 'WorkWeek' }, { option: 'Month' },
                { option: 'Agenda', allowVirtualScrolling: true }
            ];
            schObj.dataBind();
        });

        it('Checking without headerbar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('Checking Dateheader color', (done: DoneFn) => {
            schObj.dataBound = () => {
                const dateString: string = new Date().setHours(0, 0, 0, 0).toString();
                expect(schObj.element.querySelector('.e-current-day').parentElement.getAttribute('data-date')).toEqual(dateString);
                done();
            };
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });
    });

    describe('EJ2-54150 Checking with getCurrentViewEvents for the Agenda view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', currentView: 'Agenda', selectedDate: new Date(2017, 9, 30),
                views: [{ option: 'Day' }, { option: 'Agenda' }]
            };
            schObj = createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('current view events checking', () => {
            const totalEvent: Record<string, any>[] = schObj.eventsData;
            expect(totalEvent.length).toEqual(43);
            const currentViewEvent: Record<string, any>[] = schObj.getCurrentViewEvents();
            expect(currentViewEvent.length).toEqual(20);
        });
    });

    describe('Checking with datasource', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', currentView: 'Agenda', selectedDate: new Date(2017, 9, 30),
                views: [{ option: 'Day' }, { option: 'Agenda', allowVirtualScrolling: true }]
            };
            schObj = createSchedule(schOptions, generateObject(), done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking list elements', () => {
            const agendaEle: Element = schObj.element.querySelector('.e-content-wrap tr');
            expect(agendaEle.childElementCount).toEqual(2);
            const agendaDate: HTMLElement = agendaEle.children[0] as HTMLElement;
            expect(agendaDate.className).toEqual('e-agenda-cells');
            expect(agendaDate.childElementCount).toEqual(1);
            expect(agendaDate.children[0].classList[0]).toEqual('e-day-date-header');
            expect(agendaDate.children[0].childElementCount).toEqual(2);
            expect(agendaDate.children[0].children[0].className).toEqual('e-m-date');
            expect(agendaDate.children[0].children[1].className).toEqual('e-m-day');
            const agendaListApp: HTMLElement = agendaEle.children[1] as HTMLElement;
            expect(agendaListApp.className).toEqual('e-agenda-cells e-day-border');
            expect(agendaListApp.childElementCount).toEqual(1);
            expect(agendaListApp.children[0].className).toEqual('e-agenda-parent e-ul e-agenda-view');
            expect(agendaListApp.children[0].childElementCount).toBeGreaterThanOrEqual(1);
            expect(agendaListApp.children[0].children[0].className).toEqual('e-agenda-item e-agenda-view e-level-1');
            expect(agendaListApp.children[0].children[0].childElementCount).toEqual(1);
            expect(agendaListApp.children[0].children[0].children[0].className).toEqual('e-appointment');
            expect(agendaListApp.children[0].children[0].children[0].childElementCount).toEqual(2);
            expect(agendaListApp.children[0].children[0].children[0].children[0].className).toEqual('e-subject-wrap');
            expect(agendaListApp.children[0].children[0].children[0].children[1].className).toEqual('e-date-time');

            const scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(scrollElement.querySelectorAll('tr').length).toEqual(7);
            triggerScrollEvent(scrollUp, 0);
            const scrollElement1: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(scrollElement1.querySelectorAll('tr').length).toBeLessThanOrEqual(15);
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                const scrollUp: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollUp, 0);
                expect(schObj.element.querySelectorAll('.e-agenda-parent').length).toEqual(14);
                const patentTd: Element = closest((schObj.element.querySelectorAll('.e-agenda-parent')[0] as Element), 'td');
                expect(patentTd.getAttribute('data-date')).toEqual(new Date(2017, 9, 23).getTime().toString());
                done();
            };
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
        });

        it('First date checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                (<HTMLElement>schObj.element.querySelector('.e-appointment')).click();
                const scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                triggerScrollEvent(scrollElement, 0);
                done();
            };
            schObj.selectedDate = new Date(2017, 0, 1);
            schObj.hideEmptyAgendaDays = true;
            schObj.dataBind();
        });

        it('Last date checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                const scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                const scrollHeight: number = scrollElement.scrollHeight;
                triggerScrollEvent(scrollElement, scrollHeight);
                done();
            };
            schObj.selectedDate = new Date(2018, 11, 28);
            schObj.dataBind();
        });

        it('home key', () => {
            const scrollElement: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(scrollElement, 150);
            keyModule.keyActionHandler({ action: 'home' });
            const target: Element = schObj.element.querySelector('.e-content-wrap table tr td[tabindex="0"]');
            expect(target.getAttribute('data-date')).toEqual(new Date('Fri Dec 28 2018').getTime().toString());
        });

        it('Tab key functionality checking', () => {
            const target: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(target[0].classList.contains('e-appointment-border')).toEqual(false);
            keyModule.keyActionHandler({ action: 'tab', target: target[2], shiftKey: true, preventDefault: (): void => { /** Null */ } });
            expect(target[0].getAttribute('data-guid')).toEqual(document.activeElement.getAttribute('data-guid'));
        });

        it('Day view navigation checking', () => {
            const firstDateHeader: HTMLElement = schObj.element.querySelector('.e-m-date') as HTMLElement;
            firstDateHeader.click();
            expect(schObj.currentView).toEqual('Day');
        });
    });

    describe('Checking Virtual scrolling with events after long days from initial date navigation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: [{ option: 'Month' }, { option: 'Agenda', allowVirtualScrolling: true }],
                selectedDate: new Date(2017, 11, 1),
                currentView: 'Agenda'
            };
            const scheduleDatas: Record<string, any>[] = [{
                Id: 44,
                Subject: 'Paris',
                StartTime: new Date(2018, 0, 8, 10, 0),
                EndTime: new Date(2018, 0, 8, 11, 30),
                IsAllDay: false
            }, {
                Id: 45,
                Subject: 'Conference - 1',
                StartTime: new Date(2018, 2, 8, 22, 0),
                EndTime: new Date(2018, 2, 8, 2, 30),
                IsAllDay: false
            }, {
                Id: 46,
                Subject: 'Conference - 2',
                StartTime: new Date(2018, 4, 14, 22, 0),
                EndTime: new Date(2018, 4, 15, 0, 0),
                IsAllDay: false
            }, {
                Id: 47,
                Subject: 'Conference - 3',
                StartTime: new Date(2018, 6, 15, 9, 30),
                EndTime: new Date(2018, 6, 15, 11, 45),
                IsAllDay: false
            }, {
                Id: 48,
                Subject: 'Conference - 4',
                StartTime: new Date(2018, 8, 15, 10, 30),
                EndTime: new Date(2018, 8, 15, 12, 45),
                IsAllDay: false
            }, {
                Id: 49,
                Subject: 'Travelling',
                StartTime: new Date(2018, 10, 15, 11, 30),
                EndTime: new Date(2018, 10, 15, 13, 45),
                IsAllDay: false
            }, {
                Id: 50,
                Subject: 'Vacation',
                StartTime: new Date(2019, 0, 16, 10, 0),
                EndTime: new Date(2019, 0, 16, 12, 30),
                IsAllDay: false
            }, {
                Id: 51,
                Subject: 'Conference',
                StartTime: new Date(2019, 2, 16, 15, 30),
                EndTime: new Date(2019, 2, 16, 18, 45),
                IsAllDay: false
            }, {
                Id: 52,
                Subject: 'Vacation',
                StartTime: new Date(2019, 4, 17, 10, 15),
                EndTime: new Date(2019, 4, 17, 14, 45),
                IsAllDay: false
            }, {
                Id: 53,
                Subject: 'Conference',
                StartTime: new Date(2019, 6, 18, 9, 30),
                EndTime: new Date(2019, 6, 18, 10, 45),
                IsAllDay: false
            }, {
                Id: 54,
                Subject: 'Conference-5',
                StartTime: new Date(2029, 9, 13, 9, 30),
                EndTime: new Date(2029, 9, 13, 10, 45),
                IsAllDay: false
            }];
            const data: Record<string, any>[] = cloneDataSource(defaultData).concat(scheduleDatas);
            schObj = createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking virtual scrolling with hideEmptyAgendaDays', () => {
            const eventWraps: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-agenda-parent'));
            expect(eventWraps.length).toEqual(16);
            const firstEventTd: Element = closest((eventWraps[0] as Element), 'td');
            expect(parseInt(firstEventTd.getAttribute('data-date'), 10)).toEqual(new Date(2017, 10, 10).getTime());
            expect(firstEventTd.getAttribute('data-column-index')).toEqual('-21');
            const lastEventTd: Element = closest((eventWraps[eventWraps.length - 1] as Element), 'td');
            expect(parseInt(lastEventTd.getAttribute('data-date'), 10)).toEqual(new Date(2019, 0, 16).getTime());
            expect(lastEventTd.getAttribute('data-column-index')).toEqual('411');
        });
    });

    describe('Agenda view rendering with templates', () => {
        let schObj: Schedule;
        const appTmpl: string = '<div>Subject: ${Subject}</div><div>StartTime: ${StartTime.toLocaleString()}</div>' +
            '<div>EndTime: ${EndTime.toLocaleString()</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px',
                views: [{option: 'Agenda', dateFormat: 'dd MMM yyyy'}],
                dateHeaderTemplate: '<span>${date.toLocaleDateString()}</span>',
                selectedDate: new Date(2017, 9, 30)
            };
            schObj = createSchedule(model, generateObject(), done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking date template', () => {
            const agendaEle: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(agendaEle.childElementCount).toEqual(2);
            const agendaDate: HTMLElement = agendaEle.children[0] as HTMLElement;
            expect(agendaDate.className).toEqual('e-agenda-cells');
            expect(agendaDate.childElementCount).toEqual(1);
            expect(agendaDate.children[0].classList[0]).toEqual('e-day-date-header');
            expect(agendaDate.children[0].childElementCount).toEqual(1);
        });

        it('Checking dateRange template', () => {
            expect(schObj.element.querySelector('.e-toolbar-left').children.length).toEqual(3);
            expect(schObj.element.querySelector('.e-toolbar-items').children[0].className).toBe('e-toolbar-left');
            const dateRangeEle: Element = schObj.element.querySelector('.e-tbar-btn-text');
            schObj.dateRangeTemplate = '<div class="date-text">${(data.startDate).getMonth()}-${(data.endDate).getMonth()}</div>';
            schObj.dataBind();
            expect(dateRangeEle.innerHTML).toEqual('<div class="date-text">9-10</div>');
            schObj.dateRangeTemplate = '<div>${getShortDateTime(data.startDate)}-${getShortDateTime(data.endDate)}</div>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div>10/30/17, 12:00 AM-11/5/17, 12:00 AM</div>');
            schObj.dateRangeTemplate = '<div>${(data.startDate).getDate()}-${(data.endDate).getDate()}</div>';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-tbar-btn-text')[0]['innerHTML']).toBe('<div>30-5</div>');
        });

        it('remove daterange', () => {
            expect(schObj.element.querySelector('.e-toolbar-left').children.length).toEqual(3);
            schObj.element.querySelector('.e-date-range').remove();
            expect(schObj.element.querySelector('.e-toolbar-left').children.length).toEqual(2);
        });

        it('Checking appointment template', (done: DoneFn) => {
            schObj.dataBound = () => {
                const agendaEle: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(agendaEle.childElementCount).toEqual(2);
                const agendaListApp: HTMLElement = agendaEle.children[1] as HTMLElement;
                expect(agendaListApp.className).toEqual('e-agenda-cells e-day-border');
                expect(agendaListApp.childElementCount).toEqual(1);
                expect(agendaListApp.children[0].className).toEqual('e-agenda-parent e-ul e-agenda-view');
                expect(agendaListApp.children[0].childElementCount).toBeGreaterThanOrEqual(1);
                expect(agendaListApp.children[0].children[0].className).toEqual('e-agenda-item e-agenda-view e-level-1');
                expect(agendaListApp.children[0].children[0].childElementCount).toEqual(1);
                expect(agendaListApp.children[0].children[0].children[0].className).toEqual('e-appointment e-template');
                expect(agendaListApp.children[0].children[0].children[0].children[0].className).toEqual('e-icons e-recurrence-icon');
                expect(agendaListApp.children[0].children[0].children[0].childElementCount).toEqual(4);
                done();
            };
            schObj.eventSettings.template = appTmpl;
            schObj.dataBind();
        });
    });

    describe('Agenda view spanned events checking', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2018, 3, 1),
            EndTime: new Date(2018, 3, 5),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Agenda', selectedDate: new Date(2018, 3, 1) };
            schObj = createSchedule(model, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Checking spanned events', () => {
            const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(4);
            agendaAppointment[0].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Checking Event loading on current view', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2018, 3, 7),
            EndTime: new Date(2018, 3, 7),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Agenda', selectedDate: new Date(2018, 3, 8) };
            schObj = createSchedule(model, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('test current page event loading', () => {
            const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(0);
            const element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
        });

        it('test check event loading on previous click', (done: DoneFn) => {
            schObj.dataBound = () => {
                const agendaAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointments.length).toEqual(1);
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 07 - 13, 2018');
                done();
            };
            const prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
        });

        it('test check event loading on next click', (done: DoneFn) => {
            schObj.dataBound = () => {
                const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointment.length).toEqual(0);
                const element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
                expect(element.innerHTML).toEqual('No events');
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
                done();
            };
            const nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
        });
    });

    describe('Checking Event loading on view specific agenda view', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event',
            StartTime: new Date(2018, 3, 7),
            EndTime: new Date(2018, 3, 7),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', currentView: 'Agenda', selectedDate: new Date(2018, 3, 8),
                views: [{ option: 'Agenda', allowVirtualScrolling: false }]
            };
            schObj = createSchedule(model, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('test current page event loading', () => {
            const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(0);
            const element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
            expect(element.innerHTML).toEqual('No events');
            expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
        });

        it('test check event loading on previous click', (done: DoneFn) => {
            schObj.dataBound = () => {
                const agendaAppointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointments.length).toEqual(1);
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 07 - 13, 2018');
                done();
            };
            const prevEle: HTMLElement = schObj.element.querySelector('.e-prev') as HTMLElement;
            prevEle.click();
        });

        it('test check event loading on next click', (done: DoneFn) => {
            schObj.dataBound = () => {
                const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(agendaAppointment.length).toEqual(0);
                const element: HTMLElement = schObj.element.querySelector('.e-empty-event') as HTMLElement;
                expect(element.innerHTML).toEqual('No events');
                expect(schObj.element.querySelector('.e-date-range').firstElementChild.textContent).toEqual('April 08 - 14, 2018');
                done();
            };
            const nextEle: HTMLElement = schObj.element.querySelector('.e-next') as HTMLElement;
            nextEle.click();
        });
    });

    describe('Agenda view recurrence spanned events checking', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Spanned Event',
            StartTime: new Date(2018, 3, 1, 10, 0),
            EndTime: new Date(2018, 3, 2, 11, 0),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=2',
            RecurrenceID: 2
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Agenda', selectedDate: new Date(2018, 3, 1) };
            schObj = createSchedule(model, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Checking spanned events', () => {
            const agendaAppointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(agendaAppointment.length).toEqual(2);
            agendaAppointment[0].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Agenda view rendering with multiple resource', () => {
        let schObj: Schedule;
        const restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: restemplate,
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.childElementCount).toEqual(4);
            const parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('7');
            const parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('4');
            const row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            const parTd: HTMLElement = row1.children[0] as HTMLElement;
            const childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: DoneFn) => {
            schObj.dataBound = () => {
                const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(row1.childElementCount).toEqual(4);
                const parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('14');
                const parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('7');
                const row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
                const emptyTd: HTMLElement = row2.children[1] as HTMLElement;
                const emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
        });

        it('Checking resource rendering without headerbar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April 01 - 07, 2018');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
        });

        it('Checking resource rendering with empty agenda collection', (done: DoneFn) => {
            schObj.dataBound = () => {
                const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                const emptyDiv: HTMLElement = row1.children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-empty-event');
                done();
            };
            schObj.hideEmptyAgendaDays = true;
            schObj.selectedDate = new Date(2020, 3, 1);
            schObj.dataBind();
        });
    });

    describe('Agenda view rendering with single level resource Date-wise grouping', () => {
        let schObj: Schedule;
        const restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: restemplate,
                group: {
                    byDate: true,
                    resources: ['Owners']
                },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.childElementCount).toEqual(3);
            const parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('3');
            const parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('1');
            const row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            const parTd: HTMLElement = row1.children[1] as HTMLElement;
            const childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: DoneFn) => {
            schObj.dataBound = () => {
                const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[3];
                expect(row1.childElementCount).toEqual(3);
                const parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('3');
                const parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('1');
                const parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-date-column');
                const emptyTd: HTMLElement = row1.children[2] as HTMLElement;
                const emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
        });
    });

    describe('Agenda view rendering with multiple resource Date-wise grouping', () => {
        let schObj: Schedule;
        const restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Agenda',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: restemplate,
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking resource rendering with EmptyAgendaDays as true', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            expect(row1.childElementCount).toEqual(4);
            const parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('3');
            const parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('2');
            const row2: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[1];
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
            const parTd: HTMLElement = row1.children[1] as HTMLElement;
            const childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with EmptyAgendaDays as false', (done: DoneFn) => {
            schObj.dataBound = () => {
                const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[3];
                expect(row1.childElementCount).toEqual(4);
                const parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('3');
                const parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('2');
                const parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-date-column');
                const emptyTd: HTMLElement = row1.children[3] as HTMLElement;
                const emptyDiv: HTMLElement = emptyTd.children[0].children[0].children[0] as HTMLElement;
                expect(emptyDiv.className).toEqual('e-no-event');
                done();
            };
            schObj.hideEmptyAgendaDays = false;
            schObj.dataBind();
        });
    });

    describe('Agenda view rendering with multiple resource individual view config test', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'WorkWeek',
                selectedDate: new Date(2018, 3, 1),
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                views: [
                    { option: 'Day', group: { byGroupID: false, resources: ['Rooms', 'Owners'] } },
                    { option: 'Week', group: { resources: ['Rooms', 'Owners'] } },
                    { option: 'WorkWeek', group: { byDate: true, resources: ['Owners'] } },
                    { option: 'Month' },
                    { option: 'Agenda', group: { resources: ['Rooms', 'Owners'] } },
                    { option: 'MonthAgenda' }
                ]
            };
            schObj = createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Checking workweek view to agenda view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-agenda-view')).toBeTruthy();
                expect(schObj.getCurrentViewEvents().length).toEqual(11);
                const row1: Element = schObj.element.querySelector('.e-content-wrap').children[0].children[0].children[0];
                expect(row1.childElementCount).toEqual(4);
                const parElem1: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem1.getAttribute('rowspan')).toEqual('7');
                const parElem2: HTMLElement = row1.children[1] as HTMLElement;
                expect(parElem2.getAttribute('rowspan')).toEqual('4');
                const parElem3: HTMLElement = row1.children[0] as HTMLElement;
                expect(parElem3.className).toContain('e-resource-column');
                done();
            };
            expect(schObj.element.querySelector('.e-work-week')).toBeTruthy();
            expect(schObj.getCurrentViewEvents().length).toEqual(5);
            (schObj.element.querySelector('.e-agenda') as HTMLElement).click();
        });
    });

    describe('EJ2-26070-Event not rendered properly in agenda view when we give datasource and date format as string', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            'From': '2020-01-01T00:00:00',
            'Reason': 'Birthday',
            'To': '2020-01-02T23:59:59',
            'Name': 'Wish Luke Hill a happy birthday!',
            'Pending': false,
            'Cancelled': false,
            'AllDay': true
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', selectedDate: new Date(2020, 0, 1), currentView: 'Agenda',
                eventSettings: {
                    fields: {
                        subject: { name: 'Name' },
                        startTime: { name: 'From' },
                        endTime: { name: 'To' },
                        isAllDay: { name: 'AllDay' },
                        description: { name: 'Reason' }
                    }
                }
            };
            schObj = createSchedule(schOptions, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Checking event rendered or not using string datasource', () => {
            const eventElements: NodeListOf<Element> = schObj.element.querySelectorAll('.e-appointment');
            expect(eventElements.length).toEqual(2);
            expect(eventElements[0].querySelector('.e-date-time').textContent).toEqual('All day (Day 1/2)');
            expect(eventElements[1].querySelector('.e-date-time').textContent).toEqual('12:00 AM - 11:59 PM (Day 2/2)');
        });
    });

    describe('Checking minDate and maxDate', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: [{ option: 'Day' }, { option: 'Agenda' }],
                minDate: new Date(2017, 9, 29),
                selectedDate: new Date(2017, 9, 30),
                maxDate: new Date(2017, 9, 31),
                currentView: 'Agenda'
            };
            const eventData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event-1',
                StartTime: new Date(2017, 9, 29, 10),
                EndTime: new Date(2017, 9, 29, 11),
                IsAllDay: false
            }, {
                Id: 2,
                Subject: 'Event-2',
                StartTime: new Date(2017, 9, 30, 10),
                EndTime: new Date(2017, 9, 30, 11),
                IsAllDay: false
            }, {
                Id: 3,
                Subject: 'Event-3',
                StartTime: new Date(2017, 9, 31, 10),
                EndTime: new Date(2017, 9, 31, 11),
                IsAllDay: false
            }, {
                Id: 4,
                Subject: 'Event-4',
                StartTime: new Date(2017, 10, 1, 10),
                EndTime: new Date(2017, 10, 1, 11),
                IsAllDay: false
            }];
            schObj = createSchedule(schOptions, eventData, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('minDate and maxDate- date navigation testing - 1', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 29 - Nov 04, 2017');
                expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
                expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
                done();
            };
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 30 - Nov 05, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
        });

        it('minDate and maxDate- date navigation testing - 2', () => {
            schObj.dataBound = null;
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 29 - Nov 04, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 29 - Nov 04, 2017');
        });

        it('minDate and maxDate- date navigation testing - 3', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 30 - Nov 05, 2017');
                expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
                expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
                done();
            };
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 29 - Nov 04, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('minDate and maxDate- date navigation testing - 4', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 31 - Nov 06, 2017');
                expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
                expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
                done();
            };
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 30 - Nov 05, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('minDate and maxDate- date navigation testing - 5', () => {
            schObj.dataBound = null;
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 31 - Nov 06, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 31 - Nov 06, 2017');
        });

        it('minDate and maxDate- set-model changing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 30 - Nov 05, 2017');
                expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
                expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
                done();
            };
            expect(schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button').getAttribute('aria-disabled')).toEqual('true');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 31 - Nov 06, 2017');
            schObj.minDate = new Date(2017, 9, 30);
            schObj.maxDate = new Date(2017, 9, 30);
            schObj.selectedDate = new Date(2017, 9, 30);
            schObj.dataBind();
        });

        it('Day view navigation checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentView).toEqual('Day');
                done();
            };
            expect(schObj.currentView).toEqual('Agenda');
            (schObj.element.querySelectorAll('.e-m-date')[0] as HTMLElement).click();
        });
    });

    describe('EJ2-49632 Agenda view events not rendered when args cancel set true', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: [{ option: 'Month' }, { option: 'Agenda' }],
                selectedDate: new Date(2018, 1, 15),
                currentView: 'Agenda'
            };
            const scheduleDatas: Record<string, any>[] = [
                {
                    Id: 1,
                    Subject: 'Story Time for Kids',
                    StartTime: new Date(2018, 1, 11, 10, 0),
                    EndTime: new Date(2018, 1, 11, 11, 30),
                    CategoryColor: '#1aaa55'
                }, {
                    Id: 2,
                    Subject: 'Camping with Turtles',
                    StartTime: new Date(2018, 1, 12, 12, 0),
                    EndTime: new Date(2018, 1, 12, 14, 0),
                    CategoryColor: '#357cd2'
                },
                {
                    Id: 5,
                    Subject: 'Birds of Prey',
                    StartTime: new Date(2018, 1, 15, 10, 0),
                    EndTime: new Date(2018, 1, 15, 11, 30),
                    CategoryColor: '#00bdae'
                }, {
                    Id: 6,
                    Subject: 'Croco World',
                    StartTime: new Date(2018, 1, 16, 12, 0),
                    EndTime: new Date(2018, 1, 16, 14, 0),
                    CategoryColor: '#f57f17'
                }, {
                    Id: 7,
                    Subject: 'Venomous Snake Hunt',
                    StartTime: new Date(2018, 1, 17, 10, 0),
                    EndTime: new Date(2018, 1, 17, 11, 30),
                    CategoryColor: '#1aaa55'
                }, {
                    Id: 8,
                    Subject: 'Face Painting & Drawing events',
                    StartTime: new Date(2018, 1, 19, 9, 30),
                    EndTime: new Date(2018, 1, 19, 11, 0),
                    CategoryColor: '#357cd2'
                }, {
                    Id: 9,
                    Subject: 'Pony Rides',
                    StartTime: new Date(2018, 1, 21, 11, 0),
                    EndTime: new Date(2018, 1, 21, 13, 0),
                    CategoryColor: '#7fa900'
                },
                {
                    Id: 13,
                    Subject: 'Black Cockatoos Playtime',
                    StartTime: new Date(2018, 1, 5, 10, 0),
                    EndTime: new Date(2018, 1, 5, 11, 30),
                    CategoryColor: '#1aaa55'
                },
                {
                    Id: 18,
                    Subject: 'Black Cockatoos Playtime',
                    StartTime: new Date(2018, 1, 15, 14, 30),
                    EndTime: new Date(2018, 1, 15, 16, 0),
                    CategoryColor: '#7fa900'
                }
            ];
            schObj = createSchedule(schOptions, scheduleDatas, done);
            schObj.eventRendered = (args: EventRenderedArgs) => {
                if (args.data.Subject === 'Birds of Prey') {
                    args.cancel = true;
                }
            };
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking event rendered count in agenda view', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements.length).toEqual(5);
        });
    });

    describe('EJ2-55921 Agenda view events edit action checking on readonly set to true', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '650px',
                readonly: true,
                views: [{ option: 'Agenda' }],
                selectedDate: new Date(2022, 10, 1),
                currentView: 'Agenda'
            };
            const data: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Read-only',
                StartTime: new Date(2022, 10, 1),
                EndTime: new Date(2022, 10, 1),
                IsAllDay: true
            }];
            schObj = createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            destroy(schObj);
        });

        it('Checking event edit action', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement, 'dblclick');
            expect(document.querySelector('.e-schedule-dialog.e-popup-open')).toBeFalsy();
            expect(schObj.element.querySelector('.e-popup-open .e-event-popup')).toBeTruthy();
            (schObj.element.querySelector('.e-popup-open .e-event-popup .e-close') as HTMLButtonElement).click();
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
