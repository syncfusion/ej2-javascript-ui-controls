/**
 * Schedule Week view spec
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

describe('Schedule Week view', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-week-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeTruthy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('time cells', () => {
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).
                toEqual('<span>12:00 AM</span>');
        });

        it('work cells', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">8</div>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 5);
        });

        it('checking content rows', () => {
            expect(schObj.activeView.getContentRows().length).toEqual(0);
        });
    });

    describe('Getting Week numbers while changing weekRule property', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const schOptions: ScheduleModel = {
                selectedDate: new Date(2020, 11, 29),
                height: '600px', currentView: 'Week',
                showWeekNumber: true
            };
            schObj = util.createSchedule(schOptions, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Week number testing for when weekRule set to FirstDay', () => {
            schObj.weekRule = 'FirstDay';
            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toBe('1');
        });
        it('Week number testing for when weekRule set to FirstFourDayWeek', () => {
            schObj.weekRule = 'FirstFourDayWeek';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toBe('53');
        });
        it('Week number testing for when weekRule set to FirstFullWeek', () => {
            schObj.weekRule = 'FirstFullWeek';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-cells') as HTMLElement).innerText).toBe('52');
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
            const model: ScheduleModel = { height: '600px', width: '500px', currentView: 'Week', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.style.width).toEqual('500px');
            expect(schObj.element.style.height).toEqual('600px');
            expect(schObj.element.offsetWidth).toEqual(500);
            expect(schObj.element.offsetHeight).toEqual(600);
        });

        it('start and end hour', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 4), startHour: '04:00', endHour: '11:00' };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(14 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4 * 5);
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>4:00 AM</span>');
            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-time-cells-wrap .e-schedule-table tr').length).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody tr').length);
            expect(schObj.element.querySelector('.e-time-cells-wrap .e-schedule-table tr td').innerHTML).toEqual('<span>8:00 AM</span>');
            expect(schObj.getWorkCellElements().length).toEqual(16 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
        });

        it('work hours start and end', () => {
            const model: ScheduleModel = {
                currentView: 'Week', selectedDate: new Date(2017, 9, 4), workHours: { highlight: true, start: '10:00', end: '16:00' }
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(12 * 5);
            schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
            schObj.workHours = { highlight: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(0);
        });

        it('show weekend', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5), showWeekend: false };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">16</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">9</div>');
            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">8</div>');
        });

        it('work days', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5), workDays: [0, 1, 3, 4] };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            schObj.workDays = [0, 2, 3];
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
            schObj.showWeekend = false;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(48 * 3);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
        });

        it('first day of Week', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2 };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Tue</div><div class="e-header-date e-navigate" role="link">3</div>');
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('Week Number and firstDayofWeek Combination', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2019, 0, 1), showWeekNumber: true };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">30</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 1">1</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">23</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 52">52</span>');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sat</div><div class="e-header-date e-navigate" role="link">22</div>');
            expect(schObj.element.querySelectorAll('.e-week-number')[0].innerHTML).toBe('<span title="Week 52">52</span>');
        });

        it('date format', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5), dateFormat: 'MMM dd yyyy' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 01 2017 - Oct 07 2017');
            schObj.dateFormat = 'dd MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('01 Oct 2017 - 07 Oct 2017');
        });

        it('date header template', () => {
            const model: ScheduleModel = {
                currentView: 'Week', selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sun, 10/1</span>');
            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
        });

        it('cell template', () => {
            const templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5), cellTemplate: templateEle.innerHTML };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(49 * 7);
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).toEqual(templateEle.innerHTML);
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-all-day-cells').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/4/17, 12:00 AM</span>');
        });

        it('check current date class', () => {
            const model: ScheduleModel = { currentView: 'Week' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-current-day').classList).toContain('e-header-cells');
        });

        it('work cell click', () => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            firstWorkCell.click();
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('header cell click day view navigation', () => {
            const navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            const model: ScheduleModel = { navigating: navFn, currentView: 'Week', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            expect(navFn).toHaveBeenCalledTimes(0);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-date-header-container .e-header-cells .e-navigate') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('minDate and maxDate', () => {
            const model: ScheduleModel = {
                currentView: 'Week',
                minDate: new Date(2017, 8, 28),
                selectedDate: new Date(2017, 9, 5),
                maxDate: new Date(2017, 9, 12)
            };
            schObj = util.createSchedule(model, []);
            const prevButton: HTMLElement = schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS);
            const nextButton: HTMLElement = schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS);
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 24 - 30, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 24 - 30, 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            schObj.minDate = new Date(2017, 8, 24);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 6);
            schObj.dataBind();
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 24 - 30, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Day');
            schObj.currentView = 'Week';
            schObj.minDate = new Date(2017, 9, 2);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 6);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Week');
            (schObj.element.querySelectorAll('.e-date-header-container .e-header-cells .e-navigate')[6] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Week');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.classList.contains('e-popup-close')).toBeTruthy();
        });

        it('EJ2-50109 - Add icon shows on mobile when disabled adding events', () => {
            const model: ScheduleModel = {
                currentView: 'Week',
                enableAdaptiveUI: true,
                eventSettings: { allowAdding : false },
                selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const addButton: HTMLElement = schObj.element.querySelector('.e-add');
            expect(addButton.classList).toContain('e-hidden');
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
            const createdFn: jasmine.Spy = jasmine.createSpy('createdEvent');
            const clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            const dblClickFn: jasmine.Spy = jasmine.createSpy('dblClickEvent');
            const beginFn: jasmine.Spy = jasmine.createSpy('beginEvent');
            const endFn: jasmine.Spy = jasmine.createSpy('endEvent');
            const navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            const renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
            const model: ScheduleModel = {
                created: createdFn,
                cellClick: clickFn,
                cellDoubleClick: dblClickFn,
                actionBegin: beginFn,
                actionComplete: endFn,
                navigating: navFn,
                renderCell: renderFn,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(createdFn).toHaveBeenCalledTimes(1);
            expect(beginFn).toHaveBeenCalledTimes(1);
            expect(endFn).toHaveBeenCalledTimes(1);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(clickFn).toHaveBeenCalledTimes(1);
            expect(renderFn).toHaveBeenCalledTimes(400);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(800);
            expect(beginFn).toHaveBeenCalledTimes(2);
            expect(endFn).toHaveBeenCalledTimes(2);
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName1 = args.name,
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[3], 'mouseup');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(eventName1).toEqual('select');
            expect(eventName2).toEqual('cellClick');
            expect(eventName3).toEqual('popupOpen');
        });

        it('single and multiple cell click and selection', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                cellClick: (args: CellClickEventArgs) => eventName = args.name,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.getSelectedElements().length).toEqual(0);
            util.triggerMouseEvent(workCells[135], 'mousedown');
            util.triggerMouseEvent(workCells[149], 'mousemove');
            util.triggerMouseEvent(workCells[149], 'mouseup');
            expect(eventName).toEqual('select');
            expect(schObj.getSelectedElements().length).toEqual(3);
            eventName = null;
            util.triggerMouseEvent(workCells[136], 'click');
            expect(eventName).toEqual('cellClick');
            expect(schObj.getSelectedElements().length).toEqual(1);
        });

        it('multi cell select', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[135], 'mousedown');
            util.triggerMouseEvent(workCells[149], 'mousemove');
            util.triggerMouseEvent(workCells[149], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(eventName).toEqual('select');
        });

        it('validate start and end time on multi cell select', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[135], 'mousedown');
            util.triggerMouseEvent(workCells[149], 'mousemove');
            util.triggerMouseEvent(workCells[149], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(schObj.activeCellsData.startTime).toEqual(new Date(2017, 9, 3, 9, 30, 0));
            expect(schObj.activeCellsData.endTime).toEqual(new Date(2017, 9, 3, 11, 0, 0));
            expect(eventName).toEqual('select');
        });

        it('allow multiple row selection is false', () => {
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => args.allowMultipleRow = false,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[192], 'mousemove');
            util.triggerMouseEvent(workCells[192], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(5);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[136], 'mousemove');
            util.triggerMouseEvent(workCells[136], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(5);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[190], 'mousemove');
            util.triggerMouseEvent(workCells[190], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(5);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[134], 'mousemove');
            util.triggerMouseEvent(workCells[134], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(5);
        });

        it('allow multiple row selection is true', () => {
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => args.allowMultipleRow = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[192], 'mousemove');
            util.triggerMouseEvent(workCells[192], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(55);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[136], 'mousemove');
            util.triggerMouseEvent(workCells[136], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(45);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[190], 'mousemove');
            util.triggerMouseEvent(workCells[190], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(45);
            util.triggerMouseEvent(workCells[163], 'mousedown');
            util.triggerMouseEvent(workCells[134], 'mousemove');
            util.triggerMouseEvent(workCells[134], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(55);
        });

        it('cell click', () => {
            let cellStartTime: number;
            let cellEndTime: number;
            let eventName: string;
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 4, 0, 30).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
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
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => {
                    cellStartTime = args.startTime.getTime();
                    cellEndTime = args.endTime.getTime();
                    eventName = args.name;
                },
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 4, 0, 30).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
        });

        it('date navigating', () => {
            const actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'dateNavigate' };
            const actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'dateNavigate' };
            const navArgs: NavigatingEventArgs = {
                action: 'date', cancel: false, name: 'navigating',
                currentDate: new Date(2017, 9, 12), previousDate: new Date(2017, 9, 5)
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel date navigate in action begin', () => {
            const model: ScheduleModel = {
                actionBegin: (e: ActionEventArgs) => e.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('cancel date navigating', () => {
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });

        it('view navigating', () => {
            const actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'viewNavigate' };
            const actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'viewNavigate' };
            const navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Day', previousView: 'Week'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            const model: ScheduleModel = {
                actionBegin: (e: ActionEventArgs) => e.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });

        it('cancel view navigating', () => {
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'Week', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });
    });

    describe('method for interval count', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });
        it('interval count', () => {
            const model: ScheduleModel = {
                height: '550px', width: '500px', currentView: 'Week',
                views: [{ option: 'Week', interval: 2 }], selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(2 * 7);
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7 * 2);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 14, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 15 - 28, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">15</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 14, 2017');
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
        });
    });

    describe('Time format testing by changing timeFormat property', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { currentView: 'Week', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking format of the time value displayed in schedule', () => {
            schObj.timeFormat = 'HH:mm';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-time-slots')[0].innerHTML).toEqual('<span>00:00</span>');
            schObj.timeFormat = 'hh:mm:ss';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-time-slots')[0].innerHTML).toEqual('<span>12:00:00</span>');
            schObj.timeFormat = 'hh:mm:ss a';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-time-slots')[0].innerHTML).toEqual('<span>12:00:00 AM</span>');
        });
    });

    describe('Resources with group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Week',
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const activeView: any = schObj.activeView;
            util.destroy(schObj);
            activeView.changeCurrentTimePosition();
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(5);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });

        it('Checking current time indicator', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(3);
                done();
            };
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Week',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(21);
        });
    });

    describe('Resources with group by date', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Week',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(35);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(7);
        });
    });


    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '500px', height: '500px', currentView: 'Week', selectedDate: new Date(2017, 9, 30) };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(4);
            const blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(blockEvent.offsetTop).toEqual(720);
            expect(blockEvent.offsetWidth).toEqual(57);
            expect(blockEvent.offsetHeight).toEqual(108);
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(53);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(26);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('appointments rendering on block events on next week - testing -1', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(53);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 13, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 13, 11, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 10, 12, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 12, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
            schObj.selectedDate = new Date(2017, 10, 12);
            schObj.dataBind();
        });
        it('appointments rendering on block events on next week - testing -2', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(8);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(5);
                done();
            };
            expect(schObj.eventsData.length).toEqual(8);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(5);
            schObj.selectedDate = new Date(2017, 10, 12);
            schObj.dataBind();
        });

        it('Presence of data in popup test', () => {
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 13, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 13, 11, 30);
            endObj.dataBind();
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                expect(args.type).toEqual('ValidationAlert');
                expect(args.data).toBeTruthy();
            };
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 10, 12, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 12, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
        });
    });

    describe('Multi level resource rendering in block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'Week',
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
                }]
            };
            schObj = util.createSchedule(schOptions, blockData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resource add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(72);
                expect(addedEvent.offsetWidth).toEqual(33);
                expect(addedEvent.offsetHeight).toEqual(72);
                done();
            };
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const timeCellsArea: HTMLElement = schObj.element.querySelector('.e-time-cells-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 648);
            expect(contentArea.scrollTop).toEqual(648);
            expect(timeCellsArea.scrollTop).toEqual(648);
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 30, 1, 0);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 30, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('resource edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(684);
                expect(editedEvent.offsetWidth).toEqual(33);
                expect(editedEvent.offsetHeight).toEqual(144);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30, 10, 0);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30, 11, 30);
            endObj.dataBind();
            const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
            saveButton.click();
            const alertDialog: HTMLElement = document.querySelector('.e-quick-dialog') as HTMLElement;
            expect(schObj.quickPopup.quickDialog.visible).toBe(true);
            expect(alertDialog.querySelector('.e-dlg-content').innerHTML)
                .toEqual('Events cannot be scheduled within the blocked time range.');
            const okButton: HTMLElement = alertDialog.querySelector('.e-quick-alertok') as HTMLElement;
            okButton.click();
            expect(schObj.quickPopup.quickDialog.visible).toBe(false);
            const startRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startRevisedObj.value = new Date(2017, 9, 31, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 11, 30);
            endRevisedObj.dataBind();
            saveButton.click();
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
