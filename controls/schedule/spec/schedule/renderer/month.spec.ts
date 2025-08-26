/**
 * Schedule Month view spec
 */
import { createElement, closest, Browser } from '@syncfusion/ej2-base';
import {
    Schedule, ScheduleModel, CellClickEventArgs, NavigatingEventArgs, ActionEventArgs,
    Day, Week, WorkWeek, Month, Agenda, EJ2Instance, SelectEventArgs, PopupOpenEventArgs, ViewsModel
} from '../../../src/schedule/index';
import { RecurrenceEditor } from '../../../src/recurrence-editor/recurrence-editor';
import { resourceData, testData, defaultData } from '../base/datasource.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData } from '../base/datasource.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Schedule Month view', () => {
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
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
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
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
            expect(schObj.element.getAttribute('aria-labelledby')).toEqual(schObj.element.querySelector('.e-schedule-table.e-content-table').getAttribute('id'));
            expect(schObj.element.querySelector('.e-schedule-table.e-content-table').getAttribute('aria-label')).
                toEqual('Month Start Sunday, October 1, 2017 Ends At Saturday, November 4, 2017');
            expect(firstWorkCell.getAttribute('aria-label')).toEqual('Sunday, October 1, 2017');
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
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            const headerCellsArea: HTMLElement = schObj.element.querySelector('.e-date-header-wrap') as HTMLElement;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (schObj.activeView as any).onContentScroll({ target: contentArea });
            expect(contentArea.scrollLeft).toEqual(0);
            expect(headerCellsArea.scrollLeft).toEqual(0);
        });
    });

    describe('custom month view with displayDate', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { views: [{ option: 'Month', displayName: 'Month', displayDate: new Date(2020, 4, 20) }] };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 4, 17).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 27).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May - June 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
        });

        it('previous month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 3, 5).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 4, 16).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April - May 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });
        it('next month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 4, 17).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 27).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May - June 2020');
        });
    });

    describe('custom month view with numberOfWeeks', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { views: [{ option: 'Month', displayName: 'Month', numberOfWeeks: 6 }], selectedDate: new Date(2020, 4, 20) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 3, 26).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 6).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April - June 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
        });

        it('previous month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 2, 15).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 3, 25).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('March - April 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });
        it('next month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 3, 26).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 6).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April - June 2020');
        });
    });

    describe('custom month view with displayName and numberOfWeeks', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { views: [{ option: 'Month', displayName: 'Month', numberOfWeeks: 6, displayDate: new Date(2020, 4, 20) }] };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 4, 17).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 27).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May - June 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
        });

        it('previous month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 3, 5).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 4, 16).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('April - May 2020');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });
        it('next month start and end dates of custom month view', () => {
            const cells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(cells[0].getAttribute('data-date')).toEqual(new Date(2020, 4, 17).getTime().toString());
            expect(cells[cells.length - 1].getAttribute('data-date')).toEqual(new Date(2020, 5, 27).getTime().toString());
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May - June 2020');
        });
    });

    describe('Current Day Highlight testing', () => {
        let schObj: Schedule;
        beforeAll((): void => {
            const model: ScheduleModel = { height: '250px', width: '500px', currentView: 'Month' };
            schObj = util.createSchedule(model, []);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });

        it('checking default current day highlight', () => {
            expect(schObj.element.querySelectorAll('.e-header-cells').item(new Date().getDay()).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different firstDayOfWeek', () => {
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different workDays', () => {
            schObj.workDays = [0, 1, 2, 3, 4, 5, 6];
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with showWeekend property', () => {
            schObj.showWeekend = false;
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.slice(0, 7).map((date: Date) => date.getDay()).indexOf(new Date().getDay());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
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
            const model: ScheduleModel = { height: '250px', width: '500px', currentView: 'Month', selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.style.width).toEqual('500px');
            expect(schObj.element.style.height).toEqual('250px');
            expect(schObj.element.offsetWidth).toEqual(500);
            expect(schObj.element.offsetHeight).toEqual(250);
        });

        it('start and end hour', () => {
            const model: ScheduleModel = {
                currentView: 'Month', selectedDate: new Date(2017, 9, 4),
                startHour: '04:00', endHour: '11:00'
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
            const model: ScheduleModel = {
                currentView: 'Month', selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
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
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), showWeekend: false };
            schObj = util.createSchedule(model, []);
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
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), workDays: [0, 1, 3, 4] };
            schObj = util.createSchedule(model, []);
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
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2 };
            schObj = util.createSchedule(model, []);
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
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), dateFormat: 'y MMM' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('2017 Oct');
            schObj.dateFormat = 'MMM y';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 2017');
        });

        // Date header template not applicable in Month view

        it('cell template', () => {
            const templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), cellTemplate: templateEle.innerHTML };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(schObj.getWorkCellElements().length);
            const workCellEle: HTMLElement = createElement('div', {
                innerHTML: '<div class="e-date-header e-navigate">4</div><span>10/4/17, 12:00 AM</span>'
            });
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.getAttribute('aria-label')).toEqual('Wednesday, October 4, 2017');
            expect(workCell.innerHTML).toEqual(workCellEle.innerHTML);
        });

        it('dateRange template', () => {
            const model: ScheduleModel = {
                currentView: 'Month',
                selectedDate: new Date(2017, 9, 5),
                dateRangeTemplate: '<div class="date-text">${(data.startDate).getMonth()}-${(data.endDate).getMonth()}</div>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">9-10</div>');
            schObj.dateRangeTemplate = '<div>${getShortDateTime(data.startDate)}-${getShortDateTime(data.endDate)}</div>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div>10/1/17, 12:00 AM-11/4/17, 12:00 AM</div>');
        });

        it('check current date class', () => {
            const model: ScheduleModel = { currentView: 'Month' };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-current-day').classList).toContain('e-header-cells');
            expect(schObj.element.querySelector('.e-current-date').classList).toContain('e-work-cells');
        });

        it('work cell click', () => {
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            firstWorkCell.click();
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('header cell click day view navigation', () => {
            const navFn: jasmine.Spy = jasmine.createSpy('navEvent');
            const model: ScheduleModel = { navigating: navFn, currentView: 'Month', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            expect(navFn).toHaveBeenCalledTimes(0);
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(workCell.getAttribute('aria-label')).toEqual('Sunday, October 1, 2017');
            expect(workCell.innerHTML).toEqual('<div class="e-date-header e-navigate">Oct 1</div>');
            (schObj.element.querySelector('.e-date-header') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(navFn).toHaveBeenCalledTimes(1);
        });

        it('disable header bar', () => {
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), showHeaderBar: false };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
        });

        it('minDate and maxDate', () => {
            const model: ScheduleModel = {
                currentView: 'Month',
                minDate: new Date(2017, 8, 28),
                selectedDate: new Date(2017, 9, 5),
                maxDate: new Date(2017, 10, 12)
            };
            schObj = util.createSchedule(model, []);
            const prevButton: HTMLElement = schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button');
            const nextButton: HTMLElement = schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('September 2017');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('November 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('November 2017');
            schObj.minDate = new Date(2017, 9, 8);
            schObj.selectedDate = new Date(2017, 9, 11);
            schObj.maxDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('false');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(prevButton.getAttribute('aria-disabled')).toEqual('false');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            schObj.minDate = new Date(2017, 9, 1);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 7);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelectorAll('.e-date-header')[7] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Month');
            (schObj.element.querySelectorAll('.e-date-header')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Day');
            expect(schObj.isMinMaxDate()).toEqual(true);
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
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
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

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName1 = args.name,
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[3], 'mouseup');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(eventName1).toEqual('select');
            expect(eventName2).toEqual('cellClick');
            expect(eventName3).toEqual('popupOpen');
        });

        it('multi cell select', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[5], 'mousemove');
            util.triggerMouseEvent(workCells[5], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(eventName).toEqual('select');
        });

        it('validate start and end time on multi cell select', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[5], 'mousemove');
            util.triggerMouseEvent(workCells[5], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(schObj.activeCellsData.startTime).toEqual(new Date(2017, 9, 4, 0, 0, 0));
            expect(schObj.activeCellsData.endTime).toEqual(new Date(2017, 9, 7, 0, 0, 0));
            expect(eventName).toEqual('select');
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
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(workCell.classList).not.toContain('e-selected-cell');
            workCell.click();
            expect(workCell.classList).not.toContain('e-selected-cell');
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
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2017, 9, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2017, 9, 5).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
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
                currentDate: new Date(2017, 10, 5), previousDate: new Date(2017, 9, 5)
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
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
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });

        it('cancel date navigating', () => {
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });

        it('view navigating', () => {
            const actionBeginArgs: ActionEventArgs = { cancel: false, name: 'actionBegin', requestType: 'viewNavigate' };
            const actionCompleteArgs: ActionEventArgs = { cancel: false, name: 'actionComplete', requestType: 'viewNavigate' };
            const navArgs: NavigatingEventArgs = {
                action: 'view', cancel: false, name: 'navigating',
                currentView: 'Week', previousView: 'Month'
            };
            let args: NavigatingEventArgs; let beginArgs: ActionEventArgs; let completeArgs: ActionEventArgs;
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => args = e,
                actionBegin: (e: ActionEventArgs) => beginArgs = e,
                actionComplete: (e: ActionEventArgs) => completeArgs = e,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(args).toEqual(jasmine.objectContaining(navArgs));
            expect(beginArgs).toEqual(jasmine.objectContaining(actionBeginArgs));
            expect(completeArgs).toEqual(jasmine.objectContaining(actionCompleteArgs));
        });

        it('cancel view navigate in action begin', () => {
            const model: ScheduleModel = {
                actionBegin: (e: ActionEventArgs) => e.cancel = true,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });

        it('cancel view navigating', () => {
            const model: ScheduleModel = {
                navigating: (e: NavigatingEventArgs) => e.cancel = true,
                currentView: 'Month', selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('getCellDetails', () => {
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5) };
            schObj = util.createSchedule(model, []);
            const data: CellClickEventArgs = schObj.getCellDetails(schObj.element.querySelector('.e-work-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 2).getTime());
            expect(data.isAllDay).toEqual(true);

            const tdElement: HTMLElement = schObj.element.querySelector('.e-work-cells');
            tdElement.removeAttribute('data-date');
            expect(schObj.getCellDetails(tdElement)).toBeUndefined();
        });

        it('scrollTo', () => {
            const model: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 9, 5), height: 500, width: 500 };
            schObj = util.createSchedule(model, []);
            schObj.scrollTo('06:00');
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollTop).toEqual(0);
        });

        it('interval count', () => {
            const model: ScheduleModel = {
                height: '550px', width: '500px', currentView: 'Month',
                views: [{ option: 'Month', interval: 2 }], selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(63);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            expect(workCell.getAttribute('aria-label')).toEqual('Saturday, October 7, 2017');
            expect(workCell.innerHTML).toEqual('<div class="e-date-header e-navigate">7</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('26');
            workCell = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            expect(workCell.getAttribute('aria-label')).toEqual('Saturday, December 2, 2017');
            expect(workCell.innerHTML).toEqual('<div class="e-date-header e-navigate">2</div>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sunday</span>');
            expect(schObj.element.querySelector('.e-work-cells .e-date-header').innerHTML).toEqual('Oct 1');
        });
    });

    describe('Resource group single level', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2018, 3, 1),
                currentView: 'Month', group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', OwnerId: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00', OwnerCss: 'e-nancy' },
                        { OwnerText: 'Steven', OwnerId: 2, OwnerGroupId: 2, OwnerColor: '#f8a398', OwnerCss: 'e-steven' },
                        { OwnerText: 'Michael', OwnerId: 3, OwnerGroupId: 1, OwnerColor: '#7499e1', OwnerCss: 'e-michael' }
                    ],
                    textField: 'OwnerText', idField: 'OwnerId', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', cssClassField: 'OwnerCss'
                }]
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment element', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toBeGreaterThan(0);
        });
        it('Checking resource grouping setmodel', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toBeGreaterThan(0);
                done();
            };
            schObj.group.resources = [];
            schObj.dataBind();
        });
    });

    describe('Multiple resource grouping rendering in mobile device', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                width: 300, height: '500px',
                selectedDate: new Date(2018, 3, 1),
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, workDays: [0, 1, 2, 3], Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, workDays: [0, 2, 3], Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, workDays: [0, 1, 2, 3, 4], Color: '#7499e1' }
                    ]
                }]
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('resource treeview testing', () => {
            expect(schObj.element.querySelectorAll('.e-resource-tree-popup').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item.e-has-child').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item:not(.e-has-child)').length).toEqual(3);
        });

        it('resource events checked for week view testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });

        it('navigation checking for month view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('work cells and resource events checked for month view testing', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(35);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });
    });

    describe('Resources with group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Month',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(3);
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
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Month',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(3);
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
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Month',
                selectedDate: new Date(2018, 3, 1),
                views: [
                    { option: 'Week' },
                    { option: 'Month', isSelected: true, resourceHeaderTemplate: '<p>${resourceData.text}</p>' }
                ],
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('template text', () => {
            expect(schObj.element.querySelector('.e-date-header-wrap .e-resource-cells').innerHTML).toBe('<p>ROOM 1</p>');
        });

        it('header rows count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(2);
        });

        it('resource cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(2);
        });

        it('date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(14);
        });

        it('template checking in week view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-header-wrap .e-resource-cells').innerHTML).
                    toBe('<div class="e-text-ellipsis">ROOM 1</div>');
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
    });

    describe('Resources with group by date', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'Month',
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
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(3);
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

    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '500px', height: '500px', currentView: 'Month', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(4);
            const blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(blockEvent.offsetWidth).toEqual(69);
            expect(blockEvent.offsetHeight).toBeGreaterThanOrEqual(57);
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetWidth).toEqual(66);
                expect(addedEvent.offsetHeight).toEqual(22);
                done();
            };
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30);
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
            startRevisedObj.value = new Date(2017, 9, 31);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(editedEvent.offsetWidth).toEqual(66);
                expect(editedEvent.offsetHeight).toEqual(22);
                done();
            };
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment') as HTMLElement, 'dblclick');
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30);
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
            startRevisedObj.value = new Date(2017, 9, 31);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31);
            endRevisedObj.dataBind();
            saveButton.click();
        });
        it('change through set properties', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(6);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
        it('checking block event with enableAdativeRows property', () => {
            const blockEventElement: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-block-appointment'));
            expect(blockEventElement.length).toEqual(4);
            const blockIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-block-indicator'));
            expect(blockIndicator.length).toEqual(7);
        });
    });

    describe('Multi level resource rendering in block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'Month',
                selectedDate: new Date(2017, 10, 1),
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
                expect(addedEvent.offsetWidth).toEqual(31);
                expect(addedEvent.offsetHeight).toEqual(22);
                done();
            };
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30);
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
            startRevisedObj.value = new Date(2017, 9, 31);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('resource edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement;
                expect(editedEvent.offsetWidth).toEqual(31);
                expect(editedEvent.offsetHeight).toEqual(22);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_22"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 9, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 9, 30);
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
            startRevisedObj.value = new Date(2017, 9, 31);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31);
            endRevisedObj.dataBind();
            saveButton.click();
        });
    });

    describe('Events rendering with rowAutoHeight property', () => {
        describe('default view', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const schOptions: ScheduleModel = {
                    height: '500px', selectedDate: new Date(2017, 10, 6),
                    rowAutoHeight: true, currentView: 'Month'
                };
                schObj = util.createSchedule(schOptions, testData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('elements in DOM', () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(11);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
            });
            it('add events', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(12);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                expect(schObj.eventsData.length).toEqual(7);
                const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                util.triggerMouseEvent(workCells[15], 'click');
                const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
            });
            it('row height update after delete a event', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(11);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                expect(schObj.eventsData.length).toEqual(8);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                util.triggerMouseEvent(eventElements[7], 'click');
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
                (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
            });
            it('change through set properties', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(6);
                    const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                    expect(eventWrapperList.length).toEqual(13);
                    expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(9);
                    done();
                };
                schObj.rowAutoHeight = false;
                schObj.dataBind();
            });
        });

        describe('Mobile view', () => {
            const uA: string = Browser.userAgent;
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const schOptions: ScheduleModel = {
                    height: '550px', selectedDate: new Date(2017, 10, 6),
                    rowAutoHeight: true, currentView: 'Month'
                };
                schObj = util.createSchedule(schOptions, testData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
                Browser.userAgent = uA;
            });

            it('elements in DOM', () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(11);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
            });
            it('change through set properties', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(9);
                    const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                    expect(eventWrapperList.length).toEqual(8);
                    expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(2);
                    done();
                };
                schObj.rowAutoHeight = false;
                schObj.dataBind();
            });
        });

        describe('RTL view', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const schOptions: ScheduleModel = {
                    height: '550px', selectedDate: new Date(2017, 10, 6), rowAutoHeight: true,
                    enableRtl: true, currentView: 'Month'
                };
                schObj = util.createSchedule(schOptions, testData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('elements in DOM', () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(11);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
            });
            it('add events', (done: DoneFn) => {
                schObj.dataBound = () => {
                    expect(schObj.eventsData.length).toEqual(8);
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(12);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                expect(schObj.eventsData.length).toEqual(7);
                const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                util.triggerMouseEvent(workCells[15], 'click');
                const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
            });
            it('row height update after delete a event', (done: DoneFn) => {
                schObj.dataBound = () => {
                    expect(schObj.eventsData.length).toEqual(7);
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(11);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                expect(schObj.eventsData.length).toEqual(8);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                util.triggerMouseEvent(eventElements[7], 'click');
                const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
                expect(eventPopup).toBeTruthy();
                (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
                (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
            });
            it('change through set properties', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(9);
                    const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                    expect(eventWrapperList.length).toEqual(8);
                    expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(2);
                    done();
                };
                schObj.rowAutoHeight = false;
                schObj.dataBind();
            });
        });
        describe('resource grouping appointment rendering', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const schOptions: ScheduleModel = {
                    height: '500px', selectedDate: new Date(2018, 3, 1),
                    rowAutoHeight: true, currentView: 'Month',
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
                schObj = util.createSchedule(schOptions, resourceData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });

            it('Checking appointment element', () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(10);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(10);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
            });

            it('Add event', (done: DoneFn) => {
                schObj.dataBound = () => {
                    expect(schObj.eventsData.length).toEqual(10);
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(15);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                util.triggerMouseEvent(workCell, 'click');
                util.triggerMouseEvent(workCell, 'dblclick');
                expect(schObj.eventsData.length).toEqual(9);
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const recObj: RecurrenceEditor = (dialogElement.querySelector('.e-recurrenceeditor') as EJ2Instance).
                    ej2_instances[0] as RecurrenceEditor;
                recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
                recObj.dataBind();
                const saveButton: HTMLInputElement = <HTMLInputElement>dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS);
                saveButton.click();
            });

            it('Delete event', (done: DoneFn) => {
                schObj.dataBound = () => {
                    expect(schObj.eventsData.length).toEqual(9);
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(14);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(0);
                    done();
                };
                const appElement: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_1"]') as HTMLElement;
                util.triggerMouseEvent(appElement, 'click');
                util.triggerMouseEvent(appElement, 'dblclick');
                expect(schObj.eventsData.length).toEqual(10);
                const quickDialog: Element = document.querySelector('.e-quick-dialog');
                const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
                const deleteButton: HTMLInputElement =
                    <HTMLInputElement>dialogElement.querySelector('.' + cls.DELETE_EVENT_CLASS);
                deleteButton.click();
                util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-delete'), 'click');
            });
            it('change through set properties', (done: DoneFn) => {
                schObj.dataBound = () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(12);
                    const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                    expect(eventWrapperList.length).toEqual(12);
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(2);
                    done();
                };
                schObj.rowAutoHeight = false;
                schObj.dataBind();
            });
        });
        describe('CR Issue EJ2- Getting Week numbers while changing firstdayofWeek', () => {
            let schObj: Schedule;
            beforeAll((done: DoneFn) => {
                const schOptions: ScheduleModel = {
                    selectedDate: new Date(2017, 10, 6),
                    currentView: 'Month',
                    showWeekNumber: true
                };
                schObj = util.createSchedule(schOptions, testData, done);
            });
            afterAll(() => {
                util.destroy(schObj);
            });
            it('Week number testing for when firstdayofWeek set to Sunday', () => {
                schObj.firstDayOfWeek = 0;
                expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('45');
            });
            it('Week number testing for when firstdayofWeek set to Monday', () => {
                schObj.firstDayOfWeek = 1;
                schObj.dataBind();
                expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('46');
            });
            it('Week number testing for when firstdayofWeek set to saturday', () => {
                schObj.firstDayOfWeek = 6;
                schObj.dataBind();
                expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('45');
            });
        });
    });

    describe('Getting Week numbers while changing weekRule property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                selectedDate: new Date(2020, 11, 29),
                currentView: 'Month',
                showWeekNumber: true
            };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Week number testing for when weekRule set to FirstDay', () => {
            schObj.weekRule = 'FirstDay';
            expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('50');
        });
        it('Week number testing for when weekRule set to FirstFourDayWeek', () => {
            schObj.weekRule = 'FirstFourDayWeek';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number')[4].innerHTML).toBe('53');
        });
        it('Week number testing for when weekRule set to FirstFullWeek', () => {
            schObj.weekRule = 'FirstFullWeek';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('49');
        });
    });

    describe('More indicator event rendering based on the provided template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const mt: string = '<div class="template-wrap" style="background:#007EE3;width:-webkit-fill-available;">' +
                '<div class="subject" style="background:#007EE3">${Subject}</div></div>';
            const scriptMonthEvent: HTMLScriptElement = document.createElement('script');
            scriptMonthEvent.type = 'text/x-template';
            scriptMonthEvent.id = 'month-event-template';
            scriptMonthEvent.appendChild(document.createTextNode(mt));
            document.getElementsByTagName('head')[0].appendChild(scriptMonthEvent);
            const viewCollection: ViewsModel[] = [{ option: 'Month', eventTemplate: '#month-event-template' }];
            const schOptions: ScheduleModel = {
                height: '900px',
                selectedDate: new Date(2017, 10, 5),
                currentView: 'Month',
                views: viewCollection
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            document.getElementById('month-event-template').remove();
        });
        it('Checking the template applied to the events or not', () => {
            const moreIndicator: HTMLElement = document.querySelector('.e-more-indicator');
            util.triggerMouseEvent(moreIndicator, 'click');
            const elementList: NodeListOf<Element> = document.querySelectorAll('.e-more-appointment-wrapper');
            let templateElement: string = elementList[0].children[0].innerHTML;
            expect(templateElement).toEqual('<div class="template-wrap" style="background:#007EE3;' +
                'width:-webkit-fill-available;"><div class="subject" style="background:#007EE3">Conference</div></div>');
            templateElement = elementList[0].children[6].innerHTML;
            expect(templateElement).toEqual('<div class="template-wrap" style="background:#007EE3;width:-webkit-fill-available;">'
                + '<div class="subject" style="background:#007EE3">Same Time</div></div>');
            const closeButton: HTMLElement = document.querySelector('.' + cls.MORE_EVENT_CLOSE_CLASS);
            util.triggerMouseEvent(closeButton, 'click');
        });
    });

    describe('CR Issue EJ2- Getting Week numbers while changing firstdayofWeek', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                selectedDate: new Date(2017, 10, 6),
                currentView: 'Month',
                showWeekNumber: true
            };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Week number testing for when firstdayofWeek set to Sunday', () => {
            schObj.firstDayOfWeek = 0;
            expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('45');
        });
        it('Week number testing for when firstdayofWeek set to Monday', () => {
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('46');
        });
        it('Week number testing for when firstdayofWeek set to saturday', () => {
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-week-number')[1].innerHTML).toBe('45');
        });
    });

    describe('Testing month view cell header template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px',
                cellHeaderTemplate: '<span>${date.toLocaleDateString()}</span>',
                selectedDate: new Date(2017, 10, 1),
                views: ['Month', 'MonthAgenda'],
                currentView: 'Month'
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking cell header template on month view', () => {
            const headerElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header'));
            expect(headerElements[0].innerHTML.toString()).toEqual('<span>10/29/2017</span>');
            expect(headerElements[6].innerHTML.toString()).toEqual('<span>11/4/2017</span>');
            expect(headerElements[17].innerHTML.toString()).toEqual('<span>11/15/2017</span>');
            expect(headerElements[26].innerHTML.toString()).toEqual('<span>11/24/2017</span>');
        });
        it('Checking cell header template on month agenda view', (done: DoneFn) => {
            schObj.dataBound = () => {
                const headerElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header'));
                expect(headerElements[0].innerHTML.toString()).toEqual('<span>10/29/2017</span>');
                expect(headerElements[6].innerHTML.toString()).toEqual('<span>11/4/2017</span>');
                expect(headerElements[12].innerHTML.toString()).toEqual('<span>11/10/2017</span>');
                expect(headerElements[24].innerHTML.toString()).toEqual('<span>11/22/2017</span>');
                done();
            };
            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.currentView = 'MonthAgenda';
            schObj.dataBind();
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
