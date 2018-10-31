/**
 * Schedule work week view spec 
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Schedule, CellClickEventArgs, NavigatingEventArgs, ActionEventArgs } from '../../../src/schedule/index';
import { Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { triggerMouseEvent } from '../util.spec';
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule work week view', () => {
    describe('Initial load', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-work-week-view')).toBeTruthy();
        });

        it('check active view class on Toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeTruthy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('time cells', () => {
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });

        it('work cells', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 2).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 5);
        });
    });

    describe('time scale property', () => {
        let schObj: Schedule;
        let cellStartTime: number;
        let cellEndTime: number;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                currentView: 'WorkWeek',
                timeScale: {
                    interval: 60, slotCount: 1,
                    majorSlotTemplate: '<span>${getTimeIn12(data.date)}</span>',
                    minorSlotTemplate: '<span>${getTimeIn12(data.date)}</span>'
                },
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                },
                selectedDate: new Date(2017, 9, 4)
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('interval and slotCount', () => {
            expect(schObj.getWorkCellElements().length).toEqual(24 * 5);

            schObj.timeScale = { interval: 120, slotCount: 2 };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(24 * 5);
        });

        it('cell click', () => {
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 1).getTime());

            schObj.timeScale = { interval: 60, slotCount: 2 };
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
        });

        it('majorSlotTemplate and minorSlotTemplate', () => {
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>12:00 AM</span>');
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table .e-time-cells').innerHTML).
                toEqual('<span>12:30 AM</span>');

            schObj.timeScale = {
                majorSlotTemplate: '<span>${getTimeIn24(data.date)}</span>',
                minorSlotTemplate: '<span>${getTimeIn24(data.date)}</span>'
            };
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>00:00</span>');
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table .e-time-cells').innerHTML).
                toEqual('<span>00:30</span>');
        });

        it('TIme scale disable mode', () => {
            schObj.timeScale = { enable: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(1 * 5);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 6).getTime());
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
            schObj = new Schedule({ height: '600px', width: '500px', currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('600px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(600);
        });

        it('start and end hour', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4),
                startHour: '04:00', endHour: '11:00',
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(14 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>4:00 AM</span>');

            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(16 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>8:00 AM</span>');
        });

        it('work hours start and end', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(12 * 5);

            schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);

            schObj.workHours = { highlight: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
        });

        it('show weekend', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                showWeekend: false
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">16</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');

            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
        });

        it('work days', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                workDays: [0, 1, 3, 4]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 4);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);

            schObj.workDays = [0, 2, 3];
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 3);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);

            schObj.showWeekend = false;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 3);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
        });

        it('first day of week', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2
            });
            schObj.appendTo('#Schedule');
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Tue</div><div class="e-header-date e-navigate" role="link">3</div>');

            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('date format', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                dateFormat: 'MMM dd yyyy'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 02 2017 - Oct 06 2017');

            schObj.dateFormat = 'dd MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('02 Oct 2017 - 06 Oct 2017');
        });

        it('date header template', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Mon, 10/2</span>');

            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/2/17, 12:00 AM</span>');
        });

        it('cell template', () => {
            let templateEle: HTMLElement = createElement('div', {
                innerHTML: '<span class="custom-element"></span>'
            });
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                cellTemplate: templateEle.innerHTML
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(49 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual(templateEle.innerHTML);

            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual('<span>10/2/17, 12:00 AM</span>');
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/5/17, 12:00 AM</span>');
        });

        it('check current date class', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek',
                workDays: [0, 1, 2, 3, 4, 5, 6]
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-current-day').classList).toContain('e-header-cells');
        });

        it('work cell click', () => {
            schObj = new Schedule({
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-date-header-container .e-header-cells .e-navigate') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(createdFn).toHaveBeenCalledTimes(1);
            expect(beginFn).toHaveBeenCalledTimes(1);
            expect(endFn).toHaveBeenCalledTimes(1);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(renderFn).toHaveBeenCalledTimes(300);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(600);
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
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
                currentDate: new Date(2017, 9, 12), previousDate: new Date(2017, 9, 5)
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('cancel date navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
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
                currentView: 'Day', previousView: 'WorkWeek'
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            schObj = new Schedule({
                actionBegin: (e: ActionEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });

        it('cancel view navigating', () => {
            schObj = new Schedule({
                navigating: (e: NavigatingEventArgs) => {
                    e.cancel = true;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });
    });

    describe('method for inerval count', () => {
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
        it('interval count', () => {
            schObj = new Schedule({
                height: '550px', width: '500px', currentView: 'WorkWeek',
                views: [{ option: 'WorkWeek', interval: 2 }],
                selectedDate: new Date(2017, 9, 5)
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(5 * 2);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5 * 2);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 13, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 16 - 27, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">16</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 13, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
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
                currentView: 'WorkWeek',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(15);
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
                currentView: 'WorkWeek',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(12);
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
                currentView: 'WorkWeek',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(25);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(5);
        });
    });
});
