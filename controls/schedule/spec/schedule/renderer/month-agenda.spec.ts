/**
 * Schedule month agenda view spec 
 */
import { createElement, Browser } from '@syncfusion/ej2-base';
import {
    Schedule, CellClickEventArgs, NavigatingEventArgs, ActionEventArgs, Day, Week, MonthAgenda, ScheduleModel
} from '../../../src/schedule/index';
import * as util from '../util.spec';
import { resourceData, defaultData } from '../base/datasource.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, MonthAgenda);

describe('Month-agenda view rendering', () => {
    beforeAll(() => {
        // tslint:disable-next-line:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Schedule month agenda view', () => {
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll(() => {
            Browser.userAgent = androidUserAgent;
        });
        afterAll(() => {
            Browser.userAgent = uA;
        });
        describe('Initial load', () => {
            let schObj: Schedule;
            beforeAll(() => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 4),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('view class on container', () => {
                expect(schObj.element.querySelector('.e-month-agenda-view')).toBeTruthy();
            });

            it('check active view class on toolbar views', () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
            });

            it('check work cell elements count', () => {
                expect(schObj.getWorkCellElements().length).toEqual(35);
            });

            it('check all Day row element', () => {
                expect(schObj.getAllDayRow()).toBeFalsy();
            });

            it('check date header cells text', () => {
                expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
            });

            it('work cells', () => {
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
                expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
                expect(firstWorkCell.innerHTML).toEqual('<div class="e-date-header">1</div>');
            });

            it('navigate next date', () => {
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
            });

            it('navigate previous date', () => {
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 300);
                expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
                expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells')[6].innerHTML).
                    toEqual('<span>S</span>');
            });

            it('ensure work days highlight', () => {
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);
            });

            it('ensure 6 rows in month', () => {
                schObj.selectedDate = new Date(2017, 11, 4);
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(7 * 6);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(5 * 6);
            });

            it('disable other month cells', () => {
                schObj.selectedDate = new Date(2017, 11, 4);
                schObj.dataBind();
                expect(schObj.element.querySelectorAll('.e-other-month').length).toEqual(11);
            });

            it('appointment details at bottom', () => {
                expect(schObj.element.querySelectorAll('.e-appointment-wrap').length).toEqual(1);
            });
        });

        describe('Dependent properties', () => {
            let schObj: Schedule;
            beforeEach(() => {
                schObj = undefined;
            });
            afterEach(() => {
                util.destroy(schObj);
            });

            it('width and height', (done: Function) => {
                let model: ScheduleModel = {
                    height: '500px', width: '300px', currentView: 'Day', selectedDate: new Date(2017, 9, 4),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, [], done);
                expect(document.getElementById('Schedule').style.width).toEqual('300px');
                expect(document.getElementById('Schedule').style.height).toEqual('500px');
                expect(document.getElementById('Schedule').offsetWidth).toEqual(300);
                expect(document.getElementById('Schedule').offsetHeight).toEqual(500);
            });

            it('start and end hour', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 4),
                    startHour: '04:00', endHour: '11:00', views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);

                schObj.startHour = '08:00';
                schObj.endHour = '16:00';
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);
            });

            it('work hours start and end', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 4),
                    workHours: { highlight: true, start: '10:00', end: '16:00' },
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);

                schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);

                schObj.workHours = { highlight: false };
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(0);
            });

            it('show weekend', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    showWeekend: false, views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.getWorkCellElements().length).toEqual(25);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>M</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('2');
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>M</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('30');
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>M</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('27');
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 300);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>M</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('30');

                schObj.showWeekend = true;
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('29');
            });

            it('work days', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    workDays: [0, 1, 3, 4], views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(5 * 4);
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(5 * 4);

                schObj.workDays = [0, 2, 3];
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(35);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(5 * 3);

                schObj.showWeekend = false;
                schObj.dataBind();
                expect(schObj.getWorkCellElements().length).toEqual(15);
                expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(15);
            });

            it('first Day of Week', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    firstDayOfWeek: 2, views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.getWorkCellElements().length).toEqual(42);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>T</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('26');

                schObj.firstDayOfWeek = 1;
                schObj.dataBind();
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>M</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('25');
            });

            // Date header template not applicable in month view

            it('cell template', () => {
                let templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    cellTemplate: templateEle.innerHTML, views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(schObj.getWorkCellElements().length);
                let workCellEle: HTMLElement = createElement('div', {
                    innerHTML: '<div class="e-date-header">4</div><span>10/4/17, 12:00 AM</span>'
                });
                schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
                schObj.dataBind();
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual(workCellEle.innerHTML);
            });

            it('check current date class', () => {
                let model: ScheduleModel = { currentView: 'MonthAgenda', views: ['Day', 'Week', 'MonthAgenda'] };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelector('.e-current-day').classList).toContain('e-header-cells');
                expect(schObj.element.querySelector('.e-current-date').classList).toContain('e-work-cells');
            });

            it('work cell click', () => {
                let model: ScheduleModel = {
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5), views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.classList).not.toContain('e-selected-cell');
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                firstWorkCell.click();
                expect(firstWorkCell.classList).toContain('e-selected-cell');
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
                expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            });

            it('header cell click Day view navigation', () => {
                let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
                let model: ScheduleModel = {
                    navigating: navFn, views: ['Day', 'Week', 'MonthAgenda'],
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5)
                };
                schObj = util.createSchedule(model, []);
                expect(navFn).toHaveBeenCalledTimes(0);
                expect(schObj.element.querySelector('.e-work-cells').innerHTML).toEqual('<div class="e-date-header">1</div>');
                (schObj.element.querySelector('.e-date-header') as HTMLElement).click();
                expect(schObj.element.querySelector('.e-work-cells').innerHTML).toEqual('<div class="e-date-header">1</div>');
                expect(navFn).toHaveBeenCalledTimes(0);
            });

            it('Checking appointment wrapper height', (done: Function) => {
                let model: ScheduleModel = {
                    width: '500px', height: '500px', selectedDate: new Date(2017, 9, 5),
                    currentView: 'MonthAgenda', views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                schObj.dataBound = () => {
                    expect((<HTMLElement>schObj.element.querySelector('.e-appointment-wrap')).offsetHeight).toEqual(266);
                    done();
                };
                expect(schObj.showHeaderBar).toEqual(true);
                expect((<HTMLElement>schObj.element.querySelector('.e-appointment-wrap')).offsetHeight).toEqual(210);
                schObj.showHeaderBar = false;
                schObj.dataBind();
            });
        });

        describe('Client side events', () => {
            let schObj: Schedule;
            beforeEach((): void => {
                schObj = undefined;
            });
            afterEach((): void => {
                util.destroy(schObj);
            });

            it('events call confirmation', () => {
                let createdFn: jasmine.Spy = jasmine.createSpy('createdEvent');
                let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
                let dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
                let beginFn: jasmine.Spy = jasmine.createSpy('beginEvent');
                let endFn: jasmine.Spy = jasmine.createSpy('endEvent');
                let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
                let renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
                let model: ScheduleModel = {
                    created: createdFn,
                    cellClick: clickFn,
                    cellDoubleClick: dblClickFn,
                    actionBegin: beginFn,
                    actionComplete: endFn,
                    navigating: navFn,
                    renderCell: renderFn,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(createdFn).toHaveBeenCalledTimes(1);
                expect(beginFn).toHaveBeenCalledTimes(1);
                expect(endFn).toHaveBeenCalledTimes(1);
                (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
                expect(clickFn).toHaveBeenCalledTimes(1);
                expect(renderFn).toHaveBeenCalledTimes(42);
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(renderFn).toHaveBeenCalledTimes(84);
                expect(beginFn).toHaveBeenCalledTimes(2);
                expect(endFn).toHaveBeenCalledTimes(2);
                expect(navFn).toHaveBeenCalledTimes(1);
            });

            it('cell click', () => {
                let cellStartTime: number;
                let cellEndTime: number;
                let eventName: string;
                let model: ScheduleModel = {
                    cellClick: (args: CellClickEventArgs) => {
                        cellStartTime = args.startTime.getTime();
                        cellEndTime = args.endTime.getTime();
                        eventName = args.name;
                    },
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
                expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
                expect(cellEndTime).toEqual(new Date(2017, 9, 5).getTime());
                expect(eventName).toEqual('cellClick');
            });

            it('cancel cell click', () => {
                let model: ScheduleModel = {
                    cellClick: (args: CellClickEventArgs) => args.cancel = true,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
                expect(workCell.classList).not.toContain('e-selected-cell');
                expect(workCell.getAttribute('aria-selected')).toEqual('false');
                workCell.click();
                expect(workCell.classList).not.toContain('e-selected-cell');
                expect(workCell.getAttribute('aria-selected')).toEqual('false');
            });

            it('date navigating', () => {
                let actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'dateNavigate' };
                let actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'dateNavigate' };
                let navArgs: NavigatingEventArgs = {
                    action: 'date', cancel: false, name: 'navigating',
                    currentDate: new Date(2017, 10, 5), previousDate: new Date(2017, 9, 5)
                };
                let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
                let model: ScheduleModel = {
                    navigating: (e: NavigatingEventArgs) => args = e,
                    actionBegin: (e: ActionEventArgs) => beginArgs = e,
                    actionComplete: (e: ActionEventArgs) => completeArgs = e,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(args).toEqual(jasmine.objectContaining(navArgs));
                expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
                expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
            });

            it('cancel date navigate in action begin', () => {
                let model: ScheduleModel = {
                    actionBegin: (e: ActionEventArgs) => e.cancel = true,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('1');
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('1');
            });

            it('cancel date navigating', () => {
                let model: ScheduleModel = {
                    navigating: (e: NavigatingEventArgs) => e.cancel = true,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('1');
                util.triggerSwipeEvent(schObj.element.querySelector('.e-table-container'), 100);
                expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>S</span>');
                expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('1');
            });

            it('view navigating', () => {
                let actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'viewNavigate' };
                let actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'viewNavigate' };
                let navArgs: NavigatingEventArgs = {
                    action: 'view', cancel: false, name: 'navigating', currentView: 'Week', previousView: 'MonthAgenda'
                };
                let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
                let model: ScheduleModel = {
                    navigating: (e: NavigatingEventArgs) => args = e,
                    actionBegin: (e: ActionEventArgs) => beginArgs = e,
                    actionComplete: (e: ActionEventArgs) => completeArgs = e,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
                expect(args).toEqual(jasmine.objectContaining(navArgs));
                expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
                expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
            });

            it('cancel view navigate in action begin', () => {
                let model: ScheduleModel = {
                    actionBegin: (e: ActionEventArgs) => e.cancel = true,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
                (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
            });

            it('cancel view navigating', () => {
                let model: ScheduleModel = {
                    navigating: (e: NavigatingEventArgs) => e.cancel = true,
                    currentView: 'MonthAgenda', selectedDate: new Date(2017, 9, 5),
                    views: ['Day', 'Week', 'MonthAgenda']
                };
                schObj = util.createSchedule(model, []);
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
                (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
            });
        });
    });

    describe('Events rendering', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeEach((done: Function): void => {
            schObj = undefined;
            let model: ScheduleModel = {
                currentView: 'MonthAgenda', height: '500px', width: '300px',
                selectedDate: new Date(2017, 10, 15), views: ['Day', 'MonthAgenda']
            };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('events icon rendering', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[1].children[1].classList).toContain('e-appointment-indicator');
            expect(schObj.element.querySelectorAll('.e-work-cells .e-appointment-indicator').length).toEqual(21);
            expect(schObj.element.querySelector('.e-appointment-wrap .e-agenda-item').classList).toContain('e-month-agenda-view');
            expect(schObj.element.querySelector('.e-appointment-wrap .e-agenda-parent').classList).toContain('e-month-agenda-view');
            expect(schObj.element.querySelectorAll('.e-appointment-wrap .e-agenda-item').length).toEqual(4);
            let lastWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')
            [schObj.element.querySelectorAll('.e-work-cells').length - 1] as HTMLElement;
            lastWorkCell.click();
            expect(schObj.element.querySelector('.e-appointment-wrap .e-no-event').classList).toContain('e-appointment-container');
            expect(schObj.element.querySelectorAll('.e-appointment-wrap .e-no-event')[0].innerHTML).toEqual('No events');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[5] as HTMLElement;
            workCell.click();
            expect(schObj.element.querySelectorAll('.e-appointment-wrap .e-agenda-item').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-appointment-wrap .e-agenda-item .e-appointment .e-subject')[0].innerHTML)
                .toEqual('Vacation');
        });

        it('leftArrow key testing', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(targetCell.classList.contains('e-appointment-border')).toEqual(true);
            keyModule.keyActionHandler({
                action: 'leftArrow', target: targetCell,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(targetCell.classList.contains('e-appointment-border')).toEqual(false);
        });

        it('rightArrow key testing', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(targetCell.classList.contains('e-appointment-border')).toEqual(true);
            keyModule.keyActionHandler({
                action: 'rightArrow', target: targetCell,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(targetCell.classList.contains('e-appointment-border')).toEqual(false);
        });

        it('shiftUpArrow key testing', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(targetCell.classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({
                action: 'shiftUpArrow', target: targetCell,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(targetCell.classList).toContain('e-appointment-border');
        });

        it('shiftDownArrow key testing', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(targetCell.classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({
                action: 'shiftDownArrow', target: targetCell,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(targetCell.classList).toContain('e-appointment-border');
        });

        it('mousedown key testing', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(workCells[17].classList).toContain('e-selected-cell');
            expect(workCells[17].getAttribute('aria-selected')).toEqual('true');
            expect(workCells[12].classList).not.toContain('e-selected-cell');
            expect(workCells[12].getAttribute('aria-selected')).toEqual('false');
            util.triggerMouseEvent(workCells[12], 'click');
            expect(workCells[12].classList).toContain('e-selected-cell');
            expect(workCells[12].getAttribute('aria-selected')).toEqual('true');
            expect(workCells[17].classList).not.toContain('e-selected-cell');
            expect(workCells[17].getAttribute('aria-selected')).toEqual('false');
        });
    });

    describe('Month Agenda view rendering with multiple resource', () => {
        let schObj: Schedule;
        let restemplate: string = '<div class="template-wrap"></div><div style="background:pink">${getResourceName(data)}</div>';
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', selectedDate: new Date(2018, 3, 1),
                views: ['MonthAgenda'], currentView: 'MonthAgenda',
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
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking resource rendering with resource data', () => {
            let row1: Element = schObj.element.querySelector('.e-appointment-wrap').children[0].children[0].children[0];
            expect(row1.getAttribute('role')).toEqual('row');
            expect(row1.childElementCount).toEqual(3);
            let parElem1: HTMLElement = row1.children[0] as HTMLElement;
            expect(parElem1.getAttribute('rowspan')).toEqual('2');
            let parElem2: HTMLElement = row1.children[1] as HTMLElement;
            expect(parElem2.getAttribute('rowspan')).toEqual('1');
            let row2: Element = schObj.element.querySelector('.e-appointment-wrap').children[0].children[0].children[1];
            expect(row2.getAttribute('role')).toEqual('row');
            expect(row2.childElementCount).toEqual(2);
        });

        it('Checking resource template', () => {
            let row1: Element = schObj.element.querySelector('.e-appointment-wrap').children[0].children[0].children[0];
            let parTd: HTMLElement = row1.children[0] as HTMLElement;
            let childDiv: HTMLElement = parTd.children[0] as HTMLElement;
            expect(childDiv.className).toEqual('template-wrap');
        });

        it('Checking resource rendering with empty data', () => {
            let lastWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')
            [schObj.element.querySelectorAll('.e-work-cells').length - 1] as HTMLElement;
            lastWorkCell.click();
            let emptyDiv: Element = schObj.element.querySelector('.e-appointment-wrap').children[0];
            expect(emptyDiv.className).toContain('e-no-event');
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
