/**
 * Schedule work week view spec 
 */
import { createElement } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, CellClickEventArgs,
    NavigatingEventArgs, ActionEventArgs, SelectEventArgs, PopupOpenEventArgs
} from '../../../src/schedule/index';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule work week view', () => {
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

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll(() => {
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
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
        beforeAll(() => {
            let model: ScheduleModel = {
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
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
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
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('width and height', () => {
            let model: ScheduleModel = { height: '600px', width: '500px', currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.style.width).toEqual('500px');
            expect(schObj.element.style.height).toEqual('600px');
            expect(schObj.element.offsetWidth).toEqual(500);
            expect(schObj.element.offsetHeight).toEqual(600);
        });

        it('start and end hour', () => {
            let model: ScheduleModel = {
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4),
                startHour: '04:00', endHour: '11:00'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(14 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>4:00 AM</span>');
            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(16 * 5);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>8:00 AM</span>');
        });

        it('work hours start and end', () => {
            let model: ScheduleModel = {
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
            };
            schObj = util.createSchedule(model, []);
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
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5), showWeekend: false };
            schObj = util.createSchedule(model, []);
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
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5), workDays: [0, 1, 3, 4] };
            schObj = util.createSchedule(model, []);
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
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2 };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Tue</div><div class="e-header-date e-navigate" role="link">3</div>');
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('Week Number and firstDayofWeek Combination', () => {
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2019, 0, 1), showWeekNumber: true };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">31</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 1">1</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">24</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 52">52</span>');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">24</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 52">52</span>');
        });

        it('date format', () => {
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5), dateFormat: 'MMM dd yyyy' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 02 2017 - Oct 06 2017');
            schObj.dateFormat = 'dd MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('02 Oct 2017 - 06 Oct 2017');
        });

        it('date header template', () => {
            let model: ScheduleModel = {
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Mon, 10/2</span>');
            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/2/17, 12:00 AM</span>');
        });

        it('cell template', () => {
            let templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            let model: ScheduleModel = {
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5),
                cellTemplate: templateEle.innerHTML
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(49 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).toEqual(templateEle.innerHTML);
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual('<span>10/2/17, 12:00 AM</span>');
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/5/17, 12:00 AM</span>');
        });

        it('check current date class', () => {
            let model: ScheduleModel = { currentView: 'WorkWeek', workDays: [0, 1, 2, 3, 4, 5, 6] };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-current-day').classList).toContain('e-header-cells');
        });

        it('work cell click', () => {
            let model: ScheduleModel = { currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
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
            let model: ScheduleModel = { navigating: navFn, currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-date-header-container .e-header-cells .e-navigate') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('minDate and maxDate', () => {
            let model: ScheduleModel = {
                currentView: 'WorkWeek',
                minDate: new Date(2017, 8, 28),
                selectedDate: new Date(2017, 9, 5),
                maxDate: new Date(2017, 9, 12)
            };
            schObj = util.createSchedule(model, []);
            let prevButton: HTMLElement = schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS);
            let nextButton: HTMLElement = schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS);
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 06, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 25 - 29, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 25 - 29, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 06, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 09 - 13, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 09 - 13, 2017');
            schObj.minDate = new Date(2017, 8, 24);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 5);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 06, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 25 - 29, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Day');
            schObj.currentView = 'WorkWeek';
            schObj.minDate = new Date(2017, 9, 3);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 5);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 02 - 06, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('WorkWeek');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[4] as HTMLElement).click();
            expect(schObj.currentView).toEqual('WorkWeek');
        });
    });

    describe('Client side events', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
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

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            let model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName1 = args.name,
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[3], 'mouseup');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(eventName1).toEqual('select');
            expect(eventName2).toEqual('cellClick');
            expect(eventName3).toEqual('popupOpen');
        });

        it('multi cell select', () => {
            let eventName: string;
            let model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[97], 'mousedown');
            util.triggerMouseEvent(workCells[107], 'mousemove');
            util.triggerMouseEvent(workCells[107], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(eventName).toEqual('select');
        });

        it('validate start and end time on multi cell select', () => {
            let eventName: string;
            let model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[135], 'mousedown');
            util.triggerMouseEvent(workCells[149], 'mousemove');
            util.triggerMouseEvent(workCells[149], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(schObj.activeCellsData.startTime).toEqual(new Date(2017, 9, 3, 9, 30, 0));
            expect(schObj.activeCellsData.endTime).toEqual(new Date(2017, 9, 3, 11, 0, 0));
            expect(eventName).toEqual('select');
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
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            let model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
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
            let model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5, 0, 30).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            let model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
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
            let model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel date navigate in action begin', () => {
            let model: ScheduleModel = {
                actionBegin: (e: ActionEventArgs) => e.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('cancel date navigating', () => {
            let model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('view navigating', () => {
            let actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'viewNavigate' };
            let actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'viewNavigate' };
            let navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Day', previousView: 'WorkWeek'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            let model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            let model: ScheduleModel = {
                actionBegin: (e: ActionEventArgs) => e.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });

        it('cancel view navigating', () => {
            let model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'WorkWeek', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });
    });

    describe('method for inerval count', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });
        it('interval count', () => {
            let model: ScheduleModel = {
                height: '550px', width: '500px', currentView: 'WorkWeek',
                views: [{ option: 'WorkWeek', interval: 2 }], selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'WorkWeek',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'WorkWeek',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2] },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'WorkWeek',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                        { text: 'Steven', id: 3, groupId: 2, color: '#f8a398' },
                        { text: 'Michael', id: 5, groupId: 1, color: '#7499e1' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
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

    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'WorkWeek',
                selectedDate: new Date(2017, 9, 30)
            };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(2);
            let blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(blockEvent.offsetTop).toEqual(720);
            expect(blockEvent.offsetWidth).toEqual(80);
            expect(blockEvent.offsetHeight).toEqual(108);
        });

        it('add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            util.triggerScrollEvent(contentArea, 648);
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(74);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('edit event', (done: Function) => {
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.style.width).toEqual('46%');
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering  in block events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'WorkWeek',
                selectedDate: new Date(2017, 9, 30),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', RoomId: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', RoomId: 2, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'RoomId', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }
                ]
            };
            schObj = util.createSchedule(schOptions, blockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resource add event', (done: Function) => {
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            let timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
            util.triggerScrollEvent(contentArea, 648);
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(33);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            schObj.dataBind();
        });

        it('resource edit event', (done: Function) => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 0);
            startObj.dataBind();
            let endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            let saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            let alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            let okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            let startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            let endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                let editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(33);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            schObj.dataBind();
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
