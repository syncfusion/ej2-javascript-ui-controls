/**
 * Schedule Month view spec 
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Schedule, CellClickEventArgs, NavigatingEventArgs, ActionEventArgs, Day, Week, WorkWeek, Month, Agenda }
    from '../../../src/schedule/index';
import { triggerMouseEvent } from '../util.spec';
import { resourceData } from '../base/datasource.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule Month view', () => {
    describe('Initial load', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ currentView: 'Month', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-month-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(35);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeFalsy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
        });

        it('work cells', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('<div class="e-date-header e-navigate">Oct 1</div>');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells')[6].innerHTML).
                toEqual('<span>Saturday</span>');
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

        it('horizontal scroll', () => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let headerCellsArea: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            (schObj.activeView as any).onContentScroll({ target: contentArea });
            expect(contentArea.scrollLeft).toEqual(0);
            expect(headerCellsArea.scrollLeft).toEqual(0);
        });
    });

    describe('Current Day Highlight testing', () => {
        let schObj: Schedule;
        beforeAll((): void => {
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
            schObj = new Schedule({ height: '250px', width: '500px', currentView: 'Month' }, '#Schedule');
        });
        afterAll((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('checking default current day highlight', () => {
            expect(schObj.element.querySelectorAll('.e-header-cells').item(new Date().getDay()).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different firstDayOfWeek', () => {
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different workDays', () => {
            schObj.workDays = [0, 1, 2, 3, 4, 5, 6];
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with showWeekend property', () => {
            schObj.showWeekend = false;
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });
    });

    describe('Dependent properties', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('width and height', () => {
            schObj = new Schedule({ height: '250px', width: '500px', currentView: 'Month', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('250px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(250);
        });

        it('start and end hour', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 4),
                startHour: '04:00', endHour: '11:00',
            });
            schObj.appendTo('#Schedule');
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
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
            });
            schObj.appendTo('#Schedule');
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
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5),
                showWeekend: false
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(25);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Monday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('2');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Monday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('30');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Monday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('27');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Monday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('30');

            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(35);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(25);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('29');
        });

        it('work days', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5),
                workDays: [0, 1, 3, 4]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(35);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(5 * 4);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
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

        it('first day of week', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(42);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Tuesday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('26');

            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(42);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Monday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('25');
        });

        it('date format', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5),
                dateFormat: 'y MMM'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('2017 Oct');

            schObj.dateFormat = 'MMM y';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 2017');
        });

        // Date header template not applicable in Month view

        it('cell template', () => {
            let templateEle: HTMLElement = createElement('div', {
                innerHTML: '<span class="custom-element"></span>'
            });
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5),
                cellTemplate: templateEle.innerHTML
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(schObj.getWorkCellElements().length);
            let workCellEle: HTMLElement = createElement('div', {
                innerHTML: '<div class="e-date-header e-navigate">4</div><span>10/4/17, 12:00 AM</span>'
            });
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual(workCellEle.innerHTML);
        });

        it('check current date class', () => {
            schObj = new Schedule({
                currentView: 'Month'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-current-day').classList).toContain('e-header-cells');
            expect(schObj.element.querySelector('.e-current-date').classList).toContain('e-work-cells');
        });

        it('work cell click', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            firstWorkCell.click();
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('header cell click day view navigation', () => {
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            schObj = new Schedule({
                navigating: navFn,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-work-cells').innerHTML).toEqual('<div class="e-date-header e-navigate">Oct 1</div>');
            (schObj.element.querySelector('.e-date-header') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('disable header bar', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5), showHeaderBar: false
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
        });
    });

    describe('Client side events', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('events call confirmation', () => {
            let createdFn: jasmine.Spy = jasmine.createSpy('createdEvent');
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            let dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
            let beginFn: jasmine.Spy = jasmine.createSpy('beginEvent');
            let endFn: jasmine.Spy = jasmine.createSpy('endEvent');
            let navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            let renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
            schObj = new Schedule({
                created: createdFn,
                cellClick: clickFn,
                cellDoubleClick: dblClickFn,
                actionBegin: beginFn,
                actionComplete: endFn,
                navigating: navFn,
                renderCell: renderFn,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(createdFn).toHaveBeenCalledTimes(1);
            expect(beginFn).toHaveBeenCalledTimes(1);
            expect(endFn).toHaveBeenCalledTimes(1);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(renderFn).toHaveBeenCalledTimes(42);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(84);
            expect(beginFn).toHaveBeenCalledTimes(2);
            expect(endFn).toHaveBeenCalledTimes(2);
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('cell click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
            workCell.click();
            expect(workCell.classList).not.toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('false');
        });

        it('cell double click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            triggerMouseEvent(workCell, 'click');
            triggerMouseEvent(workCell, 'dblclick');
        });

        it('date navigating', () => {
            let actionBeginArgs: ActionEventArgs = {
                cancel: false, name: 'actionBegin',
                requestType: 'dateNavigate'
            };
            let actionCompleteArgs: ActionEventArgs = {
                cancel: false, name: 'actionComplete',
                requestType: 'dateNavigate'
            };
            let navArgs: NavigatingEventArgs = {
                action: 'date', cancel: false, name: 'navigating',
                currentDate: new Date(2017, 10, 5), previousDate: new Date(2017, 9, 5)
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    args = e;
                },
                actionBegin: (e: ActionEventArgs) => {
                    beginArgs = e;
                },
                actionComplete: (e: ActionEventArgs) => {
                    completeArgs = e;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel date navigate in action begin', () => {
            schObj = new Schedule({
                actionBegin: (e: ActionEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });

        it('cancel date navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });

        it('view navigating', () => {
            let actionBeginArgs: ActionEventArgs = {
                cancel: false, name: 'actionBegin',
                requestType: 'viewNavigate'
            };
            let actionCompleteArgs: ActionEventArgs = {
                cancel: false, name: 'actionComplete',
                requestType: 'viewNavigate'
            };
            let navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Week', previousView: 'Month'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    args = e;
                },
                actionBegin: (e: ActionEventArgs) => {
                    beginArgs = e;
                },
                actionComplete: (e: ActionEventArgs) => {
                    completeArgs = e;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            schObj = new Schedule({
                actionBegin: (e: ActionEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });

        it('cancel view navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });

        it('getCellDetails', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            let data: CellClickEventArgs = schObj.getCellDetails(schObj.element.querySelector('.e-work-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 2).getTime());
            expect(data.isAllDay).toEqual(true);

            let tdElement: HTMLElement = schObj.element.querySelector('.e-work-cells');
            tdElement.removeAttribute('data-date');
            expect(schObj.getCellDetails(tdElement)).toBeUndefined();
        });

        it('scrollTo && adjustEventWrapper', () => {
            schObj = new Schedule({
                currentView: 'Month', selectedDate: new Date(2017, 9, 5), height: 500, width: 500
            });
            schObj.appendTo('#Schedule');
            schObj.scrollTo('06:00');
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollTop).toEqual(0);
            schObj.adjustEventWrapper();
            // No expectaion because Month view does not need event wrapper adjustment
        });

        it('interval count', () => {
            schObj = new Schedule({
                height: '550px', width: '500px', currentView: 'Month',
                views: [{ option: 'Month', interval: 2 }], selectedDate: new Date(2017, 9, 4)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(63);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            expect(schObj.element.querySelectorAll(('.e-work-cells') as any)[6].innerHTML).
                toEqual('<div class="e-date-header e-navigate">7</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('26');
            expect(schObj.element.querySelectorAll(('.e-work-cells') as any)[6].innerHTML).
                toEqual('<div class="e-date-header e-navigate">2</div>');

            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });
    });

    describe('Resource group single level', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'Month',
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00', OwnerCss: 'e-nancy' },
                            { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398', OwnerCss: 'e-steven' },
                            { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1', OwnerCss: 'e-michael' }
                        ],
                        textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId',
                        colorField: 'OwnerColor', cssClassField: 'OwnerCss'
                    }
                ],
                eventSettings: { dataSource: resourceData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('Checking appointment element', () => {
            let appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appElement.length).toBeGreaterThan(0);
        });
        it('Checking resource grouping setmodel', (done: Function) => {
            schObj.dataBound = () => {
                let appElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(appElement.length).toBeGreaterThan(0);
                done();
            };
            schObj.group.resources = [];
            schObj.dataBind();
        });
    });

    describe('Resources with group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }],
                eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(3);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });

        it('work cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-cells').length).toBe(105);
        });

        it('work day cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-days').length).toBe(75);
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2] },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                    }],
                eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(3);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });

        it('work cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-cells').length).toBe(105);
        });

        it('work day cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-days').length).toBe(60);
        });
    });

    describe('Resource header template of Resources in group', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2018, 3, 1),
                resourceHeaderTemplate: '<p>${resourceData.text}</p>',
                group: {
                    resources: ['Rooms']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }],
                eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('template text', () => {
            expect(schObj.element.querySelector('.e-date-header-wrap .e-resource-cells').innerHTML).toBe('<p>ROOM 1</p>');
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(2);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(2);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(14);
        });
    });

    describe('Resources with group by date', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                            { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                            { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }],
                eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tr').length).toBe(3);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(35);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(7);
        });

        it('work cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-cells').length).toBe(105);
        });

        it('work day cells count', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap .e-work-days').length).toBe(75);
        });
    });
});
